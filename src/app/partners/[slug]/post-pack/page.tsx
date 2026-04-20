"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getPartnerBySlug, Partner } from "@/lib/data/partners";
import { notFound } from "next/navigation";

const BLUE = "#5A6FFF";
const BABY_BLUE = "#ACB7FF";
const OFF_WHITE = "#F9F7F0";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";
const PINK = "#E37FB1";
const YELLOW = "#F1C028";
const PURPLE = "#9686B9";

// ─── SVG Card Builders ───────────────────────────────────────────────────────

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function svgLines(lines: string[], x: number, startY: number, lineHeight: number, attrs: string): string {
  return lines
    .map((line, i) => `<text x="${x}" y="${startY + i * lineHeight}" ${attrs}>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>`)
    .join("\n");
}

function buildPostCards(partner: Partner): string[] {
  // Card 1: Quote card — dark blue gradient
  const card1 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0d0d1a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g1)"/>
  <rect x="48" y="48" width="504" height="504" rx="4" fill="none" stroke="${BLUE}" stroke-width="1" opacity="0.3"/>
  <text x="72" y="100" font-family="Georgia,serif" font-size="52" fill="${BLUE}" opacity="0.6">\u201C</text>
  ${svgLines(wrapText("Your body is not failing you. It's sending you signals nobody has taught you to read. Until now.", 34), 72, 160, 38, `font-family="Georgia,serif" font-size="24" fill="white" font-style="italic"`)}
  <line x1="72" y1="380" x2="200" y2="380" stroke="${BABY_BLUE}" stroke-width="1" opacity="0.5"/>
  <text x="72" y="410" font-family="'Inter',sans-serif" font-size="13" fill="${BABY_BLUE}" letter-spacing="1">\u2014 Kirsten Karchmer, Conceivable</text>
  <text x="300" y="540" font-family="'Inter',sans-serif" font-size="22" fill="${BLUE}" text-anchor="middle">\u2736</text>
  <text x="300" y="568" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.3)" text-anchor="middle" letter-spacing="3">CONCEIVABLE</text>
</svg>`;

  // Card 2: Stats card — off-white, blue accent
  const card2 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${OFF_WHITE}"/>
  <rect x="0" y="0" width="8" height="600" fill="${BLUE}"/>
  <text x="48" y="80" font-family="'Inter',sans-serif" font-size="11" fill="${BLUE}" letter-spacing="3">THE NUMBERS</text>
  <text x="48" y="200" font-family="Georgia,serif" font-size="96" fill="${BLUE}" font-weight="700">10K</text>
  ${svgLines(wrapText("users needed for insurance coverage mandate", 36), 48, 240, 28, `font-family="'Inter',sans-serif" font-size="17" fill="${BLACK}"`)}
  <rect x="48" y="310" width="504" height="1" fill="#ddd"/>
  <text x="48" y="390" font-family="Georgia,serif" font-size="72" fill="${GREEN}" font-weight="700">150\u2013260%</text>
  ${svgLines(wrapText("improvement in conception rates", 36), 48, 430, 28, `font-family="'Inter',sans-serif" font-size="17" fill="${BLACK}"`)}
  <text x="552" y="568" font-family="'Inter',sans-serif" font-size="11" fill="rgba(42,40,40,0.3)" text-anchor="end" letter-spacing="2">CONCEIVABLE \u2736</text>
</svg>`;

  // Card 3: Mission card — dark background, green accent
  const card3 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${BLACK}"/>
  <rect x="0" y="0" width="600" height="6" fill="${GREEN}"/>
  <text x="300" y="100" font-family="'Inter',sans-serif" font-size="11" fill="${GREEN}" letter-spacing="4" text-anchor="middle">OUR MISSION</text>
  ${svgLines(wrapText("We built Conceivable so every woman gets access to her own care team \u2014 regardless of what she can afford.", 30), 64, 200, 44, `font-family="Georgia,serif" font-size="30" fill="white"`)}
  <circle cx="300" cy="490" r="28" fill="${GREEN}" opacity="0.15"/>
  <text x="300" y="498" font-family="'Inter',sans-serif" font-size="22" fill="${GREEN}" text-anchor="middle">\u2736</text>
  <text x="300" y="560" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="3">CONCEIVABLE.COM/EARLY-ACCESS</text>
