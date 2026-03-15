// Early Access Assessment Quiz
// 18 questions across 6 categories that generate a personalized fertility readiness score

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  subtext?: string;
  type: "single" | "multi" | "scale";
  options: { value: string; label: string; score: number }[];
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  maxScore: number;
  weight: number; // 0-1, how much this category counts toward total
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  { id: "cycle", name: "Cycle Health", icon: "🌙", color: "#E37FB1", maxScore: 20, weight: 0.20 },
  { id: "nutrition", name: "Nutrition", icon: "🥗", color: "#1EAA55", maxScore: 15, weight: 0.15 },
  { id: "sleep", name: "Sleep & Recovery", icon: "😴", color: "#356FB6", maxScore: 15, weight: 0.15 },
  { id: "stress", name: "Stress & Lifestyle", icon: "🧘", color: "#9686B9", maxScore: 15, weight: 0.15 },
  { id: "hormonal", name: "Hormonal Signals", icon: "🔬", color: "#5A6FFF", maxScore: 20, weight: 0.20 },
  { id: "history", name: "Health History", icon: "📋", color: "#78C3BF", maxScore: 15, weight: 0.15 },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Cycle Health (3 questions) ──
  {
    id: "q1",
    category: "cycle",
    question: "How regular is your menstrual cycle?",
    subtext: "Think about the last 6 months",
    type: "single",
    options: [
      { value: "very_regular", label: "Very regular (25-30 days, consistent)", score: 7 },
      { value: "mostly_regular", label: "Mostly regular (varies by a few days)", score: 5 },
      { value: "somewhat_irregular", label: "Somewhat irregular (varies by a week+)", score: 3 },
      { value: "very_irregular", label: "Very irregular or absent", score: 1 },
      { value: "unsure", label: "I don't track it", score: 2 },
    ],
  },
  {
    id: "q2",
    category: "cycle",
    question: "How would you describe your period pain?",
    type: "single",
    options: [
      { value: "none", label: "Little to no pain", score: 7 },
      { value: "mild", label: "Mild — manageable without medication", score: 5 },
      { value: "moderate", label: "Moderate — I take pain relief", score: 3 },
      { value: "severe", label: "Severe — it disrupts my life", score: 1 },
    ],
  },
  {
    id: "q3",
    category: "cycle",
    question: "How long does your period typically last?",
    type: "single",
    options: [
      { value: "3_4", label: "3-4 days", score: 6 },
      { value: "5_6", label: "5-6 days", score: 5 },
      { value: "7_plus", label: "7+ days", score: 3 },
      { value: "varies", label: "It varies a lot", score: 2 },
    ],
  },

  // ── Nutrition (3 questions) ──
  {
    id: "q4",
    category: "nutrition",
    question: "How many servings of vegetables do you eat daily?",
    type: "single",
    options: [
      { value: "five_plus", label: "5 or more", score: 5 },
      { value: "three_four", label: "3-4", score: 4 },
      { value: "one_two", label: "1-2", score: 2 },
      { value: "rarely", label: "Rarely", score: 1 },
    ],
  },
  {
    id: "q5",
    category: "nutrition",
    question: "Do you currently take any supplements?",
    type: "single",
    options: [
      { value: "prenatal", label: "Yes, a prenatal or fertility-focused supplement", score: 5 },
      { value: "multivitamin", label: "Yes, a general multivitamin", score: 4 },
      { value: "some", label: "A few individual supplements", score: 3 },
      { value: "none", label: "No supplements", score: 1 },
    ],
  },
  {
    id: "q6",
    category: "nutrition",
    question: "How often do you eat processed or fast food?",
    type: "single",
    options: [
      { value: "rarely", label: "Rarely (once a month or less)", score: 5 },
      { value: "sometimes", label: "Sometimes (1-2x per week)", score: 4 },
      { value: "often", label: "Often (3-5x per week)", score: 2 },
      { value: "daily", label: "Most days", score: 1 },
    ],
  },

  // ── Sleep & Recovery (3 questions) ──
  {
    id: "q7",
    category: "sleep",
    question: "How many hours of sleep do you typically get?",
    type: "single",
    options: [
      { value: "seven_plus", label: "7-9 hours consistently", score: 5 },
      { value: "six", label: "About 6 hours", score: 3 },
      { value: "five_less", label: "5 hours or less", score: 1 },
      { value: "varies", label: "It varies a lot", score: 2 },
    ],
  },
  {
    id: "q8",
    category: "sleep",
    question: "How would you rate your sleep quality?",
    type: "single",
    options: [
      { value: "great", label: "I sleep well and wake refreshed", score: 5 },
      { value: "ok", label: "Decent — occasional trouble", score: 4 },
      { value: "poor", label: "I struggle to fall or stay asleep", score: 2 },
      { value: "terrible", label: "Chronic sleep issues", score: 1 },
    ],
  },
  {
    id: "q9",
    category: "sleep",
    question: "Do you have a consistent sleep schedule?",
    type: "single",
    options: [
      { value: "yes", label: "Yes, same bedtime and wake time most days", score: 5 },
      { value: "weekdays", label: "Weekdays yes, weekends no", score: 3 },
      { value: "no", label: "No, it's all over the place", score: 1 },
    ],
  },

  // ── Stress & Lifestyle (3 questions) ──
  {
    id: "q10",
    category: "stress",
    question: "How would you rate your current stress level?",
    type: "scale",
    options: [
      { value: "1", label: "Very low", score: 5 },
      { value: "2", label: "Low", score: 4 },
      { value: "3", label: "Moderate", score: 3 },
      { value: "4", label: "High", score: 2 },
      { value: "5", label: "Very high", score: 1 },
    ],
  },
  {
    id: "q11",
    category: "stress",
    question: "How often do you exercise?",
    type: "single",
    options: [
      { value: "daily", label: "5-7 days/week", score: 4 },
      { value: "regular", label: "3-4 days/week", score: 5 },
      { value: "some", label: "1-2 days/week", score: 3 },
      { value: "rarely", label: "Rarely", score: 1 },
    ],
  },
  {
    id: "q12",
    category: "stress",
    question: "How many alcoholic drinks do you have per week?",
    type: "single",
    options: [
      { value: "none", label: "None", score: 5 },
      { value: "one_two", label: "1-2", score: 4 },
      { value: "three_five", label: "3-5", score: 3 },
      { value: "six_plus", label: "6+", score: 1 },
    ],
  },

  // ── Hormonal Signals (3 questions) ──
  {
    id: "q13",
    category: "hormonal",
    question: "Do you experience PMS symptoms?",
    subtext: "Mood swings, bloating, breast tenderness, cravings",
    type: "single",
    options: [
      { value: "none", label: "Minimal or none", score: 7 },
      { value: "mild", label: "Mild — noticeable but manageable", score: 5 },
      { value: "moderate", label: "Moderate — affects my daily life", score: 3 },
      { value: "severe", label: "Severe — significantly impacts me", score: 1 },
    ],
  },
  {
    id: "q14",
    category: "hormonal",
    question: "Have you noticed any of these hormonal signs?",
    subtext: "Select all that apply",
    type: "multi",
    options: [
      { value: "acne", label: "Persistent acne", score: -2 },
      { value: "hair_loss", label: "Hair thinning or loss", score: -2 },
      { value: "weight", label: "Unexplained weight changes", score: -2 },
      { value: "fatigue", label: "Chronic fatigue", score: -2 },
      { value: "hot_flashes", label: "Hot flashes or night sweats", score: -2 },
      { value: "none", label: "None of these", score: 7 },
    ],
  },
  {
    id: "q15",
    category: "hormonal",
    question: "Do you notice cervical mucus changes throughout your cycle?",
    subtext: "This is an indicator of ovulation",
    type: "single",
    options: [
      { value: "yes_clear", label: "Yes, I notice clear patterns", score: 6 },
      { value: "sometimes", label: "Sometimes", score: 4 },
      { value: "no", label: "No / I don't check", score: 2 },
    ],
  },

  // ── Health History (3 questions) ──
  {
    id: "q16",
    category: "history",
    question: "Have you been diagnosed with any of these?",
    subtext: "Select all that apply",
    type: "multi",
    options: [
      { value: "pcos", label: "PCOS", score: -3 },
      { value: "endo", label: "Endometriosis", score: -3 },
      { value: "thyroid", label: "Thyroid condition", score: -2 },
      { value: "diabetes", label: "Diabetes or insulin resistance", score: -2 },
      { value: "autoimmune", label: "Autoimmune condition", score: -2 },
      { value: "none", label: "None of these", score: 5 },
    ],
  },
  {
    id: "q17",
    category: "history",
    question: "What is your age?",
    type: "single",
    options: [
      { value: "under_25", label: "Under 25", score: 5 },
      { value: "25_29", label: "25-29", score: 5 },
      { value: "30_34", label: "30-34", score: 4 },
      { value: "35_37", label: "35-37", score: 3 },
      { value: "38_40", label: "38-40", score: 2 },
      { value: "over_40", label: "Over 40", score: 1 },
    ],
  },
  {
    id: "q18",
    category: "history",
    question: "What best describes your current goal?",
    type: "single",
    options: [
      { value: "ttc_now", label: "Actively trying to conceive", score: 5 },
      { value: "ttc_soon", label: "Planning to try in the next year", score: 5 },
      { value: "future", label: "Thinking about it for the future", score: 4 },
      { value: "period_health", label: "I want better period health", score: 4 },
      { value: "curious", label: "Just curious about my health", score: 3 },
    ],
  },
];

