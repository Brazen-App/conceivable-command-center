// ────────────────────────────────────────────────────────────
// Community Department — Data & Types
// Manages the-conceivable-community.circle.so
// ────────────────────────────────────────────────────────────

// ── Community Content Types ──

export type Platform = "circle" | "facebook" | "instagram" | "email";
export type ContentSource = "content_engine" | "ceo_insight" | "member_question" | "trending_topic";
export type PromptStatus = "unused" | "scheduled" | "posted";
export type SpotlightStatus = "identified" | "contacted" | "approved" | "published";
export type ResponsePriority = "ceo_required" | "agent_handled";
export type ResponseStatus = "pending" | "in_progress" | "resolved";

export interface PostingCalendarEntry {
  id: string;
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  platform: Platform;
  contentType: string;
  topic: string;
  source: ContentSource;
  status: "scheduled" | "posted" | "draft";
  scheduledTime: string;
  engagement: number;
}

export interface DiscussionPrompt {
  id: string;
  prompt: string;
  category: string;
  estimatedEngagement: number;
  status: PromptStatus;
}

export interface MemberSpotlight {
  id: string;
  memberName: string;
  avatarInitials: string;
  joinDate: string;
  story: string;
  tags: string[];
  status: SpotlightStatus;
}

export interface ResponseQueueItem {
  id: string;
  postTitle: string;
  platform: Platform;
  memberName: string;
  excerpt: string;
  priority: ResponsePriority;
  flagReason: string;
  status: ResponseStatus;
}

export interface ContentSourceMetric {
  source: ContentSource;
  label: string;
  postsThisWeek: number;
  avgEngagement: number;
  trend: "up" | "down" | "flat";
}

// ── Growth & Retention Types ──

export interface MemberMetrics {
  total: number;
  active: number;
  newThisWeek: number;
  churned: number;
  activeRate: number;
  npsScore: number;
}

export type EngagementTier = "power_user" | "regular" | "lurker" | "dormant";

export interface EngagementScore {
  tier: EngagementTier;
  count: number;
  percentage: number;
  description: string;
}

export type ReengagementTrigger = "2_weeks" | "1_month" | "2_months";

export interface ReengagementCampaign {
  id: string;
  trigger: ReengagementTrigger;
  membersInQueue: number;
  messageTemplate: string;
  successRate: number;
  status: "active" | "paused";
}

export interface OnboardingFunnel {
  step: string;
  label: string;
  completionRate: number;
  dropOffRate: number;
  memberCount: number;
}

export type ChallengeStatus = "upcoming" | "active" | "completed";

export interface CommunityChallenge {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: ChallengeStatus;
  participants: number;
  completionRate: number;
  dates: { start: string; end: string };
}

export type ConversionStage = "free" | "paid" | "early_access";

export interface ConversionFunnel {
  stage: ConversionStage;
  label: string;
  count: number;
  conversionRate: number;
}

export interface WeeklyRecommendation {
  recommendation: string;
  multiplierLabel: string;
  rationale: string;
  crossDeptImpact: string[];
}

// ── Affiliate Program Types ──

export type AffiliateStage = "prospect" | "onboarding" | "active" | "dormant" | "churned";

export interface Affiliate {
  id: string;
  name: string;
  company: string;
  avatarInitials: string;
  stage: AffiliateStage;
  joinDate: string;
  totalClicks: number;
  totalSignups: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  channel: string;
  notes: string;
  nextAction: string;
}

export interface AffiliateMetrics {
  totalAffiliates: number;
  activeAffiliates: number;
  totalClicks: number;
  totalSignups: number;
  totalConversions: number;
  totalRevenue: number;
}

export interface LeaderboardEntry {
  affiliateId: string;
  name: string;
  rank: number;
  metric: string;
  value: string;
  reward: string;
  trend: "up" | "down" | "flat";
}

export interface AffiliateOutreach {
  id: string;
  prospectName: string;
  platform: string;
  audience: number;
  relevanceScore: number;
  status: "identified" | "drafted" | "sent" | "responded";
  draftMessage: string;
}

// ── Expert Interviews Types ──

export type ExpertStatus = "potential" | "outreach_sent" | "in_conversation" | "scheduled" | "completed" | "declined";

export interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  expertise: string[];
  audienceSize: number;
  status: ExpertStatus;
  relevanceScore: number;
  dates: { identified: string; lastContact?: string; interviewDate?: string };
  notes: string;
}

export interface OutreachDraft {
  id: string;
  expertId: string;
  expertName: string;
  subject: string;
  body: string;
  personalizedHook: string;
  status: "draft" | "sent" | "replied";
}

export interface InterviewSchedule {
  id: string;
  expertId: string;
  expertName: string;
  date: string;
  time: string;
  platform: string;
  confirmed: boolean;
  prepPacketReady: boolean;
}

export interface PrepPacket {
  id: string;
  expertId: string;
  suggestedTopics: string[];
  keyQuestions: string[];
  backgroundNotes: string;
  contentRepurposingPlan: string[];
}

