import { NextRequest, NextResponse } from "next/server";
import { getAllPOVs, addPOV, getPOVStats } from "@/lib/stores/pov-store";
import type { POVEntry, EmotionalTone } from "@/lib/data/pov-data";
import { invokeAgent } from "@/lib/agents/invoke";

export async function GET() {
  const povs = getAllPOVs();
  const stats = getPOVStats();
  return NextResponse.json({ povs, stats });
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
  const entry: POVEntry = {
    id,
    topic: topic || "Untitled POV",
    transcript,
    sourceType: sourceType || "voice",
    sourceId: sourceId || undefined,
    createdAt: new Date().toISOString(),
    durationSeconds: durationSeconds || undefined,
    keyPositions: [],
    analogies: [],
    emotionalTone: "",
    relatedTopics: [],
  };

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
    if (parsed.topic) entry.topic = topic || parsed.topic;
    if (Array.isArray(parsed.keyPositions))
      entry.keyPositions = parsed.keyPositions;
    if (Array.isArray(parsed.analogies)) entry.analogies = parsed.analogies;
    if (parsed.emotionalTone)
      entry.emotionalTone = parsed.emotionalTone as EmotionalTone;
    if (Array.isArray(parsed.relatedTopics))
      entry.relatedTopics = parsed.relatedTopics;
  } catch {
    // AI extraction failed — save with empty fields
    if (!topic) entry.topic = "Untitled POV";
  }

  const saved = addPOV(entry);
  return NextResponse.json(saved, { status: 201 });
}
