"use client";

import { useRef, useCallback } from "react";
import {
  Download, Shield, Zap, Eye, Brain, Activity, Smartphone,
  Baby, BarChart3, Heart, Sparkles, TrendingUp, Flower2
} from "lucide-react";
import { EXISTING_PATENTS } from "@/lib/data/patent-coverage-review";
import { PATENT_DRAFTS, type PatentDraftEntry } from "@/lib/data/patent-drafts-data";

/* ──────────────────────────────────────────────
   Color Palette
   ────────────────────────────────────────────── */
const BLUE = "#5A6FFF";
const NAVY = "#356FB6";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";
const PURPLE = "#9686B9";
const OFF_WHITE = "#F9F7F0";

/* ──────────────────────────────────────────────
   Experience config — colors & icons
   ────────────────────────────────────────────── */
const EXPERIENCE_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  Fertility: { color: BLUE, icon: <Heart size={16} style={{ color: BLUE }} /> },
  Platform: { color: NAVY, icon: <Brain size={16} style={{ color: NAVY }} /> },
  Pregnancy: { color: GREEN, icon: <Baby size={16} style={{ color: GREEN }} /> },
  Postpartum: { color: PURPLE, icon: <Sparkles size={16} style={{ color: PURPLE }} /> },
  Periods: { color: "#E24D47", icon: <Activity size={16} style={{ color: "#E24D47" }} /> },
  "First Period": { color: "#F4A7B9", icon: <Flower2 size={16} style={{ color: "#F4A7B9" }} /> },
  Perimenopause: { color: "#D4944A", icon: <TrendingUp size={16} style={{ color: "#D4944A" }} /> },
  "Menopause & Beyond": { color: "#2A8A8A", icon: <Eye size={16} style={{ color: "#2A8A8A" }} /> },
};

const STATUS_COLORS: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#9686B9" },
  in_progress: { label: "In Progress", color: "#F59E0B" },
  review_ready: { label: "Review Ready", color: "#5A6FFF" },
  filed: { label: "Filed", color: "#1EAA55" },
  needs_revision: { label: "Needs Revision", color: "#E24D47" },
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#E24D47",
  high: "#F59E0B",
  medium: "#5A6FFF",
  low: "#78C3BF",
};

/* ──────────────────────────────────────────────
   Build merged patent data from EXISTING_PATENTS + PATENT_DRAFTS
   ────────────────────────────────────────────── */
const draftLookup = new Map<string, PatentDraftEntry>(
  PATENT_DRAFTS.map((d) => [d.id, d])
);

interface MergedPatent {
  number: string;
  name: string;
  id: string;
  experience: string;
  status: string;
  priority: string;
  shortTitle: string;
  fullTitle: string;
}

const ALL_PATENTS: MergedPatent[] = EXISTING_PATENTS.map((p) => {
  const draft = draftLookup.get(p.id);
  return {
    number: p.number,
    name: p.name,
    id: p.id,
    experience: p.experience,
    status: draft?.status ?? "identified",
    priority: draft?.filingPriority ?? "high",
    shortTitle: draft?.shortTitle ?? p.name,
    fullTitle: draft?.title ?? p.name,
  };
});

// Group by experience, maintaining lifecycle order
const EXPERIENCE_ORDER = [
  "Fertility",
  "Platform",
  "Pregnancy",
  "Postpartum",
  "First Period",
  "Periods",
  "Perimenopause",
  "Menopause & Beyond",
];

const patentsByExperience = EXPERIENCE_ORDER
  .map((exp) => ({
    experience: exp,
    patents: ALL_PATENTS.filter((p) => p.experience === exp),
  }))
  .filter((g) => g.patents.length > 0);

const uniqueExperiences = patentsByExperience.length;

/* ──────────────────────────────────────────────
   Section 1 — Hero Header (auto-updating stats)
   ────────────────────────────────────────────── */
