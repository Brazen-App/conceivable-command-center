// Fundraising — The Growth Engine
// Preparing for $150K bridge and $5M Series A

// ============================================================
// TYPES
// ============================================================

export type InvestorTier = "movement" | "venture" | "strategic";
export type InvestorType = "angel" | "seed" | "series_a" | "strategic";
export type PipelineStage =
  | "prospect"
  | "contacted"
  | "meeting_scheduled"
  | "meeting_complete"
  | "due_diligence"
  | "term_sheet"
  | "closed"
  | "passed";
export type MaterialStatus = "ready" | "in_progress" | "not_started";

export interface Investor {
  id: string;
  name: string;
  firm?: string;
  tier: InvestorTier;
  type: InvestorType;
  stage: PipelineStage;
  lastContactDate?: string;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  checkSize?: string;
  thesisAlignment?: string;
  // Movement Board fields
  recentActivity?: string;
  foundationPriorities?: string[];
  warmConnectionPath?: string;
  eventsAttended?: string[];
  publicStatements?: string;
  // Venture fields
  portfolio?: string[];
  partnerName?: string;
  // Strategic fields
  partnershipType?: string;
  strategicValue?: string;
}

export interface MeetingNote {
  id: string;
  investorId: string;
  date: string;
  attendees: string;
  summary: string;
  keyTakeaways: string[];
  followUps: FollowUpTask[];
}

export interface FollowUpTask {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "done";
}

export interface PitchMaterial {
  id: string;
  title: string;
  category: "pitch" | "financial" | "product" | "team" | "ip" | "market" | "clinical" | "press" | "dataroom";
  status: MaterialStatus;
  link?: string;
  version?: string;
  lastUpdated?: string;
  crossDeptConnection?: string;
  notes?: string;
}

export interface FundraiseMetric {
  id: string;
  label: string;
  value: string;
  source: string;
  trend?: "up" | "down" | "flat";
  context?: string;
}

export interface WeeklyRecommendation {
  recommendation: string;
  multiplierLabel: string;
  rationale: string;
  crossDeptImpact: string[];
}

// ============================================================
// PIPELINE STAGE CONFIG
// ============================================================

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "prospect", label: "Prospect", color: "#9686B9" },
  { key: "contacted", label: "Contacted", color: "#78C3BF" },
  { key: "meeting_scheduled", label: "Meeting Scheduled", color: "#5A6FFF" },
  { key: "meeting_complete", label: "Meeting Complete", color: "#356FB6" },
  { key: "due_diligence", label: "Due Diligence", color: "#F1C028" },
  { key: "term_sheet", label: "Term Sheet", color: "#E37FB1" },
  { key: "closed", label: "Closed", color: "#1EAA55" },
  { key: "passed", label: "Passed", color: "#E24D47" },
];

// ============================================================
// TIER 1 — MOVEMENT BOARD
// Strategic capital from people who can 10x the mission
// ============================================================

