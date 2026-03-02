import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Tier 1: Investors split by tier, with extras spread back into the object
  const investors = await prisma.investor.findMany({
    orderBy: { createdAt: "asc" },
  });

  const spreadExtras = (inv: typeof investors[number]) => {
    const { extras, status, lastContact, nextActionDate, ...rest } = inv;
    return {
      ...rest,
      stage: status, // API response uses "stage" field name
      lastContactDate: lastContact?.toISOString() ?? null,
      nextActionDate: nextActionDate?.toISOString() ?? null,
      ...(extras && typeof extras === "object" ? extras as Record<string, unknown> : {}),
    };
  };

  const movementBoard = investors.filter((i) => i.tier === "movement").map(spreadExtras);
  const ventureInvestors = investors.filter((i) => i.tier === "venture").map(spreadExtras);
  const strategicPartners = investors.filter((i) => i.tier === "strategic").map(spreadExtras);

  // Tier 2: Supplementary data from DepartmentData
  const rows = await prisma.departmentData.findMany({
    where: { department: "fundraising" },
  });
  const supplementary: Record<string, unknown> = {};
  for (const row of rows) {
    supplementary[row.key] = row.value;
  }

  return NextResponse.json({
    movementBoard,
    ventureInvestors,
    strategicPartners,
    pitchMaterials: supplementary.pitchMaterials ?? [],
    meetingNotes: supplementary.meetingNotes ?? [],
    metrics: supplementary.metrics ?? [],
    weeklyRecommendation: supplementary.weeklyRecommendation ?? null,
    narrative: supplementary.narrative ?? "",
    storyAngles: supplementary.storyAngles ?? [],
  });
}
