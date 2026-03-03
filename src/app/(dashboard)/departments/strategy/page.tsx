"use client";

import {
  Target,
  Eye,
  TrendingUp,
  ArrowRight,
  Activity,
  ClipboardList,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Link from "next/link";
import JoyButton from "@/components/joy/JoyButton";

const ACCENT = "#9686B9";

/* ─── Gain Tracker ─── */
interface GainMetric {
  label: string;
  startingPoint: string;
  current: string;
  gain: string;
  target: string;
  percentOfTarget: number;
}

const GAIN_METRICS: GainMetric[] = [
  {
    label: "Email Subscribers",
    startingPoint: "0",
    current: "28,905",
    gain: "+28,905",
    target: "50,000",
    percentOfTarget: 58,
  },
  {
    label: "Community Members",
    startingPoint: "0",
    current: "220",
    gain: "+220",
    target: "5,000",
    percentOfTarget: 4,
  },
  {
    label: "Patent Applications",
    startingPoint: "0",
    current: "5",
    gain: "+5",
    target: "8",
    percentOfTarget: 63,
  },
];

/* ─── Cross-Department Connection Data ─── */
const DEPT_CONNECTIONS = [
  { department: "Operations", status: "green" as const, insight: "All systems operational. 10 departments connected." },
  { department: "Marketing", status: "red" as const, insight: "23 emails written but 0 sent. Launch sequence is the #1 bottleneck." },
  { department: "Product", status: "green" as const, insight: "v1.0 feature complete, ready for early access launch." },
  { department: "Engineering", status: "green" as const, insight: "Infrastructure stable, 99.9% uptime." },
  { department: "Clinical", status: "green" as const, insight: "Pilot data (150-260% improvement) is the strongest pitch asset." },
  { department: "Legal", status: "yellow" as const, insight: "Strong portfolio but closed-loop provisional is overdue." },
  { department: "Finance", status: "red" as const, insight: "~$28K/mo burn. 2 months runway. Connect Mercury + Stripe for real-time tracking." },
  { department: "Fundraising", status: "red" as const, insight: "0 investors contacted. Need to build target 50 list and start outreach." },
  { department: "Community", status: "yellow" as const, insight: "220 Circle members. Need to connect API for engagement metrics." },
];

const STATUS_COLORS = {
  green: "#1EAA55",
  yellow: "#F1C028",
  red: "#E24D47",
};

/* ─── Data Collection Checklist ─── */
const DATA_COLLECTION_ITEMS = [
  {
    label: "Mercury bank feed connected",
    description: "Real-time cash balance, burn rate, and runway calculations",
    department: "Finance",
    complete: false,
  },
  {
    label: "Stripe revenue tracking live",
    description: "Subscription MRR, churn rate, and LTV metrics from production",
    department: "Finance",
    complete: false,
  },
  {
    label: "Mailchimp API integrated",
    description: "Open rates, click rates, unsubscribes, and funnel conversion data",
    department: "Marketing",
    complete: true,
  },
  {
    label: "Circle community API connected",
    description: "Member count, engagement metrics, top threads, and growth rate",
    department: "Community",
    complete: false,
  },
  {
    label: "Google Analytics 4 tracking",
    description: "Site traffic, conversion funnels, top pages, and referral sources",
    department: "Marketing",
    complete: false,
  },
  {
    label: "Linear project management synced",
    description: "Sprint velocity, issue burndown, and cross-department dependency tracking",
    department: "Engineering",
    complete: false,
  },
  {
    label: "Clinical pilot data entered",
    description: "150-260% improvement metrics structured for investor pitch deck",
    department: "Clinical",
    complete: true,
  },
  {
    label: "Patent portfolio cataloged",
    description: "5 patents tracked with filing dates, status, and competitive moat analysis",
    department: "Legal",
    complete: true,
  },
  {
    label: "Investor CRM populated",
    description: "50 target investors with tier, thesis alignment, and warm intro paths",
    department: "Fundraising",
    complete: true,
  },
  {
    label: "Podcast/media tracker",
    description: "120+ podcast appearances cataloged with reach and conversion attribution",
    department: "Marketing",
    complete: false,
  },
];

export default function StrategyDashboardPage() {
  const redCount = DEPT_CONNECTIONS.filter((c) => c.status === "red").length;
  const yellowCount = DEPT_CONNECTIONS.filter((c) => c.status === "yellow").length;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Hero: This Week's 10x Focus */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 80%)` }}
      >
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-white/60" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              This Week&apos;s 10x Focus
            </p>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
            >
              HIGHEST LEVERAGE
            </span>
          </div>
          <p className="text-white font-bold text-xl mb-3 leading-snug">
            Launch the email sequence and make 5 investor calls this week.
          </p>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            These two actions -- turning on the email funnel and making investor calls -- are the only
            two things that move Conceivable from &quot;promising&quot; to &quot;funded and launching.&quot;
            Everything else is either already running or can wait.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/departments/strategy/weekly-brief"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/15 text-white hover:bg-white/25 transition-colors"
            >
              Read Full Brief <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Uncomfortable Truth Card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ backgroundColor: "#2A2828" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} className="text-white/60" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">
            The Uncomfortable Truth
          </h3>
        </div>
        <p className="text-white font-semibold text-base mb-3 leading-snug">
          You&apos;re building a command center when you should be on the phone with investors.
        </p>
        <p className="text-white/70 text-sm leading-relaxed mb-4">
          The Command Center was built so you could spend MORE time on your unique abilities --
          vision, relationships, storytelling -- not so you could spend more time building the
          Command Center. This week, make 5 investor outreach calls. Not emails. Calls.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
              Sullivan Lens (10x vs 2x)
            </p>
            <p className="text-white/70 text-xs leading-relaxed">
              Perfecting internal tools is a 2x move. Getting on the phone with investors is a 10x move.
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#ACB7FF" }}>
              Campbell Lens (First Principles)
            </p>
            <p className="text-white/70 text-xs leading-relaxed">
              &quot;The product doesn&apos;t matter if you can&apos;t fund it. Go have the conversations that fund the mission.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Gain Tracker */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
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
            The Gain Tracker — Measuring from Start, Not from Target
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GAIN_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--muted)" }}
              >
                {metric.label}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                {metric.current}
              </p>

              {/* Gain highlight */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-sm font-bold"
                  style={{ color: "#1EAA55" }}
                >
                  {metric.gain}
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  from {metric.startingPoint}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full mb-2" style={{ backgroundColor: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(metric.percentOfTarget, 100)}%`,
                    backgroundColor: metric.percentOfTarget >= 75 ? "#1EAA55" : metric.percentOfTarget >= 40 ? "#F1C028" : ACCENT,
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {metric.percentOfTarget}% to target
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  Target: {metric.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Connection Status */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} style={{ color: ACCENT }} />
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
            Department Intelligence
          </h2>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {redCount > 0 && <span style={{ color: "#E24D47" }}>{redCount} red</span>}
            {redCount > 0 && yellowCount > 0 && " / "}
            {yellowCount > 0 && <span style={{ color: "#F1C028" }}>{yellowCount} watching</span>}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEPT_CONNECTIONS.map((dept) => {
            const statusColor = STATUS_COLORS[dept.status];
            return (
              <div
                key={dept.department}
                className="rounded-xl border p-4"
                style={{ borderColor: `${statusColor}30`, backgroundColor: `${statusColor}06` }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                  <p className="text-xs font-bold" style={{ color: statusColor }}>
                    {dept.department}
                  </p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {dept.insight}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Collection Dashboard */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList size={14} style={{ color: ACCENT }} />
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
            Data Collection — What Joy Needs to Run the Command Center
          </h2>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {DATA_COLLECTION_ITEMS.filter((i) => i.complete).length} / {DATA_COLLECTION_ITEMS.length} connected
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-4" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(DATA_COLLECTION_ITEMS.filter((i) => i.complete).length / DATA_COLLECTION_ITEMS.length) * 100}%`,
              backgroundColor: "#1EAA55",
            }}
          />
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {DATA_COLLECTION_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="px-5 py-4 flex items-start gap-3"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
                borderBottom: i < DATA_COLLECTION_ITEMS.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              {item.complete ? (
                <CheckCircle2
                  size={18}
                  style={{ color: "#1EAA55" }}
                  className="shrink-0 mt-0.5"
                />
              ) : (
                <Circle
                  size={18}
                  style={{ color: "var(--border)" }}
                  className="shrink-0 mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{
                    color: item.complete ? "var(--muted)" : "var(--foreground)",
                    textDecoration: item.complete ? "line-through" : "none",
                  }}
                >
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.description}
                </p>
              </div>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
              >
                {item.department}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <JoyButton
            agent="executive-coach"
            prompt={`Help me connect the next data source for the Command Center. Currently connected: ${DATA_COLLECTION_ITEMS.filter((i) => i.complete).map((i) => i.label).join(", ")}. Not yet connected: ${DATA_COLLECTION_ITEMS.filter((i) => !i.complete).map((i) => `${i.label} (${i.department})`).join(", ")}. Which should I prioritize next and how do I set it up?`}
            label="Joy: Connect Next Data Source"
          />
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            Each connection gives Joy more intelligence to surface 10x insights across departments.
          </p>
        </div>
      </section>
    </div>
  );
}
