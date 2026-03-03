import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.departmentData.findMany({
      where: { department: "community" },
    });

    const data: Record<string, unknown> = {};
    for (const row of rows) {
      data[row.key] = row.value;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[community]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
