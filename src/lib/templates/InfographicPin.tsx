"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface InfographicPinProps extends TemplateProps {
  headline: string;
  tips: string[];
}

export function InfographicPin({ headline, tips, character, backgroundImageUrl }: InfographicPinProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1000,
        height: 1500,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.88) 0%, rgba(42,40,40,0.75) 100%), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(90deg, ${c.accent}, ${c.light})`,
        }}
      />

      {/* Logo + character badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, marginTop: 8 }}>
        <span
          style={{
            fontFamily: BRAND.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: hasImage ? "rgba(255,255,255,0.5)" : c.accent,
          }}
        >
          {BRAND.logoText}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: hasImage ? "rgba(255,255,255,0.1)" : `${c.accent}10`,
            borderRadius: 100,
            padding: "6px 16px",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.accent }} />
          <span style={{ fontSize: 12, color: hasImage ? "rgba(255,255,255,0.7)" : c.accent, fontWeight: 500 }}>
            {c.name}
          </span>
        </div>
      </div>

      {/* Headline */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: headline.length > 50 ? 40 : 52,
          fontWeight: 700,
          lineHeight: 1.15,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          marginBottom: 48,
        }}
      >
        {headline}
      </p>

      {/* Tips */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {tips.map((tip, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              backgroundColor: hasImage ? "rgba(255,255,255,0.08)" : BRAND.surface,
              borderRadius: 16,
              padding: 24,
              borderLeft: `4px solid ${c.accent}`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: c.accent,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: BRAND.fontDisplay,
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.4,
                color: hasImage ? "rgba(255,255,255,0.9)" : BRAND.foreground,
                flex: 1,
              }}
            >
              {tip}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `2px solid ${hasImage ? "rgba(255,255,255,0.1)" : BRAND.border}`,
          paddingTop: 24,
          marginTop: 32,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: hasImage ? "rgba(255,255,255,0.4)" : BRAND.mutedLight,
          }}
        >
          Save this pin &middot; conceivable.com
        </p>
      </div>
    </div>
  );
}
