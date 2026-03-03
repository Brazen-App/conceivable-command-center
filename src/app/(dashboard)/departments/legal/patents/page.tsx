"use client";

import { useState } from "react";
import { FileText, AlertTriangle, Clock, CheckCircle2, Eye, ExternalLink, Shield, MessageSquare, Sparkles } from "lucide-react";

const ACCENT = "#E24D47";

type PatentStatus = "filed" | "provisional" | "urgent" | "granted" | "pending";

interface PatentFiling {
  id: string;
  title: string;
  type: string;
  status: PatentStatus;
  filingDate: string | null;
  applicationNumber: string | null;
  description: string;
  keyClaimsCount: number;
  deadline: string | null;
  priority: "critical" | "high" | "standard";
  notes: string;
}

const PATENT_FILINGS: PatentFiling[] = [
  {
    id: "p01",
    title: "Data Aggregation + Scoring Architecture",
    type: "Utility Patent",
    status: "filed",
    filingDate: "2023-08-15",
    applicationNumber: "US2023XXXXXX",
    description: "System and method for aggregating multi-source fertility biomarker data and generating composite health scores using machine learning algorithms.",
    keyClaimsCount: 24,
    deadline: null,
    priority: "high",
    notes: "Core platform architecture protection. Broad claims covering data aggregation from wearables, lab results, and self-reported data.",
  },
  {
    id: "p02",
    title: "Temperature + Hormone Interpretation",
    type: "Utility Patent",
    status: "filed",
    filingDate: "2016-02-12",
    applicationNumber: "US20160140314A1",
    description: "Methods and systems for interpreting basal body temperature patterns in conjunction with hormone level data to predict and confirm ovulation windows.",
    keyClaimsCount: 18,
    deadline: null,
    priority: "high",
    notes: "Published application. Key claims on combined BBT + hormone interpretation algorithm. Prior art documented.",
  },
  {
    id: "p03",
    title: "Personalized Recommendation Engine",
    type: "Utility Patent",
    status: "filed",
    filingDate: "2024-01-22",
    applicationNumber: "US2024XXXXXX",
    description: "AI-driven system for generating personalized fertility intervention recommendations based on individual biomarker profiles and population-level outcome data.",
    keyClaimsCount: 31,
    deadline: null,
    priority: "standard",
    notes: "Broad claims on personalized recommendation logic. Differentiates from generic health recommendation systems through fertility-specific causal models.",
  },
  {
    id: "p04",
    title: "System-Level Platform",
    type: "Utility Patent",
    status: "filed",
    filingDate: "2024-03-10",
    applicationNumber: "US2024XXXXXX",
    description: "Comprehensive platform architecture for continuous fertility health monitoring, combining wearable devices, mobile applications, and cloud-based AI processing.",
    keyClaimsCount: 27,
    deadline: null,
    priority: "standard",
    notes: "Umbrella patent covering the complete system. Cross-references other filings for specific subsystems.",
  },
  {
    id: "p05",
    title: "Closed-Loop Physiologic Correction",
    type: "Provisional Patent",
    status: "urgent",
    filingDate: null,
    applicationNumber: null,
    description: "Method for closed-loop physiologic correction in fertility optimization, where continuous monitoring data automatically triggers intervention recommendations and monitors response in real-time.",
    keyClaimsCount: 15,
    deadline: "2026-03-31",
    priority: "critical",
    notes: "CRITICAL: Must file provisional BEFORE fundraise begins. This is the core IP differentiator that investors will evaluate. Patent covers the feedback loop between monitoring and intervention.",
  },
];

interface CompetitorFiling {
  company: string;
  title: string;
  filingDate: string;
  relevance: "high" | "medium" | "low";
  overlap: string;
  status: string;
}

const COMPETITOR_FILINGS: CompetitorFiling[] = [
  { company: "Oura Health", title: "Temperature-based cycle tracking methods", filingDate: "2024-06-15", relevance: "high", overlap: "BBT monitoring methods -- differentiated by our AI interpretation layer", status: "Published" },
  { company: "Natural Cycles", title: "Algorithm for fertility window prediction", filingDate: "2023-11-20", relevance: "high", overlap: "Ovulation prediction -- our claims focus on multi-biomarker fusion, not single-factor", status: "Granted" },
  { company: "Ava Science", title: "Wearable sensor-based fertility monitoring", filingDate: "2024-02-08", relevance: "medium", overlap: "Wearable data collection -- limited to hardware, not software/AI claims", status: "Published" },
  { company: "Clue (BioWink)", title: "Machine learning cycle prediction", filingDate: "2024-08-12", relevance: "medium", overlap: "ML-based prediction -- focuses on cycle length, not intervention optimization", status: "Pending" },
  { company: "Flo Health", title: "Symptom tracking and health insights", filingDate: "2024-04-30", relevance: "low", overlap: "Symptom-based tracking -- minimal overlap with biomarker approach", status: "Published" },
];

