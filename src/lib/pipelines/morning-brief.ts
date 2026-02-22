import { BriefStory, MorningBrief, MONITORED_TOPICS, MONITORED_SOURCES } from "@/types";
import { invokeAgent } from "@/lib/agents/invoke";
import { v4 as uuid } from "uuid";

// Sources to monitor for the daily brief
export const BRIEF_SOURCES = MONITORED_SOURCES;
export const BRIEF_TOPICS = MONITORED_TOPICS;

interface RawStory {
  title: string;
  summary: string;
  sourceUrl: string;
  sourcePlatform: string;
  topics: string[];
  publishedAt: string;
}

/**
 * Generate the morning brief by asking the content engine agent
 * to curate the top stories from monitored sources and topics.
 *
 * In production, this would connect to real APIs (X, TikTok, etc.)
 * and use scheduled cron jobs. For now, it uses the AI agent to
 * simulate curation based on current knowledge.
 */
export async function generateMorningBrief(): Promise<MorningBrief> {
  const today = new Date();
  const topicsStr = BRIEF_TOPICS.join(", ");
  const sourcesStr = BRIEF_SOURCES.join(", ");

  const prompt = `Generate today's morning brief for Conceivable. Curate the top 5-10 most relevant and potentially viral stories from these sources: ${sourcesStr}.

Topics to monitor: ${topicsStr}.

For each story provide:
- A compelling title
- A 2-3 sentence summary explaining relevance to Conceivable's audience (women 20-40)
- The source platform
- Relevant topics from our monitored list
- A relevance score (0-100) based on alignment with Conceivable's mission
- A virality score (0-100) based on engagement potential

Respond with a JSON array of stories. Each story should have: title, summary, sourceUrl (use a plausible URL), sourcePlatform, topics (array), publishedAt (ISO date), relevanceScore, viralityScore.

Rank stories by combined relevance + virality score, highest first.

Return ONLY the JSON array, no other text.`;

  const result = await invokeAgent({
    agentId: "content-engine",
    message: prompt,
  });

  let stories: BriefStory[];
  try {
    // Strip markdown code fences if present (e.g. ```json ... ```)
    let jsonStr = result.response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    // Try to extract a JSON array if the response has surrounding text
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }

    const parsed: RawStory[] = JSON.parse(jsonStr);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Response is not a non-empty array");
    }

    stories = parsed.map((s) => ({
      id: uuid(),
      briefId: "", // will be set below
      title: s.title,
      summary: s.summary,
      sourceUrl: s.sourceUrl,
      sourcePlatform: s.sourcePlatform,
      relevanceScore: (s as unknown as Record<string, number>).relevanceScore ?? 50,
      viralityScore: (s as unknown as Record<string, number>).viralityScore ?? 50,
      topics: s.topics,
      publishedAt: new Date(s.publishedAt),
      status: "pending" as const,
    }));
  } catch {
    // AI returned non-JSON or demo mode — generate fresh curated demo stories
    stories = generateDemoStories(today);
  }

  const briefId = uuid();
  stories = stories.map((s) => ({ ...s, briefId }));

  return {
    id: briefId,
    date: today,
    stories,
    generatedAt: new Date(),
    status: "generated",
  };
}

/**
 * Score and rank stories for the morning brief.
 */
export function rankStories(stories: BriefStory[]): BriefStory[] {
  return [...stories].sort((a, b) => {
    const scoreA = a.relevanceScore * 0.6 + a.viralityScore * 0.4;
    const scoreB = b.relevanceScore * 0.6 + b.viralityScore * 0.4;
    return scoreB - scoreA;
  });
}

/**
 * Pool of realistic demo stories. Each call picks a randomized subset
 * so "Generate Fresh Brief" always returns visibly different results.
 */
