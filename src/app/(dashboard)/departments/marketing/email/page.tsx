import { prisma } from "@/lib/prisma";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import EmailDeploymentClient from "@/components/departments/email/EmailDeploymentClient";

export const dynamic = "force-dynamic";

export default async function MarketingEmailPage() {
  let emails: LaunchEmail[] = [];

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
    console.error("Failed to fetch emails from database:", err);
  }

  return <EmailDeploymentClient initialEmails={emails} />;
}
