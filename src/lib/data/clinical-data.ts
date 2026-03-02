// Clinical / Research — The Evidence Engine
// Proves Conceivable works and generates publishable science

// ============================================================
// TYPES
// ============================================================

export type EvidenceStrength = "strong" | "moderate" | "weak" | "none" | "emerging";
export type ConnectionType = "proven" | "hypothesized" | "emerging";
export type PublicationStage =
  | "hypothesis"
  | "literature_review"
  | "study_design"
  | "data_extraction"
  | "analysis"
  | "manuscript"
  | "journal_targeting"
  | "submission"
  | "review"
  | "published";
export type FactorCategory =
  | "hormonal"
  | "metabolic"
  | "sleep"
  | "stress"
  | "nutritional"
  | "cardiovascular"
  | "reproductive"
  | "immune"
  | "environmental"
  | "behavioral";

export interface Factor {
  id: string;
  name: string;
  shortName: string;
  category: FactorCategory;
  hypothesis: string;
  literatureStrength: EvidenceStrength;
  internalDataStatus: "available" | "collecting" | "planned" | "none";
  publicationReadiness: number; // 0-100
  keyFindings?: string;
  gapDescription?: string;
  connections: FactorConnection[];
}

export interface FactorConnection {
  targetFactorId: string;
  type: ConnectionType;
  direction: "upstream" | "downstream" | "bidirectional";
  evidence?: string;
  strength: number; // 0-1 correlation strength
}

export interface CausalChain {
  id: string;
  name: string;
  description: string;
  steps: CausalStep[];
  evidenceStatus: "proven" | "partial" | "hypothesized";
  clinicalImplication: string;
}

export interface CausalStep {
  factorId: string;
  factorName: string;
  mechanism: string;
  timelag?: string;
}

export interface CohortOutcome {
  metric: string;
  week4: { value: number; unit: string; gain: number };
  week8: { value: number; unit: string; gain: number };
  week12: { value: number; unit: string; gain: number };
  baseline: { value: number; unit: string };
  populationBaseline?: number;
  ivfComparison?: number;
}

export interface AgentPerformance {
  agentName: string;
  role: string;
  metric: string;
  improvement: number;
  sampleSize: number;
  topIntervention: string;
}

export interface InterventionCascade {
  id: string;
  date: string;
  rootFactor: string;
  intervention: string;
  agent: string;
  cascadeSteps: { factor: string; change: string; timeAfter: string; verified: boolean }[];
  thesisConfirmed: boolean;
}

export interface StudyOpportunity {
  id: string;
  title: string;
  factor: string;
  gapDescription: string;
  dataStrength: "strong" | "moderate" | "limited";
  impactScore: number; // 1-10
  patentRelevance: boolean;
  targetJournal: string;
  estimatedSampleSize: number;
  timelineMonths: number;
  stage: PublicationStage;
  protocol?: string;
}

export interface RegulatoryEvidence {
  id: string;
  claim: string;
  claimType: "efficacy" | "mechanism" | "safety" | "comparison";
  currentStatus: "substantiated" | "partial" | "unsubstantiated";
  supportingStudies: string[];
  evidenceGap: string;
  studyPriority: "critical" | "high" | "medium" | "low";
  linkedLegalClaimId?: string;
}

export interface ResearchFeedItem {
  id: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
  relevantFactors: string[];
  summary: string;
  implication: string;
}

// ============================================================
// PUBLICATION PIPELINE STAGES
// ============================================================

export const PUBLICATION_STAGES: { key: PublicationStage; label: string; color: string }[] = [
  { key: "hypothesis", label: "Hypothesis", color: "#9686B9" },
  { key: "literature_review", label: "Lit Review", color: "#78C3BF" },
  { key: "study_design", label: "Study Design", color: "#ACB7FF" },
  { key: "data_extraction", label: "Data Extract", color: "#5A6FFF" },
  { key: "analysis", label: "Analysis", color: "#356FB6" },
  { key: "manuscript", label: "Manuscript", color: "#F1C028" },
  { key: "journal_targeting", label: "Journal Target", color: "#E37FB1" },
  { key: "submission", label: "Submitted", color: "#E24D47" },
  { key: "review", label: "In Review", color: "#E24D47" },
  { key: "published", label: "Published", color: "#1EAA55" },
];

// ============================================================
// THE 50 FACTORS DATABASE
// (10 detailed with connections, 40 listed by name)
// ============================================================

