"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointerClick,
  DollarSign,
  Globe,
  Mail,
  RefreshCw,
  ExternalLink,
  Activity,
  Linkedin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ── Types ── */
interface MetricPair {
  current: number;
  previous: number;
}

interface OverviewData {
  sessions: MetricPair;
  users: MetricPair;
  pageviews: MetricPair;
  bounceRate: MetricPair;
  avgDuration: MetricPair;
  conversions: MetricPair;
}

interface TrafficSource {
  source: string;
  sessions: number;
  users: number;
  conversions: number;
}

interface TopPage {
  path: string;
  pageviews: number;
  avgDuration: number;
}

interface ConversionEvent {
  event: string;
  count: number;
  revenue: number;
}

interface EmailCampaign {
  campaign: string;
  sessions: number;
  conversions: number;
  revenue: number;
}

interface SocialPlatform {
  platform: string;
  sessions: number;
  users: number;
  conversions: number;
  revenue: number;
  topContent?: string;
}

interface RealtimeData {
  activeUsers: number;
  byPage: Array<{ page: string; users: number }>;
  bySource: Array<{ source: string; users: number }>;
  byCountry: Array<{ country: string; users: number }>;
}

/* ── Accent ── */
const ACCENT = "#5A6FFF";
const GREEN = "#1EAA55";
const RED = "#E24D47";
const YELLOW = "#F1C028";

