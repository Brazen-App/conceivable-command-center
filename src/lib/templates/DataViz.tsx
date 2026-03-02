"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface DataVizProps extends TemplateProps {
  stat: string;
  headline: string;
  context: string;
  source?: string;
}

export function DataViz({ stat, headline, context, source, character, backgroundImageUrl }: DataVizProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1200,
        height: 675,
        background: hasImage
          ? `linear-gradient(135deg, rgba(42,40,40,0.88), rgba(42,40,40,0.7)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        alignItems: "center",
        padding: "0 72px",
        gap: 60,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Big stat */}
      <div style={{ textAlign: "center", minWidth: 320 }}>
        <p
          style={{
            fontFamily: BRAND.fontDisplay,
            fontSize: stat.length > 6 ? 100 : 130,
            fontWeight: 700,
            color: c.accent,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {stat}
        </p>
        <div
          style={{
            width: 60,
            height: 3,
            backgroundColor: c.accent,
            margin: "16px auto 0",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: BRAND.fontDisplay,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.25,
            color: hasImage ? "#FFFFFF" : BRAND.foreground,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            marginBottom: 16,
          }}
        >
          {headline}
        </p>
        <p
          style={{
            fontSize: 20,
            lineHeight: 1.5,
            color: hasImage ? "rgba(255,255,255,0.7)" : BRAND.muted,
          }}
        >
          {context}
        </p>
        {source && (
          <p
            style={{
              fontFamily: BRAND.fontCaption,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: hasImage ? "rgba(255,255,255,0.35)" : BRAND.mutedLight,
              marginTop: 20,
            }}
          >
            Source: {source}
          </p>
        )}
      </div>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 36,
          fontFamily: BRAND.fontDisplay,
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: hasImage ? "rgba(255,255,255,0.35)" : c.accent,
        }}
      >
        {BRAND.logoText}
      </div>
    </div>
  );
}
