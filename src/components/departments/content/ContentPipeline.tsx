"use client";

import { useState } from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Image,
  Hash,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Platform, GeneratedContent } from "@/lib/data/content-engine";
import TemplateSelector from "./TemplateSelector";

interface ContentPieceProps {
  sourceId: string;
  sourceTitle: string;
  sourceType: "news" | "research";
  transcript: string;
}

interface Props {
  queue: ContentPieceProps[];
}

const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; icon: typeof Linkedin; color: string; maxChars: number }
> = {
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#0A66C2", maxChars: 3000 },
  x: { label: "X (Twitter)", icon: Twitter, color: "#1DA1F2", maxChars: 280 },
  facebook: { label: "Facebook", icon: Facebook, color: "#1877F2", maxChars: 2000 },
  instagram: { label: "Instagram", icon: Instagram, color: "#E4405F", maxChars: 2200 },
  pinterest: { label: "Pinterest", icon: Image, color: "#BD081C", maxChars: 500 },
};

// Mock generated content based on transcript
function generateMockContent(transcript: string, sourceTitle: string): Record<Platform, GeneratedContent> {
  return {
    linkedin: {
      platform: "linkedin",
      copy: `Something interesting landed on my desk this morning.\n\n${sourceTitle}\n\nHere's what caught my attention: ${transcript.slice(0, 150)}...\n\nThe key takeaway? Most people are looking at individual data points in isolation. The real breakthrough happens when you understand how these signals connect.\n\nAt Conceivable, we're building exactly this — a system that doesn't just track one metric, but understands the relationships between all of them.\n\nWhat's your take? I'd love to hear how you think about signal integration vs. single-metric tracking.\n\n#FertilityHealth #WomensHealth #HealthTech #AIinHealthcare`,
      hashtags: ["FertilityHealth", "WomensHealth", "HealthTech", "AIinHealthcare", "ReproductiveHealth"],
      imageDescription: "Clean data visualization showing interconnected health signals with warm brand gradients",
      status: "draft",
    },
    x: {
      platform: "x",
      copy: `New development in fertility tech: ${sourceTitle.slice(0, 80)}...\n\nThe gap between tracking and actually improving outcomes is where the real innovation happens.\n\nThread on why single-signal approaches miss the bigger picture`,
      hashtags: ["FertilityTech", "WomensHealth"],
      imageDescription: "Bold stat graphic with key finding highlighted",
      status: "draft",
    },
    facebook: {
      platform: "facebook",
      copy: `I read something this morning that really resonated with what we're building at Conceivable.\n\n${sourceTitle}\n\n${transcript.slice(0, 200)}...\n\nThe thing that excites me most about this? It validates something we've believed from day one: your body is sending signals all the time. The question isn't whether the data is there — it's whether anyone is connecting the dots.\n\nThat's exactly what our AI coach Kai does. Not just tracking, but understanding the patterns between signals.\n\nWhat resonates with you here? Drop a comment — I read every one.`,
      hashtags: ["Conceivable", "FertilityJourney", "WomensHealth", "HealthTech"],
      imageDescription: "Warm, approachable graphic with key quote pulled from the post",
      status: "draft",
    },
    instagram: {
      platform: "instagram",
      copy: `Your body is always communicating. The question is: who's listening? 🔬\n\n${sourceTitle}\n\nSwipe to see why single-signal tracking misses the bigger picture — and what happens when you connect ALL the signals.\n\nSave this if you're on a fertility journey.\n\n#FertilityHealth #TTC #FertilityJourney #WomensHealth #PCOS #Conceivable #HealthTech #ReproductiveHealth #FertilityAwareness #HormoneHealth`,
      hashtags: [
        "FertilityHealth",
        "TTC",
        "FertilityJourney",
        "WomensHealth",
        "PCOS",
        "Conceivable",
        "HealthTech",
        "ReproductiveHealth",
      ],
      imageDescription: "Carousel: Slide 1 — bold stat/hook. Slide 2-4 — key insights with brand visuals. Slide 5 — CTA to learn more",
      status: "draft",
    },
    pinterest: {
      platform: "pinterest",
      copy: `${sourceTitle} — What the latest research means for your fertility journey. Understanding the connection between multiple health signals is the key to optimizing outcomes.`,
      hashtags: ["FertilityHealth", "WomensHealth", "HealthTips", "TTC"],
      imageDescription: "Infographic pin: key findings visualized with Conceivable brand colors, clean typography, save-worthy design",
      status: "draft",
    },
  };
}

