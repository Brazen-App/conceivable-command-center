"use client";

import { Cpu, FileCode, GitBranch, Lightbulb } from "lucide-react";

const ACCENT = "#6B7280";

/* ── Tech Stack ── */
const TECH_STACK = [
  {
    name: "Next.js 16",
    category: "Framework",
    description: "App Router with React Server Components. Serverless API routes. Edge runtime support.",
    color: "#2A2828",
  },
  {
    name: "TypeScript",
    category: "Language",
    description: "Strict mode enabled. End-to-end type safety from database to UI components.",
    color: "#5A6FFF",
  },
  {
    name: "Prisma ORM",
    category: "Database ORM",
    description: "Type-safe database client. Schema-first design. Automatic migrations and seeding.",
    color: "#1EAA55",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    description: "Hosted on Neon/Vercel Postgres. Daily backups. Connection pooling via PgBouncer.",
    color: "#356FB6",
  },
  {
    name: "Vercel",
    category: "Platform",
    description: "Auto-deploy from main. Edge functions. Analytics. Speed Insights. Feature flags.",
    color: "#2A2828",
  },
  {
    name: "Anthropic Claude",
    category: "AI Engine",
    description: "Primary AI for agent system, content generation, structured briefs, and Kai coaching.",
    color: "#E37FB1",
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first CSS. Custom design tokens matching brand book. Responsive design system.",
    color: "#78C3BF",
  },
];

/* ── Architecture Overview (text-based) ── */
const ARCHITECTURE_LAYERS = [
  {
    layer: "Presentation",
    components: ["Next.js App Router", "React Components", "Tailwind CSS", "Lucide Icons"],
    description: "Client-side rendering with server components where possible. Mobile-first responsive design.",
  },
  {
    layer: "Application",
    components: ["API Routes", "Server Actions", "Middleware", "Auth (NextAuth)"],
    description: "Serverless functions handling business logic. Rate limiting. CORS. Session management.",
  },
  {
    layer: "Intelligence",
    components: ["Claude API", "Gemini API", "RAG Pipeline", "Prompt Templates"],
    description: "AI agent system with structured prompts. Department-scoped context. Cross-department briefs.",
  },
  {
    layer: "Data",
    components: ["Prisma ORM", "PostgreSQL", "Redis Cache (planned)", "File Storage (planned)"],
    description: "Schema-first database design. Type-safe queries. Connection pooling. Planned caching layer.",
  },
  {
    layer: "External",
    components: ["Mailchimp", "Stripe (planned)", "Plaid (planned)", "Late.dev"],
    description: "Third-party integrations for email, payments, banking, and social media management.",
  },
];

/* ── Data Flow ── */
const DATA_FLOWS = [
  { from: "User Browser", to: "Next.js Edge", description: "HTTPS requests, static assets via CDN" },
  { from: "Next.js Edge", to: "API Routes", description: "Server-side data fetching, form submissions" },
  { from: "API Routes", to: "Prisma Client", description: "Type-safe database queries and mutations" },
  { from: "Prisma Client", to: "PostgreSQL", description: "SQL queries via connection pool" },
  { from: "API Routes", to: "Claude API", description: "Structured prompts for AI agent responses" },
  { from: "Claude API", to: "API Routes", description: "Structured JSON responses with department briefs" },
];

/* ── Architecture Decisions ── */
const ADR_LOG = [
  {
    id: "ADR-001",
    title: "App Router over Pages Router",
    date: "2025-12-01",
    status: "accepted" as const,
    rationale: "Server Components reduce client bundle. Layouts enable shared UI. Future-proof with React 19.",
  },
  {
    id: "ADR-002",
    title: "Prisma over raw SQL",
    date: "2025-12-05",
    status: "accepted" as const,
    rationale: "Type safety eliminates SQL injection risk. Schema-first design enables rapid iteration. Migration system built-in.",
  },
  {
    id: "ADR-003",
    title: "Claude as primary AI engine",
    date: "2025-12-10",
    status: "accepted" as const,
    rationale: "Best-in-class for structured output. Consistent tone matching brand voice. Excellent at following complex instructions.",
  },
  {
    id: "ADR-004",
    title: "Serverless over dedicated servers",
    date: "2025-12-15",
    status: "accepted" as const,
    rationale: "Zero infrastructure management. Auto-scaling. Pay-per-use aligns with pre-revenue stage. Vercel handles everything.",
  },
  {
    id: "ADR-005",
    title: "Mock data before live integrations",
    date: "2026-01-10",
    status: "accepted" as const,
    rationale: "Ship UI fast with realistic mock data. Replace with API calls once integrations are ready. No blocked development.",
  },
  {
    id: "ADR-006",
    title: "Multi-model AI fallback strategy",
    date: "2026-01-20",
    status: "proposed" as const,
    rationale: "Use Gemini as fallback for Claude outages. OpenAI for embeddings. Prevents single-vendor dependency.",
  },
];

export default function ArchitecturePage() {
  return (
    <div>
      {/* Tech Stack Grid */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Tech Stack
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", borderLeft: `3px solid ${tech.color}` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {tech.name}
                </p>
              </div>
              <p
                className="text-[9px] font-bold uppercase tracking-wider mb-1"
                style={{ color: tech.color }}
              >
                {tech.category}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture Overview */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileCode size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            System Architecture
          </h3>
        </div>
        <div className="space-y-3">
          {ARCHITECTURE_LAYERS.map((layer, i) => (
            <div
              key={layer.layer}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
                >
                  L{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {layer.layer}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {layer.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {layer.components.map((comp) => (
                      <span
                        key={comp}
                        className="text-[9px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Data Flow
          </h3>
        </div>
        <div className="space-y-2">
          {DATA_FLOWS.map((flow, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <span className="text-xs font-bold shrink-0 w-28 text-right" style={{ color: ACCENT }}>
                {flow.from}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                &rarr;
              </span>
              <span className="text-xs font-bold shrink-0 w-28" style={{ color: "var(--foreground)" }}>
                {flow.to}
              </span>
              <span className="text-[10px] flex-1 min-w-0 truncate" style={{ color: "var(--muted)" }}>
                {flow.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Decision Records */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} style={{ color: ACCENT }} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Architecture Decision Log
          </h3>
        </div>
        <div className="space-y-2">
          {ADR_LOG.map((adr) => (
            <div
              key={adr.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold" style={{ color: ACCENT }}>
                      {adr.id}
                    </span>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {adr.title}
                    </p>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {adr.rationale}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: adr.status === "accepted" ? "#1EAA5514" : "#F1C02814",
                      color: adr.status === "accepted" ? "#1EAA55" : "#F1C028",
                    }}
                  >
                    {adr.status}
                  </span>
                  <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                    {adr.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
