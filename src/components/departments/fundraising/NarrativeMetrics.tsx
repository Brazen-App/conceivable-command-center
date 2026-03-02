"use client";

import { useState } from "react";
import {
  Quote,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  Mail,
  Users,
  Megaphone,
  Shield,
  FlaskConical,
  DollarSign,
  Database,
  Loader2,
  Bot,
} from "lucide-react";
import type {
  FundraiseMetric,
  WeeklyRecommendation,
} from "@/lib/data/fundraising-data";

const ACCENT = "#356FB6";

interface Props {
  narrative: string;
  metrics: FundraiseMetric[];
  weeklyRecommendation: WeeklyRecommendation;
  storyAngles: { investorFocus: string; angle: string; openingLine: string }[];
}

const SOURCE_ICONS: Record<string, typeof Mail> = {
  "Email Strategy": Mail,
  Operations: Users,
  "Content Engine": Megaphone,
  Legal: Shield,
  Clinical: FlaskConical,
  Finance: DollarSign,
  Product: Database,
};

const TREND_CONFIG = {
  up: { Icon: TrendingUp, color: "#1EAA55" },
  down: { Icon: TrendingDown, color: "#E24D47" },
  flat: { Icon: Minus, color: "var(--muted)" },
};

export default function NarrativeMetrics({
  narrative,
  metrics,
  weeklyRecommendation,
  storyAngles,
}: Props) {
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [customFocus, setCustomFocus] = useState("");

  const handleGenerateStory = async (focus: string, angleText: string) => {
    setGeneratingStory(true);
    setGeneratedStory(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are preparing a customized investor pitch narrative for Conceivable, a women's health tech company.

INVESTOR FOCUS: ${focus}
ANGLE: ${angleText}

COMPANY FACTS:
- AI-powered fertility health platform, founded by Kirsten Karchmer (20+ years clinical experience)
- Pilot study: 150-260% improvement in conception likelihood, N=105, 240K data points
- 500K+ BBT charts training data from 7,000+ patients
- Patent portfolio: 1 granted (BBT interpretation), 1 pending (CON Score), 3 provisionals planned
- Closed-loop physiologic correction system (identify driver → intervene → measure → adapt)
- 120+ podcast appearances in 4 months, 2,800+ email list, 1,200+ early access signups
- $50B FemTech market, no clear winner in fertility optimization
- Preparing for $150K bridge + $5M Series A

Generate a compelling 3-paragraph pitch narrative (about 200 words) tailored to this investor's interests. Be specific, use real numbers, and make the case for why Conceivable is the opportunity they've been waiting for. End with a clear ask or call to action.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedStory(data.response);
      } else {
        setGeneratedStory("Unable to generate story — please check that the API is configured.");
      }
    } catch {
      setGeneratedStory("Unable to generate story — please check your connection and try again.");
    } finally {
      setGeneratingStory(false);
    }
  };

  return (
    <div>
      {/* The Narrative */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 80%)`,
        }}
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Quote size={80} className="text-white" />
        </div>
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
            The Fundraising Narrative
          </p>
          <div className="space-y-3">
            {narrative.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-white/90 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Agent Recommendation */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{
          borderColor: "#E24D47",
          backgroundColor: "#E24D4704",
        }}
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

      {/* Live Metrics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Investor-Ready Metrics
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            Live from across departments
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const SourceIcon = SOURCE_ICONS[metric.source] || Target;
            const trendConf = metric.trend ? TREND_CONFIG[metric.trend] : null;

            return (
              <div
                key={metric.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SourceIcon size={12} style={{ color: ACCENT }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {metric.label}
                    </span>
                  </div>
                  {trendConf && (
                    <trendConf.Icon size={14} style={{ color: trendConf.color }} />
                  )}
                </div>
                <p className="text-lg font-bold mb-1" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {metric.context}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                    Source: {metric.source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investor Story Generator */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Investor Story Generator
          </h3>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Select an investor focus to generate a customized narrative angle. Each story leads with what matters most to that investor type.
        </p>

        {/* Preset angles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {storyAngles.map((angle, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedAngle(i);
                setGeneratedStory(null);
              }}
              className={`text-left rounded-xl border p-3.5 transition-all ${
                selectedAngle === i ? "ring-2" : ""
              }`}
              style={{
                borderColor: selectedAngle === i ? ACCENT : "var(--border)",
                backgroundColor: selectedAngle === i ? `${ACCENT}08` : "var(--background)",
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: selectedAngle === i ? ACCENT : "var(--foreground)" }}>
                {angle.investorFocus}
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
                {angle.angle}
              </p>
            </button>
          ))}
        </div>

        {/* Custom focus */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={customFocus}
            onChange={(e) => {
              setCustomFocus(e.target.value);
              setSelectedAngle(null);
            }}
            placeholder="Or describe a custom investor focus..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
            }}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={() => {
            if (selectedAngle !== null) {
              const a = storyAngles[selectedAngle];
              handleGenerateStory(a.investorFocus, a.angle);
            } else if (customFocus.trim()) {
              handleGenerateStory(customFocus, "Custom investor angle — tailor the pitch to this specific focus area");
            }
          }}
          disabled={generatingStory || (selectedAngle === null && !customFocus.trim())}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          {generatingStory ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating Narrative...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Generate Investor Story
            </>
          )}
        </button>

        {/* Opening line preview */}
        {selectedAngle !== null && !generatedStory && (
          <div
            className="rounded-lg p-3 mt-3"
            style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
              Opening Line
            </p>
            <p className="text-xs italic leading-relaxed" style={{ color: "var(--foreground)" }}>
              &ldquo;{storyAngles[selectedAngle].openingLine}&rdquo;
            </p>
          </div>
        )}

        {/* Generated story */}
        {generatedStory && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} style={{ color: ACCENT }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                Generated Narrative
              </p>
            </div>
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                {generatedStory}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
