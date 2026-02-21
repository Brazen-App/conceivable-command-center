const X_API_BASE = "https://api.x.com/2";

export interface XPostResult {
  success: boolean;
  tweetId?: string;
  error?: string;
}

/**
 * Get the authenticated user's X profile.
 */
export async function getXProfile(
  bearerToken: string
): Promise<{ id: string; username: string; name: string } | null> {
  try {
    const res = await fetch(`${X_API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

/**
 * Create a tweet on X/Twitter.
 */
export async function createTweet(
  bearerToken: string,
  params: {
    text: string;
  }
): Promise<XPostResult> {
  const res = await fetch(`${X_API_BASE}/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: params.text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: `X API error ${res.status}: ${JSON.stringify(errorData)}`,
    };
  }

  const data = await res.json();
  return { success: true, tweetId: data.data?.id };
}

/**
 * Verify an X/Twitter bearer token is valid.
 */
export async function verifyXToken(
  bearerToken: string
): Promise<{ valid: boolean; username?: string; name?: string }> {
  const profile = await getXProfile(bearerToken);
  if (!profile) return { valid: false };
  return { valid: true, username: profile.username, name: profile.name };
}
