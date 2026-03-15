import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/mailchimp/send-warmup — DISABLED
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DISABLED — ALL EMAIL SENDING IS LOCKED DOWN                   ║
 * ║  After two accidental full-list sends (March 8 and March 13,   ║
 * ║  2026), this endpoint is completely disabled.                   ║
 * ║                                                                ║
 * ║  SAFETY RULES FOR WHEN RE-ENABLED (NON-NEGOTIABLE):           ║
 * ║  1. ALWAYS create a Mailchimp segment before sending           ║
 * ║  2. If segment creation FAILS → HARD ABORT (no send)           ║
 * ║  3. If segment size > 2x tierSize → HARD ABORT                 ║
 * ║  4. Require { confirmed: true } in request body                ║
 * ║  5. Only send emails with status "approved"                    ║
 * ║  6. Max tierSize is 29000 — reject anything higher             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  console.error(
    "[BLOCKED] send-warmup POST called but ALL email sending is disabled.",
    { body: await req.json().catch(() => ({})) }
  );
  return NextResponse.json(
    {
      error: "EMAIL SENDING IS DISABLED. All email sending has been locked down after repeated accidental full-list sends. Contact the CEO to re-enable.",
      blocked: true,
    },
    { status: 403 }
  );
}
