"use client";

import { useState, useCallback } from "react";
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
  Loader2,
  Play,
  Clock,
  Check,
  Zap,
  Calendar,
  BarChart3,
  Target,
  ArrowRight,
  Send,
} from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const YELLOW = "#F1C028";
const RED = "#E24D47";
const PURPLE = "#9686B9";

// --- Types ---

type CitationStatus = "cited" | "mentioned" | "absent";
type ActionStatus = "idle" | "in_progress" | "done";

interface AIEngineResult {
  engine: string;
  status: CitationStatus;
}

interface QueryTracker {
  id: string;
  query: string;
  category: "product" | "condition" | "technology" | "alternative";
  searchVolume: string;
  difficulty: "low" | "medium" | "high";
  engines: AIEngineResult[];
  competitors: string[];
  lastChecked: string;
}

// --- Keyword Data ---

const QUERIES: QueryTracker[] = [
  {
    id: "q-01",
    query: "best fertility supplement",
    category: "product",
    searchVolume: "14,800/mo",
    difficulty: "high",
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
    category: "product",
    searchVolume: "3,200/mo",
    difficulty: "medium",
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
    category: "product",
    searchVolume: "2,100/mo",
    difficulty: "medium",
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
    category: "product",
    searchVolume: "9,600/mo",
    difficulty: "high",
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
    category: "product",
    searchVolume: "5,400/mo",
    difficulty: "medium",
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
    category: "product",
    searchVolume: "4,100/mo",
    difficulty: "medium",
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
    category: "condition",
    searchVolume: "22,000/mo",
    difficulty: "high",
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
    category: "technology",
    searchVolume: "1,800/mo",
    difficulty: "low",
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
    category: "alternative",
    searchVolume: "8,900/mo",
    difficulty: "high",
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
    category: "technology",
    searchVolume: "2,400/mo",
    difficulty: "low",
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

// --- GEO Checklist ---

interface ChecklistItem {
  id: string;
  task: string;
  frequency: "daily" | "weekly" | "monthly";
  description: string;
}

const GEO_CHECKLIST: ChecklistItem[] = [
  // Daily
  { id: "d1", task: "Monitor AI engine mentions", frequency: "daily", description: "Check ChatGPT, Claude, Gemini, Perplexity for brand mentions on top 3 keywords" },
  { id: "d2", task: "Publish 1 expert micro-content piece", frequency: "daily", description: "Short-form content (tweet, LinkedIn post, or forum answer) targeting a tracked keyword" },
  { id: "d3", task: "Respond to 1 Reddit/forum thread", frequency: "daily", description: "Expert response in r/TryingForABaby, r/PCOS, r/infertility (builds authority signals)" },
  // Weekly
  { id: "w1", task: "Publish long-form blog post", frequency: "weekly", description: "1,500+ word article targeting a specific tracked query with FAQ schema" },
  { id: "w2", task: "Update schema markup", frequency: "weekly", description: "Add/update FAQ, HowTo, and MedicalStudy schemas on key landing pages" },
  { id: "w3", task: "Earn 2+ backlinks", frequency: "weekly", description: "Guest post, podcast appearance, or research citation placement" },
  { id: "w4", task: "Run GEO visibility audit", frequency: "weekly", description: "Re-check all 10 target queries across all 4 AI engines, update tracker" },
  // Monthly
  { id: "m1", task: "Wikipedia article progress", frequency: "monthly", description: "Draft, refine, or update the Conceivable Wikipedia article with new citations" },
  { id: "m2", task: "Competitor GEO analysis", frequency: "monthly", description: "Map which competitors are gaining/losing AI citations and why" },
  { id: "m3", task: "Content gap analysis", frequency: "monthly", description: "Identify new queries where Conceivable should be cited but isn't" },
  { id: "m4", task: "Technical SEO audit", frequency: "monthly", description: "Check Core Web Vitals, crawl errors, sitemap, robots.txt, structured data validation" },
];

// --- Helpers ---

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
    cited: { color: GREEN, icon: CheckCircle2, label: "Cited" },
    mentioned: { color: YELLOW, icon: MinusCircle, label: "Mentioned" },
    absent: { color: RED, icon: XCircle, label: "Absent" },
  };
  const { color, icon: Icon, label } = config[status];
  return (
    <div className="flex flex-col items-center gap-1" title={label}>
      <Icon size={16} style={{ color }} />
    </div>
  );
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  product: { label: "Product", color: ACCENT },
  condition: { label: "Condition", color: GREEN },
  technology: { label: "Technology", color: PURPLE },
  alternative: { label: "Alternative", color: YELLOW },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  low: GREEN,
  medium: YELLOW,
  high: RED,
};

