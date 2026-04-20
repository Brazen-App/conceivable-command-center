import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEST_EMAILS = ["test@test.com", "kirsten.karchmer@iambrazen.com", "kirsten@conceivable.com"];
const SUPP_NAMES: Record<string, string> = {
  NAC: "NAC", OMEGA: "Omega-3", COQ10: "CoQ10", METHYL_B: "Prenatal Multi",
  VIT_C: "Vitamin C", BERBERINE: "Berberine", MAGNESIUM: "Magnesium",
  D_COMPLEX: "D-Complex", TURMERIC: "Turmeric", CHROMIUM: "Chromium",
  ZINC: "Zinc", ASHWAGANDHA: "Ashwagandha", RHODIOLA: "Rhodiola",
  DIM: "DIM", RESVERATROL: "Resveratrol", NR: "NR", CHOLINE: "Choline",
  PROBIOTIC: "Probiotic",
};

export async function GET() {
  try {
    const sessions = await prisma.kaiSession.findMany();
    const realSessions = sessions.filter(s => !TEST_EMAILS.includes(s.email));

    // Landing page views
    const landingTotal = await prisma.siteConfig.findUnique({ where: { key: "kai_landing_total" } });
    const landingViews = parseInt(landingTotal?.value as string || "0", 10);

    let totalUsers = realSessions.length;
    let gotPack = 0;
    let droppedAtPack = 0;
    let askedQuestions = 0;
    let alreadyTaking = 0;
    let mentionedCost = 0;
    let askedAboutApp = 0;
    let uploadedBBT = 0;
    let shortSessions = 0;
    const supplements: Record<string, number> = {};
    const conditions: Record<string, number> = {};
    const questionsAfterPack: string[] = [];
    const objections: string[] = [];
    const userProfiles: { email: string; concerns: string; msgs: number; hasPack: boolean; lastActive: string }[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of realSessions) {
      const msgs: any[] = Array.isArray(row.messages) ? row.messages as any[] : [];
      const userMsgs = msgs.filter((m) => m.role === "user");
      const kaiMsgs = msgs.filter((m) => m.role === "assistant");
      const allText = userMsgs.map((m) => m.content || "").join(" ").toLowerCase();
      const kaiText = kaiMsgs.map((m) => m.content || "").join(" ");

      if (userMsgs.length < 5) shortSessions++;

      // Conditions
      if (/pcos/.test(allText)) conditions["PCOS"] = (conditions["PCOS"] || 0) + 1;
      if (/endo(?:metriosis)?/.test(allText)) conditions["Endometriosis"] = (conditions["Endometriosis"] || 0) + 1;
      if (/thyroid|hashimoto/.test(allText)) conditions["Thyroid"] = (conditions["Thyroid"] || 0) + 1;
      if (/miscarr|chemical.*pregnan|loss/.test(allText)) conditions["Pregnancy Loss"] = (conditions["Pregnancy Loss"] || 0) + 1;
      if (/ivf/.test(allText)) conditions["IVF"] = (conditions["IVF"] || 0) + 1;
      if (/autoimmune/.test(allText)) conditions["Autoimmune"] = (conditions["Autoimmune"] || 0) + 1;
      if (/diabetes/.test(allText)) conditions["Diabetes"] = (conditions["Diabetes"] || 0) + 1;
      if (/fibroid/.test(allText)) conditions["Fibroids"] = (conditions["Fibroids"] || 0) + 1;
      if (/anxi/.test(allText)) conditions["Anxiety"] = (conditions["Anxiety"] || 0) + 1;
      if (/mthfr/.test(allText)) conditions["MTHFR"] = (conditions["MTHFR"] || 0) + 1;

      const hasPack = kaiText.includes("[PACK_START]");
      if (hasPack) {
        gotPack++;
        const packIdx = msgs.findIndex((m: any) => m.content?.includes("[PACK_START]"));
        const afterPack = msgs.slice(packIdx + 1).filter((m: any) => m.role === "user");
        if (afterPack.length === 0) droppedAtPack++;
        for (const m of afterPack) {
          const t = (m.content || "").toLowerCase();
          if (/question|what is|tell me more|can you explain|why/.test(t)) askedQuestions++;
          if (/already|i take|i have|perelel|we natal|parallel|prenatal|prescribed/.test(t)) alreadyTaking++;
          if (/how much|price|cost|afford|expensive/.test(t)) mentionedCost++;
          if (/app|mobile|phone/.test(t)) askedAboutApp++;
          if (/don't need|don't think|not sure|skip/.test(t)) objections.push(m.content || "");
          if (m.content && m.content.length > 15) questionsAfterPack.push(m.content);
        }
      }

      if (/bbt|chart/.test(allText)) uploadedBBT++;

      // Supplements
      const packMatch = kaiText.match(/\[PACK_START\]([\s\S]*?)(?:\[PACK_END\]|\[\/PACK_START\]|$)/);
      if (packMatch) {
        for (const line of packMatch[1].split("\n").filter((l) => l.includes("SUPP|"))) {
          const key = line.split("|")[1]?.trim();
          if (key) supplements[key] = (supplements[key] || 0) + 1;
        }
      }

      // Profile
      const firstConcern = userMsgs[0]?.content?.substring(0, 80) || "—";
      userProfiles.push({
        email: row.email,
        concerns: firstConcern,
        msgs: userMsgs.length,
        hasPack,
        lastActive: (row as { updatedAt?: Date }).updatedAt?.toISOString?.() || "",
      });
    }

    // Sort supplements
    const topSupplements = Object.entries(supplements)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, name: SUPP_NAMES[key] || key, count, pct: Math.round((count / Math.max(gotPack, 1)) * 100) }));

    // Sort conditions
    const topConditions = Object.entries(conditions)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: Math.round((count / totalUsers) * 100) }));

    // Conversion analysis
    const packRate = totalUsers > 0 ? Math.round((gotPack / totalUsers) * 100) : 0;
    const questionRate = gotPack > 0 ? Math.round((askedQuestions / gotPack) * 100) : 0;
    const alreadyTakingRate = gotPack > 0 ? Math.round((alreadyTaking / gotPack) * 100) : 0;

    // Generate recommendations
    const recommendations: string[] = [];
    if (alreadyTakingRate > 30) {
      recommendations.push("COMPARE FEATURE: " + alreadyTakingRate + "% of users already take supplements. Add a 'compare your current stack' feature so Kai shows what they're missing vs what they have.");
    }
    if (droppedAtPack > 2) {
      recommendations.push("PACK DROP-OFF: " + droppedAtPack + " users saw their pack but didn't engage further. Consider auto-follow-up: 'Want me to walk you through why I picked each one?'");
    }
    if (mentionedCost === 0 && gotPack > 5) {
      recommendations.push("PRICE ISN'T THE BLOCKER: Nobody mentioned cost. The issue is likely trust/education, not price. Focus on explaining WHY these specific supplements, not discounting.");
    }
    if (askedAboutApp > 0) {
      recommendations.push("APP DEMAND: " + askedAboutApp + " user(s) asked about an app. Use this in marketing — 'App coming soon, sign up to be first.'");
    }
    if (questionRate > 40) {
      recommendations.push("EDUCATION GAP: " + questionRate + "% of pack recipients ask questions about ingredients. Pre-empt this by having Kai briefly explain each supplement as part of the pack presentation.");
    }
    if (topConditions[0]?.name === "Pregnancy Loss") {
      recommendations.push("LOSS IS #1 CONCERN: Create targeted content/landing page for loss mamas. This is your emotional hook — they feel failed by the system.");
    }

    const report = {
      date: new Date().toISOString().split("T")[0],
      summary: {
        landingViews,
        totalUsers,
        gotPack,
        packRate,
        shortSessions,
        droppedAtPack,
      },
      postPackBehavior: {
        askedQuestions,
        questionRate,
        alreadyTaking,
        alreadyTakingRate,
        mentionedCost,
        askedAboutApp,
        uploadedBBT,
      },
      topConditions,
      topSupplements,
      sampleQuestions: [...new Set(questionsAfterPack)].slice(0, 10),
      objections: [...new Set(objections)].slice(0, 5),
      recommendations,
      userProfiles: userProfiles.sort((a, b) => b.msgs - a.msgs).slice(0, 20),
    };

    return NextResponse.json(report);
  } catch (err) {
    console.error("[kai-daily-report]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
