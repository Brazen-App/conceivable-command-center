"use client";

import { BarChart3, TrendingUp, ArrowRight, Star, Lightbulb } from "lucide-react";

const ACCENT = "#1EAA55";

interface RetentionPoint {
  week: string;
  retained: number;
}

const RETENTION_CURVE: RetentionPoint[] = [
  { week: "Week 1", retained: 100 },
  { week: "Week 2", retained: 82 },
  { week: "Week 3", retained: 71 },
  { week: "Week 4", retained: 64 },
  { week: "Week 6", retained: 55 },
  { week: "Week 8", retained: 48 },
  { week: "Week 12", retained: 42 },
  { week: "Week 16", retained: 38 },
  { week: "Week 24", retained: 35 },
];

interface EngagementTier {
  tier: string;
  criteria: string;
  count: number;
  pctOfTotal: number;
  avgRetention: number;
  color: string;
}

const ENGAGEMENT_TIERS: EngagementTier[] = [
  { tier: "Power Users", criteria: "5+ posts/week, daily login", count: 48, pctOfTotal: 6, avgRetention: 95, color: "#1EAA55" },
  { tier: "Active Contributors", criteria: "2-4 posts/week, 4+ logins", count: 134, pctOfTotal: 16, avgRetention: 82, color: "#356FB6" },
  { tier: "Regular Readers", criteria: "1+ login/week, occasional post", count: 341, pctOfTotal: 40, avgRetention: 58, color: "#78C3BF" },
  { tier: "Lurkers", criteria: "Monthly login, no posts", count: 198, pctOfTotal: 23, avgRetention: 32, color: "#F1C028" },
  { tier: "At Risk", criteria: "No login in 30+ days", count: 126, pctOfTotal: 15, avgRetention: 8, color: "#E24D47" },
];

interface ConversionStep {
  from: string;
  to: string;
  count: number;
  rate: number;
  avgTimeToConvert: string;
}

const CONVERSION_FUNNEL: ConversionStep[] = [
  { from: "Free", to: "Paid", count: 312, rate: 36.8, avgTimeToConvert: "21 days" },
  { from: "Paid", to: "Early Access", count: 89, rate: 28.5, avgTimeToConvert: "45 days" },
  { from: "Free", to: "Early Access", count: 89, rate: 10.5, avgTimeToConvert: "62 days" },
];

const WEEKLY_RECOMMENDATION = {
  title: "Double Down on Live Q&A Format",
  insight: "Live Q&As generate 45 avg replies vs 24 for standard discussion prompts -- nearly 2x engagement. CEO live sessions drive the highest conversion-to-action (28%) of any content type.",
  action: "Increase CEO Live Q&As from 1x/week to 2x/week. Add one agent-assisted Q&A on science topics. This leverages Kirsten's unique ability (storytelling + science) while the agent handles follow-up.",
  impact: "Projected 35% increase in weekly engagement. Supports community retention AND fundraising narrative (active, engaged community).",
  label: "10x" as const,
};

function RetentionChart({ data }: { data: RetentionPoint[] }) {
  const width = 400;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + (1 - d.retained / 100) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Y-axis labels */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <text
            x={padding.left - 5}
            y={padding.top + (1 - v / 100) * chartHeight}
            textAnchor="end"
            dominantBaseline="middle"
            fill="var(--muted)"
            fontSize="9"
          >
            {v}%
          </text>
          <line
            x1={padding.left}
            y1={padding.top + (1 - v / 100) * chartHeight}
            x2={width - padding.right}
            y2={padding.top + (1 - v / 100) * chartHeight}
            stroke="var(--border)"
            strokeDasharray="3,3"
          />
        </g>
      ))}
      {/* Area fill */}
      <path d={areaD} fill="url(#retentionGrad)" />
      {/* Line */}
      <path d={pathD} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={ACCENT} />
          <text
            x={p.x}
            y={padding.top + chartHeight + 14}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="8"
          >
            {p.week.replace("Week ", "W")}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Retention Curves */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Retention Curve</h2>
        </div>
        <RetentionChart data={RETENTION_CURVE} />
        <div className="mt-3 flex items-center gap-2">
          <TrendingUp size={12} style={{ color: "#1EAA55" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            35% retained at Week 24. Industry benchmark: 20-25% for health communities.
          </span>
        </div>
      </div>

      {/* Engagement Scoring by Tier */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Engagement Scoring by Tier
        </h2>
        <div className="space-y-4">
          {ENGAGEMENT_TIERS.map((tier) => (
            <div key={tier.tier}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{tier.tier}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>({tier.criteria})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{tier.count} members</span>
                  <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.pctOfTotal}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${tier.pctOfTotal}%`, backgroundColor: tier.color }}
                  />
                </div>
                <span className="text-xs w-16 text-right" style={{ color: "var(--muted)" }}>
                  {tier.avgRetention}% retained
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free -> Paid -> Early Access Conversion */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight size={16} style={{ color: "#356FB6" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Conversion Funnel: Free → Paid → Early Access
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONVERSION_FUNNEL.map((step) => (
            <div
              key={`${step.from}-${step.to}`}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{step.from}</span>
                <ArrowRight size={12} style={{ color: ACCENT }} />
                <span className="text-xs font-medium" style={{ color: ACCENT }}>{step.to}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {step.rate}%
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {step.count} converted -- avg {step.avgTimeToConvert}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Star size={12} style={{ color: "#F1C028" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            36.8% free-to-paid conversion is well above the 5-10% industry benchmark for community products.
          </span>
        </div>
      </div>

      {/* Weekly Recommendation */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            {WEEKLY_RECOMMENDATION.label}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Weekly Recommendation: {WEEKLY_RECOMMENDATION.title}
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>Insight</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground)" }}>{WEEKLY_RECOMMENDATION.insight}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>Action</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground)" }}>{WEEKLY_RECOMMENDATION.action}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: ACCENT }}>Impact</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground)" }}>{WEEKLY_RECOMMENDATION.impact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
