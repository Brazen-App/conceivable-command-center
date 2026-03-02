import { NextResponse } from "next/server";
import mailchimp from "@/lib/mailchimp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mc = mailchimp as any;

// Fallback mock data when env vars are missing
const MOCK_DATA = {
  isMock: true,
  listStats: {
    totalSubscribers: 29000,
  },
  campaignStats: {
    openRate: 34.2,
    clickRate: 4.1,
    unsubscribeRate: 0.3,
    deliverability: 97.8,
  },
};

export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX) {
    return NextResponse.json(MOCK_DATA);
  }

  try {
    // Fetch list stats for subscriber count
    const listsResponse = await mc.lists.getAllLists({ count: 100 });
    const lists = (listsResponse as { lists?: Array<{ stats?: { member_count?: number } }> }).lists ?? [];
    const totalSubscribers = lists.reduce(
      (sum: number, list: { stats?: { member_count?: number } }) =>
        sum + (list.stats?.member_count ?? 0),
      0
    );

    // Fetch campaign reports for performance metrics
    const reportsResponse = await mc.reports.getAllCampaignReports({ count: 100 });
    const reports = (reportsResponse as { reports?: Array<{
      opens?: { open_rate?: number };
      clicks?: { click_rate?: number };
      unsubscribed?: number;
      emails_sent?: number;
      bounces?: { hard_bounces?: number; soft_bounces?: number };
    }> }).reports ?? [];

    let openRate = 0;
    let clickRate = 0;
    let totalUnsubscribed = 0;
    let totalSent = 0;
    let totalBounces = 0;

    if (reports.length > 0) {
      openRate =
        reports.reduce((sum: number, r) => sum + (r.opens?.open_rate ?? 0), 0) /
        reports.length;
      clickRate =
        reports.reduce((sum: number, r) => sum + (r.clicks?.click_rate ?? 0), 0) /
        reports.length;
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
          sum + (r.bounces?.hard_bounces ?? 0) + (r.bounces?.soft_bounces ?? 0),
        0
      );
    }

    const unsubscribeRate =
      totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0;
    const deliverability =
      totalSent > 0 ? ((totalSent - totalBounces) / totalSent) * 100 : 0;

    return NextResponse.json({
      isMock: false,
      listStats: {
        totalSubscribers,
      },
      campaignStats: {
        openRate: Math.round(openRate * 10) / 10,
        clickRate: Math.round(clickRate * 10) / 10,
        unsubscribeRate: Math.round(unsubscribeRate * 10) / 10,
        deliverability: Math.round(deliverability * 10) / 10,
      },
    });
  } catch (err) {
    console.error("Mailchimp API error:", err);
    return NextResponse.json({
      ...MOCK_DATA,
      error: err instanceof Error ? err.message : "Mailchimp API error",
    });
  }
}
