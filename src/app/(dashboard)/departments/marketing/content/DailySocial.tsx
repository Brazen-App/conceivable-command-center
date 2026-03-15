"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mic,
  CheckCircle2,
  ExternalLink,
  XCircle,
  Loader2,
  Send,
  Edit3,
  X,
  Linkedin,
  Instagram,
  Pin,
  Youtube,
  BookOpen,
  Users,
  Video,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  PenLine,
  Clock,
  Save,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Upload,
} from "lucide-react";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";

// --- Types ---

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string | null;
  brief: string;
  tag: string;
  isViral: boolean;
  summary: string;
  agentRecommendation: string;
  coverageAngle: string;
  timestamp: string;
}

interface ResearchItem {
  id: string;
  title: string;
  journal: string;
  brief: string;
  relevanceScore: number;
  fullAbstract: string;
  timestamp: string;
}

interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  body: string;
  upvotes: number;
  url?: string | null;
  relevanceScore: number;
  status: string;
  timestamp: string;
}

interface VideoItem {
  title: string;
  platform: "youtube" | "tiktok" | "instagram";
  creator: string;
  url: string;
  thumbnailUrl?: string;
  views?: string;
  publishedAt: string;
  snippet: string;
  isViral: boolean;
  relevance: string;
}

interface ContentItem {
  id: string;
  type: "news" | "research" | "reddit" | "video";
  title: string;
  source: string;
  sourceUrl?: string | null;
  summary: string;
  fullSummary: string;
  videoPlatform?: "youtube" | "tiktok" | "instagram";
  isViral?: boolean;
}

interface DraftCard {
  id: string;
  platform: string;
  title: string;
  body: string;
  imageUrl: string | null;
  imageLoading: boolean;
  imagePrompt: string | null;
  imageVersion: number;
  imageApproved: boolean;
  status: "draft" | "editing" | "posted" | "queued";
  posting: boolean;
  postError: string | null;
}

interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  exampleHook: string;
}

interface ItemState {
  povOpen: boolean;
  povText: string;
  povDone: boolean;
  drafting: boolean;
  cards: DraftCard[];
  templateId: string | null;
  heroImage: string | null;
  heroImageLoading: boolean;
  heroTitle: string;
}

// Expanded feedback options
const FEEDBACK_OPTIONS = [
  { id: "too_clinical", label: "Too corporate/clinical" },
  { id: "too_casual", label: "Too casual/unprofessional" },
  { id: "wrong_colors", label: "Wrong colors (not on brand)" },
  { id: "garbled_text", label: "Text is unreadable/garbled" },
  { id: "wrong_vibe", label: "Wrong mood/vibe" },
  { id: "doesnt_match", label: "Doesn't match topic" },
  { id: "poor_composition", label: "Poor composition" },
  { id: "wrong_demographics", label: "Wrong demographics shown" },
];

// --- Helpers ---

function twoSentenceSummary(text: string): string {
  const clean = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) return sentences.slice(0, 2).join("").trim();
  return clean.slice(0, 200) + (clean.length > 200 ? "..." : "");
}

function toContentItems(news: NewsItem[], research: ResearchItem[], reddit: RedditPost[], video: VideoItem[] = []): ContentItem[] {
  const items: ContentItem[] = [];
  for (const n of news) {
    items.push({ id: n.id, type: "news", title: n.title, source: n.source, sourceUrl: n.sourceUrl, summary: twoSentenceSummary(n.summary), fullSummary: n.summary });
  }
  for (const r of research) {
    items.push({ id: r.id, type: "research", title: r.title, source: r.journal, sourceUrl: null, summary: twoSentenceSummary(r.brief || r.fullAbstract), fullSummary: r.fullAbstract });
  }
  for (const rp of reddit) {
    if (rp.status === "posted" || rp.status === "skipped") continue;
    items.push({ id: rp.id, type: "reddit", title: `${rp.subreddit} — "${rp.title}"`, source: "Reddit", sourceUrl: rp.url, summary: twoSentenceSummary(rp.body), fullSummary: rp.body });
  }
  for (const v of video) {
    const platformLabel = v.platform === "youtube" ? "YouTube" : v.platform === "tiktok" ? "TikTok" : "Instagram";
    const viralTag = v.isViral ? " [VIRAL]" : "";
    const viewsTag = v.views ? ` (${v.views})` : "";
    items.push({
      id: `video-${v.url}`,
      type: "video",
      title: `${viralTag}${v.title}`,
      source: `${platformLabel} — ${v.creator}${viewsTag}`,
      sourceUrl: v.url,
      summary: v.snippet || v.relevance,
      fullSummary: `${v.relevance}\n\n${v.snippet}`,
      videoPlatform: v.platform,
      isViral: v.isViral,
    });
  }
  return items;
}

