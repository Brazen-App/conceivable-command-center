import { NextRequest, NextResponse } from "next/server";

/**
 * Quiz nurture automation setup.
 * Creates a 4-email Mailchimp Classic Automation for quiz completers.
 * Uses *|FNAME|* and *|CART_URL|* merge tags so one automation serves all subscribers.
 *
 * After running POST, copy the returned workflowId + firstEmailId into
 * Vercel env vars:
 *   MAILCHIMP_QUIZ_NURTURE_WORKFLOW_ID
 *   MAILCHIMP_QUIZ_NURTURE_FIRST_EMAIL_ID
 *
 * Then update the quiz app's MAILCHIMP_QUIZ_NURTURE_WORKFLOW_ID +
 * MAILCHIMP_QUIZ_NURTURE_FIRST_EMAIL_ID env vars so subscribe.js can
 * enroll new quiz completers.
 */

const NURTURE_EMAILS = [
  {
    dayDelay: 1,
    subject: "I've been where you are",
    preview: "Not as a doctor. As a woman.",
    body: `<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I know what it's like to Google fertility stuff at 2am and come away more scared than when you started.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">To read one article that says you're fine and another that says your eggs are basically geriatric. (I hate that word, by the way. Your eggs are not geriatric.)</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">To smile at the baby shower and cry in the car.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">To do everything &ldquo;right&rdquo; and still feel like your body isn't cooperating.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I've sat across from thousands of women who felt exactly like this. And here's what I've learned after 25 years: the problem is almost never that something is &ldquo;wrong&rdquo; with you. It's that nobody has looked at the full picture.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Your body is sending signals every single day &mdash; through your cycle, your energy, your sleep, your stress. Most of the time, those signals are being ignored. Or worse, treated one at a time instead of as the connected system they actually are.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">That's why I do this. Not because I love supplements. Because I got tired of watching smart, strong women feel powerless about the one thing they want most.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">You're not powerless. And you're not alone in this &mdash; even though it really, really feels that way sometimes.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Just reply if you ever want to talk. I mean that.</p>`,
  },
  {
    dayDelay: 3,
    subject: "She almost didn't try either",
    preview: "What changed for her at month 2.",
    body: `<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I want to tell you about a woman named Sarah. (She said I could.)</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Sarah was 34. She'd been trying for 8 months. She was taking a prenatal from Target, doing everything the internet told her to do, and nothing was happening.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">When she found us, she almost didn't start. She told me later: &ldquo;I was so tired of hoping. Every new thing felt like another setup for disappointment.&rdquo;</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I get that. Deeply.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">She started her personalized pack anyway. Not because she was optimistic &mdash; because she was stubborn. (Her words.)</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Month 1: she noticed her energy was different. Not dramatic. Just... steadier.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Month 2: her cycle shifted. It had been 36 days, unpredictable. It came in at 29. Then 28. Her luteal phase &mdash; the part after ovulation that matters so much for implantation &mdash; went from 9 days to 12.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Month 4: pregnant.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I'm not telling you this to promise you the same outcome. Bodies are different. Timelines are different. But Sarah's body wasn't broken. It was undersupported. And when we gave it what it specifically needed &mdash; not what a generic prenatal guessed it might need &mdash; it responded.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">That's the thing about your body, *|FNAME|*. It's not fighting you. It's waiting for you to give it the right support.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 12px;">Based on your quiz, here's your personalized 8-ingredient pack:</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
<tr><td style="padding:4px 0;">
<p style="font-size:11px;font-weight:700;margin:0 0 8px;color:#5A6FFF;text-transform:uppercase;letter-spacing:0.08em;">Personalized For *|FOCUS_AREA|* &amp; Your Weakest Areas</p>
</td></tr>
<tr><td style="padding:12px 16px;background:#F9F7F0;border-radius:8px;border-left:3px solid #5A6FFF;margin-bottom:6px;">
<p style="font-size:15px;font-weight:600;margin:0 0 3px;color:#2A2828;">*|SUPP1|*</p>
<p style="font-size:13px;margin:0;color:#6B7280;line-height:1.5;">*|SUPP1_WHY|*</p>
</td></tr>
<tr><td style="height:6px;"></td></tr>
<tr><td style="padding:12px 16px;background:#F9F7F0;border-radius:8px;border-left:3px solid #ACB7FF;">
<p style="font-size:15px;font-weight:600;margin:0 0 3px;color:#2A2828;">*|SUPP2|*</p>
<p style="font-size:13px;margin:0;color:#6B7280;line-height:1.5;">*|SUPP2_WHY|*</p>
</td></tr>
<tr><td style="height:6px;"></td></tr>
<tr><td style="padding:12px 16px;background:#F9F7F0;border-radius:8px;border-left:3px solid #E37FB1;">
<p style="font-size:15px;font-weight:600;margin:0 0 3px;color:#2A2828;">*|SUPP3|*</p>
<p style="font-size:13px;margin:0;color:#6B7280;line-height:1.5;">*|SUPP3_WHY|*</p>
</td></tr>
<tr><td style="height:6px;"></td></tr>
<tr><td style="padding:12px 16px;background:#F9F7F0;border-radius:8px;border-left:3px solid #9686B9;">
<p style="font-size:15px;font-weight:600;margin:0 0 3px;color:#2A2828;">*|SUPP4|*</p>
<p style="font-size:13px;margin:0;color:#6B7280;line-height:1.5;">*|SUPP4_WHY|*</p>
</td></tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
<tr><td style="padding:4px 0;">
<p style="font-size:11px;font-weight:700;margin:0 0 8px;color:#1EAA55;text-transform:uppercase;letter-spacing:0.08em;">Your Core Foundation (Everyone Gets These)</p>
</td></tr>
<tr><td style="padding:12px 16px;background:#F9F7F0;border-radius:8px;border:1px solid #E8E5DC;">
<p style="font-size:14px;margin:0;color:#2A2828;line-height:1.8;">
<strong>*|SUPP5|*</strong> &bull; <strong>*|SUPP6|*</strong> &bull; <strong>*|SUPP7|*</strong> &bull; <strong>*|SUPP8|*</strong>
</p>
</td></tr>
</table>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#6B7280;font-style:italic;">These aren't random picks off a shelf. Every one of them is tied to something specific your quiz told us about your body.</p>`,
  },
  {
    dayDelay: 5,
    subject: "I recorded this for you",
    preview: "3 minutes. Just me being real.",
    body: `<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I wanted to say this to your face &mdash; or as close to it as email allows.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I recorded a short video. No slides. No pitch. Just me talking about the thing I wish someone had told me 25 years ago when I started working with women trying to conceive.</p>
<p style="margin:0 0 20px;"><a href="https://conceivable.com" style="display:inline-block;background:#5A6FFF;color:#fff;font-size:16px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:8px;">Watch the Video &rarr;</a></p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">It's 3 minutes. No slides, no pitch deck, no &ldquo;and if you act now...&rdquo; energy. Just me, a camera, and the thing I've been saying for 25 years that nobody in this industry wants to hear.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">You're allowed to be hopeful and terrified at the same time. You're allowed to want this desperately and also be exhausted by wanting it. You're allowed to feel all of it.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">And you're allowed to do something about it that isn't just &ldquo;relax and it'll happen.&rdquo; (If one more person says that to you, you have my permission to throw something soft at them.)</p>
<p style="font-size:14px;line-height:1.6;margin:20px 0 0;color:#999;">P.S. If you'd rather not watch &mdash; your biggest question about fertility, whatever it is. Reply with it. I'll answer personally.</p>`,
  },
  {
    dayDelay: 7,
    subject: "Whatever you decide",
    preview: "No pitch. Just something I want you to know.",
    body: `<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">This is my last email about this. I mean that.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I'm not going to give you a countdown timer or a &ldquo;spots are running out!&rdquo; (Ugh.)</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">I just want to say one thing:</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">You took that quiz because something in you said &ldquo;maybe there's a better way.&rdquo; That instinct? It's right. Whether you do something about it with us or somewhere else or on your own &mdash; trust that instinct.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Your body isn't broken. It might just need someone to actually listen to what it's saying.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">If that's us &mdash; your pack is built around what <em>your</em> quiz showed: *|SUPP1|*, *|SUPP2|*, *|SUPP3|*, *|SUPP4|*, plus your core foundation of *|SUPP5|*, *|SUPP6|*, *|SUPP7|*, and *|SUPP8|*. Eight ingredients, formulated together, dosed right, shipped to your door. No guessing, no googling, no generic prenatal that was designed for everyone and therefore optimized for no one.</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">It's sitting there whenever you're ready. No expiration. No pressure.</p>
<p style="margin:0 0 20px;"><a href="*|CART_URL|*" style="display:inline-block;background:#5A6FFF;color:#fff;font-size:16px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:8px;">Get My Pack &rarr;</a></p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">And if it's not us &mdash; I'm still rooting for you. Every woman who takes control of her fertility health makes the world a little better. That includes you.</p>`,
  },
];

