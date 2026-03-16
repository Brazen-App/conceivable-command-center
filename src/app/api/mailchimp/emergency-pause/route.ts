import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/mailchimp/emergency-pause
 *
 * EMERGENCY: Pauses ALL scheduled campaigns in Mailchimp.
 * This prevents any more accidental full-list sends.
 *
 * Body: { confirmed: true }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.confirmed) {
    return NextResponse.json({
      error: "Include { confirmed: true } to pause all scheduled campaigns.",
      warning: "This will PAUSE every scheduled campaign in Mailchimp. They can be resumed later.",
    }, { status: 400 });
  }

  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Get all scheduled campaigns
    const response = await mc.campaigns.list({
      count: 100,
      status: "schedule",
      sort_field: "send_time",
      sort_dir: "ASC",
    });

    const scheduled = response?.campaigns || [];
    console.log(`[EMERGENCY-PAUSE] Found ${scheduled.length} scheduled campaigns to pause`);

    const results: Array<{ id: string; subject: string; status: string; error?: string }> = [];

    for (const campaign of scheduled) {
      try {
        // Unschedule the campaign (changes status from "schedule" to "paused")
        await mc.campaigns.unschedule(campaign.id);
        console.log(`[EMERGENCY-PAUSE] Paused: "${campaign.settings?.subject_line}" (${campaign.id})`);
        results.push({
          id: campaign.id,
          subject: campaign.settings?.subject_line || "Untitled",
          status: "paused",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[EMERGENCY-PAUSE] Failed to pause ${campaign.id}:`, msg);
        results.push({
          id: campaign.id,
          subject: campaign.settings?.subject_line || "Untitled",
          status: "failed",
          error: msg,
        });
      }

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 200));
    }

    const paused = results.filter((r) => r.status === "paused").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({
      ok: true,
      message: `EMERGENCY PAUSE COMPLETE: ${paused} campaigns paused, ${failed} failed.`,
      paused,
      failed,
      results,
    });
  } catch (err) {
    console.error("[EMERGENCY-PAUSE] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to pause campaigns" },
      { status: 500 }
    );
  }
}

/**
 * GET — shows status of scheduled campaigns
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const response = await mc.campaigns.list({
      count: 100,
      status: "schedule",
      sort_field: "send_time",
      sort_dir: "ASC",
    });

    const scheduled = (response?.campaigns || []).map((c: { id: string; settings?: { subject_line?: string }; send_time?: string; emails_sent?: number }) => ({
      id: c.id,
      subject: c.settings?.subject_line || "Untitled",
      sendTime: c.send_time,
      emailsSent: c.emails_sent || 0,
    }));

    return NextResponse.json({
      scheduledCount: scheduled.length,
      warning: scheduled.length > 0
        ? `${scheduled.length} campaigns are SCHEDULED and WILL auto-send. POST with { confirmed: true } to pause all.`
        : "No scheduled campaigns. All clear.",
      campaigns: scheduled,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
