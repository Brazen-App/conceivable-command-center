import { ContentBatch, ContentPiece, ContentPlatform } from "@/types";
import { invokeAgent } from "@/lib/agents/invoke";
import { v4 as uuid } from "uuid";

const PLATFORMS: ContentPlatform[] = [
  "linkedin",
  "instagram-post",
  "instagram-carousel",
  "pinterest",
  "tiktok",
  "youtube",
  "blog",
];

const PLATFORM_PROMPTS: Record<ContentPlatform, string> = {
  linkedin: `Write a LinkedIn post (thought leadership, long-form, narrative-driven).
Include a compelling hook in the first line. Make it personal and insightful.
Aim for 1000-1500 characters. Include a clear CTA.`,

  "instagram-post": `Write an Instagram post with a branded caption.
Include the main message, storytelling element, and relevant hashtags.
Keep it concise but impactful. Include an image concept description.`,

  "instagram-carousel": `Write an Instagram carousel (multi-slide format).
Provide content for 5-7 slides:
- Slide 1: Hook/headline that stops scrolling
- Slides 2-5: Key points with compelling copy
- Slide 6: Summary/takeaway
- Final slide: CTA
Include a caption with hashtags.`,

  pinterest: `Write a Pinterest pin description optimized for search.
Include relevant keywords for women's health, fertility, and wellness.
Write a compelling title and description. Include image concept.`,

  tiktok: `Write a TikTok script for the founder to film.
Include:
- Hook (first 3 seconds)
- Main talking points with timestamps
- Visual/action directions
- Trending audio suggestions if applicable
- CTA
Keep it under 60 seconds.`,

  youtube: `Write a YouTube long-form video script.
Include:
- Title (SEO optimized)
- Thumbnail concept
- Intro hook (first 30 seconds)
- Main sections with talking points
- B-roll suggestions
- Outro with CTA
- Video description with timestamps and keywords
Aim for 8-12 minutes of content.`,

  blog: `Write an SEO + GEO optimized blog post.
Include:
- Title (H1) with primary keyword
- Meta description
- Introduction with hook
- 3-5 H2 sections with substantive content
- Internal linking suggestions
- Conclusion with CTA
- Focus keywords and secondary keywords
Target 1500-2500 words. Include image concept for header.`,
};

/**
 * Generate a full content batch across all platforms
 * from a selected topic and the founder's angle/POV.
 */
export async function generateContentBatch(
  topic: string,
  founderAngle: string,
  sourceStoryId?: string
): Promise<ContentBatch> {
  const batchId = uuid();

  const pieces: ContentPiece[] = [];

  // Generate content for each platform
  for (const platform of PLATFORMS) {
    const prompt = `Topic: ${topic}

Founder's POV/Angle: ${founderAngle}

Brand: Conceivable — the first operating system for women's health. Pre-launch. App, supplements, wearable. Audience: women 20-40.
Brand tone: Intelligent, empowering, science-backed, warm — not clinical, not fluffy.

${PLATFORM_PROMPTS[platform]}

Write the content now. Be authentic to the founder's voice and angle.`;

    const result = await invokeAgent({
      agentId: "content-engine",
      message: prompt,
    });

    pieces.push({
      id: uuid(),
      platform,
      title: `${topic} — ${platform}`,
      body: result.response,
      hashtags: extractHashtags(result.response),
      status: "draft",
      sourceStoryId,
      founderPov: founderAngle,
      createdAt: new Date(),
    });
  }

  return {
    id: batchId,
    topic,
    founderAngle,
    pieces,
    sourceStoryId,
    createdAt: new Date(),
    status: "in-review",
  };
}

/**
 * Generate content for a single platform.
 */
export async function generateSinglePiece(
  topic: string,
  founderAngle: string,
  platform: ContentPlatform
): Promise<ContentPiece> {
  const prompt = `Topic: ${topic}

Founder's POV/Angle: ${founderAngle}

Brand: Conceivable — the first operating system for women's health. Pre-launch. App, supplements, wearable. Audience: women 20-40.
Brand tone: Intelligent, empowering, science-backed, warm — not clinical, not fluffy.

${PLATFORM_PROMPTS[platform]}

Write the content now. Be authentic to the founder's voice and angle.`;

  const result = await invokeAgent({
    agentId: "content-engine",
    message: prompt,
  });

  return {
    id: uuid(),
    platform,
    title: `${topic} — ${platform}`,
    body: result.response,
    hashtags: extractHashtags(result.response),
    status: "draft",
    founderPov: founderAngle,
    createdAt: new Date(),
  };
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches)] : [];
}
