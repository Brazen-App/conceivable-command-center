import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PERIOD_FEATURES, PERIOD_DESCRIPTION, PERIOD_PERSONA } from "@/lib/data/period-features-data";

export const dynamic = "force-dynamic";

/**
 * POST /api/product/experiences/seed-period
 * Seeds the Periods experience with description, persona, status, and all 12 features.
 * Idempotent — skips if features already exist.
 */
export async function POST() {
  try {
    // Find periods experience
    let periods = await prisma.experience.findUnique({
      where: { slug: "periods" },
      include: { _count: { select: { features: true } } },
    });

    if (!periods) {
      return NextResponse.json({ error: "Periods experience not found. Seed experiences first." }, { status: 404 });
    }

    // Update description, persona, and status
    periods = await prisma.experience.update({
      where: { id: periods.id },
      data: {
        status: "in_design",
        description: PERIOD_DESCRIPTION,
        targetPersona: PERIOD_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    // Only seed features if none exist yet
    if (periods._count.features === 0) {
      for (const feat of PERIOD_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: periods.id,
            name: feat.name,
            description: feat.description,
            userStory: feat.userStory,
            priority: feat.priority,
            complexity: feat.complexity,
            status: feat.status,
            careTeamMembers: feat.careTeamMembers,
            notes: feat.notes,
          },
        });
      }
    }

    const features = await prisma.feature.findMany({
      where: { experienceId: periods.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      experience: periods,
      featuresSeeded: features.length,
      features: features.map((f) => ({ id: f.id, name: f.name, priority: f.priority })),
    });
  } catch (err) {
    console.error("Seed period error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed error" },
      { status: 500 }
    );
  }
}
