"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic,
  Square,
  Upload,
  Send,
  Check,
  Loader2,
  X,
  AlertTriangle,
  Target,
  ArrowRight,
  Shield,
  Mail,
  Clock,
  Link2,
} from "lucide-react";
import Link from "next/link";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";

const ACCENT = "#5A6FFF";

/* ─── Launch Countdown ─── */
function LaunchCountdown() {
  // Launch target: 7 weeks from now (configurable)
  const launchDate = new Date("2026-04-20");
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksLeft = Math.ceil(daysLeft / 7);

  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{
        background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 60%, #78C3BF 100%)",
      }}
    >
      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">
        Days to Launch
      </p>
      <p className="text-6xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {daysLeft}
      </p>
      <p className="text-white/70 text-sm">{weeksLeft} weeks remaining</p>
    </div>
  );
}

/* ─── 5 CEO Priorities (Dan Sullivan Framework) ─── */
const CEO_PRIORITIES = [
  {
    number: 1,
    label: "HIGHEST ROI",
    title: "Send First 3 Re-engagement Emails",
    description:
      "28,905 subscribers haven't heard from you. Every day of delay = lost signups. This one action unblocks the entire funnel.",
    type: "10x Multiplier",
    link: "/departments/marketing/email",
    color: "#5A6FFF",
    icon: Mail,
  },
  {
    number: 2,
    label: "BIGGEST RISK",
    title: "File Closed-Loop Patent",
    description:
      "Provisional must be filed before fundraise begins. Competitors are active. This protects your core IP.",
    type: "Risk/Blocker",
    link: "/departments/legal/patents",
    color: "#E24D47",
    icon: Shield,
  },
  {
    number: 3,
    label: "TIME-SENSITIVE",
    title: "Start Bridge Round Outreach",
    description:
      "2 months runway at $28K/mo burn. 14 investors mapped, 0 contacted. Every week without outreach narrows your options.",
    type: "Deadline",
    link: "/departments/fundraising",
    color: "#F1C028",
    icon: Clock,
  },
  {
    number: 4,
    label: "UNIQUE ABILITY",
    title: "Record 3 POV Takes (5 min each)",
    description:
      "Your unique ability is vision + storytelling. Record quick takes on today's fertility news \u2014 agents multiply each into 5+ content pieces.",
    type: "CEO Unique Ability",
    link: "/departments/marketing/content",
    color: "#9686B9",
    icon: Mic,
  },
  {
    number: 5,
    label: "CROSS-DEPARTMENT",
    title: "Connect Mailchimp for Email Warmup",
    description:
      "Email warmup takes 2-3 weeks. Starting now means ready for launch. This unblocks Marketing, gives Fundraising traction data, and validates product-market fit.",
    type: "Cross-Dept Multiplier",
    link: "/departments/marketing/email-ops",
    color: "#1EAA55",
    icon: Link2,
  },
];

/* ─── Quick Capture ─── */
const CAPTURE_DEPARTMENTS = [
  { value: "operations", label: "Operations" },
  { value: "marketing", label: "Marketing" },
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "clinical", label: "Clinical" },
  { value: "legal", label: "Legal" },
  { value: "finance", label: "Finance" },
  { value: "fundraising", label: "Fundraising" },
  { value: "community", label: "Community" },
  { value: "strategy", label: "Strategy" },
];

