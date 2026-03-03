import { prisma } from "@/lib/prisma";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import EmailDeploymentClient from "@/components/departments/email/EmailDeploymentClient";

export const dynamic = "force-dynamic";

export default async function MarketingEmailPage() {
  let emails: LaunchEmail[] = [];
  let dbError: string | null = null;
  let debugInfo = "";

  try {
    // Raw SQL to bypass Prisma model layer
    const rawCount = await prisma.$queryRawUnsafe(
      'SELECT COUNT(*) as c FROM "Email"'
    ) as Array<{ c: bigint }>;
    debugInfo += `rawSQL=${String(rawCount[0]?.c)}; `;

    // Also list all tables
    const tables = await prisma.$queryRawUnsafe(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    ) as Array<{ tablename: string }>;
    debugInfo += `tables=[${tables.map((t) => t.tablename).join(",")}]; `;

    // Prisma model count
    const count = await prisma.email.count();
    debugInfo += `prismaCount=${count}; `;

    const dbEmails = await prisma.email.findMany({
      orderBy: [{ week: "asc" }, { sequence: "asc" }],
    });
    debugInfo += `fetched=${dbEmails.length}; `;

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
      err instanceof Error
        ? `${err.message} | ${err.constructor.name}`
        : `Unknown error: ${String(err)}`;
    console.error("Failed to fetch emails from database:", err);
  }

  const dbUrlPrefix = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.substring(0, 30) + "..."
    : "NOT SET";

  if (dbError) {
    return (
      <div className="rounded-2xl p-6 border border-red-300 bg-red-50">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          Database Connection Error
        </h2>
        <p className="text-sm text-red-600 mb-4">{dbError}</p>
        <p className="text-xs text-red-500 mb-2">
          DATABASE_URL: {dbUrlPrefix}
        </p>
        <p className="text-xs text-red-500">Debug: {debugInfo}</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="rounded-2xl p-6 border border-yellow-300 bg-yellow-50">
        <h2 className="text-lg font-semibold text-yellow-700 mb-2">
          No Emails Found
        </h2>
        <p className="text-sm text-yellow-600 mb-2">
          The database query succeeded but returned 0 emails.
        </p>
        <p className="text-xs text-yellow-500 mb-1">
          DATABASE_URL: {dbUrlPrefix}
        </p>
        <p className="text-xs text-yellow-500">Debug: {debugInfo}</p>
      </div>
    );
  }

  return <EmailDeploymentClient initialEmails={emails} />;
}
