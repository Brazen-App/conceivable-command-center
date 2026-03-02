"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Beaker, Layers } from "lucide-react";

const ACCENT = "#ACB7FF";

type VerticalStatus = "active" | "planned" | "research" | "future";

interface VerticalData {
  name: string;
  readinessScore: number;
  status: VerticalStatus;
  keyFeaturesCount: number;
  clinicalEvidenceStrength: "strong" | "moderate" | "emerging" | "none";
  description: string;
  keyInsight: string;
  color: string;
}

const VERTICALS: VerticalData[] = [
  {
    name: "Pre-Period",
    readinessScore: 0,
    status: "future",
    keyFeaturesCount: 0,
    clinicalEvidenceStrength: "none",
    description: "Young women preparing for their first period. Education, body literacy, and early cycle awareness.",
    keyInsight: "Massive underserved market -- no good apps exist for this age group.",
    color: "#ACB7FF",
  },
  {
    name: "Period Problems",
    readinessScore: 15,
    status: "planned",
    keyFeaturesCount: 2,
    clinicalEvidenceStrength: "moderate",
    description: "Heavy periods, painful cramps, irregular cycles. Root-cause approach vs. symptom management.",
    keyInsight: "68% of women with period problems are told 'it's normal' -- our data says otherwise.",
    color: "#E37FB1",
  },
  {
    name: "PCOS",
    readinessScore: 20,
    status: "planned",
    keyFeaturesCount: 3,
    clinicalEvidenceStrength: "strong",
    description: "Polycystic ovary syndrome -- metabolic, hormonal, and inflammatory root causes. Lifestyle-first interventions.",
    keyInsight: "PCOS affects 1 in 10 women. Personalized metabolic + hormonal tracking = massive differentiator.",
    color: "#9686B9",
  },
  {
    name: "Endometriosis",
    readinessScore: 5,
    status: "future",
    keyFeaturesCount: 2,
    clinicalEvidenceStrength: "emerging",
    description: "Endometriosis detection, management, and fertility impact. Pain tracking, inflammation markers.",
    keyInsight: "Average 7-year diagnosis delay. AI-powered symptom pattern recognition could cut this dramatically.",
    color: "#E24D47",
  },
  {
    name: "Infertility",
    readinessScore: 72,
    status: "active",
    keyFeaturesCount: 12,
    clinicalEvidenceStrength: "strong",
    description: "Active fertility journey -- the core Conceivable product. 50-factor model, Halo Ring, AI coaching.",
    keyInsight: "Our 50-factor model and Halo Ring integration create a moat no competitor can match.",
    color: "#5A6FFF",
  },
  {
    name: "Pregnancy",
    readinessScore: 10,
    status: "research",
    keyFeaturesCount: 3,
    clinicalEvidenceStrength: "moderate",
    description: "Pregnancy monitoring and support. Continuation of preconception data for better outcomes.",
    keyInsight: "Preconception data continuity into pregnancy = unique value prop. No one else has this.",
    color: "#1EAA55",
  },
  {
    name: "Postpartum",
    readinessScore: 0,
    status: "future",
    keyFeaturesCount: 2,
    clinicalEvidenceStrength: "emerging",
    description: "Postpartum recovery tracking. Hormonal recovery, sleep, mood, and return to baseline.",
    keyInsight: "Postpartum care gap is enormous. Our wearable data can detect recovery trajectory.",
    color: "#78C3BF",
  },
  {
    name: "Perimenopause",
    readinessScore: 10,
    status: "planned",
    keyFeaturesCount: 4,
    clinicalEvidenceStrength: "moderate",
    description: "Early hormonal transition. Symptom tracking, HRT readiness, metabolic shift management.",
    keyInsight: "Perimenopause starts earlier than most think. Same bio-tracking applies, different algorithms.",
    color: "#F1C028",
  },
  {
    name: "Menopause",
    readinessScore: 0,
    status: "future",
    keyFeaturesCount: 2,
    clinicalEvidenceStrength: "emerging",
    description: "Full menopause management. Hot flash tracking, bone density, cardiovascular risk, cognitive health.",
    keyInsight: "$600B menopause market by 2025. Wearable + AI coaching = perfect product-market fit.",
    color: "#356FB6",
  },
  {
    name: "Post-Menopause",
    readinessScore: 0,
    status: "future",
    keyFeaturesCount: 1,
    clinicalEvidenceStrength: "none",
    description: "Long-term health optimization post-menopause. Longevity, bone health, heart health, cognitive vitality.",
    keyInsight: "Women live 30+ years post-menopause. Lifetime health data creates unprecedented longitudinal insights.",
    color: "#D4649A",
  },
];

const STATUS_CONFIG: Record<VerticalStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "#1EAA55" },
  planned: { label: "Planned", color: "#5A6FFF" },
  research: { label: "Research", color: "#F1C028" },
  future: { label: "Future", color: "var(--muted)" },
};

const EVIDENCE_CONFIG: Record<string, { label: string; color: string }> = {
  strong: { label: "Strong", color: "#1EAA55" },
  moderate: { label: "Moderate", color: "#F1C028" },
  emerging: { label: "Emerging", color: "#9686B9" },
  none: { label: "None yet", color: "var(--muted)" },
};

export default function VerticalsPage() {
  const [expandedName, setExpandedName] = useState<string | null>(null);

  return (
    <div>
      {/* Intro */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Layers size={16} style={{ color: ACCENT }} />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            10 Health Verticals
          </p>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Women&apos;s health lifecycle from Pre-Period through Post-Menopause. Click any vertical card for expanded details.
        </p>
      </div>

      {/* Verticals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VERTICALS.map((v) => {
          const statusConf = STATUS_CONFIG[v.status];
          const evidenceConf = EVIDENCE_CONFIG[v.clinicalEvidenceStrength];
          const isExpanded = expandedName === v.name;

          return (
            <button
              key={v.name}
              onClick={() => setExpandedName(isExpanded ? null : v.name)}
              className={`text-left rounded-2xl border p-5 transition-all hover:shadow-sm ${isExpanded ? "sm:col-span-2 lg:col-span-3" : ""}`}
              style={{
                borderColor: isExpanded ? v.color : "var(--border)",
                backgroundColor: isExpanded ? `${v.color}06` : "var(--surface)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v.color }} />
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {v.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                    >
                      {statusConf.label}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {v.keyFeaturesCount} features
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold" style={{ color: v.readinessScore > 0 ? v.color : "var(--muted)" }}>
                    {v.readinessScore}
                  </p>
                  <p className="text-[9px]" style={{ color: "var(--muted)" }}>readiness</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: `${v.color}15` }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${v.readinessScore}%`, backgroundColor: v.readinessScore > 0 ? v.color : "transparent" }}
                />
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                        Description
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {v.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)" }}>
                        Key Insight
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {v.keyInsight}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Beaker size={12} style={{ color: evidenceConf.color }} />
                      <span className="text-[10px] font-medium" style={{ color: evidenceConf.color }}>
                        Clinical Evidence: {evidenceConf.label}
                      </span>
                    </div>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {v.keyFeaturesCount} features mapped
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                    >
                      {statusConf.label}
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
