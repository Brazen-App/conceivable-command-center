"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  MessageCircle,
  User,
  Bot,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  TestTube2,
  TrendingUp,
  Calendar,
  Mail,
  Package,
  ShoppingCart,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────── */
/*  Types                                                        */
/* ────────────────────────────────────────────────────────────── */

interface ChatLog {
  id: string;
  email: string | null;
  name: string | null;
  isTest: boolean;
  userMessage: string;
  kaiResponse: string;
  concerns: string[];
  supplements: string[];
  sessionId: string | null;
  createdAt: string;
}

interface SessionGroup {
  sessionId: string;
  messages: ChatLog[];
  email: string | null;
  name: string | null;
  isTest: boolean;
  concerns: string[];
  supplements: string[];
  firstAt: string;
  lastAt: string;
  isQuiz: boolean;
  hasPack: boolean;
  hasCart: boolean;
}

/* Single source of truth — from /api/admin/kai-analytics */
interface KaiAnalyticsData {
  kai: {
    totalMessages: number;
    testMessages: number;
    totalSessions: number;
    emailsCollected: number;
    avgMsgsPerSession: number;
    funnel: {
      conversations: number;
      emailsCollected: number;
      packsPresented: number;
      cartLinksShown: number;
      malePacksPresented: number;
      conversionRate: number;
      cartRate: number;
      emailCaptureRate: number;
    };
    dailyTrend: { date: string; sessions: number; messages: number }[];
  };
  quiz: { totalCompletions: number };
  comparison: {
    quizCompletions: number;
    kaiConversations: number;
    kaiPacksPresented: number;
    kaiCartLinks: number;
  };
}

const CONCERN_LABELS: Record<string, string> = {
  pregnant: "Trying to conceive",
  stay: "Staying pregnant",
  pregnancy: "Currently pregnant",
  pcos: "PCOS",
  endo: "Endometriosis",
  ivf: "IVF/IUI prep",
  insulin: "Insulin resistance",
  sperm: "Sperm health",
};

type DatePreset = "today" | "7d" | "30d" | "all";

function formatDateParam(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDateRange(preset: DatePreset): { from?: string; to?: string } {
  if (preset === "all") return {};
  const now = new Date();
  const to = formatDateParam(now);
  if (preset === "today") return { from: to, to };
  if (preset === "7d") {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return { from: formatDateParam(d), to };
  }
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return { from: formatDateParam(d), to };
}

function isQuizSession(sessionId: string | null): boolean {
  if (!sessionId) return true;
  return !sessionId.startsWith("kai-") && !sessionId.startsWith("kai_");
}

/* ────────────────────────────────────────────────────────────── */
/*  Reusable KPI Card                                            */
/* ────────────────────────────────────────────────────────────── */

function KPI({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</div>
      </div>
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Date Range Picker                                            */
/* ────────────────────────────────────────────────────────────── */

function DateRangePicker({
  preset,
  customFrom,
  customTo,
  onPresetChange,
  onCustomFromChange,
  onCustomToChange,
}: {
  preset: DatePreset;
  customFrom: string;
  customTo: string;
  onPresetChange: (p: DatePreset) => void;
  onCustomFromChange: (v: string) => void;
  onCustomToChange: (v: string) => void;
}) {
  const presets: { key: DatePreset; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "all", label: "All Time" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Calendar size={14} style={{ color: "var(--muted)" }} />
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => onPresetChange(p.key)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: preset === p.key ? "#5A6FFF" : "var(--surface)",
            color: preset === p.key ? "white" : "var(--muted)",
            border: `1px solid ${preset === p.key ? "#5A6FFF" : "var(--border)"}`,
          }}
        >
          {p.label}
        </button>
      ))}
      <span className="text-xs" style={{ color: "var(--muted)" }}>or</span>
      <input
        type="date"
        value={customFrom}
        onChange={(e) => onCustomFromChange(e.target.value)}
        className="px-2 py-1 rounded-lg text-xs"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      />
      <span className="text-xs" style={{ color: "var(--muted)" }}>to</span>
      <input
        type="date"
        value={customTo}
        onChange={(e) => onCustomToChange(e.target.value)}
        className="px-2 py-1 rounded-lg text-xs"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Session Card                                                  */
/* ────────────────────────────────────────────────────────────── */

