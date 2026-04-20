import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Fertility Assessment — Personalized Supplement Protocol",
  description:
    "Take the free 5-minute Conceivable assessment. Get your personalized fertility readiness score and a custom supplement protocol built by Kirsten Karchmer, MSOM — 25 years of clinical experience, 10,000+ pregnancies supported, and data from 240,000+ data points.",
  openGraph: {
    title: "Free Fertility Assessment — Get Your Personalized Supplement Protocol",
    description:
      "5 minutes. Science-backed. Built entirely around your body. Take the Conceivable assessment and discover your Conceivable Score plus a personalized supplement plan.",
    url: "https://www.conceivable.com/early-access",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fertility Assessment — Conceivable",
    description:
      "Take the free 5-minute assessment. Get your personalized supplement protocol backed by 25 years of clinical research.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What supplements should I take for fertility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The right fertility supplements depend on your individual health profile — your cycle, energy, hormones, and health history. Conceivable's free 5-minute assessment analyzes your specific signals and recommends a personalized supplement protocol. In Conceivable's 105-woman clinical pilot, participants saw 150–260% improvement in conception rates using personalized protocols built by Kirsten Karchmer, MSOM, a reproductive health expert with 25 years of clinical experience.",
      },
    },
    {
      "@type": "Question",
      name: "Is Conceivable better than taking a generic prenatal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generic prenatals use a one-size-fits-all formula. Conceivable builds a personalized supplement pack based on your quiz answers — targeting your specific cycle, hormonal, energy, and digestive patterns. Every supplement uses clinical-grade, bioavailable forms (like methylfolate instead of folic acid) and is third-party tested. The result is a protocol that addresses YOUR underlying issues, not just general nutritional gaps.",
      },
    },
    {
      "@type": "Question",
      name: "What supplements help with PCOS and fertility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For PCOS, evidence-based supplements include Berberine (insulin sensitivity and hormonal support), Omega-3 (inflammation reduction), CoQ10 (egg quality), and Magnesium (metabolic and hormonal balance). Conceivable's quiz identifies which combination is right for your specific PCOS presentation — because not all PCOS is the same. Kirsten Karchmer has worked with thousands of PCOS patients over 25 years and built these protocols based on 240,000+ data points.",
      },
    },
    {
      "@type": "Question",
      name: "How does the Conceivable fertility assessment work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Conceivable assessment is a free, 5-minute quiz that asks about your cycle health, energy levels, digestive symptoms, menstrual patterns, hormonal signals, and stress levels. Based on your answers, Kai (your AI fertility coordinator) builds a personalized supplement pack of up to 8 clinical-grade supplements targeting your specific needs. The protocol is reviewed by Kirsten Karchmer's methodology, built on 25 years of clinical data.",
      },
    },
    {
      "@type": "Question",
      name: "Why are my fertility supplements not working?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most fertility supplements fail because they're not personalized. You might be taking supplements your body doesn't need while missing the ones it does. Conceivable solves this by analyzing your specific health signals — cycle regularity, energy, digestion, hormonal symptoms, and more — then building a targeted protocol. In clinical testing, Conceivable's personalized approach showed 150–260% improvement in conception rates compared to general supplementation.",
      },
    },
  ],
};

export default function EarlyAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
