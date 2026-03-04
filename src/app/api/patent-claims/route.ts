import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
