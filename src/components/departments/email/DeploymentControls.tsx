"use client";

import { useState } from "react";
import {
  Send,
  Calendar,
  Users,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronRight,
  Rocket,
  Shield,
} from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import { PHASE_CONFIG } from "@/lib/data/launch-emails";

interface Props {
  emails: LaunchEmail[];
  onSchedule: (emailIds: string[], options: ScheduleOptions) => void;
}

interface ScheduleOptions {
  sendTime: "optimal" | "immediate" | "custom";
  customTime?: string;
  segment: string;
  abTest?: {
    enabled: boolean;
    variantSubject?: string;
    splitPercent: number;
  };
}

const SEGMENTS = [
  { id: "full-list", label: "Full List", count: 28905, description: "All 28,905 subscribers" },
  { id: "engaged-2x", label: "2x+ Openers", count: 14200, description: "Opened 2+ re-engagement emails" },
  { id: "engaged-any", label: "Any Openers", count: 19800, description: "Opened at least 1 email" },
  { id: "clicked", label: "Clickers", count: 4100, description: "Clicked a link in any email" },
  { id: "non-openers", label: "Non-Openers", count: 9100, description: "Haven't opened any email" },
  { id: "converted", label: "Signed Up", count: 0, description: "Already joined early access" },
];

const SEND_TIMES = [
  {
    id: "optimal",
    label: "AI-Optimized",
    description: "Tue/Wed 10 AM based on engagement data",
    icon: Zap,
    recommended: true,
  },
  {
    id: "immediate",
    label: "Send Immediately",
    description: "Push to Mailchimp and send now",
    icon: Send,
    recommended: false,
  },
  {
    id: "custom",
    label: "Custom Schedule",
    description: "Choose a specific date and time",
    icon: Calendar,
    recommended: false,
  },
];

