import { ContentBatch, ContentPiece, ContentPlatform } from "@/types";
import { invokeAgent } from "@/lib/agents/invoke";
import { v4 as uuid } from "uuid";
import { applyTemplate } from "./content-templates";

const PLATFORMS: ContentPlatform[] = [
  "linkedin",
  "instagram-post",
  "pinterest",
  "youtube",
  "tiktok",
  "blog",
  "circle",
];

// ── Brand Guidelines (from official Conceivable Brand Book) ──

const BRAND_CONTEXT = `
BRAND: Conceivable — the first operating system for women's health.
Pre-launch phase. Products: AI-powered app, personalized supplement packs, the Halo Ring (wearable).
Audience: Women 25-42 trying to conceive or optimize fertility.

BRAND VOICE: Warm, intelligent, empowering. Like talking to the most emotionally intelligent doctor you've ever met.
Think: smart cool aunt energy. Cheeky but trustworthy. Science-backed but never clinical.
Short paragraphs, breathing room. Parenthetical asides are great.

BRAND COLORS (use in image prompts):
- Primary: Blue #5A6FFF, Baby Blue #ACB7FF, Off-White #F9F7F0
- Secondary: Yellow #F1C028, Green #1EAA55, Pink #E37FB1, Pale Blue #78C3BF, Purple #9686B9, Navy #356FB6
- Gradients: Pick 3 adjacent colors from palette for gradient backgrounds

CRITICAL RULES:
- The ring = "the Halo Ring" or "your Halo Ring" (never just "the ring")
- The score = "Conceivable Score" (never "CON Score")
- AI coach = Kai
- Founding member spots = 500
- Never make unsubstantiated health claims
`;

const IMAGE_PROMPT_INSTRUCTION = `

TITLE FOR IMAGE OVERLAY — REQUIRED:
Before the image prompt, add a line starting with "---OVERLAY_TITLE---" followed by a SHORT, hook-style title (3-7 words max) that will be overlaid on the image in bold uppercase.
- Must be punchy and scroll-stopping (like a magazine cover headline)
- 3-7 words MAXIMUM — it needs to be readable at a glance on a phone
- Should make the reader want to read the caption/post
- Examples: "YOUR EGGS ARE NOT EXPIRED" / "THE SLEEP FERTILITY LINK" / "STOP DOING THIS" / "WHAT YOUR RE WON'T TELL YOU" / "THE 3% THAT MATTERS"

At the very end of your response, add a section starting with "---IMAGE_PROMPT---" followed by a detailed image generation prompt. CRITICAL RULES FOR THE IMAGE PROMPT:
- DO NOT include any text/words/letters in the image — we add text programmatically afterward
- NO fake text, NO garbled letters, NO placeholder words in the image
- Use Conceivable brand colors: Blue #5A6FFF, Baby Blue #ACB7FF, Off-White #F9F7F0, with accents from Yellow #F1C028, Green #1EAA55, Pink #E37FB1
- Use gradient backgrounds with 3 adjacent brand colors (e.g., blue + baby blue + pale blue, or pink + purple + navy)
- Style: Modern, bold, optimistic. Science-backed but warm, not clinical
- Diverse representation (age, ethnicity, body types). Real authentic moments, not stock photo poses
- Mood: empowering, hopeful, intelligent
- Include platform aspect ratio`;

// ── Platform-Specific Prompts ──
// Each prompt includes formatting rules to prevent walls of text

