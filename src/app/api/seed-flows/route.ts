import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ============================================================
// POST-PURCHASE FLOW (8 emails)
// Trigger: Order placed (supplements, Halo Ring, subscription)
// Goal: Onboard, educate, retain, cross-sell, replenish
// ============================================================

const POST_PURCHASE_EMAILS = [
  {
    sequence: 1,
    phase: "onboarding",
    delayDays: 0,
    subject: "You just did something powerful for yourself",
    preview: "Your order is confirmed — here's what happens next",
    body: `Hi *|FNAME|*,

I just saw your order come through and I had to send you a quick note.

You did something most women never do — you stopped Googling, stopped guessing, and actually invested in understanding your own body. That takes guts. I'm proud of you already.

Here's what's happening right now:
- Your order is being prepared
- If you ordered personalized supplement packs, our team is reviewing your profile to customize your formulation
- If you ordered your Halo Ring, it's being shipped from our fulfillment center

You'll get a shipping notification as soon as everything is on its way.

While you wait — if you haven't already, download the Conceivable app. That's where the real magic happens. Kai (your AI fertility coach) is already waiting to meet you.

This is the beginning of something good.

Sending you big love,
Kirsten`
  },
  {
    sequence: 2,
    phase: "onboarding",
    delayDays: null,
    delayHours: null,
    subject: "Your Conceivable order is on its way",
    preview: "Track your shipment + something to do while you wait",
    body: `Hi *|FNAME|*,

Your order just shipped! You should have a tracking email from our shipping partner in your inbox (check spam if you don't see it).

While you wait for your package, here are two things that will make your first week amazing:

1. Download the Conceivable app (if you haven't already) — this is where you'll see your Conceivable Score, talk to Kai, and track everything that matters

2. Start a conversation with Kai — she already knows a lot about fertility, and she's going to learn a lot about YOU. Try asking her: "What should I focus on this cycle?"

The more Kai knows about you, the more personalized your experience becomes. And that personalization is what makes Conceivable completely different from anything else out there.

Your package should arrive in 3-5 business days. I'll check in after it lands.

Sending you big love,
Kirsten`
  },
  {
    sequence: 3,
    phase: "onboarding",
    delayDays: 6,
    subject: "Your package arrived — let's make the magic happen",
    preview: "Your first week guide (don't skip this)",
    body: `Hi *|FNAME|*,

Your Conceivable order should be in your hands by now (if not, hit reply and we'll track it down).

Let me walk you through your first week, because HOW you start matters:

IF YOU GOT PERSONALIZED SUPPLEMENT PACKS:
- Take them at the same time every day (morning with breakfast works best for most women)
- They're formulated specifically for YOUR body — this isn't a generic prenatal vitamin
- Don't worry if you don't feel different immediately. The ingredients are working at a cellular level. Most women start noticing changes in weeks 2-4 (better energy, more regular cycles, improved sleep)

IF YOU GOT YOUR HALO RING:
- Wear it to bed tonight — that's where the best data comes from
- Open the Conceivable app in the morning to see your first overnight readings
- Your Conceivable Score will get smarter every day as it learns your patterns

THE MOST IMPORTANT THING:
Consistency beats perfection. Taking your supplements 6 out of 7 days is better than taking them perfectly for a week and then forgetting. Wearing your Halo Ring most nights is better than never wearing it because you forgot one night.

This is a journey, not a test. There's no failing here.

Sending you big love,
Kirsten`
  },
  {
    sequence: 4,
    phase: "education",
    delayDays: 9,
    subject: "The #1 thing our happiest members do",
    preview: "Quick tip to get way more out of Conceivable",
    body: `Hi *|FNAME|*,

I've been doing this for 20 years, and I've noticed a pattern with the women who see the best results.

It's not about being perfect. It's not about obsessing over every data point.

It's this: they check in with Kai regularly.

Not because they have to. But because Kai notices things they wouldn't catch on their own. Like:
- "Your sleep quality dropped the last 3 nights — here's what might help"
- "Your cycle is trending shorter — this is actually a good sign, here's why"
- "Based on your Conceivable Score this week, let's adjust your focus"

Kai isn't a chatbot reading from a script. She's learning YOUR patterns, YOUR body, YOUR cycle. The more you talk to her, the smarter she gets about you specifically.

Try this today: Open the app and ask Kai "What's one thing I should focus on this week?"

Her answer might surprise you.

Sending you big love,
Kirsten`
  },
  {
    sequence: 5,
    phase: "education",
    delayDays: 14,
    subject: "What's actually happening in your body right now",
    preview: "The science behind why this works (it's pretty cool)",
    body: `Hi *|FNAME|*,

You've been on Conceivable for about two weeks now. I want to pull back the curtain on what's actually happening, because you deserve to know.

YOUR SUPPLEMENTS:
The ingredients in your personalized pack aren't random. They were selected based on YOUR specific health profile. Here's what they're doing right now:

- CoQ10 is fueling your mitochondria (the energy factories in every cell, including your eggs)
- Folate is supporting DNA methylation and healthy cell division
- Vitamin D is modulating your immune system and supporting implantation-readiness
- The other ingredients in your pack are addressing YOUR specific gaps

This isn't about taking a multivitamin and hoping for the best. This is targeted, personalized biochemistry.

YOUR DATA (if you're wearing the Halo Ring):
Every night, your Halo Ring is tracking heart rate variability, skin temperature shifts, respiratory rate, and movement patterns. These aren't random numbers — they're biomarkers that correlate directly with hormonal patterns and cycle health.

Your Conceivable Score synthesizes all of this into something actionable. It's not just telling you where you are — it's telling you what to DO about it.

You have more data about your body right now than most women get in a year of doctor visits.

That's powerful. Use it.

Sending you big love,
Kirsten`
  },
  {
    sequence: 6,
    phase: "retention",
    delayDays: 21,
    subject: "How are you feeling? (genuinely asking)",
    preview: "3 weeks in — I'd love to hear from you",
    body: `Hi *|FNAME|*,

It's been about three weeks since you started with Conceivable, and I genuinely want to know — how's it going?

Some women notice changes by now: more energy, better sleep, more predictable cycles. Others are still building the foundation (and that's completely normal — your body has its own timeline).

Either way, I have two asks:

1. IF CONCEIVABLE IS HELPING YOU — would you take 30 seconds to leave a review? Not for us (ok, a little for us) — but because another woman who's where you were three weeks ago is reading reviews right now trying to decide if this is worth it. Your words could be the thing that helps her take the leap.

2. IF YOU'RE STRUGGLING OR CONFUSED — hit reply to this email. Seriously. I read every response. Whether it's a question about your supplements, trouble with your Halo Ring, or you just need someone to tell you "you're doing great" — I'm here.

You're not alone in this. There are thousands of women on the same journey, and every single one of them had a moment where they wondered if it was working.

Keep going.

Sending you big love,
Kirsten`
  },
  {
    sequence: 7,
    phase: "growth",
    delayDays: 28,
    subject: "Ready for the next level?",
    preview: "Women who use both see 2x better results",
    body: `Hi *|FNAME|*,

A month in — look at you go.

I want to share something interesting from our data: women who use BOTH personalized supplements AND the Halo Ring together see significantly better outcomes than women using either one alone.

Why? Because:
- Supplements optimize what's happening inside your body
- The Halo Ring measures what's happening — so you (and Kai) can see the optimization in real time
- Together, they create a feedback loop: adjust, measure, adjust, measure

It's the difference between driving with your eyes closed and driving with GPS.

If you started with just supplements, the Halo Ring is the missing piece that turns "I hope this is working" into "I can SEE this is working."

If you started with just the Halo Ring, personalized supplements are how you actually move the needle on what the Ring is tracking.

No pressure. But if you're ready to go all in on this journey — now's the time.

Sending you big love,
Kirsten`
  },
  {
    sequence: 8,
    phase: "retention",
    delayDays: 50,
    subject: "Don't break your streak",
    preview: "Running low? Your next month is ready",
    body: `Hi *|FNAME|*,

Quick heads up — if you started your personalized supplement packs when they arrived, you're probably getting close to running out.

Here's what I don't want to happen: you run out, tell yourself you'll reorder tomorrow, and then three weeks go by. I've seen it a thousand times, and here's the thing — consistency is everything with supplements.

The ingredients in your pack build up in your system over time. Taking them for one month and stopping is like going to the gym for 4 weeks and then quitting — you lose the momentum right when it was about to pay off.

Reorder now so there's no gap. Your body is in a rhythm. Let's keep it there.

(Pro tip: Switch to auto-ship and save 15%. Your supplements arrive automatically so you never have to think about it. One less thing on your plate.)

Sending you big love,
Kirsten`
  },
];

