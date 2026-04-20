"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Partner } from "@/lib/data/partners";

const BLUE = "#5A6FFF";
const BABY_BLUE = "#ACB7FF";
const OFF_WHITE = "#F9F7F0";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";
const PURPLE = "#9686B9";

const CALENDLY = "https://calendly.com/kirstenk/free-fertility-assessment";

const BEFORE_CHECKLIST = [
  {
    id: "book",
    label: "Book your slot",
    detail: "Use the Calendly link below",
    action: { label: "Open Scheduler →", href: CALENDLY },
  },
  {
    id: "intro",
    label: "Prepare a 2-minute intro",
    detail: "We'll prompt you, but have your story ready",
    action: null,
  },
  {
    id: "insights",
    label: "Think of your top 3 insights",
    detail: "\"I wish someone had told me this earlier\" moments for the audience",
    action: null,
  },
  {
    id: "av",
    label: "Test your audio and video",
    detail: "10 minutes before the session starts",
    action: null,
  },
  {
    id: "water",
    label: "Have water",
    detail: "This audience asks great questions — it goes fast.",
    action: null,
  },
];

const TIMELINE = [
  { time: "0:00–2:00", who: "Kirsten", desc: "Introduces you (we write this — send us your 1–2 sentence bio below)" },
  { time: "2:00–15:00", who: "You", desc: "Presentation or topic deep-dive (you lead, we support)" },
  { time: "15:00–40:00", who: "Everyone", desc: "Live Q&A — we moderate the queue, you just answer" },
  { time: "40:00–45:00", who: "Together", desc: "Wrap + what's next for attendees" },
];

const WE_HANDLE = [
  "Promoting to our full list (29K) and social (410K)",
  "Creating promotional graphics with your name and show",
  "Moderating the live Q&A",
  "Recording + sending you the replay",
  "Post-event email to attendees with your recommended resources",
];

const RECAP_TEMPLATE = `Subject: The replay is here — [THEIR NAME] + Conceivable Community

Hi [NAME],

The replay from [session title] with [PARTNER NAME] is ready.

Watch it here: [REPLAY LINK]

Top 3 takeaways from the session:
1. [TAKEAWAY 1]
2. [TAKEAWAY 2]
3. [TAKEAWAY 3]

[PARTNER NAME]'s resources:
— [PARTNER SHOW]: [LINK]
— [OTHER RESOURCE]

See you at the next one.
— The Conceivable Team`;

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{
        background: copied ? GREEN : BLUE,
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 18px",
        fontFamily: "'Inter',sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
        whiteSpace: "nowrap" as const,
      }}
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: "'Inter',sans-serif",
      fontSize: 11,
      letterSpacing: 3,
      color: BLUE,
      textTransform: "uppercase" as const,
      marginBottom: 16,
    }}>
      {text}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "Georgia, serif",
      fontSize: 26,
      fontWeight: 400,
      marginBottom: 8,
      lineHeight: 1.3,
    }}>
      {children}
    </h2>
  );
}

