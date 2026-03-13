"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react";

const ACCENT = "#F4A7B9";

const FACTORS = [
  {
    name: "Family History",
    weight: 20,
    color: "#E37FB1",
    question: "When did your mom get her first period?",
    clinical: "Strongest non-physical predictor. Mother's menarche age is the single best familial predictor.",
    scoring: "Each year mom was earlier/later shifts prediction proportionally. If mom was 11, daughter likely 10.5-12.5. If mom was 15, daughter likely 14-16.",
    optional: "Sisters, maternal grandmother",
  },
  {
    name: "Breast Development",
    weight: 20,
    color: "#C9536E",
    question: "Self-assessment with age-appropriate language",
    clinical: "Thelarche (breast budding) precedes menarche by approximately 2-3 years. Most reliable physical predictor.",
    options: [
      { label: "No changes yet", prediction: "Menarche likely 2+ years away" },
      { label: "Just starting to develop", prediction: "Menarche likely 1.5-3 years away" },
      { label: "Noticeably developing", prediction: "Menarche likely 1-2 years away" },
      { label: "Well developed", prediction: "Menarche likely within 1 year" },
    ],
  },
  {
    name: "Growth Spurt",
    weight: 15,
    color: "#D4A843",
    question: "Have you grown a lot in the last year?",
    clinical: "Peak height velocity typically occurs 6-12 months before menarche.",
    options: [
      { label: "I've grown a lot recently", prediction: "Menarche may be 6-12 months away" },
      { label: "I'm growing steadily", prediction: "Still in growth phase, menarche 1+ year" },
      { label: "I haven't grown much lately", prediction: "May have passed peak velocity → menarche closer" },
    ],
  },
  {
    name: "Cervical Discharge",
    weight: 15,
    color: "#9686B9",
    question: "Have you noticed any clear or white discharge in your underwear?",
    clinical: "Most predictive SHORT-TERM indicator. Physiologic leukorrhea typically appears 6-12 months before menarche.",
    options: [
      { label: "Yes", prediction: "Menarche likely within 6-12 months — strongest near-term signal" },
      { label: "No", prediction: "Menarche likely 6+ months away" },
    ],
  },
  {
    name: "Age",
    weight: 10,
    color: "#5A6FFF",
    question: "Date of birth",
    clinical: "Baseline factor. Average menarche age in US: 12.4 years. Range: 9-16.",
    scoring: "Gaussian distribution centered on 12.4, adjusted by other factors.",
  },
  {
    name: "Body Hair Development",
    weight: 10,
    color: "#78C3BF",
    question: "Have you started growing hair under your arms or in your pubic area?",
    clinical: "Pubic and axillary hair development correlates with adrenal maturation.",
    options: [
      { label: "Yes, both", prediction: "Development advanced, menarche closer" },
      { label: "Yes, some", prediction: "Development progressing" },
      { label: "No", prediction: "Earlier stage" },
    ],
  },
  {
    name: "Skin Changes",
    weight: 5,
    color: "#356FB6",
    question: "Have you started getting pimples or oily skin?",
    clinical: "Acne onset correlates with hormonal activation.",
    scoring: "Yes → hormonal activity increasing",
  },
  {
    name: "Body Composition",
    weight: 5,
    color: "#7CAE7A",
    question: "Height and weight (optional)",
    clinical: "Higher BMI is associated with earlier menarche. Used internally only.",
    bodyPositivity: true,
  },
];

