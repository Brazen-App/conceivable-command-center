"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Shield,
  Calendar,
  Rocket,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import EmailContentManager from "@/components/departments/email/EmailContentManager";
import ComplianceScanner from "@/components/departments/email/ComplianceScanner";
import SendStrategyCalendar from "@/components/departments/email/SendStrategyCalendar";
import DeploymentControls from "@/components/departments/email/DeploymentControls";
import MonitoringDashboard from "@/components/departments/email/MonitoringDashboard";

const EMAIL_ACCENT = "#E37FB1";

const TABS = [
  { id: "review", label: "Review Queue", icon: Mail, color: EMAIL_ACCENT },
  { id: "compliance", label: "Compliance", icon: Shield, color: "#E24D47" },
  { id: "calendar", label: "Calendar", icon: Calendar, color: "#5A6FFF" },
  { id: "deploy", label: "Deploy", icon: Rocket, color: "#1EAA55" },
  { id: "monitor", label: "Monitor", icon: BarChart3, color: "#9686B9" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Props {
  initialEmails: LaunchEmail[];
}

export default function EmailDeploymentClient({ initialEmails }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("review");
  const [emails, setEmails] = useState<LaunchEmail[]>(initialEmails);
  const [mailchimpStats, setMailchimpStats] = useState<{
    isMock: boolean;
    listStats?: { totalSubscribers: number };
    campaignStats?: {
      openRate: number;
      clickRate: number;
      unsubscribeRate: number;
      deliverability: number;
    };
  } | null>(null);

  // Fetch Mailchimp stats (client-side only — not critical for initial render)
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/email/stats");
      if (res.ok) {
        const data = await res.json();
        setMailchimpStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch Mailchimp stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh emails from API after mutations
  const refreshEmails = async () => {
    try {
      const res = await fetch("/api/emails");
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
      }
    } catch (err) {
      console.error("Failed to refresh emails:", err);
    }
  };

  // Handle email content updates (inline editing)
  const handleUpdate = async (id: string, updates: Partial<LaunchEmail>) => {
    try {
      const res = await fetch("/api/emails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } catch (err) {
      console.error("Failed to update email:", err);
    }
  };

  // Handle actions (approve, reject, compliance_approve, compliance_flag)
  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } catch (err) {
      console.error("Failed to perform action:", err);
    }
  };

  // Handle scheduling
  const handleSchedule = async (
    emailIds: string[],
    options: {
      sendTime: string;
      customTime?: string;
      segment: string;
      abTest?: { enabled: boolean; variantSubject?: string; splitPercent: number };
    }
  ) => {
    try {
      const res = await fetch("/api/emails/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds, ...options }),
      });
      if (res.ok) {
        await refreshEmails();
      }
    } catch (err) {
      console.error("Failed to schedule emails:", err);
    }
  };

  // Summary stats
  const approved = emails.filter((e) => e.status === "approved" || e.status === "published").length;
  const flagged = emails.filter((e) => e.complianceStatus === "flagged").length;
  const published = emails.filter((e) => e.status === "published").length;
  const pending = emails.filter((e) => e.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: `linear-gradient(135deg, ${EMAIL_ACCENT}08 0%, #E24D4708 100%)`,
          border: `1px solid ${EMAIL_ACCENT}20`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: EMAIL_ACCENT }}
            >
              Email Deployment System
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--foreground)" }}>
              {emails.length} launch emails &middot;{" "}
              {mailchimpStats?.listStats?.totalSubscribers?.toLocaleString() ?? "28,905"} subscribers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: mailchimpStats && !mailchimpStats.isMock ? "#1EAA55" : "#F1C028" }}
            />
            <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
              Mailchimp {mailchimpStats && !mailchimpStats.isMock ? "Connected" : "Mock Mode"}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {emails.length}
            </p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Total
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: pending > 0 ? "#F1C028" : "#1EAA55" }}>
              {pending}
            </p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Pending Review
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>
              {approved}
            </p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Approved
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: flagged > 0 ? "#E24D47" : "#1EAA55" }}>
              {flagged}
            </p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Flagged
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#5A6FFF" }}>
              {published}
            </p>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Deployed
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let badge: number | null = null;
          if (tab.id === "review") badge = pending;
          if (tab.id === "compliance") badge = flagged;
          if (tab.id === "deploy")
            badge = emails.filter(
              (e) => e.status === "approved" && e.complianceStatus === "approved"
            ).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: isActive ? `${tab.color}12` : "transparent",
                color: isActive ? tab.color : "var(--muted)",
                border: isActive ? `1px solid ${tab.color}25` : "1px solid transparent",
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {badge !== null && badge > 0 && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${tab.color}20`,
                    color: tab.color,
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "review" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail size={16} style={{ color: EMAIL_ACCENT }} />
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Email Review Queue
                </h2>
              </div>
              {pending > 0 ? (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: "#F1C028" }} />
                  <span className="text-xs" style={{ color: "#F1C028" }}>
                    {pending} emails awaiting CEO approval
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                  <span className="text-xs" style={{ color: "#1EAA55" }}>
                    All emails reviewed
                  </span>
                </div>
              )}
            </div>
            <EmailContentManager
              emails={emails}
              onUpdate={handleUpdate}
              onAction={handleAction}
            />
          </div>
        )}

        {activeTab === "compliance" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} style={{ color: "#E24D47" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Compliance Auto-Scan
              </h2>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#E24D4710", color: "#E24D47" }}
              >
                FDA / FTC / HIPAA
              </span>
            </div>
            <ComplianceScanner emails={emails} onAction={handleAction} />
          </div>
        )}

        {activeTab === "calendar" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} style={{ color: "#5A6FFF" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Send Strategy Calendar
              </h2>
            </div>
            <SendStrategyCalendar emails={emails} />
          </div>
        )}

        {activeTab === "deploy" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket size={16} style={{ color: "#1EAA55" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Deployment Controls
              </h2>
            </div>
            <DeploymentControls emails={emails} onSchedule={handleSchedule} />
          </div>
        )}

        {activeTab === "monitor" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} style={{ color: "#9686B9" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Live Monitoring
              </h2>
            </div>
            <MonitoringDashboard
              listStats={mailchimpStats?.listStats}
              campaignStats={mailchimpStats?.campaignStats}
              isMock={mailchimpStats?.isMock}
            />
          </div>
        )}
      </div>
    </div>
  );
}
