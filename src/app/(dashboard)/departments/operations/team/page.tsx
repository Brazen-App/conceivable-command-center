"use client";

import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const ACCENT = "#5A6FFF";

interface TeamMember {
  name: string;
  role: string;
  currentFocus: string;
  workload: "light" | "medium" | "heavy";
  uniqueAbility: string;
  avatar: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Kirsten Karchmer",
    role: "CEO",
    currentFocus: "Fundraising, investor outreach, product vision",
    workload: "heavy",
    uniqueAbility: "Vision, Science, Relationships, Storytelling. Did 120 podcasts in 4 months. Her presence converts skeptics into believers.",
    avatar: "KK",
  },
  {
    name: "Lakshmi",
    role: "Engineering Lead",
    currentFocus: "Platform infrastructure, API development, deployment pipeline",
    workload: "heavy",
    uniqueAbility: "Full-stack architecture, database design, performance optimization. Turns product specs into production systems.",
    avatar: "L",
  },
  {
    name: "VA",
    role: "Virtual Assistant",
    currentFocus: "Calendar management, scheduling, email triage, administrative coordination",
    workload: "medium",
    uniqueAbility: "Admin & Scheduling. Protects the CEO's calendar and ensures nothing falls through the cracks.",
    avatar: "VA",
  },
  {
    name: "Joy",
    role: "Design & Brand",
    currentFocus: "Brand book execution, UI/UX design, marketing assets",
    workload: "medium",
    uniqueAbility: "Visual storytelling and brand consistency. Translates the Conceivable brand into every touchpoint.",
    avatar: "J",
  },
  {
    name: "Joy",
    role: "Partnerships & Outreach",
    currentFocus: "Affiliate partnerships, community outreach, strategic introductions",
    workload: "medium",
    uniqueAbility: "Relationship building and partnership development. Opens doors the CEO walks through.",
    avatar: "J",
  },
];

const WORKLOAD_CONFIG = {
  light: { label: "Light", color: "#1EAA55", width: "33%" },
  medium: { label: "Medium", color: "#F1C028", width: "66%" },
  heavy: { label: "Heavy", color: "#E24D47", width: "100%" },
};

interface UAViolation {
  task: string;
  hoursPerWeek: number;
  suggestedOwner: string;
  reasoning: string;
}

const UA_VIOLATIONS: UAViolation[] = [
  {
    task: "Reviewing and editing individual email copy",
    hoursPerWeek: 3,
    suggestedOwner: "Content Engine Agent + Legal Compliance Review",
    reasoning: "The emails have been through compliance review. Your unique ability is the science and the relationships -- not copyediting. Trust the system you built.",
  },
  {
    task: "Manually responding to community member questions",
    hoursPerWeek: 4,
    suggestedOwner: "Community Agent (CEO-required items only)",
    reasoning: "Only 3 of 6 items in the response queue actually require your expertise. The other 3 are template-answerable.",
  },
  {
    task: "Building and configuring the Command Center",
    hoursPerWeek: 8,
    suggestedOwner: "Development team / Claude Code",
    reasoning: "You've been the 'how' when you should be the 'who decides what to build.' Spec what you need, let the system build it.",
  },
];

export default function TeamPage() {
  const totalUAHours = UA_VIOLATIONS.reduce((sum, v) => sum + v.hoursPerWeek, 0);

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Team Roster */}
      <section className="mb-10">
        <h2
          className="font-caption mb-4"
          style={{
            fontFamily: "var(--font-caption)",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Team Roster
        </h2>
        <div className="space-y-3">
          {TEAM.map((member) => {
            const workloadConf = WORKLOAD_CONFIG[member.workload];
            return (
              <div
                key={member.name}
                className="rounded-xl border p-5"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {member.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + Role */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {member.name}
                      </h3>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                      >
                        {member.role}
                      </span>
                    </div>

                    {/* Current Focus */}
                    <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>Focus: </span>
                      {member.currentFocus}
                    </p>

                    {/* Workload indicator */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Workload
                      </span>
                      <div className="flex-1 max-w-[200px] h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: workloadConf.width, backgroundColor: workloadConf.color }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: workloadConf.color }}
                      >
                        {workloadConf.label}
                      </span>
                    </div>

                    {/* Unique Ability */}
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: `${ACCENT}06`, borderLeft: `3px solid ${ACCENT}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                        Unique Ability
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {member.uniqueAbility}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Unique Ability Violations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={14} style={{ color: "#E24D47" }} />
          <h2
            className="font-caption"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            Unique Ability Violations
          </h2>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: "#E24D4714", color: "#E24D47" }}
          >
            {totalUAHours}h/week flagged for delegation
          </span>
        </div>

        <div
          className="rounded-xl border-2 border-dashed p-4 mb-4"
          style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4706" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
            <span className="font-semibold" style={{ color: "#E24D47" }}>Alert: </span>
            Kirsten is spending {totalUAHours} hours/week on non-Unique Ability tasks.
            That is {totalUAHours} hours not spent on vision, science, relationships, and storytelling
            -- the activities only she can do and that create the most value.
          </p>
        </div>

        <div className="space-y-3">
          {UA_VIOLATIONS.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {v.task}
                </p>
                <span className="text-xs font-bold shrink-0 ml-2" style={{ color: "#E24D47" }}>
                  {v.hoursPerWeek}h/wk
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                {v.reasoning}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>CEO</span>
                <ArrowRight size={10} style={{ color: "var(--muted)" }} />
                <span className="text-[10px] font-semibold" style={{ color: ACCENT }}>
                  {v.suggestedOwner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
