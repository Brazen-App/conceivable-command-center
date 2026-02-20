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
} from "lucide-react";
import { ContentPlatform } from "@/types";

function generateDemoContent(topic: string, angle: string): GeneratedPiece[] {
  return [
    {
      platform: "linkedin",
      title: `${topic} — LinkedIn`,
      body: `I've been thinking a lot about ${topic.toLowerCase()} lately.\n\nHere's what most people get wrong: they treat this as a one-size-fits-all issue. But the data tells a different story.\n\n${angle}\n\nAt Conceivable, we're building the first operating system for women's health — and insights like these are exactly why personalization matters.\n\n3 things every woman should know:\n1. Your body is unique — and your health plan should be too\n2. Science-backed approaches outperform trends every time\n3. Small, consistent changes compound into massive results\n\nWhat's your experience been? Drop a comment below.\n\n#WomensHealth #Fertility #HealthTech #Conceivable`,
      status: "draft",
    },
    {
      platform: "instagram-post",
      title: `${topic} — IG Post`,
      body: `✨ New research alert ✨\n\n${topic}\n\nHere's why this matters for YOUR health journey:\n\n${angle}\n\nThe science is clear — and we're here to make it actionable.\n\nSave this post for later 🔖\n\n#WomensHealth #FertilityJourney #HealthScience #Conceivable #WellnessTips #ReproductiveHealth`,
      status: "draft",
    },
    {
      platform: "instagram-carousel",
      title: `${topic} — IG Carousel`,
      body: `SLIDE 1: "${topic}" [Bold headline on branded background]\n\nSLIDE 2: "Here's what the research shows..." [Key stat or finding]\n\nSLIDE 3: "Why does this matter?" [${angle}]\n\nSLIDE 4: "What you can do about it" [Actionable tip #1]\n\nSLIDE 5: "The science behind it" [Supporting evidence]\n\nSLIDE 6: "Key takeaway" [Summary of main point]\n\nSLIDE 7: "Follow @conceivable for more science-backed health insights" [CTA]\n\nCaption: Knowledge is power — especially when it comes to your health. Swipe through to learn what the latest research means for you. 💜\n\n#WomensHealth #HealthEducation #Conceivable`,
      status: "draft",
    },
    {
      platform: "pinterest",
      title: `${topic} — Pinterest`,
      body: `Pin Title: ${topic} — What Every Woman Needs to Know\n\nPin Description: Discover the latest research on ${topic.toLowerCase()} and what it means for your health journey. Science-backed insights from Conceivable, the first operating system for women's health.\n\nKeywords: women's health, fertility, wellness, health research, ${topic.toLowerCase()}\n\nImage Concept: Clean infographic with key stats, branded purple/pink gradient, easy-to-read typography.`,
      status: "draft",
    },
    {
      platform: "tiktok",
      title: `${topic} — TikTok`,
      body: `🎬 TikTok Script\n\n[0-3s] HOOK: "Did you know that ${topic.toLowerCase()}? Here's what nobody's telling you..."\n\n[3-15s] "So new research just came out and..."\n${angle}\n\n[15-30s] "Here's what this actually means for you..."\n• Key point 1\n• Key point 2\n• Key point 3\n\n[30-45s] "The thing most people miss is that this is personal — what works for one person might not work for you."\n\n[45-55s] "That's exactly why we're building Conceivable — to give every woman a personalized health plan."\n\n[55-60s] CTA: "Follow for more science-backed health tips. Link in bio."`,
      status: "draft",
    },
    {
      platform: "youtube",
      title: `${topic} — YouTube`,
      body: `📹 YouTube Script\n\nTitle: ${topic} — What Every Woman Should Know in 2026\n\nThumbnail: Split image — surprised face + key stat overlay\n\n[0:00-0:30] INTRO\n"If you've been following the latest health research, you've probably heard about ${topic.toLowerCase()}. But today I want to break down what this actually means for you — because the headlines don't tell the full story."\n\n[0:30-3:00] THE RESEARCH\n"Here's what the study found..."\n${angle}\n\n[3:00-6:00] WHY THIS MATTERS\n"So why should you care? Because..."\n\n[6:00-9:00] WHAT YOU CAN DO\n"Now let's talk about actionable steps..."\n\n[9:00-10:00] OUTRO\n"If you found this helpful, subscribe and hit the bell. And if you want personalized health insights, check out Conceivable — link in the description."\n\nDescription: In this video, we break down ${topic.toLowerCase()} and what it means for women's health. #WomensHealth #Conceivable`,
      status: "draft",
    },
    {
      platform: "blog",
      title: `${topic} — Blog`,
      body: `# ${topic}: What Every Woman Needs to Know\n\n**Meta Description:** Discover the latest research on ${topic.toLowerCase()} and learn actionable steps you can take today for better health outcomes.\n\n## Introduction\n\nRecent developments in ${topic.toLowerCase()} have sparked important conversations about women's health. ${angle}\n\n## What the Research Shows\n\nThe latest findings are compelling — and they have direct implications for women at every stage of their health journey.\n\n## Why This Matters for You\n\nUnderstanding this research isn't just academic. It has real, practical implications for the choices you make every day.\n\n## Actionable Steps You Can Take Today\n\n1. **Stay informed** — Follow evidence-based sources\n2. **Personalize your approach** — What works for others may not work for you\n3. **Track your progress** — Data-driven decisions lead to better outcomes\n\n## The Bottom Line\n\nAt Conceivable, we believe every woman deserves access to personalized, science-backed health insights. This research reinforces why.\n\n---\n*Want personalized health insights? Join the Conceivable waitlist.*`,
      status: "draft",
    },
  ];
}

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
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [founderAngle, setFounderAngle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [pieces, setPieces] = useState<GeneratedPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<GeneratedPiece | null>(null);

  useEffect(() => {
    const topicParam = searchParams.get("topic");
    const contextParam = searchParams.get("context");
    const povParam = searchParams.get("pov");
    if (topicParam) setTopic(topicParam);
    // Use the user's POV if provided, otherwise fall back to the story context
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

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, founderAngle }),
      });

      const data = await res.json();

      if (res.ok && data.pieces?.length) {
        setPieces(data.pieces);
      } else {
        // API returned an error or empty pieces — use demo content
        setPieces(generateDemoContent(topic, founderAngle));
      }
    } catch {
      // Network / server error — use demo content
      setPieces(generateDemoContent(topic, founderAngle));
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
