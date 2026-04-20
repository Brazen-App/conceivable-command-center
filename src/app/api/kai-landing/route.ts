import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

async function bump(key: string) {
  const existing = await prisma.siteConfig.findUnique({ where: { key } });
  const val = (parseInt(existing?.value as string || "0", 10) + 1).toString();
  await prisma.siteConfig.upsert({
    where: { key },
    update: { value: val },
    create: { key, value: "1" },
  });
}

/** POST — log a landing page view */
export async function POST() {
  try {
    const today = new Date().toISOString().split("T")[0];
    await Promise.all([
      bump("kai_landing_total"),
      bump(`kai_landing_${today}`),
    ]);
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    console.error("[kai-landing]", err);
    return NextResponse.json({ ok: true }, { headers: CORS });
  }
}

/** GET — return view counts */
export async function GET() {
  try {
    const total = await prisma.siteConfig.findUnique({ where: { key: "kai_landing_total" } });
    const daily: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = await prisma.siteConfig.findUnique({ where: { key: `kai_landing_${dateStr}` } });
      if (entry) daily[dateStr] = parseInt(entry.value as string || "0", 10);
    }
    return NextResponse.json({
      total: parseInt(total?.value as string || "0", 10),
      daily,
    }, { headers: CORS });
  } catch {
    return NextResponse.json({ total: 0, daily: {} }, { headers: CORS });
  }
}
