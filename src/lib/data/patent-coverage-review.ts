// Patent Coverage Review — Retroactive scan across ALL experiences
// Generated for Kirsten's review. IP protection is time-sensitive.

export interface PatentCoverageEntry {
  experience: string;
  experienceColor: string;
  feature: string;
  coveredBy: { number: string; name: string; id: string }[];
  gapStatus: "covered" | "partial" | "gap";
  recommendation?: string;
  novelty?: string;
  priority?: "Critical" | "High" | "Medium" | "Low";
}

export interface RecommendedPatent {
  number: string;
  name: string;
  description: string;
  coversFeatures: string[];
  experience: string;
  priority: "Critical" | "High" | "Medium";
  defensibility: string;
}

// ═══════════════════════════════════════════════════
// EXISTING PATENTS (001-020)
// ═══════════════════════════════════════════════════

export const EXISTING_PATENTS = [
  { number: "001", name: "Conceivable Score", id: "draft-01", experience: "Fertility" },
  { number: "002", name: "AI Care Team Architecture", id: "draft-02", experience: "Fertility" },
  { number: "003", name: "Cycle Intelligence Engine", id: "draft-03", experience: "Fertility" },
  { number: "004", name: "Root Cause Resolution", id: "draft-04", experience: "Fertility" },
  { number: "005", name: "Supplement Personalization", id: "draft-05", experience: "Fertility" },
  { number: "006", name: "Halo Ring Integration", id: "draft-06", experience: "Fertility" },
  { number: "007", name: "Cross-Department Intelligence", id: "draft-07", experience: "Platform" },
  { number: "008", name: "Pregnancy Transition Engine", id: "patent-008", experience: "Pregnancy" },
  { number: "009", name: "Gestational Wellness Scoring", id: "patent-009", experience: "Pregnancy" },
  { number: "010", name: "Trimester-Adaptive Care", id: "patent-010", experience: "Pregnancy" },
  { number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011", experience: "Pregnancy" },
  { number: "012", name: "PPD Detection System", id: "patent-012", experience: "Postpartum" },
  { number: "013", name: "Recovery Trajectory Modeling", id: "patent-013", experience: "Postpartum" },
  { number: "014", name: "Secondary Infertility Prevention", id: "patent-014", experience: "Postpartum" },
  { number: "015", name: "Period Root Cause Resolution", id: "patent-015", experience: "Periods" },
  { number: "016", name: "Cycle-Synced Optimization", id: "patent-016", experience: "Periods" },
  { number: "017", name: "Condition Detection Engine", id: "patent-017", experience: "Periods" },
  { number: "018", name: "First Period Predictor", id: "patent-018", experience: "First Period" },
  { number: "019", name: "Age-Adaptive Care Team", id: "patent-019", experience: "First Period" },
  { number: "020", name: "Lifetime Data Architecture", id: "patent-020", experience: "First Period" },
];

// ═══════════════════════════════════════════════════
// COVERAGE REVIEW — ALL FEATURES, ALL EXPERIENCES
// ═══════════════════════════════════════════════════

export const PATENT_COVERAGE_REVIEW: PatentCoverageEntry[] = [
  // ── FIRST PERIOD (12 features) ──
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "First Period Predictor", coveredBy: [{ number: "018", name: "First Period Predictor", id: "patent-018" }], gapStatus: "covered" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Body Decoder", coveredBy: [{ number: "018", name: "First Period Predictor", id: "patent-018" }], gapStatus: "partial", recommendation: "Body Decoder's progress-tracking framing ('Your body is X% ready') and developmental marker visualization are novel — consider expanding Patent 018 or filing separate", novelty: "Visual developmental progress mapping for minors", priority: "Medium" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Period Prep Tracker", coveredBy: [{ number: "001", name: "Conceivable Score", id: "draft-01" }, { number: "019", name: "Age-Adaptive Care Team", id: "patent-019" }], gapStatus: "covered" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Period Education Hub", coveredBy: [], gapStatus: "gap", recommendation: "Age-tiered health education delivery system with AI-triggered contextual learning is novel — the system that decides WHAT to teach WHEN based on user age, questions, and life circumstances", novelty: "AI-driven contextual health education for minors", priority: "High" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Seren's Safe Space", coveredBy: [{ number: "019", name: "Age-Adaptive Care Team", id: "patent-019" }], gapStatus: "partial", recommendation: "Crisis detection and escalation for minors (abuse, self-harm, eating disorders) combined with age-adaptive emotional support is highly novel — consider separate filing", novelty: "AI minor safety detection + age-adaptive emotional support", priority: "Critical" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Body Positivity Curriculum", coveredBy: [], gapStatus: "gap", recommendation: "Not independently patentable — methodology too broad. Covered by overall platform approach.", priority: "Low" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "The Achievement System", coveredBy: [], gapStatus: "gap", recommendation: "Visual journey progression system (non-numerical) for health behavior reinforcement in minors — potentially patentable as part of engagement system", novelty: "Non-gamification health progress visualization", priority: "Low" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Parent/Guardian Bridge", coveredBy: [], gapStatus: "gap", recommendation: "Minor-controlled parent communication system with age-appropriate information gating is novel. File new patent.", novelty: "Child-controlled parent health information bridge", priority: "High" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Period Poverty Resources", coveredBy: [], gapStatus: "gap", recommendation: "Location-based resource finding (Navi) may be covered under platform architecture. Supply program is business model, not patentable.", priority: "Low" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Period Stories", coveredBy: [], gapStatus: "gap", recommendation: "Content, not method — not patentable. Copyright protection applies.", priority: "Low" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "First Period Celebration Kit", coveredBy: [{ number: "019", name: "Age-Adaptive Care Team", id: "patent-019" }], gapStatus: "partial", recommendation: "Experience transition triggered by biological event (menarche) with personalized graduation ceremony — novel as part of lifecycle system", priority: "Medium" },
  { experience: "First Period", experienceColor: "#F4A7B9", feature: "Community Features", coveredBy: [], gapStatus: "gap", recommendation: "AI-moderated minor community with age-gated content — potentially patentable safety system, but complex IP landscape. Evaluate after build.", priority: "Medium" },

  // ── PERIODS (12 features) ──
  { experience: "Periods", experienceColor: "#E24D47", feature: "Period Health Score", coveredBy: [{ number: "001", name: "Conceivable Score", id: "draft-01" }, { number: "015", name: "Period Root Cause Resolution", id: "patent-015" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Cycle Intelligence Dashboard", coveredBy: [{ number: "003", name: "Cycle Intelligence Engine", id: "draft-03" }, { number: "016", name: "Cycle-Synced Optimization", id: "patent-016" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Root Cause Analysis Engine", coveredBy: [{ number: "015", name: "Period Root Cause Resolution", id: "patent-015" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Cycle-Synced Optimization", coveredBy: [{ number: "016", name: "Cycle-Synced Optimization", id: "patent-016" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Condition Detection Engine", coveredBy: [{ number: "017", name: "Condition Detection Engine", id: "patent-017" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Smart Symptom Tracker", coveredBy: [{ number: "003", name: "Cycle Intelligence Engine", id: "draft-03" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Personalized Supplement Engine", coveredBy: [{ number: "005", name: "Supplement Personalization", id: "draft-05" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Halo Ring Integration", coveredBy: [{ number: "006", name: "Halo Ring Integration", id: "draft-06" }], gapStatus: "covered" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "OB/GYN Bridge Reports", coveredBy: [], gapStatus: "gap", recommendation: "AI-generated practitioner reports from menstrual cycle data — novel output format. Consider filing.", novelty: "AI-generated menstrual health practitioner reports", priority: "Medium" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Community & Support", coveredBy: [], gapStatus: "gap", recommendation: "Community platform — not patentable as method. Focus on moderation system.", priority: "Low" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Education Library", coveredBy: [], gapStatus: "gap", recommendation: "Content, not method — copyright applies.", priority: "Low" },
  { experience: "Periods", experienceColor: "#E24D47", feature: "Multi-Language Support", coveredBy: [], gapStatus: "gap", recommendation: "Translation system (Zhen) covered under platform architecture patent 002.", priority: "Low" },

  // ── PREGNANCY (11 features) ──
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Pregnancy Wellness Score", coveredBy: [{ number: "009", name: "Gestational Wellness Scoring", id: "patent-009" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Continuous GDM Screening", coveredBy: [{ number: "009", name: "Gestational Wellness Scoring", id: "patent-009" }, { number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "First Trimester Guardian", coveredBy: [{ number: "010", name: "Trimester-Adaptive Care", id: "patent-010" }, { number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "OB Bridge Reports", coveredBy: [{ number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Preeclampsia Early Warning", coveredBy: [{ number: "009", name: "Gestational Wellness Scoring", id: "patent-009" }, { number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Perinatal Mental Health Monitor", coveredBy: [{ number: "011", name: "Continuous Pregnancy Monitoring", id: "patent-011" }], gapStatus: "partial", recommendation: "The pregnancy-to-postpartum mental health continuity (Edinburgh scale baseline → PPD monitoring) is novel as a continuous system. Partially covered by 011 and 012.", priority: "Medium" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Trimester-Adaptive Nutrition", coveredBy: [{ number: "010", name: "Trimester-Adaptive Care", id: "patent-010" }], gapStatus: "covered" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Birth Preferences Builder", coveredBy: [], gapStatus: "gap", recommendation: "AI-assisted birth plan generation from health data — potentially novel but low competitive defensibility", priority: "Low" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Pregnancy Community", coveredBy: [], gapStatus: "gap", recommendation: "Community platform — not patentable", priority: "Low" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Partner Dashboard", coveredBy: [], gapStatus: "gap", recommendation: "Partner health information bridge — similar concept to Parent/Guardian Bridge. Consider combined filing.", novelty: "Relationship-based health information sharing with consent controls", priority: "Medium" },
  { experience: "Pregnancy", experienceColor: "#D4A843", feature: "Postpartum Preparation Timeline", coveredBy: [{ number: "008", name: "Pregnancy Transition Engine", id: "patent-008" }], gapStatus: "covered" },

  // ── POSTPARTUM (13 features) ──
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Postpartum Recovery Score", coveredBy: [{ number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" }], gapStatus: "covered" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "PPD Detection & Escalation", coveredBy: [{ number: "012", name: "PPD Detection System", id: "patent-012" }], gapStatus: "covered" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Lactation Intelligence", coveredBy: [], gapStatus: "gap", recommendation: "AI-driven lactation support with troubleshooting and supply prediction is novel. Luna agent's capabilities warrant separate filing.", novelty: "AI lactation support with predictive supply modeling", priority: "High" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Recovery Trajectory Tracking", coveredBy: [{ number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" }], gapStatus: "covered" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Postpartum Nutrition Engine", coveredBy: [{ number: "005", name: "Supplement Personalization", id: "draft-05" }], gapStatus: "partial", recommendation: "Lactation-specific nutrition optimization is a novel extension of supplement personalization. Consider expanding Patent 005.", priority: "Medium" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Pelvic Floor Protocol", coveredBy: [], gapStatus: "gap", recommendation: "AI-guided pelvic floor rehabilitation with progress tracking — potentially novel method", novelty: "AI-adaptive pelvic floor rehabilitation protocol", priority: "Medium" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Sleep Architecture Recovery", coveredBy: [], gapStatus: "gap", recommendation: "Sleep optimization within newborn reality constraints — novel approach but difficult to patent method. Consider as part of recovery trajectory.", priority: "Low" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Food Train Coordinator", coveredBy: [], gapStatus: "gap", recommendation: "Community meal coordination — not patentable as method", priority: "Low" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Voice-First Input", coveredBy: [], gapStatus: "gap", recommendation: "Voice-first health tracking for one-handed operation — potentially novel UX patent", novelty: "Voice-first maternal health data entry system", priority: "Medium" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Return to Fertility Monitor", coveredBy: [{ number: "014", name: "Secondary Infertility Prevention", id: "patent-014" }], gapStatus: "covered" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Partner Dashboard", coveredBy: [], gapStatus: "gap", recommendation: "See Pregnancy Partner Dashboard — combine into single filing", priority: "Medium" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "Crisis Response Protocol", coveredBy: [{ number: "012", name: "PPD Detection System", id: "patent-012" }], gapStatus: "covered" },
  { experience: "Postpartum", experienceColor: "#7CAE7A", feature: "4-Phase Recovery Framework", coveredBy: [{ number: "013", name: "Recovery Trajectory Modeling", id: "patent-013" }], gapStatus: "covered" },
];

// ═══════════════════════════════════════════════════
// RECOMMENDED NEW PATENT FILINGS
// ═══════════════════════════════════════════════════

export const RECOMMENDED_NEW_PATENTS: RecommendedPatent[] = [
  {
    number: "021",
    name: "AI Minor Safety Detection & Emotional Support System",
    description: "System for detecting abuse, self-harm, eating disorders, and mental health crises in minor users through AI conversation analysis, combined with age-adaptive emotional support and mandatory escalation protocols. Distinct from general content moderation — this is a health-focused safety system for vulnerable users.",
    coversFeatures: ["Seren's Safe Space", "Community Features", "Child Safety & Moderation System"],
    experience: "First Period + Platform",
    priority: "Critical",
    defensibility: "Extremely high — no competitor has an AI system specifically designed for minor emotional health safety in a menstrual health context. First-mover advantage is significant.",
  },
  {
    number: "022",
    name: "AI-Triggered Contextual Health Education for Minors",
    description: "System that determines appropriate health education content based on user age, developmental stage, questions asked, and life circumstances. Delivers body autonomy, consent, reproductive health, and relationship education through conversational AI agents that adapt in real-time.",
    coversFeatures: ["Period Education Hub", "Your Body Your Rules curriculum", "Growing Up Is Hard support"],
    experience: "First Period",
    priority: "High",
    defensibility: "High — the combination of AI-driven content selection with age-adaptive delivery for health education is novel. Competitors use static content libraries.",
  },
  {
    number: "023",
    name: "Child-Controlled Parent Health Information Bridge",
    description: "System enabling minor users to control what health information is shared with parents/guardians, with age-appropriate summaries, conversation starters, and guidance for adults. Minor retains complete control. System never assumes family structure.",
    coversFeatures: ["Parent/Guardian Bridge", "Partner Dashboard (Pregnancy)", "Partner Dashboard (Postpartum)"],
    experience: "First Period + Pregnancy + Postpartum",
    priority: "High",
    defensibility: "High — novel approach to child-controlled health data sharing. Extends to partner information sharing across lifecycle.",
  },
  {
    number: "024",
    name: "AI Lactation Support with Predictive Supply Modeling",
    description: "System combining AI-driven lactation troubleshooting, predictive milk supply modeling from biometric and behavioral data, and personalized feeding plan optimization. Includes integration with postpartum recovery scoring.",
    coversFeatures: ["Lactation Intelligence"],
    experience: "Postpartum",
    priority: "High",
    defensibility: "High — no existing patent covers AI-driven lactation support with predictive modeling. Growing market as maternal health technology expands.",
  },
  {
    number: "025",
    name: "Voice-First Maternal Health Data Entry System",
    description: "System optimized for one-handed, voice-first health data input for postpartum users. Includes context-aware prompting, ambient data collection, and integration with maternal health scoring systems.",
    coversFeatures: ["Voice-First Input"],
    experience: "Postpartum",
    priority: "Medium",
    defensibility: "Medium — voice input is common but the maternal health-specific optimization and context-aware prompting add novelty.",
  },
];

// ═══════════════════════════════════════════════════
// SUMMARY STATS
// ═══════════════════════════════════════════════════

export const PATENT_REVIEW_SUMMARY = {
  totalFeatures: 48,
  covered: 26,
  partial: 5,
  gaps: 17,
  existingPatents: 20,
  recommendedNew: 5,
  criticalGaps: 1,
  highPriorityGaps: 3,
  lastReviewDate: "2026-03-12",
  reviewNote: "IP protection is time-sensitive. Critical and High priority filings should be initiated immediately. Patent 021 (Minor Safety) is the highest priority — this is a first-mover advantage that erodes with each competitor who enters the minor health tech space.",
};
