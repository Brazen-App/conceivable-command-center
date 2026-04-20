"use client";

import { useState, useEffect } from "react";

const C = {
  bg: "#0C0C0B", surface: "#141412", surface2: "#1A1A18",
  border: "#1E1E1C", borderMid: "#2A2A28",
  blue: "#5A6FFF", green: "#1EAA55", pink: "#E37FB1",
  yellow: "#F1C028", purple: "#9686B9",
  text: "#F0EDE4", textMid: "#B8B4AC", textMuted: "#686460",
};

const ACCENT: Record<string, string> = { intake: C.blue, cycle: C.green, symptoms: C.pink };
const CAT_LABEL: Record<string, string> = { intake: "INTAKE", cycle: "CYCLE DATA", symptoms: "SYMPTOMS" };

interface Option { label: string; count: number; pct: number; flag?: boolean; }
interface Question { id: string; label: string; category: string; clinicalInsight?: string | null; options: Option[]; answeredCount?: number; }
interface Insight { id: string; headline: string; body: string; stats: string[]; color: string; }
interface SupplementStat { name: string; count: number; pct: number; }
interface AnalyticsData {
  meta: { totalResponses: number; completionRate: number; lastUpdated: string; avgTimeToComplete: string; };
  insights: Insight[] | null;
  questions: Question[];
  topSupplements?: SupplementStat[];
  prenatal?: { yes: number; no: number; yesRate: number } | null;
  maleFactor?: { count: number; pct: number } | null;
}

function AnimatedBar({ pct, max, color, flagged }: { pct: number; max: number; color: string; flagged?: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((pct / max) * 100), 150); return () => clearTimeout(t); }, [pct, max]);
  return (
    <div style={{ height: 5, background: "#252422", borderRadius: 3, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", borderRadius: 3, width: `${w}%`, background: flagged ? color : color + "55", transition: "width 0.75s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function QuestionCard({ q, show }: { q: Question; show: boolean }) {
  const color = ACCENT[q.category] || C.blue;
  const max = Math.max(...q.options.map(o => o.pct), 1);
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderTop: q.clinicalInsight ? `2px solid ${color}` : `1px solid ${C.border}`,
      borderRadius: 8, padding: "18px 20px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color, marginBottom: 4 }}>{CAT_LABEL[q.category] || q.category.toUpperCase()}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{q.label}</div>
          {q.answeredCount !== undefined && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{q.answeredCount} responses</div>}
        </div>
        {q.clinicalInsight && (
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 2, whiteSpace: "nowrap", flexShrink: 0, background: color + "1A", color, border: `1px solid ${color}33` }}>◆ CLINICAL</span>
        )}
      </div>
      {q.clinicalInsight && (
        <div style={{ background: color + "0E", border: `1px solid ${color}22`, borderLeft: `2px solid ${color}`, borderRadius: 4, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: C.textMid, lineHeight: 1.6 }}>{q.clinicalInsight}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map(opt => (
          <div key={opt.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <AnimatedBar pct={opt.pct} max={max} color={color} flagged={opt.flag} />
              <span style={{ fontSize: 12, fontWeight: 600, color: opt.flag ? C.text : C.textMuted, minWidth: 30, textAlign: "right" }}>{opt.pct}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: opt.flag ? C.textMid : C.textMuted }}>
                {opt.flag && <span style={{ color, marginRight: 5 }}>↑</span>}{opt.label}
              </span>
              <span style={{ fontSize: 10, color: C.textMuted }}>{opt.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuizIntelligencePage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/quiz-analytics");
      if (!res.ok) throw new Error(`${res.status}`);
      const d = await res.json();
      setData(d);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load().then(() => setTimeout(() => setShow(true), 100)); }, []);

  if (!data) return (
    <div style={{ fontFamily: "'DM Sans', system-ui", background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.textMuted, fontSize: 14 }}>{error || "Loading quiz intelligence..."}</div>
    </div>
  );

  const insights = data.insights || [];
  const insightCount = data.questions.filter(q => q.clinicalInsight).length;
  const filteredQs = filter === "all" ? data.questions
    : filter === "insights" ? data.questions.filter(q => q.clinicalInsight)
    : data.questions.filter(q => q.category === filter);

  const filters = [
    { id: "all", label: `All (${data.questions.length})` },
    { id: "insights", label: `◆ Clinical insights (${insightCount})` },
    { id: "cycle", label: "Cycle data" },
    { id: "symptoms", label: "Symptoms" },
    { id: "intake", label: "Intake" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.bg, minHeight: "100vh", padding: "28px 24px", color: C.text }}>
      {/* HEADER */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: C.blue, marginBottom: 8 }}>CONCEIVABLE · COMMAND CENTER</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: "Georgia, serif", color: C.text }}>Quiz Intelligence</h1>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>Updated {data.meta.lastUpdated} · {data.meta.totalResponses} responses</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { load(); }} style={{ fontSize: 11, fontWeight: 600, padding: "7px 14px", borderRadius: 4, border: `1px solid ${C.borderMid}`, background: "transparent", color: C.textMuted, cursor: "pointer" }}>
              {refreshing ? "Refreshing…" : "↺ Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* STAT ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 22 }}>
        {[
          { n: data.meta.totalResponses, l: "Total responses", c: C.blue },
          { n: data.prenatal ? `${data.prenatal.yesRate}%` : "—", l: "Want custom prenatal", c: C.green },
          { n: insightCount, l: "Clinical signals flagged", c: C.yellow },
          { n: data.maleFactor ? `${data.maleFactor.pct}%` : "—", l: "Male factor reported", c: C.pink },
        ].map(s => (
          <div key={s.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: `2px solid ${s.c}`, borderRadius: 6, padding: "14px 16px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.c, fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 5 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: C.textMid, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* TOP SUPPLEMENTS */}
      {data.topSupplements && data.topSupplements.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: C.textMuted, marginBottom: 10 }}>TOP RECOMMENDED SUPPLEMENTS</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {data.topSupplements.map((s, i) => (
              <div key={s.name} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: C.blue, fontFamily: "Georgia, serif" }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{s.pct}% of packs · {s.count} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLINICAL INSIGHT CARDS */}
      {insights.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: C.textMuted, marginBottom: 10 }}>KEY CLINICAL PATTERNS — ACROSS ALL RESPONDENTS</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(insights.length, 3)}, 1fr)`, gap: 10 }}>
            {insights.map((ins, i) => (
              <div key={ins.id} style={{
                background: C.surface, border: `1px solid ${ins.color}33`, borderLeft: `3px solid ${ins.color}`,
                borderRadius: 8, padding: "16px 18px",
                opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.4 }}>{ins.headline}</div>
                <div style={{ fontSize: 12, color: C.textMid, lineHeight: 1.6, marginBottom: 12 }}>{ins.body}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ins.stats.map(s => (
                    <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 3, background: ins.color + "18", color: ins.color, border: `1px solid ${ins.color}33` }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${C.border}`, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            fontSize: 11, fontWeight: 600, padding: "6px 13px", borderRadius: 4, cursor: "pointer",
            border: `1px solid ${filter === f.id ? C.blue : C.border}`,
            background: filter === f.id ? C.blue + "18" : "transparent",
            color: filter === f.id ? C.blue : C.textMuted,
            transition: "all 0.15s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* QUESTION GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filteredQs.map(q => <QuestionCard key={q.id} q={q} show={show} />)}
      </div>
    </div>
  );
}
