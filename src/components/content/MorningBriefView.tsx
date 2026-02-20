"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface Story {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourcePlatform: string;
  relevanceScore: number;
  viralityScore: number;
  topics: string[];
  status: "pending" | "selected" | "dismissed";
}

// Demo stories for initial UI
const DEMO_STORIES: Story[] = [
  {
    id: "1",
    title: "New Study Links Gut Microbiome to Fertility Outcomes",
    summary:
      "Researchers at Stanford published findings showing a direct correlation between gut microbiome diversity and IVF success rates. The study of 2,400 women found that those with higher microbial diversity had 34% better outcomes.",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/?term=gut+microbiome+fertility+IVF",
    sourcePlatform: "PubMed",
    relevanceScore: 95,
    viralityScore: 78,
    topics: ["fertility", "women's health"],
    status: "pending",
  },
  {
    id: "2",
    title: "TikTok Creator's PCOS Journey Reaches 4M Views",
    summary:
      "A creator documenting her PCOS diagnosis and lifestyle changes has gone viral. Her approach of combining clinical data with personal storytelling mirrors Conceivable's brand voice perfectly.",
    sourceUrl: "https://www.tiktok.com/search?q=PCOS+journey",
    sourcePlatform: "TikTok",
    relevanceScore: 82,
    viralityScore: 95,
    topics: ["PCOS", "women's health"],
    status: "pending",
  },
  {
    id: "3",
    title: "FDA Updates Supplement Labeling Requirements for 2026",
    summary:
      "The FDA announced new labeling standards for dietary supplements effective Q3 2026, with specific emphasis on reproductive health claims. Conceivable's supplement line should be reviewed against these new guidelines.",
    sourceUrl: "https://www.fda.gov/food/dietary-supplements",
    sourcePlatform: "Google News",
    relevanceScore: 90,
    viralityScore: 45,
    topics: ["women's health"],
    status: "pending",
  },
  {
    id: "4",
    title: "AI-Powered Fertility Tracking Apps See 300% Growth",
    summary:
      "Market analysis shows AI-enabled fertility and health tracking apps have tripled their user base in the past year. Women 25-35 are the primary adopters, citing personalized insights as the key differentiator.",
    sourceUrl: "https://news.google.com/search?q=AI+fertility+tracking+apps",
    sourcePlatform: "Google News",
    relevanceScore: 88,
    viralityScore: 72,
    topics: ["AI", "AI in healthcare", "fertility"],
    status: "pending",
  },
  {
    id: "5",
    title: "Endometriosis Awareness Post Goes Viral on Instagram",
    summary:
      "An infographic-style carousel about endometriosis myths vs. facts has garnered 500K+ saves on Instagram. The format — bold claim debunking — is highly shareable and aligns with educational content strategy.",
    sourceUrl: "https://www.instagram.com/explore/tags/endometriosisawareness/",
    sourcePlatform: "Instagram",
    relevanceScore: 80,
    viralityScore: 91,
    topics: ["endometriosis", "women's health"],
    status: "pending",
  },
];

