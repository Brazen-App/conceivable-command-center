import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F9F7F0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F0;">
<tr><td align="center" style="padding:20px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#5A6FFF;height:6px;"></td></tr>
<tr><td style="padding:40px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">Hi *|FNAME|*,</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">I've been sitting on something for a while, and today I'm just going to give it to you.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">I wrote an audiobook.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">It's called <strong>The Road to Better Fertility</strong> &mdash; and it's everything I wish someone had handed me when I started this work 25 years ago. The real stuff. Not the "eat more leafy greens" stuff.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">It's yours. Free. No catch.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">You're on this list because at some point you raised your hand and said "I want to understand my body better." This is for you.</p>
</td></tr>
<tr><td style="padding:28px 32px 0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center">
<a href="https://audiobook.conceivable.com/the-road-to-better-fertilty" style="display:inline-block;background:#5A6FFF;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:8px;">Listen Free &rarr;</a>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:28px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">I have a lot more coming your way over the next few weeks. But today &mdash; just listen.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">And if something in it resonates &mdash; reply and tell me. I read every one.</p>
</td></tr>
<tr><td style="padding:20px 32px 0;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">Sending you big love,</p>
</td></tr>
<tr><td style="padding:4px 32px 32px;">
<p style="font-size:17px;line-height:1.7;margin:0;color:#2A2828;">Kirsten</p>
</td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid #eeeeee;">
<p style="font-size:13px;line-height:1.5;margin:0;color:#999999;text-align:center;">
Conceivable &mdash; Science-backed fertility support, personalized for you.<br>
<a href="*|UNSUB|*" style="color:#999999;text-decoration:underline;">Unsubscribe</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

export async function POST() {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = `Bearer ${apiKey}`;

  const createRes = await fetch(`${base}/campaigns`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "regular",
      recipients: { list_id: LIST_ID },
      settings: {
        title: "Audiobook — The Road to Better Fertility",
        subject_line: "I wrote you something. It's free.",
        preview_text: "The road to better fertility — yours to keep.",
        from_name: "Kirsten at Conceivable",
        reply_to: "kirsten@conceivable.com",
        to_name: "*|FNAME|*",
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const campaign = await createRes.json();

  const contentRes = await fetch(`${base}/campaigns/${campaign.id}/content`, {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ html: HTML }),
  });

  if (!contentRes.ok) {
    return NextResponse.json({ error: "Campaign created but content upload failed", campaignId: campaign.id }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    campaignId: campaign.id,
    webId: campaign.web_id,
    previewUrl: `https://us17.admin.mailchimp.com/campaigns/edit?id=${campaign.web_id}`,
  });
}
