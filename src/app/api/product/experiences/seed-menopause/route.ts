import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  MENOPAUSE_FEATURES,
  MENOPAUSE_DESCRIPTION,
  MENOPAUSE_PERSONA,
} from "@/lib/data/menopause-features-data";

export async function POST() {
  try {
    let menopause = await prisma.experience.findUnique({
      where: { slug: "menopause-beyond" },
      include: { _count: { select: { features: true } } },
    });

    if (!menopause) {
      return NextResponse.json(
        { error: "Menopause & Beyond experience not found. Run /api/product/experiences/seed first." },
        { status: 404 }
      );
    }

    menopause = await prisma.experience.update({
      where: { id: menopause.id },
      data: {
        status: "in_design",
        description: MENOPAUSE_DESCRIPTION,
        targetPersona: MENOPAUSE_PERSONA,
      },
      include: { _count: { select: { features: true } } },
    });

    let featuresSeeded = 0;
    if (menopause._count.features === 0) {
      for (const feat of MENOPAUSE_FEATURES) {
        await prisma.feature.create({
          data: {
            experienceId: menopause.id,
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
      experience: menopause.id,
      featuresSeeded,
      message: `Menopause & Beyond experience seeded with ${featuresSeeded} features`,
    });
  } catch (error) {
    console.error("Seed menopause error:", error);
    return NextResponse.json({ error: "Failed to seed menopause" }, { status: 500 });
  }
}
