"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
  UserMinus,
  Mic,
  Square,
  Upload,
  Send,
  Check,
  Loader2,
  X,
  AlertTriangle,
  Sparkles,
  Target,
  ArrowRight,
  Shield,
  Megaphone,
  Rocket,
  Heart,
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

/* ─── CEO Metric Cards ─── */
const CEO_METRICS = [
  {
    label: "Runway",
    value: "2 mo",
    detail: "$28K/mo burn",
    icon: DollarSign,
    color: "#E24D47",
    alert: true,
  },
  {
    label: "Early Access Signups",
    value: "0",
    target: "5,000",
    icon: Users,
    color: "#5A6FFF",
    progress: 0,
  },
  {
    label: "Revenue (7 days)",
    value: "$0",
    detail: "Pre-launch",
    icon: TrendingUp,
    color: "#1EAA55",
  },
  {
    label: "App Downloads",
    value: "0",
    detail: "Shopify + App Store",
    icon: ShoppingBag,
    color: "#356FB6",
  },
  {
    label: "Conversion Rate",
    value: "—",
    detail: "No traffic yet",
    icon: Target,
    color: "#ACB7FF",
  },
  {
    label: "Churn Rate",
    value: "—",
    detail: "Pre-launch",
    icon: UserMinus,
    color: "#9686B9",
  },
];

/* ─── Cross-Department Alerts ─── */
const ALERTS = [
  {
    department: "Marketing",
    severity: "critical" as const,
    message: "23 launch emails written but 0 sent. Email sequence is the #1 bottleneck to signups.",
    action: "/departments/marketing/email",
    actionLabel: "Open Email Deployment",
    icon: Megaphone,
    accent: "#E37FB1",
  },
  {
    department: "Legal",
    severity: "critical" as const,
    message: "Closed-loop patent provisional filing overdue. Must file before fundraise begins.",
    action: "/departments/legal/patents",
    actionLabel: "View Patents",
    icon: Shield,
    accent: "#E24D47",
  },
  {
    department: "Fundraising",
    severity: "warning" as const,
    message: "14 investors mapped but outreach hasn't started. 2 months runway — bridge round is urgent.",
    action: "/departments/fundraising",
    actionLabel: "Open Fundraising",
    icon: Rocket,
    accent: "#F1C028",
  },
  {
    department: "Community",
    severity: "info" as const,
    message: "220 Circle members — engagement is organic but no structured campaign running.",
    action: "/departments/community",
    actionLabel: "View Community",
    icon: Heart,
    accent: "#E37FB1",
  },
];

const SEVERITY_STYLES = {
  critical: { bg: "#E24D4710", border: "#E24D47", label: "URGENT", labelColor: "#E24D47" },
  warning: { bg: "#F1C02810", border: "#F1C028", label: "WATCH", labelColor: "#F1C028" },
  info: { bg: "#5A6FFF08", border: "#5A6FFF", label: "INFO", labelColor: "#5A6FFF" },
};

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
        {greeting}, Kirsten — what&apos;s on your mind?
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

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {CEO_METRICS.slice(2).map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-shadow"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={12} style={{ color: metric.color }} strokeWidth={2} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {metric.label}
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {metric.value}
              </p>
              {metric.detail && (
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {metric.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Capture */}
      <QuickCaptureWidget />

      {/* Joy's 10x Recommendation */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "linear-gradient(135deg, #F1C02808 0%, #9686B908 100%)",
          border: "1px solid rgba(241, 192, 40, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "#F1C028" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F1C028" }}>
            Joy&apos;s 10x Recommendation
          </span>
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
          Send the first 3 re-engagement emails this week.
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
          The 23 emails are written and compliance-ready. The email list has 28,905 subscribers who haven&apos;t
          heard from Conceivable in months. Every day of delay is lost signups. This is a 10x move —
          one action that unblocks marketing, validates product-market fit, and gives fundraising real traction data.
          The 2x alternative (perfecting the emails further) costs more than it gains.
        </p>
        <Link
          href="/departments/marketing/email"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "#5A6FFF" }}
        >
          Open Email Deployment <ArrowRight size={13} />
        </Link>
      </div>

      {/* Cross-Department Alerts */}
      <section>
        <h2
          className="mb-4"
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
          {ALERTS.map((alert, i) => {
            const Icon = alert.icon;
            const style = SEVERITY_STYLES[alert.severity];
            return (
              <Link
                key={i}
                href={alert.action}
                className="block rounded-xl border-l-4 border p-4 hover:shadow-sm transition-shadow"
                style={{
                  borderColor: "var(--border)",
                  borderLeftColor: style.border,
                  backgroundColor: style.bg,
                }}
              >
                <div className="flex items-start gap-3">
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
                        style={{ backgroundColor: `${style.border}14`, color: style.labelColor }}
                      >
                        {style.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {alert.message}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium"
                      style={{ color: alert.accent }}
                    >
                      {alert.actionLabel} <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