</svg>`;

  // Card 4: Feature card — blue gradient
  const card4 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BLUE}"/>
      <stop offset="100%" style="stop-color:#3a4fd4"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g4)"/>
  <text x="300" y="80" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.6)" letter-spacing="4" text-anchor="middle">THE HALO RING</text>
  ${svgLines(wrapText("Tracks your temperature, sleep, and HRV \u2014 continuously.", 28), 64, 160, 44, `font-family="Georgia,serif" font-size="30" fill="white"`)}
  <rect x="64" y="300" width="80" height="2" fill="rgba(255,255,255,0.4)"/>
  ${svgLines(wrapText("Kai connects the dots. You finally get answers.", 28), 64, 360, 40, `font-family="Georgia,serif" font-size="28" fill="rgba(255,255,255,0.85)" font-style="italic"`)}
  <text x="300" y="540" font-family="'Inter',sans-serif" font-size="22" fill="rgba(255,255,255,0.5)" text-anchor="middle">\u2736</text>
  <text x="300" y="568" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="3">CONCEIVABLE</text>
</svg>`;

  // Card 5: Partner shoutout — off-white, partner color accent
  const pColor = partner.color || BLUE;
  const card5 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${OFF_WHITE}"/>
  <rect x="0" y="0" width="600" height="600" rx="0" fill="none" stroke="${pColor}" stroke-width="3" opacity="0.2"/>
  <text x="300" y="90" font-family="'Inter',sans-serif" font-size="32" fill="${pColor}" text-anchor="middle">\uD83C\uDF99\uFE0F</text>
  <text x="300" y="140" font-family="'Inter',sans-serif" font-size="12" fill="${pColor}" letter-spacing="3" text-anchor="middle">AS HEARD ON</text>
  ${svgLines(wrapText(partner.show, 28), 300, 210, 44, `font-family="Georgia,serif" font-size="36" fill="${BLACK}" text-anchor="middle"`)}
  <rect x="180" y="310" width="240" height="2" fill="${pColor}" opacity="0.4"/>
  ${svgLines(wrapText("Early access now open.", 28), 300, 380, 40, `font-family="Georgia,serif" font-size="28" fill="${BLACK}" text-anchor="middle"`)}
  <rect x="164" y="440" width="272" height="48" rx="24" fill="${pColor}"/>
  <text x="300" y="470" font-family="'Inter',sans-serif" font-size="14" fill="white" font-weight="700" text-anchor="middle" letter-spacing="1">500 FOUNDING MEMBER SPOTS</text>
  <text x="300" y="560" font-family="'Inter',sans-serif" font-size="11" fill="rgba(42,40,40,0.3)" text-anchor="middle" letter-spacing="3">CONCEIVABLE \u2736</text>
</svg>`;

  // Card 6: CTA card — dark, blue/green gradient
  const card6 = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g6" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0d0d1a"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
    <linearGradient id="accent6" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${BLUE}"/>
      <stop offset="100%" style="stop-color:${GREEN}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g6)"/>
  <rect x="0" y="0" width="600" height="4" fill="url(#accent6)"/>
  <text x="300" y="100" font-family="'Inter',sans-serif" font-size="11" fill="${BABY_BLUE}" letter-spacing="4" text-anchor="middle">LIMITED AVAILABILITY</text>
  <text x="300" y="240" font-family="Georgia,serif" font-size="64" fill="white" text-anchor="middle" font-weight="400">Join the</text>
  <text x="300" y="320" font-family="Georgia,serif" font-size="64" fill="${BLUE}" text-anchor="middle" font-weight="400">founding 500</text>
  <rect x="200" y="360" width="200" height="2" fill="url(#accent6)" opacity="0.6"/>
  <text x="300" y="420" font-family="'Inter',sans-serif" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="middle">conceivable.com/early-access</text>
  <text x="300" y="540" font-family="'Inter',sans-serif" font-size="22" fill="${BLUE}" text-anchor="middle">\u2736</text>
  <text x="300" y="568" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="3">CONCEIVABLE</text>
</svg>`;

  return [card1, card2, card3, card4, card5, card6];
}

