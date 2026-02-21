import { NextRequest, NextResponse } from "next/server";
import { generateContentBatch } from "@/lib/pipelines/content-creation";
import { ContentPlatform } from "@/types";

const PLATFORM_IMAGE_DEFAULTS: Record<ContentPlatform, { style: string; aspectRatio: string }> = {
  linkedin: { style: "photography", aspectRatio: "1:1" },
  "instagram-post": { style: "photography", aspectRatio: "1:1" },
  "instagram-carousel": { style: "illustration", aspectRatio: "1:1" },
  x: { style: "photography", aspectRatio: "16:9" },
  pinterest: { style: "infographic", aspectRatio: "2:3" },
  tiktok: { style: "photography", aspectRatio: "9:16" },
  youtube: { style: "photography", aspectRatio: "16:9" },
  blog: { style: "photography", aspectRatio: "16:9" },
};

/**
 * Transform a raw image-prompt string (from the AI pipeline) into the
 * structured ImagePromptData object the frontend expects.
 */
function toImagePromptData(
  raw: string | undefined,
  platform: ContentPlatform
): {
  prompt: string;
  alt: string;
  style: string;
  aspectRatio: string;
  textOverlay: string | null;
  colorPalette: string[];
} | undefined {
  if (!raw) return undefined;

  const defaults = PLATFORM_IMAGE_DEFAULTS[platform];

  // Try to extract style from the raw text
  const styleMatch = raw.match(/\b(photography|illustration|infographic|typography)\b/i);
  const style = styleMatch ? styleMatch[1].toLowerCase() : defaults.style;

  // Try to extract aspect ratio from the raw text
  const arMatch = raw.match(/\b(\d+:\d+)\b/);
  const aspectRatio = arMatch ? arMatch[1] : defaults.aspectRatio;

  return {
    prompt: raw,
    alt: raw.slice(0, 200),
    style,
    aspectRatio,
    textOverlay: null,
    colorPalette: ["#7C3AED", "#EC4899", "#FFFFFF"],
  };
}

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
        imagePrompt: toImagePromptData(p.imagePrompt, p.platform),
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