export const FACTORS: Factor[] = [
  // ── 10 DETAILED FACTORS ──
  {
    id: "f-01",
    name: "Basal Body Temperature Patterns",
    shortName: "BBT",
    category: "hormonal",
    hypothesis: "BBT patterns reflect progesterone production quality and luteal phase adequacy. Low post-ovulatory BBT rise indicates insufficient progesterone for implantation.",
    literatureStrength: "strong",
    internalDataStatus: "available",
    publicationReadiness: 85,
    keyFindings: "500K+ BBT charts analyzed. Clear correlation between BBT rise magnitude and progesterone sufficiency. Patented interpretation method (US20160140314A1).",
    connections: [
      { targetFactorId: "f-02", type: "proven", direction: "downstream", evidence: "BBT rise directly reflects progesterone output from corpus luteum", strength: 0.92 },
      { targetFactorId: "f-07", type: "proven", direction: "downstream", evidence: "BBT variability correlates with thyroid function markers", strength: 0.71 },
      { targetFactorId: "f-10", type: "proven", direction: "downstream", evidence: "Post-ovulatory BBT plateau predicts luteal phase length", strength: 0.88 },
      { targetFactorId: "f-04", type: "emerging", direction: "upstream", evidence: "Glucose regulation affects temperature regulation via metabolic rate", strength: 0.45 },
    ],
  },
  {
    id: "f-02",
    name: "Progesterone Production",
    shortName: "Progesterone",
    category: "hormonal",
    hypothesis: "Adequate progesterone (>10 ng/mL mid-luteal) is essential for endometrial receptivity. Suboptimal production is the most common correctable cause of implantation failure.",
    literatureStrength: "strong",
    internalDataStatus: "available",
    publicationReadiness: 75,
    keyFindings: "Internal data shows 67% of users with low BBT rise have correctable progesterone insufficiency. Supplement + lifestyle intervention improves levels in 78% of cases within 2 cycles.",
    connections: [
      { targetFactorId: "f-01", type: "proven", direction: "upstream", evidence: "Progesterone drives the post-ovulatory BBT rise", strength: 0.92 },
      { targetFactorId: "f-10", type: "proven", direction: "downstream", evidence: "Progesterone sustains the luteal phase; insufficiency causes short LP", strength: 0.89 },
      { targetFactorId: "f-05", type: "proven", direction: "upstream", evidence: "Chronic cortisol elevation suppresses progesterone via pregnenolone steal", strength: 0.74 },
      { targetFactorId: "f-03", type: "emerging", direction: "upstream", evidence: "Poor sleep quality reduces corpus luteum function", strength: 0.52 },
    ],
  },
  {
    id: "f-03",
    name: "Sleep Architecture",
    shortName: "Sleep",
    category: "sleep",
    hypothesis: "Sleep quality (deep sleep %, REM cycles, total duration) directly modulates hormonal production cycles. Disrupted sleep architecture precedes hormonal imbalances by 1-2 weeks.",
    literatureStrength: "moderate",
    internalDataStatus: "available",
    publicationReadiness: 60,
    keyFindings: "Oura Ring data from 340 users shows women with <15% deep sleep have 2.3x higher rate of anovulatory cycles. Sleep improvement precedes hormone normalization by ~14 days.",
    connections: [
      { targetFactorId: "f-02", type: "emerging", direction: "downstream", evidence: "Deep sleep supports pulsatile GnRH release", strength: 0.52 },
      { targetFactorId: "f-06", type: "proven", direction: "upstream", evidence: "HRV improves with better sleep architecture", strength: 0.78 },
      { targetFactorId: "f-04", type: "proven", direction: "bidirectional", evidence: "Glucose dysregulation disrupts sleep; poor sleep worsens insulin sensitivity", strength: 0.68 },
      { targetFactorId: "f-05", type: "proven", direction: "upstream", evidence: "Cortisol patterns are set during sleep; poor sleep = dysregulated cortisol", strength: 0.81 },
    ],
  },
  {
    id: "f-04",
    name: "Glucose Regulation",
    shortName: "Glucose",
    category: "metabolic",
    hypothesis: "Blood glucose stability (fasting <95, post-prandial <140, variability <30mg/dL) impacts ovarian function, egg quality, and hormonal balance. Insulin resistance is a primary upstream driver of PCOS-related infertility.",
    literatureStrength: "strong",
    internalDataStatus: "collecting",
    publicationReadiness: 55,
    keyFindings: "CGM data from 89 users shows glucose variability >35mg/dL correlates with irregular cycles (r=0.64). Dietary intervention reduces variability within 2 weeks.",
    connections: [
      { targetFactorId: "f-03", type: "proven", direction: "bidirectional", evidence: "Blood sugar crashes cause night waking; poor sleep worsens insulin sensitivity", strength: 0.68 },
      { targetFactorId: "f-06", type: "emerging", direction: "downstream", evidence: "Glucose instability reduces autonomic balance measured by HRV", strength: 0.41 },
      { targetFactorId: "f-08", type: "proven", direction: "downstream", evidence: "Insulin resistance drives androgen excess in PCOS pathway", strength: 0.82 },
      { targetFactorId: "f-01", type: "emerging", direction: "downstream", evidence: "Metabolic rate changes from glucose regulation affect BBT", strength: 0.45 },
    ],
  },
  {
    id: "f-05",
    name: "Cortisol & Stress Response",
    shortName: "Cortisol",
    category: "stress",
    hypothesis: "Chronic stress elevates cortisol, which suppresses GnRH pulsatility, reduces progesterone via pregnenolone steal, and disrupts the HPO axis. Stress management is not optional — it's physiologically necessary for fertility.",
    literatureStrength: "strong",
    internalDataStatus: "available",
    publicationReadiness: 70,
    keyFindings: "Users reporting high stress scores who complete >80% of Seren's therapy sessions show 34% improvement in cycle regularity within 8 weeks.",
    connections: [
      { targetFactorId: "f-02", type: "proven", direction: "downstream", evidence: "Cortisol elevation steals pregnenolone from progesterone pathway", strength: 0.74 },
      { targetFactorId: "f-03", type: "proven", direction: "downstream", evidence: "Elevated evening cortisol disrupts sleep onset and deep sleep", strength: 0.81 },
      { targetFactorId: "f-06", type: "proven", direction: "downstream", evidence: "Chronic stress reduces vagal tone measured by HRV", strength: 0.77 },
      { targetFactorId: "f-09", type: "emerging", direction: "downstream", evidence: "Stress-mediated inflammation may impair implantation", strength: 0.38 },
    ],
  },
  {
    id: "f-06",
    name: "Heart Rate Variability",
    shortName: "HRV",
    category: "cardiovascular",
    hypothesis: "HRV reflects autonomic nervous system balance. Higher HRV indicates parasympathetic dominance, which supports reproductive hormone production and uterine blood flow.",
    literatureStrength: "moderate",
    internalDataStatus: "available",
    publicationReadiness: 65,
    keyFindings: "Women with resting HRV >50ms have 1.8x higher conception rate in our cohort. HRV improvement of >15% correlates with improved cycle regularity in 72% of cases.",
    connections: [
      { targetFactorId: "f-03", type: "proven", direction: "downstream", evidence: "Sleep quality directly modulates autonomic balance", strength: 0.78 },
      { targetFactorId: "f-05", type: "proven", direction: "upstream", evidence: "Stress lowers vagal tone; HRV is the measurable output", strength: 0.77 },
      { targetFactorId: "f-02", type: "hypothesized", direction: "downstream", evidence: "Autonomic balance may support corpus luteum perfusion", strength: 0.35 },
    ],
  },
  {
    id: "f-07",
    name: "Thyroid Function",
    shortName: "Thyroid",
    category: "hormonal",
    hypothesis: "Subclinical hypothyroidism (TSH 2.5-4.5) is underdiagnosed and significantly impacts fertility. Even 'normal range' TSH can impair ovulation and increase miscarriage risk.",
    literatureStrength: "strong",
    internalDataStatus: "planned",
    publicationReadiness: 40,
    keyFindings: "BBT pattern analysis can identify potential thyroid dysfunction before lab results — low overall temperature + high variability pattern.",
    connections: [
      { targetFactorId: "f-01", type: "proven", direction: "downstream", evidence: "Thyroid hormones regulate basal metabolic rate and body temperature", strength: 0.71 },
      { targetFactorId: "f-08", type: "emerging", direction: "downstream", evidence: "Thyroid dysfunction can cause anovulation and irregular cycles", strength: 0.56 },
    ],
  },
  {
    id: "f-08",
    name: "Ovulation Quality & Regularity",
    shortName: "Ovulation",
    category: "reproductive",
    hypothesis: "Regular ovulation with adequate follicular development is the foundational requirement. Anovulation or poor-quality ovulation (inadequate follicle size, premature luteinization) is correctable through upstream factor optimization.",
    literatureStrength: "strong",
    internalDataStatus: "available",
    publicationReadiness: 70,
    keyFindings: "42% of users with irregular cycles achieve regular ovulation within 3 cycles of protocol. Multi-factor intervention outperforms single-factor approaches 3.2x.",
    connections: [
      { targetFactorId: "f-04", type: "proven", direction: "upstream", evidence: "Insulin resistance disrupts follicular development and triggers PCOS-pattern anovulation", strength: 0.82 },
      { targetFactorId: "f-07", type: "emerging", direction: "upstream", evidence: "Thyroid dysfunction impairs ovulation", strength: 0.56 },
      { targetFactorId: "f-10", type: "proven", direction: "downstream", evidence: "Ovulation quality determines luteal phase adequacy", strength: 0.85 },
    ],
  },
  {
    id: "f-09",
    name: "Inflammatory Markers",
    shortName: "Inflammation",
    category: "immune",
    hypothesis: "Chronic low-grade inflammation (elevated hs-CRP, TNF-alpha, IL-6) impairs implantation and early pregnancy maintenance. Anti-inflammatory interventions may improve outcomes independently of other factors.",
    literatureStrength: "moderate",
    internalDataStatus: "planned",
    publicationReadiness: 30,
    gapDescription: "Need to correlate user supplement protocols (omega-3, curcumin) with inflammatory marker changes and pregnancy outcomes.",
    connections: [
      { targetFactorId: "f-05", type: "emerging", direction: "upstream", evidence: "Stress-mediated inflammation via cortisol dysregulation", strength: 0.38 },
      { targetFactorId: "f-04", type: "emerging", direction: "upstream", evidence: "Glucose instability promotes inflammatory cascades", strength: 0.44 },
    ],
  },
  {
    id: "f-10",
    name: "Luteal Phase Length & Quality",
    shortName: "Luteal Phase",
    category: "reproductive",
    hypothesis: "Luteal phase <10 days or with poor progesterone support indicates implantation failure risk. LP deficiency is the downstream result of multiple upstream factors and is the most directly measurable fertility marker.",
    literatureStrength: "strong",
    internalDataStatus: "available",
    publicationReadiness: 80,
    keyFindings: "85% of users with LP <10 days achieve LP >11 days within 3 cycles of protocol. This is the single most trackable outcome metric.",
    connections: [
      { targetFactorId: "f-02", type: "proven", direction: "upstream", evidence: "Progesterone sustains the endometrium during the luteal phase", strength: 0.89 },
      { targetFactorId: "f-08", type: "proven", direction: "upstream", evidence: "Poor ovulation leads to inadequate corpus luteum", strength: 0.85 },
      { targetFactorId: "f-01", type: "proven", direction: "upstream", evidence: "BBT plateau length mirrors luteal phase length", strength: 0.88 },
    ],
  },

  // ── 40 ADDITIONAL FACTORS (name + category only) ──
  ...[
    { name: "Estrogen Production", shortName: "Estrogen", category: "hormonal" as FactorCategory },
    { name: "FSH Levels", shortName: "FSH", category: "hormonal" as FactorCategory },
    { name: "LH Surge Patterns", shortName: "LH", category: "hormonal" as FactorCategory },
    { name: "AMH / Ovarian Reserve", shortName: "AMH", category: "hormonal" as FactorCategory },
    { name: "DHEA-S Levels", shortName: "DHEA-S", category: "hormonal" as FactorCategory },
    { name: "Testosterone (free & total)", shortName: "Testosterone", category: "hormonal" as FactorCategory },
    { name: "Prolactin Levels", shortName: "Prolactin", category: "hormonal" as FactorCategory },
    { name: "Insulin Sensitivity", shortName: "Insulin", category: "metabolic" as FactorCategory },
    { name: "Body Composition / BMI", shortName: "BMI", category: "metabolic" as FactorCategory },
    { name: "Vitamin D Status", shortName: "Vitamin D", category: "nutritional" as FactorCategory },
    { name: "Iron / Ferritin Levels", shortName: "Iron", category: "nutritional" as FactorCategory },
    { name: "Folate & B12 Status", shortName: "Folate/B12", category: "nutritional" as FactorCategory },
    { name: "Omega-3 Index", shortName: "Omega-3", category: "nutritional" as FactorCategory },
    { name: "Zinc Status", shortName: "Zinc", category: "nutritional" as FactorCategory },
    { name: "CoQ10 Levels", shortName: "CoQ10", category: "nutritional" as FactorCategory },
    { name: "Magnesium Status", shortName: "Magnesium", category: "nutritional" as FactorCategory },
    { name: "Gut Microbiome Diversity", shortName: "Gut Health", category: "immune" as FactorCategory },
    { name: "Vaginal Microbiome", shortName: "Vaginal pH", category: "immune" as FactorCategory },
    { name: "Endometrial Thickness", shortName: "Endometrium", category: "reproductive" as FactorCategory },
    { name: "Cervical Mucus Quality", shortName: "CM Quality", category: "reproductive" as FactorCategory },
    { name: "Uterine Blood Flow", shortName: "Uterine Flow", category: "cardiovascular" as FactorCategory },
    { name: "Blood Pressure", shortName: "BP", category: "cardiovascular" as FactorCategory },
    { name: "Homocysteine Levels", shortName: "Homocysteine", category: "cardiovascular" as FactorCategory },
    { name: "Oxidative Stress (8-OHdG)", shortName: "Oxidative Stress", category: "immune" as FactorCategory },
    { name: "NK Cell Activity", shortName: "NK Cells", category: "immune" as FactorCategory },
    { name: "Autoimmune Markers (ANA, TPO)", shortName: "Autoimmune", category: "immune" as FactorCategory },
    { name: "Alcohol Consumption", shortName: "Alcohol", category: "behavioral" as FactorCategory },
    { name: "Caffeine Intake", shortName: "Caffeine", category: "behavioral" as FactorCategory },
    { name: "Exercise Frequency & Type", shortName: "Exercise", category: "behavioral" as FactorCategory },
    { name: "Meditation / Mindfulness Practice", shortName: "Mindfulness", category: "behavioral" as FactorCategory },
    { name: "Screen Time Before Bed", shortName: "Screen Time", category: "behavioral" as FactorCategory },
    { name: "Hydration Status", shortName: "Hydration", category: "nutritional" as FactorCategory },
    { name: "Endocrine Disruptor Exposure", shortName: "EDCs", category: "environmental" as FactorCategory },
    { name: "Heavy Metal Load", shortName: "Heavy Metals", category: "environmental" as FactorCategory },
    { name: "Air Quality Exposure", shortName: "Air Quality", category: "environmental" as FactorCategory },
    { name: "Circadian Rhythm Alignment", shortName: "Circadian", category: "sleep" as FactorCategory },
    { name: "REM Sleep Percentage", shortName: "REM Sleep", category: "sleep" as FactorCategory },
    { name: "Sleep Onset Latency", shortName: "Sleep Onset", category: "sleep" as FactorCategory },
    { name: "Pelvic Floor Function", shortName: "Pelvic Floor", category: "reproductive" as FactorCategory },
    { name: "Sexual Frequency & Timing", shortName: "Timing", category: "behavioral" as FactorCategory },
  ].map((f, i) => ({
    id: `f-${11 + i}`,
    name: f.name,
    shortName: f.shortName,
    category: f.category,
    hypothesis: "",
    literatureStrength: (["moderate", "weak", "emerging", "none", "strong"][i % 5]) as EvidenceStrength,
    internalDataStatus: (["planned", "collecting", "none", "available"][i % 4]) as Factor["internalDataStatus"],
    publicationReadiness: Math.floor(Math.random() * 40),
    connections: [],
  })),
];

