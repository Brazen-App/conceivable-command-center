"use client";

import { useState } from "react";
import {
  Check,
  X,
  Shield,
  AlertTriangle,
  Clock,
  Edit3,
  Save,
  RotateCcw,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import { PHASE_CONFIG } from "@/lib/data/launch-emails";

interface Props {
  emails: LaunchEmail[];
  onUpdate: (id: string, updates: Partial<LaunchEmail>) => void;
  onAction: (id: string, action: string) => void;
}

const PHASE_LABELS: Record<string, string> = {
  "re-engagement": "Re-engagement",
  education: "Education",
  launch: "Launch",
  "final-push": "Final Push",
  "post-close": "Post-Close",
};

export default function EmailContentManager({ emails, onUpdate, onAction }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ subject: "", preview: "", body: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: "success" | "error" }>>([]);

  const addToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // Separate by status
  const pendingEmails = emails.filter((e) => e.status === "pending");
  const approvedEmails = emails.filter((e) => e.status === "approved");
  const publishedEmails = emails.filter((e) => e.status === "published");

  const startEditing = (email: LaunchEmail) => {
    setEditingId(email.id);
    setEditDraft({ subject: email.subject, preview: email.preview, body: email.body });
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editDraft);
    setEditingId(null);
    addToast("Email updated");
  };

  const cancelEdit = () => setEditingId(null);

  const handleApproveAndSend = async (email: LaunchEmail) => {
    setScheduleLoading(email.id);
    try {
      // Step 1: Approve
      const approveRes = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, action: "approve" }),
      });
      if (!approveRes.ok) throw new Error("Failed to approve");

      // Step 2: Schedule to Mailchimp
      const scheduleRes = await fetch("/api/emails/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds: [email.id], segment: "all", sendTime: "optimal" }),
      });
      const scheduleData = await scheduleRes.json();

      // Optimistic update — mark as published so it disappears from pending
      onAction(email.id, "approve");

      if (scheduleData.mock) {
        addToast(`Approved & scheduled: "${email.subject}" (Mailchimp mock mode)`);
      } else {
        addToast(`Approved & sent to Mailchimp: "${email.subject}"`);
      }
    } catch {
      addToast("Failed to approve & schedule — try again", "error");
    } finally {
      setScheduleLoading(null);
    }
  };

  const handleApprove = async (email: LaunchEmail) => {
    setActionLoading(email.id);
    onAction(email.id, "approve");
    addToast(`Approved: "${email.subject}"`);
    setActionLoading(null);
  };

  const handleReject = async (email: LaunchEmail) => {
    setActionLoading(email.id);
    onAction(email.id, "reject");
    addToast(`Rejected: "${email.subject}"`);
    setActionLoading(null);
  };

  const complianceBadge = (status: string) => {
    if (status === "approved")
      return (
        <span className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5510", color: "#1EAA55" }}>
          <Shield size={10} /> Compliant
        </span>
      );
    if (status === "flagged")
      return (
        <span className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4710", color: "#E24D47" }}>
          <AlertTriangle size={10} /> Flagged
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02810", color: "#F1C028" }}>
        <Clock size={10} /> Needs Review
      </span>
    );
  };

  // Get first 3 lines of body as preview
  const bodyPreview = (body: string) => {
    const lines = body.split("\n").filter((l) => l.trim().length > 0);
    return lines.slice(0, 3).join("\n");
  };

  return (
    <div>
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

      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "#F1C02818", color: "#B8930A" }}>
          {pendingEmails.length} pending review
        </span>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "#1EAA5518", color: "#168A44" }}>
          {approvedEmails.length} approved
        </span>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: "#5A6FFF18", color: "#4458CC" }}>
          {publishedEmails.length} sent
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {emails.length} total
        </span>
      </div>

      {/* ══ PENDING EMAILS — the actual review queue ══ */}
      {pendingEmails.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "#1EAA55" }} />
          <p className="text-sm font-medium" style={{ color: "#1EAA55" }}>All emails reviewed!</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            No emails pending review. Check the Approved section below.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingEmails.map((email) => {
            const isEditing = editingId === email.id;
            const isExpanded = expandedId === email.id;
            const isLoading = actionLoading === email.id || scheduleLoading === email.id;
            const phaseConfig = PHASE_CONFIG[email.phase as keyof typeof PHASE_CONFIG];

            return (
              <div
                key={email.id}
                className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                {/* Card header */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${phaseConfig?.color || "#5A6FFF"}15`, color: phaseConfig?.color || "#5A6FFF" }}
                        >
                          {PHASE_LABELS[email.phase] || email.phase}
                        </span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E37FB115", color: "#E37FB1" }}>
                          W{email.week}-S{email.sequence}
                        </span>
                        {complianceBadge(email.complianceStatus)}
                      </div>

                      {/* Subject */}
                      {isEditing ? (
                        <input
                          className="w-full text-sm font-semibold border rounded-lg px-2 py-1"
                          style={{ color: "var(--foreground)", borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                          value={editDraft.subject}
                          onChange={(e) => setEditDraft({ ...editDraft, subject: e.target.value })}
                        />
                      ) : (
                        <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {email.subject}
                        </h4>
                      )}

                      {/* Body preview — shows Hi *|FNAME|*, and first lines */}
                      {!isEditing && (
                        <div
                          className="mt-2 rounded-lg p-3 text-xs leading-relaxed"
                          style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                        >
                          <pre className="whitespace-pre-wrap font-sans">{bodyPreview(email.body)}</pre>
                          {!isExpanded && (
                            <button
                              onClick={() => setExpandedId(email.id)}
                              className="flex items-center gap-1 mt-2 text-[10px] font-medium"
                              style={{ color: "#5A6FFF" }}
                            >
                              <Eye size={10} /> Show full email
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── ACTION BUTTONS ── */}
                    <div className="shrink-0 flex flex-col gap-1.5">
                      <button
                        onClick={() => handleApproveAndSend(email)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#5A6FFF" }}
                        title="Approve & Schedule to Mailchimp"
                      >
                        {scheduleLoading === email.id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        Approve & Send
                      </button>
                      <button
                        onClick={() => handleApprove(email)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#1EAA55" }}
                        title="Approve (don't send yet)"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(email)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#E24D47" }}
                        title="Reject"
                      >
                        <XCircle size={12} />
                        Reject
                      </button>
                      <button
                        onClick={() => startEditing(email)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                        title="Edit email"
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Editing body */}
                  {isEditing && (
                    <div className="mt-3">
                      <input
                        className="w-full text-xs border rounded-lg px-2 py-1 mb-2"
                        style={{ color: "var(--muted)", borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                        value={editDraft.preview}
                        onChange={(e) => setEditDraft({ ...editDraft, preview: e.target.value })}
                        placeholder="Preview text"
                      />
                      <textarea
                        className="w-full text-xs leading-relaxed border rounded-lg px-3 py-2 min-h-[200px] resize-y"
                        style={{ color: "var(--foreground)", borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                        value={editDraft.body}
                        onChange={(e) => setEditDraft({ ...editDraft, body: e.target.value })}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => saveEdit(email.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ backgroundColor: "#1EAA55" }}
                        >
                          <Save size={12} /> Save Changes
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ color: "#E24D47" }}
                        >
                          <RotateCcw size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full email body when expanded */}
                {isExpanded && !isEditing && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-1.5 mt-3 mb-2">
                      <Eye size={12} style={{ color: "var(--muted)" }} />
                      <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Full Email Body
                      </span>
                    </div>
                    <pre
                      className="text-xs leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto p-4 rounded-lg font-sans"
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                    >
                      {email.body}
                    </pre>
                    <button
                      onClick={() => setExpandedId(null)}
                      className="mt-2 text-[10px] font-medium"
                      style={{ color: "#5A6FFF" }}
                    >
                      Collapse
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Segment: {email.segment}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ APPROVED — Ready to schedule ══ */}
      {approvedEmails.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Approved — Ready to Schedule ({approvedEmails.length})
            </h3>
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
                    W{email.week}-S{email.sequence}: {email.subject}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {PHASE_LABELS[email.phase]} &middot; Approved {email.approvedAt ? new Date(email.approvedAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
                  APPROVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ PUBLISHED / SENT ══ */}
      {publishedEmails.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Send size={16} style={{ color: "#5A6FFF" }} />
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
                    W{email.week}-S{email.sequence}: {email.subject}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {PHASE_LABELS[email.phase]} &middot; Published {email.publishedAt ? new Date(email.publishedAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>
                  SENT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
