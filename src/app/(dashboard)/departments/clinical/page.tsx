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
} from "lucide-react";

const ACCENT = "#78C3BF";

const PIPELINE_STUDIES = [
  { id: "pilot-001", title: "Conceivable Pilot Study", participants: 105, dataPoints: 240000, improvement: "150-260%", status: "active" as const, phase: "Data Collection" },
  { id: "bbt-002", title: "BBT Pattern Recognition & Ovulation Prediction", participants: 78, dataPoints: 45000, improvement: "In progress", status: "active" as const, phase: "Analysis" },
  { id: "nutr-003", title: "Nutritional Intervention & Hormone Response", participants: 62, dataPoints: 31000, improvement: "In progress", status: "active" as const, phase: "Enrollment" },
  { id: "stress-004", title: "Stress Biomarkers & Fertility Correlation", participants: 45, dataPoints: 18000, improvement: "Preliminary", status: "planning" as const, phase: "Protocol Design" },
  { id: "ring-005", title: "Halo Ring Continuous Monitoring Validation", participants: 0, dataPoints: 0, improvement: "Pending", status: "planning" as const, phase: "IRB Review" },
  { id: "lp-006", title: "Luteal Phase Quality Enhancement Protocol", participants: 34, dataPoints: 12000, improvement: "23% improvement", status: "active" as const, phase: "Data Collection" },
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

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClinicalDashboardPage() {
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

      {/* Study Pipeline Table */}
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Study</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Phase</th>
                <th className="text-right px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>N</th>
                <th className="text-right px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Data Points</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Improvement</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE_STUDIES.map((study) => (
                <tr
                  key={study.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                    {study.title}
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {study.phase}
                  </td>
                  <td className="px-5 py-3 text-right font-medium" style={{ color: "var(--foreground)" }}>
                    {study.participants || "--"}
                  </td>
                  <td className="px-5 py-3 text-right" style={{ color: "var(--muted)" }}>
                    {study.dataPoints ? `${(study.dataPoints / 1000).toFixed(0)}K` : "--"}
                  </td>
                  <td className="px-5 py-3 font-medium" style={{ color: ACCENT }}>
                    {study.improvement}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={study.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
