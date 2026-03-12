// Period Experience — Complete Feature Set
// 12 features for the Period health experience
// 5 Tier 1 (Must Have), 4 Tier 2 (Should Have), 3 Tier 3 (Nice to Have)

export interface PeriodFeatureSeed {
  name: string;
  description: string;
  userStory: string;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[];
  notes: string;
  tier: number;
  phase: string;
}

export const PERIOD_FEATURES: PeriodFeatureSeed[] = [
  // ═══════════════════════════════════════════
  // TIER 1 — MUST HAVE (5 features)
  // ═══════════════════════════════════════════
  {
    name: "Period Health Score",
    description: "Same architecture as Conceivable Score and Pregnancy Wellness Score — adapted for menstrual health. A single number that tells her how her cycle health is doing, what's driving it, and what to do about it. Five categories: Cycle Regularity (length consistency, duration, flow patterns), Hormonal Balance (BBT ovulation quality, luteal phase adequacy, estrogen/progesterone proxy indicators), Pain & Inflammation (cramp severity trends, headache patterns, inflammatory markers via HRV), Nutritional Foundation (iron indicators, supplement compliance, cycle-phase nutrition alignment), Stress & Recovery (HRV across cycle phases, sleep quality, cortisol proxy indicators). THE SCORE IMPROVES OVER TIME. This is the core value proposition. Over 3-6 cycles, the care team's interventions produce measurable improvement. She sees the number go up. That's the retention hook no other app has.",
    userStory: "As a woman who menstruates, I need a single number that tells me how my cycle health is doing and what's driving it so that I can see measurable improvement over time instead of just enduring my period every month.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Core scoring engine for Period experience. Adapt Patent 001 (Composite Fertility Health Scoring) for period-specific calibration. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Cycle Intelligence Engine",
    description: "Atlas's brain. After 3 cycles of data, the system identifies patterns a clinician would take months to spot. Connects cycle irregularities to root causes — short luteal phase linked to blood sugar instability, worsening cramps linked to inflammatory diet patterns, mood crashes linked to progesterone drops caused by poor sleep. This is the ROOT CAUSE ANALYSIS applied to menstrual health. The system doesn't just identify problems — it explains WHY they're happening and deploys the care team to FIX THEM.",
    userStory: "As a woman with cycle irregularities, I need to understand WHY my cycles are the way they are — not just track them — so that the underlying causes can actually be addressed.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Patent 002 (Root Cause Analysis), Patent 009 (Pattern Attribution). Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Predictive Cycle Mapping",
    description: "Every period tracker predicts WHEN your period starts. Conceivable predicts your ENTIRE next cycle from physiological data, not calendar math. Maps all four phases with personalized timing based on her BBT, HRV, and glucose patterns. Each phase comes with pre-positioned care team support: Olive adjusts nutrition automatically at each transition, Seren shifts emotional support strategy, Kai provides phase-appropriate guidance.",
    userStory: "As a woman who menstruates, I need a roadmap for my entire month — not just when my period starts — so I can plan my life around my body's actual rhythms.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas", "Olive", "Seren"],
    notes: "Phase 1 deliverable. Differentiator: physiological prediction vs calendar math.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Root Cause Period Pain Resolution",
    description: "CRITICAL DISTINCTION — this is NOT pain management. This is pain ELIMINATION through root cause correction. Period pain (dysmenorrhea) is caused by excess prostaglandins, which are caused by inflammation, which is caused by identifiable dietary, stress, and hormonal factors. The system identifies HER specific pain drivers through multi-cycle pattern analysis, then deploys Olive and Seren to address the ROOT CAUSE. Over 3-6 cycles, the pain should measurably decrease. Same approach for PMS. The system tracks pain severity and PMS symptom intensity over cycles and shows her the improvement curve.",
    userStory: "As a woman who suffers from period pain and PMS, I need a system that actually resolves the root cause of my symptoms instead of telling me to take ibuprofen and use a heating pad.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Olive", "Seren", "Kai", "Atlas"],
    notes: "Patent 008 (Closed-Loop Correction). Phase 1 deliverable. This is the feature that proves the product works.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Cycle-Synced Life Optimization",
    description: "Takes clinical intelligence and translates it into daily actionable guidance. EXERCISE PLANNING: Different cycle phases have different physiological capacities. Follicular: high-intensity training, strength gains. Ovulatory: peak performance. Luteal: moderate intensity, yoga, Pilates. Menstrual: gentle movement, restorative yoga. WORK/LIFE PLANNING: evidence-based hormonal physiology translated into daily guidance. This is the feature that drives virality.",
    userStory: "As a woman who menstruates, I want my exercise plan, work schedule, and daily guidance to automatically adjust to my cycle phase so I can optimize every day instead of fighting my body.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Olive", "Seren"],
    notes: "Phase 1 deliverable. Virality driver — women tell their friends about this feature.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },

  // ═══════════════════════════════════════════
  // TIER 2 — SHOULD HAVE (4 features)
  // ═══════════════════════════════════════════
  {
    name: "PCOS Pattern Recognition",
    description: "PCOS affects 6-12% of women, takes average 2+ years and 3+ doctors to diagnose. System watches for PCOS signatures across multiple cycles: cycle irregularity patterns, blood sugar dysregulation, weight trends, acne patterns, mood patterns, hormonal proxy indicators. When pattern confidence reaches threshold (typically 6 cycles), Kai flags it with data summary for her doctor. Gateway to dedicated PCOS Experience.",
    userStory: "As a woman with unexplained cycle irregularities, I need the system to recognize patterns that might indicate PCOS months or years before I'd otherwise get diagnosed.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Patent 002 (Root Cause Analysis). Phase 2 deliverable. Average diagnosis time: 2+ years. Target: 6 months.",
    tier: 2,
    phase: "Phase 2: Condition Detection",
  },
  {
    name: "Endometriosis Early Warning",
    description: "Endometriosis affects 1 in 10 women, takes average 7-10 YEARS to diagnose. System monitors: progressive pain increase over cycles, pain outside menstruation, GI symptoms correlating with cycle phase, pain during intercourse (if reported), fatigue patterns, family history. Gateway to dedicated Endometriosis Experience.",
    userStory: "As a woman with worsening period pain, I need early detection of endometriosis patterns so I can get proper care years earlier than the current 7-10 year diagnostic average.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Phase 2 deliverable. Average woman with endo sees 7 doctors before diagnosis.",
    tier: 2,
    phase: "Phase 2: Condition Detection",
  },
  {
    name: "PMDD Identification & Management",
    description: "PMDD is distinct from PMS — it's a diagnosable condition affecting 3-8% of women that can be debilitating. System differentiates PMS from PMDD by tracking symptom severity, timing, HRV patterns specific to PMDD, number of affected cycles. When identified, Seren shifts into PMDD-specific support and recommends clinical evaluation.",
    userStory: "As a woman who thinks she has 'really bad PMS,' I need the system to tell me whether what I'm experiencing is actually PMDD so I can get appropriate treatment.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Seren", "Atlas", "Kai"],
    notes: "Phase 2 deliverable. Most women with PMDD don't know it exists.",
    tier: 2,
    phase: "Phase 2: Condition Detection",
  },
  {
    name: "Doctor's Report Generator",
    description: "Generates comprehensive provider report: cycle history, symptom patterns mapped to phases, pain trends, flagged patterns, HRV and sleep data, blood sugar patterns, care team intervention results, specific questions generated by Atlas. She walks into her appointment with more data than the doctor has ever seen. Export as PDF.",
    userStory: "As a woman going to her gynecologist, I need a comprehensive report of my cycle data so I don't fumble through 'when was your last period?' and actually have a productive clinical conversation.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Phase 2 deliverable. Changes the clinical conversation entirely.",
    tier: 2,
    phase: "Phase 2: Condition Detection",
  },

  // ═══════════════════════════════════════════
  // TIER 3 — NICE TO HAVE (3 features)
  // ═══════════════════════════════════════════
  {
    name: "Fertility Readiness Assessment",
    description: "For women not actively TTC but curious about future fertility. Based on cycle data, ovulation quality, hormonal indicators, and age, system provides gentle, non-alarming assessment. THE BRIDGE to the Fertility experience.",
    userStory: "As a woman who might want children someday, I want to know if my cycle data shows anything I should be aware of — without making everything about fertility unless I want that.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Phase 3 deliverable. Bridge to Fertility experience.",
    tier: 3,
    phase: "Phase 3: Lifecycle Bridges",
  },
  {
    name: "Perimenopause Detection",
    description: "Perimenopause starts years before menopause. Cycle changes, hot flashes, sleep disruption, mood volatility. System monitors for perimenopause signatures: increasing cycle variability after years of regularity, BBT pattern changes, sleep and HRV changes. THE BRIDGE to Perimenopause experience.",
    userStory: "As a woman in her late 30s or 40s with changing cycles, I need to know whether this is normal variation or the beginning of perimenopause so I can manage it proactively.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Seren"],
    notes: "Phase 3 deliverable. Bridge to Perimenopause experience.",
    tier: 3,
    phase: "Phase 3: Lifecycle Bridges",
  },
  {
    name: "Thyroid Dysfunction Detection",
    description: "BBT patterns are one of the earliest indicators of thyroid dysfunction. Halo Ring provides continuous BBT. System watches for: consistently low BBT, absent biphasic pattern, energy patterns, cycle changes, unexplained weight changes, hair and skin changes.",
    userStory: "As a woman with unexplained fatigue and cycle changes, I need the system to flag potential thyroid dysfunction from my BBT patterns before it requires years of doctor visits to identify.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Phase 2 deliverable. Thyroid issues massively underdiagnosed in women.",
    tier: 2,
    phase: "Phase 2: Condition Detection",
  },
];

