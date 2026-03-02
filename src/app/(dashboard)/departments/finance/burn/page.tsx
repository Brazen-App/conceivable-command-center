"use client";

import { Flame, TrendingDown, ArrowDown } from "lucide-react";

const ACCENT = "#1EAA55";

/* ── Burn Tracking Data ── */
const DAILY_BURN = 613;
const WEEKLY_BURN_AVG = 4_280;
const MONTHLY_BURN = 18_400;
const PREV_MONTHLY_BURN = 19_200;

const BURN_TREND = "decreasing" as const; // burn is going down (good)

const WEEKLY_DATA = [
  { week: "Feb 3", burn: 4_800 },
  { week: "Feb 10", burn: 4_600 },
  { week: "Feb 17", burn: 4_200 },
  { week: "Feb 24", burn: 4_400 },
  { week: "Mar 1", burn: 4_400 },
];

const MONTHLY_DATA = [
  { month: "Oct 2025", burn: 22_100 },
  { month: "Nov 2025", burn: 21_300 },
  { month: "Dec 2025", burn: 20_800 },
  { month: "Jan 2026", burn: 19_200 },
  { month: "Feb 2026", burn: 18_400 },
];

/* ── Cost Breakdown by Category ── */
const COST_CATEGORIES = [
  {
    category: "AI & API Costs",
    total: 9_200,
    items: [
      { name: "Anthropic (Claude)", amount: 6_800, note: "Agent system, content gen, briefs" },
      { name: "OpenAI (embeddings)", amount: 1_200, note: "Similarity search, RAG" },
      { name: "Google AI (Gemini)", amount: 700, note: "Multi-model fallback" },
      { name: "Other APIs", amount: 500, note: "Mailchimp, Late, social APIs" },
    ],
    color: "#5A6FFF",
  },
  {
    category: "People & Contractors",
    total: 7_500,
    items: [
      { name: "Design Contractor", amount: 4_000, note: "Brand + UI work" },
      { name: "Clinical Advisor", amount: 2_000, note: "Medical review" },
      { name: "Legal (hourly)", amount: 1_500, note: "Patent + compliance" },
    ],
    color: "#E37FB1",
  },
  {
    category: "Infrastructure",
    total: 2_600,
    items: [
      { name: "Vercel", amount: 800, note: "Hosting + serverless" },
      { name: "Convex", amount: 600, note: "Database + real-time" },
      { name: "Neon (PostgreSQL)", amount: 400, note: "Prisma DB" },
      { name: "Domain / DNS / CDN", amount: 200, note: "Cloudflare + domains" },
      { name: "Monitoring & Logging", amount: 600, note: "Datadog, Sentry" },
    ],
    color: "#F1C028",
  },
  {
    category: "SaaS & Tools",
    total: 2_400,
    items: [
      { name: "Circle (Community)", amount: 500 },
      { name: "Mailchimp", amount: 350 },
      { name: "Late (Social)", amount: 200 },
      { name: "Figma", amount: 150 },
      { name: "Notion", amount: 200 },
      { name: "Misc Tools", amount: 1_000 },
    ],
    color: "#9686B9",
  },
];

/* ── Top Expenses ── */
const TOP_EXPENSES = [
  { name: "Anthropic (Claude)", amount: 6_800, category: "AI & API", pctOfTotal: 37 },
  { name: "Design Contractor", amount: 4_000, category: "People", pctOfTotal: 21.7 },
  { name: "Clinical Advisor", amount: 2_000, category: "People", pctOfTotal: 10.9 },
  { name: "Legal (hourly)", amount: 1_500, category: "People", pctOfTotal: 8.2 },
  { name: "OpenAI (embeddings)", amount: 1_200, category: "AI & API", pctOfTotal: 6.5 },
];

export default function BurnRatePage() {
  const maxWeekly = Math.max(...WEEKLY_DATA.map((d) => d.burn));
  const maxMonthly = Math.max(...MONTHLY_DATA.map((d) => d.burn));
  const burnReduction = PREV_MONTHLY_BURN - MONTHLY_BURN;
  const burnReductionPct = ((burnReduction / PREV_MONTHLY_BURN) * 100).toFixed(1);

  return (
    <div>
      {/* Burn Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Flame size={20} className="mx-auto mb-2" style={{ color: "#E24D47" }} />
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            ${DAILY_BURN}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Daily Burn</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            ${WEEKLY_BURN_AVG.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Weekly Average</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            ${MONTHLY_BURN.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Monthly Burn</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <ArrowDown size={12} style={{ color: ACCENT }} />
            <span className="text-xs font-medium" style={{ color: ACCENT }}>
              {burnReductionPct}% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Trend: Weekly */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Weekly Burn Trend
          </h3>
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
          >
            {BURN_TREND === "decreasing" ? "Decreasing" : "Increasing"}
          </span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {WEEKLY_DATA.map((d) => {
            const height = (d.burn / maxWeekly) * 100;
            return (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: "var(--foreground)" }}>
                  ${(d.burn / 1000).toFixed(1)}K
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: ACCENT,
                    opacity: 0.7,
                  }}
                />
                <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                  {d.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend: Monthly */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Monthly Burn Trend (5-Month)
        </h3>
        <div className="flex items-end gap-2 h-36">
          {MONTHLY_DATA.map((d, i) => {
            const height = (d.burn / maxMonthly) * 100;
            const isLatest = i === MONTHLY_DATA.length - 1;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold" style={{ color: isLatest ? ACCENT : "var(--foreground)" }}>
                  ${(d.burn / 1000).toFixed(1)}K
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isLatest ? ACCENT : `${ACCENT}40`,
                  }}
                />
                <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                  {d.month.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-center mt-3" style={{ color: ACCENT }}>
          5 consecutive months of declining burn rate -- strong narrative for investors
        </p>
      </div>

      {/* Cost Breakdown by Category */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Cost Breakdown by Category
        </h3>
        <div className="space-y-4">
          {COST_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }} />
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {cat.category}
                  </p>
                </div>
                <p className="text-sm font-bold" style={{ color: cat.color }}>
                  ${cat.total.toLocaleString()}/mo
                </p>
              </div>
              <div className="ml-5 space-y-1">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-1"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: "var(--foreground)" }}>{item.name}</p>
                      {"note" in item && item.note && (
                        <p className="text-[10px]" style={{ color: "var(--muted)" }}>{item.note}</p>
                      )}
                    </div>
                    <p className="text-xs font-medium shrink-0" style={{ color: "var(--foreground)" }}>
                      ${item.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expenses */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Top 5 Expenses
        </h3>
        <div className="space-y-2">
          {TOP_EXPENSES.map((exp, i) => (
            <div
              key={exp.name}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {exp.name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {exp.category}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  ${exp.amount.toLocaleString()}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {exp.pctOfTotal}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
