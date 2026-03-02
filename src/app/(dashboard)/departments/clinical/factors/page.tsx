"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

const ACCENT = "#78C3BF";

type Category = "hormonal" | "nutritional" | "lifestyle" | "environmental" | "genetic";
type EvidenceLevel = "strong" | "moderate" | "emerging";

interface FertilityFactor {
  id: string;
  name: string;
  category: Category;
  evidenceLevel: EvidenceLevel;
  dataCoverage: number;
  description: string;
  keyInsight: string;
}

const FERTILITY_FACTORS: FertilityFactor[] = [
  { id: "f01", name: "Progesterone Levels", category: "hormonal", evidenceLevel: "strong", dataCoverage: 92, description: "Post-ovulation progesterone critical for implantation", keyInsight: "Luteal phase progesterone <10ng/mL associated with 40% lower conception rates" },
  { id: "f02", name: "Estradiol (E2)", category: "hormonal", evidenceLevel: "strong", dataCoverage: 88, description: "Primary estrogen driving follicular development", keyInsight: "Optimal E2 rise predicts ovulation timing within 24-48 hours" },
  { id: "f03", name: "LH Surge Pattern", category: "hormonal", evidenceLevel: "strong", dataCoverage: 85, description: "Luteinizing hormone surge triggers ovulation", keyInsight: "Surge duration and amplitude correlate with egg quality markers" },
  { id: "f04", name: "FSH Baseline", category: "hormonal", evidenceLevel: "strong", dataCoverage: 78, description: "Follicle-stimulating hormone indicates ovarian reserve", keyInsight: "Day 3 FSH trending provides 6-month predictive window" },
  { id: "f05", name: "AMH Levels", category: "hormonal", evidenceLevel: "strong", dataCoverage: 65, description: "Anti-Mullerian hormone reflects egg quantity", keyInsight: "AMH + AFC combination is strongest reserve predictor" },
  { id: "f06", name: "Thyroid (TSH/T3/T4)", category: "hormonal", evidenceLevel: "strong", dataCoverage: 72, description: "Thyroid function affects ovulation and implantation", keyInsight: "TSH >2.5 associated with 2x longer time to conception" },
  { id: "f07", name: "Vitamin D", category: "nutritional", evidenceLevel: "strong", dataCoverage: 68, description: "Essential for hormone production and immune regulation", keyInsight: "Levels >40ng/mL associated with 34% higher IVF success rates" },
  { id: "f08", name: "Iron / Ferritin", category: "nutritional", evidenceLevel: "moderate", dataCoverage: 62, description: "Iron stores affect energy and ovulatory function", keyInsight: "Ferritin <40 associated with anovulation in 18% of cases" },
  { id: "f09", name: "Folate (5-MTHF)", category: "nutritional", evidenceLevel: "strong", dataCoverage: 74, description: "Critical for cell division and neural tube development", keyInsight: "Methylated folate 2.5x more bioavailable for MTHFR variants" },
  { id: "f10", name: "Omega-3 Index", category: "nutritional", evidenceLevel: "moderate", dataCoverage: 45, description: "Anti-inflammatory fatty acids support egg quality", keyInsight: "Index >8% correlated with improved embryo morphology" },
  { id: "f11", name: "CoQ10", category: "nutritional", evidenceLevel: "moderate", dataCoverage: 38, description: "Mitochondrial energy for egg maturation", keyInsight: "600mg/day for 60 days shows measurable egg quality improvement" },
  { id: "f12", name: "Zinc", category: "nutritional", evidenceLevel: "moderate", dataCoverage: 42, description: "Essential for hormone synthesis and cell division", keyInsight: "Zinc deficiency found in 35% of unexplained infertility cases" },
  { id: "f13", name: "Basal Body Temperature", category: "lifestyle", evidenceLevel: "strong", dataCoverage: 94, description: "Core temperature pattern reveals ovulation and luteal quality", keyInsight: "AI pattern analysis achieves 96% ovulation detection accuracy" },
  { id: "f14", name: "Sleep Quality (HRV)", category: "lifestyle", evidenceLevel: "moderate", dataCoverage: 56, description: "Sleep affects hormone regulation and stress recovery", keyInsight: "Deep sleep <90min associated with elevated cortisol and irregular cycles" },
  { id: "f15", name: "Exercise Intensity", category: "lifestyle", evidenceLevel: "moderate", dataCoverage: 52, description: "Moderate exercise supports fertility; excessive harms it", keyInsight: "Zone 2 training 150min/week is optimal; >7hrs/week correlates with anovulation" },
  { id: "f16", name: "Stress / Cortisol", category: "lifestyle", evidenceLevel: "moderate", dataCoverage: 48, description: "Chronic stress suppresses GnRH and disrupts ovulation", keyInsight: "HRV-based stress scores predict cycle regularity within 2 cycles" },
  { id: "f17", name: "Body Composition (BMI)", category: "lifestyle", evidenceLevel: "strong", dataCoverage: 82, description: "Body fat percentage influences estrogen metabolism", keyInsight: "BMI 20-24 associated with shortest time to conception across all age groups" },
  { id: "f18", name: "Alcohol Intake", category: "lifestyle", evidenceLevel: "moderate", dataCoverage: 58, description: "Alcohol affects estrogen metabolism and egg quality", keyInsight: ">7 drinks/week associated with 18% reduction in fecundability" },
  { id: "f19", name: "BPA / Phthalate Exposure", category: "environmental", evidenceLevel: "emerging", dataCoverage: 22, description: "Endocrine disruptors affecting hormone signaling", keyInsight: "Urinary BPA levels inversely correlated with AMH in preliminary data" },
  { id: "f20", name: "Heavy Metal Load", category: "environmental", evidenceLevel: "emerging", dataCoverage: 18, description: "Lead, mercury, cadmium interfere with reproductive function", keyInsight: "Hair mineral analysis reveals exposure patterns predictive of cycle disruption" },
  { id: "f21", name: "Air Quality Index", category: "environmental", evidenceLevel: "emerging", dataCoverage: 15, description: "PM2.5 exposure linked to diminished ovarian reserve", keyInsight: "Chronic PM2.5 >25ug/m3 associated with 6% lower AMH per year of exposure" },
  { id: "f22", name: "MTHFR Variants", category: "genetic", evidenceLevel: "moderate", dataCoverage: 32, description: "Methylation pathway gene affecting folate metabolism", keyInsight: "C677T homozygous requires methylated folate supplementation" },
  { id: "f23", name: "COMT Variants", category: "genetic", evidenceLevel: "emerging", dataCoverage: 25, description: "Catechol-O-methyltransferase affects estrogen clearance", keyInsight: "Slow COMT variants may benefit from DIM supplementation" },
  { id: "f24", name: "Blood Sugar / Insulin", category: "hormonal", evidenceLevel: "strong", dataCoverage: 70, description: "Insulin resistance drives anovulation in PCOS", keyInsight: "Fasting insulin >10 predicts PCOS-pattern anovulation with 82% accuracy" },
  { id: "f25", name: "Prolactin", category: "hormonal", evidenceLevel: "moderate", dataCoverage: 55, description: "Elevated prolactin suppresses ovulation", keyInsight: "Subclinical hyperprolactinemia found in 12% of unexplained cases" },
];

