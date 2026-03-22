import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const POSTHOG_HOST = "https://us.i.posthog.com";

// Clean data cutoff: 10am Kauai time (HST = UTC-10) on 2026-03-22 = 20:00 UTC
const DATA_CUTOFF = "2026-03-22 20:00:00";

/**
 * GET /api/analytics/quiz — fetch quiz funnel analytics from PostHog
 * Uses the PostHog HogQL query API for accurate event counts.
 */
export async function GET() {
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
              countIf(event = 'quiz_purchase') as purchases
            FROM events
            WHERE event IN ('quiz_started', 'quiz_completed', 'email_collected', 'quiz_cart_clicked', 'quiz_step_completed', 'quiz_purchase')
              AND timestamp > toDateTime('${DATA_CUTOFF}')
          `,
        },
      }),
    });

    let funnel = { quiz_started: 0, quiz_completed: 0, email_collected: 0, cart_clicked: 0, steps_total: 0, purchases: 0, revenue: 0 };

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
          revenue: (row[5] || 0) * 109, // estimate from purchase count × $109
        };
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
                AND timestamp > toDateTime('${DATA_CUTOFF}')
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
                AND timestamp > toDateTime('${DATA_CUTOFF}')
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
                AND timestamp > toDateTime('${DATA_CUTOFF}')
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
