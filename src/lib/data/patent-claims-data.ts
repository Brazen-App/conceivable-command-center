// Patent Claims — Complete Portfolio
// Patent 1 claims extracted verbatim from US10467382B2 (granted Nov 5, 2019)
// Patent 2 claims from CON Score filing (pending, not yet published)
// New filing recommendations based on product roadmap analysis

export interface PatentClaimSeed {
  id: string;
  claimNumber: number;
  claimText: string;
  claimType: "independent" | "dependent";
  dependsOn?: number;
  parentPatentId: string | null;
  parentPatentRef: string;
  valueTier: "HIGH" | "MEDIUM" | "LOW";
  estimatedValue: number;
  rationale: string;
  status: "granted" | "filed" | "not_drafted";
  priority: boolean;
  archived: boolean;
  category: string;
  urgency: "monitor" | "file_now" | "exploratory";
  priorArtRisk: "low" | "medium" | "high";
  followOnNote?: string;
}

// ══════════════════════════════════════════════════════════
// PATENT 1 — US10467382B2 (GRANTED)
// "Conceivable Basal Body Temperatures and Menstrual Cycle"
// Filed: Nov 14, 2014 | Granted: Nov 5, 2019 | Expires: Mar 16, 2037
// Inventors: Kirsten Karchmer, Witold Krassowski, Jonathan Berkowitz
// Assignee: Conceivable Inc (originally Brazen Inc)
// ══════════════════════════════════════════════════════════

const PATENT_1_REF = "US10467382B2 — Conceivable BBT & Menstrual Cycle";

