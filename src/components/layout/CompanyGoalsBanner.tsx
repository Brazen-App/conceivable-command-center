"use client";

import { Target, TrendingUp, Sparkles } from "lucide-react";

interface CompanyGoalsBannerProps {
  departmentFocus?: string;
}

export default function CompanyGoalsBanner({ departmentFocus }: CompanyGoalsBannerProps) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        background: "linear-gradient(135deg, #5A6FFF08 0%, #ACB7FF08 50%, #E37FB108 100%)",
        border: "1px solid rgba(90, 111, 255, 0.12)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Company Goals */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Target size={12} style={{ color: "#5A6FFF" }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5A6FFF" }}>
              Company Goals
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <GoalChip label="5,000 signups" sublabel="in 7 weeks" color="#5A6FFF" />
            <GoalChip label="$150K bridge" sublabel="round" color="#1EAA55" />
            <GoalChip label="100 content" sublabel="pieces/week" color="#E37FB1" />
          </div>
        </div>

        {/* Department 10x Focus */}
        {departmentFocus && (
          <div className="sm:ml-auto flex items-center gap-1.5 min-w-0">
            <Sparkles size={11} style={{ color: "#F1C028" }} />
            <span className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
              <span className="font-semibold" style={{ color: "#F1C028" }}>10x Focus:</span>{" "}
              {departmentFocus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function GoalChip({ label, sublabel, color }: { label: string; sublabel: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${color}10`, color }}
    >
      <TrendingUp size={9} />
      {label} <span className="opacity-60">{sublabel}</span>
    </span>
  );
}
