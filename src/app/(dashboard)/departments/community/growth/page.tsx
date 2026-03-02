"use client";

import { TrendingUp, Users, UserMinus, UserPlus, ArrowRight, RefreshCw, Trophy, Target } from "lucide-react";

const ACCENT = "#1EAA55";

const MEMBER_DASHBOARD = {
  newThisWeek: 18,
  churnedThisWeek: 3,
  netGrowth: 15,
  growthRate: "1.8%",
  weeklyTrend: [12, 15, 11, 18, 14, 16, 18],
};

interface ReengagementCampaign {
  id: string;
  name: string;
  targetSegment: string;
  trigger: string;
  message: string;
  status: "active" | "planned" | "completed";
  reengagedCount: number;
}

const REENGAGEMENT_CAMPAIGNS: ReengagementCampaign[] = [
  { id: "rc01", name: "7-Day Silence Nudge", targetSegment: "Members inactive 7+ days", trigger: "No login for 7 days", message: "We noticed you haven't been around! Your community misses you. Here's what you missed this week...", status: "active", reengagedCount: 24 },
  { id: "rc02", name: "30-Day Win-Back", targetSegment: "Members inactive 30+ days", trigger: "No login for 30 days", message: "A lot has happened! 3 new resources, 2 member success stories, and a live Q&A replay waiting for you.", status: "active", reengagedCount: 12 },
  { id: "rc03", name: "Milestone Check-in", targetSegment: "Members at 90-day mark", trigger: "90 days since joining", message: "Congratulations on 90 days! Let's look at how far you've come. Share your journey update...", status: "active", reengagedCount: 18 },
  { id: "rc04", name: "Free → Paid Upsell", targetSegment: "Active free members (30+ days)", trigger: "High engagement free tier", message: "You're getting so much out of the free community! Imagine what personalized tracking could add...", status: "planned", reengagedCount: 0 },
];

interface CommunityChallenge {
  id: string;
  name: string;
  duration: string;
  participants: number;
  status: "active" | "upcoming" | "completed";
  completionRate: number;
  description: string;
}

const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  { id: "cc01", name: "30-Day BBT Tracking Challenge", duration: "30 days", participants: 89, status: "active", completionRate: 72, description: "Track your BBT every morning for 30 days straight. Share your chart in the community for feedback." },
  { id: "cc02", name: "Fertility-Friendly Meal Prep Week", duration: "7 days", participants: 124, status: "completed", completionRate: 85, description: "Cook 5 fertility-friendly meals this week using our community recipe collection." },
  { id: "cc03", name: "Sleep Optimization Sprint", duration: "14 days", participants: 56, status: "active", completionRate: 48, description: "Implement the sleep protocol: 10pm bedtime, blue light block, cool room. Track HRV changes." },
  { id: "cc04", name: "Supplement Stack Review", duration: "7 days", participants: 0, status: "upcoming", completionRate: 0, description: "Review your supplement stack with the community. Get feedback on timing, doses, and interactions." },
];

const ONBOARDING_FUNNEL = [
  { step: "Signed up", count: 847, pct: 100 },
  { step: "Completed profile", count: 712, pct: 84 },
  { step: "First post/reply", count: 534, pct: 63 },
  { step: "Joined a space", count: 489, pct: 58 },
  { step: "Active at 7 days", count: 421, pct: 50 },
  { step: "Active at 30 days", count: 312, pct: 37 },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h}><polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function StatusBadge({ status }: { status: "active" | "planned" | "completed" | "upcoming" }) {
  const config = {
    active: { bg: "#1EAA5518", color: "#1EAA55" },
    planned: { bg: "#F1C02818", color: "#F1C028" },
    completed: { bg: "#356FB618", color: "#356FB6" },
    upcoming: { bg: "#9686B918", color: "#9686B9" },
  };
  const c = config[status];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

export default function GrowthPage() {
  return (
    <div className="space-y-6">
      {/* Member Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} style={{ color: "#1EAA55" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>New This Week</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>{MEMBER_DASHBOARD.newThisWeek}</p>
          <MiniSparkline data={MEMBER_DASHBOARD.weeklyTrend} color="#1EAA55" />
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <UserMinus size={16} style={{ color: "#E24D47" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Churned</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#E24D47" }}>{MEMBER_DASHBOARD.churnedThisWeek}</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>this week</p>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Net Growth</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>+{MEMBER_DASHBOARD.netGrowth}</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{MEMBER_DASHBOARD.growthRate} weekly rate</p>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw size={16} style={{ color: "#356FB6" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Reengaged</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#356FB6" }}>
            {REENGAGEMENT_CAMPAIGNS.reduce((sum, c) => sum + c.reengagedCount, 0)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>from campaigns</p>
        </div>
      </div>

      {/* Onboarding Funnel */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Onboarding Funnel</h2>
        </div>
        <div className="space-y-3">
          {ONBOARDING_FUNNEL.map((step, i) => (
            <div key={step.step}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>{step.step}</span>
                  {i < ONBOARDING_FUNNEL.length - 1 && <ArrowRight size={12} style={{ color: "var(--muted)" }} />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: ACCENT }}>{step.count}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{step.pct}%</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                <div className="h-full rounded-full" style={{ width: `${step.pct}%`, backgroundColor: ACCENT }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Re-engagement Campaigns */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <RefreshCw size={16} style={{ color: "#356FB6" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Re-engagement Campaigns</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {REENGAGEMENT_CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{campaign.name}</p>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    Target: {campaign.targetSegment} -- Trigger: {campaign.trigger}
                  </p>
                  <p className="text-xs mt-1 italic" style={{ color: "var(--muted)" }}>
                    &ldquo;{campaign.message}&rdquo;
                  </p>
                </div>
                {campaign.reengagedCount > 0 && (
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold" style={{ color: ACCENT }}>{campaign.reengagedCount}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>reengaged</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Challenges */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Trophy size={16} style={{ color: "#F1C028" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Community Challenges</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 pt-0">
          {COMMUNITY_CHALLENGES.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={challenge.status} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>{challenge.duration}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{challenge.name}</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{challenge.description}</p>
              {challenge.participants > 0 && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {challenge.participants} participants
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${challenge.completionRate}%`, backgroundColor: ACCENT }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: ACCENT }}>{challenge.completionRate}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
