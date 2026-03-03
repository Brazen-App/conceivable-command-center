"use client";

import { useState } from "react";
import {
  Shield,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MessageSquare,
  Bell,
  Sparkles,
  Send,
} from "lucide-react";

const ACCENT = "#E24D47";

const COMPLIANCE_SCORE = 98;

const PATENT_SUMMARY = {
  total: 5,
  filed: 3,
  provisional: 1,
  critical: 1,
};

const RECENT_ALERTS = [
  { id: "a01", type: "critical" as const, message: "Closed-Loop Physiologic Correction patent: file provisional BEFORE fundraise", date: "2026-02-28", department: "Legal + Fundraising" },
  { id: "a02", type: "warning" as const, message: "3 email testimonials need FTC compliance verification", date: "2026-03-01", department: "Legal + Email" },
  { id: "a03", type: "info" as const, message: "Quarterly HIPAA compliance review due March 15", date: "2026-03-02", department: "Legal" },
  { id: "a04", type: "info" as const, message: "Natural Cycles published new patent filing -- monitor for overlap", date: "2026-02-27", department: "Legal" },
];

function ComplianceScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#1EAA55" : score >= 70 ? "#F1C028" : "#E24D47";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none" stroke={color}
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{score}</span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>/ 100</span>
      </div>
    </div>
  );
}

function AlertBadge({ type }: { type: "critical" | "warning" | "info" }) {
  const config = {
    critical: { bg: "#E24D4718", color: "#E24D47", label: "Critical" },
    warning: { bg: "#F1C02818", color: "#F1C028", label: "Warning" },
    info: { bg: "#356FB618", color: "#356FB6", label: "Info" },
  };
  const c = config[type];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function JoyLegalChat() {
  const [messages, setMessages] = useState<{ role: "user" | "joy"; text: string }[]>([
    {
      role: "joy",
      text: "I'm Joy, your legal operations assistant. I can help with patent strategy, compliance questions, testimonial review, and FDA/FTC guidance. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      {
        role: "joy",
        text: `I'll research "${input}" across our legal knowledge base. This will connect to the Joy AI engine once the Claude API integration is live. For now, I've logged this as a legal question for review.`,
      },
    ]);
    setInput("");
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: `${ACCENT}08`, borderBottom: "1px solid var(--border)" }}
      >
        <Sparkles size={16} style={{ color: "#5A6FFF" }} />
        <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
          Joy: Legal Advisor
        </span>
        <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
          Online
        </span>
      </div>
      <div className="max-h-56 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: "var(--background)" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs p-3 rounded-xl max-w-[85%] ${msg.role === "joy" ? "" : "ml-auto"}`}
            style={{
              backgroundColor: msg.role === "joy" ? "var(--surface)" : `#5A6FFF14`,
              color: "var(--foreground)",
              border: msg.role === "joy" ? "1px solid var(--border)" : "none",
            }}
          >
            {msg.role === "joy" && (
              <span className="text-[10px] font-bold block mb-1" style={{ color: "#5A6FFF" }}>
                Joy
              </span>
            )}
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3" style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Joy about patents, compliance, FDA..."
          className="flex-1 text-xs px-3 py-2 rounded-lg outline-none"
          style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: "#5A6FFF", color: "white" }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

export default function LegalDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero: Compliance Score */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
          Compliance Score
        </p>
        <ComplianceScoreRing score={COMPLIANCE_SCORE} />
        <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
          Composite of FDA claims, FTC advertising, HIPAA compliance, and testimonial verification
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            The Gain: Started at 62 -- now at {COMPLIANCE_SCORE} (+{COMPLIANCE_SCORE - 62} points)
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patent Portfolio */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Patent Portfolio
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{PATENT_SUMMARY.total}</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>total filings</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5518", color: "#1EAA55" }}>
              {PATENT_SUMMARY.filed} filed
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02818", color: "#F1C028" }}>
              {PATENT_SUMMARY.provisional} provisional
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}>
              {PATENT_SUMMARY.critical} critical
            </span>
          </div>
        </div>

        {/* Active Compliance Reviews */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} style={{ color: "#356FB6" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Compliance Reviews
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>7</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>active reviews</p>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>FDA claims</span>
              <CheckCircle2 size={12} style={{ color: "#1EAA55" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>FTC advertising</span>
              <CheckCircle2 size={12} style={{ color: "#1EAA55" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--muted)" }}>HIPAA</span>
              <Clock size={12} style={{ color: "#F1C028" }} />
            </div>
          </div>
        </div>

        {/* Testimonial Compliance */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} style={{ color: "#9686B9" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Testimonial Status
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>12</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>testimonials tracked</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5518", color: "#1EAA55" }}>
              8 compliant
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02818", color: "#F1C028" }}>
              3 needs disclaimer
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}>
              1 non-compliant
            </span>
          </div>
        </div>

        {/* Alerts */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} style={{ color: "#F1C028" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Active Alerts
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {RECENT_ALERTS.length}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>recent flags</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}>
              {RECENT_ALERTS.filter((a) => a.type === "critical").length} critical
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02818", color: "#F1C028" }}>
              {RECENT_ALERTS.filter((a) => a.type === "warning").length} warning
            </span>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Recent Flags & Alerts
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {RECENT_ALERTS.map((alert) => (
            <div key={alert.id} className="px-5 py-3 flex items-start gap-3">
              <AlertTriangle
                size={16}
                style={{ color: alert.type === "critical" ? "#E24D47" : alert.type === "warning" ? "#F1C028" : "#356FB6" }}
                className="shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="text-sm" style={{ color: "var(--foreground)" }}>{alert.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <AlertBadge type={alert.type} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{alert.date}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{alert.department}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Joy Legal Advisor */}
      <JoyLegalChat />

      {/* Sullivan: Compliance as Moat */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: "#9686B910", border: "1px solid #9686B920" }}
      >
        <div className="flex items-start gap-3">
          <div className="px-2 py-1 rounded text-xs font-bold shrink-0" style={{ backgroundColor: "#9686B920", color: "#9686B9" }}>
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Multiplier: Compliance Infrastructure as Competitive Moat
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Patent portfolio + HIPAA compliance + FDA-aware claims = barriers competitors cannot easily replicate.
              The Closed-Loop patent filing before fundraise is the single highest-leverage legal action. Impacts
              Legal, Fundraising, and Clinical simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
