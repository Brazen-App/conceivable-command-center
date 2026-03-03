import { prisma } from "@/lib/prisma";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import EmailDeploymentClient from "@/components/departments/email/EmailDeploymentClient";

export const dynamic = "force-dynamic";

export default async function MarketingEmailPage() {
  let emails: LaunchEmail[] = [];
  let dbError: string | null = null;

  try {
    const dbEmails = await prisma.email.findMany({
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
    });
    emails = dbEmails.map((e) => ({
      id: e.id,
      week: e.week,
      sequence: e.sequence,
      phase: e.phase as LaunchEmail["phase"],
      subject: e.subject,
      preview: e.preview,
      body: e.body,
      status: e.status as LaunchEmail["status"],
      segment: e.segment ?? "",
      approvedAt: e.approvedAt,
      publishedAt: e.publishedAt,
      complianceStatus: e.complianceStatus as LaunchEmail["complianceStatus"],
      metrics: e.metrics as LaunchEmail["metrics"],
    }));
  } catch (err) {
    dbError =
      err instanceof Error ? err.message : "Unknown database error";
    console.error("Failed to fetch emails from database:", err);
  }

  if (dbError) {
    return (
      <div className="rounded-2xl p-6 border border-red-300 bg-red-50">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Database Connection Error
        </h2>
        <p className="text-sm text-red-600 mb-4">{dbError}</p>
        <p className="text-xs text-red-500">
          Check that DATABASE_URL is set correctly in Vercel environment
          variables.
        </p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl p-6 border border-yellow-300 bg-yellow-50">
          <h2 className="text-lg font-semibold text-yellow-700 mb-2">
            Seeding Email Data...
          </h2>
          <p className="text-sm text-yellow-600 mb-4">
            No emails found in the database. Click the button below to seed
            the launch email data.
          </p>
          <SeedButton />
        </div>
      </div>
    );
  }

  return <EmailDeploymentClient initialEmails={emails} />;
}

function SeedButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { LAUNCH_EMAILS } = await import("@/lib/data/launch-emails");
        for (const e of LAUNCH_EMAILS) {
          await prisma.email.upsert({
            where: { id: e.id },
            update: {
              week: e.week,
              sequence: e.sequence,
              phase: e.phase,
              subject: e.subject,
              preview: e.preview,
              body: e.body,
              status: e.status,
              segment: e.segment,
              complianceStatus: e.complianceStatus,
              approvedAt: e.approvedAt,
              publishedAt: e.publishedAt,
              metrics: e.metrics
                ? JSON.parse(JSON.stringify(e.metrics))
                : undefined,
            },
            create: {
              id: e.id,
              week: e.week,
              sequence: e.sequence,
              phase: e.phase,
              subject: e.subject,
              preview: e.preview,
              body: e.body,
              status: e.status,
              segment: e.segment,
              complianceStatus: e.complianceStatus,
              approvedAt: e.approvedAt,
              publishedAt: e.publishedAt,
              metrics: e.metrics
                ? JSON.parse(JSON.stringify(e.metrics))
                : undefined,
            },
          });
        }
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "#5A6FFF" }}
      >
        Seed Email Data Now
      </button>
    </form>
  );
}
