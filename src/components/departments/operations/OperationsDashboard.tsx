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
  AlertCircle,
  Users,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

const KPI_CARDS = [
  { label: "Email List Size", value: "—", target: "10,000", icon: Mail },
  { label: "Content / Day", value: "—", target: "100", icon: PenTool },
  { label: "Compliance", value: "0", target: "0", icon: Shield },
  { label: "Runway (Mo)", value: "—", target: null, icon: DollarSign },
  { label: "Active Signups", value: "—", target: null, icon: Users },
  { label: "Patents", value: "—", target: null, icon: FileCheck },
];

const DEPARTMENT_STATUS = [
  {
    name: "Email Strategy",
    status: "green" as const,
    summary: "23 launch emails ready. Mailchimp integration pending.",
    href: "/departments/email",
    icon: Mail,
    accent: "#ACB7FF",
  },
  {
    name: "Content Engine",
    status: "yellow" as const,
    summary: "Pipeline setup in progress. Source library needs population.",
    href: "/departments/content",
    icon: PenTool,
    accent: "#1EAA55",
  },
  {
    name: "Legal / IP / Compliance",
    status: "yellow" as const,
    summary: "Critical patent filing needed before fundraise.",
    href: "/departments/legal",
    icon: Shield,
    accent: "#356FB6",
  },
  {
    name: "Finance",
    status: "yellow" as const,
    summary: "Pending integration with COO finance tool.",
    href: "/departments/finance",
    icon: DollarSign,
    accent: "#F1C028",
  },
  {
    name: "Fundraising",
    status: "yellow" as const,
    summary: "Data room and pitch materials in preparation.",
    href: "/departments/fundraising",
    icon: Rocket,
    accent: "#E24D47",
  },
  {
    name: "Strategy / Coaching",
    status: "yellow" as const,
    summary: "CEO weekly brief system being built.",
    href: "/departments/strategy",
    icon: Brain,
    accent: "#9686B9",
  },
];

const STATUS_DOT: Record<string, string> = {
  green: "var(--status-success)",
  yellow: "var(--status-warning)",
  red: "var(--status-error)",
};

export default function OperationsDashboard() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Page header */}
      <header className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            color: "var(--foreground)",
          }}
        >
          Operations
        </h1>
        <p
          className="mt-1 text-sm font-normal"
          style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          {greeting} — here&apos;s the state of Conceivable.
        </p>
      </header>

      {/* Status banner — brand gradient */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 60%, #78C3BF 100%)",
        }}
      >
        <Activity className="text-white shrink-0" size={22} strokeWidth={2} />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Command Center Active</p>
          <p className="text-white/60 text-xs mt-0.5">
            7 departments connected. Weekly briefing system initializing.
          </p>
        </div>
        <Link
          href="/departments/strategy"
          className="hidden sm:flex px-4 py-2 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors items-center gap-1.5 whitespace-nowrap"
        >
          CEO Brief <ArrowRight size={12} />
        </Link>
      </div>

      {/* KPI Grid */}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  <Icon size={12} style={{ color: "var(--brand-primary)" }} strokeWidth={2} />
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

      {/* Department Status */}
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
          Department Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEPARTMENT_STATUS.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link
                key={dept.href}
                href={dept.href}
                className="group rounded-xl border p-5 hover:shadow-md transition-all duration-150"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${dept.accent}14` }}
                    >
                      <Icon size={16} style={{ color: dept.accent }} strokeWidth={1.8} />
                    </div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
                    >
                      {dept.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: STATUS_DOT[dept.status] }}
                    />
                    <span
                      className="text-[10px] capitalize font-medium"
                      style={{ color: STATUS_DOT[dept.status], fontFamily: "var(--font-body)" }}
                    >
                      {dept.status}
                    </span>
                  </div>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
                >
                  {dept.summary}
                </p>
                <div className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--brand-primary)", fontFamily: "var(--font-body)" }}
                  >
                    View department
                  </span>
                  <ArrowRight size={11} style={{ color: "var(--brand-primary)" }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Alerts */}
      <section>
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
          Active Alerts
        </h2>
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <AlertCircle
            size={22}
            className="mx-auto mb-2"
            style={{ color: "var(--muted-light)" }}
            strokeWidth={1.5}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No active cross-department alerts
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
            Alerts appear here when departments flag issues for each other.
          </p>
        </div>
      </section>
    </div>
  );
}
