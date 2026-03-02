// Finance data types — structured to match what the COO's Convex/Plaid/Stripe tool provides.
// When wiring live data, replace MOCK_* exports with Convex HTTP API calls.

export interface CashPosition {
  currentBalance: number;
  asOfDate: string;
  accountBreakdown: { name: string; balance: number; type: "checking" | "savings" | "credit" }[];
}

export interface BurnMetrics {
  monthlyBurn: number;
  monthlyBurnPrevious: number;
  dailyBurn: number;
  dailyBurnBreakdown: { category: string; amount: number }[];
  runwayMonths: number;
  runwayDays: number;
  runwayExtendedDays: number; // THE GAIN: how many days runway extended since last month
  weekOverWeek: { week: string; burn: number }[];
  monthOverMonth: { month: string; burn: number }[];
}

export interface RevenueStream {
  name: string;
  monthlyAmount: number;
  trend: "up" | "down" | "flat";
  note: string;
}

export interface CostItem {
  category: string;
  subcategories: { name: string; amount: number; note?: string }[];
  total: number;
}

export interface PLData {
  revenue: RevenueStream[];
  totalRevenue: number;
  cogs: CostItem[];
  totalCOGS: number;
  operatingExpenses: CostItem[];
  totalOpEx: number;
  netBurn: number;
  projections: RunwayProjection[];
}

export interface RunwayProjection {
  scenario: string;
  label: string;
  subscribers: number;
  pricePerMonth: number;
  monthlyRevenue: number;
  runwayMonths: number;
  description: string;
}

export interface InvestorMetric {
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "flat";
}

export interface WeeklyCostInsight {
  label: "10x" | "2x";
  title: string;
  description: string;
  impact: string;
  costDriver: string;
  weeklyAmount: number;
}

export interface FinancialSummary {
  generatedDate: string;
  highlights: string[];
  investorMetrics: InvestorMetric[];
  costInsights: WeeklyCostInsight[];
  crossDepartmentLinks: { department: string; connection: string; label: "10x" | "2x" }[];
}

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------

export const MOCK_CASH_POSITION: CashPosition = {
  currentBalance: 127_450,
  asOfDate: "2026-03-01",
  accountBreakdown: [
    { name: "Mercury Checking", balance: 89_200, type: "checking" },
    { name: "Mercury Savings", balance: 35_000, type: "savings" },
    { name: "Stripe Balance", balance: 3_250, type: "checking" },
  ],
};

export const MOCK_BURN_METRICS: BurnMetrics = {
  monthlyBurn: 18_400,
  monthlyBurnPrevious: 19_200,
  dailyBurn: 613,
  dailyBurnBreakdown: [
    { category: "API Costs (Claude, OpenAI)", amount: 300 },
    { category: "Infrastructure (Vercel, Convex)", amount: 85 },
    { category: "SaaS Tools", amount: 78 },
    { category: "Contractor / Design", amount: 150 },
  ],
  runwayMonths: 6.9,
  runwayDays: 208,
  runwayExtendedDays: 14, // Gained 14 days of runway since last month
  weekOverWeek: [
    { week: "Feb 3", burn: 4_800 },
    { week: "Feb 10", burn: 4_600 },
    { week: "Feb 17", burn: 4_200 },
    { week: "Feb 24", burn: 4_400 },
    { week: "Mar 1", burn: 4_400 },
  ],
  monthOverMonth: [
    { month: "Oct", burn: 22_100 },
    { month: "Nov", burn: 21_300 },
    { month: "Dec", burn: 20_800 },
    { month: "Jan", burn: 19_200 },
    { month: "Feb", burn: 18_400 },
  ],
};

