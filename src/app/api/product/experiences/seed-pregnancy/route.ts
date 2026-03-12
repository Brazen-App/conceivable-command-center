import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PREGNANCY_FEATURES, PREGNANCY_DESCRIPTION, PREGNANCY_PERSONA } from "@/lib/data/pregnancy-features-data";

export const dynamic = "force-dynamic";

/**
 * POST /api/product/experiences/seed-pregnancy
 * Seeds the Pregnancy experience with description, persona, status, and all 11 features.
 * Idempotent — skips if features already exist.
 */
export async function POST() {
  try {
    // Find pregnancy experience
    let pregnancy = await prisma.experience.findUnique({
      where: { slug: "pregnancy" },
      include: { _count: { select: { features: true } } },
    });

    if (!pregnancy) {
      return NextResponse.json({ error: "Pregnancy experience not found. Seed experiences first." }, { status: 404 });
    }

    // Update description, persona, and status
    pregnancy = await prisma.experience.update({
      where: { id: pregnancy.id },
      data: {
        status: "in_design",
        description: PREGNANCY_DESCRIPTION,
        targetPersona: PREGNANCY_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    // Only seed features if none exist yet
    if (pregnancy._count.features === 0) {
      for (const feat of PREGNANCY_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: pregnancy.id,
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
      where: { experienceId: pregnancy.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      experience: pregnancy,
      featuresSeeded: features.length,
      features: features.map((f) => ({ id: f.id, name: f.name, priority: f.priority })),
    });
  } catch (err) {
    console.error("Seed pregnancy error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed error" },
      { status: 500 }
    );
  }
}
