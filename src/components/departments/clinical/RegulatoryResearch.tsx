"use client";

import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Link2,
  FlaskConical,
  Target,
} from "lucide-react";
import type { RegulatoryEvidence } from "@/lib/data/clinical-data";

const ACCENT = "#78C3BF";

interface Props {
  regulatoryEvidence: RegulatoryEvidence[];
}

const STATUS_CONFIG = {
  substantiated: {
    Icon: CheckCircle2,
    color: "#1EAA55",
    bg: "#1EAA5514",
    label: "Substantiated",
  },
  partial: {
    Icon: AlertTriangle,
    color: "#F1C028",
    bg: "#F1C02814",
    label: "Partially Substantiated",
  },
  unsubstantiated: {
    Icon: Circle,
    color: "#E24D47",
    bg: "#E24D4714",
    label: "Unsubstantiated",
  },
};

const PRIORITY_CONFIG = {
  critical: { color: "#E24D47", label: "Critical Priority" },
  high: { color: "#F1C028", label: "High Priority" },
  medium: { color: ACCENT, label: "Medium Priority" },
  low: { color: "var(--muted)", label: "Low Priority" },
};

const CLAIM_TYPE_LABELS: Record<string, string> = {
  efficacy: "Efficacy Claim",
  mechanism: "Mechanism Claim",
  safety: "Safety Claim",
  comparison: "Comparative Claim",
};

