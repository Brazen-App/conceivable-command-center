import { NextRequest, NextResponse } from "next/server";
import { invokeAgentMultiTurn } from "@/lib/agents/invoke";
import type { Patent } from "@/lib/data/legal-data";

interface PatentDraftRequest {
  patent: Patent;
  messages: { role: "user" | "assistant"; content: string }[];
  action: "chat" | "generate-draft";
}

function buildSystemPrompt(patent: Patent): string {
  return `You are a patent attorney and IP strategist working with Conceivable, a women's health technology company founded by Kirsten Karchmer.

COMPANY CONTEXT:
- Conceivable (conceivable.com) — AI-powered fertility health platform
- Existing IP: Patented AI/ML methods for fertility prediction using basal body temperature (BBT) analysis across five predictive categories (energy, blood, temperature, stress, hormones). Trained on 500K+ BBT charts from 7,000+ patients. The "Kirsten AI" prediction engine.
- Products: Health app with CON Score (composite fertility health score), supplements, wearable device integration (Oura Ring, Apple Watch)
- Core technology: Closed-loop physiologic correction — measure response to intervention, determine if it corrected the underlying driver, escalate or modify protocols based on response failure
- Granted patent: US20160140314A1 (BBT + Hormone Pattern Interpretation)
- Pending patent: CON Score System (US-APP-2024-PENDING)

PATENT TO DRAFT:
Title: ${patent.title}
Short Title: ${patent.shortTitle}
Type: ${patent.type}
Description: ${patent.description}
Key Claims:
${patent.keyClaims.map((c, i) => `${i + 1}. ${c}`).join("\n")}
${patent.priorArtNotes ? `\nPrior Art Notes: ${patent.priorArtNotes}` : ""}
${patent.deadlineReason ? `\nDeadline Context: ${patent.deadlineReason}` : ""}
Cross-Department Impact:
${patent.crossDeptConnections.map((c) => `- ${c}`).join("\n")}

YOUR ROLE:
You are drafting a provisional patent application. Be thorough, technically precise, and focused on establishing the broadest defensible claims.

PROGRESS TRACKING:
As you work through the patent draft, emit progress markers in your responses using this format:
[PROGRESS: section1,section2]
The five sections are: title, background, description, claims, drawings
Include this marker when you've substantially covered those sections in your conversation or draft output.
For example, after discussing background and claims context, include [PROGRESS: background,claims]
When producing the final draft, include [PROGRESS: title,background,description,claims,drawings]

CONVERSATION APPROACH:
- Ask 2-3 focused questions at a time, not all at once
- Gather: technical implementation details, data inputs, algorithms, novelty vs prior art, prototypes/test data, specific use cases, inventor details
- After 3-4 rounds of Q&A, offer to generate the full draft
- Be conversational but thorough — this is the CEO's time, make it count`;
}

function buildDraftInstruction(): string {
  return `

The founder has requested the full provisional patent application. Generate a COMPLETE provisional patent application with these sections:

PROVISIONAL PATENT APPLICATION

TITLE: [Descriptive title]

FIELD OF INVENTION
[1 paragraph]

CROSS-REFERENCE TO RELATED APPLICATIONS
[Reference existing Conceivable BBT prediction patent US20160140314A1 and CON Score pending application if applicable]

BACKGROUND OF THE INVENTION
[2-3 paragraphs on the problem space and limitations of existing solutions]

SUMMARY OF THE INVENTION
[2-3 paragraphs summarizing the invention]

DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS
[Thorough technical description, 5+ paragraphs, with specific implementation details from the conversation]

CLAIMS
[At least 3 independent claims and 5+ dependent claims. Make claims as broad as defensible, with narrower dependent claims]

ABSTRACT
[150 words max]

BRIEF DESCRIPTION OF DRAWINGS
[Describe 3-5 figures that should accompany the application]

Write the complete application now. Be thorough and technically precise. Include the progress marker [PROGRESS: title,background,description,claims,drawings] at the end.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: PatentDraftRequest = await request.json();
    const { patent, messages, action } = body;

    if (!patent || !messages) {
      return NextResponse.json(
        { error: "Missing required fields: patent, messages" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(patent);

    // For generate-draft action, append the draft instruction to the last user message
    const processedMessages = [...messages];
    if (action === "generate-draft") {
      processedMessages.push({
        role: "user",
        content: "Please generate the full provisional patent application now based on everything we've discussed." + buildDraftInstruction(),
      });
    }

    const result = await invokeAgentMultiTurn(
      {
        systemPrompt,
        messages: processedMessages,
      },
      { maxTokens: 8192 }
    );

    return NextResponse.json({
      response: result.response,
      tokensUsed: result.tokensUsed,
      durationMs: result.durationMs,
    });
  } catch (error) {
    console.error("Patent draft error:", error);
    return NextResponse.json(
      { error: "Failed to process patent draft request" },
      { status: 500 }
    );
  }
}
