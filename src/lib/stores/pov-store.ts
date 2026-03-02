// POV Knowledge Base — Shared mutable store
// Used by /api/pov and /api/pov/search routes

import { SEED_POVS, type POVEntry } from "@/lib/data/pov-data";

let povs: POVEntry[] = [...SEED_POVS];

export function getAllPOVs(): POVEntry[] {
  return [...povs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addPOV(entry: POVEntry): POVEntry {
  povs = [entry, ...povs];
  return entry;
}

export function searchPOVs(query: string): POVEntry[] {
  const q = query.toLowerCase();
  return povs
    .filter(
      (p) =>
        p.topic.toLowerCase().includes(q) ||
        p.transcript.toLowerCase().includes(q) ||
        p.keyPositions.some((k) => k.toLowerCase().includes(q)) ||
        p.relatedTopics.some((t) => t.toLowerCase().includes(q)) ||
        p.analogies.some((a) => a.toLowerCase().includes(q))
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getPOVStats(): {
  total: number;
  topics: string[];
  topicCount: number;
  toneDistribution: Record<string, number>;
} {
  const allTopics = new Set<string>();
  const toneDistribution: Record<string, number> = {};

  for (const pov of povs) {
    // Collect related topics for unique topic count
    for (const t of pov.relatedTopics) {
      allTopics.add(t.toLowerCase());
    }
    // Count tones
    if (pov.emotionalTone) {
      toneDistribution[pov.emotionalTone] =
        (toneDistribution[pov.emotionalTone] || 0) + 1;
    }
  }

  // Get the top topics by frequency
  const topicFreq: Record<string, number> = {};
  for (const pov of povs) {
    for (const t of pov.relatedTopics) {
      const key = t.toLowerCase();
      topicFreq[key] = (topicFreq[key] || 0) + 1;
    }
  }
  const sortedTopics = Object.entries(topicFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic]) => topic);

  return {
    total: povs.length,
    topics: sortedTopics,
    topicCount: allTopics.size,
    toneDistribution,
  };
}
