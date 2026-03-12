// First Period Experience — Complete Feature Set
// 12 features for the First Period experience
// 6 Tier 1 (Must Have), 4 Tier 2 (Should Have), 2 Tier 3 (Nice to Have)

export interface FirstPeriodFeatureSeed {
  name: string;
  description: string;
  userStory: string;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[];
  notes: string;
  tier: number;
  phase: string;
}

export const FIRST_PERIOD_FEATURES: FirstPeriodFeatureSeed[] = [
  // ═══════════════════════════════════════════
  // TIER 1 — MUST HAVE (6 features)
  // ═══════════════════════════════════════════
  {
    name: "First Period Predictor",
    description: "Lead gen magnet. Predictive analytics for menarche timing from family history, Tanner staging self-assessment, growth trajectory, cervical discharge onset, body hair, skin changes, mood patterns. Previous version: 1,000 emails/week. Output is a window not a date. Standalone web version for TikTok traffic.",
    userStory: "As a girl who hasn't gotten her period yet, I want to know when it's coming so I can be prepared instead of scared.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Atlas", "Kai"],
    notes: "Lead gen magnet — previous version generated 1,000 emails/week. Patent 018 covers this. Phase 1 deliverable.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Body Decoder",
    description: "Explains body changes (breast development, growth spurt, body hair, cervical discharge, skin changes, mood shifts) in age-appropriate language. Progress tracker framing: 'Your body is X% ready.' Illustrated, graphic-novel style.",
    userStory: "As a girl going through puberty, I want to understand what each body change means so they feel like progress instead of something scary.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Atlas"],
    notes: "Phase 1. Connected to predictor timeline. Frame as progress, not clinical assessment.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Period Prep Tracker",
    description: "Daily engagement tool. Track sleep, energy, mood, food, movement, stress, body signals, products on body. Visual progress (garden/character/journey — not a number). Kai gives daily feedback. 2-3 taps max.",
    userStory: "As a girl preparing for her first period, I want a fun daily tracker that shows me how taking care of my body helps me get ready.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Olive", "Seren"],
    notes: "Core daily engagement. NEVER frame as weight management or dieting. Phase 1.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Period Education Hub",
    description: "Graphic novel style education. NOT textbooks. Categories: anatomy, product guide, first day prep, period pack, myths vs facts, why periods are amazing, period and you, 'Your Body Your Rules' (age-tiered health & body education), 'Growing Up Is Hard' (life navigation support). New content regularly. 75 languages. Includes age-appropriate body autonomy, consent, online safety, relationship education, and reproductive health — all delivered as conversations through Seren and Kai, not curriculum.",
    userStory: "As a girl learning about periods, I want education that's fun and relatable — like a show I follow — not a boring health class textbook.",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Zhen"],
    notes: "Graphic novel format critical. Must be fun, not clinical. 75 languages via Zhen. Phase 1.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Seren's Safe Space",
    description: "Emotional core. Listen, validate, normalize, educate, empower, bridge. Handles: body embarrassment, peer comparison, product fears, family communication gaps, body image, social/emotional challenges, friendship dynamics, bullying, school struggles, family issues, social media pressure, self-esteem, identity, big emotions. Full 'Growing Up Is Hard' support woven into conversations. CHILD SAFETY: detect/escalate abuse, self-harm, eating disorders. Crisis resources. This makes Conceivable not just a period app but the support system every girl wishes she had — it's why she opens the app every day even when she's not thinking about her period.",
    userStory: "As a girl going through puberty, I need someone I can talk to about anything without judgment — someone who actually understands and doesn't just say 'go ask your mom.'",
    priority: "must_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Seren"],
    notes: "Safety-critical. Escalation protocols for abuse/self-harm/eating disorders MANDATORY. Phase 1.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },
  {
    name: "Body Positivity Curriculum",
    description: "Reframe: healthy = having a healthy period. Not about appearance. Woven throughout everything, not a separate module. NEVER mentions weight, BMI, dieting. Celebrates what the body DOES.",
    userStory: "As a girl whose body is changing, I want to feel proud of what my body can do instead of comparing myself to Instagram.",
    priority: "must_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Seren", "Olive"],
    notes: "Woven throughout all content, not standalone. Steinem test: would this exist if periods were celebrated? Phase 1.",
    tier: 1,
    phase: "Phase 1: Core Experience",
  },

  // ═══════════════════════════════════════════
  // TIER 2 — SHOULD HAVE (4 features)
  // ═══════════════════════════════════════════
  {
    name: "The Achievement System",
    description: "Not gamification badges. Genuine acknowledgments. Journey visualization. Private by default. Special milestone when period arrives.",
    userStory: "As a girl tracking my period prep, I want to see how far I've come and feel acknowledged for the healthy habits I'm building.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai"],
    notes: "Phase 2. NOT patronizing badges. Genuine, meaningful acknowledgments.",
    tier: 2,
    phase: "Phase 2: Engagement & Support",
  },
  {
    name: "Parent/Guardian Bridge",
    description: "Optional, girl-controlled. Parent portal with age-appropriate summaries, conversation starters, what NOT to say, product recommendations. For girls who can't involve parents: Seren as primary, help identify other trusted adults. Never assumes family structure.",
    userStory: "As a parent, I want to support my daughter through puberty with the right words — and know when to step back.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Navi"],
    notes: "Phase 2. Girl controls everything. NEVER assumes family structure.",
    tier: 2,
    phase: "Phase 2: Engagement & Support",
  },
  {
    name: "Period Poverty Resources",
    description: "Free supply programs, local resource finder via Navi, reusable product education (menstrual cups at ~$2 at scale, period underwear), hygiene/safety education. 75 languages. Global crisis. Phase 1: Connect to existing orgs. Phase 2: Partner with cup manufacturers for at-cost/free distribution. Phase 3: Direct supply program — free menstrual cups shipped to girls who need them. Luna provides age-appropriate product education including cups (step-by-step, zero pressure, alternatives if cups aren't right). Environmental benefits angle resonates with Gen Z/Alpha.",
    userStory: "As a girl whose family can't afford period products, I need help finding free supplies without feeling ashamed.",
    priority: "should_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Navi", "Kai", "Luna"],
    notes: "Phase 2. Period poverty is a global crisis. 75 languages critical. Long-term vision: 'When Conceivable is printing money, every girl who can't afford supplies gets them free. Period poverty ends with us.' Also a major PR story.",
    tier: 2,
    phase: "Phase 2: Engagement & Support",
  },
  {
    name: "Period Stories — Graphic Novel Series",
    description: "Ongoing illustrated series. Diverse characters. Multiple storylines. New episodes regularly. 75 languages. Education woven into narrative.",
    userStory: "As a girl navigating puberty, I want stories with characters like me going through the same things so I know I'm not alone.",
    priority: "should_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Kai", "Zhen"],
    notes: "Phase 2. Ongoing content pipeline. Diverse representation critical.",
    tier: 2,
    phase: "Phase 2: Engagement & Support",
  },

  // ═══════════════════════════════════════════
  // TIER 3 — NICE TO HAVE (2 features)
  // ═══════════════════════════════════════════
  {
    name: "First Period Celebration Kit",
    description: "Personalized celebration when period arrives. NOT generic. Kai celebrates, personalized journey summary, optional shareable card, practical guidance from Luna, transition to Periods experience.",
    userStory: "As a girl who just got her first period, I want it to feel like an achievement — not something to hide or be embarrassed about.",
    priority: "nice_to_have",
    complexity: "medium",
    status: "idea",
    careTeamMembers: ["Kai", "Luna", "Seren"],
    notes: "Phase 3. The Steinem vision realized. Graduation, not medical event.",
    tier: 3,
    phase: "Phase 3: Advanced Features",
  },
  {
    name: "Community Features",
    description: "Age-appropriate, heavily moderated. Questions board, period prep buddy matching, story share. SAFETY: no private messaging, no photos, no personal info. AI + human moderation. COPPA/GDPR-K compliant. If can't make it safe, don't build it.",
    userStory: "As a girl going through puberty, I want to connect with other girls going through the same thing in a space that feels completely safe.",
    priority: "nice_to_have",
    complexity: "large",
    status: "idea",
    careTeamMembers: ["Seren"],
    notes: "Phase 3. ONLY if safety standards are met. Safety over engagement. Always. COPPA/GDPR-K mandatory.",
    tier: 3,
    phase: "Phase 3: Advanced Features",
  },
];

