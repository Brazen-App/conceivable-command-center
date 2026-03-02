"use client";

import { useState, useMemo } from "react";
import { Network, Zap, ArrowRight } from "lucide-react";
import type {
  Vertical,
  CrossVerticalConnection,
  Feature,
  VerticalId,
} from "@/lib/data/product-data";
import { VERTICAL_COLORS } from "@/lib/data/product-data";

const ACCENT = "#E37FB1";

interface Props {
  verticals: Vertical[];
  connections: CrossVerticalConnection[];
  features: Feature[];
}

export default function CrossVerticalMap({
  verticals,
  connections,
  features,
}: Props) {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

  // Layout: circular arrangement
  const cx = 280;
  const cy = 220;
  const radius = 170;

  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    verticals.forEach((v, i) => {
      const angle = (i / verticals.length) * Math.PI * 2 - Math.PI / 2;
      map[v.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
    return map;
  }, [verticals]);

  // Find connections involving selected vertical
  const selectedConns = selectedVertical
    ? new Set(
        connections
          .filter(
            (c) =>
              c.fromVerticalId === selectedVertical ||
              c.toVerticalId === selectedVertical
          )
          .flatMap((c) => [c.fromVerticalId, c.toVerticalId])
      )
    : null;

  // Find multiplier features (appear in 3+ verticals)
  const featureCrossCount = useMemo(() => {
    const counts: Record<string, { title: string; verticals: VerticalId[] }> = {};
    features.forEach((f) => {
      if (f.crossVerticalIds.length > 0) {
        counts[f.id] = {
          title: f.title,
          verticals: [f.verticalId, ...f.crossVerticalIds],
        };
      }
    });
    return Object.values(counts)
      .filter((c) => c.verticals.length >= 3)
      .sort((a, b) => b.verticals.length - a.verticals.length);
  }, [features]);

  // Connection type colors
  const typeColors: Record<string, string> = {
    shared_feature: "#5A6FFF",
    data_dependency: "#1EAA55",
    clinical_pathway: "#9686B9",
  };

  return (
    <div>
      {/* Network Graph */}
      <div
        className="rounded-2xl border p-4 mb-6"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Network size={14} style={{ color: ACCENT }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Cross-Vertical Connection Map
          </h3>
          <span
            className="text-[10px] ml-auto"
            style={{ color: "var(--muted)" }}
          >
            Click a vertical to explore connections
          </span>
        </div>

        <svg viewBox="0 0 560 440" className="w-full" style={{ maxHeight: 440 }}>
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = positions[conn.fromVerticalId];
            const to = positions[conn.toVerticalId];
            if (!from || !to) return null;

            const isHighlighted =
              !selectedVertical ||
              conn.fromVerticalId === selectedVertical ||
              conn.toVerticalId === selectedVertical;
            const opacity = selectedVertical
              ? isHighlighted
                ? 0.8
                : 0.05
              : 0.3;

            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={typeColors[conn.type]}
                strokeWidth={Math.max(1, conn.strength * 4)}
                opacity={opacity}
                strokeDasharray={
                  conn.type === "data_dependency"
                    ? "none"
                    : conn.type === "clinical_pathway"
                    ? "6 3"
                    : "3 3"
                }
              />
            );
          })}

          {/* Vertical nodes */}
          {verticals.map((v) => {
            const pos = positions[v.id];
            if (!pos) return null;
            const isSelected = selectedVertical === v.id;
            const isConnected = selectedConns?.has(v.id);
            const dimmed = selectedVertical && !isSelected && !isConnected;

            return (
              <g
                key={v.id}
                onClick={() =>
                  setSelectedVertical(isSelected ? null : v.id)
                }
                className="cursor-pointer"
                opacity={dimmed ? 0.12 : 1}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={28}
                    fill="none"
                    stroke={v.color}
                    strokeWidth={2}
                    opacity={0.6}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={v.status === "active" ? 24 : 18}
                  fill={v.color}
                  opacity={isSelected ? 1 : 0.85}
                />

                {/* Emoji */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={v.status === "active" ? 14 : 10}
                >
                  {v.emoji}
                </text>

                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + (v.status === "active" ? 36 : 28)}
                  textAnchor="middle"
                  fill={isSelected ? v.color : "var(--muted)"}
                  fontSize={8}
                  fontWeight={isSelected ? 700 : 400}
                >
                  {v.name}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(10, 400)">
            <line
              x1={0}
              y1={6}
              x2={20}
              y2={6}
              stroke="#1EAA55"
              strokeWidth={2}
            />
            <text x={24} y={9} fontSize={8} fill="var(--muted)">
              Data Flow
            </text>
            <line
              x1={100}
              y1={6}
              x2={120}
              y2={6}
              stroke="#9686B9"
              strokeWidth={2}
              strokeDasharray="6 3"
            />
            <text x={124} y={9} fontSize={8} fill="var(--muted)">
              Clinical Pathway
            </text>
            <line
              x1={230}
              y1={6}
              x2={250}
              y2={6}
              stroke="#5A6FFF"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <text x={254} y={9} fontSize={8} fill="var(--muted)">
              Shared Feature
            </text>
          </g>
        </svg>
      </div>

      {/* Selected vertical detail */}
      {selectedVertical && (
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{
            borderColor: `${VERTICAL_COLORS[selectedVertical as VerticalId]}30`,
            backgroundColor: "var(--surface)",
          }}
        >
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{
              color:
                VERTICAL_COLORS[selectedVertical as VerticalId] || ACCENT,
            }}
          >
            Connections:{" "}
            {verticals.find((v) => v.id === selectedVertical)?.name}
          </h3>
          <div className="space-y-2">
            {connections
              .filter(
                (c) =>
                  c.fromVerticalId === selectedVertical ||
                  c.toVerticalId === selectedVertical
              )
              .map((conn, i) => {
                const otherId =
                  conn.fromVerticalId === selectedVertical
                    ? conn.toVerticalId
                    : conn.fromVerticalId;
                const otherVertical = verticals.find((v) => v.id === otherId);
                return (
                  <div
                    key={i}
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--background)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">
                        {otherVertical?.emoji}
                      </span>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {otherVertical?.name}
                      </p>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${typeColors[conn.type]}14`,
                          color: typeColors[conn.type],
                        }}
                      >
                        {conn.type.replace(/_/g, " ")}
                      </span>
                      <span
                        className="text-[9px] font-mono ml-auto"
                        style={{ color: "var(--muted)" }}
                      >
                        strength: {conn.strength.toFixed(2)}
                      </span>
                    </div>
                    <p
                      className="text-[11px] mb-2"
                      style={{ color: "var(--muted)" }}
                    >
                      {conn.description}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {conn.sharedFeatures.map((sf) => (
                        <span
                          key={sf}
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${typeColors[conn.type]}10`,
                            color: typeColors[conn.type],
                          }}
                        >
                          {sf}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Multiplier Features */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={14} style={{ color: "#F1C028" }} />
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            Multiplier Features — Build Once, Deploy Across Verticals
          </h3>
        </div>

        {featureCrossCount.length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: "var(--muted)" }}
          >
            No cross-vertical multiplier features identified yet
          </p>
        ) : (
          <div className="space-y-3">
            {featureCrossCount.map((feat, i) => (
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor:
                    i === 0 ? `#F1C02808` : "var(--background)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {i === 0 && (
                    <Zap size={12} style={{ color: "#F1C028" }} />
                  )}
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {feat.title}
                  </p>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      backgroundColor: "#F1C02814",
                      color: "#F1C028",
                    }}
                  >
                    {feat.verticals.length}x multiplier
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {feat.verticals.map((vid, j) => (
                    <div key={vid} className="flex items-center">
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${VERTICAL_COLORS[vid]}14`,
                          color: VERTICAL_COLORS[vid],
                        }}
                      >
                        {vid
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      {j < feat.verticals.length - 1 && (
                        <ArrowRight
                          size={10}
                          className="mx-0.5"
                          style={{ color: "var(--border)" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