function buildStoryCards(partner: Partner): string[] {
  // 9:16 ratio → 400x711
  const pColor = partner.color || BLUE;

  const s1 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="711" viewBox="0 0 400 711">
  <defs>
    <linearGradient id="sg1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0d0d1a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="711" fill="url(#sg1)"/>
  <text x="200" y="120" font-family="'Inter',sans-serif" font-size="11" fill="${BABY_BLUE}" letter-spacing="4" text-anchor="middle">SOMETHING I LEARNED</text>
  ${svgLines(wrapText("Your body is not the problem.", 20), 200, 220, 52, `font-family="Georgia,serif" font-size="36" fill="white" text-anchor="middle" font-style="italic"`)}
  ${svgLines(wrapText("The problem is nobody built the tools to read what it's telling you.", 22), 200, 350, 40, `font-family="Georgia,serif" font-size="26" fill="${BABY_BLUE}" text-anchor="middle"`)}
  <text x="200" y="570" font-family="'Inter',sans-serif" font-size="13" fill="${BLUE}" text-anchor="middle" letter-spacing="2">Until now.</text>
  <text x="200" y="650" font-family="'Inter',sans-serif" font-size="22" fill="${BLUE}" text-anchor="middle">\u2736</text>
  <text x="200" y="680" font-family="'Inter',sans-serif" font-size="10" fill="rgba(255,255,255,0.3)" text-anchor="middle" letter-spacing="3">CONCEIVABLE</text>
</svg>`;

  const s2 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="711" viewBox="0 0 400 711">
  <rect width="400" height="711" fill="${OFF_WHITE}"/>
  <rect x="0" y="0" width="400" height="6" fill="${pColor}"/>
  <text x="200" y="120" font-family="'Inter',sans-serif" font-size="11" fill="${pColor}" letter-spacing="3" text-anchor="middle">AS HEARD ON ${partner.show.toUpperCase()}</text>
  <text x="200" y="300" font-family="Georgia,serif" font-size="72" fill="${pColor}" text-anchor="middle" font-weight="400">500</text>
  <text x="200" y="350" font-family="'Inter',sans-serif" font-size="16" fill="${BLACK}" text-anchor="middle">founding member spots</text>
  <text x="200" y="420" font-family="Georgia,serif" font-size="24" fill="${BLACK}" text-anchor="middle" font-style="italic">Pricing locked forever.</text>
  <rect x="100" y="460" width="200" height="44" rx="22" fill="${pColor}"/>
  <text x="200" y="488" font-family="'Inter',sans-serif" font-size="13" fill="white" font-weight="700" text-anchor="middle">JOIN EARLY ACCESS</text>
  <text x="200" y="590" font-family="'Inter',sans-serif" font-size="11" fill="rgba(42,40,40,0.35)" text-anchor="middle" letter-spacing="2">conceivable.com/early-access</text>
  <text x="200" y="670" font-family="'Inter',sans-serif" font-size="18" fill="rgba(42,40,40,0.2)" text-anchor="middle">\u2736</text>
</svg>`;

  const s3 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="711" viewBox="0 0 400 711">
  <defs>
    <linearGradient id="sg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BLUE}"/>
      <stop offset="100%" style="stop-color:#3a4fd4"/>
    </linearGradient>
  </defs>
  <rect width="400" height="711" fill="url(#sg3)"/>
  <text x="200" y="120" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.6)" letter-spacing="4" text-anchor="middle">THE HALO RING</text>
  ${svgLines(wrapText("Temperature. Sleep. HRV. All connected.", 22), 200, 230, 46, `font-family="Georgia,serif" font-size="32" fill="white" text-anchor="middle"`)}
  <rect x="140" y="380" width="120" height="2" fill="rgba(255,255,255,0.4)"/>
  ${svgLines(wrapText("Kai connects the dots and builds your personal plan.", 22), 200, 450, 40, `font-family="Georgia,serif" font-size="26" fill="rgba(255,255,255,0.85)" text-anchor="middle" font-style="italic"`)}
  <text x="200" y="650" font-family="'Inter',sans-serif" font-size="18" fill="rgba(255,255,255,0.3)" text-anchor="middle">\u2736 CONCEIVABLE</text>
</svg>`;

  const s4 = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="711" viewBox="0 0 400 711">
  <rect width="400" height="711" fill="${BLACK}"/>
  <rect x="0" y="0" width="400" height="6" fill="${GREEN}"/>
  <text x="200" y="130" font-family="'Inter',sans-serif" font-size="11" fill="${GREEN}" letter-spacing="4" text-anchor="middle">MISSION-DRIVEN</text>
  ${svgLines(wrapText("If we reach 10,000 users, insurance companies will cover Conceivable for every woman.", 24), 200, 250, 44, `font-family="Georgia,serif" font-size="28" fill="white" text-anchor="middle"`)}
  <rect x="140" y="430" width="120" height="2" fill="${GREEN}" opacity="0.5"/>
  <text x="200" y="500" font-family="Georgia,serif" font-size="24" fill="${GREEN}" text-anchor="middle" font-style="italic">Regardless of what</text>
  <text x="200" y="548" font-family="Georgia,serif" font-size="24" fill="${GREEN}" text-anchor="middle" font-style="italic">she can afford.</text>
  <text x="200" y="640" font-family="'Inter',sans-serif" font-size="11" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="3">CONCEIVABLE.COM/EARLY-ACCESS</text>
  <text x="200" y="680" font-family="'Inter',sans-serif" font-size="18" fill="rgba(255,255,255,0.15)" text-anchor="middle">\u2736</text>
</svg>`;

  return [s1, s2, s3, s4];
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

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
      }}
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}

