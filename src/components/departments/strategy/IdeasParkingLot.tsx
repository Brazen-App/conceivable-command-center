"use client";

import { useState } from "react";
import {
  Lightbulb,
  Plus,
  Sparkles,
  Loader2,
  Bot,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
} from "lucide-react";
import type { Idea, IdeaStatus } from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

const DEPT_COLORS: Record<string, string> = {
  "Operations": "#5A6FFF",
  "Email Strategy": "#ACB7FF",
  "Content Engine": "#E37FB1",
  "Community": "#1EAA55",
  "Legal / IP": "#E24D47",
  "Finance": "#F1C028",
  "Clinical / Research": "#78C3BF",
  "Fundraising": "#356FB6",
};

const STATUS_CONFIG: Record<IdeaStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  new: { label: "New", color: "#ACB7FF", icon: Lightbulb },
  pursue: { label: "Pursue Now", color: "#1EAA55", icon: ArrowUpRight },
  schedule: { label: "Schedule Later", color: "#356FB6", icon: Clock },
  delegate: { label: "Delegate", color: "#F1C028", icon: ArrowUpRight },
  drop: { label: "Drop", color: "#E24D47", icon: XCircle },
  done: { label: "Done", color: "var(--muted)", icon: CheckCircle2 },
};

interface Props {
  ideas: Idea[];
}

