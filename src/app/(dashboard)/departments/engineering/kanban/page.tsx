"use client";

import { useState } from "react";
import { User, Calendar, Flag } from "lucide-react";

const ACCENT = "#6B7280";

type Column = "backlog" | "in_progress" | "review" | "done";
type Priority = "critical" | "high" | "medium" | "low";

interface KanbanCard {
  id: string;
  title: string;
  priority: Priority;
  assignee: string;
  dueDate: string;
  column: Column;
  tags?: string[];
}

const COLUMN_CONFIG: Record<Column, { label: string; color: string }> = {
  backlog: { label: "Backlog", color: "var(--muted)" },
  in_progress: { label: "In Progress", color: "#5A6FFF" },
  review: { label: "Review", color: "#F1C028" },
  done: { label: "Done", color: "#1EAA55" },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#E24D47" },
  high: { label: "High", color: "#F1C028" },
  medium: { label: "Medium", color: "#5A6FFF" },
  low: { label: "Low", color: "var(--muted)" },
};

const TASKS: KanbanCard[] = [
  {
    id: "t1",
    title: "Halo Ring BLE SDK Integration",
    priority: "critical",
    assignee: "Lakshmi",
    dueDate: "2026-03-07",
    column: "in_progress",
    tags: ["hardware", "mobile"],
  },
  {
    id: "t2",
    title: "Prisma schema: user biometrics tables",
    priority: "high",
    assignee: "Lakshmi",
    dueDate: "2026-03-05",
    column: "in_progress",
    tags: ["database"],
  },
  {
    id: "t3",
    title: "API route: /api/biometrics POST",
    priority: "high",
    assignee: "Lakshmi",
    dueDate: "2026-03-06",
    column: "in_progress",
    tags: ["api"],
  },
  {
    id: "t4",
    title: "Ovulation ML model prototype",
    priority: "critical",
    assignee: "Lakshmi",
    dueDate: "2026-03-10",
    column: "review",
    tags: ["ml", "algorithm"],
  },
  {
    id: "t5",
    title: "Command Center department nav polish",
    priority: "medium",
    assignee: "Lakshmi",
    dueDate: "2026-03-04",
    column: "review",
    tags: ["ui"],
  },
  {
    id: "t6",
    title: "Claude API prompt caching setup",
    priority: "high",
    assignee: "Lakshmi",
    dueDate: "2026-03-12",
    column: "backlog",
    tags: ["ai", "optimization"],
  },
  {
    id: "t7",
    title: "Vercel edge config for feature flags",
    priority: "medium",
    assignee: "Lakshmi",
    dueDate: "2026-03-15",
    column: "backlog",
    tags: ["infra"],
  },
  {
    id: "t8",
    title: "Email template renderer component",
    priority: "medium",
    assignee: "Lakshmi",
    dueDate: "2026-03-18",
    column: "backlog",
    tags: ["email", "ui"],
  },
  {
    id: "t9",
    title: "Set up Sentry error tracking",
    priority: "low",
    assignee: "Lakshmi",
    dueDate: "2026-03-20",
    column: "backlog",
    tags: ["monitoring"],
  },
  {
    id: "t10",
    title: "Prisma migrations: product_data tables",
    priority: "high",
    assignee: "Lakshmi",
    dueDate: "2026-02-28",
    column: "done",
    tags: ["database"],
  },
  {
    id: "t11",
    title: "Finance API route with mock data",
    priority: "medium",
    assignee: "Lakshmi",
    dueDate: "2026-02-25",
    column: "done",
    tags: ["api"],
  },
  {
    id: "t12",
    title: "Department layout component refactor",
    priority: "medium",
    assignee: "Lakshmi",
    dueDate: "2026-02-26",
    column: "done",
    tags: ["ui", "refactor"],
  },
];

export default function KanbanPage() {
  const columns: Column[] = ["backlog", "in_progress", "review", "done"];

  return (
    <div>
      {/* Intro */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          Engineering Kanban &mdash; Lakshmi&apos;s Task Board
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          All engineering tasks organized by status. Drag-and-drop coming soon.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((colId) => {
          const config = COLUMN_CONFIG[colId];
          const colTasks = TASKS.filter((t) => t.column === colId);

          return (
            <div key={colId}>
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                <h3
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: config.color }}
                >
                  {config.label}
                </h3>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: `${config.color}14`, color: config.color }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {colTasks.length === 0 ? (
                  <div
                    className="rounded-xl border-2 border-dashed p-6 text-center"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      No tasks
                    </p>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const priorityConf = PRIORITY_CONFIG[task.priority];
                    return (
                      <div
                        key={task.id}
                        className="rounded-xl border p-3 hover:shadow-sm transition-shadow"
                        style={{
                          borderColor: "var(--border)",
                          backgroundColor: "var(--surface)",
                          borderLeft: `3px solid ${priorityConf.color}`,
                        }}
                      >
                        <p className="text-xs font-medium mb-2" style={{ color: "var(--foreground)" }}>
                          {task.title}
                        </p>
                        {task.tags && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <User size={10} style={{ color: "var(--muted)" }} />
                            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                              {task.assignee}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={10} style={{ color: "var(--muted)" }} />
                            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <Flag size={9} style={{ color: priorityConf.color }} />
                          <span
                            className="text-[8px] font-bold uppercase tracking-wider"
                            style={{ color: priorityConf.color }}
                          >
                            {priorityConf.label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
