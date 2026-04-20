"use client";

import { useState, useEffect } from "react";

const T = {
  bg: "#0C0C0B",
  surface: "#141412",
  border: "#1E1E1C",
  blue: "#5A6FFF",
  blueLight: "#ACB7FF",
  green: "#1EAA55",
  pink: "#E37FB1",
  yellow: "#F1C028",
  red: "#E24D47",
  text: "#F0EDE4",
  textMid: "#B8B4AC",
  textMuted: "#686460",
  font: "system-ui, -apple-system, sans-serif",
};

interface FunnelData {
  counts: {
    page_view: number;
    form_focus: number;
    form_submit: number;
    stripe_started: number;
    stripe_completed: number;
    chat_opened: number;
    first_message: number;
  };
  uniqueUsers: Record<string, number>;
  dropoffs: {
    page_view_only: number;
    form_started_no_submit: number;
    form_submitted_no_stripe: number;
    stripe_started_not_completed: number;
    paid_no_chat_open: number;
    chat_opened_no_message: number;
    first_message_only: number;
    converted: number;
  };
  totalJourneys: number;
  recent: { email: string | null; steps: string[]; lastSeen: string }[];
  trafficSources: { source: string; count: number }[];
  revenue: { stripeKaiMRR: number; stripeKaiActive: number; stripeKaiTrialing: number };
  generatedAt: string;
}

const STEPS = [
  { key: "page_view", label: "Page Views", color: "#686460", icon: "👀" },
  { key: "form_submit", label: "Form Submitted", color: "#5A6FFF", icon: "✍️" },
  { key: "stripe_started", label: "Stripe Started", color: "#ACB7FF", icon: "💳" },
  { key: "stripe_completed", label: "Stripe Completed", color: "#F1C028", icon: "✅" },
  { key: "chat_opened", label: "Chat Opened", color: "#E37FB1", icon: "💬" },
  { key: "first_message", label: "First Message Sent", color: "#1EAA55", icon: "🎯" },
];

const DROPOFF_LABELS: Record<string, { label: string; severity: "low" | "med" | "high" }> = {
  page_view_only: { label: "Page view only — never engaged form", severity: "low" },
  form_started_no_submit: { label: "Started form but didn't submit", severity: "med" },
  form_submitted_no_stripe: { label: "Submitted form but Stripe never started (BUG?)", severity: "high" },
  stripe_started_not_completed: { label: "Bailed at Stripe checkout", severity: "high" },
  paid_no_chat_open: { label: "Paid but never landed in chat (BUG?)", severity: "high" },
  chat_opened_no_message: { label: "Opened chat but didn't type", severity: "high" },
  first_message_only: { label: "Sent one message and bounced", severity: "med" },
  converted: { label: "Engaged — multiple messages", severity: "low" },
};

