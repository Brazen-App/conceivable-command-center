import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Answer option definitions — maps answer keys to display labels
const QUESTIONS = [
  {
    id: "concerns",
    label: "Primary concerns",
    category: "intake",
    multi: true,
    options: {
      pregnant: "Get pregnant",
      stay: "Stay pregnant / reduce loss",
      pregnancy: "Currently pregnant",
      pcos: "PCOS",
      endo: "Endometriosis",
      ivf: "IVF / IUI prep",
      insulin: "Insulin resistance",
      sperm: "Sperm / male factor",
    },
  },
  {
    id: "age",
    label: "Age range",
    category: "intake",
    options: {
      under25: "Under 25",
      "25_29": "25–29",
      "30_34": "30–34",
      over35: "35+",
    },
  },
  {
    id: "bleeding",
    label: "Days of full bleeding",
    category: "cycle",
    clinicalInsight:
      "Short bleeding duration (3 days or less) is a subclinical marker of uterine lining insufficiency that standard panels rarely flag.",
    options: {
      "3_less": "3 days or less",
      "4_5": "4–5 days",
      "5_plus": "5+ days",
    },
    flagged: ["3_less"],
  },
  {
    id: "clots",
    label: "Clots during period",
    category: "symptoms",
    clinicalInsight:
      "Clotting is associated with elevated estrogen, fibrin dysregulation, and a suboptimal uterine environment for implantation.",
    options: {
      none: "Never",
      few: "Occasionally / small",
      often: "Frequently / large",
    },
    flagged: ["few", "often"],
  },
  {
    id: "pms",
    label: "PMS severity",
    category: "symptoms",
    options: {
      none: "Minimal / none",
      mild: "Mild",
      bad: "Moderate",
      really_bad: "Severe / debilitating",
    },
    flagged: ["really_bad"],
  },
  {
    id: "cycle",
    label: "Typical cycle length",
    category: "cycle",
    options: {
      under27: "Under 27 days",
      "27_33": "27–33 days",
      "34plus": "34+ days",
    },
  },
  {
    id: "energy",
    label: "Energy level",
    category: "symptoms",
    clinicalInsight:
      "Fatigue signals HPA axis dysregulation and cortisol-progesterone competition — one of the most underdiagnosed patterns in reproductive medicine.",
    options: {
      great: "Great",
      medium: "Moderate",
      tired: "Exhausted / burned out",
    },
    flagged: ["tired"],
  },
  {
    id: "stress",
    label: "Stress level",
    category: "symptoms",
    options: {
      chill: "Low / manageable",
      stressed: "Stressed",
      crazy: "Severely stressed",
    },
    flagged: ["crazy"],
  },
  {
    id: "bbt",
    label: "BBT post-ovulation",
    category: "cycle",
    clinicalInsight:
      "BBT is the single most accessible real-time marker of progesterone adequacy. A low post-ovulatory temp is a measurable signal of luteal phase deficiency.",
    options: {
      good: "Above 97.8°F (healthy)",
      low: "97.8°F or below",
      no_track: "Don't track",
    },
    flagged: ["low"],
  },
  {
    id: "digestive",
    label: "Digestive symptoms",
    category: "symptoms",
    multi: true,
    options: {
      none: "None",
      gas: "Gas",
      bloating: "Bloating",
      sugar: "Sugar cravings",
    },
  },
  {
    id: "wantPrenatal",
    label: "Wants custom prenatal",
    category: "intake",
    options: {
      yes: "Yes — add prenatal to pack",
      no: "No — already have one",
    },
  },
];

const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com"];

