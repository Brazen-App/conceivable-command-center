import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

const LIST_ID = "3c920d5bed";

const PRODUCT_NAMES: Record<string, string> = {
  NAC: "NAC", OMEGA: "Omega-3 (DHA)", COQ10: "CoQ10", METHYL_B: "Prenatal Multi",
  VIT_C: "Vitamin C", BERBERINE: "Berberine", MAGNESIUM: "Magnesium",
  D_COMPLEX: "D-Complex", TURMERIC: "Turmeric", CHROMIUM: "Chromium",
  ZINC: "Zinc", LIPOIC: "Lipoic Acid", RESVERATROL: "Resveratrol",
  NR: "NR", RHODIOLA: "Rhodiola", ASHWAGANDHA: "Ashwagandha",
  DIM: "DIM", CALCIUM: "Calcium Citrate", ARGININE: "Arginine",
  PROBIOTIC: "Probiotic", TRIPHALA: "Triphala", FIBER: "Fiber", VIT_E: "Vitamin E",
  CHOLINE: "Choline", DHA: "Prenatal DHA",
};

const CONCERN_LABELS: Record<string, string> = {
  pregnant: "Getting pregnant",
  stay: "Staying pregnant",
  pcos: "PCOS",
  endo: "Endometriosis",
  ivf: "IVF/IUI prep",
  insulin: "Insulin resistance",
  sperm: "Sperm health",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Handle preflight */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/quiz-responses — save a quiz response from the quiz app
 * Called by conceivable-quiz when someone submits their email + completes the quiz.
 * Also subscribes to Mailchimp, applies tags, and enrolls in nurture automation.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, answers, products, cartUrl, kaiMessage } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400, headers: CORS_HEADERS });
    }

    const response = await prisma.quizResponse.create({
      data: {
        email,
        name: name || null,
        answers: answers || {},
        products: products || [],
        cartUrl: cartUrl || null,
        kaiMessage: kaiMessage || null,
        medical: answers?.medical || null,
        medications: answers?.medications || null,
        otherNotes: answers?.other || null,
        topConcern: Array.isArray(answers?.concerns) ? answers.concerns[0] : null,
        ageRange: answers?.age || null,
        energy: answers?.energy || null,
      },
    });

    // --- Mailchimp: subscribe, tag, and enroll in nurture automation ---
    try {
      if (process.env.MAILCHIMP_API_KEY) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mc = getClient() as any;

        // Build product display names for merge fields
        const productCodes = (products || []).slice(0, 8);
        const mergeFields: Record<string, string> = {
          FNAME: name || "",
        };
        // Map product codes to readable names in SUPP1–SUPP8
        productCodes.forEach((code: string, i: number) => {
          mergeFields[`SUPP${i + 1}`] = PRODUCT_NAMES[code] || code;
        });
        // Top concern as focus area (readable label)
        const topConcern = Array.isArray(answers?.concerns) ? answers.concerns[0] : null;
        if (topConcern) {
          mergeFields.FOCUS_AREA = CONCERN_LABELS[topConcern] || topConcern;
        }

        // Subscribe / update the contact
        await mc.lists.setListMember(LIST_ID, email.toLowerCase(), {
          email_address: email.toLowerCase(),
          status_if_new: "subscribed",
          merge_fields: mergeFields,
        });

        // Apply tags
        try {
          const tags = [
            { name: "early-access", status: "active" },
            { name: "quiz-completed", status: "active" },
            { name: "Quiz - No Purchase Journey", status: "active" },
          ];
          // Track prenatal choice
          if (answers?.wantPrenatal === "yes") {
            tags.push({ name: "prenatal-yes", status: "active" });
          }
          // Track male factor
          if (Array.isArray(answers?.concerns) && answers.concerns.includes("sperm")) {
            tags.push({ name: "male-factor", status: "active" });
          }
          if (topConcern) {
            tags.push({ name: `concern-${topConcern}`, status: "active" });
          }
          await mc.lists.updateListMemberTags(LIST_ID, email.toLowerCase(), { tags });
        } catch {
          // Non-critical — tagging failure shouldn't block signup
        }

        // Enroll in quiz nurture automation
        const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
        const nurtureWorkflowId = process.env.MAILCHIMP_QUIZ_NURTURE_WORKFLOW_ID;
        const nurtureFirstEmailId = process.env.MAILCHIMP_QUIZ_NURTURE_FIRST_EMAIL_ID;

        if (nurtureWorkflowId && nurtureFirstEmailId && serverPrefix) {
          try {
            const enrollRes = await fetch(
              `https://${serverPrefix}.api.mailchimp.com/3.0/automations/${nurtureWorkflowId}/emails/${nurtureFirstEmailId}/queue`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email_address: email.toLowerCase() }),
              }
            );
            if (!enrollRes.ok) {
              const errBody = await enrollRes.text();
              console.warn("[quiz-responses] Automation enrollment failed:", enrollRes.status, errBody);
            }
          } catch (enrollErr) {
            console.warn("[quiz-responses] Automation queue error:", enrollErr);
          }
        } else {
          // Fallback: Customer Journey trigger
          const journeyId = process.env.MAILCHIMP_JOURNEY_ID;
          const stepId = process.env.MAILCHIMP_JOURNEY_STEP_ID;
          if (journeyId && stepId && serverPrefix) {
            try {
              await fetch(
                `https://${serverPrefix}.api.mailchimp.com/3.0/customer-journeys/journeys/${journeyId}/steps/${stepId}/actions/trigger`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email_address: email.toLowerCase() }),
                }
              );
            } catch (enrollErr) {
              console.warn("[quiz-responses] Journey trigger failed:", enrollErr);
            }
          }
        }

        console.log(`[quiz-responses] Mailchimp: subscribed + enrolled ${email}`);
      }
    } catch (mcErr) {
      console.error("[quiz-responses] Mailchimp error:", mcErr);
      // Don't fail the response — DB save succeeded
    }

    return NextResponse.json({ ok: true, id: response.id }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[quiz-responses] POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * GET /api/quiz-responses — list all quiz responses (newest first)
 */
const TEST_EMAILS = ["kirsten.karchmer@iambrazen.com"];

export async function GET() {
  try {
    const responses = await prisma.quizResponse.findMany({
      where: { NOT: { email: { in: TEST_EMAILS } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ responses, total: responses.length }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[quiz-responses] GET error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
