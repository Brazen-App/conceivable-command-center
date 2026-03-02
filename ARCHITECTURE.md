# Conceivable Command Center — System Architecture

## The Thesis

Conceivable is an AI-first company that operates the same way its product works: nothing is an island, everything is connected, and the system is greater than the sum of its parts. The Command Center is the operational nervous system that allows a team of fewer than 10 people to execute at the level of a 50-person organization.

Each department has an AI agent that understands Conceivable's mission, brand, regulatory constraints, and current priorities. These agents don't operate in silos — they share structured intelligence through a weekly briefing system, creating a virtuous cycle where improvements in one department cascade across the organization.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Database:** Prisma ORM (PostgreSQL on Vercel Postgres or Supabase)
- **AI:** Anthropic Claude API (Sonnet for routine tasks, Opus for strategy)
- **Deployment:** Vercel (auto-deploy from GitHub `main` branch)
- **Repo:** github.com/Brazen-App/conceivable-command-center

---

## Department Architecture

### 1. OPERATIONS (The Spine)

**Role:** Orchestrator. Aggregates intelligence from all departments, tracks company-wide KPIs, and generates the cross-department briefs that keep everything connected.

**Core Functions:**
- Company dashboard with real-time KPIs across all departments
- Weekly "State of Conceivable" report auto-generated from department briefs
- OKR tracking (quarterly goals, weekly check-ins)
- Cross-department dependency alerts (e.g., "Legal flagged a claim in Email #6 that Content is about to publish")
- Team task management and accountability tracking

**KPIs Tracked:**
- Email list size and growth rate
- Content pieces published per day (target: 100)
- Runway (months remaining)
- Active subscribers / early access signups
- Compliance incidents (target: 0)
- Patent applications in progress
- Fundraising pipeline status

**Agent Behavior:**
- Every Monday: Collects department briefs, generates "State of Conceivable" summary
- Flags cross-department conflicts or opportunities
- Escalates blockers that require human decision
- Generates weekly priorities recommendation based on company goals

**Connections:**
- READS FROM: All departments (via structured briefs)
- WRITES TO: All departments (via priority directives and cross-department alerts)

---

### 2. EMAIL STRATEGY (Existing — Needs Integration)

**Role:** Manage the 8-week launch email sequence and ongoing email marketing. Currently has 23 emails written. Needs to connect to Mailchimp for real publishing.

**Core Functions:**
- Email content management (view, edit, approve)
- Mailchimp integration (approve → publish pipeline)
- A/B test tracking and recommendations
- Performance analytics (open rates, click rates, conversion)
- AI-assisted rewriting and optimization
- Audio preview (text-to-speech for review)

**Agent Behavior:**
- Reviews email performance data weekly
- Suggests subject line optimizations based on open rates
- Flags emails that contain claims needing Legal review
- Recommends send time optimization based on engagement data
- Generates new email drafts based on content from Content Engine

**Connections:**
- READS FROM: Legal (compliance constraints), Content (new material to repurpose), Operations (priority directives), Fundraising (narrative alignment)
- WRITES TO: Operations (email metrics), Content (email performance data to inform content strategy)

**Integration Points:**
- Mailchimp API (send, schedule, analytics)
- Legal department approval workflow for health claims

---

### 3. CONTENT ENGINE (The Mouth)

**Role:** Transform Conceivable's massive content library (1,200+ hours of podcast content, blog posts, research, email sequences) into 100 pieces of daily multi-platform content.

**Core Functions:**
- Content calendar (daily/weekly/monthly view)
- Source material library (podcast transcripts, blog posts, research papers, email content)
- AI content generation pipeline:
  - Podcast → clips, quotes, carousels, threads, blog posts, audiograms
  - Research → infographics, explainers, social posts
  - Emails → social teasers, blog adaptations
- Multi-platform publishing queue (Instagram, TikTok, LinkedIn, X, YouTube, Blog)
- Brand voice enforcement (checks all content against brand book)
- Performance tracking per platform per content type

**Content Production Pipeline:**
1. Source material ingested (podcast transcript, research paper, etc.)
2. AI identifies key moments, quotes, data points, stories
3. AI generates content variants for each platform
4. Legal/Compliance agent reviews health claims automatically
5. Content enters approval queue
6. Approved content enters publishing schedule
7. Performance tracked and fed back into optimization

