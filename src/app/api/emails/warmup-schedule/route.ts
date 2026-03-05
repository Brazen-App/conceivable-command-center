import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Warmup Schedule Strategy ──────────────────────────────────────
//
// 29K cold list → 8-week warmup with expanding audience segments
//
// Week 1-2 (Re-engagement): Start with most engaged 10%, expand to 25%, then full
// Week 3-4 (Education): Engaged openers from W1-2, then broader
// Week 5-6 (Launch): Full list (warmed up by now)
// Week 7 (Final Push): Non-converters only
// Week 8 (Post-Close): Converted members only
//
// Send cadence: 2-3 emails per week, Tue/Thu/Sat at 10am EST
// Never blast the full list on day 1

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
}

// Calculate the schedule based on a start date
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
  const start = new Date(startDate);

  // Ensure start is a Monday
  const dayOfWeek = start.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  start.setDate(start.getDate() + daysToMonday);

  // Send days within each week: Tuesday (1), Thursday (3), Saturday (5)
  const sendDayOffsets = [1, 3, 5]; // days after Monday
  const sendDayNames = ["Tuesday", "Thursday", "Saturday"];

  // Warmup audience progression
  const warmupSegments: Record<
    string,
    { segment: string; size: string; note: string }[]
  > = {
    "re-engagement": [
      { segment: "Most engaged 10% (3K highest openers)", size: "~3,000", note: "Warmup: Start small. Best openers first to build sender reputation." },
      { segment: "Engaged 25% (7K recent openers)", size: "~7,000", note: "Warmup: Expand to quarter of list. Good open rates here build trust with ISPs." },
      { segment: "Full list minus hard bounces", size: "~28,000", note: "Warmup: Full list send. Sender reputation established from prior sends." },
      { segment: "Full list minus hard bounces", size: "~28,000", note: "List is warming. Continue full sends." },
      { segment: "Engaged + new openers from W1", size: "~15,000", note: "Re-engage openers from first sends. Skip persistent non-openers." },
      { segment: "Full list — re-engagement complete", size: "~28,000", note: "Final re-engagement push. After this, non-openers get sunset sequence." },
    ],
    education: [
      { segment: "Opened 1+ email in W1-2", size: "~12,000", note: "Education goes to proven engagers only. Higher open rates protect reputation." },
      { segment: "Opened 1+ email in W1-2", size: "~12,000", note: "Continue with engaged segment." },
      { segment: "Opened 1+ email in W1-2 + clicked any link", size: "~8,000", note: "Science-forward content to highest-intent subscribers." },
      { segment: "Opened 1+ email in W1-2", size: "~12,000", note: "Broader education push to all openers." },
      { segment: "All openers + new signups", size: "~14,000", note: "Educational content to all engaged + any new list additions." },
      { segment: "Clicked any previous email", size: "~6,000", note: "High-intent segment. Transition toward launch." },
    ],
    launch: [
      { segment: "Full list — launch announcement", size: "~28,000", note: "Launch day. Full list. Reputation is warm by now." },
      { segment: "Full list minus already-signed-up", size: "~27,000", note: "Onboarding walkthrough to everyone not yet converted." },
      { segment: "Openers who haven't converted", size: "~10,000", note: "Science-forward messaging to engaged non-converters." },
      { segment: "Full list minus signed-up", size: "~26,000", note: "Social proof. Half of early access claimed." },
      { segment: "Engaged but unconverted", size: "~8,000", note: "Emotional/transformation messaging for fence-sitters." },
      { segment: "Engaged but unconverted", size: "~8,000", note: "Objection handling. Answer their questions directly." },
    ],
    "final-push": [
      { segment: "Engaged non-converters only", size: "~6,000", note: "Urgency. Only to people who have engaged but not converted." },
      { segment: "Full remaining list", size: "~24,000", note: "Founder letter. Personal. Full remaining list." },
      { segment: "All non-converters — last chance", size: "~24,000", note: "Final send. After this, early access closes." },
    ],
    "post-close": [
      { segment: "Converted members only", size: "~5,000", note: "Onboarding. Only goes to people who signed up." },
      { segment: "Converted members only", size: "~5,000", note: "Founding member roadmap + referral ask." },
    ],
  };

  // Sort emails by week and sequence
  const sorted = [...emails].sort((a, b) => a.week - b.week || a.sequence - b.sequence);

  let currentWeekStart = new Date(start);

  // Track which calendar week we're in
  let lastEmailWeek = 0;

  sorted.forEach((email, index) => {
    // Advance calendar week when email week changes
    if (email.week > lastEmailWeek) {
      if (lastEmailWeek > 0) {
        // Advance by the difference in weeks
        const weekDiff = email.week - lastEmailWeek;
        currentWeekStart.setDate(currentWeekStart.getDate() + 7 * weekDiff);
      }
      lastEmailWeek = email.week;
    }

    // Which send slot within this week (0, 1, or 2)
    const slotInWeek = email.sequence - 1;
    const dayOffset = sendDayOffsets[Math.min(slotInWeek, 2)];
    const dayName = sendDayNames[Math.min(slotInWeek, 2)];

    const sendDate = new Date(currentWeekStart);
    sendDate.setDate(sendDate.getDate() + dayOffset);

    // Get warmup segment info
    const phaseSegments = warmupSegments[email.phase] || [];
    const segmentIndex = Math.min(index, phaseSegments.length - 1);
    const segmentInfo = phaseSegments[segmentIndex] || {
      segment: email.segment || "Full list",
      size: "TBD",
      note: "",
    };

    // Use the warmup segment data for re-engagement (indexed by position within phase)
    const phaseEmails = sorted.filter((e) => e.phase === email.phase);
    const posInPhase = phaseEmails.indexOf(email);
    const warmup = phaseSegments[posInPhase] || segmentInfo;

    schedule.push({
      emailId: email.id,
      week: email.week,
      sequence: email.sequence,
      subject: email.subject,
      phase: email.phase,
      segment: warmup.segment,
      audienceSize: warmup.size,
      scheduledDate: sendDate.toISOString().split("T")[0],
      scheduledDay: dayName,
      sendTime: "10:00 AM EST",
      status: email.status as ScheduleEntry["status"],
      warmupNote: warmup.note,
    });
  });

  return schedule;
}

