/**
 * GET /api/shopify/orders
 * Fetches Shopify orders from the Admin REST API.
 * Used by the quiz dashboard for the source-of-truth Purchases / Revenue KPIs.
 *
 * Query params:
 *   ?from=YYYY-MM-DD  (optional, default = today UTC)
 *   ?to=YYYY-MM-DD    (optional, default = now)
 *   ?status=any       (optional, default = any — includes paid + pending)
 */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_VERSION = "2024-01";

interface ShopifyLineItem {
  title: string;
  quantity: number;
  price: string;
  product_id: number;
  variant_id: number;
}

interface ShopifyOrder {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: ShopifyLineItem[];
  landing_site?: string | null;
  referring_site?: string | null;
  source_name?: string | null;
}

/**
 * Returns the ISO timestamp for the start of "today" in the Conceivable
 * store timezone (America/Chicago). Shopify stores orders with their local
 * `created_at`, so a UTC-midnight cutoff misses orders made late evening CT.
 */
function startOfTodayInStoreTZ(): string {
  const tz = "America/Chicago";
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const today = fmt.format(new Date()); // YYYY-MM-DD in store local
  // Build a Date for "today 00:00 store time" then convert to ISO (UTC).
  // We can do this by parsing the local string and using the timezone offset for that date.
  // Easiest: use a tagged ISO with offset calculated from now's offset.
  const probe = new Date();
  const probeLocal = new Date(
    probe.toLocaleString("en-US", { timeZone: tz })
  );
  const offsetMs = probe.getTime() - probeLocal.getTime();
  const localMidnight = new Date(`${today}T00:00:00.000Z`).getTime() + offsetMs;
  return new Date(localMidnight).toISOString();
}

export async function GET(request: Request) {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const storeUrl = process.env.SHOPIFY_STORE_URL;

  if (!accessToken || !storeUrl) {
    return NextResponse.json(
      {
        configured: false,
        error: "Shopify env vars not set (SHOPIFY_ACCESS_TOKEN, SHOPIFY_STORE_URL).",
        orders: [],
        count: 0,
        revenue: 0,
      },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status") || "any";

  const createdAtMin = from ? `${from}T00:00:00-05:00` : startOfTodayInStoreTZ();
  const createdAtMax = to ? `${to}T23:59:59-05:00` : new Date().toISOString();

  const baseUrl = storeUrl.startsWith("https://") ? storeUrl : `https://${storeUrl}`;
  const url = new URL(`${baseUrl}/admin/api/${API_VERSION}/orders.json`);
  url.searchParams.set("status", status);
  url.searchParams.set("created_at_min", createdAtMin);
  url.searchParams.set("created_at_max", createdAtMax);
  url.searchParams.set("limit", "250");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          configured: true,
          error: `Shopify API ${res.status}: ${text.slice(0, 300)}`,
          orders: [],
          count: 0,
          revenue: 0,
        },
        { status: 200 }
      );
    }

    const data = (await res.json()) as { orders: ShopifyOrder[] };
    const orders = data.orders || [];

    // Filter to paid + pending only — exclude refunded/cancelled
    const validOrders = orders.filter(
      (o) =>
        o.financial_status === "paid" ||
        o.financial_status === "partially_paid" ||
        o.financial_status === "pending" ||
        o.financial_status === "authorized"
    );

    const revenue = validOrders.reduce(
      (sum, o) => sum + parseFloat(o.total_price || "0"),
      0
    );

    // Pack-only metrics — orders that contain at least one line item whose
    // title includes "pack" (case-insensitive). This is what Kirsten tracks
    // as the quiz funnel sale (vs single-supplement orders).
    const packOrders = validOrders.filter((o) =>
      (o.line_items || []).some((li) =>
        (li.title || "").toLowerCase().includes("pack")
      )
    );
    const packRevenue = packOrders.reduce(
      (sum, o) => sum + parseFloat(o.total_price || "0"),
      0
    );

    // Slim down for the response
    const slim = validOrders.map((o) => ({
      id: o.id,
      name: o.name,
      email: o.email,
      createdAt: o.created_at,
      total: parseFloat(o.total_price || "0"),
      currency: o.currency,
      financialStatus: o.financial_status,
      fulfillmentStatus: o.fulfillment_status,
      sourceName: o.source_name,
      landingSite: o.landing_site,
      itemCount: o.line_items?.reduce((s, l) => s + l.quantity, 0) || 0,
      items: o.line_items?.map((l) => ({
        title: l.title,
        quantity: l.quantity,
        price: parseFloat(l.price || "0"),
      })),
    }));

    return NextResponse.json({
      configured: true,
      from: createdAtMin,
      to: createdAtMax,
      count: validOrders.length,
      revenue: Math.round(revenue * 100) / 100,
      packCount: packOrders.length,
      packRevenue: Math.round(packRevenue * 100) / 100,
      orders: slim,
    });
  } catch (err) {
    return NextResponse.json(
      {
        configured: true,
        error: err instanceof Error ? err.message : String(err),
        orders: [],
        count: 0,
        revenue: 0,
      },
      { status: 200 }
    );
  }
}
