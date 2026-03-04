import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recommendationId, recommendationType, reasonCategory, reasonText } = body;

    if (!recommendationId || !recommendationType || !reasonCategory) {
      return NextResponse.json(
        { error: "recommendationId, recommendationType, and reasonCategory are required" },
        { status: 400 }
      );
    }

    const rejection = await prisma.rejection.create({
      data: {
        recommendationId,
        recommendationType,
        reasonCategory,
        reasonText: reasonText || null,
        userId: "kirsten",
      },
    });

    return NextResponse.json(rejection);
  } catch (err) {
    console.error("POST /api/rejections error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const rejections = await prisma.rejection.findMany({
      where: type ? { recommendationType: type } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(rejections);
  } catch (err) {
    console.error("GET /api/rejections error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
