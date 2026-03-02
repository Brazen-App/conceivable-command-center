"use client";

import { useState } from "react";
import {
  UserCheck,
  TrendingUp,
  DollarSign,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MousePointerClick,
  UserPlus,
  ShoppingCart,
} from "lucide-react";
import {
  AFFILIATES,
  AFFILIATE_METRICS,
  LEADERBOARD,
  AFFILIATE_STAGES,
  type Affiliate,
  type AffiliateStage,
} from "@/lib/data/community-data";

const ACCENT = "#5A6FFF";

// --- Commission Structure ---

const COMMISSION_TIERS = [
  { tier: "Silver", threshold: "$0 - $5,000", rate: "15%", color: "#ACB7FF" },
  { tier: "Gold", threshold: "$5,001 - $10,000", rate: "20%", color: "#F1C028" },
  { tier: "Diamond", threshold: "$10,001+", rate: "25%", color: "#78C3BF" },
];

// --- Pipeline counts ---

function getPipelineCounts(affiliates: Affiliate[]) {
  const stages: AffiliateStage[] = ["prospect", "onboarding", "active", "dormant", "churned"];
  return stages.map((s) => ({
    stage: s,
    count: affiliates.filter((a) => a.stage === s).length,
    label: AFFILIATE_STAGES.find((st) => st.key === s)?.label ?? s,
    color: AFFILIATE_STAGES.find((st) => st.key === s)?.color ?? "#999",
  }));
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp size={12} style={{ color: "#1EAA55" }} />;
  if (trend === "down") return <TrendingUp size={12} style={{ color: "#E24D47", transform: "rotate(180deg)" }} />;
  return <span className="text-[10px]" style={{ color: "var(--muted)" }}>--</span>;
}

