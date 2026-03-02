// Content Engine — Daily Brief seed data
// Agent-curated morning feed for CEO's 10-minute daily command post

export type RelevanceTag = "competitor" | "science" | "industry" | "viral" | "regulatory";
export type RiskLevel = "low" | "medium" | "high";
export type Platform = "facebook" | "instagram" | "linkedin" | "x" | "pinterest";

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  brief: string;
  tag: RelevanceTag;
  isViral: boolean;
  viralReason?: string;
  summary: string;
  fullArticle: string;
  agentRecommendation: string;
  coverageAngle: string;
  timestamp: string;
  povRecording?: string;
  povTranscript?: string;
  generatedContent?: GeneratedContent[];
}

export interface ResearchItem {
  id: string;
  title: string;
  journal: string;
  authors: string;
  doi: string;
  brief: string;
  relevanceScore: number;
  fillsGap: boolean;
  gapDescription?: string;
  summary: {
    design: string;
    keyFindings: string;
    sampleSize: string;
    limitations: string;
    conceivableRelevance: string;
  };
  fullAbstract: string;
  timestamp: string;
  povRecording?: string;
  povTranscript?: string;
  generatedContent?: GeneratedContent[];
}

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  body: string;
  upvotes: number;
  comments: number;
  url: string;
  engagementPotential: number;
  relevanceScore: number;
  riskLevel: RiskLevel;
  draftResponse: string;
  status: "pending" | "approved" | "posted" | "skipped";
  timestamp: string;
}

export interface GeneratedContent {
  platform: Platform;
  copy: string;
  hashtags: string[];
  imageDescription: string;
  status: "draft" | "approved" | "scheduled" | "published";
}

export interface CalendarEntry {
  id: string;
  date: string;
  platform: Platform;
  title: string;
  excerpt: string;
  status: "draft" | "approved" | "scheduled" | "published";
  sourceType: string;
  engagement?: { likes: number; shares: number; comments: number; clicks: number };
  isMultiplier: boolean;
  multiplierNote?: string;
}

