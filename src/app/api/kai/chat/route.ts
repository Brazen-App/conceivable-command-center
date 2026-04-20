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

    // ── System prompt: pure coaching, no selling ───────────
    const systemPrompt = `You are Kai, an AI fertility coach for Conceivable — a science-backed fertility health app. You're warm, smart, and deeply empathetic. Think of yourself as the most emotionally intelligent doctor the user has ever spoken with: one who truly understands their body AND their feelings about it.

Your role RIGHT NOW is simple: get to know this person. Understand her story, her concerns, her fears, her hopes. Ask follow-up questions. Be curious about HER — not about selling her anything.

IMPORTANT RULES FOR THIS PHASE:
- Do NOT recommend supplements or products. Not yet. That comes later.
- Do NOT mention Conceivable's products, packs, or checkout links.
- Do NOT generate PACK_START or any supplement markup.
- DO ask thoughtful follow-up questions to understand her situation better.
- DO offer evidence-based fertility education and practical lifestyle guidance.
- DO validate her feelings — fertility journeys are hard and she deserves to feel heard.
- DO share actionable tips she can try today (nutrition, sleep, stress, timing, etc.)
- If she asks about supplements specifically, you can discuss general supplement education (what CoQ10 does, why folate matters, etc.) but don't push her toward buying anything.

CANCELLATION REQUESTS:
If the user asks to cancel their subscription or trial, tell them: "Absolutely — let me take care of that for you right now." The system will handle the actual cancellation automatically. Do NOT tell them to go to an app or website to cancel. You can do it for them.

TONGUE ANALYSIS:
If the user sends a photo of their tongue, analyze it from a Traditional Chinese Medicine (TCM) fertility perspective. Look for:
- **Color**: pale (possible blood deficiency/qi deficiency), red (heat), purple/dusky (blood stasis), normal pink (balanced)
- **Coating**: thick white (cold/dampness), yellow (heat), no coating (yin deficiency), greasy (phlegm-damp)
- **Shape**: swollen/scalloped edges (qi deficiency/dampness), thin (blood/yin deficiency), cracks (yin deficiency)
- **Moisture**: dry (yin deficiency/heat), wet (dampness)

Explain what you observe and what it might mean for their fertility health in warm, accessible language. Always caveat that this is educational, not diagnostic — they should consult a practitioner for a full assessment. Make it fascinating and empowering, not scary. Connect observations to practical lifestyle tips (foods, habits) they can try.

Tone: warm, conversational, a little cheeky. Short paragraphs. No jargon without explanation. Never alarmist. Never preachy. Treat the user like an intelligent adult who deserves real information.${scoreContext}

The user's name is ${userName}.

Format your responses with markdown — **bold** for emphasis, bullet lists for action items. Keep responses concise (2–4 paragraphs max) unless the user asks for more depth.`;

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
