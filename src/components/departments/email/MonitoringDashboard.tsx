"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  MousePointer,
  UserMinus,
  ShieldCheck,
  Zap,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Loader2,
  ExternalLink,
  Mail,
  Play,
  Pause,
} from "lucide-react";

export interface MonitoringDashboardProps {
  listStats?: { totalSubscribers: number };
  campaignStats?: {
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
    deliverability: number;
    totalSent?: number;
    campaignCount?: number;
  };
  campaignDetails?: {
    id: string;
    title: string;
    subject: string;
    sendTime: string;
    emailsSent: number;
    openRate: number;
    clickRate: number;
    unsubscribed: number;
  }[];
  automationStats?: {
    total: number;
    active: number;
    paused: number;
  };
  isMock?: boolean;
  period?: string;
}

interface AutomationDetail {
  id: string;
  title: string;
  status: string;
  emailsSent: number;
  emails: {
    id: string;
    position: number;
    subject: string;
    emailsSent: number;
    openRate: number;
    clickRate: number;
  }[];
}

function DataBadge({ isMock }: { isMock: boolean }) {
  return (
    <span
      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-2"
      style={{
        backgroundColor: isMock ? "#F1C02818" : "#1EAA5518",
        color: isMock ? "#B8930A" : "#1EAA55",
      }}
    >
      {isMock ? "NO DATA" : "LIVE"}
    </span>
  );
}

