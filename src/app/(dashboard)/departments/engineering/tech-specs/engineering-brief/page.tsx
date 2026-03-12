"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, Pin, BookOpen, FileText, ExternalLink, ChevronDown, ChevronRight, Printer } from "lucide-react";
import Link from "next/link";

/* ─── Brand Colors ─── */
const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";
const PINK = "#E37FB1";
const PURPLE = "#9686B9";
const GOLD = "#D4A843";
const SAGE = "#7CAE7A";

/* ─── TOC Sections ─── */
const TOC_SECTIONS = [
  { id: "mission", number: "1", title: "The Mission" },
  { id: "lifecycle", number: "2", title: "The Lifecycle" },
  { id: "care-team", number: "3", title: "The AI Care Team" },
  { id: "core-principle", number: "4", title: "The Core Engineering Principle" },
  { id: "experience-specs", number: "5", title: "Experience Specifications" },
  { id: "foundational-systems", number: "6", title: "Foundational Engineering Systems" },
  { id: "patent-portfolio", number: "7", title: "Patent Portfolio Overview" },
  { id: "tech-stack", number: "8", title: "Tech Stack & Infrastructure" },
  { id: "brand-system", number: "9", title: "Brand System" },
  { id: "clinical-validation", number: "10", title: "Clinical Validation" },
  { id: "why-this-matters", number: "11", title: "Why This Matters" },
];

/* ─── Experience Lifecycle Data ─── */
const LIFECYCLE_TABLE = [
  { num: 1, experience: "First Period", color: PINK, status: "In Design", mission: "Get her at 10. Teach her body is powerful. Period prep = leveling up. 40-year customer." },
  { num: 2, experience: "Early Menstruator", color: "#F4845F", status: "Planned", mission: "Bridge between first period novelty and routine cycle management." },
  { num: 3, experience: "Periods", color: RED, status: "In Design", mission: "THE FRONT DOOR. Fix periods, don't track them. Score improves. Largest addressable market." },
  { num: 4, experience: "PCOS", color: PURPLE, status: "Planned", mission: "Detect in 6 months, not 2+ years. Root cause resolution, not symptom management." },
  { num: 5, experience: "Endometriosis", color: "#C9536E", status: "Planned", mission: "Detect in months, not the current 7\u201310 year average. Direct to right specialist." },
  { num: 6, experience: "Fertility", color: ACCENT, status: "LIVE", mission: "FLAGSHIP. 240K data points. 150\u2013260% conception rate improvement. $15/mo vs $22K IVF." },
  { num: 7, experience: "Pregnancy", color: GOLD, status: "In Design", mission: "Continuous monitoring. GD detection weeks early. Wellness Score. OB Bridge Reports." },
  { num: 8, experience: "Postpartum", color: SAGE, status: "In Design", mission: "6-layer PPD detection. Recovery trajectory scoring. Prevent secondary infertility." },
  { num: 9, experience: "Perimenopause", color: "#D4944A", status: "Planned", mission: "Detect years before menopause. Proactive management vs years of confusion." },
  { num: 10, experience: "Menopause & Beyond", color: "#2A8A8A", status: "Planned", mission: "Continued health optimization. The relationship never ends." },
];

/* ─── Care Team Data ─── */
const CARE_TEAM = [
  { agent: "Kai", role: "Primary Guide", description: "The voice of Conceivable. Translates data into insight. Daily check-ins. Score interpretation. Phase-appropriate guidance. Age-adaptive \u2014 ages with the user from 7 to 70." },
  { agent: "Olive", role: "Nutrition", description: "Cycle-synced, pregnancy-adjusted, postpartum-recovery nutrition. Auto-adjusts based on phase, condition, and goals. Coordinates with Luna on breastfeeding caloric needs." },
  { agent: "Seren", role: "Mental Health", description: "Emotional container. PPD detection (6-layer algorithm). PMDD management. The safe space where women don\u2019t have to perform \u201cI\u2019m fine.\u201d Age-adaptive for young girls." },
  { agent: "Atlas", role: "Data Intelligence", description: "Pattern recognition engine. Root cause analysis across cycles. Condition detection (PCOS, endo, thyroid). Lifetime data querying. The clinical brain." },
  { agent: "Luna", role: "Lactation & Recovery", description: "NEW. Activates pregnancy week 30. Breastfeeding support. Postpartum recovery. Available at 2am. Zero judgment. Permission to stop." },
  { agent: "Zhen", role: "Translation", description: "75-language support across all content and care team interactions. Critical for global deployment." },
  { agent: "Navi", role: "Navigation", description: "Guides users through experiences. Surfaces right content at right time. Finds local resources (clinics, free supplies, support groups)." },
];

/* ─── Tech Stack Data ─── */
const TECH_STACK_TABLE = [
  { layer: "Frontend", technology: "Next.js 14+" },
  { layer: "ORM", technology: "Prisma" },
  { layer: "AI", technology: "Anthropic Claude API" },
  { layer: "Hosting", technology: "Vercel" },
  { layer: "Database", technology: "Vercel Postgres" },
  { layer: "Email", technology: "Mailchimp (28,905 subscribers)" },
  { layer: "Repo", technology: "github.com/Brazen-App/conceivable-command-center" },
  { layer: "Wearable", technology: "Halo Ring \u2014 BBT, HRV, glucose, sleep, activity" },
];

