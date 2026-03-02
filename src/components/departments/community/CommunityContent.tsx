"use client";

import { useState } from "react";
import {
  CalendarDays,
  MessageCircle,
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Loader2,
  Bot,
} from "lucide-react";
import type {
  PostingCalendarEntry,
  DiscussionPrompt,
  MemberSpotlight,
  ResponseQueueItem,
  ContentSourceMetric,
  Platform,
} from "@/lib/data/community-data";

const ACCENT = "#1EAA55";

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string }> = {
  circle: { label: "Circle", color: "#1EAA55" },
  facebook: { label: "Facebook", color: "#356FB6" },
  instagram: { label: "Instagram", color: "#E37FB1" },
  email: { label: "Email", color: "#ACB7FF" },
};

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TREND_CONFIG = {
  up: { Icon: TrendingUp, color: "#1EAA55" },
  down: { Icon: TrendingDown, color: "#E24D47" },
  flat: { Icon: Minus, color: "var(--muted)" },
};

const SPOTLIGHT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  identified: { label: "Identified", color: "#ACB7FF" },
  contacted: { label: "Contacted", color: "#9686B9" },
  approved: { label: "Approved", color: "#356FB6" },
  published: { label: "Published", color: "#1EAA55" },
};

interface Props {
  postingCalendar: PostingCalendarEntry[];
  discussionPrompts: DiscussionPrompt[];
  memberSpotlights: MemberSpotlight[];
  responseQueue: ResponseQueueItem[];
  contentSourceMetrics: ContentSourceMetric[];
}

export default function CommunityContent({
  postingCalendar,
  discussionPrompts,
  memberSpotlights,
  responseQueue,
  contentSourceMetrics,
}: Props) {
  const [generatingPrompts, setGeneratingPrompts] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string | null>(null);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  const handleGeneratePrompts = async () => {
    setGeneratingPrompts(true);
    setGeneratedPrompts(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "marketing",
          message: `You are generating discussion prompts for Conceivable's Circle community (847 members, fertility health focus).

CURRENT TOP CATEGORIES BY ENGAGEMENT:
- Emotional Support: 94 avg engagement
- Science/Research: 91 avg engagement
- Fertility Journey: 85 avg engagement
- Lifestyle: 77 avg engagement

COMMUNITY CONTEXT:
- Members are women trying to conceive, ages 28-40
- Mix of first-time TTC and experienced (IVF, PCOS, unexplained)
- They respond best to vulnerability, shared experiences, and actionable science
- BBT tracking is a common thread

Generate 5 new discussion prompts that would drive high engagement. For each, provide:
1. The prompt question
2. Category
3. Why it would resonate
4. Estimated engagement score (1-100)

Make them feel warm, inviting, and non-clinical. The best prompts make members feel seen.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedPrompts(data.response);
      } else {
        setGeneratedPrompts("Unable to generate prompts — please check that the API is configured.");
      }
    } catch {
      setGeneratedPrompts("Unable to generate prompts — please check your connection and try again.");
    } finally {
      setGeneratingPrompts(false);
    }
  };

  return (
    <div>
      {/* Content Source Metrics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Content Sources This Week
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contentSourceMetrics.map((metric) => {
            const trendConf = TREND_CONFIG[metric.trend];
            return (
              <div
                key={metric.source}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {metric.label}
                  </span>
                  <trendConf.Icon size={12} style={{ color: trendConf.color }} />
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {metric.postsThisWeek}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {metric.avgEngagement} avg engagement
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Posting Calendar */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Weekly Posting Calendar
          </h3>
        </div>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: "var(--border)" }}>
            {DAY_ORDER.map((day, i) => {
              const dayPosts = postingCalendar.filter((p) => p.dayOfWeek === day);
              return (
                <div key={day} className="p-3 min-h-[120px]" style={{ backgroundColor: "var(--surface)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                    {DAY_LABELS[i]}
                  </p>
                  <div className="space-y-1.5">
                    {dayPosts.map((post) => {
                      const platConf = PLATFORM_CONFIG[post.platform];
                      return (
                        <div
                          key={post.id}
                          className="rounded-lg p-2"
                          style={{ backgroundColor: `${platConf.color}10`, borderLeft: `2px solid ${platConf.color}` }}
                        >
                          <p className="text-[9px] font-bold" style={{ color: platConf.color }}>
                            {platConf.label}
                          </p>
                          <p className="text-[10px] font-medium leading-tight mt-0.5" style={{ color: "var(--foreground)" }}>
                            {post.topic}
                          </p>
                          <p className="text-[9px] mt-0.5" style={{ color: "var(--muted)" }}>
                            {post.scheduledTime}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discussion Prompt Generator */}
      <div className="mb-6">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Discussion Prompts
            </h3>
            <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
              {discussionPrompts.filter((p) => p.status === "unused").length} unused prompts ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {discussionPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-xl border p-3.5"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                  >
                    {prompt.category}
                  </span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: prompt.status === "posted" ? "#1EAA5514" : prompt.status === "scheduled" ? "#356FB614" : "#9686B914",
                      color: prompt.status === "posted" ? "#1EAA55" : prompt.status === "scheduled" ? "#356FB6" : "#9686B9",
                    }}
                  >
                    {prompt.status}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--foreground)" }}>
                  &ldquo;{prompt.prompt}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Est. engagement: {prompt.estimatedEngagement}
                  </span>
                  {prompt.status === "unused" && (
                    <button
                      className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                      style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleGeneratePrompts}
            disabled={generatingPrompts}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            {generatingPrompts ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating Prompts...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate New Prompts
              </>
            )}
          </button>

          {generatedPrompts && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Generated Prompts
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {generatedPrompts}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Spotlights */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Member Spotlights
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {memberSpotlights.map((spotlight) => {
            const statusConf = SPOTLIGHT_STATUS_CONFIG[spotlight.status];
            return (
              <div
                key={spotlight.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {spotlight.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {spotlight.memberName}
                      </p>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Member since {new Date(spotlight.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--foreground)" }}>
                  {spotlight.story}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {spotlight.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Response Queue */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Response Queue
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {responseQueue.filter((r) => r.status === "pending").length} pending
          </span>
        </div>
        <div className="space-y-2">
          {responseQueue.map((item) => {
            const expanded = expandedResponse === item.id;
            const priorityColor = item.priority === "ceo_required" ? "#E24D47" : "#1EAA55";
            const platConf = PLATFORM_CONFIG[item.platform];

            return (
              <div
                key={item.id}
                className="rounded-xl border transition-all"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer"
                  onClick={() => setExpandedResponse(expanded ? null : item.id)}
                >
                  <div className="pt-0.5">
                    {expanded ? (
                      <ChevronDown size={14} style={{ color: ACCENT }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${priorityColor}14`, color: priorityColor }}
                      >
                        {item.priority === "ceo_required" ? "CEO Required" : "Agent Handled"}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${platConf.color}14`, color: platConf.color }}
                      >
                        {platConf.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {item.postTitle}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                      by {item.memberName}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.status === "pending" ? "#F1C02814" : item.status === "in_progress" ? "#356FB614" : "#1EAA5514",
                      color: item.status === "pending" ? "#F1C028" : item.status === "in_progress" ? "#356FB6" : "#1EAA55",
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                {expanded && (
                  <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                    <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: "var(--background)" }}>
                      <p className="text-xs leading-relaxed italic" style={{ color: "var(--foreground)" }}>
                        &ldquo;{item.excerpt}&rdquo;
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: `${priorityColor}08`, borderLeft: `3px solid ${priorityColor}` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: priorityColor }}>
                        Flag Reason
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {item.flagReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
