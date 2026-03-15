// Nurture Email Sequence — Early Access Campaign
// Full email content in Kirsten's voice

export interface NurtureEmail {
  id: string;
  emailNumber: number;
  sendDay: number;
  subject: string;
  previewText: string;
  body: string;
  tags: string[];
  status: "draft" | "approved" | "scheduled" | "sent";
}

export const NURTURE_EMAILS: NurtureEmail[] = [
  // ─────────────────────────────────────────────────────
  // EMAIL 1 — Day 0
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-01",
    emailNumber: 1,
    sendDay: 0,
    subject: "Your Conceivable Score + Your Free Fertility Starter Kit",
    previewText: "Here's what your score actually means (and what to do about it)",
    tags: ["nurture", "welcome", "starter-kit", "score-delivery"],
    status: "draft",
    body: `Hi *|FNAME|*,

First things first — your Conceivable Score is *|QKRESULT|*.

Now, before you spiral (I see you), let me tell you what that actually means.

Your Conceivable Score isn't a pass or fail. It's a snapshot of where your body is RIGHT NOW across the five factors that matter most for fertility: inflammation, blood sugar regulation, hormonal balance, stress resilience, and nutritional status.

And the beautiful thing? Every single one of those factors is something you can change.

I've put together a free Fertility Starter Kit for you that breaks down exactly what your score means and gives you the first steps to start shifting it. You can grab it here:

[Download Your Free Fertility Starter Kit →]

Here's one thing you can do TODAY that will move the needle: eat a protein-rich breakfast within 90 minutes of waking up. I know that sounds almost annoyingly simple, but blood sugar stability in the morning sets the hormonal tone for your entire day. Scrambled eggs, a smoothie with collagen and nut butter, even leftovers from last night. Just get 20-30g of protein in before you reach for the coffee.

(Yes, you can still have the coffee. I'm not a monster.)

A little about me: I'm Kirsten Karchmer. I'm a board-certified reproductive health specialist, and I've spent the last 20 years helping women get pregnant — over 10,000 of them. I built Conceivable because I got tired of watching brilliant women get terrible fertility advice and spend tens of thousands of dollars on treatments they might not even need.

Over the next few weeks, I'm going to share things about your fertility that nobody's telling you. Not your doctor, not the internet, not your well-meaning friend who got pregnant on her first try. Real science, real strategies, real talk.

You deserve better than "just relax." Let's get started.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 2 — Day 2
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-02",
    emailNumber: 2,
    sendDay: 2,
    subject: "The one number your doctor isn't checking",
    previewText: "It's not your AMH. It's not your FSH. And it might be the key to everything.",
    tags: ["nurture", "education", "blood-sugar", "science"],
    status: "draft",
    body: `Hi *|FNAME|*,

Can I tell you something that genuinely makes me a little angry?

Most fertility doctors never check your fasting glucose or insulin levels. They'll run your AMH, your FSH, maybe a thyroid panel if you're lucky — but they almost never look at how your body is handling blood sugar.

And here's the thing: blood sugar instability is one of the most common — and most fixable — causes of fertility problems I've seen in 20 years of practice.

Here's the short version of the science:

When your blood sugar spikes and crashes throughout the day (hello, oatmeal for breakfast followed by a 10am energy crash), your body pumps out insulin to manage it. That excess insulin directly suppresses progesterone production. And progesterone? It's literally the hormone that holds a pregnancy in place. It's the hormone of gestation — it's right there in the name.

So when I see a woman with low progesterone, the first thing I look at isn't her ovaries. It's her breakfast.

This is one of the 5 factors that make up your Conceivable Score. And for a lot of women, it's the factor that's been quietly undermining everything else.

Here's what to look for:

- Do you crash in the afternoon and need sugar or caffeine to get through?
- Do you get shaky, irritable, or lightheaded if you skip a meal?
- Do you wake up at 3am and can't fall back asleep?
- Do you crave carbs and sweets, especially in your luteal phase?

If you nodded at even one of those — your blood sugar is talking to you. And it's probably talking to your hormones too.

The fix isn't complicated. It's not a diet. It's a pattern:

1. Protein + fat at every meal (especially breakfast)
2. Eat your veggies and protein BEFORE your carbs (seriously, the order matters)
3. Take a 10-minute walk after your biggest meal
4. Stop eating 3 hours before bed

That's it. Those four things can shift your progesterone levels within one cycle. I've seen it happen thousands of times.

We're building something at Conceivable that tracks exactly this — and gives you personalized supplement recommendations to support healthy blood sugar balance alongside these lifestyle shifts. More on that soon.

For now, try the protein-first breakfast for the next 5 days and see how you feel. I bet you'll notice a difference by day 3.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 3 — Day 4
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-03",
    emailNumber: 3,
    sendDay: 4,
    subject: "Why period pain isn't normal (and what's actually causing yours)",
    previewText: "We need to talk about what your doctor calls 'just cramps'",
    tags: ["nurture", "education", "inflammation", "periods"],
    status: "draft",
    body: `Hi *|FNAME|*,

I need to rant for a second.

If one more person tells me that period pain is "normal," I'm going to lose it. Mild awareness that your period is happening? Sure. But the kind of cramps that have you curled up with a heating pad, popping ibuprofen like candy, canceling plans? That is NOT normal. That is your body sending you a very clear signal.

And that signal? It's inflammation.

Here's what's actually happening: the lining of your uterus produces compounds called prostaglandins to help it contract and shed during your period. That's the normal part. But when your body is in a state of chronic low-grade inflammation — from diet, stress, poor sleep, environmental toxins — it overproduces prostaglandins.

Too many prostaglandins = too much contraction = that debilitating pain that makes you want to call in sick.

But here's the part nobody connects: that same inflammation that's causing your period pain? It's also affecting your egg quality, your implantation potential, and your hormonal balance. Inflammation is fertility enemy number one. (And yes, it's another one of the factors in your Conceivable Score.)

The biggest dietary drivers of inflammation I see:

- Seed oils (soybean, canola, sunflower — they're in EVERYTHING packaged)
- Excess sugar and refined carbs (see my last email about blood sugar)
- Dairy — not for everyone, but for many women it's a major trigger
- Alcohol (I know, I'm sorry, but even 2-3 drinks a week can measurably increase inflammatory markers)

And the things that bring it DOWN:

- Omega-3 fatty acids (wild salmon, sardines, high-quality fish oil)
- Turmeric and ginger (the real stuff, not the latte)
- Leafy greens — the more the better
- Quality sleep (we'll get to this one)

Here's my challenge for you: for your next cycle, try cutting seed oils for 2 weeks leading up to your period and adding a high-quality omega-3 supplement. Track your pain on a 1-10 scale.

I would bet money you'll see at least a 2-point drop. And that 2-point drop? It means your whole inflammatory picture is shifting — which means your fertility picture is shifting too.

Everything is connected. That's not a tagline. It's literally how your body works.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 4 — Day 7
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-04",
    emailNumber: 4,
    sendDay: 7,
    subject: "Meet your AI care team (they already know your score)",
    previewText: "Six AI specialists. One mission. And they've been studying your data.",
    tags: ["nurture", "product", "ai-team", "app-preview"],
    status: "draft",
    body: `Hi *|FNAME|*,

When I had my clinic, the thing that made us different wasn't just me — it was my team. I had nutritionists, herbalists, acupuncturists, data analysts, and patient navigators all working together for each woman.

The problem? That level of care cost a fortune and I could only help so many women at a time.

So when I built Conceivable, the first thing I asked was: what if every woman could have an entire care team in her pocket?

That's exactly what we built. Let me introduce you to your team:

**Kai** — Your AI Fertility Coach
Kai is the one you'll talk to most. Think of Kai as the coordinator — the one who sees the big picture of your Conceivable Score, connects the dots between your symptoms, and gives you your daily action plan. Kai knows your score, your patterns, your goals, and adjusts in real-time as your body changes. (Because it will change. That's the whole point.)

