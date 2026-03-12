import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Warmup Schedule Strategy ──────────────────────────────────────
//
// 29K cold list → gradual warmup with expanding audience segments
//
// Send cadence: 3x per week (Mon / Wed / Fri) at 10am EST
// Audience ramp: 3K → 5K → 7K → 10K → 15K → 25K → full list (29K)
// Watch open rates at each tier before expanding
//

export const dynamic = "force-dynamic";

interface ScheduleEntry {
  emailId: string;
  week: number;
  sequence: number;
  subject: string;
  phase: string;
  segment: string;
  audienceSize: string;
  scheduledDate: string;
  scheduledDay: string;
  sendTime: string;
  status: "pending" | "approved" | "scheduled" | "sent";
  warmupNote: string;
  audienceTier: number;
}

// Audience ramp tiers — each tier stays until open rates look good
const AUDIENCE_TIERS = [
  { size: 3000, label: "~3,000", segment: "Top 10% — highest openers", note: "Start small. Best openers first to build sender reputation. Watch for 30%+ open rate before expanding." },
  { size: 5000, label: "~5,000", segment: "Top 17% — recent openers + clickers", note: "Expanding slowly. Need 25%+ open rate here to continue." },
  { size: 7000, label: "~7,000", segment: "Top 25% — engaged quarter", note: "Quarter of list. ISPs should trust us by now. Target 22%+ open rate." },
  { size: 10000, label: "~10,000", segment: "Top 35% — engaged third", note: "Expanding to a third. Watch deliverability closely." },
  { size: 15000, label: "~15,000", segment: "Top 50% — engaged half", note: "Half the list. If open rates hold above 18%, we're golden." },
  { size: 25000, label: "~25,000", segment: "Most of list — minus hard bounces + long-dormant", note: "Nearly full list. Skip only addresses that have never opened anything." },
  { size: 29000, label: "~29,000", segment: "Full list", note: "Full list is warm. Sender reputation established." },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Send days: Monday (1), Wednesday (3), Friday (5)
const SEND_DAYS = [1, 3, 5];

/**
 * Find the next send date on or after the given date (Mon/Wed/Fri).
 */
function nextSendDay(from: Date): Date {
  const d = new Date(from);
  while (!SEND_DAYS.includes(d.getDay())) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

/**
 * Advance to the following send day after the given date.
 */
function advanceToNextSendDay(from: Date): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  return nextSendDay(d);
}

function buildWarmupSchedule(
  startDate: Date,
  emails: Array<{
    id: string;
    week: number;
    sequence: number;
    subject: string;
    phase: string;
    segment: string | null;
    status: string;
  }>
): ScheduleEntry[] {
  const schedule: ScheduleEntry[] = [];

  // Sort emails by week and sequence
  const sorted = [...emails].sort((a, b) => a.week - b.week || a.sequence - b.sequence);

  // Start on the first Mon/Wed/Fri on or after startDate
  let sendDate = nextSendDay(new Date(startDate));

  sorted.forEach((email, index) => {
    // 1 email per tier, then full list for the rest
    const tierIndex = Math.min(index, AUDIENCE_TIERS.length - 1);
    const tier = AUDIENCE_TIERS[tierIndex];

    const dateStr = sendDate.toISOString().split("T")[0];
    const dayName = DAY_NAMES[sendDate.getDay()];

    schedule.push({
      emailId: email.id,
      week: email.week,
      sequence: email.sequence,
      subject: email.subject,
      phase: email.phase,
      segment: tier.segment,
      audienceSize: tier.label,
      scheduledDate: dateStr,
      scheduledDay: dayName,
      sendTime: "10:00 AM EST",
      status: email.status as ScheduleEntry["status"],
      warmupNote: tier.note,
      audienceTier: tierIndex + 1,
    });

    // Advance to next Mon/Wed/Fri
    sendDate = advanceToNextSendDay(sendDate);
  });

  return schedule;
}

// GET — view the warmup schedule (does NOT send anything)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get("startDate");

  // Default start: tomorrow
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 1);
  const startDate = startDateParam ? new Date(startDateParam) : defaultStart;

  const emails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
    select: {
      id: true,
      week: true,
      sequence: true,
      subject: true,
      phase: true,
      segment: true,
      status: true,
    },
  });

  const schedule = buildWarmupSchedule(startDate, emails);

  const totalEmails = schedule.length;
  const firstSend = schedule[0]?.scheduledDate;
  const lastSend = schedule[schedule.length - 1]?.scheduledDate;

  // Calculate how many weeks the schedule spans
  const daySpan = schedule.length > 0
    ? Math.ceil((new Date(lastSend).getTime() - new Date(firstSend).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const weekSpan = Math.ceil(daySpan / 7);

  return NextResponse.json({
    strategy: {
      name: "Fast Warmup — 3x/Week, Audience Ramp-Up",
      description:
        "Send Mon/Wed/Fri at 10am EST. First 6 emails ramp audience (3K → 5K → 7K → 10K → 15K → 25K), then full list for remaining emails. Watch open rates at each tier.",
      totalEmails,
      daySpan,
      weekSpan,
      firstSend,
      lastSend,
      startDate: startDate.toISOString().split("T")[0],
      cadence: "3x per week (Mon / Wed / Fri)",
      sendTime: "10:00 AM EST",
    },
    audienceProgression: AUDIENCE_TIERS.map((tier, i) => ({
      tier: i + 1,
      audience: `${tier.label} (${tier.segment})`,
      emails: i < AUDIENCE_TIERS.length - 1 ? "1 email" : `${Math.max(1, totalEmails - AUDIENCE_TIERS.length + 1)} emails`,
      purpose: tier.note,
    })),
    schedule,
    warning:
      "This is a PREVIEW only. No emails will be sent until you confirm the schedule via POST. Watch open rates at each tier — if they drop below 15%, pause and clean the segment before expanding.",
  });
}

// POST — confirm and lock the schedule (still doesn't send — saves dates to DB)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { confirmed, startDate } = body;

  if (!confirmed) {
    return NextResponse.json(
      {
        error: "You must include { confirmed: true } to lock the schedule. This is a safety check.",
        hint: "GET this endpoint first to preview the schedule, then POST with { confirmed: true, startDate: 'YYYY-MM-DD' }",
      },
      { status: 400 }
    );
  }

  const start = startDate ? new Date(startDate) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })();

  const emails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  const schedule = buildWarmupSchedule(start, emails);

  const updates = [];
  for (const entry of schedule) {
    const email = emails.find((e) => e.id === entry.emailId);
    if (email && email.status !== "published") {
      await prisma.email.update({
        where: { id: entry.emailId },
        data: {
          scheduledDate: entry.scheduledDate,
          scheduledSegment: entry.segment,
        },
      });
      updates.push({
        emailId: entry.emailId,
        subject: entry.subject,
        scheduledDate: entry.scheduledDate,
        segment: entry.segment,
        audienceSize: entry.audienceSize,
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: `Schedule locked for ${updates.length} emails. 3x/week (Mon/Wed/Fri) starting ${start.toISOString().split("T")[0]}. Watch open rates at each audience tier.`,
    lockedSchedule: updates,
    nextStep:
      "Use POST /api/mailchimp/schedule-all with { confirmed: true } to create all campaigns in Mailchimp and schedule them.",
  });
}