export const MOVEMENT_BOARD_INVESTORS: Investor[] = [
  {
    id: "inv-m01",
    name: "MacKenzie Scott",
    firm: "Yield Giving",
    tier: "movement",
    type: "angel",
    stage: "prospect",
    checkSize: "$10M–$250M (typical gifts)",
    thesisAlignment: "Women's health, reproductive justice, underserved populations. Scott's giving focuses on organizations with high potential for impact at scale — Conceivable's generational health thesis is a direct fit.",
    recentActivity: "2024: $640M to 361 organizations. Significant gifts to Planned Parenthood, reproductive health orgs, and women-led health startups. Emphasis on organizations 'driving change' in underserved communities.",
    foundationPriorities: ["Women's health equity", "Reproductive justice", "Evidence-based interventions", "Underserved populations"],
    warmConnectionPath: "2 degrees: Kirsten → [Podcast guest network] → Organizations in Scott's portfolio. Identify recent Yield Giving recipients in women's health/wellness space and connect through them.",
    eventsAttended: ["Not public-facing — works through direct outreach and referrals"],
    publicStatements: "'I want to de-stigmatize wealth and use it to support people and organizations doing transformative work.' Focus on scale and systems change.",
    nextAction: "Research Scott's 2024-2025 giving portfolio for women's health orgs. Identify warm intro through shared network.",
    notes: "10x PLAY: Scott's support would be both capital AND signal. A gift from Yield Giving would make Conceivable a household name in women's health overnight.",
  },
  {
    id: "inv-m02",
    name: "Serena Williams",
    firm: "Serena Ventures",
    tier: "movement",
    type: "series_a",
    stage: "prospect",
    checkSize: "$250K–$5M (pre-seed to Series A)",
    thesisAlignment: "Women's health, consumer health tech, founders building for underserved markets. Williams has spoken publicly about her own pregnancy complications (emergency C-section, pulmonary embolism) — Conceivable's pregnancy risk prediction patent is directly relevant.",
    recentActivity: "2024: Led or participated in 15+ deals. Portfolio includes Noom, Masterclass, Impossible Foods. Increasing focus on health tech and women's health specifically.",
    foundationPriorities: ["Women-led companies", "Consumer health", "Diversity in venture", "Personal health advocacy"],
    warmConnectionPath: "1-2 degrees: Kirsten → Podcast network (wellness/health space) → Serena Ventures team. Alternatively: Apply directly through Serena Ventures website with strong personal story angle.",
    eventsAttended: ["Fortune Most Powerful Women", "Vanity Fair New Establishment", "TechCrunch Disrupt"],
    publicStatements: "'I almost died after giving birth to my daughter. My concerns were dismissed by medical staff. Women deserve better.' — Directly validates Conceivable's mission.",
    nextAction: "Draft personalized outreach connecting Serena's birth story to Conceivable's pregnancy prediction patent. Route through Serena Ventures deal flow.",
    notes: "PERFECT ALIGNMENT: Her personal experience IS our product use case. Her investment would be the most authentic signal possible.",
  },
  {
    id: "inv-m03",
    name: "Alice Walton",
    firm: "Alice L. Walton Foundation / Heartland Whole Health Institute",
    tier: "movement",
    type: "angel",
    stage: "prospect",
    checkSize: "$5M–$50M (foundation grants + personal investments)",
    thesisAlignment: "Integrative medicine, whole-person health, preventive care. Walton founded Heartland Whole Health Institute to advance 'whole health' — the exact framework Conceivable uses. Our 7-driver approach maps directly to her thesis.",
    recentActivity: "2024: Heartland Whole Health Institute expanding. Investing in integrative medicine education, whole-person health infrastructure. Personal investments in health innovation.",
    foundationPriorities: ["Integrative medicine", "Whole-person health", "Preventive care systems", "Health equity in underserved areas"],
    warmConnectionPath: "2 degrees: Kirsten → Functional/integrative medicine community → Heartland Whole Health Institute advisors. The integrative health world is small — Kirsten's clinical background gives direct access.",
    eventsAttended: ["Integrative Medicine for the Underserved", "Whole Health Institute events in Bentonville, AR"],
    publicStatements: "'We need to move from sick care to whole health. The current system treats symptoms. We need to treat the whole person.' — This IS Conceivable's thesis.",
    nextAction: "Connect through integrative medicine network. Kirsten's functional medicine background is a direct bridge.",
    notes: "STRATEGIC FIT: Walton's whole-health thesis perfectly overlaps with Conceivable's driver-based approach. Not just money — infrastructure and credibility in the integrative medicine space.",
  },
  {
    id: "inv-m04",
    name: "Melinda French Gates",
    firm: "Pivotal Ventures",
    tier: "movement",
    type: "series_a",
    stage: "prospect",
    checkSize: "$1M–$50M (Pivotal Ventures investments)",
    thesisAlignment: "Women's health innovation, health equity, data-driven approaches to health. Pivotal Ventures specifically invests in 'accelerating social progress for women and families' — Conceivable is directly in the strike zone.",
    recentActivity: "2024-2025: Pivotal Ventures expanding health portfolio. $1B pledge to gender equality. Investments in maternal health, reproductive health technology, and women's health data platforms.",
    foundationPriorities: ["Gender equality", "Women's health innovation", "Maternal health", "Health technology for underserved women"],
    warmConnectionPath: "2-3 degrees: Kirsten → Women's health conference speakers → Pivotal Ventures portfolio founders → Investment team. Also: Pivotal has an open application process for certain programs.",
    eventsAttended: ["Clinton Global Initiative", "Women Deliver", "Grand Challenges"],
    publicStatements: "'Women's health has been dramatically underresearched and underfunded. We need to change that.' — Direct validation of the Conceivable mission.",
    nextAction: "Map Pivotal Ventures portfolio companies for warm intros. Research open application windows.",
    notes: "TIER 1 TARGET: Pivotal's focus on women's health + technology + data is exactly Conceivable. The generational health narrative is especially powerful here.",
  },
  {
    id: "inv-m05",
    name: "Michelle Obama",
    firm: "Personal investments / Reach Higher Initiative",
    tier: "movement",
    type: "angel",
    stage: "prospect",
    checkSize: "$500K–$5M (personal investments)",
    thesisAlignment: "Women's health, maternal health advocacy, health equity. Obama's post-White House work has increasingly focused on women's health, including public discussion of her miscarriage and IVF experience.",
    recentActivity: "2024-2025: 'The Light We Carry' book tour + speaking engagements. Increasing health advocacy. Personal investments in health and wellness startups (undisclosed portfolio).",
    foundationPriorities: ["Girls' education & health", "Maternal health", "Women's empowerment", "Health equity"],
    warmConnectionPath: "3 degrees: Kirsten → Health/wellness podcast network → Michelle Obama's team/agents. Alternatively: Speaking event + personal connection through shared fertility journey story.",
    eventsAttended: ["When We All Vote events", "Girls Opportunity Alliance"],
    publicStatements: "'I felt lost and alone during my miscarriage. I felt like I had failed.' — Publicly shared IVF journey. Conceivable's mission directly addresses this experience.",
    nextAction: "Long-term cultivation. Build relationship through shared advocacy spaces. Consider inviting to advisory role first.",
    notes: "ASPIRATIONAL BUT STRATEGIC: Obama's personal fertility story + platform reach = massive amplification. Even an advisory relationship (not financial) would be transformative.",
  },
];