// ============================================================
// ABANDONED CART FLOW (5 emails)
// Trigger: Cart abandoned (supplements, Halo Ring, etc.)
// Strategy: Remind → Social proof → Risk reversal → Story → Offer
// NO discount until email 5
// ============================================================

const ABANDONED_CART_EMAILS = [
  {
    sequence: 1,
    phase: "reminder",
    delayHours: 2,
    subject: "Still thinking it over?",
    preview: "Your cart is saved — pick up where you left off",
    body: `Hi *|FNAME|*,

You left a few things in your cart at Conceivable. No worries — life happens.

Your cart is saved and ready whenever you are.

Sometimes all you need is a minute to come back to it with fresh eyes. Here's your link to pick up where you left off:

[Complete Your Order →]

If you have any questions about what's in your cart — ingredients, sizing for the Halo Ring, how the personalized supplements work — hit reply. I'm happy to help.

Sending you big love,
Kirsten`
  },
  {
    sequence: 2,
    phase: "social-proof",
    delayHours: 24,
    subject: "Here's what happened when she tried it",
    preview: "Real results from real women — not stock photos",
    body: `Hi *|FNAME|*,

I get it. When you're researching fertility products, everything sounds the same. Everyone claims to be "the answer." How do you know what actually works?

Here's what I'd say: don't listen to me. Listen to them:

"I was skeptical — I'd tried everything. But within two cycles, my Conceivable Score went from 62 to 81, and my doctor noticed the difference in my bloodwork before I even told her I was using it." — Sarah, 34

"The Halo Ring showed me patterns my RE never caught. Turns out my progesterone was dropping too early. Kai flagged it in week 2." — Michelle, 37

"I honestly thought the personalized supplements were a gimmick until I compared my labs before and after. The numbers don't lie." — Andrea, 31

These are real women. Real data. Real results.

Your cart is still waiting:
[Complete Your Order →]

Sending you big love,
Kirsten`
  },
  {
    sequence: 3,
    phase: "risk-reversal",
    delayDays: 3,
    subject: "Not sure yet? Here's our promise",
    preview: "Zero risk — seriously. Here's how.",
    body: `Hi *|FNAME|*,

I know what it's like to spend money on something health-related and wonder if it's going to work. I've been on both sides of that — as a practitioner for 20 years, and as a woman who's navigated her own health challenges.

So let me remove the risk entirely:

OUR GUARANTEE:
- If your Halo Ring doesn't fit perfectly, we'll exchange it free — no questions
- If your supplements don't feel right, our team will adjust your formulation
- If you're not seeing value after 30 days, reach out and we'll make it right

We also offer free shipping on every order. No hidden fees, no surprise charges at checkout.

I didn't build Conceivable to collect one-time purchases. I built it to actually help women conceive. If it's not helping you, I want to know — and I want to fix it.

Your cart is still saved:
[Complete Your Order →]

Sending you big love,
Kirsten`
  },
  {
    sequence: 4,
    phase: "story",
    delayDays: 7,
    subject: "Why I built this (a personal note)",
    preview: "After 20 years, I couldn't stay quiet anymore",
    body: `Hi *|FNAME|*,

I'm going to take a different approach with this email. No cart reminders, no product pitches. Just the truth.

I've spent 20 years in reproductive health. I've worked with thousands of women. I've seen what works and what doesn't. And what I saw — over and over — broke my heart.

Women spending tens of thousands of dollars on fertility treatments with no understanding of their own bodies. Doctors running the same generic protocols regardless of individual biology. Supplement companies selling one-size-fits-all prenatals when every woman's biochemistry is different.

The data was right there. The science was right there. Nobody was connecting it for women in a way they could actually use.

That's why I built Conceivable. Not because the world needed another health app. But because women deserve to understand their own bodies — really understand them — with the same precision and personalization that exists in every other area of medicine.

The Halo Ring, the personalized supplements, Kai — they're not gimmicks. They're the tools I wish existed 20 years ago when I started this work.

I don't know where you are in your journey. But I know this: you deserve better than guessing.

Whenever you're ready, we're here:
[Your saved cart →]

Sending you big love,
Kirsten`
  },
  {
    sequence: 5,
    phase: "offer",
    delayDays: 10,
    subject: "A little something to help you decide",
    preview: "This won't last long — and I mean that",
    body: `Hi *|FNAME|*,

I've shared testimonials, our guarantee, and my personal story. If you're still on the fence, I respect that — this is a real decision about your health, not an impulse buy.

But I also don't want cost to be the thing that stands between you and taking control of your fertility journey.

So here's what I can do: 15% off your cart for the next 48 hours.

Use code MYJOURNEY at checkout.

This isn't a marketing trick that comes back every week. This is me saying: I believe in what we've built, I believe it can help you, and I want to make it as easy as possible for you to try it.

[Complete Your Order — 15% Off →]

After 48 hours, the code expires and your cart clears. No hard feelings either way.

But if there's a part of you that's been thinking "maybe I should just try it" — this is your sign.

Sending you big love,
Kirsten`
  },
];

