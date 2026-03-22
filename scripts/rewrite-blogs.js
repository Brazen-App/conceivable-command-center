#!/usr/bin/env node
/**
 * Blog Rewriter — pulls each Shopify blog post, sends through Claude
 * with the new template (insight boxes, stat callouts, pull quotes,
 * dual CTAs, 3+3 FAQ), and pushes back to Shopify.
 *
 * Usage: ANTHROPIC_API_KEY=xxx SHOPIFY_TOKEN=xxx node scripts/rewrite-blogs.js
 */

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN || "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";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const STORE = "https://conceivable-fertility.myshopify.com";
const BLOG_ID = "87325901032";
const API_VERSION = "2024-01";
const CONCURRENCY = 3; // parallel rewrites

const REWRITE_PROMPT = `You are rewriting an existing Conceivable blog post to add editorial elements and CRO. You will receive the current HTML of a blog post. Your job:

1. KEEP all the existing content, voice, facts, and structure. Do NOT change the actual information or rewrite the prose unless it's factually wrong.

2. ADD these editorial elements naturally throughout the post (3-5 total, spread evenly):

INSIGHT BOX (blue):
<div style="background: #EEF0FF; border-radius: 12px; padding: 24px 28px; margin: 32px 0; border-left: 4px solid #5A6FFF;">
  <p style="font-size: 13px; font-weight: 700; color: #5A6FFF; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px;">KEY INSIGHT</p>
  <p style="font-size: 17px; line-height: 1.65; color: #2A2828; margin: 0; font-weight: 500;">The insight text — pull from the surrounding content.</p>
</div>

STAT CALLOUT (centered):
<div style="background: #F9F7F0; border-radius: 16px; padding: 32px; margin: 36px 0; text-align: center;">
  <p style="font-size: 48px; font-weight: 900; color: #5A6FFF; margin: 0 0 8px; line-height: 1;">NUMBER</p>
  <p style="font-size: 15px; color: #666; margin: 0;">Description of the stat</p>
</div>

PULL QUOTE (pink):
<blockquote style="border-left: 4px solid #E37FB1; padding: 20px 28px; margin: 36px 0; background: #FFF5F9; border-radius: 0 12px 12px 0;">
  <p style="font-size: 19px; line-height: 1.6; color: #2A2828; margin: 0; font-style: italic; font-weight: 500;">"Quote from the post."</p>
</blockquote>

CLINICAL EVIDENCE BOX (green):
<div style="background: #F0FFF4; border-radius: 12px; padding: 24px 28px; margin: 32px 0; border-left: 4px solid #1EAA55;">
  <p style="font-size: 13px; font-weight: 700; color: #1EAA55; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px;">📊 WHAT THE RESEARCH SAYS</p>
  <p style="font-size: 16px; line-height: 1.65; color: #2A2828; margin: 0;">Citation here.</p>
</div>

WARNING BOX (yellow):
<div style="background: #FFF8E7; border-radius: 12px; padding: 24px 28px; margin: 32px 0; border-left: 4px solid #F1C028;">
  <p style="font-size: 13px; font-weight: 700; color: #B8860B; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px;">⚠️ IMPORTANT</p>
  <p style="font-size: 16px; line-height: 1.65; color: #2A2828; margin: 0;">Warning content.</p>
</div>

3. ADD TWO CTA BLOCKS — one at ~40% through the post, one at ~80% (before FAQ):

CTA 1 (mid-post):
<div style="background: linear-gradient(135deg, #5A6FFF 0%, #9686B9 100%); border-radius: 16px; padding: 40px 32px; text-align: center; margin: 48px 0;">
  <h2 style="font-family: Georgia, serif; font-size: 24px; color: #fff; margin: 0 0 12px;">Not Sure What Your Body Needs?</h2>
  <p style="font-size: 16px; color: rgba(255,255,255,0.9); margin: 0 0 24px; max-width: 480px; display: inline-block; line-height: 1.6;">Take our free 2-minute quiz and get a personalized supplement protocol built around your specific cycle, hormones, and health signals.</p>
  <br>
  <a href="https://conceivable-quiz.vercel.app" style="display: inline-block; background: #fff; color: #5A6FFF; font-size: 16px; font-weight: 700; padding: 14px 36px; border-radius: 50px; text-decoration: none; margin: 0 8px 8px 0;">Take the Quiz →</a>
  <a href="https://conceivable.com" style="display: inline-block; background: transparent; color: #fff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 50px; text-decoration: none; border: 2px solid rgba(255,255,255,0.5);">Explore the App →</a>
</div>

CTA 2 (before FAQ):
<div style="background: #2A2828; border-radius: 16px; padding: 40px 32px; text-align: center; margin: 48px 0;">
  <p style="font-size: 13px; color: #5A6FFF; letter-spacing: 0.1em; font-weight: 700; margin: 0 0 8px;">✦ THE CONCEIVABLE SYSTEM</p>
  <h2 style="font-family: Georgia, serif; font-size: 24px; color: #fff; margin: 0 0 12px;">Personalized Supplements. AI Care Team. The Halo Ring.</h2>
  <p style="font-size: 16px; color: rgba(255,255,255,0.75); margin: 0 0 24px; max-width: 480px; display: inline-block; line-height: 1.6;">Everything your body needs to optimize fertility — built around your data, not someone else's.</p>
  <br>
  <a href="https://conceivable-quiz.vercel.app" style="display: inline-block; background: #5A6FFF; color: #fff; font-size: 16px; font-weight: 700; padding: 14px 36px; border-radius: 50px; text-decoration: none; margin: 0 8px 8px 0;">Take the Quiz →</a>
  <a href="https://conceivable.com" style="display: inline-block; background: transparent; color: #fff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 50px; text-decoration: none; border: 2px solid rgba(255,255,255,0.3);">Check Out the App →</a>
</div>

4. REPLACE or ADD the FAQ section. Keep any existing topic-specific FAQs (up to 3), then add these 3 STANDARD FAQs at the end:

<h3>How does the Conceivable system actually work?</h3>
<p>Conceivable combines three things: personalized supplement packs built from your quiz results and health data, an AI care team of 7 specialists (led by Kai, your fertility coordinator) who adjust your protocol as your body changes, and the Halo Ring for continuous biometric tracking. The system is built on 240,000+ clinical data points and 20 years of practice. It starts at $15/month.</p>

<h3>How do I know which supplements I actually need?</h3>
<p>Take the free 2-minute <a href="https://conceivable-quiz.vercel.app" style="color: #5A6FFF;">Conceivable quiz</a>. It analyzes your cycle patterns, energy, stress, digestion, and health history to identify the specific nutrients your body needs — not a generic prenatal, but a protocol built for exactly where you are right now.</p>

<h3>Do I need the Halo Ring to use Conceivable?</h3>
<p>No. The Halo Ring is optional and adds continuous tracking of BBT, HRV, sleep, and blood glucose — which Kai uses to fine-tune your protocol in real time. But the personalized supplement packs and AI care team work without it. The ring is a one-time $250 purchase with no subscription required.</p>

5. Output ONLY the complete updated HTML. No explanation, no markdown, just the HTML.`;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getArticle(id) {
  const res = await fetch(
    `${STORE}/admin/api/${API_VERSION}/blogs/${BLOG_ID}/articles/${id}.json`,
    { headers: { "X-Shopify-Access-Token": SHOPIFY_TOKEN } }
  );
  if (!res.ok) throw new Error(`Fetch article ${id} failed: ${res.status}`);
  return (await res.json()).article;
}