// ============================================================
// TIER 2 — VENTURE CAPITAL
// ============================================================

export const VENTURE_INVESTORS: Investor[] = [
  {
    id: "inv-v01",
    name: "Kirsten Green",
    firm: "Forerunner Ventures",
    tier: "venture",
    type: "series_a",
    stage: "prospect",
    checkSize: "$5M–$15M Series A",
    thesisAlignment: "Consumer health, DTC brands with strong community. Forerunner invested in Hims/Hers, Dollar Shave Club, Glossier — consumer health brands that transform categories.",
    portfolio: ["Hims & Hers Health", "Dollar Shave Club", "Glossier", "Ritual"],
    partnerName: "Kirsten Green (Founder & Managing Partner)",
    nextAction: "Research latest Forerunner thesis and portfolio additions in health tech",
    notes: "Strong consumer health thesis. Portfolio shows pattern of investing in category-defining DTC health brands.",
  },
  {
    id: "inv-v02",
    name: "Julie Yoo",
    firm: "Andreessen Horowitz (a16z Bio + Health)",
    tier: "venture",
    type: "series_a",
    stage: "prospect",
    checkSize: "$10M–$30M Series A",
    thesisAlignment: "Health tech platform plays, AI-native health companies, closed-loop systems. a16z Bio invests in 'engineering biology' and health tech platforms. Julie Yoo specifically focuses on health tech infrastructure.",
    portfolio: ["Devoted Health", "Omada Health", "Cedar", "Aledade"],
    partnerName: "Julie Yoo (General Partner, Bio + Health)",
    nextAction: "Map a16z Bio portfolio for adjacencies and warm intros. Research Julie Yoo's published thesis on AI health.",
    notes: "TOP TARGET for tech investor angle. a16z brand + Julie Yoo's health tech expertise = perfect fit for the AI architecture story.",
  },
  {
    id: "inv-v03",
    name: "Jillian Manus",
    firm: "Structure Capital",
    tier: "venture",
    type: "series_a",
    stage: "contacted",
    lastContactDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    checkSize: "$2M–$8M Series A",
    thesisAlignment: "Women's health, FemTech, AI/ML applications. Structure Capital has explicit FemTech thesis. Manus is vocal about the women's health funding gap.",
    portfolio: ["Maven Clinic", "Tia Health", "Gennev"],
    partnerName: "Jillian Manus (Managing Partner)",
    nextAction: "Follow up on initial outreach. Send updated pitch deck with CON Score data.",
    nextActionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "WARM LEAD: Initial email received positive response. Interested in the AI/data moat angle. Schedule intro call.",
  },
  {
    id: "inv-v04",
    name: "Nan Li",
    firm: "Obvious Ventures",
    tier: "venture",
    type: "series_a",
    stage: "prospect",
    checkSize: "$3M–$10M Series A",
    thesisAlignment: "World-positive companies, health innovation. Obvious invests in companies that combine profit with purpose. Conceivable's generational health thesis fits perfectly.",
    portfolio: ["Beyond Meat", "Evolve Biosystems", "Diamond Foundry"],
    partnerName: "Nan Li (Managing Partner)",
    nextAction: "Research Obvious Ventures' current health portfolio and investment criteria",
    notes: "Impact + returns thesis aligns well. The 'generational health' angle is especially powerful for Obvious.",
  },
  {
    id: "inv-v05",
    name: "Megan Maloney",
    firm: "7wireVentures",
    tier: "venture",
    type: "series_a",
    stage: "prospect",
    checkSize: "$5M–$15M Series A",
    thesisAlignment: "Digital health, consumer engagement in healthcare, AI-driven health platforms. 7wire focuses exclusively on health tech — deep domain expertise.",
    portfolio: ["Hinge Health", "Virta Health", "Ginger", "Livongo"],
    partnerName: "Megan Maloney (Principal)",
    nextAction: "Apply through 7wire deal flow. Strong clinical evidence angle.",
    notes: "Health-tech-only fund. Their portfolio shows a pattern: consumer health platforms with strong clinical evidence and AI backbone.",
  },
];

