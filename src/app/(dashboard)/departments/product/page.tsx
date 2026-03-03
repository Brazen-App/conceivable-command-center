"use client";

import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Beaker,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

const ACCENT = "#ACB7FF";

/* ── Sprint Data ── */
const CURRENT_SPRINT = {
  name: "Sprint 7 - Core Fertility Engine",
  progress: 62,
  startDate: "2026-02-17",
  endDate: "2026-03-02",
};

const SPRINT_PRIORITIES = [
  { title: "Halo Ring BLE Sync", status: "in_progress" as const, owner: "Lakshmi" },
  { title: "50-Factor Dashboard v1", status: "in_progress" as const, owner: "Lakshmi" },
  { title: "Onboarding Flow Assessment", status: "done" as const, owner: "Product" },
  { title: "Ovulation Detection Model", status: "review" as const, owner: "Lakshmi" },
  { title: "Clinical Report Export", status: "backlog" as const, owner: "Product" },
];

const FEATURE_STATS = {
  total: 12,
  shipped: 0,
  inEngineering: 2,
  ready: 1,
  defined: 3,
  researching: 3,
  idea: 3,
};

/* ── Verticals Mini Grid ── */
const VERTICALS_MINI = [
  { name: "Pre-Period", score: 0, status: "future" },
  { name: "Period Problems", score: 0, status: "planned" },
  { name: "PCOS", score: 0, status: "planned" },
  { name: "Endometriosis", score: 0, status: "future" },
  { name: "Infertility", score: 72, status: "active" },
  { name: "Pregnancy", score: 0, status: "research" },
  { name: "Postpartum", score: 0, status: "future" },
  { name: "Perimenopause", score: 0, status: "planned" },
  { name: "Menopause", score: 0, status: "future" },
  { name: "Post-Menopause", score: 0, status: "future" },
];

const STATUS_COLORS: Record<string, string> = {
  in_progress: "#5A6FFF",
  done: "#1EAA55",
  review: "#F1C028",
  backlog: "var(--muted)",
  active: "#1EAA55",
  planned: "#5A6FFF",
  research: "#F1C028",
  future: "var(--muted)",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  done: "Done",
  review: "Review",
  backlog: "Backlog",
  active: "Active",
  planned: "Planned",
  research: "Research",
  future: "Future",
};

export default function ProductDashboardPage() {
  return (
    <div>
      {/* Hero: Build Status */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}08)`,
          border: `1px solid ${ACCENT}25`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: ACCENT }}
            >
              Build Status
            </p>
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {CURRENT_SPRINT.name}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {CURRENT_SPRINT.startDate} - {CURRENT_SPRINT.endDate}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className="text-4xl font-bold"
                style={{ color: ACCENT }}
              >
                {CURRENT_SPRINT.progress}%
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Sprint Complete
              </p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div
          className="mt-4 h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: `${ACCENT}20` }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${CURRENT_SPRINT.progress}%`,
              backgroundColor: ACCENT,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sprint Priorities */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: ACCENT }} />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Sprint Priorities
            </h3>
          </div>
          <div className="space-y-2">
            {SPRINT_PRIORITIES.map((item, i) => {
              const color = STATUS_COLORS[item.status];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  {item.status === "done" ? (
                    <CheckCircle2 size={16} style={{ color }} />
                  ) : item.status === "in_progress" ? (
                    <Clock size={16} style={{ color }} />
                  ) : item.status === "review" ? (
                    <AlertCircle size={16} style={{ color }} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: color }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {item.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {item.owner}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: `${color}14`, color }}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Completion Stats */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} style={{ color: ACCENT }} />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Feature Completion
            </h3>
          </div>
          <div className="text-center mb-4">
            <p className="text-5xl font-bold" style={{ color: ACCENT }}>
              {FEATURE_STATS.total}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Total Features Tracked
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Shipped", count: FEATURE_STATS.shipped, color: "#1EAA55" },
              { label: "In Engineering", count: FEATURE_STATS.inEngineering, color: "#5A6FFF" },
              { label: "Ready", count: FEATURE_STATS.ready, color: "#1EAA55" },
              { label: "Defined", count: FEATURE_STATS.defined, color: "#F1C028" },
              { label: "Researching", count: FEATURE_STATS.researching, color: "#9686B9" },
              { label: "Idea", count: FEATURE_STATS.idea, color: ACCENT },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-2 text-center"
                style={{ backgroundColor: `${stat.color}10` }}
              >
                <p className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.count}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conceivable Experiences */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid size={16} style={{ color: ACCENT }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Conceivable Experiences
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            10 Verticals
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {VERTICALS_MINI.map((v) => {
            const statusColor = STATUS_COLORS[v.status] || "var(--muted)";
            return (
              <Link
                key={v.name}
                href={`/departments/product/verticals?v=${encodeURIComponent(v.name)}`}
                className="rounded-xl border p-3 text-left transition-all hover:shadow-sm block"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                }}
              >
                <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {v.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-lg font-bold"
                    style={{ color: v.score > 0 ? ACCENT : "var(--muted)" }}
                  >
                    {v.score}
                  </span>
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${statusColor}14`, color: statusColor }}
                  >
                    {STATUS_LABELS[v.status]}
                  </span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: `${ACCENT}15` }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${v.score}%`, backgroundColor: v.score > 0 ? ACCENT : "transparent" }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cross-Department Connection */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Beaker size={16} style={{ color: "#9686B9" }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Cross-Department Connection
          </h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#9686B914", color: "#9686B9" }}>
            10x
          </span>
        </div>
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: "#9686B908", border: "1px solid #9686B915" }}
        >
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Clinical research feeding product features
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              8 research papers from the Clinical department directly inform 4 core features: Ovulation Detection, Glucose Variability Module, Stress Insights, and AI Coaching. Every clinical finding maps to a product capability.
            </p>
          </div>
          <ArrowRight size={16} style={{ color: "#9686B9" }} />
        </div>
      </div>
    </div>
  );
}
