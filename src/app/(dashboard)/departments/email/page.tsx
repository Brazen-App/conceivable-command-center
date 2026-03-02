"use client";

import { useState, useEffect } from "react";
import { Mail, FileText, Calendar, BarChart3, Target } from "lucide-react";
import EmailContentManager from "@/components/departments/email/EmailContentManager";
import SendStrategyCalendar from "@/components/departments/email/SendStrategyCalendar";
import MonitoringDashboard from "@/components/departments/email/MonitoringDashboard";
import type { MonitoringDashboardProps } from "@/components/departments/email/MonitoringDashboard";
import type { LaunchEmail } from "@/lib/data/launch-emails";

const TABS = [
  { id: "content", label: "Email Content", icon: FileText },
  { id: "strategy", label: "Send Strategy", icon: Calendar },
  { id: "monitoring", label: "Monitoring", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EmailDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [emails, setEmails] = useState<LaunchEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoringData, setMonitoringData] = useState<MonitoringDashboardProps>({});

  useEffect(() => {
    fetch("/api/emails")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      });
  }, []);

  // Fetch Mailchimp stats when monitoring tab is selected
  useEffect(() => {
    if (activeTab !== "monitoring") return;
    fetch("/api/email/stats")
      .then((res) => res.json())
      .then((data) => {
        setMonitoringData({
          listStats: data.listStats,
          campaignStats: data.campaignStats,
          isMock: data.isMock,
        });
      })
      .catch(() => {
        // Silently fall back to defaults in the dashboard
      });
  }, [activeTab]);

  const handleUpdate = async (id: string, updates: Partial<LaunchEmail>) => {
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
    const updated = await res.json();
    setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const approved = emails.filter((e) => e.status === "approved" || e.status === "published").length;
  const weeksToLaunch = 7;

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
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Email Strategy
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
              8-Week Launch Sequence — {emails.length} Emails
            </p>
          </div>
        </div>
      </header>

      {/* Countdown banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: "#E37FB10A",
          border: "1px solid #E37FB118",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Target size={20} style={{ color: "#E37FB1" }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {weeksToLaunch} weeks to launch
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {approved} / {emails.length} emails approved
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-3xl font-bold"
            style={{ color: "#E37FB1" }}
          >
            0
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            / 5,000 signups
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
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
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {loading ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#E37FB1", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading emails...</p>
        </div>
      ) : (
        <>
          {activeTab === "content" && (
            <EmailContentManager
              emails={emails}
              onUpdate={handleUpdate}
              onAction={handleAction}
            />
          )}
          {activeTab === "strategy" && <SendStrategyCalendar emails={emails} />}
          {activeTab === "monitoring" && <MonitoringDashboard {...monitoringData} />}
        </>
      )}
    </div>
  );
}
