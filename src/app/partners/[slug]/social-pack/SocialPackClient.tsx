"use client";

import { useState } from "react";
import Link from "next/link";
import type { Partner } from "@/lib/data/partners";

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BLUE = "#5A6FFF";
const BABY_BLUE = "#ACB7FF";
const OFF_WHITE = "#F9F7F0";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatHashtag(show: string) {
  return show
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean)
    .join("");
}

// ─── Copy caption button ──────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 18px",
        background: copied ? GREEN : "transparent",
        border: `1.5px solid ${copied ? GREEN : BLUE}`,
        borderRadius: 8,
        color: copied ? "#fff" : BLUE,
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copied!" : "Copy Caption"}
    </button>
  );
}

// ─── Individual post card ─────────────────────────────────────────────────────
function PostCard({
  label,
  caption,
}: {
  label: string;
  caption: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 16,
        boxShadow: "0 1px 6px rgba(42,40,40,0.06)",
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "Rauschen A, Inter, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: BLUE,
            background: `${BLUE}10`,
            padding: "4px 10px",
            borderRadius: 6,
          }}
        >
          {label}
        </span>
        <CopyButton text={caption} />
      </div>

      {/* Caption text */}
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          color: "#444",
          lineHeight: 1.7,
          margin: 0,
          whiteSpace: "pre-line",
        }}
      >
        {caption}
      </p>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "Youth, Inter, sans-serif",
        fontWeight: 700,
        fontSize: 22,
        color: BLACK,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        margin: "0 0 20px 0",
      }}
    >
      {children}
    </h2>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SocialPackClient({ partner }: { partner: Partner }) {
  const [postingWeek, setPostingWeek] = useState("");
  const [weekSaved, setWeekSaved] = useState(false);
  const hashtag = formatHashtag(partner.show);

  // ── 4 pre-written captions ──────────────────────────────────────────────────
  const posts = [
    {
      label: "Educational",
      caption: `Here's something wild 🤯

Your body is sending you hundreds of fertility signals every single day.

Your sleep quality. Your HRV. Your cycle patterns. Your temperature shifts. Your stress response.

Most apps track maybe ONE of those things and call it a day.

Conceivable tracks ALL of them — and then an AI coach named Kai analyzes your unique data and tells you exactly what to focus on first.

Not generic "take prenatal vitamins" advice.

YOUR body. YOUR data. YOUR plan. 🎯

Only 500 founding member spots available → www.conceivable.com

#fertility #TTC #womenshealth #hormonalhealth #IVF #PCOS #fertilitytips`,
    },
    {
      label: "Personal / Warm",
      caption: `I want to tell you about something I genuinely believe in ❤️

I've had a LOT of conversations about women's health over the years. I don't recommend things I haven't vetted. Period.

Conceivable is different.

It was built by Kirsten Karchmer — a board-certified reproductive health expert with 25 years of clinical experience. She's worked with thousands of women. Done 120+ expert interviews. And assembled a team of data scientists to build something that didn't exist before:

Personalized fertility care that actually adapts to YOU 🧬

The Halo Ring reads your body's signals. Kai (your AI coach) translates them into real actions. And your supplement pack is built around what YOUR body actually needs.

This is the kind of care that used to cost thousands. Now it's accessible to everyone.

500 founding member spots are open → www.conceivable.com

#fertility #conceivable #womenshealth #TTC #personalizedhealth`,
    },
    {
      label: "Urgency / Numbers",
      caption: `This matters and I want you to know why 👇

500 founding member spots. That's it. Pricing locked forever.

But here's the part that gave me chills:

Three insurance companies have already told Conceivable — reach 10,000 users and we'll mandate coverage for the full platform.

For EVERYONE. 🙌

That means your sign-up isn't just for you. It's pushing the door open for every woman who comes after you.

Personalized supplements. AI coaching. The Halo Ring tracking your body's real signals.

This is how we change fertility care for good.

Get started → www.conceivable.com

#fertility #TTC #insurance #womenshealth #reproductivehealth`,
    },
    {
      label: "Story",
      caption: `Something Kirsten Karchmer said to me that I can't stop thinking about 💭

"Your body is not failing you. It's sending signals nobody taught you to read."

Read that again.

So much of the fertility journey feels like your body is working against you. But what if it's actually trying to HELP — and we just didn't have the tools to listen?

That's exactly what Conceivable does ✨

The Halo Ring picks up the signals.
Kai (your AI coach) translates them.
Your personalized supplements support what your body actually needs.

Everything connected. Nothing guessed.

Check it out → www.conceivable.com

#fertility #holistichealth #womenshealth #TTC #fertilitytips #mindandbody`,
    },
  ];

  // ── Shoutout post ───────────────────────────────────────────────────────────
  const shoutoutCaption = `Ok I need to tell you about ${partner.name} and ${partner.show} 🎙️✨

If you're not already following — please fix that immediately because this is one of the most thoughtful, real, no-BS voices in the wellness space right now.

We just did an episode together called "${partner.episode}" and honestly? It's one of my favorite conversations I've had.

${partner.name} asks the questions nobody else is asking. No surface-level stuff. No fluff. Just real talk about what actually matters for your health.

THIS is the kind of content that moves the needle. Go listen, follow, and share with someone who needs it 🙏💜${partner.url ? `\n\n🔗 ${partner.url}` : ""}

#${hashtag} #fertility #womenshealth #podcastrecommendation`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: OFF_WHITE,
        padding: "40px 20px 80px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Back link */}
        <Link
          href={`/partners/${partner.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: BLUE,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 28,
          }}
        >
          ← Back to your portal
        </Link>

        {/* Page title */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "Youth, Inter, sans-serif",
              fontWeight: 700,
              fontSize: 30,
              color: BLACK,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              margin: "0 0 8px 0",
              lineHeight: 1.1,
            }}
          >
            Your Social Promo Pack,{" "}
            <span style={{ color: BLUE }}>{partner.name}</span>
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#666",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Ready-to-post captions for your audience, plus what we&apos;re sharing about you.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — Posts to share
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 40 }}>
          <SectionHeading>Posts We&apos;d Love You to Share</SectionHeading>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#777",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Use these as-is or make them your own. These are written to feel like you — not like
            an ad. Copy, paste, post.
          </p>
          {posts.map((p) => (
            <PostCard key={p.label} label={p.label} caption={p.caption} />
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — Shoutout preview
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 40 }}>
          <SectionHeading>Your Show Shoutout (What We&apos;re Posting About You)</SectionHeading>

          {/* Preview card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(42,40,40,0.06)",
            }}
          >
            {/* Header bar */}
            <div
              style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, ${BABY_BLUE} 100%)`,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "Rauschen A, Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#fff",
                }}
              >
                This is what we&apos;ll post about you ✓
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                @tryconceivable
              </span>
            </div>

            {/* Post body */}
            <div style={{ padding: "24px 28px" }}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  color: BLACK,
                  lineHeight: 1.7,
                  margin: "0 0 20px 0",
                  whiteSpace: "pre-line",
                }}
              >
                {shoutoutCaption}
              </p>
              <CopyButton text={shoutoutCaption} />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — When are you posting?
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 40 }}>
          <SectionHeading>When Are You Planning to Post?</SectionHeading>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              boxShadow: "0 1px 6px rgba(42,40,40,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                color: "#444",
                lineHeight: 1.65,
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              Let us know which week you&apos;re planning to share so we can coordinate our shoutout about you at the same time. We&apos;ll match your timing for maximum cross-promotion impact.
            </p>

            <input
              type="text"
              placeholder="e.g. &quot;Week of April 7&quot; or &quot;mid-April&quot;"
              value={postingWeek}
              onChange={(e) => {
                setPostingWeek(e.target.value);
                setWeekSaved(false);
              }}
              style={{
                width: "100%",
                padding: "14px 18px",
                border: `1.5px solid ${weekSaved ? GREEN : "#ddd"}`,
                borderRadius: 12,
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                color: BLACK,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => { if (!weekSaved) e.target.style.borderColor = BLUE; }}
              onBlur={(e) => { if (!weekSaved) e.target.style.borderColor = "#ddd"; }}
            />

            {weekSaved ? (
              <div
                style={{
                  padding: "14px 18px",
                  background: `${GREEN}12`,
                  border: `1.5px solid ${GREEN}`,
                  borderRadius: 10,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  color: GREEN,
                  fontWeight: 600,
                }}
              >
                ✓ Got it! We&apos;ll match your timing. Keep an eye on your email for confirmation.
              </div>
            ) : (
              <button
                onClick={() => {
                  if (postingWeek.trim()) setWeekSaved(true);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px 24px",
                  background: postingWeek.trim() ? BLUE : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: postingWeek.trim() ? "pointer" : "default",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                Save My Posting Week
              </button>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — What happens next
        ════════════════════════════════════════════════════════════════════ */}
        <div>
          <SectionHeading>What Happens Next</SectionHeading>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 32px",
              boxShadow: "0 1px 6px rgba(42,40,40,0.06)",
            }}
          >
            {[
              "We'll send you the exact post we're publishing about your show (for your approval)",
              "We'll coordinate our shoutout to match your posting week",
              "You post whenever feels right — use the captions above as-is or make them yours",
              "We'll share metrics with you after so you can see the impact",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: 12,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.55,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: `${BLUE}15`,
                    color: BLUE,
                    fontWeight: 700,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
