"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Loader2,
  AlertTriangle,
  BookOpen,
  GitBranch,
  ExternalLink,
  Tag,
  Target,
  Beaker,
  Brain,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface Paper {
  id: string;
  number: number;
  title: string;
  status: string;
  targetJournal: string | null;
  submissionDeadline: string | null;
  irbStatus: string;
  notes: string | null;
}

interface LitEntry {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  doi: string | null;
  relevanceTag: string | null;
  notes: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  hypothesis: "Hypothesis",
  outline: "Outline",
  draft: "Draft",
  final_draft: "Final Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  revision: "Revision",
  accepted: "Accepted",
  published: "Published",
};

const FACTORS = [
  {
    number: 1,
    name: "Luteal Phase Deficiency",
    tag: "factor-1",
    color: "#E24D47",
    description:
      "Short luteal phase (<10 days) or inadequate progesterone production during the luteal phase. Associated with implantation failure and early pregnancy loss. Often subclinical and undiagnosed in standard fertility workups.",
    mechanism:
      "Insufficient progesterone fails to adequately prepare the endometrial lining for implantation, leading to either implantation failure or inability to sustain early pregnancy.",
    markers: [
      "Luteal phase length < 10 days",
      "Low mid-luteal progesterone (<10 ng/mL)",
      "Shortened BBT elevation phase",
      "Inadequate endometrial development on ultrasound",
    ],
  },
  {
    number: 2,
    name: "Chronic Low-Grade Inflammation",
    tag: "factor-2",
    color: "#F1C028",
    description:
      "Persistent, subclinical systemic inflammation that creates a hostile environment for implantation and early embryo development. Not detected in standard pregnancy labs.",
    mechanism:
      "Elevated inflammatory cytokines (IL-6, TNF-alpha, CRP) disrupt the immune tolerance mechanisms required for embryo implantation and placentation. Creates oxidative stress that damages oocyte quality.",
    markers: [
      "Elevated hs-CRP (>1 mg/L)",
      "Elevated IL-6 or TNF-alpha",
      "Elevated ESR",
      "Pattern of elevated HRV inflammatory markers",
    ],
  },
  {
    number: 3,
    name: "Hormonal Dysregulation Cascade",
    tag: "factor-3",
    color: "#9686B9",
    description:
      "Interconnected dysregulation of thyroid, insulin, and cortisol axes that individually may test 'normal' but collectively create a hostile reproductive environment.",
    mechanism:
      "Subclinical thyroid dysfunction (TSH 2.5-4.5) + mild insulin resistance + chronic cortisol elevation create a synergistic negative effect on follicular development, ovulation quality, and early pregnancy maintenance.",
    markers: [
      "TSH > 2.5 mIU/L (even if 'normal range')",
      "HOMA-IR > 1.5 or fasting insulin > 10",
      "Elevated morning cortisol or flattened diurnal curve",
      "Combined effect on cycle regularity",
    ],
  },
];

const PUBLICATION_PATHS = [
  {
    id: "A",
    name: "Path A: Retrospective Analysis",
    description: "Use existing clinical pilot data (105 women, 2022-2024)",
    pros: [
      "Data already collected",
      "Faster to publication",
      "Lower cost",
      "Can start analysis immediately once IRB approved",
    ],
    cons: [
      "Smaller sample size",
      "Retrospective design less compelling",
      "May not have all biomarkers needed",
      "Need to confirm consent covers research use",
    ],
    timeline: "6-9 months to submission",
    journal: "Human Reproduction",
    color: "#5A6FFF",
  },
  {
    id: "B",
    name: "Path B: Prospective with Halo Ring",
    description: "Prospective study using Halo Ring biometric data + app data from launch",
    pros: [
      "Prospective design = stronger evidence",
      "Richer biometric data from Halo Ring",
      "Larger potential sample size",
      "Built-in consent framework",
      "Real-time data collection",
    ],
    cons: [
      "Requires Halo Ring to be launched",
      "12-18 months data collection minimum",
      "Higher complexity",
      "Consent framework must be built first",
    ],
    timeline: "18-24 months to submission",
    journal: "New England Journal of Medicine (stretch) / Human Reproduction",
    color: "#1EAA55",
  },
];

const TAG_COLORS: Record<string, string> = {
  "factor-1": "#E24D47",
  "factor-2": "#F1C028",
  "factor-3": "#9686B9",
};