const PLATFORM_PROMPTS: Record<ContentPlatform, string> = {
  linkedin: `Write a LinkedIn post (thought leadership, narrative-driven).

FORMATTING RULES — FOLLOW EXACTLY:
- Hook: 1-2 punchy sentences that stop scrolling (this is the most important part)
- Body: 3-4 short paragraphs, each 2-3 sentences max
- Use line breaks between paragraphs for readability
- End with a clear CTA (ask a question, encourage comment/share)
- Add exactly 5 hashtags on the LAST line, separated by spaces
- Hashtag format: #Conceivable plus 4 topic-relevant hashtags
- Total length: 1000-1500 characters
- NO markdown formatting (no **, no ##, no bullet points with *)
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  "instagram-post": `Write an Instagram caption.

FORMATTING RULES — FOLLOW EXACTLY:
- Hook: 1-2 sentences that grab attention (first line matters most)
- Body: 2-3 short paragraphs, each 2-3 sentences
- Use blank lines between paragraphs
- End with a CTA (question, "save this", "share with a friend")
- Last line: exactly 5 hashtags separated by spaces
- Hashtag format: #Conceivable plus 4 topic-relevant hashtags
- NO markdown formatting (no **, no ##, no bullet points)
- Keep it concise, personal, relatable
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  "instagram-carousel": `Write an Instagram carousel with caption.

FORMATTING RULES — FOLLOW EXACTLY:
Structure the content as slides clearly labeled:

SLIDE 1: [Bold hook/headline - the "stop scrolling" title]
SLIDE 2: [First key point - one idea, 2-3 sentences]
SLIDE 3: [Second key point]
SLIDE 4: [Third key point]
SLIDE 5: [Fourth key point]
SLIDE 6: [Summary/takeaway]
SLIDE 7: [CTA - follow, save, get the app]

Then write a CAPTION section separately:
- 2-3 sentences summarizing the carousel
- CTA encouraging saves/shares
- Exactly 5 hashtags on the last line

- NO markdown formatting (no **, no ##)
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  pinterest: `Write a Pinterest pin description optimized for search.

FORMATTING RULES — FOLLOW EXACTLY:
- Title: SEO-optimized, keyword-rich (under 100 chars)
- Description: 2-3 keyword-rich sentences about the topic
- Include fertility, women's health, wellness keywords naturally
- Last line: exactly 5 hashtags
- Hashtag format: #Conceivable plus 4 search-friendly hashtags
- NO markdown formatting
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  tiktok: `Write a TikTok script (45-60 seconds) for the founder to film.

FORMATTING RULES — FOLLOW EXACTLY:
Write the script as spoken words only (no stage directions in the final text).

HOOK (first 3 seconds — make it count):
Write ONE hook line using a proven format.

BODY (main content):
Write 3-4 short punchy paragraphs. Each is 1-2 sentences.
Conversational tone — how a real person talks, not how a brand writes.

CTA:
One line encouraging follow/comment.

CAPTION (separate section at end):
- 2-3 short punchy sentences
- Exactly 5 hashtags on last line
- Hashtag format: #Conceivable plus 4 trending/relevant hashtags

- NO markdown formatting (no **, no ##)
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  youtube: `Write a YouTube video script outline (8-12 minutes).

FORMATTING RULES — FOLLOW EXACTLY:
- COLD OPEN: 1-2 sentence hook
- INTRO: Brief context (2-3 sentences)
- SECTION 1: Research/facts (paragraph form, 3-5 sentences)
- SECTION 2: Why it matters (paragraph form, 3-5 sentences)
- SECTION 3: What to do (numbered action steps, plain text)
- SECTION 4: Bigger picture (2-3 sentences connecting to mission)
- OUTRO: CTA + next video teaser (2-3 sentences)
- VIDEO DESCRIPTION: Full description with timestamps

- NO markdown formatting (no **, no ##, no bullet points with *)
- Write in plain text only
- Include thumbnail concept description${IMAGE_PROMPT_INSTRUCTION}`,

  blog: `Write an SEO-optimized and GEO-optimized blog post (1500-2500 words).

SEO & GEO OPTIMIZATION RULES:
- Use the primary keyword in the title, first paragraph, and at least 2 section headings
- Include semantic variations and long-tail keywords naturally throughout
- Write for featured snippets: use clear definitions, numbered steps, and direct answers
- Structure content so AI engines (Google AI Overview, ChatGPT, Perplexity) can easily extract and cite it
- Include statistics, data points, and specific claims with context (these get cited by AI)
- Use question-based section headings where appropriate (matches voice search queries)

FORMATTING RULES — FOLLOW EXACTLY:
- Title: Primary keyword near the front
- Meta description: Under 160 chars, includes primary keyword and a compelling reason to click
- Introduction: Hook paragraph that directly answers the core question (featured snippet target)
- 3-5 sections with clear headings (use SECTION: prefix, not ## or **)
- Each section: 2-4 paragraphs of substantive content
- Include at least one numbered list or step-by-step section (Google loves these)
- Conclusion with CTA

FAQ SECTION — REQUIRED:
After the conclusion, include exactly this format:

FAQ:
Q: [Question using a natural search query related to the topic]
A: [Direct, concise answer in 2-3 sentences. Start with the answer, then elaborate.]

Q: [Another common question]
A: [Direct answer]

Q: [Third question]
A: [Direct answer]

Include 3-5 FAQ items. Questions should be real queries people search for. Answers should be direct and authoritative.

- Focus keywords and secondary keywords listed at end
- NO markdown formatting (no **, no ##, no bullet points with *)
- Use SECTION: prefix for headings instead of markdown
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,

  circle: `Write a community post for our Circle community.

TONE — THIS IS CRITICAL:
Write like Kirsten is mid-conversation with a friend she deeply respects. She's sharing something she's been thinking about — not announcing it, not teaching it, just... telling them. Like you're sitting across from someone at dinner and you lean in and say "ok so here's the thing..."

- Warm, real, a little vulnerable. This is the most intimate platform.
- Deeply trustworthy — 20 years of expertise showing through naturally, not stated
- NO "hey new members" or "welcome" energy. These people are already here. Talk to them like insiders.
- Start mid-thought, like picking up a conversation. Examples: "Something's been bugging me lately..." / "I had a patient years ago who..." / "Can we talk about something nobody talks about?"
- Parenthetical asides are great (you know, the kind that feel like an inside joke)

FORMATTING RULES — FOLLOW EXACTLY:
- Start with a mid-conversation opening — dive right in
- Main insight from the topic (2-3 short paragraphs, breathing room between them)
- End with a genuine question — not a "what do you think?" throwaway, but something you actually want to hear their answer to
- 200-400 words total
- NO hashtags (this is a community, not social media)
- NO markdown formatting (no **, no ##)
- Write in plain text only${IMAGE_PROMPT_INSTRUCTION}`,
};

// ── AI Formatting Cleanup ──

function removeAIFormatting(text: string): string {
  let cleaned = text;

  // Remove markdown bold
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  // Remove markdown italic
  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");
  // Remove markdown headers
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");
  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
  // Remove inline code
  cleaned = cleaned.replace(/`([^`]*)`/g, "$1");
  // Remove markdown bullet points (replace with plain dash or nothing)
  cleaned = cleaned.replace(/^[\s]*[-*]\s+/gm, "- ");
  // Remove numbered list markdown (1. 2. etc are fine, keep them)
  // Remove excessive line breaks (max 2)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  // Remove leading/trailing whitespace on each line
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
  // Trim
  cleaned = cleaned.trim();

  return cleaned;
}

// ── Hashtag Extraction & Enforcement ──

const TOPIC_HASHTAGS: Record<string, string[]> = {
  fertility: ["#FertilityJourney", "#TTC", "#FertilityHealth", "#TryingToConceive"],
  progesterone: ["#Progesterone", "#HormonalHealth", "#LutealPhase", "#HormoneBalance"],
  ovulation: ["#Ovulation", "#FertilityTracking", "#CycleTracking", "#OvulationTracking"],
  supplements: ["#FertilitySupplements", "#WomensHealth", "#NaturalFertility", "#SupplementStack"],
  ivf: ["#IVF", "#FertilityTreatment", "#IVFJourney", "#AssistedReproduction"],
  pcos: ["#PCOS", "#PCOSWarrior", "#HormonalHealth", "#PCOSFertility"],
  sleep: ["#SleepHealth", "#FertilitySleep", "#WellnessJourney", "#HealthyHabits"],
  nutrition: ["#FertilityNutrition", "#HealthyEating", "#WomensNutrition", "#NutrientDense"],
  stress: ["#StressManagement", "#MindBodyFertility", "#WellnessJourney", "#MentalHealth"],
  egg: ["#EggQuality", "#EggHealth", "#FertilityScience", "#ReproductiveHealth"],
  coq10: ["#CoQ10", "#EggQuality", "#FertilitySupplements", "#MitochondrialHealth"],
  default: ["#WomensHealth", "#FertilityJourney", "#TTC", "#ReproductiveHealth"],
};

function generateHashtags(topic: string, platform: string): string[] {
  if (platform === "circle") return []; // No hashtags for Circle

  const hashtags = ["#Conceivable"];
  const topicLower = topic.toLowerCase();

  // Find matching topic hashtags
  let matched = false;
  for (const [key, tags] of Object.entries(TOPIC_HASHTAGS)) {
    if (key !== "default" && topicLower.includes(key)) {
      hashtags.push(...tags.slice(0, 4));
      matched = true;
      break;
    }
  }

  if (!matched) {
    hashtags.push(...TOPIC_HASHTAGS.default);
  }

  // Ensure exactly 5 (or fewer for X/twitter)
  const limit = platform === "x" ? 2 : 5;
  return [...new Set(hashtags)].slice(0, limit);
}

function ensureHashtags(content: string, topic: string, platform: string): string {
  if (platform === "circle") return content;

  // Check if content already has hashtags at the end
  const existingHashtags = content.match(/#\w+/g);
  const hashtags = generateHashtags(topic, platform);

  if (existingHashtags && existingHashtags.length >= 3) {
    // Has hashtags already, ensure #Conceivable is included
    if (!content.includes("#Conceivable")) {
      return content.replace(/(#\w+)/, "#Conceivable $1");
    }
    return content;
  }

  // Add hashtags at the end
  return `${content.trimEnd()}\n\n${hashtags.join(" ")}`;
}

// ── Content Extraction ──

function extractImagePrompt(text: string): {
  content: string;
  imagePrompt: string | null;
  overlayTitle: string | null;
} {
  // Extract overlay title first
  let overlayTitle: string | null = null;
  const titleSeparator = "---OVERLAY_TITLE---";
  const titleIdx = text.indexOf(titleSeparator);
  let workingText = text;

  if (titleIdx !== -1) {
    const afterTitle = text.slice(titleIdx + titleSeparator.length);
    const titleEnd = afterTitle.indexOf("\n");
    overlayTitle = (titleEnd !== -1 ? afterTitle.slice(0, titleEnd) : afterTitle).trim();
    // Remove the title line from working text
    workingText = text.slice(0, titleIdx).trim() + "\n" + (titleEnd !== -1 ? afterTitle.slice(titleEnd + 1) : "");
  } else {
    // Try alternate formats the AI might use
    const altMatch = workingText.match(/OVERLAY[_ ]TITLE[:\s—-]+(.+)/i);
    if (altMatch) {
      overlayTitle = altMatch[1].trim();
      workingText = workingText.replace(altMatch[0], "").trim();
    }
  }

  // Extract image prompt
  const separator = "---IMAGE_PROMPT---";
  const idx = workingText.indexOf(separator);
  if (idx === -1) {
    const altIdx = workingText.indexOf("IMAGE_PROMPT");
    if (altIdx !== -1) {
      const lineStart = workingText.lastIndexOf("\n", altIdx);
      return {
        content: workingText.slice(0, lineStart).trim(),
        imagePrompt: workingText.slice(altIdx + "IMAGE_PROMPT".length).replace(/^[-:—\s]+/, "").trim(),
        overlayTitle,
      };
    }
    return { content: workingText, imagePrompt: null, overlayTitle };
  }
  return {
    content: workingText.slice(0, idx).trim(),
    imagePrompt: workingText.slice(idx + separator.length).trim(),
    overlayTitle,
  };
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g);
  return matches ? [...new Set(matches)] : [];
}

// ── Main Generation ──

export async function generateContentBatch(
  topic: string,
  founderAngle: string,
  sourceStoryId?: string,
  templateId?: string
): Promise<ContentBatch> {
  const batchId = uuid();
  const pieces: ContentPiece[] = [];

  for (const platform of PLATFORMS) {
    try {
      const templateContext = templateId ? `\n${applyTemplate(templateId, topic, founderAngle)}\n` : "";
      const prompt = `Topic: ${topic}

Founder's POV/Angle: ${founderAngle}
${templateContext}
${BRAND_CONTEXT}

${PLATFORM_PROMPTS[platform]}

Write the content now. Be authentic to the founder's voice and angle.
IMPORTANT: Output plain text only. No markdown symbols (**, ##, \`\`\`). No AI formatting.`;

      const result = await invokeAgent({
        agentId: "content-engine",
        message: prompt,
      });

      const { content, imagePrompt, overlayTitle } = extractImagePrompt(result.response);

      // Clean AI formatting artifacts
      let cleanContent = removeAIFormatting(content);

      // Ensure proper hashtags
      cleanContent = ensureHashtags(cleanContent, topic, platform);

      pieces.push({
        id: uuid(),
        platform,
        title: overlayTitle || `${topic} — ${platform}`,
        body: cleanContent,
        imagePrompt: imagePrompt || undefined,
        hashtags: extractHashtags(cleanContent),
        status: "draft",
        sourceStoryId,
        founderPov: founderAngle,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error(
        `Content generation failed for platform ${platform}:`,
        err
      );
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

export async function generateSinglePiece(
  topic: string,
  founderAngle: string,
  platform: ContentPlatform,
  templateId?: string
): Promise<ContentPiece> {
  const templateContext = templateId ? `\n${applyTemplate(templateId, topic, founderAngle)}\n` : "";
  const prompt = `Topic: ${topic}

Founder's POV/Angle: ${founderAngle}
${templateContext}
${BRAND_CONTEXT}

${PLATFORM_PROMPTS[platform]}

Write the content now. Be authentic to the founder's voice and angle.
IMPORTANT: Output plain text only. No markdown symbols (**, ##, \`\`\`). No AI formatting.`;

  const result = await invokeAgent({
    agentId: "content-engine",
    message: prompt,
  });

  const { content, imagePrompt, overlayTitle } = extractImagePrompt(result.response);
  let cleanContent = removeAIFormatting(content);
  cleanContent = ensureHashtags(cleanContent, topic, platform);

  return {
    id: uuid(),
    platform,
    title: overlayTitle || `${topic} — ${platform}`,
    body: cleanContent,
    imagePrompt: imagePrompt || undefined,
    hashtags: extractHashtags(cleanContent),
    status: "draft",
    founderPov: founderAngle,
    createdAt: new Date(),
  };
}
