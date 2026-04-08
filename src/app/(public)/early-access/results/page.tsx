"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_CATEGORIES,
  getBridgeCopy,
  type ScoreInterpretation,
} from "@/lib/data/early-access-quiz";
import {
  PACK_VARIANTS,
  fetchActiveVariant,
  buildPackCartUrl,
  type PackConfig,
} from "@/lib/data/pack-config";
import { initPostHog, captureEvent } from "@/lib/analytics/posthog-client";

// Facebook Pixel helper
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
function trackFBEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
}

interface QuizResults {
  answers: Record<string, string | string[]>;
  totalScore: number;
  categoryScores: Record<string, { score: number; maxScore: number; percentage: number }>;
  interpretation: ScoreInterpretation;
  journeyStage?: string;
  biggestConcern?: string;
  firstName?: string;
  email?: string;
}

// Circular score indicator
function ScoreCircle({ score, color }: { score: number; color: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 54; // radius = 54

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#E8E5DC" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: "#2A2828" }}>{animatedScore}</span>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>out of 100</span>
      </div>
    </div>
  );
}

// Category bar
function CategoryBar({ name, icon, percentage, color }: { name: string; icon: string; percentage: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(percentage), 200); }, [percentage]);
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-7 text-center">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium" style={{ color: "#2A2828" }}>{name}</span>
          <span className="text-sm font-semibold" style={{ color }}>{percentage}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E8E5DC" }}>
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

// ── Supplement data with doses, science, and personalized context ──

interface SupplementDetail {
  name: string;
  icon: string;
  dose: string;
  reason: string;
  category?: string; // which quiz category triggered this
  science: string[]; // 3 FDA-compliant structure/function bullets
  personalizedBullets?: Record<string, string[]>; // keyed by quiz category — shown when that category is weak
}

