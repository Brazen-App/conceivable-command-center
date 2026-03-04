"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Star,
  StarOff,
  Archive,
  MessageCircle,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Gem,
  TrendingUp,
  Shield,
  Search,
} from "lucide-react";
import DiscussPanel from "@/components/review/DiscussPanel";
import RejectionModal from "@/components/review/RejectionModal";

// ── Types ───────────────────────────────────────────────────────────

interface PatentClaim {
  id: string;
  claimNumber: number;
  claimText: string;
  parentPatentId: string | null;
  parentPatentRef: string;
  valueTier: "HIGH" | "MEDIUM" | "LOW";
  estimatedValue: number;
  rationale: string;
  status: string;
  priority: boolean;
  archived: boolean;
  category: string | null;
  urgency: string | null;
  priorArtRisk: string | null;
}

type FilterValue = "all" | "HIGH" | "MEDIUM" | "LOW";
type StatusFilter = "all" | "not_drafted" | "drafted" | "filed" | "granted";
type UrgencyFilter = "all" | "file_now" | "monitor" | "exploratory";

// ── Constants ───────────────────────────────────────────────────────

const ACCENT = "#E24D47";

const VALUE_STYLES: Record<string, { color: string; bg: string; icon: string }> = {
  HIGH: { color: "#E24D47", bg: "#E24D4712", icon: "💎" },
  MEDIUM: { color: "#F1C028", bg: "#F1C02812", icon: "⚡" },
  LOW: { color: "#78C3BF", bg: "#78C3BF12", icon: "○" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  not_drafted: { color: "#9686B9", bg: "#9686B912", label: "Not Drafted" },
  drafted: { color: "#F1C028", bg: "#F1C02812", label: "Drafted" },
  filed: { color: "#356FB6", bg: "#356FB612", label: "Filed" },
  granted: { color: "#1EAA55", bg: "#1EAA5512", label: "Granted" },
};

const URGENCY_STYLES: Record<string, { color: string; label: string }> = {
  file_now: { color: "#E24D47", label: "File Now" },
  monitor: { color: "#F1C028", label: "Monitor" },
  exploratory: { color: "#78C3BF", label: "Exploratory" },
};

// ── Component ───────────────────────────────────────────────────────

export default function PatentsPage() {
  const [claims, setClaims] = useState<PatentClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [valueFilter, setValueFilter] = useState<FilterValue>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  // Panels
  const [discussTarget, setDiscussTarget] = useState<PatentClaim | null>(null);
  const [draftTarget, setDraftTarget] = useState<PatentClaim | null>(null);

  // Fetch claims
  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/patent-claims");
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      if (data.length === 0) {
        // Auto-seed if empty
        await fetch("/api/seed", { method: "POST" });
        const retry = await fetch("/api/patent-claims");
        setClaims(await retry.json());
      } else {
        setClaims(data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Actions
  const handleTogglePriority = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/patent-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "toggle_priority" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/patent-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "archive" }),
      });
      if (res.ok) {
        setClaims((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Filter logic
  const filteredClaims = claims.filter((c) => {
    if (valueFilter !== "all" && c.valueTier !== valueFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (urgencyFilter !== "all" && c.urgency !== urgencyFilter) return false;
    if (showPriorityOnly && !c.priority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.claimText.toLowerCase().includes(q) ||
        c.parentPatentRef.toLowerCase().includes(q) ||
        (c.rationale && c.rationale.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort: priority first, then by urgency (file_now > monitor > exploratory), then by value
  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority ? -1 : 1;
    const urgOrder: Record<string, number> = { file_now: 0, monitor: 1, exploratory: 2 };
    const aUrg = urgOrder[a.urgency || "monitor"] ?? 1;
    const bUrg = urgOrder[b.urgency || "monitor"] ?? 1;
    if (aUrg !== bUrg) return aUrg - bUrg;
    const valOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return (valOrder[a.valueTier] ?? 1) - (valOrder[b.valueTier] ?? 1);
  });

  // Portfolio stats
  const totalClaims = claims.length;
  const highValue = claims.filter((c) => c.valueTier === "HIGH").length;
  const medValue = claims.filter((c) => c.valueTier === "MEDIUM").length;
  const lowValue = claims.filter((c) => c.valueTier === "LOW").length;
  const totalEstValue = claims.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);
  const filed = claims.filter((c) => c.status === "filed" || c.status === "granted").length;
  const pending = claims.filter((c) => c.status === "drafted").length;
  const toDraft = claims.filter((c) => c.status === "not_drafted").length;
  const fileNowCount = claims.filter((c) => c.urgency === "file_now").length;

  return (
    <div className="space-y-6">
      {/* Priority Alert */}
      {fileNowCount > 0 && (
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ backgroundColor: "#E24D470A", border: "1px solid #E24D4720" }}
        >
          <AlertTriangle size={24} style={{ color: ACCENT }} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold" style={{ color: ACCENT }}>
              {fileNowCount} claims flagged FILE NOW
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
              Critical patent claims need provisional filing before fundraise begins.
              The Closed-Loop Physiologic Correction patent is the deepest technical moat.
            </p>
            <div className="mt-2">
              <CountdownTimer deadline="2026-03-31" />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Overview Dashboard */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Portfolio Overview
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
          <StatCard
            label="Total Claims"
            value={totalClaims.toString()}
            sub={`High: ${highValue} · Med: ${medValue} · Low: ${lowValue}`}
            icon={<Gem size={16} style={{ color: "#5A6FFF" }} />}
          />
          <StatCard
            label="Est. Portfolio Value"
            value={`$${(totalEstValue / 1000000).toFixed(1)}M`}
            sub={`Across ${totalClaims} individual claims`}
            icon={<TrendingUp size={16} style={{ color: "#1EAA55" }} />}
          />
          <StatCard
            label="Filing Status"
            value={`${filed} Filed`}
            sub={`${pending} Drafted · ${toDraft} To Draft`}
            icon={<Shield size={16} style={{ color: "#356FB6" }} />}
          />
          <StatCard
            label="Urgent Filings"
            value={fileNowCount.toString()}
            sub="Claims needing immediate filing"
            icon={<AlertTriangle size={16} style={{ color: ACCENT }} />}
            accent
          />
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter size={13} style={{ color: "var(--muted)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Filters:</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims..."
              className="pl-7 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30 w-48"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            />
          </div>

          {/* Value filter */}
          <FilterPills
            label="Value"
            options={[
              { id: "all", label: "All" },
              { id: "HIGH", label: "High" },
              { id: "MEDIUM", label: "Med" },
              { id: "LOW", label: "Low" },
            ]}
            value={valueFilter}
            onChange={(v) => setValueFilter(v as FilterValue)}
          />

          {/* Status filter */}
          <FilterPills
            label="Status"
            options={[
              { id: "all", label: "All" },
              { id: "not_drafted", label: "Not Drafted" },
              { id: "drafted", label: "Drafted" },
              { id: "filed", label: "Filed" },
              { id: "granted", label: "Granted" },
            ]}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as StatusFilter)}
          />

          {/* Urgency filter */}
          <FilterPills
            label="Urgency"
            options={[
              { id: "all", label: "All" },
              { id: "file_now", label: "File Now" },
              { id: "monitor", label: "Monitor" },
              { id: "exploratory", label: "Explore" },
            ]}
            value={urgencyFilter}
            onChange={(v) => setUrgencyFilter(v as UrgencyFilter)}
          />

          {/* Priority toggle */}
          <button
            onClick={() => setShowPriorityOnly(!showPriorityOnly)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: showPriorityOnly ? "#F1C02818" : "transparent",
              color: showPriorityOnly ? "#F1C028" : "var(--muted)",
              border: showPriorityOnly ? "1px solid #F1C02830" : "1px solid var(--border)",
            }}
          >
            <Star size={11} />
            Priority
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
        </div>
      )}
      {error && (
        <div
          className="rounded-xl border p-4 text-sm"
          style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4708", color: ACCENT }}
        >
          {error}. <button onClick={fetchClaims} className="underline font-medium">Retry</button>
        </div>
      )}

      {/* Claims Master List */}
      {!loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Showing {sortedClaims.length} of {totalClaims} claims
            </p>
          </div>

          {sortedClaims.length === 0 ? (
            <div
              className="rounded-xl border p-8 text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                No claims match your filters.
              </p>
            </div>
          ) : (
            sortedClaims.map((claim) => {
              const vStyle = VALUE_STYLES[claim.valueTier] || VALUE_STYLES.MEDIUM;
              const sStyle = STATUS_STYLES[claim.status] || STATUS_STYLES.not_drafted;
              const uStyle = claim.urgency ? URGENCY_STYLES[claim.urgency] : null;
              const isExpanded = expandedId === claim.id;
              const isActioning = actionLoading === claim.id;

              return (
                <div
                  key={claim.id}
                  className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                  style={{
                    borderColor: claim.priority ? "#F1C02840" : "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  {/* Priority stripe */}
                  {claim.priority && (
                    <div className="h-0.5" style={{ backgroundColor: "#F1C028" }} />
                  )}

                  {/* Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Claim number */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ backgroundColor: vStyle.bg, color: vStyle.color }}
                      >
                        #{claim.claimNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: vStyle.bg, color: vStyle.color }}
                          >
                            {vStyle.icon} {claim.valueTier}
                          </span>
                          <span
                            className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: sStyle.bg, color: sStyle.color }}
                          >
                            {sStyle.label}
                          </span>
                          {uStyle && (
                            <span
                              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${uStyle.color}12`,
                                color: uStyle.color,
                              }}
                            >
                              {uStyle.label}
                            </span>
                          )}
                          {claim.priority && (
                            <Star size={11} fill="#F1C028" style={{ color: "#F1C028" }} />
                          )}
                          {claim.estimatedValue && (
                            <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                              Est. ${(claim.estimatedValue / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>

                        {/* Claim text */}
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                          {claim.claimText}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                          {claim.parentPatentRef}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                        ) : (
                          <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--border)" }}>
                      {/* Rationale */}
                      <div className="mt-3 mb-4">
                        <p
                          className="text-[10px] font-medium uppercase tracking-wider mb-1"
                          style={{ color: ACCENT }}
                        >
                          Why Pursue This
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {claim.rationale}
                        </p>
                      </div>

                      {/* Meta grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <MetaItem label="Category" value={formatCategory(claim.category)} />
                        <MetaItem label="Prior Art Risk" value={claim.priorArtRisk || "—"} />
                        <MetaItem label="Est. Value" value={claim.estimatedValue ? `$${(claim.estimatedValue / 1000).toFixed(0)}K` : "—"} />
                        <MetaItem label="Parent Patent" value={claim.parentPatentId || "New Filing"} />
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDiscussTarget(claim);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                        >
                          <MessageCircle size={13} />
                          Discuss with Joy
                        </button>

                        {claim.status === "not_drafted" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDraftTarget(claim);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: "#1EAA55" }}
                          >
                            <FileText size={13} />
                            Start Drafting
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePriority(claim.id);
                          }}
                          disabled={isActioning}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
                          style={{
                            backgroundColor: claim.priority ? "#F1C02818" : "var(--background)",
                            color: claim.priority ? "#F1C028" : "var(--muted)",
                            border: `1px solid ${claim.priority ? "#F1C02830" : "var(--border)"}`,
                          }}
                        >
                          {claim.priority ? <StarOff size={13} /> : <Star size={13} />}
                          {claim.priority ? "Unmark Priority" : "Mark Priority"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(claim.id);
                          }}
                          disabled={isActioning}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
                          style={{
                            backgroundColor: "var(--background)",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <Archive size={13} />
                          Archive
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="patent"
        contextId={discussTarget?.id || ""}
        contextTitle={`Claim #${discussTarget?.claimNumber}: ${discussTarget?.claimText?.slice(0, 80) || ""}`}
        contextDetail={
          discussTarget
            ? `Patent claim #${discussTarget.claimNumber}: "${discussTarget.claimText}". Parent: ${discussTarget.parentPatentRef}. Value: ${discussTarget.valueTier}. Rationale: ${discussTarget.rationale}. Status: ${discussTarget.status}. Prior art risk: ${discussTarget.priorArtRisk}. Estimated value: $${discussTarget.estimatedValue?.toLocaleString()}.`
            : undefined
        }
      />

      {/* Draft Panel */}
      {draftTarget && (
        <DraftPanel
          claim={draftTarget}
          onClose={() => setDraftTarget(null)}
          onDraftStarted={() => {
            setClaims((prev) =>
              prev.map((c) =>
                c.id === draftTarget.id ? { ...c, status: "drafted" } : c
              )
            );
            setDraftTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ── Sub-Components ──────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-4" style={{ backgroundColor: "var(--surface)" }}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          {label}
        </span>
      </div>
      <p
        className="text-xl font-bold"
        style={{ color: accent ? ACCENT : "var(--foreground)" }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
        {sub}
      </p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p className="text-xs font-medium capitalize" style={{ color: "var(--foreground)" }}>
        {value}
      </p>
    </div>
  );
}

function FilterPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 border rounded-lg px-1.5 py-0.5" style={{ borderColor: "var(--border)" }}>
      <span className="text-[9px] font-medium px-1" style={{ color: "var(--muted)" }}>
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className="px-2 py-1 rounded text-[10px] font-medium transition-colors"
          style={{
            backgroundColor: value === opt.id ? "#5A6FFF14" : "transparent",
            color: value === opt.id ? "#5A6FFF" : "var(--muted)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
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
      <Clock size={12} style={{ color: isUrgent ? ACCENT : "#F1C028" }} />
      <span className="text-xs font-bold" style={{ color: isUrgent ? ACCENT : "#F1C028" }}>
        {days} days remaining
      </span>
    </div>
  );
}

function formatCategory(cat: string | null): string {
  if (!cat) return "—";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Draft Panel ─────────────────────────────────────────────────────

function DraftPanel({
  claim,
  onClose,
  onDraftStarted,
}: {
  claim: PatentClaim;
  onClose: () => void;
  onDraftStarted: () => void;
}) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

  // Auto-start drafting conversation
  useEffect(() => {
    startDrafting();
  }, []);

  const startDrafting = async () => {
    setLoading(true);
    try {
      const prompt = `I need you to create a provisional patent draft outline for the following claim:

Claim #${claim.claimNumber}: "${claim.claimText}"

Parent Patent: ${claim.parentPatentRef}
Value Tier: ${claim.valueTier}
Rationale: ${claim.rationale}

Please generate a structured provisional patent outline with these sections:
1. TITLE OF INVENTION
2. FIELD OF THE INVENTION
3. BACKGROUND (prior art and problem being solved)
4. SUMMARY OF THE INVENTION
5. DETAILED DESCRIPTION (key technical details)
6. CLAIMS (draft 3-5 independent claims and 2-3 dependent claims)
7. ABSTRACT

Keep it concise but technically thorough. Focus on what makes this claim novel and defensible.`;

      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: "legal", message: prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([
          { role: "user", content: `Generate draft outline for Claim #${claim.claimNumber}` },
          { role: "assistant", content: data.response },
        ]);
        setDraftGenerated(true);

        // Update claim status
        await fetch("/api/patent-claims", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: claim.id, action: "update_status", status: "drafted" }),
        });
      }
    } catch {
      setMessages([
        { role: "assistant", content: "Failed to generate draft. Please check API key and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-2xl z-50 border-l shadow-2xl flex flex-col"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Draft Patent Outline
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Claim #{claim.claimNumber}: {claim.claimText.slice(0, 60)}...
            </p>
          </div>
          <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin mb-3" style={{ color: "#5A6FFF" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Joy is drafting the patent outline...
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              {msg.role === "assistant" && (
                <div
                  className="rounded-xl border p-5 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {draftGenerated && (
          <div className="flex items-center gap-3 px-5 py-4 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => {
                const text = messages.find((m) => m.role === "assistant")?.content || "";
                navigator.clipboard.writeText(text);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              Copy Draft
            </button>
            <button
              onClick={onDraftStarted}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: "#1EAA55" }}
            >
              <CheckCircle2 size={13} />
              Approve Outline & Add to Tasks
            </button>
          </div>
        )}
      </div>
    </>
  );
}
