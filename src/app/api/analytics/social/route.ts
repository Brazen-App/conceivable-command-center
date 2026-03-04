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

/* ── GET /api/analytics/social — Social media traffic & conversions ── */
export async function GET() {
  const client = getClient();

  if (!client) {
    return NextResponse.json({
      connected: false,
      demo: {
        overview: {
          sessions: 2100,
          users: 1680,
          conversions: 23,
          bounceRate: 0.45,
        },
        platforms: [
          { platform: "linkedin", sessions: 890, users: 720, conversions: 14, revenue: 1260, topContent: "/blog/con-score-explained" },
          { platform: "tiktok", sessions: 640, users: 580, conversions: 5, revenue: 450, topContent: "/fertility-quiz" },
          { platform: "instagram", sessions: 310, users: 260, conversions: 3, revenue: 270, topContent: "/" },
          { platform: "facebook", sessions: 180, users: 150, conversions: 1, revenue: 90, topContent: "/about" },
          { platform: "twitter", sessions: 80, users: 70, conversions: 0, revenue: 0, topContent: "/blog" },
        ],
        dailyTrend: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
          sessions: Math.floor(40 + Math.random() * 60),
          conversions: Math.floor(Math.random() * 3),
        })),
      },
    });
  }

  try {
    const [socialOverview, socialPlatforms, socialDaily, socialLanding] =
      await Promise.all([
        // Overall social traffic
        client.runReport({
          property: PROPERTY,
          dateRanges: [
            { startDate: "30daysAgo", endDate: "today" },
            { startDate: "60daysAgo", endDate: "31daysAgo" },
          ],
          dimensionFilter: {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              inListFilter: {
                values: ["Organic Social", "Paid Social"],
              },
            },
          },
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "conversions" },
            { name: "bounceRate" },
            { name: "totalRevenue" },
          ],
        }),

        // By platform (source)
        client.runReport({
          property: PROPERTY,
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }],
          dimensionFilter: {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              inListFilter: {
                values: ["Organic Social", "Paid Social"],
              },
            },
          },
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "conversions" },
            { name: "totalRevenue" },
          ],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),

        // Daily social traffic trend
        client.runReport({
          property: PROPERTY,
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          dimensionFilter: {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              inListFilter: {
                values: ["Organic Social", "Paid Social"],
              },
            },
          },
          metrics: [
            { name: "sessions" },
            { name: "conversions" },
          ],
          orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
        }),

        // Top landing pages from social
        client.runReport({
          property: PROPERTY,
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionSource" }, { name: "landingPagePlusQueryString" }],
          dimensionFilter: {
            filter: {
              fieldName: "sessionDefaultChannelGroup",
              inListFilter: {
                values: ["Organic Social", "Paid Social"],
              },
            },
          },
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),
      ]);

    const cur = socialOverview[0].rows?.[0]?.metricValues ?? [];
    const prev = socialOverview[0].rows?.[1]?.metricValues ?? [];
    const pv = (arr: typeof cur, i: number) => parseFloat(arr[i]?.value ?? "0");

    const overview = {
      sessions: { current: pv(cur, 0), previous: pv(prev, 0) },
      users: { current: pv(cur, 1), previous: pv(prev, 1) },
      conversions: { current: pv(cur, 2), previous: pv(prev, 2) },
      bounceRate: { current: pv(cur, 3), previous: pv(prev, 3) },
      revenue: { current: pv(cur, 4), previous: pv(prev, 4) },
    };

    const platforms = (socialPlatforms[0].rows ?? []).map((r) => ({
      platform: r.dimensionValues?.[0]?.value ?? "unknown",
      sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
      users: parseInt(r.metricValues?.[1]?.value ?? "0"),
      conversions: parseInt(r.metricValues?.[2]?.value ?? "0"),
      revenue: parseFloat(r.metricValues?.[3]?.value ?? "0"),
    }));

    // Attach top landing page per source
    const landingMap: Record<string, string> = {};
    for (const r of socialLanding[0].rows ?? []) {
      const src = r.dimensionValues?.[0]?.value ?? "";
      if (!landingMap[src]) {
        landingMap[src] = r.dimensionValues?.[1]?.value ?? "/";
      }
    }
    const platformsWithContent = platforms.map((p) => ({
      ...p,
      topContent: landingMap[p.platform] ?? "/",
    }));

    const dailyTrend = (socialDaily[0].rows ?? []).map((r) => {
      const raw = r.dimensionValues?.[0]?.value ?? "";
      return {
        date: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`,
        sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
        conversions: parseInt(r.metricValues?.[1]?.value ?? "0"),
      };
    });

    return NextResponse.json({
      connected: true,
      lastUpdated: new Date().toISOString(),
      overview,
      platforms: platformsWithContent,
      dailyTrend,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ connected: false, error: message }, { status: 500 });
  }
}
