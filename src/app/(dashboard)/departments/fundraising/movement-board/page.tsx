"use client";

import { useState } from "react";
import { Star, Calendar, ExternalLink, ChevronDown, Search, Users, Sparkles, RefreshCw, MessageSquare } from "lucide-react";

const ACCENT = "#356FB6";

interface MovementTarget {
  id: string;
  name: string;
  title: string;
  connectionStrength: 1 | 2 | 3 | 4 | 5;
  warmestPath: string;
  latestIntel: string;
  nextAction: string;
  lastResearched: string;
  weeklyNotes: string[];
  whyTheyFit: string;
  potentialAsk: string;
}

const TIER1_TARGETS: MovementTarget[] = [
  {
    id: "mt01",
    name: "MacKenzie Scott",
    title: "Philanthropist, Yield Giving",
    connectionStrength: 2,
    warmestPath: "Through women's health nonprofit network. Her Yield Giving has funded reproductive justice orgs. Connect via grantee introductions.",
    latestIntel: "Gave $2B in 2025 to 400+ organizations. Increasing focus on women's health and equity. No application process -- she finds you.",
    nextAction: "Ensure Conceivable appears in searches for 'innovative women's health technology'. Boost media presence. Get featured in philanthropy newsletters.",
    lastResearched: "2026-02-27",
    weeklyNotes: [
      "2026-02-27: Yield Giving made 3 new health grants this month. All featured data-driven outcomes.",
      "2026-02-20: Published interview on importance of reproductive health equity. Aligns with our mission.",
      "2026-02-13: Her team reportedly reaching out to fertility nonprofits. Monitoring.",
    ],
    whyTheyFit: "Philanthropic giving focused on women's health, equity, and science-backed solutions. Scale of giving could fund entire R&D program.",
    potentialAsk: "$1-5M philanthropic grant for clinical research program",
  },
  {
    id: "mt02",
    name: "Serena Williams",
    title: "Athlete, Serena Ventures",
    connectionStrength: 4,
    warmestPath: "Connected through podcast network. Her fund invests in women's health. Direct intro possible via shared podcast hosts.",
    latestIntel: "Serena Ventures actively investing in FemTech. Recent $111M fund. Personal fertility journey is public and powerful advocacy platform.",
    nextAction: "Schedule intro call with Serena Ventures associate. Prepare customized pitch highlighting personal mission alignment.",
    lastResearched: "2026-03-01",
    weeklyNotes: [
      "2026-03-01: Follow-up call with SV associate went well. They're interested in the data story.",
      "2026-02-22: Serena posted about fertility awareness on Instagram. 12M views. Perfect alignment.",
      "2026-02-15: Serena Ventures partner mentioned interest in 'data-driven health' at TechCrunch event.",
    ],
    whyTheyFit: "Personal fertility journey, massive platform, active FemTech investor. Would be both investor and movement amplifier.",
    potentialAsk: "$500K-1M from Serena Ventures + advocacy partnership",
  },
  {
    id: "mt03",
    name: "Alice Walton",
    title: "Whole Health System, Art of Health",
    connectionStrength: 2,
    warmestPath: "Through wellness and integrative health networks. Her Whole Health System initiative in Bentonville aligns with holistic approach.",
    latestIntel: "Building massive Whole Health System combining conventional and integrative medicine. $1B+ commitment. Actively seeking tech partnerships.",
    nextAction: "Connect with Whole Health System leadership through integrative medicine conferences. Submit proposal for tech partnership.",
    lastResearched: "2026-02-28",
    weeklyNotes: [
      "2026-02-28: Sent updated pitch deck to Alice Walton's team via intro from wellness advisor.",
      "2026-02-21: Whole Health System announced new tech partnership criteria. Data integration is key.",
      "2026-02-14: Alice spoke at integrative health summit about 'connected wellness platforms'.",
    ],
    whyTheyFit: "Building the future of holistic healthcare. Our connected biomarker approach fits perfectly with Whole Health System vision.",
    potentialAsk: "$1-3M strategic investment + Whole Health System integration",
  },
  {
    id: "mt04",
    name: "Melinda Gates",
    title: "Pivotal Ventures, Global Health Advocate",
    connectionStrength: 1,
    warmestPath: "Through global women's health organizations. Pivotal Ventures invests in women's power and influence. Academic publication would strengthen credibility.",
    latestIntel: "Pivotal Ventures expanding women's health portfolio. Recent focus on data-driven health interventions and closing the gender health gap.",
    nextAction: "Cold outreach to Pivotal Ventures program officer. Lead with published research and clinical evidence.",
    lastResearched: "2026-02-24",
    weeklyNotes: [
      "2026-02-24: Cold outreach sent to program officer. Included pilot study summary and patent portfolio overview.",
      "2026-02-17: Pivotal Ventures blog post on 'the fertility data gap' -- practically describes our solution.",
      "2026-02-10: No response to initial outreach. Planning follow-up through academic network.",
    ],
    whyTheyFit: "Champions women's health equity and data-driven interventions. Her platform would validate Conceivable globally.",
    potentialAsk: "$2-5M from Pivotal Ventures + global health partnership",
  },
  {
    id: "mt05",
    name: "Michelle Obama",
    title: "Women's Health Advocate, Personal Brand",
    connectionStrength: 1,
    warmestPath: "Through podcast network and women's health advocacy organizations. Her health initiatives align with empowerment through knowledge.",
    latestIntel: "Active in women's health advocacy. Podcast platform reaches millions. Personal brand aligns with empowerment and education.",
    nextAction: "Explore connection through podcast network. Prepare advocacy partnership proposal separate from investment ask.",
    lastResearched: "2026-02-20",
    weeklyNotes: [
      "2026-02-20: Identified 2 shared podcast network connections. Reaching out for warm intro.",
      "2026-02-13: Michelle Obama Health Initiative announced new women's wellness program.",
      "2026-02-06: Exploring advisory board invitation as initial engagement.",
    ],
    whyTheyFit: "Massive platform for women's health advocacy. Not traditional investor but could be transformative brand ambassador and advisor.",
    potentialAsk: "Advisory board + advocacy partnership (not direct investment)",
  },
];

