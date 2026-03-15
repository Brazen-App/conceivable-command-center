"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  FileText,
  Mail,
  Search,
  Handshake,
  UserCheck,
  DollarSign,
  ShieldCheck,
  Star,
  Target,
  Loader2,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { colors, gradients } from "@/lib/theme";

// ── Types ───────────────────────────────────────────────────

interface SignupData {
  totalSubscribers: number;
  earlyAccess: { total: number; today: number; yesterday: number };
  allSignups: { today: number; yesterday: number };
}

interface MailchimpReport {
  campaignId: string;
  subject: string;
  sendTime: string;
  emailsSent: number;
  openRate: number;
  uniqueOpens: number;
  clickRate: number;
  unsubscribed: number;
  bounces: number;
}

// ── Static Data (will be replaced with live data as we connect) ──

const KPI_DATA = {
  totalAudienceReach: 28905 + 220 + 400000,
  weeklyContentOutput: 0,
  weeklyContentTarget: 100,
  geoScore: 4,
  geoTarget: 10,
  topContent: {
    title: "TikTok viral video — 3.4M views this week",
    platform: "TikTok",
    engagement: 3400000,
  },
  activeAffiliates: 0,
  activePartnerships: 0,
};

// ── Components ──────────────────────────────────────────────

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 rounded-full mt-3" style={{ backgroundColor: `${color}15` }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
      />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconColor,
  label,
  value,
  subtext,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: string | number;
  subtext?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-1 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}12` }}
        >
          <Icon size={14} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
          {value}
        </span>
        {subtext && (
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>
            {subtext}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Stan Store Import ───────────────────────────────────────

function StanStoreImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ added: number; failed: number; message: string } | null>(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        setResult({ added: 0, failed: 0, message: "CSV appears empty (no data rows)" });
        setImporting(false);
        return;
      }

      // Parse CSV header
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
      const emailIdx = header.findIndex((h) => h === "email" || h === "email address" || h === "e-mail");
      const fnameIdx = header.findIndex((h) => h === "first name" || h === "firstname" || h === "first_name" || h === "fname");
      const lnameIdx = header.findIndex((h) => h === "last name" || h === "lastname" || h === "last_name" || h === "lname");
      const productIdx = header.findIndex((h) => h === "product" || h === "product name" || h === "item");

      if (emailIdx === -1) {
        setResult({ added: 0, failed: 0, message: "No 'email' column found in CSV. Check your export." });
        setImporting(false);
        return;
      }

      const contacts = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/"/g, ""));
        const email = cols[emailIdx];
        if (!email || !email.includes("@")) continue;
        contacts.push({
          email,
          firstName: fnameIdx >= 0 ? cols[fnameIdx] : "",
          lastName: lnameIdx >= 0 ? cols[lnameIdx] : "",
          product: productIdx >= 0 ? cols[productIdx] : "",
          source: "stan-store-csv",
        });
      }

      if (contacts.length === 0) {
        setResult({ added: 0, failed: 0, message: "No valid emails found in CSV" });
        setImporting(false);
        return;
      }

      const res = await fetch("/api/stan-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts }),
      });
      const data = await res.json();
      setResult({ added: data.added ?? 0, failed: data.failed ?? 0, message: data.message ?? "Done" });
    } catch {
      setResult({ added: 0, failed: 0, message: "Import failed — check console" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} style={{ color: colors.yellow }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          Stan Store → Mailchimp Import
        </span>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
        Export your customers CSV from Stan Store (Customers tab → Export), then upload here.
        Contacts get tagged &quot;Stan Store&quot; + &quot;Early Access&quot; in Mailchimp automatically.
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <label
          className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
          style={{ backgroundColor: `${colors.yellow}18`, color: colors.yellow, border: `1px solid ${colors.yellow}30` }}
        >
          {file ? file.name : "Choose CSV file..."}
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }}
          />
        </label>
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: colors.blue }}
        >
          {importing ? "Importing..." : "Import to Mailchimp"}
        </button>
      </div>
      {result && (
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs"
          style={{
            backgroundColor: result.added > 0 ? `${colors.green}12` : `${colors.red}12`,
            color: result.added > 0 ? colors.green : colors.red,
          }}
        >
          {result.message}
        </div>
      )}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[10px] font-semibold mb-1" style={{ color: "var(--muted)" }}>Auto-sync with Zapier:</p>
        <p className="text-[10px]" style={{ color: "var(--muted)" }}>
          Stan → New Customer trigger → Webhooks POST to{" "}
          <code className="px-1 py-0.5 rounded text-[9px]" style={{ backgroundColor: "var(--border)" }}>
            /api/stan-store
          </code>
          {" "}— auto-adds to Mailchimp with tags.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function MarketingDashboard() {
  const [signups, setSignups] = useState<SignupData | null>(null);
  const [signupsLoading, setSignupsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<MailchimpReport[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [signupsRes, campaignsRes] = await Promise.all([
        fetch("/api/mailchimp/signups").then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/mailchimp/report").then((r) => r.ok ? r.json() : null).catch(() => null),
      ]);
      if (signupsRes) setSignups(signupsRes);
      if (campaignsRes?.reports) setCampaigns(campaignsRes.reports.slice(0, 5));
    } catch { /* ignore */ }
    finally { setSignupsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const earlyAccessTotal = signups?.earlyAccess?.total ?? 0;
  const totalSubs = signups?.totalSubscribers ?? 0;
  const pct = Math.max((earlyAccessTotal / 500) * 100, 0.5);

  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO: Path to 5,000 Early Access Signups              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(90, 111, 255, 0.12)" }}
      >
        {/* Gradient header strip */}
        <div className="px-6 py-5" style={{ background: gradients.ocean }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Target size={20} color="white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-wide">
                  Early Access Signups
                </p>
                <p className="text-white/60 text-[11px]">
                  Founding member popup — 500 founding member spots
                </p>
              </div>
            </div>
            <div className="text-right">
              {signupsLoading ? (
                <Loader2 size={18} className="animate-spin text-white/60" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-white tracking-tight">
                    {earlyAccessTotal.toLocaleString()}
                  </p>
                  <p className="text-white/50 text-[11px]">of 500</p>
                </>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: "linear-gradient(90deg, #ACB7FF 0%, #FFFFFF 100%)",
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-5">
            {signups ? (
              <>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight size={12} style={{ color: colors.green }} />
                  <span className="text-xs font-semibold" style={{ color: colors.green }}>
                    +{signups.earlyAccess.today} today
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    +{signups.earlyAccess.yesterday} yesterday
                  </span>
                </div>
                <div className="w-px h-3" style={{ backgroundColor: "var(--border)" }} />
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                  {totalSubs.toLocaleString()} total list
                </span>
              </>
            ) : (
              <span className="text-xs" style={{ color: "var(--muted)" }}>Loading...</span>
            )}
          </div>
          <span className="text-[11px] font-medium" style={{ color: colors.blue }}>
            {earlyAccessTotal >= 500 ? "Goal reached!" : `${(500 - earlyAccessTotal).toLocaleString()} to go`}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* RECENT EMAIL PERFORMANCE (Live from Mailchimp)         */}
      {/* ═══════════════════════════════════════════════════════ */}
      {campaigns.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2">
              <Mail size={14} style={{ color: colors.pink }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                Recent Campaigns
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${colors.green}12`, color: colors.green }}>
              Live
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {campaigns.map((c) => (
              <div key={c.campaignId} className="px-5 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {c.subject || "Untitled"}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {c.sendTime ? new Date(c.sendTime).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    {" · "}
                    {c.emailsSent?.toLocaleString()} sent
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: colors.green }}>
                      {((c.openRate || 0) * 100).toFixed(1)}%
                    </p>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {c.uniqueOpens?.toLocaleString()} opens
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: colors.blue }}>
                      {((c.clickRate || 0) * 100).toFixed(1)}%
                    </p>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>clicks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: colors.red }}>
                      {(c.unsubscribed || 0) + (c.bounces || 0)}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>unsub+bounce</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* KPI GRID                                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          icon={Users}
          iconColor={colors.blue}
          label="Total Audience"
          value={totalSubs > 0 ? totalSubs.toLocaleString() : KPI_DATA.totalAudienceReach.toLocaleString()}
          subtext={totalSubs > 0 ? "email subscribers" : "email + social"}
        />

        <MetricCard
          icon={FileText}
          iconColor={colors.yellow}
          label="Content Output"
          value={KPI_DATA.weeklyContentOutput}
          subtext={`/ ${KPI_DATA.weeklyContentTarget} weekly target`}
        >
          <ProgressBar value={KPI_DATA.weeklyContentOutput} max={KPI_DATA.weeklyContentTarget} color={colors.yellow} />
        </MetricCard>

        <MetricCard
          icon={Search}
          iconColor={colors.paleBlue}
          label="GEO Score"
          value={`${KPI_DATA.geoScore} / ${KPI_DATA.geoTarget}`}
          subtext="AI queries citing Conceivable"
        >
          <ProgressBar value={KPI_DATA.geoScore} max={KPI_DATA.geoTarget} color={colors.paleBlue} />
        </MetricCard>

        <MetricCard
          icon={Star}
          iconColor={colors.purple}
          label="Top Content"
          value=""
        >
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
            {KPI_DATA.topContent.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${colors.purple}12`, color: colors.purple }}
            >
              {KPI_DATA.topContent.platform}
            </span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              {KPI_DATA.topContent.engagement.toLocaleString()} engagements
            </span>
          </div>
        </MetricCard>

        <MetricCard
          icon={UserCheck}
          iconColor={colors.green}
          label="Active Affiliates"
          value={KPI_DATA.activeAffiliates}
          subtext="generating revenue"
        />

        <MetricCard
          icon={Handshake}
          iconColor={colors.navy}
          label="Partnerships"
          value={KPI_DATA.activePartnerships}
          subtext="experts + podcast hosts"
        />

        <MetricCard
          icon={DollarSign}
          iconColor={colors.yellow}
          label="Paid Spend"
          value="$0"
          subtext="launches post-validation"
        />

        <MetricCard
          icon={ShieldCheck}
          iconColor={colors.green}
          label="Compliance"
          value="All Clear"
        >
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.green }} />
            <span className="text-[11px]" style={{ color: colors.green }}>
              All content scanned before publish
            </span>
          </div>
        </MetricCard>

        <MetricCard
          icon={Mail}
          iconColor={colors.pink}
          label="Email Health"
          value={campaigns.length > 0 ? `${((campaigns[0]?.openRate || 0) * 100).toFixed(1)}%` : "—"}
          subtext="latest open rate"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STAN STORE IMPORT                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <StanStoreImport />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MULTIPLIER OPPORTUNITY                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: gradients.subtlePink,
          border: `1px solid ${colors.purple}15`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${colors.purple}18` }}
          >
            <Zap size={18} style={{ color: colors.purple }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                10x Multiplier: GEO Optimization Sprint
              </p>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${colors.purple}18`, color: colors.purple }}
              >
                HIGH LEVERAGE
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Improving AI visibility from 4/10 to 8/10 queries would create a
              compounding organic acquisition channel. This impacts Content,
              SEO, Partnerships, and Fundraising narrative simultaneously.
              Unique Ability flag: CEO records 5-minute POVs, agents handle
              schema markup and citation optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