export interface PostInterviewTask {
  id: string;
  expertId: string;
  task: string;
  type: "thank_you" | "content_repurpose" | "community_post";
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
}

export interface CrossDeptConnection {
  department: string;
  direction: "inbound" | "outbound" | "bidirectional";
  description: string;
  metric: string;
}

// ── Stage Configs ──

export const AFFILIATE_STAGES: { key: AffiliateStage; label: string; color: string }[] = [
  { key: "prospect", label: "Prospect", color: "#9686B9" },
  { key: "onboarding", label: "Onboarding", color: "#356FB6" },
  { key: "active", label: "Active", color: "#1EAA55" },
  { key: "dormant", label: "Dormant", color: "#F1C028" },
  { key: "churned", label: "Churned", color: "#E24D47" },
];

export const EXPERT_STATUS_CONFIG: { key: ExpertStatus; label: string; color: string }[] = [
  { key: "potential", label: "Potential", color: "#ACB7FF" },
  { key: "outreach_sent", label: "Outreach Sent", color: "#9686B9" },
  { key: "in_conversation", label: "In Conversation", color: "#356FB6" },
  { key: "scheduled", label: "Scheduled", color: "#1EAA55" },
  { key: "completed", label: "Completed", color: "#78C3BF" },
  { key: "declined", label: "Declined", color: "#E24D47" },
];

// ── Mock Data ──

export const POSTING_CALENDAR: PostingCalendarEntry[] = [
  { id: "pc-01", dayOfWeek: "monday", platform: "circle", contentType: "Discussion Thread", topic: "Member Spotlight Monday", source: "member_question", status: "scheduled", scheduledTime: "09:00", engagement: 82 },
  { id: "pc-02", dayOfWeek: "monday", platform: "instagram", contentType: "Carousel", topic: "Fertility Fact of the Week", source: "content_engine", status: "scheduled", scheduledTime: "12:00", engagement: 65 },
  { id: "pc-03", dayOfWeek: "tuesday", platform: "circle", contentType: "Audiobook Thread", topic: "Audiobook Discussion Thread", source: "content_engine", status: "posted", scheduledTime: "10:00", engagement: 91 },
  { id: "pc-04", dayOfWeek: "tuesday", platform: "facebook", contentType: "Live Q&A Promo", topic: "Wednesday Live AMA Reminder", source: "ceo_insight", status: "scheduled", scheduledTime: "14:00", engagement: 43 },
  { id: "pc-05", dayOfWeek: "wednesday", platform: "circle", contentType: "Live Event", topic: "CEO Live AMA", source: "ceo_insight", status: "scheduled", scheduledTime: "12:00", engagement: 124 },
  { id: "pc-06", dayOfWeek: "wednesday", platform: "email", contentType: "Newsletter", topic: "Weekly Science Digest", source: "content_engine", status: "draft", scheduledTime: "08:00", engagement: 78 },
  { id: "pc-07", dayOfWeek: "thursday", platform: "circle", contentType: "Q&A Thread", topic: "Weekly Class Q&A", source: "member_question", status: "scheduled", scheduledTime: "10:00", engagement: 96 },
  { id: "pc-08", dayOfWeek: "thursday", platform: "instagram", contentType: "Reel", topic: "Quick Tip: BBT Tracking", source: "trending_topic", status: "draft", scheduledTime: "17:00", engagement: 112 },
  { id: "pc-09", dayOfWeek: "friday", platform: "circle", contentType: "Discussion Thread", topic: "Friday Wins & Celebrations", source: "member_question", status: "scheduled", scheduledTime: "09:00", engagement: 88 },
  { id: "pc-10", dayOfWeek: "friday", platform: "facebook", contentType: "Story", topic: "Weekend Wellness Prep", source: "content_engine", status: "scheduled", scheduledTime: "15:00", engagement: 34 },
  { id: "pc-11", dayOfWeek: "saturday", platform: "circle", contentType: "Resource Post", topic: "Science Saturday: Luteal Phase", source: "content_engine", status: "scheduled", scheduledTime: "10:00", engagement: 56 },
  { id: "pc-12", dayOfWeek: "saturday", platform: "instagram", contentType: "Story", topic: "Community Member Takeover", source: "member_question", status: "draft", scheduledTime: "11:00", engagement: 71 },
  { id: "pc-13", dayOfWeek: "sunday", platform: "circle", contentType: "Reflection Thread", topic: "Sunday Reset & Intentions", source: "ceo_insight", status: "scheduled", scheduledTime: "08:00", engagement: 67 },
  { id: "pc-14", dayOfWeek: "sunday", platform: "email", contentType: "Digest", topic: "Week in Review + What's Coming", source: "content_engine", status: "scheduled", scheduledTime: "18:00", engagement: 84 },
];

