// Pregnancy Experience — Complete Feature Set
// 11 features for the Pregnancy health experience

export interface PregnancyFeatureSeed {
  name: string;
  description: string;
  userStory: string;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[];
  notes: string;
}

export const PREGNANCY_FEATURES: PregnancyFeatureSeed[] = [
  {
    name: "Pregnancy Wellness Score",
    description: "Adapts the Conceivable Score to pregnancy-specific parameters. Same five-category architecture (Energy, Blood, Temperature, Stress, Hormones) but with pregnancy-calibrated thresholds, weightings, and clinical significance. The score shifts meaning from likelihood of conception to how optimized is your body for this pregnancy right now.",
    userStory: "As a pregnant woman, I need a single number that tells me how my body is doing today so that I can feel confident between OB visits instead of anxious.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas", "Olive", "Seren"],
    notes: "Mostly recalibration of existing scoring engine. Energy recalibrated for pregnancy fatigue patterns. Blood monitors for anemia and circulation. Temperature shifts from ovulation-tracking to pregnancy maintenance. Stress thresholds adjusted for pregnancy physiology. Hormones monitors BBT for progesterone adequacy. Patent coverage: 001, 007."
  },
  {
    name: "Continuous Gestational Diabetes Screening",
    description: "Uses Halo Ring blood sugar data with pregnancy-specific thresholds to identify GD risk months before the standard 24-28 week glucose tolerance test. Olive automatically adjusts nutrition plans as glucose patterns shift. Thresholds: fasting approaching 95 mg/dL, 1-hour postprandial approaching 140 mg/dL, 2-hour postprandial approaching 120 mg/dL. Pattern analysis identifies trending elevation before diagnostic thresholds. If dietary intervention doesn't stabilize within 2 weeks, system flags for OB discussion with data summary.",
    userStory: "As a pregnant woman, I need to know if my blood sugar is becoming a problem weeks before my doctor would test for it so that I can manage it through diet before it becomes a clinical diagnosis.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Olive", "Atlas", "Kai"],
    notes: "Requires pregnancy-specific threshold configuration and Olive's meal plan adaptation logic. GD affects 2-10% of pregnancies, associated with macrosomia, preeclampsia, C-section risk. Almost entirely manageable through dietary interventions the system already delivers. Patent coverage: 004, 007, 008."
  },
  {
    name: "First Trimester Guardian",
    description: "Temperature and HRV monitoring with early pregnancy viability assessment. Monitors sustained BBT elevation indicating ongoing viability. Flags concerning temperature drops that may indicate progesterone insufficiency. For users from fertility experience, compares against known baseline for higher accuracy. Daily reassurance when stable. Gentle contextual messaging when patterns shift. Clinical summary generation when escalation needed. The system that watches when nobody else is watching during the most anxious 12 weeks.",
    userStory: "As a woman in her first trimester, I need to know that something intelligent is monitoring my pregnancy between appointments so that I don't spend 12 weeks in constant fear of miscarriage with zero information.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Seren", "Atlas"],
    notes: "CRITICAL UX CHALLENGE: The line between helpful monitoring and panic-inducing alerts is everything. Anxiety-calibrated communication protocols: reassurance when stable, gentle awareness for minor variations, clinical escalation for genuine concern. Messaging like 'Your temperature pattern looks strong and consistent today. Everything is tracking well.' Patent coverage: 006, 007, 008."
  },
  {
    name: "OB Bridge Reports",
    description: "Auto-generated summary of everything the Halo Ring and app captured between OB appointments. Includes blood sugar trends with averages and spikes, sleep quality patterns, HRV trends, BBT stability, stress indicators, activity levels, supplement compliance, flags or concerns, and a Topics to Discuss section. Formatted as a clean one-page summary an OB can scan in 60 seconds. Export as PDF or share from app. Aligned with her OB appointment calendar.",
    userStory: "As a pregnant woman, I need a clear summary of my health data to bring to OB appointments so that my 15 minutes of face time is spent on real issues instead of how have you been feeling.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Becomes a referral channel over time — OBs who see these reports start recommending Conceivable. Design must look clinical and professional, not consumer app. Patent coverage: 006."
  },
  {
    name: "Preeclampsia Early Warning",
    description: "Combines blood pressure estimation via face scan, HRV patterns, blood sugar data, and symptom reporting to identify preeclampsia risk factors weeks before clinical presentation. Risk score calculated using evidence-based odds ratios. Low risk: monitoring continues with reassurance. Moderate risk: increased monitoring, lifestyle interventions, OB discussion recommended. High risk: immediate OB contact recommendation with data summary. Incorporates pre-pregnancy baseline for users from fertility experience.",
    userStory: "As a pregnant woman, I need early warning of preeclampsia risk so that I can get clinical intervention before it becomes an emergency.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Seren"],
    notes: "Face scan blood pressure accuracy is critical. Clinical validation required before launch. Patent coverage: 004, 007."
  },
  {
    name: "Trimester-Adaptive Nutrition",
    description: "Olive's meal plans and supplement protocols automatically adapt as pregnancy progresses. First trimester: nausea management, folate optimization, food aversion workarounds, monitoring intake through blood sugar data. Second trimester: iron optimization monitored through energy scores and HRV, calcium/vitamin D, blood sugar management for increasing insulin resistance. Third trimester: protein for fetal growth, omega-3 for brain development, preparation nutrition for labor and postpartum. All personalized based on HER data, not generic guidance. Navi adjusts supplement protocol each trimester.",
    userStory: "As a pregnant woman, I need nutrition guidance that changes with my pregnancy because what my body needs at 8 weeks is completely different from 28 weeks.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Olive", "Navi", "Atlas", "Kai"],
    notes: "Trimester-specific protocols need clinical review. Personalization engine already exists from fertility. Patent coverage: 003, 008."
  },
  {
    name: "Perinatal Mental Health Monitor",
    description: "Seren doesn't wait to be asked. Passive monitoring of sleep disruption patterns, HRV changes associated with anxiety/depression, decreased app engagement, changes in self-reported mood. Pattern recognition across multiple signals — single bad night doesn't trigger, sustained 7-10 day pattern activates Seren. Gentle initiation. Evidence-based CBT support. Cross-validated against objective data to catch women who say I'm fine while HRV says otherwise. Clinical referral with specific guidance when patterns indicate severity — not call a hotline but here's how to talk to your OB about this.",
    userStory: "As a pregnant woman, I need someone paying attention to my mental health because I might not recognize what's happening to me until it's severe, and I definitely won't bring it up at a 15-minute OB visit.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Seren", "Atlas", "Kai"],
    notes: "Perinatal anxiety and depression affect 1 in 5 women. Most don't get diagnosed until severe. The line between helpful and intrusive is razor-thin. UX requires extraordinary sensitivity. Seren's initiation example: 'I've noticed your sleep has been really disrupted this past week, and your stress markers are elevated. Pregnancy can bring up a lot. How are you actually doing — not the polite answer, the real one?' Patent coverage: 002, 004, 006."
  },
  {
    name: "Preterm Labor Risk Monitoring",
    description: "Continuous monitoring of physiological markers associated with preterm labor risk. Integrates known risk factors (prior preterm birth OR 3.6, multiple gestation, cervical insufficiency, BMI extremes, autoimmune conditions) with continuous biometric monitoring. HRV analysis for sympathetic activation associated with preterm contractions. Sleep disruption correlation. Activity and stress monitoring. Contraction tracking with physiological cross-validation. Dynamic risk score with appropriate response levels. High-risk users get increased monitoring frequency.",
    userStory: "As a pregnant woman with risk factors for preterm delivery, I need continuous monitoring that can detect warning signs between my monthly appointments.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai", "Seren"],
    notes: "Clinical validation essential. Patent coverage: 004, 007."
  },
  {
    name: "Birth Preparation Intelligence",
    description: "Starting at 32 weeks, system shifts to labor preparation. Analyzes her data to identify specific preparation priorities: stress management if HRV shows chronic activation, physical conditioning if activity limited, nutrition optimization for labor energy. Personalized birth prep plan with daily steps. Seren provides mental preparation including fear processing, birth preferences, partner communication. Tracks labor readiness indicators. Begins building postpartum recovery plan based on pregnancy data for seamless transition.",
    userStory: "As a woman approaching delivery, I need preparation that's specific to my body and my pregnancy, not generic birth prep content.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Olive", "Seren", "Atlas"],
    notes: "Patent coverage: 008, 010."
  },
  {
    name: "Partner Integration",
    description: "Optional partner access showing current Pregnancy Wellness Score, what it means, and one specific thing the partner can do. Gentle nudges like 'Her stress score is elevated today. A quiet evening might help more than asking what's wrong.' Does NOT share raw data or clinical details without explicit per-type permission. Partner education moments. Designed to reduce invisible labor where women manage their own health while educating partners.",
    userStory: "As a pregnant woman, I want my partner to understand what's happening with my body without me having to explain everything when I'm exhausted.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Seren"],
    notes: "Potential new patent opportunity — partner dashboard with permission-gated health data sharing. Requires separate partner UI and permission architecture."
  },
  {
    name: "Postpartum Handoff Protocol",
    description: "At delivery, system transitions seamlessly. All pregnancy data flows into postpartum. Recovery scoring begins automatically. Monitoring adjusts to postpartum bleeding, blood pressure recovery, sleep restoration, intensified mental health monitoring during peak depression risk period. Seren becomes more prominent. Olive adjusts for recovery and breastfeeding. She doesn't download a new app. The system evolves with her.",
    userStory: "As a woman who just delivered, I need the same intelligent monitoring to continue through recovery because the 6-week postpartum checkup is dangerously far away.",
    priority: "nice_to_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Full team", "Seren expanded role"],
    notes: "Strategically critical for LTV and retention into Postpartum experience even though technically Nice to Have. Requires full Postpartum experience to be built. Patent coverage: 008 plus all monitoring patents."
  }
];