function SessionCard({
  session,
  isExpanded,
  onToggle,
}: {
  session: SessionGroup;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { sessionId, messages, email, name, isTest, concerns, supplements, firstAt, isQuiz, hasPack, hasCart } = session;
  const date = new Date(firstAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      key={sessionId}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--surface)", border: `1px solid ${isTest ? "#F1C028" : "var(--border)"}` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-start gap-3 text-left"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: isTest ? "#F1C028" : isQuiz ? "#1EAA55" : "#5A6FFF", opacity: isTest ? 0.9 : 1 }}
        >
          {isTest ? (
            <TestTube2 size={16} color="white" />
          ) : (
            <User size={16} color="white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {name || email || "Anonymous"}
            </span>
            {email && !name && null}
            {email && name && <span className="text-xs" style={{ color: "var(--muted)" }}>{email}</span>}
            {!email && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}>
                NO EMAIL
              </span>
            )}
            {isTest && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C028", color: "#2A2828" }}>
                TEST
              </span>
            )}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isQuiz ? "#1EAA5514" : "#5A6FFF14",
                color: isQuiz ? "#1EAA55" : "#5A6FFF",
              }}
            >
              {isQuiz ? "QUIZ" : "CHAT"}
            </span>
            {hasPack && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
                PACK
              </span>
            )}
            {hasCart && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}>
                CART
              </span>
            )}
            <span className="text-xs ml-auto shrink-0" style={{ color: "var(--muted)" }}>{date}</span>
          </div>
          {concerns.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              {concerns.map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>
                  {CONCERN_LABELS[c] || c}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm mt-1.5 truncate" style={{ color: "var(--muted)" }}>
            {messages[messages.length - 1]?.userMessage || "(no user message)"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
        )}
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
          {supplements.length > 0 && (
            <div className="pt-4">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>Their Pack</p>
              <div className="flex flex-wrap gap-1.5">
                {supplements.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55", border: "1px solid #1EAA5530" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-4 pt-2">
            {[...messages].reverse().map((log) => (
              <div key={log.id} className="space-y-2">
                <div className="flex gap-2 items-start justify-end">
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%]"
                    style={{ backgroundColor: "#5A6FFF", color: "white", lineHeight: 1.6 }}
                  >
                    {log.userMessage}
                  </div>
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: "#5A6FFF33" }}>
                    <User size={13} style={{ color: "#5A6FFF" }} />
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: "#F5F3FF" }}>
                    <Bot size={13} style={{ color: "#9686B9" }} />
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap"
                    style={{ backgroundColor: "var(--background)", color: "var(--foreground)", lineHeight: 1.7, border: "1px solid var(--border)" }}
                  >
                    {log.kaiResponse}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Main Page                                                    */
/* ────────────────────────────────────────────────────────────── */

export default function KaiChatsPage() {
  // Date state
  const [preset, setPreset] = useState<DatePreset>("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Single source of truth: kai-analytics API
  const [analytics, setAnalytics] = useState<KaiAnalyticsData | null>(null);
  // Chat logs for reading conversations
  const [logs, setLogs] = useState<ChatLog[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [includeTest, setIncludeTest] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "quiz">("chat");
  const [refreshKey, setRefreshKey] = useState(0);

  // Compute effective date range
  const dateParams = useMemo(() => {
    if (customFrom && customTo) {
      return { from: customFrom, to: customTo };
    }
    return getDateRange(preset);
  }, [preset, customFrom, customTo]);

  const dateQueryStr = useMemo(() => {
    const parts: string[] = [];
    if (dateParams.from) parts.push(`from=${dateParams.from}`);
    if (dateParams.to) parts.push(`to=${dateParams.to}`);
    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }, [dateParams]);

  const handleCustomFrom = (v: string) => {
    setCustomFrom(v);
    if (v && customTo) setPreset("all");
  };
  const handleCustomTo = (v: string) => {
    setCustomTo(v);
    if (v && customFrom) setPreset("all");
  };
  const handlePresetChange = (p: DatePreset) => {
    setPreset(p);
    setCustomFrom("");
    setCustomTo("");
  };

  // Fetch from THREE sources:
  // 1. kai-analytics (KPIs, funnel metrics) — single source of truth for chat numbers
  // 2. kai-chats (raw logs for reading conversations)
  // 3. kai-stripe-subscriptions (subscriber + revenue data)
  const [stripeData, setStripeData] = useState<{ active: number; trialing: number; canceled: number; newSignups: number; revenue: number; kai: { active: number; trialing: number; total: number }; mrr: number } | null>(null);
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const cacheBust = `_t=${Date.now()}`;
    try {
      const sep = dateQueryStr ? "&" : "?";
      const [analyticsRes, logsRes, stripeRes] = await Promise.all([
        fetch(`/api/admin/kai-analytics${dateQueryStr}${sep}${cacheBust}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        fetch(`/api/kai-chats?includeTest=${includeTest}&${cacheBust}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({ logs: [], total: 0 })),
        fetch(`/api/admin/kai-stripe-subscriptions${dateQueryStr}${sep}${cacheBust}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      ]);
      setAnalytics(analyticsRes);
      setLogs(logsRes.logs || []);
      setStripeData(stripeRes);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [dateQueryStr, includeTest, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Group logs by session for the chat log viewer
  const sessions: SessionGroup[] = useMemo(() => {
    const grouped = logs.reduce<Record<string, ChatLog[]>>((acc, log) => {
      const key = log.sessionId || log.id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(log);
      return acc;
    }, {});

    return Object.entries(grouped).map(([sessionId, messages]) => {
      let hasPack = false;
      let hasCart = false;
      for (const m of messages) {
        if (m.kaiResponse?.includes("PACK_START")) hasPack = true;
        if (m.kaiResponse?.includes("/checkout") || m.kaiResponse?.includes("/cart")) hasCart = true;
      }

      // Collect all unique concerns and supplements across messages
      const allConcerns = new Set<string>();
      const allSupplements = new Set<string>();
      for (const m of messages) {
        for (const c of (m.concerns || [])) allConcerns.add(c);
        for (const s of (m.supplements || [])) allSupplements.add(s);
      }

      return {
        sessionId,
        messages,
        email: messages.find(m => m.email)?.email || null,
        name: messages.find(m => m.name)?.name || null,
        isTest: messages[0].isTest,
        concerns: Array.from(allConcerns),
        supplements: Array.from(allSupplements),
        firstAt: messages[messages.length - 1].createdAt,
        lastAt: messages[0].createdAt,
        isQuiz: isQuizSession(messages[0].sessionId),
        hasPack,
        hasCart,
      };
    });
  }, [logs]);

  const chatSessions = sessions.filter((s) => !s.isQuiz);
  const quizSessions = sessions.filter((s) => s.isQuiz);
  const activeSessions = activeTab === "chat" ? chatSessions : quizSessions;

  // All KPIs come from the kai-analytics endpoint — single source of truth
  const kai = analytics?.kai;
  const funnel = kai?.funnel;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* -- Header -- */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Kai Analytics & Chats</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            All metrics from KaiChatLog, grouped by sessionId
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--muted)" }}>
            <input
              type="checkbox"
              checked={includeTest}
              onChange={(e) => setIncludeTest(e.target.checked)}
              className="rounded"
            />
            Show test
          </label>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)", opacity: loading ? 0.5 : 1 }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* -- Date Picker -- */}
      <div className="mb-6">
        <DateRangePicker
          preset={!customFrom && !customTo ? preset : ("all" as DatePreset)}
          customFrom={customFrom}
          customTo={customTo}
          onPresetChange={handlePresetChange}
          onCustomFromChange={handleCustomFrom}
          onCustomToChange={handleCustomTo}
        />
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--muted)" }}>Loading analytics...</div>
      ) : (
        <div className="space-y-6 mb-8">
          {/* -- KPI Cards -- chat metrics + Stripe revenue -- */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <KPI
              label="New Sign-ups"
              value={stripeData?.newSignups || 0}
              sub={`${stripeData?.active || 0} paying · ${stripeData?.trialing || 0} trialing`}
              color="#1EAA55"
              icon={<TrendingUp size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Revenue"
              value={`$${(stripeData?.revenue || 0).toLocaleString()}`}
              sub="From paid subscriptions only"
              color="#1EAA55"
              icon={<TrendingUp size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Conversations"
              value={funnel?.conversations || 0}
              sub={`${kai?.totalMessages || 0} messages · ~${kai?.avgMsgsPerSession || 0}/session`}
              color="#5A6FFF"
              icon={<MessageCircle size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Emails Captured"
              value={funnel?.emailsCollected || 0}
              sub={`${funnel?.emailCaptureRate || 0}% capture rate`}
              color="#356FB6"
              icon={<Mail size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Packs Built"
              value={funnel?.packsPresented || 0}
              sub={`${funnel?.conversionRate || 0}% of conversations`}
              color="#1EAA55"
              icon={<Package size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Cart Clicks"
              value={funnel?.cartLinksShown || 0}
              sub={`${funnel?.cartRate || 0}% of packs`}
              color="#F1C028"
              icon={<ShoppingCart size={12} style={{ color: "var(--muted)" }} />}
            />
            <KPI
              label="Quiz Completions"
              value={analytics?.quiz?.totalCompletions || 0}
              sub="Manual quiz completions"
              color="#9686B9"
              icon={<TrendingUp size={12} style={{ color: "var(--muted)" }} />}
            />
          </div>

          {/* -- Data Source Note -- */}
          <div className="text-[10px] px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <strong>Data source:</strong> All KPIs from KaiChatLog table (non-test, grouped by sessionId).
            Conversations = unique sessionIds (includes anonymous users without email).
            Emails Captured = unique email addresses collected.
            Test messages excluded: {kai?.testMessages || 0}.
          </div>

          {/* -- Funnel Visualization -- */}
          {funnel && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
                Kai Conversion Funnel
              </div>
              <div className="space-y-2">
                {[
                  { label: "Conversations", value: funnel.conversations, color: "#5A6FFF", note: `${funnel.conversations} unique sessions (includes anonymous)` },
                  { label: "Emails Captured", value: funnel.emailsCollected, color: "#356FB6", note: `${funnel.emailCaptureRate}% of conversations gave their email` },
                  { label: "Packs Built", value: funnel.packsPresented, color: "#1EAA55", note: `${funnel.conversionRate}% of conversations got a personalized supplement pack` },
                  { label: "Cart Clicks", value: funnel.cartLinksShown, color: "#F1C028", note: `${funnel.cartRate}% of pack recipients clicked through to cart` },
                ].map((step, i) => {
                  const max = Math.max(funnel.conversations, 1);
                  const w = Math.max((step.value / max) * 100, 4);
                  return (
                    <div key={step.label}>
                      <div className="flex items-center gap-3">
                        <div className="text-[11px] font-medium w-36 text-right" style={{ color: "var(--muted)" }}>
                          {step.label}
                        </div>
                        <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: `${step.color}10` }}>
                          <div
                            className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                            style={{ width: `${w}%`, backgroundColor: `${step.color}30`, borderLeft: `3px solid ${step.color}` }}
                          >
                            <span className="text-xs font-bold" style={{ color: step.color }}>
                              {step.value}
                            </span>
                          </div>
                        </div>
                        {i > 0 && (
                          <div className="text-[10px] font-semibold w-12 text-right" style={{ color: "var(--muted)" }}>
                            {max > 0 ? Math.round((step.value / max) * 100) : 0}%
                          </div>
                        )}
                      </div>
                      {step.note && (
                        <div className="ml-[9.5rem] mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>
                          {step.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* -- Kai Chat vs Quiz Comparison -- */}
          {analytics?.comparison && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                Kai Chat vs Manual Quiz
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#5A6FFF" }} />
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#5A6FFF" }}>
                      Kai Chat
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--muted)" }}>Conversations</span>
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{analytics.comparison.kaiConversations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--muted)" }}>Packs Built</span>
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{analytics.comparison.kaiPacksPresented}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--muted)" }}>Cart Clicks</span>
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{analytics.comparison.kaiCartLinks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--muted)" }}>Avg Messages</span>
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{kai?.avgMsgsPerSession || "--"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1EAA55" }} />
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#1EAA55" }}>
                      Manual Quiz
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "var(--muted)" }}>Quiz Completions</span>
                      <span className="font-bold" style={{ color: "var(--foreground)" }}>{analytics.comparison.quizCompletions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -- Daily Trend -- */}
          {kai?.dailyTrend && kai.dailyTrend.length > 0 && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Daily Activity</div>
              <div className="space-y-1">
                {kai.dailyTrend.map((d: { date: string; sessions: number; messages: number }) => (
                  <div key={d.date} className="flex items-center gap-3 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-xs font-medium w-20" style={{ color: "var(--muted)" }}>{d.date}</span>
                    <div className="flex gap-3 text-xs">
                      <span style={{ color: "#5A6FFF" }}>
                        <strong>{d.sessions}</strong> sessions
                      </span>
                      <span style={{ color: "#9686B9" }}>
                        <strong>{d.messages}</strong> messages
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* -- Chat Logs -- */}
      {!loading && (
        <>
          <div className="flex items-center gap-1 mb-4">
            <button
              onClick={() => setActiveTab("chat")}
              className="px-4 py-2 rounded-t-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeTab === "chat" ? "var(--surface)" : "transparent",
                color: activeTab === "chat" ? "#5A6FFF" : "var(--muted)",
                borderBottom: activeTab === "chat" ? "2px solid #5A6FFF" : "2px solid transparent",
              }}
            >
              <MessageCircle size={14} className="inline mr-1.5" style={{ verticalAlign: "-2px" }} />
              Kai Chat ({chatSessions.length})
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className="px-4 py-2 rounded-t-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeTab === "quiz" ? "var(--surface)" : "transparent",
                color: activeTab === "quiz" ? "#1EAA55" : "var(--muted)",
                borderBottom: activeTab === "quiz" ? "2px solid #1EAA55" : "2px solid transparent",
              }}
            >
              <TrendingUp size={14} className="inline mr-1.5" style={{ verticalAlign: "-2px" }} />
              Quiz Conversations ({quizSessions.length})
            </button>
          </div>

          {activeSessions.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">
                No {activeTab === "chat" ? "Kai chat" : "quiz"} conversations yet
              </p>
              <p className="text-sm mt-1">
                {activeTab === "chat"
                  ? "Conversations from the Kai chat widget will appear here"
                  : "Conversations from the quiz funnel will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <SessionCard
                  key={session.sessionId}
                  session={session}
                  isExpanded={expandedSession === session.sessionId}
                  onToggle={() => setExpandedSession(expandedSession === session.sessionId ? null : session.sessionId)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