export const DISCUSSION_PROMPTS: DiscussionPrompt[] = [
  { id: "dp-01", prompt: "What's one thing you wish you'd known earlier about your fertility journey?", category: "Fertility Journey", estimatedEngagement: 85, status: "posted" },
  { id: "dp-02", prompt: "Share your favorite fertility-friendly recipe that you actually enjoy making.", category: "Lifestyle", estimatedEngagement: 72, status: "scheduled" },
  { id: "dp-03", prompt: "What surprised you most about how stress affects fertility? Drop a study or personal insight.", category: "Science", estimatedEngagement: 68, status: "unused" },
  { id: "dp-04", prompt: "For those who've been on this journey for 6+ months — what keeps you going?", category: "Emotional Support", estimatedEngagement: 94, status: "posted" },
  { id: "dp-05", prompt: "BBT charting: love it or hate it? Share your best tip for making it stick.", category: "Lifestyle", estimatedEngagement: 77, status: "unused" },
  { id: "dp-06", prompt: "What's the most helpful thing a friend or partner has done during your fertility journey?", category: "Emotional Support", estimatedEngagement: 89, status: "scheduled" },
  { id: "dp-07", prompt: "If you could ask a reproductive endocrinologist one question with guaranteed honest answer, what would it be?", category: "Science", estimatedEngagement: 91, status: "unused" },
  { id: "dp-08", prompt: "Name one supplement or lifestyle change that made a noticeable difference for you.", category: "Lifestyle", estimatedEngagement: 83, status: "unused" },
];

export const MEMBER_SPOTLIGHTS: MemberSpotlight[] = [
  {
    id: "ms-01",
    memberName: "Sarah K.",
    avatarInitials: "SK",
    joinDate: "2025-09-15",
    story: "After 18 months of unexplained infertility, Sarah joined the community and started the 12-week protocol. She credits the BBT tracking insights and community support for helping her understand her cycle patterns. Currently 14 weeks pregnant.",
    tags: ["Success Story", "BBT Tracking", "12-Week Protocol"],
    status: "published",
  },
  {
    id: "ms-02",
    memberName: "Lauren M.",
    avatarInitials: "LM",
    joinDate: "2025-11-02",
    story: "Lauren is a registered dietitian who joined to learn more about fertility nutrition. She's become one of our most active members, answering 30+ questions about nutrition and supplements. Her expertise elevates the entire community.",
    tags: ["Power User", "Nutrition Expert", "Peer Mentor"],
    status: "approved",
  },
  {
    id: "ms-03",
    memberName: "Jessica R.",
    avatarInitials: "JR",
    joinDate: "2026-01-10",
    story: "Jessica's been documenting her PCOS management journey openly in the community. Her weekly updates have inspired 12 other PCOS members to start tracking their own biomarkers consistently.",
    tags: ["PCOS Journey", "Biomarker Tracking", "Inspiring Others"],
    status: "contacted",
  },
  {
    id: "ms-04",
    memberName: "Amanda P.",
    avatarInitials: "AP",
    joinDate: "2025-07-22",
    story: "Amanda completed the 7-Day Fertility Reset challenge and saw her luteal phase improve from 9 to 12 days within 3 months. She now mentors new members through the onboarding process.",
    tags: ["Challenge Champion", "Luteal Phase", "Mentor"],
    status: "identified",
  },
];

export const RESPONSE_QUEUE: ResponseQueueItem[] = [
  { id: "rq-01", postTitle: "Is it normal for BBT to fluctuate this much?", platform: "circle", memberName: "MelissaT", excerpt: "My temps have been all over the place this cycle — 97.2 to 98.1 in the same week. Should I be worried?", priority: "agent_handled", flagReason: "Common BBT question — template response available", status: "pending" },
  { id: "rq-02", postTitle: "Podcast mention of Conceivable on Dr. Briden's show", platform: "circle", memberName: "NewMember42", excerpt: "Just heard Kirsten on the Period Repair Podcast and had to join! Can someone point me to the getting started guide?", priority: "ceo_required", flagReason: "CEO personal welcome for podcast-driven signups", status: "pending" },
  { id: "rq-03", postTitle: "Supplement interaction concern", platform: "circle", memberName: "ConcernedJen", excerpt: "I'm taking CoQ10 and my RE just prescribed letrozole. Are there any interactions I should know about?", priority: "ceo_required", flagReason: "Medical interaction question — requires clinical expertise", status: "in_progress" },
  { id: "rq-04", postTitle: "Weekly wins thread — amazing update!", platform: "facebook", memberName: "HopefulHeart", excerpt: "After 3 cycles tracking with Conceivable, my luteal phase went from 8 days to 11! I can't believe it.", priority: "agent_handled", flagReason: "Positive testimonial — flag for Content Engine repurposing", status: "pending" },
  { id: "rq-05", postTitle: "Frustrated with the app sync", platform: "circle", memberName: "TechSavvySara", excerpt: "My Oura Ring data isn't syncing properly with the dashboard. I've tried reconnecting 3 times.", priority: "agent_handled", flagReason: "Technical support — escalate to product team", status: "in_progress" },
  { id: "rq-06", postTitle: "Request: Interview with Dr. Lara Briden", platform: "circle", memberName: "PCOSWarrior", excerpt: "Would LOVE to see Dr. Briden as a guest expert. Her book literally changed my life. Who else would love this?", priority: "ceo_required", flagReason: "Expert interview request — Dr. Briden already in pipeline", status: "pending" },
];

