import { NextResponse } from "next/server";

// In-memory cache for Circle API data
let cachedData: { data: CommunityStats; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CommunityStats {
  totalMembers: number;
  activeMembers: number;
  recentPosts: number;
  recentComments: number;
  newMembersThisWeek: number;
  spaces: { id: number; name: string; slug: string; memberCount?: number }[];
  topPosts: { id: number; name: string; likesCount: number; commentsCount: number; createdAt: string }[];
  source: "circle_api" | "mock";
}

const CIRCLE_BASE_URL = "https://app.circle.so/api/v1";

function getToken(): string | null {
  return process.env.CIRCLE_API_TOKEN ?? null;
}

async function circleFetch(path: string, token: string) {
  const res = await fetch(`${CIRCLE_BASE_URL}${path}`, {
    headers: { Authorization: `Token ${token}` },
    next: { revalidate: 300 }, // 5 min cache at fetch level too
  });
  if (!res.ok) {
    throw new Error(`Circle API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function fetchCircleStats(token: string): Promise<CommunityStats> {
  // 1. Get community
  const communityData = await circleFetch("/communities", token);
  const community = Array.isArray(communityData) ? communityData[0] : communityData;
  if (!community) throw new Error("No Circle community found");
  const communityId = community.id;

  // 2. Get spaces
  const spaces = await circleFetch(`/spaces?community_id=${communityId}`, token);

  // 3. Get members (paginated — fetch first page to get count)
  const members = await circleFetch(
    `/community_members?community_id=${communityId}&per_page=1`,
    token
  );
  // Circle returns an array; use headers or array length heuristic
  // For total count, we check if the response has a meta or just count the community-level stat
  const totalMembers = community.member_count ?? community.members_count ?? (Array.isArray(members) ? members.length : 0);

  // 4. Get recent posts across the community
  const posts = await circleFetch(
    `/posts?community_id=${communityId}&per_page=20&sort=latest`,
    token
  );

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentPosts = Array.isArray(posts)
    ? posts.filter((p: { created_at: string }) => new Date(p.created_at) >= oneWeekAgo)
    : [];

  const recentComments = Array.isArray(posts)
    ? posts
        .filter((p: { created_at: string }) => new Date(p.created_at) >= oneWeekAgo)
        .reduce((sum: number, p: { comments_count?: number }) => sum + (p.comments_count ?? 0), 0)
    : 0;

  // Unique active authors this week
  const activeAuthors = new Set(
    recentPosts.map((p: { user_id: number }) => p.user_id)
  );

  // New members this week — fetch recent members sorted by join date
  let newMembersThisWeek = 0;
  try {
    const recentMembers = await circleFetch(
      `/community_members?community_id=${communityId}&per_page=50&sort=latest`,
      token
    );
    if (Array.isArray(recentMembers)) {
      newMembersThisWeek = recentMembers.filter(
        (m: { created_at: string }) => new Date(m.created_at) >= oneWeekAgo
      ).length;
    }
  } catch {
    // non-critical, leave as 0
  }

  const topPosts = (Array.isArray(posts) ? posts : [])
    .slice(0, 5)
    .map((p: { id: number; name: string; likes_count?: number; comments_count?: number; created_at: string }) => ({
      id: p.id,
      name: p.name,
      likesCount: p.likes_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      createdAt: p.created_at,
    }));

  return {
    totalMembers: typeof totalMembers === "number" ? totalMembers : 220,
    activeMembers: activeAuthors.size,
    recentPosts: recentPosts.length,
    recentComments,
    newMembersThisWeek,
    spaces: (Array.isArray(spaces) ? spaces : []).map(
      (s: { id: number; name: string; slug: string; members_count?: number }) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        memberCount: s.members_count,
      })
    ),
    topPosts,
    source: "circle_api" as const,
  };
}

function getMockStats(): CommunityStats {
  return {
    totalMembers: 220,
    activeMembers: 0,
    recentPosts: 0,
    recentComments: 0,
    newMembersThisWeek: 0,
    spaces: [],
    topPosts: [],
    source: "mock",
  };
}

export async function GET() {
  try {
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data, {
        headers: { "X-Cache": "HIT", "Cache-Control": "public, max-age=300" },
      });
    }

    const token = getToken();
    let stats: CommunityStats;

    if (token) {
      try {
        stats = await fetchCircleStats(token);
      } catch (error) {
        console.error("[community] Circle API error, falling back to mock:", error);
        stats = getMockStats();
      }
    } else {
      console.log("[community] CIRCLE_API_TOKEN not set, using mock data");
      stats = getMockStats();
    }

    // Update cache
    cachedData = { data: stats, timestamp: Date.now() };

    return NextResponse.json(stats, {
      headers: { "X-Cache": "MISS", "Cache-Control": "public, max-age=300" },
    });
  } catch (error) {
    console.error("[community]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
