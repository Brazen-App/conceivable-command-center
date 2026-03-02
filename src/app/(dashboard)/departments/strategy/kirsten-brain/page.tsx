"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Mic,
  FileText,
  Video,
  MessageCircle,
} from "lucide-react";

const ACCENT = "#9686B9";

interface POVEntry {
  id: string;
  topic: string;
  position: string;
  source: string;
  sourceType: "podcast" | "article" | "interview" | "community" | "internal";
  date: string;
  tags: string[];
  evidence?: string;
}

const POV_ENTRIES: POVEntry[] = [
  {
    id: "pov-01",
    topic: "BBT as a Fertility Biomarker",
    position: "Basal body temperature is the single most underutilized, most accessible fertility biomarker. It tells you more about hormonal health than any single blood test, and it costs nothing to track.",
    source: "The Fertility Blueprint Podcast, Episode 34",
    sourceType: "podcast",
    date: "2026-02-18",
    tags: ["BBT", "biomarkers", "clinical", "fertility science"],
    evidence: "Conceivable pilot data: BBT pattern analysis predicted ovulation timing with 94% accuracy across 105 participants.",
  },
  {
    id: "pov-02",
    topic: "Holistic vs Reductionist Fertility Treatment",
    position: "The fertility industry treats the body as a collection of parts. We treat it as a system. When you optimize sleep, nutrition, stress, and hormonal patterns together, conception rates improve 150-260%. You can't get that by treating one variable.",
    source: "FemTech Leaders Summit Keynote",
    sourceType: "interview",
    date: "2026-02-10",
    tags: ["holistic health", "systems thinking", "clinical", "differentiation"],
    evidence: "Pilot study N=105: multi-variable optimization protocol vs standard care showed 150-260% improvement in conception rates.",
  },
  {
    id: "pov-03",
    topic: "AI in Healthcare Must Be Warm",
    position: "The biggest risk of AI in fertility care isn't accuracy -- it's emotional tone. A technically perfect recommendation delivered without empathy does more harm than good. Kai's personality is as carefully designed as its algorithms.",
    source: "HealthTech Podcast with Dr. Sarah Chen",
    sourceType: "podcast",
    date: "2026-01-28",
    tags: ["AI", "product philosophy", "brand", "empathy"],
  },
  {
    id: "pov-04",
    topic: "The Glucose-Fertility Connection",
    position: "Blood sugar dysregulation is one of the most overlooked causes of fertility struggles. When we stabilize glucose patterns, we see downstream improvements in hormonal balance, ovulation regularity, and conception rates. This is why we're building CGM integration.",
    source: "Conceivable Community Q&A",
    sourceType: "community",
    date: "2026-02-05",
    tags: ["glucose", "nutrition", "clinical", "product roadmap"],
    evidence: "30-Day Glucose Challenge: 67 participants showing correlation between glucose stability and cycle regularity.",
  },
  {
    id: "pov-05",
    topic: "Patent Strategy for FemTech Startups",
    position: "Most FemTech companies under-invest in IP. Your patent portfolio is your moat. We're filing on the closed-loop system (data collection to personalized recommendation to outcome tracking) because that's the defensible innovation, not the individual features.",
    source: "Internal Strategy Session",
    sourceType: "internal",
    date: "2026-02-15",
    tags: ["IP", "legal", "strategy", "competitive moat"],
    evidence: "1 granted patent (BBT interpretation), 1 pending (CON Score), 3 provisionals mapped. IP attorney: 'strongest filing I've seen from a pre-seed company.'",
  },
  {
    id: "pov-06",
    topic: "Community-Led Growth Over Paid Acquisition",
    position: "We don't do paid acquisition. Our community grows organically because the product actually works and the members feel supported. An 847-person community with 62% active rate is worth more than 50,000 paid signups with 2% engagement.",
    source: "Investor Prep Briefing",
    sourceType: "internal",
    date: "2026-02-20",
    tags: ["community", "growth", "fundraising", "metrics"],
  },
  {
    id: "pov-07",
    topic: "120 Podcasts as a Growth Strategy",
    position: "I did 120 podcasts in 4 months. Not because each one was a lead gen event, but because it built a content library that compounds. Each podcast generates 3-5 repurposable pieces. The long tail is the strategy.",
    source: "Content Strategy Review",
    sourceType: "internal",
    date: "2026-01-20",
    tags: ["content", "marketing", "podcasts", "compounding"],
  },
];

const SOURCE_TYPE_CONFIG = {
  podcast: { label: "Podcast", icon: Mic, color: "#5A6FFF" },
  article: { label: "Article", icon: FileText, color: "#1EAA55" },
  interview: { label: "Interview", icon: Video, color: "#E37FB1" },
  community: { label: "Community", icon: MessageCircle, color: "#78C3BF" },
  internal: { label: "Internal", icon: BookOpen, color: "#F1C028" },
};