// ============================================================
// TOP 10 NEWS & SOCIAL
// ============================================================

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-01",
    title: "Oura Ring Announces Cycle Prediction Feature Powered by New Algorithm",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com",
    brief: "Oura is rolling out an updated cycle prediction algorithm that claims 5-day advance ovulation prediction using temperature and HRV data.",
    tag: "competitor",
    isViral: false,
    summary: `• Oura's new algorithm uses overnight temperature trends + HRV patterns to predict ovulation up to 5 days in advance
• Claims 82% accuracy in clinical validation study (n=1,200 women)
• Feature rolls out to all Gen 3 ring users in Q2
• Partnership with fertility clinic network for data validation
• Key limitation: prediction only, no intervention recommendations or closed-loop feedback`,
    fullArticle: `Oura Health announced today a major update to its reproductive health features, introducing a cycle prediction algorithm that the company says can predict ovulation up to five days in advance using a combination of overnight skin temperature trends and heart rate variability patterns.\n\nThe Finnish health technology company, known for its smart ring wearable, said the algorithm was validated in a clinical study of 1,200 women aged 18-42 over six menstrual cycles. The study, which has been submitted for peer review, showed 82% accuracy in predicting the fertile window.\n\n"This represents a significant advancement in wearable-based fertility tracking," said Oura CEO Tom Hale. "By combining temperature and HRV signals, we can provide women with actionable insights about their fertility window earlier than existing methods."\n\nThe feature will be available to all Oura Ring Generation 3 users through a software update in Q2. It joins Oura's existing period prediction and cycle tracking features.\n\nNotably, the feature focuses on prediction rather than intervention — it tells users when ovulation is likely but does not provide personalized recommendations for optimizing fertility outcomes.`,
    agentRecommendation: "HIGH PRIORITY. Direct competitor move in our space. Their approach is prediction-only (single variable) vs our closed-loop system. This is a 10x content opportunity: position Conceivable as 'prediction is step 1, but what do you DO with that prediction?' The gap between knowing and acting is our entire value proposition.",
    coverageAngle: "Prediction without intervention is like a weather forecast without an umbrella. Cover as: 'Great that wearables are advancing — and here's why prediction alone isn't enough.'",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-02",
    title: "NIH Announces $50M Funding for AI in Reproductive Health Research",
    source: "NIH News",
    sourceUrl: "https://nih.gov",
    brief: "The National Institutes of Health is investing $50 million in AI-driven reproductive health research over the next 5 years, signaling major federal interest in the space.",
    tag: "industry",
    isViral: false,
    summary: `• $50M over 5 years for AI applications in reproductive health
• Focus areas: fertility prediction, pregnancy outcomes, hormonal disorder diagnosis
• Open to academic institutions and private companies (SBIR/STTR eligible)
• Applications open Q3 — Conceivable could be eligible
• Validates the thesis that AI + reproductive health is a major emerging field`,
    fullArticle: `The National Institutes of Health announced a new $50 million research initiative focused on applying artificial intelligence to reproductive health challenges. The funding, distributed over five years through the National Institute of Child Health and Human Development (NICHD), will support projects that use machine learning and AI to improve fertility outcomes, predict pregnancy complications, and advance diagnosis of hormonal disorders.\n\nThe initiative reflects growing recognition that reproductive health has been underserved by technological innovation compared to other medical specialties.\n\n"Reproductive health affects half the population, yet it receives a fraction of the research funding of other fields," said NICHD Director Dr. Diana Bianchi. "AI has the potential to transform how we understand and treat fertility challenges."\n\nThe program is open to academic institutions, healthcare organizations, and private companies through the Small Business Innovation Research (SBIR) and Small Business Technology Transfer (STTR) programs.`,
    agentRecommendation: "10x MULTIPLIER. This validates our entire thesis at the federal level. Use for: (1) Fundraising — 'the NIH just committed $50M to what we're building,' (2) Content — thought leadership on why this matters, (3) Operations — explore SBIR/STTR application for non-dilutive funding.",
    coverageAngle: "The federal government just validated what we've been saying: AI will transform reproductive health. Cover with authority — we're already building what they're funding.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-03",
    title: "TikTok Fertility Influencer's 'Seed Cycling' Claims Go Viral — 4.2M Views",
    source: "TikTok / Social Monitoring",
    sourceUrl: "https://tiktok.com",
    brief: "A fertility influencer's video claiming seed cycling can 'reset your hormones in 30 days' has gone viral with 4.2M views, spreading unverified health claims.",
    tag: "viral",
    isViral: true,
    viralReason: "Simple promise ('reset hormones in 30 days') + aesthetic visual format + emotional hook ('what your doctor won't tell you'). Classic misinformation pattern: takes a grain of truth (phytoestrogens in seeds) and overextends to unverified claims.",
    summary: `• Video claims rotating flax, pumpkin, sesame, and sunflower seeds by cycle phase 'resets hormonal balance in 30 days'
• 4.2M views, 380K likes, 12K comments in 48 hours
• Comments show women changing their protocols based on this video
• Grain of truth: lignans in flax seeds do have weak estrogenic activity, and some evidence supports dietary phytoestrogens
• The claim: 'reset hormones in 30 days' is not supported by clinical evidence
• Opportunity: science-based response that respects the interest while correcting the overreach`,
    fullArticle: `A TikTok video by fertility influencer @naturalfertilitycoach claiming that "seed cycling" can reset hormonal balance in 30 days has accumulated over 4.2 million views in just 48 hours.\n\nThe video demonstrates a protocol of eating specific seeds — flax and pumpkin during the follicular phase, sesame and sunflower during the luteal phase — claiming this practice "naturally balances estrogen and progesterone."\n\nWhile some research suggests that lignans found in flaxseeds have weak estrogenic properties, and dietary phytoestrogens may have modest hormonal effects, the claim that seed cycling can "reset" hormones in 30 days is not supported by clinical evidence.\n\nThe video's comment section reveals thousands of women expressing intent to try the protocol, with many asking whether they should adjust or stop current medical treatments.\n\nEndocrinologists have expressed concern about the video's potential to lead women away from evidence-based treatments.`,
    agentRecommendation: "10x CONTENT OPPORTUNITY. This is the perfect case study for our 'science vs. social media' content angle. Don't attack the influencer — validate the interest in natural approaches while showing what the evidence actually says. This positions Conceivable as the trustworthy expert voice. Create content for ALL platforms — this topic is hot right now.",
    coverageAngle: "Respectful correction: 'We love that women are interested in how nutrition affects hormones. Here's what the research actually shows about seed cycling — and what to focus on instead if you want evidence-based dietary support for fertility.'",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-04",
    title: "Natural Cycles FDA Clearance Expanded to Include Fertility Planning Mode",
    source: "MedTech Dive",
    sourceUrl: "https://medtechdive.com",
    brief: "Natural Cycles' FDA clearance now covers fertility planning (conceiving), not just contraception. First app to have dual FDA clearance.",
    tag: "competitor",
    isViral: false,
    summary: `• Natural Cycles now FDA-cleared for both preventing AND planning pregnancy
• First digital health app with dual reproductive clearance
• Uses BBT algorithm for fertile window prediction
• Expansion validates the regulatory pathway for fertility apps
• Still single-signal (temperature only) — no multi-signal integration`,
    fullArticle: `Natural Cycles, the Swedish digital contraceptive app, announced that the FDA has expanded its De Novo clearance to include a fertility planning mode, making it the first app cleared for both preventing and planning pregnancy.\n\nThe expanded clearance allows Natural Cycles to market its temperature-based algorithm as a tool for identifying fertile windows for women trying to conceive, in addition to its existing contraceptive indication.\n\n"This is a milestone for digital reproductive health," said Natural Cycles co-founder Dr. Elina Berglund. "Women can now use one app for all stages of their reproductive journey."\n\nThe fertility planning mode uses the same basal body temperature algorithm but inverts the guidance — instead of flagging fertile days as "use protection," it flags them as "optimal for conception."`,
    agentRecommendation: "IMPORTANT — competitor intelligence. Natural Cycles blazing the regulatory trail is good for us strategically (validates the category) but their approach is still single-signal BBT. Our multi-signal + closed-loop system is fundamentally different. Use for fundraising deck: 'The category is validated by FDA — and we're building the next generation.'",
    coverageAngle: "Celebrate the category validation. Position: 'Temperature tracking is a great start — and it's just one of seven signals that matter for fertility health.'",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-05",
    title: "WHO Report: Global Infertility Affects 1 in 6 People — Calls for Expanded Access",
    source: "World Health Organization",
    sourceUrl: "https://who.int",
    brief: "New WHO report confirms 1 in 6 people globally experience infertility, calling it a 'major public health issue' requiring expanded access to affordable care.",
    tag: "industry",
    isViral: true,
    viralReason: "'1 in 6' statistic is shareable and personally relatable. Major institutional source (WHO) gives it authority. Emotional resonance with anyone who's struggled.",
    summary: `• 17.5% of the adult population globally affected by infertility
• Report calls for affordable, accessible fertility care as a public health priority
• Highlights disparities: low-income countries have 3x less access to fertility care
• Recommends integrating fertility care into universal health coverage
• Key data point: average cost of one IVF cycle is $12,500 in the US`,
    fullArticle: `The World Health Organization has released a comprehensive report confirming that infertility affects approximately 1 in 6 people of reproductive age worldwide, declaring it a "major public health issue" that requires urgent expansion of affordable care.\n\nThe report, based on data from 133 studies across 53 countries, found that the prevalence of infertility — defined as the inability to achieve pregnancy after 12 months of regular unprotected intercourse — is remarkably consistent across high, middle, and low-income nations.\n\n"Infertility does not discriminate," said WHO Director-General Dr. Tedros Adhanom Ghebreyesus. "Yet access to care does. Millions of people face catastrophic healthcare costs or simply cannot access fertility treatments."`,
    agentRecommendation: "HIGH VALUE for multiple departments. Content: share the data with commentary on accessibility. Fundraising: TAM validation (1 in 6 = massive market). Email: could reference in education sequence. Create a data visualization showing the gap between need and access.",
    coverageAngle: "Lead with empathy: '1 in 6 people. If that's you, you're not alone — and you deserve better than the current system offers.' Then pivot to access and what technology can do.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-06",
    title: "Apple Health Adds Cycle Deviation Alerts in iOS 19 Beta",
    source: "9to5Mac",
    sourceUrl: "https://9to5mac.com",
    brief: "iOS 19 beta includes cycle deviation alerts that notify users when their cycle patterns significantly change, using Apple Watch temperature data.",
    tag: "competitor",
    isViral: false,
    summary: `• New alert system flags when cycle length deviates more than 7 days from personal baseline
• Uses Apple Watch Cycle Tracking temperature data
• Notification suggests consulting healthcare provider
• Available in iOS 19 beta, expected public release Q4
• Validation of wearable-based cycle monitoring, but reactive (alert after deviation) not proactive`,
    fullArticle: `Apple's iOS 19 beta, currently available to developers, includes a new cycle health feature that alerts users when their menstrual cycle patterns show significant deviations from their established baseline.\n\nThe feature, integrated into the Health app's Cycle Tracking module, uses temperature data from Apple Watch to establish a personal baseline cycle pattern. When subsequent cycles deviate by more than seven days from this baseline, the system triggers a notification suggesting the user consult a healthcare provider.\n\nApple emphasized that the feature is designed for awareness rather than diagnosis, aligning with the company's approach of providing health insights while deferring clinical interpretation to healthcare professionals.`,
    agentRecommendation: "COMPETITOR WATCH. Apple normalizing cycle deviation tracking is great for market education. Their approach: detect → alert → 'see your doctor.' Our approach: detect → diagnose driver → recommend intervention → verify response. Cover the gap between detection and action.",
    coverageAngle: "Apple is teaching the world that cycle patterns matter. That's great. The next question is: 'My cycle deviated — now what?' That's where Conceivable starts.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-07",
    title: "Harvard Study: Stress Biomarkers Predict IVF Outcomes with 71% Accuracy",
    source: "Fertility and Sterility",
    sourceUrl: "https://fertstert.org",
    brief: "Researchers at Harvard found that cortisol patterns and HRV metrics measured before IVF cycles can predict success rates with 71% accuracy.",
    tag: "science",
    isViral: false,
    summary: `• Prospective study of 847 women undergoing IVF
• Pre-cycle cortisol rhythm + resting HRV predicted cycle outcomes
• 71% accuracy for live birth prediction
• Women with disrupted cortisol patterns had 40% lower implantation rates
• Researchers recommend stress assessment as standard pre-IVF protocol`,
    fullArticle: `A prospective study conducted at Harvard Medical School and published in Fertility and Sterility has demonstrated that stress biomarkers — specifically cortisol rhythm patterns and heart rate variability — measured in the month before an IVF cycle can predict treatment outcomes with 71% accuracy.\n\nThe study followed 847 women undergoing their first IVF cycle at Brigham and Women's Hospital. Researchers collected wearable HRV data and salivary cortisol samples at four time points daily for 14 days prior to cycle start.\n\nKey findings: women with disrupted cortisol rhythms (flattened diurnal curves) had 40% lower implantation rates compared to women with healthy cortisol patterns. High daytime HRV variability correlated with improved embryo transfer outcomes.\n\n"This study provides strong evidence that the stress axis directly impacts fertility treatment outcomes," said lead author Dr. Sarah Chen. "We believe stress assessment should become a standard part of pre-IVF evaluation."`,
    agentRecommendation: "10x VALIDATION. This directly supports our hypothesis that stress/HRV is a critical fertility driver. Use in: (1) Product — validate our stress driver algorithm, (2) Content — 'Harvard just proved what we've been building,' (3) Fundraising — clinical evidence supporting our approach.",
    coverageAngle: "Lead with the finding: 'A Harvard study just showed that stress biomarkers predict IVF success. This is exactly why Conceivable tracks your stress patterns — because your body's stress response directly impacts fertility.'",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-08",
    title: "Instagram Reels Algorithm Now Prioritizing 'Expert' Health Content",
    source: "Social Media Today",
    sourceUrl: "https://socialmediatoday.com",
    brief: "Meta announces algorithm changes to boost verified health expert content in Reels, demoting unverified health claims. Opportunity for credentialed creators.",
    tag: "industry",
    isViral: false,
    summary: `• Meta's new algorithm change boosts Reels from verified health professionals
• Unverified health claims will see reduced distribution
• Creators can apply for 'Health Expert' verification badge
• Affects Instagram and Facebook Reels
• Opportunity: Kirsten's credentials could qualify for expert badge`,
    fullArticle: `Meta has announced significant changes to how health-related content is ranked in Instagram and Facebook Reels, introducing a new "Health Expert" verification system that will boost content from credentialed healthcare professionals while reducing the distribution of unverified health claims.\n\nThe change comes after years of criticism about health misinformation spreading through short-form video platforms. Under the new system, healthcare professionals, researchers, and credentialed health educators can apply for a special verification badge that signals algorithmic preference.\n\n"We want to ensure that when people search for health information on our platforms, the most credible voices are amplified," said Meta's Head of Health Policy.`,
    agentRecommendation: "IMMEDIATE ACTION. Kirsten should apply for Health Expert verification ASAP. This gives our content algorithmic priority over competitors without credentials. This is a classic 10x move — one verification unlocks amplified reach on the two largest social platforms.",
    coverageAngle: "Not a content piece — this is an operational action item. Apply for verification, then create a content strategy specifically for Reels that leverages the algorithmic boost.",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-09",
    title: "Ava Bracelet Discontinues Consumer Product — Pivots to Clinical Research Only",
    source: "Digital Health Business & Technology",
    sourceUrl: "https://hitconsultant.net",
    brief: "Ava, once a major competitor in wearable fertility tracking, has discontinued its consumer product to focus exclusively on clinical research partnerships.",
    tag: "competitor",
    isViral: false,
    summary: `• Ava closing its consumer-facing wearable fertility tracker
• Pivoting to B2B clinical research data platform
• Consumer product had struggled with retention and unit economics
• Competitor exit opens market space
• Key lesson: hardware-first approach in fertility is expensive and hard to scale`,
    fullArticle: `Ava, the Swiss health technology company known for its wrist-worn fertility tracking bracelet, has announced it will discontinue its consumer product effective Q3 2026, pivoting entirely to a clinical research data platform.\n\nThe company, which had raised over $40 million in venture funding, said the consumer hardware business faced challenges with customer acquisition costs, hardware margins, and subscription retention.\n\n"We've found that our greatest value lies in the data infrastructure we've built, not in consumer hardware," said Ava CEO Pascal Koenig. "Our clinical research partners need exactly what we've built — the ability to collect and analyze multi-signal reproductive health data at scale."\n\nThe move leaves a gap in the wearable fertility tracking market, with Oura, Apple, and software-only solutions like Natural Cycles remaining as the primary consumer options.`,
    agentRecommendation: "STRATEGIC INTELLIGENCE. Competitor exit = market opportunity. Key takeaway for us: software-first approach is right (we integrate with existing wearables, don't build hardware). Use for fundraising: 'Our competitor burned $40M on hardware. We're software-first, integrating with the 100M+ wearables already on wrists.'",
    coverageAngle: "Don't celebrate a competitor's exit publicly. Internally, use for investor narrative: the hardware-first approach failed, validating our software-first strategy.",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "news-10",
    title: "PCOS Awareness Month Content Drives 3x Engagement Across Health Platforms",
    source: "Social Monitoring / Analytics",
    sourceUrl: "#",
    brief: "PCOS-related content is seeing 3x normal engagement across all social platforms as awareness month approaches. Opportunity to lead the conversation.",
    tag: "viral",
    isViral: true,
    viralReason: "Seasonal awareness month driving attention + personal stories resonate deeply + 'finally being seen' emotional hook for PCOS community.",
    summary: `• PCOS content engagement up 300% across Instagram, TikTok, X
• Top-performing content: personal stories, myth-busting, symptom validation
• Hashtag #PCOSAwareness at 2.1M posts this month
• Gap: most content is personal stories, very little science-based educational content
• Opportunity: Conceivable can fill the science gap with credible, empathetic content`,
    fullArticle: `Social media analytics show a dramatic spike in engagement for PCOS-related content across all major platforms, with engagement rates averaging 3x above normal levels as PCOS Awareness Month approaches.\n\nThe trending content falls into several categories: personal journey stories (highest engagement), myth-busting posts (highest share rate), symptom validation content ("you're not imagining it"), and dietary advice (highest comment volume, but also highest misinformation risk).\n\nNotably, there is a significant gap in science-based educational content. Most viral PCOS content comes from patients sharing personal experiences, with relatively few credentialed experts contributing to the conversation.\n\nThis represents an opportunity for evidence-based voices to lead the conversation with content that validates the emotional experience while providing accurate, actionable health information.`,
    agentRecommendation: "10x TIMING OPPORTUNITY. PCOS is one of the conditions our system tracks. Create a 10-piece PCOS content series: myth-busting, the 7 drivers as they relate to PCOS, how temperature patterns differ with PCOS, what the research actually shows about dietary interventions. Time-sensitive — start publishing within days to ride the wave.",
    coverageAngle: "Lead with validation: 'PCOS affects 1 in 10 women and is still misunderstood by most healthcare providers. Here's what the science actually shows.' Series approach, not a single post.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// NEW RESEARCH
