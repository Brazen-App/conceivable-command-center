"use client";

import {
  CheckCircle2,
  Clock,
  Globe,
  Database,
  Server,
  HardDrive,
  AlertTriangle,
  Gauge,
} from "lucide-react";

const ACCENT = "#6B7280";

/* ── Infrastructure Data ── */
const INFRA_ITEMS = [
  {
    label: "Vercel Deployment",
    icon: Globe,
    status: "operational" as const,
    uptime: "99.9%",
    description: "Auto-deploy from main branch. Edge functions enabled. Serverless API routes.",
    metrics: [
      { label: "Region", value: "US East (iad1)" },
      { label: "Build Time", value: "~45s avg" },
      { label: "Deploy Count", value: "147 this month" },
    ],
  },
  {
    label: "PostgreSQL Database",
    icon: Database,
    status: "operational" as const,
    uptime: "99.95%",
    description: "Prisma ORM with PostgreSQL. Daily backups. Connection pooling via PgBouncer.",
    metrics: [
      { label: "Connection Pool", value: "8/20 active" },
      { label: "Avg Query Time", value: "12ms" },
      { label: "Storage Used", value: "156 MB / 1 GB" },
    ],
  },
  {
    label: "API Layer",
    icon: Server,
    status: "operational" as const,
    uptime: "99.8%",
    description: "Next.js API routes. 23 endpoints. Rate limiting enabled. CORS configured.",
    metrics: [
      { label: "Endpoints", value: "23 active" },
      { label: "Avg Response", value: "145ms" },
      { label: "Requests Today", value: "1,247" },
    ],
  },
  {
    label: "AI Services (Claude)",
    icon: Gauge,
    status: "operational" as const,
    uptime: "99.7%",
    description: "Anthropic Claude API for agent system, content generation, and structured briefs.",
    metrics: [
      { label: "Daily Calls", value: "~200" },
      { label: "Avg Latency", value: "1.2s" },
      { label: "Monthly Cost", value: "$6,800" },
    ],
  },
];

const STATUS_CONFIG = {
  operational: { label: "Operational", color: "#1EAA55", icon: CheckCircle2 },
  degraded: { label: "Degraded", color: "#F1C028", icon: AlertTriangle },
  development: { label: "In Development", color: "#5A6FFF", icon: Clock },
  down: { label: "Down", color: "#E24D47", icon: AlertTriangle },
};

/* ── Summary Stats ── */
const SUMMARY = {
  overallUptime: "99.9%",
  storageUsed: "156 MB",
  storageTotal: "1 GB",
  storagePct: 15.6,
  errorRate: "0.2%",
  totalEndpoints: 23,
};

export default function InfrastructurePage() {
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>
            {SUMMARY.overallUptime}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Overall Uptime</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {SUMMARY.totalEndpoints}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>API Endpoints</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>
            {SUMMARY.errorRate}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Error Rate</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <HardDrive size={14} style={{ color: ACCENT }} />
          </div>
          <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            {SUMMARY.storageUsed}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>of {SUMMARY.storageTotal}</p>
          <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: `${ACCENT}15` }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${SUMMARY.storagePct}%`, backgroundColor: ACCENT }}
            />
          </div>
        </div>
      </div>

      {/* Infrastructure Items */}
      <div className="space-y-4">
        {INFRA_ITEMS.map((item) => {
          const statusConf = STATUS_CONFIG[item.status];
          const Icon = item.icon;
          const StatusIcon = statusConf.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${ACCENT}10` }}
                >
                  <Icon size={20} style={{ color: ACCENT }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {item.label}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                        {item.uptime} uptime
                      </span>
                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                      >
                        <StatusIcon size={10} />
                        {statusConf.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                    {item.description}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {item.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-lg p-2"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          {m.label}
                        </p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--foreground)" }}>
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
