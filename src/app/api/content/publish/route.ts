import { NextResponse } from "next/server";
import late from "@/lib/late";

interface PublishPiece {
  platform: string;
  copy: string;
  hashtags: string[];
}

export async function POST(request: Request) {
  if (!process.env.LATE_API_KEY) {
    return NextResponse.json(
      { error: "LATE_API_KEY is not configured. Add it to .env.local to enable publishing." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const pieces: PublishPiece[] = body.pieces;

  if (!pieces || !Array.isArray(pieces) || pieces.length === 0) {
    return NextResponse.json(
      { error: "Request must include a non-empty `pieces` array." },
      { status: 400 }
    );
  }

  const results = await Promise.allSettled(
    pieces.map(async (piece) => {
      const fullContent = piece.hashtags.length > 0
        ? `${piece.copy}\n\n${piece.hashtags.map((t) => `#${t}`).join(" ")}`
        : piece.copy;

      const res = await late.posts.createPost({
        body: {
          content: fullContent,
          platforms: [{ platform: piece.platform }],
          publishNow: true,
        },
      });

      return { platform: piece.platform, data: res.data };
    })
  );

  const response = results.map((r, i) => {
    if (r.status === "fulfilled") {
      return { platform: pieces[i].platform, ok: true, data: r.value.data };
    }
    return {
      platform: pieces[i].platform,
      ok: false,
      error: r.reason instanceof Error ? r.reason.message : "Unknown error",
    };
  });

  return NextResponse.json({ results: response });
}
