"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Mail,
  ShoppingBag,
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";

const ACCENT = "#5A6FFF";

// ── Metric Types ──

interface Metric {
  id: string;
  label: string;
  value: number | string;
  target?: number | string;
  unit?: string;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  color: string;
  icon: React.ReactNode;
}

interface ChannelSource {
  channel: string;
  signups: number;
  percentage: number;
  color: string;
}

interface WeeklyReviewQuestion {
  question: string;
  context: string;
}

// ── Mock Metrics Data ──
// In production, these would come from APIs (GA4, Mailchimp, Stripe, etc.)

const HERO_METRICS: Metric[] = [
  {
    id: "total-signups",
    label: "Total Early Access Signups",
    value: 1247,
    target: 10000,
    unit: "signups",
    trend: "up",
    trendValue: "+89 this week",
    color: ACCENT,
    icon: <Users size={20} style={{ color: ACCENT }} />,
  },
  {
    id: "daily-rate",
    label: "Daily Signup Rate",
    value: 12.7,
    target: 30,
    unit: "per day",
    trend: "up",
    trendValue: "+2.3 vs last week",
    color: "#1EAA55",
    icon: <TrendingUp size={20} style={{ color: "#1EAA55" }} />,
  },
  {
    id: "referral-rate",
    label: "Referral Rate",
    value: "18%",
    target: "25%",
    trend: "up",
    trendValue: "+3% vs last week",
    color: "#9686B9",
    icon: <ArrowUpRight size={20} style={{ color: "#9686B9" }} />,
  },
  {
    id: "email-open-rate",
    label: "Email Open Rate",
    value: "42%",
    target: "35%",
    trend: "up",
    trendValue: "Above industry avg",
    color: "#E37FB1",
    icon: <Mail size={20} style={{ color: "#E37FB1" }} />,
  },
];

const CONVERSION_METRICS: Metric[] = [
  {
    id: "founding-members",
    label: "Founding Member Conversions",
    value: 0,
    target: 500,
    unit: "of 500 spots",
    trend: "flat",
    trendValue: "Pre-launch",
    color: "#F1C028",
    icon: <Sparkles size={18} style={{ color: "#F1C028" }} />,
  },
  {
    id: "supplement-sales",
    label: "Supplement Pre-Orders",
    value: 0,
    target: "TBD",
    unit: "orders",
    trend: "flat",
    trendValue: "Pre-launch",
    color: "#78C3BF",
    icon: <ShoppingBag size={18} style={{ color: "#78C3BF" }} />,
  },
  {
    id: "ring-preorders",
    label: "Halo Ring Pre-Orders",
    value: 0,
    target: "TBD",
    unit: "pre-orders",
    trend: "flat",
    trendValue: "Pre-launch",
    color: "#356FB6",
    icon: <Activity size={18} style={{ color: "#356FB6" }} />,
  },
];

const TOP_CHANNELS: ChannelSource[] = [
  { channel: "Organic Search", signups: 412, percentage: 33, color: "#1EAA55" },
  { channel: "Podcast Referrals", signups: 287, percentage: 23, color: "#9686B9" },
  { channel: "Instagram", signups: 199, percentage: 16, color: "#E37FB1" },
  { channel: "Facebook Groups", signups: 149, percentage: 12, color: "#5A6FFF" },
  { channel: "Email Referral", signups: 112, percentage: 9, color: "#F1C028" },
  { channel: "Direct / Other", signups: 88, percentage: 7, color: "#78C3BF" },
];

const WEEKLY_REVIEW_QUESTIONS: WeeklyReviewQuestion[] = [
  {
    question: "What was our single highest-leverage action this week?",
    context: "Identify the 10x move vs. the 2x moves. What one thing drove the most signups or engagement?",
  },
  {
    question: "What should we STOP doing?",
    context: "Dan Sullivan principle: Drop the 80% that produces marginal results. What channels or tactics are underperforming?",
  },
  {
    question: "Where is Kirsten spending time that isn't her Unique Ability?",
    context: "Kirsten's Unique Ability: vision, science, relationships, storytelling. Anything else should be delegated.",
  },
  {
    question: "What's the one thing that would 10x our signup rate next week?",
    context: "Think multiplier: one action that cascades across podcast, Facebook, email, and organic channels simultaneously.",
  },
  {
    question: "Are we measuring from the Gain or the Gap?",
    context: "How far have we come from 0, not how far we are from 10,000. Lead with the gain, then show the path to the target.",
  },
];

// ── Simulated Weekly Data ──

