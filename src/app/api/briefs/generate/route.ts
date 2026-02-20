import { NextResponse } from "next/server";
import { generateMorningBrief, rankStories } from "@/lib/pipelines/morning-brief";

export async function POST() {
  try {
    const brief = await generateMorningBrief();
    const rankedStories = rankStories(brief.stories);

    return NextResponse.json({
      id: brief.id,
      date: brief.date,
      generatedAt: brief.generatedAt,
      stories: rankedStories,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate brief";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