// IP Coverage mapping for the Period experience
export const PERIOD_IP_COVERAGE: { feature: string; patents: { number: string; name: string; id: string }[] }[] = [
  {
    feature: "Period Health Score",
    patents: [
      { number: "001", name: "Conceivable Score", id: "draft-01" },
      { number: "015", name: "Period Root Cause Resolution", id: "patent-015" },
    ]
  },
  {
    feature: "Cycle Intelligence Engine",
    patents: [
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
      { number: "009", name: "Pattern Attribution", id: "patent-009" },
      { number: "015", name: "Period Root Cause Resolution", id: "patent-015" },
    ]
  },
  {
    feature: "Predictive Cycle Mapping",
    patents: [
      { number: "003", name: "Cycle Recalibration", id: "draft-03" },
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
    ]
  },
  {
    feature: "Root Cause Pain Resolution",
    patents: [
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
      { number: "015", name: "Period Root Cause Resolution", id: "patent-015" },
    ]
  },
  {
    feature: "Cycle-Synced Life Optimization",
    patents: [
      { number: "016", name: "Cycle-Synced Optimization", id: "patent-016" },
    ]
  },
  {
    feature: "PCOS Pattern Recognition",
    patents: [
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
      { number: "017", name: "Condition Detection Engine", id: "patent-017" },
    ]
  },
  {
    feature: "Endometriosis Early Warning",
    patents: [
      { number: "017", name: "Condition Detection Engine", id: "patent-017" },
    ]
  },
  {
    feature: "PMDD Identification",
    patents: [
      { number: "017", name: "Condition Detection Engine", id: "patent-017" },
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
    ]
  },
  {
    feature: "Doctor's Report Generator",
    patents: [
      { number: "006", name: "Data Validation", id: "patent-006" },
    ]
  },
  {
    feature: "Fertility Readiness Assessment",
    patents: [
      { number: "001", name: "Conceivable Score", id: "draft-01" },
    ]
  },
  {
    feature: "Perimenopause Detection",
    patents: [
      { number: "017", name: "Condition Detection Engine", id: "patent-017" },
    ]
  },
  {
    feature: "Thyroid Dysfunction Detection",
    patents: [
      { number: "017", name: "Condition Detection Engine", id: "patent-017" },
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
    ]
  },
];

