"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Share2, Youtube, Video } from "lucide-react";
import { colors } from "@/lib/theme";

// ── Types ───────────────────────────────────────────────────

type Platform = "social" | "youtube" | "tiktok";

interface CalendarItem {
  id: string;
  title: string;
  platform: Platform;
  time?: string;
  category?: string;
}

const PLATFORM_META: Record<Platform, { label: string; color: string; icon: React.ElementType }> = {
  social: { label: "Daily Social", color: colors.blue, icon: Share2 },
  youtube: { label: "YouTube", color: "#FF0000", icon: Youtube },
  tiktok: { label: "TikTok", color: "#000000", icon: Video },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Sample calendar data ────────────────────────────────────

function getSampleItems(weekStart: Date): CalendarItem[] {
  const items: CalendarItem[] = [];
  const topics = [
    { title: "PCOS awareness post", platform: "social" as Platform, day: 0, category: "PCOS" },
    { title: "LinkedIn: Fertility data myths", platform: "social" as Platform, day: 0, category: "Fertility" },
    { title: "Why Your BBT Chart Is Lying to You", platform: "youtube" as Platform, day: 1, category: "Ovulation" },
    { title: "Instagram: Supplement stack breakdown", platform: "social" as Platform, day: 1, category: "Supplements" },
    { title: '"Stop taking folic acid if..."', platform: "tiktok" as Platform, day: 1, category: "Supplements" },
    { title: "Twitter/X: Period tracking thread", platform: "social" as Platform, day: 2, category: "Periods" },
    { title: '"Your period color means..."', platform: "tiktok" as Platform, day: 2, category: "Periods" },
    { title: "The IVF Success Rate Nobody Talks About", platform: "youtube" as Platform, day: 3, category: "IVF" },
    { title: "LinkedIn: Endometriosis research response", platform: "social" as Platform, day: 3, category: "Endometriosis" },
    { title: '"POV: you just found out your OPK was wrong"', platform: "tiktok" as Platform, day: 3, category: "Ovulation" },
    { title: "Instagram carousel: 5 signs of hormone imbalance", platform: "social" as Platform, day: 4, category: "Fertility" },
    { title: '"Things your doctor won\'t tell you about PCOS"', platform: "tiktok" as Platform, day: 4, category: "PCOS" },
    { title: "Pinterest: Fertility diet infographic", platform: "social" as Platform, day: 5, category: "Fertility" },
    { title: "How I Analyzed 10,000 Cycles", platform: "youtube" as Platform, day: 6, category: "Fertility" },
    { title: '"Wait... you can get pregnant from that?"', platform: "tiktok" as Platform, day: 6, category: "Fertility" },
  ];

  topics.forEach((t, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + t.day);
    items.push({
      id: `cal-${i}`,
      title: t.title,
      platform: t.platform,
      time: t.platform === "youtube" ? "10:00 AM" : t.platform === "tiktok" ? "6:00 PM" : "9:00 AM",
      category: t.category,
    });
  });

  return items;
}

// ── Main Component ──────────────────────────────────────────

