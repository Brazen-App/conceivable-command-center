"use client";

import { useState, useEffect } from "react";

/* ── Theme tokens (dark dashboard) ──────────────────────────── */
const T = {
  bg: "#0C0C0B",
  surface: "#141412",
  surfaceHover: "#1A1A17",
  border: "#1E1E1C",
  blue: "#5A6FFF",
  green: "#1EAA55",
  pink: "#E37FB1",
  yellow: "#F1C028",
  red: "#E24D47",
  purple: "#9686B9",
  paleBlue: "#78C3BF",
  text: "#F0EDE4",
  textMid: "#B8B4AC",
  textMuted: "#686460",
};

/* ── Types ───────────────────────────────────────────────────── */

interface UserProfile {
  email: string;
  name: string | null;
  concerns: string[];
  ageRange: string | null;
  cycleDetails: string[];
  energyStress: string[];
  supplements: string[];
  objections: string[];
  emotions: string[];
  packPresented: boolean;
  cartShown: boolean;
  sessionCount: number;
  messageCount: number;
  questions: string[];
  lastSeen: string;
  firstSeen: string;
}

interface IntelligenceData {
  totalUsers: number;
  totalSessions: number;
  totalMessages: number;
  avgMsgsPerSession: number;
  packPresentationRate: number;
  topConcern: string;
  profiles: UserProfile[];
  insights: {
    topConcerns: { concern: string; count: number; pct: number }[];
    topObjections: { objection: string; count: number }[];
    topQuestions: { topic: string; count: number; samples: string[] }[];
    emotionalPatterns: { pattern: string; count: number }[];
    conversionBlockers: { blocker: string; count: number }[];
    topSupplements: { name: string; count: number }[];
    engagementTopics: { topic: string; avgMessages: number; sessionCount: number }[];
  };
}

/* ── Component ───────────────────────────────────────────────── */

