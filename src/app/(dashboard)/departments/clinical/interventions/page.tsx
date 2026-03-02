"use client";

import { useState, useMemo } from "react";
import { Search, Pill, Leaf, Dumbbell, Stethoscope, CheckCircle2, Clock, Lightbulb } from "lucide-react";

const ACCENT = "#78C3BF";

type InterventionType = "nutrition" | "supplement" | "lifestyle" | "medication";
type ValidationStatus = "validated" | "in-testing" | "proposed";
type EvidenceLevel = "strong" | "moderate" | "emerging";

interface Intervention {
  id: string;
  name: string;
  type: InterventionType;
  evidenceLevel: EvidenceLevel;
  pilotResponseRate: number;
  recommendedFor: string[];
  status: ValidationStatus;
  protocol: string;
  expectedTimeline: string;
}

const INTERVENTIONS: Intervention[] = [
  { id: "i01", name: "Vitamin D3 Supplementation (4000 IU/day)", type: "supplement", evidenceLevel: "strong", pilotResponseRate: 78, recommendedFor: ["Low Vitamin D", "Diminished Reserve", "Implantation Support"], status: "validated", protocol: "4000 IU D3 + K2 daily with fat-containing meal", expectedTimeline: "8-12 weeks to optimal levels" },
  { id: "i02", name: "CoQ10 (Ubiquinol 600mg)", type: "supplement", evidenceLevel: "moderate", pilotResponseRate: 65, recommendedFor: ["Egg Quality", "Age >35", "Mitochondrial Support"], status: "validated", protocol: "600mg ubiquinol daily in divided doses", expectedTimeline: "60-90 days for measurable impact" },
  { id: "i03", name: "Mediterranean Diet Protocol", type: "nutrition", evidenceLevel: "strong", pilotResponseRate: 72, recommendedFor: ["Insulin Resistance", "Inflammation", "Overall Fertility"], status: "validated", protocol: "Whole foods, healthy fats, limited processed food, glycemic index <55", expectedTimeline: "4-8 weeks for metabolic changes" },
  { id: "i04", name: "Blood Sugar Stabilization Plan", type: "nutrition", evidenceLevel: "strong", pilotResponseRate: 81, recommendedFor: ["PCOS", "Insulin Resistance", "Anovulation"], status: "validated", protocol: "Protein-first meals, fiber pairing, post-meal walks, CGM monitoring", expectedTimeline: "2-4 weeks for fasting insulin improvement" },
  { id: "i05", name: "Methylated Folate (1mg 5-MTHF)", type: "supplement", evidenceLevel: "strong", pilotResponseRate: 88, recommendedFor: ["MTHFR Variants", "Preconception", "Egg Quality"], status: "validated", protocol: "1mg L-methylfolate daily, test MTHFR status first", expectedTimeline: "4 weeks for red cell folate optimization" },
  { id: "i06", name: "Zone 2 Cardio Protocol", type: "lifestyle", evidenceLevel: "moderate", pilotResponseRate: 62, recommendedFor: ["Insulin Resistance", "Stress", "Cycle Regularity"], status: "validated", protocol: "150 min/week at 60-70% max HR, walking or cycling preferred", expectedTimeline: "6-8 weeks for cycle regularity improvement" },
  { id: "i07", name: "Sleep Optimization Protocol", type: "lifestyle", evidenceLevel: "moderate", pilotResponseRate: 58, recommendedFor: ["High Cortisol", "Irregular Cycles", "HRV <50"], status: "in-testing", protocol: "10pm bedtime, blue light block 8pm, cool room, HRV tracking", expectedTimeline: "2-4 weeks for cortisol normalization" },
  { id: "i08", name: "Omega-3 (EPA/DHA 2g/day)", type: "supplement", evidenceLevel: "moderate", pilotResponseRate: 55, recommendedFor: ["Inflammation", "Endometrial Quality", "Egg Quality"], status: "validated", protocol: "2g combined EPA/DHA daily with meals, test Omega-3 index", expectedTimeline: "8-12 weeks for index >8%" },
  { id: "i09", name: "Thyroid Optimization Protocol", type: "medication", evidenceLevel: "strong", pilotResponseRate: 74, recommendedFor: ["TSH >2.5", "Subclinical Hypothyroid", "Unexplained Infertility"], status: "validated", protocol: "Targeted levothyroxine to TSH 1.0-2.0, with physician oversight", expectedTimeline: "4-6 weeks for TSH optimization" },
  { id: "i10", name: "Inositol (Myo + D-Chiro)", type: "supplement", evidenceLevel: "moderate", pilotResponseRate: 68, recommendedFor: ["PCOS", "Insulin Resistance", "Egg Quality"], status: "validated", protocol: "4g myo-inositol + 100mg D-chiro daily, 40:1 ratio", expectedTimeline: "3-6 months for ovulatory improvement" },
  { id: "i11", name: "Stress Reduction (HRV Biofeedback)", type: "lifestyle", evidenceLevel: "emerging", pilotResponseRate: 45, recommendedFor: ["High Stress", "Cortisol Dysregulation", "LH Surge Issues"], status: "in-testing", protocol: "10 min HRV biofeedback 2x daily, coherence training", expectedTimeline: "4-8 weeks for HRV improvement" },
  { id: "i12", name: "NAC (N-Acetyl Cysteine 600mg)", type: "supplement", evidenceLevel: "emerging", pilotResponseRate: 42, recommendedFor: ["PCOS", "Oxidative Stress", "Endometriosis"], status: "in-testing", protocol: "600mg NAC twice daily, away from meals", expectedTimeline: "8-12 weeks for antioxidant effect" },
  { id: "i13", name: "Iron Repletion Protocol", type: "supplement", evidenceLevel: "moderate", pilotResponseRate: 61, recommendedFor: ["Low Ferritin", "Heavy Periods", "Fatigue"], status: "validated", protocol: "Ferrous bisglycinate 25mg every other day with vitamin C", expectedTimeline: "8-12 weeks for ferritin >40" },
  { id: "i14", name: "DIM (Diindolylmethane)", type: "supplement", evidenceLevel: "emerging", pilotResponseRate: 38, recommendedFor: ["Estrogen Dominance", "Slow COMT", "PMS"], status: "proposed", protocol: "150mg DIM daily with meals, monitor estrogen metabolites", expectedTimeline: "4-8 weeks for estrogen balance" },
  { id: "i15", name: "Circadian Rhythm Reset", type: "lifestyle", evidenceLevel: "emerging", pilotResponseRate: 35, recommendedFor: ["Shift Workers", "Jet Lag", "Irregular Cycles"], status: "proposed", protocol: "Morning sunlight 20min, consistent wake time, meal timing alignment", expectedTimeline: "2-4 weeks for melatonin normalization" },
];