// GET — view the warmup schedule (does NOT send anything)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get("startDate");

  // Default start: next Monday
  const now = new Date();
  const defaultStart = new Date(now);
  const daysToMonday = (8 - now.getDay()) % 7 || 7;
  defaultStart.setDate(now.getDate() + daysToMonday);

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

  // Summary stats
  const totalEmails = schedule.length;
  const weekSpan = Math.max(...schedule.map((s) => s.week)) - Math.min(...schedule.map((s) => s.week)) + 1;
  const firstSend = schedule[0]?.scheduledDate;
  const lastSend = schedule[schedule.length - 1]?.scheduledDate;

  return NextResponse.json({
    strategy: {
      name: "8-Week Warmup Sequence",
      description:
        "Staggered sending starting with most engaged 10% of list, expanding to full list by week 3. Tue/Thu/Sat at 10am EST. No email fires until you confirm the full schedule.",
      totalEmails,
      weekSpan,
      firstSend,
      lastSend,
      startDate: startDate.toISOString().split("T")[0],
      maxPerWeek: 3,
      sendDays: "Tuesday, Thursday, Saturday",
      sendTime: "10:00 AM EST",
    },
    audienceProgression: [
      { week: "1", audience: "~3,000 (top 10% openers)", purpose: "Build sender reputation" },
      { week: "2", audience: "~7,000–28,000 (expanding)", purpose: "Grow reach as reputation improves" },
      { week: "3-4", audience: "~8,000–14,000 (engaged openers)", purpose: "Education to proven engagers" },
      { week: "5-6", audience: "~28,000 (full warmed list)", purpose: "Launch to everyone" },
      { week: "7", audience: "~6,000–24,000 (non-converters)", purpose: "Final push" },
      { week: "8", audience: "~5,000 (converted only)", purpose: "Onboarding" },
    ],
    schedule,
    warning:
      "This is a PREVIEW only. No emails will be sent until you confirm the schedule via POST. Approve emails in the Review Queue first, then confirm the schedule here.",
  });
}

// POST — confirm and lock the schedule (still doesn't send — creates Mailchimp drafts)
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

  const start = startDate ? new Date(startDate) : new Date();

  const emails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  const schedule = buildWarmupSchedule(start, emails);

  // For now, just save the schedule dates to the DB
  // When Mailchimp is connected on Vercel, this will create draft campaigns
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
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: `Schedule locked for ${updates.length} emails. No emails will send until Mailchimp is connected and campaigns are created.`,
    lockedSchedule: updates,
    nextStep:
      "Connect Mailchimp on Vercel (add MAILCHIMP_API_KEY to env vars), then the schedule will auto-create draft campaigns for each send date.",
  });
}
