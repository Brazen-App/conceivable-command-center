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
} from "lucide-react";
import { FERTILITY_SUPPLEMENTS_POST_HTML } from "@/lib/data/blog-posts-data";

/* ──────────────────────────── constants ──────────────────────────── */

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";
const PINK = "#E37FB1";
const CREAM = "#F9F7F0";

type TabKey = "workspace" | "calendar" | "template";
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
  "Write a blog post about the best fertility supplements",
  "Outline a post targeting 'PCOS fertility'",
  "Draft FAQ section for menstrual cycle phases",
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
- H1: font-family: 'Georgia', serif; font-size: 38px; line-height: 1.2; color: #2A2828;
- H2: font-family: 'Georgia', serif; font-size: 28px; color: #2A2828; margin-top: 48px;
- H3: font-size: 22px; color: #2A2828; margin-top: 32px;
- Body: font-size: 17px; line-height: 1.7; color: #444;
- Background: #F9F7F0 for TOC, cards, About block

Brand colors: Primary #5A6FFF, Background #F9F7F0, Text #2A2828, Secondary #555, Meta #888, Pink #E37FB1, Green #1EAA55, CTA gradient: linear-gradient(135deg, #5A6FFF 0%, #9686B9 100%)

If Shopify theme uses custom fonts, replace Georgia with the actual theme font so posts look native.

Required structural elements in every post:
a) Breadcrumb: Home > Category > Title (14px, #888, links #5A6FFF)
b) H1 with primary keyword front-loaded
c) Last updated date below H1
d) TOC box: bg #F9F7F0, border-radius 12px, numbered anchor links in #5A6FFF
e) Heading hierarchy: H1 > H2 > H3 (never skip)
f) Data tables: header bg #5A6FFF white text, alternating white/#F9F7F0 rows
g) Comparison cards: bg #F9F7F0, border-radius 12px, Pros/Cons/Verdict
h) FAQ section: min 5 questions as H3, 2-3 sentence answers, border-bottom 1px #eee
i) CTA block: gradient bg, white text centered, white button with #5A6FFF text
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
  const [tab, setTab] = useState<TabKey>("workspace");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
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

      {tab === "workspace" && <WorkspaceTab />}
      {tab === "calendar" && <CalendarTab />}
      {tab === "template" && <TemplateTab />}
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

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "60vh" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                <Sparkles size={32} style={{ color: ACCENT, opacity: 0.4 }} />
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Start drafting your blog post. The AI knows Conceivable&apos;s SEO/GEO rules and brand voice.
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
          icon={<ClipboardList size={14} />}
          label="View Checklist"
          onClick={() => setShowChecklist(true)}
          accent
        />
      </div>

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
