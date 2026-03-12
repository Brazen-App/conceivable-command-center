"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  LayoutGrid,
  FileText,
  Palette,
  Loader2,
  ExternalLink,
} from "lucide-react";

const BRAND_BLUE = "#5A6FFF";
const BRAND_BABY_BLUE = "#ACB7FF";
const BRAND_GREEN = "#1EAA55";

interface ExperienceData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  accentColor: string;
  status: string;
  _count?: { features: number };
}

const SLUG_ICONS: Record<string, string> = {
  "first-period": "\u{1F338}",
  "early-menstruator": "\u{1F331}",
  periods: "\u{1F4AB}",
  pcos: "\u{1F52C}",
  endometriosis: "\u{1F940}",
  fertility: "\u2728",
  pregnancy: "\u{1F31F}",
  postpartum: "\u{1F343}",
  perimenopause: "\u{1F525}",
  "menopause-beyond": "\u{1F30A}",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  not_started: { label: "Not Started", color: "#888" },
  in_design: { label: "In Design", color: "#F59E0B" },
  in_development: { label: "In Development", color: BRAND_BLUE },
  live: { label: "Live", color: BRAND_GREEN },
};

export default function ProductDashboardPage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/product/experiences")
      .then((r) => r.json())
      .then((data) => setExperiences(data))
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  const liveCount = experiences.filter((e) => e.status === "live").length;
  const designCount = experiences.filter((e) => e.status === "in_design").length;
  const totalFeatures = experiences.reduce((sum, e) => sum + (e._count?.features || 0), 0);

  return (
    <div>
      {/* Hero */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND_BLUE}10, ${BRAND_BABY_BLUE}08, #F9F7F0)`,
          border: `1px solid ${BRAND_BLUE}15`,
        }}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${BRAND_BABY_BLUE}, transparent)` }} />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: BRAND_BLUE }}>
              Product Overview
            </p>
            <h2 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              10 Conceivable Experiences
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              From First Period to Menopause & Beyond — every stage of a woman&apos;s health journey
            </p>
          </div>
          <div className="flex gap-6">
            {[
              { value: liveCount, label: "Live", color: BRAND_GREEN },
              { value: designCount, label: "In Design", color: "#F59E0B" },
              { value: totalFeatures, label: "Features", color: BRAND_BLUE },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={14} style={{ color: BRAND_BLUE }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            All Experiences
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {experiences.map((exp) => {
            const sc = STATUS_CONFIG[exp.status] || STATUS_CONFIG.not_started;
            const featureCount = exp._count?.features || 0;
            return (
              <Link
                key={exp.slug}
                href={`/departments/product/experiences/${exp.slug}`}
                className="rounded-2xl p-4 text-left transition-all hover:shadow-md group block"
                style={{
                  backgroundColor: "var(--surface)",
                  border: exp.status === "live"
                    ? `1px solid ${BRAND_GREEN}30`
                    : exp.status === "in_design"
                    ? `1px solid ${exp.accentColor}30`
                    : "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${exp.accentColor}14` }}
                  >
                    {SLUG_ICONS[exp.slug] || "\u2726"}
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sc.color }}
                  />
                </div>
                <h4 className="text-sm font-bold mb-0.5" style={{ color: "var(--foreground)" }}>
                  {exp.name}
                </h4>
                <p className="text-[10px] leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                  {exp.tagline}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${sc.color}14`, color: sc.color }}
                  >
                    {sc.label}
                  </span>
                  {featureCount > 0 && (
                    <span className="text-[10px] font-medium" style={{ color: exp.accentColor }}>
                      {featureCount} features
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Build Priority */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "#D4A843" }} />
          <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
            Build Priority
          </h3>
        </div>
        <div className="space-y-2">
          {[
            {
              slug: "fertility",
              phase: "Phase 1: Fertility (Flagship)",
              desc: "Core AI engine, Halo Ring integration, Conceivable Score, 50-factor dashboard",
              color: BRAND_BLUE,
              icon: "\u2728",
              status: "Live",
              statusColor: BRAND_GREEN,
            },
            {
              slug: "pregnancy",
              phase: "Phase 2: Pregnancy",
              desc: "Continuous monitoring, GD screening, First Trimester Guardian, OB Bridge Reports",
              color: "#D4A843",
              icon: "\u{1F31F}",
              status: "In Design",
              statusColor: "#F59E0B",
            },
            {
              slug: "postpartum",
              phase: "Phase 3: Postpartum",
              desc: "Recovery scoring, PPD detection, Luna agent, lactation intelligence, vital sign monitoring",
              color: "#7CAE7A",
              icon: "\u{1F343}",
              status: "In Design",
              statusColor: "#F59E0B",
            },
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/departments/product/experiences/${item.slug}`}
              className="flex items-center gap-4 rounded-2xl p-4 hover:shadow-sm transition-all block group"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${item.color}`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${item.color}14` }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {item.phase}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                style={{ backgroundColor: `${item.statusColor}14`, color: item.statusColor }}
              >
                {item.status}
              </span>
              <ArrowRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            title: "Experience Library",
            desc: "All 10 health experiences with features and specs",
            href: "/departments/product/experiences",
            icon: LayoutGrid,
            color: BRAND_BLUE,
          },
          {
            title: "Design System",
            desc: "Components, brand checks, and Figma reference",
            href: "/departments/product/design",
            icon: Palette,
            color: BRAND_BABY_BLUE,
          },
          {
            title: "Roadmap",
            desc: "Product roadmap and feature timeline",
            href: "/departments/product/roadmap",
            icon: FileText,
            color: "#D4A843",
          },
        ].map((nav) => (
          <Link
            key={nav.href}
            href={nav.href}
            className="rounded-2xl p-5 group hover:shadow-md transition-all"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
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
