import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Image text overlay system using Satori + Sharp.
 * Renders title text as a transparent PNG overlay via Satori,
 * then composites onto the base image with Sharp.
 */

// Cache font buffer
let fontBuffer: Buffer | null = null;

function loadFont(): Buffer {
  if (fontBuffer) return fontBuffer;

  // Prefer process.cwd() paths for Vercel serverless compatibility.
  // __dirname is unreliable in bundled serverless functions.
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
      console.log("[image-overlay] Loaded font from:", p);
      return fontBuffer;
    } catch {
      console.log("[image-overlay] Font not found at:", p);
      continue;
    }
  }

  // Last resort: use the Next.js built-in Noto Sans font
  try {
    const notoPath = join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf");
    fontBuffer = readFileSync(notoPath);
    console.log("[image-overlay] Loaded fallback Noto Sans font");
    return fontBuffer;
  } catch {
    // ignore
  }

  throw new Error("No font file found for image overlay. Ensure Montserrat-Bold.ttf exists in src/lib/integrations/fonts/");
}

/**
 * Word-wrap text into lines.
 */
function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines) break;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

interface LayoutConfig {
  maxCharsPerLine: number;
  maxLines: number;
  fontSizeRatio: number;
  paddingRatio: number;
  overlayOpacity: number;
}

const LAYOUTS: Record<string, LayoutConfig> = {
  "1:1":  { maxCharsPerLine: 18, maxLines: 3, fontSizeRatio: 0.075, paddingRatio: 0.05, overlayOpacity: 0.6 },
  "16:9": { maxCharsPerLine: 22, maxLines: 2, fontSizeRatio: 0.06, paddingRatio: 0.04, overlayOpacity: 0.6 },
  "9:16": { maxCharsPerLine: 16, maxLines: 3, fontSizeRatio: 0.07, paddingRatio: 0.05, overlayOpacity: 0.6 },
  "2:3":  { maxCharsPerLine: 16, maxLines: 3, fontSizeRatio: 0.07, paddingRatio: 0.05, overlayOpacity: 0.6 },
  "4:5":  { maxCharsPerLine: 17, maxLines: 3, fontSizeRatio: 0.07, paddingRatio: 0.05, overlayOpacity: 0.6 },
};

/**
 * Render text overlay as a transparent PNG using Satori.
 */
async function renderTextOverlay(
  title: string,
  width: number,
  height: number,
  aspectRatio: string
): Promise<Buffer> {
  const font = loadFont();
  const layout = LAYOUTS[aspectRatio] || LAYOUTS["1:1"];
  const fontSize = Math.round(width * layout.fontSizeRatio);
  const padding = Math.round(width * layout.paddingRatio);
  const lines = wrapText(title.toUpperCase(), layout.maxCharsPerLine, layout.maxLines);
  const lineHeight = fontSize * 1.2;
  const textBlockHeight = Math.round(lines.length * lineHeight + padding * 2.5);

  // Use Satori to render JSX to SVG
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                width: `${width}px`,
                height: `${textBlockHeight}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: `rgba(0, 0, 0, ${layout.overlayOpacity})`,
                padding: `${padding}px`,
              },
              children: lines.map((line) => ({
                type: "div",
                props: {
                  style: {
                    color: "white",
                    fontSize: `${fontSize}px`,
                    fontFamily: "Overlay",
                    fontWeight: 700,
                    textAlign: "center",
                    letterSpacing: `${fontSize * 0.06}px`,
                    lineHeight: `${lineHeight}px`,
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  },
                  children: line,
                },
              })),
            },
          },
        ],
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      width,
      height,
      fonts: [
        {
          name: "Overlay",
          data: font,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  // Convert SVG to PNG with transparency using sharp
  const svgBuffer = Buffer.from(svg);
  return sharp(svgBuffer, { density: 150 })
    .resize(width, height)
    .png()
    .toBuffer();
}

export interface OverlayOptions {
  title: string;
  imageBase64: string;
  imageMimeType?: string;
  aspectRatio?: string;
}

/**
 * Overlay title text on a base64-encoded image.
 */
export async function overlayTitleOnImage(opts: OverlayOptions): Promise<{
  base64: string;
  mimeType: string;
}> {
  const imageBuffer = Buffer.from(opts.imageBase64, "base64");
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1080;
  const height = metadata.height || 1080;

  const aspectRatio = opts.aspectRatio || guessAspectRatio(width, height);

  // Render text overlay as transparent PNG
  const overlayPng = await renderTextOverlay(opts.title, width, height, aspectRatio);

  // Composite overlay on base image
  const result = await sharp(imageBuffer)
    .composite([{
      input: overlayPng,
      top: 0,
      left: 0,
    }])
    .png()
    .toBuffer();

  return {
    base64: result.toString("base64"),
    mimeType: "image/png",
  };
}

function guessAspectRatio(w: number, h: number): string {
  const ratio = w / h;
  if (ratio > 1.6) return "16:9";
  if (ratio > 1.1) return "4:3";
  if (ratio > 0.9) return "1:1";
  if (ratio > 0.7) return "4:5";
  if (ratio > 0.55) return "2:3";
  return "9:16";
}
