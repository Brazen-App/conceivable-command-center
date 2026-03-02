"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Zap,
  Download,
  ArrowUpRight,
} from "lucide-react";
import type { FinancialSummary } from "@/lib/data/finance-data";

const ACCENT = "#1EAA55";

interface Props {
  summary: FinancialSummary;
}

export default function InvestorReadyFinancials({ summary }: Props) {
  const trendConfig = {
    up: { Icon: TrendingUp, color: "#1EAA55" },
    down: { Icon: TrendingDown, color: "#1EAA55" }, // Burn going down is GOOD
    flat: { Icon: Minus, color: "var(--muted)" },
  };

  return (
    <div>
      {/* Auto-generated Summary */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{
          borderColor: `${ACCENT}30`,
          backgroundColor: `${ACCENT}06`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Investor Update — Financial Summary
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}>
            Auto-generated {new Date(summary.generatedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium"
            style={{ backgroundColor: ACCENT, color: "white" }}
          >
            <Download size={10} /> Export PDF
          </button>
        </div>
        <div className="space-y-1.5">
          {summary.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <ArrowUpRight size={10} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Metrics Grid */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Key Investor Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {summary.investorMetrics.map((metric) => {
            const { Icon, color } = trendConfig[metric.trend];
            return (
              <div
                key={metric.label}
                className="rounded-lg p-3"
                style={{ backgroundColor: "var(--background)" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={10} style={{ color }} />
                  <span className="text-[9px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
                    {metric.label}
                  </span>
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {metric.value}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "var(--muted-light)" }}>
                  {metric.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly AI Cost Insights (Sullivan Framework) */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            AI Agent Recommendations — Cost Optimization
          </h3>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
          >
            Sullivan Framework
          </span>
        </div>
        <div className="space-y-3">
          {summary.costInsights.map((insight, i) => (
            <div
              key={i}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: insight.label === "10x" ? `${ACCENT}06` : "var(--background)",
                border: insight.label === "10x" ? `1px solid ${ACCENT}15` : "1px solid transparent",
              }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                  style={{
                    backgroundColor: insight.label === "10x" ? `${ACCENT}20` : "#F1C02820",
                    color: insight.label === "10x" ? ACCENT : "#B8930A",
                  }}
                >
                  {insight.label}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {insight.title}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
                      ${insight.weeklyAmount}/week on {insight.costDriver}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {insight.description}
                  </p>
                  <p className="text-[10px] mt-1.5 font-medium" style={{ color: ACCENT }}>
                    Impact: {insight.impact}
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
          {summary.crossDepartmentLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-2.5 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                style={{
                  backgroundColor: link.label === "10x" ? "#5A6FFF18" : "#F1C02818",
                  color: link.label === "10x" ? "#5A6FFF" : "#B8930A",
                }}
              >
                {link.label}
              </span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  Finance → {link.department}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {link.connection}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