const SUPPLEMENT_DB: Record<string, SupplementDetail> = {
  "Methylated Folate": {
    name: "Methylated Folate",
    icon: "🧬",
    dose: "800 mcg (as L-5-MTHF)",
    reason: "The prenatal foundation — essential for DNA replication and healthy cell division",
    science: [
      "L-5-MTHF is the bioactive form of folate, bypassing the MTHFR conversion step that up to 40% of women have difficulty with",
      "Supports normal neural tube development and healthy cell division during the earliest stages of pregnancy",
      "Plays a key role in homocysteine metabolism, supporting cardiovascular and reproductive function",
    ],
  },
  "CoQ10": {
    name: "CoQ10",
    icon: "⚡",
    dose: "200 mg (as Ubiquinol)",
    reason: "Supports mitochondrial energy production in egg cells",
    science: [
      "Ubiquinol is the reduced, body-ready form of CoQ10 — supporting mitochondrial energy production in every cell, including oocytes",
      "Naturally occurring CoQ10 levels decline with age; supplementation helps maintain cellular energy output",
      "Acts as a fat-soluble antioxidant, helping protect cells from oxidative stress",
    ],
  },
  "Vitamin D3": {
    name: "Vitamin D3",
    icon: "☀️",
    dose: "2,000 IU (50 mcg)",
    reason: "Supports hormone production, immune function, and reproductive health",
    science: [
      "Vitamin D receptors are present in reproductive tissues including the ovaries, uterus, and placenta",
      "Supports calcium absorption, immune system regulation, and normal inflammatory response",
      "Over 40% of women of reproductive age have insufficient vitamin D levels, which may affect hormonal balance",
    ],
  },
  "Omega-3 (EPA/DHA)": {
    name: "Omega-3 (EPA/DHA)",
    icon: "🐟",
    dose: "1,000 mg (600 EPA / 400 DHA)",
    reason: "Supports healthy inflammatory response and reproductive tissue function",
    science: [
      "EPA and DHA support a healthy inflammatory response throughout the body, including reproductive tissues",
      "DHA is a structural component of cell membranes and supports healthy blood flow to the uterus",
      "Omega-3 fatty acids support hormonal balance by serving as precursors to anti-inflammatory signaling molecules",
    ],
  },
  "Vitex Berry": {
    name: "Vitex Berry (Chasteberry)",
    icon: "🌿",
    dose: "400 mg (standardized extract)",
    reason: "Supports progesterone production and healthy cycle regularity",
    category: "cycle",
    science: [
      "Vitex acts on the pituitary gland to support the body's natural production of luteinizing hormone (LH) and progesterone",
      "Traditionally used for centuries to support menstrual cycle regularity and healthy luteal phase length",
      "Supports the body's hormonal communication between the brain and ovaries",
    ],
    personalizedBullets: {
      cycle: [
        "Your cycle health score suggests your body may benefit from additional progesterone support",
        "Vitex supports the pituitary-ovarian axis, which plays a central role in cycle timing and regularity",
        "Many women with irregular cycles see improvements in cycle predictability within 2-3 months of consistent use",
      ],
    },
  },
  "Iron Bisglycinate": {
    name: "Iron Bisglycinate",
    icon: "💊",
    dose: "25 mg (chelated)",
    reason: "Replenishes iron stores essential for energy, ovulation, and oxygen transport",
    category: "nutrition",
    science: [
      "Bisglycinate is a chelated form of iron with significantly better absorption and fewer GI side effects than standard iron supplements",
      "Adequate iron stores support oxygen transport to reproductive tissues and healthy energy levels",
      "Iron plays a role in ovulatory function — low ferritin levels are associated with changes in cycle regularity",
    ],
    personalizedBullets: {
      nutrition: [
        "Your nutrition score suggests your diet may not be providing optimal iron levels for reproductive health",
        "Women of reproductive age lose iron monthly through menstruation — most don't replenish enough through diet alone",
        "Chelated iron is gentler on digestion, so you can build your stores without the stomach upset of typical iron pills",
      ],
    },
  },
  "Magnesium Glycinate": {
    name: "Magnesium Glycinate",
    icon: "🌙",
    dose: "300 mg (as glycinate chelate)",
    reason: "Promotes restorative sleep and supports healthy stress response",
    category: "sleep",
    science: [
      "Magnesium glycinate supports GABA receptor activity, the neurotransmitter responsible for calming the nervous system and promoting sleep",
      "Over 50% of women don't meet daily magnesium requirements — a mineral involved in over 300 enzymatic reactions",
      "Supports healthy cortisol regulation and normal muscle relaxation, both critical for sleep quality",
    ],
    personalizedBullets: {
      sleep: [
        "Your sleep & recovery score indicates your body could use more support winding down and staying asleep",
        "Poor sleep quality directly affects hormonal rhythms — melatonin, cortisol, and reproductive hormones are all sleep-dependent",
        "Magnesium glycinate is the most calming form of magnesium, specifically chosen for its nervous system support",
      ],
    },
  },
  "Ashwagandha": {
    name: "Ashwagandha (KSM-66)",
    icon: "🧘",
    dose: "600 mg (KSM-66 root extract)",
    reason: "An adaptogen that supports healthy cortisol levels and stress resilience",
    category: "stress",
    science: [
      "KSM-66 is the most clinically studied ashwagandha extract, shown to support healthy cortisol levels already within normal range",
      "Classified as an adaptogen — it helps the body maintain balance during periods of physical and emotional stress",
      "Supports healthy thyroid function and energy levels by modulating the HPA (hypothalamic-pituitary-adrenal) axis",
    ],
    personalizedBullets: {
      stress: [
        "Your stress & lifestyle score suggests elevated stress may be affecting your body's hormonal balance",
        "Chronic stress keeps cortisol elevated, which can suppress progesterone — the hormone most critical for maintaining pregnancy",
        "Ashwagandha helps your body adapt to stress rather than stay stuck in fight-or-flight mode",
      ],
    },
  },
  "DIM": {
    name: "DIM (Diindolylmethane)",
    icon: "🔬",
    dose: "200 mg (with BioPerine)",
    reason: "Supports healthy estrogen metabolism and hormonal balance",
    category: "hormonal",
    science: [
      "DIM is a compound naturally found in cruciferous vegetables that supports the liver's phase I and phase II estrogen metabolism pathways",
      "Promotes the conversion of estrogen into its favorable metabolites (2-OH) rather than less favorable forms (16-OH, 4-OH)",
      "Supports hormonal balance by helping the body process and clear excess estrogen naturally",
    ],
    personalizedBullets: {
      hormonal: [
        "Your hormonal signals score suggests your body may be dealing with suboptimal estrogen metabolism",
        "Symptoms like breast tenderness, heavy periods, or PMS can indicate the body isn't clearing estrogen efficiently",
        "DIM gives your liver the compounds it needs to process estrogen through healthier metabolic pathways",
      ],
    },
  },
  "Myo-Inositol": {
    name: "Myo-Inositol",
    icon: "🔄",
    dose: "2,000 mg (40:1 myo to D-chiro ratio)",
    reason: "Supports insulin signaling and healthy ovarian function",
    category: "history",
    science: [
      "Myo-inositol acts as a secondary messenger in insulin signaling, supporting the body's ability to use glucose efficiently",
      "The 40:1 ratio of myo-inositol to D-chiro-inositol mirrors the body's natural ratio and supports normal ovarian function",
      "Supports healthy androgen levels and regular ovulatory cycles by improving insulin receptor sensitivity",
    ],
    personalizedBullets: {
      history: [
        "Your health history score suggests factors that may benefit from insulin-sensitizing support",
        "Insulin resistance — even at subclinical levels — can disrupt ovulation and hormonal signaling",
        "Myo-inositol is one of the most well-studied nutrients for supporting metabolic and reproductive health simultaneously",
      ],
    },
  },
};

