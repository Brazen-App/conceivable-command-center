"use client";

import { useState, useEffect } from "react";

interface Report {
  date: string;
  summary: {
    landingViews: number;
    totalUsers: number;
    gotPack: number;
    packRate: number;
    shortSessions: number;
    droppedAtPack: number;
  };
  postPackBehavior: {
    askedQuestions: number;
    questionRate: number;
    alreadyTaking: number;
    alreadyTakingRate: number;
    mentionedCost: number;
    askedAboutApp: number;
    uploadedBBT: number;
  };
  topConditions: { name: string; count: number; pct: number }[];
  topSupplements: { key: string; name: string; count: number; pct: number }[];
  sampleQuestions: string[];
  objections: string[];
  recommendations: string[];
  userProfiles: { email: string; concerns: string; msgs: number; hasPack: boolean; lastActive: string }[];
}

export default function KaiDailyReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/kai-daily-report")
      .then(r => r.json())
      .then(d => { setReport(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8" style={{ color: "var(--muted)" }}>Generating insights report...</div>;
  if (!report) return <div className="p-8" style={{ color: "var(--muted)" }}>Failed to load report</div>;

  const { summary: s, postPackBehavior: ppb } = report;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Kai Daily Insights</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Report for {report.date} — what we learned from user conversations</p>
      </div>

      {/* ── Recommendations ── */}
      {report.recommendations.length > 0 && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "#5A6FFF08", border: "1px solid #5A6FFF20" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#5A6FFF" }}>Recommendations</div>
          <div className="space-y-3">
            {report.recommendations.map((r, i) => {
              const [title, ...rest] = r.split(": ");
              return (
                <div key={i} className="flex gap-3">
                  <span className="text-lg mt-0.5">💡</span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{title}</div>
                    <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>{rest.join(": ")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Funnel Summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Landing Views", value: s.landingViews, color: "#ACB7FF" },
          { label: "Total Users", value: s.totalUsers, color: "#5A6FFF" },
          { label: "Got a Pack", value: s.gotPack, sub: `${s.packRate}%`, color: "#1EAA55" },
          { label: "Dropped at Pack", value: s.droppedAtPack, color: "#E24D47" },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{k.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</div>
            {k.sub && <div className="text-xs" style={{ color: "var(--muted)" }}>{k.sub} conversion</div>}
          </div>
        ))}
      </div>

      {/* ── Post-Pack Behavior ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>What Happens After the Pack</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Asked questions", value: ppb.askedQuestions, sub: `${ppb.questionRate}% of pack recipients`, color: "#5A6FFF" },
            { label: "Already supplementing", value: ppb.alreadyTaking, sub: `${ppb.alreadyTakingRate}% — biggest blocker`, color: "#F1C028" },
            { label: "Mentioned cost", value: ppb.mentionedCost, sub: ppb.mentionedCost === 0 ? "Price is NOT the issue" : "", color: "#1EAA55" },
            { label: "Uploaded BBT", value: ppb.uploadedBBT, sub: "engagement signal", color: "#9686B9" },
            { label: "Asked about app", value: ppb.askedAboutApp, sub: "demand signal", color: "#E37FB1" },
            { label: "Short sessions", value: s.shortSessions, sub: "< 5 messages", color: "#E24D47" },
          ].map(m => (
            <div key={m.label}>
              <div className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</div>
              <div className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{m.label}</div>
              {m.sub && <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{m.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Conditions ── */}
      {report.topConditions.length > 0 && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>User Conditions</div>
          <div className="space-y-2">
            {report.topConditions.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs font-medium w-28" style={{ color: "var(--foreground)" }}>{c.name}</span>
                <div className="flex-1 h-6 rounded" style={{ backgroundColor: "var(--border)" }}>
                  <div className="h-full rounded flex items-center px-2" style={{ width: `${Math.max(c.pct, 5)}%`, backgroundColor: "#5A6FFF25" }}>
                    <span className="text-[10px] font-bold" style={{ color: "#5A6FFF" }}>{c.count} ({c.pct}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Top Supplements ── */}
      {report.topSupplements.length > 0 && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Most Recommended Supplements</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {report.topSupplements.slice(0, 9).map(s => (
              <div key={s.key} className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{s.name}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>In {s.pct}% of packs ({s.count}x)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── What Users Ask After Pack ── */}
      {report.sampleQuestions.length > 0 && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>What Users Say After Getting Their Pack</div>
          <div className="space-y-2">
            {report.sampleQuestions.map((q, i) => (
              <div key={i} className="text-sm py-1.5" style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>
                "{q}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── User Profiles ── */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>User Profiles (by engagement)</div>
        <div className="space-y-1">
          {report.userProfiles.map(u => (
            <div key={u.email} className="flex items-center gap-3 py-2 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-medium w-48 truncate" style={{ color: "var(--foreground)" }}>{u.email}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                backgroundColor: u.hasPack ? "#1EAA5515" : "#E24D4715",
                color: u.hasPack ? "#1EAA55" : "#E24D47",
              }}>{u.hasPack ? "Got pack" : "No pack"}</span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>{u.msgs} msgs</span>
              <span className="text-xs truncate flex-1" style={{ color: "var(--muted)" }}>{u.concerns}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
