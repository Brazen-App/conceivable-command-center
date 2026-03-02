"use client";

import {
  Wallet,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowRight,
  Flame,
} from "lucide-react";

const ACCENT = "#1EAA55";

/* ── Finance Data (from finance-data.ts mock values) ── */
const CASH_POSITION = 127_450;
const MONTHLY_BURN = 18_400;
const DAILY_BURN = 613;
const RUNWAY_MONTHS = 6.9;
const RUNWAY_DAYS = 208;
const RUNWAY_EXTENDED_DAYS = 14;
const PREV_MONTHLY_BURN = 19_200;
const REVENUE = 3_300;

const COST_BREAKDOWN = [
  { category: "AI & API Costs", amount: 9_200, color: "#5A6FFF" },
  { category: "People & Contractors", amount: 7_500, color: "#E37FB1" },
  { category: "Infrastructure", amount: 2_600, color: "#F1C028" },
  { category: "SaaS & Tools", amount: 2_400, color: "#9686B9" },
];

const BURN_REDUCTION = PREV_MONTHLY_BURN - MONTHLY_BURN;
const BURN_REDUCTION_PCT = ((BURN_REDUCTION / PREV_MONTHLY_BURN) * 100).toFixed(1);

function getRunwayColor(months: number) {
  if (months > 6) return ACCENT;
  if (months > 3) return "#F1C028";
  return "#E24D47";
}

export default function FinanceDashboardPage() {
  const runwayColor = getRunwayColor(RUNWAY_MONTHS);

  return (
    <div>
      {/* Hero: Cash Position */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}08)`,
          border: `1px solid ${ACCENT}25`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: ACCENT }}
            >
              Cash Position
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              ${CASH_POSITION.toLocaleString()}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Mercury Checking + Savings + Stripe &middot; As of March 1, 2026
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: ACCENT }}>
              +{RUNWAY_EXTENDED_DAYS}
            </span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              days of runway gained
            </span>
          </div>
        </div>
      </div>

      {/* Mock data notice */}
      <div
        className="rounded-lg px-3 py-2 mb-6 flex items-center gap-2"
        style={{ backgroundColor: "#F1C02810", border: "1px solid #F1C02820" }}
      >
        <span
          className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: "#F1C02818", color: "#B8930A" }}
        >
          MOCK
        </span>
        <p className="text-[11px]" style={{ color: "var(--muted)" }}>
          Displaying mock data. Will connect to COO&apos;s Convex finance tool for live Plaid/Stripe data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Burn Rate Card */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} style={{ color: "#E24D47" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Burn Rate
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            ${MONTHLY_BURN.toLocaleString()}<span className="text-xs font-normal" style={{ color: "var(--muted)" }}>/mo</span>
          </p>
          <p className="text-xs mt-1" style={{ color: ACCENT }}>
            Down {BURN_REDUCTION_PCT}% (${BURN_REDUCTION.toLocaleString()} saved)
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            ${DAILY_BURN}/day
          </p>
        </div>

        {/* Runway Indicator */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} style={{ color: runwayColor }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Runway
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: runwayColor }}>
            {RUNWAY_MONTHS.toFixed(1)} months
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            {RUNWAY_DAYS} days at current burn
          </p>
          <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: `${runwayColor}20` }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((RUNWAY_MONTHS / 12) * 100, 100)}%`,
                backgroundColor: runwayColor,
              }}
            />
          </div>
        </div>

        {/* Revenue Card */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Revenue
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            ${REVENUE.toLocaleString()}<span className="text-xs font-normal" style={{ color: "var(--muted)" }}>/mo</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Advisory + Affiliate
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: ACCENT }}>
            Pre-launch; subscriptions not yet active
          </p>
        </div>

        {/* Net Burn Card */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} style={{ color: "#F1C028" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Net Burn
            </h3>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            -${(MONTHLY_BURN - REVENUE).toLocaleString()}<span className="text-xs font-normal" style={{ color: "var(--muted)" }}>/mo</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            After revenue offset
          </p>
        </div>
      </div>

      {/* Cost Breakdown Mini Chart */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Cost Breakdown
          </h3>
        </div>
        {/* Stacked bar */}
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {COST_BREAKDOWN.map((item) => (
            <div
              key={item.category}
              className="h-full"
              style={{
                width: `${(item.amount / COST_BREAKDOWN.reduce((a, b) => a + b.amount, 0)) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.category}: $${item.amount.toLocaleString()}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COST_BREAKDOWN.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  ${item.amount.toLocaleString()}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Department Connection */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={16} style={{ color: "#E37FB1" }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Cross-Department Connection
          </h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E37FB114", color: "#E37FB1" }}>
            10x
          </span>
        </div>
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#E37FB108", border: "1px solid #E37FB115" }}
        >
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Runway feeds Fundraising urgency
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              At 6.9 months runway, fundraising conversations should begin now. Every month of declining burn rate strengthens the investor narrative. Show 5 consecutive months of disciplined spend reduction to de-risk the raise.
            </p>
          </div>
          <ArrowRight size={16} style={{ color: "#E37FB1" }} />
        </div>
      </div>
    </div>
  );
}
