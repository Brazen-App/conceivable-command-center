import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LAUNCH_EMAILS } from "@/lib/data/launch-emails";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    let emailCount = 0;

    // Seed Emails
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
          metrics: e.metrics ? JSON.parse(JSON.stringify(e.metrics)) : undefined,
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
          metrics: e.metrics ? JSON.parse(JSON.stringify(e.metrics)) : undefined,
        },
      });
      emailCount++;
    }

    // Also seed other critical data
    const { PATENTS, COMPLIANCE_CLAIMS, PENDING_REVIEWS } = await import(
      "@/lib/data/legal-data"
    );

    let patentCount = 0;
    for (const p of PATENTS) {
      await prisma.patent.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          title: p.title,
          shortTitle: p.shortTitle,
          description: p.description,
          type: p.type,
          status: p.status,
          filingDate: p.filingDate,
          expirationDate: p.expirationDate,
          patentNumber: p.patentNumber,
          keyClaims: p.keyClaims ? JSON.parse(JSON.stringify(p.keyClaims)) : undefined,
          grantDate: p.grantDate,
          assignedAttorney: p.assignedAttorney,
          priorArtNotes: p.priorArtNotes,
          competitiveThreatLevel: p.competitiveThreatLevel,
          filingPriority: p.filingPriority,
          filingDeadline: p.filingDeadline,
          deadlineReason: p.deadlineReason,
          crossDeptConnections: p.crossDeptConnections
            ? JSON.parse(JSON.stringify(p.crossDeptConnections))
            : undefined,
        },
      });
      patentCount++;
    }

    let claimCount = 0;
    for (const c of COMPLIANCE_CLAIMS) {
      await prisma.complianceClaim.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          claim: c.claim,
          category: c.category,
          status: c.status,
          citation: c.citation,
          disclaimer: c.disclaimer,
          studyDetails: c.studyDetails,
          restrictionReason: c.restrictionReason,
          lastReviewed: c.lastReviewed,
        },
      });
      claimCount++;
    }

    let reviewCount = 0;
    for (const r of PENDING_REVIEWS) {
      await prisma.pendingReview.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          source: r.source,
          title: r.title,
          flagReason: r.flagReason,
          flagType: r.flagType,
          severity: r.severity,
          content: r.content,
          submittedAt: r.submittedAt,
          status: r.status,
          reviewerNotes: r.reviewerNotes,
        },
      });
      reviewCount++;
    }

    // Seed Patent Claims
    const { PATENT_CLAIMS } = await import("@/lib/data/patent-claims-data");
    let patentClaimCount = 0;
    for (const pc of PATENT_CLAIMS) {
      await prisma.patentClaim.upsert({
        where: { id: pc.id },
        update: {},
        create: {
          id: pc.id,
          claimNumber: pc.claimNumber,
          claimText: pc.claimText,
          parentPatentId: pc.parentPatentId,
          parentPatentRef: pc.parentPatentRef,
          valueTier: pc.valueTier,
          estimatedValue: pc.estimatedValue,
          rationale: pc.rationale,
          status: pc.status,
          priority: pc.priority,
          archived: pc.archived,
          category: pc.category,
          urgency: pc.urgency,
          priorArtRisk: pc.priorArtRisk,
        },
      });
      patentClaimCount++;
    }

    const totalEmails = await prisma.email.count();

    return NextResponse.json({
      success: true,
      seeded: {
        emails: emailCount,
        patents: patentCount,
        claims: claimCount,
        reviews: reviewCount,
        patentClaims: patentClaimCount,
      },
      totalEmailsNow: totalEmails,
    });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown seed error",
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Also allow GET for easy browser testing
export async function GET() {
  const counts = {
    emails: await prisma.email.count(),
    patents: await prisma.patent.count(),
    claims: await prisma.complianceClaim.count(),
    reviews: await prisma.pendingReview.count(),
    patentClaims: await prisma.patentClaim.count(),
  };
  return NextResponse.json({ counts, hint: "POST to this endpoint to seed data" });
}