// --- Main Component ---

export default function SeoGeoPage() {
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [strategyLoading, setStrategyLoading] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<Record<string, string>>({});
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionStatus>>({});
  const [checklistDone, setChecklistDone] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"keywords" | "checklist" | "report">("keywords");

  const geoScore = getGeoScore(QUERIES);
  const citedCount = QUERIES.filter((q) => q.engines.some((e) => e.status === "cited")).length;
  const mentionedCount = QUERIES.filter((q) => q.engines.some((e) => e.status === "mentioned") && !q.engines.some((e) => e.status === "cited")).length;

  // Generate AI ranking strategy for a keyword
  const generateStrategy = useCallback(async (query: QueryTracker) => {
    setStrategyLoading(query.id);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextType: "seo-geo",
          contextId: query.id,
          message: `Generate a detailed ranking strategy for the keyword "${query.query}".

Current status:
${query.engines.map((e) => `- ${e.engine}: ${e.status}`).join("\n")}

Competitors currently ranking: ${query.competitors.join(", ")}
Search volume: ${query.searchVolume}
Difficulty: ${query.difficulty}

Provide:
1. WHY we should rank for this (business impact)
2. CONTENT STRATEGY: What specific content to create (title, format, word count, key sections)
3. TECHNICAL SEO: Schema markup, internal linking, page speed considerations
4. GEO STRATEGY: How to get cited by each AI engine where we're absent
5. BACKLINK TARGETS: 3-5 specific sites to target for backlinks
6. TIMELINE: What to do this week, this month, this quarter
7. EXPECTED IMPACT: Estimated traffic and conversion impact

Be specific and actionable. This is for a fertility health tech company called Conceivable that uses AI + wearable data (the Halo Ring) + personalized supplement packs to optimize fertility.`,
        }),
      });

      if (!res.ok) throw new Error("Strategy generation failed");
      const data = await res.json();
      setStrategies((prev) => ({ ...prev, [query.id]: data.response || data.message || "Strategy generated. Check the response." }));
    } catch {
      setStrategies((prev) => ({ ...prev, [query.id]: "Failed to generate strategy. Try again." }));
    } finally {
      setStrategyLoading(null);
    }
  }, []);

  const setAction = (queryId: string, action: string, status: ActionStatus) => {
    setActionStatuses((prev) => ({ ...prev, [`${queryId}-${action}`]: status }));
  };

  const getAction = (queryId: string, action: string): ActionStatus => {
    return actionStatuses[`${queryId}-${action}`] || "idle";
  };

  const toggleChecklist = (id: string) => {
    setChecklistDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dailyItems = GEO_CHECKLIST.filter((i) => i.frequency === "daily");
  const weeklyItems = GEO_CHECKLIST.filter((i) => i.frequency === "weekly");
  const monthlyItems = GEO_CHECKLIST.filter((i) => i.frequency === "monthly");

  const dailyDone = dailyItems.filter((i) => checklistDone.has(i.id)).length;
  const weeklyDone = weeklyItems.filter((i) => checklistDone.has(i.id)).length;
  const monthlyDone = monthlyItems.filter((i) => checklistDone.has(i.id)).length;

  return (
    <div className="space-y-6">
      {/* GEO Score Hero */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center md:text-left flex-1">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
              AI Visibility Score
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold" style={{ color: "var(--foreground)" }}>
                {geoScore}
              </span>
              <span className="text-lg" style={{ color: "var(--muted)" }}>/ 10</span>
            </div>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              <strong style={{ color: GREEN }}>{citedCount} cited</strong> &middot;{" "}
              <strong style={{ color: YELLOW }}>{mentionedCount} mentioned only</strong> &middot;{" "}
              <strong style={{ color: RED }}>{10 - citedCount - mentionedCount} absent</strong>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              The Gain: started at 1/10 eight weeks ago &rarr; now {geoScore}/10
            </p>
          </div>

          {/* Legend + Tabs */}
          <div className="flex flex-col gap-3 items-end">
            <div
              className="flex gap-4 text-xs rounded-lg px-4 py-3"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: GREEN }} />
                <span style={{ color: "var(--foreground)" }}>Cited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MinusCircle size={14} style={{ color: YELLOW }} />
                <span style={{ color: "var(--foreground)" }}>Mentioned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle size={14} style={{ color: RED }} />
                <span style={{ color: "var(--foreground)" }}>Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex gap-1 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {[
          { id: "keywords" as const, label: "Keywords & Strategy", icon: Target },
          { id: "checklist" as const, label: "GEO Checklist", icon: Check },
          { id: "report" as const, label: "Weekly Report", icon: BarChart3 },
        ].map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={active ? { backgroundColor: "var(--surface)", color: ACCENT } : { color: "var(--muted)" }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========== KEYWORDS TAB ========== */}
      {activeTab === "keywords" && (
        <div className="space-y-3">
          {QUERIES.map((q, idx) => {
            const isExpanded = expandedQuery === q.id;
            const cat = CATEGORY_LABELS[q.category];
            const diffColor = DIFFICULTY_COLORS[q.difficulty];
            const hasStrategy = !!strategies[q.id];
            const isLoadingStrategy = strategyLoading === q.id;

            return (
              <div
                key={q.id}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "var(--surface)",
                  border: `1px solid ${isExpanded ? `${ACCENT}40` : "var(--border)"}`,
                }}
              >
                {/* Row header — clickable */}
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
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                            &quot;{q.query}&quot;
                          </p>
                          <span
                            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${cat.color}14`, color: cat.color }}
                          >
                            {cat.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                            {q.searchVolume}
                          </span>
                          <span className="text-[10px] font-semibold" style={{ color: diffColor }}>
                            {q.difficulty} difficulty
                          </span>
                          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                            Checked: {q.lastChecked}
                          </span>
                        </div>
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

                  {/* Competitors */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Competitors:
                    </span>
                    {q.competitors.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 pt-3 space-y-4"
                    style={{ backgroundColor: "var(--background)", borderTop: "1px solid var(--border)" }}
                  >
                    {/* Action Buttons */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                        Actions
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Generate Strategy */}
                        <button
                          onClick={() => generateStrategy(q)}
                          disabled={isLoadingStrategy}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                          style={{ backgroundColor: ACCENT }}
                        >
                          {isLoadingStrategy ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Sparkles size={11} />
                          )}
                          {isLoadingStrategy ? "Generating..." : "AI Ranking Strategy"}
                        </button>

                        {/* Draft Content */}
                        <ActionButton
                          status={getAction(q.id, "draft")}
                          onAction={() => setAction(q.id, "draft", "in_progress")}
                          idleLabel="Draft Content"
                          idleIcon={<FileText size={11} />}
                          progressLabel="Drafting..."
                          query={q}
                          agent="content-engine"
                          prompt={`Write SEO/GEO-optimized content targeting "${q.query}". Create a comprehensive, authoritative 1,500+ word article with FAQ schema that AI engines will cite. Include sections that directly answer the query, cite Conceivable's research and technology. Competitors to address: ${q.competitors.join(", ")}.`}
                        />

                        {/* Mark In Progress */}
                        {getAction(q.id, "status") === "idle" && (
                          <button
                            onClick={() => setAction(q.id, "status", "in_progress")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: `${YELLOW}14`, color: YELLOW }}
                          >
                            <Clock size={11} /> Mark In Progress
                          </button>
                        )}
                        {getAction(q.id, "status") === "in_progress" && (
                          <button
                            onClick={() => setAction(q.id, "status", "done")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: `${GREEN}14`, color: GREEN }}
                          >
                            <Check size={11} /> Mark Complete
                          </button>
                        )}
                        {getAction(q.id, "status") === "done" && (
                          <span
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ color: GREEN }}
                          >
                            <CheckCircle2 size={11} /> Complete
                          </span>
                        )}

                        {/* Re-check Engines */}
                        <JoyButton
                          agent="content-engine"
                          prompt={`Re-check AI engine presence for "${q.query}". Current: ${q.engines.map((e) => `${e.engine}: ${e.status}`).join(", ")}. What specific steps to improve visibility where we're absent or only mentioned?`}
                          label="Re-check Engines"
                          variant="secondary"
                          icon={<RefreshCw size={11} />}
                          iconSize={11}
                        />

                        {/* Schema Markup */}
                        <JoyButton
                          agent="content-engine"
                          prompt={`Generate JSON-LD schema markup for "${q.query}" to improve GEO visibility. Include FAQ, HowTo, and Article schema targeting AI engine citation for Conceivable.`}
                          label="Schema Markup"
                          variant="ghost"
                          icon={<Code2 size={11} />}
                          iconSize={11}
                        />
                      </div>
                    </div>

                    {/* AI-Generated Strategy */}
                    {(hasStrategy || isLoadingStrategy) && (
                      <div
                        className="rounded-lg p-4"
                        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} style={{ color: ACCENT }} />
                          <span className="text-xs font-bold" style={{ color: ACCENT }}>
                            AI Ranking Strategy
                          </span>
                        </div>
                        {isLoadingStrategy ? (
                          <div className="flex items-center gap-2 py-4">
                            <Loader2 size={16} className="animate-spin" style={{ color: ACCENT }} />
                            <span className="text-xs" style={{ color: "var(--muted)" }}>
                              Analyzing keyword, competitors, and AI engine behavior...
                            </span>
                          </div>
                        ) : (
                          <div
                            className="text-xs leading-relaxed whitespace-pre-wrap"
                            style={{ color: "var(--foreground)" }}
                          >
                            {strategies[q.id]}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Analysis */}
                    {!hasStrategy && !isLoadingStrategy && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                            Quick Strategy
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {q.engines.some((e) => e.status === "cited")
                              ? `Already cited. Maintain by publishing supporting content, updating schema, and building more backlinks.`
                              : `Not yet cited. Create comprehensive, authoritative content with FAQ schema. Target backlinks from fertility/health authority sites.`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                            Gap
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {q.engines.filter((e) => e.status === "absent").length > 0
                              ? `Absent from: ${q.engines.filter((e) => e.status === "absent").map((e) => e.engine).join(", ")}. Click "AI Ranking Strategy" for detailed plan.`
                              : "Present on all engines. Focus on upgrading from 'mentioned' to 'cited'."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========== CHECKLIST TAB ========== */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          {/* Progress bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard label="Daily" done={dailyDone} total={dailyItems.length} color={GREEN} icon={Zap} />
            <ProgressCard label="Weekly" done={weeklyDone} total={weeklyItems.length} color={ACCENT} icon={Calendar} />
            <ProgressCard label="Monthly" done={monthlyDone} total={monthlyItems.length} color={PURPLE} icon={BarChart3} />
          </div>

          {/* Daily */}
          <ChecklistSection
            title="Daily Tasks"
            items={dailyItems}
            done={checklistDone}
            onToggle={toggleChecklist}
            color={GREEN}
            icon={Zap}
          />

          {/* Weekly */}
          <ChecklistSection
            title="Weekly Tasks"
            items={weeklyItems}
            done={checklistDone}
            onToggle={toggleChecklist}
            color={ACCENT}
            icon={Calendar}
          />

          {/* Monthly */}
          <ChecklistSection
            title="Monthly Tasks"
            items={monthlyItems}
            done={checklistDone}
            onToggle={toggleChecklist}
            color={PURPLE}
            icon={BarChart3}
          />
        </div>
      )}

      {/* ========== REPORT TAB ========== */}
      {activeTab === "report" && <WeeklyReport queries={QUERIES} geoScore={geoScore} citedCount={citedCount} />}

      {/* Infrastructure Status — always visible */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
          GEO Infrastructure
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfraCard
            icon={BookOpen}
            iconColor={YELLOW}
            title="Wikipedia"
            statusIcon={AlertTriangle}
            statusColor={YELLOW}
            statusLabel="Not yet created"
            detail='Action: Draft "Conceivable (company)" article with published research citations.'
            joyPrompt="Draft a Wikipedia article for 'Conceivable (company)'. Include: founding story, the 50-factor fertility optimization approach, published research citations (US10467382B2 patent, pilot study showing 150-260% improvement), key technology (AI-powered biomarker tracking via the Halo Ring), and notable press coverage. Use neutral, encyclopedic tone per Wikipedia guidelines."
          />
          <InfraCard
            icon={Code2}
            iconColor={ACCENT}
            title="Schema.org"
            statusIcon={MinusCircle}
            statusColor={YELLOW}
            statusLabel="Partial"
            detail="Organization & Product present. Missing: MedicalStudy, FAQPage, HowTo."
          />
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={16} style={{ color: GREEN }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Backlinks</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>142</span>
            <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>referring domains</span>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} style={{ color: GREEN }} />
              <span className="text-xs" style={{ color: GREEN }}>+18 this month</span>
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} style={{ color: PURPLE }} />
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Published Research</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>1</span>
            <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>pilot study</span>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              N=105, 240K data points. 150-260% improvement in conception rates.
            </p>
          </div>
        </div>
      </div>

      {/* 10x Callout */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "#9686B910", border: "1px solid #9686B920" }}>
        <div className="flex items-start gap-3">
          <div className="px-2 py-1 rounded text-xs font-bold shrink-0" style={{ backgroundColor: "#9686B920", color: PURPLE }}>
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
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ActionButton({
  status,
  onAction,
  idleLabel,
  idleIcon,
  progressLabel,
  query,
  agent,
  prompt,
}: {
  status: ActionStatus;
  onAction: () => void;
  idleLabel: string;
  idleIcon: React.ReactNode;
  progressLabel: string;
  query: QueryTracker;
  agent: "content-engine";
  prompt: string;
}) {
  if (status === "idle") {
    return (
      <JoyButton
        agent={agent}
        prompt={prompt}
        label={idleLabel}
        variant="secondary"
        icon={idleIcon}
        iconSize={11}
      />
    );
  }
  if (status === "in_progress") {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: YELLOW }}>
        <Clock size={11} /> {progressLabel}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: GREEN }}>
      <CheckCircle2 size={11} /> Content drafted
    </span>
  );
}

