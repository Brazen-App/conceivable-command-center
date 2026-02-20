import { NextResponse } from "next/server";
import { invokeAgent } from "@/lib/agents/invoke";
import { v4 as uuid } from "uuid";

export async function POST() {
  try {
    const prompt = `Find the top 3 viral posts from today across TikTok, Instagram, and X/Twitter that are relevant to Conceivable's topics: fertility, women's health, PCOS, endometriosis, wellness, AI in healthcare.

For each post provide:
- A title (the hook or first line)
- The platform it's from
- The full content/script of the post
- The opening hook
- A detailed analysis of WHY it went viral (be specific about psychology, structure, algorithm triggers)
- Emotional triggers it uses (as an array)
- The content format (personal-story, listicle-carousel, thread, hot-take, educational, etc.)
- Estimated engagement metrics (views, likes, comments, shares as strings like "2.1M")

Respond with a JSON array of 3 posts. Each post should have: title, platform, sourceUrl (use a plausible URL), content, hook, whyViral, emotionalTriggers (array), format, metrics (object with views, likes, comments, shares).

Return ONLY the JSON array, no other text.`;

    const result = await invokeAgent({
      agentId: "content-engine",
      message: prompt,
    });

    const parsed = JSON.parse(result.response);
    const posts = parsed.map((p: Record<string, unknown>) => ({
      id: uuid(),
      title: p.title ?? "",
      platform: p.platform ?? "Unknown",
      sourceUrl: p.sourceUrl ?? "#",
      content: p.content ?? "",
      hook: p.hook ?? p.title ?? "",
      whyViral: p.whyViral ?? "",
      emotionalTriggers: (p.emotionalTriggers as string[]) ?? [],
      format: p.format ?? "unknown",
      metrics: (p.metrics as Record<string, string>) ?? {
        views: "—",
        likes: "—",
        comments: "—",
        shares: "—",
      },
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch viral posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
