import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/cleanup-test-logs
 * Marks any KaiChatLog entries with obvious test emails as isTest=true.
 * Patterns: t@t.*, test@*, *@test.*, *@example.*, verify@*, flowtest@*
 */
export async function POST() {
  try {
    const all = await prisma.kaiChatLog.findMany({
      where: { isTest: false },
      select: { id: true, email: true },
    });

    const testIds: string[] = [];
    const patterns = [/^t@t\./i, /^test@/i, /@test\./i, /@example\./i, /^verify@/i, /^flowtest@/i];
    const explicitTestEmails = new Set([
      "kirsten.karchmer@iambrazen.com",
      "kirsten@conceivable.com",
      "jennifer.pawling@pfisd.net",
    ]);

    for (const log of all) {
      const e = (log.email || "").toLowerCase().trim();
      if (explicitTestEmails.has(e) || patterns.some(p => p.test(e))) {
        testIds.push(log.id);
      }
    }

    if (testIds.length > 0) {
      await prisma.kaiChatLog.updateMany({
        where: { id: { in: testIds } },
        data: { isTest: true },
      });
    }

    return NextResponse.json({ ok: true, marked: testIds.length });
  } catch (err) {
    console.error("[cleanup-test-logs]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