const PATENT_1_CLAIMS: PatentClaimSeed[] = [
  // ── Independent Claim 1: Core Method ──
  {
    id: "pc-g01",
    claimNumber: 1,
    claimText:
      "A method of increasing a user's chances of conception using personalized herbal formulas, comprising: assessing a user's personalized fertility state; determining the deviation from the user's personalized fertility state and an ideal fertility state; identify a user's underlying fertility issues based on the deviation from the ideal fertility state; comparing the underlying fertility issues with herbal formulas capable of moving the user's personalized fertility state toward the ideal fertility state; and providing personalized herbal formula recommendations for the user to take to move the user's personalized fertility state toward the ideal fertility state.",
    claimType: "independent",
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 500000,
    rationale:
      "Core independent claim. Protects the entire methodology: assess state -> find deviation -> identify issues -> match formulas -> recommend. This is the foundational claim the entire Conceivable product is built on.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "NEEDS EXPANSION: This claim is herbal-formula specific. File a continuation or new application covering supplements broadly (not just herbs) and AI-driven recommendations. The new Conceivable app goes well beyond herbs.",
  },
  {
    id: "pc-g02",
    claimNumber: 2,
    claimText:
      "The method of claim 1, wherein assessing the user's personalized fertility state includes collecting data on menstrual parameters, lifestyle factors, and Basal body temperatures (\"BBT's\").",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 200000,
    rationale:
      "Defines the three data pillars: menstrual parameters, lifestyle factors, BBTs. This is exactly what the app collects. Strong dependent claim that broadens data collection scope.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g03",
    claimNumber: 3,
    claimText:
      "The method of claim 2, wherein collecting data may include, but is not necessarily limited to, high, low, or erratic BBT across the menstrual cycle, menstrual clotting, menstrual pain, insufficient menstrual flow, hemorrhagic menstrual flow, insufficient cervical discharge, irregular ovulation, symptoms associated with PMS such as bloating, irritability, headaches, breast tenderness, and cramping, and spotting.",
    claimType: "dependent",
    dependsOn: 2,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 120000,
    rationale:
      "Enumerates specific data signals — BBT patterns, menstrual quality, PMS symptoms. Important for claim breadth. The 'not necessarily limited to' language is favorable.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g04",
    claimNumber: 4,
    claimText:
      "The method of claim 2, wherein collecting data may identify subclinical factors and their causes that affect a user's personalized fertility state the user's ability to conceive.",
    claimType: "dependent",
    dependsOn: 2,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 250000,
    rationale:
      "KEY DIFFERENTIATOR. 'Subclinical factors' — problems doctors miss because they don't show up in standard testing. This is Kirsten's core thesis and a defensible moat. No competitor claims subclinical detection from self-reported data.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "File improvement patent adding AI/ML-based subclinical factor identification from wearable data (HRV, SpO2, sleep). Original claim uses self-reported data; wearable-based detection is a natural expansion.",
  },
  {
    id: "pc-g05",
    claimNumber: 5,
    claimText:
      'The method of claim 4, further comprising assigning the user a "Hurdle" or "Hurdles" of one or more symptoms that represents an underlying cause for the subclinical factors, wherein Hurdles and their main associated symptoms are selected from the group consisting of: a) Hot—high follicular phase basal body temperatures, scanty cervical discharge, insomnia; b) Cold—low luteal phase basal body temperatures, cold hands and feet, frequent urination; c) Stuck—PMS, erratic temperatures across the cycle, irritability; d) Pale—scanty menstrual blood, anxiety, pale skin; and e) Tired—fatigue, gas and bloating, loose stools, weight gain or retention.',
    claimType: "dependent",
    dependsOn: 4,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 350000,
    rationale:
      "THE HURDLES FRAMEWORK. This is Kirsten's proprietary diagnostic classification system (Hot/Cold/Stuck/Pale/Tired). Deeply unique, directly from her 20 years of TCM practice. No one else has this categorization. Extremely defensible.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "File improvement patent for AI-driven Hurdle classification using wearable signals instead of self-reported symptoms. Also consider expanding the Hurdle categories if the new product identifies additional patterns.",
  },
  {
    id: "pc-g06",
    claimNumber: 6,
    claimText:
      "The method of claim 5, wherein after the Hurdle or Hurdles are assigned, the personalized herbal formula recommendations for the user are recommended according to phases of a menstrual cycle to support fertility wellness, wherein the goal for the phases are selected from the group consisting of: a) Bleeding—Remove old, clotty, or stale uterine lining, decrease menstrual pain, improve uterine blood flow; b) Follicular—Regulate BBT, build healthy uterine lining, regulate ovulation, promote follicular development; and c) Luteal—Regulate BBT, enhance progesterone function, stabilize uterine lining, maintain pregnancy.",
    claimType: "dependent",
    dependsOn: 5,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 300000,
    rationale:
      "Phase-specific intervention mapping. Hurdle + Cycle Phase = specific recommendation. This is the core logic engine. Competitors track phases but don't MAP INTERVENTIONS to phase + hurdle combination.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "Expand to cover supplement packs (not just herbs) mapped to cycle phases. The new product uses personalized supplement packs — this is a natural continuation.",
  },
  {
    id: "pc-g07",
    claimNumber: 7,
    claimText:
      "The method of claim 6, wherein once the goal is completed, the method makes personalized herbal formula recommendations to address the underlying fertility issues.",
    claimType: "dependent",
    dependsOn: 6,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 80000,
    rationale: "Completion-based recommendation refinement. Supports the adaptive nature of the system.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g08",
    claimNumber: 8,
    claimText:
      "The method of claim 1, further comprising a software program to perform the method, including: assessing a user's personalized fertility state; determining the deviation from the user's personalized fertility state and an ideal fertility state; identify a user's underlying fertility issues based on the deviation from the ideal fertility state; comparing the underlying fertility issues with herbal formulas; and providing personalized herbal formula recommendations.",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 300000,
    rationale:
      "Software implementation of the core method. This is what makes the patent applicable to the app. Without this claim, the patent would only cover manual (human practitioner) implementation.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g09",
    claimNumber: 9,
    claimText:
      "The method of claim 1, further comprising providing the user with fertility acupuncture care and/or other complementary, alternative, holistic, or allopathic fertility care and/or wellness providers and/or clinics specifically designed according to the users underlying fertility issues.",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 100000,
    rationale:
      "Referral and provider matching based on fertility assessment. Supports future marketplace/referral features.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
  },

  // ── Independent Claim 10: Herbal System ──
  {
    id: "pc-g10",
    claimNumber: 10,
    claimText:
      "An herbal system of actionable changes to move a user's personalized fertility state toward an ideal fertility state cycle using herbs exclusively selected for user, comprising: identification of the user's personalized fertility state, including menstrual cycle day and phase; comparison between the user's personalized fertility state and the ideal fertility state to determine a deviation between them; identification of one or more herbal formulas based on the deviation to provide actionable changes corresponding to the user's menstrual cycle day and phase; and recommend the one or more personalized herbal formulas.",
    claimType: "independent",
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 400000,
    rationale:
      "Second independent claim. Protects the SYSTEM (not just method) — the product itself. Cycle-day-and-phase-specific interventions. Key for defensive use against competitors.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "File continuation covering supplement systems (beyond herbs). Also cover AI-driven formula selection vs. rules-based selection.",
  },
  {
    id: "pc-g11",
    claimNumber: 11,
    claimText:
      "The system of claim 10, wherein the user's menstrual cycle phases are selected from the group consisting of: a) Bleeding; b) Follicular; and c) Luteal — each with specific goals for fertility support.",
    claimType: "dependent",
    dependsOn: 10,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 100000,
    rationale: "Defines the phase-based framework for the system claim.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g12",
    claimNumber: 12,
    claimText:
      "The system of claim 11, wherein the one or more herbal formulas may include: a) For Bleeding: Release; b) For Follicular: Enrich, Cool, Regulate, Energize; c) For Luteal: Warm, Lift, Unwind — each with specific TCM-based functions.",
    claimType: "dependent",
    dependsOn: 11,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 150000,
    rationale:
      "Names the specific proprietary formulas (Release, Enrich, Cool, Regulate, Energize, Warm, Lift, Unwind). Protects Conceivable's exact product line at the patent level.",
    status: "granted",
    priority: false,
    archived: false,
    category: "supplement",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g13",
    claimNumber: 13,
    claimText:
      "The system of claim 10, further including a software program configured to: receive a user's personalized data; calculate the user's personalized fertility state; determine a deviation between user's personalized fertility state and the ideal fertility state; identification of one or more herbal formulas based on the deviation; and recommend the one or more personalized herbal formulas.",
    claimType: "dependent",
    dependsOn: 10,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 250000,
    rationale: "Software implementation of the system claim. Critical for app-based enforcement.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },

  // ── Independent Claim 14: Fertility Metrics Software ──
  {
    id: "pc-g14",
    claimNumber: 14,
    claimText:
      "A software program using fertility metrics to assist a user to reach their optimal fecundity with the use of herbal formulas, comprising: record a variety of user fertility metrics scores; enter the fertility metrics scores into the software program; an electronic device having a processor configured to run the software program to process the user's fertility metrics scores; calculate a potential fertility metrics score with the software program on how close the user is to their optimal fecundability; and recommend herbal formulas by the software program based on the calculated potential fertility metrics to increase their optimal fecundability.",
    claimType: "independent",
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 500000,
    rationale:
      "MOST VALUABLE CLAIM. Independent software claim that covers: collecting fertility metrics, calculating a SCORE, and making recommendations. This is essentially the Conceivable Score before it was called that. Priority date 2014 means strong position.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "This claim mentions 'herbal formulas' — the CON Score patent (pat-02) should broaden to supplements, lifestyle, and AI-driven recommendations. Claim 14 is the seed; CON Score patent is the tree.",
  },
  {
    id: "pc-g15",
    claimNumber: 15,
    claimText:
      'The software program of claim 14, wherein the user fertility metrics scores are selected from the group consisting of: Cycle Health scores, Basal Body Temperature ("BBT") scores, Profile scores and Lifestyle scores.',
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 200000,
    rationale:
      "Defines the 4-pillar scoring system: Cycle Health, BBT, Profile, Lifestyle. This is the conceptual ancestor of the Conceivable Score. Extremely important for establishing priority.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g16",
    claimNumber: 16,
    claimText:
      "The software program of claim 14, wherein the user would enter Cycle Health Scores selected from the group consisting of: Length of period, Days Bleeding, blood Color, Clotting, Volume, Cramping, PMS and Cervical Fluid.",
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 80000,
    rationale: "Enumerates Cycle Health scoring inputs. Establishes data collection scope.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g17",
    claimNumber: 17,
    claimText:
      "The software program of claim 14, wherein the user would enter BBT Scores selected from the group consisting of: Volatility, Average Follicular Temp, Average Luteal Temp, Follicular Length and Luteal Length.",
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 120000,
    rationale:
      "BBT scoring methodology — volatility, follicular/luteal averages, phase lengths. More specific than any competitor's BBT analysis claims.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g18",
    claimNumber: 18,
    claimText:
      "The software program of claim 14, wherein the user would enter Profile Scores selected from the group consisting of: Hot, Cold, Stuck, Pale, Tired, Energy, Digestion, Elimination, Sleep Quality and Mood.",
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 200000,
    rationale:
      "Links the Hurdles framework (Hot/Cold/Stuck/Pale/Tired) into the scoring software. Also includes Energy, Digestion, Elimination, Sleep, Mood — the holistic profile that differentiates Conceivable from pure-BBT trackers.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g19",
    claimNumber: 19,
    claimText:
      "The software program of claim 14, wherein the user would enter Lifestyle Scores selected from the group consisting of: Herbs, Sleep, Hydration and Diet.",
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 80000,
    rationale: "Lifestyle factor inputs for the scoring system.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g20",
    claimNumber: 20,
    claimText:
      "The software program of claim 14, wherein the software program is configured to track the users fertility metrics in real-time and suggest improvements or changes that they are making and that are working, including the herbal formulas they are taking.",
    claimType: "dependent",
    dependsOn: 14,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 250000,
    rationale:
      "REAL-TIME TRACKING + FEEDBACK LOOP. The software tracks what's working and suggests changes. This is the precursor to the closed-loop system (pat-03). Establishes priority date for adaptive recommendation.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
    followOnNote:
      "The closed-loop patent (pat-03) should reference this claim as prior art establishing your priority for 'measure response to intervention' concept.",
  },

  // ── Independent Claim 21: Lifestyle Modification Software ──
  {
    id: "pc-g21",
    claimNumber: 21,
    claimText:
      "A software program to assist a user in actionable lifestyle modifications for the purpose of improving medical outlook or prognosis, or maintaining wellness, the software including: tracking a user's personalized data; creating a user's action plan based on the personalized data; and recommending one or more personalized herbal formulas based on the user's action plan.",
    claimType: "independent",
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "HIGH",
    estimatedValue: 400000,
    rationale:
      "BROADEST CLAIM. Covers 'improving medical outlook OR maintaining wellness' — not limited to fertility. This claim could protect Conceivable's expansion into general women's health. The scope beyond fertility makes it strategically important.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "medium",
    followOnNote:
      "This claim's breadth beyond fertility is valuable for the company's expansion roadmap. Consider filing a continuation that replaces 'herbal formulas' with 'personalized supplement protocols and lifestyle interventions.'",
  },
  {
    id: "pc-g22",
    claimNumber: 22,
    claimText:
      "The system of claim 21, further including providing the user with a current level of the user's wellness after receiving the user's personalized data.",
    claimType: "dependent",
    dependsOn: 21,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 120000,
    rationale: "Wellness level calculation from personal data. Precursor to Conceivable Score.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-g23",
    claimNumber: 23,
    claimText:
      "The system of claim 22, wherein the user's wellness may include diabetes, weight gain, lung dysfunction, kidney dysfunction, cardiovascular dysfunction, high blood pressure, and other dysfunctions from the information entered.",
    claimType: "dependent",
    dependsOn: 22,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "MEDIUM",
    estimatedValue: 150000,
    rationale:
      "Extends beyond fertility into general health conditions. Protects future product expansion into metabolic health, cardiovascular health, etc.",
    status: "granted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
  {
    id: "pc-g24",
    claimNumber: 24,
    claimText:
      "The system of claim 21, further including a reminder module to generate automated reminders of planned actions.",
    claimType: "dependent",
    dependsOn: 21,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "LOW",
    estimatedValue: 40000,
    rationale: "Reminder/notification functionality. Common in health apps but still adds claim breadth.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
  {
    id: "pc-g25",
    claimNumber: 25,
    claimText:
      "The system of claim 21, wherein the software allows the user to view the action plan progress.",
    claimType: "dependent",
    dependsOn: 21,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "LOW",
    estimatedValue: 40000,
    rationale: "Progress tracking UI claim. Adds completeness to the software claims.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
  {
    id: "pc-g26",
    claimNumber: 26,
    claimText:
      "The system of claim 21, further including educational information based on the action plan.",
    claimType: "dependent",
    dependsOn: 21,
    parentPatentId: "pat-01",
    parentPatentRef: PATENT_1_REF,
    valueTier: "LOW",
    estimatedValue: 40000,
    rationale:
      "Educational content delivery tied to personalized action plan. Supports Kai's educational coaching feature.",
    status: "granted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
];

// ══════════════════════════════════════════════════════════
// PATENT 2 — CON Score System (FILED, PENDING)
// Not yet published (18-month publication delay from March 2024 filing)
// ══════════════════════════════════════════════════════════

const PATENT_2_REF = "US-APP-2024-PENDING — Conceivable Score System";

const PATENT_2_CLAIMS: PatentClaimSeed[] = [
  {
    id: "pc-f01",
    claimNumber: 1,
    claimText:
      "Composite fertility health scoring methodology using weighted multi-signal physiological inputs from wearable devices and self-reported data",
    claimType: "independent",
    parentPatentId: "pat-02",
    parentPatentRef: PATENT_2_REF,
    valueTier: "HIGH",
    estimatedValue: 500000,
    rationale:
      "THE core IP asset. Conceivable Score is the product's primary metric and center of the investor narrative. No competitor has a composite fertility SCORE — they track individual signals. Extends Patent 1's Claim 14 scoring concept to include wearable data.",
    status: "filed",
    priority: true,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-f02",
    claimNumber: 2,
    claimText:
      "Dynamic score recalculation based on temporal data patterns and user behavior changes, adjusting weightings as more physiological data is collected",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-02",
    parentPatentRef: PATENT_2_REF,
    valueTier: "HIGH",
    estimatedValue: 350000,
    rationale:
      "Protects the adaptive nature of the scoring system. Static scores are easy to replicate; dynamic recalculation based on behavior is the moat.",
    status: "filed",
    priority: true,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
  {
    id: "pc-f03",
    claimNumber: 3,
    claimText:
      "Personalized intervention recommendations mapped to individual score drivers with cycle-phase-aware timing",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-02",
    parentPatentRef: PATENT_2_REF,
    valueTier: "HIGH",
    estimatedValue: 400000,
    rationale:
      "Closes the loop between measurement and action. Makes Conceivable a health OS, not just a tracker. Extends Patent 1's phase-specific intervention mapping with AI-driven driver attribution.",
    status: "filed",
    priority: true,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },
  {
    id: "pc-f04",
    claimNumber: 4,
    claimText:
      "System architecture for real-time physiological data processing from consumer wearables into composite health scoring",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-02",
    parentPatentRef: PATENT_2_REF,
    valueTier: "MEDIUM",
    estimatedValue: 200000,
    rationale:
      "Platform architecture protection. Covers the data pipeline from wearable (Halo Ring, Oura, Apple Watch) to score.",
    status: "filed",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
  {
    id: "pc-f05",
    claimNumber: 5,
    claimText:
      "Platform integration framework enabling consumer wearable devices to provide continuous physiological data for fertility scoring",
    claimType: "dependent",
    dependsOn: 4,
    parentPatentId: "pat-02",
    parentPatentRef: PATENT_2_REF,
    valueTier: "MEDIUM",
    estimatedValue: 150000,
    rationale: "Covers multi-device integration (Halo Ring + third-party wearables). Important as device partnerships grow.",
    status: "filed",
    priority: false,
    archived: false,
    category: "wearable",
    urgency: "monitor",
    priorArtRisk: "medium",
  },
];

// ══════════════════════════════════════════════════════════
// NEW FILINGS — Recommended Patents to File
// ══════════════════════════════════════════════════════════

const NEW_FILING_CLAIMS: PatentClaimSeed[] = [
  // ── Closed-Loop System (URGENT) ──
  {
    id: "pc-n01",
    claimNumber: 1,
    claimText:
      "Measuring physiologic response to a specific health intervention and determining correction effectiveness using continuous wearable monitoring data",
    claimType: "independent",
    parentPatentId: "pat-03",
    parentPatentRef: "NEW: Closed-Loop Physiologic Correction (URGENT)",
    valueTier: "HIGH",
    estimatedValue: 450000,
    rationale:
      "Core of the closed-loop system. Nobody else measures whether a fertility intervention ACTUALLY WORKED using continuous physiological data. This is the deepest technical moat. References Patent 1 Claim 20 (real-time tracking) as priority.",
    status: "not_drafted",
    priority: true,
    archived: false,
    category: "method",
    urgency: "file_now",
    priorArtRisk: "low",
  },
  {
    id: "pc-n02",
    claimNumber: 2,
    claimText:
      "Escalating or modifying intervention protocol based on physiologic response failure detection, from lifestyle to supplement to clinical referral",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-03",
    parentPatentRef: "NEW: Closed-Loop Physiologic Correction (URGENT)",
    valueTier: "HIGH",
    estimatedValue: 400000,
    rationale:
      "The adaptive escalation ladder. If supplement A doesn't work -> try B -> refer to clinical. No competitor does this. This is what makes Conceivable safe AND effective.",
    status: "not_drafted",
    priority: true,
    archived: false,
    category: "method",
    urgency: "file_now",
    priorArtRisk: "low",
  },
  {
    id: "pc-n03",
    claimNumber: 3,
    claimText:
      "Temporal response window calibration per intervention type for personalized timing of effectiveness assessment",
    claimType: "dependent",
    dependsOn: 1,
    parentPatentId: "pat-03",
    parentPatentRef: "NEW: Closed-Loop Physiologic Correction (URGENT)",
    valueTier: "MEDIUM",
    estimatedValue: 200000,
    rationale:
      "Not all interventions work on the same timeline. Supplements take 2-3 cycles; lifestyle changes may show in 1 cycle. This protects the temporal calibration logic.",
    status: "not_drafted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "file_now",
    priorArtRisk: "low",
  },

  // ── Pregnancy Risk Prediction ──
  {
    id: "pc-n04",
    claimNumber: 4,
    claimText:
      "Predicting adverse pregnancy outcomes from pre-conception physiological baselines using AI pattern recognition via consumer wearables",
    claimType: "independent",
    parentPatentId: "pat-04",
    parentPatentRef: "NEW: Pregnancy Risk Prediction",
    valueTier: "HIGH",
    estimatedValue: 500000,
    rationale:
      "Massive TAM expansion — from TTC to pregnancy monitoring. Pre-conception baselines as predictors is novel. Hospital systems do this with clinical-grade equipment; nobody does it with consumer wearables + AI.",
    status: "not_drafted",
    priority: true,
    archived: false,
    category: "software_ai",
    urgency: "file_now",
    priorArtRisk: "medium",
  },
  {
    id: "pc-n05",
    claimNumber: 5,
    claimText:
      "Early miscarriage risk detection using pre-conception health data baselines and post-conception signal deviation analysis",
    claimType: "dependent",
    dependsOn: 4,
    parentPatentId: "pat-04",
    parentPatentRef: "NEW: Pregnancy Risk Prediction",
    valueTier: "HIGH",
    estimatedValue: 500000,
    rationale:
      "1 in 4 pregnancies end in miscarriage. Early detection using data from BEFORE conception is novel and deeply defensible. Massive unmet need.",
    status: "not_drafted",
    priority: true,
    archived: false,
    category: "software_ai",
    urgency: "file_now",
    priorArtRisk: "medium",
  },

  // ── Supplement Protocol Engine ──
  {
    id: "pc-n06",
    claimNumber: 6,
    claimText:
      "AI-driven personalized supplement protocol engine with cycle-phase-aware dosing optimization based on continuous physiological monitoring",
    claimType: "independent",
    parentPatentId: null,
    parentPatentRef: "NEW: Supplement Protocol Engine",
    valueTier: "HIGH",
    estimatedValue: 450000,
    rationale:
      "Extends Patent 1's herbal formula claims to AI-driven supplements. Cycle-phase-aware dosing is novel — no supplement company adjusts recommendations based on where you are in your cycle AND your physiological response.",
    status: "not_drafted",
    priority: true,
    archived: false,
    category: "supplement",
    urgency: "file_now",
    priorArtRisk: "low",
  },

  // ── Driver Attribution Hierarchy ──
  {
    id: "pc-n07",
    claimNumber: 7,
    claimText:
      "Identifying causal drivers behind fertility impairment from multi-signal physiological data and ranking drivers by weighted impact on composite health score",
    claimType: "independent",
    parentPatentId: "pat-05",
    parentPatentRef: "NEW: Driver Attribution Hierarchy",
    valueTier: "HIGH",
    estimatedValue: 350000,
    rationale:
      "Protects the 7-driver framework at the technical level. Extends Patent 1's Hurdles concept with AI-driven causal attribution instead of rules-based classification.",
    status: "not_drafted",
    priority: false,
    archived: false,
    category: "software_ai",
    urgency: "monitor",
    priorArtRisk: "low",
  },

  // ── Wearable Sensor Fusion ──
  {
    id: "pc-n08",
    claimNumber: 8,
    claimText:
      "Multi-modal wearable sensor fusion for fertility biomarker extraction combining temperature, HRV, SpO2, and motion data from consumer devices",
    claimType: "independent",
    parentPatentId: null,
    parentPatentRef: "NEW: Wearable Sensor Fusion",
    valueTier: "MEDIUM",
    estimatedValue: 300000,
    rationale:
      "Covers the hardware integration layer for Halo Ring + other wearables. Protects the data fusion methodology across devices.",
    status: "not_drafted",
    priority: false,
    archived: false,
    category: "wearable",
    urgency: "monitor",
    priorArtRisk: "medium",
  },

  // ── Digital TCM Framework ──
  {
    id: "pc-n09",
    claimNumber: 9,
    claimText:
      "Digital Traditional Chinese Medicine diagnostic framework mapping tongue/pulse patterns to fertility assessments via smartphone camera and AI image analysis",
    claimType: "independent",
    parentPatentId: null,
    parentPatentRef: "NEW: Digital TCM Framework",
    valueTier: "MEDIUM",
    estimatedValue: 200000,
    rationale:
      "Unique to Kirsten's TCM background. Nobody else is digitizing TCM diagnostics for fertility. High novelty, future product feature.",
    status: "not_drafted",
    priority: false,
    archived: false,
    category: "method",
    urgency: "exploratory",
    priorArtRisk: "low",
  },
];

// ══════════════════════════════════════════════════════════
// COMBINED EXPORT
// ══════════════════════════════════════════════════════════

export const PATENT_CLAIMS: PatentClaimSeed[] = [
  ...PATENT_1_CLAIMS,
  ...PATENT_2_CLAIMS,
  ...NEW_FILING_CLAIMS,
];

// Helpers
export const GRANTED_CLAIMS = PATENT_1_CLAIMS;
export const FILED_CLAIMS = PATENT_2_CLAIMS;
export const NEW_CLAIMS = NEW_FILING_CLAIMS;

export function getProtectedClaims() {
  return [...PATENT_1_CLAIMS, ...PATENT_2_CLAIMS];
}

export function getClaimsToFile() {
  return NEW_FILING_CLAIMS;
}

export function getPortfolioValue() {
  const grantedValue = PATENT_1_CLAIMS.reduce((s, c) => s + c.estimatedValue, 0);
  const filedValue = PATENT_2_CLAIMS.reduce((s, c) => s + c.estimatedValue, 0);
  const newValue = NEW_FILING_CLAIMS.reduce((s, c) => s + c.estimatedValue, 0);
  const totalValue = grantedValue + filedValue + newValue;
  return { grantedValue, filedValue, newValue, totalValue };
}
