import { Client } from "@notionhq/client";

export interface NotionDatabase {
  id: string;
  title: string;
  icon: string | null;
  url: string;
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastEdited: string;
}

export function createNotionClient(token: string): Client {
  return new Client({ auth: token });
}

export async function verifyToken(
  token: string
): Promise<{ valid: boolean; workspaceName: string | null; botId: string | null }> {
  try {
    const notion = createNotionClient(token);
    const me = await notion.users.me({});
    const workspaceName = me.name ?? null;
    return { valid: true, workspaceName, botId: me.id };
  } catch {
    return { valid: false, workspaceName: null, botId: null };
  }
}

export async function listDatabases(token: string): Promise<NotionDatabase[]> {
  const notion = createNotionClient(token);
  const response = await notion.search({
    page_size: 100,
  });

  const databases: NotionDatabase[] = [];
  for (const result of response.results) {
    if ((result as { object: string }).object !== "database") continue;
    const db = result as unknown as {
      id: string;
      title: Array<{ plain_text: string }>;
      icon: { type: string; emoji?: string } | null;
      url: string;
    };
    const title =
      db.title?.map((t) => t.plain_text).join("") || "Untitled";
    const icon = db.icon?.type === "emoji" ? (db.icon.emoji ?? null) : null;
    databases.push({ id: db.id, title, icon, url: db.url });
  }
  return databases;
}

export async function createContentPage(
  token: string,
  databaseId: string,
  params: {
    title: string;
    platform: string;
    status: string;
    body: string;
    hashtags?: string[];
  }
): Promise<{ id: string; url: string }> {
  const notion = createNotionClient(token);

  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: params.title } }],
      },
      Platform: {
        select: { name: params.platform },
      },
      Status: {
        select: { name: params.status },
      },
      ...(params.hashtags && params.hashtags.length > 0
        ? {
            Tags: {
              multi_select: params.hashtags.map((tag) => ({ name: tag })),
            },
          }
        : {}),
    },
    children: [
      {
        object: "block" as const,
        type: "paragraph" as const,
        paragraph: {
          rich_text: [{ type: "text" as const, text: { content: params.body } }],
        },
      },
    ],
  });

  return { id: page.id, url: (page as { url: string }).url };
}

interface NotionQueryResult {
  results: Array<{
    id: string;
    object: string;
    properties: Record<string, {
      type: string;
      title?: Array<{ plain_text: string }>;
    }>;
    url: string;
    last_edited_time: string;
  }>;
}

export async function queryDatabase(
  token: string,
  databaseId: string,
  filter?: {
    status?: string;
    platform?: string;
  }
): Promise<NotionPage[]> {
  const filterConditions: Array<Record<string, unknown>> = [];
  if (filter?.status) {
    filterConditions.push({
      property: "Status",
      select: { equals: filter.status },
    });
  }
  if (filter?.platform) {
    filterConditions.push({
      property: "Platform",
      select: { equals: filter.platform },
    });
  }

  const queryFilter =
    filterConditions.length > 1
      ? { and: filterConditions }
      : filterConditions.length === 1
        ? filterConditions[0]
        : undefined;

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: queryFilter,
      page_size: 50,
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status} ${res.statusText}`);
  }

  const data: NotionQueryResult = await res.json();

  return data.results.map((page) => {
    const nameProp = page.properties["Name"];
    let title = "Untitled";
    if (nameProp?.title) {
      title = nameProp.title.map((t) => t.plain_text).join("") || "Untitled";
    }
    return {
      id: page.id,
      title,
      url: page.url,
      lastEdited: page.last_edited_time,
    };
  });
}
