import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/content/image-feedback
 * Saves image generation feedback for learning over time.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, contentType, topic, prompt, feedback, customNote, wasApproved } = body;

    if (!platform || !prompt) {
      return NextResponse.json({ error: "platform and prompt are required" }, { status: 400 });
    }

    const record = await prisma.imageFeedback.create({
      data: {
        platform,
        contentType: contentType || "unknown",
        topic: topic || "",
        prompt,
        feedback: feedback || (wasApproved ? "approved" : "unknown"),
        customNote: customNote || null,
        wasApproved: wasApproved ?? false,
      },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("Image feedback error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/image-feedback
 * Returns recent feedback for analysis.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const where = platform ? { platform } : {};

  const feedback = await prisma.imageFeedback.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ feedback, count: feedback.length });
}
