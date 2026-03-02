"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface CarouselSlideProps extends TemplateProps {
  slideNumber: number;
  totalSlides: number;
  headline: string;
  body: string;
}

export function CarouselSlide({ slideNumber, totalSlides, headline, body, character, backgroundImageUrl }: CarouselSlideProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.85), rgba(42,40,40,0.7)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
        padding: 80,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Slide number */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: c.accent,
          color: "#FFFFFF",
          fontFamily: BRAND.fontDisplay,
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 40,
        }}
      >
        {slideNumber}
      </div>

      {/* Headline */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: headline.length > 60 ? 44 : 56,
          fontWeight: 700,
          lineHeight: 1.15,
          color: hasImage ? "#FFFFFF" : BRAND.foreground,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          marginBottom: 32,
          maxWidth: 800,
        }}
      >
        {headline}
      </p>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
        <p
          style={{
            fontSize: 28,
            lineHeight: 1.5,
            color: hasImage ? "rgba(255,255,255,0.85)" : BRAND.muted,
            maxWidth: 780,
          }}
        >
          {body}
        </p>
      </div>

      {/* Bottom: swipe indicator + logo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Page dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === slideNumber ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i + 1 === slideNumber ? c.accent : (hasImage ? "rgba(255,255,255,0.25)" : BRAND.border),
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>

        {/* Swipe hint + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 14, color: hasImage ? "rgba(255,255,255,0.4)" : BRAND.mutedLight }}>
            Swipe &rarr;
          </span>
          <span
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
          </span>
        </div>
      </div>
    </div>
  );
}
