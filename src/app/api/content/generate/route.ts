import { NextRequest, NextResponse } from "next/server";
import { generateContentBatch } from "@/lib/pipelines/content-creation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, founderAngle, sourceStoryId } = body;

    if (!topic || !founderAngle) {
      return NextResponse.json(
        { error: "topic and founderAngle are required" },
        { status: 400 }
      );
    }

    const batch = await generateContentBatch(topic, founderAngle, sourceStoryId);

    return NextResponse.json({
      id: batch.id,
      topic: batch.topic,
      pieces: batch.pieces.map((p) => ({
        platform: p.platform,
        title: p.title,
        body: p.body,
        imagePrompt: p.imagePrompt,
        hashtags: p.hashtags,
        status: p.status,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
