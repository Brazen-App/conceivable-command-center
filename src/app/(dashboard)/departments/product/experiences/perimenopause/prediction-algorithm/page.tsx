"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Thermometer,
  Moon,
  Heart,
  Brain,
  FlaskConical,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ACCENT = "#D4944A";

const SIGNALS = [
  {
    name: "Follicular Phase BBT Elevation",
    type: "Primary",
    weight: 30,
    icon: Thermometer,
    color: "#E24D47",
    clinical: "As estrogen declines, follicular phase (pre-ovulation) basal body temperatures rise. When follicular BBTs consistently exceed 97.2°F (36.2°C), this indicates declining estrogen production in women over 38 without known endometriosis.",
    measurement: "Halo Ring continuous overnight temperature",
    threshold: "Average follicular phase BBT > 97.2°F sustained over 2+ cycles",
    boost: "Compare against personal historical follicular BBT average. A rise of 0.3°F+ from established baseline is significant even if absolute temp is below 97.2°F.",
    novel: true,
  },
  {
    name: "Cycle Length Variability",
    type: "Secondary",
    weight: 20,
    icon: Activity,
    color: "#F59E0B",
    clinical: "Early perimenopause typically shows increased cycle-to-cycle variability before cycles become frankly irregular. STRAW+10 criteria define early perimenopause as persistent variability of 7+ days in consecutive cycle lengths.",
    measurement: "Cycle length tracking over 6+ cycles",
    threshold: "SD increase of 2+ days, OR any cycle varying 7+ days from personal average",
    boost: null,
    novel: false,
  },
  {
    name: "HRV Trajectory",
    type: "Secondary",
    weight: 15,
    icon: Heart,
    color: "#5A6FFF",
    clinical: "HRV declines with hormonal changes. A sustained downward trend not explained by illness, stress events, or lifestyle changes suggests hormonal shift.",
    measurement: "Halo Ring continuous HRV (RMSSD)",
    threshold: "Sustained 10%+ decline over 3-6 months without explanatory factors",
    boost: null,
    novel: false,
  },
  {
    name: "Sleep Architecture Changes",
    type: "Secondary",
    weight: 15,
    icon: Moon,
    color: "#9686B9",
    clinical: "Estrogen affects thermoregulation and sleep architecture. Changes include: decreased sleep efficiency, increased wake episodes (especially temperature-related), earlier wake times, reduced deep sleep.",
    measurement: "Halo Ring sleep tracking",
    threshold: "Sleep efficiency decline of 5%+ sustained, OR wake episodes increase of 1+ per night sustained",
    boost: null,
    novel: false,
  },
  {
    name: "Thermoregulatory Events",
    type: "Secondary",
    weight: 10,
    icon: Thermometer,
    color: "#C9536E",
    clinical: "Sudden temperature spikes during sleep or rest produce measurable patterns. The Halo Ring detects these as rapid temperature elevations.",
    measurement: "Halo Ring temperature — sudden spikes of 0.5°F+ during sleep",
    threshold: "2+ events per week sustained over 4+ weeks",
    boost: null,
    novel: false,
    fdaNote: "We are NOT detecting or counting \"hot flashes.\" We are monitoring thermoregulatory adaptation patterns as the body adjusts to a changing hormonal landscape.",
  },
  {
    name: "Self-Reported Indicators",
    type: "Tertiary",
    weight: 10,
    icon: Brain,
    color: "#78C3BF",
    clinical: "Mood changes not explained by life events (5%), new onset joint stiffness (2.5%), changes in skin/hair/vaginal comfort (2.5%). These add confirmation but are not primary detection factors.",
    measurement: "In-app check-ins and Seren conversations",
    threshold: "Persistent self-reported changes aligned with other signals",
    boost: null,
    novel: false,
  },
];

