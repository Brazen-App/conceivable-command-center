"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Trophy,
  Target,
  Sparkles,
  Loader2,
  Bot,
  DollarSign,
  MousePointerClick,
  UserPlus,
  Medal,
} from "lucide-react";
import type {
  Affiliate,
  AffiliateMetrics,
  LeaderboardEntry,
  AffiliateOutreach,
  AffiliateStage,
} from "@/lib/data/community-data";
import { AFFILIATE_STAGES } from "@/lib/data/community-data";

const ACCENT = "#1EAA55";

const TREND_CONFIG = {
  up: { Icon: TrendingUp, color: "#1EAA55" },
  down: { Icon: TrendingDown, color: "#E24D47" },
  flat: { Icon: Minus, color: "var(--muted)" },
};

const MEDAL_COLORS = ["#F1C028", "#ACB7FF", "#CD7F32"];

interface Props {
  affiliates: Affiliate[];
  affiliateMetrics: AffiliateMetrics;
  leaderboard: LeaderboardEntry[];
  affiliateOutreach: AffiliateOutreach[];
}

function StageBadge({ stage }: { stage: AffiliateStage }) {
  const conf = AFFILIATE_STAGES.find((s) => s.key === stage);
  if (!conf) return null;
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
    >
      {conf.label}
    </span>
  );
}

