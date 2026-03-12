import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EXPERIENCES } from "@/lib/data/experiences-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/product/experiences
 * Returns all experiences with feature counts.
 * Auto-seeds from EXPERIENCES data if the table is empty.
 */
export async function GET() {
  try {
    let experiences = await prisma.experience.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { features: true } } },
    });

    // Auto-seed if empty
    if (experiences.length === 0) {
      for (const exp of EXPERIENCES) {
        await prisma.experience.create({
          data: {
            name: exp.name,
            slug: exp.slug,
            tagline: exp.tagline,
            accentColor: exp.accentColor,
            status: exp.status,
          },
        });
      }
      experiences = await prisma.experience.findMany({
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { features: true } } },
      });
    }

    return NextResponse.json(experiences);
  } catch (err) {
    console.error("GET /api/product/experiences error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/product/experiences
 * Update an experience (description, targetPersona, status)
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const updated = await prisma.experience.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/product/experiences error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
