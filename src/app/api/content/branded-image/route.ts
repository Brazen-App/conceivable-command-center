import { NextResponse } from "next/server";
import { generateBrandedImage, type TemplateName } from "@/lib/integrations/branded-image";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const VALID_TEMPLATES: TemplateName[] = [
  "stat-bomb", "split", "editorial", "data-card",
  "quote", "breakdown", "gradient-moment", "story-frame",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, platform, template, accentColor, subtitle, stat, statLabel, leftText, rightText, points, attribution } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Missing required field: topic" },
        { status: 400 }
      );
    }

    if (template && !VALID_TEMPLATES.includes(template)) {
      return NextResponse.json(
        { error: `Invalid template. Valid options: ${VALID_TEMPLATES.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await generateBrandedImage({
      topic,
      platform: platform || "instagram-post",
      template,
      accentColor,
      subtitle,
      stat,
      statLabel,
      leftText,
      rightText,
      points,
      attribution,
    });

    return NextResponse.json({
      imageData: `data:${result.mimeType};base64,${result.base64}`,
      mimeType: result.mimeType,
      template: template || "auto",
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
