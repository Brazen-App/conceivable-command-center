// Legal / IP / Compliance — The Immune System
// Protects everything and feeds constraints into every other department

// ============================================================
// TYPES
// ============================================================

export type PatentStatus = "granted" | "pending" | "provisional" | "planned" | "urgent";
export type FilingPriority = "critical" | "high" | "medium" | "low";
export type CompetitorThreatLevel = "high" | "medium" | "low";
export type ClaimStatus = "approved" | "restricted" | "prohibited";
export type RegulatorBody = "FDA" | "FTC" | "HIPAA" | "State";
export type ComplianceItemStatus = "compliant" | "in_progress" | "non_compliant" | "not_started";
export type VendorRiskLevel = "low" | "medium" | "high" | "critical";

export interface Patent {
  id: string;
  title: string;
  shortTitle: string;
  patentNumber?: string;
  type: "utility" | "provisional" | "continuation" | "design";
  status: PatentStatus;
  filingDate?: string;
  grantDate?: string;
  expirationDate?: string;
  description: string;
  keyClaims: string[];
  assignedAttorney?: string;
  priorArtNotes?: string;
  competitiveThreatLevel: CompetitorThreatLevel;
  filingPriority?: FilingPriority;
  filingDeadline?: string;
  deadlineReason?: string;
  crossDeptConnections: string[];
}

export interface CompetitorFiling {
  id: string;
  competitor: string;
  title: string;
  patentNumber?: string;
  filingDate: string;
  status: "published" | "granted" | "pending";
  relevance: "direct" | "adjacent" | "tangential";
  threatLevel: CompetitorThreatLevel;
  summary: string;
  overlapsWithUs: string[];
  agentAssessment: string;
}

export interface ComplianceClaim {
  id: string;
  claim: string;
  category: "efficacy" | "safety" | "testimonial" | "comparison" | "mechanism" | "general";
  status: ClaimStatus;
  citation?: string;
  studyDetails?: string;
  disclaimer?: string;
  restrictionReason?: string;
  lastReviewed: string;
}

export interface RegulatoryItem {
  id: string;
  body: RegulatorBody;
  area: string;
  requirement: string;
  status: ComplianceItemStatus;
  notes: string;
  deadline?: string;
  assignee?: string;
  lastUpdated: string;
}

export interface PendingReview {
  id: string;
  source: "content" | "email" | "social" | "website";
  title: string;
  flagReason: string;
  flagType: "health_claim" | "testimonial" | "comparison" | "outcome" | "pregnancy_rate" | "missing_disclaimer";
  severity: "critical" | "warning" | "info";
  content: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "needs_revision";
  reviewerNotes?: string;
}

export interface TestimonialFlag {
  id: string;
  name: string;
  source: string;
  claimedOutcome: string;
  issue: string;
  severity: "critical" | "warning";
  status: "unresolved" | "resolved" | "under_review";
  requiredAction: string;
}

export interface HIPAAChecklistItem {
  id: string;
  category: string;
  requirement: string;
  status: ComplianceItemStatus;
  evidence?: string;
  lastAudit?: string;
  nextAudit?: string;
  notes?: string;
}

export interface VendorReview {
  id: string;
  vendor: string;
  service: string;
  riskLevel: VendorRiskLevel;
  baaStatus: "executed" | "pending" | "not_required" | "needed";
  lastReview: string;
  nextReview: string;
  issues: string[];
  status: ComplianceItemStatus;
}

export interface PrivacyPolicy {
  id: string;
  version: string;
  effectiveDate: string;
  changes: string[];
  status: "active" | "draft" | "archived";
  reviewedBy?: string;
}

// ============================================================
// PATENT PORTFOLIO
// ============================================================

