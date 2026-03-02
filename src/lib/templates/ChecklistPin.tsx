"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface ChecklistPinProps extends TemplateProps {
  headline: string;
  items: string[];
}

export function ChecklistPin({ headline, items, character, backgroundImageUrl }: ChecklistPinProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1000,
        height: 1500,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.88), rgba(42,40,40,0.75)), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
        padding: 64,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Top accent */}
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

      {/* Logo */}
      <div style={{ marginBottom: 32, marginTop: 8 }}>
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
      </div>

      {/* Headline */}
      <p
        style={{
          fontFamily: BRAND.fontDisplay,
          fontSize: headline.length > 40 ? 42 : 52,
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

      {/* Checklist items */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              padding: "20px 24px",
              backgroundColor: hasImage ? "rgba(255,255,255,0.06)" : BRAND.surface,
              borderRadius: 14,
              border: `1px solid ${hasImage ? "rgba(255,255,255,0.08)" : BRAND.border}`,
            }}
          >
            {/* Checkbox */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `2.5px solid ${c.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke={c.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p
              style={{
                fontSize: 22,
                lineHeight: 1.35,
                color: hasImage ? "rgba(255,255,255,0.9)" : BRAND.foreground,
                flex: 1,
              }}
            >
              {item}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: c.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: BRAND.fontDisplay,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {c.name.charAt(0)}
          </div>
          <span style={{ fontSize: 14, color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.muted }}>
            {c.name} &middot; {c.role}
          </span>
        </div>
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "rgba(255,255,255,0.35)" : BRAND.mutedLight,
          }}
        >
          Save this
        </p>
      </div>
    </div>
  );
}
