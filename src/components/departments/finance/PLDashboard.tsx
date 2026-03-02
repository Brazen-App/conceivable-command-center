"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";
import type { PLData, CostItem, RunwayProjection } from "@/lib/data/finance-data";

const ACCENT = "#1EAA55";

interface Props {
  data: PLData;
}

function CostSection({ item, accentColor }: { item: CostItem; accentColor: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-lg border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            {item.category}
          </p>
        </div>
        <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
          ${item.total.toLocaleString()}
        </span>
        {expanded ? (
          <ChevronDown size={12} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronRight size={12} style={{ color: "var(--muted)" }} />
        )}
      </div>
      {expanded && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="space-y-1.5 mt-2">
            {item.subcategories.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="text-[11px]" style={{ color: "var(--foreground)" }}>
                    {sub.name}
                  </span>
                  {sub.note && (
                    <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                      {sub.note}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                  ${sub.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ projection, isActive }: { projection: RunwayProjection; isActive: boolean }) {
  const isPositive = projection.runwayMonths >= 999;
  const runwayColor = isPositive ? ACCENT : projection.runwayMonths > 6 ? ACCENT : projection.runwayMonths > 3 ? "#F1C028" : "#E24D47";

  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: isActive ? `${ACCENT}40` : "var(--border)",
        backgroundColor: isActive ? `${ACCENT}06` : "var(--surface)",
      }}
    >
      {isActive && (
        <span
          className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block"
          style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
        >
          Current
        </span>
      )}
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>
        {projection.label}
      </p>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold" style={{ color: runwayColor }}>
          {isPositive ? "∞" : `${projection.runwayMonths.toFixed(1)}`}
        </span>
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          {isPositive ? "Cash flow positive" : "months runway"}
        </span>
      </div>
      {projection.subscribers > 0 && (
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
            {projection.subscribers.toLocaleString()} subs
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
            ${projection.monthlyRevenue.toLocaleString()}/mo revenue
          </span>
        </div>
      )}
      <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
        {projection.description}
      </p>
    </div>
  );
}

export default function PLDashboard({ data }: Props) {
  const trendIcons = {
    up: <TrendingUp size={10} className="text-green-500" />,
    down: <TrendingDown size={10} className="text-red-500" />,
    flat: <Minus size={10} style={{ color: "var(--muted)" }} />,
  };

  return (
    <div>
      {/* P&L Summary bar */}
      <div
        className="rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}08 0%, ${ACCENT}04 100%)`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <div>
          <p className="text-[9px] uppercase tracking-wider font-medium mb-1" style={{ color: "var(--muted)" }}>
            Revenue
          </p>
          <p className="text-lg font-bold" style={{ color: ACCENT }}>
            ${data.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[9px]" style={{ color: "var(--muted-light)" }}>Monthly</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider font-medium mb-1" style={{ color: "var(--muted)" }}>
            COGS
          </p>
          <p className="text-lg font-bold" style={{ color: "#E24D47" }}>
            ${data.totalCOGS.toLocaleString()}
          </p>
          <p className="text-[9px]" style={{ color: "var(--muted-light)" }}>Monthly</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider font-medium mb-1" style={{ color: "var(--muted)" }}>
            Operating Exp
          </p>
          <p className="text-lg font-bold" style={{ color: "#F1C028" }}>
            ${data.totalOpEx.toLocaleString()}
          </p>
          <p className="text-[9px]" style={{ color: "var(--muted-light)" }}>Monthly</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider font-medium mb-1" style={{ color: "var(--muted)" }}>
            Net Burn
          </p>
          <p className="text-lg font-bold" style={{ color: "#E24D47" }}>
            ${Math.abs(data.netBurn).toLocaleString()}
          </p>
          <p className="text-[9px]" style={{ color: "var(--muted-light)" }}>Monthly net outflow</p>
        </div>
      </div>

      {/* Revenue Streams */}
      <div
        className="rounded-xl border p-4 mb-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Revenue Streams
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded-full ml-auto font-bold" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            ${data.totalRevenue.toLocaleString()}/mo
          </span>
        </div>
        <div className="space-y-2">
          {data.revenue.map((stream) => (
            <div
              key={stream.name}
              className="flex items-center justify-between p-2.5 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div className="flex items-center gap-2">
                {trendIcons[stream.trend]}
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {stream.name}
                </span>
                <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                  {stream.note}
                </span>
              </div>
              <span className="text-xs font-bold" style={{ color: stream.monthlyAmount > 0 ? ACCENT : "var(--muted)" }}>
                ${stream.monthlyAmount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* COGS */}
      <div
        className="rounded-xl border p-4 mb-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} style={{ color: "#E24D47" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Cost of Goods Sold
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded-full ml-auto font-bold" style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}>
            ${data.totalCOGS.toLocaleString()}/mo
          </span>
        </div>
        <div className="space-y-2">
          {data.cogs.map((item) => (
            <CostSection key={item.category} item={item} accentColor="#E24D47" />
          ))}
        </div>
      </div>

      {/* Operating Expenses */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} style={{ color: "#F1C028" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Operating Expenses
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded-full ml-auto font-bold" style={{ backgroundColor: "#F1C02814", color: "#B8930A" }}>
            ${data.totalOpEx.toLocaleString()}/mo
          </span>
        </div>
        <div className="space-y-2">
          {data.operatingExpenses.map((item) => (
            <CostSection key={item.category} item={item} accentColor="#F1C028" />
          ))}
        </div>
      </div>

      {/* Scenario Projections */}
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Runway Projections — Scenario Modeling
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.projections.map((proj) => (
            <ScenarioCard
              key={proj.scenario}
              projection={proj}
              isActive={proj.scenario === "current"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
