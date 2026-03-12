import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { POSTPARTUM_FEATURES, POSTPARTUM_DESCRIPTION, POSTPARTUM_PERSONA } from "@/lib/data/postpartum-features-data";

export const dynamic = "force-dynamic";

/**
 * POST /api/product/experiences/seed-postpartum
 * Seeds the Postpartum experience with description, persona, status, and all 13 features.
 * Idempotent — skips if features already exist.
 */
export async function POST() {
  try {
    // Find postpartum experience
    let postpartum = await prisma.experience.findUnique({
      where: { slug: "postpartum" },
      include: { _count: { select: { features: true } } },
    });

    if (!postpartum) {
      return NextResponse.json({ error: "Postpartum experience not found. Seed experiences first." }, { status: 404 });
    }

    // Update description, persona, and status
    postpartum = await prisma.experience.update({
      where: { id: postpartum.id },
      data: {
        status: "in_design",
        description: POSTPARTUM_DESCRIPTION,
        targetPersona: POSTPARTUM_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    // Only seed features if none exist yet
    if (postpartum._count.features === 0) {
      for (const feat of POSTPARTUM_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: postpartum.id,
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
      where: { experienceId: postpartum.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      experience: postpartum,
      featuresSeeded: features.length,
      features: features.map((f) => ({ id: f.id, name: f.name, priority: f.priority })),
    });
  } catch (err) {
    console.error("Seed postpartum error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Seed error" },
      { status: 500 }
    );
  }
}
