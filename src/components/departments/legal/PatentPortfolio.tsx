"use client";

import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Zap,
  Target,
  Eye,
  FileWarning,
  FileText,
} from "lucide-react";
import type { Patent, CompetitorFiling } from "@/lib/data/legal-data";

interface Props {
  patents: Patent[];
  competitorFilings: CompetitorFiling[];
  onStartDraft?: (patent: Patent) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  granted: { label: "Granted", color: "#1EAA55", bg: "#1EAA5514" },
  pending: { label: "Pending", color: "#5A6FFF", bg: "#5A6FFF14" },
  provisional: { label: "Provisional", color: "#F1C028", bg: "#F1C02814" },
  planned: { label: "Planned", color: "#9686B9", bg: "#9686B914" },
  urgent: { label: "URGENT — File Now", color: "#E24D47", bg: "#E24D4714" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: "CRITICAL", color: "#E24D47" },
  high: { label: "HIGH", color: "#F1C028" },
  medium: { label: "MEDIUM", color: "#5A6FFF" },
  low: { label: "LOW", color: "#78C3BF" },
};

const THREAT_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "High Threat", color: "#E24D47" },
  medium: { label: "Medium Threat", color: "#F1C028" },
  low: { label: "Low Threat", color: "#1EAA55" },
};

