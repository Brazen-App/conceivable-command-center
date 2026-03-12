"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  Sparkles,
  Palette,
  Code2,
  MessageSquare,
  LayoutList,
  FileText,
  ChevronDown,
  Shield,
  AlertTriangle,
  Wrench,
  BookOpen,
  Table2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { PREGNANCY_IP_COVERAGE } from "@/lib/data/pregnancy-features-data";
import { POSTPARTUM_IP_COVERAGE, POSTPARTUM_CARE_TEAM } from "@/lib/data/postpartum-features-data";

/* ─── Types ─── */
interface Experience {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  accentColor: string;
  status: string;
  description: string | null;
  targetPersona: string | null;
}

interface Feature {
  id: string;
  name: string;
  description: string | null;
  userStory: string | null;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[] | null;
  uxSpec: string | null;
  generatedCode: string | null;
  notes: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

/* ─── Constants ─── */
const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  must_have: { bg: "#E24D4718", text: "#E24D47" },
  should_have: { bg: "#F59E0B18", text: "#F59E0B" },
  nice_to_have: { bg: "#1EAA5518", text: "#1EAA55" },
};

const PRIORITY_LABELS: Record<string, string> = {
  must_have: "Must Have",
  should_have: "Should Have",
  nice_to_have: "Nice to Have",
};

const COMPLEXITY_LABELS: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "#888" },
  designing: { label: "Designing", color: "#F59E0B" },
  wireframed: { label: "Wireframed", color: "#ACB7FF" },
  coded: { label: "Coded", color: "#5A6FFF" },
  shipped: { label: "Shipped", color: "#1EAA55" },
};

const BASE_TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "features", label: "Features", icon: LayoutList },
  { id: "coach", label: "Product Coach", icon: MessageSquare },
  { id: "ux", label: "UX Design", icon: Palette },
  { id: "code", label: "Code Gen", icon: Code2 },
  { id: "ip", label: "IP Coverage", icon: Shield },
];

const PREGNANCY_TABS = [
  ...BASE_TABS.slice(0, 3),
  { id: "dev-workspaces", label: "Dev Workspaces", icon: Wrench },
  ...BASE_TABS.slice(3),
];

const POSTPARTUM_TABS = [
  ...BASE_TABS,
];

