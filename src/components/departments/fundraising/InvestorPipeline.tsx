"use client";

import { useState } from "react";
import {
  Crown,
  Building2,
  Handshake,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
  CalendarCheck,
  Plus,
  X,
  Users,
  Target,
  CheckCircle2,
} from "lucide-react";
import type {
  Investor,
  MeetingNote,
  PipelineStage,
  PIPELINE_STAGES,
} from "@/lib/data/fundraising-data";

const ACCENT = "#356FB6";

interface Props {
  movementBoard: Investor[];
  ventureInvestors: Investor[];
  strategicPartners: Investor[];
  meetingNotes: MeetingNote[];
  pipelineStages: typeof PIPELINE_STAGES;
}

const TIER_CONFIG = {
  movement: {
    label: "TIER 1 — MOVEMENT BOARD",
    subtitle: "Strategic capital from people who can 10x the mission",
    icon: Crown,
    color: "#F1C028",
  },
  venture: {
    label: "TIER 2 — VENTURE CAPITAL",
    subtitle: "Traditional Series A investors",
    icon: Building2,
    color: ACCENT,
  },
  strategic: {
    label: "TIER 3 — STRATEGIC PARTNERS",
    subtitle: "Distribution and credibility, not just capital",
    icon: Handshake,
    color: "#1EAA55",
  },
};