function AffiliateCard({ affiliate }: { affiliate: Affiliate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? (
            <ChevronDown size={14} style={{ color: ACCENT }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          )}
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs"
          style={{ backgroundColor: ACCENT }}
        >
          {affiliate.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <StageBadge stage={affiliate.stage} />
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#356FB614", color: "#356FB6" }}
            >
              {affiliate.channel}
            </span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {affiliate.name}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            {affiliate.company}
          </p>
        </div>
        {affiliate.totalRevenue > 0 && (
          <div className="text-right shrink-0">
            <p className="text-sm font-bold" style={{ color: ACCENT }}>
              ${affiliate.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>
              {affiliate.conversionRate}% CVR
            </p>
          </div>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
          {/* Performance Stats */}
          {affiliate.stage !== "prospect" && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { label: "Clicks", value: affiliate.totalClicks.toLocaleString() },
                { label: "Signups", value: affiliate.totalSignups.toLocaleString() },
                { label: "Conversions", value: affiliate.totalConversions.toLocaleString() },
                { label: "Revenue", value: `$${affiliate.totalRevenue.toLocaleString()}` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg p-2 text-center"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {stat.label}
                  </p>
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
              {affiliate.notes}
            </p>
          </div>

          {/* Next Action */}
          {affiliate.nextAction && (
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                Next Action
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {affiliate.nextAction}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AffiliateProgram({
  affiliates,
  affiliateMetrics,
  leaderboard,
  affiliateOutreach,
}: Props) {
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [generatedOutreach, setGeneratedOutreach] = useState<string | null>(null);
  const [findingProspects, setFindingProspects] = useState(false);
  const [foundProspects, setFoundProspects] = useState<string | null>(null);

  const handleGenerateOutreach = async (prospect: AffiliateOutreach) => {
    setGeneratingOutreach(true);
    setGeneratedOutreach(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "marketing",
          message: `Generate a personalized affiliate outreach email for Conceivable (AI-powered fertility health platform).

PROSPECT: ${prospect.prospectName}
PLATFORM: ${prospect.platform}
AUDIENCE SIZE: ${prospect.audience.toLocaleString()}
RELEVANCE SCORE: ${prospect.relevanceScore}/10

ABOUT CONCEIVABLE:
- AI-powered fertility optimization platform founded by Kirsten Karchmer (20+ years clinical experience)
- Pilot study: 150-260% improvement in conception likelihood
- 847-member Circle community, growing rapidly
- Affiliate program offers competitive commissions + exclusive content for partners

Write a warm, personalized outreach email (150-200 words) that:
1. References something specific about their work
2. Explains the alignment with Conceivable's mission
3. Highlights the affiliate program benefits
4. Includes a clear, low-pressure call to action`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedOutreach(data.response);
      } else {
        setGeneratedOutreach("Unable to generate outreach — please check that the API is configured.");
      }
    } catch {
      setGeneratedOutreach("Unable to generate outreach — please check your connection and try again.");
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const handleFindProspects = async () => {
    setFindingProspects(true);
    setFoundProspects(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "marketing",
          message: `You are identifying new affiliate prospects for Conceivable's affiliate program.

CURRENT AFFILIATES: ${affiliates.map((a) => `${a.name} (${a.channel})`).join(", ")}

IDEAL AFFILIATE PROFILE:
- Audience of women 25-42 interested in fertility, reproductive health, or holistic wellness
- Platforms: podcast, blog, YouTube, Instagram, TikTok, newsletter
- Trusted voice with engaged audience (not just large following)
- Alignment with science-backed, empathetic approach to fertility

Suggest 5 new affiliate prospects we should pursue. For each, provide:
1. Name and platform
2. Estimated audience size
3. Why they're a good fit (specific content alignment)
4. Relevance score (1-10)
5. Suggested approach strategy`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFoundProspects(data.response);
      } else {
        setFoundProspects("Unable to find prospects — please check that the API is configured.");
      }
    } catch {
      setFoundProspects("Unable to find prospects — please check your connection and try again.");
    } finally {
      setFindingProspects(false);
    }
  };

  return (
    <div>
      {/* Metrics Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Affiliates", value: affiliateMetrics.totalAffiliates.toString(), icon: Users },
          { label: "Active", value: affiliateMetrics.activeAffiliates.toString(), icon: TrendingUp },
          { label: "Total Clicks", value: affiliateMetrics.totalClicks.toLocaleString(), icon: MousePointerClick },
          { label: "Signups", value: affiliateMetrics.totalSignups.toLocaleString(), icon: UserPlus },
          { label: "Conversions", value: affiliateMetrics.totalConversions.toLocaleString(), icon: Target },
          { label: "Revenue", value: `$${affiliateMetrics.totalRevenue.toLocaleString()}`, icon: DollarSign, highlight: true },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl border p-3 text-center"
              style={{
                borderColor: metric.highlight ? `${ACCENT}40` : "var(--border)",
                backgroundColor: metric.highlight ? `${ACCENT}08` : "var(--surface)",
              }}
            >
              <Icon size={14} className="mx-auto mb-1" style={{ color: metric.highlight ? ACCENT : "var(--muted)" }} />
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {metric.label}
              </p>
              <p className={`font-bold ${metric.highlight ? "text-lg" : "text-sm"}`} style={{ color: metric.highlight ? ACCENT : "var(--foreground)" }}>
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Kanban */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Pipeline Overview
          </h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {AFFILIATE_STAGES.map((stage) => {
            const count = affiliates.filter((a) => a.stage === stage.key).length;
            return (
              <div
                key={stage.key}
                className="flex-1 min-w-[100px] rounded-xl border p-3 text-center"
                style={{
                  borderColor: count > 0 ? `${stage.color}40` : "var(--border)",
                  backgroundColor: count > 0 ? `${stage.color}08` : "var(--surface)",
                }}
              >
                <p className="text-xl font-bold" style={{ color: count > 0 ? stage.color : "var(--muted-light)" }}>
                  {count}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: count > 0 ? stage.color : "var(--muted-light)" }}>
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Leaderboard — Top 5
          </h3>
        </div>
        <div className="space-y-2">
          {leaderboard.map((entry, i) => {
            const trendConf = TREND_CONFIG[entry.trend];
            const isFirst = i === 0;
            return (
              <div
                key={entry.affiliateId}
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{
                  borderColor: isFirst ? `${ACCENT}40` : "var(--border)",
                  backgroundColor: isFirst ? `${ACCENT}06` : "var(--surface)",
                  background: isFirst ? `linear-gradient(135deg, ${ACCENT}08 0%, var(--surface) 100%)` : undefined,
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 shrink-0">
                  {i < 3 ? (
                    <Medal size={20} style={{ color: MEDAL_COLORS[i] }} strokeWidth={2} />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>
                      #{entry.rank}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {entry.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {entry.metric}: {entry.value}
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                >
                  {entry.reward}
                </span>
                <trendConf.Icon size={14} style={{ color: trendConf.color }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Affiliate CRM List */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            All Affiliates
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {affiliates.length} total
          </span>
        </div>
        <div className="space-y-2">
          {affiliates.map((affiliate) => (
            <AffiliateCard key={affiliate.id} affiliate={affiliate} />
          ))}
        </div>
      </div>

      {/* Outreach Manager */}
      <div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Outreach Manager
            </h3>
          </div>

          <div className="space-y-3 mb-4">
            {affiliateOutreach.map((prospect) => (
              <div
                key={prospect.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {prospect.prospectName}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {prospect.platform} &middot; {prospect.audience.toLocaleString()} audience
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Relevance
                      </p>
                      <p className="text-sm font-bold" style={{ color: ACCENT }}>
                        {prospect.relevanceScore}/10
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: prospect.status === "identified" ? "#ACB7FF14" : prospect.status === "drafted" ? "#356FB614" : prospect.status === "sent" ? "#1EAA5514" : "#F1C02814",
                        color: prospect.status === "identified" ? "#ACB7FF" : prospect.status === "drafted" ? "#356FB6" : prospect.status === "sent" ? "#1EAA55" : "#F1C028",
                      }}
                    >
                      {prospect.status}
                    </span>
                  </div>
                </div>
                {prospect.draftMessage && (
                  <div className="rounded-lg p-3 mb-2" style={{ backgroundColor: `${ACCENT}04`, borderLeft: `3px solid ${ACCENT}` }}>
                    <p className="text-[10px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {prospect.draftMessage.substring(0, 150)}...
                    </p>
                  </div>
                )}
                {prospect.status === "identified" && (
                  <button
                    onClick={() => handleGenerateOutreach(prospect)}
                    disabled={generatingOutreach}
                    className="text-[10px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                  >
                    Generate Outreach
                  </button>
                )}
              </div>
            ))}
          </div>

          {generatedOutreach && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Generated Outreach
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {generatedOutreach}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleFindProspects}
            disabled={findingProspects}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            {findingProspects ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Finding Prospects...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Find New Prospects
              </>
            )}
          </button>

          {foundProspects && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Suggested Prospects
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {foundProspects}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
