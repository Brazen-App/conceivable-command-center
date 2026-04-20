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

// ─── Focus area options ───────────────────────────────────────────────────────
const FOCUS_OPTIONS = [
  "The Halo Ring experience",
  "Kai — the AI coaching",
  "The personalized supplement approach",
  "The overall fertility health system",
  "Your personal results / data story",
];

// ─── Shared style tokens ──────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "28px 32px",
  marginBottom: 20,
  boxShadow: "0 1px 6px rgba(42,40,40,0.07)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #e8e8e8",
  borderRadius: 10,
  fontFamily: "Inter, sans-serif",
  fontSize: 15,
  color: BLACK,
  background: OFF_WHITE,
  outline: "none",
  boxSizing: "border-box",
  marginBottom: 18,
};

const sectionEyebrow: React.CSSProperties = {
  fontFamily: "Rauschen A, Inter, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: BLUE,
  marginBottom: 16,
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
      {([1, 2] as const).map((n) => {
        const active = n === step;
        const done = n < step;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: active ? BLUE : done ? GREEN : "transparent",
                border: `2px solid ${active || done ? "transparent" : "#ccc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: active || done ? "#fff" : "#999",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {done ? "✓" : n}
            </div>
            <span
              style={{
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                color: active ? BLACK : "#999",
                fontWeight: active ? 600 : 400,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Step {n} of 2
            </span>
            {n < 2 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: step > 1 ? GREEN : "#ddd",
                  marginLeft: 4,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Radio option ─────────────────────────────────────────────────────────────
function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderRadius: 10,
        cursor: "pointer",
        marginBottom: 8,
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        color: BLACK,
        background: selected ? `${BLUE}10` : "transparent",
        border: `1.5px solid ${selected ? BLUE : "#e8e8e8"}`,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${selected ? BLUE : "#ccc"}`,
          background: selected ? BLUE : "transparent",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
        )}
      </div>
      {label}
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function ReviewFlowClient({ partner }: { partner: Partner }) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [name, setName] = useState(partner.name);
  const [show, setShow] = useState(partner.show);
  const [email, setEmail] = useState(partner.email);
  const [focus, setFocus] = useState(FOCUS_OPTIONS[0]);
  const [angle, setAngle] = useState("");
  const [experienced, setExperienced] = useState<"yes" | "no" | "">("");

  // Step 2
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const prompts = [
    "What was your first impression when you opened the app?",
    "What surprised you most about the data you saw?",
    "Describe the moment you felt like the system 'got' you.",
    "What would you tell a friend who's been struggling with this journey?",
    "What's the one thing you wish you'd had access to earlier?",
    `How did "${focus}" change how you think about fertility health?`,
  ];

  function handleSubmit() {
    const subject = encodeURIComponent(`Video Review Submission — ${show}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Show: ${show}`,
        `Focus Area: ${focus}`,
        `Video URL: ${videoUrl}`,
        "",
        `Notes:\n${notes}`,
      ].join("\n")
    );
    window.location.href = `mailto:help@conceivable.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: OFF_WHITE,
        padding: "40px 20px 80px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
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

        <StepIndicator step={step} />

        {/* ══════════════════════════════════════════════════════════════════
            STEP 1
        ══════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontFamily: "Youth, Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 30,
                  color: BLACK,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Let&apos;s Set Up Your Swap,{" "}
                <span style={{ color: BLUE }}>{partner.name}</span>
              </h1>
            </div>

            {/* Basic info card */}
            <div style={card}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  color: "#666",
                  marginTop: 0,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                We&apos;ve pre-filled what we know about you. Edit anything that needs updating.
              </p>

              <label style={labelStyle}>Your name</label>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label style={labelStyle}>Show / Podcast name</label>
              <input
                style={inputStyle}
                value={show}
                onChange={(e) => setShow(e.target.value)}
              />

              <label style={labelStyle}>Email</label>
              <input
                style={{ ...inputStyle, marginBottom: 0 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Focus area card */}
            <div style={card}>
              <label style={{ ...labelStyle, fontSize: 13, marginBottom: 14 }}>
                What aspect of Conceivable would you most like to focus your review on?
              </label>
              {FOCUS_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={focus === opt}
                  onSelect={() => setFocus(opt)}
                />
              ))}
            </div>

            {/* Angle card */}
            <div style={card}>
              <label style={labelStyle}>
                In a sentence or two, what angle or hook do you want for your review?
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  height: 100,
                  resize: "vertical",
                  marginBottom: 0,
                }}
                placeholder="e.g. 'I want to focus on how the data visualization helped me understand my cycle patterns'"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </div>

            {/* Experienced card */}
            <div style={card}>
              <label style={{ ...labelStyle, marginBottom: 14 }}>
                Have you already experienced Conceivable?
              </label>
              <RadioOption
                label="Yes"
                selected={experienced === "yes"}
                onSelect={() => setExperienced("yes")}
              />
              <RadioOption
                label="No"
                selected={experienced === "no"}
                onSelect={() => setExperienced("no")}
              />
              {experienced === "no" && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "14px 18px",
                    background: `${BABY_BLUE}30`,
                    border: `1.5px solid ${BABY_BLUE}`,
                    borderRadius: 10,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: BLUE,
                    lineHeight: 1.6,
                  }}
                >
                  We&apos;ll get you set up with free access first. Kirsten&apos;s team will reach
                  out within 24 hours.
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!experienced}
              style={{
                width: "100%",
                padding: "16px 24px",
                background: experienced ? BLUE : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                cursor: experienced ? "pointer" : "not-allowed",
                letterSpacing: "0.01em",
              }}
            >
              Next: Get Your Review Prompts →
            </button>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STEP 2
        ══════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1
                style={{
                  fontFamily: "Youth, Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 28,
                  color: BLACK,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  margin: 0,
                }}
              >
                Your Review Prompts + Recording Guide
              </h1>
            </div>

            {/* A: Prompts */}
            <div style={card}>
              <p style={sectionEyebrow}>A. Prompts to guide your video</p>
              {prompts.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: i < prompts.length - 1 ? "1px solid #f0f0f0" : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: `${BLUE}15`,
                      color: BLUE,
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 15,
                      color: BLACK,
                      lineHeight: 1.55,
                    }}
                  >
                    {p}
                  </span>
                </div>
              ))}
            </div>

            {/* B: Recording guide */}
            <div style={card}>
              <p style={sectionEyebrow}>B. Loom Recording Guide</p>
              {[
                "Keep it 60–90 seconds — authentic beats polished",
                `Start with your name and show ("I'm ${name} from ${show}")`,
                "Film from a stable surface, face-lit (window light works great)",
                "Don't read from a script — use the prompts as conversation starters",
                '"Early access is open at conceivable.com" — end on this, say it naturally',
              ].map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 10,
                    alignItems: "flex-start",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "#555",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    ✓
                  </span>
                  {tip}
                </div>
              ))}
            </div>

            {/* C: Submit */}
            <div style={card}>
              <p style={sectionEyebrow}>C. Submit Your Review</p>

              {submitted ? (
                <div
                  style={{
                    padding: "20px 24px",
                    background: `${GREEN}12`,
                    border: `1.5px solid ${GREEN}`,
                    borderRadius: 12,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 15,
                    color: GREEN,
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  ✓ Submitted! Kirsten&apos;s team will confirm within 24 hours and begin working
                  on your show review.
                </div>
              ) : (
                <>
                  <label style={labelStyle}>Paste Loom or video URL</label>
                  <input
                    style={inputStyle}
                    type="url"
                    placeholder="https://loom.com/share/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />

                  <label style={labelStyle}>Any notes for Kirsten&apos;s team</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      height: 90,
                      resize: "vertical",
                      marginBottom: 20,
                    }}
                    placeholder="Anything you want us to know..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={!videoUrl}
                    style={{
                      width: "100%",
                      padding: "16px 24px",
                      background: videoUrl ? BLUE : "#ccc",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: videoUrl ? "pointer" : "not-allowed",
                    }}
                  >
                    Submit Review →
                  </button>
                </>
              )}
            </div>

            {/* Back to step 1 */}
            <button
              onClick={() => setStep(1)}
              style={{
                background: "transparent",
                border: "none",
                color: BLUE,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                padding: 0,
                marginTop: 4,
              }}
            >
              ← Back to Step 1
            </button>
          </>
        )}
      </div>
    </div>
  );
}
