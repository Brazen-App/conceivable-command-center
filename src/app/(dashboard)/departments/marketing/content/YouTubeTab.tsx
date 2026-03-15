"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Play,
  FileText,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Video,
  Hash,
  Image as ImageIcon,
  Copy,
  Info,
} from "lucide-react";
import { colors } from "@/lib/theme";
import { YOUTUBE_TITLES, YOUTUBE_CATEGORIES, type YouTubeVideoTitle } from "@/lib/data/youtube-titles";

// ── Types ───────────────────────────────────────────────────

interface ScriptDraft {
  hook: string;
  intro: string;
  body: string;
  conceivableAngle: string;
  cta: string;
  description: string;
  tags: string[];
}

// ── Constants ───────────────────────────────────────────────

const PRIORITY_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Film First", color: colors.red, bg: `${colors.red}12` },
  2: { label: "High Value", color: colors.blue, bg: `${colors.blue}12` },
  3: { label: "Queue", color: colors.muted, bg: `${colors.muted}12` },
};

const COMPETITION_COLORS: Record<string, string> = {
  high: colors.red,
  medium: colors.yellow,
  low: colors.green,
};

const STATUS_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  not_started: { icon: Clock, color: colors.muted, label: "Not Started" },
  in_progress: { icon: Loader2, color: colors.yellow, label: "In Progress" },
  ready: { icon: CheckCircle2, color: colors.green, label: "Ready" },
};

type SortField = "priority" | "category" | "competition" | "title";
type SortDir = "asc" | "desc";

// ── Sub-views ───────────────────────────────────────────────

