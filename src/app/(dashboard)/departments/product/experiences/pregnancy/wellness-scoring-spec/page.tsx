"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Clock, ChevronRight } from "lucide-react";

const GOLD = "#D4A843";

const SECTIONS = [
  { id: "overview", num: "1", title: "System Overview" },
  { id: "inputs", num: "2", title: "Data Inputs" },
  { id: "scoring", num: "3", title: "Factor Scoring Engine" },
  { id: "composite", num: "4", title: "Composite Score Calculation" },
  { id: "messaging", num: "5", title: "Messaging Framework" },
  { id: "monitoring", num: "6", title: "Monitoring Frequency Calibration" },
  { id: "ob-report", num: "7", title: "OB Bridge Report Format" },
  { id: "escalation", num: "8", title: "Escalation Protocols" },
  { id: "data-arch", num: "9", title: "Data Architecture" },
  { id: "trimester", num: "10", title: "Trimester-Specific Adjustments" },
  { id: "fda", num: "11", title: "FDA Compliance Checklist" },
  { id: "phases", num: "12", title: "Implementation Phases" },
];

export default function WellnessScoringSpecPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/departments/product/experiences/pregnancy"
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div className="flex-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            Pregnancy Wellness Profile
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            Technical Specification — Engineering-Ready Scoring Algorithm, Messaging Framework &amp; Implementation Guide
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Conceivable Technologies — Confidential
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
          >
            <Shield size={12} />
            Confidential — Engineering &amp; Clinical Team Only
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
            <Clock size={12} />
            Document version 1.0 — March 11, 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar — Table of Contents */}
        <div className="lg:col-span-1">
          <div
            className="rounded-xl p-4 sticky top-6"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--muted)" }}
            >
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                    activeSection === s.id ? "shadow-sm" : ""
                  }`}
                  style={
                    activeSection === s.id
                      ? { backgroundColor: `${GOLD}14`, color: GOLD }
                      : { color: "var(--muted)" }
                  }
                >
                  <span className="font-mono text-[10px] w-4 shrink-0">{s.num}</span>
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">

          {/* ═══════════════════════════════════════════
              SECTION 1: SYSTEM OVERVIEW
              ═══════════════════════════════════════════ */}
          <SpecSection id="overview" num="1" title="System Overview">
            <p>
              The Pregnancy Wellness Profile is a consumer-facing health optimization tool that uses evidence-based
              factor analysis to help pregnant women understand and improve modifiable wellness factors. It is NOT
              a diagnostic tool, risk predictor, or medical device.
            </p>
            <p className="mt-3">The system has TWO layers:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg p-4" style={{ backgroundColor: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: GOLD }}>Consumer Layer (user-facing)</h5>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Wellness language, optimization framing, actionable guidance, anxiety-calibrated messaging.
                  No medical diagnoses. No named conditions as predictions. No odds ratios shown to the user.
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "#5A6FFF08", border: "1px solid #5A6FFF20" }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: "#5A6FFF" }}>Clinical Layer (internal + OB reports)</h5>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Evidence-based scoring weights, published odds ratios, clinical-grade reporting for healthcare
                  providers. Powers the algorithm but never surfaces directly to the consumer.
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
              <p className="text-xs font-bold" style={{ color: "#E24D47" }}>
                This separation is non-negotiable for FDA regulatory compliance.
              </p>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 2: DATA INPUTS
              ═══════════════════════════════════════════ */}
          <SpecSection id="inputs" num="2" title="Data Inputs">

            {/* 2A */}
            <h4 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>
              2A. Continuous Wearable Data (Halo Ring)
            </h4>
            <SpecTable
              headers={["Signal", "Collection Frequency", "Unit", "Notes"]}
              rows={[
                ["Blood Glucose", "Continuous (every 5 min)", "mg/dL", "Fasting, 1hr postprandial, 2hr postprandial calculated from patterns"],
                ["Basal Body Temperature", "Continuous overnight", "°F/°C", "Nightly average + trend analysis"],
                ["Heart Rate Variability", "Continuous", "ms (RMSSD)", "Baseline established in first 2 weeks, deviations tracked"],
                ["Sleep Quality", "Nightly", "Composite (duration + efficiency + stages)", "Mapped to 0-100 scale"],
                ["Stress Indicators", "Continuous", "Derived from HRV + activity patterns", "Acute vs chronic stress differentiated"],
                ["Activity Level", "Continuous", "Steps + active minutes + intensity", "Over-exercise and under-activity both flagged"],
              ]}
            />

            {/* 2B */}
            <h4 className="text-sm font-bold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              2B. Self-Reported Data (App)
            </h4>
            <SpecTable
              headers={["Signal", "Collection Frequency", "Format"]}
              rows={[
                ["Symptoms", "Daily check-in", "Multi-select from curated list"],
                ["Mood", "Daily check-in", "1-10 scale + optional free text"],
                ["Diet quality", "Daily", "Meal logging or quick assessment"],
                ["Supplement compliance", "Daily", "Checkbox per supplement"],
                ["Hydration", "Daily", "Estimated intake"],
                ["Bleeding/spotting", "As needed", "Presence + characteristics"],
                ["Contraction/cramping", "As needed", "Frequency + intensity"],
              ]}
            />

            {/* 2C */}
            <h4 className="text-sm font-bold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              2C. Face Scan Data
            </h4>
            <SpecTable
              headers={["Signal", "Collection Frequency", "Notes"]}
              rows={[
                ["Blood pressure estimate", "Weekly or on-demand", "Non-invasive. Used as trend indicator, not diagnostic."],
                ["Facial temperature mapping", "Weekly", "Inflammation and circulation indicators"],
              ]}
            />

            {/* 2D */}
            <h4 className="text-sm font-bold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              2D. Clinical History (entered once, updated as needed)
            </h4>
            <SpecTable
              headers={["Factor", "Type", "Input Method"]}
              rows={[
                ["Maternal age", "Fixed", "Calculated from DOB"],
                ["Prior preterm birth history", "Fixed", "Questionnaire"],
                ["Autoimmune disease history", "Fixed", "Questionnaire"],
                ["BMI at conception", "Semi-fixed", "Weight + height, updated if weight changes significantly"],
                ["Multiple gestation", "Fixed", "User-reported after confirmation"],
                ["Interpregnancy interval", "Fixed", "Calculated from previous birth date"],
                ["Prior pregnancy complications", "Fixed", "Questionnaire"],
                ["Substance use history", "Semi-fixed", "Questionnaire, updated periodically"],
              ]}
            />
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 3: FACTOR SCORING ENGINE
              ═══════════════════════════════════════════ */}
          <SpecSection id="scoring" num="3" title="Factor Scoring Engine">

            {/* 3A */}
            <h4 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>
              3A. Factor Categories
            </h4>
            <p>Each factor is assigned to one of three tiers based on actionability:</p>
            <div className="space-y-2 mt-3">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
                <p className="text-xs"><span className="font-bold" style={{ color: "#1EAA55" }}>TIER 1: MODIFIABLE — User Can Act Now.</span>{" "}
                  <span style={{ color: "var(--muted)" }}>These factors drive the daily experience and get the highest composite weight because the system can actually help improve them.</span></p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#F59E0B08", border: "1px solid #F59E0B20" }}>
                <p className="text-xs"><span className="font-bold" style={{ color: "#F59E0B" }}>TIER 2: CLINICALLY MODIFIABLE — Requires Clinical Partnership.</span>{" "}
                  <span style={{ color: "var(--muted)" }}>The system monitors and flags, but resolution requires healthcare provider involvement.</span></p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#9686B908", border: "1px solid #9686B920" }}>
                <p className="text-xs"><span className="font-bold" style={{ color: "#9686B9" }}>TIER 3: FIXED MODIFIERS — Cannot Change, But Calibrate the System.</span>{" "}
                  <span style={{ color: "var(--muted)" }}>These factors adjust monitoring sensitivity and escalation thresholds internally. They do NOT reduce the user&apos;s visible wellness score in a way that feels hopeless.</span></p>
              </div>
            </div>

            {/* 3B */}
            <h4 className="text-sm font-bold mt-6 mb-2" style={{ color: "var(--foreground)" }}>
              3B. Individual Factor Scoring
            </h4>
            <p>Each factor is scored 0-100 based on where the user falls relative to evidence-based optimal ranges.</p>

            {/* ── TIER 1 FACTORS ── */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#1EAA55" }} />
                <h5 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1EAA55" }}>
                  Tier 1 Factors (Modifiable) — Composite Weight: 60% of total score
                </h5>
              </div>

              {/* Blood Sugar Balance */}
              <FactorBlock
                name="Blood Sugar Balance"
                evidence="GDM OR 1.5-2.0 for preterm birth, OR 1.7 for macrosomia"
                source="Halo Ring continuous glucose"
                weight="25% (highest single factor — most actionable, highest OR)"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["Fasting glucose (mg/dL)", "< 85", "85-90", "90-95", "> 95"],
                      ["1hr postprandial (mg/dL)", "< 120", "120-130", "130-140", "> 140"],
                      ["2hr postprandial (mg/dL)", "< 100", "100-110", "110-120", "> 120"],
                      ["Daily spike count", "0", "1", "2-3", "> 3"],
                    ],
                  },
                ]}
                compositeNote="Composite factor score = average of all four metrics"
              />

              {/* Nutritional Foundation */}
              <FactorBlock
                name="Nutritional Foundation"
                evidence="Malnutrition OR 1.5 for low birth weight, OR 1.3 for preterm"
                source="Meal logging + supplement compliance + glucose patterns as proxy"
                weight="20%"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["Supplement compliance (7-day avg)", "> 90%", "70-90%", "50-70%", "< 50%"],
                      ["Meal regularity (meals/day)", "3+ balanced", "3 with gaps", "2 or irregular", "< 2 or very irregular"],
                      ["Diet quality indicator", "Strong variety", "Moderate variety", "Limited variety", "Poor or restrictive"],
                      ["Iron-supporting intake", "Adequate", "Mostly adequate", "Sometimes adequate", "Rarely adequate"],
                    ],
                  },
                ]}
              />

              {/* Stress & Recovery */}
              <FactorBlock
                name="Stress & Recovery"
                evidence="HRV depression associated with preterm labor, preeclampsia. RR 1.9 (socioeconomic stress proxy)"
                source="HRV continuous + sleep quality + self-reported mood"
                weight="20%"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["HRV vs personal baseline", "> 90% of baseline", "75-90%", "60-75%", "< 60%"],
                      ["HRV trend (14-day)", "Stable or improving", "Slight decline", "Moderate decline", "Sustained decline"],
                      ["Self-reported stress (1-10)", "1-3", "4-5", "6-7", "8-10"],
                      ["Acute stress events (past 7 days)", "0", "1-2", "3-4", "> 4"],
                    ],
                  },
                ]}
              />

              {/* Sleep Quality */}
              <FactorBlock
                name="Sleep Quality"
                evidence="Sleep disruption correlated with preterm labor risk, preeclampsia risk, GDM risk"
                source="Halo Ring sleep tracking"
                weight="20%"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["Sleep duration (hours)", "7-9", "6-7", "5-6", "< 5"],
                      ["Sleep efficiency", "> 85%", "75-85%", "65-75%", "< 65%"],
                      ["Wake episodes per night", "0-1", "2-3", "4-5", "> 5"],
                      ["Sleep consistency (bedtime variance)", "< 30 min", "30-60 min", "60-90 min", "> 90 min"],
                    ],
                  },
                ]}
              />

              {/* Body Composition & Activity */}
              <FactorBlock
                name="Body Composition & Activity"
                evidence="BMI underweight OR 1.3 preterm, obesity OR 1.5 preeclampsia"
                source="Initial BMI + activity tracking + weight trend"
                weight="10%"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["BMI at conception", "18.5-24.9", "25-29.9", "17-18.4 or 30-34.9", "< 17 or > 35"],
                      ["Weekly activity minutes", "150+ moderate", "100-150", "50-100", "< 50"],
                      ["Weight gain trajectory", "On track for gestational age", "Slightly above/below", "Moderately off track", "Significantly off track"],
                    ],
                  },
                ]}
              />

              {/* Substance & Environmental */}
              <FactorBlock
                name="Substance & Environmental"
                evidence="Substance use OR 2.0 for adverse outcomes"
                source="Self-reported + location-based air quality data if available"
                weight="5%"
                tables={[
                  {
                    headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
                    rows: [
                      ["Tobacco use", "None", "Quit during pregnancy", "Reduced", "Active use"],
                      ["Alcohol use", "None", "Rare (< 1/month)", "Occasional", "Regular"],
                      ["Caffeine intake", "< 200mg/day", "200-300mg", "300-400mg", "> 400mg"],
                    ],
                  },
                ]}
              />
            </div>

            {/* ── TIER 2 FACTORS ── */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                <h5 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
                  Tier 2 Factors (Clinically Modifiable) — Composite Weight: 15% of total score
                </h5>
              </div>

              {/* Blood Health Indicators */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <h6 className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Blood Health Indicators</h6>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F59E0B14", color: "#F59E0B" }}>Weight: 40%</span>
                </div>
                <p className="text-[10px] italic mb-2" style={{ color: "#F59E0B" }}>Internal evidence: Anemia OR 1.3 preterm, OR 1.5 low birth weight</p>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                  System cannot directly measure hemoglobin but CAN monitor proxy indicators: Energy score trends,
                  HRV patterns associated with anemia, self-reported symptoms (fatigue, dizziness, shortness of breath,
                  pale skin), dietary iron intake tracking.
                </p>
                <SpecTable
                  headers={["Condition", "Score"]}
                  rows={[
                    ["No anemia indicators", "100"],
                    ["Mild proxy indicators present", "60"],
                    ["Multiple proxy indicators present", "30"],
                    ["User-confirmed anemia diagnosis", "Scored based on management status"],
                  ]}
                />
              </div>

              {/* Blood Pressure Trends */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <h6 className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Blood Pressure Trends</h6>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F59E0B14", color: "#F59E0B" }}>Weight: 40%</span>
                </div>
                <p className="text-[10px] italic mb-2" style={{ color: "#F59E0B" }}>Internal evidence: Preeclampsia is leading cause of maternal mortality.</p>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>Data source: Face scan estimates (weekly) + symptoms</p>
                <SpecTable
                  headers={["Condition", "Score", "Action"]}
                  rows={[
                    ["Trending stable within normal", "100", "—"],
                    ["Mild upward trend", "70", "—"],
                    ["Concerning upward trend", "40", "—"],
                    ["Symptoms present (headache, vision changes, swelling) + upward trend", "20", "→ ESCALATE TO CLINICAL"],
                  ]}
                />
              </div>

              {/* Prenatal Care Engagement */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <h6 className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Prenatal Care Engagement</h6>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F59E0B14", color: "#F59E0B" }}>Weight: 20%</span>
                </div>
                <p className="text-[10px] italic mb-2" style={{ color: "#F59E0B" }}>Internal evidence: Inadequate prenatal care AOR 4.10 for stillbirth</p>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>Data source: User-entered appointment tracking</p>
                <SpecTable
                  headers={["Condition", "Score", "Action"]}
                  rows={[
                    ["Regular appointments on schedule", "100", "—"],
                    ["Slightly behind schedule", "70", "—"],
                    ["Significantly behind", "40", "—"],
                    ["No prenatal care reported", "10", "→ ESCALATE with strong encouragement"],
                  ]}
                />
              </div>
            </div>

            {/* ── TIER 3 FACTORS ── */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#9686B9" }} />
                <h5 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9686B9" }}>
                  Tier 3 Factors (Fixed Modifiers) — Composite Weight: 0% of visible score
                </h5>
              </div>

              <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                <p className="text-xs font-bold" style={{ color: "#E24D47" }}>
                  CRITICAL: Tier 3 factors DO NOT reduce the user-facing Wellness Score. A 40-year-old woman with great
                  blood sugar, excellent nutrition, low stress, and good sleep should see a HIGH score. Her age doesn&apos;t
                  make her less well.
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Instead, Tier 3 factors adjust INTERNAL system behavior:
                </p>
              </div>

              {/* Maternal Age Modifier */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <h6 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Maternal Age Modifier</h6>
                <SpecTable
                  headers={["Age", "Monitoring Multiplier", "Escalation Threshold Reduction"]}
                  rows={[
                    ["20-34", "1.0x", "No reduction"],
                    ["35-37", "1.2x", "Reduced by 10%"],
                    ["38-40", "1.4x", "Reduced by 20%"],
                    ["> 40", "1.6x", "Reduced by 30%"],
                  ]}
                />
              </div>

              {/* Prior Preterm Birth */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <h6 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Prior Preterm Birth Modifier</h6>
                <p className="text-[10px] italic mb-2" style={{ color: "#9686B9" }}>Internal evidence: OR 3.6 — highest single factor</p>
                <SpecTable
                  headers={["History", "Monitoring", "Details"]}
                  rows={[
                    ["No prior preterm", "1.0x baseline monitoring", "—"],
                    ["1 prior preterm", "2.0x monitoring frequency", "Preterm indicators weighted 2x. Active monitoring at 24 weeks instead of 28."],
                    ["2+ prior preterm", "2.5x monitoring", "Preterm indicators weighted 2.5x. Active monitoring begins at 20 weeks."],
                  ]}
                />
              </div>

              {/* Other Tier 3 Modifiers */}
              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <h6 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Autoimmune Disease Modifier</h6>
                <p className="text-[10px] italic mb-1" style={{ color: "#9686B9" }}>Internal evidence: OR 1.8 preterm, OR 2.0 preeclampsia</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Blood pressure monitoring frequency increased. Inflammation proxy indicators weighted higher.
                  System proactively asks about flare symptoms.
                </p>
              </div>

              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <h6 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Multiple Gestation Modifier</h6>
                <p className="text-[10px] italic mb-1" style={{ color: "#9686B9" }}>Internal evidence: OR 7.3 low birth weight</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  All monitoring frequencies doubled. Nutritional requirements adjusted. Preterm monitoring begins at
                  20 weeks. Activity recommendations adjusted.
                </p>
              </div>

              <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <h6 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Interpregnancy Interval Modifier</h6>
                <p className="text-[10px] italic mb-1" style={{ color: "#9686B9" }}>Internal evidence: &lt; 6 months OR 1.08 SGA, &gt;= 36 months OR 1.35 preterm</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Short interval increases nutritional monitoring. Long interval slightly increases age-related monitoring.
                </p>
              </div>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 4: COMPOSITE SCORE CALCULATION
              ═══════════════════════════════════════════ */}
          <SpecSection id="composite" num="4" title="Composite Score Calculation">
            <div className="rounded-lg p-4 font-mono text-xs" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <p style={{ color: GOLD }}>PREGNANCY WELLNESS SCORE = (Tier1_Score × 0.60) + (Tier2_Score × 0.15) + (Baseline_Buffer × 0.25)</p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>Where:</p>
              <p style={{ color: "var(--foreground)" }}>Tier1_Score = weighted average of all Tier 1 factor scores</p>
              <p style={{ color: "var(--foreground)" }}>Tier2_Score = weighted average of all Tier 2 factor scores</p>
              <p style={{ color: "var(--foreground)" }}>Baseline_Buffer = 75 (fixed)</p>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Why the Baseline Buffer?</h5>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                The 25% buffer at a fixed value of 75 ensures that no woman ever sees a terrifyingly low score based
                purely on clinical factors she can&apos;t control. Even if every Tier 1 and Tier 2 factor were at the
                lowest level (score 25), her composite would be:
              </p>
              <div className="rounded-lg p-3 mt-2 font-mono text-xs" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--foreground)" }}>(25 × 0.60) + (25 × 0.15) + (75 × 0.25) = 15 + 3.75 + 18.75 = <strong>37.5</strong></p>
                <p className="mt-1" style={{ color: "var(--muted)" }}>And if she has good modifiable factors (score 80) but tough clinical factors (score 40):</p>
                <p style={{ color: "var(--foreground)" }}>(80 × 0.60) + (40 × 0.15) + (75 × 0.25) = 48 + 6 + 18.75 = <strong>72.75</strong></p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Score Ranges for User Display</h5>
              <SpecTable
                headers={["Range", "Color", "Label", "Messaging"]}
                rows={[
                  ["85-100", "Green", "Thriving", "\"Your body is in an excellent position for this pregnancy.\""],
                  ["70-84", "Light Green", "Strong", "\"You're doing great. Let's fine-tune a couple of things.\""],
                  ["55-69", "Amber", "Building", "\"There are some real opportunities to strengthen your foundation. Let's focus on the top priority.\""],
                  ["40-54", "Orange", "Needs Focus", "\"A few areas need your attention. The good news: these are all things we can work on together.\""],
                  ["Below 40", "Soft Red", "Priority", "\"Let's make some changes this week. I have a clear plan for you.\""],
                ]}
              />
              <div className="mt-2 rounded-lg p-3" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
                <p className="text-xs font-bold" style={{ color: "#1EAA55" }}>
                  IMPORTANT: Even at the lowest scores, messaging is NEVER hopeless. Always includes &ldquo;here&apos;s what we can do.&rdquo;
                </p>
              </div>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 5: MESSAGING FRAMEWORK
              ═══════════════════════════════════════════ */}
          <SpecSection id="messaging" num="5" title="Messaging Framework">

            <h4 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>5A. Per-Factor Messaging Templates</h4>
            <p>
              Every factor has four message states. Messages must be: written in Kai&apos;s voice (warm, specific, never clinical jargon),
              actionable (always includes what to do next), anxiety-calibrated (never alarming, always includes context),
              dynamic (references the user&apos;s actual numbers and trends, not generic advice).
            </p>

            <div className="mt-4 space-y-3">
              {/* GREEN */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: "#1EAA55" }}>GREEN (Score 80-100): Reinforcement</h5>
                <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Pattern: [Acknowledge what&apos;s good] + [Specific data point] + [Keep going]</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  Example — Blood Sugar: &ldquo;Your blood sugar has been beautifully stable this past week. Your average fasting
                  glucose was [X] and you only had [Y] postmeal spikes. Whatever you&apos;re doing with your evening meals, keep it up.&rdquo;
                </p>
              </div>

              {/* LIGHT GREEN */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#78C3BF08", border: "1px solid #78C3BF20" }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: "#78C3BF" }}>LIGHT GREEN (Score 65-79): Gentle Optimization</h5>
                <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Pattern: [Mostly good] + [One specific area] + [Small adjustment from Olive/Seren]</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  Example — Blood Sugar: &ldquo;Your blood sugar is in a good range overall, but I noticed your post-dinner readings
                  have been creeping up the last few days. Olive made a small tweak to your evening meals — a bit more protein and
                  fiber at dinner should smooth that out.&rdquo;
                </p>
              </div>

              {/* AMBER */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: "#F1C028" }}>AMBER (Score 40-64): Active Intervention</h5>
                <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Pattern: [Normalize] + [What the data shows without diagnosis] + [Specific plan already in motion] + [Clinical bridge if needed]</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  Example — Blood Sugar: &ldquo;As pregnancy progresses, your body naturally becomes more resistant to insulin — this
                  happens to a lot of women. Your glucose patterns have been running higher than we&apos;d like this past week, especially
                  after meals. Olive has already adjusted your nutrition plan with some targeted changes. Let&apos;s see how the next two
                  weeks look, and this is definitely worth mentioning to your OB at your next visit. I&apos;ve added it to your Bridge Report.&rdquo;
                </p>
              </div>

              {/* RED */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                <h5 className="text-xs font-bold mb-1" style={{ color: "#E24D47" }}>RED (Score below 40): Escalation</h5>
                <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Pattern: [Don&apos;t panic framing] + [What we&apos;re seeing] + [What we&apos;ve already done] + [Clear clinical recommendation]</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  Example — Blood Sugar: &ldquo;I want to flag something for you. Your glucose readings have been consistently elevated
                  over the past two weeks, and the dietary adjustments we made haven&apos;t brought them down as much as I&apos;d hoped. This
                  doesn&apos;t mean anything is wrong — it means your body might need more support than nutrition alone can provide right
                  now. I&apos;ve prepared a detailed glucose summary for your OB. I&apos;d recommend scheduling a conversation with them this
                  week so you can discuss next steps together. Here&apos;s the report.&rdquo;
                </p>
              </div>
            </div>

            {/* 5B */}
            <h4 className="text-sm font-bold mt-6 mb-2" style={{ color: "var(--foreground)" }}>5B. Score Change Messaging</h4>
            <div className="space-y-2">
              <div className="rounded-lg p-3" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: "#1EAA55" }}>Score improved 5+ points:</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  &ldquo;Your Pregnancy Wellness Score went up [X] points this week to [score]. The biggest driver was [factor].
                  The changes you made are showing up in your numbers — that&apos;s real progress.&rdquo;
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: "var(--muted)" }}>Score stable (within 3 points):</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  &ldquo;Your score is holding steady at [score]. Consistency is exactly what we&apos;re going for right now.&rdquo;
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: "#F1C028" }}>Score declined 5+ points:</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  &ldquo;Your score dipped [X] points this week to [score]. The main shift was in [factor]. Here&apos;s what I think
                  is happening and what we&apos;re going to adjust...&rdquo;
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: "#E24D47" }}>Score declined 10+ points:</p>
                <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                  &ldquo;I noticed a bigger shift in your numbers this week. Your score moved from [old] to [new], and the change
                  is mostly driven by [factor]. This doesn&apos;t mean something is wrong — bodies fluctuate, especially during
                  pregnancy. But I want to pay closer attention to [factor] this week. [Specific action already taken by care team].
                  And [clinical bridge recommendation if warranted].&rdquo;
                </p>
              </div>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 6: MONITORING FREQUENCY CALIBRATION
              ═══════════════════════════════════════════ */}
          <SpecSection id="monitoring" num="6" title="Monitoring Frequency Calibration">
            <p>Base monitoring frequencies adjusted by Tier 3 modifiers:</p>
            <SpecTable
              headers={["Activity", "Base (1.0x)", "Elevated (1.5x)", "High (2.0x)"]}
              rows={[
                ["Kai daily summary", "1x/day", "1x/day but more detailed", "2x/day (AM + PM)"],
                ["Score recalculation", "Weekly", "Every 5 days", "Every 3 days"],
                ["Full factor assessment", "Monthly", "Every 3 weeks", "Every 2 weeks"],
                ["Care team proactive outreach", "When triggered", "Threshold reduced 10-30%", "Threshold reduced 20-40%"],
                ["OB Bridge Report generation", "Per appointment", "Same + mid-interval summary", "Same + weekly mini-summary"],
                ["Seren mental health check", "Weekly passive", "Every 5 days", "Every 3 days"],
              ]}
            />
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 7: OB BRIDGE REPORT FORMAT
              ═══════════════════════════════════════════ */}
          <SpecSection id="ob-report" num="7" title="OB Bridge Report Format">
            <div className="rounded-lg p-4 font-mono text-[11px] space-y-2" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <p style={{ color: GOLD }}>CONCEIVABLE PREGNANCY WELLNESS REPORT</p>
              <p style={{ color: "var(--foreground)" }}>Patient: [Name] | Gestational Age: [X] weeks [Y] days</p>
              <p style={{ color: "var(--foreground)" }}>Report Period: [Start Date] — [End Date]</p>
              <p style={{ color: "var(--foreground)" }}>Generated: [Date]</p>
              <p style={{ color: "var(--foreground)" }}>Provider Copy — For Clinical Use</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 1: Summary</p>
              <p style={{ color: "var(--muted)" }}>2-3 sentence overview. Flags prominently noted.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 2: Continuous Glucose Monitoring Summary</p>
              <p style={{ color: "var(--muted)" }}>Average fasting glucose, average 1hr postprandial, average 2hr postprandial, number of days exceeding Carpenter-Coustan thresholds, trend, intervention implemented, intervention response.</p>
              <p style={{ color: "#9686B9" }}>Reference: GDM OR 1.5-2.0 for preterm birth.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 3: Cardiovascular &amp; Stress Indicators</p>
              <p style={{ color: "var(--muted)" }}>Average HRV (RMSSD), HRV trend vs baseline, blood pressure estimates.</p>
              <p style={{ color: "#9686B9" }}>Reference: HRV depression associated with preeclampsia risk.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 4: Sleep &amp; Recovery</p>
              <p style={{ color: "var(--muted)" }}>Average duration, efficiency, wake episodes.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 5: Behavioral Compliance</p>
              <p style={{ color: "var(--muted)" }}>Supplement adherence, dietary plan adherence, activity level.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 6: Topics for Clinical Discussion</p>
              <p style={{ color: "var(--muted)" }}>Bulleted list of system-flagged items.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: GOLD }}>SECTION 7: Patient Wellness Score Trend</p>
              <p style={{ color: "var(--muted)" }}>Line graph showing score over reporting period.</p>
              <hr style={{ borderColor: "var(--border)" }} />
              <p style={{ color: "var(--muted)" }}>FOOTER: &quot;This report is generated from consumer wearable device data and self-reported information. All clinical thresholds reference published research. This report supplements but does not replace clinical assessment.&quot;</p>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 8: ESCALATION PROTOCOLS
              ═══════════════════════════════════════════ */}
          <SpecSection id="escalation" num="8" title="Escalation Protocols">
            <div className="space-y-3">
              <div className="rounded-lg p-4" style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#F1C028" }}>Level 1: Care Team Intervention (No clinical involvement)</h5>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Trigger:</strong> Any Tier 1 factor drops below score 65</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Action:</strong> Relevant care team member activates with adjusted protocol</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Timeline:</strong> Assess response in 7-14 days</p>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: "#F59E0B08", border: "1px solid #F59E0B20" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#F59E0B" }}>Level 2: Clinical Awareness (Recommend OB discussion)</h5>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Trigger:</strong> Any Tier 1 factor drops below score 40, OR any Tier 2 factor drops below 50, OR Level 1 intervention shows no improvement in 14 days</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Action:</strong> Add to OB Bridge Report. Kai recommends mentioning to OB.</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Timeline:</strong> At next appointment, or sooner if score below 30</p>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#E24D47" }}>Level 3: Urgent Clinical Contact (Recommend contacting OB now)</h5>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Trigger:</strong> Any Tier 2 factor drops below 30, OR rapid multi-factor decline, OR specific safety triggers</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Action:</strong> Kai recommends contacting provider. Generates immediate data summary.</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}><strong>Timeline:</strong> Recommend contact within 48 hours</p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold mb-2" style={{ color: "#E24D47" }}>Safety Triggers (always Level 3):</h5>
              <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                <li>Blood pressure sudden elevation + headache/vision symptoms</li>
                <li>Sustained glucose well above thresholds despite intervention</li>
                <li>Heavy bleeding or fluid leakage reported</li>
                <li>Severe symptoms (vision changes, sudden swelling, severe headache, decreased fetal movement)</li>
                <li>HRV crash (&gt; 40% below baseline sustained 3+ days) with other concerning indicators</li>
              </ul>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>What the System NEVER Does:</h5>
              <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                <li>Never calls 911 or emergency services</li>
                <li>Never diagnoses a medical condition by name to the user</li>
                <li>Never says &ldquo;you are having&rdquo; [preeclampsia / gestational diabetes / preterm labor]</li>
                <li>Never replaces clinical judgment</li>
                <li>Never prevents user from seeking care</li>
              </ul>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 9: DATA ARCHITECTURE
              ═══════════════════════════════════════════ */}
          <SpecSection id="data-arch" num="9" title="Data Architecture">
            <div className="rounded-lg p-4 font-mono text-[11px] space-y-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ color: GOLD }}>pregnancy_wellness_profile:</p>
                <div className="pl-4 space-y-0.5">
                  <p style={{ color: "var(--foreground)" }}>user_id: string</p>
                  <p style={{ color: "var(--foreground)" }}>gestational_age_weeks: number</p>
                  <p style={{ color: "var(--foreground)" }}>gestational_age_days: number</p>
                  <p style={{ color: "var(--foreground)" }}>due_date: date</p>
                  <p style={{ color: "var(--foreground)" }}>conception_date: date (estimated)</p>
                  <p style={{ color: "var(--foreground)" }}>has_preconception_data: boolean</p>
                  <p style={{ color: "var(--foreground)" }}>preconception_baseline: object (if available from fertility experience)</p>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>tier1_factors:</p>
                <div className="pl-4">
                  <p style={{ color: "#1EAA55" }}>blood_sugar:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>fasting_avg_7d: number</p>
                    <p style={{ color: "var(--foreground)" }}>postprandial_1hr_avg_7d: number</p>
                    <p style={{ color: "var(--foreground)" }}>postprandial_2hr_avg_7d: number</p>
                    <p style={{ color: "var(--foreground)" }}>daily_spike_count_avg: number</p>
                    <p style={{ color: "var(--foreground)" }}>trend: &quot;improving&quot; | &quot;stable&quot; | &quot;declining&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#1EAA55" }}>nutrition:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>supplement_compliance_7d: number (percentage)</p>
                    <p style={{ color: "var(--foreground)" }}>meal_regularity: number</p>
                    <p style={{ color: "var(--foreground)" }}>diet_quality: number</p>
                    <p style={{ color: "var(--foreground)" }}>iron_intake: number</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#1EAA55" }}>stress_recovery:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>hrv_vs_baseline_pct: number</p>
                    <p style={{ color: "var(--foreground)" }}>hrv_trend_14d: &quot;improving&quot; | &quot;stable&quot; | &quot;slight_decline&quot; | &quot;moderate_decline&quot; | &quot;sustained_decline&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>self_reported_stress: number (1-10)</p>
                    <p style={{ color: "var(--foreground)" }}>acute_stress_events_7d: number</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#1EAA55" }}>sleep:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>avg_duration_hrs: number</p>
                    <p style={{ color: "var(--foreground)" }}>sleep_efficiency_pct: number</p>
                    <p style={{ color: "var(--foreground)" }}>wake_episodes_avg: number</p>
                    <p style={{ color: "var(--foreground)" }}>bedtime_variance_min: number</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#1EAA55" }}>body_activity:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>bmi_at_conception: number</p>
                    <p style={{ color: "var(--foreground)" }}>weekly_activity_min: number</p>
                    <p style={{ color: "var(--foreground)" }}>weight_gain_trajectory: &quot;on_track&quot; | &quot;slightly_off&quot; | &quot;moderately_off&quot; | &quot;significantly_off&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#1EAA55" }}>substance_environmental:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>tobacco: &quot;none&quot; | &quot;quit&quot; | &quot;reduced&quot; | &quot;active&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>alcohol: &quot;none&quot; | &quot;rare&quot; | &quot;occasional&quot; | &quot;regular&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>caffeine_mg_daily: number</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>tier2_factors:</p>
                <div className="pl-4">
                  <p style={{ color: "#F59E0B" }}>blood_health:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>anemia_proxy_indicators: array</p>
                    <p style={{ color: "var(--foreground)" }}>energy_trend_as_proxy: string</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#F59E0B" }}>blood_pressure:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>face_scan_trend: &quot;stable&quot; | &quot;mild_increase&quot; | &quot;concerning_increase&quot;</p>
                    <p style={{ color: "var(--foreground)" }}>symptoms_reported: array</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                  <p style={{ color: "#F59E0B" }}>prenatal_care:</p>
                  <div className="pl-4 space-y-0.5">
                    <p style={{ color: "var(--foreground)" }}>score: number (0-100)</p>
                    <p style={{ color: "var(--foreground)" }}>appointments_scheduled: number</p>
                    <p style={{ color: "var(--foreground)" }}>appointments_completed: number</p>
                    <p style={{ color: "var(--foreground)" }}>next_appointment: date</p>
                    <p style={{ color: "var(--foreground)" }}>last_updated: timestamp</p>
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>tier3_modifiers:</p>
                <div className="pl-4 space-y-0.5">
                  <p style={{ color: "var(--foreground)" }}>maternal_age: number</p>
                  <p style={{ color: "var(--foreground)" }}>age_monitoring_multiplier: number (1.0 - 1.6)</p>
                  <p style={{ color: "var(--foreground)" }}>prior_preterm: boolean</p>
                  <p style={{ color: "var(--foreground)" }}>prior_preterm_count: number</p>
                  <p style={{ color: "var(--foreground)" }}>preterm_monitoring_multiplier: number (1.0 - 2.5)</p>
                  <p style={{ color: "var(--foreground)" }}>autoimmune_history: boolean</p>
                  <p style={{ color: "var(--foreground)" }}>multiple_gestation: boolean</p>
                  <p style={{ color: "var(--foreground)" }}>interpregnancy_interval_months: number</p>
                  <p style={{ color: "var(--foreground)" }}>combined_monitoring_multiplier: number (calculated)</p>
                  <p style={{ color: "var(--foreground)" }}>escalation_threshold_reduction_pct: number (calculated)</p>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>composite:</p>
                <div className="pl-4 space-y-0.5">
                  <p style={{ color: "var(--foreground)" }}>wellness_score: number (0-100)</p>
                  <p style={{ color: "var(--foreground)" }}>score_label: &quot;thriving&quot; | &quot;strong&quot; | &quot;building&quot; | &quot;needs_focus&quot; | &quot;priority&quot;</p>
                  <p style={{ color: "var(--foreground)" }}>score_color: string</p>
                  <p style={{ color: "var(--foreground)" }}>score_trend: &quot;improving&quot; | &quot;stable&quot; | &quot;declining&quot;</p>
                  <p style={{ color: "var(--foreground)" }}>previous_score: number</p>
                  <p style={{ color: "var(--foreground)" }}>score_change: number</p>
                  <p style={{ color: "var(--foreground)" }}>last_calculated: timestamp</p>
                  <p style={{ color: "var(--foreground)" }}>next_calculation: timestamp</p>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>escalation:</p>
                <div className="pl-4 space-y-0.5">
                  <p style={{ color: "var(--foreground)" }}>current_level: 0 | 1 | 2 | 3</p>
                  <p style={{ color: "var(--foreground)" }}>active_escalations: array of {"{"} factor: string, level: number, trigger_date: timestamp, intervention: string, review_date: timestamp {"}"}</p>
                </div>
              </div>

              <div>
                <p style={{ color: GOLD }}>ob_reports:</p>
                <div className="pl-4">
                  <p style={{ color: "var(--foreground)" }}>array of {"{"} report_id: string, period_start: date, period_end: date, generated: timestamp, appointment_date: date, topics_flagged: array, pdf_url: string {"}"}</p>
                </div>
              </div>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 10: TRIMESTER-SPECIFIC ADJUSTMENTS
              ═══════════════════════════════════════════ */}
          <SpecSection id="trimester" num="10" title="Trimester-Specific Adjustments">
            <div className="space-y-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#E24D47" }}>First Trimester (Weeks 1-13)</h5>
                <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong>Sleep:</strong> Lower expectations (fatigue normal, reduce score penalty)</li>
                  <li><strong>Nutrition:</strong> Nausea-adjusted (don&apos;t penalize for morning sickness dietary changes)</li>
                  <li><strong>Activity:</strong> Reduced expectations (fatigue normal)</li>
                  <li><strong>Temperature:</strong> HIGH PRIORITY — BBT monitoring for viability</li>
                  <li><strong>Mental health:</strong> Elevated monitoring (anxiety peaks)</li>
                  <li><strong>Special feature:</strong> First Trimester Guardian active</li>
                </ul>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#1EAA55" }}>Second Trimester (Weeks 14-27)</h5>
                <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong>Blood sugar:</strong> INCREASING PRIORITY (insulin resistance rising)</li>
                  <li><strong>Nutrition:</strong> Iron becomes priority (energy score as anemia proxy)</li>
                  <li><strong>Activity:</strong> Normal expectations return</li>
                  <li><strong>Temperature:</strong> Reduced priority</li>
                  <li><strong>Blood pressure:</strong> Begin weekly face scan monitoring</li>
                  <li><strong>Special feature:</strong> GD screening intensifies</li>
                </ul>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: "#5A6FFF08", border: "1px solid #5A6FFF20" }}>
                <h5 className="text-xs font-bold mb-2" style={{ color: "#5A6FFF" }}>Third Trimester (Weeks 28-40)</h5>
                <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong>Blood sugar:</strong> HIGHEST PRIORITY (GD risk peaks)</li>
                  <li><strong>Blood pressure:</strong> HIGHEST PRIORITY (preeclampsia risk peaks)</li>
                  <li><strong>Sleep:</strong> Adjusted expectations (discomfort normal, sustained disruption still flagged)</li>
                  <li><strong>Activity:</strong> Adjusted downward</li>
                  <li><strong>Preterm indicators:</strong> Active monitoring begins</li>
                  <li><strong>Special feature:</strong> Birth Preparation Intelligence at week 32</li>
                </ul>
              </div>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 11: FDA COMPLIANCE CHECKLIST
              ═══════════════════════════════════════════ */}
          <SpecSection id="fda" num="11" title="FDA Compliance Checklist">
            <SpecTable
              headers={["Requirement", "Implementation"]}
              rows={[
                ["No diagnostic claims", "Messaging never says \"you have [condition]\""],
                ["No risk predictions with probabilities", "No \"X% chance of [outcome]\""],
                ["No treatment recommendations", "Says \"discuss with your OB\" not \"you need [treatment]\""],
                ["Wellness framing throughout", "\"Optimize\" and \"support\" not \"treat\" and \"prevent\""],
                ["Clinical bridge not replacement", "Always supplements, never replaces prenatal care"],
                ["Clear disclaimers", "Visible on profile page, in reports, in onboarding"],
                ["No emergency claims", "Never directs to call 911 or implies emergency detection"],
                ["Self-reported data honored but validated", "Cross-validation is \"wellness insight\" not \"symptom checking\""],
              ]}
            />

            <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
              <h5 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>Standard Disclaimer (on every Wellness Profile screen):</h5>
              <p className="text-xs italic" style={{ color: "var(--muted)" }}>
                &ldquo;The Pregnancy Wellness Profile provides educational information about factors that published research
                has associated with pregnancy outcomes. It is not a medical device, does not diagnose any condition, and does
                not replace prenatal care. Always consult your healthcare provider.&rdquo;
              </p>
            </div>
          </SpecSection>

          {/* ═══════════════════════════════════════════
              SECTION 12: IMPLEMENTATION PHASES
              ═══════════════════════════════════════════ */}
          <SpecSection id="phases" num="12" title="Implementation Phases">
            <div className="space-y-3">
              {[
                {
                  phase: "Phase 1",
                  title: "Score Engine + Tier 1 Factors",
                  subtitle: "Launch with Pregnancy Experience",
                  items: [
                    "Build scoring engine with all Tier 1 factor calculations",
                    "Implement composite score with baseline buffer",
                    "Build Wellness Profile screen with factor cards",
                    "Implement GREEN and LIGHT GREEN messaging",
                    "Build daily Kai summary",
                    "Requires: Halo Ring integration",
                  ],
                },
                {
                  phase: "Phase 2",
                  title: "Interventions + Escalation",
                  subtitle: "4-6 weeks post-launch",
                  items: [
                    "Implement AMBER and RED messaging",
                    "Build escalation protocol (Levels 1-3)",
                    "Activate care team auto-routing",
                    "Build OB Bridge Report generation",
                    "Implement safety triggers",
                  ],
                },
                {
                  phase: "Phase 3",
                  title: "Tier 2 + 3 Integration",
                  subtitle: "8-12 weeks post-launch",
                  items: [
                    "Add Tier 2 factor scoring",
                    "Implement Tier 3 modifier system",
                    "Build monitoring frequency calibration",
                    "Implement trimester-specific adjustments",
                  ],
                },
                {
                  phase: "Phase 4",
                  title: "Advanced Features",
                  subtitle: "3-6 months post-launch",
                  items: [
                    "Preeclampsia early warning",
                    "Perinatal mental health monitor",
                    "Preterm labor risk monitoring",
                    "Population learning integration",
                  ],
                },
              ].map((p) => (
                <div key={p.phase} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0" style={{ backgroundColor: `${GOLD}14`, color: GOLD }}>
                      {p.phase}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{p.title}</p>
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>{p.subtitle}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <ul className="list-disc list-inside text-xs space-y-1" style={{ color: "var(--muted)" }}>
                      {p.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </SpecSection>

          {/* Engineering Components CTA */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: `${GOLD}08`, border: `1px solid ${GOLD}20` }}
          >
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Engineering Components
            </h3>
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
              5 buildable components derived from this spec are ready for development on the Engineering Kanban.
            </p>
            <Link
              href="/departments/engineering/kanban"
              className="inline-flex items-center gap-1 text-xs font-medium"
              style={{ color: GOLD }}
            >
              View on Engineering Kanban <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Spec Components ─── */

function SpecSection({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-6">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-xs font-mono font-bold px-2 py-1 rounded-md"
          style={{ backgroundColor: "#D4A84314", color: "#D4A843" }}
        >
          {num}
        </span>
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="text-sm leading-relaxed space-y-2" style={{ color: "var(--foreground)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SpecTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-xs">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 font-bold uppercase tracking-wider"
                style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)", fontSize: "10px" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-3 py-2"
                  style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FactorBlock({
  name,
  evidence,
  source,
  weight,
  tables,
  compositeNote,
}: {
  name: string;
  evidence: string;
  source: string;
  weight: string;
  tables: { headers: string[]; rows: string[][] }[];
  compositeNote?: string;
}) {
  return (
    <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <h6 className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{name}</h6>
        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>Weight: {weight}</span>
      </div>
      <p className="text-[10px] italic mb-1" style={{ color: "#1EAA55" }}>Internal evidence: {evidence}</p>
      <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Data source: {source}</p>
      {tables.map((table, idx) => (
        <SpecTable key={idx} headers={table.headers} rows={table.rows} />
      ))}
      {compositeNote && (
        <p className="text-[10px] mt-2 font-medium" style={{ color: "var(--muted)" }}>{compositeNote}</p>
      )}
    </div>
  );
}
