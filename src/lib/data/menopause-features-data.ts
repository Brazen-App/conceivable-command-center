// Menopause & Beyond Experience — Feature Data, Care Team, IP, Roadmap

export interface MenopauseFeatureSeed {
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
// EXPERIENCE DESCRIPTION & PERSONA
// ═══════════════════════════════════════════════════

export const MENOPAUSE_DESCRIPTION = `Menopause is not the end of the story. It's a new chapter. When her cycles have stopped for 12 months, the transition storm is over — but the landscape has permanently changed. Estrogen is no longer protecting her heart, her bones, her brain, or her gut the way it once did. The medical system largely abandons women after menopause. Once the hot flashes subside, nobody checks in.

Conceivable stays. The care team that has been with her — potentially since she was 10 years old — continues. The score evolves from Transition Wellness to Longevity Wellness. The focus shifts from managing a chaotic transition to thriving in a new physiological reality. Cardiovascular health, bone density, cognitive vitality, metabolic health, sexual health, and emotional wellbeing become the primary domains.

If she's on HRT, the system continues monitoring her response through the wearable — something her prescriber doesn't have. If she's not on HRT, the system maximizes every modifiable factor to support her health long-term.

The retention play: she's been with Conceivable since she was 10 or 15 or 25 or 40. Now she's 55. Her daughter just got her first period. She downloads Conceivable for her daughter. Two generations. Lifetime value squared.

The relationship never ends.`;

export const MENOPAUSE_PERSONA = `A woman who has completed the menopausal transition (12+ months without a menstrual cycle). She may have been with Conceivable for decades or be new. She needs long-term health optimization focused on cardiovascular, bone, cognitive, metabolic, and emotional wellness. If on HRT, she needs continuous response monitoring. The medical system has moved on — Conceivable doesn't.`;

// ═══════════════════════════════════════════════════
// CARE TEAM
// ═══════════════════════════════════════════════════

export const MENOPAUSE_CARE_TEAM = [
  {
    name: "Kai",
    role: "Longevity Guide",
    color: "#5A6FFF",
    description: "Focus shifts to long-term health optimization. Daily summaries become weekly unless signals warrant more. \"You've been through the transition. Now let's make the next 30 years the best ones.\"",
  },
  {
    name: "Olive",
    role: "Longevity Nutrition",
    color: "#7CAE7A",
    description: "Post-menopausal needs: calcium/vitamin D/K2 for bones, omega-3 for cardiovascular and cognitive health, protein for muscle maintenance (sarcopenia prevention), gut health, metabolic optimization.",
  },
  {
    name: "Seren",
    role: "Emotional & Identity Support",
    color: "#E37FB1",
    description: "Identity evolution continues. Sexual health conversations. Mental health monitoring — depression risk remains elevated in early post-menopause.",
  },
  {
    name: "Atlas",
    role: "Long-Term Health Monitoring",
    color: "#D4A843",
    description: "Cardiovascular trends, metabolic trends, cognitive indicators, bone health indicators, HRT response monitoring if applicable.",
  },
  {
    name: "Zhen",
    role: "Language Bridge",
    color: "#78C3BF",
    description: "75 languages. Health optimization is universal.",
  },
  {
    name: "Navi",
    role: "Navigation & Resources",
    color: "#356FB6",
    description: "Cardiology referrals, bone density screening, menopause specialists for ongoing care.",
  },
];

// ═══════════════════════════════════════════════════
// FEATURES (7 total)
// ═══════════════════════════════════════════════════

export const MENOPAUSE_FEATURES: MenopauseFeatureSeed[] = [
  // TIER 1 — Phase 1: Continuation (4 features)
  {
    name: "Longevity Wellness Score",
    description: "Post-menopause score measures long-term health trajectory: Cardiovascular Health (BP trends, blood sugar, HRV, activity), Bone & Muscle Health (weight-bearing exercise, calcium/vitamin D, DEXA tracking), Cognitive Vitality (engagement patterns, cognitive function, sleep quality), Metabolic Health (blood sugar, weight, inflammatory indicators), Rest & Recovery (sleep quality, HRV, stress). Score still improves — smart choices compound.",
    userStory: "As a post-menopausal woman, I want a health score showing my long-term trajectory — proving smart choices are compounding.",
    priority: "must_have",
    complexity: "large",
    status: "designing",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Score STILL IMPROVES. She's not in decline — she's in a new phase.",
    tier: 1,
    phase: "Phase 1: Continuation",
  },
  {
    name: "HRT Monitoring",
    description: "For women on HRT: continuous monitoring through Halo Ring of thermoregulatory response, sleep quality, HRV, mood, metabolic indicators. Generates HRT Response Reports for prescriber — continuous data they've never had. B2B angle: telehealth companies partner for monitoring. Also monitors HRT discontinuation.",
    userStory: "As a post-menopausal woman on HRT, I want continuous monitoring and reports I can share with my prescriber.",
    priority: "must_have",
    complexity: "large",
    status: "designing",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Patent 022. B2B opportunity with telehealth providers. Also monitors discontinuation response.",
    tier: 1,
    phase: "Phase 1: Continuation",
  },
  {
    name: "Cardiovascular Health Monitoring",
    description: "Post-menopausal women's #1 health risk. Continuous monitoring: BP from face scans, blood sugar from Halo Ring, HRV trends, activity patterns, inflammatory diet indicators. Recommends clinical screening at appropriate intervals. Kai contextualizes the connection between estrogen decline and cardiovascular risk.",
    userStory: "As a post-menopausal woman, I want proactive cardiovascular monitoring connecting my lifestyle to my heart health.",
    priority: "must_have",
    complexity: "medium",
    status: "designing",
    careTeamMembers: ["Atlas", "Kai", "Olive"],
    notes: "#1 health risk for post-menopausal women. Continues from Perimenopause.",
    tier: 1,
    phase: "Phase 1: Continuation",
  },
  {
    name: "Bone Health Tracking",
    description: "Ongoing from perimenopause. Exercise and nutrition monitoring. Tracks DEXA scan results (user inputs, system tracks over time). Recommends repeat screening. If osteopenia/osteoporosis detected: adjusts emphasis on weight-bearing exercise, fall prevention, nutritional optimization.",
    userStory: "As a post-menopausal woman, I want longitudinal bone health tracking including DEXA results, exercise, and nutrition.",
    priority: "must_have",
    complexity: "medium",
    status: "designing",
    careTeamMembers: ["Olive", "Kai", "Atlas"],
    notes: "Continues from Perimenopause. DEXA tracking, exercise, calcium/vitamin D/K2.",
    tier: 1,
    phase: "Phase 1: Continuation",
  },

  // TIER 2 — Phase 2: Advanced (3 features)
  {
    name: "Cognitive Health Support",
    description: "Post-menopausal cognitive concerns are real but often conflated with dementia fear. Education (temporary cognitive changes typically resolve), cognitive engagement tracking, sleep optimization (biggest modifiable factor), nutritional support (omega-3, B vitamins, antioxidants), social connection awareness (isolation accelerates decline). Gentle clinical screening recommendation if patterns warrant.",
    userStory: "As a post-menopausal woman worried about cognitive changes, I want data-based reassurance and support for modifiable factors.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Seren", "Kai", "Atlas"],
    notes: "Education-first. Sleep is biggest modifiable factor. Social connection awareness.",
    tier: 2,
    phase: "Phase 2: Advanced",
  },
  {
    name: "Sexual Health & Intimate Wellness",
    description: "Over 25% of postmenopausal women report painful sex. Most suffer in silence. Seren handles emotional component: shame, grief, relationship strain. Kai provides practical resources: lubricants, vaginal moisturizers, when to discuss vaginal estrogen (different from systemic HRT), pelvic floor considerations. Partner education opt-in.",
    userStory: "As a post-menopausal woman, I want shame-free support for sexual health changes — both emotional and practical.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Seren", "Kai"],
    notes: "25%+ report painful sex. Localized estrogen education. Partner opt-in.",
    tier: 2,
    phase: "Phase 2: Advanced",
  },
  {
    name: "Doctor's Report Generator",
    description: "Multi-specialty health reports for ANY healthcare appointment: Cardiovascular summary (BP, glucose, HRV, activity), Bone health (exercise, nutrition, DEXA, risk factors), HRT monitoring (if applicable), Metabolic summary, Sleep and cognitive summary, Complete longitudinal health timeline. For lifetime users: data spanning her entire adult life.",
    userStory: "As a post-menopausal woman, I want comprehensive health reports for any doctor — and if I've been with Conceivable for decades, my entire adult health story.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Most powerful feature for lifetime users. Longitudinal data potentially spanning decades.",
    tier: 2,
    phase: "Phase 2: Advanced",
  },
];