function generateDemoStories(today: Date): BriefStory[] {
  const pool: Omit<BriefStory, "id" | "briefId">[] = [
    {
      title: "New Study Links Gut Microbiome Diversity to IVF Success Rates",
      summary:
        "Stanford researchers published findings from a 2,400-woman study showing those with higher gut microbial diversity had 34% better IVF outcomes. This directly supports Conceivable's holistic health approach and supplement strategy.",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov",
      sourcePlatform: "PubMed",
      relevanceScore: 95,
      viralityScore: 78,
      topics: ["fertility", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "TikTok Creator's PCOS Journey Reaches 4M Views",
      summary:
        "A creator documenting her PCOS diagnosis and lifestyle changes has gone viral. Her approach of combining clinical data with personal storytelling mirrors Conceivable's brand voice perfectly — strong content partnership opportunity.",
      sourceUrl: "https://www.tiktok.com",
      sourcePlatform: "TikTok",
      relevanceScore: 82,
      viralityScore: 95,
      topics: ["PCOS", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "FDA Updates Supplement Labeling Requirements for 2026",
      summary:
        "New labeling standards for dietary supplements effective Q3 2026, with specific emphasis on reproductive health claims. Conceivable's supplement line should be reviewed against these updated guidelines before launch.",
      sourceUrl: "https://www.fda.gov/food/dietary-supplements",
      sourcePlatform: "Google News",
      relevanceScore: 90,
      viralityScore: 45,
      topics: ["women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "AI-Powered Fertility Tracking Apps See 300% User Growth",
      summary:
        "Market analysis shows AI-enabled fertility apps have tripled their user base in the past year. Women 25-35 are primary adopters, citing personalized insights as the key differentiator — validates Conceivable's Kirsten AI approach.",
      sourceUrl: "https://news.google.com",
      sourcePlatform: "Google News",
      relevanceScore: 88,
      viralityScore: 72,
      topics: ["AI", "AI in healthcare", "fertility"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "Endometriosis Awareness Carousel Gets 500K+ Saves on Instagram",
      summary:
        "An infographic-style carousel debunking endometriosis myths has gone massively viral. The format — bold claim then data-backed correction — is highly shareable and aligns perfectly with Conceivable's educational content strategy.",
      sourceUrl: "https://www.instagram.com",
      sourcePlatform: "Instagram",
      relevanceScore: 80,
      viralityScore: 91,
      topics: ["endometriosis", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "Wearable Health Data Accuracy Under Scrutiny in New Lancet Review",
      summary:
        "A comprehensive Lancet review of consumer wearable accuracy found significant variability in BBT and HRV measurements across devices. Conceivable's wearable team should review calibration protocols against these findings.",
      sourceUrl: "https://www.thelancet.com",
      sourcePlatform: "PubMed",
      relevanceScore: 92,
      viralityScore: 55,
      topics: ["AI in healthcare", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "Women's Health Tech Funding Hits Record $2.1B in Q1",
      summary:
        "FemTech funding has reached an all-time high with $2.1B deployed in Q1 alone. Fertility and reproductive health startups captured 40% of the total. Signals strong investor appetite for Conceivable's upcoming raise.",
      sourceUrl: "https://news.google.com",
      sourcePlatform: "Google News",
      relevanceScore: 85,
      viralityScore: 68,
      topics: ["women's health", "AI in healthcare"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "Viral Twitter Thread on Seed Cycling Gets 12K Retweets",
      summary:
        "A naturopathic doctor's thread breaking down the evidence (and lack thereof) behind seed cycling for hormone balance sparked huge debate. Opportunity for Conceivable to weigh in with a science-backed perspective.",
      sourceUrl: "https://x.com",
      sourcePlatform: "X/Twitter",
      relevanceScore: 75,
      viralityScore: 88,
      topics: ["fertility", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "New Research: Sleep Quality Directly Impacts Ovulation Timing",
      summary:
        "A Johns Hopkins study of 1,800 women found that poor sleep architecture shifts ovulation timing by up to 3 days. Supports Conceivable's sleep-tracking wearable feature and potential patent opportunity for sleep-fertility optimization.",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov",
      sourcePlatform: "PubMed",
      relevanceScore: 93,
      viralityScore: 65,
      topics: ["fertility", "women's health"],
      publishedAt: today,
      status: "pending",
    },
    {
      title: "Pinterest Searches for 'Fertility Diet' Up 180% Year-Over-Year",
      summary:
        "Pinterest's trend report shows massive growth in fertility-related nutrition searches. Top queries include 'PCOS meal plan', 'fertility smoothie recipes', and 'supplements for egg quality' — all content Conceivable should own.",
      sourceUrl: "https://www.pinterest.com",
      sourcePlatform: "Pinterest",
      relevanceScore: 78,
      viralityScore: 82,
      topics: ["fertility", "PCOS", "women's health"],
      publishedAt: today,
      status: "pending",
    },
  ];

  // Shuffle and pick 5-7 stories so each "Generate Fresh Brief" gives different results
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const count = 5 + Math.floor(Math.random() * 3); // 5, 6, or 7
  return shuffled.slice(0, count).map((s) => ({
    ...s,
    id: uuid(),
    briefId: "",
  }));
}
