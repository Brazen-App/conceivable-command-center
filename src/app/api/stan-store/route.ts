import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

/**
 * POST /api/stan-store
 *
 * Import Stan Store contacts into Mailchimp and tag them for the email drip campaign.
 *
 * Accepts two formats:
 * 1. Single contact: { email, firstName?, lastName?, product?, source? }
 * 2. Bulk CSV import: { contacts: [{ email, firstName?, lastName?, product? }] }
 *
 * Also works as a Zapier webhook endpoint:
 *   Stan "New Customer" trigger → Webhooks "Custom Request" → POST here
 */
export async function POST(req: NextRequest) {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();

    // Normalize to array
    const contacts: Array<{
      email: string;
      firstName?: string;
      lastName?: string;
      product?: string;
      source?: string;
    }> = body.contacts ?? [body];

    if (!contacts.length || !contacts[0]?.email) {
      return NextResponse.json({ error: "No contacts provided. Send { email, firstName?, lastName? } or { contacts: [...] }" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    const results: Array<{ email: string; status: string; error?: string }> = [];

    for (const contact of contacts) {
      try {
        // Use Mailchimp's "set" (upsert) to avoid duplicate errors
        const emailHash = require("crypto")
          .createHash("md5")
          .update(contact.email.toLowerCase())
          .digest("hex");

        await mc.lists.setListMember(LIST_ID, emailHash, {
          email_address: contact.email.toLowerCase(),
          status_if_new: "subscribed",
          merge_fields: {
            FNAME: contact.firstName || "",
            LNAME: contact.lastName || "",
          },
          tags: ["Stan Store", "Early Access"],
        });

        // Add tags separately (setListMember doesn't always apply tags)
        const tags = ["Stan Store", "Early Access"];
        if (contact.product) tags.push(`Product: ${contact.product}`);

        await mc.lists.updateListMemberTags(LIST_ID, emailHash, {
          tags: tags.map((name) => ({ name, status: "active" })),
        });

        results.push({ email: contact.email, status: "added" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[stan-store] Failed to add ${contact.email}:`, msg);
        results.push({ email: contact.email, status: "failed", error: msg });
      }
    }

    const added = results.filter((r) => r.status === "added").length;
    const failed = results.filter((r) => r.status === "failed").length;

    console.log(`[stan-store] Import complete: ${added} added, ${failed} failed`);

    return NextResponse.json({
      ok: true,
      message: `${added} contacts imported to Mailchimp, tagged "Stan Store" + "Early Access". ${failed} failed.`,
      added,
      failed,
      results,
    });
  } catch (err) {
    console.error("[stan-store] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to import contacts" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stan-store
 * Returns setup instructions and current Stan Store contact stats.
 */
export async function GET() {
  if (!process.env.MAILCHIMP_API_KEY) {
    return NextResponse.json({ error: "Mailchimp not configured" }, { status: 503 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mc = getClient() as any;

    // Count contacts tagged "Stan Store"
    let stanStoreCount = 0;
    try {
      const segments = await mc.lists.listSegments(LIST_ID, { count: 100 });
      const stanSegment = segments?.segments?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => s.name === "Stan Store"
      );
      stanStoreCount = stanSegment?.member_count ?? 0;
    } catch {
      // Tags API may work differently, fall back to 0
    }

    return NextResponse.json({
      stanStoreContacts: stanStoreCount,
      importEndpoint: "POST /api/stan-store",
      zapierSetup: {
        trigger: "Stan → New Customer",
        action: "Webhooks by Zapier → Custom Request",
        method: "POST",
        url: "https://conceivable-command-center.vercel.app/api/stan-store",
        headers: { "Content-Type": "application/json" },
        body: '{ "email": "{{email}}", "firstName": "{{first_name}}", "lastName": "{{last_name}}", "product": "{{product_name}}", "source": "stan-store-zapier" }',
      },
      csvFormat: {
        description: "Export CSV from Stan Store → Customers tab → Export. Then upload here.",
        requiredColumns: ["email"],
        optionalColumns: ["firstName", "lastName", "product"],
      },
    });
  } catch (err) {
    console.error("[stan-store] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
