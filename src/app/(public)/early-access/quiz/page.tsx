"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// Facebook Pixel helper — safe to call even if pixel hasn't loaded yet
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
import {
  QUIZ_QUESTIONS,
  QUIZ_CATEGORIES,
  INTAKE_QUESTIONS,
  calculateQuizScore,
  getScoreInterpretation,
  type QuizQuestion,
} from "@/lib/data/early-access-quiz";
import { initPostHog, captureEvent, identifyUser } from "@/lib/analytics/posthog-client";

// Build the full question flow:
// 1. Journey stage (intake Q1) — auto-advance
// 2. All scored questions in category order
// 3. Email/name collection (second-to-last)
// 4. Final scored question

const categoryOrder = QUIZ_CATEGORIES.map((c) => c.id);
const sortedScored = [...QUIZ_QUESTIONS].sort(
  (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
);

// Insert intake question + email capture into the flow
const FULL_FLOW: (QuizQuestion | { id: "email_capture"; type: "email_capture" })[] = [
  INTAKE_QUESTIONS[0], // journey stage
  ...sortedScored.slice(0, -1), // all scored questions except last
  { id: "email_capture", type: "email_capture" as const }, // email + name
  sortedScored[sortedScored.length - 1], // final scored question
];

type FlowStep = (typeof FULL_FLOW)[number];
function isQuizQuestion(step: FlowStep): step is QuizQuestion {
  return "category" in step;
}
function isEmailCapture(step: FlowStep): step is { id: "email_capture"; type: "email_capture" } {
  return step.type === "email_capture";
}

function getCategoryForQuestion(q: QuizQuestion) {
  if (q.category === "intake") return null;
  return QUIZ_CATEGORIES.find((c) => c.id === q.category) || null;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOption, setSelectedOption] = useState<string | string[] | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const totalSteps = FULL_FLOW.length;
  const step = FULL_FLOW[currentIndex];
  const progress = Math.round(((currentIndex) / totalSteps) * 100);

  // Fire quiz start event once
  useEffect(() => {
    trackFBEvent("ViewContent", { content_name: "Fertility Quiz", content_category: "Quiz" });
    initPostHog();
    captureEvent("quiz_started", { source: "early_access" });
  }, []);

  // Check if this is the first question of a new category
  const isNewCategory =
    isQuizQuestion(step) &&
    step.category !== "intake" &&
    (currentIndex === 0 ||
      (() => {
        const prev = FULL_FLOW[currentIndex - 1];
        return !isQuizQuestion(prev) || prev.category !== step.category;
      })());

  const category = isQuizQuestion(step) ? getCategoryForQuestion(step) : null;

  // For multi-select questions
  const toggleMultiOption = useCallback(
    (value: string) => {
      setSelectedOption((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        if (value === "none") return ["none"];
        const filtered = current.filter((v) => v !== "none");
        if (filtered.includes(value)) {
          return filtered.filter((v) => v !== value);
        }
        return [...filtered, value];
      });
    },
    []
  );

  const advanceToNext = useCallback((newAnswers: Record<string, string | string[]>) => {
    setDirection("forward");
    if (currentIndex < totalSteps - 1) {
      setTransitioning(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        const nextStep = FULL_FLOW[nextIdx];
        if (isQuizQuestion(nextStep)) {
          setSelectedOption(newAnswers[nextStep.id] || null);
        } else {
          setSelectedOption(null);
        }
        setTransitioning(false);
      }, 250);
    } else {
      // Quiz complete — calculate score and go to results
      const result = calculateQuizScore(newAnswers);
      const interpretation = getScoreInterpretation(result.totalScore);

      sessionStorage.setItem(
        "quizResults",
        JSON.stringify({
          answers: newAnswers,
          totalScore: result.totalScore,
          categoryScores: result.categoryScores,
          interpretation,
          journeyStage: newAnswers["journey_stage"] || "",
          biggestConcern: newAnswers["biggest_concern"] || "",
          firstName: firstName || "",
          email: email || "",
        })
      );

      trackFBEvent("CompleteRegistration", {
        content_name: "Fertility Quiz",
        value: result.totalScore,
        currency: "USD",
      });
      captureEvent("quiz_completed", {
        score: result.totalScore,
        biggestConcern: typeof newAnswers["biggest_concern"] === "string"
          ? newAnswers["biggest_concern"]
          : undefined,
        journeyStage: typeof newAnswers["journey_stage"] === "string"
          ? newAnswers["journey_stage"]
          : undefined,
      });

      router.push("/early-access/results");
    }
  }, [currentIndex, totalSteps, router, firstName, email]);

  const handleNext = useCallback(() => {
    if (isEmailCapture(step)) {
      // Email step — fire Lead event if they provided email
      if (email.trim()) {
        trackFBEvent("Lead", { content_name: "Quiz Email Capture" });
        captureEvent("email_collected", { hasName: Boolean(firstName.trim()) });
        identifyUser(email.trim().toLowerCase(), {
          email: email.trim().toLowerCase(),
          firstName: firstName || undefined,
        });
      }
      advanceToNext(answers);
      return;
    }

    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) return;

    const newAnswers = { ...answers, [(step as QuizQuestion).id]: selectedOption };
    setAnswers(newAnswers);
    captureEvent("quiz_step_completed", {
      step: currentIndex + 1,
      questionId: (step as QuizQuestion).id,
    });
    advanceToNext(newAnswers);
  }, [selectedOption, answers, step, advanceToNext, email]);

  const handleAutoAdvance = useCallback(
    (value: string) => {
      setSelectedOption(value);
      const newAnswers = { ...answers, [(step as QuizQuestion).id]: value };
      setAnswers(newAnswers);
      captureEvent("quiz_step_completed", {
        step: currentIndex + 1,
        questionId: (step as QuizQuestion).id,
      });
      // Brief pause so user sees their selection highlighted
      setTimeout(() => {
        setDirection("forward");
        setTransitioning(true);
        setTimeout(() => {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          const nextStep = FULL_FLOW[nextIdx];
          if (isQuizQuestion(nextStep)) {
            setSelectedOption(newAnswers[nextStep.id] || null);
          } else {
            setSelectedOption(null);
          }
          setTransitioning(false);
        }, 250);
      }, 300);
    },
    [answers, step, currentIndex]
  );

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection("back");
    setTransitioning(true);
    setTimeout(() => {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      const prevStep = FULL_FLOW[prevIndex];
      if (isQuizQuestion(prevStep)) {
        setSelectedOption(answers[prevStep.id] || null);
      } else {
        setSelectedOption(null);
      }
      setTransitioning(false);
    }, 250);
  }, [currentIndex, answers]);

  const canProceed = isEmailCapture(step)
    ? true // email step is always skippable
    : selectedOption !== null &&
      (!Array.isArray(selectedOption) || selectedOption.length > 0);

  const isAutoAdvance = isQuizQuestion(step) && step.autoAdvance;

  return (
    <div className="flex flex-col items-center px-4 pb-12 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="text-sm font-medium transition-opacity"
            style={{
              color: currentIndex === 0 ? "#D1D5DB" : "#5A6FFF",
              cursor: currentIndex === 0 ? "default" : "pointer",
              background: "none",
              border: "none",
            }}
          >
            &larr; Back
          </button>
          <span className="text-sm" style={{ color: "#9CA3AF" }}>
            {progress}% complete
          </span>
        </div>
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(90, 111, 255, 0.1)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #5A6FFF, #ACB7FF)",
            }}
          />
        </div>
      </div>

      {/* Category header (shows when entering new category) */}
      {isNewCategory && category && (
        <div
          className="w-full rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
          style={{ background: `${category.color}10`, border: `1px solid ${category.color}20` }}
        >
          <span className="text-xl">{category.icon}</span>
          <div>
            <div
              className="text-xs tracking-widest"
              style={{
                fontFamily: '"Rauschen A", "Inter", sans-serif',
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: category.color,
              }}
            >
              {category.name}
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <div
        className="w-full transition-all duration-250 ease-out"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning
            ? direction === "forward"
              ? "translateX(30px)"
              : "translateX(-30px)"
            : "translateX(0)",
        }}
      >
        {isEmailCapture(step) ? (
          /* ── Email capture step — email first, then name ── */
          <div>
            <h2
              className="text-xl md:text-2xl font-semibold mb-2"
              style={{
                color: "#2A2828",
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.3,
              }}
            >
              Almost there — where should we send your personalized results?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
              We&apos;ll also include your supplement recommendation and a free fertility guide.
            </p>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#4B5563" }}>
                  Email <span style={{ color: "#E24D47" }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3.5 text-base outline-none transition-all"
                  style={{
                    background: "#FFFEFA",
                    border: "2px solid #E8E5DC",
                    color: "#2A2828",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8E5DC")}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5" style={{ color: "#4B5563" }}>
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full rounded-xl px-4 py-3.5 text-base outline-none transition-all"
                  style={{
                    background: "#FFFEFA",
                    border: "2px solid #E8E5DC",
                    color: "#2A2828",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8E5DC")}
                />
              </div>
            </div>
          </div>
        ) : isQuizQuestion(step) ? (
          /* ── Quiz question step ── */
          <div>
            <div className="mb-6">
              <h2
                className="text-xl md:text-2xl font-semibold mb-2"
                style={{
                  color: "#2A2828",
                  fontFamily: '"Inter", sans-serif',
                  textTransform: "none",
                  letterSpacing: "normal",
                  lineHeight: 1.3,
                }}
              >
                {step.question}
              </h2>
              {step.subtext && (
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  {step.subtext}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="grid gap-3">
              {step.type === "scale" ? (
                <div className="flex gap-2 w-full">
                  {step.options.map((opt) => {
                    const isSelected = selectedOption === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedOption(opt.value)}
                        className="flex-1 rounded-xl py-4 px-2 text-center transition-all duration-200"
                        style={{
                          background: isSelected ? "#5A6FFF" : "#FFFEFA",
                          color: isSelected ? "#fff" : "#2A2828",
                          border: isSelected ? "2px solid #5A6FFF" : "2px solid #E8E5DC",
                          fontWeight: isSelected ? 600 : 400,
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        <div className="text-lg font-bold">{opt.value}</div>
                        <div className="text-xs mt-1" style={{ color: isSelected ? "rgba(255,255,255,0.8)" : "#9CA3AF" }}>
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : step.type === "multi" ? (
                step.options.map((opt) => {
                  const isSelected = Array.isArray(selectedOption) && selectedOption.includes(opt.value);
                  const isNoneSelected = Array.isArray(selectedOption) && selectedOption.includes("none");
                  const isDisabled = opt.value !== "none" && isNoneSelected;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMultiOption(opt.value)}
                      disabled={isDisabled}
                      className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200 flex items-center gap-3"
                      style={{
                        background: isSelected ? "rgba(90, 111, 255, 0.06)" : "#FFFEFA",
                        border: isSelected ? "2px solid #5A6FFF" : "2px solid #E8E5DC",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded shrink-0 flex items-center justify-center transition-all"
                        style={{
                          background: isSelected ? "#5A6FFF" : "transparent",
                          border: isSelected ? "2px solid #5A6FFF" : "2px solid #D1D5DB",
                        }}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-base"
                        style={{ color: isSelected ? "#2A2828" : "#4B5563", fontWeight: isSelected ? 500 : 400 }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })
              ) : (
                // Single select (with optional auto-advance)
                step.options.map((opt) => {
                  const isSelected = selectedOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        isAutoAdvance ? handleAutoAdvance(opt.value) : setSelectedOption(opt.value)
                      }
                      className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200"
                      style={{
                        background: isSelected ? "rgba(90, 111, 255, 0.06)" : "#FFFEFA",
                        border: isSelected ? "2px solid #5A6FFF" : "2px solid #E8E5DC",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="text-base"
                        style={{ color: isSelected ? "#2A2828" : "#4B5563", fontWeight: isSelected ? 500 : 400 }}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Next button (hidden for auto-advance questions) */}
      {!isAutoAdvance && (
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full mt-8 rounded-full py-4 text-lg font-semibold transition-all duration-200"
          style={{
            background: canProceed
              ? "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)"
              : "#E8E5DC",
            color: canProceed ? "#fff" : "#9CA3AF",
            border: "none",
            cursor: canProceed ? "pointer" : "default",
            boxShadow: canProceed ? "0 4px 20px rgba(90, 111, 255, 0.35)" : "none",
          }}
        >
          {isEmailCapture(step)
            ? email
              ? "Next"
              : "Skip for now"
            : currentIndex === totalSteps - 1
            ? "See My Results"
            : "Next"}
        </button>
      )}

      {/* Skip option for non-critical scored questions */}
      {isQuizQuestion(step) &&
        !isAutoAdvance &&
        step.type !== "multi" &&
        step.category !== "intake" && (
          <button
            onClick={() => {
              const midIndex = Math.floor(step.options.length / 2);
              setSelectedOption(step.options[midIndex].value);
              setTimeout(() => handleNext(), 100);
            }}
            className="mt-3 text-sm transition-opacity"
            style={{ color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}
          >
            Skip this question
          </button>
        )}
    </div>
  );
}
