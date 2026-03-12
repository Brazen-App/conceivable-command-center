import { fal } from "@fal-ai/client";

// Configure fal client with API key
function ensureClient() {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  fal.config({ credentials: key });
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  alt: string;
  url?: string;
}

export interface NanoBananaOptions {
  prompt: string;
  aspectRatio?: "1:1" | "4:5" | "16:9" | "9:16" | "2:3" | "3:2" | "4:3" | "3:4" | "5:4" | "21:9";
  style?: string;
  resolution?: "0.5K" | "1K" | "2K" | "4K";
}

// --- Platform Specs ---

export const PLATFORM_SPECS: Record<string, { width: number; height: number; aspectRatio: string; style: string }> = {
  "instagram-post": { width: 1080, height: 1080, aspectRatio: "1:1", style: "Bold, eye-catching, scroll-stopping. Warm lifestyle photography or clean infographic. Minimal text overlay." },
  "instagram-carousel": { width: 1080, height: 1080, aspectRatio: "1:1", style: "Clean, educational slide design. Soft gradients, readable typography areas. Series-consistent look." },
  linkedin: { width: 1200, height: 627, aspectRatio: "16:9", style: "Professional, credible, thought-leadership. Clean composition, subtle branding. Medical/scientific but warm." },
  pinterest: { width: 1000, height: 1500, aspectRatio: "2:3", style: "Vertical, aspirational, save-worthy. Soft colors, lifestyle imagery, clear text overlay space at top or bottom." },
  tiktok: { width: 1080, height: 1920, aspectRatio: "9:16", style: "Vertical, vibrant, thumbnail-worthy. Bold colors, expressive, trend-aware." },
  youtube: { width: 1280, height: 720, aspectRatio: "16:9", style: "Thumbnail-style: bold text, expressive faces or clear imagery, high contrast, curiosity-inducing." },
  blog: { width: 1200, height: 630, aspectRatio: "16:9", style: "Editorial, clean, professional. Hero image quality. Warm, inviting, medical-but-human." },
  circle: { width: 1200, height: 627, aspectRatio: "16:9", style: "Community-oriented, warm, inclusive. Feels like a safe space. Soft colors, supportive imagery." },
};

// --- Content Type Detection ---

export type ContentType =
  | "medical-educational"
  | "testimonial-emotional"
  | "educational-infographic"
  | "news-commentary"
  | "product-feature"
  | "community-engagement"
  | "lifestyle-wellness";

const CONTENT_TYPE_PATTERNS: { type: ContentType; keywords: string[] }[] = [
  { type: "medical-educational", keywords: ["study", "research", "clinical", "evidence", "trial", "pubmed", "journal", "findings", "data", "hormone", "ovulation", "fertility treatment", "IVF", "sperm", "endometriosis", "PCOS"] },
  { type: "testimonial-emotional", keywords: ["journey", "story", "experience", "grateful", "finally", "miracle", "pregnant", "positive test", "success"] },
  { type: "educational-infographic", keywords: ["how to", "tips", "steps", "guide", "checklist", "myth", "fact", "did you know", "explained"] },
  { type: "news-commentary", keywords: ["breaking", "new study", "report", "announces", "launches", "FDA", "approval", "regulation", "policy"] },
  { type: "product-feature", keywords: ["halo ring", "conceivable score", "kai", "supplement", "app feature", "tracking", "wearable"] },
  { type: "community-engagement", keywords: ["question", "poll", "share", "community", "support", "together", "group", "discussion"] },
  { type: "lifestyle-wellness", keywords: ["nutrition", "exercise", "stress", "sleep", "mindfulness", "wellness", "self-care", "lifestyle", "diet", "yoga"] },
];

export function detectContentType(content: string, topic: string): ContentType {
  const text = `${topic} ${content}`.toLowerCase();
  let bestType: ContentType = "news-commentary";
  let bestScore = 0;

  for (const { type, keywords } of CONTENT_TYPE_PATTERNS) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }
  return bestType;
}

// --- Smart Prompt Builder ---

const CONTENT_TYPE_STYLES: Record<ContentType, string> = {
  "medical-educational": "Scientific but accessible. Clean, modern medical imagery. Warm lighting, not sterile. Think: premium health brand, not hospital.",
  "testimonial-emotional": "Warm, emotional, hopeful. Soft natural lighting. Real-feeling moments. Joy, relief, connection. NOT stock photo vibes.",
  "educational-infographic": "Clean, organized, informative. Clear visual hierarchy. Soft brand colors as backgrounds. Space for text overlays.",
  "news-commentary": "Current, authoritative, thought-provoking. Bold composition. News-worthy feel but warmer than traditional news.",
  "product-feature": "Premium product photography feel. Clean backgrounds. The Conceivable brand aesthetic: purple (#5A6FFF), pink (#E37FB1), sage green (#1EAA55). Modern, minimal.",
  "community-engagement": "Inclusive, warm, welcoming. Diverse representation. Soft colors, open composition. Feels like a safe, supportive space.",
  "lifestyle-wellness": "Aspirational but achievable. Natural settings, warm light. Healthy lifestyle imagery. Fresh, vibrant, alive.",
};

