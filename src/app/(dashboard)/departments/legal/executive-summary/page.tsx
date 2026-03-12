"use client";

import { useRef, useCallback } from "react";
import { Download, Shield, Zap, Eye, Brain, Activity, Smartphone, Baby, BarChart3 } from "lucide-react";

/* ──────────────────────────────────────────────
   Color Palette
   ────────────────────────────────────────────── */
const BLUE = "#5A6FFF";
const NAVY = "#356FB6";
const BLACK = "#2A2828";
const GREEN = "#1EAA55";
const PURPLE = "#9686B9";
const OFF_WHITE = "#F9F7F0";

/* ──────────────────────────────────────────────
   Section 1 — Hero Header
   ────────────────────────────────────────────── */
function HeroHeader() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BLACK} 0%, ${NAVY} 50%, ${BLUE} 100%)`,
      }}
    >
      <div className="px-8 md:px-12 py-10 md:py-14">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "rgba(249,247,240,0.5)" }}
        >
          Investor Overview
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: OFF_WHITE, fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
        >
          Conceivable IP Portfolio
        </h1>
        <p className="text-base md:text-lg mb-10" style={{ color: "rgba(249,247,240,0.7)" }}>
          Comprehensive Patent Protection for AI-Powered Fertility Health Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: "10 Patents", label: "Foundational portfolio" },
            { value: "$18-30M", label: "Estimated licensing potential" },
            { value: "3 Layers", label: "Core Platform \u00b7 Real-Time \u00b7 Predictive" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-6 py-5"
              style={{ backgroundColor: "rgba(249,247,240,0.08)", backdropFilter: "blur(12px)" }}
            >
              <p className="text-2xl md:text-3xl font-bold mb-1" style={{ color: OFF_WHITE }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "rgba(249,247,240,0.6)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Portfolio Architecture
   ────────────────────────────────────────────── */
interface PatentCardProps {
  number: number;
  title: string;
  description: string;
  accent: string;
  badge?: string;
  icon: React.ReactNode;
}

function PatentCard({ number, title, description, accent, badge, icon }: PatentCardProps) {
  return (
    <div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}14` }}
        >
          {icon}
        </div>
        {badge && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            {badge}
          </span>
        )}
      </div>
      <p
        className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1"
        style={{ color: accent }}
      >
        Patent {number}
      </p>
      <h4 className="text-sm font-semibold mb-2 leading-snug" style={{ color: "var(--foreground)" }}>
        {title}
      </h4>
      <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
        {description}
      </p>
    </div>
  );
}

