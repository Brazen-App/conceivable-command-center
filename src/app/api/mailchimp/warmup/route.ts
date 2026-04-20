import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LAUNCH_EMAILS } from "@/lib/data/launch-emails";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

function buildWarmupHtml(body: string): string {
  const paragraphs = body
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="font-size:17px;line-height:1.8;margin:0 0 20px;color:#2A2828;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:#F9F7F0;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F0;">
<tr><td align="center" style="padding:24px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#5A6FFF;height:6px;"></td></tr>
<tr><td style="padding:40px 36px 32px;">
${paragraphs}
</td></tr>
<tr><td style="padding:20px 36px 32px;border-top:1px solid #eee;">
<p style="font-size:12px;line-height:1.5;margin:0;color:#999;text-align:center;">
Conceivable &mdash; Science-backed fertility health, personalized for you.<br>
<a href="*|UNSUB|*" style="color:#999;text-decoration:underline;">Unsubscribe</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export async function GET() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey || !serverPrefix) return NextResponse.json({ configured: false, campaigns: [] });

  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = `Bearer ${apiKey}`;

  const res = await fetch(
    `${base}/campaigns?type=regular&status=draft&count=100&sort_field=create_time&sort_dir=DESC`,
    { headers: { Authorization: auth } }
  );
  if (!res.ok) return NextResponse.json({ configured: true, campaigns: [] });

  const data = await res.json();
  const warmup = (data.campaigns || [])
    .filter((c: { settings?: { title?: string } }) => c.settings?.title?.startsWith("Warmup —"))
    .map((c: { id: string; settings?: { title?: string; subject_line?: string }; status: string; web_id?: number }) => ({
      id: c.id,
      title: c.settings?.title,
      subject: c.settings?.subject_line,
      status: c.status,
      webId: c.web_id,
    }));

  return NextResponse.json({ configured: true, campaigns: warmup });
}

export async function POST() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey || !serverPrefix) return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });

  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = `Bearer ${apiKey}`;

  let emails = await prisma.email.findMany({
    where: { flow: "launch" },
    orderBy: [{ week: "asc" }, { sequence: "asc" }],
  });

  // Fall back to static data if DB is empty
  if (emails.length === 0) {
    emails = LAUNCH_EMAILS.map(e => ({
      ...e,
      flow: "launch",
      delayDays: null,
      delayHours: null,
      metrics: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as typeof emails;
  }

  if (emails.length === 0) return NextResponse.json({ error: "No warmup emails found" }, { status: 404 });

  const results: { subject: string; campaignId: string | null; error: string | null }[] = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    const createRes = await fetch(`${base}/campaigns`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "regular",
        recipients: { list_id: LIST_ID },
        settings: {
          title: `Warmup — ${String(i + 1).padStart(2, "0")} ${email.subject}`,
          subject_line: email.subject,
          preview_text: email.preview || "",
          from_name: "Kirsten at Conceivable",
          reply_to: "kirsten@conceivable.com",
          to_name: "*|IF:FNAME|**|FNAME|**|ELSE:|*there*|END:IF|*",
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      results.push({ subject: email.subject, campaignId: null, error: JSON.stringify(err) });
      continue;
    }

    const campaign = await createRes.json();
    const campaignId = campaign.id;

    const contentRes = await fetch(`${base}/campaigns/${campaignId}/content`, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ html: buildWarmupHtml(email.body) }),
    });

    results.push({
      subject: email.subject,
      campaignId,
      error: contentRes.ok ? null : "Content upload failed",
    });
  }

  const created = results.filter(r => r.campaignId && !r.error).length;
  return NextResponse.json({ success: true, created, total: emails.length, results });
}
