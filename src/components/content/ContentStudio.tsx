"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Linkedin,
  Instagram,
  Youtube,
  PenTool,
  Send,
  Loader2,
  CheckCircle,
  Eye,
  Edit3,
  X,
  ImageIcon,
  Palette,
  Sparkles,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { ContentPlatform } from "@/types";

interface ImagePromptData {
  prompt: string;
  alt: string;
  style: string;
  aspectRatio: string;
  textOverlay: string | null;
  colorPalette: string[];
}

interface GeneratedPiece {
  platform: ContentPlatform;
  title: string;
  body: string;
  imagePrompt?: ImagePromptData;
  imageUrl?: string; // Actual generated image (base64 data URL from Nano Banana)
  status: "draft" | "approved" | "rejected";
}

interface PublishResult {
  platform: string;
  success: boolean;
  message: string;
}

interface ConnectedPlatforms {
  linkedin: boolean;
  instagram: boolean;
  x: boolean;
  pinterest: boolean;
}

const PLATFORM_IMAGE_DEFAULTS: Record<ContentPlatform, { style: string; aspectRatio: string }> = {
  linkedin: { style: "photography", aspectRatio: "1:1" },
  x: { style: "photography", aspectRatio: "16:9" },
  bluesky: { style: "photography", aspectRatio: "16:9" },
  "instagram-post": { style: "photography", aspectRatio: "1:1" },
  "instagram-carousel": { style: "illustration", aspectRatio: "1:1" },
  pinterest: { style: "infographic", aspectRatio: "2:3" },
  tiktok: { style: "photography", aspectRatio: "9:16" },
  youtube: { style: "photography", aspectRatio: "16:9" },
  blog: { style: "photography", aspectRatio: "16:9" },
  circle: { style: "photography", aspectRatio: "1:1" },
};

const PLATFORM_CONFIG: Record<
  ContentPlatform,
  { label: string; icon: typeof Linkedin; color: string }
> = {
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  x: { label: "X / Twitter", icon: Edit3, color: "#000000" },
  bluesky: { label: "Bluesky", icon: PenTool, color: "#0085FF" },
  "instagram-post": { label: "IG Post", icon: Instagram, color: "#E4405F" },
  "instagram-carousel": { label: "IG Carousel", icon: Instagram, color: "#C13584" },
  pinterest: { label: "Pinterest", icon: PenTool, color: "#E60023" },
  tiktok: { label: "TikTok", icon: PenTool, color: "#000000" },
  youtube: { label: "YouTube", icon: Youtube, color: "#FF0000" },
  blog: { label: "Blog", icon: Edit3, color: "#7C3AED" },
  circle: { label: "Circle", icon: PenTool, color: "#7C3AED" },
};

