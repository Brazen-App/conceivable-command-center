"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Heart, MessageSquare, ArrowRight, Star, Activity, RefreshCw } from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";

const ACCENT = "#1EAA55";

interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  recentPosts: number;
  recentComments: number;
  newMembersThisWeek: number;
  spaces: { id: number; name: string; slug: string; memberCount?: number }[];
  topPosts: { id: number; name: string; likesCount: number; commentsCount: number; createdAt: string }[];
  source: "circle_api" | "mock";
}

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
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/community");
      if (!res.ok) throw new Error(`Failed to fetch community stats (${res.status})`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const memberStats = {
    total: stats?.totalMembers ?? 0,
    active: stats?.activeMembers ?? 0,
    nps: 0, // Not yet measured
    thisWeekPosts: stats?.recentPosts ?? 0,
    thisWeekReplies: stats?.recentComments ?? 0,
    thisWeekNewMembers: stats?.newMembersThisWeek ?? 0,
  };

  const engagementScore = memberStats.total > 0
    ? Math.round((memberStats.active / memberStats.total) * 100)
    : 0;

  const conversionFunnel = [
    { tier: "Circle Members", count: memberStats.total, color: "#78C3BF" },
    { tier: "Engaged", count: memberStats.active, color: "#356FB6" },
    { tier: "Early Access", count: 0, color: "#1EAA55" },
  ];

  const weeklySummary = [
    { metric: "Total members", value: memberStats.total || "\u2014", trend: stats?.source === "circle_api" ? "Circle API" : "Circle.so" },
    { metric: "New posts", value: memberStats.thisWeekPosts || "\u2014", trend: stats?.source === "circle_api" ? "This week" : "Awaiting data" },
    { metric: "Replies", value: memberStats.thisWeekReplies || "\u2014", trend: stats?.source === "circle_api" ? "This week" : "Awaiting data" },
    { metric: "Active members", value: memberStats.active || "\u2014", trend: stats?.source === "circle_api" ? "This week" : "Awaiting data" },
    { metric: "New members", value: memberStats.thisWeekNewMembers || "\u2014", trend: stats?.source === "circle_api" ? "This week" : "Awaiting data" },
    { metric: "Response time", value: "\u2014", trend: "Awaiting data" },
  ];

  const isLive = stats?.source === "circle_api";

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isLive ? "#1EAA55" : "#F1C028" }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            {loading ? "Loading..." : isLive ? "Live from Circle API" : "Mock data (CIRCLE_API_TOKEN not set)"}
          </span>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
          style={{
            color: "var(--muted)",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            opacity: loading ? 0.5 : 1,
          }}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: "#E24D4710", color: "#E24D47", border: "1px solid #E24D4720" }}>
          {error}
        </div>
      )}

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
              {loading ? "\u2014" : memberStats.total}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>total members</p>
          </div>
          <div className="w-px h-12" style={{ backgroundColor: "var(--border)" }} />
          <div>
            <p className="text-3xl font-bold" style={{ color: ACCENT }}>
              {loading ? "\u2014" : memberStats.active}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>active</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            {isLive
              ? `The Gain: ${memberStats.total} members with ${memberStats.active} active this week`
              : `The Gain: From 0 to ${memberStats.total} members -- building the foundation`}
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
          <NPSGauge score={memberStats.nps} />
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
            {conversionFunnel.map((tier) => {
              const pct = conversionFunnel[0].count > 0
                ? (tier.count / conversionFunnel[0].count) * 100
                : 0;
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
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{memberStats.thisWeekPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Replies</span>
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{memberStats.thisWeekReplies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>New members</span>
              <span className="text-xs font-bold" style={{ color: ACCENT }}>{memberStats.thisWeekNewMembers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity — only shown when live */}
      {isLive && stats?.topPosts && stats.topPosts.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Recent Posts
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {stats.topPosts.map((post) => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <span className="text-sm truncate" style={{ color: "var(--foreground)" }}>{post.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                    <Heart size={11} /> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                    <MessageSquare size={11} /> {post.commentsCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          {weeklySummary.map((item, i) => (
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

      {/* Connect Circle API CTA — only show when using mock data */}
      {!isLive && (
        <div
          className="rounded-xl p-5 flex items-center gap-4 flex-wrap"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Connect Circle API for live engagement data
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Posts, replies, active members, and growth metrics will populate automatically once the Circle API is connected.
              Set the <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--border)" }}>CIRCLE_API_TOKEN</code> environment variable to enable.
            </p>
          </div>
          <JoyButton
            agent="executive-coach"
            prompt="Help me connect the Circle.so community API to the Conceivable Command Center. We have 220 members on Circle. I need to: 1) Get a Circle API token, 2) Set up the webhook or polling for member activity data, 3) Track engagement metrics (posts, replies, active members, growth rate). Walk me through the setup."
            label="Joy: Connect Circle API"
          />
        </div>
      )}

      {/* Spaces breakdown — only shown when live */}
      {isLive && stats?.spaces && stats.spaces.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Spaces
            </h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {stats.spaces.map((space) => (
              <div key={space.id} className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--foreground)" }}>{space.name}</span>
                {space.memberCount !== undefined && (
                  <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                    {space.memberCount} members
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
              {memberStats.total} community members = potential research participants. Each engaged member is generating
              data that feeds the clinical evidence base. Community growth directly strengthens the fundraising
              narrative and clinical validation. One engagement, three department multiplier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
