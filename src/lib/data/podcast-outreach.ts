// ────────────────────────────────────────────────────────────
// Podcast Reactivation Outreach — Data & Types
// Kirsten did 120+ podcasts — time to reactivate those hosts
// ────────────────────────────────────────────────────────────

export type PodcastOutreachStatus =
  | "not_contacted"
  | "email_sent"
  | "responded"
  | "booked"
  | "aired"
  | "declined";

export type PodcastCategory =
  | "fertility"
  | "womens_health"
  | "functional_medicine"
  | "wellness"
  | "health_tech"
  | "parenting"
  | "nutrition"
  | "mindset";

export interface PodcastHost {
  id: string;
  hostName: string;
  podcastName: string;
  category: PodcastCategory;
  estimatedListeners: number;
  previousEpisodeDate?: string;
  previousEpisodeTitle?: string;
  outreachStatus: PodcastOutreachStatus;
  referralCode?: string;
  email?: string;
  notes?: string;
}

export const PODCAST_CATEGORY_CONFIG: Record<
  PodcastCategory,
  { label: string; color: string }
> = {
  fertility: { label: "Fertility", color: "#5A6FFF" },
  womens_health: { label: "Women's Health", color: "#E37FB1" },
  functional_medicine: { label: "Functional Medicine", color: "#78C3BF" },
  wellness: { label: "Wellness", color: "#1EAA55" },
  health_tech: { label: "Health Tech", color: "#356FB6" },
  parenting: { label: "Parenting", color: "#F1C028" },
  nutrition: { label: "Nutrition", color: "#9686B9" },
  mindset: { label: "Mindset", color: "#E24D47" },
};

export const PODCAST_STATUS_CONFIG: Record<
  PodcastOutreachStatus,
  { label: string; color: string }
> = {
  not_contacted: { label: "Not Contacted", color: "#ACB7FF" },
  email_sent: { label: "Email Sent", color: "#F1C028" },
  responded: { label: "Responded", color: "#356FB6" },
  booked: { label: "Booked", color: "#1EAA55" },
  aired: { label: "Aired", color: "#78C3BF" },
  declined: { label: "Declined", color: "#E24D47" },
};

// ── Reactivation Email Template ──

export const REACTIVATION_EMAIL_TEMPLATE = {
  subject: "I finally built the thing I kept talking about on your show",
  body: `Hi [Host Name],

It's Kirsten Karchmer! I was on [Podcast Name] back in [Month/Year] talking about [Previous Episode Topic] — and your audience was amazing. I still get DMs from people who heard that episode.

I'm reaching out because I finally did the thing. You know how I kept saying "someone needs to build an app that actually tells women what's happening with their fertility in real time"? Well... I built it.

It's called Conceivable, and it's basically everything I've learned in 20 years of clinical practice — packaged into an AI-powered app with a wearable ring (the Halo Ring) that tracks the biomarkers that actually matter for fertility.

Here's why I think your audience would lose their minds:
- We created a Conceivable Score that quantifies fertility health (nothing like this exists)
- The app comes with Kai, an AI coach trained on my 20 years of clinical protocols
- We're doing personalized supplement packs based on each woman's actual data
- We're only opening 500 founding member spots

We're about 7 weeks from launch and I have SO much new science to share — including some stuff about [Topic relevant to their show] that I think would make an incredible episode.

Would you be up for having me back on? I can make it super valuable for your listeners — no fluff, just the kind of science-meets-real-talk content that worked so well last time.

Also — I have a special referral link I can set up for your audience if you're interested. Founding member pricing + personalized supplement packs.

Let me know what you think!

Big love,
Kirsten

P.S. Your referral link would be: conceivable.com/ref/[podcast-slug]`,
  useCase: "Reactivation email for podcast hosts Kirsten has previously appeared on",
};

// ── Referral Link Pattern ──

export const REFERRAL_LINK_BASE = "https://conceivable.com/ref/";

