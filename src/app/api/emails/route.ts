import { NextRequest, NextResponse } from "next/server";
import { LAUNCH_EMAILS, type LaunchEmail } from "@/lib/data/launch-emails";

// In-memory store (seeded from launch-emails data, ready for Prisma swap)
let emails: LaunchEmail[] = [...LAUNCH_EMAILS];

export async function GET() {
  return NextResponse.json(emails);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  const index = emails.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  emails[index] = { ...emails[index], ...updates };
  return NextResponse.json(emails[index]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action } = body;

  const index = emails.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  if (action === "approve") {
    emails[index] = {
      ...emails[index],
      status: "approved",
      approvedAt: new Date().toISOString(),
    };
  } else if (action === "reject") {
    emails[index] = {
      ...emails[index],
      status: "pending",
      approvedAt: null,
    };
  } else if (action === "compliance_approve") {
    emails[index] = {
      ...emails[index],
      complianceStatus: "approved",
    };
  } else if (action === "compliance_flag") {
    emails[index] = {
      ...emails[index],
      complianceStatus: "flagged",
    };
  }

  return NextResponse.json(emails[index]);
}
