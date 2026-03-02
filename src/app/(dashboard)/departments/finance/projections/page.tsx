"use client";

import { useState } from "react";
import { TrendingUp, Target, AlertCircle, Calculator } from "lucide-react";

const ACCENT = "#1EAA55";

/* ── Scenario Data ── */
interface Scenario {
  id: string;
  label: string;
  type: "conservative" | "base" | "optimistic";
  runwayMonths: number | "infinite";
  monthlyBurn: number;
  monthlyRevenue: number;
  subscribers: number;
  pricePerMonth: number;
  netMonthly: number;
  description: string;
  assumptions: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "conservative",
    label: "Conservative",
    type: "conservative",
    runwayMonths: 6.9,
    monthlyBurn: 18_400,
    monthlyRevenue: 3_300,
    subscribers: 0,
    pricePerMonth: 0,
    netMonthly: -15_100,
    description: "Current state: advisory revenue only, no subscription launch. Maintaining disciplined spend.",
    assumptions: [
      "No product launch in projection window",
      "Burn rate stays flat at $18.4K/mo",
      "Advisory revenue: $2,500/mo",
      "Affiliate revenue: $800/mo (growing 5% MoM)",
      "No additional fundraising",
    ],
  },
  {
    id: "base",
    label: "Base Case",
    type: "base",
    runwayMonths: 25.2,
    monthlyBurn: 18_400,
    monthlyRevenue: 17_800,
    subscribers: 500,
    pricePerMonth: 29,
    netMonthly: -600,
    description: "Launch with 500 founding members at $29/mo. Revenue nearly covers burn. Near break-even.",
    assumptions: [
      "Product launch in April 2026",
      "500 founding members by June (10% of 5,000 goal)",
      "Price: $29/mo subscription",
      "Advisory and affiliate continue",
      "Burn may increase slightly with growth costs",
    ],
  },
  {
    id: "optimistic",
    label: "Optimistic",
    type: "optimistic",
    runwayMonths: "infinite",
    monthlyBurn: 20_000,
    monthlyRevenue: 32_300,
    subscribers: 1_000,
    pricePerMonth: 29,
    netMonthly: 12_300,
    description: "1,000 subscribers. Cash flow positive. Generating $12.3K/mo net profit. Infinite runway.",
    assumptions: [
      "Product launch in April 2026",
      "1,000 members by August (20% of 5,000 goal)",
      "Price: $29/mo subscription",
      "Burn increases to $20K with hiring",
      "Self-sustaining -- can reinvest profits in growth",
    ],
  },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  conservative: { color: "#F1C028", bg: "#F1C02810" },
  base: { color: "#5A6FFF", bg: "#5A6FFF10" },
  optimistic: { color: "#1EAA55", bg: "#1EAA5510" },
};

/* ── Break-Even Analysis ── */
const BREAK_EVEN = {
  subscribersNeeded: 521,
  atPrice: 29,
  monthlyBurnTarget: 18_400,
  revenueOtherSources: 3_300,
  revenueNeededFromSubs: 15_100,
  description: "At current burn of $18.4K/mo with $3.3K other revenue, need 521 subscribers at $29/mo to break even.",
};

/* ── Key Assumptions ── */
const KEY_ASSUMPTIONS = [
  { assumption: "Monthly churn rate: 5%", confidence: "medium" as const, note: "Industry avg for health apps is 6-8%. Our clinical approach may reduce this." },
  { assumption: "CAC: $12-18 via content engine", confidence: "high" as const, note: "Organic content + email already generating warm leads at minimal cost." },
  { assumption: "LTV: $290-520 (12-18 mo retention)", confidence: "medium" as const, note: "Based on $29/mo price and projected retention. Will validate post-launch." },
  { assumption: "Burn stays under $20K through Q2", confidence: "high" as const, note: "5 months of decreasing burn demonstrate cost discipline." },
  { assumption: "Launch by April 2026", confidence: "high" as const, note: "Core features (Halo Ring, 50-Factor Dashboard, Onboarding) on track." },
  { assumption: "5,000 founding member waitlist", confidence: "medium" as const, note: "Currently at 2,847 email subscribers. Growth rate supports this by launch." },
];

const CONFIDENCE_CONFIG: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "#1EAA55" },
  medium: { label: "Medium", color: "#F1C028" },
  low: { label: "Low", color: "#E24D47" },
};

export default function ProjectionsPage() {
  const [activeScenario, setActiveScenario] = useState<string>("base");

  return (
    <div>
      {/* Scenario Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {SCENARIOS.map((s) => {
          const conf = TYPE_CONFIG[s.type];
          const isActive = activeScenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s.id)}
              className={`flex-1 min-w-[140px] rounded-xl border p-4 text-left transition-all ${isActive ? "shadow-sm" : ""}`}
              style={{
                borderColor: isActive ? conf.color : "var(--border)",
                backgroundColor: isActive ? conf.bg : "var(--surface)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: conf.color }}>
                {s.label}
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
                {s.runwayMonths === "infinite" ? "Infinite" : `${s.runwayMonths} mo`}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                runway
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail */}
      {(() => {
        const s = SCENARIOS.find((sc) => sc.id === activeScenario)!;
        const conf = TYPE_CONFIG[s.type];
        return (
          <div
            className="rounded-2xl border p-5 mb-6"
            style={{ borderColor: conf.color, backgroundColor: conf.bg }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: conf.color }} />
              <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {s.label} Scenario
              </h3>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              {s.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Monthly Burn</p>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>${s.monthlyBurn.toLocaleString()}</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Monthly Revenue</p>
                <p className="text-sm font-bold" style={{ color: ACCENT }}>${s.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Subscribers</p>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{s.subscribers.toLocaleString()}</p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Net Monthly</p>
                <p className="text-sm font-bold" style={{ color: s.netMonthly >= 0 ? ACCENT : "#E24D47" }}>
                  {s.netMonthly >= 0 ? "+" : ""}${s.netMonthly.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Assumptions:</p>
              <ul className="space-y-1">
                {s.assumptions.map((a, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--muted)" }}>
                    <span style={{ color: conf.color }}>&#8226;</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* Break-Even Analysis */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Break-Even Analysis
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: `${ACCENT}08` }}>
            <p className="text-3xl font-bold" style={{ color: ACCENT }}>
              {BREAK_EVEN.subscribersNeeded}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Subscribers Needed</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
              ${BREAK_EVEN.atPrice}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Price Per Month</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
              ${BREAK_EVEN.revenueNeededFromSubs.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Monthly Sub Revenue Needed</p>
          </div>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {BREAK_EVEN.description}
        </p>
      </div>

      {/* Key Assumptions */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Key Assumptions
          </h3>
        </div>
        <div className="space-y-2">
          {KEY_ASSUMPTIONS.map((a, i) => {
            const conf = CONFIDENCE_CONFIG[a.confidence];
            return (
              <div
                key={i}
                className="rounded-xl border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {a.assumption}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                      {a.note}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
                  >
                    {conf.label} confidence
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
