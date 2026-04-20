"use client";

import { useState, useEffect } from "react";

/* ── Theme tokens ─────────────────────────────────────────────── */
const T = {
  bg: "#0C0C0B",
  surface: "#141412",
  surfaceHover: "#1A1A17",
  border: "#1E1E1C",
  blue: "#5A6FFF",
  blueLight: "#ACB7FF",
  green: "#1EAA55",
  greenLight: "#2DD66B",
  pink: "#E37FB1",
  yellow: "#F1C028",
  red: "#E24D47",
  text: "#F0EDE4",
  textMid: "#B8B4AC",
  textMuted: "#686460",
  font: "system-ui, -apple-system, sans-serif",
};

/* ── Types ────────────────────────────────────────────────────── */
interface FunnelData {
  funnel: {
    landingPageViews: number;
    chatStarted: number;
    packPresented: number;
    cartClicked: number;
    emailsCaptured: number;
    purchases: number;
    revenue: number;
    subscribers: number;
  };
  conversionRates: {
    chatToPackRate: number;
    packToCartRate: number;
    cartToPurchaseRate: number;
    overallRate: number;
    emailCaptureRate: number;
  };
  comparison: {
    quiz: { completions: number };
    kai: { conversations: number; packs: number; carts: number; emails: number };
  };
  dailyTrend: { date: string; chats: number; packs: number; carts: number; emails: number }[];
  shopify: {
    totalOrders: number;
    totalRevenue: number;
    recentOrders: { date: string; total: number; items: string[] }[];
  };
  generatedAt: string;
}

