import { NextRequest, NextResponse } from "next/server";
import { fetchVideoContent, type VideoContentItem } from "@/lib/pipelines/video-content-fetcher";

export const dynamic = "force-dynamic";

// 30-minute in-memory cache
let cache: VideoContentItem[] = [];
let cacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000;

// Prevent concurrent fetches
let inFlight: Promise<VideoContentItem[]> | null = null;

async function getItems(forceRefresh = false): Promise<VideoContentItem[]> {
  const now = Date.now();
  if (!forceRefresh && cache.length > 0 && now - cacheTime < CACHE_TTL) {
    return cache;
  }

  if (inFlight) return inFlight;

  inFlight = fetchVideoContent()
    .then((items) => {
      cache = items;
      cacheTime = Date.now();
      inFlight = null;
      return items;
    })
    .catch((err) => {
      console.error("[trends] fetch failed, returning stale cache:", err);
      inFlight = null;
      return cache; // return stale rather than error
    });

  return inFlight;
}

/**
 * GET /api/content/trends
 * Query params:
 *   ?refresh=1       — force re-fetch
 *   ?platform=youtube — filter by platform
 *   ?viral=1         — viral items only
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "1";
    const platformFilter = searchParams.get("platform");
    const viralOnly = searchParams.get("viral") === "1";

    let items = await getItems(forceRefresh);

    // Filter
    if (platformFilter) {
      items = items.filter((i) => i.platform === platformFilter);
    }
    if (viralOnly) {
      items = items.filter((i) => i.isViral);
    }

    // Sort: viral first, then by recency
    items.sort((a, b) => {
      if (a.isViral && !b.isViral) return -1;
      if (!a.isViral && b.isViral) return 1;
      return 0;
    });

    const platforms: Record<string, number> = {};
    for (const item of items) {
      platforms[item.platform] = (platforms[item.platform] || 0) + 1;
    }

    return NextResponse.json({
      items,
      total: items.length,
      platforms,
      cached: cacheTime > 0 && Date.now() - cacheTime < CACHE_TTL,
      cachedAt: cacheTime ? new Date(cacheTime).toISOString() : null,
    });
  } catch (err) {
    console.error("[trends] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
