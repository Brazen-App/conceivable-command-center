// ── Product Development Data ──
// Types and mock data for the 10 product verticals

export type VerticalId =
  | "pre-period"
  | "period-problems"
  | "pcos"
  | "endometriosis"
  | "infertility"
  | "pregnancy"
  | "postpartum"
  | "perimenopause"
  | "menopause"
  | "post-menopause";

export type VerticalStatus = "active" | "research" | "planned" | "future";

export type FeaturePriority = "critical" | "high" | "medium" | "low";
export type FeatureComplexity = "small" | "medium" | "large" | "epic";
export type FeatureStatus =
  | "idea"
  | "researching"
  | "defined"
  | "ready"
  | "in_engineering"
  | "shipped";

export interface Vertical {
  id: VerticalId;
  name: string;
  description: string;
  emoji: string;
  status: VerticalStatus;
  color: string;
  featureCount: number;
  researchCount: number;
  readinessScore: number;
  keyInsight: string;
}

export interface ResearchItem {
  id: string;
  verticalId: VerticalId;
  title: string;
  url: string;
  source: string;
  type: "paper" | "article" | "competitor" | "user_feedback" | "market_data";
  notes: string;
  addedAt: string;
  tags: string[];
}

export interface Feature {
  id: string;
  verticalId: VerticalId;
  title: string;
  userStory: string;
  priority: FeaturePriority;
  complexity: FeatureComplexity;
  status: FeatureStatus;
  crossVerticalIds: VerticalId[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorEntry {
  id: string;
  verticalId: VerticalId;
  competitor: string;
  feature: string;
  strength: "strong" | "moderate" | "weak";
  notes: string;
  opportunity: string;
}

export interface UserInsight {
  id: string;
  verticalId: VerticalId;
  source: "community" | "interview" | "survey" | "support";
  quote: string;
  theme: string;
  impactScore: number;
  addedAt: string;
}

export interface ReadinessCheckItem {
  id: string;
  verticalId: VerticalId;
  label: string;
  checked: boolean;
  category: "research" | "design" | "clinical" | "compliance" | "engineering";
}

export interface CrossVerticalConnection {
  fromVerticalId: VerticalId;
  toVerticalId: VerticalId;
  sharedFeatures: string[];
  strength: number;
  type: "shared_feature" | "data_dependency" | "clinical_pathway";
  description: string;
}

// ── Vertical color mapping ──
export const VERTICAL_COLORS: Record<VerticalId, string> = {
  "pre-period": "#ACB7FF",
  "period-problems": "#E37FB1",
  "pcos": "#9686B9",
  "endometriosis": "#E24D47",
  "infertility": "#5A6FFF",
  "pregnancy": "#1EAA55",
  "postpartum": "#78C3BF",
  "perimenopause": "#F1C028",
  "menopause": "#356FB6",
  "post-menopause": "#D4649A",
};

export const FEATURE_STATUS_CONFIG: Record<
  FeatureStatus,
  { label: string; color: string }
> = {
  idea: { label: "Idea", color: "#ACB7FF" },
  researching: { label: "Researching", color: "#9686B9" },
  defined: { label: "Defined", color: "#F1C028" },
  ready: { label: "Ready", color: "#1EAA55" },
  in_engineering: { label: "In Engineering", color: "#5A6FFF" },
  shipped: { label: "Shipped", color: "#78C3BF" },
};

export const PRIORITY_CONFIG: Record<
  FeaturePriority,
  { label: string; color: string }
> = {
  critical: { label: "Critical", color: "#E24D47" },
  high: { label: "High", color: "#F1C028" },
  medium: { label: "Medium", color: "#5A6FFF" },
  low: { label: "Low", color: "var(--muted)" },
};

export const COMPLEXITY_CONFIG: Record<
  FeatureComplexity,
  { label: string; points: string }
> = {
  small: { label: "Small", points: "1-3" },
  medium: { label: "Medium", points: "5-8" },
  large: { label: "Large", points: "13-21" },
  epic: { label: "Epic", points: "34+" },
};

// ── Mock Data ──

export const VERTICALS: Vertical[] = [
  {
    id: "pre-period",
    name: "Pre-Period",
    description:
      "Young women preparing for their first period. Education, body literacy, and early cycle awareness.",
    emoji: "🌱",
    status: "future",
    color: VERTICAL_COLORS["pre-period"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight: "Massive underserved market — no good apps exist for this age group.",
  },
  {
    id: "period-problems",
    name: "Period Problems",
    description:
      "Heavy periods, painful cramps, irregular cycles. Root-cause approach vs. symptom management.",
    emoji: "🩸",
    status: "planned",
    color: VERTICAL_COLORS["period-problems"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "68% of women with period problems are told 'it's normal' — our data says otherwise.",
  },
  {
    id: "pcos",
    name: "PCOS",
    description:
      "Polycystic ovary syndrome — metabolic, hormonal, and inflammatory root causes. Lifestyle-first interventions.",
    emoji: "⚡",
    status: "planned",
    color: VERTICAL_COLORS["pcos"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "PCOS affects 1 in 10 women. Personalized metabolic + hormonal tracking = massive differentiator.",
  },
  {
    id: "endometriosis",
    name: "Endometriosis",
    description:
      "Endometriosis detection, management, and fertility impact. Pain tracking, inflammation markers.",
    emoji: "🔥",
    status: "future",
    color: VERTICAL_COLORS["endometriosis"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "Average 7-year diagnosis delay. AI-powered symptom pattern recognition could cut this dramatically.",
  },
  {
    id: "infertility",
    name: "Infertility",
    description:
      "Active fertility journey — the core Conceivable product. 50-factor model, Halo Ring, AI coaching.",
    emoji: "🎯",
    status: "active",
    color: VERTICAL_COLORS["infertility"],
    featureCount: 12,
    researchCount: 8,
    readinessScore: 72,
    keyInsight:
      "Our 50-factor model and Halo Ring integration create a moat no competitor can match.",
  },
  {
    id: "pregnancy",
    name: "Pregnancy",
    description:
      "Pregnancy monitoring and support. Continuation of preconception data for better outcomes.",
    emoji: "🤰",
    status: "research",
    color: VERTICAL_COLORS["pregnancy"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "Preconception data continuity into pregnancy = unique value prop. No one else has this.",
  },
  {
    id: "postpartum",
    name: "Postpartum",
    description:
      "Postpartum recovery tracking. Hormonal recovery, sleep, mood, and return to baseline.",
    emoji: "👶",
    status: "future",
    color: VERTICAL_COLORS["postpartum"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "Postpartum care gap is enormous. Our wearable data can detect recovery trajectory.",
  },
  {
    id: "perimenopause",
    name: "Perimenopause",
    description:
      "Early hormonal transition. Symptom tracking, HRT readiness, metabolic shift management.",
    emoji: "🌊",
    status: "planned",
    color: VERTICAL_COLORS["perimenopause"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "Perimenopause starts earlier than most think. Same bio-tracking applies, different algorithms.",
  },
  {
    id: "menopause",
    name: "Menopause",
    description:
      "Full menopause management. Hot flash tracking, bone density, cardiovascular risk, cognitive health.",
    emoji: "🌙",
    status: "future",
    color: VERTICAL_COLORS["menopause"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "$600B menopause market by 2025. Wearable + AI coaching = perfect product-market fit.",
  },
  {
    id: "post-menopause",
    name: "Post-Menopause",
    description:
      "Long-term health optimization post-menopause. Longevity, bone health, heart health, cognitive vitality.",
    emoji: "✨",
    status: "future",
    color: VERTICAL_COLORS["post-menopause"],
    featureCount: 0,
    researchCount: 0,
    readinessScore: 0,
    keyInsight:
      "Women live 30+ years post-menopause. Lifetime health data creates unprecedented longitudinal insights.",
  },
];

// ── Research Items (populated for Infertility) ──
export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "res-1",
    verticalId: "infertility",
    title: "Impact of sleep quality on IVF outcomes: a systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/example1",
    source: "PubMed",
    type: "paper",
    notes:
      "Strong correlation between sleep quality scores and embryo quality. Supports our sleep tracking feature.",
    addedAt: "2025-01-15T10:00:00Z",
    tags: ["sleep", "IVF", "embryo quality", "systematic review"],
  },
  {
    id: "res-2",
    verticalId: "infertility",
    title: "Glucose variability and fertility: a prospective cohort study",
    url: "https://pubmed.ncbi.nlm.nih.gov/example2",
    source: "PubMed",
    type: "paper",
    notes:
      "CGM data shows glucose variability (not just fasting glucose) predicts cycle regularity. Validates our metabolic module.",
    addedAt: "2025-01-20T14:00:00Z",
    tags: ["glucose", "metabolic", "CGM", "cycle regularity"],
  },
  {
    id: "res-3",
    verticalId: "infertility",
    title: "Ava Fertility Tracker market positioning analysis",
    url: "https://example.com/ava-analysis",
    source: "Internal Research",
    type: "competitor",
    notes:
      "Ava tracks 5 parameters. We track 50+. Their ML model is basic compared to our causal chain approach.",
    addedAt: "2025-02-01T09:00:00Z",
    tags: ["competitor", "Ava", "wearable", "positioning"],
  },
  {
    id: "res-4",
    verticalId: "infertility",
    title: "Community member feedback: most requested features (Q4 survey)",
    url: "",
    source: "Circle Community",
    type: "user_feedback",
    notes:
      "Top 3: (1) Partner dashboard, (2) Supplement tracking with evidence ratings, (3) Cycle prediction confidence scores.",
    addedAt: "2025-02-05T16:00:00Z",
    tags: ["community", "feature requests", "survey", "Q4"],
  },
  {
    id: "res-5",
    verticalId: "infertility",
    title: "HRV as a predictor of ovulation: wearable validation study",
    url: "https://pubmed.ncbi.nlm.nih.gov/example3",
    source: "PubMed",
    type: "paper",
    notes:
      "HRV-based ovulation detection achieves 89% accuracy in this study. Our Halo Ring gives us continuous HRV.",
    addedAt: "2025-02-10T11:00:00Z",
    tags: ["HRV", "ovulation", "wearable", "Halo Ring"],
  },
  {
    id: "res-6",
    verticalId: "infertility",
    title: "Fertility app market size 2024-2030",
    url: "https://example.com/market-report",
    source: "Grand View Research",
    type: "market_data",
    notes:
      "Market projected at $3.4B by 2030, 12.8% CAGR. Wearable-integrated solutions growing fastest.",
    addedAt: "2025-02-12T08:00:00Z",
    tags: ["market", "TAM", "growth", "wearables"],
  },
  {
    id: "res-7",
    verticalId: "infertility",
    title: "Stress biomarkers and time-to-pregnancy: cortisol awakening response",
    url: "https://pubmed.ncbi.nlm.nih.gov/example4",
    source: "PubMed",
    type: "paper",
    notes:
      "Women in highest cortisol quartile had 29% longer TTP. Wearable stress tracking adds clinical value.",
    addedAt: "2025-02-15T13:00:00Z",
    tags: ["stress", "cortisol", "TTP", "biomarkers"],
  },
  {
    id: "res-8",
    verticalId: "infertility",
    title: "Natural Cycles FDA clearance: lessons for our regulatory strategy",
    url: "https://example.com/nc-fda",
    source: "FDA.gov",
    type: "article",
    notes:
      "Natural Cycles got De Novo classification. We should pursue 510(k) with predicate. Talk to regulatory counsel.",
    addedAt: "2025-02-18T10:00:00Z",
    tags: ["regulatory", "FDA", "Natural Cycles", "510k"],
  },
];

// ── Features (populated for Infertility) ──
export const FEATURES: Feature[] = [
  {
    id: "feat-1",
    verticalId: "infertility",
    title: "Halo Ring Real-Time Sync",
    userStory:
      "As a user, I want my Halo Ring data to sync automatically so I can see my biometrics without manual entry.",
    priority: "critical",
    complexity: "large",
    status: "in_engineering",
    crossVerticalIds: ["pregnancy", "perimenopause"],
    notes: "BLE integration. SDK from manufacturer. 15-minute sync intervals.",
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "feat-2",
    verticalId: "infertility",
    title: "50-Factor Dashboard",
    userStory:
      "As a user, I want to see all 50 fertility factors in one view so I understand my complete fertility picture.",
    priority: "critical",
    complexity: "epic",
    status: "defined",
    crossVerticalIds: [],
    notes:
      "Core differentiator. Must show connections between factors. Interactive graph visualization.",
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-02-18T10:00:00Z",
  },
  {
    id: "feat-3",
    verticalId: "infertility",
    title: "AI Coaching Chat (Kai)",
    userStory:
      "As a user, I want to chat with Kai about my fertility data so I get personalized, evidence-based guidance.",
    priority: "critical",
    complexity: "epic",
    status: "researching",
    crossVerticalIds: ["pcos", "pregnancy", "perimenopause", "menopause"],
    notes:
      "RAG pipeline with clinical evidence. Must pass compliance review. Warm, empathetic tone per brand.",
    createdAt: "2025-01-08T10:00:00Z",
    updatedAt: "2025-02-22T10:00:00Z",
  },
  {
    id: "feat-4",
    verticalId: "infertility",
    title: "Cycle Prediction with Confidence Scores",
    userStory:
      "As a user, I want to know when my next cycle will start with a confidence percentage so I can plan accordingly.",
    priority: "high",
    complexity: "large",
    status: "defined",
    crossVerticalIds: ["period-problems", "pcos"],
    notes:
      "ML model using HRV + temp + historical data. Show confidence band, not just a single date.",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "feat-5",
    verticalId: "infertility",
    title: "Partner Dashboard",
    userStory:
      "As a partner, I want a simplified view of my partner's fertility journey so I can be supportive and informed.",
    priority: "high",
    complexity: "medium",
    status: "idea",
    crossVerticalIds: ["pregnancy"],
    notes:
      "Top community request. Show simplified metrics, action items for partner, emotional support prompts.",
    createdAt: "2025-02-05T10:00:00Z",
    updatedAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "feat-6",
    verticalId: "infertility",
    title: "Supplement Evidence Tracker",
    userStory:
      "As a user, I want to track my supplements and see the scientific evidence behind each one so I make informed choices.",
    priority: "medium",
    complexity: "medium",
    status: "researching",
    crossVerticalIds: ["pcos", "endometriosis", "perimenopause"],
    notes:
      "Evidence rating system (A/B/C). Integration with our clinical database. Interaction warnings.",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "feat-7",
    verticalId: "infertility",
    title: "Ovulation Detection (HRV-Based)",
    userStory:
      "As a user, I want the app to detect my ovulation using my Halo Ring data so I know my fertile window accurately.",
    priority: "critical",
    complexity: "large",
    status: "ready",
    crossVerticalIds: ["period-problems"],
    notes:
      "89% accuracy based on literature. Our continuous HRV + temp gives us better signal than competitors.",
    createdAt: "2025-01-12T10:00:00Z",
    updatedAt: "2025-02-25T10:00:00Z",
  },
  {
    id: "feat-8",
    verticalId: "infertility",
    title: "Stress & Cortisol Insights",
    userStory:
      "As a user, I want to understand how my stress levels affect my fertility so I can take action to reduce stress.",
    priority: "high",
    complexity: "medium",
    status: "idea",
    crossVerticalIds: ["pcos", "perimenopause"],
    notes:
      "HRV-derived stress score. Correlate with cycle data. Suggest interventions (breathing, sleep hygiene).",
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "feat-9",
    verticalId: "infertility",
    title: "Glucose Variability Module",
    userStory:
      "As a user, I want to track my blood sugar patterns and see how they connect to my cycle so I can optimize my metabolic health.",
    priority: "high",
    complexity: "large",
    status: "researching",
    crossVerticalIds: ["pcos", "pregnancy", "perimenopause"],
    notes:
      "Partner with CGM provider or use meal logging + wearable proxy. Show glucose-cycle correlation.",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-02-22T10:00:00Z",
  },
  {
    id: "feat-10",
    verticalId: "infertility",
    title: "Community Integration",
    userStory:
      "As a user, I want to connect with other women on similar journeys inside the app so I feel supported.",
    priority: "medium",
    complexity: "medium",
    status: "defined",
    crossVerticalIds: [],
    notes:
      "Circle SSO integration. Show relevant community posts based on user's vertical and stage.",
    createdAt: "2025-02-08T10:00:00Z",
    updatedAt: "2025-02-20T10:00:00Z",
  },
  {
    id: "feat-11",
    verticalId: "infertility",
    title: "Clinical Report Export",
    userStory:
      "As a user, I want to export a clinical report I can share with my doctor so they understand my full picture.",
    priority: "medium",
    complexity: "small",
    status: "idea",
    crossVerticalIds: ["pcos", "endometriosis", "pregnancy"],
    notes:
      "PDF export with key metrics, trends, and AI insights. HIPAA-compliant format. Doctor-friendly language.",
    createdAt: "2025-02-15T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "feat-12",
    verticalId: "infertility",
    title: "Onboarding Flow (50-Factor Assessment)",
    userStory:
      "As a new user, I want a guided assessment that establishes my baseline across all 50 factors so I get personalized insights from day one.",
    priority: "critical",
    complexity: "large",
    status: "defined",
    crossVerticalIds: [],
    notes:
      "Smart questionnaire — branch based on answers. 10 minutes max. Sets up personalized dashboard.",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-02-24T10:00:00Z",
  },
];

// ── Competitor Entries (Infertility) ──
export const COMPETITORS: CompetitorEntry[] = [
  {
    id: "comp-1",
    verticalId: "infertility",
    competitor: "Natural Cycles",
    feature: "BBT-based cycle tracking",
    strength: "strong",
    notes: "FDA cleared. 93% typical-use effectiveness for contraception. Limited fertility features.",
    opportunity:
      "They only track temperature. We track 50 factors with wearable integration — completely different depth.",
  },
  {
    id: "comp-2",
    verticalId: "infertility",
    competitor: "Ava Fertility",
    feature: "Wearable bracelet with 5 parameters",
    strength: "moderate",
    notes: "Tracks skin temp, resting pulse, breathing, HRV, perfusion. Limited AI coaching.",
    opportunity:
      "Our Halo Ring is less intrusive, tracks more parameters, and our AI coaching is far more sophisticated.",
  },
  {
    id: "comp-3",
    verticalId: "infertility",
    competitor: "Flo Health",
    feature: "AI-powered cycle predictions",
    strength: "strong",
    notes: "300M+ users. Strong brand. But relies on self-reported data, no wearable integration.",
    opportunity:
      "Flo is surface-level. We go deep with biometric data + clinical evidence. Different market segment.",
  },
  {
    id: "comp-4",
    verticalId: "infertility",
    competitor: "Clue",
    feature: "Science-backed period tracking",
    strength: "moderate",
    notes: "Good science communication. Academic partnerships. No wearable, no AI coaching.",
    opportunity:
      "Partner opportunity? Their research credibility + our technology = powerful combination.",
  },
  {
    id: "comp-5",
    verticalId: "infertility",
    competitor: "Inito",
    feature: "At-home hormone testing",
    strength: "moderate",
    notes: "Tests E3G, PdG, LH, FSH. Hardware + consumable model. Limited longitudinal tracking.",
    opportunity:
      "Our wearable approach is non-invasive and continuous. Inito requires daily test strips.",
  },
];

// ── User Insights (Infertility) ──
export const USER_INSIGHTS: UserInsight[] = [
  {
    id: "ins-1",
    verticalId: "infertility",
    source: "community",
    quote:
      "I wish my partner could see what I'm going through without me having to explain every detail.",
    theme: "Partner involvement",
    impactScore: 9,
    addedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "ins-2",
    verticalId: "infertility",
    source: "interview",
    quote:
      "My doctor looked at my chart for 30 seconds and said 'everything looks fine.' But I KNOW something is off.",
    theme: "Medical validation gap",
    impactScore: 10,
    addedAt: "2025-02-03T10:00:00Z",
  },
  {
    id: "ins-3",
    verticalId: "infertility",
    source: "survey",
    quote:
      "I track in 4 different apps and still can't see the whole picture. I need ONE place.",
    theme: "Data fragmentation",
    impactScore: 8,
    addedAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "ins-4",
    verticalId: "infertility",
    source: "community",
    quote:
      "The supplements I'm taking — I have no idea if they're actually doing anything. Show me the evidence.",
    theme: "Evidence transparency",
    impactScore: 7,
    addedAt: "2025-02-08T10:00:00Z",
  },
  {
    id: "ins-5",
    verticalId: "infertility",
    source: "support",
    quote:
      "I want to know WHY my cycle is irregular, not just THAT it is. Root cause, not just symptoms.",
    theme: "Root cause demand",
    impactScore: 9,
    addedAt: "2025-02-12T10:00:00Z",
  },
];

// ── Readiness Checklist (Infertility) ──
export const READINESS_CHECKLIST: ReadinessCheckItem[] = [
  { id: "rc-1", verticalId: "infertility", label: "Core research review complete", checked: true, category: "research" },
  { id: "rc-2", verticalId: "infertility", label: "Competitive landscape mapped", checked: true, category: "research" },
  { id: "rc-3", verticalId: "infertility", label: "User interviews (n=10+) conducted", checked: true, category: "research" },
  { id: "rc-4", verticalId: "infertility", label: "Feature set prioritized (MoSCoW)", checked: true, category: "design" },
  { id: "rc-5", verticalId: "infertility", label: "User stories written for critical features", checked: true, category: "design" },
  { id: "rc-6", verticalId: "infertility", label: "Wireframes / mockups reviewed", checked: false, category: "design" },
  { id: "rc-7", verticalId: "infertility", label: "Clinical evidence base documented", checked: true, category: "clinical" },
  { id: "rc-8", verticalId: "infertility", label: "Medical advisory review scheduled", checked: false, category: "clinical" },
  { id: "rc-9", verticalId: "infertility", label: "Compliance review (health claims)", checked: false, category: "compliance" },
  { id: "rc-10", verticalId: "infertility", label: "Data privacy assessment complete", checked: true, category: "compliance" },
  { id: "rc-11", verticalId: "infertility", label: "Technical architecture defined", checked: true, category: "engineering" },
  { id: "rc-12", verticalId: "infertility", label: "API contracts drafted", checked: false, category: "engineering" },
];

// ── Cross-Vertical Connections ──
export const CROSS_VERTICAL_CONNECTIONS: CrossVerticalConnection[] = [
  {
    fromVerticalId: "infertility",
    toVerticalId: "pcos",
    sharedFeatures: ["Glucose Variability Module", "AI Coaching Chat (Kai)", "Supplement Evidence Tracker"],
    strength: 0.9,
    type: "clinical_pathway",
    description: "PCOS is a leading cause of infertility. Same metabolic and hormonal tracking applies to both.",
  },
  {
    fromVerticalId: "infertility",
    toVerticalId: "pregnancy",
    sharedFeatures: ["Halo Ring Real-Time Sync", "AI Coaching Chat (Kai)", "Partner Dashboard"],
    strength: 0.85,
    type: "data_dependency",
    description: "Preconception data flows directly into pregnancy monitoring. Continuous data story.",
  },
  {
    fromVerticalId: "infertility",
    toVerticalId: "period-problems",
    sharedFeatures: ["Cycle Prediction with Confidence Scores", "Ovulation Detection (HRV-Based)"],
    strength: 0.7,
    type: "shared_feature",
    description: "Cycle tracking engine is shared. Period problems use the same underlying algorithms.",
  },
  {
    fromVerticalId: "infertility",
    toVerticalId: "endometriosis",
    sharedFeatures: ["Clinical Report Export", "Supplement Evidence Tracker"],
    strength: 0.6,
    type: "clinical_pathway",
    description: "Endometriosis significantly impacts fertility. Shared clinical evidence base.",
  },
  {
    fromVerticalId: "infertility",
    toVerticalId: "perimenopause",
    sharedFeatures: ["Halo Ring Real-Time Sync", "AI Coaching Chat (Kai)", "Stress & Cortisol Insights", "Glucose Variability Module"],
    strength: 0.65,
    type: "shared_feature",
    description: "Same wearable infrastructure. Hormonal tracking algorithms adapt for perimenopause patterns.",
  },
  {
    fromVerticalId: "pcos",
    toVerticalId: "period-problems",
    sharedFeatures: ["Cycle Prediction with Confidence Scores"],
    strength: 0.75,
    type: "clinical_pathway",
    description: "PCOS often manifests as irregular periods. Shared cycle analysis engine.",
  },
  {
    fromVerticalId: "pcos",
    toVerticalId: "perimenopause",
    sharedFeatures: ["Glucose Variability Module", "Stress & Cortisol Insights"],
    strength: 0.5,
    type: "shared_feature",
    description: "Metabolic disruption patterns are similar. Shared glucose and stress modules.",
  },
  {
    fromVerticalId: "pregnancy",
    toVerticalId: "postpartum",
    sharedFeatures: ["Halo Ring Real-Time Sync", "Partner Dashboard"],
    strength: 0.8,
    type: "data_dependency",
    description: "Pregnancy data informs postpartum recovery tracking. Continuous monitoring story.",
  },
  {
    fromVerticalId: "perimenopause",
    toVerticalId: "menopause",
    sharedFeatures: ["Halo Ring Real-Time Sync", "AI Coaching Chat (Kai)"],
    strength: 0.9,
    type: "data_dependency",
    description: "Perimenopause transitions into menopause. Same tracking, different algorithms.",
  },
  {
    fromVerticalId: "menopause",
    toVerticalId: "post-menopause",
    sharedFeatures: ["Halo Ring Real-Time Sync"],
    strength: 0.7,
    type: "data_dependency",
    description: "Long-term health monitoring continues. Focus shifts to longevity markers.",
  },
];
