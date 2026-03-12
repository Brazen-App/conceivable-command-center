import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/product/features?experienceId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get("experienceId");

    if (!experienceId) {
      return NextResponse.json({ error: "experienceId required" }, { status: 400 });
    }

    const features = await prisma.feature.findMany({
      where: { experienceId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(features);
  } catch (err) {
    console.error("GET /api/product/features error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/product/features
 * Create a new feature
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { experienceId, name, description, userStory, priority, complexity, careTeamMembers } = body;

    if (!experienceId || !name) {
      return NextResponse.json({ error: "experienceId and name required" }, { status: 400 });
    }

    const feature = await prisma.feature.create({
      data: {
        experienceId,
        name,
        description: description || "",
        userStory: userStory || null,
        priority: priority || "should_have",
        complexity: complexity || "medium",
        careTeamMembers: careTeamMembers || null,
      },
    });

    return NextResponse.json(feature);
  } catch (err) {
    console.error("POST /api/product/features error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/product/features
 * Update a feature
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const updated = await prisma.feature.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/product/features error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/product/features
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await prisma.feature.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/product/features error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
