"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  GitCommit,
  Globe,
  Database,
  Loader2,
  FileText,
  Wrench,
  Zap,
  ArrowRight,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const BRAND_BLUE = "#5A6FFF";
const BRAND_BABY_BLUE = "#ACB7FF";
const BRAND_GREEN = "#1EAA55";

interface StatusData {
  database?: {
    connected: boolean;
    experiences?: number;
    features?: number;
    chatLogs?: number;
    totalRecords?: number;
  };
  vercel?: {
    connected: boolean;
    needsToken?: boolean;
    deployments?: {
      id: string;
      url: string;
      state: string;
      createdAt: number;
      meta?: { githubCommitMessage?: string; githubCommitSha?: string };
    }[];
  };
  github?: {
    connected: boolean;
    needsToken?: boolean;
    recentCommits?: {
      sha: string;
      message: string;
      date: string;
      author: string;
    }[];
  };
  integrations?: Record<string, { connected: boolean; name: string }>;
}

export default function EngineeringDashboardPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/engineering/status")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const dbConnected = data?.database?.connected ?? false;
  const vercelConnected = data?.vercel?.connected ?? false;
  const githubConnected = data?.github?.connected ?? false;
  const integrations = data?.integrations ?? {};
  const connectedCount = Object.values(integrations).filter((i) => i.connected).length;
  const totalIntegrations = Object.keys(integrations).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Hero: System Health */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: dbConnected
            ? `linear-gradient(135deg, ${BRAND_GREEN}12, ${BRAND_BLUE}08, ${BRAND_BABY_BLUE}06)`
            : `linear-gradient(135deg, #F59E0B12, #F59E0B06)`,
          border: `1px solid ${dbConnected ? BRAND_GREEN : "#F59E0B"}20`,
        }}
      >
        {/* Subtle decorative gradient circle */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${BRAND_BLUE}, transparent)` }}
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
              style={{ color: dbConnected ? BRAND_GREEN : "#F59E0B" }}
            >
              System Health
            </p>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              {dbConnected ? (
                <CheckCircle2 size={22} style={{ color: BRAND_GREEN }} />
              ) : (
                <AlertCircle size={22} style={{ color: "#F59E0B" }} />
              )}
              {dbConnected ? "All Systems Operational" : "Checking Connections..."}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {connectedCount} of {totalIntegrations} integrations connected
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: BRAND_GREEN }}>
                {connectedCount}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>
                Connected
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: data?.database?.totalRecords ? BRAND_BLUE : "var(--muted)" }}>
                {data?.database?.totalRecords?.toLocaleString() || "—"}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>
                DB Records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Database — Live */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            border: dbConnected ? `1px solid ${BRAND_GREEN}30` : "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: dbConnected ? `${BRAND_GREEN}14` : "var(--border-light)" }}
            >
              <Database size={16} style={{ color: dbConnected ? BRAND_GREEN : "var(--muted)" }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                Database
              </h3>
              <p className="text-[9px]" style={{ color: "var(--muted)" }}>Prisma + PostgreSQL</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full"
              style={{ backgroundColor: dbConnected ? BRAND_GREEN : "#E24D47" }}
            />
          </div>
          {dbConnected ? (
            <div className="space-y-2.5">
              {[
                { label: "Experiences", value: data?.database?.experiences || 0 },
                { label: "Features", value: data?.database?.features || 0 },
                { label: "Chat Logs", value: data?.database?.chatLogs || 0 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{row.value}</span>
                </div>
              ))}
              <div className="pt-2 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium" style={{ color: BRAND_GREEN }}>Total Records</span>
                  <span className="text-sm font-bold" style={{ color: BRAND_GREEN }}>
                    {data?.database?.totalRecords || 0}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Unable to connect</p>
            </div>
          )}
        </div>

        {/* Vercel Deployments */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: vercelConnected ? `1px solid ${BRAND_BLUE}30` : "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: vercelConnected ? `${BRAND_BLUE}14` : "var(--border-light)" }}
            >
              <Globe size={16} style={{ color: vercelConnected ? BRAND_BLUE : "var(--muted)" }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                Vercel
              </h3>
              <p className="text-[9px]" style={{ color: "var(--muted)" }}>Deployments</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full"
              style={{ backgroundColor: vercelConnected ? BRAND_GREEN : "#F59E0B" }}
            />
          </div>
          {vercelConnected && data?.vercel?.deployments ? (
            <div className="space-y-2">
              {data.vercel.deployments.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <CheckCircle2 size={12} style={{ color: BRAND_GREEN }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {d.meta?.githubCommitMessage?.split("\n")[0] || "Deploy"}
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--muted)" }}>
                      {new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {d.meta?.githubCommitSha && ` · ${d.meta.githubCommitSha.slice(0, 7)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <WifiOff size={20} className="mx-auto mb-2" style={{ color: "var(--muted)" }} />
              <p className="text-[11px] font-medium mb-1" style={{ color: "var(--foreground)" }}>
                {data?.vercel?.needsToken ? "API Token Needed" : "Not Connected"}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                Add VERCEL_API_TOKEN to Vercel env vars
              </p>
            </div>
          )}
        </div>

        {/* GitHub Activity */}
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: githubConnected ? `1px solid ${BRAND_BLUE}30` : "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: githubConnected ? `${BRAND_BLUE}14` : "var(--border-light)" }}
            >
              <GitCommit size={16} style={{ color: githubConnected ? BRAND_BLUE : "var(--muted)" }} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                GitHub
              </h3>
              <p className="text-[9px]" style={{ color: "var(--muted)" }}>Recent Activity</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full"
              style={{ backgroundColor: githubConnected ? BRAND_GREEN : "#F59E0B" }}
            />
          </div>
          {githubConnected && data?.github?.recentCommits ? (
            <div className="space-y-2">
              {data.github.recentCommits.slice(0, 4).map((c) => (
                <div
                  key={c.sha}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  <span className="text-[10px] font-mono shrink-0" style={{ color: BRAND_BLUE }}>{c.sha}</span>
                  <p className="text-[11px] truncate flex-1" style={{ color: "var(--foreground)" }}>
                    {(c.message || "").split("\n")[0]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <WifiOff size={20} className="mx-auto mb-2" style={{ color: "var(--muted)" }} />
              <p className="text-[11px] font-medium mb-1" style={{ color: "var(--foreground)" }}>
                {data?.github?.needsToken ? "API Token Needed" : "Not Connected"}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                Add GITHUB_TOKEN to Vercel env vars
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Status Grid */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} style={{ color: BRAND_BLUE }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Integration Status
          </h3>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: `${BRAND_GREEN}14`, color: BRAND_GREEN }}
          >
            {connectedCount}/{totalIntegrations} Connected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(integrations).map(([key, integration]) => (
            <div
              key={key}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{
                backgroundColor: integration.connected ? `${BRAND_GREEN}06` : "var(--background)",
                border: `1px solid ${integration.connected ? `${BRAND_GREEN}20` : "var(--border)"}`,
              }}
            >
              {integration.connected ? (
                <Wifi size={12} style={{ color: BRAND_GREEN }} />
              ) : (
                <WifiOff size={12} style={{ color: "var(--muted)" }} />
              )}
              <span
                className="text-[11px] font-medium"
                style={{ color: integration.connected ? "var(--foreground)" : "var(--muted)" }}
              >
                {integration.name}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/departments/engineering/integrations"
          className="flex items-center gap-1 mt-3 text-[10px] font-medium"
          style={{ color: BRAND_BLUE }}
        >
          View all integrations <ArrowRight size={10} />
        </Link>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            title: "Kanban Board",
            desc: "Task management for Lakshmi & Sam",
            href: "/departments/engineering/kanban",
            icon: Wrench,
            color: "#6B7280",
          },
          {
            title: "Tech Specs Library",
            desc: "Engineering-ready specification documents",
            href: "/departments/engineering/tech-specs",
            icon: FileText,
            color: BRAND_BLUE,
          },
          {
            title: "Integrations",
            desc: "Connected services and API health",
            href: "/departments/engineering/integrations",
            icon: Zap,
            color: BRAND_GREEN,
          },
        ].map((nav) => (
          <Link
            key={nav.href}
            href={nav.href}
            className="rounded-2xl p-5 group hover:shadow-md transition-all"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${nav.color}14` }}
              >
                <nav.icon size={16} style={{ color: nav.color }} />
              </div>
              <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--muted)" }} />
            </div>
            <h4 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {nav.title}
            </h4>
            <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
              {nav.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
