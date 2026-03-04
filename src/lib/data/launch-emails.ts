// 23 Launch Emails — 8-Week Early Access Sequence
// Target: 5,000 early access signups from ~29,000 cleaned, warming list
// Phases: Re-engagement → Education → Launch → Final Push → Post-Close

export interface LaunchEmail {
  id: string;
  week: number;
  sequence: number;
  phase: "re-engagement" | "education" | "launch" | "final-push" | "post-close";
  subject: string;
  preview: string;
  body: string;
  status: "pending" | "approved" | "published";
  segment: string;
  approvedAt: string | null;
  publishedAt: string | null;
  complianceStatus: "not_reviewed" | "in_review" | "approved" | "flagged";
  metrics: {
    openRate: number | null;
    clickRate: number | null;
    unsubscribeRate: number | null;
    signups: number | null;
  } | null;
}

export const PHASE_CONFIG = {
  "re-engagement": {
    label: "Re-engagement",
    weeks: "Week 1–2",
    color: "#78C3BF",
    description: "Warm the list. Remind them why they subscribed. Build anticipation.",
  },
  education: {
    label: "Education",
    weeks: "Week 3–4",
    color: "#5A6FFF",
    description: "Teach the framework. Establish scientific credibility. Create desire.",
  },
  launch: {
    label: "Launch",
    weeks: "Week 5–6",
    color: "#E37FB1",
    description: "Open early access. Drive signups. Social proof and urgency.",
  },
  "final-push": {
    label: "Final Push",
    weeks: "Week 7",
    color: "#E24D47",
    description: "Last chance. Deadline urgency. Founder letter. Close strong.",
  },
  "post-close": {
    label: "Post-Close",
    weeks: "Week 8",
    color: "#1EAA55",
    description: "Welcome new members. Set expectations. Begin the journey.",
  },
};