export default function FirstPeriodPredictionPage() {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(FACTORS[0].name);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/departments/product/experiences/first-period" className="p-2 rounded-lg hover:bg-black/5 transition-colors">
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              First Period Prediction Algorithm
            </h1>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}>
              Sprint Item
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
              Proven: 1,000 emails/week
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Technical Specification — Menarche prediction from developmental markers
          </p>
        </div>
      </div>

      {/* Purpose */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderLeft: `4px solid ${ACCENT}` }}>
        <h2 className="text-sm font-bold mb-2" style={{ color: "var(--foreground)" }}>Purpose</h2>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Predict approximate timing of menarche from self-reported developmental markers. Generates a <strong style={{ color: ACCENT }}>prediction WINDOW</strong> (not a specific date) that narrows as more data is logged. Previous version of this tool generated <strong style={{ color: "#1EAA55" }}>1,000 emails per week</strong> — proven lead gen magnet.
        </p>
      </div>

      {/* Factor Weights */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
          Input Factors & Weights
        </h2>
        <div className="space-y-3">
          {FACTORS.map((factor) => {
            const isExpanded = expandedFactor === factor.name;
            return (
              <div key={factor.name}>
                <button onClick={() => setExpandedFactor(isExpanded ? null : factor.name)} className="w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: `${factor.color}14`, color: factor.color }}>
                      {factor.weight}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-left" style={{ color: "var(--foreground)" }}>{factor.name}</span>
                        {factor.bodyPositivity && (
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#E37FB114", color: "#E37FB1" }}>
                            Body Positivity
                          </span>
                        )}
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${factor.weight * 5}%`, backgroundColor: factor.color }} />
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={14} style={{ color: "var(--muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--muted)" }} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-11 mt-3 rounded-xl p-4 space-y-2" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                      <strong style={{ color: "var(--foreground)" }}>Question:</strong> &quot;{factor.question}&quot;
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                      <strong style={{ color: "var(--foreground)" }}>Clinical Basis:</strong> {factor.clinical}
                    </p>
                    {factor.scoring && (
                      <p className="text-[11px]" style={{ color: "var(--muted)" }}>
                        <strong style={{ color: "var(--foreground)" }}>Scoring:</strong> {factor.scoring}
                      </p>
                    )}
                    {factor.options && (
                      <div className="grid grid-cols-1 gap-1.5 mt-2">
                        {factor.options.map((opt) => (
                          <div key={opt.label} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: factor.color }} />
                            <div>
                              <p className="text-[10px] font-semibold" style={{ color: "var(--foreground)" }}>&quot;{opt.label}&quot;</p>
                              <p className="text-[10px]" style={{ color: factor.color }}>{opt.prediction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {factor.bodyPositivity && (
                      <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: "#E37FB108", border: "1px solid #E37FB120" }}>
                        <p className="text-[10px]" style={{ color: "#E37FB1" }}>
                          <Heart size={10} className="inline mr-1" />
                          <strong>Body Positivity:</strong> Height and weight are optional, used internally only. NEVER displayed as BMI or weight-related feedback. Body positivity framing is paramount.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Output Display */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}25` }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: ACCENT }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Algorithm Output — Prediction Window
          </h2>
        </div>
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--foreground)" }}>
            &quot;Based on what you&apos;ve told me, your body is showing signs that your first period is likely in the next <strong style={{ color: ACCENT }}>[X to Y months]</strong>. Here&apos;s what those signs mean and how to get ready.&quot;
          </p>
          <p className="text-[10px] mt-3" style={{ color: "var(--muted)" }}>
            Window narrows as she logs more data. NOT clinical. NOT a countdown timer. Warm, visual, age-appropriate.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Early Stage", desc: "Multiple signals but no near-term indicators", color: "#5A6FFF" },
            { label: "Getting Closer", desc: "Growth spurt detected, development progressing", color: "#F59E0B" },
            { label: "Almost There", desc: "Discharge detected — strongest near-term signal", color: "#1EAA55" },
          ].map((stage) => (
            <div key={stage.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${stage.color}08`, border: `1px solid ${stage.color}20` }}>
              <p className="text-xs font-bold" style={{ color: stage.color }}>{stage.label}</p>
              <p className="text-[9px] mt-1" style={{ color: "var(--muted)" }}>{stage.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-3 italic" style={{ color: ACCENT }}>
          Kai: &quot;You mentioned noticing discharge last week — that&apos;s a big signal! Most girls see their first period within 6-12 months after that starts. Your body is getting ready.&quot;
        </p>
      </div>

      {/* Standalone Web Version */}
      <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={16} style={{ color: ACCENT }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Standalone Web Version — TikTok Funnel
          </h2>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
            Top of Funnel
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
          Quiz version at <strong style={{ color: ACCENT }}>conceivable.com/first-period-quiz</strong>. She answers the questions, gets her prediction window, gets invited to download the app. Email capture for Mailchimp.
        </p>
        <div className="flex items-center gap-4">
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#5A6FFF08", border: "1px solid #5A6FFF20" }}>
            <p className="text-xs font-bold" style={{ color: "#5A6FFF" }}>TikTok → Quiz</p>
          </div>
          <TrendingUp size={14} style={{ color: "var(--muted)" }} />
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#F59E0B08", border: "1px solid #F59E0B20" }}>
            <p className="text-xs font-bold" style={{ color: "#F59E0B" }}>Email Capture</p>
          </div>
          <TrendingUp size={14} style={{ color: "var(--muted)" }} />
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}>
            <p className="text-xs font-bold" style={{ color: "#1EAA55" }}>App Download</p>
          </div>
        </div>
      </div>

      {/* Patent */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: `${ACCENT}08`, border: `2px solid ${ACCENT}30` }}>
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: ACCENT }} />
          <div>
            <p className="text-sm font-bold" style={{ color: ACCENT }}>Patent 018: Predictive First Menarche Analytics System</p>
            <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
              Already filed — covers prediction from developmental markers
            </p>
            <Link href="/departments/legal/patent-drafts/patent-018" className="text-[10px] font-medium mt-1 inline-block" style={{ color: ACCENT }}>
              View Patent Draft →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