function ConnectionStrength({ strength }: { strength: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          fill={i <= strength ? "#F1C028" : "none"}
          stroke={i <= strength ? "#F1C028" : "var(--border)"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}

export default function MovementBoardPage() {
  const [expandedId, setExpandedId] = useState<string | null>("mt02");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Movement Board -- Tier 1 Targets
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          5 Key Targets
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Weekly research and relationship tracking for highest-impact potential partners and investors.
          Who Not How: finding the BEST possible &ldquo;who&rdquo; for each strategic need.
        </p>
      </div>

      {/* Target Cards */}
      <div className="space-y-4">
        {TIER1_TARGETS.map((target) => (
          <div
            key={target.id}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setExpandedId(expandedId === target.id ? null : target.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                      {target.name}
                    </h3>
                    <ConnectionStrength strength={target.connectionStrength} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{target.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium" style={{ color: ACCENT }}>{target.potentialAsk}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar size={10} style={{ color: "var(--muted)" }} />
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      Researched: {target.lastResearched}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === target.id && (
              <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                      Why They Fit
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {target.whyTheyFit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                      Warmest Path
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {target.warmestPath}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                    Latest Intel
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {target.latestIntel}
                  </p>
                </div>

                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                    Next Action
                  </p>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {target.nextAction}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                    Weekly Research Notes
                  </p>
                  <div className="space-y-2">
                    {target.weeklyNotes.map((note, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ACCENT }} />
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Joy Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: "#5A6FFF" }}
                  >
                    <Sparkles size={11} />
                    Joy: Research Update
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}
                  >
                    <MessageSquare size={11} />
                    Joy: Draft Outreach
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <RefreshCw size={11} />
                    Map Warm Paths
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