// ============================================================
// CATEGORY CONFIG
// ============================================================

export const CATEGORY_CONFIG: Record<FactorCategory, { label: string; color: string }> = {
  hormonal: { label: "Hormonal", color: "#E37FB1" },
  metabolic: { label: "Metabolic", color: "#F1C028" },
  sleep: { label: "Sleep", color: "#9686B9" },
  stress: { label: "Stress", color: "#E24D47" },
  nutritional: { label: "Nutritional", color: "#1EAA55" },
  cardiovascular: { label: "Cardiovascular", color: "#356FB6" },
  reproductive: { label: "Reproductive", color: "#5A6FFF" },
  immune: { label: "Immune", color: "#78C3BF" },
  environmental: { label: "Environmental", color: "#ACB7FF" },
  behavioral: { label: "Behavioral", color: "#2A2828" },
};

// ============================================================
// CAUSAL CHAINS
// ============================================================

export const CAUSAL_CHAINS: CausalChain[] = [
  {
    id: "cc-01",
    name: "The Glucose-to-Implantation Cascade",
    description: "The primary causal chain demonstrating how metabolic dysfunction cascades through sleep, autonomic, hormonal, and reproductive systems to ultimately impair implantation.",
    evidenceStatus: "partial",
    clinicalImplication: "Fix glucose regulation FIRST — it resolves the entire downstream cascade in 60-70% of cases.",
    steps: [
      { factorId: "f-04", factorName: "Glucose Dysregulation", mechanism: "Insulin resistance and blood sugar instability", timelag: "Root cause" },
      { factorId: "f-03", factorName: "Poor Sleep Architecture", mechanism: "Blood sugar crashes cause night waking; insulin resistance disrupts melatonin", timelag: "1-2 weeks" },
      { factorId: "f-06", factorName: "Low HRV", mechanism: "Sleep disruption reduces parasympathetic tone", timelag: "1-3 weeks" },
      { factorId: "f-05", factorName: "Cortisol Dysregulation", mechanism: "Poor sleep and low HRV elevate cortisol; creates vicious cycle", timelag: "2-4 weeks" },
      { factorId: "f-02", factorName: "Low Progesterone", mechanism: "Cortisol steals pregnenolone from progesterone pathway", timelag: "1-2 cycles" },
      { factorId: "f-01", factorName: "Low BBT Rise", mechanism: "Insufficient progesterone = weak temperature shift", timelag: "Same cycle" },
      { factorId: "f-10", factorName: "Short Luteal Phase", mechanism: "Inadequate progesterone cannot sustain endometrium", timelag: "Same cycle" },
    ],
  },
  {
    id: "cc-02",
    name: "The Stress-to-Anovulation Pathway",
    description: "How chronic stress suppresses the reproductive axis, leading to anovulatory cycles.",
    evidenceStatus: "proven",
    clinicalImplication: "Stress management is not a luxury — it's a physiological prerequisite for regular ovulation.",
    steps: [
      { factorId: "f-05", factorName: "Chronic Stress / High Cortisol", mechanism: "Sustained HPA axis activation", timelag: "Root cause" },
      { factorId: "f-06", factorName: "Reduced HRV", mechanism: "Sympathetic dominance from chronic stress", timelag: "Days" },
      { factorId: "f-03", factorName: "Disrupted Sleep", mechanism: "Elevated evening cortisol prevents sleep onset", timelag: "Days-weeks" },
      { factorId: "f-02", factorName: "Progesterone Insufficiency", mechanism: "Pregnenolone steal + suppressed GnRH pulsatility", timelag: "1-2 cycles" },
      { factorId: "f-08", factorName: "Anovulation", mechanism: "HPO axis suppression prevents follicular maturation", timelag: "1-3 cycles" },
    ],
  },
  {
    id: "cc-03",
    name: "The BBT → Progesterone Proof Chain",
    description: "The proven causal relationship between BBT patterns and progesterone status. This is Conceivable's foundational IP (US20160140314A1).",
    evidenceStatus: "proven",
    clinicalImplication: "BBT is a non-invasive, daily proxy for progesterone status. This chain validates the entire Conceivable measurement methodology.",
    steps: [
      { factorId: "f-02", factorName: "Progesterone Output", mechanism: "Corpus luteum produces progesterone after ovulation", timelag: "Post-ovulation" },
      { factorId: "f-01", factorName: "BBT Rise", mechanism: "Progesterone acts on hypothalamic thermoregulatory center to elevate body temperature", timelag: "24-48 hours" },
      { factorId: "f-10", factorName: "Luteal Phase Duration", mechanism: "BBT plateau length reflects duration of adequate progesterone support", timelag: "Same cycle" },
    ],
  },
];

