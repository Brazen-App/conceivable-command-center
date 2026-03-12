"use client";

import { useState } from "react";
import { User, Calendar, Flag, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  // Pregnancy Wellness Scoring Components
  {
    id: "preg-01",
    title: "Pregnancy Wellness Scoring Engine",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-04-15",
    column: "backlog",
    tags: ["pregnancy", "algorithm", "core"],
  },
  {
    id: "preg-02",
    title: "Pregnancy Messaging Engine",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-04-20",
    column: "backlog",
    tags: ["pregnancy", "messaging"],
  },
  {
    id: "preg-03",
    title: "OB Bridge Report Generator",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-04-25",
    column: "backlog",
    tags: ["pregnancy", "clinical", "pdf"],
  },
  {
    id: "preg-04",
    title: "Pregnancy Escalation Protocol Engine",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-04-30",
    column: "backlog",
    tags: ["pregnancy", "clinical", "safety"],
  },
  {
    id: "preg-05",
    title: "Tier 3 Modifier System",
    priority: "medium",
    assignee: "TBD",
    dueDate: "2026-05-05",
    column: "backlog",
    tags: ["pregnancy", "algorithm"],
  },
  // Postpartum Experience Components
  {
    id: "pp-01",
    title: "Luna Agent Engine",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-05-15",
    column: "backlog",
    tags: ["postpartum", "agent", "core"],
  },
  {
    id: "pp-02",
    title: "PPD Detection Algorithm",
    priority: "critical",
    assignee: "TBD",
    dueDate: "2026-05-20",
    column: "backlog",
    tags: ["postpartum", "algorithm", "safety"],
  },
  {
    id: "pp-03",
    title: "Postpartum Recovery Scoring Engine",
    priority: "high",
    assignee: "TBD",
    dueDate: "2026-05-25",
    column: "backlog",
    tags: ["postpartum", "algorithm", "core"],
  },
  {
    id: "pp-04",
    title: "Food Train System",
    priority: "medium",
    assignee: "TBD",
    dueDate: "2026-06-05",
    column: "backlog",
    tags: ["postpartum", "community", "social"],
  },
  {
    id: "pp-05",
    title: "Voice-First Input System",
    priority: "medium",
    assignee: "TBD",
    dueDate: "2026-06-10",
    column: "backlog",
    tags: ["postpartum", "ux", "nlp"],
  },
  {
    id: "pp-06",
    title: "Seren Escalation Protocol Engine",
    priority: "critical",
    assignee: "TBD",
    dueDate: "2026-05-30",
    column: "backlog",
    tags: ["postpartum", "safety", "clinical"],
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

      {/* Pregnancy Wellness Engine — Component Specs */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
          <h3
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "#D4A843" }}
          >
            Pregnancy Wellness Engine — Component Specifications
          </h3>
          <Link
            href="/departments/product/experiences/pregnancy/wellness-scoring-spec"
            className="flex items-center gap-1 text-[10px] font-medium ml-auto"
            style={{ color: "#D4A843" }}
          >
            <ExternalLink size={10} />
            Full Spec
          </Link>
        </div>

        <div className="space-y-2">
          {[
            {
              title: "Pregnancy Wellness Scoring Engine",
              desc: "Core scoring algorithm that calculates the Pregnancy Wellness Profile. Inputs: wearable data, self-reported data, face scan data, clinical history. Outputs: per-factor scores, composite wellness score, messaging state per factor, escalation level, monitoring frequency multiplier.",
              status: "Ready for Development",
              priority: "High — blocks all pregnancy features",
              deps: "Halo Ring data integration, user profile/clinical history schema, care team routing system",
            },
            {
              title: "Pregnancy Messaging Engine",
              desc: "Generates Kai's per-factor and score-change messages based on current factor scores, score trends, and trimester context. Four message tiers per factor (green/light green/amber/red). Anxiety-calibrated — never alarming.",
              status: "Ready for Development",
              priority: "High",
              deps: "Pregnancy Wellness Scoring Engine",
            },
            {
              title: "OB Bridge Report Generator",
              desc: "Auto-generates clinical summary reports from continuous monitoring data, aligned with OB appointment schedule. PDF export. Includes glucose trends, HRV, sleep, flags, and topics for discussion.",
              status: "Ready for Development",
              priority: "High",
              deps: "Pregnancy Wellness Scoring Engine, PDF generation library",
            },
            {
              title: "Pregnancy Escalation Protocol Engine",
              desc: "Three-level escalation system with safety triggers. Routes to care team (L1), recommends OB discussion (L2), or recommends urgent clinical contact (L3) based on factor scores and rate of change.",
              status: "Ready for Development",
              priority: "High",
              deps: "Pregnancy Wellness Scoring Engine, Care Team routing system",
            },
            {
              title: "Tier 3 Modifier System",
              desc: "Adjusts monitoring frequency and escalation thresholds based on fixed factors (maternal age, prior preterm history, autoimmune disease, multiple gestation, interpregnancy interval). Does NOT affect visible wellness score.",
              status: "Ready for Development",
              priority: "Medium",
              deps: "Pregnancy Wellness Scoring Engine, User clinical history schema",
            },
          ].map((comp) => (
            <div
              key={comp.title}
              className="rounded-xl border p-4"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                borderLeft: "3px solid #D4A843",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {comp.title}
                </h4>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
                  style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                >
                  {comp.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                {comp.desc}
              </p>
              <div className="flex items-center gap-4 text-[10px]">
                <span style={{ color: "#E24D47" }}>
                  <strong>Priority:</strong> {comp.priority}
                </span>
                <span style={{ color: "var(--muted)" }}>
                  <strong>Deps:</strong> {comp.deps}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Postpartum Recovery Engine — Component Specs */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#7CAE7A" }} />
          <h3
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "#7CAE7A" }}
          >
            Postpartum Recovery Engine — Component Specifications
          </h3>
        </div>

        <div className="space-y-2">
          {[
            {
              title: "Luna Agent Engine",
              desc: "New care team agent for lactation and postpartum recovery. Provides evidence-based breastfeeding support, supply optimization, mastitis/clog detection, and postpartum-specific recovery guidance. Judgment-free approach supporting breast, bottle, combo, and formula feeding.",
              status: "Spec In Progress",
              priority: "High — first new agent since launch",
              deps: "Care team routing system, feeding data schema, Olive nutrition integration",
            },
            {
              title: "PPD Detection Algorithm",
              desc: "Multi-signal passive monitoring for postpartum depression and anxiety. Combines HRV changes, sleep architecture analysis (separating voluntary from involuntary disruption), app engagement patterns, voice tone analysis, and EPDS scores. Sustained 5-7 day pattern recognition to avoid false positives.",
              status: "Spec In Progress",
              priority: "Critical — safety feature, blocks Seren escalation",
              deps: "Atlas biometric processing, Seren emotional wellness engine, clinical validation",
            },
            {
              title: "Postpartum Recovery Scoring Engine",
              desc: "Core scoring algorithm for postpartum recovery. Inputs: delivery type, complications, pre-pregnancy baseline, pregnancy wellness data, continuous biometrics. Outputs: recovery score, trajectory comparison, milestone tracking, deviation alerts.",
              status: "Spec In Progress",
              priority: "High — core postpartum feature",
              deps: "Pregnancy data pipeline, delivery intake form, recovery milestone schema",
            },
            {
              title: "Food Train System",
              desc: "Community meal coordination integrated with Olive's nutrition recommendations. Support network signup, meal scheduling, dietary restriction sharing, and nutrition-aligned meal suggestions. Simple interface for helpers.",
              status: "Design Phase",
              priority: "Medium",
              deps: "Olive nutrition engine, user invitation system, notification system",
            },
            {
              title: "Voice-First Input System",
              desc: "Voice-based check-ins and data entry for hands-free interaction. Natural language processing for symptom reporting, mood check-ins, and food logging. Whisper-mode for middle-of-the-night check-ins. Offline support with sync.",
              status: "Design Phase",
              priority: "Medium",
              deps: "Speech-to-text pipeline, NLP extraction, all agent integrations",
            },
            {
              title: "Seren Escalation Protocol Engine",
              desc: "Three-level postpartum-specific crisis response. L1: Seren self-manages mild mood disruption. L2: Clinical referral for sustained depression/anxiety markers. L3: Crisis protocol for suicidal ideation, psychosis indicators, harm risk. Warm handoff to crisis resources.",
              status: "Spec In Progress",
              priority: "Critical — safety-critical feature",
              deps: "PPD Detection Algorithm, Seren agent, clinical review of all scripts, legal review",
            },
          ].map((comp) => (
            <div
              key={comp.title}
              className="rounded-xl border p-4"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                borderLeft: "3px solid #7CAE7A",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {comp.title}
                </h4>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
                  style={{
                    backgroundColor: comp.status === "Design Phase" ? "#F59E0B14" : "#5A6FFF14",
                    color: comp.status === "Design Phase" ? "#F59E0B" : "#5A6FFF",
                  }}
                >
                  {comp.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                {comp.desc}
              </p>
              <div className="flex items-center gap-4 text-[10px]">
                <span style={{ color: "#E24D47" }}>
                  <strong>Priority:</strong> {comp.priority}
                </span>
                <span style={{ color: "var(--muted)" }}>
                  <strong>Deps:</strong> {comp.deps}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
