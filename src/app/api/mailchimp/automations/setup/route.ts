import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getClient } from "@/lib/mailchimp";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Automation definitions — which DB flow becomes which Mailchimp automation
const AUTOMATION_DEFS = [
  {
    flow: "launch",
    phases: ["re-engagement", "education"],
    title: "Conceivable — Warmup Sequence",
    delayDays: 3,
    description: "Re-engagement + education emails, every 3 days",
  },
  {
    flow: "post-purchase",
    phases: null, // all phases in this flow
    title: "Conceivable — Post-Purchase Onboarding",
    delayDays: null, // use email's own delayDays
    description: "Triggered after purchase",
  },
  {
    flow: "post-download",
    phases: null,
    title: "Conceivable — Post-App Download",
    delayDays: null,
    description: "Triggered after app download",
  },
  {
    flow: "post-download-nudge",
    phases: null,
    title: "Conceivable — App Setup Nudge",
    delayDays: null,
    description: "Re-engage users who haven't completed app setup",
  },
  {
    flow: "abandoned-cart",
    phases: null,
    title: "Conceivable — Abandoned Cart Recovery",
    delayDays: null,
    description: "Cart recovery sequence",
  },
];

/**
 * POST /api/mailchimp/automations/setup
 * Creates classic automations in Mailchimp for each email flow.
 * All automations are created in PAUSED state — nothing sends.
 * Admin only.
 */
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mc = getClient() as any;

  // Get list ID
  const listsResponse = await mc.lists.getAllLists({ count: 1 });
  const listId = listsResponse?.lists?.[0]?.id;
  if (!listId) {
    return NextResponse.json({ error: "No Mailchimp list found" }, { status: 404 });
  }

  // Get all emails from DB
  const allEmails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  const results: {
    flow: string;
    title: string;
    automationId: string | null;
    emailsAdded: number;
    error: string | null;
  }[] = [];

  for (const def of AUTOMATION_DEFS) {
    try {
      // Filter emails for this automation
      let flowEmails = allEmails.filter((e) => e.flow === def.flow);
      if (def.phases) {
        flowEmails = flowEmails.filter((e) => def.phases!.includes(e.phase));
      }

      if (flowEmails.length === 0) {
        results.push({
          flow: def.flow,
          title: def.title,
          automationId: null,
          emailsAdded: 0,
          error: "No emails found for this flow",
        });
        continue;
      }

      // Create the automation via Mailchimp REST API directly
      // The SDK's automations.create has issues with trigger_settings validation,
      // so we use the raw API call
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
      const apiKey = process.env.MAILCHIMP_API_KEY;

      const createRes = await fetch(
        `https://${serverPrefix}.api.mailchimp.com/3.0/automations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipients: {
              list_id: listId,
            },
            trigger_settings: {
              workflow_type: "recurringEvent",
            },
            settings: {
              title: def.title,
              from_name: "Kirsten at Conceivable",
              reply_to: "kirsten@conceivable.com",
            },
          }),
        }
      );

      if (!createRes.ok) {
        const errBody = await createRes.json();
        throw new Error(`${createRes.status}: ${JSON.stringify(errBody)}`);
      }

      const automation = await createRes.json();

      const automationId = automation.id;
      let emailsAdded = 0;

      // Add each email to the automation with delays
      for (let i = 0; i < flowEmails.length; i++) {
        const email = flowEmails[i];

        // Determine delay
        let delayAmount = 3; // default 3 days for warmup
        let delayType = "day";

        if (def.delayDays !== null) {
          // Fixed delay (warmup = 3 days between each)
          delayAmount = i === 0 ? 0 : def.delayDays;
        } else if (email.delayHours != null && email.delayHours > 0) {
          delayAmount = email.delayHours;
          delayType = "hour";
        } else if (email.delayDays != null) {
          delayAmount = i === 0 ? 0 : email.delayDays;
          delayType = "day";
        }

        try {
          const addRes = await fetch(
            `https://${serverPrefix}.api.mailchimp.com/3.0/automations/${automationId}/emails`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                settings: {
                  subject_line: email.subject,
                  preview_text: email.preview,
                  from_name: "Kirsten at Conceivable",
                  reply_to: "kirsten@conceivable.com",
                },
                delay: {
                  amount: delayAmount,
                  type: delayType,
                  direction: "after",
                  action: i === 0 ? "signup" : "previous_campaign_sent",
                },
              }),
            }
          );
          if (addRes.ok) {
            emailsAdded++;
          } else {
            const addErr = await addRes.json();
            console.error(`Failed to add email "${email.subject}":`, JSON.stringify(addErr));
          }
        } catch (emailErr) {
          console.error(`Failed to add email "${email.subject}" to automation:`, emailErr);
        }
      }

      results.push({
        flow: def.flow,
        title: def.title,
        automationId,
        emailsAdded,
        error: null,
      });
    } catch (err) {
      const errDetail = err instanceof Error ? err.message : JSON.stringify(err);
      console.error(`Failed to create automation for ${def.flow}:`, errDetail);
      // Try to get more detail from Mailchimp error
      let fullError = errDetail;
      if (err && typeof err === "object" && "response" in err) {
        try {
          const errBody = (err as { response?: { body?: unknown } }).response?.body;
          if (errBody) fullError = JSON.stringify(errBody);
        } catch { /* */ }
      }
      if (err && typeof err === "object" && "status" in err) {
        fullError = `${(err as { status: number }).status}: ${fullError}`;
      }
      results.push({
        flow: def.flow,
        title: def.title,
        automationId: null,
        emailsAdded: 0,
        error: fullError,
      });
    }
  }

  const created = results.filter((r) => r.automationId).length;
  const failed = results.filter((r) => r.error).length;

  return NextResponse.json({
    success: true,
    message: `Created ${created} automations (${failed} failed). All are PAUSED — nothing will send.`,
    results,
    listId,
  });
}

/**
 * GET /api/mailchimp/automations/setup
 * Preview what would be created. Admin only.
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const allEmails = await prisma.email.findMany({
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
    select: { id: true, flow: true, phase: true, subject: true, delayDays: true, delayHours: true, week: true, sequence: true },
  });

  const preview = AUTOMATION_DEFS.map((def) => {
    let flowEmails = allEmails.filter((e) => e.flow === def.flow);
    if (def.phases) {
      flowEmails = flowEmails.filter((e) => def.phases!.includes(e.phase));
    }
    return {
      flow: def.flow,
      title: def.title,
      description: def.description,
      emailCount: flowEmails.length,
      emails: flowEmails.map((e, i) => ({
        subject: e.subject,
        phase: e.phase,
        delay: def.delayDays !== null
          ? (i === 0 ? "Immediate" : `${def.delayDays} days after previous`)
          : (e.delayHours ? `${e.delayHours} hours` : e.delayDays ? `${e.delayDays} days` : "Immediate"),
      })),
    };
  });

  return NextResponse.json({ preview });
}