// ============================================================
// POST-DOWNLOAD FLOW (7 emails)
// Trigger: App downloaded
// Goal: ACTIVATION + STICKINESS + RETENTION
// Teach them what the app does and how to use every feature
// Build the daily habit that keeps them coming back
// ============================================================

const POST_DOWNLOAD_EMAILS = [
  {
    sequence: 1,
    phase: "activation",
    delayDays: 0,
    subject: "Welcome to Conceivable — start here",
    preview: "Your fertility journey just got a co-pilot",
    body: `Hi *|FNAME|*,

You just downloaded Conceivable. Here's what you need to know in 60 seconds:

WHAT THIS APP ACTUALLY IS:
Conceivable is the first fertility platform that connects your daily data (sleep, cycle, biometrics, lifestyle) to a personalized AI coach who actually understands your body. It's not a period tracker. It's not a generic "tips" app. It's a system built on 20 years of reproductive medicine.

YOUR FIRST STEP (do this now — it takes 2 minutes):
Open the app and complete your health profile. This is how Kai (your AI fertility coach) learns about YOU. The more she knows, the more specific and useful her guidance becomes.

Without your profile, Kai is smart. With your profile, Kai is brilliant.

WHAT HAPPENS NEXT:
Over the next few weeks, I'm going to walk you through everything Conceivable can do — your Conceivable Score, how to use Kai, the Halo Ring, personalized supplements, and the daily habits that actually move the needle.

But first — open the app and finish your profile. Everything starts there.

Sending you big love,
Kirsten`
  },
  {
    sequence: 2,
    phase: "activation",
    delayDays: 1,
    subject: "Meet Kai — she's not what you expect",
    preview: "Your AI fertility coach is ready to talk",
    body: `Hi *|FNAME|*,

Let me introduce you to someone who's going to become really important in your journey.

Kai is your AI fertility coach inside the Conceivable app. But she's nothing like the chatbots you've dealt with before. Here's why:

WHAT KAI ACTUALLY DOES:
- Learns YOUR specific patterns (she gets smarter about you every day)
- Connects dots between your sleep, stress, cycle, nutrition, and fertility
- Gives you specific, actionable guidance based on YOUR data — not generic internet advice
- Flags things your doctor might miss (like subtle cycle changes or lifestyle patterns)

HOW TO USE KAI (try these right now):
Open the app, tap on Kai, and try one of these:

→ "What should I focus on this cycle?"
→ "How does my sleep affect my fertility?"
→ "What do my numbers mean?"
→ "I'm feeling stressed about TTC — can we talk?"

Kai isn't just clinical — she's warm, supportive, and honest. Think of her as having a board-certified fertility expert in your pocket who also happens to be a really good listener.

The women who talk to Kai regularly see the best results. Not because talking helps (although it does) — but because Kai spots patterns and opportunities that humans miss.

Try it today. You'll see what I mean.

Sending you big love,
Kirsten`
  },
  {
    sequence: 3,
    phase: "education",
    delayDays: 3,
    subject: "Your Conceivable Score — here's how to read it",
    preview: "The one number that shows your fertility trajectory",
    body: `Hi *|FNAME|*,

You've probably noticed a number in your app: your Conceivable Score.

Let me explain what it actually means, because this is the heartbeat of the whole system.

WHAT THE CONCEIVABLE SCORE IS:
A 0-100 score that reflects your overall fertility readiness based on everything we know about your body — cycle data, biometrics, lifestyle factors, supplement adherence, and more.

WHAT IT IS NOT:
- It is NOT a prediction of whether you'll get pregnant this month
- It is NOT a judgment or grade on your body
- It is NOT static — it changes based on what you DO

HOW TO READ IT:
- 80-100: Your body is in a strong place. Keep doing what you're doing.
- 60-79: Good foundation with room for optimization. Kai will tell you exactly where.
- 40-59: There are clear areas to improve. The good news? That means there's a lot you can DO.
- Below 40: Don't panic. This is a starting point, not a verdict. Many women start here and climb significantly.

THE MOST IMPORTANT THING:
Watch the TREND, not the number. A score of 55 that was 48 last month is incredible progress. A score of 75 that's been flat for 3 months means we need to adjust something.

Kai tracks your trend automatically and tells you what's moving the needle (and what isn't).

Open the app now and check your Conceivable Score. Then ask Kai: "What's driving my score this week?"

Sending you big love,
Kirsten`
  },
  {
    sequence: 4,
    phase: "education",
    delayDays: 5,
    subject: "The daily habit that changes everything",
    preview: "2 minutes a day. That's it. Here's the routine.",
    body: `Hi *|FNAME|*,

I'm going to give you the simplest possible daily routine for Conceivable. This is what our most successful members do, and it takes about 2 minutes:

MORNING (when you wake up):
1. Open the app
2. Check your Conceivable Score and overnight data (if you have the Halo Ring)
3. Read Kai's daily insight — she'll have something specific for you based on last night's data

ANYTIME:
4. Log anything relevant — how you slept, stress level, exercise, what you ate (you don't need to log everything, just what feels easy)

THAT'S IT.

You don't need to spend 30 minutes journaling. You don't need to obsess over every data point. The app and Kai do the heavy lifting — you just need to show up for 2 minutes a day.

Why this works: Conceivable gets exponentially smarter with consistent daily data. After 7 days, Kai starts spotting patterns. After 14 days, she's making connections your doctor doesn't have time to make. After a full cycle, she understands your body better than any single snapshot blood test ever could.

The women who check in daily — even briefly — see their Conceivable Scores improve 2-3x faster than women who check in weekly.

2 minutes. Every morning. That's the habit that changes everything.

Sending you big love,
Kirsten`
  },
  {
    sequence: 5,
    phase: "education",
    delayDays: 8,
    subject: "Unlock your full picture with the Halo Ring",
    preview: "What your body is telling you while you sleep",
    body: `Hi *|FNAME|*,

If you already have your Halo Ring — this email will help you get way more out of it.
If you don't have one yet — this will show you why it's a game changer.

WHAT THE HALO RING TRACKS (while you sleep):
- Heart rate variability (HRV) — directly correlates with hormonal health and stress
- Skin temperature shifts — can detect ovulation and luteal phase changes
- Respiratory rate — reflects overall physiological stress
- Movement and sleep quality — because sleep is the most underrated fertility factor

WHY THIS DATA MATTERS:
Most fertility tracking relies on what you TELL the app. The Halo Ring captures what your BODY tells the app — automatically, passively, every single night.

This is the difference between "I think I ovulated around day 14" and "Your temperature shift and HRV data confirm ovulation on day 13, and your luteal phase HRV pattern looks stronger than last month."

Kai uses Halo Ring data to give you dramatically more specific guidance. She can see things you can't feel.

IF YOU HAVE YOUR HALO RING:
- Make sure you're wearing it every night (it takes 3-5 nights to calibrate)
- Check your morning data in the app — Kai will walk you through what it means
- Ask Kai: "What did my Halo Ring data show last night?"

IF YOU DON'T HAVE ONE YET:
The app works great on its own. But adding the Halo Ring is like going from standard definition to 4K — suddenly you can see everything in sharp detail.

Sending you big love,
Kirsten`
  },
  {
    sequence: 6,
    phase: "retention",
    delayDays: 14,
    subject: "Two weeks in — here's what Kai has learned about you",
    preview: "Your data is starting to tell a story",
    body: `Hi *|FNAME|*,

You've been on Conceivable for two weeks now, and something important is happening behind the scenes: Kai is learning you.

By now she's starting to see:
- How your sleep patterns affect your next-day energy and cycle
- Whether your stress levels are impacting your hormonal balance
- What your cycle is actually doing (not what the textbook says it should do)
- Which lifestyle factors are moving your Conceivable Score up or down

THIS IS THE INFLECTION POINT.

Most fertility apps give you the same generic advice on day 1 and day 100. Conceivable is different — it gets dramatically more useful the longer you use it.

The next two weeks are where personalization really kicks in. Kai will start making connections that are specific to YOUR body, YOUR patterns, YOUR life.

Here's what I'd suggest today:
1. Open the app and check your Conceivable Score trend (not just today's number — the trend)
2. Ask Kai: "What patterns have you noticed about me so far?"
3. Look at your insights tab — Kai has been saving observations about you

Also — you're not alone. There are thousands of women using Conceivable right now, on the same journey. If you ever feel isolated in this process, remember that.

Keep showing up. It's working, even when it doesn't feel like it.

Sending you big love,
Kirsten`
  },
  {
    sequence: 7,
    phase: "retention",
    delayDays: 21,
    subject: "Your 3-week check-in (+ features you might have missed)",
    preview: "Are you using all of these? Most people miss #3",
    body: `Hi *|FNAME|*,

Three weeks. You're building a real foundation here.

I want to make sure you're getting the FULL value of Conceivable, because most members don't discover everything in the first few weeks. Here's a quick feature checklist:

CORE FEATURES (you're probably using these):
☑ Conceivable Score — your daily fertility readiness snapshot
☑ Kai conversations — asking questions, getting personalized guidance
☑ Daily logging — sleep, stress, cycle, lifestyle

FEATURES YOU MIGHT HAVE MISSED:
☐ Cycle Insights — tap into your cycle view for phase-specific guidance (what to eat, how to exercise, what to supplement during each phase)
☐ Ask Kai about your partner — "What should my partner be doing?" (men's factors matter too)
☐ Supplement check — ask Kai "Are my supplements working?" for a data-driven assessment
☐ Weekly digest — every Monday, Kai summarizes your week with specific action items
☐ Share with your doctor — export your Conceivable data to bring to appointments (this blows doctors' minds)

THE HABIT CHECK:
Are you still doing your 2-minute morning check-in? If you've fallen off, today is a perfect day to restart. No guilt. Just open the app and say hi to Kai.

Your Conceivable Score after 3 weeks of consistent data is infinitely more valuable than your score on day 1. You're past the calibration period. The real insights start now.

What do you want to focus on this month? Open the app and tell Kai. She'll build a plan.

Sending you big love,
Kirsten`
  },
];

