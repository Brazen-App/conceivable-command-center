import satori from "satori";
import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";
import { colors } from "@/lib/theme";

/**
 * Branded Image Generator — 8 Template System
 * ─────────────────────────────────────────────
 * Creates social media graphics using 8 distinct visual templates
 * that rotate for creative variety within the Conceivable brand.
 *
 * Templates: StatBomb, Split, Editorial, DataCard, Quote,
 *            Breakdown, GradientMoment, StoryFrame
 *
 * Rules:
 * - Never gradient backgrounds (except Template 7, max 1/week)
 * - Cream (#F9F7F0) is the default background
 * - Accents used sparingly — stripes, borders, small elements
 * - Every graphic must look like a senior creative director made it
 */

// ── Types ───────────────────────────────────────────────────

export type TemplateName =
  | "stat-bomb"
  | "split"
  | "editorial"
  | "data-card"
  | "quote"
  | "breakdown"
  | "gradient-moment"
  | "story-frame";

export interface BrandedImageOptions {
  topic: string;
  platform?: string;
  template?: TemplateName;
  accentColor?: string;
  subtitle?: string;
  stat?: string;
  statLabel?: string;
  // For split template
  leftText?: string;
  rightText?: string;
  // For breakdown template
  points?: string[];
  // For quote template
  attribution?: string;
  // Legacy compat
  gradientFrom?: string;
  gradientTo?: string;
}

// ── Font loading ────────────────────────────────────────────

let fontBuffer: Buffer | null = null;

function loadFont(): Buffer {
  if (fontBuffer) return fontBuffer;

  const paths = [
    join(process.cwd(), "src/lib/integrations/fonts/Montserrat-Bold.ttf"),
    join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
    join(__dirname, "fonts", "Montserrat-Bold.ttf"),
  ];

  for (const p of paths) {
    try {
      fontBuffer = readFileSync(p);
      return fontBuffer;
    } catch {
      continue;
    }
  }

  try {
    const notoPath = join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/noto-sans-v27-latin-regular.ttf");
    fontBuffer = readFileSync(notoPath);
    return fontBuffer;
  } catch {
    // ignore
  }

  throw new Error("No font file found for branded image generation");
}

// ── Platform sizes ──────────────────────────────────────────

const PLATFORM_SIZES: Record<string, { width: number; height: number }> = {
  "instagram-post": { width: 1080, height: 1080 },
  "instagram-carousel": { width: 1080, height: 1080 },
  linkedin: { width: 1200, height: 628 },
  pinterest: { width: 1000, height: 1500 },
  tiktok: { width: 1080, height: 1920 },
  youtube: { width: 1280, height: 720 },
  blog: { width: 1200, height: 628 },
  circle: { width: 1080, height: 1080 },
  square: { width: 1080, height: 1080 },
};

// ── Helpers ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SatoriElement = any;

function text(content: string, style: Record<string, unknown>): SatoriElement {
  return { type: "div", props: { style: { fontFamily: "Brand", ...style }, children: content } };
}

function box(style: Record<string, unknown>, children: SatoriElement | SatoriElement[]): SatoriElement {
  // Satori requires explicit display on elements with multiple children
  const finalStyle = style.display ? style : { display: "flex", ...style };
  return { type: "div", props: { style: finalStyle, children: Array.isArray(children) ? children : [children] } };
}

function wordmark(size: number, color: string): SatoriElement {
  return text("CONCEIVABLE", {
    fontSize: `${size}px`,
    fontWeight: 700,
    letterSpacing: `${size * 0.3}px`,
    color,
    textTransform: "uppercase",
  });
}

function accentStripe(w: number, h: number, color: string, position: Record<string, unknown> = {}): SatoriElement {
  return box({
    width: `${w}px`,
    height: `${h}px`,
    backgroundColor: color,
    borderRadius: "2px",
    ...position,
  }, []);
}

// ── Template Builders ───────────────────────────────────────

