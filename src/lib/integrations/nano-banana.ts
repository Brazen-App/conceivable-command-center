import { GoogleGenAI } from "@google/genai";

let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not set");
  }
  if (!genaiClient) {
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  alt: string;
}

export interface NanoBananaOptions {
  prompt: string;
  aspectRatio?: "1:1" | "4:5" | "16:9" | "9:16" | "2:3" | "3:2";
  style?: string;
}

/** Map app aspect ratios to Imagen-supported values */
function toImagenAspectRatio(
  ar: string
): "1:1" | "3:4" | "4:3" | "9:16" | "16:9" {
  switch (ar) {
    case "4:5":
    case "2:3":
      return "3:4";
    case "3:2":
      return "4:3";
    case "16:9":
      return "16:9";
    case "9:16":
      return "9:16";
    default:
      return "1:1";
  }
}

/** Add a timeout wrapper to any promise */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Primary image generation: Imagen API (dedicated image generation).
 * Uses imagen-3.0-generate-002 via client.models.generateImages().
 */
async function tryImagen(
  client: GoogleGenAI,
  options: NanoBananaOptions
): Promise<GeneratedImage> {
  const aspectRatio = toImagenAspectRatio(options.aspectRatio ?? "1:1");
  console.log("[nano-banana] Trying Imagen 3.0...", {
    model: "imagen-3.0-generate-002",
    aspectRatio,
    promptPreview: options.prompt.slice(0, 80),
  });

  const response = await withTimeout(
    client.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: options.prompt,
      config: {
        numberOfImages: 1,
        aspectRatio,
        outputMimeType: "image/png",
      },
    }),
    30000,
    "Imagen 3.0"
  );

  const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
  if (!imageBytes) {
    console.error("[nano-banana] Imagen returned no image bytes. Response keys:", Object.keys(response ?? {}));
    throw new Error("Imagen returned no image data");
  }

  console.log("[nano-banana] Imagen succeeded:", `${Math.round(imageBytes.length / 1024)}KB base64`);
  return {
    base64: imageBytes,
    mimeType: "image/png",
    alt: options.prompt.slice(0, 200),
  };
}

/**
 * Fallback: Gemini generateContent with image response modality.
 * Uses gemini-2.0-flash-exp which supports native image generation.
 */
async function tryGeminiFlash(
  client: GoogleGenAI,
  options: NanoBananaOptions
): Promise<GeneratedImage> {
  console.log("[nano-banana] Trying Gemini 2.0 Flash (generateContent)...", {
    model: "gemini-2.0-flash-exp",
    promptPreview: options.prompt.slice(0, 80),
  });

  const response = await withTimeout(
    client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Generate an image: ${options.prompt}. Style: ${options.style ?? "photography"}. Aspect ratio: ${options.aspectRatio ?? "1:1"}.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
    30000,
    "Gemini Flash"
  );

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    console.error("[nano-banana] Gemini returned no parts.");
    throw new Error("Gemini returned no response parts");
  }

  for (const part of parts) {
    if (part.inlineData) {
      console.log("[nano-banana] Gemini Flash succeeded:", part.inlineData.mimeType);
      return {
        base64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType ?? "image/png",
        alt: options.prompt.slice(0, 200),
      };
    }
  }

  console.error("[nano-banana] Gemini returned parts but no image data. Part types:", parts.map(p => p.text ? "text" : "unknown").join(", "));
  throw new Error("Gemini returned text only, no image");
}

/**
 * Generate an image using Google's APIs.
 * Tries Imagen 3.0 first, then falls back to Gemini Flash.
 */
export async function generateImage(
  options: NanoBananaOptions
): Promise<GeneratedImage> {
  const client = getClient();

  // Try Imagen 3.0 (dedicated image generation)
  try {
    return await tryImagen(client, options);
  } catch (imagenError) {
    const msg = imagenError instanceof Error ? imagenError.message : String(imagenError);
    console.warn("[nano-banana] Imagen failed:", msg);

    // Fallback to Gemini Flash generateContent
    try {
      return await tryGeminiFlash(client, options);
    } catch (geminiError) {
      const gmsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.error("[nano-banana] Gemini Flash also failed:", gmsg);
      throw new Error(`Image generation failed. Imagen: ${msg} | Gemini: ${gmsg}`);
    }
  }
}
