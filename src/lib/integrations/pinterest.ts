const PINTEREST_API_BASE = "https://api.pinterest.com/v5";

export interface PinterestPinResult {
  success: boolean;
  pinId?: string;
  error?: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  description?: string;
}

/**
 * Get the authenticated user's Pinterest profile.
 */
export async function getPinterestProfile(
  accessToken: string
): Promise<{ username: string } | null> {
  try {
    const res = await fetch(`${PINTEREST_API_BASE}/user_account`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { username: data.username };
  } catch {
    return null;
  }
}

/**
 * List the user's Pinterest boards.
 */
export async function getPinterestBoards(
  accessToken: string
): Promise<PinterestBoard[]> {
  const res = await fetch(`${PINTEREST_API_BASE}/boards`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).map((b: Record<string, string>) => ({
    id: b.id,
    name: b.name,
    description: b.description,
  }));
}

/**
 * Create a pin on Pinterest.
 */
export async function createPin(
  accessToken: string,
  params: {
    boardId: string;
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
    altText?: string;
  }
): Promise<PinterestPinResult> {
  const body: Record<string, unknown> = {
    board_id: params.boardId,
    title: params.title,
    description: params.description,
    media_source: {
      source_type: "image_url",
      url: params.imageUrl,
    },
  };

  if (params.link) body.link = params.link;
  if (params.altText) body.alt_text = params.altText;

  const res = await fetch(`${PINTEREST_API_BASE}/pins`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: `Pinterest API error ${res.status}: ${JSON.stringify(errorData)}`,
    };
  }

  const data = await res.json();
  return { success: true, pinId: data.id };
}

/**
 * Verify a Pinterest access token.
 */
export async function verifyPinterestToken(
  accessToken: string
): Promise<{ valid: boolean; username?: string }> {
  const profile = await getPinterestProfile(accessToken);
  if (!profile) return { valid: false };
  return { valid: true, username: profile.username };
}
