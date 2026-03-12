import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

/**
 * GET /api/mailchimp/report?campaignId=xxx
 * Returns detailed report for a specific campaign.
 */
export async function GET(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    if (campaignId) {
      // Get specific campaign report
      const report = await mc.reports.getCampaignReport(campaignId);
      return NextResponse.json({
        campaignId: report.id,
        subject: report.subject_line,
        sendTime: report.send_time,
        emailsSent: report.emails_sent,
        opens: {
          total: report.opens?.opens_total,
          unique: report.opens?.unique_opens,
          rate: report.opens?.open_rate,
          lastOpened: report.opens?.last_open,
        },
        clicks: {
          total: report.clicks?.clicks_total,
          unique: report.clicks?.unique_clicks,
          rate: report.clicks?.click_rate,
          lastClicked: report.clicks?.last_click,
        },
        bounces: {
          hard: report.bounces?.hard_bounces,
          soft: report.bounces?.soft_bounces,
          syntax: report.bounces?.syntax_errors,
        },
        unsubscribed: report.unsubscribed,
        abuseReports: report.abuse_reports,
        forwardCount: report.forwards?.forwards_count,
        listStats: report.list_stats,
      });
    }

    // Get all recent campaign reports
    const reportsResponse = await mc.reports.getAllCampaignReports({
      count: 20,
      sort_field: "send_time",
      sort_dir: "DESC",
    });

    const reports = (reportsResponse?.reports || []).map((r: Record<string, unknown>) => ({
      campaignId: r.id,
      subject: r.subject_line,
      sendTime: r.send_time,
      emailsSent: r.emails_sent,
      openRate: (r.opens as Record<string, unknown>)?.open_rate,
      uniqueOpens: (r.opens as Record<string, unknown>)?.unique_opens,
      clickRate: (r.clicks as Record<string, unknown>)?.click_rate,
      unsubscribed: r.unsubscribed,
      bounces: ((r.bounces as Record<string, unknown>)?.hard_bounces as number || 0) +
               ((r.bounces as Record<string, unknown>)?.soft_bounces as number || 0),
    }));

    return NextResponse.json({ reports, count: reports.length });
  } catch (err) {
    console.error("Report error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get report" },
      { status: 500 }
    );
  }
}
