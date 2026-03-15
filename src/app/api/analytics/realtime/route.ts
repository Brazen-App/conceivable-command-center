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

const PROPERTY = `properties/${process.env.GA4_PROPERTY_ID ?? "375866253"}`;

/* ── GET /api/analytics/realtime — Real-time active users ── */
export async function GET() {
  const client = getClient();

  if (!client) {
    return NextResponse.json({
      connected: false,
      demo: {
        activeUsers: 12,
        byCountry: [
          { country: "United States", users: 7 },
          { country: "United Kingdom", users: 2 },
          { country: "Canada", users: 2 },
          { country: "Australia", users: 1 },
        ],
        byPage: [
          { page: "/", users: 4 },
          { page: "/fertility-quiz", users: 3 },
          { page: "/blog/conceivable-score-explained", users: 2 },
          { page: "/pricing", users: 2 },
          { page: "/about", users: 1 },
        ],
        bySource: [
          { source: "google", users: 5 },
          { source: "direct", users: 3 },
          { source: "linkedin.com", users: 2 },
          { source: "tiktok.com", users: 2 },
        ],
      },
    });
  }

  try {
    const [activeUsers, byCountry, byPage, bySource] = await Promise.all([
      // Total active users right now
      client.runRealtimeReport({
        property: PROPERTY,
        metrics: [{ name: "activeUsers" }],
      }),

      // Active users by country
      client.runRealtimeReport({
        property: PROPERTY,
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),

      // Active users by page
      client.runRealtimeReport({
        property: PROPERTY,
        dimensions: [{ name: "unifiedPageScreen" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),

      // Active users by source
      client.runRealtimeReport({
        property: PROPERTY,
        dimensions: [{ name: "source" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
    ]);

    const total = parseInt(activeUsers[0].rows?.[0]?.metricValues?.[0]?.value ?? "0");

    const parseRows = (report: typeof byCountry[0], dimLabel: string) =>
      (report.rows ?? []).map((r) => ({
        [dimLabel]: r.dimensionValues?.[0]?.value ?? "unknown",
        users: parseInt(r.metricValues?.[0]?.value ?? "0"),
      }));

    return NextResponse.json({
      connected: true,
      timestamp: new Date().toISOString(),
      activeUsers: total,
      byCountry: parseRows(byCountry[0], "country"),
      byPage: parseRows(byPage[0], "page"),
      bySource: parseRows(bySource[0], "source"),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ connected: false, error: message }, { status: 500 });
  }
}
