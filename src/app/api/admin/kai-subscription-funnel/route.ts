import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ShopifyLineItem {
  title: string;
  quantity: number;
  price: string;
  selling_plan_allocation?: { selling_plan?: { name?: string } } | null;
}

interface ShopifyOrder {
  id: number;
  email: string | null;
  contact_email: string | null;
  customer?: { email?: string | null } | null;
  total_price: string;
  financial_status: string;
  created_at: string;
  line_items: ShopifyLineItem[];
}

/** Extract the best email from a Shopify order (tries email, contact_email, customer.email) */
function orderEmail(o: ShopifyOrder): string {
  const raw = o.email || o.contact_email || o.customer?.email || "";
  return raw.toLowerCase().trim();
}

/** Check if an order contains subscription/recurring products */
function isSubscriptionOrder(o: ShopifyOrder): boolean {
  for (const li of o.line_items || []) {
    // Check for Shopify selling plan (native subscriptions)
    if (li.selling_plan_allocation) return true;
    // Check product title keywords for subscription products
    const t = (li.title || "").toLowerCase();
    if (t.includes("subscription") || t.includes("subscribe") || t.includes("recurring") || t.includes("auto-ship")) return true;
    // Conceivable's Premium is the subscription product
    if (t.includes("conceivable's premium") || t.includes("conceivable premium")) return true;
  }
  return false;
}

