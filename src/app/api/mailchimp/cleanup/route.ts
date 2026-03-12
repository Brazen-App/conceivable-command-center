import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

/**
 * GET /api/mailchimp/cleanup
 * Lists all campaigns to find duplicates.
 *
 * POST /api/mailchimp/cleanup
 * Deletes draft/paused duplicate campaigns.
 * Body: { confirmed: true, campaignIds: string[] }
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
      sort_field: "send_time",
      sort_dir: "DESC",
    });

    const campaigns = (response?.campaigns || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      title: (c.settings as Record<string, unknown>)?.title,
      subject: (c.settings as Record<string, unknown>)?.subject_line,
      status: c.status,
      sendTime: c.send_time,
      emailsSent: c.emails_sent,
      createTime: c.create_time,
    }));

    // Find duplicates (same subject, multiple campaigns)
    const subjectCounts: Record<string, typeof campaigns> = {};
    for (const c of campaigns) {
      const subj = c.subject || "unknown";
      if (!subjectCounts[subj]) subjectCounts[subj] = [];
      subjectCounts[subj].push(c);
    }

    const duplicates = Object.entries(subjectCounts)
      .filter(([, group]) => group.length > 1)
      .map(([subject, group]) => ({
        subject,
        count: group.length,
        campaigns: group,
        deletable: group.filter((c: { status: string }) => c.status === "save" || c.status === "paused"),
      }));

    return NextResponse.json({
      totalCampaigns: campaigns.length,
      allCampaigns: campaigns,
      duplicateGroups: duplicates,
      deletableDrafts: duplicates.flatMap((d) => d.deletable),
    });
  } catch (err) {
    console.error("Cleanup list error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to list campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { confirmed, campaignIds } = body;

    if (!confirmed) {
      return NextResponse.json({
        error: "Include { confirmed: true, campaignIds: [...] } to delete campaigns.",
      }, { status: 400 });
    }

    if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json({ error: "campaignIds array is required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const results = [];

    for (const id of campaignIds) {
      try {
        await mc.campaigns.remove(id);
        results.push({ id, deleted: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ id, deleted: false, error: msg });
      }
    }

    return NextResponse.json({
      ok: true,
      results,
      deleted: results.filter((r) => r.deleted).length,
      failed: results.filter((r) => !r.deleted).length,
    });
  } catch (err) {
    console.error("Cleanup delete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cleanup failed" },
      { status: 500 }
    );
  }
}