function StatusBadge({ status }: { status: PatentStatus }) {
  const config = {
    filed: { bg: "#1EAA5518", color: "#1EAA55", label: "Filed" },
    provisional: { bg: "#F1C02818", color: "#F1C028", label: "Provisional" },
    urgent: { bg: "#E24D4718", color: "#E24D47", label: "Urgent" },
    granted: { bg: "#1EAA5518", color: "#1EAA55", label: "Granted" },
    pending: { bg: "#356FB618", color: "#356FB6", label: "Pending" },
  };
  const c = config[status];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "critical" | "high" | "standard" }) {
  const config = {
    critical: { bg: "#E24D4718", color: "#E24D47" },
    high: { bg: "#F1C02818", color: "#F1C028" },
    standard: { bg: "#356FB618", color: "#356FB6" },
  };
  const c = config[priority];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: c.bg, color: c.color }}>
      {priority}
    </span>
  );
}

function RelevanceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: { bg: "#E24D4718", color: "#E24D47" },
    medium: { bg: "#F1C02818", color: "#F1C028" },
    low: { bg: "#1EAA5518", color: "#1EAA55" },
  };
  const c = config[level];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {level}
    </span>
  );
}

function CountdownTimer({ deadline }: { deadline: string }) {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  const isUrgent = days <= 30;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
      style={{
        backgroundColor: isUrgent ? "#E24D4718" : "#F1C02818",
        border: `1px solid ${isUrgent ? "#E24D4730" : "#F1C02830"}`,
      }}
    >
      <Clock size={12} style={{ color: isUrgent ? "#E24D47" : "#F1C028" }} />
      <span className="text-xs font-bold" style={{ color: isUrgent ? "#E24D47" : "#F1C028" }}>
        {days} days remaining
      </span>
    </div>
  );
}

export default function PatentsPage() {
  const [expandedId, setExpandedId] = useState<string | null>("p05");

  return (
    <div className="space-y-6">
      {/* Priority Alert */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ backgroundColor: "#E24D470A", border: "1px solid #E24D4720" }}
      >
        <AlertTriangle size={24} style={{ color: "#E24D47" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: "#E24D47" }}>
            CRITICAL: File Closed-Loop Patent Before Fundraise
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
            The Closed-Loop Physiologic Correction patent is the core IP differentiator for Series A.
            Provisional must be filed before any investor conversations begin. This protects the feedback
            loop between continuous monitoring and automated intervention recommendations.
          </p>
          <div className="mt-2">
            <CountdownTimer deadline="2026-03-31" />
          </div>
        </div>
      </div>

      {/* Patent Filings */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            IP War Room -- Patent Portfolio
          </h2>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {PATENT_FILINGS.length} filings
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {PATENT_FILINGS.map((patent) => (
            <div key={patent.id}>
              <div
                className="px-5 py-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpandedId(expandedId === patent.id ? null : patent.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {patent.title}
                      </p>
                      <PriorityBadge priority={patent.priority} />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{patent.type}</span>
                      {patent.filingDate && (
                        <span className="text-xs" style={{ color: "var(--muted)" }}>
                          Filed: {patent.filingDate}
                        </span>
                      )}
                      {patent.applicationNumber && (
                        <span className="text-xs font-mono" style={{ color: ACCENT }}>
                          {patent.applicationNumber}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {patent.keyClaimsCount} claims
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {patent.deadline && <CountdownTimer deadline={patent.deadline} />}
                    <StatusBadge status={patent.status} />
                  </div>
                </div>
              </div>
              {expandedId === patent.id && (
                <div className="px-5 pb-4" style={{ backgroundColor: "var(--background)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Description
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {patent.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Notes
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {patent.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#5A6FFF" }}
                    >
                      <MessageSquare size={13} />
                      Draft with Joy
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}
                    >
                      <Sparkles size={13} />
                      Joy: Assess Prior Art
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <ExternalLink size={13} />
                      View Full Filing
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Competitor Monitoring */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Eye size={16} style={{ color: "var(--muted)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Competitor Patent Monitor
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Company</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Filing</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Relevance</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Overlap Analysis</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_FILINGS.map((filing, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{filing.company}</td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{filing.title}</td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{filing.filingDate}</td>
                  <td className="px-5 py-3"><RelevanceBadge level={filing.relevance} /></td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{filing.overlap}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