export default function RegulatoryResearch({
  regulatoryEvidence,
}: Props) {
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);

  const substantiated = regulatoryEvidence.filter(
    (e) => e.currentStatus === "substantiated"
  ).length;
  const partial = regulatoryEvidence.filter(
    (e) => e.currentStatus === "partial"
  ).length;
  const unsubstantiated = regulatoryEvidence.filter(
    (e) => e.currentStatus === "unsubstantiated"
  ).length;
  const criticalGaps = regulatoryEvidence.filter(
    (e) => e.studyPriority === "critical"
  ).length;

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 100%)`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield className="text-white" size={22} strokeWidth={2} />
          <div>
            <p className="text-white font-semibold text-sm">
              Regulatory Evidence Map — What We Can Legally Say
            </p>
            <p className="text-white/60 text-xs">
              Mapping clinical evidence to marketing claims &middot;
              Cross-linked with Legal
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Substantiated
            </p>
            <p className="text-white text-xl font-bold">{substantiated}</p>
            <p className="text-white/40 text-[9px]">Safe to use</p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Partial
            </p>
            <p className="text-white text-xl font-bold">{partial}</p>
            <p className="text-white/40 text-[9px]">Use with qualifiers</p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Unsubstantiated
            </p>
            <p className="text-white text-xl font-bold">{unsubstantiated}</p>
            <p className="text-white/40 text-[9px]">Do NOT use</p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Critical Gaps
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: criticalGaps > 0 ? "#E24D47" : "#1EAA55" }}
            >
              {criticalGaps}
            </p>
            <p className="text-white/40 text-[9px]">Need studies ASAP</p>
          </div>
        </div>
      </div>

      {/* Evidence Status Legend */}
      <div className="flex items-center gap-4 mb-4 px-1">
        {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
          <div key={key} className="flex items-center gap-1.5">
            <conf.Icon size={12} style={{ color: conf.color }} />
            <span className="text-[10px]" style={{ color: conf.color }}>
              {conf.label}
            </span>
          </div>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-3 mb-8">
        {regulatoryEvidence.map((evidence) => {
          const isExpanded = expandedClaim === evidence.id;
          const status = STATUS_CONFIG[evidence.currentStatus];
          const priority = PRIORITY_CONFIG[evidence.studyPriority];

          return (
            <div
              key={evidence.id}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: isExpanded ? status.color : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <button
                onClick={() =>
                  setExpandedClaim(isExpanded ? null : evidence.id)
                }
                className="w-full text-left p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: status.bg }}
                  >
                    <status.Icon size={16} style={{ color: status.color }} />
                  </div>
                  <div className="flex-1 mr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${status.color}14`,
                          color: status.color,
                        }}
                      >
                        {CLAIM_TYPE_LABELS[evidence.claimType]}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${priority.color}14`,
                          color: priority.color,
                        }}
                      >
                        {priority.label}
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      &ldquo;{evidence.claim}&rdquo;
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronDown
                      size={14}
                      style={{ color: "var(--muted)" }}
                    />
                  ) : (
                    <ChevronRight
                      size={14}
                      style={{ color: "var(--muted)" }}
                    />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div
                  className="px-4 pb-4 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="pt-3 space-y-3">
                    {/* Supporting Studies */}
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: "#1EAA55" }}
                      >
                        Supporting Evidence
                      </p>
                      {evidence.supportingStudies.length > 0 ? (
                        <div className="space-y-1">
                          {evidence.supportingStudies.map((study, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-1.5"
                            >
                              <CheckCircle2
                                size={10}
                                className="shrink-0 mt-0.5"
                                style={{ color: "#1EAA55" }}
                              />
                              <p
                                className="text-xs"
                                style={{ color: "var(--foreground)" }}
                              >
                                {study}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p
                          className="text-xs italic"
                          style={{ color: "#E24D47" }}
                        >
                          No supporting evidence yet
                        </p>
                      )}
                    </div>

                    {/* Evidence Gap */}
                    <div>
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: "#E24D47" }}
                      >
                        Evidence Gap
                      </p>
                      <div
                        className="rounded-lg p-2.5"
                        style={{
                          backgroundColor: "#E24D4708",
                          borderLeft: "3px solid #E24D47",
                        }}
                      >
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--foreground)" }}
                        >
                          {evidence.evidenceGap}
                        </p>
                      </div>
                    </div>

                    {/* Cross-Department Link */}
                    {evidence.linkedLegalClaimId && (
                      <div className="flex items-center gap-2">
                        <Link2 size={10} style={{ color: "#9686B9" }} />
                        <span
                          className="text-[10px]"
                          style={{ color: "#9686B9" }}
                        >
                          Linked to Legal claim:{" "}
                          {evidence.linkedLegalClaimId}
                        </span>
                        <ArrowUpRight size={10} style={{ color: "#9686B9" }} />
                      </div>
                    )}

                    {/* Action recommendation */}
                    <div
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: `${ACCENT}08`,
                        borderLeft: `3px solid ${ACCENT}`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <FlaskConical size={10} style={{ color: ACCENT }} />
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: ACCENT }}
                        >
                          Recommended Action
                        </span>
                      </div>
                      <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "var(--foreground)" }}
                      >
                        {evidence.currentStatus === "substantiated"
                          ? "This claim is supported. Continue using in marketing materials."
                          : evidence.currentStatus === "partial"
                          ? `Qualify this claim with "pilot study" or "preliminary data" language. Prioritize study to achieve full substantiation.`
                          : "Do NOT use this claim in any marketing material. Initiate study to build evidence base."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Insight */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Target size={14} style={{ color: ACCENT }} />
          </div>
          <div>
            <p
              className="text-xs font-bold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Regulatory Strategy Summary
            </p>
            <p
              className="text-[11px] leading-relaxed mb-2"
              style={{ color: "var(--muted)" }}
            >
              {substantiated} of {regulatoryEvidence.length} claims are fully
              substantiated. {criticalGaps > 0
                ? `${criticalGaps} critical evidence gap${
                    criticalGaps > 1 ? "s" : ""
                  } require${criticalGaps === 1 ? "s" : ""} immediate study initiation.`
                : "No critical gaps — focus on strengthening partial claims."}{" "}
              Every study completed moves claims from yellow to green and
              expands what we can legally say in fundraising and marketing.
            </p>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight size={10} style={{ color: ACCENT }} />
              <span
                className="text-[10px] font-medium"
                style={{ color: ACCENT }}
              >
                Cross-links: Legal (approved claims) &rarr; Fundraising (investor decks) &rarr; Content (marketing copy)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
