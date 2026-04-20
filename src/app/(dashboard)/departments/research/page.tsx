"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Microscope,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Database,
  Users,
  ShieldCheck,
  Calendar,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const ACCENT = "#78C3BF";

interface Paper {
  id: string;
  number: number;
  title: string;
  leadAuthor: string;
  status: string;
  targetJournal: string | null;
  submissionDeadline: string | null;
  irbStatus: string;
  notes: string | null;
}

interface DataAsset {
  id: string;
  name: string;
  source: string;
  sampleSize: number | null;
  irbStatus: string;
  availableForResearch: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  hypothesis: "Hypothesis",
  outline: "Outline",
  draft: "Draft",
  final_draft: "Final Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  revision: "Revision",
  accepted: "Accepted",
  published: "Published",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  not_started: { bg: "rgba(255,255,255,0.08)", text: "var(--muted)" },
  hypothesis: { bg: "#9686B920", text: "#9686B9" },
  outline: { bg: "#F1C02820", text: "#F1C028" },
  draft: { bg: "#5A6FFF20", text: "#5A6FFF" },
  final_draft: { bg: "#356FB620", text: "#356FB6" },
  submitted: { bg: "#78C3BF20", text: "#78C3BF" },
  under_review: { bg: "#ACB7FF20", text: "#ACB7FF" },
  revision: { bg: "#F1C02820", text: "#F1C028" },
  accepted: { bg: "#1EAA5520", text: "#1EAA55" },
  published: { bg: "#1EAA5530", text: "#1EAA55" },
};

const IRB_COLORS: Record<string, { bg: string; text: string }> = {
  "n/a": { bg: "rgba(255,255,255,0.06)", text: "var(--muted)" },
  needed: { bg: "#E24D4720", text: "#E24D47" },
  submitted: { bg: "#F1C02820", text: "#F1C028" },
  approved: { bg: "#1EAA5520", text: "#1EAA55" },
  exempt: { bg: "#78C3BF20", text: "#78C3BF" },
};

const CONSENT_CHECKLIST = [
  {
    id: "pilot",
    label: "Clinical Pilot IRB Status Confirmed",
    description: "Confirm IRB status for the 105-woman pilot data (2022-2024)",
    status: "red" as const,
  },
  {
    id: "app",
    label: "App Consent Framework Built",
    description: "Research consent checkbox in app onboarding flow before April 30 launch",
    status: "red" as const,
  },
  {
    id: "ring",
    label: "Halo Ring Data Consent Framework",
    description: "Biometric data research consent built into Halo Ring setup flow",
    status: "red" as const,
  },
];