export default function MorningBriefView() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [generating, setGenerating] = useState(false);
  const [pov, setPov] = useState("");

  const updateStoryStatus = (id: string, status: "pending" | "selected" | "dismissed") => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSelect = (id: string) => {
    setPov("");
    setStories((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.id === id ? "selected" as const : (s.status === "selected" ? "pending" as const : s.status),
      }))
    );
  };

  const handleGenerateBrief = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/briefs/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.stories?.length) {
          setStories(data.stories);
        }
      }
    } catch {
      // Keep demo stories on error
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateContent = () => {
    if (!selectedStory) return;
    const params = new URLSearchParams({
      topic: selectedStory.title,
      context: selectedStory.summary,
      pov,
      sourceUrl: selectedStory.sourceUrl,
    });
    router.push(`/content?${params.toString()}`);
  };

  const selectedStory = stories.find((s) => s.status === "selected");
  const pendingStories = stories.filter((s) => s.status === "pending");
  const dismissedStories = stories.filter((s) => s.status === "dismissed");

  return (
    <div className="p-8 max-w-4xl">
      {/* Brief Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Newspaper size={20} style={{ color: "#F59E0B" }} />
          </div>
          <div>
            <p className="font-medium" style={{ color: "var(--foreground)" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {stories.length} stories curated &middot; {pendingStories.length} pending review
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateBrief}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {generating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {generating ? "Generating..." : "Generate Fresh Brief"}
        </button>
      </div>

      {/* Bulleted Summary */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Today&apos;s Brief Summary
        </h3>
        <ul className="space-y-3">
          {pendingStories.map((story) => (
            <li key={story.id} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 mt-0.5" style={{ color: "var(--brand-primary)" }}>
                &bull;
              </span>
              <div className="flex-1 flex items-start justify-between gap-3">
                <div>
                  <span className="font-medium" style={{ color: "var(--foreground)" }}>
                    {story.title}
                  </span>
                  <span style={{ color: "var(--muted)" }}> — {story.summary}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#EDE9FE", color: "#7C3AED" }}
                    >
                      {story.sourcePlatform}
                    </span>
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs hover:underline"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Source <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => handleSelect(story.id)}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md text-white"
                    style={{ backgroundColor: "var(--status-success)" }}
                  >
                    <CheckCircle size={12} /> Select
                  </button>
                  <button
                    onClick={() => updateStoryStatus(story.id, "dismissed")}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border hover:bg-gray-50"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    <XCircle size={12} /> Dismiss
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {pendingStories.length === 0 && !selectedStory && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No pending stories. Click &quot;Generate Fresh Brief&quot; to fetch new stories.
          </p>
        )}

        {/* Dismissed stories (collapsed) */}
        {dismissedStories.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
              Dismissed ({dismissedStories.length})
            </p>
            {dismissedStories.map((story) => (
              <div key={story.id} className="flex items-center justify-between py-1">
                <span className="text-xs line-through" style={{ color: "var(--muted)" }}>
                  {story.title}
                </span>
                <button
                  onClick={() => updateStoryStatus(story.id, "pending")}
                  className="text-xs px-2 py-0.5 rounded hover:bg-gray-100"
                  style={{ color: "var(--muted)" }}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Story — Content Creation */}
      {selectedStory && (
        <div
          className="rounded-xl p-5 mb-6 border-2"
          style={{ borderColor: "var(--status-success)", backgroundColor: "#F0FDF4" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: "var(--status-success)" }} />
              <span className="text-xs font-semibold uppercase" style={{ color: "var(--status-success)" }}>
                Selected for Content Creation
              </span>
            </div>
            <button
              onClick={() => {
                updateStoryStatus(selectedStory.id, "pending");
                setPov("");
              }}
              className="text-xs px-2 py-1 rounded hover:bg-green-100"
              style={{ color: "var(--muted)" }}
            >
              <XCircle size={14} className="inline mr-1" />
              Deselect
            </button>
          </div>
          <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            {selectedStory.title}
          </h3>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            {selectedStory.summary}
          </p>
          <a
            href={selectedStory.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline mb-4"
            style={{ color: "var(--brand-primary)" }}
          >
            <ExternalLink size={12} /> View original article/video
          </a>

          {/* POV Input */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              <MessageSquare size={14} />
              Your POV / Angle
            </label>
            <textarea
              value={pov}
              onChange={(e) => setPov(e.target.value)}
              placeholder="What's your take on this? What angle should the content take? Any key points to hit?"
              className="w-full rounded-lg border p-3 text-sm resize-none focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "white",
                color: "var(--foreground)",
                minHeight: "80px",
              }}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCreateContent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Create Content <ArrowRight size={14} />
            </button>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {pov.trim() ? "Your POV will be included" : "Add your POV above (optional)"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
