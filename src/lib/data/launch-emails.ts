// 23 Launch Emails — 8-Week Early Access Sequence
// Target: 5,000 early access signups from ~29,000 cleaned, warming list
// Arc: Feelings → Mission/Why → Them → Supplements → App → Ring
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
    description: "Feelings & reconnection. Remind them why they subscribed. Build the relationship.",
  },
  education: {
    label: "Education",
    weeks: "Week 3–4",
    color: "#5A6FFF",
    description: "Their bodies, their health. Supplements & nutrition. Build trust through real knowledge.",
  },
  launch: {
    label: "Launch",
    weeks: "Week 5–6",
    color: "#E37FB1",
    description: "Introduce the app, the Halo Ring, and the system. Open early access.",
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
  // PHASE 1: RE-ENGAGEMENT (Week 1–2) — FEELINGS & MISSION
  // ============================================================
  {
    id: "email-01",
    week: 1,
    sequence: 1,
    phase: "re-engagement",
    subject: "We've been quiet. Here's why.",
    preview: "We disappeared for a reason — and it's a good one.",
    body: `Hi *|FNAME|*,

You haven't heard from us in a while.

That was on purpose. (I promise we weren't ghosting you.)

We've spent the last year doing something kind of crazy — locking ourselves in a room with reproductive endocrinologists, data scientists, and the smartest people we could find to build something I genuinely believe will change how women experience their fertility.

And I don't say that lightly. I've been in this space for 20 years. I've seen every app, every tracker, every "fertility superfood" trend come and go.

This is different.

Over the next few weeks, I'm going to tell you what we've been up to. Not a sales pitch — just the story. Why we built it, what we learned, and why I think it matters for you specifically.

If you're still on this journey — stay with me. The next email is a good one.

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
    subject: "Can I be honest with you for a second?",
    preview: "Something nobody tells you about the fertility journey.",
    body: `Hi *|FNAME|*,

I want to talk about something that doesn't get said enough.

The fertility journey can be really, really lonely.

You're Googling things at 2am. You're reading forums that make you more anxious. You're smiling at baby showers while your heart is doing something complicated. You're wondering if it's you, if it's timing, if it's something you ate, if you should try that supplement your friend's friend swears by.

And everyone around you — with the very best intentions — keeps saying things like "just relax" or "it'll happen when it stops trying."

(If one more person says "just relax" I swear.)

Here's what I want you to know: you are not broken. Your body is not failing you. In most cases, it's actually sending you incredibly useful signals about what's going on. The problem isn't your body — it's that nobody has given you the tools to understand what it's telling you.

That's what we've been building.

More soon. But today I just wanted to say: I see you. This is hard. And you deserve better than "just relax."

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
    subject: "Why I did 120 podcasts in 4 months",
    preview: "I was a little unhinged. But I learned something important.",
    body: `Hi *|FNAME|*,

OK so here's a fun fact about me: I did 120 podcast interviews in 4 months.

Yes, my voice was shot. Yes, my family thought I'd lost it. But I had this feeling — this nagging, won't-let-me-sleep feeling — that the answers were out there, just scattered across a hundred different experts who weren't talking to each other.

So I talked to all of them. Reproductive endocrinologists. Naturopaths. Traditional Chinese Medicine practitioners. Sleep researchers. Nutritionists. Data scientists. Women who'd been through every protocol imaginable.

And you know what I kept hearing?

The same thing, over and over: "We know what works. We just can't personalize it at scale."

The best fertility doctors in the world can create brilliant, customized protocols. But they have 12 minutes per patient and a waiting list six months long. The knowledge exists. The delivery system doesn't.

That's the gap. That's what kept me up at night. And that's what we set out to fix.

Next email: what's actually broken in fertility care (and why it's not your doctor's fault).

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
    subject: "Something is broken in fertility care",
    preview: "It's not your doctor's fault. Here's what's actually going on.",
    body: `Hi *|FNAME|*,

Can we be honest for a second?

Here's what fertility care looks like for most women: You go in. You get blood drawn. Maybe an ultrasound. Your doctor — who is almost certainly brilliant but completely overworked — has about 12 minutes. You leave with a prescription and a "let's see what happens."

Meanwhile, your body is sending hundreds of signals every single day. Your temperature patterns. Your sleep. Your cycle variations. Your stress response. Your digestion. How you feel on day 14 versus day 21. Hundreds of data points that are genuinely relevant to your fertility.

And nobody is connecting them.

Here's the thing: that's not your doctor's fault. They literally don't have the tools. The system wasn't built for this kind of whole-body, connected analysis. It was built for isolated snapshots — one blood draw, one appointment, one intervention at a time.

Your body doesn't work in isolation. Your fertility is connected to everything — your sleep, your stress, what you eat, how you move, your hormones, your gut health. Everything is talking to everything else.

We need a system that listens to all of it. (Spoiler: that's what we built.)

More coming this week.

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
    subject: "The thing that changed everything for me",
    preview: "After 20 years in fertility, this was the breakthrough.",
    body: `Hi *|FNAME|*,

I've been a board-certified reproductive health expert for 20 years.

I've worked with thousands of women. I've read the studies. I've sat across from patients and watched the light come on when they finally understood what was happening in their bodies.

And the thing that changed everything for me was this realization:

We've been treating fertility like it's one thing. It's not. It's the OUTPUT of a whole system working together — hormones, sleep, nutrition, stress, movement, metabolic health, cycle dynamics. When something isn't working, the answer almost never lives in just one place.

It's like trying to fix a garden by only looking at one plant. You have to look at the soil, the water, the sunlight, the whole ecosystem.

The women I've seen have the best outcomes? They're not the ones who found one magic protocol. They're the ones who understood the WHOLE picture and addressed the right things in the right order.

That's the approach we've built into everything we're doing. And I'm going to share the details with you over the next couple of weeks.

But first — my next email is about the specific things your body is telling you right now that nobody is translating. That one's going to be an eye-opener.

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
    subject: "Your body is already talking to you",
    preview: "The signals are there. You just need someone to translate them.",
    body: `Hi *|FNAME|*,

Every morning, your body tells a story through your temperature.

And no, I don't just mean "did I ovulate?" That's the first sentence of a very long book. Most apps read that first sentence and close the cover.

The real story is in the patterns. How fast your temperature rises after ovulation (clinically significant, almost never tracked). How stable your luteal phase temperatures are (tells you about progesterone). What happens to your temps when you had terrible sleep. The relationship between your cycle length variability and your stress levels.

There is SO much information in there. And that's just temperature.

Your sleep patterns correlate with your hormonal production in ways most doctors don't have time to analyze. Your HRV (heart rate variability) reflects your body's stress load — which directly impacts implantation and hormone balance. Even your digestion and energy patterns across your cycle are telling a story.

Your body is not a mystery. It's a system. And systems send signals.

The problem has never been the signals. It's that nobody built a way to read them all together.

(Until now. But I'm getting ahead of myself.)

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
  // PHASE 2: EDUCATION (Week 3–4) — THEM & SUPPLEMENTS
  // ============================================================
  {
    id: "email-07",
    week: 3,
    sequence: 1,
    phase: "education",
    subject: "The 7 things that actually matter for fertility",
    preview: "Not 47 things. Not 3. Exactly 7 — and the order matters.",
    body: `Hi *|FNAME|*,

After 20 years, 120 podcast interviews, thousands of patients, and a probably-unhealthy amount of research papers, I've narrowed it down.

There are 7 drivers that matter most for fertility health. Not 47. Not 3. Seven — and the ORDER you address them matters more than most people realize.

Here they are:

1. HORMONAL BALANCE — Not just estrogen and progesterone. The full cascade: thyroid, cortisol, insulin, and how they dance together across your cycle.

2. CYCLE DYNAMICS — Way beyond "is it 28 days?" The variability patterns, luteal phase quality, and follicular phase signals that reveal what's happening underneath.

3. SLEEP & RECOVERY — This is the one everyone underestimates. Your sleep architecture directly impacts LH surge timing, progesterone production, and endometrial receptivity. (I'll do a whole email on this.)

4. STRESS PHYSIOLOGY — Not "are you stressed" but what your body's actual stress load looks like at a physiological level. HRV, cortisol patterns, nervous system regulation.

5. NUTRITION & METABOLIC HEALTH — Blood sugar stability, micronutrient status, gut health. The foundation everything else is built on.

6. MOVEMENT & CIRCULATION — Not "exercise more." Specific types and timing that support hormonal signaling and pelvic blood flow.

7. TEMPERATURE DYNAMICS — The deep BBT analysis I talked about last time. A goldmine of information when you know how to read it.

Here's the crucial part: these 7 don't exist in isolation. They interact. And knowing which one to address FIRST — for YOUR body — is the difference between spinning your wheels and making real progress.

Next email: the one thing most fertility supplements get wrong.

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
    subject: "Most fertility supplements are a waste of money",
    preview: "I know that's bold. Let me explain.",
    body: `Hi *|FNAME|*,

I'm going to say something that might surprise you coming from someone in this industry:

Most fertility supplements are a waste of money.

Not because the ingredients don't work. Many of them do — there's solid research behind things like CoQ10, folate, vitamin D, omega-3s, and inositol for specific situations.

The problem is the APPROACH. You walk into a store (or scroll through Instagram), see a bottle that says "fertility support," and take it because... it says fertility on the label?

That's like walking into a pharmacy and grabbing random prescriptions because they're in the "health" aisle.

Here's what actually matters with supplements:

DO YOU ACTUALLY NEED IT? Taking CoQ10 when your issue is a thyroid imbalance is like putting premium gas in a car with a flat tire. Not wrong, just irrelevant to your actual problem.

WHAT'S YOUR BASELINE? Without knowing your starting point, you can't know what's working. "I feel better" is not a measurement strategy.

IS IT WORKING? This is the big one. Most women take supplements for months with zero way to verify they're producing the expected physiological response. That's not a protocol — it's hope.

WHAT'S THE QUALITY? Supplement regulation is... let's say "relaxed." What's on the label and what's in the bottle are not always the same thing.

The right supplements, for the right person, at the right time, with actual verification that they're working — that's powerful. Random supplementation based on Instagram ads is not.

I'll share our evidence-based framework for supplementation in the next email. It might save you a lot of money.

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
    subject: "The supplement protocol that actually works",
    preview: "Evidence-based. Personalized. And you can verify it's working.",
    body: `Hi *|FNAME|*,

OK, I ranted about bad supplements last time. Now let me tell you what good supplementation looks like.

After reviewing hundreds of clinical studies and working with thousands of women, here's what I know to be true:

THE FOUNDATION (most women benefit from these):
Methylated folate (not folic acid — there's a meaningful difference), vitamin D (most women are deficient and don't know it), and omega-3s (specifically EPA/DHA for inflammation and hormonal signaling).

THE TARGETED LAYER (depends on YOUR drivers):
CoQ10 — powerful for egg quality, but not everyone needs it. Inositol — excellent for insulin sensitivity and PCOS-related issues. Vitamin E — supports endometrial lining. Iron — but only if you're actually deficient, because excess iron is inflammatory. Magnesium — the unsung hero of hormonal balance and sleep quality.

THE VERIFICATION PIECE (this is what nobody talks about):
Any supplement protocol should be MEASURABLE. You should be able to track whether it's producing the expected changes in your cycle dynamics, your temperature patterns, your energy, your sleep quality.

If you've been taking something for 3 months and you have no objective way to know if it's working? That's a problem.

This "measure → intervene → verify → adjust" approach is the foundation of everything we've built. It applies to supplements, to lifestyle changes, to everything.

Speaking of which — my next email is about the system we built to do exactly this. I think you're going to like it.

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
    subject: "Why sleep is the fertility hack nobody talks about",
    preview: "Your Apple Watch knows something your doctor doesn't.",
    body: `Hi *|FNAME|*,

Here's a question most fertility doctors don't ask:

"How's your sleep?"

Not because they don't care. Because they don't have a system that connects sleep disruption patterns to hormonal cascades to cycle regularity to fertility outcomes.

But the research is wild. Sleep architecture directly impacts:
— LH surge timing (ovulation)
— Progesterone production (luteal phase support)
— Endometrial receptivity (implantation)
— Cortisol regulation (which impacts... basically everything)

That thing where you wake up at 3am and can't fall back asleep? That's not random. It's often a cortisol spike — and depending on WHERE you are in your cycle, it can have a real downstream effect on your hormonal balance.

Your Apple Watch or Oura ring is capturing this data every single night. Sleep stages, HRV, resting heart rate, respiratory rate. Data that is genuinely clinically relevant to your fertility health.

And right now, nobody is reading it. It's just sitting there in your Health app, being pretty charts.

What if someone could actually connect that data to what's happening with your cycle, your hormones, and your fertility? What if the patterns in your sleep could tell you which of those 7 drivers needs attention first?

(This is one of my favorite parts of what we built. I'll tell you more soon.)

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
    subject: "Your body is a system, not a symptom",
    preview: "This is the shift that changes everything.",
    body: `Hi *|FNAME|*,

I want to share the single most important thing I've learned in 20 years:

Your fertility is not a single thing to fix. It's the OUTPUT of your whole system working together.

This is why the traditional approach — test one hormone, prescribe one intervention, wait and see — is so frustrating. It treats your body like a machine with one broken part. Just find the broken part, replace it, done.

But you're not a machine with a broken part. You're an ecosystem.

When your sleep is off, it affects your cortisol. When your cortisol is off, it affects your progesterone. When your progesterone is off, it affects your luteal phase. When your luteal phase is short, implantation becomes harder. And the thing that disrupted your sleep might have been blood sugar instability from a nutritional gap.

Everything is connected. Nothing is an island.

The women I've worked with who've had the biggest breakthroughs? They didn't find one magic pill. They started understanding the WHOLE picture — which driver was most out of balance, what was causing it, and what to address first for the biggest ripple effect.

That's the philosophy behind everything we're building. Systems thinking applied to fertility. Your whole body, not just your ovaries.

Next week, I'm going to tell you about the specific tool we built to make this real — not just a philosophy, but an actual system you can use. I'm really excited about this one.

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
    subject: "What if there was a better way?",
    preview: "After everything I've shared — here's what we actually built.",
    body: `Hi *|FNAME|*,

Over the past few weeks, I've shared a lot:

The loneliness of the fertility journey. Why the current system is broken. The 120 podcasts that showed me the gap. The 7 drivers that actually matter. Why most supplements are a shot in the dark. How your sleep is connected to your hormones in ways nobody is tracking.

All of it comes down to one problem:

The knowledge exists. The personalization doesn't scale.

The best practitioners in the world can sit with one patient for an hour, analyze everything, and create a brilliant protocol. But there are millions of women who need that level of care and will never get it.

What if you could?

What if there was a system that could look at YOUR sleep, YOUR cycle, YOUR nutrition, YOUR stress patterns, YOUR temperature data — all of it, together — and tell you exactly which of those 7 drivers to address first? And then verify it's actually working?

Not generic advice. Not "reduce stress." Not random supplements. A real, personalized, evidence-based approach that adapts to YOUR body.

That's what we built. And next week, I'm going to show it to you.

Stay with me?

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
  // PHASE 3: LAUNCH (Week 5–6) — APP & RING
  // ============================================================
  {
    id: "email-13",
    week: 5,
    sequence: 1,
    phase: "launch",
    subject: "OK, here's what we built",
    preview: "No more teasing. Let me show you the whole thing.",
    body: `Hi *|FNAME|*,

It's time.

I've been telling you the story for 4 weeks. The problem, the philosophy, the research. Now let me show you what we actually made.

Conceivable is a system — app + Halo Ring + AI coaching — that does what I've been describing:

It reads the signals your body is already sending (through the Halo Ring, your cycle tracking, and daily inputs). It analyzes them against the 7 drivers of fertility health. And it tells you exactly what to focus on, in what order, with evidence-based protocols personalized to YOUR body.

The Halo Ring tracks your temperature, sleep, HRV, and activity continuously — so you don't have to remember to take your BBT every morning. It just... does it. All day, all night.

The app is where Kai lives — your AI fertility coach. Kai isn't a chatbot. She's built on the clinical frameworks from those 120 podcast interviews and thousands of research papers. She understands YOUR data and gives you recommendations that are specific to what YOUR body is doing right now.

And the key piece: the closed loop. Measure → intervene → verify → adjust. The system doesn't just give you advice and walk away. It tracks whether the intervention is working and adapts if it's not.

We're opening early access to 5,000 founding members. Not as a marketing tactic — because we want to make sure everyone who joins gets real support.

More details in my next email. But I wanted you to see the full picture first.

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
    subject: "Meet Kai (she's not what you think)",
    preview: "She's not a chatbot. She's the coach I wish every woman had.",
    body: `Hi *|FNAME|*,

Let me introduce you to someone.

Kai is the AI coach at the heart of Conceivable. And I need to tell you right away what she's NOT, because I know what you're picturing.

She's not a chatbot that Googles your symptoms. She's not a generic wellness app that tells you to drink water and meditate. She doesn't give you the same advice she gives everyone else.

Here's what Kai actually does:

She reads your Halo Ring data and daily inputs to understand what's happening in YOUR body right now. She identifies which of the 7 fertility drivers need attention — and in what order. She recommends specific protocols — supplements, nutrition changes, sleep adjustments, stress management techniques — based on YOUR patterns, not generic guidelines.

And then — this is the part I'm proudest of — she tracks whether it's working.

Did your luteal phase temperature stabilize after that supplement recommendation? Did your sleep improve after the protocol adjustment? Is your cycle variability decreasing?

If yes, she builds on what's working. If not, she adjusts. That's the closed loop.

Think of her as the most knowledgeable, most patient, most data-literate fertility health guide you could imagine. Available 24/7. Learning your body every day. Never rushing you out of a 12-minute appointment.

She's who I'd want in my corner if I were on this journey.

Early access opens soon. I'll send you the details.

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
    subject: "The Halo Ring reads what your doctor can't",
    preview: "Continuous data. Not just one snapshot at one appointment.",
    body: `Hi *|FNAME|*,

Let's talk about the Halo Ring for a second.

You know how your doctor gets a snapshot of your health — one blood draw, one moment in time? And then makes decisions based on that single frame?

The Halo Ring is like having a movie instead of a photograph.

It tracks your temperature continuously (not just one morning reading — ALL day and night). It captures your sleep stages, your HRV, your resting heart rate, your activity patterns. Every night, every cycle, every day.

Why does this matter?

Because the patterns BETWEEN your data points are where the real insights live. The relationship between your sleep quality on cycle day 20 and your temperature stability on cycle day 22. The connection between an HRV dip and a cortisol-driven sleep disruption three days before your period.

These cross-signal patterns are invisible in a single doctor's appointment. They're invisible in most apps. They're even invisible to you unless someone is connecting the dots continuously.

The Halo Ring does the capturing. Kai does the connecting. And together, they give you a picture of your fertility health that simply hasn't been possible before.

No more wondering. No more guessing. Just your body's actual story, told in data.

Early access: 5,000 spots. Details coming this week.

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
    subject: "Early access is open. 5,000 spots.",
    preview: "This is what we've been building toward.",
    body: `Hi *|FNAME|*,

It's here.

Early access to Conceivable is now open — app, Halo Ring, Kai, the whole system.

We're accepting 5,000 founding members. Here's what you get:

Your personalized CON Score — one number that captures your overall fertility readiness across all 7 drivers, with a full breakdown of what's driving it and what to address first.

The Halo Ring — continuous tracking of temperature, sleep, HRV, and activity. No more morning BBT alarms. No more single-snapshot data.

Kai AI coaching — unlimited, personalized to YOUR data. Evidence-based protocols that adapt as your body responds.

The closed-loop system — measure, intervene, verify, adjust. Real accountability for whether interventions are working.

Founding member pricing — locked in permanently.

And direct input into what we build next. You're not just a user — you're helping shape this.

I built this for women like you. Women who are smart enough to know the current system isn't good enough, and ready for something better.

Join early access →

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
    subject: "What happens when you actually join",
    preview: "Your first 14 days inside Conceivable, step by step.",
    body: `Hi *|FNAME|*,

Wondering what actually happens after you sign up? Let me walk you through it.

DAY 1: Your Halo Ring ships. While you wait, you set up the app and complete your health profile. Takes about 10 minutes. (We ask smart questions — the kind your doctor should ask but doesn't have time to.)

DAY 3-5: Halo Ring arrives. Put it on. That's it. It starts capturing data immediately.

DAY 7: Your initial CON Score is generated. This is the moment. You'll see a full breakdown of all 7 drivers — which ones are strong, which ones need attention, and which one to address FIRST for the biggest impact.

DAY 7-10: Kai delivers your first personalized protocol. Not "eat more vegetables." Specific, evidence-based recommendations targeting YOUR top priority driver. Supplements if needed, lifestyle adjustments, things you can actually do.

DAY 14: First progress check. The system looks at whether your data is shifting in the expected direction. If yes — great, keep going. If not — Kai adjusts the protocol.

From there, it's an ongoing conversation between you, your body, and a system that's actually paying attention.

No more guesswork. No more "let's see what happens." A real plan that adapts to you.

5,000 founding member spots. Join now →

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
    subject: "Your questions, answered honestly",
    preview: "No spin. Just straight answers to the things you're wondering.",
    body: `Hi *|FNAME|*,

You've had questions. (I love that you've had questions.) Here are the honest answers:

"Is this replacing my doctor?"
No. And I'd be worried about anyone who says it does. Conceivable is a complement to clinical care. We give you better data so you can have better conversations with your provider. Bring your CON Score to your next appointment — your doctor will thank you.

"Do I need the Halo Ring?"
It makes a huge difference, but you can start with the app alone using cycle tracking and daily inputs. The Halo Ring adds continuous temperature, sleep, and HRV data — which makes the analysis dramatically more precise.

"How is this different from Clue / Flo / Natural Cycles?"
Those are trackers. They record what you tell them and show you patterns. Conceivable is a system. It analyzes the CONNECTIONS between signals, recommends interventions, verifies they're working, and adjusts if they're not. Tracker vs. closed-loop adaptive system.

"What about my data?"
Encrypted. Never sold. HIPAA-compliant. Non-negotiable. Your health data is yours.

"What if I'm already doing IVF?"
Conceivable can complement IVF protocols by optimizing the underlying health factors that support outcomes — sleep, stress, nutrition, supplementation. Several of our early testers were actively in treatment.

"Is this too good to be true?"
I've been in this space for 20 years. I wouldn't put my name on something I didn't believe in. Come see for yourself.

Still have questions? Reply to this email. I read every one.

Join early access →

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
    subject: "48 hours left for early access",
    preview: "After Friday, founding member pricing is gone.",
    body: `Hi *|FNAME|*,

Quick one today.

Early access closes in 48 hours. After Friday at midnight, founding member pricing goes away and the next cohort won't open for a while.

I'm not going to re-pitch you. You've been reading these emails for 6 weeks — you know what this is and whether it's right for you.

I'll just say this:

If you've been on the fence, the thing you're waiting for — more information, more proof, more certainty — is on the other side of trying it. Your CON Score will tell you more about your fertility health in one week than months of wondering.

And if now isn't the right time, that's completely OK too. I mean that. This journey is yours and there's no wrong timeline.

But if you've been thinking about it... 48 hours.

Join early access →

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
    subject: "A personal note from me",
    preview: "Why I built this. The real reason.",
    body: `Hi *|FNAME|*,

I want to tell you why I really built Conceivable.

The professional answer is: I saw a gap in fertility care and I had the expertise to fill it. That's true.

But the real reason is more personal than that.

I've spent 20 years sitting across from women who are confused, frustrated, and scared. Women who are doing everything "right" and it's not working. Women who feel like their bodies are failing them. Women who've been dismissed by a system that doesn't have time for them.

And every single time, when I could actually sit with someone and connect the dots — show them the whole picture, explain what their body was doing and WHY — I watched something shift. Not just understanding. Hope. Real, informed, grounded hope.

I can't sit with millions of women. But I could build a system that does what I do in those moments — connect the dots, explain the why, create a real plan, and actually follow through.

That's Conceivable. That's Kai. That's the Halo Ring and the app and the closed loop and all of it.

It's my life's work. And I'd love for you to try it.

Early access closes tomorrow.

Join now →

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
    subject: "Last call — early access closes tonight",
    preview: "Midnight. Then we close the doors.",
    body: `Hi *|FNAME|*,

This is the last email about early access.

Tonight at midnight, the founding member window closes. I won't extend it or add more spots — that wouldn't be fair to the people who already joined.

If you're in, here's what's waiting for you:
— Your CON Score within 7 days
— The Halo Ring shipped to your door
— Kai AI coaching, personalized to your body
— Founding member pricing locked in forever
— A real, adaptive system that actually follows through

If now isn't your time, I completely understand. You'll be the first to know when the next cohort opens.

But if you've been reading these emails and thinking "this is what I've been looking for" — trust that feeling. You're not wrong.

Join before midnight →

Thank you for being on this journey with me, no matter what you decide. I'm here when you're ready.

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
    subject: "Welcome. Let's do this.",
    preview: "You're in. Here's exactly what happens now.",
    body: `Hi *|FNAME|*,

You're in. And I'm genuinely thrilled.

Here's exactly what happens now:

TODAY: Check your inbox for your onboarding email with login details and Halo Ring shipping confirmation.

THIS WEEK: Set up the app, complete your health profile. When your Halo Ring arrives, put it on. That's it — it starts working immediately.

WITHIN 7 DAYS: Your initial CON Score drops. This is the good stuff — a full breakdown of all 7 drivers, what's strong, what needs attention, and where to start.

WITHIN 14 DAYS: Kai delivers your first personalized protocol. Real recommendations, based on your actual data.

A few things to know:

Reply to any email if you need help. I read everything. (OK, my team reads everything. But they're wonderful and I trained them personally.)

Kai is available 24/7 in the app. Don't be shy — she literally never gets tired of your questions.

You're part of a founding group of 5,000 women. You're not alone in this — even though it can feel that way sometimes.

Welcome to the journey. I'm so glad you're here.

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
    subject: "You're a founding member. Here's what that means.",
    preview: "You're not just a user — you're shaping what comes next.",
    body: `Hi *|FNAME|*,

You're one of 5,000 founding members. I want you to know what that actually means.

It means you're not just using Conceivable — you're helping build it. Your feedback, your experience, your "this is confusing" and "I wish it did this" — that's gold to us. We're listening. Actively.

WHAT'S LIVE NOW:
— CON Score with full 7-driver breakdown
— Halo Ring (continuous temp, sleep, HRV, activity)
— Kai AI coaching (personalized, unlimited)
— Closed-loop recommendation system
— Supplement protocol guidance
— Cycle and lifestyle tracking

WHAT'S COMING (and you'll help shape):
— Advanced hormone integration (at-home test kit partnerships)
— Partner/co-parent features
— Community (moderated, science-first — not another anxiety forum)
— Provider portal (share your data with your doctor seamlessly)
— Pregnancy monitoring transition (when you're ready — and we'll be SO happy for you)

We'll ask for your feedback regularly. Don't hold back. The whole point of a founding member group is that you make this better for every woman who comes after you.

For now: focus on getting your CON Score. Start the conversation with Kai. Wear the Halo Ring. Let the system learn your body.

And if you know someone who should be on the waitlist for the next cohort — forward them this link. The best thing you can do for a friend going through this is give them access to better tools.

Here for you. Always.

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
