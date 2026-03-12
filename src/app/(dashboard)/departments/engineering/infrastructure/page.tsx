"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Database,
  Sparkles,
  Server,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const BRAND_BLUE = "#5A6FFF";
const BRAND_GREEN = "#1EAA55";

interface InfraData {
  database?: { connected: boolean; totalRecords?: number };
  integrations?: Record<string, { connected: boolean; name: string }>;
}

const INFRA_STACK = [
  {
    name: "Vercel",
    role: "Hosting & Deployment",
    icon: Globe,
    color: "#000000",
    details: [
      "Edge network (global CDN)",
      "Serverless API routes",
      "Auto-deploy from main branch",
      "Preview deploys on PRs",
    ],
    link: "https://vercel.com/kirsten-3720s-projects/conceivable-command-center",
  },
  {
    name: "PostgreSQL + Prisma",
    role: "Database & ORM",
    icon: Database,
    color: BRAND_GREEN,
    details: [
      "Managed PostgreSQL on Vercel",
      "Prisma ORM with type safety",
      "Experiences, Features, ChatLogs schema",
      "Auto-migrations on deploy",
    ],
  },
  {
    name: "Anthropic Claude",
    role: "AI Engine",
    icon: Sparkles,
    color: "#D4A843",
    details: [
      "Powers 7 care team agents",
      "Product Coach for all experiences",
      "Structured prompts with shared context",
      "Token-efficient department briefs",
    ],
  },
  {
    name: "Next.js 14",
    role: "Application Framework",
    icon: Server,
    color: BRAND_BLUE,
    details: [
      "App Router with TypeScript",
      "Server components + client interactivity",
      "API routes for all data operations",
      "Tailwind CSS with brand design system",
    ],
  },
];

export default function InfrastructurePage() {
  const [data, setData] = useState<InfraData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/engineering/status")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  const dbRecords = data?.database?.totalRecords || 0;
  const connectedServices = data?.integrations
    ? Object.values(data.integrations).filter((i) => i.connected).length
    : 0;

  return (
    <div>
      {/* Summary */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND_BLUE}10, ${BRAND_GREEN}06)`,
          border: `1px solid ${BRAND_BLUE}15`,
        }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${BRAND_GREEN}, transparent)` }} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {[
            { label: "Platform", value: "Vercel", color: "var(--foreground)" },
            { label: "Database", value: data?.database?.connected ? "Connected" : "—", color: data?.database?.connected ? BRAND_GREEN : "var(--muted)" },
            { label: "DB Records", value: dbRecords > 0 ? dbRecords.toLocaleString() : "—", color: dbRecords > 0 ? BRAND_BLUE : "var(--muted)" },
            { label: "Services", value: `${connectedServices} active`, color: BRAND_GREEN },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Stack */}
      <div className="space-y-3 mb-6">
        {INFRA_STACK.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="rounded-2xl p-5 hover:shadow-sm transition-all"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${item.color}`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}12` }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${item.color}12`, color: item.color }}>
                      {item.role}
                    </span>
                    <CheckCircle2 size={14} className="ml-auto" style={{ color: BRAND_GREEN }} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {item.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px]" style={{ color: "var(--muted)" }}>{detail}</span>
                      </div>
                    ))}
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium"
                      style={{ color: item.color }}
                    >
                      <ExternalLink size={10} />
                      Open Dashboard
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/departments/engineering/integrations"
          className="rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-all"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND_BLUE}14` }}>
            <Server size={14} style={{ color: BRAND_BLUE }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Integration Hub</p>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>All connected services</p>
          </div>
          <ExternalLink size={12} style={{ color: "var(--muted)" }} />
        </Link>
        <Link
          href="/departments/engineering/architecture"
          className="rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-all"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND_GREEN}14` }}>
            <Database size={14} style={{ color: BRAND_GREEN }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>Architecture</p>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>Tech stack & ADRs</p>
          </div>
          <ExternalLink size={12} style={{ color: "var(--muted)" }} />
        </Link>
      </div>
    </div>
  );
}