export const PATENTS: Patent[] = [
  {
    id: "pat-01",
    title: "System and Method for Basal Body Temperature and Hormone Pattern Interpretation for Fertility Assessment",
    shortTitle: "BBT + Hormone Interpretation",
    patentNumber: "US20160140314A1",
    type: "utility",
    status: "granted",
    filingDate: "2015-11-13",
    grantDate: "2016-05-19",
    description: "Method for interpreting basal body temperature data beyond simple ovulation confirmation, identifying hormonal patterns including progesterone sufficiency, thyroid function indicators, and stress-cortisol interactions from temperature dynamics.",
    keyClaims: [
      "Interpreting BBT patterns for progesterone sufficiency assessment",
      "Identifying thyroid function indicators from temperature variability",
      "Correlating temperature dynamics with hormonal cascade patterns",
      "Multi-day pattern recognition for cycle health assessment",
    ],
    assignedAttorney: "Morrison & Foerster LLP",
    competitiveThreatLevel: "medium",
    crossDeptConnections: [
      "Fundraising: Foundation of IP portfolio for investor pitch",
      "Content: Can reference granted patent in authority-building content",
    ],
  },
  {
    id: "pat-02",
    title: "Composite Fertility Health Score System Using Multi-Signal Data Aggregation and Personalized Recommendation Architecture",
    shortTitle: "CON Score System",
    patentNumber: "US-APP-2024-PENDING",
    type: "utility",
    status: "pending",
    filingDate: "2024-03-15",
    description: "System for generating a composite fertility health score (CON Score) by aggregating data from multiple physiological signals including temperature, HRV, sleep architecture, cycle data, and lifestyle inputs. Includes personalized recommendation engine and system-level platform architecture.",
    keyClaims: [
      "Composite scoring methodology using weighted multi-signal inputs",
      "Dynamic score recalculation based on temporal data patterns",
      "Personalized intervention recommendations mapped to score drivers",
      "System architecture for real-time physiological data processing",
      "Platform integration with consumer wearable devices",
    ],
    assignedAttorney: "Morrison & Foerster LLP",
    priorArtNotes: "Key differentiator from Oura/Apple: composite SCORING (not just tracking) with actionable recommendation output. Prior art search completed — no direct overlap found with scoring methodology.",
    competitiveThreatLevel: "high",
    crossDeptConnections: [
      "Fundraising: Core IP asset — central to investor narrative",
      "Operations: CON Score is the product's primary metric",
    ],
  },
  {
    id: "pat-03",
    title: "Closed-Loop Physiologic Correction and Adaptive Escalation Architecture",
    shortTitle: "Closed-Loop System",
    type: "provisional",
    status: "urgent",
    filingPriority: "critical",
    filingDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineReason: "MUST FILE BEFORE FUNDRAISE. This is the deepest technical moat. Without IP protection, the closed-loop methodology is exposed during investor due diligence.",
    description: "Architecture for measuring physiologic response to health interventions, determining whether an intervention corrected the underlying driver, and escalating or modifying protocols based on response failure. Includes intervention tier progression and algorithmic branching based on physiological response thresholds.",
    keyClaims: [
      "Measuring physiologic response to a specific intervention",
      "Determining whether intervention corrected the underlying driver",
      "Escalating or modifying protocol based on response failure",
      "Intervention tier progression from lifestyle to supplement to clinical",
      "Algorithmic branching based on response thresholds",
      "Temporal response window calibration per intervention type",
    ],
    assignedAttorney: "TBD — Need patent counsel specializing in digital health methods",
    priorArtNotes: "UNIQUE: No existing patents cover closed-loop fertility intervention with adaptive escalation. Closest prior art is in diabetes management (insulin dosing), but fertility context is novel. Must file provisional ASAP to establish priority date.",
    competitiveThreatLevel: "high",
    crossDeptConnections: [
      "Fundraising: CRITICAL — investors will ask about defensibility. This IS the moat.",
      "Strategy: 10x filing — one patent protects the entire intervention engine",
      "Operations: Filing deadline should be #1 company priority",
    ],
  },
  {
    id: "pat-04",
    title: "Pregnancy Outcome Risk Prediction and Mitigation Layer",
    shortTitle: "Pregnancy Risk Prediction",
    type: "provisional",
    status: "planned",
    filingPriority: "high",
    filingDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineReason: "File within 60 days. This is both a patent AND the next product the CEO is building. Establishing priority date protects the product roadmap.",
    description: "Predictive analytics system for adverse pregnancy events including preeclampsia, preterm birth, and gestational diabetes. Monitors early pregnancy physiological signals, predicts adverse outcomes using multi-signal pattern recognition, and deploys corrective interventions post-conception.",
    keyClaims: [
      "Predicting adverse pregnancy outcomes from pre-conception physiological baselines",
      "Monitoring early pregnancy signals via consumer wearable integration",
      "Multi-signal pattern recognition for preeclampsia risk prediction",
      "Deploying corrective interventions post-conception based on risk assessment",
      "Continuous pregnancy stability verification through wearable data",
    ],
    assignedAttorney: "TBD",
    priorArtNotes: "Some overlap with clinical monitoring systems (hospital-grade), but consumer wearable + AI prediction + intervention deployment is novel. Prior art review in progress.",
    competitiveThreatLevel: "medium",
    crossDeptConnections: [
      "Fundraising: Expands TAM from TTC to pregnancy monitoring — 10x market size",
      "Content: Pregnancy monitoring is a massive content opportunity",
      "Strategy: This is the product Kirsten is building next — IP must lead product",
    ],
  },
  {
    id: "pat-05",
    title: "Driver Attribution Hierarchy and Multimodal Weighted Causality System",
    shortTitle: "Driver Attribution Hierarchy",
    type: "provisional",
    status: "planned",
    filingPriority: "medium",
    filingDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    deadlineReason: "File within 90 days. Protects the methodology that makes the 7-driver framework technically defensible.",
    description: "System for identifying causal drivers behind fertility impairment, ranking drivers by impact, mapping each driver to a specific intervention ladder, and performing weighted cross-signal inference. Includes conflict resolution between competing signals and signal hierarchy modeling.",
    keyClaims: [
      "Identifying causal drivers behind fertility impairment from multi-signal data",
      "Ranking drivers by weighted impact on composite fertility score",
      "Mapping driver to intervention ladder with ordered protocol tiers",
      "Weighted cross-signal inference resolving conflicting indicators",
      "Dynamic signal hierarchy modeling adapting to individual user patterns",
    ],
    assignedAttorney: "TBD",
    priorArtNotes: "Novel methodology. Nearest prior art is in general health risk scoring (Framingham), but fertility-specific driver attribution with intervention mapping is new. Need thorough prior art search before filing.",
    competitiveThreatLevel: "low",
    crossDeptConnections: [
      "Content: The 7 drivers framework is core to all educational content",
      "Email: Education sequence (Week 3-4) teaches this framework",
    ],
  },
];

