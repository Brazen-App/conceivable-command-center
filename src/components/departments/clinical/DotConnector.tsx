"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  GitBranch,
  Network,
  Search,
} from "lucide-react";
import type {
  Factor,
  CausalChain,
  InterventionCascade,
  FactorCategory,
} from "@/lib/data/clinical-data";
import { CATEGORY_CONFIG } from "@/lib/data/clinical-data";

const ACCENT = "#78C3BF";

interface Props {
  factors: Factor[];
  causalChains: CausalChain[];
  interventionCascades: InterventionCascade[];
}

const EVIDENCE_CONFIG: Record<string, { label: string; color: string }> = {
  strong: { label: "Strong", color: "#1EAA55" },
  moderate: { label: "Moderate", color: "#78C3BF" },
  weak: { label: "Weak", color: "#F1C028" },
  emerging: { label: "Emerging", color: "#9686B9" },
  none: { label: "No Data", color: "#E24D47" },
};

// ── Interactive Network Graph (SVG) ──
function NetworkGraph({
  factors,
  selectedFactor,
  onSelectFactor,
}: {
  factors: Factor[];
  selectedFactor: string | null;
  onSelectFactor: (id: string | null) => void;
}) {
  // Only render detailed factors (those with connections)
  const detailedFactors = factors.filter((f) => f.connections.length > 0);

  // Layout: circular arrangement
  const cx = 280;
  const cy = 220;
  const radius = 170;
  const positions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    detailedFactors.forEach((f, i) => {
      const angle = (i / detailedFactors.length) * Math.PI * 2 - Math.PI / 2;
      map[f.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
    return map;
  }, [detailedFactors]);

  // Collect all edges
  const edges: {
    from: string;
    to: string;
    type: "proven" | "hypothesized" | "emerging";
    strength: number;
  }[] = [];
  const edgeSet = new Set<string>();
  detailedFactors.forEach((f) => {
    f.connections.forEach((c) => {
      if (positions[c.targetFactorId]) {
        const key = [f.id, c.targetFactorId].sort().join("-");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ from: f.id, to: c.targetFactorId, type: c.type, strength: c.strength });
        }
      }
    });
  });

  const selectedConns = selectedFactor
    ? new Set(
        detailedFactors
          .find((f) => f.id === selectedFactor)
          ?.connections.map((c) => c.targetFactorId) ?? []
      )
    : null;

  return (
    <svg viewBox="0 0 560 440" className="w-full" style={{ maxHeight: 440 }}>
      {/* Edges */}
      {edges.map((edge, i) => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        if (!from || !to) return null;
        const isHighlighted =
          !selectedFactor ||
          edge.from === selectedFactor ||
          edge.to === selectedFactor;
        const opacity = selectedFactor ? (isHighlighted ? 1 : 0.08) : 0.4;
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={edge.type === "proven" ? "#1EAA55" : edge.type === "emerging" ? "#F1C028" : "#9686B9"}
            strokeWidth={Math.max(1, edge.strength * 3)}
            strokeDasharray={edge.type === "proven" ? "none" : edge.type === "emerging" ? "6 3" : "3 3"}
            opacity={opacity}
          />
        );
      })}

      {/* Nodes */}
      {detailedFactors.map((f) => {
        const pos = positions[f.id];
        if (!pos) return null;
        const catConf = CATEGORY_CONFIG[f.category];
        const isSelected = selectedFactor === f.id;
        const isConnected = selectedConns?.has(f.id);
        const dimmed = selectedFactor && !isSelected && !isConnected;

        return (
          <g
            key={f.id}
            onClick={() => onSelectFactor(isSelected ? null : f.id)}
            className="cursor-pointer"
            opacity={dimmed ? 0.15 : 1}
          >
            {/* Outer ring for selected */}
            {isSelected && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={28}
                fill="none"
                stroke={catConf.color}
                strokeWidth={2}
                opacity={0.5}
              />
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={22}
              fill={catConf.color}
              opacity={isSelected ? 1 : 0.85}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              fontSize={8}
              fontWeight={700}
            >
              {f.shortName}
            </text>
            {/* Label below */}
            <text
              x={pos.x}
              y={pos.y + 32}
              textAnchor="middle"
              fill={isSelected ? catConf.color : "var(--muted)"}
              fontSize={7.5}
              fontWeight={isSelected ? 700 : 400}
            >
              {f.shortName}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(10, 400)">
        <line x1={0} y1={6} x2={20} y2={6} stroke="#1EAA55" strokeWidth={2} />
        <text x={24} y={9} fontSize={8} fill="var(--muted)">Proven</text>
        <line x1={80} y1={6} x2={100} y2={6} stroke="#F1C028" strokeWidth={2} strokeDasharray="6 3" />
        <text x={104} y={9} fontSize={8} fill="var(--muted)">Emerging</text>
        <line x1={170} y1={6} x2={190} y2={6} stroke="#9686B9" strokeWidth={2} strokeDasharray="3 3" />
        <text x={194} y={9} fontSize={8} fill="var(--muted)">Hypothesized</text>
      </g>
    </svg>
  );
}

// ── Factor Detail Panel ──
function FactorDetail({ factor, factors }: { factor: Factor; factors: Factor[] }) {
  const catConf = CATEGORY_CONFIG[factor.category];
  const evidConf = EVIDENCE_CONFIG[factor.literatureStrength];

  return (
    <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: `${catConf.color}40`, backgroundColor: "var(--surface)" }}>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${catConf.color}14`, color: catConf.color }}
        >
          {catConf.label}
        </span>
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${evidConf.color}14`, color: evidConf.color }}
        >
          Evidence: {evidConf.label}
        </span>
        <span className="text-[9px] font-mono" style={{ color: "var(--muted-light)" }}>
          Pub readiness: {factor.publicationReadiness}%
        </span>
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{factor.name}</p>
      {factor.hypothesis && (
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{factor.hypothesis}</p>
      )}
      {factor.keyFindings && (
        <div className="rounded-lg p-3" style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Key Findings</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{factor.keyFindings}</p>
        </div>
      )}
      {factor.connections.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>Connections</p>
          <div className="space-y-1">
            {factor.connections.map((conn) => {
              const target = factors.find((f) => f.id === conn.targetFactorId);
              if (!target) return null;
              const connColor = conn.type === "proven" ? "#1EAA55" : conn.type === "emerging" ? "#F1C028" : "#9686B9";
              return (
                <div key={conn.targetFactorId} className="flex items-center gap-2 text-[11px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: connColor }} />
                  <span style={{ color: "var(--foreground)" }}>{target.shortName}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${connColor}14`, color: connColor }}>
                    {conn.type} &middot; {conn.direction}
                  </span>
                  <span className="text-[9px]" style={{ color: "var(--muted-light)" }}>
                    r={conn.strength.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Causal Chain Diagram ──
function CausalChainDiagram({ chain, factors }: { chain: CausalChain; factors: Factor[] }) {
  const [expanded, setExpanded] = useState(false);
  const statusConf = {
    proven: { label: "Proven", color: "#1EAA55" },
    partial: { label: "Partially Proven", color: "#F1C028" },
    hypothesized: { label: "Hypothesized", color: "#9686B9" },
  };
  const conf = statusConf[chain.evidenceStatus];

  return (
    <div
      className="rounded-xl border"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? <ChevronDown size={14} style={{ color: ACCENT }} /> : <ChevronRight size={14} style={{ color: "var(--muted)" }} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
            >
              {conf.label}
            </span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{chain.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>{chain.description}</p>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Chain flow */}
          <div className="mt-3 space-y-0">
            {chain.steps.map((step, i) => {
              const catConf = CATEGORY_CONFIG[
                factors.find((f) => f.id === step.factorId)?.category ?? "hormonal"
              ] ?? { color: ACCENT };
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 py-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${catConf.color}14` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: catConf.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{step.factorName}</p>
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>{step.mechanism}</p>
                    </div>
                    {step.timelag && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}>
                        {step.timelag}
                      </span>
                    )}
                  </div>
                  {i < chain.steps.length - 1 && (
                    <div className="ml-4 flex items-center gap-1 py-0.5">
                      <div className="w-px h-4" style={{ backgroundColor: "var(--border)" }} />
                      <ArrowRight size={10} style={{ color: "var(--muted-light)" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Clinical Implication</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{chain.clinicalImplication}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──
export default function DotConnector({
  factors,
  causalChains,
  interventionCascades,
}: Props) {
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FactorCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedFactorData = selectedFactor ? factors.find((f) => f.id === selectedFactor) : null;

  const detailedFactors = factors.filter((f) => f.connections.length > 0);
  const allCategories = Object.entries(CATEGORY_CONFIG);

  // Filter for 50-factor list
  const filteredFactors = factors.filter((f) => {
    if (filterCategory !== "all" && f.category !== filterCategory) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Network Graph */}
      <div
        className="rounded-2xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Network size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            The Dot Connector — Factor Network
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            Click a node to explore connections
          </span>
        </div>
        <NetworkGraph
          factors={factors}
          selectedFactor={selectedFactor}
          onSelectFactor={setSelectedFactor}
        />
        {selectedFactorData && (
          <div className="mt-3">
            <FactorDetail factor={selectedFactorData} factors={factors} />
          </div>
        )}
      </div>

      {/* 50 Factors Database */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            50 Factors Database
          </h3>
          <span className="text-[10px]" style={{ color: "var(--muted)" }}>
            {factors.length} factors tracked
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search factors..."
                className="pl-7 pr-3 py-1.5 rounded-lg border text-[11px] w-[160px]"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              />
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          <button
            onClick={() => setFilterCategory("all")}
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors"
            style={{
              backgroundColor: filterCategory === "all" ? ACCENT : "var(--background)",
              color: filterCategory === "all" ? "white" : "var(--muted)",
              border: `1px solid ${filterCategory === "all" ? ACCENT : "var(--border)"}`,
            }}
          >
            All ({factors.length})
          </button>
          {allCategories.map(([key, conf]) => {
            const count = factors.filter((f) => f.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilterCategory(key as FactorCategory)}
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors"
                style={{
                  backgroundColor: filterCategory === key ? conf.color : "var(--background)",
                  color: filterCategory === key ? "white" : conf.color,
                  border: `1px solid ${filterCategory === key ? conf.color : "var(--border)"}`,
                }}
              >
                {conf.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Factors list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[320px] overflow-y-auto">
          {filteredFactors.map((f) => {
            const catConf = CATEGORY_CONFIG[f.category];
            const evidConf = EVIDENCE_CONFIG[f.literatureStrength];
            const isDetailed = f.connections.length > 0;
            return (
              <button
                key={f.id}
                onClick={() => isDetailed ? setSelectedFactor(f.id) : undefined}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${isDetailed ? "cursor-pointer hover:border-[${catConf.color}]" : "opacity-60"}`}
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: catConf.color }} />
                <span className="text-[11px] flex-1 truncate" style={{ color: "var(--foreground)" }}>
                  {f.shortName}
                </span>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: evidConf.color }} />
                {f.publicationReadiness > 0 && (
                  <span className="text-[8px] font-mono" style={{ color: "var(--muted-light)" }}>
                    {f.publicationReadiness}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Causal Chain Mapping */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={14} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Causal Chain Mapping
          </h3>
        </div>
        <div className="space-y-3">
          {causalChains.map((chain) => (
            <CausalChainDiagram key={chain.id} chain={chain} factors={factors} />
          ))}
        </div>
      </div>

      {/* Fix the Root, Watch the Cascade */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color: "#1EAA55" }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Fix the Root, Watch the Cascade
          </h3>
          <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
            {interventionCascades.filter((c) => c.thesisConfirmed).length} thesis confirmations logged
          </span>
        </div>
        <div className="space-y-3">
          {interventionCascades.map((cascade) => (
            <div
              key={cascade.id}
              className={`rounded-xl border p-4 ${cascade.thesisConfirmed ? "ring-1" : ""}`}
              style={{
                borderColor: cascade.thesisConfirmed ? "#1EAA5540" : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {cascade.thesisConfirmed ? (
                  <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                ) : (
                  <Clock size={14} style={{ color: "#F1C028" }} />
                )}
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  Root: {cascade.rootFactor}
                </p>
                <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
                  {new Date(cascade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <p className="text-[11px] mb-3" style={{ color: "var(--muted)" }}>{cascade.intervention}</p>
              <div className="space-y-1.5">
                {cascade.cascadeSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {step.verified ? (
                      <CheckCircle2 size={11} style={{ color: "#1EAA55" }} />
                    ) : (
                      <Circle size={11} style={{ color: "#F1C028" }} />
                    )}
                    <span className="text-[11px] flex-1" style={{ color: step.verified ? "var(--foreground)" : "var(--muted)" }}>
                      {step.factor}: {step.change}
                    </span>
                    <span className="text-[9px] shrink-0" style={{ color: "var(--muted-light)" }}>
                      {step.timeAfter}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
