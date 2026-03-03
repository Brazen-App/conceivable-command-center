"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic,
  Square,
  FileText,
  Link2,
  Upload,
  Send,
  Check,
  Loader2,
  X,
} from "lucide-react";
type CaptureDepartment =
  | "content-engine"
  | "research"
  | "ideas-parking-lot"
  | "legal-review"
  | "email-inspiration"
  | "fundraising-intel";

const DEPARTMENTS: { value: CaptureDepartment; label: string }[] = [
  { value: "content-engine", label: "Content Engine" },
  { value: "research", label: "Research" },
  { value: "ideas-parking-lot", label: "Ideas Parking Lot" },
  { value: "legal-review", label: "Legal Review" },
  { value: "email-inspiration", label: "Email Inspiration" },
  { value: "fundraising-intel", label: "Fundraising Intel" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type ActiveMode = "voice" | "text" | "file" | "link";

export default function QuickCapture() {
  // Modes — multiple can be active
  const [activeModes, setActiveModes] = useState<Set<ActiveMode>>(new Set(["text"]));
  const [department, setDepartment] = useState<CaptureDepartment>("content-engine");

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Text state
  const [textContent, setTextContent] = useState("");

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link state
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSummary, setLinkSummary] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDepartment, setSuccessDepartment] = useState("");

  // Toggle a mode on/off
  const toggleMode = (mode: ActiveMode) => {
    setActiveModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) next.delete(mode);
      else next.add(mode);
      return next;
    });
  };

  // Voice recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        // Simulate transcription (in production, send blob to Whisper API)
        setTranscript(
          textContent || "[Voice memo recorded — transcription would appear here in production]"
        );
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      // Microphone permission denied — fall back silently
    }
  }, [textContent]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // File handling
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // URL summarization
  const summarizeUrl = async () => {
    if (!linkUrl.trim()) return;
    setLinkLoading(true);
    setLinkSummary(null);
    try {
      const res = await fetch("/api/capture/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl.trim() }),
      });
      const data = await res.json();
      if (data.summary) {
        setLinkSummary(`${data.title || linkUrl}: ${data.summary}`);
        if (data.suggestedDepartment) {
          setDepartment(data.suggestedDepartment);
        }
      } else {
        setLinkSummary("Could not summarize — link saved for review.");
      }
    } catch {
      setLinkSummary("Could not summarize — link saved for review.");
    }
    setLinkLoading(false);
  };

  // Submit capture
  const handleSubmit = async () => {
    // Determine what content to send
    const parts: string[] = [];
    let captureType: "voice" | "text" | "file" | "link" = "text";

    if (activeModes.has("voice") && transcript) {
      parts.push(transcript);
      captureType = "voice";
    }
    if (activeModes.has("text") && textContent) {
      parts.push(textContent);
      captureType = transcript ? "voice" : "text";
    }
    if (activeModes.has("link") && linkUrl) {
      parts.push(`[Link] ${linkUrl}${linkSummary ? ` — ${linkSummary}` : ""}`);
      if (!transcript && !textContent) captureType = "link";
    }
    if (activeModes.has("file") && selectedFile) {
      parts.push(`[File] ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`);
      if (!transcript && !textContent && !linkUrl) captureType = "file";
    }

    const content = parts.join("\n\n");
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: captureType,
          content,
          department,
          fileName: selectedFile?.name,
          fileSize: selectedFile?.size,
          summary: linkSummary || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const dept = DEPARTMENTS.find((d) => d.value === data.routedTo);
        setSuccessDepartment(dept?.label || department);
        setShowSuccess(true);
        // Reset all fields
        setTextContent("");
        setTranscript("");
        setSelectedFile(null);
        setLinkUrl("");
        setLinkSummary(null);
        setRecordingSeconds(0);
        // Auto-hide success after 3s
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch {
      // Submission failed silently
    }
    setSubmitting(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const hasContent =
    (activeModes.has("text") && textContent.trim()) ||
    (activeModes.has("voice") && transcript) ||
    (activeModes.has("file") && selectedFile) ||
    (activeModes.has("link") && linkUrl.trim());

  return (
    <div
      className="rounded-3xl p-6 mb-8"
      style={{
        background:
          "linear-gradient(135deg, #5A6FFF08 0%, #ACB7FF08 50%, #78C3BF08 100%)",
        border: "2px solid #5A6FFF18",
        borderRadius: "24px",
      }}
    >
      {/* Greeting */}
      <p
        className="text-sm mb-4"
        style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
      >
        {getGreeting()}, Kirsten — what&apos;s on your mind?
      </p>

      {/* Mode toggles */}
      <div className="flex items-center gap-2 mb-4">
        {(
          [
            { mode: "voice" as const, icon: Mic, label: "Mic" },
            { mode: "text" as const, icon: FileText, label: "Text" },
            { mode: "file" as const, icon: Upload, label: "File" },
            { mode: "link" as const, icon: Link2, label: "Link" },
          ] as const
        ).map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => toggleMode(mode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
            style={
              activeModes.has(mode)
                ? {
                    backgroundColor: "#5A6FFF",
                    color: "#FFFFFF",
                  }
                : {
                    backgroundColor: "var(--surface)",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                  }
            }
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Voice capture */}
      {activeModes.has("voice") && (
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-105 shrink-0"
            style={{
              backgroundColor: isRecording ? "#E24D47" : "#5A6FFF",
              boxShadow: isRecording
                ? "0 0 0 4px #E24D4730, 0 0 20px #E24D4720"
                : "0 2px 8px #5A6FFF30",
            }}
          >
            {isRecording ? (
              <Square size={22} className="text-white" fill="white" />
            ) : (
              <Mic size={28} className="text-white" />
            )}
          </button>
          <div>
            {isRecording ? (
              <div>
                <p className="text-sm font-semibold" style={{ color: "#E24D47" }}>
                  Recording... {formatTime(recordingSeconds)}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Tap to stop
                </p>
              </div>
            ) : transcript ? (
              <div>
                <p className="text-xs font-medium" style={{ color: "#5A6FFF" }}>
                  Recorded
                </p>
                <p
                  className="text-xs mt-0.5 line-clamp-2"
                  style={{ color: "var(--muted)" }}
                >
                  {transcript}
                </p>
              </div>
            ) : (
              <div>
                <p
                  className="text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  Tap mic to start recording
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text input */}
      {activeModes.has("text") && (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Quick thought, idea, or reaction..."
          rows={3}
          className="w-full rounded-xl border p-3 text-sm resize-none mb-3 outline-none focus:ring-2 focus:ring-[#5A6FFF]/20"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            fontFamily: "var(--font-body)",
          }}
        />
      )}

      {/* File dropzone */}
      {activeModes.has("file") && (
        <div
          className={`rounded-xl border-2 border-dashed p-4 mb-3 text-center transition-colors ${
            isDragging ? "border-[#5A6FFF]" : ""
          }`}
          style={{
            borderColor: isDragging ? "#5A6FFF" : "var(--border)",
            backgroundColor: isDragging ? "#5A6FFF08" : "var(--surface)",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
        >
          {selectedFile ? (
            <div className="flex items-center justify-center gap-2">
              <Upload size={14} style={{ color: "#5A6FFF" }} />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {selectedFile.name}
              </span>
              <button onClick={() => setSelectedFile(null)}>
                <X size={12} style={{ color: "var(--muted)" }} />
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Drag & drop a file, or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium underline"
                  style={{ color: "#5A6FFF" }}
                >
                  browse
                </button>
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--muted-light)" }}>
                Images, PDFs, docs
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* URL paste */}
      {activeModes.has("link") && (
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste a URL for AI summary..."
            className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5A6FFF]/20"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") summarizeUrl();
            }}
          />
          <button
            onClick={summarizeUrl}
            disabled={linkLoading || !linkUrl.trim()}
            className="px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            style={{
              backgroundColor: linkLoading ? "var(--background)" : "#5A6FFF",
              color: linkLoading ? "var(--muted)" : "#fff",
            }}
          >
            {linkLoading ? <Loader2 size={14} className="animate-spin" /> : "Summarize"}
          </button>
        </div>
      )}

      {/* Link summary */}
      {linkSummary && (
        <div
          className="rounded-lg p-3 mb-3 text-xs leading-relaxed"
          style={{
            backgroundColor: "#5A6FFF08",
            border: "1px solid #5A6FFF18",
            color: "var(--foreground)",
          }}
        >
          {linkSummary}
        </div>
      )}

      {/* Bottom bar: department + submit */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider shrink-0"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-caption)",
              letterSpacing: "0.1em",
            }}
          >
            Route to:
          </span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as CaptureDepartment)}
            className="flex-1 rounded-lg border px-2.5 py-1.5 text-xs outline-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!hasContent || submitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
          style={{
            backgroundColor: "#5A6FFF",
            color: "#FFFFFF",
          }}
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Capture
        </button>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2"
          style={{
            backgroundColor: "#1EAA5514",
            color: "#1EAA55",
            border: "1px solid #1EAA5520",
          }}
        >
          <Check size={14} />
          Captured and routed to {successDepartment}
        </div>
      )}
    </div>
  );
}
