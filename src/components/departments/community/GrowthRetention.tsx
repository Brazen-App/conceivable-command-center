"use client";

import {
  Users,
  Activity,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Trophy,
  RefreshCw,
  Target,
  ArrowRight,
} from "lucide-react";
import type {
  MemberMetrics,
  EngagementScore,
  ReengagementCampaign,
  OnboardingFunnel,
  CommunityChallenge,
  ConversionFunnel,
  WeeklyRecommendation,
} from "@/lib/data/community-data";

const ACCENT = "#1EAA55";

const TIER_COLORS: Record<string, string> = {
  power_user: "#1EAA55",
  regular: "#356FB6",
  lurker: "#F1C028",
  dormant: "#E24D47",
};

const TIER_LABELS: Record<string, string> = {
  power_user: "Power Users",
  regular: "Regular",
  lurker: "Lurkers",
  dormant: "Dormant",
};

const CHALLENGE_STATUS_CONFIG: Record<string, { color: string }> = {
  upcoming: { color: "#9686B9" },
  active: { color: "#1EAA55" },
  completed: { color: "var(--muted)" },
};

interface Props {
  memberMetrics: MemberMetrics;
  engagementScores: EngagementScore[];
  reengagementCampaigns: ReengagementCampaign[];
  onboardingFunnel: OnboardingFunnel[];
  communityChallenges: CommunityChallenge[];
  conversionFunnel: ConversionFunnel[];
  weeklyRecommendation: WeeklyRecommendation;
}

