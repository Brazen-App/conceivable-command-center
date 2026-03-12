import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/integrations/nano-banana";
import { overlayTitleOnImage } from "@/lib/integrations/image-overlay";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, style, title, skipOverlay } = body;

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

    let finalBase64 = result.base64;
    let finalMimeType = result.mimeType;

    // Overlay title if provided
    if (!skipOverlay && title) {
      try {
        const overlaid = await overlayTitleOnImage({
          title,
          imageBase64: result.base64,
          imageMimeType: result.mimeType,
          aspectRatio: aspectRatio ?? "1:1",
        });
        finalBase64 = overlaid.base64;
        finalMimeType = overlaid.mimeType;
      } catch (overlayErr) {
        console.error("Text overlay failed, returning base image:", overlayErr);
      }
    }

    return NextResponse.json({
      imageData: `data:${finalMimeType};base64,${finalBase64}`,
      mimeType: finalMimeType,
      alt: result.alt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
