// Fertility Experience — Additional Feature Data
// The Fertility experience is the flagship and is LIVE.
// Core features are managed in the database.
// This file contains ADDITIONAL features and cross-experience integrations.

export interface FertilityAdditionalFeature {
  name: string;
  description: string;
  userStory: string;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[];
  notes: string;
  tier?: number;
  phase?: string;
}

// ═══════════════════════════════════════════════════
// ADDITIONAL FEATURES (Phase 2+)
// ═══════════════════════════════════════════════════

export const FERTILITY_ADDITIONAL_FEATURES: FertilityAdditionalFeature[] = [
  {
    name: "At-Home Semen Analysis Integration",
    description: "Male factor contributes to approximately 40-50% of infertility. The system supports male partner testing through an at-home semen analysis kit via partnership (Legacy, Fellow, or similar). Partner orders kit through Conceivable, does sample at home, results feed into the system. Kai discusses results in context — if normal, focus optimization on her cycle patterns. If results show areas for improvement, Olive provides nutrition recommendations for both partners. Sperm quality responds well to the same modifiable factors: nutrition, sleep, stress management, and reducing heat exposure.",
    userStory: "As a couple trying to conceive, I want my partner to be able to do an at-home semen analysis through Conceivable so we can optimize together instead of guessing which side needs attention.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas", "Olive"],
    notes: "Partnership infrastructure shared with Day 3 labs in Perimenopause (Lab Integration System). Partner options: Legacy, Fellow, or similar. 40-50% of infertility involves male factor. B2B angle: fertility clinics partner for pre-screening.",
    tier: 2,
    phase: "Phase 2 of Fertility Experience",
  },
];

// ═══════════════════════════════════════════════════
// IP COVERAGE — Fertility additional features
// ═══════════════════════════════════════════════════

export const FERTILITY_ADDITIONAL_IP_COVERAGE = [
  {
    feature: "At-Home Semen Analysis Integration",
    patents: [],
    note: "Shared Lab Integration System infrastructure — patent coverage through system-level patent, not feature-specific",
  },
];
