"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Loader2,
  Save,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface Paper {
  id: string;
  number: number;
  title: string;
  leadAuthor: string;
  status: string;
  targetJournal: string | null;
  submissionDeadline: string | null;
  irbStatus: string;
  notes: string | null;
  googleDocLink: string | null;
}

const STATUSES = [
  "not_started",
  "hypothesis",
  "outline",
  "draft",
  "final_draft",
  "submitted",
  "under_review",
  "revision",
  "accepted",
  "published",
];

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  hypothesis: "Hypothesis",
  outline: "Outline",
  draft: "Draft",
  final_draft: "Final Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  revision: "Revision",
  accepted: "Accepted",
  published: "Published",
};

const IRB_OPTIONS = ["n/a", "needed", "submitted", "approved", "exempt"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  not_started: { bg: "rgba(255,255,255,0.08)", text: "var(--muted)" },
  hypothesis: { bg: "#9686B920", text: "#9686B9" },
  outline: { bg: "#F1C02820", text: "#F1C028" },
  draft: { bg: "#5A6FFF20", text: "#5A6FFF" },
  final_draft: { bg: "#356FB620", text: "#356FB6" },
  submitted: { bg: "#78C3BF20", text: "#78C3BF" },
  under_review: { bg: "#ACB7FF20", text: "#ACB7FF" },
  revision: { bg: "#F1C02820", text: "#F1C028" },
  accepted: { bg: "#1EAA5520", text: "#1EAA55" },
  published: { bg: "#1EAA5530", text: "#1EAA55" },
};

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Paper>>>({});

  const fetchPapers = useCallback(async () => {
    try {
      const res = await fetch("/api/research?type=papers");
      if (res.ok) {
        const data = await res.json();
        setPapers(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const updatePaper = async (paper: Paper) => {
    const edit = edits[paper.id];
    if (!edit) return;
    setSaving(paper.id);
    try {
      const res = await fetch("/api/research", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "paper", id: paper.id, ...edit }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPapers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEdits((prev) => {
          const next = { ...prev };
          delete next[paper.id];
          return next;
        });
      }
    } catch {
      // silent
    } finally {
      setSaving(null);
    }
  };

  const setEdit = (paperId: string, field: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [paperId]: { ...prev[paperId], [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          Paper Pipeline
        </h2>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {papers.length} papers
        </span>
      </div>

      {papers.map((paper) => {
        const expanded = expandedId === paper.id;
        const sc = STATUS_COLORS[paper.status] || STATUS_COLORS.not_started;
        const edit = edits[paper.id] || {};
        const hasChanges = Object.keys(edit).length > 0;

        return (
          <div
            key={paper.id}
            className="rounded-2xl overflow-hidden transition-all"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
          >
            {/* Header row */}
            <button
              onClick={() => setExpandedId(expanded ? null : paper.id)}
              className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span
                className="text-lg font-bold shrink-0"
                style={{ color: ACCENT, width: 28 }}
              >
                {paper.number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                  {paper.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {paper.targetJournal || "No journal set"} &middot; {paper.submissionDeadline || "No deadline"}
                </p>
              </div>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={{ backgroundColor: sc.bg, color: sc.text }}
              >
                {STATUS_LABELS[paper.status] || paper.status}
              </span>
              {expanded ? (
                <ChevronUp size={16} style={{ color: "var(--muted)" }} />
              ) : (
                <ChevronDown size={16} style={{ color: "var(--muted)" }} />
              )}
            </button>

            {/* Expanded edit form */}
            {expanded && (
              <div className="px-5 pb-5 pt-2 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      Status
                    </label>
                    <select
                      value={edit.status ?? paper.status}
                      onChange={(e) => setEdit(paper.id, "status", e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      IRB Status
                    </label>
                    <select
                      value={edit.irbStatus ?? paper.irbStatus}
                      onChange={(e) => setEdit(paper.id, "irbStatus", e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {IRB_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      Target Journal
                    </label>
                    <input
                      type="text"
                      value={edit.targetJournal ?? paper.targetJournal ?? ""}
                      onChange={(e) => setEdit(paper.id, "targetJournal", e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      Submission Deadline
                    </label>
                    <input
                      type="text"
                      value={edit.submissionDeadline ?? paper.submissionDeadline ?? ""}
                      onChange={(e) => setEdit(paper.id, "submissionDeadline", e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      Google Doc Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={edit.googleDocLink ?? paper.googleDocLink ?? ""}
                        onChange={(e) => setEdit(paper.id, "googleDocLink", e.target.value)}
                        placeholder="https://docs.google.com/..."
                        className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                        }}
                      />
                      {(edit.googleDocLink || paper.googleDocLink) && (
                        <a
                          href={edit.googleDocLink ?? paper.googleDocLink ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                          style={{ color: ACCENT }}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
                      Notes
                    </label>
                    <textarea
                      value={edit.notes ?? paper.notes ?? ""}
                      onChange={(e) => setEdit(paper.id, "notes", e.target.value)}
                      rows={3}
                      className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                </div>

                {hasChanges && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => updatePaper(paper)}
                      disabled={saving === paper.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {saving === paper.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}

                {/* Progress bar */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-semibold block mb-2" style={{ color: "var(--muted)" }}>
                    Progress
                  </label>
                  <div className="flex gap-1">
                    {STATUSES.map((s) => {
                      const currentIdx = STATUSES.indexOf(edit.status ?? paper.status);
                      const thisIdx = STATUSES.indexOf(s);
                      const active = thisIdx <= currentIdx;
                      return (
                        <div
                          key={s}
                          className="flex-1 h-2 rounded-full transition-colors"
                          style={{
                            backgroundColor: active ? ACCENT : "rgba(255,255,255,0.08)",
                          }}
                          title={STATUS_LABELS[s]}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: "var(--muted)" }}>Not Started</span>
                    <span className="text-[9px]" style={{ color: "var(--muted)" }}>Published</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
