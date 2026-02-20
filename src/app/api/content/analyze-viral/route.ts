import { NextRequest, NextResponse } from "next/server";
import { analyzeViralContent } from "@/lib/pipelines/viral-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform, content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const insight = await analyzeViralContent(
      url ?? "",
      platform ?? "unknown",
      content
    );

    return NextResponse.json(insight);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
