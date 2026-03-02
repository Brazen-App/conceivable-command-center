"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Circle,
  FileText,
  ExternalLink,
  Link2,
  ArrowUpRight,
  Briefcase,
  RefreshCw,
  Shield,
  FlaskConical,
  BarChart3,
  Users,
  Newspaper,
  FolderOpen,
  Package,
  Monitor,
} from "lucide-react";
import type { PitchMaterial } from "@/lib/data/fundraising-data";

const ACCENT = "#356FB6";

interface Props {
  materials: PitchMaterial[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  ready: { label: "Ready", color: "#1EAA55", Icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "#F1C028", Icon: Clock },
  not_started: { label: "Not Started", color: "#9686B9", Icon: Circle },
};

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  pitch: Briefcase,
  financial: BarChart3,
  product: Monitor,
  team: Users,
  ip: Shield,
  market: BarChart3,
  clinical: FlaskConical,
  press: Newspaper,
  dataroom: FolderOpen,
};

export default function PitchMaterials({ materials }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const readyCount = materials.filter((m) => m.status === "ready").length;
  const inProgressCount = materials.filter((m) => m.status === "in_progress").length;
  const notStartedCount = materials.filter((m) => m.status === "not_started").length;
  const completionPct = Math.round((readyCount / materials.length) * 100);

  return (
    <div>
      {/* Progress overview */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 100%)`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Package className="text-white" size={20} strokeWidth={2} />
            <div>
              <p className="text-white font-semibold text-sm">Pitch Materials & Data Room</p>
              <p className="text-white/60 text-xs">
                {readyCount} of {materials.length} materials ready
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">{completionPct}%</p>
            <p className="text-white/50 text-[8px] uppercase tracking-wider">Complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completionPct}%`,
              background: `linear-gradient(90deg, #1EAA55, #78C3BF)`,
            }}
          />
        </div>

        {/* Status counts */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-green-200 text-[9px] uppercase tracking-wider">Ready</p>
            <p className="text-white text-lg font-bold">{readyCount}</p>
          </div>
          <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-yellow-200 text-[9px] uppercase tracking-wider">In Progress</p>
            <p className="text-white text-lg font-bold">{inProgressCount}</p>
          </div>
          <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Not Started</p>
            <p className="text-white text-lg font-bold">{notStartedCount}</p>
          </div>
        </div>
      </div>

      {/* Materials checklist */}
      <div className="space-y-2">
        {materials.map((mat) => {
          const statusConf = STATUS_CONFIG[mat.status];
          const StatusIcon = statusConf.Icon;
          const CategoryIcon = CATEGORY_ICONS[mat.category] || FileText;
          const isExpanded = expandedId === mat.id;

          return (
            <div
              key={mat.id}
              className="rounded-xl border transition-all"
              style={{
                borderColor: isExpanded ? `${ACCENT}40` : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : mat.id)}
              >
                {/* Status icon */}
                <StatusIcon size={18} style={{ color: statusConf.color }} className="shrink-0" />

                {/* Category icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${ACCENT}10` }}
                >
                  <CategoryIcon size={14} style={{ color: ACCENT }} />
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {mat.title}
                  </p>
                  {mat.version && (
                    <span className="text-[10px] font-mono" style={{ color: "var(--muted-light)" }}>
                      {mat.version}
                    </span>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                >
                  {statusConf.label}
                </span>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                  {/* Notes */}
                  {mat.notes && (
                    <div
                      className="rounded-lg p-3 mt-3 text-xs leading-relaxed"
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                    >
                      {mat.notes}
                    </div>
                  )}

                  {/* Cross-dept connection */}
                  {mat.crossDeptConnection && (
                    <div
                      className="rounded-lg p-3 flex items-start gap-2"
                      style={{ backgroundColor: "#E24D4708", borderLeft: "3px solid #E24D47" }}
                    >
                      <ArrowUpRight size={12} className="shrink-0 mt-0.5" style={{ color: "#E24D47" }} />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#E24D47" }}>
                          Cross-Department Connection
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {mat.crossDeptConnection}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Last updated + actions */}
                  <div className="flex items-center justify-between">
                    {mat.lastUpdated && (
                      <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--muted)" }}>
                        <RefreshCw size={9} />
                        Updated {new Date(mat.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {mat.link && (
                        <a
                          href={mat.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                          style={{ borderColor: "var(--border)", color: ACCENT }}
                        >
                          <ExternalLink size={10} />
                          Open
                        </a>
                      )}
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        <Link2 size={10} />
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