export const PERIOD_DESCRIPTION = "Every period tracker on the market is a calendar pretending to be a health tool. They tell women WHEN their period is coming. We tell them WHY it hurts, WHY it's irregular, WHY their mood crashes on day 22 — and then we fix it. Your period is a monthly report card on your overall health. Cycle irregularities, pain, PMS, and mood disruption aren't things to endure. They're symptoms of identifiable, correctable imbalances in blood sugar, nutrition, stress, sleep, and hormonal function. The Period experience doesn't track your cycle. It reads your cycle like a diagnostic tool and actively works to optimize the underlying systems that produce it. The score doesn't just track — it IMPROVES. Over 3-6 cycles, women should see measurable improvement in cycle regularity, pain reduction, mood stability, and overall quality of life. No other app does this. No other app CAN do this.";

export const PERIOD_PERSONA = "Every menstruating woman on earth. This is the front door — the largest possible addressable market. She's been using Flo or Clue or a notes app to track when her period starts. She's been told period pain is 'normal.' She's been told PMS is just something women deal with. She's tired of apps that show her a calendar and call it health. She wants to understand WHY her body does what it does and she wants someone to actually DO something about it. Once inside, the system naturally identifies when she needs the PCOS experience, the Endometriosis experience, the Fertility experience, or eventually the Perimenopause experience.";

