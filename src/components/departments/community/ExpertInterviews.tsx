"use client";

import { useState } from "react";
import {
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Sparkles,
  Loader2,
  Bot,
  Target,
  Users,
  ArrowUpRight,
} from "lucide-react";
import type {
  Expert,
  OutreachDraft,
  InterviewSchedule,
  PrepPacket,
  PostInterviewTask,
  ExpertStatus,
} from "@/lib/data/community-data";
import { EXPERT_STATUS_CONFIG } from "@/lib/data/community-data";

const ACCENT = "#1EAA55";

interface Props {
  experts: Expert[];
  outreachDrafts: OutreachDraft[];
  interviewSchedules: InterviewSchedule[];
  prepPackets: PrepPacket[];
  postInterviewTasks: PostInterviewTask[];
}

function StatusBadge({ status }: { status: ExpertStatus }) {
  const conf = EXPERT_STATUS_CONFIG.find((s) => s.key === status);
  if (!conf) return null;
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
    >
      {conf.label}
    </span>
  );
}

function RelevanceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: i < score ? ACCENT : "var(--border)",
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold" style={{ color: ACCENT }}>
        {score}/10
      </span>
    </div>
  );
}

function ExpertCard({
  expert,
  outreachDraft,
}: {
  expert: Expert;
  outreachDraft?: OutreachDraft;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
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
            <StatusBadge status={expert.status} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {expert.name}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted)" }}>
            {expert.title} &middot; {expert.organization}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {expert.expertise.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Audience
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            {expert.audienceSize >= 1000000
              ? `${(expert.audienceSize / 1000000).toFixed(1)}M`
              : `${(expert.audienceSize / 1000).toFixed(0)}K`}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
          {/* Relevance Score */}
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted)" }}>
              Relevance Score
            </p>
            <RelevanceBar score={expert.relevanceScore} />
          </div>

          {/* Notes */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
              {expert.notes}
            </p>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted)" }}>
              <Calendar size={10} /> Identified: {new Date(expert.dates.identified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {expert.dates.lastContact && (
              <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted)" }}>
                <Clock size={10} /> Last contact: {new Date(expert.dates.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {expert.dates.interviewDate && (
              <span className="text-[10px] flex items-center gap-1" style={{ color: ACCENT }}>
                <CheckCircle2 size={10} /> Interview: {new Date(expert.dates.interviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>

          {/* Outreach Draft if exists */}
          {outreachDraft && (
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: ACCENT }}>
                <Send size={10} /> Outreach Draft — {outreachDraft.status}
              </p>
              <p className="text-[10px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                Subject: {outreachDraft.subject}
              </p>
              <p className="text-[10px] italic" style={{ color: "var(--muted)" }}>
                Hook: {outreachDraft.personalizedHook}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpertInterviews({
  experts,
  outreachDrafts,
  interviewSchedules,
  prepPackets,
  postInterviewTasks,
}: Props) {
  const [suggestingExperts, setSuggestingExperts] = useState(false);
  const [suggestedExperts, setSuggestedExperts] = useState<string | null>(null);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [expandedPacket, setExpandedPacket] = useState<string | null>(null);

  const handleSuggestExperts = async () => {
    setSuggestingExperts(true);
    setSuggestedExperts(null);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "marketing",
          message: `You are identifying expert interview prospects for Conceivable's community platform.

CURRENT EXPERT PIPELINE: ${experts.map((e) => `${e.name} (${e.status})`).join(", ")}

CONCEIVABLE'S FOCUS AREAS:
- Fertility optimization through lifestyle and nutrition
- BBT (Basal Body Temperature) as a biomarker window
- PCOS, hormonal balance, cycle health
- Metabolic health and its impact on fertility
- Stress, sleep, and their effects on conception
- Data-driven, science-backed approaches

IDEAL EXPERT PROFILE:
- Established audience (50K+ across platforms)
- Published author, researcher, or clinical practitioner
- Alignment with integrative, evidence-based approach
- Not already in our pipeline

Suggest 5 new experts we should pursue. For each, provide:
1. Name and credentials
2. Organization/platform
3. Audience size estimate
4. Top 3 expertise areas
5. Why they'd be valuable (specific alignment)
6. Relevance score (1-10)
7. Suggested approach pathway`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedExperts(data.response);
      } else {
        setSuggestedExperts("Unable to suggest experts — please check that the API is configured.");
      }
    } catch {
      setSuggestedExperts("Unable to suggest experts — please check your connection and try again.");
    } finally {
      setSuggestingExperts(false);
    }
  };

  const handleGenerateDraft = async () => {
    setGeneratingDraft(true);
    setGeneratedDraft(null);
    const potentialExperts = experts.filter((e) => e.status === "potential" || e.status === "outreach_sent");
    const target = potentialExperts[0];
    if (!target) {
      setGeneratedDraft("No experts in potential/outreach_sent status to draft for.");
      setGeneratingDraft(false);
      return;
    }
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "marketing",
          message: `Write a personalized interview invitation email for Conceivable's community expert series.

TARGET EXPERT: ${target.name}
TITLE: ${target.title}
ORGANIZATION: ${target.organization}
EXPERTISE: ${target.expertise.join(", ")}
AUDIENCE SIZE: ${target.audienceSize.toLocaleString()}
NOTES: ${target.notes}

ABOUT CONCEIVABLE:
- AI-powered fertility health platform with 847-member Circle community
- Founded by Kirsten Karchmer (20+ years clinical experience, 7,000+ patients)
- Pilot study: 150-260% improvement in conception likelihood (N=105)
- BBT analysis + lifestyle optimization approach

Write a warm, compelling invitation (200-250 words) that:
1. Opens with a personalized hook referencing their specific work
2. Explains why their expertise matters to our community
3. Describes the format (30-45 min conversation, published to 847 members)
4. Highlights mutual benefit (exposure to engaged audience)
5. Ends with a low-pressure ask

Also provide:
- Subject line
- Personalized hook summary (1 sentence)`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedDraft(data.response);
      } else {
        setGeneratedDraft("Unable to generate draft — please check that the API is configured.");
      }
    } catch {
      setGeneratedDraft("Unable to generate draft — please check your connection and try again.");
    } finally {
      setGeneratingDraft(false);
    }
  };

  return (
    <div>
      {/* Pipeline Overview */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Expert Pipeline
          </h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {EXPERT_STATUS_CONFIG.map((status) => {
            const count = experts.filter((e) => e.status === status.key).length;
            return (
              <div
                key={status.key}
                className="flex-1 min-w-[90px] rounded-xl border p-3 text-center"
                style={{
                  borderColor: count > 0 ? `${status.color}40` : "var(--border)",
                  backgroundColor: count > 0 ? `${status.color}08` : "var(--surface)",
                }}
              >
                <p className="text-xl font-bold" style={{ color: count > 0 ? status.color : "var(--muted-light)" }}>
                  {count}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: count > 0 ? status.color : "var(--muted-light)" }}>
                  {status.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expert Database */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Expert Database
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {experts.length} experts tracked
          </span>
        </div>
        <div className="space-y-2">
          {experts.map((expert) => {
            const draft = outreachDrafts.find((d) => d.expertId === expert.id);
            return <ExpertCard key={expert.id} expert={expert} outreachDraft={draft} />;
          })}
        </div>
      </div>

      {/* AI Outreach Draft Generator */}
      <div className="mb-6">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Send size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Outreach Drafts
            </h3>
          </div>

          <div className="space-y-3 mb-4">
            {outreachDrafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    To: {draft.expertName}
                  </p>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: draft.status === "sent" ? "#1EAA5514" : "#9686B914",
                      color: draft.status === "sent" ? "#1EAA55" : "#9686B9",
                    }}
                  >
                    {draft.status}
                  </span>
                </div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--foreground)" }}>
                  Subject: {draft.subject}
                </p>
                <div
                  className="rounded-lg p-2 mb-2"
                  style={{ backgroundColor: `${ACCENT}06`, borderLeft: `2px solid ${ACCENT}` }}
                >
                  <p className="text-[10px] italic" style={{ color: ACCENT }}>
                    Hook: {draft.personalizedHook}
                  </p>
                </div>
                <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {draft.body.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={generatingDraft}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
            style={{ backgroundColor: ACCENT }}
          >
            {generatingDraft ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating Draft...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate New Draft
              </>
            )}
          </button>

          {generatedDraft && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: ACCENT }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Generated Draft
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
              >
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                  {generatedDraft}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interview Scheduling */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Upcoming Interviews
          </h3>
        </div>
        <div className="space-y-2">
          {interviewSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-xl border p-4 flex items-center gap-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{ backgroundColor: `${ACCENT}10` }}
              >
                <p className="text-[9px] font-bold uppercase" style={{ color: ACCENT }}>
                  {new Date(schedule.date).toLocaleDateString("en-US", { month: "short" })}
                </p>
                <p className="text-lg font-bold leading-none" style={{ color: ACCENT }}>
                  {new Date(schedule.date).getDate()}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {schedule.expertName}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {schedule.time} &middot; {schedule.platform}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  {schedule.confirmed ? (
                    <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                  ) : (
                    <Clock size={14} style={{ color: "#F1C028" }} />
                  )}
                  <span className="text-[10px]" style={{ color: schedule.confirmed ? "#1EAA55" : "#F1C028" }}>
                    {schedule.confirmed ? "Confirmed" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {schedule.prepPacketReady ? (
                    <FileText size={14} style={{ color: "#1EAA55" }} />
                  ) : (
                    <FileText size={14} style={{ color: "var(--muted)" }} />
                  )}
                  <span className="text-[10px]" style={{ color: schedule.prepPacketReady ? "#1EAA55" : "var(--muted)" }}>
                    {schedule.prepPacketReady ? "Prep Ready" : "Needs Prep"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prep Packets */}
      {prepPackets.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Prep Packets
            </h3>
          </div>
          {prepPackets.map((packet) => {
            const packetExpanded = expandedPacket === packet.id;
            const expert = experts.find((e) => e.id === packet.expertId);
            return (
              <div
                key={packet.id}
                className="rounded-xl border transition-all"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setExpandedPacket(packetExpanded ? null : packet.id)}
                >
                  {packetExpanded ? (
                    <ChevronDown size={14} style={{ color: ACCENT }} />
                  ) : (
                    <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                  )}
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Prep Packet: {expert?.name || packet.expertId}
                  </p>
                </div>
                {packetExpanded && (
                  <div className="px-4 pb-4 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
                    {/* Suggested Topics */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                        Suggested Topics
                      </p>
                      <div className="space-y-1">
                        {packet.suggestedTopics.map((topic, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ACCENT }} />
                            <p className="text-xs" style={{ color: "var(--foreground)" }}>{topic}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Questions */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#356FB6" }}>
                        Key Questions
                      </p>
                      <div className="space-y-2">
                        {packet.keyQuestions.map((question, i) => (
                          <div
                            key={i}
                            className="rounded-lg p-2.5"
                            style={{ backgroundColor: "var(--background)" }}
                          >
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                              {i + 1}. {question}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Background Notes */}
                    <div className="rounded-lg p-3" style={{ backgroundColor: "#9686B908", borderLeft: "3px solid #9686B9" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9686B9" }}>
                        Background
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {packet.backgroundNotes}
                      </p>
                    </div>

                    {/* Content Repurposing Plan */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#F1C028" }}>
                        Content Repurposing Plan
                      </p>
                      <div className="space-y-1">
                        {packet.contentRepurposingPlan.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <ArrowUpRight size={10} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
                            <p className="text-[11px]" style={{ color: "var(--foreground)" }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Post-Interview Tasks */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Post-Interview Tasks
          </h3>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="space-y-2">
            {postInterviewTasks.map((task) => {
              const typeColors: Record<string, string> = {
                thank_you: "#1EAA55",
                content_repurpose: "#356FB6",
                community_post: "#9686B9",
              };
              const typeLabels: Record<string, string> = {
                thank_you: "Thank You",
                content_repurpose: "Content Repurpose",
                community_post: "Community Post",
              };
              const color = typeColors[task.type];
              const expert = experts.find((e) => e.id === task.expertId);
              return (
                <div key={task.id} className="flex items-center gap-3">
                  <div className="shrink-0">
                    {task.status === "completed" ? (
                      <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
                    ) : task.status === "in_progress" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#356FB6", borderTopColor: "transparent" }} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "var(--border)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs"
                      style={{
                        color: task.status === "completed" ? "var(--muted)" : "var(--foreground)",
                        textDecoration: task.status === "completed" ? "line-through" : "none",
                      }}
                    >
                      {task.task}
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--muted)" }}>
                      {expert?.name} &middot; Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${color}14`, color }}
                  >
                    {typeLabels[task.type]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggest New Experts */}
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Expert Discovery
          </h3>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Use AI to identify new experts who align with Conceivable&apos;s mission and would resonate with our community.
        </p>
        <button
          onClick={handleSuggestExperts}
          disabled={suggestingExperts}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          {suggestingExperts ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Finding Experts...
            </>
          ) : (
            <>
              <Sparkles size={15} />
              Suggest 5 New Experts
            </>
          )}
        </button>

        {suggestedExperts && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={14} style={{ color: ACCENT }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                Suggested Experts
              </p>
            </div>
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                {suggestedExperts}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
