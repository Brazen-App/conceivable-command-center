"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Minus, Loader2, FlaskConical, TrendingUp, Lightbulb, CheckCircle2, XCircle, Clock } from "lucide-react";
import { colors } from "@/lib/theme";

// ── Types ───────────────────────────────────────────────────

interface DailyLog {
  id: string;
  date: string;
  landingViews: number;
  chatsStarted: number;
  emailsCaptured: number;
  packsBuilt: number;
  cartClicks: number;
  purchases: number;
  revenue: number;
  subscribers: number;
  insights: string | null;
  recommendations: string | null;
  topConcerns: string | null;
}

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  change: string;
  status: string;
  startDate: string;
  endDate: string | null;
  baselineMetric: string;
  resultMetric: string | null;
  result: string | null;
  notes: string | null;
}

interface DashboardData {
  today: DailyLog | null;
  yesterday: DailyLog | null;
  sevenDayAvg: Record<string, number>;
  last14Days: DailyLog[];
  activeExperiments: Experiment[];
  completedExperiments: Experiment[];
  trends: Record<string, { direction: string; pct: number }>;
}

// ── Metric comparison card ──────────────────────────────────

function ComparisonCard({
  label,
  today,
  yesterday,
  avg7,
  trend,
  format,
}: {
  label: string;
  today: number;
  yesterday: number;
  avg7: number;
  trend?: { direction: string; pct: number };
  format?: "currency" | "number";
}) {
  const diff = today - yesterday;
  const isUp = diff > 0;
  const isDown = diff < 0;

  const fmt = (v: number) => {
    if (format === "currency") return `$${v.toFixed(2)}`;
    return v.toLocaleString();
  };

  return (
    <div
      className="rounded-2xl p-5 transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        {trend && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor:
                trend.direction === "up" ? `${colors.green}12` : trend.direction === "down" ? `${colors.red}12` : `${colors.yellow}12`,
              color: trend.direction === "up" ? colors.green : trend.direction === "down" ? colors.red : colors.yellow,
            }}
          >
            {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}{trend.pct}% 7d
          </span>
        )}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          {fmt(today)}
        </span>
        <div className="flex items-center gap-1 mb-1">
          {isUp ? (
            <ArrowUpRight size={14} style={{ color: colors.green }} />
          ) : isDown ? (
            <ArrowDownRight size={14} style={{ color: colors.red }} />
          ) : (
            <Minus size={14} style={{ color: "var(--muted)" }} />
          )}
          <span
            className="text-xs font-semibold"
            style={{ color: isUp ? colors.green : isDown ? colors.red : "var(--muted)" }}
          >
            {isUp ? "+" : ""}{diff}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          Yesterday: {fmt(yesterday)}
        </span>
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          7d avg: {fmt(avg7)}
        </span>
      </div>
    </div>
  );
}

// ── Mini bar chart using divs ───────────────────────────────

