"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface StoryQuoteProps extends TemplateProps {
  quote: string;
  attribution: string;
}

export function StoryQuote({ quote, attribution, character, backgroundImageUrl }: StoryQuoteProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.7) 0%, rgba(42,40,40,0.85) 50%, rgba(42,40,40,0.7) 100%), url(${backgroundImageUrl}) center/cover`
          : `linear-gradient(180deg, ${c.accent}18 0%, ${BRAND.background} 30%, ${BRAND.background} 70%, ${c.light}15 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 72px",
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${c.accent}, ${c.light})`,
        }}
      />

      {/* Logo at top */}
      <div
        style={{
          position: "absolute",
          top: 64,
          fontFamily: BRAND.fontDisplay,
          fontSize: 16,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: hasImage ? "rgba(255,255,255,0.4)" : c.accent,
        }}
      >
        {BRAND.logoText}
      </div>

      {/* Large quote mark */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: 160,
          color: c.accent,
          lineHeight: 0.6,
          marginBottom: 24,
          opacity: 0.4,
        }}
      >
        &ldquo;
      </p>

      {/* Quote text */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: quote.length > 120 ? 38 : quote.length > 80 ? 46 : 56,
          fontWeight: 700,
          lineHeight: 1.25,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        {quote}
      </p>

      {/* Accent divider */}
      <div
        style={{
          width: 60,
          height: 4,
          backgroundColor: c.accent,
          borderRadius: 2,
          margin: "40px 0 32px",
        }}
      />

      {/* Attribution */}
      <p
        style={{
          fontSize: 22,
          color: hasImage ? "rgba(255,255,255,0.6)" : BRAND.muted,
          textAlign: "center",
        }}
      >
        {attribution}
      </p>

      {/* Bottom character badge */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: c.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: BRAND.fontDisplay,
            fontSize: 15,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {c.name.charAt(0)}
        </div>
        <span style={{ fontSize: 15, color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.muted }}>
          {c.name} &middot; {c.role}
        </span>
      </div>
    </div>
  );
}
