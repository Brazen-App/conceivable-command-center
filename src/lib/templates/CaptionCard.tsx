"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface CaptionCardProps extends TemplateProps {
  text: string;
  subtitle?: string;
}

export function CaptionCard({ text, subtitle, character, backgroundImageUrl }: CaptionCardProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: hasImage
          ? `linear-gradient(160deg, rgba(42,40,40,0.8), rgba(42,40,40,0.65)), url(${backgroundImageUrl}) center/cover`
          : `linear-gradient(160deg, ${BRAND.background} 0%, ${BRAND.surface} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
        position: "relative",
        fontFamily: BRAND.fontBody,
        textAlign: "center",
      }}
    >
      {/* Decorative accent dots */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: c.accent, opacity: 0.4 }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: c.accent }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: c.accent, opacity: 0.4 }} />
      </div>

      {/* Main text */}
      <p
        style={{
          fontFamily: BRAND.fontBody,
          fontSize: text.length > 200 ? 34 : text.length > 100 ? 42 : 52,
          lineHeight: 1.4,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          fontWeight: 400,
          maxWidth: 820,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.muted,
            marginTop: 40,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${c.accent}, ${c.light})`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
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
