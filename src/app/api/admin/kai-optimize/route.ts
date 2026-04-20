import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Helpers ──────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ── GET — Dashboard data ────────────────────────────────────

export async function GET() {
  try {
    const today = todayStr();
    const yesterday = yesterdayStr();
    const sevenDaysAgo = daysAgoStr(7);
    const fourteenDaysAgo = daysAgoStr(14);

    // Fetch today's and yesterday's logs
    const [todayLog, yesterdayLog, last14Days, activeExperiments, completedExperiments] =
      await Promise.all([
        prisma.kaiDailyLog.findUnique({ where: { date: today } }),
        prisma.kaiDailyLog.findUnique({ where: { date: yesterday } }),
        prisma.kaiDailyLog.findMany({
          where: { date: { gte: fourteenDaysAgo } },
          orderBy: { date: "desc" },
        }),
        prisma.kaiExperiment.findMany({
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
        }),
        prisma.kaiExperiment.findMany({
          where: { status: { in: ["completed", "failed"] } },
          orderBy: { updatedAt: "desc" },
          take: 20,
        }),
      ]);

    // 7-day average
    const last7 = last14Days.filter((l) => l.date >= sevenDaysAgo);
    const avg = (arr: number[]) =>
      arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const avgFloat = (arr: number[]) =>
      arr.length > 0
        ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100
        : 0;

    const sevenDayAvg = {
      landingViews: avg(last7.map((l) => l.landingViews)),
      chatsStarted: avg(last7.map((l) => l.chatsStarted)),
      emailsCaptured: avg(last7.map((l) => l.emailsCaptured)),
      packsBuilt: avg(last7.map((l) => l.packsBuilt)),
      cartClicks: avg(last7.map((l) => l.cartClicks)),
      purchases: avg(last7.map((l) => l.purchases)),
      revenue: avgFloat(last7.map((l) => l.revenue)),
      subscribers: avg(last7.map((l) => l.subscribers)),
    };

    // Trend analysis
    const firstHalf = last14Days.filter((l) => l.date < sevenDaysAgo);
    const secondHalf = last7;

    const metricKeys = [
      "landingViews",
      "chatsStarted",
      "emailsCaptured",
      "packsBuilt",
      "cartClicks",
      "purchases",
      "revenue",
      "subscribers",
    ] as const;

    const trends: Record<string, { direction: string; pct: number }> = {};
    for (const key of metricKeys) {
      const firstAvg = avgFloat(firstHalf.map((l) => l[key] as number));
      const secondAvg = avgFloat(secondHalf.map((l) => l[key] as number));
      const change = pctChange(secondAvg, firstAvg);
      trends[key] = {
        direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
        pct: Math.abs(change),
      };
    }

    return NextResponse.json({
      today: todayLog,
      yesterday: yesterdayLog,
      sevenDayAvg,
      last14Days,
      activeExperiments,
      completedExperiments,
      trends,
    });
  } catch (err) {
    console.error("kai-optimize GET error:", err);
    return NextResponse.json({ error: "Failed to load optimization data" }, { status: 500 });
  }
}

