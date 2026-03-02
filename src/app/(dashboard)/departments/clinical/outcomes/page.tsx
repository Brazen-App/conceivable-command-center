"use client";

import { useState } from "react";
import { TrendingUp, Users, Heart, Activity, Award, BarChart3 } from "lucide-react";

const ACCENT = "#78C3BF";

interface OutcomeMetric {
  label: string;
  fromValue: number;
  toValue: number;
  unit: string;
  improvement: string;
  description: string;
}

const KEY_OUTCOMES: OutcomeMetric[] = [
  { label: "Conception Rate", fromValue: 12, toValue: 43, unit: "%", improvement: "150-260%", description: "Composite conception rate improvement across pilot cohort" },
  { label: "Ovulation Regularity", fromValue: 58, toValue: 78, unit: "%", improvement: "34%", description: "Percentage of cycles with confirmed ovulation via BBT + LH" },
  { label: "Luteal Phase Quality", fromValue: 9.2, toValue: 11.3, unit: "days", improvement: "23%", description: "Average luteal phase length improvement" },
  { label: "Progesterone Response", fromValue: 6.8, toValue: 12.4, unit: "ng/mL", improvement: "82%", description: "Mid-luteal progesterone levels" },
  { label: "Cycle Regularity", fromValue: 34, toValue: 28, unit: "day avg", improvement: "18%", description: "Reduction in cycle length variability" },
  { label: "Time to Conception", fromValue: 8.5, toValue: 4.2, unit: "months", improvement: "51%", description: "Average months of trying before conception" },
];

interface UserCohort {
  tier: string;
  count: number;
  avgImprovement: number;
  topOutcome: string;
}

const USER_COHORTS: UserCohort[] = [
  { tier: "Early Access", count: 89, avgImprovement: 78, topOutcome: "Ovulation regularity +34%" },
  { tier: "Paid Members", count: 312, avgImprovement: 62, topOutcome: "Cycle tracking compliance +45%" },
  { tier: "Free Members", count: 446, avgImprovement: 28, topOutcome: "Awareness + education scores +55%" },
];

function GainProgressBar({ from, to, unit, color }: { from: number; to: number; unit: string; color: string }) {
  const max = Math.max(from, to) * 1.2;
  const fromPct = (from / max) * 100;
  const toPct = (to / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs w-16" style={{ color: "var(--muted)" }}>Start</span>
        <div className="flex-1 h-3 rounded-full relative" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full absolute left-0 top-0"
            style={{ width: `${fromPct}%`, backgroundColor: `${color}40` }}
          />
        </div>
        <span className="text-xs font-medium w-16 text-right" style={{ color: "var(--muted)" }}>
          {from}{unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs w-16 font-medium" style={{ color }}>Now</span>
        <div className="flex-1 h-3 rounded-full relative" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full absolute left-0 top-0 transition-all duration-1000"
            style={{ width: `${toPct}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-bold w-16 text-right" style={{ color }}>
          {to}{unit}
        </span>
      </div>
    </div>
  );
}

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

export default function OutcomesPage() {
  return (
    <div className="space-y-6">
      {/* Hero: The Gain, Not the Gap */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
          The Gain, Not the Gap
        </p>
        <p className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
          150-260%
        </p>
        <p className="text-lg" style={{ color: "var(--muted)" }}>
          improvement in fertility outcomes
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            N=105 pilot participants -- 240K+ data points -- 8 months of tracking
          </span>
        </div>
      </div>

      {/* User Outcomes Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Users size={20} style={{ color: ACCENT }} className="mx-auto mb-2" />
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>847</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>total users tracked</p>
        </div>
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Activity size={20} style={{ color: "#1EAA55" }} className="mx-auto mb-2" />
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>68</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>avg improvement score</p>
          <MiniSparkline data={[32, 38, 42, 48, 52, 58, 62, 65, 68]} color="#1EAA55" />
        </div>
        <div
          className="rounded-xl p-5 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Heart size={20} style={{ color: "#E37FB1" }} className="mx-auto mb-2" />
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>47</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>success stories</p>
        </div>
      </div>

      {/* Key Outcomes: From X to Y Progress Bars */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Key Outcomes: From X to Y (The Gain)
        </h2>
        <div className="space-y-6">
          {KEY_OUTCOMES.map((outcome) => (
            <div key={outcome.label}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {outcome.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {outcome.description}
                  </p>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-bold shrink-0"
                  style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                >
                  +{outcome.improvement}
                </div>
              </div>
              <GainProgressBar
                from={outcome.fromValue}
                to={outcome.toValue}
                unit={outcome.unit}
                color={ACCENT}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Breakdown */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Cohort Health Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {USER_COHORTS.map((cohort) => (
            <div
              key={cohort.tier}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {cohort.tier}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: ACCENT }}>
                {cohort.count}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>participants</p>

              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Avg Improvement</span>
                  <span className="text-xs font-bold" style={{ color: "#1EAA55" }}>{cohort.avgImprovement}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cohort.avgImprovement}%`, backgroundColor: "#1EAA55" }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Award size={12} style={{ color: "#F1C028" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {cohort.topOutcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sullivan Principle */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "#9686B910", border: "1px solid #9686B920" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              The Gain: Measuring from Where We Started
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              8 months ago: 0 studies, 0 data points, 0 validated interventions.
              Today: {KEY_OUTCOMES.length} tracked outcomes, 240K data points, 150-260% fertility improvement.
              This progress feeds the fundraising narrative and validates the patent portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