// IP Coverage mapping for the First Period experience
export const FIRST_PERIOD_IP_COVERAGE: { feature: string; patents: { number: string; name: string; id: string }[] }[] = [
  {
    feature: "First Period Predictor",
    patents: [
      { number: "018", name: "First Period Predictor", id: "patent-018" },
    ],
  },
  {
    feature: "Body Decoder",
    patents: [
      { number: "018", name: "First Period Predictor", id: "patent-018" },
    ],
  },
  {
    feature: "Period Prep Tracker",
    patents: [
      { number: "001", name: "Conceivable Score", id: "draft-01" },
      { number: "019", name: "Age-Adaptive Care Team", id: "patent-019" },
    ],
  },
  {
    feature: "Period Education Hub",
    patents: [],
  },
  {
    feature: "Seren's Safe Space",
    patents: [
      { number: "019", name: "Age-Adaptive Care Team", id: "patent-019" },
    ],
  },
  {
    feature: "Body Positivity Curriculum",
    patents: [],
  },
  {
    feature: "The Achievement System",
    patents: [],
  },
  {
    feature: "Parent/Guardian Bridge",
    patents: [],
  },
  {
    feature: "Period Poverty Resources",
    patents: [],
  },
  {
    feature: "Period Stories",
    patents: [],
  },
  {
    feature: "First Period Celebration Kit",
    patents: [
      { number: "019", name: "Age-Adaptive Care Team", id: "patent-019" },
    ],
  },
  {
    feature: "Community Features",
    patents: [],
  },
];

