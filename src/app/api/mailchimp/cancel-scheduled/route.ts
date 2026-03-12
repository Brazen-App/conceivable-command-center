import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/mailchimp/cancel-scheduled
 * Cancels all scheduled (not yet sent) Mailchimp campaigns and clears their IDs
 * from the database so they can be rescheduled on a new cadence.
 *
 * Body: { confirmed: true }
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const body = await req.json();
  if (!body.confirmed) {
    return NextResponse.json({
      error: "Safety check: include { confirmed: true } to cancel all scheduled campaigns.",
    }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Find all emails with mailchimpId that haven't been published (sent)
    const emails = await prisma.email.findMany({
      where: {
        mailchimpId: { not: null },
        status: { not: "published" },
      },
      select: { id: true, subject: true, mailchimpId: true, scheduledDate: true },
    });

    if (emails.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No scheduled campaigns to cancel.",
        canceled: 0,
      });
    }

    const results = [];

    for (const email of emails) {
      if (!email.mailchimpId) continue;

      try {
        // Try to unschedule first (for scheduled campaigns)
        try {
          await mc.campaigns.unschedule(email.mailchimpId);
        } catch {
          // May already be unscheduled or in a different state — continue
        }

        // Then delete the campaign
        try {
          await mc.campaigns.remove(email.mailchimpId);
        } catch {
          // If delete fails, the campaign may have been sent already — just clear the ID
        }

        // Clear the mailchimpId from DB
        await prisma.email.update({
          where: { id: email.id },
          data: {
            mailchimpId: null,
            scheduledDate: null,
            scheduledSegment: null,
          },
        });

        results.push({
          emailId: email.id,
          subject: email.subject,
          oldDate: email.scheduledDate,
          campaignId: email.mailchimpId,
          ok: true,
        });

        // Small delay for rate limiting
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({
          emailId: email.id,
          subject: email.subject,
          campaignId: email.mailchimpId,
          ok: false,
          error: msg,
        });
      }
    }

    const canceled = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    return NextResponse.json({
      ok: true,
      message: `${canceled} scheduled campaigns canceled and cleared. ${failed} failed. Ready to reschedule.`,
      canceled,
      failed,
      results,
    });
  } catch (err) {
    console.error("Cancel-scheduled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to cancel campaigns" },
      { status: 500 }
    );
  }
}
