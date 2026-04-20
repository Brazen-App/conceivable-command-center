import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/site-config?key=pack-variant
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const config = await prisma.siteConfig.findUnique({ where: { key } });
  return NextResponse.json({ key, value: config?.value ?? null });
}

// POST /api/site-config  { key, value }
export async function POST(req: Request) {
  const body = await req.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "key and value are required" },
      { status: 400 },
    );
  }

  const config = await prisma.siteConfig.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  });

  return NextResponse.json({ key: config.key, value: config.value });
}
