"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Shield,
  AlertTriangle,
  Clock,
  Edit3,
  Save,
  RotateCcw,
} from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import { PHASE_CONFIG } from "@/lib/data/launch-emails";

const PHASES = ["re-engagement", "education", "launch", "final-push", "post-close"] as const;

interface Props {
  emails: LaunchEmail[];
  onUpdate: (id: string, updates: Partial<LaunchEmail>) => void;
  onAction: (id: string, action: string) => void;
}

export default function EmailContentManager({ emails, onUpdate, onAction }: Props) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(["re-engagement"]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ subject: string; preview: string; body: string }>({
    subject: "",
    preview: "",
    body: "",
  });

  const togglePhase = (phase: string) => {
    const next = new Set(expandedPhases);
    if (next.has(phase)) next.delete(phase);
    else next.add(phase);
    setExpandedPhases(next);
  };

  const startEditing = (email: LaunchEmail) => {
    setEditingId(email.id);
    setEditDraft({ subject: email.subject, preview: email.preview, body: email.body });
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editDraft);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const complianceIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Shield size={14} className="text-green-600" />;
      case "flagged":
        return <AlertTriangle size={14} className="text-red-500" />;
      case "in_review":
        return <Clock size={14} className="text-yellow-600" />;
      default:
        return <Shield size={14} style={{ color: "var(--muted-light)" }} />;
    }
  };

  const complianceLabel = (status: string) => {
    switch (status) {
      case "approved": return "Compliance approved";
      case "flagged": return "Compliance flagged";
      case "in_review": return "In legal review";
      default: return "Not reviewed";
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      pending: { bg: "#F1C02818", text: "#B8930A" },
      approved: { bg: "#1EAA5518", text: "#168A44" },
      published: { bg: "#5A6FFF18", text: "#4458CC" },
    };
    const s = styles[status] || styles.pending;
    return (
      <span
        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{ backgroundColor: s.bg, color: s.text }}
      >
        {status}
      </span>
    );
  };

  const approved = emails.filter((e) => e.status === "approved" || e.status === "published").length;

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: "#E37FB118", color: "#C4609A" }}
        >
          {emails.length} emails
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: "#1EAA5518", color: "#168A44" }}
        >
          {approved} approved
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: "#E24D4718", color: "#C43A35" }}
        >
          {emails.filter((e) => e.complianceStatus === "flagged").length} compliance flags
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ backgroundColor: "#F9F7F0", color: "var(--muted)" }}
        >
          {emails.filter((e) => e.complianceStatus === "not_reviewed").length} awaiting review
        </div>
      </div>

      {/* Phase groups */}
      {PHASES.map((phase) => {
        const config = PHASE_CONFIG[phase];
        const phaseEmails = emails.filter((e) => e.phase === phase);
        const expanded = expandedPhases.has(phase);

        return (
          <div key={phase} className="mb-4">
            {/* Phase header */}
            <button
              onClick={() => togglePhase(phase)}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:opacity-90"
              style={{ backgroundColor: `${config.color}10` }}
            >
              {expanded ? (
                <ChevronDown size={16} style={{ color: config.color }} />
              ) : (
                <ChevronRight size={16} style={{ color: config.color }} />
              )}
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {config.label}
                </span>
                <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>
                  {config.weeks} — {phaseEmails.length} emails
                </span>
              </div>
              <span className="text-[10px] hidden sm:block" style={{ color: "var(--muted)" }}>
                {config.description}
              </span>
            </button>

            {/* Email list */}
            {expanded && (
              <div className="mt-2 space-y-2 pl-2">
                {phaseEmails.map((email) => {
                  const isEditing = editingId === email.id;

                  return (
                    <div
                      key={email.id}
                      className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--surface)",
                      }}
                    >
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: `${config.color}15`, color: config.color }}
                            >
                              W{email.week}-S{email.sequence}
                            </span>
                            {statusBadge(email.status)}
                            <div className="flex items-center gap-1" title={complianceLabel(email.complianceStatus)}>
                              {complianceIcon(email.complianceStatus)}
                              <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                                {complianceLabel(email.complianceStatus)}
                              </span>
                            </div>
                          </div>

                          {isEditing ? (
                            <input
                              className="w-full text-sm font-semibold border rounded-lg px-2 py-1"
                              style={{
                                color: "var(--foreground)",
                                borderColor: "var(--border)",
                                backgroundColor: "var(--background)",
                              }}
                              value={editDraft.subject}
                              onChange={(e) => setEditDraft({ ...editDraft, subject: e.target.value })}
                            />
                          ) : (
                            <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                              {email.subject}
                            </h4>
                          )}

                          {isEditing ? (
                            <input
                              className="w-full text-xs border rounded-lg px-2 py-1 mt-1"
                              style={{
                                color: "var(--muted)",
                                borderColor: "var(--border)",
                                backgroundColor: "var(--background)",
                              }}
                              value={editDraft.preview}
                              onChange={(e) => setEditDraft({ ...editDraft, preview: e.target.value })}
                            />
                          ) : (
                            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                              {email.preview}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(email.id)}
                                className="p-1.5 rounded-lg hover:bg-green-50"
                                title="Save"
                              >
                                <Save size={14} className="text-green-600" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-lg hover:bg-red-50"
                                title="Cancel"
                              >
                                <RotateCcw size={14} className="text-red-400" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(email)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: "var(--muted)" }}
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              {email.status === "pending" && (
                                <button
                                  onClick={() => onAction(email.id, "approve")}
                                  className="p-1.5 rounded-lg hover:bg-green-50"
                                  title="Approve"
                                >
                                  <Check size={14} className="text-green-600" />
                                </button>
                              )}
                              {email.status === "approved" && (
                                <button
                                  onClick={() => onAction(email.id, "reject")}
                                  className="p-1.5 rounded-lg hover:bg-red-50"
                                  title="Revert to pending"
                                >
                                  <X size={14} className="text-red-400" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Body (editable) */}
                      {isEditing ? (
                        <textarea
                          className="w-full text-xs leading-relaxed border rounded-lg px-3 py-2 mt-2 min-h-[200px] resize-y"
                          style={{
                            color: "var(--foreground)",
                            borderColor: "var(--border)",
                            backgroundColor: "var(--background)",
                            fontFamily: "var(--font-body)",
                          }}
                          value={editDraft.body}
                          onChange={(e) => setEditDraft({ ...editDraft, body: e.target.value })}
                        />
                      ) : (
                        <details className="mt-2">
                          <summary
                            className="text-[11px] font-medium cursor-pointer select-none"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            Show full email body
                          </summary>
                          <pre
                            className="mt-2 text-xs leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto p-3 rounded-lg"
                            style={{
                              color: "var(--foreground)",
                              backgroundColor: "var(--background)",
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {email.body}
                          </pre>
                          <div className="flex items-center gap-2 mt-3">
                            {email.status !== "approved" && email.status !== "published" && (
                              <button
                                onClick={() => onAction(email.id, "approve")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: "#1EAA55" }}
                              >
                                <Check size={14} /> Approve
                              </button>
                            )}
                            {email.complianceStatus !== "flagged" && (
                              <button
                                onClick={() => onAction(email.id, "compliance_flag")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                                style={{
                                  backgroundColor: "#E24D4714",
                                  color: "#E24D47",
                                  border: "1px solid #E24D4730",
                                }}
                              >
                                <AlertTriangle size={14} /> Flag for Compliance Review
                              </button>
                            )}
                          </div>
                        </details>
                      )}

                      {/* Footer: segment + timestamps */}
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                          Segment: {email.segment}
                        </span>
                        {email.approvedAt && (
                          <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                            Approved: {new Date(email.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
