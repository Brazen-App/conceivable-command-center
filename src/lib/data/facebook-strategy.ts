// ────────────────────────────────────────────────────────────
// Facebook Group Outreach Strategy — Data & Types
// Target: 50 fertility-focused Facebook groups for organic reach
// ────────────────────────────────────────────────────────────

export type GroupCategory =
  | "ttc"
  | "ivf_support"
  | "fertility_over_35"
  | "pcos"
  | "unexplained_infertility"
  | "miscarriage_support"
  | "natural_fertility"
  | "iui_support";

export type OutreachStatus =
  | "not_contacted"
  | "outreach_sent"
  | "live_scheduled"
  | "active";

export type ActivityLevel = "high" | "medium" | "low";

export interface FacebookGroup {
  id: string;
  name: string;
  estimatedMembers: number;
  category: GroupCategory;
  activityLevel: ActivityLevel;
  allowsExpertContent: boolean;
  outreachStatus: OutreachStatus;
  adminContactName?: string;
  notes?: string;
}

export const CATEGORY_CONFIG: Record<
  GroupCategory,
  { label: string; color: string; emoji: string }
> = {
  ttc: { label: "Trying to Conceive", color: "#5A6FFF", emoji: "🤞" },
  ivf_support: { label: "IVF Support", color: "#9686B9", emoji: "💉" },
  fertility_over_35: { label: "Fertility Over 35", color: "#E37FB1", emoji: "🌸" },
  pcos: { label: "PCOS", color: "#78C3BF", emoji: "🦋" },
  unexplained_infertility: { label: "Unexplained Infertility", color: "#356FB6", emoji: "❓" },
  miscarriage_support: { label: "Miscarriage Support", color: "#E24D47", emoji: "🕊️" },
  natural_fertility: { label: "Natural Fertility", color: "#1EAA55", emoji: "🌿" },
  iui_support: { label: "IUI Support", color: "#F1C028", emoji: "✨" },
};

export const OUTREACH_STATUS_CONFIG: Record<
  OutreachStatus,
  { label: string; color: string }
> = {
  not_contacted: { label: "Not Contacted", color: "#ACB7FF" },
  outreach_sent: { label: "Outreach Sent", color: "#F1C028" },
  live_scheduled: { label: "Live Scheduled", color: "#356FB6" },
  active: { label: "Active", color: "#1EAA55" },
};

// ── 50 Target Facebook Groups ──