// Experience description and persona for First Period experience
export const FIRST_PERIOD_DESCRIPTION = "If men had periods, having a period would be the coolest thing on the planet. That's what we're building. The First Period experience transforms menarche from something girls fear, hide, and endure into something they prepare for, understand, and own. Kirsten Karchmer's TikTok audience of 300,000 followers — many of them girls who haven't had their first period yet — asked the same questions every day: When is my period coming? How do I make it come faster? Where do I put a tampon? I'm too ashamed to tell my mom. My family can't afford supplies. Those questions broke our hearts and built this experience.\n\nThe core thesis: Your period is a reflection of how well you're treating your body. Sleep, nutrition, movement, stress, the products you put on your skin — all of it either works for or against you having a healthy, easy period. Girls who build healthy habits BEFORE their first period will have easier first periods. And we can prove it with data.\n\nThis isn't health class. This is the period experience that would exist if periods were celebrated instead of shamed. Playful, funny, a little bit silly, graphic-novel-style education, body positivity that redefines healthy as 'having a healthy period,' and an AI care team that ages with her. Get her at 10. Keep her for 40 years. Every data point she generates from day one travels with her through every Conceivable experience for the rest of her life.";

export const FIRST_PERIOD_PERSONA = "A girl between ages 7-16 who hasn't had her first period yet (or just got it). She's curious, maybe nervous, possibly excited, definitely underserved by existing education. She might have a supportive parent who wants to help, or she might have no one to talk to. She found us through TikTok, a friend, a school nurse, or a parent who downloaded the app for her. She deserves the period experience that would exist if periods were celebrated — and she's about to get it.";

// Care team configuration for First Period experience
export const FIRST_PERIOD_CARE_TEAM = [
  {
    name: "Kai",
    role: "Age-Matched Guide & Best Friend",
    color: "#5A6FFF",
    description: "Ages WITH the user. At 10, Kai is 10. At 13, Kai is 13. Vocabulary, humor, references all adjust. But personality stays consistent. Explains body changes, celebrates milestones, always encouraging, never clinical.",
    isNew: true,
    newLabel: "Age-Adaptive",
  },
  {
    name: "Seren",
    role: "Age-Matched Emotional Safe Space",
    color: "#E37FB1",
    description: "The person girls can't find anywhere else. Listens without judgment, validates every feeling, has answers to embarrassing questions. Detects and escalates abuse, self-harm, eating disorders. Never replaces a therapist — bridges to real help.",
  },
  {
    name: "Olive",
    role: "Age-Matched Nutrition Friend",
    color: "#1EAA55",
    description: "'Foods that make your body strong and your future period easier.' Makes healthy eating a cool choice, not punishment. NEVER mentions weight or dieting. At young ages: 'Did you eat something green today?' At older: cycle-prep nutrition.",
  },
  {
    name: "Luna",
    role: "Period Product Guide",
    color: "#7CAE7A",
    description: "Activates when period approaches or arrives. Practical, clear, visual explanations of every product option — pads, tampons, cups, discs, period underwear. Zero shame. Zero bias. She picks what works for her.",
  },
  {
    name: "Atlas",
    role: "Prediction Engine (Behind the Scenes)",
    color: "#356FB6",
    description: "Runs the predictor algorithm and tracks body signals. At young ages, she never interacts with Atlas directly — his insights come through Kai. The invisible brain powering personalized predictions.",
  },
  {
    name: "Zhen",
    role: "75-Language Translation",
    color: "#9686B9",
    description: "Critical for global reach. Girls in developing countries often have ZERO period education. Translates all content, stories, and care team conversations into 75 languages.",
  },
  {
    name: "Navi",
    role: "Resource Finder & Navigator",
    color: "#F1C028",
    description: "Finds period poverty resources by location: free supply programs, community organizations. Guides her through the experience. Especially critical for girls without family support.",
  },
];

