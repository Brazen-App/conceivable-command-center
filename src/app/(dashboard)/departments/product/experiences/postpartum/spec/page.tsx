"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Shield, AlertTriangle, ExternalLink } from "lucide-react";

const ACCENT = "#7CAE7A";

/* ─── Reusable Section Components ─── */
function SpecSection({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className="rounded-2xl p-6"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h2
        className="text-sm font-bold uppercase tracking-wider mb-4"
        style={{ color: ACCENT }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function SpecNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}25` }}
    >
      <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
      <div className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
        {children}
      </div>
    </div>
  );
}

export default function PostpartumSpecPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/departments/product/experiences/postpartum"
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${ACCENT}18` }}
        >
          <FileText size={20} style={{ color: ACCENT }} />
        </div>
        <div className="flex-1">
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            Postpartum Recovery & Wellness Specification
          </h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Technical specification for the Postpartum experience — recovery scoring, PPD detection, care team expansion
          </p>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
        >
          In Design
        </span>
      </div>

      {/* Document Status Banner */}
      <div
        className="rounded-xl p-4 flex items-center gap-4"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}
      >
        <FileText size={20} style={{ color: ACCENT }} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Specification Document — Awaiting Full Content
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            The structural framework is in place. The complete postpartum specification document will be added when finalized. Architecture mirrors the Pregnancy Wellness Scoring Spec format.
          </p>
        </div>
        <Link
          href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
          className="flex items-center gap-1.5 text-xs font-medium shrink-0"
          style={{ color: "#D4A843" }}
        >
          <ExternalLink size={12} />
          Pregnancy Spec (Reference)
        </Link>
      </div>

      {/* Table of Contents */}
      <SpecSection title="Table of Contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { num: "1", title: "Executive Summary" },
            { num: "2", title: "Recovery Scoring Architecture" },
            { num: "3", title: "PPD/PPA Detection System" },
            { num: "4", title: "Recovery Trajectory Engine" },
            { num: "5", title: "Vital Sign Monitoring" },
            { num: "6", title: "Care Team Expansion — Luna" },
            { num: "7", title: "Lactation Intelligence" },
            { num: "8", title: "Escalation Protocols" },
            { num: "9", title: "Phase Timeline & Dependencies" },
            { num: "10", title: "Data Architecture" },
            { num: "11", title: "Patent Coverage" },
            { num: "12", title: "FDA & Compliance" },
          ].map((item) => (
            <a
              key={item.num}
              href={`#section-${item.num}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:shadow-sm transition-shadow"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <span className="font-bold" style={{ color: ACCENT }}>
                {item.num}.
              </span>
              <span style={{ color: "var(--foreground)" }}>{item.title}</span>
            </a>
          ))}
        </div>
      </SpecSection>

      {/* Section 1: Executive Summary */}
      <SpecSection title="1. Executive Summary" id="section-1">
        <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
          <p>
            The Postpartum experience extends Conceivable&apos;s continuous AI-powered monitoring from pregnancy through the fourth trimester and beyond. It addresses the critical gap in postpartum care: a woman goes from daily monitoring during pregnancy to a single 6-week checkup with zero structured support in between.
          </p>
          <p>
            The system introduces Luna, a new Lactation & Postpartum Recovery Specialist agent, expanding the care team to 7 agents. It features a personalized Recovery Score adapted from the Conceivable Score, multi-signal PPD/PPA detection that catches depression before it becomes severe, personalized recovery trajectories based on delivery type and pregnancy data, and continuous vital sign monitoring for complications that happen at home.
          </p>
          <p>
            For women who came through the Pregnancy experience, the transition is seamless — all pregnancy data informs postpartum recovery expectations. For new users entering at postpartum, the system rapidly establishes baselines and begins monitoring immediately.
          </p>
          <SpecNote>
            Full specification content will be added when the postpartum spec document is finalized. The sections below show the planned structure and key architectural decisions made so far.
          </SpecNote>
        </div>
      </SpecSection>

      {/* Section 2: Recovery Scoring */}
      <SpecSection title="2. Recovery Scoring Architecture" id="section-2">
        <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
          <p>
            The Postpartum Recovery Score adapts the Conceivable Score architecture to track recovery rather than optimization. The score answers: &ldquo;How is your body healing and rebuilding?&rdquo; rather than &ldquo;How optimized is your body for pregnancy?&rdquo;
          </p>
          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
              Recovery Phase Scoring Shifts
            </h4>
            <div className="space-y-2">
              {[
                { phase: "Weeks 0-2 (Acute)", focus: "Safety metrics: bleeding, vitals, pain, infection risk" },
                { phase: "Weeks 2-6 (Early Recovery)", focus: "Healing trajectory: physical recovery, sleep, hormone adjustment" },
                { phase: "Weeks 6-12 (Restoration)", focus: "Rebuilding: energy, pelvic floor, fitness return, mood stability" },
                { phase: "Months 3-12+ (Optimization)", focus: "Baseline return: hormonal normalization, cycle recovery, future fertility" },
              ].map((p) => (
                <div key={p.phase} className="flex gap-3">
                  <span className="font-bold shrink-0 w-40" style={{ color: ACCENT }}>{p.phase}</span>
                  <span style={{ color: "var(--muted)" }}>{p.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SpecSection>

      {/* Section 3: PPD Detection */}
      <SpecSection title="3. PPD/PPA Detection System" id="section-3">
        <div className="space-y-3 text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
          <p>
            Multi-signal passive monitoring that distinguishes between &ldquo;normal hard&rdquo; (sleep-deprived but coping) and &ldquo;concerning pattern&rdquo; (physiological markers of clinical depression/anxiety).
          </p>
          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
              Detection Signals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "HRV changes (sustained, not single-day)",
                "Sleep disruption (involuntary vs newborn-related)",
                "App engagement decline (gradual withdrawal)",
                "Voice tone analysis (check-in responses)",
                "Self-reported mood (EPDS integration)",
                "Heart rate recovery changes",
                "Activity pattern shifts",
                "Social engagement withdrawal",
              ].map((signal) => (
                <div key={signal} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span style={{ color: "var(--muted)" }}>{signal}</span>
                </div>
              ))}
            </div>
          </div>
          <p>
            <strong>Key innovation:</strong> Separating voluntary wake (feeding the baby at 3am) from involuntary disruption (insomnia despite opportunity to sleep). This distinction is what makes our PPD detection fundamentally different from any existing system. Patent 012 covers this.
          </p>
        </div>
      </SpecSection>

      {/* Section 4-12: Placeholder sections */}
      {[
        { num: "4", title: "Recovery Trajectory Engine" },
        { num: "5", title: "Vital Sign Monitoring" },
        { num: "6", title: "Care Team Expansion — Luna" },
        { num: "7", title: "Lactation Intelligence" },
        { num: "8", title: "Escalation Protocols" },
        { num: "9", title: "Phase Timeline & Dependencies" },
        { num: "10", title: "Data Architecture" },
        { num: "11", title: "Patent Coverage" },
        { num: "12", title: "FDA & Compliance" },
      ].map((section) => (
        <SpecSection key={section.num} title={`${section.num}. ${section.title}`} id={`section-${section.num}`}>
          <SpecNote>
            Section content will be added when the complete postpartum specification document is finalized. Architecture and structure follow the Pregnancy Wellness Scoring Spec pattern.
          </SpecNote>
        </SpecSection>
      ))}

      {/* Patent Coverage Quick Reference */}
      <SpecSection title="Quick Reference: Patent Coverage">
        <div className="space-y-2">
          {[
            { number: "012", name: "PPD Detection System", status: "Draft", priority: "Critical" },
            { number: "013", name: "Recovery Trajectory Modeling", status: "Draft", priority: "High" },
            { number: "014", name: "Secondary Infertility Prevention", status: "Draft", priority: "High" },
          ].map((p) => (
            <Link
              key={p.number}
              href={`/departments/legal/patent-drafts/patent-${p.number}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <Shield size={14} style={{ color: ACCENT }} />
              <span className="text-xs font-bold" style={{ color: ACCENT }}>
                Patent {p.number}
              </span>
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>
                {p.name}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: p.priority === "Critical" ? "#E24D4714" : "#F59E0B14",
                  color: p.priority === "Critical" ? "#E24D47" : "#F59E0B",
                }}
              >
                {p.priority}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      </SpecSection>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <Link
          href="/departments/product/experiences/postpartum"
          className="flex items-center gap-2 text-xs font-medium"
          style={{ color: ACCENT }}
        >
          <ArrowLeft size={12} />
          Back to Postpartum Experience
        </Link>
        <Link
          href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
          className="flex items-center gap-2 text-xs font-medium"
          style={{ color: "#D4A843" }}
        >
          Pregnancy Scoring Spec →
        </Link>
      </div>
    </div>
  );
}