export async function GET() {
  const responses = await prisma.quizResponse.findMany({
    where: { NOT: { email: { in: TEST_EMAILS } } },
    select: { answers: true, products: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const total = responses.length;
  if (total === 0) {
    return NextResponse.json({ meta: { totalResponses: 0 }, questions: [], insights: [] });
  }

  const latest = responses[0]?.createdAt;
  const lastUpdated = latest
    ? new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", timeZone: "Pacific/Honolulu",
      }).format(new Date(latest)) + " HST"
    : "";

  // Aggregate answers
  const questionResults = QUESTIONS.map((q) => {
    const counts: Record<string, number> = {};
    let answered = 0;

    for (const r of responses) {
      const ans = (r.answers as Record<string, unknown>)?.[q.id];
      if (ans === undefined || ans === null) continue;

      if (q.multi && Array.isArray(ans)) {
        answered++;
        for (const v of ans) {
          counts[v] = (counts[v] || 0) + 1;
        }
      } else if (typeof ans === "string") {
        answered++;
        counts[ans] = (counts[ans] || 0) + 1;
      }
    }

    const options = Object.entries(q.options).map(([value, label]) => {
      const count = counts[value] || 0;
      const pct = answered > 0 ? Math.round((count / answered) * 100) : 0;
      return {
        label,
        count,
        pct,
        flag: q.flagged?.includes(value) || false,
      };
    });

    return {
      id: q.id,
      label: q.label,
      category: q.category,
      clinicalInsight: q.clinicalInsight || null,
      options,
      answeredCount: answered,
    };
  });

  // Build clinical insights from the data
  const insights = [];

  // Bleeding insight
  const bleedingQ = questionResults.find((q) => q.id === "bleeding");
  const shortBleed = bleedingQ?.options.find((o) => o.label.includes("3 days"));
  if (shortBleed && shortBleed.pct > 15) {
    insights.push({
      id: "bleeding",
      headline: `${shortBleed.pct}% bleed 3 days or less — a lining insufficiency marker.`,
      body: "Short bleeding duration points to inadequate endometrial buildup. For women trying to conceive, this signals the uterine environment may not support implantation — a pattern addressable with targeted protocol.",
      stats: [`${shortBleed.pct}% bleed ≤3 days`, `${shortBleed.count} of ${bleedingQ?.answeredCount} respondents`],
      color: "#5A6FFF",
    });
  }

  // Clotting insight
  const clotsQ = questionResults.find((q) => q.id === "clots");
  const clotters = (clotsQ?.options || []).filter((o) => o.flag).reduce((s, o) => s + o.pct, 0);
  if (clotters > 30) {
    insights.push({
      id: "clotting",
      headline: `${clotters}% report clotting — elevated estrogen marker.`,
      body: "Clotting is associated with elevated estrogen and fibrin dysregulation, signaling the uterine environment may not be optimized for implantation.",
      stats: (clotsQ?.options || []).filter((o) => o.flag).map((o) => `${o.pct}% — ${o.label}`),
      color: "#E37FB1",
    });
  }

  // BBT insight
  const bbtQ = questionResults.find((q) => q.id === "bbt");
  const lowBbt = bbtQ?.options.find((o) => o.label.includes("below"));
  if (lowBbt && lowBbt.pct > 15) {
    insights.push({
      id: "bbt",
      headline: `${lowBbt.pct}% show low post-ovulatory BBT — progesterone marker.`,
      body: "BBT below 97.8°F post-ovulation is a measurable signal of luteal phase deficiency that standard labs rarely catch. This is addressable with targeted supplementation.",
      stats: [`${lowBbt.pct}% stay below 97.8°F`, `${bbtQ?.options.find((o) => o.label.includes("Don't"))?.pct || 0}% don't track BBT`],
      color: "#1EAA55",
    });
  }

  // Energy insight
  const energyQ = questionResults.find((q) => q.id === "energy");
  const exhausted = energyQ?.options.find((o) => o.flag);
  if (exhausted && exhausted.pct > 20) {
    insights.push({
      id: "energy",
      headline: `${exhausted.pct}% report exhaustion — HPA axis signal.`,
      body: "Fatigue in the luteal phase points to HPA axis dysregulation and cortisol-progesterone competition. One of the most underdiagnosed patterns in reproductive medicine.",
      stats: [`${exhausted.pct}% exhausted/burned out`, `Correlates with elevated stress`],
      color: "#9686B9",
    });
  }

  // Top supplements
  const suppCounts: Record<string, number> = {};
  for (const r of responses) {
    const prods = r.products as string[];
    if (!Array.isArray(prods)) continue;
    for (const p of prods) suppCounts[p] = (suppCounts[p] || 0) + 1;
  }
  const topSupps = Object.entries(suppCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));

  // Prenatal adoption
  const prenatalQ = questionResults.find((q) => q.id === "wantPrenatal");
  const prenatalYes = prenatalQ?.options.find((o) => o.label.includes("Yes"));
  const prenatalNo = prenatalQ?.options.find((o) => o.label.includes("No"));

  // Male factor
  const concernsQ = questionResults.find((q) => q.id === "concerns");
  const maleFactorOpt = concernsQ?.options.find((o) => o.label.includes("male"));

  return NextResponse.json({
    meta: {
      totalResponses: total,
      completionRate: 100, // everyone in DB completed
      lastUpdated,
      avgTimeToComplete: "~4 min",
    },
    insights: insights.length > 0 ? insights : null,
    questions: questionResults,
    topSupplements: topSupps,
    prenatal: prenatalYes ? { yes: prenatalYes.count, no: prenatalNo?.count || 0, yesRate: prenatalYes.pct } : null,
    maleFactor: maleFactorOpt ? { count: maleFactorOpt.count, pct: maleFactorOpt.pct } : null,
  });
}
