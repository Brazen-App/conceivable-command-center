"use client";

import { useState } from "react";
import { Calendar, Star, BarChart3, Share2, Clock } from "lucide-react";

const ACCENT = "#1EAA55";

interface CalendarEntry {
  id: string;
  day: string;
  time: string;
  type: "discussion" | "spotlight" | "science" | "live-qa" | "resource";
  title: string;
  status: "scheduled" | "posted" | "draft";
}

const POSTING_CALENDAR: CalendarEntry[] = [
  { id: "pc01", day: "Monday", time: "9:00 AM", type: "discussion", title: "Mindset Monday: Weekly reflection prompt", status: "scheduled" },
  { id: "pc02", day: "Monday", time: "2:00 PM", type: "resource", title: "Share: Top 3 BBT tracking tips", status: "scheduled" },
  { id: "pc03", day: "Tuesday", time: "9:00 AM", type: "science", title: "Science Tuesday: Luteal phase explained", status: "scheduled" },
  { id: "pc04", day: "Wednesday", time: "9:00 AM", type: "discussion", title: "Wellness Wednesday: Meal prep tips", status: "scheduled" },
  { id: "pc05", day: "Wednesday", time: "12:00 PM", type: "spotlight", title: "Member Spotlight: Rachel's journey", status: "draft" },
  { id: "pc06", day: "Thursday", time: "9:00 AM", type: "science", title: "Data Thursday: Understanding your labs", status: "scheduled" },
  { id: "pc07", day: "Thursday", time: "4:00 PM", type: "live-qa", title: "Live Q&A with Kirsten (CEO)", status: "scheduled" },
  { id: "pc08", day: "Friday", time: "9:00 AM", type: "discussion", title: "Wins Friday: Share your progress", status: "scheduled" },
  { id: "pc09", day: "Friday", time: "2:00 PM", type: "resource", title: "Weekend reading: Research roundup", status: "draft" },
  { id: "pc10", day: "Saturday", time: "10:00 AM", type: "discussion", title: "Weekend check-in: Self-care plans", status: "scheduled" },
];

interface MemberSpotlight {
  id: string;
  name: string;
  memberSince: string;
  journey: string;
  topInsight: string;
  status: "published" | "scheduled" | "draft";
  scheduledDate: string;
}

const MEMBER_SPOTLIGHTS: MemberSpotlight[] = [
  { id: "ms01", name: "Rachel S.", memberSince: "September 2025", journey: "PCOS journey: from irregular cycles to consistent ovulation in 4 months using personalized supplement protocol.", topInsight: "The combination of inositol and consistent BBT tracking changed everything for me.", status: "published", scheduledDate: "2026-02-26" },
  { id: "ms02", name: "Jennifer T.", memberSince: "October 2025", journey: "Age 38, diminished ovarian reserve. Using data to optimize every cycle and work with her RE.", topInsight: "Having all my data in one place transformed my conversations with my doctor.", status: "scheduled", scheduledDate: "2026-03-05" },
  { id: "ms03", name: "Amanda B.", memberSince: "November 2025", journey: "Unexplained infertility for 2 years. Community support + targeted interventions led to pregnancy.", topInsight: "I never would have thought to check my thyroid without the community recommending it.", status: "draft", scheduledDate: "2026-03-12" },
  { id: "ms04", name: "Kim H.", memberSince: "August 2025", journey: "Early member who has tracked every biomarker for 6 months. Became a mentor to new members.", topInsight: "Seeing my data trends over time gave me so much confidence. The patterns tell a story.", status: "draft", scheduledDate: "2026-03-19" },
];

interface ContentSourceMetric {
  source: string;
  postsPerWeek: number;
  avgEngagement: number;
  conversionToAction: number;
}

const CONTENT_SOURCE_METRICS: ContentSourceMetric[] = [
  { source: "CEO Live Q&As", postsPerWeek: 1, avgEngagement: 45, conversionToAction: 28 },
  { source: "Discussion Prompts", postsPerWeek: 7, avgEngagement: 24, conversionToAction: 15 },
  { source: "Science Explainers", postsPerWeek: 2, avgEngagement: 18, conversionToAction: 22 },
  { source: "Member Spotlights", postsPerWeek: 1, avgEngagement: 32, conversionToAction: 12 },
  { source: "Resource Shares", postsPerWeek: 3, avgEngagement: 8, conversionToAction: 35 },
  { source: "Cross-posted from Marketing", postsPerWeek: 2, avgEngagement: 14, conversionToAction: 18 },
];

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    discussion: "#1EAA55",
    spotlight: "#F1C028",
    science: "#78C3BF",
    "live-qa": "#9686B9",
    resource: "#356FB6",
  };
  const color = colors[type] || ACCENT;
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${color}18`, color }}>
      {type.replace("-", " ")}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string }> = {
    scheduled: { bg: "#1EAA5518", color: "#1EAA55" },
    posted: { bg: "#356FB618", color: "#356FB6" },
    draft: { bg: "#F1C02818", color: "#F1C028" },
    published: { bg: "#1EAA5518", color: "#1EAA55" },
  };
  const c = config[status] || config.draft;
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

export default function ContentPage() {
  return (
    <div className="space-y-6">
      {/* Posting Calendar */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Calendar size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Community Content Calendar
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Day</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Time</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Type</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Title</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {POSTING_CALENDAR.map((entry) => (
                <tr key={entry.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{entry.day}</td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{entry.time}</td>
                  <td className="px-5 py-3"><TypeBadge type={entry.type} /></td>
                  <td className="px-5 py-3" style={{ color: "var(--foreground)" }}>{entry.title}</td>
                  <td className="px-5 py-3"><StatusBadge status={entry.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Spotlights */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center gap-2">
          <Star size={16} style={{ color: "#F1C028" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Member Spotlights</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {MEMBER_SPOTLIGHTS.map((spotlight) => (
            <div key={spotlight.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{spotlight.name}</p>
                    <StatusBadge status={spotlight.status} />
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Member since {spotlight.memberSince}</p>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--foreground)" }}>{spotlight.journey}</p>
                  <p className="text-xs mt-2 italic" style={{ color: ACCENT }}>
                    &ldquo;{spotlight.topInsight}&rdquo;
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1">
                    <Clock size={10} style={{ color: "var(--muted)" }} />
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{spotlight.scheduledDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Source Metrics */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Content Source Metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Source</th>
                <th className="text-right pb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Posts/Week</th>
                <th className="text-right pb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Avg Engagement</th>
                <th className="text-right pb-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Action Rate</th>
              </tr>
            </thead>
            <tbody>
              {CONTENT_SOURCE_METRICS.map((metric) => (
                <tr key={metric.source} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="py-2 font-medium" style={{ color: "var(--foreground)" }}>{metric.source}</td>
                  <td className="py-2 text-right" style={{ color: "var(--muted)" }}>{metric.postsPerWeek}</td>
                  <td className="py-2 text-right font-medium" style={{ color: ACCENT }}>{metric.avgEngagement}</td>
                  <td className="py-2 text-right" style={{ color: "var(--muted)" }}>{metric.conversionToAction}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-post section */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#356FB610", border: "1px solid #356FB620" }}
      >
        <Share2 size={16} style={{ color: "#356FB6" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Cross-Post from Marketing</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            2 pieces of Marketing content are cross-posted to the community each week.
            Best performing: science explainers and research summaries.
            All cross-posted content must pass compliance scan before community publication.
          </p>
        </div>
      </div>
    </div>
  );
}