// ============================================================
// COMPETITOR IP MONITORING
// ============================================================

export const COMPETITOR_FILINGS: CompetitorFiling[] = [
  {
    id: "comp-01",
    competitor: "Oura Health",
    title: "Method for Predicting Ovulation Using Multi-Sensor Wearable Data",
    patentNumber: "US20240001234A1",
    filingDate: "2024-06-15",
    status: "published",
    relevance: "direct",
    threatLevel: "medium",
    summary: "Oura's patent covers ovulation prediction using temperature + HRV from ring-based wearable. Claims 5-day advance prediction window.",
    overlapsWithUs: ["Temperature pattern analysis", "HRV correlation to cycle events"],
    agentAssessment: "Overlap is in RAW SIGNAL COLLECTION, not in scoring, intervention, or closed-loop methodology. Our patents cover what happens AFTER the data is collected. Low threat to our core IP, but monitor for claim amendments.",
  },
  {
    id: "comp-02",
    competitor: "Natural Cycles",
    title: "Dual-Mode Reproductive Health Application with Algorithm Switching",
    patentNumber: "EP4123456B1",
    filingDate: "2023-11-20",
    status: "granted",
    relevance: "adjacent",
    threatLevel: "low",
    summary: "Natural Cycles patent covers their algorithm that switches between contraceptive and conception mode. Single-signal (BBT) approach.",
    overlapsWithUs: ["BBT analysis methodology"],
    agentAssessment: "Single-signal, mode-switching approach is fundamentally different from our multi-signal composite scoring. No meaningful overlap with CON Score or closed-loop methodology. Low threat.",
  },
  {
    id: "comp-03",
    competitor: "Clue (BioWink GmbH)",
    title: "Machine Learning System for Menstrual Cycle Pattern Recognition",
    patentNumber: "DE102024000789",
    filingDate: "2024-09-01",
    status: "pending",
    relevance: "adjacent",
    threatLevel: "medium",
    summary: "Clue filing covers ML-based cycle pattern recognition for irregularity detection. Uses self-reported data + some wearable integration.",
    overlapsWithUs: ["Cycle pattern recognition", "Irregularity detection algorithms"],
    agentAssessment: "Pattern recognition for DETECTION overlaps with our driver identification, but Clue stops at detection — no scoring, no intervention, no closed-loop. Monitor for claim broadening in prosecution.",
  },
  {
    id: "comp-04",
    competitor: "Flo Health",
    title: "AI-Powered Conversational Health Assistant for Reproductive Wellness",
    filingDate: "2025-01-10",
    status: "pending",
    relevance: "tangential",
    threatLevel: "low",
    summary: "Flo filing covers their AI chatbot architecture for reproductive health Q&A. Generalized health information delivery, not personalized intervention.",
    overlapsWithUs: ["AI health coaching interface"],
    agentAssessment: "Chatbot architecture is distinct from our closed-loop intervention system. Kai is fundamentally different — personalized to user data, not generic Q&A. No meaningful IP threat.",
  },
  {
    id: "comp-05",
    competitor: "Apple Inc.",
    title: "Wearable-Based Cycle Deviation Alert System",
    patentNumber: "US20250056789A1",
    filingDate: "2025-02-15",
    status: "published",
    relevance: "adjacent",
    threatLevel: "medium",
    summary: "Apple patent covers their iOS cycle deviation alert system using Apple Watch temperature data. Alerts when cycle deviates >7 days from baseline.",
    overlapsWithUs: ["Wearable temperature monitoring", "Cycle deviation detection"],
    agentAssessment: "Apple's approach: detect → alert → 'see your doctor.' Our approach: detect → diagnose driver → recommend intervention → verify response. Fundamentally different scope. Their mass-market approach validates the category but doesn't threaten our IP position.",
  },
];