export default function IdeasParkingLot({ ideas }: Props) {
  const [newIdea, setNewIdea] = useState("");
  const [allIdeas, setAllIdeas] = useState<Idea[]>(ideas);
  const [reviewing, setReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "pursue" | "schedule" | "delegate">("all");
  const [showArchived, setShowArchived] = useState(false);

  const handleAddIdea = () => {
    if (!newIdea.trim()) return;
    const idea: Idea = {
      id: `idea-${Date.now()}`,
      text: newIdea,
      department: "Operations",
      impact: "2x",
      urgency: "backlog",
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllIdeas([idea, ...allIdeas]);
    setNewIdea("");
  };

  const handleReviewIdeas = async () => {
    const newIdeas = allIdeas.filter((i) => i.status === "new");
    if (newIdeas.length === 0) return;

    setReviewing(true);
    setReviewResult(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are the Strategy Coach for Conceivable. Review the CEO's Ideas Parking Lot and provide recommendations.

FRAMEWORK:
- Sullivan: Is this a 2x or 10x idea?
- Campbell: Does this serve the team and the mission?
- Unique Ability: Does this require the CEO or can it be delegated?
- Timing: Is this a NOW, THIS QUARTER, or BACKLOG item?

CURRENT CONTEXT:
- 7 weeks to launch
- $150K bridge + $5M Series A being prepared
- 847-member community growing
- 29K email list, 0 signups (funnel not yet active)

IDEAS TO REVIEW:
${newIdeas.map((idea, i) => `${i + 1}. "${idea.text}"`).join("\n")}

For each idea, provide:
1. Recommendation: PURSUE NOW / SCHEDULE LATER / DELEGATE / DROP
2. Impact assessment: 2x or 10x
3. Which department should own this
4. Brief reasoning (1-2 sentences)
5. If delegate — WHO specifically should handle it`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviewResult(data.response);
      } else {
        setReviewResult("Unable to review ideas — please check that the API is configured.");
      }
    } catch {
      setReviewResult("Unable to review ideas — please check your connection and try again.");
    } finally {
      setReviewing(false);
    }
  };

  const activeIdeas = allIdeas.filter((i) => i.status !== "done" && i.status !== "drop");
  const archivedIdeas = allIdeas.filter((i) => i.status === "done" || i.status === "drop");
  const filteredIdeas = filter === "all" ? activeIdeas : activeIdeas.filter((i) => i.status === filter);
  const newCount = allIdeas.filter((i) => i.status === "new").length;

  return (
    <div>
      {/* Quick Capture */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "var(--surface)", border: `2px dashed ${ACCENT}40` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} style={{ color: ACCENT }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Quick Capture
          </h3>
          <p className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            Just start typing — tag and review happens automatically
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
            placeholder="What's the idea? Type it fast, refine it later..."
            className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
            }}
          />
          <button
            onClick={handleAddIdea}
            disabled={!newIdea.trim()}
            className="px-5 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50 transition-colors flex items-center gap-2"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus size={16} />
            Capture
          </button>
        </div>
      </div>

      {/* Review Button */}
      {newCount > 0 && (
        <div className="mb-6">
          <button
            onClick={handleReviewIdeas}
            disabled={reviewing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            {reviewing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Reviewing {newCount} New Ideas...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Review {newCount} New Ideas (Sullivan + Campbell Framework)
              </>
            )}
          </button>

          {reviewResult && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Coach&apos;s Review
                </p>
              </div>
              <div
                className="rounded-xl border p-5"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {reviewResult}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {(["all", "new", "pursue", "schedule", "delegate"] as const).map((f) => {
          const active = filter === f;
          const count = f === "all" ? activeIdeas.length : activeIdeas.filter((i) => i.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: active ? ACCENT : "var(--background)",
                color: active ? "white" : "var(--muted)",
                border: `1px solid ${active ? ACCENT : "var(--border)"}`,
              }}
            >
              {f === "all" ? "All" : STATUS_CONFIG[f].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Ideas List */}
      <div className="space-y-2 mb-6">
        {filteredIdeas.map((idea) => {
          const statusConf = STATUS_CONFIG[idea.status];
          const deptColor = DEPT_COLORS[idea.department] || ACCENT;
          const StatusIcon = statusConf.icon;
          const hasReview = !!idea.agentReview;

          return (
            <div
              key={idea.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start gap-3">
                <StatusIcon size={16} className="shrink-0 mt-0.5" style={{ color: statusConf.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                    >
                      {statusConf.label}
                    </span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${deptColor}14`, color: deptColor }}
                    >
                      {idea.department}
                    </span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: idea.impact === "10x" ? "#1EAA5514" : "#F1C02814",
                        color: idea.impact === "10x" ? "#1EAA55" : "#F1C028",
                      }}
                    >
                      {idea.impact}
                    </span>
                    <span className="text-[9px] ml-auto" style={{ color: "var(--muted)" }}>
                      {new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-1" style={{ color: "var(--foreground)" }}>
                    {idea.text}
                  </p>

                  {hasReview && (
                    <div
                      className="rounded-lg p-3 mt-2"
                      style={{ backgroundColor: `${ACCENT}06`, borderLeft: `3px solid ${ACCENT}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Coach&apos;s Assessment
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {idea.agentReview}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {(["new", "pursue", "schedule", "delegate", "drop"] as const).map((status) => {
          const conf = STATUS_CONFIG[status];
          const count = allIdeas.filter((i) => i.status === status).length;
          return (
            <div
              key={status}
              className="rounded-xl border p-3 text-center"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <p className="text-xl font-bold" style={{ color: conf.color }}>{count}</p>
              <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: conf.color }}>
                {conf.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Archived Ideas */}
      {archivedIdeas.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 mb-3 w-full"
          >
            <Archive size={14} style={{ color: "var(--muted)" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider flex-1 text-left" style={{ color: "var(--muted)" }}>
              Archived ({archivedIdeas.length})
            </h3>
            {showArchived ? (
              <ChevronDown size={14} style={{ color: "var(--muted)" }} />
            ) : (
              <ChevronRight size={14} style={{ color: "var(--muted)" }} />
            )}
          </button>
          {showArchived && (
            <div className="space-y-2">
              {archivedIdeas.map((idea) => {
                const statusConf = STATUS_CONFIG[idea.status];
                return (
                  <div
                    key={idea.id}
                    className="rounded-xl border p-3 opacity-60"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                      >
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)", textDecoration: idea.status === "drop" ? "line-through" : "none" }}>
                      {idea.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
