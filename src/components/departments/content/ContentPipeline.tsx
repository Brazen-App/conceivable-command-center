"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Linkedin,
  Instagram,
  Youtube,
  PenTool,
  Image as ImageIcon,
  Send,
  Loader2,
  CheckCircle2,
  Edit3,
  X,
  Sparkles,
  Pin,
  Video,
  BookOpen,
  AlertCircle,
  RotateCcw,
  Users,
} from "lucide-react";

interface ContentPieceProps {
  sourceId: string;
  sourceTitle: string;
  sourceType: "news" | "research";
  transcript: string;
}

interface Props {
  queue: ContentPieceProps[];
}

interface ContentCard {
  id: string;
  platform: string;
  title: string;
  body: string;
  imageUrl: string | null;
  imageLoading: boolean;
  status: "draft" | "editing" | "released";
  publishing: boolean;
  publishError: string | null;
}

interface SourceItem {
  source: ContentPieceProps;
  genStatus: "generating" | "ready" | "error";
  error: string | null;
  cards: ContentCard[];
}

const PLATFORM_META: Record<
  string,
  { label: string; icon: typeof Linkedin; color: string; gradient: string }
> = {
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    gradient: "linear-gradient(135deg, #0A66C2, #004182)",
  },
  "instagram-post": {
    label: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    gradient: "linear-gradient(135deg, #E4405F, #833AB4)",
  },
  "instagram-carousel": {
    label: "IG Carousel",
    icon: Instagram,
    color: "#833AB4",
    gradient: "linear-gradient(135deg, #833AB4, #E4405F)",
  },
  pinterest: {
    label: "Pinterest",
    icon: Pin,
    color: "#BD081C",
    gradient: "linear-gradient(135deg, #BD081C, #8C0615)",
  },
  tiktok: {
    label: "TikTok",
    icon: Video,
    color: "#25F4EE",
    gradient: "linear-gradient(135deg, #25F4EE, #FE2C55)",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000, #CC0000)",
  },
  blog: {
    label: "Blog",
    icon: BookOpen,
    color: "#1EAA55",
    gradient: "linear-gradient(135deg, #1EAA55, #0D7A3E)",
  },
  circle: {
    label: "Circle",
    icon: Users,
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)",
  },
};

function getTwoSentencePreview(text: string): string {
  const clean = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    return sentences.slice(0, 2).join("").trim();
  }
  return clean.slice(0, 160) + (clean.length > 160 ? "..." : "");
}

function getDefaultMeta() {
  return {
    label: "Content",
    icon: PenTool,
    color: "#5A6FFF",
    gradient: "linear-gradient(135deg, #5A6FFF, #3B4FCC)",
  };
}

// ────────────────────────────────────────────
// Individual Draft Card
// ────────────────────────────────────────────

