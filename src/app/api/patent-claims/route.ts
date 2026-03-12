import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/patent-claims
 * Create a new patent claim (e.g., from Joy's suggestions).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      claimText, category, valueTier, estimatedValue, rationale,
      urgency, priorArtRisk, parentPatentRef, claimType, followOnNote,
    } = body;

    if (!claimText) {
      return NextResponse.json({ error: "claimText is required" }, { status: 400 });
    }

    // Get the next claim number
    const maxClaim = await prisma.patentClaim.findFirst({
      orderBy: { claimNumber: "desc" },
      select: { claimNumber: true },
    });
    const nextNumber = (maxClaim?.claimNumber || 0) + 1;

    const claim = await prisma.patentClaim.create({
      data: {
        claimNumber: nextNumber,
        claimText,
        claimType: claimType || "independent",
        parentPatentRef: parentPatentRef || "New Filing — Joy Recommendation",
        valueTier: valueTier || "MEDIUM",
        estimatedValue: estimatedValue || 0,
        rationale: rationale || "",
        status: "not_drafted",
        priority: urgency === "file_now",
        archived: false,
        category: category || "software_ai",
        urgency: urgency || "monitor",
        priorArtRisk: priorArtRisk || "medium",
        followOnNote: followOnNote || null,
      },
    });

    return NextResponse.json(claim);
  } catch (err) {
    console.error("POST /api/patent-claims error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    const claims = await prisma.patentClaim.findMany({
      where: includeArchived ? undefined : { archived: false },
      orderBy: [
        { priority: "desc" },
        { claimNumber: "asc" },
      ],
    });

    return NextResponse.json(claims);
  } catch (err) {
    console.error("GET /api/patent-claims error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "id and action are required" },
        { status: 400 }
      );
    }

    let data: Record<string, unknown> = {};

    if (action === "toggle_priority") {
      const claim = await prisma.patentClaim.findUnique({ where: { id } });
      if (!claim) return NextResponse.json({ error: "Not found" }, { status: 404 });
      data = { priority: !claim.priority };
    } else if (action === "archive") {
      data = { archived: true };
    } else if (action === "unarchive") {
      data = { archived: false };
    } else if (action === "update_status") {
      data = { status: body.status };
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await prisma.patentClaim.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/patent-claims error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
