"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Zap,
  Mail,
  Users,
  TrendingUp,
} from "lucide-react";

const ACCENT = "#5A6FFF";

function fmt(rate: number | null): string {
  if (rate === null || rate === undefined) return "—";
  // Mailchimp returns rates as decimals (0–1). Guard against already-percentage values.
  const pct = rate > 1 ? rate : rate * 100;
  return `${pct.toFixed(1)}%`;
}

interface AutomationStatus {
  configured: boolean;
  workflowId?: string;
  status?: string;
  message?: string;
}

interface AutomationEmail {
  id: string;
  subject: string;
  position: number;
  emailsSent: number;
  openRate: number | null;
  clickRate: number | null;
  uniqueOpens: number;
  clicks: number;
  status: string;
}

interface SignupStats {
  totalSubscribers: number;
  earlyAccess: { total: number; today: number; yesterday: number };
  sources: Record<string, number>;
}

interface FunnelStats {
  views: number;
  signups: number;
  conversionRate: string | null;
}

export default function EmailOpsPage() {
  const [mcConnected, setMcConnected] = useState<boolean | null>(null);
  const [mcServer, setMcServer] = useState<string>("");
  const [totalSubscribers, setTotalSubscribers] = useState<number | null>(null);
  const [listOpenRate, setListOpenRate] = useState<number | null>(null);
  const [listClickRate, setListClickRate] = useState<number | null>(null);

  const [signupStats, setSignupStats] = useState<SignupStats | null>(null);
  const [signupLoading, setSignupLoading] = useState(true);

  const [funnelStats, setFunnelStats] = useState<FunnelStats | null>(null);
  const [funnelLoading, setFunnelLoading] = useState(true);

  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null);
  const [automationEmails, setAutomationEmails] = useState<AutomationEmail[]>([]);
  const [automationLoading, setAutomationLoading] = useState(true);

  const [actionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Warmup automation state
  const [warmupAutomation, setWarmupAutomation] = useState<{ id: string; title: string; status: string; emailsSent: number } | null>(null);
  const [warmupLoading, setWarmupLoading] = useState(false);
  const [warmupActionMessage, setWarmupActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchAll = useCallback(async () => {
    // Mailchimp connection + list stats
    fetch("/api/mailchimp")
      .then((r) => r.json())
      .then((d) => {
        setMcConnected(d.connected);
        setMcServer(d.server || "");
        const list = d.lists?.[0];
        if (list) {
          setTotalSubscribers(list.memberCount);
          setListOpenRate(list.openRate);
          setListClickRate(list.clickRate);
        }
      })
      .catch(() => setMcConnected(false));

    // Popup signup stats
    setSignupLoading(true);
    fetch("/api/mailchimp/signups")
      .then((r) => r.json())
      .then((d) => setSignupStats(d))
      .catch(() => {})
      .finally(() => setSignupLoading(false));

    // Quiz funnel stats
    setFunnelLoading(true);
    fetch("/api/early-access/funnel")
      .then((r) => r.json())
      .then((d) => setFunnelStats(d))
      .catch(() => {})
      .finally(() => setFunnelLoading(false));

    // Automation status + per-email stats
    setAutomationLoading(true);
    Promise.all([
      fetch("/api/mailchimp/automations/quiz-nurture").then((r) => r.json()),
      fetch("/api/mailchimp/automations/email-stats").then((r) => r.json()),
    ])
      .then(([statusData, statsData]) => {
        setAutomationStatus(statusData);
        setAutomationEmails(statsData.emails || []);
      })
      .catch(() => {})
      .finally(() => setAutomationLoading(false));

    // Warmup draft campaigns
    fetch("/api/mailchimp/warmup")
      .then((r) => r.json())
      .then((d) => {
        if (d.campaigns?.length > 0) {
          setWarmupAutomation({ id: "campaigns", title: `${d.campaigns.length} draft campaigns`, status: "draft", emailsSent: 0 });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const dayLabel = (i: number) => ["Day 1", "Day 3", "Day 5", "Day 7"][i] || `Email ${i + 1}`;

  const setupWarmupAutomation = async () => {
    setWarmupLoading(true);
    setWarmupActionMessage(null);
    try {
      const res = await fetch("/api/mailchimp/warmup", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setWarmupActionMessage({ text: data.error || "Failed to create campaigns", type: "error" });
      } else {
        setWarmupActionMessage({
          text: `Created ${data.created}/${data.total} draft campaigns in Mailchimp. Go to Mailchimp → Campaigns to review and schedule them.`,
          type: "success",
        });
        setWarmupAutomation({ id: "campaigns", title: `${data.created} draft campaigns`, status: "draft", emailsSent: 0 });
      }
    } catch {
      setWarmupActionMessage({ text: "Request failed", type: "error" });
    } finally {
      setWarmupLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Row 1: Connection + list metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            backgroundColor: mcConnected === false ? "#E24D4708" : "#1EAA5508",
            border: `1px solid ${mcConnected === false ? "#E24D4720" : "#1EAA5520"}`,
          }}
        >
          {mcConnected === null
            ? <Loader2 size={18} className="animate-spin mx-auto mb-1" style={{ color: ACCENT }} />
            : mcConnected
              ? <CheckCircle2 size={18} className="mx-auto mb-1" style={{ color: "#1EAA55" }} />
              : <AlertCircle size={18} className="mx-auto mb-1" style={{ color: "#E24D47" }} />}
          <p className="text-sm font-bold" style={{ color: mcConnected === false ? "#E24D47" : "#1EAA55" }}>
            {mcConnected === null ? "…" : mcConnected ? "Connected" : "Disconnected"}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            {mcConnected ? `${mcServer}` : "Check API key"}
          </p>
        </div>

        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {totalSubscribers?.toLocaleString() ?? "—"}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: ACCENT }}>Total List</p>
        </div>

        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {fmt(listOpenRate)}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>List Open Rate</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>All-time avg</p>
        </div>

        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {fmt(listClickRate)}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#356FB6" }}>List Click Rate</p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>All-time avg</p>
        </div>
      </div>

      {/* ── Row 2: Popup signups + Quiz funnel ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Popup signups */}
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Users size={15} style={{ color: ACCENT }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Mailchimp Popup Signups</h3>
          </div>
          {signupLoading ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
              <span className="text-xs" style={{ color: "var(--muted)" }}>Loading…</span>
            </div>
          ) : signupStats ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{signupStats.earlyAccess.total.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: ACCENT }}>Early Access</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{signupStats.earlyAccess.today}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#1EAA55" }}>Today</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{signupStats.earlyAccess.yesterday}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>Yesterday</p>
                </div>
              </div>
              {Object.keys(signupStats.sources).length > 0 && (
                <div className="pt-3 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>By Source</p>
                  {Object.entries(signupStats.sources)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([src, count]) => (
                      <div key={src} className="flex justify-between text-xs">
                        <span style={{ color: "var(--muted)" }}>{src}</span>
                        <span className="font-medium" style={{ color: "var(--foreground)" }}>{count}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>Failed to load</p>
          )}
        </div>

        {/* Quiz funnel */}
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} style={{ color: ACCENT }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Quiz Results Funnel</h3>
          </div>
          {funnelLoading ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
              <span className="text-xs" style={{ color: "var(--muted)" }}>Loading…</span>
            </div>
          ) : funnelStats ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{funnelStats.views.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>Results Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{funnelStats.signups.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: ACCENT }}>Emails Captured</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: funnelStats.conversionRate ? "#1EAA55" : "var(--muted)" }}>
                    {funnelStats.conversionRate ? `${funnelStats.conversionRate}%` : "—"}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#1EAA55" }}>Conversion</p>
                </div>
              </div>
              <div className="pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--muted)" }}>X'd out without submitting</span>
                  <span className="font-medium" style={{ color: "#E24D47" }}>
                    {(funnelStats.views - funnelStats.signups).toLocaleString()}
                  </span>
                </div>
                {funnelStats.views > 0 && (
                  <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: "#E24D4720" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (funnelStats.signups / funnelStats.views) * 100)}%`,
                        background: "linear-gradient(90deg, #5A6FFF, #1EAA55)",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>Failed to load</p>
          )}
        </div>
      </div>

      {/* ── Row 3: Automation performance ── */}
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail size={15} style={{ color: ACCENT }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Quiz Nurture Sequence</h3>
            {automationStatus?.status && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: automationStatus.status === "sending" ? "#1EAA5515" : "#F1C02815",
                  color: automationStatus.status === "sending" ? "#1EAA55" : "#F1C028",
                }}
              >
                {automationStatus.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="text-[10px] px-2 py-1 rounded flex items-center gap-1"
              style={{ backgroundColor: "var(--border)", color: "var(--muted)" }}
            >
              <RefreshCw size={10} /> Refresh
            </button>
            <a
              href="/departments/marketing/email-templates"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: ACCENT, color: "#fff" }}
            >
              <Mail size={12} /> View / Copy Email HTML
            </a>
          </div>
        </div>

        {/* Inline result message */}
        {actionMessage && (
          <div
            className="mb-4 rounded-lg p-3 text-xs font-medium flex items-start gap-2"
            style={{
              border: "1px solid",
              borderColor: actionMessage.type === "success" ? "#1EAA5530" : "#E24D4730",
              backgroundColor: actionMessage.type === "success" ? "#1EAA5508" : "#E24D4708",
              color: actionMessage.type === "success" ? "#1EAA55" : "#E24D47",
            }}
          >
            {actionMessage.type === "success" ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {automationLoading ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Loading…</span>
          </div>
        ) : !automationStatus?.configured ? (
          <p className="text-xs py-4 text-center" style={{ color: "var(--muted)" }}>
            Automation not configured. Click "Create Automation" to set it up.
          </p>
        ) : automationEmails.length === 0 ? (
          <p className="text-xs py-4 text-center" style={{ color: "var(--muted)" }}>
            No emails sent yet. Activate the automation in Mailchimp → Automations → Start Sending.
          </p>
        ) : (
          <div className="space-y-2">
            {automationEmails.map((email, i) => (
              <div
                key={email.id}
                className="rounded-lg p-3 flex items-center gap-4"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <div className="shrink-0 text-center w-10">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>{dayLabel(i)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{email.subject}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{email.emailsSent.toLocaleString()} sent</p>
                </div>
                <div className="flex gap-4 shrink-0 text-center">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#1EAA55" }}>{fmt(email.openRate)}</p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>Opens</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: ACCENT }}>{fmt(email.clickRate)}</p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>Clicks</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{email.uniqueOpens.toLocaleString()}</p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>Unique</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Merge field note after update */}
        {actionMessage && (
          <p className={`text-xs mt-3 ${actionMessage.type === "error" ? "text-red-500" : "text-green-600"}`}>
            {actionMessage.text}
          </p>
        )}

      </div>

      {/* ── Row 4: Warmup Automation (new subscriber sequence) ── */}
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} style={{ color: "#E37FB1" }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Warmup Automation</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "#78C3BF20", color: "#78C3BF" }}>
              New subscribers
            </span>
            {warmupAutomation && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: warmupAutomation.status === "sending" ? "#1EAA5515" : "#F1C02815",
                  color: warmupAutomation.status === "sending" ? "#1EAA55" : "#F1C028",
                }}
              >
                {warmupAutomation.status}
              </span>
            )}
          </div>
          {!warmupAutomation && (
            <button
              onClick={setupWarmupAutomation}
              disabled={warmupLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: "#E37FB1", opacity: warmupLoading ? 0.6 : 1 }}
            >
              {warmupLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              Create Warmup Automation
            </button>
          )}
        </div>

        {warmupAutomation ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{warmupAutomation.title}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>Title</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{warmupAutomation.emailsSent.toLocaleString()}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>Sent</p>
              </div>
              <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-bold capitalize" style={{ color: warmupAutomation.status === "sending" ? "#1EAA55" : "#F1C028" }}>{warmupAutomation.status}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>Status</p>
              </div>
            </div>
            {warmupAutomation.status !== "sending" && (
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                Activate in Mailchimp → Automations → &quot;{warmupAutomation.title}&quot; → Start Sending
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
              Creates all 23 warmup emails as <strong>draft campaigns</strong> in Mailchimp — ready for you to review and schedule. Nothing sends until you schedule each campaign manually.
            </p>
            {warmupActionMessage && (
              <p className={`text-xs mt-2 ${warmupActionMessage.type === "error" ? "text-red-500" : "text-green-600"}`}>
                {warmupActionMessage.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
