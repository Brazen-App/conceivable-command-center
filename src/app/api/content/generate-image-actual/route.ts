import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/integrations/nano-banana";

const ASPECT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  "1:1": { w: 800, h: 800 },
  "4:5": { w: 800, h: 1000 },
  "16:9": { w: 960, h: 540 },
  "9:16": { w: 540, h: 960 },
  "2:3": { w: 600, h: 900 },
  "3:2": { w: 900, h: 600 },
};

function generatePlaceholderSvg(prompt: string, aspectRatio: string, style: string): string {
  const { w, h } = ASPECT_DIMENSIONS[aspectRatio] ?? { w: 800, h: 800 };
  const shortPrompt = prompt.length > 90 ? prompt.slice(0, 87) + "..." : prompt;

  // Wrap text into lines of ~40 chars
  const words = shortPrompt.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > 40) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current.trim()) lines.push(current.trim());

  const textY = h / 2 + 10;
  const lineElements = lines
    .map((line, i) => `<text x="${w / 2}" y="${textY + i * 22}" text-anchor="middle" fill="#a78bfa" font-size="14" font-family="system-ui, sans-serif">${escapeXml(line)}</text>`)
    .join("\n    ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#F3F0FF"/>
      <stop offset="100%" stop-color="#EC4899" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="16" fill="url(#bg)"/>
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="14" fill="none" stroke="#7C3AED" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="${w / 2}" cy="${h / 2 - 60}" r="44" fill="#7C3AED" fill-opacity="0.12"/>
  <path d="M${w / 2 - 16} ${h / 2 - 70} l16 -16 16 16" fill="none" stroke="#7C3AED" stroke-opacity="0.6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${w / 2 - 20} ${h / 2 - 48} l16 -20 12 14 8 -8 16 20z" fill="#7C3AED" fill-opacity="0.15" stroke="#7C3AED" stroke-opacity="0.4" stroke-width="1.5"/>
  <text x="${w / 2}" y="${h / 2 + 4}" text-anchor="middle" fill="#7C3AED" font-size="16" font-weight="700" font-family="system-ui, sans-serif">DEMO IMAGE PLACEHOLDER</text>
  <text x="${w / 2}" y="${h / 2 + 28}" text-anchor="middle" fill="#7C3AED" font-size="13" font-weight="500" font-family="system-ui, sans-serif">${escapeXml(style)} | ${escapeXml(aspectRatio)}</text>
  <line x1="${w / 2 - 100}" y1="${h / 2 + 42}" x2="${w / 2 + 100}" y2="${h / 2 + 42}" stroke="#7C3AED" stroke-opacity="0.2"/>
  ${lineElements}
  <text x="${w / 2}" y="${h - 30}" text-anchor="middle" fill="#a78bfa" font-size="11" font-family="system-ui, sans-serif">Connect Gemini API for AI-generated images</text>
</svg>`;

  return svg;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    try {
      const result = await generateImage({
        prompt,
        aspectRatio: aspectRatio ?? "1:1",
        style: style ?? "photography",
      });

      return NextResponse.json({
        imageData: `data:${result.mimeType};base64,${result.base64}`,
        mimeType: result.mimeType,
        alt: result.alt,
      });
    } catch {
      // Gemini API unavailable — return a branded placeholder SVG
      const svg = generatePlaceholderSvg(prompt, aspectRatio ?? "1:1", style ?? "photography");
      const base64 = Buffer.from(svg).toString("base64");

      return NextResponse.json({
        imageData: `data:image/svg+xml;base64,${base64}`,
        mimeType: "image/svg+xml",
        alt: prompt.slice(0, 200),
        demo: true,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
