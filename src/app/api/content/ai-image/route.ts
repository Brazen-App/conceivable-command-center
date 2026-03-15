import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Configure FAL client
if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY });
}

/**
 * POST /api/content/ai-image
 *
 * Generates a REAL image using FAL.ai Flux model, then optionally
 * composites text overlay using Sharp for social media graphics.
 *
 * Body: {
 *   prompt: string          — image generation prompt
 *   overlayText?: string    — text to overlay on the image (Instagram quote card style)
 *   platform?: string       — determines aspect ratio
 *   style?: string          — "photography" | "illustration" | "abstract" | "minimal"
 *   width?: number          — custom width (default based on platform)
 *   height?: number         — custom height (default based on platform)
 * }
 */
export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      {
        error: "Image generation requires an API key. Add FAL_KEY to .env to enable AI image generation.",
        configured: false,
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { prompt, overlayText, platform, style } = body;

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // Determine dimensions based on platform
    const dimensions = getPlatformDimensions(platform);
    const width = body.width || dimensions.width;
    const height = body.height || dimensions.height;

    // Build the full prompt with style guidance
    const fullPrompt = buildImagePrompt(prompt, style, overlayText);

    console.log(`[ai-image] Generating: ${width}x${height}, platform=${platform}, style=${style}`);
    console.log(`[ai-image] Prompt: ${fullPrompt.slice(0, 200)}...`);

    // Call FAL.ai Flux for real image generation
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: fullPrompt,
        image_size: { width, height },
        num_images: 1,
        enable_safety_checker: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const images = (result as any)?.data?.images || (result as any)?.images || [];
    if (!images.length || !images[0]?.url) {
      console.error("[ai-image] No images returned:", JSON.stringify(result).slice(0, 500));
      return NextResponse.json({ error: "Image generation returned no results" }, { status: 500 });
    }

    const imageUrl = images[0].url;
    console.log(`[ai-image] Generated: ${imageUrl}`);

    // If overlay text requested, composite it onto the image
    let finalImageData: string;
    if (overlayText) {
      finalImageData = await compositeTextOverlay(imageUrl, overlayText, width, height);
    } else {
      // Return the raw image as base64 data URL
      const imgRes = await fetch(imageUrl);
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      finalImageData = `data:image/png;base64,${imgBuffer.toString("base64")}`;
    }

    return NextResponse.json({
      imageData: finalImageData,
      imageUrl,
      prompt: fullPrompt,
      width,
      height,
      platform: platform || "general",
      hasOverlay: !!overlayText,
    });
  } catch (err) {
    console.error("[ai-image] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Image generation failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/ai-image
 * Returns configuration status
 */
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.FAL_KEY,
    provider: process.env.FAL_KEY ? "FAL.ai (Flux)" : "none",
    message: process.env.FAL_KEY
      ? "AI image generation is active"
      : "Image generation requires FAL_KEY. Add it to environment variables.",
  });
}

// ── Helpers ──────────────────────────────────────────────────

function getPlatformDimensions(platform?: string): { width: number; height: number } {
  switch (platform) {
    case "instagram-post":
    case "instagram":
    case "linkedin":
      return { width: 1080, height: 1080 };
    case "instagram-story":
    case "tiktok":
      return { width: 1080, height: 1920 };
    case "pinterest":
      return { width: 1000, height: 1500 };
    case "x":
    case "twitter":
    case "blog":
    case "youtube":
      return { width: 1200, height: 675 };
    case "bluesky":
      return { width: 1200, height: 675 };
    default:
      return { width: 1080, height: 1080 };
  }
}

function buildImagePrompt(prompt: string, style?: string, overlayText?: string): string {
  const styleGuide = {
    photography: "Professional editorial photography, soft natural lighting, shallow depth of field, warm tones",
    illustration: "Modern minimal illustration, clean lines, soft pastel palette with blue (#5A6FFF) and cream (#F9F7F0) accents",
    abstract: "Abstract organic shapes, flowing gradients in blue (#5A6FFF), baby blue (#ACB7FF), and soft cream (#F9F7F0), modern and calming",
    minimal: "Minimal clean composition, lots of negative space, subtle textures, cream and white tones with blue accent",
  }[style || "photography"] || "Professional, clean, modern aesthetic";

  let fullPrompt = `${styleGuide}. ${prompt}`;

  // If text will be overlaid, ensure the image has space for it
  if (overlayText) {
    fullPrompt += ". Leave clear space in the center or lower third for text overlay. Ensure the background has enough contrast for white or dark text to be readable. No text in the image itself.";
  }

  // Brand guidance
  fullPrompt += " Color palette inspired by fertility health: soft blues, warm creams, gentle pinks. Feeling: calm, intelligent, empowering, hopeful. NOT clinical or sterile.";

  return fullPrompt;
}

async function compositeTextOverlay(
  imageUrl: string,
  text: string,
  width: number,
  height: number
): Promise<string> {
  // Dynamic import sharp (may not be available in all environments)
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default;
  } catch {
    // If sharp isn't available, return the raw image
    const imgRes = await fetch(imageUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    return `data:image/png;base64,${imgBuffer.toString("base64")}`;
  }

  // Fetch the generated image
  const imgRes = await fetch(imageUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // Create text overlay SVG
  const fontSize = Math.max(24, Math.floor(width / 20));
  const lineHeight = fontSize * 1.4;
  const maxCharsPerLine = Math.floor(width / (fontSize * 0.55));
  const lines = wrapText(text, maxCharsPerLine);
  const textBlockHeight = lines.length * lineHeight + 60;

  // Position text in lower third with semi-transparent backdrop
  const yStart = height - textBlockHeight - 40;

  const textSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0)" />
          <stop offset="30%" stop-color="rgba(0,0,0,0.5)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.75)" />
        </linearGradient>
      </defs>
      <rect x="0" y="${yStart - 60}" width="${width}" height="${height - yStart + 60}" fill="url(#textBg)" />
      ${lines.map((line, i) => `
        <text
          x="${width / 2}"
          y="${yStart + 30 + i * lineHeight}"
          text-anchor="middle"
          font-family="Inter, -apple-system, sans-serif"
          font-size="${fontSize}"
          font-weight="600"
          fill="white"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        >${escapeXml(line)}</text>
      `).join("")}
    </svg>
  `;

  // Composite text over image
  const result = await sharp(imgBuffer)
    .resize(width, height, { fit: "cover" })
    .composite([{ input: Buffer.from(textSvg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  return `data:image/png;base64,${result.toString("base64")}`;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());

  // Max 5 lines
  return lines.slice(0, 5);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