const BRAND_GUIDELINES = `Brand: Conceivable — fertility health company.
Primary Colors: Blue (#5A6FFF), Baby Blue (#ACB7FF), Off-White (#F9F7F0).
Accent Colors: Yellow (#F1C028), Green (#1EAA55), Pink (#E37FB1), Pale Blue (#78C3BF), Purple (#9686B9), Navy (#356FB6).
Gradients: Use 3 adjacent brand colors (e.g., blue + baby blue + pale blue, or pink + purple + navy).
Audience: Women 25-42 trying to conceive or optimize fertility.
Tone: Modern, bold, optimistic. Science-backed but warm, not clinical.
CRITICAL: DO NOT include ANY text, words, letters, numbers, or typography in the image. The image must be purely visual — no signs, labels, captions, watermarks, or text of any kind. We add text programmatically afterward.
NO stock photo watermarks. NO faces that look AI-generated.
Diverse representation (age, ethnicity, body types). Real authentic moments, not posed stock photos.
Avoid: Sad/desperate imagery, syringes/needles, overly clinical settings, baby-focused imagery (focus on the WOMAN's journey).`;

export function buildSmartPrompt(
  content: string,
  topic: string,
  platform: string,
  contentType?: ContentType,
  customPrompt?: string
): string {
  if (customPrompt) return customPrompt;

  const ct = contentType || detectContentType(content, topic);
  const spec = PLATFORM_SPECS[platform];
  const platformStyle = spec?.style || "Professional, clean, modern.";
  const contentStyle = CONTENT_TYPE_STYLES[ct];

  return `Create a professional image for a ${platform} post about: "${topic}"

Content context: ${content.slice(0, 300)}

Platform requirements: ${platformStyle}
Content style: ${contentStyle}

${BRAND_GUIDELINES}

Make the image feel premium, warm, and empowering. Photo-realistic quality.`;
}

// --- Feedback Adjustment ---

const FEEDBACK_ADJUSTMENTS: Record<string, string> = {
  too_clinical: "Make it WARMER and more lifestyle-oriented. Less medical, more human. Think cozy morning light, not fluorescent hospital. Add warmth, natural elements, soft textures.",
  too_casual: "Make it MORE PROFESSIONAL and credible. Add scientific/medical authority while keeping it approachable. Think premium health brand, clean lines, sophisticated.",
  wrong_vibe: "Completely change the mood. The previous image didn't capture the emotional tone. Focus on: hope, empowerment, clarity, possibility. Conceivable brand = calm + intelligent + empathetic.",
  wrong_demographics: "The people/setting need to better represent women aged 25-42 who are on a fertility journey. Diverse, modern, relatable. Not too young, not too old. Professional but warm.",
  doesnt_match: "The image doesn't relate to the topic at all. Focus specifically on the subject matter described. Make the visual connection to the content obvious and immediate.",
};

export function adjustPromptWithFeedback(
  previousPrompt: string,
  feedback: string
): string {
  const adjustment = FEEDBACK_ADJUSTMENTS[feedback] || `Adjust based on this feedback: ${feedback}`;
  return `${previousPrompt}\n\nIMPORTANT ADJUSTMENT: ${adjustment}\n\nThis is a regeneration — the previous image was rejected. Make significant visible changes.`;
}

// --- Core Generation via fal.ai ---

// Models in priority order — Nano Banana 2 first, then fallbacks
const FAL_MODELS = [
  "fal-ai/nano-banana-2",
  "fal-ai/nano-banana-pro",
  "fal-ai/flux-2-pro",
];

export async function generateImage(
  options: NanoBananaOptions
): Promise<GeneratedImage> {
  ensureClient();
  const errors: string[] = [];

  for (const model of FAL_MODELS) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: Record<string, any> = {
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio ?? "1:1",
        output_format: "png",
        num_images: 1,
        safety_tolerance: 4,
      };

      // Nano Banana models support resolution param
      if (model.includes("nano-banana")) {
        input.resolution = options.resolution ?? "1K";
      }

      const result = await fal.subscribe(model, {
        input,
        logs: false,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.data as any;
      const images = data?.images;

      if (images && images.length > 0) {
        const img = images[0];

        // fal returns a URL — fetch it and convert to base64
        const imageResponse = await fetch(img.url);
        const buffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        return {
          base64,
          mimeType: img.content_type || "image/png",
          alt: options.prompt.slice(0, 200),
          url: img.url,
        };
      }

      errors.push(`${model}: no images in response`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${model}: ${msg}`);
    }
  }

  throw new Error(`All image generation attempts failed: ${errors.join(" | ")}`);
}

// --- Smart Generation (platform-aware) ---

export async function generateSmartImage(opts: {
  content: string;
  topic: string;
  platform: string;
  customPrompt?: string;
  feedback?: string;
  previousPrompt?: string;
}): Promise<GeneratedImage & { prompt: string; contentType: ContentType; platformSpec: typeof PLATFORM_SPECS[string] | null }> {
  const contentType = detectContentType(opts.content, opts.topic);
  const platformSpec = PLATFORM_SPECS[opts.platform] || null;

  let prompt: string;
  if (opts.feedback && opts.previousPrompt) {
    prompt = adjustPromptWithFeedback(opts.previousPrompt, opts.feedback);
  } else {
    prompt = buildSmartPrompt(opts.content, opts.topic, opts.platform, contentType, opts.customPrompt);
  }

  const aspectRatio = platformSpec?.aspectRatio as NanoBananaOptions["aspectRatio"] || "1:1";

  const image = await generateImage({
    prompt,
    aspectRatio,
    style: "photography",
  });

  return {
    ...image,
    prompt,
    contentType,
    platformSpec,
  };
}
