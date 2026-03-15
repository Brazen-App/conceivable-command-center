"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Sparkles,
  Send,
  Loader2,
  ChevronRight,
  Gem,
  ShieldCheck,
  FilePlus2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { PATENT_DRAFTS, getDraftStats } from "@/lib/data/patent-drafts-data";

interface PatentClaim {
  id: string;
  claimNumber: number;
  claimText: string;
  claimType: string;
  valueTier: "HIGH" | "MEDIUM" | "LOW";
  estimatedValue: number;
  status: string;
  priority: boolean;
  urgency: string | null;
  parentPatentRef: string;
  category: string | null;
}

// ── Joy Legal Chat (connected to real API) ──────────────────────────

function JoyLegalChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "I'm your IP strategy advisor. I specialize in healthcare technology patents, FDA/FTC compliance for health claims, and intellectual property strategy for startups in the reproductive health space. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: "legal", message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.response || "I had trouble processing that. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #2A2828 0%, #356FB6 100%)",
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-white">Joy: IP Strategy Advisor</span>
          <p className="text-[10px] text-white/50">Patent attorney specializing in healthcare IP</p>
        </div>
        <span
          className="text-[10px] ml-auto px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#1EAA5530", color: "#1EAA55" }}
        >
          Online
        </span>
      </div>
      <div
        className="max-h-72 overflow-y-auto p-5 space-y-3"
        style={{ backgroundColor: "var(--background)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[13px] leading-relaxed p-4 rounded-xl max-w-[88%] ${
              msg.role === "assistant" ? "" : "ml-auto"
            }`}
            style={{
              backgroundColor:
                msg.role === "assistant" ? "var(--surface)" : "#5A6FFF",
              color: msg.role === "assistant" ? "var(--foreground)" : "white",
              border:
                msg.role === "assistant" ? "1px solid var(--border)" : "none",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 p-3">
            <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Joy is thinking...
            </span>
          </div>
        )}
      </div>
      <div
        className="flex items-center gap-2 p-4"
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about patent strategy, FDA claims, IP protection..."
          className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl transition-colors hover:opacity-80 disabled:opacity-40"
          style={{ backgroundColor: "#5A6FFF", color: "white" }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────

export default function LegalDashboardPage() {
  const [claims, setClaims] = useState<PatentClaim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/patent-claims");
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const grantedClaims = claims.filter((c) => c.status === "granted");
  const filedClaims = claims.filter((c) => c.status === "filed");
  const grantedValue = grantedClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const filedValue = filedClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const totalValue = claims.reduce((s, c) => s + (c.estimatedValue || 0), 0);

  // Patent drafts stats (full portfolio from patent-drafts-data)
  const draftStats = getDraftStats();
  const totalPortfolio = PATENT_DRAFTS.length + draftStats.opportunities;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero — War Room Header */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <Shield size={24} className="text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
              >
                IP War Room
              </h1>
              <p className="text-white/50 text-xs" style={{ fontFamily: "var(--font-caption)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                What needs protecting this week?
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Protected</span>
              </div>
              <p className="text-2xl font-bold text-white">{grantedClaims.length + filedClaims.length}</p>
              <p className="text-[10px] text-white/40">{grantedClaims.length} granted, {filedClaims.length} pending</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Gem size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold text-white">${((grantedValue + filedValue) / 1000000).toFixed(1)}M</p>
              <p className="text-[10px] text-white/40">${(totalValue / 1000000).toFixed(1)}M if all awarded</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <FilePlus2 size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Drafts</span>
              </div>
              <p className="text-2xl font-bold text-white">{draftStats.total}</p>
              <p className="text-[10px] text-white/40">{draftStats.reviewReady} review-ready, {(draftStats.totalWords / 1000).toFixed(0)}K words</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-white/70" />
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Patent Portfolio</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalPortfolio}</p>
              <p className="text-[10px] text-white/40">{draftStats.total} drafts, {draftStats.opportunities} opportunities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Patent Portfolio */}
      <Link
        href="/departments/legal/patents"
        className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:shadow-md hover:border-[#5A6FFF40] hover:-translate-y-0.5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #356FB6 0%, #5A6FFF 100%)",
          }}
        >
          <Shield size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            Full Patent Portfolio
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {grantedClaims.length} awarded, {filedClaims.length} filed, {draftStats.total} drafts in progress
          </p>
        </div>
        <ChevronRight
          size={18}
          className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ color: "#5A6FFF" }}
        />
      </Link>

      {/* Joy Legal Advisor */}
      <JoyLegalChat />

      {/* Sullivan: Compliance as Moat */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #9686B908 0%, #5A6FFF08 100%)",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Multiplier: Compliance Infrastructure as Competitive Moat
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              Patent portfolio + HIPAA compliance + FDA-aware claims = barriers competitors cannot easily replicate.
              The Closed-Loop patent filing before fundraise is the single highest-leverage legal action. Impacts
              Legal, Fundraising, and Clinical simultaneously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
