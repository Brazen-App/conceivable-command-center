"use client";

import { useState } from "react";
import { Clock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const ACCENT = "#ACB7FF";

type Phase = "now" | "next" | "later";
type Status = "in_progress" | "ready" | "defined" | "researching" | "idea";
type Complexity = "small" | "medium" | "large" | "epic";

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: Status;
  complexity: Complexity;
  phase: Phase;
  dependencies: string[];
}

const FEATURES: RoadmapFeature[] = [
  {
    id: "f1",
    title: "Halo Ring Real-Time Sync",
    description: "BLE integration for automatic biometric data sync from Halo Ring. 15-minute sync intervals with battery optimization.",
    status: "in_progress",
    complexity: "large",
    phase: "now",
    dependencies: [],
  },
  {
    id: "f2",
    title: "Ovulation Detection (HRV-Based)",
    description: "ML model using HRV + temperature + historical data for 89% accuracy ovulation prediction with confidence bands.",
    status: "ready",
    complexity: "large",
    phase: "now",
    dependencies: ["f1"],
  },
  {
    id: "f3",
    title: "Onboarding Flow (50-Factor Assessment)",
    description: "Guided 10-minute smart questionnaire that branches based on answers. Sets up personalized dashboard from day one.",
    status: "defined",
    complexity: "large",
    phase: "now",
    dependencies: [],
  },
  {
    id: "f4",
    title: "50-Factor Dashboard",
    description: "Core differentiator: interactive visualization showing all 50 fertility factors and their connections. Graph-based UI.",
    status: "defined",
    complexity: "epic",
    phase: "next",
    dependencies: ["f1", "f3"],
  },
  {
    id: "f5",
    title: "Cycle Prediction with Confidence Scores",
    description: "ML model using HRV + temp + historical data. Show confidence band, not just a single date. Personalized accuracy.",
    status: "defined",
    complexity: "large",
    phase: "next",
    dependencies: ["f1", "f2"],
  },
  {
    id: "f6",
    title: "Community Integration",
    description: "Circle SSO integration showing relevant community posts based on user vertical and journey stage.",
    status: "defined",
    complexity: "medium",
    phase: "next",
    dependencies: [],
  },
  {
    id: "f7",
    title: "AI Coaching Chat (Kai)",
    description: "RAG pipeline with clinical evidence. Warm, empathetic AI coaching. Must pass compliance review before launch.",
    status: "researching",
    complexity: "epic",
    phase: "later",
    dependencies: ["f4"],
  },
  {
    id: "f8",
    title: "Supplement Evidence Tracker",
    description: "Track supplements with A/B/C evidence ratings from clinical database. Interaction warnings and efficacy tracking.",
    status: "researching",
    complexity: "medium",
    phase: "later",
    dependencies: [],
  },
  {
    id: "f9",
    title: "Partner Dashboard",
    description: "Simplified view for partners: key metrics, action items, emotional support prompts. Top community request.",
    status: "idea",
    complexity: "medium",
    phase: "later",
    dependencies: ["f4"],
  },
  {
    id: "f10",
    title: "Glucose Variability Module",
    description: "CGM partner integration or meal logging proxy. Show glucose-cycle correlation for metabolic fertility insights.",
    status: "researching",
    complexity: "large",
    phase: "later",
    dependencies: ["f1"],
  },
];

const PHASE_CONFIG: Record<Phase, { label: string; sublabel: string; color: string }> = {
  now: { label: "Now", sublabel: "Current Sprint", color: "#1EAA55" },
  next: { label: "Next", sublabel: "Next Sprint", color: "#5A6FFF" },
  later: { label: "Later", sublabel: "Backlog", color: "#9686B9" },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  in_progress: { label: "In Progress", color: "#5A6FFF" },
  ready: { label: "Ready", color: "#1EAA55" },
  defined: { label: "Defined", color: "#F1C028" },
  researching: { label: "Researching", color: "#9686B9" },
  idea: { label: "Idea", color: ACCENT },
};

const COMPLEXITY_CONFIG: Record<Complexity, { label: string; points: string }> = {
  small: { label: "S", points: "1-3 pts" },
  medium: { label: "M", points: "5-8 pts" },
  large: { label: "L", points: "13-21 pts" },
  epic: { label: "XL", points: "34+ pts" },
};

export default function RoadmapPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const phases: Phase[] = ["now", "next", "later"];

  return (
    <div>
      {/* Intro */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Product Roadmap &mdash; Timeline View
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          Features organized by delivery phase. Now = current sprint, Next = next sprint, Later = backlog. Click to expand details.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {phases.map((phase) => {
          const config = PHASE_CONFIG[phase];
          const phaseFeatures = FEATURES.filter((f) => f.phase === phase);

          return (
            <div key={phase}>
              {/* Phase Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <div>
                  <h3 className="text-sm font-bold" style={{ color: config.color }}>
                    {config.label}
                  </h3>
                  <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {config.sublabel} &middot; {phaseFeatures.length} features
                  </p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-2 ml-6 border-l-2 pl-6" style={{ borderColor: `${config.color}30` }}>
                {phaseFeatures.map((feature) => {
                  const statusConf = STATUS_CONFIG[feature.status];
                  const complexityConf = COMPLEXITY_CONFIG[feature.complexity];
                  const isExpanded = expandedId === feature.id;
                  const deps = feature.dependencies.map((depId) => FEATURES.find((f) => f.id === depId)?.title).filter(Boolean);

                  return (
                    <button
                      key={feature.id}
                      onClick={() => setExpandedId(isExpanded ? null : feature.id)}
                      className="w-full text-left rounded-xl border p-4 transition-all hover:shadow-sm"
                      style={{
                        borderColor: isExpanded ? config.color : "var(--border)",
                        backgroundColor: isExpanded ? `${config.color}06` : "var(--surface)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                            {feature.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                            >
                              {statusConf.label}
                            </span>
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
                            >
                              {complexityConf.label} ({complexityConf.points})
                            </span>
                            {deps.length > 0 && (
                              <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                                Depends on: {deps.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                        ) : (
                          <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                        )}
                      </div>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {feature.description}
                          </p>
                          {deps.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                              <p className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>
                                Dependencies: {deps.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
