import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── Test emails to exclude ─────────────────────────────────── */
const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com"];

/* ── Keyword dictionaries ───────────────────────────────────── */

const CONCERN_KEYWORDS: Record<string, RegExp> = {
  PCOS: /\bpcos\b/i,
  Endometriosis: /\bendo(?:metriosis)?\b/i,
  IVF: /\bivf\b/i,
  IUI: /\biui\b/i,
  Miscarriage: /\bmiscarriage|pregnancy loss|lost (?:a |my )?(?:baby|pregnancy)\b/i,
  "Male Factor": /\bmale factor|sperm|his fertility|husband.?s (?:count|motility|morphology)\b/i,
  "Insulin Resistance": /\binsulin resist|blood sugar issue|metformin|pcos.*insulin|insulin/i,
  "Low AMH": /\blow amh|amh (?:is |of )?\d/i,
  "Egg Quality": /\begg quality|egg health|poor eggs\b/i,
  "Thyroid Issues": /\bthyroid|tsh|hashimoto|hypothyroid|hyperthyroid/i,
  "Luteal Phase Defect": /\bluteal phase|short luteal|lpd\b/i,
  "Unexplained Infertility": /\bunexplained\b/i,
  "Recurrent Loss": /\brecurrent (?:loss|miscarriage)|multiple miscarriage/i,
  "Irregular Cycles": /\birregular cycle|irregular period|no period|anovulat/i,
  "Trying to Conceive": /\bttc\b|trying to (?:conceive|get pregnant)/i,
  "Staying Pregnant": /\bstay(?:ing)? pregnant\b/i,
  "Currently Pregnant": /\bcurrently pregnant|i(?:'| a)m pregnant|weeks pregnant/i,
};

const OBJECTION_KEYWORDS: Record<string, RegExp> = {
  "Price / too expensive": /\bexpensive|cost|price|afford|budget|too much money|pricey\b/i,
  "Already taking supplements": /\balready tak|currently tak|i take|i(?:'| a)m on\b/i,
  "Need to think about it": /\bneed to think|think about it|not sure yet|consider|let me think\b/i,
  "Want to ask my doctor": /\bask (?:my )?doctor|check with (?:my )?(?:doctor|ob|gyn|re |specialist)|doctor first\b/i,
  "Not ready yet": /\bnot ready|not right now|maybe later|not yet\b/i,
  "Skeptical / does it work": /\bdoes it (?:work|help)|skeptic|proof|evidence|clinical|really work\b/i,
  "Partner needs convincing": /\bpartner|husband|spouse|convince|talk to (?:him|her|them)\b/i,
};

const EMOTION_KEYWORDS: Record<string, RegExp> = {
  Overwhelmed: /\boverwhelm|so much|too much info|don(?:'|')t know where to start/i,
  Hopeful: /\bhopeful|optimis|excited|can(?:'|')t wait|positive\b/i,
  Frustrated: /\bfrustrat|annoyed|fed up|sick of|tired of\b/i,
  Scared: /\bscar(?:ed|y)|afraid|terrif|nervous|anxious|anxiety|worry|worried\b/i,
  Sad: /\bsad|depress|devastat|heartbr|crying|cried|grief\b/i,
  Lonely: /\blonely|alone|isolat|no one understand|nobody gets\b/i,
  Confused: /\bconfus|lost|don(?:'|')t understand|overwhelm|what do i do\b/i,
  Grateful: /\bgrateful|thankful|thank you|thanks so much|appreciate\b/i,
  Determined: /\bdetermin|ready|commit|going to do|i will|let(?:'|')s do\b/i,
  Empowered: /\bempower|in control|proactive|taking charge|finally\b/i,
};

const SUPPLEMENT_KEYWORDS: Record<string, RegExp> = {
  CoQ10: /\bcoq10|coenzyme q|ubiquinol\b/i,
  "Vitamin D": /\bvitamin d|vit d\b/i,
  Folate: /\bfolate|folic acid|methylfolate|5-mthf\b/i,
  Omega3: /\bomega.?3|fish oil|dha|epa\b/i,
  Iron: /\biron\b/i,
  Magnesium: /\bmagnesium\b/i,
  Zinc: /\bzinc\b/i,
  "Vitamin B12": /\bb12|b-12|vitamin b12\b/i,
  Inositol: /\binositol|myo.?inositol|d-chiro/i,
  NAC: /\bnac\b|n-acetyl.?cysteine/i,
  Selenium: /\bselenium\b/i,
  "Vitamin C": /\bvitamin c|vit c\b/i,
  "Vitamin E": /\bvitamin e|vit e\b/i,
  Prenatal: /\bprenatal|pre-natal\b/i,
  Probiotic: /\bprobiotic|gut health|microbiome\b/i,
  Ashwagandha: /\bashwagandha\b/i,
  "Vitex / Chasteberry": /\bvitex|chasteberry|chaste tree\b/i,
  DHEA: /\bdhea\b/i,
  Melatonin: /\bmelatonin\b/i,
  "Conceivable Pack": /\bpack\b|PACK_START|personalized supplement/i,
};

const CYCLE_KEYWORDS: Record<string, RegExp> = {
  "Short cycles": /\bshort cycle|cycle.{0,10}(?:2[0-3]|1\d) day/i,
  "Long cycles": /\blong cycle|cycle.{0,10}(?:3[5-9]|[4-9]\d) day/i,
  "Heavy bleeding": /\bheavy (?:bleed|period|flow)|flooding|soak(?:ing)? through/i,
  "Light bleeding": /\blight (?:bleed|period|flow)|spotting|barely (?:any|there)\b/i,
  Clotting: /\bclot|clump|tissue/i,
  "Painful periods": /\bpainful period|cramp|dysmenorrhea|debilitat/i,
  Spotting: /\bspotting|spot(?:ted)? before|breakthrough bleed/i,
  "No period": /\bno period|amenorrhea|haven(?:'|')t had (?:a |my )?period/i,
};

const ENERGY_STRESS_KEYWORDS: Record<string, RegExp> = {
  "Low energy": /\blow energy|exhaust|fatigu|so tired|always tired|no energy/i,
  "High stress": /\bhigh stress|very stress|so stress|burn.?out|overwhelm/i,
  "Sleep issues": /\binsomnia|can(?:'|')t sleep|sleep issue|wake up|poor sleep/i,
  "Moderate energy": /\bok(?:ay)? energy|decent energy|fine energy/i,
};

const QUESTION_TOPIC_KEYWORDS: Record<string, RegExp> = {
  Supplements: /\bsupplement|vitamin|mineral|take|dose|dosage/i,
  Diet: /\bdiet|eat|food|nutrition|anti-inflammat/i,
  "Cycle / Period": /\bcycle|period|bleed|menstrua|luteal|follicular|ovulat/i,
  Fertility: /\bfertil|conceiv|ttc|trying|pregnant|baby/i,
  "IVF / Treatment": /\bivf|iui|treatment|protocol|transfer|retrieval/i,
  "Hormones / Testing": /\bhormone|test|blood work|lab|amh|fsh|estrogen|progesterone/i,
  "Male Factor": /\bsperm|male|husband|partner(?:'|')s/i,
  "Lifestyle / Stress": /\bstress|exercise|sleep|lifestyle|yoga|meditat/i,
  Cost: /\bcost|price|insurance|expensive|afford/i,
  "How Conceivable Works": /\bhow (?:does|do) (?:you|it|this)|what is conceivable|what do you do/i,
};

/* ── Helpers ─────────────────────────────────────────────────── */

function matchKeywords<T extends Record<string, RegExp>>(text: string, dict: T): string[] {
  const matches: string[] = [];
  for (const [label, rx] of Object.entries(dict)) {
    if (rx.test(text)) matches.push(label);
  }
  return matches;
}

function extractAgeRange(text: string): string | null {
  // "I'm 34", "age 34", "34 years old", "34yo", "34 y/o"
  const m = text.match(/\b(?:i(?:'| a)m |age |i am )(\d{2})\b/i)
    || text.match(/\b(\d{2})\s*(?:years? old|yo|y\/o)\b/i);
  if (m) {
    const age = parseInt(m[1], 10);
    if (age >= 18 && age <= 55) {
      if (age < 25) return "Under 25";
      if (age < 30) return "25-29";
      if (age < 35) return "30-34";
      if (age < 40) return "35-39";
      if (age < 45) return "40-44";
      return "45+";
    }
  }
  return null;
}

function extractQuestions(text: string): string[] {
  const sentences = text.split(/[.!?\n]+/).filter(s => s.includes("?"));
  return sentences.map(s => s.trim()).filter(s => s.length > 10 && s.length < 200);
}

/* ── Main handler ────────────────────────────────────────────── */

export async function GET() {
  const allLogs = await prisma.kaiChatLog.findMany({
    where: {
      isTest: false,
      NOT: { email: { in: TEST_EMAILS } },
    },
    orderBy: { createdAt: "desc" },
  });

  /* ── Build per-user profiles ────────────────────────────────── */

  interface UserProfile {
    email: string;
    name: string | null;
    concerns: Set<string>;
    ageRange: string | null;
    cycleDetails: Set<string>;
    energyStress: Set<string>;
    supplements: Set<string>;
    objections: Set<string>;
    emotions: Set<string>;
    packPresented: boolean;
    cartShown: boolean;
    sessionIds: Set<string>;
    sessionCount: number;
    messageCount: number;
    questions: string[];
    lastSeen: Date;
    firstSeen: Date;
  }

  const userMap = new Map<string, UserProfile>();

  function getOrCreateProfile(email: string, name: string | null, createdAt: Date): UserProfile {
    const key = email.toLowerCase();
    if (!userMap.has(key)) {
      userMap.set(key, {
        email: key,
        name,
        concerns: new Set(),
        ageRange: null,
        cycleDetails: new Set(),
        energyStress: new Set(),
        supplements: new Set(),
        objections: new Set(),
        emotions: new Set(),
        packPresented: false,
        cartShown: false,
        sessionIds: new Set(),
        sessionCount: 0,
        messageCount: 0,
        questions: [],
        lastSeen: createdAt,
        firstSeen: createdAt,
      });
    }
    return userMap.get(key)!;
  }

  /* ── Aggregate counters ─────────────────────────────────────── */

  const concernCounts: Record<string, number> = {};
  const objectionCounts: Record<string, number> = {};
  const emotionCounts: Record<string, number> = {};
  const supplementCounts: Record<string, number> = {};
  const questionTopicCounts: Record<string, number> = {};
  const questionList: { question: string; topic: string }[] = [];
  const topicMessageCounts: Record<string, { total: number; sessions: Set<string> }> = {};
  const blockerPhrases: Record<string, number> = {};

  let totalPacksPresented = 0;
  let totalCartShown = 0;
  let totalMessages = 0;
  const sessionSet = new Set<string>();

  for (const log of allLogs) {
    totalMessages++;
    const userText = log.userMessage || "";
    const kaiText = log.kaiResponse || "";
    const combined = `${userText} ${kaiText}`;
    const sessionKey = log.sessionId || log.id;

    sessionSet.add(sessionKey);

    // Pack & cart detection
    const hasPack = kaiText.includes("PACK_START");
    const hasCart = kaiText.includes("conceivable.com/cart");

    // Per-user profile
    if (log.email && log.email.includes("@")) {
      const profile = getOrCreateProfile(log.email, log.name, log.createdAt);
      profile.messageCount++;
      if (log.sessionId) profile.sessionIds.add(log.sessionId);
      if (log.createdAt > profile.lastSeen) profile.lastSeen = log.createdAt;
      if (log.createdAt < profile.firstSeen) profile.firstSeen = log.createdAt;
      if (hasPack) profile.packPresented = true;
      if (hasCart) profile.cartShown = true;
      if (!profile.name && log.name) profile.name = log.name;

      // Concerns
      for (const c of matchKeywords(userText, CONCERN_KEYWORDS)) {
        profile.concerns.add(c);
      }
      // Also include DB concerns array
      if (log.concerns?.length) {
        for (const c of log.concerns) {
          const label = Object.keys(CONCERN_KEYWORDS).find(
            k => k.toLowerCase() === c.toLowerCase()
          ) || c;
          profile.concerns.add(label);
        }
      }

      // Age
      if (!profile.ageRange) {
        profile.ageRange = extractAgeRange(userText);
      }

      // Cycle
      for (const c of matchKeywords(userText, CYCLE_KEYWORDS)) profile.cycleDetails.add(c);
      // Energy/stress
      for (const e of matchKeywords(userText, ENERGY_STRESS_KEYWORDS)) profile.energyStress.add(e);
      // Supplements
      for (const s of matchKeywords(combined, SUPPLEMENT_KEYWORDS)) profile.supplements.add(s);
      if (log.supplements?.length) {
        for (const s of log.supplements) profile.supplements.add(s);
      }
      // Objections
      for (const o of matchKeywords(userText, OBJECTION_KEYWORDS)) profile.objections.add(o);
      // Emotions
      for (const em of matchKeywords(userText, EMOTION_KEYWORDS)) profile.emotions.add(em);
      // Questions
      const qs = extractQuestions(userText);
      profile.questions.push(...qs);
    }

    // ── Aggregate stats (all messages, not just ones with email) ──

    // Concerns
    for (const c of matchKeywords(userText, CONCERN_KEYWORDS)) {
      concernCounts[c] = (concernCounts[c] || 0) + 1;
    }

    // Objections (user text only)
    for (const o of matchKeywords(userText, OBJECTION_KEYWORDS)) {
      objectionCounts[o] = (objectionCounts[o] || 0) + 1;
    }

    // Emotions (user text only)
    for (const em of matchKeywords(userText, EMOTION_KEYWORDS)) {
      emotionCounts[em] = (emotionCounts[em] || 0) + 1;
    }

    // Supplements (combined)
    for (const s of matchKeywords(combined, SUPPLEMENT_KEYWORDS)) {
      supplementCounts[s] = (supplementCounts[s] || 0) + 1;
    }

    // Questions
    const userQuestions = extractQuestions(userText);
    for (const q of userQuestions) {
      for (const [topic, rx] of Object.entries(QUESTION_TOPIC_KEYWORDS)) {
        if (rx.test(q)) {
          questionTopicCounts[topic] = (questionTopicCounts[topic] || 0) + 1;
          questionList.push({ question: q, topic });
          break;
        }
      }
    }

    // Topic engagement (which topics produce longer conversations)
    for (const [topic, rx] of Object.entries(CONCERN_KEYWORDS)) {
      if (rx.test(combined)) {
        if (!topicMessageCounts[topic]) topicMessageCounts[topic] = { total: 0, sessions: new Set() };
        topicMessageCounts[topic].total++;
        topicMessageCounts[topic].sessions.add(sessionKey);
      }
    }

    // Pack presentation & cart
    if (hasPack) totalPacksPresented++;
    if (hasCart) totalCartShown++;

    // Conversion blockers: look at user messages that come after a pack was shown
    // We approximate by checking if user text in a session with a pack contains objection-like language
    if (hasPack || hasCart) {
      // The user response to a pack presentation
      const nextObjections = matchKeywords(userText, OBJECTION_KEYWORDS);
      for (const o of nextObjections) {
        blockerPhrases[o] = (blockerPhrases[o] || 0) + 1;
      }
    }
  }

  /* ── Finalize user profiles ─────────────────────────────────── */

  // Update session counts
  for (const profile of userMap.values()) {
    profile.sessionCount = Math.max(profile.sessionIds.size, 1);
  }

  const totalUsers = userMap.size;
  const totalSessions = sessionSet.size;
  const avgMsgsPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;
  const packPresentationRate = totalSessions > 0
    ? Math.round((totalPacksPresented / totalSessions) * 100)
    : 0;

  // Sort profiles by last seen, take top 20
  const sortedProfiles = Array.from(userMap.values())
    .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
    .slice(0, 20)
    .map(p => ({
      email: p.email,
      name: p.name,
      concerns: Array.from(p.concerns),
      ageRange: p.ageRange,
      cycleDetails: Array.from(p.cycleDetails),
      energyStress: Array.from(p.energyStress),
      supplements: Array.from(p.supplements),
      objections: Array.from(p.objections),
      emotions: Array.from(p.emotions),
      packPresented: p.packPresented,
      cartShown: p.cartShown,
      sessionCount: p.sessionCount,
      messageCount: p.messageCount,
      questions: p.questions.slice(0, 10),
      lastSeen: p.lastSeen.toISOString(),
      firstSeen: p.firstSeen.toISOString(),
    }));

  /* ── Build sorted insight arrays ────────────────────────────── */

  const sortDesc = (obj: Record<string, number>) =>
    Object.entries(obj)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

  const topConcerns = sortDesc(concernCounts).map(c => ({
    concern: c.name,
    count: c.count,
    pct: totalMessages > 0 ? Math.round((c.count / totalMessages) * 100) : 0,
  }));

  const topObjections = sortDesc(objectionCounts).map(o => ({
    objection: o.name,
    count: o.count,
  }));

  const topQuestions = sortDesc(questionTopicCounts).map(q => ({
    topic: q.name,
    count: q.count,
  }));

  // Add actual sample questions
  const topQuestionsWithSamples = topQuestions.map(tq => ({
    ...tq,
    samples: questionList
      .filter(q => q.topic === tq.topic)
      .slice(0, 3)
      .map(q => q.question),
  }));

  const emotionalPatterns = sortDesc(emotionCounts).map(e => ({
    pattern: e.name,
    count: e.count,
  }));

  const conversionBlockers = sortDesc(blockerPhrases).map(b => ({
    blocker: b.name,
    count: b.count,
  }));

  const topSupplements = sortDesc(supplementCounts).map(s => ({
    name: s.name,
    count: s.count,
  }));

  const engagementTopics = Object.entries(topicMessageCounts)
    .map(([topic, data]) => ({
      topic,
      avgMessages: data.sessions.size > 0
        ? Math.round(data.total / data.sessions.size * 10) / 10
        : 0,
      sessionCount: data.sessions.size,
    }))
    .sort((a, b) => b.avgMessages - a.avgMessages);

  // Top concern for KPI
  const topConcern = topConcerns.length > 0 ? topConcerns[0].concern : "N/A";

  return NextResponse.json({
    totalUsers,
    totalSessions,
    totalMessages,
    avgMsgsPerSession,
    packPresentationRate,
    topConcern,
    profiles: sortedProfiles,
    insights: {
      topConcerns,
      topObjections,
      topQuestions: topQuestionsWithSamples,
      emotionalPatterns,
      conversionBlockers,
      topSupplements,
      engagementTopics,
    },
  });
}