export const CONTENT_SOURCE_METRICS: ContentSourceMetric[] = [
  { source: "content_engine", label: "Content Engine", postsThisWeek: 6, avgEngagement: 74, trend: "up" },
  { source: "ceo_insight", label: "CEO Insights", postsThisWeek: 3, avgEngagement: 112, trend: "up" },
  { source: "member_question", label: "Member Questions", postsThisWeek: 4, avgEngagement: 86, trend: "flat" },
  { source: "trending_topic", label: "Trending Topics", postsThisWeek: 1, avgEngagement: 95, trend: "up" },
];

// ── Growth & Retention Data ──

export const MEMBER_METRICS: MemberMetrics = {
  total: 847,
  active: 523,
  newThisWeek: 34,
  churned: 12,
  activeRate: 61.7,
  npsScore: 72,
};

export const ENGAGEMENT_SCORES: EngagementScore[] = [
  { tier: "power_user", count: 89, percentage: 10.5, description: "Post 3+ times/week, reply to others, attend live events" },
  { tier: "regular", count: 234, percentage: 27.6, description: "Post or reply 1-2 times/week, read daily" },
  { tier: "lurker", count: 188, percentage: 22.2, description: "Read content but rarely engage — potential to activate" },
  { tier: "dormant", count: 336, percentage: 39.7, description: "No activity in 14+ days — re-engagement candidates" },
];

export const REENGAGEMENT_CAMPAIGNS: ReengagementCampaign[] = [
  { id: "rc-01", trigger: "2_weeks", membersInQueue: 48, messageTemplate: "We miss you! Here's what you've missed this week in the community, plus a new challenge starting Monday.", successRate: 34, status: "active" },
  { id: "rc-02", trigger: "1_month", membersInQueue: 72, messageTemplate: "It's been a while! Your fertility journey matters. Come back and share an update — the community is rooting for you.", successRate: 18, status: "active" },
  { id: "rc-03", trigger: "2_months", membersInQueue: 89, messageTemplate: "We haven't forgotten about you. Here's a personalized recap of new resources that match your profile. One member in your cohort just shared amazing results.", successRate: 8, status: "paused" },
];

export const ONBOARDING_FUNNEL: OnboardingFunnel[] = [
  { step: "joined", label: "Joined Circle", completionRate: 100, dropOffRate: 0, memberCount: 847 },
  { step: "profile_complete", label: "Completed Profile", completionRate: 78, dropOffRate: 22, memberCount: 661 },
  { step: "intro_post", label: "Posted Introduction", completionRate: 54, dropOffRate: 24, memberCount: 457 },
  { step: "first_reply", label: "First Reply / Comment", completionRate: 41, dropOffRate: 13, memberCount: 347 },
  { step: "attended_event", label: "Attended Live Event", completionRate: 33, dropOffRate: 8, memberCount: 280 },
  { step: "week_1_active", label: "Active After Week 1", completionRate: 27, dropOffRate: 6, memberCount: 229 },
];

export const COMMUNITY_CHALLENGES: CommunityChallenge[] = [
  {
    id: "cc-01",
    name: "7-Day Fertility Reset",
    description: "A structured week of nutrition, movement, sleep optimization, and stress reduction. Daily prompts and accountability partner matching.",
    duration: "7 days",
    status: "upcoming",
    participants: 0,
    completionRate: 0,
    dates: { start: "2026-03-10", end: "2026-03-16" },
  },
  {
    id: "cc-02",
    name: "30-Day Glucose Challenge",
    description: "Track post-meal glucose responses, share findings, learn how blood sugar affects fertility. Partnered with CGM device company for member discounts.",
    duration: "30 days",
    status: "active",
    participants: 67,
    completionRate: 42,
    dates: { start: "2026-02-15", end: "2026-03-16" },
  },
  {
    id: "cc-03",
    name: "21-Day Mindfulness for Fertility",
    description: "Daily guided meditations, journaling prompts, and stress-reduction techniques specifically designed for the fertility journey.",
    duration: "21 days",
    status: "completed",
    participants: 93,
    completionRate: 61,
    dates: { start: "2026-01-06", end: "2026-01-26" },
  },
];

export const CONVERSION_FUNNEL: ConversionFunnel[] = [
  { stage: "free", label: "Free Members", count: 847, conversionRate: 100 },
  { stage: "paid", label: "Paid Subscribers", count: 312, conversionRate: 36.8 },
  { stage: "early_access", label: "Early Access", count: 89, conversionRate: 28.5 },
];

export const WEEKLY_RECOMMENDATION: WeeklyRecommendation = {
  recommendation: "Launch the 7-Day Fertility Reset challenge — drives 3x engagement, converts lurkers to active, generates success stories for fundraising.",
  multiplierLabel: "10x MOVE",
  rationale: "Community challenges are our highest-leverage engagement tool. The last 21-Day Mindfulness challenge converted 18 lurkers to regular posters and generated 4 testimonials used in pitch materials. The Fertility Reset targets our largest dormant segment (336 members) with a low-commitment entry point that historically has 3x the activation rate of standard re-engagement emails.",
  crossDeptImpact: [
    "Content Engine: 7 days of daily content topics pre-generated, repurposable as blog posts and social",
    "Email Strategy: Challenge launch sequence drives 40%+ open rates vs 28% baseline",
    "Fundraising: Success stories from challenge completers directly fuel investor narrative",
    "Clinical: Challenge data (sleep, nutrition, stress) feeds into protocol optimization research",
  ],
};

