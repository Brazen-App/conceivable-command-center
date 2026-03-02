"use client";

import { useState, useEffect } from "react";
import { PenTool, Newspaper, Sparkles, Calendar } from "lucide-react";
import DailyBrief from "@/components/departments/content/DailyBrief";
import ContentPipeline from "@/components/departments/content/ContentPipeline";
import ContentCalendar from "@/components/departments/content/ContentCalendar";
import KirstenBrain from "@/components/departments/content/KirstenBrain";
import {
  NEWS_ITEMS,
  RESEARCH_ITEMS,
  REDDIT_POSTS,
  CALENDAR_ENTRIES,
} from "@/lib/data/content-engine";
import type { NewsItem, ResearchItem, RedditPost, CalendarEntry } from "@/lib/data/content-engine";

const TABS = [
  { id: "brief", label: "Daily Brief", icon: Newspaper },
  { id: "pipeline", label: "Content Pipeline", icon: Sparkles },
  { id: "calendar", label: "Content Calendar", icon: Calendar },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface PipelineItem {
  sourceId: string;
  sourceTitle: string;
  sourceType: "news" | "research";
  transcript: string;
}

export default function ContentDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("brief");
  const [newsItems, setNewsItems] = useState<NewsItem[]>(NEWS_ITEMS);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(RESEARCH_ITEMS);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>(REDDIT_POSTS);
  const [calendarEntries] = useState<CalendarEntry[]>(CALENDAR_ENTRIES);
  const [pipelineQueue, setPipelineQueue] = useState<PipelineItem[]>([]);

  // POV Knowledge Base stats
  const [povStats, setPovStats] = useState({ total: 0, topicCount: 0, topics: [] as string[] });

  useEffect(() => {
    fetch("/api/pov")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) {
          setPovStats({
            total: data.stats.total,
            topicCount: data.stats.topicCount,
            topics: data.stats.topics,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleContentCreate = (sourceId: string, transcript: string) => {
    // Find the source item to get its title
    const newsItem = newsItems.find((n) => n.id === sourceId);
    const researchItem = researchItems.find((r) => r.id === sourceId);
    const sourceTitle = newsItem?.title || researchItem?.title || "Unknown Source";
    const sourceType = newsItem ? "news" : "research";

    // Update the source with transcript
    if (newsItem) {
      setNewsItems((prev) =>
        prev.map((n) => (n.id === sourceId ? { ...n, povTranscript: transcript } : n))
      );
    } else if (researchItem) {
      setResearchItems((prev) =>
        prev.map((r) => (r.id === sourceId ? { ...r, povTranscript: transcript } : r))
      );
    }

    // Add to pipeline
    setPipelineQueue((prev) => [
      ...prev,
      { sourceId, sourceTitle, sourceType: sourceType as "news" | "research", transcript },
    ]);

    // Fire-and-forget: save POV to knowledge base
    fetch("/api/pov", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: sourceTitle,
        transcript,
        sourceType: "voice",
        sourceId,
      }),
    }).catch(() => {});

    // Auto-switch to pipeline tab
    setActiveTab("pipeline");
  };

  const handleRedditAction = (id: string, action: "approved" | "skipped") => {
    setRedditPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
  };

  const povCount = newsItems.filter((n) => n.povTranscript).length +
    researchItems.filter((r) => r.povTranscript).length;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F1C02814" }}
          >
            <PenTool size={20} style={{ color: "#F1C028" }} strokeWidth={1.8} />
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
              Content Engine
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
              Daily Command Post — 10 Minutes to 100 Pieces
            </p>
          </div>
        </div>
      </header>

      {/* Kirsten Brain — POV Knowledge Base stats */}
      <KirstenBrain
        totalPOVs={povStats.total}
        topicCount={povStats.topicCount}
        topTopics={povStats.topics}
      />

      {/* Quick stats banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: "#F1C0280A",
          border: "1px solid #F1C02818",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <PenTool size={20} style={{ color: "#F1C028" }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {NEWS_ITEMS.length + RESEARCH_ITEMS.length + REDDIT_POSTS.length} items to review
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {povCount} POVs recorded &middot; {pipelineQueue.length * 5} pieces in pipeline
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: "#F1C028" }}>
            {pipelineQueue.length * 5}
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            / 100 daily target
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: "#F1C028" }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
              {tab.id === "pipeline" && pipelineQueue.length > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}
                >
                  {pipelineQueue.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "brief" && (
        <DailyBrief
          newsItems={newsItems}
          researchItems={researchItems}
          redditPosts={redditPosts}
          onContentCreate={handleContentCreate}
          onRedditAction={handleRedditAction}
        />
      )}
      {activeTab === "pipeline" && (
        <ContentPipeline queue={pipelineQueue} />
      )}
      {activeTab === "calendar" && <ContentCalendar entries={calendarEntries} />}
    </div>
  );
}
