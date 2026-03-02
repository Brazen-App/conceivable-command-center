"use client";

import { useState } from "react";
import { GitBranch, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";

const ACCENT = "#78C3BF";

interface Correlation {
  id: string;
  factorA: string;
  factorB: string;
  strength: number;
  direction: "positive" | "negative" | "complex";
  clinicalSignificance: "high" | "moderate" | "low";
  pilotEvidence: string;
  mechanism: string;
}

const TOP_CORRELATIONS: Correlation[] = [
  {
    id: "c01",
    factorA: "Progesterone Levels",
    factorB: "Luteal Phase Length",
    strength: 0.89,
    direction: "positive",
    clinicalSignificance: "high",
    pilotEvidence: "N=105: 92% of participants with adequate progesterone had luteal phase >11 days",
    mechanism: "Progesterone sustains endometrial lining; insufficient levels lead to premature shedding",
  },
  {
    id: "c02",
    factorA: "BBT Pattern Quality",
    factorB: "Ovulation Confirmation",
    strength: 0.87,
    direction: "positive",
    clinicalSignificance: "high",
    pilotEvidence: "AI pattern analysis achieved 96% ovulation detection accuracy across pilot cohort",
    mechanism: "Post-ovulation progesterone raises basal temperature 0.3-0.5F; pattern consistency indicates hormonal health",
  },
  {
    id: "c03",
    factorA: "Fasting Insulin",
    factorB: "Ovulation Regularity",
    strength: 0.82,
    direction: "negative",
    clinicalSignificance: "high",
    pilotEvidence: "Participants with fasting insulin >10 had 3.2x higher anovulation rate",
    mechanism: "Insulin resistance disrupts LH:FSH ratio and increases androgen production",
  },
  {
    id: "c04",
    factorA: "Vitamin D Levels",
    factorB: "AMH Preservation",
    strength: 0.76,
    direction: "positive",
    clinicalSignificance: "moderate",
    pilotEvidence: "Participants with Vitamin D >40ng/mL showed 23% slower AMH decline over 6 months",
    mechanism: "Vitamin D receptors in granulosa cells modulate follicular development and survival",
  },
  {
    id: "c05",
    factorA: "Sleep Quality (HRV)",
    factorB: "Cortisol Levels",
    strength: 0.74,
    direction: "negative",
    clinicalSignificance: "moderate",
    pilotEvidence: "Deep sleep <90min correlated with morning cortisol >18ug/dL in 78% of cases",
    mechanism: "Poor sleep disrupts HPA axis recovery; elevated cortisol suppresses GnRH pulsatility",
  },
  {
    id: "c06",
    factorA: "Omega-3 Index",
    factorB: "Inflammatory Markers",
    strength: 0.71,
    direction: "negative",
    clinicalSignificance: "moderate",
    pilotEvidence: "Omega-3 index >8% associated with 34% lower CRP and improved endometrial receptivity markers",
    mechanism: "EPA/DHA reduce prostaglandin-mediated inflammation affecting implantation",
  },
  {
    id: "c07",
    factorA: "TSH Levels",
    factorB: "Time to Conception",
    strength: 0.69,
    direction: "positive",
    clinicalSignificance: "high",
    pilotEvidence: "TSH >2.5 associated with 2x longer time to conception in pilot data",
    mechanism: "Subclinical hypothyroidism impairs follicular development and endometrial receptivity",
  },
  {
    id: "c08",
    factorA: "Exercise (Zone 2)",
    factorB: "Cycle Regularity",
    strength: 0.67,
    direction: "positive",
    clinicalSignificance: "moderate",
    pilotEvidence: "150min/week Zone 2 training correlated with 28% improvement in cycle regularity",
    mechanism: "Moderate aerobic exercise improves insulin sensitivity and reduces oxidative stress",
  },
  {
    id: "c09",
    factorA: "Stress Score",
    factorB: "LH Surge Amplitude",
    strength: 0.64,
    direction: "negative",
    clinicalSignificance: "moderate",
    pilotEvidence: "High stress scores (>7/10) associated with 41% weaker LH surges",
    mechanism: "Cortisol directly suppresses GnRH pulsatility, blunting the LH surge signal",
  },
  {
    id: "c10",
    factorA: "Folate Status",
    factorB: "Egg Quality Markers",
    strength: 0.62,
    direction: "positive",
    clinicalSignificance: "moderate",
    pilotEvidence: "Adequate methylfolate associated with improved embryo morphology in IVF subset",
    mechanism: "Folate essential for DNA synthesis and methylation during oocyte maturation",
  },
];

interface CausalChain {
  id: string;
  name: string;
  steps: { factor: string; arrow: string }[];
  evidence: "proven" | "strong" | "hypothesized";
  clinicalImpact: string;
}

const CAUSAL_CHAINS: CausalChain[] = [
  {
    id: "cc01",
    name: "Insulin Resistance Cascade",
    steps: [
      { factor: "Blood Sugar", arrow: "elevates" },
      { factor: "Insulin", arrow: "disrupts" },
      { factor: "LH:FSH Ratio", arrow: "causes" },
      { factor: "Anovulation", arrow: "affects" },
      { factor: "BBT Pattern Disruption", arrow: "" },
    ],
    evidence: "proven",
    clinicalImpact: "Affects ~30% of infertility cases. Intervention at glucose level creates cascade improvement.",
  },
  {
    id: "cc02",
    name: "Sleep-Stress-Hormone Axis",
    steps: [
      { factor: "Poor Sleep", arrow: "elevates" },
      { factor: "Cortisol", arrow: "suppresses" },
      { factor: "GnRH Pulsatility", arrow: "weakens" },
      { factor: "LH Surge", arrow: "delays" },
      { factor: "Ovulation", arrow: "" },
    ],
    evidence: "strong",
    clinicalImpact: "Sleep intervention alone improved cycle regularity by 28% in pilot participants.",
  },
  {
    id: "cc03",
    name: "Thyroid-Ovulatory Connection",
    steps: [
      { factor: "TSH Elevation", arrow: "impairs" },
      { factor: "Follicular Development", arrow: "reduces" },
      { factor: "Estradiol Rise", arrow: "weakens" },
      { factor: "LH Trigger", arrow: "delays" },
      { factor: "Conception Window", arrow: "" },
    ],
    evidence: "proven",
    clinicalImpact: "Thyroid optimization doubled conception rates within 3 months in subclinical cases.",
  },
  {
    id: "cc04",
    name: "Inflammatory-Implantation Pathway",
    steps: [
      { factor: "Low Omega-3", arrow: "increases" },
      { factor: "Prostaglandins", arrow: "drives" },
      { factor: "Endometrial Inflammation", arrow: "reduces" },
      { factor: "Implantation Receptivity", arrow: "lowers" },
      { factor: "Conception Rate", arrow: "" },
    ],
    evidence: "strong",
    clinicalImpact: "Omega-3 supplementation for 8 weeks improved endometrial thickness by 18%.",
  },
  {
    id: "cc05",
    name: "Vitamin D-Reserve Preservation",
    steps: [
      { factor: "Vitamin D Deficiency", arrow: "impairs" },
      { factor: "Granulosa Cell Function", arrow: "accelerates" },
      { factor: "Follicular Atresia", arrow: "reduces" },
      { factor: "AMH Levels", arrow: "diminishes" },
      { factor: "Ovarian Reserve", arrow: "" },
    ],
    evidence: "hypothesized",
    clinicalImpact: "Preliminary data suggests Vitamin D >40ng/mL slows AMH decline by 23%.",
  },
];

function StrengthBar({ value }: { value: number }) {
  const pct = value * 100;
  const color = pct >= 80 ? "#1EAA55" : pct >= 60 ? "#F1C028" : "#E24D47";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono font-medium" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
}

function SignificanceBadge({ level }: { level: "high" | "moderate" | "low" }) {
  const config = {
    high: { bg: "#1EAA5518", color: "#1EAA55" },
    moderate: { bg: "#F1C02818", color: "#F1C028" },
    low: { bg: "#E24D4718", color: "#E24D47" },
  };
  const c = config[level];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {level}
    </span>
  );
}

