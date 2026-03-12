"use client";

import {
  Palette,
  ExternalLink,
  Type,
  Droplets,
  Layers,
  Figma,
} from "lucide-react";
import Link from "next/link";

const BRAND_BLUE = "#5A6FFF";
const BRAND_BABY_BLUE = "#ACB7FF";

/* ─── Brand Colors ─── */
const PRIMARY_COLORS = [
  { name: "Blue", hex: "#5A6FFF", pantone: "2130 C", role: "Primary brand" },
  { name: "Baby Blue", hex: "#ACB7FF", pantone: "2122 C", role: "Primary accent" },
  { name: "Off White", hex: "#F9F7F0", pantone: "2437 C - 12%", role: "Primary background" },
];

const SECONDARY_COLORS = [
  { name: "Black", hex: "#2A2828", pantone: "Black C" },
  { name: "Red", hex: "#E24D47", pantone: "7625 C" },
  { name: "Pink", hex: "#E37FB1", pantone: "204 C" },
  { name: "Yellow", hex: "#F1C028", pantone: "123 C" },
  { name: "Green", hex: "#1EAA55", pantone: "7739 C - 90%" },
  { name: "Pale Blue", hex: "#78C3BF", pantone: "564 C" },
  { name: "Navy Blue", hex: "#356FB6", pantone: "7683 C" },
  { name: "Purple", hex: "#9686B9", pantone: "2094 C - 90%" },
];

const TYPOGRAPHY = [
  { usage: "Display / Titles", font: "Youth Bold", style: "UPPERCASE", sample: "CONCEIVABLE" },
  { usage: "Captions / Subtitles", font: "Rauschen A Regular", style: "UPPERCASE", sample: "A JOURNEY TO POSSIBILITY" },
  { usage: "Body Text", font: "Inter Regular", style: "Sentence Case", sample: "Making every cycle a source of insight, not suffering." },
];

export default function DesignPage() {
  return (
    <div>
      {/* Header with Figma Link */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND_BLUE}10, ${BRAND_BABY_BLUE}08)`,
          border: `1px solid ${BRAND_BLUE}15`,
        }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${BRAND_BABY_BLUE}, transparent)` }} />
        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BRAND_BLUE}14` }}>
            <Palette size={22} style={{ color: BRAND_BLUE }} />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Conceivable Design System
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Brand guidelines from the official Conceivable Brand Book by Firmalt. Clean, warm, connected — nothing feels isolated.
            </p>
          </div>
          <a
            href="https://www.figma.com/design/pEhUjIhtv85DdNgsmqAG1W/Conceivable-Mobile-App-Screens?node-id=1029-4221&t=jpI5O8a97CVSyNSf-1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium shrink-0 hover:shadow-md transition-all"
            style={{ backgroundColor: BRAND_BLUE, color: "white" }}
          >
            <Figma size={14} />
            Open in Figma
          </a>
        </div>
      </div>

      {/* Primary Colors */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={14} style={{ color: BRAND_BLUE }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Primary Colors
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {PRIMARY_COLORS.map((c) => (
            <div key={c.hex} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="h-20" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{c.name}</p>
                <p className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>{c.hex}</p>
                <p className="text-[9px] mt-1" style={{ color: "var(--muted)" }}>
                  {c.pantone} — {c.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Colors */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={14} style={{ color: BRAND_BABY_BLUE }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Secondary Colors
          </h3>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SECONDARY_COLORS.map((c) => (
            <div key={c.hex} className="text-center">
              <div
                className="w-full aspect-square rounded-xl mb-1.5"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-[10px] font-medium" style={{ color: "var(--foreground)" }}>{c.name}</p>
              <p className="text-[8px] font-mono" style={{ color: "var(--muted)" }}>{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Type size={14} style={{ color: BRAND_BLUE }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Typography
          </h3>
        </div>
        <div className="space-y-3">
          {TYPOGRAPHY.map((t) => (
            <div
              key={t.usage}
              className="rounded-xl p-4 flex items-center gap-6"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="w-40 shrink-0">
                <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{t.usage}</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {t.font} · {t.style}
                </p>
              </div>
              <p
                className="text-sm flex-1"
                style={{
                  color: "var(--foreground)",
                  fontFamily: t.font.includes("Inter") ? "var(--font-body)" : t.font.includes("Youth") ? "var(--font-display)" : "var(--font-caption)",
                  textTransform: t.style === "UPPERCASE" ? "uppercase" : undefined,
                  letterSpacing: t.style === "UPPERCASE" ? "0.08em" : undefined,
                }}
              >
                {t.sample}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Principles */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} style={{ color: BRAND_BLUE }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Design Principles
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Everything is connected", desc: "Visual connections between elements. Nothing feels isolated. The product's core thesis must be reflected in the UI." },
            { title: "Icons: informative, not decorative", desc: "Black, 1pt outline for UI icons. Colored gradient icons for larger display areas (Energy, Blood, HRV, etc.)." },
            { title: "Gradients from fertility journeys", desc: "Three variations: wobbly shapes, left-to-right, center-to-outside. Choose 3 adjacent colors from the palette." },
            { title: "Kai has its own identity", desc: "Line-art compass star logo in Blue #5A6FFF. Separate visual identity from the Conceivable brand mark." },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: "var(--foreground)" }}>{p.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Figma Reference */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: `${BRAND_BLUE}06`,
          border: `1px solid ${BRAND_BLUE}15`,
        }}
      >
        <div className="flex items-start gap-3">
          <Figma size={16} className="shrink-0 mt-0.5" style={{ color: BRAND_BLUE }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Before wireframing any new feature
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
              Study the existing Figma wireframes: navigation patterns, card/component design language, color usage, care team interaction patterns, score display patterns, and daily check-in flow structure. All new wireframes must feel like they belong in the same app.
            </p>
            <div className="flex gap-3 mt-3">
              <a
                href="https://www.figma.com/design/pEhUjIhtv85DdNgsmqAG1W/Conceivable-Mobile-App-Screens?node-id=1029-4221&t=jpI5O8a97CVSyNSf-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: BRAND_BLUE }}
              >
                <ExternalLink size={10} />
                Mobile App Wireframes
              </a>
              <Link
                href="/departments/product/experiences"
                className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: "var(--muted)" }}
              >
                <ExternalLink size={10} />
                Experience Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