**Agent Behavior:**
- Daily: Generates content batch from source material library
- Flags any health claims for Legal review before publishing
- Tracks which content types perform best on which platforms
- Recommends content mix adjustments based on performance data
- Ensures brand voice consistency across all outputs
- Identifies trending topics in fertility/women's health space for timely content

**Connections:**
- READS FROM: Legal (approved claims list, restricted language), Email (high-performing email content to repurpose), Operations (priority topics), Fundraising (narrative to amplify)
- WRITES TO: Operations (content metrics), Email (content that can be adapted to email), Legal (content pending review)

**Volume Architecture (100 pieces/day):**
- 30 short-form social posts (quotes, tips, stats)
- 20 carousel/infographic posts
- 15 video clips from podcasts
- 15 threads/long-form social
- 10 blog post sections/summaries
- 5 email newsletter segments
- 5 community engagement posts

---

### 4. LEGAL / IP / COMPLIANCE (The Immune System)

**Role:** Protect Conceivable from regulatory, legal, and IP risk. This department doesn't just react — it proactively constrains and guides every other department.

**Core Functions:**

**Patent & IP Management:**
- Patent portfolio tracker (existing patents, pending applications, provisional filing deadlines)
- Competitive IP landscape monitoring
- Weekly research on new filing opportunities
- Prior art tracking
- Patent attorney coordination workflow

**Regulatory Compliance:**
- FDA compliance monitoring (supplement claims, device claims for Halo Ring)
- FTC advertising guidelines enforcement
- HIPAA compliance for health data handling
- State-by-state telehealth regulations tracking
- Clinical trial / study claims verification

**Content Compliance:**
- Approved claims database (what Conceivable CAN say, with citations)
- Restricted language list (what Conceivable CANNOT say)
- Auto-review of all content before publishing
- Disclaimer templates for different content types
- Testimonial compliance (FTC guidelines for health product testimonials)

**Privacy & Security:**
- Data handling policy enforcement
- Third-party vendor security review
- Privacy policy updates tracking
- User consent management oversight

**Agent Behavior:**
- Maintains and updates approved claims database weekly
- Auto-scans all content from Content Engine and Email for compliance issues
- Flags testimonials that may violate FTC guidelines (IMPORTANT: the pilot study testimonials need verification)
- Tracks patent filing deadlines and sends alerts 30/60/90 days before
- Monitors competitor patent filings weekly
- Generates weekly compliance report for Operations

**Connections:**
- READS FROM: Content (pending content for review), Email (pending emails for review), Fundraising (pitch materials for claims verification), Operations (company priorities)
- WRITES TO: ALL departments (compliance constraints, approved language, flags)

**CRITICAL NOTE:** The current email sequence contains testimonials from "Sarah," "Lisa," and "Maya" with specific health outcomes. If these are real patients with consent, they need proper FTC disclaimers. If they are composites or fictional, they CANNOT be presented as real testimonials for a health product. The Legal agent should flag these immediately.

---

### 5. FINANCE (Integration Layer)

**Role:** Connect the existing finance tool (built by COO) into the command center for unified visibility.

**Core Functions:**
- Revenue tracking dashboard (pull from existing tool)
- Burn rate and runway calculator
- COGS attribution per product line
- Monthly investor update automation (already exists — integrate)
- Budget vs. actual tracking per department
- Financial projections and scenario modeling

**Integration Architecture:**
- [PENDING: Need tech stack info from COO]
- [PENDING: Need API/webhook access details]
- Executive meeting transcription → action item extraction (already exists)
- Auto-generated monthly investor updates (already exists)

**Agent Behavior:**
- Weekly: Pulls latest financial data, generates department budget status
- Monthly: Coordinates with existing investor update automation
- Flags burn rate anomalies or budget overruns
- Generates financial talking points for Fundraising department

**Connections:**
- READS FROM: Operations (headcount, tool costs), All departments (budget requests)
- WRITES TO: Operations (financial KPIs), Fundraising (financial metrics, projections), Strategy (runway alerts)

---

### 6. FUNDRAISING (The Growth Engine)

**Role:** Prepare for and execute the fundraising process. Manage investor relationships, pitch materials, data room, and narrative consistency.

**Core Functions:**
- Investor CRM (track outreach, meetings, follow-ups, status)
- Pitch deck management and versioning
- Data room preparation and maintenance
- Narrative management (ensure consistent story across all materials)
- Due diligence preparation
- Term sheet analysis tools
- Competitive landscape tracking

