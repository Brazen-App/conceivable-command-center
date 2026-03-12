import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const LIST_ID = "3c920d5bed";

// ── Audience Tiers (same as warmup-schedule) ────────────────────────
// First 6 emails ramp up, then full list for the rest.
const AUDIENCE_TIERS = [
  { size: 3000, minRating: 4, label: "~3,000 (Top openers)" },
  { size: 5000, minRating: 3, label: "~5,000 (Recent openers)" },
  { size: 7000, minRating: 3, label: "~7,000 (Engaged quarter)" },
  { size: 10000, minRating: 2, label: "~10,000 (Engaged third)" },
  { size: 15000, minRating: 1, label: "~15,000 (Engaged half)" },
  { size: 25000, minRating: 0, label: "~25,000 (Most of list)" },
  { size: 29000, minRating: 0, label: "~29,000 (Full list)" },
];

// ── Send Days: Mon (1), Wed (3), Fri (5) ────────────────────────────
const SEND_DAYS = [1, 3, 5];

function nextSendDay(from: Date): Date {
  const d = new Date(from);
  while (!SEND_DAYS.includes(d.getDay())) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function advanceToNextSendDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  return nextSendDay(d);
}

function textToHtml(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  const htmlParagraphs = paragraphs.map((para) => {
    const withBreaks = para.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).join("<br>\n");
    return `<p style="margin: 0 0 16px 0; line-height: 1.6;">${withBreaks}</p>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#2A2828;background-color:#F9F7F0;margin:0;padding:0}.container{max-width:600px;margin:0 auto;padding:40px 24px;background-color:#fff}p{margin:0 0 16px 0;line-height:1.6}a{color:#5A6FFF}</style></head><body><div class="container">${htmlParagraphs.join("")}</div></body></html>`;
}

// Send time: 10am EST = 15:00 UTC (slight variation by day)
function getSendTimeUTC(dateStr: string): string {
  const date = new Date(dateStr + "T15:00:00Z"); // 10am EST
  const day = date.getUTCDay();

  if (day === 1) date.setUTCHours(15, 0, 0, 0);        // Mon 10:00am EST
  else if (day === 3) date.setUTCHours(15, 0, 0, 0);    // Wed 10:00am EST
  else if (day === 5) date.setUTCHours(15, 30, 0, 0);   // Fri 10:30am EST
  else date.setUTCHours(15, 0, 0, 0);                   // fallback

  return date.toISOString();
}

/**
 * GET /api/mailchimp/schedule-all
 * Preview the 3x/week schedule with audience ramp-up (dry run).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get("startDate");

  const emails = await prisma.email.findMany({
    where: { status: { not: "published" } },
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
    select: { id: true, subject: true, week: true, sequence: true, phase: true, status: true, mailchimpId: true },
  });

  // Default start: tomorrow
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const startDate = startDateParam ? new Date(startDateParam) : defaultStart;

  let sendDate = nextSendDay(startDate);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const schedule = emails.map((email, index) => {
    const tierIndex = Math.min(index, AUDIENCE_TIERS.length - 1);
    const tier = AUDIENCE_TIERS[tierIndex];
    const dateStr = sendDate.toISOString().split("T")[0];

    const entry = {
      emailId: email.id,
      subject: email.subject,
      phase: email.phase,
      sendDate: dateStr,
      sendDay: dayNames[sendDate.getDay()],
      sendTime: getSendTimeUTC(dateStr),
      audience: tier.label,
      tierIndex: tierIndex + 1,
      isFullList: tier.size >= 29000,
      status: email.status,
      alreadyScheduled: !!email.mailchimpId,
    };

    sendDate = advanceToNextSendDay(sendDate);
    return entry;
  });

  const weekSpan = schedule.length > 0
    ? Math.ceil((new Date(schedule[schedule.length - 1].sendDate).getTime() - new Date(schedule[0].sendDate).getTime()) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  return NextResponse.json({
    preview: true,
    message: "PREVIEW — 3x/week (Mon/Wed/Fri) with audience ramp-up. POST with { confirmed: true } to create campaigns in Mailchimp.",
    cadence: "3x per week (Mon / Wed / Fri)",
    totalToSchedule: schedule.length,
    alreadyScheduled: schedule.filter((s) => s.alreadyScheduled).length,
    weekSpan,
    firstSend: schedule[0]?.sendDate,
    lastSend: schedule[schedule.length - 1]?.sendDate,
    schedule,
  });
}

/**
 * POST /api/mailchimp/schedule-all
 * Creates and schedules ALL remaining emails in Mailchimp.
 * 3x/week with audience tier ramp-up for first 6 emails.
 *
 * Body: { confirmed: true, startDate?: "2026-03-19" }
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { confirmed, startDate: startDateStr } = body;

  if (!confirmed) {
    return NextResponse.json({
      error: "Safety check: include { confirmed: true } to schedule all emails. GET this endpoint first to preview.",
    }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Get all unpublished emails
    const emails = await prisma.email.findMany({
      where: { status: { not: "published" } },
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
    });

    if (emails.length === 0) {
      return NextResponse.json({ error: "No emails to schedule — all are already published." }, { status: 400 });
    }

    // Default start: tomorrow
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() + 1);
    const startDate = startDateStr ? new Date(startDateStr) : defaultStart;

    let sendDate = nextSendDay(startDate);
    const results = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const dateStr = sendDate.toISOString().split("T")[0];
      const sendTime = getSendTimeUTC(dateStr);
      const tierIndex = Math.min(i, AUDIENCE_TIERS.length - 1);
      const tier = AUDIENCE_TIERS[tierIndex];

      try {
        // Skip if already has a Mailchimp campaign
        if (email.mailchimpId) {
          results.push({
            emailId: email.id,
            subject: email.subject,
            sendDate: dateStr,
            ok: false,
            skipped: true,
            reason: `Already has campaign ${email.mailchimpId}`,
          });
          sendDate = advanceToNextSendDay(sendDate);
          continue;
        }

        // All emails go to full list — sender reputation already established
        // (email-01 sent to 29K on March 8th with 15.8% open rate)
        const segmentId: number | null = null;

        // Create campaign
        const campaignConfig: Record<string, unknown> = {
          type: "regular",
          recipients: segmentId
            ? { list_id: LIST_ID, segment_opts: { saved_segment_id: segmentId } }
            : { list_id: LIST_ID },
          settings: {
            subject_line: email.subject,
            preview_text: email.preview || "",
            title: `Warmup ${i + 1}/${emails.length} — ${email.subject}`,
            from_name: "Kirsten at Conceivable",
            reply_to: "kirsten@conceivable.com",
          },
        };

        const campaign = await mc.campaigns.create(campaignConfig);
        const campaignId = campaign.id;

        // Set HTML content
        const htmlBody = textToHtml(email.body);
        await mc.campaigns.setContent(campaignId, { html: htmlBody });

        // Schedule it
        await mc.campaigns.schedule(campaignId, {
          schedule_time: sendTime,
        });

        // Update DB
        await prisma.email.update({
          where: { id: email.id },
          data: {
            mailchimpId: campaignId,
            scheduledDate: dateStr,
            scheduledSegment: tier.size >= 29000 ? "Full list" : tier.label,
          },
        });

        results.push({
          emailId: email.id,
          subject: email.subject,
          sendDate: dateStr,
          sendTime,
          audience: tier.label,
          tier: tierIndex + 1,
          campaignId,
          segmentId,
          ok: true,
        });

        // Small delay to avoid Mailchimp rate limits
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to schedule "${email.subject}":`, msg);
        results.push({
          emailId: email.id,
          subject: email.subject,
          sendDate: dateStr,
          ok: false,
          error: msg,
        });
      }

      sendDate = advanceToNextSendDay(sendDate);
    }

    const scheduled = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok && !("skipped" in r));
    const skipped = results.filter((r) => "skipped" in r);

    return NextResponse.json({
      ok: true,
      message: `${scheduled.length} emails scheduled in Mailchimp (3x/week, Mon/Wed/Fri). ${failed.length} failed. ${skipped.length} skipped (already scheduled).`,
      scheduled: scheduled.length,
      failed: failed.length,
      skipped: skipped.length,
      firstSend: scheduled[0]?.sendDate,
      lastSend: scheduled[scheduled.length - 1]?.sendDate,
      results,
    });
  } catch (err) {
    console.error("Schedule-all error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to schedule emails" },
      { status: 500 }
    );
  }
}
