// ============================================================
// Conceivable Command Center — Core Type Definitions
// ============================================================

// --------------- Agent System ---------------

export type AgentDivision =
  | "executive-coach"
  | "marketing"
  | "legal"
  | "scientific-research"
  | "content-engine";

export type AgentStatus = "idle" | "working" | "error" | "disabled";

export interface AgentConfig {
  id: string;
  division: AgentDivision;
  name: string;
  description: string;
  systemPrompt: string;
  status: AgentStatus;
  capabilities: string[];
  icon: string;
}

export interface AgentMessage {
  id: string;
  agentId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

// --------------- Content Engine — Pipelines ---------------

export type PipelineType =
  | "morning-brief"
  | "content-creation"
  | "viral-analyzer"
  | "training-voice";

export type ContentPlatform =
  | "linkedin"
  | "instagram-post"
  | "instagram-carousel"
  | "pinterest"
  | "tiktok"
  | "youtube"
  | "blog"
  | "circle";

export type BriefStatus = "pending" | "reviewed" | "selected" | "dismissed";

export type ContentStatus =
  | "draft"
  | "in-review"
  | "approved"
  | "published"
  | "rejected";

// Morning Brief types
export interface BriefStory {
  id: string;
  briefId: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourcePlatform: string;
  relevanceScore: number;
  viralityScore: number;
  topics: string[];
  publishedAt: Date;
  status: BriefStatus;
}

export interface MorningBrief {
  id: string;
  date: Date;
  stories: BriefStory[];
  generatedAt: Date;
  status: "generated" | "reviewed" | "actioned";
}

// Content Creation types
export interface ContentPiece {
  id: string;
  platform: ContentPlatform;
  title: string;
  body: string;
  imagePrompt?: string;
  imageUrl?: string;
  hashtags: string[];
  status: ContentStatus;
  sourceStoryId?: string;
  founderPov?: string;
  createdAt: Date;
  publishedAt?: Date;
}

export interface ContentBatch {
  id: string;
  topic: string;
  founderAngle: string;
  pieces: ContentPiece[];
  sourceStoryId?: string;
  createdAt: Date;
  status: "generating" | "in-review" | "approved" | "published";
}

// Viral Analyzer types
export interface ViralInsight {
  id: string;
  sourceUrl: string;
  platform: string;
  hook: string;
  format: string;
  emotionalTriggers: string[];
  engagementMetrics: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
  };
  rewrittenContent: string;
  analyzedAt: Date;
}

// --------------- Training & Voice Layer ---------------

export type DocumentType =
  | "book"
  | "video-transcript"
  | "brand-guidelines"
  | "script"
  | "article"
  | "other";

export interface TrainingDocument {
  id: string;
  name: string;
  type: DocumentType;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  processedAt?: Date;
  chunkCount: number;
  status: "uploading" | "processing" | "indexed" | "error";
}

export interface VoiceProfile {
  toneAttributes: string[];
  vocabulary: string[];
  sentencePatterns: string[];
  topicExpertise: string[];
  lastUpdated: Date;
}

// --------------- Dashboard ---------------

export interface DashboardSection {
  id: string;
  title: string;
  division: AgentDivision;
  description: string;
  icon: string;
  href: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  agentDivision?: AgentDivision;
  createdAt: Date;
}

// --------------- Monitoring Topics ---------------

export const MONITORED_TOPICS = [
  "infertility",
  "fertility",
  "PCOS",
  "endometriosis",
  "women's health",
  "AI",
  "AI in healthcare",
  "women's rights",
] as const;

export const MONITORED_SOURCES = [
  "x-twitter",
  "tiktok",
  "instagram",
  "google-news",
  "pubmed",
] as const;