**Materials Management:**
- Pitch deck (master + customized versions per investor type)
- One-pager / executive summary
- Financial model (pulled from Finance)
- Product demo / walkthrough
- Team bios and org chart
- IP portfolio summary (pulled from Legal)
- Market analysis
- Customer testimonials / case studies (verified by Legal)
- Press coverage compilation

**Agent Behavior:**
- Tracks investor meeting notes and generates follow-up actions
- Maintains pitch narrative consistency with latest company metrics
- Auto-updates data room when metrics change
- Generates customized pitch angles based on investor focus area
- Prepares pre-meeting briefs for each investor (their portfolio, interests, likely questions)
- Weekly: Reviews fundraising pipeline, suggests prioritization

**Connections:**
- READS FROM: Finance (metrics, projections), Legal (IP portfolio, compliance status), Content (traction metrics), Operations (KPIs), Email (list growth as traction proof)
- WRITES TO: Operations (fundraising status), Content (narrative to amplify publicly)

---

### 7. STRATEGY / BILL CAMPBELL COACH (The Brain)

**Role:** Executive coaching and strategic oversight. Looks at the entire system and provides the kind of guidance a world-class board advisor would give. Based on "Trillion Dollar Coach" principles.

**Core Functions:**
- Weekly strategic review of all department briefs
- Tension identification (where are departments pulling in different directions?)
- Priority recommendation (what should the CEO focus on this week?)
- Decision framework assistance (for major strategic choices)
- Team health monitoring (workload, burnout signals, morale)
- Accountability tracking (are commitments being met?)

**Coaching Framework (Bill Campbell Principles):**
- "Start with the team" — are the right people in the right roles?
- "First principles" — what does the data actually say vs. what do we assume?
- "Disagree and commit" — help identify when to stop debating and execute
- "Radical candor" — surface uncomfortable truths the CEO needs to hear

**Operating Philosophy (Dan Sullivan / Strategic Coach Principles):**

These principles are non-negotiable and apply to ALL agents across the Command Center, every recommendation, every brief, every output. Bill Campbell + Dan Sullivan together form the philosophical foundation of how the entire system thinks.

1. **MULTIPLIER THINKING:** Before making any recommendation, ask "is this a 2x move or a 10x move?" Label every recommendation. Always surface the highest-leverage action first. One action that creates results across multiple departments is worth more than five single-department optimizations.
2. **10x vs 2x:** We are building for 10x, not incremental improvement. If an agent's recommendation would produce marginal gains, it should say so and suggest what the 10x alternative might be, even if it's harder or scarier. Every quarter, force the question: what 80% should we DROP to focus on the 20% that creates 10x?
3. **THE GAIN, NOT THE GAP:** All progress reporting measures from where we started, not from the target. Show both the target AND the gain, but lead with the gain. This applies to every KPI, every weekly brief, every dashboard metric.
4. **UNIQUE ABILITY PROTECTION:** The CEO's unique ability is vision, science, relationships, and storytelling (she did 120 podcasts in 4 months). Any task that doesn't require her unique ability should be handled by the system. Agents should actively flag when the CEO is being pulled into non-unique-ability work and recommend delegation.
5. **WHO NOT HOW — AND WHO IS THE BEST:** The agents ARE the "who" for execution. But agents should also be identifying the BEST possible external "who" for strategic needs — not just anyone, the absolute best person. Map paths to those people through the CEO's existing network and relationships.
6. **CROSS-DEPARTMENT MULTIPLIERS:** Every weekly brief must include a "Multiplier Opportunities" section identifying actions that would create cascading positive effects across 2+ departments. The Strategy/Coaching agent specifically looks for these.

**Agent Behavior:**
- Weekly: Reads all department briefs, generates "CEO Weekly Brief" with:
  - Top 3 things going well (with evidence)
  - Top 3 risks or concerns (with evidence)
  - 1 uncomfortable truth the CEO needs to hear
  - Recommended priority for the week
  - Questions the CEO should be asking
- Before major decisions: Generates decision brief with options, tradeoffs, and recommendation
- Monthly: Generates strategic review comparing actual progress vs. plan

**Connections:**
- READS FROM: All departments (everything)
- WRITES TO: Operations (strategic directives), CEO directly (weekly brief)

---

## The Briefing System (How Departments Stay Connected)

### Weekly Cycle:

**Monday AM:** Each department agent generates its weekly brief (structured format):
```
Department: [Name]
Week of: [Date]
Status: [Green/Yellow/Red]

Key Metrics:
- [metric]: [value] ([trend])

Accomplishments:
- [what got done]

Blockers:
- [what's stuck and why]

Flags for Other Departments:
- [department]: [what they need to know]

Requests:
- [what this department needs from others]

Next Week Priorities:
- [what's planned]
```

