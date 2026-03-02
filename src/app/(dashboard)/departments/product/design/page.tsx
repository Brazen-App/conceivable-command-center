"use client";

import {
  Palette,
  CheckCircle2,
  AlertCircle,
  Layers,
  Paintbrush,
  Layout,
} from "lucide-react";

const ACCENT = "#ACB7FF";

/* ── Component Library Overview ── */
const COMPONENT_CATEGORIES = [
  { name: "Layout", count: 8, total: 10, description: "Page shells, grid systems, navigation patterns" },
  { name: "Data Display", count: 12, total: 18, description: "Cards, tables, metrics, charts, status indicators" },
  { name: "Forms & Input", count: 5, total: 12, description: "Text fields, selects, date pickers, toggles" },
  { name: "Feedback", count: 4, total: 8, description: "Alerts, toasts, loading states, empty states" },
  { name: "Navigation", count: 6, total: 8, description: "Tabs, breadcrumbs, sidebars, mobile menu" },
  { name: "Brand", count: 7, total: 7, description: "Colors, typography, icons, logos, gradients" },
];

/* ── Brand Compliance ── */
const BRAND_CHECKS = [
  { label: "Primary colors used consistently", status: "pass" as const },
  { label: "Typography hierarchy (Youth / Rauschen / Inter)", status: "pass" as const },
  { label: "Icon style: 1pt outline, informative not decorative", status: "pass" as const },
  { label: "Background: #F9F7F0 (Off White) across all pages", status: "pass" as const },
  { label: "Gradient usage follows brand book specs", status: "partial" as const },
  { label: "Kai (AI Coach) visual identity separated", status: "pending" as const },
  { label: "Mobile responsive breakpoints", status: "pass" as const },
  { label: "Accessibility: contrast ratios WCAG AA", status: "partial" as const },
];

/* ── Design System Stats ── */
const DESIGN_STATS = {
  componentsBuilt: 42,
  totalPlanned: 63,
  coverage: 67,
  tokensUsed: 24,
  colorPalette: 12,
  fontWeights: 4,
};

/* ── Active Design Tasks ── */
const DESIGN_TASKS = [
  { title: "50-Factor Dashboard wireframes", status: "in_progress" as const, assignee: "Design", dueDate: "2026-03-10" },
  { title: "Halo Ring onboarding flow mockups", status: "in_progress" as const, assignee: "Design", dueDate: "2026-03-08" },
  { title: "Partner Dashboard UX research", status: "planned" as const, assignee: "Product", dueDate: "2026-03-20" },
  { title: "Kai chat interface design", status: "planned" as const, assignee: "Design", dueDate: "2026-03-25" },
  { title: "Mobile navigation redesign", status: "review" as const, assignee: "Design", dueDate: "2026-03-05" },
  { title: "Brand gradient exploration for verticals", status: "done" as const, assignee: "Design", dueDate: "2026-02-28" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pass: { label: "Pass", color: "#1EAA55" },
  partial: { label: "Partial", color: "#F1C028" },
  pending: { label: "Pending", color: "var(--muted)" },
};

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  in_progress: { label: "In Progress", color: "#5A6FFF" },
  planned: { label: "Planned", color: "var(--muted)" },
  review: { label: "Review", color: "#F1C028" },
  done: { label: "Done", color: "#1EAA55" },
};

export default function DesignPage() {
  const totalBuilt = COMPONENT_CATEGORIES.reduce((a, c) => a + c.count, 0);
  const totalPlanned = COMPONENT_CATEGORIES.reduce((a, c) => a + c.total, 0);

  return (
    <div>
      {/* Design System Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: ACCENT }}>
            {totalBuilt}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Components Built</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {totalPlanned}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Total Planned</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "#1EAA55" }}>
            {Math.round((totalBuilt / totalPlanned) * 100)}%
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Coverage</p>
        </div>
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {DESIGN_STATS.colorPalette}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Brand Colors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Component Library */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layers size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Component Library
            </h3>
          </div>
          <div className="space-y-3">
            {COMPONENT_CATEGORIES.map((cat) => {
              const pct = Math.round((cat.count / cat.total) * 100);
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                        {cat.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {cat.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{ color: pct === 100 ? "#1EAA55" : ACCENT }}>
                      {cat.count}/{cat.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: `${ACCENT}15` }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#1EAA55" : ACCENT }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Compliance */}
        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Paintbrush size={16} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Brand Compliance
            </h3>
          </div>
          <div className="space-y-2">
            {BRAND_CHECKS.map((check) => {
              const conf = STATUS_CONFIG[check.status];
              return (
                <div
                  key={check.label}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  {check.status === "pass" ? (
                    <CheckCircle2 size={16} style={{ color: conf.color }} />
                  ) : check.status === "partial" ? (
                    <AlertCircle size={16} style={{ color: conf.color }} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: conf.color }} />
                  )}
                  <p className="text-xs flex-1" style={{ color: "var(--foreground)" }}>
                    {check.label}
                  </p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
                  >
                    {conf.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Design Tasks */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Layout size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Active Design Tasks
          </h3>
        </div>
        <div className="space-y-2">
          {DESIGN_TASKS.map((task, i) => {
            const conf = TASK_STATUS_CONFIG[task.status];
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {task.assignee}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Due: {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
                >
                  {conf.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