// ============================================================
// COMPLIANCE CLAIMS DATABASE
// ============================================================

export const COMPLIANCE_CLAIMS: ComplianceClaim[] = [
  // APPROVED CLAIMS
  {
    id: "claim-01",
    claim: "150-260% improvement in likelihood of natural conception",
    category: "efficacy",
    status: "approved",
    citation: "Conceivable Pilot Study (2023), N=105, 240,000+ data points, published internally",
    studyDetails: "Prospective cohort study of 105 women using the Conceivable protocol over 6 months. Primary endpoint: natural conception rate vs. age-matched control group. Results: 150-260% improvement depending on baseline CON Score.",
    disclaimer: "Results from a pilot study of 105 participants. Individual results may vary. Conceivable is not a medical device and does not diagnose, treat, or cure any condition.",
    lastReviewed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-02",
    claim: "Conceivable tracks 7 interconnected drivers of fertility health",
    category: "mechanism",
    status: "approved",
    citation: "Product feature description — factual claim about system capabilities",
    disclaimer: "No disclaimer required — factual product description",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-03",
    claim: "AI-powered personalized recommendations based on your unique health data",
    category: "mechanism",
    status: "approved",
    citation: "Product feature description — factual claim about AI functionality",
    disclaimer: "Recommendations are for informational purposes and do not constitute medical advice.",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-04",
    claim: "Our system analyzes connections between sleep, hormones, stress, nutrition, and fertility outcomes",
    category: "mechanism",
    status: "approved",
    citation: "Product feature description — factual",
    disclaimer: "No disclaimer required — factual product description",
    lastReviewed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-05",
    claim: "The CON Score represents your overall fertility readiness",
    category: "mechanism",
    status: "approved",
    citation: "Product feature description",
    disclaimer: "The CON Score is a wellness metric and is not a medical diagnostic tool.",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // RESTRICTED CLAIMS
  {
    id: "claim-06",
    claim: "Conceivable can help you get pregnant",
    category: "efficacy",
    status: "restricted",
    restrictionReason: "Direct pregnancy outcome claim requires stronger clinical evidence than current pilot study (N=105). Use approved language: 'improve fertility health markers' or reference pilot study with full disclaimers.",
    lastReviewed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-07",
    claim: "Better than traditional fertility care / replaces your doctor",
    category: "comparison",
    status: "prohibited",
    restrictionReason: "FTC prohibits comparative superiority claims without head-to-head clinical trials. We position as COMPLEMENT to clinical care, never a replacement. This is a hard compliance line.",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-08",
    claim: "Clinically proven / clinically validated",
    category: "efficacy",
    status: "restricted",
    restrictionReason: "Pilot study (N=105) does not meet the standard for 'clinically proven.' Use: 'supported by clinical research' or 'pilot study demonstrated.' Full clinical validation requires larger RCT.",
    lastReviewed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-09",
    claim: "Conceivable diagnoses fertility problems",
    category: "mechanism",
    status: "prohibited",
    restrictionReason: "Conceivable is a wellness product, not a medical device. We do NOT diagnose. We 'identify patterns,' 'track signals,' and 'provide insights.' Diagnosis language triggers FDA device classification requirements.",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "claim-10",
    claim: "Guaranteed results / money-back if you don't conceive",
    category: "efficacy",
    status: "prohibited",
    restrictionReason: "FTC strictly prohibits guarantees for health outcomes. No guarantee language permitted in any context. Additionally, linking refund to health outcome creates implied medical device classification risk.",
    lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// REGULATORY TRACKER
// ============================================================

export const REGULATORY_ITEMS: RegulatoryItem[] = [
  // FDA
  {
    id: "reg-01",
    body: "FDA",
    area: "Supplement Claims",
    requirement: "All supplement recommendations must include structure/function claim disclaimers per DSHEA. Cannot claim to treat, cure, or prevent disease.",
    status: "compliant",
    notes: "Kai's supplement recommendations include required disclaimer. Auto-appended in recommendation engine.",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-02",
    body: "FDA",
    area: "Device Classification — Halo Ring",
    requirement: "Determine if Conceivable + Halo Ring integration constitutes a medical device under FDA classification. If wellness device: Class I exempt. If making diagnostic claims: Class II 510(k) required.",
    status: "in_progress",
    notes: "Current position: wellness device (general wellness, non-diagnostic). Maintaining this classification requires careful language — no diagnostic claims. Patent counsel reviewing.",
    assignee: "Patent Counsel",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-03",
    body: "FDA",
    area: "Software as Medical Device (SaMD)",
    requirement: "FDA's SaMD framework may apply if Conceivable's AI makes clinical decisions. Current guidance: wellness-focused AI that provides 'information' (not 'decisions') is exempt.",
    status: "in_progress",
    notes: "CRITICAL: Kai must frame outputs as 'insights' and 'information,' never 'diagnoses' or 'prescriptions.' Language review of all Kai outputs required.",
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // FTC
  {
    id: "reg-04",
    body: "FTC",
    area: "Health Product Advertising",
    requirement: "All health product claims must be truthful, not misleading, and substantiated. Testimonials must reflect typical results or include clear disclaimers.",
    status: "in_progress",
    notes: "Email sequence and content pipeline have compliance auto-scan. Testimonial language under review — see flagged items.",
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-05",
    body: "FTC",
    area: "Testimonial Compliance",
    requirement: "FTC Endorsement Guides require: (1) Testimonials reflect typical experience OR include 'Results not typical' disclaimer, (2) Material connections disclosed, (3) No fabricated testimonials for health products.",
    status: "non_compliant",
    notes: "URGENT: Email sequence contains stories about 'Sarah' (PCOS), 'Lisa' (recurrent loss), 'Maya' (IVF). Status of these testimonials (real vs. composite) is UNVERIFIED. Must resolve before publishing.",
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // HIPAA
  {
    id: "reg-06",
    body: "HIPAA",
    area: "Protected Health Information (PHI)",
    requirement: "If Conceivable collects, stores, or transmits PHI, full HIPAA compliance is required including BAAs with all vendors, encryption at rest and in transit, access controls, and audit logging.",
    status: "in_progress",
    notes: "Health data is encrypted in transit (TLS 1.3) and at rest (AES-256). BAAs needed with all data processors. Audit logging implementation in progress.",
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reg-07",
    body: "HIPAA",
    area: "Breach Notification",
    requirement: "Breach notification procedures must be documented and tested. 60-day notification requirement to HHS for breaches affecting 500+ individuals.",
    status: "not_started",
    notes: "Breach notification plan needs to be drafted, reviewed by counsel, and tested. Assign to security team.",
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // State
  {
    id: "reg-08",
    body: "State",
    area: "Telehealth Regulations",
    requirement: "If Conceivable's AI coaching is considered telehealth, state-by-state licensing requirements may apply. Current position: wellness coaching, not telehealth.",
    status: "in_progress",
    notes: "Legal review of 50-state telehealth definitions underway. Key risk states: CA, NY, TX (strict definitions). Kai's language must stay within wellness coaching boundaries.",
    assignee: "Legal Counsel",
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// PENDING CONTENT REVIEWS
// ============================================================

export const PENDING_REVIEWS: PendingReview[] = [
  {
    id: "review-01",
    source: "email",
    title: "Email #7 — CON Score Introduction",
    flagReason: "Contains efficacy implications: 'the number that changes everything'",
    flagType: "health_claim",
    severity: "warning",
    content: "Subject line 'Your CON Score: the number that changes everything' implies health outcome. Body claims score 'identifies which specific drivers are holding your score back' — mechanism claim needs review.",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "review-02",
    source: "email",
    title: "Email #13 — Launch Announcement",
    flagReason: "Contains outcome claim: 'real-time analysis of your fertility health data'",
    flagType: "health_claim",
    severity: "info",
    content: "Claims 'real-time analysis of your fertility health data' and 'the full system, live.' Need to ensure this doesn't imply medical-grade diagnostic capability.",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "review-03",
    source: "content",
    title: "LinkedIn Post — Harvard Stress Study",
    flagReason: "References specific study outcomes — needs citation verification",
    flagType: "health_claim",
    severity: "info",
    content: "Post references 'Harvard study showed cortisol patterns predict IVF success with 71% accuracy.' Need to verify study is peer-reviewed and citation is accurate before publishing.",
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "review-04",
    source: "content",
    title: "Instagram Carousel — Seed Cycling Science",
    flagReason: "Comparative health claims about alternative practices",
    flagType: "comparison",
    severity: "warning",
    content: "Carousel contrasts seed cycling claims with clinical evidence. Must ensure we're not making comparative efficacy claims about our product vs. seed cycling. Frame as 'what the research shows' not 'our approach is better.'",
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "review-05",
    source: "email",
    title: "Email #20 — Founder Letter",
    flagReason: "Personal testimonial from founder with implied health outcomes",
    flagType: "testimonial",
    severity: "warning",
    content: "Founder letter implies personal expertise leading to health solution. While factual, framing needs review to ensure it doesn't constitute an implied health outcome guarantee.",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

// ============================================================
// TESTIMONIAL FLAGS
// ============================================================

export const TESTIMONIAL_FLAGS: TestimonialFlag[] = [
  {
    id: "test-flag-01",
    name: "Sarah",
    source: "Email Sequence / Website",
    claimedOutcome: "PCOS diagnosis, used Conceivable protocol, improved cycle regularity",
    issue: "UNVERIFIED: Is 'Sarah' a real patient with documented consent? If real: needs FTC-compliant disclaimer ('Results not typical. Individual results may vary.'). If composite/fictional: CANNOT be presented as a real testimonial for a health product — FTC violation.",
    severity: "critical",
    status: "unresolved",
    requiredAction: "CEO must confirm: Is Sarah real? If yes: obtain written consent + add FTC disclaimer. If no: rewrite as clearly fictional example or remove entirely.",
  },
  {
    id: "test-flag-02",
    name: "Lisa",
    source: "Email Sequence / Website",
    claimedOutcome: "Recurrent pregnancy loss, used Conceivable, achieved successful pregnancy",
    issue: "UNVERIFIED: Is 'Lisa' a real patient? Recurrent loss → successful pregnancy is a HIGH-RISK health outcome claim. FTC scrutiny is especially high for pregnancy outcome claims in health products.",
    severity: "critical",
    status: "unresolved",
    requiredAction: "CEO must confirm: Is Lisa real? If yes: obtain written consent, add strong FTC disclaimer, legal review of exact language. If no: MUST REMOVE — fabricated pregnancy outcome testimonials are a serious FTC violation risk.",
  },
  {
    id: "test-flag-03",
    name: "Maya",
    source: "Email Sequence / Website",
    claimedOutcome: "Multiple IVF failures, used Conceivable, achieved pregnancy",
    issue: "UNVERIFIED: Is 'Maya' a real patient? IVF failure → pregnancy claim implies Conceivable succeeded where medical treatment failed — extremely high regulatory risk. This could be interpreted as an implied medical device claim.",
    severity: "critical",
    status: "unresolved",
    requiredAction: "CEO must confirm: Is Maya real? If yes: obtain consent, add robust disclaimer, legal review mandatory. If no: MUST REMOVE IMMEDIATELY. This carries the highest regulatory risk of all three testimonials.",
  },
];

// ============================================================
// HIPAA COMPLIANCE CHECKLIST
// ============================================================

export const HIPAA_CHECKLIST: HIPAAChecklistItem[] = [
  {
    id: "hipaa-01",
    category: "Administrative Safeguards",
    requirement: "Security Officer Designation",
    status: "compliant",
    evidence: "CTO designated as Security Officer",
    lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-02",
    category: "Administrative Safeguards",
    requirement: "Risk Assessment (annual)",
    status: "in_progress",
    notes: "Annual risk assessment due. Initial assessment completed, full assessment in progress.",
    lastAudit: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    nextAudit: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-03",
    category: "Administrative Safeguards",
    requirement: "Workforce Training",
    status: "in_progress",
    notes: "HIPAA training program created. 6 of 8 team members completed. 2 pending.",
    lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-04",
    category: "Technical Safeguards",
    requirement: "Data Encryption at Rest",
    status: "compliant",
    evidence: "AES-256 encryption on all databases. Vercel Postgres encrypted at rest.",
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-05",
    category: "Technical Safeguards",
    requirement: "Data Encryption in Transit",
    status: "compliant",
    evidence: "TLS 1.3 enforced on all endpoints. HSTS enabled.",
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-06",
    category: "Technical Safeguards",
    requirement: "Access Controls & Authentication",
    status: "compliant",
    evidence: "MFA required for all admin access. Role-based access controls implemented.",
    lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-07",
    category: "Technical Safeguards",
    requirement: "Audit Logging",
    status: "in_progress",
    notes: "Access logging implemented for API endpoints. PHI access logging needs completion.",
    lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-08",
    category: "Physical Safeguards",
    requirement: "Workstation Security",
    status: "compliant",
    evidence: "Remote team — all devices encrypted, MDM enrolled, auto-lock policies enforced.",
    lastAudit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-09",
    category: "Organizational",
    requirement: "Business Associate Agreements (BAAs)",
    status: "in_progress",
    notes: "BAAs executed with primary vendors (Vercel, Anthropic). Pending: analytics, email, monitoring.",
    lastAudit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hipaa-10",
    category: "Organizational",
    requirement: "Breach Notification Procedures",
    status: "not_started",
    notes: "Breach notification plan not yet drafted. Required: incident response plan, notification templates, HHS reporting procedures.",
  },
];

// ============================================================
// VENDOR SECURITY REVIEWS
// ============================================================

export const VENDOR_REVIEWS: VendorReview[] = [
  {
    id: "vendor-01",
    vendor: "Vercel",
    service: "Hosting & Database (Postgres)",
    riskLevel: "low",
    baaStatus: "executed",
    lastReview: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    issues: [],
    status: "compliant",
  },
  {
    id: "vendor-02",
    vendor: "Anthropic",
    service: "Claude API (AI agents)",
    riskLevel: "medium",
    baaStatus: "executed",
    lastReview: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000).toISOString(),
    issues: ["Confirm PHI is not included in API prompts — data anonymization layer needed"],
    status: "in_progress",
  },
  {
    id: "vendor-03",
    vendor: "Mailchimp (Intuit)",
    service: "Email Marketing",
    riskLevel: "medium",
    baaStatus: "pending",
    lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    issues: ["BAA needed before sending health-related email content", "Review data retention policies"],
    status: "in_progress",
  },
  {
    id: "vendor-04",
    vendor: "Oura Health",
    service: "Wearable Data Integration",
    riskLevel: "high",
    baaStatus: "needed",
    lastReview: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    issues: ["BAA required for health data transfer", "Data flow mapping needed", "User consent for data sharing must be explicit"],
    status: "non_compliant",
  },
  {
    id: "vendor-05",
    vendor: "Apple HealthKit",
    service: "Wearable Data Integration",
    riskLevel: "medium",
    baaStatus: "not_required",
    lastReview: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    issues: ["Apple HealthKit guidelines require on-device processing where possible"],
    status: "in_progress",
  },
];

// ============================================================
// PRIVACY POLICIES
// ============================================================

export const PRIVACY_POLICIES: PrivacyPolicy[] = [
  {
    id: "policy-01",
    version: "2.1.0",
    effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    changes: [
      "Updated data retention periods for health data (now 7 years)",
      "Added Oura Ring data collection disclosure",
      "Clarified AI processing of health data",
      "Updated third-party vendor list",
    ],
    status: "active",
    reviewedBy: "Legal Counsel",
  },
  {
    id: "policy-02",
    version: "2.2.0",
    effectiveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    changes: [
      "Add Apple HealthKit data integration disclosure",
      "Update AI model provider disclosure (Anthropic Claude)",
      "Add pregnancy monitoring data handling section",
      "Revise user deletion rights procedures",
    ],
    status: "draft",
    reviewedBy: "Under review",
  },
  {
    id: "policy-03",
    version: "2.0.0",
    effectiveDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    changes: [
      "Major rewrite for HIPAA alignment",
      "Added health data specific sections",
      "Implemented data minimization principles",
    ],
    status: "archived",
    reviewedBy: "Legal Counsel + HIPAA Consultant",
  },
];
