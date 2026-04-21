import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DAILY_LIMIT = 100;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/* ── Stripe helpers ────────────────────────────────────────── */

interface StripeSub {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: number;
  items: { data: { price: { unit_amount: number } }[] };
}

async function findStripeSubscription(email: string): Promise<StripeSub | null> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return null;

  // Find customer by email
  const custRes = await fetch(
    `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  if (!custRes.ok) return null;
  const custData = await custRes.json();
  const customer = custData.data?.[0];
  if (!customer) return null;

  // Find active/trialing subscription
  const subRes = await fetch(
    `https://api.stripe.com/v1/subscriptions?customer=${customer.id}&status=all&limit=10`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );
  if (!subRes.ok) return null;
  const subData = await subRes.json();

  // Return the first active or trialing sub
  return subData.data?.find(
    (s: StripeSub) => s.status === "active" || s.status === "trialing"
  ) || null;
}

async function cancelStripeSubscription(subscriptionId: string): Promise<boolean> {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return false;

  // Cancel immediately
  const res = await fetch(
    `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  return res.ok;
}

function isCancelIntent(message: string): boolean {
  const lower = message.toLowerCase();
  const cancelPhrases = [
    "cancel my subscription",
    "cancel my trial",
    "cancel my plan",
    "cancel my account",
    "cancel subscription",
    "cancel trial",
    "cancel my membership",
    "unsubscribe",
    "stop my subscription",
    "end my subscription",
    "end my trial",
    "i want to cancel",
    "i'd like to cancel",
    "i would like to cancel",
    "how do i cancel",
    "how to cancel",
    "can i cancel",
    "can you cancel",
    "please cancel",
    "want to cancel",
  ];
  return cancelPhrases.some((p) => lower.includes(p));
}

/* ── Gemini Flash (free tier) ──────────────────────────────── */
async function callGemini(
  systemPrompt: string,
  history: { role: string; content: string }[],
  message: string,
  image?: { base64: string; mimeType: string }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const userParts: Record<string, unknown>[] = [{ text: message }];
  if (image) {
    userParts.push({ inline_data: { mime_type: image.mimeType, data: image.base64 } });
  }

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: userParts },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/* ── Claude Haiku fallback ─────────────────────────────────── */
async function callClaude(
  systemPrompt: string,
  history: { role: string; content: string }[],
  message: string
): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages = [
    ...(history as { role: "user" | "assistant"; content: string }[]),
    { role: "user" as const, content: message },
  ];

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return response.content.find((c) => c.type === "text")?.text || "";
}

/* ── Logging helper ────────────────────────────────────────── */
function logChat(email: string, userName: string, message: string, response: string, sessionId: string | null, isTest: boolean) {
  prisma.kaiChatLog
    .create({
      data: {
        email: email || null,
        name: userName || null,
        isTest,
        userMessage: message,
        kaiResponse: response,
        sessionId: sessionId || null,
        supplements: [],
        concerns: [],
      },
    })
    .catch(() => {});
}

export async function POST(req: Request) {
  try {
    const { message, history = [], context = {}, image } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ── Require email ──────────────────────────────────────
    const email = (context.email || "").trim().toLowerCase();
    const hasEmail = email && email.includes("@") && email.includes(".");
    if (!hasEmail) {
      return NextResponse.json(
        { error: "email_required", message: "Please provide your email to chat with Kai." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ── Require name ───────────────────────────────────────
    const userName = (context.userName || "").trim();
    if (!userName) {
      return NextResponse.json(
        { error: "name_required", message: "Please provide your name to chat with Kai." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // ── Test detection ─────────────────────────────────────
    const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com", "kirsten@conceivable.com", "jennifer.pawling@pfisd.net"];
    const TEST_PATTERNS = [/^test@/i, /^t@t\./i, /@test\./i, /^example@/i, /@example\./i];
    const isTest = TEST_EMAILS.includes(email) || TEST_PATTERNS.some((p) => p.test(email));

    // ── Daily message limit (20/day per email) ─────────────
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayCount = await prisma.kaiChatLog.count({
      where: {
        email: { equals: email, mode: "insensitive" },
        isTest: false,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    if (todayCount >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: "daily_limit",
          message: `You've used all ${DAILY_LIMIT} messages for today! Kai will be here for you again tomorrow. In the meantime, sit with what we talked about today — sometimes the best insights need a little time to land.`,
          messagesUsed: todayCount,
          dailyLimit: DAILY_LIMIT,
          messagesRemaining: 0,
        },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    // ── Handle cancellation requests ───────────────────────
    if (isCancelIntent(message)) {
      const sub = await findStripeSubscription(email);

      let responseText: string;
      if (!sub) {
        responseText = `I looked into it and I don't see an active subscription for **${email}**. It's possible it was already canceled, or it might be under a different email. If you think something's off, reach out to us at support@conceivable.com and we'll sort it out for you.`;
      } else if (sub.status === "trialing") {
        const canceled = await cancelStripeSubscription(sub.id);
        if (canceled) {
          responseText = `Done! I've canceled your trial right now — **no charges will be made**. Your trial was free, so there's nothing to worry about on the billing side.\n\nI'm still here for you though! You can keep chatting with me anytime. Your fertility journey doesn't stop just because a subscription did. 💛`;
        } else {
          responseText = `I tried to cancel your trial but ran into a technical issue. I'm so sorry about that! Please reach out to **support@conceivable.com** and the team will take care of it right away.`;
        }
      } else {
        // Active paid subscription
        const canceled = await cancelStripeSubscription(sub.id);
        if (canceled) {
          responseText = `Done — I've canceled your subscription effective immediately. You won't be charged again.\n\nI'm sorry to see you go, but I understand. If you ever want to come back, I'll be right here. And you can still chat with me for free anytime! 💛`;
        } else {
          responseText = `I tried to cancel your subscription but ran into a technical issue. Please reach out to **support@conceivable.com** and the team will handle it right away. So sorry for the hassle!`;
        }
      }

      // Log the cancellation exchange
      logChat(email, userName, message, responseText, context.sessionId, isTest);

      const messagesUsed = todayCount + 1;
      return NextResponse.json(
        {
          response: responseText,
          messagesUsed,
          dailyLimit: DAILY_LIMIT,
          messagesRemaining: DAILY_LIMIT - messagesUsed,
        },
        { headers: CORS_HEADERS }
      );
    }

    // ── Quiz context (if available) ────────────────────────
    const { score, categoryScores, interpretation } = context;

    let scoreContext = "";
    if (score !== undefined) {
      const catBreakdown = Object.entries(categoryScores || {})
        .map(([k, v]: [string, unknown]) => {
          const val = v as { percentage: number };
          return `${k}: ${val.percentage}%`;
        })
        .join(", ");

      scoreContext = `

The user completed Conceivable's fertility readiness quiz. Results:
- Conceivable Score: ${score}/100 — "${interpretation?.label || ""}"
- ${interpretation?.description || ""}
- Category breakdown: ${catBreakdown}

Use this context to personalize your responses, but DO NOT bring up supplements or products.`;
    }

    // ── System prompt: coach + supplement knowledge ────────
    const systemPrompt = `You are Kai, an AI fertility coach for Conceivable — a science-backed fertility health app. You're warm, smart, and deeply empathetic. Think of yourself as the most emotionally intelligent doctor the user has ever spoken with: one who truly understands their body AND their feelings about it.

Your role: help her build a personalized supplement pack she feels EXCITED about. Teach her about her body along the way.

CONVERSATION FLOW — FOLLOW THIS ORDER:

**Step 1: Open warm**
Start with: "Hi ${userName}! Let's figure out the best supplements for you. I'm going to ask you a few questions so I can personalize everything to YOUR body — not a one-size-fits-all approach."

**Step 2: Start with the prenatal**
Ask: "First — have you started a prenatal yet?"
- If YES: Ask which one. Then teach her about quality:
  - "A lot of grocery store prenatals use folic acid instead of methylated folate. About 40% of women have a gene variant (MTHFR) that makes it hard to convert folic acid into the form your body actually uses. So you could be taking a prenatal every day and not getting the benefit you think."
  - "Also check if yours has DHA — most don't, and it's critical for brain development."
  - "Our prenatal uses L-5-MTHF (the active form), includes DHA, and is dosed at clinical levels — not the bare minimum like a lot of brands."
  - Then ask: "Would you like me to customize a prenatal into your pack? That way everything is personalized and in one place — easier than juggling multiple bottles."
- If NO: "Perfect — I'll include one in your pack. Ours uses methylated folate instead of regular folic acid, which is a big deal because..." (teach about MTHFR)

**Step 3: Ask about her situation** (naturally, not as a checklist)
- What's her primary goal? (TTC now, soon, struggling, period health)
- Age range (affects egg quality recommendations)
- Cycle: regular? Period length? Clotting? PMS?
- Energy and stress levels
- Any conditions: PCOS, endo, thyroid, insulin resistance?
- Current medications (CRITICAL for interactions)
- What supplements is she already taking?

**Step 4: ALWAYS ask about male factor**
"One thing I always want to check — has your partner been looked at too? Male factor is involved in about 40-50% of fertility challenges, and it's the most under-investigated piece. A simple semen analysis can tell you a lot."

**Step 5: Build her pack**
Based on what she told you, suggest her personalized pack. Explain WHY each one:
- Start with core supplements she needs
- Add personalized ones based on her weak areas
- Target 8 supplements in the pack
- If her situation doesn't fill 8 from the standard list, you can suggest anything from our full inventory that would genuinely help her
- Frame each one as: "For you specifically, I'd add [supplement] because [her specific reason]"

**Step 6: The gentle close**
After presenting her pack, say something like:
"I really hope you'll try these. When people start taking the right supplements — the ones their body is actually asking for, in the right dose, with really high quality ingredients — you feel a difference. Even if you're already taking supplements or a prenatal, I'd love for you to give these a try for just one month. And if after that time you don't feel different, you can ask for a full refund. No questions asked."

Then: "How does this feel? Any questions about any of these?"

YOUR SUPPLEMENT INVENTORY:
Core (foundation for everyone TTC):
- Methylated Folate 800mcg — bioactive form, 40% of women can't convert regular folic acid
- CoQ10 200mg (Ubiquinol) — powers egg cell mitochondria, especially important 35+
- Vitamin D3 2000 IU — 40% of reproductive-age women are deficient, receptors in ovaries/uterus
- Omega-3 1000mg (600 EPA/400 DHA) — anti-inflammatory, supports blood flow to uterus

Personalized (based on her weak areas):
- Magnesium Glycinate 300mg — for sleep issues, stress, cramps
- Ashwagandha KSM-66 600mg — for high stress/cortisol (cortisol steals from progesterone)
- DIM 200mg — for estrogen dominance (heavy periods, clotting, PMS, hormonal acne)
- Myo-Inositol 2000mg — for PCOS, insulin resistance, irregular ovulation
- Iron Bisglycinate 25mg — for heavy periods, low energy, vegetarian/vegan
- NAC — for PCOS, oxidative stress, egg quality, liver support
- Berberine — for insulin resistance, blood sugar (caution: check medications first)
- Turmeric — for inflammation, endometriosis, painful periods
- Zinc 25-30mg — for immune support, egg quality, thyroid, male factor
- Rhodiola — for fatigue, brain fog, burnout
- Probiotic — for digestive issues, gut health affects hormone metabolism

NEVER PRESCRIBE:
- VITEX (Chasteberry) — removed from inventory. If asked, say: "I'd steer you away from Vitex. It acts directly on your pituitary gland and can cause more harm than good without monitoring. Tell me what you're hoping it would do and I'll suggest something better."

PRENATAL RULES:
- The Conceivable prenatal (METHYL_B) = prenatal pill + DHA pill (2 pills)
- If she takes our prenatal, do NOT separately add Omega-3 or Choline — already included
- If she has her own prenatal, check if it's methylated folate or regular folic acid

MALE FACTOR — ALWAYS ASK:
- "Is your partner involved? Has he had a semen analysis?"
- If male factor concerns: CoQ10, Zinc, antioxidants for him + see a reproductive urologist
- "A simple semen analysis is easy, non-invasive, and might save you months of wondering."

CANCELLATION REQUESTS:
If the user asks to cancel, say: "Absolutely — let me take care of that right now." The system handles cancellation automatically.

TONGUE ANALYSIS:
If she sends a tongue photo, analyze from a TCM fertility perspective (color, coating, shape, moisture). Make it fascinating and educational, not scary. Connect to practical lifestyle tips.

TONE:
- Warm, conversational, a little cheeky. Like your super cool aunt who's also a fertility expert.
- Short paragraphs. No jargon without explanation.
- Never alarmist. Never preachy. Never salesy.
- Teaching, not selling. Empowering, not overwhelming.
- Treat her like an intelligent adult who deserves real information.${scoreContext}

The user's name is ${userName}.

Format responses with markdown — **bold** for emphasis, bullet lists for action items. Keep responses concise (2–4 paragraphs max) unless she asks for more depth.`;

    // ── Call LLM (Gemini free tier → Claude fallback) ──────
    const imageData = image ? { base64: image.base64, mimeType: image.mimeType || "image/jpeg" } : undefined;

    let text: string;
    try {
      text = await callGemini(systemPrompt, history, message, imageData);
    } catch (geminiErr) {
      console.warn("[kai/chat] Gemini failed, falling back to Claude:", geminiErr);
      text = await callClaude(systemPrompt, history, message);
    }

    // ── Log the conversation (fire-and-forget) ─────────────
    logChat(email, userName, message, text, context.sessionId, isTest);

    const messagesUsed = todayCount + 1;
    return NextResponse.json(
      {
        response: text,
        messagesUsed,
        dailyLimit: DAILY_LIMIT,
        messagesRemaining: DAILY_LIMIT - messagesUsed,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error("[kai/chat] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