export default function ContentStudio() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [founderAngle, setFounderAngle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [pieces, setPieces] = useState<GeneratedPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<GeneratedPiece | null>(null);
  const [generatingImageFor, setGeneratingImageFor] = useState<ContentPlatform | null>(null);

  // Nano Banana image generation
  const [generatingActualImage, setGeneratingActualImage] = useState<ContentPlatform | null>(null);

  // Publishing integration
  const [bufferConnected, setBufferConnected] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatforms>({
    linkedin: false, instagram: false, x: false, pinterest: false,
  });
  const [publishing, setPublishing] = useState(false);
  const [sendingToBuffer, setSendingToBuffer] = useState(false);
  const [publishResults, setPublishResults] = useState<PublishResult[] | null>(null);
  const [publishingPlatform, setPublishingPlatform] = useState<ContentPlatform | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("buffer_access_token");
    setBufferConnected(!!token);

    // Check which platforms are directly connected
    setConnectedPlatforms({
      linkedin: !!localStorage.getItem("social_linkedin_token"),
      instagram: !!localStorage.getItem("social_instagram_token"),
      x: !!localStorage.getItem("social_x_token"),
      pinterest: !!localStorage.getItem("social_pinterest_token"),
    });
  }, []);

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    const contextParam = searchParams.get("context");
    const povParam = searchParams.get("pov");
    if (topicParam) setTopic(topicParam);
    if (povParam) {
      setFounderAngle(povParam);
    } else if (contextParam) {
      setFounderAngle(contextParam);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!topic.trim() || !founderAngle.trim()) return;
    setGenerating(true);
    setPieces([]);
    setPublishResults(null);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, founderAngle }),
      });

      const data = await res.json();

      if (res.ok && data.pieces?.length) {
        const generatedPieces: GeneratedPiece[] = data.pieces;
        setPieces(generatedPieces);

        // Auto-generate branded images for visual platforms
        const visualPlatforms: ContentPlatform[] = ["linkedin", "instagram-post", "pinterest", "blog", "circle"];
        for (const piece of generatedPieces) {
          if (visualPlatforms.includes(piece.platform)) {
            try {
              const imgRes = await fetch("/api/content/branded-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  topic: piece.title || topic,
                  platform: piece.platform,
                }),
              });
              if (imgRes.ok) {
                const imgData = await imgRes.json();
                setPieces((prev) =>
                  prev.map((p) =>
                    p.platform === piece.platform ? { ...p, imageUrl: imgData.imageData } : p
                  )
                );
              }
            } catch {
              // branded image generation failed silently — user can retry manually
            }
          }
        }
      } else {
        // Show error state instead of demo data
        setPieces([{
          platform: "linkedin",
          title: "Generation failed",
          body: data.error || "Content generation encountered an issue. Please try again.",
          status: "draft",
        }]);
      }
    } catch {
      setPieces([{
        platform: "linkedin",
        title: "Connection error",
        body: "Could not reach the content generation API. Please check your connection and try again.",
        status: "draft",
      }]);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateImagePrompt = async (piece: GeneratedPiece) => {
    setGeneratingImageFor(piece.platform);
    try {
      const res = await fetch("/api/content/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: piece.platform,
          topic,
          contentBody: piece.body,
        }),
      });

      if (res.ok) {
        const imageData: ImagePromptData = await res.json();
        setPieces((prev) =>
          prev.map((p) =>
            p.platform === piece.platform ? { ...p, imagePrompt: imageData } : p
          )
        );
        if (selectedPiece?.platform === piece.platform) {
          setSelectedPiece((prev) => prev ? { ...prev, imagePrompt: imageData } : null);
        }
      }
    } catch {
      const defaults = PLATFORM_IMAGE_DEFAULTS[piece.platform];
      const fallback: ImagePromptData = {
        prompt: `Branded ${defaults.style} for ${piece.platform} about "${topic}". Conceivable brand colors: purple (#7C3AED), pink (#EC4899). Modern, clean, science-meets-warmth aesthetic. Target: women 20-40.`,
        alt: `${piece.platform} visual for ${topic}`,
        style: defaults.style,
        aspectRatio: defaults.aspectRatio,
        textOverlay: null,
        colorPalette: ["#7C3AED", "#EC4899", "#FFFFFF"],
      };
      setPieces((prev) =>
        prev.map((p) =>
          p.platform === piece.platform ? { ...p, imagePrompt: fallback } : p
        )
      );
    } finally {
      setGeneratingImageFor(null);
    }
  };

  // Generate branded image via Satori (no external API needed)
  const handleGenerateActualImage = async (piece: GeneratedPiece) => {
    setGeneratingActualImage(piece.platform);

    try {
      const res = await fetch("/api/content/branded-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: piece.title || topic,
          platform: piece.platform,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPieces((prev) =>
          prev.map((p) =>
            p.platform === piece.platform ? { ...p, imageUrl: data.imageData } : p
          )
        );
        if (selectedPiece?.platform === piece.platform) {
          setSelectedPiece((prev) => prev ? { ...prev, imageUrl: data.imageData } : null);
        }
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setGeneratingActualImage(null);
    }
  };

  // Build tokens object from localStorage for direct publishing
  const getSocialTokens = () => ({
    linkedin: localStorage.getItem("social_linkedin_token") ?? undefined,
    linkedinUrn: (() => {
      try {
        const meta = localStorage.getItem("social_linkedin_meta");
        return meta ? JSON.parse(meta).urn : undefined;
      } catch { return undefined; }
    })(),
    instagram: localStorage.getItem("social_instagram_token") ?? undefined,
    instagramUserId: (() => {
      try {
        const meta = localStorage.getItem("social_instagram_meta");
        return meta ? JSON.parse(meta).igUserId : undefined;
      } catch { return undefined; }
    })(),
    x: localStorage.getItem("social_x_token") ?? undefined,
    pinterest: localStorage.getItem("social_pinterest_token") ?? undefined,
  });

  // Check if a platform has a direct connection
  const hasPlatformConnection = (platform: ContentPlatform): boolean => {
    if (platform === "linkedin") return connectedPlatforms.linkedin;
    if (platform === "instagram-post" || platform === "instagram-carousel") return connectedPlatforms.instagram;
    if (platform === "pinterest") return connectedPlatforms.pinterest;
    // X token can be used for short-form content repurposing
    return false;
  };

  const anyPlatformConnected = Object.values(connectedPlatforms).some(Boolean);

  // Publish approved pieces directly to platforms
  const handlePublishDirect = async (targetPieces?: GeneratedPiece[]) => {
    const piecesToSend = targetPieces ?? pieces.filter((p) => p.status === "approved");
    if (piecesToSend.length === 0) return;

    setPublishing(true);
    setPublishResults(null);

    try {
      const tokens = getSocialTokens();
      const res = await fetch("/api/integrations/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokens,
          pieces: piecesToSend.map((p) => ({
            platform: p.platform,
            text: p.body,
            imageUrl: p.imageUrl ?? undefined,
            alt: p.imagePrompt?.alt,
          })),
        }),
      });

      const data = await res.json();
      setPublishResults(data.results ?? []);
    } catch {
      setPublishResults([{ platform: "all", success: false, message: "Network error — check your connection" }]);
    } finally {
      setPublishing(false);
    }
  };

  // Publish single piece directly
  const handlePublishSingle = async (piece: GeneratedPiece) => {
    setPublishingPlatform(piece.platform);
    try {
      const tokens = getSocialTokens();
      const res = await fetch("/api/integrations/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokens,
          pieces: [{
            platform: piece.platform,
            text: piece.body,
            imageUrl: piece.imageUrl ?? undefined,
            alt: piece.imagePrompt?.alt,
          }],
        }),
      });

      const data = await res.json();
      const result = data.results?.[0];
      setPublishResults((prev) => [
        ...(prev ?? []),
        {
          platform: piece.platform,
          success: result?.success ?? false,
          message: result?.message ?? "Failed",
        },
      ]);
    } catch {
      setPublishResults((prev) => [
        ...(prev ?? []),
        { platform: piece.platform, success: false, message: "Network error" },
      ]);
    } finally {
      setPublishingPlatform(null);
    }
  };

  // Send approved pieces to Buffer (kept as alternative)
  const handleSendToBuffer = async (targetPieces?: GeneratedPiece[]) => {
    const token = localStorage.getItem("buffer_access_token");
    if (!token) return;

    const piecesToSend = targetPieces ?? pieces.filter((p) => p.status === "approved");
    if (piecesToSend.length === 0) return;

    setSendingToBuffer(true);
    setPublishResults(null);

    try {
      const res = await fetch("/api/integrations/buffer/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: token,
          pieces: piecesToSend.map((p) => ({
            platform: p.platform,
            text: p.body,
            imageUrl: p.imageUrl ?? undefined,
            alt: p.imagePrompt?.alt,
          })),
        }),
      });

      const data = await res.json();
      setPublishResults(data.results ?? []);
    } catch {
      setPublishResults([{ platform: "all", success: false, message: "Network error — check your connection" }]);
    } finally {
      setSendingToBuffer(false);
    }
  };

  const updatePieceStatus = (platform: ContentPlatform, status: "approved" | "rejected") => {
    setPieces((prev) =>
      prev.map((p) => (p.platform === platform ? { ...p, status } : p))
    );
  };

  const approvedCount = pieces.filter((p) => p.status === "approved").length;

  return (
    <div className="p-8 max-w-6xl">
      {/* Input Section */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
          Create Content Batch
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., New study links gut microbiome to fertility outcomes"
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Your POV / Angle
            </label>
            <textarea
              value={founderAngle}
              onChange={(e) => setFounderAngle(e.target.value)}
              placeholder="What's your unique take on this? What do you want your audience to know/feel/do?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim() || !founderAngle.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating across all platforms...
              </>
            ) : (
              <>
                <Send size={16} />
                Generate Content Batch
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Output Grid */}
      {pieces.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: "var(--foreground)" }}>
              Generated Content ({approvedCount}/{pieces.length} approved)
            </h3>
            <div className="flex items-center gap-2">
              {approvedCount > 0 && anyPlatformConnected && (
                <button
                  onClick={() => handlePublishDirect()}
                  disabled={publishing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {publishing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Publish {approvedCount} Direct
                    </>
                  )}
                </button>
              )}
              {approvedCount > 0 && bufferConnected && (
                <button
                  onClick={() => handleSendToBuffer()}
                  disabled={sendingToBuffer}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "#168EEA" }}
                >
                  {sendingToBuffer ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending to Buffer...
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} />
                      Buffer Queue
                    </>
                  )}
                </button>
              )}
              {approvedCount > 0 && !anyPlatformConnected && !bufferConnected && (
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  <ExternalLink size={14} />
                  Connect platforms to publish
                </a>
              )}
            </div>
          </div>

          {/* Publish Results Banner */}
          {publishResults && publishResults.length > 0 && (
            <div
              className="rounded-xl border p-4 mb-4"
              style={{
                borderColor: publishResults.every((r) => r.success) ? "var(--status-success)" : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {publishResults.every((r) => r.success) ? (
                  <CheckCircle size={16} style={{ color: "var(--status-success)" }} />
                ) : (
                  <AlertCircle size={16} style={{ color: "#EAB308" }} />
                )}
                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Publish Results
                </span>
                <button
                  onClick={() => setPublishResults(null)}
                  className="ml-auto"
                >
                  <X size={14} style={{ color: "var(--muted)" }} />
                </button>
              </div>
              <div className="space-y-1">
                {publishResults.map((result, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {result.success ? (
                      <CheckCircle size={12} style={{ color: "var(--status-success)" }} />
                    ) : (
                      <AlertCircle size={12} style={{ color: "#EF4444" }} />
                    )}
                    <span style={{ color: "var(--foreground)" }}>
                      {PLATFORM_CONFIG[result.platform as ContentPlatform]?.label ?? result.platform}
                    </span>
                    <span style={{ color: "var(--muted)" }}>{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pieces.map((piece) => {
              const config = PLATFORM_CONFIG[piece.platform];
              const Icon = config.icon;

              return (
                <div
                  key={piece.platform}
                  className={`rounded-xl border p-4 cursor-pointer hover:shadow-sm ${
                    piece.status === "approved" ? "ring-2 ring-green-400" : ""
                  } ${piece.status === "rejected" ? "opacity-50" : ""}`}
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  onClick={() => setSelectedPiece(piece)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon size={16} style={{ color: config.color }} />
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {hasPlatformConnection(piece.platform) && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
                        >
                          LIVE
                        </span>
                      )}
                      {piece.imageUrl && (
                        <Sparkles size={14} style={{ color: "#10B981" }} />
                      )}
                      {piece.imagePrompt && !piece.imageUrl && (
                        <ImageIcon size={14} style={{ color: "var(--brand-primary)" }} />
                      )}
                      {piece.status === "approved" && (
                        <CheckCircle size={16} style={{ color: "var(--status-success)" }} />
                      )}
                    </div>
                  </div>

                  {/* Generated Image Preview */}
                  {piece.imageUrl && (
                    <div className="rounded-lg overflow-hidden mb-3">
                      <img
                        src={piece.imageUrl}
                        alt={piece.imagePrompt?.alt ?? "Generated image"}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {/* Image Prompt Preview (no actual image yet) */}
                  {piece.imagePrompt && !piece.imageUrl && (
                    <div
                      className="rounded-lg p-2.5 mb-3 flex items-start gap-2"
                      style={{ backgroundColor: "var(--background)" }}
                    >
                      <div className="flex gap-1 shrink-0 mt-0.5">
                        {piece.imagePrompt.colorPalette.slice(0, 3).map((color) => (
                          <div
                            key={color}
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: color, borderColor: "var(--border)" }}
                          />
                        ))}
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: "var(--muted)" }}>
                        {piece.imagePrompt.style} | {piece.imagePrompt.aspectRatio}
                        {piece.imagePrompt.textOverlay ? ` | "${piece.imagePrompt.textOverlay}"` : ""}
                      </p>
                    </div>
                  )}

                  <p
                    className="text-xs leading-relaxed line-clamp-4"
                    style={{ color: "var(--muted)" }}
                  >
                    {piece.body.slice(0, 200)}...
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePieceStatus(piece.platform, "approved");
                      }}
                      className="flex-1 text-xs py-1.5 rounded-md font-medium text-white"
                      style={{ backgroundColor: "var(--status-success)" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePieceStatus(piece.platform, "rejected");
                      }}
                      className="flex-1 text-xs py-1.5 rounded-md font-medium border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Preview Modal */}
      {selectedPiece && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
          <div
            className="rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye size={18} style={{ color: "var(--brand-primary)" }} />
                <span className="font-medium" style={{ color: "var(--foreground)" }}>
                  {PLATFORM_CONFIG[selectedPiece.platform].label} Preview
                </span>
              </div>
              <button onClick={() => setSelectedPiece(null)}>
                <X size={18} style={{ color: "var(--muted)" }} />
              </button>
            </div>

            {/* Generated Image Display */}
            {selectedPiece.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedPiece.imageUrl}
                  alt={selectedPiece.imagePrompt?.alt ?? "Generated image"}
                  className="w-full"
                />
              </div>
            )}

            {/* Image Prompt Section */}
            {selectedPiece.imagePrompt ? (
              <div
                className="rounded-xl border p-4 mb-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} style={{ color: "var(--brand-primary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Image Concept
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
                  >
                    {selectedPiece.imagePrompt.style} | {selectedPiece.imagePrompt.aspectRatio}
                  </span>
                </div>

                <p className="text-sm mb-3" style={{ color: "var(--foreground)" }}>
                  {selectedPiece.imagePrompt.prompt}
                </p>

                {selectedPiece.imagePrompt.textOverlay && (
                  <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                    Text overlay: &ldquo;{selectedPiece.imagePrompt.textOverlay}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Colors:</span>
                  <div className="flex gap-1.5">
                    {selectedPiece.imagePrompt.colorPalette.map((color) => (
                      <div key={color} className="flex items-center gap-1">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color, borderColor: "var(--border)" }}
                        />
                        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPiece.imagePrompt!.prompt);
                    }}
                    className="text-xs px-3 py-1.5 rounded-md font-medium border"
                    style={{ borderColor: "var(--border)", color: "var(--brand-primary)" }}
                  >
                    Copy Prompt
                  </button>
                  <button
                    onClick={() => handleGenerateActualImage(selectedPiece)}
                    disabled={generatingActualImage === selectedPiece.platform}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  >
                    {generatingActualImage === selectedPiece.platform ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Generating branded image...
                      </>
                    ) : selectedPiece.imageUrl ? (
                      <>
                        <Sparkles size={12} />
                        Regenerate Image
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        Generate Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleGenerateImagePrompt(selectedPiece)}
                disabled={generatingImageFor === selectedPiece.platform}
                className="flex items-center gap-2 w-full justify-center py-3 rounded-xl border border-dashed mb-4 text-sm font-medium disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--brand-primary)" }}
              >
                {generatingImageFor === selectedPiece.platform ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating image concept...
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} />
                    Generate Image Concept
                  </>
                )}
              </button>
            )}

            <div
              className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {selectedPiece.body}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  updatePieceStatus(selectedPiece.platform, "approved");
                  setSelectedPiece(null);
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "var(--status-success)" }}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  updatePieceStatus(selectedPiece.platform, "rejected");
                  setSelectedPiece(null);
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                Reject
              </button>
              {selectedPiece.status === "approved" && hasPlatformConnection(selectedPiece.platform) && (
                <button
                  onClick={() => handlePublishSingle(selectedPiece)}
                  disabled={publishingPlatform === selectedPiece.platform}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {publishingPlatform === selectedPiece.platform ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      Publish
                    </>
                  )}
                </button>
              )}
              {selectedPiece.status === "approved" && bufferConnected && (
                <button
                  onClick={() => handleSendToBuffer([selectedPiece])}
                  disabled={sendingToBuffer}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "#168EEA" }}
                >
                  {sendingToBuffer ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <ExternalLink size={14} />
                      Buffer
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
