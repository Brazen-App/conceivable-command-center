// ── Carousel Parser — Splits carousel content into individual slides ──

export interface CarouselSlide {
  number: number;
  title: string;
  body: string;
  imagePrompt: string;
}

export interface ParsedCarousel {
  slides: CarouselSlide[];
  caption: string;
  hashtags: string[];
}

// Brand color combos for slide backgrounds (rotate through these)
const SLIDE_COLOR_COMBOS = [
  "Blue #5A6FFF to Baby Blue #ACB7FF to Off-White #F9F7F0",
  "Pink #E37FB1 to Purple #9686B9 to Navy #356FB6",
  "Green #1EAA55 to Pale Blue #78C3BF to Baby Blue #ACB7FF",
  "Yellow #F1C028 to Pink #E37FB1 to Purple #9686B9",
  "Navy #356FB6 to Blue #5A6FFF to Baby Blue #ACB7FF",
];

const SLIDE_THEMES = [
  "Bold hook visual — eye-catching, scroll-stopping. Large clean background with subtle gradient.",
  "Educational point — clean infographic feel. Soft background, space for text overlay.",
  "Scientific/data visual — modern, clean. Think premium health brand infographic.",
  "Practical/actionable — warm, lifestyle feel. Real-world, approachable imagery.",
  "Emotional/motivational — warm lighting, hopeful mood. Connection and empowerment.",
  "Summary/takeaway — clean, organized. Key points visual recap.",
  "CTA slide — brand-forward, inviting. Conceivable brand colors prominent.",
];

/**
 * Parse carousel content that uses SLIDE N: format into individual slides.
 */
export function parseCarouselSlides(content: string): ParsedCarousel {
  const slides: CarouselSlide[] = [];
  let caption = "";
  const hashtags: string[] = [];

  // Split on SLIDE patterns
  const slidePattern = /SLIDE\s*(\d+)\s*[:\-—]\s*/gi;
  const parts = content.split(slidePattern);

  // parts alternates: [pre-slide-text, slideNum, slideContent, slideNum, slideContent, ...]
  // First element is any text before SLIDE 1
  let captionSection = "";

  // Find CAPTION section
  const captionIdx = content.search(/CAPTION\s*[:\-—]/i);
  if (captionIdx !== -1) {
    captionSection = content.slice(captionIdx).replace(/^CAPTION\s*[:\-—]\s*/i, "").trim();
  }

  // Extract hashtags from caption
  const hashtagMatches = (captionSection || content).match(/#\w+/g);
  if (hashtagMatches) {
    hashtags.push(...[...new Set(hashtagMatches)]);
  }

  // Remove hashtags from caption text
  caption = captionSection.replace(/#\w+/g, "").trim();

  // Parse slides
  for (let i = 1; i < parts.length; i += 2) {
    const slideNum = parseInt(parts[i], 10);
    let slideContent = (parts[i + 1] || "").trim();

    // Stop at CAPTION section within slide content
    const captionInSlide = slideContent.search(/CAPTION\s*[:\-—]/i);
    if (captionInSlide !== -1) {
      if (!caption) {
        caption = slideContent.slice(captionInSlide).replace(/^CAPTION\s*[:\-—]\s*/i, "").replace(/#\w+/g, "").trim();
      }
      slideContent = slideContent.slice(0, captionInSlide).trim();
    }

    // Stop at next IMAGE_PROMPT section
    const imgPromptIdx = slideContent.indexOf("IMAGE_PROMPT");
    if (imgPromptIdx !== -1) {
      slideContent = slideContent.slice(0, imgPromptIdx).trim();
    }

    // Extract title (first line or bracketed content)
    const bracketMatch = slideContent.match(/^\[([^\]]+)\]/);
    let title = "";
    let body = slideContent;

    if (bracketMatch) {
      title = bracketMatch[1].trim();
      body = slideContent.slice(bracketMatch[0].length).trim();
    } else {
      const firstLine = slideContent.split("\n")[0].trim();
      title = firstLine.slice(0, 80);
      body = slideContent.split("\n").slice(1).join("\n").trim();
    }

    // Generate image prompt for this slide
    const colorCombo = SLIDE_COLOR_COMBOS[(slideNum - 1) % SLIDE_COLOR_COMBOS.length];
    const theme = SLIDE_THEMES[(slideNum - 1) % SLIDE_THEMES.length];

    const imagePrompt = buildSlideImagePrompt(slideNum, title, body, colorCombo, theme);

    slides.push({ number: slideNum, title, body: body || title, imagePrompt });
  }

  // If no slides were parsed (content wasn't in SLIDE format), create a single-slide
  if (slides.length === 0) {
    const lines = content.split("\n").filter((l) => l.trim());
    slides.push({
      number: 1,
      title: lines[0]?.slice(0, 80) || "Slide 1",
      body: content,
      imagePrompt: buildSlideImagePrompt(1, lines[0] || "", content, SLIDE_COLOR_COMBOS[0], SLIDE_THEMES[0]),
    });
  }

  return { slides, caption, hashtags };
}

function buildSlideImagePrompt(
  slideNum: number,
  title: string,
  body: string,
  colorCombo: string,
  theme: string
): string {
  const context = `${title} ${body}`.slice(0, 200);

  return `Instagram carousel slide ${slideNum} for Conceivable fertility health brand.

Topic context: ${context}

Design: ${theme}
Colors: Gradient using ${colorCombo}
Aspect ratio: 1:1 (1080x1080)

CRITICAL:
- DO NOT include ANY text, words, letters, or typography in the image
- No garbled text, no fake words, no placeholder text
- Clean, professional, photo-realistic quality
- Style must be CONSISTENT across all slides in this carousel
- Modern, bold, optimistic. Science-backed but warm, not clinical
- Diverse representation. Real authentic moments, not stock photos
- Target audience: women 25-42 on a fertility journey
- Mood: empowering, hopeful, intelligent`;
}

/**
 * Generate image prompts for a full carousel set that are visually consistent.
 */
export function generateConsistentCarouselPrompts(
  slides: CarouselSlide[],
  topic: string
): CarouselSlide[] {
  // Pick one color combo for the entire carousel (consistency)
  const colorIdx = Math.abs(hashCode(topic)) % SLIDE_COLOR_COMBOS.length;
  const primaryColors = SLIDE_COLOR_COMBOS[colorIdx];

  return slides.map((slide, i) => ({
    ...slide,
    imagePrompt: `Instagram carousel slide ${i + 1} of ${slides.length} for Conceivable fertility health brand.

Topic: ${topic}
This slide: ${slide.title}

Design style: Clean, modern carousel slide. ${i === 0 ? "Bold hook visual — eye-catching, scroll-stopping." : i === slides.length - 1 ? "CTA slide — brand-forward, inviting, action-oriented." : "Educational content slide — clean, readable, informative."}
Color palette: ${primaryColors} (SAME palette across all ${slides.length} slides for visual consistency)
Layout: Consistent visual style — same background treatment, same border/margin approach across all slides
Aspect ratio: 1:1 (1080x1080)

CRITICAL:
- DO NOT include ANY text, words, letters, or typography — text is added programmatically
- Consistent visual identity across all ${slides.length} slides
- Modern, warm, premium health brand aesthetic
- Photo-realistic quality`,
  }));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}
