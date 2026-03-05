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

const IMAGE_PROMPT_INSTRUCTION = `

At the very end of your response, add a section starting with "---IMAGE_PROMPT---" followed by a detailed image generation prompt for this platform's visual. Include:
- Detailed visual description (composition, subject, lighting, mood)
- Brand colors to use: purple (#7C3AED), pink (#EC4899), white, sage green (#10B981)
- Style (photography, illustration, infographic, or typography)
- Aspect ratio for the platform
- Any text overlay that should appear on the image
- The image should feel premium, modern, and empowering — think Glossier meets medical journal`;

const PLATFORM_PROMPTS: Record<ContentPlatform, string> = {
  linkedin: `Write a LinkedIn post (thought leadership, long-form, narrative-driven).
Include a compelling hook in the first line — something that makes people stop scrolling. Make it personal and insightful.
Aim for 1000-1500 characters. Include a clear CTA.${IMAGE_PROMPT_INSTRUCTION}`,

  "instagram-post": `Write an Instagram post with a branded caption.
Include the main message, storytelling element, and relevant hashtags.
Keep it concise but impactful.${IMAGE_PROMPT_INSTRUCTION}`,

  "instagram-carousel": `Write an Instagram carousel (multi-slide format).
Provide content for 5-7 slides:
- Slide 1: Hook/headline that stops scrolling
- Slides 2-5: Key points with compelling copy
- Slide 6: Summary/takeaway
- Final slide: CTA
Include a caption with hashtags.${IMAGE_PROMPT_INSTRUCTION}`,

  pinterest: `Write a Pinterest pin description optimized for search.
Include relevant keywords for women's health, fertility, and wellness.
Write a compelling title and description.${IMAGE_PROMPT_INSTRUCTION}`,

  tiktok: `Write a TikTok script (45-60 seconds) for the founder to film.

CRITICAL — The hook (first 3 seconds) makes or breaks the video. Write 3 hook options using proven viral formats:
- Option A: Personal authority hook ("I'm a women's health founder and...")
- Option B: POV/trend hook ("POV: you just found out that...")
- Option C: Pattern interrupt hook ("Stop scrolling if..." / direct-to-camera challenge)

Then include:
- [3-8s] The reveal — transition into the topic with energy and movement
- [8-20s] The breakdown — 3 key points, use hand gestures, count on fingers, quick cuts
- [20-35s] The founder's take — raw, passionate, unscripted energy about their POV
- [35-50s] The actionable — "So what can you actually DO?" with 3 concrete steps
- [50-60s] CTA — "Follow for more" with point-to-camera

VISUAL DIRECTIONS throughout: camera angles, movement, where to cut, caption style, lighting notes.
Keep the language conversational — how a real person talks, not how a brand writes.${IMAGE_PROMPT_INSTRUCTION}`,

  youtube: `Write a YouTube long-form video script (8-12 minutes).

CRITICAL — Start with a COLD OPEN (pre-title hook, 5-10 seconds). This is the most important part. Use one of these formats:
- Dramatic statement: "There's a study that just came out that changes everything..."
- Direct challenge: "Your doctor probably hasn't told you this yet..."
- Story hook: "Last week I got a message from a woman who..."

Then include:
- [0:05-0:15] Title card / branded intro
- [0:15-0:45] Full hook + context — excited energy, like telling a friend something important
- Section 1 (2-3 min): The research — study details, on-screen graphics, what makes this different
- Section 2 (2-3 min): Why this matters — personal connection, address misconceptions, real examples
- Section 3 (2-3 min): What you can do — 3-5 numbered actionable steps, demonstrate where possible
- Section 4 (1-2 min): Bigger picture — connect to Conceivable's mission
- Outro (1 min): Q&A prompt, subscribe CTA, preview next video

Include: B-roll suggestions for each section, thumbnail concept (must be click-worthy), full video description with timestamps.${IMAGE_PROMPT_INSTRUCTION}`,

  blog: `Write an SEO + GEO optimized blog post.
Include:
- Title (H1) with primary keyword
- Meta description
- Introduction with hook
- 3-5 H2 sections with substantive content
- Internal linking suggestions
- Conclusion with CTA
- Focus keywords and secondary keywords
Target 1500-2500 words.${IMAGE_PROMPT_INSTRUCTION}`,
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

  // Generate content for each platform — individual failures don't crash the batch
  for (const platform of PLATFORMS) {
    try {
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

      const { content, imagePrompt } = extractImagePrompt(result.response);

      pieces.push({
        id: uuid(),
        platform,
        title: `${topic} — ${platform}`,
        body: content,
        imagePrompt: imagePrompt || undefined,
        hashtags: extractHashtags(content),
        status: "draft",
        sourceStoryId,
        founderPov: founderAngle,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error(`Content generation failed for platform ${platform}:`, err);
      // Push a failed piece so the user knows which platform had issues
      pieces.push({
        id: uuid(),
        platform,
        title: `${topic} — ${platform}`,
        body: `Content generation for ${platform} encountered an issue. Please try regenerating this piece.`,
        hashtags: [],
        status: "draft",
        sourceStoryId,
        founderPov: founderAngle,
        createdAt: new Date(),
      });
    }
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

  const { content, imagePrompt } = extractImagePrompt(result.response);

  return {
    id: uuid(),
    platform,
    title: `${topic} — ${platform}`,
    body: content,
    imagePrompt: imagePrompt || undefined,
    hashtags: extractHashtags(content),
    status: "draft",
    founderPov: founderAngle,
    createdAt: new Date(),
  };
}

function extractImagePrompt(text: string): { content: string; imagePrompt: string | null } {
  const separator = "---IMAGE_PROMPT---";
  const idx = text.indexOf(separator);
  if (idx === -1) {
    return { content: text, imagePrompt: null };
  }
  return {
    content: text.slice(0, idx).trim(),
    imagePrompt: text.slice(idx + separator.length).trim(),
  };
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches)] : [];
}