export default function ContentCalendarView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState<Platform | "all">("all");

  const weekStart = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset + weekOffset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, [weekOffset]);

  const items = useMemo(() => getSampleItems(weekStart), [weekStart]);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const getItemsForDay = (dayIndex: number) => {
    let dayItems = items.filter((_, i) => {
      const topic = [
        0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 6,
      ];
      return topic[i] === dayIndex;
    });
    if (filter !== "all") dayItems = dayItems.filter((item) => item.platform === filter);
    return dayItems;
  };

  // Group items by day for the grid
  const dayItems = useMemo(() => {
    const grouped: CalendarItem[][] = Array.from({ length: 7 }, () => []);
    items.forEach((item) => {
      // Find which day this item belongs to based on the sample data pattern
      const dayMap: Record<string, number> = {};
      items.forEach((it, i) => {
        const dayIndexes = [0, 0, 1, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 6];
        dayMap[it.id] = dayIndexes[i] ?? 0;
      });
      const dayIdx = dayMap[item.id] ?? 0;
      if (filter === "all" || item.platform === filter) {
        grouped[dayIdx].push(item);
      }
    });
    return grouped;
  }, [items, filter]);

  // Topic overlap detection
  const categoryByDay = dayItems.map((day) => [...new Set(day.map((i) => i.category).filter(Boolean))]);
  const overlaps: number[] = [];
  categoryByDay.forEach((cats, dayIdx) => {
    cats.forEach((cat) => {
      // Check if same category appears on an adjacent day across different platforms
      const adjacentDays = [dayIdx - 1, dayIdx + 1].filter((d) => d >= 0 && d < 7);
      adjacentDays.forEach((adj) => {
        if (categoryByDay[adj]?.includes(cat)) {
          if (!overlaps.includes(dayIdx)) overlaps.push(dayIdx);
        }
      });
    });
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <ChevronLeft size={14} style={{ color: "var(--muted)" }} />
          </button>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {formatDate(weekStart)} — {formatDate(weekEnd)}
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted)" }}>
              {weekOffset === 0 ? "This week" : weekOffset === 1 ? "Next week" : weekOffset === -1 ? "Last week" : `${Math.abs(weekOffset)} weeks ${weekOffset > 0 ? "ahead" : "ago"}`}
            </p>
          </div>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${colors.blue}12`, color: colors.blue }}
            >
              Today
            </button>
          )}
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          <button
            onClick={() => setFilter("all")}
            className="text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
            style={{
              backgroundColor: filter === "all" ? "var(--background)" : "transparent",
              color: filter === "all" ? "var(--foreground)" : "var(--muted)",
            }}
          >
            All
          </button>
          {(Object.entries(PLATFORM_META) as [Platform, typeof PLATFORM_META.social][]).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md transition-all"
                style={{
                  backgroundColor: filter === key ? `${meta.color}12` : "transparent",
                  color: filter === key ? meta.color : "var(--muted)",
                }}
              >
                <Icon size={10} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {DAYS.map((day, i) => (
          <div key={day} className="text-center pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{SHORT_DAYS[i]}</span>
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
              {new Date(weekStart.getTime() + i * 86400000).getDate()}
            </p>
          </div>
        ))}

        {/* Day columns */}
        {dayItems.map((items, dayIdx) => (
          <div
            key={dayIdx}
            className="rounded-xl p-2 min-h-[160px] space-y-1.5"
            style={{
              backgroundColor: overlaps.includes(dayIdx) ? `${colors.yellow}06` : "var(--surface)",
              border: overlaps.includes(dayIdx) ? `1px solid ${colors.yellow}20` : "1px solid var(--border)",
            }}
          >
            {items.map((item) => {
              const meta = PLATFORM_META[item.platform];
              const Icon = meta.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-lg p-2 text-left"
                  style={{ backgroundColor: `${meta.color}08`, borderLeft: `3px solid ${meta.color}` }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Icon size={8} style={{ color: meta.color }} />
                    <span className="text-[8px] font-bold uppercase" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium leading-snug" style={{ color: "var(--foreground)" }}>
                    {item.title}
                  </p>
                  {item.time && (
                    <p className="text-[8px] mt-1" style={{ color: "var(--muted)" }}>{item.time}</p>
                  )}
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-[10px]" style={{ color: "var(--border)" }}>—</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {(Object.entries(PLATFORM_META) as [Platform, typeof PLATFORM_META.social][]).map(([key, meta]) => {
            const Icon = meta.icon;
            const count = items.filter((i) => i.platform === key).length;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: meta.color }} />
                <Icon size={10} style={{ color: meta.color }} />
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {meta.label} ({count})
                </span>
              </div>
            );
          })}
        </div>
        {overlaps.length > 0 && (
          <span className="text-[10px] font-bold" style={{ color: colors.yellow }}>
            ⚠ Topic overlap detected on highlighted days
          </span>
        )}
      </div>
    </div>
  );
}
