import { NextResponse } from "next/server";
import getLate from "@/lib/late";
import { publishToGeneral } from "@/lib/integrations/circle";
import { publishBlogToShopify, isShopifyConfigured } from "@/lib/integrations/shopify-blog";
import { createBlueskyPost, isBlueskyConfigured } from "@/lib/integrations/bluesky";

interface PublishPiece {
  platform: string;
  copy: string;
  hashtags: string[];
  title?: string;
  imageData?: string; // base64 data URL (data:image/png;base64,...)
}

// Map our platform names to Late platform names
const PLATFORM_MAP: Record<string, string> = {
  linkedin: "linkedin",
  x: "twitter",
  bluesky: "bluesky",
  facebook: "facebook",
  instagram: "instagram",
  "instagram-post": "instagram",
  pinterest: "pinterest",
  tiktok: "tiktok",
  youtube: "youtube",
};

// Cache accounts list per request lifecycle
let accountsCache: Array<{ _id: string; platform: string; isActive: boolean }> | null = null;

async function getAccounts() {
  if (accountsCache) return accountsCache;
  const res = await getLate().accounts.listAccounts();
  accountsCache = (res.data as { accounts?: Array<{ _id: string; platform: string; isActive: boolean }> })?.accounts ?? [];
  return accountsCache;
}

/**
 * Upload a base64 image to Late.dev via presigned URL and return the public URL.
 */
async function uploadImageToLate(imageDataUrl: string): Promise<string | null> {
  try {
    // Extract base64 and mime type from data URL
    const match = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) return null;

    const mimeType = match[1];
    const base64 = match[2];
    const ext = mimeType.split("/")[1] || "png";
    const fileName = `conceivable-${Date.now()}.${ext}`;

    // Get presigned upload URL from Late
    const presignRes = await getLate().media.getMediaPresignedUrl({
      query: { fileName, contentType: mimeType },
    });

    const presignData = presignRes.data as { uploadUrl?: string; publicUrl?: string };
    if (!presignData?.uploadUrl || !presignData?.publicUrl) return null;

    // Upload the image binary to the presigned URL
    const buffer = Buffer.from(base64, "base64");
    await fetch(presignData.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: buffer,
    });

    return presignData.publicUrl;
  } catch (err) {
    console.error("Failed to upload image to Late:", err);
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const pieces: PublishPiece[] = body.pieces;

  if (!pieces || !Array.isArray(pieces) || pieces.length === 0) {
    return NextResponse.json(
      { error: "Request must include a non-empty `pieces` array." },
      { status: 400 }
    );
  }

  // Check if Late is needed for any non-Circle pieces
  const needsLate = pieces.some((p) => p.platform !== "circle" && p.platform !== "blog");
  if (needsLate && !process.env.LATE_API_KEY) {
    const results = pieces.map((p) => ({
      platform: p.platform,
      ok: true,
      queued: true,
      message: `Content ready. Connect your ${p.platform} account in Settings to auto-publish.`,
    }));
    return NextResponse.json({ results });
  }

  // Reset cache for each request
  accountsCache = null;

  const results = await Promise.allSettled(
    pieces.map(async (piece) => {
      // Circle posts go through the Circle API, not Late
      if (piece.platform === "circle") {
        const title = piece.title || "New Post";
        const result = await publishToGeneral(title, piece.copy);
        return { platform: "circle", data: result };
      }

      // Bluesky posts go through native AT Protocol, not Late
      if (piece.platform === "bluesky") {
        if (!isBlueskyConfigured()) {
          return {
            platform: "bluesky",
            data: { published: false, message: "Bluesky not configured. Add BLUESKY_HANDLE and BLUESKY_PASSWORD env vars." },
          };
        }
        const result = await createBlueskyPost(
          piece.copy,
          piece.imageData,
          piece.title || "Conceivable"
        );
        if (!result.success) {
          throw new Error(result.error || "Bluesky post failed");
        }
        return { platform: "bluesky", data: { published: true, uri: result.uri } };
      }

      // Blog posts go to Shopify if configured, otherwise return as ready to copy
      if (piece.platform === "blog") {
        if (isShopifyConfigured()) {
          const result = await publishBlogToShopify({
            title: piece.title || "New Blog Post",
            body: piece.copy,
            tags: piece.hashtags,
            publishNow: true,
          });
          if (!result.success) {
            throw new Error(result.error || "Shopify publish failed");
          }
          return { platform: "blog", data: { published: true, article: result.article } };
        }
        // No Shopify — mark as "posted" (content is ready, user copies to their CMS)
        return {
          platform: "blog",
          data: { published: true, message: "Blog post ready. Copy the content to your website/Shopify." },
        };
      }

      // Script-only platforms (no image publishing needed)
      const scriptOnly = piece.platform === "youtube" || piece.platform === "tiktok";

      const latePlatform = PLATFORM_MAP[piece.platform] ?? piece.platform;

      // Resolve the accountId for this platform
      const accounts = await getAccounts();
      const account = accounts.find((a) => a.platform === latePlatform && a.isActive);

      if (!account) {
        throw new Error(`No active ${latePlatform} account connected in Late`);
      }

      const fullContent = piece.hashtags.length > 0
        ? `${piece.copy}\n\n${piece.hashtags.map((t) => `#${t}`).join(" ")}`
        : piece.copy;

      // Instagram REQUIRES media — validate before calling Late API
      const isInstagram = piece.platform.startsWith("instagram");
      if (isInstagram && !piece.imageData) {
        throw new Error("Instagram requires an image to post. Generate or upload an image first.");
      }

      // Upload image if we have one and it's not a script-only platform
      let mediaUrls: string[] | undefined;
      if (!scriptOnly && piece.imageData) {
        const publicUrl = await uploadImageToLate(piece.imageData);
        if (publicUrl) {
          mediaUrls = [publicUrl];
        }
      }

      // Double-check Instagram has media after upload attempt
      if (isInstagram && (!mediaUrls || mediaUrls.length === 0)) {
        throw new Error("Instagram requires media but image upload failed. Try regenerating the image.");
      }

      const res = await getLate().posts.createPost({
        body: {
          content: fullContent,
          ...(mediaUrls ? { mediaUrls } : {}),
          platforms: [{ platform: latePlatform, accountId: account._id }],
          publishNow: true,
        },
      });

      return { platform: piece.platform, data: res.data };
    })
  );

  const response = results.map((r, i) => {
    if (r.status === "fulfilled") {
      return { platform: pieces[i].platform, ok: true, data: r.value.data };
    }
    return {
      platform: pieces[i].platform,
      ok: false,
      error: r.reason instanceof Error ? r.reason.message : "Unknown error",
    };
  });

  return NextResponse.json({ results: response });
}
