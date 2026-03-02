import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Helper: convert any value to Prisma-compatible InputJsonValue
function toJson(val: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(val));
}

async function main() {
  console.log("Seeding database...\n");

  // ================================================================
  // TIER 1: Dedicated models with CRUD
  // ================================================================

  // --- Emails (23 records) ---
  console.log("Seeding Emails...");
  const { LAUNCH_EMAILS } = await import("../src/lib/data/launch-emails");
  for (const e of LAUNCH_EMAILS) {
    await prisma.email.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        week: e.week,
        sequence: e.sequence,
        phase: e.phase,
        subject: e.subject,
        preview: e.preview,
        body: e.body,
        status: e.status,
        segment: e.segment,
        complianceStatus: e.complianceStatus,
        approvedAt: e.approvedAt,
        publishedAt: e.publishedAt,
        metrics: e.metrics ? toJson(e.metrics) : undefined,
      },
    });
  }
  console.log(`  -> ${LAUNCH_EMAILS.length} emails`);

  // --- Patents (5 records) ---
  console.log("Seeding Patents...");
  const { PATENTS } = await import("../src/lib/data/legal-data");
  for (const p of PATENTS) {
    await prisma.patent.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        shortTitle: p.shortTitle,
        patentNumber: p.patentNumber ?? null,
        type: p.type,
        status: p.status,
        filingDate: p.filingDate ?? null,
        grantDate: p.grantDate ?? null,
        expirationDate: p.expirationDate ?? null,
        description: p.description,
        keyClaims: toJson(p.keyClaims),
        assignedAttorney: p.assignedAttorney ?? null,
        priorArtNotes: p.priorArtNotes ?? null,
        competitiveThreatLevel: p.competitiveThreatLevel,
        filingPriority: p.filingPriority ?? null,
        filingDeadline: p.filingDeadline ?? null,
        deadlineReason: p.deadlineReason ?? null,
        crossDeptConnections: toJson(p.crossDeptConnections),
      },
    });
  }
  console.log(`  -> ${PATENTS.length} patents`);

  // --- ComplianceClaims (10 records) ---
  console.log("Seeding ComplianceClaims...");
  const { COMPLIANCE_CLAIMS } = await import("../src/lib/data/legal-data");
  for (const c of COMPLIANCE_CLAIMS) {
    await prisma.complianceClaim.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        claim: c.claim,
        category: c.category,
        status: c.status,
        citation: c.citation ?? null,
        studyDetails: c.studyDetails ?? null,
        disclaimer: c.disclaimer ?? null,
        restrictionReason: c.restrictionReason ?? null,
        lastReviewed: c.lastReviewed,
      },
    });
  }
  console.log(`  -> ${COMPLIANCE_CLAIMS.length} compliance claims`);

  // --- PendingReviews (5 records) ---
  console.log("Seeding PendingReviews...");
  const { PENDING_REVIEWS } = await import("../src/lib/data/legal-data");
  for (const r of PENDING_REVIEWS) {
    await prisma.pendingReview.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        source: r.source,
        title: r.title,
        flagReason: r.flagReason,
        flagType: r.flagType,
        severity: r.severity,
        content: r.content,
        submittedAt: r.submittedAt,
        status: r.status,
        reviewerNotes: r.reviewerNotes ?? null,
      },
    });
  }
  console.log(`  -> ${PENDING_REVIEWS.length} pending reviews`);

  // --- Investors (14 records from 3 arrays) ---
  console.log("Seeding Investors...");
  const {
    MOVEMENT_BOARD_INVESTORS,
    VENTURE_INVESTORS,
    STRATEGIC_PARTNERS,
  } = await import("../src/lib/data/fundraising-data");

  const allInvestors = [
    ...MOVEMENT_BOARD_INVESTORS,
    ...VENTURE_INVESTORS,
    ...STRATEGIC_PARTNERS,
  ];

  for (const inv of allInvestors) {
    // Build tier-specific extras
    const extras: Record<string, unknown> = {};
    if (inv.recentActivity) extras.recentActivity = inv.recentActivity;
    if (inv.foundationPriorities) extras.foundationPriorities = inv.foundationPriorities;
    if (inv.warmConnectionPath) extras.warmConnectionPath = inv.warmConnectionPath;
    if (inv.eventsAttended) extras.eventsAttended = inv.eventsAttended;
    if (inv.publicStatements) extras.publicStatements = inv.publicStatements;
    if (inv.portfolio) extras.portfolio = inv.portfolio;
    if (inv.partnerName) extras.partnerName = inv.partnerName;
    if (inv.partnershipType) extras.partnershipType = inv.partnershipType;
    if (inv.strategicValue) extras.strategicValue = inv.strategicValue;

    await prisma.investor.upsert({
      where: { id: inv.id },
      update: {},
      create: {
        id: inv.id,
        name: inv.name,
        firm: inv.firm ?? null,
        tier: inv.tier,
        type: inv.type,
        status: inv.stage, // data uses "stage", model uses "status"
        checkSize: inv.checkSize ?? null,
        thesisAlignment: inv.thesisAlignment ?? null,
        notes: inv.notes ?? null,
        lastContact: inv.lastContactDate ? new Date(inv.lastContactDate) : null,
        nextAction: inv.nextAction ?? null,
        nextActionDate: inv.nextActionDate ? new Date(inv.nextActionDate) : null,
        extras: Object.keys(extras).length > 0 ? toJson(extras) : undefined,
      },
    });
  }
  console.log(`  -> ${allInvestors.length} investors`);

  // --- POVs (8 seed records) ---
  console.log("Seeding POVs...");
  const { SEED_POVS } = await import("../src/lib/data/pov-data");
  for (const pov of SEED_POVS) {
    await prisma.pOV.upsert({
      where: { id: pov.id },
      update: {},
      create: {
        id: pov.id,
        topic: pov.topic,
        transcript: pov.transcript,
        sourceType: pov.sourceType,
        sourceId: pov.sourceId ?? null,
        durationSeconds: pov.durationSeconds ?? null,
        keyPositions: toJson(pov.keyPositions),
        analogies: toJson(pov.analogies),
        emotionalTone: pov.emotionalTone || null,
        relatedTopics: toJson(pov.relatedTopics),
        createdAt: new Date(pov.createdAt),
      },
    });
  }
  console.log(`  -> ${SEED_POVS.length} POVs`);

  // --- NewsItems (10 records) ---
  console.log("Seeding NewsItems...");
  const { NEWS_ITEMS } = await import("../src/lib/data/content-engine");
  for (const n of NEWS_ITEMS) {
    await prisma.newsItem.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        title: n.title,
        source: n.source,
        sourceUrl: n.sourceUrl ?? null,
        brief: n.brief,
        tag: n.tag,
        isViral: n.isViral,
        viralReason: n.viralReason ?? null,
        summary: n.summary,
        fullArticle: n.fullArticle,
        agentRecommendation: n.agentRecommendation,
        coverageAngle: n.coverageAngle,
        timestamp: n.timestamp,
        povRecording: n.povRecording ?? null,
        povTranscript: n.povTranscript ?? null,
        generatedContent: n.generatedContent ? toJson(n.generatedContent) : undefined,
      },
    });
  }
  console.log(`  -> ${NEWS_ITEMS.length} news items`);

  // --- ResearchArticles (3 records) ---
  console.log("Seeding ResearchArticles...");
  const { RESEARCH_ITEMS } = await import("../src/lib/data/content-engine");
  for (const r of RESEARCH_ITEMS) {
    await prisma.researchArticle.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        title: r.title,
        journal: r.journal,
        authors: r.authors,
        doi: r.doi ?? null,
        brief: r.brief,
        relevanceScore: r.relevanceScore,
        fillsGap: r.fillsGap,
        gapDescription: r.gapDescription ?? null,
        summary: toJson(r.summary),
        fullAbstract: r.fullAbstract,
        timestamp: r.timestamp,
        povRecording: r.povRecording ?? null,
        povTranscript: r.povTranscript ?? null,
        generatedContent: r.generatedContent ? toJson(r.generatedContent) : undefined,
      },
    });
  }
  console.log(`  -> ${RESEARCH_ITEMS.length} research articles`);

  // --- RedditPosts (5 records) ---
  console.log("Seeding RedditPosts...");
  const { REDDIT_POSTS } = await import("../src/lib/data/content-engine");
  for (const r of REDDIT_POSTS) {
    await prisma.redditPost.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        subreddit: r.subreddit,
        title: r.title,
        body: r.body,
        upvotes: r.upvotes,
        comments: r.comments,
        url: r.url ?? null,
        engagementPotential: String(r.engagementPotential),
        relevanceScore: typeof r.relevanceScore === "number" ? r.relevanceScore : parseFloat(String(r.relevanceScore)),
        riskLevel: r.riskLevel,
        draftResponse: r.draftResponse,
        status: r.status,
        timestamp: r.timestamp,
      },
    });
  }
  console.log(`  -> ${REDDIT_POSTS.length} reddit posts`);

  // --- CalendarEntries (5 records) ---
  console.log("Seeding CalendarEntries...");
  const { CALENDAR_ENTRIES } = await import("../src/lib/data/content-engine");
  for (const c of CALENDAR_ENTRIES) {
    await prisma.calendarEntry.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        date: c.date,
        platform: c.platform,
        title: c.title,
        excerpt: c.excerpt,
        status: c.status,
        sourceType: c.sourceType,
        engagement: c.engagement ? toJson(c.engagement) : undefined,
        isMultiplier: c.isMultiplier,
        multiplierNote: c.multiplierNote ?? null,
      },
    });
  }
  console.log(`  -> ${CALENDAR_ENTRIES.length} calendar entries`);

  // ================================================================
  // TIER 2: DepartmentData (JSON blobs)
  // ================================================================

  console.log("\nSeeding DepartmentData (Tier 2)...");

  // Helper to upsert a department data row
  async function upsertDeptData(department: string, key: string, value: unknown) {
    const jsonValue = toJson(value);
    await prisma.departmentData.upsert({
      where: { department_key: { department, key } },
      update: { value: jsonValue },
      create: { department, key, value: jsonValue },
    });
  }

  // --- Clinical (9 keys) ---
  console.log("  Clinical...");
  const clinical = await import("../src/lib/data/clinical-data");
  const clinicalData: Record<string, unknown> = {
    factors: clinical.FACTORS,
    causalChains: clinical.CAUSAL_CHAINS,
    cohortOutcomes: clinical.COHORT_OUTCOMES,
    agentPerformance: clinical.AGENT_PERFORMANCE,
    interventionCascades: clinical.INTERVENTION_CASCADES,
    studyOpportunities: clinical.STUDY_OPPORTUNITIES,
    regulatoryEvidence: clinical.REGULATORY_EVIDENCE,
    researchFeed: clinical.RESEARCH_FEED,
    dropOffData: clinical.DROP_OFF_DATA,
  };
  for (const [key, value] of Object.entries(clinicalData)) {
    await upsertDeptData("clinical", key, value);
  }
  console.log(`    -> ${Object.keys(clinicalData).length} keys`);

  // --- Community (22 keys) ---
  console.log("  Community...");
  const community = await import("../src/lib/data/community-data");
  const communityData: Record<string, unknown> = {
    postingCalendar: community.POSTING_CALENDAR,
    discussionPrompts: community.DISCUSSION_PROMPTS,
    memberSpotlights: community.MEMBER_SPOTLIGHTS,
    responseQueue: community.RESPONSE_QUEUE,
    contentSourceMetrics: community.CONTENT_SOURCE_METRICS,
    memberMetrics: community.MEMBER_METRICS,
    engagementScores: community.ENGAGEMENT_SCORES,
    reengagementCampaigns: community.REENGAGEMENT_CAMPAIGNS,
    onboardingFunnel: community.ONBOARDING_FUNNEL,
    communityChallenges: community.COMMUNITY_CHALLENGES,
    conversionFunnel: community.CONVERSION_FUNNEL,
    weeklyRecommendation: community.WEEKLY_RECOMMENDATION,
    affiliates: community.AFFILIATES,
    affiliateMetrics: community.AFFILIATE_METRICS,
    leaderboard: community.LEADERBOARD,
    affiliateOutreach: community.AFFILIATE_OUTREACH,
    experts: community.EXPERTS,
    outreachDrafts: community.OUTREACH_DRAFTS,
    interviewSchedules: community.INTERVIEW_SCHEDULES,
    prepPackets: community.PREP_PACKETS,
    postInterviewTasks: community.POST_INTERVIEW_TASKS,
    crossDeptConnections: community.CROSS_DEPT_CONNECTIONS,
  };
  for (const [key, value] of Object.entries(communityData)) {
    await upsertDeptData("community", key, value);
  }
  console.log(`    -> ${Object.keys(communityData).length} keys`);

  // --- Strategy (5 keys) ---
  console.log("  Strategy...");
  const strategy = await import("../src/lib/data/strategy-data");
  const strategyData: Record<string, unknown> = {
    currentBrief: strategy.CURRENT_BRIEF,
    briefArchive: strategy.BRIEF_ARCHIVE,
    decisions: strategy.DECISIONS,
    ideas: strategy.IDEAS,
    connections: strategy.STRATEGY_CONNECTIONS,
  };
  for (const [key, value] of Object.entries(strategyData)) {
    await upsertDeptData("strategy", key, value);
  }
  console.log(`    -> ${Object.keys(strategyData).length} keys`);

  // --- Product (7 keys) ---
  console.log("  Product...");
  const product = await import("../src/lib/data/product-data");
  const productData: Record<string, unknown> = {
    verticals: product.VERTICALS,
    research: product.RESEARCH_ITEMS,
    features: product.FEATURES,
    competitors: product.COMPETITORS,
    insights: product.USER_INSIGHTS,
    readiness: product.READINESS_CHECKLIST,
    connections: product.CROSS_VERTICAL_CONNECTIONS,
  };
  for (const [key, value] of Object.entries(productData)) {
    await upsertDeptData("product", key, value);
  }
  console.log(`    -> ${Object.keys(productData).length} keys`);

  // --- Finance (4 keys) ---
  console.log("  Finance...");
  const finance = await import("../src/lib/data/finance-data");
  const financeData: Record<string, unknown> = {
    cashPosition: finance.MOCK_CASH_POSITION,
    burnMetrics: finance.MOCK_BURN_METRICS,
    plData: finance.MOCK_PL_DATA,
    financialSummary: finance.MOCK_FINANCIAL_SUMMARY,
  };
  for (const [key, value] of Object.entries(financeData)) {
    await upsertDeptData("finance", key, value);
  }
  console.log(`    -> ${Object.keys(financeData).length} keys`);

  // --- Fundraising supplementary (6 keys) ---
  console.log("  Fundraising (supplementary)...");
  const fundraising = await import("../src/lib/data/fundraising-data");
  const fundraisingData: Record<string, unknown> = {
    pitchMaterials: fundraising.PITCH_MATERIALS,
    meetingNotes: fundraising.MEETING_NOTES,
    metrics: fundraising.FUNDRAISE_METRICS,
    weeklyRecommendation: fundraising.WEEKLY_RECOMMENDATION,
    narrative: fundraising.FUNDRAISE_NARRATIVE,
    storyAngles: fundraising.STORY_ANGLES,
  };
  for (const [key, value] of Object.entries(fundraisingData)) {
    await upsertDeptData("fundraising", key, value);
  }
  console.log(`    -> ${Object.keys(fundraisingData).length} keys`);

  // --- Legal supplementary (6 keys) ---
  console.log("  Legal (supplementary)...");
  const legal = await import("../src/lib/data/legal-data");
  const legalData: Record<string, unknown> = {
    competitorFilings: legal.COMPETITOR_FILINGS,
    regulatory: legal.REGULATORY_ITEMS,
    testimonialFlags: legal.TESTIMONIAL_FLAGS,
    hipaaChecklist: legal.HIPAA_CHECKLIST,
    vendorReviews: legal.VENDOR_REVIEWS,
    privacyPolicies: legal.PRIVACY_POLICIES,
  };
  for (const [key, value] of Object.entries(legalData)) {
    await upsertDeptData("legal", key, value);
  }
  console.log(`    -> ${Object.keys(legalData).length} keys`);

  console.log("\nSeeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
