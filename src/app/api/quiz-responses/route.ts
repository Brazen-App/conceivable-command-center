import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Handle preflight */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/quiz-responses — save a quiz response from the quiz app
 * Called by conceivable-quiz when someone submits their email + completes the quiz
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, answers, products, cartUrl, kaiMessage } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400, headers: CORS_HEADERS });
    }

    const response = await prisma.quizResponse.create({
      data: {
        email,
        name: name || null,
        answers: answers || {},
        products: products || [],
        cartUrl: cartUrl || null,
        kaiMessage: kaiMessage || null,
        medical: answers?.medical || null,
        medications: answers?.medications || null,
        otherNotes: answers?.other || null,
        topConcern: Array.isArray(answers?.concerns) ? answers.concerns[0] : null,
        ageRange: answers?.age || null,
        energy: answers?.energy || null,
      },
    });

    return NextResponse.json({ ok: true, id: response.id }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[quiz-responses] POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET /api/quiz-responses — list all quiz responses (newest first)
 */
export async function GET() {
  try {
    const responses = await prisma.quizResponse.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ responses, total: responses.length }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[quiz-responses] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
