// Data Room folder structure and required documents

export interface FolderConfig {
  code: string;
  name: string;
  description: string;
  color: string;
  documents: {
    title: string;
    description: string;
    required: boolean;
  }[];
}

export const DATA_ROOM_FOLDERS: FolderConfig[] = [
  {
    code: "00",
    name: "Read Me & Index",
    description: "How to navigate this room, company overview, and investment summary.",
    color: "#5A6FFF",
    documents: [
      { title: "How to Use This Room", description: "One-page guide with short company overview and links to key docs.", required: true },
      { title: "Master Index", description: "Every folder, doc name, and 1-line description.", required: true },
      { title: "Investment Memo", description: "Summary of the opportunity, key metrics, and round terms.", required: false },
    ],
  },
  {
    code: "01",
    name: "Company Overview",
    description: "Pitch deck, executive summary, cap table, and org structure.",
    color: "#E37FB1",
    documents: [
      { title: "Pitch Deck", description: "Latest version — the exact deck used in meetings.", required: true },
      { title: "Executive Summary", description: "1-2 page company overview and one-pager.", required: true },
      { title: "Cap Table", description: "Fully diluted, including SAFEs/notes and option pool.", required: true },
      { title: "Corporate Structure Chart", description: "Ownership structure — parent, subs, management company if any.", required: true },
      { title: "Org Chart", description: "High-level functions and headcount (not every IC at seed).", required: false },
    ],
  },
  {
    code: "02",
    name: "Product & Tech",
    description: "Demo, architecture, roadmap, and security posture.",
    color: "#78C3BF",
    documents: [
      { title: "Product Demo", description: "Short Loom video and/or screenshots of app flows.", required: true },
      { title: "Product Overview", description: "Key features, user journey, differentiation, 12-24 month roadmap.", required: true },
      { title: "Architecture Diagram", description: "Main components, tech stack, key integrations.", required: true },
      { title: "Security & Privacy Summary", description: "Data handling, encryption, PHI/PII approach, HIPAA/GDPR stance.", required: true },
      { title: "Uptime & Reliability Notes", description: "Quality and reliability metrics if relevant.", required: false },
    ],
  },
  {
    code: "03",
    name: "Market & Traction",
    description: "TAM/SAM/SOM, competitive landscape, GTM, and early metrics.",
    color: "#1EAA55",
    documents: [
      { title: "Market Overview", description: "TAM/SAM/SOM, segmentation, and why now.", required: true },
      { title: "Competitive Landscape", description: "Matrix with positioning and moat.", required: true },
      { title: "GTM Strategy", description: "Channels (TikTok, email, affiliates, partnerships), funnels, pricing.", required: true },
      { title: "Metrics Dashboard", description: "Waitlist, signups, conversion, retention, engagement cohorts.", required: true },
      { title: "Evidence of Demand", description: "Early access stats, testimonials, case studies, NPS, surveys, LOIs.", required: true },
    ],
  },
  {
    code: "04",
    name: "Team & HR",
    description: "Founder bios, org chart, hiring plan, and employment agreements.",
    color: "#F1C028",
    documents: [
      { title: "Founder & Key Team Bios", description: "Short and focused on why you're the team for this.", required: true },
      { title: "LinkedIn Links", description: "Founders and core team LinkedIn profiles.", required: true },
      { title: "Org Chart & Hiring Plan", description: "Current structure and 12-24 month hiring plan.", required: true },
      { title: "Employment Agreements", description: "Standard offer letter templates and founder employment contracts.", required: false },
      { title: "Advisory Board", description: "List, bios, and any formalized advisory agreements.", required: false },
    ],
  },
  {
    code: "05",
    name: "Financials",
    description: "Financial model, burn rate, runway, and use of funds.",
    color: "#E24D47",
    documents: [
      { title: "3-Year Financial Model", description: "Revenue assumptions, unit economics, headcount plan, CAC/LTV logic.", required: true },
      { title: "Historical Financials", description: "Monthly P&L, cash balance, burn, runway.", required: false },
      { title: "Burn Rate & Runway Summary", description: "1-pager that ties to the model.", required: true },
      { title: "Use of Funds", description: "How much, what for, expected milestones for this round.", required: true },
      { title: "Tax Filings", description: "Key tax filings or notes if relevant.", required: false },
    ],
  },
  {
    code: "06",
    name: "Legal & Corporate",
    description: "Incorporation docs, financing docs, option pool, and regulatory.",
    color: "#356FB6",
    documents: [
      { title: "Certificate of Incorporation", description: "Articles of incorporation, bylaws/operating agreement.", required: true },
      { title: "Board Consents & Minutes", description: "Formation, prior financings, option pool approvals.", required: true },
      { title: "Shareholder Agreements", description: "Shareholder and stock purchase agreements.", required: true },
      { title: "Financing Documents", description: "SAFEs, convertible notes, prior term sheets, side letters, warrants.", required: true },
      { title: "Option Pool Documents", description: "Option plan, standard option agreement, board approvals.", required: true },
      { title: "Regulatory Licenses", description: "Any licenses/approvals for health/fertility or medical claims.", required: false },
    ],
  },
  {
    code: "07",
    name: "Intellectual Property",
    description: "Patents, trademarks, IP assignments, and open-source policy.",
    color: "#9686B9",
    documents: [
      { title: "IP Assignments", description: "From founders, employees, and contractors (crucial).", required: true },
      { title: "Patents", description: "Filed/granted patents, provisional filings, PCTs.", required: true },
      { title: "Trademarks", description: "Filed and registered marks, including Conceivable brand and logo.", required: true },
      { title: "Copyrights", description: "Copyrights or database rights if applicable.", required: false },
      { title: "Open-Source Policy", description: "Usage policy and key licenses relied on.", required: false },
    ],
  },
  {
    code: "08",
    name: "Commercial & Partnerships",
    description: "Key agreements, partnerships, terms of service, and vendor contracts.",
    color: "#ACB7FF",
    documents: [
      { title: "Material Commercial Agreements", description: "Big customers, channel partnerships, strategic alliances.", required: false },
      { title: "Pilot & Research Collaborations", description: "Clinic, university, or lab partner agreements.", required: false },
      { title: "Terms of Use & Privacy Policy", description: "Standard customer/user agreements and BAA template.", required: true },
      { title: "Vendor Contracts", description: "Mission-critical vendors: hosting, major APIs, data vendors.", required: false },
    ],
  },
  {
    code: "09",
    name: "Misc, FAQs & Updates",
    description: "Investor FAQ, testimonials, updates, and press.",
    color: "#2A2828",
    documents: [
      { title: "Investor FAQ", description: "Common questions: regulation, clinical claims, liability, defensibility.", required: true },
      { title: "Customer Testimonials", description: "1-3 polished customer/user stories and case studies.", required: false },
      { title: "Investor Updates", description: "Past update emails or monthly update template.", required: false },
      { title: "Press & Media", description: "Awards, notable media mentions, press coverage.", required: false },
    ],
  },
];

// Flatten all expected documents for seeding
export function getAllExpectedDocuments() {
  const docs: { folder: string; title: string; description: string; required: boolean; sortOrder: number }[] = [];
  let order = 0;
  for (const folder of DATA_ROOM_FOLDERS) {
    for (const doc of folder.documents) {
      docs.push({
        folder: folder.code,
        title: doc.title,
        description: doc.description,
        required: doc.required,
        sortOrder: order++,
      });
    }
  }
  return docs;
}