function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function PatentCard({ patent, onStartDraft }: { patent: Patent; onStartDraft?: (patent: Patent) => void }) {
  const [expanded, setExpanded] = useState(patent.status === "urgent");
  const statusConf = STATUS_CONFIG[patent.status];
  const isUrgent = patent.status === "urgent" || patent.filingPriority === "critical";
  const priorityConf = patent.filingPriority ? PRIORITY_CONFIG[patent.filingPriority] : null;
  const threatConf = THREAT_CONFIG[patent.competitiveThreatLevel];
  const daysLeft = patent.filingDeadline ? daysUntil(patent.filingDeadline) : null;

  return (
    <div
      className={`rounded-xl border transition-all ${isUrgent ? "ring-2 ring-[#E24D4740]" : ""}`}
      style={{
        borderColor: isUrgent ? "#E24D47" : "var(--border)",
        backgroundColor: isUrgent ? "#E24D4704" : "var(--surface)",
      }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? (
            <ChevronDown size={14} style={{ color: isUrgent ? "#E24D47" : "var(--muted)" }} />
          ) : (
            <ChevronRight size={14} style={{ color: isUrgent ? "#E24D47" : "var(--muted)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusConf.bg, color: statusConf.color }}
            >
              {statusConf.label}
            </span>
            {priorityConf && (
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${priorityConf.color}14`, color: priorityConf.color }}
              >
                {priorityConf.label}
              </span>
            )}
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${threatConf.color}14`, color: threatConf.color }}
            >
              {threatConf.label}
            </span>
            {patent.patentNumber && (
              <span className="text-[10px] font-mono" style={{ color: "var(--muted-light)" }}>
                {patent.patentNumber}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
            {patent.shortTitle}
          </p>
          <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "var(--muted)" }}>
            {patent.title}
          </p>
        </div>

        {/* Countdown timer for urgent filings */}
        {daysLeft !== null && (
          <div className="text-center shrink-0">
            <p
              className="text-xl font-bold"
              style={{ color: daysLeft <= 30 ? "#E24D47" : daysLeft <= 60 ? "#F1C028" : "#5A6FFF" }}
            >
              {daysLeft}
            </p>
            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted-light)" }}>
              days left
            </p>
          </div>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Deadline warning */}
          {patent.deadlineReason && (
            <div
              className="rounded-lg p-3 mt-3 flex items-start gap-2"
              style={{
                backgroundColor: isUrgent ? "#E24D470A" : "#F1C0280A",
                borderLeft: `3px solid ${isUrgent ? "#E24D47" : "#F1C028"}`,
              }}
            >
              <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: isUrgent ? "#E24D47" : "#F1C028" }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {patent.deadlineReason}
              </p>
            </div>
          )}

          {/* Description */}
          <div
            className="rounded-lg p-3 mt-3 text-xs leading-relaxed"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
          >
            {patent.description}
          </div>

          {/* Key Claims */}
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
              Key Claims
            </p>
            <div className="space-y-1">
              {patent.keyClaims.map((claim, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-xs" style={{ color: "var(--foreground)" }}>{claim}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {patent.assignedAttorney && (
              <div className="rounded-lg p-2.5" style={{ backgroundColor: "var(--background)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>
                  Assigned Counsel
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {patent.assignedAttorney}
                </p>
              </div>
            )}
            {patent.filingDate && (
              <div className="rounded-lg p-2.5" style={{ backgroundColor: "var(--background)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>
                  Filing Date
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {new Date(patent.filingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            )}
          </div>

          {/* Prior Art Notes */}
          {patent.priorArtNotes && (
            <div
              className="rounded-lg p-3 mt-3"
              style={{ backgroundColor: "#5A6FFF08", borderLeft: "3px solid #5A6FFF" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#5A6FFF" }}>
                Prior Art Assessment
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {patent.priorArtNotes}
              </p>
            </div>
          )}

          {/* Cross-department connections */}
          {patent.crossDeptConnections.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "#E24D47" }}>
                <Zap size={10} /> Cross-Department Impact
              </p>
              <div className="space-y-1">
                {patent.crossDeptConnections.map((conn, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#E24D47" }} />
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{conn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Draft button */}
          {onStartDraft && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartDraft(patent);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "#E24D47" }}
            >
              <FileText size={14} />
              Start Provisional Draft
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CompetitorCard({ filing }: { filing: CompetitorFiling }) {
  const [expanded, setExpanded] = useState(false);
  const threat = THREAT_CONFIG[filing.threatLevel];
  const relevanceColor = filing.relevance === "direct" ? "#E24D47" : filing.relevance === "adjacent" ? "#F1C028" : "#78C3BF";

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? <ChevronDown size={12} style={{ color: "var(--muted)" }} /> : <ChevronRight size={12} style={{ color: "var(--muted)" }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${threat.color}14`, color: threat.color }}>
              {threat.label}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${relevanceColor}14`, color: relevanceColor }}>
              {filing.relevance}
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>{filing.competitor}</span>
          </div>
          <p className="text-xs font-medium leading-snug" style={{ color: "var(--foreground)" }}>
            {filing.title}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="rounded-lg p-3 mt-3 text-xs leading-relaxed" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
            {filing.summary}
          </div>
          <div className="mt-2">
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Overlaps With Us</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {filing.overlapsWithUs.map((o) => (
                <span key={o} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D470A", color: "#E24D47" }}>
                  {o}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#1EAA55" }}>Agent Assessment</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{filing.agentAssessment}</p>
          </div>
          {filing.patentNumber && (
            <p className="text-[10px] font-mono mt-2" style={{ color: "var(--muted-light)" }}>
              {filing.patentNumber} &middot; Filed {new Date(filing.filingDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PatentPortfolio({ patents, competitorFilings, onStartDraft }: Props) {
  const [showCompetitors, setShowCompetitors] = useState(false);

  const urgentFilings = patents.filter((p) => p.status === "urgent" || p.filingPriority === "critical");
  const highFilings = patents.filter((p) => p.filingPriority === "high");
  const existingPatents = patents.filter((p) => p.status === "granted" || p.status === "pending");
  const plannedFilings = patents.filter((p) => p.status === "planned" && p.filingPriority !== "high");
  const directThreats = competitorFilings.filter((f) => f.relevance === "direct");

  return (
    <div>
      {/* War room header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "linear-gradient(135deg, #E24D47 0%, #2A2828 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield className="text-white" size={22} strokeWidth={2} />
          <div>
            <p className="text-white font-semibold text-sm">IP War Room</p>
            <p className="text-white/60 text-xs">
              {patents.length} filings tracked &middot; {urgentFilings.length} urgent &middot; {competitorFilings.length} competitor filings monitored
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Granted</p>
            <p className="text-white text-xl font-bold">{patents.filter((p) => p.status === "granted").length}</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Pending</p>
            <p className="text-white text-xl font-bold">{patents.filter((p) => p.status === "pending").length}</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(226,77,71,0.3)" }}>
            <p className="text-red-200 text-[9px] uppercase tracking-wider">Urgent Filings</p>
            <p className="text-white text-xl font-bold">{urgentFilings.length + highFilings.length}</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Competitor Threats</p>
            <p className="text-white text-xl font-bold">{directThreats.length}</p>
          </div>
        </div>
      </div>

      {/* Critical filings section */}
      {(urgentFilings.length > 0 || highFilings.length > 0) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: "#E24D47" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E24D47" }}>
              Critical Filings Needed
            </h3>
          </div>
          <div className="space-y-3">
            {[...urgentFilings, ...highFilings].map((patent) => (
              <PatentCard key={patent.id} patent={patent} onStartDraft={onStartDraft} />
            ))}
          </div>
        </div>
      )}

      {/* Existing patents */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Protected IP
          </h3>
        </div>
        <div className="space-y-3">
          {existingPatents.map((patent) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>
      </div>

      {/* Planned filings */}
      {plannedFilings.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} style={{ color: "#9686B9" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Planned Filings
            </h3>
          </div>
          <div className="space-y-3">
            {plannedFilings.map((patent) => (
              <PatentCard key={patent.id} patent={patent} onStartDraft={onStartDraft} />
            ))}
          </div>
        </div>
      )}

      {/* Competitor IP Monitoring */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <button
          onClick={() => setShowCompetitors(!showCompetitors)}
          className="w-full flex items-center gap-2"
        >
          <Eye size={14} style={{ color: "#E24D47" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider flex-1 text-left" style={{ color: "var(--foreground)" }}>
            Competitor IP Monitor
          </h3>
          <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
            {competitorFilings.length} filings tracked
          </span>
          {showCompetitors ? <ChevronDown size={14} style={{ color: "var(--muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--muted)" }} />}
        </button>

        {showCompetitors && (
          <div className="mt-4 space-y-2">
            {competitorFilings.map((filing) => (
              <CompetitorCard key={filing.id} filing={filing} />
            ))}

            {/* Weekly scan task */}
            <div
              className="rounded-lg p-3 mt-3 flex items-start gap-2"
              style={{ backgroundColor: "#5A6FFF08", borderLeft: "3px solid #5A6FFF" }}
            >
              <Target size={12} className="shrink-0 mt-0.5" style={{ color: "#5A6FFF" }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#5A6FFF" }}>
                  Weekly Agent Task
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Scan Google Patents for new filings from Oura, Natural Cycles, Ava, Clue, and Flo. Flag anything touching our territory: multi-signal scoring, closed-loop intervention, driver attribution, or pregnancy risk prediction.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