// Score interpretation
export interface ScoreInterpretation {
  range: [number, number];
  label: string;
  color: string;
  headline: string;
  description: string;
  cta: string;
}

export const SCORE_INTERPRETATIONS: ScoreInterpretation[] = [
  {
    range: [80, 100],
    label: "Excellent",
    color: "#1EAA55",
    headline: "Your body is in a great place",
    description: "Your habits and health signals suggest strong reproductive health. Conceivable can help you maintain this and optimize even further with personalized insights from your Halo Ring data.",
    cta: "Join early access to lock in your advantage",
  },
  {
    range: [60, 79],
    label: "Good",
    color: "#5A6FFF",
    headline: "You're on the right track",
    description: "You have a solid foundation with some areas where targeted improvements could make a real difference. Conceivable's AI care team can identify exactly which changes will move the needle for you.",
    cta: "Get early access to your personalized plan",
  },
  {
    range: [40, 59],
    label: "Room to Grow",
    color: "#F1C028",
    headline: "Your body is telling you something",
    description: "There are clear signals that your reproductive health could benefit from targeted support. The good news? These are exactly the areas Conceivable is designed to address — and most women see measurable improvement within 3-6 cycles.",
    cta: "Join early access — this is exactly what we built for",
  },
  {
    range: [0, 39],
    label: "Let's Talk",
    color: "#E24D47",
    headline: "You deserve better answers",
    description: "Your quiz responses suggest your body is working overtime without the right support. You're not broken — you're just missing the data and the team. Conceivable's AI care team will identify your root causes and build a personalized protocol to get your health on track.",
    cta: "Get early access — we're building this for you",
  },
];

