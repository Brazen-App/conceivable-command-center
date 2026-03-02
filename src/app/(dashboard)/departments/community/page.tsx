"use client";

import { useState, useEffect } from "react";
import { Heart, CalendarDays, TrendingUp, Link2, GraduationCap } from "lucide-react";
import CommunityContent from "@/components/departments/community/CommunityContent";
import GrowthRetention from "@/components/departments/community/GrowthRetention";
import AffiliateProgram from "@/components/departments/community/AffiliateProgram";
import ExpertInterviews from "@/components/departments/community/ExpertInterviews";
import type {
  PostingCalendarEntry,
  DiscussionPrompt,
  MemberSpotlight,
  ResponseQueueItem,
  ContentSourceMetric,
  MemberMetrics,
  EngagementScore,
  ReengagementCampaign,
  OnboardingFunnel,
  CommunityChallenge,
  ConversionFunnel,
  WeeklyRecommendation,
  Affiliate,
  AffiliateMetrics,
  LeaderboardEntry,
  AffiliateOutreach,
  Expert,
  OutreachDraft,
  InterviewSchedule,
  PrepPacket,
  PostInterviewTask,
} from "@/lib/data/community-data";

const ACCENT = "#1EAA55";

const TABS = [
  { id: "content", label: "Community Content", icon: CalendarDays },
  { id: "growth", label: "Growth & Retention", icon: TrendingUp },
  { id: "affiliates", label: "Affiliate Program", icon: Link2 },
  { id: "experts", label: "Expert Interviews", icon: GraduationCap },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface CommunityData {
  postingCalendar: PostingCalendarEntry[];
  discussionPrompts: DiscussionPrompt[];
  memberSpotlights: MemberSpotlight[];
  responseQueue: ResponseQueueItem[];
  contentSourceMetrics: ContentSourceMetric[];
  memberMetrics: MemberMetrics;
  engagementScores: EngagementScore[];
  reengagementCampaigns: ReengagementCampaign[];
  onboardingFunnel: OnboardingFunnel[];
  communityChallenges: CommunityChallenge[];
  conversionFunnel: ConversionFunnel[];
  weeklyRecommendation: WeeklyRecommendation;
  affiliates: Affiliate[];
  affiliateMetrics: AffiliateMetrics;
  leaderboard: LeaderboardEntry[];
  affiliateOutreach: AffiliateOutreach[];
  experts: Expert[];
  outreachDrafts: OutreachDraft[];
  interviewSchedules: InterviewSchedule[];
  prepPackets: PrepPacket[];
  postInterviewTasks: PostInterviewTask[];
}

export default function CommunityDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [data, setData] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Heart size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Community
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Heartbeat — Build, Engage, Grow the Movement
            </p>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}0A`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Heart size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {data ? `${data.memberMetrics.total} members in Circle` : "Loading..."} &middot;{" "}
              {data ? `${data.memberMetrics.active} active` : ""} &middot;{" "}
              {data ? `${data.affiliateMetrics.totalAffiliates} affiliates` : ""} &middot;{" "}
              {data ? `${data.memberMetrics.newThisWeek} new this week` : ""}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              the-conceivable-community.circle.so
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {loading || !data ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading community data...</p>
        </div>
      ) : (
        <>
          {activeTab === "content" && (
            <CommunityContent
              postingCalendar={data.postingCalendar}
              discussionPrompts={data.discussionPrompts}
              memberSpotlights={data.memberSpotlights}
              responseQueue={data.responseQueue}
              contentSourceMetrics={data.contentSourceMetrics}
            />
          )}
          {activeTab === "growth" && (
            <GrowthRetention
              memberMetrics={data.memberMetrics}
              engagementScores={data.engagementScores}
              reengagementCampaigns={data.reengagementCampaigns}
              onboardingFunnel={data.onboardingFunnel}
              communityChallenges={data.communityChallenges}
              conversionFunnel={data.conversionFunnel}
              weeklyRecommendation={data.weeklyRecommendation}
            />
          )}
          {activeTab === "affiliates" && (
            <AffiliateProgram
              affiliates={data.affiliates}
              affiliateMetrics={data.affiliateMetrics}
              leaderboard={data.leaderboard}
              affiliateOutreach={data.affiliateOutreach}
            />
          )}
          {activeTab === "experts" && (
            <ExpertInterviews
              experts={data.experts}
              outreachDrafts={data.outreachDrafts}
              interviewSchedules={data.interviewSchedules}
              prepPackets={data.prepPackets}
              postInterviewTasks={data.postInterviewTasks}
            />
          )}
        </>
      )}
    </div>
  );
}
