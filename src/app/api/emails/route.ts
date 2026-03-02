import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const emails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });
  return NextResponse.json(emails);
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
