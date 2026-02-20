"use client";

import { useState } from "react";
import {
  TrendingUp,
  ExternalLink,
  Loader2,
  Search,
  Zap,
  MessageSquare,
  Heart,
  Eye,
  Share2,
} from "lucide-react";

interface Insight {
  id: string;
  sourceUrl: string;
  platform: string;
  hook: string;
  format: string;
  emotionalTriggers: string[];
  rewrittenContent: string;
  analyzedAt: string;
}

// Demo insights
const DEMO_INSIGHTS: Insight[] = [
  {
    id: "1",
    sourceUrl: "#",
    platform: "TikTok",
    hook: "Nobody tells you this about fertility after 30...",
    format: "personal-story",
    emotionalTriggers: ["fear", "empowerment", "validation"],
    rewrittenContent:
      "Here's what I wish someone had told me about fertility after 30.\n\nThe narrative around age and fertility is often driven by fear — but the science tells a more nuanced story.\n\nYes, egg quality changes. But what most people don't talk about is what you can actually DO about it.\n\nAt Conceivable, we're building tools that give women real, science-backed data about their fertility — not fear-based marketing.\n\nBecause knowledge isn't just power. It's peace of mind.",
    analyzedAt: new Date().toISOString(),
  },
  {
    id: "2",
    sourceUrl: "#",
    platform: "Instagram",
    hook: "3 supplements your OBGYN won't mention (but should)",
    format: "listicle-carousel",
    emotionalTriggers: ["curiosity", "insider-knowledge", "frustration-with-healthcare"],
    rewrittenContent:
      "Slide 1: 3 Evidence-Backed Supplements Most OBGYNs Don't Discuss\n\nSlide 2: CoQ10 — Studies show it can support egg quality by improving mitochondrial function.\n\nSlide 3: Vitamin D — Over 40% of women of reproductive age are deficient. Research links optimal levels to better fertility outcomes.\n\nSlide 4: Omega-3 DHA — Not just for pregnancy. New research suggests it supports ovarian reserve and hormone balance.\n\nSlide 5: The gap between research and clinical practice is real. At Conceivable, we're closing it.\n\nSlide 6: Follow for more science-backed women's health insights.",
    analyzedAt: new Date().toISOString(),
  },
];

export default function ViralInsightsView() {
  const [insights, setInsights] = useState<Insight[]>(DEMO_INSIGHTS);
  const [analyzing, setAnalyzing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [platformInput, setPlatformInput] = useState("tiktok");
  const [contentInput, setContentInput] = useState("");

  const handleAnalyze = async () => {
    if (!contentInput.trim()) return;
    setAnalyzing(true);

    try {
      const res = await fetch("/api/content/analyze-viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput,
          platform: platformInput,
          content: contentInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInsights((prev) => [data, ...prev]);
      }
    } catch {
      // Keep existing insights
    } finally {
      setAnalyzing(false);
      setUrlInput("");
      setContentInput("");
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Analyze New Content */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="font-medium mb-4 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Search size={18} style={{ color: "var(--brand-secondary)" }} />
          Analyze Viral Content
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Source URL (optional)
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Platform
            </label>
            <select
              value={platformInput}
              onChange={(e) => setPlatformInput(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="x-twitter">X (Twitter)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
            Content Text
          </label>
          <textarea
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Paste the viral content here for analysis..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !contentInput.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--brand-secondary)" }}
        >
          {analyzing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap size={16} />
              Analyze Content
            </>
          )}
        </button>
      </div>

      {/* Insights Grid */}
      <div className="space-y-6">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl border p-6"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={18} style={{ color: "var(--brand-secondary)" }} />
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#FCE7F3", color: "#EC4899" }}
                >
                  {insight.platform}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {insight.format}
                </span>
              </div>
              {insight.sourceUrl && insight.sourceUrl !== "#" && (
                <a
                  href={insight.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs hover:underline"
                  style={{ color: "var(--muted)" }}
                >
                  <ExternalLink size={12} /> Source
                </a>
              )}
            </div>

            {/* Hook */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                Hook
              </p>
              <p className="font-medium italic" style={{ color: "var(--foreground)" }}>
                &ldquo;{insight.hook}&rdquo;
              </p>
            </div>

            {/* Emotional Triggers */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                Emotional Triggers
              </p>
              <div className="flex flex-wrap gap-2">
                {insight.emotionalTriggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
                  >
                    <Heart size={10} />
                    {trigger}
                  </span>
                ))}
              </div>
            </div>

            {/* Rewritten Content */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "var(--background)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                Rewritten for Conceivable
              </p>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: "var(--foreground)" }}>
                {insight.rewrittenContent}
              </p>
            </div>

            {/* Placeholder Engagement Metrics */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                <Heart size={12} /> —
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                <MessageSquare size={12} /> —
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                <Share2 size={12} /> —
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                <Eye size={12} /> —
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