**Olive** — Nutrition Specialist
Olive is obsessed with the connection between what you eat and how your hormones behave. She'll build your meal plans, suggest fertility-boosting recipes based on where you are in your cycle, and gently redirect you when your blood sugar data says that afternoon muffin isn't doing you any favors. (She's nice about it though.)

**Seren** — Stress & Sleep Guide
Seren monitors your stress patterns and sleep quality because — and I cannot stress this enough — chronic stress suppresses ovulation. Period. Seren will catch the patterns before you do and give you specific techniques based on YOUR stress signature, not generic "try meditation" advice.

**Atlas** — Data & Pattern Analyst
Atlas is the quiet genius on the team. He's constantly analyzing your data — your cycle patterns, your biometrics, your lifestyle inputs — looking for correlations that a human might miss. Atlas is the one who'll say "hey, your progesterone symptoms improve by 40% in months where you walk 8,000+ steps daily." That kind of insight used to take years of clinical observation. Atlas does it in weeks.

**Zhen** — Supplement Specialist
Zhen designs your personalized supplement protocol. Not the generic prenatal-and-hope-for-the-best approach, but targeted supplementation based on your Conceivable Score and what your body actually needs right now. Your protocol evolves as your score changes — because what you need in month one might be totally different from month three.

**Navi** — Your Navigator
Navi is your guide through the whole experience. She helps you understand what's happening, what to expect, how to talk to your doctor about what you're learning, and keeps you from feeling overwhelmed. Because this is a lot of information, and having someone (even an AI someone) say "you're on track, here's what to focus on this week" makes all the difference.

Together, they're like having a world-class fertility clinic in your pocket. Except it costs a fraction of what my clinic did, it's available 24/7, and it gets smarter about YOUR body every single day.

We're putting the finishing touches on everything right now. And as an early access member, you're going to be among the first to meet your team.

More details coming soon. I'm so excited for you to experience this.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 5 — Day 10
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-05",
    emailNumber: 5,
    sendDay: 10,
    subject: "What 10,000 women taught me about fertility",
    previewText: "This is the email I almost didn't send.",
    tags: ["nurture", "story", "personal", "credibility"],
    status: "draft",
    body: `Hi *|FNAME|*,

I want to tell you something personal today.

When I opened my first fertility practice, I was 28 years old, freshly board-certified, and absolutely certain I could help every woman who walked through my door.

I was right about the helping part. I was wrong about how long it would take me to figure out WHY some women got pregnant easily and others didn't — even when their diagnoses looked the same on paper.

It took me about 3,000 patients to see the pattern.

Two women with the exact same FSH levels. Same age. Same BMI. Same "unexplained infertility" diagnosis. One would get pregnant in two months with me. The other would struggle for a year.

The difference was never one thing. It was five things. Five modifiable factors that, together, predicted fertility outcomes better than any single lab value: inflammation, blood sugar regulation, hormonal balance, stress resilience, and nutritional status.

When I started measuring all five and treating them together — instead of chasing one hormone or one supplement at a time — everything changed.

In our pilot programs, women improved their fertility markers by 150-260% within 90 days. Not by doing IVF. Not by spending $20,000. By understanding their bodies as a system and making targeted changes to the things that actually mattered.

That's not a marketing number. That's data from real women who had been told their only option was expensive interventions.

I've now worked with over 10,000 women. And the thing they all have in common — every single one — is that they were never given the whole picture. They'd get one piece of the puzzle from their RE, another from their acupuncturist, another from a book, another from Instagram. Nobody was connecting it all.

That's why I built Conceivable. Not because I wanted to build a tech company (trust me, that was not on my vision board). But because I realized that the system I'd developed — the one that was getting these results — could reach millions of women instead of the hundreds I could see in my clinic.

Every woman deserves to understand her own body. Not a dumbed-down version. Not the "just relax and it'll happen" version. The real, science-backed, empowering version.

That's what I'm building for you. And every time I read an email from a woman saying "why didn't anyone tell me this before?" — it reminds me exactly why.

Thank you for being here. I don't take it lightly.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 6 — Day 14
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-06",
    emailNumber: 6,
    sendDay: 14,
    subject: "Your Conceivable Score could be higher in 30 days",
    previewText: "Here's the actual timeline of what happens when you start optimizing",
    tags: ["nurture", "app-teaser", "score", "supplements"],
    status: "draft",
    body: `Hi *|FNAME|*,

Remember that Conceivable Score I shared with you two weeks ago?

Here's what most people don't realize: that score is not fixed. It's not your destiny. It's your starting point.

In our clinical data, women who follow their personalized Conceivable protocol see measurable score improvements within 30 days. Not "maybe you'll feel different" improvements — actual, trackable changes in the five factors that drive fertility.

Here's what the timeline typically looks like:

**Days 1-7:** Your energy stabilizes. The afternoon crash starts to fade. You sleep a little deeper. (This is blood sugar regulation kicking in.)

**Days 7-14:** Your digestion improves. Bloating decreases. Your skin starts to clear. (Inflammation is coming down.)

**Days 14-21:** Your mood evens out. PMS symptoms soften. You feel more like yourself. (Hormonal balance is shifting.)

**Days 21-30:** Your cycle starts to change. Periods become more predictable. Cervical fluid patterns normalize. (Your reproductive system is responding.)

**Days 30-90:** This is where the magic happens. Egg quality improvements, which take about 90 days to fully manifest, start showing up. Your score climbs. Your fertility picture transforms.

The Conceivable app tracks all of this in real-time. You'll see your score update as your body responds, and your AI care team adjusts your plan based on what's working and what needs more attention.

But here's the thing I want to be honest about: the app and your AI team are most effective when paired with the right nutritional support. Because you can eat perfectly (and who does, honestly) and still have gaps that matter for fertility.

That's why we created personalized supplement packs for Conceivable members. Not generic prenatals — targeted formulations based on YOUR score and YOUR specific needs. The supplements Zhen recommends for you will be different from what she recommends for the woman next to you, because your bodies need different things.

If you want to get a head start before the app launches, we have our supplement packs available now. They're designed to start shifting the foundational factors while you wait for the full experience.

[Explore Conceivable Supplements →]

Your body is ready to respond. It's just waiting for the right inputs.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 7 — Day 18
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-07",
    emailNumber: 7,
    sendDay: 18,
    subject: "Founding Member spots update: [X] remaining",
    previewText: "I wanted to give you the honest numbers before we open to the public",
    tags: ["nurture", "urgency", "founding-member", "conversion"],
    status: "draft",
    body: `Hi *|FNAME|*,

I'm going to be straight with you because that's how I am.

When we decided to launch Conceivable, we set aside 500 Founding Member spots. That's it. Not 5,000. Not "limited." Literally 500.

Here's why:

We're launching something that has never existed before — a full AI-powered fertility care team with personalized supplements, real-time biometric tracking, and clinical-grade protocols. We need our first members to get an incredible experience. White-glove. Responsive. Every question answered. Every feature tested.

We can't do that with 10,000 people. We can do it with 500.

Founding Members get:
- **Lifetime pricing** locked in at our launch rate (it's going up after this)
- **First access** to every new feature, including the Halo Ring
- **Direct input** into what we build — your feedback literally shapes the product
- **Personalized supplement packs** tailored to your Conceivable Score
- **Priority access** to Kirsten (that's me) for Q&As and live sessions

I've been watching the spots go, and I want to be real: they're moving faster than I expected. I'm not saying this to pressure you — I'm saying it because if you've been thinking about it, I'd hate for you to miss out because you were waiting for the "right time."

(There's no right time. There's just now and later. And later usually means never.)

What I can tell you is this: the women who've already signed up are exactly the kind of community I dreamed about building. Smart, proactive, done-with-the-BS women who want real answers.

You're one of them. I can tell because you're still reading these emails.

[Claim Your Founding Member Spot →]

No pressure. But also... a little pressure. Because 500 isn't a lot.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 8 — Day 21
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-08",
    emailNumber: 8,
    sendDay: 21,
    subject: "Have you started your supplements yet?",
    previewText: "Because the best time to plant a tree was 20 years ago (the second best time is now)",
    tags: ["nurture", "supplements", "cta", "conversion"],
    status: "draft",
    body: `Hi *|FNAME|*,

Quick check-in.

If you've been implementing the things I've shared over the last three weeks — the protein-first breakfasts, the anti-inflammatory swaps, the walking after meals — I bet you're already feeling different. Even a little.

But I want to talk about the piece that most women skip: supplementation.

And I get why they skip it. The supplement aisle is a nightmare. Every brand claims they're the best. Your doctor says "just take a prenatal." Your friend swears by some mushroom powder she found on TikTok. And you end up either taking nothing or taking a bunch of random things that may or may not be helping.

Here's what I know after 20 years: targeted supplementation changes outcomes. But ONLY when it's targeted.

A generic prenatal is like a generic prescription. It might cover the basics, but it's not addressing YOUR specific gaps. And in fertility, the gaps matter. A lot.

Based on your Conceivable Score, your supplement protocol would focus on the specific factors where your body needs the most support. For some women, that's heavy on blood sugar regulation support (berberine, chromium, myo-inositol). For others, it's inflammation (omega-3s, curcumin, SPMs). For others, it's hormonal balance (vitex, DIM, B6).

Your combination is as unique as your fingerprint.

We've designed Conceivable supplement packs to take the guesswork out of this entirely. Based on your score, Zhen — your AI supplement specialist — creates your personalized protocol. It arrives at your door in daily packs so you don't have to think about it. And as your score changes, your protocol evolves with you.

Here's what I want you to know: every cycle matters. Every month of optimized nutrition is a month where your eggs are developing in a better environment, your uterine lining is getting better blood flow, your hormones are finding their rhythm.

You've already taken the first step by taking the quiz. The women who see the biggest transformations are the ones who keep going.

[Get Your Personalized Supplement Pack →]

I'm rooting for you. Hard.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 9 — Day 25
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-09",
    emailNumber: 9,
    sendDay: 25,
    subject: "The Halo Ring is coming (and early access members get first dibs)",
    previewText: "The wearable I've been waiting 20 years for someone to build... so I built it myself",
    tags: ["nurture", "halo-ring", "product", "pre-order"],
    status: "draft",
    body: `Hi *|FNAME|*,

Okay, I've been holding this one in and I can't anymore.

We're building a wearable ring called the Halo Ring. And it is going to change everything about how you understand your fertility.

Here's the backstory: for 20 years, I've been asking women to track things. Temperature. Cervical fluid. Symptoms. Cycle length. And they do it — because they're dedicated and want answers. But the data was always incomplete, always after-the-fact, and always dependent on someone remembering to do it.

I kept thinking: what if the tracking just... happened? What if you could wear something beautiful and unobtrusive that quietly collected the exact biometric data I needed to help you — and then fed it directly to your AI care team?

That's the Halo Ring.

It tracks:
- **Continuous temperature** — not a single morning reading, but your full thermal pattern across the day and night
- **Heart rate variability (HRV)** — the single best biomarker for stress resilience and autonomic nervous system health
- **Sleep architecture** — not just "hours slept" but deep sleep, REM, sleep onset latency, wake events
- **Activity patterns** — steps, movement, rest periods
- **Blood oxygen** — because it matters more than people think

All of this data flows directly into your Conceivable Score in real-time. Atlas (your data analyst AI) uses it to spot patterns that would be invisible otherwise. Things like: your HRV drops 3 days before your period, which correlates with your progesterone pattern, which suggests a specific intervention.

That's the kind of clinical insight that used to require a $500 lab visit. The Halo Ring gives it to you every day.

And it's beautiful. It's not a chunky fitness tracker. It's a slim, elegant ring that looks like jewelry. Because you shouldn't have to choose between taking care of your health and looking like yourself.

Here's the exciting part: early access members get first dibs when the Halo Ring ships. And right now, we're offering a $50 early access discount for women on our waitlist.

[Reserve Your Halo Ring — $50 Off →]

I have dreamed about this for literally two decades. The technology is finally here to give women the same quality of biometric data that elite athletes get — and pair it with the fertility intelligence that only Conceivable has.

I'm giddy. Can you tell?

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },

  // ─────────────────────────────────────────────────────
  // EMAIL 10 — Day 28
  // ─────────────────────────────────────────────────────
  {
    id: "nurture-10",
    emailNumber: 10,
    sendDay: 28,
    subject: "Launch is [X] days away",
    previewText: "Everything we've been building is almost ready. Here's what's coming.",
    tags: ["nurture", "launch", "countdown", "excitement"],
    status: "draft",
    body: `Hi *|FNAME|*,

We're almost there.

In just a few weeks, Conceivable is going live. And I wanted to take a minute — just you and me — to tell you what that means.

It means the thing I've been building for the last three years — the thing I left my successful practice to create, the thing I've poured every ounce of clinical knowledge, every patient story, every data point into — is about to be in your hands.

Here's what's launching:

**The Conceivable App**
Your personalized fertility command center. Your Conceivable Score front and center, updated in real-time. Daily action plans from Kai. Nutrition guidance from Olive. Stress and sleep insights from Seren. Data analysis from Atlas. Supplement protocols from Zhen. And Navi to guide you through all of it. It's like having my entire clinical team on call, 24/7, for a fraction of what my clinic cost.

**Personalized Supplement Packs**
Tailored to your score, your body, your specific needs. Arriving at your door in daily packs. Evolving as your body changes. No guesswork, no generic prenatals, no drawer full of random bottles.

**The Halo Ring** (coming soon after launch)
Continuous biometric tracking that feeds directly into your AI care team. Effortless data collection. Beautiful design. Clinical-grade insights from your finger.

**The Community**
This one might be my favorite. A space for Founding Members to connect, share, support each other, and have direct access to me. Because this journey is hard enough without doing it alone.

I built this for the woman who's Googling "why can't I get pregnant" at 2am.

For the woman who's been told "everything looks fine" but knows something is off.

For the woman who's spent $30,000 on IVF and nobody ever mentioned her blood sugar.

For the woman who just wants someone to tell her the truth about her body and then actually help her do something about it.

If that's you — I'm so glad you're here. And I'm so ready for you to experience what we've built.

Founding Member spots are still available, but not for long. If you haven't secured yours yet, now is the time.

[Become a Founding Member →]

See you on the other side.

Sending you big love,
Kirsten

P.S. Know someone struggling with fertility? Forward this email or share your link: *|REFERRAL_LINK|*`,
  },
];