function buildNurtureHtml(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F9F7F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2A2828;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F0;"><tr><td align="center" style="padding:20px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#5A6FFF;height:6px;"></td></tr>
<tr><td style="padding:40px 32px 16px;">
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">Hi *|FNAME|*,</p>
<p style="font-size:17px;line-height:1.7;margin:0 0 20px;">If you don't already know me — I'm Kirsten, the founder of Conceivable. I spent the last 25 years helping over 10,000 couples conceive, and now I'm here to help you.</p>
${body}
<p style="font-size:17px;line-height:1.7;margin:0 0 4px;">Sending you big love,</p>
<p style="font-size:17px;line-height:1.7;margin:0;">Kirsten</p>
</td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid #eee;">
<p style="font-size:13px;line-height:1.5;margin:0;color:#999;text-align:center;">
Conceivable &mdash; Science-backed fertility support, personalized for you.<br>
<a href="*|UNSUB|*" style="color:#999;text-decoration:underline;">Unsubscribe</a>
</p></td></tr>
</table></td></tr></table></body></html>`;
}

/**
 * POST — Create the quiz nurture automation in Mailchimp.
 * Run this once. Copy the returned IDs to env vars.
 */
export async function POST(_req: NextRequest) {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_AUDIENCE_ID || "3c920d5bed";

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  const auth = `Bearer ${apiKey}`;
  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;

  // Ensure personalization merge fields exist on the list before creating automation.
  // These are used in email templates: *|SUPP1|*, *|SUPP2|*, *|SUPP3|*, *|FOCUS_AREA|*
  const mergeFieldsToCreate = [
    { tag: "SUPP1",    name: "Supplement 1 (Personalized)", type: "text" },
    { tag: "SUPP1_WHY",name: "Supplement 1 Reason",         type: "text" },
    { tag: "SUPP2",    name: "Supplement 2 (Personalized)", type: "text" },
    { tag: "SUPP2_WHY",name: "Supplement 2 Reason",         type: "text" },
    { tag: "SUPP3",    name: "Supplement 3 (Personalized)", type: "text" },
    { tag: "SUPP3_WHY",name: "Supplement 3 Reason",         type: "text" },
    { tag: "SUPP4",    name: "Supplement 4 (Personalized)", type: "text" },
    { tag: "SUPP4_WHY",name: "Supplement 4 Reason",         type: "text" },
    { tag: "SUPP5",    name: "Supplement 5 (Core)",         type: "text" },
    { tag: "SUPP6",    name: "Supplement 6 (Core)",         type: "text" },
    { tag: "SUPP7",    name: "Supplement 7 (Core)",         type: "text" },
    { tag: "SUPP8",    name: "Supplement 8 (Core)",         type: "text" },
    { tag: "FOCUS_AREA",name: "Focus Area",                 type: "text" },
    { tag: "QUIZ_SCORE",name: "Quiz Score",                 type: "text" },
    { tag: "SCORE_TIER",name: "Score Tier",                 type: "text" },
    { tag: "REF_CODE",  name: "Referral Code",              type: "text" },
  ];

  // Fetch existing merge fields so we don't duplicate
  const existingMfRes = await fetch(`${base}/lists/${listId}/merge-fields?count=100`, {
    headers: { Authorization: auth },
  });
  const existingMfData = existingMfRes.ok ? await existingMfRes.json() : { merge_fields: [] };
  const existingTags = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (existingMfData.merge_fields || []).map((mf: any) => mf.tag as string)
  );

  for (const mf of mergeFieldsToCreate) {
    if (!existingTags.has(mf.tag)) {
      await fetch(`${base}/lists/${listId}/merge-fields`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({ tag: mf.tag, name: mf.name, type: mf.type }),
      });
    }
  }

  // Create the automation
  const createRes = await fetch(`${base}/automations`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      recipients: { list_id: listId },
      settings: {
        title: "Conceivable — Quiz Nurture Sequence",
        from_name: "Kirsten at Conceivable",
        reply_to: "kirsten@conceivable.com",
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    return NextResponse.json({ error: "Failed to create automation", detail: err }, { status: 500 });
  }

  const automation = await createRes.json();
  const workflowId = automation.id;

  // Add each email to the automation
  const emailResults: { subject: string; emailId: string | null; error: string | null }[] = [];
  let firstEmailId: string | null = null;

  for (let i = 0; i < NURTURE_EMAILS.length; i++) {
    const nurture = NURTURE_EMAILS[i];

    const addRes = await fetch(`${base}/automations/${workflowId}/emails`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: {
          subject_line: nurture.subject,
          preview_text: nurture.preview,
          from_name: "Kirsten at Conceivable",
          reply_to: "kirsten@conceivable.com",
        },
        delay: {
          amount: i === 0 ? 1 : nurture.dayDelay - NURTURE_EMAILS[i - 1].dayDelay,
          type: "day",
          direction: "after",
          action: i === 0 ? "signup" : "previous_campaign_sent",
        },
      }),
    });

    if (!addRes.ok) {
      const addErr = await addRes.json();
      emailResults.push({ subject: nurture.subject, emailId: null, error: JSON.stringify(addErr) });
      continue;
    }

    const addData = await addRes.json();
    const emailId = addData.id;

    if (i === 0) firstEmailId = emailId;

    // Set the email content
    await fetch(`${base}/automations/${workflowId}/emails/${emailId}/content`, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ html: buildNurtureHtml(nurture.body) }),
    });

    emailResults.push({ subject: nurture.subject, emailId, error: null });
  }

  return NextResponse.json({
    success: true,
    workflowId,
    firstEmailId,
    emailsAdded: emailResults.filter((e) => e.emailId).length,
    emails: emailResults,
    nextSteps: [
      `Set MAILCHIMP_QUIZ_NURTURE_WORKFLOW_ID=${workflowId} in Vercel + quiz app`,
      `Set MAILCHIMP_QUIZ_NURTURE_FIRST_EMAIL_ID=${firstEmailId} in Vercel + quiz app`,
      "Go to Mailchimp → Automations → activate 'Conceivable — Quiz Nurture Sequence'",
    ],
  });
}

const AUTOMATION_TITLE = "Conceivable — Quiz Nurture Sequence";

/** Find the automation ID by title if env var isn't set */
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

/**
 * PATCH — Update email content in the existing automation (no recreate needed).
 * Fetches all emails in the workflow, then pushes the latest HTML to each one.
 */
export async function PATCH(_req: NextRequest) {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_AUDIENCE_ID || "3c920d5bed";

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ error: "Mailchimp credentials not configured" }, { status: 503 });
  }

  const auth = `Bearer ${apiKey}`;
  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;

  const workflowId = await resolveWorkflowId(base, auth);
  if (!workflowId) {
    return NextResponse.json({ error: "No automation found. Create it first." }, { status: 404 });
  }

  // First ensure all merge fields exist (including the 8-supplement fields)
  const mergeFieldsToCreate = [
    { tag: "SUPP1",    name: "Supplement 1 (Personalized)", type: "text" },
    { tag: "SUPP1_WHY",name: "Supplement 1 Reason",         type: "text" },
    { tag: "SUPP2",    name: "Supplement 2 (Personalized)", type: "text" },
    { tag: "SUPP2_WHY",name: "Supplement 2 Reason",         type: "text" },
    { tag: "SUPP3",    name: "Supplement 3 (Personalized)", type: "text" },
    { tag: "SUPP3_WHY",name: "Supplement 3 Reason",         type: "text" },
    { tag: "SUPP4",    name: "Supplement 4 (Personalized)", type: "text" },
    { tag: "SUPP4_WHY",name: "Supplement 4 Reason",         type: "text" },
    { tag: "SUPP5",    name: "Supplement 5 (Core)",         type: "text" },
    { tag: "SUPP6",    name: "Supplement 6 (Core)",         type: "text" },
    { tag: "SUPP7",    name: "Supplement 7 (Core)",         type: "text" },
    { tag: "SUPP8",    name: "Supplement 8 (Core)",         type: "text" },
    { tag: "FOCUS_AREA",name: "Focus Area",                 type: "text" },
  ];
  const existingMfRes = await fetch(`${base}/lists/${listId}/merge-fields?count=100`, { headers: { Authorization: auth } });
  const existingMfData = existingMfRes.ok ? await existingMfRes.json() : { merge_fields: [] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingTags = new Set((existingMfData.merge_fields || []).map((mf: any) => mf.tag as string));
  for (const mf of mergeFieldsToCreate) {
    if (!existingTags.has(mf.tag)) {
      await fetch(`${base}/lists/${listId}/merge-fields`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({ tag: mf.tag, name: mf.name, type: mf.type }),
      });
    }
  }

  // Fetch all emails in this workflow
  const emailsRes = await fetch(`${base}/automations/${workflowId}/emails`, { headers: { Authorization: auth } });
  if (!emailsRes.ok) {
    return NextResponse.json({ error: "Could not fetch automation emails" }, { status: 500 });
  }
  const emailsData = await emailsRes.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workflowEmails: { id: string; settings: { subject_line: string } }[] = emailsData.emails || [];

  // Match workflow emails to our NURTURE_EMAILS array by subject line, update content
  const results: { subject: string; updated: boolean; error?: string }[] = [];
  for (const wfEmail of workflowEmails) {
    const match = NURTURE_EMAILS.find((n) => n.subject === wfEmail.settings?.subject_line);
    if (!match) {
      results.push({ subject: wfEmail.settings?.subject_line, updated: false, error: "No matching template" });
      continue;
    }
    const contentRes = await fetch(`${base}/automations/${workflowId}/emails/${wfEmail.id}/content`, {
      method: "PUT",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ html: buildNurtureHtml(match.body) }),
    });
    if (contentRes.ok) {
      results.push({ subject: match.subject, updated: true });
    } else {
      const err = await contentRes.json();
      results.push({ subject: match.subject, updated: false, error: JSON.stringify(err) });
    }
  }

  return NextResponse.json({ success: true, updated: results.filter((r) => r.updated).length, results });
}

/**
 * GET — Check automation status, resolving by title if env vars aren't set.
 */
export async function GET(_req: NextRequest) {
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!apiKey || !serverPrefix) {
    return NextResponse.json({ configured: false, message: "Mailchimp not configured" });
  }

  const auth = `Bearer ${apiKey}`;
  const base = `https://${serverPrefix}.api.mailchimp.com/3.0`;

  const workflowId = await resolveWorkflowId(base, auth);
  if (!workflowId) {
    return NextResponse.json({ configured: false, message: "No automation found. Click Create Automation." });
  }

  const res = await fetch(`${base}/automations/${workflowId}`, { headers: { Authorization: auth } });
  if (!res.ok) {
    return NextResponse.json({ configured: false, message: "Automation not found in Mailchimp — may need to recreate" });
  }

  const data = await res.json();

  // Also get first email ID for enrollment
  const emailsRes = await fetch(`${base}/automations/${workflowId}/emails`, { headers: { Authorization: auth } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emailsData = emailsRes.ok ? await emailsRes.json() : { emails: [] };
  const firstEmail = (emailsData.emails || []).sort((a: any, b: any) => a.position - b.position)[0];

  return NextResponse.json({
    configured: true,
    workflowId,
    firstEmailId: firstEmail?.id || process.env.MAILCHIMP_QUIZ_NURTURE_FIRST_EMAIL_ID || null,
    status: data.status,
    title: data.settings?.title,
  });
}
