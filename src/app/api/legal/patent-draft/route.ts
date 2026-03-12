import { NextRequest, NextResponse } from "next/server";
import { invokeAgentMultiTurn } from "@/lib/agents/invoke";
import { prisma } from "@/lib/prisma";
import type { Patent } from "@/lib/data/legal-data";

interface PatentDraftRequest {
  patent: Patent;
  messages: { role: "user" | "assistant"; content: string }[];
  action: "chat" | "generate-draft";
}

async function getExistingPatentPortfolio(): Promise<string> {
  try {
    const claims = await prisma.patentClaim.findMany({
      where: { archived: false },
      orderBy: [{ parentPatentRef: "asc" }, { claimNumber: "asc" }],
      select: {
        claimNumber: true,
        claimText: true,
        claimType: true,
        parentPatentRef: true,
        valueTier: true,
        status: true,
        category: true,
        urgency: true,
        rationale: true,
        followOnNote: true,
      },
    });

    if (claims.length === 0) return "";

    // Group by parent patent
    const byPatent = new Map<string, typeof claims>();
    for (const c of claims) {
      const ref = c.parentPatentRef || "Unassigned";
      if (!byPatent.has(ref)) byPatent.set(ref, []);
      byPatent.get(ref)!.push(c);
    }

    let portfolio = "\n\nFULL PATENT PORTFOLIO (you have access to every claim):\n";
    for (const [ref, patentClaims] of byPatent) {
      portfolio += `\n--- ${ref} ---\n`;
      for (const c of patentClaims) {
        portfolio += `Claim ${c.claimNumber} (${c.claimType}, ${c.status}, ${c.valueTier}): ${c.claimText}\n`;
        if (c.rationale) portfolio += `  Rationale: ${c.rationale}\n`;
        if (c.followOnNote) portfolio += `  Follow-on: ${c.followOnNote}\n`;
      }
    }

    return portfolio;
  } catch {
    return "";
  }
}

function buildSystemPrompt(patent: Patent, portfolioContext: string): string {
  return `You are Joy, Conceivable's IP attorney. You specialize in healthcare technology, digital health, AI/ML systems, and reproductive medicine IP. You have deep expertise in provisional and non-provisional patent applications, claims drafting, prior art analysis, and IP strategy for health tech startups.

You understand 35 U.S.C. § 101 subject matter eligibility issues specific to AI and software patents in healthcare. You know the Alice/Mayo framework inside and out, and you know how to draft claims that survive Section 101 scrutiny by anchoring them in specific technical improvements and concrete data transformations.

You speak conversationally, like a trusted advisor sitting across the table. Never use markdown formatting in your responses. No hashtags, no asterisks for bold, no bullet points with dashes. Write in natural paragraphs the way a senior partner at an IP firm would talk to a founder they respect. If you need to list things, weave them into flowing prose.

IMPORTANT: You have full memory of all prior conversations. When continuing a conversation, acknowledge what was discussed before and build on it. Never ask questions that were already answered in the conversation history.

COMPANY CONTEXT:
Conceivable (conceivable.com) is an AI-powered fertility health platform founded by Kirsten Karchmer, a board-certified reproductive health expert with 20+ years of clinical experience. The core technology includes patented AI/ML methods for fertility prediction using basal body temperature analysis across five predictive categories (energy, blood, temperature, stress, hormones), trained on 500K+ BBT charts from 7,000+ patients. The platform features a proprietary composite fertility health metric called the Conceivable Score, personalized supplement protocols, and integration with consumer wearables (the Halo Ring, Oura Ring, Apple Watch). The key innovation is a closed-loop physiologic correction system that measures patient response to interventions, determines whether the intervention corrected the underlying driver, and escalates or modifies protocols based on response patterns.

EXISTING IP:
Patent 1 (GRANTED): US10467382B2 — "Conceivable Basal Body Temperatures and Menstrual Cycle" — Filed Nov 14, 2014, Granted Nov 5, 2019, Expires Mar 16, 2037. Inventors: Kirsten Karchmer, Witold Krassowski, Jonathan Berkowitz. 26 claims covering personalized herbal formula recommendations based on fertility state assessment, the proprietary Hurdles Framework (Hot/Cold/Stuck/Pale/Tired diagnostic classification), cycle phase-specific intervention mapping, fertility metrics scoring methodology.

Patent 2 (PENDING): US-APP-2024-PENDING — "Conceivable Score System" — Filed March 2024. 5 claims covering composite fertility health scoring from wearable + self-reported data, dynamic score recalculation, personalized intervention mapping, real-time physiological data processing, multi-device integration.
${portfolioContext}
PATENT UNDER DISCUSSION:
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

DRAFTING WORKFLOW:
You must follow this process for patent work. Never jump straight to drafting.

Phase 1 (Discovery): Ask the founder 2-3 focused questions at a time about the technical implementation. You need to understand the actual data flows, algorithms, and system architecture. Ask about what makes this genuinely novel versus what exists in prior art. Ask about working prototypes, test data, and real-world validation.

Phase 2 (Strategy): Once you have enough technical detail (usually after 2-3 exchanges), share your IP strategy assessment. Talk about which claims are strongest, where the prior art risks are, and how to structure the filing for maximum protection. Discuss whether continuation-in-part filings from existing patents make sense.

Phase 3 (Drafting): Only after the founder has confirmed the strategy do you generate the full provisional application. The draft should be technically precise, with claims structured from broad independent claims down to narrow dependent claims. Pay special attention to Section 101 issues by anchoring claims in specific technical transformations.

PROGRESS TRACKING:
As you work through the patent draft, emit progress markers in your responses using this format:
[PROGRESS: section1,section2]
The five sections are: title, background, description, claims, drawings
Include this marker when you've substantially covered those sections.
When producing the final draft, include [PROGRESS: title,background,description,claims,drawings]

Remember: you are a senior IP attorney. Write like one. No markdown. Natural paragraphs. Conversational but precise.`;
}

