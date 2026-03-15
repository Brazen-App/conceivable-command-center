"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_QUESTIONS,
  QUIZ_CATEGORIES,
  calculateQuizScore,
  getScoreInterpretation,
  type QuizQuestion,
} from "@/lib/data/early-access-quiz";

// Group questions by category for section headers
const categoryOrder = QUIZ_CATEGORIES.map((c) => c.id);
const sortedQuestions = [...QUIZ_QUESTIONS].sort(
  (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
);

function getCategoryForQuestion(q: QuizQuestion) {
  return QUIZ_CATEGORIES.find((c) => c.id === q.category)!;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOption, setSelectedOption] = useState<string | string[] | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const totalQuestions = sortedQuestions.length;
  const question = sortedQuestions[currentIndex];
  const category = getCategoryForQuestion(question);
  const progress = ((currentIndex) / totalQuestions) * 100;

  // Check if this is the first question of a new category
  const isNewCategory =
    currentIndex === 0 ||
    sortedQuestions[currentIndex - 1].category !== question.category;

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

  const handleNext = useCallback(() => {
    if (!selectedOption || (Array.isArray(selectedOption) && selectedOption.length === 0)) return;

    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);
    setDirection("forward");

    if (currentIndex < totalQuestions - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        // Pre-fill if going forward to an already-answered question
        const nextQ = sortedQuestions[currentIndex + 1];
        setSelectedOption(newAnswers[nextQ.id] || null);
        setTransitioning(false);
      }, 250);
    } else {
      // Quiz complete — calculate score and go to results
      const result = calculateQuizScore(newAnswers);
      const interpretation = getScoreInterpretation(result.totalScore);

      // Store in sessionStorage for the results page
      sessionStorage.setItem(
        "quizResults",
        JSON.stringify({
          answers: newAnswers,
          totalScore: result.totalScore,
          categoryScores: result.categoryScores,
          interpretation: interpretation,
        })
      );

      router.push("/early-access/results");
    }
  }, [selectedOption, answers, question.id, currentIndex, totalQuestions, router]);

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection("back");
    setTransitioning(true);
    setTimeout(() => {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedOption(answers[sortedQuestions[prevIndex].id] || null);
      setTransitioning(false);
    }, 250);
  }, [currentIndex, answers]);

  const canProceed =
    selectedOption !== null &&
    (!Array.isArray(selectedOption) || selectedOption.length > 0);

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
            {currentIndex + 1} of {totalQuestions}
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
      {isNewCategory && (
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

      {/* Question card */}
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
            {question.question}
          </h2>
          {question.subtext && (
            <p className="text-sm" style={{ color: "#9CA3AF" }}>
              {question.subtext}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {question.type === "scale" ? (
            // Scale rendering — horizontal buttons
            <div className="flex gap-2 w-full">
              {question.options.map((opt) => {
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
          ) : question.type === "multi" ? (
            // Multi-select
            question.options.map((opt) => {
              const isSelected = Array.isArray(selectedOption) && selectedOption.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleMultiOption(opt.value)}
                  className="w-full text-left rounded-xl px-5 py-4 transition-all duration-200 flex items-center gap-3"
                  style={{
                    background: isSelected ? "rgba(90, 111, 255, 0.06)" : "#FFFEFA",
                    border: isSelected ? "2px solid #5A6FFF" : "2px solid #E8E5DC",
                    cursor: "pointer",
                  }}
                >
                  {/* Checkbox */}
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
            // Single select
            question.options.map((opt) => {
              const isSelected = selectedOption === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedOption(opt.value)}
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

      {/* Next button */}
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
        {currentIndex === totalQuestions - 1 ? "See My Results" : "Next"}
      </button>

      {/* Skip option for non-critical questions */}
      {question.type !== "multi" && (
        <button
          onClick={() => {
            // Skip = pick middle/neutral option
            const midIndex = Math.floor(question.options.length / 2);
            setSelectedOption(question.options[midIndex].value);
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
