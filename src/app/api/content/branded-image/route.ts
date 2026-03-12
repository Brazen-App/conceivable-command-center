import { NextResponse } from "next/server";
import { generateBrandedImage } from "@/lib/integrations/branded-image";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, platform, gradientFrom, gradientTo } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Missing required field: topic" },
        { status: 400 }
      );
    }

    const result = await generateBrandedImage({
      topic,
      platform: platform || "instagram-post",
      gradientFrom,
      gradientTo,
    });

    return NextResponse.json({
      imageData: `data:${result.mimeType};base64,${result.base64}`,
      mimeType: result.mimeType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Branded image generation error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
