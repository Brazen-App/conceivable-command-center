"use client";

import { useState, useEffect } from "react";
import { DollarSign, Wallet, BarChart3, FileText } from "lucide-react";
import CashPositionBurn from "@/components/departments/finance/CashPositionBurn";
import PLDashboard from "@/components/departments/finance/PLDashboard";
import InvestorReadyFinancials from "@/components/departments/finance/InvestorReadyFinancials";
import type {
  CashPosition,
  BurnMetrics,
  PLData,
  FinancialSummary,
} from "@/lib/data/finance-data";

const ACCENT = "#1EAA55";

const TABS = [
  { id: "cash", label: "Cash Position & Burn", icon: Wallet },
  { id: "pl", label: "P&L Dashboard", icon: BarChart3 },
  { id: "investor", label: "Investor-Ready Financials", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function FinanceDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("cash");
  const [cash, setCash] = useState<CashPosition | null>(null);
  const [burn, setBurn] = useState<BurnMetrics | null>(null);
  const [pl, setPl] = useState<PLData | null>(null);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance")
      .then((r) => r.json())
      .then((data) => {
        setCash(data.cashPosition ?? null);
        setBurn(data.burnMetrics ?? null);
        setPl(data.plData ?? null);
        setSummary(data.financialSummary ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !cash || !burn || !pl || !summary) {
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading Finance...</p>
        </div>
      </div>
    );
  }

  // Runway indicator for the banner
  const runwayColor = burn.runwayMonths > 6 ? ACCENT : burn.runwayMonths > 3 ? "#F1C028" : "#E24D47";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <DollarSign size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
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
              Finance
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
              Cash Position, P&L, and Investor Reporting — Powered by Convex
            </p>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}0A`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <DollarSign size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              ${cash.currentBalance.toLocaleString()} cash on hand &middot;{" "}
              <span style={{ color: runwayColor }}>{burn.runwayMonths.toFixed(1)} months runway</span>
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              ${burn.monthlyBurn.toLocaleString()}/mo burn &middot; Runway extended +{burn.runwayExtendedDays} days this month
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: ACCENT }}>
            +{burn.runwayExtendedDays}
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            days gained
          </span>
        </div>
      </div>

      {/* Mock data notice */}
      <div
        className="rounded-lg px-3 py-2 mb-6 flex items-center gap-2"
        style={{ backgroundColor: "#F1C02810", border: "1px solid #F1C02820" }}
      >
        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02818", color: "#B8930A" }}>
          MOCK
        </span>
        <p className="text-[11px]" style={{ color: "var(--muted)" }}>
          Displaying mock data. Will connect to COO&apos;s Convex finance tool for live Plaid/Stripe data.
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "cash" && <CashPositionBurn cash={cash} burn={burn} />}
      {activeTab === "pl" && <PLDashboard data={pl} />}
      {activeTab === "investor" && <InvestorReadyFinancials summary={summary} />}
    </div>
  );
}