const CATEGORIES: { value: Category | "all"; label: string; color: string }[] = [
  { value: "all", label: "All Categories", color: ACCENT },
  { value: "hormonal", label: "Hormonal", color: "#E24D47" },
  { value: "nutritional", label: "Nutritional", color: "#1EAA55" },
  { value: "lifestyle", label: "Lifestyle", color: "#356FB6" },
  { value: "environmental", label: "Environmental", color: "#F1C028" },
  { value: "genetic", label: "Genetic", color: "#9686B9" },
];

function CategoryBadge({ category }: { category: Category }) {
  const cat = CATEGORIES.find((c) => c.value === category);
  const color = cat?.color || ACCENT;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {category}
    </span>
  );
}

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const config = {
    strong: { bg: "#1EAA5518", color: "#1EAA55", label: "Strong" },
    moderate: { bg: "#F1C02818", color: "#F1C028", label: "Moderate" },
    emerging: { bg: "#78C3BF18", color: "#78C3BF", label: "Emerging" },
  };
  const c = config[level];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function CoverageBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? "#1EAA55" : pct >= 40 ? "#F1C028" : "#E24D47";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>{pct}%</span>
    </div>
  );
}

export default function FertilityFactorsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return FERTILITY_FACTORS.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || f.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [search, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FERTILITY_FACTORS.forEach((f) => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
            Fertility Factor Database
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
            {FERTILITY_FACTORS.length} Factors
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            tracked across {Object.keys(categoryCounts).length} categories with evidence grading
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
            <div key={cat.value} className="text-center">
              <p className="text-lg font-bold" style={{ color: cat.color }}>
                {categoryCounts[cat.value] || 0}
              </p>
              <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>
                {cat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search factors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={
                categoryFilter === cat.value
                  ? { backgroundColor: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}40` }
                  : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Factor Grid */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Factor</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Evidence</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Data Coverage</th>
                <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Key Insight</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((factor) => (
                <tr
                  key={factor.id}
                  className="border-t cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setExpandedId(expandedId === factor.id ? null : factor.id)}
                >
                  <td className="px-5 py-3">
                    <p className="font-medium" style={{ color: "var(--foreground)" }}>{factor.name}</p>
                    {expandedId === factor.id && (
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{factor.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3"><CategoryBadge category={factor.category} /></td>
                  <td className="px-5 py-3"><EvidenceBadge level={factor.evidenceLevel} /></td>
                  <td className="px-5 py-3"><CoverageBar pct={factor.dataCoverage} /></td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {factor.keyInsight}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted)" }}>No factors match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Compliance Notice */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4718" }}
      >
        <Filter size={16} style={{ color: "#E24D47" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold" style={{ color: "#E24D47" }}>Compliance Note</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            Factor insights are for internal research use only. All claims derived from this data must pass
            Legal compliance review before external publication. Nothing publishes without compliance scan.
          </p>
        </div>
      </div>
    </div>
  );
}
