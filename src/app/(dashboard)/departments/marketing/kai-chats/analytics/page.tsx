"use client";

import { useState, useEffect, useCallback } from "react";

interface Analytics {
  kai: {
    totalMessages: number;
    testMessages: number;
    totalSessions: number;
    avgMsgsPerSession: number;
    kaiEmails: number;
    funnel: {
      conversations: number;
      packsPresented: number;
      cartLinksShown: number;
      malePacksPresented: number;
      emailsCollected: number;
      conversionRate: number;
      cartRate: number;
    };
    dailyTrend: { date: string; sessions: number; messages: number }[];
  };
  quiz: { totalCompletions: number };
  comparison: {
    quizCompletions: number;
    kaiConversations: number;
    kaiPacksPresented: number;
    kaiCartLinks: number;
  };
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function KaiAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(toDateStr(new Date()));
  const [to, setTo] = useState(toDateStr(new Date()));
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("today");

  const applyRange = useCallback((r: string) => {
    const now = new Date();
    if (r === "today") {
      setFrom(toDateStr(now));
      setTo(toDateStr(now));
    } else if (r === "7d") {
      const d = new Date(); d.setDate(d.getDate() - 7);
      setFrom(toDateStr(d));
      setTo(toDateStr(now));
    } else if (r === "30d") {
      const d = new Date(); d.setDate(d.getDate() - 30);
      setFrom(toDateStr(d));
      setTo(toDateStr(now));
    } else {
      setFrom("");
      setTo("");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    try {
      const res = await fetch(`/api/admin/kai-analytics?${params}`);
      const d = await res.json();
      setData(d);
    } catch { /* */ }
    finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRange = (r: "today" | "7d" | "30d" | "all") => {
    setRange(r);
    applyRange(r);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Kai Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Kai chat performance vs quiz funnel</p>
        </div>
      </div>

      {/* Date picker */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(["today", "7d", "30d", "all"] as const).map(r => (
          <button key={r} onClick={() => handleRange(r)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: range === r ? "#5A6FFF" : "var(--surface)",
              color: range === r ? "#fff" : "var(--muted)",
              border: `1px solid ${range === r ? "#5A6FFF" : "var(--border)"}`,
            }}
          >{r === "today" ? "Today" : r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "All Time"}</button>
        ))}
        <div className="flex items-center gap-2 ml-2">
          <input type="date" value={from} onChange={e => { setFrom(e.target.value); setRange("today"); }}
            className="px-2 py-1.5 rounded-lg text-xs"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>to</span>
          <input type="date" value={to} onChange={e => { setTo(e.target.value); setRange("today"); }}
            className="px-2 py-1.5 rounded-lg text-xs"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>Loading...</div>
      ) : !data ? (
        <div className="text-center py-16" style={{ color: "var(--muted)" }}>Failed to load</div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Conversations", value: data.kai.totalSessions, color: "#5A6FFF" },
              { label: "Messages", value: data.kai.totalMessages, color: "#ACB7FF" },
              { label: "Packs Built", value: data.kai.funnel.packsPresented, color: "#1EAA55" },
              { label: "Emails Captured", value: data.kai.funnel.emailsCollected, color: "#E37FB1" },
            ].map(k => (
              <div key={k.label} className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{k.label}</div>
                <div className="text-3xl font-bold mt-1" style={{ color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "#5A6FFF" }}>KAI CHAT</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: data.kai.totalSessions, l: "Conversations" },
                  { n: data.kai.avgMsgsPerSession, l: "Avg messages" },
                  { n: data.kai.funnel.packsPresented, l: "Packs presented" },
                  { n: data.kai.funnel.cartLinksShown, l: "Cart clicks" },
                  { n: data.kai.funnel.malePacksPresented, l: "Male packs" },
                  { n: data.kai.funnel.emailsCollected, l: "Emails" },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-2xl font-bold" style={{ color: "#5A6FFF" }}>{s.n}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "#1EAA55" }}>TRADITIONAL QUIZ</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: data.comparison.quizCompletions, l: "Quiz completions" },
                  { n: data.kai.kaiEmails, l: "Kai signups" },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-2xl font-bold" style={{ color: "#1EAA55" }}>{s.n}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Funnel */}
          <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--muted)" }}>CONVERSION FUNNEL</div>
            <div className="flex items-center gap-2">
              {[
                { n: data.kai.funnel.conversations, l: "Conversations", c: "#5A6FFF" },
                { n: data.kai.funnel.packsPresented, l: "Packs built", c: "#1EAA55" },
                { n: data.kai.funnel.cartLinksShown, l: "Cart clicks", c: "#F1C028" },
              ].map((step, i) => (
                <div key={step.l} className="flex items-center gap-2 flex-1">
                  <div className="flex-1 rounded-xl p-4 text-center" style={{ backgroundColor: step.c + "12", border: `1px solid ${step.c}30` }}>
                    <div className="text-3xl font-bold" style={{ color: step.c }}>{step.n}</div>
                    <div className="text-xs mt-1 font-medium" style={{ color: step.c }}>{step.l}</div>
                  </div>
                  {i < 2 && <span style={{ color: "var(--muted)", fontSize: 20 }}>→</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-6">
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Pack rate: <span className="font-bold" style={{ color: "#5A6FFF" }}>{data.kai.funnel.conversionRate}%</span>
              </div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Cart rate: <span className="font-bold" style={{ color: "#F1C028" }}>{data.kai.funnel.cartRate}%</span>
              </div>
            </div>
          </div>

          {/* Daily trend */}
          {data.kai.dailyTrend.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--muted)" }}>DAILY TREND</div>
              <div className="grid gap-2">
                {data.kai.dailyTrend.map(d => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-sm font-mono w-24" style={{ color: "var(--muted)" }}>{d.date}</span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min((d.sessions / Math.max(...data.kai.dailyTrend.map(x => x.sessions), 1)) * 100, 100)}%`, backgroundColor: "#5A6FFF" }} />
                    </div>
                    <span className="text-sm font-bold w-20 text-right" style={{ color: "var(--foreground)" }}>{d.sessions} chats</span>
                    <span className="text-xs w-20 text-right" style={{ color: "var(--muted)" }}>{d.messages} msgs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
