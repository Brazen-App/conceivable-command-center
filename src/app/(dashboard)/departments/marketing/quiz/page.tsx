"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  ShoppingCart,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Target,
  Loader2,
  ArrowRight,
  Zap,
  Mail,
} from "lucide-react";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const YELLOW = "#F1C028";
const PINK = "#E37FB1";
const PURPLE = "#9686B9";

const QUIZ_URL = "https://conceivable-quiz.vercel.app";
const POSTHOG_DASHBOARD = "https://us.posthog.com";

interface QuizAnalytics {
  source: string;
  configured: boolean;
  funnel?: {
    quiz_started: number;
    quiz_completed: number;
    email_collected: number;
    cart_clicked: number;
    steps_total?: number;
    purchases?: number;
    revenue?: number;
  };
  stepDropoff?: Record<string, number> | null;
  topConcerns?: Record<string, number> | null;
  dailyTrend?: Array<{ date: string; started: number; completed: number }> | null;
  note?: string;
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FunnelBar({
  label,
  value,
  total,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: React.ElementType;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-36 shrink-0">
        <Icon size={14} style={{ color }} />
        <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1">
        <div
          className="h-8 rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div
            className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
            style={{
              width: `${Math.max(pct, 4)}%`,
              backgroundColor: `${color}20`,
              borderLeft: `3px solid ${color}`,
            }}
          >
            <span className="text-xs font-bold" style={{ color }}>
              {value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <span
        className="text-sm font-bold w-14 text-right shrink-0"
        style={{ color }}
      >
        {pct}%
      </span>
    </div>
  );
}

interface AnswerOption { value: string; label: string; count: number; }
interface QuestionData { key: string; label: string; step: number; type: string; total: number; answers: AnswerOption[]; }
interface AnswersResponse { configured: boolean; questions: QuestionData[]; totalCompletions: number; }

const Q_COLORS = [ACCENT, GREEN, PINK, YELLOW, PURPLE, "#356FB6", "#78C3BF", "#E24D47", ACCENT, GREEN, PINK, YELLOW];

export default function QuizAnalyticsPage() {
  const [data, setData] = useState<QuizAnalytics | null>(null);
  const [answersData, setAnswersData] = useState<AnswersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [funnelRes, answersRes] = await Promise.all([
        fetch("/api/analytics/quiz"),
        fetch("/api/analytics/quiz-answers"),
      ]);
      if (!funnelRes.ok) {
        console.error("[quiz-dashboard] funnel API error:", funnelRes.status, await funnelRes.text().catch(() => ""));
      }
      if (!answersRes.ok) {
        console.error("[quiz-dashboard] answers API error:", answersRes.status, await answersRes.text().catch(() => ""));
      }
      const [funnelJson, answersJson] = await Promise.all([
        funnelRes.ok ? funnelRes.json() : { configured: false, funnel: { quiz_started: 0, quiz_completed: 0, cart_clicked: 0, purchases: 0, revenue: 0 } },
        answersRes.ok ? answersRes.json() : { configured: false, questions: [], totalCompletions: 0 },
      ]);
      setData(funnelJson);
      setAnswersData(answersJson);
    } catch (err) {
      console.error("[quiz-dashboard] fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const funnel = data?.funnel;
  const started = funnel?.quiz_started ?? 0;
  const completed = funnel?.quiz_completed ?? 0;
  // email_collected was added later — quiz_completed is the reliable count
  // since you can't complete without entering email at step 23
  const emails = funnel?.email_collected ?? 0;
  const emailCount = Math.max(emails, completed); // use whichever is higher
  const carted = funnel?.cart_clicked ?? 0;
  const purchases = funnel?.purchases ?? 0;
  const revenue = funnel?.revenue ?? 0;
  const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;
  const emailRate = started > 0 ? Math.round((emailCount / started) * 100) : 0;
  const cartRate = completed > 0 ? Math.round((carted / completed) * 100) : 0;
  const purchaseRate = carted > 0 ? Math.round((purchases / carted) * 100) : 0;

  // Step dropoff labels for the quiz
  const STEP_LABELS: Record<number, string> = {
    1: "Name",
    2: "Concerns",
    4: "Age",
    6: "Medical",
    7: "Medications",
    8: "Prenatal",
    9: "Energy",
    10: "Digestive",
    12: "Bleeding",
    13: "Tampon/Cup",
    14: "Clots",
    16: "PMS",
    17: "Cycle Length",
    19: "Stress",
    20: "BBT",
    21: "Other Notes",
    22: "Kai Response",
    23: "Email",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Supplement Quiz Analytics
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Funnel performance, conversion tracking, and user behavior from PostHog
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
          <a
            href={QUIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: ACCENT, color: "#fff" }}
          >
            <ExternalLink size={14} />
            View Quiz
          </a>
        </div>
      </div>

      {/* PostHog Status */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{
          backgroundColor: data?.configured ? `${GREEN}10` : `${ACCENT}10`,
          border: `1px solid ${data?.configured ? `${GREEN}30` : `${ACCENT}30`}`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: data?.configured ? GREEN : YELLOW }}
        />
        <span className="text-sm" style={{ color: "var(--foreground)" }}>
          {data?.configured
            ? "PostHog connected \u2014 server-side queries active"
            : "PostHog client-side tracking active \u2014 view full analytics in PostHog dashboard"}
        </span>
        <a
          href={POSTHOG_DASHBOARD}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium ml-auto"
          style={{ color: ACCENT }}
        >
          Open PostHog &rarr;
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <MetricCard
              label="Quiz Starts"
              value={started.toLocaleString()}
              icon={ClipboardList}
              color={ACCENT}
              sub="Began the quiz"
            />
            <MetricCard
              label="Completions"
              value={completed.toLocaleString()}
              icon={CheckCircle2}
              color={GREEN}
              sub={`${completionRate}% completion`}
            />
            <MetricCard
              label="Emails"
              value={emailCount.toLocaleString()}
              icon={Mail}
              color="#356FB6"
              sub={`${emailRate}% of starts`}
            />
            <MetricCard
              label="Cart Clicks"
              value={carted.toLocaleString()}
              icon={ShoppingCart}
              color={PINK}
              sub={`${cartRate}% of completions`}
            />
            <MetricCard
              label="Purchases"
              value={purchases.toLocaleString()}
              icon={ShoppingCart}
              color="#1EAA55"
              sub={`${purchaseRate}% of cart clicks`}
            />
            <MetricCard
              label="Revenue"
              value={`$${revenue.toLocaleString()}`}
              icon={TrendingUp}
              color="#356FB6"
              sub="From quiz purchases"
            />
            <MetricCard
              label="Conversion"
              value={`${started > 0 ? Math.round((purchases / started) * 100) : 0}%`}
              icon={TrendingUp}
              color={PURPLE}
              sub="Quiz start \u2192 purchase"
            />
          </div>

          {/* Funnel Visualization */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} style={{ color: ACCENT }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Quiz Funnel
              </h3>
            </div>
            <div className="space-y-4">
              <FunnelBar
                label="Started"
                value={started}
                total={started}
                color={ACCENT}
                icon={ClipboardList}
              />
              <div className="flex items-center gap-2 pl-40">
                <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {completionRate}% complete the quiz
                </span>
              </div>
              <FunnelBar
                label="Completed"
                value={completed}
                total={started}
                color={GREEN}
                icon={CheckCircle2}
              />
              <div className="flex items-center gap-2 pl-40">
                <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {emailRate}% give email
                </span>
              </div>
              <FunnelBar
                label="Emails"
                value={emailCount}
                total={started}
                color="#356FB6"
                icon={Mail}
              />
              <div className="flex items-center gap-2 pl-40">
                <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {cartRate}% click add to cart
                </span>
              </div>
              <FunnelBar
                label="Cart Click"
                value={carted}
                total={started}
                color={PINK}
                icon={ShoppingCart}
              />
              <div className="flex items-center gap-2 pl-40">
                <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {purchaseRate}% purchase
                </span>
              </div>
              <FunnelBar
                label="Purchase"
                value={purchases}
                total={started}
                color="#1EAA55"
                icon={CheckCircle2}
              />
            </div>
          </div>

          {/* Step-by-Step Dropoff */}
          {data?.stepDropoff && Object.keys(data.stepDropoff).length > 0 && (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} style={{ color: "#E24D47" }} />
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Where They Drop Off
                </h3>
              </div>
              <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
                Users who completed each step — biggest drops show where people leave
              </p>
              <div className="space-y-2">
                {(() => {
                  const steps = Object.entries(data.stepDropoff!)
                    .map(([key, count]) => ({ step: parseInt(key.replace("step_", "")), count }))
                    .sort((a, b) => a.step - b.step);
                  const maxCount = steps[0]?.count || 1;
                  return steps.map((s, i) => {
                    const pct = Math.round((s.count / maxCount) * 100);
                    const prevCount = i > 0 ? steps[i - 1].count : started;
                    const dropCount = prevCount - s.count;
                    const dropPct = prevCount > 0 ? Math.round((dropCount / prevCount) * 100) : 0;
                    const isHighDrop = dropPct > 20;
                    const label = STEP_LABELS[s.step] || `Step ${s.step}`;
                    return (
                      <div key={s.step} className="flex items-center gap-3">
                        <span className="text-[11px] font-bold w-6 text-right shrink-0" style={{ color: "var(--muted)" }}>
                          {s.step}
                        </span>
                        <span className="text-xs w-24 shrink-0 truncate" style={{ color: "var(--foreground)" }}>
                          {label}
                        </span>
                        <div className="flex-1">
                          <div
                            className="h-6 rounded overflow-hidden"
                            style={{ backgroundColor: "var(--background)" }}
                          >
                            <div
                              className="h-full rounded flex items-center px-2"
                              style={{
                                width: `${Math.max(pct, 4)}%`,
                                backgroundColor: isHighDrop ? "#E24D4720" : `${ACCENT}15`,
                                borderLeft: `3px solid ${isHighDrop ? "#E24D47" : ACCENT}`,
                              }}
                            >
                              <span className="text-[10px] font-bold" style={{ color: isHighDrop ? "#E24D47" : ACCENT }}>
                                {s.count}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-bold w-16 text-right shrink-0"
                          style={{ color: isHighDrop ? "#E24D47" : "var(--muted)" }}
                        >
                          {dropCount > 0 ? `−${dropCount} (${dropPct}%)` : "—"}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Top Concerns + Daily Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Concerns */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} style={{ color: PINK }} />
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Top Concerns
                </h3>
              </div>
              {data?.topConcerns ? (
                <div className="space-y-3">
                  {Object.entries(data.topConcerns).map(([concern, count]) => {
                    const total = Object.values(data.topConcerns!).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const labels: Record<string, string> = {
                      pregnant: "Getting pregnant",
                      stay: "Staying pregnant",
                      pcos: "PCOS",
                      endo: "Endometriosis",
                      ivf: "IVF/IUI prep",
                      insulin: "Insulin resistance",
                      sperm: "Sperm health",
                      general: "General fertility",
                    };
                    return (
                      <div key={concern} className="flex items-center gap-3">
                        <span className="text-sm flex-1" style={{ color: "var(--foreground)" }}>
                          {labels[concern] || concern}
                        </span>
                        <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: PINK }} />
                        </div>
                        <span className="text-xs font-bold w-8 text-right" style={{ color: PINK }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Data will appear after quiz completions
                </p>
              )}
            </div>

            {/* Daily Trend */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} style={{ color: GREEN }} />
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Last 7 Days
                </h3>
              </div>
              {data?.dailyTrend && data.dailyTrend.length > 0 ? (
                <div className="space-y-2">
                  {data.dailyTrend.map((day) => (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-xs w-20 shrink-0" style={{ color: "var(--muted)" }}>
                        {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-5 rounded overflow-hidden flex" style={{ backgroundColor: "var(--background)" }}>
                          {day.started > 0 && (
                            <div
                              className="h-full flex items-center justify-center text-[10px] font-bold"
                              style={{
                                width: `${Math.max((day.started / Math.max(...data.dailyTrend!.map(d => d.started), 1)) * 100, 15)}%`,
                                backgroundColor: `${ACCENT}25`,
                                color: ACCENT,
                              }}
                            >
                              {day.started}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold w-6 text-right" style={{ color: GREEN }}>
                          {day.completed}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: ACCENT }}>
                      <div className="w-2 h-2 rounded" style={{ backgroundColor: ACCENT }} /> Started
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: GREEN }}>
                      <div className="w-2 h-2 rounded" style={{ backgroundColor: GREEN }} /> Completed
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Trend data will appear after quiz activity
                </p>
              )}
            </div>
          </div>

          {/* Events Being Tracked */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} style={{ color: ACCENT }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Tracked Events
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { event: "quiz_started", desc: "User clicks 'Start Assessment' from landing page", color: ACCENT },
                { event: "quiz_step_completed", desc: "Each question answered (step number tracked)", color: YELLOW },
                { event: "email_collected", desc: "User submits their email address at the end of the quiz", color: "#356FB6" },
                { event: "quiz_completed", desc: "Quiz fully completed — results shown with supplement list", color: GREEN },
                { event: "quiz_cart_clicked", desc: "User clicks 'Add All to Cart' with their personalized supplement pack", color: PINK },
              ].map((e) => (
                <div
                  key={e.event}
                  className="flex items-start gap-3 rounded-lg p-3"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: e.color }}
                  />
                  <div>
                    <code
                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${e.color}10`, color: e.color }}
                    >
                      {e.event}
                    </code>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {e.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/departments/marketing/quiz/responses"
              className="flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <Mail size={20} style={{ color: "#356FB6" }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  Quiz Responses
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Emails, answers, notes & questions
                </p>
              </div>
              <ArrowRight size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </Link>
            <Link
              href="/departments/marketing/quiz/answers"
              className="flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <BarChart3 size={20} style={{ color: PURPLE }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  Answer Analytics
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  See how users answer each question
                </p>
              </div>
              <ArrowRight size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </Link>
            <a
              href={QUIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <Target size={20} style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  Live Quiz
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  conceivable-quiz.vercel.app
                </p>
              </div>
              <ExternalLink size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </a>
            <a
              href={POSTHOG_DASHBOARD}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <BarChart3 size={20} style={{ color: GREEN }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  PostHog Dashboard
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Full analytics + session recordings
                </p>
              </div>
              <ExternalLink size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </a>
            <a
              href="https://conceivable.com/cart/47347823935720:1,47347820167400:1,47628576719080:1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <ShoppingCart size={20} style={{ color: PINK }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  Test Cart URL
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Sample 3-product Shopify cart
                </p>
              </div>
              <ExternalLink size={14} className="ml-auto" style={{ color: "var(--muted)" }} />
            </a>
          </div>

          {/* ═══ ANSWER ANALYTICS ═══ */}
          {answersData?.questions && answersData.questions.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-2">
                <BarChart3 size={18} style={{ color: ACCENT }} />
                <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  Answer Distributions
                </h2>
                <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>
                  Last 30 days &middot; {answersData.totalCompletions} completions
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {answersData.questions.map((q, qi) => {
                  const color = Q_COLORS[qi % Q_COLORS.length];
                  const topAnswer = q.answers[0];
                  return (
                    <div
                      key={q.key}
                      className="rounded-xl p-5"
                      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${color}15`, color }}
                          >
                            {q.step}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                              {q.label}
                            </h3>
                            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                              {q.total} responses &middot; {q.type === "multi" ? "Multi-select" : "Single"}
                            </span>
                          </div>
                        </div>
                        {topAnswer && (
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--muted)" }}>
                              Top
                            </span>
                            <p className="text-xs font-bold" style={{ color }}>
                              {topAnswer.label}
                            </p>
                          </div>
                        )}
                      </div>
                      {q.answers.length > 0 ? (
                        <div className="space-y-2">
                          {q.answers.map((a, ai) => {
                            const pct = q.total > 0 ? Math.round((a.count / q.total) * 100) : 0;
                            return (
                              <div key={a.value} className="flex items-center gap-3">
                                <span className="w-4 text-right text-[10px] font-bold" style={{ color: "var(--muted)" }}>
                                  {ai + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                                      {a.label}
                                    </span>
                                    <span className="text-[11px] font-bold" style={{ color }}>
                                      {a.count} ({pct}%)
                                    </span>
                                  </div>
                                  <div className="h-4 rounded overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
                                    <div
                                      className="h-full rounded transition-all duration-700"
                                      style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: `${color}25`, borderLeft: `3px solid ${color}` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs py-3 text-center" style={{ color: "var(--muted)" }}>
                          No responses yet
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
