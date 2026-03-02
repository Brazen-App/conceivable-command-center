"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Brain,
  Search,
  Mic,
  FileText,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import type { POVEntry, EmotionalTone, POVSourceType } from "@/lib/data/pov-data";

const TONE_COLORS: Record<string, string> = {
  passionate: "#E24D47",
  confident: "#5A6FFF",
  "warm-educational": "#F1C028",
  excited: "#1EAA55",
  "strategic-calm": "#356FB6",
  energized: "#E37FB1",
  urgent: "#E24D47",
  measured: "#78C3BF",
};

const SOURCE_ICONS: Record<POVSourceType, typeof Mic> = {
  voice: Mic,
  text: FileText,
  "quick-capture": Zap,
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

interface POVCardProps {
  pov: POVEntry;
  onTopicClick: (topic: string) => void;
}

function POVCard({ pov, onTopicClick }: POVCardProps) {
  const [expanded, setExpanded] = useState(false);
  const SourceIcon = SOURCE_ICONS[pov.sourceType] || FileText;
  const toneColor = pov.emotionalTone ? TONE_COLORS[pov.emotionalTone] || "var(--muted)" : "var(--muted)";

  return (
    <div
      className="rounded-xl border p-5 transition-all duration-150 hover:shadow-sm"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {pov.topic}
          </h3>
          <div className="flex items-center gap-2.5 mt-1.5">
            <div className="flex items-center gap-1">
              <Clock size={11} style={{ color: "var(--muted-light)" }} />
              <span
                className="text-[10px]"
                style={{ color: "var(--muted-light)" }}
              >
                {relativeTime(pov.createdAt)}
              </span>
            </div>
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: "#5A6FFF08" }}
            >
              <SourceIcon size={10} style={{ color: "#5A6FFF" }} />
              <span
                className="text-[10px] font-medium capitalize"
                style={{ color: "#5A6FFF" }}
              >
                {pov.sourceType.replace("-", " ")}
              </span>
            </div>
            {pov.emotionalTone && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize"
                style={{
                  backgroundColor: `${toneColor}10`,
                  color: toneColor,
                }}
              >
                {pov.emotionalTone.replace("-", " ")}
              </span>
            )}
          </div>
        </div>
        {pov.durationSeconds && (
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-md shrink-0"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--muted)",
            }}
          >
            {Math.floor(pov.durationSeconds / 60)}:{String(pov.durationSeconds % 60).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Transcript (expandable) */}
      <div className="mb-3">
        <p
          className={`text-xs leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
          style={{ color: "var(--muted)" }}
        >
          {pov.transcript}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-1 text-[11px] font-medium"
          style={{ color: "#5A6FFF" }}
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={12} />
            </>
          ) : (
            <>
              Read full transcript <ChevronDown size={12} />
            </>
          )}
        </button>
      </div>

      {/* Key Positions */}
      {pov.keyPositions.length > 0 && (
        <div className="mb-3">
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-caption)",
              letterSpacing: "0.1em",
            }}
          >
            Key Positions
          </p>
          <ul className="space-y-1">
            {pov.keyPositions.map((pos, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs"
                style={{ color: "var(--foreground)" }}
              >
                <span
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: "#5A6FFF" }}
                />
                {pos}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analogies */}
      {pov.analogies.length > 0 && (
        <div className="mb-3">
          <p
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-caption)",
              letterSpacing: "0.1em",
            }}
          >
            Analogies
          </p>
          {pov.analogies.map((a, i) => (
            <p
              key={i}
              className="text-xs italic leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              &ldquo;{a}&rdquo;
            </p>
          ))}
        </div>
      )}

      {/* Related Topics */}
      {pov.relatedTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pov.relatedTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicClick(topic)}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: "#5A6FFF10",
                color: "#5A6FFF",
                border: "1px solid #5A6FFF20",
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function KnowledgeBase() {
  const [povs, setPovs] = useState<POVEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<POVSourceType | "all">("all");
  const [toneFilter, setToneFilter] = useState<EmotionalTone | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pov")
      .then((r) => r.json())
      .then((data) => {
        setPovs(data.povs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Client-side filtering (debounced via useMemo)
  const filtered = useMemo(() => {
    let result = [...povs];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.topic.toLowerCase().includes(q) ||
          p.transcript.toLowerCase().includes(q) ||
          p.keyPositions.some((k) => k.toLowerCase().includes(q)) ||
          p.relatedTopics.some((t) => t.toLowerCase().includes(q)) ||
          p.analogies.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (sourceFilter !== "all") {
      result = result.filter((p) => p.sourceType === sourceFilter);
    }
    if (toneFilter !== "all") {
      result = result.filter((p) => p.emotionalTone === toneFilter);
    }
    return result;
  }, [povs, searchQuery, sourceFilter, toneFilter]);

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic);
  };

  // Gather unique tones for filter
  const uniqueTones = useMemo(() => {
    const tones = new Set<string>();
    povs.forEach((p) => {
      if (p.emotionalTone) tones.add(p.emotionalTone);
    });
    return Array.from(tones).sort();
  }, [povs]);

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#5A6FFF14" }}
          >
            <Brain size={20} style={{ color: "#5A6FFF" }} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Knowledge Base
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Kirsten Brain — Your POV Voice Model
            </p>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div
        className="rounded-xl border p-3 mb-4 flex items-center gap-3"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Search size={16} style={{ color: "var(--muted-light)" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search POVs by topic, transcript, position, or tag..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-body)",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-medium px-2 py-1 rounded-md"
            style={{
              color: "var(--muted)",
              backgroundColor: "var(--background)",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Source filter */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-caption)",
              letterSpacing: "0.1em",
            }}
          >
            Source:
          </span>
          {(["all", "voice", "text", "quick-capture"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
              style={
                sourceFilter === s
                  ? { backgroundColor: "#5A6FFF", color: "#fff" }
                  : { backgroundColor: "var(--background)", color: "var(--muted)" }
              }
            >
              {s === "all" ? "All" : s === "quick-capture" ? "Quick Capture" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Tone filter */}
        <div className="flex items-center gap-1.5 ml-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-caption)",
              letterSpacing: "0.1em",
            }}
          >
            Tone:
          </span>
          <button
            onClick={() => setToneFilter("all")}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
            style={
              toneFilter === "all"
                ? { backgroundColor: "#5A6FFF", color: "#fff" }
                : { backgroundColor: "var(--background)", color: "var(--muted)" }
            }
          >
            All
          </button>
          {uniqueTones.map((tone) => (
            <button
              key={tone}
              onClick={() => setToneFilter(tone as EmotionalTone)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors"
              style={
                toneFilter === tone
                  ? { backgroundColor: TONE_COLORS[tone] || "#5A6FFF", color: "#fff" }
                  : { backgroundColor: "var(--background)", color: "var(--muted)" }
              }
            >
              {tone.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        {loading
          ? "Loading POVs..."
          : `${filtered.length} POV${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* POV Cards */}
      <div className="space-y-4">
        {filtered.map((pov) => (
          <POVCard key={pov.id} pov={pov} onTopicClick={handleTopicClick} />
        ))}

        {!loading && filtered.length === 0 && (
          <div
            className="rounded-xl border p-10 text-center"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <Brain
              size={28}
              className="mx-auto mb-3"
              style={{ color: "var(--muted-light)" }}
              strokeWidth={1.5}
            />
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {searchQuery || sourceFilter !== "all" || toneFilter !== "all"
                ? "No POVs match your current filters"
                : "No POVs recorded yet"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
              {searchQuery || sourceFilter !== "all" || toneFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Record your first POV in the Content Engine to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
