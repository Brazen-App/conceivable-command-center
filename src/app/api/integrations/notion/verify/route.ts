import { NextRequest, NextResponse } from "next/server";
import { verifyToken, listDatabases } from "@/lib/integrations/notion";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "token is required" },
        { status: 400 }
      );
    }

    const result = await verifyToken(token);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: "Invalid Notion integration token" },
        { status: 401 }
      );
    }

    const databases = await listDatabases(token);

    return NextResponse.json({
      valid: true,
      workspaceName: result.workspaceName,
      botId: result.botId,
      databases,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verify token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
