"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface StatCardProps extends TemplateProps {
  stat: string;
  context: string;
  source?: string;
}

export function StatCard({ stat, context, source, character, backgroundImageUrl }: StatCardProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: hasImage
          ? `linear-gradient(160deg, rgba(42,40,40,0.85), rgba(42,40,40,0.7)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        position: "relative",
        fontFamily: BRAND.fontBody,
        textAlign: "center",
      }}
    >
      {/* Decorative circle behind stat */}
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          border: `3px solid ${c.light}`,
          opacity: 0.25,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      {/* Big stat */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: stat.length > 8 ? 120 : 160,
          fontWeight: 700,
          color: c.accent,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          position: "relative",
        }}
      >
        {stat}
      </p>

      {/* Context */}
      <p
        style={{
          fontFamily: BRAND.fontBody,
          fontSize: 32,
          lineHeight: 1.4,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          marginTop: 32,
          maxWidth: 720,
          fontWeight: 400,
        }}
      >
        {context}
      </p>

      {/* Source */}
      {source && (
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "rgba(255,255,255,0.4)" : BRAND.mutedLight,
            marginTop: 40,
          }}
        >
          Source: {source}
        </p>
      )}

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
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
