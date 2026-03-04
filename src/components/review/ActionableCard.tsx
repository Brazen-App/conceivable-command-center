"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

export interface ActionableCardProps {
  id: string;
  title: string;
  subtitle?: string;
  detail?: string;
  badges?: { label: string; color: string }[];
  icon?: React.ReactNode;
  children?: React.ReactNode; // Expanded content
  // Actions
  onApprove?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => void; // Opens rejection modal externally
  onDiscuss?: (id: string) => void; // Opens discuss panel externally
  approveLabel?: string;
  // State
  defaultExpanded?: boolean;
  accentColor?: string;
}

export default function ActionableCard({
  id,
  title,
  subtitle,
  detail,
  badges,
  icon,
  children,
  onApprove,
  onReject,
  onDiscuss,
  approveLabel = "Approve",
  defaultExpanded = false,
  accentColor,
}: ActionableCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  if (approved || rejected) {
    return (
      <div
        className="rounded-xl border p-4 transition-opacity"
        style={{
          borderColor: approved ? "#1EAA5530" : "#E24D4730",
          backgroundColor: approved ? "#1EAA5508" : "#E24D4708",
        }}
      >
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: approved ? "#1EAA55" : "#E24D47" }}>
          <CheckCircle2 size={14} />
          {approved ? "Approved and logged" : "Rejected — Joy will learn from this"}
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!onApprove) return;
    setApproving(true);
    try {
      await onApprove(id);
      setApproved(true);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div
      className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      {/* Accent stripe */}
      {accentColor && <div className="h-0.5" style={{ backgroundColor: accentColor }} />}

      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className="shrink-0 mt-0.5">{icon}</div>
          )}
          <div className="flex-1 min-w-0">
            {badges && badges.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {badges.map((badge, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${badge.color}12`, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {title}
            </p>
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="shrink-0">
            {expanded ? (
              <ChevronUp size={16} style={{ color: "var(--muted)" }} />
            ) : (
              <ChevronDown size={16} style={{ color: "var(--muted)" }} />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Detail text or custom children */}
          {detail && (
            <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: "var(--foreground)" }}>
              {detail}
            </p>
          )}
          {children && <div className="mt-3 mb-4">{children}</div>}

          {/* Action buttons */}
          {(onApprove || onReject || onDiscuss) && (
            <div className="flex items-center gap-2 flex-wrap">
              {onApprove && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleApprove(); }}
                  disabled={approving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "#1EAA55" }}
                >
                  {approving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  {approveLabel}
                </button>
              )}
              {onReject && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#E24D47" }}
                >
                  <XCircle size={13} />
                  Reject
                </button>
              )}
              {onDiscuss && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDiscuss(id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                >
                  <MessageCircle size={13} />
                  Discuss with Joy
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper: wraps rejection + discuss state management for any page
export function useActionableState() {
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; title: string; type: string } | null>(null);
  const [discussTarget, setDiscussTarget] = useState<{ id: string; title: string; type: string; detail?: string } | null>(null);

  const handleReject = (id: string, title: string, type: string) => {
    setRejectionTarget({ id, title, type });
  };

  const handleDiscuss = (id: string, title: string, type: string, detail?: string) => {
    setDiscussTarget({ id, title, type, detail });
  };

  const submitRejection = async (reasonCategory: string, reasonText: string) => {
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
    setRejectionTarget(null);
  };

  return {
    rejectionTarget,
    setRejectionTarget,
    discussTarget,
    setDiscussTarget,
    handleReject,
    handleDiscuss,
    submitRejection,
  };
}
