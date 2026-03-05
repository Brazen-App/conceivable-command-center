import { NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

/**
 * GET /api/mailchimp
 * Returns Mailchimp connection status, list info, and subscriber counts.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX) {
    return NextResponse.json({
      connected: false,
      error: "Mailchimp credentials not configured. Add MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX to environment.",
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    // Verify connection with ping
    const ping = await mc.ping.get();

    // Get lists
    const listsResponse = await mc.lists.getAllLists({ count: 10 });
    const lists = (listsResponse?.lists || []).map((list: Record<string, unknown>) => ({
      id: list.id,
      name: list.name,
      memberCount: (list.stats as Record<string, unknown>)?.member_count ?? 0,
      unsubscribeCount: (list.stats as Record<string, unknown>)?.unsubscribe_count ?? 0,
      openRate: (list.stats as Record<string, unknown>)?.open_rate ?? 0,
      clickRate: (list.stats as Record<string, unknown>)?.click_rate ?? 0,
    }));

    // Get recent campaigns
    const campaignsResponse = await mc.campaigns.list({ count: 10, sort_field: "send_time", sort_dir: "DESC" });
    const campaigns = (campaignsResponse?.campaigns || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      title: (c.settings as Record<string, unknown>)?.title,
      subject: (c.settings as Record<string, unknown>)?.subject_line,
      status: c.status,
      sendTime: c.send_time,
      emailsSent: c.emails_sent,
    }));

    return NextResponse.json({
      connected: true,
      healthStatus: ping?.health_status || "unknown",
      server: process.env.MAILCHIMP_SERVER_PREFIX,
      lists,
      recentCampaigns: campaigns,
    });
  } catch (err) {
    console.error("Mailchimp connection error:", err);
    return NextResponse.json({
      connected: false,
      error: err instanceof Error ? err.message : "Failed to connect to Mailchimp",
    });
  }
}
