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
    const parsed: RawStory[] = JSON.parse(jsonStr);
    stories = parsed.map((s, index) => ({
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
    // If parsing fails, create a single story from the raw response
    stories = [
      {
        id: uuid(),
        briefId: "",
        title: "Morning Brief Summary",
        summary: result.response.slice(0, 500),
        sourceUrl: "",
        sourcePlatform: "ai-generated",
        relevanceScore: 50,
        viralityScore: 50,
        topics: [],
        publishedAt: today,
        status: "pending" as const,
      },
    ];
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
