"use client";

import { TrendingUp, Users, DollarSign, Clock, ArrowRight, MessageSquare, AlertTriangle } from "lucide-react";

const ACCENT = "#356FB6";

const PIPELINE_VALUE = 8250000;

const STAGE_FUNNEL = [
  { stage: "Prospect", count: 23, value: 5500000, color: "#9686B9" },
  { stage: "Contacted", count: 12, value: 3800000, color: "#78C3BF" },
  { stage: "Meeting", count: 7, value: 2400000, color: "#356FB6" },
  { stage: "Due Diligence", count: 3, value: 1200000, color: "#F1C028" },
  { stage: "Term Sheet", count: 1, value: 500000, color: "#1EAA55" },
];

const RECENT_ACTIVITY = [
  { date: "2026-03-01", type: "meeting" as const, description: "Follow-up call with Serena Ventures associate", investor: "Serena Williams / Serena Ventures" },
  { date: "2026-02-28", type: "email" as const, description: "Sent updated pitch deck to Alice Walton team", investor: "Alice Walton" },
  { date: "2026-02-27", type: "research" as const, description: "Completed weekly intel update on MacKenzie Scott giving patterns", investor: "MacKenzie Scott" },
  { date: "2026-02-26", type: "meeting" as const, description: "Intro meeting with FemTech VC partner", investor: "Spring Health Ventures" },
  { date: "2026-02-25", type: "milestone" as const, description: "Data room checklist 85% complete", investor: "All" },
  { date: "2026-02-24", type: "email" as const, description: "Cold outreach to Melinda Gates Foundation program officer", investor: "Melinda Gates" },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function ActivityIcon({ type }: { type: "meeting" | "email" | "research" | "milestone" }) {
  const config = {
    meeting: { color: "#356FB6", icon: Users },
    email: { color: "#78C3BF", icon: MessageSquare },
    research: { color: "#9686B9", icon: TrendingUp },
    milestone: { color: "#1EAA55", icon: DollarSign },
  };
  const c = config[type];
  const Icon = c.icon;
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${c.color}18` }}
    >
      <Icon size={12} style={{ color: c.color }} />
    </div>
  );
}

export default function FundraisingDashboardPage() {
  const activeConversations = STAGE_FUNNEL.reduce((sum, s) => sum + s.count, 0) - STAGE_FUNNEL[0].count;

  return (
    <div className="space-y-6">
      {/* Hero: Pipeline Value */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
          Pipeline Value
        </p>
        <p className="text-5xl font-bold" style={{ color: "var(--foreground)" }}>
          {formatCurrency(PIPELINE_VALUE)}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          total potential funding in pipeline
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            The Gain: From $0 pipeline to {formatCurrency(PIPELINE_VALUE)} in 6 months
          </span>
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
              Active Conversations
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{activeConversations}</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>investors beyond prospect stage</p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: "#F1C028" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Runway Urgency
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>4.2 mo</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>remaining at current burn rate</p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} style={{ color: "#1EAA55" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Closest to Close
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{formatCurrency(500000)}</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>at term sheet stage</p>
        </div>
      </div>

      {/* Stage Funnel */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Pipeline Funnel
        </h2>
        <div className="space-y-3">
          {STAGE_FUNNEL.map((stage, i) => {
            const maxCount = STAGE_FUNNEL[0].count;
            const pct = (stage.count / maxCount) * 100;
            return (
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
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium" style={{ color: stage.color }}>
                      {stage.count} investors
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {formatCurrency(stage.value)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Recent Activity
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {RECENT_ACTIVITY.map((activity, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <ActivityIcon type={activity.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: ACCENT }}>{activity.investor}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Runway Urgency Alert */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#F1C02810", border: "1px solid #F1C02820" }}
      >
        <AlertTriangle size={16} style={{ color: "#F1C028" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F1C028" }}>
            Runway Alert: 4.2 Months Remaining
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
            At current burn rate, bridge funding or Series A commitment needed by Q3 2026.
            Priority: close $150K bridge from existing angels while pursuing $5M Series A.
          </p>
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
              Multiplier: Patent Filing + Publication + Pitch = Triple Validation
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
