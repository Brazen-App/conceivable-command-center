import { NextResponse } from "next/server";
import { generateBrandedImage } from "@/lib/integrations/branded-image";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, topic, title } = body;

    if (!platform || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: platform, topic" },
        { status: 400 }
      );
    }

    // Use branded image generation (Satori + Sharp — no external API, instant, on-brand)
    // Pass through any template-specific options from the request
    const result = await generateBrandedImage({
      topic: title || topic,
      platform,
      template: body.template,
      accentColor: body.accentColor,
      subtitle: body.subtitle,
      stat: body.stat,
      statLabel: body.statLabel,
      leftText: body.leftText,
      rightText: body.rightText,
      points: body.points,
      attribution: body.attribution,
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
