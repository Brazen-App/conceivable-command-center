"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
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
  ShieldCheck,
  FilePlus2,
  ArrowUpRight,
} from "lucide-react";
import DiscussPanel from "@/components/review/DiscussPanel";

// ── Types ───────────────────────────────────────────────────────────

interface PatentClaim {
  id: string;
  claimNumber: number;
  claimText: string;
  claimType: string;
  dependsOn: number | null;
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
  followOnNote: string | null;
}

// ── Constants ───────────────────────────────────────────────────────

const VALUE_STYLES: Record<string, { color: string; bg: string }> = {
  HIGH: { color: "#E24D47", bg: "#E24D4712" },
  MEDIUM: { color: "#F1C028", bg: "#F1C02812" },
  LOW: { color: "#78C3BF", bg: "#78C3BF12" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  not_drafted: { color: "#9686B9", bg: "#9686B912", label: "Not Drafted" },
  drafted: { color: "#F1C028", bg: "#F1C02812", label: "Drafted" },
  filed: { color: "#356FB6", bg: "#356FB612", label: "Filed / Pending" },
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
  const [activeView, setActiveView] = useState<"overview" | "protected" | "to-file">("overview");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [discussTarget, setDiscussTarget] = useState<PatentClaim | null>(null);
  const [draftTarget, setDraftTarget] = useState<PatentClaim | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/patent-claims");
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      if (data.length === 0) {
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

  // Separate claims
  const protectedClaims = claims.filter((c) => c.status === "granted" || c.status === "filed");
  const claimsToFile = claims.filter((c) => c.status === "not_drafted" || c.status === "drafted");
  const grantedClaims = protectedClaims.filter((c) => c.status === "granted");
  const filedClaims = protectedClaims.filter((c) => c.status === "filed");
  const fileNowClaims = claimsToFile.filter((c) => c.urgency === "file_now");

  // Values
  const grantedValue = grantedClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const filedValue = filedClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const newValue = claimsToFile.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const totalValue = grantedValue + filedValue + newValue;

  // Claims with follow-on notes
  const needsExpansion = protectedClaims.filter((c) => c.followOnNote);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4708", color: "#E24D47" }}
      >
        {error}. <button onClick={fetchClaims} className="underline font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Alert */}
      {fileNowClaims.length > 0 && (
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ backgroundColor: "#E24D470A", border: "1px solid #E24D4720" }}
        >
          <AlertTriangle size={24} style={{ color: "#E24D47" }} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold" style={{ color: "#E24D47" }}>
              {fileNowClaims.length} claims flagged FILE NOW
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
              Critical patent claims need provisional filing before fundraise.
              The Closed-Loop Physiologic Correction patent is the deepest technical moat.
            </p>
          </div>
        </div>
      )}

      {/* Portfolio Value Overview */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            IP Portfolio Summary
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: "var(--border)" }}>
          <StatCard
            label="Protected Claims"
            value={protectedClaims.length.toString()}
            sub={`${grantedClaims.length} granted · ${filedClaims.length} filed`}
            icon={<ShieldCheck size={16} style={{ color: "#1EAA55" }} />}
          />
          <StatCard
            label="Protected Value"
            value={`$${((grantedValue + filedValue) / 1000000).toFixed(1)}M`}
            sub={`Granted: $${(grantedValue / 1000000).toFixed(1)}M · Filed: $${(filedValue / 1000000).toFixed(1)}M`}
            icon={<Shield size={16} style={{ color: "#356FB6" }} />}
          />
          <StatCard
            label="Potential New Claims"
            value={claimsToFile.length.toString()}
            sub={`${fileNowClaims.length} urgent · Est. $${(newValue / 1000000).toFixed(1)}M`}
            icon={<FilePlus2 size={16} style={{ color: "#F1C028" }} />}
          />
          <StatCard
            label="Total If All Awarded"
            value={`$${(totalValue / 1000000).toFixed(1)}M`}
            sub={`${claims.length} total claims across portfolio`}
            icon={<TrendingUp size={16} style={{ color: "#1EAA55" }} />}
            accent
          />
        </div>
      </div>

      {/* Two Big Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveView(activeView === "protected" ? "overview" : "protected")}
          className="rounded-2xl border p-6 text-left transition-all hover:shadow-md"
          style={{
            borderColor: activeView === "protected" ? "#1EAA5540" : "var(--border)",
            backgroundColor: activeView === "protected" ? "#1EAA5508" : "var(--surface)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#1EAA5514" }}
            >
              <ShieldCheck size={20} style={{ color: "#1EAA55" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Protected Claims
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {grantedClaims.length} granted · {filedClaims.length} pending
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            All claims from your 2 patents — US10467382B2 (granted, 26 claims) and the Conceivable Score filing (pending, 5 claims).
            {needsExpansion.length > 0 && (
              <span style={{ color: "#F1C028" }}> {needsExpansion.length} claims flagged for follow-on patents.</span>
            )}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: "#1EAA55" }}>
            {activeView === "protected" ? "Hide" : "View all"} <ChevronDown size={12} />
          </div>
        </button>

        <button
          onClick={() => setActiveView(activeView === "to-file" ? "overview" : "to-file")}
          className="rounded-2xl border p-6 text-left transition-all hover:shadow-md"
          style={{
            borderColor: activeView === "to-file" ? "#5A6FFF40" : "var(--border)",
            backgroundColor: activeView === "to-file" ? "#5A6FFF08" : "var(--surface)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#5A6FFF14" }}
            >
              <FilePlus2 size={20} style={{ color: "#5A6FFF" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Claims to File
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {claimsToFile.length} recommended · {fileNowClaims.length} urgent
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            New patent filings recommended based on your product roadmap: Closed-Loop System, Pregnancy Risk Prediction, Supplement Protocol Engine, and more.
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: "#5A6FFF" }}>
            {activeView === "to-file" ? "Hide" : "View all"} <ChevronDown size={12} />
          </div>
        </button>
      </div>

      {/* Claims List — only shown when a section is active */}
      {activeView === "protected" && (
        <ClaimsList
          title="Protected Claims"
          subtitle="Your granted and filed patent claims"
          claims={protectedClaims}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          actionLoading={actionLoading}
          onTogglePriority={handleTogglePriority}
          onArchive={handleArchive}
          onDiscuss={setDiscussTarget}
          onDraft={setDraftTarget}
          showFollowOn
        />
      )}

      {activeView === "to-file" && (
        <ClaimsList
          title="Claims to File"
          subtitle="Recommended new patent filings"
          claims={claimsToFile}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          actionLoading={actionLoading}
          onTogglePriority={handleTogglePriority}
          onArchive={handleArchive}
          onDiscuss={setDiscussTarget}
          onDraft={setDraftTarget}
        />
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

// ── Claims List Component ───────────────────────────────────────────

function ClaimsList({
  title,
  subtitle,
  claims,
  expandedId,
  setExpandedId,
  actionLoading,
  onTogglePriority,
  onArchive,
  onDiscuss,
  onDraft,
  showFollowOn,
}: {
  title: string;
  subtitle: string;
  claims: PatentClaim[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  actionLoading: string | null;
  onTogglePriority: (id: string) => void;
  onArchive: (id: string) => void;
  onDiscuss: (claim: PatentClaim) => void;
  onDraft: (claim: PatentClaim) => void;
  showFollowOn?: boolean;
}) {
  // Group by parent patent
  const groups = new Map<string, PatentClaim[]>();
  for (const claim of claims) {
    const key = claim.parentPatentRef || "Uncategorized";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(claim);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{title}</h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>{subtitle}</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
          {claims.length} claims
        </span>
      </div>

      {Array.from(groups.entries()).map(([patentRef, groupClaims]) => {
        const groupValue = groupClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
        const independentCount = groupClaims.filter((c) => c.claimType === "independent").length;
        const dependentCount = groupClaims.filter((c) => c.claimType === "dependent").length;

        return (
          <div
            key={patentRef}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            {/* Patent group header */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                    {patentRef}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {groupClaims.length} claims ({independentCount} independent, {dependentCount} dependent) · Est. ${(groupValue / 1000).toFixed(0)}K
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: STATUS_STYLES[groupClaims[0]?.status]?.bg || "#9686B912",
                    color: STATUS_STYLES[groupClaims[0]?.status]?.color || "#9686B9",
                  }}
                >
                  {STATUS_STYLES[groupClaims[0]?.status]?.label || groupClaims[0]?.status}
                </span>
              </div>
            </div>

            {/* Claims in group */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {groupClaims.map((claim) => {
                const vStyle = VALUE_STYLES[claim.valueTier] || VALUE_STYLES.MEDIUM;
                const isExpanded = expandedId === claim.id;
                const isActioning = actionLoading === claim.id;

                return (
                  <div key={claim.id}>
                    <div
                      className="px-4 py-3 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold"
                          style={{ backgroundColor: vStyle.bg, color: vStyle.color }}
                        >
                          {claim.claimType === "independent" ? "I" : "D"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-[9px] font-bold" style={{ color: vStyle.color }}>
                              {claim.valueTier} · ${(claim.estimatedValue / 1000).toFixed(0)}K
                            </span>
                            {claim.claimType === "dependent" && claim.dependsOn && (
                              <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                                depends on #{claim.dependsOn}
                              </span>
                            )}
                            {claim.priority && <Star size={10} fill="#F1C028" style={{ color: "#F1C028" }} />}
                            {claim.urgency === "file_now" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#E24D4712", color: "#E24D47" }}>
                                FILE NOW
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                            <span className="font-semibold">Claim {claim.claimNumber}:</span>{" "}
                            {isExpanded ? claim.claimText : claim.claimText.slice(0, 150) + (claim.claimText.length > 150 ? "..." : "")}
                          </p>
                        </div>
                        <div className="shrink-0 pt-1">
                          {isExpanded ? (
                            <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                          ) : (
                            <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 ml-10">
                        {/* Full claim text if truncated above */}
                        {claim.claimText.length > 150 && (
                          <div
                            className="rounded-lg p-3 mb-3 text-xs leading-relaxed"
                            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                          >
                            {claim.claimText}
                          </div>
                        )}

                        {/* Rationale */}
                        <div className="mb-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#5A6FFF" }}>
                            Strategic Value
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                            {claim.rationale}
                          </p>
                        </div>

                        {/* Follow-on note */}
                        {showFollowOn && claim.followOnNote && (
                          <div
                            className="rounded-lg p-3 mb-3 flex items-start gap-2"
                            style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}
                          >
                            <ArrowUpRight size={13} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#F1C028" }}>
                                Needs Follow-On Patent
                              </p>
                              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                                {claim.followOnNote}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Meta */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <MetaItem label="Category" value={formatCategory(claim.category)} />
                          <MetaItem label="Prior Art Risk" value={claim.priorArtRisk || "—"} />
                          <MetaItem label="Claim Type" value={claim.claimType === "independent" ? "Independent" : `Dependent (on #${claim.dependsOn})`} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={(e) => { e.stopPropagation(); onDiscuss(claim); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                          >
                            <MessageCircle size={12} /> Discuss with Joy
                          </button>
                          {claim.status === "not_drafted" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onDraft(claim); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                              style={{ backgroundColor: "#1EAA55" }}
                            >
                              <FileText size={12} /> Start Drafting
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); onTogglePriority(claim.id); }}
                            disabled={isActioning}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: claim.priority ? "#F1C02818" : "var(--background)",
                              color: claim.priority ? "#F1C028" : "var(--muted)",
                              border: `1px solid ${claim.priority ? "#F1C02830" : "var(--border)"}`,
                            }}
                          >
                            {claim.priority ? <StarOff size={12} /> : <Star size={12} />}
                            {claim.priority ? "Unmark" : "Priority"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onArchive(claim.id); }}
                            disabled={isActioning}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                          >
                            <Archive size={12} /> Archive
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Sub-Components ──────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, accent,
}: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className="px-5 py-4" style={{ backgroundColor: "var(--surface)" }}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
      </div>
      <p className="text-xl font-bold" style={{ color: accent ? "#1EAA55" : "var(--foreground)" }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{sub}</p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="text-xs font-medium capitalize" style={{ color: "var(--foreground)" }}>{value}</p>
    </div>
  );
}

function formatCategory(cat: string | null): string {
  if (!cat) return "—";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Draft Panel ─────────────────────────────────────────────────────

function DraftPanel({
  claim, onClose, onDraftStarted,
}: {
  claim: PatentClaim; onClose: () => void; onDraftStarted: () => void;
}) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);

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
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Draft Patent Outline</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Claim #{claim.claimNumber}: {claim.claimText.slice(0, 60)}...
            </p>
          </div>
          <button onClick={onClose} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin mb-3" style={{ color: "#5A6FFF" }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>Joy is drafting the patent outline...</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              {msg.role === "assistant" && (
                <div
                  className="rounded-xl border p-5 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}
        </div>
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
              <CheckCircle2 size={13} /> Approve Outline
            </button>
          </div>
        )}
      </div>
    </>
  );
}