export default function CommunityPrepClient({ partner }: { partner: Partner }) {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expertise, setExpertise] = useState("");
  const [topic, setTopic] = useState("");

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  const mailtoBody = `Hi Kirsten's team,

Here's my bio for the community session intro:

Name: ${partner.name}
Show/Title: ${partner.show}
One-sentence expertise summary: ${expertise || "[Please add your expertise summary]"}
Topic for session: ${topic || "[Please add your topic]"}

Looking forward to it!

${partner.name}`;

  const mailtoHref = `mailto:help@conceivable.com?subject=${encodeURIComponent(`Community Session Brief — ${partner.show}`)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <div style={{
      fontFamily: "'Inter',sans-serif",
      background: OFF_WHITE,
      minHeight: "100vh",
      color: BLACK,
    }}>

      {/* Header bar */}
      <div style={{
        background: BLACK,
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap" as const,
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: 16 }}>✦</span>
          </div>
          <span style={{ color: "white", fontWeight: 700, letterSpacing: 2, fontSize: 12, textTransform: "uppercase" as const }}>
            Conceivable Partners
          </span>
        </div>
        <div style={{
          background: "rgba(90,111,255,0.2)",
          border: `1px solid ${BLUE}`,
          borderRadius: 20,
          padding: "5px 14px",
          fontSize: 12,
          color: BABY_BLUE,
        }}>
          {partner.show}
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Back */}
        <button
          onClick={() => router.push(`/partners/${partner.slug}`)}
          style={{
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            color: "#888",
            cursor: "pointer",
            marginBottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to your portal
        </button>

        {/* Hero header */}
        <div style={{
          background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a2e 100%)`,
          borderRadius: 24,
          padding: "48px 40px",
          marginBottom: 40,
          position: "relative" as const,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute" as const,
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `${GREEN}18`,
          }} />
          <div style={{ position: "relative" as const }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `${GREEN}20`,
              border: `1px solid ${GREEN}40`,
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 20,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: GREEN,
                animation: "pulse 2s infinite",
              }} />
              <span style={{ fontSize: 12, color: GREEN, fontFamily: "'Inter',sans-serif", fontWeight: 600, letterSpacing: 1 }}>
                Community Expert Session
              </span>
            </div>
            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(26px,3.5vw,40px)",
              fontWeight: 400,
              color: "white",
              lineHeight: 1.25,
              marginBottom: 14,
            }}>
              You&apos;re almost on, {partner.name}.<br />
              Here&apos;s everything you need.
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 520 }}>
              Our community is warm, smart, and ready. They&apos;re going to love you. This guide covers everything from audience context to the timeline — takes 20 minutes to read, worth every minute.
            </p>
          </div>
        </div>

        {/* ── BEFORE THE SESSION ─────────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 24,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Before the session" />
          <SectionTitle>Your Prep Checklist</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            Run through these before you join. Everything else we handle.
          </p>

          {/* Progress */}
          <div style={{
            background: "#f0ede6",
            borderRadius: 100,
            height: 5,
            overflow: "hidden",
            marginBottom: 24,
          }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`,
              width: `${(checkedCount / BEFORE_CHECKLIST.length) * 100}%`,
              transition: "width 0.3s ease",
              borderRadius: 100,
            }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {BEFORE_CHECKLIST.map(item => (
              <div
                key={item.id}
                style={{
                  border: `1px solid ${checked[item.id] ? GREEN : "#e8e5de"}`,
                  borderRadius: 12,
                  padding: "16px 18px",
                  background: checked[item.id] ? `${GREEN}08` : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <button
                    onClick={() => toggleCheck(item.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: `2px solid ${checked[item.id] ? GREEN : "#ccc"}`,
                      background: checked[item.id] ? GREEN : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginTop: 1,
                    }}
                  >
                    {checked[item.id] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 15,
                      fontFamily: "Georgia, serif",
                      color: checked[item.id] ? "#888" : BLACK,
                      textDecoration: checked[item.id] ? "line-through" : "none",
                      marginBottom: 4,
                    }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 13, color: "#999", lineHeight: 1.5 }}>{item.detail}</p>
                    {item.action && !checked[item.id] && (
                      <a
                        href={item.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: 10,
                          background: BLUE,
                          color: "white",
                          borderRadius: 8,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontFamily: "'Inter',sans-serif",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        {item.action.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT THE AUDIENCE ────────────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 24,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Your Audience" />
          <SectionTitle>Who You&apos;re Speaking To</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            These women know a lot. Give them everything you&apos;ve got.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Who they are", value: "Women aged 28–42, actively working on fertility, hormonal health, or period wellness" },
              { label: "Their mindset", value: "Smart, research-aware, and skeptical of generic advice" },
              { label: "What they respond to", value: "Clinical depth, honest nuance, practical takeaways they can act on today" },
              { label: "What they don't want", value: "Hype, vague wellness advice, or anything that sounds like an ad" },
            ].map((item, i) => (
              <div key={i} style={{
                background: OFF_WHITE,
                borderRadius: 12,
                padding: "20px",
              }}>
                <p style={{ fontSize: 11, letterSpacing: 2, color: "#999", textTransform: "uppercase" as const, marginBottom: 8 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.6, color: BLACK }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: `${PURPLE}10`,
            border: `1px solid ${PURPLE}30`,
            borderRadius: 12,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>📊</span>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
              <strong style={{ color: PURPLE }}>Average engagement:</strong> 45+ minute sessions, 20–30 questions in the live chat. These are not passive listeners.
            </p>
          </div>
        </div>

        {/* ── SESSION STRUCTURE ─────────────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 24,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Session Structure" />
          <SectionTitle>The 45-Minute Rundown</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>
            Here&apos;s exactly what happens, minute by minute.
          </p>

          <div style={{ position: "relative" as const }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute" as const,
              left: 52,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#e8e5de",
            }} />

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 28, position: "relative" as const }}>
                  {/* Time badge */}
                  <div style={{
                    width: 106,
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}>
                    <span style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: BLUE,
                      background: `${BLUE}12`,
                      border: `1px solid ${BLUE}30`,
                      borderRadius: 20,
                      padding: "4px 10px",
                      whiteSpace: "nowrap" as const,
                    }}>
                      {item.time}
                    </span>
                  </div>

                  {/* Dot */}
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: BLUE,
                    flexShrink: 0,
                    marginTop: 8,
                    zIndex: 1,
                  }} />

                  {/* Content */}
                  <div style={{ paddingTop: 2 }}>
                    <p style={{
                      fontSize: 11,
                      letterSpacing: 2,
                      color: "#aaa",
                      textTransform: "uppercase" as const,
                      marginBottom: 4,
                    }}>
                      {item.who}
                    </p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: 16, lineHeight: 1.6, color: BLACK }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SUBMIT BIO ───────────────────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 24,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Action Required" />
          <SectionTitle>Send Us Your Bio</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            We write the intro — we just need your input. One sentence is enough.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              window.open(mailtoHref, "_blank");
            }}
            style={{ display: "grid", gap: 20 }}
          >
            {/* Name + Show */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                  Your Name
                </label>
                <input
                  type="text"
                  defaultValue={partner.name}
                  style={{
                    width: "100%",
                    background: OFF_WHITE,
                    border: "1px solid #e8e5de",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 14,
                    color: BLACK,
                    fontFamily: "'Inter',sans-serif",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                  Show / Title
                </label>
                <input
                  type="text"
                  defaultValue={partner.show}
                  style={{
                    width: "100%",
                    background: OFF_WHITE,
                    border: "1px solid #e8e5de",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 14,
                    color: BLACK,
                    fontFamily: "'Inter',sans-serif",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                One-Sentence Expertise Summary
              </label>
              <textarea
                value={expertise}
                onChange={e => setExpertise(e.target.value)}
                placeholder="e.g. 'Functional nutritionist specializing in hormone health and fertility for women over 35.'"
                rows={3}
                style={{
                  width: "100%",
                  background: OFF_WHITE,
                  border: "1px solid #e8e5de",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontSize: 14,
                  color: BLACK,
                  fontFamily: "'Inter',sans-serif",
                  outline: "none",
                  resize: "vertical" as const,
                  lineHeight: 1.6,
                }}
              />
            </div>

            {/* Topic */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                Topic for Session
              </label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="What do you want to cover? The more specific, the better. (e.g. 'The role of gut health in estrogen metabolism and what to do about it')"
                rows={3}
                style={{
                  width: "100%",
                  background: OFF_WHITE,
                  border: "1px solid #e8e5de",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontSize: 14,
                  color: BLACK,
                  fontFamily: "'Inter',sans-serif",
                  outline: "none",
                  resize: "vertical" as const,
                  lineHeight: 1.6,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: BLUE,
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "16px 32px",
                fontSize: 15,
                fontFamily: "'Inter',sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Send Community Session Brief →
            </button>
          </form>
        </div>

        {/* ── WE'LL HANDLE ─────────────────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, #1a1a2e 0%, ${BLACK} 100%)`,
          borderRadius: 20,
          padding: "40px",
          marginBottom: 24,
        }}>
          <SectionLabel text="Our job" />
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: 26,
            fontWeight: 400,
            color: "white",
            marginBottom: 28,
            lineHeight: 1.3,
          }}>
            We handle everything else.
          </h2>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {WE_HANDLE.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `${GREEN}25`,
                  border: `1px solid ${GREEN}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path d="M1 3.5l2 2.5 4-5" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── POST-EVENT RECAP TEMPLATE ─────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Post-Event" />
          <SectionTitle>Recap Email Template</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
            Send this to your list after the session. Fill in the brackets and you&apos;re done — it converts.
          </p>

          <div style={{
            background: OFF_WHITE,
            borderRadius: 16,
            padding: "28px",
            border: "1px solid #e8e5de",
            marginBottom: 16,
          }}>
            {/* Simulated email client look */}
            <div style={{
              borderBottom: "1px solid #e8e5de",
              paddingBottom: 14,
              marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#aaa", width: 50, flexShrink: 0 }}>FROM</span>
                <span style={{ fontSize: 13, color: "#555" }}>you@yourdomain.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "#aaa", width: 50, flexShrink: 0 }}>SUBJECT</span>
                <span style={{ fontSize: 13, color: BLACK, fontWeight: 500 }}>
                  The replay is here — [THEIR NAME] + Conceivable Community
                </span>
              </div>
            </div>

            <pre style={{
              fontFamily: "Georgia, serif",
              fontSize: 14,
              lineHeight: 2,
              color: "#333",
              whiteSpace: "pre-wrap" as const,
              margin: 0,
            }}>
              {RECAP_TEMPLATE}
            </pre>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <CopyButton text={RECAP_TEMPLATE} label="Copy Template" />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        background: BLACK,
        padding: "28px 32px",
        textAlign: "center" as const,
        borderTop: "1px solid #333",
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
          Questions? Email help@conceivable.com
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Conceivable. Making the impossible, Conceivable.
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        h1, h2, h3 { margin: 0; }
        p { margin: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input:focus, textarea:focus {
          border-color: ${BLUE} !important;
          box-shadow: 0 0 0 3px ${BLUE}18;
        }
      `}</style>
    </div>
  );
}
