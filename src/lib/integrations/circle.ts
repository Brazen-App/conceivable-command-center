const CIRCLE_BASE_URL = "https://app.circle.so/api/v1";

function getToken(): string {
  const token = process.env.CIRCLE_API_TOKEN;
  if (!token) {
    throw new Error("CIRCLE_API_TOKEN is not set");
  }
  return token;
}

interface CircleSpace {
  id: number;
  name: string;
  slug: string;
}

interface CircleCommunity {
  id: number;
  name: string;
}

export async function getCommunity(): Promise<CircleCommunity> {
  const res = await fetch(`${CIRCLE_BASE_URL}/communities`, {
    headers: { Authorization: `Token ${getToken()}` },
  });
  if (!res.ok) {
    throw new Error(`Circle API error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const community = Array.isArray(data) ? data[0] : data;
  if (!community) {
    throw new Error("No Circle community found for this API token");
  }
  return { id: community.id, name: community.name };
}

export async function getSpaces(communityId: number): Promise<CircleSpace[]> {
  const res = await fetch(
    `${CIRCLE_BASE_URL}/spaces?community_id=${communityId}`,
    { headers: { Authorization: `Token ${getToken()}` } }
  );
  if (!res.ok) {
    throw new Error(`Circle API error (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export async function findGeneralSpace(communityId: number): Promise<CircleSpace> {
  const spaces = await getSpaces(communityId);
  const general = spaces.find(
    (s) => s.name.toLowerCase().startsWith("general") || s.slug.startsWith("general")
  );
  if (!general) {
    throw new Error(
      `No "General" space found in Circle community. Available: ${spaces.map((s) => s.name).join(", ")}`
    );
  }
  return general;
}

export async function createPost(opts: {
  communityId: number;
  spaceId: number;
  title: string;
  body: string;
}): Promise<{ id: number; url: string }> {
  const res = await fetch(`${CIRCLE_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Token ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      community_id: opts.communityId,
      space_id: opts.spaceId,
      name: opts.title,
      body: opts.body,
      is_pinned: false,
      status: "published",
    }),
  });

  if (!res.ok) {
    throw new Error(`Circle post failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return { id: data.id, url: data.url ?? `https://app.circle.so/c/general/${data.slug ?? data.id}` };
}

/**
 * Publish a post to the General space in Circle.
 */
export async function publishToGeneral(title: string, body: string) {
  const community = await getCommunity();
  const generalSpace = await findGeneralSpace(community.id);
  return createPost({
    communityId: community.id,
    spaceId: generalSpace.id,
    title,
    body,
  });
}
