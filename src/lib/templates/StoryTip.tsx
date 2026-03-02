"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface StoryTipProps extends TemplateProps {
  tip: string;
  category: string;
  number?: number;
}

export function StoryTip({ tip, category, number, character, backgroundImageUrl }: StoryTipProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.75) 0%, rgba(42,40,40,0.88) 50%, rgba(42,40,40,0.75) 100%), url(${backgroundImageUrl}) center/cover`
          : `linear-gradient(180deg, ${BRAND.background} 0%, ${c.accent}08 50%, ${BRAND.background} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "160px 72px",
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

      {/* Category badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: hasImage ? "rgba(255,255,255,0.12)" : `${c.accent}12`,
          borderRadius: 100,
          padding: "10px 24px",
          marginBottom: 40,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.accent }} />
        <span
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "rgba(255,255,255,0.7)" : c.accent,
            fontWeight: 500,
          }}
        >
          {category}
        </span>
      </div>

      {/* Number circle (optional) */}
      {number !== undefined && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: c.accent,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: BRAND.fontDisplay,
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          {number}
        </div>
      )}

      {/* Tip text */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: tip.length > 100 ? 42 : tip.length > 60 ? 52 : 64,
          fontWeight: 700,
          lineHeight: 1.2,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        {tip}
      </p>

      {/* Accent dots decoration */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 48,
        }}
      >
        {[0.3, 0.6, 1, 0.6, 0.3].map((opacity, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: c.accent,
              opacity,
            }}
          />
        ))}
      </div>

      {/* Bottom character badge */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
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

      {/* Swipe up indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M2 10L10 2L18 10" stroke={hasImage ? "rgba(255,255,255,0.3)" : BRAND.mutedLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: hasImage ? "rgba(255,255,255,0.3)" : BRAND.mutedLight,
          }}
        >
          Swipe up
        </span>
      </div>
    </div>
  );
}
