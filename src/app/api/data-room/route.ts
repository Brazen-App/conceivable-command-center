import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@/generated/prisma";
import { getAllExpectedDocuments } from "@/lib/data/data-room";

const prisma = new PrismaClient();

/**
 * GET /api/data-room
 * Returns all data room documents. Accessible by admin, team, and investor roles.
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docs = await prisma.dataRoomDocument.findMany({
    orderBy: [{ folder: "asc" }, { sortOrder: "asc" }],
  });

  // If no docs exist, seed them
  if (docs.length === 0) {
    const expected = getAllExpectedDocuments();
    await prisma.dataRoomDocument.createMany({
      data: expected.map((d) => ({
        folder: d.folder,
        title: d.title,
        description: d.description,
        status: "missing",
        sortOrder: d.sortOrder,
      })),
    });
    const seeded = await prisma.dataRoomDocument.findMany({
      orderBy: [{ folder: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json({ documents: seeded });
  }

  return NextResponse.json({ documents: docs });
}

/**
 * PUT /api/data-room
 * Update a document (add URL, change status, upload info).
 * Admin and team only.
 */
export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role === "investor") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Document ID required" }, { status: 400 });
  }

  // Only allow safe fields
  const allowed: Record<string, unknown> = {};
  if (updates.url !== undefined) allowed.url = updates.url;
  if (updates.title !== undefined) allowed.title = updates.title;
  if (updates.description !== undefined) allowed.description = updates.description;
  if (updates.status !== undefined) allowed.status = updates.status;
  if (updates.notes !== undefined) allowed.notes = updates.notes;
  if (updates.fileName !== undefined) allowed.fileName = updates.fileName;
  if (updates.fileUrl !== undefined) allowed.fileUrl = updates.fileUrl;
  if (updates.fileSize !== undefined) allowed.fileSize = updates.fileSize;
  if (updates.mimeType !== undefined) allowed.mimeType = updates.mimeType;

  // Auto-set status to "ready" if URL is provided and status is still "missing"
  if (allowed.url && !allowed.status) {
    const current = await prisma.dataRoomDocument.findUnique({ where: { id } });
    if (current?.status === "missing") {
      allowed.status = "ready";
    }
  }

  allowed.uploadedBy = token.email as string;

  const doc = await prisma.dataRoomDocument.update({
    where: { id },
    data: allowed,
  });

  return NextResponse.json(doc);
}

/**
 * POST /api/data-room
 * Add a new custom document to a folder.
 * Admin and team only.
 */
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role === "investor") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await req.json();
  const { folder, title, description, url, status } = body;

  if (!folder || !title) {
    return NextResponse.json({ error: "Folder and title required" }, { status: 400 });
  }

  // Get max sort order for this folder
  const maxSort = await prisma.dataRoomDocument.findFirst({
    where: { folder },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const doc = await prisma.dataRoomDocument.create({
    data: {
      folder,
      title,
      description: description || null,
      url: url || null,
      status: status || (url ? "ready" : "missing"),
      sortOrder: (maxSort?.sortOrder ?? 0) + 1,
      uploadedBy: token.email as string,
    },
  });

  return NextResponse.json(doc);
}

/**
 * DELETE /api/data-room
 * Remove a document. Admin only.
 */
export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Document ID required" }, { status: 400 });
  }

  await prisma.dataRoomDocument.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
