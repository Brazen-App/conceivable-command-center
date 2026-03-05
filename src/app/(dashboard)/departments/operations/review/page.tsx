"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  FileText,
  Send,
  Shield,
  FileCheck,
  Lightbulb,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  XCircle,
  MessageCircle,
  Loader2,
  Filter,
  Eye,
  RefreshCw,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";
import RejectionModal from "@/components/review/RejectionModal";
import DiscussPanel from "@/components/review/DiscussPanel";

// ── Types ───────────────────────────────────────────────────────────

interface EmailRecord {
  id: string;
  week: number;
  sequence: number;
  phase: string;
  subject: string;
  preview: string;
  body: string;
  status: string;
  segment: string | null;
  complianceStatus: string;
  mailchimpId: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
}

type ReviewCategory = "emails" | "content" | "outreach" | "compliance" | "patents" | "decisions";

interface ReviewItem {
  id: string;
  category: ReviewCategory;
  title: string;
  subtitle: string;
  priority: "high" | "medium" | "low";
  department: string;
  submittedAt: string;
  detail?: string;
  emailBody?: string;
  emailPhase?: string;
  emailWeek?: number;
  emailSequence?: number;
  emailComplianceStatus?: string;
}

// ── Constants ───────────────────────────────────────────────────────

const CATEGORIES: { id: ReviewCategory; label: string; icon: typeof Mail; color: string }[] = [
  { id: "emails", label: "Emails", icon: Mail, color: "#E37FB1" },
  { id: "content", label: "Content", icon: FileText, color: "#5A6FFF" },
  { id: "outreach", label: "Outreach", icon: Send, color: "#356FB6" },
  { id: "compliance", label: "Compliance", icon: Shield, color: "#E24D47" },
  { id: "patents", label: "Patents", icon: FileCheck, color: "#78C3BF" },
  { id: "decisions", label: "Decisions", icon: Lightbulb, color: "#F1C028" },
];

const PRIORITY_STYLES = {
  high: { color: "#E24D47", bg: "#E24D4710", label: "High" },
  medium: { color: "#F1C028", bg: "#F1C02810", label: "Medium" },
  low: { color: "#1EAA55", bg: "#1EAA5510", label: "Low" },
};

const PHASE_PRIORITY: Record<string, "high" | "medium" | "low"> = {
  "re-engagement": "high",
  "education": "high",
  "launch": "high",
  "final-push": "medium",
  "post-close": "low",
};

const PHASE_LABELS: Record<string, string> = {
  "re-engagement": "Re-engagement",
  "education": "Education",
  "launch": "Launch",
  "final-push": "Final Push",
  "post-close": "Post-Close",
};

