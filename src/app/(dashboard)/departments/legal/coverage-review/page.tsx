"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PATENT_COVERAGE_REVIEW,
  RECOMMENDED_NEW_PATENTS,
  PATENT_REVIEW_SUMMARY,
  EXISTING_PATENTS,
} from "@/lib/data/patent-coverage-review";

const ACCENT = "#E24D47";

const STATUS_COLORS = {
  covered: { bg: "#1EAA5514", text: "#1EAA55", label: "Covered" },
  partial: { bg: "#F59E0B14", text: "#F59E0B", label: "Partial" },
  gap: { bg: "#E24D4714", text: "#E24D47", label: "Gap" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "#E24D4714", text: "#E24D47" },
  High: { bg: "#F59E0B14", text: "#F59E0B" },
  Medium: { bg: "#5A6FFF14", text: "#5A6FFF" },
  Low: { bg: "#88888814", text: "#888" },
};

export default function CoverageReviewPage() {
  const [filter, setFilter] = useState<"all" | "covered" | "partial" | "gap">("all");
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null);
  const [showRecommended, setShowRecommended] = useState(true);

  const filtered = filter === "all"
    ? PATENT_COVERAGE_REVIEW
    : PATENT_COVERAGE_REVIEW.filter((e) => e.gapStatus === filter);

  const experiences = [...new Set(PATENT_COVERAGE_REVIEW.map((e) => e.experience))];

  const summary = PATENT_REVIEW_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: `3px solid ${ACCENT}`,
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <Shield size={18} className="mt-0.5" style={{ color: ACCENT }} />
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              Patent Coverage Review — All Experiences
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Retroactive IP scan across {summary.totalFeatures} features in 5 experiences. Last reviewed: {summary.lastReviewDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total Features", value: summary.totalFeatures, color: "#5A6FFF" },
            { label: "Covered", value: summary.covered, color: "#1EAA55" },
            { label: "Partial", value: summary.partial, color: "#F59E0B" },
            { label: "Gaps", value: summary.gaps, color: "#E24D47" },
            { label: "Recommended New", value: summary.recommendedNew, color: "#9686B9" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: `${stat.color}08` }}
            >
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: stat.color }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
          <p className="text-xs" style={{ color: "#E24D47" }}>
            <strong>Action Required:</strong> {summary.reviewNote}
          </p>
        </div>
      </div>

      {/* Existing Patents Overview */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--foreground)" }}>
          Existing Patent Portfolio ({EXISTING_PATENTS.length} Patents)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {EXISTING_PATENTS.map((p) => (
            <Link
              key={p.id}
              href={`/departments/legal/patent-drafts/${p.id}`}
              className="rounded-lg p-2 text-center hover:shadow-sm transition-all"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold" style={{ color: ACCENT }}>{p.number}</p>
              <p className="text-[9px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>{p.name}</p>
              <p className="text-[8px] mt-0.5" style={{ color: "var(--muted)" }}>{p.experience}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(["all", "covered", "partial", "gap"] as const).map((f) => {
          const active = filter === f;
          const sc = f === "all" ? { bg: "#5A6FFF14", text: "#5A6FFF" } : STATUS_COLORS[f];
          const count = f === "all"
            ? PATENT_COVERAGE_REVIEW.length
            : PATENT_COVERAGE_REVIEW.filter((e) => e.gapStatus === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? sc.bg : "var(--background)",
                color: active ? sc.text : "var(--muted)",
                border: `1px solid ${active ? sc.text + "40" : "var(--border)"}`,
              }}
            >
              {f === "all" ? "All" : f === "covered" ? "Covered" : f === "partial" ? "Partial" : "Gaps"}
              <span className="text-[9px] font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Coverage by Experience */}
      {experiences.map((exp) => {
        const expEntries = filtered.filter((e) => e.experience === exp);
        if (expEntries.length === 0) return null;
        const expColor = expEntries[0].experienceColor;
        const isOpen = expandedExperience === exp || expandedExperience === null;

        return (
          <div
            key={exp}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setExpandedExperience(expandedExperience === exp ? null : exp)}
              className="w-full flex items-center gap-3 p-4 hover:opacity-90 transition-all"
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expColor }} />
              <h3 className="text-sm font-bold flex-1 text-left" style={{ color: "var(--foreground)" }}>
                {exp}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
                  {expEntries.filter((e) => e.gapStatus === "covered").length} covered
                </span>
                {expEntries.filter((e) => e.gapStatus === "gap").length > 0 && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}>
                    {expEntries.filter((e) => e.gapStatus === "gap").length} gaps
                  </span>
                )}
                {isOpen ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-2">
                {expEntries.map((entry) => {
                  const sc = STATUS_COLORS[entry.gapStatus];
                  return (
                    <div
                      key={`${entry.experience}-${entry.feature}`}
                      className="rounded-lg p-3"
                      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                              {entry.feature}
                            </p>
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: sc.bg, color: sc.text }}
                            >
                              {sc.label}
                            </span>
                            {entry.priority && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: PRIORITY_COLORS[entry.priority].bg, color: PRIORITY_COLORS[entry.priority].text }}
                              >
                                {entry.priority}
                              </span>
                            )}
                          </div>

                          {entry.coveredBy.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {entry.coveredBy.map((p) => (
                                <Link
                                  key={p.id}
                                  href={`/departments/legal/patent-drafts/${p.id}`}
                                  className="text-[10px] px-2 py-0.5 rounded-md font-medium hover:shadow-sm"
                                  style={{ backgroundColor: "#1EAA5510", color: "#1EAA55", border: "1px solid #1EAA5520" }}
                                >
                                  {p.number} — {p.name}
                                </Link>
                              ))}
                            </div>
                          )}

                          {entry.recommendation && (
                            <p className="text-[10px] mt-1.5" style={{ color: entry.gapStatus === "gap" ? "#E24D47" : "#F59E0B" }}>
                              <strong>Recommendation:</strong> {entry.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Recommended New Patents */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: `2px solid ${ACCENT}30` }}
      >
        <button
          onClick={() => setShowRecommended(!showRecommended)}
          className="w-full flex items-center gap-3 p-5 hover:opacity-90 transition-all"
        >
          <AlertTriangle size={16} style={{ color: ACCENT }} />
          <h3 className="text-sm font-bold flex-1 text-left" style={{ color: "var(--foreground)" }}>
            Recommended New Patent Filings ({RECOMMENDED_NEW_PATENTS.length})
          </h3>
          {showRecommended ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
        </button>

        {showRecommended && (
          <div className="px-5 pb-5 space-y-3">
            {RECOMMENDED_NEW_PATENTS.map((patent) => {
              const pc = PRIORITY_COLORS[patent.priority];
              return (
                <div
                  key={patent.number}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--background)", border: patent.priority === "Critical" ? `1px solid #E24D4740` : "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold" style={{ color: ACCENT }}>
                      Patent {patent.number}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {patent.name}
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-auto"
                      style={{ backgroundColor: pc.bg, color: pc.text }}
                    >
                      {patent.priority}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {patent.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patent.coversFeatures.map((f) => (
                      <span
                        key={f}
                        className="text-[9px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--muted)" }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px]" style={{ color: "#5A6FFF" }}>
                      <strong>Experience:</strong> {patent.experience}
                    </span>
                    <span className="text-[10px]" style={{ color: "#1EAA55" }}>
                      <strong>Defensibility:</strong> {patent.defensibility}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Items */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4730" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#E24D47" }}>
          Immediate Action Items for Kirsten
        </h3>
        <div className="space-y-2">
          {[
            { action: "Review and approve Patent 021 (AI Minor Safety) filing — Critical priority, first-mover advantage", priority: "Critical" },
            { action: "Review Patents 022-023 (Education System + Parent Bridge) — High priority, unique to our approach", priority: "High" },
            { action: "Review Patent 024 (Lactation Intelligence) — High priority, growing market", priority: "High" },
            { action: "Evaluate Patent 025 (Voice-First Input) — Medium priority, useful defensive IP", priority: "Medium" },
            { action: "Schedule IP strategy session to discuss coverage gaps and filing timeline", priority: "High" },
          ].map((item) => {
            const pc = PRIORITY_COLORS[item.priority];
            return (
              <div
                key={item.action}
                className="flex items-start gap-2 p-2 rounded-lg"
                style={{ backgroundColor: "var(--background)" }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: pc.bg, color: pc.text }}
                >
                  {item.priority}
                </span>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>{item.action}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
