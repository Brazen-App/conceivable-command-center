"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Flame,
  Rocket,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Heart,
  Play,
  Pause,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  Mail,
  RefreshCw,
} from "lucide-react";
import { FLOW_CONFIGS, WARMUP_SCHEDULE, getEmailFlowType } from "@/lib/data/email-flows";
import type { FlowType } from "@/lib/data/email-flows";

// Email shape from the API (includes flow field from DB)
interface DBEmail {
  id: string;
  week: number;
  sequence: number;
  phase: string;
  flow: string;
  subject: string;
  preview: string;
  status: string;
  complianceStatus: string;
  mailchimpId: string | null;
  scheduledDate: string | null;
  delayDays: number | null;
  delayHours: number | null;
}

interface MailchimpCampaign {
  id: string;
  title: string;
  subject: string;
  sendTime: string;
  emailsSent: number;
  openRate: number;
  clickRate: number;
  unsubscribed: number;
}

interface Props {
  // Accept any[] since the API returns full DB objects
  emails: DBEmail[];
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; color: string; label: string }> = {
    sending: { bg: "#1EAA5518", color: "#1EAA55", label: "Active" },
    paused: { bg: "#F1C02818", color: "#B8930A", label: "Paused" },
    save: { bg: "#ACB7FF18", color: "#5A6FFF", label: "Draft" },
    campaign: { bg: "#E37FB118", color: "#E37FB1", label: "Campaign (not automation)" },
    none: { bg: "#E24D4710", color: "#E24D47", label: "Not Set Up" },
  };
  const c = configs[status] || configs.none;
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