/* ── Helpers ── */
function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/* ── Metric Card ── */
function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  format = "number",
  invertChange = false,
}: {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  format?: "number" | "currency" | "percent" | "duration";
  invertChange?: boolean;
}) {
  const isPositive = invertChange ? change < 0 : change > 0;
  const displayVal =
    format === "currency"
      ? formatCurrency(value)
      : format === "percent"
        ? `${(value * 100).toFixed(1)}%`
        : format === "duration"
          ? formatDuration(value)
          : formatNum(value);

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
        <Icon size={14} style={{ color: ACCENT }} />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          {displayVal}
        </span>
        {change !== 0 && (
          <span
            className="text-xs font-semibold flex items-center gap-0.5 mb-1"
            style={{ color: isPositive ? GREEN : RED }}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
        vs previous 30 days
      </span>
    </div>
  );
}

/* ── Mini bar chart (pure CSS) ── */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-2 rounded-full" style={{ backgroundColor: `${color}18` }}>
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ── Main Page ── */
export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [conversionEvents, setConversionEvents] = useState<ConversionEvent[]>([]);

  // Email ROI
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [emailRevenue, setEmailRevenue] = useState(0);
  const [emailConversions, setEmailConversions] = useState(0);
  const [emailSessions, setEmailSessions] = useState(0);

  // Social
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
  const [socialSessions, setSocialSessions] = useState(0);
  const [socialConversions, setSocialConversions] = useState(0);

  // Realtime
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);

  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [setupInstructions, setSetupInstructions] = useState<string[]>([]);
  const [serviceAccountEmail, setServiceAccountEmail] = useState("");
  const [enableUrl, setEnableUrl] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewRes, emailRes, socialRes, realtimeRes] = await Promise.all([
        fetch("/api/analytics").then((r) => r.json()),
        fetch("/api/analytics/email-roi").then((r) => r.json()),
        fetch("/api/analytics/social").then((r) => r.json()),
        fetch("/api/analytics/realtime").then((r) => r.json()),
      ]);

      // Overview
      const isConnected = overviewRes.connected;
      setConnected(isConnected);
      const data = isConnected ? overviewRes : overviewRes.demo;
      if (data) {
        setOverview(data.overview);
        setTrafficSources(data.trafficSources ?? []);
        setTopPages(data.topPages ?? []);
        setConversionEvents(data.conversionEvents ?? []);
      }
      if (!isConnected) {
        setSetupInstructions(overviewRes.setupInstructions ?? overviewRes.instructions ?? []);
        setServiceAccountEmail(overviewRes.serviceAccountEmail ?? "");
        setEnableUrl(overviewRes.enableUrl ?? null);
      }
      setLastUpdated(overviewRes.lastUpdated ?? new Date().toISOString());

      // Email ROI
      const emailData = emailRes.connected ? emailRes : emailRes.demo;
      if (emailData) {
        setEmailCampaigns(emailData.campaigns ?? []);
        const et = emailData.emailTraffic;
        if (et) {
          setEmailRevenue(typeof et.revenue === "object" ? et.revenue.current : et.revenue ?? 0);
          setEmailConversions(typeof et.conversions === "object" ? et.conversions.current : et.conversions ?? 0);
          setEmailSessions(typeof et.sessions === "object" ? et.sessions.current : et.sessions ?? 0);
        }
      }

      // Social
      const socialData = socialRes.connected ? socialRes : socialRes.demo;
      if (socialData) {
        setSocialPlatforms(socialData.platforms ?? []);
        const so = socialData.overview;
        if (so) {
          setSocialSessions(typeof so.sessions === "object" ? so.sessions.current : so.sessions ?? 0);
          setSocialConversions(typeof so.conversions === "object" ? so.conversions.current : so.conversions ?? 0);
        }
      }

      // Realtime
      const rtData = realtimeRes.connected ? realtimeRes : realtimeRes.demo;
      if (rtData) {
        setRealtime(rtData);
      }
    } catch {
      // fail silently, keep demo data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-refresh realtime every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/analytics/realtime").then((r) => r.json());
        const data = res.connected ? res : res.demo;
        if (data) setRealtime(data);
      } catch {
        /* ignore */
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxTrafficSessions = Math.max(...trafficSources.map((s) => s.sessions), 1);
  const maxEmailSessions = Math.max(...emailCampaigns.map((c) => c.sessions), 1);
  const maxSocialSessions = Math.max(...socialPlatforms.map((p) => p.sessions), 1);

  return (
    <div className="space-y-6">
      {/* Connection Status Banner */}
      {!connected && !loading && (
        <div
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: `${YELLOW}0A`,
            borderColor: `${YELLOW}40`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} style={{ color: YELLOW }} className="shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                GA4 Not Connected — Showing Demo Data
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Property ID <strong>375867523</strong> is configured. To connect live data:
              </p>
              <ol className="text-xs mt-2 space-y-1 list-decimal pl-4" style={{ color: "var(--muted)" }}>
                {setupInstructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {enableUrl && (
                <div className="mt-3">
                  <a
                    href={enableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Enable GA4 Data API <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {serviceAccountEmail && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Service account email:
                  </span>
                  <code
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "var(--background)", color: ACCENT }}
                  >
                    {serviceAccountEmail}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: connected ? `${GREEN}14` : `${YELLOW}14`,
              color: connected ? GREEN : YELLOW,
            }}
          >
            {connected ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
            {connected ? "Live Data" : "Demo Mode"}
          </div>
          {lastUpdated && (
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
          style={{
            borderColor: "var(--border)",
            color: "var(--foreground)",
            backgroundColor: "var(--surface)",
          }}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ============================================= */}
      {/* REAL-TIME USERS (Priority #3) */}
      {/* ============================================= */}
      {realtime && (
        <div
          className="rounded-xl p-5 border"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: GREEN }} />
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Right Now
              </span>
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: GREEN }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: GREEN }}
                />
              </span>
            </div>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              Auto-refreshes every 30s
            </span>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div>
              <span className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
                {realtime.activeUsers}
              </span>
              <span className="text-sm ml-2" style={{ color: "var(--muted)" }}>
                active users
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* By page */}
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Active Pages
              </span>
              <div className="space-y-1.5">
                {realtime.byPage.slice(0, 5).map((p) => (
                  <div key={p.page} className="flex items-center justify-between">
                    <span className="text-xs truncate max-w-[180px]" style={{ color: "var(--foreground)" }}>
                      {p.page}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>
                      {p.users}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* By source */}
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Traffic Sources
              </span>
              <div className="space-y-1.5">
                {realtime.bySource.slice(0, 5).map((s) => (
                  <div key={s.source} className="flex items-center justify-between">
                    <span className="text-xs truncate max-w-[180px]" style={{ color: "var(--foreground)" }}>
                      {s.source}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>
                      {s.users}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* By country */}
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider block mb-2"
                style={{ color: "var(--muted)" }}
              >
                Countries
              </span>
              <div className="space-y-1.5">
                {realtime.byCountry.slice(0, 5).map((c) => (
                  <div key={c.country} className="flex items-center justify-between">
                    <span className="text-xs truncate max-w-[180px]" style={{ color: "var(--foreground)" }}>
                      {c.country}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: ACCENT }}>
                      {c.users}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* OVERVIEW METRICS (30-day) */}
      {/* ============================================= */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            label="Sessions"
            value={overview.sessions.current}
            change={pctChange(overview.sessions.current, overview.sessions.previous)}
            icon={BarChart3}
          />
          <MetricCard
            label="Users"
            value={overview.users.current}
            change={pctChange(overview.users.current, overview.users.previous)}
            icon={Users}
          />
          <MetricCard
            label="Page Views"
            value={overview.pageviews.current}
            change={pctChange(overview.pageviews.current, overview.pageviews.previous)}
            icon={Eye}
          />
          <MetricCard
            label="Bounce Rate"
            value={overview.bounceRate.current}
            change={pctChange(overview.bounceRate.current, overview.bounceRate.previous)}
            icon={MousePointerClick}
            format="percent"
            invertChange
          />
          <MetricCard
            label="Avg Duration"
            value={overview.avgDuration.current}
            change={pctChange(overview.avgDuration.current, overview.avgDuration.previous)}
            icon={Clock}
            format="duration"
          />
          <MetricCard
            label="Conversions"
            value={overview.conversions.current}
            change={pctChange(overview.conversions.current, overview.conversions.previous)}
            icon={DollarSign}
          />
        </div>
      )}

      {/* ============================================= */}
      {/* EMAIL CAMPAIGN ROI (Priority #1) */}
      {/* ============================================= */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: ACCENT }} />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Email Campaign ROI
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
            >
              Priority #1
            </span>
          </div>
          <a
            href="https://us17.admin.mailchimp.com/reports/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium hover:underline"
            style={{ color: ACCENT }}
          >
            Open Mailchimp Reports <ExternalLink size={10} />
          </a>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border)" }}>
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Email Sessions
            </p>
            <p className="text-xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
              {formatNum(emailSessions)}
            </p>
          </div>
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Email Conversions
            </p>
            <p className="text-xl font-bold mt-1" style={{ color: GREEN }}>
              {emailConversions}
            </p>
          </div>
          <div className="px-5 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Email Revenue
            </p>
            <p className="text-xl font-bold mt-1" style={{ color: GREEN }}>
              {formatCurrency(emailRevenue)}
            </p>
          </div>
        </div>

        {/* Campaign breakdown */}
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="px-5 py-3">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              By Campaign (utm_campaign)
            </span>
          </div>
          {emailCampaigns.length === 0 ? (
            <div className="px-5 pb-4">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                No email campaign data yet. Make sure your Mailchimp emails use UTM parameters.
              </p>
            </div>
          ) : (
            <div className="px-5 pb-4 space-y-3">
              {emailCampaigns.map((c) => (
                <div key={c.campaign}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {c.campaign}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                        {c.sessions} sessions
                      </span>
                      <span className="text-[10px] font-semibold" style={{ color: GREEN }}>
                        {c.conversions} conv · {formatCurrency(c.revenue)}
                      </span>
                    </div>
                  </div>
                  <MiniBar value={c.sessions} max={maxEmailSessions} color={ACCENT} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================= */}
      {/* SOCIAL MEDIA PERFORMANCE (Priority #2) */}
      {/* ============================================= */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <Linkedin size={16} style={{ color: "#0A66C2" }} />
            <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Social Media Performance
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
            >
              Priority #2
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {formatNum(socialSessions)} sessions · {socialConversions} conversions
            </span>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {socialPlatforms.length === 0 ? (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              No social traffic data yet. Ensure your social links use UTM parameters.
            </p>
          ) : (
            socialPlatforms.map((p) => (
              <div key={p.platform}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium capitalize" style={{ color: "var(--foreground)" }}>
                      {p.platform}
                    </span>
                    {p.topContent && (
                      <span className="text-[10px] truncate max-w-[200px]" style={{ color: "var(--muted)" }}>
                        top: {p.topContent}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {p.users} users
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: GREEN }}>
                      {p.conversions} conv
                    </span>
                    {p.revenue > 0 && (
                      <span className="text-[10px] font-semibold" style={{ color: GREEN }}>
                        {formatCurrency(p.revenue)}
                      </span>
                    )}
                  </div>
                </div>
                <MiniBar value={p.sessions} max={maxSocialSessions} color="#0A66C2" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================= */}
      {/* TRAFFIC SOURCES + TOP PAGES + CONVERSIONS */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Sources */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: ACCENT }} />
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Traffic Sources
              </span>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {trafficSources.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs truncate max-w-[160px]" style={{ color: "var(--foreground)" }}>
                    {s.source}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>
                    {formatNum(s.sessions)}
                  </span>
                </div>
                <MiniBar value={s.sessions} max={maxTrafficSessions} color={ACCENT} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <Eye size={14} style={{ color: ACCENT }} />
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Top Pages
              </span>
            </div>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {topPages.map((p, i) => (
              <div
                key={p.path}
                className="flex items-center justify-between py-1"
                style={{ borderBottom: i < topPages.length - 1 ? "1px solid var(--border)" : undefined }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold w-4 text-center"
                    style={{ color: "var(--muted)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs truncate max-w-[140px]" style={{ color: "var(--foreground)" }}>
                    {p.path}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold" style={{ color: ACCENT }}>
                    {formatNum(p.pageviews)}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {formatDuration(p.avgDuration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Events */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <ArrowUpRight size={14} style={{ color: GREEN }} />
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                Conversion Events
              </span>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {conversionEvents.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                No conversion events tracked yet.
              </p>
            ) : (
              conversionEvents.map((e) => (
                <div
                  key={e.event}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <span className="text-xs font-medium capitalize" style={{ color: "var(--foreground)" }}>
                      {e.event.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                      {formatNum(e.count)}
                    </span>
                    {e.revenue > 0 && (
                      <span className="text-xs font-semibold" style={{ color: GREEN }}>
                        {formatCurrency(e.revenue)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* GA4 link */}
      <div className="text-center pb-4">
        <a
          href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA4_PROPERTY_ID ?? "375867523"}/reports`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
          style={{ color: ACCENT }}
        >
          Open full GA4 dashboard <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
