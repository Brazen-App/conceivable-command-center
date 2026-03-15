import { NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIST_ID = "3c920d5bed";

// The early access popup launched on March 12, 2026
const POPUP_LAUNCH_DATE = "2026-03-12T00:00:00Z";

/**
 * GET /api/mailchimp/signups
 * Returns early access (popup) signup count + today/yesterday breakdown.
 * Counts members with source "Popup Form" since the popup launched.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Get total list info
    const list = await mc.lists.getList(LIST_ID);
    const totalSubscribers = list?.stats?.member_count ?? 0;

    // Get today and yesterday dates
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Fetch all members since popup launched — these are the only ones
    // that could possibly be popup signups
    let popupTotal = 0;
    let popupToday = 0;
    let popupYesterday = 0;
    let allToday = 0;
    let allYesterday = 0;
    let offset = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const res = await mc.lists.getListMembersInfo(LIST_ID, {
        count: pageSize,
        offset,
        status: "subscribed",
        since_timestamp_opt: POPUP_LAUNCH_DATE,
        sort_field: "timestamp_opt",
        sort_dir: "DESC",
      });

      const members = res?.members || [];
      if (members.length === 0) break;

      for (const m of members) {
        const optIn = new Date(m.timestamp_opt || m.timestamp_signup);
        const isToday = optIn >= todayStart;
        const isYesterday = !isToday && optIn >= yesterdayStart;

        if (isToday) allToday++;
        if (isYesterday) allYesterday++;

        // Count ALL new signups since popup launch as early access
        // Sources include: "Popup Form", "Conceivable", "Embed Form", Stan Store imports, etc.
        popupTotal++;
        if (isToday) popupToday++;
        if (isYesterday) popupYesterday++;
      }

      offset += pageSize;
      if (members.length < pageSize) hasMore = false;
      // Safety cap
      if (offset >= 5000) hasMore = false;
    }

    return NextResponse.json({
      totalSubscribers,
      earlyAccess: {
        total: popupTotal,
        today: popupToday,
        yesterday: popupYesterday,
        source: "all (since Mar 12 popup launch)",
      },
      allSignups: {
        today: allToday,
        yesterday: allYesterday,
      },
    });
  } catch (err) {
    console.error("[signups] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to get signups" },
      { status: 500 }
    );
  }
}
