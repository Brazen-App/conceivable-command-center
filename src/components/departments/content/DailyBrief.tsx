"use client";

import { useState, useRef } from "react";
import {
  Newspaper,
  FlaskConical,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Sparkles,
  FileText,
  Zap,
  Shield,
  Mic,
  Square,
  Loader2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import type { NewsItem, ResearchItem, RedditPost } from "@/lib/data/content-engine";

interface Props {
  newsItems: NewsItem[];
  researchItems: ResearchItem[];
  redditPosts: RedditPost[];
  onContentCreate: (sourceId: string, transcript: string) => void;
  onRedditAction: (id: string, action: "approved" | "skipped") => void;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
  lastRefreshed?: string;
}

const TAG_CONFIG: Record<string, { label: string; color: string }> = {
  competitor: { label: "Competitor", color: "#E24D47" },
  science: { label: "Science", color: "#5A6FFF" },
  industry: { label: "Industry", color: "#356FB6" },
  viral: { label: "Viral", color: "#E37FB1" },
  regulatory: { label: "Regulatory", color: "#9686B9" },
};

const RISK_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low Risk", color: "#1EAA55" },
  medium: { label: "Medium Risk", color: "#F1C028" },
  high: { label: "High Risk", color: "#E24D47" },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function getTwoSentences(text: string): string {
  const clean = text.replace(/\n+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    return sentences.slice(0, 2).join("").trim();
  }
  return clean.slice(0, 180) + (clean.length > 180 ? "..." : "");
}

// ────────────────────────────────────────────
// POV Field — mic + text input + Create Drafts
// ────────────────────────────────────────────

function POVField({
  onCreateDrafts,
  defaultAngle,
}: {
  onCreateDrafts: (pov: string) => void;
  defaultAngle: string;
}) {
  const [pov, setPov] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setTranscribing(true);
        // Mock transcription — replace with Whisper API when ready
        setTimeout(() => {
          setPov(
            (prev) =>
              prev +
              (prev ? "\n" : "") +
              "This is really interesting because it validates exactly what we've been building. The key insight here is that most people are looking at this the wrong way — they're treating individual signals in isolation when the real value is in the connections between them."
          );
          setTranscribing(false);
        }, 1500);
      };

      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access required for voice recording.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleCreate = () => {
    const angle = pov.trim() || defaultAngle;
    onCreateDrafts(angle);
  };

  return (
    <div
      className="rounded-xl p-4 mt-4"
      style={{
        backgroundColor: "#F1C02808",
        border: "1px solid #F1C02825",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} style={{ color: "#F1C028" }} />
        <p
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: "#F1C028" }}
        >
          Your POV
        </p>
      </div>

      {/* Text area + mic */}
      <div className="relative">
        <textarea
          value={pov}
          onChange={(e) => setPov(e.target.value)}
          placeholder="Type your take, or hit the mic to record..."
          className="w-full text-xs leading-relaxed rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-1 min-h-[80px]"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />

        {/* Mic button */}
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={transcribing}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: recording
              ? "#E24D47"
              : transcribing
              ? "var(--background)"
              : "#F1C02818",
          }}
          title={recording ? "Stop recording" : "Record your POV"}
        >
          {transcribing ? (
            <Loader2
              size={14}
              className="animate-spin"
              style={{ color: "var(--muted)" }}
            />
          ) : recording ? (
            <Square size={12} className="text-white" />
          ) : (
            <Mic size={14} style={{ color: "#F1C028" }} />
          )}
        </button>
      </div>

      {recording && (
        <p
          className="text-[10px] mt-1.5 flex items-center gap-1.5"
          style={{ color: "#E24D47" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Recording... tap mic to stop
        </p>
      )}

      {/* Create Drafts button */}
      <button
        onClick={handleCreate}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.02] mt-3 text-white"
        style={{ backgroundColor: "#F1C028" }}
      >
        <Sparkles size={14} /> Create Drafts
      </button>

      {!pov.trim() && (
        <p className="text-[10px] mt-1.5" style={{ color: "var(--muted)" }}>
          No POV yet — will use the suggested coverage angle
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// NEWS ITEM CARD
// ────────────────────────────────────────────

function NewsCard({
  item,
  onContentCreate,
}: {
  item: NewsItem;
  onContentCreate: (sourceId: string, transcript: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tag = TAG_CONFIG[item.tag];
  const twoSentences = getTwoSentences(item.brief);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: expanded ? "#F1C02830" : "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Collapsed: title + 2-sentence summary */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${tag.color}14`, color: tag.color }}
          >
            {tag.label}
          </span>
          {item.isViral && (
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
              style={{ backgroundColor: "#E37FB114", color: "#E37FB1" }}
            >
              <TrendingUp size={9} /> Viral
            </span>
          )}
          <span
            className="text-[10px]"
            style={{ color: "var(--muted-light)" }}
          >
            {item.source} &middot; {timeAgo(item.timestamp)}
          </span>
        </div>

        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {item.title}
        </p>

        <p
          className="text-xs mt-1.5 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {twoSentences}
        </p>

        {/* Source link + expand */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {item.sourceUrl && item.sourceUrl !== "#" && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#1EAA5510",
                color: "#1EAA55",
                border: "1px solid #1EAA5520",
              }}
            >
              <ExternalLink size={12} /> View Source
              <CheckCircle2 size={10} />
            </a>
          )}
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: "var(--background)",
                color: "#5A6FFF",
                border: "1px solid var(--border)",
              }}
            >
              <FileText size={12} /> Analysis & POV
            </button>
          )}
        </div>
      </div>

      {/* Expanded: full article + agent rec + POV field */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Full article */}
          <div
            className="rounded-lg p-4 mt-3 text-xs leading-relaxed whitespace-pre-line"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            {item.fullArticle}
          </div>

          {/* Agent recommendation */}
          <div
            className="rounded-lg p-3 mt-3"
            style={{
              backgroundColor: "#F1C02808",
              borderLeft: "3px solid #F1C028",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "#F1C028" }}
            >
              Agent Recommendation
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {item.agentRecommendation}
            </p>
          </div>

          {/* Coverage angle */}
          <div
            className="rounded-lg p-3 mt-3"
            style={{
              backgroundColor: "#5A6FFF08",
              borderLeft: "3px solid #5A6FFF",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "#5A6FFF" }}
            >
              Suggested Coverage Angle
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {item.coverageAngle}
            </p>
          </div>

          {/* POV Field with mic + Create Drafts */}
          <POVField
            defaultAngle={item.coverageAngle || item.agentRecommendation}
            onCreateDrafts={(pov) => onContentCreate(item.id, pov)}
          />

          {/* Collapse button */}
          <button
            onClick={() => setExpanded(false)}
            className="mt-3 text-[10px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// RESEARCH ITEM CARD
