import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const { email, name, answers, source } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400, headers: CORS_HEADERS });
    }

    // Upsert — don't create duplicates
    const signup = await prisma.earlyAccessSignup.upsert({
      where: { email },
      update: {
        name: name || undefined,
        quizAnswers: answers || undefined,
        utmSource: source || undefined,
      },
      create: {
        email,
        name: name || null,
        quizAnswers: answers || {},
        tier: "early_access",
        utmSource: source || null,
      },
    });

    return NextResponse.json({ ok: true, id: signup.id }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[early-access-signup]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET() {
  try {
    const signups = await prisma.earlyAccessSignup.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ signups, total: signups.length }, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