// Age tiers for First Period experience
export const FIRST_PERIOD_AGE_TIERS = [
  {
    range: "Ages 7-9",
    label: "Pre-Awareness",
    color: "#F4A7B9",
    description: "Simple language, lots of reassurance, everything visual. Educational through stories and play, zero clinical terminology. Kai is a curious friend learning alongside her.",
    kaiStyle: "Curious friend learning alongside her",
    serenStyle: "Gentle and warm, mostly about general feelings and friendship",
    oliveStyle: "'Foods that make your body strong' — not 'nutrition'",
    contentStyle: "Illustrated, animated, story-driven",
  },
  {
    range: "Ages 10-12",
    label: "Period Prep",
    color: "#E37FB1",
    description: "More detail, real science in accessible ways. Humor becomes more sophisticated. Social dynamics addressed: friends who have their period vs those who don't.",
    kaiStyle: "Slightly older friend who knows some cool stuff",
    serenStyle: "Body image, social anxiety, crushes, friendship drama, family stress",
    oliveStyle: "Cycle-prep nutrition in fun ways",
    contentStyle: "Body Decoder active. Explaining body changes as 'getting ready' signals",
  },
  {
    range: "Ages 13-15",
    label: "First Period + Early Cycles",
    color: "#E24D47",
    description: "Full menstrual education, cycle tracking begins. Introduction to Period Health Score concept. Body image conversations get more complex. Relationship dynamics enter.",
    kaiStyle: "Trusted older sister figure",
    serenStyle: "Full capability with age-appropriate language",
    oliveStyle: "Full cycle-synced nutrition, age-appropriate",
    contentStyle: "Full care team capability with age-appropriate language",
  },
  {
    range: "Ages 16+",
    label: "Transition",
    color: "#5A6FFF",
    description: "Gradually transitions toward the full Periods experience. Adult-level information, complete tracking and optimization. Score, root cause analysis, cycle-synced everything.",
    kaiStyle: "Transitioning to adult Kai voice",
    serenStyle: "Full adult Seren capability",
    oliveStyle: "Full cycle-synced nutrition",
    contentStyle: "Functionally in the Periods experience with a younger voice",
  },
];

// Experience transitions for First Period experience
export const FIRST_PERIOD_TRANSITIONS = [
  {
    from: "TikTok / Web",
    to: "First Period",
    slug: "first-period",
    trigger: "Predictor quiz on website drives app download",
    color: "#F4A7B9",
    icon: "📱",
  },
  {
    from: "First Period",
    to: "Periods",
    slug: "periods",
    trigger: "When cycles establish and she's age-ready (typically 14-16)",
    color: "#E24D47",
    icon: "💫",
  },
  {
    from: "First Period",
    to: "PCOS",
    slug: "pcos",
    trigger: "If early PCOS signals detected (irregular cycles, other markers)",
    color: "#9686B9",
    icon: "🔬",
  },
];