// Category display names for personalized context
const CATEGORY_LABELS: Record<string, string> = {
  cycle: "Cycle Health",
  nutrition: "Nutrition",
  sleep: "Sleep & Recovery",
  stress: "Stress & Lifestyle",
  hormonal: "Hormonal Signals",
  history: "Health History",
};

function getSupplementRecs(
  categoryScores: Record<string, { percentage: number }>,
  packConfig?: PackConfig,
) {
  const config = packConfig || PACK_VARIANTS.A;
  const coreNames = config.coreSupplements;
  const personalizedCount = config.personalizedCount;

  const categoryMap: Record<string, string> = {
    cycle: "Vitex Berry",
    nutrition: "Iron Bisglycinate",
    sleep: "Magnesium Glycinate",
    stress: "Ashwagandha",
    hormonal: "DIM",
    history: "Myo-Inositol",
  };

  const sorted = Object.entries(categoryScores).sort((a, b) => a[1].percentage - b[1].percentage);
  const weakCategories = sorted.slice(0, personalizedCount).map(([catId]) => catId);

  const personalized = weakCategories
    .map((catId) => {
      const name = categoryMap[catId];
      if (!name || !SUPPLEMENT_DB[name]) return null;
      const supp = { ...SUPPLEMENT_DB[name] };
      // Use personalized bullets if available for this category
      if (supp.personalizedBullets?.[catId]) {
        supp.science = supp.personalizedBullets[catId];
      }
      return { ...supp, triggeredBy: catId };
    })
    .filter(Boolean) as (SupplementDetail & { triggeredBy: string })[];

  const core = coreNames.map((name) => ({
    ...SUPPLEMENT_DB[name],
    triggeredBy: undefined as string | undefined,
  }));

  return [...personalized, ...core];
}