// ─── Download Button ─────────────────────────────────────────────────────────

function DownloadButton({ svg, filename }: { svg: string; filename: string }) {
  return (
    <a
      href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      download={filename}
      style={{
        display: "inline-block",
        background: BLACK,
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 18px",
        fontFamily: "'Inter',sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        textDecoration: "none",
        marginTop: 12,
      }}
    >
      ↓ Download SVG
    </a>
  );
}

// ─── Caption Section ─────────────────────────────────────────────────────────

function CaptionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      background: "white",
      border: "1px solid #e8e5de",
      borderRadius: 16,
      padding: "24px",
      marginBottom: 16,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        flexWrap: "wrap",
        gap: 10,
      }}>
        <span style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: 11,
          letterSpacing: 3,
          color: BLUE,
          textTransform: "uppercase" as const,
        }}>
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <p style={{
        fontFamily: "'Inter',sans-serif",
        fontSize: 14,
        lineHeight: 1.8,
        color: "#444",
        whiteSpace: "pre-wrap" as const,
      }}>
        {text}
      </p>
    </div>
  );
}

// ─── Story Captions ──────────────────────────────────────────────────────────

const STORY_TEXT_OPTIONS = [
  {
    label: "Swipe Teaser",
    text: "Everything I didn't know I didn't know about my body 👇\n\nSwipe up ↑",
  },
  {
    label: "Stats Hook",
    text: "The study said 150–260% improvement in conception rates.\n\nNot from a drug. From actually reading your body's data.\n\n@tryconceivable\n\nLink in bio.",
  },
  {
    label: "Personal",
    text: "I've gotten a lot of questions about Conceivable since my conversation with Kirsten.\n\nHonestly? It's different.\n\nNot just another app. An AI coach that actually knows you.\n\n500 founding spots open now. Link in bio.",
  },
  {
    label: "CTA",
    text: "Founding member pricing = locked forever.\n\n500 spots.\n\nThat's it.\n\n→ conceivable.com/early-access",
  },
];

// ─── Email Templates ──────────────────────────────────────────────────────────