// Roadmap for First Period experience
export const FIRST_PERIOD_ROADMAP = [
  {
    phase: "Phase 1",
    title: "Core Experience (Launch)",
    timeline: "10-12 weeks",
    status: "design",
    statusLabel: "In Design",
    description: "First Period Predictor (web + app), Body Decoder, Period Prep Tracker with visual progress, Period Education Hub (graphic novel episodes 1-10), Seren's Safe Space with age-adaptive conversations, Body Positivity curriculum, age-adaptive care team (all tiers)",
    deps: "Age-adaptive agent framework, predictor algorithm, illustration/content creation, COPPA compliance",
  },
  {
    phase: "Phase 2",
    title: "Engagement & Support",
    timeline: "4-8 weeks post-launch",
    status: "design",
    statusLabel: "In Design",
    description: "Achievement system, Parent/Guardian Bridge, Period Poverty Resources (Navi location-based finder), Period Stories graphic novel ongoing series",
    deps: "Resource database, moderation system, ongoing content creation",
  },
  {
    phase: "Phase 3",
    title: "Advanced Features",
    timeline: "8-12 weeks post-launch",
    status: "design",
    statusLabel: "In Design",
    description: "First Period Celebration Kit, Community features (ONLY if safety standards met), Period Pack builder, transition logic to Periods experience",
    deps: "Community moderation infrastructure, safety audit, experience transition framework",
  },
];

// Engineering components for First Period experience
export const FIRST_PERIOD_ENGINEERING = [
  {
    name: "First Period Prediction Engine",
    description: "Multi-factor predictive model for menarche timing. Inputs: age, family history, self-reported developmental markers (breast development, body hair, cervical discharge, growth, skin changes, mood patterns). Output: prediction window that narrows as more data is logged. Must be medically sound but delivered in age-appropriate, non-clinical language through Kai.",
    status: "Ready for Development",
    priority: "Critical",
    dependencies: "Age-adaptive UI, Body Decoder integration",
  },
  {
    name: "Age-Adaptive Agent Framework",
    description: "System enabling care team agents to dynamically adjust communication based on user age. Four tiers: 7-9, 10-12, 13-15, 16+. Adjustments: vocabulary complexity, humor style, cultural references, informational depth, visual content style, interaction patterns. Personality remains consistent across tiers. Transition is gradual.",
    status: "Ready for Development",
    priority: "Critical",
    dependencies: "Age verification, agent personality models",
  },
  {
    name: "Period Prep Visualization Engine",
    description: "Visual progress system for pre-menarche tracking. NOT a numerical score — a visual metaphor (garden, journey, character development) that reflects how well she's taking care of her body. Must be engaging enough for daily return visits from 10-12 year olds.",
    status: "Ready for Development",
    priority: "High",
    dependencies: "Period Prep Tracker, illustration assets",
  },
  {
    name: "Child Safety & Moderation System",
    description: "Multi-layer safety system for minor users. AI content moderation. Detection and escalation of: abuse indicators, self-harm language, eating disorder signals, bullying, grooming attempts, severe mental health crises. COPPA and GDPR-K compliant. This must be the safest digital space for young girls on the internet or we don't launch community features.",
    status: "Architecture Design Needed",
    priority: "MANDATORY",
    dependencies: "Legal review, safety audit, moderation team",
  },
  {
    name: "Graphic Novel Content System",
    description: "CMS for illustrated educational stories. Episode creation, character management, multi-language rendering (75 languages), user progress tracking, content tagging, age-tier content gating.",
    status: "Ready for Development",
    priority: "Medium",
    dependencies: "Illustration pipeline, Zhen translation integration",
  },
];

// ═══════════════════════════════════════════════════
// ITEM 1: AGE-APPROPRIATE HEALTH & BODY EDUCATION
// "Your Body, Your Rules" — age-tiered curriculum
// ═══════════════════════════════════════════════════

export interface EducationTier {
  ageRange: string;
  label: string;
  color: string;
  topics: { title: string; description: string }[];
  regulatoryNote?: string;
}

