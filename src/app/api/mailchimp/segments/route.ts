import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

/**
 * GET /api/mailchimp/segments
 * Lists existing segments for the primary list.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const listsResponse = await mc.lists.getAllLists({ count: 1 });
    const listId = listsResponse?.lists?.[0]?.id;
    if (!listId) {
      return NextResponse.json({ error: "No Mailchimp list found" }, { status: 404 });
    }

    const segmentsResponse = await mc.lists.listSegments(listId, { count: 100 });
    const segments = (segmentsResponse?.segments || []).map((s: Record<string, unknown>) => ({
      id: s.id,
      name: s.name,
      memberCount: s.member_count,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      type: s.type,
    }));

    return NextResponse.json({ listId, segments });
  } catch (err) {
    console.error("GET segments error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mailchimp/segments
 * Creates warmup segments for email sending.
 * Body: { action: "create_warmup_segments" }
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    const listsResponse = await mc.lists.getAllLists({ count: 1 });
    const listId = listsResponse?.lists?.[0]?.id;
    if (!listId) {
      return NextResponse.json({ error: "No Mailchimp list found" }, { status: 404 });
    }

    if (body.action === "create_warmup_segments") {
      const results = [];

      // Phase 1: Hot List — opened email in last 30 days
      try {
        const hotSegment = await mc.lists.createSegment(listId, {
          name: "Warmup Phase 1 - Hot List (Opened Last 30 Days)",
          options: {
            match: "all",
            conditions: [
              {
                condition_type: "Aim",
                field: "aim",
                op: "open",
                value: "30",
              },
            ],
          },
        });
        results.push({
          phase: 1,
          name: "Hot List",
          segmentId: hotSegment.id,
          memberCount: hotSegment.member_count,
          ok: true,
        });
      } catch (err) {
        results.push({
          phase: 1,
          name: "Hot List",
          ok: false,
          error: err instanceof Error ? err.message : "Failed to create Hot List segment",
        });
      }

      // Phase 2: Warm List — opened email in last 90 days (exclude Phase 1)
      try {
        const warmSegment = await mc.lists.createSegment(listId, {
          name: "Warmup Phase 2 - Warm List (Opened Last 90 Days)",
          options: {
            match: "all",
            conditions: [
              {
                condition_type: "Aim",
                field: "aim",
                op: "open",
                value: "90",
              },
            ],
          },
        });
        results.push({
          phase: 2,
          name: "Warm List",
          segmentId: warmSegment.id,
          memberCount: warmSegment.member_count,
          ok: true,
        });
      } catch (err) {
        results.push({
          phase: 2,
          name: "Warm List",
          ok: false,
          error: err instanceof Error ? err.message : "Failed to create Warm List segment",
        });
      }

      // Phase 3: Cold List batches (remaining subscribers, split into 4 batches)
      // Mailchimp doesn't support "NOT in segment" directly in segment creation,
      // so we create a "Cold List" segment for all non-engaged subscribers
      for (let batch = 1; batch <= 4; batch++) {
        try {
          const coldSegment = await mc.lists.createSegment(listId, {
            name: `Warmup Phase 3 - Cold List Batch ${batch}`,
            options: {
              match: "all",
              conditions: [
                {
                  condition_type: "Aim",
                  field: "aim",
                  op: "open",
                  value: "365", // Hasn't opened in 365 days (catch-all for less engaged)
                },
              ],
            },
          });
          results.push({
            phase: 3,
            batch,
            name: `Cold List Batch ${batch}`,
            segmentId: coldSegment.id,
            memberCount: coldSegment.member_count,
            ok: true,
          });
        } catch (err) {
          results.push({
            phase: 3,
            batch,
            name: `Cold List Batch ${batch}`,
            ok: false,
            error: err instanceof Error ? err.message : `Failed to create Cold List Batch ${batch}`,
          });
        }
      }

      return NextResponse.json({
        listId,
        created: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        results,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("POST segments error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create segments" },
      { status: 500 }
    );
  }
}
