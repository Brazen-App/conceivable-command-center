import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const POSTHOG_HOST = "https://us.i.posthog.com";

// Map question keys to human-readable labels and their possible answers
const QUESTION_META: Record<string, { label: string; step: number; type: "single" | "multi" | "text" }> = {
  concerns: { label: "What brings you here?", step: 2, type: "multi" },
  age: { label: "Age range", step: 4, type: "single" },
  energy: { label: "Energy level", step: 9, type: "single" },
  digestive: { label: "Digestive symptoms", step: 10, type: "multi" },
  bleeding: { label: "Days of bleeding", step: 12, type: "single" },
  soaking: { label: "Tampon/cup fill time", step: 13, type: "single" },
  clots: { label: "Period clots", step: 14, type: "single" },
  pms: { label: "PMS severity", step: 16, type: "single" },
  cycle: { label: "Cycle length", step: 17, type: "single" },
  stress: { label: "Stress level", step: 19, type: "single" },
  bbt: { label: "BBT after ovulation", step: 20, type: "single" },
  prenatal: { label: "Taking a prenatal?", step: 8, type: "single" },
};

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  concerns: { pregnant: "Getting pregnant", stay: "Staying pregnant", sperm: "Sperm issues", pcos: "PCOS", endo: "Endometriosis", ivf: "IVF/IUI prep", insulin: "Insulin resistance" },
  age: { under30: "Under 30", under35: "30\u201335", over35: "Over 35" },
  energy: { tired: "Exhausted", medium: "Medium", great: "Great energy" },
  digestive: { gas: "Gas/burping", bloating: "Bloating", sugar: "Sugar cravings", sleepy: "Sleepy after meals", none: "None" },
  bleeding: { "3_less": "3 days or fewer", "4_5": "4\u20135 days", "5_plus": "More than 5" },
  soaking: { "1_2h": "1\u20132 hours", "3_4h": "3\u20134 hours", "5h": "5+ hours" },
  clots: { none: "No clots", few: "Occasional small", often: "Large/frequent" },
  pms: { none: "Barely any", bad: "Pretty bad", really_bad: "Terrible" },
  cycle: { under27: "< 27 days", "27_33": "27\u201333 days", "34plus": "34+ days" },
  stress: { not: "Not stressed", stressed: "Pretty stressed", crazy: "Extremely stressed" },
  bbt: { low: "97.8\u00B0F or below", good: "Above 97.8\u00B0F", no_track: "Don\u2019t track" },
  prenatal: { yes: "Yes", no: "No" },
};

export async function GET() {
  const POSTHOG_PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY || "";
  const PROJECT_ID = process.env.POSTHOG_PROJECT_ID || "";

  if (!POSTHOG_PERSONAL_KEY || !PROJECT_ID) {
    return NextResponse.json({ configured: false, questions: [] });
  }

  const headers = {
    Authorization: `Bearer ${POSTHOG_PERSONAL_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    // Get all quiz_answer events grouped by question and answer
    const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `
            SELECT
              JSONExtractString(properties, 'question') as question,
              JSONExtractRaw(properties, 'answer') as answer,
              count() as cnt
            FROM events
            WHERE event = 'quiz_answer'
              AND timestamp > toDateTime('2026-03-22 20:00:00')
              AND JSONExtractString(properties, 'question') != ''
            GROUP BY question, answer
            ORDER BY question, cnt DESC
            LIMIT 500
          `,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ configured: true, error: err.slice(0, 200), questions: [] });
    }

    const data = await res.json();
    const rows = data.results || [];

    // Group by question
    const grouped: Record<string, Array<{ answer: string; count: number }>> = {};
    for (const [question, answerRaw, count] of rows) {
      if (!grouped[question]) grouped[question] = [];

      // Parse the answer - could be a JSON string, array, or raw value
      let answers: string[];
      try {
        const parsed = JSON.parse(answerRaw);
        if (Array.isArray(parsed)) {
          answers = parsed.map((v: unknown) => String(v).replace(/^"|"$/g, ""));
        } else {
          answers = [String(parsed).replace(/^"|"$/g, "")];
        }
      } catch {
        answers = [String(answerRaw).replace(/^"|"$/g, "")];
      }

      for (const ans of answers) {
        const existing = grouped[question].find((a) => a.answer === ans);
        if (existing) {
          existing.count += count;
        } else {
          grouped[question].push({ answer: ans, count });
        }
      }
    }

    // Build response with metadata
    const questions = Object.entries(QUESTION_META)
      .sort((a, b) => a[1].step - b[1].step)
      .map(([key, meta]) => {
        const answers = (grouped[key] || [])
          .sort((a, b) => b.count - a.count)
          .map((a) => ({
            value: a.answer,
            label: ANSWER_LABELS[key]?.[a.answer] || a.answer,
            count: a.count,
          }));
        const total = answers.reduce((s, a) => s + a.count, 0);
        return {
          key,
          label: meta.label,
          step: meta.step,
          type: meta.type,
          total,
          answers,
        };
      });

    // Also get total quiz completions for context
    const totalRes = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query: `SELECT count() FROM events WHERE event = 'quiz_completed' AND timestamp > toDateTime('2026-03-22 20:00:00')`,
        },
      }),
    });
    let totalCompletions = 0;
    if (totalRes.ok) {
      const tData = await totalRes.json();
      totalCompletions = tData.results?.[0]?.[0] || 0;
    }

    return NextResponse.json({ configured: true, questions, totalCompletions });
  } catch (err) {
    return NextResponse.json({
      configured: true,
      error: err instanceof Error ? err.message : "Failed",
      questions: [],
    });
  }
}
