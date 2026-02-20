import { TrainingDocument, VoiceProfile, DocumentType } from "@/types";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "documents");

/**
 * Process an uploaded document for the training & voice layer.
 * Splits the document into chunks for vector embedding.
 */
export async function processDocument(
  filePath: string,
  name: string,
  type: DocumentType,
  mimeType: string
): Promise<TrainingDocument> {
  const stats = await fs.stat(filePath);

  const content = await fs.readFile(filePath, "utf-8");
  const chunks = chunkText(content, 1000, 200);

  return {
    id: uuid(),
    name,
    type,
    filePath,
    fileSize: stats.size,
    mimeType,
    uploadedAt: new Date(),
    processedAt: new Date(),
    chunkCount: chunks.length,
    status: "indexed",
  };
}

/**
 * Split text into overlapping chunks for embedding.
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      // Keep overlap by taking the last portion
      const words = currentChunk.split(" ");
      const overlapWords = Math.ceil(overlap / 5); // approximate words for overlap
      currentChunk = words.slice(-overlapWords).join(" ") + " " + sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Ensure the upload directory exists.
 */
export async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * Save an uploaded file and return the path.
 */
export async function saveUploadedFile(
  file: Buffer,
  filename: string
): Promise<string> {
  await ensureUploadDir();
  const safeName = `${uuid()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  await fs.writeFile(filePath, file);
  return filePath;
}

/**
 * Build a voice profile from analyzed documents.
 * This would typically use the vector DB to find patterns.
 */
export function buildVoiceProfile(
  documentContents: string[]
): VoiceProfile {
  const allText = documentContents.join(" ");

  // Extract tone attributes from content analysis
  const toneAttributes = analyzeTone(allText);
  const vocabulary = extractKeyVocabulary(allText);
  const sentencePatterns = analyzeSentencePatterns(allText);
  const topicExpertise = extractTopics(allText);

  return {
    toneAttributes,
    vocabulary,
    sentencePatterns,
    topicExpertise,
    lastUpdated: new Date(),
  };
}

function analyzeTone(text: string): string[] {
  const tones: string[] = [];
  const lower = text.toLowerCase();

  if (lower.includes("empower") || lower.includes("strength"))
    tones.push("empowering");
  if (lower.includes("research") || lower.includes("study") || lower.includes("evidence"))
    tones.push("science-backed");
  if (lower.includes("feel") || lower.includes("journey") || lower.includes("story"))
    tones.push("warm");
  if (lower.includes("data") || lower.includes("insight"))
    tones.push("intelligent");

  return tones.length > 0 ? tones : ["intelligent", "empowering", "warm"];
}

function extractKeyVocabulary(text: string): string[] {
  // Extract frequently used meaningful words
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) ?? [];
  const freq = new Map<string, number>();
  const stopWords = new Set([
    "that", "this", "with", "from", "have", "been", "were",
    "they", "their", "about", "would", "could", "should",
    "which", "there", "these", "those", "then", "than",
    "into", "some", "more", "when", "what", "your",
  ]);

  for (const word of words) {
    if (!stopWords.has(word)) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

function analyzeSentencePatterns(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const patterns: string[] = [];

  const avgLength =
    sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) /
    (sentences.length || 1);

  if (avgLength < 15) patterns.push("concise");
  else if (avgLength > 25) patterns.push("long-form");
  else patterns.push("moderate-length");

  const questionCount = (text.match(/\?/g) ?? []).length;
  if (questionCount > sentences.length * 0.1) patterns.push("uses-questions");

  if (text.includes("—") || text.includes("–")) patterns.push("uses-dashes");
  if (text.includes("...")) patterns.push("uses-ellipsis");

  return patterns;
}

function extractTopics(text: string): string[] {
  const topicKeywords: Record<string, string[]> = {
    fertility: ["fertility", "conceive", "conception", "ovulation", "reproductive"],
    PCOS: ["pcos", "polycystic", "androgen", "insulin resistance"],
    endometriosis: ["endometriosis", "endo", "endometrial"],
    nutrition: ["supplement", "vitamin", "nutrient", "nutrition", "diet"],
    wellness: ["wellness", "health", "wellbeing", "self-care"],
    technology: ["app", "wearable", "technology", "digital", "AI"],
  };

  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(topic);
    }
  }

  return found;
}
