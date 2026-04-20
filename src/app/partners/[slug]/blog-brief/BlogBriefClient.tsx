"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Partner } from "@/lib/data/partners";

const BLUE = "#5A6FFF";
const BABY_BLUE = "#ACB7FF";
const OFF_WHITE = "#F9F7F0";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";

const KIRSTEN_BIO =
  "Kirsten Karchmer is a board-certified reproductive health expert with 25 years of clinical experience and the founder of Conceivable — an AI-powered fertility health platform. She has worked with thousands of women across every fertility challenge imaginable and conducted 120+ expert podcast interviews to build the most comprehensive, personalized approach to fertility health available. Learn more at www.conceivable.com.";

const SEO_ITEMS = [
  "Include target keyword in the first 100 words",
  "Use H2 subheadings every 300–400 words",
  "Link to 2+ authoritative external sources",
  "Include a clear call to action in the last paragraph",
  "Keep paragraphs 2–3 sentences max",
  "Add alt text to any images",
  "Aim for a Flesch reading score of 60+ (conversational)",
];

const TOPIC_OPTIONS = [
  "Fertility nutrition fundamentals",
  "The sleep–hormone connection",
  "Reading your cycle as data",
  "HRV and stress impact on fertility",
  "Supplement personalization vs. generic protocols",
  "Other (tell us)",
];

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
      fontSize: 28,
      fontWeight: 400,
      marginBottom: 8,
      lineHeight: 1.25,
    }}>
      {children}
    </h2>
  );
}

