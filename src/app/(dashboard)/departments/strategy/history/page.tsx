"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Target,
} from "lucide-react";

const ACCENT = "#9686B9";

interface BriefArchiveEntry {
  id: string;
  weekOf: string;
  headline: string;
  focusTheme: string;
  keyDecisions: string[];
  outcomes: string[];
  tenXFocus: string;
  status: "green" | "yellow" | "red";
}

const BRIEF_HISTORY: BriefArchiveEntry[] = [
  {
    id: "wb-2026-w09",
    weekOf: "2026-02-23",
    headline: "Stop building, start using. Make 5 investor calls.",
    focusTheme: "Activation",
    keyDecisions: [
      "Decided to shift from command center building to activation mode",
      "Committed to SAFE structure for bridge round",
      "Approved shift to selective podcast strategy (3-4/month)",
    ],
    outcomes: [
      "Email sequence reviewed and approved for sending",
      "Investor pipeline organized into 3 tiers",
      "Bridge round SAFE documents prepared",
    ],
    tenXFocus: "Launch the email sequence and make 5 investor calls this week.",
    status: "yellow",
  },
  {
    id: "wb-2026-w08",
    weekOf: "2026-02-16",
    headline: "Community growth is real, but conversion funnel is broken.",
    focusTheme: "Conversion",
    keyDecisions: [
      "Identified email sequence as #1 bottleneck",
      "Decided to prioritize conversion funnel over new content",
    ],
    outcomes: [
      "Community hit 813 members",
      "Content Engine producing 12 pieces/week",
      "30-Day Glucose Challenge launched with 67 participants",
    ],
    tenXFocus: "Fix the conversion funnel: email list to early access signups.",
    status: "yellow",
  },
  {
    id: "wb-2026-w07",
    weekOf: "2026-02-09",
    headline: "Patent portfolio is your deepest moat. Protect it.",
    focusTheme: "IP Protection",
    keyDecisions: [
      "Prioritized closed-loop system patent provisional filing",
      "Approved CON Score patent application",
    ],
    outcomes: [
      "IP attorney confirmed closed-loop provisional is strongest filing seen from a pre-seed company",
      "CON Score patent application submitted",
    ],
    tenXFocus: "File the closed-loop system provisional patent this week.",
    status: "green",
  },
  {
    id: "wb-2026-w06",
    weekOf: "2026-02-02",
    headline: "Content Engine is working. Time to point it at fundraising.",
    focusTheme: "Narrative",
    keyDecisions: [
      "Shifted content strategy to support fundraising narrative",
      "Approved pitch deck structure incorporating clinical data",
    ],
    outcomes: [
      "Content Engine reached 14 pieces/week cadence",
      "CEO content engagement 2x higher than other sources",
      "Initial pitch deck draft completed",
    ],
    tenXFocus: "Build the fundraising narrative using clinical data as the centerpiece.",
    status: "green",
  },
  {
    id: "wb-2026-w05",
    weekOf: "2026-01-26",
    headline: "The 21-Day Mindfulness challenge proved community-led growth.",
    focusTheme: "Community",
    keyDecisions: [
      "Validated challenge-based engagement model",
      "Decided to build 7-Day Fertility Reset as follow-up",
    ],
    outcomes: [
      "21-Day Mindfulness challenge completed with 89% completion rate",
      "Community engagement rose from 54% to 62%",
      "Organic referrals accounted for 45% of new members",
    ],
    tenXFocus: "Design the 7-Day Fertility Reset challenge based on glucose + BBT data.",
    status: "green",
  },
  {
    id: "wb-2026-w04",
    weekOf: "2026-01-19",
    headline: "Clinical data is your unfair advantage. Lead with it everywhere.",
    focusTheme: "Clinical Evidence",
    keyDecisions: [
      "Decided to lead all investor conversations with clinical data",
      "Approved pilot study summary for public use",
    ],
    outcomes: [
      "Pilot study data formatted for investor presentation",
      "150-260% conception improvement figure validated",
      "Clinical evidence integrated into all pitch materials",
    ],
    tenXFocus: "Integrate pilot study data into every touchpoint: pitch, community, content.",
    status: "green",
  },
];

const STATUS_COLORS = {
  green: "#1EAA55",
  yellow: "#F1C028",
  red: "#E24D47",
};

export default function StrategyHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = BRIEF_HISTORY.filter((entry) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.headline.toLowerCase().includes(q) ||
      entry.focusTheme.toLowerCase().includes(q) ||
      entry.keyDecisions.some((d) => d.toLowerCase().includes(q)) ||
      entry.outcomes.some((o) => o.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Brief Archive — Decision and Outcome History
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Archive of all weekly briefs with key decisions and their outcomes.
          Search by keyword or browse the timeline.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search briefs by headline, decisions, outcomes..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#9686B9]/20"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Results count */}
      <p className="text-[10px] mb-4" style={{ color: "var(--muted)" }}>
        {filtered.length} of {BRIEF_HISTORY.length} briefs
      </p>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((entry) => {
          const expanded = expandedId === entry.id;
          const statusColor = STATUS_COLORS[entry.status];

          return (
            <div
              key={entry.id}
              className="rounded-xl border transition-all"
              style={{
                borderColor: expanded ? `${ACCENT}40` : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : entry.id)}
              >
                {/* Date */}
                <div className="shrink-0 text-center w-14">
                  <p className="text-[9px] font-bold uppercase" style={{ color: ACCENT }}>
                    {new Date(entry.weekOf).toLocaleDateString("en-US", { month: "short" })}
                  </p>
                  <p className="text-lg font-bold leading-none" style={{ color: "var(--foreground)" }}>
                    {new Date(entry.weekOf).getDate()}
                  </p>
                </div>

                {/* Status dot */}
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                    {entry.headline}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                      {entry.focusTheme}
                    </span>
                  </div>
                </div>

                {/* Expand chevron */}
                {expanded ? (
                  <ChevronDown size={14} style={{ color: ACCENT }} />
                ) : (
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                )}
              </div>

              {/* Expanded content */}
              {expanded && (
                <div className="px-4 pb-5 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
                  {/* 10x Focus */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={12} style={{ color: ACCENT }} />
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                        10x Focus
                      </p>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {entry.tenXFocus}
                    </p>
                  </div>

                  {/* Key Decisions */}
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "#F1C028" }}>
                      Key Decisions
                    </p>
                    <div className="space-y-1.5">
                      {entry.keyDecisions.map((d, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#F1C028" }} />
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "#1EAA55" }}>
                      Outcomes
                    </p>
                    <div className="space-y-1.5">
                      {entry.outcomes.map((o, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: "#1EAA55" }} />
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{o}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Clock size={20} className="mx-auto mb-2" style={{ color: "var(--muted-light)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No briefs match your search.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs mt-2 font-medium"
            style={{ color: ACCENT }}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