function buildEmailTemplates(partner: Partner): Array<{ subject: string; body: string }> {
  return [
    {
      subject: `Something you need to know about your fertility (from my recent interview)`,
      body: `Hi [FIRST NAME],

I've been thinking about this since I recorded it.

I sat down with Kirsten Karchmer — 25 years in reproductive health, 120+ expert interviews, and the founder of Conceivable — and what she said has been sitting with me ever since.

"Your body is not failing you. It's sending you signals nobody taught you to read."

That landed.

Because how many of us have felt like something was wrong with us — when really the problem was just that nobody gave us the tools to understand what our bodies were telling us?

That's exactly what Conceivable fixes.

It's an AI fertility health platform that tracks your temperature, sleep, and HRV through the Halo Ring — and then Kai (the AI coach) connects the dots and builds a plan that's actually yours. Personalized supplements, cycle analysis, real-time guidance. The whole picture.

Here's why I'm sharing this now: they're opening early access for 500 founding members. That's it. And founding member pricing is locked forever.

The deeper reason this matters — if they reach 10,000 users, three major insurance companies have agreed to mandate coverage of the entire platform. The AI coach, the Halo Ring, the supplements — paid by insurance. Every woman gets access, regardless of what she can afford.

That's worth helping with.

→ Join early access here: conceivable.com/early-access

Love,
[YOUR NAME]

P.S. Listen to my full episode with Kirsten here: [YOUR EPISODE LINK]`,
    },
    {
      subject: `The fertility supplement thing nobody is talking about`,
      body: `Hi [FIRST NAME],

Hot take from my conversation with Kirsten Karchmer:

Most fertility supplements are a waste of money.

Not because they don't work — but because they're not personalized to you.

Kirsten spent 25 years in clinical practice watching women spend hundreds of dollars a month on generic protocols that weren't built for their body. She built Conceivable to fix that.

The platform figures out exactly which supplements your body needs — and then verifies they're working. Real data. Real feedback. Not guesswork.

It also tracks sleep, temperature, and HRV through the Halo Ring, and their AI coach Kai connects everything into a picture that your doctor probably doesn't have.

Early access is open right now. 500 founding member spots.

After 10,000 users, insurance companies have committed to covering the full platform. That's the mission. That's why it matters.

→ conceivable.com/early-access

We spoke about all of this on ${partner.show} — if you missed the episode, it's worth an hour of your time. [YOUR EPISODE LINK]

— [YOUR NAME]`,
    },
  ];
}

// ─── Tab Nav ─────────────────────────────────────────────────────────────────

