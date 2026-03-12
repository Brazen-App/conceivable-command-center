// Postpartum Experience — Complete Feature Set
// 13 features for the Postpartum health experience
// 4 Tier 1 (Must Have), 4 Tier 2 (Should Have), 5 Tier 3 (Nice to Have)

export interface PostpartumFeatureSeed {
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

export const POSTPARTUM_FEATURES: PostpartumFeatureSeed[] = [
  // ═══════════════════════════════════════════
  // TIER 1 — MUST HAVE (4 features)
  // ═══════════════════════════════════════════
  {
    name: "Postpartum Recovery Score",
    description: "Adapts the Conceivable Score to postpartum-specific parameters. Tracks physical recovery across bleeding/lochia progression, pain levels, pelvic floor function, energy restoration, and vital sign normalization. Integrates Halo Ring biometric data with self-reported recovery milestones. Score shifts meaning from 'how optimized is your body for pregnancy' to 'how is your body healing and rebuilding.' Weeks 0-6 focus on acute recovery; weeks 6-12 shift to restoration; 12+ weeks track return to baseline.",
    userStory: "As a postpartum woman, I need a single number that tells me how my recovery is progressing so that I don't feel abandoned by the healthcare system between my 6-week checkup and can understand what's normal versus what needs attention.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Luna", "Atlas", "Seren"],
    notes: "Core scoring engine for postpartum. Must handle C-section vs vaginal delivery recovery tracks. Patent coverage: 001, 013. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Foundation",
  },
  {
    name: "Postpartum Depression & Anxiety Detection",
    description: "Multi-signal passive monitoring system that identifies PPD/PPA risk before clinical presentation. Combines Halo Ring HRV changes, sleep disruption patterns (beyond normal newborn-related disruption), decreased app engagement, voice tone analysis during check-ins, and self-reported mood tracking. Uses Edinburgh Postnatal Depression Scale (EPDS) as clinical anchor but goes far beyond it with continuous biometric validation. Distinguishes between 'normal hard' (sleep-deprived but coping) and 'concerning pattern' (physiological markers of depression/anxiety). Seren initiates gently when sustained 5-7 day patterns emerge. Luna provides lactation-specific emotional support.",
    userStory: "As a postpartum woman, I need something watching out for my mental health because I might not recognize what's happening to me, I definitely won't bring it up at a 15-minute pediatrician visit, and the 'baby blues' label makes everyone dismiss what could be something serious.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Seren", "Atlas", "Kai", "Luna"],
    notes: "PPD affects 1 in 7 women. PPA affects 1 in 5. Most don't get diagnosed until severe. The difference between baby blues (resolves by week 2) and PPD (persists/worsens) is exactly the kind of pattern our continuous monitoring can catch. Patent 012 covers this specifically. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Foundation",
  },
  {
    name: "Recovery Trajectory Engine",
    description: "Personalized recovery timeline that accounts for delivery type (vaginal, C-section, instrumental), complications (hemorrhage, tearing, infection), pre-pregnancy fitness level, pregnancy wellness data, breastfeeding status, and support system assessment. Generates expected recovery milestones and tracks actual progress against personalized benchmarks — not generic timelines. Flags when recovery deviates from expected trajectory. Provides evidence-based recovery interventions through Olive (nutrition), Kai (guidance), and Luna (lactation). Weekly trajectory reports showing progress in The Gain framework.",
    userStory: "As a postpartum woman, I need to know if my recovery is on track for MY specific situation because the generic '6 weeks and you're fine' advice ignores that a woman who had an emergency C-section after 36 hours of labor needs a very different recovery path than someone who had an uncomplicated vaginal delivery.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Olive", "Luna"],
    notes: "Patent 013 specifically covers this. Uses pregnancy data for continuity. Recovery trajectories need clinical validation. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Foundation",
  },
  {
    name: "Postpartum Vital Sign Monitoring",
    description: "Continuous monitoring of critical postpartum health markers using Halo Ring data. Blood pressure recovery tracking (preeclampsia can develop postpartum). Heart rate recovery and resting heart rate normalization. Temperature monitoring for infection detection. Sleep architecture analysis that separates voluntary wake (feeding) from involuntary disruption. Hemorrhage risk indicators through heart rate variability patterns. Integrates with Recovery Trajectory Engine for comprehensive vital sign trending. Automatic escalation when vital signs indicate potential complications.",
    userStory: "As a postpartum woman, I need continuous vital sign monitoring because postpartum complications like hemorrhage, infection, and late-onset preeclampsia happen at home, often days after discharge, when nobody is watching.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Seren"],
    notes: "Late postpartum hemorrhage (24hrs-12wks), postpartum preeclampsia (up to 6 weeks), and postpartum cardiomyopathy are all detectable through continuous biometric monitoring. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Foundation",
  },

  // ═══════════════════════════════════════════
  // TIER 2 — SHOULD HAVE (4 features)
  // ═══════════════════════════════════════════
  {
    name: "Lactation Intelligence System",
    description: "Luna-powered breastfeeding support that goes far beyond feed tracking. Monitors feeding patterns, hydration through biometrics, caloric needs adjustment, supply indicators through feeding frequency and duration analysis, latch quality assessment through feeding session patterns, and mastitis/clog risk detection. Olive adjusts nutrition plans for milk production. Navi adjusts supplement protocols for lactation. Supports breast, bottle, combo, and formula feeding without judgment — the system meets her where she is. Includes partner feeding integration for shared feeding responsibility tracking.",
    userStory: "As a breastfeeding woman, I need intelligent support that helps me understand what's happening with my supply and my body, not just another feed tracker that makes me feel like I'm failing when the numbers don't look 'right.'",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Luna", "Olive", "Navi", "Kai"],
    notes: "Luna's primary domain. Breastfeeding problems are the #1 reason women stop before they wanted to. The judgment-free approach is critical — fed is best. Phase 2 deliverable.",
    tier: 2,
    phase: "Phase 2: Intelligence",
  },
  {
    name: "Postpartum Nutrition & Recovery Fuel",
    description: "Olive's meal plans adapted for postpartum recovery, healing, and optionally milk production. First 6 weeks: healing-focused nutrition (iron replenishment, protein for tissue repair, anti-inflammatory foods, hydration). Weeks 6-12: energy restoration, blood sugar stabilization for hormone recovery. 12+ weeks: return-to-baseline optimization. All personalized based on HER Halo Ring data, delivery type, and recovery trajectory. Navi adjusts supplement protocol weekly. Addresses the reality that postpartum women often forget to eat, eat whatever's fastest, and deprioritize their own nutrition.",
    userStory: "As a postpartum woman, I need nutrition guidance that accounts for the fact that I'm healing, possibly breastfeeding, definitely sleep-deprived, and have approximately 90 seconds to decide what to eat before someone needs me again.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Olive", "Navi", "Atlas", "Kai"],
    notes: "Must integrate with lactation system if breastfeeding. Food Train integration for community meal support. Phase 2 deliverable.",
    tier: 2,
    phase: "Phase 2: Intelligence",
  },
  {
    name: "Pelvic Floor Recovery Protocol",
    description: "Guided pelvic floor rehabilitation program personalized to delivery type and complications. Integrates with activity data from Halo Ring. Progressive exercise protocols with milestones. Tracks symptoms (incontinence, pain, pressure) and correlates with exercise compliance and recovery trajectory. OB/PT referral triggers when recovery isn't progressing. Includes diastasis recti assessment and monitoring. All content reviewed by pelvic floor physical therapists. Gentle, encouraging tone — this is a body that did something extraordinary.",
    userStory: "As a postpartum woman, I need structured guidance for pelvic floor recovery because nobody told me that the sneeze-and-pee thing doesn't have to be permanent, and I don't know what exercises to do or when it's safe to start.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "80% of postpartum women experience some pelvic floor dysfunction. Most are told it's 'normal' and never get rehab. Phase 2 deliverable.",
    tier: 2,
    phase: "Phase 2: Intelligence",
  },
  {
    name: "Seren Escalation Protocol",
    description: "Enhanced Seren capability for postpartum-specific mental health crises. Three-level response system: Level 1 (Seren self-manages) — mild mood disruption, adjustment challenges, normal grief/identity shifts. Level 2 (clinical referral recommended) — sustained depression/anxiety markers, intrusive thoughts about self-harm, severe sleep disruption beyond newborn-related. Level 3 (crisis protocol) — suicidal ideation, psychosis indicators, harm-to-infant risk signals. Each level has specific response scripts, resource provision, and follow-up protocols. Includes warm handoff to crisis resources, not just a hotline number. Coordinates with PPD Detection system for multi-signal validation.",
    userStory: "As a postpartum woman in crisis, I need the system to respond appropriately and connect me with real help, not just tell me to call a hotline and leave me alone.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Seren", "Kai", "Atlas"],
    notes: "Safety-critical feature. Requires clinical review of every escalation script. Must coordinate with PPD Detection (Tier 1). Legal review required. Phase 2 deliverable.",
    tier: 2,
    phase: "Phase 2: Intelligence",
  },

  // ═══════════════════════════════════════════
  // TIER 3 — NICE TO HAVE (5 features)
  // ═══════════════════════════════════════════
  {
    name: "Food Train System",
    description: "Community meal coordination that integrates with Olive's nutrition recommendations. Partner, family, and friends can sign up for meal delivery slots. The system suggests meals aligned with her recovery nutrition needs (without being prescriptive — any meal is better than no meal). Dietary restrictions and preferences shared with meal providers. Simple interface for the support network: 'She needs dinner Tuesday. Here are some ideas that would be especially helpful right now.' Reduces the invisible labor of asking for help.",
    userStory: "As a postpartum woman, I need help asking for help because everyone says 'let me know if you need anything' but I can't organize a meal train while bleeding into a diaper and breastfeeding every 2 hours.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Olive", "Kai"],
    notes: "High viral potential — every person who signs up for the food train sees the Conceivable brand. Phase 3 deliverable.",
    tier: 3,
    phase: "Phase 3: Community",
  },
  {
    name: "Voice-First Input System",
    description: "Voice-based check-ins and data entry for when hands are full (feeding, holding baby, pumping). Natural language processing for symptom reporting, mood check-ins, and food logging. 'Hey Kai, I'm feeling really overwhelmed today and I've barely eaten.' System extracts mood data, nutrition flag, and routes to appropriate responses. Integrates with all care team agents. Works offline and syncs when connected. Whisper-mode for middle-of-the-night check-ins.",
    userStory: "As a postpartum woman, I need to be able to interact with the app without putting down my baby because my hands are literally never free and typing a check-in while breastfeeding at 3am is not happening.",
    priority: "nice_to_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "All agents"],
    notes: "Significant engineering investment but massive UX improvement for the postpartum reality. Whisper-mode is a beautiful detail. Phase 3 deliverable.",
    tier: 3,
    phase: "Phase 3: Community",
  },
  {
    name: "Partner Dashboard",
    description: "Expanded partner access showing recovery progress, current needs, and actionable support suggestions. 'Her recovery score dropped today. She might need an extra hour of sleep — can you take the night feed?' Shows feeding schedule, next medication reminders, and appointment calendar. Does NOT share raw health data without explicit per-type permission. Education moments about postpartum recovery, PPD signs to watch for, and when to be concerned. Designed to make the partner a more effective support person without adding invisible labor for her.",
    userStory: "As the partner of a postpartum woman, I need to understand what's happening and what I can actually do to help because I want to support her but I don't know what she needs and I'm afraid to ask wrong.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Seren"],
    notes: "Extension of Pregnancy Partner Integration feature. Permission-gated. Phase 3 deliverable.",
    tier: 3,
    phase: "Phase 3: Community",
  },
  {
    name: "Return-to-Fertility Monitoring",
    description: "For women planning future pregnancies, seamlessly transitions from postpartum recovery monitoring back into fertility tracking when biometrics indicate hormonal recovery. Monitors cycle return, ovulation resumption, and hormonal normalization. Factors in breastfeeding impact on fertility return. Identifies optimal interpregnancy interval based on recovery data. Transitions her back to the Fertility experience with all postpartum and pregnancy data intact. The system remembers everything — she doesn't start from scratch.",
    userStory: "As a woman who wants another baby eventually, I need the system to tell me when my body is actually ready, not just when the calendar says it's been long enough, and I need it to remember everything about my first pregnancy.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Olive", "Navi"],
    notes: "Strategically critical for LTV — keeps users in the ecosystem. Patent 014 covers secondary infertility prevention. Phase 4 deliverable.",
    tier: 3,
    phase: "Phase 4: Lifecycle",
  },
  {
    name: "Secondary Infertility Prevention",
    description: "Uses pregnancy, delivery, and postpartum data to identify risk factors for secondary infertility before they become problems. Monitors thyroid function indicators, hormonal recovery patterns, nutritional status, stress markers, and pelvic floor recovery — all factors that contribute to secondary infertility. Proactive interventions through Olive (nutrition), Navi (supplements), and Kai (lifestyle guidance) to optimize recovery in ways that preserve future fertility. The system connects dots between postpartum recovery and future fertility that no individual provider would see.",
    userStory: "As a woman who wants more children, I need the system to protect my future fertility during recovery because secondary infertility affects 1 in 6 couples and most don't find out until they're already trying and failing.",
    priority: "nice_to_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Olive", "Navi"],
    notes: "Patent 014 specifically covers this. Powerful differentiator — nobody else connects postpartum recovery to future fertility optimization. Phase 4 deliverable.",
    tier: 3,
    phase: "Phase 4: Lifecycle",
  },
];