function SetupChecklist() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setChecks((p) => ({ ...p, [id]: !p[id] }));

  const items = [
    { id: "name", label: 'Channel name: Conceivable University (confirm with Kirsten)' },
    { id: "art", label: 'Channel art: Banner using brand colors (2560x1440)' },
    { id: "photo", label: 'Profile photo: Kirsten headshot or Conceivable logo' },
    { id: "desc", label: 'Channel description: SEO-optimized with keywords and links' },
    { id: "trailer", label: 'Channel trailer: "What is Conceivable University?" (60-90s)' },
    { id: "playlists", label: 'Playlists for each category (Fertility, Periods, PCOS, etc.)' },
    { id: "endscreen", label: 'End screen template designed' },
    { id: "watermark", label: 'Subscribe watermark uploaded' },
    { id: "links", label: 'Links: conceivable.com, app download, social profiles' },
    { id: "keywords", label: 'Channel keywords set' },
  ];

  const done = Object.values(checks).filter(Boolean).length;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <Video size={14} style={{ color: "#FF0000" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Channel Setup Checklist
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.green}12`, color: colors.green }}>
          {done}/{items.length}
        </span>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: checks[item.id] ? `${colors.green}06` : "transparent" }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center shrink-0"
              style={{
                backgroundColor: checks[item.id] ? colors.green : "transparent",
                border: checks[item.id] ? "none" : "2px solid var(--border)",
              }}
            >
              {checks[item.id] && <CheckCircle2 size={12} color="white" />}
            </div>
            <span
              className="text-xs"
              style={{
                color: checks[item.id] ? "var(--muted)" : "var(--foreground)",
                textDecoration: checks[item.id] ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecordingWorkflow() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <Play size={14} style={{ color: colors.red }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Recording Workflow
        </span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>KIRSTEN&apos;S RECORDING PROCESS</p>
          <ol className="text-xs leading-relaxed space-y-1.5" style={{ color: "var(--muted)" }}>
            <li>1. Pick 5-10 videos to record in one session</li>
            <li>2. Film all in one long continuous recording (saves setup time)</li>
            <li>3. Upload the long recording to Descript (or Opus Clip)</li>
            <li>4. Use timestamps from scripts to chop into individual videos</li>
            <li>5. Descript auto-generates captions and allows b-roll insertion</li>
            <li>6. Joy creates thumbnail for each video</li>
            <li>7. Joy writes description and tags for each video</li>
            <li>8. Publish on schedule from the content calendar</li>
          </ol>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>RECOMMENDED TOOLS</p>
          <div className="space-y-2">
            {[
              { name: "Descript", price: "$24/mo", desc: "Edit video like a document, auto-captions, b-roll library" },
              { name: "Opus Clip", price: "Free tier", desc: "AI auto-chops long videos into short clips for TikTok/Reels" },
              { name: "CapCut", price: "Free", desc: "Captions, effects, TikTok-native export" },
            ].map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{tool.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}>
                  {tool.price}
                </span>
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>{tool.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Script Workspace ────────────────────────────────────────

function ScriptWorkspace({
  video,
  onBack,
}: {
  video: YouTubeVideoTitle;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState<ScriptDraft | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hook");
  const [generatingThumb, setGeneratingThumb] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const generateScript = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: video.title,
          founderAngle: `YouTube script for Conceivable University. Category: ${video.category}. Target search query: "${video.targetQuery}". Conceivable angle: ${video.conceivableAngle}. Format: ${video.estimatedLength} YouTube video. Structure: HOOK (first 15 seconds), INTRO (30 seconds), BODY (structured with timestamps), CONCEIVABLE ANGLE (natural product connection), CTA. Include [SHOW: ...] visual notes and [TEXT ON SCREEN: ...] caption suggestions. Voice: warm expert, cool-aunt energy. NEVER say treat/cure/diagnose/prevent. Word count target: ${video.estimatedLength.includes("8") ? "1200-1800" : "1800-2500"} words.`,
          templateId: null,
        }),
      });
      const data = await res.json();
      if (data.pieces && data.pieces.length > 0) {
        const full = data.pieces[0].body || data.pieces[0].copy || "";
        // Parse sections from generated text
        const hookMatch = full.match(/HOOK[:\s]*\n?([\s\S]*?)(?=INTRO|$)/i);
        const introMatch = full.match(/INTRO[:\s]*\n?([\s\S]*?)(?=BODY|$)/i);
        const bodyMatch = full.match(/BODY[:\s]*\n?([\s\S]*?)(?=CONCEIVABLE|CTA|$)/i);
        const angleMatch = full.match(/CONCEIVABLE[^:]*[:\s]*\n?([\s\S]*?)(?=CTA|$)/i);
        const ctaMatch = full.match(/CTA[:\s]*\n?([\s\S]*?)$/i);

        setScript({
          hook: hookMatch?.[1]?.trim() || full.slice(0, 200),
          intro: introMatch?.[1]?.trim() || "",
          body: bodyMatch?.[1]?.trim() || full,
          conceivableAngle: angleMatch?.[1]?.trim() || "",
          cta: ctaMatch?.[1]?.trim() || "Subscribe for more evidence-based fertility science. Download Conceivable — link in description.",
          description: `${video.title}\n\nIn this video, Kirsten Karchmer breaks down everything you need to know about ${video.targetQuery}. With 20+ years of clinical experience and data from thousands of cycles, Kirsten shares the root-cause approach that sets Conceivable apart.\n\nTimestamps:\n0:00 - Hook\n0:15 - Introduction\n0:45 - Main Content\n\nDownload Conceivable: [link]\nGet your Halo Ring: [link]\n\nFollow Conceivable:\nInstagram: @conceivable\nTikTok: @conceivable\nLinkedIn: Conceivable\n\n#${video.category.toLowerCase().replace(/\s+/g, "")} #fertility #womenshealth #conceivable`,
          tags: [
            video.targetQuery,
            video.category.toLowerCase(),
            "fertility",
            "women's health",
            "reproductive health",
            "conceivable",
            "kirsten karchmer",
            "fertility tips",
            "ttc",
            "trying to conceive",
            "hormone health",
            "cycle tracking",
            "natural fertility",
            "fertility expert",
            "conceivable university",
          ],
        });
      }
    } catch (err) {
      console.error("Script generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const generateThumbnail = async () => {
    setGeneratingThumb(true);
    try {
      const res = await fetch("/api/content/branded-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: video.title,
          platform: "youtube",
          template: "stat-bomb",
          accentColor: "#FF0000",
        }),
      });
      const data = await res.json();
      if (data.imageData) setThumbnailUrl(data.imageData);
    } catch {
      // ignore
    } finally {
      setGeneratingThumb(false);
    }
  };

  const wordCount = script
    ? [script.hook, script.intro, script.body, script.conceivableAngle, script.cta]
        .join(" ")
        .split(/\s+/).length
    : 0;
  const estMinutes = Math.round(wordCount / 150);

  const SECTIONS = [
    { id: "hook", label: "HOOK", sublabel: "First 15 seconds", color: colors.red },
    { id: "intro", label: "INTRO", sublabel: "30 seconds", color: colors.blue },
    { id: "body", label: "BODY", sublabel: "Main content", color: colors.navy },
    { id: "conceivableAngle", label: "CONCEIVABLE ANGLE", sublabel: "Natural connection", color: colors.purple },
    { id: "cta", label: "CTA", sublabel: "30 seconds", color: colors.green },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
        >
          <ChevronLeft size={16} style={{ color: "var(--muted)" }} />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{video.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${COMPETITION_COLORS[video.competition]}12`, color: COMPETITION_COLORS[video.competition] }}>
              {video.competition} competition
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>{video.category} · {video.estimatedLength}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: PRIORITY_LABELS[video.priority].bg, color: PRIORITY_LABELS[video.priority].color }}>
              {PRIORITY_LABELS[video.priority].label}
            </span>
          </div>
        </div>
        {!script && (
          <button
            onClick={generateScript}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-opacity"
            style={{ backgroundColor: "#FF0000", opacity: generating ? 0.6 : 1 }}
          >
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? "Generating..." : "Generate Script"}
          </button>
        )}
      </div>

      {/* Conceivable Angle */}
      <div className="rounded-xl p-4" style={{ backgroundColor: `${colors.purple}08`, border: `1px solid ${colors.purple}15` }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.purple }}>Conceivable Angle</p>
        <p className="text-xs" style={{ color: "var(--foreground)" }}>{video.conceivableAngle}</p>
      </div>

      {!script && !generating && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <FileText size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>No script yet</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Click &quot;Generate Script&quot; to create a full video script with hook, intro, body, and CTA.</p>
        </div>
      )}

      {generating && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "#FF0000", margin: "0 auto 12px" }} />
          <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>Generating Script...</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Building hook, intro, body, Conceivable angle, and CTA</p>
        </div>
      )}

      {script && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT: Script Editor */}
          <div className="lg:col-span-2 space-y-3">
            {/* Section tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="flex-1 text-center px-2 py-1.5 rounded-md text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: activeSection === s.id ? "var(--surface)" : "transparent",
                    color: activeSection === s.id ? s.color : "var(--muted)",
                    boxShadow: activeSection === s.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Active section editor */}
            {SECTIONS.map((s) =>
              activeSection === s.id ? (
                <div key={s.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${s.color}20` }}>
                  <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: `${s.color}08`, borderBottom: `1px solid ${s.color}15` }}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</span>
                      <span className="text-[10px] ml-2" style={{ color: "var(--muted)" }}>{s.sublabel}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(script[s.id as keyof ScriptDraft] as string || "");
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${s.color}12` }}
                    >
                      <Copy size={10} style={{ color: s.color }} />
                    </button>
                  </div>
                  <textarea
                    value={(script[s.id as keyof ScriptDraft] as string) || ""}
                    onChange={(e) => setScript({ ...script, [s.id]: e.target.value })}
                    className="w-full p-4 text-xs leading-relaxed resize-none focus:outline-none"
                    style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", minHeight: "300px" }}
                  />
                </div>
              ) : null
            )}

            {/* Word count bar */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {wordCount.toLocaleString()} words · ~{estMinutes} min video
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold" style={{ color: wordCount > 1200 ? colors.green : colors.yellow }}>
                  {wordCount > 1200 ? "Good length" : "Could be longer"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Thumbnail + Metadata */}
          <div className="space-y-3">
            {/* Thumbnail */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <ImageIcon size={12} style={{ color: "#FF0000" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Thumbnail</span>
                </div>
                <button
                  onClick={generateThumbnail}
                  disabled={generatingThumb}
                  className="text-[10px] font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}
                >
                  {generatingThumb ? "..." : "Generate"}
                </button>
              </div>
              <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: "var(--surface)" }}>
                {thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon size={24} style={{ color: "var(--border)", margin: "0 auto 8px" }} />
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>1280 x 720</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <BookOpen size={12} style={{ color: colors.navy }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Description</span>
              </div>
              <textarea
                value={script.description}
                onChange={(e) => setScript({ ...script, description: e.target.value })}
                className="w-full p-3 text-[11px] leading-relaxed resize-none focus:outline-none"
                style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", minHeight: "150px" }}
              />
            </div>

            {/* Tags */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <Hash size={12} style={{ color: colors.yellow }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Tags ({script.tags.length})</span>
              </div>
              <div className="p-3 flex flex-wrap gap-1.5" style={{ backgroundColor: "var(--surface)" }}>
                {script.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* End Screen */}
            <div className="rounded-xl p-3" style={{ backgroundColor: `${colors.blue}06`, border: `1px solid ${colors.blue}12` }}>
              <div className="flex items-center gap-2 mb-2">
                <Info size={12} style={{ color: colors.blue }} />
                <span className="text-[10px] font-bold" style={{ color: colors.blue }}>End Screen</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted)" }}>
                Link to related videos in the same category. Add subscribe button and app download link overlay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main YouTube Tab ────────────────────────────────────────

export default function YouTubeTab() {
  const [view, setView] = useState<"list" | "script">("list");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoTitle | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<number | "all">("all");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showSetup, setShowSetup] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...YOUTUBE_TITLES];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.targetQuery.toLowerCase().includes(q) ||
          v.conceivableAngle.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter((v) => v.category === categoryFilter);
    }

    if (priorityFilter !== "all") {
      list = list.filter((v) => v.priority === priorityFilter);
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "priority":
          cmp = a.priority - b.priority;
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "competition": {
          const order = { low: 0, medium: 1, high: 2 };
          cmp = order[a.competition] - order[b.competition];
          break;
        }
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [search, categoryFilter, priorityFilter, sortField, sortDir]);

  const openScript = (video: YouTubeVideoTitle) => {
    setSelectedVideo(video);
    setView("script");
  };

  if (view === "script" && selectedVideo) {
    return <ScriptWorkspace video={selectedVideo} onBack={() => setView("list")} />;
  }

  const p1Count = YOUTUBE_TITLES.filter((v) => v.priority === 1).length;
  const readyCount = YOUTUBE_TITLES.filter((v) => v.scriptStatus === "ready").length;

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,0,0,0.12)" }}>
        <div className="px-6 py-5" style={{ background: "linear-gradient(135deg, #CC0000 0%, #FF0000 50%, #FF4444 100%)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Play size={20} color="white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-wide">Conceivable University</p>
                <p className="text-white/60 text-[11px]">Authority-building YouTube channel · Long-form education</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-white tracking-tight">{YOUTUBE_TITLES.length}</p>
                <p className="text-white/50 text-[11px]">video titles</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--surface)" }}>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold" style={{ color: colors.red }}>{p1Count} priority 1 (film first)</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>{readyCount} scripts ready</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>{YOUTUBE_CATEGORIES.length} categories</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
              style={{ backgroundColor: showSetup ? `${colors.blue}12` : "var(--background)", color: showSetup ? colors.blue : "var(--muted)", border: "1px solid var(--border)" }}
            >
              Setup Checklist
            </button>
            <button
              onClick={() => setShowWorkflow(!showWorkflow)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
              style={{ backgroundColor: showWorkflow ? `${colors.green}12` : "var(--background)", color: showWorkflow ? colors.green : "var(--muted)", border: "1px solid var(--border)" }}
            >
              Recording Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Setup / Workflow panels */}
      {showSetup && <SetupChecklist />}
      {showWorkflow && <RecordingWorkflow />}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Search size={12} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search titles, queries, angles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        <div className="flex items-center gap-1 px-1 py-1 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Filter size={10} style={{ color: "var(--muted)", marginLeft: "6px" }} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-[11px] font-bold bg-transparent outline-none px-1 py-1 rounded"
            style={{ color: "var(--foreground)" }}
          >
            <option value="all">All Categories</option>
            {YOUTUBE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 px-1 py-1 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <select
            value={String(priorityFilter)}
            onChange={(e) => setPriorityFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="text-[11px] font-bold bg-transparent outline-none px-1 py-1 rounded"
            style={{ color: "var(--foreground)" }}
          >
            <option value="all">All Priorities</option>
            <option value="1">Priority 1 — Film First</option>
            <option value="2">Priority 2 — High Value</option>
            <option value="3">Priority 3 — Queue</option>
          </select>
        </div>

        <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>
          {filtered.length} videos
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {/* Table header */}
        <div
          className="grid items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "40px 1fr 120px 140px 100px 80px 80px",
            backgroundColor: "var(--background)",
            color: "var(--muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>#</span>
          <button onClick={() => toggleSort("title")} className="flex items-center gap-1 text-left">
            Title <ArrowUpDown size={8} />
          </button>
          <button onClick={() => toggleSort("category")} className="flex items-center gap-1">
            Category <ArrowUpDown size={8} />
          </button>
          <span>Target Query</span>
          <button onClick={() => toggleSort("competition")} className="flex items-center gap-1">
            Competition <ArrowUpDown size={8} />
          </button>
          <button onClick={() => toggleSort("priority")} className="flex items-center gap-1">
            Priority <ArrowUpDown size={8} />
          </button>
          <span>Status</span>
        </div>

        {/* Table rows */}
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.map((video) => {
            const pri = PRIORITY_LABELS[video.priority];
            const sts = STATUS_META[video.scriptStatus];
            const StsIcon = sts.icon;

            return (
              <button
                key={video.id}
                onClick={() => openScript(video)}
                className="grid items-center w-full px-4 py-3 text-left transition-colors hover:opacity-90"
                style={{
                  gridTemplateColumns: "40px 1fr 120px 140px 100px 80px 80px",
                  backgroundColor: "var(--surface)",
                }}
              >
                <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>{video.id}</span>
                <div>
                  <p className="text-xs font-semibold truncate pr-4" style={{ color: "var(--foreground)" }}>{video.title}</p>
                  <p className="text-[10px] mt-0.5 truncate pr-4" style={{ color: "var(--muted)" }}>{video.conceivableAngle}</p>
                </div>
                <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>{video.category}</span>
                <span className="text-[10px] truncate" style={{ color: "var(--muted)" }}>{video.targetQuery}</span>
                <span className="text-[10px] font-bold" style={{ color: COMPETITION_COLORS[video.competition] }}>
                  {video.competition}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit" style={{ backgroundColor: pri.bg, color: pri.color }}>
                  {pri.label}
                </span>
                <div className="flex items-center gap-1">
                  <StsIcon size={10} style={{ color: sts.color }} />
                  <span className="text-[10px]" style={{ color: sts.color }}>{sts.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
