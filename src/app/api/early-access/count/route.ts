import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await prisma.earlyAccessSignup.count();
  return NextResponse.json({ count });
}
