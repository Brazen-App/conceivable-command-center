"use client";

import { Bell, Search, X, ArrowRight, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

/* ── Searchable pages ── */
const SEARCHABLE_PAGES = [
  { label: "Operations", href: "/departments/operations", keywords: "ops dashboard kpi spine" },
  { label: "Operations — Weekly Brief", href: "/departments/operations/weekly-brief", keywords: "brief weekly summary" },
  { label: "Operations — Review Queue", href: "/departments/operations/review", keywords: "review approve flag pending" },
  { label: "Operations — Team", href: "/departments/operations/team", keywords: "team people org" },
  { label: "Operations — Tools", href: "/departments/operations/tools", keywords: "tools integrations connect" },
  { label: "Marketing", href: "/departments/marketing", keywords: "email content voice campaigns" },
  { label: "Marketing — Email Strategy", href: "/departments/marketing/email", keywords: "email deploy send mailchimp sequence" },
  { label: "Marketing — Email Ops", href: "/departments/marketing/email-ops", keywords: "mailchimp warmup segments automations abandoned cart newsletter" },
  { label: "Marketing — Content Engine", href: "/departments/marketing/content", keywords: "content news research reddit calendar" },
  { label: "Marketing — SEO / GEO", href: "/departments/marketing/seo-geo", keywords: "seo geo search engine ai visibility" },
  { label: "Marketing — Analytics (GA4)", href: "/departments/marketing/analytics", keywords: "analytics ga4 google traffic sessions conversions roi" },
  { label: "Marketing — Affiliates", href: "/departments/marketing/affiliates", keywords: "affiliate partner practitioners" },
  { label: "Marketing — Partnerships", href: "/departments/marketing/partnerships", keywords: "partnerships experts interviews podcast" },
  { label: "Marketing — Paid Ads", href: "/departments/marketing/paid", keywords: "paid ads facebook google meta" },
  { label: "Product", href: "/departments/product", keywords: "product roadmap features halo" },
  { label: "Product — Verticals", href: "/departments/product/verticals", keywords: "verticals lifecycle pcos infertility pregnancy menopause" },
  { label: "Product — Roadmap", href: "/departments/product/roadmap", keywords: "roadmap timeline milestones" },
  { label: "Product — Design", href: "/departments/product/design", keywords: "design ui ux brand" },
  { label: "Product — User Research", href: "/departments/product/user-research", keywords: "user research feedback interviews" },
  { label: "Engineering", href: "/departments/engineering", keywords: "engineering deploy database api uptime vercel" },
  { label: "Clinical", href: "/departments/clinical", keywords: "clinical studies evidence pilot data publications" },
  { label: "Legal", href: "/departments/legal", keywords: "legal compliance claims ip" },
  { label: "Legal — Patents", href: "/departments/legal/patents", keywords: "patents ip filings provisional closed-loop" },
  { label: "Finance", href: "/departments/finance", keywords: "finance burn runway cash mercury stripe" },
  { label: "Fundraising", href: "/departments/fundraising", keywords: "fundraising investors pipeline bridge series" },
  { label: "Fundraising — Venture", href: "/departments/fundraising/venture", keywords: "venture vc firms investors" },
  { label: "Fundraising — Strategic", href: "/departments/fundraising/strategic", keywords: "strategic partners corporate" },
  { label: "Fundraising — Movement Board", href: "/departments/fundraising/movement-board", keywords: "movement board advocates champions" },
  { label: "Fundraising — Materials", href: "/departments/fundraising/materials", keywords: "pitch deck materials narrative" },
  { label: "Community", href: "/departments/community", keywords: "community circle members engagement" },
  { label: "Strategy", href: "/departments/strategy", keywords: "strategy 10x focus coaching sullivan" },
  { label: "Strategy — Weekly Brief", href: "/departments/strategy/weekly-brief", keywords: "strategy brief weekly" },
  { label: "Strategy — Decisions", href: "/departments/strategy/decisions", keywords: "decisions log history" },
  { label: "Strategy — Ideas", href: "/departments/strategy/ideas", keywords: "ideas brainstorm parking lot" },
  { label: "Strategy — Kirsten's Brain", href: "/departments/strategy/kirsten-brain", keywords: "kirsten brain vision pov" },
  { label: "Joy AI — Executive Coach", href: "/agents/executive-coach", keywords: "joy ai agent coach chat" },
  { label: "Joy AI — Marketing", href: "/agents/marketing", keywords: "joy ai agent marketing" },
  { label: "Joy AI — Legal", href: "/agents/legal", keywords: "joy ai agent legal" },
  { label: "Joy AI — Scientific Research", href: "/agents/scientific-research", keywords: "joy ai agent research clinical" },
  { label: "Joy AI — Content Engine", href: "/agents/content-engine", keywords: "joy ai agent content" },
  { label: "Settings", href: "/settings", keywords: "settings config preferences" },
];

/* ── Notification alerts (static for now, will be API-driven later) ── */
const ALERTS = [
  {
    type: "critical" as const,
    title: "File Closed-Loop Patent",
    detail: "Provisional must be filed before fundraise begins. Deadline: March 31.",
    href: "/departments/legal/patents",
    time: "Overdue",
  },
  {
    type: "critical" as const,
    title: "0 investor calls made",
    detail: "Target: 5 calls this week. Fundraising pipeline is empty.",
    href: "/departments/fundraising",
    time: "This week",
  },
  {
    type: "warning" as const,
    title: "23 emails written, 0 sent",
    detail: "Email launch sequence is the #1 marketing bottleneck.",
    href: "/departments/marketing/email",
    time: "Blocking",
  },
  {
    type: "warning" as const,
    title: "~2 months runway remaining",
    detail: "$28K/mo burn rate. Connect Mercury + Stripe for real-time tracking.",
    href: "/departments/finance",
    time: "Urgent",
  },
  {
    type: "info" as const,
    title: "Circle API not connected",
    detail: "Community engagement data unavailable. 220 members untracked.",
    href: "/departments/community",
    time: "Setup needed",
  },
];

const ALERT_CONFIG = {
  critical: { color: "#E24D47", icon: AlertTriangle },
  warning: { color: "#F1C028", icon: Clock },
  info: { color: "#5A6FFF", icon: TrendingUp },
};

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter pages by query
  const results = query.trim().length > 0
    ? SEARCHABLE_PAGES.filter((p) => {
        const q = query.toLowerCase();
        return p.label.toLowerCase().includes(q) || p.keywords.includes(q);
      }).slice(0, 8)
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    setSearchOpen(false);
    setQuery("");
  }, [router]);

  const criticalCount = ALERTS.filter((a) => a.type === "critical").length;

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative">
          {searchOpen ? (
            <div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
                    if (e.key === "Enter" && results.length > 0) handleSelect(results[0].href);
                  }}
                  placeholder="Search pages, agents..."
                  className="w-64 sm:w-72 pl-9 pr-8 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                  }}
                  autoFocus
                />
                <button
                  onClick={() => { setSearchOpen(false); setQuery(""); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100"
                >
                  <X size={14} style={{ color: "var(--muted)" }} />
                </button>
              </div>

              {/* Results dropdown */}
              {results.length > 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg overflow-hidden"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", zIndex: 50 }}
                >
                  {results.map((r) => (
                    <button
                      key={r.href}
                      onMouseDown={() => handleSelect(r.href)}
                      className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>{r.label}</span>
                      <ArrowRight size={12} style={{ color: "var(--muted)" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {query.trim().length > 1 && results.length === 0 && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg px-4 py-3"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", zIndex: 50 }}
                >
                  <p className="text-xs" style={{ color: "var(--muted)" }}>No pages found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={18} style={{ color: "var(--muted)" }} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell size={18} style={{ color: notifOpen ? "var(--foreground)" : "var(--muted)" }} />
            {criticalCount > 0 && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#E24D47" }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute top-full right-0 mt-1 w-80 rounded-lg border shadow-lg overflow-hidden"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", zIndex: 50 }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                  Alerts
                </p>
              </div>
              {ALERTS.map((alert, i) => {
                const conf = ALERT_CONFIG[alert.type];
                const Icon = conf.icon;
                return (
                  <button
                    key={i}
                    onClick={() => { router.push(alert.href); setNotifOpen(false); }}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                    style={{ borderBottom: i < ALERTS.length - 1 ? "1px solid var(--border)" : undefined }}
                  >
                    <Icon size={14} className="shrink-0 mt-0.5" style={{ color: conf.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        {alert.title}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                        {alert.detail}
                      </p>
                    </div>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
                    >
                      {alert.time}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
