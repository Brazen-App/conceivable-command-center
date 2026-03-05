import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mailchimp/warmup
 * Returns warmup schedule status and progress.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    // Get campaigns with warmup tag
    const campaignsResponse = await mc.campaigns.list({
      count: 50,
      sort_field: "send_time",
      sort_dir: "DESC",
    });

    const warmupCampaigns = (campaignsResponse?.campaigns || [])
      .filter((c: Record<string, unknown>) => {
        const title = (c.settings as Record<string, unknown>)?.title as string || "";
        return title.includes("Warmup") || title.includes("warmup");
      })
      .map((c: Record<string, unknown>) => ({
        id: c.id,
        title: (c.settings as Record<string, unknown>)?.title,
        subject: (c.settings as Record<string, unknown>)?.subject_line,
        status: c.status,
        sendTime: c.send_time,
        emailsSent: c.emails_sent,
      }));

    // Get approved emails ready for warmup
    const approvedEmails = await prisma.email.findMany({
      where: { status: "approved", complianceStatus: "approved" },
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
      select: { id: true, subject: true, week: true, sequence: true, phase: true },
    });

    return NextResponse.json({
      warmupCampaigns,
      approvedEmailsReady: approvedEmails,
      schedule: {
        phase1: { name: "Hot List (30-day engaged)", targetSize: 3000, days: "1-3" },
        phase2: { name: "Warm List (90-day engaged)", targetSize: 7000, days: "4-7" },
        phase3: { name: "Cold List (4 batches of 5K)", targetSize: 20000, days: "8-14" },
      },
    });
  } catch (err) {
    console.error("GET warmup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch warmup status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mailchimp/warmup
 * Schedules a warmup send.
 * Body: { emailId, segmentId, sendTime: "immediate" | "optimal" | string (ISO date) }
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { emailId, segmentId, sendTime = "optimal", phase = 1 } = body;

    if (!emailId) {
      return NextResponse.json({ error: "emailId is required" }, { status: 400 });
    }

    // Get the email from DB
    const email = await prisma.email.findUnique({ where: { id: emailId } });
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    if (email.status !== "approved") {
      return NextResponse.json(
        { error: "Email must be approved before scheduling" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    // Get list ID
    const listsResponse = await mc.lists.getAllLists({ count: 1 });
    const listId = listsResponse?.lists?.[0]?.id;
    if (!listId) {
      return NextResponse.json({ error: "No Mailchimp list found" }, { status: 404 });
    }

    // Create campaign with segment targeting
    const campaignData: Record<string, unknown> = {
      type: "regular",
      recipients: segmentId
        ? { list_id: listId, segment_opts: { saved_segment_id: segmentId } }
        : { list_id: listId },
      settings: {
        subject_line: email.subject,
        preview_text: email.preview,
        title: `Warmup Phase ${phase} — ${email.subject}`,
        from_name: "Kirsten at Conceivable",
        reply_to: "kirsten@conceivable.com",
      },
    };

    const campaign = await mc.campaigns.create(campaignData);
    const campaignId = campaign.id;

    // Set campaign content
    await mc.campaigns.setContent(campaignId, {
      plain_text: email.body,
    });

    // Schedule or send
    if (sendTime === "immediate") {
      await mc.campaigns.send(campaignId);
    } else if (sendTime === "optimal") {
      // Schedule for next appropriate time (Tuesday 10 AM EST)
      const now = new Date();
      const nextTuesday = new Date(now);
      const daysUntilTuesday = (2 - now.getDay() + 7) % 7 || 7;
      nextTuesday.setDate(now.getDate() + daysUntilTuesday);
      nextTuesday.setHours(15, 0, 0, 0); // 10 AM EST = 15:00 UTC
      await mc.campaigns.schedule(campaignId, {
        schedule_time: nextTuesday.toISOString(),
      });
    } else {
      // Custom time
      await mc.campaigns.schedule(campaignId, {
        schedule_time: new Date(sendTime).toISOString(),
      });
    }

    // Update DB
    await prisma.email.update({
      where: { id: emailId },
      data: {
        status: "published",
        publishedAt: new Date().toISOString(),
        mailchimpId: campaignId,
      },
    });

    return NextResponse.json({
      ok: true,
      campaignId,
      emailId,
      phase,
      segmentId,
      status: sendTime === "immediate" ? "sent" : "scheduled",
    });
  } catch (err) {
    console.error("POST warmup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to schedule warmup" },
      { status: 500 }
    );
  }
}