function MiniChart({ data, dataKey, color, label }: { data: DailyLog[]; dataKey: keyof DailyLog; color: string; label: string }) {
  const values = [...data].reverse().map((d) => (d[dataKey] as number) || 0);
  const dates = [...data].reverse().map((d) => d.date);
  const max = Math.max(...values, 1);

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {label} (14 days)
      </span>
      <div className="flex items-end gap-1 mt-3" style={{ height: 80 }}>
        {values.map((v, i) => (
          <div key={dates[i]} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${Math.max((v / max) * 100, 3)}%`,
                backgroundColor: i === values.length - 1 ? color : `${color}50`,
                minHeight: 3,
              }}
              title={`${dates[i]}: ${v}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px]" style={{ color: "var(--muted)" }}>{dates[0]?.slice(5)}</span>
        <span className="text-[9px]" style={{ color: "var(--muted)" }}>{dates[dates.length - 1]?.slice(5)}</span>
      </div>
    </div>
  );
}

// ── Experiment card ─────────────────────────────────────────

function ExperimentCard({ exp, onComplete }: { exp: Experiment; onComplete?: (id: string, result: string) => void }) {
  const statusIcon =
    exp.result === "won" ? (
      <CheckCircle2 size={16} style={{ color: colors.green }} />
    ) : exp.result === "lost" ? (
      <XCircle size={16} style={{ color: colors.red }} />
    ) : exp.result === "inconclusive" ? (
      <Minus size={16} style={{ color: colors.yellow }} />
    ) : (
      <Clock size={16} style={{ color: colors.blue }} />
    );

  const statusColor =
    exp.result === "won" ? colors.green : exp.result === "lost" ? colors.red : exp.result === "inconclusive" ? colors.yellow : colors.blue;

  return (
    <div
      className="rounded-xl p-4 transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--surface)", border: `1px solid ${statusColor}25` }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            {exp.name}
          </span>
        </div>
        <span
          className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${statusColor}12`, color: statusColor }}
        >
          {exp.result || exp.status}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
        <strong>Hypothesis:</strong> {exp.hypothesis}
      </p>
      <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
        <strong>Change:</strong> {exp.change}
      </p>
      <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--muted)" }}>
        <span>Baseline: {exp.baselineMetric}</span>
        {exp.resultMetric && <span>Result: {exp.resultMetric}</span>}
        <span>Started: {exp.startDate}</span>
        {exp.endDate && <span>Ended: {exp.endDate}</span>}
      </div>
      {exp.notes && (
        <p className="text-[11px] mt-2 italic" style={{ color: "var(--muted)" }}>
          {exp.notes}
        </p>
      )}
      {exp.status === "active" && onComplete && (
        <div className="flex gap-2 mt-3">
          {(["won", "lost", "inconclusive"] as const).map((r) => (
            <button
              key={r}
              onClick={() => onComplete(exp.id, r)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-opacity hover:opacity-80"
              style={{
                backgroundColor:
                  r === "won" ? `${colors.green}12` : r === "lost" ? `${colors.red}12` : `${colors.yellow}12`,
                color: r === "won" ? colors.green : r === "lost" ? colors.red : colors.yellow,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── New experiment form ─────────────────────────────────────

function NewExperimentForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", hypothesis: "", change: "", baselineMetric: "" });

  const handleSubmit = async () => {
    if (!form.name || !form.hypothesis || !form.change || !form.baselineMetric) return;
    setSaving(true);
    try {
      await fetch("/api/admin/kai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_experiment", ...form }),
      });
      setForm({ name: "", hypothesis: "", change: "", baselineMetric: "" });
      setOpen(false);
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ backgroundColor: `${colors.blue}12`, color: colors.blue, border: `1px solid ${colors.blue}25` }}
      >
        + New Experiment
      </button>
    );
  }

  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ backgroundColor: "var(--surface)", border: `1px solid ${colors.blue}25` }}
    >
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.blue }}>
        New Experiment
      </p>
      {(["name", "hypothesis", "change", "baselineMetric"] as const).map((field) => (
        <div key={field}>
          <label className="text-[10px] font-semibold uppercase tracking-widest block mb-1" style={{ color: "var(--muted)" }}>
            {field === "baselineMetric" ? "Baseline Metric" : field}
          </label>
          <input
            type="text"
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={
              field === "name"
                ? "e.g. CTA Button Color Test"
                : field === "hypothesis"
                ? "e.g. Changing CTA to green will increase clicks 20%"
                : field === "change"
                ? "e.g. Changed button from blue to green"
                : "e.g. landing_to_chat: 4%"
            }
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={saving || !form.name}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: colors.blue }}
        >
          {saving ? "Creating..." : "Create Experiment"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function KaiOptimizeLab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/kai-optimize");
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      await fetch("/api/admin/kai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "log_daily" }),
      });
      await fetchData();
    } finally {
      setGenerating(false);
    }
  };

  const completeExperiment = async (id: string, result: string) => {
    await fetch("/api/admin/kai-optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_experiment", id, result }),
    });
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin" style={{ color: colors.blue }} />
      </div>
    );
  }

  const t = data?.today;
  const y = data?.yesterday;
  const avg = data?.sevenDayAvg || {} as Record<string, number>;
  const trends = data?.trends || {};

  const metrics = [
    { label: "Landing Views", key: "landingViews", format: "number" as const },
    { label: "Chats Started", key: "chatsStarted", format: "number" as const },
    { label: "Emails Captured", key: "emailsCaptured", format: "number" as const },
    { label: "Packs Built", key: "packsBuilt", format: "number" as const },
    { label: "Cart Clicks", key: "cartClicks", format: "number" as const },
    { label: "Purchases", key: "purchases", format: "number" as const },
    { label: "Revenue", key: "revenue", format: "currency" as const },
    { label: "Subscribers", key: "subscribers", format: "number" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/departments/marketing/kai-chats"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ backgroundColor: `${colors.red}12` }}
          >
            <ArrowLeft size={16} style={{ color: colors.red }} />
          </a>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              Kai Optimization Lab
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Track experiments, daily metrics, and conversion optimization
            </p>
          </div>
        </div>
        <button
          onClick={generateReport}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: colors.red }}
        >
          {generating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FlaskConical size={14} />
          )}
          {generating ? "Generating..." : "Generate Today's Report"}
        </button>
      </div>

      {/* TODAY vs YESTERDAY Comparison Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} style={{ color: colors.green }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Today vs Yesterday
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <ComparisonCard
              key={m.key}
              label={m.label}
              today={((t as Record<string, number> | null)?.[m.key] as number) || 0}
              yesterday={((y as Record<string, number> | null)?.[m.key] as number) || 0}
              avg7={(avg[m.key] as number) || 0}
              trend={trends[m.key]}
              format={m.format}
            />
          ))}
        </div>
      </div>

      {/* 14-Day Trend Charts */}
      {data?.last14Days && data.last14Days.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: colors.blue }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              14-Day Trends
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniChart data={data.last14Days} dataKey="chatsStarted" color={colors.blue} label="Chats Started" />
            <MiniChart data={data.last14Days} dataKey="emailsCaptured" color={colors.green} label="Emails Captured" />
            <MiniChart data={data.last14Days} dataKey="packsBuilt" color={colors.yellow} label="Packs Built" />
            <MiniChart data={data.last14Days} dataKey="landingViews" color={colors.pink} label="Landing Views" />
          </div>
        </div>
      )}

      {/* Active Experiments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={14} style={{ color: colors.blue }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Active Experiments
            </span>
            {data?.activeExperiments && data.activeExperiments.length > 0 && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}
              >
                {data.activeExperiments.length}
              </span>
            )}
          </div>
          <NewExperimentForm onCreated={fetchData} />
        </div>
        {data?.activeExperiments && data.activeExperiments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.activeExperiments.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} onComplete={completeExperiment} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <FlaskConical size={24} className="mx-auto mb-2" style={{ color: "var(--muted)", opacity: 0.4 }} />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              No active experiments. Create one to start testing!
            </p>
          </div>
        )}
      </div>

      {/* Completed Experiments */}
      {data?.completedExperiments && data.completedExperiments.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} style={{ color: colors.green }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Completed Experiments
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.completedExperiments.map((exp) => (
              <ExperimentCard key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      )}

      {/* Daily Insights */}
      {data?.last14Days && data.last14Days.some((d) => d.insights) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} style={{ color: colors.yellow }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Daily Insights
            </span>
          </div>
          <div className="space-y-3">
            {data.last14Days
              .filter((d) => d.insights)
              .slice(0, 7)
              .map((d) => (
                <div
                  key={d.date}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                      {new Date(d.date + "T12:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--muted)" }}>
                      <span>{d.chatsStarted} chats</span>
                      <span>{d.emailsCaptured} emails</span>
                      <span>{d.packsBuilt} packs</span>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
                    {d.insights}
                  </div>
                  {d.recommendations && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.red }}>
                        Recommendations
                      </span>
                      <div className="text-xs leading-relaxed whitespace-pre-line mt-1" style={{ color: colors.red }}>
                        {d.recommendations}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
