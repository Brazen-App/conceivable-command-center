"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ArrowRight,
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Heart,
  Brain,
  Sparkles,
  Globe,
  Users,
  Target,
} from "lucide-react";
import JoyButton from "@/components/joy/JoyButton";
import RejectionModal from "@/components/review/RejectionModal";
import DiscussPanel from "@/components/review/DiscussPanel";

const ACCENT = "#356FB6";

type AngelStage = "prospect" | "contacted" | "meeting" | "committed" | "closed" | "passed";

interface AngelInvestor {
  id: string;
  name: string;
  title: string;
  checkSize: string;
  stage: AngelStage;
  thesisAlignment: "strong" | "moderate";
  strategic: boolean;
  strategicValue: string;
  background: string;
  whyConceivable: string;
  portfolio: string;
  warmIntroPath: string;
  nextAction: string;
}

// ── ANGEL INVESTOR PIPELINE ─────────────────────────────────────────
// Curated for Conceivable's $500K Seed+ round
// Focus: $100K-$500K checks, strategic + financial value
// All real investors verified through public sources

const ANGEL_PIPELINE: AngelInvestor[] = [
  {
    id: "angel01",
    name: "Esther Dyson",
    title: "Angel Investor & Founder, Wellville",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Health systems thought leader. 195+ investments. Board connections to health tech ecosystem. Signal value is enormous — when Esther invests, other health investors pay attention.",
    background: "One of the most prolific angel investors in health tech. 195+ investments including 23andMe, Omada Health, Clover Health, Big Health, HealthTap. Founded Wellville (community health project). Former chair of ICANN. Deep expertise in preventive health and behavior change.",
    whyConceivable: "Esther's entire thesis is that health happens in daily life, not in hospitals. Conceivable's closed-loop system for fertility is exactly this — continuous, personalized health optimization outside the clinical setting. Her Wellville work on community health aligns with Conceivable's mission to democratize fertility care.",
    portfolio: "23andMe, Omada Health, Clover Health, Big Health, HealthTap, 4D Healthware, Devoted Health",
    warmIntroPath: "Digital health conference network. Esther speaks at nearly every major health innovation event. Also connected through the preventive health community. Podcast circuit overlap with Kirsten.",
    nextAction: "Draft personal note referencing Wellville thesis + Conceivable's approach to preventive fertility health",
  },
  {
    id: "angel02",
    name: "Cyan Banister",
    title: "Angel Investor (prev. Founders Fund)",
    checkSize: "$100K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Former Founders Fund partner. Personal fertility journey gives deep empathy for the problem. Her angel portfolio includes 200+ investments. Massive signal value and downstream investor connections.",
    background: "Prolific angel investor with 200+ investments, previously partner at Founders Fund. Known for early bets on Uber, SpaceX, Postmates. Has been vocal about her own fertility challenges and IVF journey. Active in supporting women founders in health tech.",
    whyConceivable: "Cyan has publicly shared her fertility journey and understands the emotional and financial toll firsthand. She invests in founders building from personal pain. Conceivable's evidence-based, technology-first approach to fertility will resonate deeply.",
    portfolio: "Uber, SpaceX, Postmates, Affirm, Niantic, and 200+ angel investments",
    warmIntroPath: "Through the angel/founder community. Cyan is very accessible on social media and responds to cold outreach from founders she respects. Personal fertility story creates immediate connection.",
    nextAction: "Direct outreach referencing her public fertility journey + how Conceivable addresses exactly the gaps she experienced",
  },
  {
    id: "angel03",
    name: "Sophia Bendz",
    title: "Partner, Cherry Ventures & Angel Investor",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Leading FemTech angel in Europe. Former Global Marketing Director at Spotify. Cherry Ventures partnership opens European market connections. Portfolio includes Daye, Grace Health — direct FemTech expertise.",
    background: "Partner at Cherry Ventures and one of Europe's most recognized FemTech investors. Former Global Marketing Director at Spotify. Has been angel investing since 2012 with a focus on women's health. Invested in Daye (period care), Grace Health (reproductive health), and multiple FemTech startups.",
    whyConceivable: "Sophia specifically seeks FemTech companies that combine clinical evidence with consumer experience. Conceivable's wearable integration, AI coaching, and evidence-based approach is exactly her investment thesis. She can also help with European expansion.",
    portfolio: "Daye, Grace Health, Natural Cycles (early), multiple FemTech companies",
    warmIntroPath: "FemTech Insider network. Sophia is active in the FemTech community and speaks at FemTech events globally. European health tech conferences.",
    nextAction: "Connect through FemTech Insider community or direct LinkedIn outreach with Conceivable's clinical data story",
  },
  {
    id: "angel04",
    name: "Deepali Nangia",
    title: "Partner, Speedinvest & Co-Founder, Alma Angels",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Co-founded Alma Angels (largest female-led angel network in Europe, €10M+ AUM). Speedinvest partnership gives access to their health tech portfolio. Champion of women-led health companies.",
    background: "Partner at Speedinvest and co-founder of Alma Angels, one of Europe's largest female-led angel networks with over €10M in assets under management. Over a decade of experience in private equity and investment banking. Focuses on femtech, healthtech, and climate tech investments.",
    whyConceivable: "Deepali specifically backs women-led health tech companies. Conceivable's combination of clinical expertise (Kirsten's 20 years), AI technology, and consumer-facing product is exactly the profile she invests in. Alma Angels network could bring additional angel investors.",
    portfolio: "Multiple FemTech and health tech companies through Alma Angels network",
    warmIntroPath: "Alma Angels network application. Also accessible through European health tech events and Speedinvest's health portfolio.",
    nextAction: "Apply through Alma Angels network and simultaneously connect via Speedinvest health portfolio",
  },
  {
    id: "angel05",
    name: "Dr. Rebecca Mitchell",
    title: "Co-Founder, Scrub Capital",
    checkSize: "$100K-$300K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Scrub Capital is a syndicate of 700+ clinicians who invest together. Getting them in means 700 potential clinical advisors and evangelists. They understand clinical evidence and can validate Conceivable's approach from inside the medical establishment.",
    background: "Co-founder of Scrub Capital alongside Christina Farr and Dr. Jonathan Slotkin. Scrub Capital is a unique angel syndicate of 700+ clinicians who co-invest in health tech. They focus on pre-seed and seed rounds in digital health companies where clinical insight matters.",
    whyConceivable: "Scrub Capital specifically invests where clinical expertise is the differentiator. Conceivable's foundation in 20 years of clinical data, 500K+ BBT charts, and evidence-based protocols is exactly what gets 700 doctors excited. Plus, those doctors become the distribution channel — referring patients to Conceivable.",
    portfolio: "Multiple digital health startups with clinical validation focus",
    warmIntroPath: "Christina Farr (co-founder) is a well-known health tech journalist and very connected in digital health. Apply through Scrub Capital's syndicate.",
    nextAction: "Submit through Scrub Capital application with emphasis on clinical data and evidence base",
  },
  {
    id: "angel06",
    name: "Halle Tecco",
    title: "Founder, Rock Health & Natalist",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Founded Rock Health (the leading digital health seed fund). Then founded Natalist (fertility/pregnancy products — acquired). She literally built AND exited in the fertility space. Her network is the digital health investor map. She maintains a public database of 200+ digital health investors.",
    background: "Founded Rock Health in 2010, which became the leading digital health accelerator and seed fund. Later founded Natalist, a fertility and pregnancy wellness brand that was acquired. Now active angel investor and advisor. Maintains the definitive list of digital health investors used by the entire industry.",
    whyConceivable: "Halle built a fertility company herself and knows every investor in digital health. She understands the space deeply — the clinical challenges, the consumer experience gaps, the regulatory landscape. She'll immediately see how Conceivable's multi-signal, closed-loop approach is differentiated from what she built at Natalist.",
    portfolio: "Rock Health portfolio (hundreds of digital health companies), Natalist (founded, acquired)",
    warmIntroPath: "Digital health community. Halle is very active and accessible. Her public digital health investor database is a resource — reaching out through that channel shows respect for her work.",
    nextAction: "Direct outreach referencing her Natalist experience and how Conceivable extends beyond the product approach to a closed-loop clinical system",
  },
  {
    id: "angel07",
    name: "Trish Costello",
    title: "CEO, Portfolia FemTech Fund",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Runs a dedicated FemTech investment fund. Access to a network of women investors who co-invest. Deep expertise in what works in FemTech go-to-market. Can help with subsequent rounds through fund connections.",
    background: "CEO and founder of Portfolia, which runs multiple thematic investment funds including a dedicated FemTech Fund. Portfolia allows individual investors to co-invest alongside the fund, creating a community of engaged investors. The FemTech Fund specifically targets reproductive health, fertility, and women's health innovation.",
    whyConceivable: "Portfolia's FemTech Fund is purpose-built for exactly this investment. They understand the clinical validation requirements, the regulatory landscape, and the consumer dynamics of women's health. Conceivable's combination of patented AI, clinical data, and consumer product fits perfectly.",
    portfolio: "Dedicated FemTech portfolio including reproductive health, fertility tech, menopause, and maternal health companies",
    warmIntroPath: "FemTech Insider network, FemTech conference circuit. Portfolia actively solicits deal flow through their platform.",
    nextAction: "Submit through Portfolia FemTech Fund application with clinical data package",
  },
  {
    id: "angel08",
    name: "Rhia Ventures / RH Capital",
    title: "Reproductive Health Impact Fund",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "THE dedicated reproductive health investment fund. If they're in, it's the ultimate signal to every other investor that this is a legitimate reproductive health innovation. Their network includes every major player in reproductive health policy and access.",
    background: "RH Capital is Rhia Ventures' investment fund focused exclusively on reproductive health innovation. They invest in early-stage companies driving innovation in reproductive and maternal health. Typical initial check sizes of $250K-$1M. They combine financial investment with deep reproductive health policy expertise.",
    whyConceivable: "RH Capital exists specifically to fund companies like Conceivable. Their entire thesis is that reproductive health innovation is underfunded and that technology can dramatically improve access and outcomes. Conceivable's evidence-based, AI-powered approach to fertility optimization is a textbook fit.",
    portfolio: "Reproductive health focused portfolio — fertility tech, maternal health, contraception innovation",
    warmIntroPath: "Reproductive health policy network. Rhia Ventures is very connected in the advocacy space. Apply directly through their investment portal.",
    nextAction: "Submit application with emphasis on democratizing fertility care access + clinical evidence base",
  },
  {
    id: "angel09",
    name: "Chloe Capital",
    title: "Women-Led Angel Syndicate",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: false,
    strategicValue: "45+ portfolio companies. Syndicate of women investors who understand the women's health market from the user perspective. Strong follow-on investment culture and portfolio support.",
    background: "Chloe Capital is an angel investment syndicate focused on women-led companies. 45+ portfolio companies across health tech, consumer products, and enterprise software. They bring a network of women investors who often co-invest, increasing total round participation.",
    whyConceivable: "Women-led fund investing in women's health — perfect alignment. Their investors ARE Conceivable's target users. They bring market validation alongside capital. The syndicate model means their investment often comes with 10-20 additional small checks from members.",
    portfolio: "45+ companies across health tech and consumer products",
    warmIntroPath: "Apply through Chloe Capital platform. Also connected through women founder networks and health tech accelerators.",
    nextAction: "Submit application highlighting Kirsten's expertise, clinical data, and market traction",
  },
  {
    id: "angel10",
    name: "Astia Angels",
    title: "Global Angel Network for Women-Led Ventures",
    checkSize: "$100K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: false,
    strategicValue: "One of the largest women-focused angel networks. Healthcare vertical expertise. Their due diligence process is rigorous — passing it is a strong signal. Network includes corporate venture partners who could lead future rounds.",
    background: "Astia is a global organization dedicated to leveling the playing field for women entrepreneurs. Astia Angels is their investment arm, providing funding and mentorship. They have a dedicated healthcare vertical with angels who have deep health industry expertise.",
    whyConceivable: "Astia's healthcare vertical angels bring industry expertise alongside capital. Their rigorous diligence process means the investment carries weight with downstream investors. Kirsten's profile — expert founder, clinical background, patented technology — is exactly what Astia showcases.",
    portfolio: "Healthcare and life sciences focused portfolio across multiple stages",
    warmIntroPath: "Apply through Astia Angels network. Also accessible through healthcare accelerators and women founder events.",
    nextAction: "Apply through Astia Angels healthcare vertical with full clinical data package",
  },
  {
    id: "angel11",
    name: "Amboy Street Ventures",
    title: "World's First Sexual & Reproductive Health VC",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "THE sexual and reproductive health fund. They understand the regulatory, clinical, and market dynamics of this exact space. Their portfolio companies are natural partnership targets for Conceivable.",
    background: "The world's first venture capital firm focused exclusively on sexual health and women's health technology. Invests in seed to Series A rounds in sexual wellness, reproductive health, and pelvic health. Deep expertise in navigating the unique challenges of health tech in sensitive categories.",
    whyConceivable: "Amboy Street literally exists to fund companies in reproductive health tech. They understand the unique challenges — platform policies, payment processing, clinical validation requirements, provider relationships — and can help Conceivable navigate all of them. Their portfolio creates a network of complementary companies.",
    portfolio: "Focused on sexual wellness, reproductive health, and pelvic health companies",
    warmIntroPath: "FemTech community, reproductive health conferences. They actively seek deal flow in this space.",
    nextAction: "Direct outreach with clinical differentiation pitch — closed-loop system vs. tracking-only competitors",
  },
  {
    id: "angel12",
    name: "FemHealth Ventures",
    title: "Dedicated Women's Health VC",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Invests only in conditions affecting mostly women or worse in women. Their thesis aligns perfectly. Network includes clinical advisory boards, health system partners, and regulatory experts in women's health.",
    background: "A dedicated women's health venture capital firm investing in seed to Series A rounds. Their thesis focuses specifically on conditions that affect only women, mostly women, or are worse in women. They look for companies that combine clinical evidence with technology innovation.",
    whyConceivable: "FemHealth's investment thesis is literally Conceivable's business model. They understand that fertility health has been underserved by technology, that clinical evidence matters, and that the market opportunity is massive (1 in 6 people affected by infertility globally).",
    portfolio: "Women's health focused — menopause, fertility, PCOS, endometriosis, maternal health",
    warmIntroPath: "Women's health conference circuit. Direct application through their website.",
    nextAction: "Submit pitch with emphasis on clinical evidence, patent portfolio, and the $50B fertility market opportunity",
  },
  {
    id: "angel13",
    name: "Homebrew (Satya Patel & Hunter Walk)",
    title: "Seed Fund — Digital Health Focus",
    checkSize: "$100K-$500K",
    stage: "prospect",
    thesisAlignment: "moderate",
    strategic: true,
    strategicValue: "Seed specialists with track record (Honor, Carbon Health, Tia, Headway, Color). Tia is in women's health — they understand the space. Hunter Walk has massive content/media network that helps with distribution.",
    background: "Homebrew is a seed-stage venture fund led by Satya Patel (former VP at Twitter) and Hunter Walk (former Director at YouTube). They write $100K-$500K checks in consumer and health tech. Portfolio includes Tia (women's health), Carbon Health, Honor, Headway, and Color.",
    whyConceivable: "Homebrew already invested in Tia (women's health platform), showing they believe in the space. Conceivable's approach is differentiated from Tia — clinical fertility optimization vs. primary care. Hunter's content/media background is valuable for Conceivable's content-led growth strategy.",
    portfolio: "Tia, Carbon Health, Honor, Headway, Color, and 100+ seed investments",
    warmIntroPath: "Through the digital health founder community. Hunter Walk is very active on social media and blogs. Also connected through Tia's network.",
    nextAction: "Cold outreach through Hunter's blog/social channels with compelling founder story + clinical data differentiation from Tia",
  },
  {
    id: "angel14",
    name: "Sharon Vosmek",
    title: "CEO, Astia & Angel Investor",
    checkSize: "$100K-$250K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Leads Astia's entire investment operation. Personal angel investments alongside the fund. Deep network in corporate venture and health systems. Can facilitate introductions to hospital system innovation arms.",
    background: "CEO of Astia, a global organization supporting women entrepreneurs. Makes personal angel investments alongside the Astia fund, particularly in health tech. Connected to corporate venture arms and health system innovation programs.",
    whyConceivable: "Sharon's personal investment thesis centers on women-led health companies with clinical foundations. Her Astia network includes hospital system innovation leads who could become Conceivable distribution partners.",
    portfolio: "Personal health tech angel portfolio plus Astia fund investments",
    warmIntroPath: "Through Astia Angels network or women founder events. Sharon speaks frequently at health innovation conferences.",
    nextAction: "Connect through Astia application process, flag for personal investment consideration",
  },
  {
    id: "angel15",
    name: "Avestria Ventures (Seema Hingorani)",
    title: "Women-Led Health Tech Fund",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: false,
    strategicValue: "Fund focused on women-led companies with health focus. Seema's Wall Street background brings financial discipline and institutional investor connections for future rounds.",
    background: "Founded by Seema Hingorani, a former Wall Street executive. Avestria invests in women-led companies with $500K-$2M check sizes. Health tech is a primary vertical. Seema brings institutional investor relationships from her financial services career.",
    whyConceivable: "Avestria's thesis aligns on both the founder profile (women-led) and the sector (health tech). Seema's institutional investor relationships are valuable for Series A bridge building.",
    portfolio: "Women-led health tech and consumer companies",
    warmIntroPath: "Apply through Avestria website. Also accessible through NYC health tech community and women founder networks.",
    nextAction: "Submit application with full financial projections and clinical data package",
  },
  {
    id: "angel16",
    name: "Catherine (Top Corner Capital)",
    title: "FemTech Specialist Angel",
    checkSize: "$100K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Specializes exclusively in early-stage FemTech. Deep understanding of the regulatory and go-to-market challenges specific to women's health products. Can help navigate platform policies and health claims compliance.",
    background: "Partner at Top Corner Capital specializing in early-stage technology investments with a dedicated FemTech focus. Check sizes of $100K-$5M. Deep expertise in the unique challenges of marketing and distributing women's health products.",
    whyConceivable: "Catherine's exclusive FemTech focus means she understands the market dynamics, the regulatory landscape, and the consumer psychology that Conceivable operates in. Her experience with platform policies (ad restrictions on fertility content) and health claims compliance is directly valuable.",
    portfolio: "FemTech focused portfolio across reproductive health, menstrual health, and wellness",
    warmIntroPath: "FemTech conferences and digital health events. Active in the FemTech Insider community.",
    nextAction: "Direct outreach with product demo and clinical differentiation pitch",
  },
  {
    id: "angel17",
    name: "Goddess Gaia Ventures",
    title: "Women's Health & FemTech Fund",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: true,
    strategicValue: "Priya at Oberoi Capital Partners champions underserved sectors in women's health. General Partner of GGV with focus on FemTech products. Network includes women's health clinical advisors.",
    background: "Founded by Sara Hinkley with Priya from Oberoi Capital Partners as General Partner. Focused on FemTech and women's wellness. Invests at seed stage in companies innovating in reproductive health, hormonal health, and women's wellness.",
    whyConceivable: "GGV's thesis is that women's health is systematically underfunded and undertechnologized. Conceivable's AI-powered, evidence-based approach with patented technology is exactly the type of innovation they want to back.",
    portfolio: "Women's health and wellness companies at seed stage",
    warmIntroPath: "Women's health conference circuit. FemTech Insider community.",
    nextAction: "Submit pitch through GGV application with emphasis on patent portfolio and clinical evidence",
  },
  {
    id: "angel18",
    name: "Coyote Ventures",
    title: "Women's Health & Wellness VC",
    checkSize: "$250K-$500K",
    stage: "prospect",
    thesisAlignment: "strong",
    strategic: false,
    strategicValue: "Early-stage focus on women's health and wellness. Portfolio network of complementary women's health companies. Experience scaling DTC health brands.",
    background: "Venture capital firm focused on early-stage companies in women's health and wellness. Invests in seed rounds with follow-on capacity. Experience with DTC health brands and wellness products.",
    whyConceivable: "Coyote understands the women's wellness consumer. Conceivable's supplement + app + wearable ecosystem is a multi-revenue model they'll appreciate. Their DTC experience is directly applicable.",
    portfolio: "Women's health and wellness portfolio",
    warmIntroPath: "Women's health community and DTC health brand networks.",
    nextAction: "Submit pitch emphasizing multi-revenue model (supplements + app + ring) and community-led growth",
  },
];

