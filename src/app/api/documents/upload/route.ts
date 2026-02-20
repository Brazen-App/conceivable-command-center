import { NextRequest, NextResponse } from "next/server";
import { saveUploadedFile, processDocument } from "@/lib/pipelines/training-voice";
import { DocumentType } from "@/types";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB — Vercel free tier limit

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 4.5MB on the free plan.` },
        { status: 413 }
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
