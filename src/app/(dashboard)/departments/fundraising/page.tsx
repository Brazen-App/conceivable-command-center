"use client";

import { useState, useEffect } from "react";
import { Rocket, Users, Package, BarChart3 } from "lucide-react";
import InvestorPipeline from "@/components/departments/fundraising/InvestorPipeline";
import PitchMaterials from "@/components/departments/fundraising/PitchMaterials";
import NarrativeMetrics from "@/components/departments/fundraising/NarrativeMetrics";
import type {
  Investor,
  MeetingNote,
  PitchMaterial,
  FundraiseMetric,
  WeeklyRecommendation,
} from "@/lib/data/fundraising-data";
import { PIPELINE_STAGES } from "@/lib/data/fundraising-data";

const ACCENT = "#356FB6";

const TABS = [
  { id: "pipeline", label: "Investor CRM & Pipeline", icon: Users },
  { id: "materials", label: "Pitch Materials & Data Room", icon: Package },
  { id: "narrative", label: "Narrative & Metrics", icon: BarChart3 },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface FundraisingData {
  movementBoard: Investor[];
  ventureInvestors: Investor[];
  strategicPartners: Investor[];
  pitchMaterials: PitchMaterial[];
  meetingNotes: MeetingNote[];
  metrics: FundraiseMetric[];
  weeklyRecommendation: WeeklyRecommendation;
  narrative: string;
  storyAngles: { investorFocus: string; angle: string; openingLine: string }[];
}

export default function FundraisingDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");
  const [data, setData] = useState<FundraisingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fundraising")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const totalInvestors = data
    ? data.movementBoard.length + data.ventureInvestors.length + data.strategicPartners.length
    : 0;
  const activeConversations = data
    ? [...data.movementBoard, ...data.ventureInvestors, ...data.strategicPartners].filter(
        (i) => i.stage !== "prospect" && i.stage !== "passed"
      ).length
    : 0;
  const materialsReady = data
    ? data.pitchMaterials.filter((m) => m.status === "ready").length
    : 0;
  const totalMaterials = data ? data.pitchMaterials.length : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Rocket size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
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
              Fundraising
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
              The Growth Engine — $150K Bridge + $5M Series A
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
          <Rocket size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {totalInvestors} investors tracked &middot; {activeConversations} active conversations
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {materialsReady}/{totalMaterials} pitch materials ready &middot; Closed-Loop patent must file before fundraise
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
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
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading fundraising data...</p>
        </div>
      ) : (
        <>
          {activeTab === "pipeline" && (
            <InvestorPipeline
              movementBoard={data.movementBoard}
              ventureInvestors={data.ventureInvestors}
              strategicPartners={data.strategicPartners}
              meetingNotes={data.meetingNotes}
              pipelineStages={PIPELINE_STAGES}
            />
          )}
          {activeTab === "materials" && (
            <PitchMaterials materials={data.pitchMaterials} />
          )}
          {activeTab === "narrative" && (
            <NarrativeMetrics
              narrative={data.narrative}
              metrics={data.metrics}
              weeklyRecommendation={data.weeklyRecommendation}
              storyAngles={data.storyAngles}
            />
          )}
        </>
      )}
    </div>
  );
}
