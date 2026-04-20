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
const PINK = "#E37FB1";
const YELLOW = "#F1C028";
const PURPLE = "#9686B9";

// ─── Color palette data ───────────────────────────────────────────────────────
const PALETTE = [
  { name: "Blue (Primary)", hex: "#5A6FFF", label: "Primary Brand Color" },
  { name: "Baby Blue (Accent)", hex: "#ACB7FF", label: "Primary Accent" },
  { name: "Off White (Background)", hex: "#F9F7F0", label: "Primary Background", dark: true },
  { name: "Black (Text)", hex: "#2A2828", label: "Body Text" },
  { name: "Green", hex: "#1EAA55", label: "Success / Nature" },
  { name: "Pink", hex: "#E37FB1", label: "Warmth / Care" },
  { name: "Yellow", hex: "#F1C028", label: "Energy / Optimism", dark: true },
  { name: "Purple", hex: "#9686B9", label: "Calm / Wisdom" },
];

// ─── SVG wordmark string ──────────────────────────────────────────────────────
const WORDMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 50" width="320" height="50">
  <text x="0" y="38" font-family="Youth, Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="0.06em" fill="#5A6FFF">CONCEIVABLE</text>
</svg>`;

const WORDMARK_DARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 50" width="320" height="50">
  <text x="0" y="38" font-family="Youth, Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="0.06em" fill="#F9F7F0">CONCEIVABLE</text>
</svg>`;

// ─── Shared styles ────────────────────────────────────────────────────────────
const sectionCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  padding: "32px 36px",
  marginBottom: 24,
  boxShadow: "0 1px 8px rgba(42,40,40,0.07)",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "Youth, Inter, sans-serif",
  fontWeight: 700,
  fontSize: 22,
  color: BLACK,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  margin: "0 0 6px 0",
};

const sectionSubtitle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  color: "#888",
  margin: "0 0 24px 0",
  lineHeight: 1.5,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "#f0f0f0",
  margin: "24px 0",
};

// ─── Copy hex button ──────────────────────────────────────────────────────────
function CopyHexButton({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const el = document.createElement("textarea");
      el.value = hex;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "5px 12px",
        background: copied ? GREEN : "transparent",
        border: `1px solid ${copied ? GREEN : "#ddd"}`,
        borderRadius: 6,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        color: copied ? "#fff" : "#777",
        cursor: "pointer",
        transition: "all 0.2s",
        letterSpacing: "0.04em",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function ColorSwatch({
  name,
  hex,
  label,
  dark,
}: {
  name: string;
  hex: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        minWidth: 100,
      }}
    >
      {/* Swatch block */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 16,
          background: hex,
          border: dark ? "1.5px solid #e0ddd6" : "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
      {/* Color name */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: BLACK,
            margin: "0 0 2px 0",
            lineHeight: 1.3,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            color: "#999",
            margin: "0 0 6px 0",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </p>
        <code
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "#555",
            background: "#f5f5f5",
            padding: "2px 6px",
            borderRadius: 4,
            display: "block",
            marginBottom: 6,
          }}
        >
          {hex}
        </code>
        <CopyHexButton hex={hex} />
      </div>
    </div>
  );
}

// ─── Logo download button ─────────────────────────────────────────────────────
function LogoDownloadButton({ variant }: { variant: "light" | "dark" }) {
  function handleDownload() {
    const svg = variant === "dark" ? WORDMARK_DARK_SVG : WORDMARK_SVG;
    const filename = variant === "dark" ? "conceivable-wordmark-light-on-dark.svg" : "conceivable-wordmark.svg";
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "8px 16px",
        background: variant === "dark" ? "rgba(255,255,255,0.15)" : BLUE,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ↓ Download SVG
    </button>
  );
}

// ─── Voice attribute card ─────────────────────────────────────────────────────
function VoiceCard({
  word,
  description,
  color,
}: {
  word: string;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "20px 22px",
        background: `${color}10`,
        borderLeft: `4px solid ${color}`,
        borderRadius: "0 12px 12px 0",
        marginBottom: 14,
      }}
    >
      <p
        style={{
          fontFamily: "Youth, Inter, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          margin: "0 0 6px 0",
        }}
      >
        {word}
      </p>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          color: "#555",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ─── Guideline rule item ──────────────────────────────────────────────────────
