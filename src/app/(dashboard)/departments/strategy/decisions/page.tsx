"use client";

import { useState, useEffect } from "react";
import DecisionFramework from "@/components/departments/strategy/DecisionFramework";
import type { Decision } from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

export default function StrategyDecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strategy")
      .then((res) => res.json())
      .then((d) => {
        setDecisions(d.decisions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Loading decisions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header info */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
      >
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Decision Framework — Think Through Decisions with Your Strategy Coach
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            List of pending decisions with options, tradeoffs, Sullivan/Campbell lens analysis,
            and a chat interface for thinking through new decisions.
          </p>
        </div>
      </div>

      <DecisionFramework decisions={decisions} />
    </div>
  );
}
