import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StripeSubscription {
  id: string;
  status: string;
  customer: string;
  created: number;
  current_period_start: number;
  current_period_end: number;
  trial_start: number | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  items: { data: { price: { unit_amount: number; recurring: { interval: string } } }[] };
  metadata: Record<string, string>;
}

interface StripeCustomer {
  id: string;
  email: string | null;
  name: string | null;
  created: number;
}

/**
 * GET /api/admin/kai-stripe-subscriptions
 * Returns all Stripe subscriptions with customer emails so we can attribute them to Kai chats.
 *
 * Query params:
 *   ?from=YYYY-MM-DD  (optional, filter by created date)
 *   ?to=YYYY-MM-DD    (optional)
 */
export async function GET(req: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not configured", subscriptions: [] }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    // Fetch all subscriptions (paginate up to 100 at a time)
    const all: StripeSubscription[] = [];
    let startingAfter: string | undefined;
    let hasMore = true;
    const customerIds = new Set<string>();

    while (hasMore && all.length < 1000) {
      const params = new URLSearchParams({ limit: "100", status: "all" });
      if (startingAfter) params.set("starting_after", startingAfter);
      // Stripe filters: created date
      if (from) params.set("created[gte]", String(Math.floor(new Date(`${from}T00:00:00Z`).getTime() / 1000)));
      if (to) params.set("created[lte]", String(Math.floor(new Date(`${to}T23:59:59Z`).getTime() / 1000)));

      const res = await fetch(`https://api.stripe.com/v1/subscriptions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: `Stripe API ${res.status}: ${text.slice(0, 300)}` }, { status: 500 });
      }

      const data = await res.json();
      const batch = data.data as StripeSubscription[];
      all.push(...batch);
      for (const s of batch) customerIds.add(s.customer);
      hasMore = data.has_more;
      startingAfter = batch[batch.length - 1]?.id;
    }

    // Fetch all unique customers in batches to get their emails
    const customerMap = new Map<string, StripeCustomer>();
    const customerIdList = Array.from(customerIds);

    // Stripe doesn't have a bulk customer endpoint, so we fetch them one at a time but in parallel batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < customerIdList.length; i += BATCH_SIZE) {
      const batch = customerIdList.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map((id) =>
          fetch(`https://api.stripe.com/v1/customers/${id}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      );
      for (const c of results) {
        if (c && c.id) customerMap.set(c.id, c);
      }
    }

    const TEST_EMAILS = new Set([
      "kirsten.karchmer@iambrazen.com",
      "kirsten@conceivable.com",
      "jennifer.pawling@pfisd.net",
    ]);
    const TEST_PATTERNS = [/^t@t\./i, /^test@/i, /@test\./i, /@example\./i, /^verify@/i, /^flowtest@/i];
    const isTestEmail = (e: string) => TEST_EMAILS.has(e) || TEST_PATTERNS.some((p) => p.test(e));

    // Build response — filter out test accounts
    const subs = all
      .map((s) => {
      const customer = customerMap.get(s.customer);
      const email = (customer?.email || s.metadata?.email || "").toLowerCase().trim();
      return {
        id: s.id,
        email,
        name: customer?.name || s.metadata?.name || null,
        status: s.status, // active, trialing, canceled, past_due, etc.
        created: new Date(s.created * 1000).toISOString(),
        trialEnd: s.trial_end ? new Date(s.trial_end * 1000).toISOString() : null,
        currentPeriodEnd: new Date(s.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: s.cancel_at_period_end,
        canceledAt: s.canceled_at ? new Date(s.canceled_at * 1000).toISOString() : null,
        amount: s.items?.data?.[0]?.price?.unit_amount ? s.items.data[0].price.unit_amount / 100 : 0,
        interval: s.items?.data?.[0]?.price?.recurring?.interval || "month",
        source: s.metadata?.source || "unknown",
      };
    })
      .filter((s) => !s.email || !isTestEmail(s.email));

    // Aggregate stats
    const paying = subs.filter((s) => s.status === "active"); // actually paying
    const trialing = subs.filter((s) => s.status === "trialing"); // free trial, no revenue yet
    const canceled = subs.filter((s) => s.status === "canceled");
    const kaiSource = subs.filter((s) => s.source.includes("kai"));
    const kaiPaying = kaiSource.filter((s) => s.status === "active");
    const kaiTrialing = kaiSource.filter((s) => s.status === "trialing");

    // Revenue = only from paying (active) subscriptions, NOT trialing
    const revenue = Math.round(paying.reduce((sum, s) => sum + s.amount, 0) * 100) / 100;

    return NextResponse.json({
      total: subs.length,
      active: paying.length,
      trialing: trialing.length,
      canceled: canceled.length,
      newSignups: paying.length + trialing.length, // new subscription sign-ups in range
      kai: {
        total: kaiSource.length,
        active: kaiPaying.length,
        trialing: kaiTrialing.length,
      },
      revenue,      // only from paying subs
      mrr: revenue, // alias for backwards compat
      subscriptions: subs,
      dateRange: { from: from || "all", to: to || "all" },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[kai-stripe-subscriptions]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
