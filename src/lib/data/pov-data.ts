// POV Knowledge Base — Kirsten Brain seed data
// Persistent store of CEO point-of-view recordings with AI-extracted insights

export type EmotionalTone =
  | "passionate"
  | "confident"
  | "warm-educational"
  | "excited"
  | "strategic-calm"
  | "energized"
  | "urgent"
  | "measured";

export type POVSourceType = "voice" | "text" | "quick-capture";

export interface POVEntry {
  id: string;
  topic: string;
  transcript: string;
  sourceType: POVSourceType;
  sourceId?: string; // links back to news/research item if originated there
  createdAt: string;
  durationSeconds?: number;
  // AI-extracted fields (populated by content-engine agent)
  keyPositions: string[];
  analogies: string[];
  emotionalTone: EmotionalTone | "";
  relatedTopics: string[];
}

// ============================================================
// SEED DATA — 8 realistic POV entries
// ============================================================

export const SEED_POVS: POVEntry[] = [
  {
    id: "pov-001",
    topic: "Why single-signal fertility tracking fails",
    transcript:
      "Here's what drives me crazy about the current fertility tracking landscape. Everyone is focused on one signal — temperature, or LH strips, or cervical mucus. And yes, each of those signals has value. But fertility is not a single-variable equation. Your body is a system. Temperature tells you ovulation happened — past tense. LH tells you it's about to happen — maybe. But neither tells you WHY your cycles are irregular, or what's actually driving your luteal phase defect, or why your progesterone is tanking at 7 DPO. That's like checking the weather but never looking at the barometric pressure, the humidity, the wind patterns. You get a snapshot, not a forecast. What Conceivable does is fundamentally different — we look at seven drivers simultaneously and find the pattern. That's not incremental improvement over a single signal. That's a paradigm shift.",
    sourceType: "voice",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 68,
    keyPositions: [
      "Single-signal tracking gives a snapshot, not a forecast",
      "Fertility is a multi-variable system, not a single equation",
      "Seven drivers simultaneously reveal the real pattern",
      "Knowing ovulation happened is different from knowing why cycles are irregular",
    ],
    analogies: [
      "Like checking the weather but never looking at barometric pressure, humidity, or wind patterns",
      "A snapshot vs. a forecast",
    ],
    emotionalTone: "passionate",
    relatedTopics: ["competitor analysis", "product differentiation", "closed-loop system", "multi-signal tracking"],
  },
  {
    id: "pov-002",
    topic: "The closed-loop system is our deepest moat",
    transcript:
      "When investors ask me what our moat is, I don't say AI. Everyone has AI. I don't say data. Data is a commodity. Our moat is the closed loop. Here's what I mean: we don't just measure. We measure, we identify the driver, we recommend the intervention, and then — this is the part nobody else does — we verify that the intervention worked. We close the loop. Oura can tell you your HRV dropped. Apple can tell you your cycle deviated. Natural Cycles can tell you when you ovulated. But none of them can tell you what to DO about it, and none of them can verify that what you did actually moved the needle. That feedback loop — measure, intervene, verify, adjust — that's clinical methodology applied to consumer health tech. And it compounds. Every cycle, the system learns. Every user's data makes the recommendations better for every other user. That's not a feature. That's a flywheel.",
    sourceType: "voice",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 74,
    keyPositions: [
      "Our moat is the closed-loop system, not AI or data alone",
      "Measure → identify driver → recommend → verify → adjust",
      "Nobody else closes the loop from detection to verification",
      "Compounds over time — every cycle makes the system smarter",
    ],
    analogies: [
      "Clinical methodology applied to consumer health tech",
      "Not a feature — it's a flywheel",
    ],
    emotionalTone: "confident",
    relatedTopics: ["competitive moat", "flywheel", "fundraising", "investor narrative", "closed-loop system"],
  },
  {
    id: "pov-003",
    topic: "Seed cycling — validating interest while correcting science",
    transcript:
      "So this seed cycling TikTok just blew up — 4 million views. And my first instinct is not to attack it. My instinct is to understand why it resonated. Women are hungry for natural, food-based approaches to hormonal health. That desire is valid and beautiful. The problem is the claim, not the curiosity. Flax seeds do contain lignans with weak estrogenic activity. That's real science. But 'reset your hormones in 30 days' by rotating seeds? That's not supported by any clinical evidence I've seen. So our content approach should be: validate the interest, honor the curiosity, and then gently, respectfully redirect to what the evidence actually shows. We never punch down at influencers. We elevate the conversation. That's how Conceivable builds trust — by being the bridge between what women want to believe and what science can actually support.",
    sourceType: "voice",
    sourceId: "news-03",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 62,
    keyPositions: [
      "Validate the curiosity, correct the overreach",
      "Lignans in flax seeds have weak estrogenic activity — that's real",
      "'Reset hormones in 30 days' is not clinically supported",
      "Never punch down at influencers — elevate the conversation",
    ],
    analogies: [
      "Bridge between what women want to believe and what science can support",
    ],
    emotionalTone: "warm-educational",
    relatedTopics: ["content strategy", "misinformation response", "seed cycling", "social media", "trust building"],
  },
  {
    id: "pov-004",
    topic: "Stress biomarkers and IVF outcomes",
    transcript:
      "The Harvard study just published in Fertility and Sterility — 847 women, prospective study — showing that cortisol patterns and HRV predict IVF outcomes with 71% accuracy. This is huge for us. Not because it's new science — we've been building on this hypothesis for two years. But because Harvard just validated it with rigorous methodology. 71% accuracy from wearable HRV data alone. And the key finding: women with disrupted cortisol rhythms had 40% lower implantation rates. 40%! That's not marginal. That's the difference between success and failure for many women. And here's what makes me excited: they measured stress but didn't intervene on it. They proved the correlation but didn't close the loop. That's exactly where Conceivable lives — we don't just detect the stress pattern, we help you change it, and then we verify it changed.",
    sourceType: "voice",
    sourceId: "news-07",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 71,
    keyPositions: [
      "Harvard validated our stress-fertility hypothesis with rigorous methodology",
      "71% accuracy predicting IVF outcomes from wearable data",
      "Disrupted cortisol = 40% lower implantation rates",
      "They proved correlation but didn't close the loop — that's our opportunity",
    ],
    analogies: [
      "The difference between a thermometer and a thermostat — they measured the temperature, we change it",
    ],
    emotionalTone: "excited",
    relatedTopics: ["research validation", "HRV", "cortisol", "IVF", "stress biomarkers", "closed-loop system"],
  },
  {
    id: "pov-005",
    topic: "Why we're software-first, not hardware-first",
    transcript:
      "Ava just shut down their consumer hardware. $40 million in venture funding, and the hardware-first approach didn't work. This validates something we decided early on: we're software-first. There are already 100 million wearables on wrists — Apple Watch, Oura, Garmin, Whoop. We don't need to build hardware. We need to build the intelligence layer that sits on top of all of them. The hardware companies are competing on sensors. We're competing on insight. A raw HRV number means nothing to a woman trying to conceive. What matters is: your HRV pattern this cycle suggests your luteal phase progesterone may be insufficient, and here's what you can do about it starting today. That translation from data to actionable insight — that's the software moat. Hardware is expensive, margins are thin, customer acquisition is brutal. Software scales. Intelligence compounds.",
    sourceType: "voice",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 58,
    keyPositions: [
      "Ava's $40M hardware-first failure validates our software-first approach",
      "100M+ wearables already on wrists — we build the intelligence layer",
      "Hardware companies compete on sensors; we compete on insight",
      "Translation from raw data to actionable insight is the real moat",
    ],
    analogies: [
      "Hardware companies are building thermometers; we're building the thermostat",
      "A raw HRV number means nothing — the insight is what matters",
    ],
    emotionalTone: "strategic-calm",
    relatedTopics: ["business strategy", "competitive positioning", "Ava", "wearables", "software moat"],
  },
  {
    id: "pov-006",
    topic: "PCOS content series opportunity",
    transcript:
      "PCOS content is getting 3x normal engagement right now. Awareness month is approaching and there's a massive gap — most of the content is personal stories, which are powerful and important, but there's almost no science-based educational content from credible sources. We can fill that gap. I'm thinking a 10-piece series: the four PCOS phenotypes nobody talks about, how each driver in our system relates to PCOS specifically, what the research shows about dietary interventions versus what TikTok claims, the insulin resistance connection — because 70% of PCOS cases are insulin-resistant and most women don't know that. This is time-sensitive. We need to start publishing within days to catch the wave. And this isn't just content — this positions Conceivable as THE authoritative voice on PCOS in the digital health space.",
    sourceType: "voice",
    sourceId: "news-10",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 65,
    keyPositions: [
      "PCOS content getting 3x normal engagement — massive opportunity",
      "Gap in science-based educational content from credible sources",
      "10-piece series covering phenotypes, drivers, diet, insulin resistance",
      "70% of PCOS cases are insulin-resistant — most women don't know",
    ],
    analogies: [],
    emotionalTone: "energized",
    relatedTopics: ["PCOS", "content strategy", "social media", "awareness month", "thought leadership"],
  },
  {
    id: "pov-007",
    topic: "The 1 in 6 statistic and our TAM",
    transcript:
      "WHO just published their report — 1 in 6 people globally experience infertility. 17.5% of the adult population. Let that sink in. In the US alone, that's roughly 50 million people of reproductive age affected. And the average cost of one IVF cycle is $12,500, which means most people can't afford the current solution. That's our total addressable market. Not the people who can afford IVF — the people who can't. The people who need something between 'just relax' and '$50,000 of fertility treatments.' That middle ground doesn't exist right now. We're building it. When I talk to investors, I lead with this: the WHO just validated that 1 in 6 is the real number, access to care is the real problem, and technology is the real solution. We're not building a nice-to-have. We're building healthcare infrastructure for a population that the current system has failed.",
    sourceType: "voice",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 72,
    keyPositions: [
      "1 in 6 people globally experience infertility — WHO validated",
      "~50M people of reproductive age affected in the US alone",
      "The gap between 'just relax' and '$50K IVF' is our market",
      "We're building healthcare infrastructure for a failed system",
    ],
    analogies: [
      "The middle ground between 'just relax' and $50,000 of fertility treatments",
    ],
    emotionalTone: "urgent",
    relatedTopics: ["TAM", "fundraising", "WHO report", "access to care", "investor narrative"],
  },
  {
    id: "pov-008",
    topic: "Apple Health cycle alerts — great for market education",
    transcript:
      "Apple is adding cycle deviation alerts in iOS 19. When your cycle changes by more than seven days, you get a notification suggesting you see a doctor. This is great for us, actually. Not because we're competing with Apple — we're not. Apple's approach is: detect, alert, see your doctor. Their job ends at the notification. Our approach is: detect the deviation, identify which of the seven drivers is likely causing it, recommend a personalized intervention, and verify that the intervention restored cycle regularity. Apple is teaching hundreds of millions of women that cycle patterns matter. That's market education at a scale we could never afford. And when those women get the alert and think 'okay, my cycle changed — now what?' — that's when they need Conceivable. Apple builds the awareness. We provide the answer.",
    sourceType: "voice",
    sourceId: "news-06",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 59,
    keyPositions: [
      "Apple teaches hundreds of millions that cycle patterns matter — free market education",
      "Apple's job ends at the notification; ours begins there",
      "Detect → identify driver → intervene → verify is our differentiation",
      "When women think 'my cycle changed, now what?' — they need Conceivable",
    ],
    analogies: [
      "Apple builds the awareness, we provide the answer",
    ],
    emotionalTone: "measured",
    relatedTopics: ["Apple Health", "competitor analysis", "market education", "iOS 19", "cycle tracking"],
  },
];
