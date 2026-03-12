import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { invokeAgent } from "@/lib/agents/invoke";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Platforms to generate daily content for (rotate to avoid fatigue)
const DAILY_PLATFORMS = [
  ["linkedin", "instagram-post", "tiktok"],     // Mon/Thu
  ["instagram-carousel", "pinterest", "blog"],  // Tue/Fri
  ["youtube", "circle", "instagram-post"],       // Wed/Sat
  ["linkedin", "tiktok", "pinterest"],           // Sun
];

/**
 * GET /api/content/daily-refresh
 * Called by Vercel cron at 6am EST daily.
 * 1. Finds the latest unprocessed news/research items
 * 2. Picks today's platform rotation
 * 3. Generates content + queues at optimal times
 */
export async function GET() {
  const now = new Date();
  console.log(`[daily-refresh] Triggered at ${now.toISOString()}`);

  try {
    // 1. Get recent news items that haven't been turned into content yet
    const recentNews = await prisma.newsItem.findMany({
      where: { generatedContent: { equals: Prisma.DbNull } },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const recentResearch = await prisma.researchArticle.findMany({
      where: { generatedContent: { equals: Prisma.DbNull } },
      orderBy: { createdAt: "desc" },
      take: 2,
    });

    if (recentNews.length === 0 && recentResearch.length === 0) {
      return NextResponse.json({
        ok: true,
        triggeredAt: now.toISOString(),
        message: "No new content sources found. Skipping generation.",
        generated: 0,
      });
    }

    // 2. Pick today's platforms
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const todayPlatforms = DAILY_PLATFORMS[dayOfWeek % DAILY_PLATFORMS.length];

    // 3. Pick the top story to generate content for
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topSource: any = recentNews[0] || recentResearch[0];
    const topic: string = topSource.title;
    const context: string = topSource.brief || topSource.fullAbstract || topSource.summary || "";

    // 4. Generate a quick founder angle using AI
    const angleResult = await invokeAgent({
      agentId: "content-engine",
      message: `You are Kirsten Karchmer, founder of Conceivable, a fertility health company.
Given this topic: "${topic}"
Context: ${context.slice(0, 500)}

Write a 2-3 sentence founder's take/angle on this topic. Be warm, smart, a little cheeky.
Think: what would a board-certified fertility expert with 20 years of experience and cool-aunt energy say about this?
Output ONLY the angle text, nothing else.`,
    });

    const founderAngle = angleResult.response;

    // 5. Generate content for each platform
    const generated: Array<{ platform: string; queued: boolean }> = [];

    for (const platform of todayPlatforms) {
      try {
        const contentResult = await invokeAgent({
          agentId: "content-engine",
          message: `Topic: ${topic}\n\nFounder's POV/Angle: ${founderAngle}\n\nWrite content for ${platform}. Be authentic. Plain text only, no markdown.`,
        });

        // Queue it
        await prisma.contentQueue.create({
          data: {
            platform,
            title: `${topic} — ${platform}`,
            body: contentResult.response,
            status: "queued",
            scheduledFor: getOptimalTime(platform, now),
          },
        });

        generated.push({ platform, queued: true });
      } catch (err) {
        console.error(`[daily-refresh] Failed for ${platform}:`, err);
        generated.push({ platform, queued: false });
      }
    }

    // 6. Mark the source as processed
    if ("brief" in topSource) {
      await prisma.newsItem.update({
        where: { id: topSource.id },
        data: { generatedContent: { platforms: todayPlatforms, generatedAt: now.toISOString() } },
      });
    } else {
      await prisma.researchArticle.update({
        where: { id: topSource.id },
        data: { generatedContent: { platforms: todayPlatforms, generatedAt: now.toISOString() } },
      });
    }

    return NextResponse.json({
      ok: true,
      triggeredAt: now.toISOString(),
      topic,
      founderAngle: founderAngle.slice(0, 200),
      platforms: todayPlatforms,
      generated,
      message: `Generated ${generated.filter((g) => g.queued).length} pieces, queued at optimal times.`,
    });
  } catch (err) {
    console.error("[daily-refresh] Error:", err);
    return NextResponse.json({
      ok: false,
      triggeredAt: now.toISOString(),
      error: err instanceof Error ? err.message : "Daily refresh failed",
    }, { status: 500 });
  }
}

// Optimal posting times by platform (returns a Date in UTC for today)
function getOptimalTime(platform: string, today: Date): Date {
  const times: Record<string, number> = {
    linkedin: 13,        // 8am EST = 13 UTC
    "instagram-post": 16, // 11am EST = 16 UTC
    "instagram-carousel": 15,
    pinterest: 1,         // 8pm EST = 1 UTC next day
    tiktok: 0,            // 7pm EST = 0 UTC next day
    youtube: 19,          // 2pm EST = 19 UTC
    blog: 14,             // 9am EST = 14 UTC
    circle: 15,           // 10am EST = 15 UTC
  };

  const hour = times[platform] ?? 16;
  const scheduled = new Date(today);
  scheduled.setUTCHours(hour, 0, 0, 0);

  // If the time has already passed today, it's fine — it'll post ASAP
  return scheduled;
}