**Monday Midday:** Operations agent aggregates all briefs into "State of Conceivable"

**Monday PM:** Strategy/Bill Campbell agent reads everything, generates CEO Weekly Brief

**Tuesday:** CEO reviews, makes decisions, sets priorities for the week

**Throughout Week:** Departments execute, agents monitor and flag real-time issues

**Friday:** Departments log accomplishments and blockers for Monday brief generation

### Real-Time Alerts (Don't Wait for Monday):

- Legal flags content with compliance issues → blocks publishing immediately
- Finance flags unusual spending → alerts Operations same day
- Content generates piece with health claim → routes to Legal before publishing
- Fundraising gets investor meeting → alerts all departments to prepare metrics

---

## Database Schema (Prisma)

```prisma
model Department {
  id          String   @id @default(cuid())
  name        String   @unique
  status      String   @default("green") // green, yellow, red
  briefs      Brief[]
  tasks       Task[]
  metrics     Metric[]
  alerts      Alert[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Brief {
  id           String     @id @default(cuid())
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  weekOf       DateTime
  status       String
  content      Json       // structured brief content
  createdAt    DateTime   @default(now())
}

model Task {
  id           String     @id @default(cuid())
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  title        String
  description  String?
  status       String     @default("pending") // pending, in_progress, done, blocked
  priority     String     @default("medium")  // low, medium, high, critical
  assignee     String?
  dueDate      DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Metric {
  id           String     @id @default(cuid())
  departmentId String
  department   Department @relation(fields: [departmentId], references: [id])
  name         String
  value        Float
  target       Float?
  trend        String?    // up, down, flat
  recordedAt   DateTime   @default(now())
}

model Alert {
  id              String     @id @default(cuid())
  sourceDeptId    String
  sourceDept      Department @relation(fields: [sourceDeptId], references: [id])
  targetDeptIds   String[]   // departments that need to see this
  type            String     // compliance_flag, budget_alert, deadline, cross_dept
  severity        String     // info, warning, critical
  title           String
  description     String
  resolved        Boolean    @default(false)
  createdAt       DateTime   @default(now())
  resolvedAt      DateTime?
}

model Email {
  id          String   @id @default(cuid())
  week        Int
  sequence    Int
  subject     String
  preview     String
  body        String   @db.Text
  status      String   @default("pending") // pending, approved, published
  mailchimpId String?
  approvedAt  DateTime?
  publishedAt DateTime?
  metrics     Json?    // open rate, click rate, etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Content {
  id           String   @id @default(cuid())
  type         String   // social_post, carousel, video_clip, thread, blog, email_segment
  platform     String   // instagram, tiktok, linkedin, x, youtube, blog
  sourceType   String   // podcast, research, email, original
  sourceRef    String?  // reference to source material
  title        String
  body         String   @db.Text
  status       String   @default("draft") // draft, legal_review, approved, scheduled, published
  scheduledFor DateTime?
  publishedAt  DateTime?
  metrics      Json?    // platform-specific engagement metrics
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Patent {
  id             String   @id @default(cuid())
  title          String
  type           String   // utility, provisional, continuation
  status         String   // filed, pending, granted, expired
  filingDate     DateTime?
  expirationDate DateTime?
  patentNumber   String?
  claims         Json?    // key claims summary
  notes          String?  @db.Text
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Investor {
  id           String   @id @default(cuid())
  name         String
  firm         String?
  type         String   // angel, seed, series_a, strategic
  status       String   @default("prospect") // prospect, contacted, meeting, due_diligence, term_sheet, closed, passed
  notes        String?  @db.Text
  lastContact  DateTime?
  nextAction   String?
  nextActionDate DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ComplianceClaim {
  id          String   @id @default(cuid())
  claim       String   // the specific claim text
  category    String   // efficacy, safety, testimonial, comparison
  status      String   // approved, restricted, prohibited
  citation    String?  // supporting evidence
  disclaimer  String?  // required disclaimer text
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Page Structure (Next.js App Router)

```
src/app/
├── page.tsx                     # Main dashboard (Operations view)
├── layout.tsx                   # Shared layout with department navigation
├── departments/
│   ├── email/
│   │   ├── page.tsx             # Email strategy overview
│   │   ├── [id]/page.tsx        # Individual email view/edit
│   │   └── analytics/page.tsx   # Email performance
│   ├── content/
│   │   ├── page.tsx             # Content engine dashboard
│   │   ├── calendar/page.tsx    # Content calendar
│   │   ├── library/page.tsx     # Source material library
│   │   └── generate/page.tsx    # AI content generation
│   ├── legal/
│   │   ├── page.tsx             # Legal department overview
│   │   ├── patents/page.tsx     # Patent portfolio
│   │   ├── compliance/page.tsx  # Compliance dashboard
│   │   └── claims/page.tsx      # Approved claims database
│   ├── finance/
│   │   └── page.tsx             # Finance integration dashboard
│   ├── fundraising/
│   │   ├── page.tsx             # Fundraising overview
│   │   ├── investors/page.tsx   # Investor CRM
│   │   ├── materials/page.tsx   # Pitch materials
│   │   └── dataroom/page.tsx    # Data room management
│   └── strategy/
│       ├── page.tsx             # Strategy/coaching dashboard
│       └── weekly/page.tsx      # CEO weekly brief
├── api/
│   ├── agents/
│   │   ├── [department]/route.ts  # Department agent endpoints
│   │   └── briefing/route.ts      # Briefing system endpoints
│   ├── emails/route.ts
│   ├── content/route.ts
│   ├── mailchimp/route.ts
│   └── compliance/route.ts
└── components/
    ├── DepartmentNav.tsx
    ├── KPICard.tsx
    ├── BriefCard.tsx
    ├── AlertBanner.tsx
    ├── StatusIndicator.tsx
    └── ConnectionGraph.tsx      # Visualizes cross-department connections