// Care team configuration for Period experience
export const PERIOD_CARE_TEAM = [
  {
    name: "Kai",
    role: "Cycle Translator",
    color: "#5A6FFF",
    description: "Takes raw data and tells her what her body is actually saying. Not 'your cycle was 34 days' but 'your luteal phase was short this month, here's why and here's what we're doing about it.' Daily summaries timed to cycle phase.",
  },
  {
    name: "Olive",
    role: "Cycle-Synced Nutrition",
    color: "#1EAA55",
    description: "Automatically adjusts nutrition based on cycle phase. Follicular: iron replenishment, estrogen-supporting. Ovulatory: anti-inflammatory, liver-supporting. Luteal: progesterone-supporting, magnesium, B6. Menstrual: iron, anti-inflammatory, warming foods.",
  },
  {
    name: "Seren",
    role: "Cycle-Synced Emotional Support",
    color: "#E37FB1",
    description: "Understands WHY mood changes happen across the cycle, validates them, provides evidence-based strategies timed to her specific phase. Differentiates normal cyclical mood variation from PMS from PMDD.",
  },
  {
    name: "Atlas",
    role: "Pattern Intelligence",
    color: "#356FB6",
    description: "Runs root cause analysis engine across multiple cycles. Identifies whether irregularities are normal variation or early signals of PCOS, endometriosis, thyroid dysfunction, or hormonal imbalance. The brain of the diagnostic system.",
  },
  {
    name: "Zhen",
    role: "Translation",
    color: "#9686B9",
    description: "75 languages. Period education and cycle-synced guidance globally. This is where the massive market lives — billions of women who have never received adequate menstrual education.",
  },
  {
    name: "Navi",
    role: "Navigation",
    color: "#F1C028",
    description: "Guides her through the experience, surfaces right content at right time, connects her to right team member based on cycle phase and current needs.",
  },
];

// Competitive analysis for Period experience
export const PERIOD_COMPETITORS = [
  {
    name: "Flo",
    stats: "420M downloads, $50/yr premium",
    weakness: "Settled $56M for sharing data with Facebook. Ad-supported content platform with a calendar. No interventions, no wearable integration, no root cause analysis.",
    color: "#FF6B6B",
  },
  {
    name: "Clue",
    stats: "Science-focused, EU privacy, 30+ data points",
    weakness: "Still just tracking with articles. No AI guidance, no interventions, no improvement mechanism.",
    color: "#5A6FFF",
  },
  {
    name: "Natural Cycles",
    stats: "FDA-cleared contraception, BBT-based",
    weakness: "Good science but narrow use case — birth control tool, not health optimization.",
    color: "#E8A87C",
  },
  {
    name: "Stardust",
    stats: "Privacy-forward, astrology-integrated",
    weakness: "Fun but not clinical. No interventions.",
    color: "#9686B9",
  },
  {
    name: "Samphire",
    stats: "Brain-first approach, neurostimulation device",
    weakness: "Narrow (pain/mood only) and expensive hardware.",
    color: "#78C3BF",
  },
];

