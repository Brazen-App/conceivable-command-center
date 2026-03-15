/**
 * Conceivable Design Theme
 * ────────────────────────────────────────────────────────────
 * Based on the official Conceivable Brand Book by Firmalt.
 * Single source of truth for all colors, spacing, and design tokens.
 *
 * Usage: import { colors, gradients, shadows } from "@/lib/theme"
 */

// ── Brand Colors (Pantone-matched) ──────────────────────────

export const colors = {
  // Primary
  blue: "#5A6FFF",         // Pantone 2130 C — primary brand
  babyBlue: "#ACB7FF",     // Pantone 2122 C — primary accent
  offWhite: "#F9F7F0",     // Pantone 2437 C — backgrounds

  // Secondary
  black: "#2A2828",        // Pantone Black C
  red: "#E24D47",          // Pantone 7625 C
  pink: "#E37FB1",         // Pantone 204 C
  yellow: "#F1C028",       // Pantone 123 C
  green: "#1EAA55",        // Pantone 7739 C
  paleBlue: "#78C3BF",     // Pantone 564 C
  navy: "#356FB6",         // Pantone 7683 C
  purple: "#9686B9",       // Pantone 2094 C

  // Derived
  blueDark: "#4458CC",
  blueGlow: "rgba(90, 111, 255, 0.15)",
  surface: "#FFFEFA",
  surfaceHover: "#F5F3EC",
  border: "#E8E5DC",
  borderLight: "#F0EDE5",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
} as const;

// ── Gradients (from Brand Book — 3 adjacent colors) ─────────

export const gradients = {
  // Hero gradients — bold, for headers and CTAs
  ocean: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.blue} 50%, ${colors.babyBlue} 100%)`,
  sunset: `linear-gradient(135deg, ${colors.red} 0%, ${colors.pink} 50%, ${colors.purple} 100%)`,
  forest: `linear-gradient(135deg, ${colors.green} 0%, ${colors.paleBlue} 50%, ${colors.babyBlue} 100%)`,
  warmth: `linear-gradient(135deg, ${colors.yellow} 0%, ${colors.pink} 50%, ${colors.red} 100%)`,
  royal: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 50%, ${colors.pink} 100%)`,

  // Subtle gradients — for card backgrounds and sections
  subtleBlue: `linear-gradient(135deg, ${colors.blue}06 0%, ${colors.babyBlue}08 100%)`,
  subtlePink: `linear-gradient(135deg, ${colors.pink}06 0%, ${colors.purple}08 100%)`,
  subtleGreen: `linear-gradient(135deg, ${colors.green}06 0%, ${colors.paleBlue}08 100%)`,
  subtleWarm: `linear-gradient(135deg, ${colors.yellow}06 0%, ${colors.pink}08 100%)`,

  // Sidebar / dark sections
  dark: `linear-gradient(180deg, ${colors.black} 0%, #1A1818 100%)`,
  darkBlue: `linear-gradient(135deg, ${colors.black} 0%, ${colors.navy} 50%, ${colors.blue} 100%)`,
} as const;

// ── Shadows ─────────────────────────────────────────────────

export const shadows = {
  sm: "0 1px 2px rgba(42, 40, 40, 0.04)",
  md: "0 2px 8px rgba(42, 40, 40, 0.06)",
  lg: "0 4px 16px rgba(42, 40, 40, 0.08)",
  xl: "0 8px 32px rgba(42, 40, 40, 0.10)",
  glow: `0 0 24px ${colors.blueGlow}`,
  glowStrong: `0 0 40px rgba(90, 111, 255, 0.25)`,
} as const;

// ── Department Colors ───────────────────────────────────────

export const departmentColors: Record<string, { accent: string; bg: string }> = {
  operations: { accent: colors.babyBlue, bg: `${colors.babyBlue}10` },
  marketing: { accent: colors.pink, bg: `${colors.pink}10` },
  product: { accent: colors.babyBlue, bg: `${colors.babyBlue}10` },
  engineering: { accent: colors.paleBlue, bg: `${colors.paleBlue}10` },
  clinical: { accent: colors.paleBlue, bg: `${colors.paleBlue}10` },
  legal: { accent: colors.red, bg: `${colors.red}10` },
  finance: { accent: colors.green, bg: `${colors.green}10` },
  fundraising: { accent: colors.yellow, bg: `${colors.yellow}10` },
  community: { accent: colors.pink, bg: `${colors.pink}10` },
  strategy: { accent: colors.purple, bg: `${colors.purple}10` },
};

// ── Status Colors ───────────────────────────────────────────

export const status = {
  success: { color: colors.green, bg: `${colors.green}12`, border: `${colors.green}20` },
  warning: { color: colors.yellow, bg: `${colors.yellow}12`, border: `${colors.yellow}20` },
  error: { color: colors.red, bg: `${colors.red}12`, border: `${colors.red}20` },
  info: { color: colors.blue, bg: `${colors.blue}12`, border: `${colors.blue}20` },
  neutral: { color: colors.muted, bg: `${colors.muted}12`, border: `${colors.muted}20` },
} as const;

// ── Typography ──────────────────────────────────────────────

export const fonts = {
  display: '"Youth", "Montserrat", "Inter", sans-serif',
  caption: '"Rauschen A", "Inter", sans-serif',
  body: '"Inter", system-ui, -apple-system, sans-serif',
} as const;

// ── Spacing Scale ───────────────────────────────────────────

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
} as const;

// ── Border Radius ───────────────────────────────────────────

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
} as const;

// ── Helpers ─────────────────────────────────────────────────

/** Returns a color with alpha transparency */
export function alpha(hex: string, opacity: number): string {
  const a = Math.round(opacity * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

/** Returns a pill/badge style for a given color */
export function badge(color: string) {
  return {
    backgroundColor: alpha(color, 0.08),
    color,
    borderRadius: radii.full,
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
  } as const;
}