// ============================================================
// COHORT OUTCOMES (Gain-not-Gap)
// ============================================================

export const COHORT_OUTCOMES: CohortOutcome[] = [
  {
    metric: "Fasting Glucose (mg/dL)",
    baseline: { value: 102, unit: "mg/dL" },
    week4: { value: 96, unit: "mg/dL", gain: 6 },
    week8: { value: 91, unit: "mg/dL", gain: 11 },
    week12: { value: 88, unit: "mg/dL", gain: 14 },
    populationBaseline: 100,
  },
  {
    metric: "HRV (ms RMSSD)",
    baseline: { value: 28, unit: "ms" },
    week4: { value: 33, unit: "ms", gain: 18 },
    week8: { value: 41, unit: "ms", gain: 46 },
    week12: { value: 48, unit: "ms", gain: 71 },
    populationBaseline: 35,
  },
  {
    metric: "Deep Sleep %",
    baseline: { value: 11, unit: "%" },
    week4: { value: 14, unit: "%", gain: 27 },
    week8: { value: 17, unit: "%", gain: 55 },
    week12: { value: 19, unit: "%", gain: 73 },
    populationBaseline: 15,
  },
  {
    metric: "Cycle Regularity (days variation)",
    baseline: { value: 8.2, unit: "days" },
    week4: { value: 6.1, unit: "days", gain: 26 },
    week8: { value: 4.3, unit: "days", gain: 48 },
    week12: { value: 2.8, unit: "days", gain: 66 },
    populationBaseline: 5,
  },
  {
    metric: "Luteal Phase Length (days)",
    baseline: { value: 9.1, unit: "days" },
    week4: { value: 10.2, unit: "days", gain: 12 },
    week8: { value: 11.4, unit: "days", gain: 25 },
    week12: { value: 12.1, unit: "days", gain: 33 },
    populationBaseline: 11,
  },
  {
    metric: "Ovulation Rate",
    baseline: { value: 68, unit: "%" },
    week4: { value: 76, unit: "%", gain: 12 },
    week8: { value: 85, unit: "%", gain: 25 },
    week12: { value: 91, unit: "%", gain: 34 },
    populationBaseline: 80,
    ivfComparison: 95,
  },
  {
    metric: "Conception Rate (per cycle)",
    baseline: { value: 8, unit: "%" },
    week4: { value: 12, unit: "%", gain: 50 },
    week8: { value: 18, unit: "%", gain: 125 },
    week12: { value: 22, unit: "%", gain: 175 },
    populationBaseline: 15,
    ivfComparison: 40,
  },
];