function GuidelineRule({ number, text }: { number: number; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid #f5f5f5",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
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
          marginTop: 1,
        }}
      >
        {number}
      </span>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          color: "#444",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BrandKitClient({ partner }: { partner: Partner }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: OFF_WHITE,
        padding: "40px 20px 80px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
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
          <p
            style={{
              fontFamily: "Rauschen A, Inter, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: BLUE,
              margin: "0 0 8px 0",
            }}
          >
            Partner Resource
          </p>
          <h1
            style={{
              fontFamily: "Youth, Inter, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: BLACK,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              margin: "0 0 10px 0",
              lineHeight: 1.05,
            }}
          >
            Conceivable Brand Kit &<br />
            Co-Creation Guidelines
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#777",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Everything you need to talk about Conceivable accurately, beautifully, and on-brand.
            Questions? Email{" "}
            <a href="mailto:help@conceivable.com" style={{ color: BLUE }}>
              help@conceivable.com
            </a>
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — Brand Colors
        ════════════════════════════════════════════════════════════════════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Brand Colors</h2>
          <p style={sectionSubtitle}>
            Our full color palette. Use only these colors in co-branded content.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            {PALETTE.map((c) => (
              <ColorSwatch
                key={c.hex}
                name={c.name}
                hex={c.hex}
                label={c.label}
                dark={c.dark}
              />
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — Typography
        ════════════════════════════════════════════════════════════════════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Typography</h2>
          <p style={sectionSubtitle}>Three typefaces, each with a purpose.</p>

          {/* Youth */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "Rauschen A, Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: BLUE,
                  background: `${BLUE}10`,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                Display / Titles
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#aaa",
                }}
              >
                Youth Bold — UPPERCASE
              </span>
            </div>
            <p
              style={{
                fontFamily: "Youth, Georgia, serif",
                fontWeight: 700,
                fontSize: 36,
                color: BLACK,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                margin: "0 0 6px 0",
                lineHeight: 1.1,
              }}
            >
              A Journey to Possibility
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Used for big hero statements and product names
            </p>
          </div>

          <div style={divider} />

          {/* Inter */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "Rauschen A, Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: GREEN,
                  background: `${GREEN}10`,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                Body
              </span>
              <span
                style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#aaa" }}
              >
                Inter Regular — Sentence case
              </span>
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 17,
                color: BLACK,
                lineHeight: 1.7,
                margin: "0 0 6px 0",
                maxWidth: 560,
              }}
            >
              Your body is not failing you. It&apos;s sending signals nobody taught you to read.
              That&apos;s what Conceivable changes.
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              All body copy, captions, and UI text
            </p>
          </div>

          <div style={divider} />

          {/* Rauschen A */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: "Rauschen A, Inter, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: PURPLE,
                  background: `${PURPLE}15`,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                Captions / Labels
              </span>
              <span
                style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#aaa" }}
              >
                Rauschen A Regular — UPPERCASE
              </span>
            </div>
            <p
              style={{
                fontFamily: "Rauschen A, Inter, sans-serif",
                fontWeight: 500,
                fontSize: 13,
                color: "#777",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0 0 6px 0",
              }}
            >
              Partner Resource — Brand Guidelines — Section 02
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Section labels, eyebrows, badges
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — Logo
        ════════════════════════════════════════════════════════════════════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>The Conceivable Wordmark</h2>
          <p style={sectionSubtitle}>
            Our wordmark is set in Youth Bold, all uppercase. It&apos;s clean, confident, and warm — just like us.
            Do not alter the font, spacing, colors, or proportions.
          </p>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {/* Wordmark on light bg */}
            <div
              style={{
                flex: "1 1 280px",
                padding: "40px 36px",
                borderRadius: 20,
                background: OFF_WHITE,
                border: "1.5px solid #e8e8e8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "Youth, Georgia, serif",
                  fontWeight: 700,
                  fontSize: 32,
                  color: BLUE,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                CONCEIVABLE
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "Rauschen A, Inter, sans-serif",
                    fontSize: 10,
                    color: "#aaa",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Light background
                </span>
                <LogoDownloadButton variant="light" />
              </div>
            </div>

            {/* Wordmark on dark bg */}
            <div
              style={{
                flex: "1 1 280px",
                padding: "40px 36px",
                borderRadius: 20,
                background: BLACK,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "Youth, Georgia, serif",
                  fontWeight: 700,
                  fontSize: 32,
                  color: OFF_WHITE,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                CONCEIVABLE
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "Rauschen A, Inter, sans-serif",
                    fontSize: 10,
                    color: "#777",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Dark background
                </span>
                <LogoDownloadButton variant="dark" />
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "14px 18px",
              background: `${BABY_BLUE}15`,
              border: `1px solid ${BABY_BLUE}40`,
              borderRadius: 10,
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#555",
              lineHeight: 1.55,
            }}
          >
            <strong>Font:</strong> Youth Bold, UPPERCASE. Download the SVG for presentations, co-branded graphics, or show notes.
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — Voice & Tone
        ════════════════════════════════════════════════════════════════════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>How We Sound</h2>
          <p style={sectionSubtitle}>
            And how to sound like us in co-content. These principles apply to any content that
            mentions Conceivable.
          </p>

          <VoiceCard
            word="Smart as Hell"
            description="Board-certified expert with 20+ years of clinical experience. Science-backed, never dumbed down. We say 'research shows' not 'studies suggest vaguely.' Clarity and confidence — no jargon, no hedging."
            color={BLUE}
          />
          <VoiceCard
            word="Cool Aunt Energy"
            description="Warm, fun, a little cheeky. Like your super cool aunt who gets it — she's been through it, she knows things, and she's not going to sugarcoat it or make it weird. Parenthetical asides welcome. Short paragraphs. Breathing room."
            color={PINK}
          />
          <VoiceCard
            word="Trustworthy"
            description="You trust her because she's real, not because she's selling you something. Never alarmist, never pushy. When she recommends something, you listen — because she doesn't recommend things she doesn't believe in."
            color={PURPLE}
          />
          <VoiceCard
            word="Empowering"
            description={`End on action, not anxiety. Not "it's complicated" but "here's what you can do." Shift from confusion to clarity. From powerless to in control.`}
            color={GREEN}
          />

          <div
            style={{
              marginTop: 24,
              padding: "18px 22px",
              background: `${YELLOW}15`,
              border: `1.5px solid ${YELLOW}`,
              borderRadius: 12,
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#5a4a00",
              lineHeight: 1.65,
            }}
          >
            <strong style={{ fontWeight: 700 }}>Voice check:</strong> &quot;Would your smartest, funniest friend who also happens to be a world-class fertility expert say this? If yes, publish.&quot;
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — Co-Brand Guidelines
        ════════════════════════════════════════════════════════════════════ */}
        <div style={sectionCard}>
          <h2 style={sectionTitle}>Co-Brand Guidelines</h2>
          <p style={sectionSubtitle}>
            Eight rules that keep us aligned and keep your audience safe.
          </p>

          <div>
            {[
              'Always spell "Conceivable" with a capital C. Never "conceivable" lowercase.',
              'The AI coach is named "Kai" — not "the AI" or "the bot".',
              'The wearable is "the Halo Ring" — never "the ring" or "the device".',
              'The score is "your Conceivable Score" — not "CON score" or "fertility score".',
              'Do not make specific medical claims (e.g. "Conceivable cures infertility"). Use: "supports fertility health", "helps understand your body\'s patterns", "personalized approach to fertility readiness".',
              "Always include @tryconceivable tag when mentioning on social.",
              "Use the approved color palette — no custom colors without approval.",
              "Run any co-branded content by help@conceivable.com before publishing.",
            ].map((rule, i) => (
              <GuidelineRule key={i} number={i + 1} text={rule} />
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6 — Ready to Co-Create?
        ════════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: BLACK,
            borderRadius: 20,
            padding: "36px 40px",
            boxShadow: "0 4px 20px rgba(42,40,40,0.18)",
          }}
        >
          <p
            style={{
              fontFamily: "Rauschen A, Inter, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: BABY_BLUE,
              margin: "0 0 10px 0",
            }}
          >
            Let&apos;s Build Something Together
          </p>
          <h2
            style={{
              fontFamily: "Youth, Inter, sans-serif",
              fontWeight: 700,
              fontSize: 26,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              margin: "0 0 10px 0",
              lineHeight: 1.1,
            }}
          >
            Ready to Co-Create?
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.7)",
              margin: "0 0 28px 0",
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            Book your 20-min brainstorm call with Kirsten&apos;s team. We&apos;ll come ready with
            ideas specific to your show and audience.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://calendly.com/kirstenk/free-fertility-assessment"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 28px",
                background: BLUE,
                color: "#fff",
                borderRadius: 12,
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              Book Now
            </a>

            <a
              href={`mailto:help@conceivable.com?subject=${encodeURIComponent(
                `Co-Create Idea — ${partner.show}`
              )}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 24px",
                background: "transparent",
                color: BABY_BLUE,
                border: `1.5px solid rgba(172,183,255,0.4)`,
                borderRadius: 12,
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Or drop your idea →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