export const FIRST_PERIOD_EDUCATION_CURRICULUM: EducationTier[] = [
  {
    ageRange: "Ages 7-9",
    label: "Body Basics",
    color: "#F4A7B9",
    topics: [
      { title: "Your body belongs to you", description: "Body autonomy basics — your body is yours, always" },
      { title: "Safe vs unsafe touch", description: "Identifying trusted adults to tell. Clear, simple frameworks" },
      { title: "Nobody gets to make you uncomfortable", description: "Validating the feeling that something is 'wrong' — trust that instinct" },
      { title: "Real names for body parts", description: "Clinical terms, not euphemisms — research shows correct terminology protects children" },
    ],
  },
  {
    ageRange: "Ages 10-12",
    label: "Growing & Knowing",
    color: "#E37FB1",
    topics: [
      { title: "How bodies change during puberty", description: "Cross-links to Body Decoder — frame as exciting progress signals" },
      { title: "What consent means", description: "In friendships, with family, with anyone — saying no is always okay" },
      { title: "Online safety basics", description: "What to share, what never to share, who to tell if something feels wrong" },
      { title: "Feelings and crushes are normal", description: "Normalizing without instructing — every feeling is valid" },
      { title: "Hygiene and self-care during puberty", description: "Practical, shame-free guidance for a changing body" },
      { title: "Boundaries", description: "How to set them, how to respect them, how to recognize when someone crosses them" },
    ],
  },
  {
    ageRange: "Ages 13-15",
    label: "Real Talk",
    color: "#E24D47",
    topics: [
      { title: "How reproduction works", description: "Clinical, accurate, non-judgmental. 'This is how pregnancy happens.'" },
      { title: "Consent in relationships", description: "What it is, what it isn't, how to recognize pressure" },
      { title: "Healthy vs unhealthy relationships", description: "Red flags, green flags — concrete examples, not abstract concepts" },
      { title: "STI awareness", description: "What they are, how they spread, how to prevent them — factual, not fear-based" },
      { title: "Online safety — advanced", description: "Sexting risks, pressure for images, digital consent, what to do if something happens" },
      { title: "Your legal rights", description: "In most states, minors can access confidential reproductive health services" },
      { title: "If something happened to you", description: "Sexual assault resources, how to get help. It's never your fault. Ever." },
    ],
    regulatoryNote: "All content medically accurate, age-appropriate, framed as health education. Always provides pathways to trusted adults and professional resources.",
  },
  {
    ageRange: "Ages 16+",
    label: "Full Knowledge",
    color: "#5A6FFF",
    topics: [
      { title: "Contraception options", description: "Medically accurate overview of ALL methods — not advocacy, information" },
      { title: "Accessing reproductive healthcare", description: "How to find a provider, what to expect, your rights as a patient" },
      { title: "Deeper relationship education", description: "Communication, boundaries, recognizing manipulation and coercion" },
      { title: "Decision-making frameworks", description: "Not telling her what to do — giving her tools to make informed decisions for herself" },
    ],
  },
];

export const EDUCATION_FRAMING = "This is HEALTH EDUCATION delivered through a care team she trusts (Seren and Kai). Not a curriculum. Not health class. Conversations that happen naturally when she needs them — triggered by her questions, her age, her life circumstances. If she asks Seren 'is it normal to like someone,' Seren doesn't panic — she has an age-appropriate, warm, helpful response ready.";

export const EDUCATION_REGULATORY_NOTE = "All content must be medically accurate, age-appropriate, and framed as health education (which it is). No instructional sexual content. Always provide pathways to trusted adults and professional resources. COPPA compliance for data collection is separate from content — the educational content itself is legally protected as health information. Legal must review all content before launch.";

// ═══════════════════════════════════════════════════
// ITEM 2: LIFE NAVIGATION SUPPORT
// "Growing Up Is Hard" — Seren's expanded capabilities
// ═══════════════════════════════════════════════════

export const FIRST_PERIOD_LIFE_NAVIGATION = [
  { topic: "Friendship dynamics", description: "Making friends, losing friends, group dynamics, being left out, mean girls — the stuff that hurts most at this age", icon: "👥", color: "#E37FB1" },
  { topic: "Bullying", description: "What it is, what to do, how to get help. Online bullying. When adults don't help. When YOU are the bully.", icon: "🛡️", color: "#E24D47" },
  { topic: "School struggles", description: "Academic pressure, test anxiety, feeling dumb, learning differently — your grades don't define you", icon: "📚", color: "#F59E0B" },
  { topic: "Family stuff", description: "Divorce, fighting parents, sibling rivalry, feeling misunderstood. Every family is complicated.", icon: "🏠", color: "#7CAE7A" },
  { topic: "Body image", description: "Reinforced from body positivity curriculum. Instagram vs reality. What 'healthy' actually means.", icon: "🪞", color: "#F4A7B9" },
  { topic: "Social media pressure", description: "Comparison, FOMO, curated vs real life. When to put the phone down. When online interactions become harmful.", icon: "📱", color: "#5A6FFF" },
  { topic: "Self-esteem", description: "Building it, losing it, rebuilding it. It's a skill, not a personality trait. And it gets easier.", icon: "💪", color: "#1EAA55" },
  { topic: "Feeling different", description: "For any reason — body, family, interests, identity. Different isn't wrong. Different is just different.", icon: "🌈", color: "#9686B9" },
  { topic: "Big emotions", description: "Anger, sadness, anxiety, feeling overwhelmed. Every emotion is valid. Here's what to do with them.", icon: "🌊", color: "#356FB6" },
  { topic: "Identity", description: "Who am I? Who do I want to be? It's okay to not know yet. Most adults are still figuring it out too.", icon: "✨", color: "#D4A843" },
];

