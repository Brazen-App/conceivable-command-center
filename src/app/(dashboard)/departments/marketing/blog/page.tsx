"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  ClipboardList,
  Sparkles,
  Target,
  Hash,
  Clock,
  BarChart3,
  Layout,
  Type,
  Palette,
  ListChecks,
  Search,
  Globe,
  Code2,
  Plus,
  Trash2,
  Upload,
  SquareCheck,
  Square,
} from "lucide-react";
import { FERTILITY_SUPPLEMENTS_POST_HTML } from "@/lib/data/blog-posts-data";

/* ──────────────────────────── constants ──────────────────────────── */

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";
const PINK = "#E37FB1";
const CREAM = "#F9F7F0";

type TabKey = "queue" | "workspace" | "calendar" | "template";
type PostStatus = "idea" | "outline" | "draft" | "review" | "ready" | "published";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetDate: string;
  status: PostStatus;
  wordTarget: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STATUS_COLORS: Record<PostStatus, string> = {
  idea: "#888",
  outline: YELLOW,
  draft: ACCENT,
  review: PINK,
  ready: GREEN,
  published: GREEN,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Fertility & Health": ACCENT,
  "Period Health": RED,
  "Pregnancy & Postpartum": GREEN,
};

const BLOG_CALENDAR: BlogPost[] = [
  {
    id: "post-1",
    title: "The Science-Backed Guide to Finding the Best Fertility Supplements in 2025",
    category: "Fertility & Health",
    primaryKeyword: "best fertility supplement",
    secondaryKeywords: ["fertility vitamins", "supplements for conception", "prenatal vitamins"],
    targetDate: "2026-03-15",
    status: "ready",
    wordTarget: 3500,
  },
  {
    id: "post-2",
    title: "PCOS and Fertility: What Your Doctor Isn't Telling You",
    category: "Fertility & Health",
    primaryKeyword: "PCOS fertility",
    secondaryKeywords: ["polycystic ovary syndrome", "PCOS conception", "PCOS treatment"],
    targetDate: "2026-03-30",
    status: "idea",
    wordTarget: 3000,
  },
  {
    id: "post-3",
    title: "Understanding Your Menstrual Cycle: The Complete Guide",
    category: "Period Health",
    primaryKeyword: "menstrual cycle phases",
    secondaryKeywords: ["period phases", "follicular phase", "luteal phase"],
    targetDate: "2026-03-30",
    status: "idea",
    wordTarget: 4000,
  },
  {
    id: "post-4",
    title: "Endometriosis and Fertility: Early Detection Changes Everything",
    category: "Fertility & Health",
    primaryKeyword: "endometriosis fertility",
    secondaryKeywords: ["endometriosis diagnosis", "endo and conception"],
    targetDate: "2026-06-15",
    status: "idea",
    wordTarget: 3000,
  },
  {
    id: "post-5",
    title: "Why Period Pain Isn't Normal (And What to Do About It)",
    category: "Period Health",
    primaryKeyword: "period pain causes",
    secondaryKeywords: ["dysmenorrhea", "menstrual cramps", "period pain relief"],
    targetDate: "2026-06-30",
    status: "idea",
    wordTarget: 2500,
  },
  {
    id: "post-6",
    title: "The Truth About Fertility After 35",
    category: "Fertility & Health",
    primaryKeyword: "fertility after 35",
    secondaryKeywords: ["advanced maternal age", "egg quality", "fertility decline"],
    targetDate: "2026-06-30",
    status: "idea",
    wordTarget: 3000,
  },
  {
    id: "post-7",
    title: "Postpartum Recovery: What Nobody Tells You About the First 6 Weeks",
    category: "Pregnancy & Postpartum",
    primaryKeyword: "postpartum recovery",
    secondaryKeywords: ["fourth trimester", "postpartum healing", "recovery timeline"],
    targetDate: "2026-06-30",
    status: "idea",
    wordTarget: 3500,
  },
  {
    id: "post-8",
    title: "How Blood Sugar Affects Your Period (And Your Fertility)",
    category: "Period Health",
    primaryKeyword: "blood sugar period",
    secondaryKeywords: ["insulin resistance menstrual cycle", "glucose fertility"],
    targetDate: "2026-09-15",
    status: "idea",
    wordTarget: 2500,
  },
  {
    id: "post-9",
    title: "First Period Guide: Everything You Need to Know",
    category: "Period Health",
    primaryKeyword: "first period guide",
    secondaryKeywords: ["menarche", "first menstruation", "period for teens"],
    targetDate: "2026-09-30",
    status: "idea",
    wordTarget: 3000,
  },
  {
    id: "post-10",
    title: "Cycle Syncing Your Diet: What the Science Actually Says",
    category: "Period Health",
    primaryKeyword: "cycle syncing diet",
    secondaryKeywords: ["seed cycling", "phase-based nutrition", "menstrual cycle nutrition"],
    targetDate: "2026-09-30",
    status: "idea",
    wordTarget: 3000,
  },
];