export const PERIOD_WHAT_THEY_DO = [
  "Calendar prediction (when is my period coming)",
  "Symptom logging (tap checkboxes for cramps, mood, flow)",
  "Ovulation estimation (calendar math, not physiology)",
  "Content (generic articles, blog posts)",
  "Community forums (variable quality, privacy concerns)",
];

export const PERIOD_WHAT_WE_DO = [
  "Continuous physiological monitoring via wearable (Halo Ring: BBT, HRV, glucose, sleep)",
  "Root cause analysis connecting period symptoms to systemic health",
  "Active intervention through AI care team (not articles — actual personalized guidance that changes daily)",
  "Cycle-synced nutrition that adjusts automatically every phase",
  "Condition detection (PCOS in 6 months vs 2+ years, endometriosis in months vs decade)",
  "A health score that IMPROVES over measurable time",
  "Pain resolution, not pain management",
  "75-language deployment",
];

// Market data for Period experience
export const PERIOD_MARKET_DATA = {
  marketSize: "$1.5-2B (2025)",
  projected: "$5B+ by 2030",
  growth: "15-20% CAGR",
  totalAddressable: "200M+ women already use period trackers globally",
  floStats: "420M downloads, $8.8M monthly revenue, $200M Series C (July 2024)",
  keyInsight: "The entire market is passive tracking. Nobody is doing active intervention. Nobody is improving outcomes. The first app that makes periods measurably better owns this market.",
  privacyLandscape: "Post-Roe fear driving users toward local-storage apps (Embody, Drip, Euki). Conceivable advantage: clinical-grade data handling with transparent privacy policy. The data does something valuable enough that women WANT to share it.",
};

// Engineering components for Period experience
export const PERIOD_ENGINEERING_COMPONENTS = [
  {
    name: "Period Health Scoring Engine",
    description: "Adapts the Conceivable Score architecture for menstrual health. Five categories: Cycle Regularity, Hormonal Balance, Pain & Inflammation, Nutritional Foundation, Stress & Recovery. Must track improvement over time. Recalculates weekly. Shows per-category scores, composite score, trend arrows, and cycle-over-cycle comparison.",
    status: "Ready for Development",
    priority: "Critical",
    dependencies: "Conceivable Score engine (adapts existing architecture), Halo Ring integration",
  },
  {
    name: "Cycle Intelligence / Root Cause Engine",
    description: "Pattern recognition across 3+ cycles connecting menstrual symptoms to systemic causes. Maps: short luteal phase → blood sugar instability, worsening cramps → inflammatory diet patterns, mood crashes → progesterone drops from poor sleep, cycle irregularity → thyroid or PCOS signatures. Outputs root cause hypotheses with confidence levels.",
    status: "Ready for Development",
    priority: "Critical",
    dependencies: "Period Health Scoring Engine, Atlas agent framework, multi-cycle data accumulation",
  },
  {
    name: "Cycle-Synced Nutrition Engine",
    description: "Olive automatically adjusts nutrition plan based on current cycle phase determined by BBT data. Four phase profiles: Follicular (iron, estrogen-support), Ovulatory (anti-inflammatory, liver-support), Luteal (progesterone-support, magnesium, B6), Menstrual (iron, anti-inflammatory, warming).",
    status: "Ready for Development",
    priority: "High",
    dependencies: "Halo Ring BBT data, Olive agent framework, cycle phase detection algorithm",
  },
  {
    name: "Cycle-Synced Exercise Planner",
    description: "Generates weekly exercise recommendations automatically adjusted to cycle phase from BBT data. Follicular: high-intensity, strength. Ovulatory: peak performance. Luteal: moderate intensity, yoga, Pilates. Menstrual: gentle movement, restorative. Prevents luteal-phase overtraining.",
    status: "Ready for Development",
    priority: "Medium",
    dependencies: "Cycle phase detection, activity data from Halo Ring",
  },
  {
    name: "Condition Detection Engine",
    description: "Multi-cycle pattern matching for PCOS, endometriosis, thyroid dysfunction, and PMDD. Each condition has a signature profile built from clinical literature and Kirsten's 20 years of clinical pattern data. Runs after 3+ cycles with increasing confidence.",
    status: "Ready for Development",
    priority: "High",
    dependencies: "Multi-cycle data, Period Health Scoring Engine, clinical pattern library",
  },
  {
    name: "Doctor's Report Generator",
    description: "Auto-generates comprehensive clinical summary from continuous monitoring data. Includes: cycle history with averages, symptom-to-phase mapping, pain severity trends, flagged condition indicators, HRV/sleep/glucose trends, care team intervention results, and system-generated questions for the provider. PDF export.",
    status: "Ready for Development",
    priority: "Medium",
    dependencies: "Period Health Scoring Engine, Condition Detection Engine, PDF generation",
  },
  {
    name: "Predictive Cycle Mapping Engine",
    description: "Predicts entire upcoming cycle from physiological data rather than calendar math. Pre-positions care team at each transition. Confidence levels for each prediction based on data quality and cycle consistency.",
    status: "Ready for Development",
    priority: "Medium",
    dependencies: "Cycle Intelligence Engine, 3+ cycles of BBT/HRV data",
  },
];

