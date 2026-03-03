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
    // Map Prisma result to LaunchEmail shape
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
          variables and that the database is accessible.
        </p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-2xl p-6 border border-yellow-300 bg-yellow-50">
        <h2 className="text-lg font-semibold text-yellow-700 mb-2">
          No Emails Found
        </h2>
        <p className="text-sm text-yellow-600">
          The database query succeeded but returned 0 emails. Run the seed
          script to populate the email table.
        </p>
      </div>
    );
  }

  return <EmailDeploymentClient initialEmails={emails} />;
}
