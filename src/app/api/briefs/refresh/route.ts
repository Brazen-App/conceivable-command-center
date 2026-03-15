import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invokeAgent } from "@/lib/agents/invoke";
import {
  fetchAllRealContent,
  type RealNewsItem,
  type RealResearchItem,
  type RealRedditPost,
} from "@/lib/pipelines/real-news-fetcher";
import { fetchVideoContent, type VideoContentItem } from "@/lib/pipelines/video-content-fetcher";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// In-memory cache for video items (no Prisma model needed)
let globalVideoCache: VideoContentItem[] = [];
let globalVideoCacheTime = 0;
export { globalVideoCache, globalVideoCacheTime };

/**
 * POST /api/briefs/refresh
 *
 * Fetches REAL articles from Google News, PubMed, and Reddit,
 * verifies every URL, then uses AI to analyze relevance — never to fabricate.
 *
 * This replaces the old hallucination-based pipeline.
 */
export async function POST() {
  const startTime = Date.now();

  try {
    // 1. Fetch real content from all sources (including video)
    const [fetchResult, videoItems] = await Promise.all([
      fetchAllRealContent(),
      fetchVideoContent().catch(() => [] as VideoContentItem[]),
    ]);

    // Store video items in memory cache for the content engine
    globalVideoCache = videoItems;
    globalVideoCacheTime = Date.now();

    // 2. Filter to only verified items for news (PubMed/Reddit already verified)
    const verifiedNews = fetchResult.news.filter((n) => n.verified);

    if (
      verifiedNews.length === 0 &&
      fetchResult.research.length === 0 &&
      fetchResult.reddit.length === 0
    ) {
      return NextResponse.json({
        ok: true,
        message: "No verified content found from any source. Try again later.",
        stats: fetchResult.stats,
      });
    }

    // 3. Use AI to analyze and tag the REAL articles (not fabricate them)
    //    Pick top 10 news, top 5 research, top 5 reddit
    const topNews = verifiedNews.slice(0, 10);
    const topResearch = fetchResult.research.slice(0, 5);
    const topReddit = fetchResult.reddit
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 5);

    // 4. AI-analyze news items in batch
    const analyzedNews = await analyzeNewsItems(topNews);
    const analyzedResearch = await analyzeResearchItems(topResearch);
    const analyzedReddit = await analyzeRedditPosts(topReddit);

    // 5. Clear old items and insert new verified ones
    await prisma.$transaction([
      prisma.newsItem.deleteMany({}),
      prisma.researchArticle.deleteMany({}),
      prisma.redditPost.deleteMany({}),
    ]);

    // Insert new verified items
    if (analyzedNews.length > 0) {
      await prisma.newsItem.createMany({ data: analyzedNews });
    }
    if (analyzedResearch.length > 0) {
      await prisma.researchArticle.createMany({ data: analyzedResearch });
    }
    if (analyzedReddit.length > 0) {
      await prisma.redditPost.createMany({ data: analyzedReddit });
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      refreshedAt: new Date().toISOString(),
      durationMs,
      counts: {
        news: analyzedNews.length,
        research: analyzedResearch.length,
        reddit: analyzedReddit.length,
        video: videoItems.length,
      },
      stats: fetchResult.stats,
    });
  } catch (err) {
    console.error("[briefs/refresh] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Refresh failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Also support GET for cron job triggers.
 * If ?redirect=1, redirect back to content page after refresh (for no-JS button).
 */
export async function GET(req: NextRequest) {
  const redirect = req.nextUrl.searchParams.get("redirect");
  const result = await POST();

  if (redirect) {
    return NextResponse.redirect(
      new URL("/departments/content?refreshed=1", req.nextUrl.origin)
    );
  }

  return result;
}

// ────────────────────────────────────────────
// AI ANALYSIS (analyze real articles, never fabricate)
// ────────────────────────────────────────────

async function analyzeNewsItems(
  items: RealNewsItem[]
): Promise<
  Array<{
    title: string;
    source: string;
    sourceUrl: string;
    brief: string;
    tag: string;
    isViral: boolean;
    viralReason: string;
    summary: string;
    fullArticle: string;
    agentRecommendation: string;
    coverageAngle: string;
    timestamp: string;
  }>
> {
  if (items.length === 0) return [];

  const itemSummaries = items
    .map(
      (item, i) =>
        `[${i}] Title: ${item.title}\nSource: ${item.source}\nURL: ${item.sourceUrl}\nSnippet: ${item.snippet}\nPublished: ${item.publishedAt}`
    )
    .join("\n\n");

  try {
    const result = await invokeAgent({
      agentId: "content-engine",
      message: `You are analyzing REAL news articles that have been fetched from verified sources. Do NOT make up any information. Only work with what's provided.

Here are ${items.length} real articles about fertility, women's health, and related topics:

${itemSummaries}

For each article, provide a JSON array with objects containing:
- index: the article index number [0], [1], etc.
- brief: a 2-3 sentence summary of the article's relevance to Conceivable's audience (women trying to conceive, PCOS, endometriosis). Base this ONLY on the title and snippet provided.
- tag: one of "competitor", "science", "industry", "viral", "regulatory"
- isViral: boolean — would this trend on social? Be conservative.
- viralReason: brief reason if viral, empty string if not
- agentRecommendation: how Conceivable should respond to this news (content opportunity, competitive response, etc.)
- coverageAngle: suggested angle for Conceivable content about this

IMPORTANT RULES:
1. Do NOT invent facts or details not present in the title/snippet
2. Do NOT generate fake quotes or statistics
3. If you're unsure about something, say so
4. The brief should be based ONLY on what's in the snippet

Return ONLY the JSON array, no other text.`,
    });

    const parsed = JSON.parse(result.response);

    return items.map((item, i) => {
      const analysis = parsed.find(
        (p: { index: number }) => p.index === i
      ) || {
        brief: item.snippet,
        tag: "industry",
        isViral: false,
        viralReason: "",
        agentRecommendation: "Review this article for content opportunities.",
        coverageAngle: "Share with relevant commentary.",
      };

      return {
        title: item.title,
        source: item.source,
        sourceUrl: item.sourceUrl,
        brief: analysis.brief || item.snippet,
        tag: analysis.tag || "industry",
        isViral: analysis.isViral || false,
        viralReason: analysis.viralReason || "",
        summary: item.snippet,
        fullArticle: `Source: ${item.source}\nURL: ${item.sourceUrl}\nPublished: ${new Date(item.publishedAt).toLocaleDateString()}\n\n${item.snippet}\n\n→ Read full article: ${item.sourceUrl}`,
        agentRecommendation: analysis.agentRecommendation || "",
        coverageAngle: analysis.coverageAngle || "",
        timestamp: item.publishedAt,
      };
    });
  } catch (err) {
    console.error("[briefs/refresh] AI analysis failed for news:", err);
    // Return items with minimal analysis if AI fails
    return items.map((item) => ({
      title: item.title,
      source: item.source,
      sourceUrl: item.sourceUrl,
      brief: item.snippet,
      tag: "industry",
      isViral: false,
      viralReason: "",
      summary: item.snippet,
      fullArticle: `Source: ${item.source}\nURL: ${item.sourceUrl}\nPublished: ${new Date(item.publishedAt).toLocaleDateString()}\n\n${item.snippet}\n\n→ Read full article: ${item.sourceUrl}`,
      agentRecommendation: "Review for content opportunities.",
      coverageAngle: "",
      timestamp: item.publishedAt,
    }));
  }
}

async function analyzeResearchItems(
  items: RealResearchItem[]
): Promise<
  Array<{
    title: string;
    journal: string;
    authors: string;
    doi: string;
    brief: string;
    relevanceScore: number;
    fillsGap: boolean;
    gapDescription: string;
    summary: object;
    fullAbstract: string;
    timestamp: string;
  }>
> {
  if (items.length === 0) return [];

  const itemSummaries = items
    .map(
      (item, i) =>
        `[${i}] Title: ${item.title}\nAuthors: ${item.authors}\nJournal: ${item.journal}\nDOI: ${item.doi}\nPMID: ${item.pmid}\nAbstract: ${item.abstract.slice(0, 800)}`
    )
    .join("\n\n");

  try {
    const result = await invokeAgent({
      agentId: "content-engine",
      message: `You are analyzing REAL peer-reviewed research articles from PubMed. These are verified, real papers. Analyze them for relevance to Conceivable (a fertility health tech company).

${itemSummaries}

For each paper, provide a JSON array with objects containing:
- index: the paper index
- brief: 2-3 sentence plain-language summary of why this matters for fertility
- relevanceScore: 0-100 relevance to Conceivable's mission
- fillsGap: boolean — does this paper address an underexplored area?
- gapDescription: if fillsGap is true, what gap does it fill?
- summary: object with { design, keyFindings, sampleSize, limitations, conceivableRelevance }

ONLY use information from the provided abstract. Do NOT invent findings.
Return ONLY the JSON array.`,
    });

    const parsed = JSON.parse(result.response);

    return items.map((item, i) => {
      const analysis = parsed.find(
        (p: { index: number }) => p.index === i
      ) || {
        brief: item.abstract.slice(0, 300),
        relevanceScore: 50,
        fillsGap: false,
        gapDescription: "",
        summary: {
          design: "See abstract",
          keyFindings: "See abstract",
          sampleSize: "Not specified",
          limitations: "Not assessed",
          conceivableRelevance: "Potentially relevant to fertility research",
        },
      };

      return {
        title: item.title,
        journal: item.journal,
        authors: item.authors,
        doi: item.doi,
        brief: analysis.brief || item.abstract.slice(0, 300),
        relevanceScore: analysis.relevanceScore || 50,
        fillsGap: analysis.fillsGap || false,
        gapDescription: analysis.gapDescription || "",
        summary: analysis.summary || {},
        fullAbstract: item.abstract,
        timestamp: item.publishedAt,
      };
    });
  } catch (err) {
    console.error("[briefs/refresh] AI analysis failed for research:", err);
    return items.map((item) => ({
      title: item.title,
      journal: item.journal,
      authors: item.authors,
      doi: item.doi,
      brief: item.abstract.slice(0, 300),
      relevanceScore: 50,
      fillsGap: false,
      gapDescription: "",
      summary: {
        design: "See abstract",
        keyFindings: "See abstract",
        sampleSize: "Not specified",
        limitations: "Not assessed",
        conceivableRelevance: "Review for relevance",
      },
      fullAbstract: item.abstract,
      timestamp: item.publishedAt,
    }));
  }
}

async function analyzeRedditPosts(
  items: RealRedditPost[]
): Promise<
  Array<{
    subreddit: string;
    title: string;
    body: string;
    upvotes: number;
    comments: number;
    url: string;
    engagementPotential: string;
    relevanceScore: number;
    riskLevel: string;
    draftResponse: string;
    status: string;
    timestamp: string;
  }>
> {
  if (items.length === 0) return [];

  const itemSummaries = items
    .map(
      (item, i) =>
        `[${i}] r/${item.subreddit}: "${item.title}"\nBody: ${item.body.slice(0, 500)}\nUpvotes: ${item.upvotes}, Comments: ${item.comments}`
    )
    .join("\n\n");

  try {
    const result = await invokeAgent({
      agentId: "content-engine",
      message: `You are analyzing REAL Reddit posts from fertility/health subreddits. These are actual posts from real people.

${itemSummaries}

For each post, provide a JSON array with objects:
- index: the post index
- engagementPotential: "low", "medium", or "high" — how valuable is engaging with this?
- relevanceScore: 0-100 relevance to Conceivable
- riskLevel: "low", "medium", or "high" — risk of being seen as marketing
- draftResponse: a thoughtful, helpful response that Kirsten could post. Be warm, expert, evidence-based. Never mention Conceivable directly. Focus on being genuinely helpful. Include disclaimers where appropriate.

Return ONLY the JSON array.`,
    });

    const parsed = JSON.parse(result.response);

    return items.map((item, i) => {
      const analysis = parsed.find(
        (p: { index: number }) => p.index === i
      ) || {
        engagementPotential: "medium",
        relevanceScore: 50,
        riskLevel: "medium",
        draftResponse: "This post is relevant to our audience. Review for engagement opportunity.",
      };

      return {
        subreddit: item.subreddit,
        title: item.title,
        body: item.body,
        upvotes: item.upvotes,
        comments: item.comments,
        url: item.url,
        engagementPotential: analysis.engagementPotential || "medium",
        relevanceScore: analysis.relevanceScore || 50,
        riskLevel: analysis.riskLevel || "medium",
        draftResponse: analysis.draftResponse || "",
        status: "pending",
        timestamp: item.publishedAt,
      };
    });
  } catch (err) {
    console.error("[briefs/refresh] AI analysis failed for reddit:", err);
    return items.map((item) => ({
      subreddit: item.subreddit,
      title: item.title,
      body: item.body,
      upvotes: item.upvotes,
      comments: item.comments,
      url: item.url,
      engagementPotential: "medium",
      relevanceScore: 50,
      riskLevel: "medium",
      draftResponse: "Review this post for engagement opportunity.",
      status: "pending",
      timestamp: item.publishedAt,
    }));
  }
}
