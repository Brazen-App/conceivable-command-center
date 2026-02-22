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

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** Wrap text into lines that fit within a given character width */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Extract a short headline from the prompt text */
function extractHeadline(prompt: string, textOverlay: string | null): string {
  if (textOverlay) return textOverlay;
  // Try to find quoted text in the prompt
  const quoted = prompt.match(/"([^"]{5,60})"/);
  if (quoted) return quoted[1];
  // Try to find the main subject
  const about = prompt.match(/about\s+"?([^".]{5,50})"?/i);
  if (about) return about[1];
  // Fall back to first meaningful phrase
  const clean = prompt.replace(/\b(professional|branded|clean|modern|high-end|minimal)\b/gi, "").trim();
  const first = clean.split(/[.!,;|—]/)[0].trim();
  return first.length > 60 ? first.slice(0, 57) + "..." : first;
}

/** Generate a seeded pseudo-random number for consistent decorative elements */
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 16807 + 0) % 2147483647;
    return (h & 0x7fffffff) / 2147483647;
  };
}

/** Generate decorative organic shapes (circles, blobs) */
function generateDecorations(w: number, h: number, colors: string[], rand: () => number): string {
  const decs: string[] = [];
  const count = 4 + Math.floor(rand() * 4);

  for (let i = 0; i < count; i++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const r = 30 + rand() * 120;
    const color = colors[Math.floor(rand() * colors.length)];
    const opacity = 0.04 + rand() * 0.08;
    decs.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`);
  }

  // Add a few small accent circles
  for (let i = 0; i < 3; i++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const r = 4 + rand() * 8;
    const color = colors[Math.floor(rand() * colors.length)];
    decs.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${color}" opacity="${(0.15 + rand() * 0.2).toFixed(2)}"/>`);
  }

  return decs.join("\n  ");
}

/** Generate a typography-style image (bold text on gradient) */
function generateTypographySvg(
  w: number, h: number,
  headline: string, subtext: string,
  colors: string[], rand: () => number
): string {
  const c1 = colors[0] || "#7C3AED";
  const c2 = colors[1] || "#EC4899";
  const c3 = colors[2] || "#FFFFFF";
  const headlineLines = wrapText(headline, Math.floor(w / 28));
  const headlineFontSize = w > 700 ? 48 : 36;
  const lineHeight = headlineFontSize * 1.3;
  const headlineY = h / 2 - ((headlineLines.length - 1) * lineHeight) / 2;

  const headlineElements = headlineLines
    .map((line, i) => `<text x="${w / 2}" y="${headlineY + i * lineHeight}" text-anchor="middle" fill="${c3}" font-size="${headlineFontSize}" font-weight="800" font-family="'Inter', 'SF Pro Display', system-ui, sans-serif" letter-spacing="-0.02em">${escapeXml(line)}</text>`)
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#shine)"/>
  ${generateDecorations(w, h, [c1, c2, c3], rand)}
  ${headlineElements}
  ${subtext ? `<text x="${w / 2}" y="${headlineY + headlineLines.length * lineHeight + 20}" text-anchor="middle" fill="${c3}" opacity="0.75" font-size="16" font-weight="500" font-family="'Inter', system-ui, sans-serif">${escapeXml(subtext.slice(0, 80))}</text>` : ""}
  <rect x="${w / 2 - 30}" y="${headlineY - lineHeight - 10}" width="60" height="3" rx="1.5" fill="${c3}" opacity="0.5"/>
  <text x="${w / 2}" y="${h - 30}" text-anchor="middle" fill="${c3}" opacity="0.5" font-size="13" font-weight="600" font-family="'Inter', system-ui, sans-serif" letter-spacing="0.1em">CONCEIVABLE</text>
</svg>`;
}

/** Generate a photography-style placeholder (elegant framing with text) */
function generatePhotographySvg(
  w: number, h: number,
  headline: string, subtext: string,
  colors: string[], rand: () => number
): string {
  const c1 = colors[0] || "#7C3AED";
  const c2 = colors[1] || "#EC4899";
  const bg = "#FAFAFA";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.03"/>
      <stop offset="50%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <clipPath id="imgClip"><rect x="40" y="40" width="${w - 80}" height="${h - 160}" rx="12"/></clipPath>
  </defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#overlay)"/>
  ${generateDecorations(w, h, [c1, c2], rand)}
  <!-- Photo frame area -->
  <rect x="40" y="40" width="${w - 80}" height="${h - 160}" rx="12" fill="url(#accent)" opacity="0.06"/>
  <rect x="40" y="40" width="${w - 80}" height="${h - 160}" rx="12" fill="none" stroke="url(#accent)" stroke-width="1.5" opacity="0.2"/>
  <!-- Camera/photo icon -->
  <g transform="translate(${w / 2 - 24}, ${(h - 160) / 2 - 4})">
    <rect x="4" y="12" width="40" height="28" rx="4" fill="none" stroke="${c1}" stroke-width="2" opacity="0.25"/>
    <circle cx="24" cy="26" r="8" fill="none" stroke="${c1}" stroke-width="2" opacity="0.25"/>
    <path d="M16 12 L20 4 L28 4 L32 12" fill="none" stroke="${c1}" stroke-width="2" opacity="0.25"/>
  </g>
  <!-- Headline below frame -->
  <text x="${w / 2}" y="${h - 75}" text-anchor="middle" fill="${c1}" font-size="18" font-weight="700" font-family="'Inter', system-ui, sans-serif">${escapeXml(headline.slice(0, 60))}</text>
  ${subtext ? `<text x="${w / 2}" y="${h - 52}" text-anchor="middle" fill="${c1}" opacity="0.5" font-size="13" font-family="'Inter', system-ui, sans-serif">${escapeXml(subtext.slice(0, 70))}</text>` : ""}
  <!-- Brand accent bar -->
  <rect x="${w / 2 - 40}" y="${h - 35}" width="80" height="3" rx="1.5" fill="url(#accent)" opacity="0.6"/>
</svg>`;
}