// ============================================================
// AI AGENT PERFORMANCE
// ============================================================

export const AGENT_PERFORMANCE: AgentPerformance[] = [
  {
    agentName: "Kai",
    role: "AI Health Coach",
    metric: "Overall CON Score improvement",
    improvement: 34,
    sampleSize: 105,
    topIntervention: "Personalized daily action plans based on wearable data",
  },
  {
    agentName: "Olive",
    role: "Nutrition Agent",
    metric: "Glucose variability reduction",
    improvement: 42,
    sampleSize: 89,
    topIntervention: "Meal timing optimization + glycemic load balancing",
  },
  {
    agentName: "Seren",
    role: "Therapy / Stress Agent",
    metric: "HRV improvement",
    improvement: 28,
    sampleSize: 76,
    topIntervention: "Evening cortisol management + breath work protocols",
  },
  {
    agentName: "Luna",
    role: "Sleep Agent",
    metric: "Deep sleep percentage increase",
    improvement: 38,
    sampleSize: 62,
    topIntervention: "Circadian rhythm alignment + sleep hygiene scoring",
  },
];

// ============================================================
// INTERVENTION CASCADES — "Fix the Root, Watch the Cascade"
// ============================================================

export const INTERVENTION_CASCADES: InterventionCascade[] = [
  {
    id: "ic-01",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    rootFactor: "Glucose Regulation",
    intervention: "Olive: Meal timing restructure + elimination of high-GI breakfasts",
    agent: "Olive",
    cascadeSteps: [
      { factor: "Glucose variability", change: "Reduced from 42 to 28 mg/dL", timeAfter: "Week 1", verified: true },
      { factor: "Sleep quality", change: "Deep sleep increased from 12% to 17%", timeAfter: "Week 2", verified: true },
      { factor: "HRV", change: "Resting HRV improved from 31 to 39 ms", timeAfter: "Week 3", verified: true },
      { factor: "BBT pattern", change: "Post-ovulatory rise strengthened by 0.2°F", timeAfter: "Week 5 (next cycle)", verified: true },
      { factor: "Luteal phase", change: "Extended from 9 to 12 days", timeAfter: "Week 5 (next cycle)", verified: true },
    ],
    thesisConfirmed: true,
  },
  {
    id: "ic-02",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    rootFactor: "Cortisol / Stress",
    intervention: "Seren: Evening breath work protocol + cognitive reframing sessions",
    agent: "Seren",
    cascadeSteps: [
      { factor: "Evening cortisol", change: "Subjective stress score dropped from 8/10 to 5/10", timeAfter: "Week 1", verified: true },
      { factor: "Sleep onset latency", change: "Reduced from 35 min to 15 min", timeAfter: "Week 1", verified: true },
      { factor: "HRV", change: "Improved from 26 to 34 ms", timeAfter: "Week 2", verified: true },
      { factor: "Cycle regularity", change: "Monitoring — next cycle pending", timeAfter: "Week 4 (pending)", verified: false },
    ],
    thesisConfirmed: false,
  },
  {
    id: "ic-03",
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    rootFactor: "Sleep Architecture",
    intervention: "Luna: Circadian reset protocol + blue light elimination + temperature optimization",
    agent: "Luna",
    cascadeSteps: [
      { factor: "Deep sleep %", change: "Increased from 10% to 18%", timeAfter: "Week 1", verified: true },
      { factor: "Morning cortisol", change: "Cortisol awakening response normalized", timeAfter: "Week 2", verified: true },
      { factor: "HRV", change: "Resting HRV improved from 29 to 44 ms", timeAfter: "Week 2", verified: true },
      { factor: "Progesterone (mid-luteal)", change: "Estimated improvement via BBT rise +0.3°F", timeAfter: "Week 4", verified: true },
      { factor: "Luteal phase", change: "Extended from 8 to 11 days", timeAfter: "Week 4", verified: true },
      { factor: "Conception", change: "Positive pregnancy test", timeAfter: "Week 8", verified: true },
    ],
    thesisConfirmed: true,
  },
];

