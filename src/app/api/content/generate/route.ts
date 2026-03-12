import { NextRequest, NextResponse } from "next/server";
import { generateContentBatch } from "@/lib/pipelines/content-creation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, founderAngle, sourceStoryId, templateId } = body;

    if (!topic || !founderAngle) {
      return NextResponse.json(
        { error: "topic and founderAngle are required" },
        { status: 400 }
      );
    }

    const batch = await generateContentBatch(topic, founderAngle, sourceStoryId, templateId);

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
    const rawMessage =
      error instanceof Error ? error.message : String(error);

    // Log the real error for debugging, but never expose raw API errors to users
    console.error("Content generation error:", rawMessage);

    // Map to user-friendly messages
    let userMessage = "Content generation encountered an issue. Please try again.";
    if (rawMessage.includes("credit balance") || rawMessage.includes("billing")) {
      userMessage = "Joy's AI service needs a billing update. Please check the Anthropic API account credits.";
    } else if (rawMessage.includes("rate_limit") || rawMessage.includes("429")) {
      userMessage = "Too many requests right now. Please wait a moment and try again.";
    } else if (rawMessage.includes("overloaded") || rawMessage.includes("529")) {
      userMessage = "Joy's AI service is temporarily busy. Please try again in a few minutes.";
    } else if (rawMessage.includes("authentication") || rawMessage.includes("401")) {
      userMessage = "Joy's AI service credentials need to be updated. Please check the API key configuration.";
    } else if (rawMessage.includes("invalid_api_key") || rawMessage.includes("API key")) {
      userMessage = "Joy's API key is invalid or missing. Please check the ANTHROPIC_API_KEY configuration.";
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
