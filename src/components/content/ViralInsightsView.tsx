"use client";

import { useState } from "react";
import {
  TrendingUp,
  ExternalLink,
  Loader2,
  Zap,
  Heart,
  Eye,
  Share2,
  MessageSquare,
  RefreshCw,
  PenTool,
  Copy,
  CheckCircle,
} from "lucide-react";

interface ViralPost {
  id: string;
  title: string;
  platform: string;
  sourceUrl: string;
  content: string;
  hook: string;
  whyViral: string;
  emotionalTriggers: string[];
  format: string;
  metrics: {
    views: string;
    likes: string;
    comments: string;
    shares: string;
  };
}

interface GeneratedScript {
  postId: string;
  script: string;
}

const DEMO_VIRAL_POSTS: ViralPost[] = [
  {
    id: "v1",
    title: "Nobody tells you this about fertility after 30...",
    platform: "TikTok",
    sourceUrl: "#",
    content:
      "Nobody tells you this about fertility after 30. I spent years thinking I had all the time in the world. Then one blood test changed everything. My AMH was low. My doctor said 'you should have started sooner.' But here's what they DON'T tell you — there's so much you can actually do. Diet changes. Supplements. Stress management. I'm proof it works.",
    hook: "Nobody tells you this about fertility after 30...",
    whyViral:
      "Opens with a fear-based hook that targets a massive anxiety point for women 25-35. The 'nobody tells you' framing creates an insider-knowledge dynamic. Then pivots from fear to empowerment — the emotional rollercoaster keeps viewers watching. The personal story format builds trust and the 'I'm proof it works' ending gives hope. Perfect algorithm bait: high save rate + comments sharing similar stories.",
    emotionalTriggers: ["fear", "empowerment", "validation", "hope"],
    format: "personal-story",
    metrics: { views: "4.2M", likes: "380K", comments: "12K", shares: "45K" },
  },
  {
    id: "v2",
    title: "3 supplements your OBGYN won't mention (but should)",
    platform: "Instagram",
    sourceUrl: "#",
    content:
      "3 supplements your OBGYN won't mention (but should) 👇\n\n1. CoQ10 — improves egg quality by supporting mitochondrial function\n2. Vitamin D — 40% of reproductive-age women are deficient\n3. Omega-3 DHA — supports ovarian reserve and hormone balance\n\nThe gap between research and your doctor's office is YEARS. Save this for later.",
    hook: "3 supplements your OBGYN won't mention (but should)",
    whyViral:
      "The 'your doctor won't tell you' angle triggers frustration with the healthcare system — a massive emotional driver. Numbered list format is highly saveable (Instagram's #1 engagement signal). Each point is specific enough to feel credible but short enough to consume in seconds. The 'save this' CTA at the end drives algorithmic boost. Carousel format means multiple slides = more time on post = more reach.",
    emotionalTriggers: [
      "curiosity",
      "insider-knowledge",
      "frustration-with-healthcare",
      "urgency",
    ],
    format: "listicle-carousel",
    metrics: { views: "1.8M", likes: "210K", comments: "8.5K", shares: "92K" },
  },
  {
    id: "v3",
    title: "I asked AI to analyze my fertility data. What it found shocked me.",
    platform: "X (Twitter)",
    sourceUrl: "#",
    content:
      "I asked AI to analyze my fertility data. What it found shocked me.\n\nThread 🧵\n\nI uploaded 6 months of cycle data, bloodwork, and lifestyle logs into an AI tool.\n\nIt found a pattern my doctor missed: my progesterone was dropping every cycle, correlating with sleep disruption.\n\nOne change — consistent sleep schedule — and my levels stabilized in 2 months.\n\nAI in healthcare isn't the future. It's NOW.",
    hook: "I asked AI to analyze my fertility data. What it found shocked me.",
    whyViral:
      "Combines two trending topics: AI + fertility. The 'shocked me' hook is classic curiosity gap — impossible not to click. Thread format drives engagement (replies, quote tweets). The 'my doctor missed it' narrative validates frustration with traditional healthcare. The solution is surprisingly simple (sleep), making it feel actionable and shareable. Ends with a bold statement that invites debate = more replies = more reach.",
    emotionalTriggers: ["curiosity", "surprise", "empowerment", "tech-optimism"],
    format: "thread",
    metrics: { views: "2.1M", likes: "45K", comments: "3.2K", shares: "18K" },
  },
];