function StageBadge({ stage, stages }: { stage: PipelineStage; stages: typeof PIPELINE_STAGES }) {
  const conf = stages.find((s) => s.key === stage);
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

function daysAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function daysUntil(dateStr: string): string {
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Overdue";
  if (days === 1) return "Tomorrow";
  return `In ${days}d`;
}

// ── Movement Board Card (rich detail) ──
function MovementCard({ investor, stages }: { investor: Investor; stages: typeof PIPELINE_STAGES }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
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
            <StageBadge stage={investor.stage} stages={stages} />
            {investor.firm && (
              <span className="text-[10px] font-mono" style={{ color: "var(--muted-light)" }}>
                {investor.firm}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {investor.name}
          </p>
          {investor.checkSize && (
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
              Check size: {investor.checkSize}
            </p>
          )}
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#F1C02814" }}
        >
          <Crown size={14} style={{ color: "#F1C028" }} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
          {/* Thesis alignment */}
          <div className="rounded-lg p-3 mt-3 text-xs leading-relaxed" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
            {investor.thesisAlignment}
          </div>

          {/* Recent Activity */}
          {investor.recentActivity && (
            <div className="rounded-lg p-3" style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                Recent Activity
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {investor.recentActivity}
              </p>
            </div>
          )}

          {/* Foundation Priorities */}
          {investor.foundationPriorities && investor.foundationPriorities.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                Foundation Priorities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {investor.foundationPriorities.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warm Connection Path */}
          {investor.warmConnectionPath && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: "#1EAA55" }}>
                <MapPin size={10} /> Warm Connection Path
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {investor.warmConnectionPath}
              </p>
            </div>
          )}

          {/* Public Statements */}
          {investor.publicStatements && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "#9686B908", borderLeft: "3px solid #9686B9" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#9686B9" }}>
                Public Statements
              </p>
              <p className="text-xs italic leading-relaxed" style={{ color: "var(--foreground)" }}>
                {investor.publicStatements}
              </p>
            </div>
          )}

          {/* Next Action */}
          {investor.nextAction && (
            <div className="flex items-start gap-2 rounded-lg p-3" style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}>
              <ArrowRight size={12} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#F1C028" }}>
                  Next Action
                </p>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>{investor.nextAction}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {investor.notes && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "#E24D4708", borderLeft: "3px solid #E24D47" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#E24D47" }}>
                Strategic Note
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {investor.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Venture / Strategic Card ──
function InvestorCard({
  investor,
  stages,
  meetingNotes,
}: {
  investor: Investor;
  stages: typeof PIPELINE_STAGES;
  meetingNotes: MeetingNote[];
}) {
  const [expanded, setExpanded] = useState(false);
  const notes = meetingNotes.filter((n) => n.investorId === investor.id);
  const tierConf = TIER_CONFIG[investor.tier];

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
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
            <StageBadge stage={investor.stage} stages={stages} />
            {investor.firm && (
              <span className="text-[10px] font-mono" style={{ color: "var(--muted-light)" }}>
                {investor.firm}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {investor.name}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {investor.checkSize && (
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {investor.checkSize}
              </span>
            )}
            {investor.lastContactDate && (
              <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted)" }}>
                <Clock size={9} /> {daysAgo(investor.lastContactDate)}
              </span>
            )}
          </div>
        </div>
        {investor.nextActionDate && (
          <div className="text-right shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-light)" }}>
              Next Action
            </p>
            <p className="text-[11px] font-medium" style={{ color: ACCENT }}>
              {daysUntil(investor.nextActionDate)}
            </p>
          </div>
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
          {/* Thesis */}
          {investor.thesisAlignment && (
            <div className="rounded-lg p-3 mt-3 text-xs leading-relaxed" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
              {investor.thesisAlignment}
            </div>
          )}

          {/* Portfolio (venture) */}
          {investor.portfolio && investor.portfolio.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                Portfolio Companies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {investor.portfolio.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Value (strategic partners) */}
          {investor.strategicValue && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#1EAA55" }}>
                Strategic Value
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {investor.strategicValue}
              </p>
            </div>
          )}

          {/* Partnership Type */}
          {investor.partnershipType && (
            <div className="flex items-center gap-2">
              <Handshake size={12} style={{ color: ACCENT }} />
              <span className="text-xs font-medium" style={{ color: ACCENT }}>{investor.partnershipType}</span>
            </div>
          )}

          {/* Next Action */}
          {investor.nextAction && (
            <div className="flex items-start gap-2 rounded-lg p-3" style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}>
              <ArrowRight size={12} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: ACCENT }}>Next Action</p>
                <p className="text-xs" style={{ color: "var(--foreground)" }}>{investor.nextAction}</p>
              </div>
            </div>
          )}

          {/* Meeting Notes */}
          {notes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "var(--muted)" }}>
                <MessageSquare size={10} /> Meeting Notes
              </p>
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg border p-3 space-y-2" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--muted)" }}>
                    <CalendarCheck size={10} />
                    {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    <span>&middot;</span>
                    <span>{note.attendees}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {note.summary}
                  </p>
                  {note.keyTakeaways.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                        Key Takeaways
                      </p>
                      <div className="space-y-1">
                        {note.keyTakeaways.map((t, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ACCENT }} />
                            <p className="text-[11px]" style={{ color: "var(--foreground)" }}>{t}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {note.followUps.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                        Follow-Ups
                      </p>
                      <div className="space-y-1">
                        {note.followUps.map((f) => (
                          <div key={f.id} className="flex items-center gap-2 text-[11px]">
                            {f.status === "done" ? (
                              <CheckCircle2 size={11} style={{ color: "#1EAA55" }} />
                            ) : (
                              <div className="w-3 h-3 rounded-full border" style={{ borderColor: "#F1C028" }} />
                            )}
                            <span
                              className="flex-1"
                              style={{
                                color: f.status === "done" ? "var(--muted)" : "var(--foreground)",
                                textDecoration: f.status === "done" ? "line-through" : "none",
                              }}
                            >
                              {f.task}
                            </span>
                            <span className="text-[9px] shrink-0" style={{ color: "var(--muted-light)" }}>
                              {f.assignee} &middot; {daysUntil(f.dueDate)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {investor.notes && (
            <p className="text-[11px] italic leading-relaxed" style={{ color: "var(--muted)" }}>
              {investor.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pipeline Kanban (compact horizontal view) ──
function PipelineBoard({
  investors,
  stages,
}: {
  investors: Investor[];
  stages: typeof PIPELINE_STAGES;
}) {
  const activeStages = stages.filter((s) => s.key !== "passed");

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Target size={14} style={{ color: ACCENT }} />
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
          Pipeline Overview
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {activeStages.map((stage) => {
          const count = investors.filter((i) => i.stage === stage.key).length;
          return (
            <div
              key={stage.key}
              className="flex-1 min-w-[100px] rounded-xl border p-3 text-center"
              style={{
                borderColor: count > 0 ? `${stage.color}40` : "var(--border)",
                backgroundColor: count > 0 ? `${stage.color}08` : "var(--surface)",
              }}
            >
              <p className="text-xl font-bold" style={{ color: count > 0 ? stage.color : "var(--muted-light)" }}>
                {count}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: count > 0 ? stage.color : "var(--muted-light)" }}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ──
export default function InvestorPipeline({
  movementBoard,
  ventureInvestors,
  strategicPartners,
  meetingNotes,
  pipelineStages,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const allInvestors = [...movementBoard, ...ventureInvestors, ...strategicPartners];

  return (
    <div>
      {/* Pipeline Kanban */}
      <PipelineBoard investors={allInvestors} stages={pipelineStages} />

      {/* Add Investor button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={14} style={{ color: ACCENT }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            {allInvestors.length} investors tracked across 3 tiers
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          {showAddForm ? <X size={12} /> : <Plus size={12} />}
          {showAddForm ? "Cancel" : "Add Investor"}
        </button>
      </div>

      {/* Add Investor Form */}
      {showAddForm && (
        <div
          className="rounded-xl border p-5 mb-6"
          style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}04` }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Add New Investor
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                placeholder="Investor name"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
                Firm
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                placeholder="Firm / Fund name"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
                Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <option value="angel">Angel</option>
                <option value="seed">Seed</option>
                <option value="series_a">Series A</option>
                <option value="strategic">Strategic</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
                Tier
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <option value="movement">Tier 1 — Movement Board</option>
                <option value="venture">Tier 2 — Venture Capital</option>
                <option value="strategic">Tier 3 — Strategic Partner</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                placeholder="Thesis alignment, connection path, context..."
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Add to Pipeline
            </button>
          </div>
        </div>
      )}

      {/* TIER 1 — Movement Board */}
      <div className="mb-8">
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: `linear-gradient(135deg, #F1C028 0%, #2A2828 100%)` }}
        >
          <div className="flex items-center gap-3 mb-1">
            <Crown className="text-white" size={20} strokeWidth={2} />
            <div>
              <p className="text-white font-semibold text-sm">{TIER_CONFIG.movement.label}</p>
              <p className="text-white/60 text-xs">{TIER_CONFIG.movement.subtitle}</p>
            </div>
          </div>
          <p className="text-white/40 text-[10px] mt-2">
            Not a wish list — a plan with mapped paths. These are people investing heavily in women&apos;s health who would amplify Conceivable&apos;s reach to millions.
          </p>
        </div>
        <div className="space-y-3">
          {movementBoard.map((investor) => (
            <MovementCard key={investor.id} investor={investor} stages={pipelineStages} />
          ))}
        </div>
      </div>

      {/* TIER 2 — Venture Capital */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            {TIER_CONFIG.venture.label}
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {ventureInvestors.length} firms tracked
          </span>
        </div>
        <div className="space-y-3">
          {ventureInvestors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} stages={pipelineStages} meetingNotes={meetingNotes} />
          ))}
        </div>
      </div>

      {/* TIER 3 — Strategic Partners */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Handshake size={14} style={{ color: "#1EAA55" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            {TIER_CONFIG.strategic.label}
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {strategicPartners.length} partners tracked
          </span>
        </div>
        <div className="space-y-3">
          {strategicPartners.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} stages={pipelineStages} meetingNotes={meetingNotes} />
          ))}
        </div>
      </div>
    </div>
  );
}
