import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/marketing/blog-queue/[id] — get a single draft
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const draft = await prisma.content.findUnique({ where: { id } });
  if (!draft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ draft });
}

/**
 * PATCH /api/marketing/blog-queue/[id] — update a draft
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const { title, body, metaTitle, metaDescription, faqBlock, tags, status } = data;

  const existing = await prisma.content.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingMeta = (existing.metrics as any) || {};

  const draft = await prisma.content.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...(status !== undefined && { status }),
      metrics: {
        ...existingMeta,
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(faqBlock !== undefined && { faqBlock }),
        ...(tags !== undefined && { tags }),
      },
    },
  });

  return NextResponse.json({ draft });
}

/**
 * DELETE /api/marketing/blog-queue/[id] — delete a draft
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.content.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
