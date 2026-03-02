"use client";

import { useState } from "react";
import {
  Newspaper,
  FlaskConical,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Mic,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Eye,
  FileText,
  Zap,
  Shield,
} from "lucide-react";
import type { NewsItem, ResearchItem, RedditPost } from "@/lib/data/content-engine";
import POVRecorder from "./POVRecorder";

interface Props {
  newsItems: NewsItem[];
  researchItems: ResearchItem[];
  redditPosts: RedditPost[];
  onContentCreate: (sourceId: string, transcript: string) => void;
  onRedditAction: (id: string, action: "approved" | "skipped") => void;
}

type ViewMode = "list" | "summary" | "full";

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

// ============================================================
// NEWS ITEM CARD
// ============================================================

function NewsCard({
  item,
  onContentCreate,
}: {
  item: NewsItem;
  onContentCreate: (sourceId: string, transcript: string) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showPOV, setShowPOV] = useState(false);
  const tag = TAG_CONFIG[item.tag];

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: viewMode !== "list" ? "#F1C02830" : "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      {/* List row — always visible */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setViewMode(viewMode === "list" ? "summary" : "list")}
      >
        <div className="pt-0.5">
          {viewMode === "list" ? (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown size={14} style={{ color: "#F1C028" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
            <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
              {item.source} &middot; {timeAgo(item.timestamp)}
            </span>
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
            {item.title}
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
            {item.brief}
          </p>
        </div>

        {item.povTranscript && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#1EAA5520" }}
          >
            <Mic size={11} style={{ color: "#1EAA55" }} />
          </div>
        )}
      </div>

      {/* Summary view */}
      {viewMode !== "list" && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* View toggle */}
          <div className="flex items-center gap-2 py-3">
            <button
              onClick={() => setViewMode("summary")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                viewMode === "summary"
                  ? { backgroundColor: "#F1C02818", color: "#F1C028" }
                  : { color: "var(--muted)" }
              }
            >
              <Eye size={12} /> Summary
            </button>
            <button
              onClick={() => setViewMode("full")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                viewMode === "full"
                  ? { backgroundColor: "#F1C02818", color: "#F1C028" }
                  : { color: "var(--muted)" }
              }
            >
              <FileText size={12} /> Full Article
            </button>
          </div>

          {/* Content */}
          {viewMode === "summary" ? (
            <div className="space-y-3">
              <div
                className="rounded-lg p-3 text-xs leading-relaxed whitespace-pre-line"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
              >
                {item.summary}
              </div>

              {/* Agent recommendation */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                  Agent Recommendation
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {item.agentRecommendation}
                </p>
              </div>

              {/* Coverage angle */}
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: "#5A6FFF08", borderLeft: "3px solid #5A6FFF" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#5A6FFF" }}>
                  Suggested Coverage Angle
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {item.coverageAngle}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-lg p-4 text-xs leading-relaxed whitespace-pre-line"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              {item.fullArticle}
            </div>
          )}

          {/* POV section */}
          <div className="mt-4">
            {showPOV ? (
              <POVRecorder
                onTranscriptReady={(transcript) => {
                  setShowPOV(false);
                  onContentCreate(item.id, transcript);
                }}
                onClose={() => setShowPOV(false)}
              />
            ) : (
              <button
                onClick={() => setShowPOV(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#F1C028", color: "white" }}
              >
                <Mic size={14} /> Record Your POV
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// RESEARCH ITEM CARD
// ============================================================

function ResearchCard({
  item,
  onContentCreate,
}: {
  item: ResearchItem;
  onContentCreate: (sourceId: string, transcript: string) => void;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showPOV, setShowPOV] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: viewMode !== "list" ? "#F1C02830" : "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setViewMode(viewMode === "list" ? "summary" : "list")}
      >
        <div className="pt-0.5">
          {viewMode === "list" ? (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown size={14} style={{ color: "#F1C028" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
            {item.title}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-light)" }}>
            {item.authors}
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
            {item.brief}
          </p>
        </div>
      </div>

      {viewMode !== "list" && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 py-3">
            <button
              onClick={() => setViewMode("summary")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={
                viewMode === "summary"
                  ? { backgroundColor: "#F1C02818", color: "#F1C028" }
                  : { color: "var(--muted)" }
              }
            >
              <Eye size={12} /> Summary
            </button>
            <button
              onClick={() => setViewMode("full")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={
                viewMode === "full"
                  ? { backgroundColor: "#F1C02818", color: "#F1C028" }
                  : { color: "var(--muted)" }
              }
            >
              <FileText size={12} /> Full Abstract
            </button>
          </div>

          {viewMode === "summary" ? (
            <div className="space-y-3">
              {/* Structured summary */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                {(
                  [
                    ["Study Design", item.summary.design],
                    ["Key Findings", item.summary.keyFindings],
                    ["Sample Size", item.summary.sampleSize],
                    ["Limitations", item.summary.limitations],
                    ["Conceivable Relevance", item.summary.conceivableRelevance],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="px-3 py-2 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>
                      {label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {item.fillsGap && item.gapDescription && (
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                    Knowledge Gap Filled
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {item.gapDescription}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-lg p-4 text-xs leading-relaxed whitespace-pre-line"
              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              {item.fullAbstract}
            </div>
          )}

          <div className="mt-4">
            {showPOV ? (
              <POVRecorder
                onTranscriptReady={(transcript) => {
                  setShowPOV(false);
                  onContentCreate(item.id, transcript);
                }}
                onClose={() => setShowPOV(false)}
              />
            ) : (
              <button
                onClick={() => setShowPOV(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "#F1C028", color: "white" }}
              >
                <Mic size={14} /> Record Your POV
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// REDDIT POST CARD
// ============================================================

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
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? (
            <ChevronDown size={14} style={{ color: "#F1C028" }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
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
            <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>
              {post.upvotes.toLocaleString()} upvotes &middot; {post.comments} comments
            </span>
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
            {post.title}
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--muted)" }}>
            {post.body}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-lg font-bold" style={{ color: "#F1C028" }}>
            {post.engagementPotential}
          </span>
          <span className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted-light)" }}>
            Potential
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Full post body */}
          <div
            className="rounded-lg p-3 mt-3 text-xs leading-relaxed"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
              Original Post
            </p>
            {post.body}
          </div>

          {/* Draft response */}
          <div
            className="rounded-lg p-3 mt-3"
            style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
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
                style={{ color: "var(--muted)", backgroundColor: "var(--background)" }}
              >
                Skip
              </button>
            </div>
          )}
          {post.status !== "pending" && (
            <p
              className="text-xs font-medium mt-3 capitalize"
              style={{
                color: post.status === "approved" || post.status === "posted" ? "#1EAA55" : "var(--muted)",
              }}
            >
              Status: {post.status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN DAILY BRIEF
// ============================================================

type Section = "news" | "research" | "reddit";

export default function DailyBrief({
  newsItems,
  researchItems,
  redditPosts,
  onContentCreate,
  onRedditAction,
}: Props) {
  const [activeSection, setActiveSection] = useState<Section>("news");

  const sections: { id: Section; label: string; icon: typeof Newspaper; count: number; color: string }[] = [
    { id: "news", label: "Top 10 News & Social", icon: Newspaper, count: newsItems.length, color: "#F1C028" },
    { id: "research", label: "New Research", icon: FlaskConical, count: researchItems.length, color: "#5A6FFF" },
    { id: "reddit", label: "Reddit Opportunities", icon: MessageCircle, count: redditPosts.length, color: "#E24D47" },
  ];

  const viralCount = newsItems.filter((n) => n.isViral).length;
  const gapCount = researchItems.filter((r) => r.fillsGap).length;
  const highPotential = redditPosts.filter((r) => r.engagementPotential >= 9).length;

  return (
    <div>
      {/* Morning briefing header */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "linear-gradient(135deg, #F1C028 0%, #1EAA55 50%, #5A6FFF 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="text-white" size={22} strokeWidth={2} />
          <div>
            <p className="text-white font-semibold text-sm">Good Morning, Kirsten</p>
            <p className="text-white/60 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {" "}&middot; Your Daily Brief is ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">{newsItems.length} news items</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">{viralCount} trending viral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">{gapCount} research gaps filled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-xs">{highPotential} high-potential Reddit threads</span>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
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
                  ? { backgroundColor: "var(--surface)", color: section.color }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {section.label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  active
                    ? { backgroundColor: `${section.color}14`, color: section.color }
                    : { backgroundColor: "var(--background)", color: "var(--muted-light)" }
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
            <NewsCard key={item.id} item={item} onContentCreate={onContentCreate} />
          ))}
        </div>
      )}

      {activeSection === "research" && (
        <div className="space-y-3">
          {researchItems.map((item) => (
            <ResearchCard key={item.id} item={item} onContentCreate={onContentCreate} />
          ))}
        </div>
      )}

      {activeSection === "reddit" && (
        <div className="space-y-3">
          {redditPosts.map((post) => (
            <RedditCard key={post.id} post={post} onAction={onRedditAction} />
          ))}
        </div>
      )}
    </div>
  );
}