// ============================================================

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: "research-01",
    title: "Continuous glucose monitoring reveals glycemic variability as independent predictor of ovulatory function",
    journal: "Journal of Clinical Endocrinology & Metabolism",
    authors: "Park J, Williams A, Chen S, et al.",
    doi: "10.1210/clinem/dgae-2026-0142",
    brief: "First study to show that day-to-day blood sugar variability — independent of average glucose levels — predicts ovulatory dysfunction. Directly relevant to Conceivable's metabolic health driver.",
    relevanceScore: 95,
    fillsGap: true,
    gapDescription: "Fills gap in our Nutrition & Metabolic Health driver — we can now cite glycemic variability (not just fasting glucose) as a fertility factor.",
    summary: {
      design: "Prospective cohort study with continuous glucose monitors (CGMs) worn for 3 complete menstrual cycles",
      keyFindings: "Women in the highest quartile of glycemic variability (measured by coefficient of variation) were 2.3x more likely to have anovulatory cycles, independent of BMI, fasting glucose, and HbA1c. The association was strongest in the luteal phase.",
      sampleSize: "418 women aged 25-38, all with regular cycles at enrollment",
      limitations: "Single-center study. CGM accuracy varies between devices. Did not control for dietary composition, only glycemic response.",
      conceivableRelevance: "Direct validation of our metabolic health driver. Suggests we should track glycemic variability patterns, not just average levels. Could enhance our recommendation engine for nutrition interventions.",
    },
    fullAbstract: `Background: Glycemic variability has been associated with metabolic dysfunction, but its relationship to ovulatory function has not been directly studied using continuous glucose monitoring.\n\nMethods: We enrolled 418 women aged 25-38 with self-reported regular menstrual cycles in a prospective cohort study. Participants wore Dexcom G7 continuous glucose monitors for three complete menstrual cycles while simultaneously tracking ovulation via urinary LH testing and serum progesterone confirmation.\n\nResults: Women in the highest quartile of glycemic variability (CV > 22%) were 2.3 times more likely to experience anovulatory cycles compared to those in the lowest quartile (CV < 14%), after adjusting for BMI, fasting glucose, HbA1c, age, and physical activity level (OR 2.31, 95% CI 1.47-3.63, p < 0.001). The association was most pronounced during the luteal phase.\n\nConclusions: Glycemic variability is an independent predictor of ovulatory dysfunction and may represent a modifiable risk factor for subfertility.`,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "research-02",
    title: "Heart rate variability during sleep predicts next-day progesterone levels in the luteal phase",
    journal: "Human Reproduction",
    authors: "Nakamura K, Fischer R, Lombardi G, et al.",
    doi: "10.1093/humrep/deae-2026-0089",
    brief: "Nighttime HRV measured by consumer wearables can predict next-day serum progesterone with 78% accuracy. Validates our non-invasive monitoring approach.",
    relevanceScore: 92,
    fillsGap: false,
    summary: {
      design: "Prospective observational study with paired wearable HRV data and daily serum progesterone measurements",
      keyFindings: "Nighttime RMSSD (a time-domain HRV metric) during sleep showed strong positive correlation with next-morning serum progesterone in the luteal phase (r=0.74, p<0.001). A machine learning model using HRV features predicted progesterone adequacy (>10 ng/mL) with 78% accuracy.",
      sampleSize: "156 women, 312 luteal phases monitored",
      limitations: "Used Oura Ring only — results may vary with other wearables. Small sample for ML model training.",
      conceivableRelevance: "Directly validates our approach of using wearable HRV to infer hormonal status non-invasively. Could strengthen our progesterone sufficiency prediction without requiring blood draws.",
    },
    fullAbstract: `Objective: To evaluate whether heart rate variability (HRV) metrics captured by consumer wearable devices during sleep can predict serum progesterone levels in the luteal phase of the menstrual cycle.\n\nDesign: Prospective observational study conducted over 312 luteal phases in 156 women aged 22-40.\n\nMethods: Participants wore Oura Ring Gen 3 devices continuously while providing daily morning serum progesterone samples during the luteal phase. HRV metrics including RMSSD, SDNN, and pNN50 were extracted from overnight sleep periods.\n\nResults: Nighttime RMSSD showed the strongest correlation with next-morning serum progesterone (r=0.74, p<0.001). A random forest model using five HRV features predicted luteal phase progesterone adequacy (defined as >10 ng/mL) with 78% accuracy (AUC 0.83).`,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "research-03",
    title: "Personalized exercise prescriptions based on cycle phase improve fertility outcomes: A randomized controlled trial",
    journal: "British Journal of Sports Medicine",
    authors: "O'Brien M, Kovacs P, Tanaka H, et al.",
    doi: "10.1136/bjsports-2026-108442",
    brief: "First RCT showing that adjusting exercise type and intensity by menstrual cycle phase improves fertility markers compared to standard exercise recommendations.",
    relevanceScore: 88,
    fillsGap: true,
    gapDescription: "Validates our Movement & Circulation driver — exercise timing relative to cycle phase matters, not just total activity.",
    summary: {
      design: "Randomized controlled trial, 6-month intervention period",
      keyFindings: "Women receiving cycle-phase-adjusted exercise prescriptions showed significant improvements in ovulatory function (28% improvement) and endometrial thickness (12% increase) compared to control group following standard ACOG exercise guidelines.",
      sampleSize: "264 women, randomized 1:1, ages 28-39 with unexplained subfertility",
      limitations: "Adherence self-reported. Unable to blind participants to intervention. Single-center.",
      conceivableRelevance: "Strong validation for our movement/circulation driver recommendations. We should incorporate cycle-phase-specific exercise recommendations into our protocol engine.",
    },
    fullAbstract: `Objectives: To determine whether menstrual cycle phase-adjusted exercise prescriptions improve fertility outcomes compared to standard exercise recommendations in women with unexplained subfertility.\n\nDesign: Single-center, parallel-group randomized controlled trial.\n\nParticipants: 264 women aged 28-39 with unexplained subfertility (>12 months attempting conception) were randomized 1:1.\n\nInterventions: The intervention group received personalized exercise prescriptions that varied by cycle phase (high-intensity during follicular, moderate-intensity during ovulatory, and restorative/low-intensity during luteal). The control group followed standard ACOG physical activity guidelines.\n\nResults: After 6 months, the intervention group showed significantly improved ovulatory function as measured by serum progesterone (28% improvement, p<0.01) and endometrial thickness at mid-luteal phase (12% increase, p<0.05).`,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// REDDIT OPPORTUNITIES
