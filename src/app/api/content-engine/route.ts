import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [newsItems, researchItems, redditPosts, calendarEntries] =
      await Promise.all([
        prisma.newsItem.findMany({ orderBy: { timestamp: "desc" } }),
        prisma.researchArticle.findMany({ orderBy: { timestamp: "desc" } }),
        prisma.redditPost.findMany({ orderBy: { timestamp: "desc" } }),
        prisma.calendarEntry.findMany({ orderBy: { date: "asc" } }),
      ]);

    return NextResponse.json({
      newsItems,
      researchItems,
      redditPosts,
      calendarEntries,
    });
  } catch (error) {
    console.error("[content-engine] GET", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { model, id, ...updates } = body;

  try {
    let result;
    switch (model) {
      case "newsItem":
        result = await prisma.newsItem.update({ where: { id }, data: updates });
        break;
      case "redditPost":
        result = await prisma.redditPost.update({ where: { id }, data: updates });
        break;
      case "calendarEntry":
        result = await prisma.calendarEntry.update({ where: { id }, data: updates });
        break;
      case "researchArticle":
        result = await prisma.researchArticle.update({ where: { id }, data: updates });
        break;
      default:
        return NextResponse.json({ error: "Invalid model" }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[content-engine] PATCH", error);
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
}
