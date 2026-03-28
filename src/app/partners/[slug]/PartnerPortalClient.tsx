"use client";

import { useState, useEffect } from "react";
import { Partner } from "@/lib/data/partners";

const BLUE = "#5A6FFF";
const BABY_BLUE = "#ACB7FF";
const OFF_WHITE = "#F9F7F0";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";
const PINK = "#E37FB1";
const YELLOW = "#F1C028";
const PURPLE = "#9686B9";

const COLLAB_OPTIONS = [
  {
    id: "affiliate",
    emoji: "💸",
    title: "Affiliate Partner",
    tagline: "Earn 25% on every subscriber you bring in",
    color: YELLOW,
    desc: "Share your unique link. Every time someone subscribes through you, you earn $27.25/month per subscriber — recurring, forever.",
    valueForThem: "Passive income. One link. Your audience already trusts you.",
    nextSteps: [
      "Your affiliate link is ready instantly below",
      "Grab the caption pack — written to convert, not to sound like an ad",
      "Dashboard shows your earnings in real time",
    ],
    cta: "Get My Link",
    ctaLink: "#affiliate-link",
    assets: ["Caption Pack", "Story Templates", "Email Swipe Copy"],
  },
  {
    id: "blog",
    emoji: "✍️",
    title: "Blog Swap",
    tagline: "You write for us. Kirsten writes for you.",
    color: BLUE,
    desc: "Guest posts on both blogs. Mutual SEO, mutual audience exposure. You choose your topic. Kirsten writes in your voice.",
    valueForThem: "Kirsten's 25 years of clinical expertise + her SEO authority pointing at your site.",
    nextSteps: [
      "Tell us your topic (or we'll suggest one)",
      "We send you a brief for the Conceivable post",
      "Both posts go live same week for max cross-traffic",
    ],
    cta: "Start the Swap",
    ctaLink: "#blog-brief",
    assets: ["Blog Brief Template", "SEO Checklist", "Author Bio"],
  },
  {
    id: "review",
    emoji: "🎬",
    title: "Video Review Swap",
    tagline: "You review Conceivable. Kirsten reviews your show.",
    color: PINK,
    desc: "Honest. Real. 60-90 seconds. We give you free access first so you can actually experience it. Then Kirsten records a review of your show for her 410K followers.",
    valueForThem: "Kirsten's face + voice endorsing your show to 410K followers and 29K email subscribers.",
    nextSteps: [
      "Claim your free Conceivable access below",
      "Spend a week with it — really use it",
      "Record your honest take via the link we'll send",
    ],
    cta: "Get Free Access",
    ctaLink: "#free-access",
    assets: ["Review Prompts", "Loom Recording Guide", "ROLA Submission Link"],
  },
  {
    id: "community",
    emoji: "🌟",
    title: "Community Expert Guest",
    tagline: "Go live with our members. They need you.",
    color: PURPLE,
    desc: "A live 30-45 min Q&A with Conceivable subscribers — women actively working on their fertility, periods, and hormonal health. Your topic. Your expertise. We handle everything else.",
    valueForThem: "Direct access to a highly engaged, health-motivated audience who are actively looking for experts like you.",
    nextSteps: [
      "Pick a date using the scheduler below",
      "We send the prep guide — takes 20 min to prepare",
      "We promote it to our full list and social",
    ],
    cta: "Book Your Session",
    ctaLink: "#book-community",
    assets: ["Session Prep Guide", "Promotional Graphics", "Post-Event Recap Template"],
  },
  {
    id: "swap",
    emoji: "🎙️",
    title: "Podcast Guest Swap",
    tagline: "You come on ours. Kirsten comes on yours.",
    color: BLUE,
    desc: "Cross-promote both episodes the same week. Your listeners meet Kirsten. Her listeners meet you. Two Calendly links. Done in 5 minutes.",
    valueForThem: "Kirsten brings clinical depth, 25 years of stories, and an audience that is your exact demographic.",
    nextSteps: [
      "Book Kirsten for your show (link below)",
      "Book your slot on Conceivable's podcast",
      "We align release dates for maximum cross-exposure",
    ],
    cta: "Schedule Both",
    ctaLink: "#schedule",
    assets: ["Guest Brief", "Episode Talking Points", "Promo Graphics Pack"],
  },
  {
    id: "social",
    emoji: "📱",
    title: "Social Promo Swap",
    tagline: "We shout you out. You shout us out. Same week.",
    color: GREEN,
    desc: "No recording required. We post about your show to our 410K+ followers. You share our launch with your audience. One week of mutual exposure.",
    valueForThem: "410K followers + 29K email subscribers see your show. We write the caption for you.",
    nextSteps: [
      "Send us your show name + best episode link + one sentence",
      "We write your post, you approve it",
      "Download our launch assets below and post whenever you're ready",
    ],
    cta: "Get Launch Assets",
    ctaLink: "#assets",
    assets: ["Launch Graphics Pack", "Caption Templates", "Story Assets"],
  },
  {
    id: "cocreate",
    emoji: "⚡",
    title: "Co-Create Something",
    tagline: "A joint TikTok, a live collab, a shared resource — you pick.",
    color: YELLOW,
    desc: "The best collaborations are ones we invent together. Joint Instagram live, co-authored resource, combined TikTok series — open to whatever serves both our audiences.",
    valueForThem: "You bring the idea. We bring the audience and the clinical credibility. Together we make something neither of us could alone.",
    nextSteps: [
      "Book a 20-min brainstorm call below",
      "Or drop your idea in the text box — no call needed",
      "We respond within 48 hours",
    ],
    cta: "Start the Conversation",
    ctaLink: "#brainstorm",
    assets: ["Conceivable Brand Kit", "Co-Brand Guidelines"],
  },
];

