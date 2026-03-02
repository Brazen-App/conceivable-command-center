import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const query = q.trim();

  // Search across topic and transcript using Prisma OR conditions
  const results = await prisma.pOV.findMany({
    where: {
      OR: [
        { topic: { contains: query, mode: "insensitive" } },
        { transcript: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ query, results, count: results.length });
}
