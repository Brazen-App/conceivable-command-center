"use client";

import {
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";

const ACCENT = "#5A6FFF";

const DEPARTMENT_STATUSES = [
  { name: "Operations", status: "green" as const, metric: "10 depts connected", headline: "All systems operational" },
  { name: "Marketing", status: "red" as const, metric: "0/5,000 signups", headline: "Email sequence ready but unsent" },
  { name: "Product", status: "green" as const, metric: "v1.0 feature complete", headline: "Product ready for early access" },
  { name: "Engineering", status: "green" as const, metric: "99.9% uptime", headline: "Infrastructure stable" },
  { name: "Clinical", status: "green" as const, metric: "150-260% improvement", headline: "Pilot data strong" },
  { name: "Legal", status: "yellow" as const, metric: "1 granted, 4 pending", headline: "Closed-loop provisional overdue" },
  { name: "Finance", status: "green" as const, metric: "$18K/mo burn", headline: "8 months runway" },
  { name: "Fundraising", status: "yellow" as const, metric: "5 active conversations", headline: "Pipeline built, calls not made" },
  { name: "Community", status: "yellow" as const, metric: "847 members, 62% active", headline: "Growing but 40% dormant" },
  { name: "Strategy", status: "green" as const, metric: "Weekly brief active", headline: "Sullivan + Campbell framework online" },
];

const STATUS_COLORS = {
  green: "#1EAA55",
  yellow: "#F1C028",
  red: "#E24D47",
};

const KEY_METRICS = [
  { label: "Email Subscribers", current: "28,905", weekAgo: "28,641", change: "+264", positive: true },
  { label: "Content Pieces/Week", current: "14", weekAgo: "12", change: "+2", positive: true },
  { label: "Community Members", current: "847", weekAgo: "813", change: "+34", positive: true },
  { label: "Active Rate", current: "62%", weekAgo: "65%", change: "-3%", positive: false },
  { label: "Compliance Incidents", current: "0", weekAgo: "0", change: "0", positive: true },
  { label: "Pipeline Value", current: "$5.15M", weekAgo: "$5.15M", change: "$0", positive: true },
];

const MULTIPLIER_OPPORTUNITIES = [
  {
    action: "Send first 3 launch emails, share open rates with investors as traction data",
    departments: ["Marketing", "Fundraising"],
    impact: "10x",
  },
  {
    action: "Launch 7-Day Fertility Reset challenge, document as pitch deck case study",
    departments: ["Community", "Fundraising", "Marketing"],
    impact: "10x",
  },
  {
    action: "File closed-loop provisional patent, add 'patent pending' to all pitch materials",
    departments: ["Legal", "Fundraising"],
    impact: "10x",
  },
];

const THIS_WEEK_PRIORITIES = [
  { priority: "Send first 3 launch emails", owner: "Marketing + Kirsten", status: "not_started" },
  { priority: "Make 5 investor outreach calls", owner: "Kirsten", status: "not_started" },
  { priority: "File closed-loop patent provisional", owner: "Legal", status: "in_progress" },
  { priority: "Launch 7-Day Fertility Reset challenge", owner: "Community", status: "not_started" },
  { priority: "Update pitch deck with latest clinical data", owner: "Fundraising", status: "in_progress" },
];

const PRIORITY_STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "#E24D47" },
  in_progress: { label: "In Progress", color: "#F1C028" },
  done: { label: "Done", color: "#1EAA55" },
};

export default function WeeklyBriefPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 80%)`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-white/60" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            State of Conceivable — Week of March 2, 2026
          </p>
        </div>
        <p className="text-white font-semibold text-lg mb-2">
          The machine is built. This week is about turning it on.
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          All 10 departments are connected. Email sequence is written, product is ready, community is growing,
          clinical data is strong. The gap between &quot;ready&quot; and &quot;launched&quot; is 3 actions:
          send the emails, make the calls, file the patent.
        </p>
      </div>

      {/* Department Status Grid */}
      <section className="mb-8">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {DEPARTMENT_STATUSES.map((dept) => {
            const statusColor = STATUS_COLORS[dept.status];
            return (
              <div
                key={dept.name}
                className="rounded-xl border p-3"
                style={{ borderColor: `${statusColor}30`, backgroundColor: `${statusColor}06` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                    {dept.name}
                  </p>
                </div>
                <p className="text-[11px] font-medium leading-tight mb-0.5" style={{ color: "var(--foreground)" }}>
                  {dept.headline}
                </p>
                <p className="text-[9px]" style={{ color: "var(--muted)" }}>
                  {dept.metric}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mb-8">
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
          Key Metrics — Week over Week
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {KEY_METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted)" }}
              >
                {m.label}
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                {m.current}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp
                  size={10}
                  style={{
                    color: m.positive ? "#1EAA55" : "#E24D47",
                    transform: m.positive ? "none" : "rotate(180deg)",
                  }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: m.positive ? "#1EAA55" : "#E24D47" }}
                >
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Department Multiplier Opportunities */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} style={{ color: "#F1C028" }} />
          <h2
            className="font-caption"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Cross-Department Multiplier Opportunities
          </h2>
        </div>
        <div className="space-y-3">
          {MULTIPLIER_OPPORTUNITIES.map((opp, i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {opp.departments.map((dept) => (
                  <span
                    key={dept}
                    className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                  >
                    {dept}
                  </span>
                ))}
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
                  style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                >
                  {opp.impact}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {opp.action}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* This Week's Priorities */}
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
          This Week&apos;s Priorities
        </h2>
        <div className="space-y-2">
          {THIS_WEEK_PRIORITIES.map((p, i) => {
            const statusConf = PRIORITY_STATUS_CONFIG[p.status as keyof typeof PRIORITY_STATUS_CONFIG];
            return (
              <div
                key={i}
                className="rounded-xl border p-4 flex items-center gap-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {p.priority}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Owner: {p.owner}
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
                  style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                >
                  {statusConf.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
