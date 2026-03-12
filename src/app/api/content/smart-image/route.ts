import { NextResponse } from "next/server";
import { generateSmartImage } from "@/lib/integrations/nano-banana";
import { overlayTitleOnImage } from "@/lib/integrations/image-overlay";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, content, platform, topic, customPrompt, feedback, previousPrompt, title, skipOverlay } = body;

    if (!content || !platform || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: content, platform, topic" },
        { status: 400 }
      );
    }

    const result = await generateSmartImage({
      content,
      topic,
      platform,
      customPrompt: action === "regenerate" ? customPrompt : undefined,
      feedback: action === "feedback" ? feedback : undefined,
      previousPrompt: action === "feedback" ? previousPrompt : undefined,
    });

    // Overlay title text on the image (unless explicitly skipped)
    let finalBase64 = result.base64;
    let finalMimeType = result.mimeType;
    const overlayTitle = title || topic;

    if (!skipOverlay && overlayTitle) {
      try {
        const aspectRatio = result.platformSpec?.aspectRatio || "1:1";
        const overlaid = await overlayTitleOnImage({
          title: overlayTitle,
          imageBase64: result.base64,
          imageMimeType: result.mimeType,
          aspectRatio,
        });
        finalBase64 = overlaid.base64;
        finalMimeType = overlaid.mimeType;
      } catch (overlayErr) {
        // If overlay fails, return the image without text rather than failing entirely
        console.error("Text overlay failed, returning base image:", overlayErr);
      }
    }

    return NextResponse.json({
      imageData: `data:${finalMimeType};base64,${finalBase64}`,
      prompt: result.prompt,
      contentType: result.contentType,
      platformSpec: result.platformSpec,
      mimeType: finalMimeType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Smart image generation error:", message);
    return NextResponse.json(
      { error: message, details: err instanceof Error ? err.stack : undefined },
      { status: 500 }
    );
  }
}
