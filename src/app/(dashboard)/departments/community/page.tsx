"use client";

import { Users, TrendingUp, Heart, MessageSquare, ArrowRight, Star, Activity } from "lucide-react";

const ACCENT = "#1EAA55";

const MEMBER_STATS = {
  total: 220,
  active: 0, // Connect Circle API to track
  nps: 0, // Not yet measured
  thisWeekPosts: 0,
  thisWeekReplies: 0,
  thisWeekNewMembers: 0,
};

const CONVERSION_FUNNEL = [
  { tier: "Circle Members", count: 220, color: "#78C3BF" },
  { tier: "Engaged", count: 0, color: "#356FB6" },
  { tier: "Early Access", count: 0, color: "#1EAA55" },
];

const WEEKLY_SUMMARY = [
  { metric: "Total members", value: 220, trend: "Circle.so" },
  { metric: "New posts", value: "—", trend: "Connect Circle API" },
  { metric: "Replies", value: "—", trend: "Connect Circle API" },
  { metric: "Active members", value: "—", trend: "Connect Circle API" },
  { metric: "New members", value: "—", trend: "Connect Circle API" },
  { metric: "Response time", value: "—", trend: "Connect Circle API" },
];

function NPSGauge({ score }: { score: number }) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#1EAA55" : score >= 50 ? "#F1C028" : "#E24D47";

  return (
    <div className="relative w-24 h-14 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 55">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{score}</span>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
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

export default function CommunityDashboardPage() {
  const engagementScore = Math.round((MEMBER_STATS.active / MEMBER_STATS.total) * 100);

  return (
    <div className="space-y-6">
      {/* Hero: Member Count */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
          Circle Community
        </p>
        <div className="flex items-center justify-center gap-4">
          <div>
            <p className="text-5xl font-bold" style={{ color: "var(--foreground)" }}>
              {MEMBER_STATS.total}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>total members</p>
          </div>
          <div className="w-px h-12" style={{ backgroundColor: "var(--border)" }} />
          <div>
            <p className="text-3xl font-bold" style={{ color: ACCENT }}>
              {MEMBER_STATS.active}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>active</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            The Gain: From 0 to 220 members -- building the foundation
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Engagement Score */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Engagement
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {engagementScore}%
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>active / total members</p>
          <MiniSparkline data={[48, 52, 55, 58, 59, 61, engagementScore]} color={ACCENT} />
        </div>

        {/* NPS */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} style={{ color: "#F1C028" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              NPS Score
            </span>
          </div>
          <NPSGauge score={MEMBER_STATS.nps} />
          <p className="text-xs text-center mt-1" style={{ color: "var(--muted)" }}>Excellent (&gt;70)</p>
        </div>

        {/* Conversion Funnel Mini */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={16} style={{ color: "#356FB6" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Funnel
            </span>
          </div>
          <div className="space-y-2">
            {CONVERSION_FUNNEL.map((tier, i) => {
              const pct = (tier.count / CONVERSION_FUNNEL[0].count) * 100;
              return (
                <div key={tier.tier}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs" style={{ color: "var(--foreground)" }}>{tier.tier}</span>
                    <span className="text-xs font-bold" style={{ color: tier.color }}>{tier.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: tier.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* This Week */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} style={{ color: "#9686B9" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              This Week
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Posts</span>
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{MEMBER_STATS.thisWeekPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Replies</span>
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{MEMBER_STATS.thisWeekReplies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>New members</span>
              <span className="text-xs font-bold" style={{ color: ACCENT }}>{MEMBER_STATS.thisWeekNewMembers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Summary */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            This Week&apos;s Activity Summary
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {WEEKLY_SUMMARY.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <span className="text-sm" style={{ color: "var(--foreground)" }}>{item.metric}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{item.value}</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sullivan Multiplier */}
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
              Multiplier: Community as Clinical Research Pipeline
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              220 community members = potential research participants. Each engaged member is generating
              data that feeds the clinical evidence base. Community growth directly strengthens the fundraising
              narrative and clinical validation. One engagement, three department multiplier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
