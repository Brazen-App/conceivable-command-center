import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/content/image-upload
 * Accepts a base64 image from the client and returns it as a data URL.
 * Optionally resizes to platform-optimal dimensions.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageData } = body;

    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json({ error: "Missing imageData" }, { status: 400 });
    }

    // Validate it looks like a data URL
    if (!imageData.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    // Return as-is — the client already has the base64
    // In the future, we could resize/optimize here with Sharp
    return NextResponse.json({
      imageData,
      uploaded: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
