// ── Stories Strategy — Morning + Evening stories for IG & TikTok ──

import { invokeAgent } from "@/lib/agents/invoke";

export type StorySlot = "morning" | "evening";
export type StoryType = "tip" | "poll" | "quiz" | "motivation" | "behind-scenes" | "data-nugget" | "ask-me";

export interface StoryContent {
  slot: StorySlot;
  type: StoryType;
  headline: string;
  subtext?: string;
  ctaText?: string;
  pollOptions?: string[];
  quizAnswer?: number;
  imagePrompt: string;
  platform: "instagram-story" | "tiktok";
}

const MORNING_TYPES: StoryType[] = ["tip", "motivation", "data-nugget", "quiz"];
const EVENING_TYPES: StoryType[] = ["poll", "ask-me", "behind-scenes", "tip"];

const STORY_TYPE_PROMPTS: Record<StoryType, string> = {
  tip: `Create a quick fertility/wellness TIP.
Format:
HEADLINE: [max 8 words, punchy tip title]
SUBTEXT: [max 20 words, the actual tip]
CTA: [short call to action, 5-8 words]

Example: HEADLINE: Your morning matters more than you think
SUBTEXT: 10 minutes of sunlight before 9am helps regulate your cycle hormones
CTA: Try it tomorrow and tell us how it goes`,

  motivation: `Create an uplifting MOTIVATION message for women on their fertility journey.
Format:
HEADLINE: [max 8 words, affirmation or empowering statement]
SUBTEXT: [max 20 words, why this matters]
CTA: [short encouragement, 5-8 words]

This should feel like a warm text from your best friend who believes in you.
Example: HEADLINE: Your body is on your side
SUBTEXT: Every cycle is your body trying. That deserves respect, not frustration.
CTA: Screenshot this for the hard days`,

  "data-nugget": `Share ONE surprising fertility/health STATISTIC.
Format:
HEADLINE: [the stat itself, max 8 words]
SUBTEXT: [max 20 words, what it means for them]
CTA: [short action step, 5-8 words]

The stat should make people stop and think. "Wait, really?"
Example: HEADLINE: 1 in 4 cycles has no ovulation
SUBTEXT: Even if your period shows up, it doesn't mean you ovulated. Your Halo Ring tracks this.
CTA: Know your body. Link in bio.`,

  quiz: `Create a fun QUIZ question about fertility or women's health.
Format:
HEADLINE: [the quiz question, max 8 words]
OPTION_A: [first answer option]
OPTION_B: [second answer option]
OPTION_C: [third answer option]
ANSWER: [A, B, or C]
SUBTEXT: [max 20 words, explanation of correct answer]

Make it educational but fun, not intimidating.
Example: HEADLINE: How long does an egg live after ovulation?
OPTION_A: 6-8 hours
OPTION_B: 12-24 hours
OPTION_C: 48-72 hours
ANSWER: B
SUBTEXT: Your egg only lives 12-24 hours. That's why timing matters so much.`,

  poll: `Create an engaging POLL question for the community.
Format:
HEADLINE: [poll question, max 8 words]
OPTION_A: [first option - relatable]
OPTION_B: [second option - also relatable]
SUBTEXT: [max 15 words, why you're asking]

The poll should feel safe, fun, and create connection. No wrong answers.
Example: HEADLINE: Your TTC guilty pleasure?
OPTION_A: Googling symptoms at 2am
OPTION_B: Taking tests way too early
SUBTEXT: No judgment here. We've all been there.`,

  "ask-me": `Create an ASK ME ANYTHING prompt.
Format:
HEADLINE: [the question prompt, max 8 words]
SUBTEXT: [max 20 words, what kind of questions you want]
CTA: [encouragement to ask, 5-8 words]

Position this as Kirsten (founder, 20 years fertility expert) answering questions.
Example: HEADLINE: Ask me anything about supplements
SUBTEXT: I've been formulating fertility supplements for 20 years. No question is too basic.
CTA: Drop your question. I'll answer tonight.`,

  "behind-scenes": `Create a BEHIND THE SCENES moment from building Conceivable.
Format:
HEADLINE: [what's happening, max 8 words]
SUBTEXT: [max 20 words, the real, authentic detail]
CTA: [invitation to join the journey, 5-8 words]

This should feel real and founder-authentic. Not polished, not corporate.
Example: HEADLINE: Late night testing the Halo Ring
SUBTEXT: We just hit a breakthrough with sleep tracking accuracy. I may have cried a little.
CTA: 500 founding members get it first`,
};

const BRAND_STORY_CONTEXT = `You are creating Instagram/TikTok Story content for Conceivable, a fertility health company.
Founder: Kirsten Karchmer (20 years clinical experience, board-certified, cool-aunt energy).
Products: AI-powered app, personalized supplement packs, the Halo Ring (wearable). AI coach = Kai.
Brand: Warm, intelligent, empowering. Science-backed but never clinical.
NEVER make unsubstantiated health claims. Use "may support" and "research suggests."
Founding member spots = 500.`;

