"use client";

import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  MousePointer,
  UserMinus,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

// Mock current performance data (from Mailchimp warming phase)
const CURRENT_METRICS = {
  openRate: 34.2,
  clickRate: 4.1,
  unsubscribeRate: 0.3,
  deliverability: 97.8,
  signups: 0,
  listSize: 29000,
  signupTarget: 5000,
};

const WEEKLY_TREND = [
  { week: "W-4", openRate: 28.1, clickRate: 2.8, unsub: 0.5 },
  { week: "W-3", openRate: 30.5, clickRate: 3.2, unsub: 0.4 },
  { week: "W-2", openRate: 32.8, clickRate: 3.7, unsub: 0.3 },
  { week: "W-1", openRate: 34.2, clickRate: 4.1, unsub: 0.3 },
];

const ALERTS = [
  {
    type: "success" as const,
    message: "Open rate trending up 6.1% over 4 weeks — warming strategy is working",
  },
  {
    type: "success" as const,
    message: "Unsubscribe rate at 0.3% — well below 1% threshold",
  },
  {
    type: "info" as const,
    message: "Deliverability at 97.8% — healthy for launch readiness",
  },
  {
    type: "warning" as const,
    message: "Click rate (4.1%) has room for growth — test stronger CTAs in Week 3",
  },
];

const AI_RECOMMENDATIONS = [
  {
    label: "10x",
    title: "Move launch email to Tuesday 10 AM based on engagement data",
    description:
      "Your highest open rates correlate with Tuesday/Wednesday mornings. Shifting the launch email from default scheduling to your peak window could significantly increase Day 1 signups. The first email sets the conversion trajectory for the entire sequence.",
    impact: "Potential 15-25% higher open rate on the most important email of the sequence",
  },
  {
    label: "10x",
    title: "Segment launch announcement by engagement tier",
    description:
      "Send the launch email 6 hours early to your top 20% engagers (opened 3+ warmup emails). Their immediate signups become social proof for the broader list send. Include real-time signup counter in the second-wave email.",
    impact: "Creates FOMO momentum. Early converters prove demand for the remaining 80% of list.",
  },
  {
    label: "2x",
    title: "A/B test subject lines on re-engagement emails",
    description:
      "Test curiosity-gap vs. direct-value subject lines on Week 1 emails. Your current subjects lean curiosity-gap. Test a direct variant like 'Your fertility data is telling a story nobody's reading' vs current.",
    impact: "Incremental open rate improvement. Good practice but won't 10x the outcome.",
  },
  {
    label: "10x",
    title: "Add forward-to-friend CTA with incentive in Week 2",
    description:
      "Your list is 29K but your TAM is much larger. Add a 'Know someone on this journey? Forward this email' CTA with a meaningful incentive (priority access, extended trial). Each forward has a 10-15% conversion rate to new subscriber.",
    impact: "Multiplier: grows list beyond current 29K. 10% forward rate = 2,900 new potential signups.",
  },
  {
    label: "2x",
    title: "Optimize preview text for mobile",
    description:
      "62% of email opens are mobile. Some preview texts are too long and get truncated. Shorten to 40 characters max for mobile optimization.",
    impact: "Marginal improvement to open rates on mobile. Worth doing but not transformative.",
  },
];

const FUNNEL_STEPS = [
  { label: "Delivered", value: 29000, pct: 100 },
  { label: "Opened", value: 9918, pct: 34.2 },
  { label: "Clicked", value: 1189, pct: 4.1 },
  { label: "Landed", value: 832, pct: 2.9 },
  { label: "Signed Up", value: 0, pct: 0 },
];

