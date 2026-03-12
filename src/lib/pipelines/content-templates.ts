// ── Content Templates — Pre-built frameworks for Conceivable content ──

export interface ContentTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  platforms: string[];
  promptBoost: string;
  exampleHook: string;
  exampleCTA: string;
}

export type TemplateCategory =
  | "medical-educational"
  | "myth-busting"
  | "product-spotlight"
  | "community-engagement"
  | "lifestyle-wellness"
  | "trending-response";

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: "fertility-myth-buster",
    name: "Fertility Myth Buster",
    category: "myth-busting",
    platforms: ["instagram-post", "instagram-carousel", "tiktok", "linkedin"],
    promptBoost: `Structure this as a MYTH vs REALITY format.
Start with the myth (something widely believed but wrong about fertility).
Then reveal the truth with science to back it up.
Make it feel like an "aha moment" — the reader should feel smarter after reading this.
End with what they should actually do instead.
Tone: "Your cool aunt who also happens to be a fertility expert dropping truth bombs."`,
    exampleHook: "Stop believing this fertility myth. Seriously.",
    exampleCTA: "What fertility myth did YOU believe for way too long? Drop it in the comments.",
  },
  {
    id: "study-breakdown",
    name: "New Research Breakdown",
    category: "medical-educational",
    platforms: ["linkedin", "instagram-carousel", "blog", "youtube"],
    promptBoost: `Break down a scientific study into plain English.
Format: What they studied → What they found → Why you should care → What to do about it.
Make complex science feel accessible and actionable.
Cite the study but don't be dry about it.
Tone: "Your brilliant friend who reads medical journals for fun and explains them over coffee."`,
    exampleHook: "A new study just changed everything we thought about fertility after 35.",
    exampleCTA: "Save this for when someone tells you 'it's too late.' (It's not.)",
  },
  {
    id: "halo-ring-feature",
    name: "Halo Ring Spotlight",
    category: "product-spotlight",
    platforms: ["instagram-post", "tiktok", "pinterest", "linkedin"],
    promptBoost: `Spotlight a specific capability of the Halo Ring wearable.
ALWAYS call it "the Halo Ring" or "your Halo Ring" — never just "the ring."
Focus on how this feature gives women DATA about their own bodies.
Frame it as empowerment through knowledge, not another thing to track.
Show the connection between the data and actionable insights from Kai (AI coach).
Tone: "This is the device you wish existed 10 years ago."`,
    exampleHook: "Your Halo Ring knows you're ovulating before you do. Here's how.",
    exampleCTA: "Only 500 founding member spots. Link in bio.",
  },
  {
    id: "supplement-science",
    name: "Supplement Deep Dive",
    category: "medical-educational",
    platforms: ["instagram-carousel", "blog", "linkedin", "pinterest"],
    promptBoost: `Explain WHY a specific supplement matters for fertility.
Connect the mechanism (what it does in the body) to the outcome (why it helps fertility).
Reference that Conceivable's personalized supplement packs are formulated for each individual.
Don't just say "take this" — explain the science in a way that builds trust.
NEVER make unsubstantiated health claims. Use "may support" and "research suggests."
Tone: "The supplement aisle is overwhelming. Let me make it make sense."`,
    exampleHook: "CoQ10 isn't just a trendy supplement. Here's what it's actually doing for your eggs.",
    exampleCTA: "Your body needs different things than hers. That's why we personalize every pack.",
  },
  {
    id: "kirsten-hot-take",
    name: "Kirsten's Hot Take",
    category: "trending-response",
    platforms: ["linkedin", "tiktok", "instagram-post", "circle"],
    promptBoost: `This is the founder's STRONG, informed opinion on a topic.
Kirsten Karchmer has 20+ years of clinical experience in fertility and women's health.
She's board-certified, has seen thousands of patients, and has strong views backed by data.
The take should be bold but backed by science. Not just hot — smart-hot.
It's okay to challenge conventional wisdom or call out the industry.
Tone: "I've been doing this for 20 years and I have thoughts."`,
    exampleHook: "Unpopular opinion from a fertility expert: your OB-GYN is not a fertility specialist.",
    exampleCTA: "Agree or disagree? I want to hear your take in the comments.",
  },
  {
    id: "ttc-tips",
    name: "TTC Practical Tips",
    category: "lifestyle-wellness",
    platforms: ["instagram-post", "instagram-carousel", "pinterest", "tiktok"],
    promptBoost: `Share practical, actionable tips for women trying to conceive.
These should be evidence-based but not overwhelming.
Focus on things women can START DOING TODAY.
Frame fertility optimization as empowering self-care, not anxious tracking.
Include both obvious and surprising tips.
Reference that the Conceivable Score tracks how these factors affect overall fertility readiness.
Tone: "Here are things you can actually control. Let's focus there."`,
    exampleHook: "5 things fertility experts do that most women trying to conceive don't.",
    exampleCTA: "Which one are you trying first? Save this for your TTC toolkit.",
  },
  {
    id: "cycle-education",
    name: "Cycle Phase Education",
    category: "medical-educational",
    platforms: ["instagram-carousel", "blog", "pinterest", "youtube"],
    promptBoost: `Educate about a specific phase of the menstrual cycle.
Most women were never properly taught how their cycle works.
Make this feel like the biology class they deserved but never got.
Connect cycle phases to fertility, energy, mood, and what to do in each phase.
Mention how the Halo Ring tracks these phases automatically.
Tone: "Your body is doing incredible things every month. Let me show you."`,
    exampleHook: "Your luteal phase is making or breaking your fertility. Here's what's happening.",
    exampleCTA: "Which phase are you in right now? Your Halo Ring knows.",
  },
  {
    id: "success-framework",
    name: "Empowerment Framework",
    category: "lifestyle-wellness",
    platforms: ["linkedin", "instagram-carousel", "blog", "circle"],
    promptBoost: `Frame this as "here's what you CAN do" — shift from helpless to empowered.
Structure: The problem → Why it feels impossible → What the data actually says → Your action plan.
This is Conceivable's core message: you have more power over your fertility than you think.
Reference the Conceivable Score as a way to see your progress measured from where you started (the GAIN, not the gap).
Tone: "You are not powerless. Here's the proof, and here's the plan."`,
    exampleHook: "You have more control over your fertility than any doctor has told you.",
    exampleCTA: "Start measuring your Conceivable Score. Knowledge is power.",
  },
  {
    id: "industry-commentary",
    name: "Industry Commentary",
    category: "trending-response",
    platforms: ["linkedin", "tiktok", "youtube", "blog"],
    promptBoost: `Respond to a piece of fertility industry news or a trending topic.
Position Conceivable/Kirsten as a thought leader who sees the bigger picture.
Connect the news to what it means for real women trying to conceive.
It's okay to be critical of the industry where warranted (fertility industry is broken).
Always bring it back to what Conceivable is doing differently.
Tone: "Let me tell you what nobody else is saying about this."`,
    exampleHook: "Everyone's celebrating this new fertility study. But they're missing the point.",
    exampleCTA: "The fertility industry needs to do better. We're building what should already exist.",
  },
  {
    id: "community-question",
    name: "Community Spark",
    category: "community-engagement",
    platforms: ["instagram-post", "circle", "tiktok", "linkedin"],
    promptBoost: `Start a conversation with the community. Ask a question that:
1. Makes people feel safe sharing their experience
2. Validates their journey (wherever they are)
3. Creates connection between community members
The question should be specific enough to generate real responses, not generic.
Follow up the question with a brief personal share from Kirsten's perspective.
Tone: "I asked because I genuinely want to know. And here's my answer too."`,
    exampleHook: "Real talk: what's the one thing about your fertility journey nobody warned you about?",
    exampleCTA: "Share below. You might help someone who's feeling exactly the same way right now.",
  },
  {
    id: "morning-motivation",
    name: "Morning Motivation",
    category: "lifestyle-wellness",
    platforms: ["instagram-post", "instagram-story", "tiktok"],
    promptBoost: `Create uplifting, empowering morning content.
This should feel like a warm text from someone who believes in you.
Short, punchy, screenshot-worthy. The kind of thing people save and share.
Connect the motivation to the fertility journey without being heavy about it.
Affirmation-style is great. "Reminder:" format works well.
Tone: "Good morning. You're doing better than you think. Here's your proof."`,
    exampleHook: "Reminder: your body is doing extraordinary things right now, even if you can't see it yet.",
    exampleCTA: "Send this to someone who needs to hear it today.",
  },
  {
    id: "data-spotlight",
    name: "Data Spotlight",
    category: "medical-educational",
    platforms: ["linkedin", "instagram-post", "pinterest", "blog"],
    promptBoost: `Lead with ONE surprising, specific statistic about fertility or women's health.
The stat should make people stop scrolling. "Wait, really?"
Then unpack what it means and why it matters.
Connect it to something actionable women can do.
If relevant, mention how the Conceivable Score or Halo Ring provides personalized data.
NEVER make unsubstantiated claims. Cite sources or say "research suggests."
Tone: "The numbers don't lie. And this one changes everything."`,
    exampleHook: "90% of women don't know their luteal phase length. That one number could change your fertility journey.",
    exampleCTA: "Your data tells a story. Are you listening? Start tracking what matters.",
  },
];

export function getTemplatesForPlatform(platform: string): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.platforms.includes(platform));
}

export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.category === category);
}

export function applyTemplate(templateId: string, topic: string, founderAngle: string): string {
  const template = getTemplateById(templateId);
  if (!template) return "";

  return `CONTENT TEMPLATE: ${template.name}

TEMPLATE FRAMEWORK:
${template.promptBoost}

EXAMPLE HOOK (for inspiration, don't copy verbatim): "${template.exampleHook}"
EXAMPLE CTA (for inspiration, don't copy verbatim): "${template.exampleCTA}"

TOPIC: ${topic}

FOUNDER'S ANGLE: ${founderAngle}

Use the template framework above to structure your content. Match the energy and format described.
The hook and CTA examples are for inspiration — create original versions that fit this specific topic.`;
}
