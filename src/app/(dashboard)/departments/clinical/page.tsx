"use client";

import { useState } from "react";
import {
  FlaskConical,
  Activity,
  BookOpen,
  TrendingUp,
  FileText,
  Beaker,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
  Target,
} from "lucide-react";

const ACCENT = "#78C3BF";

const PIPELINE_STUDIES = [
  { id: "pilot-001", title: "Conceivable Pilot Study", participants: 105, dataPoints: 240000, improvement: "150-260%", status: "active" as const, phase: "Data Collection", publicationTarget: "Fertility & Sterility", description: "Core pilot demonstrating multi-biomarker fertility optimization. 105 participants showing 150-260% improvement in key fertility markers." },
  { id: "bbt-002", title: "BBT Pattern Recognition & Ovulation Prediction", participants: 78, dataPoints: 45000, improvement: "In progress", status: "active" as const, phase: "Analysis", publicationTarget: "JAMA Network Open", description: "AI-powered basal body temperature pattern recognition to predict ovulation with higher accuracy than existing methods." },
  { id: "nutr-003", title: "Nutritional Intervention & Hormone Response", participants: 62, dataPoints: 31000, improvement: "In progress", status: "active" as const, phase: "Enrollment", publicationTarget: "American Journal of Clinical Nutrition", description: "Studying the impact of personalized nutritional interventions on hormonal balance and fertility outcomes." },
  { id: "stress-004", title: "Stress Biomarkers & Fertility Correlation", participants: 45, dataPoints: 18000, improvement: "Preliminary", status: "planning" as const, phase: "Protocol Design", publicationTarget: "Psychoneuroendocrinology", description: "Investigating the relationship between stress biomarkers (cortisol, HRV) and fertility outcomes." },
  { id: "ring-005", title: "Halo Ring Continuous Monitoring Validation", participants: 0, dataPoints: 0, improvement: "Pending", status: "planning" as const, phase: "IRB Review", publicationTarget: "Nature Digital Medicine", description: "Validation study for the Halo Ring wearable in continuous fertility biomarker monitoring." },
  { id: "lp-006", title: "Luteal Phase Quality Enhancement Protocol", participants: 34, dataPoints: 12000, improvement: "23% improvement", status: "active" as const, phase: "Data Collection", publicationTarget: "Human Reproduction", description: "Protocol for enhancing luteal phase quality through targeted interventions based on continuous monitoring data." },
];

const RESEARCH_AREAS = [
  { name: "Hormonal Patterns", studies: 3, evidenceLevel: "strong" as const },
  { name: "Nutritional Interventions", studies: 2, evidenceLevel: "moderate" as const },
  { name: "Temperature Biomarkers", studies: 2, evidenceLevel: "strong" as const },
  { name: "Lifestyle Factors", studies: 2, evidenceLevel: "moderate" as const },
  { name: "Environmental Exposures", studies: 1, evidenceLevel: "emerging" as const },
  { name: "Stress & HRV", studies: 1, evidenceLevel: "emerging" as const },
  { name: "Sleep Quality", studies: 1, evidenceLevel: "moderate" as const },
  { name: "Genetic Markers", studies: 1, evidenceLevel: "emerging" as const },
];

const PUBLICATIONS = [
  { title: "Pilot Study: Multi-Biomarker Fertility Optimization", journal: "Fertility & Sterility", status: "drafting" as const },
  { title: "BBT Pattern AI: Ovulation Prediction Accuracy", journal: "JAMA Network Open", status: "drafting" as const },
  { title: "Closed-Loop Physiologic Correction in Fertility", journal: "Nature Digital Medicine", status: "planning" as const },
];

function EvidenceBadge({ level }: { level: "strong" | "moderate" | "emerging" }) {
  const config = {
    strong: { bg: "#1EAA5518", color: "#1EAA55", label: "Strong" },
    moderate: { bg: "#F1C02818", color: "#F1C028", label: "Moderate" },
    emerging: { bg: "#78C3BF18", color: "#78C3BF", label: "Emerging" },
  };
  const c = config[level];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: "active" | "planning" | "drafting" | "submitted" | "published" }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: "#1EAA5518", color: "#1EAA55", label: "Active" },
    planning: { bg: "#F1C02818", color: "#F1C028", label: "Planning" },
    drafting: { bg: "#356FB618", color: "#356FB6", label: "Drafting" },
    submitted: { bg: "#9686B918", color: "#9686B9", label: "Submitted" },
    published: { bg: "#1EAA5518", color: "#1EAA55", label: "Published" },
  };
  const c = config[status];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

