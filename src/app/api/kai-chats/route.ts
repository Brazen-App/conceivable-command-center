import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com", "kirsten@conceivable.com", "jennifer.pawling@pfisd.net"];
const TEST_PATTERNS = [/^test@/i, /^t@t\./i, /@test\./i, /^example@/i, /@example\./i];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** POST /api/kai-chats — log a single Kai exchange from the quiz */
export async function POST(req: Request) {
  try {
    const { email, name, userMessage, kaiResponse, answers, supplements, sessionId } = await req.json();

    if (!userMessage || !kaiResponse) {
      return NextResponse.json({ error: "userMessage and kaiResponse required" }, { status: 400, headers: CORS_HEADERS });
    }

    const emailLower = (email || "").toLowerCase().trim();
    const isTest = TEST_EMAILS.includes(emailLower) || TEST_PATTERNS.some(p => p.test(emailLower));

    await prisma.kaiChatLog.create({
      data: {
        email: email || null,
        name: name || null,
        isTest,
        userMessage,
        kaiResponse,
        concerns: answers?.concerns || [],
        supplements: supplements || [],
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[kai-chats] POST error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500, headers: CORS_HEADERS });
  }
}

/** GET /api/kai-chats — list chat logs, excludes test accounts from metrics */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeTest = searchParams.get("includeTest") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 500;

    const where = includeTest ? {} : { isTest: false };

    const [logs, total] = await Promise.all([
      prisma.kaiChatLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.kaiChatLog.count({ where }),
    ]);

    return NextResponse.json({ logs, total, page, pageSize }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[kai-chats] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500, headers: CORS_HEADERS });
  }
}
