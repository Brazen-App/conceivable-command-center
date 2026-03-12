import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/* ── helpers ── */
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

function getDemoData() {
  return {
    overview: {
      sessions: { current: 3420, previous: 2810 },
      users: { current: 2580, previous: 2120 },
      pageviews: { current: 8940, previous: 7200 },
      bounceRate: { current: 0.42, previous: 0.48 },
      avgDuration: { current: 145, previous: 128 },
      conversions: { current: 67, previous: 52 },
    },
    trafficSources: [
      { source: "google / organic", sessions: 1240, users: 980, conversions: 28 },
      { source: "mailchimp / email", sessions: 640, users: 520, conversions: 18 },
      { source: "linkedin.com / referral", sessions: 420, users: 340, conversions: 8 },
      { source: "(direct) / (none)", sessions: 380, users: 310, conversions: 5 },
      { source: "tiktok.com / referral", sessions: 290, users: 240, conversions: 4 },
      { source: "instagram.com / referral", sessions: 180, users: 150, conversions: 3 },
      { source: "facebook.com / referral", sessions: 150, users: 120, conversions: 1 },
    ],
    topPages: [
      { path: "/", pageviews: 2340, avgDuration: 65 },
      { path: "/fertility-quiz", pageviews: 1580, avgDuration: 210 },
      { path: "/blog/con-score-explained", pageviews: 890, avgDuration: 340 },
      { path: "/pricing", pageviews: 720, avgDuration: 120 },
      { path: "/about", pageviews: 680, avgDuration: 95 },
      { path: "/blog/7-drivers-fertility", pageviews: 540, avgDuration: 280 },
      { path: "/app", pageviews: 420, avgDuration: 180 },
    ],
    conversionEvents: [
      { event: "begin_checkout", count: 89, revenue: 0 },
      { event: "purchase", count: 67, revenue: 6030 },
      { event: "sign_up", count: 142, revenue: 0 },
      { event: "add_to_cart", count: 124, revenue: 0 },
    ],
  };
}

/* ── GET /api/analytics — overview dashboard data ── */
export async function GET() {
  const client = getClient();

  if (!client) {
    // Return demo data when service account not yet connected
    return NextResponse.json({
      connected: false,
      message: "Add GOOGLE_SERVICE_ACCOUNT_JSON to .env.local to connect GA4",
      serviceAccountEmail: "conceivable-analytics@YOUR-PROJECT.iam.gserviceaccount.com",
      setupInstructions: [
        "1. Go to Google Cloud Console → IAM & Admin → Service Accounts",
        "2. Create a service account (or use existing)",
        "3. Create a JSON key and copy the full JSON",
        "4. Add GOOGLE_SERVICE_ACCOUNT_JSON=<paste JSON> to .env.local",
        "5. In GA4 Admin → Property Access Management, add the service account email as Viewer",
      ],
      demo: getDemoData(),
    });
  }

  try {
    // Fetch multiple reports in parallel
    const [overview, traffic, topPages, conversions] = await Promise.all([
      // 1. Overview: sessions, users, pageviews, bounce rate (last 30 days)
      client.runReport({
        property: PROPERTY,
        dateRanges: [
          { startDate: "30daysAgo", endDate: "today" },
          { startDate: "60daysAgo", endDate: "31daysAgo" },
        ],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
        ],
      }),

      // 2. Traffic by source/medium (last 30 days)
      client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSourceMedium" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "conversions" },
        ],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),

      // 3. Top pages (last 30 days)
      client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),

      // 4. Conversion events (last 30 days)
      client.runReport({
        property: PROPERTY,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [
          { name: "eventCount" },
          { name: "totalRevenue" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: ["purchase", "begin_checkout", "add_to_cart", "sign_up", "first_open"],
            },
          },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      }),
    ]);

    // Parse overview
    const current = overview[0].rows?.[0]?.metricValues ?? [];
    const previous = overview[0].rows?.[1]?.metricValues ?? [];

    const parseVal = (vals: typeof current, i: number) =>
      parseFloat(vals[i]?.value ?? "0");

    const overviewData = {
      sessions: { current: parseVal(current, 0), previous: parseVal(previous, 0) },
      users: { current: parseVal(current, 1), previous: parseVal(previous, 1) },
      pageviews: { current: parseVal(current, 2), previous: parseVal(previous, 2) },
      bounceRate: { current: parseVal(current, 3), previous: parseVal(previous, 3) },
      avgDuration: { current: parseVal(current, 4), previous: parseVal(previous, 4) },
      conversions: { current: parseVal(current, 5), previous: parseVal(previous, 5) },
    };

    // Parse traffic sources
    const trafficSources = (traffic[0].rows ?? []).map((row) => ({
      source: row.dimensionValues?.[0]?.value ?? "unknown",
      sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
      users: parseInt(row.metricValues?.[1]?.value ?? "0"),
      conversions: parseInt(row.metricValues?.[2]?.value ?? "0"),
    }));

    // Parse top pages
    const topPagesData = (topPages[0].rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "/",
      pageviews: parseInt(row.metricValues?.[0]?.value ?? "0"),
      avgDuration: parseFloat(row.metricValues?.[1]?.value ?? "0"),
    }));

    // Parse conversions
    const conversionEvents = (conversions[0].rows ?? []).map((row) => ({
      event: row.dimensionValues?.[0]?.value ?? "unknown",
      count: parseInt(row.metricValues?.[0]?.value ?? "0"),
      revenue: parseFloat(row.metricValues?.[1]?.value ?? "0"),
    }));

    return NextResponse.json({
      connected: true,
      propertyId: process.env.GA4_PROPERTY_ID,
      lastUpdated: new Date().toISOString(),
      overview: overviewData,
      trafficSources,
      topPages: topPagesData,
      conversionEvents,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown GA4 error";

    // Detect "API not enabled" error and return actionable instructions
    if (message.includes("has not been used in project") || message.includes("it is disabled")) {
      const projectMatch = message.match(/project (\d+)/);
      const projectId = projectMatch?.[1] ?? "YOUR_PROJECT_ID";
      return NextResponse.json({
        connected: false,
        error: "GA4 Data API not enabled",
        fixRequired: "enable_api",
        instructions: [
          `1. Go to: https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=${projectId}`,
          "2. Click 'Enable' to activate the Google Analytics Data API",
          "3. Wait 1-2 minutes for it to propagate",
          "4. Refresh this page",
        ],
        enableUrl: `https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=${projectId}`,
        demo: getDemoData(),
      });
    }

    return NextResponse.json(
      { connected: false, error: message },
      { status: 500 }
    );
  }
}
