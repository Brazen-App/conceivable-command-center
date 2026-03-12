"use client";

const B = "#5A6FFF";
const BB = "#ACB7FF";
const PNK = "#E37FB1";
const PRP = "#9686B9";
const RED = "#E24D47";
const GRN = "#1EAA55";
const BG = "#FAFAFA";

/* ── Shared Nav Bar ─── */
function NavBar({ title, back = true, rightElement }: { title: string; back?: boolean; rightElement?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid #F0F0F0" }}>
      {back && <span style={{ fontSize: 20, color: B }}>&#8249;</span>}
      <span style={{ fontSize: 16, fontWeight: 700, color: "#2A2828" }}>{title}</span>
      {rightElement && <div style={{ marginLeft: "auto" }}>{rightElement}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 3A: Seren Check-In
   ═══════════════════════════════════════════════════════════ */
export function SerenCheckin() {
  const quickResponses = [
    { label: "surviving", bg: `${RED}12`, color: RED },
    { label: "struggling", bg: `${PRP}12`, color: PRP },
    { label: "okay", bg: `${BB}15`, color: B },
    { label: "good", bg: `${GRN}12`, color: GRN },
    { label: "amazing", bg: `${PNK}15`, color: PNK },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", position: "relative" }}>
      <NavBar title="Check In with Seren" />

      {/* Seren greeting */}
      <div style={{ padding: "24px 20px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 22,
          background: `linear-gradient(135deg, ${PNK}30, ${PRP}25)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>
          🌸
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: PNK, marginBottom: 4 }}>Seren</div>
          <div style={{
            fontSize: 18, fontWeight: 700, color: "#2A2828", lineHeight: 1.4,
          }}>
            Hey mama. What&apos;s actually going on today?
          </div>
        </div>
      </div>

      {/* Voice note — primary input */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 0 20px" }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40,
          background: `linear-gradient(145deg, ${PNK}, ${PRP})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 6px 24px ${PNK}40`,
          cursor: "pointer",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="#FFF" />
            <path d="M5 11a7 7 0 0 0 14 0" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="9" y1="22" x2="15" y2="22" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: PRP, marginTop: 10 }}>Tap to talk</span>
        <span style={{ fontSize: 10, color: "#BBB", marginTop: 2 }}>Your voice tells Seren a lot</span>
      </div>

      {/* Text input — secondary */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#BBB", flexShrink: 0 }}>or type...</span>
          <div style={{
            flex: 1, height: 40, borderRadius: 20,
            border: "1px solid #E8E8E8", backgroundColor: "#FFF",
            padding: "0 16px",
            display: "flex", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#CCC" }}>What&apos;s on your mind?</span>
          </div>
        </div>
      </div>

      {/* Quick responses */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Or just pick one
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {quickResponses.map((r) => (
            <div key={r.label} style={{
              padding: "8px 16px", borderRadius: 20,
              backgroundColor: r.bg, border: `1px solid ${r.color}20`,
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: r.color }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy note */}
      <div style={{ padding: "20px 20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#CCC" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#CCC" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 10, color: "#BBB", lineHeight: 1.4 }}>
            Your responses are private and help Seren support you better
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 3B: Seren Conversation
   ═══════════════════════════════════════════════════════════ */
export function SerenConversation() {
  type Msg = { from: "user" | "seren"; text: string; highlight?: boolean; buttons?: { label: string; color: string }[] };

  const messages: Msg[] = [
    { from: "user", text: "I don\u2019t know I just feel like crying all the time" },
    { from: "seren", text: "That sounds really hard. Crying is actually a normal part of postpartum recovery \u2014 your hormones are going through massive shifts right now. \uD83D\uDC9B" },
    { from: "seren", text: "Can I ask \u2014 how long have you been feeling this way? And are you finding moments of joy in between?" },
    { from: "user", text: "like 10 days maybe? idk. sometimes when she smiles but then I just cry again" },
    { from: "seren", text: "I hear you. Ten days is long enough that I want to make sure you\u2019re getting the right support. What you\u2019re describing sounds like it might be more than baby blues \u2014 and that\u2019s okay. It\u2019s really common and really treatable.", highlight: true },
    { from: "seren", text: "Would it be okay if I shared this with your care team? They can help connect you with Dr. Chen. You don\u2019t have to do this alone.", buttons: [{ label: "Yes, please", color: PNK }, { label: "Not yet", color: "#999" }] },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Nav with online indicator */}
      <NavBar
        title="Seren"
        rightElement={
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: GRN }} />
            <span style={{ fontSize: 10, color: "#999" }}>Online</span>
          </div>
        }
      />

      {/* Chat area */}
      <div style={{ flex: 1, padding: "16px 16px 80px", overflowY: "auto" }}>
        {/* Timestamp */}
        <div style={{ textAlign: "center", margin: "0 0 16px" }}>
          <span style={{ fontSize: 10, color: "#BBB", backgroundColor: `${BG}`, padding: "2px 10px", borderRadius: 8 }}>Today, 2:34 PM</span>
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((msg, i) => {
            const isUser = msg.from === "user";
            return (
              <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%" }}>
                  {/* Seren avatar for first seren msg or after user msg */}
                  {!isUser && (i === 0 || messages[i - 1].from === "user") && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 11,
                        background: `linear-gradient(135deg, ${PNK}35, ${PRP}30)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11,
                      }}>
                        🌸
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: PNK }}>Seren</span>
                    </div>
                  )}

                  {/* Message bubble */}
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    backgroundColor: isUser ? "#F0F0F0" : `${PNK}10`,
                    border: msg.highlight ? `1.5px solid ${PNK}40` : "none",
                    ...(msg.highlight ? { background: `linear-gradient(135deg, ${PNK}08, ${PRP}06)` } : {}),
                  }}>
                    <span style={{ fontSize: 13, lineHeight: 1.55, color: "#2A2828" }}>{msg.text}</span>
                  </div>

                  {/* Action buttons */}
                  {msg.buttons && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {msg.buttons.map((btn) => (
                        <div key={btn.label} style={{
                          padding: "10px 20px", borderRadius: 20,
                          backgroundColor: btn.color === PNK ? PNK : "#F0F0F0",
                          cursor: "pointer",
                        }}>
                          <span style={{
                            fontSize: 13, fontWeight: 600,
                            color: btn.color === PNK ? "#FFF" : "#666",
                          }}>{btn.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 16px", backgroundColor: "#FFF",
        borderTop: "1px solid #F0F0F0",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          flex: 1, height: 40, borderRadius: 20,
          border: "1px solid #E8E8E8", backgroundColor: "#FAFAFA",
          padding: "0 16px",
          display: "flex", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: "#CCC" }}>Message Seren...</span>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: `linear-gradient(145deg, ${PNK}, ${PRP})`,
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
   SCREEN 3C: PPD Awareness Card
   ═══════════════════════════════════════════════════════════ */
export function PPDAwarenessCard() {
  const supportPlan = [
    "Seren will check in daily after delivery",
    "Mood tracking built into your daily log",
    "Escalation path to Dr. Chen if needed",
    "Partner awareness brief available",
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: "100%", paddingBottom: 20 }}>
      <NavBar title="Preparing for Postpartum" />

      {/* Week indicator */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: PRP }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: PRP, textTransform: "uppercase", letterSpacing: "0.05em" }}>Week 34</span>
          <span style={{ fontSize: 11, color: "#BBB" }}>&middot;</span>
          <span style={{ fontSize: 11, color: "#999" }}>From Seren</span>
        </div>
      </div>

      {/* Main card */}
      <div style={{
        margin: "12px 20px", borderRadius: 20, overflow: "hidden",
        background: `linear-gradient(145deg, ${PNK}08, ${PRP}06)`,
        border: `1px solid ${PNK}15`,
      }}>
        {/* Seren header */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: `linear-gradient(135deg, ${PNK}30, ${PRP}25)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            🌸
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: PNK }}>Something I want you to know</span>
        </div>

        {/* Title */}
        <div style={{ padding: "16px 20px 0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#2A2828", margin: 0, lineHeight: 1.3 }}>
            Understanding postpartum mood changes
          </h2>
        </div>

        {/* Abstract illustration placeholder */}
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 120, height: 120, borderRadius: 60,
            background: `radial-gradient(circle at 40% 40%, ${PNK}20, ${PRP}15, ${BB}10, transparent)`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 20, left: 25, width: 70, height: 70, borderRadius: 35,
              background: `radial-gradient(circle at 50% 50%, ${PNK}18, ${PRP}12, transparent)`,
            }} />
            <div style={{
              position: "absolute", top: 35, left: 40, width: 40, height: 40, borderRadius: 20,
              background: `radial-gradient(circle, ${PNK}25, transparent)`,
            }} />
          </div>
        </div>

        {/* Key stat */}
        <div style={{ padding: "20px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#2A2828", lineHeight: 1.6, margin: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: PRP }}>1 in 5</span>{" "}
            women experience PPD.
          </p>
          <p style={{ fontSize: 13, color: "#666", marginTop: 6, lineHeight: 1.5 }}>
            It&apos;s not a character flaw &mdash; it&apos;s a physiological event.
          </p>
        </div>
      </div>

      {/* Expandable section */}
      <div style={{
        margin: "0 20px 12px", padding: "14px 16px",
        borderRadius: 14, backgroundColor: "#FFF", border: "1px solid #F0F0F0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2A2828" }}>What to watch for</span>
        <span style={{ fontSize: 16, color: "#CCC" }}>&#8250;</span>
      </div>

      {/* Your Support Plan */}
      <div style={{
        margin: "0 20px 12px", padding: 16, borderRadius: 16,
        backgroundColor: "#FFF", border: "1px solid #F0F0F0",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.06em", color: PRP, marginBottom: 12,
        }}>
          Your Support Plan
        </div>
        {supportPlan.map((item) => (
          <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0" }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9,
              backgroundColor: `${GRN}12`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: 1,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <polyline points="4,12 10,18 20,6" stroke={GRN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Mark as Read CTA */}
      <div style={{ padding: "8px 20px" }}>
        <div style={{
          width: "100%", padding: "14px 0", borderRadius: 14,
          backgroundColor: B, textAlign: "center", cursor: "pointer",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFF" }}>Mark as Read</span>
        </div>
      </div>
    </div>
  );
}

/* ── Export Registry ─── */
export const SEREN_SCREENS = [
  { id: "pp-seren-checkin", title: "Seren Check-In", description: "Warm, open-ended emotional check-in with voice as primary input", component: SerenCheckin },
  { id: "pp-seren-conversation", title: "Seren Conversation", description: "Ongoing emotional support thread showing Tier 2 PPD escalation flow", component: SerenConversation },
  { id: "pp-seren-ppd-card", title: "PPD Awareness Card", description: "Week 34 education about postpartum mood changes — informational, not scary", component: PPDAwarenessCard },
];