export default function Paper4Page() {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [literature, setLiterature] = useState<LitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"hypothesis" | "literature" | "paths">("hypothesis");

  const fetchData = useCallback(async () => {
    try {
      const [papersRes, litRes] = await Promise.all([
        fetch("/api/research?type=papers"),
        fetch("/api/research?type=literature&paperNumber=4"),
      ]);
      if (papersRes.ok) {
        const papers = await papersRes.json();
        setPaper(papers.find((p: Paper) => p.number === 4) || null);
      }
      if (litRes.ok) {
        setLiterature(await litRes.json());
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #E24D47 0%, #F1C028 40%, #9686B9 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              <Beaker size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-wider font-bold">Paper 4</p>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
                Three Subclinical Predictors of Miscarriage Risk
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Status</p>
              <p className="text-sm font-bold text-white">{STATUS_LABELS[paper?.status || "hypothesis"]}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Journal</p>
              <p className="text-sm font-bold text-white">{paper?.targetJournal || "Human Reproduction"}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Deadline</p>
              <p className="text-sm font-bold text-white">{paper?.submissionDeadline || "Sep 2026"}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">IRB</p>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <AlertTriangle size={12} /> {paper?.irbStatus?.toUpperCase() || "NEEDED"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {[
          { id: "hypothesis" as const, label: "Hypothesis & Factors", icon: Brain },
          { id: "literature" as const, label: `Literature (${literature.length})`, icon: BookOpen },
          { id: "paths" as const, label: "Publication Paths", icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { backgroundColor: "var(--surface)", color: ACCENT, border: "1px solid var(--border)" }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Hypothesis Tab */}
      {activeTab === "hypothesis" && (
        <div className="space-y-6">
          {/* Core Hypothesis */}
          <div className="rounded-2xl p-5" style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="flex items-start gap-3 mb-4">
              <Target size={18} style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Core Hypothesis</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                  Three subclinical factors -- luteal phase deficiency, chronic low-grade inflammation, and
                  hormonal dysregulation cascade -- individually fall within &quot;normal&quot; clinical ranges but
                  collectively create a significantly elevated risk of miscarriage. These factors are
                  detectable through continuous biometric monitoring (via the Halo Ring) and cycle tracking
                  (via the Conceivable app), enabling early identification and intervention before pregnancy loss occurs.
                </p>
              </div>
            </div>
          </div>

          {/* Three Factors */}
          {FACTORS.map((factor) => (
            <div
              key={factor.number}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${factor.color}30` }}
            >
              <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: `${factor.color}08` }}>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: factor.color }}
                >
                  {factor.number}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    Factor {factor.number}: {factor.name}
                  </p>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${factor.color}20`, color: factor.color }}
                  >
                    {factor.tag}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4" style={{ backgroundColor: "var(--surface)" }}>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--muted)" }}>Description</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{factor.description}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--muted)" }}>Mechanism</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{factor.mechanism}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--muted)" }}>Key Markers</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {factor.markers.map((marker, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs p-2 rounded-lg"
                        style={{ backgroundColor: "var(--background)" }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: factor.color }} />
                        <span style={{ color: "var(--foreground)" }}>{marker}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Literature Tab */}
      {activeTab === "literature" && (
        <div className="space-y-4">
          {literature.length === 0 ? (
            <div className="text-center py-12 rounded-2xl" style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
              <BookOpen size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                No literature tagged for Paper 4 yet. Add references from the Literature tab and tag them with paper number 4
                or with factor-1, factor-2, or factor-3 relevance tags.
              </p>
            </div>
          ) : (
            <>
              {/* Group by factor */}
              {["factor-1", "factor-2", "factor-3", null].map((tag) => {
                const tagEntries = literature.filter((e) => e.relevanceTag === tag);
                if (tagEntries.length === 0) return null;
                const factor = FACTORS.find((f) => f.tag === tag);
                return (
                  <div key={tag || "other"}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: factor?.color || "var(--muted)" }}>
                      {factor ? `Factor ${factor.number}: ${factor.name}` : "General"}
                    </p>
                    {tagEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl p-4 mb-2"
                        style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
                      >
                        <div className="flex items-start gap-3">
                          <BookOpen size={14} className="shrink-0 mt-0.5" style={{ color: factor?.color || ACCENT }} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{entry.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                              {[entry.authors, entry.journal, entry.year].filter(Boolean).join(" - ")}
                            </p>
                            {entry.doi && (
                              <a
                                href={`https://doi.org/${entry.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-medium flex items-center gap-1 mt-1 hover:opacity-80"
                                style={{ color: ACCENT }}
                              >
                                DOI: {entry.doi} <ExternalLink size={9} />
                              </a>
                            )}
                          </div>
                          {entry.relevanceTag && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
                              style={{ backgroundColor: `${TAG_COLORS[entry.relevanceTag] || ACCENT}20`, color: TAG_COLORS[entry.relevanceTag] || ACCENT }}
                            >
                              <Tag size={9} /> {entry.relevanceTag}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Publication Paths Tab */}
      {activeTab === "paths" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PUBLICATION_PATHS.map((path) => (
            <div
              key={path.id}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${path.color}30` }}
            >
              <div className="px-5 py-4" style={{ backgroundColor: `${path.color}08` }}>
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch size={16} style={{ color: path.color }} />
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{path.name}</p>
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{path.description}</p>
              </div>
              <div className="px-5 py-4 space-y-4" style={{ backgroundColor: "var(--surface)" }}>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "#1EAA55" }}>Advantages</p>
                  {path.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs mb-1.5" style={{ color: "var(--foreground)" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1EAA55" }} />
                      {pro}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "#E24D47" }}>Challenges</p>
                  {path.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs mb-1.5" style={{ color: "var(--foreground)" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E24D47" }} />
                      {con}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Timeline</p>
                    <p className="text-xs font-bold" style={{ color: path.color }}>{path.timeline}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Target Journal</p>
                    <p className="text-xs font-bold" style={{ color: path.color }}>{path.journal}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10x Multiplier */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #E24D4708 0%, #F1C02808 50%, #9686B908 100%)",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0" style={{ backgroundColor: "#E24D4720", color: "#E24D47" }}>
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              This is the Breakthrough Paper
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              If published in Human Reproduction with strong data, this paper redefines how subclinical
              miscarriage risk is understood and positions Conceivable as the only solution that can detect
              and intervene on all three factors simultaneously. This is the 10x research play -- it validates
              the entire product thesis and makes the Halo Ring + AI protocol combination scientifically necessary,
              not just convenient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
