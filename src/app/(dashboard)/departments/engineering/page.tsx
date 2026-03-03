"use client";

import {
  CheckCircle2,
  Clock,
  AlertCircle,
  GitPullRequest,
  Gauge,
  Server,
  Database,
  Globe,
  ArrowRight,
  TrendingUp,
  LayoutList,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const ACCENT = "#6B7280";

/* ── System Health Data ── */
const SYSTEM_STATUS = "operational" as const; // green

const DEPLOYMENT = {
  lastDeploy: "2026-03-02 09:14 AM",
  environment: "Production",
  platform: "Vercel",
  branch: "main",
  commit: "a3f8b2c",
  status: "success" as const,
};

const DB_HEALTH = {
  status: "healthy",
  orm: "Prisma",
  database: "PostgreSQL",
  connectionPool: "8/20 active",
  avgQueryTime: "12ms",
  totalTables: 14,
  totalRows: "2.4K",
};

const API_METRICS = {
  avgResponseTime: "145ms",
  endpoints: 23,
  successRate: "99.8%",
  requestsToday: 1_247,
};

const OPEN_ISSUES = 8;
const OPEN_PRS = 3;
const BUILD_SUCCESS_RATE = 97.2;

const STATUS_ICON_MAP = {
  operational: { icon: CheckCircle2, color: "#1EAA55", label: "All Systems Operational" },
  degraded: { icon: AlertCircle, color: "#F1C028", label: "Degraded Performance" },
  down: { icon: AlertCircle, color: "#E24D47", label: "System Outage" },
};

export default function EngineeringDashboardPage() {
  const statusConf = STATUS_ICON_MAP[SYSTEM_STATUS];
  const StatusIcon = statusConf.icon;

  return (
    <div>
      {/* Hero: System Health */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, ${statusConf.color}18, ${statusConf.color}08)`,
          border: `1px solid ${statusConf.color}25`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: statusConf.color }}
            >
              System Health
            </p>
            <h2
              className="text-xl font-bold flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <StatusIcon size={24} style={{ color: statusConf.color }} />
              {statusConf.label}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Last checked: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} -- Uptime: 99.9%
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: statusConf.color }}>
                99.9%
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>Uptime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Deployment Status */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Deployment
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Last Deploy</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DEPLOYMENT.lastDeploy}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Platform</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DEPLOYMENT.platform}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Branch</span>
              <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>{DEPLOYMENT.branch}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Commit</span>
              <span className="text-xs font-mono" style={{ color: "var(--foreground)" }}>{DEPLOYMENT.commit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Status</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
              >
                <CheckCircle2 size={10} />
                Success
              </span>
            </div>
          </div>
        </div>

        {/* Database Health */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Database size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Database
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Status</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
              >
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Stack</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DB_HEALTH.orm} + {DB_HEALTH.database}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Pool</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DB_HEALTH.connectionPool}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Avg Query</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DB_HEALTH.avgQueryTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Tables / Rows</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{DB_HEALTH.totalTables} / {DB_HEALTH.totalRows}</span>
            </div>
          </div>
        </div>

        {/* API Health */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Server size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              API Health
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Avg Response</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{API_METRICS.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Endpoints</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{API_METRICS.endpoints}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Success Rate</span>
              <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>{API_METRICS.successRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--muted)" }}>Requests Today</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{API_METRICS.requestsToday.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Issues, PRs, Build Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <GitPullRequest size={20} className="mx-auto mb-2" style={{ color: "#F1C028" }} />
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{OPEN_ISSUES}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Open Issues</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <GitPullRequest size={20} className="mx-auto mb-2" style={{ color: "#5A6FFF" }} />
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>{OPEN_PRS}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Open PRs</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <TrendingUp size={20} className="mx-auto mb-2" style={{ color: "#1EAA55" }} />
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>{BUILD_SUCCESS_RATE}%</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Build Success Rate</p>
        </div>
      </div>

      {/* Linear Integration */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LayoutList size={16} style={{ color: "#5A6FFF" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Linear Project Management
          </h3>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}
          >
            NOT CONNECTED
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Connect Linear to sync issues, sprints, and roadmap directly into the Command Center.
          Once connected, Joy will track velocity, flag blockers, and surface cross-department dependencies automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--muted)" }}>—</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>Active Sprints</p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--muted)" }}>—</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>Open Issues</p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--muted)" }}>—</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>Sprint Velocity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
            style={{ backgroundColor: "#5A6FFF" }}
          >
            <ExternalLink size={12} />
            Connect Linear API
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
          >
            <Sparkles size={12} />
            Joy: Set Up Integration
          </button>
        </div>
      </div>

      {/* Cross-Department */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Gauge size={16} style={{ color: ACCENT }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Cross-Department Connection
          </h3>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>
            10x
          </span>
        </div>
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}
        >
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Infrastructure reliability enables Product velocity
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              99.9% uptime means zero deployment blockers for Product sprints. API response times under 200ms ensure a smooth user experience for the 50-Factor Dashboard and Halo Ring sync features currently in development.
            </p>
          </div>
          <ArrowRight size={16} style={{ color: ACCENT }} />
        </div>
      </div>
    </div>
  );
}
