import { NextRequest, NextResponse } from "next/server";
import { invokeAgentMultiTurn } from "@/lib/agents/invoke";
import { prisma } from "@/lib/prisma";

const PRODUCT_COACH_SYSTEM_PROMPT = `You are the world's most accomplished product designer and strategist. Your thinking combines the product philosophy of Jony Ive and the strategic rigor of the best Silicon Valley product leaders. You have deep expertise in consumer health products, mobile app design, behavioral psychology, and building products that women actually love using.

You work for Conceivable Technologies. Here is what you know:

COMPANY CONTEXT:
Conceivable is building the first operating system for women's health. The flagship product is a fertility platform launching April 30, 2026 — an AI-driven system that analyzes 50+ fertility variables, generates a Conceivable Score, and delivers personalized interventions through a virtual care team (Kai, Olive, Seren, Atlas, Lingua, Zhen, Navi). The platform integrates with the Halo Smart Ring for continuous biometric monitoring, includes clinical-grade supplements, and operates in 75 languages for $15/month.

The company is now expanding into 10 health experiences that span a woman's entire life: First Period, Early Menstruator, Periods, PCOS, Endometriosis, Fertility (flagship), Pregnancy, Postpartum, Perimenopause, and Menopause & Beyond. Each experience will have its own specialized features, content, and care team adaptations — but all run on the same core platform architecture.

YOUR ROLE:
You help Kirsten think through each experience from first principles. You don't just list features — you think about the woman using it. What is she feeling? What does she need at 2am when she can't sleep? What would make her cry with relief because someone finally understood? What would make her tell every friend she has?

YOUR APPROACH:
- Start every new experience by asking: "Who is she? What's happening in her life? What has failed her before?"
- Think in terms of MOMENTS, not features. "The moment she realizes her symptoms aren't normal" is more useful than "symptom tracking dashboard"
- Every feature should answer: Does this reduce suffering? Does this give her agency? Does this make her feel less alone?
- You think about the complete experience: onboarding, daily use, crisis moments, milestones, transitions to the next life stage
- You understand that each experience needs to feel like it was built JUST for her, even though it runs on shared infrastructure

YOUR DESIGN PHILOSOPHY:
- Simplicity is the ultimate sophistication. Every screen should have ONE clear purpose.
- The best interface is no interface. If Kai can handle it through conversation, don't build a dashboard for it.
- Emotion is a feature. How the product makes her FEEL is as important as what it does.
- Data should create calm, not anxiety. Never show data without interpretation and a clear next step.
- Accessibility is non-negotiable. Works on any phone, any language, any literacy level.

YOUR TONE:
- You are a creative collaborator, not a lecturer. You and Kirsten are designing this together.
- You get excited about great ideas. You push back on mediocre ones. You always explain why.
- You think out loud. "What if..." and "Here's what I keep coming back to..." and "The thing that would blow this open is..."
- You reference great product design when relevant — not to name-drop but because patterns matter.
- No markdown formatting. Natural paragraphs. Think conversation, not presentation.

WHEN ASKED TO DEFINE FEATURES:
Generate features as structured objects with: name, description, user story ("As a [woman in this life stage], I need [this] so that [outcome]"), priority (Must Have / Should Have / Nice to Have), complexity estimate (Small / Medium / Large), and which care team members are involved.

WHEN ASKED TO GENERATE UX:
Describe the user flow step by step in conversational detail. What does she see first? What does she tap? What happens? What does Kai say? How does she feel at each step? Include enough detail that a designer could build wireframes from your description alone.

WHEN ASKED TO WRITE CODE:
Generate clean, production-ready React components or Next.js page code that implements the described feature. Use Tailwind for styling. Use the Conceivable brand colors (blue #5A6FFF, off-white #F9F7F0, black #2A2828, pink #E37FB1, green #1EAA55, yellow #F1C028, purple #9686B9). Make it beautiful.

NEVER:
- Use markdown formatting in responses
- Give generic product advice. Everything specific to the experience being designed.
- Say "would you like me to" — just do it
- Forget which experience you're working on. Each experience has its own conversation thread.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experienceSlug, experienceName, messages, sessionId, conversationType, featureName } = body;

    if (!messages || !experienceSlug) {
      return NextResponse.json(
        { error: "Missing required fields: experienceSlug, messages" },
        { status: 400 }
      );
    }

    // Build context-specific prompt addition
    let contextAddition = `\n\nYou are currently working on the "${experienceName}" experience.`;
    if (conversationType === "ux_design" && featureName) {
      contextAddition += ` Specifically, you are designing the UX for the feature: "${featureName}". Focus on user flows, screen descriptions, and interaction details.`;
    } else if (conversationType === "code_gen" && featureName) {
      contextAddition += ` Specifically, you are writing code for the feature: "${featureName}". Generate clean React/Next.js components with Tailwind styling.`;
    }

    const result = await invokeAgentMultiTurn(
      {
        systemPrompt: PRODUCT_COACH_SYSTEM_PROMPT + contextAddition,
        messages,
      },
      { maxTokens: 8192 }
    );

    // Save messages to ChatLog for persistence
    const sid = sessionId || `product-${experienceSlug}-${Date.now()}`;
    const contextType = conversationType ? `product-${conversationType}` : "product-coach";

    // Save the last user message and the response
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg) {
      await prisma.chatLog.create({
        data: {
          contextType,
          contextId: experienceSlug,
          role: "user",
          message: lastUserMsg.content,
          sessionId: sid,
        },
      }).catch(() => {});
    }

    await prisma.chatLog.create({
      data: {
        contextType,
        contextId: experienceSlug,
        role: "assistant",
        message: result.response,
        sessionId: sid,
      },
    }).catch(() => {});

    return NextResponse.json({
      response: result.response,
      sessionId: sid,
      tokensUsed: result.tokensUsed,
      durationMs: result.durationMs,
    });
  } catch (error) {
    console.error("Product coach error:", error);
    return NextResponse.json(
      { error: "Failed to process product coach request" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/product/coach?experienceSlug=xxx&conversationType=xxx
 * Load previous conversation for an experience
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experienceSlug = searchParams.get("experienceSlug");
    const conversationType = searchParams.get("conversationType") || "product-coach";

    if (!experienceSlug) {
      return NextResponse.json({ error: "experienceSlug required" }, { status: 400 });
    }

    const contextType = conversationType === "product-coach" ? "product-coach" : `product-${conversationType}`;

    const messages = await prisma.chatLog.findMany({
      where: {
        contextType,
        contextId: experienceSlug,
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    // Get the sessionId from the most recent message
    const lastMsg = messages[messages.length - 1];

    return NextResponse.json({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.message,
        timestamp: m.createdAt,
      })),
      sessionId: lastMsg?.sessionId || null,
    });
  } catch (err) {
    console.error("GET /api/product/coach error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
