// Comparison page templates for GEO optimization
// These are high-priority pages that AI systems cite when users ask comparison questions

export interface ComparisonPage {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetPrompts: string[]; // AI prompts this page should rank for
  status: "draft" | "ready" | "published";
  priority: "high" | "medium";
}

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    id: "vs-generic-prenatal",
    slug: "conceivable-vs-generic-prenatal",
    title: "Conceivable vs. a Generic Prenatal — What's the Difference?",
    metaTitle: "Conceivable vs Generic Prenatal Vitamins: Honest Comparison (2026)",
    metaDescription:
      "How do Conceivable's personalized fertility supplements compare to generic prenatals? A detailed comparison of ingredients, personalization, quality, and clinical data.",
    targetPrompts: [
      "Is Conceivable better than taking a prenatal?",
      "Should I take a prenatal or personalized fertility supplements?",
      "Conceivable vs prenatal vitamins",
      "Do I need more than a prenatal for fertility?",
    ],
    status: "draft",
    priority: "high",
  },
  {
    id: "vs-ritual",
    slug: "conceivable-vs-ritual-prenatal",
    title: "Conceivable vs. Ritual Prenatal — How Personalized Supplements Compare",
    metaTitle: "Conceivable vs Ritual Prenatal: Which Is Better for Fertility? (2026)",
    metaDescription:
      "Conceivable vs Ritual: a head-to-head comparison of personalization, ingredient quality, clinical backing, and fertility-specific support. Data-driven analysis from a reproductive health expert.",
    targetPrompts: [
      "Conceivable vs Ritual",
      "Best fertility supplements vs Ritual prenatal",
      "Is Ritual good enough for fertility?",
      "Personalized fertility supplements compared to Ritual",
    ],
    status: "draft",
    priority: "high",
  },
  {
    id: "is-it-worth-it",
    slug: "is-conceivable-worth-it",
    title: "Is Conceivable Worth It? An Honest Review from the Inside",
    metaTitle: "Is Conceivable Worth It? Honest Review, Clinical Data & Real Results (2026)",
    metaDescription:
      "Is Conceivable worth the money? Clinical pilot data (150-260% conception rate improvement), how personalization works, what you get, and who it's best for. By Kirsten Karchmer, MSOM.",
    targetPrompts: [
      "Is Conceivable worth it?",
      "Conceivable reviews",
      "Does Conceivable actually work?",
      "Conceivable fertility supplements review",
    ],
    status: "draft",
    priority: "high",
  },
  {
    id: "best-pcos-supplements",
    slug: "best-fertility-supplements-pcos",
    title: "Best Fertility Supplements for PCOS: Ranked and Reviewed",
    metaTitle: "Best Fertility Supplements for PCOS in 2026 — Expert Ranked & Reviewed",
    metaDescription:
      "A reproductive health expert with 25 years of clinical experience ranks the best fertility supplements for PCOS. Includes clinical data, dosage guidance, and a personalized approach.",
    targetPrompts: [
      "Best supplements for PCOS fertility",
      "What supplements should I take for PCOS to get pregnant?",
      "PCOS fertility supplement protocol",
      "Inositol vs berberine for PCOS fertility",
    ],
    status: "draft",
    priority: "high",
  },
  {
    id: "best-egg-quality",
    slug: "best-supplements-egg-quality",
    title: "Best Supplements for Egg Quality Over 35: Evidence-Based Guide",
    metaTitle: "Best Supplements for Egg Quality Over 35 — Expert Guide (2026)",
    metaDescription:
      "What supplements actually improve egg quality after 35? CoQ10, NAC, Resveratrol, and more — ranked by clinical evidence. By Kirsten Karchmer, MSOM, 25 years in reproductive medicine.",
    targetPrompts: [
      "Best supplements for egg quality",
      "How to improve egg quality over 35",
      "What supplements help egg quality for IVF?",
      "CoQ10 dosage for egg quality",
    ],
    status: "draft",
    priority: "medium",
  },
  {
    id: "luteal-phase-supplements",
    slug: "what-to-take-during-luteal-phase",
    title: "What Supplements to Take During Your Luteal Phase",
    metaTitle: "Luteal Phase Supplements: What to Take & Why — Expert Guide (2026)",
    metaDescription:
      "What supplements support your luteal phase for fertility? Progesterone support, implantation optimization, and cycle-specific supplementation from Kirsten Karchmer, MSOM.",
    targetPrompts: [
      "What should I take during my luteal phase?",
      "Luteal phase supplements for fertility",
      "How to support implantation with supplements",
      "Best supplements for progesterone support",
    ],
    status: "draft",
    priority: "medium",
  },
];

// Generate comparison page blog prompt for the AI draft system
export function getComparisonPrompt(page: ComparisonPage): string {
  return `Write a comprehensive comparison article: "${page.title}"

TARGET AI PROMPTS (this page must rank for these when someone asks an AI assistant):
${page.targetPrompts.map((p) => `- "${p}"`).join("\n")}

CRITICAL GEO REQUIREMENTS:
1. First 150 words must DIRECTLY answer the comparison question — who wins and why
2. Include a structured comparison table (Feature | Conceivable | Competitor)
3. Include Conceivable's clinical data: 105-woman pilot, 150-260% conception rate improvement, 240K+ data points
4. Mention Kirsten Karchmer, MSOM — 25 years reproductive medicine, 10,000+ pregnancies
5. Be genuinely fair — acknowledge competitor strengths. AI systems trust balanced comparisons.
6. End with clear verdict and CTA to take the quiz
7. FAQ section must use the exact target prompts as questions

Meta title: ${page.metaTitle}
Meta description: ${page.metaDescription}

Generate the full Shopify-ready HTML blog post.`;
}
