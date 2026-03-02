import { NextRequest, NextResponse } from "next/server";
import {
  addCapture,
  getAllCaptures,
  type CaptureEntry,
  type CaptureType,
  type CaptureDepartment,
} from "@/lib/stores/capture-store";
import { addPOV } from "@/lib/stores/pov-store";
import type { POVEntry } from "@/lib/data/pov-data";

const VALID_DEPARTMENTS: CaptureDepartment[] = [
  "content-engine",
  "research",
  "ideas-parking-lot",
  "legal-review",
  "email-inspiration",
  "fundraising-intel",
];

export async function GET() {
  return NextResponse.json(getAllCaptures());
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
  const entry: CaptureEntry = {
    id,
    type: (type as CaptureType) || "text",
    content,
    summary: summary || undefined,
    department: department as CaptureDepartment,
    createdAt: new Date().toISOString(),
    fileName: fileName || undefined,
    fileSize: fileSize || undefined,
  };

  const saved = addCapture(entry);

  // If routed to content-engine and is voice/text, also save as POV
  if (
    department === "content-engine" &&
    (type === "voice" || type === "text")
  ) {
    const povEntry: POVEntry = {
      id: `pov-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      topic: "Quick Capture POV",
      transcript: content,
      sourceType: "quick-capture",
      createdAt: new Date().toISOString(),
      keyPositions: [],
      analogies: [],
      emotionalTone: "",
      relatedTopics: [],
    };
    addPOV(povEntry);
  }

  return NextResponse.json(
    { capture: saved, routedTo: department },
    { status: 201 }
  );
}