// ── Affiliate Program Data ──

export const AFFILIATES: Affiliate[] = [
  { id: "af-01", name: "Dr. Sarah Chen", company: "Fertility Forward Podcast", avatarInitials: "SC", stage: "active", joinDate: "2025-08-10", totalClicks: 4832, totalSignups: 287, totalConversions: 89, totalRevenue: 12460, conversionRate: 31.0, channel: "Podcast", notes: "Top performer. Mentioned Conceivable in 8 episodes. Audience is highly targeted — women 28-38 TTC.", nextAction: "Send Q1 performance report + exclusive discount code for listeners" },
  { id: "af-02", name: "Emma Rodriguez", company: "FertilityPath Blog", avatarInitials: "ER", stage: "active", joinDate: "2025-09-22", totalClicks: 3241, totalSignups: 198, totalConversions: 62, totalRevenue: 8680, conversionRate: 31.3, channel: "Blog", notes: "SEO powerhouse — ranks #1 for 'fertility supplements guide'. Converts at high rate because content is deeply educational.", nextAction: "Co-create a 'Conceivable Review' long-form post" },
  { id: "af-03", name: "Maya Johnson", company: "Wellness Mama Network", avatarInitials: "MJ", stage: "active", joinDate: "2025-10-15", totalClicks: 2876, totalSignups: 156, totalConversions: 41, totalRevenue: 5740, conversionRate: 26.3, channel: "Instagram", notes: "180K followers. Content is wellness-broad but fertility posts get 3x engagement. Excellent story format.", nextAction: "Plan Instagram Live collab for March" },
  { id: "af-04", name: "Dr. James Liu", company: "Modern Fertility Medicine", avatarInitials: "JL", stage: "active", joinDate: "2025-11-05", totalClicks: 1987, totalSignups: 134, totalConversions: 48, totalRevenue: 6720, conversionRate: 35.8, channel: "YouTube", notes: "RE with 95K subscribers. High-credibility channel. His endorsement carries significant clinical weight.", nextAction: "Discuss case study collaboration" },
  { id: "af-05", name: "Rachel Park", company: "TTC Together Community", avatarInitials: "RP", stage: "active", joinDate: "2025-12-01", totalClicks: 1543, totalSignups: 98, totalConversions: 29, totalRevenue: 4060, conversionRate: 29.6, channel: "Facebook Group", notes: "Runs a 45K-member Facebook group for TTC women. Organic mentions drive steady signups.", nextAction: "Offer exclusive community AMA with Kirsten" },
  { id: "af-06", name: "Dr. Anya Patel", company: "Hormone Health Hub", avatarInitials: "AP", stage: "onboarding", joinDate: "2026-02-10", totalClicks: 234, totalSignups: 18, totalConversions: 0, totalRevenue: 0, conversionRate: 0, channel: "Newsletter", notes: "Naturopathic doctor with 28K newsletter subscribers focused on hormonal health. Just joined — setting up tracking links.", nextAction: "Complete onboarding call and send affiliate toolkit" },
  { id: "af-07", name: "Lisa Thompson", company: "Fertility Chef", avatarInitials: "LT", stage: "onboarding", joinDate: "2026-02-18", totalClicks: 67, totalSignups: 5, totalConversions: 0, totalRevenue: 0, conversionRate: 0, channel: "TikTok", notes: "250K TikTok followers. Fertility nutrition content creator. Incredible engagement rate (8.2%). Still setting up.", nextAction: "Send product access for review content" },
  { id: "af-08", name: "Dr. Michael Torres", company: "Repro Health Research", avatarInitials: "MT", stage: "prospect", joinDate: "", totalClicks: 0, totalSignups: 0, totalConversions: 0, totalRevenue: 0, conversionRate: 0, channel: "Academic", notes: "Published 12 papers on lifestyle interventions for fertility. Could provide academic credibility layer.", nextAction: "Draft outreach email highlighting research alignment" },
  { id: "af-09", name: "Sophia Williams", company: "The Fertility Mindset", avatarInitials: "SW", stage: "prospect", joinDate: "", totalClicks: 0, totalSignups: 0, totalConversions: 0, totalRevenue: 0, conversionRate: 0, channel: "Podcast", notes: "Growing podcast (15K downloads/ep). Focus on mental health + fertility. Perfect audience overlap.", nextAction: "Pitch mutual guest appearance swap" },
  { id: "af-10", name: "Natalie Brooks", company: "Cycle Syncing Co", avatarInitials: "NB", stage: "dormant", joinDate: "2025-06-15", totalClicks: 892, totalSignups: 43, totalConversions: 8, totalRevenue: 1120, conversionRate: 18.6, channel: "Blog", notes: "Was active through Q3 2025 but stopped promoting in Q4. Content shifted to broader wellness topics.", nextAction: "Re-engage with new commission tier offer" },
  { id: "af-11", name: "Jennifer Hayes", company: "FemWell App", avatarInitials: "JH", stage: "dormant", joinDate: "2025-07-01", totalClicks: 456, totalSignups: 21, totalConversions: 3, totalRevenue: 420, conversionRate: 14.3, channel: "App Integration", notes: "Period tracking app with 50K users. Integration was discussed but stalled. Partnership could be revived.", nextAction: "Propose API integration demo" },
  { id: "af-12", name: "Dr. Karen Mitchell", company: "Women's Wellness Weekly", avatarInitials: "KM", stage: "churned", joinDate: "2025-05-01", totalClicks: 312, totalSignups: 14, totalConversions: 2, totalRevenue: 280, conversionRate: 14.3, channel: "Newsletter", notes: "Left after 3 months. Said the commission structure wasn't competitive. Worth revisiting with new tiers.", nextAction: "Send updated commission structure" },
];

