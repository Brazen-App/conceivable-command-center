#!/usr/bin/env node
/**
 * Blog Cross-Linker & Tagger
 *
 * Fetches all Shopify blog articles, assigns topic tags to untagged posts,
 * appends "Related Reading" cross-links, and adds a quiz CTA to every post.
 *
 * Usage:
 *   node scripts/blog-crosslink.js              # dry run (default)
 *   node scripts/blog-crosslink.js --live        # actually update Shopify
 */

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN || "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";
const STORE = "https://conceivable-fertility.myshopify.com";
const API_VERSION = "2024-01";

const DRY_RUN = !process.argv.includes("--live");

const BLOGS = [
  { id: "87325901032", name: "A Conceivable Life", path: "fertility-insights" },
  { id: "87122608360", name: "News", path: "news" },
];

// ── Topic clusters ──────────────────────────────────────────────
const TOPIC_CLUSTERS = {
  "Supplements": [
    "coq10", "vitamin", "supplement", "nac", "inositol", "folate",
    "folic", "iron", "selenium", "probiotic", "herb", "berberine",
    "ashwagandha", "rhodiola",
  ],
  "IVF & Treatments": [
    "ivf", "iui", "clomid", "egg-freezing", "fertility-drugs",
  ],
  "PCOS": ["pcos", "insulin-resistance", "testosterone"],
  "Egg Quality": ["egg-quality", "improving-egg", "amh"],
  "Cycle Health": [
    "bbt", "cycle", "period", "menstrual", "ovulation", "pms",
    "luteal", "progesterone", "estrogen",
  ],
  "Male Fertility": ["sperm", "male-fertility", "semen"],
  "Diet & Nutrition": [
    "eat", "food", "diet", "protein", "fiber", "sugar", "carbs",
    "chocolate", "dairy", "mediterranean",
  ],
  "Lifestyle": [
    "sleep", "stress", "cortisol", "exercise", "alcohol", "drinking",
    "skincare", "dental", "cbd", "water",
  ],
  "Conceivable": [
    "conceivable", "halo-ring", "kai", "ai-fertility", "smart-ring",
    "mira", "oura",
  ],
  "Emotional Health": [
    "infertility-stress", "emotional", "navigating", "trying-to-conceive",
  ],
  "Endometriosis": ["endometriosis", "endo"],
  "Pregnancy": [
    "pregnancy", "miscarriage", "implantation", "two-week-wait",
  ],
};

// Related cluster fallbacks — if a cluster has < 3 posts, pull from these
const RELATED_CLUSTERS = {
  "Supplements": ["Diet & Nutrition", "PCOS", "Egg Quality"],
  "IVF & Treatments": ["Egg Quality", "Supplements", "Emotional Health"],
  "PCOS": ["Supplements", "Diet & Nutrition", "Cycle Health"],
  "Egg Quality": ["Supplements", "IVF & Treatments", "Cycle Health"],
  "Cycle Health": ["Egg Quality", "Supplements", "Lifestyle"],
  "Male Fertility": ["Supplements", "Lifestyle", "Diet & Nutrition"],
  "Diet & Nutrition": ["Supplements", "Lifestyle", "PCOS"],
  "Lifestyle": ["Diet & Nutrition", "Emotional Health", "Cycle Health"],
  "Conceivable": ["Lifestyle", "Supplements", "Egg Quality"],
  "Emotional Health": ["Lifestyle", "Conceivable", "Pregnancy"],
  "Endometriosis": ["Cycle Health", "Supplements", "Emotional Health"],
  "Pregnancy": ["Emotional Health", "Supplements", "Cycle Health"],
};