export default function GrowthRetention({
  memberMetrics,
  engagementScores,
  reengagementCampaigns,
  onboardingFunnel,
  communityChallenges,
  conversionFunnel,
  weeklyRecommendation,
}: Props) {
  const metricCards = [
    { label: "Total Members", value: memberMetrics.total.toLocaleString(), color: ACCENT },
    { label: "Active Members", value: memberMetrics.active.toLocaleString(), color: "#356FB6" },
    { label: "New This Week", value: `+${memberMetrics.newThisWeek}`, color: "#1EAA55" },
    { label: "Churned", value: memberMetrics.churned.toString(), color: "#E24D47" },
  ];

  return (
    <div>
      {/* 4-Card Metric Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80)` }} />
            <div className="p-4" style={{ backgroundColor: "var(--surface)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                {card.label}
              </p>
              <p className="text-xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Tier Visualization */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Engagement Distribution
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {memberMetrics.activeRate}% active rate &middot; NPS: {memberMetrics.npsScore}
          </span>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="space-y-3">
            {engagementScores.map((tier) => {
              const color = TIER_COLORS[tier.tier];
              return (
                <div key={tier.tier}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        {TIER_LABELS[tier.tier]}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {tier.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color }}>
                        {tier.count}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        ({tier.percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${tier.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Onboarding Funnel */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Onboarding Funnel
          </h3>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="space-y-2">
            {onboardingFunnel.map((step) => {
              const isFirst = step.completionRate === 100;
              return (
                <div key={step.step} className="flex items-center gap-3">
                  <span className="text-[10px] w-[130px] shrink-0 text-right" style={{ color: "var(--muted)" }}>
                    {step.label}
                  </span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{
                        width: `${step.completionRate}%`,
                        background: isFirst
                          ? `linear-gradient(90deg, ${ACCENT}, ${ACCENT})`
                          : `linear-gradient(90deg, ${ACCENT}80, ${ACCENT})`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white">{step.completionRate}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono w-[50px] shrink-0" style={{ color: "var(--muted-light)" }}>
                    n={step.memberCount}
                  </span>
                </div>
              );
            })}
          </div>
          <div
            className="rounded-lg p-3 mt-3 flex items-start gap-2"
            style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}
          >
            <Zap size={12} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              <strong>Key insight:</strong> The biggest drop-off is between Joining and Posting an Introduction (46% drop). Members who post an intro are 2x more likely to remain active after Week 1. Consider an automated intro prompt within 24 hours of joining.
            </p>
          </div>
        </div>
      </div>

      {/* Re-engagement Campaigns */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Re-engagement Campaigns
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {reengagementCampaigns.map((campaign) => {
            const triggerLabels: Record<string, string> = {
              "2_weeks": "2 Weeks Inactive",
              "1_month": "1 Month Inactive",
              "2_months": "2 Months Inactive",
            };
            return (
              <div
                key={campaign.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                    {triggerLabels[campaign.trigger]}
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: campaign.status === "active" ? "#1EAA5514" : "#F1C02814",
                      color: campaign.status === "active" ? "#1EAA55" : "#F1C028",
                    }}
                  >
                    {campaign.status}
                  </span>
                </div>
                <p className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
                  {campaign.membersInQueue}
                </p>
                <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>
                  members in queue
                </p>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>Success Rate</span>
                    <span className="text-xs font-bold" style={{ color: ACCENT }}>{campaign.successRate}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${campaign.successRate}%`, backgroundColor: ACCENT }}
                    />
                  </div>
                </div>
                <p className="text-[10px] italic leading-relaxed" style={{ color: "var(--muted)" }}>
                  &ldquo;{campaign.messageTemplate.substring(0, 80)}...&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Challenges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Community Challenges
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {communityChallenges.map((challenge) => {
            const statusConf = CHALLENGE_STATUS_CONFIG[challenge.status];
            return (
              <div
                key={challenge.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: challenge.status === "completed" ? "var(--background)" : "var(--surface)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: challenge.status === "completed" ? "var(--border)" : `${statusConf.color}14`,
                      color: statusConf.color,
                    }}
                  >
                    {challenge.status}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {challenge.duration}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {challenge.name}
                </p>
                <p className="text-[10px] leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                  {challenge.description}
                </p>
                {challenge.status !== "upcoming" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>Participants</span>
                      <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{challenge.participants}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>Completion Rate</span>
                      <span className="text-xs font-bold" style={{ color: ACCENT }}>{challenge.completionRate}%</span>
                    </div>
                  </div>
                )}
                <p className="text-[9px] mt-2" style={{ color: "var(--muted-light)" }}>
                  {new Date(challenge.dates.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(challenge.dates.end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Conversion Funnel
          </h3>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-3">
            {conversionFunnel.map((stage, i) => {
              const isLast = i === conversionFunnel.length - 1;
              const stageColors: Record<string, string> = {
                free: "#ACB7FF",
                paid: "#356FB6",
                early_access: ACCENT,
              };
              const color = stageColors[stage.stage];
              return (
                <div key={stage.stage} className="flex items-center gap-3 flex-1">
                  <div className="flex-1 rounded-xl p-4 text-center" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}30` }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>
                      {stage.label}
                    </p>
                    <p className="text-2xl font-bold" style={{ color }}>
                      {stage.count}
                    </p>
                    {stage.stage !== "free" && (
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {stage.conversionRate}% conversion
                      </p>
                    )}
                  </div>
                  {!isLast && (
                    <ArrowRight size={16} className="shrink-0" style={{ color: "var(--muted)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Agent Recommendation */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "#E24D47", backgroundColor: "#E24D4704" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#E24D4714" }}
          >
            <Zap size={18} style={{ color: "#E24D47" }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E24D47" }}>
                This Week&apos;s Highest-Leverage Move
              </p>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
              >
                {weeklyRecommendation.multiplierLabel}
              </span>
            </div>
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              {weeklyRecommendation.recommendation}
            </p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
              {weeklyRecommendation.rationale}
            </p>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: ACCENT }}>
                Cross-Department Impact
              </p>
              <div className="space-y-1">
                {weeklyRecommendation.crossDeptImpact.map((impact, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <ArrowUpRight size={10} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    <p className="text-[11px]" style={{ color: "var(--foreground)" }}>{impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
