import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, processDocument } from "@/lib/pipelines/training-voice";
import { DocumentType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as DocumentType) ?? "other";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await saveUploadedFile(buffer, file.name);

    const doc = await processDocument(filePath, file.name, type, file.type);

    return NextResponse.json({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      fileSize: doc.fileSize,
      chunkCount: doc.chunkCount,
      status: doc.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload document";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