function PortfolioArchitecture() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Portfolio Architecture
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Three-tier protection strategy covering the full technology stack
        </p>
      </div>

      {/* Tier 1 — Core Platform */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BLUE }} />
          <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: BLUE }}>
            Core Platform Protection
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <PatentCard
            number={1}
            title="Conceivable Score System"
            description="Five-category composite fertility scoring using weighted multi-signal wearable inputs"
            accent={BLUE}
            badge="Filed March 2024"
            icon={<BarChart3 size={16} style={{ color: BLUE }} />}
          />
          <PatentCard
            number={2}
            title="AI-Powered Root Cause Analysis"
            description="AI identifies underlying physiological conditions causing multiple symptoms simultaneously"
            accent={BLUE}
            icon={<Brain size={16} style={{ color: BLUE }} />}
          />
          <PatentCard
            number={3}
            title="Population-Based Pattern Learning"
            description="AI learns optimal intervention sequences from 1000+ users with similar physiological patterns"
            accent={BLUE}
            icon={<Zap size={16} style={{ color: BLUE }} />}
          />
          <PatentCard
            number={4}
            title="Closed-Loop Physiologic Correction System"
            description="Measures intervention effectiveness through continuous wearable monitoring and automatically escalates protocols when corrections fail"
            accent={BLUE}
            icon={<Activity size={16} style={{ color: BLUE }} />}
          />
          <PatentCard
            number={5}
            title="AI-Driven Physiological Pattern Attribution"
            description="Iterative causal analysis that drills down to root causes through dynamic questioning, validates attributions through outcome tracking, and learns from population-level intervention success patterns"
            accent={BLUE}
            icon={<Eye size={16} style={{ color: BLUE }} />}
          />
        </div>
      </div>

      {/* Tier 2 — Real-Time Monitoring */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GREEN }} />
          <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: GREEN }}>
            Real-Time Monitoring &amp; Intervention
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <PatentCard
            number={6}
            title="Real-Time Monitoring & Care Team Coordination"
            description="Continuous wearable monitoring triggers automated specialist interventions"
            accent={GREEN}
            icon={<Activity size={16} style={{ color: GREEN }} />}
          />
          <PatentCard
            number={7}
            title="Cycle-Based AI Recalibration"
            description="Monthly AI learning cycles differentiating clinical vs behavioral barriers"
            accent={GREEN}
            icon={<Zap size={16} style={{ color: GREEN }} />}
          />
          <PatentCard
            number={8}
            title="Objective Data Validation"
            description="Cross-validates self-reported symptoms against wearable data"
            accent={GREEN}
            icon={<Eye size={16} style={{ color: GREEN }} />}
          />
        </div>
      </div>

      {/* Tier 3 — Predictive Analytics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PURPLE }} />
          <h3 className="text-sm font-bold tracking-wide uppercase" style={{ color: PURPLE }}>
            Predictive Analytics &amp; Emerging Tech
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PatentCard
            number={9}
            title="Pregnancy Risk Assessment"
            description="Predictive analytics for adverse outcomes using pre-conception + wearable data"
            accent={PURPLE}
            icon={<Baby size={16} style={{ color: PURPLE }} />}
          />
          <PatentCard
            number={10}
            title="Smartphone Multi-Modal Assessment"
            description="Facial analysis + voice patterns for comprehensive health assessment"
            accent={PURPLE}
            icon={<Smartphone size={16} style={{ color: PURPLE }} />}
          />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Competitive Moat
   ────────────────────────────────────────────── */
interface CompetitorBlockProps {
  name: string;
  patents: string;
  explanation: string;
  color: string;
}

function CompetitorBlock({ name, patents, explanation, color }: CompetitorBlockProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}14` }}
        >
          <Shield size={14} style={{ color }} />
        </div>
        <div>
          <h4 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{name}</h4>
          <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color }}>
            Blocked by: {patents}
          </p>
        </div>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        {explanation}
      </p>
    </div>
  );
}

function CompetitiveMoat() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Competitive Moat
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Patent portfolio creates multi-directional competitive blocking
        </p>
      </div>

      {/* Center hub */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${BLACK} 0%, ${NAVY} 100%)`,
        }}
      >
        {/* Conceivable hub */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ backgroundColor: "rgba(90,111,255,0.2)", border: "1px solid rgba(90,111,255,0.3)" }}
          >
            <Shield size={16} style={{ color: BLUE }} />
            <span className="text-sm font-bold" style={{ color: OFF_WHITE }}>
              Conceivable — Protected Core
            </span>
          </div>
          <div className="flex justify-center mt-3 mb-1">
            <div className="w-px h-6" style={{ backgroundColor: "rgba(249,247,240,0.2)" }} />
          </div>
          <p className="text-xs" style={{ color: "rgba(249,247,240,0.4)" }}>
            10 patents blocking all competitive vectors
          </p>
        </div>

        {/* Radiating arrows to competitors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "rgba(249,247,240,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E24D47" }} />
              <p className="text-xs font-bold" style={{ color: OFF_WHITE }}>Oura Ring</p>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: "#E24D47" }}>
              Blocked by: Patent 9 (Pregnancy Risk Assessment)
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(249,247,240,0.6)" }}>
              Limited to basic tracking. We control intervention-based pregnancy health optimization.
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "rgba(249,247,240,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
              <p className="text-xs font-bold" style={{ color: OFF_WHITE }}>Fertility Apps (Flo, Clue, Ava)</p>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: "#F59E0B" }}>
              Blocked by: Patents 2, 3, 5 (Root Cause + Population Learning + Pattern Attribution)
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(249,247,240,0.6)" }}>
              Cannot develop AI-driven intervention systems.
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "rgba(249,247,240,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
              <p className="text-xs font-bold" style={{ color: OFF_WHITE }}>AI Health Platforms (Whoop, Levels)</p>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase mb-1.5" style={{ color: BLUE }}>
              Blocked by: Patents 1, 2, 8 (Score + Root Cause + Validation)
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(249,247,240,0.6)" }}>
              Cannot replicate holistic health assessment methodology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Licensing Opportunities
   ────────────────────────────────────────────── */
function LicensingOpportunities() {
  const opportunities = [
    {
      title: "Healthcare Systems",
      description: "License predictive analytics for population health management",
      icon: <Activity size={18} style={{ color: BLUE }} />,
    },
    {
      title: "Wearable Companies",
      description: "License AI interpretation layers for raw physiological data",
      icon: <Eye size={18} style={{ color: GREEN }} />,
    },
    {
      title: "Pharma",
      description: "License population-based intervention optimization for clinical trials",
      icon: <Zap size={18} style={{ color: PURPLE }} />,
    },
    {
      title: "Digital Health Platforms",
      description: "License real-time monitoring and intervention coordination",
      icon: <Brain size={18} style={{ color: NAVY }} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Licensing Opportunities
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Multiple revenue streams from IP portfolio
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {opportunities.map((opp) => (
          <div
            key={opp.title}
            className="rounded-xl p-5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--background)" }}
            >
              {opp.icon}
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
              {opp.title}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              {opp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Market Validation
   ────────────────────────────────────────────── */
function MarketValidation() {
  const stats = [
    { value: "25+ years", label: "Clinical experience" },
    { value: "500K+", label: "BBT charts analyzed" },
    { value: "7,000+", label: "Patient outcome records" },
    { value: "240K+", label: "Data points in current platform" },
    { value: "US 10,467,382", label: "Granted patent (2019)" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BLACK} 0%, #1a1a2e 100%)`,
      }}
    >
      <div className="px-8 md:px-12 py-8">
        <p
          className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6"
          style={{ color: "rgba(249,247,240,0.4)" }}
        >
          Market Validation
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-lg md:text-xl font-bold mb-0.5" style={{ color: OFF_WHITE }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "rgba(249,247,240,0.5)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Investment Implications
   ────────────────────────────────────────────── */
function InvestmentImplications() {
  const columns = [
    {
      title: "IP Value Drivers",
      color: BLUE,
      items: [
        "First-mover advantage in AI fertility health",
        "Dataset moat with high barriers to entry",
        "Full-stack platform protection",
        "Expandable beyond fertility to all women\u2019s health",
      ],
    },
    {
      title: "Revenue Protection",
      color: GREEN,
      items: [
        "Patents protect core subscription functionality",
        "B2B licensing creates additional revenue streams",
        "Comprehensive portfolio increases acquisition value",
      ],
    },
    {
      title: "Risk Mitigation",
      color: PURPLE,
      items: [
        "Competitive protection prevents direct replication",
        "Freedom to operate with proprietary innovations",
        "Clinical validation creates regulatory moat beyond IP",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Investment Implications
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <h3 className="text-sm font-bold" style={{ color: col.color }}>
                {col.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div
                    className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
export default function ExecutiveSummaryPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useCallback(() => {
    // Open print dialog which allows saving as PDF
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Conceivable IP Portfolio — Executive Summary</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #2A2828;
            background: #ffffff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { margin: 0.5in; size: letter; }
          .print-container { max-width: 100%; }
          .print-container > div { margin-bottom: 24px; }
          /* Force background colors to print */
          .gradient-header {
            background: linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%) !important;
            border-radius: 12px; padding: 40px; margin-bottom: 24px;
          }
          .gradient-header h1 { color: #F9F7F0; font-size: 28px; font-weight: 700; margin-bottom: 4px; }
          .gradient-header .subtitle { color: rgba(249,247,240,0.7); font-size: 14px; margin-bottom: 32px; }
          .gradient-header .investor-label { color: rgba(249,247,240,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
          .stat-row { display: flex; gap: 12px; }
          .stat-card { flex: 1; background: rgba(249,247,240,0.08); border-radius: 8px; padding: 16px 20px; }
          .stat-card .val { color: #F9F7F0; font-size: 22px; font-weight: 700; }
          .stat-card .lbl { color: rgba(249,247,240,0.6); font-size: 11px; margin-top: 2px; }
          h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
          .section-sub { color: #888; font-size: 12px; margin-bottom: 12px; }
          .tier-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
          .card-grid { display: flex; gap: 10px; margin-bottom: 16px; }
          .card-grid .card { flex: 1; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px; }
          .card .num { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
          .card h4 { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
          .card p { font-size: 11px; color: #666; line-height: 1.5; }
          .dark-section { background: linear-gradient(135deg, #2A2828 0%, #1a1a2e 100%) !important; border-radius: 12px; padding: 28px 32px; }
          .dark-section .label { color: rgba(249,247,240,0.4); font-size: 9px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
          .dark-stats { display: flex; gap: 20px; }
          .dark-stats .item .val { color: #F9F7F0; font-size: 16px; font-weight: 700; }
          .dark-stats .item .lbl { color: rgba(249,247,240,0.5); font-size: 10px; }
          .three-col { display: flex; gap: 12px; }
          .three-col .col { flex: 1; border: 1px solid #e5e5e5; border-radius: 10px; padding: 18px; }
          .three-col .col h3 { font-size: 12px; font-weight: 700; margin-bottom: 10px; }
          .three-col .col li { font-size: 11px; line-height: 1.6; margin-bottom: 4px; list-style: none; padding-left: 10px; position: relative; }
          .three-col .col li::before { content: ''; position: absolute; left: 0; top: 7px; width: 4px; height: 4px; border-radius: 50%; }
          .moat-section { background: linear-gradient(135deg, #2A2828 0%, #356FB6 100%) !important; border-radius: 12px; padding: 24px; }
          .moat-hub { text-align: center; margin-bottom: 16px; }
          .moat-hub .badge { display: inline-block; background: rgba(90,111,255,0.2); border: 1px solid rgba(90,111,255,0.3); border-radius: 20px; padding: 6px 16px; color: #F9F7F0; font-size: 12px; font-weight: 700; }
          .moat-grid { display: flex; gap: 10px; }
          .moat-card { flex: 1; background: rgba(249,247,240,0.06); border-radius: 8px; padding: 12px; }
          .moat-card .name { color: #F9F7F0; font-size: 11px; font-weight: 700; margin-bottom: 4px; }
          .moat-card .blocked { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
          .moat-card .desc { color: rgba(249,247,240,0.6); font-size: 10px; line-height: 1.5; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="gradient-header">
            <div class="investor-label">Investor Overview</div>
            <h1>Conceivable IP Portfolio</h1>
            <div class="subtitle">Comprehensive Patent Protection for AI-Powered Fertility Health Platform</div>
            <div class="stat-row">
              <div class="stat-card"><div class="val">10 Patents</div><div class="lbl">Foundational portfolio</div></div>
              <div class="stat-card"><div class="val">$18-30M</div><div class="lbl">Estimated licensing potential</div></div>
              <div class="stat-card"><div class="val">3 Layers</div><div class="lbl">Core Platform \u00b7 Real-Time \u00b7 Predictive</div></div>
            </div>
          </div>

          <div>
            <h2>Portfolio Architecture</h2>
            <div class="section-sub">Three-tier protection strategy covering the full technology stack</div>
            <div class="tier-label" style="color:#5A6FFF">Core Platform Protection</div>
            <div class="card-grid">
              <div class="card"><div class="num" style="color:#5A6FFF">Patent 1</div><h4>Conceivable Score System</h4><p>Five-category composite fertility scoring using weighted multi-signal wearable inputs</p></div>
              <div class="card"><div class="num" style="color:#5A6FFF">Patent 2</div><h4>AI-Powered Root Cause Analysis</h4><p>AI identifies underlying physiological conditions causing multiple symptoms simultaneously</p></div>
              <div class="card"><div class="num" style="color:#5A6FFF">Patent 3</div><h4>Population-Based Pattern Learning</h4><p>AI learns optimal intervention sequences from 1000+ users with similar physiological patterns</p></div>
              <div class="card"><div class="num" style="color:#5A6FFF">Patent 4</div><h4>Closed-Loop Physiologic Correction System</h4><p>Measures intervention effectiveness through continuous wearable monitoring and automatically escalates protocols when corrections fail</p></div>
              <div class="card"><div class="num" style="color:#5A6FFF">Patent 5</div><h4>AI-Driven Physiological Pattern Attribution</h4><p>Iterative causal analysis that drills down to root causes through dynamic questioning, validates attributions through outcome tracking, and learns from population-level intervention success patterns</p></div>
            </div>
            <div class="tier-label" style="color:#1EAA55">Real-Time Monitoring & Intervention</div>
            <div class="card-grid">
              <div class="card"><div class="num" style="color:#1EAA55">Patent 6</div><h4>Real-Time Monitoring & Care Team Coordination</h4><p>Continuous wearable monitoring triggers automated specialist interventions</p></div>
              <div class="card"><div class="num" style="color:#1EAA55">Patent 7</div><h4>Cycle-Based AI Recalibration</h4><p>Monthly AI learning cycles differentiating clinical vs behavioral barriers</p></div>
              <div class="card"><div class="num" style="color:#1EAA55">Patent 8</div><h4>Objective Data Validation</h4><p>Cross-validates self-reported symptoms against wearable data</p></div>
            </div>
            <div class="tier-label" style="color:#9686B9">Predictive Analytics & Emerging Tech</div>
            <div class="card-grid">
              <div class="card" style="flex:1"><div class="num" style="color:#9686B9">Patent 9</div><h4>Pregnancy Risk Assessment</h4><p>Predictive analytics for adverse outcomes using pre-conception + wearable data</p></div>
              <div class="card" style="flex:1"><div class="num" style="color:#9686B9">Patent 10</div><h4>Smartphone Multi-Modal Assessment</h4><p>Facial analysis + voice patterns for comprehensive health assessment</p></div>
            </div>
          </div>

          <div class="page-break"></div>

          <div>
            <h2>Competitive Moat</h2>
            <div class="section-sub">Patent portfolio creates multi-directional competitive blocking</div>
            <div class="moat-section">
              <div class="moat-hub"><span class="badge">Conceivable \u2014 Protected Core</span></div>
              <div class="moat-grid">
                <div class="moat-card"><div class="name">Oura Ring</div><div class="blocked" style="color:#E24D47">Blocked by: Patent 9 (Pregnancy Risk Assessment)</div><div class="desc">Limited to basic tracking. We control intervention-based pregnancy health optimization.</div></div>
                <div class="moat-card"><div class="name">Fertility Apps (Flo, Clue, Ava)</div><div class="blocked" style="color:#F59E0B">Blocked by: Patents 2, 3, 5 (Root Cause + Population Learning + Pattern Attribution)</div><div class="desc">Cannot develop AI-driven intervention systems.</div></div>
                <div class="moat-card"><div class="name">AI Health Platforms (Whoop, Levels)</div><div class="blocked" style="color:#5A6FFF">Blocked by: Patents 1, 2, 8 (Score + Root Cause + Validation)</div><div class="desc">Cannot replicate holistic health assessment methodology.</div></div>
              </div>
            </div>
          </div>

          <div>
            <h2>Licensing Opportunities</h2>
            <div class="card-grid">
              <div class="card"><h4>Healthcare Systems</h4><p>License predictive analytics for population health management</p></div>
              <div class="card"><h4>Wearable Companies</h4><p>License AI interpretation layers for raw physiological data</p></div>
              <div class="card"><h4>Pharma</h4><p>License population-based intervention optimization for clinical trials</p></div>
              <div class="card"><h4>Digital Health Platforms</h4><p>License real-time monitoring and intervention coordination</p></div>
            </div>
          </div>

          <div class="dark-section">
            <div class="label">Market Validation</div>
            <div class="dark-stats">
              <div class="item"><div class="val">25+ years</div><div class="lbl">Clinical experience</div></div>
              <div class="item"><div class="val">500K+</div><div class="lbl">BBT charts analyzed</div></div>
              <div class="item"><div class="val">7,000+</div><div class="lbl">Patient outcome records</div></div>
              <div class="item"><div class="val">240K+</div><div class="lbl">Data points in current platform</div></div>
              <div class="item"><div class="val">US 10,467,382</div><div class="lbl">Granted patent (2019)</div></div>
            </div>
          </div>

          <div>
            <h2>Investment Implications</h2>
            <div class="three-col">
              <div class="col"><h3 style="color:#5A6FFF">IP Value Drivers</h3><ul><li style="color:#2A2828">First-mover advantage in AI fertility health</li><li>Dataset moat with high barriers to entry</li><li>Full-stack platform protection</li><li>Expandable beyond fertility to all women\u2019s health</li></ul></div>
              <div class="col"><h3 style="color:#1EAA55">Revenue Protection</h3><ul><li>Patents protect core subscription functionality</li><li>B2B licensing creates additional revenue streams</li><li>Comprehensive portfolio increases acquisition value</li></ul></div>
              <div class="col"><h3 style="color:#9686B9">Risk Mitigation</h3><ul><li>Competitive protection prevents direct replication</li><li>Freedom to operate with proprietary innovations</li><li>Clinical validation creates regulatory moat beyond IP</li></ul></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    // Wait for content to render before printing
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }, []);

  return (
    <div ref={printRef} className="space-y-8 pb-12">
      {/* Section 1 — Hero */}
      <HeroHeader />

      {/* Section 2 — Portfolio Architecture */}
      <PortfolioArchitecture />

      {/* Section 3 — Competitive Moat */}
      <CompetitiveMoat />

      {/* Section 4 — Licensing Opportunities */}
      <LicensingOpportunities />

      {/* Section 5 — Market Validation */}
      <MarketValidation />

      {/* Section 6 — Investment Implications */}
      <InvestmentImplications />

      {/* Section 7 — Export Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)`,
            color: OFF_WHITE,
            boxShadow: "0 2px 8px rgba(90,111,255,0.3)",
          }}
        >
          <Download size={16} />
          Export as PDF
        </button>
      </div>
    </div>
  );
}
