"use client";

import { useState } from "react";
import {
  Shield,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface PatentOpportunity {
  id: string;
  title: string;
  category: "wearable" | "software" | "supplement" | "data" | "method" | "design";
  description: string;
  claims: string[];
  priorArtRisk: "low" | "medium" | "high";
  urgency: "file-now" | "monitor" | "exploratory";
  existingCoverage: "none" | "partial" | "related";
  rationale: string;
}

const PATENT_OPPORTUNITIES: PatentOpportunity[] = [
  {
    id: "wearable-sensor-fusion",
    title: "Multi-Modal Wearable Sensor Fusion for Reproductive Health Monitoring",
    category: "wearable",
    description:
      "A wearable device and method that combines continuous basal body temperature sensing with additional biometric signals (heart rate variability, skin conductance, sleep quality metrics) to create a composite reproductive health score. Distinct from existing BBT-only approaches by fusing multiple sensor streams into a single predictive model.",
    claims: [
      "A wearable device comprising multiple biometric sensors configured to simultaneously capture BBT, HRV, and electrodermal activity",
      "Method for generating a composite fertility readiness score from fused multi-modal biometric data",
      "System for continuous overnight biometric monitoring calibrated to menstrual cycle phase",
    ],
    priorArtRisk: "medium",
    urgency: "file-now",
    existingCoverage: "none",
    rationale:
      "Your existing patent covers BBT-based AI prediction. This extends protection to the hardware layer and multi-sensor fusion — critical as competitors (Oura, Ava) enter the fertility wearable space. Hardware patents create a stronger moat than software alone.",
  },
  {
    id: "personalized-supplement-protocol",
    title: "AI-Driven Personalized Supplement Protocol Engine",
    category: "supplement",
    description:
      "A system and method for dynamically generating and adjusting supplement formulations and dosing protocols based on real-time biometric data, cycle tracking, and health assessment responses. The system uses the five predictive categories (energy, blood, temperature, stress, hormones) to create individualized supplement stacks.",
    claims: [
      "Method for dynamically adjusting supplement dosing based on continuous biometric feedback from a wearable device",
      "System for generating personalized supplement protocols using cycle-phase-aware AI models",
      "Computer-implemented method for correlating supplement adherence data with fertility outcome predictions",
    ],
    priorArtRisk: "low",
    urgency: "file-now",
    existingCoverage: "partial",
    rationale:
      "Your existing patent covers the AI prediction side. This protects the prescriptive output — the actual supplement protocol generation. As you launch supplements, competitors could build similar recommendation engines. Filing now establishes priority before your supplement line goes public.",
  },
  {
    id: "cycle-phase-content",
    title: "Cycle-Phase-Aware Health Content Delivery System",
    category: "software",
    description:
      "A system that personalizes health education content, notifications, and interventions based on the user's current menstrual cycle phase, detected automatically from wearable data and self-reported symptoms. Content is dynamically selected and timed to maximize relevance and engagement.",
    claims: [
      "Method for automatically selecting and delivering health content based on algorithmically-determined menstrual cycle phase",
      "System for timing push notifications and health interventions to cycle-phase-specific windows",
      "Computer-implemented method for adapting content tone and complexity based on predicted hormonal state",
    ],
    priorArtRisk: "low",
    urgency: "monitor",
    existingCoverage: "none",
    rationale:
      "No major competitor has patented cycle-phase-aware content delivery. This is a unique intersection of your content engine and health platform. Low prior art risk because the specific combination of cycle detection + content personalization + timing optimization is novel.",
  },
  {
    id: "digital-tcm-diagnostic",
    title: "Digital Traditional Chinese Medicine Diagnostic Framework",
    category: "method",
    description:
      "A computerized method for performing Traditional Chinese Medicine (TCM) pattern diagnosis using digital biomarkers (BBT patterns, cycle characteristics, lifestyle questionnaire responses) to identify TCM constitutional patterns and generate evidence-based treatment recommendations. Bridges the gap between traditional diagnostic frameworks and modern digital health.",
    claims: [
      "Computer-implemented method for mapping digital biomarkers to Traditional Chinese Medicine diagnostic patterns",
      "System for generating TCM-informed health recommendations using AI trained on clinical practitioner data",
      "Method for validating TCM diagnostic patterns against Western biomarker data",
    ],
    priorArtRisk: "low",
    urgency: "file-now",
    existingCoverage: "related",
    rationale:
      "This is Kirsten's unique differentiator — 15+ years of TCM clinical expertise encoded into AI. Almost zero prior art exists for digitized TCM fertility diagnostics. The training data (7,000+ patients, 500K+ BBT charts) creates an exceptionally strong position. File before competitors attempt similar TCM-digital bridges.",
  },
  {
    id: "fertility-outcome-prediction",
    title: "Multi-Factor Natural Conception Probability Model",
    category: "software",
    description:
      "An enhanced predictive model that combines the five existing categories (energy, blood, temperature, stress, hormones) with additional data inputs — partner health data, environmental factors, genetic predisposition markers, and longitudinal trend analysis — to produce a time-series probability forecast for natural conception.",
    claims: [
      "Method for generating a rolling conception probability forecast incorporating partner biometric data",
      "System for integrating environmental exposure data with fertility prediction models",
      "Computer-implemented method for trend-based fertility trajectory analysis over multiple menstrual cycles",
    ],
    priorArtRisk: "medium",
    urgency: "monitor",
    existingCoverage: "partial",
    rationale:
      "Extends your existing prediction patent into new data dimensions. The partner data integration and environmental factor incorporation are novel angles. File when partner features or environmental tracking are closer to launch.",
  },
  {
    id: "privacy-preserving-health-analytics",
    title: "Privacy-Preserving Federated Learning for Women's Health Analytics",
    category: "data",
    description:
      "A system and method for training and improving fertility prediction models using federated learning techniques, where sensitive health data never leaves the user's device. Enables population-level insights while maintaining individual privacy — critical for reproductive health data post-Dobbs.",
    claims: [
      "Method for training fertility prediction models using federated learning across distributed user devices",
      "System for generating anonymized population health insights from encrypted individual health data",
      "Privacy-preserving method for improving AI model accuracy using differential privacy techniques applied to reproductive health data",
    ],
    priorArtRisk: "medium",
    urgency: "file-now",
    existingCoverage: "none",
    rationale:
      "Post-Dobbs, reproductive health data privacy is a massive differentiator and regulatory concern. Being the first to patent privacy-preserving fertility AI positions Conceivable as the trusted platform. Strong marketing and defensive value.",
  },
  {
    id: "supplement-formulation-synergy",
    title: "Synergistic Supplement Formulation for Cycle-Phase Optimization",
    category: "supplement",
    description:
      "Novel supplement compositions specifically formulated for different menstrual cycle phases (follicular, ovulatory, luteal, menstrual), with ingredient ratios optimized through clinical data analysis. Each phase-specific formulation targets the biological processes most active during that phase.",
    claims: [
      "A dietary supplement composition comprising specific ratios of ingredients optimized for the follicular phase of the menstrual cycle",
      "A system of phased supplement formulations designed to be taken sequentially across menstrual cycle phases",
      "Method for determining optimal supplement ingredient ratios based on clinical outcome data correlated with cycle phase",
    ],
    priorArtRisk: "medium",
    urgency: "file-now",
    existingCoverage: "none",
    rationale:
      "Cycle-phased supplement systems are emerging in the market (Binto, Needed) but none have patented the specific formulations optimized through AI and clinical data. Filing a composition patent with your clinical evidence creates a strong competitive barrier for the supplement line.",
  },
  {
    id: "wearable-sleep-fertility",
    title: "Sleep Architecture Analysis for Fertility Optimization",
    category: "wearable",
    description:
      "A method and system for analyzing sleep architecture patterns (sleep stages, disruptions, timing, duration) captured by a wearable device to generate fertility-specific sleep optimization recommendations and predict impact on conception probability.",
    claims: [
      "Method for correlating sleep architecture patterns with fertility biomarkers to generate personalized sleep recommendations",
      "System for detecting fertility-relevant sleep disruptions using wearable sensor data",
      "Computer-implemented method for incorporating sleep quality metrics into a fertility prediction model",
    ],
    priorArtRisk: "low",
    urgency: "monitor",
    existingCoverage: "none",
    rationale:
      "Sleep and fertility is a well-established clinical connection but no one has patented a system for sleep-fertility optimization. As the wearable captures sleep data, this becomes a natural extension. Low risk, high value.",
  },
  {
    id: "miscarriage-risk-prediction",
    title: "Early Miscarriage Risk Detection from Biometric and Behavioral Signals",
    category: "software",
    description:
      "A system and method for identifying elevated miscarriage risk by analyzing changes in biometric patterns (BBT shifts, HRV changes), behavioral signals (stress indicators, activity changes), and health assessment responses during early pregnancy. Provides early intervention recommendations.",
    claims: [
      "Method for detecting elevated miscarriage risk from continuous biometric monitoring during early pregnancy",
      "System for generating early intervention recommendations based on identified miscarriage risk factors",
      "Computer-implemented method for correlating pre-conception health metrics with post-conception risk scores",
    ],
    priorArtRisk: "low",
    urgency: "file-now",
    existingCoverage: "related",
    rationale:
      "Your existing technology already tracks the pre-conception journey. Extending into early pregnancy miscarriage risk detection is a natural expansion and addresses a massive unmet need. Very limited prior art in AI-driven miscarriage prediction from wearable data.",
  },
  {
    id: "community-health-insights",
    title: "Anonymized Cohort-Based Health Benchmarking System",
    category: "data",
    description:
      "A system for generating anonymized, cohort-based health benchmarks that allow users to compare their fertility health metrics against similar demographic groups — without exposing individual data. Users see where they stand relative to peers with similar profiles.",
    claims: [
      "Method for generating anonymized cohort health benchmarks from aggregated reproductive health data",
      "System for providing personalized health comparisons against statistically matched peer cohorts",
      "Privacy-preserving method for computing percentile rankings across fertility health metrics",
    ],
    priorArtRisk: "low",
    urgency: "exploratory",
    existingCoverage: "none",
    rationale:
      "As the user base grows, cohort data becomes extremely valuable. Patenting the benchmarking methodology early protects this future asset. Similar approaches exist in fitness (Garmin, Whoop) but not in fertility/reproductive health.",
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  wearable: { label: "Wearable", color: "#3B82F6" },
  software: { label: "Software/AI", color: "#7C3AED" },
  supplement: { label: "Supplement", color: "#10B981" },
  data: { label: "Data/Privacy", color: "#F59E0B" },
  method: { label: "Method", color: "#EC4899" },
  design: { label: "Design", color: "#6366F1" },
};

const URGENCY_CONFIG = {
  "file-now": { label: "File Now", icon: AlertTriangle, color: "#EF4444", bg: "#FEF2F2" },
  monitor: { label: "Monitor", icon: Clock, color: "#F59E0B", bg: "#FFFBEB" },
  exploratory: { label: "Exploratory", icon: Sparkles, color: "#3B82F6", bg: "#EFF6FF" },
};

interface IPOpportunitiesProps {
  onSelectOpportunity: (opportunity: PatentOpportunity) => void;
}

export default function IPOpportunities({ onSelectOpportunity }: IPOpportunitiesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [filterUrgency, setFilterUrgency] = useState<string | "all">("all");

  const filtered = PATENT_OPPORTUNITIES.filter((opp) => {
    if (filterCategory !== "all" && opp.category !== filterCategory) return false;
    if (filterUrgency !== "all" && opp.urgency !== filterUrgency) return false;
    return true;
  });

  const fileNowCount = PATENT_OPPORTUNITIES.filter((o) => o.urgency === "file-now").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield size={20} style={{ color: "var(--brand-primary)" }} />
          <h3 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
            IP Opportunities
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}
          >
            {fileNowCount} to file now
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {PATENT_OPPORTUNITIES.length} opportunities identified
        </span>
      </div>

      {/* Existing IP Summary */}
      <div
        className="rounded-xl border p-4 mb-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "var(--status-success)" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Existing Patent Coverage
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Patented AI/ML methods for fertility prediction using basal body temperature analysis across
              five predictive categories (energy, blood, temperature, stress, hormones). Trained on 500K+ BBT
              charts from 7,000+ patients. Covers the &ldquo;Kirsten AI&rdquo; core prediction engine and prescriptive
              intervention recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Filter:</span>
        <button
          onClick={() => setFilterCategory("all")}
          className={`text-xs px-2.5 py-1 rounded-full border ${filterCategory === "all" ? "font-medium" : ""}`}
          style={{
            borderColor: filterCategory === "all" ? "var(--brand-primary)" : "var(--border)",
            color: filterCategory === "all" ? "var(--brand-primary)" : "var(--muted)",
            backgroundColor: filterCategory === "all" ? "var(--border-light)" : "transparent",
          }}
        >
          All Categories
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(key === filterCategory ? "all" : key)}
            className={`text-xs px-2.5 py-1 rounded-full border ${filterCategory === key ? "font-medium" : ""}`}
            style={{
              borderColor: filterCategory === key ? "var(--brand-primary)" : "var(--border)",
              color: filterCategory === key ? "var(--brand-primary)" : "var(--muted)",
              backgroundColor: filterCategory === key ? "var(--border-light)" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--border)" }} />
        {Object.entries(URGENCY_CONFIG).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilterUrgency(key === filterUrgency ? "all" : key)}
            className={`text-xs px-2.5 py-1 rounded-full border ${filterUrgency === key ? "font-medium" : ""}`}
            style={{
              borderColor: filterUrgency === key ? "var(--brand-primary)" : "var(--border)",
              color: filterUrgency === key ? "var(--brand-primary)" : "var(--muted)",
              backgroundColor: filterUrgency === key ? "var(--border-light)" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-3">
        {filtered.map((opp) => {
          const isExpanded = expandedId === opp.id;
          const categoryConfig = CATEGORY_LABELS[opp.category];
          const urgencyConfig = URGENCY_CONFIG[opp.urgency];
          const UrgencyIcon = urgencyConfig.icon;

          return (
            <div
              key={opp.id}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                className="w-full flex items-start gap-3 p-4 text-left"
              >
                <Lightbulb size={16} className="mt-0.5 shrink-0" style={{ color: categoryConfig.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {opp.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${categoryConfig.color}15`, color: categoryConfig.color }}
                    >
                      {categoryConfig.label}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: urgencyConfig.bg, color: urgencyConfig.color }}
                    >
                      <UrgencyIcon size={10} />
                      {urgencyConfig.label}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--muted)",
                      }}
                    >
                      Prior art risk: {opp.priorArtRisk}
                    </span>
                    {opp.existingCoverage !== "none" && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: "#F0FDF4",
                          color: "#16A34A",
                        }}
                      >
                        {opp.existingCoverage === "partial" ? "Extends existing patent" : "Related to existing patent"}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                )}
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div
                  className="px-4 pb-4 border-t pt-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="text-sm mb-4" style={{ color: "var(--foreground)" }}>
                    {opp.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                      POTENTIAL CLAIMS
                    </p>
                    <ul className="space-y-1.5">
                      {opp.claims.map((claim, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="text-xs font-mono shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center"
                            style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-xs" style={{ color: "var(--foreground)" }}>
                            {claim}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="rounded-lg p-3 mb-4"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>
                      WHY FILE THIS
                    </p>
                    <p className="text-xs" style={{ color: "var(--foreground)" }}>
                      {opp.rationale}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    Select & Draft Provisional
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { PatentOpportunity };