export default function MonitoringDashboard() {
  const alertStyles = {
    success: { bg: "#1EAA5510", border: "#1EAA5530", icon: "text-green-600" },
    warning: { bg: "#F1C02810", border: "#F1C02830", icon: "text-yellow-600" },
    info: { bg: "#5A6FFF10", border: "#5A6FFF30", icon: "text-blue-500" },
    error: { bg: "#E24D4710", border: "#E24D4730", icon: "text-red-500" },
  };

  return (
    <div>
      {/* Signup hero metric */}
      <div
        className="rounded-2xl p-6 mb-6 text-center"
        style={{
          background: "linear-gradient(135deg, #E37FB108 0%, #E24D4708 100%)",
          borderColor: "#E37FB120",
          border: "1px solid #E37FB120",
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.15em] mb-1"
          style={{ color: "var(--muted)" }}
        >
          The Only Metric That Matters
        </p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-bold" style={{ color: "var(--foreground)" }}>
            {CURRENT_METRICS.signups}
          </span>
          <span className="text-lg" style={{ color: "var(--muted-light)" }}>
            / {CURRENT_METRICS.signupTarget.toLocaleString()}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          Early access signups — launches in 5 weeks
        </p>
        {/* Progress bar */}
        <div className="mt-3 mx-auto max-w-md">
          <div className="h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: "#E37FB1",
                width: `${Math.max(1, (CURRENT_METRICS.signups / CURRENT_METRICS.signupTarget) * 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
              Gain: {CURRENT_METRICS.signups} signups from 0
            </span>
            <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
              Target: {CURRENT_METRICS.signupTarget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Open Rate",
            value: `${CURRENT_METRICS.openRate}%`,
            trend: "up",
            threshold: "20%",
            ok: CURRENT_METRICS.openRate >= 20,
            icon: Eye,
          },
          {
            label: "Click Rate",
            value: `${CURRENT_METRICS.clickRate}%`,
            trend: "up",
            threshold: null,
            ok: true,
            icon: MousePointer,
          },
          {
            label: "Unsubscribe",
            value: `${CURRENT_METRICS.unsubscribeRate}%`,
            trend: "down",
            threshold: "< 1%",
            ok: CURRENT_METRICS.unsubscribeRate < 1,
            icon: UserMinus,
          },
          {
            label: "Deliverability",
            value: `${CURRENT_METRICS.deliverability}%`,
            trend: "flat",
            threshold: "> 95%",
            ok: CURRENT_METRICS.deliverability > 95,
            icon: ShieldCheck,
          },
          {
            label: "List Size",
            value: CURRENT_METRICS.listSize.toLocaleString(),
            trend: "flat",
            threshold: null,
            ok: true,
            icon: Target,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border p-4"
              style={{
                borderColor: kpi.ok ? "var(--border)" : "#E24D4740",
                backgroundColor: kpi.ok ? "var(--surface)" : "#E24D4706",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={12} style={{ color: "#E37FB1" }} strokeWidth={2} />
                <span
                  className="text-[9px] uppercase tracking-wider font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {kpi.label}
                </span>
              </div>
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {kpi.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" && <TrendingUp size={10} className="text-green-500" />}
                {kpi.trend === "down" && <TrendingDown size={10} className="text-green-500" />}
                {kpi.threshold && (
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                    Threshold: {kpi.threshold}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend mini-chart */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          4-Week Warming Trend
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {WEEKLY_TREND.map((w) => (
            <div key={w.week} className="text-center">
              <p className="text-[10px] font-medium mb-2" style={{ color: "var(--muted)" }}>
                {w.week}
              </p>
              {/* Simple bar */}
              <div className="mx-auto w-8 h-16 rounded-t-md relative" style={{ backgroundColor: "var(--background)" }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-md"
                  style={{
                    backgroundColor: "#E37FB1",
                    height: `${(w.openRate / 50) * 100}%`,
                    opacity: 0.8,
                  }}
                />
              </div>
              <p className="text-[10px] font-semibold mt-1" style={{ color: "var(--foreground)" }}>
                {w.openRate}%
              </p>
              <p className="text-[8px]" style={{ color: "var(--muted-light)" }}>open</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Health Alerts
        </h3>
        <div className="space-y-2">
          {ALERTS.map((alert, i) => {
            const style = alertStyles[alert.type];
            return (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
              >
                {alert.type === "warning" ? (
                  <AlertTriangle size={13} className={`${style.icon} mt-0.5 shrink-0`} />
                ) : alert.type === "success" ? (
                  <TrendingUp size={13} className={`${style.icon} mt-0.5 shrink-0`} />
                ) : (
                  <ShieldCheck size={13} className={`${style.icon} mt-0.5 shrink-0`} />
                )}
                <p className="text-xs" style={{ color: "var(--foreground)" }}>
                  {alert.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion funnel */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Conversion Funnel
        </h3>
        <div className="space-y-2">
          {FUNNEL_STEPS.map((step, i) => {
            const widthPct = Math.max(8, step.pct);
            const isLast = i === FUNNEL_STEPS.length - 1;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium" style={{ color: "var(--foreground)" }}>
                    {step.label}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                    {step.value.toLocaleString()} ({step.pct}%)
                  </span>
                </div>
                <div className="h-6 rounded-lg overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                  <div
                    className="h-full rounded-lg transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: isLast ? "#E24D47" : "#E37FB1",
                      opacity: isLast && step.value === 0 ? 0.3 : 0.7 + (i * 0.05),
                    }}
                  >
                    {step.pct > 10 && (
                      <span className="text-[9px] text-white font-medium">{step.pct}%</span>
                    )}
                  </div>
                </div>
                {i < FUNNEL_STEPS.length - 1 && (
                  <div className="flex items-center justify-center my-0.5">
                    <ArrowRight size={10} style={{ color: "var(--muted-light)", transform: "rotate(90deg)" }} />
                    <span className="text-[8px] ml-1" style={{ color: "var(--muted-light)" }}>
                      {FUNNEL_STEPS[i + 1].value > 0
                        ? `${((FUNNEL_STEPS[i + 1].value / step.value) * 100).toFixed(1)}% conversion`
                        : "—"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendations (Sullivan Framework) */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} style={{ color: "#E37FB1" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            AI Agent Recommendations
          </h3>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#E37FB110", color: "#C4609A" }}
          >
            Sullivan Framework
          </span>
        </div>
        <div className="space-y-3">
          {AI_RECOMMENDATIONS.map((rec, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: rec.label === "10x" ? "#E37FB106" : "var(--background)",
                border: rec.label === "10x" ? "1px solid #E37FB115" : "1px solid transparent",
              }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                  style={{
                    backgroundColor: rec.label === "10x" ? "#E37FB120" : "#F1C02820",
                    color: rec.label === "10x" ? "#C4609A" : "#B8930A",
                  }}
                >
                  {rec.label}
                </span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {rec.title}
                  </p>
                  <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {rec.description}
                  </p>
                  <p className="text-[10px] mt-1.5 font-medium" style={{ color: "#E37FB1" }}>
                    Impact: {rec.impact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Department Multipliers */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color: "#5A6FFF" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Multiplier Opportunities
          </h3>
        </div>
        <div className="space-y-2">
          {[
            {
              title: "Email → Content Engine",
              desc: "Top-performing email subjects and angles should feed the content calendar. The education emails (W3-4) are pre-tested content topics.",
              label: "10x",
            },
            {
              title: "Email → Fundraising",
              desc: "Email list growth rate + open rate + signup conversion = investor traction metrics. Every email performance data point strengthens the fundraise narrative.",
              label: "10x",
            },
            {
              title: "Email → Operations",
              desc: "Signup velocity is the #1 company KPI during launch. Email performance directly feeds the Operations dashboard.",
              label: "10x",
            },
            {
              title: "Email → Legal",
              desc: "Health claims in emails #8, #9, #11, #15 need compliance review. Route these through Legal before the education phase starts.",
              label: "2x",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2.5 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                style={{
                  backgroundColor: item.label === "10x" ? "#5A6FFF18" : "#F1C02818",
                  color: item.label === "10x" ? "#5A6FFF" : "#B8930A",
                }}
              >
                {item.label}
              </span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {item.title}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
