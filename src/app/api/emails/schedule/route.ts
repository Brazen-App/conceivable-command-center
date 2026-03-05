import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import mailchimp from "@/lib/mailchimp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mc = mailchimp as any;

interface ScheduleBody {
  emailIds: string[];
  segment: string;
  sendTime: "optimal" | "immediate" | "custom";
  customTime?: string;
  abTest?: {
    enabled: boolean;
    variantSubject?: string;
    splitPercent: number;
  };
}

export async function POST(req: NextRequest) {
  const body: ScheduleBody = await req.json();
  const { emailIds, segment, sendTime, customTime, abTest } = body;

  if (!emailIds || emailIds.length === 0) {
    return NextResponse.json(
      { error: "No email IDs provided" },
      { status: 400 }
    );
  }

  // Fetch the emails from DB
  const emails = await prisma.email.findMany({
    where: { id: { in: emailIds } },
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  if (emails.length === 0) {
    return NextResponse.json(
      { error: "No matching emails found" },
      { status: 404 }
    );
  }

  // Verify all emails are approved (compliance check is advisory, CEO can override)
  const notApproved = emails.filter(
    (e) => e.status !== "approved" && e.status !== "pending"
  );
  if (notApproved.length > 0) {
    return NextResponse.json(
      {
        error: `${notApproved.length} email(s) already published or in unexpected state`,
        notReadyIds: notApproved.map((e) => e.id),
      },
      { status: 400 }
    );
  }

  // Auto-approve any pending emails in the batch (CEO is authorizing by scheduling)
  const pendingIds = emails.filter((e) => e.status === "pending").map((e) => e.id);
  if (pendingIds.length > 0) {
    await prisma.email.updateMany({
      where: { id: { in: pendingIds } },
      data: { status: "approved", approvedAt: new Date().toISOString() },
    });
  }

  // Check Mailchimp credentials
  if (!process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX) {
    // In mock mode, just update the DB status
    const updated = await prisma.email.updateMany({
      where: { id: { in: emailIds } },
      data: {
        status: "published",
        publishedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      mock: true,
      message: `${updated.count} email(s) marked as published (Mailchimp not configured — add MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX to enable real scheduling)`,
      scheduled: emailIds,
    });
  }

  // Real Mailchimp scheduling
  const results = [];

  for (const email of emails) {
    try {
      // Get the list ID (use first list)
      const listsResponse = await mc.lists.getAllLists({ count: 1 });
      const listId = (listsResponse as { lists?: Array<{ id: string }> }).lists?.[0]?.id;

      if (!listId) {
        results.push({
          emailId: email.id,
          ok: false,
          error: "No Mailchimp list found",
        });
        continue;
      }

      // Create campaign
      const campaignData: Record<string, unknown> = {
        type: "regular",
        recipients: { list_id: listId },
        settings: {
          subject_line: email.subject,
          preview_text: email.preview,
          from_name: "Kirsten at Conceivable",
          reply_to: "kirsten@conceivable.com",
        },
      };

      const campaign = await mc.campaigns.create(campaignData);
      const campaignId = (campaign as { id: string }).id;

      // Set campaign content
      await mc.campaigns.setContent(campaignId, {
        plain_text: email.body,
      });

      // Schedule or send
      if (sendTime === "immediate") {
        await mc.campaigns.send(campaignId);
      } else if (sendTime === "custom" && customTime) {
        await mc.campaigns.schedule(campaignId, {
          schedule_time: new Date(customTime).toISOString(),
        });
      } else {
        // Optimal: schedule for next Tuesday at 10 AM EST
        const now = new Date();
        const nextTuesday = new Date(now);
        const daysUntilTuesday = (2 - now.getDay() + 7) % 7 || 7;
        nextTuesday.setDate(now.getDate() + daysUntilTuesday);
        nextTuesday.setHours(10, 0, 0, 0);

        await mc.campaigns.schedule(campaignId, {
          schedule_time: nextTuesday.toISOString(),
        });
      }

      // Update DB with Mailchimp campaign ID
      await prisma.email.update({
        where: { id: email.id },
        data: {
          status: "published",
          publishedAt: new Date().toISOString(),
          mailchimpId: campaignId,
        },
      });

      results.push({
        emailId: email.id,
        ok: true,
        campaignId,
      });
    } catch (err) {
      results.push({
        emailId: email.id,
        ok: false,
        error: err instanceof Error ? err.message : "Unknown Mailchimp error",
      });
    }
  }

  return NextResponse.json({
    mock: false,
    results,
    scheduled: results.filter((r) => r.ok).map((r) => r.emailId),
    failed: results.filter((r) => !r.ok).map((r) => r.emailId),
  });
}
