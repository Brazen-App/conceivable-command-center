"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import WarmupReview from "@/components/departments/email/WarmupReview";

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

export default function EmailOpsPage() {
  const [status, setStatus] = useState<MailchimpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const statusRes = await fetch("/api/mailchimp");
      const statusData = await statusRes.json();
      setStatus(statusData);
    } catch {
      setStatus({ connected: false, error: "Failed to connect" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

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

      {/* Warmup Send Queue */}
      <WarmupReview />

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
