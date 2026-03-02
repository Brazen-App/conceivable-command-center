"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Bot,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  Activity,
  Zap,
} from "lucide-react";
import type {
  CohortOutcome,
  AgentPerformance,
} from "@/lib/data/clinical-data";

const ACCENT = "#78C3BF";

interface Props {
  cohortOutcomes: CohortOutcome[];
  agentPerformance: AgentPerformance[];
  dropOffData: { stage: string; pct: number; users: number }[];
}

function GainBar({ gain, label }: { gain: number; label: string }) {
  const width = Math.min(100, Math.abs(gain));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #1EAA55)`,
          }}
        />
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color: "#1EAA55" }}>
        {gain > 0 ? "+" : ""}{label}
      </span>
    </div>
  );
}

export default function OutcomesDashboard({
  cohortOutcomes,
  agentPerformance,
  dropOffData,
}: Props) {
  const [selectedWeek, setSelectedWeek] = useState<4 | 8 | 12>(12);
  const [showAgents, setShowAgents] = useState(true);

  return (
    <div>
      {/* Gain-not-Gap header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 100%)` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="text-white" size={22} strokeWidth={2} />
          <div>
            <p className="text-white font-semibold text-sm">Cohort Outcomes — The Gain, Not the Gap</p>
            <p className="text-white/60 text-xs">
              N=105 &middot; Pilot study &middot; Measuring from where we started
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Conception Rate Gain</p>
            <p className="text-white text-xl font-bold">+175%</p>
            <p className="text-white/40 text-[9px]">8% → 22% at Week 12</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Ovulation Rate Gain</p>
            <p className="text-white text-xl font-bold">+34%</p>
            <p className="text-white/40 text-[9px]">68% → 91% at Week 12</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Luteal Phase Gain</p>
            <p className="text-white text-xl font-bold">+33%</p>
            <p className="text-white/40 text-[9px]">9.1d → 12.1d at Week 12</p>
          </div>
        </div>
      </div>

      {/* Week selector */}
      <div className="flex items-center gap-2 mb-4">
        <Activity size={14} style={{ color: ACCENT }} />
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
          Cohort Progress
        </h3>
        <div className="ml-auto flex gap-1">
          {([4, 8, 12] as const).map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className="px-3 py-1 rounded-lg text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: selectedWeek === w ? ACCENT : "var(--background)",
                color: selectedWeek === w ? "white" : "var(--muted)",
                border: `1px solid ${selectedWeek === w ? ACCENT : "var(--border)"}`,
              }}
            >
              Week {w}
            </button>
          ))}
        </div>
      </div>

      {/* Outcome cards */}
      <div className="space-y-2 mb-8">
        {cohortOutcomes.map((outcome) => {
          const weekData =
            selectedWeek === 4 ? outcome.week4 : selectedWeek === 8 ? outcome.week8 : outcome.week12;
          const gain = weekData.gain ?? 0;

          return (
            <div
              key={outcome.metric}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {outcome.metric}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Baseline: {outcome.baseline.value}{outcome.baseline.unit === "%" ? "%" : ` ${outcome.baseline.unit}`}
                    </span>
                    {outcome.populationBaseline !== undefined && (
                      <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                        Population avg: {outcome.populationBaseline}{outcome.baseline.unit === "%" ? "%" : ` ${outcome.baseline.unit}`}
                      </span>
                    )}
                    {outcome.ivfComparison !== undefined && (
                      <span className="text-[10px]" style={{ color: "#9686B9" }}>
                        IVF: {outcome.ivfComparison}{outcome.baseline.unit === "%" ? "%" : ` ${outcome.baseline.unit}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                    {weekData.value}{weekData.unit === "%" ? "%" : ` ${weekData.unit}`}
                  </p>
                  {gain > 0 && (
                    <span className="text-[10px] font-bold flex items-center gap-0.5 justify-end" style={{ color: "#1EAA55" }}>
                      <ArrowUp size={9} /> {gain}% gain
                    </span>
                  )}
                </div>
              </div>
              {gain > 0 && <GainBar gain={gain} label={`${gain}%`} />}
            </div>
          );
        })}
      </div>

      {/* Agent Performance */}
      <div className="mb-8">
        <button
          onClick={() => setShowAgents(!showAgents)}
          className="flex items-center gap-2 mb-3 w-full"
        >
          <Bot size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider flex-1 text-left" style={{ color: "var(--foreground)" }}>
            AI Agent Performance — Who&apos;s Driving Improvement?
          </h3>
          {showAgents ? <ChevronDown size={14} style={{ color: "var(--muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--muted)" }} />}
        </button>
        {showAgents && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agentPerformance.map((agent) => (
              <div
                key={agent.agentName}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${ACCENT}14` }}
                  >
                    <Bot size={14} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {agent.agentName}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>{agent.metric}</span>
                  <span className="text-sm font-bold" style={{ color: "#1EAA55" }}>+{agent.improvement}%</span>
                </div>
                <GainBar gain={agent.improvement} label={`${agent.improvement}%`} />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>N={agent.sampleSize}</span>
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>Top: {agent.topIntervention}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Drop-off Funnel */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Engagement Funnel
          </h3>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="space-y-2">
            {dropOffData.map((step, i) => {
              const isLast = step.stage === "Conceived";
              return (
                <div key={step.stage} className="flex items-center gap-3">
                  <span className="text-[10px] w-[130px] shrink-0 text-right" style={{ color: "var(--muted)" }}>
                    {step.stage}
                  </span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{
                        width: `${step.pct}%`,
                        background: isLast
                          ? "linear-gradient(90deg, #1EAA55, #78C3BF)"
                          : `linear-gradient(90deg, ${ACCENT}80, ${ACCENT})`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white">{step.pct}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono w-[40px] shrink-0" style={{ color: "var(--muted-light)" }}>
                    n={step.users}
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
              <strong>Key insight:</strong> The biggest drop-off is between Week 4 and Week 8 (78% → 64%). Users who survive to Week 8 are 81% likely to complete the full 12-week protocol. Focus retention efforts on the Week 4-8 window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
