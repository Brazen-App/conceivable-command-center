import { NextRequest, NextResponse } from "next/server";
import { createContentPage } from "@/lib/integrations/notion";

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-notion-token");

  if (!token) {
    return NextResponse.json(
      { error: "x-notion-token header is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { databaseId, title, platform, status, content, hashtags } = body;

    if (!databaseId || !title || !content) {
      return NextResponse.json(
        { error: "databaseId, title, and content are required" },
        { status: 400 }
      );
    }

    const page = await createContentPage(token, databaseId, {
      title,
      platform: platform ?? "general",
      status: status ?? "Draft",
      body: content,
      hashtags,
    });

    return NextResponse.json({
      success: true,
      pageId: page.id,
      url: page.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync to Notion";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
