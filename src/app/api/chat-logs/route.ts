import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contextType, contextId, role, message, sessionId } = body;

    if (!contextType || !role || !message || !sessionId) {
      return NextResponse.json(
        { error: "contextType, role, message, and sessionId are required" },
        { status: 400 }
      );
    }

    const chatLog = await prisma.chatLog.create({
      data: {
        contextType,
        contextId: contextId || null,
        role,
        message,
        sessionId,
      },
    });

    return NextResponse.json(chatLog);
  } catch (err) {
    console.error("POST /api/chat-logs error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const contextType = searchParams.get("contextType");
    const contextId = searchParams.get("contextId");

    if (sessionId) {
      const messages = await prisma.chatLog.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(messages);
    }

    if (contextType && contextId) {
      const messages = await prisma.chatLog.findMany({
        where: { contextType, contextId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json(messages);
    }

    return NextResponse.json(
      { error: "Provide sessionId or contextType+contextId" },
      { status: 400 }
    );
  } catch (err) {
    console.error("GET /api/chat-logs error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
