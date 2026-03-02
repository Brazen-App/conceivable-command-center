# CLAUDE.md — Project Instructions for Claude Code

## Project: Conceivable Command Center

### What This Is
An AI-powered operational command center for Conceivable, a fertility health company. This is a real production application — not a demo. It runs the company's daily operations across 7 departments with AI agents.

### Tech Stack
- Next.js 14+ (App Router) with TypeScript
- Prisma ORM with PostgreSQL
- Anthropic Claude API for AI agents
- Tailwind CSS for styling
- Deployed on Vercel (auto-deploy from `main` branch)

### Architecture
Read `ARCHITECTURE.md` in the repo root for the complete system design, database schema, department specifications, and build sequence. ALWAYS reference this file before making architectural decisions.

### Brand Guidelines (from official Conceivable Brand Book by Firmalt)

**Tagline:** "A Journey to Possibility"
**Purpose:** To transform the fertility experience from one of confusion and isolation into one of clarity, knowledge, and empowered action through advanced AI, holistic science, and human-centered care.

**Brand Voice Tone:**
- CALM: Never alarmist or clinical. Reassuring, steady, emotionally grounded.
- INTELLIGENT: Scientific sophistication without being cold. Clarity and confidence.
- EMPATHETIC: Deeply attuned to the emotional journey. Validating while guiding forward.
- EMPOWERING: Shifts from confusion to clarity, from powerlessness to action.
- Overall feel: "Like talking to the most emotionally intelligent doctor you've ever met, who also happens to understand your body better than anyone else ever has."

**Primary Colors:**
- Blue (Pantone 2130 C): #5A6FFF — Primary brand color
- Baby Blue (Pantone 2122 C): #ACB7FF — Primary accent
- Off White (Pantone 2437 C - 12%): #F9F7F0 — Primary background

**Secondary Colors:**
- Black (Pantone Black C): #2A2828
- Red (Pantone 7625 C): #E24D47
- Pink (Pantone 204 C): #E37FB1
- Yellow (Pantone 123 C): #F1C028
- Green (Pantone 7739 C - 90%): #1EAA55
- Pale Blue (Pantone 564 C): #78C3BF
- Navy Blue (Pantone 7683 C): #356FB6
- Purple (Pantone 2094 C - 90%): #9686B9

**Typography:**
- Display/Titles: "Youth" Bold, UPPERCASE
- Captions/Subtitles: "Rauschen A" Regular, UPPERCASE
- Body Text: "Inter" Regular, Sentence Case

**Icons:** Informative, not decorative. Black, 1pt outline for UI. Colored gradient icons for larger display areas (Energy, Blood, Hormones, HRV, VO2 Max, Blood Sugar, Sleep, Stress, Steps). Each colored icon uses 3 colors + off-white radial gradient.

**Gradients:** Inspired by different fertility journeys. Three variations: wobbly shapes, left-to-right, center-to-outside. Color combos: choose 3 adjacent colors from palette.

**Kai (AI Coach) Identity:** Has its own logo (line-art compass star in Blue #5A6FFF). Separate visual identity from Conceivable brand mark.

**Design Philosophy:** Clean, warm, connected. Nothing feels isolated. Visual connections between elements. The product's core thesis — everything is connected, nothing is an island — must be reflected in the UI.

### Agent Operating Philosophy (Strategic Coach / Dan Sullivan Framework)

Every agent in the Command Center operates on Dan Sullivan's Strategic Coach principles. These are non-negotiable and apply to every recommendation, every brief, every output:

1. **MULTIPLIER THINKING:** Before making any recommendation, ask "is this a 2x move or a 10x move?" Label every recommendation. Always surface the highest-leverage action first. One action that creates results across multiple departments is worth more than five single-department optimizations.

2. **10x vs 2x:** We are building for 10x, not incremental improvement. If an agent's recommendation would produce marginal gains, it should say so and suggest what the 10x alternative might be, even if it's harder or scarier. Every quarter, force the question: what 80% should we DROP to focus on the 20% that creates 10x?

3. **THE GAIN, NOT THE GAP:** All progress reporting measures from where we started, not from the target. Show both the target AND the gain, but lead with the gain. This applies to every KPI, every weekly brief, every dashboard metric.

4. **UNIQUE ABILITY PROTECTION:** The CEO's unique ability is vision, science, relationships, and storytelling (she did 120 podcasts in 4 months). Any task that doesn't require her unique ability should be handled by the system. Agents should actively flag when the CEO is being pulled into non-unique-ability work and recommend delegation.

5. **WHO NOT HOW — AND WHO IS THE BEST:** The agents ARE the "who" for execution. But agents should also be identifying the BEST possible external "who" for strategic needs — not just anyone, the absolute best person. Map paths to those people through the CEO's existing network and relationships.

6. **CROSS-DEPARTMENT MULTIPLIERS:** Every weekly brief must include a "Multiplier Opportunities" section identifying actions that would create cascading positive effects across 2+ departments. The Strategy/Coaching agent specifically looks for these.

### Key Principles
1. **Token efficiency:** Agent calls use structured prompts with shared company context, scoped tasks, and summary briefs from sibling departments. Never pass raw data dumps.
2. **Everything connected:** Departments share intelligence through structured briefs. Cross-department alerts fire in real-time for compliance and budget issues.
3. **Mobile-first:** The CEO checks this from her phone. Every view must be responsive.
4. **Compliance-aware:** This is a health product company. Legal/compliance constraints are non-negotiable. Content never publishes without compliance check.
5. **Incremental builds:** Build one department at a time, test it, then move on. Don't scaffold everything at once.

### Current State
- 23 launch emails exist in the Email Strategy module
- Operations dashboard has basic KPI cards
- Content Engine, Legal, Finance, Fundraising, Strategy departments are stubs
- Branch `claude/notion-integration-setup-spWHO` has the latest code (needs merge to main)

### Build Priority
Follow the Phase sequence in ARCHITECTURE.md:
1. Foundation (clean repo, database, shared layout)
2. Email Department (complete with Mailchimp)
3. Content Engine
4. Legal/IP/Compliance
5. Fundraising
6. Finance Integration + Strategy
7. The Nervous System (cross-department connections)

### Do NOT
- Generate content with health claims without routing through the compliance system
- Store API keys in code (use environment variables)
- Build monolithic agent calls that pass entire department states as context
- Skip the Legal review step in any content pipeline
- Use placeholder data that looks like real patient testimonials
- Publish ANYTHING (email, social, blog, ad) without automated compliance scan — this is a universal rule, not department-specific
