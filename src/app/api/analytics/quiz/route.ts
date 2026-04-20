import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const POSTHOG_HOST = "https://us.i.posthog.com";

// Default cutoff: 10am Kauai time (HST = UTC-10) on 2026-03-22 = 20:00 UTC
const DEFAULT_CUTOFF = "2026-03-22 20:00:00";

/**
 * GET /api/analytics/quiz — fetch quiz funnel analytics from PostHog
 * Accepts optional ?from=YYYY-MM-DD&to=YYYY-MM-DD query params.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  // Build WHERE clause fragments
  const fromClause = fromParam
    ? `AND timestamp >= toDateTime('${fromParam} 00:00:00')`
    : `AND timestamp > toDateTime('${DEFAULT_CUTOFF}')`;
  const toClause = toParam ? `AND timestamp <= toDateTime('${toParam} 23:59:59')` : "";
  // Read env vars inside handler (not module scope) so they're always fresh
  const POSTHOG_PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY || "";
  const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || "";

  if (!POSTHOG_PERSONAL_KEY || !PROJECT_ID) {
    return NextResponse.json({
      source: "not_configured",
      note: "Add POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID env vars.",
      funnel: { quiz_started: 0, quiz_completed: 0, email_collected: 0, cart_clicked: 0 },
      steps: null,
      topConcerns: null,
      configured: false,
    });
  }

  const headers = {
    Authorization: `Bearer ${POSTHOG_PERSONAL_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    // Use HogQL to get all funnel counts in one query
    const funnelQuery = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT
              countIf(event = 'quiz_started') as started,
              countIf(event = 'quiz_completed') as completed,
              countIf(event = 'email_collected') as emails,
              countIf(event = 'quiz_cart_clicked') as cart_clicked,
              countIf(event = 'quiz_step_completed') as steps_total,
              countIf(event = 'quiz_purchase') as purchases,
              countIf(event = 'kirsten_video_played') as video_plays,
              countIf(event = 'kirsten_video_completed') as video_completions
            FROM events
            WHERE event IN ('quiz_started', 'quiz_completed', 'email_collected', 'quiz_cart_clicked', 'quiz_step_completed', 'quiz_purchase', 'kirsten_video_played', 'kirsten_video_completed')
              ${fromClause} ${toClause}
          `,
        },
      }),
    });

    let funnel = { quiz_started: 0, quiz_completed: 0, email_collected: 0, cart_clicked: 0, steps_total: 0, purchases: 0, revenue: 0, video_plays: 0, video_completions: 0 };

    if (funnelQuery.ok) {
      const funnelData = await funnelQuery.json();
      const row = funnelData.results?.[0];
      if (row) {
        funnel = {
          quiz_started: row[0] || 0,
          quiz_completed: row[1] || 0,
          email_collected: row[2] || 0,
          cart_clicked: row[3] || 0,
          steps_total: row[4] || 0,
          purchases: row[5] || 0,
          revenue: (row[5] || 0) * 109,
          video_plays: row[6] || 0,
          video_completions: row[7] || 0,
        };
      }
    }

    // Pull real purchase data from Shopify orders API
    const shopifyToken = process.env.SHOPIFY_ADMIN_API_TOKEN;
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || "conceivable-fertility.myshopify.com";
    if (shopifyToken) {
      try {
        const fromDate = fromParam || "2026-01-01";
        const toDate = toParam || new Date().toISOString().split("T")[0];
        const ordersRes = await fetch(
          `https://${shopifyDomain}/admin/api/2024-01/orders.json?status=any&created_at_min=${fromDate}T00:00:00Z&created_at_max=${toDate}T23:59:59Z&limit=250`,
          { headers: { "X-Shopify-Access-Token": shopifyToken } }
        );
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = ordersData.orders || [];
          let totalRevenue = 0;
          let totalOrders = 0;
          for (const order of orders) {
            if (order.financial_status === "refunded" || order.cancelled_at) continue;
            totalOrders++;
            totalRevenue += parseFloat(order.total_price || "0");
          }
          // Use Shopify data — it's the source of truth
          funnel.purchases = totalOrders;
          funnel.revenue = Math.round(totalRevenue * 100) / 100;
        }
      } catch (shopErr) {
        console.error("[quiz-analytics] Shopify orders fetch error:", shopErr);
        // Fall back to PostHog estimate (already set above)
      }
    }

    // Get top concerns from quiz_completed events
    let topConcerns: Record<string, number> = {};
    try {
      const concernsQuery = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: `
              SELECT
                JSONExtractString(properties, 'top_concern') as concern,
                count() as cnt
              FROM events
              WHERE event = 'quiz_completed'
                ${fromClause} ${toClause}
                AND concern != ''
              GROUP BY concern
              ORDER BY cnt DESC
              LIMIT 10
            `,
          },
        }),
      });
      if (concernsQuery.ok) {
        const cData = await concernsQuery.json();
        for (const row of cData.results || []) {
          if (row[0]) topConcerns[row[0]] = row[1];
        }
      }
    } catch { /* optional — don't fail the whole response */ }

    // Get step drop-off data
    let stepDropoff: Record<string, number> = {};
    try {
      const stepsQuery = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: `
              SELECT
                JSONExtractInt(properties, 'step') as step_num,
                count() as cnt
              FROM events
              WHERE event = 'quiz_step_completed'
                ${fromClause} ${toClause}
              GROUP BY step_num
              ORDER BY step_num ASC
            `,
          },
        }),
      });
      if (stepsQuery.ok) {
        const sData = await stepsQuery.json();
        for (const row of sData.results || []) {
          if (row[0] !== null) stepDropoff[`step_${row[0]}`] = row[1];
        }
      }
    } catch { /* optional */ }

    // Get daily trend (last 7 days)
    let dailyTrend: Array<{ date: string; started: number; completed: number }> = [];
    try {
      const trendQuery = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: {
            kind: "HogQLQuery",
            query: `
              SELECT
                toDate(timestamp) as day,
                countIf(event = 'quiz_started') as started,
                countIf(event = 'quiz_completed') as completed
              FROM events
              WHERE event IN ('quiz_started', 'quiz_completed')
                ${fromClause} ${toClause}
              GROUP BY day
              ORDER BY day ASC
            `,
          },
        }),
      });
      if (trendQuery.ok) {
        const tData = await trendQuery.json();
        dailyTrend = (tData.results || []).map((row: [string, number, number]) => ({
          date: row[0],
          started: row[1],
          completed: row[2],
        }));
      }
    } catch { /* optional */ }

    return NextResponse.json({
      source: "posthog",
      funnel,
      topConcerns: Object.keys(topConcerns).length > 0 ? topConcerns : null,
      stepDropoff: Object.keys(stepDropoff).length > 0 ? stepDropoff : null,
      dailyTrend: dailyTrend.length > 0 ? dailyTrend : null,
      configured: true,
    });
  } catch (err) {
    console.error("[quiz-analytics]", err);
    return NextResponse.json({
      source: "error",
      error: err instanceof Error ? err.message : "Failed to fetch PostHog data",
      configured: false,
    });
  }
}
