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

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate an image based on this description. Make it high quality, professional, and visually striking.\n\nImage description: ${options.prompt}\n\nAspect ratio: ${options.aspectRatio ?? "1:1"}\nStyle: ${options.style ?? "photography"}`,
          },
        ],
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No response from Nano Banana image generation");
  }

  for (const part of parts) {
    if (part.inlineData) {
      return {
        base64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType ?? "image/png",
        alt: options.prompt.slice(0, 200),
      };
    }
  }

  throw new Error("No image was generated in the response");
}
