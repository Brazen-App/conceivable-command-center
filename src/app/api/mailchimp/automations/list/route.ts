import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const res = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/automations?count=100`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: "Mailchimp error", detail: err }, { status: 500 });
  }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const automations = (data.automations || []).map((a: any) => ({
    id: a.id,
    title: a.settings?.title,
    status: a.status,
    emailsSent: a.emails_sent,
  }));

  return NextResponse.json({ automations });
}