// #1 tip
function getTopTip(categoryScores: Record<string, { percentage: number }>) {
  const weakest = Object.entries(categoryScores).sort((a, b) => a[1].percentage - b[1].percentage)[0];
  const tips: Record<string, { area: string; tip: string }> = {
    cycle: { area: "Cycle Health", tip: "Start tracking your cycle daily — even just noting start/end dates. Irregular cycles are often the first sign your body is asking for help, and tracking is the first step to understanding what it needs." },
    nutrition: { area: "Nutrition", tip: "Add one extra serving of leafy greens per day. Folate, iron, and antioxidants from dark greens are among the most impactful nutrients for reproductive health — and most women are deficient." },
    sleep: { area: "Sleep & Recovery", tip: "Set a consistent bedtime — yes, even on weekends. Your circadian rhythm directly regulates your hormones, and even 30 minutes of inconsistency can disrupt ovulation timing." },
    stress: { area: "Stress & Lifestyle", tip: "Try 10 minutes of breathwork or meditation before bed. Chronic stress elevates cortisol, which directly suppresses progesterone — the hormone you need most for implantation." },
    hormonal: { area: "Hormonal Signals", tip: "Pay attention to your cervical mucus mid-cycle. Clear, stretchy mucus around day 12-16 is a sign of healthy estrogen levels and ovulation. No mucus changes? That's worth investigating." },
    history: { area: "Health History", tip: "Book a preconception checkup with your OB/GYN. Getting baseline bloodwork (AMH, TSH, fasting insulin) now can help you and your care team get ahead of any issues." },
  };
  return tips[weakest[0]] || tips.cycle;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const [signupError, setSignupError] = useState("");
  const [copied, setCopied] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const [packVariant, setPackVariant] = useState<"A" | "B">("B");
  const [expandedSupp, setExpandedSupp] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");
    if (!stored) { router.push("/early-access"); return; }
    const parsed = JSON.parse(stored) as QuizResults;
    setResults(parsed);
    if (parsed.email) setEmail(parsed.email);
    fetchActiveVariant().then((v) => setPackVariant(v));
    fetch("/api/early-access/track-view", { method: "POST" }).catch(() => {});
    trackFBEvent("ViewContent", { content_name: "Quiz Results", content_category: "Results", value: parsed.totalScore });
    initPostHog();
    captureEvent("quiz_results_viewed", { score: parsed.totalScore });
  }, [router]);

  // Auto-submit if email was collected during quiz
  useEffect(() => {
    if (!results || !results.email || submitted || autoSubmitting) return;
    setAutoSubmitting(true);
    const doAutoSubmit = async () => {
      try {
        const res = await fetch("/api/early-access/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: results.email,
            firstName: results.firstName || undefined,
            quizAnswers: results.answers,
            score: results.totalScore,
            categoryScores: results.categoryScores,
            utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
            utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
            utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
            referredBy: new URLSearchParams(window.location.search).get("ref") || undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setReferralCode(data.referralCode || "");
          setWaitlistPosition(data.waitlistPosition || 0);
          setSubmitted(true);
        }
      } catch { /* Silent fail */ } finally { setAutoSubmitting(false); }
    };
    doAutoSubmit();
  }, [results, submitted, autoSubmitting]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "#5A6FFF", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const { totalScore, categoryScores, interpretation } = results;
  const topTip = getTopTip(categoryScores);
  const packConfig = PACK_VARIANTS[packVariant];
  const supplements = getSupplementRecs(categoryScores, packConfig);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setSignupError("");
    try {
      const res = await fetch("/api/early-access/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          quizAnswers: results.answers,
          score: totalScore,
          categoryScores,
          utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
          utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
          referredBy: new URLSearchParams(window.location.search).get("ref") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign up");
      setReferralCode(data.referralCode || "");
      setWaitlistPosition(data.waitlistPosition || 0);
      setSubmitted(true);
      trackFBEvent("Lead", { content_name: "Results Email Capture" });
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  const referralLink = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/early-access?ref=${referralCode}`
    : "";

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center px-4 pb-12 max-w-lg mx-auto">
      {/* Results heading */}
      <h1
        className="text-2xl md:text-3xl text-center mt-4 mb-6"
        style={{
          fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
          fontWeight: 700,
          color: "#2A2828",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          lineHeight: 1.2,
        }}
      >
        Kai put together the ultimate fertility pack{" "}
        <span style={{ color: "#5A6FFF" }}>for you.</span>
      </h1>

      {/* Supplement Recommendations — ABOVE THE FOLD */}
      <div
        className="w-full rounded-2xl p-5 mb-6"
        style={{ background: "#FFFEFA", border: "1px solid #E8E5DC" }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-xs tracking-widest"
            style={{
              fontFamily: '"Rauschen A", "Inter", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#1EAA55",
            }}
          >
            Your Personalized Supplement Pack
          </h3>
          {packConfig.price && (
            <span
              className="text-sm font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(90, 111, 255, 0.1)", color: "#5A6FFF" }}
            >
              {packConfig.priceLabel}
            </span>
          )}
        </div>
        <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
          {packConfig.pillCount} supplements selected for your body
        </p>

        <div className="grid gap-2 mb-4">
          {supplements.map((s) => {
            const isExpanded = expandedSupp === s.name;
            const triggeredBy = (s as typeof s & { triggeredBy?: string }).triggeredBy;
            return (
              <div key={s.name}>
                <button
                  onClick={() => setExpandedSupp(isExpanded ? null : s.name)}
                  className="w-full text-left flex items-start gap-3 rounded-xl p-3 transition-all"
                  style={{
                    background: isExpanded ? "rgba(90, 111, 255, 0.04)" : "transparent",
                    border: isExpanded ? "1px solid rgba(90, 111, 255, 0.12)" : "1px solid transparent",
                  }}
                >
                  <span className="text-xl mt-0.5">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-sm" style={{ color: "#2A2828" }}>{s.name}</span>
                        <span className="text-xs ml-2" style={{ color: "#5A6FFF", fontWeight: 600 }}>{s.dose}</span>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          flexShrink: 0,
                        }}
                      >
                        <path d="M4 6L8 10L12 6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{s.reason}</div>
                    {triggeredBy && (
                      <div
                        className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: "rgba(227, 127, 177, 0.1)", color: "#E37FB1" }}
                      >
                        Selected for your {CATEGORY_LABELS[triggeredBy] || triggeredBy} score
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded science panel */}
                {isExpanded && (
                  <div
                    className="ml-10 mt-1 mb-2 rounded-xl p-4"
                    style={{
                      background: "rgba(90, 111, 255, 0.03)",
                      border: "1px solid rgba(90, 111, 255, 0.08)",
                      animation: "fadeIn 0.2s ease-out",
                    }}
                  >
                    <div
                      className="text-[10px] font-bold tracking-widest mb-3"
                      style={{ color: "#5A6FFF", textTransform: "uppercase", letterSpacing: "0.1em" }}
                    >
                      {triggeredBy ? `Why this matters for your ${CATEGORY_LABELS[triggeredBy]}` : "The Science"}
                    </div>
                    <div className="grid gap-2.5">
                      {s.science.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
                            style={{ background: "rgba(90, 111, 255, 0.1)", color: "#5A6FFF" }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                            {bullet}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-3 pt-2 text-[10px] italic"
                      style={{ color: "#9CA3AF", borderTop: "1px solid rgba(90, 111, 255, 0.06)" }}
                    >
                      * These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Why these supplements — brand tenets */}
        <div
          className="rounded-xl p-4 mt-3"
          style={{ background: "rgba(90, 111, 255, 0.04)", border: "1px solid rgba(90, 111, 255, 0.1)" }}
        >
          <h4
            className="text-xs tracking-widest mb-3"
            style={{
              fontFamily: '"Rauschen A", "Inter", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#5A6FFF",
            }}
          >
            Why These Supplements?
          </h4>
          <div className="grid gap-2">
            {packConfig.valueProps.map((item) => (
              <div key={item.text} className="flex items-start gap-2">
                <span className="text-sm font-bold mt-0.5" style={{ color: item.color }}>{item.icon}</span>
                <span className="text-sm" style={{ color: "#4B5563", lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — Go to Cart */}
      <button
        className="w-full rounded-full py-4 text-lg font-semibold mb-6 transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(90, 111, 255, 0.35)",
        }}
        onClick={() => {
          trackFBEvent("InitiateCheckout", {
            content_name: "Supplement Pack",
            currency: "USD",
            value: packConfig.price || 109,
            content_ids: [`pack-variant-${packVariant}`],
          });
          captureEvent("quiz_cart_clicked", {
            variant: packVariant,
            value: packConfig.price || 109,
          });
          // Navigate to Shopify cart with the personalized pack pre-loaded.
          window.location.href = buildPackCartUrl();
        }}
      >
        {packConfig.price ? `Get My Pack — ${packConfig.priceLabel}` : "Go to Cart"}
      </button>

      {/* Add or Swap */}
      <button
        className="text-sm font-medium mb-8"
        style={{ color: "#5A6FFF", background: "none", border: "none", cursor: "pointer" }}
      >
        Add or Swap
      </button>

      {/* Score Header */}
      <div className="text-center mb-8">
        <div
          className="text-xs tracking-widest mb-4"
          style={{
            fontFamily: '"Rauschen A", "Inter", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#6B7280",
          }}
        >
          Your Conceivable Score
        </div>

        <ScoreCircle score={totalScore} color={interpretation.color} />

        <div
          className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ background: `${interpretation.color}15`, color: interpretation.color }}
        >
          {interpretation.label}
        </div>

        <h2
          className="text-xl md:text-2xl mt-4 mb-2"
          style={{
            fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
            fontWeight: 700,
            color: "#2A2828",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            lineHeight: 1.2,
          }}
        >
          {interpretation.headline}
        </h2>

        <p className="text-base" style={{ color: "#6B7280", lineHeight: 1.6 }}>
          {interpretation.description}
        </p>
      </div>

      {/* Category Breakdown */}
      <div
        className="w-full rounded-2xl p-5 mb-6"
        style={{ background: "#FFFEFA", border: "1px solid #E8E5DC" }}
      >
        <h3
          className="text-xs tracking-widest mb-4"
          style={{
            fontFamily: '"Rauschen A", "Inter", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#6B7280",
          }}
        >
          Your Breakdown
        </h3>
        <div className="grid gap-4">
          {QUIZ_CATEGORIES.map((cat) => (
            <CategoryBar
              key={cat.id}
              name={cat.name}
              icon={cat.icon}
              percentage={categoryScores[cat.id]?.percentage || 0}
              color={cat.color}
            />
          ))}
        </div>
      </div>

      {/* #1 Tip */}
      <div
        className="w-full rounded-2xl p-5 mb-6"
        style={{ background: "rgba(90, 111, 255, 0.04)", border: "1px solid rgba(90, 111, 255, 0.1)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h3
            className="text-xs tracking-widest"
            style={{
              fontFamily: '"Rauschen A", "Inter", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#5A6FFF",
            }}
          >
            Your #1 Area: {topTip.area}
          </h3>
        </div>
        <p className="text-base" style={{ color: "#2A2828", lineHeight: 1.6 }}>
          {topTip.tip}
        </p>
      </div>

      {/* Email Capture / Post-signup content */}
      {!submitted ? (
        <div
          className="w-full rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(90, 111, 255, 0.06) 0%, rgba(227, 127, 177, 0.06) 100%)",
            border: "1px solid rgba(90, 111, 255, 0.12)",
          }}
        >
          <h3
            className="text-lg font-semibold mb-2 text-center"
            style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif', textTransform: "none" }}
          >
            Save your score &amp; get your free Fertility Starter Kit
          </h3>
          <p className="text-sm text-center mb-4" style={{ color: "#6B7280" }}>
            We&apos;ll send you a personalized supplement guide, your top 3 action items, and early access to Conceivable.
          </p>

          <form onSubmit={handleSubmitEmail} className="flex flex-col gap-3">
            <input
              ref={emailInputRef}
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" required
              className="w-full rounded-xl px-4 py-3.5 text-base outline-none transition-all"
              style={{ background: "#FFFEFA", border: "2px solid #E8E5DC", color: "#2A2828" }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E5DC")}
            />
            <button
              type="submit" disabled={submitting || !email}
              className="w-full rounded-xl py-3.5 text-base font-semibold transition-all duration-200"
              style={{
                background: submitting || !email ? "#E8E5DC" : "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
                color: submitting || !email ? "#9CA3AF" : "#fff",
                border: "none",
                cursor: submitting || !email ? "default" : "pointer",
                boxShadow: email ? "0 4px 20px rgba(90, 111, 255, 0.3)" : "none",
              }}
            >
              {submitting ? "Saving..." : "Save My Score"}
            </button>
            {signupError && <p className="text-sm text-center" style={{ color: "#E24D47" }}>{signupError}</p>}
          </form>
          <p className="text-xs text-center mt-3" style={{ color: "#9CA3AF" }}>No spam, ever. Unsubscribe anytime.</p>
        </div>
      ) : (
        <>
          {/* Success state */}
          <div
            className="w-full rounded-2xl p-6 mb-6 text-center"
            style={{ background: "rgba(30, 170, 85, 0.06)", border: "1px solid rgba(30, 170, 85, 0.15)" }}
          >
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "#1EAA55", fontFamily: '"Inter", sans-serif', textTransform: "none" }}>
              You&apos;re in!
            </h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              You&apos;re #{waitlistPosition} on the early access list. Check your inbox for your Fertility Starter Kit.
            </p>
          </div>

          {/* Bridge copy */}
          {results.biggestConcern && (
            <div
              className="w-full rounded-2xl px-6 py-4 mb-4 text-center"
              style={{ background: "rgba(90, 111, 255, 0.04)", border: "1px solid rgba(90, 111, 255, 0.1)" }}
            >
              <p className="text-base font-medium" style={{ color: "#2A2828", lineHeight: 1.5 }}>
                {getBridgeCopy(results.biggestConcern as string)}
              </p>
            </div>
          )}

          {/* Founding Member Offer */}
          <div
            className="w-full rounded-2xl p-6 mb-6"
            style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #4458CC 100%)", color: "#fff" }}
          >
            <div
              className="text-xs tracking-widest mb-2"
              style={{ fontFamily: '"Rauschen A", "Inter", sans-serif', textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}
            >
              Founding Member Offer
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: '"Inter", sans-serif', textTransform: "none" }}>
              Lock in $9/month for life
            </h3>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              Only 200 Founding Member spots. Get lifetime pricing, your personalized supplement pack,
              priority access to the Halo Ring, and a direct line to Kai, your AI fertility coach.
            </p>
            <ul className="text-sm mb-4 grid gap-2" style={{ color: "rgba(255,255,255,0.9)" }}>
              {["Personalized supplement packs shipped monthly", "Priority access to the Halo Ring", "Kai — your AI fertility coach, 24/7", "Founding Member badge + early feature access"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="#ACB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button
              className="w-full rounded-xl py-3.5 text-base font-semibold transition-all"
              style={{ background: "#fff", color: "#5A6FFF", border: "none", cursor: "pointer" }}
              onClick={() => { trackFBEvent("InitiateCheckout", { content_name: "Founding Member Spot", value: 9.00, currency: "USD" }); }}
            >
              Claim My Founding Spot
            </button>
            <p className="text-xs text-center mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              Coming soon — we&apos;ll notify you when spots open
            </p>
          </div>

          {/* Referral Section */}
          {referralCode && (
            <div
              className="w-full rounded-2xl p-6 mb-6"
              style={{ background: "rgba(227, 127, 177, 0.06)", border: "1px solid rgba(227, 127, 177, 0.15)" }}
            >
              <h3 className="text-lg font-semibold mb-2 text-center" style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif', textTransform: "none" }}>
                Share with friends, move up the waitlist
              </h3>
              <p className="text-sm text-center mb-4" style={{ color: "#6B7280" }}>
                Every friend who signs up moves you closer to the front. Top referrers get Founding Member pricing.
              </p>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "#FFFEFA", border: "1px solid #E8E5DC" }}>
                <input readOnly value={referralLink} className="flex-1 text-sm outline-none bg-transparent truncate" style={{ color: "#2A2828" }} />
                <button
                  onClick={copyReferralLink}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                  style={{ background: copied ? "#1EAA55" : "#5A6FFF", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Kai Chat — hidden for now */}
      {/* <KaiChatPrompt onChatOpen={() => setChatOpen(true)} /> */}

      {/* Schedule a call with Kirsten */}
      <div
        className="w-full rounded-2xl p-6 mb-6"
        style={{ background: "rgba(227, 127, 177, 0.06)", border: "1px solid rgba(227, 127, 177, 0.15)" }}
      >
        <div className="text-center">
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif', textTransform: "none" }}
          >
            Got questions for Kirsten?
          </h3>
          <p className="text-sm mb-4" style={{ color: "#6B7280", lineHeight: 1.6 }}>
            Schedule a free 15-minute call to talk about your results, your fertility journey, or anything else on your mind.
          </p>
          <a
            href="https://calendly.com/kirstenk/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full px-8 py-3.5 text-base font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #E37FB1 0%, #E24D47 100%)",
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(227, 127, 177, 0.35)",
            }}
          >
            Book a Free Call
          </a>
        </div>
      </div>

      {/* Retake quiz */}
      <button
        onClick={() => { sessionStorage.removeItem("quizResults"); router.push("/early-access/quiz"); }}
        className="text-sm font-medium mt-4"
        style={{ color: "#5A6FFF", background: "none", border: "none", cursor: "pointer" }}
      >
        Retake the assessment
      </button>
    </div>
  );
}
