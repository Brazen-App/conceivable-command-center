"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Activity,
  GitBranch,
  BookOpen,
  Shield,
} from "lucide-react";
import OutcomesDashboard from "@/components/departments/clinical/OutcomesDashboard";
import DotConnector from "@/components/departments/clinical/DotConnector";
import ResearchEngine from "@/components/departments/clinical/ResearchEngine";
import RegulatoryResearch from "@/components/departments/clinical/RegulatoryResearch";
import type {
  Factor,
  CausalChain,
  CohortOutcome,
  AgentPerformance,
  InterventionCascade,
  StudyOpportunity,
  RegulatoryEvidence,
  ResearchFeedItem,
} from "@/lib/data/clinical-data";

const ACCENT = "#78C3BF";

const TABS = [
  { id: "outcomes", label: "Outcomes Dashboard", icon: Activity },
  { id: "dot-connector", label: "The Dot Connector", icon: GitBranch },
  { id: "research", label: "Research Engine", icon: BookOpen },
  { id: "regulatory", label: "Regulatory Evidence", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ClinicalData {
  factors: Factor[];
  causalChains: CausalChain[];
  cohortOutcomes: CohortOutcome[];
  agentPerformance: AgentPerformance[];
  interventionCascades: InterventionCascade[];
  studyOpportunities: StudyOpportunity[];
  regulatoryEvidence: RegulatoryEvidence[];
  researchFeed: ResearchFeedItem[];
  dropOffData: { stage: string; pct: number; users: number }[];
}

export default function ClinicalDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("outcomes");
  const [data, setData] = useState<ClinicalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clinical")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const detailedFactors = data
    ? data.factors.filter((f) => f.connections.length > 0).length
    : 0;
  const totalFactors = data ? data.factors.length : 0;
  const provenChains = data
    ? data.causalChains.filter((c) => c.evidenceStatus === "proven").length
    : 0;
  const activeStudies = data ? data.studyOpportunities.length : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <FlaskConical
              size={20}
              style={{ color: ACCENT }}
              strokeWidth={1.8}
            />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Clinical / Research
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Evidence Engine — Prove It Works, Publish the Science
            </p>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}0A`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <FlaskConical
            size={20}
            style={{ color: ACCENT }}
            strokeWidth={2}
          />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {totalFactors} factors tracked &middot; {detailedFactors} with
              detailed connections &middot; {provenChains} proven causal chains
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {activeStudies} studies in pipeline &middot; N=105 pilot
              study &middot; 240K+ data points
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {loading || !data ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Loading clinical data...
          </p>
        </div>
      ) : (
        <>
          {activeTab === "outcomes" && (
            <OutcomesDashboard
              cohortOutcomes={data.cohortOutcomes}
              agentPerformance={data.agentPerformance}
              dropOffData={data.dropOffData}
            />
          )}
          {activeTab === "dot-connector" && (
            <DotConnector
              factors={data.factors}
              causalChains={data.causalChains}
              interventionCascades={data.interventionCascades}
            />
          )}
          {activeTab === "research" && (
            <ResearchEngine
              studyOpportunities={data.studyOpportunities}
              researchFeed={data.researchFeed}
            />
          )}
          {activeTab === "regulatory" && (
            <RegulatoryResearch
              regulatoryEvidence={data.regulatoryEvidence}
            />
          )}
        </>
      )}
    </div>
  );
}
