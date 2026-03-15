import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mailchimp/warmup
 * Returns warmup schedule status and progress. (Read-only, still works.)
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const campaignsResponse = await mc.campaigns.list({
      count: 50,
      sort_field: "send_time",
      sort_dir: "DESC",
    });

    const warmupCampaigns = (campaignsResponse?.campaigns || [])
      .filter((c: Record<string, unknown>) => {
        const title = (c.settings as Record<string, unknown>)?.title as string || "";
        return title.includes("Warmup") || title.includes("warmup");
      })
      .map((c: Record<string, unknown>) => ({
        id: c.id,
        title: (c.settings as Record<string, unknown>)?.title,
        subject: (c.settings as Record<string, unknown>)?.subject_line,
        status: c.status,
        sendTime: c.send_time,
        emailsSent: c.emails_sent,
      }));

    const approvedEmails = await prisma.email.findMany({
      where: { status: "approved", complianceStatus: "approved" },
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
      select: { id: true, subject: true, week: true, sequence: true, phase: true },
    });

    return NextResponse.json({
      warmupCampaigns,
      approvedEmailsReady: approvedEmails,
      blocked: true,
      message: "EMAIL SENDING IS DISABLED. Read-only status view.",
    });
  } catch (err) {
    console.error("GET warmup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch warmup status" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mailchimp/warmup — DISABLED
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DISABLED — ALL EMAIL SENDING IS LOCKED DOWN                   ║
 * ║                                                                ║
 * ║  After two incidents of accidental full-list sends (March 8    ║
 * ║  and March 13, 2026), this endpoint is completely disabled.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  console.error(
    "[BLOCKED] warmup POST called but ALL email sending is disabled.",
    "Body:", JSON.stringify(body),
    "Time:", new Date().toISOString()
  );

  return NextResponse.json(
    {
      error: "EMAIL SENDING IS DISABLED. All email sending has been locked down after repeated accidental full-list sends. Contact the CEO to re-enable.",
      blocked: true,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}
