"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mail,
  PenTool,
  Shield,
  DollarSign,
  Rocket,
  Heart,
  Megaphone,
  Users,
  FileCheck,
  Mic,
  Square,
  Upload,
  Send,
  Check,
  Loader2,
  X,
} from "lucide-react";

const ACCENT = "#5A6FFF";

/* ─── Pulse Score ─── */
function PulseScore({ score }: { score: number }) {
  const color =
    score >= 80 ? "#1EAA55" : score >= 60 ? "#F1C028" : "#E24D47";
  const label =
    score >= 80 ? "Healthy" : score >= 60 ? "Needs Attention" : "Critical";
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
      style={{
        background: `linear-gradient(135deg, ${ACCENT}08 0%, ${color}06 100%)`,
        border: `2px solid ${ACCENT}18`,
      }}
    >
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{ color, fontFamily: "var(--font-display)" }}
          >
            {score}
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Pulse
          </span>
        </div>
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Conceivable Pulse Score
        </p>
        <p className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          {label}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Composite health score across all 10 departments.
          Tracks email growth, content velocity, runway, compliance, IP protection, and community engagement.
        </p>
      </div>
    </div>
  );
}

/* ─── KPI Cards ─── */
const KPI_CARDS = [
  { label: "Email Subscribers", value: "28,905", target: "50,000", icon: Mail, accent: "#5A6FFF" },
  { label: "Content / Day", value: "14", target: "100", icon: PenTool, accent: "#5A6FFF" },
  { label: "Runway (Mo)", value: "8", target: null, icon: DollarSign, accent: "#1EAA55" },
  { label: "Early Access Signups", value: "0", target: "5,000", icon: Users, accent: "#ACB7FF" },
  { label: "Compliance Incidents", value: "0", target: "0", icon: Shield, accent: "#E24D47" },
  { label: "Patent Applications", value: "5", target: null, icon: FileCheck, accent: "#78C3BF" },
  { label: "Pipeline Value", value: "$5.15M", target: null, icon: Rocket, accent: "#356FB6" },
];

/* ─── Cross-Department Alerts ─── */
const CROSS_DEPT_ALERTS = [
  {
    department: "Legal",
    severity: "red" as const,
    message: "Closed-loop patent provisional filing is overdue. File before fundraise begins.",
    accent: "#E24D47",
    icon: Shield,
  },
  {
    department: "Marketing",
    severity: "red" as const,
    message: "23 launch emails written but 0 sent. Email sequence is the #1 bottleneck to signups.",
    accent: "#5A6FFF",
    icon: Megaphone,
  },
  {
    department: "Community",
    severity: "yellow" as const,
    message: "39.7% of community members are dormant. 7-Day Fertility Reset challenge recommended.",
    accent: "#1EAA55",
    icon: Heart,
  },
  {
    department: "Fundraising",
    severity: "yellow" as const,
    message: "18 investors mapped, 5 active conversations. Pipeline built but calls not yet made.",
    accent: "#356FB6",
    icon: Rocket,
  },
];

const SEVERITY_COLORS = {
  red: "#E24D47",
  yellow: "#F1C028",
  green: "#1EAA55",
};

/* ─── Quick Capture (simplified inline version with all 10 depts) ─── */
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
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = () => {};
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      /* microphone permission denied */
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
      className="rounded-3xl p-6 mb-8"
      style={{
        background: "linear-gradient(135deg, #5A6FFF08 0%, #ACB7FF08 50%, #78C3BF08 100%)",
        border: "2px solid #5A6FFF18",
        borderRadius: "24px",
      }}
    >
      <p className="text-sm mb-4" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>
        {greeting}, Kirsten — what&apos;s on your mind?
      </p>

      {/* Input row: mic + text + file + link */}
      <div className="flex items-start gap-3 mb-4">
        {/* Mic button */}
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

        {/* Text input */}
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
              fontFamily: "var(--font-body)",
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

      {/* File + URL row */}
      <div className="flex gap-2 mb-4 flex-wrap">
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
        <div className="flex-1 min-w-[200px]">
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
            onChange={(e) => setDepartment(e.target.value)}
            className="flex-1 rounded-lg border px-2.5 py-1.5 text-xs outline-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
          style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Capture
        </button>
      </div>

      {showSuccess && (
        <div
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium"
          style={{
            backgroundColor: "#1EAA5514",
            color: "#1EAA55",
            border: "1px solid #1EAA5520",
          }}
        >
          <Check size={14} />
          Captured and routed to {CAPTURE_DEPARTMENTS.find((d) => d.value === department)?.label || department}
        </div>
      )}
    </div>
  );
}

/* ─── Main Operations Dashboard Page ─── */
export default function OperationsDashboardPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Pulse Score Hero Metric */}
      <PulseScore score={68} />

      {/* Quick Capture */}
      <QuickCaptureWidget />

      {/* Company KPIs */}
      <section className="mb-10">
        <h2
          className="font-caption mb-4"
          style={{
            fontFamily: "var(--font-caption)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Company KPIs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {KPI_CARDS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="rounded-xl border p-4"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={12} style={{ color: kpi.accent }} strokeWidth={2} />
                  <span
                    className="font-caption"
                    style={{
                      fontFamily: "var(--font-caption)",
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {kpi.label}
                  </span>
                </div>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                >
                  {kpi.value}
                </p>
                {kpi.target && (
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: "var(--muted-light)", fontFamily: "var(--font-body)" }}
                  >
                    Target: {kpi.target}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-Department Alerts */}
      <section className="mb-10">
        <h2
          className="font-caption mb-4"
          style={{
            fontFamily: "var(--font-caption)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Cross-Department Alerts
        </h2>
        <div className="space-y-3">
          {CROSS_DEPT_ALERTS.map((alert, i) => {
            const Icon = alert.icon;
            const sevColor = SEVERITY_COLORS[alert.severity];
            return (
              <div
                key={i}
                className="rounded-xl border-l-4 border p-4 flex items-start gap-3"
                style={{
                  borderColor: "var(--border)",
                  borderLeftColor: sevColor,
                  backgroundColor: "var(--surface)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${alert.accent}14` }}
                >
                  <Icon size={16} style={{ color: alert.accent }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${alert.accent}14`, color: alert.accent }}
                    >
                      {alert.department}
                    </span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${sevColor}14`, color: sevColor }}
                    >
                      {alert.severity === "red" ? "URGENT" : "WATCH"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
