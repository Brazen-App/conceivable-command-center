"use client";

const B = "#5A6FFF"; const BB = "#ACB7FF"; const GRN = "#1EAA55"; const PNK = "#E37FB1"; const YLW = "#F1C028"; const TEAL = "#78C3BF"; const RED = "#E24D47"; const PRP = "#9686B9"; const OW = "#F9F7F0"; const BG = "#FAFAFA";

/* ── Shared Nav Bar ─── */
function NavBar({ title, back = true, rightElement }: { title: string; back?: boolean; rightElement?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F0F0F0", backgroundColor: "#FFF" }}>
      {back && <span style={{ fontSize: 20, color: B }}>&#8249;</span>}
      <span style={{ fontSize: 16, fontWeight: 700, color: "#2A2828" }}>{title}</span>
      {rightElement && <div style={{ marginLeft: "auto" }}>{rightElement}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 5A: Preparation Checklist (Weeks 28–36)
   ═══════════════════════════════════════════════════════════ */
export function PreparationChecklist() {
  const agents: Record<string, { emoji: string; color: string }> = {
    Kai: { emoji: "🧭", color: B },
    Luna: { emoji: "🌙", color: TEAL },
    Olive: { emoji: "🌿", color: GRN },
    Seren: { emoji: "🌸", color: PNK },
  };

  const weeks = [
    {
      label: "Week 28–30",
      phase: "Foundation",
      expanded: true,
      tasks: [
        { title: "Set up postpartum care team", agent: "Kai", done: true },
        { title: "Start breastfeeding curriculum", agent: "Luna", done: true },
        { title: "Complete food preferences", agent: "Olive", done: false },
        { title: "Review mood support plan", agent: "Seren", done: false },
      ],
    },
    {
      label: "Week 31–33",
      phase: "Preparation",
      expanded: true,
      tasks: [
        { title: "Set up Food Train", agent: "Olive", done: false },
        { title: "Partner awareness brief", agent: "Seren", done: false },
        { title: "Prepare freezer meals (goal: 15)", agent: "Olive", done: false },
        { title: "Identify postpartum therapist", agent: "Seren", done: false },
      ],
    },
    {
      label: "Week 34–36",
      phase: "Final Setup",
      expanded: true,
      tasks: [
        { title: "PPD awareness education", agent: "Seren", done: false },
        { title: "Review recovery score baseline", agent: "Kai", done: false },
        { title: "Supply checklist final review", agent: "Kai", done: false },
        { title: "Birth plan postpartum section", agent: "Kai", done: false },
      ],
    },
  ];

  const totalTasks = weeks.reduce((s, w) => s + w.tasks.length, 0);
  const doneTasks = weeks.reduce((s, w) => s + w.tasks.filter((t) => t.done).length, 0);

  // Suppress unused variable warnings
  void OW; void BB; void PRP; void RED; void YLW;

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar title="Get Ready for Postpartum" rightElement={
        <div style={{
          padding: "3px 10px", borderRadius: 10,
          backgroundColor: `${B}12`, border: `1px solid ${B}25`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: B }}>Week 30</span>
        </div>
      } />

      {/* Progress */}
      <div style={{ padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{doneTasks} of {totalTasks} tasks complete</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: B }}>{Math.round((doneTasks / totalTasks) * 100)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: "#EEEEF2", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(doneTasks / totalTasks) * 100}%`,
            borderRadius: 3, background: `linear-gradient(90deg, ${B}, ${TEAL})`,
          }} />
        </div>
      </div>

      {/* Week sections */}
      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{
            backgroundColor: "#FFF", borderRadius: 14, overflow: "hidden",
            border: "1px solid #F0F0F0",
            boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
          }}>
            {/* Section header */}
            <div style={{
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: wi === 0 ? `${B}06` : "#FAFAFA",
              borderBottom: "1px solid #F0F0F0",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#2A2828" }}>{week.label}</div>
                <div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>{week.phase}</div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#BBB" }}>
                  {week.tasks.filter((t) => t.done).length}/{week.tasks.length}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M6 9l6 6 6-6" stroke="#2A2828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Tasks */}
            <div style={{ padding: "4px 0" }}>
              {week.tasks.map((task, ti) => {
                const ag = agents[task.agent];
                return (
                  <div key={ti} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 16px",
                    borderBottom: ti < week.tasks.length - 1 ? "1px solid #F8F8F8" : "none",
                    cursor: "pointer",
                  }}>
                    {/* Checkbox */}
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      backgroundColor: task.done ? `${GRN}15` : "#FFF",
                      border: task.done ? `1.5px solid ${GRN}40` : "1.5px solid #DDD",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {task.done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke={GRN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* Task title */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 500, color: task.done ? "#BBB" : "#2A2828",
                        textDecoration: task.done ? "line-through" : "none",
                      }}>
                        {task.title}
                      </div>
                    </div>

                    {/* Agent avatar */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "3px 8px", borderRadius: 10,
                      backgroundColor: `${ag.color}08`,
                    }}>
                      <span style={{ fontSize: 12 }}>{ag.emoji}</span>
                      <span style={{ fontSize: 9, fontWeight: 600, color: ag.color }}>{task.agent}</span>
                    </div>

                    {/* Tap indicator */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2, flexShrink: 0 }}>
                      <path d="M8 5l8 7-8 7" stroke="#2A2828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 5B: Preparation Dashboard (Aggregated Readiness)
   ═══════════════════════════════════════════════════════════ */
export function PreparationDashboard() {
  const categories = [
    { label: "Food Train", icon: "🚂", status: "done", statusText: "Set up", statusColor: GRN, progress: 100 },
    { label: "Emotional Support", icon: "💜", status: "warning", statusText: "Therapist not identified", statusColor: YLW, progress: 40 },
    { label: "Freezer Meals", icon: "🧊", status: "progress", statusText: "8 of 15 prepared", statusColor: B, progress: 53 },
    { label: "Partner Brief", icon: "💌", status: "missing", statusText: "Not sent", statusColor: RED, progress: 0 },
    { label: "Supplies", icon: "📦", status: "progress", statusText: "18 of 24 items", statusColor: TEAL, progress: 75 },
    { label: "Education", icon: "📚", status: "progress", statusText: "5 of 8 lessons", statusColor: PRP, progress: 63 },
  ];

  const overallPercent = 42;

  // Circle progress math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <NavBar title="Postpartum Readiness" rightElement={
        <div style={{
          padding: "3px 10px", borderRadius: 10,
          backgroundColor: `${B}12`, border: `1px solid ${B}25`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: B }}>Week 30</span>
        </div>
      } />

      {/* Circular progress score */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0 20px" }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#EEEEF2" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="60" cy="60" r={radius} fill="none"
              stroke={B} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: B }}>{overallPercent}%</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ready</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Overall readiness score</div>
      </div>

      {/* Category cards — 2 column grid */}
      <div style={{
        padding: "0 16px 16px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
      }}>
        {categories.map((cat, i) => (
          <div key={i} style={{
            padding: "14px", borderRadius: 14,
            backgroundColor: "#FFF", border: "1px solid #F0F0F0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
            cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {/* Icon + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2A2828" }}>{cat.label}</span>
            </div>

            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {cat.status === "done" && (
                <div style={{
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: `${GRN}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke={GRN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              {cat.status === "warning" && (
                <span style={{ fontSize: 12 }}>⚠️</span>
              )}
              {cat.status === "missing" && (
                <div style={{
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: `${RED}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: RED, lineHeight: 1 }}>✕</span>
                </div>
              )}
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: cat.status === "done" ? GRN : cat.status === "warning" ? "#B8900A" : cat.status === "missing" ? RED : "#777",
              }}>
                {cat.statusText}
              </span>
            </div>

            {/* Progress bar */}
            {cat.status !== "missing" && (
              <div style={{ height: 4, borderRadius: 2, backgroundColor: "#EEEEF2", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${cat.progress}%`, borderRadius: 2,
                  backgroundColor: cat.statusColor,
                  transition: "width 0.3s ease",
                }} />
              </div>
            )}
            {cat.status === "missing" && (
              <div style={{ height: 4, borderRadius: 2, backgroundColor: `${RED}15` }} />
            )}
          </div>
        ))}
      </div>

      {/* Kai recommendation card */}
      <div style={{
        margin: "4px 16px 24px", padding: "16px", borderRadius: 14,
        background: `linear-gradient(135deg, ${B}08, ${TEAL}06)`,
        border: `1px solid ${B}15`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: `linear-gradient(135deg, ${B}20, ${TEAL}15)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>
            🧭
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: B }}>What to focus on this week</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.65 }}>
          You&apos;re in great shape! Two priorities this week: <span style={{ fontWeight: 600, color: "#2A2828" }}>identify a postpartum therapist</span> (Seren can help) and <span style={{ fontWeight: 600, color: "#2A2828" }}>send the partner brief</span>. Everything else is on track.
        </div>
        <div style={{
          marginTop: 12, display: "flex", gap: 8,
        }}>
          <div style={{
            padding: "8px 14px", borderRadius: 10,
            backgroundColor: `${PNK}10`, border: `1px solid ${PNK}20`,
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: PNK }}>🌸 Ask Seren</span>
          </div>
          <div style={{
            padding: "8px 14px", borderRadius: 10,
            backgroundColor: `${B}08`, border: `1px solid ${B}18`,
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: B }}>📋 Partner Brief</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Export Registry ─── */
export const PREPARATION_SCREENS = [
  { id: "pp-preparation-checklist", title: "Preparation Checklist", description: "Week-by-week postpartum preparation tasks (weeks 28–36) with care team agent assignments and progress tracking", component: PreparationChecklist },
  { id: "pp-preparation-dashboard", title: "Postpartum Readiness Dashboard", description: "Aggregated readiness score with category cards, progress bars, and Kai's weekly focus recommendation", component: PreparationDashboard },
];
