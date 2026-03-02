"use client";

import {
  Mail,
  PenTool,
  Shield,
  DollarSign,
  Rocket,
  Brain,
  ArrowRight,
  Activity,
  TrendingUp,
  AlertCircle,
  Users,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

const KPI_CARDS = [
  {
    label: "Email List Size",
    value: "—",
    target: "10,000",
    trend: "flat" as const,
    icon: Mail,
  },
  {
    label: "Content / Day",
    value: "—",
    target: "100",
    trend: "flat" as const,
    icon: PenTool,
  },
  {
    label: "Compliance Incidents",
    value: "0",
    target: "0",
    trend: "flat" as const,
    icon: Shield,
  },
  {
    label: "Runway (Months)",
    value: "—",
    target: null,
    trend: "flat" as const,
    icon: DollarSign,
  },
  {
    label: "Active Signups",
    value: "—",
    target: null,
    trend: "flat" as const,
    icon: Users,
  },
  {
    label: "Patent Applications",
    value: "—",
    target: null,
    trend: "flat" as const,
    icon: FileCheck,
  },
];

const DEPARTMENT_STATUS = [
  {
    name: "Email Strategy",
    status: "green" as const,
    summary: "23 launch emails ready. Mailchimp integration pending.",
    href: "/departments/email",
    icon: Mail,
    color: "#5A6FFF",
  },
  {
    name: "Content Engine",
    status: "yellow" as const,
    summary: "Pipeline setup in progress. Source library needs population.",
    href: "/departments/content",
    icon: PenTool,
    color: "#1EAA55",
  },
  {
    name: "Legal / IP / Compliance",
    status: "yellow" as const,
    summary: "Critical patent filing needed before fundraise.",
    href: "/departments/legal",
    icon: Shield,
    color: "#356FB6",
  },
  {
    name: "Finance",
    status: "yellow" as const,
    summary: "Pending integration with COO finance tool.",
    href: "/departments/finance",
    icon: DollarSign,
    color: "#F1C028",
  },
  {
    name: "Fundraising",
    status: "yellow" as const,
    summary: "Data room and pitch materials in preparation.",
    href: "/departments/fundraising",
    icon: Rocket,
    color: "#E24D47",
  },
  {
    name: "Strategy / Coaching",
    status: "yellow" as const,
    summary: "CEO weekly brief system being built.",
    href: "/departments/strategy",
    icon: Brain,
    color: "#9686B9",
  },
];

const STATUS_COLORS = {
  green: "var(--status-success)",
  yellow: "var(--status-warning)",
  red: "var(--status-error)",
};

export default function OperationsDashboard() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-wide"
          style={{ color: "var(--foreground)" }}
        >
          Operations
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {greeting} — here&apos;s the state of Conceivable.
        </p>
      </div>

      {/* Status Banner */}
      <div
        className="rounded-xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)",
        }}
      >
        <Activity className="text-white shrink-0" size={24} />
        <div className="flex-1">
          <p className="text-white font-medium">Command Center Active</p>
          <p className="text-white/70 text-sm">
            7 departments connected. Weekly briefing system initializing.
          </p>
        </div>
        <Link
          href="/departments/strategy"
          className="hidden sm:flex px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 items-center gap-2 whitespace-nowrap"
        >
          CEO Brief <ArrowRight size={14} />
        </Link>
      </div>

      {/* KPI Grid */}
      <section className="mb-10">
        <h2
          className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
          style={{ color: "var(--muted)", fontFamily: "var(--font-caption)" }}
        >
          Company KPIs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: "var(--brand-primary)" }} />
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    {kpi.label}
                  </span>
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {kpi.value}
                </div>
                {kpi.target && (
                  <div
                    className="text-[10px] mt-1"
                    style={{ color: "var(--muted-light)" }}
                  >
                    Target: {kpi.target}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Department Status */}
      <section className="mb-10">
        <h2
          className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
          style={{ color: "var(--muted)", fontFamily: "var(--font-caption)" }}
        >
          Department Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENT_STATUS.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link
                key={dept.href}
                href={dept.href}
                className="group rounded-xl border p-5 hover:shadow-md transition-shadow"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${dept.color}12` }}
                    >
                      <Icon size={18} style={{ color: dept.color }} />
                    </div>
                    <div>
                      <h3
                        className="font-medium text-sm"
                        style={{ color: "var(--foreground)" }}
                      >
                        {dept.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: STATUS_COLORS[dept.status],
                      }}
                    />
                    <span
                      className="text-[10px] capitalize"
                      style={{
                        color: STATUS_COLORS[dept.status],
                      }}
                    >
                      {dept.status}
                    </span>
                  </div>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {dept.summary}
                </p>
                <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    View department
                  </span>
                  <ArrowRight size={12} style={{ color: "var(--brand-primary)" }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Alerts Section (placeholder) */}
      <section>
        <h2
          className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
          style={{ color: "var(--muted)", fontFamily: "var(--font-caption)" }}
        >
          Active Alerts
        </h2>
        <div
          className="rounded-xl border p-6 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <AlertCircle
            size={24}
            className="mx-auto mb-2"
            style={{ color: "var(--muted-light)" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No active cross-department alerts
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
            Alerts will appear here when departments flag issues for each other.
          </p>
        </div>
      </section>
    </div>
  );
}
