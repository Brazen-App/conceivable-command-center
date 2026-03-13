import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PERIMENOPAUSE_FEATURES,
  PERIMENOPAUSE_DESCRIPTION,
  PERIMENOPAUSE_PERSONA,
} from "@/lib/data/perimenopause-features-data";

export async function POST() {
  try {
    let perimenopause = await prisma.experience.findUnique({
      where: { slug: "perimenopause" },
      include: { _count: { select: { features: true } } },
    });

    if (!perimenopause) {
      return NextResponse.json(
        { error: "Perimenopause experience not found. Run /api/product/experiences/seed first." },
        { status: 404 }
      );
    }

    perimenopause = await prisma.experience.update({
      where: { id: perimenopause.id },
      data: {
        status: "in_design",
        description: PERIMENOPAUSE_DESCRIPTION,
        targetPersona: PERIMENOPAUSE_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    let featuresSeeded = 0;
    if (perimenopause._count.features === 0) {
      for (const feat of PERIMENOPAUSE_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: perimenopause.id,
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
        featuresSeeded++;
      }
    }

    return NextResponse.json({
      experience: perimenopause.id,
      featuresSeeded,
      message: `Perimenopause experience seeded with ${featuresSeeded} features`,
    });
  } catch (error) {
    console.error("Seed perimenopause error:", error);
    return NextResponse.json({ error: "Failed to seed perimenopause" }, { status: 500 });
  }
}