const CHECKLIST_ITEMS = [
  "Title tag set correctly in Shopify",
  "Meta description set in Shopify",
  "URL slug is clean and keyword-targeted",
  "Hero image uploaded with alt text",
  "Article schema pasted into page head",
  "FAQ schema pasted into page head",
  "OG image uploaded (1200x630px)",
  "All internal links point to live pages",
  "CTA button links to correct destination",
  "Submitted to Google Search Console",
  "Shared on social channels",
];

const SUGGESTED_PROMPTS = [
  "Write a GEO-optimized post targeting 'best fertility supplements 2026'",
  "Outline a post targeting 'PCOS fertility treatment options'",
  "Draft an FAQ section that AI search engines will cite for 'menstrual cycle phases'",
  "Write a post optimized for 'how to improve egg quality naturally'",
];

// Long-tail keywords for the content calendar (high search volume, low competition)
const LONG_TAIL_KEYWORDS = [
  { keyword: "best fertility supplements 2026", volume: "8.1K/mo", difficulty: "Low", geo: true },
  { keyword: "how to improve egg quality naturally", volume: "5.4K/mo", difficulty: "Low", geo: true },
  { keyword: "PCOS fertility treatment options", volume: "4.2K/mo", difficulty: "Medium", geo: true },
  { keyword: "what does your period say about your health", volume: "3.8K/mo", difficulty: "Low", geo: true },
  { keyword: "fertility after 35 statistics", volume: "3.1K/mo", difficulty: "Low", geo: true },
  { keyword: "endometriosis and getting pregnant", volume: "2.9K/mo", difficulty: "Medium", geo: true },
  { keyword: "seed cycling for fertility does it work", volume: "2.6K/mo", difficulty: "Low", geo: true },
  { keyword: "postpartum recovery timeline week by week", volume: "2.4K/mo", difficulty: "Low", geo: true },
  { keyword: "blood sugar and menstrual cycle connection", volume: "1.8K/mo", difficulty: "Low", geo: true },
  { keyword: "first period guide for parents", volume: "1.5K/mo", difficulty: "Low", geo: true },
  { keyword: "cycle syncing meal plan", volume: "1.3K/mo", difficulty: "Low", geo: true },
  { keyword: "signs of ovulation after period", volume: "4.7K/mo", difficulty: "Medium", geo: true },
  { keyword: "supplements to improve AMH levels", volume: "1.1K/mo", difficulty: "Low", geo: true },
  { keyword: "HRV and fertility connection", volume: "890/mo", difficulty: "Low", geo: true },
  { keyword: "how long does it take to conceive after stopping birth control", volume: "3.2K/mo", difficulty: "Medium", geo: true },
];

const SYSTEM_PROMPT = `You are Conceivable's content engine. You write blog posts that are simultaneously:

1. Genuinely helpful to women searching for health information
2. SEO-optimized for Google search ranking
3. GEO-optimized for AI search engines (ChatGPT, Perplexity, Google AI Overviews)
4. Branded in Conceivable's voice — warm, authoritative, science-backed, never condescending
5. Conversion-oriented without being salesy

You always output complete Shopify-ready HTML using the master blog template. Every post includes: schema markup (Article + FAQ), table of contents, proper heading hierarchy, data tables where applicable, FAQ section with minimum 5 questions, CTA block, disclaimer, and About Conceivable block.

Brand voice guidelines:
- Write like a knowledgeable friend who happens to have 20 years of clinical experience
- Use 'we' when referring to Conceivable
- Cite specific numbers and research — never vague claims
- Be honest about limitations (supplements complement, not replace medical care)
- Never shame, never fear-monger, never oversell
- Make complex science accessible without dumbing it down

Clinical data you can reference:
- 240,000+ data points analyzed
- 105-person clinical pilot
- 150-260% conception rate improvement
- 200+ biomarkers tracked
- 20 years of clinical practice (Kirsten Karchmer)
- AI care team: Kai, Olive, Seren, Atlas, Zhen, Navi
- 75-language support
- $15/month price point

SEO rules: Primary keyword in H1, first paragraph, at least one H2, meta description, URL slug. Natural density — never stuffed.

GEO rules: Specific statistics, definitive statements, concise FAQ answers, structured tables, consistent comparison formats. Every post answers the question someone would ask an AI assistant.

Page head elements (generate per post):
- Title tag: [Post Title] | Conceivable
- Meta description: under 160 chars, contains primary keyword
- Canonical URL
- Open Graph tags (og:title, og:description, og:type=article, og:image)
- Twitter card tags (summary_large_image)
- Article schema markup (JSON-LD)
- FAQ schema markup (JSON-LD) from FAQ section

Brand typography in HTML:
- H1: font-family: 'Georgia', serif; font-size: 42px; line-height: 1.15; color: #2A2828;
- Category/Eyebrow above H1: font-size: 14px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A6FFF; font-weight: 700;
- Author/Date line below H1: font-size: 15px; color: #666;
- H2: font-family: 'Georgia', serif; font-size: 30px; color: #2A2828; margin-top: 48px;
- H3: font-size: 24px; color: #2A2828; margin-top: 32px;
- Body: font-size: 17px; line-height: 1.75; color: #444;
- Background: #F9F7F0 for TOC, cards, About block

Brand colors: Primary #5A6FFF, Background #F9F7F0, Text #2A2828, Secondary #555, Meta #888, Pink #E37FB1, Green #1EAA55, CTA gradient: linear-gradient(135deg, #5A6FFF 0%, #9686B9 100%)

EDITORIAL ELEMENTS — use 3-5 throughout every post: Insight Boxes (blue #EEF0FF bg, blue left border), Stat Callouts (big number centered), Pull Quotes (pink left border), Warning Boxes (yellow), Clinical Evidence Boxes (green), Image Placeholders. Spread naturally throughout the post to break up text.

Required structural elements in every post:
a) Breadcrumb: Home > Category > Title (14px, #888, links #5A6FFF)
b) H1 with primary keyword front-loaded
c) Last updated date below H1
d) TOC box: bg #F9F7F0, border-radius 12px, numbered anchor links in #5A6FFF
e) Heading hierarchy: H1 > H2 > H3 (never skip)
f) Data tables: header bg #5A6FFF white text, alternating white/#F9F7F0 rows
g) Comparison cards: bg #F9F7F0, border-radius 12px, Pros/Cons/Verdict
h) TWO CTA BLOCKS at ~40% and ~80% through the post. Each has 2 buttons: "Take the Quiz →" (links to https://conceivable-quiz.vercel.app) and "Check Out the App →" (links to https://conceivable.com). First CTA: gradient blue bg. Second CTA: dark bg (#2A2828).
i) FAQ section: EXACTLY 6 questions. First 3 are UNIQUE to the post topic. Last 3 are ALWAYS the same: "How does the Conceivable system actually work?" / "How do I know which supplements I actually need?" / "Do I need the Halo Ring to use Conceivable?" — with standardized answers about the system, the quiz, and the ring.
j) Disclaimer: italic, 13px, #999
k) About Conceivable: bg #F9F7F0, company description + 240K data points + 150-260% improvement`;