export const FACEBOOK_GROUPS: FacebookGroup[] = [
  // TTC Groups
  { id: "fb-001", name: "Trying to Conceive (TTC) Support Group", estimatedMembers: 185000, category: "ttc", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-002", name: "TTC After 30", estimatedMembers: 92000, category: "ttc", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-003", name: "TTC Journey — Community & Support", estimatedMembers: 67000, category: "ttc", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-004", name: "Trying to Conceive — Positive Vibes Only", estimatedMembers: 45000, category: "ttc", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-005", name: "TTC with Science & Hope", estimatedMembers: 38000, category: "ttc", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-006", name: "TTC Warriors", estimatedMembers: 31000, category: "ttc", activityLevel: "medium", allowsExpertContent: false, outreachStatus: "not_contacted" },
  { id: "fb-007", name: "Two Week Wait Support", estimatedMembers: 28000, category: "ttc", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // IVF Support Groups
  { id: "fb-008", name: "IVF Support Group", estimatedMembers: 156000, category: "ivf_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-009", name: "IVF Warriors — Strength in Numbers", estimatedMembers: 98000, category: "ivf_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-010", name: "IVF & Fertility Treatment Support", estimatedMembers: 72000, category: "ivf_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-011", name: "IVF Over 40", estimatedMembers: 41000, category: "ivf_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-012", name: "First Time IVF — What to Expect", estimatedMembers: 35000, category: "ivf_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-013", name: "IVF Nutrition & Lifestyle", estimatedMembers: 22000, category: "ivf_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // Fertility Over 35
  { id: "fb-014", name: "Fertility After 35 — You're Not Too Late", estimatedMembers: 134000, category: "fertility_over_35", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-015", name: "TTC Over 35 Support", estimatedMembers: 88000, category: "fertility_over_35", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-016", name: "Pregnant After 35 — Hope & Support", estimatedMembers: 76000, category: "fertility_over_35", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-017", name: "Advanced Maternal Age TTC", estimatedMembers: 52000, category: "fertility_over_35", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-018", name: "40+ and TTC", estimatedMembers: 44000, category: "fertility_over_35", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-019", name: "Egg Quality Over 35", estimatedMembers: 29000, category: "fertility_over_35", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // PCOS Groups
  { id: "fb-020", name: "PCOS Support Group", estimatedMembers: 210000, category: "pcos", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-021", name: "PCOS & Fertility — Getting Pregnant with PCOS", estimatedMembers: 145000, category: "pcos", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-022", name: "PCOS Diet & Lifestyle", estimatedMembers: 112000, category: "pcos", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-023", name: "PCOS Warriors — TTC Edition", estimatedMembers: 67000, category: "pcos", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-024", name: "PCOS Natural Solutions", estimatedMembers: 48000, category: "pcos", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-025", name: "PCOS & Supplements — What Actually Works", estimatedMembers: 33000, category: "pcos", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-026", name: "Lean PCOS & Fertility", estimatedMembers: 19000, category: "pcos", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // Unexplained Infertility
  { id: "fb-027", name: "Unexplained Infertility Support", estimatedMembers: 78000, category: "unexplained_infertility", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-028", name: "Unexplained Infertility — Finding Answers", estimatedMembers: 52000, category: "unexplained_infertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-029", name: "When the Doctors Say Everything Looks Fine", estimatedMembers: 41000, category: "unexplained_infertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-030", name: "Unexplained Infertility — Holistic Approaches", estimatedMembers: 26000, category: "unexplained_infertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-031", name: "Infertility & Functional Medicine", estimatedMembers: 18000, category: "unexplained_infertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // Miscarriage Support
  { id: "fb-032", name: "Miscarriage Support & TTC Again", estimatedMembers: 120000, category: "miscarriage_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-033", name: "Recurrent Pregnancy Loss Support", estimatedMembers: 65000, category: "miscarriage_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-034", name: "Rainbow Baby Hopefuls", estimatedMembers: 89000, category: "miscarriage_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-035", name: "TTC After Loss — A Gentle Space", estimatedMembers: 42000, category: "miscarriage_support", activityLevel: "medium", allowsExpertContent: false, outreachStatus: "not_contacted" },
  { id: "fb-036", name: "Chemical Pregnancy & Early Loss Support", estimatedMembers: 27000, category: "miscarriage_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-037", name: "Pregnancy After Miscarriage", estimatedMembers: 55000, category: "miscarriage_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // Natural Fertility
  { id: "fb-038", name: "Natural Fertility & Conception", estimatedMembers: 95000, category: "natural_fertility", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-039", name: "Fertility Diet & Supplements", estimatedMembers: 73000, category: "natural_fertility", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-040", name: "Cycle Charting & Fertility Awareness", estimatedMembers: 58000, category: "natural_fertility", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-041", name: "Functional Medicine for Fertility", estimatedMembers: 34000, category: "natural_fertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-042", name: "Seed Cycling & Hormone Balance", estimatedMembers: 47000, category: "natural_fertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-043", name: "Fertility Yoga & Mind-Body Connection", estimatedMembers: 21000, category: "natural_fertility", activityLevel: "low", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-044", name: "Traditional Chinese Medicine & Fertility", estimatedMembers: 26000, category: "natural_fertility", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },

  // IUI Support
  { id: "fb-045", name: "IUI Support Group", estimatedMembers: 62000, category: "iui_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-046", name: "IUI Success Stories & Support", estimatedMembers: 44000, category: "iui_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-047", name: "Medicated Cycles & IUI — What to Expect", estimatedMembers: 31000, category: "iui_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-048", name: "IUI to IVF — Deciding When to Move On", estimatedMembers: 22000, category: "iui_support", activityLevel: "medium", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-049", name: "Clomid & Letrozole Support for TTC", estimatedMembers: 38000, category: "iui_support", activityLevel: "high", allowsExpertContent: true, outreachStatus: "not_contacted" },
  { id: "fb-050", name: "IUI First Timers — Tips & Support", estimatedMembers: 15000, category: "iui_support", activityLevel: "low", allowsExpertContent: true, outreachStatus: "not_contacted" },
];

// ── Outreach Approaches ──

export interface OutreachApproach {
  id: string;
  name: string;
  description: string;
  steps: string[];
  bestFor: GroupCategory[];
  expectedConversionRate: string;
}

export const OUTREACH_APPROACHES: OutreachApproach[] = [
  {
    id: "approach-1",
    name: "Expert AMA / Facebook Live",
    description:
      "Reach out to group admins and offer a free, no-pitch AMA or Facebook Live where Kirsten answers fertility questions for 30-45 minutes. This builds trust, positions Kirsten as the go-to expert, and creates a natural CTA for the app waitlist.",
    steps: [
      "Identify groups with 30K+ members and high activity",
      "Send admin outreach message (warm, value-first)",
      "Schedule 30-45 minute AMA / Facebook Live",
      "Prepare 5-7 seed questions to kick things off",
      "During the live: share 1-2 genuinely surprising fertility insights",
      "End with soft CTA: 'If you want to keep learning, we have a free fertility score at conceivable.com'",
      "Follow up in comments for 24 hours after the event",
    ],
    bestFor: ["ttc", "pcos", "fertility_over_35", "natural_fertility"],
    expectedConversionRate: "3-5% of live attendees sign up",
  },
  {
    id: "approach-2",
    name: "Value-First Weekly Posts",
    description:
      "Get approval from admins to post once per week with genuinely helpful fertility content. No pitching. Just science-backed tips that make people think 'where has this person been all my life?' After 3-4 weeks of trust-building, soft-mention the Conceivable Score.",
    steps: [
      "Get admin approval to post as a fertility expert (not as a brand)",
      "Week 1: Post about a commonly misunderstood fertility myth",
      "Week 2: Share a specific, actionable supplement/lifestyle tip",
      "Week 3: Answer the group's most-asked question with depth",
      "Week 4: Share a personal story + mention the free Conceivable Score",
      "Respond to every single comment genuinely",
      "Track engagement and signups from each group",
    ],
    bestFor: ["unexplained_infertility", "miscarriage_support", "iui_support", "ivf_support"],
    expectedConversionRate: "1-2% of post viewers over 4-week cycle",
  },
  {
    id: "approach-3",
    name: "Admin Partnership & Exclusive Access",
    description:
      "Partner directly with group admins. Offer them early access to the app, personalized supplement packs, and a referral code that gives their members a founding member discount. Admins become organic advocates.",
    steps: [
      "Identify the most engaged/trusted group admins",
      "Send personalized outreach: offer free Conceivable access + personalized supplement packs",
      "Give them a unique referral link with founding member pricing for their community",
      "Provide them with a 'Group Admin Kit' — content they can share, graphics, Q&A guides",
      "Monthly check-in call with admin to maintain relationship",
      "Feature top-performing admin groups in our community spotlight",
    ],
    bestFor: ["ttc", "pcos", "fertility_over_35", "ivf_support", "natural_fertility"],
    expectedConversionRate: "5-8% of group members exposed to admin recommendation",
  },
];

// ── Admin Outreach Templates ──

export interface MessageTemplate {
  id: string;
  label: string;
  subject?: string;
  body: string;
  useCase: string;
}

export const ADMIN_OUTREACH_TEMPLATES: MessageTemplate[] = [
  {
    id: "admin-intro",
    label: "Initial Admin Outreach",
    subject: "Quick question about [Group Name]",
    body: `Hi [Admin Name],

I'm Kirsten Karchmer — I'm a board-certified reproductive endocrinologist and acupuncturist who has spent the last 20 years helping women optimize their fertility. I've been on about 120 podcasts talking about this stuff (it's kind of my whole life).

I came across [Group Name] and I'm genuinely impressed by the community you've built. The conversations in there are exactly the kind of support women need on this journey.

I'd love to contribute to your group — not as a brand, not to sell anything — but as someone who has real, science-backed answers to the questions your members ask every day. I'm talking about the stuff most REs don't have time to explain.

Would you be open to me doing a free AMA or Facebook Live for your members? No pitch, no product placement — just real fertility science made accessible.

Either way, thank you for creating this space. It matters more than you know.

Warmly,
Kirsten`,
    useCase: "First contact with group admins to propose expert content",
  },
  {
    id: "admin-followup",
    label: "Admin Follow-Up (After Interest)",
    subject: "Re: AMA for [Group Name]",
    body: `Hi [Admin Name],

So excited you're open to this! Here's what I'm thinking:

For the AMA/Live, I can cover any of these topics (or whatever your members are most curious about):
- The 3 things most women get wrong about their fertile window
- Why your supplements might be working against you (and what to take instead)
- The real science behind egg quality after 35
- What your cycle is actually telling you about your fertility

I usually do 30-45 minutes, and I stick around in the comments afterward to answer anything I didn't get to.

Logistics-wise, I'm flexible on timing — evenings tend to get the best turnout. Would any day in the next 2-3 weeks work for your group?

And if there's anything specific your members have been asking about that you'd love me to address, just let me know. I want this to be exactly what they need.

Talk soon,
Kirsten`,
    useCase: "Scheduling details after admin expresses interest",
  },
  {
    id: "admin-partnership",
    label: "Admin Partnership Proposal",
    subject: "Something special for [Group Name] members",
    body: `Hi [Admin Name],

I wanted to share something with you first, before we announce it publicly.

We're launching Conceivable — an app that gives women a personalized fertility score based on their actual health data, plus AI coaching and custom supplement packs. It's basically everything I wish I could give every patient who walks into my clinic, but scaled with technology.

We're only opening 500 founding member spots, and I'd love to offer your community early access + a special rate.

Here's what I'm thinking:
- You get full free access to the app + personalized supplement packs (on us)
- Your members get a unique link with founding member pricing
- I'll do a dedicated AMA for your group about the science behind it
- You'd earn a referral credit for every member who signs up

No pressure at all — I just thought of your group first because the conversations there are exactly the women who would benefit most from this.

Want to hop on a quick call this week to chat about it?

Kirsten`,
    useCase: "Proposing a deeper partnership with engaged admin",
  },
];

// ── Kirsten's Response Templates for Common Questions ──

export const RESPONSE_TEMPLATES: MessageTemplate[] = [
  {
    id: "resp-supplements",
    label: "Supplement Recommendations",
    body: `Great question! This is one of the things I'm most passionate about because there's SO much confusion out there.

Here's the thing — most prenatal vitamins are using the wrong forms of key nutrients. If your prenatal has folic acid instead of methylfolate, cyanocobalamin instead of methylcobalamin, or cheap magnesium oxide instead of glycinate... it might be doing less than you think.

The basics I recommend for most women TTC:
- Methylfolate (not folic acid) — 800mcg minimum
- CoQ10 (ubiquinol form) — 200-600mg for egg quality
- Vitamin D3 — get your levels tested, most women are deficient
- Omega-3 (EPA/DHA) — at least 1000mg combined
- Magnesium glycinate — 200-400mg

But here's the real truth: the "right" supplements depend entirely on YOUR body. What's optimal for someone with PCOS is totally different from someone with unexplained infertility or diminished ovarian reserve.

(This is actually why we built Conceivable — to give every woman a personalized protocol instead of a one-size-fits-all prenatal. But that's a whole other conversation!)

Happy to answer more specific questions if you want to share more about your situation.`,
    useCase: "When someone asks about supplements for fertility",
  },
  {
    id: "resp-egg-quality",
    label: "Egg Quality After 35",
    body: `I love this question because there's actually way more hope here than most people realize.

Yes, egg quality does decline with age. That's biology. But here's what your RE probably didn't tell you: egg quality is modifiable. It takes about 90 days for an egg to go from dormant to ovulation-ready, and during that window, you can genuinely influence the outcome.

The science on this is really clear:
1. CoQ10 supports mitochondrial function in eggs (the powerhouse matters!)
2. Reducing oxidative stress through diet and targeted antioxidants makes a measurable difference
3. Blood sugar regulation directly impacts egg quality — even in women without diabetes
4. Sleep quality affects hormonal cascades that impact egg development

I've seen women at 38, 39, 40+ dramatically improve their outcomes by addressing these factors during that 90-day window. It's not magic — it's biology working in your favor when you give it the right inputs.

The key is knowing YOUR specific situation. A woman with great AMH but poor sleep has a totally different optimization path than a woman with low AMH but perfect nutrition.

What's your specific concern? Happy to get more granular.`,
    useCase: "When someone asks about egg quality or age-related fertility decline",
  },
  {
    id: "resp-unexplained",
    label: "Unexplained Infertility",
    body: `Unexplained infertility is honestly one of the most frustrating diagnoses — and I say that as someone who has worked with thousands of women in this exact situation.

Here's what "unexplained" usually means: the standard fertility workup (HSG, bloodwork, SA) came back normal, and your doctor doesn't have an explanation. But that doesn't mean there IS no explanation.

The standard workup only tests maybe 10% of the factors that influence fertility. It doesn't look at:
- Chronic low-grade inflammation
- Micronutrient deficiencies (beyond the basics)
- Sleep and circadian rhythm disruption
- Blood sugar regulation and insulin sensitivity
- Gut health and nutrient absorption
- Thyroid optimization (not just "in range" but optimal)
- Stress hormones and HPA axis function
- Environmental toxin exposure

In my 20 years of practice, I've found that "unexplained" almost always becomes "explained" when you look at the whole picture. The body is a system — everything is connected.

I'm not saying this to dismiss what you're going through. The waiting and not knowing is genuinely awful. But there ARE things you can investigate and optimize while you figure out next steps.

What has your workup included so far? I might be able to point you toward some things worth exploring.`,
    useCase: "When someone shares unexplained infertility frustration",
  },
  {
    id: "resp-tww",
    label: "Two Week Wait Anxiety",
    body: `The two week wait is genuinely one of the hardest parts of this whole journey. And anyone who tells you to "just relax" can... well, let's just say they've clearly never been through it.

Here's what I want you to know from a science perspective: by the time you're in the TWW, the egg quality and ovulation part is done. You can't mess this up by being stressed or eating the wrong thing or not lying with your legs up long enough (that's a myth, by the way).

What IS happening during the TWW:
- Days 1-6 after ovulation: the fertilized egg is traveling to the uterus
- Days 6-10: implantation happens (this is when some women feel cramping or see spotting)
- Days 10-14: hCG starts rising if implantation was successful

What you CAN do that actually helps:
- Keep taking your supplements (progesterone support if your doctor prescribed it)
- Stay hydrated
- Keep moving — gentle exercise is great
- Prioritize sleep (your body does its best repair work at night)

What won't help: symptom-spotting on Google at 2am. I know. I KNOW. But your future self will thank you for putting the phone down.

Sending you so much love during this wait. You're doing everything right.`,
    useCase: "When someone is anxious during the two week wait",
  },
  {
    id: "resp-ivf-prep",
    label: "IVF Cycle Preparation",
    body: `Preparing for IVF is one of the best things you can do for your outcome — and I wish more clinics emphasized this.

The 90-day window before your retrieval is when the eggs that will be collected are actively maturing. This is your optimization window. Here's what the research supports:

Supplements (check with your RE, but these have solid evidence):
- CoQ10 (ubiquinol) 400-600mg — mitochondrial support for egg quality
- DHEA 25mg 3x/day — IF your DHEA-S is low (get it tested first)
- Vitamin D3 — optimal levels are 40-60 ng/mL
- Omega-3 fatty acids — anti-inflammatory
- Melatonin 3mg at bedtime — antioxidant for the follicular environment

Lifestyle factors that move the needle:
- Mediterranean-style diet (tons of research backing this for IVF outcomes)
- 7-8 hours of sleep in a dark room
- Moderate exercise (not extreme — your body needs resources)
- Limit alcohol (ideally zero during the 90-day window)
- Reduce environmental toxins (clean beauty products, avoid BPA)

The most important thing: work WITH your RE, not around them. These supplements and lifestyle changes are meant to complement your protocol, not replace it.

What stage are you at? Happy to get more specific about timing and protocols.`,
    useCase: "When someone asks about preparing for IVF",
  },
];
