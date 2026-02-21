const BUFFER_API_BASE = "https://api.bufferapp.com/1";

export interface BufferProfile {
  id: string;
  service: string;
  service_username: string;
  formatted_service: string;
  avatar_https: string;
  default: boolean;
}

export interface BufferUpdateResult {
  success: boolean;
  message: string;
  updates: Array<{
    id: string;
    status: string;
    text: string;
    scheduled_at?: string;
  }>;
}

async function bufferFetch(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BUFFER_API_BASE}${endpoint}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });
}

export async function getProfiles(
  accessToken: string
): Promise<BufferProfile[]> {
  const res = await bufferFetch("/profiles.json", accessToken);
  if (!res.ok) {
    throw new Error(`Buffer API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function createUpdate(
  accessToken: string,
  params: {
    profileIds: string[];
    text: string;
    scheduledAt?: string;
    media?: { photo?: string; thumbnail?: string; description?: string };
  }
): Promise<BufferUpdateResult> {
  const body = new URLSearchParams();
  body.append("text", params.text);
  for (const profileId of params.profileIds) {
    body.append("profile_ids[]", profileId);
  }
  if (params.scheduledAt) {
    body.append("scheduled_at", params.scheduledAt);
  }
  if (params.media?.photo) {
    body.append("media[photo]", params.media.photo);
  }
  if (params.media?.thumbnail) {
    body.append("media[thumbnail]", params.media.thumbnail);
  }
  if (params.media?.description) {
    body.append("media[description]", params.media.description);
  }

  const res = await bufferFetch("/updates/create.json", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Buffer API error: ${res.status} — ${JSON.stringify(errorData)}`
    );
  }

  return res.json();
}

export async function verifyToken(
  accessToken: string
): Promise<{ name: string; id: string } | null> {
  try {
    const res = await bufferFetch("/user.json", accessToken);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Map our internal platform names to Buffer service names
export function mapPlatformToBufferService(
  platform: string
): string | null {
  const map: Record<string, string> = {
    linkedin: "linkedin",
    "instagram-post": "instagram",
    "instagram-carousel": "instagram",
    pinterest: "pinterest",
    tiktok: "tiktok",
    youtube: "youtube",
    blog: null as unknown as string,
  };
  return map[platform] ?? null;
}
