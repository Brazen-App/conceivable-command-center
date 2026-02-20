"use client";

import { useState } from "react";
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
} from "lucide-react";
import { ContentPlatform } from "@/types";

interface GeneratedPiece {
  platform: ContentPlatform;
  title: string;
  body: string;
  status: "draft" | "approved" | "rejected";
}

const PLATFORM_CONFIG: Record<
  ContentPlatform,
  { label: string; icon: typeof Linkedin; color: string }
> = {
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  "instagram-post": { label: "IG Post", icon: Instagram, color: "#E4405F" },
  "instagram-carousel": { label: "IG Carousel", icon: Instagram, color: "#C13584" },
  pinterest: { label: "Pinterest", icon: PenTool, color: "#E60023" },
  tiktok: { label: "TikTok", icon: PenTool, color: "#000000" },
  youtube: { label: "YouTube", icon: Youtube, color: "#FF0000" },
  blog: { label: "Blog", icon: Edit3, color: "#7C3AED" },
};

export default function ContentStudio() {
  const [topic, setTopic] = useState("");
  const [founderAngle, setFounderAngle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [pieces, setPieces] = useState<GeneratedPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<GeneratedPiece | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() || !founderAngle.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, founderAngle }),
      });

      if (res.ok) {
        const data = await res.json();
        setPieces(data.pieces ?? []);
      }
    } catch {
      // Handle error silently
    } finally {
      setGenerating(false);
    }
  };

  const updatePieceStatus = (platform: ContentPlatform, status: "approved" | "rejected") => {
    setPieces((prev) =>
      prev.map((p) => (p.platform === platform ? { ...p, status } : p))
    );
  };

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
              Generated Content ({pieces.filter((p) => p.status === "approved").length}/{pieces.length} approved)
            </h3>
            {pieces.every((p) => p.status === "approved") && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "var(--status-success)" }}
              >
                <Send size={14} />
                Publish All
              </button>
            )}
          </div>

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
                    {piece.status === "approved" && (
                      <CheckCircle size={16} style={{ color: "var(--status-success)" }} />
                    )}
                  </div>

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
