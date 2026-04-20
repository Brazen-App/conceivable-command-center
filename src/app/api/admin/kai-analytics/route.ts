import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to = searchParams.get("to");     // YYYY-MM-DD

  const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {};
  if (from) {
    dateFilter.createdAt = { ...dateFilter.createdAt, gte: new Date(`${from}T00:00:00Z`) };
  }
  if (to) {
    dateFilter.createdAt = { ...dateFilter.createdAt, lte: new Date(`${to}T23:59:59Z`) };
  }

  const where = { isTest: false, ...dateFilter };

  const [totalMsgs, testMsgs, allLogs] = await Promise.all([
    prisma.kaiChatLog.count({ where }),
    prisma.kaiChatLog.count({ where: { isTest: true, ...dateFilter } }),
    prisma.kaiChatLog.findMany({
      where,
      select: { sessionId: true, email: true, kaiResponse: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Group by sessionId — use sessionId as the canonical key.
  // For logs with no sessionId, each becomes its own "session" keyed by timestamp.
  const sessionMap = new Map<string, typeof allLogs>();
  for (const log of allLogs) {
    const key = log.sessionId || `anon-${log.createdAt.toISOString()}`;
    if (!sessionMap.has(key)) sessionMap.set(key, []);
    sessionMap.get(key)!.push(log);
  }

  const sessions = Array.from(sessionMap.entries());
  const totalSessions = sessions.length;

  let packsPresented = 0;
  let cartLinksShown = 0;
  let malePacksPresented = 0;
  const emailSet = new Set<string>();

  for (const [, logs] of sessions) {
    let hasPack = false;
    let hasCart = false;
    let hasMale = false;
    for (const log of logs) {
      if (log.kaiResponse?.includes("PACK_START")) hasPack = true;
      if (log.kaiResponse?.includes("/checkout") || log.kaiResponse?.includes("/cart")) hasCart = true;
      if (log.kaiResponse?.includes("MALE_PACK_START")) hasMale = true;
      if (log.email && log.email.includes("@")) emailSet.add(log.email.toLowerCase());
    }
    if (hasPack) packsPresented++;
    if (hasCart) cartLinksShown++;
    if (hasMale) malePacksPresented++;
  }
  const emailsCollected = emailSet.size;

  // Daily trend — count unique sessionIds per day
  const dailyMap = new Map<string, { sessions: Set<string>; messages: number }>();
  for (const log of allLogs) {
    const day = log.createdAt.toISOString().slice(0, 10);
    if (!dailyMap.has(day)) dailyMap.set(day, { sessions: new Set(), messages: 0 });
    const d = dailyMap.get(day)!;
    d.messages++;
    d.sessions.add(log.sessionId || `anon-${log.createdAt.toISOString()}`);
  }
  const dailyTrend = Array.from(dailyMap.entries())
    .map(([date, d]) => ({ date, sessions: d.sessions.size, messages: d.messages }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const avgMsgsPerSession = totalSessions > 0 ? Math.round(allLogs.length / totalSessions) : 0;

  // Quiz vs Kai comparison
  const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com"];
  const allResponses = await prisma.quizResponse.findMany({
    where: { NOT: { email: { in: TEST_EMAILS } }, ...dateFilter },
    select: { email: true, answers: true },
  });
  const quizOnly = allResponses.filter(r => {
    const src = (r.answers as Record<string, unknown>)?.source;
    return !src || !(typeof src === "string" && src.startsWith("kai"));
  });

  const conversionRate = totalSessions > 0 ? Math.round((packsPresented / totalSessions) * 100) : 0;
  const cartRate = packsPresented > 0 ? Math.round((cartLinksShown / packsPresented) * 100) : 0;
  const emailCaptureRate = totalSessions > 0 ? Math.round((emailsCollected / totalSessions) * 1000) / 10 : 0;

  return NextResponse.json({
    kai: {
      totalMessages: allLogs.length,
      testMessages: testMsgs,
      totalSessions,           // unique sessionIds (includes anonymous)
      emailsCollected,         // unique non-null emails
      avgMsgsPerSession,
      funnel: {
        conversations: totalSessions,
        emailsCollected,
        packsPresented,
        cartLinksShown,
        malePacksPresented,
        conversionRate,
        cartRate,
        emailCaptureRate,
      },
      dailyTrend,
    },
    quiz: { totalCompletions: quizOnly.length },
    comparison: {
      quizCompletions: quizOnly.length,
      kaiConversations: totalSessions,
      kaiPacksPresented: packsPresented,
      kaiCartLinks: cartLinksShown,
    },
    dateRange: { from: from || "all", to: to || "all" },
  });
}