const MILESTONES = [
  { date: "2026-04-28", label: "Paper 1 submission deadline", paper: 1, color: "#E24D47" },
  { date: "2026-04-30", label: "App launch — consent framework must be live", paper: null, color: "#5A6FFF" },
  { date: "2026-06-01", label: "Paper 2 IRB submission target", paper: 2, color: "#F1C028" },
  { date: "2026-08-31", label: "Paper 2 submission deadline", paper: 2, color: "#E24D47" },
  { date: "2026-09-30", label: "Paper 4 submission deadline", paper: 4, color: "#E24D47" },
  { date: "2026-10-31", label: "Paper 3 submission deadline", paper: 3, color: "#F1C028" },
  { date: "2026-12-31", label: "Paper 5 submission deadline", paper: 5, color: "#F1C028" },
  { date: "2027-01-31", label: "Paper 6 submission deadline", paper: 6, color: "#9686B9" },
];

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ResearchDashboardPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/research");
      if (res.ok) {
        const data = await res.json();
        setPapers(data.papers || []);
        setDataAssets(data.dataAssets || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const seedData = async () => {
    setSeeding(true);
    try {
      await fetch("/api/research/seed", { method: "POST" });
      await fetchData();
    } catch {
      // silent
    } finally {
      setSeeding(false);
    }
  };

  // Stats
  const nextDeadline = MILESTONES.filter((m) => daysUntil(m.date) > 0).sort(
    (a, b) => daysUntil(a.date) - daysUntil(b.date)
  )[0];
  const inProgress = papers.filter(
    (p) => !["not_started", "published"].includes(p.status)
  ).length;
  const submitted = papers.filter(
    (p) => ["submitted", "under_review", "revision", "accepted"].includes(p.status)
  ).length;
  const published = papers.filter((p) => p.status === "published").length;
  const irbNeeded = papers.filter((p) => p.irbStatus === "needed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="space-y-6">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, #2A2828 0%, #1a3a3a 50%, ${ACCENT} 100%)`,
          }}
        >
          <Microscope size={48} className="text-white/60 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Research Division</h2>
          <p className="text-white/60 text-sm mb-6">
            No research data found. Seed the initial 6 papers and data assets to get started.
          </p>
          <button
            onClick={seedData}
            disabled={seeding}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {seeding ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Seeding...
              </span>
            ) : (
              "Seed Research Data"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #2A2828 0%, #1a3a3a 50%, ${ACCENT} 100%)`,
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <Microscope size={24} className="text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
              >
                Research Division
              </h1>
              <p
                className="text-white/50 text-xs"
                style={{
                  fontFamily: "var(--font-caption)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Building the evidence base
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Pipeline</span>
              </div>
              <p className="text-2xl font-bold text-white">{papers.length}</p>
              <p className="text-[10px] text-white/40">{inProgress} in progress</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Submitted</span>
              </div>
              <p className="text-2xl font-bold text-white">{submitted}</p>
              <p className="text-[10px] text-white/40">{published} published</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Next Deadline</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {nextDeadline ? `${daysUntil(nextDeadline.date)}d` : "--"}
              </p>
              <p className="text-[10px] text-white/40">
                {nextDeadline ? `Paper ${nextDeadline.paper || ""}` : "None"}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">IRB Needed</span>
              </div>
              <p className="text-2xl font-bold text-white">{irbNeeded}</p>
              <p className="text-[10px] text-white/40">papers blocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Paper Tracker */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: ACCENT }} />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Paper Pipeline
            </span>
          </div>
          <Link
            href="/departments/research/papers"
            className="text-xs font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: ACCENT }}
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  #
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  Title
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  Status
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  Journal
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  Deadline
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                  IRB
                </th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper) => {
                const sc = STATUS_COLORS[paper.status] || STATUS_COLORS.not_started;
                const ic = IRB_COLORS[paper.irbStatus] || IRB_COLORS["n/a"];
                const deadlineDays = paper.submissionDeadline
                  ? daysUntil(paper.submissionDeadline)
                  : null;
                const isUrgent = deadlineDays !== null && deadlineDays <= 30 && deadlineDays > 0;
                const isOverdue = deadlineDays !== null && deadlineDays <= 0;

                return (
                  <tr
                    key={paper.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold" style={{ color: ACCENT }}>
                        {paper.number}
                      </span>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {paper.title}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {STATUS_LABELS[paper.status] || paper.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {paper.targetJournal || "--"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {paper.submissionDeadline ? (
                        <span
                          className={`text-xs font-medium ${isOverdue ? "" : ""}`}
                          style={{
                            color: isOverdue
                              ? "#E24D47"
                              : isUrgent
                              ? "#F1C028"
                              : "var(--muted)",
                          }}
                        >
                          {paper.submissionDeadline}
                          {isUrgent && ` (${deadlineDays}d)`}
                          {isOverdue && " (overdue)"}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--muted)" }}>
                          --
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase"
                        style={{ backgroundColor: ic.bg, color: ic.text }}
                      >
                        {paper.irbStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* IRB Consent Framework Checklist */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
          <ShieldCheck size={16} style={{ color: "#E24D47" }} />
          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            IRB & Consent Framework Checklist
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2"
            style={{ backgroundColor: "#E24D4720", color: "#E24D47" }}
          >
            0/3 Complete
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {CONSENT_CHECKLIST.map((item) => (
            <div key={item.id} className="px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5">
                <XCircle size={18} style={{ color: "#E24D47" }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Milestones */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
          <Calendar size={16} style={{ color: ACCENT }} />
          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            Research Calendar
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {MILESTONES.map((m, i) => {
            const days = daysUntil(m.date);
            const isPast = days <= 0;
            return (
              <div
                key={i}
                className={`px-5 py-3 flex items-center gap-4 ${isPast ? "opacity-50" : ""}`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: m.color }}
                />
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    {m.label}
                  </p>
                </div>
                <span className="text-xs font-medium shrink-0" style={{ color: "var(--muted)" }}>
                  {m.date}
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: isPast
                      ? "rgba(255,255,255,0.06)"
                      : days <= 30
                      ? "#E24D4720"
                      : "#1EAA5520",
                    color: isPast ? "var(--muted)" : days <= 30 ? "#E24D47" : "#1EAA55",
                  }}
                >
                  {isPast ? "past" : `${days}d`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/departments/research/data"
          className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, #2A2828 0%, ${ACCENT} 100%)` }}
          >
            <Database size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Data Assets</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {dataAssets.length} datasets tracked
            </p>
          </div>
          <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" style={{ color: ACCENT }} />
        </Link>

        <Link
          href="/departments/research/partners"
          className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, #2A2828 0%, #9686B9 100%)` }}
          >
            <Users size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Academic Partners</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Co-authors & collaborators
            </p>
          </div>
          <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" style={{ color: ACCENT }} />
        </Link>

        <Link
          href="/departments/research/paper-4"
          className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, #E24D47 0%, #F1C028 100%)` }}
          >
            <FileText size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Paper 4: Miscarriage</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              3 subclinical predictors
            </p>
          </div>
          <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" style={{ color: ACCENT }} />
        </Link>
      </div>

      {/* Sullivan: Research as Moat */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #9686B908 0%, #78C3BF08 100%)",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Multiplier: Peer-Reviewed Research as Competitive Moat
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              Published research in top journals creates credibility no competitor can replicate quickly.
              Paper 1 (JMIR) establishes the framework. Paper 4 (miscarriage predictors) is the breakthrough.
              Combined with patents, this builds an evidence + IP moat that compounds over time.
              Impacts Research, Clinical, Fundraising, and Marketing simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
