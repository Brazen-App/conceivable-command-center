"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Calendar, ArrowRight, Sparkles, MessageSquare, Search } from "lucide-react";

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
  // --- Expanded VC List: FemTech / Digital Health / Women's Health focused ---
  { id: "vc11", firm: "Portfolia FemTech Fund", partner: "Trish Costello", stage: "prospect", checkSize: "$250K-500K", thesisAlignment: "strong", lastContact: "Never", nextAction: "Submit to FemTech fund application", notes: "Dedicated FemTech fund. Perfect thesis alignment." },
  { id: "vc12", firm: "Coyote Ventures", partner: "Health Partner", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Research portfolio for warm intros", notes: "Women's health focused early stage." },
  { id: "vc13", firm: "Avestria Ventures", partner: "Seema Hingorani", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Submit pitch through website", notes: "Invests in women-led companies, health focus." },
  { id: "vc14", firm: "Goddess Gaia Ventures", partner: "Sara Hinkley", stage: "prospect", checkSize: "$250K-500K", thesisAlignment: "strong", lastContact: "Never", nextAction: "Explore shared network connections", notes: "FemTech + wellness thesis. Early stage focus." },
  { id: "vc15", firm: "Astia Fund", partner: "Sharon Vosmek", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Apply through Astia Angels network", notes: "Women-led venture. Healthcare vertical expertise." },
  { id: "vc16", firm: "BBG Ventures", partner: "Nisha Dua", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Cold outreach via portfolio founders", notes: "Consumer health. Backed Maven Clinic, Kindbody." },
  { id: "vc17", firm: "Define Ventures", partner: "Kim Kamdar", stage: "prospect", checkSize: "$2-5M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Warm intro through healthcare network", notes: "Healthcare focused. Partner is former pharma exec." },
  { id: "vc18", firm: "Digitalis Ventures", partner: "Science Partner", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Prepare clinical-evidence-first pitch", notes: "Life science + digital health convergence. Our data story matters here." },
  { id: "vc19", firm: "Flare Capital", partner: "Health IT Lead", stage: "prospect", checkSize: "$2-5M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Position as health data platform", notes: "Health IT focus. Need to emphasize data infrastructure angle." },
  { id: "vc20", firm: "Optum Ventures", partner: "Health Platform", stage: "prospect", checkSize: "$3-10M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit through corporate venture portal", notes: "UHG corporate venture. Distribution potential is massive." },
  { id: "vc21", firm: "7wireVentures", partner: "Digital Health Lead", stage: "prospect", checkSize: "$2-5M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Prepare consumer health pitch", notes: "Consumer digital health thesis. Backed Hims, Livongo." },
  { id: "vc22", firm: "Olive Tree Ventures", partner: "Partner TBD", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Research recent investments for angle", notes: "Women's health and wellness. Early stage." },
  { id: "vc23", firm: "Gaingels", partner: "Health Vertical", stage: "prospect", checkSize: "$250K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit to investment committee", notes: "Diverse founder focused. Syndicate model." },
  { id: "vc24", firm: "Pear VC", partner: "Health Partner", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Cold pitch with product demo", notes: "Pre-seed / seed focus. Need to show product-market fit signals." },
  { id: "vc25", firm: "Initialized Capital", partner: "Consumer Health", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Apply through website", notes: "Garry Tan era. Community-first thesis could align." },
  { id: "vc26", firm: "Lightspeed Venture Partners", partner: "Health Lead", stage: "prospect", checkSize: "$5-15M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Warm intro via healthcare portfolio", notes: "Global reach. Later stage but strategic value." },
  { id: "vc27", firm: "GV (Google Ventures)", partner: "Life Science Partner", stage: "prospect", checkSize: "$5-10M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Position as AI + health data play", notes: "Strong AI thesis. Emphasize AI coaching engine." },
  { id: "vc28", firm: "Obvious Ventures", partner: "Andrew Beebe", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit via impact thesis angle", notes: "World-positive thesis. Women's health as impact." },
  { id: "vc29", firm: "Nextgen Venture Partners", partner: "Digital Health", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Connect through digital health meetups", notes: "Digital health specialists. Pre-seed to Series A." },
  { id: "vc30", firm: "HealthX Ventures", partner: "Managing Partner", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Submit application", notes: "Health innovation accelerator with investment arm." },
  { id: "vc31", firm: "ACME Capital", partner: "Healthcare", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Cold outreach with clinical data", notes: "Consumer-first thesis with healthcare vertical." },
  { id: "vc32", firm: "Headline (prev e.ventures)", partner: "Health Partner", stage: "prospect", checkSize: "$1-5M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Explore European distribution angle", notes: "Global fund. Could help with international expansion." },
  { id: "vc33", firm: "Ulu Ventures", partner: "Miriam Rivera", stage: "prospect", checkSize: "$250K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Apply via founder network", notes: "Diverse founder focus. Seed stage." },
  { id: "vc34", firm: "Sweater Ventures", partner: "Crowd Health", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Explore crowdfunding angle", notes: "Community-funded venture. Unique model." },
  { id: "vc35", firm: "SteelSky Ventures", partner: "Health Lead", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Submit pitch via FemTech network", notes: "FemTech and digital health focus." },
  { id: "vc36", firm: "StartUp Health", partner: "Health Moonshot", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Apply to Health Moonshot program", notes: "Health Moonshot accelerator. Strong network value." },
  { id: "vc37", firm: "Village Global", partner: "Consumer Health", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit through LP network referral", notes: "Backed by Gates, Bezos, Zuckerberg. Signal value." },
  { id: "vc38", firm: "Dorm Room Fund", partner: "Health Vertical", stage: "prospect", checkSize: "$100K-250K", thesisAlignment: "low", lastContact: "Never", nextAction: "Skip -- too early stage and small", notes: "Very early stage. Minimal check size." },
  { id: "vc39", firm: "Correlation Ventures", partner: "Data Partner", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit data-driven pitch", notes: "Data-driven co-investor. Follows other leads." },
  { id: "vc40", firm: "Titan Capital (India)", partner: "Health Tech", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Explore India market expansion angle", notes: "India-focused. Massive fertility market in India." },
  { id: "vc41", firm: "Mindset Ventures", partner: "Health Innovation", stage: "prospect", checkSize: "$500K-2M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit via cross-border health fund", notes: "Israel-US cross-border. Strong health tech network." },
  { id: "vc42", firm: "Blue Venture Fund", partner: "Managing Director", stage: "prospect", checkSize: "$250K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Apply through university network", notes: "Underrepresented founder focus." },
  { id: "vc43", firm: "Unshackled Ventures", partner: "Health Partner", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Explore via founder community", notes: "Immigrant-founded company support." },
  { id: "vc44", firm: "Techstars Health", partner: "Managing Director", stage: "prospect", checkSize: "$120K + follow-on", thesisAlignment: "strong", lastContact: "Never", nextAction: "Apply to next cohort", notes: "Accelerator with strong health network and follow-on funding." },
  { id: "vc45", firm: "Y Combinator", partner: "Healthcare Group", stage: "prospect", checkSize: "$500K + follow-on", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Apply to next batch with clinical data story", notes: "Top accelerator. Biotech/health group expanding." },
  { id: "vc46", firm: "Plug and Play Health", partner: "Health Platform Lead", stage: "prospect", checkSize: "$250K-500K", thesisAlignment: "strong", lastContact: "Never", nextAction: "Apply to health vertical program", notes: "Corporate partnerships + investment. Strong pharma/payer network." },
  { id: "vc47", firm: "HAX (SOSV)", partner: "Health Hardware", stage: "prospect", checkSize: "$250K-1M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Position Halo Ring as hardware play", notes: "Hardware accelerator. Halo Ring angle." },
  { id: "vc48", firm: "IndieBio (SOSV)", partner: "Biology Partner", stage: "prospect", checkSize: "$500K-1M", thesisAlignment: "strong", lastContact: "Never", nextAction: "Apply with biomarker platform thesis", notes: "Biology + tech accelerator. Clinical data is differentiator." },
  { id: "vc49", firm: "Maverick Ventures", partner: "Consumer Health", stage: "prospect", checkSize: "$1-3M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Cold outreach via portfolio", notes: "Consumer health. Backed several DTC health brands." },
  { id: "vc50", firm: "CRCM Ventures", partner: "Health Innovation", stage: "prospect", checkSize: "$1-5M", thesisAlignment: "moderate", lastContact: "Never", nextAction: "Submit through digital health network", notes: "Health innovation fund. Strong clinical validation thesis." },
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
                        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: "#5A6FFF" }}
                          >
                            <Sparkles size={11} />
                            Joy: Research Firm
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}
                          >
                            <MessageSquare size={11} />
                            Joy: Draft Outreach
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                          >
                            <Search size={11} />
                            Find Warm Intro
                          </button>
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
