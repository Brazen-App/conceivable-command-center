import { NextRequest, NextResponse } from "next/server";
import { publishBatch } from "@/lib/integrations/social-publisher";
import { ContentPlatform } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pieces, tokens } = body;

    if (!pieces || !Array.isArray(pieces) || pieces.length === 0) {
      return NextResponse.json(
        { error: "pieces[] is required" },
        { status: 400 }
      );
    }

    if (!tokens || typeof tokens !== "object") {
      return NextResponse.json(
        { error: "tokens object is required" },
        { status: 400 }
      );
    }

    const publishRequests = pieces.map(
      (p: { platform: ContentPlatform; text: string; imageUrl?: string; alt?: string; meta?: Record<string, string> }) => ({
        platform: p.platform,
        text: p.text,
        imageUrl: p.imageUrl,
        alt: p.alt,
        meta: p.meta,
      })
    );

    const results = await publishBatch(publishRequests, tokens);

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      results,
      summary: `${successCount}/${results.length} pieces published`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