// ============================================================
// TIER 3 — STRATEGIC PARTNERS
// ============================================================

export const STRATEGIC_PARTNERS: Investor[] = [
  {
    id: "inv-s01",
    name: "Oura Health",
    tier: "strategic",
    type: "strategic",
    stage: "contacted",
    lastContactDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    partnershipType: "Data integration + co-marketing",
    strategicValue: "Ring data feeds directly into CON Score. Oura has 2M+ users in our target demographic. Integration = instant distribution channel + data moat.",
    nextAction: "Propose formal data partnership. Share CON Score integration architecture.",
    nextActionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "CRITICAL PARTNERSHIP: Oura Ring is the primary wearable for our data pipeline. Their female health features are basic — we make their data 10x more valuable. Win-win.",
  },
  {
    id: "inv-s02",
    name: "Apple Health",
    tier: "strategic",
    type: "strategic",
    stage: "prospect",
    partnershipType: "HealthKit integration + App Store feature",
    strategicValue: "Apple Watch temperature data + HealthKit integration gives us access to 100M+ users. App Store feature for women's health would be a massive distribution event.",
    nextAction: "Build HealthKit integration demo. Apply for Apple Health partnership program.",
    notes: "LONG-TERM PLAY: Apple is investing heavily in women's health features. We're building what they need but can't build in-house (clinical depth + intervention engine).",
  },
  {
    id: "inv-s03",
    name: "Cleveland Clinic",
    tier: "strategic",
    type: "strategic",
    stage: "prospect",
    partnershipType: "Clinical validation + referral partnership",
    strategicValue: "Clinical validation from a top-3 health system would be the strongest social proof possible. Also: referral channel from their fertility clinic (one of the largest in the US).",
    nextAction: "Research Cleveland Clinic innovation partnerships. Map connections through medical advisory network.",
    notes: "CREDIBILITY PLAY: Clinical validation from Cleveland Clinic would upgrade every investor conversation. Their reproductive medicine department is world-class.",
  },
  {
    id: "inv-s04",
    name: "Mayo Clinic Platform",
    tier: "strategic",
    type: "strategic",
    stage: "prospect",
    partnershipType: "Clinical integration + research collaboration",
    strategicValue: "Mayo Clinic Platform is actively partnering with digital health companies. Research collaboration would generate peer-reviewed evidence. Brand association is unmatched in healthcare.",
    nextAction: "Apply to Mayo Clinic Platform partnership program. Prepare clinical evidence package.",
    notes: "EVIDENCE PLAY: A Mayo Clinic research collaboration would generate the clinical evidence needed for stronger claims and stronger investor pitch.",
  },
];

