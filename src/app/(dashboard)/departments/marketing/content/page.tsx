"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Mic,
  FolderOpen,
  LayoutTemplate,
  Brain,
  Linkedin,
  Instagram,
  Pin,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Sparkles,
  XCircle,
  MessageCircle,
  FileText,
  PenTool,
} from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";
import RejectionModal from "@/components/review/RejectionModal";
import DiscussPanel from "@/components/review/DiscussPanel";

const ACCENT = "#5A6FFF";

// --- Mock Data ---

const DAILY_BRIEF_ITEMS = [
  {
    id: "db-1",
    type: "news" as const,
    title: "New Study: CoQ10 Supplementation Improves Oocyte Quality in Women Over 35",
    source: "Fertility & Sterility, Feb 2026",
    sourceUrl: "https://www.fertstert.org/article/coq10-oocyte-quality-2026",
    relevance: 9.2,
    status: "new" as const,
    summary:
      "A landmark study published in Fertility & Sterility demonstrates that CoQ10 supplementation (600mg daily) significantly improved oocyte quality markers in women aged 35-42. The double-blind, placebo-controlled trial of 186 women showed a 28% improvement in embryo quality scores.",
  },
  {
    id: "db-2",
    type: "news" as const,
    title: "FDA Clears First AI-Powered Fertility Monitoring Device",
    source: "MedTech Dive",
    sourceUrl: "https://www.medtechdive.com/news/fda-ai-fertility-monitoring-clearance",
    relevance: 8.8,
    status: "new" as const,
    summary:
      "The FDA has granted 510(k) clearance to OvuSense's AI-powered continuous core body temperature monitoring device, marking the first AI fertility device to receive regulatory approval. This could accelerate the legitimacy of AI-based fertility monitoring.",
  },
  {
    id: "db-3",
    type: "research" as const,
    title: "Circadian Rhythm Disruption and Its Impact on Implantation Rates",
    source: "Nature Medicine",
    sourceUrl: "https://www.nature.com/articles/nm-circadian-implantation-2026",
    relevance: 8.5,
    status: "new" as const,
    summary:
      "Researchers at Stanford found that even mild circadian disruption (shift work, late-night screen exposure) reduced implantation rates by 15-23%. The study tracked 412 women through IVF cycles and correlated sleep quality metrics with outcomes.",
  },
  {
    id: "db-4",
    type: "reddit" as const,
    title: "r/TryingForABaby \u2014 'Has anyone tried Conceivable? Looking for real reviews'",
    source: "Reddit",
    sourceUrl: "https://www.reddit.com/r/TryingForABaby/comments/conceivable_reviews",
    relevance: 9.5,
    status: "review" as const,
    summary:
      "A user on r/TryingForABaby is asking for real experiences with Conceivable. This is a high-value community engagement opportunity \u2014 authentic responses from real users are the most powerful marketing tool.",
  },
  {
    id: "db-5",
    type: "reddit" as const,
    title: "r/infertility \u2014 'AI fertility apps: science or snake oil?'",
    source: "Reddit",
    sourceUrl: "https://www.reddit.com/r/infertility/comments/ai_fertility_apps_debate",
    relevance: 8.9,
    status: "review" as const,
    summary:
      "The r/infertility community is debating whether AI fertility apps deliver real value or are just marketing hype. This is a critical conversation to monitor and respond to authentically.",
  },
];

