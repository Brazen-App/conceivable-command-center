"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_CATEGORIES,
  type ScoreInterpretation,
} from "@/lib/data/early-access-quiz";

interface QuizResults {
  answers: Record<string, string | string[]>;
  totalScore: number;
  categoryScores: Record<string, { score: number; maxScore: number; percentage: number }>;
  interpretation: ScoreInterpretation;
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
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#E8E5DC"
          strokeWidth="8"
        />
        {/* Score arc */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: "#2A2828" }}>
          {animatedScore}
        </span>
        <span className="text-xs" style={{ color: "#9CA3AF" }}>
          out of 100
        </span>
      </div>
    </div>
  );
}

// Category bar
function CategoryBar({
  name,
  icon,
  percentage,
  color,
}: {
  name: string;
  icon: string;
  percentage: number;
  color: string;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(percentage), 200);
  }, [percentage]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-7 text-center">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium" style={{ color: "#2A2828" }}>
            {name}
          </span>
          <span className="text-sm font-semibold" style={{ color }}>
            {percentage}%
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E8E5DC" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${width}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

// Supplement recommendations based on lowest scoring categories
function getSupplementRecs(categoryScores: Record<string, { percentage: number }>) {
  const recs: { name: string; reason: string; icon: string }[] = [];

  const scores = Object.entries(categoryScores).sort(
    (a, b) => a[1].percentage - b[1].percentage
  );

  for (const [catId] of scores.slice(0, 3)) {
    switch (catId) {
      case "cycle":
        recs.push({
          name: "Omega-3 + Vitamin E",
          reason: "Supports healthy cycle regularity and reduces menstrual discomfort",
          icon: "🐟",
        });
        break;
      case "nutrition":
        recs.push({
          name: "Prenatal Multivitamin",
          reason: "Fills nutritional gaps critical for reproductive health",
          icon: "💊",
        });
        break;
      case "sleep":
        recs.push({
          name: "Magnesium Glycinate",
          reason: "Supports deep sleep and nervous system recovery",
          icon: "🌙",
        });
        break;
      case "stress":
        recs.push({
          name: "Ashwagandha + B-Complex",
          reason: "Supports cortisol balance and stress resilience",
          icon: "🧘",
        });
        break;
      case "hormonal":
        recs.push({
          name: "Vitex + DIM",
          reason: "Supports healthy estrogen metabolism and hormonal balance",
          icon: "🔬",
        });
        break;
      case "history":
        recs.push({
          name: "CoQ10 + Vitamin D",
          reason: "Supports egg quality and overall reproductive readiness",
          icon: "☀️",
        });
        break;
    }
  }

  return recs;
}