export default function ExperienceWorkspace() {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Load experience and features
  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch("/api/product/experiences").then((r) => r.json()),
      // features loaded after we have experience id
    ]).then(([exps]) => {
      const exp = (exps as Experience[]).find(
        (e: Experience) => e.slug === slug
      );
      if (exp) {
        setExperience(exp);
        fetch(`/api/product/features?experienceId=${exp.id}`)
          .then((r) => r.json())
          .then((f) => setFeatures(f))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--muted)" }}>Experience not found</p>
        <Link
          href="/departments/product/experiences"
          className="text-sm mt-2 inline-block"
          style={{ color: "var(--brand-primary)" }}
        >
          Back to Experiences
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Workspace Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/departments/product/experiences"
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${experience.accentColor}18` }}
        >
          {getIcon(slug)}
        </div>
        <div className="flex-1">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            {experience.name}
          </h2>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {experience.tagline}
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${experience.accentColor}18`,
            color: experience.accentColor,
          }}
        >
          {features.length} features
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {(slug === "pregnancy" ? PREGNANCY_TABS : slug === "postpartum" ? POSTPARTUM_TABS : BASE_TABS).map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: experience.accentColor }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab experience={experience} features={features} onUpdate={setExperience} />
      )}
      {activeTab === "features" && (
        <FeaturesTab experience={experience} features={features} onUpdate={setFeatures} />
      )}
      {activeTab === "coach" && (
        <CoachTab experience={experience} conversationType="product-coach" />
      )}
      {activeTab === "ux" && (
        <SplitPanelTab
          experience={experience}
          features={features}
          conversationType="ux_design"
          panelType="ux"
        />
      )}
      {activeTab === "code" && (
        <SplitPanelTab
          experience={experience}
          features={features}
          conversationType="code_gen"
          panelType="code"
        />
      )}
      {activeTab === "dev-workspaces" && slug === "pregnancy" && (
        <DevWorkspacesTab experience={experience} features={features} />
      )}
      {activeTab === "ip" && (
        <IPCoverageTab experience={experience} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW TAB
   ───────────────────────────────────────────── */
function OverviewTab({
  experience,
  features,
  onUpdate,
}: {
  experience: Experience;
  features: Feature[];
  onUpdate: (e: Experience) => void;
}) {
  const [description, setDescription] = useState(experience.description || "");
  const [persona, setPersona] = useState(experience.targetPersona || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/product/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: experience.id, description, targetPersona: persona }),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate({ ...experience, ...updated });
    }
    setSaving(false);
  };

  const mustHave = features.filter((f) => f.priority === "must_have").length;
  const shouldHave = features.filter((f) => f.priority === "should_have").length;
  const niceToHave = features.filter((f) => f.priority === "nice_to_have").length;

  const isPregnancy = experience.slug === "pregnancy";
  const isPostpartum = experience.slug === "postpartum";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
              Experience Description
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this experience... Who is she? What's happening in her life? What has failed her before?"
              className="w-full h-32 px-4 py-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
              Target Persona
            </h3>
            <textarea
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Who is this woman? Age range, life stage, emotions, frustrations, hopes..."
              className="w-full h-32 px-4 py-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: experience.accentColor }}
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </div>

        {/* Right Column — Stats */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h4 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
              Feature Breakdown
            </h4>
            <div className="space-y-3">
              <StatRow label="Must Have" count={mustHave} color="#E24D47" />
              <StatRow label="Should Have" count={shouldHave} color="#F59E0B" />
              <StatRow label="Nice to Have" count={niceToHave} color="#1EAA55" />
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h4 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
              Status Progress
            </h4>
            <div className="space-y-3">
              {Object.entries(STATUS_LABELS).map(([key, val]) => {
                const count = features.filter((f) => f.status === key).length;
                return <StatRow key={key} label={val.label} count={count} color={val.color} />;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lifecycle Cross-Links */}
      {(isPregnancy || isPostpartum) && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--foreground)" }}>
            Lifecycle Flow
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { name: "Fertility", slug: "fertility", color: "#5A6FFF", icon: "\u2728" },
              { name: "Pregnancy", slug: "pregnancy", color: "#D4A843", icon: "\u{1F31F}" },
              { name: "Postpartum", slug: "postpartum", color: "#7CAE7A", icon: "\u{1F343}" },
              { name: "Fertility / Wellness", slug: "fertility", color: "#5A6FFF", icon: "\u2728", label: "Return to Fertility" },
            ].map((stage, i) => {
              const isCurrent = stage.slug === experience.slug && !stage.label;
              return (
                <div key={`${stage.slug}-${i}`} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className="text-xs" style={{ color: "var(--muted)" }}>&rarr;</div>
                  )}
                  <Link
                    href={`/departments/product/experiences/${stage.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: isCurrent ? `${stage.color}18` : "var(--background)",
                      border: isCurrent ? `2px solid ${stage.color}40` : "1px solid var(--border)",
                      color: isCurrent ? stage.color : "var(--foreground)",
                    }}
                  >
                    <span>{stage.icon}</span>
                    {stage.label || stage.name}
                    {isCurrent && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${stage.color}18`, color: stage.color }}>
                        Current
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] mt-3" style={{ color: "var(--muted)" }}>
            The Conceivable lifecycle is continuous. Data flows forward — pregnancy data informs postpartum recovery, postpartum data optimizes future fertility. She never starts from scratch.
          </p>
        </div>
      )}

      {/* Postpartum Care Team */}
      {isPostpartum && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7CAE7A" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Postpartum Care Team
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {POSTPARTUM_CARE_TEAM.map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--background)",
                  border: agent.name === "Luna" ? `2px solid ${agent.color}40` : "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {agent.name}
                    </p>
                    <p className="text-[10px]" style={{ color: agent.color }}>
                      {agent.role}
                    </p>
                  </div>
                  {agent.name === "Luna" && (
                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: "#7CAE7A14", color: "#7CAE7A" }}>
                      New
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Postpartum 4-Phase Journey Timeline */}
      {isPostpartum && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7CAE7A" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              The Four Phases of Postpartum
            </h3>
          </div>
          <div className="relative">
            <div className="absolute left-[19px] top-8 bottom-4 w-px" style={{ backgroundColor: "#7CAE7A30" }} />
            <div className="space-y-4">
              {[
                {
                  phase: "Acute Recovery",
                  timeline: "Weeks 0-2",
                  description: "Immediate postpartum. Bleeding monitoring, vital sign stabilization, pain management, breastfeeding initiation, PPD/baby blues differentiation, sleep architecture baseline.",
                  focus: "Safety & stabilization. Atlas and Luna are primary. Seren watches closely.",
                  color: "#E24D47",
                },
                {
                  phase: "Early Recovery",
                  timeline: "Weeks 2-6",
                  description: "Physical healing, breastfeeding establishment, hormone adjustment, identity transition, relationship recalibration. The 6-week checkup preparation.",
                  focus: "Healing & adjustment. All agents active. Recovery trajectory tracking begins.",
                  color: "#F59E0B",
                },
                {
                  phase: "Restoration",
                  timeline: "Weeks 6-12",
                  description: "Return to activity, pelvic floor rehabilitation, energy rebuilding, sleep optimization (within newborn reality), nutrition optimization for sustained recovery.",
                  focus: "Rebuilding. Kai and Olive lead. Physical recovery milestones.",
                  color: "#5A6FFF",
                },
                {
                  phase: "Optimization",
                  timeline: "Months 3-12+",
                  description: "Return to baseline, hormonal normalization, cycle return monitoring, fertility preservation for future pregnancies, long-term mental health stability, identity integration.",
                  focus: "Thriving. Atlas monitors for return-to-baseline. Transition to Fertility when ready.",
                  color: "#1EAA55",
                },
              ].map((p, i) => (
                <div key={p.phase} className="flex gap-4 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold z-10"
                      style={{ backgroundColor: i === 0 ? "#7CAE7A" : "#7CAE7A18", color: i === 0 ? "white" : "#7CAE7A" }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div
                    className="flex-1 rounded-xl p-4"
                    style={{
                      backgroundColor: "var(--background)",
                      border: i === 0 ? "1px solid #7CAE7A40" : "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        {p.phase}
                      </h4>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${p.color}14`, color: p.color }}
                      >
                        {p.timeline}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                      {p.description}
                    </p>
                    <p className="text-[10px] mt-2" style={{ color: "#7CAE7A" }}>
                      <strong>Focus:</strong> {p.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pregnancy: Postpartum Preparation Timeline (Task 3) */}
      {isPregnancy && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7CAE7A" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Postpartum Preparation Timeline
            </h3>
            <Link
              href="/departments/product/experiences/postpartum"
              className="flex items-center gap-1 text-[10px] font-medium ml-auto"
              style={{ color: "#7CAE7A" }}
            >
              <ExternalLink size={10} />
              Postpartum Experience
            </Link>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
            Postpartum preparation begins during pregnancy. The system starts building her postpartum support plan weeks before delivery.
          </p>
          <div className="space-y-3">
            {[
              {
                week: "Week 28",
                title: "Support Network Assessment",
                description: "System surveys available support: partner, family, friends, postpartum doula, lactation consultant. Begins mapping Food Train potential participants. Identifies gaps in support network.",
              },
              {
                week: "Week 30",
                title: "Postpartum Nutrition Pre-Planning",
                description: "Olive begins generating postpartum meal plans based on delivery type preferences, breastfeeding intentions, dietary restrictions. Freezer meal recommendations begin. Navi plans postpartum supplement transition.",
              },
              {
                week: "Week 32",
                title: "Recovery Baseline Capture",
                description: "Atlas captures comprehensive biometric baseline for postpartum recovery comparison. Current fitness level, HRV baseline, sleep architecture, resting heart rate. This data powers personalized recovery trajectory after delivery.",
              },
              {
                week: "Week 34",
                title: "Mental Health Baseline & Education",
                description: "Seren establishes pre-delivery mental health baseline. Edinburgh Postnatal Depression Scale pre-birth score. Education about baby blues vs PPD. Partner education about warning signs to watch for.",
              },
              {
                week: "Week 36+",
                title: "Luna Introduction & Birth Prep",
                description: "Luna activates with breastfeeding education, latch preparation, feeding plan discussion. Birth preferences finalized. Hospital bag nutrition pack from Olive. System ready for immediate postpartum transition.",
              },
            ].map((item) => (
              <div
                key={item.week}
                className="flex gap-4 items-start"
              >
                <div className="shrink-0 w-16 text-right">
                  <span className="text-xs font-bold" style={{ color: "#7CAE7A" }}>
                    {item.week}
                  </span>
                </div>
                <div className="w-px h-full min-h-[40px] self-stretch" style={{ backgroundColor: "#7CAE7A30" }} />
                <div
                  className="flex-1 rounded-lg p-3"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Roadmap — Pregnancy Only */}
      {isPregnancy && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Implementation Roadmap
            </h3>
            <Link
              href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
              className="flex items-center gap-1 text-[10px] font-medium ml-auto"
              style={{ color: "#D4A843" }}
            >
              <ExternalLink size={10} />
              Full Spec
            </Link>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-[19px] top-8 bottom-4 w-px"
              style={{ backgroundColor: "#D4A84330" }}
            />

            <div className="space-y-4">
              {[
                {
                  phase: "Phase 1",
                  title: "Core Scoring Engine",
                  timeline: "4-6 weeks",
                  status: "ready",
                  statusLabel: "Ready for Dev",
                  description: "Tier 1 factor scoring (5 factors), composite calculation, basic Kai messaging, score change detection, daily snapshots",
                  deps: "Halo Ring integration, user profile schema",
                },
                {
                  phase: "Phase 2",
                  title: "Monitoring & Escalation",
                  timeline: "3-4 weeks",
                  status: "spec",
                  statusLabel: "Spec Complete",
                  description: "Monitoring frequency calibration, Tier 3 modifier system, 3-level escalation protocol (L1/L2/L3), safety triggers, care team routing",
                  deps: "Phase 1, care team routing, clinical history intake",
                },
                {
                  phase: "Phase 3",
                  title: "OB Bridge Reports",
                  timeline: "2-3 weeks",
                  status: "spec",
                  statusLabel: "Spec Complete",
                  description: "Report generation engine, PDF export, appointment calendar sync, auto-generation 24hrs before OB visits, AI-generated discussion topics",
                  deps: "Phase 1 + 2, PDF library, calendar integration",
                },
                {
                  phase: "Phase 4",
                  title: "Trimester Adaptation",
                  timeline: "2-3 weeks",
                  status: "spec",
                  statusLabel: "Spec Complete",
                  description: "Dynamic threshold adjustment by gestational age, trimester transition protocols, trimester-specific messaging, pre-labor mode (week 36+)",
                  deps: "Phase 1, gestational age tracking",
                },
                {
                  phase: "Phase 5",
                  title: "Population Learning",
                  timeline: "Ongoing",
                  status: "design",
                  statusLabel: "Design Phase",
                  description: "Cross-user pattern analysis, threshold optimization from outcomes, intervention effectiveness scoring, predictive model refinement",
                  deps: "Phases 1-4 in production with user data",
                },
              ].map((p, i) => {
                const statusColors: Record<string, { bg: string; text: string }> = {
                  ready: { bg: "#1EAA5514", text: "#1EAA55" },
                  spec: { bg: "#5A6FFF14", text: "#5A6FFF" },
                  design: { bg: "#F59E0B14", text: "#F59E0B" },
                };
                const sc = statusColors[p.status];
                return (
                  <div key={p.phase} className="flex gap-4 relative">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold z-10"
                        style={{ backgroundColor: i === 0 ? "#D4A843" : "#D4A84318", color: i === 0 ? "white" : "#D4A843" }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    {/* Content */}
                    <div
                      className="flex-1 rounded-xl p-4"
                      style={{
                        backgroundColor: "var(--background)",
                        border: i === 0 ? "1px solid #D4A84340" : "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {p.title}
                        </h4>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {p.statusLabel}
                        </span>
                        <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
                          {p.timeline}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                        {p.description}
                      </p>
                      <p className="text-[10px] mt-2" style={{ color: "#D4A843" }}>
                        <strong>Deps:</strong> {p.deps}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total Duration", value: "14-19 wks", color: "#D4A843" },
              { label: "Ready for Dev", value: "1 phase", color: "#1EAA55" },
              { label: "Spec Complete", value: "3 phases", color: "#5A6FFF" },
              { label: "In Design", value: "1 phase", color: "#F59E0B" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: `${stat.color}08` }}
              >
                <p className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-4">
            <Link
              href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#D4A843" }}
            >
              View Full Scoring Spec →
            </Link>
            <Link
              href="/departments/engineering/kanban"
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#5A6FFF" }}
            >
              Engineering Kanban →
            </Link>
          </div>
        </div>
      )}

      {/* Implementation Roadmap — Postpartum */}
      {isPostpartum && (
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7CAE7A" }} />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Implementation Roadmap
            </h3>
            <Link
              href="/departments/engineering/kanban"
              className="flex items-center gap-1 text-[10px] font-medium ml-auto"
              style={{ color: "#7CAE7A" }}
            >
              <ExternalLink size={10} />
              Engineering Kanban
            </Link>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[19px] top-8 bottom-4 w-px" style={{ backgroundColor: "#7CAE7A30" }} />
            <div className="space-y-4">
              {[
                {
                  phase: "Phase 1",
                  title: "Foundation — Recovery Engine",
                  timeline: "6-8 weeks",
                  status: "spec",
                  statusLabel: "Spec In Progress",
                  description: "Recovery scoring engine, PPD detection algorithm, vital sign monitoring, postpartum-adapted Conceivable Score, delivery intake, recovery trajectory baseline",
                  deps: "Pregnancy data pipeline, delivery type schema, Luna agent shell",
                },
                {
                  phase: "Phase 2",
                  title: "Intelligence — Care Team Expansion",
                  timeline: "4-6 weeks",
                  status: "design",
                  statusLabel: "Design Phase",
                  description: "Luna agent full deployment, lactation intelligence system, postpartum nutrition engine, pelvic floor protocol, Seren escalation protocol with 3-level crisis response",
                  deps: "Phase 1, Luna agent engine, Seren upgrade, clinical script review",
                },
                {
                  phase: "Phase 3",
                  title: "Community — Support Systems",
                  timeline: "3-4 weeks",
                  status: "design",
                  statusLabel: "Design Phase",
                  description: "Food Train community meal coordination, voice-first input system, partner dashboard expansion, support network features",
                  deps: "Phase 2, invitation system, voice processing pipeline",
                },
                {
                  phase: "Phase 4",
                  title: "Lifecycle — Future Fertility",
                  timeline: "2-3 weeks",
                  status: "design",
                  statusLabel: "Design Phase",
                  description: "Return-to-fertility monitoring, secondary infertility prevention, seamless transition back to Fertility experience with full data continuity",
                  deps: "Phases 1-3, Fertility experience integration",
                },
              ].map((p, i) => {
                const statusColors: Record<string, { bg: string; text: string }> = {
                  spec: { bg: "#5A6FFF14", text: "#5A6FFF" },
                  design: { bg: "#F59E0B14", text: "#F59E0B" },
                };
                const sc = statusColors[p.status];
                return (
                  <div key={p.phase} className="flex gap-4 relative">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold z-10"
                        style={{ backgroundColor: i === 0 ? "#7CAE7A" : "#7CAE7A18", color: i === 0 ? "white" : "#7CAE7A" }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div
                      className="flex-1 rounded-xl p-4"
                      style={{
                        backgroundColor: "var(--background)",
                        border: i === 0 ? "1px solid #7CAE7A40" : "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {p.title}
                        </h4>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {p.statusLabel}
                        </span>
                        <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
                          {p.timeline}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                        {p.description}
                      </p>
                      <p className="text-[10px] mt-2" style={{ color: "#7CAE7A" }}>
                        <strong>Deps:</strong> {p.deps}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { label: "Total Duration", value: "15-21 wks", color: "#7CAE7A" },
              { label: "Spec In Progress", value: "1 phase", color: "#5A6FFF" },
              { label: "In Design", value: "3 phases", color: "#F59E0B" },
              { label: "New Agent", value: "Luna", color: "#7CAE7A" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: `${stat.color}08` }}
              >
                <p className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-4">
            <Link
              href="/departments/engineering/kanban"
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#7CAE7A" }}
            >
              Engineering Kanban →
            </Link>
            <Link
              href="/departments/legal/patent-drafts/patent-012"
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#E24D47" }}
            >
              PPD Detection Patent →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm" style={{ color: "var(--foreground)" }}>{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{count}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURES TAB
   ───────────────────────────────────────────── */
function FeaturesTab({
  experience,
  features,
  onUpdate,
}: {
  experience: Experience;
  features: Feature[];
  onUpdate: (f: Feature[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("should_have");
  const [newComplexity, setNewComplexity] = useState("medium");
  const [adding, setAdding] = useState(false);

  const addFeature = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/product/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId: experience.id,
        name: newName,
        description: newDesc,
        priority: newPriority,
        complexity: newComplexity,
      }),
    });
    if (res.ok) {
      const feature = await res.json();
      onUpdate([...features, feature]);
      setNewName("");
      setNewDesc("");
      setShowAdd(false);
    }
    setAdding(false);
  };

  const deleteFeature = async (id: string) => {
    const res = await fetch("/api/product/features", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onUpdate(features.filter((f) => f.id !== id));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/product/features", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      onUpdate(features.map((f) => (f.id === id ? { ...f, status } : f)));
    }
  };

  // Spec section links per feature name
  const SPEC_LINKS: Record<string, { sections: string[]; label: string }> = {
    "Pregnancy Wellness Score": { sections: ["3", "4", "10"], label: "Scoring Engine, Composite Formula, Trimester Adjustments" },
    "Continuous Gestational Diabetes Screening": { sections: ["3", "5", "8"], label: "Blood Sugar Factor, Messaging, Escalation" },
    "First Trimester Guardian": { sections: ["3", "5", "10"], label: "Temperature Factor, Messaging, First Trimester Adjustments" },
    "OB Bridge Reports": { sections: ["7"], label: "OB Bridge Report Format" },
    "Preeclampsia Early Warning": { sections: ["3", "8"], label: "Blood Pressure (Tier 2), Escalation" },
    "Perinatal Mental Health Monitor": { sections: ["3", "6", "8"], label: "Stress & Recovery, Monitoring Frequency, Escalation" },
  };

  return (
    <div>
      {/* Scoring Spec Banner — Pregnancy */}
      {experience.slug === "pregnancy" && (
        <Link
          href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
          className="flex items-center gap-4 rounded-xl p-4 mb-4 group hover:shadow-sm transition-all"
          style={{
            backgroundColor: "#D4A84308",
            border: "1px solid #D4A84330",
          }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#D4A84318" }}>
            <FileText size={18} style={{ color: "#D4A843" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Scoring Specification Available
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              The complete Pregnancy Wellness Profile technical spec is ready for development. Includes scoring algorithm, messaging framework, escalation protocols, database schema, and FDA compliance checklist.
            </p>
          </div>
          <span
            className="px-4 py-2 rounded-lg text-xs font-medium shrink-0 group-hover:shadow-sm"
            style={{ backgroundColor: "#D4A843", color: "white" }}
          >
            View Full Spec
          </span>
        </Link>
      )}

      {/* Spec Banner — Postpartum */}
      {experience.slug === "postpartum" && (
        <Link
          href="/departments/product/experiences/postpartum/spec"
          className="flex items-center gap-4 rounded-xl p-4 mb-4 group hover:shadow-sm transition-all"
          style={{
            backgroundColor: "#7CAE7A08",
            border: "1px solid #7CAE7A30",
          }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#7CAE7A18" }}>
            <FileText size={18} style={{ color: "#7CAE7A" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Postpartum Specification — In Design
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Recovery scoring architecture, PPD detection system, care team expansion (Luna), escalation protocols. Structural framework ready — full content being finalized.
            </p>
          </div>
          <span
            className="px-4 py-2 rounded-lg text-xs font-medium shrink-0 group-hover:shadow-sm"
            style={{ backgroundColor: "#7CAE7A", color: "white" }}
          >
            View Spec
          </span>
        </Link>
      )}

      {/* Add Feature Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {features.length} feature{features.length !== 1 ? "s" : ""} defined
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ backgroundColor: experience.accentColor }}
        >
          <Plus size={14} />
          Add Feature
        </button>
      </div>

      {/* Add Feature Form */}
      {showAdd && (
        <div
          className="rounded-xl p-5 mb-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Feature name..."
            className="w-full px-4 py-2.5 rounded-lg border text-sm mb-3 focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description..."
            className="w-full px-4 py-2.5 rounded-lg border text-sm mb-3 resize-none h-20 focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
          <div className="flex gap-3 items-center">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <option value="must_have">Must Have</option>
              <option value="should_have">Should Have</option>
              <option value="nice_to_have">Nice to Have</option>
            </select>
            <select
              value={newComplexity}
              onChange={(e) => setNewComplexity(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <div className="flex-1" />
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
            <button
              onClick={addFeature}
              disabled={adding || !newName.trim()}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: experience.accentColor }}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      {features.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Sparkles size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No features yet. Use the Product Coach to brainstorm, or add them manually.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {features.map((feature) => {
            const prio = PRIORITY_COLORS[feature.priority] || PRIORITY_COLORS.should_have;
            const statusInfo = STATUS_LABELS[feature.status] || STATUS_LABELS.idea;
            return (
              <div
                key={feature.id}
                className="rounded-xl p-4 flex items-start gap-4 group"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {feature.name}
                    </h4>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: prio.bg, color: prio.text }}
                    >
                      {PRIORITY_LABELS[feature.priority]}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{ backgroundColor: "var(--border-light)", color: "var(--muted)" }}
                    >
                      {COMPLEXITY_LABELS[feature.complexity] || "M"}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {feature.description}
                    </p>
                  )}
                  {feature.userStory && (
                    <p className="text-xs mt-1 italic" style={{ color: "var(--muted)" }}>
                      &ldquo;{feature.userStory}&rdquo;
                    </p>
                  )}
                  {experience.slug === "pregnancy" && SPEC_LINKS[feature.name] && (
                    <Link
                      href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
                      className="flex items-center gap-1.5 mt-2 text-[10px] font-medium"
                      style={{ color: "#D4A843" }}
                    >
                      <FileText size={10} />
                      Spec: {SPEC_LINKS[feature.name].label}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select
                      value={feature.status}
                      onChange={(e) => updateStatus(feature.id, e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium border cursor-pointer"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                        color: statusInfo.color,
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--muted)" }}
                    />
                  </div>
                  <button
                    onClick={() => deleteFeature(feature.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    style={{ color: "#E24D47" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COACH CHAT TAB
   ───────────────────────────────────────────── */
function CoachTab({
  experience,
  conversationType,
}: {
  experience: Experience;
  conversationType: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history
  useEffect(() => {
    fetch(
      `/api/product/coach?experienceSlug=${experience.slug}&conversationType=${conversationType}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages);
          setSessionId(data.sessionId);
        }
        setHistoryLoaded(true);
      })
      .catch(() => setHistoryLoaded(true));
  }, [experience.slug, conversationType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceName: experience.name,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        if (data.sessionId) setSessionId(data.sessionId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!historyLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={20} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        height: "calc(100vh - 340px)",
        minHeight: "400px",
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={32} className="mb-3" style={{ color: experience.accentColor }} />
            <h3 className="font-medium mb-1" style={{ color: "var(--foreground)" }}>
              Product Coach
            </h3>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
              I&apos;m here to help you design the {experience.name} experience. Ask me
              anything — feature ideas, user flows, personas, or strategy.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                `Who is the woman using ${experience.name}?`,
                "What are the must-have features?",
                "Design the onboarding flow",
                "What would make her tell every friend?",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-full border hover:shadow-sm"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${experience.accentColor}18` }}
                  >
                    <Bot size={14} style={{ color: experience.accentColor }} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === "user" ? "text-white" : ""}`}
                  style={{
                    backgroundColor:
                      msg.role === "user" ? experience.accentColor : "var(--background)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--border-light)" }}
                  >
                    <User size={14} style={{ color: "var(--muted)" }} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${experience.accentColor}18` }}
                >
                  <Bot size={14} style={{ color: experience.accentColor }} />
                </div>
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-3 max-w-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Ask about ${experience.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50"
            style={{ backgroundColor: experience.accentColor }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPLIT PANEL TAB (UX Design + Code Gen)
   ───────────────────────────────────────────── */
function SplitPanelTab({
  experience,
  features,
  conversationType,
  panelType,
}: {
  experience: Experience;
  features: Feature[];
  conversationType: string;
  panelType: "ux" | "code";
}) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [canvasContent, setCanvasContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation when feature changes
  const loadConversation = useCallback(async (feature: Feature | null) => {
    if (!feature) return;
    setMessages([]);
    setCanvasContent(
      panelType === "ux" ? feature.uxSpec || "" : feature.generatedCode || ""
    );

    try {
      const res = await fetch(
        `/api/product/coach?experienceSlug=${experience.slug}&conversationType=${conversationType}`
      );
      const data = await res.json();
      if (data.messages?.length) {
        setMessages(data.messages);
        setSessionId(data.sessionId);
      }
    } catch {
      // silently fail
    }
  }, [experience.slug, conversationType, panelType]);

  useEffect(() => {
    if (selectedFeature) loadConversation(selectedFeature);
  }, [selectedFeature, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceName: experience.name,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationType,
          featureName: selectedFeature?.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const assistantMsg: ChatMessage = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMsg]);
        setCanvasContent(data.response);
        if (data.sessionId) setSessionId(data.sessionId);

        // Auto-save to feature
        if (selectedFeature) {
          const field = panelType === "ux" ? "uxSpec" : "generatedCode";
          await fetch("/api/product/features", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedFeature.id, [field]: data.response }),
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isUx = panelType === "ux";

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        height: "calc(100vh - 340px)",
        minHeight: "500px",
      }}
    >
      {/* LEFT — Chat Panel */}
      <div
        className="flex flex-col border-r"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        {/* Feature selector */}
        <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
          <select
            value={selectedFeature?.id || ""}
            onChange={(e) => {
              const f = features.find((f) => f.id === e.target.value) || null;
              setSelectedFeature(f);
            }}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <option value="">Select a feature...</option>
            {features.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedFeature ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Select a feature to start {isUx ? "designing" : "coding"}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {isUx ? (
                <Palette size={28} className="mb-2" style={{ color: experience.accentColor }} />
              ) : (
                <Code2 size={28} className="mb-2" style={{ color: experience.accentColor }} />
              )}
              <p className="text-sm mb-2" style={{ color: "var(--foreground)" }}>
                {isUx ? "UX Design" : "Code Generation"} — {selectedFeature.name}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {isUx
                  ? "Describe the user flow, screens, and interactions"
                  : "Generate React components with Tailwind styling"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${experience.accentColor}18` }}
                    >
                      <Bot size={12} style={{ color: experience.accentColor }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === "user" ? "text-white" : ""}`}
                    style={{
                      backgroundColor:
                        msg.role === "user" ? experience.accentColor : "var(--background)",
                      border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${experience.accentColor}18` }}
                  >
                    <Bot size={12} style={{ color: experience.accentColor }} />
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--border)" }}>
                    <Loader2 size={12} className="animate-spin" style={{ color: "var(--muted)" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {selectedFeature && (
          <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={isUx ? "Describe the flow..." : "What should this component do?"}
                className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: experience.accentColor }}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Canvas/Preview Panel */}
      <div className="flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        <div
          className="px-4 py-3 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          {isUx ? <Palette size={14} /> : <Code2 size={14} />}
          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            {isUx ? "UX Specification" : "Generated Code"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {canvasContent ? (
            <div
              className={`text-sm whitespace-pre-wrap leading-relaxed ${
                isUx ? "" : "font-mono text-xs"
              }`}
              style={{ color: "var(--foreground)" }}
            >
              {canvasContent}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "var(--border-light)" }}
              >
                {isUx ? (
                  <Palette size={24} style={{ color: "var(--muted)" }} />
                ) : (
                  <Code2 size={24} style={{ color: "var(--muted)" }} />
                )}
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {isUx
                  ? "UX specs will appear here as you design"
                  : "Generated code will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEV WORKSPACES TAB (Pregnancy Only)
   ───────────────────────────────────────────── */

// Scorable features with their spec section mappings and inline data
const SCORABLE_FEATURES = [
  {
    key: "wellness-score",
    name: "Pregnancy Wellness Score",
    specSections: ["3", "4", "10"],
    specLabel: "Scoring Engine, Composite Formula, Trimester Adjustments",
    specData: {
      title: "Pregnancy Wellness Score — Spec Reference",
      tables: [
        {
          title: "Tier 1 — Modifiable Factors (60% of composite)",
          headers: ["Factor", "Source", "Weight in Tier 1"],
          rows: [
            ["Blood Sugar Balance", "Halo Ring continuous glucose", "25% (highest — most actionable, OR 1.5-2.0)"],
            ["Nutritional Foundation", "Meal logging + supplement compliance", "20%"],
            ["Stress & Recovery", "HRV + sleep + self-reported mood", "20%"],
            ["Sleep Quality", "Halo Ring sleep tracking", "20%"],
            ["Body Composition & Activity", "BMI + activity + weight trend", "10%"],
            ["Substance & Environmental", "Self-reported", "5%"],
          ],
        },
        {
          title: "Tier 2 — Clinically Modifiable (15% of composite)",
          headers: ["Factor", "Source", "Weight in Tier 2"],
          rows: [
            ["Blood Health Indicators", "Energy proxy + symptoms + iron intake", "40%"],
            ["Blood Pressure Trends", "Face scan + symptoms", "40%"],
            ["Prenatal Care Engagement", "Appointment tracking", "20%"],
          ],
        },
        {
          title: "Composite Formula",
          headers: ["Component", "Weight", "Notes"],
          rows: [
            ["Tier 1 Score", "60%", "Weighted average of all 6 modifiable factors"],
            ["Tier 2 Score", "15%", "Weighted average of 3 clinical factors"],
            ["Baseline Buffer", "25%", "Fixed value of 75 — ensures no terrifyingly low scores"],
          ],
        },
        {
          title: "Score Ranges",
          headers: ["Range", "Label", "Color"],
          rows: [
            ["85-100", "Thriving", "Green"],
            ["70-84", "Strong", "Light Green"],
            ["55-69", "Building", "Amber"],
            ["40-54", "Needs Focus", "Orange"],
            ["Below 40", "Priority", "Soft Red"],
          ],
        },
      ],
    },
  },
  {
    key: "gd-screening",
    name: "Continuous Gestational Diabetes Screening",
    specSections: ["3", "5", "8"],
    specLabel: "Blood Sugar Factor, Messaging, Escalation",
    specData: {
      title: "Blood Sugar Balance — Spec Reference",
      tables: [
        {
          title: "Blood Sugar Balance Scoring (Weight: 25% of Tier 1)",
          headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
          rows: [
            ["Fasting glucose (mg/dL)", "< 85", "85-90", "90-95", "> 95"],
            ["1hr postprandial (mg/dL)", "< 120", "120-130", "130-140", "> 140"],
            ["2hr postprandial (mg/dL)", "< 100", "100-110", "110-120", "> 120"],
            ["Daily spike count", "0", "1", "2-3", "> 3"],
          ],
        },
        {
          title: "Blood Sugar Messaging (Kai's Voice)",
          headers: ["State", "Score Range", "Example Message"],
          rows: [
            ["Green", "80-100", "\"Your blood sugar has been beautifully stable this past week. Your average fasting glucose was [X] and you only had [Y] postmeal spikes. Whatever you're doing with your evening meals, keep it up.\""],
            ["Light Green", "65-79", "\"Your blood sugar is in a good range overall, but I noticed your post-dinner readings have been creeping up. Olive made a small tweak to your evening meals — a bit more protein and fiber at dinner should smooth that out.\""],
            ["Amber", "40-64", "\"As pregnancy progresses, your body naturally becomes more resistant to insulin — this happens to a lot of women. Olive has already adjusted your nutrition plan. This is definitely worth mentioning to your OB. I've added it to your Bridge Report.\""],
            ["Red", "Below 40", "\"I want to flag something for you. Your glucose readings have been consistently elevated and dietary adjustments haven't brought them down. I've prepared a detailed glucose summary for your OB. I'd recommend scheduling a conversation this week.\""],
          ],
        },
        {
          title: "Escalation — Blood Sugar",
          headers: ["Level", "Trigger", "Action"],
          rows: [
            ["L1 — Care Team", "Blood sugar score drops below 65", "Olive activates with adjusted nutrition protocol. Assess in 7-14 days."],
            ["L2 — OB Discussion", "Score below 40 OR L1 shows no improvement in 14 days", "Add to OB Bridge Report. Kai recommends mentioning to OB."],
            ["L3 — Urgent", "Sustained glucose well above thresholds despite intervention", "Kai recommends contacting provider. Immediate data summary generated."],
          ],
        },
      ],
    },
  },
  {
    key: "first-trimester",
    name: "First Trimester Guardian",
    specSections: ["3", "5", "10"],
    specLabel: "BBT Monitoring, Messaging, First Trimester Adjustments",
    specData: {
      title: "First Trimester Guardian — Spec Reference",
      tables: [
        {
          title: "First Trimester Adjustments (Weeks 1-13)",
          headers: ["Factor", "Adjustment", "Rationale"],
          rows: [
            ["Sleep", "Lower expectations, reduce score penalty", "Fatigue is normal and physiological"],
            ["Nutrition", "Nausea-adjusted scoring", "Don't penalize for morning sickness dietary changes"],
            ["Activity", "Reduced expectations", "Fatigue normal, reduced capacity"],
            ["Temperature (BBT)", "HIGH PRIORITY — monitoring for viability", "BBT stability is primary first trimester marker"],
            ["Mental Health", "Elevated monitoring", "Anxiety peaks in first trimester"],
          ],
        },
        {
          title: "Stress & Recovery Scoring (Weight: 20% of Tier 1)",
          headers: ["Metric", "Score 100", "Score 75", "Score 50", "Score 25"],
          rows: [
            ["HRV vs personal baseline", "> 90%", "75-90%", "60-75%", "< 60%"],
            ["HRV trend (14-day)", "Stable or improving", "Slight decline", "Moderate decline", "Sustained decline"],
            ["Self-reported stress (1-10)", "1-3", "4-5", "6-7", "8-10"],
            ["Acute stress events (7 days)", "0", "1-2", "3-4", "> 4"],
          ],
        },
        {
          title: "Tier 3 Modifiers — Adjust Monitoring (Not Visible Score)",
          headers: ["Modifier", "Values", "Monitoring Multiplier"],
          rows: [
            ["Maternal Age 20-34", "Standard", "1.0x"],
            ["Maternal Age 35-37", "Elevated", "1.2x, thresholds reduced 10%"],
            ["Maternal Age 38-40", "High", "1.4x, thresholds reduced 20%"],
            ["Maternal Age > 40", "Very High", "1.6x, thresholds reduced 30%"],
            ["Prior Preterm (1)", "OR 3.6", "2.0x, active monitoring at 24 weeks"],
            ["Prior Preterm (2+)", "OR 3.6", "2.5x, active monitoring at 20 weeks"],
          ],
        },
      ],
    },
  },
  {
    key: "ob-bridge",
    name: "OB Bridge Reports",
    specSections: ["7"],
    specLabel: "OB Bridge Report Format",
    specData: {
      title: "OB Bridge Reports — Spec Reference",
      tables: [
        {
          title: "Report Sections",
          headers: ["Section", "Content"],
          rows: [
            ["1. Summary", "2-3 sentence overview. Flags prominently noted."],
            ["2. Continuous Glucose", "Avg fasting, avg 1hr/2hr postprandial, days exceeding Carpenter-Coustan thresholds, trend, intervention response. Ref: GDM OR 1.5-2.0"],
            ["3. Cardiovascular & Stress", "Avg HRV (RMSSD), HRV trend vs baseline, BP estimates. Ref: HRV depression → preeclampsia risk"],
            ["4. Sleep & Recovery", "Average duration, efficiency, wake episodes"],
            ["5. Behavioral Compliance", "Supplement adherence, dietary plan adherence, activity level"],
            ["6. Topics for Discussion", "Bulleted list of system-flagged items"],
            ["7. Wellness Score Trend", "Line graph showing score over reporting period"],
          ],
        },
        {
          title: "Report Configuration",
          headers: ["Attribute", "Specification"],
          rows: [
            ["Format", "PDF — Provider Copy, For Clinical Use"],
            ["Design", "Clinical/professional, not consumer app aesthetic"],
            ["Footer", "\"This report supplements but does not replace clinical assessment.\""],
            ["Delivery", "Generated per OB appointment schedule"],
          ],
        },
      ],
    },
  },
];

function DevWorkspacesTab({
  experience,
  features,
}: {
  experience: Experience;
  features: Feature[];
}) {
  const [selectedFeatureKey, setSelectedFeatureKey] = useState(SCORABLE_FEATURES[0].key);
  const [activeSubTab, setActiveSubTab] = useState<"spec" | "ux" | "code">("spec");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [canvasContent, setCanvasContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedScorable = SCORABLE_FEATURES.find((f) => f.key === selectedFeatureKey)!;
  const matchedFeature = features.find((f) => f.name === selectedScorable.name) || null;

  // Reset state when feature changes
  useEffect(() => {
    setMessages([]);
    setCanvasContent("");
    setSessionId(null);
  }, [selectedFeatureKey]);

  // Load conversation for UX/Code sub-tabs
  const loadConversation = useCallback(async () => {
    if (!matchedFeature || activeSubTab === "spec") return;
    const convType = activeSubTab === "ux" ? "ux_design" : "code_gen";
    try {
      const res = await fetch(
        `/api/product/coach?experienceSlug=${experience.slug}&conversationType=${convType}`
      );
      const data = await res.json();
      if (data.messages?.length) {
        setMessages(data.messages);
        setSessionId(data.sessionId);
      }
    } catch {
      // silently fail
    }
    if (matchedFeature) {
      setCanvasContent(
        activeSubTab === "ux" ? matchedFeature.uxSpec || "" : matchedFeature.generatedCode || ""
      );
    }
  }, [experience.slug, matchedFeature, activeSubTab]);

  useEffect(() => {
    if (activeSubTab !== "spec") loadConversation();
  }, [activeSubTab, selectedFeatureKey, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    const convType = activeSubTab === "ux" ? "ux_design" : "code_gen";
    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceName: experience.name,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationType: convType,
          featureName: selectedScorable.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        setCanvasContent(data.response);
        if (data.sessionId) setSessionId(data.sessionId);
        // Auto-save
        if (matchedFeature) {
          const field = activeSubTab === "ux" ? "uxSpec" : "generatedCode";
          await fetch("/api/product/features", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: matchedFeature.id, [field]: data.response }),
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const SUB_TABS = [
    { id: "spec" as const, label: "Spec Reference", icon: BookOpen },
    { id: "ux" as const, label: "UX Design", icon: Palette },
    { id: "code" as const, label: "Code", icon: Code2 },
  ];

  return (
    <div>
      {/* Feature Selector */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {SCORABLE_FEATURES.map((sf) => (
          <button
            key={sf.key}
            onClick={() => {
              setSelectedFeatureKey(sf.key);
              setActiveSubTab("spec");
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              selectedFeatureKey === sf.key
                ? { backgroundColor: "#D4A843", color: "white" }
                : {
                    backgroundColor: "var(--surface)",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                  }
            }
          >
            {sf.name}
          </button>
        ))}
      </div>

      {/* Sub-Tab Navigation */}
      <div
        className="flex gap-1 mb-4 p-1 rounded-lg"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {SUB_TABS.map((tab) => {
          const active = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? "shadow-sm" : ""}`}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: "#D4A843" }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <Link
          href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium hover:shadow-sm transition-all"
          style={{ color: "#D4A843" }}
        >
          <ExternalLink size={12} />
          Full Spec
        </Link>
      </div>

      {/* Sub-Tab Content */}
      {activeSubTab === "spec" ? (
        <SpecReferencePanel scorable={selectedScorable} />
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--border)",
            height: "calc(100vh - 420px)",
            minHeight: "450px",
          }}
        >
          {/* Chat Panel */}
          <div
            className="flex flex-col border-r"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              {activeSubTab === "ux" ? <Palette size={14} style={{ color: "#D4A843" }} /> : <Code2 size={14} style={{ color: "#D4A843" }} />}
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {activeSubTab === "ux" ? "UX Design" : "Code Generation"} — {selectedScorable.name}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {activeSubTab === "ux" ? (
                    <Palette size={28} className="mb-2" style={{ color: "#D4A843" }} />
                  ) : (
                    <Code2 size={28} className="mb-2" style={{ color: "#D4A843" }} />
                  )}
                  <p className="text-sm mb-1" style={{ color: "var(--foreground)" }}>
                    {selectedScorable.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {activeSubTab === "ux"
                      ? "Design the user experience — flows, screens, and interactions"
                      : "Generate React components with scoring logic"}
                  </p>
                  <p className="text-[10px] mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: "#D4A84314", color: "#D4A843" }}>
                    Spec sections: {selectedScorable.specLabel}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "#D4A84318" }}>
                          <Bot size={12} style={{ color: "#D4A843" }} />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === "user" ? "text-white" : ""}`}
                        style={{
                          backgroundColor: msg.role === "user" ? "#D4A843" : "var(--background)",
                          border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                        }}
                      >
                        <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "#D4A84318" }}>
                        <Bot size={12} style={{ color: "#D4A843" }} />
                      </div>
                      <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--border)" }}>
                        <Loader2 size={12} className="animate-spin" style={{ color: "var(--muted)" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={activeSubTab === "ux" ? "Describe the user flow..." : "What should this component do?"}
                  className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-3 py-2 rounded-lg text-white disabled:opacity-50"
                  style={{ backgroundColor: "#D4A843" }}
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Panel */}
          <div className="flex flex-col" style={{ backgroundColor: "var(--background)" }}>
            <div
              className="px-4 py-3 border-b flex items-center gap-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              {activeSubTab === "ux" ? <Palette size={14} /> : <Code2 size={14} />}
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {activeSubTab === "ux" ? "UX Specification" : "Generated Code"}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {canvasContent ? (
                <div
                  className={`text-sm whitespace-pre-wrap leading-relaxed ${activeSubTab === "code" ? "font-mono text-xs" : ""}`}
                  style={{ color: "var(--foreground)" }}
                >
                  {canvasContent}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: "var(--border-light)" }}>
                    {activeSubTab === "ux" ? (
                      <Palette size={24} style={{ color: "var(--muted)" }} />
                    ) : (
                      <Code2 size={24} style={{ color: "var(--muted)" }} />
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {activeSubTab === "ux" ? "UX specs will appear here" : "Generated code will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecReferencePanel({ scorable }: { scorable: typeof SCORABLE_FEATURES[number] }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "#D4A84308", border: "1px solid #D4A84325" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Table2 size={16} style={{ color: "#D4A843" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            {scorable.specData.title}
          </h3>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Spec sections: {scorable.specSections.join(", ")} — {scorable.specLabel}
        </p>
      </div>

      {/* Tables */}
      {scorable.specData.tables.map((table, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-4 py-3"
            style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)" }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              {table.title}
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--surface)" }}>
                  {table.headers.map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]"
                      style={{ color: "#D4A843", borderBottom: "1px solid var(--border)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{
                      backgroundColor: rIdx % 2 === 0 ? "var(--background)" : "var(--surface)",
                      borderBottom: rIdx < table.rows.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5" style={{ color: "var(--foreground)" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   IP COVERAGE TAB
   ───────────────────────────────────────────── */
function IPCoverageTab({ experience }: { experience: Experience }) {
  const isPregnancy = experience.slug === "pregnancy";
  const isPostpartum = experience.slug === "postpartum";
  const ipCoverage = isPregnancy ? PREGNANCY_IP_COVERAGE : isPostpartum ? POSTPARTUM_IP_COVERAGE : null;

  if (!ipCoverage) {
    return (
      <div
        className="rounded-xl p-12 text-center"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <Shield size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          IP coverage mapping will be added as features are defined for this experience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: experience.accentColor }} />
          <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
            Patent Protection Map
          </h3>
        </div>
        <div className="space-y-2">
          {ipCoverage.map((item) => (
            <div
              key={item.feature}
              className="flex items-start gap-4 rounded-lg p-3"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {item.feature}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {item.patents.length > 0 ? (
                  item.patents.map((p) => (
                    <Link
                      key={p.id}
                      href={`/departments/legal/patent-drafts/${p.id}`}
                      className="px-2.5 py-1 rounded-md text-xs font-medium hover:shadow-sm transition-shadow"
                      style={{
                        backgroundColor: `${experience.accentColor}14`,
                        color: experience.accentColor,
                        border: `1px solid ${experience.accentColor}30`,
                      }}
                    >
                      {p.number} — {p.name}
                    </Link>
                  ))
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: "#F59E0B14", color: "#F59E0B" }}>
                    <AlertTriangle size={10} />
                    New patent opportunity
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended New Patent — Pregnancy */}
      {isPregnancy && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: `3px solid ${experience.accentColor}`,
          }}
        >
          <div className="flex items-start gap-3">
            <Shield size={16} className="mt-0.5 shrink-0" style={{ color: experience.accentColor }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                Recommended new patent filed
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                Continuous AI-Powered Pregnancy Monitoring System (Patent 011) — covers the novel
                combination of pre-conception data integration with continuous pregnancy monitoring
                and automated care coordination.
              </p>
              <Link
                href="/departments/legal/patent-drafts/patent-011"
                className="inline-flex items-center gap-1 text-xs font-medium mt-2"
                style={{ color: experience.accentColor }}
              >
                View in Patent Drafts →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Postpartum Patents Summary */}
      {isPostpartum && (
        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderLeft: `3px solid ${experience.accentColor}`,
          }}
        >
          <div className="flex items-start gap-3">
            <Shield size={16} className="mt-0.5 shrink-0" style={{ color: experience.accentColor }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                3 New Postpartum Patents
              </p>
              <div className="space-y-2 mt-2">
                {[
                  { id: "patent-012", number: "012", name: "PPD Detection System", priority: "Critical" },
                  { id: "patent-013", number: "013", name: "Recovery Trajectory Modeling", priority: "High" },
                  { id: "patent-014", number: "014", name: "Secondary Infertility Prevention", priority: "High" },
                ].map((p) => (
                  <Link
                    key={p.id}
                    href={`/departments/legal/patent-drafts/${p.id}`}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: experience.accentColor }}
                  >
                    <span className="font-bold">Patent {p.number}:</span> {p.name}
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{
                      backgroundColor: p.priority === "Critical" ? "#E24D4714" : "#F59E0B14",
                      color: p.priority === "Critical" ? "#E24D47" : "#F59E0B",
                    }}>
                      {p.priority}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ─── */
function getIcon(slug: string): string {
  const icons: Record<string, string> = {
    "first-period": "\u{1F338}",
    "early-menstruator": "\u{1F331}",
    periods: "\u{1F4AB}",
    pcos: "\u{1F52C}",
    endometriosis: "\u{1F940}",
    fertility: "\u{2728}",
    pregnancy: "\u{1F31F}",
    postpartum: "\u{1F343}",
    perimenopause: "\u{1F525}",
    "menopause-beyond": "\u{1F30A}",
  };
  return icons[slug] || "✦";
}
