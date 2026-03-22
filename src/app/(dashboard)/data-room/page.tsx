"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  FolderOpen,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Link2,
  X,
  Lock,
  Eye,
  Edit3,
  Save,
} from "lucide-react";
import { DATA_ROOM_FOLDERS } from "@/lib/data/data-room";

interface DataRoomDoc {
  id: string;
  folder: string;
  title: string;
  description: string | null;
  url: string | null;
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  sortOrder: number;
  notes: string | null;
  uploadedBy: string | null;
  updatedAt: string;
}

export default function DataRoomPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const isTeam = isAdmin || (session?.user as { role?: string })?.role === "team";
  const isInvestor = (session?.user as { role?: string })?.role === "investor";

  const [docs, setDocs] = useState<DataRoomDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolder, setExpandedFolder] = useState<string | null>("00");
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/data-room");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleSaveUrl = async (docId: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/data-room", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: docId,
          url: editUrl || null,
          notes: editNotes || null,
          status: editUrl ? "ready" : "missing",
        }),
      });
      if (res.ok) {
        await fetchDocs();
        setEditingDoc(null);
      }
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  const handleAddDoc = async (folder: string) => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/data-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder,
          title: newTitle,
          description: newDesc || null,
          url: newUrl || null,
        }),
      });
      if (res.ok) {
        await fetchDocs();
        setAddingTo(null);
        setNewTitle("");
        setNewDesc("");
        setNewUrl("");
      }
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const totalDocs = docs.length;
  const readyDocs = docs.filter((d) => d.status === "ready" || d.status === "uploaded").length;
  const missingDocs = docs.filter((d) => d.status === "missing").length;
  const draftDocs = docs.filter((d) => d.status === "draft").length;

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
        <div className="rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: "#5A6FFF" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading data room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#5A6FFF14" }}>
            <Lock size={20} style={{ color: "#5A6FFF" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em", color: "var(--foreground)" }}
            >
              {isInvestor ? "Investor Data Room" : "Data Room"}
            </h1>
            <p
              className="mt-0.5"
              style={{ fontFamily: "var(--font-caption)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}
            >
              Conceivable — Seed Round — Confidential
            </p>
          </div>
          {isInvestor && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#5A6FFF10" }}>
              <Eye size={12} style={{ color: "#5A6FFF" }} />
              <span className="text-[10px] font-medium" style={{ color: "#5A6FFF" }}>View Only</span>
            </div>
          )}
        </div>
      </header>

      {/* Readiness summary (admin/team only) */}
      {isTeam && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "#5A6FFF06", border: "1px solid #5A6FFF18" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{totalDocs}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>{readyDocs}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Ready</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>{draftDocs}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Draft</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#E24D47" }}>{missingDocs}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Missing</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ backgroundColor: "#1EAA55", width: `${totalDocs > 0 ? (readyDocs / totalDocs) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 text-center" style={{ color: "var(--muted)" }}>
              {totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0}% complete
            </p>
          </div>
        </div>
      )}

      {/* Folder list */}
      <div className="space-y-3">
        {DATA_ROOM_FOLDERS.map((folder) => {
          const folderDocs = docs.filter((d) => d.folder === folder.code);
          const isExpanded = expandedFolder === folder.code;
          const ready = folderDocs.filter((d) => d.status === "ready" || d.status === "uploaded").length;
          const total = folderDocs.length;

          // For investors, hide empty folders
          if (isInvestor && ready === 0) return null;

          return (
            <div
              key={folder.code}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              {/* Folder header */}
              <button
                type="button"
                onClick={() => setExpandedFolder(isExpanded ? null : folder.code)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:opacity-90 transition-opacity"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${folder.color}14` }}
                >
                  <FolderOpen size={20} style={{ color: folder.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold" style={{ color: folder.color }}>
                      {folder.code}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {folder.name}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                    {folder.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isTeam && (
                    <span className="text-[10px] font-medium" style={{ color: ready === total && total > 0 ? "#1EAA55" : "var(--muted)" }}>
                      {ready}/{total}
                    </span>
                  )}
                  {ready === total && total > 0 && (
                    <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                  )}
                  {ready < total && isTeam && (
                    <AlertTriangle size={14} style={{ color: "#F1C028" }} />
                  )}
                  {isExpanded ? <ChevronUp size={16} style={{ color: "var(--muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--muted)" }} />}
                </div>
              </button>

              {/* Documents */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="pt-3" />
                  {folderDocs
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((doc) => {
                      const isReady = doc.status === "ready" || doc.status === "uploaded";
                      const isEditing = editingDoc === doc.id;
                      const hasLink = doc.url || doc.fileUrl;

                      // Investors only see ready docs
                      if (isInvestor && !isReady) return null;

                      return (
                        <div
                          key={doc.id}
                          className="rounded-lg px-4 py-3"
                          style={{
                            backgroundColor: isReady ? `${folder.color}04` : "var(--background)",
                            border: `1px solid ${isReady ? `${folder.color}15` : "var(--border)"}`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <FileText
                              size={16}
                              className="shrink-0 mt-0.5"
                              style={{ color: isReady ? folder.color : "var(--muted)" }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                                  {doc.title}
                                </p>
                                {isTeam && (
                                  <span
                                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: isReady ? "#1EAA5514" : doc.status === "draft" ? "#F1C02814" : "#E24D4710",
                                      color: isReady ? "#1EAA55" : doc.status === "draft" ? "#B8930A" : "#E24D47",
                                    }}
                                  >
                                    {doc.status}
                                  </span>
                                )}
                              </div>
                              {doc.description && (
                                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                                  {doc.description}
                                </p>
                              )}

                              {/* Link for investors/team */}
                              {hasLink && !isEditing && (
                                <a
                                  href={doc.url || doc.fileUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium hover:underline"
                                  style={{ color: folder.color }}
                                >
                                  <ExternalLink size={11} />
                                  {doc.fileName || "Open Document"}
                                </a>
                              )}

                              {/* Admin notes */}
                              {isTeam && doc.notes && !isEditing && (
                                <p className="text-[11px] mt-1.5 italic" style={{ color: "var(--muted)" }}>
                                  Note: {doc.notes}
                                </p>
                              )}

                              {/* Edit form (admin/team) */}
                              {isEditing && (
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <label className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
                                      Document URL
                                    </label>
                                    <input
                                      type="url"
                                      value={editUrl}
                                      onChange={(e) => setEditUrl(e.target.value)}
                                      placeholder="https://drive.google.com/..."
                                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
                                      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
                                      Notes (admin only)
                                    </label>
                                    <input
                                      type="text"
                                      value={editNotes}
                                      onChange={(e) => setEditNotes(e.target.value)}
                                      placeholder="Internal notes..."
                                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none"
                                      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveUrl(doc.id)}
                                      disabled={saving}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                                      style={{ backgroundColor: "#5A6FFF" }}
                                    >
                                      {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingDoc(null)}
                                      className="px-3 py-1.5 rounded-lg text-xs"
                                      style={{ color: "var(--muted)" }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Edit button (admin/team) */}
                            {isTeam && !isEditing && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDoc(doc.id);
                                  setEditUrl(doc.url || "");
                                  setEditNotes(doc.notes || "");
                                }}
                                className="p-1.5 rounded-lg hover:opacity-70 shrink-0"
                                style={{ color: "var(--muted)" }}
                                title={hasLink ? "Edit link" : "Add link"}
                              >
                                {hasLink ? <Edit3 size={13} /> : <Link2 size={13} />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {/* Add document button (admin/team) */}
                  {isTeam && (
                    <>
                      {addingTo === folder.code ? (
                        <div className="rounded-lg p-4 mt-2" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="Document title"
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                            />
                            <input
                              type="text"
                              value={newDesc}
                              onChange={(e) => setNewDesc(e.target.value)}
                              placeholder="Brief description (optional)"
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                            />
                            <input
                              type="url"
                              value={newUrl}
                              onChange={(e) => setNewUrl(e.target.value)}
                              placeholder="Document URL (optional)"
                              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddDoc(folder.code)}
                                disabled={saving || !newTitle.trim()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                                style={{ backgroundColor: "#5A6FFF" }}
                              >
                                {saving ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                                Add Document
                              </button>
                              <button
                                onClick={() => setAddingTo(null)}
                                className="px-3 py-1.5 rounded-lg text-xs"
                                style={{ color: "var(--muted)" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAddingTo(folder.code)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mt-1 hover:opacity-70 transition-opacity"
                          style={{ color: "var(--muted)" }}
                        >
                          <Plus size={12} />
                          Add document to this folder
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confidentiality notice */}
      <div className="mt-8 text-center">
        <p className="text-[10px]" style={{ color: "var(--muted)" }}>
          This data room and all materials contained herein are strictly confidential.
          Distribution or reproduction without express written consent is prohibited.
        </p>
        <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
          &copy; {new Date().getFullYear()} Conceivable, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