function ProgressCard({
  label,
  done,
  total,
  color,
  icon: Icon,
}: {
  label: string;
  done: number;
  total: number;
  color: string;
  icon: React.ElementType;
}) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>
          {done}/{total}
        </span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${color}18` }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ChecklistSection({
  title,
  items,
  done,
  onToggle,
  color,
  icon: Icon,
}: {
  title: string;
  items: ChecklistItem[];
  done: Set<string>;
  onToggle: (id: string) => void;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <Icon size={14} style={{ color }} />
        <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{title}</span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {items.map((item) => {
          const isDone = done.has(item.id);
          return (
            <div
              key={item.id}
              className="px-5 py-3 flex items-start gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onToggle(item.id)}
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: isDone ? color : "transparent",
                  border: isDone ? "none" : "2px solid var(--border)",
                }}
              >
                {isDone && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${isDone ? "line-through" : ""}`}
                  style={{ color: isDone ? "var(--muted)" : "var(--foreground)" }}
                >
                  {item.task}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfraCard({
  icon: Icon,
  iconColor,
  title,
  statusIcon: StatusIcon,
  statusColor,
  statusLabel,
  detail,
  joyPrompt,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  statusIcon: React.ElementType;
  statusColor: string;
  statusLabel: string;
  detail: string;
  joyPrompt?: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} style={{ color: iconColor }} />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <StatusIcon size={14} style={{ color: statusColor }} />
        <span className="text-xs" style={{ color: statusColor }}>{statusLabel}</span>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>{detail}</p>
      {joyPrompt && (
        <div className="mt-2">
          <JoyButton agent="content-engine" prompt={joyPrompt} label="Joy: Draft" />
        </div>
      )}
    </div>
  );
}