// ═══════════════════════════════════════════════════
// EXPERIENCE TRANSITIONS
// ═══════════════════════════════════════════════════

export const MENOPAUSE_TRANSITIONS = [
  {
    from: "Perimenopause",
    to: "Menopause & Beyond",
    trigger: "12 months without menstrual cycle",
    description: "Score evolves from Transition Wellness to Longevity Wellness. Care team continues. Now we optimize for the long game.",
    color: "#D4944A",
  },
  {
    from: "Menopause & Beyond",
    to: "First Period (Next Generation)",
    trigger: "She downloads Conceivable for her daughter or granddaughter",
    description: "The generational loop. Two generations. Lifetime value squared.",
    color: "#F4A7B9",
  },
];

// ═══════════════════════════════════════════════════
// IMPLEMENTATION ROADMAP
// ═══════════════════════════════════════════════════

export const MENOPAUSE_ROADMAP = [
  {
    phase: "Phase 1: Continuation",
    label: "Launches when women transition from Perimenopause",
    items: [
      "Longevity Wellness Score",
      "HRT monitoring (if applicable)",
      "Cardiovascular health monitoring",
      "Bone health tracking",
    ],
    dependencies: "Perimenopause experience, scoring engine",
  },
  {
    phase: "Phase 2: Advanced",
    label: "4-8 weeks post-launch",
    items: [
      "Cognitive health support",
      "Sexual health & intimate wellness",
      "Doctor's Report Generator (all health)",
    ],
    dependencies: "Report generator framework, partner education system",
  },
];

// ═══════════════════════════════════════════════════
// IP COVERAGE
// ═══════════════════════════════════════════════════

export const MENOPAUSE_IP_COVERAGE = [
  { feature: "Longevity Wellness Score", patents: [{ number: "001", name: "Conceivable Score", id: "draft-01" }] },
  { feature: "HRT Monitoring", patents: [{ number: "022", name: "HRT Response Monitoring", id: "patent-022" }] },
  { feature: "Cardiovascular Health Monitoring", patents: [{ number: "006", name: "Halo Ring Integration", id: "draft-06" }] },
  { feature: "Bone Health Tracking", patents: [] },
  { feature: "Cognitive Health Support", patents: [] },
  { feature: "Sexual Health & Intimate Wellness", patents: [] },
  { feature: "Doctor's Report Generator", patents: [] },
];