export default function FunnelDetailPage() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all">("7d");

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    let from = "";
    if (range === "today") from = now.toISOString().slice(0, 10);
    else if (range === "7d") {
      const d = new Date(); d.setDate(d.getDate() - 7);
      from = d.toISOString().slice(0, 10);
    } else if (range === "30d") {
      const d = new Date(); d.setDate(d.getDate() - 30);
      from = d.toISOString().slice(0, 10);
    }
    const url = from ? `/api/admin/kai-funnel-detail?from=${from}` : "/api/admin/kai-funnel-detail";
    fetch(url)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, padding: 40, textAlign: "center" }}>
        Loading funnel data...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, padding: 40, textAlign: "center" }}>
        Failed to load funnel data
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(data.counts), 1);
  const totalDropoffs = Object.values(data.dropoffs).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, padding: "24px 24px 60px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: T.blue, fontWeight: 700, marginBottom: 6 }}>
              Kai Conversion Funnel
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Where People Drop Off</h1>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "6px 0 0" }}>
              Real-time tracking of every step from landing page → first message
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["today", "7d", "30d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: range === r ? T.blue : T.surface,
                  color: range === r ? T.text : T.textMid,
                  border: `1px solid ${range === r ? T.blue : T.border}`,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue + Subscribers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.green}30`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Kai MRR</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.green }}>${data.revenue?.stripeKaiMRR?.toLocaleString() || 0}<span style={{ fontSize: 12, fontWeight: 500, color: T.textMuted }}>/mo</span></div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>From active Kai subscriptions</div>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.blue}30`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Active Subs</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.blue }}>{data.revenue?.stripeKaiActive || 0}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Paying customers</div>
          </div>
          <div style={{ background: T.surface, border: `1px solid ${T.yellow}30`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Trialing</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.yellow }}>{data.revenue?.stripeKaiTrialing || 0}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>In free trial period</div>
          </div>
        </div>

        {/* Traffic Sources */}
        {data.trafficSources && data.trafficSources.length > 0 && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Traffic Sources</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Where your visitors are coming from (page views, by source).</div>
            {data.trafficSources.map((s) => {
              const total = data.trafficSources.reduce((sum, x) => sum + x.count, 0);
              const pct = total > 0 ? Math.round((s.count / total) * 1000) / 10 : 0;
              return (
                <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ flex: 1, fontSize: 13, color: T.text, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.source}</div>
                  <div style={{ flex: "0 0 200px", height: 8, borderRadius: 4, background: `${T.blue}10`, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: T.blue, borderRadius: 4 }} />
                  </div>
                  <div style={{ flex: "0 0 60px", textAlign: "right", fontSize: 13, fontWeight: 700, color: T.text }}>{s.count}</div>
                  <div style={{ flex: "0 0 50px", textAlign: "right", fontSize: 11, color: T.textMuted }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Funnel steps */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Funnel Steps</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 24 }}>Each step counts unique events. Conversion shown vs. previous step.</div>
          {STEPS.map((step, i) => {
            const count = (data.counts as Record<string, number>)[step.key] || 0;
            const widthPct = (count / maxCount) * 100;
            const prev = i > 0 ? (data.counts as Record<string, number>)[STEPS[i - 1].key] || 0 : 0;
            const conversionFromPrev = i > 0 && prev > 0 ? Math.round((count / prev) * 1000) / 10 : null;
            const dropoffFromPrev = i > 0 ? prev - count : 0;

            return (
              <div key={step.key} style={{ marginBottom: 4 }}>
                {i > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 20, padding: "4px 0 4px 20px", color: T.textMuted, fontSize: 12 }}>
                    <span>↓</span>
                    <span style={{ color: conversionFromPrev && conversionFromPrev >= 50 ? T.green : conversionFromPrev && conversionFromPrev >= 20 ? T.yellow : T.red, fontWeight: 700 }}>
                      {conversionFromPrev ?? 0}% conversion
                    </span>
                    {dropoffFromPrev > 0 && (
                      <span style={{ color: T.textMuted, fontSize: 11 }}>
                        ({dropoffFromPrev} dropped)
                      </span>
                    )}
                  </div>
                )}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: `linear-gradient(90deg, ${step.color}18 0%, ${T.surface} ${Math.max(widthPct, 30)}%)`,
                  border: `1px solid ${step.color}30`,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${step.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>{step.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>{count}</div>
                  </div>
                  <div style={{ width: 80, height: 6, borderRadius: 3, background: `${step.color}20`, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ width: `${Math.max(widthPct, 2)}%`, height: "100%", borderRadius: 3, background: step.color, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Overall conversion */}
          <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 12, background: `${T.green}10`, border: `1px solid ${T.green}30`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: T.textMid }}>Overall: page view → first message</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.green }}>
              {data.counts.page_view > 0 ? Math.round((data.counts.first_message / data.counts.page_view) * 1000) / 10 : 0}%
            </span>
          </div>
        </div>

        {/* Drop-off breakdown */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Where People Get Stuck</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>
            {totalJourneys(data)} unique journeys tracked. Numbers show people whose final step matched.
          </div>
          {Object.entries(data.dropoffs).map(([key, count]) => {
            const meta = DROPOFF_LABELS[key];
            if (!meta) return null;
            const pct = totalDropoffs > 0 ? Math.round((count / totalDropoffs) * 1000) / 10 : 0;
            const sevColor = meta.severity === "high" ? T.red : meta.severity === "med" ? T.yellow : T.green;
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: `${sevColor}08`, border: `1px solid ${sevColor}20`, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: sevColor, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{meta.label}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: sevColor }}>{count}</div>
                <div style={{ fontSize: 11, color: T.textMuted, width: 50, textAlign: "right" }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* Recent journeys */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Recent Journeys</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>Last 20 unique users and how far they got.</div>
          {data.recent.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: 13, padding: 16, textAlign: "center" }}>
              No tracked journeys yet. Data will appear as users hit the page.
            </div>
          )}
          {data.recent.map((j, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < data.recent.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 240px", color: j.email ? T.textMid : T.textMuted, fontSize: 12, fontFamily: "monospace" }}>
                {j.email || "anonymous"}
              </div>
              <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {STEPS.map((step) => {
                  const reached = j.steps.includes(step.key);
                  return (
                    <div key={step.key} title={step.label} style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: reached ? `${step.color}25` : `${T.border}50`,
                      border: `1px solid ${reached ? step.color : T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, opacity: reached ? 1 : 0.4,
                    }}>{step.icon}</div>
                  );
                })}
              </div>
              <div style={{ flex: "0 0 120px", textAlign: "right", fontSize: 11, color: T.textMuted }}>
                {new Date(j.lastSeen).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, fontSize: 11, color: T.textMuted, textAlign: "center" }}>
          Updated {new Date(data.generatedAt).toLocaleTimeString()} · Range: {range}
        </div>
      </div>
    </div>
  );
}

function totalJourneys(d: FunnelData) { return d.totalJourneys; }
