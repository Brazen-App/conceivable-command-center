"use client";

import { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Loader2,
  ExternalLink,
  Zap,
  Shield,
  Database,
  Globe,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  BarChart3,
  Users,
  Image,
  GitCommit,
} from "lucide-react";

const BRAND_BLUE = "#5A6FFF";
const BRAND_GREEN = "#1EAA55";

interface IntegrationInfo {
  connected: boolean;
  name: string;
}

const INTEGRATION_META: Record<string, { icon: typeof Wifi; color: string; description: string }> = {
  anthropic: {
    icon: Sparkles,
    color: "#D4A843",
    description: "Claude AI powers all care team agents (Kai, Seren, Olive, Luna, Atlas, Navi, Zhen) and the Product Coach.",
  },
  gemini: {
    icon: Image,
    color: "#4285F4",
    description: "Google Gemini for image generation and multi-modal AI capabilities.",
  },
  mailchimp: {
    icon: MessageSquare,
    color: "#FFE01B",
    description: "Email marketing platform. 28,908 subscribers. Manages launch email warmup sequence.",
  },
  late: {
    icon: Globe,
    color: "#E37FB1",
    description: "Social media publishing. Manages Instagram, Facebook, and LinkedIn content scheduling.",
  },
  database: {
    icon: Database,
    color: BRAND_GREEN,
    description: "PostgreSQL database via Prisma ORM. Stores experiences, features, chat logs, and all app data.",
  },
  vercel: {
    icon: Globe,
    color: "#000000",
    description: "Hosting and deployment platform. Auto-deploys from main branch. Edge functions and serverless API routes.",
  },
  github: {
    icon: GitCommit,
    color: "#6B7280",
    description: "Source code repository. Brazen-App/conceivable-command-center. Commit history and PR management.",
  },
  shopify: {
    icon: ShoppingBag,
    color: "#96BF48",
    description: "E-commerce platform for supplement packs and Halo Ring sales.",
  },
  fal: {
    icon: Image,
    color: "#9686B9",
    description: "Fal.ai for fast image generation and AI media processing.",
  },
  circle: {
    icon: Users,
    color: "#5A6FFF",
    description: "Community platform for Conceivable founding members and beta testers.",
  },
  ga4: {
    icon: BarChart3,
    color: "#E24D47",
    description: "Google Analytics 4 for website traffic, user behavior, and conversion tracking.",
  },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Record<string, IntegrationInfo> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/engineering/status")
      .then((r) => r.json())
      .then((data) => setIntegrations(data.integrations || {}))
      .catch(() => setIntegrations(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  const entries = Object.entries(integrations || {});
  const connected = entries.filter(([, i]) => i.connected);
  const disconnected = entries.filter(([, i]) => !i.connected);

  return (
    <div>
      {/* Header Stats */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND_BLUE}10, ${BRAND_GREEN}06)`,
          border: `1px solid ${BRAND_BLUE}15`,
        }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.03]" style={{ background: `radial-gradient(circle, ${BRAND_BLUE}, transparent)` }} />
        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BRAND_BLUE}14` }}>
            <Zap size={20} style={{ color: BRAND_BLUE }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Integration Hub</h2>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>Live connection status for all external services</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Connected", value: connected.length, color: BRAND_GREEN },
            { label: "Needs Setup", value: disconnected.length, color: disconnected.length > 0 ? "#F59E0B" : "var(--muted)" },
            { label: "Total Services", value: entries.length, color: BRAND_BLUE },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Services */}
      {connected.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Wifi size={14} style={{ color: BRAND_GREEN }} />
            <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: BRAND_GREEN }}>
              Connected ({connected.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connected.map(([key, integration]) => {
              const meta = INTEGRATION_META[key] || { icon: Wifi, color: "#6B7280", description: "" };
              const Icon = meta.icon;
              return (
                <div
                  key={key}
                  className="rounded-2xl p-4 group hover:shadow-sm transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: `1px solid ${BRAND_GREEN}20`,
                    borderLeft: `3px solid ${meta.color}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${meta.color}12` }}
                    >
                      <Icon size={18} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {integration.name}
                        </h4>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_GREEN }} />
                      </div>
                      <p className="text-[11px] leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Needs Setup */}
      {disconnected.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <WifiOff size={14} style={{ color: "#F59E0B" }} />
            <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
              Needs Setup ({disconnected.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {disconnected.map(([key, integration]) => {
              const meta = INTEGRATION_META[key] || { icon: WifiOff, color: "#6B7280", description: "" };
              const Icon = meta.icon;
              const envVar = key === "vercel" ? "VERCEL_API_TOKEN" : key === "github" ? "GITHUB_TOKEN" : `${key.toUpperCase()}_API_KEY`;
              return (
                <div
                  key={key}
                  className="rounded-2xl p-4 border-2 border-dashed"
                  style={{ borderColor: "#F59E0B25", backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--background)" }}
                    >
                      <Icon size={18} style={{ color: "var(--muted)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {integration.name}
                      </h4>
                      <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                        {meta.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Shield size={10} style={{ color: "#F59E0B" }} />
                        <code className="text-[10px] font-mono" style={{ color: "#F59E0B" }}>
                          {envVar}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {disconnected.length > 0 && (
        <div
          className="rounded-2xl p-5 mt-6"
          style={{ backgroundColor: `${BRAND_BLUE}06`, border: `1px solid ${BRAND_BLUE}15` }}
        >
          <div className="flex items-start gap-3">
            <ExternalLink size={16} className="shrink-0 mt-0.5" style={{ color: BRAND_BLUE }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                How to Connect
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                Add the required environment variables in your{" "}
                <a
                  href="https://vercel.com/kirsten-3720s-projects/conceivable-command-center/settings/environment-variables"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                  style={{ color: BRAND_BLUE }}
                >
                  Vercel project settings
                </a>
                . After adding, redeploy to activate the connection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