function DraftCard({
  card,
  onEdit,
  onSave,
  onCancel,
  onRelease,
  onGenerateImage,
}: {
  card: ContentCard;
  onEdit: () => void;
  onSave: (newBody: string) => void;
  onCancel: () => void;
  onRelease: () => void;
  onGenerateImage: () => void;
}) {
  const [editBody, setEditBody] = useState(card.body);
  const [expanded, setExpanded] = useState(false);
  const meta = PLATFORM_META[card.platform] || getDefaultMeta();
  const Icon = meta.icon;
  const preview = getTwoSentencePreview(card.body);

  useEffect(() => {
    setEditBody(card.body);
  }, [card.body]);

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      {/* Image area */}
      <div
        className="relative h-40 flex items-center justify-center cursor-pointer"
        style={{ background: card.imageUrl ? undefined : meta.gradient }}
        onClick={() => !card.imageUrl && !card.imageLoading && onGenerateImage()}
      >
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        ) : card.imageLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-white/70 animate-spin" />
            <span className="text-white/60 text-xs">Generating image...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ImageIcon size={20} className="text-white/60" />
            </div>
            <span className="text-white/50 text-[10px] uppercase tracking-wider">
              Click to generate image
            </span>
          </div>
        )}

        {/* Platform badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Icon size={11} />
          {meta.label}
        </div>

        {card.status === "released" && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold">
            <CheckCircle2 size={10} /> Released
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4 flex-1 flex flex-col">
        {card.status === "editing" ? (
          <div className="flex-1">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full h-40 text-xs leading-relaxed rounded-lg p-3 resize-none focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onSave(editBody)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: "#1EAA55" }}
              >
                <CheckCircle2 size={12} /> Save
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  color: "var(--muted)",
                  backgroundColor: "var(--background)",
                }}
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-xs leading-relaxed cursor-pointer"
              style={{ color: "var(--foreground)" }}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? card.body.slice(0, 1200) : preview}
              {!expanded && card.body.length > 160 && (
                <span
                  className="text-[10px] ml-1"
                  style={{ color: "#5A6FFF" }}
                >
                  Read more
                </span>
              )}
              {expanded && (
                <span
                  className="text-[10px] ml-1"
                  style={{ color: "#5A6FFF" }}
                >
                  Show less
                </span>
              )}
            </p>

            {card.publishError && (
              <div
                className="mt-2 flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: "#E24D4710",
                  color: "#E24D47",
                }}
              >
                <AlertCircle size={10} /> {card.publishError}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-auto pt-3">
              {card.status !== "released" ? (
                <>
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={onRelease}
                    disabled={card.publishing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white flex-1 justify-center disabled:opacity-50"
                    style={{ backgroundColor: "#5A6FFF" }}
                  >
                    {card.publishing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Send size={12} />
                    )}
                    {card.publishing ? "Releasing..." : "Release"}
                  </button>
                </>
              ) : (
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center"
                  style={{ color: "#1EAA55" }}
                >
                  <CheckCircle2 size={12} /> Released
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Skeleton Card (loading state)
// ────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div
        className="h-40 animate-pulse"
        style={{ backgroundColor: "var(--background)" }}
      />
      <div className="p-4 space-y-3">
        <div
          className="h-3 w-24 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--background)" }}
        />
        <div
          className="h-3 w-full rounded-full animate-pulse"
          style={{ backgroundColor: "var(--background)" }}
        />
        <div
          className="h-3 w-3/4 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--background)" }}
        />
        <div className="flex gap-2 pt-2">
          <div
            className="h-8 flex-1 rounded-xl animate-pulse"
            style={{ backgroundColor: "var(--background)" }}
          />
          <div
            className="h-8 flex-1 rounded-xl animate-pulse"
            style={{ backgroundColor: "var(--background)" }}
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Main Content Pipeline
// ────────────────────────────────────────────

export default function ContentPipeline({ queue }: Props) {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const generatedRef = useRef(new Set<string>());

  const updateCards = useCallback(
    (sourceId: string, updater: (cards: ContentCard[]) => ContentCard[]) => {
      setSources((prev) =>
        prev.map((s) =>
          s.source.sourceId === sourceId
            ? { ...s, cards: updater(s.cards) }
            : s
        )
      );
    },
    []
  );

  const generateImageForCard = useCallback(
    async (
      sourceId: string,
      cardId: string,
      platform: string,
      topic: string,
      body: string
    ) => {
      updateCards(sourceId, (cards) =>
        cards.map((c) =>
          c.id === cardId ? { ...c, imageLoading: true } : c
        )
      );

      try {
        const promptRes = await fetch("/api/content/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, topic, contentBody: body }),
        });

        if (!promptRes.ok) throw new Error("Image prompt failed");
        const promptData = await promptRes.json();
        if (promptData.error) throw new Error(promptData.error);

        const imageRes = await fetch("/api/content/generate-image-actual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptData.prompt,
            aspectRatio: promptData.aspectRatio || "1:1",
            style: promptData.style || "photography",
          }),
        });

        if (!imageRes.ok) throw new Error("Image generation failed");
        const imageData = await imageRes.json();
        if (imageData.error) throw new Error(imageData.error);

        updateCards(sourceId, (cards) =>
          cards.map((c) =>
            c.id === cardId
              ? { ...c, imageUrl: imageData.imageData, imageLoading: false }
              : c
          )
        );
      } catch {
        updateCards(sourceId, (cards) =>
          cards.map((c) =>
            c.id === cardId ? { ...c, imageLoading: false } : c
          )
        );
      }
    },
    [updateCards]
  );

  const generateContent = useCallback(
    async (item: ContentPieceProps) => {
      try {
        const res = await fetch("/api/content/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: item.sourceTitle,
            founderAngle: item.transcript,
            sourceStoryId: item.sourceId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Generation failed");
        }

        const data = await res.json();
        const cards: ContentCard[] = (data.pieces || []).map(
          (
            p: { platform: string; title: string; body: string },
            i: number
          ) => ({
            id: `${item.sourceId}-${i}`,
            platform: p.platform,
            title: p.title,
            body: p.body,
            imageUrl: null,
            imageLoading: false,
            status: "draft" as const,
            publishing: false,
            publishError: null,
          })
        );

        setSources((prev) =>
          prev.map((s) =>
            s.source.sourceId === item.sourceId
              ? { ...s, genStatus: "ready", error: null, cards }
              : s
          )
        );

        // Auto-generate images in the background
        for (const card of cards) {
          generateImageForCard(
            item.sourceId,
            card.id,
            card.platform,
            item.sourceTitle,
            card.body
          );
        }
      } catch (err) {
        setSources((prev) =>
          prev.map((s) =>
            s.source.sourceId === item.sourceId
              ? {
                  ...s,
                  genStatus: "error",
                  error:
                    err instanceof Error ? err.message : "Unknown error",
                }
              : s
          )
        );
      }
    },
    [generateImageForCard]
  );

  // Auto-generate content when new queue items arrive
  useEffect(() => {
    for (const item of queue) {
      if (generatedRef.current.has(item.sourceId)) continue;
      generatedRef.current.add(item.sourceId);

      setSources((prev) => [
        ...prev,
        {
          source: item,
          genStatus: "generating",
          error: null,
          cards: [],
        },
      ]);

      generateContent(item);
    }
  }, [queue, generateContent]);

  const handleEdit = (sourceId: string, cardId: string) => {
    updateCards(sourceId, (cards) =>
      cards.map((c) =>
        c.id === cardId ? { ...c, status: "editing" as const } : c
      )
    );
  };

  const handleSave = (sourceId: string, cardId: string, newBody: string) => {
    updateCards(sourceId, (cards) =>
      cards.map((c) =>
        c.id === cardId
          ? { ...c, body: newBody, status: "draft" as const }
          : c
      )
    );
  };

  const handleCancel = (sourceId: string, cardId: string) => {
    updateCards(sourceId, (cards) =>
      cards.map((c) =>
        c.id === cardId ? { ...c, status: "draft" as const } : c
      )
    );
  };

  const handleRelease = async (sourceId: string, cardId: string) => {
    const source = sources.find((s) => s.source.sourceId === sourceId);
    if (!source) return;
    const card = source.cards.find((c) => c.id === cardId);
    if (!card) return;

    updateCards(sourceId, (cards) =>
      cards.map((c) =>
        c.id === cardId ? { ...c, publishing: true, publishError: null } : c
      )
    );

    try {
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieces: [
            { platform: card.platform, copy: card.body, hashtags: [], title: card.title },
          ],
        }),
      });
      const result = await res.json();

      if (result.error || result.results?.[0]?.ok === false) {
        updateCards(sourceId, (cards) =>
          cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  publishing: false,
                  publishError:
                    result.error ||
                    result.results?.[0]?.error ||
                    "Publish failed",
                }
              : c
          )
        );
      } else {
        updateCards(sourceId, (cards) =>
          cards.map((c) =>
            c.id === cardId
              ? {
                  ...c,
                  status: "released" as const,
                  publishing: false,
                  publishError: null,
                }
              : c
          )
        );
      }
    } catch (err) {
      updateCards(sourceId, (cards) =>
        cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                publishing: false,
                publishError:
                  err instanceof Error ? err.message : "Network error",
              }
            : c
        )
      );
    }
  };

  const handleReleaseAll = async (sourceId: string) => {
    const source = sources.find((s) => s.source.sourceId === sourceId);
    if (!source) return;
    for (const card of source.cards) {
      if (card.status === "draft") {
        await handleRelease(sourceId, card.id);
      }
    }
  };

  const handleRetry = (item: ContentPieceProps) => {
    generatedRef.current.delete(item.sourceId);
    setSources((prev) =>
      prev.map((s) =>
        s.source.sourceId === item.sourceId
          ? { ...s, genStatus: "generating" as const, error: null, cards: [] }
          : s
      )
    );
    generateContent(item);
  };

  // Empty state
  if (queue.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Sparkles
          size={32}
          style={{ color: "#F1C02840" }}
          className="mx-auto mb-3"
        />
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--foreground)" }}
        >
          No content in the pipeline yet
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Go to the Daily Brief, find a story, and click &ldquo;Create
          Drafts&rdquo; to generate platform-specific content with images.
        </p>
      </div>
    );
  }

  return (
    <div>
      {sources.map((sourceItem) => {
        const draftCount = sourceItem.cards.filter(
          (c) => c.status === "draft"
        ).length;
        const releasedCount = sourceItem.cards.filter(
          (c) => c.status === "released"
        ).length;

        return (
          <div key={sourceItem.source.sourceId} className="mb-8">
            {/* Source header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#F1C02814" }}
              >
                <Sparkles size={16} style={{ color: "#F1C028" }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {sourceItem.source.sourceTitle}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {sourceItem.genStatus === "generating"
                    ? "Generating drafts across all platforms... this takes about a minute"
                    : sourceItem.genStatus === "error"
                    ? `Error: ${sourceItem.error}`
                    : `${sourceItem.cards.length} drafts \u00B7 ${releasedCount} released \u00B7 ${draftCount} pending`}
                </p>
              </div>
              {sourceItem.genStatus === "ready" && draftCount > 0 && (
                <button
                  onClick={() =>
                    handleReleaseAll(sourceItem.source.sourceId)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: "#5A6FFF" }}
                >
                  <Send size={12} /> Release All
                </button>
              )}
              {sourceItem.genStatus === "error" && (
                <button
                  onClick={() => handleRetry(sourceItem.source)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ color: "#E24D47" }}
                >
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>

            {/* Cards grid */}
            {sourceItem.genStatus === "generating" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : sourceItem.genStatus === "error" ? (
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  backgroundColor: "#E24D4710",
                  border: "1px solid #E24D4730",
                }}
              >
                <AlertCircle size={16} style={{ color: "#E24D47" }} />
                <p className="text-xs" style={{ color: "#E24D47" }}>
                  {sourceItem.error}. Click Retry to try again.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sourceItem.cards.map((card) => (
                  <DraftCard
                    key={card.id}
                    card={card}
                    onEdit={() =>
                      handleEdit(sourceItem.source.sourceId, card.id)
                    }
                    onSave={(newBody) =>
                      handleSave(
                        sourceItem.source.sourceId,
                        card.id,
                        newBody
                      )
                    }
                    onCancel={() =>
                      handleCancel(sourceItem.source.sourceId, card.id)
                    }
                    onRelease={() =>
                      handleRelease(sourceItem.source.sourceId, card.id)
                    }
                    onGenerateImage={() =>
                      generateImageForCard(
                        sourceItem.source.sourceId,
                        card.id,
                        card.platform,
                        sourceItem.source.sourceTitle,
                        card.body
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