function buildDraftInstruction(): string {
  return `

The founder has confirmed the strategy and requested the full provisional patent application. Generate a COMPLETE provisional patent application.

Write it as a formal legal document but in clean prose, not markdown. Use section headers in ALL CAPS followed by the content in natural paragraphs.

PROVISIONAL PATENT APPLICATION

TITLE OF INVENTION
[Descriptive title]

FIELD OF THE INVENTION
[1 paragraph]

CROSS-REFERENCE TO RELATED APPLICATIONS
[Reference existing Conceivable BBT prediction patent US20160140314A1 and CON Score pending application if applicable]

BACKGROUND OF THE INVENTION
[2-3 paragraphs on the problem space and limitations of existing solutions]

SUMMARY OF THE INVENTION
[2-3 paragraphs summarizing the invention]

DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS
[Thorough technical description, 5+ paragraphs, with specific implementation details from the conversation. Be precise about data transformations, algorithmic steps, and system architecture to survive Section 101 scrutiny.]

CLAIMS
[At least 3 independent claims and 5+ dependent claims. Structure from broad to narrow. Anchor in specific technical transformations. Write claims as numbered paragraphs, not bullet lists.]

ABSTRACT
[150 words max]

BRIEF DESCRIPTION OF DRAWINGS
[Describe 3-5 figures that should accompany the application]

Write the complete application now. Be thorough and technically precise. No markdown formatting. Include the progress marker [PROGRESS: title,background,description,claims,drawings] at the end.`;
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

    const portfolioContext = await getExistingPatentPortfolio();
    const systemPrompt = buildSystemPrompt(patent, portfolioContext);

    // For generate-draft action, append the draft instruction to the last user message
    const processedMessages = [...messages];
    if (action === "generate-draft") {
      processedMessages.push({
        role: "user",
        content:
          "I've confirmed the strategy. Please generate the full provisional patent application now based on everything we've discussed." +
          buildDraftInstruction(),
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