// ============================================================
// PITCH MATERIALS
// ============================================================

export const PITCH_MATERIALS: PitchMaterial[] = [
  {
    id: "mat-01",
    title: "Pitch Deck (Master Version)",
    category: "pitch",
    status: "in_progress",
    version: "v2.3",
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Core narrative + AI architecture slides updated. Need to add latest email list growth data and patent filing status.",
  },
  {
    id: "mat-02",
    title: "Executive Summary / One-Pager",
    category: "pitch",
    status: "in_progress",
    version: "v1.1",
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Draft complete. Needs CEO review and updated metrics.",
  },
  {
    id: "mat-03",
    title: "Financial Model",
    category: "financial",
    status: "not_started",
    crossDeptConnection: "Finance: Link to COO's financial model when connected",
    notes: "Waiting for Finance department integration. Need 3-year projections, unit economics, and burn rate scenarios.",
  },
  {
    id: "mat-04",
    title: "Product Demo / Walkthrough",
    category: "product",
    status: "in_progress",
    notes: "Recording app walkthrough with CON Score flow. Need to add Kai AI coach demo and wearable integration demo.",
  },
  {
    id: "mat-05",
    title: "Team Bios & Org Chart",
    category: "team",
    status: "ready",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Complete with CEO bio, advisory board, and AI-augmented team structure showing how <10 people operate at 50+ person capacity.",
  },
  {
    id: "mat-06",
    title: "IP Portfolio Summary",
    category: "ip",
    status: "in_progress",
    crossDeptConnection: "Legal: 1 granted patent, 1 pending, 3 provisional filings planned. Closed-Loop System patent must file before fundraise.",
    notes: "Summary drafted. Needs update after Closed-Loop System provisional filing. Critical: this is the #1 moat slide in the deck.",
  },
  {
    id: "mat-07",
    title: "Market Analysis",
    category: "market",
    status: "in_progress",
    version: "v1.0",
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "FemTech market sizing complete ($50B by 2030). Need competitive landscape update and TAM/SAM/SOM breakdown for pregnancy monitoring expansion.",
  },
  {
    id: "mat-08",
    title: "Verified Customer Outcomes",
    category: "clinical",
    status: "in_progress",
    crossDeptConnection: "Legal: Pilot study data (N=105, 150-260% improvement, 240K data points). All claims must be FTC-compliant.",
    notes: "Pilot study summary ready. Need Legal sign-off on how to present outcomes in investor materials without making prohibited health claims.",
  },
  {
    id: "mat-09",
    title: "Press Coverage Compilation",
    category: "press",
    status: "not_started",
    notes: "Need to compile: 120 podcast appearances, media mentions, expert quotes. This is a strong asset — CEO's media presence is exceptional.",
  },
  {
    id: "mat-10",
    title: "Data Room (Organized)",
    category: "dataroom",
    status: "not_started",
    notes: "Set up secure data room (DocSend or Google Drive). Organize: corporate docs, financials, IP, clinical data, team, market research. Gate access by stage.",
  },
];