export default function DeploymentControls({ emails, onSchedule }: Props) {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [sendTime, setSendTime] = useState<"optimal" | "immediate" | "custom">("optimal");
  const [customTime, setCustomTime] = useState("");
  const [segment, setSegment] = useState("full-list");
  const [abEnabled, setAbEnabled] = useState(false);
  const [abSubject, setAbSubject] = useState("");
  const [abSplit, setAbSplit] = useState(20);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const approvedEmails = emails.filter((e) => e.status === "approved");
  const complianceReady = emails.filter(
    (e) => e.status === "approved" && e.complianceStatus === "approved"
  );
  const pendingEmails = emails.filter((e) => e.status === "pending");

  const toggleEmail = (id: string) => {
    const next = new Set(selectedEmails);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEmails(next);
  };

  const selectPhase = (phase: string) => {
    const phaseEmails = complianceReady.filter((e) => e.phase === phase);
    const next = new Set(selectedEmails);
    const allSelected = phaseEmails.every((e) => next.has(e.id));
    if (allSelected) {
      phaseEmails.forEach((e) => next.delete(e.id));
    } else {
      phaseEmails.forEach((e) => next.add(e.id));
    }
    setSelectedEmails(next);
  };

  const handleSchedule = () => {
    if (selectedEmails.size === 0) return;
    setIsScheduling(true);
    onSchedule(Array.from(selectedEmails), {
      sendTime,
      customTime: sendTime === "custom" ? customTime : undefined,
      segment,
      abTest: abEnabled
        ? { enabled: true, variantSubject: abSubject, splitPercent: abSplit }
        : undefined,
    });
    setTimeout(() => setIsScheduling(false), 2000);
  };

  const selectedSegment = SEGMENTS.find((s) => s.id === segment);

  return (
    <div>
      {/* Readiness Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            backgroundColor: complianceReady.length > 0 ? "#1EAA5508" : "#F1C02808",
            border: `1px solid ${complianceReady.length > 0 ? "#1EAA5520" : "#F1C02820"}`,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>
            {complianceReady.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>
            Ready to Deploy
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            Approved + compliance cleared
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>
            {approvedEmails.length - complianceReady.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#F1C028" }}>
            Needs Compliance
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            CEO approved, awaiting legal
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {pendingEmails.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>
            Not Yet Approved
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            Waiting for CEO review
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Email Selection */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--muted)" }}
          >
            Select Emails to Schedule
          </p>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {(Object.keys(PHASE_CONFIG) as Array<keyof typeof PHASE_CONFIG>).map((phase) => {
              const config = PHASE_CONFIG[phase];
              const phaseEmails = complianceReady.filter((e) => e.phase === phase);
              const isExpanded = expandedPhase === phase;
              const selectedInPhase = phaseEmails.filter((e) => selectedEmails.has(e.id)).length;

              return (
                <div key={phase}>
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: `${config.color}06`,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} style={{ color: config.color }} />
                    ) : (
                      <ChevronRight size={14} style={{ color: config.color }} />
                    )}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-xs font-semibold flex-1 text-left" style={{ color: "var(--foreground)" }}>
                      {config.label}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {phaseEmails.length} ready
                      {selectedInPhase > 0 && (
                        <span className="ml-1 font-bold" style={{ color: config.color }}>
                          ({selectedInPhase} selected)
                        </span>
                      )}
                    </span>
                    {phaseEmails.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectPhase(phase);
                        }}
                        className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${config.color}14`, color: config.color }}
                      >
                        {phaseEmails.every((em) => selectedEmails.has(em.id)) ? "Deselect" : "Select All"}
                      </button>
                    )}
                  </button>
                  {isExpanded && (
                    <div style={{ borderBottom: "1px solid var(--border)" }}>
                      {phaseEmails.length === 0 ? (
                        <p
                          className="px-4 py-3 text-xs"
                          style={{ color: "var(--muted)", backgroundColor: "var(--surface)" }}
                        >
                          No emails in this phase are ready for deployment.
                        </p>
                      ) : (
                        phaseEmails.map((email) => (
                          <label
                            key={email.id}
                            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-black/[0.02]"
                            style={{ backgroundColor: "var(--surface)" }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedEmails.has(email.id)}
                              onChange={() => toggleEmail(email.id)}
                              className="rounded"
                              style={{ accentColor: config.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                                {email.subject}
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                                W{email.week}-S{email.sequence} &middot; {email.segment}
                              </p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedEmails.size > 0 && (
            <p className="text-xs mt-2 font-medium" style={{ color: "#E37FB1" }}>
              {selectedEmails.size} email{selectedEmails.size > 1 ? "s" : ""} selected for deployment
            </p>
          )}
        </div>

        {/* Right: Configuration */}
        <div className="space-y-4">
          {/* Send Time */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} style={{ color: "#E37FB1" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                Send Time
              </p>
            </div>
            <div className="space-y-2">
              {SEND_TIMES.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                    style={{
                      backgroundColor:
                        sendTime === option.id ? "#E37FB108" : "var(--background)",
                      border: `1px solid ${sendTime === option.id ? "#E37FB130" : "transparent"}`,
                    }}
                  >
                    <input
                      type="radio"
                      name="sendTime"
                      checked={sendTime === option.id}
                      onChange={() => setSendTime(option.id as typeof sendTime)}
                      className="mt-0.5"
                      style={{ accentColor: "#E37FB1" }}
                    />
                    <Icon size={14} style={{ color: "#E37FB1" }} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                        {option.label}
                        {option.recommended && (
                          <span
                            className="ml-1.5 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                          >
                            Recommended
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {option.description}
                      </p>
                    </div>
                  </label>
                );
              })}
              {sendTime === "custom" && (
                <input
                  type="datetime-local"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full text-xs border rounded-lg px-3 py-2 mt-2"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                />
              )}
            </div>
          </div>

          {/* Segment */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} style={{ color: "#5A6FFF" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                Target Segment
              </p>
            </div>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full text-xs border rounded-lg px-3 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            >
              {SEGMENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.count.toLocaleString()})
                </option>
              ))}
            </select>
            {selectedSegment && (
              <p className="text-[10px] mt-1.5" style={{ color: "var(--muted)" }}>
                {selectedSegment.description}
              </p>
            )}
          </div>

          {/* A/B Test */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers size={14} style={{ color: "#9686B9" }} />
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  A/B Testing
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {abEnabled ? "On" : "Off"}
                </span>
                <div
                  className="w-8 h-4 rounded-full relative cursor-pointer transition-colors"
                  style={{ backgroundColor: abEnabled ? "#9686B9" : "var(--border)" }}
                  onClick={() => setAbEnabled(!abEnabled)}
                >
                  <div
                    className="w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all"
                    style={{ left: abEnabled ? "18px" : "2px" }}
                  />
                </div>
              </label>
            </div>
            {abEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
                    Variant Subject Line
                  </label>
                  <input
                    type="text"
                    value={abSubject}
                    onChange={(e) => setAbSubject(e.target.value)}
                    placeholder="Alternative subject line to test..."
                    className="w-full text-xs border rounded-lg px-3 py-2 mt-1"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
                    Test Split: {abSplit}% test / {100 - abSplit}% winner
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={abSplit}
                    onChange={(e) => setAbSplit(Number(e.target.value))}
                    className="w-full mt-1"
                    style={{ accentColor: "#9686B9" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleSchedule}
            disabled={selectedEmails.size === 0 || isScheduling}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedEmails.size > 0 ? "#E37FB1" : "var(--muted)",
            }}
          >
            {isScheduling ? (
              <>
                <Clock size={16} className="animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Rocket size={16} />
                Schedule {selectedEmails.size} Email{selectedEmails.size !== 1 ? "s" : ""} in Mailchimp
              </>
            )}
          </button>

          {selectedEmails.size > 0 && (
            <div
              className="rounded-lg p-3 flex items-start gap-2"
              style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}
            >
              <AlertTriangle size={14} style={{ color: "#F1C028" }} className="mt-0.5 shrink-0" />
              <p className="text-[11px]" style={{ color: "var(--foreground)" }}>
                This will create {selectedEmails.size} campaign{selectedEmails.size !== 1 ? "s" : ""} in Mailchimp
                targeting {selectedSegment?.count.toLocaleString()} subscribers.
                {sendTime === "immediate" ? " Emails will send immediately." : " Emails will be scheduled."}
              </p>
            </div>
          )}

          {/* Pre-flight checklist */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} style={{ color: "#1EAA55" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                Pre-Flight Checklist
              </p>
            </div>
            <div className="space-y-1.5">
              {[
                {
                  label: "Selected emails are CEO-approved",
                  done: selectedEmails.size > 0 && Array.from(selectedEmails).every(
                    (id) => emails.find((e) => e.id === id)?.status === "approved"
                  ),
                },
                {
                  label: "Compliance scan passed",
                  done: selectedEmails.size > 0 && Array.from(selectedEmails).every(
                    (id) => emails.find((e) => e.id === id)?.complianceStatus === "approved"
                  ),
                },
                {
                  label: "Segment selected",
                  done: !!segment,
                },
                {
                  label: "Send time configured",
                  done: sendTime !== "custom" || !!customTime,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircle2 size={12} style={{ color: "#1EAA55" }} />
                  ) : (
                    <Clock size={12} style={{ color: "var(--muted)" }} />
                  )}
                  <span
                    className="text-[11px]"
                    style={{ color: item.done ? "var(--foreground)" : "var(--muted)" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
