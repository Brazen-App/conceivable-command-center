"use client";

import { FileText, ExternalLink, Calendar, Hash, Layers } from "lucide-react";
import Link from "next/link";

/* ─── Spec Registry ───
   Add new specs here as they're created.
   Each experience with a spec gets an entry.
*/
interface SpecEntry {
  id: string;
  title: string;
  experience: string;
  experienceSlug: string;
  accentColor: string;
  icon: string;
  href: string;
  status: "complete" | "in_progress" | "placeholder";
  wordCount: number;
  lastUpdated: string;
  components: string[];
  sections: string[];
}

const SPECS: SpecEntry[] = [
  {
    id: "pregnancy-wellness",
    title: "Pregnancy Wellness Scoring Specification",
    experience: "Pregnancy",
    experienceSlug: "pregnancy",
    accentColor: "#D4A843",
    icon: "\u{1F31F}",
    href: "/departments/product/experiences/pregnancy/wellness-scoring-spec",
    status: "complete",
    wordCount: 4300,
    lastUpdated: "2026-03-11",
    components: [
      "Pregnancy Wellness Scoring Engine",
      "Pregnancy Messaging Engine",
      "OB Bridge Report Generator",
      "Pregnancy Escalation Protocol Engine",
      "Tier 3 Modifier System",
    ],
    sections: [
      "Scoring Architecture (3-tier factor system)",
      "Tier 1 Factors: Blood Sugar, Nutrition, Stress, Sleep, Body/Activity, Substance",
      "Composite Formula & Score Ranges",
      "Anxiety-Calibrated Messaging Framework",
      "Monitoring Frequency & Escalation Protocols",
      "OB Bridge Report Format",
      "Data Architecture & Schema",
      "FDA Compliance Checklist",
    ],
  },
  {
    id: "postpartum-recovery",
    title: "Postpartum Recovery & Wellness Specification",
    experience: "Postpartum",
    experienceSlug: "postpartum",
    accentColor: "#7CAE7A",
    icon: "\u{1F343}",
    href: "/departments/product/experiences/postpartum/spec",
    status: "in_progress",
    wordCount: 0,
    lastUpdated: "2026-03-11",
    components: [
      "Luna Agent Engine",
      "PPD Detection Algorithm",
      "Postpartum Recovery Scoring Engine",
      "Food Train System",
      "Voice-First Input System",
      "Seren Escalation Protocol Engine",
    ],
    sections: [
      "Recovery Scoring Architecture (4-phase model)",
      "PPD/PPA Detection System (multi-signal passive monitoring)",
      "Recovery Trajectory Engine",
      "Vital Sign Monitoring",
      "Care Team Expansion — Luna Agent",
      "Lactation Intelligence",
      "Escalation Protocols (3-level crisis response)",
      "Data Architecture & Patent Coverage",
    ],
  },
  // ── Future specs will be added here as experiences are designed ──
  // {
  //   id: "fertility-scoring",
  //   title: "Fertility Conceivable Score Specification",
  //   experience: "Fertility",
  //   ...
  // },
  // {
  //   id: "pcos-protocol",
  //   title: "PCOS Detection & Management Specification",
  //   experience: "PCOS",
  //   ...
  // },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  complete: { label: "Complete", color: "#1EAA55" },
  in_progress: { label: "In Progress", color: "#F59E0B" },
  placeholder: { label: "Structural Only", color: "#6B7280" },
};

export default function TechSpecsPage() {
  const completeCount = SPECS.filter((s) => s.status === "complete").length;
  const totalComponents = SPECS.reduce((sum, s) => sum + s.components.length, 0);
  const totalWords = SPECS.reduce((sum, s) => sum + s.wordCount, 0);

  return (
    <div>
      {/* Intro */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "#6B728008", border: "1px solid #6B728015" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Technical Specifications Library
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          All engineering-ready spec documents in one place. No digging through Product pages — every spec that defines what to build and why lives here.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Specs", value: String(SPECS.length), color: "#6B7280" },
          { label: "Complete", value: String(completeCount), color: "#1EAA55" },
          { label: "Components Covered", value: String(totalComponents), color: "#5A6FFF" },
          { label: "Total Words", value: totalWords > 0 ? `${(totalWords / 1000).toFixed(1)}K` : "—", color: "#D4A843" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: `${stat.color}08`, border: `1px solid ${stat.color}15` }}
          >
            <p className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: stat.color }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Spec Cards */}
      <div className="space-y-4">
        {SPECS.map((spec) => {
          const statusConf = STATUS_CONFIG[spec.status];
          return (
            <div
              key={spec.id}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${spec.accentColor}`,
              }}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${spec.accentColor}18` }}
                  >
                    {spec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {spec.title}
                      </h3>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
                        <Layers size={10} />
                        {spec.experience} Experience
                      </span>
                      {spec.wordCount > 0 && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
                          <Hash size={10} />
                          {spec.wordCount.toLocaleString()} words
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
                        <Calendar size={10} />
                        Updated {new Date(spec.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={spec.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium shrink-0 hover:shadow-sm transition-shadow"
                    style={{ backgroundColor: spec.accentColor, color: "white" }}
                  >
                    <FileText size={12} />
                    Open Spec
                  </Link>
                </div>

                {/* Engineering Components This Spec Covers */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: spec.accentColor }}>
                    Engineering Components Covered
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.components.map((comp) => (
                      <Link
                        key={comp}
                        href="/departments/engineering/kanban"
                        className="px-2.5 py-1 rounded-md text-[10px] font-medium hover:shadow-sm transition-shadow"
                        style={{
                          backgroundColor: `${spec.accentColor}10`,
                          color: spec.accentColor,
                          border: `1px solid ${spec.accentColor}25`,
                        }}
                      >
                        {comp}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Spec Sections */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                    Sections
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {spec.sections.map((section, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--foreground)" }}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: spec.accentColor }} />
                        {section}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ backgroundColor: "var(--background)", borderTop: "1px solid var(--border)" }}
              >
                <Link
                  href={`/departments/product/experiences/${spec.experienceSlug}`}
                  className="flex items-center gap-1 text-[10px] font-medium"
                  style={{ color: spec.accentColor }}
                >
                  <ExternalLink size={10} />
                  {spec.experience} Experience Page
                </Link>
                <Link
                  href="/departments/engineering/kanban"
                  className="flex items-center gap-1 text-[10px] font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  <ExternalLink size={10} />
                  View on Kanban
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Specs */}
      <div
        className="rounded-2xl p-5 mt-6"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
          Upcoming Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { name: "Fertility", icon: "\u2728", color: "#5A6FFF", note: "Flagship — Conceivable Score v1 already live" },
            { name: "PCOS", icon: "\u{1F52C}", color: "#9686B9", note: "Detection & management protocol" },
            { name: "Endometriosis", icon: "\u{1F940}", color: "#C9536E", note: "Root cause addressing system" },
            { name: "Perimenopause", icon: "\u{1F525}", color: "#D4944A", note: "Transition monitoring system" },
          ].map((exp) => (
            <div
              key={exp.name}
              className="rounded-xl p-3 border-2 border-dashed"
              style={{ borderColor: `${exp.color}25` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{exp.icon}</span>
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {exp.name}
                </span>
              </div>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                {exp.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
