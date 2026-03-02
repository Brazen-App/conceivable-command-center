"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  MousePointerClick,
  Eye,
  ShieldCheck,
  ArrowUpRight,
  Calendar,
  Zap,
} from "lucide-react";

const ACCENT = "#5A6FFF";
const EMAIL_ACCENT = "#E37FB1";

// --- Types ---

interface CampaignSummary {
  id: string;
  name: string;
  sentDate: string;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  status: "sent" | "scheduled" | "draft";
}

// --- Mock Data ---

const LAUNCH_SEQUENCE = {
  totalEmails: 28,
  phases: [
    { name: "Re-engagement", weeks: "Week 1-2", count: 6, color: "#78C3BF" },
    { name: "Education", weeks: "Week 3-4", count: 8, color: "#5A6FFF" },
    { name: "Launch", weeks: "Week 5-6", count: 8, color: "#E37FB1" },
    { name: "Final Push", weeks: "Week 7", count: 4, color: "#E24D47" },
    { name: "Post-Close", weeks: "Week 8", count: 2, color: "#9686B9" },
  ],
  cadence: "8-week sequence",
};

const SUBSCRIBER_COUNT = 28905;

const MAILCHIMP_STATUS = {
  connected: true,
  lastSync: "2026-03-02 09:15 AM",
  listId: "abc123",
};

const CAMPAIGN_AVERAGES = {
  openRate: 32.4,
  clickRate: 4.8,
  unsubscribeRate: 0.12,
};

const RECENT_CAMPAIGNS: CampaignSummary[] = [
  {
    id: "c-01",
    name: "Re-engagement #1: We've Missed You",
    sentDate: "2026-02-28",
    openRate: 38.2,
    clickRate: 5.1,
    unsubscribeRate: 0.08,
    status: "sent",
  },
  {
    id: "c-02",
    name: "Re-engagement #2: What's Changed at Conceivable",
    sentDate: "2026-03-01",
    openRate: 34.7,
    clickRate: 4.6,
    unsubscribeRate: 0.11,
    status: "sent",
  },
  {
    id: "c-03",
    name: "Re-engagement #3: Your Fertility Data, Reimagined",
    sentDate: "",
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    status: "scheduled",
  },
  {
    id: "c-04",
    name: "Education #1: The BBT Breakthrough",
    sentDate: "",
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    status: "draft",
  },
  {
    id: "c-05",
    name: "Education #2: Why Fertility Is a Systems Problem",
    sentDate: "",
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    status: "draft",
  },
];

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      {subtext && (
        <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>
          {subtext}
        </span>
      )}
    </div>
  );
}

export default function MarketingEmailPage() {
  return (
    <div className="space-y-6">
      {/* Launch Sequence Overview */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: `${EMAIL_ACCENT}08`,
          border: `1px solid ${EMAIL_ACCENT}20`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-1"
              style={{ color: EMAIL_ACCENT }}
            >
              Launch Sequence
            </p>
            <p className="text-sm" style={{ color: "var(--foreground)" }}>
              {LAUNCH_SEQUENCE.totalEmails} emails across {LAUNCH_SEQUENCE.cadence}
            </p>
          </div>
          <a
            href="/departments/email"
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: `${EMAIL_ACCENT}14`,
              color: EMAIL_ACCENT,
            }}
          >
            Full Email Department
            <ArrowUpRight size={12} />
          </a>
        </div>

        {/* Phase Bars */}
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {LAUNCH_SEQUENCE.phases.map((phase) => {
            const widthPct = (phase.count / LAUNCH_SEQUENCE.totalEmails) * 100;
            return (
              <div
                key={phase.name}
                className="flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: phase.color,
                  minWidth: "40px",
                }}
                title={`${phase.name}: ${phase.count} emails (${phase.weeks})`}
              >
                {phase.count}
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {LAUNCH_SEQUENCE.phases.map((phase) => {
            const widthPct = (phase.count / LAUNCH_SEQUENCE.totalEmails) * 100;
            return (
              <div
                key={phase.name}
                className="text-[9px] text-center"
                style={{ width: `${widthPct}%`, color: "var(--muted)", minWidth: "40px" }}
              >
                {phase.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={16} style={{ color: EMAIL_ACCENT }} />}
          label="Subscribers"
          value={SUBSCRIBER_COUNT.toLocaleString()}
          color="var(--foreground)"
        />
        <StatCard
          icon={<Eye size={16} style={{ color: "#1EAA55" }} />}
          label="Avg Open Rate"
          value={`${CAMPAIGN_AVERAGES.openRate}%`}
          color="#1EAA55"
        />
        <StatCard
          icon={<MousePointerClick size={16} style={{ color: ACCENT }} />}
          label="Avg Click Rate"
          value={`${CAMPAIGN_AVERAGES.clickRate}%`}
          color={ACCENT}
        />
        <StatCard
          icon={<Zap size={16} style={{ color: "#F1C028" }} />}
          label="Unsub Rate"
          value={`${CAMPAIGN_AVERAGES.unsubscribeRate}%`}
          subtext="industry avg 0.26%"
          color="#F1C028"
        />
      </div>

      {/* Mailchimp Integration */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: MAILCHIMP_STATUS.connected ? "#1EAA55" : "#E24D47",
          }}
        />
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Mailchimp Integration
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {MAILCHIMP_STATUS.connected
              ? `Connected &middot; Last synced ${MAILCHIMP_STATUS.lastSync}`
              : "Not connected"}
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{
            backgroundColor: MAILCHIMP_STATUS.connected ? "#1EAA5514" : "#E24D4714",
            color: MAILCHIMP_STATUS.connected ? "#1EAA55" : "#E24D47",
          }}
        >
          {MAILCHIMP_STATUS.connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>

      {/* Recent Campaigns */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Recent Campaigns
        </p>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {RECENT_CAMPAIGNS.map((campaign, i) => (
            <div
              key={campaign.id}
              className="px-5 py-3 flex items-center gap-3"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
                borderBottom: i < RECENT_CAMPAIGNS.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              {/* Status Icon */}
              {campaign.status === "sent" && (
                <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
              )}
              {campaign.status === "scheduled" && (
                <Clock size={16} style={{ color: "#F1C028" }} />
              )}
              {campaign.status === "draft" && (
                <Mail size={16} style={{ color: "var(--muted)" }} />
              )}

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {campaign.name}
                </p>
                {campaign.sentDate && (
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Sent {campaign.sentDate}
                  </p>
                )}
              </div>

              {/* Metrics */}
              {campaign.status === "sent" && (
                <div className="hidden sm:flex items-center gap-4 text-xs">
                  <span style={{ color: "#1EAA55" }}>
                    {campaign.openRate}% open
                  </span>
                  <span style={{ color: ACCENT }}>
                    {campaign.clickRate}% click
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    campaign.status === "sent"
                      ? "#1EAA5514"
                      : campaign.status === "scheduled"
                      ? "#F1C02814"
                      : "var(--border)",
                  color:
                    campaign.status === "sent"
                      ? "#1EAA55"
                      : campaign.status === "scheduled"
                      ? "#F1C028"
                      : "var(--muted)",
                }}
              >
                {campaign.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Badge */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: "#1EAA5508",
          border: "1px solid #1EAA5520",
        }}
      >
        <ShieldCheck size={20} style={{ color: "#1EAA55" }} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Compliance: All Emails Scanned
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Every email passes automated compliance review before send. No health claims without citations. CAN-SPAM compliant.
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-3 py-1.5 rounded-full shrink-0"
          style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
        >
          ALL CLEAR
        </span>
      </div>
    </div>
  );
}
