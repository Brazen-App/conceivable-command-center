"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Calendar, ArrowRight } from "lucide-react";

const ACCENT = "#356FB6";

type VCStage = "prospect" | "contacted" | "meeting" | "due-diligence" | "term-sheet" | "passed";

interface VCFirm {
  id: string;
  firm: string;
  partner: string;
  stage: VCStage;
  checkSize: string;
  thesisAlignment: "strong" | "moderate" | "low";
  lastContact: string;
  nextAction: string;
  notes: string;
}

const VC_PIPELINE: VCFirm[] = [
  { id: "vc01", firm: "Serena Ventures", partner: "Associate TBD", stage: "meeting", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "2026-03-01", nextAction: "Send follow-up with pilot data summary", notes: "Personal fertility journey alignment. Interested in the data story." },
  { id: "vc02", firm: "Spring Health Ventures", partner: "Dr. Sarah Kim", stage: "meeting", checkSize: "$1-2M", thesisAlignment: "strong", lastContact: "2026-02-26", nextAction: "Schedule deep-dive on clinical data", notes: "FemTech specialist fund. Very interested in evidence-based approach." },
  { id: "vc03", firm: "Forerunner Ventures", partner: "Kirsten Green", stage: "contacted", checkSize: "$2-5M", thesisAlignment: "moderate", lastContact: "2026-02-20", nextAction: "Follow up with updated traction metrics", notes: "Consumer health focus. Need to strengthen DTC narrative." },
  { id: "vc04", firm: "Maveron", partner: "Healthcare Partner", stage: "contacted", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "2026-02-18", nextAction: "Send product demo video", notes: "Consumer-first investor. Interested in community-led growth model." },
  { id: "vc05", firm: "Lux Capital", partner: "Science Partner", stage: "prospect", checkSize: "$3-5M", thesisAlignment: "strong", lastContact: "2026-02-10", nextAction: "Warm intro via biotech network", notes: "Deep tech / science-first thesis. Patent portfolio is key differentiator." },
  { id: "vc06", firm: "General Catalyst", partner: "Health Platform Lead", stage: "prospect", checkSize: "$5-10M", thesisAlignment: "moderate", lastContact: "2026-02-05", nextAction: "Initial outreach with one-pager", notes: "Platform thesis. Need to show potential for broader women's health platform." },
  { id: "vc07", firm: "Andreessen Horowitz (a16z Bio)", partner: "Bio Fund Partner", stage: "prospect", checkSize: "$5-10M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Prepare science-focused pitch", notes: "Bio fund specifically targets clinical evidence + tech. Our sweet spot." },
  { id: "vc08", firm: "Female Founders Fund", partner: "Anu Duggal", stage: "contacted", checkSize: "$250K-500K", thesisAlignment: "strong", lastContact: "2026-02-22", nextAction: "Schedule partner meeting", notes: "Perfect alignment on mission. Smaller check but strong signal value." },
  { id: "vc09", firm: "Rock Health", partner: "Health Innovation Lead", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "2026-01-15", nextAction: "Apply to digital health accelerator program", notes: "Digital health specialists. Could provide both funding and network." },
  { id: "vc10", firm: "Khosla Ventures", partner: "Health Tech Partner", stage: "prospect", checkSize: "$2-5M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Cold outreach via healthcare portfolio founders", notes: "Bold bets thesis. Need strong vision narrative." },
];

function StageBadge({ stage }: { stage: VCStage }) {
  const config: Record<VCStage, { bg: string; color: string; label: string }> = {
    prospect: { bg: "#9686B918", color: "#9686B9", label: "Prospect" },
    contacted: { bg: "#78C3BF18", color: "#78C3BF", label: "Contacted" },
    meeting: { bg: "#356FB618", color: "#356FB6", label: "Meeting" },
    "due-diligence": { bg: "#F1C02818", color: "#F1C028", label: "Due Diligence" },
    "term-sheet": { bg: "#1EAA5518", color: "#1EAA55", label: "Term Sheet" },
    passed: { bg: "#E24D4718", color: "#E24D47", label: "Passed" },
  };
  const c = config[stage];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function AlignmentIndicator({ level }: { level: "strong" | "moderate" | "low" }) {
  const config = {
    strong: { color: "#1EAA55", bars: 3 },
    moderate: { color: "#F1C028", bars: 2 },
    low: { color: "#E24D47", bars: 1 },
  };
  const c = config[level];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-2 h-4 rounded-sm"
          style={{ backgroundColor: i <= c.bars ? c.color : "var(--border)" }}
        />
      ))}
      <span className="text-xs ml-1 capitalize" style={{ color: c.color }}>{level}</span>
    </div>
  );
}

export default function VenturePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<VCStage | "all">("all");

  const filtered = stageFilter === "all" ? VC_PIPELINE : VC_PIPELINE.filter((v) => v.stage === stageFilter);

  const stageCounts = VC_PIPELINE.reduce((acc, v) => {
    acc[v.stage] = (acc[v.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Series A Tracker
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          {VC_PIPELINE.length} VC Firms
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          in pipeline targeting $5M Series A
        </p>

        {/* Mini funnel */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto">
          {(["prospect", "contacted", "meeting", "due-diligence", "term-sheet"] as VCStage[]).map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {stageCounts[stage] || 0}
                </p>
                <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
                  {stage.replace("-", " ")}
                </p>
              </div>
              {i < 4 && <ArrowRight size={14} style={{ color: "var(--muted)" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "prospect", "contacted", "meeting", "due-diligence", "term-sheet"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStageFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={
              stageFilter === f
                ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {f === "all" ? "All Stages" : f.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* VC Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Firm</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Partner</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Stage</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Check Size</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Alignment</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vc) => (
                <>
                  <tr
                    key={vc.id}
                    className="border-t cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setExpandedId(expandedId === vc.id ? null : vc.id)}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{vc.firm}</td>
                    <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{vc.partner}</td>
                    <td className="px-5 py-3"><StageBadge stage={vc.stage} /></td>
                    <td className="px-5 py-3 font-medium" style={{ color: ACCENT }}>{vc.checkSize}</td>
                    <td className="px-5 py-3"><AlignmentIndicator level={vc.thesisAlignment} /></td>
                    <td className="px-5 py-3" style={{ color: "var(--muted)" }}>{vc.lastContact}</td>
                  </tr>
                  {expandedId === vc.id && (
                    <tr key={`${vc.id}-detail`} style={{ backgroundColor: "var(--background)" }}>
                      <td colSpan={6} className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Next Action</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{vc.nextAction}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Notes</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{vc.notes}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