// ============================================================
// POST-DOWNLOAD NUDGE FLOW (3 emails)
// Trigger: Downloaded but didn't complete profile
// Goal: Get them back in the app
// ============================================================

const POST_DOWNLOAD_NUDGE_EMAILS = [
  {
    sequence: 1,
    phase: "nudge",
    delayDays: 1,
    subject: "Your personalized plan is waiting",
    preview: "2 minutes to set up — then Kai takes over",
    body: `Hi *|FNAME|*,

I noticed you downloaded Conceivable but haven't finished setting up your profile yet. Totally normal — life gets in the way.

Here's why it's worth 2 minutes of your time:

Without your profile, the app gives you general guidance (still helpful).
WITH your profile, Kai becomes your personal fertility expert — specific to your age, cycle, history, goals, and body.

It's the difference between Googling "fertility tips" and having a board-certified specialist sit down with you one-on-one.

The profile takes about 2 minutes. Open the app and finish where you left off — Kai is ready to give you something personalized as soon as you do.

Sending you big love,
Kirsten`
  },
  {
    sequence: 2,
    phase: "nudge",
    delayDays: 3,
    subject: "I get it — fertility stuff can feel overwhelming",
    preview: "Start with just one question. That's it.",
    body: `Hi *|FNAME|*,

I've worked with thousands of women on their fertility journeys, and I know this feeling: you downloaded the app in a moment of motivation, and then the weight of it all hit you.

"What if the numbers are bad?"
"What if I'm not doing enough?"
"What if this is just another thing that doesn't work?"

I hear you. And here's what I want you to know: Conceivable isn't about adding pressure. It's about removing confusion.

You don't have to do everything at once. You don't have to be perfect. You just have to start.

Here's the lowest-pressure way to begin: open the app, tap on Kai, and ask her one question. Any question. Try:

→ "I'm new here — what should I know?"
→ "I'm overwhelmed with TTC — can you help me simplify?"
→ "What's the most important thing I can do this week?"

That's it. One question. See how it feels. No commitment, no pressure, no judgment.

Kai is patient. She'll be there whenever you're ready.

Sending you big love,
Kirsten`
  },
  {
    sequence: 3,
    phase: "nudge",
    delayDays: 7,
    subject: "We saved your spot",
    preview: "Whenever you're ready — no expiration, no pressure",
    body: `Hi *|FNAME|*,

Last email about this — I promise.

Your Conceivable account is set up and waiting for you. Nothing has expired. Kai is still there. Your personalized experience is still ready to be built.

Some women jump in on day one. Some women need a few weeks to feel ready. Both are completely valid.

When you're ready, here's all you need to do:
1. Open the Conceivable app
2. Finish your 2-minute health profile
3. Ask Kai your first question

That's the whole thing. Three steps. Then Kai handles the rest.

And if you're going through something hard right now — a tough cycle, a loss, a wave of doubt — I want you to know that Conceivable was built for moments exactly like this. Not to add one more thing to your plate, but to take things OFF your plate by giving you clarity.

Whenever you're ready. We're here.

Sending you big love,
Kirsten`
  },
];

