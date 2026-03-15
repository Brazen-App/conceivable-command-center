"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
  Hash,
  Copy,
  Repeat,
  Zap,
  Music,
  Type,
  Video,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import { colors } from "@/lib/theme";
import { TIKTOK_CONCEPTS, TIKTOK_FORMATS, type TikTokConcept, type TikTokFormat } from "@/lib/data/tiktok-concepts";

// ── Constants ───────────────────────────────────────────────

const PRIORITY_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Film First", color: colors.red, bg: `${colors.red}12` },
  2: { label: "High Value", color: colors.blue, bg: `${colors.blue}12` },
  3: { label: "Queue", color: colors.muted, bg: `${colors.muted}12` },
};

const STATUS_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  not_started: { icon: Clock, color: colors.muted, label: "Not Started" },
  in_progress: { icon: Loader2, color: colors.yellow, label: "In Progress" },
  ready: { icon: CheckCircle2, color: colors.green, label: "Ready" },
};

type SortField = "priority" | "format" | "category" | "hook";
type SortDir = "asc" | "desc";

// ── Repurposing Note ────────────────────────────────────────

function RepurposingNote() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <Repeat size={14} style={{ color: colors.purple }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Repurposing Pipeline
        </span>
      </div>
      <div className="p-5 space-y-3">
        <div className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          <div className="flex items-start gap-2">
            <Zap size={12} className="mt-0.5 shrink-0" style={{ color: colors.yellow }} />
            <p>Every YouTube video gets chopped into 2-5 TikTok/Reels/Shorts clips (use Opus Clip)</p>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={12} className="mt-0.5 shrink-0" style={{ color: colors.yellow }} />
            <p>Every viral TikTok concept can be expanded into a YouTube deep dive</p>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={12} className="mt-0.5 shrink-0" style={{ color: colors.yellow }} />
            <p>Track which TikTok concepts perform best → those become priority YouTube scripts</p>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={12} className="mt-0.5 shrink-0" style={{ color: colors.yellow }} />
            <p>Track which YouTube videos drive the most app downloads → those topics get more TikTok clips</p>
          </div>
        </div>
        <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: `${colors.purple}06`, border: `1px solid ${colors.purple}12` }}>
          <p className="text-[10px] font-bold" style={{ color: colors.purple }}>CONTENT FLYWHEEL</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            YouTube builds authority and SEO. TikTok builds audience and virality. Each feeds the other.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── TikTok Script Workspace ─────────────────────────────────