/** Generate an infographic-style image */
function generateInfographicSvg(
  w: number, h: number,
  headline: string, subtext: string,
  colors: string[], rand: () => number
): string {
  const c1 = colors[0] || "#7C3AED";
  const c2 = colors[1] || "#FFFFFF";
  const c3 = colors[2] || "#10B981";

  const headlineLines = wrapText(headline, Math.floor(w / 18));
  const headlineFontSize = w > 700 ? 32 : 24;

  // Generate stat-like boxes
  const stats = [
    { label: "Science-Backed", value: "100%", icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" },
    { label: "Personalized", value: "1:1", icon: "M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" },
    { label: "Data-Driven", value: "24/7", icon: "M18 20V10M12 20V4M6 20V14" },
  ];

  const headerH = h * 0.35;
  const headlineY = headerH / 2 - ((headlineLines.length - 1) * (headlineFontSize * 1.2)) / 2 + 10;
  const headlineEls = headlineLines
    .map((line, i) => `<text x="${w / 2}" y="${headlineY + i * headlineFontSize * 1.2}" text-anchor="middle" fill="${c2}" font-size="${headlineFontSize}" font-weight="800" font-family="'Inter', system-ui, sans-serif">${escapeXml(line)}</text>`)
    .join("\n  ");

  const statW = (w - 100) / 3;
  const statY = headerH + 40;
  const statEls = stats.map((s, i) => {
    const sx = 50 + i * statW + statW / 2;
    return `<g>
    <rect x="${50 + i * statW}" y="${statY}" width="${statW - 16}" height="${Math.min(120, h * 0.18)}" rx="8" fill="${c1}" opacity="0.06"/>
    <text x="${sx - 8}" y="${statY + 45}" text-anchor="middle" fill="${c1}" font-size="28" font-weight="800" font-family="'Inter', system-ui, sans-serif">${s.value}</text>
    <text x="${sx - 8}" y="${statY + 70}" text-anchor="middle" fill="${c1}" opacity="0.6" font-size="12" font-weight="600" font-family="'Inter', system-ui, sans-serif">${s.label}</text>
  </g>`;
  }).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="header" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <rect width="${w}" height="${headerH}" fill="url(#header)"/>
  ${generateDecorations(w, headerH, [c2], rand)}
  ${headlineEls}
  <rect y="${headerH}" width="${w}" height="4" fill="${c3}"/>
  ${statEls}
  ${subtext ? `<text x="${w / 2}" y="${h - 50}" text-anchor="middle" fill="${c1}" opacity="0.5" font-size="13" font-family="'Inter', system-ui, sans-serif">${escapeXml(subtext.slice(0, 70))}</text>` : ""}
  <rect x="${w / 2 - 50}" y="${h - 35}" width="100" height="3" rx="1.5" fill="${c1}" opacity="0.3"/>
  <text x="${w / 2}" y="${h - 15}" text-anchor="middle" fill="${c1}" opacity="0.4" font-size="11" font-weight="600" font-family="'Inter', system-ui, sans-serif" letter-spacing="0.1em">CONCEIVABLE</text>
</svg>`;
}

/** Generate an illustration-style image (abstract shapes + text) */
function generateIllustrationSvg(
  w: number, h: number,
  headline: string, subtext: string,
  colors: string[], rand: () => number
): string {
  const c1 = colors[0] || "#7C3AED";
  const c2 = colors[1] || "#EC4899";
  const c3 = colors[2] || "#FFFFFF";

  // Generate abstract blob paths
  const blobs: string[] = [];
  for (let i = 0; i < 5; i++) {
    const cx = rand() * w;
    const cy = rand() * h * 0.7;
    const size = 60 + rand() * 140;
    const color = i % 2 === 0 ? c1 : c2;
    const opacity = 0.06 + rand() * 0.1;
    // Create organic blob using cubic bezier
    const d = `M${cx},${cy - size / 2} C${cx + size * 0.6},${cy - size * 0.3} ${cx + size * 0.5},${cy + size * 0.3} ${cx},${cy + size / 2} C${cx - size * 0.5},${cy + size * 0.3} ${cx - size * 0.6},${cy - size * 0.3} ${cx},${cy - size / 2}Z`;
    blobs.push(`<path d="${d}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`);
  }

  const headlineLines = wrapText(headline, Math.floor(w / 24));
  const fontSize = w > 700 ? 40 : 30;
  const textY = h * 0.65;
  const headlineEls = headlineLines
    .map((line, i) => `<text x="${w / 2}" y="${textY + i * fontSize * 1.3}" text-anchor="middle" fill="${c1}" font-size="${fontSize}" font-weight="800" font-family="'Inter', system-ui, sans-serif">${escapeXml(line)}</text>`)
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3F0FF"/>
      <stop offset="50%" stop-color="#FDF2F8"/>
      <stop offset="100%" stop-color="#F0FDF4"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${blobs.join("\n  ")}
  ${generateDecorations(w, h, [c1, c2], rand)}
  ${headlineEls}
  ${subtext ? `<text x="${w / 2}" y="${textY + headlineLines.length * fontSize * 1.3 + 16}" text-anchor="middle" fill="${c1}" opacity="0.5" font-size="14" font-family="'Inter', system-ui, sans-serif">${escapeXml(subtext.slice(0, 70))}</text>` : ""}
  <text x="${w / 2}" y="${h - 25}" text-anchor="middle" fill="${c1}" opacity="0.35" font-size="12" font-weight="600" font-family="'Inter', system-ui, sans-serif" letter-spacing="0.1em">CONCEIVABLE</text>
</svg>`;
}

/** Main branded image generator — dispatches to style-specific generators */
function generateBrandedSvg(
  prompt: string,
  aspectRatio: string,
  style: string,
  textOverlay?: string | null,
  colorPalette?: string[]
): string {
  const { w, h } = ASPECT_DIMENSIONS[aspectRatio] ?? { w: 800, h: 800 };
  const colors = colorPalette?.length ? colorPalette : ["#7C3AED", "#EC4899", "#FFFFFF"];
  const headline = extractHeadline(prompt, textOverlay ?? null);
  const subtext = "conceivable.com";
  const rand = seededRandom(prompt);

  switch (style.toLowerCase()) {
    case "typography":
      return generateTypographySvg(w, h, headline, subtext, colors, rand);
    case "infographic":
      return generateInfographicSvg(w, h, headline, subtext, colors, rand);
    case "illustration":
      return generateIllustrationSvg(w, h, headline, subtext, colors, rand);
    case "photography":
    default:
      return generatePhotographySvg(w, h, headline, subtext, colors, rand);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, aspectRatio, style, textOverlay, colorPalette } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    // Try Gemini API first
    console.log("[generate-image-actual] Attempting Gemini image generation...");
    try {
      const result = await generateImage({
        prompt,
        aspectRatio: aspectRatio ?? "1:1",
        style: style ?? "photography",
      });

      console.log("[generate-image-actual] Gemini succeeded:", result.mimeType);
      return NextResponse.json({
        imageData: `data:${result.mimeType};base64,${result.base64}`,
        mimeType: result.mimeType,
        alt: result.alt,
        source: "gemini",
      });
    } catch (geminiError) {
      const geminiMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.error("[generate-image-actual] Gemini FAILED:", geminiMsg);
      if (geminiError instanceof Error && geminiError.stack) {
        console.error("[generate-image-actual] Stack:", geminiError.stack);
      }

      // Try OpenAI DALL-E as fallback
      try {
        const { generateImageWithDallE } = await import("@/lib/integrations/openai-images");
        console.log("[generate-image-actual] Attempting DALL-E fallback...");
        const result = await generateImageWithDallE({
          prompt,
          aspectRatio: aspectRatio ?? "1:1",
          style: style ?? "photography",
        });

        console.log("[generate-image-actual] DALL-E succeeded:", result.mimeType);
        return NextResponse.json({
          imageData: `data:${result.mimeType};base64,${result.base64}`,
          mimeType: result.mimeType,
          alt: result.alt,
          source: "dall-e",
        });
      } catch (dallEError) {
        const dallEMsg = dallEError instanceof Error ? dallEError.message : String(dallEError);
        console.error("[generate-image-actual] DALL-E FAILED:", dallEMsg);

        // Both APIs failed — return SVG placeholder with error details
        console.warn("[generate-image-actual] All image APIs failed. Returning SVG placeholder.");
        const svg = generateBrandedSvg(
          prompt,
          aspectRatio ?? "1:1",
          style ?? "photography",
          textOverlay,
          colorPalette
        );
        const base64 = Buffer.from(svg).toString("base64");

        return NextResponse.json({
          imageData: `data:image/svg+xml;base64,${base64}`,
          mimeType: "image/svg+xml",
          alt: prompt.slice(0, 200),
          source: "svg-placeholder",
          fallbackReason: `Gemini: ${geminiMsg} | DALL-E: ${dallEMsg}`,
        });
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
