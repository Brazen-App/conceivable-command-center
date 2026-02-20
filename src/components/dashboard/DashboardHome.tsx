"use client";

import {
  Newspaper,
  PenTool,
  TrendingUp,
  Upload,
  Crown,
  Megaphone,
  Scale,
  FlaskConical,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
  {
    title: "Morning Brief",
    description: "View today's curated stories",
    icon: Newspaper,
    href: "/briefs",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    title: "Create Content",
    description: "Generate multi-platform content",
    icon: PenTool,
    href: "/content",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
  },
  {
    title: "Viral Insights",
    description: "Trending content analysis",
    icon: TrendingUp,
    href: "/content/viral",
    color: "#EC4899",
    bgColor: "#FCE7F3",
  },
  {
    title: "Training Data",
    description: "Upload documents to train voice",
    icon: Upload,
    href: "/documents",
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
];

const AGENT_CARDS = [
  {
    name: "Executive Coach",
    description: "Strategic advisor modeled after Bill Campbell",
    icon: Crown,
    href: "/agents/executive-coach",
    color: "#8B5CF6",
    status: "online" as const,
  },
  {
    name: "Marketing",
    description: "Brand strategy and growth for women 20-40",
    icon: Megaphone,
    href: "/agents/marketing",
    color: "#EC4899",
    status: "online" as const,
  },
  {
    name: "Legal",
    description: "FDA compliance, HIPAA, contracts",
    icon: Scale,
    href: "/agents/legal",
    color: "#6366F1",
    status: "online" as const,
  },
  {
    name: "Scientific Research",
    description: "Clinical literature and evidence review",
    icon: FlaskConical,
    href: "/agents/scientific-research",
    color: "#10B981",
    status: "online" as const,
  },
];

export default function DashboardHome() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-8 max-w-6xl">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
          {greeting}
        </h2>
        <p className="mt-1" style={{ color: "var(--muted)" }}>
          Here&apos;s your Conceivable command center overview.
        </p>
      </div>

      {/* Status Banner */}
      <div
        className="rounded-xl p-5 mb-8 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
        }}
      >
        <Activity className="text-white" size={24} />
        <div className="flex-1">
          <p className="text-white font-medium">Content Engine Active</p>
          <p className="text-white/70 text-sm">
            All 5 agent divisions are online and ready. Morning brief pipeline scheduled for 7:00 AM.
          </p>
        </div>
        <Link
          href="/briefs"
          className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 flex items-center gap-2"
        >
          View Brief <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Actions */}
      <section className="mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-xl border p-5 hover:shadow-md"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <h4 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                  {action.title}
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Agent Divisions */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
          Agent Divisions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENT_CARDS.map((agent) => {
            const Icon = agent.icon;
            return (
              <Link
                key={agent.href}
                href={agent.href}
                className="group rounded-xl border p-5 hover:shadow-md flex items-start gap-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${agent.color}15` }}
                >
                  <Icon size={20} style={{ color: agent.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {agent.name}
                    </h4>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--status-success)" }}
                      />
                      <span className="text-xs" style={{ color: "var(--status-success)" }}>
                        {agent.status}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {agent.description}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 mt-1"
                  style={{ color: "var(--muted)" }}
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
