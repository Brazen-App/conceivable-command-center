import { NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

interface AutomationStatus {
  id: string;
  title: string;
  status: "save" | "paused" | "sending";
  emailsSent: number;
  createTime: string;
  startTime: string | null;
  emails: {
    id: string;
    position: number;
    subject: string;
    sendTime: string | null;
    emailsSent: number;
    opensTotal: number;
    openRate: number;
    clicksTotal: number;
    clickRate: number;
  }[];
}

/**
 * GET /api/mailchimp/automations/status
 * Returns real-time automation status and performance from Mailchimp.
 * Includes email-level stats for each automation.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({
      isMock: true,
      automations: [],
      summary: {
        total: 0,
        active: 0,
        paused: 0,
        totalEmailsSent: 0,
      },
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;
    const response = await mc.automations.list({ count: 100 });
    const rawAutomations = response?.automations || [];

    const automations: AutomationStatus[] = [];

    for (const auto of rawAutomations) {
      // Fetch emails for each automation
      let emails: AutomationStatus["emails"] = [];
      try {
        const emailsResponse = await mc.automations.listAllWorkflowEmails(auto.id);
        emails = (emailsResponse?.emails || []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e: any, idx: number) => ({
            id: e.id,
            position: idx + 1,
            subject: e.settings?.subject_line || "(no subject)",
            sendTime: e.send_time || null,
            emailsSent: e.emails_sent || 0,
            opensTotal: e.report_summary?.opens || 0,
            openRate: e.report_summary?.open_rate
              ? Math.round(e.report_summary.open_rate * 1000) / 10
              : 0,
            clicksTotal: e.report_summary?.clicks || 0,
            clickRate: e.report_summary?.click_rate
              ? Math.round(e.report_summary.click_rate * 1000) / 10
              : 0,
          })
        );
      } catch {
        // Some automations may not have accessible emails
      }

      automations.push({
        id: auto.id,
        title: auto.settings?.title || "(untitled)",
        status: auto.status,
        emailsSent: auto.emails_sent || 0,
        createTime: auto.create_time,
        startTime: auto.start_time || null,
        emails,
      });
    }

    const active = automations.filter((a) => a.status === "sending").length;
    const paused = automations.filter((a) => a.status === "paused").length;
    const totalEmailsSent = automations.reduce((sum, a) => sum + a.emailsSent, 0);

    return NextResponse.json({
      isMock: false,
      automations,
      summary: {
        total: automations.length,
        active,
        paused,
        totalEmailsSent,
      },
    });
  } catch (err) {
    console.error("Automation status error:", err);
    return NextResponse.json(
      {
        isMock: true,
        automations: [],
        summary: { total: 0, active: 0, paused: 0, totalEmailsSent: 0 },
        error: err instanceof Error ? err.message : "Failed to fetch automation status",
      },
      { status: 500 }
    );
  }
}
