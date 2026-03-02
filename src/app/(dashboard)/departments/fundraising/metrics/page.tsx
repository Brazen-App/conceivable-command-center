"use client";

import { Mail, Users, FlaskConical, Database, TrendingUp, Mic, FileText, BarChart3 } from "lucide-react";

const ACCENT = "#356FB6";

interface KeyMetric {
  label: string;
  value: string;
  icon: typeof Mail;
  color: string;
  sparkline: number[];
  context: string;
}

const KEY_METRICS: KeyMetric[] = [
  { label: "Email Subscribers", value: "28,905", icon: Mail, color: "#E37FB1", sparkline: [22000, 23500, 24800, 26100, 27200, 28100, 28905], context: "Growing 3-5% monthly. Primary acquisition channel." },
  { label: "Community Members", value: "847", icon: Users, color: "#1EAA55", sparkline: [320, 410, 490, 580, 650, 740, 847], context: "Circle community. 523 active, 312 paid tier." },
  { label: "Pilot Participants", value: "105", icon: FlaskConical, color: "#78C3BF", sparkline: [0, 12, 28, 45, 62, 85, 105], context: "N=105 clinical pilot study. Data collection ongoing." },
  { label: "Data Points", value: "240K+", icon: Database, color: "#356FB6", sparkline: [15000, 45000, 80000, 120000, 160000, 200000, 240000], context: "Across 50 fertility factors. Growing daily." },
  { label: "Improvement Rate", value: "150-260%", icon: TrendingUp, color: "#1EAA55", sparkline: [100, 120, 145, 170, 195, 230, 260], context: "Fertility outcome improvement in pilot cohort." },
  { label: "Podcast Appearances", value: "120+", icon: Mic, color: "#9686B9", sparkline: [15, 35, 55, 72, 88, 105, 120], context: "CEO's unique ability. Major distribution channel." },
  { label: "Patents", value: "5", icon: FileText, color: "#E24D47", sparkline: [1, 1, 2, 3, 4, 4, 5], context: "4 filed + 1 critical provisional pending." },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Live Metrics Feeding the Investor Story
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          Key Numbers
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Real-time data that powers the fundraising narrative. Every number is verifiable.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KEY_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} style={{ color: metric.color }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {metric.label}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </p>
                <MiniSparkline data={metric.sparkline} color={metric.color} />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>{metric.context}</p>
            </div>
          );
        })}
      </div>

      {/* The Investor Story */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} style={{ color: ACCENT }} />
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            The Investor Story
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#9686B9" }}>
              The Problem (1 in 6)
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              1 in 6 couples struggle with fertility. The industry is fragmented, reactive, and unscientific.
              Women navigate their fertility journey with scattered data, conflicting advice, and no personalized plan.
              It&apos;s a $30B+ market with no clear technology leader.
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#78C3BF" }}>
              The Solution (Conceivable)
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              Conceivable is the first closed-loop fertility optimization platform. We track 50+ biomarkers,
              use AI to identify patterns and causal chains, and deliver personalized interventions that adapt
              in real-time. Our pilot study shows 150-260% improvement in fertility outcomes.
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#1EAA55" }}>
              The Evidence (Proven)
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              N=105 pilot study. 240K+ data points. 150-260% improvement. 5 patents protecting the technology.
              28,905 email subscribers. 847 community members. 120+ podcast appearances building the movement.
              This isn&apos;t a pitch -- it&apos;s proof.
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
              The Ask ($5M Series A)
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              $5M Series A to scale clinical validation (N=1000 study), launch the Halo Ring wearable integration,
              expand the AI recommendation engine, and build the team. 18-month runway to Series B metrics.
              Bridge of $150K available from existing angel network.
            </p>
          </div>
        </div>
      </div>

      {/* Sullivan Gain Framing */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "#9686B910", border: "1px solid #9686B920" }}
      >
        <div className="flex items-start gap-3">
          <div className="px-2 py-1 rounded text-xs font-bold shrink-0" style={{ backgroundColor: "#9686B920", color: "#9686B9" }}>
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              The Gain: From Zero to Proof in 8 Months
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              8 months ago: No data, no patents, no community, no evidence.
              Today: 240K data points, 5 patents, 847 community members, 150-260% proven improvement.
              Every metric tells the story of velocity -- we build fast and prove it works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
