import { NextRequest, NextResponse } from "next/server";
import { searchPOVs } from "@/lib/stores/pov-store";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const results = searchPOVs(q.trim());
  return NextResponse.json({ query: q.trim(), results, count: results.length });
}
