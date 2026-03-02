"use client";

import { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Eye,
  Target,
  Zap,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Clock,
  Sparkles,
  Loader2,
  Bot,
} from "lucide-react";
import type {
  WeeklyBrief,
} from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

const DEPT_COLORS: Record<string, string> = {
  "Operations": "#5A6FFF",
  "Email Strategy": "#ACB7FF",
  "Content Engine": "#E37FB1",
  "Community": "#1EAA55",
  "Legal / IP": "#E24D47",
  "Finance": "#F1C028",
  "Clinical / Research": "#78C3BF",
  "Fundraising": "#356FB6",
};

const STATUS_COLORS = {
  green: "#1EAA55",
  yellow: "#F1C028",
  red: "#E24D47",
};

interface Props {
  currentBrief: WeeklyBrief;
  briefArchive: { id: string; weekOf: string; headline: string; focusTheme: string }[];
}

export default function CEOWeeklyBrief({ currentBrief, briefArchive }: Props) {
  const [showArchive, setShowArchive] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);

  const handleGenerateBrief = async () => {
    setGenerating(true);
    setGeneratedBrief(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are the Strategy Coach agent for Conceivable, operating on Bill Campbell's "Trillion Dollar Coach" principles AND Dan Sullivan's Strategic Coach framework.

Generate this week's CEO Weekly Brief. You see everything across all departments and you tell the CEO what she NEEDS to hear, not what she wants to hear.

CURRENT STATE:
- 7 weeks to launch
- 29K email list, 0/5,000 signups (email sequence written but not sent)
- 847 Circle community members, 62% active, 40% dormant
- Patent portfolio: 1 granted, 1 pending, closed-loop provisional overdue
- 18 investors tracked, 5 active conversations, $150K bridge + $5M Series A planned
- Pilot study: 150-260% conception improvement, N=105
- 12 affiliates, 5 active, $39K revenue
- Content Engine: 14 pieces/week, CEO content gets 2x engagement
- Burn rate: $18K/month

STRUCTURE YOUR BRIEF:
1. THE GAIN: Top 3 wins this week (lead with progress, Sullivan principle)
2. THE WATCH LIST: Top 3 risks with evidence
3. THE UNCOMFORTABLE TRUTH: 1 thing she needs to hear
4. 10x FOCUS: The single most important thing this week
5. MULTIPLIER OPPORTUNITIES: Cross-department cascading wins
6. UNIQUE ABILITY CHECK: Is she spending time only she can do?
7. STRATEGIC QUESTIONS: What should she be thinking about?

Write it like a letter from a trusted advisor — warm but direct. Not a data dump.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedBrief(data.response);
      } else {
        setGeneratedBrief("Unable to generate brief — please check that the API is configured.");
      }
    } catch {
      setGeneratedBrief("Unable to generate brief — please check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {/* Brief Header — Personal Letter */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 80%)` }}
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              CEO Weekly Brief — Week of {new Date(currentBrief.weekOf).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-[10px] text-white/30">
              Generated {new Date(currentBrief.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {new Date(currentBrief.generatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {currentBrief.greeting}
          </p>
        </div>
      </div>

      {/* Department Pulse Strip */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {currentBrief.departmentPulses.map((dept) => {
            const statusColor = STATUS_COLORS[dept.status];
            return (
              <div
                key={dept.department}
                className="flex-shrink-0 rounded-xl border p-3 min-w-[140px]"
                style={{ borderColor: `${statusColor}30`, backgroundColor: `${statusColor}06` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                    {dept.department}
                  </p>
                </div>
                <p className="text-[10px] font-medium leading-tight" style={{ color: "var(--foreground)" }}>
                  {dept.headline}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {dept.keyMetric}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE GAIN */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1EAA5514" }}>
            <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1EAA55" }}>
              The Gain
            </h3>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>Top 3 wins — lead with progress</p>
          </div>
        </div>
        <div className="space-y-3">
          {currentBrief.gains.map((gain) => {
            const deptColor = DEPT_COLORS[gain.department] || ACCENT;
            return (
              <div
                key={gain.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${deptColor}14`, color: deptColor }}
                      >
                        {gain.department}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: gain.multiplierLabel === "10x" ? "#1EAA5514" : "#F1C02814",
                          color: gain.multiplierLabel === "10x" ? "#1EAA55" : "#F1C028",
                        }}
                      >
                        {gain.multiplierLabel}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                      {gain.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {gain.evidence}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE WATCH LIST */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E24D4714" }}>
            <AlertTriangle size={14} style={{ color: "#E24D47" }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E24D47" }}>
              The Watch List
            </h3>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>Top 3 risks — with evidence</p>
          </div>
        </div>
        <div className="space-y-3">
          {currentBrief.watchList.map((item) => {
            const sevColor = STATUS_COLORS[item.severity];
            const deptColor = DEPT_COLORS[item.department] || ACCENT;
            return (
              <div
                key={item.id}
                className="rounded-xl border-l-4 border p-4"
                style={{ borderColor: "var(--border)", borderLeftColor: sevColor, backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${deptColor}14`, color: deptColor }}
                  >
                    {item.department}
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${sevColor}14`, color: sevColor }}
                  >
                    {item.severity === "red" ? "URGENT" : "WATCH"}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                  {item.evidence}
                </p>
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: `${sevColor}06`, borderLeft: `3px solid ${sevColor}` }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: sevColor }}>
                    Suggested Action
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {item.suggestedAction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE UNCOMFORTABLE TRUTH */}
      <div className="mb-6">
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#2A2828" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-white/60" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">
              The Uncomfortable Truth
            </h3>
          </div>
          <p className="text-white font-semibold text-base mb-4 leading-snug">
            {currentBrief.uncomfortableTruth.title}
          </p>
          <div className="space-y-3 mb-5">
            {currentBrief.uncomfortableTruth.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-white/80 text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#F1C028" }}>
                Sullivan Lens (10x vs 2x)
              </p>
              <p className="text-white/70 text-xs leading-relaxed">
                {currentBrief.uncomfortableTruth.sullivanLens}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#ACB7FF" }}>
                Campbell Lens (First Principles)
              </p>
              <p className="text-white/70 text-xs leading-relaxed">
                {currentBrief.uncomfortableTruth.campbellLens}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 10x FOCUS */}
      <div className="mb-6">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}04` }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${ACCENT}14` }}>
              <Target size={18} style={{ color: ACCENT }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  10x Focus This Week
                </h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
                  HIGHEST LEVERAGE
                </span>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                {currentBrief.tenXFocus.focus}
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
                {currentBrief.tenXFocus.rationale}
              </p>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "#E24D47" }}>
                  What to Say No To
                </p>
                <div className="space-y-1">
                  {currentBrief.tenXFocus.whatToSayNoTo.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs shrink-0 mt-0.5" style={{ color: "#E24D47" }}>&#10005;</span>
                      <p className="text-[11px]" style={{ color: "var(--foreground)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MULTIPLIER OPPORTUNITIES */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F1C02814" }}>
            <Zap size={14} style={{ color: "#F1C028" }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F1C028" }}>
              Multiplier Opportunities
            </h3>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>Actions that cascade across departments</p>
          </div>
        </div>
        <div className="space-y-3">
          {currentBrief.multiplierOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {opp.departments.map((dept) => {
                  const color = DEPT_COLORS[dept] || ACCENT;
                  return (
                    <span
                      key={dept}
                      className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}14`, color }}
                    >
                      {dept}
                    </span>
                  );
                })}
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
                  style={{
                    backgroundColor: opp.multiplierLabel === "10x" ? "#1EAA5514" : "#F1C02814",
                    color: opp.multiplierLabel === "10x" ? "#1EAA55" : "#F1C028",
                  }}
                >
                  {opp.multiplierLabel}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
                {opp.action}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {opp.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* UNIQUE ABILITY CHECK */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E24D4714" }}>
            <Shield size={14} style={{ color: "#E24D47" }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E24D47" }}>
              Unique Ability Check
            </h3>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>
              {currentBrief.uniqueAbilityFlags.reduce((sum, f) => sum + f.hoursPerWeek, 0)} hours/week flagged for delegation
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {currentBrief.uniqueAbilityFlags.map((flag) => (
            <div
              key={flag.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {flag.task}
                </p>
                <span className="text-xs font-bold shrink-0 ml-2" style={{ color: "#E24D47" }}>
                  {flag.hoursPerWeek}h/wk
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                {flag.reasoning}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>CEO →</span>
                <span className="text-[10px] font-semibold" style={{ color: ACCENT }}>
                  {flag.suggestedOwner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STRATEGIC QUESTIONS */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ACCENT}14` }}>
            <HelpCircle size={14} style={{ color: ACCENT }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
              Questions to Sit With
            </h3>
            <p className="text-[9px]" style={{ color: "var(--muted)" }}>Strategic questions for this week</p>
          </div>
        </div>
        <div className="space-y-3">
          {currentBrief.strategicQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: q.framework === "sullivan" ? "#F1C02814" : q.framework === "campbell" ? "#ACB7FF14" : `${ACCENT}14`,
                    color: q.framework === "sullivan" ? "#F1C028" : q.framework === "campbell" ? "#ACB7FF" : ACCENT,
                  }}
                >
                  {q.framework === "sullivan" ? "Sullivan" : q.framework === "campbell" ? "Campbell" : "Both"}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1.5 italic" style={{ color: "var(--foreground)" }}>
                &ldquo;{q.question}&rdquo;
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {q.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: `linear-gradient(135deg, #2A2828 0%, ${ACCENT}40 100%)` }}
      >
        <div className="space-y-3">
          {currentBrief.closing.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-white/85 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Generate Fresh Brief */}
      <div className="mb-6">
        <button
          onClick={handleGenerateBrief}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          {generating ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating This Week&apos;s Brief...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Generate Fresh Brief from All Departments
            </>
          )}
        </button>

        {generatedBrief && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} style={{ color: ACCENT }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                Generated Brief
              </p>
            </div>
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                {generatedBrief}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Brief Archive */}
      <div>
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="flex items-center gap-2 mb-3 w-full"
        >
          <Clock size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider flex-1 text-left" style={{ color: "var(--foreground)" }}>
            Brief Archive
          </h3>
          {showArchive ? (
            <ChevronDown size={14} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          )}
        </button>
        {showArchive && (
          <div className="space-y-2">
            {briefArchive.map((brief) => (
              <div
                key={brief.id}
                className="rounded-xl border p-3 flex items-center gap-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="shrink-0 text-center">
                  <p className="text-[9px] font-bold uppercase" style={{ color: ACCENT }}>
                    {new Date(brief.weekOf).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-sm font-bold leading-none" style={{ color: "var(--foreground)" }}>
                    {new Date(brief.weekOf).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {brief.headline}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Focus: {brief.focusTheme}
                  </p>
                </div>
                <ArrowUpRight size={12} style={{ color: "var(--muted)" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
