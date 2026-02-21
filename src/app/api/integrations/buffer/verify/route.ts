import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getProfiles } from "@/lib/integrations/buffer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: "accessToken is required" },
        { status: 400 }
      );
    }

    const user = await verifyToken(accessToken);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 }
      );
    }

    const profiles = await getProfiles(accessToken);

    return NextResponse.json({
      valid: true,
      user,
      profiles: profiles.map((p) => ({
        id: p.id,
        service: p.service,
        username: p.service_username,
        formattedService: p.formatted_service,
        avatar: p.avatar_https,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verify token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