// ── Components ──────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: AngelStage }) {
  const config: Record<AngelStage, { bg: string; color: string; label: string }> = {
    prospect: { bg: "#9686B918", color: "#9686B9", label: "Prospect" },
    contacted: { bg: "#78C3BF18", color: "#78C3BF", label: "Contacted" },
    meeting: { bg: "#356FB618", color: "#356FB6", label: "Meeting" },
    committed: { bg: "#F1C02818", color: "#F1C028", label: "Committed" },
    closed: { bg: "#1EAA5518", color: "#1EAA55", label: "Closed" },
    passed: { bg: "#E24D4718", color: "#E24D47", label: "Passed" },
  };
  const c = config[stage];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function AlignmentIndicator({ level }: { level: "strong" | "moderate" }) {
  const config = {
    strong: { color: "#1EAA55", bars: 3 },
    moderate: { color: "#F1C028", bars: 2 },
  };
  const c = config[level];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-2 h-4 rounded-sm"
          style={{ backgroundColor: i <= c.bars ? c.color : "var(--border)" }}
        />
      ))}
      <span className="text-xs ml-1 capitalize" style={{ color: c.color }}>{level}</span>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function AngelInvestorsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<AngelStage | "all">("all");
  const [rejectionTarget, setRejectionTarget] = useState<{ id: string; title: string } | null>(null);
  const [discussTarget, setDiscussTarget] = useState<{ id: string; title: string; detail: string } | null>(null);
  const [passedInvestors, setPassedInvestors] = useState<Set<string>>(new Set());
  const [advancedInvestors, setAdvancedInvestors] = useState<Set<string>>(new Set());

  const handleAdvanceStage = (id: string) => {
    setAdvancedInvestors((prev) => new Set(prev).add(id));
  };

  const handleReject = async (reasonCategory: string, reasonText: string) => {
    if (!rejectionTarget) return;
    await fetch("/api/rejections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommendationId: rejectionTarget.id,
        recommendationType: "angel-investor",
        reasonCategory,
        reasonText,
      }),
    });
    setPassedInvestors((prev) => new Set(prev).add(rejectionTarget.id));
    setRejectionTarget(null);
  };

  const filtered = stageFilter === "all"
    ? ANGEL_PIPELINE
    : ANGEL_PIPELINE.filter((a) => a.stage === stageFilter);

  const strategicCount = ANGEL_PIPELINE.filter((a) => a.strategic).length;
  const strongAlignCount = ANGEL_PIPELINE.filter((a) => a.thesisAlignment === "strong").length;

  const stageCounts = ANGEL_PIPELINE.reduce((acc, a) => {
    acc[a.stage] = (acc[a.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={16} className="text-white/70" />
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              Angel Investors — $500K Seed+ Round
            </p>
          </div>
          <p className="text-3xl font-bold text-white">
            {ANGEL_PIPELINE.length} Angels & Syndicates
          </p>
          <p className="text-sm mt-1 text-white/60">
            Curated for $100K-$500K checks — strategic value + capital
          </p>

          {/* Key Stats */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-white/60" />
              <span className="text-white/80 text-xs">
                {strongAlignCount} strong thesis alignment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-white/60" />
              <span className="text-white/80 text-xs">
                {strategicCount} strategic (not just $)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-white/60" />
              <span className="text-white/80 text-xs">
                Target: $500K total from angels
              </span>
            </div>
          </div>

          {/* Mini funnel */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto">
            {(["prospect", "contacted", "meeting", "committed", "closed"] as AngelStage[]).map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    {stageCounts[stage] || 0}
                  </p>
                  <p className="text-[10px] capitalize text-white/50">
                    {stage}
                  </p>
                </div>
                {i < 4 && <ArrowRight size={12} className="text-white/30" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "prospect", "contacted", "meeting", "committed", "closed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStageFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={
              stageFilter === f
                ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && ` (${stageCounts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Investor Cards */}
      <div className="space-y-3">
        {filtered.map((angel) => {
          const isExpanded = expandedId === angel.id;
          const isPassed = passedInvestors.has(angel.id);
          const isAdvanced = advancedInvestors.has(angel.id);

          if (isPassed) return null;

          return (
            <div
              key={angel.id}
              className="rounded-xl border transition-all hover:shadow-md"
              style={{
                borderColor: isExpanded ? `${ACCENT}40` : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Collapsed Row */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : angel.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Name & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {angel.name}
                      </p>
                      {angel.strategic && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                        >
                          <Sparkles size={8} /> Strategic
                        </span>
                      )}
                      {isAdvanced && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}
                        >
                          Advanced
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {angel.title}
                    </p>
                  </div>

                  {/* Stage */}
                  <StageBadge stage={angel.stage} />

                  {/* Check Size */}
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold" style={{ color: ACCENT }}>
                      {angel.checkSize}
                    </p>
                  </div>

                  {/* Alignment */}
                  <div className="hidden md:block">
                    <AlignmentIndicator level={angel.thesisAlignment} />
                  </div>
                </div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div
                  className="px-4 pb-4 pt-0 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Background */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: ACCENT }}>
                        Background
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {angel.background}
                      </p>
                    </div>

                    {/* Why Conceivable */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#1EAA55" }}>
                        Why They'd Invest in Conceivable
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {angel.whyConceivable}
                      </p>
                    </div>

                    {/* Strategic Value */}
                    {angel.strategic && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#5A6FFF" }}>
                          Strategic Value (Beyond $)
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                          {angel.strategicValue}
                        </p>
                      </div>
                    )}

                    {/* Portfolio */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#9686B9" }}>
                        Notable Portfolio
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {angel.portfolio}
                      </p>
                    </div>

                    {/* Warm Intro Path */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#F1C028" }}>
                        Warm Intro Path
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {angel.warmIntroPath}
                      </p>
                    </div>

                    {/* Next Action */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#E24D47" }}>
                        Next Action
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                        {angel.nextAction}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={() => handleAdvanceStage(angel.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#1EAA55" }}
                    >
                      <CheckCircle2 size={12} /> Advance Stage
                    </button>
                    <button
                      onClick={() => setRejectionTarget({ id: angel.id, title: angel.name })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: "#E24D47" }}
                    >
                      <XCircle size={12} /> Pass
                    </button>
                    <button
                      onClick={() => setDiscussTarget({
                        id: angel.id,
                        title: angel.name,
                        detail: `Angel Investor: ${angel.name}. Title: ${angel.title}. Check size: ${angel.checkSize}. Alignment: ${angel.thesisAlignment}. Strategic: ${angel.strategic}. Background: ${angel.background}. Why Conceivable: ${angel.whyConceivable}. Next action: ${angel.nextAction}`,
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}
                    >
                      <MessageCircle size={12} /> Discuss
                    </button>
                    <JoyButton
                      agent="executive-coach"
                      prompt={`Draft a warm, personal outreach message to ${angel.name} (${angel.title}) about investing in Conceivable's $500K seed+ round. Their check size is ${angel.checkSize}. Context: ${angel.whyConceivable}. Warm intro path: ${angel.warmIntroPath}. Make it personal, not templated. Reference something specific about their background.`}
                      label="Draft Outreach"
                      variant="secondary"
                      icon={<MessageSquare size={11} />}
                    />
                    <JoyButton
                      agent="executive-coach"
                      prompt={`Find warm introduction paths to ${angel.name} (${angel.title}). Search through Kirsten Karchmer's network: 120+ podcast hosts she's appeared with, existing investor relationships, advisor connections, digital health conference connections, and the FemTech community. Known intro path: ${angel.warmIntroPath}. Find the strongest second-degree connections.`}
                      label="Find Warm Intro"
                      variant="ghost"
                      icon={<Search size={11} />}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sullivan Insight */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #9686B908 0%, #5A6FFF08 100%)",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Angels as Distribution, Not Just Capital
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              The strategic angels on this list aren't just writing checks — they're unlocking distribution.
              Scrub Capital's 700 clinicians become referral partners. Halle Tecco's network maps every downstream investor.
              RH Capital's brand validates you to every reproductive health player. Esther Dyson's name on your cap table
              makes your Series A 10x easier. Choose angels who multiply your reach, not just your runway.
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onSubmit={handleReject}
        itemTitle={rejectionTarget?.title || ""}
        itemType="investor"
      />

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="investor"
        contextId={discussTarget?.id || ""}
        contextTitle={discussTarget?.title || ""}
        contextDetail={discussTarget?.detail}
        onApprove={discussTarget ? () => { handleAdvanceStage(discussTarget.id); setDiscussTarget(null); } : undefined}
        onReject={discussTarget ? () => { setRejectionTarget({ id: discussTarget.id, title: discussTarget.title }); setDiscussTarget(null); } : undefined}
      />
    </div>
  );
}
