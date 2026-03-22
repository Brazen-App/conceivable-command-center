import { NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

// Fallback mock data when env vars are missing
const MOCK_DATA = {
  isMock: true,
  listStats: {
    totalSubscribers: 29000,
  },
  campaignStats: {
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    deliverability: 0,
  },
  automationStats: {
    total: 0,
    active: 0,
    paused: 0,
  },
  period: "last_30_days",
};

export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX) {
    return NextResponse.json(MOCK_DATA);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Fetch list stats for subscriber count
    const listsResponse = await mc.lists.getAllLists({ count: 100 });
    const lists =
      (listsResponse as { lists?: Array<{ stats?: { member_count?: number } }> })
        .lists ?? [];
    const totalSubscribers = lists.reduce(
      (sum: number, list: { stats?: { member_count?: number } }) =>
        sum + (list.stats?.member_count ?? 0),
      0
    );

    // Fetch campaign reports — filter to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sinceDate = thirtyDaysAgo.toISOString().split("T")[0];

    const reportsResponse = await mc.reports.getAllCampaignReports({
      count: 100,
      since_send_time: `${sinceDate}T00:00:00Z`,
      sort_field: "send_time",
      sort_dir: "DESC",
    });

    const reports =
      (
        reportsResponse as {
          reports?: Array<{
            id?: string;
            campaign_title?: string;
            subject_line?: string;
            send_time?: string;
            opens?: { open_rate?: number; unique_opens?: number };
            clicks?: { click_rate?: number; unique_clicks?: number };
            unsubscribed?: number;
            emails_sent?: number;
            bounces?: { hard_bounces?: number; soft_bounces?: number };
          }>;
        }
      ).reports ?? [];

    let openRate = 0;
    let clickRate = 0;
    let totalUnsubscribed = 0;
    let totalSent = 0;
    let totalBounces = 0;

    // Campaign-level details for the dashboard
    const campaignDetails = reports.map((r) => ({
      id: r.id,
      title: r.campaign_title,
      subject: r.subject_line,
      sendTime: r.send_time,
      emailsSent: r.emails_sent ?? 0,
      openRate: r.opens?.open_rate
        ? Math.round(r.opens.open_rate * 1000) / 10
        : 0,
      uniqueOpens: r.opens?.unique_opens ?? 0,
      clickRate: r.clicks?.click_rate
        ? Math.round(r.clicks.click_rate * 1000) / 10
        : 0,
      uniqueClicks: r.clicks?.unique_clicks ?? 0,
      unsubscribed: r.unsubscribed ?? 0,
    }));

    if (reports.length > 0) {
      openRate =
        reports.reduce((sum: number, r) => sum + (r.opens?.open_rate ?? 0), 0) /
        reports.length;
      clickRate =
        reports.reduce(
          (sum: number, r) => sum + (r.clicks?.click_rate ?? 0),
          0
        ) / reports.length;
      totalUnsubscribed = reports.reduce(
        (sum: number, r) => sum + (r.unsubscribed ?? 0),
        0
      );
      totalSent = reports.reduce(
        (sum: number, r) => sum + (r.emails_sent ?? 0),
        0
      );
      totalBounces = reports.reduce(
        (sum: number, r) =>
          sum +
          (r.bounces?.hard_bounces ?? 0) +
          (r.bounces?.soft_bounces ?? 0),
        0
      );
    }

    const unsubscribeRate =
      totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0;
    const deliverability =
      totalSent > 0 ? ((totalSent - totalBounces) / totalSent) * 100 : 0;

    // Fetch automation status summary
    let automationStats = { total: 0, active: 0, paused: 0 };
    try {
      const autoResponse = await mc.automations.list({ count: 100 });
      const autos = autoResponse?.automations || [];
      automationStats = {
        total: autos.length,
        active: autos.filter(
          (a: { status: string }) => a.status === "sending"
        ).length,
        paused: autos.filter(
          (a: { status: string }) => a.status === "paused"
        ).length,
      };
    } catch {
      // Automations may not be accessible
    }

    return NextResponse.json({
      isMock: false,
      period: "last_30_days",
      listStats: {
        totalSubscribers,
      },
      campaignStats: {
        openRate: Math.round(openRate * 1000) / 10,
        clickRate: Math.round(clickRate * 1000) / 10,
        unsubscribeRate: Math.round(unsubscribeRate * 10) / 10,
        deliverability: Math.round(deliverability * 10) / 10,
        totalSent,
        campaignCount: reports.length,
      },
      campaignDetails,
      automationStats,
    });
  } catch (err) {
    console.error("Mailchimp stats API error:", err);
    return NextResponse.json({
      ...MOCK_DATA,
      error: err instanceof Error ? err.message : "Mailchimp API error",
    });
  }
}
