"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface RecipePinProps extends TemplateProps {
  title: string;
  prepTime?: string;
  ingredients: string[];
  benefit: string;
}

export function RecipePin({ title, prepTime, ingredients, benefit, character, backgroundImageUrl }: RecipePinProps) {
  const c = CHARACTER_COLORS[character];
  const hasImage = !!backgroundImageUrl;

  return (
    <div
      style={{
        width: 1000,
        height: 1500,
        background: hasImage
          ? `linear-gradient(180deg, rgba(42,40,40,0.3) 0%, rgba(42,40,40,0.85) 40%), url(${backgroundImageUrl}) center/cover`
          : BRAND.background,
        display: "flex",
        flexDirection: "column",
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

      {/* Image area / Header zone */}
      <div
        style={{
          padding: "56px 64px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
            backgroundColor: hasImage ? "rgba(255,255,255,0.15)" : `${c.accent}15`,
            borderRadius: 100,
            padding: "8px 18px",
          }}
        >
          <span style={{ fontSize: 20 }}>🥗</span>
          <span
            style={{
              fontFamily: BRAND.fontCaption,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: hasImage ? "rgba(255,255,255,0.8)" : c.accent,
              fontWeight: 500,
            }}
          >
            Fertility Nutrition
          </span>
        </div>

        {/* Title */}
        <p
          style={{
            fontFamily: BRAND.fontDisplay,
            fontSize: title.length > 40 ? 42 : 52,
            fontWeight: 700,
            lineHeight: 1.15,
            color: hasImage ? "#FFFFFF" : BRAND.foreground,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </p>

        {/* Prep time badge */}
        {prepTime && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke={hasImage ? "rgba(255,255,255,0.6)" : BRAND.muted} strokeWidth="1.5" />
              <path d="M9 4.5V9L12 11" stroke={hasImage ? "rgba(255,255,255,0.6)" : BRAND.muted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 16, color: hasImage ? "rgba(255,255,255,0.7)" : BRAND.muted }}>
              {prepTime}
            </span>
          </div>
        )}
      </div>

      {/* Benefit callout */}
      <div
        style={{
          margin: "0 64px 24px",
          padding: "18px 24px",
          backgroundColor: hasImage ? "rgba(255,255,255,0.1)" : `${c.accent}10`,
          borderRadius: 14,
          borderLeft: `4px solid ${c.accent}`,
        }}
      >
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.4,
            color: hasImage ? "rgba(255,255,255,0.9)" : BRAND.foreground,
            fontWeight: 500,
          }}
        >
          {benefit}
        </p>
      </div>

      {/* Ingredients */}
      <div
        style={{
          flex: 1,
          padding: "0 64px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: BRAND.fontCaption,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: hasImage ? "rgba(255,255,255,0.5)" : BRAND.mutedLight,
            marginBottom: 4,
          }}
        >
          Key Ingredients
        </p>
        {ingredients.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: c.accent,
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: 20,
                lineHeight: 1.35,
                color: hasImage ? "rgba(255,255,255,0.85)" : BRAND.foreground,
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
          padding: "24px 64px",
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
          Save this recipe
        </p>
      </div>
    </div>
  );
}
