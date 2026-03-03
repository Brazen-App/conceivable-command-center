"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  Link2,
  FileText,
  BookOpen,
  Code2,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";

const ACCENT = "#5A6FFF";

// --- Types ---

type CitationStatus = "cited" | "mentioned" | "absent";

interface AIEngineResult {
  engine: string;
  status: CitationStatus;
}

interface QueryTracker {
  id: string;
  query: string;
  engines: AIEngineResult[];
  competitors: string[];
  lastChecked: string;
}

// --- Mock Data ---

const QUERIES: QueryTracker[] = [
  {
    id: "q-01",
    query: "best fertility supplement",
    engines: [
      { engine: "ChatGPT", status: "mentioned" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "mentioned" },
    ],
    competitors: ["FertilityBlend", "Theralogix", "Pink Stork", "Premama"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-02",
    query: "best smart ring for fertility",
    engines: [
      { engine: "ChatGPT", status: "absent" },
      { engine: "Claude", status: "mentioned" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "absent" },
    ],
    competitors: ["Oura Ring", "Ultrahuman", "RingConn"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-03",
    query: "best smart ring for ovulation",
    engines: [
      { engine: "ChatGPT", status: "absent" },
      { engine: "Claude", status: "absent" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "mentioned" },
    ],
    competitors: ["Oura Ring", "Ava Bracelet"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-04",
    query: "best fertility tracker",
    engines: [
      { engine: "ChatGPT", status: "mentioned" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "mentioned" },
      { engine: "Perplexity", status: "cited" },
    ],
    competitors: ["Natural Cycles", "Clue", "Flo", "Tempdrop"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-05",
    query: "best fertility monitor",
    engines: [
      { engine: "ChatGPT", status: "absent" },
      { engine: "Claude", status: "mentioned" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "mentioned" },
    ],
    competitors: ["Clearblue", "Mira", "Inito", "Proov"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-06",
    query: "best natural fertility apps",
    engines: [
      { engine: "ChatGPT", status: "cited" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "mentioned" },
    ],
    competitors: ["Natural Cycles", "Kindara", "Fertility Friend", "Premom"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-07",
    query: "how to improve fertility naturally",
    engines: [
      { engine: "ChatGPT", status: "mentioned" },
      { engine: "Claude", status: "mentioned" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "absent" },
    ],
    competitors: ["WebMD", "Healthline", "Mayo Clinic", "Cleveland Clinic"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-08",
    query: "AI fertility technology",
    engines: [
      { engine: "ChatGPT", status: "cited" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "mentioned" },
      { engine: "Perplexity", status: "cited" },
    ],
    competitors: ["Ava", "Future Fertility", "Alife Health"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-09",
    query: "alternatives to IVF",
    engines: [
      { engine: "ChatGPT", status: "mentioned" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "mentioned" },
    ],
    competitors: ["CNY Fertility", "Extend Fertility", "Natalist"],
    lastChecked: "2026-03-01",
  },
  {
    id: "q-10",
    query: "personalized fertility treatment",
    engines: [
      { engine: "ChatGPT", status: "absent" },
      { engine: "Claude", status: "cited" },
      { engine: "Gemini", status: "absent" },
      { engine: "Perplexity", status: "cited" },
    ],
    competitors: ["Kindbody", "Spring Fertility", "TMRW Life Sciences"],
    lastChecked: "2026-03-01",
  },
];

function getGeoScore(queries: QueryTracker[]): number {
  let score = 0;
  for (const q of queries) {
    const hasCitation = q.engines.some((e) => e.status === "cited");
    const hasMention = q.engines.some((e) => e.status === "mentioned");
    if (hasCitation) score += 1;
    else if (hasMention) score += 0.5;
  }
  return Math.round(score * 10) / 10;
}

function StatusDot({ status }: { status: CitationStatus }) {
  const config = {
    cited: { color: "#1EAA55", icon: CheckCircle2, label: "Cited" },
    mentioned: { color: "#F1C028", icon: MinusCircle, label: "Mentioned" },
    absent: { color: "#E24D47", icon: XCircle, label: "Absent" },
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <div className="flex flex-col items-center gap-1" title={label}>
      <Icon size={16} style={{ color }} />
    </div>
  );
}

export default function SeoGeoPage() {
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const geoScore = getGeoScore(QUERIES);
  const citedCount = QUERIES.filter((q) =>
    q.engines.some((e) => e.status === "cited")
  ).length;

  return (
    <div className="space-y-6">
      {/* GEO Score Hero */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center md:text-left flex-1">
            <p
              className="text-xs font-medium uppercase tracking-widest mb-2"
              style={{ color: ACCENT }}
            >
              AI Visibility Monitor
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {geoScore}
              </span>
              <span className="text-lg" style={{ color: "var(--muted)" }}>
                / 10
              </span>
            </div>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              Conceivable appears in {citedCount} of 10 target AI queries
              (cited). The Gain: started at 1/10 eight weeks ago.
            </p>
          </div>

          {/* Legend */}
          <div
            className="flex gap-4 text-xs rounded-lg px-4 py-3"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
              <span style={{ color: "var(--foreground)" }}>Cited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MinusCircle size={14} style={{ color: "#F1C028" }} />
              <span style={{ color: "var(--foreground)" }}>Mentioned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle size={14} style={{ color: "#E24D47" }} />
              <span style={{ color: "var(--foreground)" }}>Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Query Cards — Expandable with Joy Actions */}
      <div className="space-y-3">
        {QUERIES.map((q, idx) => {
          const isExpanded = expandedQuery === q.id;
          const hasCitation = q.engines.some((e) => e.status === "cited");
          const absentEngines = q.engines.filter((e) => e.status === "absent");
          return (
            <div
              key={q.id}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface)",
                border: `1px solid ${isExpanded ? `${ACCENT}40` : "var(--border)"}`,
              }}
            >
              <div
                className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpandedQuery(isExpanded ? null : q.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                      className="text-xs font-bold shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--foreground)" }}
                      >
                        &quot;{q.query}&quot;
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                        Last checked: {q.lastChecked}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {q.engines.map((e) => (
                      <div key={e.engine} className="flex flex-col items-center gap-0.5">
                        <StatusDot status={e.status} />
                        <span className="text-[9px] font-medium" style={{ color: "var(--muted)" }}>
                          {e.engine}
                        </span>
                      </div>
                    ))}
                    {isExpanded ? (
                      <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                    ) : (
                      <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Also appears:
                  </span>
                  {q.competitors.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-2" style={{ backgroundColor: "var(--background)", borderTop: "1px solid var(--border)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Strategy
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {hasCitation
                          ? `Conceivable is cited for "${q.query}". Maintain position by publishing supporting content and updating schema markup.`
                          : `Not yet cited for "${q.query}". Create targeted content, add FAQ schema, and build backlinks from authoritative fertility sources.`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Gap Analysis
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {absentEngines.length > 0
                          ? `Absent from: ${absentEngines.map((e) => e.engine).join(", ")}. These engines need targeted content optimization.`
                          : "Present across all tracked engines. Focus on improving from 'mentioned' to 'cited'."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <JoyButton
                      agent="content-engine"
                      prompt={`Write SEO/GEO-optimized content targeting the query "${q.query}". ${q.engines.some((e) => e.status === "cited") ? "We're already cited — create supporting content to maintain position." : "We're not yet cited — create comprehensive, authoritative content with FAQ schema to earn citations."} Focus on making this content the definitive answer for AI engines.`}
                      label="Joy: Write Content"
                    />
                    <JoyButton
                      agent="content-engine"
                      prompt={`Re-check AI engine presence for the query "${q.query}". Current status: ${q.engines.map((e) => `${e.engine}: ${e.status}`).join(", ")}. What specific steps should we take to improve our visibility in engines where we're absent or only mentioned?`}
                      label="Re-check Engines"
                      variant="secondary"
                      icon={<RefreshCw size={11} />}
                      iconSize={11}
                    />
                    <JoyButton
                      agent="content-engine"
                      prompt={`Generate JSON-LD schema markup for the query "${q.query}" to improve our GEO visibility. Include FAQ schema, HowTo schema, and Article schema. The markup should target AI engine citation for Conceivable's fertility optimization content.`}
                      label="Add Schema Markup"
                      variant="secondary"
                      icon={<Code2 size={11} />}
                      iconSize={11}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Infrastructure Status */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          GEO Infrastructure
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wikipedia */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} style={{ color: "#F1C028" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Wikipedia
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: "#F1C028" }} />
              <span className="text-xs" style={{ color: "#F1C028" }}>
                Not yet created
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              Action: Draft &quot;Conceivable (company)&quot; article with published research citations.
            </p>
            <div className="mt-2">
              <JoyButton
                agent="content-engine"
                prompt="Draft a Wikipedia article for 'Conceivable (company)'. Include: founding story, the 50-factor fertility optimization approach, published research citations (US20160140314A1 patent, pilot study showing 150-260% improvement), key technology (AI-powered biomarker tracking), and notable press coverage. Use neutral, encyclopedic tone per Wikipedia guidelines."
                label="Joy: Draft Wikipedia"
              />
            </div>
          </div>

          {/* Schema.org */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={16} style={{ color: ACCENT }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Schema.org
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MinusCircle size={14} style={{ color: "#F1C028" }} />
              <span className="text-xs" style={{ color: "#F1C028" }}>
                Partial implementation
              </span>
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              Organization & Product schemas present. Missing: MedicalStudy, FAQPage, HowTo.
            </p>
          </div>

          {/* Backlinks */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={16} style={{ color: "#1EAA55" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Backlinks
              </span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              142
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>
              referring domains
            </span>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} style={{ color: "#1EAA55" }} />
              <span className="text-xs" style={{ color: "#1EAA55" }}>
                +18 this month
              </span>
            </div>
          </div>

          {/* Published Research */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} style={{ color: "#9686B9" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Published Research
              </span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              1
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>
              pilot study
            </span>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              N=105, 240K data points. 150-260% improvement in conception rates.
            </p>
          </div>
        </div>
      </div>

      {/* 10x Callout */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "#9686B910",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              GEO is the new SEO: Every citation is a compounding asset
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Unlike paid ads, AI citations persist and compound. Getting cited in ChatGPT for
              &quot;best fertility tracker&quot; drives organic discovery 24/7 with zero marginal cost.
              Priority actions: Wikipedia article, complete Schema.org markup, publish second clinical study.
              Unique Ability: CEO provides expert narrative; agents handle technical implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
