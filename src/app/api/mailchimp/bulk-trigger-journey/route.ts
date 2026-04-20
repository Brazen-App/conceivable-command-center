import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const LIST_ID = "3c920d5bed";

/**
 * POST /api/mailchimp/bulk-trigger-journey
 *
 * Bulk-triggers all list members into a Customer Journey.
 * Uses MAILCHIMP_JOURNEY_ID and MAILCHIMP_JOURNEY_STEP_ID from env.
 *
 * Body: { confirmed: true }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.confirmed) {
    return NextResponse.json(
      { error: "Safety check: requires { confirmed: true }" },
      { status: 400 }
    );
  }

  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const journeyId = process.env.MAILCHIMP_JOURNEY_ID;
  const stepId = process.env.MAILCHIMP_JOURNEY_STEP_ID;

  if (!apiKey || !serverPrefix || !journeyId || !stepId) {
    return NextResponse.json(
      { error: "Missing env vars: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_JOURNEY_ID, MAILCHIMP_JOURNEY_STEP_ID" },
      { status: 503 }
    );
  }

  const mc = getClient() as any;
  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = `Bearer ${apiKey}`;

  // Fetch all members from the list in batches
  const allEmails: string[] = [];
  let offset = 0;
  const batchSize = 500;

  while (true) {
    const listRes = await fetch(
      `${base}/lists/${LIST_ID}/members?count=${batchSize}&offset=${offset}&status=subscribed&fields=members.email_address`,
      { headers: { Authorization: auth } }
    );

    if (!listRes.ok) {
      const err = await listRes.json().catch(() => ({}));
      return NextResponse.json({ error: "Failed to fetch list members", detail: err }, { status: 500 });
    }

    const data = await listRes.json();
    const members = data.members || [];

    if (members.length === 0) break;

    for (const m of members) {
      allEmails.push(m.email_address.toLowerCase());
    }

    offset += batchSize;

    // Safety cap
    if (allEmails.length > 35000) break;
  }

  console.log(`[bulk-trigger] Found ${allEmails.length} subscribed members. Triggering journey ${journeyId} step ${stepId}...`);

  // Trigger each contact into the journey
  let triggered = 0;
  let failed = 0;
  const errors: { email: string; error: string }[] = [];

  // Process in batches of 10 concurrent requests
  const CONCURRENCY = 10;

  for (let i = 0; i < allEmails.length; i += CONCURRENCY) {
    const batch = allEmails.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map(async (email) => {
        const res = await fetch(
          `${base}/customer-journeys/journeys/${journeyId}/steps/${stepId}/actions/trigger`,
          {
            method: "POST",
            headers: { Authorization: auth, "Content-Type": "application/json" },
            body: JSON.stringify({ email_address: email }),
          }
        );

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          throw new Error(`${res.status}: ${errBody}`);
        }
      })
    );

    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled") {
        triggered++;
      } else {
        failed++;
        if (errors.length < 20) {
          errors.push({
            email: batch[j],
            error: (results[j] as PromiseRejectedResult).reason?.message || "Unknown",
          });
        }
      }
    }

    // Log progress every 500
    if ((i + CONCURRENCY) % 500 === 0) {
      console.log(`[bulk-trigger] Progress: ${i + CONCURRENCY}/${allEmails.length} (${triggered} triggered, ${failed} failed)`);
    }
  }

  console.log(`[bulk-trigger] Done. ${triggered} triggered, ${failed} failed out of ${allEmails.length}.`);

  return NextResponse.json({
    success: true,
    totalMembers: allEmails.length,
    triggered,
    failed,
    journeyId,
    stepId,
    sampleErrors: errors,
  });
}

/**
 * GET /api/mailchimp/bulk-trigger-journey
 * Preview — shows how many members would be triggered.
 */
export async function GET() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const journeyId = process.env.MAILCHIMP_JOURNEY_ID;
  const stepId = process.env.MAILCHIMP_JOURNEY_STEP_ID;

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = `Bearer ${apiKey}`;

  // Get total subscribed count
  const listRes = await fetch(
    `${base}/lists/${LIST_ID}?fields=stats.member_count`,
    { headers: { Authorization: auth } }
  );
  const listData = await listRes.json();
  const memberCount = listData?.stats?.member_count || 0;

  return NextResponse.json({
    preview: true,
    message: `Would trigger ${memberCount} subscribed members into Customer Journey ${journeyId} (step ${stepId}). POST with { confirmed: true } to execute.`,
    memberCount,
    journeyId,
    stepId,
  });
}