// Get the #1 tip based on weakest category
function getTopTip(categoryScores: Record<string, { percentage: number }>) {
  const weakest = Object.entries(categoryScores).sort(
    (a, b) => a[1].percentage - b[1].percentage
  )[0];

  const tips: Record<string, { area: string; tip: string }> = {
    cycle: {
      area: "Cycle Health",
      tip: "Start tracking your cycle daily — even just noting start/end dates. Irregular cycles are often the first sign your body is asking for help, and tracking is the first step to understanding what it needs.",
    },
    nutrition: {
      area: "Nutrition",
      tip: "Add one extra serving of leafy greens per day. Folate, iron, and antioxidants from dark greens are among the most impactful nutrients for reproductive health — and most women are deficient.",
    },
    sleep: {
      area: "Sleep & Recovery",
      tip: "Set a consistent bedtime — yes, even on weekends. Your circadian rhythm directly regulates your hormones, and even 30 minutes of inconsistency can disrupt ovulation timing.",
    },
    stress: {
      area: "Stress & Lifestyle",
      tip: "Try 10 minutes of breathwork or meditation before bed. Chronic stress elevates cortisol, which directly suppresses progesterone — the hormone you need most for implantation.",
    },
    hormonal: {
      area: "Hormonal Signals",
      tip: "Pay attention to your cervical mucus mid-cycle. Clear, stretchy mucus around day 12-16 is a sign of healthy estrogen levels and ovulation. No mucus changes? That's worth investigating.",
    },
    history: {
      area: "Health History",
      tip: "Book a preconception checkup with your OB/GYN. Given your health history, getting baseline bloodwork (AMH, TSH, fasting insulin) now can help you and your care team get ahead of any issues.",
    },
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
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");
    if (!stored) {
      router.push("/early-access");
      return;
    }
    setResults(JSON.parse(stored));
  }, [router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
          style={{ borderColor: "#5A6FFF", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const { totalScore, categoryScores, interpretation } = results;
  const topTip = getTopTip(categoryScores);
  const supplements = getSupplementRecs(categoryScores);

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
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      {/* Score Header */}
      <div className="text-center mb-8 pt-4">
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
          style={{
            background: `${interpretation.color}15`,
            color: interpretation.color,
          }}
        >
          {interpretation.label}
        </div>

        <h1
          className="text-2xl md:text-3xl mt-4 mb-2"
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
        </h1>

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
            We&apos;ll send you a personalized supplement guide, your top 3 action items, and early access to Conceivable
            (including Kai, your AI fertility coach, and the Halo Ring).
          </p>

          <form onSubmit={handleSubmitEmail} className="flex flex-col gap-3">
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl px-4 py-3.5 text-base outline-none transition-all"
              style={{
                background: "#FFFEFA",
                border: "2px solid #E8E5DC",
                color: "#2A2828",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E5DC")}
            />
            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full rounded-xl py-3.5 text-base font-semibold transition-all duration-200"
              style={{
                background:
                  submitting || !email
                    ? "#E8E5DC"
                    : "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
                color: submitting || !email ? "#9CA3AF" : "#fff",
                border: "none",
                cursor: submitting || !email ? "default" : "pointer",
                boxShadow: email ? "0 4px 20px rgba(90, 111, 255, 0.3)" : "none",
              }}
            >
              {submitting ? "Saving..." : "Save My Score"}
            </button>
            {signupError && (
              <p className="text-sm text-center" style={{ color: "#E24D47" }}>
                {signupError}
              </p>
            )}
          </form>

          <p className="text-xs text-center mt-3" style={{ color: "#9CA3AF" }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      ) : (
        <>
          {/* Success state */}
          <div
            className="w-full rounded-2xl p-6 mb-6 text-center"
            style={{ background: "rgba(30, 170, 85, 0.06)", border: "1px solid rgba(30, 170, 85, 0.15)" }}
          >
            <div className="text-3xl mb-2">🎉</div>
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: "#1EAA55", fontFamily: '"Inter", sans-serif', textTransform: "none" }}
            >
              You&apos;re in!
            </h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              You&apos;re #{waitlistPosition} on the early access list. Check your inbox for your Fertility Starter Kit.
            </p>
          </div>

          {/* Founding Member Offer */}
          <div
            className="w-full rounded-2xl p-6 mb-6"
            style={{
              background: "linear-gradient(135deg, #5A6FFF 0%, #4458CC 100%)",
              color: "#fff",
            }}
          >
            <div
              className="text-xs tracking-widest mb-2"
              style={{
                fontFamily: '"Rauschen A", "Inter", sans-serif',
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Founding Member Offer
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: '"Inter", sans-serif', textTransform: "none" }}
            >
              Lock in $9/month for life
            </h3>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              Only 200 Founding Member spots. Get lifetime pricing, your personalized supplement pack,
              priority access to the Halo Ring, and a direct line to Kai, your AI fertility coach.
              The regular price will be $29/month.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">$9</span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>/month forever</span>
              <span
                className="ml-2 line-through text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                $29/month
              </span>
            </div>
            <ul className="text-sm mb-4 grid gap-2" style={{ color: "rgba(255,255,255,0.9)" }}>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#ACB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Personalized supplement packs shipped monthly
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#ACB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Priority access to the Halo Ring
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#ACB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kai — your AI fertility coach, 24/7
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#ACB7FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Founding Member badge + early feature access
              </li>
            </ul>
            <button
              className="w-full rounded-xl py-3.5 text-base font-semibold transition-all"
              style={{
                background: "#fff",
                color: "#5A6FFF",
                border: "none",
                cursor: "pointer",
              }}
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
              <h3
                className="text-lg font-semibold mb-2 text-center"
                style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif', textTransform: "none" }}
              >
                Share with friends, move up the waitlist
              </h3>
              <p className="text-sm text-center mb-4" style={{ color: "#6B7280" }}>
                Every friend who signs up moves you closer to the front. Top referrers get Founding Member pricing.
              </p>

              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "#FFFEFA", border: "1px solid #E8E5DC" }}
              >
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 text-sm outline-none bg-transparent truncate"
                  style={{ color: "#2A2828" }}
                />
                <button
                  onClick={copyReferralLink}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
                  style={{
                    background: copied ? "#1EAA55" : "#5A6FFF",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Supplement Recommendations */}
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
            color: "#1EAA55",
          }}
        >
          Your Supplement Starter Kit
        </h3>
        <div className="grid gap-3">
          {supplements.map((s) => (
            <div key={s.name} className="flex items-start gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: "#2A2828" }}>
                  {s.name}
                </div>
                <div className="text-sm" style={{ color: "#6B7280" }}>
                  {s.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: "#9CA3AF" }}>
          These recommendations are based on your quiz responses. For a fully personalized protocol,
          join Conceivable to get data-driven supplement packs tailored to your Halo Ring data.
        </p>
      </div>

      {/* Retake quiz */}
      <button
        onClick={() => {
          sessionStorage.removeItem("quizResults");
          router.push("/early-access/quiz");
        }}
        className="text-sm font-medium mt-4"
        style={{ color: "#5A6FFF", background: "none", border: "none", cursor: "pointer" }}
      >
        Retake the assessment
      </button>
    </div>
  );
}