/* ── Helpers ──────────────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

function money(n: number): string {
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pct(n: number): string {
  return n.toFixed(1) + "%";
}

/* ── Funnel step component ────────────────────────────────────── */
function FunnelStep({
  label,
  value,
  rate,
  color,
  widthPct,
  isFirst,
  icon,
}: {
  label: string;
  value: number;
  rate: string | null;
  color: string;
  widthPct: number;
  isFirst: boolean;
  icon: string;
}) {
  return (
    <div style={{ marginBottom: 2 }}>
      {/* Rate arrow between steps */}
      {!isFirst && rate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 0 4px 20px",
            color: T.textMuted,
            fontSize: 12,
          }}
        >
          <span style={{ fontSize: 14 }}>&#8595;</span>
          <span style={{ color: T.textMid, fontWeight: 600 }}>{rate}</span>
          <span>conversion</span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 20px",
          borderRadius: 12,
          background: `linear-gradient(90deg, ${color}12 0%, ${T.surface} ${Math.max(widthPct, 30)}%)`,
          border: `1px solid ${color}30`,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1.1 }}>
            {fmt(value)}
          </div>
        </div>
        {/* Mini bar */}
        <div
          style={{
            width: 80,
            height: 6,
            borderRadius: 3,
            background: `${color}20`,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${Math.max(widthPct, 2)}%`,
              height: "100%",
              borderRadius: 3,
              background: color,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Stat card component ──────────────────────────────────────── */
function StatCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: T.textMuted,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      {sublabel && (
        <div style={{ fontSize: 12, color: T.textMuted }}>{sublabel}</div>
      )}
    </div>
  );
}

/* ── Comparison bar ───────────────────────────────────────────── */
function ComparisonRow({
  label,
  quizVal,
  kaiVal,
}: {
  label: string;
  quizVal: number;
  kaiVal: number;
}) {
  const maxVal = Math.max(quizVal, kaiVal, 1);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 13,
          color: T.textMid,
        }}
      >
        <span>{label}</span>
        <span style={{ color: T.textMuted, fontSize: 12 }}>
          Quiz: {fmt(quizVal)} | Kai: {fmt(kaiVal)}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {/* Quiz bar */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 24,
              borderRadius: 6,
              background: `${T.pink}15`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(quizVal / maxVal) * 100}%`,
                height: "100%",
                borderRadius: 6,
                background: `linear-gradient(90deg, ${T.pink}80, ${T.pink})`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
                fontSize: 11,
                color: T.text,
                fontWeight: 600,
                minWidth: quizVal > 0 ? 40 : 0,
                transition: "width 0.6s ease",
              }}
            >
              {quizVal > 0 && fmt(quizVal)}
            </div>
          </div>
          <div style={{ fontSize: 10, color: T.pink, marginTop: 2, opacity: 0.7 }}>Quiz</div>
        </div>
        {/* Kai bar */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 24,
              borderRadius: 6,
              background: `${T.blue}15`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(kaiVal / maxVal) * 100}%`,
                height: "100%",
                borderRadius: 6,
                background: `linear-gradient(90deg, ${T.blue}80, ${T.blue})`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
                fontSize: 11,
                color: T.text,
                fontWeight: 600,
                minWidth: kaiVal > 0 ? 40 : 0,
                transition: "width 0.6s ease",
              }}
            >
              {kaiVal > 0 && fmt(kaiVal)}
            </div>
          </div>
          <div style={{ fontSize: 10, color: T.blue, marginTop: 2, opacity: 0.7 }}>Kai</div>
        </div>
      </div>
    </div>
  );
}

/* ── Daily trend mini chart ───────────────────────────────────── */
function DailyTrendChart({
  data,
}: {
  data: { date: string; chats: number; packs: number; carts: number }[];
}) {
  if (data.length === 0) return null;
  const last14 = data.slice(-14);
  const maxChats = Math.max(...last14.map((d) => d.chats), 1);

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: T.textMuted,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Daily Trend (last 14 days)
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
        {last14.map((day) => {
          const chatH = (day.chats / maxChats) * 80 + 4;
          const packH = (day.packs / maxChats) * 80 + 2;
          return (
            <div
              key={day.date}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
              title={`${day.date}: ${day.chats} chats, ${day.packs} packs, ${day.carts} carts`}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 24,
                    height: chatH,
                    borderRadius: 4,
                    background: `${T.blue}60`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      height: packH,
                      borderRadius: "0 0 4px 4px",
                      background: T.green,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: T.textMuted,
                  transform: "rotate(-45deg)",
                  whiteSpace: "nowrap",
                  marginTop: 4,
                }}
              >
                {day.date.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          fontSize: 11,
          color: T.textMuted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${T.blue}60` }} />
          Chats
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${T.green}B3` }} />
          Packs
        </div>
      </div>
    </div>
  );
}

/* ── Recent orders table ──────────────────────────────────────── */
function RecentOrders({ orders }: { orders: { date: string; total: number; items: string[] }[] }) {
  if (orders.length === 0) {
    return (
      <div style={{ color: T.textMuted, fontSize: 13, padding: 16 }}>
        No Shopify orders yet. Connect SHOPIFY_ADMIN_API_TOKEN to see purchase data.
      </div>
    );
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {["Date", "Amount", "Items"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderBottom: `1px solid ${T.border}`,
                  color: T.textMuted,
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i}>
              <td style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}22`, color: T.textMid }}>
                {new Date(o.date).toLocaleDateString()}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: `1px solid ${T.border}22`,
                  color: T.green,
                  fontWeight: 600,
                }}
              >
                {money(o.total)}
              </td>
              <td
                style={{
                  padding: "10px 12px",
                  borderBottom: `1px solid ${T.border}22`,
                  color: T.textMuted,
                  maxWidth: 300,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {o.items.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function KaiSubscriptionFunnelPage() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/kai-subscription-funnel")
      .then((r) => {
        if (!r.ok) throw new Error(`API error ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `3px solid ${T.border}`,
              borderTopColor: T.blue,
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ color: T.textMuted, fontSize: 14 }}>Loading subscription funnel...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
        }}
      >
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.red}40`,
            borderRadius: 14,
            padding: 32,
            textAlign: "center",
            maxWidth: 400,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>!</div>
          <div style={{ color: T.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Failed to load funnel data
          </div>
          <div style={{ color: T.textMuted, fontSize: 13 }}>{error || "Unknown error"}</div>
        </div>
      </div>
    );
  }

  const { funnel, conversionRates, comparison, dailyTrend, shopify } = data;

  // Calculate funnel widths relative to max step
  const maxStep = Math.max(
    funnel.chatStarted,
    funnel.packPresented,
    funnel.cartClicked,
    funnel.purchases,
    1
  );

  const funnelSteps = [
    {
      label: "Landing Page Views",
      value: funnel.landingPageViews,
      rate: null,
      color: T.textMid,
      icon: "\u{1F30D}",
    },
    {
      label: "Chat Started",
      value: funnel.chatStarted,
      rate: funnel.landingPageViews > 0
        ? pct((funnel.chatStarted / funnel.landingPageViews) * 100)
        : null,
      color: T.blue,
      icon: "\u{1F4AC}",
    },
    {
      label: "Pack Presented",
      value: funnel.packPresented,
      rate: pct(conversionRates.chatToPackRate),
      color: T.blueLight,
      icon: "\u{1F48A}",
    },
    {
      label: "Cart Clicked",
      value: funnel.cartClicked,
      rate: pct(conversionRates.packToCartRate),
      color: T.yellow,
      icon: "\u{1F6D2}",
    },
    {
      label: "Purchased",
      value: funnel.purchases,
      rate: pct(conversionRates.cartToPurchaseRate),
      color: T.green,
      icon: "\u2705",
    },
    {
      label: "Subscribed",
      value: funnel.subscribers,
      rate: funnel.purchases > 0
        ? pct((funnel.subscribers / funnel.purchases) * 100)
        : "0.0%",
      color: T.pink,
      icon: "\u{1F504}",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: T.font,
        color: T.text,
        padding: "24px 24px 60px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Header ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: T.blue,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Kai Subscription Funnel
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: T.text }}>
                Chat to Subscription Pipeline
              </h1>
              <p style={{ fontSize: 14, color: T.textMuted, margin: "6px 0 0" }}>
                Full conversion funnel from Kai chat engagement through purchase and subscription
              </p>
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textMuted,
                background: T.surface,
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
              }}
            >
              Updated {new Date(data.generatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* ── Top KPI Cards ───────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <StatCard
            label="Total Conversations"
            value={fmt(funnel.chatStarted)}
            sublabel="Non-test Kai sessions"
            color={T.blue}
          />
          <StatCard
            label="Packs Presented"
            value={fmt(funnel.packPresented)}
            sublabel={`${pct(conversionRates.chatToPackRate)} of chats`}
            color={T.blueLight}
          />
          <StatCard
            label="Emails Captured"
            value={fmt(funnel.emailsCaptured)}
            sublabel={`${pct(conversionRates.emailCaptureRate)} capture rate`}
            color={T.yellow}
          />
          <StatCard
            label="Revenue"
            value={money(funnel.revenue)}
            sublabel={`${funnel.purchases} orders`}
            color={T.green}
          />
          <StatCard
            label="Overall Conversion"
            value={pct(conversionRates.overallRate)}
            sublabel="Chat to purchase"
            color={T.pink}
          />
        </div>

        {/* ── Main Grid: Funnel + Sidebar ─────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left: Funnel Pipeline */}
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.text,
                marginBottom: 20,
              }}
            >
              Conversion Funnel
            </div>
            {funnelSteps.map((step, i) => (
              <FunnelStep
                key={step.label}
                label={step.label}
                value={step.value}
                rate={step.rate}
                color={step.color}
                widthPct={
                  step.value === 0
                    ? 3
                    : Math.max((step.value / maxStep) * 100, 5)
                }
                isFirst={i === 0}
                icon={step.icon}
              />
            ))}

            {/* Note about placeholders */}
            {(funnel.landingPageViews === 0 || funnel.subscribers === 0) && (
              <div
                style={{
                  marginTop: 20,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: `${T.yellow}10`,
                  border: `1px solid ${T.yellow}25`,
                  fontSize: 12,
                  color: T.textMuted,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: T.yellow, fontWeight: 700 }}>Note:</span>{" "}
                Landing Page Views require PostHog integration. Subscriber count requires
                Stripe integration. These show as 0 until connected.
              </div>
            )}
          </div>

          {/* Right: Sidebar panels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Quiz vs Kai comparison */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: 4,
                }}
              >
                Quiz vs Kai
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>
                Side-by-side acquisition comparison
              </div>

              <ComparisonRow
                label="Completions / Conversations"
                quizVal={comparison.quiz.completions}
                kaiVal={comparison.kai.conversations}
              />
              <ComparisonRow
                label="Packs Recommended"
                quizVal={comparison.quiz.completions}
                kaiVal={comparison.kai.packs}
              />
              <ComparisonRow
                label="Cart / Links Shown"
                quizVal={comparison.quiz.completions}
                kaiVal={comparison.kai.carts}
              />
              <ComparisonRow
                label="Emails Captured"
                quizVal={comparison.quiz.completions}
                kaiVal={comparison.kai.emails}
              />

              {/* Winner badge */}
              {(comparison.kai.conversations > 0 || comparison.quiz.completions > 0) && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: comparison.kai.packs >= comparison.quiz.completions
                      ? `${T.blue}12`
                      : `${T.pink}12`,
                    border: `1px solid ${
                      comparison.kai.packs >= comparison.quiz.completions
                        ? T.blue
                        : T.pink
                    }30`,
                    fontSize: 12,
                    color: T.textMid,
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {comparison.kai.packs >= comparison.quiz.completions ? "Kai" : "Quiz"}
                  </span>{" "}
                  is currently leading in pack recommendations
                </div>
              )}
            </div>

            {/* Daily trend */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <DailyTrendChart data={dailyTrend} />
              {dailyTrend.length === 0 && (
                <div style={{ color: T.textMuted, fontSize: 13, textAlign: "center", padding: 20 }}>
                  No daily data yet
                </div>
              )}
            </div>

            {/* Conversion rate breakdown */}
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: 16,
                }}
              >
                Rate Breakdown
              </div>
              {[
                { label: "Chat \u2192 Pack", value: conversionRates.chatToPackRate, color: T.blue },
                { label: "Pack \u2192 Cart", value: conversionRates.packToCartRate, color: T.yellow },
                { label: "Cart \u2192 Purchase", value: conversionRates.cartToPurchaseRate, color: T.green },
                { label: "Email Capture", value: conversionRates.emailCaptureRate, color: T.blueLight },
                { label: "Overall (Chat \u2192 Purchase)", value: conversionRates.overallRate, color: T.pink },
              ].map((r) => (
                <div key={r.label} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: T.textMid }}>{r.label}</span>
                    <span style={{ color: r.color, fontWeight: 700 }}>{pct(r.value)}</span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: `${r.color}15`,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(r.value, 100)}%`,
                        height: "100%",
                        borderRadius: 3,
                        background: r.color,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Orders ───────────────────────────────────── */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: 24,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
                Recent Shopify Orders
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                Last 10 paid orders from Shopify Admin API
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: T.green,
              }}
            >
              {money(shopify.totalRevenue)}
            </div>
          </div>
          <RecentOrders orders={shopify.recentOrders} />
        </div>

        {/* ── Responsive mobile override ──────────────────────── */}
        <style>{`
          @media (max-width: 900px) {
            div[style*="grid-template-columns: 1fr 380px"] {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 600px) {
            div[style*="grid-template-columns: repeat(auto-fit"] {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