// ============================================================
// STUDY OPPORTUNITIES
// ============================================================

export const STUDY_OPPORTUNITIES: StudyOpportunity[] = [
  {
    id: "study-01",
    title: "Compliance vs. Outcomes: Adherence Threshold Analysis",
    factor: "Protocol Adherence",
    gapDescription: "No published data on minimum adherence threshold for fertility optimization protocols. What % compliance produces meaningful outcomes?",
    dataStrength: "strong",
    impactScore: 9,
    patentRelevance: true,
    targetJournal: "Fertility and Sterility",
    estimatedSampleSize: 200,
    timelineMonths: 6,
    stage: "data_extraction",
    protocol: "Retrospective cohort: >80% adherence vs <40% adherence. Primary endpoint: time-to-conception. Secondary: CON Score trajectory.",
  },
  {
    id: "study-02",
    title: "HRV Threshold and Conception Correlation",
    factor: "Heart Rate Variability",
    gapDescription: "No study has established an HRV threshold that predicts conception success in natural fertility context. Existing data is limited to IVF populations.",
    dataStrength: "strong",
    impactScore: 8,
    patentRelevance: true,
    targetJournal: "Human Reproduction",
    estimatedSampleSize: 150,
    timelineMonths: 8,
    stage: "study_design",
    protocol: "Prospective observational: continuous HRV monitoring via Oura Ring. Identify HRV threshold correlating with conception within 6 months.",
  },
  {
    id: "study-03",
    title: "Glucose Stabilization Timeline and Cycle Regularity",
    factor: "Glucose Regulation",
    gapDescription: "Temporal relationship between glucose stabilization and menstrual cycle normalization is unstudied in non-diabetic women.",
    dataStrength: "moderate",
    impactScore: 7,
    patentRelevance: false,
    targetJournal: "Journal of Clinical Endocrinology & Metabolism",
    estimatedSampleSize: 100,
    timelineMonths: 10,
    stage: "literature_review",
  },
  {
    id: "study-04",
    title: "Multi-Signal Composite Scoring vs. Single-Metric Tracking",
    factor: "CON Score Methodology",
    gapDescription: "No head-to-head comparison exists between multi-signal composite health scoring and single-metric fertility tracking (BBT alone, LH alone).",
    dataStrength: "strong",
    impactScore: 10,
    patentRelevance: true,
    targetJournal: "NPJ Digital Medicine",
    estimatedSampleSize: 300,
    timelineMonths: 12,
    stage: "hypothesis",
    protocol: "Prospective: CON Score users vs BBT-only users vs LH-only users. Primary: time-to-conception. This directly validates the patent.",
  },
  {
    id: "study-05",
    title: "Closed-Loop Intervention Efficacy: Adaptive vs. Static Protocols",
    factor: "Closed-Loop System",
    gapDescription: "No published evidence comparing adaptive, response-based health protocols to static supplement/lifestyle programs for fertility.",
    dataStrength: "moderate",
    impactScore: 10,
    patentRelevance: true,
    targetJournal: "The Lancet Digital Health",
    estimatedSampleSize: 250,
    timelineMonths: 18,
    stage: "hypothesis",
    protocol: "RCT: Conceivable adaptive protocol vs. static evidence-based fertility supplement protocol. This is the definitive study.",
  },
];

