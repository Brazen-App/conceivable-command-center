import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AUTOMATION_TITLE = "Conceivable — Quiz Nurture Sequence";

async function resolveWorkflowId(base: string, auth: string): Promise<string | null> {
  const envId = process.env.MAILCHIMP_QUIZ_NURTURE_WORKFLOW_ID;
  if (envId) return envId;
  const res = await fetch(`${base}/automations?count=100`, { headers: { Authorization: auth } });
  if (!res.ok) return null;
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = (data.automations || []).find((a: any) => a.settings?.title === AUTOMATION_TITLE);
  return match?.id || null;
}

export async function GET() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ configured: false, emails: [] });
  }

  const auth = `Bearer ${apiKey}`;
  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;

  const workflowId = await resolveWorkflowId(base, auth);
  if (!workflowId) {
    return NextResponse.json({ configured: false, emails: [] });
  }

  const res = await fetch(`${base}/automations/${workflowId}/emails`, {
    headers: { Authorization: auth },
  });

  if (!res.ok) {
    return NextResponse.json({ configured: true, emails: [], error: "Failed to fetch automation emails" });
  }

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emails = (data.emails || []).map((e: any) => ({
    id: e.id,
    subject: e.settings?.subject_line || "",
    position: e.position,
    emailsSent: e.emails_sent || 0,
    openRate: e.report_summary?.open_rate ?? null,
    clickRate: e.report_summary?.click_rate ?? null,
    uniqueOpens: e.report_summary?.unique_opens ?? 0,
    clicks: e.report_summary?.subscriber_clicks ?? 0,
    status: e.status,
  }));

  // Sort by position in the sequence
  emails.sort((a: { position: number }, b: { position: number }) => a.position - b.position);

  return NextResponse.json({ configured: true, emails });
}
