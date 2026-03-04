import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getClient() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) return null;
  const creds = JSON.parse(json);
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  });
}

const PROPERTY = `properties/${process.env.GA4_PROPERTY_ID ?? "375867523"}`;

/* ── GET /api/analytics/email-roi — Email campaign → revenue attribution ── */
export async function GET() {
  const client = getClient();

  if (!client) {
    return NextResponse.json({
      connected: false,
      demo: {
        emailTraffic: {
          sessions: 1240,
          users: 890,
          conversions: 47,
          revenue: 4230,
          bounceRate: 0.32,
        },
        campaigns: [
          { campaign: "launch-sequence-week1", sessions: 320, conversions: 12, revenue: 1080 },
          { campaign: "abandoned-cart-flow", sessions: 210, conversions: 18, revenue: 1620 },
          { campaign: "post-purchase-upsell", sessions: 180, conversions: 8, revenue: 720 },
          { campaign: "weekly-newsletter", sessions: 530, conversions: 9, revenue: 810 },
        ],
        dailyTrend: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
          sessions: Math.floor(20 + Math.random() * 40),
          conversions: Math.floor(Math.random() * 4),
          revenue: Math.floor(Math.random() * 300),
        })),
      },
    });
  }

  try {
    const [emailOverview, emailCampaigns, emailDaily] = await Promise.all([
      // Overall email channel performance
      client.runReport({
        property: PROPERTY,
        dateRanges: [
          { startDate: "30daysAgo", endDate: "today" },
          { startDate: "60daysAgo", endDate: "31daysAgo" },
        ],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { matchType: "EXACT", value: "Email", caseSensitive: false },
          },
        },
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "conversions" },
          { name: "totalRevenue" },
          { name: "bounceRate" },
        ],
      }),

      // Breakdown by campaign (utm_campaign)
      client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionCampaignName" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { matchType: "EXACT", value: "Email", caseSensitive: false },
          },
        },
        metrics: [
          { name: "sessions" },
          { name: "conversions" },
          { name: "totalRevenue" },
        ],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 15,
      }),

      // Daily email traffic trend (last 30 days)
      client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { matchType: "EXACT", value: "Email", caseSensitive: false },
          },
        },
        metrics: [
          { name: "sessions" },
          { name: "conversions" },
          { name: "totalRevenue" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
      }),
    ]);

    const row = emailOverview[0].rows?.[0];
    const prevRow = emailOverview[0].rows?.[1];

    const emailTraffic = {
      sessions: { current: parseInt(row?.metricValues?.[0]?.value ?? "0"), previous: parseInt(prevRow?.metricValues?.[0]?.value ?? "0") },
      users: { current: parseInt(row?.metricValues?.[1]?.value ?? "0"), previous: parseInt(prevRow?.metricValues?.[1]?.value ?? "0") },
      conversions: { current: parseInt(row?.metricValues?.[2]?.value ?? "0"), previous: parseInt(prevRow?.metricValues?.[2]?.value ?? "0") },
      revenue: { current: parseFloat(row?.metricValues?.[3]?.value ?? "0"), previous: parseFloat(prevRow?.metricValues?.[3]?.value ?? "0") },
      bounceRate: { current: parseFloat(row?.metricValues?.[4]?.value ?? "0"), previous: parseFloat(prevRow?.metricValues?.[4]?.value ?? "0") },
    };

    const campaigns = (emailCampaigns[0].rows ?? []).map((r) => ({
      campaign: r.dimensionValues?.[0]?.value ?? "(not set)",
      sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
      conversions: parseInt(r.metricValues?.[1]?.value ?? "0"),
      revenue: parseFloat(r.metricValues?.[2]?.value ?? "0"),
    }));

    const dailyTrend = (emailDaily[0].rows ?? []).map((r) => {
      const raw = r.dimensionValues?.[0]?.value ?? "";
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return {
        date,
        sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
        conversions: parseInt(r.metricValues?.[1]?.value ?? "0"),
        revenue: parseFloat(r.metricValues?.[2]?.value ?? "0"),
      };
    });

    return NextResponse.json({
      connected: true,
      lastUpdated: new Date().toISOString(),
      emailTraffic,
      campaigns,
      dailyTrend,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ connected: false, error: message }, { status: 500 });
  }
}
