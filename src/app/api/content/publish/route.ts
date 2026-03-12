import { NextResponse } from "next/server";
import getLate from "@/lib/late";
import { publishToGeneral } from "@/lib/integrations/circle";
import { publishBlogToShopify, isShopifyConfigured } from "@/lib/integrations/shopify-blog";

interface PublishPiece {
  platform: string;
  copy: string;
  hashtags: string[];
  title?: string;
}

// Map our platform names to Late platform names
const PLATFORM_MAP: Record<string, string> = {
  linkedin: "linkedin",
  x: "twitter",
  facebook: "facebook",
  instagram: "instagram",
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
  const needsLate = pieces.some((p) => p.platform !== "circle");
  if (needsLate && !process.env.LATE_API_KEY) {
    // No Late API key — mark all posts as queued
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

      // Blog posts go to Shopify
      if (piece.platform === "blog") {
        if (!isShopifyConfigured()) {
          return {
            platform: "blog",
            data: { queued: true, message: "Shopify not configured. Add SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN to publish blogs." },
          };
        }
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

      const res = await getLate().posts.createPost({
        body: {
          content: fullContent,
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
