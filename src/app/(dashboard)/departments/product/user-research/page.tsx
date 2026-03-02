"use client";

import { useState } from "react";
import { MessageSquare, BarChart3, Calendar, Tag } from "lucide-react";

const ACCENT = "#ACB7FF";

/* ── Insights Feed ── */
const INSIGHTS = [
  {
    id: 1,
    source: "Community" as const,
    quote: "I wish my partner could see what I'm going through without me having to explain every detail.",
    theme: "Partner involvement",
    impactScore: 9,
    date: "2026-02-01",
  },
  {
    id: 2,
    source: "Interview" as const,
    quote: "My doctor looked at my chart for 30 seconds and said 'everything looks fine.' But I KNOW something is off.",
    theme: "Medical validation gap",
    impactScore: 10,
    date: "2026-02-03",
  },
  {
    id: 3,
    source: "Survey" as const,
    quote: "I track in 4 different apps and still can't see the whole picture. I need ONE place.",
    theme: "Data fragmentation",
    impactScore: 8,
    date: "2026-02-05",
  },
  {
    id: 4,
    source: "Community" as const,
    quote: "The supplements I'm taking -- I have no idea if they're actually doing anything. Show me the evidence.",
    theme: "Evidence transparency",
    impactScore: 7,
    date: "2026-02-08",
  },
  {
    id: 5,
    source: "Support" as const,
    quote: "I want to know WHY my cycle is irregular, not just THAT it is. Root cause, not just symptoms.",
    theme: "Root cause demand",
    impactScore: 9,
    date: "2026-02-12",
  },
];

/* ── Feature Requests ── */
const FEATURE_REQUESTS = [
  { feature: "Partner Dashboard", requestedBy: 47, priority: "high" as const, status: "Idea" },
  { feature: "Supplement Evidence Tracker", requestedBy: 38, priority: "medium" as const, status: "Researching" },
  { feature: "Clinical Report Export", requestedBy: 31, priority: "medium" as const, status: "Idea" },
  { feature: "Cycle Confidence Scores", requestedBy: 28, priority: "high" as const, status: "Defined" },
  { feature: "Stress & Cortisol Insights", requestedBy: 24, priority: "high" as const, status: "Idea" },
  { feature: "Glucose Variability Module", requestedBy: 19, priority: "high" as const, status: "Researching" },
  { feature: "Community In-App Integration", requestedBy: 15, priority: "medium" as const, status: "Defined" },
];

/* ── Interview Schedule ── */
const INTERVIEWS = [
  { date: "2026-03-05", participant: "User #42 (PCOS journey)", format: "Zoom", status: "scheduled" },
  { date: "2026-03-08", participant: "User #57 (Infertility, IVF)", format: "Zoom", status: "scheduled" },
  { date: "2026-03-12", participant: "Fertility clinic partner", format: "In-person", status: "confirmed" },
  { date: "2026-03-15", participant: "User #63 (Perimenopause)", format: "Zoom", status: "pending" },
  { date: "2026-03-19", participant: "User #71 (TTC 2 years)", format: "Phone", status: "scheduled" },
];

/* ── Key Themes ── */
const KEY_THEMES = [
  { theme: "Root Cause > Symptoms", mentions: 62, trend: "up" as const, description: "Users want to understand WHY, not just WHAT is happening with their cycle." },
  { theme: "Data Unification", mentions: 48, trend: "up" as const, description: "Frustration with tracking in multiple apps. Strong demand for single-source-of-truth." },
  { theme: "Partner Inclusion", mentions: 47, trend: "up" as const, description: "Partners feel excluded from the fertility journey. Simple dashboard would bridge the gap." },
  { theme: "Evidence-Based Trust", mentions: 38, trend: "stable" as const, description: "Users skeptical of supplement and wellness claims. Want to see the actual research." },
  { theme: "Doctor Communication", mentions: 31, trend: "up" as const, description: "Difficulty conveying their health data to providers. Export/report feature highly requested." },
];

const SOURCE_COLORS: Record<string, string> = {
  Community: "#5A6FFF",
  Interview: "#1EAA55",
  Survey: "#F1C028",
  Support: "#E37FB1",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "#E24D47",
  medium: "#F1C028",
  low: "var(--muted)",
};

export default function UserResearchPage() {
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  return (
    <div>
      {/* Insights Feed */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Recent User Insights
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            {INSIGHTS.length} insights
          </span>
        </div>
        <div className="space-y-2">
          {INSIGHTS.map((insight) => {
            const sourceColor = SOURCE_COLORS[insight.source] || "var(--muted)";
            return (
              <div
                key={insight.id}
                className="rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all"
                style={{
                  borderColor: selectedInsight === insight.id ? ACCENT : "var(--border)",
                  backgroundColor: selectedInsight === insight.id ? `${ACCENT}06` : "var(--background)",
                }}
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm italic" style={{ color: "var(--foreground)" }}>
                      &ldquo;{insight.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${sourceColor}14`, color: sourceColor }}
                      >
                        {insight.source}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        Theme: {insight.theme}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {insight.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold" style={{ color: insight.impactScore >= 9 ? "#E24D47" : insight.impactScore >= 7 ? "#F1C028" : "var(--muted)" }}>
                      {insight.impactScore}
                    </p>
                    <p className="text-[8px]" style={{ color: "var(--muted)" }}>impact</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Feature Request Tracker */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Feature Requests
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left py-2 pr-3 font-bold uppercase tracking-wider" style={{ color: "var(--muted)", fontSize: "9px" }}>Feature</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider" style={{ color: "var(--muted)", fontSize: "9px" }}>Requests</th>
                  <th className="text-center py-2 px-2 font-bold uppercase tracking-wider" style={{ color: "var(--muted)", fontSize: "9px" }}>Priority</th>
                  <th className="text-center py-2 pl-2 font-bold uppercase tracking-wider" style={{ color: "var(--muted)", fontSize: "9px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_REQUESTS.map((req) => (
                  <tr key={req.feature} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-2 pr-3 font-medium" style={{ color: "var(--foreground)" }}>{req.feature}</td>
                    <td className="py-2 px-2 text-center font-bold" style={{ color: ACCENT }}>{req.requestedBy}</td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${PRIORITY_COLORS[req.priority]}14`, color: PRIORITY_COLORS[req.priority] }}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-2 pl-2 text-center" style={{ color: "var(--muted)" }}>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview Schedule */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Interview Schedule
            </h3>
          </div>
          <div className="space-y-2">
            {INTERVIEWS.map((interview, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="text-center shrink-0 w-12">
                  <p className="text-[10px] font-bold" style={{ color: ACCENT }}>
                    {new Date(interview.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {interview.participant}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {interview.format}
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: interview.status === "confirmed" ? "#1EAA5514" : interview.status === "scheduled" ? "#5A6FFF14" : "#F1C02814",
                    color: interview.status === "confirmed" ? "#1EAA55" : interview.status === "scheduled" ? "#5A6FFF" : "#F1C028",
                  }}
                >
                  {interview.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Themes */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Key Themes
          </h3>
        </div>
        <div className="space-y-3">
          {KEY_THEMES.map((theme) => (
            <div
              key={theme.theme}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {theme.theme}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold" style={{ color: ACCENT }}>
                    {theme.mentions} mentions
                  </span>
                  <span className="text-[9px]" style={{ color: theme.trend === "up" ? "#1EAA55" : "var(--muted)" }}>
                    {theme.trend === "up" ? "Trending up" : "Stable"}
                  </span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