// IP Coverage mapping for the Pregnancy experience
export const PREGNANCY_IP_COVERAGE: { feature: string; patents: { number: string; name: string; id: string }[] }[] = [
  {
    feature: "Pregnancy Wellness Score",
    patents: [
      { number: "001", name: "Conceivable Score", id: "draft-01" },
      { number: "007", name: "Pregnancy Risk Assessment", id: "draft-05" },
    ]
  },
  {
    feature: "Continuous GD Screening",
    patents: [
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
      { number: "007", name: "Pregnancy Risk Assessment", id: "draft-05" },
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  },
  {
    feature: "First Trimester Guardian",
    patents: [
      { number: "006", name: "Data Validation", id: "patent-006" },
      { number: "007", name: "Pregnancy Risk Assessment", id: "draft-05" },
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  },
  {
    feature: "OB Bridge Reports",
    patents: [
      { number: "006", name: "Data Validation", id: "patent-006" },
    ]
  },
  {
    feature: "Preeclampsia Early Warning",
    patents: [
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
      { number: "007", name: "Pregnancy Risk Assessment", id: "draft-05" },
    ]
  },
  {
    feature: "Trimester-Adaptive Nutrition",
    patents: [
      { number: "003", name: "Cycle Recalibration", id: "draft-03" },
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  },
  {
    feature: "Perinatal Mental Health",
    patents: [
      { number: "002", name: "Root Cause Analysis", id: "draft-02" },
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
      { number: "006", name: "Data Validation", id: "patent-006" },
    ]
  },
  {
    feature: "Preterm Labor Risk",
    patents: [
      { number: "004", name: "Real-Time Monitoring", id: "draft-04" },
      { number: "007", name: "Pregnancy Risk Assessment", id: "draft-05" },
    ]
  },
  {
    feature: "Birth Preparation",
    patents: [
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
      { number: "010", name: "Temporal Calibration", id: "patent-009" },
    ]
  },
  {
    feature: "Partner Integration",
    patents: [] // New patent opportunity flagged
  },
  {
    feature: "Postpartum Handoff",
    patents: [
      { number: "008", name: "Closed-Loop Correction", id: "patent-008" },
    ]
  }
];

export const PREGNANCY_DESCRIPTION = "The pregnancy experience provides continuous AI-powered monitoring from conception through delivery, integrating pre-conception data from the fertility experience with real-time wearable measurements and automated multi-specialist care coordination. It replaces the broken model of monthly OB visits with zero monitoring in between. The system catches gestational diabetes weeks before standard screening, monitors first trimester viability when nobody else is watching, tracks preeclampsia risk factors continuously, and provides perinatal mental health surveillance that doesn't wait for a woman to ask for help.";

export const PREGNANCY_PERSONA = "A woman who conceived (ideally through Conceivable's fertility experience, but also new users entering at pregnancy) who wants continuous, intelligent monitoring and support from conception through delivery. She's anxious between OB visits. She's been failed by apps that tell her the baby is the size of a fruit. She wants to feel watched over — not surveilled, but genuinely cared for.";
