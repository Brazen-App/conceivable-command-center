"use client";

import { useState } from "react";
import { BookOpen, FileText, Clock, CheckCircle2, Send, Edit3, Calendar, ExternalLink } from "lucide-react";

const ACCENT = "#78C3BF";

type ManuscriptStatus = "planning" | "drafting" | "internal-review" | "submitted" | "in-review" | "revision" | "accepted" | "published";

interface Manuscript {
  id: string;
  title: string;
  targetJournal: string;
  impactFactor: number;
  status: ManuscriptStatus;
  submissionDate: string | null;
  authors: string[];
  abstract: string;
  keyFindings: string[];
}

const MANUSCRIPTS: Manuscript[] = [
  {
    id: "m01",
    title: "Multi-Biomarker Fertility Optimization: A Pilot Study of AI-Driven Personalized Interventions",
    targetJournal: "Fertility & Sterility",
    impactFactor: 7.33,
    status: "drafting",
    submissionDate: null,
    authors: ["Karchmer, K.", "et al."],
    abstract: "We present results from a 105-participant pilot study demonstrating 150-260% improvement in fertility markers through a closed-loop system integrating continuous biomarker monitoring with personalized intervention recommendations.",
    keyFindings: ["150-260% improvement in composite fertility score", "96% ovulation detection accuracy via BBT AI", "240,000+ data points collected across 50 fertility factors"],
  },
  {
    id: "m02",
    title: "Temperature Pattern AI: Deep Learning for Ovulation Prediction and Luteal Phase Assessment",
    targetJournal: "JAMA Network Open",
    impactFactor: 13.35,
    status: "drafting",
    submissionDate: null,
    authors: ["Karchmer, K.", "et al."],
    abstract: "Novel deep learning approach to BBT pattern analysis achieving 96% ovulation detection accuracy and identifying luteal phase quality indicators predictive of conception probability.",
    keyFindings: ["96% ovulation detection vs 82% for traditional methods", "Luteal phase quality scoring correlates with conception at r=0.78", "Real-time pattern alerts enable timely intervention"],
  },
  {
    id: "m03",
    title: "Closed-Loop Physiologic Correction: Framework for Continuous Fertility Optimization",
    targetJournal: "Nature Digital Medicine",
    impactFactor: 15.36,
    status: "planning",
    submissionDate: null,
    authors: ["Karchmer, K.", "et al."],
    abstract: "Theoretical and practical framework for closed-loop systems in reproductive health, combining wearable monitoring, AI interpretation, and automated intervention recommendations.",
    keyFindings: ["Framework for continuous monitoring + intervention feedback loops", "Integration of 50+ biomarkers into unified scoring", "Patent-aligned architecture for physiologic correction"],
  },
  {
    id: "m04",
    title: "Insulin Resistance and Ovulatory Function: Insights from Continuous Glucose Monitoring in Fertility Patients",
    targetJournal: "Journal of Clinical Endocrinology & Metabolism",
    impactFactor: 5.8,
    status: "planning",
    submissionDate: null,
    authors: ["Karchmer, K.", "et al."],
    abstract: "Analysis of CGM data from fertility-seeking women revealing novel correlations between glycemic variability, fasting insulin, and ovulatory regularity.",
    keyFindings: ["Fasting insulin >10 predicts anovulation with 82% accuracy", "Post-meal glucose spikes >140 correlate with luteal phase defects", "Blood sugar stabilization protocol improved ovulation in 81% of participants"],
  },
  {
    id: "m05",
    title: "The Fertility Factor Network: Mapping Causal Relationships Among 50 Reproductive Health Biomarkers",
    targetJournal: "Human Reproduction",
    impactFactor: 6.1,
    status: "planning",
    submissionDate: null,
    authors: ["Karchmer, K.", "et al."],
    abstract: "Network analysis of 50 fertility factors revealing previously uncharacterized causal chains and identifying high-leverage intervention points.",
    keyFindings: ["5 primary causal chains identified", "Insulin resistance cascade affects 30% of infertility cases", "Sleep-stress-hormone axis is modifiable with 28% cycle improvement"],
  },
];

interface JournalTarget {
  name: string;
  impactFactor: number;
  focus: string;
  submissionTimeline: string;
}

const JOURNAL_TARGETS: JournalTarget[] = [
  { name: "Nature Digital Medicine", impactFactor: 15.36, focus: "Digital health innovation", submissionTimeline: "Q3 2026" },
  { name: "JAMA Network Open", impactFactor: 13.35, focus: "Clinical research, broad scope", submissionTimeline: "Q2 2026" },
  { name: "Fertility & Sterility", impactFactor: 7.33, focus: "Reproductive medicine specialty", submissionTimeline: "Q2 2026" },
  { name: "Human Reproduction", impactFactor: 6.1, focus: "Reproductive biology and medicine", submissionTimeline: "Q3 2026" },
  { name: "J. Clinical Endocrinology & Metabolism", impactFactor: 5.8, focus: "Endocrine disorders", submissionTimeline: "Q4 2026" },
  { name: "BMC Women's Health", impactFactor: 2.8, focus: "Women's health, open access", submissionTimeline: "Q4 2026" },
];