/* ──────────────────────────── helpers ──────────────────────────── */

function extractSchemaBlocks(html: string): string {
  const matches = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi);
  return matches ? matches.join("\n\n") : "";
}

function Badge({ label, color, filled }: { label: string; color: string; filled?: boolean }) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={
        filled
          ? { backgroundColor: color, color: "#fff" }
          : { border: `1px solid ${color}`, color }
      }
    >
      {label}
    </span>
  );
}

function ValidationBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1 text-[11px]" style={{ color: ok ? GREEN : RED }}>
      {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
      {label}
    </span>
  );
}

/* ──────────────────────────── main page ──────────────────────────── */

export default function BlogPublishingPage() {
  const [tab, setTab] = useState<TabKey>("queue");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "queue", label: "Publishing Queue", icon: <Upload size={14} /> },
    { key: "workspace", label: "Blog Workspace", icon: <FileText size={14} /> },
    { key: "calendar", label: "Content Calendar", icon: <Calendar size={14} /> },
    { key: "template", label: "Template & Rules", icon: <BookOpen size={14} /> },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Blog Publishing Engine
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Draft, preview, and publish SEO/GEO-optimized blog posts for Conceivable
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "var(--surface)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              backgroundColor: tab === t.key ? "var(--background)" : "transparent",
              color: tab === t.key ? ACCENT : "var(--muted)",
              boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "queue" && <QueueTab />}
      {tab === "workspace" && <WorkspaceTab />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "template" && <TemplateTab />}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TAB 0: PUBLISHING QUEUE
   ════════════════════════════════════════════════════════════════════ */

interface BlogDraft {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  publishedAt: string | null;
  metrics: {
    metaTitle?: string;
    metaDescription?: string;
    faqBlock?: string;
    tags?: string[];
    shopifyUrl?: string;
    shopifyHandle?: string;
  } | null;
}