type PublishState = "idle" | "publishing" | "success" | "error";

async function publishPieces(pieces: Array<{ platform: string; copy: string; hashtags: string[] }>) {
  const res = await fetch("/api/content/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pieces }),
  });
  return res.json();
}

function PlatformCard({
  content,
  config,
  sourceTitle,
}: {
  content: GeneratedContent;
  config: (typeof PLATFORM_CONFIG)[Platform];
  sourceTitle: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState<string | null>(null);
  const Icon = config.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(content.copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = async () => {
    setPublishState("publishing");
    setPublishError(null);
    try {
      const result = await publishPieces([
        { platform: content.platform, copy: content.copy, hashtags: content.hashtags },
      ]);
      if (result.error) {
        setPublishState("error");
        setPublishError(result.error);
      } else if (result.results?.[0]?.ok === false) {
        setPublishState("error");
        setPublishError(result.results[0].error || "Publishing failed");
      } else {
        setPublishState("success");
      }
    } catch (err) {
      setPublishState("error");
      setPublishError(err instanceof Error ? err.message : "Network error");
    }
  };

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}14` }}
        >
          <Icon size={16} style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            {config.label}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
            {content.copy.length} / {config.maxChars} chars
          </p>
        </div>
        {publishState === "success" ? (
          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
        ) : publishState === "error" ? (
          <AlertCircle size={14} className="text-red-500 shrink-0" />
        ) : (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
            style={{
              backgroundColor:
                content.status === "draft"
                  ? "#F1C02814"
                  : content.status === "approved"
                  ? "#1EAA5514"
                  : "#5A6FFF14",
              color:
                content.status === "draft"
                  ? "#F1C028"
                  : content.status === "approved"
                  ? "#1EAA55"
                  : "#5A6FFF",
            }}
          >
            {content.status}
          </span>
        )}
        {expanded ? (
          <ChevronDown size={14} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronRight size={14} style={{ color: "var(--muted)" }} />
        )}
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Copy */}
          <div
            className="rounded-lg p-3 mt-3 text-xs leading-relaxed whitespace-pre-line"
            style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
          >
            {content.copy}
          </div>

          {/* Hashtags */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Hash size={10} style={{ color: "var(--muted)" }} />
            {content.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Image description */}
          <div className="mt-2 flex items-start gap-2">
            <Image size={10} className="mt-0.5 shrink-0" style={{ color: "var(--muted)" }} />
            <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
              {content.imageDescription}
            </p>
          </div>

          {/* Publish error */}
          {publishState === "error" && publishError && (
            <div
              className="mt-2 flex items-start gap-2 p-2 rounded-lg text-xs"
              style={{ backgroundColor: "#E24D4710", color: "#E24D47" }}
            >
              <AlertCircle size={12} className="mt-0.5 shrink-0" />
              {publishError}
            </div>
          )}

          {/* Template image generator */}
          <TemplateSelector
            platform={content.platform}
            sourceTitle={sourceTitle}
            copy={content.copy}
          />

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ color: "var(--muted)", backgroundColor: "var(--background)" }}
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishState === "publishing" || publishState === "success"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: config.color }}
            >
              {publishState === "publishing" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : publishState === "success" ? (
                <CheckCircle2 size={12} />
              ) : (
                <Send size={12} />
              )}
              {publishState === "publishing"
                ? "Publishing..."
                : publishState === "success"
                ? "Published"
                : "Approve & Publish"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QueueItem({ item }: { item: ContentPieceProps }) {
  const [expanded, setExpanded] = useState(true);
  const [publishingAll, setPublishingAll] = useState(false);
  const [publishAllResult, setPublishAllResult] = useState<"idle" | "success" | "error">("idle");
  const generated = generateMockContent(item.transcript, item.sourceTitle);

  const handlePublishAll = async () => {
    setPublishingAll(true);
    setPublishAllResult("idle");
    try {
      const pieces = (Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => ({
        platform,
        copy: generated[platform].copy,
        hashtags: generated[platform].hashtags,
      }));
      const result = await publishPieces(pieces);
      if (result.error) {
        setPublishAllResult("error");
      } else {
        const allOk = result.results?.every((r: { ok: boolean }) => r.ok) ?? false;
        setPublishAllResult(allOk ? "success" : "error");
      }
    } catch {
      setPublishAllResult("error");
    } finally {
      setPublishingAll(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "#F1C02830", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <Sparkles size={16} style={{ color: "#F1C028" }} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {item.sourceTitle}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-light)" }}>
            Source: {item.sourceType} &middot; 5 platform versions generated
          </p>
        </div>
        {expanded ? (
          <ChevronDown size={14} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronRight size={14} style={{ color: "var(--muted)" }} />
        )}
      </div>

      {/* POV transcript */}
      <div
        className="rounded-lg p-3 mt-3 text-xs leading-relaxed"
        style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
          Your POV
        </p>
        <p style={{ color: "var(--foreground)" }}>&ldquo;{item.transcript}&rdquo;</p>
      </div>

      {expanded && (
        <div className="mt-4">
          {/* Publish All button */}
          <button
            onClick={handlePublishAll}
            disabled={publishingAll || publishAllResult === "success"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white mb-3 disabled:opacity-50"
            style={{
              background: publishAllResult === "success"
                ? "#1EAA55"
                : publishAllResult === "error"
                ? "#E24D47"
                : "linear-gradient(135deg, #F1C028 0%, #E37FB1 100%)",
            }}
          >
            {publishingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : publishAllResult === "success" ? (
              <CheckCircle2 size={14} />
            ) : publishAllResult === "error" ? (
              <AlertCircle size={14} />
            ) : (
              <Send size={14} />
            )}
            {publishingAll
              ? "Publishing All Platforms..."
              : publishAllResult === "success"
              ? "All Platforms Published"
              : publishAllResult === "error"
              ? "Some Platforms Failed — Retry Individual Below"
              : "Publish All Platforms"}
          </button>

          <div className="space-y-2">
            {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => (
              <PlatformCard
                key={platform}
                content={generated[platform]}
                config={PLATFORM_CONFIG[platform]}
                sourceTitle={item.sourceTitle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentPipeline({ queue }: Props) {
  if (queue.length === 0) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <Sparkles size={32} style={{ color: "#F1C02840" }} className="mx-auto mb-3" />
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
          No content in the pipeline yet
        </p>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Go to the Daily Brief, find a story, record your POV, and it will appear here
          with platform-specific content ready to review.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Pipeline stats */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          background: "linear-gradient(135deg, #F1C028 0%, #E37FB1 100%)",
        }}
      >
        <Sparkles className="text-white shrink-0" size={22} strokeWidth={2} />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Content Pipeline</p>
          <p className="text-white/60 text-xs">
            {queue.length} source{queue.length !== 1 ? "s" : ""} &middot;{" "}
            {queue.length * 5} pieces generated
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-white text-2xl font-bold">{queue.length * 5}</p>
          <p className="text-white/50 text-[10px] uppercase tracking-wider">pieces ready</p>
        </div>
      </div>

      <div className="space-y-4">
        {queue.map((item) => (
          <QueueItem key={item.sourceId} item={item} />
        ))}
      </div>
    </div>
  );
}