const STATUS_CONFIG: Record<ManuscriptStatus, { color: string; label: string; icon: typeof Clock }> = {
  planning: { color: "#9686B9", label: "Planning", icon: Calendar },
  drafting: { color: "#356FB6", label: "Drafting", icon: Edit3 },
  "internal-review": { color: "#F1C028", label: "Internal Review", icon: FileText },
  submitted: { color: "#78C3BF", label: "Submitted", icon: Send },
  "in-review": { color: "#E37FB1", label: "In Review", icon: Clock },
  revision: { color: "#F1C028", label: "Revision", icon: Edit3 },
  accepted: { color: "#1EAA55", label: "Accepted", icon: CheckCircle2 },
  published: { color: "#1EAA55", label: "Published", icon: BookOpen },
};

function StatusBadge({ status }: { status: ManuscriptStatus }) {
  const c = STATUS_CONFIG[status];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
      <Icon size={10} />
      {c.label}
    </span>
  );
}

const TIMELINE_STAGES: ManuscriptStatus[] = ["planning", "drafting", "internal-review", "submitted", "in-review", "revision", "accepted", "published"];

export default function PublishingPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Publication Pipeline
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          {MANUSCRIPTS.length} Manuscripts
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Targeting journals with combined Impact Factor of {JOURNAL_TARGETS.reduce((s, j) => s + j.impactFactor, 0).toFixed(1)}
        </p>
        <div className="flex gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Edit3 size={12} style={{ color: "#356FB6" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {MANUSCRIPTS.filter((m) => m.status === "drafting").length} drafting
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} style={{ color: "#9686B9" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {MANUSCRIPTS.filter((m) => m.status === "planning").length} planning
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Send size={12} style={{ color: ACCENT }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {MANUSCRIPTS.filter((m) => m.status === "submitted" || m.status === "in-review").length} in review
            </span>
          </div>
        </div>
      </div>

      {/* Manuscript Tracker */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Manuscript Tracker
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {MANUSCRIPTS.map((ms) => (
            <div key={ms.id}>
              <div
                className="px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpandedId(expandedId === ms.id ? null : ms.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                      {ms.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {ms.targetJournal}
                      </span>
                      <span className="text-xs font-medium" style={{ color: ACCENT }}>
                        IF: {ms.impactFactor}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {ms.authors.join(", ")}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={ms.status} />
                </div>

                {/* Mini timeline */}
                <div className="flex items-center gap-0.5 mt-3">
                  {TIMELINE_STAGES.map((stage, i) => {
                    const currentIndex = TIMELINE_STAGES.indexOf(ms.status);
                    const isCompleted = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div
                        key={stage}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          backgroundColor: isCompleted
                            ? "#1EAA55"
                            : isCurrent
                            ? STATUS_CONFIG[ms.status].color
                            : "var(--border)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {expandedId === ms.id && (
                <div className="px-5 pb-4" style={{ backgroundColor: "var(--background)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                        Abstract
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {ms.abstract}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                        Key Findings
                      </p>
                      <ul className="space-y-1">
                        {ms.keyFindings.map((finding, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={12} style={{ color: "#1EAA55" }} className="shrink-0 mt-0.5" />
                            <span className="text-xs" style={{ color: "var(--foreground)" }}>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Journal Targets */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Target Journals
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Journal</th>
                <th className="text-right px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impact Factor</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Focus</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Target Submission</th>
              </tr>
            </thead>
            <tbody>
              {JOURNAL_TARGETS.map((journal) => (
                <tr key={journal.name} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                    <div className="flex items-center gap-2">
                      {journal.name}
                      <ExternalLink size={12} style={{ color: "var(--muted)" }} />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="font-bold" style={{ color: ACCENT }}>{journal.impactFactor}</span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{journal.focus}</td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{journal.submissionTimeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publication Timeline */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Publication Timeline
        </h2>
        <div className="space-y-3">
          {[
            { quarter: "Q2 2026", items: ["Submit Pilot Study to Fertility & Sterility", "Submit BBT AI paper to JAMA Network Open"] },
            { quarter: "Q3 2026", items: ["Submit Closed-Loop framework to Nature Digital Medicine", "Begin Factor Network analysis paper"] },
            { quarter: "Q4 2026", items: ["Submit Insulin-Ovulation paper to JCEM", "Submit Factor Network to Human Reproduction"] },
            { quarter: "Q1 2027", items: ["Expected first publication results", "Prepare conference presentations"] },
          ].map((phase) => (
            <div key={phase.quarter} className="flex gap-4">
              <div className="w-20 shrink-0">
                <span className="text-xs font-bold" style={{ color: ACCENT }}>{phase.quarter}</span>
              </div>
              <div className="flex-1 pb-3 border-l-2 pl-4" style={{ borderColor: `${ACCENT}30` }}>
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <span className="text-xs" style={{ color: "var(--foreground)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