function EvidenceBadge({ level }: { level: "proven" | "strong" | "hypothesized" }) {
  const config = {
    proven: { bg: "#1EAA5518", color: "#1EAA55" },
    strong: { bg: "#356FB618", color: "#356FB6" },
    hypothesized: { bg: "#9686B918", color: "#9686B9" },
  };
  const c = config[level];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {level}
    </span>
  );
}

export default function CorrelationsPage() {
  const [expandedCorrelation, setExpandedCorrelation] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Correlation Analysis
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          Top 10 Strongest Correlations
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Discovered from pilot data (N=105, 240K data points). Ranked by correlation strength.
        </p>
      </div>

      {/* Correlations Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Factor Correlations
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Factor A</th>
                <th className="text-center px-2 py-2 text-xs" style={{ color: "var(--muted)" }}></th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Factor B</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Strength</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Direction</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Significance</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CORRELATIONS.map((corr) => (
                <>
                  <tr
                    key={corr.id}
                    className="border-t cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setExpandedCorrelation(expandedCorrelation === corr.id ? null : corr.id)}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{corr.factorA}</td>
                    <td className="px-2 py-3 text-center">
                      <ArrowRight size={14} style={{ color: "var(--muted)" }} />
                    </td>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{corr.factorB}</td>
                    <td className="px-5 py-3"><StrengthBar value={corr.strength} /></td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: corr.direction === "positive" ? "#1EAA5518" : corr.direction === "negative" ? "#E24D4718" : "#F1C02818",
                          color: corr.direction === "positive" ? "#1EAA55" : corr.direction === "negative" ? "#E24D47" : "#F1C028",
                        }}
                      >
                        {corr.direction}
                      </span>
                    </td>
                    <td className="px-5 py-3"><SignificanceBadge level={corr.clinicalSignificance} /></td>
                  </tr>
                  {expandedCorrelation === corr.id && (
                    <tr key={`${corr.id}-detail`} style={{ backgroundColor: "var(--background)" }}>
                      <td colSpan={6} className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Pilot Evidence</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{corr.pilotEvidence}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Mechanism</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{corr.mechanism}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Causal Chain Mapping */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--foreground)" }}>
          Causal Chain Mapping
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {CAUSAL_CHAINS.map((chain) => (
            <div
              key={chain.id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {chain.name}
                </h3>
                <EvidenceBadge level={chain.evidence} />
              </div>
              {/* Chain visualization */}
              <div className="flex flex-wrap items-center gap-1 mb-3">
                {chain.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                      {step.factor}
                    </span>
                    {step.arrow && (
                      <span className="text-xs italic" style={{ color: "var(--muted)" }}>
                        {step.arrow}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                {chain.clinicalImpact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