// ============================================================
// REGULATORY EVIDENCE MAPPING
// ============================================================

export const REGULATORY_EVIDENCE: RegulatoryEvidence[] = [
  {
    id: "re-01",
    claim: "150-260% improvement in likelihood of natural conception",
    claimType: "efficacy",
    currentStatus: "partial",
    supportingStudies: ["Conceivable Pilot Study (2023), N=105, 240,000+ data points"],
    evidenceGap: "Pilot study (N=105) is strong but not sufficient for 'clinically proven' claim. Need larger RCT (N>300) for definitive substantiation.",
    studyPriority: "critical",
    linkedLegalClaimId: "claim-01",
  },
  {
    id: "re-02",
    claim: "AI-powered personalized recommendations based on your unique health data",
    claimType: "mechanism",
    currentStatus: "substantiated",
    supportingStudies: ["Product feature — factual description of system capabilities"],
    evidenceGap: "None — factual mechanism claim. No clinical evidence required.",
    studyPriority: "low",
    linkedLegalClaimId: "claim-03",
  },
  {
    id: "re-03",
    claim: "Tracks 7 interconnected drivers of fertility health",
    claimType: "mechanism",
    currentStatus: "substantiated",
    supportingStudies: ["Product feature description"],
    evidenceGap: "None required for mechanism claim. However, publishing the 7-driver framework in a peer-reviewed journal would strengthen authority significantly.",
    studyPriority: "medium",
    linkedLegalClaimId: "claim-02",
  },
  {
    id: "re-04",
    claim: "Closed-loop system identifies root causes and adapts treatment in real-time",
    claimType: "mechanism",
    currentStatus: "partial",
    supportingStudies: ["Internal intervention cascade data (N=3 documented cascades)"],
    evidenceGap: "Need systematic documentation of intervention cascades (N>50) and publication of adaptive protocol methodology.",
    studyPriority: "critical",
  },
  {
    id: "re-05",
    claim: "Supplements improve fertility markers within 2 cycles",
    claimType: "efficacy",
    currentStatus: "unsubstantiated",
    supportingStudies: [],
    evidenceGap: "No published data on Conceivable-specific supplement protocol outcomes. Need controlled study comparing Conceivable supplements vs. generic prenatal.",
    studyPriority: "high",
  },
];