export function generateReferralCode(podcastName: string): string {
  return podcastName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
}

export function generateReferralLink(podcastName: string): string {
  return `${REFERRAL_LINK_BASE}${generateReferralCode(podcastName)}`;
}

// ── 120 Podcast Host Tracking Records ──
// Initial set: 120 hosts across categories
// These should be imported from the master spreadsheet; using seed data for now

export const PODCAST_HOSTS: PodcastHost[] = [
  // Fertility-focused podcasts (30)
  { id: "pod-001", hostName: "Dr. Aimee Eyvazzadeh", podcastName: "The Egg Whisperer Show", category: "fertility", estimatedListeners: 45000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Optimizing Fertility with Functional Medicine", outreachStatus: "not_contacted" },
  { id: "pod-002", hostName: "Dara Godfrey", podcastName: "The Fertility Podcast", category: "fertility", estimatedListeners: 32000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Nutrition and Egg Quality", outreachStatus: "not_contacted" },
  { id: "pod-003", hostName: "Dr. Natalie Crawford", podcastName: "As a Woman", category: "fertility", estimatedListeners: 85000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "The Science of the Fertile Window", outreachStatus: "not_contacted" },
  { id: "pod-004", hostName: "Jodie Peacock", podcastName: "The Fertility Warriors Podcast", category: "fertility", estimatedListeners: 18000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Supplements That Actually Work", outreachStatus: "not_contacted" },
  { id: "pod-005", hostName: "Monica Cox", podcastName: "The Fertility Mindset Podcast", category: "fertility", estimatedListeners: 22000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Mind-Body Connection in Fertility", outreachStatus: "not_contacted" },
  { id: "pod-006", hostName: "Dr. Lora Shahine", podcastName: "Baby or Bust", category: "fertility", estimatedListeners: 28000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Recurrent Loss and What We Can Do", outreachStatus: "not_contacted" },
  { id: "pod-007", hostName: "Robyn Birkin", podcastName: "The Fertility Warrior Podcast", category: "fertility", estimatedListeners: 15000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Taking Control of Your Fertility Journey", outreachStatus: "not_contacted" },
  { id: "pod-008", hostName: "Dr. Carrie Jones", podcastName: "Root Cause Medicine Podcast", category: "fertility", estimatedListeners: 38000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Hormones and Fertility After 35", outreachStatus: "not_contacted" },
  { id: "pod-009", hostName: "Julia Cheek", podcastName: "Testing 1-2-3", category: "fertility", estimatedListeners: 12000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "At-Home Fertility Testing", outreachStatus: "not_contacted" },
  { id: "pod-010", hostName: "Sarah Clark", podcastName: "Get Pregnant Naturally", category: "fertility", estimatedListeners: 20000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Functional Approaches to Unexplained Infertility", outreachStatus: "not_contacted" },
  { id: "pod-011", hostName: "Dr. Marc Sklar", podcastName: "The Fertility Expert", category: "fertility", estimatedListeners: 35000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Male Factor and What Couples Can Do Together", outreachStatus: "not_contacted" },
  { id: "pod-012", hostName: "Spenser Dillon", podcastName: "Fertility Foundations", category: "fertility", estimatedListeners: 9000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Building a Fertility-Friendly Lifestyle", outreachStatus: "not_contacted" },
  { id: "pod-013", hostName: "Dr. Aumatma Shah", podcastName: "Egg Meets Sperm", category: "fertility", estimatedListeners: 14000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Naturopathic Fertility Optimization", outreachStatus: "not_contacted" },
  { id: "pod-014", hostName: "Brandy Buskow", podcastName: "The IVF Warrior Podcast", category: "fertility", estimatedListeners: 11000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "IVF Prep and Supplement Protocols", outreachStatus: "not_contacted" },
  { id: "pod-015", hostName: "Angela Thyer", podcastName: "The Infertility Doc Podcast", category: "fertility", estimatedListeners: 8000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "What Your RE Isn't Telling You", outreachStatus: "not_contacted" },
  { id: "pod-016", hostName: "Dr. Lucky Sekhon", podcastName: "A Fertility Doctor Explains", category: "fertility", estimatedListeners: 42000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Egg Freezing and Future Fertility", outreachStatus: "not_contacted" },
  { id: "pod-017", hostName: "Heidi Brockmyre", podcastName: "Fertility Activation Method", category: "fertility", estimatedListeners: 7000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Chinese Medicine Meets Modern Fertility", outreachStatus: "not_contacted" },
  { id: "pod-018", hostName: "Dr. Jill Purdie", podcastName: "Conception Matters", category: "fertility", estimatedListeners: 6000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Preconception Health Fundamentals", outreachStatus: "not_contacted" },
  { id: "pod-019", hostName: "Katie Hintz-Zambrano", podcastName: "Mother Honestly", category: "fertility", estimatedListeners: 25000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "The Real Talk on Fertility Timelines", outreachStatus: "not_contacted" },
  { id: "pod-020", hostName: "Erin Bulcao", podcastName: "Fertility Forward", category: "fertility", estimatedListeners: 16000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Navigating the Fertility Industry", outreachStatus: "not_contacted" },
  { id: "pod-021", hostName: "Dr. Amy Beckley", podcastName: "Nine Plus Podcast", category: "fertility", estimatedListeners: 13000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Progesterone and Implantation", outreachStatus: "not_contacted" },
  { id: "pod-022", hostName: "Jennifer Jay Palumbo", podcastName: "The Fertility Matters Podcast", category: "fertility", estimatedListeners: 10000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Advocacy and Fertility Coverage", outreachStatus: "not_contacted" },
  { id: "pod-023", hostName: "Dr. Rachel Weintraub", podcastName: "Conception Journey", category: "fertility", estimatedListeners: 8500, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Thyroid and Fertility Connection", outreachStatus: "not_contacted" },
  { id: "pod-024", hostName: "Lisa Hendrickson-Jack", podcastName: "Fertility Friday", category: "fertility", estimatedListeners: 55000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Cycle Charting for Fertility Optimization", outreachStatus: "not_contacted" },
  { id: "pod-025", hostName: "Dr. Gleaton", podcastName: "The Natalist Podcast", category: "fertility", estimatedListeners: 19000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Modern Fertility Solutions", outreachStatus: "not_contacted" },
  { id: "pod-026", hostName: "Rena Gower", podcastName: "Fertility & Beyond", category: "fertility", estimatedListeners: 7500, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Stress Reduction for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-027", hostName: "Dr. Zaher Merhi", podcastName: "Ask a Fertility Doctor", category: "fertility", estimatedListeners: 21000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "DHEA and Egg Quality", outreachStatus: "not_contacted" },
  { id: "pod-028", hostName: "Gabriela Rosa", podcastName: "Fertility Challenge", category: "fertility", estimatedListeners: 12000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Environmental Toxins and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-029", hostName: "Dr. Elizabeth Cherot", podcastName: "Expecting Better", category: "fertility", estimatedListeners: 30000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Data-Driven Fertility Decisions", outreachStatus: "not_contacted" },
  { id: "pod-030", hostName: "Cindy Bailey", podcastName: "Fertile Ground", category: "fertility", estimatedListeners: 5000, previousEpisodeDate: "2025-01", previousEpisodeTitle: "Diet and Conception", outreachStatus: "not_contacted" },

  // Women's Health (20)
  { id: "pod-031", hostName: "Dr. Jolene Brighten", podcastName: "Beyond the Pill", category: "womens_health", estimatedListeners: 95000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Post-Birth Control Fertility Recovery", outreachStatus: "not_contacted" },
  { id: "pod-032", hostName: "Alisa Vitti", podcastName: "FloLiving Podcast", category: "womens_health", estimatedListeners: 65000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Cycle Syncing for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-033", hostName: "Dr. Aviva Romm", podcastName: "The Health Bridge", category: "womens_health", estimatedListeners: 48000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Hormonal Health and Conception", outreachStatus: "not_contacted" },
  { id: "pod-034", hostName: "Dr. Sara Gottfried", podcastName: "The Hormone Reset", category: "womens_health", estimatedListeners: 72000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Hormones After 35", outreachStatus: "not_contacted" },
  { id: "pod-035", hostName: "Nicole Jardim", podcastName: "The Period Party", category: "womens_health", estimatedListeners: 34000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Period Problems and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-036", hostName: "Dr. Taz Bhatia", podcastName: "Super Woman Rx", category: "womens_health", estimatedListeners: 40000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Integrative Medicine for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-037", hostName: "Liz Wolfe", podcastName: "Real Food Liz", category: "womens_health", estimatedListeners: 28000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Fertility Nutrition Deep Dive", outreachStatus: "not_contacted" },
  { id: "pod-038", hostName: "Dr. Stephanie Estima", podcastName: "Better with Dr. Stephanie", category: "womens_health", estimatedListeners: 52000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Metabolic Health and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-039", hostName: "Maggie Berghoff", podcastName: "Wellness Upgrade", category: "womens_health", estimatedListeners: 18000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Functional Testing for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-040", hostName: "Dr. Mariza Snyder", podcastName: "Essentially You", category: "womens_health", estimatedListeners: 30000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Essential Oils and Hormone Balance", outreachStatus: "not_contacted" },
  { id: "pod-041", hostName: "Dr. Anna Cabeca", podcastName: "The Girlfriend Doctor", category: "womens_health", estimatedListeners: 36000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Keto-Green and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-042", hostName: "Bridgit Danner", podcastName: "Less Stressed Life", category: "womens_health", estimatedListeners: 15000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Detox and Preconception Health", outreachStatus: "not_contacted" },
  { id: "pod-043", hostName: "Dr. Mindy Pelz", podcastName: "The Resetter Podcast", category: "womens_health", estimatedListeners: 110000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Fasting and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-044", hostName: "Kaely McDevitt", podcastName: "The Well Nourished Mama", category: "womens_health", estimatedListeners: 12000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Nourishing Your Body for Conception", outreachStatus: "not_contacted" },
  { id: "pod-045", hostName: "Amanda Montalvo", podcastName: "Are You Menstrual?", category: "womens_health", estimatedListeners: 25000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Minerals and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-046", hostName: "Laurie Dietrich", podcastName: "The PCOS Nutritionist", category: "womens_health", estimatedListeners: 22000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "PCOS and Getting Pregnant", outreachStatus: "not_contacted" },
  { id: "pod-047", hostName: "Dr. Shawn Tassone", podcastName: "The Hormone Doctor", category: "womens_health", estimatedListeners: 20000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Integrative Hormone Optimization", outreachStatus: "not_contacted" },
  { id: "pod-048", hostName: "Dr. Heather Hirsch", podcastName: "Health by Heather", category: "womens_health", estimatedListeners: 16000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Reproductive Health Across the Lifespan", outreachStatus: "not_contacted" },
  { id: "pod-049", hostName: "Jill Grunewald", podcastName: "Healthful Elements", category: "womens_health", estimatedListeners: 9000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Thyroid and Conception", outreachStatus: "not_contacted" },
  { id: "pod-050", hostName: "Dr. Christiane Northrup", podcastName: "Women's Bodies, Women's Wisdom", category: "womens_health", estimatedListeners: 130000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Fertility as a Vital Sign", outreachStatus: "not_contacted" },

  // Functional Medicine (20)
  { id: "pod-051", hostName: "Dr. Mark Hyman", podcastName: "The Doctor's Farmacy", category: "functional_medicine", estimatedListeners: 250000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Functional Medicine and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-052", hostName: "Dr. Will Cole", podcastName: "The Art of Being Well", category: "functional_medicine", estimatedListeners: 180000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Inflammation and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-053", hostName: "Chris Kresser", podcastName: "Revolution Health Radio", category: "functional_medicine", estimatedListeners: 120000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Ancestral Approach to Fertility", outreachStatus: "not_contacted" },
  { id: "pod-054", hostName: "Dr. Tom O'Bryan", podcastName: "The Dr. Tom Show", category: "functional_medicine", estimatedListeners: 45000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Autoimmunity and Reproductive Health", outreachStatus: "not_contacted" },
  { id: "pod-055", hostName: "Dr. Ben Lynch", podcastName: "Dirty Genes Podcast", category: "functional_medicine", estimatedListeners: 35000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "MTHFR and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-056", hostName: "Andrea Nakayama", podcastName: "15-Minute Matrix", category: "functional_medicine", estimatedListeners: 22000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Functional Nutrition for Conception", outreachStatus: "not_contacted" },
  { id: "pod-057", hostName: "Dr. Datis Kharrazian", podcastName: "Brain, Thyroid, Gut", category: "functional_medicine", estimatedListeners: 55000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Brain-Thyroid-Gut Axis in Fertility", outreachStatus: "not_contacted" },
  { id: "pod-058", hostName: "Dr. Ruscio", podcastName: "Dr. Ruscio Radio", category: "functional_medicine", estimatedListeners: 40000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Gut Health and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-059", hostName: "Sachin Patel", podcastName: "The Perfect Stool", category: "functional_medicine", estimatedListeners: 15000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Microbiome and Reproductive Health", outreachStatus: "not_contacted" },
  { id: "pod-060", hostName: "Dr. Amy Myers", podcastName: "The Myers Way", category: "functional_medicine", estimatedListeners: 60000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Autoimmune Protocol for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-061", hostName: "James Maskell", podcastName: "Evolution of Medicine", category: "functional_medicine", estimatedListeners: 28000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "The Future of Fertility Care", outreachStatus: "not_contacted" },
  { id: "pod-062", hostName: "Dr. Jeff Bland", podcastName: "Big Bold Health", category: "functional_medicine", estimatedListeners: 18000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Personalized Nutrition for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-063", hostName: "Dr. David Perlmutter", podcastName: "The Empowering Neurologist", category: "functional_medicine", estimatedListeners: 95000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Brain Health and Reproductive Outcomes", outreachStatus: "not_contacted" },
  { id: "pod-064", hostName: "Dr. Terry Wahls", podcastName: "The Wahls Protocol", category: "functional_medicine", estimatedListeners: 45000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Mitochondrial Health for Egg Quality", outreachStatus: "not_contacted" },
  { id: "pod-065", hostName: "Dr. Jill Carnahan", podcastName: "Health Mysteries Solved", category: "functional_medicine", estimatedListeners: 32000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Hidden Causes of Infertility", outreachStatus: "not_contacted" },
  { id: "pod-066", hostName: "Dr. Daniel Amen", podcastName: "The Brain Warrior's Way", category: "functional_medicine", estimatedListeners: 85000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Brain Health and Fertility Decisions", outreachStatus: "not_contacted" },
  { id: "pod-067", hostName: "Dr. Anna Garrett", podcastName: "Hormone Prescription", category: "functional_medicine", estimatedListeners: 14000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Bio-Identical Hormones and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-068", hostName: "Dr. Izabella Wentz", podcastName: "Thyroid Pharmacist", category: "functional_medicine", estimatedListeners: 50000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Hashimoto's and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-069", hostName: "Morley Robbins", podcastName: "Root Cause Protocol", category: "functional_medicine", estimatedListeners: 20000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Copper-Iron Balance and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-070", hostName: "Dr. Kara Fitzgerald", podcastName: "New Frontiers in Functional Medicine", category: "functional_medicine", estimatedListeners: 25000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Epigenetics and Preconception Health", outreachStatus: "not_contacted" },

  // Wellness (20)
  { id: "pod-071", hostName: "Dave Asprey", podcastName: "The Human Upgrade", category: "wellness", estimatedListeners: 300000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Biohacking Fertility", outreachStatus: "not_contacted" },
  { id: "pod-072", hostName: "Dhru Purohit", podcastName: "The Dhru Purohit Podcast", category: "wellness", estimatedListeners: 200000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "The Fertility Crisis Nobody Talks About", outreachStatus: "not_contacted" },
  { id: "pod-073", hostName: "Max Lugavere", podcastName: "The Genius Life", category: "wellness", estimatedListeners: 150000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Nutrition for Reproductive Health", outreachStatus: "not_contacted" },
  { id: "pod-074", hostName: "Ben Greenfield", podcastName: "Ben Greenfield Life", category: "wellness", estimatedListeners: 175000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Biohacking Fertility for Men and Women", outreachStatus: "not_contacted" },
  { id: "pod-075", hostName: "Shawn Stevenson", podcastName: "The Model Health Show", category: "wellness", estimatedListeners: 160000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Sleep and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-076", hostName: "Dr. Rangan Chatterjee", podcastName: "Feel Better, Live More", category: "wellness", estimatedListeners: 220000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Lifestyle Medicine for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-077", hostName: "Melissa Ambrosini", podcastName: "The Melissa Ambrosini Show", category: "wellness", estimatedListeners: 45000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Fertility and Self-Care", outreachStatus: "not_contacted" },
  { id: "pod-078", hostName: "Lori Harder", podcastName: "Earn Your Happy", category: "wellness", estimatedListeners: 55000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "The Emotional Side of Fertility", outreachStatus: "not_contacted" },
  { id: "pod-079", hostName: "Chalene Johnson", podcastName: "Build Your Tribe", category: "wellness", estimatedListeners: 80000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Health Optimization for Women", outreachStatus: "not_contacted" },
  { id: "pod-080", hostName: "Abel James", podcastName: "Fat-Burning Man", category: "wellness", estimatedListeners: 35000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Real Food for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-081", hostName: "Dr. Gabrielle Lyon", podcastName: "Dr. Gabrielle Lyon Show", category: "wellness", estimatedListeners: 90000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Protein and Muscle for Reproductive Health", outreachStatus: "not_contacted" },
  { id: "pod-082", hostName: "Katie Wells", podcastName: "The Wellness Mama Podcast", category: "wellness", estimatedListeners: 130000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Natural Fertility Optimization", outreachStatus: "not_contacted" },
  { id: "pod-083", hostName: "Dr. Pedram Shojai", podcastName: "The Urban Monk Podcast", category: "wellness", estimatedListeners: 40000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Stress, Qi, and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-084", hostName: "JJ Virgin", podcastName: "Well Beyond 40", category: "wellness", estimatedListeners: 65000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Metabolic Health and Late Fertility", outreachStatus: "not_contacted" },
  { id: "pod-085", hostName: "Sarah Wilson", podcastName: "Wild with Sarah Wilson", category: "wellness", estimatedListeners: 38000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Autoimmune and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-086", hostName: "Dr. Josh Axe", podcastName: "Ancient Health Podcast", category: "wellness", estimatedListeners: 75000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Ancient Remedies for Modern Fertility", outreachStatus: "not_contacted" },
  { id: "pod-087", hostName: "Jordan Harbinger", podcastName: "The Jordan Harbinger Show", category: "wellness", estimatedListeners: 350000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "The Science Behind Fertility Tech", outreachStatus: "not_contacted" },
  { id: "pod-088", hostName: "Dr. Casey Means", podcastName: "A Whole New Level", category: "wellness", estimatedListeners: 55000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Metabolic Health and Reproductive Outcomes", outreachStatus: "not_contacted" },
  { id: "pod-089", hostName: "Aubrey Marcus", podcastName: "Aubrey Marcus Podcast", category: "wellness", estimatedListeners: 100000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "The Conscious Conception Movement", outreachStatus: "not_contacted" },
  { id: "pod-090", hostName: "Dr. Andrew Huberman", podcastName: "Huberman Lab", category: "wellness", estimatedListeners: 500000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Neuroscience of Fertility", outreachStatus: "not_contacted" },

  // Health Tech (10)
  { id: "pod-091", hostName: "Halle Tecco", podcastName: "Femtech Focus", category: "health_tech", estimatedListeners: 25000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Building the Future of Fertility Tech", outreachStatus: "not_contacted" },
  { id: "pod-092", hostName: "Brittany Barreto", podcastName: "Femtech Focus", category: "health_tech", estimatedListeners: 18000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "AI in Reproductive Health", outreachStatus: "not_contacted" },
  { id: "pod-093", hostName: "Grace Geyoro", podcastName: "The Healthtech Podcast", category: "health_tech", estimatedListeners: 30000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Wearables for Women's Health", outreachStatus: "not_contacted" },
  { id: "pod-094", hostName: "Sylvia Kang", podcastName: "FemTech World", category: "health_tech", estimatedListeners: 12000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Fertility Tracking Technology", outreachStatus: "not_contacted" },
  { id: "pod-095", hostName: "Emily Zhang", podcastName: "Digital Health Today", category: "health_tech", estimatedListeners: 35000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Digital Biomarkers for Fertility", outreachStatus: "not_contacted" },
  { id: "pod-096", hostName: "Arielle Zuckerberg", podcastName: "Operator Podcast", category: "health_tech", estimatedListeners: 20000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Female Founders in FemTech", outreachStatus: "not_contacted" },
  { id: "pod-097", hostName: "Dr. Shafi Ahmed", podcastName: "The Future of Health", category: "health_tech", estimatedListeners: 22000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "AI Diagnostics in Reproductive Medicine", outreachStatus: "not_contacted" },
  { id: "pod-098", hostName: "Sarah Chen", podcastName: "HealthTech Hot Takes", category: "health_tech", estimatedListeners: 15000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Consumer Health Wearables", outreachStatus: "not_contacted" },
  { id: "pod-099", hostName: "Ron Gutman", podcastName: "Wellbeing Podcast", category: "health_tech", estimatedListeners: 28000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Preventive Health Technology", outreachStatus: "not_contacted" },
  { id: "pod-100", hostName: "Dr. Jessica Richman", podcastName: "Biome & Beyond", category: "health_tech", estimatedListeners: 10000, previousEpisodeDate: "2025-02", previousEpisodeTitle: "Microbiome Testing for Fertility", outreachStatus: "not_contacted" },

  // Parenting (10)
  { id: "pod-101", hostName: "Dr. Becky Kennedy", podcastName: "Good Inside", category: "parenting", estimatedListeners: 280000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "The Emotional Journey to Parenthood", outreachStatus: "not_contacted" },
  { id: "pod-102", hostName: "Janet Lansbury", podcastName: "Unruffled", category: "parenting", estimatedListeners: 150000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Preparing Mentally for Parenthood", outreachStatus: "not_contacted" },
  { id: "pod-103", hostName: "Laura Wifler", podcastName: "Risen Motherhood", category: "parenting", estimatedListeners: 85000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Faith and Fertility Struggles", outreachStatus: "not_contacted" },
  { id: "pod-104", hostName: "Cathy Heller", podcastName: "Don't Keep Your Day Job", category: "parenting", estimatedListeners: 65000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Purpose and the Path to Motherhood", outreachStatus: "not_contacted" },
  { id: "pod-105", hostName: "Kristen Bell", podcastName: "We Are Supported By", category: "parenting", estimatedListeners: 200000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Real Talk About Trying to Conceive", outreachStatus: "not_contacted" },
  { id: "pod-106", hostName: "Zibby Owens", podcastName: "Moms Don't Have Time to Read", category: "parenting", estimatedListeners: 40000, previousEpisodeDate: "2025-03", previousEpisodeTitle: "Books That Changed My Fertility Journey", outreachStatus: "not_contacted" },
  { id: "pod-107", hostName: "Dr. Emily Oster", podcastName: "ParentData", category: "parenting", estimatedListeners: 120000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Data on Fertility and Age", outreachStatus: "not_contacted" },
  { id: "pod-108", hostName: "Jill Smokler", podcastName: "Scary Mommy Speaks", category: "parenting", estimatedListeners: 95000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "The Unfiltered Truth About TTC", outreachStatus: "not_contacted" },
  { id: "pod-109", hostName: "Rachel Hollis", podcastName: "The Rachel Hollis Podcast", category: "parenting", estimatedListeners: 180000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Women's Health and Empowerment", outreachStatus: "not_contacted" },
  { id: "pod-110", hostName: "Laura Clery", podcastName: "Idiot Podcast", category: "parenting", estimatedListeners: 60000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "IVF, Loss, and Laughing Through It", outreachStatus: "not_contacted" },

  // Nutrition (5)
  { id: "pod-111", hostName: "Dr. Rhonda Patrick", podcastName: "Found My Fitness", category: "nutrition", estimatedListeners: 350000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Nutrigenomics and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-112", hostName: "Lily Nichols", podcastName: "Real Food for Pregnancy", category: "nutrition", estimatedListeners: 45000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "Prenatal Nutrition Deep Dive", outreachStatus: "not_contacted" },
  { id: "pod-113", hostName: "Kelly Leveque", podcastName: "Be Well By Kelly", category: "nutrition", estimatedListeners: 55000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Blood Sugar and Fertility", outreachStatus: "not_contacted" },
  { id: "pod-114", hostName: "Diane Sanfilippo", podcastName: "The Balanced Bites Podcast", category: "nutrition", estimatedListeners: 65000, previousEpisodeDate: "2025-04", previousEpisodeTitle: "Real Food for Real Fertility", outreachStatus: "not_contacted" },
  { id: "pod-115", hostName: "Cynthia Thurlow", podcastName: "Everyday Wellness", category: "nutrition", estimatedListeners: 80000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Intermittent Fasting and Fertility", outreachStatus: "not_contacted" },

  // Mindset (5)
  { id: "pod-116", hostName: "Jay Shetty", podcastName: "On Purpose", category: "mindset", estimatedListeners: 400000, previousEpisodeDate: "2025-08", previousEpisodeTitle: "Purpose and the Journey to Parenthood", outreachStatus: "not_contacted" },
  { id: "pod-117", hostName: "Mel Robbins", podcastName: "The Mel Robbins Podcast", category: "mindset", estimatedListeners: 450000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "The 5 Second Rule for Fertility Anxiety", outreachStatus: "not_contacted" },
  { id: "pod-118", hostName: "Lewis Howes", podcastName: "The School of Greatness", category: "mindset", estimatedListeners: 280000, previousEpisodeDate: "2025-06", previousEpisodeTitle: "The Fertility Journey Nobody Talks About", outreachStatus: "not_contacted" },
  { id: "pod-119", hostName: "Gabby Bernstein", podcastName: "Dear Gabby", category: "mindset", estimatedListeners: 150000, previousEpisodeDate: "2025-05", previousEpisodeTitle: "Manifesting and Science in Fertility", outreachStatus: "not_contacted" },
  { id: "pod-120", hostName: "Dr. Nicole LePera", podcastName: "SelfHealers Soundboard", category: "mindset", estimatedListeners: 100000, previousEpisodeDate: "2025-07", previousEpisodeTitle: "Healing Trauma for Fertility", outreachStatus: "not_contacted" },
];
