import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * POST /api/funnel-event — fire-and-forget tracking for the Kai funnel.
 * Body: { event: string, email?: string, sessionId?: string, metadata?: object }
 * Events: page_view, form_submit, stripe_started, stripe_completed,
 *         chat_opened, first_message, chat_closed
 */
export async function POST(req: Request) {
  try {
    const { event, email, sessionId, metadata } = await req.json();
    if (!event) return NextResponse.json({ ok: false }, { headers: CORS });

    const TEST = ["kirsten.karchmer@iambrazen.com", "kirsten@conceivable.com", "jennifer.pawling@pfisd.net"];
    const TEST_PATTERNS = [/^t@t\./i, /^test@/i, /@test\./i, /@example\./i];
    const e = (email || "").toLowerCase().trim();
    if (e && (TEST.includes(e) || TEST_PATTERNS.some((p) => p.test(e)))) {
      return NextResponse.json({ ok: true, skipped: "test_email" }, { headers: CORS });
    }

    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const key = `funnel_event_${ts}_${rand}`;

    await prisma.siteConfig.create({
      data: {
        key,
        value: JSON.stringify({
          event,
          email: e || null,
          sessionId: sessionId || null,
          metadata: metadata || null,
          ts,
        }),
      },
    });

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    console.error("[funnel-event]", err);
    return NextResponse.json({ ok: true }, { headers: CORS }); // silently fail — don't block UX
  }
}
