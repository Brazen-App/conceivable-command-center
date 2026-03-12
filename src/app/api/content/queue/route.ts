import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Optimal posting times by platform (EST)
const OPTIMAL_TIMES: Record<string, { hour: number; minute: number }[]> = {
  "instagram-post": [{ hour: 11, minute: 0 }, { hour: 14, minute: 0 }, { hour: 19, minute: 0 }],
  "instagram-carousel": [{ hour: 10, minute: 0 }, { hour: 13, minute: 0 }],
  linkedin: [{ hour: 8, minute: 0 }, { hour: 10, minute: 0 }, { hour: 12, minute: 0 }],
  pinterest: [{ hour: 20, minute: 0 }, { hour: 21, minute: 0 }],
  tiktok: [{ hour: 19, minute: 0 }, { hour: 21, minute: 0 }, { hour: 12, minute: 0 }],
  youtube: [{ hour: 14, minute: 0 }, { hour: 17, minute: 0 }],
  blog: [{ hour: 9, minute: 0 }, { hour: 11, minute: 0 }],
  circle: [{ hour: 10, minute: 0 }, { hour: 15, minute: 0 }],
};

function getNextOptimalTime(platform: string): Date {
  const times = OPTIMAL_TIMES[platform] || [{ hour: 10, minute: 0 }];
  const now = new Date();
  // EST offset (UTC-5)
  const estOffset = -5;
  const estNow = new Date(now.getTime() + estOffset * 60 * 60 * 1000);
  const currentHour = estNow.getUTCHours();
  const currentMinute = estNow.getUTCMinutes();

  // Find the next available time slot today or tomorrow
  for (const t of times) {
    if (t.hour > currentHour || (t.hour === currentHour && t.minute > currentMinute)) {
      const scheduled = new Date(estNow);
      scheduled.setUTCHours(t.hour, t.minute, 0, 0);
      // Convert back from EST to UTC
      return new Date(scheduled.getTime() - estOffset * 60 * 60 * 1000);
    }
  }

  // All times passed today — schedule for first slot tomorrow
  const tomorrow = new Date(estNow);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(times[0].hour, times[0].minute, 0, 0);
  return new Date(tomorrow.getTime() - estOffset * 60 * 60 * 1000);
}

/**
 * POST /api/content/queue
 * Adds content to the posting queue at the next optimal time.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pieces } = body;

    if (!pieces || !Array.isArray(pieces) || pieces.length === 0) {
      return NextResponse.json({ error: "pieces array is required" }, { status: 400 });
    }

    const queued = [];
    for (const piece of pieces) {
      const scheduledFor = getNextOptimalTime(piece.platform);

      const entry = await prisma.contentQueue.create({
        data: {
          platform: piece.platform,
          title: piece.title || `${piece.platform} post`,
          body: piece.body,
          imageData: piece.imageData || null,
          imagePrompt: piece.imagePrompt || null,
          hashtags: piece.hashtags || [],
          scheduledFor,
          status: "queued",
        },
      });

      queued.push({
        id: entry.id,
        platform: entry.platform,
        scheduledFor: entry.scheduledFor,
        title: entry.title,
      });
    }

    return NextResponse.json({ ok: true, queued, count: queued.length });
  } catch (err) {
    console.error("Queue error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to queue content" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/queue
 * Returns queued content, optionally filtered by status.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "queued";

  const items = await prisma.contentQueue.findMany({
    where: { status },
    orderBy: { scheduledFor: "asc" },
    take: 50,
  });

  return NextResponse.json({ items, count: items.length });
}
