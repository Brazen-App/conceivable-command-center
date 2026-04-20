import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function hashPassword(pw: string): string {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/** GET /api/kai-session?email=...&password=... — load saved conversation */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase();
  const password = searchParams.get("password");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400, headers: CORS });

  const session = await prisma.kaiSession.findUnique({ where: { email } });
  if (!session) return NextResponse.json({ error: "not_found" }, { status: 404, headers: CORS });

  const gathered = (session.gathered || {}) as Record<string, unknown>;

  // Verify password if one is stored
  if (gathered._passwordHash) {
    if (!password) return NextResponse.json({ error: "wrong_password" }, { status: 401, headers: CORS });
    const hash = hashPassword(password);
    if (hash !== gathered._passwordHash) {
      return NextResponse.json({ error: "wrong_password" }, { status: 401, headers: CORS });
    }
  }

  const msgCount = gathered._msgCount || 0;

  return NextResponse.json({
    messages: session.messages,
    gathered,
    mode: session.mode,
    msgCount,
  }, { headers: CORS });
}

/** POST /api/kai-session — save conversation */
export async function POST(req: Request) {
  try {
    const { email, messages, gathered, mode, msgCount, password } = await req.json();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400, headers: CORS });

    // Store msgCount inside gathered to avoid schema change
    const gatheredWithCount = { ...(gathered || {}), _msgCount: msgCount || 0 };

    // Hash and store password if provided (new account or password update)
    if (password) {
      gatheredWithCount._passwordHash = hashPassword(password);
    }

    await prisma.kaiSession.upsert({
      where: { email: email.toLowerCase() },
      update: {
        messages: messages || [],
        gathered: gatheredWithCount,
        mode: mode || "free",
      },
      create: {
        email: email.toLowerCase(),
        messages: messages || [],
        gathered: gatheredWithCount,
        mode: mode || "free",
      },
    });

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    console.error("[kai-session] Error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500, headers: CORS });
  }
}