export const LIFE_NAVIGATION_FRAMING = "Seren handles all of this. She doesn't have all the answers but she ALWAYS listens, validates, normalizes, and helps the girl figure out her next step. Seren knows when to just be present and when to suggest resources or trusted adults. This makes Conceivable not just a period app but the support system every girl wishes she had. It's why she opens the app every day even when she's not thinking about her period.";

// ═══════════════════════════════════════════════════
// ITEM 3: PERIOD SUPPLY ACCESS PROGRAM
// Strategic initiative
// ═══════════════════════════════════════════════════

export const FIRST_PERIOD_SUPPLY_PROGRAM = {
  title: "Period Supply Access Program",
  subtitle: "Strategic Initiative — When Conceivable is printing money, period poverty ends with us.",
  phases: [
    {
      phase: "Phase 1",
      title: "Connect",
      timeline: "Launch",
      description: "Connect girls to existing free supply organizations via Navi's location-based resource finder. Already planned as part of Feature 9 (Period Poverty Resources).",
      status: "In Feature Spec",
      color: "#1EAA55",
    },
    {
      phase: "Phase 2",
      title: "Partner",
      timeline: "6-12 months post-launch",
      description: "Partner with menstrual cup manufacturers to provide cups at cost or free through the app. Menstrual cups can be sourced for approximately $2 at scale. Include period underwear as alternative reusable option.",
      status: "Strategic Planning",
      color: "#5A6FFF",
    },
    {
      phase: "Phase 3",
      title: "Direct Supply",
      timeline: "Revenue milestone",
      description: "Fund a direct supply program — free menstrual cups shipped to girls who need them worldwide. 'AI health company provides free menstrual cups to girls worldwide' — that's front-page material.",
      status: "Long-Term Vision",
      color: "#F4A7B9",
    },
  ],
  cupEducation: [
    "What menstrual cups are and how they work",
    "That they're safe and medically approved",
    "That they can be intimidating at first, especially if you've never inserted anything — and that's completely normal",
    "Step-by-step guidance (Luna handles this — age-appropriate, patient, zero pressure)",
    "Alternative options if cups aren't right for her (period underwear, reusable pads)",
    "Environmental benefits — sustainability matters to Gen Z/Alpha",
  ],
  prNote: "This is also a massive PR and press story. 'AI health company provides free menstrual cups to girls worldwide.' Front-page material. Aligns with brand mission and creates extraordinary earned media.",
};

// Content pipeline for First Period experience
export const FIRST_PERIOD_CONTENT_PIPELINE = {
  storyStatuses: ["concept", "scripted", "illustrated", "translated", "published"] as const,
  initialStories: [
    { title: "Episode 1: The Body Signal", topic: "Body changes as positive signals", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 2: The First Day", topic: "What happens when your period starts at school", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 3: Product Explorer", topic: "Trying different period products", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 4: The Period Pack", topic: "Building your emergency kit", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 5: Myth Busters", topic: "Period myths vs facts", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 6: The Talk", topic: "Talking to parents/guardians about periods", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 7: Different Timelines", topic: "Everyone gets their period at different times", ageTier: "10-12", status: "concept" as const },
    { title: "Episode 8: Period + Sports", topic: "Athletes and periods", ageTier: "13-15", status: "concept" as const },
    { title: "Episode 9: The Feelings Wave", topic: "Understanding hormonal mood changes", ageTier: "13-15", status: "concept" as const },
    { title: "Episode 10: Superpower", topic: "Why periods are actually amazing", ageTier: "10-12", status: "concept" as const },
  ],
};