const WEEKLY_DATA = [
  { week: "W1 (Mar 3)", signups: 45, cumulative: 45, dailyAvg: 6.4 },
  { week: "W2 (Mar 10)", signups: 89, cumulative: 134, dailyAvg: 12.7 },
  { week: "W3 (Mar 17)", signups: 0, cumulative: 134, dailyAvg: 0 },
  { week: "W4 (Mar 24)", signups: 0, cumulative: 134, dailyAvg: 0 },
  { week: "W5 (Mar 31)", signups: 0, cumulative: 134, dailyAvg: 0 },
  { week: "W6 (Apr 7)", signups: 0, cumulative: 134, dailyAvg: 0 },
  { week: "W7 (Apr 14)", signups: 0, cumulative: 134, dailyAvg: 0 },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${color}14` }}>
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const numValue = typeof metric.value === "number" ? metric.value : null;
  const numTarget = typeof metric.target === "number" ? metric.target : null;

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${metric.color}14` }}
        >
          {metric.icon}
        </div>
        {metric.trend && metric.trend !== "flat" && (
          <div className="flex items-center gap-1">
            {metric.trend === "up" ? (
              <TrendingUp size={12} style={{ color: "#1EAA55" }} />
            ) : (
              <TrendingDown size={12} style={{ color: "#E24D47" }} />
            )}
            <span
              className="text-[10px] font-medium"
              style={{ color: metric.trend === "up" ? "#1EAA55" : "#E24D47" }}
            >
              {metric.trendValue}
            </span>
          </div>
        )}
        {metric.trend === "flat" && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
            {metric.trendValue}
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: "var(--muted)" }}>
        {metric.label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
        </p>
        {metric.target && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            / {typeof metric.target === "number" ? metric.target.toLocaleString() : metric.target} {metric.unit}
          </p>
        )}
      </div>
      {numValue !== null && numTarget !== null && (
        <div className="mt-3">
          <ProgressBar value={numValue} max={numTarget} color={metric.color} />
          <p className="text-[10px] mt-1 text-right" style={{ color: metric.color }}>
            {((numValue / numTarget) * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default function WeeklyMetricsPage() {
  const [showReview, setShowReview] = useState(false);
  const [weekNotes, setWeekNotes] = useState<Record<number, string>>({});

  const currentSignups = 1247;
  const targetSignups = 10000;
  const gainPct = ((currentSignups / targetSignups) * 100).toFixed(1);
  const weeksRemaining = 7;
  const neededPerWeek = Math.ceil((targetSignups - currentSignups) / weeksRemaining);

  return (
    <div className="space-y-6 p-6">
      <CompanyGoalsBanner departmentFocus="10,000 early access signups in 7 weeks" />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Weekly Metrics Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Week of March 15, 2026 &middot; 7 weeks to launch
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
          >
            <Calendar size={12} />
            Updated: Today
          </div>
        </div>
      </div>

      {/* The Gain Banner */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}12 0%, #ACB7FF12 50%, #1EAA5512 100%)`,
          border: `1px solid ${ACCENT}25`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: ACCENT }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            The Gain (Not the Gap)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Where we started</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>0</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "#1EAA55" }}>Where we are now</p>
            <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>{currentSignups.toLocaleString()}</p>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              {gainPct}% of target reached
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Where we're going</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{targetSignups.toLocaleString()}</p>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              Need {neededPerWeek.toLocaleString()}/week to hit target
            </p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={currentSignups} max={targetSignups} color={ACCENT} />
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HERO_METRICS.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Conversion Metrics */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          Conversion Metrics
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CONVERSION_METRICS.map((m) => (
            <MetricCard key={m.id} metric={m} />
          ))}
        </div>
      </div>

      {/* Two-column: Channels + Weekly Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referring Channels */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} style={{ color: ACCENT }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Top Referring Channels
            </p>
          </div>
          <div className="space-y-3">
            {TOP_CHANNELS.map((ch) => (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    {ch.channel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: ch.color }}>
                      {ch.signups}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      ({ch.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: `${ch.color}14` }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Signup Tracker */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} style={{ color: "#9686B9" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Weekly Signup Tracker
            </p>
          </div>
          <div className="space-y-2">
            {WEEKLY_DATA.map((week, i) => {
              const isActive = i < 2;
              const maxSignups = Math.max(...WEEKLY_DATA.map((w) => w.signups), 1);

              return (
                <div
                  key={week.week}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: isActive ? `${ACCENT}06` : "var(--background)",
                    border: isActive ? `1px solid ${ACCENT}20` : "1px solid var(--border)",
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <span className="text-[10px] font-medium w-24 shrink-0" style={{ color: "var(--muted)" }}>
                    {week.week}
                  </span>
                  <div className="flex-1">
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(week.signups / maxSignups) * 100}%`,
                          backgroundColor: isActive ? ACCENT : "var(--border)",
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold w-10 text-right" style={{ color: isActive ? ACCENT : "var(--muted)" }}>
                    {week.signups > 0 ? `+${week.signups}` : "--"}
                  </span>
                  <span className="text-[10px] w-14 text-right" style={{ color: "var(--muted)" }}>
                    {week.cumulative > 0 ? week.cumulative.toLocaleString() : "--"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              Target pace: {neededPerWeek.toLocaleString()} signups/week
            </span>
            <span className="text-[10px] font-bold" style={{ color: ACCENT }}>
              {weeksRemaining} weeks remaining
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Review */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: "#F1C028" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Weekly Review — 5 Strategic Questions
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}>
              Strategic Coach Framework
            </span>
          </div>
          {showReview ? (
            <ChevronUp size={14} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown size={14} style={{ color: "var(--muted)" }} />
          )}
        </button>

        {showReview && (
          <div className="px-5 py-4 space-y-4" style={{ backgroundColor: "var(--background)", borderTop: "1px solid var(--border)" }}>
            {WEEKLY_REVIEW_QUESTIONS.map((q, i) => (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: "#F1C028" }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                      {q.question}
                    </p>
                    <p className="text-[10px] mb-3" style={{ color: "var(--muted)" }}>
                      {q.context}
                    </p>
                    <textarea
                      placeholder="Type your answer..."
                      value={weekNotes[i] || ""}
                      onChange={(e) => setWeekNotes((prev) => ({ ...prev, [i]: e.target.value }))}
                      className="w-full rounded-lg p-3 text-xs resize-none"
                      rows={2}
                      style={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gain Reminder */}
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "linear-gradient(135deg, #1EAA5508 0%, #78C3BF08 100%)",
          border: "1px solid rgba(30, 170, 85, 0.12)",
        }}
      >
        <p className="text-xs font-medium" style={{ color: "#1EAA55" }}>
          Remember: We went from 0 to {currentSignups.toLocaleString()} signups.
          That&apos;s {currentSignups.toLocaleString()} people who believe in what we&apos;re building.
          Measure from the Gain, not the Gap.
        </p>
      </div>
    </div>
  );
}
