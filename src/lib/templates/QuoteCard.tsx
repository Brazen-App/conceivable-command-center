"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface QuoteCardProps extends TemplateProps {
  quote: string;
  attribution: string;
  attributionTitle?: string;
}

export function QuoteCard({ quote, attribution, attributionTitle, character, backgroundImageUrl }: QuoteCardProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: hasImage ? `linear-gradient(135deg, rgba(42,40,40,0.82), rgba(42,40,40,0.65)), url(${backgroundImageUrl}) center/cover` : BRAND.background,
        display: "flex",
        flexDirection: "column",
        padding: 80,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 120,
          bottom: 120,
          width: 8,
          backgroundColor: c.accent,
          borderRadius: "0 4px 4px 0",
        }}
      />

      {/* Quote */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 20 }}>
        <p
          style={{
            fontFamily: BRAND.fontBody,
            fontSize: quote.length > 200 ? 36 : quote.length > 120 ? 44 : 52,
            lineHeight: 1.35,
            color: hasImage ? "#FFFFFF" : BRAND.foreground,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Attribution */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: c.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontFamily: BRAND.fontDisplay,
            fontSize: 20,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {attribution.charAt(0)}
        </div>
        <div>
          <p
            style={{
              fontFamily: BRAND.fontBody,
              fontSize: 22,
              fontWeight: 600,
              color: hasImage ? "#FFFFFF" : BRAND.foreground,
            }}
          >
            {attribution}
          </p>
          {attributionTitle && (
            <p
              style={{
                fontFamily: BRAND.fontBody,
                fontSize: 16,
                color: hasImage ? "rgba(255,255,255,0.6)" : BRAND.muted,
              }}
            >
              {attributionTitle}
            </p>
          )}
        </div>
      </div>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 48,
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
    </div>
  );
}