function QueueTab() {
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formMetaTitle, setFormMetaTitle] = useState("");
  const [formMetaDesc, setFormMetaDesc] = useState("");
  const [formFaq, setFormFaq] = useState("");
  const [formTags, setFormTags] = useState("");

  const fetchDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/blog-queue");
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  const resetForm = () => {
    setFormTitle("");
    setFormBody("");
    setFormMetaTitle("");
    setFormMetaDesc("");
    setFormFaq("");
    setFormTags("");
    setShowForm(false);
  };

  const saveDraft = async () => {
    if (!formTitle.trim() || !formBody.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/marketing/blog-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          body: formBody.trim(),
          metaTitle: formMetaTitle.trim() || undefined,
          metaDescription: formMetaDesc.trim() || undefined,
          faqBlock: formFaq.trim() || undefined,
          tags: formTags.trim() ? formTags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
        }),
      });
      if (res.ok) {
        resetForm();
        fetchDrafts();
      }
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const deleteDraft = async (id: string) => {
    await fetch(`/api/marketing/blog-queue/${id}`, { method: "DELETE" });
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
    fetchDrafts();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const draftIds = drafts.filter((d) => d.status === "draft").map((d) => d.id);
    if (draftIds.every((id) => selected.has(id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(draftIds));
    }
  };

  const bulkPublish = async () => {
    if (selected.size === 0) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch("/api/marketing/blog-queue/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.error) {
        setPublishResult({ ok: false, message: data.error });
      } else {
        const { succeeded, failed } = data.summary;
        setPublishResult({
          ok: failed === 0,
          message: `${succeeded} published${failed > 0 ? `, ${failed} failed` : ""}`,
        });
        setSelected(new Set());
        fetchDrafts();
      }
    } catch {
      setPublishResult({ ok: false, message: "Network error" });
    } finally {
      setPublishing(false);
    }
  };

  const draftCount = drafts.filter((d) => d.status === "draft").length;
  const publishedCount = drafts.filter((d) => d.status === "published").length;
  const previewDraft = previewId ? drafts.find((d) => d.id === previewId) : null;

  return (
    <div className="space-y-6">
      {/* Stats + New Draft button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: YELLOW }} />
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>{draftCount}</strong> drafts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GREEN }} />
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              <strong style={{ color: "var(--foreground)" }}>{publishedCount}</strong> published
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
        >
          <Plus size={14} />
          New Draft
        </button>
      </div>

      {/* Paste Form */}
      {showForm && (
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              Paste New Blog Draft
            </h2>
            <button onClick={resetForm}>
              <X size={18} style={{ color: "var(--muted)" }} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Blog Post Title *
              </label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="The Best Smart Ring for Fertility Tracking"
                className="w-full text-sm rounded-lg px-3 py-2"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                SEO Title (meta title)
              </label>
              <input
                value={formMetaTitle}
                onChange={(e) => setFormMetaTitle(e.target.value)}
                placeholder="Best Smart Ring for Fertility | Conceivable"
                className="w-full text-sm rounded-lg px-3 py-2"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Meta Description
            </label>
            <input
              value={formMetaDesc}
              onChange={(e) => setFormMetaDesc(e.target.value)}
              placeholder="Under 160 chars — what shows in Google search results"
              maxLength={160}
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
            <span className="text-[10px]" style={{ color: formMetaDesc.length > 155 ? RED : "var(--muted)" }}>
              {formMetaDesc.length}/160
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Body Content (HTML or Rich Text) *
            </label>
            <textarea
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              placeholder="Paste your blog post HTML here..."
              rows={12}
              className="w-full text-sm rounded-lg px-3 py-2 font-mono"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              FAQ Block <span className="normal-case font-normal">(Q: / A: pairs — auto-generates JSON-LD schema)</span>
            </label>
            <textarea
              value={formFaq}
              onChange={(e) => setFormFaq(e.target.value)}
              placeholder={`Q: What is the best smart ring for fertility?\nA: The Halo Ring by Conceivable tracks temperature, HRV, sleep, and blood glucose.\n\nQ: How much does it cost?\nA: $250 one-time purchase with optional $15/month AI coaching.`}
              rows={6}
              className="w-full text-sm rounded-lg px-3 py-2 font-mono"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Tags <span className="normal-case font-normal">(comma-separated)</span>
            </label>
            <input
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="smart ring, fertility tracking, wearables, halo ring"
              className="w-full text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={saveDraft}
              disabled={saving || !formTitle.trim() || !formBody.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
              style={{ backgroundColor: ACCENT, color: "#fff" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 rounded-lg text-sm"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Publish Result */}
      {publishResult && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: publishResult.ok ? `${GREEN}15` : `${RED}15`,
            border: `1px solid ${publishResult.ok ? GREEN : RED}30`,
            color: publishResult.ok ? GREEN : RED,
          }}
        >
          {publishResult.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {publishResult.message}
          <button onClick={() => setPublishResult(null)} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bulk actions bar */}
      {drafts.filter((d) => d.status === "draft").length > 0 && (
        <div
          className="flex items-center justify-between rounded-lg px-4 py-3"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button onClick={toggleAll} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
              {drafts.filter((d) => d.status === "draft").every((d) => selected.has(d.id))
                ? <SquareCheck size={16} style={{ color: ACCENT }} />
                : <Square size={16} />
              }
              Select all drafts
            </button>
            {selected.size > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
                {selected.size} selected
              </span>
            )}
          </div>
          <button
            onClick={bulkPublish}
            disabled={selected.size === 0 || publishing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{ backgroundColor: GREEN, color: "#fff" }}
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {publishing ? "Publishing..." : `Publish ${selected.size > 0 ? selected.size : ""} to Shopify`}
          </button>
        </div>
      )}

      {/* Drafts list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.3 }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No blog drafts yet. Click &quot;New Draft&quot; to paste your first blog post.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const meta = draft.metrics || {};
            const isDraft = draft.status === "draft";
            const isSelected = selected.has(draft.id);
            return (
              <div
                key={draft.id}
                className="rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: "var(--surface)",
                  border: `1px solid ${isSelected ? ACCENT : "var(--border)"}`,
                  boxShadow: isSelected ? `0 0 0 1px ${ACCENT}40` : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  {isDraft && (
                    <button onClick={() => toggleSelect(draft.id)} className="mt-0.5">
                      {isSelected
                        ? <SquareCheck size={18} style={{ color: ACCENT }} />
                        : <Square size={18} style={{ color: "var(--muted)" }} />
                      }
                    </button>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>
                        {draft.title}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                        style={
                          isDraft
                            ? { border: `1px solid ${YELLOW}`, color: YELLOW }
                            : { backgroundColor: GREEN, color: "#fff" }
                        }
                      >
                        {draft.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--muted)" }}>
                      {meta.metaDescription && (
                        <span className="truncate max-w-[400px]">{meta.metaDescription}</span>
                      )}
                      <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                      {meta.tags && meta.tags.length > 0 && (
                        <span className="flex gap-1">
                          {meta.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[10px]"
                              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                              {tag}
                            </span>
                          ))}
                          {meta.tags.length > 3 && <span>+{meta.tags.length - 3}</span>}
                        </span>
                      )}
                      {meta.shopifyUrl && (
                        <a
                          href={meta.shopifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                          style={{ color: ACCENT }}
                        >
                          View on Shopify
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setPreviewId(previewId === draft.id ? null : draft.id)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-70"
                      style={{ color: previewId === draft.id ? ACCENT : "var(--muted)" }}
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(draft.body)}
                      className="p-1.5 rounded-lg transition-all hover:opacity-70"
                      style={{ color: "var(--muted)" }}
                      title="Copy HTML"
                    >
                      <Copy size={16} />
                    </button>
                    {isDraft && (
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1.5 rounded-lg transition-all hover:opacity-70"
                        style={{ color: RED }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Preview */}
                {previewId === draft.id && (
                  <div
                    className="mt-4 rounded-lg overflow-hidden"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <div
                      className="p-4 text-xs font-medium flex items-center gap-2"
                      style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}
                    >
                      <Eye size={12} style={{ color: ACCENT }} />
                      Preview
                    </div>
                    <div
                      className="p-6 max-h-[500px] overflow-y-auto"
                      style={{ backgroundColor: "#fff", color: "#333" }}
                      dangerouslySetInnerHTML={{ __html: draft.body }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TAB 1: BLOG WORKSPACE
   ════════════════════════════════════════════════════════════════════ */

function WorkspaceTab() {
  const [selectedPost, setSelectedPost] = useState<string>("new");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [generatingImage, setGeneratingImage] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ ok: boolean; message: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Pre-load completed post HTML when selecting a ready/published post
  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
    if (postId === "post-1") {
      setMessages([
        { role: "user", content: "Load the completed fertility supplements blog post (Ready to Publish)" },
        { role: "assistant", content: FERTILITY_SUPPLEMENTS_POST_HTML },
      ]);
    } else if (postId === "new") {
      setMessages([]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastAssistantHtml =
    [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";

  const hasH1 = /<h1[\s>]/i.test(lastAssistantHtml);
  const hasFAQ = /FAQPage/i.test(lastAssistantHtml) || /<h[23][^>]*>.*faq/i.test(lastAssistantHtml);
  const hasSchema = /application\/ld\+json/i.test(lastAssistantHtml);
  const hasCTA = /cta|call.to.action|btn|button/i.test(lastAssistantHtml);

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text ?? input.trim();
      if (!msg || loading) return;
      const next: ChatMessage[] = [...messages, { role: "user", content: msg }];
      setMessages(next);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/marketing/blog-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next,
            postId: selectedPost !== "new" ? selectedPost : undefined,
          }),
        });
        const data = await res.json();
        setMessages([...next, { role: "assistant", content: data.response ?? data.content ?? data.message ?? "" }]);
      } catch {
        setMessages([
          ...next,
          { role: "assistant", content: "<p style='color:red'>Error generating content. Please try again.</p>" },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, selectedPost],
  );

  const generateHeroImage = async () => {
    const post = BLOG_CALENDAR.find((p) => p.id === selectedPost);
    const topic = post?.title || "Conceivable fertility health";
    setGeneratingImage(true);
    try {
      const res = await fetch("/api/content/branded-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform: "blog",
          template: "editorial",
          subtitle: post?.primaryKeyword || "",
        }),
      });
      const data = await res.json();
      if (data.imageData) setHeroImage(data.imageData);
    } catch { /* ignore */ }
    finally { setGeneratingImage(false); }
  };

  const publishToShopify = async () => {
    if (!lastAssistantHtml) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const post = BLOG_CALENDAR.find((p) => p.id === selectedPost);
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieces: [{
            platform: "blog",
            title: post?.title || "New Blog Post",
            copy: lastAssistantHtml,
            hashtags: post?.secondaryKeywords || [],
          }],
        }),
      });
      const data = await res.json();
      const result = data.results?.[0];
      if (result?.ok) {
        setPublishResult({ ok: true, message: "Published to Shopify!" });
      } else {
        setPublishResult({ ok: false, message: result?.error || data.error || "Publish failed" });
      }
    } catch {
      setPublishResult({ ok: false, message: "Network error" });
    } finally {
      setPublishing(false);
    }
  };

  const copyHtml = () => navigator.clipboard.writeText(lastAssistantHtml);
  const copySchema = () => navigator.clipboard.writeText(extractSchemaBlocks(lastAssistantHtml));
  const downloadHtml = () => {
    const blob = new Blob([lastAssistantHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog-post.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: "70vh" }}>
        {/* ── LEFT: Chat ── */}
        <div
          className="flex-1 flex flex-col rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
        >
          {/* Post selector */}
          <div className="p-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <FileText size={14} style={{ color: ACCENT }} />
            <select
              value={selectedPost}
              onChange={(e) => handlePostSelect(e.target.value)}
              className="text-sm rounded-md px-2 py-1 flex-1"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="new">New Post</option>
              {BLOG_CALENDAR.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword & GEO Panel */}
          {selectedPost !== "new" && (() => {
            const post = BLOG_CALENDAR.find((p) => p.id === selectedPost);
            if (!post) return null;
            return (
              <div className="px-3 py-2 space-y-2" style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
                <div className="flex items-center gap-2">
                  <Target size={12} style={{ color: ACCENT }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                    Target Keywords & GEO
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
                    {post.primaryKeyword}
                  </span>
                  {post.secondaryKeywords.map((kw) => (
                    <span key={kw} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 text-[10px]" style={{ color: "var(--muted)" }}>
                  <span className="flex items-center gap-1"><Globe size={10} /> GEO: AI-citable stats + FAQ answers</span>
                  <span className="flex items-center gap-1"><Search size={10} /> SEO: H1 + meta + schema markup</span>
                  <span className="flex items-center gap-1"><BarChart3 size={10} /> {post.wordTarget.toLocaleString()} word target</span>
                </div>
              </div>
            );
          })()}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "60vh" }}>
            {messages.length === 0 && (
              <div className="space-y-4 py-4">
                {/* Quick prompts */}
                <div className="text-center space-y-3">
                  <Sparkles size={24} style={{ color: ACCENT, opacity: 0.4, margin: "0 auto" }} />
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Start drafting. The AI writes SEO + GEO optimized content in Conceivable&apos;s voice.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                        style={{
                          border: `1px solid ${ACCENT}`,
                          color: ACCENT,
                          backgroundColor: "transparent",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Long-tail keyword opportunities */}
                <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={12} style={{ color: ACCENT }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                      Long-Tail Keyword Opportunities
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${GREEN}15`, color: GREEN }}>
                      GEO Ready
                    </span>
                  </div>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto">
                    {LONG_TAIL_KEYWORDS.map((kw) => (
                      <button
                        key={kw.keyword}
                        onClick={() => sendMessage(`Write a GEO-optimized blog post targeting "${kw.keyword}". Include FAQ section, data tables, and specific statistics that AI search engines will cite.`)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-all hover:opacity-80"
                        style={{ backgroundColor: "var(--surface)" }}
                      >
                        <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                          {kw.keyword}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{kw.volume}</span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: kw.difficulty === "Low" ? `${GREEN}15` : `${YELLOW}15`,
                              color: kw.difficulty === "Low" ? GREEN : YELLOW,
                            }}
                          >
                            {kw.difficulty}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-xl px-4 py-3 text-sm"
                  style={
                    m.role === "user"
                      ? { backgroundColor: ACCENT, color: "#fff" }
                      : {
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                        }
                  }
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-xs" style={{ fontFamily: "monospace" }}>
                        {m.content.slice(0, 500)}
                        {m.content.length > 500 && "..."}
                      </pre>
                      <p className="text-[10px] mt-2" style={{ color: "var(--muted)" }}>
                        Full output shown in preview panel
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                <Loader2 size={14} className="animate-spin" style={{ color: ACCENT }} />
                Generating blog content...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Describe the blog post you want to create..."
                className="flex-1 text-sm rounded-lg px-3 py-2"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-40"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div
          className="flex-1 flex flex-col rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="p-3 flex items-center gap-2 text-sm font-medium"
            style={{ borderBottom: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            <Eye size={14} style={{ color: ACCENT }} />
            Live HTML Preview
          </div>

          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "55vh" }}>
            {lastAssistantHtml ? (
              <div
                className="p-6"
                style={{ backgroundColor: "#fff", color: "#333", minHeight: "100%" }}
                dangerouslySetInnerHTML={{ __html: lastAssistantHtml }}
              />
            ) : (
              <div className="flex items-center justify-center h-full py-20">
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Your rendered blog post will appear here once the AI generates content.
                </p>
              </div>
            )}
          </div>

          {/* Validation badges */}
          {lastAssistantHtml && (
            <div
              className="p-3 flex flex-wrap gap-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <ValidationBadge ok={hasH1} label="H1 Tag" />
              <ValidationBadge ok={hasFAQ} label="FAQ Section" />
              <ValidationBadge ok={hasSchema} label="Schema Markup" />
              <ValidationBadge ok={hasCTA} label="CTA Block" />
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom action bar ── */}
      <div
        className="flex flex-wrap gap-3 rounded-xl p-4"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <ActionBtn icon={<Copy size={14} />} label="Copy HTML" onClick={copyHtml} disabled={!lastAssistantHtml} />
        <ActionBtn icon={<Code2 size={14} />} label="Copy Schema" onClick={copySchema} disabled={!lastAssistantHtml} />
        <ActionBtn icon={<Download size={14} />} label="Download HTML" onClick={downloadHtml} disabled={!lastAssistantHtml} />
        <ActionBtn
          icon={generatingImage ? <Loader2 size={14} className="animate-spin" /> : <Palette size={14} />}
          label={generatingImage ? "Generating..." : "Generate Hero Image"}
          onClick={generateHeroImage}
          disabled={generatingImage}
        />
        <ActionBtn
          icon={publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          label={publishing ? "Publishing..." : "Publish to Shopify"}
          onClick={publishToShopify}
          disabled={publishing || !lastAssistantHtml}
          accent
        />
        <ActionBtn
          icon={<ClipboardList size={14} />}
          label="View Checklist"
          onClick={() => setShowChecklist(true)}
        />
      </div>

      {/* ── Publish Result ── */}
      {publishResult && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: publishResult.ok ? `${GREEN}15` : `${RED}15`,
            border: `1px solid ${publishResult.ok ? GREEN : RED}30`,
            color: publishResult.ok ? GREEN : RED,
          }}
        >
          {publishResult.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {publishResult.message}
        </div>
      )}

      {/* ── Hero Image Preview ── */}
      {heroImage && (
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Hero Image (1200x630)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = heroImage;
                  a.download = "blog-hero.png";
                  a.click();
                }}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                <Download size={12} className="inline mr-1" /> Download
              </button>
              <button
                onClick={generateHeroImage}
                disabled={generatingImage}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                Regenerate
              </button>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="Blog hero" className="w-full rounded-lg" style={{ maxHeight: 300, objectFit: "cover" }} />
        </div>
      )}

      {/* ── Checklist Modal ── */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="rounded-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center justify-between p-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                Post-Publish Checklist
              </h2>
              <button onClick={() => setShowChecklist(false)}>
                <X size={18} style={{ color: "var(--muted)" }} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {CHECKLIST_ITEMS.map((item, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: checklist[i] ? `${GREEN}10` : "transparent" }}
                >
                  <input
                    type="checkbox"
                    checked={checklist[i]}
                    onChange={() => {
                      const next = [...checklist];
                      next[i] = !next[i];
                      setChecklist(next);
                    }}
                    className="mt-0.5"
                    style={{ accentColor: GREEN }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: checklist[i] ? GREEN : "var(--foreground)",
                      textDecoration: checklist[i] ? "line-through" : "none",
                    }}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
            <div className="p-4 text-center" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {checklist.filter(Boolean).length} / {CHECKLIST_ITEMS.length} completed
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  disabled,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
      style={
        accent
          ? { backgroundColor: ACCENT, color: "#fff" }
          : { backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }
      }
    >
      {icon}
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TAB 2: CONTENT CALENDAR
   ════════════════════════════════════════════════════════════════════ */

function CalendarTab() {
  const published = BLOG_CALENDAR.filter((p) => p.status === "published").length;
  const ready = BLOG_CALENDAR.filter((p) => p.status === "ready").length;
  const pipeline = BLOG_CALENDAR.length - published;

  const stats = [
    { label: "Total Posts", value: BLOG_CALENDAR.length, color: ACCENT, icon: FileText },
    { label: "Published", value: published, color: GREEN, icon: CheckCircle2 },
    { label: "Ready", value: ready, color: GREEN, icon: Target },
    { label: "In Pipeline", value: pipeline, color: YELLOW, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} style={{ color: s.color }} />
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--muted)" }}>
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Post cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BLOG_CALENDAR.map((post) => (
          <div
            key={post.id}
            className="rounded-xl p-5 space-y-3 transition-all hover:shadow-md"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold leading-snug flex-1" style={{ color: "var(--foreground)" }}>
                {post.title}
              </h3>
              <Badge
                label={post.status}
                color={STATUS_COLORS[post.status]}
                filled={post.status === "published"}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge label={post.category} color={CATEGORY_COLORS[post.category] ?? ACCENT} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <div className="flex items-center gap-1">
                <Hash size={11} />
                <span className="truncate">{post.primaryKeyword}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={11} />
                <span>{post.targetDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 size={11} />
                <span>{post.wordTarget.toLocaleString()} words</span>
              </div>
            </div>

            {post.secondaryKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.secondaryKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TAB 3: TEMPLATE & RULES
   ════════════════════════════════════════════════════════════════════ */

function TemplateTab() {
  const [promptOpen, setPromptOpen] = useState(false);

  const copyPrompt = () => navigator.clipboard.writeText(SYSTEM_PROMPT);

  return (
    <div className="space-y-6">
      {/* Page Head Elements */}
      <RuleCard title="Page Head Elements (Per Post)" icon={<Code2 size={16} />}>
        <div className="space-y-2 text-sm" style={{ color: "var(--foreground)" }}>
          {[
            { el: "Title Tag", desc: "[Post Title] | Conceivable" },
            { el: "Meta Description", desc: "Under 160 chars, contains primary keyword, compelling" },
            { el: "Canonical URL", desc: "https://conceivable.com/blogs/[category]/[slug]" },
            { el: "og:title", desc: "Same as title tag" },
            { el: "og:description", desc: "Same as meta description" },
            { el: "og:type", desc: "article" },
            { el: "og:image", desc: "1200x630px hero image" },
            { el: "twitter:card", desc: "summary_large_image" },
            { el: "Article Schema", desc: "JSON-LD — author, datePublished, dateModified, publisher" },
            { el: "FAQ Schema", desc: "JSON-LD — auto-generated from FAQ section questions/answers" },
          ].map((item) => (
            <div key={item.el} className="flex items-start gap-3 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <code className="text-xs font-semibold px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}>{item.el}</code>
              <span className="text-xs" style={{ color: "var(--muted)" }}>{item.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
          The AI drafting workspace generates all schema markup automatically. Use &quot;Copy Schema&quot; to extract just the JSON-LD blocks for pasting into the Shopify page head.
        </p>
      </RuleCard>

      {/* Brand Typography */}
      <RuleCard title="Brand Typography" icon={<Type size={16} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: "var(--foreground)" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Element</th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Font</th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Size</th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Line Height</th>
                <th className="text-left py-2 text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Color</th>
              </tr>
            </thead>
            <tbody>
              {[
                { el: "H1", font: "Georgia", size: "38px", lh: "1.2", color: "#2A2828" },
                { el: "H2", font: "Georgia", size: "28px", lh: "--", color: "#2A2828", note: "margin-top: 48px" },
                { el: "H3", font: "Georgia", size: "22px", lh: "--", color: "#2A2828", note: "margin-top: 32px" },
                { el: "Body", font: "Georgia", size: "17px", lh: "1.7", color: "#444" },
                { el: "Captions", font: "Georgia", size: "14px", lh: "--", color: "#888" },
              ].map((r) => (
                <tr key={r.el} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2 pr-4 font-semibold">{r.el}</td>
                  <td className="py-2 pr-4">{r.font}</td>
                  <td className="py-2 pr-4">{r.size}</td>
                  <td className="py-2 pr-4">{r.lh}</td>
                  <td className="py-2">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: r.color }} />
                      {r.color}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
          If Shopify theme uses custom fonts, match those instead of Georgia.
        </p>
      </RuleCard>

      {/* Brand Colors */}
      <RuleCard title="Brand Colors" icon={<Palette size={16} />}>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Accent Blue", hex: ACCENT },
            { name: "Green", hex: GREEN },
            { name: "Red", hex: RED },
            { name: "Yellow", hex: YELLOW },
            { name: "Pink", hex: PINK },
            { name: "Cream", hex: CREAM },
          ].map((c) => (
            <div key={c.hex} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: "1px solid var(--border)" }}>
              <span className="w-6 h-6 rounded-md" style={{ backgroundColor: c.hex }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{c.name}</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </RuleCard>

      {/* Required Structural Elements */}
      <RuleCard title="Required Structural Elements" icon={<Layout size={16} />}>
        <ol className="space-y-2 text-sm list-none" style={{ color: "var(--foreground)" }}>
          {[
            "Breadcrumb nav",
            "H1 with primary keyword",
            "Last updated date",
            "Table of Contents",
            "Proper heading hierarchy (H1 > H2 > H3, no skipping)",
            "Data tables where applicable",
            "Comparison cards",
            "FAQ section (minimum 5 questions)",
            "CTA block",
            "Disclaimer",
            "About Conceivable block",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className="text-[10px] font-bold mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
              >
                {String.fromCharCode(97 + i)}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </RuleCard>

      {/* SEO Rules */}
      <RuleCard title="SEO Rules" icon={<Search size={16} />}>
        <ul className="space-y-2 text-sm" style={{ color: "var(--foreground)" }}>
          {[
            "Primary keyword in H1, first paragraph, at least one H2, meta description, and URL slug",
            "Natural keyword density -- never stuffed",
            "Meta description under 160 characters, includes primary keyword",
            "Clean URL slug with keyword",
            "Alt text on all images with relevant keywords",
            "Internal links to at least 2-3 other Conceivable pages",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: GREEN }} />
              {item}
            </li>
          ))}
        </ul>
      </RuleCard>

      {/* GEO Rules */}
      <RuleCard title="GEO Rules" icon={<Globe size={16} />}>
        <ul className="space-y-2 text-sm" style={{ color: "var(--foreground)" }}>
          {[
            "Include specific statistics and numbers that AI engines can cite",
            "Use definitive statements AI can extract as answers",
            "Write concise FAQ answers (2-3 sentences) that work as AI-ready snippets",
            "Structure data in tables for easy AI parsing",
            "Use consistent comparison formats (vs. competitors, options, etc.)",
            "Every post should answer the question someone would ask an AI assistant",
            "Include JSON-LD schema (Article + FAQ) for structured data",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Sparkles size={14} className="mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
              {item}
            </li>
          ))}
        </ul>
      </RuleCard>

      {/* Post-Publish Checklist */}
      <RuleCard title="Post-Publish Checklist" icon={<ListChecks size={16} />}>
        <ol className="space-y-2 text-sm list-decimal list-inside" style={{ color: "var(--foreground)" }}>
          {CHECKLIST_ITEMS.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </RuleCard>

      {/* System Prompt */}
      <RuleCard title="System Prompt" icon={<Code2 size={16} />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPromptOpen(!promptOpen)}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: ACCENT }}
            >
              {promptOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {promptOpen ? "Collapse" : "Expand"} system prompt
            </button>
            <button
              onClick={copyPrompt}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
            >
              <Copy size={12} />
              Copy
            </button>
          </div>
          {promptOpen && (
            <pre
              className="text-xs whitespace-pre-wrap rounded-lg p-4 overflow-x-auto"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              {SYSTEM_PROMPT}
            </pre>
          )}
        </div>
      </RuleCard>
    </div>
  );
}

function RuleCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: ACCENT }}>{icon}</span>
        <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
