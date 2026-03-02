"use client";

import {
  Plug,
  Check,
  X,
  Clock,
  RefreshCw,
} from "lucide-react";

const ACCENT = "#5A6FFF";

type IntegrationStatus = "connected" | "disconnected" | "planned";

interface Integration {
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  category: string;
}

const INTEGRATIONS: Integration[] = [
  {
    name: "Mailchimp",
    description: "Email marketing and subscriber management",
    status: "connected",
    lastSync: "2 min ago",
    category: "Marketing",
  },
  {
    name: "Late.dev",
    description: "AI-powered content scheduling and automation",
    status: "connected",
    lastSync: "5 min ago",
    category: "Marketing",
  },
  {
    name: "Prisma PostgreSQL",
    description: "Primary database for all application data",
    status: "connected",
    lastSync: "Just now",
    category: "Infrastructure",
  },
  {
    name: "Gemini API",
    description: "Google AI for content analysis and generation",
    status: "connected",
    lastSync: "12 min ago",
    category: "AI",
  },
  {
    name: "Anthropic Claude API",
    description: "AI agents powering the Command Center",
    status: "connected",
    lastSync: "Just now",
    category: "AI",
  },
  {
    name: "Vercel",
    description: "Deployment and hosting platform",
    status: "connected",
    lastSync: "1 hr ago",
    category: "Infrastructure",
  },
  {
    name: "GitHub",
    description: "Source code repository and version control",
    status: "connected",
    lastSync: "30 min ago",
    category: "Infrastructure",
  },
  {
    name: "Circle",
    description: "Community platform for member engagement",
    status: "planned",
    category: "Community",
  },
  {
    name: "Buffer",
    description: "Social media scheduling and analytics",
    status: "planned",
    category: "Marketing",
  },
  {
    name: "Plaid",
    description: "Financial data aggregation and bank connections",
    status: "planned",
    category: "Finance",
  },
  {
    name: "Stripe",
    description: "Payment processing and subscription management",
    status: "planned",
    category: "Finance",
  },
];

const STATUS_CONFIG = {
  connected: { label: "Connected", color: "#1EAA55", icon: Check },
  disconnected: { label: "Disconnected", color: "#E24D47", icon: X },
  planned: { label: "Planned", color: "#F1C028", icon: Clock },
};

export default function ToolsPage() {
  const connected = INTEGRATIONS.filter((i) => i.status === "connected").length;
  const planned = INTEGRATIONS.filter((i) => i.status === "planned").length;
  const disconnected = INTEGRATIONS.filter((i) => i.status === "disconnected").length;

  const categories = Array.from(new Set(INTEGRATIONS.map((i) => i.category)));

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div
          className="rounded-xl border p-4 text-center"
          style={{ borderColor: "#1EAA5530", backgroundColor: "#1EAA5506" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>{connected}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#1EAA55" }}>
            Connected
          </p>
        </div>
        <div
          className="rounded-xl border p-4 text-center"
          style={{ borderColor: "#F1C02830", backgroundColor: "#F1C02806" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>{planned}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#F1C028" }}>
            Planned
          </p>
        </div>
        <div
          className="rounded-xl border p-4 text-center"
          style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4706" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#E24D47" }}>{disconnected}</p>
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#E24D47" }}>
            Disconnected
          </p>
        </div>
      </div>

      {/* Integrations by category */}
      {categories.map((category) => {
        const catIntegrations = INTEGRATIONS.filter((i) => i.category === category);
        return (
          <section key={category} className="mb-8">
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
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {catIntegrations.map((integration) => {
                const statusConf = STATUS_CONFIG[integration.status];
                const StatusIcon = statusConf.icon;
                return (
                  <div
                    key={integration.name}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${statusConf.color}14` }}
                        >
                          <Plug size={18} style={{ color: statusConf.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                            {integration.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div
                              className="w-[6px] h-[6px] rounded-full"
                              style={{ backgroundColor: statusConf.color }}
                            />
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider"
                              style={{ color: statusConf.color }}
                            >
                              {statusConf.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                      {integration.description}
                    </p>

                    {integration.lastSync && (
                      <div className="flex items-center gap-1.5">
                        <RefreshCw size={10} style={{ color: "var(--muted)" }} />
                        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                          Last sync: {integration.lastSync}
                        </span>
                      </div>
                    )}

                    {integration.status === "planned" && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} style={{ color: "#F1C028" }} />
                        <span className="text-[10px]" style={{ color: "#F1C028" }}>
                          Coming soon
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
