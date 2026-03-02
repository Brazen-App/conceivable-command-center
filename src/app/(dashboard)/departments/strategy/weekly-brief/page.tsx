"use client";

import { useState, useEffect } from "react";
import CEOWeeklyBrief from "@/components/departments/strategy/CEOWeeklyBrief";
import type { WeeklyBrief } from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

export default function StrategyWeeklyBriefPage() {
  const [data, setData] = useState<{
    currentBrief: WeeklyBrief;
    briefArchive: { id: string; weekOf: string; headline: string; focusTheme: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strategy")
      .then((res) => res.json())
      .then((d) => {
        setData({ currentBrief: d.currentBrief, briefArchive: d.briefArchive });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
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
            Loading CEO weekly brief...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Sullivan + Campbell framework header */}
      <div
        className="rounded-xl border p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
      >
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            CEO Weekly Brief — Sullivan + Campbell Framework
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Top 3 things going well (with evidence), top 3 risks, 1 uncomfortable truth,
            recommended priority, questions to ask, and multiplier opportunities.
          </p>
        </div>
      </div>

      <CEOWeeklyBrief
        currentBrief={data.currentBrief}
        briefArchive={data.briefArchive}
      />
    </div>
  );
}
