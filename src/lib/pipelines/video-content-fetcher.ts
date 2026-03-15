/**
 * Video Content Fetcher — discovers trending video content from YouTube, TikTok, Instagram
 *
 * Sources:
 * 1. YouTube RSS feeds from fertility/health channels
 * 2. YouTube Data API v3 search (if YOUTUBE_API_KEY is set)
 * 3. Google News RSS for viral TikTok/Instagram health content
 * 4. Reddit mentions of viral TikTok/IG fertility content
 */

export interface VideoContentItem {
  title: string;
  platform: "youtube" | "tiktok" | "instagram";
  creator: string;
  url: string;
  thumbnailUrl?: string;
  views?: string;
  publishedAt: string;
  snippet: string;
  isViral: boolean;
  relevance: string;
}

// ── YouTube Channel RSS Feeds ──────────────────────────────

// Popular fertility/women's health YouTube channels
const YOUTUBE_CHANNELS: { name: string; channelId: string }[] = [
  { name: "Natalie Crawford, MD", channelId: "UC3bJnNp5fCSAhEmN6kVoBkA" },
  { name: "Dr. Lora Shahine", channelId: "UCQf7LO5sY-5EHGiDJqMrZkw" },
  { name: "FertilityIQ", channelId: "UCmwKr-Mj9hxUcfaXfWDfvaw" },
  { name: "The Fertility Expert", channelId: "UCcKGM46a7s4dJsmq3u6o3pA" },
  { name: "Dr. Mark Hyman", channelId: "UC3w193M5tYPJqF0Hi-7U-2g" },
];

const YOUTUBE_SEARCH_QUERIES = [
  "fertility tips 2026",
  "PCOS symptoms explained",
  "trying to conceive advice",
  "ovulation tracking tips",
  "endometriosis and fertility",
  "IVF journey vlog",
  "perimenopause symptoms",
  "fertility supplements review",
  "period health tips",
];

// ── Fetch YouTube RSS ──────────────────────────────────────