const LEVELS = [
  { level: 0, range: "0-20%", label: "No Signals", color: "#1EAA55", bgColor: "#1EAA5510", description: "No significant perimenopause signals detected. Continue standard Periods monitoring." },
  { level: 1, range: "21-40%", label: "Early Signals", color: "#5A6FFF", bgColor: "#5A6FFF10", description: "\"I'm noticing some subtle shifts in your data that I want to keep an eye on. Nothing to worry about — I'll let you know if the pattern develops.\"" },
  { level: 2, range: "41-60%", label: "Multiple Signals", color: "#F59E0B", bgColor: "#F59E0B10", description: "\"I've been tracking some patterns over the last few months. Your follicular temperatures have risen, your cycles are becoming more variable, and your sleep patterns are shifting. These patterns are consistent with early hormonal transition — your body may be beginning perimenopause. This is completely normal. Want me to walk you through what's happening?\"" },
  { level: 3, range: "61-80%", label: "Strong Convergence", color: "#D4944A", bgColor: "#D4944A10", description: "\"The patterns I've been watching have strengthened. I'd recommend getting a cycle day 3 hormone panel — a blood test on day 3 of your period that checks FSH, LH, estradiol, and AMH. This will give us and your doctor a clear picture. I can help you order this through our lab partner or you can ask your doctor.\"" },
  { level: 4, range: "81-100%", label: "High Confidence", color: "#E24D47", bgColor: "#E24D4710", description: "High confidence perimenopause. Full transition support activated. Experience transition from Periods to Perimenopause initiated." },
];

const LABS = [
  { test: "FSH", name: "Follicle-Stimulating Hormone", significance: "Rising FSH is the classic perimenopause marker" },
  { test: "LH", name: "Luteinizing Hormone", significance: "Rising LH:FSH ratio indicates transition" },
  { test: "Estradiol", name: "Estrogen", significance: "Declining estrogen levels confirm transition" },
  { test: "AMH", name: "Anti-Müllerian Hormone", significance: "Ovarian reserve indicator" },
  { test: "TSH", name: "Thyroid Stimulating Hormone", significance: "Thyroid dysfunction mimics perimenopause — must rule out" },
];