const CONTENT_VAULT_ITEMS = [
  {
    id: "cv-1",
    title: "BBT Tracking: The Complete Guide",
    type: "Long-form",
    status: "approved",
    date: "2026-02-25",
    preview:
      "Basal body temperature tracking is one of the most reliable at-home methods for understanding your cycle. This comprehensive guide covers the science behind BBT, how to track accurately, what the patterns mean, and how Conceivable's AI uses BBT data alongside other biomarkers to give you a complete fertility picture.",
  },
  {
    id: "cv-2",
    title: "5 Signs Your Luteal Phase Needs Attention",
    type: "Carousel",
    status: "approved",
    date: "2026-02-22",
    preview:
      "Your luteal phase \u2014 the time between ovulation and your period \u2014 is a critical window for implantation. This carousel breaks down five evidence-based signs that your luteal phase may need support: short phase length (<10 days), spotting before your period, low progesterone symptoms, temperature instability, and cycle-to-cycle variability.",
  },
  {
    id: "cv-3",
    title: "Why Personalized Fertility Care Matters",
    type: "Video Script",
    status: "approved",
    date: "2026-02-20",
    preview:
      "A 3-minute video script for Kirsten's direct-to-camera take on why one-size-fits-all fertility advice fails. Covers the science of individual variation in hormone patterns, metabolic profiles, and lifestyle factors \u2014 and how Conceivable's AI adapts to each user's unique biology.",
  },
  {
    id: "cv-4",
    title: "The Science Behind Conceivable's AI",
    type: "Blog Post",
    status: "approved",
    date: "2026-02-18",
    preview:
      "A deep-dive blog post explaining how Conceivable's closed-loop AI system works: continuous data ingestion from wearables + self-reported symptoms, pattern recognition across 40+ biomarkers, personalized protocol recommendations, and outcome tracking. Written for the scientifically curious user.",
  },
  {
    id: "cv-5",
    title: "Glucose & Fertility: What the Data Shows",
    type: "Thread",
    status: "approved",
    date: "2026-02-15",
    preview:
      "A 10-post thread breaking down the latest research on glucose variability and fertility outcomes. Covers insulin resistance, CGM data insights, dietary interventions, and how Conceivable integrates glucose data into its fertility optimization protocols.",
  },
];

const PLATFORM_GROUPS = [
  {
    name: "Professional",
    platforms: ["LinkedIn", "X", "Bluesky"],
    icon: Linkedin,
    color: "#356FB6",
    scheduled: 8,
    publishedToday: 2,
    engagementScore: 78,
  },
  {
    name: "Social",
    platforms: ["Instagram", "Facebook"],
    icon: Instagram,
    color: "#E37FB1",
    scheduled: 5,
    publishedToday: 1,
    engagementScore: 65,
  },
  {
    name: "Visual",
    platforms: ["Pinterest"],
    icon: Pin,
    color: "#E24D47",
    scheduled: 3,
    publishedToday: 0,
    engagementScore: 42,
  },
  {
    name: "Community",
    platforms: ["Circle"],
    icon: Users,
    color: "#1EAA55",
    scheduled: 4,
    publishedToday: 2,
    engagementScore: 91,
  },
];

const CARE_TEAM_CHARACTERS = [
  {
    name: "Joy",
    role: "AI Operations Chief",
    color: "#5A6FFF",
    description: "Powers the Command Center. Manages cross-department coordination, content deployment, and strategic briefs.",
    voiceTone: "Confident, warm, efficient. Like a brilliant COO who genuinely cares.",
  },
  {
    name: "Kai",
    role: "AI Fertility Coach",
    color: "#78C3BF",
    description: "User-facing AI coach in the Conceivable app. Guides women through their fertility journey with personalized insights.",
    voiceTone: "Calm, empathetic, scientifically grounded. The most emotionally intelligent doctor you've ever met.",
  },
  {
    name: "Dr. C",
    role: "Clinical Content Voice",
    color: "#1EAA55",
    description: "The clinical authority voice for blog posts, research explainers, and medical content. Translates science into accessible language.",
    voiceTone: "Authoritative but accessible. Evidence-first, never alarmist. Cites research naturally.",
  },
  {
    name: "The Community Voice",
    role: "Social & Community",
    color: "#E37FB1",
    description: "Voice for Instagram, social media, Circle posts. Relatable, encouraging, and real about the fertility journey.",
    voiceTone: "Warm, real, validating. Like your most supportive friend who also happens to know the science.",
  },
];

const DEPLOYMENT_STRATEGIES = [
  { source: "1 POV Recording", output: "5 platform-specific posts", multiplier: "5x" },
  { source: "1 Research Article", output: "Thread + Carousel + Blog + 2 Social", multiplier: "5x" },
  { source: "1 Expert Interview", output: "10 clips + Blog + Newsletter + Community Post", multiplier: "13x" },
  { source: "1 Reddit Insight", output: "Response + Thread + FAQ Update", multiplier: "3x" },
];

