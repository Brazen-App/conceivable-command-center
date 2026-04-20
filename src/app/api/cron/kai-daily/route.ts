import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEST_EMAILS = [
  "test@test.com",
  "kirsten.karchmer@iambrazen.com",
  "kirsten@conceivable.com",
];

const SUPP_NAMES: Record<string, string> = {
  NAC: "NAC", OMEGA: "Omega-3", COQ10: "CoQ10", METHYL_B: "Prenatal Multi",
  VIT_C: "Vitamin C", BERBERINE: "Berberine", MAGNESIUM: "Magnesium",
  D_COMPLEX: "D-Complex", TURMERIC: "Turmeric", CHROMIUM: "Chromium",
  ZINC: "Zinc", ASHWAGANDHA: "Ashwagandha", RHODIOLA: "Rhodiola",
  DIM: "DIM", RESVERATROL: "Resveratrol", NR: "NR", CHOLINE: "Choline",
  PROBIOTIC: "Probiotic",
};

function dayRange(daysAgo: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  const start = new Date(d);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end, dateStr: start.toISOString().split("T")[0] };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function analyzeChats(logs: any[]) {
  const uniqueEmails = new Set<string>();
  let totalMessages = 0;
  let packsPresented = 0;
  let cartClicks = 0;
  const concerns: Record<string, number> = {};
  const supplements: Record<string, number> = {};
  const userMessages: string[] = [];

  for (const log of logs) {
    if (log.email) uniqueEmails.add(log.email);
    totalMessages++;
    userMessages.push(log.userMessage);

    // Count packs
    if (log.kaiResponse?.includes("[PACK_START]")) {
      packsPresented++;
      // Extract supplements from pack
      const packMatch = log.kaiResponse.match(
        /\[PACK_START\]([\s\S]*?)(?:\[PACK_END\]|\[\/PACK_START\]|$)/
      );
      if (packMatch) {
        for (const line of packMatch[1].split("\n").filter((l: string) => l.includes("SUPP|"))) {
          const key = line.split("|")[1]?.trim();
          if (key) supplements[key] = (supplements[key] || 0) + 1;
        }
      }
    }

    // Count cart clicks
    if (log.kaiResponse?.includes("[CART_CLICK]") || log.kaiResponse?.includes("shopify")) {
      cartClicks++;
    }

    // Track concerns
    for (const c of log.concerns || []) {
      concerns[c] = (concerns[c] || 0) + 1;
    }
  }

  const topConcerns = Object.entries(concerns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => `${name} (${count})`);

  const topSupplements = Object.entries(supplements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key, count]) => `${SUPP_NAMES[key] || key} (${count})`);

  return {
    uniqueUsers: uniqueEmails.size,
    totalMessages,
    packsPresented,
    cartClicks,
    topConcerns,
    topSupplements,
    userMessages,
    newUserEmails: [...uniqueEmails],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get yesterday's and day-before data
    const yesterday = dayRange(1);
    const dayBefore = dayRange(2);

    const [yesterdayLogs, dayBeforeLogs] = await Promise.all([
      prisma.kaiChatLog.findMany({
        where: {
          createdAt: { gte: yesterday.start, lte: yesterday.end },
          isTest: false,
        },
      }),
      prisma.kaiChatLog.findMany({
        where: {
          createdAt: { gte: dayBefore.start, lte: dayBefore.end },
          isTest: false,
        },
      }),
    ]);

    // Get landing page views
    const landingTotal = await prisma.siteConfig.findUnique({
      where: { key: "kai_landing_total" },
    });
    const landingViews = parseInt(landingTotal?.value || "0", 10);

    // Analyze both days
    const yday = analyzeChats(yesterdayLogs);
    const dbefore = analyzeChats(dayBeforeLogs);

    // Build context for Claude
    const sampleMessages = yday.userMessages.slice(0, 30).map((m, i) => `${i + 1}. "${m}"`).join("\n");

    const prompt = `You are an analytics assistant for Conceivable, a fertility health company.
Analyze yesterday's Kai AI coach data and write a brief daily report.

YESTERDAY (${yesterday.dateStr}):
- Unique users: ${yday.uniqueUsers}
- Total messages: ${yday.totalMessages}
- Packs presented: ${yday.packsPresented}
- Cart clicks: ${yday.cartClicks}
- Landing page total views: ${landingViews}
- Top concerns: ${yday.topConcerns.join(", ") || "none"}
- Top supplements recommended: ${yday.topSupplements.join(", ") || "none"}

DAY BEFORE (${dayBefore.dateStr}):
- Unique users: ${dbefore.uniqueUsers}
- Total messages: ${dbefore.totalMessages}
- Packs presented: ${dbefore.packsPresented}
- Cart clicks: ${dbefore.cartClicks}

SAMPLE USER MESSAGES FROM YESTERDAY:
${sampleMessages || "No messages"}

Write a concise report with these sections:
1. **What happened yesterday** — key metrics, one paragraph
2. **Trends vs day before** — what changed, up or down
3. **Notable user behaviors or quotes** — anything interesting from the messages
4. **What to test next** — one concrete suggestion based on the data

Keep it brief and actionable. No fluff. Write like you're briefing a busy CEO.`;

    // Call Claude Haiku for cost efficiency
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const aiResponse = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const aiInsights =
      aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";

    // Build recommendations list
    const recommendations: string[] = [];
    if (yday.packsPresented > 0 && yday.cartClicks === 0) {
      recommendations.push(
        "Zero cart clicks despite packs shown — test adding a stronger CTA or limited-time offer."
      );
    }
    if (yday.uniqueUsers < dbefore.uniqueUsers && dbefore.uniqueUsers > 0) {
      recommendations.push(
        `User count dropped from ${dbefore.uniqueUsers} to ${yday.uniqueUsers} — check traffic sources.`
      );
    }
    if (yday.totalMessages > 0 && yday.packsPresented === 0) {
      recommendations.push(
        "Users chatted but no packs were built — review conversation flow for pack trigger issues."
      );
    }

    // Save to KaiDailyLog
    await prisma.kaiDailyLog.upsert({
      where: { date: yesterday.dateStr },
      create: {
        date: yesterday.dateStr,
        landingViews,
        chatsStarted: yday.uniqueUsers,
        emailsCaptured: yday.newUserEmails.length,
        packsBuilt: yday.packsPresented,
        cartClicks: yday.cartClicks,
        insights: aiInsights,
        recommendations: recommendations.join("\n"),
        topConcerns: yday.topConcerns.join(", "),
        newUsers: yday.newUserEmails.join(", "),
      },
      update: {
        landingViews,
        chatsStarted: yday.uniqueUsers,
        emailsCaptured: yday.newUserEmails.length,
        packsBuilt: yday.packsPresented,
        cartClicks: yday.cartClicks,
        insights: aiInsights,
        recommendations: recommendations.join("\n"),
        topConcerns: yday.topConcerns.join(", "),
        newUsers: yday.newUserEmails.join(", "),
      },
    });

    console.log(`[kai-daily-cron] Report generated for ${yesterday.dateStr}`);

    return NextResponse.json({
      ok: true,
      date: yesterday.dateStr,
      metrics: {
        uniqueUsers: yday.uniqueUsers,
        totalMessages: yday.totalMessages,
        packsPresented: yday.packsPresented,
        cartClicks: yday.cartClicks,
        landingViews,
      },
      insights: aiInsights,
      recommendations,
    });
  } catch (err) {
    console.error("[kai-daily-cron] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