const PLATFORM_META: Record<string, { label: string; icon: typeof Linkedin; color: string; gradient: string }> = {
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#0A66C2", gradient: "linear-gradient(135deg, #0A66C2, #004182)" },
  x: { label: "X / Twitter", icon: MessageCircle, color: "#000000", gradient: "linear-gradient(135deg, #14171A, #657786)" },
  bluesky: { label: "Bluesky", icon: Send, color: "#0085FF", gradient: "linear-gradient(135deg, #0085FF, #0066CC)" },
  "instagram-post": { label: "Instagram", icon: Instagram, color: "#E4405F", gradient: "linear-gradient(135deg, #E4405F, #833AB4)" },
  "instagram-carousel": { label: "IG Carousel", icon: Instagram, color: "#833AB4", gradient: "linear-gradient(135deg, #833AB4, #E4405F)" },
  "instagram-story": { label: "IG Story", icon: Instagram, color: "#F77737", gradient: "linear-gradient(135deg, #F77737, #E4405F)" },
  pinterest: { label: "Pinterest", icon: Pin, color: "#BD081C", gradient: "linear-gradient(135deg, #BD081C, #8C0615)" },
  tiktok: { label: "TikTok", icon: Video, color: "#25F4EE", gradient: "linear-gradient(135deg, #25F4EE, #FE2C55)" },
  youtube: { label: "YouTube", icon: Youtube, color: "#FF0000", gradient: "linear-gradient(135deg, #FF0000, #CC0000)" },
  blog: { label: "Blog", icon: BookOpen, color: "#1EAA55", gradient: "linear-gradient(135deg, #1EAA55, #0D7A3E)" },
  circle: { label: "Circle", icon: Users, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)" },
};

function getDefaultMeta() {
  return { label: "Content", icon: Sparkles, color: ACCENT, gradient: `linear-gradient(135deg, ${ACCENT}, #3B4FCC)` };
}

// --- Main Page ---

