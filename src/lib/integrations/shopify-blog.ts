/**
 * Shopify Blog Integration
 * Publishes blog articles via the Shopify Admin REST API.
 *
 * Required env vars:
 *   SHOPIFY_STORE_URL    — e.g. "conceivable.myshopify.com"
 *   SHOPIFY_ACCESS_TOKEN — Admin API access token
 *   SHOPIFY_BLOG_ID      — Numeric blog ID (find via /admin/api/2024-01/blogs.json)
 */

const API_VERSION = "2024-01";

function getConfig() {
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const blogId = process.env.SHOPIFY_BLOG_ID;

  if (!storeUrl || !accessToken) {
    return null;
  }

  // Normalize store URL
  const baseUrl = storeUrl.startsWith("https://")
    ? storeUrl
    : `https://${storeUrl}`;

  return { baseUrl, accessToken, blogId };
}

export function isShopifyConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * Parse FAQ section from blog content.
 * Expects format: Q: question\nA: answer pairs after "FAQ:" marker.
 */
function parseFaqSection(text: string): { faqs: Array<{ question: string; answer: string }>; bodyWithoutFaq: string } {
  const faqMarker = text.match(/\n\s*FAQ:\s*\n/i);
  if (!faqMarker || faqMarker.index === undefined) {
    return { faqs: [], bodyWithoutFaq: text };
  }

  const bodyWithoutFaq = text.slice(0, faqMarker.index).trim();
  const faqText = text.slice(faqMarker.index + faqMarker[0].length);

  const faqs: Array<{ question: string; answer: string }> = [];
  const qaPairs = faqText.split(/\n\s*Q:\s*/i).filter(Boolean);

  for (const pair of qaPairs) {
    const cleaned = pair.startsWith("Q:") ? pair.replace(/^Q:\s*/i, "") : pair;
    const parts = cleaned.split(/\n\s*A:\s*/i);
    if (parts.length >= 2) {
      const question = parts[0].trim();
      const answer = parts.slice(1).join(" ").trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  return { faqs, bodyWithoutFaq };
}

/**
 * Generate FAQ schema markup (JSON-LD) for SEO.
 */
function generateFaqSchema(faqs: Array<{ question: string; answer: string }>): string {
  if (faqs.length === 0) return "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Generate Article schema markup (JSON-LD) for SEO/GEO.
 */
function generateArticleSchema(title: string, description: string, author: string): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Conceivable",
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Convert FAQ items to semantic HTML.
 */
function faqsToHtml(faqs: Array<{ question: string; answer: string }>): string {
  if (faqs.length === 0) return "";

  const items = faqs.map((faq) =>
    `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h3 itemprop="name">${faq.question}</h3>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<p itemprop="text">${faq.answer}</p>
</div>
</div>`
  ).join("\n");

  return `<section itemscope itemtype="https://schema.org/FAQPage">
<h2>Frequently Asked Questions</h2>
${items}
</section>`;
}

/**
 * Convert plain text blog content to SEO/GEO-optimized HTML.
 * Handles SECTION: headings, FAQ sections, paragraphs, and structured data.
 */
function blogTextToHtml(text: string, title?: string, metaDescription?: string, author?: string): string {
  // Extract FAQ before processing body
  const { faqs, bodyWithoutFaq } = parseFaqSection(text);
  const paragraphs = bodyWithoutFaq.split(/\n\n+/);

  const htmlParts = paragraphs.map((para) => {
    const trimmed = para.trim();

    // SECTION: headings → <h2>
    if (trimmed.match(/^SECTION:\s*/i)) {
      const heading = trimmed.replace(/^SECTION:\s*/i, "").trim();
      return `<h2>${heading}</h2>`;
    }

    // Lines starting with "Title:" or "Meta description:" → skip (metadata)
    if (trimmed.match(/^(Title|Meta description|Focus keywords|Secondary keywords):/i)) {
      return "";
    }

    // Numbered lists (1. 2. 3.)
    if (trimmed.match(/^\d+\.\s/)) {
      const items = trimmed.split(/\n/).map((line) => {
        const content = line.replace(/^\d+\.\s*/, "").trim();
        return content ? `<li>${content}</li>` : "";
      }).filter(Boolean);
      return `<ol>${items.join("")}</ol>`;
    }

    // Bullet lists (- item)
    if (trimmed.match(/^-\s/)) {
      const items = trimmed.split(/\n/).map((line) => {
        const content = line.replace(/^-\s*/, "").trim();
        return content ? `<li>${content}</li>` : "";
      }).filter(Boolean);
      return `<ul>${items.join("")}</ul>`;
    }

    // Regular paragraph
    const withBreaks = trimmed.split("\n").map((l) => l.trim()).filter(Boolean).join("<br>");
    return `<p>${withBreaks}</p>`;
  }).filter(Boolean);

  // Add FAQ HTML section
  if (faqs.length > 0) {
    htmlParts.push(faqsToHtml(faqs));
  }

  // Add structured data (JSON-LD) for SEO/GEO
  const schemas: string[] = [];
  if (title) {
    schemas.push(generateArticleSchema(title, metaDescription || "", author || "Kirsten Karchmer"));
  }
  if (faqs.length > 0) {
    schemas.push(generateFaqSchema(faqs));
  }

  return schemas.join("\n") + "\n" + htmlParts.join("\n");
}

/**
 * Extract title and meta description from blog content.
 */
function extractBlogMeta(content: string): { title: string | null; metaDescription: string | null; cleanBody: string } {
  let title: string | null = null;
  let metaDescription: string | null = null;
  const lines = content.split("\n");
  const bodyLines: string[] = [];

  for (const line of lines) {
    const titleMatch = line.match(/^Title:\s*(.+)/i);
    const metaMatch = line.match(/^Meta description:\s*(.+)/i);

    if (titleMatch && !title) {
      title = titleMatch[1].trim();
    } else if (metaMatch && !metaDescription) {
      metaDescription = metaMatch[1].trim();
    } else {
      bodyLines.push(line);
    }
  }

  return { title, metaDescription, cleanBody: bodyLines.join("\n").trim() };
}

export interface ShopifyArticle {
  id: number;
  title: string;
  handle: string;
  published_at: string;
  url?: string;
}

/**
 * Publish a blog post to Shopify.
 */
export async function publishBlogToShopify(opts: {
  title: string;
  body: string;
  author?: string;
  tags?: string[];
  publishNow?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}): Promise<{ success: boolean; article?: ShopifyArticle; error?: string }> {
  const config = getConfig();
  if (!config) {
    return { success: false, error: "Shopify not configured. Add SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN to env vars." };
  }

  // Extract metadata from content if present
  const { title: extractedTitle, metaDescription, cleanBody } = extractBlogMeta(opts.body);
  const finalTitle = opts.title || extractedTitle || "Untitled";
  const bodyHtml = blogTextToHtml(cleanBody, finalTitle, metaDescription ?? undefined, opts.author);

  // Build the article payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articleData: Record<string, any> = {
    title: finalTitle,
    author: opts.author || "Kirsten Karchmer",
    body_html: bodyHtml,
    tags: opts.tags?.join(", ") || "",
    published: opts.publishNow !== false,
  };

  if (metaDescription) {
    articleData.summary_html = `<p>${metaDescription}</p>`;
    articleData.metafields_global_description_tag = metaDescription;
    articleData.metafields_global_title_tag = finalTitle;
  }

  if (opts.imageUrl) {
    articleData.image = {
      src: opts.imageUrl,
      alt: opts.imageAlt || finalTitle,
    };
  }

  // Determine blog ID — try env var, or fetch the first blog
  let blogId = config.blogId;
  if (!blogId) {
    try {
      const blogsRes = await fetch(
        `${config.baseUrl}/admin/api/${API_VERSION}/blogs.json`,
        {
          headers: {
            "X-Shopify-Access-Token": config.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      const blogsData = await blogsRes.json();
      blogId = blogsData?.blogs?.[0]?.id?.toString();
      if (!blogId) {
        return { success: false, error: "No blogs found in Shopify store. Create a blog first." };
      }
    } catch (err) {
      return { success: false, error: `Failed to fetch blogs: ${err instanceof Error ? err.message : String(err)}` };
    }
  }

  try {
    const response = await fetch(
      `${config.baseUrl}/admin/api/${API_VERSION}/blogs/${blogId}/articles.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": config.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: articleData }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Shopify API error:", response.status, errorBody);
      return { success: false, error: `Shopify API error ${response.status}: ${errorBody.slice(0, 200)}` };
    }

    const data = await response.json();
    const article = data.article;

    return {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        handle: article.handle,
        published_at: article.published_at,
        url: `${config.baseUrl}/blogs/${article.blog_id}/${article.handle}`,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Shopify publish error:", msg);
    return { success: false, error: msg };
  }
}
