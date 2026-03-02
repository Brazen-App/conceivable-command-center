"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface ThoughtLeadershipProps extends TemplateProps {
  headline: string;
  authorName: string;
  authorTitle?: string;
}

export function ThoughtLeadership({ headline, authorName, authorTitle, character, backgroundImageUrl }: ThoughtLeadershipProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1200,
        height: 675,
        background: hasImage
          ? `linear-gradient(90deg, rgba(42,40,40,0.92) 55%, rgba(42,40,40,0.3)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Left content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 60px",
          maxWidth: "65%",
        }}
      >
        {/* Category tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
            alignSelf: "flex-start",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.accent }} />
          <span
            style={{
              fontFamily: BRAND.fontCaption,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: hasImage ? "rgba(255,255,255,0.6)" : c.accent,
            }}
          >
            Thought Leadership
          </span>
        </div>

        {/* Headline */}
        <p
          style={{
            fontFamily: BRAND.fontDisplay,
            fontSize: headline.length > 80 ? 32 : headline.length > 50 ? 38 : 44,
            fontWeight: 700,
            lineHeight: 1.2,
            color: hasImage ? "#FFFFFF" : BRAND.foreground,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            marginBottom: 28,
          }}
        >
          {headline}
        </p>

        {/* Author info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: c.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: BRAND.fontDisplay,
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {authorName.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, color: hasImage ? "#FFFFFF" : BRAND.foreground }}>
              {authorName}
            </p>
            {authorTitle && (
              <p style={{ fontSize: 13, color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.muted }}>
                {authorTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right accent graphic */}
      {!hasImage && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 320,
            background: `linear-gradient(180deg, ${c.accent}15, ${c.light}10)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Abstract accent shape */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `3px solid ${c.accent}30`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                backgroundColor: `${c.accent}12`,
              }}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 36,
          fontFamily: BRAND.fontDisplay,
          fontSize: 14,
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
