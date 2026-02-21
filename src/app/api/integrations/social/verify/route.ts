import { NextRequest, NextResponse } from "next/server";
import { verifyLinkedInToken } from "@/lib/integrations/linkedin";
import { verifyXToken } from "@/lib/integrations/x-twitter";
import { verifyInstagramToken } from "@/lib/integrations/instagram";
import { verifyPinterestToken, getPinterestBoards } from "@/lib/integrations/pinterest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, accessToken } = body;

    if (!platform || !accessToken) {
      return NextResponse.json(
        { error: "platform and accessToken are required" },
        { status: 400 }
      );
    }

    switch (platform) {
      case "linkedin": {
        const result = await verifyLinkedInToken(accessToken);
        if (!result.valid) {
          return NextResponse.json({ valid: false, error: "Invalid LinkedIn token" }, { status: 401 });
        }
        return NextResponse.json({
          valid: true,
          platform: "linkedin",
          username: result.name,
          meta: { urn: `urn:li:person:${result.sub}` },
        });
      }

      case "instagram": {
        const result = await verifyInstagramToken(accessToken);
        if (!result.valid) {
          return NextResponse.json({ valid: false, error: "Invalid Instagram token" }, { status: 401 });
        }
        return NextResponse.json({
          valid: true,
          platform: "instagram",
          username: result.username,
          meta: { igUserId: result.igUserId },
        });
      }

      case "x": {
        const result = await verifyXToken(accessToken);
        if (!result.valid) {
          return NextResponse.json({ valid: false, error: "Invalid X/Twitter token" }, { status: 401 });
        }
        return NextResponse.json({
          valid: true,
          platform: "x",
          username: result.username,
        });
      }

      case "pinterest": {
        const result = await verifyPinterestToken(accessToken);
        if (!result.valid) {
          return NextResponse.json({ valid: false, error: "Invalid Pinterest token" }, { status: 401 });
        }
        const boards = await getPinterestBoards(accessToken);
        return NextResponse.json({
          valid: true,
          platform: "pinterest",
          username: result.username,
          meta: { boards },
        });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported platform: ${platform}` },
          { status: 400 }
        );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verify token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