export default function MarketingAffiliatesPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const pipeline = getPipelineCounts(AFFILIATES);

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            icon: <Users size={16} style={{ color: ACCENT }} />,
            label: "Total",
            value: AFFILIATE_METRICS.totalAffiliates,
          },
          {
            icon: <UserCheck size={16} style={{ color: "#1EAA55" }} />,
            label: "Active",
            value: AFFILIATE_METRICS.activeAffiliates,
          },
          {
            icon: <MousePointerClick size={16} style={{ color: "#78C3BF" }} />,
            label: "Clicks",
            value: AFFILIATE_METRICS.totalClicks.toLocaleString(),
          },
          {
            icon: <UserPlus size={16} style={{ color: "#356FB6" }} />,
            label: "Signups",
            value: AFFILIATE_METRICS.totalSignups.toLocaleString(),
          },
          {
            icon: <ShoppingCart size={16} style={{ color: "#9686B9" }} />,
            label: "Conversions",
            value: AFFILIATE_METRICS.totalConversions,
          },
          {
            icon: <DollarSign size={16} style={{ color: "#1EAA55" }} />,
            label: "Revenue",
            value: `$${AFFILIATE_METRICS.totalRevenue.toLocaleString()}`,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-3 text-center"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex justify-center mb-1">{m.icon}</div>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {m.value}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Onboarding Pipeline */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Affiliate Pipeline
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {pipeline.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-2">
              <div className="text-center">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white mx-auto"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.count}
                </div>
                <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--muted)" }}>
                  {stage.label}
                </p>
              </div>
              {i < pipeline.length - 1 && (
                <ArrowRight size={16} style={{ color: "var(--border)" }} className="mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} style={{ color: "#F1C028" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Leaderboard — Top 5
            </p>
          </div>
          <div className="space-y-3">
            {LEADERBOARD.map((entry) => (
              <div key={entry.affiliateId} className="flex items-center gap-3">
                <span
                  className="text-sm font-bold w-6 text-center"
                  style={{
                    color:
                      entry.rank === 1
                        ? "#F1C028"
                        : entry.rank === 2
                        ? "#ACB7FF"
                        : entry.rank === 3
                        ? "#78C3BF"
                        : "var(--muted)",
                  }}
                >
                  #{entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {entry.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {entry.metric}: {entry.value}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        entry.reward === "Diamond Tier"
                          ? "#78C3BF14"
                          : entry.reward === "Gold Tier"
                          ? "#F1C02814"
                          : "#ACB7FF14",
                      color:
                        entry.reward === "Diamond Tier"
                          ? "#78C3BF"
                          : entry.reward === "Gold Tier"
                          ? "#F1C028"
                          : "#ACB7FF",
                    }}
                  >
                    {entry.reward}
                  </span>
                  <TrendIcon trend={entry.trend} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Tiers */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Commission Structure
          </p>
          <div className="space-y-3">
            {COMMISSION_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-lg p-3 flex items-center justify-between"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {tier.tier}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {tier.threshold}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold" style={{ color: tier.color }}>
                  {tier.rate}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            Total revenue from affiliates:{" "}
            <span className="font-semibold" style={{ color: "#1EAA55" }}>
              ${AFFILIATE_METRICS.totalRevenue.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Affiliate CRM Table */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Affiliate CRM
        </p>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Header */}
          <div
            className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
          >
            <div className="col-span-3">Affiliate</div>
            <div className="col-span-2">Channel</div>
            <div className="col-span-1">Stage</div>
            <div className="col-span-1 text-right">Clicks</div>
            <div className="col-span-1 text-right">Signups</div>
            <div className="col-span-1 text-right">Conv.</div>
            <div className="col-span-1 text-right">Revenue</div>
            <div className="col-span-2">Next Action</div>
          </div>

          {/* Rows */}
          {AFFILIATES.map((affiliate, i) => {
            const stageConfig = AFFILIATE_STAGES.find((s) => s.key === affiliate.stage);
            const isExpanded = expandedRow === affiliate.id;

            return (
              <div key={affiliate.id}>
                <div
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-5 py-3 cursor-pointer hover:bg-black/[0.02] transition-colors items-center"
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  onClick={() => setExpandedRow(isExpanded ? null : affiliate.id)}
                >
                  {/* Name */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: stageConfig?.color ?? "#999" }}
                    >
                      {affiliate.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {affiliate.name}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
                        {affiliate.company}
                      </p>
                    </div>
                    <button className="sm:hidden ml-auto">
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                      )}
                    </button>
                  </div>

                  {/* Desktop columns */}
                  <div className="hidden sm:block sm:col-span-2 text-xs" style={{ color: "var(--foreground)" }}>
                    {affiliate.channel}
                  </div>
                  <div className="hidden sm:block sm:col-span-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${stageConfig?.color}14`,
                        color: stageConfig?.color,
                      }}
                    >
                      {stageConfig?.label}
                    </span>
                  </div>
                  <div className="hidden sm:block sm:col-span-1 text-xs text-right" style={{ color: "var(--foreground)" }}>
                    {affiliate.totalClicks.toLocaleString()}
                  </div>
                  <div className="hidden sm:block sm:col-span-1 text-xs text-right" style={{ color: "var(--foreground)" }}>
                    {affiliate.totalSignups.toLocaleString()}
                  </div>
                  <div className="hidden sm:block sm:col-span-1 text-xs text-right" style={{ color: "var(--foreground)" }}>
                    {affiliate.totalConversions}
                  </div>
                  <div className="hidden sm:block sm:col-span-1 text-xs text-right font-medium" style={{ color: "#1EAA55" }}>
                    ${affiliate.totalRevenue.toLocaleString()}
                  </div>
                  <div className="hidden sm:flex sm:col-span-2 items-center gap-1">
                    <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                      {affiliate.nextAction}
                    </p>
                    {isExpanded ? (
                      <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    className="px-5 py-3 text-xs"
                    style={{
                      backgroundColor: `${ACCENT}04`,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {/* Mobile-only metrics */}
                    <div className="grid grid-cols-2 gap-2 sm:hidden mb-3">
                      <div>
                        <span style={{ color: "var(--muted)" }}>Channel: </span>
                        <span style={{ color: "var(--foreground)" }}>{affiliate.channel}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--muted)" }}>Clicks: </span>
                        <span style={{ color: "var(--foreground)" }}>{affiliate.totalClicks.toLocaleString()}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--muted)" }}>Signups: </span>
                        <span style={{ color: "var(--foreground)" }}>{affiliate.totalSignups.toLocaleString()}</span>
                      </div>
                      <div>
                        <span style={{ color: "var(--muted)" }}>Revenue: </span>
                        <span style={{ color: "#1EAA55" }}>${affiliate.totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>

                    <p style={{ color: "var(--foreground)" }}>
                      <strong>Notes:</strong> {affiliate.notes}
                    </p>
                    <p className="mt-1" style={{ color: "var(--muted)" }}>
                      <strong>Next Action:</strong> {affiliate.nextAction}
                    </p>
                    {affiliate.joinDate && (
                      <p className="mt-1" style={{ color: "var(--muted)" }}>
                        <strong>Joined:</strong> {affiliate.joinDate} &middot;{" "}
                        <strong>Conversion Rate:</strong> {affiliate.conversionRate}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
