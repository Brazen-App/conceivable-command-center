const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export interface InstagramPostResult {
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Get the Instagram Business account linked to a Facebook page token.
 */
export async function getInstagramAccount(
  accessToken: string
): Promise<{ id: string; username: string; name: string } | null> {
  try {
    // Get the user's pages
    const pagesRes = await fetch(
      `${GRAPH_API_BASE}/me/accounts?fields=instagram_business_account,name&access_token=${accessToken}`
    );
    if (!pagesRes.ok) return null;
    const pagesData = await pagesRes.json();

    const page = pagesData.data?.find(
      (p: Record<string, unknown>) => p.instagram_business_account
    );
    if (!page?.instagram_business_account?.id) return null;

    const igId = page.instagram_business_account.id;

    // Get the IG account details
    const igRes = await fetch(
      `${GRAPH_API_BASE}/${igId}?fields=username,name&access_token=${accessToken}`
    );
    if (!igRes.ok) return null;
    const igData = await igRes.json();

    return { id: igId, username: igData.username, name: igData.name ?? igData.username };
  } catch {
    return null;
  }
}

/**
 * Publish a single image post to Instagram via the Content Publishing API.
 * Requires a publicly accessible image URL.
 */
export async function createInstagramPost(
  accessToken: string,
  params: {
    igUserId: string;
    imageUrl: string;
    caption: string;
  }
): Promise<InstagramPostResult> {
  // Step 1: Create a media container
  const containerRes = await fetch(
    `${GRAPH_API_BASE}/${params.igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: params.imageUrl,
        caption: params.caption,
        access_token: accessToken,
      }),
    }
  );

  if (!containerRes.ok) {
    const err = await containerRes.json().catch(() => ({}));
    return {
      success: false,
      error: `IG container error ${containerRes.status}: ${JSON.stringify(err)}`,
    };
  }

  const container = await containerRes.json();

  // Step 2: Publish the container
  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${params.igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.json().catch(() => ({}));
    return {
      success: false,
      error: `IG publish error ${publishRes.status}: ${JSON.stringify(err)}`,
    };
  }

  const published = await publishRes.json();
  return { success: true, mediaId: published.id };
}

/**
 * Create an Instagram carousel post.
 */
export async function createInstagramCarousel(
  accessToken: string,
  params: {
    igUserId: string;
    imageUrls: string[];
    caption: string;
  }
): Promise<InstagramPostResult> {
  // Step 1: Create child containers for each image
  const childIds: string[] = [];
  for (const url of params.imageUrls) {
    const res = await fetch(
      `${GRAPH_API_BASE}/${params.igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: url,
          is_carousel_item: true,
          access_token: accessToken,
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: `IG carousel child error: ${JSON.stringify(err)}`,
      };
    }
    const data = await res.json();
    childIds.push(data.id);
  }

  // Step 2: Create the carousel container
  const carouselRes = await fetch(
    `${GRAPH_API_BASE}/${params.igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_type: "CAROUSEL",
        children: childIds,
        caption: params.caption,
        access_token: accessToken,
      }),
    }
  );

  if (!carouselRes.ok) {
    const err = await carouselRes.json().catch(() => ({}));
    return {
      success: false,
      error: `IG carousel container error: ${JSON.stringify(err)}`,
    };
  }

  const carousel = await carouselRes.json();

  // Step 3: Publish
  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${params.igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: carousel.id,
        access_token: accessToken,
      }),
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.json().catch(() => ({}));
    return {
      success: false,
      error: `IG carousel publish error: ${JSON.stringify(err)}`,
    };
  }

  const published = await publishRes.json();
  return { success: true, mediaId: published.id };
}

/**
 * Verify an Instagram/Facebook access token.
 */
export async function verifyInstagramToken(
  accessToken: string
): Promise<{ valid: boolean; username?: string; igUserId?: string }> {
  const account = await getInstagramAccount(accessToken);
  if (!account) return { valid: false };
  return { valid: true, username: account.username, igUserId: account.id };
}
