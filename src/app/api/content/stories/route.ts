import { NextRequest, NextResponse } from "next/server";
import { generateDailyStories, generateStoryPrompt, parseStoryResponse, type StorySlot, type StoryType } from "@/lib/pipelines/stories-strategy";
import { invokeAgent } from "@/lib/agents/invoke";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/content/stories
 * Generate stories for a topic.
 * Body: { topic?: string, slot?: "morning" | "evening", type?: StoryType }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, slot, type } = body;

    if (slot && type) {
      // Generate a specific story
      const prompt = generateStoryPrompt(slot as StorySlot, type as StoryType, topic);
      const result = await invokeAgent({ agentId: "content-engine", message: prompt });
      const parsed = parseStoryResponse(result.response, slot as StorySlot, type as StoryType);

      return NextResponse.json({
        ok: true,
        stories: [{
          ...parsed,
          platform: "instagram-story",
          imagePrompt: `Vertical story image (9:16) for Conceivable. ${parsed.headline}. Brand colors: Blue #5A6FFF, Baby Blue #ACB7FF, Pink #E37FB1. NO text in image. Warm, modern, empowering.`,
        }],
      });
    }

    // Generate full daily pair (morning + evening)
    const stories = await generateDailyStories(topic);

    return NextResponse.json({
      ok: true,
      stories,
      count: stories.length,
      schedule: {
        morning: "8:00 AM EST",
        evening: "7:00 PM EST",
      },
    });
  } catch (err) {
    console.error("Stories generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stories generation failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/stories
 * Returns today's story types (what will be generated).
 */
export async function GET() {
  const today = new Date();
  const dayIndex = today.getDay();

  const morningTypes: StoryType[] = ["tip", "motivation", "data-nugget", "quiz"];
  const eveningTypes: StoryType[] = ["poll", "ask-me", "behind-scenes", "tip"];

  return NextResponse.json({
    today: today.toISOString().split("T")[0],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex],
    morning: {
      type: morningTypes[dayIndex % morningTypes.length],
      postTime: "8:00 AM EST",
    },
    evening: {
      type: eveningTypes[dayIndex % eveningTypes.length],
      postTime: "7:00 PM EST",
    },
  });
}
