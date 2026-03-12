import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FIRST_PERIOD_FEATURES, FIRST_PERIOD_DESCRIPTION, FIRST_PERIOD_PERSONA } from "@/lib/data/first-period-features-data";

export const dynamic = "force-dynamic";

/**
 * POST /api/product/experiences/seed-first-period
 * Seeds the First Period experience with description, persona, status, and all 12 features.
 * Idempotent — skips if features already exist.
 */
export async function POST() {
  try {
    let experience = await prisma.experience.findUnique({
      where: { slug: "first-period" },
      include: { _count: { select: { features: true } } },
    });

    if (!experience) {
      return NextResponse.json({ error: "First Period experience not found. Seed experiences first." }, { status: 404 });
    }

    experience = await prisma.experience.update({
      where: { id: experience.id },
      data: {
        status: "in_design",
        description: FIRST_PERIOD_DESCRIPTION,
        targetPersona: FIRST_PERIOD_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    if (experience._count.features === 0) {
      for (const feat of FIRST_PERIOD_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: experience.id,
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
      where: { experienceId: experience.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      experience,
      featuresSeeded: features.length,
      features: features.map((f) => ({ id: f.id, name: f.name, priority: f.priority })),
    });
  } catch (err) {
    console.error("Seed first-period error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed error" },
      { status: 500 }
    );
  }
}
