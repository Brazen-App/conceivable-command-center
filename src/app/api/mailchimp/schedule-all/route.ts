import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const LIST_ID = "3c920d5bed";

// Send days: Mon (1), Wed (3), Fri (5)
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
    message: "PREVIEW — 3x/week (Mon/Wed/Fri) to full list. POST with { confirmed: true } to create campaigns.",
    cadence: "3x per week (Mon / Wed / Fri) at 10am EST",
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
 * POST /api/mailchimp/schedule-all — DISABLED
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DISABLED — ALL EMAIL SCHEDULING/SENDING IS LOCKED DOWN        ║
 * ║  After two accidental full-list sends (March 8 and March 13,   ║
 * ║  2026), this endpoint is completely disabled.                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export async function POST(req: NextRequest) {
  console.error(
    "[BLOCKED] schedule-all POST called but ALL email sending is disabled.",
    { body: await req.json().catch(() => ({})) }
  );
  return NextResponse.json(
    {
      error: "EMAIL SENDING IS DISABLED. All email scheduling has been locked down after repeated accidental full-list sends. Contact the CEO to re-enable.",
      blocked: true,
    },
    { status: 403 }
  );
}