// IP Coverage mapping for the Postpartum experience
export const POSTPARTUM_IP_COVERAGE: { feature: string; patents: { number: string; name: string; id: string }[] }[] = [
  {
    feature: "Postpartum Recovery Score",
    patents: [
      { number: "001", name: "Conceivable Score", id: "draft-01" },
      { number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" },
    ]
  },
  {
    feature: "PPD & Anxiety Detection",
    patents: [
      { number: "012", name: "PPD Detection System", id: "patent-012" },
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
    ]
  },
  {
    feature: "Recovery Trajectory Engine",
    patents: [
      { number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" },
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  },
  {
    feature: "Vital Sign Monitoring",
    patents: [
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
      { number: "006", name: "Data Validation", id: "patent-006" },
    ]
  },
  {
    feature: "Lactation Intelligence",
    patents: [
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
    ]
  },
  {
    feature: "Postpartum Nutrition",
    patents: [
      { number: "003", name: "Cycle Recalibration", id: "draft-03" },
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  },
  {
    feature: "Pelvic Floor Recovery",
    patents: [
      { number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" },
    ]
  },
  {
    feature: "Seren Escalation Protocol",
    patents: [
      { number: "012", name: "PPD Detection System", id: "patent-012" },
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
    ]
  },
  {
    feature: "Food Train System",
    patents: [] // Community feature — no direct patent coverage
  },
  {
    feature: "Voice-First Input",
    patents: [] // UX innovation — potential new patent opportunity
  },
  {
    feature: "Partner Dashboard",
    patents: [] // Extension of pregnancy partner feature — new patent opportunity
  },
  {
    feature: "Return-to-Fertility Monitoring",
    patents: [
      { number: "014", name: "Secondary Infertility Prevention", id: "patent-014" },
      { number: "010", name: "Temporal Calibration", id: "patent-009" },
    ]
  },
  {
    feature: "Secondary Infertility Prevention",
    patents: [
      { number: "014", name: "Secondary Infertility Prevention", id: "patent-014" },
      { number: "001", name: "Conceivable Score", id: "draft-01" },
    ]
  },
];

export const POSTPARTUM_DESCRIPTION = "The postpartum experience provides continuous AI-powered recovery monitoring from delivery through the fourth trimester and beyond, integrating pregnancy data with real-time postpartum biometrics and expanded multi-specialist care coordination including Luna (Lactation & Postpartum Recovery Specialist). It replaces the broken model of a single 6-week postpartum checkup with zero monitoring in between. The system catches postpartum depression before it becomes severe, tracks recovery trajectories personalized to each woman's delivery and history, monitors vital signs for complications that happen at home, and provides lactation intelligence that goes far beyond feed tracking. She doesn't download a new app — the system she already trusts simply evolves with her.";

export const POSTPARTUM_PERSONA = "A woman in the first year after delivery who needs continuous, intelligent monitoring and support from the moment she leaves the hospital. She's exhausted, overwhelmed, possibly in pain, definitely under-supported by the medical system. She's been failed by the 6-week checkup model that asks 'how are you feeling?' and accepts 'fine' as an answer. She wants to feel watched over — not surveilled, but genuinely cared for. If she came through Conceivable's pregnancy experience, the transition is seamless. If she's new, she found us because nobody else was paying attention to HER recovery while everyone asked about the baby.";

// Care team configuration for Postpartum experience
export const POSTPARTUM_CARE_TEAM = [
  {
    name: "Kai",
    role: "AI Health Coach",
    color: "#5A6FFF",
    description: "Primary guide through postpartum recovery. Coordinates care team responses, provides daily check-ins, and translates biometric data into actionable guidance.",
  },
  {
    name: "Luna",
    role: "Lactation & Postpartum Recovery Specialist",
    color: "#7CAE7A",
    description: "NEW agent for postpartum. Provides evidence-based lactation support, breastfeeding troubleshooting, supply optimization, and postpartum-specific recovery guidance. Judgment-free — supports breast, bottle, combo, and formula feeding.",
  },
  {
    name: "Seren",
    role: "Emotional Wellness Guide",
    color: "#E37FB1",
    description: "Expanded role in postpartum. Passive mental health monitoring, PPD/PPA detection, crisis escalation protocols, and emotional support during the identity transformation of new motherhood.",
  },
  {
    name: "Atlas",
    role: "Biometric Intelligence Engine",
    color: "#356FB6",
    description: "Processes Halo Ring data for recovery tracking, vital sign monitoring, sleep analysis that separates voluntary from involuntary disruption, and hemorrhage/infection risk detection.",
  },
  {
    name: "Olive",
    role: "Nutrition & Supplement Guide",
    color: "#1EAA55",
    description: "Postpartum nutrition plans for recovery, healing, and optionally milk production. Adapts for the reality that postpartum women have 90 seconds to decide what to eat.",
  },
  {
    name: "Navi",
    role: "Supplement Protocol Manager",
    color: "#F1C028",
    description: "Weekly supplement protocol adjustments for postpartum recovery, iron replenishment, and lactation support.",
  },
  {
    name: "Zhen",
    role: "Eastern Medicine & Acupuncture Guide",
    color: "#9686B9",
    description: "TCM support for postpartum recovery, milk production, hormone balancing, and the traditional 'sitting month' wisdom integrated with modern evidence.",
  },
];