export const MOCK_PL_DATA: PLData = {
  revenue: [
    { name: "Pre-launch Deposits", monthlyAmount: 0, trend: "flat", note: "Opens at launch" },
    { name: "Consulting / Advisory", monthlyAmount: 2_500, trend: "flat", note: "Kirsten advisory calls" },
    { name: "Affiliate Partnerships", monthlyAmount: 800, trend: "up", note: "Growing as content engine scales" },
  ],
  totalRevenue: 3_300,
  cogs: [
    {
      category: "AI & API Costs",
      total: 9_200,
      subcategories: [
        { name: "Anthropic (Claude)", amount: 6_800, note: "Agent system, content gen, briefs" },
        { name: "OpenAI (embeddings)", amount: 1_200, note: "Similarity search, RAG" },
        { name: "Google AI (Gemini)", amount: 700, note: "Multi-model fallback" },
        { name: "Other APIs", amount: 500, note: "Mailchimp, Late, social APIs" },
      ],
    },
    {
      category: "Infrastructure",
      total: 2_600,
      subcategories: [
        { name: "Vercel", amount: 800, note: "Hosting + serverless" },
        { name: "Convex", amount: 600, note: "Database + real-time" },
        { name: "Neon (PostgreSQL)", amount: 400, note: "Prisma DB" },
        { name: "Domain / DNS / CDN", amount: 200, note: "Cloudflare + domains" },
        { name: "Monitoring & Logging", amount: 600, note: "Datadog, Sentry" },
      ],
    },
  ],
  totalCOGS: 11_800,
  operatingExpenses: [
    {
      category: "People & Contractors",
      total: 7_500,
      subcategories: [
        { name: "Design Contractor", amount: 4_000, note: "Brand + UI work" },
        { name: "Clinical Advisor", amount: 2_000, note: "Medical review" },
        { name: "Legal (hourly)", amount: 1_500, note: "Patent + compliance" },
      ],
    },
    {
      category: "SaaS & Tools",
      total: 2_400,
      subcategories: [
        { name: "Circle (Community)", amount: 500 },
        { name: "Mailchimp", amount: 350 },
        { name: "Late (Social)", amount: 200 },
        { name: "Figma", amount: 150 },
        { name: "Notion", amount: 200 },
        { name: "Misc Tools", amount: 1_000 },
      ],
    },
  ],
  totalOpEx: 9_900,
  netBurn: -18_400,
  projections: [
    {
      scenario: "current",
      label: "Current Burn (No Revenue)",
      subscribers: 0,
      pricePerMonth: 0,
      monthlyRevenue: 3_300,
      runwayMonths: 6.9,
      description: "Maintaining current spend with advisory revenue only.",
    },
    {
      scenario: "conservative",
      label: "500 Subscribers @ $29/mo",
      subscribers: 500,
      pricePerMonth: 29,
      monthlyRevenue: 17_800,
      runwayMonths: 25.2,
      description: "Hit 10% of founding member goal. Revenue nearly covers burn.",
    },
    {
      scenario: "target",
      label: "1,000 Subscribers @ $29/mo",
      subscribers: 1_000,
      pricePerMonth: 29,
      monthlyRevenue: 32_300,
      runwayMonths: 999, // cash flow positive
      description: "Hit 20% of goal. Cash flow positive — infinite runway.",
    },
    {
      scenario: "stretch",
      label: "2,500 Subscribers @ $29/mo",
      subscribers: 2_500,
      pricePerMonth: 29,
      monthlyRevenue: 75_800,
      runwayMonths: 999,
      description: "Hit 50% of goal. Generating $57K/mo net profit.",
    },
  ],
};

export const MOCK_FINANCIAL_SUMMARY: FinancialSummary = {
  generatedDate: "2026-03-01",
  highlights: [
    "Monthly burn decreased 4.2% ($800 reduction) — driven by API cost optimization",
    "Runway extended by 14 days since last month (THE GAIN)",
    "Affiliate revenue growing — 23% month-over-month increase",
    "AI costs represent 50% of total spend — primary lever for burn reduction",
    "On track for launch: financial health supports 5-week runway to first revenue",
  ],
  investorMetrics: [
    { label: "Monthly Burn Rate", value: "$18.4K", detail: "Down 4.2% MoM", trend: "down" },
    { label: "Runway", value: "6.9 months", detail: "208 days at current burn", trend: "up" },
    { label: "CAC (Projected)", value: "$12-18", detail: "Based on content + email engine", trend: "flat" },
    { label: "LTV (Projected)", value: "$290-520", detail: "12-18 mo retention @ $29/mo", trend: "up" },
    { label: "LTV:CAC Ratio", value: "16-29x", detail: "Industry best-in-class > 3x", trend: "up" },
    { label: "Cash on Hand", value: "$127.5K", detail: "Mercury + Stripe", trend: "flat" },
  ],
  costInsights: [
    {
      label: "10x",
      title: "Batch Claude API calls to reduce per-token costs 40%",
      description:
        "Currently making ~200 individual Claude calls/day for agent responses. Batching similar queries and using prompt caching could reduce API spend from $6,800 to ~$4,000/mo without quality loss.",
      impact: "Save $2,800/mo = 5 additional weeks of runway",
      costDriver: "Anthropic API",
      weeklyAmount: 1_700,
    },
    {
      label: "2x",
      title: "Consolidate monitoring tools — Datadog + Sentry overlap",
      description:
        "Running both Datadog and Sentry with overlapping error tracking. Consolidate to Sentry-only for error tracking + Vercel Analytics for performance. Saves $400/mo.",
      impact: "Minor cost reduction, worth doing but not transformative",
      costDriver: "Monitoring Tools",
      weeklyAmount: 150,
    },
    {
      label: "10x",
      title: "Negotiate annual pricing on top 3 SaaS tools",
      description:
        "Circle, Mailchimp, and Convex all offer 20-30% annual discounts. Combined monthly spend is $1,450. Annual deal could save $3,500-5,200/year.",
      impact: "One-time effort, recurring savings — classic 10x move (small input, compounding output)",
      costDriver: "SaaS Tools",
      weeklyAmount: 340,
    },
  ],
  crossDepartmentLinks: [
    {
      department: "Fundraising",
      connection:
        "Financial health metrics auto-feed investor updates. Burn reduction = stronger narrative. Show 5 consecutive months of declining burn rate.",
      label: "10x",
    },
    {
      department: "Operations",
      connection:
        "Burn rate is Company KPI #2 (after signup velocity). Daily burn feeds the Operations dashboard in real-time.",
      label: "10x",
    },
    {
      department: "Strategy",
      connection:
        "Runway determines strategic horizon. At 6.9 months, all strategic decisions should have <6 month payoff. Financial health constrains but also focuses strategy.",
      label: "10x",
    },
    {
      department: "Content Engine",
      connection:
        "Content-driven CAC is the cheapest acquisition channel. Every dollar spent on content engine has highest ROI per acquisition.",
      label: "2x",
    },
  ],
};