const IMPACT_STATS = [
  { number: "10,000", label: "users needed for insurance mandate", color: BLUE },
  { number: "150–260%", label: "improvement in conception rates", color: GREEN },
  { number: "410K", label: "combined social followers", color: PURPLE },
  { number: "29K", label: "email subscribers", color: PINK },
];

interface ActivatedMap {
  [key: string]: boolean;
}

interface Props {
  partner: Partner;
}

export default function PartnerPortalClient({ partner }: Props) {
  const [activated, setActivated] = useState<ActivatedMap>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentUsers, setCurrentUsers] = useState(0);

  useEffect(() => {
    // Fetch real early access count
    fetch("/api/early-access/count")
      .then(r => r.json())
      .then(data => {
        if (typeof data.count === "number") {
          setCurrentUsers(data.count);
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, []);

  useEffect(() => {
    // Animate counter upward slowly once we have the real count
    if (currentUsers === 0) return;
    const interval = setInterval(() => {
      setCurrentUsers(n => {
        if (n < currentUsers + 300) return n + Math.floor(Math.random() * 3);
        clearInterval(interval);
        return n;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [currentUsers]);

  const toggleActivate = async (id: string) => {
    const wasActive = activated[id];
    const next = { ...activated, [id]: !wasActive };
    setActivated(next);
    if (!wasActive) {
      setExpanded(id);
      // Fire Mailchimp tag when turning ON
      try {
        await fetch("/api/partner-tag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: partner.email,
            tags: ["podcast-partner", `collab-${id}`],
          }),
        });
      } catch {
        // Fail silently — tag is best-effort
      }
    }
  };

  const activeCount = Object.values(activated).filter(Boolean).length;

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: OFF_WHITE, minHeight: "100vh", color: BLACK }}>

      {/* Welcome overlay */}
      {showWelcome && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(42,40,40,0.92)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{
            background: OFF_WHITE, maxWidth: 520, width: "90%", borderRadius: 24,
            padding: "48px 40px", textAlign: "center",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", background: partner.color,
              margin: "0 auto 24px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 28, color: "white", fontFamily: "sans-serif",
              fontWeight: 700,
            }}>
              {partner.avatar}
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, letterSpacing: 3, color: BLUE, textTransform: "uppercase", marginBottom: 8 }}>
              A personal invitation
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.3, marginBottom: 16 }}>
              {partner.name}, thank you<br />for everything you do.
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.7, color: "#555", marginBottom: 32 }}>
              The episode you recorded with Kirsten — <em>&ldquo;{partner.episode}&rdquo;</em> — reached women who needed it. This is your space to go further together.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: BLUE, color: "white", border: "none", borderRadius: 12,
                padding: "16px 40px", fontSize: 16, fontFamily: "sans-serif",
                fontWeight: 600, cursor: "pointer", width: "100%",
              }}
            >
              Enter Your Partner Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: BLACK, padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: BLUE,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "white", fontSize: 18 }}>✦</span>
          </div>
          <span style={{ color: "white", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 2, fontSize: 13, textTransform: "uppercase" }}>
            Conceivable Partners
          </span>
        </div>
        <div style={{
          background: "rgba(90,111,255,0.2)", border: `1px solid ${BLUE}`,
          borderRadius: 20, padding: "6px 16px",
          fontFamily: "sans-serif", fontSize: 12, color: BABY_BLUE,
        }}>
          {partner.show}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a2e 100%)`,
        padding: "64px 32px 48px", textAlign: "center",
      }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 4, color: BABY_BLUE, textTransform: "uppercase", marginBottom: 20 }}>
          Partner Portal — {partner.name}
        </p>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "white", fontWeight: 400, lineHeight: 1.2, marginBottom: 20, maxWidth: 700, margin: "0 auto 20px" }}>
          Together, we can give every woman access to her own care team.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Three major insurance companies have told us: if Conceivable reaches 10,000 users, they&apos;ll mandate coverage for the full platform — the AI care team, the Halo Ring, the supplements — paid for by insurance. That means women who can&apos;t afford any of it get access to everything.
        </p>

        {/* Live counter */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "rgba(90,111,255,0.15)", border: `1px solid rgba(90,111,255,0.3)`,
          borderRadius: 16, padding: "20px 32px",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: BABY_BLUE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              Current users
            </div>
            <div style={{ fontSize: 40, color: "white", fontWeight: 400 }}>
              {currentUsers.toLocaleString()}
            </div>
          </div>
          <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: BABY_BLUE, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              Goal for insurance mandate
            </div>
            <div style={{ fontSize: 40, color: GREEN, fontWeight: 400 }}>
              10,000
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: 400, margin: "16px auto 0" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 100, height: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`,
              width: `${Math.min((currentUsers / 10000) * 100, 100)}%`,
              transition: "width 1s ease",
            }} />
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
            {((currentUsers / 10000) * 100).toFixed(1)}% of the way there
          </p>
        </div>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: "#ddd" }}>
        {IMPACT_STATS.map((s, i) => (
          <div key={i} style={{ background: OFF_WHITE, padding: "28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 28, color: s.color, fontWeight: 400, lineHeight: 1 }}>{s.number}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#888", marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3, color: BLUE, textTransform: "uppercase", marginBottom: 12 }}>
            How we grow together
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 400, marginBottom: 12 }}>
            Choose your collaboration
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#666", maxWidth: 500, margin: "0 auto" }}>
            Every option is designed to grow your audience as much as ours. Pick one, pick all — whatever works for {partner.show}.
          </p>
          {activeCount > 0 && (
            <div style={{
              display: "inline-block", marginTop: 16,
              background: GREEN + "22", border: `1px solid ${GREEN}`,
              borderRadius: 20, padding: "8px 20px",
              fontFamily: "sans-serif", fontSize: 13, color: GREEN,
            }}>
              ✓ You&apos;re in on {activeCount} collaboration{activeCount > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Collab cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(380px, 100%), 1fr))", gap: 16 }}>
          {COLLAB_OPTIONS.map((opt) => {
            const isActive = activated[opt.id];

            return (
              <div
                key={opt.id}
                style={{
                  background: "white",
                  border: `2px solid ${isActive ? opt.color : "#e8e5de"}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? `0 8px 32px ${opt.color}22` : "none",
                }}
              >
                {/* Card header */}
                <div style={{ padding: "24px 24px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{opt.emoji}</div>
                      <h3 style={{ fontSize: 18, fontWeight: 400, marginBottom: 4 }}>{opt.title}</h3>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: opt.color, fontWeight: 600 }}>{opt.tagline}</p>
                    </div>
                    <button
                      onClick={() => toggleActivate(opt.id)}
                      style={{
                        width: 48, height: 28, borderRadius: 14,
                        background: isActive ? opt.color : "#e8e5de",
                        border: "none", cursor: "pointer",
                        position: "relative", transition: "all 0.3s ease", flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%", background: "white",
                        position: "absolute", top: 3,
                        left: isActive ? 23 : 3,
                        transition: "left 0.3s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }} />
                    </button>
                  </div>

                  <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#555", lineHeight: 1.6, marginTop: 12 }}>
                    {opt.desc}
                  </p>

                  {/* Value for them */}
                  <div style={{
                    background: opt.color + "11", borderLeft: `3px solid ${opt.color}`,
                    borderRadius: "0 8px 8px 0", padding: "10px 14px", marginTop: 12,
                  }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 12, color: BLACK, lineHeight: 1.5 }}>
                      <strong style={{ color: opt.color }}>What you get: </strong>{opt.valueForThem}
                    </p>
                  </div>
                </div>

                {/* Expanded section */}
                {isActive && (
                  <div style={{ borderTop: `1px solid ${opt.color}33`, padding: "20px 24px" }}>
                    <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, color: opt.color, textTransform: "uppercase", marginBottom: 14 }}>
                      Your next steps
                    </p>
                    <ol style={{ paddingLeft: 16, margin: 0 }}>
                      {opt.nextSteps.map((step, i) => (
                        <li key={i} style={{ fontFamily: "sans-serif", fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 4 }}>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {/* Asset pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                      {opt.assets.map((asset, i) => (
                        <div key={i} style={{
                          background: opt.color + "15",
                          border: `1px solid ${opt.color}40`,
                          borderRadius: 20, padding: "5px 12px",
                          fontFamily: "sans-serif", fontSize: 11, color: opt.color,
                          cursor: "pointer",
                        }}>
                          ↓ {asset}
                        </div>
                      ))}
                    </div>

                    <button style={{
                      marginTop: 16, background: opt.color, color: "white",
                      border: "none", borderRadius: 10, padding: "12px 24px",
                      fontFamily: "sans-serif", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", width: "100%",
                    }}>
                      {opt.cta} →
                    </button>
                  </div>
                )}

                {/* Collapsed CTA */}
                {!isActive && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <button
                      onClick={() => toggleActivate(opt.id)}
                      style={{
                        background: "transparent", border: `1px solid #ddd`,
                        borderRadius: 10, padding: "10px 20px",
                        fontFamily: "sans-serif", fontSize: 13, color: "#888",
                        cursor: "pointer", width: "100%",
                      }}
                    >
                      + I&apos;m interested in this
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* If they've activated something */}
        {activeCount > 0 && (
          <div style={{
            marginTop: 48, background: BLACK, borderRadius: 24,
            padding: "40px", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <h3 style={{ color: "white", fontSize: 24, fontWeight: 400, marginBottom: 12 }}>
              You&apos;re officially part of this.
            </h3>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.7 }}>
              Kirsten has been notified. Her team will follow up within 24 hours with everything you need to get started on your selected collaborations.
            </p>
            <div style={{
              display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center"
            }}>
              {COLLAB_OPTIONS.filter(o => activated[o.id]).map(o => (
                <span key={o.id} style={{
                  background: o.color + "22", border: `1px solid ${o.color}60`,
                  borderRadius: 20, padding: "6px 14px",
                  fontFamily: "sans-serif", fontSize: 12, color: o.color,
                }}>
                  {o.emoji} {o.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Kirsten personal note */}
        <div style={{
          marginTop: 48, background: "white", borderRadius: 20,
          padding: "36px", border: `1px solid #e8e5de`,
          display: "flex", gap: 24, alignItems: "flex-start",
          flexWrap: "wrap",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: BLUE,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: 20, color: "white",
          }}>
            K
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, color: BLUE, textTransform: "uppercase", marginBottom: 10 }}>
              A note from Kirsten
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#333", fontStyle: "italic", marginBottom: 12 }}>
              &ldquo;I&apos;ve spent 25 years in a room with women who felt like their bodies were failing them. Every single one of them was failed by a system that didn&apos;t listen, not by their body. That&apos;s what Conceivable fixes. I need you to help me get this into the hands of 10,000 women. After that, the insurance companies do the rest — and every woman gets access, regardless of what she can afford.&rdquo;
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#888" }}>
              — Kirsten Karchmer, MSOM | Founder &amp; CEO, Conceivable
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        background: BLACK, padding: "32px", textAlign: "center",
        borderTop: `1px solid #333`,
      }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
          Questions? Email partners@conceivable.com or reply to the email that brought you here.
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          © 2026 Conceivable. Making the impossible, Conceivable.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { box-sizing: border-box; }
        h1, h2, h3 { margin: 0; }
        p { margin: 0; }
        ol { margin: 0; }
      `}</style>
    </div>
  );
}
