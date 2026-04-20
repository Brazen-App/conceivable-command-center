import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SEED_PAPERS = [
  {
    number: 1,
    title: "From Surveillance to Intervention: How AI-Guided Protocols Transform Fertility Tracking into Active Health Management",
    leadAuthor: "Kirsten Karchmer",
    status: "final_draft",
    targetJournal: "JMIR mHealth and uHealth",
    submissionDeadline: "2026-04-28",
    irbStatus: "exempt",
    notes: "Position paper / framework. Uses existing published data only. No original human subjects research.",
  },
  {
    number: 2,
    title: "AI-Mediated Protocol vs. Standard Tracking: 105-Woman Pilot Study",
    leadAuthor: "Kirsten Karchmer",
    status: "outline",
    targetJournal: "Fertility & Sterility",
    submissionDeadline: "2026-08-31",
    irbStatus: "needed",
    notes: "Requires IRB approval. 105 women, 240K data points from 2022-2024 clinical pilot. Need academic co-author with IRB access.",
  },
  {
    number: 3,
    title: "Economics of Tracking vs. AI-Guided Protocol Management: A Cost-Effectiveness Analysis",
    leadAuthor: "Kirsten Karchmer",
    status: "not_started",
    targetJournal: "Journal of Managed Care & Specialty Pharmacy",
    submissionDeadline: "2026-10-31",
    irbStatus: "n/a",
    notes: "Economic modeling paper. No original human subjects data needed.",
  },
  {
    number: 4,
    title: "Three Subclinical Predictors of Miscarriage Risk: Luteal Phase Deficiency, Chronic Inflammation, and Hormonal Dysregulation",
    leadAuthor: "Kirsten Karchmer",
    status: "hypothesis",
    targetJournal: "Human Reproduction",
    submissionDeadline: "2026-09-30",
    irbStatus: "needed",
    notes: "The big one. 3 subclinical factors. Dual publication path: Path A (retrospective with existing data) or Path B (prospective with Halo Ring data). Need IRB for either path.",
  },
  {
    number: 5,
    title: "Diagnostic Delay in Women's Reproductive Conditions: A Systematic Review and Economic Impact Analysis",
    leadAuthor: "Kirsten Karchmer",
    status: "not_started",
    targetJournal: "JAMA / BMJ",
    submissionDeadline: "2026-12-31",
    irbStatus: "n/a",
    notes: "Systematic review. Builds the case for why AI-guided protocols matter. No original human subjects data.",
  },
  {
    number: 6,
    title: "Reproductive Health Conditions and Workplace Productivity Loss: Quantifying the Hidden Economic Burden",
    leadAuthor: "Kirsten Karchmer",
    status: "not_started",
    targetJournal: "Journal of Occupational and Environmental Medicine",
    submissionDeadline: "2027-01-31",
    irbStatus: "n/a",
    notes: "Economic analysis targeting employer market. Uses published data + economic modeling.",
  },
];

const SEED_DATA_ASSETS = [
  {
    name: "Clinical Pilot Data",
    source: "Conceivable Clinical Pilot 2022-2024",
    sampleSize: 105,
    timePeriod: "2022-2024",
    irbStatus: "consent_needed",
    location: "Internal database",
    availableForResearch: false,
    notes: "105 women, ~240K data points. Consent framework and IRB status need to be confirmed before any research use. This is the crown jewel dataset.",
  },
  {
    name: "App User Data",
    source: "Conceivable App",
    sampleSize: null,
    timePeriod: "TBD from April 30 launch",
    irbStatus: "consent_needed",
    location: "App database (post-launch)",
    availableForResearch: false,
    notes: "Consent framework needed in app onboarding. Must be built before launch. Prospective data collection.",
  },
  {
    name: "Halo Ring Biometric Data",
    source: "Halo Ring",
    sampleSize: null,
    timePeriod: "TBD from launch",
    irbStatus: "consent_needed",
    location: "Ring data pipeline (post-launch)",
    availableForResearch: false,
    notes: "Wearable biometric data. Consent framework needed. Richest potential dataset for Papers 2 and 4.",
  },
];

export async function POST() {
  try {
    // Check if papers already exist
    const existingPapers = await prisma.researchPaper.count();
    if (existingPapers > 0) {
      return NextResponse.json({ message: "Seed data already exists", papers: existingPapers }, { status: 200 });
    }

    // Seed papers
    for (const paper of SEED_PAPERS) {
      await prisma.researchPaper.create({ data: paper });
    }

    // Seed data assets
    for (const asset of SEED_DATA_ASSETS) {
      await prisma.researchDataAsset.create({ data: asset });
    }

    return NextResponse.json({
      message: "Seed data created",
      papers: SEED_PAPERS.length,
      dataAssets: SEED_DATA_ASSETS.length,
    }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
