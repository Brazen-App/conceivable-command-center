"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  Loader2,
  User,
  Pill,
  MessageCircle,
  Stethoscope,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const PINK = "#E37FB1";

const CONCERN_LABELS: Record<string, string> = {
  pregnant: "Getting pregnant",
  stay: "Staying pregnant",
  pcos: "PCOS",
  endo: "Endometriosis",
  ivf: "IVF/IUI prep",
  insulin: "Insulin resistance",
  sperm: "Sperm health",
};

const PRODUCT_NAMES: Record<string, string> = {
  NAC: "NAC", OMEGA: "Omega-3", COQ10: "CoQ10", METHYL_B: "Methyl B-Complex",
  VIT_C: "Vitamin C", BERBERINE: "Berberine", MAGNESIUM: "Magnesium",
  D_COMPLEX: "D-Complex", TURMERIC: "Turmeric", CHROMIUM: "Chromium",
  ZINC: "Zinc", LIPOIC: "Lipoic Acid", RESVERATROL: "Resveratrol",
  NR: "NR", RHODIOLA: "Rhodiola", ASHWAGANDHA: "Ashwagandha",
  DIM: "DIM", CALCIUM: "Calcium Citrate", ARGININE: "Arginine",
  PROBIOTIC: "Probiotic", TRIPHALA: "Triphala", FIBER: "Fiber", VIT_E: "Vitamin E",
};

interface QuizResponse {
  id: string;
  email: string;
  name: string | null;
  answers: Record<string, unknown>;
  products: string[];
  kaiMessage: string | null;
  medical: string | null;
  medications: string | null;
  otherNotes: string | null;
  topConcern: string | null;
  ageRange: string | null;
  energy: string | null;
  createdAt: string;
}

function ResponseCard({ r, isExpanded, onToggle }: { r: QuizResponse; isExpanded: boolean; onToggle: () => void }) {
  const time = new Date(r.createdAt).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "Pacific/Honolulu",
  });
  const concerns = Array.isArray(r.answers?.concerns)
    ? (r.answers.concerns as string[]).map(c => CONCERN_LABELS[c] || c).join(", ")
    : r.topConcern ? CONCERN_LABELS[r.topConcern] || r.topConcern : "—";

  const hasNotes = r.medical || r.medications || r.otherNotes;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${ACCENT}15` }}
        >
          <User size={16} style={{ color: ACCENT }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>
              {r.name || "Anonymous"}
            </span>
            {hasNotes && (
              <span title="Has notes/questions"><MessageCircle size={12} style={{ color: PINK }} /></span>
            )}
          </div>
          <span className="text-xs truncate block" style={{ color: "var(--muted)" }}>
            {r.email}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-medium" style={{ color: ACCENT }}>
            {concerns}
          </span>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <Clock size={10} style={{ color: "var(--muted)" }} />
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>{time} HST</span>
          </div>
        </div>
        <div className="shrink-0" style={{ color: "var(--muted)" }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          {/* Key answers row */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "var(--background)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--muted)" }}>Age</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {r.ageRange === "under30" ? "Under 30" : r.ageRange === "under35" ? "30–35" : r.ageRange === "over35" ? "Over 35" : "—"}
              </span>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "var(--background)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--muted)" }}>Energy</span>
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {r.energy === "tired" ? "Exhausted" : r.energy === "medium" ? "Medium" : r.energy === "great" ? "Great" : "—"}
              </span>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "var(--background)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--muted)" }}>Products</span>
              <span className="text-xs font-bold" style={{ color: GREEN }}>
                {r.products?.length || 0} supps
              </span>
            </div>
          </div>

          {/* Supplements */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Pill size={12} style={{ color: GREEN }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Recommended Supplements
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(r.products || []).map((p: string) => (
                <span
                  key={p}
                  className="text-[11px] font-medium px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${GREEN}12`, color: GREEN }}
                >
                  {PRODUCT_NAMES[p] || p}
                </span>
              ))}
            </div>
          </div>

          {/* Free-text fields — the stuff you really want to see */}
          {r.medical && (
            <div className="rounded-lg p-3" style={{ backgroundColor: `${PINK}08`, border: `1px solid ${PINK}20` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Stethoscope size={12} style={{ color: PINK }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: PINK }}>
                  Medical Conditions
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{r.medical}</p>
            </div>
          )}

          {r.medications && (
            <div className="rounded-lg p-3" style={{ backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Pill size={12} style={{ color: ACCENT }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Current Medications
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{r.medications}</p>
            </div>
          )}

          {r.otherNotes && (
            <div className="rounded-lg p-3" style={{ backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}20` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <MessageCircle size={12} style={{ color: ACCENT }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                  Their Notes / Questions
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{r.otherNotes}</p>
            </div>
          )}

          {/* Kai's response */}
          {r.kaiMessage && (
            <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Kai&apos;s Response
                </span>
              </div>
              <p className="text-xs leading-relaxed italic" style={{ color: "var(--muted)" }}>{r.kaiMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizResponsesPage() {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/quiz-responses");
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
      }
    } catch (err) {
      console.error("[quiz-responses] fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const withNotes = responses.filter(r => r.medical || r.medications || r.otherNotes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/departments/marketing/quiz"
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <ArrowLeft size={14} style={{ color: "var(--muted)" }} />
          </Link>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Quiz Responses
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {responses.length} responses &middot; {withNotes.length} with notes/questions
            </p>
          </div>
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

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={14} style={{ color: ACCENT }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Emails Collected</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>{responses.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={14} style={{ color: PINK }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>With Notes</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: PINK }}>{withNotes.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope size={14} style={{ color: GREEN }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>With Medical Info</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: GREEN }}>
            {responses.filter(r => r.medical).length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : responses.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <Mail size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No responses yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Responses will appear here as people complete the quiz
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {responses.map(r => (
            <ResponseCard
              key={r.id}
              r={r}
              isExpanded={expanded.has(r.id)}
              onToggle={() => toggleExpand(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
