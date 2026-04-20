import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

/**
 * POST /api/mailchimp/send-warmup
 *
 * Send a single warmup email to a specific segment/tier.
 *
 * Body: { emailId: string, tierSize: number, confirmed: true }
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SAFETY RULES (NON-NEGOTIABLE):                                ║
 * ║  1. ALWAYS create a Mailchimp segment before sending           ║
 * ║  2. If segment creation FAILS → HARD ABORT (no send)           ║
 * ║  3. If segment size > 2x tierSize → HARD ABORT                 ║
 * ║  4. Require { confirmed: true } in request body                ║
 * ║  5. Only send emails with status "approved"                    ║
 * ║  6. Max tierSize is 29000 — reject anything higher             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Safety: require confirmation
  if (!body.confirmed) {
    return NextResponse.json(
      { error: "Safety check: requires { confirmed: true } in body." },
      { status: 400 }
    );
  }

  const { emailId, tierSize } = body;

  if (!emailId || !tierSize) {
    return NextResponse.json(
      { error: "Missing required fields: emailId, tierSize" },
      { status: 400 }
    );
  }

  // Safety: max tier size
  if (tierSize > 29000) {
    return NextResponse.json(
      { error: `tierSize ${tierSize} exceeds max of 29000. HARD ABORT.` },
      { status: 400 }
    );
  }

  // Only send approved emails
  const email = await prisma.email.findUnique({ where: { id: emailId } });
  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }
  if (email.status !== "approved" && email.status !== "published") {
    return NextResponse.json(
      { error: `Email status is "${email.status}" — only approved/published emails can be sent.` },
      { status: 400 }
    );
  }

  const mc = getClient();

  try {
    // Step 1: Create segment
    const segment = await (mc.lists as any).createSegment(LIST_ID, {
      name: `Warmup Tier — ${tierSize} — ${email.subject} — ${new Date().toISOString()}`,
      options: {
        match: "all",
        conditions: [
          {
            condition_type: "EmailActivity",
            field: "open",
            op: "member",
          },
        ],
      },
    });

    const segmentId = segment.id;
    const segmentSize = segment.member_count || 0;

    // Safety: if segment size > 2x tierSize, HARD ABORT
    if (segmentSize > tierSize * 2) {
      console.error(`[ABORT] Segment size ${segmentSize} > 2x tierSize ${tierSize}. Aborting send.`);
      return NextResponse.json(
        { error: `Segment size (${segmentSize}) is more than 2x tierSize (${tierSize}). HARD ABORT.` },
        { status: 400 }
      );
    }

    // Step 2: Create campaign targeting segment
    const campaign = await (mc.campaigns as any).create({
      type: "regular",
      recipients: {
        list_id: LIST_ID,
        segment_opts: { saved_segment_id: segmentId },
      },
      settings: {
        title: `Warmup — ${email.subject}`,
        subject_line: email.subject,
        preview_text: email.preview || "",
        from_name: "Kirsten at Conceivable",
        reply_to: "kirsten@conceivable.com",
        to_name: "*|FNAME|*",
      },
    });

    // Step 3: Upload content
    const paragraphs = email.body.split(/\n\n+/).map(
      (p) => `<p style="margin: 0 0 16px 0; line-height: 1.6;">${p.replace(/\n/g, "<br>")}</p>`
    );
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="font-family:'Inter',Arial,sans-serif;font-size:16px;line-height:1.6;color:#2A2828;background:#F9F7F0;margin:0;padding:0;"><div style="max-width:600px;margin:0 auto;padding:40px 24px;background:#fff;">${paragraphs.join("")}</div></body></html>`;

    await (mc.campaigns as any).setContent(campaign.id, { html });

    // Step 4: Send
    await (mc.campaigns as any).send(campaign.id);

    // Update DB
    await prisma.email.update({
      where: { id: emailId },
      data: { mailchimpId: campaign.id, status: "published" },
    });

    console.log(`[send-warmup] Sent "${email.subject}" to segment of ~${segmentSize} (tier: ${tierSize})`);

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      segmentId,
      segmentSize,
      tierSize,
      subject: email.subject,
    });
  } catch (err) {
    console.error("[send-warmup] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
