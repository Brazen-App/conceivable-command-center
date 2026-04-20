import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/emails/schedule
 *
 * Updates email records with scheduling info (date, segment).
 * Does NOT send or create Mailchimp campaigns — use schedule-all or send-warmup for that.
 *
 * Body: { emailIds: string[], scheduledDate?: string, segment?: string, confirmed: true }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.confirmed) {
    return NextResponse.json(
      { error: "Safety check: requires { confirmed: true } in body." },
      { status: 400 }
    );
  }

  const { emailIds, scheduledDate, segment } = body;

  if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
    return NextResponse.json(
      { error: "Missing required field: emailIds (array of email IDs)" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.email.updateMany({
      where: { id: { in: emailIds } },
      data: {
        ...(scheduledDate ? { scheduledDate } : {}),
        ...(segment ? { scheduledSegment: segment } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      updated: updated.count,
      scheduledDate,
      segment,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