export function generateStoryPrompt(slot: StorySlot, type: StoryType, topic?: string): string {
  const typePrompt = STORY_TYPE_PROMPTS[type];
  const topicLine = topic ? `\nTOPIC TO WORK WITH: ${topic}\n` : "\nChoose a relevant fertility/wellness topic.\n";

  return `${BRAND_STORY_CONTEXT}

Create a ${slot === "morning" ? "MORNING (energy, value, start the day)" : "EVENING (engagement, connection, wind down)"} story.
${topicLine}
${typePrompt}

Output ONLY the formatted fields (HEADLINE, SUBTEXT, CTA, etc.) — no extra text.
Keep it SHORT. Stories are glanced at for 3-5 seconds max.`;
}

export function parseStoryResponse(response: string, slot: StorySlot, type: StoryType): Partial<StoryContent> {
  const lines = response.split("\n").map((l) => l.trim()).filter(Boolean);
  const fields: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^(HEADLINE|SUBTEXT|CTA|OPTION_A|OPTION_B|OPTION_C|ANSWER)\s*[:\-—]\s*(.+)/i);
    if (match) {
      fields[match[1].toUpperCase()] = match[2].trim();
    }
  }

  const result: Partial<StoryContent> = {
    slot,
    type,
    headline: fields.HEADLINE || lines[0]?.slice(0, 50) || "Story",
    subtext: fields.SUBTEXT,
    ctaText: fields.CTA,
  };

  if (type === "poll" || type === "quiz") {
    const options = [fields.OPTION_A, fields.OPTION_B, fields.OPTION_C].filter(Boolean) as string[];
    if (options.length >= 2) result.pollOptions = options;
    if (fields.ANSWER) {
      const answerMap: Record<string, number> = { A: 0, B: 1, C: 2 };
      result.quizAnswer = answerMap[fields.ANSWER.toUpperCase()] ?? 0;
    }
  }

  return result;
}

function buildStoryImagePrompt(slot: StorySlot, type: StoryType, headline: string): string {
  const moodMap: Record<StoryType, string> = {
    tip: "Clean, educational. Soft gradient background. Modern and informative.",
    motivation: "Warm, uplifting. Soft golden light, hopeful mood. Sunrise vibes.",
    "data-nugget": "Bold, attention-grabbing. Clean scientific feel but warm. Interesting visual.",
    quiz: "Fun, interactive. Bright brand colors. Playful but smart.",
    poll: "Engaging, community-feel. Warm, inclusive. Inviting participation.",
    "ask-me": "Personal, authentic. Behind-the-desk or cozy setting. Expert but approachable.",
    "behind-scenes": "Raw, authentic. Real workspace, real moments. Startup energy.",
  };

  return `Vertical story image (9:16, 1080x1920) for Conceivable fertility health brand.

Context: ${headline}
Mood: ${moodMap[type]}
Time of day: ${slot === "morning" ? "Morning light, fresh, energizing" : "Evening warmth, cozy, reflective"}

Colors: Conceivable brand — Blue #5A6FFF, Baby Blue #ACB7FF, Pink #E37FB1, Off-White #F9F7F0
Gradient background using 3 adjacent brand colors.

CRITICAL:
- DO NOT include ANY text, words, letters, or typography in the image
- Vertical format (9:16) — designed for Stories
- No garbled text, no fake words
- Modern, warm, premium health brand aesthetic
- Target: women 25-42
- Photo-realistic quality`;
}

/**
 * Generate a pair of daily stories (morning + evening).
 */
export async function generateDailyStories(topic?: string): Promise<StoryContent[]> {
  const today = new Date();
  const dayIndex = today.getDay(); // Cycle through types by day

  const morningType = MORNING_TYPES[dayIndex % MORNING_TYPES.length];
  const eveningType = EVENING_TYPES[dayIndex % EVENING_TYPES.length];

  const stories: StoryContent[] = [];

  for (const { slot, type } of [
    { slot: "morning" as StorySlot, type: morningType },
    { slot: "evening" as StorySlot, type: eveningType },
  ]) {
    try {
      const prompt = generateStoryPrompt(slot, type, topic);
      const result = await invokeAgent({ agentId: "content-engine", message: prompt });
      const parsed = parseStoryResponse(result.response, slot, type);

      stories.push({
        slot,
        type,
        headline: parsed.headline || "Story",
        subtext: parsed.subtext,
        ctaText: parsed.ctaText,
        pollOptions: parsed.pollOptions,
        quizAnswer: parsed.quizAnswer,
        imagePrompt: buildStoryImagePrompt(slot, type, parsed.headline || ""),
        platform: "instagram-story",
      });
    } catch (err) {
      console.error(`[stories] Failed to generate ${slot} story:`, err);
    }
  }

  return stories;
}