export default function AutomationManager({ emails }: Props) {
  const [campaignData, setCampaignData] = useState<MailchimpCampaign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFlow, setExpandedFlow] = useState<FlowType | null>("warmup");
  const [showPerformance, setShowPerformance] = useState<FlowType | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/email/stats");
      if (res.ok) {
        const data = await res.json();
        setCampaignData(data.campaignDetails || []);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Group emails by flow type
  const emailsByFlow: Record<FlowType, DBEmail[]> = {
    warmup: [],
    "launch-campaign": [],
    "post-purchase": [],
    "abandoned-cart": [],
    "post-download": [],
    "post-download-nudge": [],
  };

  emails.forEach((email) => {
    const flowType = getEmailFlowType(email);
    if (emailsByFlow[flowType]) {
      emailsByFlow[flowType].push(email);
    }
  });

  // Match campaign data to emails by mailchimpId
  function getCampaignForEmail(mailchimpId: string | null): MailchimpCampaign | null {
    if (!mailchimpId || !campaignData) return null;
    return campaignData.find((c) => c.id === mailchimpId) || null;
  }

  // Get aggregate stats for a flow
  function getFlowStats(flowEmails: DBEmail[]) {
    const withCampaigns = flowEmails
      .map((e) => getCampaignForEmail(e.mailchimpId))
      .filter(Boolean) as MailchimpCampaign[];

    if (withCampaigns.length === 0) return null;

    const totalSent = withCampaigns.reduce((s, c) => s + c.emailsSent, 0);
    const avgOpen = withCampaigns.reduce((s, c) => s + c.openRate, 0) / withCampaigns.length;
    const avgClick = withCampaigns.reduce((s, c) => s + c.clickRate, 0) / withCampaigns.length;
    const totalUnsub = withCampaigns.reduce((s, c) => s + c.unsubscribed, 0);

    return {
      campaigns: withCampaigns.length,
      totalSent,
      avgOpen: Math.round(avgOpen * 10) / 10,
      avgClick: Math.round(avgClick * 10) / 10,
      totalUnsub,
    };
  }

  // Generate warmup schedule dates (every 3 days starting from next available day)
  function getWarmupDates(count: number): string[] {
    const dates: string[] = [];
    const start = new Date();
    start.setDate(start.getDate() + 2); // Start in 2 days to allow review

    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i * 3);
      dates.push(
        d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      );
    }
    return dates;
  }

  const flowOrder: FlowType[] = [
    "warmup",
    "post-purchase",
    "post-download",
    "post-download-nudge",
    "abandoned-cart",
    "launch-campaign",
  ];

  const warmupEmails = emailsByFlow.warmup.sort(
    (a, b) => a.week - b.week || a.sequence - b.sequence
  );
  const warmupDates = getWarmupDates(warmupEmails.length);

  // Count totals
  const totalAutomationEmails =
    emailsByFlow.warmup.length +
    emailsByFlow["post-purchase"].length +
    emailsByFlow["post-download"].length +
    emailsByFlow["post-download-nudge"].length +
    emailsByFlow["abandoned-cart"].length;
  const totalCampaignEmails = emailsByFlow["launch-campaign"].length;

  if (loading) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: "#E37FB1" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Loading email data from Mailchimp...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Problem statement */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "#E24D4708",
          border: "1px solid #E24D4720",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "#E24D47" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Current state: All emails are individual campaigns — no automations exist
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {emails.length} emails are set up as individual Mailchimp campaigns under &quot;Warmup.&quot;
              They need to be converted to proper automations. Below is the planned structure — {totalAutomationEmails} emails
              should be automations, {totalCampaignEmails} should remain as scheduled campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className="rounded-xl p-3 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {emails.length}
          </p>
          <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>
            Total Emails
          </p>
        </div>
        <div
          className="rounded-xl p-3 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xl font-bold" style={{ color: "#78C3BF" }}>
            {totalAutomationEmails}
          </p>
          <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>
            → Automations
          </p>
        </div>
        <div
          className="rounded-xl p-3 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xl font-bold" style={{ color: "#E37FB1" }}>
            {totalCampaignEmails}
          </p>
          <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>
            → Campaigns
          </p>
        </div>
        <div
          className="rounded-xl p-3 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xl font-bold" style={{ color: "#E24D47" }}>
            0
          </p>
          <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>
            Automations in MC
          </p>
        </div>
      </div>

      {/* Flow cards */}
      {flowOrder.map((flowId) => {
        const config = FLOW_CONFIGS[flowId];
        const flowEmails = emailsByFlow[flowId];
        const isExpanded = expandedFlow === flowId;
        const isAutomation = config.type === "automation";
        const isWarmup = flowId === "warmup";
        const flowStats = getFlowStats(flowEmails);
        const hasMailchimpCampaigns = flowEmails.some((e) => e.mailchimpId);

        return (
          <div
            key={flowId}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            {/* Flow header */}
            <button
              type="button"
              onClick={() => setExpandedFlow(isExpanded ? null : flowId)}
              className="w-full px-5 py-4 flex items-center gap-3 text-left hover:opacity-90 transition-opacity"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${config.color}14` }}
              >
                {flowId === "warmup" && <Flame size={18} style={{ color: config.color }} />}
                {flowId === "launch-campaign" && <Rocket size={18} style={{ color: config.color }} />}
                {flowId === "post-purchase" && <ShoppingBag size={18} style={{ color: config.color }} />}
                {flowId === "abandoned-cart" && <ShoppingCart size={18} style={{ color: config.color }} />}
                {flowId === "post-download" && <Smartphone size={18} style={{ color: config.color }} />}
                {flowId === "post-download-nudge" && <Heart size={18} style={{ color: config.color }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {config.name}
                  </span>
                  <StatusBadge status={hasMailchimpCampaigns ? "campaign" : "none"} />
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isAutomation ? "#78C3BF10" : "#E37FB110",
                      color: isAutomation ? "#78C3BF" : "#E37FB1",
                    }}
                  >
                    Should be: {config.type}
                  </span>
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                  {config.description}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                  {flowEmails.length} emails
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                )}
              </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div
                className="px-5 pb-5 pt-0 space-y-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {/* Config info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                      Trigger
                    </p>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {config.trigger}
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                      Cadence
                    </p>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {config.cadence}
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
                    <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                      Current Status
                    </p>
                    <p className="text-xs font-medium" style={{ color: "#E24D47" }}>
                      {hasMailchimpCampaigns
                        ? "Individual campaigns (needs conversion)"
                        : "Not in Mailchimp"}
                    </p>
                  </div>
                </div>

                {/* Warmup schedule preview */}
                {isWarmup && warmupEmails.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} style={{ color: config.color }} />
                      <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        Planned Warmup Schedule — Every 3 Days at {WARMUP_SCHEDULE.sendTime}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {warmupEmails.map((email, idx) => {
                        const tier =
                          WARMUP_SCHEDULE.rampStrategy[
                            Math.min(
                              Math.floor(idx / Math.ceil(warmupEmails.length / WARMUP_SCHEDULE.rampStrategy.length)),
                              WARMUP_SCHEDULE.rampStrategy.length - 1
                            )
                          ];
                        const campaign = getCampaignForEmail(email.mailchimpId);

                        return (
                          <div
                            key={email.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                            style={{ backgroundColor: `${config.color}06` }}
                          >
                            <span
                              className="text-[10px] font-mono w-20 shrink-0"
                              style={{ color: config.color }}
                            >
                              {warmupDates[idx] || "TBD"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium truncate"
                                style={{ color: "var(--foreground)" }}
                              >
                                {email.subject}
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                                {email.phase} · W{email.week}S{email.sequence}
                                {tier ? ` · ${tier.name} (${tier.size.toLocaleString()})` : ""}
                              </p>
                            </div>
                            {campaign && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                              >
                                {campaign.openRate}% open
                              </span>
                            )}
                            {!campaign && email.mailchimpId && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                              >
                                Has campaign
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Ramp strategy visualization */}
                    <div
                      className="mt-3 rounded-lg p-3"
                      style={{ backgroundColor: "#78C3BF06", border: "1px solid #78C3BF15" }}
                    >
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                        style={{ color: "#78C3BF" }}
                      >
                        Audience Ramp Strategy
                      </p>
                      <div className="grid grid-cols-7 gap-1">
                        {WARMUP_SCHEDULE.rampStrategy.map((tier) => (
                          <div key={tier.name} className="text-center">
                            <div className="h-12 rounded-sm mx-auto mb-1 flex items-end justify-center">
                              <div
                                className="w-full rounded-t-sm"
                                style={{
                                  backgroundColor: "#78C3BF",
                                  height: `${(tier.size / 29000) * 100}%`,
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                            <p className="text-[8px] font-bold" style={{ color: "var(--foreground)" }}>
                              {(tier.size / 1000).toFixed(0)}K
                            </p>
                            <p className="text-[7px]" style={{ color: "var(--muted)" }}>
                              {tier.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Non-warmup email list */}
                {!isWarmup && flowEmails.length > 0 && (
                  <div className="space-y-1.5">
                    {flowEmails
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((email) => {
                        const campaign = getCampaignForEmail(email.mailchimpId);
                        return (
                          <div
                            key={email.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                            style={{ backgroundColor: `${config.color}06` }}
                          >
                            <Mail size={12} style={{ color: config.color }} />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium truncate"
                                style={{ color: "var(--foreground)" }}
                              >
                                {email.subject}
                              </p>
                              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                                {email.phase}
                                {email.delayDays != null ? ` · Day ${email.delayDays}` : ""}
                                {email.delayHours != null ? ` · ${email.delayHours}hrs` : ""}
                              </p>
                            </div>
                            {campaign && (
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                              >
                                {campaign.openRate}% open
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Performance data */}
                {flowStats && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowPerformance(showPerformance === flowId ? null : flowId)
                      }
                      className="flex items-center gap-2 text-xs font-medium"
                      style={{ color: config.color }}
                    >
                      <BarChart3 size={13} />
                      {showPerformance === flowId ? "Hide" : "View"} Campaign Performance
                    </button>

                    {showPerformance === flowId && (
                      <div
                        className="mt-3 rounded-lg p-4"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          <div className="text-center">
                            <p className="text-lg font-bold" style={{ color: config.color }}>
                              {flowStats.campaigns}
                            </p>
                            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                              Campaigns Sent
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                              {flowStats.totalSent.toLocaleString()}
                            </p>
                            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                              Emails Sent
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>
                              {flowStats.avgOpen}%
                            </p>
                            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                              Avg Open Rate
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold" style={{ color: "#E24D47" }}>
                              {flowStats.totalUnsub}
                            </p>
                            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                              Unsubscribes
                            </p>
                          </div>
                        </div>

                        {/* Per-campaign breakdown */}
                        <div className="space-y-1">
                          {flowEmails
                            .filter((e) => e.mailchimpId)
                            .map((e) => {
                              const c = getCampaignForEmail(e.mailchimpId);
                              if (!c) return null;
                              return (
                                <div
                                  key={e.id}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
                                  style={{ backgroundColor: "var(--surface)" }}
                                >
                                  <span className="flex-1 truncate" style={{ color: "var(--foreground)" }}>
                                    {c.subject || e.subject}
                                  </span>
                                  <span className="text-[10px] shrink-0" style={{ color: "var(--muted)" }}>
                                    {c.emailsSent.toLocaleString()} sent
                                  </span>
                                  <span className="text-[10px] shrink-0" style={{ color: "#1EAA55" }}>
                                    {c.openRate}% open
                                  </span>
                                  <span className="text-[10px] shrink-0" style={{ color: "#5A6FFF" }}>
                                    {c.clickRate}% click
                                  </span>
                                </div>
                              );
                            })
                            .filter(Boolean)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Action needed */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02818" }}
      >
        <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Action needed: Convert campaigns to automations in Mailchimp
          </p>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
            All {totalAutomationEmails} automation emails are currently set up as individual campaigns.
            They need to be converted to Mailchimp Customer Journeys (automations) with proper triggers and delays.
            The warmup automation should send every 3 days. Event automations should trigger on the appropriate tags.
            Email sending remains disabled — nothing will send until CEO approval.
          </p>
        </div>
      </div>
    </div>
  );
}
