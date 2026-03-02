// Conceivable Brand System — Template Configuration
// Colors from official Brand Book by Firmalt

export type CharacterName = "kai" | "olive" | "seren" | "atlas" | "pilar";

export type TemplateFormat = "square" | "landscape" | "pinterest" | "story";

export type TemplateId =
  | "quote-card"
  | "stat-card"
  | "tip-card"
  | "twitter-screenshot"
  | "caption-card"
  | "carousel-slide"
  | "thought-leadership"
  | "data-viz"
  | "infographic-pin"
  | "checklist-pin"
  | "recipe-pin"
  | "story-quote"
  | "story-tip";

export const TEMPLATE_DIMENSIONS: Record<TemplateFormat, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  landscape: { width: 1200, height: 675 },
  pinterest: { width: 1000, height: 1500 },
  story: { width: 1080, height: 1920 },
};

export const CHARACTER_COLORS: Record<CharacterName, { accent: string; light: string; name: string; role: string }> = {
  kai: {
    accent: "#5A6FFF",
    light: "#ACB7FF",
    name: "Kai",
    role: "AI Fertility Coach",
  },
  olive: {
    accent: "#F1C028",
    light: "#F9E588",
    name: "Olive",
    role: "Nutrition & Lifestyle",
  },
  seren: {
    accent: "#9686B9",
    light: "#C4B8D9",
    name: "Seren",
    role: "Mind-Body & Stress",
  },
  atlas: {
    accent: "#78C3BF",
    light: "#B5DDD9",
    name: "Atlas",
    role: "Data & Insights",
  },
  pilar: {
    accent: "#1EAA55",
    light: "#7DD4A0",
    name: "Pilar",
    role: "Clinical Research",
  },
};

export const BRAND = {
  background: "#F9F7F0",
  foreground: "#2A2828",
  surface: "#FFFEFA",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
  border: "#E8E5DC",
  primary: "#5A6FFF",
  primaryLight: "#ACB7FF",
  pink: "#E37FB1",
  red: "#E24D47",
  navy: "#356FB6",
  // Typography
  fontDisplay: "'Youth', 'Montserrat', 'Inter', sans-serif",
  fontBody: "'Inter', system-ui, -apple-system, sans-serif",
  fontCaption: "'Rauschen A', 'Inter', sans-serif",
  // Logo text (used as a simple text logo in templates)
  logoText: "conceivable",
} as const;

export interface TemplateProps {
  character: CharacterName;
  backgroundImageUrl?: string;
}

// Template metadata for the gallery
export interface TemplateMeta {
  id: TemplateId;
  name: string;
  format: TemplateFormat;
  description: string;
  platforms: string[];
}

export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  // Square (1080x1080)
  { id: "quote-card", name: "Quote Card", format: "square", description: "Large quote with accent bar and attribution", platforms: ["Instagram", "Facebook"] },
  { id: "stat-card", name: "Stat Card", format: "square", description: "Big bold number with context and source", platforms: ["Instagram", "Facebook"] },
  { id: "tip-card", name: "Tip Card", format: "square", description: "Did you know? tip with branded footer", platforms: ["Instagram", "Facebook"] },
  { id: "twitter-screenshot", name: "Twitter Screenshot", format: "square", description: "Styled tweet with engagement numbers", platforms: ["Instagram", "Facebook"] },
  { id: "caption-card", name: "Caption Card", format: "square", description: "Beautifully typeset text on branded background", platforms: ["Instagram", "Facebook"] },
  { id: "carousel-slide", name: "Carousel Slide", format: "square", description: "Numbered slide with swipe indicator", platforms: ["Instagram"] },
  // Landscape (1200x675)
  { id: "thought-leadership", name: "Thought Leadership", format: "landscape", description: "Headline left, accent graphic right, author info", platforms: ["LinkedIn", "Twitter"] },
  { id: "data-viz", name: "Data Viz", format: "landscape", description: "Big stat with supporting context", platforms: ["LinkedIn", "Twitter"] },
  // Pinterest (1000x1500)
  { id: "infographic-pin", name: "Infographic Pin", format: "pinterest", description: "Headline with 3-5 tips stacked vertically", platforms: ["Pinterest"] },
  { id: "checklist-pin", name: "Checklist Pin", format: "pinterest", description: "5 Signs Your... style with checkboxes", platforms: ["Pinterest"] },
  { id: "recipe-pin", name: "Recipe Pin", format: "pinterest", description: "Food-focused for Olive nutrition content", platforms: ["Pinterest"] },
  // Story (1080x1920)
  { id: "story-quote", name: "Story Quote", format: "story", description: "Full-screen quote with gradient background", platforms: ["Instagram Stories", "TikTok"] },
  { id: "story-tip", name: "Story Tip", format: "story", description: "Tip with large text for stories", platforms: ["Instagram Stories", "TikTok"] },
];
