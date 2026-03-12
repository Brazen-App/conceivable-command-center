"use client";

const B = "#5A6FFF"; const BB = "#ACB7FF"; const NVY = "#356FB6"; const GRN = "#1EAA55"; const YLW = "#F1C028"; const TEAL = "#78C3BF"; const PRP = "#9686B9"; const BG = "#FAFAFA"; const DK = "#1A1A2E";

/* ── Shared Nav Bar ─── */
function NavBar({ title, back = true, rightElement, subtitle }: { title: string; back?: boolean; rightElement?: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F0F0F0", backgroundColor: "#FFF" }}>
      {back && <span style={{ fontSize: 20, color: B }}>&#8249;</span>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#2A2828" }}>{title}</span>
        {subtitle && <span style={{ fontSize: 10, color: "#999", marginTop: 1 }}>{subtitle}</span>}
      </div>
      {rightElement && <div style={{ marginLeft: "auto" }}>{rightElement}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2A: Luna Chat Interface
   ═══════════════════════════════════════════════════════════ */
export function LunaChatInterface() {
  const messages = [
    {
      from: "luna",
      text: "Good morning! How was the overnight? I saw 4 feeds logged between 11pm and 6am — that\u2019s a great rhythm for week 2. \ud83c\udf19",
    },
    {
      from: "user",
      text: "she keeps unlatching on the left side",
    },
    {
      from: "luna",
      text: "That\u2019s really common, especially on one side. A few things to check:\n\n\u2022 Make sure her ear, shoulder & hip are in a line\n\u2022 Try a slightly deeper latch \u2014 aim her lower lip further from the nipple\n\u2022 The football hold can help with left-side positioning\n\nWant me to pull up the positioning video? Or we can troubleshoot more.",
    },
  ];

  const quickActions = [
    { label: "Log Feed", icon: "\ud83d\udd52", bg: `${NVY}15`, color: NVY, border: `${NVY}30` },
    { label: "Help with Latch", icon: "\ud83e\udd32", bg: `${TEAL}15`, color: TEAL, border: `${TEAL}30` },
    { label: "Is This Normal?", icon: "\u2753", bg: `${PRP}15`, color: PRP, border: `${PRP}30` },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar
        title="\ud83c\udf19 Luna"
        subtitle="Lactation Support"
        rightElement={
          <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${GRN}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: GRN }} />
          </div>
        }
      />

      {/* Chat messages */}
      <div style={{ flex: 1, padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
            {m.from === "luna" && (
              <div style={{
                width: 32, height: 32, borderRadius: 16,
                background: `linear-gradient(135deg, ${BB}50, ${TEAL}40)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>
                \ud83c\udf19
              </div>
            )}
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: 16,
              backgroundColor: m.from === "user" ? B : "#FFF",
              color: m.from === "user" ? "#FFF" : "#2A2828",
              fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-line",
              boxShadow: m.from === "luna" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              borderBottomLeftRadius: m.from === "luna" ? 4 : 16,
              borderBottomRightRadius: m.from === "user" ? 4 : 16,
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick action buttons */}
      <div style={{ padding: "8px 16px", display: "flex", gap: 8 }}>
        {quickActions.map((a) => (
          <div key={a.label} style={{
            flex: 1, padding: "10px 6px", borderRadius: 12,
            backgroundColor: a.bg, border: `1px solid ${a.border}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 16 }}>{a.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: a.color, textAlign: "center" }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Text input bar */}
      <div style={{ padding: "8px 16px 14px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #F0F0F0", backgroundColor: "#FFF" }}>
        <div style={{
          flex: 1, height: 40, borderRadius: 20,
          border: "1px solid #E8E8E8", backgroundColor: "#F8F8F8",
          padding: "0 16px", display: "flex", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: "#CCC" }}>Message Luna...</span>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: `linear-gradient(135deg, ${B}, ${BB})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="#FFF" />
            <path d="M5 11a7 7 0 0 0 14 0" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2B: Feed Tracker Summary
   ═══════════════════════════════════════════════════════════ */
export function FeedTrackerSummary() {
  const feeds = [
    { time: "12:15 AM", side: "L", mins: 18 },
    { time: "2:40 AM", side: "R", mins: 12 },
    { time: "4:55 AM", side: "L", mins: 22 },
    { time: "7:10 AM", side: "R", mins: 15 },
    { time: "8:45 AM", side: "L", mins: 14 },
    { time: "10:30 AM", side: "R", mins: 18 },
    { time: "12:00 PM", side: "L", mins: 16 },
    { time: "1:45 PM", side: "R", mins: 11 },
    { time: "3:20 PM", side: "L", mins: 20 },
    { time: "5:00 PM", side: "R", mins: 14 },
    { time: "6:30 PM", side: "L", mins: 17 },
  ];

  const totalMins = feeds.reduce((s, f) => s + f.mins, 0);
  const leftCount = feeds.filter((f) => f.side === "L").length;
  const rightCount = feeds.filter((f) => f.side === "R").length;

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", position: "relative" }}>
      <NavBar title="Today\u2019s Feeds" rightElement={<span style={{ fontSize: 11, color: B, fontWeight: 600 }}>Week 2</span>} />

      {/* Summary bar */}
      <div style={{
        margin: "12px 16px", padding: "14px 16px", borderRadius: 14,
        background: `linear-gradient(135deg, ${NVY}10, ${TEAL}10)`,
        border: `1px solid ${NVY}15`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: NVY }}>{feeds.length}</div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>feeds</div>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: "#E0E0E0" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: NVY }}>{Math.floor(totalMins / 60)}h {totalMins % 60}m</div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>total</div>
        </div>
        <div style={{ width: 1, height: 28, backgroundColor: "#E0E0E0" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>L:{leftCount}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: NVY }}>R:{rightCount}</span>
          </div>
          <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>sides</div>
        </div>
      </div>

      {/* 24hr timeline header */}
      <div style={{ padding: "8px 16px 4px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Timeline</div>
      </div>

      {/* Timeline bar */}
      <div style={{ padding: "4px 16px 12px" }}>
        <div style={{ position: "relative", height: 28, backgroundColor: "#EEEEF2", borderRadius: 14, overflow: "hidden" }}>
          {feeds.map((f, i) => {
            const hourStr = f.time.replace(/ (AM|PM)/, "");
            const parts = hourStr.split(":");
            let hour = parseInt(parts[0]);
            const min = parseInt(parts[1]);
            const isPM = f.time.includes("PM");
            if (isPM && hour !== 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;
            const pos = ((hour + min / 60) / 24) * 100;
            const width = Math.max((f.mins / 24 / 60) * 100, 1.5);
            return (
              <div key={i} style={{
                position: "absolute", left: `${pos}%`, top: 4, bottom: 4,
                width: `${width}%`, minWidth: 6,
                borderRadius: 4,
                backgroundColor: f.side === "L" ? TEAL : NVY,
                opacity: 0.85,
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["12a", "6a", "12p", "6p", "12a"].map((l) => (
            <span key={l + Math.random()} style={{ fontSize: 8, color: "#BBB" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        {feeds.map((f, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
            backgroundColor: "#FFF", borderRadius: 10, border: "1px solid #F0F0F0",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: f.side === "L" ? `${TEAL}18` : `${NVY}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
              color: f.side === "L" ? TEAL : NVY,
            }}>
              {f.side}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2828" }}>{f.time}</div>
            </div>
            <div style={{
              padding: "3px 10px", borderRadius: 8,
              backgroundColor: f.side === "L" ? `${TEAL}12` : `${NVY}10`,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: f.side === "L" ? TEAL : NVY }}>{f.mins} min</span>
            </div>
          </div>
        ))}
      </div>

      {/* Luna insight card */}
      <div style={{
        margin: "16px 16px 80px", padding: "14px 16px", borderRadius: 14,
        background: `linear-gradient(135deg, ${BB}15, ${TEAL}12)`,
        border: `1px solid ${BB}25`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>\ud83c\udf19</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: NVY }}>Luna\u2019s Insight</span>
        </div>
        <div style={{ fontSize: 12, color: "#444", lineHeight: 1.55 }}>
          11 feeds today — right on track for week 2. Your left-side sessions are averaging 4 minutes longer. Try starting with right side next feed to even things out.
        </div>
      </div>

      {/* FAB */}
      <div style={{
        position: "absolute", bottom: 16, right: 16,
        width: 52, height: 52, borderRadius: 26,
        background: `linear-gradient(135deg, ${B}, ${NVY})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 16px ${B}40`, cursor: "pointer",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="5" x2="12" y2="19" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="19" y2="12" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2C: Luna Education Card (Pre-Delivery)
   ═══════════════════════════════════════════════════════════ */
export function LunaEducationCard() {
  const completedLessons = [
    { title: "Why Breastfeeding Matters", mins: 8, done: true },
    { title: "Anatomy & How Milk Works", mins: 10, done: true },
    { title: "First Hour After Birth", mins: 7, done: true },
  ];

  const currentLesson = { title: "Positioning & Latch Basics", mins: 12 };

  const upNext = [
    { title: "When to Call for Help", mins: 8, icon: "\u25b6" },
    { title: "Pump & Store Basics", mins: 10, icon: "\u25b6" },
    { title: "Partner\u2019s Guide to Support", mins: 6, icon: "\ud83d\udd16" },
  ];

  const totalLessons = 8;
  const completed = 3;

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", position: "relative" }}>
      <NavBar
        title="Breastfeeding Prep"
        rightElement={
          <div style={{
            padding: "3px 10px", borderRadius: 10,
            backgroundColor: `${YLW}20`, border: `1px solid ${YLW}40`,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#B8900A" }}>Week 33</span>
          </div>
        }
      />

      {/* Progress bar */}
      <div style={{ padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{completed} of {totalLessons} lessons complete</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: GRN }}>{Math.round((completed / totalLessons) * 100)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: "#EEEEF2", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(completed / totalLessons) * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, ${GRN}, ${TEAL})` }} />
        </div>
      </div>

      {/* Completed lessons */}
      <div style={{ padding: "0 20px 8px" }}>
        {completedLessons.map((l, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
            borderBottom: "1px solid #F2F2F2",
            opacity: 0.6,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              backgroundColor: `${GRN}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke={GRN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: "#888", flex: 1 }}>{l.title}</span>
            <span style={{ fontSize: 10, color: "#BBB" }}>{l.mins} min</span>
          </div>
        ))}
      </div>

      {/* Current lesson — featured card */}
      <div style={{
        margin: "12px 20px", borderRadius: 16, overflow: "hidden",
        backgroundColor: "#FFF", border: `2px solid ${B}25`,
        boxShadow: `0 4px 20px ${B}12`,
      }}>
        {/* Video thumbnail */}
        <div style={{
          height: 120, background: `linear-gradient(135deg, ${B}30, ${TEAL}25, ${BB}30)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="8,5 20,12 8,19" fill={B} />
            </svg>
          </div>
          <div style={{
            position: "absolute", top: 10, left: 10,
            padding: "3px 8px", borderRadius: 6,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
            <span style={{ fontSize: 9, color: "#FFF", fontWeight: 600 }}>UP NEXT</span>
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2828", marginBottom: 4 }}>{currentLesson.title}</div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>{currentLesson.mins} min video \u00b7 Luna\u2019s top recommendation</div>
          <div style={{
            width: "100%", padding: "12px 0", borderRadius: 12,
            background: `linear-gradient(135deg, ${B}, ${NVY})`,
            textAlign: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>Start Lesson</span>
          </div>
        </div>
      </div>

      {/* Up next list */}
      <div style={{ padding: "8px 20px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Coming Up
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upNext.map((l, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              backgroundColor: "#FFF", borderRadius: 12, border: "1px solid #F0F0F0",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `linear-gradient(135deg, ${BB}20, ${TEAL}15)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 20,12 8,19" fill={BB} />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2828" }}>{l.title}</div>
                <div style={{ fontSize: 10, color: "#AAA" }}>{l.mins} min</div>
              </div>
              <div style={{
                padding: "5px 10px", borderRadius: 8,
                backgroundColor: `${BB}12`, cursor: "pointer",
              }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: B }}>{l.icon === "\ud83d\udd16" ? "Save" : "Watch Later"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2D: The 2AM State
   ═══════════════════════════════════════════════════════════ */
export function The2AMState() {
  return (
    <div style={{
      backgroundColor: DK, minHeight: "100%", position: "relative",
      display: "flex", flexDirection: "column",
      color: "#FFF",
    }}>
      {/* Top bar — dim clock */}
      <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, opacity: 0.3 }}>\ud83c\udf19</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#FFF", opacity: 0.35 }}>2:47 AM</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: TEAL, opacity: 0.6, boxShadow: `0 0 8px ${TEAL}60` }} />
          <span style={{ fontSize: 10, color: "#FFF", opacity: 0.25 }}>Luna is here</span>
        </div>
      </div>

      {/* Main timer area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
        {/* Active feed timer */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, fontWeight: 200, color: "#FFF", opacity: 0.9, letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums" }}>
            14:22
          </div>
          {/* Pulsing indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: TEAL, opacity: 0.7,
              boxShadow: `0 0 12px ${TEAL}50`,
            }} />
            <span style={{ fontSize: 11, color: "#FFF", opacity: 0.4, fontWeight: 500 }}>Active Feed</span>
          </div>
        </div>

        {/* Side indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, marginBottom: 12,
          padding: "10px 24px", borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            padding: "6px 16px", borderRadius: 12,
            backgroundColor: `${TEAL}20`, border: `1px solid ${TEAL}30`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEAL, opacity: 0.8 }}>Left</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
            <path d="M8 5l8 7-8 7" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{
            padding: "6px 16px", borderRadius: 12,
            backgroundColor: "rgba(255,255,255,0.04)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#FFF", opacity: 0.25 }}>Right</span>
          </div>
        </div>

        <span style={{ fontSize: 10, color: "#FFF", opacity: 0.2, marginBottom: 40 }}>Started at 2:33 AM</span>

        {/* Voice input — prominent */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: `linear-gradient(135deg, ${B}40, ${TEAL}30)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 30px ${B}20, 0 0 60px ${TEAL}10`,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="#FFF" opacity="0.7" />
              <path d="M5 11a7 7 0 0 0 14 0" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: "#FFF", opacity: 0.3, marginTop: 10, fontWeight: 500 }}>Ask Luna anything</span>
        </div>

        {/* Whisper buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["Latch help", "Is this enough?", "Switch sides"].map((label) => (
            <div key={label} style={{
              padding: "7px 14px", borderRadius: 16,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 10, color: "#FFF", opacity: 0.25, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* End Feed button — bottom */}
      <div style={{ padding: "16px 40px 28px" }}>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#FFF", opacity: 0.35 }}>End Feed</span>
        </div>
      </div>
    </div>
  );
}

/* ── Export Registry ─── */
export const LUNA_SCREENS = [
  { id: "pp-luna-chat", title: "Luna Chat Interface", description: "Care team chat with quick-action buttons: Log Feed, Help with Latch, Is This Normal?", component: LunaChatInterface },
  { id: "pp-luna-feed-tracker", title: "Feed Tracker Summary", description: "Today\u2019s feeds as timeline with pattern insights from Luna", component: FeedTrackerSummary },
  { id: "pp-luna-education", title: "Luna Education (Prenatal)", description: "Pre-delivery breastfeeding curriculum during pregnancy weeks 30-36", component: LunaEducationCard },
  { id: "pp-luna-2am", title: "The 2AM State", description: "Dark mode minimal interface for middle-of-night feeds with voice input", component: The2AMState },
];
