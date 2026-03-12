import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Branded image generator — creates social media graphics with:
 * - Brand gradient background
 * - Full topic title text (dynamic font sizing)
 * - CONCEIVABLE wordmark
 *
 * Pure Satori + Sharp — no external API calls, instant generation.
 */

// ── Font loading (cached) ───────────────────────────────────────────

let fontBuffer: Buffer | null = null;

function loadFont(): Buffer {
  if (fontBuffer) return fontBuffer;

  const paths = [
    join(process.cwd(), "src/lib/integrations/fonts/Montserrat-Bold.ttf"),
    join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
    join(__dirname, "fonts", "Montserrat-Bold.ttf"),
    join(process.cwd(), "src/lib/integrations/fonts/Youth-Bold.ttf"),
    join(__dirname, "fonts", "Youth-Bold.ttf"),
    join(process.cwd(), "public/fonts/Youth-Bold.ttf"),
  ];

  for (const p of paths) {
    try {
      fontBuffer = readFileSync(p);
      return fontBuffer;
    } catch {
      continue;
    }
  }

  // Fallback: Next.js built-in Noto Sans
  try {
    const notoPath = join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf");
    fontBuffer = readFileSync(notoPath);
    return fontBuffer;
  } catch {
    // ignore
  }

  throw new Error("No font file found for branded image generation");
}

// ── Brand gradient palettes ─────────────────────────────────────────

const BRAND_GRADIENTS = [
  { from: "#5A6FFF", to: "#356FB6", name: "blue-navy" },
  { from: "#356FB6", to: "#5A6FFF", name: "navy-blue" },
  { from: "#5A6FFF", to: "#ACB7FF", name: "blue-baby" },
  { from: "#5A6FFF", to: "#9686B9", name: "blue-purple" },
  { from: "#356FB6", to: "#78C3BF", name: "navy-teal" },
  { from: "#9686B9", to: "#5A6FFF", name: "purple-blue" },
  { from: "#E37FB1", to: "#9686B9", name: "pink-purple" },
  { from: "#356FB6", to: "#1EAA55", name: "navy-green" },
];

function pickGradient(topic: string): { from: string; to: string } {
  // Deterministic gradient based on topic string hash
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = ((hash << 5) - hash + topic.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % BRAND_GRADIENTS.length;
  return BRAND_GRADIENTS[idx];
}

// ── Dynamic font sizing ─────────────────────────────────────────────

function dynamicFontSize(text: string, baseWidth: number): number {
  const len = text.length;
  // Scale font down for longer titles
  if (len <= 20) return Math.round(baseWidth * 0.08);    // short: big
  if (len <= 35) return Math.round(baseWidth * 0.065);   // medium
  if (len <= 50) return Math.round(baseWidth * 0.055);   // longer
  if (len <= 70) return Math.round(baseWidth * 0.045);   // long
  return Math.round(baseWidth * 0.038);                   // very long
}

// ── Core branded image generation ───────────────────────────────────

export interface BrandedImageOptions {
  topic: string;
  platform?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

// Platform-specific dimensions matching real platform aspect ratios
const PLATFORM_SIZES: Record<string, { width: number; height: number }> = {
  "instagram-post": { width: 1080, height: 1080 },       // 1:1
  "instagram-carousel": { width: 1080, height: 1080 },    // 1:1
  linkedin: { width: 1200, height: 628 },                 // 1.91:1
  pinterest: { width: 1000, height: 1500 },                // 2:3
  tiktok: { width: 1080, height: 1920 },                   // 9:16
  youtube: { width: 1280, height: 720 },                   // 16:9
  blog: { width: 1200, height: 628 },                      // 1.91:1
  circle: { width: 1080, height: 1080 },                   // 1:1
};

export async function generateBrandedImage(opts: BrandedImageOptions): Promise<{
  base64: string;
  mimeType: string;
}> {
  const font = loadFont();
  const { width, height } = PLATFORM_SIZES[opts.platform || "instagram-post"] || { width: 1080, height: 1080 };

  const gradient = opts.gradientFrom && opts.gradientTo
    ? { from: opts.gradientFrom, to: opts.gradientTo }
    : pickGradient(opts.topic);

  // Full topic text — dynamic font size adjusts for length
  const titleText = opts.topic.toUpperCase();
  const fontSize = dynamicFontSize(titleText, width);
  const logoFontSize = Math.round(width * 0.022);
  const padding = Math.round(width * 0.08);

  // Word wrap title — chars per line scales with font size
  const maxCharsPerLine = titleText.length <= 30 ? 18 : titleText.length <= 50 ? 22 : 28;
  const words = titleText.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (test.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = fontSize * 1.35;

  // Build the Satori element tree
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element: any = {
    type: "div",
    props: {
      style: {
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(145deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
        padding: `${padding}px`,
        position: "relative",
      },
      children: [
        // Decorative circle (top right)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: `-${Math.round(height * 0.15)}px`,
              right: `-${Math.round(width * 0.1)}px`,
              width: `${Math.round(width * 0.5)}px`,
              height: `${Math.round(width * 0.5)}px`,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.06)",
            },
          },
        },
        // Decorative circle (bottom left)
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: `-${Math.round(height * 0.1)}px`,
              left: `-${Math.round(width * 0.15)}px`,
              width: `${Math.round(width * 0.4)}px`,
              height: `${Math.round(width * 0.4)}px`,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.04)",
            },
          },
        },
        // Title text block
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
              maxWidth: `${width - padding * 2}px`,
            },
            children: lines.map((line) => ({
              type: "div",
              props: {
                style: {
                  color: "#F9F7F0",
                  fontSize: `${fontSize}px`,
                  fontFamily: "Brand",
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: `${fontSize * 0.08}px`,
                  lineHeight: `${lineHeight}px`,
                  textShadow: "0 2px 16px rgba(0,0,0,0.2)",
                },
                children: line,
              },
            })),
          },
        },
        // Divider line
        {
          type: "div",
          props: {
            style: {
              width: `${Math.round(width * 0.12)}px`,
              height: "3px",
              backgroundColor: "rgba(249, 247, 240, 0.5)",
              borderRadius: "2px",
              marginTop: `${Math.round(padding * 0.6)}px`,
              marginBottom: `${Math.round(padding * 0.5)}px`,
            },
          },
        },
        // CONCEIVABLE wordmark
        {
          type: "div",
          props: {
            style: {
              color: "rgba(249, 247, 240, 0.7)",
              fontSize: `${logoFontSize}px`,
              fontFamily: "Brand",
              fontWeight: 700,
              letterSpacing: `${logoFontSize * 0.25}px`,
              textTransform: "uppercase",
            },
            children: "CONCEIVABLE",
          },
        },
      ],
    },
  };

  const svg = await satori(element, {
    width,
    height,
    fonts: [
      {
        name: "Brand",
        data: font,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const svgBuffer = Buffer.from(svg);
  const pngBuffer = await sharp(svgBuffer, { density: 150 })
    .resize(width, height)
    .png({ quality: 90 })
    .toBuffer();

  return {
    base64: pngBuffer.toString("base64"),
    mimeType: "image/png",
  };
}