export default function MarketingContentPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"brief" | "vault" | "deploy">("brief");
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedVaultItems, setExpandedVaultItems] = useState<Set<string>>(new Set());
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; title: string } | null>(null);
  const [discussTarget, setDiscussTarget] = useState<{ id: string; title: string; detail: string } | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleVaultExpanded = (id: string) => {
    setExpandedVaultItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApproveContent = async (id: string) => {
    setApprovedItems((prev) => new Set(prev).add(id));
  };

  const handleRejectContent = async (reasonCategory: string, reasonText: string) => {
    if (!rejectionTarget) return;
    await fetch("/api/rejections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommendationId: rejectionTarget.id,
        recommendationType: "content",
        reasonCategory,
        reasonText,
      }),
    });
    setApprovedItems((prev) => new Set(prev).add(rejectionTarget.id));
    setRejectionTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Sparkles size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {DAILY_BRIEF_ITEMS.length} items to review today
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {CONTENT_VAULT_ITEMS.length} approved pieces in vault &middot;{" "}
              {PLATFORM_GROUPS.reduce((s, g) => s + g.scheduled, 0)} scheduled across platforms
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: ACCENT }}>
            37
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            / 100 weekly target
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "brief" as const, label: "Daily Brief", icon: Newspaper },
          { id: "vault" as const, label: "Content Vault", icon: FolderOpen },
          { id: "deploy" as const, label: "Content Brain", icon: Brain },
        ].map((sec) => {
          const active = activeSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                active
                  ? { backgroundColor: `${ACCENT}14`, color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} />
              {sec.label}
            </button>
          );
        })}
        <a
          href="/departments/content/templates"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-auto"
          style={{ color: "var(--muted)" }}
        >
          <LayoutTemplate size={15} />
          Template Gallery
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Daily Brief */}
      {activeSection === "brief" && (
        <div className="space-y-4">
          {/* POV Recording Prompt */}
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: `${ACCENT}14` }}
              >
                <Mic size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Record Your POV
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Tap to record a 2-minute take on any item below. The Content Brain turns it into 5+ platform-ready pieces.
                </p>
              </div>
            </div>
          </div>

          {/* News / Research / Reddit Items */}
          <div className="space-y-3">
            {DAILY_BRIEF_ITEMS.filter((item) => !approvedItems.has(item.id)).map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: isExpanded
                      ? `1px solid ${ACCENT}40`
                      : "1px solid var(--border)",
                    boxShadow: isExpanded ? `0 2px 12px ${ACCENT}10` : "none",
                  }}
                >
                  {/* Clickable header area */}
                  <div
                    className="p-4 flex items-start gap-4 cursor-pointer select-none"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div
                      className="px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0"
                      style={{
                        backgroundColor:
                          item.type === "news"
                            ? "#356FB614"
                            : item.type === "research"
                            ? "#9686B914"
                            : "#F1C02814",
                        color:
                          item.type === "news"
                            ? "#356FB6"
                            : item.type === "research"
                            ? "#9686B9"
                            : "#F1C028",
                      }}
                    >
                      {item.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                        {item.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {item.source} &middot; Relevance: {item.relevance}/10
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "review" && (
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}
                        >
                          NEEDS REVIEW
                        </span>
                      )}
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${ACCENT}14` }}
                        title="Record POV"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mic size={14} style={{ color: ACCENT }} />
                      </button>
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center transition-transform"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          color: "var(--muted)",
                        }}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-4"
                      style={{
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {/* Summary */}
                      <div
                        className="mt-4 mb-4 p-4 rounded-lg"
                        style={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider mb-2"
                          style={{ color: "var(--muted)" }}
                        >
                          Summary
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {item.summary}
                        </p>
                      </div>

                      {/* Source link + action buttons row */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: "#356FB614", color: "#356FB6" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={12} />
                          Read Full Article
                        </a>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: "#9686B914", color: "#9686B9" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/agents/content-engine?prompt=${encodeURIComponent(
                                `Create an SEO-optimized blog post based on this article: "${item.title}" (source: ${item.source}). Summary: ${item.summary}. Write it in Conceivable's brand voice — calm, intelligent, empathetic, empowering. Include target keywords, meta description, and suggested internal links.`
                              )}`
                            );
                          }}
                        >
                          <PenTool size={12} />
                          Create SEO Post from This
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action buttons row - always visible */}
                  <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveContent(item.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#1EAA55" }}
                    >
                      <CheckCircle2 size={12} />
                      Add to Pipeline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectionTarget({ id: item.id, title: item.title });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#E24D47" }}
                    >
                      <XCircle size={12} />
                      Skip
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDiscussTarget({
                          id: item.id,
                          title: item.title,
                          detail: `${item.type} from ${item.source}: "${item.title}" (relevance: ${item.relevance}/10)`,
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                    >
                      <MessageCircle size={12} />
                      Discuss
                    </button>
                    <JoyButton
                      agent="content-engine"
                      prompt={`Draft a Conceivable content response to this ${item.type} item: "${item.title}" (source: ${item.source}, relevance: ${item.relevance}/10). Write it in Conceivable's brand voice — calm, intelligent, empathetic, empowering. Include a social media post, a blog angle, and an email snippet.`}
                      label="Draft Content"
                      iconSize={10}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Vault */}
      {activeSection === "vault" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Approved Content Library
            </p>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {CONTENT_VAULT_ITEMS.length} pieces
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {CONTENT_VAULT_ITEMS.map((item) => {
              const isVaultExpanded = expandedVaultItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="transition-all"
                  style={{
                    backgroundColor: isVaultExpanded ? "var(--surface)" : "var(--background)",
                  }}
                >
                  {/* Clickable header */}
                  <div
                    className="px-5 py-3 flex items-center gap-3 cursor-pointer select-none"
                    onClick={() => toggleVaultExpanded(item.id)}
                  >
                    <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                        {item.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {item.type} &middot; {item.date}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                    >
                      APPROVED
                    </span>
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center transition-transform"
                      style={{
                        transform: isVaultExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        color: "var(--muted)",
                      }}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  {/* Expanded preview */}
                  {isVaultExpanded && (
                    <div
                      className="px-5 pb-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <div
                        className="mt-3 p-4 rounded-lg"
                        style={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider mb-2"
                          style={{ color: "var(--muted)" }}
                        >
                          Content Preview
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {item.preview}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <JoyButton
                          agent="content-engine"
                          prompt={`Review and refine this ${item.type} content piece: "${item.title}". Preview: ${item.preview}. Suggest improvements for SEO, engagement, and brand voice alignment.`}
                          label="Refine with Joy"
                          variant="secondary"
                          iconSize={11}
                        />
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                        >
                          <FileText size={12} />
                          View Full Content
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Brain Deployment Strategy */}
      {activeSection === "deploy" && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              Content Brain: Input-to-Output Multiplier
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Every piece of source material gets multiplied across platforms automatically.
              CEO records POV (Unique Ability), agents handle deployment (Who Not How).
            </p>
            <div className="space-y-3">
              {DEPLOYMENT_STRATEGIES.map((strategy, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="px-2 py-1 rounded text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                  >
                    {strategy.multiplier}
                  </div>
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>
                    {strategy.source}
                  </span>
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    {strategy.output}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Care Team Characters */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Content Care Team
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARE_TEAM_CHARACTERS.map((character) => (
            <div
              key={character.name}
              className="rounded-xl p-4"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: character.color }}
                >
                  {character.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {character.name}
                  </p>
                  <p className="text-[10px]" style={{ color: character.color }}>
                    {character.role}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--foreground)" }}>
                {character.description}
              </p>
              <p className="text-[10px] italic" style={{ color: "var(--muted)" }}>
                Voice: {character.voiceTone}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Groups */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Platform Distribution
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.name}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} style={{ color: group.color }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {group.name}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                  {group.platforms.join(" + ")}
                </p>
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Scheduled</span>
                    <span style={{ color: "var(--foreground)" }}>{group.scheduled}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Published Today</span>
                    <span style={{ color: "var(--foreground)" }}>{group.publishedToday}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Engagement</span>
                    <span style={{ color: group.color, fontWeight: 600 }}>{group.engagementScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleRejectContent}
        itemTitle={rejectionTarget?.title || ""}
        itemType="content"
      />

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="content"
        contextId={discussTarget?.id || ""}
        contextTitle={discussTarget?.title || ""}
        contextDetail={discussTarget?.detail}
        onApprove={discussTarget ? () => { handleApproveContent(discussTarget.id); setDiscussTarget(null); } : undefined}
        onReject={discussTarget ? () => { setRejectionTarget({ id: discussTarget.id, title: discussTarget.title }); setDiscussTarget(null); } : undefined}
      />
    </div>
  );
}
