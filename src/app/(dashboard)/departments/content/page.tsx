"use client";

import { useState, useEffect, useCallback } from "react";
import { PenTool, Newspaper, Sparkles, Calendar, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import DailyBrief from "@/components/departments/content/DailyBrief";
import ContentPipeline from "@/components/departments/content/ContentPipeline";
import ContentCalendar from "@/components/departments/content/ContentCalendar";
import KirstenBrain from "@/components/departments/content/KirstenBrain";
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
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [pipelineQueue, setPipelineQueue] = useState<PipelineItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | undefined>();
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [povStats, setPovStats] = useState({ total: 0, topicCount: 0, topics: [] as string[] });

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoadError(null);
    try {
      const [contentResult, povResult] = await Promise.allSettled([
        fetch("/api/content-engine").then((r) => {
          if (!r.ok) throw new Error(`Content API ${r.status}`);
          return r.json();
        }),
        fetch("/api/pov").then((r) => {
          if (!r.ok) throw new Error(`POV API ${r.status}`);
          return r.json();
        }),
      ]);
      if (contentResult.status === "fulfilled") {
        const d = contentResult.value;
        setNewsItems(d.newsItems ?? []);
        setResearchItems(d.researchItems ?? []);
        setRedditPosts(d.redditPosts ?? []);
        setCalendarEntries(d.calendarEntries ?? []);
      }
      if (povResult.status === "fulfilled" && povResult.value.stats) {
        const s = povResult.value.stats;
        setPovStats({ total: s.total, topicCount: s.topicCount, topics: s.topics });
      }
      if (contentResult.status === "rejected" && povResult.status === "rejected") {
        setLoadError("Failed to load content data");
      }
    } catch {
      setLoadError("Failed to load content data");
    } finally {
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => { fetchData(true); }, [fetchData]);
  useEffect(() => {
    const id = setInterval(() => fetchData(false), 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch("/api/briefs/refresh", { method: "POST" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `Server error (${res.status})` }));
        setRefreshError(errData.error || `Refresh failed (${res.status})`);
        return;
      }
      const data = await res.json();
      if (data.ok || data.saved) {
        setLastRefreshed(data.refreshedAt || new Date().toISOString());
        await fetchData(false);
      } else {
        setRefreshError(data.error || "Refresh returned no data");
      }
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : "Network error — check connection and try again");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContentCreate = (sourceId: string, transcript: string) => {
    const newsItem = newsItems.find((n) => n.id === sourceId);
    const researchItem = researchItems.find((r) => r.id === sourceId);
    const sourceTitle = newsItem?.title || researchItem?.title || "Unknown Source";
    const sourceType = newsItem ? "news" : "research";
    if (newsItem) {
      setNewsItems((prev) => prev.map((n) => (n.id === sourceId ? { ...n, povTranscript: transcript } : n)));
    } else if (researchItem) {
      setResearchItems((prev) => prev.map((r) => (r.id === sourceId ? { ...r, povTranscript: transcript } : r)));
    }
    setPipelineQueue((prev) => [...prev, { sourceId, sourceTitle, sourceType: sourceType as "news" | "research", transcript }]);
    fetch("/api/pov", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: sourceTitle, transcript, sourceType: "voice", sourceId }) }).catch(() => {});
    setActiveTab("pipeline");
  };

  const handleRedditAction = (id: string, action: "approved" | "skipped") => {
    setRedditPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: action } : p)));
  };

  const povCount = newsItems.filter((n) => n.povTranscript).length + researchItems.filter((r) => r.povTranscript).length;
  const totalItems = newsItems.length + researchItems.length + redditPosts.length;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header with refresh button */}
      <header className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F1C02814" }}>
            <PenTool size={20} style={{ color: "#F1C028" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em", color: "var(--foreground)" }}>
              Content Engine
            </h1>
            <p className="mt-0.5" style={{ fontFamily: "var(--font-caption)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
              Daily Command Post — 10 Minutes to 100 Pieces
              {lastRefreshed && <span> &middot; Last refreshed {new Date(lastRefreshed).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>}
            </p>
          </div>
          {isRefreshing ? (
            <span
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 opacity-60"
              style={{ backgroundColor: "#F1C028", color: "#000" }}
            >
              <RefreshCw size={14} className="animate-spin" />
              Fetching...
            </span>
          ) : (
            <a
              href="/api/briefs/refresh?redirect=1"
              onClick={(e) => {
                e.preventDefault();
                handleRefresh();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 no-underline"
              style={{ backgroundColor: "#F1C028", color: "#000" }}
            >
              <RefreshCw size={14} />
              Refresh Content
            </a>
          )}
        </div>
        {isRefreshing && (
          <div className="mt-3 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2" style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02818", color: "var(--muted)" }}>
            <Loader2 size={12} className="animate-spin" style={{ color: "#F1C028" }} />
            Fetching real articles from Google News, PubMed, and Reddit — this takes about a minute...
          </div>
        )}
        {refreshError && (
          <div className="mt-3 px-4 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#E24D4710", color: "#E24D47", border: "1px solid #E24D4720" }}>
            {refreshError}
          </div>
        )}
      </header>

      {loadError && (
        <div className="rounded-2xl border p-4 mb-6 flex items-center gap-3" style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4708" }}>
          <AlertTriangle size={16} style={{ color: "#E24D47" }} />
          <p className="text-xs flex-1" style={{ color: "#E24D47" }}>{loadError}</p>
          <button onClick={() => fetchData(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white shrink-0" style={{ backgroundColor: "#5A6FFF" }}>Retry</button>
        </div>
      )}

      {!dataLoaded && !loadError && (
        <div className="flex items-center gap-2 mb-6 p-4 rounded-2xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Loader2 size={16} className="animate-spin" style={{ color: "#F1C028" }} />
          <p className="text-xs" style={{ color: "var(--muted)" }}>Loading content data...</p>
        </div>
      )}

      <KirstenBrain totalPOVs={povStats.total} topicCount={povStats.topicCount} topTopics={povStats.topics} />

      <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap" style={{ backgroundColor: "#F1C0280A", border: "1px solid #F1C02818" }}>
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <PenTool size={20} style={{ color: "#F1C028" }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{totalItems} items to review</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{povCount} POVs recorded &middot; {pipelineQueue.length * 5} pieces in pipeline</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: "#F1C028" }}>{pipelineQueue.length * 5}</span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>/ 100 daily target</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={active ? { backgroundColor: "var(--surface)", color: "#F1C028" } : { color: "var(--muted)" }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
              {tab.id === "pipeline" && pipelineQueue.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}>{pipelineQueue.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "brief" && (
        <DailyBrief
          newsItems={newsItems}
          researchItems={researchItems}
          redditPosts={redditPosts}
          onContentCreate={handleContentCreate}
          onRedditAction={handleRedditAction}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastRefreshed={lastRefreshed}
          refreshError={refreshError}
        />
      )}
      {activeTab === "pipeline" && <ContentPipeline queue={pipelineQueue} />}
      {activeTab === "calendar" && <ContentCalendar entries={calendarEntries} />}
    </div>
  );
}