// ── Helpers ──────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shopifyGet(path) {
  const url = `${STORE}/admin/api/${API_VERSION}/${path}`;
  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function shopifyPut(path, body) {
  const url = `${STORE}/admin/api/${API_VERSION}/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Fetch all articles with pagination ──────────────────────────

async function fetchAllArticles(blogId) {
  const articles = [];
  let page = 1;
  let sinceId = 0;
  while (true) {
    const params = `limit=250${sinceId ? `&since_id=${sinceId}` : ""}`;
    const data = await shopifyGet(`blogs/${blogId}/articles.json?${params}`);
    await sleep(600);
    if (!data.articles || data.articles.length === 0) break;
    articles.push(...data.articles);
    sinceId = data.articles[data.articles.length - 1].id;
    if (data.articles.length < 250) break;
    page++;
  }
  return articles;
}

// ── Assign topic from handle/title ──────────────────────────────

function detectTopics(handle, title) {
  const text = `${handle} ${(title || "").toLowerCase().replace(/[^a-z0-9 -]/g, "")}`;
  const matched = [];
  for (const [topic, keywords] of Object.entries(TOPIC_CLUSTERS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        matched.push(topic);
        break;
      }
    }
  }
  return matched;
}

// ── Build cross-link HTML ───────────────────────────────────────

function buildRelatedHTML(relatedPosts) {
  const items = relatedPosts
    .map(
      (p) =>
        `<li style="margin:0 0 8px;"><a href="/blogs/${p.blogPath}/${p.handle}" style="color:#5A6FFF;font-size:15px;font-weight:600;text-decoration:none;">${escapeHTML(p.title)} →</a></li>`
    )
    .join("\n        ");

  return `
<div style="background:#F5F3FF;border-radius:16px;padding:24px;margin:32px 0;">
  <p style="font-size:12px;font-weight:800;letter-spacing:0.15em;color:#5A6FFF;text-transform:uppercase;margin:0 0 12px;">✦ KEEP READING</p>
  <ul style="list-style:none;padding:0;margin:0;">
        ${items}
  </ul>
</div>`;
}

const QUIZ_CTA = `
<div style="background:linear-gradient(135deg,#5A6FFF,#356FB6);border-radius:16px;padding:28px;margin:32px 0;text-align:center;">
  <p style="font-size:18px;font-weight:800;color:#fff;margin:0 0 8px;">Find out exactly what your body needs</p>
  <p style="font-size:14px;color:#ACB7FF;margin:0 0 16px;">Our 2-minute quiz builds a supplement protocol around your specific signals.</p>
  <a href="https://conceivable-quiz.vercel.app" style="display:inline-block;background:#fff;color:#5A6FFF;font-size:14px;font-weight:800;text-decoration:none;padding:12px 28px;border-radius:100px;letter-spacing:0.04em;text-transform:uppercase;">Take the Quiz →</a>
</div>`;

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Find related posts ──────────────────────────────────────────

function findRelatedPosts(article, allArticles, topicMap, count = 4) {
  // Get this article's topics
  const myTopics = topicMap.get(article.id) || [];
  const candidates = new Map(); // id → {score, article}

  // Score by same-cluster membership
  for (const topic of myTopics) {
    const clusterIds = [];
    for (const [id, topics] of topicMap.entries()) {
      if (id !== article.id && topics.includes(topic)) {
        clusterIds.push(id);
      }
    }
    for (const id of clusterIds) {
      const existing = candidates.get(id);
      candidates.set(id, {
        score: (existing?.score || 0) + 2,
        article: allArticles.find((a) => a.id === id),
      });
    }
  }

  // If we need more, pull from related clusters
  if (candidates.size < count) {
    for (const topic of myTopics) {
      const fallbacks = RELATED_CLUSTERS[topic] || [];
      for (const fbTopic of fallbacks) {
        for (const [id, topics] of topicMap.entries()) {
          if (id !== article.id && topics.includes(fbTopic) && !candidates.has(id)) {
            candidates.set(id, {
              score: 1,
              article: allArticles.find((a) => a.id === id),
            });
          }
        }
        if (candidates.size >= count * 2) break;
      }
      if (candidates.size >= count * 2) break;
    }
  }

  // Sort by score desc, take top N
  return [...candidates.values()]
    .filter((c) => c.article)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((c) => c.article);
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔗 Blog Cross-Linker & Tagger`);
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN (pass --live to update)" : "⚡ LIVE — will update Shopify"}\n`);

  // 1. Fetch all articles
  const allArticles = [];
  const blogPathMap = new Map(); // articleId → blogPath

  for (const blog of BLOGS) {
    console.log(`Fetching articles from "${blog.name}" (blog ${blog.id})...`);
    const articles = await fetchAllArticles(blog.id);
    console.log(`  → ${articles.length} articles\n`);
    for (const a of articles) {
      a._blogId = blog.id;
      a._blogPath = blog.path;
      a._blogName = blog.name;
      blogPathMap.set(a.id, blog.path);
    }
    allArticles.push(...articles);
  }

  console.log(`Total articles: ${allArticles.length}\n`);

  // 2. Detect topics and build topic map
  const topicMap = new Map(); // articleId → [topic1, topic2, ...]
  for (const a of allArticles) {
    const topics = detectTopics(a.handle, a.title);
    topicMap.set(a.id, topics);
  }

  // 3. Process each article
  let updated = 0;
  let skipped = 0;

  for (const article of allArticles) {
    const handle = article.handle;
    const existingTags = (article.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
    const detectedTopics = topicMap.get(article.id) || [];
    let newTags = [...existingTags];
    let tagsAdded = [];

    // Add topic tags if not already present
    for (const topic of detectedTopics) {
      if (!existingTags.includes(topic)) {
        newTags.push(topic);
        tagsAdded.push(topic);
      }
    }

    // Deduplicate tags
    newTags = [...new Set(newTags)];

    // Find related posts for cross-links
    const related = findRelatedPosts(article, allArticles, topicMap, 4);
    const relatedWithPaths = related.map((r) => ({
      ...r,
      blogPath: r._blogPath,
    }));

    // Build the new body_html
    let body = article.body_html || "";
    let crossLinksAdded = 0;
    let quizAdded = false;

    // Check if already has a "KEEP READING" section
    const hasRelated = body.includes("KEEP READING") || body.includes("Related Reading");

    // Check if already has quiz CTA
    const hasQuiz = body.includes("conceivable-quiz.vercel.app");

    // Remove existing "KEEP READING" section if present (we'll rebuild it)
    if (hasRelated) {
      // Try to strip existing related section so we can rebuild
      body = body.replace(/<div[^>]*>[\s\S]*?KEEP READING[\s\S]*?<\/div>\s*<\/div>/gi, "");
      // Also try simpler patterns
      body = body.replace(/<div[^>]*background:#F5F3FF[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/gi, "");
    }

    // Add cross-links if we have related posts
    if (relatedWithPaths.length > 0) {
      // Insert before quiz CTA if it exists, otherwise append
      const relatedHTML = buildRelatedHTML(relatedWithPaths);

      if (hasQuiz) {
        // Insert before the quiz CTA
        const quizIdx = body.indexOf("conceivable-quiz.vercel.app");
        // Find the start of the quiz div
        const beforeQuiz = body.lastIndexOf("<div", quizIdx);
        if (beforeQuiz > -1) {
          body = body.slice(0, beforeQuiz) + relatedHTML + "\n" + body.slice(beforeQuiz);
        } else {
          body += relatedHTML;
        }
      } else {
        body += relatedHTML;
      }
      crossLinksAdded = relatedWithPaths.length;
    }

    // Add quiz CTA if not present
    if (!hasQuiz) {
      body += QUIZ_CTA;
      quizAdded = true;
    }

    // Determine if anything changed
    const tagsChanged = tagsAdded.length > 0;
    const bodyChanged = body !== article.body_html;

    if (!tagsChanged && !bodyChanged) {
      skipped++;
      continue;
    }

    // Log
    console.log(
      `${DRY_RUN ? "[DRY] " : ""}${handle}` +
        `  |  tags: ${tagsAdded.length > 0 ? "+" + tagsAdded.join(", +") : "—"}` +
        `  |  cross-links: ${crossLinksAdded}` +
        `  |  quiz CTA: ${quizAdded ? "added" : "exists"}` +
        `  |  topic: ${detectedTopics.join(", ") || "none"}`
    );

    if (!DRY_RUN) {
      const payload = { article: { id: article.id } };
      if (bodyChanged) payload.article.body_html = body;
      if (tagsChanged) payload.article.tags = newTags.join(", ");

      try {
        await shopifyPut(
          `blogs/${article._blogId}/articles/${article.id}.json`,
          payload
        );
        await sleep(600);
        updated++;
      } catch (err) {
        console.error(`  ✗ FAILED: ${err.message}`);
      }
    } else {
      updated++;
    }
  }

  console.log(`\n────────────────────────────────────`);
  console.log(`Done. ${updated} articles ${DRY_RUN ? "would be " : ""}updated, ${skipped} unchanged.`);
  if (DRY_RUN) console.log(`\nRun with --live to apply changes.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
