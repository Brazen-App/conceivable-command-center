import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.departmentData.findMany({
    where: { department: "finance" },
  });

  const data: Record<string, unknown> = {};
  for (const row of rows) {
    data[row.key] = row.value;
  }

  return NextResponse.json(data);
}
