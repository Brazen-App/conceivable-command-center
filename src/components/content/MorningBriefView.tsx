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

// Initial stories shown before the user clicks "Generate Fresh Brief"
const DEMO_STORIES: Story[] = [
  {
    id: "init-1",
    title: "Welcome to Your Morning Brief",
    summary:
      "This is your daily content intelligence hub. Click \"Generate Fresh Brief\" above to fetch today's curated stories across PubMed, TikTok, Instagram, X, and Google News — ranked by relevance and virality for Conceivable's audience.",
    sourceUrl: "#",
    sourcePlatform: "System",
    relevanceScore: 100,
    viralityScore: 0,
    topics: [],
    status: "pending",
  },
  {
    id: "init-2",
    title: "How the Brief Works",
    summary:
      "Each morning, the Content Engine agent scans monitored sources for stories relevant to women's health, fertility, PCOS, endometriosis, and AI in healthcare. Stories are scored for relevance (alignment with Conceivable's mission) and virality (engagement potential). Select a story to create multi-platform content from it.",
    sourceUrl: "#",
    sourcePlatform: "System",
    relevanceScore: 100,
    viralityScore: 0,
    topics: [],
    status: "pending",
  },
];

export default function MorningBriefView() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setError(null);
    setSuccess(null);
    try {
      console.log("[MorningBrief] Generating fresh brief...");
      const res = await fetch("/api/briefs/generate", { method: "POST" });
      const data = await res.json();
      console.log("[MorningBrief] Response:", { ok: res.ok, storiesCount: data.stories?.length, error: data.error });

      if (res.ok && data.stories?.length) {
        setStories(
          data.stories.map((s: Story) => ({ ...s, status: s.status ?? "pending" }))
        );
        setSuccess(`Fresh brief loaded — ${data.stories.length} stories curated.`);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(
          data.error || "Failed to generate brief. Check that ANTHROPIC_API_KEY is set."
        );
      }
    } catch (err) {
      console.error("[MorningBrief] Fetch error:", err);
      setError("Network error — could not reach the server.");
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

      {/* Success Banner */}
      {success && (
        <div
          className="rounded-xl border p-4 mb-4 flex items-start gap-3"
          style={{ borderColor: "#86EFAC", backgroundColor: "#F0FDF4" }}
        >
          <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-green-700">{success}</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          className="rounded-xl border p-4 mb-4 flex items-start gap-3"
          style={{ borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" }}
        >
          <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">{error}</p>
            <p className="text-xs text-red-500 mt-1">
              The demo stories are still shown below. Set your ANTHROPIC_API_KEY to generate live briefs.
            </p>
          </div>
        </div>
      )}

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
