"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Save, Download, CheckCircle, Clock,
  Send, AlertTriangle, FileText, ChevronDown
} from "lucide-react";
import { PATENT_DRAFTS, type PatentDraftEntry, type DraftStatus } from "@/lib/data/patent-drafts-data";

const ACCENT = "#E24D47";

const STATUS_OPTIONS: { value: DraftStatus; label: string; color: string; icon: typeof FileText }[] = [
  { value: "draft", label: "Draft", color: "#9686B9", icon: FileText },
  { value: "in_progress", label: "In Progress", color: "#F59E0B", icon: Clock },
  { value: "review_ready", label: "Review Ready", color: "#5A6FFF", icon: CheckCircle },
  { value: "filed", label: "Filed", color: "#1EAA55", icon: Send },
  { value: "needs_revision", label: "Needs Revision", color: "#E24D47", icon: AlertTriangle },
];

export default function PatentEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [draft, setDraft] = useState<PatentDraftEntry | null>(null);
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);
  const [status, setStatus] = useState<DraftStatus>("in_progress");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<"idle" | "saving" | "saved">("idle");
  const [wordCount, setWordCount] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  // Load draft
  useEffect(() => {
    const found = PATENT_DRAFTS.find((d) => d.id === id);
    if (found) {
      setDraft(found);
      // Skip "TITLE OF INVENTION" section — it's redundant (title appears in the next section header)
      const filtered = found.sections.filter((s) => s.title !== "TITLE OF INVENTION");
      setSections(filtered.map((s) => ({ ...s })));
      setStatus(found.status);
    }
  }, [id]);

  // Calculate word count
  useEffect(() => {
    const total = sections.reduce((sum, s) => {
      const words = s.content.trim().split(/\s+/).filter(Boolean).length;
      return sum + words;
    }, 0);
    setWordCount(total);
  }, [sections]);

  // Auto-save every 60 seconds
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (hasUnsavedChanges.current) {
        handleSave();
      }
    }, 60000);
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(() => {
    setSaveIndicator("saving");
    // In a real app, this would POST to an API
    // For now, we simulate a save
    setTimeout(() => {
      setSaveIndicator("saved");
      hasUnsavedChanges.current = false;
      setTimeout(() => setSaveIndicator("idle"), 2000);
    }, 500);
  }, []);

  const handleSectionChange = useCallback((index: number, content: string) => {
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], content };
      return updated;
    });
    hasUnsavedChanges.current = true;
  }, []);

  const handleExportDocx = useCallback(() => {
    if (!draft) return;
    // Generate a plain text document for download
    let text = "";
    for (const section of sections) {
      text += section.title + "\n\n";
      text += section.content + "\n\n\n";
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${draft.shortTitle.replace(/\s+/g, "-").toLowerCase()}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [draft, sections]);

  if (!draft) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--muted)" }}>Draft not found</p>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status)!;
  const CurrentStatusIcon = currentStatus.icon;

  return (
    <div className="space-y-0">
      {/* Top Bar */}
      <div
        className="sticky top-0 z-10 -mx-6 md:-mx-8 lg:-mx-10 px-6 md:px-8 lg:px-10 py-3 mb-4"
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => router.push("/departments/legal/patent-drafts")}
              className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ color: "var(--muted)" }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div className="min-w-0">
              <h2
                className="text-sm font-semibold truncate"
                style={{ color: "var(--foreground)" }}
              >
                {draft.shortTitle}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {sections.length} sections
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Save indicator */}
            {saveIndicator === "saving" && (
              <span className="text-xs animate-pulse" style={{ color: "#F59E0B" }}>Saving...</span>
            )}
            {saveIndicator === "saved" && (
              <span className="text-xs" style={{ color: "#1EAA55" }}>Saved</span>
            )}

            {/* Status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: `${currentStatus.color}14`, color: currentStatus.color }}
              >
                <CurrentStatusIcon size={12} />
                {currentStatus.label}
                <ChevronDown size={12} />
              </button>
              {showStatusMenu && (
                <div
                  className="absolute right-0 top-full mt-1 w-44 rounded-lg shadow-lg py-1 z-20"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {STATUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => { setStatus(opt.value); setShowStatusMenu(false); hasUnsavedChanges.current = true; }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:opacity-80 transition-opacity"
                        style={{ color: opt.color }}
                      >
                        <Icon size={14} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#5A6FFF", color: "#F9F7F0" }}
            >
              <Save size={12} />
              Save
            </button>

            {/* Export button */}
            <button
              onClick={handleExportDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-lg overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeSection === i ? "shadow-sm" : ""
            }`}
            style={
              activeSection === i
                ? { backgroundColor: "var(--surface)", color: ACCENT }
                : { color: "var(--muted)" }
            }
          >
            {section.title.length > 25 ? section.title.slice(0, 25) + "..." : section.title}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Section Header */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}
        >
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {sections[activeSection]?.title}
          </h3>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Section {activeSection + 1} of {sections.length}
          </span>
        </div>

        {/* Text Editor */}
        <textarea
          value={sections[activeSection]?.content || ""}
          onChange={(e) => handleSectionChange(activeSection, e.target.value)}
          className="w-full min-h-[600px] p-6 text-sm leading-relaxed resize-none focus:outline-none"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            fontFamily: "var(--font-body), Inter, sans-serif",
          }}
          placeholder="Start writing..."
        />
      </div>

      {/* All sections preview (collapsed) */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Full Application Preview
        </h3>
        <div
          className="rounded-xl p-6 space-y-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {sections.map((section, i) => (
            <div key={i}>
              <h4
                className="text-xs font-bold mb-2 tracking-wider"
                style={{ color: ACCENT, textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                {section.title}
              </h4>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--foreground)" }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
