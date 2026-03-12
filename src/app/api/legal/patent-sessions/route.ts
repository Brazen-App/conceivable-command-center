import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/legal/patent-sessions?claimId=xxx
 * Returns all conversation sessions for a patent claim, with draft info.
 *
 * GET /api/legal/patent-sessions?sessionId=xxx
 * Returns full conversation + draft for a specific session.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const claimId = searchParams.get("claimId");
    const sessionId = searchParams.get("sessionId");

    // Load a specific session with its messages and draft
    if (sessionId) {
      const [messages, draft] = await Promise.all([
        prisma.chatLog.findMany({
          where: { sessionId },
          orderBy: { createdAt: "asc" },
        }),
        prisma.patentDraft.findFirst({
          where: { sessionId },
        }),
      ]);

      return NextResponse.json({ messages, draft });
    }

    // List all sessions for a claim
    if (claimId) {
      // Get all unique sessions for this claim
      const logs = await prisma.chatLog.findMany({
        where: { contextType: "patent-draft", contextId: claimId },
        orderBy: { createdAt: "asc" },
        select: { sessionId: true, createdAt: true, role: true, message: true },
      });

      // Group by sessionId
      const sessionMap = new Map<string, {
        sessionId: string;
        startedAt: Date;
        messageCount: number;
        firstMessage: string;
        lastMessage: string;
      }>();

      for (const log of logs) {
        const existing = sessionMap.get(log.sessionId);
        if (!existing) {
          sessionMap.set(log.sessionId, {
            sessionId: log.sessionId,
            startedAt: log.createdAt,
            messageCount: 1,
            firstMessage: log.role === "assistant" ? log.message.slice(0, 120) : "",
            lastMessage: log.message.slice(0, 120),
          });
        } else {
          existing.messageCount++;
          existing.lastMessage = log.message.slice(0, 120);
          if (!existing.firstMessage && log.role === "assistant") {
            existing.firstMessage = log.message.slice(0, 120);
          }
        }
      }

      // Get draft info for each session
      const sessions = Array.from(sessionMap.values());
      const drafts = await prisma.patentDraft.findMany({
        where: { claimId },
        select: { sessionId: true, phase: true, updatedAt: true, sections: true },
      });

      const draftMap = new Map(drafts.map((d) => [d.sessionId, d]));

      const result = sessions.map((s) => {
        const draft = draftMap.get(s.sessionId);
        return {
          ...s,
          phase: draft?.phase || "discovery",
          hasDraft: draft?.sections ? true : false,
          lastUpdated: draft?.updatedAt || s.startedAt,
        };
      }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

      return NextResponse.json({ sessions: result });
    }

    // List ALL patent draft sessions (for the history view)
    const allDrafts = await prisma.patentDraft.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    // Get claim info for each draft
    const claimIds = [...new Set(allDrafts.map((d) => d.claimId))];
    const claims = await prisma.patentClaim.findMany({
      where: { id: { in: claimIds } },
      select: { id: true, claimNumber: true, claimText: true, category: true, parentPatentRef: true },
    });
    const claimMap = new Map(claims.map((c) => [c.id, c]));

    const result = allDrafts.map((d) => {
      const claim = claimMap.get(d.claimId);
      return {
        sessionId: d.sessionId,
        claimId: d.claimId,
        claimNumber: claim?.claimNumber,
        claimText: claim?.claimText?.slice(0, 100),
        category: claim?.category,
        parentPatentRef: claim?.parentPatentRef,
        phase: d.phase,
        messageCount: d.messageCount,
        hasDraft: d.sections ? true : false,
        title: d.title,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });

    return NextResponse.json({ sessions: result });
  } catch (err) {
    console.error("GET /api/legal/patent-sessions error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/legal/patent-sessions
 * Create or update a patent draft session.
 * Body: { claimId, sessionId, phase?, sections?, title?, messageCount? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, sessionId, phase, sections, title, messageCount } = body;

    if (!claimId || !sessionId) {
      return NextResponse.json(
        { error: "claimId and sessionId are required" },
        { status: 400 }
      );
    }

    const draft = await prisma.patentDraft.upsert({
      where: { id: sessionId },
      create: {
        id: sessionId,
        claimId,
        sessionId,
        phase: phase || "discovery",
        sections: sections || null,
        title: title || null,
        messageCount: messageCount || 0,
      },
      update: {
        ...(phase && { phase }),
        ...(sections && { sections }),
        ...(title && { title }),
        ...(messageCount !== undefined && { messageCount }),
      },
    });

    return NextResponse.json(draft);
  } catch (err) {
    console.error("POST /api/legal/patent-sessions error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
