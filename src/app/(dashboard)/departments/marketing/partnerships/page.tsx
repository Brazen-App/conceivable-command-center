"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Handshake,
  Mic2,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  MessageCircle,
  XCircle,
  Star,
} from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";
import RejectionModal from "@/components/review/RejectionModal";
import DiscussPanel from "@/components/review/DiscussPanel";
import {
  EXPERT_STATUS_CONFIG,
  type Expert,
  type ExpertStatus,
  type InterviewSchedule,
} from "@/lib/data/community-data";

const ACCENT = "#5A6FFF";

// --- Pipeline stages for display ---

const PIPELINE_STAGES: { key: ExpertStatus; label: string; color: string }[] = [
  { key: "potential", label: "Identified", color: "#ACB7FF" },
  { key: "outreach_sent", label: "Outreach", color: "#9686B9" },
  { key: "in_conversation", label: "In Conversation", color: "#356FB6" },
  { key: "scheduled", label: "Scheduled", color: "#1EAA55" },
  { key: "completed", label: "Completed", color: "#78C3BF" },
];

const PODCAST_HOST_COUNT = 69;

function getPipelineCounts(experts: Expert[]) {
  return PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: experts.filter((e) => e.status === stage.key).length,
  }));
}

function StatusIcon({ status }: { status: ExpertStatus }) {
  const config = EXPERT_STATUS_CONFIG.find((s) => s.key === status);
  const color = config?.color ?? "var(--muted)";

  switch (status) {
    case "completed":
      return <CheckCircle2 size={14} style={{ color }} />;
    case "scheduled":
      return <Calendar size={14} style={{ color }} />;
    case "in_conversation":
      return <MessageSquare size={14} style={{ color }} />;
    case "outreach_sent":
      return <Send size={14} style={{ color }} />;
    case "declined":
      return <XCircle size={14} style={{ color }} />;
    default:
      return <Star size={14} style={{ color }} />;
  }
}