function buildStatBomb(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const stat = opts.stat || opts.topic.match(/\d[\d,.]*\s*\w*/)?.[0] || "—";
  const label = opts.statLabel || opts.subtitle || opts.topic;
  const useBlueBg = stat.length <= 6;
  const bg = useBlueBg ? colors.blue : colors.offWhite;
  const fg = useBlueBg ? "#FFFFFF" : colors.black;
  const mutedFg = useBlueBg ? "rgba(255,255,255,0.7)" : colors.muted;
  const statSize = Math.round(w * 0.14);
  const labelSize = Math.round(w * 0.025);
  const p = Math.round(w * 0.1);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", backgroundColor: bg, padding: `${p}px`, position: "relative" },
    [
      // Accent stripe at top
      box({ position: "absolute", top: "0", left: "0", width: `${w}px`, height: "6px", backgroundColor: accent }, []),
      // Stat
      text(stat, { fontSize: `${statSize}px`, fontWeight: 700, color: fg, lineHeight: "1.1", letterSpacing: "-2px" }),
      // Divider
      accentStripe(Math.round(w * 0.08), 4, accent, { marginTop: `${Math.round(p * 0.4)}px`, marginBottom: `${Math.round(p * 0.4)}px` }),
      // Label
      text(label, { fontSize: `${labelSize}px`, fontWeight: 700, color: mutedFg, lineHeight: "1.5", maxWidth: `${w * 0.7}px` }),
      // Wordmark
      box({ position: "absolute", bottom: `${Math.round(p * 0.6)}px`, right: `${p}px` }, [wordmark(Math.round(w * 0.016), mutedFg)]),
    ]
  );
}

function buildSplit(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const leftText = opts.leftText || "The old way";
  const rightText = opts.rightText || opts.topic;
  const halfW = Math.round(w / 2);
  const fontSize = Math.round(w * 0.032);
  const p = Math.round(w * 0.06);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "row" },
    [
      // Left — dark
      box(
        { width: `${halfW}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${p}px`, backgroundColor: colors.black },
        [
          text(leftText, { fontSize: `${fontSize}px`, fontWeight: 700, color: "rgba(249,247,240,0.5)", lineHeight: "1.4", textDecoration: "line-through" }),
        ]
      ),
      // Right — accent
      box(
        { width: `${halfW}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${p}px`, backgroundColor: accent, position: "relative" },
        [
          text(rightText, { fontSize: `${fontSize}px`, fontWeight: 700, color: "#FFFFFF", lineHeight: "1.4" }),
          box({ position: "absolute", bottom: `${Math.round(p * 0.6)}px`, right: `${p}px` }, [wordmark(Math.round(w * 0.014), "rgba(255,255,255,0.6)")]),
        ]
      ),
    ]
  );
}

