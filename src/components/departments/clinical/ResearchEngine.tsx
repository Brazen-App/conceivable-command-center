"use client";

import { useState } from "react";
import {
  Search,
  FlaskConical,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Clock,
  Users,
  Target,
  AlertTriangle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import type {
  StudyOpportunity,
  ResearchFeedItem,
  PublicationStage,
} from "@/lib/data/clinical-data";
import { PUBLICATION_STAGES } from "@/lib/data/clinical-data";

const ACCENT = "#78C3BF";

interface Props {
  studyOpportunities: StudyOpportunity[];
  researchFeed: ResearchFeedItem[];
}

function StageBadge({ stage }: { stage: PublicationStage }) {
  const config = PUBLICATION_STAGES.find((s) => s.key === stage);
  if (!config) return null;
  return (
    <span
      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${config.color}18`, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function DataStrengthIndicator({ strength }: { strength: "strong" | "moderate" | "limited" }) {
  const config = {
    strong: { dots: 3, color: "#1EAA55", label: "Strong Data" },
    moderate: { dots: 2, color: "#F1C028", label: "Moderate Data" },
    limited: { dots: 1, color: "#E24D47", label: "Limited Data" },
  }[strength];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3].map((d) => (
          <div
            key={d}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: d <= config.dots ? config.color : "var(--border)",
            }}
          />
        ))}
      </div>
      <span className="text-[9px]" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

function PublishingPipeline({ studies }: { studies: StudyOpportunity[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={14} style={{ color: ACCENT }} />
        <h3
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--foreground)" }}
        >
          Publishing Pipeline
        </h3>
      </div>

      {/* Pipeline visualization */}
      <div
        className="rounded-xl border p-4 overflow-x-auto"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex gap-1 mb-4 min-w-[600px]">
          {PUBLICATION_STAGES.map((stage) => {
            const count = studies.filter((s) => s.stage === stage.key).length;
            return (
              <div key={stage.key} className="flex-1 text-center">
                <div
                  className="h-6 rounded flex items-center justify-center text-[9px] font-bold"
                  style={{
                    backgroundColor: count > 0 ? `${stage.color}20` : "var(--border)",
                    color: count > 0 ? stage.color : "var(--muted-light)",
                    border: count > 0 ? `1px solid ${stage.color}40` : "1px solid transparent",
                  }}
                >
                  {count > 0 ? count : "—"}
                </div>
                <p
                  className="text-[8px] mt-1 leading-tight"
                  style={{ color: count > 0 ? "var(--foreground)" : "var(--muted-light)" }}
                >
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Pipeline flow arrows */}
        <div className="flex items-center gap-1 min-w-[600px]">
          {PUBLICATION_STAGES.map((stage, i) => (
            <div key={stage.key} className="flex-1 flex items-center">
              <div
                className="flex-1 h-0.5"
                style={{
                  background: `linear-gradient(90deg, ${
                    i === 0 ? "transparent" : PUBLICATION_STAGES[i - 1].color
                  }, ${stage.color})`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResearchEngine({
  studyOpportunities,
  researchFeed,
}: Props) {
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<string>("all");

  const sortedStudies = [...studyOpportunities].sort(
    (a, b) => b.impactScore - a.impactScore
  );

  const uniqueFactors = [
    "all",
    ...new Set(researchFeed.flatMap((r) => r.relevantFactors)),
  ];
  const filteredFeed =
    feedFilter === "all"
      ? researchFeed
      : researchFeed.filter((r) => r.relevantFactors.includes(feedFilter));

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
          <FlaskConical className="text-white" size={22} strokeWidth={2} />
          <div>
            <p className="text-white font-semibold text-sm">
              Research Engine — From Hypothesis to Publication
            </p>
            <p className="text-white/60 text-xs">
              Turning 240K data points into peer-reviewed science
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Active Studies
            </p>
            <p className="text-white text-xl font-bold">
              {studyOpportunities.length}
            </p>
            <p className="text-white/40 text-[9px]">In pipeline</p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Patent-Relevant
            </p>
            <p className="text-white text-xl font-bold">
              {studyOpportunities.filter((s) => s.patentRelevance).length}
            </p>
            <p className="text-white/40 text-[9px]">
              Support IP claims
            </p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[9px] uppercase tracking-wider">
              Avg Impact
            </p>
            <p className="text-white text-xl font-bold">
              {(
                studyOpportunities.reduce((s, o) => s + o.impactScore, 0) /
                studyOpportunities.length
              ).toFixed(1)}
              /10
            </p>
            <p className="text-white/40 text-[9px]">Strategic value</p>
          </div>
        </div>
      </div>

      {/* Publishing Pipeline */}
      <PublishingPipeline studies={studyOpportunities} />

      {/* Study Opportunities */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: ACCENT }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Study Opportunities — Ranked by Impact
          </h3>
        </div>

        <div className="space-y-3">
          {sortedStudies.map((study) => {
            const isExpanded = expandedStudy === study.id;
            return (
              <div
                key={study.id}
                className="rounded-xl border overflow-hidden"
                style={{
                  borderColor: isExpanded ? ACCENT : "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <button
                  onClick={() =>
                    setExpandedStudy(isExpanded ? null : study.id)
                  }
                  className="w-full text-left p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <StageBadge stage={study.stage} />
                        {study.patentRelevance && (
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "#9686B914",
                              color: "#9686B9",
                            }}
                          >
                            Patent-Relevant
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {study.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor:
                            study.impactScore >= 9
                              ? "#E24D4714"
                              : study.impactScore >= 7
                              ? "#F1C02814"
                              : `${ACCENT}14`,
                          color:
                            study.impactScore >= 9
                              ? "#E24D47"
                              : study.impactScore >= 7
                              ? "#F1C028"
                              : ACCENT,
                        }}
                      >
                        <span className="text-sm font-bold">
                          {study.impactScore}
                        </span>
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
                  </div>

                  <div className="flex items-center gap-4">
                    <DataStrengthIndicator strength={study.dataStrength} />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--muted)" }}
                    >
                      <Target size={9} className="inline mr-1" />
                      {study.targetJournal}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div
                    className="px-4 pb-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="pt-3 space-y-3">
                      {/* Gap Description */}
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider mb-1"
                          style={{ color: ACCENT }}
                        >
                          Literature Gap
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--foreground)" }}
                        >
                          {study.gapDescription}
                        </p>
                      </div>

                      {/* Protocol */}
                      {study.protocol && (
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider mb-1"
                            style={{ color: "#9686B9" }}
                          >
                            Study Design
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--foreground)" }}
                          >
                            {study.protocol}
                          </p>
                        </div>
                      )}

                      {/* Study Details */}
                      <div className="grid grid-cols-3 gap-3">
                        <div
                          className="rounded-lg p-2.5"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Users
                              size={10}
                              style={{ color: "var(--muted)" }}
                            />
                            <span
                              className="text-[9px]"
                              style={{ color: "var(--muted)" }}
                            >
                              Sample Size
                            </span>
                          </div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            N={study.estimatedSampleSize}
                          </p>
                        </div>
                        <div
                          className="rounded-lg p-2.5"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock
                              size={10}
                              style={{ color: "var(--muted)" }}
                            />
                            <span
                              className="text-[9px]"
                              style={{ color: "var(--muted)" }}
                            >
                              Timeline
                            </span>
                          </div>
                          <p
                            className="text-sm font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            {study.timelineMonths}mo
                          </p>
                        </div>
                        <div
                          className="rounded-lg p-2.5"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Search
                              size={10}
                              style={{ color: "var(--muted)" }}
                            />
                            <span
                              className="text-[9px]"
                              style={{ color: "var(--muted)" }}
                            >
                              Factor
                            </span>
                          </div>
                          <p
                            className="text-xs font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            {study.factor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Research Feed */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} style={{ color: ACCENT }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider flex-1"
            style={{ color: "var(--foreground)" }}
          >
            New Research Feed
          </h3>
          <div className="flex gap-1">
            {uniqueFactors.map((f) => (
              <button
                key={f}
                onClick={() => setFeedFilter(f)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors"
                style={{
                  backgroundColor:
                    feedFilter === f ? ACCENT : "var(--background)",
                  color: feedFilter === f ? "white" : "var(--muted)",
                  border: `1px solid ${
                    feedFilter === f ? ACCENT : "var(--border)"
                  }`,
                }}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFeed.map((item) => (
            <div
              key={item.id}
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
                  <BookOpen size={14} style={{ color: ACCENT }} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-[10px] mb-2"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.authors} &middot; <em>{item.journal}</em> &middot;{" "}
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className="text-xs leading-relaxed mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.summary}
                  </p>
                  <div
                    className="rounded-lg p-2.5"
                    style={{
                      backgroundColor: `${ACCENT}08`,
                      borderLeft: `3px solid ${ACCENT}`,
                    }}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <ArrowUpRight size={10} style={{ color: ACCENT }} />
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: ACCENT }}
                      >
                        Implication for Conceivable
                      </span>
                    </div>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ color: "var(--foreground)" }}
                    >
                      {item.implication}
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {item.relevantFactors.map((f) => (
                      <span
                        key={f}
                        className="text-[9px] px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${ACCENT}14`,
                          color: ACCENT,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
