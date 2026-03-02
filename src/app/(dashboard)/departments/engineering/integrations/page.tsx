"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plug,
  Activity,
} from "lucide-react";

const ACCENT = "#6B7280";

type IntegrationStatus = "connected" | "disconnected" | "error" | "planned";

interface Integration {
  name: string;
  status: IntegrationStatus;
  lastSync: string;
  requestsToday: number;
  errorRate: string;
  description: string;
}

const INTEGRATIONS: Integration[] = [
  {
    name: "Anthropic API (Claude)",
    status: "connected",
    lastSync: "2 min ago",
    requestsToday: 198,
    errorRate: "0.1%",
    description: "Primary AI engine for agent system, content generation, coaching, and structured analysis.",
  },
  {
    name: "Google AI (Gemini)",
    status: "connected",
    lastSync: "15 min ago",
    requestsToday: 23,
    errorRate: "0%",
    description: "Multi-model fallback. Used for embedding generation and secondary analysis tasks.",
  },
  {
    name: "Prisma Database",
    status: "connected",
    lastSync: "Live",
    requestsToday: 847,
    errorRate: "0%",
    description: "PostgreSQL via Prisma ORM. Connection pooling active. Schema version: 14.",
  },
  {
    name: "Mailchimp",
    status: "connected",
    lastSync: "1 hr ago",
    requestsToday: 12,
    errorRate: "0%",
    description: "Email marketing platform. 23 launch sequence emails configured. List management active.",
  },
  {
    name: "Late.dev",
    status: "connected",
    lastSync: "3 hrs ago",
    requestsToday: 8,
    errorRate: "0%",
    description: "Social media scheduling and management. Content calendar integration.",
  },
  {
    name: "Vercel",
    status: "connected",
    lastSync: "Live",
    requestsToday: 1247,
    errorRate: "0.2%",
    description: "Hosting platform. Auto-deploy from main. Edge functions. Analytics and Speed Insights.",
  },
  {
    name: "GitHub",
    status: "connected",
    lastSync: "5 min ago",
    requestsToday: 34,
    errorRate: "0%",
    description: "Source code repository. CI/CD pipeline triggers. Issue tracking integration.",
  },
];

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Connected", color: "#1EAA55", icon: CheckCircle2 },
  disconnected: { label: "Disconnected", color: "var(--muted)", icon: XCircle },
  error: { label: "Error", color: "#E24D47", icon: AlertTriangle },
  planned: { label: "Planned", color: "#F1C028", icon: Clock },
};

/* ── Connection Logs ── */
const CONNECTION_LOGS = [
  { time: "09:14 AM", event: "Vercel deploy triggered", integration: "Vercel", type: "info" as const },
  { time: "09:12 AM", event: "Claude API: batch prompt cached (12 queries)", integration: "Anthropic", type: "success" as const },
  { time: "08:45 AM", event: "Mailchimp: audience sync complete (2,847 contacts)", integration: "Mailchimp", type: "success" as const },
  { time: "08:30 AM", event: "GitHub: PR #47 merged to main", integration: "GitHub", type: "info" as const },
  { time: "07:15 AM", event: "Database backup completed", integration: "Prisma", type: "success" as const },
  { time: "06:00 AM", event: "Late.dev: 3 posts scheduled for today", integration: "Late.dev", type: "info" as const },
  { time: "Yesterday 11:45 PM", event: "Gemini API: embedding batch processed (45 docs)", integration: "Gemini", type: "success" as const },
  { time: "Yesterday 09:30 PM", event: "Vercel: edge function cold start spike (2.1s)", integration: "Vercel", type: "warning" as const },
];

const LOG_TYPE_COLORS: Record<string, string> = {
  success: "#1EAA55",
  info: "#5A6FFF",
  warning: "#F1C028",
  error: "#E24D47",
};

export default function IntegrationsPage() {
  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const totalRequests = INTEGRATIONS.reduce((a, i) => a + i.requestsToday, 0);

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>
            {connectedCount}/{INTEGRATIONS.length}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Connected</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {totalRequests.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Requests Today</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>
            0
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Active Errors</p>
        </div>
      </div>

      {/* Integration Status Grid */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Plug size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            API Connections
          </h3>
        </div>
        <div className="space-y-2">
          {INTEGRATIONS.map((integration) => {
            const statusConf = STATUS_CONFIG[integration.status];
            const StatusIcon = statusConf.icon;

            return (
              <div
                key={integration.name}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {integration.name}
                      </p>
                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                      >
                        <StatusIcon size={10} />
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Last Sync</p>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{integration.lastSync}</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Requests</p>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{integration.requestsToday}</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Error Rate</p>
                    <p className="text-xs font-medium" style={{ color: integration.errorRate === "0%" ? "#1EAA55" : "#F1C028" }}>{integration.errorRate}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Logs */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Connection Logs
          </h3>
        </div>
        <div className="space-y-1">
          {CONNECTION_LOGS.map((log, i) => {
            const typeColor = LOG_TYPE_COLORS[log.type] || "var(--muted)";
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-[var(--background)] transition-colors"
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                <span className="text-[10px] font-mono shrink-0 w-32" style={{ color: "var(--muted)" }}>
                  {log.time}
                </span>
                <span className="text-xs flex-1 min-w-0 truncate" style={{ color: "var(--foreground)" }}>
                  {log.event}
                </span>
                <span className="text-[9px] shrink-0" style={{ color: "var(--muted)" }}>
                  {log.integration}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