// ============================================================

export const REDDIT_POSTS: RedditPost[] = [
  {
    id: "reddit-01",
    subreddit: "r/TryingForABaby",
    title: "Anyone else feel like their doctor doesn't take BBT charts seriously?",
    body: "I've been tracking BBT for 8 months and my doctor literally said 'those aren't reliable.' Meanwhile I can clearly see my luteal phase is only 9 days. Feeling so frustrated and dismissed.",
    upvotes: 847,
    comments: 234,
    url: "https://reddit.com/r/TryingForABaby",
    engagementPotential: 9,
    relevanceScore: 95,
    riskLevel: "low",
    draftResponse: `Your frustration is completely valid, and your observation about your luteal phase is actually really important.\n\nA 9-day luteal phase is clinically significant — most reproductive endocrinologists consider anything under 10 days worth investigating, as it can indicate insufficient progesterone production to support implantation.\n\nBBT tracking IS reliable when done consistently — this is well-established in reproductive endocrinology research. The challenge is that many providers aren't trained to interpret the patterns beyond basic ovulation confirmation.\n\nSome things you might consider:\n• Ask specifically about mid-luteal progesterone testing (day 21 bloodwork, or 7 days post-ovulation)\n• A short luteal phase can sometimes be supported with simple interventions\n• If your current provider isn't responsive to your data, a reproductive endocrinologist might be a better fit\n\nYou're doing the right thing by tracking. That data is valuable.`,
    status: "pending",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reddit-02",
    subreddit: "r/PCOS",
    title: "Just diagnosed with PCOS at 31 — overwhelmed by conflicting advice. Where do I even start?",
    body: "Doctor said lose weight and take metformin. Internet says keto. TikTok says seed cycling. My naturopath says supplements. I just want someone to tell me what actually works based on real evidence. I'm so tired of guessing.",
    upvotes: 1203,
    comments: 456,
    url: "https://reddit.com/r/PCOS",
    engagementPotential: 10,
    relevanceScore: 98,
    riskLevel: "low",
    draftResponse: `First — your frustration with conflicting advice is probably the most common experience for women newly diagnosed with PCOS. You're not doing anything wrong by feeling overwhelmed.\n\nHere's what the evidence actually supports, simplified:\n\n1. **Insulin resistance is the driver for ~70% of PCOS cases.** If that's your type, addressing blood sugar stability is the highest-leverage intervention. This doesn't necessarily mean keto — it means consistent meals, adequate protein, managing glycemic variability.\n\n2. **Weight loss helps, but it's not the whole story.** Even modest changes (5-7%) can improve ovulatory function, but plenty of lean women have PCOS. The focus should be on metabolic health markers, not just BMI.\n\n3. **Metformin has solid evidence** for PCOS-related insulin resistance. It's not a magic bullet, but it's well-studied.\n\n4. **Seed cycling has minimal clinical evidence.** The interest is understandable, but don't rely on it as a primary intervention.\n\n5. **The most important thing:** Figure out YOUR specific PCOS type. Not all PCOS is the same — adrenal, insulin-resistant, inflammatory, and post-pill PCOS all have different optimal approaches.\n\nStart with: fasting insulin (not just glucose), full hormone panel, and ask your doctor about your specific phenotype.`,
    status: "pending",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reddit-03",
    subreddit: "r/infertility",
    title: "Is there any science behind 'preparing your body' before IVF or is it just wellness BS?",
    body: "Starting IVF in 3 months. Everyone's telling me to do acupuncture, take CoQ10, do yoga, etc. My RE says just take prenatals. Is there actual evidence for any of this prep work or am I just burning money?",
    upvotes: 623,
    comments: 189,
    url: "https://reddit.com/r/infertility",
    engagementPotential: 8,
    relevanceScore: 90,
    riskLevel: "medium",
    draftResponse: `Great question, and the answer is nuanced — some prep interventions have real evidence, and some are genuinely wellness BS.\n\n**Evidence-supported:**\n• **CoQ10 (ubiquinol form, 400-600mg/day):** Multiple studies show improved egg quality markers, especially for women 35+. The Fertility and Sterility data is solid here.\n• **Vitamin D optimization:** If deficient (many women are), correcting to 40-60 ng/mL is associated with improved IVF outcomes.\n• **DHEA (for diminished ovarian reserve specifically):** Some evidence, but only under RE supervision.\n• **Stress reduction (however you achieve it):** A recent Harvard study showed cortisol patterns predict IVF outcomes with 71% accuracy. Whether that's yoga, therapy, or meditation — lowering your physiological stress load appears to matter.\n\n**Less evidence:**\n• Acupuncture: Mixed results in meta-analyses. May help with stress reduction, but specific fertility claims are weak.\n• Seed cycling: Minimal clinical evidence.\n\n**Your RE is right that prenatals are the baseline.** But there's a meaningful gap between 'just prenatals' and 'wellness BS' where evidence-based preparation lives.\n\nThe key is targeting interventions to YOUR specific situation, not following a generic protocol.`,
    status: "pending",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reddit-04",
    subreddit: "r/endometriosis",
    title: "My pain is dismissed every single time. 8 years to get diagnosed. Anyone else?",
    body: "Finally got my endo diagnosis after 8 YEARS of being told it was 'normal period pain.' I'm angry and relieved at the same time. The average diagnosis time is 7-10 years and that's insane. Why doesn't anyone take women's pain seriously?",
    upvotes: 2891,
    comments: 672,
    url: "https://reddit.com/r/endometriosis",
    engagementPotential: 10,
    relevanceScore: 85,
    riskLevel: "medium",
    draftResponse: `Your experience, unfortunately, is the norm — and that's exactly the problem.\n\nThe 7-10 year average diagnosis time for endometriosis is one of the most significant failures in modern healthcare. It's not because the condition is rare (it affects ~10% of reproductive-age women). It's because:\n\n1. **Pain normalization:** Women are culturally conditioned to believe severe period pain is "normal."\n2. **Training gaps:** The average OB-GYN residency includes limited endometriosis-specific training.\n3. **Diagnostic limitations:** Definitive diagnosis often requires laparoscopy, which providers are hesitant to recommend.\n4. **The "it's just cramps" dismissal** that so many women experience.\n\nYour anger is valid. And your story matters — both for your own healing and because sharing experiences like yours is literally how diagnostic timelines improve.\n\nFor anyone reading this who suspects endo: document your symptoms meticulously. Track pain patterns relative to your cycle. Bring data to your appointments. And if your provider dismisses you, you have every right to seek one who doesn't.`,
    status: "pending",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "reddit-05",
    subreddit: "r/womenshealth",
    title: "What health metrics should I actually be tracking? Overwhelmed by all the wearable data.",
    body: "I have an Apple Watch and Oura Ring. I'm drowning in data — HRV, sleep stages, temperature, SpO2, steps, calories. What actually matters for my health? What should I focus on?",
    upvotes: 534,
    comments: 167,
    url: "https://reddit.com/r/womenshealth",
    engagementPotential: 8,
    relevanceScore: 92,
    riskLevel: "low",
    draftResponse: `You're asking exactly the right question — and the answer depends on what health outcomes you care about most. Here's a simplified framework:\n\n**The signals that matter most (in order):**\n\n1. **Sleep quality (not just duration):** Deep sleep and REM percentages matter more than total hours. This is the foundation — nearly everything else improves when sleep improves.\n\n2. **HRV trends (not daily numbers):** Don't obsess over day-to-day HRV. Look at the 7-day and 30-day trend. A rising trend = your body is recovering well. A declining trend = something is stressing your system.\n\n3. **Resting heart rate trends:** Same principle — the trend matters more than any single day.\n\n4. **Temperature patterns:** If you're tracking your cycle, overnight temperature data from Oura is incredibly informative. It can reveal ovulatory patterns, luteal phase quality, and thyroid signals.\n\n5. **Steps/movement:** 7,000-8,000 steps/day is the evidence-based sweet spot for health outcomes. Beyond that, diminishing returns.\n\n**What to ignore:** Daily calorie burn estimates (wildly inaccurate), single-day SpO2 readings (unless consistently abnormal), gamified 'scores' without context.\n\nThe key insight: these metrics are connected. Your HRV affects your sleep, which affects your temperature patterns, which reflects your hormonal health. The magic is in the connections, not the individual numbers.`,
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// CONTENT CALENDAR (sample data)
// ============================================================

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  { id: "cal-01", date: new Date().toISOString(), platform: "linkedin", title: "WHO Report: 1 in 6 — What It Means for Fertility Tech", excerpt: "The WHO just confirmed what we've been building for...", status: "draft", sourceType: "news", isMultiplier: true, multiplierNote: "Fundraising: TAM validation for investor narrative" },
  { id: "cal-02", date: new Date().toISOString(), platform: "instagram", title: "Seed Cycling: What the Science Actually Says", excerpt: "You've seen the TikTok. Here's what the research shows...", status: "draft", sourceType: "news", isMultiplier: false },
  { id: "cal-03", date: new Date().toISOString(), platform: "x", title: "Harvard just proved stress impacts IVF outcomes", excerpt: "New study: cortisol patterns predict IVF success with 71% accuracy...", status: "draft", sourceType: "research", isMultiplier: true, multiplierNote: "Product: validates stress driver algorithm" },
  { id: "cal-04", date: new Date().toISOString(), platform: "facebook", title: "PCOS Awareness: The 4 Types Nobody Talks About", excerpt: "Not all PCOS is the same. Here's why that matters...", status: "draft", sourceType: "news", isMultiplier: false },
  { id: "cal-05", date: new Date().toISOString(), platform: "pinterest", title: "7 Signals Your Body Sends About Fertility", excerpt: "Infographic: the 7 drivers of fertility health...", status: "draft", sourceType: "original", isMultiplier: false },
];
