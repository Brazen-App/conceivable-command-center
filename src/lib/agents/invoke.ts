import Anthropic from "@anthropic-ai/sdk";
import { AGENT_CONFIGS } from "./config";
import { AgentInvokeOptions, AgentRunInput, AgentRunOutput } from "./types";
import { AgentDivision } from "@/types";

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

const DEMO_RESPONSES: Record<string, string[]> = {
  "executive-coach": [
    "That's a great question. Let me push back a little — what's the one thing that, if you nailed it this week, would make everything else easier or unnecessary?\n\nBill Campbell used to say: \"Your title makes you a manager. Your people make you a leader.\" So before we dive into tactics, let's make sure we're solving the right problem.\n\nHere's what I'd challenge you to think about:\n1. What's the biggest risk to Conceivable right now that you're NOT addressing?\n2. Are you spending your time on $10/hour tasks or $10,000/hour tasks?\n3. Who on your team (or advisory board) could own this so you can focus on what only YOU can do?\n\nLet's talk through your priorities. What does success look like for Conceivable in the next 90 days?",
    "I want you to pause and really think about this. As a founder, your most scarce resource isn't money — it's your attention.\n\nHere's a framework I'd recommend:\n\n**The 3-Priority Rule**: At any given time, you should have exactly 3 priorities. Not 5, not 10. Three.\n\nFor Conceivable right now, I'd suggest:\n1. **Product-Market Fit Signal** — Are women 20-40 actually using and loving the product?\n2. **Distribution** — What's your primary channel for reaching your first 1,000 users?\n3. **Team** — Do you have the right people to execute on #1 and #2?\n\nEverything else is noise. What would you say your top 3 are?",
    "Let me be direct with you — that's a common trap for founders at your stage.\n\nHere's what I've seen work:\n- **Validate before you build.** Talk to 50 women in your target demographic this month. Not surveys — real conversations.\n- **Set a 30-day sprint.** Pick one measurable goal and go all-in.\n- **Kill your darlings.** What feature or initiative should you cut right now?\n\nThe best founders I've worked with aren't the ones with the best ideas — they're the ones who execute ruthlessly on the RIGHT ideas.\n\nWhat's the one thing you're avoiding right now that you know you need to do?",
  ],
  marketing: [
    "Great question! For Conceivable's target audience of women 20-40, here's what I'd recommend:\n\n**Channel Strategy Priority:**\n1. **Instagram** — Your primary brand-building channel. Focus on carousel posts (educational), Reels (hooks + storytelling), and Stories (behind-the-scenes)\n2. **TikTok** — Viral potential is highest here. Lead with myth-busting and \"things your OB-GYN won't tell you\" content\n3. **LinkedIn** — Position the founder as a thought leader in women's health + AI. Long-form posts about the mission\n\n**Content Pillars:**\n- Science Made Accessible (research breakdowns)\n- Founder Story (personal journey, building in public)\n- Community Voices (user stories, testimonials)\n- Myth Busting (controversial takes backed by data)\n\n**Key Metric to Track:** Save rate on Instagram. Saves = intent = future customers.\n\nWant me to draft a specific campaign brief for any of these?",
    "Here's my analysis for your pre-launch marketing strategy:\n\n**Phase 1: Build the Waitlist (Now)**\n- Create a compelling landing page with a clear value prop\n- Offer early access + founding member pricing\n- Run a referral program (give 3, get 1 month free)\n\n**Phase 2: Content-Led Growth (Ongoing)**\n- Publish 3-5x/week across platforms\n- Partner with 5-10 micro-influencers in the fertility/wellness space\n- Start a newsletter: \"The Conceivable Weekly\" — curated health insights\n\n**Phase 3: Launch Sprint (4 weeks pre-launch)**\n- PR push: pitch to TechCrunch Health, Glossy, Well+Good\n- Influencer unboxing/first-look content\n- Launch day event (virtual or IRL)\n\nBudget-wise, I'd allocate 60% to content creation, 30% to paid social, 10% to PR.\n\nWhat area do you want to dive deeper into?",
  ],
  "scientific-research": [
    "Based on current literature, here's a summary of the evidence:\n\n**Key Findings:**\n\nThe research landscape in women's reproductive health has evolved significantly. Here are the most relevant findings for Conceivable:\n\n1. **Fertility & Nutrition**: A 2024 meta-analysis in *Fertility and Sterility* found that Mediterranean-style diets were associated with improved fertility outcomes (OR 1.4, 95% CI 1.1-1.8). Key nutrients: folate, omega-3 fatty acids, vitamin D, and antioxidants.\n\n2. **Supplement Evidence Levels:**\n   - CoQ10: Moderate evidence for egg quality improvement (especially in women 35+)\n   - Vitamin D: Strong evidence for association with fertility outcomes\n   - Inositol: Strong evidence for PCOS management\n   - NAC: Moderate evidence for endometriosis-related inflammation\n\n3. **Wearable Data & Prediction**: BBT-based algorithms show 89-94% accuracy for ovulation prediction when combined with ML models (aligns with Conceivable's Kirsten AI approach).\n\n**Limitations to Note:**\n- Most supplement studies are observational, not RCTs\n- Sample sizes tend to be small (n < 500)\n- Publication bias toward positive results\n\nWould you like me to do a deeper dive into any of these areas? I can also review specific claims for marketing copy compliance.",
    "Here's what the current evidence says:\n\n**Evidence Assessment:**\n\nI've reviewed the latest literature across PubMed, Cochrane, and relevant specialty journals. Here's my assessment:\n\n**Strong Evidence (Level A):**\n- Folic acid supplementation reduces neural tube defects\n- Inositol improves insulin sensitivity in PCOS\n- Regular exercise improves fertility outcomes\n\n**Moderate Evidence (Level B):**\n- CoQ10 may improve oocyte quality in older women\n- Vitamin D deficiency is associated with reduced fertility\n- Acupuncture may modestly improve IVF outcomes\n\n**Emerging/Limited Evidence (Level C):**\n- Gut microbiome diversity and fertility correlation\n- Adaptogens (ashwagandha) for stress-related fertility\n- Blue light exposure and circadian rhythm effects on cycles\n\n**Important Caveats:**\nAny health claims in marketing materials should stick to structure/function claims rather than disease claims to maintain FDA compliance. I'd recommend language like \"supports reproductive health\" rather than \"improves fertility.\"\n\nShall I prepare a full evidence brief for a specific ingredient or topic?",
  ],
  legal: [
    "Here's my analysis of the key legal considerations:\n\n**FDA Compliance (Supplements):**\n- Under DSHEA, supplements don't require pre-market approval, BUT labeling must comply with 21 CFR Part 101\n- Structure/function claims are permitted (\"supports reproductive health\") but disease claims are NOT (\"treats infertility\")\n- Required: ingredient list, serving size, disclaimer statement\n\n**HIPAA & Health Data:**\n- If Conceivable's app collects health data, it may be subject to HIPAA depending on whether it's classified as a covered entity\n- Recommendation: Treat all user health data as PHI regardless — it builds trust and future-proofs compliance\n- Implement: encryption at rest and in transit, access controls, audit logging\n\n**FTC Advertising Compliance:**\n- All health-related advertising claims must be substantiated\n- Testimonials must reflect typical results\n- Influencer partnerships require clear disclosure (#ad, #sponsored)\n\n**Action Items:**\n1. Review all supplement labels against current FDA requirements\n2. Conduct a HIPAA gap analysis for the app\n3. Create an influencer agreement template with FTC compliance language\n\nWant me to draft any of these documents?",
  ],
  "content-engine": [
    "Here's a multi-platform content strategy based on current trends:\n\n**Topic Analysis:**\nThis topic has strong engagement potential across platforms. Here's how I'd approach it:\n\n**LinkedIn (Long-form Post):**\nLead with a contrarian insight. Format: Hook → Personal story → Data point → Call to action. Target: 800-1200 words.\n\n**Instagram Carousel (8-10 slides):**\nSlide 1: Bold statement/hook\nSlides 2-8: Key points with visuals\nSlide 9: Summary/takeaway\nSlide 10: CTA (save, share, follow)\n\n**TikTok/Reels (15-60 sec):**\nHook in first 2 seconds. Use text overlays. Trending audio if applicable. End with a question to drive comments.\n\n**Blog/SEO:**\n1500-2000 words. Target long-tail keywords. Include internal links to product pages.\n\nShall I generate the full content for any of these platforms?",
  ],
};

function getDemoResponse(agentId: string): string {
  const responses = DEMO_RESPONSES[agentId] ?? DEMO_RESPONSES["content-engine"];
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function invokeAgent(
  input: AgentRunInput,
  options: AgentInvokeOptions = {}
): Promise<AgentRunOutput> {
  const startTime = Date.now();
  const config = AGENT_CONFIGS[input.agentId as AgentDivision];

  if (!config) {
    throw new Error(`Unknown agent: ${input.agentId}`);
  }

  const client = getClient();

  // If no API key, return a demo response
  if (!client) {
    // Add a small delay to feel natural
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
    return {
      agentId: input.agentId,
      response: getDemoResponse(input.agentId),
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
    };
  }

  const systemPrompt = options.systemPromptOverride ?? config.systemPrompt;

  const response = await client.messages.create({
    model: options.model ?? "claude-sonnet-4-20250514",
    max_tokens: options.maxTokens ?? 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: input.message,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  const responseText = textContent ? textContent.text : "";

  return {
    agentId: input.agentId,
    response: responseText,
    tokensUsed:
      (response.usage?.input_tokens ?? 0) +
      (response.usage?.output_tokens ?? 0),
    durationMs: Date.now() - startTime,
  };
}
