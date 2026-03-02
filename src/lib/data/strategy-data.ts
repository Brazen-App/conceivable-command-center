// ────────────────────────────────────────────────────────────
// Strategy / Coaching Department — Data & Types
// The Brain — Bill Campbell + Dan Sullivan Framework
// ────────────────────────────────────────────────────────────

// ── CEO Weekly Brief Types ──

export interface WeeklyGain {
  id: string;
  title: string;
  evidence: string;
  department: string;
  multiplierLabel: "2x" | "10x";
}

export interface WatchListItem {
  id: string;
  title: string;
  evidence: string;
  department: string;
  severity: "yellow" | "red";
  suggestedAction: string;
}

export interface MultiplierOpportunity {
  id: string;
  action: string;
  departments: string[];
  impact: string;
  multiplierLabel: "2x" | "10x";
}

export interface UniqueAbilityFlag {
  id: string;
  task: string;
  currentOwner: "ceo";
  suggestedOwner: string;
  reasoning: string;
  hoursPerWeek: number;
}

export interface StrategicQuestion {
  id: string;
  question: string;
  context: string;
  framework: "sullivan" | "campbell" | "both";
}

export interface DepartmentPulse {
  department: string;
  status: "green" | "yellow" | "red";
  headline: string;
  keyMetric: string;
}

export interface WeeklyBrief {
  id: string;
  weekOf: string;
  generatedAt: string;
  greeting: string;
  gains: WeeklyGain[];
  watchList: WatchListItem[];
  uncomfortableTruth: {
    title: string;
    body: string;
    sullivanLens: string;
    campbellLens: string;
  };
  tenXFocus: {
    focus: string;
    rationale: string;
    whatToSayNoTo: string[];
  };
  multiplierOpportunities: MultiplierOpportunity[];
  uniqueAbilityFlags: UniqueAbilityFlag[];
  strategicQuestions: StrategicQuestion[];
  departmentPulses: DepartmentPulse[];
  closing: string;
}

// ── Decision Framework Types ──

export type DecisionStatus = "active" | "decided" | "archived";

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  tradeoffs: { pro: string; con: string }[];
  multiplierLabel: "2x" | "10x";
  sullivanLens: string;
  campbellLens: string;
  deptImpact: { department: string; impact: string; sentiment: "positive" | "negative" | "neutral" }[];
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  status: DecisionStatus;
  dateCreated: string;
  dateDecided?: string;
  options: DecisionOption[];
  recommendation?: {
    optionId: string;
    reasoning: string;
  };
  outcome?: {
    chosenOptionId: string;
    result: string;
    lessonsLearned: string;
    dateReviewed: string;
  };
}

// ── Ideas Parking Lot Types ──

export type IdeaImpact = "2x" | "10x";
export type IdeaUrgency = "now" | "this_quarter" | "backlog";
export type IdeaStatus = "new" | "pursue" | "schedule" | "delegate" | "drop" | "done";