function TikTokScriptWorkspace({
  concept,
  onBack,
}: {
  concept: TikTokConcept;
  onBack: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState<string>("");
  const [textOverlays, setTextOverlays] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [generatingCover, setGeneratingCover] = useState(false);

  const generateScript = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: concept.hook,
          founderAngle: `TikTok script. Format: ${concept.format}. Hook: "${concept.hook}". Concept: ${concept.concept}. Keep it 50-200 words MAX. This is ${concept.estimatedLength}. Include [TEXT ON SCREEN: ...] suggestions for text overlays. Voice: punchy, real, cheeky, expert. NEVER say treat/cure/diagnose/prevent. End with CTA to Conceivable app. The script should be conversational, like talking to a friend.`,
          templateId: null,
        }),
      });
      const data = await res.json();
      if (data.pieces?.[0]) {
        const full = data.pieces[0].body || data.pieces[0].copy || "";
        setScript(full);
        // Extract text overlays
        const matches = full.match(/\[TEXT ON SCREEN:[^\]]*\]/g) || [];
        setTextOverlays(matches.map((m: string) => m.replace(/\[TEXT ON SCREEN:\s*/, "").replace(/\]$/, "")));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const generateCover = async () => {
    setGeneratingCover(true);
    try {
      const res = await fetch("/api/content/branded-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: concept.hook,
          platform: "tiktok",
          template: "editorial",
          accentColor: colors.pink,
        }),
      });
      const data = await res.json();
      if (data.imageData) setCoverUrl(data.imageData);
    } catch {
      // ignore
    } finally {
      setGeneratingCover(false);
    }
  };

  const wordCount = script.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
        >
          <ChevronLeft size={16} style={{ color: "var(--muted)" }} />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{concept.hook}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${colors.pink}12`, color: colors.pink }}>
              {concept.format}
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>{concept.estimatedLength} · {concept.category}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: PRIORITY_LABELS[concept.priority].bg, color: PRIORITY_LABELS[concept.priority].color }}>
              {PRIORITY_LABELS[concept.priority].label}
            </span>
          </div>
        </div>
        {!script && (
          <button
            onClick={generateScript}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: "#000000", opacity: generating ? 0.6 : 1 }}
          >
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? "Generating..." : "Generate Script"}
          </button>
        )}
      </div>

      {/* Concept details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.pink }}>Concept</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{concept.concept}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Music size={10} style={{ color: colors.purple }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.purple }}>Audio</p>
          </div>
          <p className="text-xs" style={{ color: "var(--foreground)" }}>{concept.suggestedAudio}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {concept.crossPost.map((p: string) => (
              <span key={p} className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}>
                → {p === "reels" ? "IG Reels" : p === "shorts" ? "YT Shorts" : p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!script && !generating && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Video size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>No script yet</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Click &quot;Generate Script&quot; to create a short-form video script.</p>
        </div>
      )}

      {generating && (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "#000", margin: "0 auto 12px" }} />
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Generating TikTok Script...</p>
        </div>
      )}

      {script && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Script */}
          <div className="lg:col-span-2 space-y-3">
            {/* Hook highlight */}
            <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${colors.red}` }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: `${colors.red}08` }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.red }}>HOOK — First 2 seconds</span>
                <button
                  onClick={() => navigator.clipboard.writeText(concept.hook)}
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${colors.red}12` }}
                >
                  <Copy size={10} style={{ color: colors.red }} />
                </button>
              </div>
              <div className="px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{concept.hook}</p>
              </div>
            </div>

            {/* Full script */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Script</span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>{wordCount} words</span>
              </div>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full p-4 text-xs leading-relaxed resize-none focus:outline-none"
                style={{ backgroundColor: "var(--surface)", color: "var(--foreground)", minHeight: "250px" }}
              />
            </div>

            {/* Text overlays */}
            {textOverlays.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                  <Type size={12} style={{ color: colors.yellow }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Text Overlays</span>
                </div>
                <div className="p-3 space-y-1.5" style={{ backgroundColor: "var(--surface)" }}>
                  {textOverlays.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
                      <span className="text-[10px] font-bold w-5 text-center" style={{ color: colors.yellow }}>{i + 1}</span>
                      <span className="text-xs" style={{ color: "var(--foreground)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="space-y-3">
            {/* Cover frame */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <ImageIcon size={12} style={{ color: "#000" }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Cover Frame</span>
                </div>
                <button
                  onClick={generateCover}
                  disabled={generatingCover}
                  className="text-[10px] font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}
                >
                  {generatingCover ? "..." : "Generate"}
                </button>
              </div>
              <div className="aspect-[9/16] max-h-[300px] flex items-center justify-center" style={{ backgroundColor: "var(--surface)" }}>
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon size={24} style={{ color: "var(--border)", margin: "0 auto 8px" }} />
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>9:16 cover</p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Caption</span>
              </div>
              <div className="p-3" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{concept.caption}</p>
              </div>
            </div>

            {/* Hashtags */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                <Hash size={12} style={{ color: colors.blue }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Hashtags</span>
              </div>
              <div className="p-3 flex flex-wrap gap-1.5" style={{ backgroundColor: "var(--surface)" }}>
                {concept.hashtags.map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--background)", color: colors.blue, border: "1px solid var(--border)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Cross-posting */}
            <div className="rounded-xl p-3" style={{ backgroundColor: `${colors.green}06`, border: `1px solid ${colors.green}12` }}>
              <div className="flex items-center gap-2 mb-2">
                <Repeat size={12} style={{ color: colors.green }} />
                <span className="text-[10px] font-bold" style={{ color: colors.green }}>Cross-Post</span>
              </div>
              <div className="flex gap-2">
                {concept.crossPost.map((p: string) => (
                  <span key={p} className="text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: `${colors.green}12`, color: colors.green }}>
                    {p === "reels" ? "Instagram Reels" : p === "shorts" ? "YouTube Shorts" : p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main TikTok Tab ─────────────────────────────────────────

export default function TikTokTab() {
  const [view, setView] = useState<"list" | "script">("list");
  const [selectedConcept, setSelectedConcept] = useState<TikTokConcept | null>(null);
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<TikTokFormat | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<number | "all">("all");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showRepurpose, setShowRepurpose] = useState(false);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let list = [...TIKTOK_CONCEPTS];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.hook.toLowerCase().includes(q) ||
          c.concept.toLowerCase().includes(q) ||
          c.caption.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (formatFilter !== "all") list = list.filter((c) => c.format === formatFilter);
    if (priorityFilter !== "all") list = list.filter((c) => c.priority === priorityFilter);

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "priority": cmp = a.priority - b.priority; break;
        case "format": cmp = a.format.localeCompare(b.format); break;
        case "category": cmp = a.category.localeCompare(b.category); break;
        case "hook": cmp = a.hook.localeCompare(b.hook); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [search, formatFilter, priorityFilter, sortField, sortDir]);

  const openScript = (concept: TikTokConcept) => {
    setSelectedConcept(concept);
    setView("script");
  };

  if (view === "script" && selectedConcept) {
    return <TikTokScriptWorkspace concept={selectedConcept} onBack={() => setView("list")} />;
  }

  const p1Count = TIKTOK_CONCEPTS.filter((c) => c.priority === 1).length;
  const categories = [...new Set(TIKTOK_CONCEPTS.map((c) => c.category))];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.12)" }}>
        <div className="px-6 py-5" style={{ background: "linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Video size={20} color="white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-wide">TikTok</p>
                <p className="text-white/60 text-[11px]">Short-form viral content · 15-60 seconds</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white tracking-tight">{TIKTOK_CONCEPTS.length}</p>
              <p className="text-white/50 text-[11px]">video concepts</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: "var(--surface)" }}>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold" style={{ color: colors.red }}>{p1Count} priority 1 (film first)</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>{TIKTOK_FORMATS.length} formats</span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>{categories.length} categories</span>
          </div>
          <button
            onClick={() => setShowRepurpose(!showRepurpose)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: showRepurpose ? `${colors.purple}12` : "var(--background)", color: showRepurpose ? colors.purple : "var(--muted)", border: "1px solid var(--border)" }}
          >
            Repurposing Pipeline
          </button>
        </div>
      </div>

      {showRepurpose && <RepurposingNote />}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Search size={12} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search hooks, concepts, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        <div className="flex items-center gap-1 px-1 py-1 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Filter size={10} style={{ color: "var(--muted)", marginLeft: "6px" }} />
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as TikTokFormat | "all")}
            className="text-[11px] font-bold bg-transparent outline-none px-1 py-1"
            style={{ color: "var(--foreground)" }}
          >
            <option value="all">All Formats</option>
            {TIKTOK_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 px-1 py-1 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <select
            value={String(priorityFilter)}
            onChange={(e) => setPriorityFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="text-[11px] font-bold bg-transparent outline-none px-1 py-1"
            style={{ color: "var(--foreground)" }}
          >
            <option value="all">All Priorities</option>
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
          </select>
        </div>

        <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>{filtered.length} concepts</span>
      </div>

      {/* Concept cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((concept) => {
          const pri = PRIORITY_LABELS[concept.priority];
          const sts = STATUS_META[concept.scriptStatus];
          const StsIcon = sts.icon;

          return (
            <button
              key={concept.id}
              onClick={() => openScript(concept)}
              className="text-left rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* Hook highlight */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <p className="text-xs font-bold leading-snug" style={{ color: "var(--foreground)" }}>
                  &ldquo;{concept.hook}&rdquo;
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                  {concept.concept}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${colors.pink}12`, color: colors.pink }}>
                    {concept.format}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: pri.bg, color: pri.color }}>
                    {pri.label}
                  </span>
                  <span className="text-[9px]" style={{ color: "var(--muted)" }}>{concept.estimatedLength}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <StsIcon size={8} style={{ color: sts.color }} />
                    <span className="text-[9px]" style={{ color: sts.color }}>{sts.label}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {concept.hashtags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[8px] px-1 py-0.5 rounded" style={{ color: colors.blue }}>
                      #{tag}
                    </span>
                  ))}
                  {concept.hashtags.length > 4 && (
                    <span className="text-[8px]" style={{ color: "var(--muted)" }}>+{concept.hashtags.length - 4}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