/* ─── Brand Colors Data ─── */
const BRAND_COLORS = [
  { color: "Blue", hex: "#5A6FFF", usage: "Primary brand, CTAs, links, headers" },
  { color: "Off-White", hex: "#F9F7F0", usage: "Backgrounds, cards, containers" },
  { color: "Black", hex: "#2A2828", usage: "Primary text" },
  { color: "Pink", hex: "#E37FB1", usage: "Accent, First Period experience" },
  { color: "Green", hex: "#1EAA55", usage: "Positive indicators, Postpartum experience" },
  { color: "Yellow", hex: "#F1C028", usage: "Warnings, Pregnancy experience" },
  { color: "Purple", hex: "#9686B9", usage: "Secondary accent, PCOS experience" },
];

/* ─── Clinical Validation Data ─── */
const CLINICAL_TABLE = [
  { metric: "Clinical data points", value: "240,000+" },
  { metric: "Pilot study participants", value: "N=105" },
  { metric: "Conception rate improvement", value: "150\u2013260% over baseline" },
  { metric: "Clinician experience", value: "20 years (Kirsten Karchmer)" },
  { metric: "Biomarkers tracked", value: "200+" },
  { metric: "Language support", value: "75 languages" },
  { metric: "Price point", value: "$15/month vs $22,000 average IVF cycle" },
  { metric: "Email subscribers", value: "28,905" },
];

/* ─── Patent Data ─── */
const PATENT_CATEGORIES = [
  {
    category: "Scoring & Analysis",
    color: ACCENT,
    patents: [
      { num: "001", title: "Composite Fertility Health Scoring Methodology" },
      { num: "002", title: "AI-Powered Root Cause Health Assessment" },
      { num: "009", title: "AI-Driven Pattern Attribution System" },
      { num: "013", title: "Postpartum Recovery Trajectory Scoring" },
      { num: "015", title: "Menstrual Cycle Root Cause Analysis & Automated Intervention" },
    ],
  },
  {
    category: "Monitoring & Detection",
    color: GREEN,
    patents: [
      { num: "003", title: "Cycle-Based AI Recalibration System" },
      { num: "005", title: "Multi-Parameter Pregnancy Risk Assessment" },
      { num: "007", title: "Objective Physiological Data Validation" },
      { num: "010", title: "Temporal Response Calibration System" },
      { num: "012", title: "Multimodal Passive PPD Detection (6-layer algorithm)" },
      { num: "017", title: "Multi-Cycle Reproductive Condition Pattern Recognition" },
    ],
  },
  {
    category: "Care Delivery",
    color: PINK,
    patents: [
      { num: "004", title: "Real-Time Monitoring & Automated Care Team Coordination" },
      { num: "008", title: "Closed-Loop Physiologic Correction System" },
      { num: "011", title: "Continuous AI-Powered Pregnancy Monitoring" },
      { num: "016", title: "Cycle-Phase-Adaptive Health Optimization" },
      { num: "019", title: "Age-Adaptive AI Health Companion System" },
    ],
  },
  {
    category: "Platform & Data",
    color: PURPLE,
    patents: [
      { num: "006", title: "Population-Based Pattern Learning System" },
      { num: "014", title: "Longitudinal Reproductive Recovery Monitoring" },
      { num: "018", title: "Predictive First Menarche Analytics" },
      { num: "020", title: "Lifetime Reproductive Health Data System (MOST DEFENSIBLE)" },
    ],
  },
];

/* ─── PPD Layers Data ─── */
const PPD_LAYERS = [
  { layer: 1, name: "Physiological", description: "HRV recovery failure, sleep architecture, temperature, activity collapse", weight: 25, color: RED },
  { layer: 2, name: "Behavioral", description: "App engagement decline, check-in response patterns, feeding log changes", weight: 15, color: YELLOW },
  { layer: 3, name: "Conversational", description: "Seren interaction sentiment trajectory, content markers, \u201cI\u2019m fine\u201d detection", weight: 20, color: ACCENT },
  { layer: 4, name: "Contextual", description: "Prior depression, birth trauma, NICU, breastfeeding difficulty", weight: 10, color: PURPLE },
  { layer: 5, name: "Visual Sentiment", description: "Face scan affect analysis during existing BP scans", weight: 15, color: PINK },
  { layer: 6, name: "Vocal Biomarkers", description: "Speech rate, pitch range, pause patterns during voice interactions", weight: 15, color: SAGE },
];

/* ─── Helper Components ─── */
function PatentBadge({ num, color }: { num: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
      }}
    >
      Patent {num}
    </span>
  );
}