function buildEditorial(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const headline = opts.topic;
  const p = Math.round(w * 0.1);
  const fontSize = Math.round(w * 0.045);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${p}px`, backgroundColor: colors.offWhite, position: "relative" },
    [
      // Thin accent line at very top
      box({ position: "absolute", top: "0", left: `${p}px`, right: `${p}px`, height: "3px", backgroundColor: accent }, []),
      // Headline
      text(headline, { fontSize: `${fontSize}px`, fontWeight: 700, color: colors.black, lineHeight: "1.35", letterSpacing: "-0.5px", maxWidth: `${w - p * 2}px` }),
      // Wordmark integrated below
      box({ marginTop: `${Math.round(p * 0.6)}px`, display: "flex", alignItems: "center", gap: `${Math.round(w * 0.02)}px` }, [
        accentStripe(Math.round(w * 0.04), 2, accent),
        wordmark(Math.round(w * 0.015), colors.muted),
      ]),
    ]
  );
}

function buildDataCard(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const stat = opts.stat || "74";
  const label = opts.statLabel || "Conceivable Score";
  const subtitle = opts.subtitle || opts.topic;
  const p = Math.round(w * 0.08);
  const arcSize = Math.round(Math.min(w, h) * 0.35);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#FFFEFA", padding: `${p}px`, position: "relative" },
    [
      // Score arc placeholder (rendered as a circle with the number)
      box(
        { width: `${arcSize}px`, height: `${arcSize}px`, borderRadius: "50%", border: `${Math.round(arcSize * 0.06)}px solid ${accent}`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" },
        [
          text(stat, { fontSize: `${Math.round(arcSize * 0.35)}px`, fontWeight: 700, color: colors.black, lineHeight: "1" }),
          text(label, { fontSize: `${Math.round(arcSize * 0.08)}px`, fontWeight: 700, color: colors.muted, textTransform: "uppercase", letterSpacing: "2px", marginTop: "4px" }),
        ]
      ),
      // Subtitle
      text(subtitle, { fontSize: `${Math.round(w * 0.022)}px`, fontWeight: 700, color: colors.muted, lineHeight: "1.5", textAlign: "center", marginTop: `${Math.round(p * 0.6)}px`, maxWidth: `${w * 0.7}px` }),
      // Wordmark
      box({ position: "absolute", bottom: `${Math.round(p * 0.5)}px` }, [wordmark(Math.round(w * 0.014), `${colors.muted}80`)]),
    ]
  );
}

function buildQuote(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const quote = opts.topic;
  const attribution = opts.attribution || "— Kirsten Karchmer";
  const useDarkBg = quote.length < 80;
  const bg = useDarkBg ? accent : colors.offWhite;
  const fg = useDarkBg ? "#FFFFFF" : colors.black;
  const mutedFg = useDarkBg ? "rgba(255,255,255,0.6)" : colors.muted;
  const p = Math.round(w * 0.1);
  const fontSize = Math.round(w * 0.038);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${p}px`, backgroundColor: bg, position: "relative" },
    [
      // Large open quote mark
      text("\u201C", { fontSize: `${Math.round(w * 0.12)}px`, color: useDarkBg ? "rgba(255,255,255,0.15)" : `${accent}20`, lineHeight: "0.8", position: "absolute", top: `${p}px`, left: `${Math.round(p * 0.8)}px` }),
      // Quote text
      text(quote, { fontSize: `${fontSize}px`, fontWeight: 700, color: fg, lineHeight: "1.45", letterSpacing: "-0.3px" }),
      // Attribution
      text(attribution, { fontSize: `${Math.round(w * 0.018)}px`, fontWeight: 700, color: mutedFg, marginTop: `${Math.round(p * 0.5)}px`, textTransform: "uppercase", letterSpacing: "2px" }),
      // Wordmark
      box({ position: "absolute", bottom: `${Math.round(p * 0.5)}px`, right: `${p}px` }, [wordmark(Math.round(w * 0.013), mutedFg)]),
    ]
  );
}

function buildBreakdown(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const title = opts.topic;
  const points = opts.points || ["Point one", "Point two", "Point three", "Point four"];
  const p = Math.round(w * 0.07);
  const cardGap = Math.round(w * 0.025);
  const cardW = Math.round((w - p * 2 - cardGap) / 2);
  const cardH = Math.round((h * 0.5 - cardGap) / 2);

  const cards = points.slice(0, 4).map((point, i) =>
    box(
      { width: `${cardW}px`, height: `${cardH}px`, borderRadius: "16px", padding: `${Math.round(w * 0.03)}px`, backgroundColor: `${accent}08`, border: `1px solid ${accent}20`, display: "flex", flexDirection: "column", justifyContent: "center" },
      [
        text(`${i + 1}`, { fontSize: `${Math.round(w * 0.03)}px`, fontWeight: 700, color: accent, marginBottom: "8px" }),
        text(point, { fontSize: `${Math.round(w * 0.02)}px`, fontWeight: 700, color: colors.black, lineHeight: "1.4" }),
      ]
    )
  );

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", backgroundColor: colors.offWhite, padding: `${p}px`, position: "relative" },
    [
      // Title
      text(title, { fontSize: `${Math.round(w * 0.032)}px`, fontWeight: 700, color: colors.black, lineHeight: "1.3", marginBottom: `${Math.round(p * 0.5)}px` }),
      // Accent stripe
      accentStripe(Math.round(w * 0.06), 3, accent, { marginBottom: `${Math.round(p * 0.5)}px` }),
      // 2x2 card grid
      box(
        { display: "flex", flexWrap: "wrap", gap: `${cardGap}px`, flex: "1" },
        cards
      ),
      // Wordmark
      box({ position: "absolute", bottom: `${Math.round(p * 0.5)}px`, right: `${p}px` }, [wordmark(Math.round(w * 0.014), `${colors.muted}80`)]),
    ]
  );
}

