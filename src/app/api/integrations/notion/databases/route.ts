import { NextRequest, NextResponse } from "next/server";
import { listDatabases, queryDatabase } from "@/lib/integrations/notion";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-notion-token");

  if (!token) {
    return NextResponse.json(
      { error: "x-notion-token header is required" },
      { status: 400 }
    );
  }

  try {
    const databases = await listDatabases(token);
    return NextResponse.json({ databases });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list databases";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-notion-token");

  if (!token) {
    return NextResponse.json(
      { error: "x-notion-token header is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { databaseId, filter } = body;

    if (!databaseId) {
      return NextResponse.json(
        { error: "databaseId is required" },
        { status: 400 }
      );
    }

    const pages = await queryDatabase(token, databaseId, filter);
    return NextResponse.json({ pages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to query database";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