// Calculate score from quiz answers
export function calculateQuizScore(answers: Record<string, string | string[]>): {
  totalScore: number;
  categoryScores: Record<string, { score: number; maxScore: number; percentage: number }>;
} {
  const categoryScores: Record<string, { score: number; maxScore: number; percentage: number }> = {};

  // Initialize categories
  for (const cat of QUIZ_CATEGORIES) {
    categoryScores[cat.id] = { score: 0, maxScore: cat.maxScore, percentage: 0 };
  }

  // Calculate per-question scores
  for (const q of QUIZ_QUESTIONS) {
    const answer = answers[q.id];
    if (!answer) continue;

    if (q.type === "multi" && Array.isArray(answer)) {
      // Multi-select: sum scores, but cap at category contribution
      const hasNone = answer.includes("none");
      if (hasNone) {
        const noneOpt = q.options.find(o => o.value === "none");
        if (noneOpt) categoryScores[q.category].score += noneOpt.score;
      } else {
        let multiScore = 0;
        for (const val of answer) {
          const opt = q.options.find(o => o.value === val);
          if (opt) multiScore += opt.score;
        }
        // For negative-scoring multi-selects, start from max and subtract
        const maxOpt = q.options.find(o => o.value === "none");
        const baseScore = maxOpt ? maxOpt.score : 0;
        categoryScores[q.category].score += Math.max(baseScore + multiScore, 0);
      }
    } else {
      const val = Array.isArray(answer) ? answer[0] : answer;
      const opt = q.options.find(o => o.value === val);
      if (opt) categoryScores[q.category].score += opt.score;
    }
  }

  // Calculate percentages and weighted total
  let totalScore = 0;
  for (const cat of QUIZ_CATEGORIES) {
    const catScore = categoryScores[cat.id];
    catScore.score = Math.max(0, Math.min(catScore.score, cat.maxScore));
    catScore.percentage = Math.round((catScore.score / cat.maxScore) * 100);
    totalScore += catScore.percentage * cat.weight;
  }

  return {
    totalScore: Math.round(totalScore),
    categoryScores,
  };
}

export function getScoreInterpretation(score: number): ScoreInterpretation {
  return SCORE_INTERPRETATIONS.find(
    s => score >= s.range[0] && score <= s.range[1]
  ) || SCORE_INTERPRETATIONS[SCORE_INTERPRETATIONS.length - 1];
}

// Generate a referral code from email
export function generateReferralCode(email: string): string {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}