async function rewriteWithClaude(title, html) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: REWRITE_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the blog post "${title}". Rewrite it with the editorial elements, CTAs, and FAQ structure described above. Keep the existing content intact — just enhance it.\n\n${html}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

async function updateArticle(id, bodyHtml) {
  const res = await fetch(
    `${STORE}/admin/api/${API_VERSION}/blogs/${BLOG_ID}/articles/${id}.json`,
    {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ article: { id, body_html: bodyHtml } }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Update article ${id} failed: ${res.status} ${err.slice(0, 200)}`);
  }
  return (await res.json()).article;
}

async function processArticle(id, title, index, total) {
  try {
    console.log(`[${index + 1}/${total}] Processing: ${title}`);

    // Get current content
    const article = await getArticle(id);
    const currentHtml = article.body_html || "";

    // Skip if already has CTAs
    if (currentHtml.includes("conceivable-quiz.vercel.app") && currentHtml.includes("THE CONCEIVABLE SYSTEM")) {
      console.log(`  ⏭ Already has CTAs, skipping`);
      return { id, title, status: "skipped" };
    }

    // Rewrite with Claude
    const newHtml = await rewriteWithClaude(title, currentHtml);

    if (!newHtml || newHtml.length < 500) {
      console.log(`  ⚠ Rewrite too short (${newHtml.length} chars), skipping`);
      return { id, title, status: "error", reason: "rewrite too short" };
    }

    // Update on Shopify
    await updateArticle(id, newHtml);
    console.log(`  ✓ Updated (${currentHtml.length} → ${newHtml.length} chars)`);

    return { id, title, status: "updated", oldSize: currentHtml.length, newSize: newHtml.length };
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
    return { id, title, status: "error", reason: err.message };
  }
}

async function main() {
  if (!ANTHROPIC_KEY) {
    console.error("ANTHROPIC_API_KEY required");
    process.exit(1);
  }

  // Read article list
  const fs = require("fs");
  const lines = fs.readFileSync("/tmp/blog-article-ids.txt", "utf-8").trim().split("\n");
  const articles = lines.map(l => {
    const [id, ...titleParts] = l.split("|");
    return { id, title: titleParts.join("|") };
  });

  console.log(`\n🚀 Rewriting ${articles.length} blog posts with editorial elements + CTAs\n`);

  const results = [];

  // Process in batches of CONCURRENCY
  for (let i = 0; i < articles.length; i += CONCURRENCY) {
    const batch = articles.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((a, j) => processArticle(a.id, a.title, i + j, articles.length))
    );
    results.push(...batchResults);

    // Rate limit — wait between batches
    if (i + CONCURRENCY < articles.length) {
      await sleep(2000);
    }
  }

  // Summary
  const updated = results.filter(r => r.status === "updated").length;
  const skipped = results.filter(r => r.status === "skipped").length;
  const errors = results.filter(r => r.status === "error").length;

  console.log(`\n═══ DONE ═══`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);

  if (errors > 0) {
    console.log(`\nFailed posts:`);
    results.filter(r => r.status === "error").forEach(r => {
      console.log(`  - ${r.title}: ${r.reason}`);
    });
  }
}

main().catch(console.error);
