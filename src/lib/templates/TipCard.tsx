"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface TipCardProps extends TemplateProps {
  tip: string;
  category?: string;
}

export function TipCard({ tip, category, character, backgroundImageUrl }: TipCardProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.8), rgba(42,40,40,0.7)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
        padding: 80,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Header badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: hasImage ? "rgba(255,255,255,0.12)" : `${c.accent}12`,
          borderRadius: 100,
          padding: "12px 24px",
          alignSelf: "flex-start",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: c.accent,
          }}
        />
        <span
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "#FFFFFF" : c.accent,
            fontWeight: 500,
          }}
        >
          Did you know?
        </span>
      </div>

      {/* Category tag */}
      {category && (
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.mutedLight,
            marginTop: 32,
          }}
        >
          {category}
        </p>
      )}

      {/* Tip text */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <p
          style={{
            fontFamily: BRAND.fontBody,
            fontSize: tip.length > 200 ? 34 : tip.length > 120 ? 40 : 48,
            lineHeight: 1.35,
            color: hasImage ? "#FFFFFF" : BRAND.foreground,
            fontWeight: 500,
          }}
        >
          {tip}
        </p>
      </div>

      {/* Branded footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${hasImage ? "rgba(255,255,255,0.15)" : BRAND.border}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {c.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: hasImage ? "#FFFFFF" : BRAND.foreground }}>
              {c.name}
            </p>
            <p style={{ fontSize: 12, color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.muted }}>
              {c.role}
            </p>
          </div>
        </div>
        <div
          style={{
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
    </div>
  );
}