export default function DailySocial() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const fetchData = useCallback(async (initial = false) => {
    if (initial) setLoading(true);
    try {
      const res = await fetch("/api/content-engine");
      const data = await res.json();
      setItems(toContentItems(data.newsItems ?? [], data.researchItems ?? [], data.redditPosts ?? [], data.videoItems ?? []));
    } catch { /* */ }
    finally { if (initial) setLoading(false); }
  }, []);

  useEffect(() => { fetchData(true); }, [fetchData]);

  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    setRefreshSuccess(null);
    try {
      const res = await fetch("/api/briefs/refresh", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        await fetchData(false);
        const c = data.counts;
        if (c && (c.news > 0 || c.research > 0 || c.reddit > 0 || c.video > 0)) {
          setRefreshSuccess(`Found ${c.news} news, ${c.research} research, ${c.reddit} Reddit, ${c.video || 0} video`);
        } else {
          setRefreshSuccess(data.message || "No new content found from sources. Try again later.");
        }
        setTimeout(() => setRefreshSuccess(null), 8000);
      } else {
        setRefreshError(data.error || "Refresh failed");
      }
    } catch {
      setRefreshError("Network error — check connection and try again");
    } finally {
      setIsRefreshing(false);
    }
  };

  const [templates, setTemplates] = useState<ContentTemplate[]>([]);

  useEffect(() => {
    fetch("/api/content/templates").then((r) => r.json()).then((d) => setTemplates(d.templates || [])).catch(() => {});
  }, []);

  const getState = (id: string): ItemState =>
    itemStates[id] || { povOpen: false, povText: "", povDone: false, drafting: false, cards: [], templateId: null, heroImage: null, heroImageLoading: false, heroTitle: "" } as ItemState;

  const setState = (id: string, updater: (prev: ItemState) => ItemState) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: updater(prev[id] || { povOpen: false, povText: "", povDone: false, drafting: false, cards: [], templateId: null, heroImage: null, heroImageLoading: false, heroTitle: "" }),
    }));
  };

  // Generate hero image using REAL AI image generation (FAL.ai Flux)
  // Only available AFTER POV/angle is provided (the button is disabled until then)
  const generateHeroImage = async (itemId: string, topic: string) => {
    setState(itemId, (s) => ({ ...s, heroImageLoading: true }));

    try {
      const state = getState(itemId);
      const povText = state.povText || "";

      // Build a rich prompt from the topic + POV angle
      const prompt = povText
        ? `${topic}. Visual angle: ${povText.slice(0, 300)}. Create a striking, professional image for a fertility health brand.`
        : `${topic}. Create a warm, professional image for a fertility health brand called Conceivable.`;

      const res = await fetch("/api/content/ai-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          overlayText: state.heroTitle || topic,
          platform: "linkedin",
          style: "photography",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Image generation failed" }));
        throw new Error(errData.error || `Image API error (${res.status})`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setState(itemId, (s) => ({ ...s, heroImage: data.imageData, heroImageLoading: false }));
    } catch (err) {
      console.error("Hero image generation failed:", err);
      setState(itemId, (s) => ({ ...s, heroImageLoading: false }));
    }
  };

  // Generate all platform drafts — uses hero image for all cards
  const generateDrafts = async (item: ContentItem, povText: string) => {
    setState(item.id, (s) => ({ ...s, drafting: true, povOpen: false, povDone: true }));

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: item.title, founderAngle: povText, sourceStoryId: item.id, templateId: getState(item.id).templateId }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Generation failed"); }
      const data = await res.json();

      // Use the hero image from POV section for all cards
      const heroImg = getState(item.id).heroImage;

      const cards: DraftCard[] = (data.pieces || []).map(
        (p: { platform: string; title: string; body: string }, i: number) => ({
          id: `${item.id}-${i}`,
          platform: p.platform,
          title: p.title,
          body: p.body,
          imageUrl: heroImg || null,
          imageLoading: false,
          imagePrompt: null,
          imageVersion: heroImg ? 1 : 0,
          imageApproved: false,
          status: "draft" as const,
          posting: false,
          postError: null,
        })
      );

      setState(item.id, (s) => ({ ...s, drafting: false, cards }));
    } catch (err) {
      setState(item.id, (s) => ({
        ...s, drafting: false,
        cards: [{ id: `${item.id}-err`, platform: "error", title: "Error", body: err instanceof Error ? err.message : "Failed", imageUrl: null, imageLoading: false, imagePrompt: null, imageVersion: 0, imageApproved: false, status: "draft", posting: false, postError: null }],
      }));
    }
  };

  // AI image generation using FAL.ai Flux
  const generateSmartImage = async (
    itemId: string, cardId: string, platform: string, topic: string, content: string,
    customPrompt?: string, feedback?: string, feedbackText?: string
  ) => {
    const itemState = itemStates[itemId];
    const card = itemState?.cards.find((c) => c.id === cardId);
    const cardTitle = card?.title || topic;

    setState(itemId, (s) => ({
      ...s,
      cards: s.cards.map((c) => c.id === cardId ? { ...c, imageLoading: true } : c),
    }));

    try {
      // Build prompt incorporating feedback if provided
      let prompt = customPrompt || `${topic}. Context: ${content.slice(0, 300)}. Professional image for a fertility health brand.`;
      if (feedback) {
        prompt = `${prompt}. Feedback on previous version: ${feedback}. ${feedbackText || ""}`;
      }

      const res = await fetch("/api/content/ai-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          overlayText: cardTitle,
          platform,
          style: "photography",
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Image generation failed" }));
        throw new Error(errData.error || `Image API error (${res.status})`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setState(itemId, (s) => ({
        ...s,
        cards: s.cards.map((c) => c.id === cardId ? {
          ...c, imageUrl: data.imageData, imageLoading: false,
          imagePrompt: data.prompt, imageVersion: c.imageVersion + 1,
        } : c),
      }));

      // Save feedback data for learning
      if (feedback) {
        fetch("/api/content/image-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: cardId, platform, topic, promptUsed: data.prompt || "",
            feedback: [feedback], feedbackText, regenerated: true,
          }),
        }).catch(() => {});
      }
    } catch {
      setState(itemId, (s) => ({
        ...s,
        cards: s.cards.map((c) => c.id === cardId ? { ...c, imageLoading: false } : c),
      }));
    }
  };

  // Queue post at optimal time
  const queuePost = async (itemId: string, cardId: string) => {
    const state = getState(itemId);
    const card = state.cards.find((c) => c.id === cardId);
    if (!card) return;

    setState(itemId, (s) => ({
      ...s,
      cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: true, postError: null } : c),
    }));

    try {
      const res = await fetch("/api/content/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieces: [{ platform: card.platform, title: card.title, body: card.body }] }),
      });
      const result = await res.json();
      if (result.ok) {
        const scheduledTime = result.items?.[0]?.scheduledDisplay || "optimal time";
        setState(itemId, (s) => ({
          ...s,
          cards: s.cards.map((c) => c.id === cardId ? { ...c, status: "queued" as const, posting: false, postError: `Queued for ${scheduledTime}` } : c),
        }));
      } else {
        throw new Error(result.error || "Queue failed");
      }
    } catch (err) {
      setState(itemId, (s) => ({
        ...s,
        cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: false, postError: err instanceof Error ? err.message : "Queue failed" } : c),
      }));
    }
  };

  // Post immediately
  const postCard = async (itemId: string, cardId: string) => {
    const state = getState(itemId);
    const card = state.cards.find((c) => c.id === cardId);
    if (!card) return;

    setState(itemId, (s) => ({
      ...s,
      cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: true, postError: null } : c),
    }));

    try {
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieces: [{ platform: card.platform, copy: card.body, hashtags: [], title: card.title, imageData: card.imageUrl || undefined }] }),
      });
      const result = await res.json();
      if (result.error) {
        setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: false, postError: result.error } : c) }));
      } else {
        const cardResult = result.results?.find((r: { platform: string }) => r.platform === card.platform);
        const hasError = cardResult?.ok === false;
        const isQueued = !hasError && (cardResult?.queued || cardResult?.data?.queued);
        const message = cardResult?.data?.message || cardResult?.error || null;
        if (hasError) {
          setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: false, postError: message || "Publish failed" } : c) }));
        } else {
          setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, status: isQueued ? "queued" as const : "posted" as const, posting: false, postError: isQueued ? (message || "queued") : null } : c) }));
        }
      }
    } catch (err) {
      setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, posting: false, postError: err instanceof Error ? err.message : "Network error" } : c) }));
    }
  };

  const updateCardBody = (itemId: string, cardId: string, newBody: string) => {
    setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, body: newBody, status: "draft" as const } : c) }));
  };

  // Upload custom image to replace generated one
  const uploadImage = (itemId: string, cardId: string, dataUrl: string) => {
    setState(itemId, (s) => ({
      ...s,
      cards: s.cards.map((c) => c.id === cardId ? {
        ...c,
        imageUrl: dataUrl,
        imageVersion: c.imageVersion + 1,
        imagePrompt: "User uploaded image",
        imageApproved: false,
      } : c),
    }));
  };

  const approveImage = (itemId: string, cardId: string) => {
    setState(itemId, (s) => ({ ...s, cards: s.cards.map((c) => c.id === cardId ? { ...c, imageApproved: true } : c) }));
    // Save approval feedback for learning
    const state = getState(itemId);
    const card = state.cards.find((c) => c.id === cardId);
    if (card) {
      fetch("/api/content/image-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: cardId, platform: card.platform, topic: "",
          promptUsed: card.imagePrompt || "", approved: true, finalVersion: card.imageVersion,
        }),
      }).catch(() => {});
    }
  };

  // Voice input
  const startVoiceInput = (itemId: string, existingText: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported. Please type your POV."); return; }
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    let accumulated = existingText;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) accumulated += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setState(itemId, (s) => ({ ...s, povText: accumulated + interim }));
    };
    recognition.onerror = () => recognition.stop();
    setTimeout(() => recognition.stop(), 30000);
    recognition.start();
  };

  const visibleItems = items.filter((item) => !skipped.has(item.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 size={18} className="animate-spin" style={{ color: ACCENT }} />
          <span className="text-sm" style={{ color: "var(--muted)" }}>Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>{visibleItems.length} items to review</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fetchData(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--border)", color: "var(--foreground)", backgroundColor: "var(--surface)" }}>
            <RefreshCw size={12} /> Reload
          </button>
          {isRefreshing ? (
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold opacity-60" style={{ backgroundColor: "#F1C028", color: "#000" }}>
              <RefreshCw size={14} className="animate-spin" /> Fetching...
            </span>
          ) : (
            <button type="button" onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all no-underline" style={{ backgroundColor: "#F1C028", color: "#000" }}>
              <RefreshCw size={14} /> Refresh Content
            </button>
          )}
        </div>
      </div>

      {isRefreshing && (
        <div className="px-4 py-2.5 rounded-xl text-xs flex items-center gap-2" style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02818", color: "var(--muted)" }}>
          <Loader2 size={12} className="animate-spin" style={{ color: "#F1C028" }} />
          Fetching real articles from Google News, PubMed, and Reddit — this takes about a minute...
        </div>
      )}

      {refreshError && (
        <div className="px-4 py-2.5 rounded-xl text-xs" style={{ backgroundColor: "#E24D4710", color: "#E24D47", border: "1px solid #E24D4720" }}>
          {refreshError}
        </div>
      )}

      {refreshSuccess && (
        <div className="px-4 py-2.5 rounded-xl text-xs flex items-center gap-2" style={{ backgroundColor: "#1EAA5510", color: "#1EAA55", border: "1px solid #1EAA5520" }}>
          <CheckCircle2 size={12} /> {refreshSuccess}
        </div>
      )}

      {visibleItems.length === 0 && !isRefreshing && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <CheckCircle2 size={32} style={{ color: `${GREEN}40` }} className="mx-auto mb-3" />
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>No content items yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Click &quot;Refresh Content&quot; to fetch articles from Google News, PubMed &amp; Reddit</p>
        </div>
      )}

      {visibleItems.map((item) => {
        const state = getState(item.id);
        const hasCards = state.cards.length > 0;

        return (
          <div key={item.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: `1px solid ${state.povOpen || hasCards ? `${ACCENT}40` : "var(--border)"}` }}>
            {/* Item header */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5" style={{
                  backgroundColor: item.type === "news" ? "#356FB614" : item.type === "research" ? "#9686B914" : item.type === "video" ? (item.videoPlatform === "youtube" ? "#FF000014" : item.videoPlatform === "tiktok" ? "#25F4EE14" : "#E4405F14") : "#F1C02814",
                  color: item.type === "news" ? "#356FB6" : item.type === "research" ? "#9686B9" : item.type === "video" ? (item.videoPlatform === "youtube" ? "#FF0000" : item.videoPlatform === "tiktok" ? "#00C9B1" : "#E4405F") : "#F1C028",
                }}>{item.type === "video" ? (item.videoPlatform === "youtube" ? "YouTube" : item.videoPlatform === "tiktok" ? "TikTok" : "Instagram") : item.type}{item.isViral ? " 🔥" : ""}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>{item.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{item.summary}</p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>{item.source}</p>
                </div>
              </div>

              {/* Buttons */}
              {!hasCards && !state.drafting && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {!state.povOpen && (
                    <button onClick={() => setState(item.id, (s) => ({ ...s, povOpen: true }))} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>
                      <Mic size={12} /> POV
                    </button>
                  )}
                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      <ExternalLink size={12} /> See Full Content
                    </a>
                  )}
                  <button onClick={() => setSkipped((prev) => new Set(prev).add(item.id))} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ color: "var(--muted)" }}>
                    <XCircle size={12} /> Skip
                  </button>
                </div>
              )}
              {state.drafting && (
                <div className="mt-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" style={{ color: ACCENT }} />
                  <span className="text-xs font-medium" style={{ color: ACCENT }}>Generating drafts + images for all platforms...</span>
                </div>
              )}
            </div>

            {/* POV Box */}
            {state.povOpen && !hasCards && !state.drafting && (
              <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>Your POV</span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>Type, paste, or tap mic</span>
                  </div>
                  <div className="relative">
                    <textarea
                      value={state.povText}
                      onChange={(e) => setState(item.id, (s) => ({ ...s, povText: e.target.value }))}
                      placeholder="What's your take? This becomes the founder angle for all generated content..."
                      className="w-full h-28 text-sm leading-relaxed rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-1"
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                    />
                    <button onClick={() => startVoiceInput(item.id, state.povText)} className="absolute right-3 top-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ backgroundColor: `${ACCENT}14` }} title="Record voice">
                      <Mic size={14} style={{ color: ACCENT }} />
                    </button>
                  </div>
                  {/* Template selector */}
                  {templates.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>Template (optional):</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <button
                          onClick={() => setState(item.id, (s) => ({ ...s, templateId: null }))}
                          className="px-2 py-1 rounded text-[9px] font-medium transition-all"
                          style={{
                            backgroundColor: !state.templateId ? `${ACCENT}20` : "var(--background)",
                            color: !state.templateId ? ACCENT : "var(--muted)",
                            border: `1px solid ${!state.templateId ? ACCENT : "var(--border)"}`,
                          }}
                        >None</button>
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setState(item.id, (s) => ({ ...s, templateId: t.id }))}
                            className="px-2 py-1 rounded text-[9px] font-medium transition-all"
                            style={{
                              backgroundColor: state.templateId === t.id ? `${ACCENT}20` : "var(--background)",
                              color: state.templateId === t.id ? ACCENT : "var(--foreground)",
                              border: `1px solid ${state.templateId === t.id ? ACCENT : "var(--border)"}`,
                            }}
                            title={t.exampleHook}
                          >{t.name}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hero Image Section */}
                  <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: ACCENT }}>Hero Image</span>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>Generated once, used across all platforms</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={state.heroTitle || ""}
                        onChange={(e) => setState(item.id, (s) => ({ ...s, heroTitle: e.target.value }))}
                        placeholder={item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title}
                        className="flex-1 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-1"
                        style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                      />
                      <button
                        onClick={() => generateHeroImage(item.id, item.title)}
                        disabled={state.heroImageLoading}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                        style={{ backgroundColor: ACCENT }}
                      >
                        {state.heroImageLoading ? (
                          <><RefreshCw size={12} className="animate-spin" /> Generating...</>
                        ) : (
                          <><ImageIcon size={12} /> {state.heroImage ? "Regenerate" : "Generate"}</>
                        )}
                      </button>
                      <label
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{ backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                      >
                        <Upload size={12} /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file || !file.type.startsWith("image/")) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setState(item.id, (s) => ({ ...s, heroImage: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }} />
                      </label>
                    </div>
                    <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>Title overlay (3-7 words, hook-style). Leave blank to use topic as title.</p>
                    {state.heroImage && (
                      <div className="rounded-lg overflow-hidden" style={{ maxHeight: "200px" }}>
                        <img src={state.heroImage} alt="Hero preview" className="w-full object-cover" style={{ maxHeight: "200px" }} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => { if (state.povText.trim().length > 10) generateDrafts(item, state.povText); }}
                      disabled={state.povText.trim().length < 10}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                      style={{ backgroundColor: GREEN }}
                    >
                      <Sparkles size={12} /> DRAFT
                    </button>
                    {!state.heroImage && state.povText.trim().length > 10 && (
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>Tip: Generate your hero image first, then Draft</span>
                    )}
                    <button onClick={() => setState(item.id, (s) => ({ ...s, povOpen: false, povText: "", templateId: null, heroImage: null, heroImageLoading: false, heroTitle: "" }))} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium" style={{ color: "var(--muted)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drafting skeleton */}
            {state.drafting && (
              <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <div className="h-36 animate-pulse" style={{ backgroundColor: "var(--background)" }} />
                      <div className="p-3 space-y-2">
                        <div className="h-3 w-20 rounded-full animate-pulse" style={{ backgroundColor: "var(--background)" }} />
                        <div className="h-3 w-full rounded-full animate-pulse" style={{ backgroundColor: "var(--background)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Cards */}
            {hasCards && (
              <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="mt-3 flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{state.cards.length} platform drafts</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {state.cards.filter((c) => c.imageApproved).length} images approved · {state.cards.filter((c) => c.status === "posted" || c.status === "queued").length} posted/queued
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {state.cards.map((card) => (
                    <PlatformCard
                      key={card.id}
                      card={card}
                      topic={item.title}
                      onPost={() => postCard(item.id, card.id)}
                      onQueue={() => queuePost(item.id, card.id)}
                      onUpdateBody={(body) => updateCardBody(item.id, card.id, body)}
                      onRegenerate={(customPrompt) => generateSmartImage(item.id, card.id, card.platform, item.title, card.body, customPrompt)}
                      onFeedback={(fb, fbText) => generateSmartImage(item.id, card.id, card.platform, item.title, card.body, undefined, fb, fbText)}
                      onApproveImage={() => approveImage(item.id, card.id)}
                      onUploadImage={(dataUrl) => uploadImage(item.id, card.id, dataUrl)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Platform Card ---

function PlatformCard({
  card, topic, onPost, onQueue, onUpdateBody, onRegenerate, onFeedback, onApproveImage, onUploadImage,
}: {
  card: DraftCard;
  topic: string;
  onPost: () => void;
  onQueue: () => void;
  onUpdateBody: (body: string) => void;
  onRegenerate: (customPrompt?: string) => void;
  onFeedback: (feedback: string, feedbackText?: string) => void;
  onApproveImage: () => void;
  onUploadImage: (dataUrl: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(card.body);
  const [expanded, setExpanded] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState(card.imagePrompt || "");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCustomText, setFeedbackCustomText] = useState("");
  const [imageExpanded, setImageExpanded] = useState(false);

  const meta = PLATFORM_META[card.platform] || getDefaultMeta();
  const Icon = meta.icon;

  useEffect(() => { setPromptText(card.imagePrompt || ""); }, [card.imagePrompt]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onUploadImage(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset so same file can be re-uploaded
  };

  const preview = (() => {
    const clean = card.body.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    const sentences = clean.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length >= 2) return sentences.slice(0, 2).join("").trim();
    return clean.slice(0, 140) + (clean.length > 140 ? "..." : "");
  })();

  return (
    <>
      {/* Full-screen image preview modal */}
      {imageExpanded && card.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setImageExpanded(false)}>
          <div className="relative max-w-3xl max-h-[90vh] m-4" onClick={(e) => e.stopPropagation()}>
            <img src={card.imageUrl} alt={card.title} className="max-w-full max-h-[85vh] rounded-xl object-contain" />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="px-2 py-1 rounded text-[10px] font-bold text-white" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                v{card.imageVersion} · {meta.label}
              </span>
              <button onClick={() => setImageExpanded(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                <X size={16} />
              </button>
            </div>
            {/* Image controls in modal */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 rounded-b-xl" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
              <button onClick={onApproveImage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: GREEN }}>
                <ThumbsUp size={11} /> Perfect
              </button>
              <button onClick={() => { setImageExpanded(false); setShowFeedback(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: YELLOW }}>
                <ThumbsDown size={11} /> Give Feedback
              </button>
              <button onClick={() => onRegenerate(card.imagePrompt || undefined)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>
                <RotateCcw size={11} /> Regenerate
              </button>
              <button onClick={() => { setImageExpanded(false); setEditingPrompt(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <PenLine size={11} /> Edit Prompt
              </button>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white cursor-pointer" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <Upload size={11} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden flex flex-col" style={{ borderColor: card.imageApproved ? `${GREEN}60` : "var(--border)", backgroundColor: "var(--surface)" }}>
        {/* Image area */}
        <div className="relative h-44 flex items-center justify-center cursor-pointer" style={{ background: card.imageUrl ? undefined : meta.gradient }} onClick={() => card.imageUrl && setImageExpanded(true)}>
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
          ) : card.imageLoading ? (
            <div className="flex flex-col items-center gap-1">
              <Loader2 size={20} className="text-white/70 animate-spin" />
              <span className="text-white/60 text-[10px]">Generating...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <button onClick={() => onRegenerate()} className="flex flex-col items-center gap-1">
                  <ImageIcon size={18} className="text-white/50" />
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">Generate</span>
                </button>
                <span className="text-white/20 text-[9px]">or</span>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <Upload size={18} className="text-white/50" />
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}

          {/* Platform badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
            <Icon size={10} /> {meta.label}
          </div>

          {/* Version + expand badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {card.imageVersion > 0 && (
              <div className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                v{card.imageVersion}
              </div>
            )}
            {card.imageUrl && (
              <div className="px-1.5 py-0.5 rounded text-white cursor-pointer hover:bg-black/70" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <Maximize2 size={10} />
              </div>
            )}
          </div>

          {/* Status badges */}
          {card.status === "posted" && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[9px] font-bold" style={{ backgroundColor: GREEN }}>
              <CheckCircle2 size={9} /> Posted
            </div>
          )}
          {card.status === "queued" && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[9px] font-bold" style={{ backgroundColor: YELLOW }}>
              <Clock size={9} /> Queued
            </div>
          )}
          {card.imageApproved && card.status === "draft" && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ backgroundColor: `${GREEN}CC`, color: "white" }}>
              <ThumbsUp size={9} /> Approved
            </div>
          )}
        </div>

        {/* Image controls */}
        {card.imageUrl && !card.imageLoading && !editingPrompt && !showFeedback && (
          <div className="flex items-center gap-1 px-2 py-1.5" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
            <button onClick={() => setEditingPrompt(true)} className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium hover:opacity-80" style={{ color: "var(--muted)" }}>
              <PenLine size={9} /> Edit
            </button>
            <button onClick={() => onRegenerate(card.imagePrompt || undefined)} className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium hover:opacity-80" style={{ color: ACCENT }}>
              <RotateCcw size={9} /> Regen
            </button>
            <label className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium hover:opacity-80 cursor-pointer" style={{ color: "var(--muted)" }}>
              <Upload size={9} /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            {!card.imageApproved && (
              <>
                <button onClick={onApproveImage} className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium hover:opacity-80" style={{ color: GREEN }}>
                  <ThumbsUp size={9} /> Perfect
                </button>
                <button onClick={() => setShowFeedback(true)} className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium hover:opacity-80" style={{ color: YELLOW }}>
                  <ThumbsDown size={9} /> Fix
                </button>
              </>
            )}
          </div>
        )}

        {/* Edit Prompt Panel */}
        {editingPrompt && (
          <div className="px-2 py-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
            <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} className="w-full h-20 text-[10px] leading-relaxed rounded p-2 resize-none focus:outline-none" style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            <div className="flex gap-1 mt-1">
              <button onClick={() => { onRegenerate(promptText); setEditingPrompt(false); }} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium text-white" style={{ backgroundColor: ACCENT }}>
                <RotateCcw size={8} /> Generate
              </button>
              <button onClick={() => setEditingPrompt(false)} className="px-2 py-1 rounded text-[9px]" style={{ color: "var(--muted)" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Feedback Panel - Expanded */}
        {showFeedback && (
          <div className="px-2 py-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--muted)" }}>What&apos;s wrong with this image?</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {FEEDBACK_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { onFeedback(opt.id, feedbackCustomText || undefined); setShowFeedback(false); setFeedbackCustomText(""); }}
                  className="px-2 py-1 rounded text-[9px] font-medium hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <textarea
              value={feedbackCustomText}
              onChange={(e) => setFeedbackCustomText(e.target.value)}
              placeholder="Or describe the issue..."
              className="w-full h-12 text-[10px] rounded p-2 resize-none focus:outline-none"
              style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)" }}
            />
            <div className="flex gap-1 mt-1">
              {feedbackCustomText && (
                <button onClick={() => { onFeedback("custom", feedbackCustomText); setShowFeedback(false); setFeedbackCustomText(""); }} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium text-white" style={{ backgroundColor: ACCENT }}>
                  <RotateCcw size={8} /> Regenerate with Fixes
                </button>
              )}
              <button onClick={() => { setShowFeedback(false); setFeedbackCustomText(""); }} className="px-2 py-1 rounded text-[9px]" style={{ color: "var(--muted)" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="p-3 flex-1 flex flex-col">
          {editing ? (
            <>
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} className="w-full h-40 text-[11px] leading-relaxed rounded-lg p-2 resize-none focus:outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
              <div className="flex gap-1.5 mt-2">
                <button onClick={() => { onUpdateBody(editBody); setEditing(false); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-white" style={{ backgroundColor: GREEN }}>
                  <CheckCircle2 size={10} /> Save
                </button>
                <button onClick={() => { setEditBody(card.body); setEditing(false); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px]" style={{ color: "var(--muted)" }}>
                  <X size={10} /> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] leading-relaxed cursor-pointer flex-1 whitespace-pre-line" style={{ color: "var(--foreground)" }} onClick={() => setExpanded(!expanded)}>
                {expanded ? card.body.slice(0, 1200) : preview}
                {!expanded && card.body.length > 140 && <span className="text-[10px] ml-1" style={{ color: ACCENT }}>more</span>}
                {expanded && <span className="text-[10px] ml-1" style={{ color: ACCENT }}>less</span>}
              </div>

              {card.postError && card.postError !== "queued" && !card.postError.startsWith("Queued") && (
                <div className="mt-1.5 text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "#E24D4710", color: RED }}>{card.postError}</div>
              )}
              {(card.postError === "queued" || card.postError?.startsWith("Queued")) && (
                <div className="mt-1.5 text-[10px] px-2 py-1 rounded flex items-center gap-1" style={{ backgroundColor: "#F1C02810", color: YELLOW }}>
                  <Clock size={10} /> {card.postError === "queued" ? "Queued for optimal time" : card.postError}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-1.5 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                {card.status === "draft" ? (
                  <>
                    <button onClick={() => { setEditBody(card.body); setEditing(true); }} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium justify-center" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      <Edit3 size={10} /> Edit
                    </button>
                    <button onClick={onQueue} disabled={card.posting} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium justify-center flex-1 disabled:opacity-50" style={{ backgroundColor: "var(--background)", color: ACCENT, border: `1px solid ${ACCENT}40` }}>
                      <Clock size={10} /> Queue
                    </button>
                    <button onClick={onPost} disabled={card.posting} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-medium text-white justify-center flex-1 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                      {card.posting ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                      {card.posting ? "..." : "POST"}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium flex-1 justify-center" style={{ color: card.status === "posted" ? GREEN : YELLOW }}>
                    {card.status === "posted" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {card.status === "posted" ? "Posted" : "Queued"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