export default function KaiIntelligencePage() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/kai-intelligence")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load intelligence data");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: T.textMuted, fontSize: "14px" }}>Loading intelligence data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: T.red, fontSize: "14px" }}>{error || "No data available"}</div>
      </div>
    );
  }

  const { insights } = data;
  const maxConcernCount = insights.topConcerns.length > 0 ? insights.topConcerns[0].count : 1;
  const maxSupplementCount = insights.topSupplements.length > 0 ? insights.topSupplements[0].count : 1;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "24px", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: T.green, boxShadow: `0 0 8px ${T.green}60`,
          }} />
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.5px" }}>
            Kai Research Intelligence
          </h1>
        </div>
        <p style={{ fontSize: "13px", color: T.textMuted, margin: "8px 0 0 20px" }}>
          Deep analysis of every Kai conversation — concerns, objections, emotions, and conversion patterns
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Unique Users", value: data.totalUsers, color: T.blue },
          { label: "Avg Messages / Session", value: data.avgMsgsPerSession, color: T.paleBlue },
          { label: "Pack Presentation Rate", value: `${data.packPresentationRate}%`, color: T.green },
          { label: "Top Concern", value: data.topConcern, color: T.pink, isText: true },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: T.textMuted, marginBottom: "8px" }}>
              {kpi.label}
            </div>
            <div style={{
              fontSize: kpi.isText ? "18px" : "32px",
              fontWeight: 700,
              color: kpi.color,
              lineHeight: 1.1,
            }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>

        {/* What Women Are Asking */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 16px 0" }}>
            What Women Are Asking
          </h2>
          {insights.topQuestions.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No questions detected yet</div>
          )}
          {insights.topQuestions.map((q, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", padding: "8px 12px", borderRadius: "8px",
                  background: expandedQuestion === q.topic ? `${T.blue}15` : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() => setExpandedQuestion(expandedQuestion === q.topic ? null : q.topic)}
                onMouseEnter={(e) => { if (expandedQuestion !== q.topic) (e.currentTarget as HTMLDivElement).style.background = `${T.surfaceHover}`; }}
                onMouseLeave={(e) => { if (expandedQuestion !== q.topic) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: T.blue,
                    background: `${T.blue}15`, padding: "2px 8px", borderRadius: "10px",
                  }}>
                    {q.count}
                  </span>
                  <span style={{ fontSize: "13px", color: T.text }}>{q.topic}</span>
                </div>
                <span style={{ fontSize: "11px", color: T.textMuted }}>
                  {expandedQuestion === q.topic ? "−" : "+"}
                </span>
              </div>
              {expandedQuestion === q.topic && q.samples.length > 0 && (
                <div style={{ padding: "8px 12px 4px 42px" }}>
                  {q.samples.map((s, si) => (
                    <div key={si} style={{
                      fontSize: "12px", color: T.textMid, marginBottom: "6px",
                      fontStyle: "italic", lineHeight: 1.4,
                    }}>
                      &ldquo;{s}&rdquo;
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Concerns — Horizontal Bar Chart */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 16px 0" }}>
            Concerns
          </h2>
          {insights.topConcerns.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No concerns detected yet</div>
          )}
          {insights.topConcerns.slice(0, 12).map((c, i) => {
            const barWidth = Math.max((c.count / maxConcernCount) * 100, 4);
            const barColors = [T.pink, T.blue, T.purple, T.paleBlue, T.green, T.yellow];
            const barColor = barColors[i % barColors.length];
            return (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: T.textMid }}>{c.concern}</span>
                  <span style={{ fontSize: "11px", color: T.textMuted }}>{c.count} ({c.pct}%)</span>
                </div>
                <div style={{
                  height: "6px", borderRadius: "3px", background: `${barColor}15`,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${barWidth}%`, borderRadius: "3px",
                    background: barColor,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Three column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>

        {/* Objections */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 16px 0" }}>
            Objections
          </h2>
          <p style={{ fontSize: "11px", color: T.textMuted, margin: "-8px 0 16px 0" }}>
            What&apos;s blocking conversion
          </p>
          {insights.topObjections.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No objections detected yet</div>
          )}
          {insights.topObjections.map((o, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", borderRadius: "8px", marginBottom: "6px",
              background: i === 0 ? `${T.red}10` : "transparent",
              borderLeft: i === 0 ? `3px solid ${T.red}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: "13px", color: i === 0 ? T.red : T.textMid }}>
                {o.objection}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: 700,
                color: i === 0 ? T.red : T.textMuted,
                background: i === 0 ? `${T.red}20` : `${T.textMuted}20`,
                padding: "2px 8px", borderRadius: "10px",
              }}>
                {o.count}
              </span>
            </div>
          ))}
        </div>

        {/* Emotional Patterns */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 16px 0" }}>
            Emotional Patterns
          </h2>
          {insights.emotionalPatterns.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No patterns detected yet</div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {insights.emotionalPatterns.map((e, i) => {
              const emotionColors: Record<string, string> = {
                Overwhelmed: T.yellow,
                Hopeful: T.green,
                Frustrated: T.red,
                Scared: T.purple,
                Sad: T.paleBlue,
                Lonely: T.purple,
                Confused: T.yellow,
                Grateful: T.green,
                Determined: T.blue,
                Empowered: T.blue,
              };
              const color = emotionColors[e.pattern] || T.textMid;
              // Scale font size by count relative to max
              const maxEmoCount = insights.emotionalPatterns[0]?.count || 1;
              const scale = 0.6 + (e.count / maxEmoCount) * 0.4;
              const fontSize = Math.round(13 * scale);
              return (
                <span key={i} style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: i < 3 ? 700 : 500,
                  color,
                  background: `${color}12`,
                  padding: "4px 12px",
                  borderRadius: "16px",
                  border: `1px solid ${color}30`,
                  whiteSpace: "nowrap",
                }}>
                  {e.pattern}
                  <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>{e.count}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Top Supplements */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 16px 0" }}>
            Top Supplements
          </h2>
          {insights.topSupplements.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No supplement data yet</div>
          )}
          {insights.topSupplements.slice(0, 10).map((s, i) => {
            const barWidth = Math.max((s.count / maxSupplementCount) * 100, 4);
            return (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", color: T.textMid }}>{s.name}</span>
                  <span style={{ fontSize: "11px", color: T.textMuted }}>{s.count}</span>
                </div>
                <div style={{ height: "4px", borderRadius: "2px", background: `${T.green}15`, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${barWidth}%`, borderRadius: "2px",
                    background: `linear-gradient(90deg, ${T.green}, ${T.paleBlue})`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Blockers + Engagement Topics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>

        {/* Conversion Blockers */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 4px 0" }}>
            Conversion Blockers
          </h2>
          <p style={{ fontSize: "11px", color: T.textMuted, margin: "0 0 16px 0" }}>
            Objections mentioned near pack/cart presentation
          </p>
          {insights.conversionBlockers.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px", padding: "12px 0" }}>
              No conversion blockers detected yet -- this will populate as more users see pack recommendations
            </div>
          )}
          {insights.conversionBlockers.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", marginBottom: "6px", borderRadius: "8px",
              background: `${T.red}08`,
            }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "6px",
                background: `${T.red}20`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "11px", fontWeight: 700, color: T.red,
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: "13px", color: T.textMid, flex: 1 }}>{b.blocker}</span>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: T.red,
                background: `${T.red}20`, padding: "2px 8px", borderRadius: "10px",
              }}>
                {b.count}
              </span>
            </div>
          ))}
        </div>

        {/* Engagement by Topic */}
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 4px 0" }}>
            Engagement by Topic
          </h2>
          <p style={{ fontSize: "11px", color: T.textMuted, margin: "0 0 16px 0" }}>
            Avg messages per session where topic appears
          </p>
          {insights.engagementTopics.length === 0 && (
            <div style={{ color: T.textMuted, fontSize: "13px" }}>No engagement data yet</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {insights.engagementTopics.slice(0, 10).map((et, i) => (
              <div key={i} style={{
                padding: "12px",
                borderRadius: "8px",
                background: i < 3 ? `${T.blue}10` : `${T.textMuted}08`,
                border: `1px solid ${i < 3 ? T.blue + "20" : T.border}`,
              }}>
                <div style={{ fontSize: "12px", color: T.textMid, marginBottom: "4px" }}>{et.topic}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: i < 3 ? T.blue : T.text }}>
                    {et.avgMessages}
                  </span>
                  <span style={{ fontSize: "10px", color: T.textMuted }}>msgs/session</span>
                </div>
                <div style={{ fontSize: "10px", color: T.textMuted, marginTop: "2px" }}>
                  {et.sessionCount} sessions
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profiles */}
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        padding: "24px",
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: T.text, margin: "0 0 4px 0" }}>
          User Profiles
        </h2>
        <p style={{ fontSize: "11px", color: T.textMuted, margin: "0 0 20px 0" }}>
          Most recent {data.profiles.length} users with extracted profile data
        </p>

        {data.profiles.length === 0 && (
          <div style={{ color: T.textMuted, fontSize: "13px" }}>No user profiles yet</div>
        )}

        {data.profiles.map((profile, i) => {
          const isExpanded = expandedProfile === profile.email;
          return (
            <div key={i} style={{
              marginBottom: "8px",
              borderRadius: "10px",
              border: `1px solid ${isExpanded ? T.blue + "40" : T.border}`,
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}>
              {/* Header row */}
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px",
                  cursor: "pointer",
                  background: isExpanded ? `${T.blue}08` : "transparent",
                }}
                onClick={() => setExpandedProfile(isExpanded ? null : profile.email)}
                onMouseEnter={(e) => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = T.surfaceHover; }}
                onMouseLeave={(e) => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.pink}40, ${T.blue}40)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: T.text,
                  }}>
                    {(profile.name || profile.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>
                      {profile.name || profile.email.split("@")[0]}
                    </div>
                    <div style={{ fontSize: "11px", color: T.textMuted }}>{profile.email}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {/* Quick badges */}
                  {profile.concerns.length > 0 && (
                    <span style={{
                      fontSize: "10px", color: T.pink, background: `${T.pink}15`,
                      padding: "2px 8px", borderRadius: "10px", fontWeight: 600,
                    }}>
                      {profile.concerns[0]}{profile.concerns.length > 1 ? ` +${profile.concerns.length - 1}` : ""}
                    </span>
                  )}
                  {profile.ageRange && (
                    <span style={{
                      fontSize: "10px", color: T.paleBlue, background: `${T.paleBlue}15`,
                      padding: "2px 8px", borderRadius: "10px", fontWeight: 600,
                    }}>
                      {profile.ageRange}
                    </span>
                  )}
                  <span style={{ fontSize: "11px", color: T.textMuted }}>
                    {profile.messageCount} msgs
                  </span>
                  {profile.packPresented && (
                    <span style={{
                      fontSize: "10px", color: T.green, background: `${T.green}15`,
                      padding: "2px 8px", borderRadius: "10px", fontWeight: 600,
                    }}>
                      Pack shown
                    </span>
                  )}
                  {profile.cartShown && (
                    <span style={{
                      fontSize: "10px", color: T.blue, background: `${T.blue}15`,
                      padding: "2px 8px", borderRadius: "10px", fontWeight: 600,
                    }}>
                      Cart link
                    </span>
                  )}
                  <span style={{ fontSize: "14px", color: T.textMuted }}>
                    {isExpanded ? "−" : "+"}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ padding: "0 16px 16px 16px" }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px", marginTop: "4px",
                  }}>
                    {/* Column 1: Concerns & Cycle */}
                    <div>
                      <ProfileSection label="Concerns" items={profile.concerns} color={T.pink} />
                      <ProfileSection label="Cycle Details" items={profile.cycleDetails} color={T.purple} />
                      <ProfileSection label="Age Range" items={profile.ageRange ? [profile.ageRange] : []} color={T.paleBlue} />
                    </div>
                    {/* Column 2: Supplements & Energy */}
                    <div>
                      <ProfileSection label="Supplements Discussed" items={profile.supplements} color={T.green} />
                      <ProfileSection label="Energy / Stress" items={profile.energyStress} color={T.yellow} />
                    </div>
                    {/* Column 3: Emotions, Objections, Meta */}
                    <div>
                      <ProfileSection label="Emotional State" items={profile.emotions} color={T.pink} />
                      <ProfileSection label="Objections" items={profile.objections} color={T.red} />
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: T.textMuted, marginBottom: "6px" }}>
                          Session Info
                        </div>
                        <div style={{ fontSize: "12px", color: T.textMid, lineHeight: 1.8 }}>
                          Sessions: {profile.sessionCount} | Messages: {profile.messageCount}<br />
                          First seen: {new Date(profile.firstSeen).toLocaleDateString()}<br />
                          Last seen: {new Date(profile.lastSeen).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Questions */}
                  {profile.questions.length > 0 && (
                    <div style={{ marginTop: "8px", borderTop: `1px solid ${T.border}`, paddingTop: "12px" }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: T.textMuted, marginBottom: "8px" }}>
                        Questions Asked
                      </div>
                      {profile.questions.map((q, qi) => (
                        <div key={qi} style={{
                          fontSize: "12px", color: T.textMid, fontStyle: "italic",
                          marginBottom: "4px", lineHeight: 1.4, paddingLeft: "12px",
                          borderLeft: `2px solid ${T.blue}30`,
                        }}>
                          {q}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Reusable profile section component ─────────────────────── */

function ProfileSection({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{
        fontSize: "10px", fontWeight: 600, textTransform: "uppercase",
        letterSpacing: "0.5px", color: T.textMuted, marginBottom: "6px",
      }}>
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontSize: "11px", color, background: `${color}12`,
            padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
            border: `1px solid ${color}25`,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