export default function MarketingPartnershipsPage() {
  const [expandedExpert, setExpandedExpert] = useState<string | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; title: string; type: string } | null>(null);
  const [discussTarget, setDiscussTarget] = useState<{ id: string; title: string; type: string; detail?: string } | null>(null);
  const [passedExperts, setPassedExperts] = useState<Set<string>>(new Set());
  const [advancedExperts, setAdvancedExperts] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/community");
      const data = await res.json();
      if (data.experts) setExperts(data.experts);
      if (data.interviewSchedules) setInterviews(data.interviewSchedules);
    } catch {
      // Silently fall back to empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdvanceExpert = async (expertId: string) => {
    setAdvancedExperts((prev) => new Set(prev).add(expertId));
  };

  const handleRejectExpert = (id: string, name: string) => {
    setRejectionTarget({ id, title: name, type: "expert_partnership" });
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
    setPassedExperts((prev) => new Set(prev).add(rejectionTarget.id));
    setRejectionTarget(null);
  };

  const pipeline = getPipelineCounts(experts);
  const activeCount =
    experts.filter((e) =>
      ["in_conversation", "scheduled", "completed"].includes(e.status)
    ).length + PODCAST_HOST_COUNT;

  // No confirmed upcoming collaborations yet
  const UPCOMING_COLLABS: { date: string; event: string; type: string; status: string }[] = [];

  if (loading) {
    return (
      <div className="rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>Loading partnerships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: `${ACCENT}08`,
            border: `1px solid ${ACCENT}20`,
          }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {activeCount}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: ACCENT }}>
            Active Partnerships
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
            {experts.length} experts + {PODCAST_HOST_COUNT} podcast hosts
          </p>
        </div>

        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {PODCAST_HOST_COUNT}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#9686B9" }}>
            Podcast Hosts in CRM
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
            From master spreadsheet
          </p>
        </div>

        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {interviews.filter((s) => s.confirmed).length}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>
            Interviews Confirmed
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
            {interviews[0] ? `Next: ${interviews[0].expertName} on ${interviews[0].date}` : "No interviews scheduled"}
          </p>
        </div>
      </div>

      {/* Collaboration Pipeline */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Expert Interview Pipeline
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {pipeline.map((stage, i) => (
            <div key={stage.key} className="flex items-center gap-2">
              <div className="text-center">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white mx-auto"
                  style={{ backgroundColor: stage.color }}
                >
                  {stage.count}
                </div>
                <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--muted)" }}>
                  {stage.label}
                </p>
              </div>
              {i < pipeline.length - 1 && (
                <ArrowRight size={16} style={{ color: "var(--border)" }} className="mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expert Interview List */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--muted)" }}
          >
            Expert Interviews
          </p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {experts.map((expert, i) => {
              const statusConfig = EXPERT_STATUS_CONFIG.find((s) => s.key === expert.status);
              const isExpanded = expandedExpert === expert.id;

              return (
                <div key={expert.id}>
                  <div
                    className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onClick={() => setExpandedExpert(isExpanded ? null : expert.id)}
                  >
                    <StatusIcon status={expert.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {expert.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {expert.title}, {expert.organization}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${statusConfig?.color}14`,
                          color: statusConfig?.color,
                        }}
                      >
                        {statusConfig?.label}
                      </span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {(expert.audienceSize / 1000).toFixed(0)}K
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="px-4 py-3 text-xs"
                      style={{
                        backgroundColor: `${ACCENT}04`,
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex flex-wrap gap-1 mb-2">
                        {expert.expertise.map((e) => (
                          <span
                            key={e}
                            className="px-2 py-0.5 rounded-full text-[10px]"
                            style={{
                              backgroundColor: `${ACCENT}14`,
                              color: ACCENT,
                            }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                      <p style={{ color: "var(--foreground)" }}>{expert.notes}</p>
                      <p className="mt-1" style={{ color: "var(--muted)" }}>
                        Relevance: {expert.relevanceScore}/10 &middot; Audience:{" "}
                        {expert.audienceSize.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                        {advancedExperts.has(expert.id) ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#1EAA55" }}>
                            <CheckCircle2 size={12} /> Advanced
                          </span>
                        ) : passedExperts.has(expert.id) ? (
                          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#E24D47" }}>
                            <XCircle size={12} /> Passed
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAdvanceExpert(expert.id); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white"
                              style={{ backgroundColor: "#1EAA55" }}
                            >
                              <CheckCircle2 size={11} /> Advance
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRejectExpert(expert.id, expert.name); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white"
                              style={{ backgroundColor: "#E24D47" }}
                            >
                              <XCircle size={11} /> Pass
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDiscussTarget({
                                  id: expert.id,
                                  title: expert.name,
                                  type: "expert_partnership",
                                  detail: `${expert.title} at ${expert.organization}. Expertise: ${expert.expertise.join(", ")}. Audience: ${expert.audienceSize.toLocaleString()}. Notes: ${expert.notes}`,
                                });
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium"
                              style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                            >
                              <MessageCircle size={11} /> Discuss
                            </button>
                          </>
                        )}
                        <JoyButton
                          agent="marketing"
                          prompt={`Draft a personalized outreach message to ${expert.name} (${expert.title} at ${expert.organization}). Expertise: ${expert.expertise.join(", ")}. Audience: ${expert.audienceSize.toLocaleString()}. Notes: ${expert.notes}`}
                          label="Joy: Draft Outreach"
                        />
                        <JoyButton
                          agent="marketing"
                          prompt={`Prepare interview questions for ${expert.name} (${expert.title} at ${expert.organization}). Their expertise: ${expert.expertise.join(", ")}. Focus on topics that would resonate with their ${expert.audienceSize.toLocaleString()} audience and align with Conceivable's fertility optimization message.`}
                          label="Joy: Prep Interview Questions"
                          variant="secondary"
                          icon={<MessageSquare size={11} />}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cross-Promotion Calendar */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--muted)" }}
          >
            Cross-Promotion Calendar
          </p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {UPCOMING_COLLABS.map((collab, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
                  borderBottom:
                    i < UPCOMING_COLLABS.length - 1 ? "1px solid var(--border)" : undefined,
                }}
              >
                <div
                  className="text-center shrink-0 w-12"
                >
                  <p className="text-xs font-bold" style={{ color: ACCENT }}>
                    {collab.date.split(" ")[0]}
                  </p>
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {collab.date.split(" ")[1]}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {collab.event}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {collab.type}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      collab.status === "confirmed"
                        ? "#1EAA5514"
                        : collab.status === "tentative"
                        ? "#F1C02814"
                        : collab.status === "planning"
                        ? "#356FB614"
                        : "#9686B914",
                    color:
                      collab.status === "confirmed"
                        ? "#1EAA55"
                        : collab.status === "tentative"
                        ? "#F1C028"
                        : collab.status === "planning"
                        ? "#356FB6"
                        : "#9686B9",
                  }}
                >
                  {collab.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Podcast Host CRM Placeholder */}
          <div
            className="rounded-xl p-5 mt-4"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Mic2 size={16} style={{ color: "#9686B9" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Podcast Host CRM
              </p>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {PODCAST_HOST_COUNT} podcast hosts tracked across the fertility, wellness, and health-tech verticals.
              Imported from master outreach spreadsheet.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>23</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>Contacted</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>8</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>Booked</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>38</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>Remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleSubmitRejection}
        itemTitle={rejectionTarget?.title ?? ""}
        itemType="expert_partnership"
      />

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="expert_partnership"
        contextId={discussTarget?.id ?? ""}
        contextTitle={discussTarget?.title ?? ""}
        contextDetail={discussTarget?.detail}
        onApprove={() => {
          if (discussTarget) {
            setAdvancedExperts((prev) => new Set(prev).add(discussTarget.id));
            setDiscussTarget(null);
          }
        }}
        onReject={() => {
          if (discussTarget) {
            handleRejectExpert(discussTarget.id, discussTarget.title);
            setDiscussTarget(null);
          }
        }}
      />
    </div>
  );
}
