import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/rejections/insights
 * Returns aggregated rejection patterns for Joy to learn from.
 * Query params:
 *   - type: filter by recommendationType (optional)
 *   - days: look back N days (default 90)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const days = parseInt(searchParams.get("days") || "90", 10);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const where = {
      createdAt: { gte: since },
      ...(type ? { recommendationType: type } : {}),
    };

    // Get all rejections in window
    const rejections = await prisma.rejection.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Aggregate by type
    const byType: Record<string, number> = {};
    for (const r of rejections) {
      byType[r.recommendationType] = (byType[r.recommendationType] || 0) + 1;
    }

    // Aggregate by reason category
    const byReason: Record<string, number> = {};
    for (const r of rejections) {
      byReason[r.reasonCategory] = (byReason[r.reasonCategory] || 0) + 1;
    }

    // Aggregate by type + reason (cross-tabulation)
    const byTypeAndReason: Record<string, Record<string, number>> = {};
    for (const r of rejections) {
      if (!byTypeAndReason[r.recommendationType]) {
        byTypeAndReason[r.recommendationType] = {};
      }
      byTypeAndReason[r.recommendationType][r.reasonCategory] =
        (byTypeAndReason[r.recommendationType][r.reasonCategory] || 0) + 1;
    }

    // Collect freeform reasons for context
    const recentFeedback = rejections
      .filter((r) => r.reasonText)
      .slice(0, 20)
      .map((r) => ({
        type: r.recommendationType,
        category: r.reasonCategory,
        feedback: r.reasonText,
        date: r.createdAt,
      }));

    // Build a natural-language summary for agent injection
    const totalRejections = rejections.length;
    const topReasons = Object.entries(byReason)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => `${reason} (${count})`);

    const topTypes = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t, count]) => `${t} (${count})`);

    const summary =
      totalRejections === 0
        ? "No rejections recorded yet. The CEO has not rejected any recommendations in this period."
        : `In the last ${days} days, the CEO rejected ${totalRejections} recommendations. ` +
          `Most rejected types: ${topTypes.join(", ")}. ` +
          `Top rejection reasons: ${topReasons.join(", ")}. ` +
          (recentFeedback.length > 0
            ? `Recent feedback: ${recentFeedback.slice(0, 3).map((f) => `"${f.feedback}" (${f.type})`).join("; ")}.`
            : "");

    return NextResponse.json({
      totalRejections,
      periodDays: days,
      byType,
      byReason,
      byTypeAndReason,
      recentFeedback,
      summary,
    });
  } catch (err) {
    console.error("GET /api/rejections/insights error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
