"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  BarChart3,
  Zap,
  Clock,
  ShoppingCart,
  Download,
  Newspaper,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

const ACCENT = "#5A6FFF";

interface MailchimpStatus {
  connected: boolean;
  healthStatus?: string;
  server?: string;
  lists?: Array<{
    id: string;
    name: string;
    memberCount: number;
    unsubscribeCount: number;
    openRate: number;
    clickRate: number;
  }>;
  recentCampaigns?: Array<{
    id: string;
    title: string;
    subject: string;
    status: string;
    sendTime: string;
    emailsSent: number;
  }>;
  error?: string;
}

interface SegmentInfo {
  listId: string;
  segments: Array<{
    id: number;
    name: string;
    memberCount: number;
    type: string;
  }>;
}

interface AutomationFlow {
  name: string;
  emails: Array<{
    delay: string;
    subject: string;
    preview: string;
    body: string;
    offer?: string;
  }>;
}

export default function EmailOpsPage() {
  const [status, setStatus] = useState<MailchimpStatus | null>(null);
  const [segments, setSegments] = useState<SegmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);
  const [flowTemplates, setFlowTemplates] = useState<Record<string, AutomationFlow> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [statusRes, segmentsRes] = await Promise.all([
        fetch("/api/mailchimp"),
        fetch("/api/mailchimp/segments"),
      ]);
      const statusData = await statusRes.json();
      setStatus(statusData);

      if (segmentsRes.ok) {
        const segData = await segmentsRes.json();
        setSegments(segData);
      }
    } catch {
      setStatus({ connected: false, error: "Failed to connect" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCreateSegments = async () => {
    setActionLoading("segments");
    try {
      const res = await fetch("/api/mailchimp/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_warmup_segments" }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage({ text: `Created ${data.created} warmup segments${data.failed > 0 ? ` (${data.failed} failed)` : ""}`, type: "success" });
        fetchStatus();
      } else {
        setActionMessage({ text: data.error || "Failed to create segments", type: "error" });
      }
    } catch {
      setActionMessage({ text: "Connection error", type: "error" });
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleLoadTemplates = async () => {
    try {
      const res = await fetch("/api/mailchimp/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_templates" }),
      });
      const data = await res.json();
      setFlowTemplates(data);
    } catch {
      setActionMessage({ text: "Failed to load templates", type: "error" });
    }
  };

  useEffect(() => {
    handleLoadTemplates();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border p-12 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>Connecting to Mailchimp...</p>
      </div>
    );
  }

  const primaryList = status?.lists?.[0];

  return (
    <div className="space-y-6">
      {/* Action message toast */}
      {actionMessage && (
        <div
          className="rounded-xl border p-3 text-sm font-medium flex items-center gap-2"
          style={{
            borderColor: actionMessage.type === "success" ? "#1EAA5530" : "#E24D4730",
            backgroundColor: actionMessage.type === "success" ? "#1EAA5508" : "#E24D4708",
            color: actionMessage.type === "success" ? "#1EAA55" : "#E24D47",
          }}
        >
          {actionMessage.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {actionMessage.text}
        </div>
      )}

      {/* Connection Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: status?.connected ? "#1EAA5508" : "#E24D4708",
            border: `1px solid ${status?.connected ? "#1EAA5520" : "#E24D4720"}`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {status?.connected ? (
              <CheckCircle2 size={18} style={{ color: "#1EAA55" }} />
            ) : (
              <AlertCircle size={18} style={{ color: "#E24D47" }} />
            )}
          </div>
          <p className="text-sm font-bold" style={{ color: status?.connected ? "#1EAA55" : "#E24D47" }}>
            {status?.connected ? "Connected" : "Disconnected"}
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
            {status?.connected ? `Server: ${status.server}` : status?.error}
          </p>
        </div>

        <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {primaryList?.memberCount?.toLocaleString() || "—"}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: ACCENT }}>Subscribers</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>{primaryList?.name || "No list found"}</p>
        </div>

        <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {primaryList?.openRate ? `${(primaryList.openRate * 100).toFixed(1)}%` : "—"}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>Open Rate</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>All-time average</p>
        </div>

        <div className="rounded-xl p-5 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {primaryList?.clickRate ? `${(primaryList.clickRate * 100).toFixed(1)}%` : "—"}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "#356FB6" }}>Click Rate</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>All-time average</p>
        </div>
      </div>

      {/* Warmup Strategy */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#F1C028" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Email Warmup Strategy</p>
          </div>
          <button
            onClick={handleCreateSegments}
            disabled={actionLoading === "segments" || !status?.connected}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {actionLoading === "segments" ? <Loader2 size={12} className="animate-spin" /> : <Users size={12} />}
            Create Warmup Segments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: 1, label: "Hot List", desc: "Opened last 30 days", target: "~3,000", days: "Days 1-3", color: "#E24D47" },
            { phase: 2, label: "Warm List", desc: "Opened last 90 days", target: "~7,000", days: "Days 4-7", color: "#F1C028" },
            { phase: 3, label: "Cold List (4 batches)", desc: "Remaining subscribers", target: "~20,000", days: "Days 8-14", color: "#356FB6" },
          ].map((phase) => (
            <div
              key={phase.phase}
              className="rounded-lg p-4"
              style={{ backgroundColor: `${phase.color}08`, border: `1px solid ${phase.color}20` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: phase.color }}>
                  {phase.phase}
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{phase.label}</p>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{phase.desc}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium" style={{ color: phase.color }}>{phase.target}</span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>{phase.days}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Existing segments */}
        {segments && segments.segments.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>Existing Segments:</p>
            <div className="flex flex-wrap gap-2">
              {segments.segments.map((seg) => (
                <span key={seg.id} className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}>
                  {seg.name} ({seg.memberCount?.toLocaleString()})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Automation Flows */}
      <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} style={{ color: ACCENT }} />
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Email Automation Flows</p>
        </div>

        <div className="space-y-3">
          {[
            { key: "abandoned_cart", label: "Abandoned Cart Recovery", icon: ShoppingCart, color: "#E24D47", emails: 3, desc: "2hr → 24hr → 48hr with escalating offers" },
            { key: "post_purchase", label: "Post-Purchase Onboarding", icon: CheckCircle2, color: "#1EAA55", emails: 5, desc: "Welcome → Tips → Week 1 → Review → Reorder" },
            { key: "post_app_download", label: "Post-App Download", icon: Download, color: "#356FB6", emails: 3, desc: "Getting started → Features → Week 1 milestone" },
            { key: "newsletter", label: "Friday Fertility Insights", icon: Newspaper, color: "#9686B9", emails: 1, desc: "Weekly newsletter with Joy-drafted content" },
          ].map((flow) => {
            const Icon = flow.icon;
            const isExpanded = expandedFlow === flow.key;
            const template = flowTemplates?.[flow.key] as AutomationFlow | undefined;

            return (
              <div key={flow.key} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div
                  className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--background)" }}
                  onClick={() => setExpandedFlow(isExpanded ? null : flow.key)}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${flow.color}14` }}>
                    <Icon size={14} style={{ color: flow.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{flow.label}</p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>{flow.desc}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${flow.color}14`, color: flow.color }}>
                    {flow.emails} email{flow.emails > 1 ? "s" : ""}
                  </span>
                  {isExpanded ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
                </div>

                {isExpanded && template?.emails && (
                  <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                    {template.emails.map((email, i) => (
                      <div key={i} className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={10} style={{ color: "var(--muted)" }} />
                          <span className="text-[10px] font-medium" style={{ color: flow.color }}>{email.delay}</span>
                          {email.offer && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F1C02810", color: "#F1C028" }}>
                              {email.offer}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{email.subject}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{email.preview}</p>
                        <details className="mt-2">
                          <summary className="text-[10px] font-medium cursor-pointer" style={{ color: ACCENT }}>View email body</summary>
                          <pre className="text-[10px] mt-2 p-3 rounded-lg whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto" style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                            {email.body}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Campaigns */}
      {status?.recentCampaigns && status.recentCampaigns.length > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} style={{ color: ACCENT }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Mailchimp Campaigns</p>
          </div>
          <div className="space-y-2">
            {status.recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--background)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {campaign.subject || campaign.title || "Untitled"}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {campaign.sendTime ? new Date(campaign.sendTime).toLocaleDateString() : "Not sent"} &middot; {campaign.emailsSent?.toLocaleString() || 0} sent
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: campaign.status === "sent" ? "#1EAA5514" : campaign.status === "schedule" ? "#5A6FFF14" : "#F1C02814",
                    color: campaign.status === "sent" ? "#1EAA55" : campaign.status === "schedule" ? "#5A6FFF" : "#F1C028",
                  }}
                >
                  {campaign.status?.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh */}
      <div className="text-center">
        <button
          onClick={() => { setLoading(true); fetchStatus(); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium mx-auto"
          style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
        >
          <RefreshCw size={12} /> Refresh Status
        </button>
      </div>
    </div>
  );
}
