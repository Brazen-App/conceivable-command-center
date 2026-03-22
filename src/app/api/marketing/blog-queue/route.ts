import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/marketing/blog-queue — list all blog drafts
 */
export async function GET() {
  const drafts = await prisma.content.findMany({
    where: { type: "blog", platform: "blog" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ drafts });
}

/**
 * POST /api/marketing/blog-queue — create a new blog draft
 * Body: { title, body, metaTitle?, metaDescription?, faqBlock?, tags? }
 */
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { title, body, metaTitle, metaDescription, faqBlock, tags } = data;

  if (!title || !body) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }

  // Inject FAQ schema into body HTML if faqBlock has Q:/A: pairs
  const processedBody = injectFaqSchema(body, faqBlock);

  const draft = await prisma.content.create({
    data: {
      type: "blog",
      platform: "blog",
      sourceType: "manual",
      title,
      body: processedBody,
      status: "draft",
      metrics: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || "",
        faqBlock: faqBlock || "",
        tags: tags || [],
      },
    },
  });

  return NextResponse.json({ draft }, { status: 201 });
}

/**
 * Parse Q:/A: formatted FAQ block and generate JSON-LD schema + HTML
 */
function parseFaqPairs(faqBlock: string): Array<{ question: string; answer: string }> {
  if (!faqBlock?.trim()) return [];

  const faqs: Array<{ question: string; answer: string }> = [];
  // Split on Q: markers
  const parts = faqBlock.split(/\n\s*Q:\s*/i).filter(Boolean);

  for (const part of parts) {
    const cleaned = part.startsWith("Q:") ? part.replace(/^Q:\s*/i, "") : part;
    const segments = cleaned.split(/\n\s*A:\s*/i);
    if (segments.length >= 2) {
      const question = segments[0].trim();
      const answer = segments.slice(1).join(" ").trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }
  return faqs;
}

function injectFaqSchema(body: string, faqBlock?: string): string {
  if (!faqBlock?.trim()) return body;

  const faqs = parseFaqPairs(faqBlock);
  if (faqs.length === 0) return body;

  // Generate JSON-LD FAQ schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const schemaTag = `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;

  // Check if body already has FAQ schema — don't double-inject
  if (body.includes('"FAQPage"')) return body;

  // Inject at the top of the body
  return schemaTag + "\n" + body;
}
