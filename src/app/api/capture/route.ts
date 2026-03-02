import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_DEPARTMENTS = [
  "content-engine",
  "research",
  "ideas-parking-lot",
  "legal-review",
  "email-inspiration",
  "fundraising-intel",
];

export async function GET() {
  const captures = await prisma.capture.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(captures);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, content, department, summary, fileName, fileSize } = body;

  if (!content || !department) {
    return NextResponse.json(
      { error: "content and department are required" },
      { status: 400 }
    );
  }

  if (!VALID_DEPARTMENTS.includes(department)) {
    return NextResponse.json(
      { error: `Invalid department. Must be one of: ${VALID_DEPARTMENTS.join(", ")}` },
      { status: 400 }
    );
  }

  const id = `cap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const saved = await prisma.capture.create({
    data: {
      id,
      type: type || "text",
      content,
      summary: summary || null,
      department,
      fileName: fileName || null,
      fileSize: fileSize || null,
    },
  });

  // If routed to content-engine and is voice/text, also save as POV
  if (
    department === "content-engine" &&
    (type === "voice" || type === "text")
  ) {
    await prisma.pOV.create({
      data: {
        id: `pov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        topic: "Quick Capture POV",
        transcript: content,
        sourceType: "quick-capture",
        keyPositions: [],
        analogies: [],
        emotionalTone: null,
        relatedTopics: [],
      },
    });
  }

  return NextResponse.json(
    { capture: saved, routedTo: department },
    { status: 201 }
  );
}
