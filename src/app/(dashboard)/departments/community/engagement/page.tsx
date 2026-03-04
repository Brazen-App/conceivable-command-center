"use client";

import { useState } from "react";
import { MessageSquare, MessageCircle, Clock, Calendar, Users, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import RejectionModal from "@/components/review/RejectionModal";
import DiscussPanel from "@/components/review/DiscussPanel";

const ACCENT = "#1EAA55";

interface DiscussionPrompt {
  id: string;
  day: string;
  topic: string;
  prompt: string;
  category: "science" | "lifestyle" | "emotional" | "practical" | "celebration";
  engagement: "high" | "medium" | "low";
}

const DISCUSSION_PROMPTS: DiscussionPrompt[] = [
  { id: "dp01", day: "Monday", topic: "Mindset Monday", prompt: "What is one thing you learned about your body this past week that surprised you?", category: "emotional", engagement: "high" },
  { id: "dp02", day: "Tuesday", topic: "Science Tuesday", prompt: "Let's talk BBT patterns -- what has your temperature chart revealed about your cycle?", category: "science", engagement: "high" },
  { id: "dp03", day: "Wednesday", topic: "Wellness Wednesday", prompt: "Share your favorite fertility-friendly recipe or meal prep tip.", category: "lifestyle", engagement: "medium" },
  { id: "dp04", day: "Thursday", topic: "Data Thursday", prompt: "What biomarker are you most focused on tracking right now and why?", category: "practical", engagement: "medium" },
  { id: "dp05", day: "Friday", topic: "Wins Friday", prompt: "Share a win from this week -- big or small, every step forward counts!", category: "celebration", engagement: "high" },
  { id: "dp06", day: "Saturday", topic: "Weekend Check-in", prompt: "How are you planning to take care of yourself this weekend?", category: "emotional", engagement: "low" },
  { id: "dp07", day: "Sunday", topic: "Week Ahead Prep", prompt: "Set one intention for your fertility journey this coming week.", category: "practical", engagement: "medium" },
];

interface ResponseQueueItem {
  id: string;
  memberName: string;
  postTitle: string;
  timePosted: string;
  priority: "high" | "medium" | "low";
  needsResponse: "ceo" | "agent" | "community-manager";
  status: "pending" | "responded" | "escalated";
}

const RESPONSE_QUEUE: ResponseQueueItem[] = [
  { id: "rq01", memberName: "Sarah M.", postTitle: "Confused about my BBT chart -- can someone help?", timePosted: "2 hours ago", priority: "high", needsResponse: "agent", status: "pending" },
  { id: "rq02", memberName: "Jessica L.", postTitle: "Just got my lab results back -- progesterone question", timePosted: "4 hours ago", priority: "high", needsResponse: "ceo", status: "pending" },
  { id: "rq03", memberName: "Amanda R.", postTitle: "Anyone else dealing with thyroid issues while TTC?", timePosted: "6 hours ago", priority: "medium", needsResponse: "community-manager", status: "pending" },
  { id: "rq04", memberName: "Kim H.", postTitle: "Success story -- pregnant after 14 months!", timePosted: "8 hours ago", priority: "medium", needsResponse: "ceo", status: "responded" },
  { id: "rq05", memberName: "Rachel S.", postTitle: "Supplement question -- is this dose right?", timePosted: "12 hours ago", priority: "medium", needsResponse: "agent", status: "pending" },
  { id: "rq06", memberName: "Olivia J.", postTitle: "New here! Where should I start?", timePosted: "1 day ago", priority: "low", needsResponse: "community-manager", status: "responded" },
];

const ENGAGEMENT_BY_TYPE = [
  { type: "Discussion prompts", avgReplies: 24, avgViews: 145 },
  { type: "Science explainers", avgReplies: 18, avgViews: 210 },
  { type: "Member spotlights", avgReplies: 32, avgViews: 180 },
  { type: "CEO live Q&A", avgReplies: 45, avgViews: 320 },
  { type: "Challenge posts", avgReplies: 28, avgViews: 165 },
  { type: "Resource shares", avgReplies: 8, avgViews: 95 },
];

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    science: "#78C3BF",
    lifestyle: "#1EAA55",
    emotional: "#E37FB1",
    practical: "#356FB6",
    celebration: "#F1C028",
  };
  const color = colors[category] || ACCENT;
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${color}18`, color }}>
      {category}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const config = {
    high: { bg: "#E24D4718", color: "#E24D47" },
    medium: { bg: "#F1C02818", color: "#F1C028" },
    low: { bg: "#356FB618", color: "#356FB6" },
  };
  const c = config[priority];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {priority}
    </span>
  );
}

function ResponderBadge({ responder }: { responder: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    ceo: { bg: "#9686B918", color: "#9686B9", label: "CEO" },
    agent: { bg: "#356FB618", color: "#356FB6", label: "AI Agent" },
    "community-manager": { bg: "#1EAA5518", color: "#1EAA55", label: "CM" },
  };
  const c = config[responder] || config.agent;
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

export default function EngagementPage() {
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; title: string; type: string } | null>(null);
  const [discussTarget, setDiscussTarget] = useState<{ id: string; title: string; type: string; detail?: string } | null>(null);
  const [handledItems, setHandledItems] = useState<Set<string>>(new Set());
  const [skippedItems, setSkippedItems] = useState<Set<string>>(new Set());

  const handleRespond = (id: string) => {
    setHandledItems((prev) => new Set(prev).add(id));
  };

  const handleSkip = (id: string, title: string) => {
    setRejectionTarget({ id, title, type: "community_response" });
  };

  const handleSubmitRejection = async (reasonCategory: string, reasonText: string) => {
    if (!rejectionTarget) return;
    await fetch("/api/rejections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommendationId: rejectionTarget.id,
        recommendationType: rejectionTarget.type,
        reasonCategory,
        reasonText,
      }),
    });
    setSkippedItems((prev) => new Set(prev).add(rejectionTarget.id));
    setRejectionTarget(null);
  };

  const pendingCount = RESPONSE_QUEUE.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Daily Posting Schedule */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Calendar size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Daily Discussion Schedule
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Day</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Topic</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prompt</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {DISCUSSION_PROMPTS.map((prompt) => (
                <tr key={prompt.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{prompt.day}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: ACCENT }}>{prompt.topic}</td>
                  <td className="px-5 py-3 max-w-xs text-xs" style={{ color: "var(--foreground)" }}>{prompt.prompt}</td>
                  <td className="px-5 py-3"><CategoryBadge category={prompt.category} /></td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-medium capitalize"
                      style={{ color: prompt.engagement === "high" ? "#1EAA55" : prompt.engagement === "medium" ? "#F1C028" : "#E24D47" }}
                    >
                      {prompt.engagement}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Queue */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: ACCENT }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Response Queue
            </h2>
          </div>
          {pendingCount > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}>
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {RESPONSE_QUEUE.map((item) => (
            <div key={item.id} className="px-5 py-3 flex items-center gap-3">
              {item.status === "pending" ? (
                <AlertCircle size={14} style={{ color: "#F1C028" }} />
              ) : (
                <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {item.postTitle}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{item.memberName}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{item.timePosted}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PriorityBadge priority={item.priority} />
                <ResponderBadge responder={item.needsResponse} />
                {item.status === "pending" && !handledItems.has(item.id) && !skippedItems.has(item.id) && (
                  <>
                    <button
                      onClick={() => handleRespond(item.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-white"
                      style={{ backgroundColor: "#1EAA55" }}
                    >
                      <CheckCircle2 size={10} /> Respond
                    </button>
                    <button
                      onClick={() => handleSkip(item.id, item.postTitle)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-white"
                      style={{ backgroundColor: "#E24D47" }}
                    >
                      <XCircle size={10} /> Skip
                    </button>
                    <button
                      onClick={() => setDiscussTarget({ id: item.id, title: item.postTitle, type: "community_response", detail: `From ${item.memberName}, ${item.timePosted}. Priority: ${item.priority}. Needs response from: ${item.needsResponse}.` })}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium"
                      style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                    >
                      <MessageCircle size={10} /> Discuss
                    </button>
                  </>
                )}
                {handledItems.has(item.id) && (
                  <span className="text-[10px] font-medium" style={{ color: "#1EAA55" }}>Handled</span>
                )}
                {skippedItems.has(item.id) && (
                  <span className="text-[10px] font-medium" style={{ color: "#E24D47" }}>Skipped</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement by Content Type */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Engagement by Content Type
        </h2>
        <div className="space-y-3">
          {ENGAGEMENT_BY_TYPE.sort((a, b) => b.avgReplies - a.avgReplies).map((type) => {
            const maxReplies = Math.max(...ENGAGEMENT_BY_TYPE.map((t) => t.avgReplies));
            return (
              <div key={type.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>{type.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{type.avgViews} views</span>
                    <span className="text-xs font-bold" style={{ color: ACCENT }}>{type.avgReplies} replies</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(type.avgReplies / maxReplies) * 100}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleSubmitRejection}
        itemTitle={rejectionTarget?.title ?? ""}
        itemType="community_response"
      />

      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="community_response"
        contextId={discussTarget?.id ?? ""}
        contextTitle={discussTarget?.title ?? ""}
        contextDetail={discussTarget?.detail}
        onApprove={() => {
          if (discussTarget) {
            setHandledItems((prev) => new Set(prev).add(discussTarget.id));
            setDiscussTarget(null);
          }
        }}
        onReject={() => {
          if (discussTarget) {
            handleSkip(discussTarget.id, discussTarget.title);
            setDiscussTarget(null);
          }
        }}
      />
    </div>
  );
}
