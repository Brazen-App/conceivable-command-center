import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/integrations/nano-banana";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateImage({
      prompt,
      aspectRatio: aspectRatio ?? "1:1",
      style: style ?? "photography",
    });

    return NextResponse.json({
      imageData: `data:${result.mimeType};base64,${result.base64}`,
      mimeType: result.mimeType,
      alt: result.alt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
