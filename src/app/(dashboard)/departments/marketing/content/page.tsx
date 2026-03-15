"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Share2,
  Youtube,
  Video,
  Calendar,
} from "lucide-react";
import { colors } from "@/lib/theme";

const DailySocial = dynamic(() => import("./DailySocial"), { ssr: false });
const YouTubeTab = dynamic(() => import("./YouTubeTab"), { ssr: false });
const TikTokTab = dynamic(() => import("./TikTokTab"), { ssr: false });
const ContentCalendarView = dynamic(() => import("./ContentCalendarView"), { ssr: false });

type Tab = "social" | "youtube" | "tiktok" | "calendar";

const TABS: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
  { id: "social", label: "Daily Social", icon: Share2, color: colors.blue },
  { id: "youtube", label: "YouTube — Conceivable University", icon: Youtube, color: "#FF0000" },
  { id: "tiktok", label: "TikTok", icon: Video, color: "#000000" },
  { id: "calendar", label: "Content Calendar", icon: Calendar, color: colors.green },
];

export default function ContentPublishingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("social");

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
              style={{
                backgroundColor: isActive ? "var(--surface)" : "transparent",
                color: isActive ? tab.color : "var(--muted)",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                border: isActive ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              <Icon size={14} style={{ color: isActive ? tab.color : "var(--muted)" }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "social" && <DailySocial />}
      {activeTab === "youtube" && <YouTubeTab />}
      {activeTab === "tiktok" && <TikTokTab />}
      {activeTab === "calendar" && <ContentCalendarView />}
    </div>
  );
}