function SectionHeader({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: 20,
        fontWeight: 700,
        color: "var(--foreground)",
        marginBottom: 16,
        marginTop: 48,
        paddingBottom: 12,
        borderBottom: `2px solid ${ACCENT}`,
        scrollMarginTop: 80,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: ACCENT,
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

function SubsectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 16,
        fontWeight: 700,
        color: "var(--foreground)",
        marginTop: 28,
        marginBottom: 12,
      }}
    >
      {children}
    </h3>
  );
}

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      style={{
        borderLeft: `4px solid ${ACCENT}`,
        backgroundColor: "var(--background)",
        padding: "16px 20px",
        margin: "16px 0",
        borderRadius: "0 8px 8px 0",
        fontSize: 14,
        lineHeight: 1.7,
        color: "var(--foreground)",
        fontStyle: "italic",
      }}
    >
      {children}
    </blockquote>
  );
}

function BodyText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontSize: 14,
        lineHeight: 1.75,
        color: "var(--foreground)",
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        backgroundColor: `${ACCENT}12`,
        color: ACCENT,
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: 500,
      }}
    >
      {children}
    </code>
  );
}

function StyledTable({
  headers,
  rows,
  accentColor = ACCENT,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  accentColor?: string;
}) {
  return (
    <div style={{ overflowX: "auto", margin: "16px 0", borderRadius: 12, border: "1px solid var(--border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  backgroundColor: accentColor,
                  color: "#ffffff",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                backgroundColor: ri % 2 === 0 ? "#ffffff" : "var(--background)",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "10px 14px",
                    borderTop: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ColorDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 6,
        verticalAlign: "middle",
        border: "1px solid rgba(0,0,0,0.1)",
        flexShrink: 0,
      }}
    />
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 9999,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        backgroundColor: `${color}18`,
        color: color,
      }}
    >
      {status}
    </span>
  );
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul style={{ margin: "8px 0 16px 0", paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--foreground)",
            marginBottom: 4,
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ─── Main Page Component ─── */
export default function EngineeringBriefPage() {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("mission");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    TOC_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* ─── Pinned Banner ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 10,
          backgroundColor: `${ACCENT}10`,
          border: `1px solid ${ACCENT}25`,
          marginBottom: 16,
          fontSize: 12,
          fontWeight: 600,
          color: ACCENT,
        }}
      >
        <Pin size={14} />
        PINNED — Master Reference Document for Engineering Team
      </div>

      {/* ─── Header ─── */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <Link
            href="/departments/engineering/tech-specs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: ACCENT,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            Back to Tech Specs
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                color: "var(--muted)",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <Printer size={12} />
              Print / Export
            </button>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                backgroundColor: `${RED}14`,
                color: RED,
                border: `1px solid ${RED}30`,
              }}
            >
              <Shield size={12} />
              CONFIDENTIAL
            </span>
          </div>
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--foreground)",
            lineHeight: 1.3,
            marginBottom: 8,
          }}
        >
          Engineering Brief — Platform Architecture, Mission & Technical Specification
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.5,
          }}
        >
          Prepared for: Lakshmi & Engineering Team &nbsp;|&nbsp; March 2026 &nbsp;|&nbsp; Version 1.0
        </p>
      </div>

      {/* ─── Layout: Sidebar TOC + Content ─── */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* ─── Desktop Sidebar TOC ─── */}
        <nav
          className="hidden lg:block"
          style={{
            position: "sticky",
            top: 80,
            width: 260,
            flexShrink: 0,
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 16,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BookOpen size={14} style={{ color: ACCENT }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: ACCENT }}>
              Table of Contents
            </span>
          </div>
          {TOC_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: activeSection === s.id ? 600 : 400,
                color: activeSection === s.id ? ACCENT : "var(--muted)",
                backgroundColor: activeSection === s.id ? `${ACCENT}10` : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: activeSection === s.id ? ACCENT : "var(--background)",
                  color: activeSection === s.id ? "#fff" : "var(--muted)",
                  flexShrink: 0,
                }}
              >
                {s.number}
              </span>
              {s.title}
            </a>
          ))}
        </nav>

        {/* ─── Mobile TOC (Collapsible) ─── */}
        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 50,
          }}
        >
          <button
            onClick={() => setTocOpen(!tocOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 12,
              backgroundColor: ACCENT,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(90,111,255,0.35)",
            }}
          >
            <BookOpen size={14} />
            {tocOpen ? "Close" : "Contents"}
            {tocOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {tocOpen && (
            <div
              style={{
                position: "absolute",
                bottom: 48,
                right: 0,
                width: 260,
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 12,
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {TOC_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setTocOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 400,
                    color: "var(--foreground)",
                    textDecoration: "none",
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      backgroundColor: ACCENT,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {s.number}
                  </span>
                  {s.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ══════════════════════════════════════════════════════════
             SECTION 1: THE MISSION
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="mission" number="1" title="THE MISSION" />

          <Blockquote>
            THE ONE-SENTENCE VERSION: If you teach a 10-year-old how her body works and how to take care of it, by the time she&apos;s 28 she won&apos;t need a fertility clinic.
          </Blockquote>

          <BodyText>
            Conceivable is not a fertility app. It is not a period tracker. It is not a pregnancy monitor. It is a lifetime women&apos;s health platform that makes all of those things work better — and eventually makes fertility intervention unnecessary for an entire generation of women.
          </BodyText>

          <BodyText>
            We are building a system where a girl enters at age 10, learns how her body works, builds healthy habits that produce healthy cycles, and carries that knowledge and data through every stage of her reproductive life. By the time she wants to conceive, her body is already optimized. By the time she&apos;s pregnant, her baseline data goes back 15 years. By the time she&apos;s postpartum, the system knows exactly what &ldquo;recovered&rdquo; looks like for HER because it has her pre-pregnancy baseline.
          </BodyText>

          <BodyText>
            No healthcare system in the world has longitudinal reproductive data spanning a woman&apos;s entire life. We will.
          </BodyText>

          <BodyText>
            What we are building is the infrastructure for the single most comprehensive women&apos;s health dataset that has ever existed, delivered through an AI care team that actually improves health outcomes — not just tracks them.
          </BodyText>

          <BodyText>
            Every other app in this space is a mirror — it shows you what&apos;s happening. Conceivable is a mechanic — it fixes what&apos;s wrong.
          </BodyText>

          {/* ══════════════════════════════════════════════════════════
             SECTION 2: THE LIFECYCLE
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="lifecycle" number="2" title="THE LIFECYCLE" />

          <BodyText>
            The platform is organized into 10 experiences spanning a woman&apos;s entire reproductive life. Each experience is a distinct product with its own features, scoring system, and care team configuration — but they share a unified data architecture and care team framework. Data flows forward. Nothing is lost. Everything connects.
          </BodyText>

          <StyledTable
            headers={["#", "Experience", "Color", "Status", "Mission"]}
            rows={LIFECYCLE_TABLE.map((r) => [
              <span key={r.num} style={{ fontWeight: 700 }}>{r.num}</span>,
              <span key={`exp-${r.num}`} style={{ fontWeight: 600 }}>{r.experience}</span>,
              <span key={`color-${r.num}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ColorDot color={r.color} />
                <span style={{ fontSize: 11, fontFamily: "monospace" }}>{r.color}</span>
              </span>,
              <StatusBadge
                key={`status-${r.num}`}
                status={r.status}
                color={r.status === "LIVE" ? GREEN : r.status === "In Design" ? ACCENT : "var(--muted)"}
              />,
              r.mission,
            ])}
          />

          <BodyText style={{ marginTop: 20 }}>
            <strong>The lifecycle flow:</strong> First Period → Periods → (PCOS / Endometriosis / Fertility) → Pregnancy → Postpartum → (back to Periods or Fertility) → Perimenopause → Menopause. One woman. An entire lifetime. Every data point connected.
          </BodyText>

          {/* ══════════════════════════════════════════════════════════
             SECTION 3: THE AI CARE TEAM
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="care-team" number="3" title="THE AI CARE TEAM" />

          <BodyText>
            The care team is a coordinated system of AI agents, each with a distinct personality and clinical function. They share data, coordinate interventions, and collectively deliver care that would require a team of 5–10 human specialists.
          </BodyText>

          <StyledTable
            headers={["Agent", "Role", "What They Do"]}
            rows={CARE_TEAM.map((a) => [
              <span key={a.agent} style={{ fontWeight: 700, color: ACCENT }}>{a.agent}</span>,
              <span key={`role-${a.agent}`} style={{ fontWeight: 600 }}>{a.role}</span>,
              a.description,
            ])}
          />

          <Blockquote>
            <strong>AGE-ADAPTIVE CARE TEAM — NOVEL INNOVATION:</strong> The care team dynamically adjusts vocabulary, humor, cultural references, and informational depth based on user age. A 10-year-old talks to 10-year-old Kai. A 30-year-old talks to adult Kai. Same personality, different communication style. This requires an Age-Adaptive Agent Framework as a foundational engineering component. <PatentBadge num="019" color={PINK} /> covers this.
          </Blockquote>

          {/* ══════════════════════════════════════════════════════════
             SECTION 4: THE CORE ENGINEERING PRINCIPLE
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="core-principle" number="4" title="THE CORE ENGINEERING PRINCIPLE" />

          <Blockquote>
            <strong>THE SCORE DOESN&apos;T JUST TRACK — IT IMPROVES.</strong> This is the single most important engineering requirement across the entire platform. Every experience has a health score. That score must demonstrably improve over time as the care team&apos;s interventions take effect. If the score doesn&apos;t improve, the system isn&apos;t working. The improvement curve IS the product. Build every scoring engine with this in mind: the output is not a number. The output is a trajectory.
          </Blockquote>

          <BodyText>
            Every scoring engine across every experience follows the same architecture:
          </BodyText>

          <BulletList
            items={[
              <span key="t1"><strong>Tier 1 — Modifiable factors (highest weight):</strong> Things the user can change. Sleep, nutrition, stress, activity, blood sugar. These drive the score because the system can actually help improve them.</span>,
              <span key="t2"><strong>Tier 2 — Clinically modifiable factors (medium weight):</strong> Things that require clinical partnership. Blood health, blood pressure, prenatal care. The system monitors and flags.</span>,
              <span key="t3"><strong>Tier 3 — Fixed modifiers (zero visible weight):</strong> Things that can&apos;t change (age, history). These adjust internal monitoring sensitivity but NEVER reduce the user&apos;s visible score. A 40-year-old with great habits should see a great score.</span>,
              <span key="bb"><strong>Baseline buffer:</strong> A fixed component ensuring no user ever sees a hopeless score from uncontrollable factors.</span>,
            ]}
          />

          <div
            style={{
              backgroundColor: `${ACCENT}08`,
              border: `1px solid ${ACCENT}20`,
              borderRadius: 12,
              padding: 20,
              margin: "20px 0",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Composite Formula</p>
            <p style={{ fontSize: 16, fontFamily: "monospace", fontWeight: 600, color: "var(--foreground)" }}>
              (Tier1 &times; 0.60) + (Tier2 &times; 0.15) + (Baseline &times; 0.25)
            </p>
          </div>

          <BodyText style={{ fontWeight: 600 }}>Score Ranges:</BodyText>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[
              { range: "85–100", label: "Thriving", color: GREEN },
              { range: "70–84", label: "Strong", color: "#7CAE7A" },
              { range: "55–69", label: "Building", color: "#D4944A" },
              { range: "40–54", label: "Needs Focus", color: "#E8853D" },
              { range: "<40", label: "Priority", color: "#E07070" },
            ].map((s) => (
              <div
                key={s.range}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 8,
                  backgroundColor: `${s.color}14`,
                  border: `1px solid ${s.color}30`,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: s.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.range}</span>
                <span style={{ fontSize: 11, color: "var(--foreground)" }}>{s.label}</span>
              </div>
            ))}
          </div>

          <BodyText>
            NEVER hopeless. Always &ldquo;here&apos;s what we can do.&rdquo;
          </BodyText>

          {/* ══════════════════════════════════════════════════════════
             SECTION 5: EXPERIENCE SPECIFICATIONS
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="experience-specs" number="5" title="EXPERIENCE SPECIFICATIONS" />

          <BodyText>
            Complete technical specifications exist for each experience. This section provides the engineering summary. Full specs are available in the command center at <InlineCode>/product/experiences/[name]/spec</InlineCode>.
          </BodyText>

          {/* ── 5.1 First Period ── */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `4px solid ${PINK}`,
              borderRadius: "0 14px 14px 0",
              padding: 24,
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <SubsectionHeader>5.1 First Period</SubsectionHeader>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status="In Design" color={ACCENT} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>12 features | 3 tiers</span>
                <ColorDot color={PINK} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Soft Pink</span>
              </div>
            </div>

            <BodyText>
              <strong>Mission:</strong> Transform menarche from something girls fear into something they prepare for and own. If men had periods, having a period would be the coolest thing on the planet. That&apos;s what we&apos;re building. Get her at 10, keep her for 40 years.
            </BodyText>

            <p style={{ fontSize: 12, fontWeight: 700, color: PINK, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 8 }}>
              Key Engineering Components
            </p>

            <BulletList
              items={[
                <span key="fppe"><strong>First Period Prediction Engine:</strong> Multi-factor predictive model for menarche timing. Inputs: age, family history, developmental markers (breast development, body hair, cervical discharge, growth). Output: prediction window that narrows as more data is logged. Previous version generated 1,000 emails/week.</span>,
                <span key="aaf"><strong>Age-Adaptive Agent Framework:</strong> FOUNDATIONAL. Enables all care team agents to adjust communication by age tier (7–9, 10–12, 13–15, 16+). Required for First Period AND all experiences with younger users.</span>,
                <span key="ppv"><strong>Period Prep Visualization:</strong> Visual progress system (garden/journey metaphor, NOT a numerical score) reflecting body-care habits. Must be engaging for daily return visits from 10–12 year olds.</span>,
                <span key="csm"><strong>Child Safety & Moderation:</strong> MANDATORY before any community features. Detection of abuse, self-harm, eating disorders. COPPA + COPPA 2.0 compliant. Must be the safest digital space for young girls on the internet.</span>,
                <span key="gncs"><strong>Graphic Novel Content System:</strong> CMS for illustrated educational stories. Multi-language (75), episode scheduling, character management, age-tier content gating.</span>,
              ]}
            />
          </div>

          {/* ── 5.2 Periods ── */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `4px solid ${RED}`,
              borderRadius: "0 14px 14px 0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <SubsectionHeader>5.2 Periods</SubsectionHeader>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status="In Design" color={ACCENT} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>12 features | 3 tiers</span>
                <ColorDot color={RED} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Red</span>
              </div>
            </div>

            <BodyText>
              <strong>Mission:</strong> THE FRONT DOOR. Every period tracker on earth is a calendar pretending to be a health tool. They tell women WHEN their period is coming. We tell them WHY it hurts, WHY it&apos;s irregular, WHY their mood crashes on day 22 — and then we fix it. Period pain and PMS are not inevitable. They are symptoms of identifiable, correctable imbalances. The score doesn&apos;t just track — it IMPROVES.
            </BodyText>

            <p style={{ fontSize: 12, fontWeight: 700, color: RED, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 8 }}>
              Key Engineering Components
            </p>

            <BulletList
              items={[
                <span key="phse"><strong>Period Health Scoring Engine:</strong> 5 categories (Cycle Regularity, Hormonal Balance, Pain & Inflammation, Nutritional Foundation, Stress & Recovery). Must track improvement over cycles. Recalculates weekly. Cycle-over-cycle comparison is the core value.</span>,
                <span key="circe"><strong>Cycle Intelligence / Root Cause Engine:</strong> Pattern recognition across 3+ cycles. Maps symptoms to systemic causes: short luteal phase → blood sugar instability, worsening cramps → inflammatory diet, mood crashes → progesterone drops from poor sleep. Deploys care team interventions automatically.</span>,
                <span key="csne"><strong>Cycle-Synced Nutrition Engine:</strong> Olive auto-adjusts nutrition by cycle phase from BBT data. Four profiles: Follicular (iron, estrogen-support), Ovulatory (anti-inflammatory), Luteal (progesterone-support, magnesium), Menstrual (iron, warming).</span>,
                <span key="csep"><strong>Cycle-Synced Exercise Planner:</strong> Auto-adjusts exercise recommendations by phase. Prevents luteal overtraining that worsens PMS.</span>,
                <span key="cde"><strong>Condition Detection Engine:</strong> Multi-cycle pattern matching for PCOS (6-month target vs 2+ year average), endometriosis (months vs 7–10 year average), thyroid dysfunction, PMDD. Each condition has a clinical signature profile.</span>,
                <span key="drg"><strong>Doctor&apos;s Report Generator:</strong> Auto-generates comprehensive clinical summary. PDF export. Changes the clinical conversation entirely.</span>,
              ]}
            />
          </div>

          {/* ── 5.3 Pregnancy ── */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `4px solid ${GOLD}`,
              borderRadius: "0 14px 14px 0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <SubsectionHeader>5.3 Pregnancy</SubsectionHeader>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status="In Design" color={ACCENT} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>11 features | 3 tiers</span>
                <ColorDot color={GOLD} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Warm Gold</span>
              </div>
            </div>

            <BodyText>
              <strong>Mission:</strong> Continuous monitoring that catches gestational diabetes weeks before the standard 24–28 week test, detects preeclampsia signals early, monitors viability in the anxious first trimester, and generates OB Bridge Reports so she walks into appointments with more data than her doctor has ever seen.
            </BodyText>

            <p style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 8 }}>
              Key Engineering Components
            </p>

            <BulletList
              items={[
                <span key="pwse"><strong>Pregnancy Wellness Scoring Engine:</strong> Full spec document: 4,300 words. Same tiered architecture adapted for pregnancy. Blood sugar (25% of Tier 1), nutrition, stress, sleep, body/activity, substance. Trimester-specific threshold adjustments. <Link href="/departments/product/experiences/pregnancy/wellness-scoring-spec" style={{ color: ACCENT, textDecoration: "none", fontWeight: 600 }}><ExternalLink size={10} style={{ display: "inline", verticalAlign: "middle" }} /> View full spec</Link></span>,
                <span key="pme"><strong>Pregnancy Messaging Engine:</strong> Generates Kai&apos;s per-factor messages. Four tiers per factor (green/light green/amber/red). Anxiety-calibrated — never alarming, always actionable.</span>,
                <span key="obrg"><strong>OB Bridge Report Generator:</strong> Clinical-language summaries for OB appointments. Glucose trends, HRV, sleep, flags, discussion topics. PDF export.</span>,
                <span key="pep"><strong>Pregnancy Escalation Protocol:</strong> 3 levels + safety triggers. Routes to care team (L1), recommends OB discussion (L2), recommends urgent contact (L3).</span>,
                <span key="pp"><strong>Postpartum Preparation:</strong> Weeks 28–36 preparation timeline built INTO the pregnancy experience. Food train setup, therapist identification, freezer meals, partner preparation, colostrum education by week 34.</span>,
              ]}
            />
          </div>

          {/* ── 5.4 Postpartum ── */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `4px solid ${SAGE}`,
              borderRadius: "0 14px 14px 0",
              padding: 24,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <SubsectionHeader>5.4 Postpartum</SubsectionHeader>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status="In Design" color={ACCENT} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>13 features | 4 tiers</span>
                <ColorDot color={SAGE} />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Sage Green</span>
              </div>
            </div>

            <BodyText>
              <strong>Mission:</strong> The medical system abandons women after delivery. Between birth and the 6-week checkup there is essentially zero monitoring. Inadequate postpartum recovery is likely a significant unrecognized contributor to secondary infertility. This experience ensures her body fully recovers, detects PPD before it becomes a crisis, supports breastfeeding, and preserves her future fertility.
            </BodyText>

            <p style={{ fontSize: 12, fontWeight: 700, color: SAGE, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 8 }}>
              Key Engineering Components
            </p>

            <BulletList
              items={[
                <span key="prse"><strong>Postpartum Recovery Scoring Engine:</strong> Measures recovery TRAJECTORY, not absolute wellness. A score of 65 at 3 weeks with upward trend is great. Same score at 12 weeks with flat trend is concerning.</span>,
              ]}
            />

            {/* PPD Detection Algorithm — Special Visual */}
            <div
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid ${SAGE}30`,
                borderRadius: 12,
                padding: 20,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: SAGE, marginBottom: 16 }}>
                PPD Detection Algorithm — SIX Independent Signal Layers
              </p>

              {PPD_LAYERS.map((layer) => (
                <div
                  key={layer.layer}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: `${layer.color}08`,
                    border: `1px solid ${layer.color}18`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: layer.color,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    L{layer.layer}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{layer.name}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: layer.color,
                          backgroundColor: `${layer.color}18`,
                          padding: "1px 8px",
                          borderRadius: 9999,
                        }}
                      >
                        {layer.weight}%
                      </span>
                    </div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--muted)", margin: 0 }}>{layer.description}</p>
                  </div>
                  {/* Weight bar */}
                  <div style={{ width: 60, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        height: 6,
                        width: `${layer.weight * 2}px`,
                        backgroundColor: layer.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <BulletList
              items={[
                <span key="lae"><strong>Luna Agent Engine:</strong> New care team member. Activates pregnancy week 30. Voice-first interaction (one hand holding baby). Coordinates with Olive on breastfeeding caloric needs.</span>,
                <span key="vfis"><strong>Voice-First Input System:</strong> Primary input method for postpartum. Speech-to-text for conversations + parallel audio analysis for PPD vocal biomarkers. Highest-value single interaction in the experience.</span>,
                <span key="fts"><strong>Food Train System:</strong> Full meal coordination platform. Profile, invite links, smart scheduling, friend reminders, automated thank yous, money pool.</span>,
              ]}
            />
          </div>

          {/* ══════════════════════════════════════════════════════════
             SECTION 6: FOUNDATIONAL ENGINEERING SYSTEMS
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="foundational-systems" number="6" title="FOUNDATIONAL ENGINEERING SYSTEMS" />

          <BodyText>
            These systems are shared across all experiences and must be built as platform infrastructure, not per-experience features.
          </BodyText>

          {/* 6.1 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.1 Lifetime Data Archival System</SubsectionHeader>

            <BodyText>
              Every data point collected from a user at ANY age, in ANY experience, must be archived and accessible to the care team at any point in her journey. When a 28-year-old is in the Fertility experience, Kai should reference data from when she was 12.
            </BodyText>

            <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Requirements:</p>
            <BulletList
              items={[
                "Unified user data schema across all experiences",
                "Lifetime data retention with user consent and deletion rights",
                "Care team query access to historical data",
                "Data migration during experience transitions",
                "Additional protections for data collected as a minor",
              ]}
            />

            <BodyText>
              This is one of Conceivable&apos;s most defensible competitive advantages.
            </BodyText>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: `${RED}14`,
                color: RED,
              }}
            >
              Priority: CRITICAL
            </span>
          </div>

          {/* 6.2 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.2 Experience Transition Framework</SubsectionHeader>

            <BodyText>
              Women don&apos;t stay in one experience forever. The system must smoothly transition her between experiences: First Period → Periods when cycles establish, Periods → PCOS when patterns detected, Periods → Fertility when she&apos;s ready to conceive, Fertility → Pregnancy when she conceives, Pregnancy → Postpartum at delivery, Postpartum → Periods or Fertility when recovery complete. All data carries forward. The care team adjusts. She should feel like the app evolved with her, not like she opened a different app.
            </BodyText>
          </div>

          {/* 6.3 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.3 Scoring Engine Architecture</SubsectionHeader>

            <BodyText>
              All scoring engines share the same tiered architecture (Tier 1/2/3 + baseline buffer). Build this as a reusable scoring framework that each experience configures with its own factors, weights, and thresholds. Do not build 10 separate scoring engines. Build one engine with 10 configurations.
            </BodyText>
          </div>

          {/* 6.4 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.4 Care Team Agent Framework</SubsectionHeader>

            <BodyText>
              Shared agent infrastructure: conversation management, memory per user, cross-agent coordination (Luna tells Olive about breastfeeding; Atlas flags patterns for Kai), voice input/output, age-adaptive communication, 75-language support via Zhen. Each experience configures which agents are active and how they behave.
            </BodyText>
          </div>

          {/* 6.5 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.5 Halo Ring Integration</SubsectionHeader>

            <BodyText>
              The wearable data pipeline is the foundation of continuous monitoring. BBT, HRV, glucose, sleep, activity — all flow from the Halo Ring into every scoring engine. This integration blocks the launch of every experience.
            </BodyText>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: `${RED}14`,
                color: RED,
              }}
            >
              Priority: CRITICAL
            </span>
          </div>

          {/* 6.6 */}
          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <SubsectionHeader>6.6 Patent Auto-Review System</SubsectionHeader>

            <BodyText>
              Every new feature across every experience is automatically flagged for patent review in the Legal section. The patent attorney agent evaluates novelty and non-obviousness, and routes potentially patentable features to Kirsten for review. Current patent portfolio: 20 drafts. This system ensures nothing slips through.
            </BodyText>
          </div>

          {/* ══════════════════════════════════════════════════════════
             SECTION 7: PATENT PORTFOLIO OVERVIEW
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="patent-portfolio" number="7" title="PATENT PORTFOLIO OVERVIEW" />

          <BodyText>
            20 patents drafted. This is the IP moat that makes Conceivable defensible.
          </BodyText>

          {PATENT_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${cat.color}`,
                borderRadius: "0 14px 14px 0",
                padding: 20,
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: cat.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                {cat.category}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.patents.map((p) => (
                  <div key={p.num} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <PatentBadge num={p.num} color={cat.color} />
                    <span style={{ fontSize: 13, color: "var(--foreground)" }}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════════════════════════
             SECTION 8: TECH STACK & INFRASTRUCTURE
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="tech-stack" number="8" title="TECH STACK & INFRASTRUCTURE" />

          <StyledTable
            headers={["Layer", "Technology"]}
            rows={TECH_STACK_TABLE.map((r) => [
              <span key={r.layer} style={{ fontWeight: 600 }}>{r.layer}</span>,
              r.technology === "github.com/Brazen-App/conceivable-command-center" ? (
                <span key={`tech-${r.layer}`}>
                  <a href="https://github.com/Brazen-App/conceivable-command-center" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>
                    {r.technology} <ExternalLink size={10} style={{ display: "inline", verticalAlign: "middle" }} />
                  </a>
                </span>
              ) : (
                <span key={`tech-${r.layer}`}>{r.technology}</span>
              ),
            ])}
          />

          {/* ══════════════════════════════════════════════════════════
             SECTION 9: BRAND SYSTEM
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="brand-system" number="9" title="BRAND SYSTEM" />

          <StyledTable
            headers={["Color", "Hex", "Usage"]}
            rows={BRAND_COLORS.map((r) => [
              <span key={r.color} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: r.hex,
                    border: "1px solid rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 600 }}>{r.color}</span>
              </span>,
              <span key={`hex-${r.color}`} style={{ fontFamily: "monospace", fontSize: 12 }}>{r.hex}</span>,
              r.usage,
            ])}
          />

          {/* ══════════════════════════════════════════════════════════
             SECTION 10: CLINICAL VALIDATION
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="clinical-validation" number="10" title="CLINICAL VALIDATION" />

          <StyledTable
            headers={["Metric", "Value"]}
            accentColor={GREEN}
            rows={CLINICAL_TABLE.map((r) => [
              <span key={r.metric} style={{ fontWeight: 600 }}>{r.metric}</span>,
              <span key={`val-${r.metric}`} style={{ fontWeight: 700, color: GREEN }}>{r.value}</span>,
            ])}
          />

          {/* ══════════════════════════════════════════════════════════
             SECTION 11: WHY THIS MATTERS
             ══════════════════════════════════════════════════════════ */}
          <SectionHeader id="why-this-matters" number="11" title="WHY THIS MATTERS" />

          <BodyText style={{ fontWeight: 600, fontSize: 15 }}>
            This is not another health app. Let me be direct about what we&apos;re building:
          </BodyText>

          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 28,
              margin: "20px 0",
              lineHeight: 1.85,
            }}
          >
            <BodyText>
              A 10-year-old girl in rural India takes a First Period Predictor quiz in Hindi. She learns from an age-matched Kai that her body is doing something powerful. She builds healthy habits. Her first period is easier because she prepared. She tracks her cycles through her teens. By 22, the system detects early PCOS signs and she gets treatment 2 years before she otherwise would have. At 28, she wants to conceive — her body is already optimized because she&apos;s been building that foundation since she was 10. Her pregnancy is monitored continuously. Her postpartum depression is caught at week 3 instead of month 6. Her second pregnancy is easier because her body fully recovered from the first. At 45, perimenopause is detected early and managed proactively.
            </BodyText>

            <BodyText style={{ fontWeight: 700, fontSize: 15, color: ACCENT }}>
              That woman&apos;s entire reproductive life was better because of what we built. Multiply her by a billion women in 75 languages and you understand what this company is.
            </BodyText>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              marginTop: 20,
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: ACCENT,
                letterSpacing: "0.02em",
              }}
            >
              Build accordingly.
            </p>
          </div>

          {/* ─── Footer ─── */}
          <div
            style={{
              borderTop: "2px solid var(--border)",
              marginTop: 40,
              paddingTop: 20,
              paddingBottom: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
              Full technical specifications available in the Conceivable Command Center at{" "}
              <Link href="/departments/product/experiences" style={{ color: ACCENT, textDecoration: "none" }}>
                <InlineCode>/product/experiences/[experience-name]/spec</InlineCode>
              </Link>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={12} style={{ color: "var(--muted)" }} />
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Engineering Brief v1.0 — March 2026</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: RED,
                  padding: "2px 6px",
                  borderRadius: 4,
                  backgroundColor: `${RED}10`,
                }}
              >
                Confidential
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
