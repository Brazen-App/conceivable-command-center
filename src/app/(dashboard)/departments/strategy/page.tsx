"use client";

import { useState, useEffect } from "react";
import { Brain, BookOpen, Scale, Lightbulb } from "lucide-react";
import CEOWeeklyBrief from "@/components/departments/strategy/CEOWeeklyBrief";
import DecisionFramework from "@/components/departments/strategy/DecisionFramework";
import IdeasParkingLot from "@/components/departments/strategy/IdeasParkingLot";
import type {
  WeeklyBrief,
  Decision,
  Idea,
  StrategyConnection,
} from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

const TABS = [
  { id: "brief", label: "CEO Weekly Brief", icon: BookOpen },
  { id: "decisions", label: "Decision Framework", icon: Scale },
  { id: "ideas", label: "Ideas Parking Lot", icon: Lightbulb },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface StrategyData {
  currentBrief: WeeklyBrief;
  briefArchive: { id: string; weekOf: string; headline: string; focusTheme: string }[];
  decisions: Decision[];
  ideas: Idea[];
  connections: StrategyConnection[];
}

export default function StrategyDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("brief");
  const [data, setData] = useState<StrategyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strategy")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const redCount = data
    ? data.connections.filter((c) => c.status === "red").length
    : 0;
  const yellowCount = data
    ? data.connections.filter((c) => c.status === "yellow").length
    : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Brain size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
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
              Strategy / Coaching
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
              The Brain — Bill Campbell + Dan Sullivan Framework
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
          <Brain size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Sees all {data ? data.connections.length : 8} departments &middot;{" "}
              {redCount > 0 ? `${redCount} red flag${redCount > 1 ? "s" : ""}` : "No red flags"} &middot;{" "}
              {yellowCount > 0 ? `${yellowCount} on watch` : ""} &middot;{" "}
              {data ? data.ideas.filter((i) => i.status === "new").length : 0} new ideas to review
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Your executive coach — warm but direct, honest not diplomatic
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
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading strategy data...</p>
        </div>
      ) : (
        <>
          {activeTab === "brief" && (
            <CEOWeeklyBrief
              currentBrief={data.currentBrief}
              briefArchive={data.briefArchive}
            />
          )}
          {activeTab === "decisions" && (
            <DecisionFramework decisions={data.decisions} />
          )}
          {activeTab === "ideas" && (
            <IdeasParkingLot ideas={data.ideas} />
          )}
        </>
      )}
    </div>
  );
}
