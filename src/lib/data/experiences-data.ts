// Product Experiences — The 10 Conceivable Health Experiences

export interface ExperienceSeed {
  name: string;
  slug: string;
  tagline: string;
  accentColor: string;
  status: "not_started" | "in_design" | "in_development" | "live";
  icon: string;
}

export const EXPERIENCES: ExperienceSeed[] = [
  {
    name: "First Period",
    slug: "first-period",
    tagline: "Her first introduction to her body's power",
    accentColor: "#F4A7B9",
    status: "in_design",
    icon: "\u{1F338}",
  },
  {
    name: "Early Menstruator",
    slug: "early-menstruator",
    tagline: "Building healthy foundations from the start",
    accentColor: "#F08080",
    status: "not_started",
    icon: "\u{1F331}",
  },
  {
    name: "Periods",
    slug: "periods",
    tagline: "Making every cycle a source of insight, not suffering",
    accentColor: "#E24D47",
    status: "in_design",
    icon: "\u{1F4AB}",
  },
  {
    name: "PCOS",
    slug: "pcos",
    tagline: "Decoding the most misunderstood condition in women's health",
    accentColor: "#9686B9",
    status: "not_started",
    icon: "\u{1F52C}",
  },
  {
    name: "Endometriosis",
    slug: "endometriosis",
    tagline: "Finally addressing the root cause, not just the pain",
    accentColor: "#C9536E",
    status: "not_started",
    icon: "\u{1F940}",
  },
  {
    name: "Fertility",
    slug: "fertility",
    tagline: "Where it all started. The flagship.",
    accentColor: "#5A6FFF",
    status: "live",
    icon: "\u{2728}",
  },
  {
    name: "Pregnancy",
    slug: "pregnancy",
    tagline: "Nine months of the smartest care she's ever had",
    accentColor: "#D4A843",
    status: "in_design",
    icon: "\u{1F31F}",
  },
  {
    name: "Postpartum",
    slug: "postpartum",
    tagline: "Recovery isn't just physical. We know that.",
    accentColor: "#7CAE7A",
    status: "in_design",
    icon: "\u{1F343}",
  },
  {
    name: "Perimenopause",
    slug: "perimenopause",
    tagline: "The transition nobody prepares women for. Until now.",
    accentColor: "#D4944A",
    status: "not_started",
    icon: "\u{1F525}",
  },
  {
    name: "Menopause & Beyond",
    slug: "menopause-beyond",
    tagline: "Health optimization doesn't end. Neither do we.",
    accentColor: "#2A8A8A",
    status: "not_started",
    icon: "\u{1F30A}",
  },
];

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  not_started: { label: "Not Started", color: "#888" },
  in_design: { label: "In Design", color: "#F59E0B" },
  in_development: { label: "In Development", color: "#5A6FFF" },
  live: { label: "Live", color: "#1EAA55" },
};

export const FEATURE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "#888" },
  designing: { label: "Designing", color: "#F59E0B" },
  wireframed: { label: "Wireframed", color: "#ACB7FF" },
  coded: { label: "Coded", color: "#5A6FFF" },
  shipped: { label: "Shipped", color: "#1EAA55" },
};

export function getExperienceBySlug(slug: string) {
  return EXPERIENCES.find((e) => e.slug === slug);
}
