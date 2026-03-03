import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const emails = await prisma.email.findMany({
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
    });
    return NextResponse.json(emails);
  } catch (err) {
    console.error("GET /api/emails error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  try {
    const email = await prisma.email.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json(email);
  } catch {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action } = body;

  let data: Record<string, unknown> = {};

  if (action === "approve") {
    data = { status: "approved", approvedAt: new Date().toISOString() };
  } else if (action === "reject") {
    data = { status: "pending", approvedAt: null };
  } else if (action === "compliance_approve") {
    data = { complianceStatus: "approved" };
  } else if (action === "compliance_flag") {
    data = { complianceStatus: "flagged" };
  } else if (action === "schedule") {
    data = { status: "published", publishedAt: new Date().toISOString() };
  } else if (action === "bulk_approve") {
    // Bulk approve: expects `ids` array in body
    const { ids } = body;
    if (Array.isArray(ids)) {
      const results = await prisma.email.updateMany({
        where: { id: { in: ids } },
        data: { status: "approved", approvedAt: new Date().toISOString() },
      });
      return NextResponse.json({ updated: results.count });
    }
  } else if (action === "bulk_compliance_approve") {
    const { ids } = body;
    if (Array.isArray(ids)) {
      const results = await prisma.email.updateMany({
        where: { id: { in: ids } },
        data: { complianceStatus: "approved" },
      });
      return NextResponse.json({ updated: results.count });
    }
  }

  try {
    const email = await prisma.email.update({
      where: { id },
      data,
    });
    return NextResponse.json(email);
  } catch {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }
}