// ============================================================
// RESEARCH FEED
// ============================================================

export const RESEARCH_FEED: ResearchFeedItem[] = [
  {
    id: "rf-01",
    title: "Heart Rate Variability as a Biomarker for Fertility: A Systematic Review",
    authors: "Chen et al.",
    journal: "Reproductive BioMedicine Online",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    relevantFactors: ["HRV", "Ovulation"],
    summary: "Systematic review of 23 studies finding HRV correlates with ovarian function and IVF outcomes. Calls for prospective studies in natural conception.",
    implication: "VALIDATES our HRV tracking approach. Directly supports Study Opportunity #2. Cite in grant applications.",
  },
  {
    id: "rf-02",
    title: "Glucose Variability and Menstrual Cycle Irregularity in Non-Diabetic Women",
    authors: "Park & Kim",
    journal: "Journal of Clinical Endocrinology & Metabolism",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    relevantFactors: ["Glucose", "Ovulation", "Cycle Regularity"],
    summary: "First large-scale study (N=1,200) showing glucose variability >30mg/dL associated with 2.1x risk of irregular cycles in non-diabetic women.",
    implication: "CONFIRMS our glucose hypothesis. Our internal data (r=0.64) aligns with their findings. Cite in our glucose study protocol.",
  },
  {
    id: "rf-03",
    title: "Wearable-Derived Sleep Metrics and Reproductive Hormone Levels",
    authors: "Thompson et al.",
    journal: "Sleep Medicine",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relevantFactors: ["Sleep", "Progesterone", "Estrogen"],
    summary: "Consumer wearable sleep data (Oura, Apple Watch) shown to predict reproductive hormone variations with 71% accuracy.",
    implication: "SUPPORTS our wearable data approach. Their methodology validates using consumer devices for clinical research. Potential collaboration opportunity.",
  },
];

// ============================================================
// USER DROP-OFF ANALYSIS
// ============================================================

export const DROP_OFF_DATA = [
  { stage: "Onboarding Complete", pct: 100, users: 105 },
  { stage: "Week 1 Active", pct: 94, users: 99 },
  { stage: "Week 2 Active", pct: 87, users: 91 },
  { stage: "Week 4 Active", pct: 78, users: 82 },
  { stage: "Week 8 Active", pct: 64, users: 67 },
  { stage: "Week 12 Active", pct: 52, users: 55 },
  { stage: "Conceived", pct: 31, users: 33 },
];