const NON_EMAIL_ITEMS: ReviewItem[] = [
  {
    id: "r-compliance-1",
    category: "compliance",
    title: "Testimonial: Sarah's PCOS story",
    subtitle: "Email contains patient testimonial — FTC verification needed",
    priority: "high",
    department: "Legal",
    submittedAt: "Flagged by auto-scan",
    detail: "Sarah's PCOS testimonial in Email 8 needs FTC verification. Must have documented consent and outcome verification before sending.",
  },
  {
    id: "r-patent-1",
    category: "patents",
    title: "Closed-Loop Fertility Optimization System",
    subtitle: "Provisional filing — overdue, must file before fundraise",
    priority: "high",
    department: "Legal",
    submittedAt: "Draft ready for review",
    detail: "Core IP protecting the feedback loop between wearable data, AI recommendations, and outcome tracking. Filing deadline is critical — competitors are active.",
  },
  {
    id: "r-decision-1",
    category: "decisions",
    title: "Bridge round target: $150K vs $250K",
    subtitle: "Joy recommends $150K — faster close, less dilution, 4mo runway extension",
    priority: "medium",
    department: "Strategy",
    submittedAt: "Pending CEO decision",
    detail: "At $28K/mo burn, $150K extends runway to 7 months (through launch). $250K gives more buffer but takes longer to close and increases dilution pre-traction.",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

function emailToReviewItem(email: EmailRecord): ReviewItem {
  return {
    id: email.id,
    category: "emails",
    title: `Week ${email.week}, Email ${email.sequence}: "${email.subject}"`,
    subtitle: `${PHASE_LABELS[email.phase] || email.phase} phase — ${email.preview}`,
    priority: PHASE_PRIORITY[email.phase] || "medium",
    department: "Marketing",
    submittedAt: "Ready to review",
    detail: email.preview,
    emailBody: email.body,
    emailPhase: email.phase,
    emailWeek: email.week,
    emailSequence: email.sequence,
    emailComplianceStatus: email.complianceStatus,
  };
}

// ── Component ───────────────────────────────────────────────────────

export default function CEOReviewPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<ReviewCategory | "all">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: "success" | "error" }>>([]);

  const [rejectionTarget, setRejectionTarget] = useState<ReviewItem | null>(null);
  const [discussTarget, setDiscussTarget] = useState<ReviewItem | null>(null);
  const [resyncLoading, setResyncLoading] = useState(false);

  const addToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/emails");
      if (!res.ok) throw new Error("Failed to fetch emails");
      const data = await res.json();
      setEmails(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Separate emails by status
  const pendingEmails = emails.filter((e) => e.status === "pending");
  const approvedEmails = emails.filter((e) => e.status === "approved");
  const publishedEmails = emails.filter((e) => e.status === "published");

  // Build review items — only pending emails go in the review queue
  const pendingEmailItems: ReviewItem[] = pendingEmails
    .filter((e) => !rejectedItems.has(e.id))
    .map(emailToReviewItem);

  const allItems = [...pendingEmailItems, ...NON_EMAIL_ITEMS];

  const filteredItems = allItems
    .filter((item) => activeCategory === "all" || item.category === activeCategory)
    .sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    });

  const INITIAL_COUNT = 10;
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_COUNT);
  const hasMore = filteredItems.length > INITIAL_COUNT && !showAll;

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Approve: update DB then refetch ─────────────────────────────

  const handleApprove = async (item: ReviewItem) => {
    setActionLoading(item.id);
    try {
      if (item.category === "emails") {
        const res = await fetch("/api/emails", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, action: "approve" }),
        });
        if (!res.ok) throw new Error("Failed to approve email");
      }
      // Immediately remove from pending list
      setEmails((prev) =>
        prev.map((e) =>
          e.id === item.id
            ? { ...e, status: "approved", approvedAt: new Date().toISOString() }
            : e
        )
      );
      addToast(`Approved: "${item.title}" — moved to scheduling queue`);
    } catch {
      addToast("Failed to approve — please try again", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Approve & Schedule in one click ──────────────────────────────

  const handleApproveAndSchedule = async (item: ReviewItem) => {
    setActionLoading(item.id);
    try {
      // Approve only — does NOT send. Sending follows the warmup schedule.
      const approveRes = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, action: "approve" }),
      });
      if (!approveRes.ok) throw new Error("Failed to approve");

      // Update local state — move to approved (not published)
      setEmails((prev) =>
        prev.map((e) =>
          e.id === item.id
            ? { ...e, status: "approved", approvedAt: new Date().toISOString() }
            : e
        )
      );

      addToast(`Approved & queued: "${item.title}" — will send on its warmup schedule date`);
    } catch {
      addToast("Failed to approve — please try again", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (item: ReviewItem, reasonCategory: string, reasonText: string) => {
    await fetch("/api/rejections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommendationId: item.id,
        recommendationType: item.category,
        reasonCategory,
        reasonText,
      }),
    });
    setRejectedItems((prev) => new Set(prev).add(item.id));
    addToast("Rejected and logged — Joy will learn from this");
  };

  // ── Resync email bodies from seed data ──────────────────────────

  const handleResync = async () => {
    setResyncLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resync failed");
      addToast(`Resynced ${data.updated} email bodies (status preserved)`);
      fetchEmails();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Resync failed", "error");
    } finally {
      setResyncLoading(false);
    }
  };

  // ── Schedule approved to Mailchimp ──────────────────────────────

  const [scheduleLoading, setScheduleLoading] = useState(false);

  const handleScheduleToMailchimp = async (emailIds: string[]) => {
    setScheduleLoading(true);
    try {
      const res = await fetch("/api/emails/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds, segment: "all", sendTime: "optimal" }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Schedule failed", "error");
      } else if (data.mock) {
        addToast(`${data.scheduled?.length || 0} email(s) scheduled (Mailchimp mock mode)`);
      } else {
        addToast(`${data.scheduled?.length || 0} email(s) scheduled in Mailchimp`);
      }
      fetchEmails();
    } catch {
      addToast("Connection error — check your internet", "error");
    } finally {
      setScheduleLoading(false);
    }
  };

  // ── Counts ──────────────────────────────────────────────────────

  const pendingCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: allItems.filter((i) => i.category === cat.id).length,
  }));

  const totalPending = allItems.length;

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
      <CompanyGoalsBanner departmentFocus="Clear review queue to unblock email launch" />

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="space-y-2 mb-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="rounded-xl border p-3 text-sm font-medium flex items-center gap-2"
              style={{
                borderColor: toast.type === "error" ? "#E24D4730" : "#1EAA5530",
                backgroundColor: toast.type === "error" ? "#E24D4708" : "#1EAA5508",
                color: toast.type === "error" ? "#E24D47" : "#1EAA55",
              }}
            >
              <CheckCircle2 size={14} />
              {toast.text}
            </div>
          ))}
        </div>
      )}

      {/* Summary + Resync */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: "#5A6FFF" }} />
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            {loading ? "Loading..." : `${totalPending} items need your review`}
          </h2>
        </div>
        <button
          onClick={handleResync}
          disabled={resyncLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--foreground)", backgroundColor: "var(--surface)" }}
        >
          <RefreshCw size={12} className={resyncLoading ? "animate-spin" : ""} />
          Sync Latest Content
        </button>
      </div>

      {/* Email status summary */}
      {!loading && emails.length > 0 && (
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#F1C02810", color: "#F1C028" }}>
            {pendingEmails.length} pending
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#1EAA5510", color: "#1EAA55" }}>
            {approvedEmails.length} approved
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#5A6FFF10", color: "#5A6FFF" }}>
            {publishedEmails.length} sent
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {emails.length} total emails
          </span>
        </div>
      )}

      {error && (
        <div
          className="rounded-xl border p-4 mb-6 text-sm"
          style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4708", color: "#E24D47" }}
        >
          {error}. <button onClick={fetchEmails} className="underline font-medium">Retry</button>
        </div>
      )}

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
          style={{
            backgroundColor: activeCategory === "all" ? "#5A6FFF12" : "transparent",
            color: activeCategory === "all" ? "#5A6FFF" : "var(--muted)",
            border: activeCategory === "all" ? "1px solid #5A6FFF20" : "1px solid transparent",
          }}
        >
          All ({totalPending})
        </button>
        {pendingCounts.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: isActive ? `${cat.color}12` : "transparent",
                color: isActive ? cat.color : "var(--muted)",
                border: isActive ? `1px solid ${cat.color}20` : "1px solid transparent",
              }}
            >
              <Icon size={12} />
              {cat.label}
              {cat.count > 0 && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-4 animate-pulse"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="h-4 rounded w-3/4 mb-2" style={{ backgroundColor: "var(--border)" }} />
              <div className="h-3 rounded w-1/2" style={{ backgroundColor: "var(--border)" }} />
            </div>
          ))}
        </div>
      )}

      {/* ═══ REVIEW ITEMS ═══ */}
      {!loading && (
        <div className="space-y-3">
          {visibleItems.length === 0 ? (
            <div
              className="rounded-xl border p-8 text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "#1EAA55" }} />
              <p className="text-sm font-medium" style={{ color: "#1EAA55" }}>All caught up!</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                No items pending review{activeCategory !== "all" ? " in this category" : ""}.
              </p>
            </div>
          ) : (
            visibleItems.map((item) => {
              const cat = CATEGORIES.find((c) => c.id === item.category)!;
              const Icon = cat.icon;
              const pStyle = PRIORITY_STYLES[item.priority];
              const isExpanded = expandedItems.has(item.id);
              const isApproving = actionLoading === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  {/* Card header — ALWAYS shows approve/reject buttons */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                        style={{ backgroundColor: `${cat.color}14` }}
                        onClick={() => toggleExpanded(item.id)}
                      >
                        <Icon size={15} style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpanded(item.id)}>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: pStyle.bg, color: pStyle.color }}
                          >
                            {pStyle.label}
                          </span>
                          <span
                            className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${cat.color}10`, color: cat.color }}
                          >
                            {item.department}
                          </span>
                          {item.emailPhase && (
                            <span
                              className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "#5A6FFF10", color: "#5A6FFF" }}
                            >
                              {PHASE_LABELS[item.emailPhase]}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                          {item.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          {item.subtitle}
                        </p>
                      </div>

                      {/* ── INLINE ACTION BUTTONS ── */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {item.category === "emails" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveAndSchedule(item);
                            }}
                            disabled={isApproving}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "#5A6FFF" }}
                            title="Approve & Schedule to Mailchimp"
                          >
                            {isApproving ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                            <span className="hidden sm:inline">Approve & Queue</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(item);
                          }}
                          disabled={isApproving}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#1EAA55" }}
                          title="Approve"
                        >
                          <CheckCircle2 size={11} />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectionTarget(item);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#E24D47" }}
                          title="Reject"
                        >
                          <XCircle size={11} />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDiscussTarget(item);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                          title="Discuss with Joy"
                        >
                          <MessageCircle size={11} />
                        </button>
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-50"
                        >
                          {isExpanded ? (
                            <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                          ) : (
                            <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded section — email preview only */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--border)" }}>
                      {item.emailBody ? (
                        <div className="mt-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Eye size={12} style={{ color: "var(--muted)" }} />
                            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                              Email Preview
                            </span>
                            {item.emailComplianceStatus && (
                              <span
                                className="text-[9px] font-medium px-2 py-0.5 rounded-full ml-2"
                                style={{
                                  backgroundColor:
                                    item.emailComplianceStatus === "approved"
                                      ? "#1EAA5510"
                                      : item.emailComplianceStatus === "flagged"
                                        ? "#E24D4710"
                                        : "#F1C02810",
                                  color:
                                    item.emailComplianceStatus === "approved"
                                      ? "#1EAA55"
                                      : item.emailComplianceStatus === "flagged"
                                        ? "#E24D47"
                                        : "#F1C028",
                                }}
                              >
                                {item.emailComplianceStatus === "approved"
                                  ? "Compliance OK"
                                  : item.emailComplianceStatus === "flagged"
                                    ? "Compliance Flagged"
                                    : "Needs Review"}
                              </span>
                            )}
                          </div>
                          <div
                            className="rounded-lg border p-4 text-sm leading-relaxed max-h-80 overflow-y-auto"
                            style={{
                              borderColor: "var(--border)",
                              backgroundColor: "var(--background)",
                              color: "var(--foreground)",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.emailBody.replace(/\n/g, "<br />"),
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs leading-relaxed mt-3" style={{ color: "var(--foreground)" }}>
                          {item.detail}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {hasMore && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 rounded-xl border text-sm font-medium transition-colors hover:shadow-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "#5A6FFF" }}
            >
              <div className="flex items-center justify-center gap-2">
                <Filter size={14} />
                Show All {filteredItems.length} Items
              </div>
            </button>
          )}
        </div>
      )}

      {/* ── Approved & Ready to Schedule ─────────────────────────── */}
      {!loading && approvedEmails.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Approved &amp; Ready to Schedule ({approvedEmails.length})
              </h3>
            </div>
            <button
              onClick={() => handleScheduleToMailchimp(approvedEmails.map((e) => e.id))}
              disabled={scheduleLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#5A6FFF" }}
            >
              {scheduleLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              Schedule All in Mailchimp
            </button>
          </div>
          <div className="space-y-2">
            {approvedEmails.map((email) => (
              <div
                key={email.id}
                className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3"
                style={{ borderColor: "#1EAA5520", backgroundColor: "#1EAA5506" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    Week {email.week}, Email {email.sequence}: &ldquo;{email.subject}&rdquo;
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {PHASE_LABELS[email.phase] || email.phase} &middot; Approved {email.approvedAt ? new Date(email.approvedAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
                    APPROVED
                  </span>
                  <button
                    onClick={() => handleScheduleToMailchimp([email.id])}
                    disabled={scheduleLoading}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: "#5A6FFF" }}
                  >
                    <Send size={10} /> Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sent / Published ───────────────────────────────────────── */}
      {!loading && publishedEmails.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={16} style={{ color: "#5A6FFF" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Sent / Scheduled ({publishedEmails.length})
            </h3>
          </div>
          <div className="space-y-2">
            {publishedEmails.map((email) => (
              <div
                key={email.id}
                className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    Week {email.week}, Email {email.sequence}: &ldquo;{email.subject}&rdquo;
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {PHASE_LABELS[email.phase] || email.phase} &middot; Published {email.publishedAt ? new Date(email.publishedAt).toLocaleDateString() : ""}
                    {email.mailchimpId && <span> &middot; MC: {email.mailchimpId}</span>}
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>
                  SENT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={async (reasonCategory, reasonText) => {
          if (rejectionTarget) {
            await handleReject(rejectionTarget, reasonCategory, reasonText);
          }
        }}
        itemTitle={rejectionTarget?.title || ""}
        itemType={rejectionTarget?.category || ""}
      />

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType={discussTarget?.category || "email"}
        contextId={discussTarget?.id || ""}
        contextTitle={discussTarget?.title || ""}
        contextDetail={
          discussTarget?.emailBody
            ? discussTarget.emailBody.slice(0, 500)
            : discussTarget?.detail
        }
        onApprove={
          discussTarget
            ? () => handleApprove(discussTarget)
            : undefined
        }
        onReject={
          discussTarget
            ? () => setRejectionTarget(discussTarget)
            : undefined
        }
      />
    </div>
  );
}