// Experience transitions for Period experience
export const PERIOD_EXPERIENCE_TRANSITIONS = [
  {
    from: "Periods",
    to: "PCOS",
    slug: "pcos",
    trigger: "When PCOS pattern detected (typically after 6 cycles)",
    color: "#9686B9",
    icon: "🔬",
  },
  {
    from: "Periods",
    to: "Endometriosis",
    slug: "endometriosis",
    trigger: "When endometriosis pattern detected (progressive pain increase)",
    color: "#C9536E",
    icon: "🥀",
  },
  {
    from: "Periods",
    to: "Fertility",
    slug: "fertility",
    trigger: "When she's ready to conceive or fertility readiness flags optimization opportunities",
    color: "#5A6FFF",
    icon: "✨",
  },
  {
    from: "Periods",
    to: "Perimenopause",
    slug: "perimenopause",
    trigger: "When perimenopause signatures detected (cycle variability, BBT changes)",
    color: "#D4944A",
    icon: "🔥",
  },
  {
    from: "First Period",
    fromSlug: "first-period",
    to: "Periods",
    slug: "periods",
    trigger: "Age-appropriate transition when she's ready",
    color: "#F4A7B9",
    icon: "🌸",
  },
  {
    from: "Postpartum",
    fromSlug: "postpartum",
    to: "Periods",
    slug: "periods",
    trigger: "When cycles return and recovery is complete",
    color: "#7CAE7A",
    icon: "🍃",
  },
];

// Roadmap for Period experience
export const PERIOD_ROADMAP = [
  {
    phase: "Phase 1",
    title: "Core Experience (Launch)",
    timeline: "8-10 weeks",
    status: "design",
    statusLabel: "In Design",
    description: "Period Health Score with all five categories, Cycle Intelligence Engine (basic pattern recognition, 3-cycle minimum), root cause period pain and PMS resolution, predictive cycle mapping, cycle-synced nutrition, exercise planning, life optimization, Kai daily summaries timed to cycle phase",
    deps: "Halo Ring integration, BBT phase detection, care team agents",
  },
  {
    phase: "Phase 2",
    title: "Condition Detection + Clinical Bridge",
    timeline: "4-8 weeks post-launch",
    status: "design",
    statusLabel: "In Design",
    description: "PCOS pattern recognition (6-cycle target), endometriosis early warning, thyroid dysfunction detection, PMDD identification and management, Doctor's Report Generator",
    deps: "Condition signature library, PDF export, multi-cycle data accumulation",
  },
  {
    phase: "Phase 3",
    title: "Lifecycle Bridges",
    timeline: "8-12 weeks post-launch",
    status: "design",
    statusLabel: "In Design",
    description: "Fertility readiness assessment, perimenopause detection, experience transition logic (Periods → PCOS, Endo, Fertility, or Perimenopause), population learning integration",
    deps: "Experience transition framework, fertility/perimenopause experience builds",
  },
];