// ============================================================
// MEETING NOTES
// ============================================================

export const MEETING_NOTES: MeetingNote[] = [
  {
    id: "note-01",
    investorId: "inv-v03",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    attendees: "Kirsten Karchmer, Jillian Manus (Structure Capital)",
    summary: "Initial intro call. Jillian very interested in the AI/data moat and the closed-loop intervention system. Asked detailed questions about prior art and defensibility of the IP portfolio. Wants to see updated deck with CON Score data and patent status.",
    keyTakeaways: [
      "Strong interest in the technical moat — lead with AI architecture in follow-up",
      "Wants to understand the clinical evidence better — send pilot study summary",
      "Asked about competitive landscape, especially vs. Natural Cycles and Oura's fertility features",
      "Mentioned portfolio company Maven Clinic as potential synergy partner",
    ],
    followUps: [
      {
        id: "fu-01",
        task: "Send updated pitch deck with CON Score data",
        assignee: "Kirsten",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
      },
      {
        id: "fu-02",
        task: "Prepare competitive analysis one-pager (us vs. Natural Cycles, Oura, Clue)",
        assignee: "Agent",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
      },
      {
        id: "fu-03",
        task: "Schedule follow-up call for deep-dive on IP portfolio",
        assignee: "Kirsten",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
      },
    ],
  },
];

// ============================================================
// CROSS-DEPARTMENT FUNDRAISE METRICS
// ============================================================

export const FUNDRAISE_METRICS: FundraiseMetric[] = [
  {
    id: "fm-01",
    label: "Email List Size",
    value: "2,847",
    source: "Email Strategy",
    trend: "up",
    context: "Growing ~120/week. Target: 5,000 before launch.",
  },
  {
    id: "fm-02",
    label: "Early Access Signups",
    value: "1,203",
    source: "Operations",
    trend: "up",
    context: "24% of email list converted. Target: 5,000 total.",
  },
  {
    id: "fm-03",
    label: "Content Reach (Monthly)",
    value: "142K",
    source: "Content Engine",
    trend: "up",
    context: "Cross-platform impressions. 120 podcast appearances driving organic growth.",
  },
  {
    id: "fm-04",
    label: "Patent Portfolio",
    value: "2 protected, 3 filing",
    source: "Legal",
    trend: "up",
    context: "1 granted (BBT), 1 pending (CON Score), 3 provisionals planned. Closed-Loop System is CRITICAL — must file before fundraise.",
  },
  {
    id: "fm-05",
    label: "Pilot Study Outcomes",
    value: "150-260% improvement",
    source: "Clinical",
    trend: "flat",
    context: "N=105, 240,000+ data points. Prospective cohort, 6-month duration. Strongest clinical evidence in FemTech category.",
  },
  {
    id: "fm-06",
    label: "Runway",
    value: "~4 months",
    source: "Finance",
    trend: "down",
    context: "Bridge round of $150K extends to 10 months. Series A of $5M funds 24+ months of operations.",
  },
  {
    id: "fm-07",
    label: "Podcast Appearances",
    value: "120+",
    source: "Content Engine",
    trend: "up",
    context: "In 4 months. CEO unique ability in action. Each appearance = ~200 email signups on average.",
  },
  {
    id: "fm-08",
    label: "AI Training Data",
    value: "500K+ BBT charts",
    source: "Product",
    trend: "flat",
    context: "From 7,000+ patients across 20 years of clinical practice. This dataset is irreplaceable — massive competitive moat.",
  },
];