async function fetchStripeSubscriptions(
  kaiEmails: Set<string>,
  from: string | null,
  to: string | null
): Promise<{
  totalActive: number;
  totalTrialing: number;
  kaiActive: number;
  kaiTrialing: number;
  mrr: number;
  recentEmails: string[];
}> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  const empty = { totalActive: 0, totalTrialing: 0, kaiActive: 0, kaiTrialing: 0, mrr: 0, recentEmails: [] };
  if (!apiKey) return empty;

  try {
    // Paginate through ALL subscriptions (Stripe limit: 100/page)
    const subs: Array<{
      id: string;
      status: string;
      customer: string;
      metadata: Record<string, string>;
      items: { data: { price: { unit_amount: number } }[] };
    }> = [];
    let startingAfter: string | undefined;
    let hasMore = true;
    let safety = 0;
    while (hasMore && safety < 20) {
      safety++;
      const params = new URLSearchParams({ limit: "100", status: "all" });
      if (from) params.set("created[gte]", String(Math.floor(new Date(`${from}T00:00:00Z`).getTime() / 1000)));
      if (to) params.set("created[lte]", String(Math.floor(new Date(`${to}T23:59:59Z`).getTime() / 1000)));
      if (startingAfter) params.set("starting_after", startingAfter);

      const res = await fetch(`https://api.stripe.com/v1/subscriptions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        console.error("[stripe] API error:", res.status);
        break;
      }
      const data = await res.json();
      const batch = (data.data || []);
      subs.push(...batch);
      hasMore = data.has_more;
      startingAfter = batch[batch.length - 1]?.id;
    }

    // Fetch customer emails for attribution
    const customerIds = Array.from(new Set(subs.map((s) => s.customer)));
    const customerMap = new Map<string, string>(); // id → email

    const BATCH = 10;
    for (let i = 0; i < customerIds.length; i += BATCH) {
      const batch = customerIds.slice(i, i + BATCH);
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
        if (c?.id && c.email) customerMap.set(c.id, c.email.toLowerCase().trim());
      }
    }

    let totalActive = 0;
    let totalTrialing = 0;
    let kaiActive = 0;
    let kaiTrialing = 0;
    let mrr = 0;
    const recentEmails: string[] = [];

    const TEST_EMAILS = new Set([
      "kirsten.karchmer@iambrazen.com",
      "kirsten@conceivable.com",
      "jennifer.pawling@pfisd.net",
    ]);
    const TEST_PATTERNS = [/^t@t\./i, /^test@/i, /@test\./i, /@example\./i, /^verify@/i, /^flowtest@/i];
    const isTestEmail = (e: string) => TEST_EMAILS.has(e) || TEST_PATTERNS.some((p) => p.test(e));

    for (const s of subs) {
      const email = customerMap.get(s.customer) || (s.metadata?.email || "").toLowerCase().trim();
      if (email && isTestEmail(email)) continue; // skip test accounts
      const isKai = (s.metadata?.source || "").includes("kai") || (email && kaiEmails.has(email));
      const amt = (s.items?.data?.[0]?.price?.unit_amount || 0) / 100;

      if (s.status === "active") {
        totalActive++;
        mrr += amt;
        if (isKai) kaiActive++;
      } else if (s.status === "trialing") {
        totalTrialing++;
        if (isKai) kaiTrialing++;
      }
      if (email && (s.status === "active" || s.status === "trialing")) recentEmails.push(email);
    }

    return {
      totalActive,
      totalTrialing,
      kaiActive,
      kaiTrialing,
      mrr: Math.round(mrr * 100) / 100,
      recentEmails: recentEmails.slice(0, 10),
    };
  } catch (err) {
    console.error("[stripe] fetch error:", err);
    return empty;
  }
}

async function fetchShopifyOrders(kaiEmails: Set<string>): Promise<{
  orderCount: number;
  revenue: number;
  recentOrders: { date: string; total: number; items: string[]; email: string }[];
  kaiOrderCount: number;
  kaiRevenue: number;
  kaiOrders: { date: string; total: number; items: string[]; email: string }[];
  subscriptionCount: number;
  kaiSubscriptionCount: number;
}> {
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const domain = "conceivable-fertility.myshopify.com";
  const empty = { orderCount: 0, revenue: 0, recentOrders: [], kaiOrderCount: 0, kaiRevenue: 0, kaiOrders: [], subscriptionCount: 0, kaiSubscriptionCount: 0 };

  if (!token) {
    console.warn("[kai-subscription-funnel] No SHOPIFY_ADMIN_API_TOKEN set");
    return empty;
  }

  try {
    const res = await fetch(
      `https://${domain}/admin/api/2024-10/orders.json?status=any&limit=250`,
      {
        headers: {
          "X-Shopify-Access-Token": token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("[kai-subscription-funnel] Shopify API error:", res.status, await res.text());
      return empty;
    }

    const data = await res.json();
    const orders: ShopifyOrder[] = data.orders || [];

    const paidOrders = orders.filter(
      (o) => o.financial_status === "paid" || o.financial_status === "partially_refunded"
    );

    const revenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.total_price || "0"), 0);

    const recentOrders = paidOrders.slice(0, 10).map((o) => ({
      date: o.created_at,
      total: parseFloat(o.total_price),
      items: o.line_items?.map((li) => li.title) || [],
      email: orderEmail(o),
    }));

    // Count subscription orders
    const subscriptionOrders = paidOrders.filter(isSubscriptionOrder);
    const subscriptionCount = subscriptionOrders.length;

    // Filter to only orders from Kai chat users
    const kaiPaidOrders = paidOrders.filter(o => {
      const email = orderEmail(o);
      return email && kaiEmails.has(email);
    });
    const kaiRevenue = kaiPaidOrders.reduce((sum, o) => sum + parseFloat(o.total_price || "0"), 0);
    const kaiOrders = kaiPaidOrders.slice(0, 10).map((o) => ({
      date: o.created_at,
      total: parseFloat(o.total_price),
      items: o.line_items?.map((li) => li.title) || [],
      email: orderEmail(o),
    }));

    // Count Kai-attributed subscription orders
    const kaiSubscriptionCount = kaiPaidOrders.filter(isSubscriptionOrder).length;

    return { orderCount: paidOrders.length, revenue, recentOrders, kaiOrderCount: kaiPaidOrders.length, kaiRevenue, kaiOrders, subscriptionCount, kaiSubscriptionCount };
  } catch (err) {
    console.error("[kai-subscription-funnel] Shopify fetch error:", err);
    return empty;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (from) {
      dateFilter.createdAt = { ...dateFilter.createdAt, gte: new Date(`${from}T00:00:00Z`) };
    }
    if (to) {
      dateFilter.createdAt = { ...dateFilter.createdAt, lte: new Date(`${to}T23:59:59Z`) };
    }

    // Fetch all non-test Kai chat logs
    const allLogs = await prisma.kaiChatLog.findMany({
      where: { isTest: false, ...dateFilter },
      select: {
        sessionId: true,
        email: true,
        kaiResponse: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by sessionId — every unique sessionId is one conversation.
    // Logs without a sessionId each count as their own session.
    const sessionMap = new Map<string, typeof allLogs>();
    for (const log of allLogs) {
      const key = log.sessionId || `anon-${log.createdAt.toISOString()}`;
      if (!sessionMap.has(key)) sessionMap.set(key, []);
      sessionMap.get(key)!.push(log);
    }

    const sessions = Array.from(sessionMap.entries());
    const totalSessions = sessions.length; // chatStarted = unique sessionIds

    let packSessions = 0;
    let cartSessions = 0;
    const emailSet = new Set<string>(); // emailsCaptured = unique non-null emails

    // Daily breakdown for trend
    const dailyMap = new Map<
      string,
      { chats: number; packs: number; carts: number; emails: Set<string> }
    >();

    for (const [, logs] of sessions) {
      let hasPack = false;
      let hasCart = false;
      const sessionDay = logs[0]?.createdAt.toISOString().slice(0, 10) || "unknown";

      if (!dailyMap.has(sessionDay)) {
        dailyMap.set(sessionDay, { chats: 0, packs: 0, carts: 0, emails: new Set() });
      }
      const dayData = dailyMap.get(sessionDay)!;
      dayData.chats++;

      for (const log of logs) {
        if (log.kaiResponse?.includes("PACK_START")) hasPack = true;
        if (log.kaiResponse?.includes("/checkout") || log.kaiResponse?.includes("/cart")) hasCart = true;
        if (log.email && log.email.includes("@")) {
          emailSet.add(log.email.toLowerCase());
          dayData.emails.add(log.email.toLowerCase());
        }
      }

      if (hasPack) {
        packSessions++;
        dayData.packs++;
      }
      if (hasCart) {
        cartSessions++;
        dayData.carts++;
      }
    }

    const uniqueEmails = emailSet.size;

    // Daily trend sorted ascending
    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, d]) => ({
        date,
        chats: d.chats,
        packs: d.packs,
        carts: d.carts,
        emails: d.emails.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Fetch Shopify orders + quiz count + landing views + Stripe subscriptions in parallel
    // Landing views: if date filter is for a single day, use that day's counter. Otherwise use total.
    const landingViewsKey = (from && to && from === to) ? `kai_landing_${from}` : "kai_landing_total";
    const [shopify, quizCount, landingViews, stripe] = await Promise.all([
      fetchShopifyOrders(emailSet),
      prisma.quizResponse.count(),
      prisma.siteConfig.findUnique({ where: { key: landingViewsKey } }).then(r => parseInt(r?.value as string || "0", 10)).catch(() => 0),
      fetchStripeSubscriptions(emailSet, from, to),
    ]);

    // Build conversion rates
    const chatToPackRate =
      totalSessions > 0 ? Math.round((packSessions / totalSessions) * 1000) / 10 : 0;
    const packToCartRate =
      packSessions > 0 ? Math.round((cartSessions / packSessions) * 1000) / 10 : 0;
    const cartToPurchaseRate =
      cartSessions > 0
        ? Math.round((shopify.kaiOrderCount / cartSessions) * 1000) / 10
        : 0;
    const overallRate =
      totalSessions > 0
        ? Math.round((shopify.kaiOrderCount / totalSessions) * 1000) / 10
        : 0;
    const emailCaptureRate =
      totalSessions > 0 ? Math.round((uniqueEmails / totalSessions) * 1000) / 10 : 0;

    return NextResponse.json({
      funnel: {
        landingPageViews: landingViews,
        chatStarted: totalSessions,       // unique sessionIds (includes anonymous)
        packPresented: packSessions,
        cartClicked: cartSessions,
        emailsCaptured: uniqueEmails,      // unique non-null emails (separate metric)
        purchases: shopify.kaiOrderCount,
        revenue: Math.round(shopify.kaiRevenue * 100) / 100,
        subscribers: stripe.kaiActive + stripe.kaiTrialing,
      },
      conversionRates: {
        chatToPackRate,
        packToCartRate,
        cartToPurchaseRate,
        overallRate,
        emailCaptureRate,
      },
      comparison: {
        quiz: {
          completions: quizCount,
        },
        kai: {
          conversations: totalSessions,
          packs: packSessions,
          carts: cartSessions,
          emails: uniqueEmails,
        },
      },
      dailyTrend,
      shopify: {
        totalOrders: shopify.orderCount,
        totalRevenue: Math.round(shopify.revenue * 100) / 100,
        recentOrders: shopify.recentOrders,
        kaiOrders: shopify.kaiOrderCount,
        kaiRevenue: Math.round(shopify.kaiRevenue * 100) / 100,
        kaiRecentOrders: shopify.kaiOrders,
        totalSubscriptions: shopify.subscriptionCount,
        kaiSubscriptions: shopify.kaiSubscriptionCount,
      },
      stripe: {
        totalActive: stripe.totalActive,
        totalTrialing: stripe.totalTrialing,
        kaiActive: stripe.kaiActive,
        kaiTrialing: stripe.kaiTrialing,
        mrr: stripe.mrr,
        recentEmails: stripe.recentEmails,
      },
      dateRange: { from: from || "all", to: to || "all" },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[kai-subscription-funnel] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate funnel data" },
      { status: 500 }
    );
  }
}
