import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email, tags } = await req.json();
  if (!email || !tags?.length) return NextResponse.json({ error: "Missing email or tags" }, { status: 400 });

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const listId = "3c920d5bed";
  if (!apiKey || !serverPrefix) return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });

  const subscriberHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}/tags`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ tags: tags.map((t: string) => ({ name: t, status: "active" })) }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true, email, tags });
}
