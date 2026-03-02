"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Flame,
  Clock,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import type { CashPosition, BurnMetrics } from "@/lib/data/finance-data";

const ACCENT = "#1EAA55";

interface Props {
  cash: CashPosition;
  burn: BurnMetrics;
}

function RunwayIndicator({ months }: { months: number }) {
  const color = months > 6 ? "#1EAA55" : months > 3 ? "#F1C028" : "#E24D47";
  const label = months > 6 ? "Healthy" : months > 3 ? "Monitor" : "Critical";
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-semibold" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export default function CashPositionBurn({ cash, burn }: Props) {
  const burnTrend = burn.monthlyBurn < burn.monthlyBurnPrevious ? "down" : "up";
  const burnChangeAbs = Math.abs(burn.monthlyBurn - burn.monthlyBurnPrevious);
  const burnChangePct = ((burnChangeAbs / burn.monthlyBurnPrevious) * 100).toFixed(1);
  const maxWeekBurn = Math.max(...burn.weekOverWeek.map((w) => w.burn));
  const maxMonthBurn = Math.max(...burn.monthOverMonth.map((m) => m.burn));

  return (
    <div>
      {/* Hero: Cash Balance */}
      <div
        className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}08 0%, ${ACCENT}04 100%)`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.15em] mb-2"
          style={{ color: "var(--muted)" }}
        >
          Cash on Hand
        </p>
        <p className="text-6xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          ${cash.currentBalance.toLocaleString()}
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
          As of {new Date(cash.asOfDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        {/* Account breakdown pills */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {cash.accountBreakdown.map((acct) => (
            <div
              key={acct.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              <Wallet size={10} style={{ color: ACCENT }} />
              <span className="font-medium">{acct.name}</span>
              <span style={{ color: "var(--muted)" }}>${acct.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row: Burn + Runway + Daily + Gain */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {/* Monthly Burn */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flame size={12} style={{ color: "#E24D47" }} />
            <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Monthly Burn
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            ${burn.monthlyBurn.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {burnTrend === "down" ? (
              <TrendingDown size={10} className="text-green-500" />
            ) : (
              <TrendingUp size={10} className="text-red-500" />
            )}
            <span className="text-[9px]" style={{ color: burnTrend === "down" ? "#1EAA55" : "#E24D47" }}>
              {burnChangePct}% {burnTrend === "down" ? "decrease" : "increase"} MoM
            </span>
          </div>
        </div>

        {/* Runway */}
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: burn.runwayMonths > 6 ? "var(--border)" : burn.runwayMonths > 3 ? "#F1C02840" : "#E24D4740",
            backgroundColor: "var(--surface)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock size={12} style={{ color: burn.runwayMonths > 6 ? ACCENT : burn.runwayMonths > 3 ? "#F1C028" : "#E24D47" }} />
            <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Runway
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {burn.runwayMonths.toFixed(1)} mo
          </p>
          <RunwayIndicator months={burn.runwayMonths} />
        </div>

        {/* Daily Burn */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flame size={12} style={{ color: "#F1C028" }} />
            <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Daily Burn
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            ${burn.dailyBurn}
          </p>
          <p className="text-[9px] mt-1" style={{ color: "var(--muted-light)" }}>
            {burn.runwayDays} days remaining
          </p>
        </div>

        {/* THE GAIN */}
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: `${ACCENT}40`,
            backgroundColor: `${ACCENT}06`,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowUpRight size={12} style={{ color: ACCENT }} />
            <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: ACCENT }}>
              The Gain
            </span>
          </div>
          <p className="text-xl font-bold" style={{ color: ACCENT }}>
            +{burn.runwayExtendedDays} days
          </p>
          <p className="text-[9px] mt-1" style={{ color: "var(--muted)" }}>
            Runway extended since last month
          </p>
        </div>
      </div>

      {/* Daily Burn Breakdown */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color: "#F1C028" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Daily Burn Breakdown — ${burn.dailyBurn}/day
          </h3>
        </div>
        <div className="space-y-2">
          {burn.dailyBurnBreakdown.map((item) => {
            const pct = (item.amount / burn.dailyBurn) * 100;
            return (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium" style={{ color: "var(--foreground)" }}>
                    {item.category}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                    ${item.amount}/day ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: ACCENT, opacity: 0.7 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week-over-Week and Month-over-Month charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WoW */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Week-over-Week Burn
          </h3>
          <div className="flex items-end gap-2 h-24">
            {burn.weekOverWeek.map((w) => {
              const heightPct = (w.burn / maxWeekBurn) * 100;
              return (
                <div key={w.week} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative" style={{ height: "80px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md"
                      style={{
                        backgroundColor: ACCENT,
                        height: `${heightPct}%`,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <p className="text-[8px] mt-1.5 font-medium" style={{ color: "var(--muted)" }}>
                    {w.week}
                  </p>
                  <p className="text-[9px] font-semibold" style={{ color: "var(--foreground)" }}>
                    ${(w.burn / 1000).toFixed(1)}K
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MoM */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Month-over-Month Burn
          </h3>
          <div className="flex items-end gap-2 h-24">
            {burn.monthOverMonth.map((m, i) => {
              const heightPct = (m.burn / maxMonthBurn) * 100;
              const isLatest = i === burn.monthOverMonth.length - 1;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative" style={{ height: "80px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-md"
                      style={{
                        backgroundColor: isLatest ? ACCENT : `${ACCENT}80`,
                        height: `${heightPct}%`,
                        opacity: isLatest ? 0.9 : 0.5,
                      }}
                    />
                  </div>
                  <p className="text-[8px] mt-1.5 font-medium" style={{ color: "var(--muted)" }}>
                    {m.month}
                  </p>
                  <p className="text-[9px] font-semibold" style={{ color: "var(--foreground)" }}>
                    ${(m.burn / 1000).toFixed(1)}K
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingDown size={10} className="text-green-500" />
            <span className="text-[9px]" style={{ color: ACCENT }}>
              Burn trending down 5 consecutive months
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
