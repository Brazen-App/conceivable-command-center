import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { EmotionalTone } from "@/lib/data/pov-data";
import { invokeAgent } from "@/lib/agents/invoke";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const povs = await prisma.pOV.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Compute stats
    const allTopics = new Set<string>();
    const toneDistribution: Record<string, number> = {};
    const topicFreq: Record<string, number> = {};

    for (const pov of povs) {
      const related = pov.relatedTopics as string[];
      for (const t of related) {
        const key = t.toLowerCase();
        allTopics.add(key);
        topicFreq[key] = (topicFreq[key] || 0) + 1;
      }
      if (pov.emotionalTone) {
        toneDistribution[pov.emotionalTone] =
          (toneDistribution[pov.emotionalTone] || 0) + 1;
      }
    }

    const sortedTopics = Object.entries(topicFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic]) => topic);

    const stats = {
      total: povs.length,
      topics: sortedTopics,
      topicCount: allTopics.size,
      toneDistribution,
    };

    return NextResponse.json({ povs, stats });
  } catch (error) {
    console.error("[pov] GET", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, transcript, sourceType, sourceId, durationSeconds } = body;

  if (!transcript) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 }
    );
  }

  const id = `pov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  let finalTopic = topic || "Untitled POV";
  let keyPositions: string[] = [];
  let analogies: string[] = [];
  let emotionalTone = "";
  let relatedTopics: string[] = [];

  // Attempt AI extraction — graceful fallback if agent fails
  try {
    const result = await invokeAgent({
      agentId: "content-engine",
      message: `Analyze this CEO POV recording transcript and extract structured insights. Return ONLY valid JSON with no extra text.

Transcript:
"""
${transcript}
"""

Return this exact JSON structure:
{
  "topic": "a concise 5-10 word topic title",
  "keyPositions": ["array of 3-5 key positions/arguments made"],
  "analogies": ["array of any analogies or metaphors used, empty if none"],
  "emotionalTone": "one of: passionate, confident, warm-educational, excited, strategic-calm, energized, urgent, measured",
  "relatedTopics": ["array of 3-6 related business/science topics as lowercase tags"]
}`,
    });

    const parsed = JSON.parse(result.response);
    if (parsed.topic) finalTopic = topic || parsed.topic;
    if (Array.isArray(parsed.keyPositions)) keyPositions = parsed.keyPositions;
    if (Array.isArray(parsed.analogies)) analogies = parsed.analogies;
    if (parsed.emotionalTone) emotionalTone = parsed.emotionalTone as EmotionalTone;
    if (Array.isArray(parsed.relatedTopics)) relatedTopics = parsed.relatedTopics;
  } catch (error) {
    console.error("[pov] AI extraction failed", error);
    // AI extraction failed — save with empty fields
  }

  try {
    const saved = await prisma.pOV.create({
      data: {
        id,
        topic: finalTopic,
        transcript,
        sourceType: sourceType || "voice",
        sourceId: sourceId || null,
        durationSeconds: durationSeconds || null,
        keyPositions,
        analogies,
        emotionalTone: emotionalTone || null,
        relatedTopics,
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("[pov] POST", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