function HeroHeader() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BLACK} 0%, ${NAVY} 50%, ${BLUE} 100%)`,
      }}
    >
      <div className="px-8 md:px-12 py-10 md:py-14">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "rgba(249,247,240,0.5)" }}
        >
          Investor Overview
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: OFF_WHITE, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
        >
          Conceivable IP Portfolio
        </h1>
        <p className="text-base md:text-lg mb-10" style={{ color: "rgba(249,247,240,0.7)" }}>
          Comprehensive Patent Protection for AI-Powered Women&apos;s Health Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { value: `${ALL_PATENTS.length} Patents`, label: "Full lifecycle portfolio" },
            { value: `${uniqueExperiences} Experiences`, label: "First Period → Menopause" },
            { value: "$20-35M", label: "Estimated licensing potential" },
            { value: "3 Layers", label: "Core · Real-Time · Predictive" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-6 py-5"
              style={{ backgroundColor: "rgba(249,247,240,0.08)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: OFF_WHITE }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "rgba(249,247,240,0.6)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Portfolio Architecture (auto-generated)
   ────────────────────────────────────────────── */
function PatentCard({ patent }: { patent: MergedPatent }) {
  const expConfig = EXPERIENCE_CONFIG[patent.experience] ?? { color: BLUE, icon: null };
  const statusInfo = STATUS_COLORS[patent.status];
  const priorityColor = PRIORITY_COLORS[patent.priority] ?? BLUE;

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${expConfig.color}14` }}
        >
          {expConfig.icon}
        </div>
        <div className="flex items-center gap-1.5">
          {statusInfo && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${statusInfo.color}14`, color: statusInfo.color }}
            >
              {statusInfo.label}
            </span>
          )}
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase"
            style={{ backgroundColor: `${priorityColor}14`, color: priorityColor }}
          >
            {patent.priority}
          </span>
        </div>
      </div>
      <p
        className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1"
        style={{ color: expConfig.color }}
      >
        Patent {patent.number}
      </p>
      <h4 className="text-sm font-semibold mb-1 leading-snug" style={{ color: "var(--foreground)" }}>
        {patent.shortTitle}
      </h4>
      <p className="text-[10px] leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
        {patent.experience} experience
      </p>
    </div>
  );
}

function PortfolioArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Portfolio Architecture
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {ALL_PATENTS.length} patents spanning {uniqueExperiences} lifecycle experiences — auto-generated from patent registry
        </p>
      </div>

      {patentsByExperience.map((group) => {
        const config = EXPERIENCE_CONFIG[group.experience] ?? { color: BLUE };
        return (
          <div key={group.experience}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: config.color }}>
                {group.experience}
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.color}14`, color: config.color }}>
                {group.patents.length} patent{group.patents.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.patents.map((p) => (
                <PatentCard key={p.id} patent={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Competitive Moat
   ────────────────────────────────────────────── */
function CompetitiveMoat() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Competitive Moat
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Patent portfolio creates multi-directional competitive blocking
        </p>
      </div>

      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${BLACK} 0%, ${NAVY} 100%)`,
        }}
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ backgroundColor: "rgba(90,111,255,0.2)", border: "1px solid rgba(90,111,255,0.3)" }}
          >
            <Shield size={16} style={{ color: BLUE }} />
            <span className="text-sm font-bold" style={{ color: OFF_WHITE }}>
              Conceivable — Protected Core
            </span>
          </div>
          <div className="flex justify-center mt-3 mb-1">
            <div className="w-px h-6" style={{ backgroundColor: "rgba(249,247,240,0.2)" }} />
          </div>
          <p className="text-xs" style={{ color: "rgba(249,247,240,0.4)" }}>
            {ALL_PATENTS.length} patents blocking all competitive vectors across full lifecycle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              name: "Oura Ring",
              color: "#E24D47",
              blocked: "Patents 001, 006, 009, 021",
              desc: "Cannot replicate composite scoring, Halo Ring integration, gestational wellness, or perimenopause detection.",
            },
            {
              name: "Fertility Apps (Flo, Clue, Ava)",
              color: "#F59E0B",
              blocked: "Patents 002, 004, 015, 018",
              desc: "Cannot develop root cause analysis, supplement personalization, period intelligence, or first period prediction.",
            },
            {
              name: "AI Health Platforms (Whoop, Levels)",
              color: BLUE,
              blocked: "Patents 001, 003, 007, 022",
              desc: "Cannot replicate holistic scoring, cycle intelligence, cross-department AI, or HRT monitoring.",
            },
            {
              name: "Women's Health (Maven, Gennev)",
              color: "#D4944A",
              blocked: "Patents 012, 013, 021, 023",
              desc: "Cannot build PPD detection, recovery modeling, perimenopause prediction, or gut-hormone systems.",
            },
          ].map((comp) => (
            <div
              key={comp.name}
              className="rounded-xl p-4"
              style={{ backgroundColor: "rgba(249,247,240,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: comp.color }} />
                <p className="text-xs font-bold" style={{ color: OFF_WHITE }}>{comp.name}</p>
              </div>
              <p className="text-[10px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: comp.color }}>
                {comp.blocked}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(249,247,240,0.6)" }}>
                {comp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 3b — Competitive Patent Blocking Matrix
   ────────────────────────────────────────────── */
const BLOCKING_MATRIX = [
  // FERTILITY HARDWARE
  {
    competitor: "Mira",
    whatTheyDo: "Urine hormone testing (LH, E3G, PdG, FSH). Quantitative levels. Daily Fertility Score. $199 + $60-93/mo strips. 200K+ users.",
    whatTheyNeed: "Add AI intervention, root cause analysis, personalized supplement recommendations, care team coordination",
    blockingPatents: "001, 002, 004, 008, 016, 024",
    strength: "Strong" as const,
  },
  {
    competitor: "Inito",
    whatTheyDo: "Urine hormone testing (LH, FSH, E3G, PdG). iPhone camera reader. $149 + refills.",
    whatTheyNeed: "Same as Mira — add intervention layer, cycle-synced optimization, care team",
    blockingPatents: "001, 002, 004, 008, 016, 024",
    strength: "Strong" as const,
  },
  {
    competitor: "Kegg",
    whatTheyDo: "Cervical mucus electrolyte sensing. $249 one-time. Kegel dual function. 20K+ users.",
    whatTheyNeed: "Add AI interpretation, root cause connection, personalized interventions",
    blockingPatents: "002, 004, 008, 016",
    strength: "Strong" as const,
  },
  {
    competitor: "Natural Cycles",
    whatTheyDo: "FDA-cleared BBT contraception app. $100/yr. Uses BBT for fertile/infertile days. Oura Ring partner.",
    whatTheyNeed: "Expand BBT analysis to root cause health assessment, add intervention, add lifecycle transitions",
    blockingPatents: "002, 003, 009, 016, 021, 027",
    strength: "Strong" as const,
  },
  // PERIOD TRACKERS
  {
    competitor: "Flo",
    whatTheyDo: "420M downloads. Period prediction + content + community. $50/yr premium. Settled $56M data lawsuit.",
    whatTheyNeed: "Add wearable integration, AI care team, root cause analysis, condition detection, outcome improvement",
    blockingPatents: "001, 002, 004, 008, 016, 017",
    strength: "Strong" as const,
  },
  {
    competitor: "Clue",
    whatTheyDo: "Science-focused period tracker. EU privacy. 30+ data points. Research partnerships.",
    whatTheyNeed: "Add intervention layer, care team, wearable-driven optimization, scoring that improves",
    blockingPatents: "001, 002, 004, 008, 016",
    strength: "Strong" as const,
  },
  // TECH GIANTS
  {
    competitor: "Apple",
    whatTheyDo: "Apple Watch temp sensor, cycle tracking in Health app. Billions of users. Massive distribution.",
    whatTheyNeed: "Add care team, root cause analysis, clinical interpretation, intervention, lifecycle transitions",
    blockingPatents: "002, 004, 008, 019, 027",
    strength: "Strong" as const,
  },
  {
    competitor: "Oura",
    whatTheyDo: "Ring with temp, HRV, sleep. Added Perimenopause Check-In (2025). Partnered with Maven Clinic.",
    whatTheyNeed: "Add reproductive health intervention from ring data, cycle-based optimization, care team",
    blockingPatents: "007, 008, 016, 021, 027",
    strength: "Moderate" as const,
  },
  // MENOPAUSE
  {
    competitor: "Gennev",
    whatTheyDo: "Telehealth with human doctors. 25 OB/GYNs. $25-85/visit. Insurance-covered.",
    whatTheyNeed: "Add continuous wearable monitoring, AI care team, predictive detection, automated intervention",
    blockingPatents: "001, 004, 008, 021, 022",
    strength: "Moderate" as const,
  },
  {
    competitor: "Elektra",
    whatTheyDo: "Telehealth with Menopause Society clinicians. $30/mo. Community + education.",
    whatTheyNeed: "Add continuous monitoring + AI intervention, HRT response tracking, gut-hormone analysis",
    blockingPatents: "001, 004, 008, 021, 022",
    strength: "Moderate" as const,
  },
  {
    competitor: "Balance / Caria / Stella",
    whatTheyDo: "Symptom tracking + CBT content + community. $78-99/yr.",
    whatTheyNeed: "Add wearable integration, root cause analysis, personalized intervention, scoring improvement",
    blockingPatents: "001, 002, 004, 008, 016",
    strength: "Strong" as const,
  },
];

const STRENGTH_CONFIG = {
  Strong: { color: "#E24D47", bg: "#E24D4714" },
  Moderate: { color: "#F59E0B", bg: "#F59E0B14" },
  Monitor: { color: "#78C3BF", bg: "#78C3BF14" },
};

function CompetitiveBlockingMatrix() {
  const strongCount = BLOCKING_MATRIX.filter((c) => c.strength === "Strong").length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={20} style={{ color: "#E24D47" }} />
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Competitive Patent Blocking Matrix
          </h2>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {BLOCKING_MATRIX.length} competitors analyzed · {strongCount} strongly blocked · Portfolio is not just defensive — it&apos;s <strong style={{ color: "#E24D47" }}>offensive</strong>
        </p>
      </div>

      {/* Investor callout */}
      <div
        className="rounded-xl p-5"
        style={{
          background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a2e 100%)`,
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: OFF_WHITE }}>
          <strong style={{ color: "#E24D47" }}>Key investor insight:</strong>{" "}
          Our {ALL_PATENTS.length} patent applications don&apos;t just protect us — they prevent every major competitor from building the features that differentiate Conceivable.
          The entire market is blocked from moving from <em>tracking</em> to <em>intervention</em>.
          {" "}{ALL_PATENTS.length} patents across {uniqueExperiences} lifecycle experiences create an IP moat that grows stronger with each filing.
        </p>
      </div>

      {/* Matrix table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ backgroundColor: "var(--surface)" }}>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)", width: "10%" }}>Competitor</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)", width: "22%" }}>What They Do Now</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)", width: "25%" }}>What They&apos;d Need to Compete</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)", width: "28%" }}>Blocked By</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--muted)", width: "15%" }}>Blocking Strength</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKING_MATRIX.map((row, i) => {
                const strengthStyle = STRENGTH_CONFIG[row.strength];
                return (
                  <tr
                    key={row.competitor}
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{row.competitor}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>{row.whatTheyDo}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>{row.whatTheyNeed}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.blockingPatents.split(", ").map((num) => {
                          const patent = ALL_PATENTS.find((p) => p.number === num);
                          return (
                            <span
                              key={num}
                              className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
                              title={patent?.shortTitle ?? ""}
                            >
                              {num}
                              {patent && <span style={{ color: "var(--muted)" }}>({patent.shortTitle})</span>}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-[10px] font-bold px-3 py-1 rounded-full"
                        style={{ backgroundColor: strengthStyle.bg, color: strengthStyle.color }}
                      >
                        {row.strength}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        {(["Strong", "Moderate", "Monitor"] as const).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: STRENGTH_CONFIG[s].bg, color: STRENGTH_CONFIG[s].color }}
            >
              {s}
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              {s === "Strong" ? "Multiple patents block core expansion" : s === "Moderate" ? "Key patents block likely growth path" : "Indirect blocking, watch for workarounds"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Licensing Opportunities
   ────────────────────────────────────────────── */
function LicensingOpportunities() {
  const opportunities = [
    {
      title: "Healthcare Systems",
      description: "License predictive analytics for population health management — perimenopause detection, PPD screening",
      icon: <Activity size={18} style={{ color: BLUE }} />,
    },
    {
      title: "Wearable Companies",
      description: "License AI interpretation layers for raw physiological data across all lifecycle stages",
      icon: <Eye size={18} style={{ color: GREEN }} />,
    },
    {
      title: "Pharma / HRT",
      description: "License HRT response monitoring and supplement optimization for clinical trials",
      icon: <Zap size={18} style={{ color: PURPLE }} />,
    },
    {
      title: "Digital Health Platforms",
      description: "License real-time monitoring, care team coordination, and lifecycle transition engines",
      icon: <Brain size={18} style={{ color: NAVY }} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Licensing Opportunities
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Multiple revenue streams from IP portfolio
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {opportunities.map((opp) => (
          <div
            key={opp.title}
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--background)" }}
            >
              {opp.icon}
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
              {opp.title}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {opp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Market Validation
   ────────────────────────────────────────────── */
function MarketValidation() {
  const stats = [
    { value: "25+ years", label: "Clinical experience" },
    { value: "500K+", label: "BBT charts analyzed" },
    { value: "7,000+", label: "Patient outcome records" },
    { value: "240K+", label: "Data points in current platform" },
    { value: "US 10,467,382", label: "Granted patent (2019)" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a2e 100%)`,
      }}
    >
      <div className="px-8 md:px-12 py-8">
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6"
          style={{ color: "rgba(249,247,240,0.4)" }}
        >
          Market Validation
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-lg md:text-xl font-bold mb-0.5" style={{ color: OFF_WHITE }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "rgba(249,247,240,0.5)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Investment Implications
   ────────────────────────────────────────────── */
function InvestmentImplications() {
  const columns = [
    {
      title: "IP Value Drivers",
      color: BLUE,
      items: [
        "First-mover advantage in AI women\u2019s health across full lifecycle",
        "Dataset moat with high barriers to entry",
        `${ALL_PATENTS.length}-patent full-stack platform protection`,
        "Coverage from First Period through Menopause & Beyond",
      ],
    },
    {
      title: "Revenue Protection",
      color: GREEN,
      items: [
        "Patents protect core subscription functionality across all experiences",
        "B2B licensing creates additional revenue streams (HRT monitoring, PPD detection)",
        "Comprehensive portfolio increases acquisition value",
      ],
    },
    {
      title: "Risk Mitigation",
      color: PURPLE,
      items: [
        `${ALL_PATENTS.length} patents block competitive replication across ${uniqueExperiences} experiences`,
        "Freedom to operate with proprietary innovations",
        "Clinical validation creates regulatory moat beyond IP",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Investment Implications
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <h3 className="text-sm font-bold" style={{ color: col.color }}>
                {col.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div
                    className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — Full Patent Table (auto-generated)
   ────────────────────────────────────────────── */
function PatentTable() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Complete Patent Registry
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {ALL_PATENTS.length} patents · auto-generated from patent data — updates automatically when patents are added
        </p>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: "var(--surface)" }}>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>#</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Patent</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--muted)" }}>Experience</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--muted)" }}>Status</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider hidden md:table-cell" style={{ color: "var(--muted)" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {ALL_PATENTS.map((p, i) => {
              const expConfig = EXPERIENCE_CONFIG[p.experience] ?? { color: BLUE };
              const statusInfo = STATUS_COLORS[p.status] ?? { label: "Identified", color: "#78C3BF" };
              const priorityColor = PRIORITY_COLORS[p.priority] ?? BLUE;
              return (
                <tr
                  key={p.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-bold" style={{ color: expConfig.color }}>{p.number}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{p.shortTitle}</p>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${expConfig.color}14`, color: expConfig.color }}
                    >
                      {p.experience}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${statusInfo.color}14`, color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span
                      className="text-[10px] font-semibold uppercase"
                      style={{ color: priorityColor }}
                    >
                      {p.priority}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   PDF Export (auto-generated content)
   ────────────────────────────────────────────── */
function buildPdfHtml() {
  const patentRows = ALL_PATENTS.map(
    (p) =>
      `<tr><td style="padding:6px 10px;font-size:11px;font-weight:700;color:#5A6FFF">${p.number}</td><td style="padding:6px 10px;font-size:11px;font-weight:600">${p.shortTitle}</td><td style="padding:6px 10px;font-size:11px;color:#666">${p.experience}</td><td style="padding:6px 10px;font-size:11px;color:#666">${STATUS_COLORS[p.status]?.label ?? "Identified"}</td><td style="padding:6px 10px;font-size:11px;text-transform:uppercase;color:${PRIORITY_COLORS[p.priority] ?? BLUE}">${p.priority}</td></tr>`
  ).join("");

  const experienceGroups = patentsByExperience
    .map((g) => {
      const config = EXPERIENCE_CONFIG[g.experience] ?? { color: BLUE };
      const cards = g.patents
        .map(
          (p) =>
            `<div class="card"><div class="num" style="color:${config.color}">Patent ${p.number}</div><h4>${p.shortTitle}</h4></div>`
        )
        .join("");
      return `<div class="tier-label" style="color:${config.color}">${g.experience} (${g.patents.length})</div><div class="card-grid">${cards}</div>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><title>Conceivable IP Portfolio — Executive Summary</title><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2A2828;background:#fff;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
@page{margin:0.5in;size:letter}
.print-container{max-width:100%}.print-container>div{margin-bottom:24px}
.gradient-header{background:linear-gradient(135deg,#2A2828 0%,#356FB6 50%,#5A6FFF 100%)!important;border-radius:12px;padding:40px;margin-bottom:24px}
.gradient-header h1{color:#F9F7F0;font-size:28px;font-weight:700;margin-bottom:4px}
.gradient-header .subtitle{color:rgba(249,247,240,0.7);font-size:14px;margin-bottom:32px}
.gradient-header .investor-label{color:rgba(249,247,240,0.5);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
.stat-row{display:flex;gap:12px}
.stat-card{flex:1;background:rgba(249,247,240,0.08);border-radius:8px;padding:16px 20px}
.stat-card .val{color:#F9F7F0;font-size:22px;font-weight:700}
.stat-card .lbl{color:rgba(249,247,240,0.6);font-size:11px;margin-top:2px}
h2{font-size:18px;font-weight:700;margin-bottom:4px}
.section-sub{color:#888;font-size:12px;margin-bottom:12px}
.tier-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;margin-top:12px}
.card-grid{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}
.card-grid .card{flex:1;min-width:30%;border:1px solid #e5e5e5;border-radius:10px;padding:12px}
.card .num{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px}
.card h4{font-size:11px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:11px}
th{background:#f5f5f5;padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#888}
td{border-top:1px solid #eee}
tr:nth-child(even){background:#fafafa}
.page-break{page-break-before:always}
.dark-section{background:linear-gradient(135deg,#2A2828 0%,#1a1a2e 100%)!important;border-radius:12px;padding:28px 32px}
.dark-section .label{color:rgba(249,247,240,0.4);font-size:9px;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px}
.dark-stats{display:flex;gap:20px}
.dark-stats .item .val{color:#F9F7F0;font-size:16px;font-weight:700}
.dark-stats .item .lbl{color:rgba(249,247,240,0.5);font-size:10px}
</style></head><body><div class="print-container">
<div class="gradient-header">
<div class="investor-label">Investor Overview</div>
<h1>Conceivable IP Portfolio</h1>
<div class="subtitle">Comprehensive Patent Protection for AI-Powered Women's Health Platform</div>
<div class="stat-row">
<div class="stat-card"><div class="val">${ALL_PATENTS.length} Patents</div><div class="lbl">Full lifecycle portfolio</div></div>
<div class="stat-card"><div class="val">${uniqueExperiences} Experiences</div><div class="lbl">First Period → Menopause</div></div>
<div class="stat-card"><div class="val">$20-35M</div><div class="lbl">Estimated licensing potential</div></div>
<div class="stat-card"><div class="val">3 Layers</div><div class="lbl">Core · Real-Time · Predictive</div></div>
</div></div>
<div><h2>Portfolio Architecture</h2><div class="section-sub">${ALL_PATENTS.length} patents spanning ${uniqueExperiences} lifecycle experiences</div>${experienceGroups}</div>
<div class="page-break"></div>
<div><h2>Complete Patent Registry</h2><table><thead><tr><th>#</th><th>Patent</th><th>Experience</th><th>Status</th><th>Priority</th></tr></thead><tbody>${patentRows}</tbody></table></div>
<div class="page-break"></div>
<div><h2>Competitive Patent Blocking Matrix</h2><div class="section-sub">${BLOCKING_MATRIX.length} competitors analyzed — portfolio prevents the entire market from building what we've built</div>
<table><thead><tr><th>Competitor</th><th>What They Do</th><th>What They'd Need</th><th>Blocking Patents</th><th>Strength</th></tr></thead><tbody>${BLOCKING_MATRIX.map((r, i) => `<tr${i % 2 === 1 ? ' style="background:#fafafa"' : ''}><td style="padding:6px 10px;font-size:11px;font-weight:700">${r.competitor}</td><td style="padding:6px 10px;font-size:11px;color:#666">${r.whatTheyDo}</td><td style="padding:6px 10px;font-size:11px">${r.whatTheyNeed}</td><td style="padding:6px 10px;font-size:11px;color:#E24D47;font-weight:600">Patents ${r.blockingPatents}</td><td style="padding:6px 10px;font-size:11px;font-weight:700;color:${r.strength === 'Strong' ? '#E24D47' : '#F59E0B'}">${r.strength}</td></tr>`).join("")}</tbody></table></div>
<div class="dark-section"><div class="label">Market Validation</div><div class="dark-stats"><div class="item"><div class="val">25+ years</div><div class="lbl">Clinical experience</div></div><div class="item"><div class="val">500K+</div><div class="lbl">BBT charts analyzed</div></div><div class="item"><div class="val">7,000+</div><div class="lbl">Patient outcome records</div></div><div class="item"><div class="val">240K+</div><div class="lbl">Data points in current platform</div></div><div class="item"><div class="val">US 10,467,382</div><div class="lbl">Granted patent (2019)</div></div></div></div>
</div></body></html>`;
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
export default function ExecutiveSummaryPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(buildPdfHtml());
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }, []);

  return (
    <div ref={printRef} className="space-y-8 pb-12">
      <HeroHeader />
      <PortfolioArchitecture />
      <PatentTable />
      <CompetitiveMoat />
      <CompetitiveBlockingMatrix />
      <LicensingOpportunities />
      <MarketValidation />
      <InvestmentImplications />

      <div className="flex justify-center pt-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`,
            color: OFF_WHITE,
            boxShadow: "0 2px 8px rgba(90,111,255,0.3)",
          }}
        >
          <Download size={16} />
          Export as PDF
        </button>
      </div>
    </div>
  );
}
