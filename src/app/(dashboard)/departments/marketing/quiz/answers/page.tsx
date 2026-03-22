"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  RefreshCw,
  Loader2,
  Users,
  ArrowLeft,
  PieChart,
} from "lucide-react";
import Link from "next/link";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const PINK = "#E37FB1";
const YELLOW = "#F1C028";
const PURPLE = "#9686B9";
const NAVY = "#356FB6";
const PALE_BLUE = "#78C3BF";
const RED = "#E24D47";

const BAR_COLORS = [ACCENT, GREEN, PINK, YELLOW, PURPLE, NAVY, PALE_BLUE, RED];

interface QuestionData {
  key: string;
  label: string;
  step: number;
  type: "single" | "multi" | "text";
  total: number;
  answers: Array<{ value: string; label: string; count: number }>;
}

interface AnswersData {
  configured: boolean;
  questions: QuestionData[];
  totalCompletions: number;
  error?: string;
}

function AnswerBar({
  label,
  count,
  total,
  color,
  rank,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  rank: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 text-right">
        <span className="text-[10px] font-bold" style={{ color: "var(--muted)" }}>
          {rank}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {label}
          </span>
          <span className="text-xs font-bold" style={{ color }}>
            {count} ({pct}%)
          </span>
        </div>
        <div
          className="h-6 rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div
            className="h-full rounded-lg transition-all duration-700"
            style={{
              width: `${Math.max(pct, 2)}%`,
              backgroundColor: `${color}30`,
              borderLeft: `4px solid ${color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, index }: { question: QuestionData; index: number }) {
  const color = BAR_COLORS[index % BAR_COLORS.length];
  const topAnswer = question.answers[0];

  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {question.step}
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {question.label}
            </h3>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              {question.total} responses &middot; {question.type === "multi" ? "Multi-select" : "Single"}
            </span>
          </div>
        </div>
        {topAnswer && (
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--muted)" }}>
              Top answer
            </span>
            <p className="text-xs font-bold" style={{ color }}>
              {topAnswer.label}
            </p>
          </div>
        )}
      </div>

      {/* Bars */}
      {question.answers.length > 0 ? (
        <div className="space-y-2">
          {question.answers.map((answer, i) => (
            <AnswerBar
              key={answer.value}
              label={answer.label}
              count={answer.count}
              total={question.total}
              color={color}
              rank={i + 1}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm py-4 text-center" style={{ color: "var(--muted)" }}>
          No responses yet
        </p>
      )}
    </div>
  );
}

export default function QuizAnswersPage() {
  const [data, setData] = useState<AnswersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/analytics/quiz-answers");
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalResponses = data?.questions?.reduce((s, q) => s + q.total, 0) || 0;
  const questionsWithData = data?.questions?.filter((q) => q.total > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/departments/marketing/quiz"
              className="flex items-center gap-1 text-xs"
              style={{ color: ACCENT }}
            >
              <ArrowLeft size={12} />
              Quiz Overview
            </Link>
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Quiz Answer Analytics
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            How users are answering each question &mdash; last 30 days
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--muted)" }}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} style={{ color: ACCENT }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Completions
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>
            {data?.totalCompletions || 0}
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={14} style={{ color: GREEN }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Total Answers
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: GREEN }}>
            {totalResponses.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <PieChart size={14} style={{ color: PURPLE }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Questions Answered
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: PURPLE }}>
            {questionsWithData} / {data?.questions?.length || 12}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : data?.questions && data.questions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.questions.map((q, i) => (
            <QuestionCard key={q.key} question={q} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BarChart3 size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.3 }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Answer data will appear after people take the quiz. Each answer is tracked via PostHog.
          </p>
        </div>
      )}
    </div>
  );
}
