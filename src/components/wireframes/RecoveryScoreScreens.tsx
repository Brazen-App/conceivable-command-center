"use client";

const B = "#5A6FFF";
const BB = "#ACB7FF";
const OW = "#F9F7F0";
const GRN = "#1EAA55";
const PNK = "#E37FB1";
const YLW = "#F1C028";
const RED = "#E24D47";
const TEAL = "#78C3BF";
const PRP = "#9686B9";
const NVY = "#356FB6";
const BG = "#FAFAFA";

/* ── Shared Nav Bar ─── */
function NavBar({ title, back = true }: { title: string; back?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F0F0F0" }}>
      {back && <span style={{ fontSize: 20, color: B }}>&#8249;</span>}
      <span style={{ fontSize: 16, fontWeight: 700, color: "#2A2828" }}>{title}</span>
    </div>
  );
}

/* ── Tab Bar ─── */
function TabBar({ active = "score" }: { active?: string }) {
  const tabs = [
    { id: "home", label: "Home", icon: "\u2302" },
    { id: "score", label: "Score", icon: "\u25CE" },
    { id: "team", label: "Care Team", icon: "\u2661" },
    { id: "log", label: "Log", icon: "\u270E" },
    { id: "more", label: "More", icon: "\u2026" },
  ];
  return (
    <div style={{ display: "flex", borderTop: "1px solid #F0F0F0", backgroundColor: "#FFF", position: "absolute", bottom: 0, left: 0, right: 0 }}>
      {tabs.map((t) => (
        <div key={t.id} style={{ flex: 1, textAlign: "center", padding: "8px 0 4px", color: active === t.id ? B : "#999" }}>
          <div style={{ fontSize: 18 }}>{t.icon}</div>
          <div style={{ fontSize: 9, fontWeight: 600, marginTop: 2 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1A: Main Recovery Score
   ═══════════════════════════════════════════════════════════ */
export function RecoveryScoreMain() {
  const categories = [
    { name: "Energy", score: 72, trend: "\u2191", color: YLW, status: "Improving steadily" },
    { name: "Blood & Bleeding", score: 85, trend: "\u2191", color: RED, status: "Lochia transitioning normally" },
    { name: "Hormonal", score: 58, trend: "\u2192", color: PRP, status: "Adjusting \u2014 this is expected" },
    { name: "Stress & Emotional", score: 61, trend: "\u2193", color: PNK, status: "Let\u2019s check in with Seren" },
    { name: "Temperature", score: 79, trend: "\u2191", color: TEAL, status: "Stable and healthy" },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", position: "relative", paddingBottom: 60 }}>
      <NavBar title="Recovery Score" back={false} />

      {/* Phase Banner */}
      <div style={{ margin: "12px 20px", padding: "10px 14px", borderRadius: 12, background: `linear-gradient(135deg, ${B}10, ${BB}12)`, border: `1px solid ${B}20` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: GRN }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: B, textTransform: "uppercase", letterSpacing: "0.05em" }}>Establishment Phase</span>
          <span style={{ fontSize: 10, color: "#888", marginLeft: "auto" }}>Week 3</span>
        </div>
        <p style={{ fontSize: 10, color: "#666", margin: "4px 0 0" }}>Sleep disruption and hormonal shifts are normal this phase</p>
      </div>

      {/* Circular Score */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 8px" }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="#F0F0F0" strokeWidth="10" />
            <circle cx="80" cy="80" r="68" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${67 * 4.27} ${100 * 4.27}`} transform="rotate(-90 80 80)" />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={B} />
                <stop offset="100%" stopColor={BB} />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#2A2828", lineHeight: 1 }}>67</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#999", marginTop: 2 }}>RECOVERY SCORE</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#666", marginTop: 8, textAlign: "center", padding: "0 40px" }}>
          Your recovery is tracking well for this stage
        </p>
        <div style={{ fontSize: 10, color: GRN, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span>\u2191</span> +4 pts this week
        </div>
      </div>

      {/* Category Cards */}
      <div style={{ padding: "8px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${cat.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: cat.color }}>{cat.score}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>{cat.name}</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{cat.status}</div>
            </div>
            <span style={{ fontSize: 16, color: cat.trend === "\u2191" ? GRN : cat.trend === "\u2193" ? RED : "#999" }}>{cat.trend}</span>
            <span style={{ fontSize: 14, color: "#CCC" }}>&#8250;</span>
          </div>
        ))}
      </div>

      <TabBar active="score" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1B: Score Detail (Energy)
   ═══════════════════════════════════════════════════════════ */
export function RecoveryScoreDetail() {
  const metrics = [
    { label: "Sleep quality", value: "6.2 hrs avg", sub: "Fragmented \u2014 normal for week 3" },
    { label: "Activity level", value: "Light", sub: "Gentle walks detected" },
    { label: "HRV recovery", value: "68%", sub: "Up from 54% last week" },
    { label: "Fatigue self-report", value: "Moderate", sub: "Logged 3 of 7 days" },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", paddingBottom: 20 }}>
      <NavBar title="Energy" />

      {/* Score + Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: YLW }}>72</span>
          <span style={{ fontSize: 14, color: GRN, fontWeight: 600 }}>\u2191 +8</span>
        </div>
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid #E0E0E0" }}>
          <div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, backgroundColor: B, color: "#FFF" }}>7D</div>
          <div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 600, color: "#999" }}>30D</div>
        </div>
      </div>

      {/* Trend Graph */}
      <div style={{ margin: "0 20px", padding: 16, borderRadius: 16, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
        <svg viewBox="0 0 295 100" width="100%" height="100">
          {/* Grid lines */}
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="295" y2={y} stroke="#F0F0F0" strokeWidth="1" />
          ))}
          {/* Trend line */}
          <polyline
            points="0,80 42,75 84,70 126,62 168,58 210,50 252,42 295,35"
            fill="none" stroke={YLW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Current dot */}
          <circle cx="295" cy="35" r="5" fill={YLW} />
          <circle cx="295" cy="35" r="8" fill={`${YLW}30`} />
          {/* Day labels */}
          {["M", "T", "W", "T", "F", "S", "S", "T"].map((d, i) => (
            <text key={i} x={i * 42} y="97" fontSize="9" fill="#BBB" textAnchor="middle">{d}</text>
          ))}
        </svg>
      </div>

      {/* Metrics */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", marginBottom: 4 }}>Contributing Metrics</div>
        {metrics.map((m) => (
          <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 12, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2828" }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{m.sub}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Kai Message */}
      <div style={{ margin: "4px 20px 20px", padding: 16, borderRadius: 16, background: `linear-gradient(135deg, ${B}08, ${BB}06)`, border: `1px solid ${B}15` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${B}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>\u2728</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: B }}>Kai</span>
        </div>
        <p style={{ fontSize: 11, lineHeight: 1.5, color: "#555", margin: 0 }}>
          Your energy is climbing \u2014 the Halo Ring shows your HRV recovering faster than last week. Keep prioritizing rest during day 2 feeds. You&apos;re doing amazing.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1C: Score Trajectory
   ═══════════════════════════════════════════════════════════ */
export function RecoveryScoreTrajectory() {
  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", paddingBottom: 20 }}>
      <NavBar title="Recovery Trajectory" />

      {/* Phase indicator */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { label: "Critical", color: RED, w: "15%" },
            { label: "Establishment", color: YLW, w: "25%", active: true },
            { label: "Invisible", color: PRP, w: "35%" },
            { label: "Restoration", color: GRN, w: "25%" },
          ].map((p) => (
            <div key={p.label} style={{ width: p.w, textAlign: "center" }}>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: p.active ? p.color : `${p.color}30`, marginBottom: 4 }} />
              <span style={{ fontSize: 8, fontWeight: 600, color: p.active ? p.color : "#BBB" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Large Trajectory Graph */}
      <div style={{ margin: "16px 20px", padding: 20, borderRadius: 16, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
        <svg viewBox="0 0 295 180" width="100%" height="180">
          {/* Phase region backgrounds */}
          <rect x="0" y="0" width="44" height="180" fill={`${RED}06`} />
          <rect x="44" y="0" width="74" height="180" fill={`${YLW}06`} />
          <rect x="118" y="0" width="103" height="180" fill={`${PRP}04`} />
          <rect x="221" y="0" width="74" height="180" fill={`${GRN}04`} />

          {/* Phase dividers */}
          <line x1="44" y1="0" x2="44" y2="180" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="118" y1="0" x2="118" y2="180" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="221" y1="0" x2="221" y2="180" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="3,3" />

          {/* Typical recovery path (lighter) */}
          <polyline
            points="0,150 22,140 44,120 66,105 88,92 110,82 132,74 154,68 176,62 198,57 220,52 242,48 264,45 286,42"
            fill="none" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,4"
          />

          {/* Your recovery path */}
          <polyline
            points="0,160 22,145 44,125 66,115 88,100"
            fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Current position "You are here" */}
          <circle cx="88" cy="100" r="6" fill={B} />
          <circle cx="88" cy="100" r="10" fill={`${B}25`} />

          {/* You are here label */}
          <rect x="58" y="76" width="60" height="18" rx="9" fill={B} />
          <text x="88" y="88" fontSize="8" fill="#FFF" textAnchor="middle" fontWeight="600">You are here</text>

          {/* Axis labels */}
          <text x="22" y="176" fontSize="8" fill="#BBB" textAnchor="middle">Wk 1</text>
          <text x="66" y="176" fontSize="8" fill="#BBB" textAnchor="middle">Wk 3</text>
          <text x="132" y="176" fontSize="8" fill="#BBB" textAnchor="middle">Wk 8</text>
          <text x="198" y="176" fontSize="8" fill="#BBB" textAnchor="middle">Wk 12</text>
          <text x="264" y="176" fontSize="8" fill="#BBB" textAnchor="middle">Wk 20</text>

          {/* Legend */}
          <line x1="180" y1="10" x2="195" y2="10" stroke={B} strokeWidth="2" />
          <text x="198" y="13" fontSize="8" fill="#888">You</text>
          <line x1="220" y1="10" x2="235" y2="10" stroke="#DDD" strokeWidth="2" strokeDasharray="3,3" />
          <text x="238" y="13" fontSize="8" fill="#BBB">Typical</text>
        </svg>
      </div>

      {/* Key Insight Card */}
      <div style={{ margin: "0 20px", padding: 16, borderRadius: 16, background: `linear-gradient(135deg, ${GRN}08, ${TEAL}06)`, border: `1px solid ${GRN}20` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: GRN, marginBottom: 6 }}>Key Insight</div>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#444", margin: 0 }}>
          The trajectory matters more than the number. You&apos;re trending up <strong>12% this week</strong> \u2014 faster than the typical recovery at this stage.
        </p>
      </div>

      {/* Weekly summary */}
      <div style={{ margin: "12px 20px", padding: 14, borderRadius: 14, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2A2828" }}>This Week</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2A2828" }}>Last Week</span>
        </div>
        {[
          { label: "Avg Score", curr: "67", prev: "63", up: true },
          { label: "Best Day", curr: "73 (Tue)", prev: "68 (Thu)", up: true },
          { label: "Lowest", curr: "61 (Sun)", prev: "55 (Mon)", up: true },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #F8F8F8" }}>
            <span style={{ fontSize: 10, color: "#888", width: "33%" }}>{r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: r.up ? GRN : RED, width: "33%", textAlign: "center" }}>{r.curr}</span>
            <span style={{ fontSize: 10, color: "#BBB", width: "33%", textAlign: "right" }}>{r.prev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1D: Phase Context
   ═══════════════════════════════════════════════════════════ */
export function RecoveryPhaseContext() {
  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", paddingBottom: 20 }}>
      <NavBar title="Your Phase" />

      {/* Current Phase Hero */}
      <div style={{ margin: "12px 20px", padding: 20, borderRadius: 20, background: `linear-gradient(145deg, ${YLW}15, ${OW})`, border: `1px solid ${YLW}25` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: `linear-gradient(135deg, ${YLW}, ${YLW}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            \u2600
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#2A2828" }}>Establishment Phase</div>
            <div style={{ fontSize: 11, color: "#888" }}>Weeks 2\u20136 postpartum</div>
          </div>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "#555", margin: 0 }}>
          Your body is establishing new rhythms \u2014 milk supply, sleep patterns, hormonal baselines. This is the &ldquo;finding your footing&rdquo; phase.
        </p>
      </div>

      {/* What's Normal */}
      <div style={{ margin: "0 20px 12px", padding: 16, borderRadius: 16, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: GRN, marginBottom: 10 }}>\u2713 What&apos;s Normal Right Now</div>
        {[
          "Fragmented sleep (waking every 2\u20133 hours)",
          "Mood swings and emotional sensitivity",
          "Lochia changing from red to pink to brown",
          "Breast tenderness as supply regulates",
          "Energy dips in afternoon",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: `${GRN}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <span style={{ fontSize: 9, color: GRN }}>\u2713</span>
            </div>
            <span style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Watch For */}
      <div style={{ margin: "0 20px 12px", padding: 16, borderRadius: 16, backgroundColor: "#FFF", border: `1px solid ${RED}15` }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: RED, marginBottom: 10 }}>\u26A0 Reach Out If</div>
        {[
          "Bright red bleeding returns or heavy clots",
          "Fever above 100.4\u00B0F",
          "Persistent sadness lasting more than 2 weeks",
          "Pain that\u2019s getting worse, not better",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: `${RED}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <span style={{ fontSize: 10, color: RED }}>\u2022</span>
            </div>
            <span style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Care Team Focus */}
      <div style={{ margin: "0 20px", padding: 16, borderRadius: 16, backgroundColor: "#FFF", border: "1px solid #F0F0F0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: B, marginBottom: 10 }}>Your Care Team This Phase</div>
        {[
          { emoji: "\u{1F319}", name: "Luna", role: "Leading breastfeeding support", color: NVY },
          { emoji: "\u{1F338}", name: "Seren", role: "Daily emotional check-ins", color: PNK },
          { emoji: "\u2728", name: "Kai", role: "Recovery monitoring via Halo Ring", color: B },
          { emoji: "\u{1F33F}", name: "Olive", role: "Postpartum nutrition plan", color: GRN },
        ].map((agent) => (
          <div key={agent.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F8F8F8" }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${agent.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{agent.emoji}</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#2A2828" }}>{agent.name}</div>
              <div style={{ fontSize: 10, color: "#888" }}>{agent.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Export Registry ─── */
export const RECOVERY_SCORE_SCREENS = [
  { id: "pp-score-main", title: "Recovery Score \u2014 Main", description: "Circular score display with 5 category cards showing score, trend, and status", component: RecoveryScoreMain },
  { id: "pp-score-detail", title: "Score Detail \u2014 Energy", description: "Expanded category view with metrics, 7-day trend graph, and Kai insight", component: RecoveryScoreDetail },
  { id: "pp-score-trajectory", title: "Recovery Trajectory", description: "Score over time with phase markers and comparison to typical recovery path", component: RecoveryScoreTrajectory },
  { id: "pp-phase-context", title: "Phase Context", description: "Current phase details, what\u2019s normal, watch-for items, and care team focus", component: RecoveryPhaseContext },
];