export const LAUNCH_EMAILS: LaunchEmail[] = [
  // ============================================================
  // PHASE 1: RE-ENGAGEMENT (Week 1–2) — 6 emails
  // ============================================================
  {
    id: "email-01",
    week: 1,
    sequence: 1,
    phase: "re-engagement",
    subject: "We've been quiet. Here's why.",
    preview: "We disappeared for a reason — and it's a good one.",
    body: `Hi *|FNAME|*,

You haven't heard from us in a while. That was intentional.

We've spent the last year heads-down building something we believe will fundamentally change how women understand their fertility. Not another tracking app. Not another ovulation predictor. Something deeper.

We've been working with reproductive endocrinologists, data scientists, and AI researchers to build a system that sees what traditional fertility care misses — the connections between your sleep, your hormones, your stress, your nutrition, and your fertility outcomes.

Over the next few weeks, we're going to share what we've built. And we're going to invite a small group to be the first to experience it.

If you're still on this journey, stay tuned. The next email will explain exactly what's coming.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — all 29K subscribers",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-02",
    week: 1,
    sequence: 2,
    phase: "re-engagement",
    subject: "Something is broken in fertility care",
    preview: "You already know this. Here's what we're doing about it.",
    body: `Hi *|FNAME|*,

Here's what most fertility care looks like today:

You get basic bloodwork. Maybe an ultrasound. Your doctor has 12 minutes to assess something as complex as your reproductive health. You leave with a prescription and a "let's see what happens."

Meanwhile, your body is sending hundreds of signals every day — through your temperature patterns, your sleep quality, your cycle variations, your stress response — and nobody is connecting the dots.

That's not your doctor's fault. They don't have the tools.

We built the tools.

Conceivable's system analyzes the signals your body is already sending and maps them to what the clinical research actually shows about fertility outcomes. Not guesswork. Not generic advice. A personalized picture of what's happening in YOUR body and what to do about it.

More on that in our next email. For now, we just wanted you to know: you're not imagining it. The system IS broken. And we're building the fix.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-03",
    week: 1,
    sequence: 3,
    phase: "re-engagement",
    subject: "What if your body was trying to tell you something?",
    preview: "The signals are there. You just need someone to translate them.",
    body: `Hi *|FNAME|*,

Every morning, your body tells a story through your temperature.

Not just "did I ovulate?" — that's the basic reading. The deeper story is in the patterns: the variability, the rise speed, the luteal phase stability, the relationship between your temperature and your sleep, your stress, your cycle length.

Most tools read chapter one and stop. We read the whole book.

When our founder Kirsten started Conceivable, she'd already spent years in the fertility space. She'd done 120 podcast interviews with the world's leading reproductive scientists. And she kept hearing the same thing: "We have the data. We just don't have the system to connect it all."

So she built the system.

Next week, we'll show you how the CON Score works — a single number that captures what all those signals mean together. It's unlike anything in fertility care today.

Stay with us.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — segment by engagement (high open rate priority)",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-04",
    week: 2,
    sequence: 1,
    phase: "re-engagement",
    subject: "The data your doctor isn't looking at",
    preview: "It's not their fault. They just don't have the tools yet.",
    body: `Hi *|FNAME|*,

Here's a question most fertility doctors don't ask:

"How's your sleep?"

Not because they don't care. Because they don't have a system that connects sleep disruption patterns to hormonal cascades to cycle regularity to fertility outcomes.

But the research is clear: sleep architecture directly impacts LH surge timing, progesterone production, and endometrial receptivity. Your Apple Watch is capturing data that's clinically relevant to your fertility — and nobody is reading it.

Until now.

Conceivable integrates data from wearables, cycle tracking, and lifestyle inputs to build a picture of your fertility health that goes far beyond what a single blood draw can show.

We're not replacing your doctor. We're giving both of you better information to work with.

Coming this week: how the CON Score synthesizes all of this into one actionable number.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-05",
    week: 2,
    sequence: 2,
    phase: "re-engagement",
    subject: "120 podcasts. One breakthrough.",
    preview: "Our founder talked to everyone. Then she built something new.",
    body: `Hi *|FNAME|*,

Over 4 months, Kirsten Karchmer did 120 podcast interviews.

Not as a guest — as a student. She talked to reproductive endocrinologists, naturopathic doctors, TCM practitioners, data scientists, sleep researchers, nutritionists, and women who'd been through every protocol imaginable.

The pattern she kept hearing: "We know what works. We just can't scale the personalization."

A doctor can spend hours with one patient and create a brilliant, personalized protocol. But they can't do that for thousands of women. The knowledge exists. The delivery system doesn't.

That's what AI changes.

Conceivable's AI doesn't replace clinical expertise — it scales it. It takes the decision frameworks that the best practitioners use and applies them to YOUR data, YOUR patterns, YOUR body.

The next email will introduce you to Kai, the AI coach at the heart of this system. You're going to want to meet her.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — priority to 2x+ openers",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-06",
    week: 2,
    sequence: 3,
    phase: "re-engagement",
    subject: "We built something. Want to see it first?",
    preview: "Early access opens in 3 weeks. Here's how to get in.",
    body: `Hi *|FNAME|*,

Quick update:

In 3 weeks, we're opening early access to Conceivable for a limited group.

We're capping it at 5,000 members for the initial launch. Not as a marketing tactic — because we want to ensure everyone who joins gets the full experience with real support.

Over the next few weeks, we'll walk you through:
• How the CON Score works (and what yours might look like)
• Meet Kai, your AI fertility coach
• The 7 drivers of fertility health our system tracks
• Real data showing how the system identifies patterns
• Exactly what happens when you join

You're on this list because you've already shown you care about this. When early access opens, you'll be the first to know.

No pressure. No gimmicks. Just a system we believe in, built for the people who need it most.

More coming soon.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — tease with forward-to-friend CTA",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },

  // ============================================================
  // PHASE 2: EDUCATION (Week 3–4) — 6 emails
  // ============================================================
  {
    id: "email-07",
    week: 3,
    sequence: 1,
    phase: "education",
    subject: "Your CON Score: the number that changes everything",
    preview: "One score that captures what dozens of tests miss.",
    body: `Hi *|FNAME|*,

Let's talk about the CON Score.

In traditional fertility care, you get individual data points: FSH levels, AMH, thyroid panel, cycle length. Each tells you something. None tells you the whole story.

The CON Score is different. It's a composite metric that weighs multiple physiological signals against each other — temperature patterns, cycle regularity, lifestyle factors, wearable data — and produces a single number that represents your overall fertility readiness.

Think of it like a credit score for your fertility health. It's not a diagnosis. It's a dynamic, personalized assessment that changes as your body changes.

Here's what makes it powerful:
• It tracks over time, so you can see the impact of interventions
• It identifies which specific drivers are holding your score back
• It recommends exactly what to address first for maximum impact
• It learns from your data and gets more precise over time

When early access opens, the first thing you'll see is your initial CON Score and a personalized breakdown of what's driving it.

Next: the 7 drivers behind the score.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers (opened 1+ of re-engagement)",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-08",
    week: 3,
    sequence: 2,
    phase: "education",
    subject: "Why temperature isn't just about ovulation",
    preview: "Your BBT data contains 10x more information than you're using.",
    body: `Hi *|FNAME|*,

Most apps use your basal body temperature (BBT) for one thing: confirming ovulation.

That's like using a telescope to look at your shoes.

Your temperature pattern contains vastly more information. The research shows that BBT data — when analyzed properly — can reveal:

• Progesterone sufficiency (or insufficiency) in the luteal phase
• Thyroid function patterns that standard blood tests miss in early stages
• Stress-cortisol interactions that affect implantation windows
• Sleep quality correlations with hormonal rhythmicity
• The speed and stability of your post-ovulatory rise (clinically significant, rarely tracked)

The problem isn't the data. It's that no one has built a system sophisticated enough to read it all.

Conceivable's AI analyzes your temperature data against these clinical patterns — and cross-references it with your other health signals to build a picture that single-variable tracking can't match.

This is just one of the 7 drivers. Coming next: the full framework.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-09",
    week: 3,
    sequence: 3,
    phase: "education",
    subject: "The closed-loop system your body needs",
    preview: "Measure. Intervene. Verify. Adjust. Repeat.",
    body: `Hi *|FNAME|*,

Here's the fundamental problem with most health interventions:

You try something. You wait. You hope.

There's no systematic way to know if the intervention actually corrected the underlying issue, or if your body needs something different.

We call our approach the Closed-Loop System:

1. MEASURE: Identify what's actually happening in your body through multi-signal analysis
2. INTERVENE: Recommend specific, evidence-based protocols targeting the root driver
3. VERIFY: Track whether the intervention produced the expected physiological response
4. ADJUST: If the response isn't what we expected, escalate or modify the protocol

This isn't a diet plan. It's not a supplement recommendation. It's a dynamic system that adapts to YOUR body's actual responses.

The AI doesn't guess. It measures, recommends, verifies, and adjusts — continuously.

This approach is so novel, we're filing patents on it. It represents a fundamental shift in how fertility interventions work.

Early access: 2 weeks away.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers — tech/science-forward segment",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-10",
    week: 4,
    sequence: 1,
    phase: "education",
    subject: "Meet Kai: your AI fertility coach",
    preview: "She's not a chatbot. She's a system that understands your body.",
    body: `Hi *|FNAME|*,

Kai is not a chatbot that Googles your symptoms.

Kai is the AI coach at the heart of Conceivable. She's built on a knowledge base of thousands of clinical studies, trained on reproductive endocrinology frameworks, and designed to understand the specific nuances of YOUR data.

What Kai does:

• Reads your daily inputs and wearable data to track your CON Score
• Identifies which of the 7 fertility drivers need attention right now
• Recommends specific protocols — nutrition, supplements, lifestyle changes, when to talk to your doctor — based on YOUR patterns
• Explains the science behind every recommendation in plain language
• Tracks whether interventions are working and adjusts in real-time

What Kai doesn't do:

• Diagnose medical conditions
• Replace your doctor
• Make promises about outcomes
• Give generic advice

Think of Kai as the most knowledgeable, most patient, most data-literate fertility health guide you could imagine — available 24/7, learning your body every day.

You'll meet her when early access opens. Soon.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-11",
    week: 4,
    sequence: 2,
    phase: "education",
    subject: "The 7 drivers of fertility health",
    preview: "Your body is a system. We finally treat it like one.",
    body: `Hi *|FNAME|*,

Conceivable tracks 7 interconnected drivers of fertility health:

1. HORMONAL BALANCE — Not just estrogen and progesterone. The full cascade: thyroid, cortisol, insulin, and how they interact across your cycle.

2. CYCLE REGULARITY — Beyond "is it 28 days?" The variability, the luteal phase length, the follicular phase patterns that reveal what's happening underneath.

3. TEMPERATURE DYNAMICS — The deep BBT analysis we talked about. Speed of rise, stability, pre-ovulatory patterns, and their clinical significance.

4. SLEEP ARCHITECTURE — How your sleep stages correlate with hormonal production. Poor sleep isn't just fatigue — it directly impacts fertility.

5. STRESS & RECOVERY — HRV patterns, cortisol timing, and the physiological stress load that your body may not consciously register but absolutely affects fertility.

6. NUTRITION & METABOLIC HEALTH — Blood sugar stability, micronutrient status, and the dietary patterns that support (or hinder) reproductive function.

7. MOVEMENT & CIRCULATION — Not "exercise more." The specific types, timing, and intensity of movement that optimize pelvic blood flow and hormonal signaling.

These 7 drivers don't exist in isolation. They interact. Conceivable's system maps those interactions and identifies the highest-leverage driver to address first.

One week until early access.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers — educational segment",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-12",
    week: 4,
    sequence: 3,
    phase: "education",
    subject: "Real data. Real patterns. Real change.",
    preview: "Here's what the system actually sees in your data.",
    body: `Hi *|FNAME|*,

We've been sharing the theory. Now let's talk about what this looks like in practice.

When a user connects their wearable and starts tracking with Conceivable, the system begins identifying patterns within the first cycle. By the second cycle, the recommendations become highly personalized.

Here's what the data actually shows:

The system identifies patterns that would take a human practitioner multiple appointments and extensive testing to detect. Cross-signal correlations — like the relationship between a user's sleep disruption on specific cycle days and their luteal phase progesterone patterns — that aren't visible in any single data stream.

This is the power of AI applied to fertility: not replacing human judgment, but processing a volume and complexity of data that no human could track manually.

When you join early access, you'll start seeing your own patterns within weeks.

Early access opens next week. 5,000 spots. You'll hear from us first.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged subscribers — high-intent (clicked previous emails)",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },

  // ============================================================
  // PHASE 3: LAUNCH (Week 5–6) — 6 emails
  // ============================================================
  {
    id: "email-13",
    week: 5,
    sequence: 1,
    phase: "launch",
    subject: "Early access is open. 5,000 spots.",
    preview: "This is what we've been building toward. Join now.",
    body: `Hi *|FNAME|*,

It's here.

Early access to Conceivable is now open.

We're accepting 5,000 members for our initial launch. This isn't a beta test — it's the full system, live, with real AI coaching from Kai and real-time analysis of your fertility health data.

What you get with early access:

• Your personalized CON Score with full driver breakdown
• Kai AI coaching — unlimited conversations, personalized to your data
• Multi-signal tracking (wearable integration, cycle data, lifestyle inputs)
• The closed-loop system: measure → intervene → verify → adjust
• Founding member pricing (locked in permanently)
• Direct input into the product roadmap

What it costs: [pricing details on the signup page]

We built this for you. Seriously. Every feature, every recommendation framework, every piece of the AI — it was built because women on this list told us what they needed.

Join early access →

5,000 spots. When they're gone, the next cohort won't open for months.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — launch announcement",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-14",
    week: 5,
    sequence: 2,
    phase: "launch",
    subject: "What happens when you join",
    preview: "Your first 14 days inside Conceivable, step by step.",
    body: `Hi *|FNAME|*,

Wondering what happens after you sign up?

Here's your first 14 days inside Conceivable:

DAY 1: Connect your wearable and complete your health profile. Takes about 10 minutes.

DAY 2-3: The system begins ingesting your data. Kai introduces herself and asks a few targeted questions to calibrate your experience.

DAY 7: Your initial CON Score is generated. You'll see a full breakdown of all 7 drivers and which ones are your highest priority.

DAY 7-10: Kai delivers your first personalized protocol — specific, evidence-based recommendations for the top 1-2 drivers that will have the most impact.

DAY 14: First progress check. The system verifies whether the initial recommendations are producing the expected physiological responses. If yes, you continue. If not, Kai adjusts.

From there, it's an ongoing cycle of measurement, recommendation, and adjustment — getting more precise as the system learns your body.

No guesswork. No "try this and see." A systematic approach to something that deserves to be treated systematically.

Join early access →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list — launched but not yet signed up",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-15",
    week: 5,
    sequence: 3,
    phase: "launch",
    subject: "The science behind your personalized protocol",
    preview: "This isn't generic wellness advice. Here's why.",
    body: `Hi *|FNAME|*,

Let's be clear about something:

Conceivable doesn't give generic advice.

"Reduce stress" is not a recommendation. "Take this supplement" without knowing why is not personalized care. "Exercise more" is not a protocol.

Here's how Conceivable's personalization actually works:

STEP 1: The system identifies your specific driver hierarchy — which of the 7 fertility drivers are most impacting YOUR fertility health, in order of priority.

STEP 2: For each driver, the AI references a clinical knowledge base to identify evidence-based interventions specific to your pattern.

STEP 3: The recommendation is contextualized to your life — your schedule, your preferences, your existing health conditions, your current cycle phase.

STEP 4: The system tracks biomarkers and self-reported data to VERIFY the intervention is working. If it's not producing the expected response within the expected timeframe, Kai escalates to a different approach.

This closed-loop, adaptive approach is what makes Conceivable different from every other tool in the space. It's not a content library. It's a system that responds to your body.

Early access is open. Limited to 5,000 founding members.

Join now →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Openers who haven't converted — science-forward messaging",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-16",
    week: 6,
    sequence: 1,
    phase: "launch",
    subject: "2,500 spots remaining",
    preview: "Half of early access is already claimed.",
    body: `Hi *|FNAME|*,

Quick update: we're halfway there.

Since opening early access last week, 2,500 founding members have joined Conceivable. That means 2,500 spots remain.

We're not going to extend this or add more spots. When the 5,000 founding member slots are filled, early access closes and the next cohort opens at a later date at standard pricing.

If you've been thinking about it, here's what founding members are already experiencing:

• Initial CON Scores generated within the first week
• Kai delivering personalized driver breakdowns
• Wearable data integration producing insights they've never seen before
• A community of women who are serious about understanding their fertility health

This is the most important thing we've ever built. We built it for people like you.

Join the remaining 2,500 spots →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full list minus already-signed-up — social proof emphasis",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-17",
    week: 6,
    sequence: 2,
    phase: "launch",
    subject: "From confusion to clarity in 14 days",
    preview: "What changes when someone actually connects the dots.",
    body: `Hi *|FNAME|*,

The number one thing we hear from women in the fertility space:

"I feel lost."

Lost in conflicting advice. Lost in test results that don't tell the full story. Lost in a process that feels like it's happening TO them rather than WITH them.

Here's what Conceivable changes:

INSTEAD OF scattered data points → A UNIFIED picture of your fertility health
INSTEAD OF generic advice → PERSONALIZED protocols based on YOUR body
INSTEAD OF "wait and see" → ACTIVE monitoring with closed-loop feedback
INSTEAD OF isolation → AN AI COACH that understands your data and is available 24/7
INSTEAD OF confusion → CLARITY about what's happening and what to do next

Within 14 days of joining, you'll have more insight into your fertility health than most women get in months of traditional care.

This isn't about replacing your doctor. It's about showing up to your next appointment with data, patterns, and questions that lead to better care.

Early access: 2,500 spots remain.

Join now →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged but unconverted — emotional/transformation messaging",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-18",
    week: 6,
    sequence: 3,
    phase: "launch",
    subject: "Your questions, answered",
    preview: "Everything you want to know before joining.",
    body: `Hi *|FNAME|*,

We've received hundreds of replies over the past few weeks. Here are the most common questions:

Q: "Is this a replacement for my doctor?"
A: No. Conceivable is a complement to clinical care. We help you understand your body better so you can have more productive conversations with your healthcare provider.

Q: "What data do I need to get started?"
A: At minimum, cycle tracking data. For the full experience, a wearable (Apple Watch, Oura, etc.) adds sleep and HRV data. The more signals, the more precise the analysis — but you can start simple.

Q: "How is this different from other fertility apps?"
A: Most apps track single variables. Conceivable analyzes the CONNECTIONS between multiple signals. The closed-loop system (measure → intervene → verify → adjust) is unique in the space. We're not a tracker. We're an adaptive system.

Q: "What if I'm already working with a fertility specialist?"
A: Even better. Conceivable's insights can inform and enhance the work you're doing with your doctor. Bring your CON Score breakdown to your next appointment.

Q: "Is my data safe?"
A: Your health data is encrypted, never sold, and handled in compliance with HIPAA guidelines. Privacy is non-negotiable.

Still have questions? Reply to this email. We read every response.

Early access: spots are filling. Join now →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged but unconverted — objection handling",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },

  // ============================================================
  // PHASE 4: FINAL PUSH (Week 7) — 3 emails
  // ============================================================
  {
    id: "email-19",
    week: 7,
    sequence: 1,
    phase: "final-push",
    subject: "48 hours. Last chance for early access.",
    preview: "After Friday, founding member pricing is gone.",
    body: `Hi *|FNAME|*,

Early access closes in 48 hours.

After Friday at midnight, the founding member window closes. The next cohort will open at a later date at standard pricing, and without the founding member benefits.

Here's what you're deciding:

OPTION A: Join now. Get your CON Score within a week. Start working with Kai on personalized protocols. Lock in founding member pricing permanently. Be part of the group that shapes the product.

OPTION B: Wait. Pay more later. Miss the founding member community. Start later on a journey you could start this week.

We're not trying to pressure you. We're trying to be honest: if you've been thinking about this for the past 6 weeks, the only thing between you and clarity about your fertility health is clicking one button.

Join early access before Friday →

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Engaged non-converters only — urgency",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-20",
    week: 7,
    sequence: 2,
    phase: "final-push",
    subject: "A letter from our founder",
    preview: "Kirsten on why she built this and what it means.",
    body: `Hi *|FNAME|*,

It's Kirsten. I want to tell you why I built Conceivable, because it wasn't a business plan. It was personal.

I spent years in the fertility space — first as a practitioner, then as a researcher, then as someone who talked to hundreds of experts through 120 podcast interviews in 4 months. And the same frustration kept coming up: the knowledge exists. The personalization doesn't scale.

The best practitioners in the world can look at a patient's complete picture — hormones, sleep, stress, nutrition, cycle patterns — and create a brilliant protocol. But they can do that for maybe 20 patients a day. There are millions of women who need that level of care.

That's what AI changes. Not by replacing those brilliant practitioners, but by encoding their decision frameworks into a system that can serve thousands of women with the same depth and personalization.

Conceivable is my life's work. The CON Score, the closed-loop system, the 7 drivers framework, Kai — all of it represents the best of what I've learned from the most brilliant minds in reproductive science, scaled by the most powerful technology we've ever had access to.

I built it for you. And I'd love for you to try it.

Early access closes tomorrow.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Full remaining list — founder story",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-21",
    week: 7,
    sequence: 3,
    phase: "final-push",
    subject: "Last call: early access closes tonight",
    preview: "Midnight. Then it's over.",
    body: `Hi *|FNAME|*,

This is the last email about early access.

Tonight at midnight, the founding member window closes.

If you join today:
✓ Your CON Score generated within 7 days
✓ Kai AI coaching — personalized to your body
✓ Founding member pricing locked in permanently
✓ Direct influence on the product roadmap
✓ The full closed-loop fertility health system

If you don't join today:
→ The next opportunity will be at a later date
→ Standard pricing (higher than founding member rate)
→ No founding member benefits

We've shared the science. We've shown you the system. We've answered your questions.

The only thing left is the decision.

Join early access before midnight →

Thank you for being on this journey with us, regardless of what you decide. We're here when you're ready.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Final push — all non-converters — last chance",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },

  // ============================================================
  // PHASE 5: POST-CLOSE (Week 8) — 2 emails
  // ============================================================
  {
    id: "email-22",
    week: 8,
    sequence: 1,
    phase: "post-close",
    subject: "Welcome to the journey",
    preview: "You're in. Here's what happens now.",
    body: `Hi *|FNAME|*,

Welcome to Conceivable. You made a powerful decision.

Here's exactly what happens next:

TODAY: Check your inbox for your onboarding email with login credentials and setup instructions.

THIS WEEK: Complete your health profile and connect your wearable. This takes about 10 minutes and is the foundation for everything that follows.

WITHIN 7 DAYS: Your initial CON Score will be generated. Kai will walk you through what each driver means and what your priorities are.

WITHIN 14 DAYS: Your first personalized protocol will be delivered. Specific, evidence-based recommendations for the top drivers that will have the most impact on your fertility health.

FROM THERE: The closed-loop system begins. Measure, intervene, verify, adjust. Your protocols evolve as your body responds.

A few things to know:
• Reply to any email if you need help. We read everything.
• Kai is available 24/7 inside the app. Ask her anything.
• You're part of a community of 5,000 women who are taking control of their fertility health. You're not alone in this.

Welcome to the journey.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Converted members only — onboarding",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
  {
    id: "email-23",
    week: 8,
    sequence: 2,
    phase: "post-close",
    subject: "What happens next (and what we're building)",
    preview: "Your roadmap as a founding member.",
    body: `Hi *|FNAME|*,

You're one of 5,000 founding members. That means something.

As a founding member, you're not just a user — you're a co-creator. Here's what that looks like:

WHAT'S LIVE NOW:
• CON Score with full 7-driver breakdown
• Kai AI coaching (personalized, unlimited)
• Wearable integration (Apple Watch, Oura)
• Closed-loop recommendation system
• Cycle and lifestyle tracking

COMING SOON (and you'll help shape it):
• Advanced hormone integration (at-home test kit partnerships)
• Partner/co-parent dashboard
• Community features (moderated, science-first)
• Provider portal (share your data with your doctor)
• Pregnancy monitoring transition (when you're ready)

We'll be asking for your feedback regularly. Your experience directly shapes what we build next.

For now, focus on your onboarding. Get your CON Score. Start the conversation with Kai. The journey has begun.

And if you know someone who should be on the waitlist for the next cohort — forward them this link. The best thing you can do for a friend going through this is give them access to better information.

Here for you, always.

Sending you big love,
Kirsten`,
    status: "pending",
    segment: "Converted members — future roadmap + referral",
    approvedAt: null,
    publishedAt: null,
    complianceStatus: "not_reviewed",
    metrics: null,
  },
];