export default function BlogBriefClient({ partner }: { partner: Partner }) {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(SEO_ITEMS.length).fill(false));
  const [selectedKirstenTopic, setSelectedKirstenTopic] = useState(TOPIC_OPTIONS[0]);
  const [authorBio, setAuthorBio] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const topicSuggestions = [
    `The ${partner.show.replace(" Podcast", "").replace(" podcast", "")} Approach to Fertility: What I've Learned`,
    `Why ${partner.show} Listeners Ask Me About Hormones More Than Anything Else`,
    "The Fertility Question I Get Most Often (And the Real Answer)",
  ];

  const toggleCheck = (i: number) => {
    const next = [...checkedItems];
    next[i] = !next[i];
    setCheckedItems(next);
  };

  const checkedCount = checkedItems.filter(Boolean).length;

  const mailtoBody = `Hi Kirsten's team,

I'd love to kick off our blog swap. Here are my details:

Name: ${partner.name}
Show/Platform: ${partner.show}
Email: ${partner.email}
Website: ${partner.url || "—"}
Author Bio:
${authorBio || "[Please add your 2–3 sentence bio here]"}

Preferred topic for Kirsten's post: ${selectedKirstenTopic}

Looking forward to working together!

${partner.name}`;

  const mailtoHref = `mailto:help@conceivable.com?subject=${encodeURIComponent(`Blog Swap — ${partner.show}`)}&body=${encodeURIComponent(mailtoBody)}`;
  const headingshotHref = `mailto:help@conceivable.com?subject=${encodeURIComponent(`Headshot — ${partner.show}`)}&body=${encodeURIComponent(`Hi team,\n\nHere is my headshot attached for the blog swap.\n\n[ATTACH YOUR HEADSHOT]\n\n${partner.name}`)}`;

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

        {/* Page header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 11,
            letterSpacing: 3,
            color: BLUE,
            textTransform: "uppercase" as const,
            marginBottom: 10,
          }}>
            Blog Swap
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(30px,4vw,46px)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 14,
          }}>
            Your Blog Swap Brief, {partner.name}
          </h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 580 }}>
            Everything you need to write for us, and what to expect from Kirsten.
          </p>
        </div>

        {/* ── SECTION 1: Writing for Conceivable ──────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 32,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Part 1 — You write for us" />
          <SectionTitle>Writing for Conceivable&apos;s Blog</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            Choose a topic below — or tell us your own. These are crafted to perform well with our audience and give you real SEO equity on a high-authority domain.
          </p>

          {/* Topic pills */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 36 }}>
            {topicSuggestions.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedTopic(i === selectedTopic ? null : i)}
                style={{
                  background: selectedTopic === i ? BLUE : "white",
                  color: selectedTopic === i ? "white" : BLACK,
                  border: `2px solid ${selectedTopic === i ? BLUE : "#e8e5de"}`,
                  borderRadius: 12,
                  padding: "14px 20px",
                  textAlign: "left" as const,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  lineHeight: 1.5,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                {selectedTopic === i ? "✓ " : ""}&ldquo;{t}&rdquo;
              </button>
            ))}
          </div>

          {/* Brief template */}
          <div style={{
            background: OFF_WHITE,
            borderRadius: 16,
            padding: "28px",
            border: "1px solid #e8e5de",
          }}>
            <p style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 11,
              letterSpacing: 3,
              color: "#999",
              textTransform: "uppercase" as const,
              marginBottom: 20,
            }}>
              Your Brief
            </p>

            <div style={{ display: "grid", gap: 20 }}>
              {[
                { label: "Word Count", value: "1,000–1,500 words" },
                {
                  label: "Tone",
                  value: "Warm, evidence-based, conversational. Think: expert friend, not textbook.",
                },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 4 }}>{item.label.toUpperCase()}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 16, lineHeight: 1.6, color: BLACK }}>{item.value}</p>
                </div>
              ))}

              <div>
                <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 10 }}>STRUCTURE</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {[
                    { num: "01", label: "Hook", desc: "A question or story that pulls the reader in" },
                    { num: "02", label: "Your expertise angle", desc: "What you uniquely bring to this topic" },
                    { num: "03", label: "The takeaway", desc: "Something readers can apply right now" },
                    { num: "04", label: "Soft CTA", desc: "To try Conceivable — nothing pushy" },
                  ].map(step => (
                    <div key={step.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <span style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: 11,
                        color: BLUE,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 3,
                      }}>
                        {step.num}
                      </span>
                      <div>
                        <span style={{ fontFamily: "Georgia, serif", fontSize: 15, color: BLACK }}>{step.label}</span>
                        <span style={{ fontSize: 13, color: "#777" }}> — {step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 8 }}>INCLUDE</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {[
                      "1–2 personal stories or examples",
                      "Links to 2+ reputable sources",
                    ].map((item, i) => (
                      <li key={i} style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#999", letterSpacing: 1, marginBottom: 8 }}>AVOID</p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {[
                      "Health claims without evidence",
                      "Specific supplement dosages",
                      "Anything that sounds like a prescription",
                    ].map((item, i) => (
                      <li key={i} style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Kirsten's bio for their site */}
          <div style={{ marginTop: 28 }}>
            <p style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 11,
              letterSpacing: 3,
              color: "#999",
              textTransform: "uppercase" as const,
              marginBottom: 14,
            }}>
              Kirsten&apos;s Author Bio — Put This on Your Site
            </p>
            <div style={{
              background: `${BLUE}08`,
              border: `1px solid ${BLUE}25`,
              borderRadius: 12,
              padding: "20px 20px 16px",
            }}>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: 15,
                lineHeight: 1.8,
                color: "#333",
                fontStyle: "italic",
                marginBottom: 16,
              }}>
                &ldquo;{KIRSTEN_BIO}&rdquo;
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <CopyButton text={KIRSTEN_BIO} label="Copy Bio" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Kirsten writes for them ──────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 32,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Part 2 — Kirsten writes for you" />
          <SectionTitle>What to Expect</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            Kirsten will write a 1,200-word piece tailored to your audience and topic, delivered within 2 weeks of receiving your headshot and bio. Fill in the details below and she&apos;ll handle the rest.
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
                  Show / Platform
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

            {/* Email + URL */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                  Your Email
                </label>
                <input
                  type="email"
                  defaultValue={partner.email}
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
                  Your Website URL
                </label>
                <input
                  type="text"
                  defaultValue={partner.url || ""}
                  placeholder="yoursite.com"
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

            {/* Author bio */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                Your Author Bio
              </label>
              <textarea
                value={authorBio}
                onChange={e => setAuthorBio(e.target.value)}
                placeholder="A short bio for the byline — 2–3 sentences about you and your work"
                rows={4}
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

            {/* Topic dropdown */}
            <div>
              <label style={{ fontSize: 11, letterSpacing: 2, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase" as const }}>
                Preferred Topic for Kirsten&apos;s Post
              </label>
              <select
                value={selectedKirstenTopic}
                onChange={e => setSelectedKirstenTopic(e.target.value)}
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
                  cursor: "pointer",
                  appearance: "auto" as const,
                }}
              >
                {TOPIC_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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
                marginTop: 4,
              }}
            >
              Send Brief + Request Kirsten&apos;s Post →
            </button>
          </form>
        </div>

        {/* ── SECTION 3: Headshot ──────────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 32,
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="Headshot" />
          <SectionTitle>Send Us Your Headshot</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            For the author bio on our blog. 400×400px minimum, square crop preferred.
          </p>

          {/* Upload area */}
          <div
            style={{
              border: "2px dashed #d8d5ce",
              borderRadius: 16,
              padding: "40px 24px",
              textAlign: "center" as const,
              marginBottom: 20,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onClick={() => document.getElementById("headshot-input")?.click()}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>⬆</div>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>
              {fileName ? `Selected: ${fileName}` : "Click to select your headshot"}
            </p>
            <p style={{ fontSize: 12, color: "#aaa" }}>JPG, PNG — 400×400px or larger</p>
            <input
              id="headshot-input"
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </div>

          <a
            href={headingshotHref}
            style={{
              display: "inline-block",
              background: OFF_WHITE,
              border: "1px solid #e8e5de",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: 13,
              color: BLACK,
              fontFamily: "'Inter',sans-serif",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Or send via email →
          </a>
        </div>

        {/* ── SECTION 4: SEO Checklist ─────────────────────────────────────── */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: "40px",
          border: "1px solid #e8e5de",
        }}>
          <SectionLabel text="SEO Checklist" />
          <SectionTitle>Before You Hit Submit</SectionTitle>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
            Run through this before sending your draft. Posts that follow these guidelines rank, and ranking means long-term traffic to both our sites.
          </p>

          {/* Progress bar */}
          <div style={{
            background: "#f0ede6",
            borderRadius: 100,
            height: 6,
            overflow: "hidden",
            marginBottom: 24,
          }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`,
              width: `${(checkedCount / SEO_ITEMS.length) * 100}%`,
              transition: "width 0.3s ease",
              borderRadius: 100,
            }} />
          </div>
          <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>
            {checkedCount} of {SEO_ITEMS.length} checked
          </p>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {SEO_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                style={{
                  background: checkedItems[i] ? `${GREEN}0f` : "transparent",
                  border: `1px solid ${checkedItems[i] ? GREEN : "#e8e5de"}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  textAlign: "left" as const,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${checkedItems[i] ? GREEN : "#ccc"}`,
                  background: checkedItems[i] ? GREEN : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}>
                  {checkedItems[i] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 14,
                  color: checkedItems[i] ? "#555" : BLACK,
                  textDecoration: checkedItems[i] ? "line-through" : "none",
                  lineHeight: 1.5,
                }}>
                  {item}
                </span>
              </button>
            ))}
          </div>

          {checkedCount === SEO_ITEMS.length && (
            <div style={{
              marginTop: 24,
              background: `${GREEN}10`,
              border: `1px solid ${GREEN}40`,
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <p style={{ fontSize: 14, color: GREEN, fontWeight: 500 }}>
                You&apos;re ready. Submit your draft to help@conceivable.com with the subject line &ldquo;Blog Draft — {partner.show}&rdquo;
              </p>
            </div>
          )}
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
        input:focus, textarea:focus, select:focus {
          border-color: ${BLUE} !important;
          box-shadow: 0 0 0 3px ${BLUE}18;
        }
        li { margin: 0; }
        ul { margin: 0; }
      `}</style>
    </div>
  );
}
