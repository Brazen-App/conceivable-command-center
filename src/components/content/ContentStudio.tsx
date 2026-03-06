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
  "instagram-post": { style: "photography", aspectRatio: "1:1" },
  "instagram-carousel": { style: "illustration", aspectRatio: "1:1" },
  pinterest: { style: "infographic", aspectRatio: "2:3" },
  tiktok: { style: "photography", aspectRatio: "9:16" },
  youtube: { style: "photography", aspectRatio: "16:9" },
  blog: { style: "photography", aspectRatio: "16:9" },
  circle: { style: "photography", aspectRatio: "1:1" },
};

function generateDemoContent(topic: string, angle: string): GeneratedPiece[] {
  const t = topic.toLowerCase();
  return [
    {
      platform: "linkedin",
      title: `${topic} — LinkedIn`,
      body: `I've been thinking a lot about ${t} lately.\n\nHere's what most people get wrong: they treat this as a one-size-fits-all issue. But the data tells a different story.\n\n${angle}\n\nAt Conceivable, we're building the first operating system for women's health — and insights like these are exactly why personalization matters.\n\n3 things every woman should know:\n1. Your body is unique — and your health plan should be too\n2. Science-backed approaches outperform trends every time\n3. Small, consistent changes compound into massive results\n\nWhat's your experience been? Drop a comment below.\n\n#WomensHealth #Fertility #HealthTech #Conceivable`,
      imagePrompt: {
        prompt: `Professional lifestyle photograph of a confident woman in her 30s in a modern, light-filled workspace reviewing health data on a tablet. Warm natural lighting, shallow depth of field. Brand purple (#7C3AED) accent elements subtly in the background. Clean, editorial feel — Vogue Health meets TechCrunch. No text overlay.`,
        alt: `Woman reviewing personalized health data in a modern workspace`,
        style: "photography",
        aspectRatio: "1:1",
        textOverlay: null,
        colorPalette: ["#7C3AED", "#F3F0FF", "#FAFAFA"],
      },
      status: "draft",
    },
    {
      platform: "instagram-post",
      title: `${topic} — IG Post`,
      body: `New research is changing the conversation about ${t}.\n\nHere's why this matters for YOUR health journey:\n\n${angle}\n\nThe science is clear — and we're here to make it actionable.\n\nSave this post for later.\n\n#WomensHealth #FertilityJourney #HealthScience #Conceivable #WellnessTips #ReproductiveHealth`,
      imagePrompt: {
        prompt: `Minimal, high-end Instagram graphic with soft purple-to-pink gradient background (#7C3AED to #EC4899). Center-aligned bold sans-serif typography reading the key insight. Subtle organic shapes (cells, flowers, or abstract feminine forms) in the background at 10% opacity. Clean whitespace. Conceivable logo watermark bottom-right.`,
        alt: `Branded Instagram graphic about ${t}`,
        style: "typography",
        aspectRatio: "1:1",
        textOverlay: topic,
        colorPalette: ["#7C3AED", "#EC4899", "#FFFFFF"],
      },
      status: "draft",
    },
    {
      platform: "instagram-carousel",
      title: `${topic} — IG Carousel`,
      body: `SLIDE 1: "${topic}" [Bold headline on branded gradient background, large serif font]\n\nSLIDE 2: "Here's what the research shows..." [Key stat or finding with supporting icon]\n\nSLIDE 3: "Why does this matter?" [${angle}]\n\nSLIDE 4: "What you can do about it" [Actionable tip #1 with numbered icon]\n\nSLIDE 5: "The science behind it" [Supporting evidence with data visualization]\n\nSLIDE 6: "Key takeaway" [Summary with branded visual treatment]\n\nSLIDE 7: "Follow @conceivable for more science-backed health insights" [CTA with logo]\n\nCaption: Knowledge is power — especially when it comes to your health. Swipe through to learn what the latest research means for you.\n\n#WomensHealth #HealthEducation #Conceivable`,
      imagePrompt: {
        prompt: `Set of 7 cohesive Instagram carousel slides. Consistent design system: warm white background with soft purple (#7C3AED) accent bar at top. Modern sans-serif typography (think: The Skimm meets medical journal). Each slide has a numbered indicator (1/7, 2/7...). Slide 1 is the hook with large bold text. Subsequent slides use icon + text layout. Final slide has CTA with Conceivable branding. Clean, educational, premium feel.`,
        alt: `7-slide Instagram carousel about ${t}`,
        style: "illustration",
        aspectRatio: "1:1",
        textOverlay: topic,
        colorPalette: ["#7C3AED", "#F9FAFB", "#EC4899", "#10B981"],
      },
      status: "draft",
    },
    {
      platform: "pinterest",
      title: `${topic} — Pinterest`,
      body: `Pin Title: ${topic} — What Every Woman Needs to Know\n\nPin Description: Discover the latest research on ${t} and what it means for your health journey. Science-backed insights from Conceivable, the first operating system for women's health.\n\nKeywords: women's health, fertility, wellness, health research, ${t}\n\nImage Concept: Clean infographic with key stats, branded purple/pink gradient, easy-to-read typography.`,
      imagePrompt: {
        prompt: `Tall Pinterest infographic (2:3 ratio). Top section: bold headline "${topic}" on deep purple (#7C3AED) background with white text. Middle section: 3-4 key facts with custom icons on white background, each in its own row with subtle divider lines. Bottom section: Conceivable branding with CTA "Learn more at conceivable.com". Sage green (#10B981) accent for check marks and highlights. Professional, saveable, highly shareable design.`,
        alt: `Pinterest infographic about ${t}`,
        style: "infographic",
        aspectRatio: "2:3",
        textOverlay: `${topic} — What Every Woman Needs to Know`,
        colorPalette: ["#7C3AED", "#FFFFFF", "#10B981"],
      },
      status: "draft",
    },
    {
      platform: "tiktok",
      title: `${topic} — TikTok`,
      body: `TIKTOK SCRIPT (45-60s)\n\n[0-3s] HOOK — Choose one:\nA) "I'm a women's health founder and this study kept me up last night..." (camera close-up, serious expression, then break into explanation)\nB) "POV: you just found out that ${t}..." (trending POV format, reaction shot)\nC) "Stop scrolling if you care about your health. ${topic} — and nobody is talking about it." (direct-to-camera, finger point)\n\n[3-8s] THE REVEAL\n"So here's what's actually going on..." (cut to walking/movement shot for energy)\n\n[8-20s] THE BREAKDOWN\n"The research shows three things:"\n(Use hand gestures, count on fingers)\n1. First key finding — explain in plain language\n2. Second key finding — relate it personally\n3. Third key finding — the surprising part\n\n[20-35s] THE FOUNDER'S TAKE\n"Here's what I think about this as someone building in women's health:"\n${angle}\n(Raw, unscripted energy — let the passion show)\n\n[35-50s] THE ACTIONABLE\n"So what can you actually DO with this info?"\n• One thing to try this week\n• One thing to ask your doctor\n• One thing to stop doing\n\n[50-60s] CTA\n"Follow if you want more of this. We're building something that makes this personal to YOU. Link in bio."\n(Point to camera, smile)\n\nVISUAL NOTES: Film in natural light. Use captions (bold, centered). Quick cuts every 3-5 seconds. Add subtle background music (trending sound or lo-fi).`,
      imagePrompt: {
        prompt: `TikTok cover image (9:16). Split design: left half shows a confident woman founder speaking to camera in natural light, right half has bold text overlay with the key hook line. Purple (#7C3AED) text accent. "Swipe up" indicator at bottom. Raw, authentic aesthetic — not overly produced. Warm tones.`,
        alt: `TikTok video cover about ${t}`,
        style: "photography",
        aspectRatio: "9:16",
        textOverlay: `${topic} — nobody is talking about this`,
        colorPalette: ["#7C3AED", "#000000", "#FFFFFF"],
      },
      status: "draft",
    },
    {
      platform: "youtube",
      title: `${topic} — YouTube`,
      body: `YOUTUBE VIDEO SCRIPT (8-12 min)\n\nTitle: ${topic} — What Your Doctor Isn't Telling You\n\n[0:00-0:05] COLD OPEN (pre-title hook)\n"There's a study that just came out that changes everything we thought we knew about ${t}. And I need to talk about it." (dramatic pause, cut to title card)\n\n[0:05-0:15] TITLE CARD\nAnimated Conceivable logo + episode title\n\n[0:15-0:45] HOOK + CONTEXT\n"Hey everyone — so if you've been following me, you know I'm obsessed with the science behind women's health. And this week, something dropped that I genuinely think every woman watching this needs to hear. We're talking about ${t}. Let me break this down."\n(Energy: excited, leaning in, like telling a friend something important)\n\n[0:45-3:00] THE RESEARCH (Section 1)\n"Let's start with what the research actually says..."\n• Study overview — who conducted it, sample size, methodology\n• Key findings — presented with on-screen graphics\n• Why this is different from previous research\n(B-roll: research papers, lab footage, data visualizations)\n\n[3:00-5:00] WHY THIS MATTERS (Section 2)\n"Okay so why should you — specifically YOU — care about this?"\n${angle}\n• Connect to everyday health decisions\n• Address common misconceptions\n• Share a personal story or patient example\n(B-roll: lifestyle footage, health tracking, daily routines)\n\n[5:00-7:30] WHAT YOU CAN DO (Section 3)\n"Now let's get practical. Here are 5 things you can do starting today:"\n1. Actionable step with explanation\n2. Actionable step with explanation\n3. Actionable step with explanation\n4. Actionable step with explanation\n5. Actionable step with explanation\n(Format: numbered list on screen, demonstrate where possible)\n\n[7:30-9:00] THE BIGGER PICTURE (Section 4)\n"This is exactly why we're building Conceivable..."\n• How this connects to personalized health\n• Why a one-size-fits-all approach fails\n• Vision for the future of women's health\n\n[9:00-10:00] Q&A PROMPT + OUTRO\n"I want to hear from you — drop your questions in the comments. What's your experience with this? Subscribe and hit the bell because next week we're diving into [related topic]. And if you want personalized health insights, check out Conceivable — link in the description."\n\nDESCRIPTION:\n${topic} — What Your Doctor Isn't Telling You\n\nTimestamps:\n0:00 Cold Open\n0:15 What happened\n0:45 The research\n3:00 Why it matters\n5:00 5 things you can do\n7:30 The bigger picture\n9:00 Your questions\n\n#WomensHealth #Conceivable #${topic.replace(/\s+/g, "")}`,
      imagePrompt: {
        prompt: `YouTube thumbnail (16:9). Left side: founder's face with expressive "surprised/concerned" expression, well-lit with ring light. Right side: bold yellow and white text on dark purple background reading "What Your Doctor ISN'T Telling You" with a red circle/arrow pointing to a key visual element. High contrast, saturated colors. Click-worthy but not clickbait. Professional but personal.`,
        alt: `YouTube thumbnail for video about ${t}`,
        style: "photography",
        aspectRatio: "16:9",
        textOverlay: "What Your Doctor ISN'T Telling You",
        colorPalette: ["#7C3AED", "#FBBF24", "#EF4444", "#FFFFFF"],
      },
      status: "draft",
    },
    {
      platform: "blog",
      title: `${topic} — Blog`,
      body: `# ${topic}: What Every Woman Needs to Know\n\n**Meta Description:** Discover the latest research on ${t} and learn actionable steps you can take today for better health outcomes.\n\n## Introduction\n\nRecent developments in ${t} have sparked important conversations about women's health. ${angle}\n\n## What the Research Shows\n\nThe latest findings are compelling — and they have direct implications for women at every stage of their health journey.\n\n## Why This Matters for You\n\nUnderstanding this research isn't just academic. It has real, practical implications for the choices you make every day.\n\n## Actionable Steps You Can Take Today\n\n1. **Stay informed** — Follow evidence-based sources\n2. **Personalize your approach** — What works for others may not work for you\n3. **Track your progress** — Data-driven decisions lead to better outcomes\n\n## The Bottom Line\n\nAt Conceivable, we believe every woman deserves access to personalized, science-backed health insights. This research reinforces why.\n\n---\n*Want personalized health insights? Join the Conceivable waitlist.*`,
      imagePrompt: {
        prompt: `Blog hero image (16:9). Soft-focus lifestyle photograph: woman in her late 20s/early 30s in a bright, airy space (think: modern apartment with plants) reading or journaling. Warm morning light streaming through windows. Subtle Conceivable purple tones in the environment (purple mug, lavender throw). Calm, empowering mood. Editorial quality — could be in Well+Good or MindBodyGreen.`,
        alt: `Woman engaging with health and wellness content in a bright, modern space`,
        style: "photography",
        aspectRatio: "16:9",
        textOverlay: null,
        colorPalette: ["#7C3AED", "#FDF2F8", "#F0FDF4"],
      },
      status: "draft",
    },
  ];
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
        setPieces(data.pieces);
      } else {
        setPieces(generateDemoContent(topic, founderAngle));
      }
    } catch {
      setPieces(generateDemoContent(topic, founderAngle));
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

  // Generate actual image via Nano Banana (Gemini)
  const handleGenerateActualImage = async (piece: GeneratedPiece) => {
    if (!piece.imagePrompt) return;
    setGeneratingActualImage(piece.platform);

    try {
      const res = await fetch("/api/content/generate-image-actual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: piece.imagePrompt.prompt,
          aspectRatio: piece.imagePrompt.aspectRatio,
          style: piece.imagePrompt.style,
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
                        Generating with Nano Banana...
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
