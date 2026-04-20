import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CALENDLY_USER_URI = "https://api.calendly.com/users/DEEADHMOP4GEKUPT";
const CALENDLY_ORG_URI = "https://api.calendly.com/organizations/ADDHECJJIQ2PIZT4";

/**
 * GET /api/calendly
 *
 * Fetch upcoming and recent Calendly bookings.
 * Query params:
 *   - status: "active" (default) or "canceled"
 *   - period: "upcoming" (default), "past", or "all"
 */
export async function GET(req: NextRequest) {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Calendly not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "active";
  const period = searchParams.get("period") || "upcoming";

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysOut = new Date(now);
  thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);

  let minTime: string;
  let maxTime: string;

  if (period === "upcoming") {
    minTime = now.toISOString();
    maxTime = thirtyDaysOut.toISOString();
  } else if (period === "past") {
    minTime = thirtyDaysAgo.toISOString();
    maxTime = now.toISOString();
  } else {
    minTime = thirtyDaysAgo.toISOString();
    maxTime = thirtyDaysOut.toISOString();
  }

  try {
    const eventsRes = await fetch(
      `https://api.calendly.com/scheduled_events?user=${CALENDLY_USER_URI}&min_start_time=${minTime}&max_start_time=${maxTime}&status=${status}&count=50&sort=start_time:asc`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!eventsRes.ok) {
      const err = await eventsRes.text();
      return NextResponse.json({ error: "Calendly API error", detail: err }, { status: 500 });
    }

    const eventsData = await eventsRes.json();
    const events = eventsData.collection || [];

    // Fetch invitees for each event
    const bookings = await Promise.all(
      events.map(async (event: any) => {
        let invitees: any[] = [];
        try {
          const invRes = await fetch(
            `${event.uri}/invitees?count=10`,
            { headers: { Authorization: `Bearer ${apiKey}` } }
          );
          if (invRes.ok) {
            const invData = await invRes.json();
            invitees = (invData.collection || []).map((inv: any) => ({
              name: inv.name,
              email: inv.email,
              status: inv.status,
              createdAt: inv.created_at,
              questions: inv.questions_and_answers || [],
            }));
          }
        } catch {
          // Non-critical
        }

        return {
          id: event.uri.split("/").pop(),
          name: event.name,
          status: event.status,
          startTime: event.start_time,
          endTime: event.end_time,
          location: event.location?.type || "unknown",
          invitees,
          createdAt: event.created_at,
        };
      })
    );

    // Summary stats
    const today = now.toISOString().split("T")[0];
    const todayBookings = bookings.filter(
      (b) => b.startTime.split("T")[0] === today
    );

    return NextResponse.json({
      total: bookings.length,
      todayCount: todayBookings.length,
      period,
      status,
      bookings,
    });
  } catch (err) {
    console.error("[calendly] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
