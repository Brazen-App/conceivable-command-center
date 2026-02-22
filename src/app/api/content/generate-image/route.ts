import { NextRequest, NextResponse } from "next/server";
import { invokeAgent } from "@/lib/agents/invoke";
import { ContentPlatform } from "@/types";

const PLATFORM_IMAGE_DEFAULTS: Record<ContentPlatform, { style: string; aspectRatio: string }> = {
  linkedin: { style: "photography", aspectRatio: "1:1" },
  "instagram-post": { style: "photography", aspectRatio: "1:1" },
  "instagram-carousel": { style: "illustration", aspectRatio: "1:1" },
  x: { style: "photography", aspectRatio: "16:9" },
  pinterest: { style: "infographic", aspectRatio: "2:3" },
  tiktok: { style: "photography", aspectRatio: "9:16" },
  youtube: { style: "photography", aspectRatio: "16:9" },
  blog: { style: "photography", aspectRatio: "16:9" },
};

function buildFallbackPrompt(platform: string, topic: string) {
  const defaults = PLATFORM_IMAGE_DEFAULTS[platform as ContentPlatform] ?? { style: "photography", aspectRatio: "1:1" };
  return {
    prompt: `Professional ${defaults.style} for ${platform} about "${topic}". Conceivable brand colors: deep purple (#7C3AED), soft pink (#EC4899), warm white. Modern, clean, science-meets-warmth aesthetic — think Glossier meets medical journal. Target audience: women 20-40. High quality, well-lit, empowering mood.`,
    alt: `${platform} visual for ${topic}`,
    style: defaults.style,
    aspectRatio: defaults.aspectRatio,
    textOverlay: null,
    colorPalette: ["#7C3AED", "#EC4899", "#FFFFFF"],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, topic, contentBody } = body;

    if (!platform || !topic) {
      return NextResponse.json(
        { error: "platform and topic are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a creative director for Conceivable, a women's health brand.
Brand colors: deep purple (#7C3AED), soft pink (#EC4899), warm white, sage green accents.
Brand feel: Modern, clean, science-meets-warmth. Think Glossier meets medical journal.
Target audience: women 20-40.

Generate a detailed image prompt for a ${platform} visual about: "${topic}"

Content context:
${contentBody?.slice(0, 500) ?? ""}

Return ONLY a JSON object (no markdown, no code fences) with these fields:
{
  "prompt": "A detailed, production-ready image generation prompt (for DALL-E/Midjourney/Canva). Be specific about composition, colors, style, mood, lighting, and any text overlays.",
  "alt": "Accessible alt text for the image",
  "style": "photography | illustration | infographic | typography",
  "aspectRatio": "1:1 | 4:5 | 16:9 | 9:16 | 2:3",
  "textOverlay": "Any text that should appear on the image, or null",
  "colorPalette": ["#hex1", "#hex2", "#hex3"]
}`;

    try {
      const result = await invokeAgent(
        { agentId: "content-engine", message: prompt },
        { systemPromptOverride: "You are a visual creative director. Return only valid JSON, no markdown." }
      );

      // Parse the JSON response
      let cleaned = result.response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      // Try to extract a JSON object if surrounded by text
      const objMatch = cleaned.match(/\{[\s\S]*\}/);
      if (objMatch) {
        cleaned = objMatch[0];
      }
      const imageData = JSON.parse(cleaned);

      return NextResponse.json(imageData);
    } catch {
      // AI returned non-JSON or demo mode — return a platform-appropriate fallback
      return NextResponse.json(buildFallbackPrompt(platform, topic));
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