export interface Idea {
  id: string;
  text: string;
  department: string;
  impact: IdeaImpact;
  urgency: IdeaUrgency;
  status: IdeaStatus;
  agentReview?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Cross-Department Connection ──

export interface StrategyConnection {
  department: string;
  status: "green" | "yellow" | "red";
  lastBriefDate: string;
  keyInsight: string;
}

// ── Mock Data ──

export const CURRENT_BRIEF: WeeklyBrief = {
  id: "wb-2026-w09",
  weekOf: "2026-02-23",
  generatedAt: "2026-02-23T07:00:00Z",
  greeting: "Kirsten, here's your honest look at the week. I'm leading with the gains because you've earned them — but the watch list and the truth at the bottom need your attention before you do anything else today.",

  gains: [
    {
      id: "g-01",
      title: "Community hit 847 members with 62% active rate",
      evidence: "34 new members this week, NPS score of 72. The 30-Day Glucose Challenge has 67 participants and is generating exactly the kind of engagement data that feeds your clinical narrative. This is organic growth — no paid acquisition.",
      department: "Community",
      multiplierLabel: "10x",
    },
    {
      id: "g-02",
      title: "Patent portfolio is stronger than 95% of pre-seed companies",
      evidence: "1 granted patent (BBT interpretation), 1 pending (CON Score), 3 provisionals mapped. Your IP attorney confirmed the closed-loop system provisional is the strongest filing they've seen from a company at your stage. This is your deepest moat.",
      department: "Legal / IP",
      multiplierLabel: "10x",
    },
    {
      id: "g-03",
      title: "Content Engine producing 14 pieces/week across 4 platforms",
      evidence: "CEO insights drive 112 avg engagement vs 74 for Content Engine-sourced posts. Your podcast appearances (120 in 4 months) are the gift that keeps giving — each one generates 3-5 repurposable content pieces. Community member spotlights are becoming a self-sustaining content loop.",
      department: "Content Engine",
      multiplierLabel: "2x",
    },
  ],

  watchList: [
    {
      id: "w-01",
      title: "Zero of 5,000 early access signups with 7 weeks to launch",
      evidence: "The email list is 29K strong, but we haven't turned on the conversion funnel yet. The 23-email launch sequence exists but hasn't been sent. Every week of delay is a week where your warmest leads cool off. The gap between 'list size' and 'signups' is the gap between potential energy and kinetic energy.",
      department: "Email Strategy",
      severity: "red",
      suggestedAction: "Start sending the email sequence this week. Not next week. This week. The emails are written. The compliance review is done. The only blocker is pressing 'send'.",
    },
    {
      id: "w-02",
      title: "Closed-loop patent provisional filing is overdue",
      evidence: "This was flagged as 'file before fundraise' in the architecture doc. The fundraise is being prepared now, which means this filing is already late. Every day without this provisional is a day where a competitor could file something similar. Dr. Liu mentioned a similar concept on his YouTube channel — we need to establish priority.",
      department: "Legal / IP",
      severity: "red",
      suggestedAction: "Schedule the patent attorney call for this week. Use the patent drafter in the Legal module to generate the provisional draft before the call. This should take 2 hours, not 2 weeks.",
    },
    {
      id: "w-03",
      title: "39.7% of community members are dormant (336 people)",
      evidence: "Nearly 4 in 10 members haven't engaged in 14+ days. The 2-month re-engagement campaign has only an 8% success rate and is paused. These aren't strangers — they signed up because they believed in what you're building. They're slipping away quietly.",
      department: "Community",
      severity: "yellow",
      suggestedAction: "Launch the 7-Day Fertility Reset challenge. It targets this exact segment and has 3x the activation rate of email re-engagement. The challenge content is already planned.",
    },
  ],

  uncomfortableTruth: {
    title: "You're building a command center when you should be on the phone with investors.",
    body: "The Command Center is a genuine force multiplier — I wouldn't exist without it. But here's the truth you need to hear: right now, at this exact moment in Conceivable's life, the highest-value activity is not optimizing the system. It's using it.\n\nYou have 18 investors tracked across 3 tiers. You have 5 active conversations. You have pitch materials that are 80% ready. But you've spent more hours this week inside the Command Center than on investor calls.\n\nThe Command Center was built so you could spend MORE time on your unique abilities — vision, relationships, storytelling — not so you could spend more time building the Command Center. The irony is not lost on me.\n\nThis week, I need you to make 5 investor outreach calls. Not emails. Calls. Use the pre-meeting briefs in Fundraising. Use the narrative that's already written. The system is ready. You need to use it.",
    sullivanLens: "This is a classic 2x vs 10x trap. Perfecting internal tools is a 2x move. Getting on the phone with Melinda French Gates' team is a 10x move. The Command Center will still be here on Friday. The investor window won't be here forever.",
    campbellLens: "Bill Campbell would say: 'The product doesn't matter if you can't fund it. Go have the conversations that fund the mission. Everything else is a distraction dressed up as productivity.'",
  },

  tenXFocus: {
    focus: "Launch the email sequence and make 5 investor calls this week.",
    rationale: "These two actions — turning on the email funnel and making investor calls — are the only two things that move Conceivable from 'promising' to 'funded and launching.' Everything else is either already running (content, community, legal) or can wait. The email sequence converts your 29K list into signups. The investor calls convert your pipeline into capital. Together, they are the difference between launching in 7 weeks and not launching at all.",
    whatToSayNoTo: [
      "New feature requests for the Command Center (it works — use it)",
      "Podcast appearances this week (you've done 120 — take a week off to sell)",
      "Community content creation (the Content Engine handles this now)",
      "Reviewing individual emails word-by-word (they've been compliance-reviewed — trust the system)",
    ],
  },

  multiplierOpportunities: [
    {
      id: "mo-01",
      action: "Send the first 3 launch emails this week, then share early open rates with investors as 'traction data'",
      departments: ["Email Strategy", "Fundraising"],
      impact: "Turns email list into both signups AND investor proof point. '29K list with 40%+ open rates' is a fundraising talking point, not just a marketing metric.",
      multiplierLabel: "10x",
    },
    {
      id: "mo-02",
      action: "Launch the 7-Day Fertility Reset challenge and document it as a case study for the pitch deck",
      departments: ["Community", "Fundraising", "Content Engine"],
      impact: "Activates dormant members (reducing churn), generates testimonials (fueling content), and creates an engagement case study (strengthening the investor narrative). One action, three departments improved.",
      multiplierLabel: "10x",
    },
    {
      id: "mo-03",
      action: "File the closed-loop provisional patent and add 'patent pending' to all pitch materials",
      departments: ["Legal / IP", "Fundraising"],
      impact: "Strengthens the moat narrative for investors while actually building the moat. 'Patent pending on core technology' changes the fundraising conversation from 'interesting idea' to 'defensible technology.'",
      multiplierLabel: "10x",
    },
  ],

  uniqueAbilityFlags: [
    {
      id: "ua-01",
      task: "Reviewing and editing individual email copy",
      currentOwner: "ceo",
      suggestedOwner: "Content Engine Agent + Legal Compliance Review",
      reasoning: "The emails have been through compliance review. Your unique ability is the science and the relationships — not copyediting. Trust the system you built.",
      hoursPerWeek: 3,
    },
    {
      id: "ua-02",
      task: "Manually responding to community member questions",
      currentOwner: "ceo",
      suggestedOwner: "Community Agent (CEO-required items only)",
      reasoning: "Only 3 of 6 items in the response queue actually require your expertise. The other 3 are template-answerable. The response queue already flags which ones need you — use the system.",
      hoursPerWeek: 4,
    },
    {
      id: "ua-03",
      task: "Building and configuring the Command Center",
      currentOwner: "ceo",
      suggestedOwner: "Development team / Claude Code",
      reasoning: "You've been the 'how' when you should be the 'who decides what to build.' Spec what you need, let the system build it. Your hours are worth more on investor calls than on UI tweaks.",
      hoursPerWeek: 8,
    },
  ],

  strategicQuestions: [
    {
      id: "sq-01",
      question: "If you could only do ONE thing in the next 7 weeks before launch, what would it be?",
      context: "You have a working product, a community, a content engine, legal protection, and a fundraising pipeline. The question isn't what to build — it's what to focus on. Everything is ready except the activation energy.",
      framework: "sullivan",
    },
    {
      id: "sq-02",
      question: "Who is the ONE investor that, if they said yes, would make all the others follow?",
      context: "Your Movement Board has mapped paths to Melinda French Gates, Serena Williams, and others. But fundraising is a domino game. Which domino falls first and triggers the rest?",
      framework: "campbell",
    },
    {
      id: "sq-03",
      question: "What would you do this week if you weren't afraid?",
      context: "You have a tendency to perfect before shipping. The emails are ready. The product works. The pitch is strong. The only thing between you and launch is the fear that it's not perfect enough. It doesn't need to be perfect. It needs to be out there.",
      framework: "both",
    },
    {
      id: "sq-04",
      question: "Are you building Conceivable to be a $50M company or a $500M company?",
      context: "Some of your current decisions (community size, content volume, patent strategy) suggest you're thinking $500M. But your fundraising pace and launch timeline suggest $50M urgency. These need to be aligned.",
      framework: "sullivan",
    },
  ],

  departmentPulses: [
    { department: "Operations", status: "green", headline: "All systems running", keyMetric: "9 departments connected" },
    { department: "Email Strategy", status: "red", headline: "Sequence ready but unsent", keyMetric: "0/5,000 signups" },
    { department: "Content Engine", status: "green", headline: "14 pieces/week across 4 platforms", keyMetric: "112 avg CEO content engagement" },
    { department: "Community", status: "yellow", headline: "Growing but 40% dormant", keyMetric: "847 members, 62% active" },
    { department: "Legal / IP", status: "yellow", headline: "Closed-loop patent overdue", keyMetric: "1 granted, 1 pending, 3 planned" },
    { department: "Finance", status: "green", headline: "Burn rate stable", keyMetric: "$18K/mo burn" },
    { department: "Clinical / Research", status: "green", headline: "Pilot data strong", keyMetric: "150-260% conception improvement" },
    { department: "Fundraising", status: "yellow", headline: "Pipeline built, calls not made", keyMetric: "18 investors, 5 active" },
  ],

  closing: "Kirsten, you've built something remarkable. Nine departments. AI agents that actually think. A community that's growing organically. Clinical data that makes investors' eyes light up. A patent portfolio that's stronger than companies 10x your size.\n\nBut built is not enough. This week is about switching from building mode to using mode. The machine is ready. Turn it on.\n\nMake the calls. Send the emails. File the patent. Everything else can wait.\n\n— Your Strategy Coach",
};

export const BRIEF_ARCHIVE: { id: string; weekOf: string; headline: string; focusTheme: string }[] = [
  { id: "wb-2026-w09", weekOf: "2026-02-23", headline: "Stop building, start using. Make 5 investor calls.", focusTheme: "Activation" },
  { id: "wb-2026-w08", weekOf: "2026-02-16", headline: "Community growth is real, but conversion funnel is broken.", focusTheme: "Conversion" },
  { id: "wb-2026-w07", weekOf: "2026-02-09", headline: "Patent portfolio is your deepest moat. Protect it.", focusTheme: "IP Protection" },
  { id: "wb-2026-w06", weekOf: "2026-02-02", headline: "Content Engine is working. Time to point it at fundraising.", focusTheme: "Narrative" },
  { id: "wb-2026-w05", weekOf: "2026-01-26", headline: "The 21-Day Mindfulness challenge proved community-led growth.", focusTheme: "Community" },
  { id: "wb-2026-w04", weekOf: "2026-01-19", headline: "Clinical data is your unfair advantage. Lead with it everywhere.", focusTheme: "Clinical Evidence" },
];

// ── Decision Framework Data ──

export const DECISIONS: Decision[] = [
  {
    id: "dec-01",
    title: "Bridge round structure: SAFE vs. Convertible Note",
    context: "We need to raise $150K bridge before the Series A. The bridge structure sets the precedent for how investors perceive the company's sophistication and fairness. Two options on the table from our legal counsel.",
    status: "active",
    dateCreated: "2026-02-15",
    options: [
      {
        id: "opt-01a",
        label: "SAFE (Y Combinator Standard)",
        description: "Post-money SAFE with $8M valuation cap, no discount. Clean, founder-friendly, industry standard.",
        tradeoffs: [
          { pro: "Simple docs, no interest, no maturity date pressure", con: "Some traditional investors unfamiliar with SAFEs" },
          { pro: "YC standard gives credibility signal", con: "Post-money SAFEs dilute more predictably (which is actually clearer)" },
          { pro: "No board seat required at bridge stage", con: "Less investor engagement pre-Series A" },
        ],
        multiplierLabel: "10x",
        sullivanLens: "The SAFE is the 10x move because it preserves founder control and speed. Every hour spent negotiating convertible note terms is an hour not spent on the product.",
        campbellLens: "Bill would say: 'Keep it simple. The bridge is a bridge — don't over-engineer it. Save the complex negotiations for the Series A when you have leverage.'",
        deptImpact: [
          { department: "Legal / IP", impact: "Minimal legal cost — standard YC SAFE docs", sentiment: "positive" },
          { department: "Fundraising", impact: "Faster close, less friction with sophisticated angels", sentiment: "positive" },
          { department: "Finance", impact: "Clean cap table, easy to model dilution", sentiment: "positive" },
        ],
      },
      {
        id: "opt-01b",
        label: "Convertible Note (Traditional)",
        description: "18-month convertible note, 20% discount, $8M cap, 5% interest. More familiar to traditional investors.",
        tradeoffs: [
          { pro: "Some investors prefer the familiarity of notes", con: "More complex docs, lawyer fees for both sides" },
          { pro: "Interest accrual shows investor commitment", con: "Maturity date creates pressure if Series A is delayed" },
          { pro: "Discount rewards early believers", con: "Discount + cap can create unfavorable conversion math" },
        ],
        multiplierLabel: "2x",
        sullivanLens: "The convertible note is a 2x move — it gets the money in the door but adds complexity that will slow you down and cost legal fees. The time spent on note negotiations is time not spent on the 10x activities.",
        campbellLens: "Bill would ask: 'Who are you trying to impress with the complex structure? Raise the money fast, get back to building.'",
        deptImpact: [
          { department: "Legal / IP", impact: "Higher legal cost, more attorney hours needed", sentiment: "negative" },
          { department: "Fundraising", impact: "Slower close, more back-and-forth with investors", sentiment: "negative" },
          { department: "Finance", impact: "Interest accrual adds complexity to cap table", sentiment: "neutral" },
        ],
      },
    ],
    recommendation: {
      optionId: "opt-01a",
      reasoning: "The SAFE preserves your most valuable resource right now — time. The bridge is a means to an end (Series A), not the end itself. Close it fast with a clean SAFE, then pour that energy into the 5 investor calls that matter for the real raise.",
    },
  },
  {
    id: "dec-02",
    title: "Podcast strategy: Continue volume or shift to high-profile targets only?",
    context: "Kirsten has done 120 podcast appearances in 4 months. This was the right move early on for brand building. But now the question is whether continued volume serves the mission or whether it's time to be selective.",
    status: "decided",
    dateCreated: "2026-01-20",
    dateDecided: "2026-01-27",
    options: [
      {
        id: "opt-02a",
        label: "Continue high-volume (10+/month)",
        description: "Keep the pace. Every appearance is a lead gen opportunity and builds the CEO's personal brand.",
        tradeoffs: [
          { pro: "Cumulative SEO and discovery benefits", con: "Diminishing returns on smaller shows" },
          { pro: "Keeps content pipeline fed", con: "CEO time is the bottleneck — 10+ podcasts is 20+ hours/month" },
        ],
        multiplierLabel: "2x",
        sullivanLens: "This is maintaining a 2x activity. The first 120 podcasts built the brand. The next 120 won't 10x anything — they'll maintain.",
        campbellLens: "Bill would say: 'You've proven you can do volume. Now prove you can be strategic. Pick the 3 that matter and say no to everything else.'",
        deptImpact: [
          { department: "Content Engine", impact: "Continued content supply", sentiment: "positive" },
          { department: "Fundraising", impact: "CEO time diverted from fundraising", sentiment: "negative" },
        ],
      },
      {
        id: "opt-02b",
        label: "Shift to selective (3-4/month, major shows only)",
        description: "Only accept podcasts with 50K+ audience, direct alignment with target demographic, or strategic investor/partner connection.",
        tradeoffs: [
          { pro: "Frees up 15+ hours/month for fundraising", con: "Content pipeline may slow temporarily" },
          { pro: "Higher-quality appearances elevate brand positioning", con: "Smaller shows may feel rejected" },
        ],
        multiplierLabel: "10x",
        sullivanLens: "This is the 10x move. The content library is deep enough. Now each appearance should be strategic — either it reaches 100K+ people or it opens a door to an investor, partner, or expert.",
        campbellLens: "Bill would say: 'Your time is the scarcest resource. Protect it like you'd protect your best player from injury.'",
        deptImpact: [
          { department: "Content Engine", impact: "Slightly less raw material, but higher quality", sentiment: "neutral" },
          { department: "Fundraising", impact: "15+ hours freed for investor conversations", sentiment: "positive" },
          { department: "Community", impact: "Expert interviews can fill the content gap", sentiment: "positive" },
        ],
      },
    ],
    outcome: {
      chosenOptionId: "opt-02b",
      result: "Shifted to selective appearances. Freed 15 hours/month. Content Engine adapted by repurposing existing 120-podcast library. Community expert interviews filled the content gap with higher engagement.",
      lessonsLearned: "Volume was the right strategy for months 1-4. But continuing it was a comfort zone, not a strategy. The discomfort of saying 'no' to easy opportunities is the signal that you're making the right choice.",
      dateReviewed: "2026-02-20",
    },
  },
];

// ── Ideas Parking Lot Data ──

export const IDEAS: Idea[] = [
  {
    id: "idea-01",
    text: "Partner with Oura Ring for a co-branded fertility tracking study. Our BBT analysis + their hardware = the most accurate fertility prediction on the market.",
    department: "Clinical / Research",
    impact: "10x",
    urgency: "this_quarter",
    status: "pursue",
    agentReview: "10x potential — this is a WHO, not a HOW problem. Oura partnership would give credibility + hardware access. Dr. James Liu (affiliate) has connections at Oura. Recommended path: warm intro through Dr. Liu → joint research proposal.",
    createdAt: "2026-02-10T09:30:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-02",
    text: "Create a 'Conceivable Certified' program for fertility coaches and practitioners. They pay us to get trained on our protocol, then refer patients to the platform.",
    department: "Community",
    impact: "10x",
    urgency: "backlog",
    status: "schedule",
    agentReview: "10x if executed right, but premature now. Schedule for Q3 after launch. Requires: standardized protocol documentation, certification curriculum, legal review of certification claims. This becomes a revenue line AND a distribution channel. Park it, don't lose it.",
    createdAt: "2026-02-08T14:15:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-03",
    text: "Weekly 'Fertility Weather Report' — a 2-minute video where Kirsten summarizes the week's biggest fertility science news. Could go viral on TikTok/Reels.",
    department: "Content Engine",
    impact: "10x",
    urgency: "this_quarter",
    status: "delegate",
    agentReview: "Brilliant content format — uniquely leverages CEO's unique ability (science communication) in a scalable format. BUT: don't have Kirsten produce this. Have the Content Engine draft the script, Kirsten records a 2-minute video, agent handles editing and distribution. CEO time: 10 min/week, not 2 hours.",
    createdAt: "2026-02-12T11:00:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-04",
    text: "Hire a fractional CFO before the Series A to make the financial model investor-grade.",
    department: "Finance",
    impact: "2x",
    urgency: "now",
    status: "pursue",
    agentReview: "This is a WHO problem that needs solving NOW. The financial model needs to be airtight before investor meetings. A fractional CFO costs $3-5K/month but saves 20+ hours of CEO time and dramatically improves investor confidence. Recommended: post on CFO.co or ask your advisory network for referrals.",
    createdAt: "2026-02-18T16:45:00Z",
    updatedAt: "2026-02-23T07:00:00Z",
  },
  {
    id: "idea-05",
    text: "Host a live 'Conceivable Launch Party' virtual event — invite the community, email list, and target investors to watch the product demo together.",
    department: "Fundraising",
    impact: "10x",
    urgency: "this_quarter",
    status: "pursue",
    agentReview: "10x multiplier — this single event could convert email subscribers, activate community members, demonstrate traction to investors, and generate content. Schedule for 1 week before public launch. Invite top 5 investor prospects as 'special guests' to watch real users engage with the product.",
    createdAt: "2026-02-20T08:30:00Z",
    updatedAt: "2026-02-23T07:00:00Z",
  },
  {
    id: "idea-06",
    text: "Add a referral program to the community — existing members get rewards for inviting friends who are TTC.",
    department: "Community",
    impact: "2x",
    urgency: "this_quarter",
    status: "schedule",
    agentReview: "Solid 2x growth mechanism but not urgent now. The community is growing organically at a healthy rate. A referral program adds operational complexity (tracking, rewards, fraud prevention). Schedule for post-launch when you have more users to seed the flywheel.",
    createdAt: "2026-02-14T10:00:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-07",
    text: "Write a book: 'The Fertility Code' — positions Kirsten as THE authority, becomes a lead gen machine for years.",
    department: "Content Engine",
    impact: "10x",
    urgency: "backlog",
    status: "schedule",
    agentReview: "Undeniably 10x for brand positioning and authority, but this is a 6-12 month project. The content library (120 podcasts, community Q&As, clinical data) is essentially a first draft. Recommend: hire a ghostwriter post-Series A, use podcast transcripts as raw material. CEO time to write a book right now would be catastrophically misallocated.",
    createdAt: "2026-02-05T19:00:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-08",
    text: "Integrate glucose monitoring data into the platform — CGM + BBT = unprecedented fertility insight.",
    department: "Clinical / Research",
    impact: "10x",
    urgency: "backlog",
    status: "schedule",
    agentReview: "This is the future of Conceivable's product thesis. The 30-Day Glucose Challenge in the community is already generating preliminary data on the glucose-fertility connection. But the integration is a product build that should come after launch and funding. File a provisional patent on the glucose-BBT correlation methodology. Build the product feature in Q3.",
    createdAt: "2026-02-01T13:00:00Z",
    updatedAt: "2026-02-17T07:00:00Z",
  },
  {
    id: "idea-09",
    text: "Investor warm intro through podcast guests — many of our 120 podcast hosts have investor connections.",
    department: "Fundraising",
    impact: "10x",
    urgency: "now",
    status: "new",
    createdAt: "2026-02-25T09:15:00Z",
    updatedAt: "2026-02-25T09:15:00Z",
  },
  {
    id: "idea-10",
    text: "Create a free 'Fertility Score' calculator widget that can be embedded on partner websites — drives email signups.",
    department: "Email Strategy",
    impact: "10x",
    urgency: "this_quarter",
    status: "new",
    createdAt: "2026-02-26T15:30:00Z",
    updatedAt: "2026-02-26T15:30:00Z",
  },
];

// ── Strategy Connections ──

export const STRATEGY_CONNECTIONS: StrategyConnection[] = [
  { department: "Operations", status: "green", lastBriefDate: "2026-02-23", keyInsight: "All systems operational. 9 departments connected." },
  { department: "Email Strategy", status: "red", lastBriefDate: "2026-02-23", keyInsight: "23 emails written but 0 sent. Launch sequence is the #1 bottleneck." },
  { department: "Content Engine", status: "green", lastBriefDate: "2026-02-23", keyInsight: "14 pieces/week flowing. CEO insights outperform all other sources 2:1." },
  { department: "Community", status: "yellow", lastBriefDate: "2026-02-23", keyInsight: "847 members, 62% active. Dormant segment needs challenge activation." },
  { department: "Legal / IP", status: "yellow", lastBriefDate: "2026-02-23", keyInsight: "Strong portfolio but closed-loop provisional is overdue." },
  { department: "Finance", status: "green", lastBriefDate: "2026-02-23", keyInsight: "$18K/mo burn rate. 8 months runway at current rate." },
  { department: "Clinical / Research", status: "green", lastBriefDate: "2026-02-23", keyInsight: "Pilot data (150-260% improvement) is the strongest asset in the pitch." },
  { department: "Fundraising", status: "yellow", lastBriefDate: "2026-02-23", keyInsight: "18 investors mapped, 5 active conversations. Pipeline built, calls not made." },
];
