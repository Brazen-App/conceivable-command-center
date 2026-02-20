import { ViralInsight } from "@/types";
import { invokeAgent } from "@/lib/agents/invoke";
import { v4 as uuid } from "uuid";

/**
 * Analyze a piece of viral content and extract patterns.
 * In production, this would run continuously against real platform APIs.
 */
export async function analyzeViralContent(
  contentUrl: string,
  platform: string,
  contentText: string
): Promise<ViralInsight> {
  const prompt = `Analyze this viral content from ${platform} that's relevant to Conceivable's topics (fertility, women's health, PCOS, endometriosis, wellness, AI in healthcare).

Content URL: ${contentUrl}
Platform: ${platform}
Content: ${contentText}

Analyze:
1. What's the hook? (The first line/moment that grabs attention)
2. What format does it use? (listicle, story, hot take, educational, emotional reveal, etc.)
3. What emotional triggers drive engagement? (list them)
4. Why is it performing well? (be specific about structure and psychology)
5. Rewrite this content from Conceivable's POV — maintaining the effective structure but with our brand voice (intelligent, empowering, science-backed, warm) and our founder's perspective.

Respond in JSON format:
{
  "hook": "the opening hook",
  "format": "format type",
  "emotionalTriggers": ["trigger1", "trigger2"],
  "analysis": "why it works",
  "rewrittenContent": "the full rewritten piece"
}

Return ONLY the JSON, no other text.`;

  const result = await invokeAgent({
    agentId: "content-engine",
    message: prompt,
  });

  try {
    const parsed = JSON.parse(result.response);
    return {
      id: uuid(),
      sourceUrl: contentUrl,
      platform,
      hook: parsed.hook ?? "",
      format: parsed.format ?? "",
      emotionalTriggers: parsed.emotionalTriggers ?? [],
      engagementMetrics: {},
      rewrittenContent: parsed.rewrittenContent ?? "",
      analyzedAt: new Date(),
    };
  } catch {
    return {
      id: uuid(),
      sourceUrl: contentUrl,
      platform,
      hook: "Analysis pending",
      format: "unknown",
      emotionalTriggers: [],
      engagementMetrics: {},
      rewrittenContent: result.response,
      analyzedAt: new Date(),
    };
  }
}

/**
 * Extract viral patterns from multiple analyzed pieces
 * to feed back into content creation.
 */
export function extractPatterns(insights: ViralInsight[]) {
  const hookPatterns = new Map<string, number>();
  const formatPatterns = new Map<string, number>();
  const triggerPatterns = new Map<string, number>();

  for (const insight of insights) {
    // Count format frequencies
    const format = insight.format.toLowerCase();
    formatPatterns.set(format, (formatPatterns.get(format) ?? 0) + 1);

    // Count emotional trigger frequencies
    for (const trigger of insight.emotionalTriggers) {
      const t = trigger.toLowerCase();
      triggerPatterns.set(t, (triggerPatterns.get(t) ?? 0) + 1);
    }

    // Categorize hooks
    const hookType = categorizeHook(insight.hook);
    hookPatterns.set(hookType, (hookPatterns.get(hookType) ?? 0) + 1);
  }

  return {
    topFormats: sortMap(formatPatterns).slice(0, 5),
    topTriggers: sortMap(triggerPatterns).slice(0, 10),
    topHookTypes: sortMap(hookPatterns).slice(0, 5),
    totalAnalyzed: insights.length,
  };
}

function categorizeHook(hook: string): string {
  const lower = hook.toLowerCase();
  if (lower.includes("?")) return "question";
  if (lower.includes("nobody") || lower.includes("no one"))
    return "contrarian";
  if (lower.match(/\d/)) return "statistic";
  if (lower.includes("i ") || lower.includes("my ")) return "personal-story";
  if (lower.includes("stop") || lower.includes("don't"))
    return "warning";
  return "statement";
}

function sortMap(map: Map<string, number>): Array<{ key: string; count: number }> {
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}