export const AFFILIATE_METRICS: AffiliateMetrics = {
  totalAffiliates: 12,
  activeAffiliates: 5,
  totalClicks: 16440,
  totalSignups: 974,
  totalConversions: 282,
  totalRevenue: 39480,
};

export const LEADERBOARD: LeaderboardEntry[] = [
  { affiliateId: "af-01", name: "Dr. Sarah Chen", rank: 1, metric: "Revenue", value: "$12,460", reward: "Diamond Tier", trend: "up" },
  { affiliateId: "af-02", name: "Emma Rodriguez", rank: 2, metric: "Revenue", value: "$8,680", reward: "Gold Tier", trend: "up" },
  { affiliateId: "af-04", name: "Dr. James Liu", rank: 3, metric: "Conversion Rate", value: "35.8%", reward: "Gold Tier", trend: "up" },
  { affiliateId: "af-03", name: "Maya Johnson", rank: 4, metric: "Revenue", value: "$5,740", reward: "Silver Tier", trend: "flat" },
  { affiliateId: "af-05", name: "Rachel Park", rank: 5, metric: "Revenue", value: "$4,060", reward: "Silver Tier", trend: "up" },
];

export const AFFILIATE_OUTREACH: AffiliateOutreach[] = [
  { id: "ao-01", prospectName: "The Fertility Dietitian (Stephanie Roth)", platform: "Instagram", audience: 92000, relevanceScore: 9.2, status: "identified", draftMessage: "" },
  { id: "ao-02", prospectName: "Egg Whisperer Show (Dr. Aimee)", platform: "YouTube", audience: 145000, relevanceScore: 9.5, status: "drafted", draftMessage: "Hi Dr. Aimee — I'm Kirsten Karchmer, founder of Conceivable. I've been watching your show and love how you make fertility science accessible. We've built an AI platform that uses BBT analysis to identify fertility optimization opportunities, with a pilot study showing 150-260% improvement in conception rates. Would love to explore a partnership..." },
  { id: "ao-03", prospectName: "Period Party Podcast (Nicole Jardim)", platform: "Podcast", audience: 35000, relevanceScore: 8.8, status: "drafted", draftMessage: "Hi Nicole — Fellow period advocate here! I'm Kirsten Karchmer and I've been in the fertility space for 20+ years. Your episode on cycle syncing was brilliant. We're building something at Conceivable that takes those concepts and adds AI-powered personalization. Our community of 847 women would love you as a guest expert..." },
  { id: "ao-04", prospectName: "PCOS Diva (Amy Medling)", platform: "Blog & Podcast", audience: 210000, relevanceScore: 9.0, status: "identified", draftMessage: "" },
  { id: "ao-05", prospectName: "FertilityIQ (Jake & Deborah Anderson-Bialis)", platform: "Website", audience: 180000, relevanceScore: 8.5, status: "identified", draftMessage: "" },
];

// ── Expert Interviews Data ──

