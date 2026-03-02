"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Sparkles,
  Users,
  Shield,
  BarChart3,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Bot,
  Send,
  MessageSquare,
} from "lucide-react";
import type {
  Vertical,
  VerticalId,
  ResearchItem,
  Feature,
  CompetitorEntry,
  UserInsight,
  ReadinessCheckItem,
} from "@/lib/data/product-data";
import {
  FEATURE_STATUS_CONFIG,
  PRIORITY_CONFIG,
  COMPLEXITY_CONFIG,
  VERTICAL_COLORS,
} from "@/lib/data/product-data";

const ACCENT = "#E37FB1";

const SECTIONS = [
  { id: "research", label: "Research", icon: Bookmark },
  { id: "features", label: "Features", icon: Sparkles },
  { id: "competitors", label: "Competitive", icon: BarChart3 },
  { id: "insights", label: "User Insights", icon: Users },
  { id: "readiness", label: "Readiness", icon: Shield },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface Props {
  vertical: Vertical;
  research: ResearchItem[];
  features: Feature[];
  competitors: CompetitorEntry[];
  insights: UserInsight[];
  readiness: ReadinessCheckItem[];
  onBack: () => void;
}

export default function VerticalDetail({
  vertical,
  research,
  features,
  competitors,
  insights,
  readiness,
  onBack,
}: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("research");
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const readinessChecked = readiness.filter((r) => r.checked).length;
  const readinessTotal = readiness.length;
  const readinessPercent = readinessTotal > 0 ? Math.round((readinessChecked / readinessTotal) * 100) : 0;

  const handleGenerateIdeas = async () => {
    setGenerating(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are the Product Strategy agent for Conceivable. Generate 5 new feature ideas for the "${vertical.name}" vertical.

CONTEXT:
- Vertical: ${vertical.name} — ${vertical.description}
- Existing features: ${features.map((f) => f.title).join(", ") || "None yet"}
- Key insight: ${vertical.keyInsight}
- User insights: ${insights.map((i) => `"${i.quote}" (theme: ${i.theme})`).join("; ") || "None yet"}

For each idea, provide:
1. Feature name
2. User story (As a [user], I want [X] so that [Y])
3. Priority: Critical / High / Medium / Low
4. Complexity: Small / Medium / Large / Epic
5. Cross-vertical potential (which other verticals could use this)
6. Why this matters for Conceivable's 10x vision`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.response);
      } else {
        setAiResult("Unable to generate ideas — check that the API is configured.");
      }
    } catch {
      setAiResult("Unable to generate ideas — check your connection.");
    } finally {
      setGenerating(false);
    }
  };

  const READINESS_CATEGORIES = [
    { key: "research", label: "Research", color: "#9686B9" },
    { key: "design", label: "Design", color: "#5A6FFF" },
    { key: "clinical", label: "Clinical", color: "#78C3BF" },
    { key: "compliance", label: "Compliance", color: "#E24D47" },
    { key: "engineering", label: "Engineering", color: "#6B7280" },
  ];

  return (
    <div>
      {/* Back button + header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-sm font-medium transition-colors"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={16} />
        Back to Verticals
      </button>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          backgroundColor: `${vertical.color}08`,
          border: `1px solid ${vertical.color}20`,
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{vertical.emoji}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              {vertical.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {vertical.description}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[10px] font-bold" style={{ color: "#5A6FFF" }}>
                {features.length} features
              </span>
              <span className="text-[10px] font-bold" style={{ color: "#9686B9" }}>
                {research.length} research items
              </span>
              <span className="text-[10px] font-bold" style={{ color: "#1EAA55" }}>
                {readinessPercent}% ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {SECTIONS.map((section) => {
          const active = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: vertical.color }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={13} strokeWidth={active ? 2 : 1.5} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Section content */}
      {activeSection === "research" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Research Collection
            </h3>
            <button
              onClick={handleGenerateIdeas}
              disabled={generating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              {generating ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
              Suggest Research Topics
            </button>
          </div>

          {research.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 text-center"
              style={{ borderColor: `${vertical.color}30` }}
            >
              <Bookmark size={24} className="mx-auto mb-2 opacity-30" style={{ color: vertical.color }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No research items yet</p>
              <p className="text-[10px] mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                Start collecting papers, articles, and competitor analysis
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {research.map((item) => {
                const typeColors: Record<string, string> = {
                  paper: "#9686B9",
                  article: "#5A6FFF",
                  competitor: "#E24D47",
                  user_feedback: "#1EAA55",
                  market_data: "#F1C028",
                };
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <div className="flex items-start gap-3">
                      <Bookmark size={14} className="shrink-0 mt-0.5" style={{ color: typeColors[item.type] || ACCENT }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${typeColors[item.type] || ACCENT}14`, color: typeColors[item.type] || ACCENT }}
                          >
                            {item.type.replace("_", " ")}
                          </span>
                          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                            {item.source}
                          </span>
                          <span className="text-[9px] ml-auto" style={{ color: "var(--muted)" }}>
                            {new Date(item.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                          {item.title}
                        </p>
                        <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                          {item.notes}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${vertical.color}10`, color: vertical.color }}
                            >
                              {tag}
                            </span>
                          ))}
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[9px] font-medium ml-auto"
                              style={{ color: vertical.color }}
                            >
                              <ExternalLink size={10} />
                              Source
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {aiResult && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  AI Suggestions
                </p>
              </div>
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {aiResult}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === "features" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Feature Ideation Board
            </h3>
            <button
              onClick={handleGenerateIdeas}
              disabled={generating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Generate Feature Ideas
            </button>
          </div>

          {features.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 text-center"
              style={{ borderColor: `${vertical.color}30` }}
            >
              <Sparkles size={24} className="mx-auto mb-2 opacity-30" style={{ color: vertical.color }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No features defined yet</p>
              <p className="text-[10px] mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                Use the AI generator or add features manually
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {features.map((feat) => {
                const statusConf = FEATURE_STATUS_CONFIG[feat.status];
                const prioConf = PRIORITY_CONFIG[feat.priority];
                const compConf = COMPLEXITY_CONFIG[feat.complexity];
                const isExpanded = expandedFeature === feat.id;

                return (
                  <div
                    key={feat.id}
                    className="rounded-xl border"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer"
                      onClick={() => setExpandedFeature(isExpanded ? null : feat.id)}
                    >
                      <div className="pt-0.5">
                        {isExpanded ? (
                          <ChevronDown size={14} style={{ color: vertical.color }} />
                        ) : (
                          <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                          >
                            {statusConf.label}
                          </span>
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${prioConf.color}14`, color: prioConf.color }}
                          >
                            {prioConf.label}
                          </span>
                          <span
                            className="text-[9px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
                          >
                            {compConf.label} ({compConf.points} pts)
                          </span>
                        </div>
                        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                          {feat.title}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {feat.userStory}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="mt-3 space-y-3">
                          {feat.notes && (
                            <div
                              className="rounded-lg p-3"
                              style={{ backgroundColor: `${vertical.color}06`, borderLeft: `3px solid ${vertical.color}` }}
                            >
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: vertical.color }}>
                                Notes
                              </p>
                              <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                                {feat.notes}
                              </p>
                            </div>
                          )}

                          {feat.crossVerticalIds.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                                Cross-Vertical Connections
                              </p>
                              <div className="flex gap-1.5 flex-wrap">
                                {feat.crossVerticalIds.map((vid) => {
                                  const color = VERTICAL_COLORS[vid];
                                  return (
                                    <span
                                      key={vid}
                                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ backgroundColor: `${color}14`, color }}
                                    >
                                      {vid.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--muted)" }}>
                            <span>Created: {new Date(feat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            <span>Updated: {new Date(feat.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {aiResult && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  AI-Generated Ideas
                </p>
              </div>
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {aiResult}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === "competitors" && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
            Competitive Landscape
          </h3>

          {competitors.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 text-center"
              style={{ borderColor: `${vertical.color}30` }}
            >
              <BarChart3 size={24} className="mx-auto mb-2 opacity-30" style={{ color: vertical.color }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No competitor analysis yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {competitors.map((comp) => {
                const strengthColors: Record<string, string> = {
                  strong: "#1EAA55",
                  moderate: "#F1C028",
                  weak: "#E24D47",
                };
                return (
                  <div
                    key={comp.id}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {comp.competitor}
                      </p>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${strengthColors[comp.strength]}14`,
                          color: strengthColors[comp.strength],
                        }}
                      >
                        {comp.strength}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium mb-1" style={{ color: "var(--muted)" }}>
                      Feature: {comp.feature}
                    </p>
                    <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                      {comp.notes}
                    </p>
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#1EAA55" }}>
                        Our Opportunity
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {comp.opportunity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSection === "insights" && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
            User Insights
          </h3>

          {insights.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 text-center"
              style={{ borderColor: `${vertical.color}30` }}
            >
              <MessageSquare size={24} className="mx-auto mb-2 opacity-30" style={{ color: vertical.color }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No user insights collected yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {insights.map((insight) => {
                const sourceColors: Record<string, string> = {
                  community: "#1EAA55",
                  interview: "#5A6FFF",
                  survey: "#9686B9",
                  support: "#F1C028",
                };
                return (
                  <div
                    key={insight.id}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${sourceColors[insight.source]}14`,
                          color: sourceColors[insight.source],
                        }}
                      >
                        {insight.source}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${vertical.color}14`, color: vertical.color }}
                      >
                        {insight.theme}
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[9px] font-mono" style={{ color: "var(--muted)" }}>
                          Impact:
                        </span>
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: insight.impactScore >= 8 ? "#E24D47" : insight.impactScore >= 5 ? "#F1C028" : "var(--muted)" }}
                        >
                          {insight.impactScore}/10
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-sm leading-relaxed italic"
                      style={{ color: "var(--foreground)" }}
                    >
                      &ldquo;{insight.quote}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSection === "readiness" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Readiness Assessment
            </h3>
            <span
              className="text-sm font-bold"
              style={{ color: readinessPercent >= 75 ? "#1EAA55" : readinessPercent >= 50 ? "#F1C028" : "#E24D47" }}
            >
              {readinessPercent}% complete
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-3 rounded-full overflow-hidden mb-6"
            style={{ backgroundColor: "var(--background)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${readinessPercent}%`,
                backgroundColor: readinessPercent >= 75 ? "#1EAA55" : readinessPercent >= 50 ? "#F1C028" : "#E24D47",
              }}
            />
          </div>

          {readiness.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 text-center"
              style={{ borderColor: `${vertical.color}30` }}
            >
              <Shield size={24} className="mx-auto mb-2 opacity-30" style={{ color: vertical.color }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No readiness checklist yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {READINESS_CATEGORIES.map((cat) => {
                const items = readiness.filter((r) => r.category === cat.key);
                if (items.length === 0) return null;
                const checked = items.filter((r) => r.checked).length;
                return (
                  <div key={cat.key}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cat.color }}>
                        {cat.label}
                      </p>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {checked}/{items.length}
                      </span>
                    </div>
                    <div className="space-y-1 ml-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          {item.checked ? (
                            <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                          ) : (
                            <Circle size={14} style={{ color: "var(--border)" }} />
                          )}
                          <span
                            className="text-[11px]"
                            style={{
                              color: item.checked ? "var(--foreground)" : "var(--muted)",
                              textDecoration: item.checked ? "none" : "none",
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Send to Engineering button */}
          <div className="mt-6">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-40"
              style={{ backgroundColor: readinessPercent >= 75 ? "#6B7280" : `${ACCENT}40` }}
              disabled={readinessPercent < 75}
            >
              <Send size={15} />
              {readinessPercent >= 75
                ? "Send to Engineering"
                : `Need ${75 - readinessPercent}% more readiness to send to Engineering`}
            </button>
            {readinessPercent < 75 && (
              <p className="text-[10px] text-center mt-2" style={{ color: "var(--muted)" }}>
                Complete more checklist items to unlock this action
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
