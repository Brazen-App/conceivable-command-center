"use client";

import { BRAND, CHARACTER_COLORS, type TemplateProps } from "./brand";

interface TwitterScreenshotProps extends TemplateProps {
  displayName: string;
  handle: string;
  tweetText: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  date?: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function TwitterScreenshot({
  displayName,
  handle,
  tweetText,
  likes = 0,
  retweets = 0,
  replies = 0,
  date,
  character,
}: TwitterScreenshotProps) {
  const c = CHARACTER_COLORS[character];

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: BRAND.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        position: "relative",
        fontFamily: BRAND.fontBody,
      }}
    >
      {/* Tweet card */}
      <div
        style={{
          width: 880,
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          padding: 48,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          border: "1px solid #E8E5DC",
        }}
      >
        {/* Profile row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: c.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: BRAND.fontDisplay,
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {displayName.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: BRAND.foreground }}>
              {displayName}
            </p>
            <p style={{ fontSize: 16, color: BRAND.muted }}>
              @{handle}
            </p>
          </div>
        </div>

        {/* Tweet text */}
        <p
          style={{
            fontSize: tweetText.length > 200 ? 26 : 30,
            lineHeight: 1.45,
            color: BRAND.foreground,
            marginBottom: 32,
          }}
        >
          {tweetText}
        </p>

        {/* Date */}
        {date && (
          <p style={{ fontSize: 14, color: BRAND.mutedLight, marginBottom: 24 }}>
            {date}
          </p>
        )}

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${BRAND.border}`, marginBottom: 20 }} />

        {/* Engagement stats */}
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Reply icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND.muted} strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            <span style={{ fontSize: 16, color: BRAND.muted }}>{formatCount(replies)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Retweet icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND.muted} strokeWidth="1.5">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
            <span style={{ fontSize: 16, color: BRAND.muted }}>{formatCount(retweets)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Heart icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E24D47" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span style={{ fontSize: 16, color: BRAND.muted }}>{formatCount(likes)}</span>
          </div>
        </div>
      </div>

      {/* Logo corner */}
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
          color: c.accent,
        }}
      >
        {BRAND.logoText}
      </div>
    </div>
  );
}
