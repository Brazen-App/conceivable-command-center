import { NextRequest, NextResponse } from "next/server";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DISABLED — ALL EMAIL SCHEDULING/SENDING IS LOCKED DOWN        ║
 * ║                                                                ║
 * ║  After two incidents of accidental full-list sends (March 8    ║
 * ║  and March 13, 2026), this endpoint is completely disabled.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  console.error(
    "[BLOCKED] emails/schedule called but ALL email sending is disabled.",
    "Body:", JSON.stringify(body),
    "Time:", new Date().toISOString()
  );

  return NextResponse.json(
    {
      error: "EMAIL SENDING IS DISABLED. All email scheduling has been locked down after repeated accidental full-list sends. Contact the CEO to re-enable.",
      blocked: true,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}