// ────────────────────────────────────────────

function ResearchCard({
  item,
  onContentCreate,
}: {
  item: ResearchItem;
  onContentCreate: (sourceId: string, transcript: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const twoSentences = getTwoSentences(item.brief);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: expanded ? "#F1C02830" : "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* Collapsed */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
          >
            {item.journal}
          </span>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
          >
            Relevance: {item.relevanceScore}%
          </span>
          {item.fillsGap && (
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
              style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}
            >
              <Zap size={9} /> Fills Gap
            </span>
          )}
        </div>

        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {item.title}
        </p>
        <p
          className="text-[11px] mt-0.5"
          style={{ color: "var(--muted-light)" }}
        >
          {item.authors}
        </p>

        <p
          className="text-xs mt-1.5 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {twoSentences}
        </p>

        {/* Source links */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {item.doi && (
            <a
              href={item.doi.startsWith("http") ? item.doi : `https://doi.org/${item.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#1EAA5510",
                color: "#1EAA55",
                border: "1px solid #1EAA5520",
              }}
            >
              <ExternalLink size={12} /> DOI
              <CheckCircle2 size={10} />
            </a>
          )}
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: "var(--background)",
                color: "#5A6FFF",
                border: "1px solid var(--border)",
              }}
            >
              <FileText size={12} /> Full Abstract & Analysis
            </button>
          )}
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Structured summary */}
          <div
            className="rounded-lg overflow-hidden mt-3"
            style={{ backgroundColor: "var(--background)" }}
          >
            {(
              [
                ["Study Design", item.summary.design],
                ["Key Findings", item.summary.keyFindings],
                ["Sample Size", item.summary.sampleSize],
                ["Limitations", item.summary.limitations],
                ["Conceivable Relevance", item.summary.conceivableRelevance],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="px-3 py-2 border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--foreground)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Full abstract */}
          <div
            className="rounded-lg p-4 mt-3 text-xs leading-relaxed whitespace-pre-line"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            {item.fullAbstract}
          </div>

          {item.fillsGap && item.gapDescription && (
            <div
              className="rounded-lg p-3 mt-3"
              style={{
                backgroundColor: "#F1C02808",
                borderLeft: "3px solid #F1C028",
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: "#F1C028" }}
              >
                Knowledge Gap Filled
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                {item.gapDescription}
              </p>
            </div>
          )}

          {/* POV Field with mic + Create Drafts */}
          <POVField
            defaultAngle={item.summary.conceivableRelevance}
            onCreateDrafts={(pov) => onContentCreate(item.id, pov)}
          />

          <button
            onClick={() => setExpanded(false)}
            className="mt-3 text-[10px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// REDDIT POST CARD
// ────────────────────────────────────────────

function RedditCard({
  post,
  onAction,
}: {
  post: RedditPost;
  onAction: (id: string, action: "approved" | "skipped") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const risk = RISK_CONFIG[post.riskLevel];

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: expanded ? "#F1C02830" : "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
          >
            {post.subreddit}
          </span>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: `${risk.color}14`, color: risk.color }}
          >
            {risk.label}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--muted-light)" }}
          >
            {post.upvotes.toLocaleString()} upvotes &middot; {post.comments}{" "}
            comments
          </span>
          <div className="ml-auto flex items-center gap-1">
            <span
              className="text-lg font-bold"
              style={{ color: "#F1C028" }}
            >
              {post.engagementPotential}
            </span>
            <span
              className="text-[8px] uppercase tracking-wider"
              style={{ color: "var(--muted-light)" }}
            >
              Potential
            </span>
          </div>
        </div>

        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {post.title}
        </p>

        <p
          className="text-xs mt-1.5 leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {getTwoSentences(post.body)}
        </p>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "#E24D4710",
                color: "#E24D47",
                border: "1px solid #E24D4720",
              }}
            >
              <ExternalLink size={12} /> View on Reddit
              <CheckCircle2 size={10} />
            </a>
          )}
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: "var(--background)",
                color: "#5A6FFF",
                border: "1px solid var(--border)",
              }}
            >
              <FileText size={12} /> Draft Response
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Full post body */}
          <div
            className="rounded-lg p-3 mt-3 text-xs leading-relaxed"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--muted)" }}
            >
              Original Post
            </p>
            {post.body}
          </div>

          {/* Draft response */}
          <div
            className="rounded-lg p-3 mt-3"
            style={{
              backgroundColor: "#F1C02808",
              borderLeft: "3px solid #F1C028",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "#F1C028" }}
            >
              Draft Response (AI-Generated)
            </p>
            <div
              className="text-xs leading-relaxed whitespace-pre-line"
              style={{ color: "var(--foreground)" }}
            >
              {post.draftResponse}
            </div>
          </div>

          {/* Actions */}
          {post.status === "pending" && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onAction(post.id, "approved")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: "#1EAA55" }}
              >
                <Shield size={12} /> Approve & Post
              </button>
              <button
                onClick={() => onAction(post.id, "skipped")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                style={{
                  color: "var(--muted)",
                  backgroundColor: "var(--background)",
                }}
              >
                Skip
              </button>
            </div>
          )}
          {post.status !== "pending" && (
            <p
              className="text-xs font-medium mt-3 capitalize"
              style={{
                color:
                  post.status === "approved" || post.status === "posted"
                    ? "#1EAA55"
                    : "var(--muted)",
              }}
            >
              Status: {post.status}
            </p>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-3 text-[10px] font-medium"
            style={{ color: "var(--muted)" }}
          >
            Collapse
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// MAIN DAILY BRIEF
// ────────────────────────────────────────────

type Section = "news" | "research" | "reddit";

export default function DailyBrief({
  newsItems,
  researchItems,
  redditPosts,
  onContentCreate,
  onRedditAction,
  onRefresh,
  isRefreshing,
  lastRefreshed,
}: Props) {
  const [activeSection, setActiveSection] = useState<Section>("news");

  const sections: {
    id: Section;
    label: string;
    icon: typeof Newspaper;
    count: number;
    color: string;
  }[] = [
    {
      id: "news",
      label: "Top 10 News & Social",
      icon: Newspaper,
      count: newsItems.length,
      color: "#F1C028",
    },
    {
      id: "research",
      label: "New Research",
      icon: FlaskConical,
      count: researchItems.length,
      color: "#5A6FFF",
    },
    {
      id: "reddit",
      label: "Reddit Opportunities",
      icon: MessageCircle,
      count: redditPosts.length,
      color: "#E24D47",
    },
  ];

  const viralCount = newsItems.filter((n) => n.isViral).length;
  const gapCount = researchItems.filter((r) => r.fillsGap).length;
  const highPotential = redditPosts.filter(
    (r) => r.engagementPotential >= 9
  ).length;

  return (
    <div>
      {/* Morning briefing header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background:
            "linear-gradient(135deg, #F1C028 0%, #1EAA55 50%, #5A6FFF 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="text-white" size={22} strokeWidth={2} />
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              Good Morning, Kirsten
            </p>
            <p className="text-white/60 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              &middot; Your Daily Brief is ready
              {lastRefreshed && (
                <span>
                  {" "}&middot; Last refreshed {new Date(lastRefreshed).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Fetching real articles..." : "Refresh from Live Sources"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">
              {newsItems.length} news items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">
              {viralCount} trending viral
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">
              {gapCount} research gaps filled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">
              {highPotential} high-potential Reddit threads
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-white/80" />
            <span className="text-white/80 text-xs">
              All sources verified
            </span>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl overflow-x-auto"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
        }}
      >
        {sections.map((section) => {
          const active = activeSection === section.id;
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? {
                      backgroundColor: "var(--surface)",
                      color: section.color,
                    }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {section.label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  active
                    ? {
                        backgroundColor: `${section.color}14`,
                        color: section.color,
                      }
                    : {
                        backgroundColor: "var(--background)",
                        color: "var(--muted-light)",
                      }
                }
              >
                {section.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section content */}
      {activeSection === "news" && (
        <div className="space-y-3">
          {newsItems.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onContentCreate={onContentCreate}
            />
          ))}
        </div>
      )}

      {activeSection === "research" && (
        <div className="space-y-3">
          {researchItems.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              onContentCreate={onContentCreate}
            />
          ))}
        </div>
      )}

      {activeSection === "reddit" && (
        <div className="space-y-3">
          {redditPosts.map((post) => (
            <RedditCard
              key={post.id}
              post={post}
              onAction={onRedditAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
