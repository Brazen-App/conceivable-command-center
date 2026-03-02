"use client";

import { useState } from "react";
import {
  Activity,
  Users,
  FileText,
  Mail,
  Search,
  Handshake,
  UserCheck,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Star,
} from "lucide-react";

const ACCENT = "#5A6FFF";

// --- Mock Data ---

const HEALTH_SCORE = 74;

const KPI_DATA = {
  totalAudienceReach: 28905,
  weeklyContentOutput: 37,
  weeklyContentTarget: 100,
  emailListSize: 28905,
  emailListGrowthTrend: [27800, 28100, 28300, 28500, 28650, 28750, 28905],
  geoScore: 4,
  geoTarget: 10,
  topContent: {
    title: "Why BBT Is the Most Underused Fertility Biomarker",
    platform: "LinkedIn",
    engagement: 2340,
  },
  activeAffiliates: 5,
  activePartnerships: 12,
  paidSpend: 0,
  complianceStatus: "All Clear" as const,
};

function HealthScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#1EAA55" : score >= 60 ? "#F1C028" : "#E24D47";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {score}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProgressBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div
      className="w-full h-2 rounded-full mt-2"
      style={{ backgroundColor: "var(--border)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  children?: React.ReactNode;
}

function KPICard({ icon, label, value, subtext, children }: KPICardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {subtext}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function MarketingDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero: Marketing Health Score */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: `${ACCENT}08`,
          border: `1px solid ${ACCENT}20`,
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-widest mb-4"
          style={{ color: ACCENT }}
        >
          Marketing Health Score
        </p>
        <HealthScoreRing score={HEALTH_SCORE} />
        <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
          Composite of content output, email performance, SEO visibility,
          affiliate activity, and compliance
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <TrendingUp size={14} style={{ color: "#1EAA55" }} />
          <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
            +8 pts from last week (The Gain: started at 31 in Week 1)
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Audience Reach */}
        <KPICard
          icon={<Users size={16} style={{ color: ACCENT }} />}
          label="Total Audience Reach"
          value={KPI_DATA.totalAudienceReach.toLocaleString()}
          subtext="email + social"
        />

        {/* Weekly Content Output */}
        <KPICard
          icon={<FileText size={16} style={{ color: "#F1C028" }} />}
          label="Weekly Content Output"
          value={KPI_DATA.weeklyContentOutput}
          subtext={`/ ${KPI_DATA.weeklyContentTarget} target`}
        >
          <ProgressBar
            value={KPI_DATA.weeklyContentOutput}
            max={KPI_DATA.weeklyContentTarget}
            color="#F1C028"
          />
        </KPICard>

        {/* Email List Growth */}
        <KPICard
          icon={<Mail size={16} style={{ color: "#E37FB1" }} />}
          label="Email List Growth"
          value={KPI_DATA.emailListSize.toLocaleString()}
          subtext="subscribers"
        >
          <MiniSparkline data={KPI_DATA.emailListGrowthTrend} />
        </KPICard>

        {/* GEO Score */}
        <KPICard
          icon={<Search size={16} style={{ color: "#78C3BF" }} />}
          label="GEO Score"
          value={`${KPI_DATA.geoScore} / ${KPI_DATA.geoTarget}`}
          subtext="AI queries citing Conceivable"
        >
          <ProgressBar
            value={KPI_DATA.geoScore}
            max={KPI_DATA.geoTarget}
            color="#78C3BF"
          />
        </KPICard>

        {/* Top Performing Content */}
        <KPICard
          icon={<Star size={16} style={{ color: "#9686B9" }} />}
          label="Top Content This Week"
          value=""
        >
          <div>
            <p
              className="text-sm font-semibold leading-snug"
              style={{ color: "var(--foreground)" }}
            >
              {KPI_DATA.topContent.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${ACCENT}14`,
                  color: ACCENT,
                }}
              >
                {KPI_DATA.topContent.platform}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {KPI_DATA.topContent.engagement.toLocaleString()} engagements
              </span>
            </div>
          </div>
        </KPICard>

        {/* Active Affiliates */}
        <KPICard
          icon={<UserCheck size={16} style={{ color: "#1EAA55" }} />}
          label="Active Affiliates"
          value={KPI_DATA.activeAffiliates}
          subtext="generating revenue"
        />

        {/* Active Partnerships */}
        <KPICard
          icon={<Handshake size={16} style={{ color: "#356FB6" }} />}
          label="Active Partnerships"
          value={KPI_DATA.activePartnerships}
          subtext="experts + podcast hosts"
        />

        {/* Paid Spend */}
        <KPICard
          icon={<DollarSign size={16} style={{ color: "#F1C028" }} />}
          label="Paid Spend"
          value="$0"
          subtext="launches post-validation"
        />

        {/* Compliance */}
        <KPICard
          icon={<ShieldCheck size={16} style={{ color: "#1EAA55" }} />}
          label="Compliance Status"
          value={KPI_DATA.complianceStatus}
        >
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#1EAA55" }}
            />
            <span className="text-xs" style={{ color: "#1EAA55" }}>
              All content scanned before publish
            </span>
          </div>
        </KPICard>
      </div>

      {/* Sullivan Principle: Multiplier Call-out */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "#9686B910",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Multiplier Opportunity: GEO Optimization Sprint
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
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
