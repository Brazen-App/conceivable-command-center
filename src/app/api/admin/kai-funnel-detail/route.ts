import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface FunnelEvent {
  event: string;
  email: string | null;
  sessionId: string | null;
  metadata: Record<string, unknown> | null;
  ts: number;
}

/**
 * GET /api/admin/kai-funnel-detail?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Reads funnel_event_* rows from SiteConfig and returns per-step counts
 * + email-level drop-off so we can see EXACTLY where people leave.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromTs = from ? new Date(`${from}T00:00:00Z`).getTime() : 0;
    const toTs = to ? new Date(`${to}T23:59:59Z`).getTime() : Date.now();

    // Fetch all funnel events
    const rows = await prisma.siteConfig.findMany({
      where: { key: { startsWith: "funnel_event_" } },
      take: 5000,
    });

    const events: FunnelEvent[] = [];
    for (const r of rows) {
      try {
        const parsed = JSON.parse(r.value);
        if (parsed.ts >= fromTs && parsed.ts <= toTs) events.push(parsed);
      } catch {
        // skip malformed
      }
    }

    // Aggregate counts by event type
    const counts: Record<string, number> = {};
    const uniqueByEvent: Record<string, Set<string>> = {};
    for (const e of events) {
      counts[e.event] = (counts[e.event] || 0) + 1;
      if (!uniqueByEvent[e.event]) uniqueByEvent[e.event] = new Set();
      const id = e.email || e.sessionId || "anon";
      uniqueByEvent[e.event].add(id);
    }

    // Aggregate traffic sources (from page_view events)
    const sourceMap = new Map<string, number>();
    for (const e of events) {
      if (e.event !== "page_view") continue;
      const m = (e.metadata || {}) as Record<string, string | null>;
      let source = "direct";
      if (m.utm_source) {
        source = m.utm_campaign ? `${m.utm_source} / ${m.utm_campaign}` : String(m.utm_source);
      } else if (m.referrer) {
        try {
          const host = new URL(m.referrer).hostname.replace(/^www\./, "");
          source = host;
        } catch { /* keep direct */ }
      }
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    }
    const trafficSources = Array.from(sourceMap.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Group by email/session so we can see who dropped where
    const journeys = new Map<string, { events: string[]; lastTs: number; email: string | null }>();
    for (const e of events.sort((a, b) => a.ts - b.ts)) {
      const id = e.email || e.sessionId || `anon_${e.ts}`;
      if (!journeys.has(id)) journeys.set(id, { events: [], lastTs: e.ts, email: e.email });
      const j = journeys.get(id)!;
      if (!j.events.includes(e.event)) j.events.push(e.event);
      j.lastTs = e.ts;
      if (e.email && !j.email) j.email = e.email;
    }

    // Identify drop-off patterns
    const dropoffs = {
      page_view_only: 0,            // just looked
      form_started_no_submit: 0,    // started typing but didn't submit
      form_submitted_no_stripe: 0,  // submitted form but stripe never started
      stripe_started_not_completed: 0, // bailed at Stripe
      paid_no_chat_open: 0,         // paid but never opened chat
      chat_opened_no_message: 0,    // opened chat but never sent a message
      first_message_only: 0,        // sent one message and bounced
      converted: 0,                  // sent multiple messages
    };

    const journeyList = Array.from(journeys.values());
    for (const j of journeyList) {
      const ev = new Set(j.events);
      if (ev.has("first_message")) {
        // Sent at least one message
        const messageCount = j.events.filter((e) => e === "first_message").length;
        if (messageCount >= 2 || ev.has("chat_engaged")) dropoffs.converted++;
        else dropoffs.first_message_only++;
      } else if (ev.has("chat_opened")) {
        dropoffs.chat_opened_no_message++;
      } else if (ev.has("stripe_completed")) {
        dropoffs.paid_no_chat_open++;
      } else if (ev.has("stripe_started")) {
        dropoffs.stripe_started_not_completed++;
      } else if (ev.has("form_submit")) {
        dropoffs.form_submitted_no_stripe++;
      } else if (ev.has("form_focus")) {
        dropoffs.form_started_no_submit++;
      } else if (ev.has("page_view")) {
        dropoffs.page_view_only++;
      }
    }

    // Recent journeys for inspection (last 20)
    const recent = journeyList
      .sort((a, b) => b.lastTs - a.lastTs)
      .slice(0, 20)
      .map((j) => ({
        email: j.email,
        steps: j.events,
        lastSeen: new Date(j.lastTs).toISOString(),
      }));

    // Pull Stripe revenue for the same date window (Kai-attributed only)
    let stripeRevenue = 0;
    let stripeKaiActive = 0;
    let stripeKaiTrialing = 0;
    try {
      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (apiKey) {
        const params = new URLSearchParams({ limit: "100", status: "all" });
        if (from) params.set("created[gte]", String(Math.floor(fromTs / 1000)));
        if (to) params.set("created[lte]", String(Math.floor(toTs / 1000)));
        const sRes = await fetch(`https://api.stripe.com/v1/subscriptions?${params.toString()}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (sRes.ok) {
          const sData = await sRes.json();
          const subs = (sData.data || []) as Array<{
            status: string;
            metadata: Record<string, string>;
            items: { data: { price: { unit_amount: number } }[] };
          }>;
          for (const s of subs) {
            const isKai = (s.metadata?.source || "").includes("kai");
            const amt = (s.items?.data?.[0]?.price?.unit_amount || 0) / 100;
            if (!isKai) continue;
            if (s.status === "active") { stripeKaiActive++; stripeRevenue += amt; }
            else if (s.status === "trialing") { stripeKaiTrialing++; }
          }
        }
      }
    } catch (err) {
      console.error("[funnel-detail] Stripe fetch error:", err);
    }

    return NextResponse.json({
      counts: {
        page_view: counts.page_view || 0,
        form_focus: counts.form_focus || 0,
        form_submit: counts.form_submit || 0,
        stripe_started: counts.stripe_started || 0,
        stripe_completed: counts.stripe_completed || 0,
        chat_opened: counts.chat_opened || 0,
        first_message: counts.first_message || 0,
      },
      uniqueUsers: Object.fromEntries(
        Object.entries(uniqueByEvent).map(([k, v]) => [k, v.size])
      ),
      dropoffs,
      totalJourneys: journeyList.length,
      recent,
      trafficSources,
      revenue: {
        stripeKaiMRR: Math.round(stripeRevenue * 100) / 100,
        stripeKaiActive,
        stripeKaiTrialing,
      },
      dateRange: { from: from || "all", to: to || "now" },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[kai-funnel-detail]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