export default function ViralInsightsView() {
  const [posts, setPosts] = useState<ViralPost[]>(DEMO_VIRAL_POSTS);
  const [generating, setGenerating] = useState(false);
  const [generatingScript, setGeneratingScript] = useState<string | null>(null);
  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/content/analyze-viral/daily", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.posts?.length) {
          setPosts(data.posts);
          setScripts([]);
        }
      }
    } catch {
      // Keep demo posts on error
    } finally {
      setGenerating(false);
    }
  };

  const handleWriteScript = async (post: ViralPost) => {
    setGeneratingScript(post.id);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: post.title,
          founderAngle: `Rewrite this viral ${post.platform} content in Conceivable's voice. Keep the structure and emotional triggers that made it go viral (${post.emotionalTriggers.join(", ")}), but make it better — more science-backed, more empowering, and aligned with our brand. Original format: ${post.format}. Original content: ${post.content}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const scriptText =
          data.pieces?.length > 0
            ? data.pieces
                .map(
                  (p: { platform: string; body: string }) =>
                    `[${p.platform.toUpperCase()}]\n${p.body}`
                )
                .join("\n\n---\n\n")
            : "Script generation completed — check Content Studio for results.";
        setScripts((prev) => [
          ...prev.filter((s) => s.postId !== post.id),
          { postId: post.id, script: scriptText },
        ]);
      }
    } catch {
      // Keep existing state
    } finally {
      setGeneratingScript(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#FCE7F3" }}
          >
            <TrendingUp size={20} style={{ color: "#EC4899" }} />
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
              Top {posts.length} viral posts today &middot; Analyzed for content
              opportunities
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "#EC4899" }}
        >
          {generating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {generating ? "Finding viral posts..." : "Refresh Viral Feed"}
        </button>
      </div>

      {/* Viral Posts */}
      <div className="space-y-6">
        {posts.map((post, index) => {
          const script = scripts.find((s) => s.postId === post.id);

          return (
            <div
              key={post.id}
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Post Header */}
              <div
                className="px-5 py-3 flex items-center justify-between border-b"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--background)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color: "var(--muted)" }}>
                    #{index + 1}
                  </span>
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "#FCE7F3", color: "#EC4899" }}
                  >
                    {post.platform}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--border-light)",
                      color: "var(--muted)",
                    }}
                  >
                    {post.format}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <Eye size={12} /> {post.metrics.views}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <Heart size={12} /> {post.metrics.likes}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <MessageSquare size={12} /> {post.metrics.comments}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    <Share2 size={12} /> {post.metrics.shares}
                  </span>
                  {post.sourceUrl && post.sourceUrl !== "#" && (
                    <a
                      href={post.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <ExternalLink size={12} /> View original
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                {/* Hook */}
                <h3
                  className="font-semibold text-base mb-3"
                  style={{ color: "var(--foreground)" }}
                >
                  &ldquo;{post.hook}&rdquo;
                </h3>

                {/* Original Content Preview */}
                <div
                  className="rounded-lg p-4 mb-4 text-sm whitespace-pre-wrap leading-relaxed"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                >
                  {post.content}
                </div>

                {/* Why It Went Viral */}
                <div className="mb-4">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                    style={{ color: "#EC4899" }}
                  >
                    <Zap size={12} /> Why it went viral
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {post.whyViral}
                  </p>
                </div>

                {/* Emotional Triggers */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.emotionalTriggers.map((trigger) => (
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

                {/* Write My Version Button / Generated Script */}
                {script ? (
                  <div
                    className="rounded-lg border-2 p-4"
                    style={{
                      borderColor: "var(--brand-primary)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        <PenTool size={12} /> Your version — written for
                        Conceivable
                      </p>
                      <button
                        onClick={() => handleCopy(script.script, post.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100"
                        style={{ color: "var(--muted)" }}
                      >
                        {copiedId === post.id ? (
                          <>
                            <CheckCircle size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p
                      className="text-sm whitespace-pre-wrap leading-relaxed"
                      style={{ color: "var(--foreground)" }}
                    >
                      {script.script}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleWriteScript(post)}
                    disabled={generatingScript === post.id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    {generatingScript === post.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Writing your version...
                      </>
                    ) : (
                      <>
                        <PenTool size={16} />
                        Write My Version
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
