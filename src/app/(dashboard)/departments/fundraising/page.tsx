"use client";

import { useState } from "react";
import { TrendingUp, Users, DollarSign, Clock, ArrowRight, MessageSquare, AlertTriangle, Target, Sparkles, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

const ACCENT = "#356FB6";

/* ── Real Data Only ── */
const BRIDGE_TARGET = 150000;
const BRIDGE_RAISED = 0;
const SERIES_A_TARGET = 5000000;

const RUNWAY_MONTHS = 2;
const MONTHLY_BURN = 28000;

const STAGE_FUNNEL = [
  { stage: "Research List", count: 0, color: "#9686B9" },
  { stage: "Outreach Sent", count: 0, color: "#78C3BF" },
  { stage: "In Conversation", count: 0, color: "#356FB6" },
  { stage: "Due Diligence", count: 0, color: "#F1C028" },
  { stage: "Committed", count: 0, color: "#1EAA55" },
];

/* ── Joy's Recommended Actions ── */
const JOY_ACTIONS = [
  {
    title: "Build Target 50 VC List",
    description: "Joy will research and compile 50 fertility/femtech/health-focused VCs with thesis alignment, check sizes, and warm intro paths.",
    priority: "critical" as const,
    department: "fundraising",
  },
  {
    title: "Draft Bridge Round Memo",
    description: "Create a $150K bridge round memo for existing angels with updated metrics, pilot data, and use of funds.",
    priority: "critical" as const,
    department: "fundraising",
  },
  {
    title: "Map Strategic Partnership Pipeline",
    description: "Identify 10 strategic partners (Oura, fertility clinics, health systems) who could lead to investment or distribution.",
    priority: "high" as const,
    department: "fundraising",
  },
  {
    title: "Prepare Data Room",
    description: "Compile financials, cap table, patent portfolio, pilot data, and team bios into a shared data room.",
    priority: "high" as const,
    department: "fundraising",
  },
  {
    title: "Update Pitch Deck with Pilot Results",
    description: "Integrate 150-260% improvement pilot data into the Series A deck. This is the #1 differentiator.",
    priority: "critical" as const,
    department: "clinical",
  },
];

function PriorityBadge({ priority }: { priority: "critical" | "high" | "standard" }) {
  const config = {
    critical: { bg: "#E24D4718", color: "#E24D47" },
    high: { bg: "#F1C02818", color: "#F1C028" },
    standard: { bg: "#356FB618", color: "#356FB6" },
  };
  const c = config[priority];
  return (
    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {priority}
    </span>
  );
}

export default function FundraisingDashboardPage() {
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const bridgePct = Math.max(1, (BRIDGE_RAISED / BRIDGE_TARGET) * 100);

  return (
    <div className="space-y-6">
      {/* Runway RED Alert */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ backgroundColor: "#E24D470A", border: "1px solid #E24D4720" }}
      >
        <AlertTriangle size={24} style={{ color: "#E24D47" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#E24D47" }}>
            RUNWAY: {RUNWAY_MONTHS} MONTHS — CRITICAL
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
            At ~${(MONTHLY_BURN / 1000).toFixed(0)}K/month burn, bridge funding must close before April.
            Priority: $150K bridge from existing angels while pursuing $5M Series A.
          </p>
        </div>
      </div>

      {/* Bridge Round Progress */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} style={{ color: ACCENT }} />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              $150K Bridge Round
            </span>
          </div>
          <span className="text-sm font-bold" style={{ color: ACCENT }}>
            ${(BRIDGE_RAISED / 1000).toFixed(0)}K / $150K
          </span>
        </div>
        <div className="w-full h-3 rounded-full mb-2" style={{ backgroundColor: "var(--border)" }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${bridgePct}%`, backgroundColor: ACCENT }} />
        </div>
        <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--muted)" }}>
          <span>Target: existing angels + strategic investors</span>
          <span>Series A target: $5M</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Investors Contacted
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>0</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>build list first, then outreach</p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: "#E24D47" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Runway
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#E24D47" }}>{RUNWAY_MONTHS} mo</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>~${(MONTHLY_BURN / 1000).toFixed(0)}K/mo burn rate</p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} style={{ color: "#1EAA55" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Committed
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>$0</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>no commitments yet</p>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Investor Pipeline
        </h2>
        <div className="space-y-3">
          {STAGE_FUNNEL.map((stage, i) => (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {stage.stage}
                  </span>
                  {i < STAGE_FUNNEL.length - 1 && (
                    <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                  )}
                </div>
                <span className="text-xs font-medium" style={{ color: stage.count > 0 ? stage.color : "var(--muted)" }}>
                  {stage.count} investors
                </span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: stage.count > 0 ? `${(stage.count / 50) * 100}%` : "0%", backgroundColor: stage.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: "var(--muted)" }}>
          Pipeline empty — use Joy to build your target 50 list
        </p>
      </div>

      {/* Joy's Recommended Actions */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Sparkles size={16} style={{ color: "#5A6FFF" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Joy&apos;s Fundraising Actions
          </h2>
          <span className="text-xs ml-auto" style={{ color: "var(--muted)" }}>
            {JOY_ACTIONS.length} actions recommended
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {JOY_ACTIONS.map((action, i) => (
            <div key={i}>
              <div
                className="px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpandedAction(expandedAction === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {action.title}
                    </p>
                    <PriorityBadge priority={action.priority} />
                  </div>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0"
                    style={{ backgroundColor: "#5A6FFF" }}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Sparkles size={11} />
                    Joy: Start
                  </button>
                </div>
              </div>
              {expandedAction === i && (
                <div className="px-5 pb-4" style={{ backgroundColor: "var(--background)" }}>
                  <p className="text-xs leading-relaxed pt-2" style={{ color: "var(--muted)" }}>
                    {action.description}
                  </p>
                  {action.department !== "fundraising" && (
                    <p className="text-[10px] mt-2" style={{ color: ACCENT }}>
                      Cross-department: {action.department}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pitch Assets */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Key Pitch Assets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Pilot Study Results", detail: "150-260% improvement, N=105", status: "ready", dept: "Clinical" },
            { title: "Patent Portfolio", detail: "5 filings, closed-loop pending", status: "in-progress", dept: "Legal" },
            { title: "30K Email Subscribers", detail: "Organic growth, high engagement", status: "ready", dept: "Marketing" },
            { title: "400K TikTok Reach", detail: "Viral content, 3.4M views", status: "ready", dept: "Marketing" },
            { title: "Conceivable Product v1", detail: "50-factor model + Halo Ring", status: "ready", dept: "Product" },
            { title: "220 Circle Members", detail: "Engaged community", status: "ready", dept: "Community" },
          ].map((asset) => (
            <div
              key={asset.title}
              className="rounded-lg p-3"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{asset.title}</span>
                <span
                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: asset.status === "ready" ? "#1EAA5514" : "#F1C02814",
                    color: asset.status === "ready" ? "#1EAA55" : "#F1C028",
                  }}
                >
                  {asset.status === "ready" ? "Ready" : "In Progress"}
                </span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>{asset.detail}</p>
              <p className="text-[10px] mt-1" style={{ color: ACCENT }}>{asset.dept}</p>
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
              Multiplier: Patent + Publication + Pitch = Triple Validation
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Filing the Closed-Loop patent (Legal), submitting the pilot study paper (Clinical),
              and updating the pitch deck (Fundraising) create a synchronized validation event that
              dramatically strengthens the Series A narrative. One coordinated push, three departments aligned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
