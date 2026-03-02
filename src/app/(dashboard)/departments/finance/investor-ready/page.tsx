"use client";

import {
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Circle,
  BookOpen,
} from "lucide-react";

const ACCENT = "#1EAA55";

/* ── Investor Metrics ── */
const INVESTOR_METRICS = [
  { label: "Monthly Burn Rate", value: "$18.4K", detail: "Down 4.2% MoM", trend: "down" as const },
  { label: "Runway", value: "6.9 months", detail: "208 days at current burn", trend: "up" as const },
  { label: "CAC (Projected)", value: "$12-18", detail: "Based on content + email engine", trend: "flat" as const },
  { label: "LTV (Projected)", value: "$290-520", detail: "12-18 mo retention @ $29/mo", trend: "up" as const },
  { label: "LTV:CAC Ratio", value: "16-29x", detail: "Industry best-in-class > 3x", trend: "up" as const },
  { label: "Cash on Hand", value: "$127.5K", detail: "Mercury + Stripe", trend: "flat" as const },
];

/* ── Financial Summary Highlights ── */
const HIGHLIGHTS = [
  "Monthly burn decreased 4.2% ($800 reduction) -- driven by API cost optimization",
  "Runway extended by 14 days since last month (THE GAIN)",
  "Affiliate revenue growing -- 23% month-over-month increase",
  "AI costs represent 50% of total spend -- primary lever for burn reduction",
  "On track for launch: financial health supports 5-week runway to first revenue",
];

/* ── Data Room Checklist ── */
const DATA_ROOM_ITEMS = [
  { label: "Cap table (current)", complete: true },
  { label: "Monthly P&L statement (last 6 months)", complete: true },
  { label: "Cash flow projection (12 months)", complete: true },
  { label: "Unit economics model", complete: true },
  { label: "Burn rate trend analysis", complete: true },
  { label: "Revenue projection (3 scenarios)", complete: true },
  { label: "Customer acquisition model", complete: false },
  { label: "Market sizing (TAM/SAM/SOM)", complete: false },
  { label: "Competitive landscape matrix", complete: true },
  { label: "Patent portfolio summary", complete: false },
  { label: "Team bios and org chart", complete: true },
  { label: "Product roadmap (12 months)", complete: true },
];

/* ── Financial Narrative ── */
const NARRATIVE = {
  title: "The Conceivable Financial Story",
  paragraphs: [
    "Conceivable is a capital-efficient pre-revenue company approaching launch with 6.9 months of runway and a declining burn rate. Five consecutive months of reduced burn demonstrate disciplined financial management.",
    "Our projected unit economics are exceptional: a $12-18 CAC driven by organic content and email marketing, combined with a $290-520 LTV from subscription retention, yields an LTV:CAC ratio of 16-29x -- well above the 3x industry benchmark.",
    "The AI-first architecture keeps our team lean while delivering enterprise-grade capability. Our largest cost center (AI APIs at $6.8K/mo) is also our highest-leverage -- every dollar spent on Claude generates content, coaching, and operational intelligence that would require 3-4 full-time employees.",
    "Path to profitability is clear: 521 subscribers at $29/mo achieves break-even. Our waitlist of 2,847 engaged contacts, combined with a content engine producing 20+ pieces per week, positions us to exceed this target within 60 days of launch.",
  ],
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const TREND_COLORS = {
  up: "#1EAA55",
  down: "#1EAA55", // down burn is good
  flat: "var(--muted)",
};

export default function InvestorReadyPage() {
  const completedItems = DATA_ROOM_ITEMS.filter((i) => i.complete).length;
  const totalItems = DATA_ROOM_ITEMS.length;
  const completionPct = Math.round((completedItems / totalItems) * 100);

  return (
    <div>
      {/* Investor Metrics Grid */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Key Metrics for Investors
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INVESTOR_METRICS.map((metric) => {
            const TrendIcon = TREND_ICONS[metric.trend];
            const trendColor = TREND_COLORS[metric.trend];
            return (
              <div
                key={metric.label}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {metric.label}
                  </p>
                  <TrendIcon size={12} style={{ color: trendColor }} />
                </div>
                <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </p>
                <p className="text-[10px]" style={{ color: trendColor }}>
                  {metric.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Summary */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Auto-Generated Financial Summary
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            March 2026
          </span>
        </div>
        <div className="space-y-2">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg p-2"
              style={{ backgroundColor: "var(--background)" }}
            >
              <span className="text-xs mt-0.5" style={{ color: ACCENT }}>&#8226;</span>
              <p className="text-xs" style={{ color: "var(--foreground)" }}>
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Data Room Checklist */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: ACCENT }} />
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                Data Room Checklist
              </h3>
            </div>
            <span className="text-xs font-bold" style={{ color: ACCENT }}>
              {completionPct}% ({completedItems}/{totalItems})
            </span>
          </div>
          <div className="h-2 rounded-full mb-4" style={{ backgroundColor: `${ACCENT}15` }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completionPct}%`, backgroundColor: ACCENT }}
            />
          </div>
          <div className="space-y-1.5">
            {DATA_ROOM_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.complete ? (
                  <CheckCircle2 size={14} style={{ color: ACCENT }} />
                ) : (
                  <Circle size={14} style={{ color: "var(--muted)" }} />
                )}
                <p
                  className="text-xs"
                  style={{ color: item.complete ? "var(--foreground)" : "var(--muted)" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Narrative */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Investor Narrative
            </h3>
          </div>
          <h4 className="text-sm font-bold mb-3" style={{ color: "var(--foreground)" }}>
            {NARRATIVE.title}
          </h4>
          <div className="space-y-3">
            {NARRATIVE.paragraphs.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
