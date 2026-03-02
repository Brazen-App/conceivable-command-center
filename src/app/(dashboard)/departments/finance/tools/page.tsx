"use client";

import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const ACCENT = "#1EAA55";

type ToolStatus = "connected" | "planned" | "evaluating";

interface FinanceTool {
  name: string;
  purpose: string;
  status: ToolStatus;
  integrationNotes: string;
  website?: string;
  features: string[];
  estimatedCost?: string;
}

const TOOLS: FinanceTool[] = [
  {
    name: "COO Convex Finance Tool",
    purpose: "Real-time financial data aggregation, automated P&L, and budget tracking for the COO dashboard.",
    status: "planned",
    integrationNotes: "Custom-built Convex backend for real-time financial data. Will replace current mock data with live Plaid/Stripe feeds. Priority build once core product launches.",
    features: [
      "Real-time cash position tracking",
      "Automated P&L generation",
      "Budget vs. actual reporting",
      "Cross-department cost allocation",
      "Financial alerts and thresholds",
    ],
    estimatedCost: "Convex: $600/mo (already budgeted)",
  },
  {
    name: "Plaid",
    purpose: "Bank account connectivity for automatic transaction import and categorization.",
    status: "planned",
    integrationNotes: "Connects to Mercury checking and savings accounts. Auto-categorizes transactions. Provides real-time balance updates. Will enable live burn rate calculation.",
    features: [
      "Mercury bank account connection",
      "Transaction auto-import",
      "Spending categorization",
      "Balance alerts",
      "Historical data backfill",
    ],
    estimatedCost: "$0 for development tier, ~$100/mo production",
  },
  {
    name: "Stripe",
    purpose: "Payment processing for subscription revenue, founding member deposits, and one-time purchases.",
    status: "planned",
    integrationNotes: "Will handle all subscription billing when product launches. Founding member pricing at $29/mo. Stripe Billing for recurring revenue. Webhooks for real-time revenue tracking.",
    features: [
      "Subscription billing ($29/mo)",
      "Founding member pricing tiers",
      "Revenue analytics and MRR tracking",
      "Payment failure recovery",
      "Tax calculation and compliance",
    ],
    estimatedCost: "2.9% + $0.30 per transaction",
  },
];

const STATUS_CONFIG: Record<ToolStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Connected", color: "#1EAA55", icon: CheckCircle2 },
  planned: { label: "Planned", color: "#F1C028", icon: Clock },
  evaluating: { label: "Evaluating", color: "#9686B9", icon: AlertCircle },
};

export default function FinanceToolsPage() {
  return (
    <div>
      {/* Intro */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Wrench size={16} style={{ color: ACCENT }} />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Finance Tool Integrations
          </p>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          All finance integrations are currently in planning phase. These will replace mock data with live financial feeds once the core product launches.
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["connected", "planned", "evaluating"] as ToolStatus[]).map((status) => {
          const conf = STATUS_CONFIG[status];
          const count = TOOLS.filter((t) => t.status === status).length;
          const Icon = conf.icon;
          return (
            <div
              key={status}
              className="rounded-2xl border p-5 text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <Icon size={20} className="mx-auto mb-2" style={{ color: conf.color }} />
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {count}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{conf.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tool Cards */}
      <div className="space-y-4">
        {TOOLS.map((tool) => {
          const statusConf = STATUS_CONFIG[tool.status];
          const StatusIcon = statusConf.icon;

          return (
            <div
              key={tool.name}
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {tool.name}
                    </h3>
                    <span
                      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                    >
                      <StatusIcon size={10} />
                      {statusConf.label}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {tool.purpose}
                  </p>
                </div>
                {tool.estimatedCost && (
                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Est. Cost
                    </p>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {tool.estimatedCost}
                    </p>
                  </div>
                )}
              </div>

              {/* Integration Notes */}
              <div
                className="rounded-xl p-3 mb-3"
                style={{ backgroundColor: "var(--background)" }}
              >
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                  Integration Notes
                </p>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  {tool.integrationNotes}
                </p>
              </div>

              {/* Features */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                  Key Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${statusConf.color}10`, color: statusConf.color }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Timeline */}
      <div
        className="rounded-2xl border p-5 mt-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Integration Timeline
        </h3>
        <div className="space-y-3">
          {[
            { phase: "Phase 1: Pre-Launch", date: "March 2026", items: ["Stripe account setup and test mode", "Plaid developer sandbox"], status: "in_progress" },
            { phase: "Phase 2: Launch", date: "April 2026", items: ["Stripe live billing activation", "Plaid production bank connection"], status: "planned" },
            { phase: "Phase 3: Post-Launch", date: "May 2026", items: ["Convex finance tool goes live", "Real-time dashboard replaces mock data", "Automated financial reporting"], status: "planned" },
          ].map((phase) => (
            <div
              key={phase.phase}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                  {phase.phase}
                </p>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {phase.date}
                </span>
              </div>
              <ul className="space-y-1">
                {phase.items.map((item) => (
                  <li key={item} className="text-xs flex items-start gap-2" style={{ color: "var(--muted)" }}>
                    <span style={{ color: ACCENT }}>&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
