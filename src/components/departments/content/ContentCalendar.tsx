"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Image,
  Zap,
  CheckCircle2,
  Circle,
  Clock,
  Send,
} from "lucide-react";
import type { CalendarEntry, Platform } from "@/lib/data/content-engine";

interface Props {
  entries: CalendarEntry[];
}

const PLATFORM_ICON: Record<Platform, typeof Linkedin> = {
  linkedin: Linkedin,
  x: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  pinterest: Image,
};

const PLATFORM_COLOR: Record<Platform, string> = {
  linkedin: "#0A66C2",
  x: "#1DA1F2",
  facebook: "#1877F2",
  instagram: "#E4405F",
  pinterest: "#BD081C",
};

const STATUS_CONFIG: Record<string, { icon: typeof Circle; color: string }> = {
  draft: { icon: Circle, color: "var(--muted-light)" },
  approved: { icon: CheckCircle2, color: "#1EAA55" },
  scheduled: { icon: Clock, color: "#5A6FFF" },
  published: { icon: Send, color: "#E37FB1" },
};

function getWeekDays(weekOffset: number): Date[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function ContentCalendar({ entries }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = getWeekDays(weekOffset);

  const isToday = (d: Date) => isSameDay(d, new Date());

  // Daily production target
  const todayEntries = entries.filter((e) => isSameDay(new Date(e.date), new Date()));
  const todayCount = todayEntries.length;
  const dailyTarget = 100;

  // Weekly stats
  const weekEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d >= weekDays[0] && d <= weekDays[6];
  });
  const publishedThisWeek = weekEntries.filter((e) => e.status === "published").length;
  const scheduledThisWeek = weekEntries.filter((e) => e.status === "scheduled").length;
  const multipliers = weekEntries.filter((e) => e.isMultiplier).length;

  // Platform distribution
  const platformCounts: Record<Platform, number> = {
    linkedin: 0,
    x: 0,
    facebook: 0,
    instagram: 0,
    pinterest: 0,
  };
  weekEntries.forEach((e) => {
    platformCounts[e.platform]++;
  });

  return (
    <div>
      {/* Daily production counter */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "linear-gradient(135deg, #F1C028 0%, #1EAA55 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-semibold text-sm">Daily Production</p>
            <p className="text-white/60 text-xs">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-3xl font-bold">{todayCount}</p>
            <p className="text-white/50 text-[10px] uppercase tracking-wider">/ {dailyTarget} target</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-white/20">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min((todayCount / dailyTarget) * 100, 100)}%`,
              backgroundColor: "white",
            }}
          />
        </div>
      </div>

      {/* Week stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Published", value: publishedThisWeek, color: "#E37FB1" },
          { label: "Scheduled", value: scheduledThisWeek, color: "#5A6FFF" },
          { label: "Total Pieces", value: weekEntries.length, color: "#F1C028" },
          { label: "Multipliers", value: multipliers, color: "#1EAA55" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <p
              className="text-[9px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "var(--muted)" }}
            >
              {stat.label}
            </p>
            <p className="text-xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Platform distribution */}
      <div
        className="rounded-xl border p-4 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Platform Distribution This Week
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {(Object.keys(PLATFORM_ICON) as Platform[]).map((platform) => {
            const Icon = PLATFORM_ICON[platform];
            const count = platformCounts[platform];
            return (
              <div key={platform} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${PLATFORM_COLOR[platform]}14` }}
                >
                  <Icon size={14} style={{ color: PLATFORM_COLOR[platform] }} />
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="p-2 rounded-lg hover:bg-[var(--background)]"
        >
          <ChevronLeft size={16} style={{ color: "var(--muted)" }} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={14} style={{ color: "#F1C028" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
            {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="p-2 rounded-lg hover:bg-[var(--background)]"
        >
          <ChevronRight size={16} style={{ color: "var(--muted)" }} />
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {day}
            </p>
          </div>
        ))}

        {/* Day cells */}
        {weekDays.map((day) => {
          const dayEntries = entries.filter((e) => isSameDay(new Date(e.date), day));
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`rounded-xl border p-2 min-h-[120px] ${today ? "ring-2 ring-[#F1C02840]" : ""}`}
              style={{
                borderColor: today ? "#F1C028" : "var(--border)",
                backgroundColor: today ? "#F1C02806" : "var(--surface)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold ${today ? "text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}
                  style={
                    today
                      ? { backgroundColor: "#F1C028" }
                      : { color: "var(--foreground)" }
                  }
                >
                  {day.getDate()}
                </span>
                {dayEntries.length > 0 && (
                  <span className="text-[9px] font-bold" style={{ color: "#F1C028" }}>
                    {dayEntries.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEntries.slice(0, 3).map((entry) => {
                  const PlatIcon = PLATFORM_ICON[entry.platform];
                  const statusConf = STATUS_CONFIG[entry.status];
                  const StatusIcon = statusConf.icon;
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-1 px-1.5 py-1 rounded"
                      style={{ backgroundColor: `${PLATFORM_COLOR[entry.platform]}08` }}
                    >
                      <PlatIcon size={8} style={{ color: PLATFORM_COLOR[entry.platform] }} />
                      <span
                        className="text-[8px] truncate flex-1"
                        style={{ color: "var(--foreground)" }}
                      >
                        {entry.title}
                      </span>
                      {entry.isMultiplier && <Zap size={7} style={{ color: "#F1C028" }} />}
                      <StatusIcon size={7} style={{ color: statusConf.color }} />
                    </div>
                  );
                })}
                {dayEntries.length > 3 && (
                  <p className="text-[8px] text-center" style={{ color: "var(--muted-light)" }}>
                    +{dayEntries.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Multiplier highlights */}
      {multipliers > 0 && (
        <div
          className="rounded-xl border p-4 mt-6"
          style={{ borderColor: "#F1C02820", backgroundColor: "#F1C02806" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} style={{ color: "#F1C028" }} />
            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              Cross-Department Multipliers This Week
            </p>
          </div>
          <div className="space-y-2">
            {weekEntries
              .filter((e) => e.isMultiplier)
              .map((entry) => (
                <div key={entry.id} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "#F1C028" }}
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {entry.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {entry.multiplierNote}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
