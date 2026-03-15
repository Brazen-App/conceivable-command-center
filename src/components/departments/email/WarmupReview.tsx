"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Users,
  Eye,
  X,
  Shield,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";

interface WarmupEmail {
  id: string;
  subject: string;
  preview: string;
  body: string;
  week: number;
  sequence: number;
  phase: string;
  status: string;
  complianceStatus: string;
  approvedAt: string | null;
  publishedAt: string | null;
  mailchimpId: string | null;
  scheduledDate: string | null;
  scheduledSegment: string | null;
}

interface SchedulePreview {
  emailId: string;
  subject: string;
  sendDate: string;
  sendDay: string;
  sendTime: string;
  audience: string;
  alreadyScheduled: boolean;
}

function textToPreviewHtml(text: string): string {
  return text
    .replace(/\*\|FNAME\|\*/g, "Friend")
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 14px 0;line-height:1.6;font-size:15px;color:#2A2828;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export default function WarmupReview() {
  const [emails, setEmails] = useState<WarmupEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewEmail, setPreviewEmail] = useState<WarmupEmail | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Actions
  const [approving, setApproving] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [showScheduleConfirm, setShowScheduleConfirm] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState<SchedulePreview[] | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/emails");
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : data.emails || []);
    } catch { /* */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  const sorted = [...emails].sort((a, b) => a.week - b.week || a.sequence - b.sequence);
  const published = sorted.filter((e) => e.status === "published");
  const approved = sorted.filter((e) => e.status === "approved");
  const pending = sorted.filter((e) => e.status === "pending");
  const scheduled = sorted.filter((e) => e.mailchimpId && e.status !== "published");
  const needsApproval = sorted.filter((e) => e.status !== "approved" && e.status !== "published");
  const readyToSchedule = sorted.filter((e) => e.status === "approved" && !e.mailchimpId);

  const handleApproveAll = async () => {
    setApproving(true);
    setResult(null);
    try {
      const ids = needsApproval.map((e) => e.id);
      if (ids.length === 0) {
        setResult({ ok: true, message: "All emails are already approved." });
        setApproving(false);
        return;
      }
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk_approve", ids }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `Approved ${ids.length} emails.` });
        await fetchEmails();
      } else {
        setResult({ ok: false, message: data.error || "Approval failed" });
      }
    } catch {
      setResult({ ok: false, message: "Network error" });
    } finally {
      setApproving(false);
    }
  };

  const handleLoadSchedulePreview = async () => {
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/mailchimp/schedule-all");
      const data = await res.json();
      setSchedulePreview(data.schedule || []);
      setShowScheduleConfirm(true);
    } catch {
      setResult({ ok: false, message: "Failed to load schedule preview" });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleScheduleAll = async () => {
    setScheduling(true);
    setResult(null);
    try {
      const res = await fetch("/api/mailchimp/schedule-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({
          ok: true,
          message: `${data.scheduled} emails scheduled in Mailchimp! First send: ${data.firstSend}, Last send: ${data.lastSend}.`,
        });
        setShowScheduleConfirm(false);
        await fetchEmails();
      } else {
        setResult({ ok: false, message: data.error || "Scheduling failed" });
      }
    } catch {
      setResult({ ok: false, message: "Network error" });
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: ACCENT }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>Loading emails...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Warmup Send Queue</h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
          Approve all emails, then schedule them — Mon/Wed/Fri at 10am EST, full list, through launch.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: emails.length, color: "var(--foreground)" },
          { label: "Approved", value: approved.length + published.length, color: GREEN },
          { label: "Scheduled", value: scheduled.length, color: ACCENT },
          { label: "Sent", value: published.length, color: GREEN },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Result banner */}
      {result && (
        <div
          className="rounded-xl border p-4 flex items-start gap-3"
          style={{
            borderColor: result.ok ? "#1EAA5530" : "#E24D4730",
            backgroundColor: result.ok ? "#1EAA5508" : "#E24D4708",
          }}
        >
          {result.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: GREEN }} /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: RED }} />}
          <p className="text-sm flex-1" style={{ color: result.ok ? GREEN : RED }}>{result.message}</p>
          <button type="button" onClick={() => setResult(null)}><X size={14} style={{ color: "var(--muted)" }} /></button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {needsApproval.length > 0 && (
          <button
            type="button"
            onClick={handleApproveAll}
            disabled={approving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: GREEN }}
          >
            {approving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Approve All ({needsApproval.length})
          </button>
        )}

        {readyToSchedule.length > 0 && (
          <button
            type="button"
            onClick={handleLoadSchedulePreview}
            disabled={loadingPreview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {loadingPreview ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
            Schedule All ({readyToSchedule.length}) — Mon/Wed/Fri
          </button>
        )}

        {needsApproval.length === 0 && readyToSchedule.length === 0 && scheduled.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: `${GREEN}10`, color: GREEN }}>
            <CheckCircle2 size={14} />
            All emails are scheduled in Mailchimp
          </div>
        )}
      </div>

      {/* Scheduled emails */}
      {scheduled.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
            Scheduled ({scheduled.length})
          </p>
          <div className="space-y-2">
            {scheduled.map((email) => (
              <div key={email.id} className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <Calendar size={14} style={{ color: ACCENT }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{email.subject}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {email.scheduledDate} · Full list · Week {email.week}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>Scheduled</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Already sent */}
      {published.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
            Already Sent ({published.length})
          </p>
          <div className="space-y-2">
            {published.map((email) => (
              <div key={email.id} className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <CheckCircle2 size={14} style={{ color: GREEN }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{email.subject}</p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Sent {email.publishedAt ? new Date(email.publishedAt).toLocaleDateString() : ""} · Week {email.week}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${GREEN}14`, color: GREEN }}>Sent</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending approval / ready to schedule queue */}
      {(readyToSchedule.length > 0 || needsApproval.length > 0) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
            Email Queue ({readyToSchedule.length + needsApproval.length})
          </p>
          <div className="space-y-2">
            {[...readyToSchedule, ...needsApproval].sort((a, b) => a.week - b.week || a.sequence - b.sequence).map((email) => {
              const isExpanded = expandedId === email.id;
              return (
                <div key={email.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : email.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left"
                  >
                    <Mail size={14} style={{ color: "var(--muted)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{email.subject}</p>
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>Week {email.week} · {email.phase}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      backgroundColor: email.status === "approved" ? `${GREEN}14` : "var(--background)",
                      color: email.status === "approved" ? GREEN : "var(--muted)",
                    }}>
                      {email.status}
                    </span>
                    {isExpanded ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="rounded-lg p-3 text-sm leading-relaxed" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
                        {email.body.replace(/\*\|FNAME\|\*/g, "Friend").slice(0, 500)}...
                      </div>
                      <button type="button" onClick={() => setPreviewEmail(email)} className="flex items-center gap-1.5 mt-2 text-xs font-medium" style={{ color: ACCENT }}>
                        <Eye size={12} /> Full Preview
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full email preview modal */}
      {previewEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col" style={{ backgroundColor: "#fff" }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #eee" }}>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2A2828" }}>Email Preview</p>
                <p className="text-xs" style={{ color: "#888" }}>{previewEmail.subject}</p>
              </div>
              <button type="button" onClick={() => setPreviewEmail(null)}><X size={18} style={{ color: "#888" }} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#F9F7F0" }}>
              <div className="max-w-[500px] mx-auto p-6 rounded-xl" style={{ backgroundColor: "#fff" }} dangerouslySetInnerHTML={{ __html: textToPreviewHtml(previewEmail.body) }} />
            </div>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: "1px solid #eee", backgroundColor: "#fafafa" }}>
              <span className="text-xs" style={{ color: "#888" }}>From: Kirsten at Conceivable · Reply-to: kirsten@conceivable.com</span>
            </div>
          </div>
        </div>
      )}

      {/* Schedule confirmation modal */}
      {showScheduleConfirm && schedulePreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col" style={{ backgroundColor: "var(--surface)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <Shield size={16} style={{ color: ACCENT }} />
                <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>Confirm Schedule</p>
              </div>
              <button type="button" onClick={() => setShowScheduleConfirm(false)}><X size={18} style={{ color: "var(--muted)" }} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="rounded-lg p-3 flex items-start gap-2" style={{ backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}15` }}>
                <Users size={14} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div className="text-xs" style={{ color: "var(--foreground)" }}>
                  <strong>{schedulePreview.filter((s) => !s.alreadyScheduled).length} emails</strong> will be scheduled in Mailchimp.
                  All go to the <strong>full list (~29,000)</strong>. Mon/Wed/Fri at 10am EST.
                </div>
              </div>

              <div className="space-y-1.5">
                {schedulePreview.filter((s) => !s.alreadyScheduled).map((item) => (
                  <div key={item.emailId} className="flex items-center gap-3 text-sm py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-xs font-mono shrink-0" style={{ color: ACCENT }}>{item.sendDate}</span>
                    <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>{item.sendDay}</span>
                    <span className="text-sm truncate flex-1" style={{ color: "var(--foreground)" }}>{item.subject}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg p-3 flex items-start gap-2" style={{ backgroundColor: `${YELLOW}10`, border: `1px solid ${YELLOW}20` }}>
                <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: YELLOW }} />
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  Campaigns will be <strong>scheduled</strong> in Mailchimp (not sent immediately). You can cancel individual campaigns from Mailchimp if needed.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 flex items-center gap-3" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                type="button"
                onClick={() => setShowScheduleConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                disabled={scheduling}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleAll}
                disabled={scheduling}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                {scheduling ? (
                  <><Loader2 size={14} className="animate-spin" /> Scheduling...</>
                ) : (
                  <><Send size={14} /> Schedule All in Mailchimp</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