// ── POST — Actions ──────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── Log daily metrics ────────────────────────────────────
    if (action === "log_daily") {
      const today = todayStr();

      // Count today's chat logs
      const todayStart = new Date(today + "T00:00:00.000Z");
      const todayEnd = new Date(today + "T23:59:59.999Z");

      const [chatCount, emailCount, quizCount] = await Promise.all([
        prisma.kaiChatLog.count({
          where: { createdAt: { gte: todayStart, lte: todayEnd }, isTest: false },
        }),
        prisma.kaiChatLog.count({
          where: {
            createdAt: { gte: todayStart, lte: todayEnd },
            isTest: false,
            email: { not: null },
          },
        }),
        prisma.quizResponse.count({
          where: { createdAt: { gte: todayStart, lte: todayEnd } },
        }),
      ]);

      // Get unique sessions to count unique chats
      const uniqueSessions = await prisma.kaiChatLog.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, isTest: false },
        select: { sessionId: true },
        distinct: ["sessionId"],
      });

      // Get unique emails captured
      const uniqueEmails = await prisma.kaiChatLog.findMany({
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
          isTest: false,
          email: { not: null },
        },
        select: { email: true },
        distinct: ["email"],
      });

      // Get top concerns from today's chats
      const todayChats = await prisma.kaiChatLog.findMany({
        where: { createdAt: { gte: todayStart, lte: todayEnd }, isTest: false },
        select: { concerns: true },
      });
      const concernCounts: Record<string, number> = {};
      for (const chat of todayChats) {
        for (const concern of chat.concerns) {
          concernCounts[concern] = (concernCounts[concern] || 0) + 1;
        }
      }
      const topConcerns = Object.entries(concernCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      // Get landing page views from SiteConfig if tracked
      let landingViews = 0;
      try {
        const viewConfig = await prisma.siteConfig.findUnique({
          where: { key: `kai_views_${today}` },
        });
        if (viewConfig) landingViews = parseInt(viewConfig.value) || 0;
      } catch {
        // SiteConfig might not have this
      }

      // Get page view count from ResultsPageView
      const pageViews = await prisma.resultsPageView.count({
        where: { createdAt: { gte: todayStart, lte: todayEnd } },
      });
      if (pageViews > landingViews) landingViews = pageViews;

      // Build insights
      const chatsStarted = uniqueSessions.length;
      const emailsCaptured = uniqueEmails.length;
      const convRate =
        landingViews > 0
          ? ((chatsStarted / landingViews) * 100).toFixed(1)
          : "N/A";
      const captureRate =
        chatsStarted > 0
          ? ((emailsCaptured / chatsStarted) * 100).toFixed(1)
          : "N/A";

      const insights = [
        `${chatsStarted} unique chats started today (${chatCount} total messages).`,
        `Landing-to-chat conversion: ${convRate}% (${landingViews} views -> ${chatsStarted} chats).`,
        `Email capture rate: ${captureRate}% (${emailsCaptured} emails from ${chatsStarted} chats).`,
        `${quizCount} quiz completions today.`,
        topConcerns.length > 0
          ? `Top concerns: ${topConcerns
              .slice(0, 3)
              .map((c) => `${c.name} (${c.count})`)
              .join(", ")}.`
          : "No concerns logged today.",
      ].join("\n");

      const recommendations = [
        emailsCaptured === 0
          ? "Email capture is at 0 - test earlier email ask in conversation flow."
          : null,
        chatsStarted < 5
          ? "Low chat volume - consider A/B testing landing page CTA copy."
          : null,
        landingViews > 0 && chatsStarted / landingViews < 0.05
          ? "Landing-to-chat < 5% - test different hero messaging or CTA placement."
          : null,
        chatsStarted > 0 && emailsCaptured / chatsStarted < 0.3
          ? "Email capture < 30% - test providing value before asking for email."
          : null,
      ]
        .filter(Boolean)
        .join("\n");

      const log = await prisma.kaiDailyLog.upsert({
        where: { date: today },
        update: {
          landingViews,
          chatsStarted,
          emailsCaptured,
          packsBuilt: quizCount,
          cartClicks: 0,
          purchases: 0,
          revenue: 0,
          subscribers: emailsCaptured,
          insights,
          recommendations: recommendations || "Keep testing! All metrics look reasonable.",
          topConcerns: JSON.stringify(topConcerns),
          newUsers: JSON.stringify(uniqueEmails.map((e) => e.email)),
        },
        create: {
          date: today,
          landingViews,
          chatsStarted,
          emailsCaptured,
          packsBuilt: quizCount,
          cartClicks: 0,
          purchases: 0,
          revenue: 0,
          subscribers: emailsCaptured,
          insights,
          recommendations: recommendations || "Keep testing! All metrics look reasonable.",
          topConcerns: JSON.stringify(topConcerns),
          newUsers: JSON.stringify(uniqueEmails.map((e) => e.email)),
        },
      });

      return NextResponse.json({ ok: true, log });
    }

    // ── Create experiment ────────────────────────────────────
    if (action === "create_experiment") {
      const { name, hypothesis, change, baselineMetric } = body;
      if (!name || !hypothesis || !change || !baselineMetric) {
        return NextResponse.json(
          { error: "name, hypothesis, change, and baselineMetric are required" },
          { status: 400 }
        );
      }

      const experiment = await prisma.kaiExperiment.create({
        data: {
          name,
          hypothesis,
          change,
          baselineMetric,
          startDate: todayStr(),
          status: "active",
        },
      });

      return NextResponse.json({ ok: true, experiment });
    }

    // ── Complete experiment ──────────────────────────────────
    if (action === "complete_experiment") {
      const { id, resultMetric, result, notes } = body;
      if (!id || !result) {
        return NextResponse.json(
          { error: "id and result are required" },
          { status: 400 }
        );
      }

      const experiment = await prisma.kaiExperiment.update({
        where: { id },
        data: {
          resultMetric: resultMetric || null,
          result,
          notes: notes || null,
          status: result === "won" || result === "lost" ? "completed" : "failed",
          endDate: todayStr(),
        },
      });

      return NextResponse.json({ ok: true, experiment });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("kai-optimize POST error:", err);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
