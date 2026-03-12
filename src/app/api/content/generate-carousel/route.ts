import { NextRequest, NextResponse } from "next/server";
import { generateSinglePiece } from "@/lib/pipelines/content-creation";
import { parseCarouselSlides, generateConsistentCarouselPrompts } from "@/lib/pipelines/carousel-parser";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/content/generate-carousel
 * Generates carousel content with parsed individual slides.
 * Body: { topic, founderAngle }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, founderAngle } = body;

    if (!topic || !founderAngle) {
      return NextResponse.json({ error: "topic and founderAngle are required" }, { status: 400 });
    }

    // Generate carousel content using the content pipeline
    const piece = await generateSinglePiece(topic, founderAngle, "instagram-carousel");

    // Parse into individual slides
    const parsed = parseCarouselSlides(piece.body);

    // Generate consistent image prompts across all slides
    const slidesWithPrompts = generateConsistentCarouselPrompts(parsed.slides, topic);

    return NextResponse.json({
      topic,
      slideCount: slidesWithPrompts.length,
      slides: slidesWithPrompts,
      caption: parsed.caption,
      hashtags: parsed.hashtags.length > 0 ? parsed.hashtags : piece.hashtags,
      rawBody: piece.body,
    });
  } catch (err) {
    console.error("Carousel generation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Carousel generation failed" },
      { status: 500 }
    );
  }
}