export async function POST() {
  try {
    const allEmails = [
      ...POST_PURCHASE_EMAILS.map((e) => ({
        ...e, flow: "post-purchase" as const, week: 0,
        delayHours: e.delayHours ?? null, delayDays: e.delayDays ?? null,
      })),
      ...ABANDONED_CART_EMAILS.map((e) => ({
        ...e, flow: "abandoned-cart" as const, week: 0,
        delayHours: e.delayHours ?? null, delayDays: e.delayDays ?? null,
      })),
      ...POST_DOWNLOAD_EMAILS.map((e) => ({
        ...e, flow: "post-download" as const, week: 0,
        delayHours: null, delayDays: e.delayDays ?? null,
      })),
      ...POST_DOWNLOAD_NUDGE_EMAILS.map((e) => ({
        ...e, flow: "post-download-nudge" as const, week: 0,
        delayHours: null, delayDays: e.delayDays ?? null,
      })),
    ];

    const results = [];
    for (const email of allEmails) {
      const created = await prisma.email.create({
        data: {
          week: email.week,
          sequence: email.sequence,
          phase: email.phase,
          flow: email.flow,
          delayDays: email.delayDays,
          delayHours: email.delayHours,
          subject: email.subject,
          preview: email.preview,
          body: email.body,
          status: "approved",
        },
      });
      results.push({ id: created.id, flow: email.flow, sequence: email.sequence, subject: email.subject });
    }

    const summary = {
      "post-purchase": results.filter((r) => r.flow === "post-purchase").length,
      "abandoned-cart": results.filter((r) => r.flow === "abandoned-cart").length,
      "post-download": results.filter((r) => r.flow === "post-download").length,
      "post-download-nudge": results.filter((r) => r.flow === "post-download-nudge").length,
    };

    return NextResponse.json({
      ok: true,
      message: `Created ${results.length} automation emails across 4 flows`,
      summary,
      emails: results,
    });
  } catch (err) {
    console.error("Seed flows error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to seed flows" },
      { status: 500 }
    );
  }
}

// GET: Preview all flows without writing to DB
export async function GET() {
  const existing = await prisma.email.findMany({
    where: { flow: { not: "launch" } },
    orderBy: [{ flow: "asc" }, { sequence: "asc" }],
    select: { id: true, flow: true, sequence: true, phase: true, subject: true, delayDays: true, delayHours: true, status: true },
  });

  if (existing.length > 0) {
    return NextResponse.json({
      message: "Automation flows already exist in DB",
      count: existing.length,
      flows: existing,
    });
  }

  return NextResponse.json({
    message: "No automation flows found. POST to this endpoint to create them.",
    planned: {
      "post-purchase": 8,
      "abandoned-cart": 5,
      "post-download": 7,
      "post-download-nudge": 3,
      total: 23,
    },
  });
}
