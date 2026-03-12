"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Clock, CheckCircle, Send, AlertTriangle,
  ChevronRight, Lightbulb, Sparkles, ArrowRight
} from "lucide-react";
import {
  PATENT_DRAFTS, PATENT_OPPORTUNITIES,
  getDraftStats,
  type DraftStatus, type PatentDraftEntry, type PatentOpportunity
} from "@/lib/data/patent-drafts-data";

const ACCENT = "#E24D47";

const STATUS_CONFIG: Record<DraftStatus, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  draft: { label: "Draft", color: "#9686B9", bg: "#9686B914", icon: FileText },
  in_progress: { label: "In Progress", color: "#F59E0B", bg: "#F59E0B14", icon: Clock },
  review_ready: { label: "Review Ready", color: "#5A6FFF", bg: "#5A6FFF14", icon: CheckCircle },
  filed: { label: "Filed", color: "#1EAA55", bg: "#1EAA5514", icon: Send },
  needs_revision: { label: "Needs Revision", color: "#E24D47", bg: "#E24D4714", icon: AlertTriangle },
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#E24D47",
  high: "#F59E0B",
  medium: "#5A6FFF",
  low: "#78C3BF",
};

function DraftCard({ draft }: { draft: PatentDraftEntry }) {
  const router = useRouter();
  const status = STATUS_CONFIG[draft.status];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={() => router.push(`/departments/legal/patent-drafts/${draft.id}`)}
      className="w-full text-left rounded-xl p-5 transition-all duration-150 hover:shadow-md"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              <StatusIcon size={12} />
              {status.label}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${PRIORITY_COLORS[draft.filingPriority]}14`,
                color: PRIORITY_COLORS[draft.filingPriority],
              }}
            >
              {draft.filingPriority}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
            >
              {draft.category.replace("_", " / ")}
            </span>
          </div>

          <h3
            className="font-semibold text-sm mb-1 line-clamp-1"
            style={{ color: "var(--foreground)" }}
          >
            {draft.shortTitle}
          </h3>
          <p
            className="text-xs line-clamp-2 mb-3"
            style={{ color: "var(--muted)" }}
          >
            {draft.title}
          </p>

          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
            <span>{draft.wordCount.toLocaleString()} words</span>
            <span>{draft.sections.length} sections</span>
            <span>Last edited {draft.lastEdited}</span>
          </div>
        </div>

        <ChevronRight size={18} style={{ color: "var(--muted)" }} className="mt-1 flex-shrink-0" />
      </div>
    </button>
  );
}

function OpportunityCard({ opp }: { opp: PatentOpportunity }) {
  const router = useRouter();

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${PRIORITY_COLORS[opp.filingPriority]}14`,
                color: PRIORITY_COLORS[opp.filingPriority],
              }}
            >
              {opp.filingPriority} priority
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
            >
              {opp.category.replace("_", " / ")}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: opp.priorArtRisk === "low" ? "#1EAA5514" : opp.priorArtRisk === "medium" ? "#F59E0B14" : "#E24D4714",
                color: opp.priorArtRisk === "low" ? "#1EAA55" : opp.priorArtRisk === "medium" ? "#F59E0B" : "#E24D47",
              }}
            >
              {opp.priorArtRisk} prior art risk
            </span>
          </div>

          <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>
            {opp.shortTitle}
          </h3>
          <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>
            {opp.description}
          </p>

          <div className="mb-3">
            <p className="text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>Key Claims:</p>
            <ul className="space-y-0.5">
              {opp.keyClaims.slice(0, 3).map((claim, i) => (
                <li key={i} className="text-xs line-clamp-1" style={{ color: "var(--muted)" }}>
                  {i + 1}. {claim}
                </li>
              ))}
              {opp.keyClaims.length > 3 && (
                <li className="text-xs" style={{ color: "var(--muted)" }}>
                  +{opp.keyClaims.length - 3} more claims
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Est. value: ${(opp.estimatedValue / 1000).toFixed(0)}K
            </span>
            <button
              onClick={() => router.push(`/departments/legal/patents`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#5A6FFF", color: "#F9F7F0" }}
            >
              <Sparkles size={12} />
              Start Draft with Joy
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PatentDraftsPage() {
  const [filter, setFilter] = useState<"all" | DraftStatus>("all");
  const stats = getDraftStats();

  const filteredDrafts = filter === "all"
    ? PATENT_DRAFTS
    : PATENT_DRAFTS.filter(d => d.status === filter);

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div
        className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {[
          { label: "Total Drafts", value: stats.total, color: "var(--foreground)" },
          { label: "In Progress", value: stats.inProgress, color: "#F59E0B" },
          { label: "Review Ready", value: stats.reviewReady, color: "#5A6FFF" },
          { label: "Filed", value: stats.filed, color: "#1EAA55" },
          { label: "Total Words", value: stats.totalWords.toLocaleString(), color: "var(--foreground)" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Patent Drafts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={18} style={{ color: ACCENT }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              Patent Applications
            </h2>
          </div>

          <div
            className="flex gap-1 p-1 rounded-lg"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            {[
              { key: "all" as const, label: "All" },
              { key: "draft" as const, label: "Draft" },
              { key: "in_progress" as const, label: "In Progress" },
              { key: "review_ready" as const, label: "Review Ready" },
              { key: "filed" as const, label: "Filed" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={
                  filter === tab.key
                    ? { backgroundColor: "var(--surface)", color: ACCENT, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }
                    : { color: "var(--muted)" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredDrafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
          {filteredDrafts.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
              No drafts with this status
            </p>
          )}
        </div>
      </div>

      {/* Patent Opportunities Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} style={{ color: "#F59E0B" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Patent Opportunities
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#F59E0B14", color: "#F59E0B" }}
          >
            {PATENT_OPPORTUNITIES.length} ideas
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Future patent filings identified by Joy. Click &ldquo;Start Draft&rdquo; to begin working with Joy on a provisional application.
        </p>
        <div className="space-y-3">
          {PATENT_OPPORTUNITIES.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      </div>
    </div>
  );
}