function TabNav({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const tabs = [
    { id: "post", label: "Instagram Posts" },
    { id: "story", label: "Stories" },
    { id: "email", label: "Email Swipe Copy" },
  ];
  return (
    <div style={{
      display: "flex",
      gap: 4,
      background: "white",
      borderRadius: 12,
      padding: 4,
      border: "1px solid #e8e5de",
      flexWrap: "wrap" as const,
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: active === t.id ? BLUE : "transparent",
            color: active === t.id ? "white" : "#666",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontFamily: "'Inter',sans-serif",
            fontSize: 13,
            fontWeight: active === t.id ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function PostPackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [partner, setPartner] = useState<Partner | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [activeType, setActiveType] = useState(searchParams?.get("type") || "post");

  useEffect(() => {
    if (slug) {
      const p = getPartnerBySlug(slug);
      if (!p) {
        setNotFoundState(true);
      } else {
        setPartner(p);
      }
    }
  }, [slug]);

  useEffect(() => {
    const t = searchParams?.get("type");
    if (t) setActiveType(t);
  }, [searchParams]);

  if (notFoundState) {
    notFound();
  }

  if (!partner) return null;

  const postCards = buildPostCards(partner);
  const storyCards = buildStoryCards(partner);
  const emailTemplates = buildEmailTemplates(partner);

  const POST_CARD_LABELS = [
    "Quote Card",
    "Stats Card",
    "Mission Card",
    "Feature Card",
    "Partner Shoutout",
    "CTA Card",
  ];

  const POST_CAPTIONS = [
    {
      label: "Educational",
      text: `I've been having the most incredible conversations lately 🎙️\n\nOn ${partner.show}, I sat down with Kirsten Karchmer — 25 years in reproductive health, thousands of patients, and 120+ expert interviews.\n\nShe built something I've never seen before:\n\nAn AI coach that actually reads YOUR body's signals. Not generic advice. Not one-size-fits-all protocols.\n\nYour sleep. Your HRV. Your cycle. Your stress. All of it analyzed together to create a plan that's actually YOURS. 🧬\n\nIf you've been on this journey and felt like nobody was connecting the dots — this is for you.\n\nCheck it out → www.conceivable.com\n\n#fertility #womenshealth #IVF #TTC #personalizedhealth`,
    },
    {
      label: "Value",
      text: `Hot take: most fertility supplements are a waste of money 💊\n\nNot because they don't work — but because they're not personalized to YOU.\n\nYou're taking what your friend took. Or what a blog recommended. Or what showed up first on Amazon.\n\nBut your body isn't her body.\n\nConceivable figures out which supplements YOUR body actually needs based on your real data — and then verifies they're working over time. 📊\n\nThat's the difference between guessing and knowing.\n\nOnly 500 founding member spots → www.conceivable.com\n\n🌙 #fertilitysupplements #TTC #hormonalhealth #womenshealth`,
    },
    {
      label: "Story",
      text: `Something Kirsten Karchmer said to me that stopped me in my tracks 💭\n\n"Your body is not the problem. The problem is nobody built the tools to read what it's telling you."\n\nUntil now.\n\nYour sleep. Your cycle. Your HRV. Your stress response.\n\nAll of it connected. All of it analyzed. All of it turned into a plan that's actually yours. ✨\n\nThe Halo Ring reads the signals.\nKai (your AI coach) translates them.\nYour supplement pack is personalized to what your body needs.\n\nEverything working together. Nothing guessed.\n\nGet started → www.conceivable.com\n\n#conceivable #fertility #womenshealth #holistichealth`,
    },
    {
      label: "Direct CTA",
      text: `Tag someone who needs to hear this 👇\n\nThe fertility journey is lonely.\n\nThe 2am Googling.\nThe "just relax" comments.\nThe supplements you're not sure are working.\nThe feeling that your body is broken. 💔\n\nIt's not.\n\nConceivable was built for exactly this moment. An AI coach that reads your body's real signals and tells you what to do FIRST.\n\nPersonalized supplements. The Halo Ring. Real answers.\n\n500 founding member spots — pricing locked forever 🔒\n\nGet started → www.conceivable.com\n\n#TTC #fertility #IVF #PCOS #womenshealth #fertilitysupport`,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: OFF_WHITE, minHeight: "100vh", color: BLACK }}>

      {/* Header */}
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

      {/* Back + Title */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 0" }}>
        <button
          onClick={() => router.push(`/partners/${slug}`)}
          style={{
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            color: "#888",
            cursor: "pointer",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to your portal
        </button>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: BLUE, textTransform: "uppercase" as const, marginBottom: 8 }}>
            Social Media Assets
          </p>
          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px,4vw,42px)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            {activeType === "post"
              ? "Your Instagram Post Pack"
              : activeType === "story"
              ? "Your Instagram Story Pack"
              : "Your Email Swipe Copy"}
          </h1>
          <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>
            {activeType === "post"
              ? "6 ready-to-post cards + 4 caption options. All written for your audience."
              : activeType === "story"
              ? "4 story cards + text options for each format."
              : "2 full email templates. Copy, personalize, and send."}
          </p>
        </div>

        <TabNav active={activeType} onChange={setActiveType} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ── POST TAB ─────────────────────────────────────────────────────── */}
        {activeType === "post" && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))",
              gap: 24,
              marginBottom: 48,
            }}>
              {postCards.map((svg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                  <div style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #e8e5de",
                    width: "100%",
                  }}>
                    <img
                      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                      alt={`Conceivable post card ${i + 1} — ${POST_CARD_LABELS[i]}`}
                      style={{ width: "100%", display: "block", aspectRatio: "1/1" }}
                    />
                  </div>
                  <div style={{ width: "100%", marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#888" }}>{POST_CARD_LABELS[i]}</span>
                    <DownloadButton svg={svg} filename={`conceivable-post-${i + 1}.svg`} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{
                fontSize: 11,
                letterSpacing: 3,
                color: BLUE,
                textTransform: "uppercase" as const,
                marginBottom: 20,
              }}>
                Caption Options
              </p>
              {POST_CAPTIONS.map((cap, i) => (
                <CaptionBlock key={i} label={cap.label} text={cap.text} />
              ))}
            </div>
          </>
        )}

        {/* ── STORY TAB ────────────────────────────────────────────────────── */}
        {activeType === "story" && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(180px,100%), 1fr))",
              gap: 24,
              marginBottom: 48,
            }}>
              {storyCards.map((svg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                  <div style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #e8e5de",
                    width: "100%",
                  }}>
                    <img
                      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                      alt={`Conceivable story card ${i + 1}`}
                      style={{ width: "100%", display: "block", aspectRatio: "9/16" }}
                    />
                  </div>
                  <div style={{ width: "100%", marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#888" }}>Story {i + 1}</span>
                    <DownloadButton svg={svg} filename={`conceivable-story-${i + 1}.svg`} />
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: 11,
              letterSpacing: 3,
              color: BLUE,
              textTransform: "uppercase" as const,
              marginBottom: 20,
            }}>
              Story Text Options
            </p>
            {STORY_TEXT_OPTIONS.map((s, i) => (
              <CaptionBlock key={i} label={s.label} text={s.text} />
            ))}
          </>
        )}

        {/* ── EMAIL TAB ────────────────────────────────────────────────────── */}
        {activeType === "email" && (
          <>
            {emailTemplates.map((tmpl, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #e8e5de",
                borderRadius: 20,
                marginBottom: 32,
                overflow: "hidden",
              }}>
                {/* Email header bar */}
                <div style={{
                  background: "#f4f2eb",
                  borderBottom: "1px solid #e8e5de",
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap" as const,
                  gap: 10,
                }}>
                  <div>
                    <p style={{ fontSize: 11, letterSpacing: 2, color: "#888", textTransform: "uppercase" as const, marginBottom: 4 }}>
                      Email {i + 1} of 2
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: BLACK }}>
                      Subject: {tmpl.subject}
                    </p>
                  </div>
                  <CopyButton text={`Subject: ${tmpl.subject}\n\n${tmpl.body}`} label="Copy All" />
                </div>

                {/* Subject preview */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{
                    background: OFF_WHITE,
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <span style={{ fontSize: 11, color: "#888", flexShrink: 0 }}>SUBJECT LINE</span>
                    <span style={{ fontSize: 14, color: BLACK, fontWeight: 500 }}>{tmpl.subject}</span>
                    <CopyButton text={tmpl.subject} label="Copy" />
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "0 24px 24px" }}>
                  <div style={{
                    background: OFF_WHITE,
                    borderRadius: 8,
                    padding: "24px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    lineHeight: 1.9,
                    color: "#333",
                    whiteSpace: "pre-wrap" as const,
                    position: "relative" as const,
                  }}>
                    {tmpl.body}
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                      <CopyButton text={tmpl.body} label="Copy Body" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              background: `${BLUE}11`,
              border: `1px solid ${BLUE}30`,
              borderRadius: 16,
              padding: "20px 24px",
            }}>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                <strong style={{ color: BLUE }}>Personalization tips:</strong> Replace [FIRST NAME] with your email platform merge tag. Replace [YOUR EPISODE LINK] with the actual episode URL. Replace [YOUR NAME] with your name. Send to your full list or a segment — both templates work cold.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: BLACK,
        padding: "28px 32px",
        textAlign: "center",
        borderTop: "1px solid #333",
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
          Questions about these assets? Email help@conceivable.com
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
          © 2026 Conceivable. Making the impossible, Conceivable.
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        h1, h2, h3 { margin: 0; }
        p { margin: 0; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
}