```

---

## Agent System Design

Each department agent is a Claude API call with a structured system prompt. The key to keeping token usage sane:

### Agent Prompt Structure:
```
ROLE: You are the [Department] agent for Conceivable.
COMPANY CONTEXT: [2-3 paragraph company summary — same for all agents]
DEPARTMENT MISSION: [Specific to this department]
CURRENT PRIORITIES: [Pulled from Operations weekly brief]
CONSTRAINTS: [From Legal — what you can/cannot say or do]
SIBLING BRIEFS: [Structured summaries from other departments — NOT raw data]
TASK: [Specific task being requested]
```

### Token Management Rules:
1. Company context is a SHARED constant (not regenerated per call)
2. Sibling department briefs are SUMMARIES (max 200 words each), not full data
3. Each agent call is SCOPED to a specific task, not "do everything"
4. Historical data is queried from the database, not passed in context
5. Long-form content generation is done in separate calls from analysis

### Agent Endpoints:
- `POST /api/agents/[department]` — Run a specific task for a department
- `POST /api/agents/briefing` — Generate weekly briefs for all departments
- `GET /api/agents/[department]/brief` — Get latest brief for a department

---

## Integration Points (External Services)

| Service | Purpose | Status |
|---------|---------|--------|
| Mailchimp | Email publishing and analytics | TO BUILD |
| Anthropic Claude API | AI agent operations | READY |
| Vercel Postgres | Database | TO SET UP |
| GitHub | Source control, auto-deploy | CONNECTED |
| Finance Tool (COO) | Revenue, COGS, investor updates | PENDING INFO |
| Meeting Transcription (COO) | Exec meeting → action items | PENDING INFO |
| Gmail | Team communications monitoring | TO BUILD |
| Slack | Internal comms integration | TO BUILD |
| Telegram | Communications channel | TO BUILD |
| Facebook / Meta | Social publishing + analytics | TO BUILD |
| Instagram | Social publishing + analytics | TO BUILD |
| TikTok | Social publishing + analytics | TO BUILD |
| LinkedIn | Social publishing + analytics | TO BUILD |
| X (Twitter) | Social publishing + analytics | TO BUILD |
| YouTube | Video publishing + analytics | TO BUILD |
| Google Gemini | Notes and research integration | TO BUILD |
| Google Patents API | IP landscape monitoring | TO BUILD |

---

## Patent & IP Strategy (Legal Department Priority)

### Currently Protected:
1. **Data Aggregation + Scoring Architecture** — CON Score system, input → scoring → recommendations → tracking
2. **Temperature + Hormone Interpretation** — BBT beyond ovulation timing, pattern identification, hormonal implications (US20160140314A1)
3. **Personalized Recommendation Engine** — Meal plans, AI therapy, behavioral feedback, progress tracking
4. **System-Level Platform** — Computing device, sensors, memory, interface claims

### Protection Gaps (PRIORITY FILINGS):

**FILING #1 (CRITICAL — File before fundraise):**
Closed-Loop Physiologic Correction + Adaptive Escalation Architecture
- Measuring physiologic response to intervention
- Determining whether intervention corrected the underlying driver
- Escalating or modifying protocol based on response failure
- Intervention tier progression
- Algorithmic branching based on response thresholds
This is the company's deepest moat. File as strategic provisional ASAP.

**FILING #2 (HIGH PRIORITY):**
Pregnancy Outcome Risk Prediction + Mitigation Layer
- Predictive analytics for adverse birth events
- Monitoring early pregnancy signals
- Predicting adverse pregnancy outcomes (preeclampsia, preterm birth)
- Deploying corrective interventions post-conception
- Verifying pregnancy stability
This is both a patent opportunity AND the predictive analytics tool Kirsten is building.

**FILING #3 (MEDIUM PRIORITY):**
Driver Attribution Hierarchy + Multimodal Weighted Causality
- Identifying causal drivers behind fertility impairment
- Ranking drivers and mapping driver → specific intervention ladder
- Weighted cross-signal inference
- Conflict resolution between signals
- Signal hierarchy modeling

### Legal Agent Weekly Patent Tasks:
- Monitor competitor filings (especially Oura, Natural Cycles, Ava)
- Track provisional filing deadlines (30/60/90 day alerts)
- Research prior art for pending filings
- Generate filing opportunity recommendations
- Coordinate with patent attorney

---

## Build Sequence (Recommended)

### Phase 1: Foundation (Week 1)
- Clean up existing repo (merge branch to main, remove dead code)
- Set up Prisma database schema
- Build shared layout with department navigation
- Migrate existing 23 emails into database
- Build Operations dashboard skeleton

### Phase 2: Email Department — Complete (Week 2)
- Email management UI (view, edit, approve workflow)
- Mailchimp integration (API connection, publish pipeline)
- Basic email analytics dashboard
- Legal review flag system for email content

### Phase 3: Content Engine (Week 3-4)
- Source material library (upload and organize transcripts)
- AI content generation pipeline
- Content calendar with scheduling
- Multi-platform publishing queue
- Brand voice check system
- Legal auto-review integration

### Phase 4: Legal/IP/Compliance (Week 4-5)
- Patent portfolio tracker
- Approved claims database
- Content compliance auto-scanner
- Regulatory tracking dashboard
- Integration with Content and Email departments

### Phase 5: Fundraising (Week 5-6)
- Investor CRM
- Pitch materials management
- Data room builder
- Financial metrics integration (from Finance)

### Phase 6: Finance Integration + Strategy (Week 6-7)
- Connect COO's finance tool
- Strategy/Bill Campbell coaching module
- CEO weekly brief automation

### Phase 7: The Nervous System (Week 7-8)
- Weekly briefing automation
- Cross-department alert system
- Connection visualization (the "nothing is an island" view)
- Real-time dashboard with all departments connected

---

## The Investor Story

"We built an AI-powered operating system that runs our entire company. Seven departments, each with an AI agent that understands our mission, our constraints, and our goals. These agents don't work in silos — they share intelligence through a structured briefing system that mirrors how our product works: everything is connected, nothing is an island.

Our Content Engine produces 100 pieces of daily content from 1,200+ hours of founder podcast appearances. Our Legal agent auto-reviews every piece before publishing. Our Finance agent tracks every dollar to its COGS. Our Strategy agent reads everything and tells the CEO what she needs to hear, not what she wants to hear.

The result: a team of fewer than 10 running operations that would typically require 50+. That's not a pitch — that's our actual operating model, and this command center is the proof."

---

## Claude Code Instructions

When building from this architecture, follow these principles:

1. **Build one department at a time.** Don't try to scaffold everything at once.
2. **Database first.** Set up Prisma schema and migrations before building UI.
3. **Shared components early.** Build the layout, navigation, and shared components in Phase 1.
4. **API routes are thin.** They call the agent with structured prompts. Business logic lives in the agent prompts, not in code.
5. **Keep agent context small.** Use the token management rules above. Query the database for specifics, don't pass everything in context.
6. **Mobile-responsive from day one.** The CEO will check this from her phone.
7. **Brand-aligned design.** Use Conceivable brand colors and typography. Reference the brand book.
8. **Test with real data.** Migrate the 23 existing emails as the first real data in the system.
