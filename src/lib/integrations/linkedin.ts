const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";
const LINKEDIN_REST_BASE = "https://api.linkedin.com/rest";

export interface LinkedInPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Get the authenticated user's LinkedIn profile URN.
 */
export async function getLinkedInProfile(
  accessToken: string
): Promise<{ sub: string; name: string } | null> {
  try {
    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { sub: data.sub, name: data.name };
  } catch {
    return null;
  }
}

/**
 * Create a text post (or text + image) on LinkedIn using the Posts API.
 */
export async function createLinkedInPost(
  accessToken: string,
  params: {
    authorUrn: string; // "urn:li:person:<id>"
    text: string;
    imageUrl?: string;
  }
): Promise<LinkedInPostResult> {
  const body: Record<string, unknown> = {
    author: params.authorUrn,
    lifecycleState: "PUBLISHED",
    visibility: "PUBLIC",
    commentary: params.text,
    distribution: {
      feedDistribution: "MAIN_FEED",
    },
  };

  if (params.imageUrl) {
    // For image posts, we include the image as a URL article
    body.content = {
      article: {
        source: params.imageUrl,
        title: params.text.slice(0, 100),
      },
    };
  }

  const res = await fetch(`${LINKEDIN_REST_BASE}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: `LinkedIn API error ${res.status}: ${JSON.stringify(errorData)}`,
    };
  }

  const postId = res.headers.get("x-restli-id") ?? undefined;
  return { success: true, postId };
}

/**
 * Verify a LinkedIn access token is valid.
 */
export async function verifyLinkedInToken(
  accessToken: string
): Promise<{ valid: boolean; name?: string; sub?: string }> {
  const profile = await getLinkedInProfile(accessToken);
  if (!profile) return { valid: false };
  return { valid: true, name: profile.name, sub: profile.sub };
}
