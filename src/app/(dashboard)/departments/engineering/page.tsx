"use client";

import {
  Code2,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  StickyNote,
  Server,
  Database,
  Globe,
  Cpu,
  Bot,
} from "lucide-react";

const ACCENT = "#6B7280";

const KANBAN_COLUMNS = [
  { id: "backlog", label: "Backlog", color: "var(--muted)" },
  { id: "in_progress", label: "In Progress", color: "#5A6FFF" },
  { id: "review", label: "Review", color: "#F1C028" },
  { id: "done", label: "Done", color: "#1EAA55" },
];

const INFRA_STATUS = [
  {
    label: "App (Next.js)",
    icon: Globe,
    status: "operational" as const,
    uptime: "99.9%",
    notes: "Vercel deployment, auto-deploy from main",
  },
  {
    label: "API Layer",
    icon: Server,
    status: "operational" as const,
    uptime: "99.8%",
    notes: "Next.js API routes + Prisma ORM",
  },
  {
    label: "Database (PostgreSQL)",
    icon: Database,
    status: "operational" as const,
    uptime: "99.95%",
    notes: "Vercel Postgres, daily backups",
  },
  {
    label: "Halo Ring Integration",
    icon: Cpu,
    status: "development" as const,
    uptime: "—",
    notes: "BLE SDK integration in progress",
  },
  {
    label: "AI Agents (Claude)",
    icon: Bot,
    status: "operational" as const,
    uptime: "99.7%",
    notes: "Anthropic Claude API, structured prompts",
  },
];

const STATUS_STYLE: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  operational: { label: "Operational", color: "#1EAA55", icon: CheckCircle2 },
  degraded: { label: "Degraded", color: "#F1C028", icon: AlertCircle },
  development: { label: "In Development", color: "#5A6FFF", icon: Clock },
  down: { label: "Down", color: "#E24D47", icon: AlertCircle },
};

export default function EngineeringDepartmentPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Code2 size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Engineering
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Builder — CTO Lakshmi&apos;s Domain
            </p>
          </div>
        </div>
      </header>

      {/* Placeholder Banner */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3">
          <Code2 size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Placeholder — Ready for Lakshmi to design
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              This department will be fully built out once our CTO defines the engineering workflow
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Overview */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} style={{ color: ACCENT }} />
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Architecture Overview
          </h2>
        </div>
        <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: `${ACCENT}30` }}>
          <Layers size={32} className="mx-auto mb-3 opacity-30" style={{ color: ACCENT }} />
          <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
            System architecture diagram will go here
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
            Next.js → API Routes → Prisma → PostgreSQL → Claude AI
          </p>
        </div>
      </div>

      {/* Active Sprints — Empty Kanban */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Active Sprints
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: col.color }}>
                  {col.label}
                </h3>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${col.color}14`, color: col.color }}
                >
                  0
                </span>
              </div>
              <div
                className="rounded-xl border-2 border-dashed p-6 text-center min-h-[120px] flex items-center justify-center"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-[10px]" style={{ color: "var(--muted)", opacity: 0.5 }}>
                  No tickets yet
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Status */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Infrastructure Status
        </h2>
        <div className="space-y-2">
          {INFRA_STATUS.map((infra) => {
            const statusConf = STATUS_STYLE[infra.status];
            const Icon = infra.icon;
            const StatusIcon = statusConf.icon;
            return (
              <div
                key={infra.label}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${ACCENT}10` }}
                >
                  <Icon size={16} style={{ color: ACCENT }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {infra.label}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {infra.notes}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {infra.uptime !== "—" && (
                    <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>
                      {infra.uptime}
                    </span>
                  )}
                  <span
                    className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                  >
                    <StatusIcon size={10} />
                    {statusConf.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <StickyNote size={16} style={{ color: ACCENT }} />
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Notes
          </h2>
        </div>
        <div
          className="rounded-xl border-2 border-dashed p-6"
          style={{ borderColor: `${ACCENT}30` }}
        >
          <textarea
            className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[100px]"
            placeholder="Engineering notes, decisions, and context for Lakshmi..."
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>
    </div>
  );
}
