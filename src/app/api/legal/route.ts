import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Tier 1 models
  const [patents, claims, pendingReviews] = await Promise.all([
    prisma.patent.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.complianceClaim.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.pendingReview.findMany({ orderBy: { submittedAt: "desc" } }),
  ]);

  // Tier 2 supplementary data from DepartmentData
  const rows = await prisma.departmentData.findMany({
    where: { department: "legal" },
  });
  const supplementary: Record<string, unknown> = {};
  for (const row of rows) {
    supplementary[row.key] = row.value;
  }

  return NextResponse.json({
    patents,
    competitorFilings: supplementary.competitorFilings ?? [],
    claims,
    regulatory: supplementary.regulatory ?? [],
    pendingReviews,
    testimonialFlags: supplementary.testimonialFlags ?? [],
    hipaaChecklist: supplementary.hipaaChecklist ?? [],
    vendorReviews: supplementary.vendorReviews ?? [],
    privacyPolicies: supplementary.privacyPolicies ?? [],
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action } = body;

  try {
    const review = await prisma.pendingReview.update({
      where: { id },
      data: { status: action },
    });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