function QuickCaptureWidget() {
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [department, setDepartment] = useState("operations");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (chunks.length > 0) {
          setTextContent((prev) => prev + (prev ? "\n" : "") + "[Voice memo recorded]");
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access is required for voice capture. Please allow microphone access in your browser settings.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!textContent.trim() && !linkUrl.trim() && !selectedFile) return;
    setSubmitting(true);
    try {
      const parts: string[] = [];
      if (textContent.trim()) parts.push(textContent);
      if (linkUrl.trim()) parts.push(`[Link] ${linkUrl}`);
      if (selectedFile) parts.push(`[File] ${selectedFile.name}`);

      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          content: parts.join("\n\n"),
          department,
        }),
      });
      setShowSuccess(true);
      setTextContent("");
      setLinkUrl("");
      setSelectedFile(null);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      /* submission error */
    }
    setSubmitting(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: "linear-gradient(135deg, #5A6FFF06 0%, #ACB7FF06 50%, #78C3BF06 100%)",
        border: "1px solid rgba(90, 111, 255, 0.1)",
      }}
    >
      <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
        {greeting}, Kirsten &mdash; what&apos;s on your mind?
      </p>
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
          style={{
            backgroundColor: isRecording ? "#E24D47" : ACCENT,
            boxShadow: isRecording ? "0 0 0 3px #E24D4730" : `0 2px 8px ${ACCENT}30`,
          }}
        >
          {isRecording ? (
            <Square size={14} className="text-white" fill="white" />
          ) : (
            <Mic size={18} className="text-white" />
          )}
        </button>
        <div className="flex-1">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Quick thought, idea, or reaction..."
            rows={2}
            className="w-full rounded-xl border p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-[#5A6FFF]/20"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: "#E24D47" }}>
            Recording... {formatTime(recordingSeconds)}
          </span>
        </div>
      )}

      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: selectedFile ? ACCENT : "var(--surface)",
            color: selectedFile ? "#fff" : "var(--muted)",
            border: selectedFile ? "none" : "1px solid var(--border)",
          }}
        >
          <Upload size={13} />
          {selectedFile ? selectedFile.name : "Upload File"}
          {selectedFile && (
            <X
              size={12}
              className="ml-1 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
            />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedFile(file);
          }}
        />
        <div className="flex-1 min-w-[180px]">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste a URL..."
            className="w-full rounded-lg border px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#5A6FFF]/20"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0" style={{ color: "var(--muted)" }}>
            Route to:
          </span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="flex-1 rounded-lg border px-2.5 py-1.5 text-xs outline-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          >
            {CAPTURE_DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={(!textContent.trim() && !linkUrl.trim() && !selectedFile) || submitting}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
          style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Capture
        </button>
      </div>

      {showSuccess && (
        <div
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
          style={{ backgroundColor: "#1EAA5514", color: "#1EAA55", border: "1px solid #1EAA5520" }}
        >
          <Check size={14} />
          Captured and routed to {CAPTURE_DEPARTMENTS.find((d) => d.value === department)?.label || department}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function OperationsDashboardPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      <CompanyGoalsBanner departmentFocus="Get first re-engagement emails sent this week" />

      {/* Hero: Launch Countdown + Runway Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <LaunchCountdown />

        {/* Runway - RED ALERT */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-center"
          style={{
            background: "linear-gradient(135deg, #E24D4708 0%, #E24D4712 100%)",
            border: "2px solid #E24D4730",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} style={{ color: "#E24D47" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#E24D47" }}>
              Runway Alert
            </span>
          </div>
          <p className="text-4xl font-bold mb-1" style={{ color: "#E24D47", fontFamily: "var(--font-display)" }}>
            2 months
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            ~$28K/mo burn rate. Bridge round critical.
          </p>
          <Link
            href="/departments/fundraising"
            className="mt-3 flex items-center gap-1 text-xs font-medium"
            style={{ color: "#E24D47" }}
          >
            Open Fundraising <ArrowRight size={11} />
          </Link>
        </div>

        {/* Signups Progress */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-center"
          style={{
            background: "linear-gradient(135deg, #5A6FFF06 0%, #ACB7FF08 100%)",
            border: "1px solid rgba(90, 111, 255, 0.15)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#5A6FFF" }}>
            Early Access Signups
          </p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
              0
            </span>
            <span className="text-sm mb-1" style={{ color: "var(--muted)" }}>/ 5,000</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
            <div className="h-2 rounded-full" style={{ width: "1%", backgroundColor: "#5A6FFF" }} />
          </div>
          <p className="text-[10px] mt-2" style={{ color: "var(--muted)" }}>
            Email sequence launch is the #1 lever
          </p>
        </div>
      </div>

      {/* Quick Capture */}
      <QuickCaptureWidget />

      {/* 5 Things That Need Your Attention */}
      <AttentionSection />
    </div>
  );
}

function AttentionSection() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cc-dismissed-priorities");
      if (saved) setDismissed(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, []);

  const handleDismiss = (num: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(dismissed);
    next.add(num);
    setDismissed(next);
    localStorage.setItem("cc-dismissed-priorities", JSON.stringify([...next]));
  };

  const handleRestore = () => {
    setDismissed(new Set());
    localStorage.removeItem("cc-dismissed-priorities");
  };

  const visible = CEO_PRIORITIES.filter((p) => !dismissed.has(p.number));

  return (
    <section className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Target size={16} style={{ color: ACCENT }} />
          </div>
          <div>
            <h2
              className="text-sm font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {visible.length > 0 ? `${visible.length} Things That Need Your Attention` : "All caught up!"}
            </h2>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              {visible.length > 0 ? "Ranked by leverage. Do these and everything else moves forward." : "You've handled everything. Nice work."}
            </p>
          </div>
          </div>
          {dismissed.size > 0 && (
            <button
              onClick={handleRestore}
              className="text-[10px] px-2 py-1 rounded-md"
              style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Restore {dismissed.size} dismissed
            </button>
          )}
        </div>

        <div className="space-y-3">
          {visible.map((priority) => {
            const Icon = priority.icon;
            return (
              <div
                key={priority.number}
                className="group block rounded-xl border overflow-hidden hover:shadow-md transition-all relative"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                {/* Done button */}
                <button
                  onClick={(e) => handleDismiss(priority.number, e)}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={{ backgroundColor: "#1EAA5518", color: "#1EAA55", border: "1px solid #1EAA5530" }}
                >
                  <Check size={10} /> Done
                </button>

                <Link href={priority.link} className="flex items-stretch">
                  {/* Numbered badge column */}
                  <div
                    className="flex flex-col items-center justify-center px-4 py-5 shrink-0"
                    style={{
                      backgroundColor: `${priority.color}10`,
                      borderRight: `1px solid ${priority.color}20`,
                      minWidth: "64px",
                    }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: priority.color, fontFamily: "var(--font-display)" }}
                    >
                      {priority.number}
                    </span>
                    <span
                      className="text-[8px] font-bold uppercase tracking-wider mt-1 text-center leading-tight"
                      style={{ color: priority.color }}
                    >
                      {priority.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={14} style={{ color: priority.color }} strokeWidth={2} />
                      <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {priority.title}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                      {priority.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${priority.color}14`, color: priority.color }}
                      >
                        {priority.type}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: priority.color }}
                      >
                        Take Action <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
  );
}
