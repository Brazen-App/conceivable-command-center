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

export async function generateImage(
  options: NanoBananaOptions
): Promise<GeneratedImage> {
  const client = getClient();

  console.log("[nano-banana] Generating image with Gemini...", {
    model: "gemini-2.5-flash-image",
    promptPreview: options.prompt.slice(0, 80),
    aspectRatio: options.aspectRatio ?? "1:1",
    style: options.style ?? "photography",
  });

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: `Generate an image based on this description. Make it high quality, professional, and visually striking.\n\nImage description: ${options.prompt}\n\nAspect ratio: ${options.aspectRatio ?? "1:1"}\nStyle: ${options.style ?? "photography"}`,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    console.error("[nano-banana] Gemini returned no parts. Full response:", JSON.stringify(response, null, 2).slice(0, 500));
    throw new Error("No response from Nano Banana image generation");
  }

  console.log("[nano-banana] Gemini returned", parts.length, "parts. Types:", parts.map(p => p.inlineData ? `inlineData(${p.inlineData.mimeType})` : p.text ? "text" : "unknown").join(", "));

  for (const part of parts) {
    if (part.inlineData) {
      console.log("[nano-banana] Image generated successfully:", part.inlineData.mimeType, `(${Math.round((part.inlineData.data?.length ?? 0) / 1024)}KB base64)`);
      return {
        base64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType ?? "image/png",
        alt: options.prompt.slice(0, 200),
      };
    }
  }

  console.error("[nano-banana] No inlineData found in any part. Parts content:", parts.map(p => p.text?.slice(0, 100) ?? "(no text)").join(" | "));
  throw new Error("No image was generated in the response");
}