export default function MonitoringDashboard({
  listStats,
  campaignStats,
  campaignDetails,
  automationStats,
  isMock,
  period,
}: MonitoringDashboardProps) {
  const isUsingMock = isMock ?? !campaignStats;
  const [automationData, setAutomationData] = useState<AutomationDetail[] | null>(null);
  const [loadingAutomations, setLoadingAutomations] = useState(false);
  const [showAutomationDetail, setShowAutomationDetail] = useState<string | null>(null);

  const metrics = {
    openRate: campaignStats?.openRate ?? 0,
    clickRate: campaignStats?.clickRate ?? 0,
    unsubscribeRate: campaignStats?.unsubscribeRate ?? 0,
    deliverability: campaignStats?.deliverability ?? 0,
    totalSent: campaignStats?.totalSent ?? 0,
    campaignCount: campaignStats?.campaignCount ?? 0,
    listSize: listStats?.totalSubscribers ?? 0,
  };

  const fetchAutomationDetails = useCallback(async () => {
    setLoadingAutomations(true);
    try {
      const res = await fetch("/api/mailchimp/automations/status");
      if (res.ok) {
        const data = await res.json();
        setAutomationData(data.automations || []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingAutomations(false);
    }
  }, []);

  return (
    <div>
      {/* Period indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
            Reporting Period: Last 30 Days
          </span>
          <DataBadge isMock={isUsingMock} />
        </div>
        {!isUsingMock && metrics.campaignCount > 0 && (
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
            {metrics.campaignCount} campaign{metrics.campaignCount !== 1 ? "s" : ""} · {metrics.totalSent.toLocaleString()} emails sent
          </span>
        )}
      </div>

      {/* No data state */}
      {isUsingMock && (
        <div
          className="rounded-xl p-6 mb-6 text-center"
          style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02818" }}
        >
          <Mail size={24} className="mx-auto mb-2" style={{ color: "#F1C028" }} />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            No campaign data yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Mailchimp is connected but no campaigns have been sent in the last 30 days.
            Once the warmup automation starts, real-time metrics will appear here.
          </p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          {
            label: "Open Rate (30d)",
            value: metrics.openRate > 0 ? `${metrics.openRate}%` : "—",
            threshold: "20%",
            ok: metrics.openRate === 0 || metrics.openRate >= 20,
            icon: Eye,
            trend: metrics.openRate > 0 ? "up" : null,
          },
          {
            label: "Click Rate (30d)",
            value: metrics.clickRate > 0 ? `${metrics.clickRate}%` : "—",
            threshold: null,
            ok: true,
            icon: MousePointer,
            trend: metrics.clickRate > 0 ? "up" : null,
          },
          {
            label: "Unsubscribe",
            value: metrics.unsubscribeRate > 0 ? `${metrics.unsubscribeRate}%` : "—",
            threshold: "< 1%",
            ok: metrics.unsubscribeRate === 0 || metrics.unsubscribeRate < 1,
            icon: UserMinus,
            trend: null,
          },
          {
            label: "Deliverability",
            value: metrics.deliverability > 0 ? `${metrics.deliverability}%` : "—",
            threshold: "> 95%",
            ok: metrics.deliverability === 0 || metrics.deliverability > 95,
            icon: ShieldCheck,
            trend: null,
          },
          {
            label: "List Size",
            value: metrics.listSize > 0 ? metrics.listSize.toLocaleString() : "—",
            threshold: null,
            ok: true,
            icon: Target,
            trend: null,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border p-4"
              style={{
                borderColor: kpi.ok ? "var(--border)" : "#E24D4740",
                backgroundColor: kpi.ok ? "var(--surface)" : "#E24D4706",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={12} style={{ color: "#E37FB1" }} strokeWidth={2} />
                <span
                  className="text-[9px] uppercase tracking-wider font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {kpi.label}
                </span>
                <DataBadge isMock={isUsingMock} />
              </div>
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
                {kpi.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" && <TrendingUp size={10} className="text-green-500" />}
                {kpi.threshold && (
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                    Threshold: {kpi.threshold}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign details table (real data) */}
      {!isUsingMock && campaignDetails && campaignDetails.length > 0 && (
        <div
          className="rounded-xl border p-4 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Campaign Performance (Last 30 Days)
          </h3>
          <div className="space-y-1.5">
            {campaignDetails.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ backgroundColor: "var(--background)" }}
              >
                <Mail size={12} style={{ color: "#E37FB1" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {campaign.subject || campaign.title}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {campaign.sendTime
                      ? new Date(campaign.sendTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}{" "}
                    · {campaign.emailsSent.toLocaleString()} sent
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-medium" style={{ color: "#1EAA55" }}>
                    {campaign.openRate}% open
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: "#5A6FFF" }}>
                    {campaign.clickRate}% click
                  </span>
                  {campaign.unsubscribed > 0 && (
                    <span className="text-[10px]" style={{ color: "#E24D47" }}>
                      {campaign.unsubscribed} unsub
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automation performance section */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "#5A6FFF" }} />
            <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              Automation Status
            </h3>
          </div>
          <button
            type="button"
            onClick={fetchAutomationDetails}
            disabled={loadingAutomations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all"
            style={{ backgroundColor: "#5A6FFF10", color: "#5A6FFF" }}
          >
            {loadingAutomations ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <RefreshCw size={11} />
            )}
            Load Automation Data
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-lg font-bold" style={{ color: "#5A6FFF" }}>
              {automationStats?.total ?? 0}
            </p>
            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Total Automations
            </p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>
              {automationStats?.active ?? 0}
            </p>
            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Active
            </p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-lg font-bold" style={{ color: "#F1C028" }}>
              {automationStats?.paused ?? 0}
            </p>
            <p className="text-[8px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Paused
            </p>
          </div>
        </div>

        {/* Automation detail list */}
        {automationData && automationData.length > 0 && (
          <div className="space-y-2">
            {automationData.map((auto) => (
              <div key={auto.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setShowAutomationDetail(showAutomationDetail === auto.id ? null : auto.id)}
                  className="w-full px-3 py-2.5 flex items-center gap-2 text-left"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  {auto.status === "sending" ? (
                    <Play size={12} style={{ color: "#1EAA55" }} />
                  ) : (
                    <Pause size={12} style={{ color: "#F1C028" }} />
                  )}
                  <span className="text-xs font-medium flex-1 truncate" style={{ color: "var(--foreground)" }}>
                    {auto.title}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {auto.emailsSent.toLocaleString()} sent
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: auto.status === "sending" ? "#1EAA5514" : "#F1C02814",
                      color: auto.status === "sending" ? "#1EAA55" : "#B8930A",
                    }}
                  >
                    {auto.status === "sending" ? "Active" : auto.status}
                  </span>
                </button>

                {showAutomationDetail === auto.id && auto.emails.length > 0 && (
                  <div className="px-3 pb-3 space-y-1">
                    {auto.emails.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded text-xs"
                        style={{ backgroundColor: "var(--surface)" }}
                      >
                        <span className="font-mono text-[10px] w-4 shrink-0" style={{ color: "var(--muted)" }}>
                          #{e.position}
                        </span>
                        <span className="flex-1 truncate" style={{ color: "var(--foreground)" }}>
                          {e.subject}
                        </span>
                        <span className="text-[10px] shrink-0" style={{ color: "var(--muted)" }}>
                          {e.emailsSent} sent
                        </span>
                        <span className="text-[10px] shrink-0" style={{ color: "#1EAA55" }}>
                          {e.openRate}%
                        </span>
                        <span className="text-[10px] shrink-0" style={{ color: "#5A6FFF" }}>
                          {e.clickRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {automationData && automationData.length === 0 && (
          <p className="text-xs text-center py-3" style={{ color: "var(--muted)" }}>
            No automations found in Mailchimp. Set up automations first, then they&apos;ll appear here.
          </p>
        )}

        {!automationData && (
          <p className="text-xs text-center py-3" style={{ color: "var(--muted)" }}>
            Click &quot;Load Automation Data&quot; to fetch real-time performance from Mailchimp.
          </p>
        )}
      </div>

      {/* Health alerts based on real data */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Health Alerts
        </h3>
        <div className="space-y-2">
          {!isUsingMock && metrics.openRate > 0 && metrics.openRate >= 20 && (
            <HealthAlert type="success" message={`Open rate at ${metrics.openRate}% — above 20% threshold`} />
          )}
          {!isUsingMock && metrics.openRate > 0 && metrics.openRate < 20 && (
            <HealthAlert type="warning" message={`Open rate at ${metrics.openRate}% — below 20% threshold. Review subject lines and send times.`} />
          )}
          {!isUsingMock && metrics.unsubscribeRate > 0 && metrics.unsubscribeRate < 1 && (
            <HealthAlert type="success" message={`Unsubscribe rate at ${metrics.unsubscribeRate}% — well below 1% threshold`} />
          )}
          {!isUsingMock && metrics.unsubscribeRate >= 1 && (
            <HealthAlert type="error" message={`Unsubscribe rate at ${metrics.unsubscribeRate}% — above 1% threshold. Investigate immediately.`} />
          )}
          {!isUsingMock && metrics.deliverability > 95 && (
            <HealthAlert type="success" message={`Deliverability at ${metrics.deliverability}% — healthy`} />
          )}
          {!isUsingMock && metrics.deliverability > 0 && metrics.deliverability <= 95 && (
            <HealthAlert type="warning" message={`Deliverability at ${metrics.deliverability}% — below 95%. Check bounce rates.`} />
          )}
          {isUsingMock && (
            <HealthAlert type="info" message="No campaign data available. Health alerts will appear once campaigns start sending." />
          )}
          <HealthAlert type="info" message="Email sending is currently disabled. All automations are paused pending CEO approval." />
        </div>
      </div>
    </div>
  );
}

function HealthAlert({
  type,
  message,
}: {
  type: "success" | "warning" | "info" | "error";
  message: string;
}) {
  const styles = {
    success: { bg: "#1EAA5510", border: "#1EAA5530", icon: "text-green-600" },
    warning: { bg: "#F1C02810", border: "#F1C02830", icon: "text-yellow-600" },
    info: { bg: "#5A6FFF10", border: "#5A6FFF30", icon: "text-blue-500" },
    error: { bg: "#E24D4710", border: "#E24D4730", icon: "text-red-500" },
  };
  const style = styles[type];

  return (
    <div
      className="flex items-start gap-2 p-2.5 rounded-lg"
      style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
    >
      {type === "warning" ? (
        <AlertTriangle size={13} className={`${style.icon} mt-0.5 shrink-0`} />
      ) : type === "success" ? (
        <TrendingUp size={13} className={`${style.icon} mt-0.5 shrink-0`} />
      ) : type === "error" ? (
        <AlertTriangle size={13} className={`${style.icon} mt-0.5 shrink-0`} />
      ) : (
        <ShieldCheck size={13} className={`${style.icon} mt-0.5 shrink-0`} />
      )}
      <p className="text-xs" style={{ color: "var(--foreground)" }}>
        {message}
      </p>
    </div>
  );
}
