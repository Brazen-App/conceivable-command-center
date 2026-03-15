import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/mailchimp";
import { generateReferralCode, getScoreInterpretation } from "@/lib/data/early-access-quiz";

const LIST_ID = "3c920d5bed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      quizAnswers,
      score,
      categoryScores,
      utmSource,
      utmMedium,
      utmCampaign,
      referredBy,
    } = body;

    if (!email || !quizAnswers || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: email, quizAnswers, score" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const interpretation = getScoreInterpretation(score);
    const referralCode = generateReferralCode(email);

    // Check if already signed up
    const existing = await prisma.earlyAccessSignup.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      // Return existing data
      const totalCount = await prisma.earlyAccessSignup.count();
      return NextResponse.json({
        success: true,
        referralCode: existing.referralCode,
        waitlistPosition: totalCount,
        alreadySignedUp: true,
      });
    }

    // If referred by someone, increment their referral count
    if (referredBy) {
      await prisma.earlyAccessSignup.updateMany({
        where: { referralCode: referredBy },
        data: { referralCount: { increment: 1 } },
      });
    }

    // Create the signup record
    const signup = await prisma.earlyAccessSignup.create({
      data: {
        email: email.toLowerCase(),
        quizAnswers,
        score: Math.round(score),
        scoreBreakdown: categoryScores || {},
        tier: "early_access",
        referralCode,
        referredBy: referredBy || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        mailchimpStatus: "pending",
      },
    });

    // Add to Mailchimp
    let mailchimpStatus = "pending";
    try {
      if (process.env.MAILCHIMP_API_KEY) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mc = getClient() as any;

        // Subscribe the user
        await mc.lists.setListMember(LIST_ID, email.toLowerCase(), {
          email_address: email.toLowerCase(),
          status_if_new: "subscribed",
          merge_fields: {
            QUIZ_SCORE: String(score),
            SCORE_TIER: interpretation.label,
            REF_CODE: referralCode,
          },
          tags: [
            "early-access",
            "quiz-completed",
            `score-${interpretation.label.toLowerCase().replace(/\s+/g, "-")}`,
          ],
        });

        // Add tags separately (Mailchimp's setListMember tags don't always stick)
        try {
          await mc.lists.updateListMemberTags(LIST_ID, email.toLowerCase(), {
            tags: [
              { name: "early-access", status: "active" },
              { name: "quiz-completed", status: "active" },
              { name: `score-${interpretation.label.toLowerCase().replace(/\s+/g, "-")}`, status: "active" },
            ],
          });
        } catch {
          // Non-critical, tags via merge is a fallback
        }

        mailchimpStatus = "subscribed";
      }
    } catch (mcErr) {
      console.error("[early-access/signup] Mailchimp error:", mcErr);
      mailchimpStatus = "error";
    }

    // Update Mailchimp status
    await prisma.earlyAccessSignup.update({
      where: { id: signup.id },
      data: { mailchimpStatus },
    });

    // Get waitlist position
    const totalCount = await prisma.earlyAccessSignup.count();

    return NextResponse.json({
      success: true,
      referralCode,
      waitlistPosition: totalCount,
      scoreTier: interpretation.label,
    });
  } catch (err) {
    console.error("[early-access/signup] Error:", err);

    // Handle unique constraint violation gracefully
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "This email is already signed up!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