const ALL_TAGS = Array.from(new Set(POV_ENTRIES.flatMap((e) => e.tags))).sort();

export default function KirstenBrainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");

  const filtered = POV_ENTRIES.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);
    const matchesSource = !selectedSource || entry.sourceType === selectedSource;
    return matchesSearch && matchesTag && matchesSource;
  });

  const sortedFiltered = [...filtered].sort((a, b) =>
    viewMode === "timeline"
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : 0
  );

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header description */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          Kirsten Brain — POV Knowledge Base
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          All recorded positions searchable by topic, date, and source. This is Kirsten&apos;s
          institutional memory -- every stance, every insight, every piece of evidence.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, positions, tags..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#9686B9]/20"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: viewMode === "list" ? ACCENT : "var(--surface)",
              color: viewMode === "list" ? "white" : "var(--muted)",
              border: `1px solid ${viewMode === "list" ? ACCENT : "var(--border)"}`,
            }}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: viewMode === "timeline" ? ACCENT : "var(--surface)",
              color: viewMode === "timeline" ? "white" : "var(--muted)",
              border: `1px solid ${viewMode === "timeline" ? ACCENT : "var(--border)"}`,
            }}
          >
            <Calendar size={12} className="inline mr-1" />
            Timeline
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {/* Source type filter */}
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setSelectedSource(null)}
            className="px-2 py-1 rounded-lg text-[10px] font-medium transition-colors"
            style={{
              backgroundColor: !selectedSource ? ACCENT : "var(--surface)",
              color: !selectedSource ? "white" : "var(--muted)",
              border: `1px solid ${!selectedSource ? ACCENT : "var(--border)"}`,
            }}
          >
            All Sources
          </button>
          {Object.entries(SOURCE_TYPE_CONFIG).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => setSelectedSource(selectedSource === key ? null : key)}
              className="px-2 py-1 rounded-lg text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: selectedSource === key ? conf.color : "var(--surface)",
                color: selectedSource === key ? "white" : "var(--muted)",
                border: `1px solid ${selectedSource === key ? conf.color : "var(--border)"}`,
              }}
            >
              {conf.label}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <div className="flex gap-1 flex-wrap">
          {ALL_TAGS.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="px-2 py-1 rounded-lg text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: selectedTag === tag ? ACCENT : "var(--surface)",
                color: selectedTag === tag ? "white" : "var(--muted)",
                border: `1px solid ${selectedTag === tag ? ACCENT : "var(--border)"}`,
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[10px] mb-4" style={{ color: "var(--muted)" }}>
        {sortedFiltered.length} of {POV_ENTRIES.length} positions
      </p>

      {/* Entries */}
      <div className="space-y-3">
        {sortedFiltered.map((entry) => {
          const sourceConf = SOURCE_TYPE_CONFIG[entry.sourceType];
          const SourceIcon = sourceConf.icon;
          return (
            <div
              key={entry.id}
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start gap-4">
                {/* Timeline dot (visible in timeline mode) */}
                {viewMode === "timeline" && (
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACCENT }} />
                    <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "var(--border)" }} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: `${sourceConf.color}14`, color: sourceConf.color }}
                    >
                      <SourceIcon size={10} />
                      {sourceConf.label}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Topic */}
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                    {entry.topic}
                  </h3>

                  {/* Position */}
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--foreground)" }}>
                    &ldquo;{entry.position}&rdquo;
                  </p>

                  {/* Evidence */}
                  {entry.evidence && (
                    <div
                      className="rounded-lg p-3 mb-3"
                      style={{ backgroundColor: `${ACCENT}06`, borderLeft: `3px solid ${ACCENT}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Evidence
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {entry.evidence}
                      </p>
                    </div>
                  )}

                  {/* Source */}
                  <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>
                    Source: {entry.source}
                  </p>

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {entry.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        className="text-[9px] px-2 py-0.5 rounded-full transition-colors"
                        style={{
                          backgroundColor: selectedTag === tag ? `${ACCENT}14` : "var(--background)",
                          color: selectedTag === tag ? ACCENT : "var(--muted)",
                          border: `1px solid ${selectedTag === tag ? ACCENT : "var(--border)"}`,
                        }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedFiltered.length === 0 && (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Search size={20} className="mx-auto mb-2" style={{ color: "var(--muted-light)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No positions found matching your filters.
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedTag(null); setSelectedSource(null); }}
            className="text-xs mt-2 font-medium"
            style={{ color: ACCENT }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
