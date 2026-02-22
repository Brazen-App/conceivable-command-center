import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local to enable DALL-E image generation as a fallback."
    );
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  alt: string;
}

interface ImageOptions {
  prompt: string;
  aspectRatio?: string;
  style?: string;
}

/** Map aspect ratios to DALL-E 3 supported sizes */
function toDallESize(
  aspectRatio: string
): "1024x1024" | "1792x1024" | "1024x1792" {
  switch (aspectRatio) {
    case "16:9":
    case "3:2":
      return "1792x1024";
    case "9:16":
    case "2:3":
    case "4:5":
      return "1024x1792";
    default:
      return "1024x1024";
  }
}

export async function generateImageWithDallE(
  options: ImageOptions
): Promise<GeneratedImage> {
  const client = getClient();

  const size = toDallESize(options.aspectRatio ?? "1:1");

  console.log("[openai-images] Generating image with DALL-E 3...", {
    size,
    promptPreview: options.prompt.slice(0, 80),
  });

  const response = await client.images.generate({
    model: "dall-e-3",
    prompt: options.prompt,
    n: 1,
    size,
    response_format: "b64_json",
    quality: "standard",
  });

  const imageData = response.data?.[0]?.b64_json;
  if (!imageData) {
    throw new Error("DALL-E returned no image data");
  }

  console.log(
    "[openai-images] DALL-E image generated successfully:",
    `${Math.round(imageData.length / 1024)}KB base64`
  );

  return {
    base64: imageData,
    mimeType: "image/png",
    alt: options.prompt.slice(0, 200),
  };
}
