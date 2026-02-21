import { NextRequest, NextResponse } from "next/server";
import { invokeAgent } from "@/lib/agents/invoke";

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

    const result = await invokeAgent(
      { agentId: "content-engine", message: prompt },
      { systemPromptOverride: "You are a visual creative director. Return only valid JSON, no markdown." }
    );

    // Parse the JSON response
    const cleaned = result.response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const imageData = JSON.parse(cleaned);

    return NextResponse.json(imageData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image prompt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
