import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishBlogToShopify, isShopifyConfigured } from "@/lib/integrations/shopify-blog";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/marketing/blog-queue/publish — bulk publish drafts to Shopify
 * Body: { ids: string[] }
 */
export async function POST(request: NextRequest) {
  const { ids } = await request.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }

  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify is not configured. Add SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN to environment variables." },
      { status: 503 }
    );
  }

  // Fetch all drafts
  const drafts = await prisma.content.findMany({
    where: { id: { in: ids }, type: "blog" },
  });

  if (drafts.length === 0) {
    return NextResponse.json({ error: "No matching drafts found" }, { status: 404 });
  }

  // Publish each one
  const results = await Promise.allSettled(
    drafts.map(async (draft) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (draft.metrics as any) || {};

      // Build the full body with FAQ schema injected if needed
      let bodyHtml = draft.body;

      // If there's a separate FAQ block that hasn't been injected yet, parse and inject
      if (meta.faqBlock && !bodyHtml.includes('"FAQPage"')) {
        const faqs = parseFaqPairs(meta.faqBlock);
        if (faqs.length > 0) {
          const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          };
          bodyHtml = `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n` + bodyHtml;
        }
      }

      // Also inject Article schema if meta description exists
      if (meta.metaDescription && !bodyHtml.includes('"Article"')) {
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.metaTitle || draft.title,
          description: meta.metaDescription,
          author: { "@type": "Person", name: "Kirsten Karchmer" },
          publisher: { "@type": "Organization", name: "Conceivable" },
        };
        bodyHtml = `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n` + bodyHtml;
      }

      const result = await publishBlogToShopify({
        title: meta.metaTitle || draft.title,
        body: bodyHtml,
        author: "Kirsten Karchmer",
        tags: meta.tags || [],
        publishNow: true,
      });

      if (!result.success) {
        throw new Error(result.error || "Shopify publish failed");
      }

      // Update draft status to published
      await prisma.content.update({
        where: { id: draft.id },
        data: {
          status: "published",
          publishedAt: new Date(),
          metrics: {
            ...meta,
            shopifyArticleId: result.article?.id,
            shopifyHandle: result.article?.handle,
            shopifyUrl: result.article?.url,
          },
        },
      });

      return { id: draft.id, title: draft.title, article: result.article };
    })
  );

  const response = results.map((r, i) => {
    if (r.status === "fulfilled") {
      return { id: drafts[i].id, ok: true, data: r.value };
    }
    return {
      id: drafts[i].id,
      ok: false,
      error: r.reason instanceof Error ? r.reason.message : "Unknown error",
    };
  });

  const succeeded = response.filter((r) => r.ok).length;
  const failed = response.filter((r) => !r.ok).length;

  return NextResponse.json({ results: response, summary: { succeeded, failed, total: response.length } });
}

function parseFaqPairs(faqBlock: string): Array<{ question: string; answer: string }> {
  if (!faqBlock?.trim()) return [];
  const faqs: Array<{ question: string; answer: string }> = [];
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
