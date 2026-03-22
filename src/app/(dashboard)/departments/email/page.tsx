"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  FileText,
  Calendar,
  BarChart3,
  Target,
  Shield,
  Rocket,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
} from "lucide-react";
import EmailContentManager from "@/components/departments/email/EmailContentManager";
import ComplianceScanner from "@/components/departments/email/ComplianceScanner";
import DeploymentControls from "@/components/departments/email/DeploymentControls";
import SendStrategyCalendar from "@/components/departments/email/SendStrategyCalendar";
import MonitoringDashboard from "@/components/departments/email/MonitoringDashboard";
import AutomationManager from "@/components/departments/email/AutomationManager";
import type { MonitoringDashboardProps } from "@/components/departments/email/MonitoringDashboard";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmailData = any; // API returns full DB objects with flow, delayDays etc.

const TABS = [
  { id: "automations", label: "Automations", icon: Zap },
  { id: "content", label: "Content", icon: FileText },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "deploy", label: "Deploy", icon: Rocket },
  { id: "strategy", label: "Timeline", icon: Calendar },
  { id: "monitoring", label: "Monitoring", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EmailDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("automations");
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [monitoringData, setMonitoringData] = useState<MonitoringDashboardProps>({});
  const [deployMessage, setDeployMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/emails");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmails(data);
        if (data.length === 0) {
          await seedEmails();
        }
      } else if (data.error) {
        await seedEmails();
      }
    } catch {
      await seedEmails();
    } finally {
      setLoading(false);
    }
  }, []);

  const seedEmails = async () => {
    setSeeding(true);
    setSeedError(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        const emailRes = await fetch("/api/emails");
        const emailData = await emailRes.json();
        if (Array.isArray(emailData)) {
          setEmails(emailData);
        }
      } else {
        setSeedError(result.error || "Seeding failed");
      }
    } catch (err) {
      setSeedError(err instanceof Error ? err.message : "Seed request failed");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Fetch Mailchimp stats when monitoring tab is selected
  useEffect(() => {
    if (activeTab !== "monitoring") return;
    fetch("/api/email/stats")
      .then((res) => res.json())
      .then((data) => {
        setMonitoringData({
          listStats: data.listStats,
          campaignStats: data.campaignStats,
          campaignDetails: data.campaignDetails,
          automationStats: data.automationStats,
          isMock: data.isMock,
          period: data.period,
        });
      })
      .catch(() => {
        // Silently fall back to defaults
      });
  }, [activeTab]);

  const handleUpdate = async (id: string, updates: Partial<EmailData>) => {
    const res = await fetch("/api/emails", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    const updated = await res.json();
    setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const handleAction = async (id: string, action: string) => {
    const res = await fetch("/api/emails", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const result = await res.json();
    if (result.updated !== undefined) {
      await fetchEmails();
    } else {
      setEmails((prev) => prev.map((e) => (e.id === id ? result : e)));
    }
  };

  const handleBulkApprove = async () => {
    const pendingIds = emails.filter((e) => e.status === "pending").map((e) => e.id);
    if (pendingIds.length === 0) return;
    await fetch("/api/emails", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk_approve", ids: pendingIds }),
    });
    await fetchEmails();
  };

  const handleBulkComplianceApprove = async () => {
    const needsReview = emails
      .filter((e) => e.complianceStatus !== "approved" && e.complianceStatus !== "flagged")
      .map((e) => e.id);
    if (needsReview.length === 0) return;
    await fetch("/api/emails", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk_compliance_approve", ids: needsReview }),
    });
    await fetchEmails();
  };

  const handleSchedule = async (
    emailIds: string[],
    options: { sendTime: string; customTime?: string; segment: string; abTest?: { enabled: boolean; variantSubject?: string; splitPercent: number } }
  ) => {
    setDeployMessage(null);
    try {
      const res = await fetch("/api/emails/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailIds, ...options }),
      });
      const result = await res.json();
      if (result.error) {
        setDeployMessage({ type: "error", text: result.error });
      } else {
        setDeployMessage({
          type: "success",
          text: result.mock
            ? `Mock mode: ${result.scheduled} email(s) marked as published.`
            : `${result.scheduled} email(s) scheduled in Mailchimp!`,
        });
        await fetchEmails();
      }
    } catch (err) {
      setDeployMessage({ type: "error", text: err instanceof Error ? err.message : "Schedule failed" });
    }
  };

  const approved = emails.filter((e) => e.status === "approved" || e.status === "published").length;
  const complianceCleared = emails.filter((e) => e.complianceStatus === "approved").length;
  const flagged = emails.filter((e) => e.complianceStatus === "flagged").length;
  const pending = emails.filter((e) => e.status === "pending").length;
  const readyToDeploy = emails.filter(
    (e) => e.status === "approved" && e.complianceStatus === "approved"
  ).length;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#E37FB114" }}
          >
            <Mail size={20} style={{ color: "#E37FB1" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Email Department
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Automations · Campaigns · Monitoring — All connected to Mailchimp
            </p>
          </div>
          <button
            onClick={fetchEmails}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ color: "var(--muted)" }}
            title="Refresh emails"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Status Banner */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{
          backgroundColor: "#E37FB10A",
          border: "1px solid #E37FB118",
        }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <Target size={20} style={{ color: "#E37FB1" }} strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Email system status
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {emails.length} emails · {approved} approved · {complianceCleared} compliance cleared · Sending: <span style={{ color: "#E24D47", fontWeight: 600 }}>DISABLED</span>
              </p>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}
            >
              Sending Disabled
            </span>
            {pending > 0 && (
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#F1C02818", color: "#B8930A" }}
              >
                {pending} pending review
              </span>
            )}
            {flagged > 0 && (
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#E24D4718", color: "#E24D47" }}
              >
                {flagged} flagged
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {emails.length > 0 && (pending > 0 || complianceCleared < emails.length) && (
          <div className="flex items-center gap-2 mt-3 pt-3 flex-wrap" style={{ borderTop: "1px solid #E37FB118" }}>
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
              Quick Actions:
            </span>
            {pending > 0 && (
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: "#1EAA55" }}
              >
                <CheckCircle2 size={12} />
                Approve All Pending ({pending})
              </button>
            )}
            {complianceCleared < emails.length - flagged && (
              <button
                onClick={handleBulkComplianceApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
              >
                <Shield size={12} />
                Compliance-Clear Unreviewed
              </button>
            )}
          </div>
        )}
      </div>

      {/* Deploy message */}
      {deployMessage && (
        <div
          className="rounded-xl p-3 mb-4 flex items-center gap-2"
          style={{
            backgroundColor: deployMessage.type === "success" ? "#1EAA5508" : "#E24D4708",
            border: `1px solid ${deployMessage.type === "success" ? "#1EAA5520" : "#E24D4720"}`,
          }}
        >
          {deployMessage.type === "success" ? (
            <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
          ) : (
            <AlertTriangle size={16} style={{ color: "#E24D47" }} />
          )}
          <p className="text-xs" style={{ color: "var(--foreground)" }}>
            {deployMessage.text}
          </p>
          <button
            onClick={() => setDeployMessage(null)}
            className="ml-auto text-xs px-2 py-0.5 rounded"
            style={{ color: "var(--muted)" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          let badge: number | null = null;
          if (tab.id === "compliance" && flagged > 0) badge = flagged;
          if (tab.id === "deploy" && readyToDeploy > 0) badge = readyToDeploy;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap relative
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: "#E37FB1" }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
              {badge !== null && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: tab.id === "compliance" ? "#E24D4718" : "#1EAA5518",
                    color: tab.id === "compliance" ? "#E24D47" : "#1EAA55",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {loading || seeding ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#E37FB1", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {seeding ? "Seeding email database..." : "Loading emails..."}
          </p>
        </div>
      ) : emails.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <Mail size={40} style={{ color: "var(--muted)" }} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            No Emails Found
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            The email database needs to be seeded with the launch sequence emails.
          </p>
          {seedError && (
            <p className="text-xs mb-3" style={{ color: "#E24D47" }}>
              Error: {seedError}
            </p>
          )}
          <button
            onClick={seedEmails}
            disabled={seeding}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white mx-auto"
            style={{ backgroundColor: "#E37FB1" }}
          >
            <Sparkles size={16} />
            Seed Email Data Now
          </button>
        </div>
      ) : (
        <>
          {activeTab === "automations" && <AutomationManager emails={emails} />}
          {activeTab === "content" && (
            <EmailContentManager
              emails={emails}
              onUpdate={handleUpdate}
              onAction={handleAction}
            />
          )}
          {activeTab === "compliance" && (
            <ComplianceScanner
              emails={emails}
              onAction={handleAction}
            />
          )}
          {activeTab === "deploy" && (
            <DeploymentControls
              emails={emails}
              onSchedule={handleSchedule}
            />
          )}
          {activeTab === "strategy" && <SendStrategyCalendar emails={emails} />}
          {activeTab === "monitoring" && <MonitoringDashboard {...monitoringData} />}
        </>
      )}
    </div>
  );
}
