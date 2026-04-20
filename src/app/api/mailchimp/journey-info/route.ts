import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const journeyId = searchParams.get("id");

  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!apiKey || !serverPrefix || !journeyId) {
    return NextResponse.json({ error: "Missing config or journey id" }, { status: 400 });
  }

  const res = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/customer-journeys/journeys/${journeyId}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: "Mailchimp error", detail: err }, { status: 500 });
  }

  const data = await res.json();

  // Pull out steps with type + id so we can find the trigger step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps = (data.steps || []).map((s: any) => ({
    id: s.id,
    type: s.type,
    name: s.name || s.settings?.name || "",
    delay: s.delay,
  }));

  return NextResponse.json({
    journeyId: data.id,
    name: data.name,
    status: data.status,
    steps,
  });
}
