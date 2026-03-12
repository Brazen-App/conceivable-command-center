"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface Experience {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  accentColor: string;
  status: string;
  _count: { features: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: "Not Started", color: "#888", bg: "#88881a" },
  in_design: { label: "In Design", color: "#F59E0B", bg: "#F59E0B1a" },
  in_development: { label: "In Development", color: "#5A6FFF", bg: "#5A6FFF1a" },
  live: { label: "Live", color: "#1EAA55", bg: "#1EAA551a" },
};

const ICONS: Record<string, string> = {
  "first-period": "\u{1F338}",
  "early-menstruator": "\u{1F331}",
  periods: "\u{1F4AB}",
  pcos: "\u{1F52C}",
  endometriosis: "\u{1F940}",
  fertility: "\u{2728}",
  pregnancy: "\u{1F31F}",
  postpartum: "\u{1F343}",
  perimenopause: "\u{1F525}",
  "menopause-beyond": "\u{1F30A}",
};

export default function ExperiencesDashboard() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/product/experiences")
      .then((r) => r.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
  const totalFeatures = experiences.reduce((sum, e) => sum + e._count.features, 0);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)",
        }}
      >
        <div className="relative z-10">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-caption)" }}
          >
            The Conceivable Platform
          </p>
          <h2
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            10 Health Experiences
          </h2>
          <p className="text-sm text-white/70 max-w-lg">
            One platform. Every stage of a woman&apos;s health journey. From her first period
            to menopause and beyond.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{liveCount}</div>
              <div className="text-xs text-white/50">Live</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{designCount}</div>
              <div className="text-xs text-white/50">In Design</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalFeatures}</div>
              <div className="text-xs text-white/50">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10</div>
              <div className="text-xs text-white/50">Total</div>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #ACB7FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E37FB1 0%, transparent 70%)" }}
        />
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((exp) => {
          const status = STATUS_CONFIG[exp.status] || STATUS_CONFIG.not_started;
          const isFlagship = exp.slug === "fertility";

          return (
            <Link
              key={exp.id}
              href={`/departments/product/experiences/${exp.slug}`}
              className="group relative rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--surface)",
                border: isFlagship
                  ? `2px solid ${exp.accentColor}`
                  : "1px solid var(--border)",
              }}
            >
              {/* Flagship Badge */}
              {isFlagship && (
                <div
                  className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
                  style={{
                    backgroundColor: exp.accentColor,
                    color: "white",
                    fontFamily: "var(--font-caption)",
                    letterSpacing: "0.12em",
                    fontSize: "9px",
                  }}
                >
                  <Sparkles size={10} />
                  FLAGSHIP — LIVE
                </div>
              )}

              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${exp.accentColor}18` }}
                >
                  {ICONS[exp.slug] || "✦"}
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </div>
              </div>

              {/* Card Body */}
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--foreground)" }}
              >
                {exp.name}
              </h3>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {exp.tagline}
              </p>

              {/* Card Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {exp._count.features} feature{exp._count.features !== 1 ? "s" : ""}
                </span>
                <div
                  className="flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: exp.accentColor }}
                >
                  Open workspace
                  <ArrowRight size={12} />
                </div>
              </div>

              {/* Accent line at bottom */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: exp.accentColor }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