export default function ClinicalDashboardPage() {
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const activeStudies = PIPELINE_STUDIES.filter((s) => s.status === "active").length;
  const totalParticipants = PIPELINE_STUDIES.reduce((sum, s) => sum + s.participants, 0);
  const totalDataPoints = PIPELINE_STUDIES.reduce((sum, s) => sum + s.dataPoints, 0);

  return (
    <div className="space-y-6">
      {/* Hero: Research Pipeline */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: ACCENT }}
        >
          Research Pipeline
        </p>
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-5xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {PIPELINE_STUDIES.length}
          </span>
          <span className="text-lg" style={{ color: "var(--muted)" }}>
            studies in progress
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            The Gain: From 0 studies to {PIPELINE_STUDIES.length} active research programs in 8 months
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pilot Study */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Beaker size={16} style={{ color: ACCENT }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Pilot Study
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            N=105
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            240K data points collected
          </p>
          <div
            className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold text-center"
            style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
          >
            150-260% improvement
          </div>
        </div>

        {/* Active Research Areas */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} style={{ color: "#356FB6" }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Research Areas
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {RESEARCH_AREAS.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            active research domains
          </p>
          <div className="flex gap-1 mt-3 flex-wrap">
            {RESEARCH_AREAS.filter((_, i) => i < 3).map((area) => (
              <EvidenceBadge key={area.name} level={area.evidenceLevel} />
            ))}
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              +{RESEARCH_AREAS.length - 3} more
            </span>
          </div>
        </div>

        {/* Evidence Strength */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Evidence Strength
            </span>
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--foreground)" }}>Strong</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "37.5%", backgroundColor: "#1EAA55" }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {RESEARCH_AREAS.filter((a) => a.evidenceLevel === "strong").length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--foreground)" }}>Moderate</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "37.5%", backgroundColor: "#F1C028" }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {RESEARCH_AREAS.filter((a) => a.evidenceLevel === "moderate").length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--foreground)" }}>Emerging</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: "37.5%", backgroundColor: "#78C3BF" }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {RESEARCH_AREAS.filter((a) => a.evidenceLevel === "emerging").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Publication Pipeline */}
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} style={{ color: "#9686B9" }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Publications
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {PUBLICATIONS.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            manuscripts in pipeline
          </p>
          <div className="flex gap-1 mt-3 flex-wrap">
            {PUBLICATIONS.map((pub) => (
              <StatusBadge key={pub.title} status={pub.status} />
            ))}
          </div>
        </div>
      </div>

      {/* Study Pipeline — Clickable / Expandable */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Active Research Pipeline
          </h2>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {activeStudies} active / {PIPELINE_STUDIES.length} total
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {PIPELINE_STUDIES.map((study) => {
            const isExpanded = expandedStudy === study.id;
            return (
              <div key={study.id}>
                <div
                  className="px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setExpandedStudy(isExpanded ? null : study.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                          {study.title}
                        </p>
                        <StatusBadge status={study.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{study.phase}</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>N={study.participants || "--"}</span>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>
                          {study.dataPoints ? `${(study.dataPoints / 1000).toFixed(0)}K pts` : "--"}
                        </span>
                        <span className="text-xs font-medium" style={{ color: ACCENT }}>
                          {study.improvement}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#9686B914", color: "#9686B9" }}>
                        {study.publicationTarget}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-4" style={{ backgroundColor: "var(--background)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                          Description
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {study.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                          Publication Target
                        </p>
                        <p className="text-xs" style={{ color: "var(--foreground)" }}>
                          {study.publicationTarget}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs" style={{ color: "var(--muted)" }}>
                            Participants: {study.participants || "Pending"}
                          </span>
                          <span className="text-xs" style={{ color: "var(--muted)" }}>
                            Data: {study.dataPoints ? `${(study.dataPoints / 1000).toFixed(0)}K points` : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white"
                        style={{ backgroundColor: "#5A6FFF" }}
                      >
                        <Sparkles size={13} />
                        Joy: Start Drafting
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}
                      >
                        <MessageSquare size={13} />
                        Joy: Analyze Data
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <Target size={13} />
                        Set Publication Target
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Publication Targets */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Publication Pipeline
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {PUBLICATIONS.map((pub) => (
            <div key={pub.title} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{pub.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{pub.journal}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={pub.status} />
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#5A6FFF" }}
                >
                  <Sparkles size={11} />
                  Draft
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sullivan Principle: Multiplier */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "#9686B910",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Multiplier Opportunity: Closed-Loop Patent + Publication Bundle
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Publishing pilot results before fundraise creates a validated evidence base that strengthens
              both the patent portfolio (Legal) and investor narrative (Fundraising). One action, three
              department multiplier. File Closed-Loop patent, submit pilot paper, update pitch deck simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
