// Perimenopause Experience — Feature Data, Care Team, Engineering, IP, Roadmap

export interface PerimenopauseFeatureSeed {
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

export const PERIMENOPAUSE_DESCRIPTION = `Perimenopause begins 5-10 years before menopause and is one of the most significant physiological transitions in a woman's life — yet it remains one of the least recognized in clinical practice. Women are told they're 'too young for menopause' at 42 while their bodies are clearly transitioning. Their symptoms are attributed to stress, aging, or depression. The average woman sees multiple doctors before anyone connects the dots.

Conceivable detects perimenopause through continuous physiological monitoring — often YEARS before the woman or her doctor would notice. Elevated follicular phase BBTs, increasing cycle variability, HRV shifts, and sleep architecture changes form a signature pattern that our system reads from Halo Ring data. For women who've been in the Periods experience, we compare against years of personal baseline data. Nobody else has this.

The root cause approach still works here. Hot flashes are worsened by blood sugar instability, alcohol, stress, and certain foods. Sleep disruption is worsened by caffeine timing, temperature, and cortisol patterns. Mood changes are worsened by nutritional deficiencies and chronic stress. GI symptoms are connected to estrogen's effect on gut motility and the microbiome. Weight gain is driven by accelerating insulin resistance. ALL of these are modifiable. We identify HER specific patterns and deploy the care team to optimize them.

When modifiable factors aren't enough, we generate a comprehensive data report and connect her with HRT providers through a telehealth partner — then continue monitoring her response to therapy through the wearable. The prescribing doctor gets continuous data they've never had access to before.

The women who built healthy habits through the Periods experience will have easier transitions. The foundation she built at 15 pays off at 45. This is the long game made real.`;

export const PERIMENOPAUSE_PERSONA = `A woman in her late 30s to early 50s experiencing early signs of hormonal transition — cycle changes, sleep disruption, thermoregulatory shifts, mood changes, GI disruption — who has been dismissed by the medical system. She may have been in the Periods experience for years (ideal: personal baseline data available) or she may be new to Conceivable. She needs detection, validation, root cause optimization, and eventually clinical bridge support when modifiable factors aren't enough.`;

export const PERIMENOPAUSE_MARKET_DATA = {
  marketSize: "$250-500M in 2025",
  growth: "15-20% annually",
  globalReach: "1B+ women globally",
  competitors: [
    { name: "Gennev", model: "Telehealth, $45-85/visit" },
    { name: "Balance", model: "Dr. Louise Newson, $99/yr" },
    { name: "Caria", model: "CBT + community, $78/yr" },
    { name: "Elektra", model: "$30/mo with clinicians" },
    { name: "Stella", model: "Symptom tracker + content" },
    { name: "Midday", model: "Symptom tracker + community" },
    { name: "Perry", model: "Community-first approach" },
  ],
  ourAdvantage: "ALL competitors are symptom trackers with content libraries and optional community forums. NONE do continuous physiological monitoring, root cause intervention, predictive detection, or longitudinal baseline comparison. Half score below minimum quality thresholds in systematic reviews.",
};

// ═══════════════════════════════════════════════════
// CARE TEAM
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_CARE_TEAM = [
  {
    name: "Kai",
    role: "Transition Guide",
    color: "#5A6FFF",
    description: "Translates the hormonal chaos into something she understands. Daily summaries. Never alarming, always contextualizing. \"Your body is adapting, not failing.\"",
  },
  {
    name: "Olive",
    role: "Transition Nutrition",
    color: "#7CAE7A",
    description: "Phytoestrogen-rich foods, anti-inflammatory protocols, calcium/vitamin D optimization, gut health support, blood sugar stabilization. Auto-adjusts based on her specific signal patterns.",
  },
  {
    name: "Seren",
    role: "Identity & Emotional Support",
    color: "#E37FB1",
    description: "Perimenopause is an identity transition as much as a physical one. Holds space for grief, fear, relationship strain, the 'am I going crazy' feeling. Monitors for perimenopausal depression.",
  },
  {
    name: "Atlas",
    role: "Detection & Pattern Engine",
    color: "#D4A843",
    description: "Runs the perimenopause prediction algorithm, tracks transition progression, identifies trigger patterns, compares against lifetime baseline data.",
  },
  {
    name: "Zhen",
    role: "Language Bridge",
    color: "#78C3BF",
    description: "75 languages. Every woman deserves to understand her transition in her own language.",
  },
  {
    name: "Navi",
    role: "Navigation & Resources",
    color: "#356FB6",
    description: "Finds menopause specialists, HRT providers, local support groups, and clinical resources.",
  },
];

// ═══════════════════════════════════════════════════
// FEATURES (10 total)
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_FEATURES: PerimenopauseFeatureSeed[] = [
  // TIER 1 — Core Experience (Launch) — 6 features
  {
    name: "Perimenopause Early Detection",
    description: "The prediction algorithm made into a user-facing feature. Detects perimenopause from continuous Halo Ring data, often years before clinical diagnosis. For Periods experience users, compares against personal baseline. Four confidence levels with appropriate messaging at each level. Recommends Day 3 labs at Level 3+. Transitions to full Perimenopause experience at Level 4.",
    userStory: "As a woman in my late 30s-40s, I want to know early if my body is entering perimenopause so I can prepare and optimize, rather than being blindsided.",
    priority: "must_have",
    complexity: "large",
    status: "designing",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "SPRINT ITEM — Patent 021. Novel: follicular phase BBT elevation >97.2°F as predictive biomarker. See prediction-algorithm spec.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },
  {
    name: "Transition Wellness Score",
    description: "Same tiered scoring architecture, calibrated for perimenopause. Categories: Thermoregulatory Adaptation, Sleep Restoration (highest weight), Mood & Cognitive Vitality, Nutritional Foundation, Metabolic Adaptation. THE SCORE STILL IMPROVES — modifiable factors significantly impact how the body adapts.",
    userStory: "As a perimenopausal woman, I want a score showing how well I'm supporting my body through this transition.",
    priority: "must_have",
    complexity: "large",
    status: "designing",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Score improvement curve remains the product. Even with declining hormones, modifiable factors move the score.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },
  {
    name: "Root Cause Signal Resolution",
    description: "NOT symptom management. Root cause identification and intervention. System identifies HER specific trigger patterns through multi-week Halo Ring analysis. Example: \"Your thermoregulatory events are most frequent after meals with alcohol or high-glycemic foods, and more intense on low-HRV days. Olive has adjusted your evening nutrition.\" Every competitor says \"track your triggers.\" We say \"here are your triggers and we've already started optimizing.\"",
    userStory: "As a perimenopausal woman, I want the system to identify WHY my body is producing these signals and automatically optimize.",
    priority: "must_have",
    complexity: "large",
    status: "designing",
    careTeamMembers: ["Atlas", "Olive", "Kai"],
    notes: "Key differentiator vs competitors. We identify triggers AND deploy interventions.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },
  {
    name: "Transition-Synced Nutrition",
    description: "Olive auto-adjusts across five focus areas: Phytoestrogen integration (soy isoflavones, flaxseed, lentils, chickpeas), Anti-inflammatory protocol (omega-3, turmeric/curcumin), Bone-supporting nutrition (calcium 1200mg/day, vitamin D, K2, magnesium), Metabolic stabilization (blood sugar management — insulin resistance accelerates), Gut health support (estrogen decline affects gut motility and microbiome).",
    userStory: "As a perimenopausal woman, I want my nutrition to automatically adapt — protecting bones, stabilizing blood sugar, supporting my gut.",
    priority: "must_have",
    complexity: "medium",
    status: "designing",
    careTeamMembers: ["Olive"],
    notes: "Five focus areas auto-adjusted based on Halo Ring signal patterns.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },
  {
    name: "GI Health Integration",
    description: "82% of perimenopausal women report digestive changes. 58% who sought professional help found it inadequate. Tracks GI signals alongside hormonal transition data: food-to-GI correlation, cycle-phase timing, fiber/hydration, gut-supporting nutrition auto-adjustment. Kai connects the dots. Cutting-edge — presented at 2025 Menopause Society Annual Meeting. Nobody else connects GI to perimenopause in an app.",
    userStory: "As a perimenopausal woman with new GI changes, I want to understand these are connected to my transition and get root cause nutrition support.",
    priority: "must_have",
    complexity: "medium",
    status: "designing",
    careTeamMembers: ["Olive", "Kai", "Atlas"],
    notes: "Patent 023. 82% report digestive changes. Validated at 2025 Menopause Society Annual Meeting.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },
  {
    name: "Seren's Transition Space",
    description: "Perimenopause is an identity crisis as much as a physical transition. Seren provides emotional support for: grief about changing body, fear about aging, 'am I going crazy' feelings, relationship strain, workplace impact, the invisibility feeling, and perimenopausal depression (monitored using adapted PPD detection signals). Reframing: \"Your body is transitioning, not failing.\"",
    userStory: "As a perimenopausal woman, I want emotional support that validates my experience, helps me process the identity shift, and monitors me for depression.",
    priority: "must_have",
    complexity: "medium",
    status: "designing",
    careTeamMembers: ["Seren"],
    notes: "Adapted PPD detection signals for perimenopausal depression monitoring. Identity crisis support is unique.",
    tier: 1,
    phase: "Phase 1: Core Detection & Optimization",
  },

  // TIER 2 — Clinical Bridge (Phase 2) — 4 features
  {
    name: "HRT Decision Support & Partner Referral",
    description: "When modifiable optimization plateaus: (1) Generates Perimenopause Report with transition timeline, signal patterns, trigger analysis, intervention response data, physiological trends, Day 3 labs. (2) Kai has the conversation — wellness-framed, never prescriptive. (3) Referral to telehealth HRT partner with data pre-sent. (4) Post-HRT monitoring through Halo Ring — continuous data the prescriber doesn't have.",
    userStory: "As a perimenopausal woman whose optimization has plateaued, I want data-driven HRT evaluation support and continuous response monitoring.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Patent 022. B2B angle: prescriber gets continuous data. Partner needed (Ro, Alloy, Evernow).",
    tier: 2,
    phase: "Phase 2: Clinical Bridge",
  },
  {
    name: "Day 3 Lab Integration",
    description: "At prediction Level 3+, recommends cycle day 3 hormone panel. Partnership with at-home lab service. Tests: FSH, LH, Estradiol, AMH, TSH (thyroid must be ruled out), Complete metabolic panel. Results displayed through Kai. Same model extends to Fertility (AMH) and Semen Analysis.",
    userStory: "As a woman with perimenopause signals, I want to easily order at-home labs with results integrated and explained.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Shared infrastructure with Fertility lab integration. Partner: Everlywell, LetsGetChecked, or Ro.",
    tier: 2,
    phase: "Phase 2: Clinical Bridge",
  },
  {
    name: "Bone Health Awareness",
    description: "Bone density loss begins years before menopause. System tracks: weight-bearing exercise, calcium/vitamin D intake, activity patterns from Halo Ring, risk factors (family history, low BMI, smoking, medications). Recommends DEXA scan at appropriate threshold.",
    userStory: "As a perimenopausal woman, I want proactive bone health support before loss accelerates.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Olive", "Kai", "Atlas"],
    notes: "Continues into Menopause & Beyond. Weight-bearing exercise + nutrition are primary modifiable factors.",
    tier: 2,
    phase: "Phase 2: Clinical Bridge",
  },
  {
    name: "Cardiovascular Awareness",
    description: "Estrogen is cardioprotective — risk increases as it declines. Monitors: BP from face scans, blood sugar patterns from Halo Ring, HRV, activity, inflammatory markers. Flags when patterns suggest clinical evaluation.",
    userStory: "As a perimenopausal woman, I want early cardiovascular awareness before estrogen's protection declines.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Continues into Menopause & Beyond. Face scan BP + Halo Ring glucose + HRV.",
    tier: 2,
    phase: "Phase 2: Clinical Bridge",
  },
];

// ═══════════════════════════════════════════════════
// ENGINEERING COMPONENTS
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_ENGINEERING = [
  {
    name: "Perimenopause Prediction Engine",
    description: "Multi-signal detection algorithm using elevated follicular phase BBT (>97.2°F) as primary indicator, combined with cycle variability, HRV trajectory, sleep architecture changes, and thermoregulatory event detection. Compares against personal historical baseline. Outputs transition likelihood level (0-4).",
    status: "SPRINT ITEM — Ready for Development",
    priority: "Critical",
    color: "#E24D47",
    dependencies: ["Halo Ring BBT data", "Cycle tracking data", "Personal baseline from Periods"],
  },
  {
    name: "Lab Integration System",
    description: "Partnership integration with at-home lab testing. Supports Day 3 hormone panel for perimenopause AND fertility, semen analysis for male partners. Results feed into Atlas.",
    status: "Ready for Development — needs partner",
    priority: "High",
    color: "#F59E0B",
    dependencies: ["Lab partner API", "Atlas data integration", "Results interpretation"],
  },
  {
    name: "HRT Response Monitoring System",
    description: "Continuous monitoring of therapy response through Halo Ring. Tracks thermoregulatory events, sleep quality, HRV recovery, mood indicators. Generates HRT Response Reports for prescriber.",
    status: "Ready for Development",
    priority: "Medium",
    color: "#5A6FFF",
    dependencies: ["Halo Ring integration", "HRT partner referral", "Report generator"],
  },
  {
    name: "Longevity Wellness Scoring Engine",
    description: "Adapts tiered scoring for post-menopausal health. Categories: Cardiovascular, Bone & Muscle, Cognitive Vitality, Metabolic Health, Rest & Recovery. Score still improves.",
    status: "Ready for Development",
    priority: "Medium",
    color: "#5A6FFF",
    dependencies: ["Scoring engine framework (shared)"],
  },
];

// ═══════════════════════════════════════════════════
// EXPERIENCE TRANSITIONS
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_TRANSITIONS = [
  {
    from: "Periods",
    to: "Perimenopause",
    trigger: "Prediction algorithm detects Level 4 (high confidence perimenopause)",
    description: "Seamless transition. Years of baseline data transfer. The foundation she built at 15 pays off at 45.",
    color: "#E24D47",
  },
  {
    from: "Postpartum",
    to: "Perimenopause",
    trigger: "Late-life pregnancies may overlap with early perimenopause signals",
    description: "Atlas distinguishes postpartum recovery from perimenopause onset through temporal pattern analysis.",
    color: "#7CAE7A",
  },
  {
    from: "Perimenopause",
    to: "Menopause & Beyond",
    trigger: "12 months without menstrual cycle",
    description: "Score evolves from Transition Wellness to Longevity Wellness. Care team continues.",
    color: "#2A8A8A",
  },
];

// ═══════════════════════════════════════════════════
// IMPLEMENTATION ROADMAP
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_ROADMAP = [
  {
    phase: "Phase 1: Core Detection & Optimization",
    label: "Launch",
    items: [
      "Perimenopause Prediction Algorithm (SPRINT)",
      "Transition Wellness Score",
      "Root cause signal resolution",
      "Transition-synced nutrition (Olive)",
      "GI health integration",
      "Seren's transition space",
    ],
    dependencies: "Halo Ring integration, prediction algorithm, Periods experience baseline data",
  },
  {
    phase: "Phase 2: Clinical Bridge",
    label: "4-8 weeks post-launch",
    items: [
      "HRT decision support & partner referral",
      "Day 3 lab integration (partner needed)",
      "Bone health awareness",
      "Cardiovascular awareness",
    ],
    dependencies: "Lab partner, HRT telehealth partner, report generator",
  },
];

// ═══════════════════════════════════════════════════
// IP COVERAGE
// ═══════════════════════════════════════════════════

export const PERIMENOPAUSE_IP_COVERAGE = [
  { feature: "Perimenopause Early Detection", patents: [{ number: "021", name: "Perimenopause Predictor", id: "patent-021" }] },
  { feature: "Transition Wellness Score", patents: [{ number: "001", name: "Conceivable Score", id: "draft-01" }] },
  { feature: "Root Cause Signal Resolution", patents: [{ number: "002", name: "Root Cause Analysis", id: "draft-02" }, { number: "004", name: "Root Cause Resolution", id: "draft-04" }] },
  { feature: "Transition-Synced Nutrition", patents: [{ number: "005", name: "Supplement Personalization", id: "draft-05" }] },
  { feature: "GI Health Integration", patents: [{ number: "023", name: "Gut-Hormone Connection", id: "patent-023" }] },
  { feature: "Seren's Transition Space", patents: [{ number: "012", name: "PPD Detection System", id: "patent-012" }] },
  { feature: "HRT Decision Support & Partner Referral", patents: [{ number: "022", name: "HRT Response Monitoring", id: "patent-022" }] },
  { feature: "Day 3 Lab Integration", patents: [] },
  { feature: "Bone Health Awareness", patents: [] },
  { feature: "Cardiovascular Awareness", patents: [] },
];