const TYPE_CONFIG: Record<InterventionType, { icon: typeof Pill; color: string; label: string }> = {
  nutrition: { icon: Leaf, color: "#1EAA55", label: "Nutrition" },
  supplement: { icon: Pill, color: "#356FB6", label: "Supplement" },
  lifestyle: { icon: Dumbbell, color: "#F1C028", label: "Lifestyle" },
  medication: { icon: Stethoscope, color: "#E24D47", label: "Medication" },
};

function TypeBadge({ type }: { type: InterventionType }) {
  const c = TYPE_CONFIG[type];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ValidationStatus }) {
  const config = {
    validated: { bg: "#1EAA5518", color: "#1EAA55", icon: CheckCircle2, label: "Validated" },
    "in-testing": { bg: "#F1C02818", color: "#F1C028", icon: Clock, label: "In Testing" },
    proposed: { bg: "#9686B918", color: "#9686B9", icon: Lightbulb, label: "Proposed" },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      <Icon size={10} />
      {c.label}
    </span>
  );
}

function ResponseRateBar({ rate }: { rate: number }) {
  const color = rate >= 70 ? "#1EAA55" : rate >= 50 ? "#F1C028" : "#E24D47";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full rounded-full" style={{ width: `${rate}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>{rate}%</span>
    </div>
  );
}

export default function InterventionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<InterventionType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ValidationStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return INTERVENTIONS.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.recommendedFor.some((r) => r.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === "all" || i.type === typeFilter;
      const matchStatus = statusFilter === "all" || i.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const topPerformers = useMemo(() => {
    return [...INTERVENTIONS].sort((a, b) => b.pilotResponseRate - a.pilotResponseRate).slice(0, 5);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Performing Interventions */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
          Top Performing Interventions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {topPerformers.map((int, i) => (
            <div
              key={int.id}
              className="rounded-lg p-3"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold" style={{ color: ACCENT }}>#{i + 1}</span>
                <TypeBadge type={int.type} />
              </div>
              <p className="text-xs font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                {int.name.split("(")[0].trim()}
              </p>
              <p className="text-lg font-bold mt-1" style={{ color: "#1EAA55" }}>
                {int.pilotResponseRate}%
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>response rate</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search interventions or conditions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "nutrition", "supplement", "lifestyle", "medication"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={
                typeFilter === t
                  ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                  : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "validated", "in-testing", "proposed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={
                statusFilter === s
                  ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                  : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {s === "all" ? "All Status" : s === "in-testing" ? "In Testing" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Interventions Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Intervention Validation Tracker
          </h2>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {INTERVENTIONS.filter((i) => i.status === "validated").length} validated / {INTERVENTIONS.length} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Intervention</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Type</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Response</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Recommended For</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((int) => (
                <>
                  <tr
                    key={int.id}
                    className="border-t cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => setExpandedId(expandedId === int.id ? null : int.id)}
                  >
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{int.name}</td>
                    <td className="px-5 py-3"><TypeBadge type={int.type} /></td>
                    <td className="px-5 py-3"><ResponseRateBar rate={int.pilotResponseRate} /></td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {int.recommendedFor.slice(0, 2).map((r) => (
                          <span key={r} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
                            {r}
                          </span>
                        ))}
                        {int.recommendedFor.length > 2 && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>+{int.recommendedFor.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={int.status} /></td>
                  </tr>
                  {expandedId === int.id && (
                    <tr key={`${int.id}-detail`} style={{ backgroundColor: "var(--background)" }}>
                      <td colSpan={5} className="px-5 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Protocol</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{int.protocol}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Timeline</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{int.expectedTimeline}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Recommended For</p>
                            <div className="flex flex-wrap gap-1">
                              {int.recommendedFor.map((r) => (
                                <span key={r} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
                                  {r}
                                </span>
                              ))}
                            </div>
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
