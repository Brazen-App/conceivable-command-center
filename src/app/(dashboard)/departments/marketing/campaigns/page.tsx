"use client";

import { useState } from "react";
import {
  Mail,
  Eye,
  Clock,
  CheckCircle2,
  Send,
  ChevronDown,
  ChevronUp,
  Tag,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { NURTURE_EMAILS, type NurtureEmail } from "@/lib/data/nurture-emails";

const STATUS_CONFIG: Record<
  NurtureEmail["status"],
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  draft: {
    label: "Draft",
    color: "#6B7280",
    bg: "#6B728014",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "#5A6FFF",
    bg: "#5A6FFF14",
    icon: CheckCircle2,
  },
  scheduled: {
    label: "Scheduled",
    color: "#F1C028",
    bg: "#F1C02814",
    icon: Calendar,
  },
  sent: {
    label: "Sent",
    color: "#1EAA55",
    bg: "#1EAA5514",
    icon: Send,
  },
};

function EmailPreviewModal({
  email,
  onClose,
}: {
  email: NurtureEmail;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ backgroundColor: "var(--surface)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "#5A6FFF14",
                  color: "#5A6FFF",
                }}
              >
                Email {email.emailNumber}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--muted)" }}
              >
                Day {email.sendDay}
              </span>
            </div>
            <h3 className="text-base font-semibold truncate" style={{ color: "var(--foreground)" }}>
              {email.subject}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {email.previewText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0 ml-4"
          >
            <X size={18} style={{ color: "var(--muted)" }} />
          </button>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Simulated email chrome */}
          <div
            className="rounded-xl p-5 mb-4"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: "#5A6FFF" }}
              >
                KK
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Kirsten Karchmer
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  kirsten@conceivable.com
                </p>
              </div>
            </div>
            <div
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-body)",
              }}
            >
              {email.body}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t flex items-center justify-between shrink-0"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--background)",
          }}
        >
          <div className="flex gap-1.5 flex-wrap">
            {email.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--border-light)",
                  color: "var(--muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#5A6FFF" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailRow({
  email,
  isExpanded,
  onToggle,
  onPreview,
}: {
  email: NurtureEmail;
  isExpanded: boolean;
  onToggle: () => void;
  onPreview: () => void;
}) {
  const statusCfg = STATUS_CONFIG[email.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-light)",
      }}
    >
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
        onClick={onToggle}
      >
        {/* Day badge */}
        <div
          className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #5A6FFF12, #ACB7FF18)",
            border: "1px solid #5A6FFF20",
          }}
        >
          <span className="text-[9px] font-medium uppercase" style={{ color: "var(--muted)" }}>
            Day
          </span>
          <span className="text-lg font-bold leading-none" style={{ color: "#5A6FFF" }}>
            {email.sendDay}
          </span>
        </div>

        {/* Subject + preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "#5A6FFF10", color: "#5A6FFF" }}
            >
              #{email.emailNumber}
            </span>
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: "var(--foreground)" }}
            >
              {email.subject}
            </h3>
          </div>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--muted)" }}
          >
            {email.previewText}
          </p>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: statusCfg.bg }}
        >
          <StatusIcon size={12} style={{ color: statusCfg.color }} />
          <span
            className="text-xs font-medium"
            style={{ color: statusCfg.color }}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Preview button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0"
          title="Preview email"
        >
          <Eye size={16} style={{ color: "var(--muted)" }} />
        </button>

        {/* Expand toggle */}
        <div className="shrink-0">
          {isExpanded ? (
            <ChevronUp size={16} style={{ color: "var(--muted)" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "var(--muted)" }} />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className="px-4 pb-4 pt-1"
          style={{ borderTop: "1px solid var(--border-light)" }}
        >
          {/* Tags */}
          <div className="flex items-center gap-2 mb-3">
            <Tag size={12} style={{ color: "var(--muted)" }} />
            <div className="flex gap-1.5 flex-wrap">
              {email.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--border-light)",
                    color: "var(--muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Body preview (first ~300 chars) */}
          <div
            className="text-sm leading-relaxed rounded-lg p-3"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border-light)",
            }}
          >
            <p className="whitespace-pre-wrap">
              {email.body.slice(0, 300).trim()}...
            </p>
          </div>

          {/* Action */}
          <div className="flex justify-end mt-3">
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#5A6FFF" }}
            >
              <Eye size={14} />
              Read Full Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState<NurtureEmail | null>(null);

  const totalEmails = NURTURE_EMAILS.length;
  const drafts = NURTURE_EMAILS.filter((e) => e.status === "draft").length;
  const approved = NURTURE_EMAILS.filter((e) => e.status === "approved").length;
  const sent = NURTURE_EMAILS.filter((e) => e.status === "sent").length;
  const totalDays = NURTURE_EMAILS[NURTURE_EMAILS.length - 1]?.sendDay ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} style={{ color: "#5A6FFF" }} />
            <h2
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.04em",
                color: "var(--foreground)",
              }}
            >
              Early Access Nurture Sequence
            </h2>
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            10-email nurture campaign for quiz completers. Delivers over {totalDays} days.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Emails"
          value={totalEmails}
          icon={Mail}
          color="#5A6FFF"
        />
        <StatCard
          label="Campaign Length"
          value={`${totalDays} days`}
          icon={Calendar}
          color="#9686B9"
        />
        <StatCard
          label="Drafts"
          value={drafts}
          icon={Clock}
          color="#F1C028"
        />
        <StatCard
          label="Sent"
          value={sent}
          icon={Send}
          color="#1EAA55"
        />
      </div>

      {/* Sequence Timeline */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={14} style={{ color: "#5A6FFF" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Sequence Timeline
          </h3>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {NURTURE_EMAILS.map((email, i) => {
            const statusCfg = STATUS_CONFIG[email.status];
            return (
              <div key={email.id} className="flex items-center">
                <button
                  onClick={() => setPreviewEmail(email)}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors min-w-[64px]"
                  title={email.subject}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: statusCfg.color }}
                  >
                    {email.emailNumber}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    Day {email.sendDay}
                  </span>
                </button>
                {i < NURTURE_EMAILS.length - 1 && (
                  <div
                    className="w-4 h-px shrink-0"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-2">
        {NURTURE_EMAILS.map((email) => (
          <EmailRow
            key={email.id}
            email={email}
            isExpanded={expandedId === email.id}
            onToggle={() =>
              setExpandedId(expandedId === email.id ? null : email.id)
            }
            onPreview={() => setPreviewEmail(email)}
          />
        ))}
      </div>

      {/* Referral Stats Placeholder */}
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-light)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} style={{ color: "#E37FB1" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Referral Performance
          </h3>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Referral tracking will activate once emails begin sending. Each email includes a
          personalized referral link via the <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "var(--border-light)" }}>*|REFERRAL_LINK|*</code> merge tag.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>--</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Total Referrals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>--</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Conversion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>--</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Top Referrer</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewEmail && (
        <EmailPreviewModal
          email={previewEmail}
          onClose={() => setPreviewEmail(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: typeof Mail;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
        {value}
      </p>
    </div>
  );
}