// ============================================================
// WEEKLY AGENT RECOMMENDATION
// ============================================================

export const WEEKLY_RECOMMENDATION: WeeklyRecommendation = {
  recommendation: "File the Closed-Loop System provisional patent THIS WEEK, then immediately schedule 3 investor intro calls with the updated IP story.",
  multiplierLabel: "10x MOVE",
  rationale: "The patent filing is the single action that unlocks everything else. Without it: investor conversations lack the moat story, the pitch deck has a gap, and due diligence will stall. With it: every investor conversation leads with 'we just filed our deepest technical moat.' The filing itself costs ~$1,500 and 2 days of work, but it 10x-es the credibility of every fundraising interaction for the next 12 months.",
  crossDeptImpact: [
    "Legal: Closed-Loop System patent filing removes the #1 risk flag for investors",
    "Content: 'We just filed a patent on our core technology' becomes a powerful content narrative",
    "Operations: Patent filed = green light to accelerate fundraise timeline",
    "Email: Can reference patent-protected technology in launch emails (authority building)",
  ],
};

// ============================================================
// NARRATIVE
// ============================================================

export const FUNDRAISE_NARRATIVE = `We can change the health trajectory of an entire generation — not just the women who use our product, but their children. A mother who repairs her metabolic health before conception raises a fundamentally healthier child. Multiply by millions and this is a public health intervention that starts before birth.

Conceivable isn't a fertility tracker. It's a closed-loop health correction system powered by AI trained on 500,000+ clinical charts from 20 years of practice. We don't just tell women something is wrong — we identify the specific driver, recommend the precise intervention, measure whether it worked, and escalate if it didn't.

No one else does this. The trackers track. The clinics treat symptoms. We fix root causes, and we have the data to prove it: 150-260% improvement in conception likelihood in our pilot study of 105 women.

The $50B FemTech market is waiting for a company that treats women's health with the same technical sophistication as every other category. That company is Conceivable.`;

// ============================================================
// INVESTOR STORY ANGLES
// ============================================================

export const STORY_ANGLES: { investorFocus: string; angle: string; openingLine: string }[] = [
  {
    investorFocus: "Women's Health / Impact",
    angle: "Lead with the generational health thesis and clinical outcomes",
    openingLine: "Every child's health trajectory begins before conception. We're building the system that ensures mothers are optimally healthy before pregnancy — and we have the clinical data to prove it works.",
  },
  {
    investorFocus: "AI / Technology",
    angle: "Lead with the AI architecture, closed-loop system, and data moat",
    openingLine: "We've built an AI system trained on 500,000+ clinical charts that doesn't just predict fertility — it identifies the root cause of impairment, recommends interventions, measures response, and adapts in real-time. It's a closed-loop physiologic correction engine, and we're patenting it.",
  },
  {
    investorFocus: "Consumer / DTC",
    angle: "Lead with the market size, community growth, and founder-market fit",
    openingLine: "The founder did 120 podcast appearances in 4 months and built a 3,000-person email list from zero. FemTech is a $50B market with no clear winner in fertility optimization. We're building the category-defining platform.",
  },
  {
    investorFocus: "Healthcare / Clinical",
    angle: "Lead with clinical evidence, IP portfolio, and health system partnership potential",
    openingLine: "Our pilot study of 105 women showed 150-260% improvement in conception likelihood — the strongest clinical evidence in the FemTech category. We have 2 patents (1 granted, 1 pending) with 3 more provisionals in the pipeline.",
  },
];