async function fetchYouTubeRSS(): Promise<VideoContentItem[]> {
  const items: VideoContentItem[] = [];

  const results = await Promise.allSettled(
    YOUTUBE_CHANNELS.map(async (channel) => {
      try {
        const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`;
        const resp = await fetch(url, {
          headers: { "User-Agent": "ConceivableBot/1.0" },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) return [];

        const xml = await resp.text();
        return parseYouTubeRSS(xml, channel.name);
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  return items;
}

function parseYouTubeRSS(xml: string, channelName: string): VideoContentItem[] {
  const items: VideoContentItem[] = [];
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];

  for (const entry of entries.slice(0, 3)) {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
    const videoId = entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/)?.[1]?.trim() || "";
    const published = entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || "";
    const description = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1]?.trim() || "";
    const thumbnail = entry.match(/<media:thumbnail[^>]*url="([^"]*?)"/)?.[1] || "";
    const viewsMatch = entry.match(/<media:statistics[^>]*views="(\d+)"/);
    const views = viewsMatch ? formatViews(parseInt(viewsMatch[1])) : undefined;

    if (title && videoId) {
      // Check if recent (within last 30 days)
      const pubDate = new Date(published);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (pubDate >= thirtyDaysAgo) {
        items.push({
          title: decodeEntities(title),
          platform: "youtube",
          creator: channelName,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl: thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          views,
          publishedAt: published || new Date().toISOString(),
          snippet: decodeEntities(description).slice(0, 300),
          isViral: false,
          relevance: "Fertility/women's health creator — monitor for content ideas and trends",
        });
      }
    }
  }

  return items;
}

// ── YouTube Data API Search ────────────────────────────────

async function fetchYouTubeSearch(): Promise<VideoContentItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const items: VideoContentItem[] = [];

  // Pick 3 random queries to avoid rate limiting
  const queries = [...YOUTUBE_SEARCH_QUERIES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  for (const query of queries) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=viewCount&publishedAfter=${getRecentDate()}&maxResults=3&key=${apiKey}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!resp.ok) continue;

      const data = await resp.json();
      for (const item of data.items || []) {
        const snippet = item.snippet;
        items.push({
          title: snippet.title,
          platform: "youtube",
          creator: snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
          publishedAt: snippet.publishedAt,
          snippet: snippet.description?.slice(0, 300) || "",
          isViral: false,
          relevance: `Trending for "${query}" — potential content opportunity`,
        });
      }
    } catch {
      continue;
    }
  }

  return items;
}

// ── TikTok & Instagram via Google News ─────────────────────

const SOCIAL_VIRAL_QUERIES = [
  "tiktok fertility viral",
  "tiktok PCOS trending",
  "tiktok women's health viral",
  "tiktok pregnancy hack trending",
  "instagram fertility influencer trending",
  "instagram women's health viral",
  "tiktok period health trending",
  "tiktok endometriosis awareness",
];

async function fetchSocialViralContent(): Promise<VideoContentItem[]> {
  const items: VideoContentItem[] = [];

  // Pick 4 random queries to avoid overloading
  const queries = [...SOCIAL_VIRAL_QUERIES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const results = await Promise.allSettled(
    queries.map(async (query) => {
      try {
        const encoded = encodeURIComponent(query);
        const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;
        const resp = await fetch(url, {
          headers: { "User-Agent": "ConceivableBot/1.0" },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) return [];

        const xml = await resp.text();
        return parseSocialNewsRSS(xml, query);
      } catch {
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  return items;
}

function parseSocialNewsRSS(xml: string, query: string): VideoContentItem[] {
  const items: VideoContentItem[] = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  const platform = query.includes("instagram") ? "instagram" as const : "tiktok" as const;

  for (const block of itemBlocks.slice(0, 2)) {
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>(.*?)<\/title>/)?.[1]
      || "";
    const link = block.match(/<link>(.*?)<\/link>/)?.[1]
      || block.match(/<link\/>\s*(https?:\/\/[^\s<]+)/)?.[1]
      || "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    const source = block.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || query;
    const description = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1]
      || block.match(/<description>(.*?)<\/description>/)?.[1]
      || "";
    const snippet = description.replace(/<[^>]+>/g, "").trim();

    if (title && link) {
      items.push({
        title: decodeEntities(title),
        platform,
        creator: decodeEntities(source),
        url: link,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        snippet: snippet.slice(0, 300),
        isViral: true,
        relevance: `Viral ${platform} content about ${query.replace(/tiktok |instagram /i, "")} — potential stitch/duet or response opportunity`,
      });
    }
  }

  return items;
}

// ── Reddit mentions of viral TikTok content ────────────────

const TIKTOK_REDDIT_SUBS = [
  "TryingForABaby",
  "PCOS",
  "endometriosis",
  "infertility",
];

async function fetchRedditTikTokMentions(): Promise<VideoContentItem[]> {
  const items: VideoContentItem[] = [];

  for (const sub of TIKTOK_REDDIT_SUBS.slice(0, 2)) {
    try {
      const url = `https://www.reddit.com/r/${sub}/search.json?q=tiktok+OR+viral+video&sort=new&t=week&limit=3&raw_json=1`;
      const resp = await fetch(url, {
        headers: { "User-Agent": "ConceivableBot/1.0 (health research)" },
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) continue;
      const data = await resp.json();

      for (const child of data?.data?.children || []) {
        const post = child?.data;
        if (!post || post.stickied) continue;

        // Only include if it mentions tiktok or viral video
        const text = `${post.title} ${post.selftext || ""}`.toLowerCase();
        if (!text.includes("tiktok") && !text.includes("viral")) continue;

        items.push({
          title: post.title,
          platform: "tiktok",
          creator: `r/${sub}`,
          url: `https://reddit.com${post.permalink}`,
          publishedAt: post.created_utc
            ? new Date(post.created_utc * 1000).toISOString()
            : new Date().toISOString(),
          snippet: (post.selftext || "").slice(0, 300),
          isViral: post.ups > 50,
          relevance: `Community discussion about viral TikTok content in r/${sub} — engagement opportunity`,
        });
      }

      await new Promise((r) => setTimeout(r, 500));
    } catch {
      continue;
    }
  }

  return items;
}

// ── Helpers ────────────────────────────────────────────────

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
}

function getRecentDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

// ── Main Export ────────────────────────────────────────────

export async function fetchVideoContent(): Promise<VideoContentItem[]> {
  console.log("[video-fetcher] Starting video content fetch...");

  const [youtubeRSS, youtubeSearch, socialViral, redditMentions] = await Promise.all([
    fetchYouTubeRSS().catch(() => [] as VideoContentItem[]),
    fetchYouTubeSearch().catch(() => [] as VideoContentItem[]),
    fetchSocialViralContent().catch(() => [] as VideoContentItem[]),
    fetchRedditTikTokMentions().catch(() => [] as VideoContentItem[]),
  ]);

  const all = [...youtubeRSS, ...youtubeSearch, ...socialViral, ...redditMentions];

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`[video-fetcher] Found ${deduped.length} video items (${youtubeRSS.length} YT RSS, ${youtubeSearch.length} YT search, ${socialViral.length} social viral, ${redditMentions.length} reddit)`);

  return deduped;
}
