import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIST_ID = "3c920d5bed";

// Track in-flight sends to prevent race condition duplicates
const inFlightSends = new Set<string>();

/**
 * Convert plain text email body to properly formatted HTML.
 * Preserves paragraph breaks, line breaks, and adds clean styling.
 */
function textToHtml(text: string): string {
  const paragraphs = text.split(/\n\n+/);

  const htmlParagraphs = paragraphs.map((para) => {
    const withBreaks = para
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("<br>\n");
    return `<p style="margin: 0 0 16px 0; line-height: 1.6;">${withBreaks}</p>`;
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #2A2828;
      background-color: #F9F7F0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 24px;
      background-color: #ffffff;
    }
    p {
      margin: 0 0 16px 0;
      line-height: 1.6;
    }
    a {
      color: #5A6FFF;
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlParagraphs.join("\n    ")}
  </div>
</body>
</html>`;
}

/**
 * POST /api/mailchimp/send-warmup
 * Creates a segment-targeted campaign and sends it immediately.
 * Body: { emailId, tierSize: 3000|5000|7000|10000|15000|25000|29000, confirmed: true }
 *
 * SAFETY: Will NEVER send to full list unless tierSize >= 29000.
 * Segment MUST be created successfully or the send is ABORTED.
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  // Parse body once at the top
  const body = await req.json();
  const { emailId, tierSize = 3000, confirmed = false } = body;

  try {
    // SAFETY CHECK: require explicit confirmation
    if (!confirmed) {
      return NextResponse.json({
        error: "Safety check: you must include { confirmed: true } to send. This sends REAL emails to REAL subscribers.",
        hint: "Include confirmed: true in your request body after reviewing the emailId and tierSize.",
      }, { status: 400 });
    }

    if (!emailId) {
      return NextResponse.json({ error: "emailId is required" }, { status: 400 });
    }

    // Get the email from DB
    const email = await prisma.email.findUnique({ where: { id: emailId } });
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    if (email.status === "published") {
      return NextResponse.json({
        error: `Email "${email.subject}" has already been sent (status: published). Cannot send again.`,
      }, { status: 400 });
    }

    // DEDUPLICATION: Prevent race condition from rapid clicks / multiple requests
    if (inFlightSends.has(emailId)) {
      return NextResponse.json({
        error: `Email "${email.subject}" is already being sent right now. Please wait.`,
      }, { status: 409 });
    }
    inFlightSends.add(emailId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // --- SEGMENT TARGETING ---
    let segmentOpts: Record<string, unknown> | undefined;
    let actualSegmentSize: number | null = null;

    if (tierSize < 29000) {
      const segmentName = `Warmup - Top ${tierSize} (${new Date().toISOString().split("T")[0]})`;

      let minRatingThreshold: number;
      if (tierSize <= 3000) minRatingThreshold = 4;
      else if (tierSize <= 5000) minRatingThreshold = 3;
      else if (tierSize <= 7000) minRatingThreshold = 3;
      else if (tierSize <= 10000) minRatingThreshold = 2;
      else if (tierSize <= 15000) minRatingThreshold = 1;
      else minRatingThreshold = 0;

      let segment;
      try {
        segment = await mc.lists.createSegment(LIST_ID, {
          name: segmentName,
          options: {
            match: "all",
            conditions: [
              {
                condition_type: "MemberRating",
                field: "member_rating",
                op: "greater",
                value: String(minRatingThreshold),
              },
            ],
          },
        });
      } catch (segErr) {
        const errMsg = segErr instanceof Error ? segErr.message : String(segErr);
        console.error("SEGMENT CREATION FAILED — ABORTING SEND:", errMsg);
        inFlightSends.delete(emailId);
        return NextResponse.json({
          error: `SEND ABORTED: Could not create segment for ${tierSize} subscribers. Refusing to send to full list. Error: ${errMsg}`,
          safety: "This is a safety measure. Fix the segment issue before retrying.",
        }, { status: 500 });
      }

      if (!segment || !segment.id) {
        inFlightSends.delete(emailId);
        return NextResponse.json({
          error: "SEND ABORTED: Segment was created but returned no ID. Refusing to send to full list.",
        }, { status: 500 });
      }

      actualSegmentSize = segment.member_count ?? null;
      segmentOpts = { saved_segment_id: segment.id };

      console.log(`Segment created: "${segmentName}" — ${actualSegmentSize} members (rating > ${minRatingThreshold})`);

      if (actualSegmentSize && actualSegmentSize > tierSize * 2) {
        inFlightSends.delete(emailId);
        return NextResponse.json({
          error: `SEND ABORTED: Segment has ${actualSegmentSize} members but tier target is ${tierSize}. That's more than 2x the target. Review segment conditions.`,
          segmentId: segment.id,
          segmentSize: actualSegmentSize,
        }, { status: 400 });
      }
    }

    // Create the campaign
    const campaignConfig: Record<string, unknown> = {
      type: "regular",
      recipients: segmentOpts
        ? { list_id: LIST_ID, segment_opts: segmentOpts }
        : { list_id: LIST_ID },
      settings: {
        subject_line: email.subject,
        preview_text: email.preview || "",
        title: `Warmup — ${email.subject}`,
        from_name: "Kirsten at Conceivable",
        reply_to: "kirsten@conceivable.com",
      },
    };

    const campaign = await mc.campaigns.create(campaignConfig);
    const campaignId = campaign.id;

    // Convert plain text to properly formatted HTML with styling
    const htmlBody = textToHtml(email.body);
    await mc.campaigns.setContent(campaignId, {
      html: htmlBody,
    });

    console.log(`Campaign ${campaignId} ready. Segment: ${segmentOpts ? "YES" : "FULL LIST"}. Sending...`);

    // Send immediately
    await mc.campaigns.send(campaignId);

    // Update DB
    await prisma.email.update({
      where: { id: emailId },
      data: {
        status: "published",
        publishedAt: new Date().toISOString(),
        mailchimpId: campaignId,
      },
    });

    // Clear in-flight lock
    inFlightSends.delete(emailId);

    return NextResponse.json({
      ok: true,
      campaignId,
      emailId,
      subject: email.subject,
      tierSize,
      actualSegmentSize,
      segmentUsed: !!segmentOpts,
      message: segmentOpts
        ? `Campaign "${email.subject}" sent to segment of ~${actualSegmentSize ?? tierSize} subscribers.`
        : `Campaign "${email.subject}" sent to full list (~29,000 subscribers).`,
    });
  } catch (err) {
    // Always clear in-flight lock on error
    if (emailId) inFlightSends.delete(emailId);
    console.error("Send warmup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send warmup email" },
      { status: 500 }
    );
  }
}