export const EXPERTS: Expert[] = [
  { id: "ex-01", name: "Dr. Lara Briden", title: "Naturopathic Doctor", organization: "Lara Briden Clinic", expertise: ["PCOS", "Period Health", "Natural Hormone Balance"], audienceSize: 320000, status: "in_conversation", relevanceScore: 9.8, dates: { identified: "2025-10-01", lastContact: "2026-02-20" }, notes: "Author of 'Period Repair Manual'. Strong alignment with our approach. She's interested but wants to see more clinical data before committing." },
  { id: "ex-02", name: "Robb Wolf", title: "Research Biochemist & Author", organization: "Independent", expertise: ["Metabolic Health", "Nutrition", "Blood Sugar"], audienceSize: 450000, status: "outreach_sent", relevanceScore: 8.9, dates: { identified: "2025-11-15", lastContact: "2026-02-15" }, notes: "Author of 'Wired to Eat'. His metabolic health framework aligns perfectly with our glucose-fertility connection research. Initial email sent via mutual contact." },
  { id: "ex-03", name: "Dr. Jolene Brighten", title: "Naturopathic Endocrinologist", organization: "Brighten Wellness", expertise: ["Post-Birth Control Syndrome", "Hormones", "Women's Health"], audienceSize: 580000, status: "completed", relevanceScore: 9.5, dates: { identified: "2025-07-01", lastContact: "2026-01-15", interviewDate: "2026-01-10" }, notes: "Incredible interview. Discussed hormonal recovery and how Conceivable's BBT tracking helps women post-pill. Generated 3 clip-worthy segments. Community loved it." },
  { id: "ex-04", name: "Dr. Sara Gottfried", title: "Harvard-Trained MD", organization: "Gottfried Institute", expertise: ["Hormones", "Metabolism", "Longevity"], audienceSize: 420000, status: "potential", relevanceScore: 9.2, dates: { identified: "2026-01-20" }, notes: "Author of 'The Hormone Cure'. Massive audience overlap. Connection possible through shared publisher contact." },
  { id: "ex-05", name: "Dr. Andrew Huberman", title: "Neuroscientist", organization: "Stanford University", expertise: ["Neuroscience", "Fertility Biology", "Behavioral Protocols"], audienceSize: 5200000, status: "potential", relevanceScore: 8.7, dates: { identified: "2026-01-05" }, notes: "Huberman Lab podcast is the gold standard. He covered fertility in Jan 2024. Dream guest but extremely difficult to book. Warm intro possible through Dr. Attia's network." },
  { id: "ex-06", name: "Lily Nichols", title: "Registered Dietitian", organization: "Independent Author", expertise: ["Prenatal Nutrition", "Real Food", "Gestational Diabetes"], audienceSize: 180000, status: "scheduled", relevanceScore: 9.4, dates: { identified: "2025-12-01", lastContact: "2026-02-25", interviewDate: "2026-03-12" }, notes: "Author of 'Real Food for Pregnancy'. She's seen our BBT data and is excited. Interview focus: nutrition interventions that show up in BBT patterns." },
  { id: "ex-07", name: "Dr. Mark Hyman", title: "Functional Medicine MD", organization: "The UltraWellness Center", expertise: ["Functional Medicine", "Nutrition", "Systems Biology"], audienceSize: 3800000, status: "potential", relevanceScore: 8.5, dates: { identified: "2026-02-01" }, notes: "Systems biology approach aligns with our closed-loop philosophy. Has discussed fertility on his podcast. Mutual connection through IFM network." },
  { id: "ex-08", name: "Aviva Romm", title: "MD, Midwife, Herbalist", organization: "Aviva Romm MD", expertise: ["Integrative Medicine", "Women's Health", "Herbal Medicine"], audienceSize: 290000, status: "outreach_sent", relevanceScore: 9.1, dates: { identified: "2025-11-20", lastContact: "2026-02-10" }, notes: "Yale-trained MD who bridges conventional and integrative medicine. Her approach mirrors ours. First outreach email opened but no reply yet." },
  { id: "ex-09", name: "Dr. Rhonda Patrick", title: "Biomedical Scientist", organization: "FoundMyFitness", expertise: ["Nutrition Science", "Genetics", "Biomarkers"], audienceSize: 1200000, status: "potential", relevanceScore: 8.3, dates: { identified: "2026-02-05" }, notes: "Deep science communicator. Would validate our data-driven approach. Could discuss BBT as a biomarker window into overall health." },
  { id: "ex-10", name: "Dr. Cleopatra Kamperveen", title: "Fertility Scientist", organization: "USC", expertise: ["Fertility", "Epigenetics", "Superbaby Research"], audienceSize: 85000, status: "declined", relevanceScore: 9.0, dates: { identified: "2025-09-01", lastContact: "2025-12-15" }, notes: "Declined due to competing partnership. Worth re-approaching in 6 months when her current commitment ends." },
];

