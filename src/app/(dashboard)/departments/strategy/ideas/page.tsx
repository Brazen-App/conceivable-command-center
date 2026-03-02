"use client";

import { useState, useEffect } from "react";
import IdeasParkingLot from "@/components/departments/strategy/IdeasParkingLot";
import type { Idea } from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

export default function StrategyIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strategy")
      .then((res) => res.json())
      .then((d) => {
        setIdeas(d.ideas || []);
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
            Loading ideas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Category legend */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Ideas Parking Lot — Capture, Triage, and Prioritize
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1EAA55" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>10x Moves</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F1C028" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>2x Improvements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ACB7FF" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>Experiments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--muted)" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>Someday/Maybe</span>
          </div>
        </div>
      </div>

      <IdeasParkingLot ideas={ideas} />
    </div>
  );
}
