"use client";

import { useState } from "react";
import {
  ChevronRight,
  Beaker,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { Vertical, VerticalId } from "@/lib/data/product-data";

const ACCENT = "#E37FB1";

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#1EAA55" },
  research: { label: "Research", color: "#9686B9" },
  planned: { label: "Planned", color: "#5A6FFF" },
  future: { label: "Future", color: "var(--muted)" },
};

interface Props {
  verticals: Vertical[];
  onSelectVertical: (id: VerticalId) => void;
}

export default function VerticalsGrid({ verticals, onSelectVertical }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeCount = verticals.filter((v) => v.status === "active").length;
  const totalFeatures = verticals.reduce((sum, v) => sum + v.featureCount, 0);
  const totalResearch = verticals.reduce((sum, v) => sum + v.researchCount, 0);

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Verticals", value: verticals.length, color: ACCENT },
          { label: "Active", value: activeCount, color: "#1EAA55" },
          { label: "Features", value: totalFeatures, color: "#5A6FFF" },
          { label: "Research Items", value: totalResearch, color: "#9686B9" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <p className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p
              className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: stat.color }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Lifecycle Flow */}
      <div className="mb-6">
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--muted)" }}
        >
          Women&apos;s Health Lifecycle
        </p>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {verticals.map((v, i) => (
            <div key={v.id} className="flex items-center shrink-0">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: v.color }}
              />
              <span
                className="text-[9px] font-medium ml-1 mr-1"
                style={{ color: v.status === "active" ? v.color : "var(--muted)" }}
              >
                {v.name}
              </span>
              {i < verticals.length - 1 && (
                <ChevronRight size={10} style={{ color: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {verticals.map((vertical) => {
          const statusConf = STATUS_STYLE[vertical.status];
          const isHovered = hoveredId === vertical.id;
          const isActive = vertical.status === "active";

          return (
            <button
              key={vertical.id}
              onClick={() => onSelectVertical(vertical.id)}
              onMouseEnter={() => setHoveredId(vertical.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="text-left rounded-2xl border p-4 transition-all duration-150"
              style={{
                borderColor: isHovered ? vertical.color : "var(--border)",
                backgroundColor: isHovered ? `${vertical.color}06` : "var(--surface)",
                boxShadow: isHovered ? `0 0 20px ${vertical.color}15` : "none",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{vertical.emoji}</span>
                  <div>
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "var(--foreground)" }}
                    >
                      {vertical.name}
                    </p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1"
                      style={{
                        backgroundColor: `${statusConf.color}14`,
                        color: statusConf.color,
                      }}
                    >
                      {statusConf.label}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  style={{
                    color: isHovered ? vertical.color : "var(--muted)",
                    opacity: isHovered ? 1 : 0.3,
                  }}
                />
              </div>

              {/* Description */}
              <p
                className="text-[11px] leading-relaxed mb-3"
                style={{ color: "var(--muted)" }}
              >
                {vertical.description}
              </p>

              {/* Metrics row */}
              {isActive ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Sparkles size={11} style={{ color: "#5A6FFF" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#5A6FFF" }}>
                      {vertical.featureCount} features
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Beaker size={11} style={{ color: "#9686B9" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#9686B9" }}>
                      {vertical.researchCount} research
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={11} style={{ color: "#1EAA55" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#1EAA55" }}>
                      {vertical.readinessScore}% ready
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <FileText size={11} style={{ color: "var(--muted)" }} />
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {vertical.featureCount === 0
                      ? "No features yet — click to start"
                      : `${vertical.featureCount} features`}
                  </span>
                </div>
              )}

              {/* Readiness bar (only for active) */}
              {isActive && (
                <div className="mt-3">
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: `${vertical.color}14` }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${vertical.readinessScore}%`,
                        backgroundColor: vertical.color,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Key insight */}
              {isActive && (
                <div
                  className="rounded-lg p-2 mt-3"
                  style={{ backgroundColor: `${vertical.color}08` }}
                >
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {vertical.keyInsight}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