export const OUTREACH_DRAFTS: OutreachDraft[] = [
  {
    id: "od-01",
    expertId: "ex-02",
    expertName: "Robb Wolf",
    subject: "Your metabolic health framework + fertility — a conversation worth having",
    body: "Hi Robb,\n\nI'm Kirsten Karchmer, founder of Conceivable. I've spent 20+ years in clinical fertility practice, and your work on metabolic health has deeply influenced how we think about fertility optimization.\n\nWe've built an AI platform that analyzes BBT patterns alongside metabolic markers, and our pilot data (N=105) shows a fascinating connection between glucose regulation and ovulatory function — women who stabilize their post-meal glucose see a 34% improvement in ovulation regularity.\n\nI think your audience would find this intersection compelling. Would you be open to a conversation about how metabolic health and fertility connect? No agenda beyond exploring ideas.\n\nBest,\nKirsten",
    personalizedHook: "Referenced his glucose-focused framework and connected it to our ovulation data",
    status: "sent",
  },
  {
    id: "od-02",
    expertId: "ex-08",
    expertName: "Aviva Romm",
    subject: "Bridging the integrative medicine gap in fertility — with data",
    body: "Dr. Romm,\n\nYour work bridging conventional and integrative medicine is exactly what the fertility space needs more of. I'm Kirsten Karchmer, and I've built Conceivable to do the same thing — but with AI-powered personalization.\n\nOur closed-loop system identifies physiologic drivers of subfertility through BBT analysis, recommends integrative interventions, and measures outcomes. We're seeing 150-260% improvement in conception likelihood (pilot, N=105, 240K data points).\n\nI'd love to have you on our community platform for an expert interview. Your Yale-trained perspective on integrative fertility approaches would resonate deeply with our 847 members.\n\nWould you be open to a 30-minute conversation to explore this?\n\nWarmly,\nKirsten",
    personalizedHook: "Led with her unique Yale + integrative positioning and connected to our data-driven integrative approach",
    status: "draft",
  },
  {
    id: "od-03",
    expertId: "ex-06",
    expertName: "Lily Nichols",
    subject: "RE: Interview prep — nutrition interventions visible in BBT patterns",
    body: "Hi Lily,\n\nSo excited for our March 12 conversation! Here's what I was thinking for focus areas:\n\n1. How specific nutritional changes show up in BBT patterns (we have fascinating before/after data)\n2. The connection between prenatal nutrition quality and cycle regularity\n3. Why 'real food' outperforms supplements in our cohort data\n\nI'll send a full prep packet next week with some anonymized BBT charts showing the nutritional intervention patterns.\n\nLooking forward to it!\nKirsten",
    personalizedHook: "Connected her 'Real Food' philosophy to our quantifiable BBT data outcomes",
    status: "sent",
  },
];

export const INTERVIEW_SCHEDULES: InterviewSchedule[] = [
  { id: "is-01", expertId: "ex-06", expertName: "Lily Nichols", date: "2026-03-12", time: "10:00 AM PST", platform: "Zoom", confirmed: true, prepPacketReady: true },
  { id: "is-02", expertId: "ex-01", expertName: "Dr. Lara Briden", date: "2026-03-25", time: "2:00 PM PST", platform: "Zoom", confirmed: false, prepPacketReady: false },
];

export const PREP_PACKETS: PrepPacket[] = [
  {
    id: "pp-01",
    expertId: "ex-06",
    suggestedTopics: [
      "How prenatal nutrition quality shows up in BBT temperature patterns",
      "The 'real food vs supplements' debate — what does the data actually show?",
      "Gestational diabetes prevention starting before conception",
      "Specific nutrient deficiencies visible in cycle characteristics",
    ],
    keyQuestions: [
      "What's the #1 nutritional change you'd recommend for a woman trying to conceive?",
      "How do you think about food quality vs caloric composition for fertility?",
      "Our data shows women who eat 30+ plant varieties per week have 23% better luteal phase quality — does this surprise you?",
      "What's your take on the intersection of glucose management and fertility?",
      "If a woman could only change one meal, which would have the biggest impact on her cycle?",
    ],
    backgroundNotes: "Lily Nichols, RDN, is the author of 'Real Food for Pregnancy' and 'Real Food for Gestational Diabetes'. She's a vocal advocate for evidence-based prenatal nutrition that prioritizes whole foods over supplements. Her audience skews 25-40, college-educated, health-conscious women — significant overlap with Conceivable's target demographic.",
    contentRepurposingPlan: [
      "Full interview → Circle community post (members-only)",
      "3-5 short clips → Instagram Reels + TikTok",
      "Key insights → Email newsletter feature",
      "Q&A highlights → Blog post '5 Nutrition Changes That Show Up in Your BBT'",
      "Pull quotes → Social media graphics",
    ],
  },
];

export const POST_INTERVIEW_TASKS: PostInterviewTask[] = [
  { id: "pit-01", expertId: "ex-03", task: "Send personalized thank you + gift package", type: "thank_you", status: "completed", dueDate: "2026-01-12" },
  { id: "pit-02", expertId: "ex-03", task: "Edit interview into 3 short clips for Instagram", type: "content_repurpose", status: "in_progress", dueDate: "2026-02-01" },
  { id: "pit-03", expertId: "ex-03", task: "Create community discussion post with interview highlights", type: "community_post", status: "pending", dueDate: "2026-02-15" },
  { id: "pit-04", expertId: "ex-03", task: "Write blog post: 'Dr. Brighten on Post-Pill Hormone Recovery'", type: "content_repurpose", status: "pending", dueDate: "2026-03-01" },
];

export const CROSS_DEPT_CONNECTIONS: CrossDeptConnection[] = [
  { department: "Content Engine", direction: "bidirectional", description: "Community discussions surface content topics; Content Engine provides posting calendar assets", metric: "6 community-sourced blog posts this month" },
  { department: "Email Strategy", direction: "outbound", description: "Email campaigns drive community signups; community engagement data informs segmentation", metric: "34 new members from email this week" },
  { department: "Fundraising", direction: "outbound", description: "Community growth metrics and engagement data feed into investor narrative; member success stories become pitch material", metric: "4 testimonials used in pitch deck" },
];