function buildGradientMoment(opts: BrandedImageOptions, w: number, h: number): SatoriElement {
  const headline = opts.topic;
  const p = Math.round(w * 0.1);
  const fontSize = Math.round(w * 0.042);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`, padding: `${p}px`, position: "relative" },
    [
      text(headline, { fontSize: `${fontSize}px`, fontWeight: 700, color: "#FFFFFF", lineHeight: "1.35", textAlign: "center", letterSpacing: "-0.5px" }),
      box({ position: "absolute", bottom: `${Math.round(p * 0.6)}px` }, [wordmark(Math.round(w * 0.018), "rgba(255,255,255,0.5)")]),
    ]
  );
}

function buildStoryFrame(opts: BrandedImageOptions, w: number, h: number, accent: string): SatoriElement {
  const headline = opts.topic;
  const subtitle = opts.subtitle || "";
  const p = Math.round(w * 0.08);
  const headSize = Math.round(w * 0.04);
  const subSize = Math.round(w * 0.022);

  return box(
    { width: `${w}px`, height: `${h}px`, display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: colors.offWhite, padding: `${p}px`, position: "relative" },
    [
      // Organic accent shape (top-right corner)
      box({ position: "absolute", top: "0", right: "0", width: `${Math.round(w * 0.35)}px`, height: `${Math.round(h * 0.25)}px`, backgroundColor: `${accent}08`, borderRadius: `0 0 0 ${Math.round(w * 0.3)}px` }, []),
      // Left accent border
      box({ position: "absolute", top: `${p}px`, bottom: `${p}px`, left: `${Math.round(p * 0.5)}px`, width: "4px", backgroundColor: accent, borderRadius: "2px" }, []),
      // Content
      box({ paddingLeft: `${Math.round(p * 0.4)}px`, display: "flex", flexDirection: "column", gap: `${Math.round(p * 0.4)}px` }, [
        text(headline, { fontSize: `${headSize}px`, fontWeight: 700, color: colors.black, lineHeight: "1.4" }),
        ...(subtitle ? [text(subtitle, { fontSize: `${subSize}px`, fontWeight: 700, color: colors.muted, lineHeight: "1.5" })] : []),
      ]),
      // Wordmark bottom
      box({ position: "absolute", bottom: `${Math.round(p * 0.5)}px`, right: `${p}px` }, [wordmark(Math.round(w * 0.014), `${colors.muted}60`)]),
    ]
  );
}

// ── Auto-select template based on content ───────────────────

function autoSelectTemplate(opts: BrandedImageOptions): TemplateName {
  const t = opts.topic.toLowerCase();
  // If stat/number is provided or topic leads with a number
  if (opts.stat || /^\d/.test(opts.topic)) return "stat-bomb";
  // If split content provided
  if (opts.leftText && opts.rightText) return "split";
  // If points provided
  if (opts.points && opts.points.length >= 3) return "breakdown";
  // If attribution provided (quote)
  if (opts.attribution) return "quote";
  // Short punchy text → editorial
  if (t.length < 60) return "editorial";
  // Longer explanatory text → story frame
  if (t.length > 120) return "story-frame";
  // Default to editorial
  return "editorial";
}

// ── Main export ─────────────────────────────────────────────

export async function generateBrandedImage(opts: BrandedImageOptions): Promise<{
  base64: string;
  mimeType: string;
}> {
  const font = loadFont();
  const { width, height } = PLATFORM_SIZES[opts.platform || "instagram-post"] || { width: 1080, height: 1080 };
  const accent = opts.accentColor || colors.blue;
  const template = opts.template || autoSelectTemplate(opts);

  let element: SatoriElement;

  switch (template) {
    case "stat-bomb":
      element = buildStatBomb(opts, width, height, accent);
      break;
    case "split":
      element = buildSplit(opts, width, height, accent);
      break;
    case "editorial":
      element = buildEditorial(opts, width, height, accent);
      break;
    case "data-card":
      element = buildDataCard(opts, width, height, accent);
      break;
    case "quote":
      element = buildQuote(opts, width, height, accent);
      break;
    case "breakdown":
      element = buildBreakdown(opts, width, height, accent);
      break;
    case "gradient-moment":
      element = buildGradientMoment(opts, width, height);
      break;
    case "story-frame":
      element = buildStoryFrame(opts, width, height, accent);
      break;
    default:
      element = buildEditorial(opts, width, height, accent);
  }

  const svg = await satori(element, {
    width,
    height,
    fonts: [{ name: "Brand", data: font, weight: 700, style: "normal" as const }],
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
