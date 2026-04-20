import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const LIST_ID = "3c920d5bed";

// Send every 2 days
const INTERVAL_DAYS = 2;

function nextSendDay(from: Date): Date {
  return new Date(from);
}

function advanceToNextSendDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + INTERVAL_DAYS);
  return d;
}

function textToHtml(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  const htmlParagraphs = paragraphs.map((para) => {
    const withBreaks = para.split("\n").map((l) => l.trim()).filter((l) => l.length > 0).join("<br>\n");
    return `<p style="margin: 0 0 16px 0; line-height: 1.6;">${withBreaks}</p>`;
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#2A2828;background-color:#F9F7F0;margin:0;padding:0}.container{max-width:600px;margin:0 auto;padding:40px 24px;background-color:#fff}p{margin:0 0 16px 0;line-height:1.6}a{color:#5A6FFF}</style></head><body><div class="container">${htmlParagraphs.join("")}</div></body></html>`;
}

// Send time: 10am EST = 15:00 UTC (slight variation by day for natural feel)
function getSendTimeUTC(dateStr: string): string {
  const date = new Date(dateStr + "T15:00:00Z");
  const day = date.getUTCDay();
  if (day === 5) date.setUTCHours(15, 30, 0, 0); // Fri 10:30am EST
  else date.setUTCHours(15, 0, 0, 0); // Mon/Wed 10:00am EST
  return date.toISOString();
}

/**
 * GET /api/mailchimp/schedule-all
 * Preview the schedule (safe, read-only).
 */
export async function GET() {
  const emails = await prisma.email.findMany({
    where: { status: { in: ["approved", "pending"] } },
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
    select: { id: true, subject: true, week: true, sequence: true, phase: true, status: true, mailchimpId: true },
  });

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  let sendDate = nextSendDay(defaultStart);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const schedule = emails.map((email) => {
    const dateStr = sendDate.toISOString().split("T")[0];
    const entry = {
      emailId: email.id,
      subject: email.subject,
      phase: email.phase,
      status: email.status,
      sendDate: dateStr,
      sendDay: dayNames[sendDate.getDay()],
      sendTime: getSendTimeUTC(dateStr),
      audience: "Full list (~29,000)",
      alreadyScheduled: !!email.mailchimpId,
    };
    sendDate = advanceToNextSendDay(sendDate);
    return entry;
  });

  return NextResponse.json({
    preview: true,
    message: "PREVIEW — every 2 days to full list. POST with { confirmed: true } to create campaigns.",
    cadence: "Every 2 days at 10am EST",
    totalToSchedule: schedule.length,
    alreadyScheduled: schedule.filter((s) => s.alreadyScheduled).length,
    firstSend: schedule[0]?.sendDate,
    lastSend: schedule[schedule.length - 1]?.sendDate,
    schedule,
  });
}

/**
 * POST /api/mailchimp/schedule-all
 *
 * Creates Mailchimp campaigns and SCHEDULES them (not immediate send).
 * All emails go to full list. Mon/Wed/Fri at 10am EST.
 *
 * Body: { confirmed: true, startDate?: "2026-03-14" }
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SAFETY:                                                    ║
 * ║  - Requires { confirmed: true }                             ║
 * ║  - Only schedules emails with status "approved"             ║
 * ║  - Skips emails that already have a mailchimpId             ║
 * ║  - Uses mc.campaigns.schedule() NOT mc.campaigns.send()     ║
 * ║  - All campaigns are SCHEDULED, not sent immediately        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
/**
 * POST /api/mailchimp/schedule-all
 *
 * Creates Mailchimp campaigns and SCHEDULES them (not immediate send).
 * All emails go to full list. Mon/Wed/Fri at 10am EST.
 *
 * Body: { confirmed: true, startDate?: "2026-04-07" }
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SAFETY:                                                    ║
 * ║  - Requires { confirmed: true }                             ║
 * ║  - Only schedules emails with status "approved"             ║
 * ║  - Skips emails that already have a mailchimpId             ║
 * ║  - Uses mc.campaigns.schedule() NOT mc.campaigns.send()     ║
 * ║  - All campaigns are SCHEDULED, not sent immediately        ║
 * ╚══════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.confirmed) {
    return NextResponse.json(
      { error: "Safety check: POST requires { confirmed: true } in body. Use GET to preview first." },
      { status: 400 }
    );
  }

  const mc = getClient();

  // Only schedule approved emails that haven't already been scheduled
  const emails = await prisma.email.findMany({
    where: { status: "approved", mailchimpId: null },
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  if (emails.length === 0) {
    return NextResponse.json({ message: "No approved emails to schedule. Either all are already scheduled or none are approved.", scheduled: 0 });
  }

  const startDate = body.startDate ? new Date(body.startDate) : new Date();
  startDate.setDate(startDate.getDate() + 1);
  let sendDate = nextSendDay(startDate);

  const results: { emailId: string; subject: string; campaignId: string | null; sendDate: string; error: string | null }[] = [];

  for (const email of emails) {
    const dateStr = sendDate.toISOString().split("T")[0];
    const sendTime = getSendTimeUTC(dateStr);

    try {
      // Create campaign
      const campaign = await (mc.campaigns as any).create({
        type: "regular",
        recipients: { list_id: LIST_ID },
        settings: {
          title: `Warmup — ${String(email.week).padStart(2, "0")}.${email.sequence} ${email.subject}`,
          subject_line: email.subject,
          preview_text: email.preview || "",
          from_name: "Kirsten at Conceivable",
          reply_to: "kirsten@conceivable.com",
          to_name: "*|FNAME|*",
        },
      });

      const campaignId = campaign.id;

      // Upload content
      const html = textToHtml(email.body);
      await (mc.campaigns as any).setContent(campaignId, { html });

      // Schedule (NOT send)
      await (mc.campaigns as any).schedule(campaignId, {
        schedule_time: sendTime,
      });

      // Update DB with mailchimpId and scheduled date
      await prisma.email.update({
        where: { id: email.id },
        data: { mailchimpId: campaignId, scheduledDate: dateStr, status: "published" },
      });

      results.push({ emailId: email.id, subject: email.subject, campaignId, sendDate: dateStr, error: null });
    } catch (err) {
      results.push({
        emailId: email.id,
        subject: email.subject,
        campaignId: null,
        sendDate: dateStr,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    sendDate = advanceToNextSendDay(sendDate);
  }

  const scheduled = results.filter((r) => r.campaignId && !r.error).length;
  const failed = results.filter((r) => r.error).length;

  console.log(`[schedule-all] Scheduled ${scheduled}/${emails.length} campaigns. ${failed} failed.`);

  return NextResponse.json({
    success: failed === 0,
    scheduled,
    failed,
    total: emails.length,
    firstSend: results[0]?.sendDate,
    lastSend: results[results.length - 1]?.sendDate,
    results,
  });
}
