import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [views, signups] = await Promise.all([
    prisma.resultsPageView.count(),
    prisma.earlyAccessSignup.count(),
  ]);

  const conversionRate = views > 0 ? ((signups / views) * 100).toFixed(1) : null;

  return NextResponse.json({ views, signups, conversionRate });
}
