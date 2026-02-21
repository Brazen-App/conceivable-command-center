import { NextRequest, NextResponse } from "next/server";
import { createUpdate, mapPlatformToBufferService, getProfiles } from "@/lib/integrations/buffer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, pieces, scheduledAt } = body;

    if (!accessToken || !pieces || !Array.isArray(pieces) || pieces.length === 0) {
      return NextResponse.json(
        { error: "accessToken and pieces[] are required" },
        { status: 400 }
      );
    }

    // Get all connected profiles
    const profiles = await getProfiles(accessToken);

    const results: Array<{
      platform: string;
      success: boolean;
      message: string;
      bufferId?: string;
    }> = [];

    for (const piece of pieces) {
      const bufferService = mapPlatformToBufferService(piece.platform);

      if (!bufferService) {
        results.push({
          platform: piece.platform,
          success: false,
          message: `${piece.platform} is not supported by Buffer`,
        });
        continue;
      }

      // Find matching Buffer profile for this platform
      const matchingProfiles = profiles.filter(
        (p) => p.service === bufferService
      );

      if (matchingProfiles.length === 0) {
        results.push({
          platform: piece.platform,
          success: false,
          message: `No ${bufferService} profile connected in Buffer`,
        });
        continue;
      }

      try {
        const profileIds = matchingProfiles.map((p) => p.id);

        const updateResult = await createUpdate(accessToken, {
          profileIds,
          text: piece.text,
          scheduledAt,
          media: piece.imageUrl
            ? { photo: piece.imageUrl, description: piece.alt }
            : undefined,
        });

        results.push({
          platform: piece.platform,
          success: updateResult.success,
          message: updateResult.success
            ? "Added to Buffer queue"
            : "Failed to add to Buffer",
          bufferId: updateResult.updates?.[0]?.id,
        });
      } catch (err) {
        results.push({
          platform: piece.platform,
          success: false,
          message:
            err instanceof Error ? err.message : "Failed to publish",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      results,
      summary: `${successCount}/${results.length} pieces sent to Buffer`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish to Buffer";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
