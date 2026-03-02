"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Mic,
  FolderOpen,
  LayoutTemplate,
  Brain,
  Linkedin,
  Globe,
  Instagram,
  Facebook,
  Pin,
  Users,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const ACCENT = "#5A6FFF";

// --- Mock Data ---

const DAILY_BRIEF_ITEMS = [
  {
    id: "db-1",
    type: "news" as const,
    title: "New Study: CoQ10 Supplementation Improves Oocyte Quality in Women Over 35",
    source: "Fertility & Sterility, Feb 2026",
    relevance: 9.2,
    status: "new" as const,
  },
  {
    id: "db-2",
    type: "news" as const,
    title: "FDA Clears First AI-Powered Fertility Monitoring Device",
    source: "MedTech Dive",
    relevance: 8.8,
    status: "new" as const,
  },
  {
    id: "db-3",
    type: "research" as const,
    title: "Circadian Rhythm Disruption and Its Impact on Implantation Rates",
    source: "Nature Medicine",
    relevance: 8.5,
    status: "new" as const,
  },
  {
    id: "db-4",
    type: "reddit" as const,
    title: "r/TryingForABaby — 'Has anyone tried Conceivable? Looking for real reviews'",
    source: "Reddit",
    relevance: 9.5,
    status: "review" as const,
  },
  {
    id: "db-5",
    type: "reddit" as const,
    title: "r/infertility — 'AI fertility apps: science or snake oil?'",
    source: "Reddit",
    relevance: 8.9,
    status: "review" as const,
  },
];

const CONTENT_VAULT_ITEMS = [
  { id: "cv-1", title: "BBT Tracking: The Complete Guide", type: "Long-form", status: "approved", date: "2026-02-25" },
  { id: "cv-2", title: "5 Signs Your Luteal Phase Needs Attention", type: "Carousel", status: "approved", date: "2026-02-22" },
  { id: "cv-3", title: "Why Personalized Fertility Care Matters", type: "Video Script", status: "approved", date: "2026-02-20" },
  { id: "cv-4", title: "The Science Behind Conceivable's AI", type: "Blog Post", status: "approved", date: "2026-02-18" },
  { id: "cv-5", title: "Glucose & Fertility: What the Data Shows", type: "Thread", status: "approved", date: "2026-02-15" },
];

const PLATFORM_GROUPS = [
  {
    name: "Professional",
    platforms: ["LinkedIn", "X", "Bluesky"],
    icon: Linkedin,
    color: "#356FB6",
    scheduled: 8,
    publishedToday: 2,
    engagementScore: 78,
  },
  {
    name: "Social",
    platforms: ["Instagram", "Facebook"],
    icon: Instagram,
    color: "#E37FB1",
    scheduled: 5,
    publishedToday: 1,
    engagementScore: 65,
  },
  {
    name: "Visual",
    platforms: ["Pinterest"],
    icon: Pin,
    color: "#E24D47",
    scheduled: 3,
    publishedToday: 0,
    engagementScore: 42,
  },
  {
    name: "Community",
    platforms: ["Circle"],
    icon: Users,
    color: "#1EAA55",
    scheduled: 4,
    publishedToday: 2,
    engagementScore: 91,
  },
];

const DEPLOYMENT_STRATEGIES = [
  { source: "1 POV Recording", output: "5 platform-specific posts", multiplier: "5x" },
  { source: "1 Research Article", output: "Thread + Carousel + Blog + 2 Social", multiplier: "5x" },
  { source: "1 Expert Interview", output: "10 clips + Blog + Newsletter + Community Post", multiplier: "13x" },
  { source: "1 Reddit Insight", output: "Response + Thread + FAQ Update", multiplier: "3x" },
];

export default function MarketingContentPage() {
  const [activeSection, setActiveSection] = useState<"brief" | "vault" | "deploy">("brief");

  return (
    <div className="space-y-6">
      {/* Quick Stats Banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Sparkles size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {DAILY_BRIEF_ITEMS.length} items to review today
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {CONTENT_VAULT_ITEMS.length} approved pieces in vault &middot;{" "}
              {PLATFORM_GROUPS.reduce((s, g) => s + g.scheduled, 0)} scheduled across platforms
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold" style={{ color: ACCENT }}>
            37
          </span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            / 100 weekly target
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "brief" as const, label: "Daily Brief", icon: Newspaper },
          { id: "vault" as const, label: "Content Vault", icon: FolderOpen },
          { id: "deploy" as const, label: "Content Brain", icon: Brain },
        ].map((sec) => {
          const active = activeSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                active
                  ? { backgroundColor: `${ACCENT}14`, color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} />
              {sec.label}
            </button>
          );
        })}
        <a
          href="/departments/content/templates"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-auto"
          style={{ color: "var(--muted)" }}
        >
          <LayoutTemplate size={15} />
          Template Gallery
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Daily Brief */}
      {activeSection === "brief" && (
        <div className="space-y-4">
          {/* POV Recording Prompt */}
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: `${ACCENT}14` }}
              >
                <Mic size={20} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Record Your POV
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Tap to record a 2-minute take on any item below. The Content Brain turns it into 5+ platform-ready pieces.
                </p>
              </div>
            </div>
          </div>

          {/* News / Research / Reddit Items */}
          <div className="space-y-3">
            {DAILY_BRIEF_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl p-4 flex items-start gap-4"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0"
                  style={{
                    backgroundColor:
                      item.type === "news"
                        ? "#356FB614"
                        : item.type === "research"
                        ? "#9686B914"
                        : "#F1C02814",
                    color:
                      item.type === "news"
                        ? "#356FB6"
                        : item.type === "research"
                        ? "#9686B9"
                        : "#F1C028",
                  }}
                >
                  {item.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {item.source} &middot; Relevance: {item.relevance}/10
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "review" && (
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#F1C02814", color: "#F1C028" }}
                    >
                      NEEDS REVIEW
                    </span>
                  )}
                  <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${ACCENT}14` }}
                    title="Record POV"
                  >
                    <Mic size={14} style={{ color: ACCENT }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Vault */}
      {activeSection === "vault" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Approved Content Library
            </p>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {CONTENT_VAULT_ITEMS.length} pieces
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {CONTENT_VAULT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3 flex items-center gap-3"
                style={{ backgroundColor: "var(--background)" }}
              >
                <CheckCircle2 size={16} style={{ color: "#1EAA55" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {item.type} &middot; {item.date}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                >
                  APPROVED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Brain Deployment Strategy */}
      {activeSection === "deploy" && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              Content Brain: Input-to-Output Multiplier
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Every piece of source material gets multiplied across platforms automatically.
              CEO records POV (Unique Ability), agents handle deployment (Who Not How).
            </p>
            <div className="space-y-3">
              {DEPLOYMENT_STRATEGIES.map((strategy, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="px-2 py-1 rounded text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                  >
                    {strategy.multiplier}
                  </div>
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>
                    {strategy.source}
                  </span>
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    {strategy.output}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Groups */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Platform Distribution
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.name}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} style={{ color: group.color }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {group.name}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                  {group.platforms.join(" + ")}
                </p>
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Scheduled</span>
                    <span style={{ color: "var(--foreground)" }}>{group.scheduled}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Published Today</span>
                    <span style={{ color: "var(--foreground)" }}>{group.publishedToday}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Engagement</span>
                    <span style={{ color: group.color, fontWeight: 600 }}>{group.engagementScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
