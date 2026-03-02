import { NextRequest, NextResponse } from "next/server";
import { invokeAgent } from "@/lib/agents/invoke";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  // Fetch page content with 10s timeout
  let pageText = "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ConceivableBot/1.0; +https://conceivable.com)",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const html = await response.text();
    // Strip HTML tags for a rough text extraction
    pageText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000); // Cap content to avoid excessive token usage
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch URL — request timed out or network error" },
      { status: 502 }
    );
  }

  // Summarize with AI
  try {
    const result = await invokeAgent({
      agentId: "content-engine",
      message: `Summarize the following web page content in the context of Conceivable, a fertility health technology company building an AI-powered closed-loop system. Focus on what's relevant to fertility science, women's health, competitor intelligence, market opportunity, or content creation opportunities.

URL: ${url}

Page content:
"""
${pageText}
"""

Return a JSON object with:
{
  "title": "page title or best guess",
  "summary": "2-3 sentence summary focused on Conceivable relevance",
  "relevance": "high" | "medium" | "low",
  "suggestedDepartment": "content-engine" | "research" | "fundraising-intel" | "legal-review" | "email-inspiration" | "ideas-parking-lot",
  "tags": ["array", "of", "relevant", "tags"]
}`,
    });

    const parsed = JSON.parse(result.response);
    return NextResponse.json(parsed);
  } catch {
    // AI summary failed — return basic info
    return NextResponse.json({
      title: url,
      summary: "AI summary unavailable — link saved for review.",
      relevance: "unknown",
      suggestedDepartment: "ideas-parking-lot",
      tags: [],
    });
  }
}