export default function PerimenopausePredictionPage() {
  const [expandedSignal, setExpandedSignal] = useState<string | null>(SIGNALS[0].name);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/departments/product/experiences/perimenopause" className="p-2 rounded-lg hover:bg-black/5 transition-colors">
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              Perimenopause Prediction Algorithm
            </h1>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}>
              Sprint Item
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Technical Specification — Multi-signal detection from continuous wearable data
          </p>
        </div>
      </div>

      {/* Purpose */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderLeft: `4px solid ${ACCENT}` }}>
        <h2 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>Purpose</h2>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Detect the onset of perimenopause from continuous physiological data, potentially <strong style={{ color: ACCENT }}>years before clinical diagnosis</strong>. For women with historical baseline data (from Periods experience), compare against personal norms. For new users, establish baseline over 3 cycles then monitor for the signature pattern.
        </p>
      </div>

      {/* Signal Weights Visualization */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Signal Weights
        </h2>
        <div className="space-y-3">
          {SIGNALS.map((signal) => {
            const Icon = signal.icon;
            const isExpanded = expandedSignal === signal.name;
            return (
              <div key={signal.name}>
                <button
                  onClick={() => setExpandedSignal(isExpanded ? null : signal.name)}
                  className="w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${signal.color}14` }}>
                      <Icon size={14} style={{ color: signal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-left" style={{ color: "var(--foreground)" }}>{signal.name}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${signal.color}14`, color: signal.color }}>
                          {signal.type}
                        </span>
                        {signal.novel && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}>
                            Novel Insight
                          </span>
                        )}
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${signal.weight}%`, backgroundColor: signal.color }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: signal.color }}>{signal.weight}%</span>
                    {isExpanded ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-11 mt-3 rounded-xl p-4 space-y-2" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                      <strong style={{ color: "var(--foreground)" }}>Clinical Basis:</strong> {signal.clinical}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                      <strong style={{ color: "var(--foreground)" }}>Measurement:</strong> {signal.measurement}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                      <strong style={{ color: "var(--foreground)" }}>Threshold:</strong> {signal.threshold}
                    </p>
                    {signal.boost && (
                      <p className="text-[11px]" style={{ color: ACCENT }}>
                        <strong>Baseline Boost:</strong> {signal.boost}
                      </p>
                    )}
                    {signal.fdaNote && (
                      <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                        <p className="text-[10px] font-bold" style={{ color: "#E24D47" }}>
                          <AlertTriangle size={10} className="inline mr-1" />
                          FDA LANGUAGE: {signal.fdaNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Likelihood Levels */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Transition Likelihood Levels
        </h2>
        <p className="text-[10px] mb-4" style={{ color: "#E24D47" }}>
          <strong>NOT a diagnosis. NOT &quot;you are in perimenopause.&quot;</strong> The output is a TRANSITION LIKELIHOOD INDICATOR.
        </p>
        <div className="space-y-3">
          {LEVELS.map((level) => (
            <div key={level.level} className="rounded-xl p-4" style={{ backgroundColor: level.bgColor, border: `1px solid ${level.color}20` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${level.color}18`, color: level.color }}>
                  L{level.level}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: level.color }}>{level.label}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>{level.range} confidence</p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed ml-13" style={{ color: "var(--muted)" }}>{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Baseline Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
          <h3 className="text-xs font-bold mb-3" style={{ color: "#1EAA55" }}>With Periods Experience Data (1+ years)</h3>
          <ul className="space-y-1.5">
            {["Personal follicular BBT baseline established", "Personal cycle variability baseline established", "Personal HRV baseline established", "Personal sleep pattern baseline established", "Detection sensitivity significantly higher"].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#1EAA55" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#F59E0B08", border: "1px solid #F59E0B20" }}>
          <h3 className="text-xs font-bold mb-3" style={{ color: "#F59E0B" }}>New Users (No Historical Data)</h3>
          <ul className="space-y-1.5">
            {["First 3 cycles establish provisional baseline", "Population-average thresholds used initially", "Detection sensitivity lower at first", "Improves with data accumulation"].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Day 3 Lab Integration */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={16} style={{ color: ACCENT }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Day 3 Lab Integration (Level 3+)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: `${ACCENT}10` }}>
                <th className="text-left px-3 py-2 font-bold" style={{ color: ACCENT }}>Test</th>
                <th className="text-left px-3 py-2 font-bold" style={{ color: ACCENT }}>Full Name</th>
                <th className="text-left px-3 py-2 font-bold" style={{ color: ACCENT }}>Significance</th>
              </tr>
            </thead>
            <tbody>
              {LABS.map((lab, i) => (
                <tr key={lab.test} style={{ backgroundColor: i % 2 === 0 ? "var(--background)" : "transparent" }}>
                  <td className="px-3 py-2 font-bold" style={{ color: "var(--foreground)" }}>{lab.test}</td>
                  <td className="px-3 py-2" style={{ color: "var(--muted)" }}>{lab.name}</td>
                  <td className="px-3 py-2" style={{ color: "var(--muted)" }}>{lab.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] mt-3" style={{ color: "var(--muted)" }}>
          <strong>Partnership model:</strong> White-label or referral to at-home lab testing service (Everlywell, LetsGetChecked, or Ro). User orders kit through Conceivable, does sample at home, results feed into Atlas. If lab confirmation aligns with wearable signals → transition to full Perimenopause experience.
        </p>
      </div>

      {/* Patent */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: `${ACCENT}08`, border: `2px solid ${ACCENT}30` }}>
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: ACCENT }} />
          <div>
            <p className="text-sm font-bold" style={{ color: ACCENT }}>Patent 021: Predictive Perimenopause Detection from Continuous Wearable Data</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
              Status: Draft — Priority: Critical — Novel clinical insight, nobody has this
            </p>
            <Link href="/departments/legal/patent-drafts/patent-021" className="text-[10px] font-medium mt-1 inline-block" style={{ color: ACCENT }}>
              View Patent Draft →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