function WeeklyReport({
  queries,
  geoScore,
  citedCount,
}: {
  queries: QueryTracker[];
  geoScore: number;
  citedCount: number;
}) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextType: "seo-geo",
          contextId: "weekly-report",
          message: `Generate a weekly GEO/SEO report for Conceivable.

Current data:
- GEO Visibility Score: ${geoScore}/10
- Keywords cited: ${citedCount}/10
- Keyword breakdown:
${queries.map((q) => `  "${q.query}" (${q.searchVolume}, ${q.difficulty} difficulty): ${q.engines.map((e) => `${e.engine}=${e.status}`).join(", ")}`).join("\n")}

Format the report with:
1. EXECUTIVE SUMMARY (2-3 sentences)
2. WINS THIS WEEK (what improved)
3. GAPS & OPPORTUNITIES (where we're absent)
4. TOP 3 PRIORITY ACTIONS (specific, actionable)
5. COMPETITOR MOVEMENTS (who's gaining/losing)
6. NEXT WEEK TARGETS (what to focus on)

Use the Gain framework — measure from where we started (1/10), not from the target (10/10). Be specific and actionable. This is for a fertility health tech CEO.`,
        }),
      });

      if (!res.ok) throw new Error("Report failed");
      const data = await res.json();
      setReport(data.response || data.message || "Report generated.");
    } catch {
      setReport("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Report header */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} style={{ color: ACCENT }} />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Weekly GEO Report
            </span>
          </div>
          <button
            onClick={generateReport}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {generating ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Sparkles size={11} />
            )}
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{geoScore}</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>GEO Score</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-2xl font-bold" style={{ color: GREEN }}>{citedCount}</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cited</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-2xl font-bold" style={{ color: YELLOW }}>
              {queries.filter((q) => q.engines.some((e) => e.status === "mentioned")).length}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mentioned</p>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              {queries.reduce((sum, q) => sum + q.engines.filter((e) => e.status === "absent").length, 0)}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Engine Gaps</p>
          </div>
        </div>

        {/* Per-engine breakdown */}
        <div className="grid grid-cols-4 gap-2">
          {["ChatGPT", "Claude", "Gemini", "Perplexity"].map((engine) => {
            const cited = queries.filter((q) => q.engines.find((e) => e.engine === engine)?.status === "cited").length;
            const mentioned = queries.filter((q) => q.engines.find((e) => e.engine === engine)?.status === "mentioned").length;
            const absent = queries.filter((q) => q.engines.find((e) => e.engine === engine)?.status === "absent").length;
            return (
              <div key={engine} className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>{engine}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: GREEN }}>Cited</span>
                    <span className="text-[10px] font-bold" style={{ color: GREEN }}>{cited}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: YELLOW }}>Mentioned</span>
                    <span className="text-[10px] font-bold" style={{ color: YELLOW }}>{mentioned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: RED }}>Absent</span>
                    <span className="text-[10px] font-bold" style={{ color: RED }}>{absent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Report Output */}
      {(report || generating) && (
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: ACCENT }} />
            <span className="text-xs font-bold" style={{ color: ACCENT }}>AI-Generated Report</span>
          </div>
          {generating ? (
            <div className="flex items-center gap-2 py-8 justify-center">
              <Loader2 size={18} className="animate-spin" style={{ color: ACCENT }} />
              <span className="text-sm" style={{ color: "var(--muted)" }}>Analyzing visibility data and generating report...</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
              {report}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
