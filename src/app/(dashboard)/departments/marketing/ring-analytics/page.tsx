"use client";

import { useState, useEffect } from "react";

interface RingDataPoint {
  date: string;
  temperature: number | null;
  hrv: number | null;
  spo2: number | null;
  sleepHours: number | null;
  sleepScore: number | null;
  steps: number | null;
  stress: number | null;
}

interface RingSummary {
  daysCovered: number;
  avgTemp: number | null;
  avgHrv: number | null;
  avgSpo2: number | null;
  avgSleepHours: number | null;
  avgSteps: number | null;
  avgStress: number | null;
  minTemp: number | null;
  maxTemp: number | null;
  tempTrend: string | null;
  hrvTrend: string | null;
}

interface UserRingData {
  email: string;
  dataPoints: RingDataPoint[];
  summary: RingSummary;
}

const COLORS = {
  blue: "#5A6FFF", bb: "#ACB7FF", green: "#1EAA55", pink: "#E37FB1",
  purple: "#9686B9", yellow: "#F1C028", red: "#E24D47", teal: "#78C3BF",
};

function TrendBadge({ trend }: { trend: string | null }) {
  if (!trend) return <span style={{ fontSize: 11, color: "var(--muted)" }}>—</span>;
  const c = trend === "rising" ? COLORS.green : trend === "declining" ? COLORS.red : COLORS.bb;
  const arrow = trend === "rising" ? "↑" : trend === "declining" ? "↓" : "→";
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c, display: "flex", alignItems: "center", gap: 3 }}>
      {arrow} {trend}
    </span>
  );
}

function MetricCard({ label, value, unit, color, sub }: { label: string; value: string | number | null; unit?: string; color: string; sub?: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value ?? "—"}{unit && <span className="text-sm font-medium ml-0.5" style={{ color: "var(--muted)" }}>{unit}</span>}
      </div>
      {sub && <div className="mt-1">{sub}</div>}
    </div>
  );
}

export default function RingAnalyticsPage() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<UserRingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(14);
  const [allEmails, setAllEmails] = useState<string[]>([]);

  // Fetch list of emails that have ring data
  useEffect(() => {
    fetch("/api/ring-data?email=__list__&days=1")
      .catch(() => null);
    // For now, we'll use manual email entry since we don't have a list endpoint
  }, []);

  const fetchData = async (e?: string) => {
    const q = e || email;
    if (!q) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/ring-data?email=${encodeURIComponent(q)}&days=${days}`);
      const d = await r.json();
      setData(d);
    } catch { setData(null); }
    finally { setLoading(false); }
  };

  const s = data?.summary;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Halo Ring Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>View ring data for any user with a connected Halo Ring</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--muted)" }}>User Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchData()}
            placeholder="Enter user email..."
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--muted)" }}>Days</label>
          <select value={days} onChange={e => setDays(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <button onClick={() => fetchData()}
          className="px-5 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: COLORS.blue, color: "#fff" }}>
          View Data
        </button>
      </div>

      {loading && <div className="text-center py-12" style={{ color: "var(--muted)" }}>Loading ring data...</div>}

      {data && !loading && (
        <>
          {data.dataPoints.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-3xl mb-3 opacity-30">💍</div>
              <p className="font-medium" style={{ color: "var(--foreground)" }}>No ring data found</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>This user hasn't synced their Halo Ring yet</p>
            </div>
          ) : (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="Avg Temperature" value={s?.avgTemp ?? null} unit="°F" color={COLORS.pink}
                  sub={<TrendBadge trend={s?.tempTrend ?? null} />} />
                <MetricCard label="Avg HRV" value={s?.avgHrv ?? null} unit="ms" color={COLORS.blue}
                  sub={<TrendBadge trend={s?.hrvTrend ?? null} />} />
                <MetricCard label="Avg Sleep" value={s?.avgSleepHours ?? null} unit="hrs" color={COLORS.purple} />
                <MetricCard label="Avg Steps" value={s?.avgSteps ? Math.round(s.avgSteps).toLocaleString() : null} color={COLORS.green} />
              </div>

              {/* Secondary metrics */}
              <div className="grid grid-cols-3 gap-3">
                <MetricCard label="Avg SpO2" value={s?.avgSpo2 ?? null} unit="%" color={COLORS.teal} />
                <MetricCard label="Avg Stress" value={s?.avgStress ?? null} unit="/10" color={COLORS.red} />
                <MetricCard label="Days Tracked" value={s?.daysCovered ?? null} color={COLORS.bb} />
              </div>

              {/* Temperature range */}
              {s?.minTemp && s?.maxTemp && (
                <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Temperature Range</div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm" style={{ color: "var(--muted)" }}>Low</div>
                      <div className="text-xl font-bold" style={{ color: COLORS.blue }}>{s.minTemp}°F</div>
                    </div>
                    <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{
                        background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.pink}, ${COLORS.red})`,
                        width: "100%",
                      }} />
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: "var(--muted)" }}>High</div>
                      <div className="text-xl font-bold" style={{ color: COLORS.pink }}>{s.maxTemp}°F</div>
                    </div>
                  </div>
                  {s.maxTemp >= 98 && (
                    <p className="text-xs mt-3" style={{ color: COLORS.green }}>
                      Post-ovulation temps reaching 98°F+ is a positive sign for progesterone production.
                    </p>
                  )}
                </div>
              )}

              {/* Daily data table */}
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Daily Readings</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Date", "Temp", "HRV", "SpO2", "Sleep", "Steps", "Stress"].map(h => (
                          <th key={h} className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.dataPoints.map(d => (
                        <tr key={d.date} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="px-4 py-2 font-mono text-xs" style={{ color: "var(--foreground)" }}>{d.date}</td>
                          <td className="px-4 py-2" style={{ color: d.temperature && d.temperature >= 98 ? COLORS.pink : "var(--foreground)" }}>
                            {d.temperature ? `${d.temperature}°F` : "—"}
                          </td>
                          <td className="px-4 py-2" style={{ color: "var(--foreground)" }}>{d.hrv ? `${d.hrv}ms` : "—"}</td>
                          <td className="px-4 py-2" style={{ color: "var(--foreground)" }}>{d.spo2 ? `${d.spo2}%` : "—"}</td>
                          <td className="px-4 py-2" style={{ color: "var(--foreground)" }}>{d.sleepHours ? `${d.sleepHours}h` : "—"}</td>
                          <td className="px-4 py-2" style={{ color: "var(--foreground)" }}>{d.steps?.toLocaleString() || "—"}</td>
                          <td className="px-4 py-2" style={{ color: d.stress && d.stress > 6 ? COLORS.red : "var(--foreground)" }}>{d.stress ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ask Kai CTA */}
              <div className="rounded-2xl p-6 text-center" style={{
                background: `linear-gradient(135deg, ${COLORS.blue}12, ${COLORS.purple}08)`,
                border: `1px solid ${COLORS.blue}20`,
              }}>
                <a href={`https://conceivable-quiz.vercel.app/kai`}
                  className="inline-block px-8 py-3.5 rounded-full text-base font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`,
                    color: "#fff",
                    boxShadow: `0 4px 24px ${COLORS.blue}35`,
                    textDecoration: "none",
                  }}>
                  Ask Kai
                </a>
                <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
                  Kai can explain what all this means for your health and fertility — and help you improve them.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
