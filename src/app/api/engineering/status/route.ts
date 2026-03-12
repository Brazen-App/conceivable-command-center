import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/engineering/status
 * Returns live engineering data: Vercel deploys, GitHub activity, DB stats, integration health.
 * Falls back gracefully when API tokens aren't configured.
 */
export async function GET() {
  const results: Record<string, unknown> = {};

  // ── 1. Database Stats (always available) ──
  try {
    const [experienceCount, featureCount, chatLogCount] = await Promise.all([
      prisma.experience.count(),
      prisma.feature.count(),
      prisma.chatLog.count(),
    ]);
    results.database = {
      connected: true,
      experiences: experienceCount,
      features: featureCount,
      chatLogs: chatLogCount,
      totalRecords: experienceCount + featureCount + chatLogCount,
    };
  } catch {
    results.database = { connected: false };
  }

  // ── 2. Vercel Deployments (requires VERCEL_API_TOKEN) ──
  const vercelToken = process.env.VERCEL_API_TOKEN;
  const vercelProjectId = "prj_icdnRrC2VD05w9fSDuR4Ph7d0wlk";
  const vercelTeamId = "team_WA9VI2diAxMMKaWv8vbgyNwv";

  if (vercelToken) {
    try {
      const res = await fetch(
        `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&teamId=${vercelTeamId}&limit=5&state=READY`,
        { headers: { Authorization: `Bearer ${vercelToken}` }, next: { revalidate: 60 } }
      );
      if (res.ok) {
        const data = await res.json();
        const deployments = (data.deployments || []).map((d: Record<string, unknown>) => ({
          id: d.uid,
          url: d.url,
          state: d.state,
          createdAt: d.createdAt,
          meta: d.meta,
        }));
        results.vercel = {
          connected: true,
          deployments,
          totalDeployments: data.pagination?.count || deployments.length,
        };
      } else {
        results.vercel = { connected: false, error: `HTTP ${res.status}` };
      }
    } catch {
      results.vercel = { connected: false, error: "fetch failed" };
    }
  } else {
    results.vercel = { connected: false, needsToken: true };
  }

  // ── 3. GitHub Activity (requires GITHUB_TOKEN) ──
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = "Brazen-App/conceivable-command-center";

  if (githubToken) {
    try {
      const [commitsRes, prsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${githubRepo}/commits?per_page=5`, {
          headers: { Authorization: `token ${githubToken}`, Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 60 },
        }),
        fetch(`https://api.github.com/repos/${githubRepo}/pulls?state=all&per_page=5`, {
          headers: { Authorization: `token ${githubToken}`, Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 60 },
        }),
      ]);

      const commits = commitsRes.ok ? await commitsRes.json() : [];
      const prs = prsRes.ok ? await prsRes.json() : [];

      results.github = {
        connected: true,
        recentCommits: (commits as Record<string, unknown>[]).map((c: Record<string, unknown>) => ({
          sha: (c.sha as string)?.slice(0, 7),
          message: (c.commit as Record<string, unknown>)?.message,
          date: ((c.commit as Record<string, unknown>)?.author as Record<string, unknown>)?.date,
          author: ((c.commit as Record<string, unknown>)?.author as Record<string, unknown>)?.name,
        })),
        recentPRs: (prs as Record<string, unknown>[]).map((p: Record<string, unknown>) => ({
          number: p.number,
          title: p.title,
          state: p.state,
          createdAt: p.created_at,
        })),
      };
    } catch {
      results.github = { connected: false, error: "fetch failed" };
    }
  } else {
    results.github = { connected: false, needsToken: true };
  }

  // ── 4. Integration Health Check (env var presence) ──
  results.integrations = {
    anthropic: { connected: !!process.env.ANTHROPIC_API_KEY, name: "Anthropic Claude" },
    gemini: { connected: !!process.env.GEMINI_API_KEY, name: "Google Gemini" },
    mailchimp: { connected: !!process.env.MAILCHIMP_API_KEY, name: "Mailchimp" },
    late: { connected: !!process.env.LATE_API_KEY, name: "Late.dev (Social)" },
    database: { connected: !!process.env.DATABASE_URL, name: "PostgreSQL" },
    vercel: { connected: !!vercelToken, name: "Vercel API" },
    github: { connected: !!githubToken, name: "GitHub API" },
    shopify: { connected: !!process.env.SHOPIFY_ACCESS_TOKEN, name: "Shopify" },
    fal: { connected: !!process.env.FAL_KEY, name: "Fal.ai" },
    circle: { connected: !!process.env.CIRCLE_API_TOKEN, name: "Circle" },
    ga4: { connected: !!process.env.GA4_PROPERTY_ID, name: "Google Analytics 4" },
  };

  return NextResponse.json(results);
}
