/**
 * Bluesky (AT Protocol) integration for posting content.
 *
 * Env vars needed:
 *   BLUESKY_HANDLE   — e.g., "conceivable.bsky.social"
 *   BLUESKY_PASSWORD  — app password (Settings → App Passwords in Bluesky)
 */

const BSKY_API = "https://bsky.social/xrpc";

interface BlueskySession {
  accessJwt: string;
  did: string;
}

let sessionCache: BlueskySession | null = null;
let sessionExpiry = 0;

/**
 * Create a session (login) with Bluesky.
 */
async function getSession(): Promise<BlueskySession> {
  if (sessionCache && Date.now() < sessionExpiry) return sessionCache;

  const handle = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_PASSWORD;

  if (!handle || !password) {
    throw new Error("BLUESKY_HANDLE and BLUESKY_PASSWORD must be set");
  }

  const res = await fetch(`${BSKY_API}/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "unknown");
    throw new Error(`Bluesky login failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  sessionCache = { accessJwt: data.accessJwt, did: data.did };
  sessionExpiry = Date.now() + 55 * 60 * 1000; // refresh after 55 min
  return sessionCache;
}

/**
 * Upload an image to Bluesky and return a blob reference.
 */
async function uploadImage(
  session: BlueskySession,
  imageData: string
): Promise<{ $type: string; ref: { $link: string }; mimeType: string; size: number } | null> {
  try {
    // Convert base64 data URL to buffer
    const base64 = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    const mimeType = imageData.match(/^data:(image\/\w+);/)?.[1] || "image/png";

    const res = await fetch(`${BSKY_API}/com.atproto.repo.uploadBlob`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": mimeType,
      },
      body: buffer,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.blob;
  } catch {
    return null;
  }
}

/**
 * Parse facets (links, hashtags, mentions) from post text for Bluesky rich text.
 */
function parseFacets(text: string): Array<{
  index: { byteStart: number; byteEnd: number };
  features: Array<{ $type: string; uri?: string; tag?: string }>;
}> {
  const facets: Array<{
    index: { byteStart: number; byteEnd: number };
    features: Array<{ $type: string; uri?: string; tag?: string }>;
  }> = [];

  // URLs
  const urlRegex = /https?:\/\/[^\s)]+/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const start = Buffer.byteLength(text.slice(0, match.index));
    const end = start + Buffer.byteLength(match[0]);
    facets.push({
      index: { byteStart: start, byteEnd: end },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: match[0] }],
    });
  }

  // Hashtags
  const hashRegex = /#(\w+)/g;
  while ((match = hashRegex.exec(text)) !== null) {
    const start = Buffer.byteLength(text.slice(0, match.index));
    const end = start + Buffer.byteLength(match[0]);
    facets.push({
      index: { byteStart: start, byteEnd: end },
      features: [{ $type: "app.bsky.richtext.facet#tag", tag: match[1] }],
    });
  }

  return facets;
}

/**
 * Create a post on Bluesky.
 */
export async function createBlueskyPost(
  text: string,
  imageData?: string,
  imageAlt?: string
): Promise<{ success: boolean; uri?: string; error?: string }> {
  try {
    const session = await getSession();

    // Build the post record
    const record: Record<string, unknown> = {
      $type: "app.bsky.feed.post",
      text: text.slice(0, 300), // Bluesky max is 300 chars
      createdAt: new Date().toISOString(),
      facets: parseFacets(text),
    };

    // Upload and attach image if provided
    if (imageData) {
      const blob = await uploadImage(session, imageData);
      if (blob) {
        record.embed = {
          $type: "app.bsky.embed.images",
          images: [{ alt: imageAlt || "", image: blob }],
        };
      }
    }

    const res = await fetch(`${BSKY_API}/com.atproto.repo.createRecord`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown");
      return { success: false, error: `Bluesky post failed (${res.status}): ${err}` };
    }

    const data = await res.json();
    return { success: true, uri: data.uri };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Verify Bluesky credentials are valid.
 */
export async function verifyBluesky(): Promise<boolean> {
  try {
    await getSession();
    return true;
  } catch {
    return false;
  }
}

export function isBlueskyConfigured(): boolean {
  return !!(process.env.BLUESKY_HANDLE && process.env.BLUESKY_PASSWORD);
}
