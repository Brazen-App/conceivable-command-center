import { NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

/**
 * GET /api/mailchimp/investigate
 * Debug endpoint: shows recent members with their signup source, tags, and metadata.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Get the 20 most recent subscribers
    const recentMembers = await mc.lists.getListMembersInfo(LIST_ID, {
      count: 30,
      status: "subscribed",
      sort_field: "timestamp_opt",
      sort_dir: "DESC",
    });

    const members = (recentMembers?.members || []).map((m: Record<string, unknown>) => ({
      email: (m.email_address as string)?.replace(/(.{3}).*@/, "$1***@"), // partially redacted
      signupDate: m.timestamp_opt || m.timestamp_signup,
      source: m.source,
      signupSource: (m as Record<string, unknown>).signup_source,
      tags: (m.tags as Array<{ id: number; name: string }>) || [],
      mergeFields: m.merge_fields,
      listId: m.list_id,
      status: m.status,
    }));

    // Also get signup forms / landing pages
    let signupForms: unknown = null;
    try {
      signupForms = await mc.lists.getListSignupForms(LIST_ID);
    } catch { /* not all plans support this */ }

    // Get tags on the list
    let listTags: unknown = null;
    try {
      const tagsRes = await mc.lists.listSegments(LIST_ID, { type: "static", count: 100 });
      listTags = (tagsRes?.segments || [])
        .filter((s: Record<string, unknown>) => {
          const name = (s.name as string || "").toLowerCase();
          return name.includes("early") || name.includes("access") || name.includes("founding") ||
                 name.includes("beta") || name.includes("popup") || name.includes("launch") ||
                 name.includes("waitlist") || name.includes("signup");
        })
        .map((s: Record<string, unknown>) => ({
          id: s.id,
          name: s.name,
          memberCount: s.member_count,
          createdAt: s.created_at,
        }));
    } catch { /* ignore */ }

    // Check for tags on the list (Mailchimp tags API)
    let allTags: unknown = null;
    try {
      allTags = await mc.lists.tagSearch(LIST_ID, "");
    } catch {
      // Try alternate approach
      try {
        const tagRes = await mc.fetch(`/3.0/lists/${LIST_ID}/tag-search`, { method: "GET" });
        allTags = tagRes;
      } catch { /* ignore */ }
    }

    // Look at unique sources across recent members
    const sourceBreakdown: Record<string, number> = {};
    for (const m of members) {
      const src = m.source || "unknown";
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    }

    // Get growth history for last 30 days
    let growthHistory: unknown = null;
    try {
      growthHistory = await mc.lists.getListGrowthHistory(LIST_ID, { count: 30 });
    } catch { /* ignore */ }

    return NextResponse.json({
      recentMembers: members,
      sourceBreakdown,
      relevantSegments: listTags,
      signupForms,
      allTags,
      growthHistory,
    });
  } catch (err) {
    console.error("[investigate] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
