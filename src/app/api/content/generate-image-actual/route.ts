import { NextRequest, NextResponse } from "next/server";
import { generateBrandedImage } from "@/lib/integrations/branded-image";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, platform, topic, title } = body;

    // Use branded image generation (Satori + Sharp — no external API, on-brand)
    const displayTitle = title || topic || prompt?.slice(0, 60) || "Conceivable";

    const result = await generateBrandedImage({
      topic: displayTitle,
      platform: platform || "instagram-post",
    });

    return NextResponse.json({
      imageData: `data:${result.mimeType};base64,${result.base64}`,
      mimeType: result.mimeType,
      alt: `Branded image for ${displayTitle}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
