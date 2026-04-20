import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Return all research data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "papers") {
      const papers = await prisma.researchPaper.findMany({ orderBy: { number: "asc" } });
      return NextResponse.json(papers);
    }
    if (type === "data-assets") {
      const assets = await prisma.researchDataAsset.findMany({ orderBy: { createdAt: "asc" } });
      return NextResponse.json(assets);
    }
    if (type === "partners") {
      const partners = await prisma.academicPartner.findMany({ orderBy: { createdAt: "asc" } });
      return NextResponse.json(partners);
    }
    if (type === "irb") {
      const protocols = await prisma.irbProtocol.findMany({ orderBy: { createdAt: "asc" } });
      return NextResponse.json(protocols);
    }
    if (type === "literature") {
      const paperNumber = searchParams.get("paperNumber");
      const relevanceTag = searchParams.get("relevanceTag");
      const where: Record<string, unknown> = {};
      if (paperNumber) where.paperNumber = parseInt(paperNumber);
      if (relevanceTag) where.relevanceTag = relevanceTag;
      const entries = await prisma.literatureEntry.findMany({ where, orderBy: { createdAt: "desc" } });
      return NextResponse.json(entries);
    }

    // Default: return everything
    const [papers, dataAssets, partners, irb, literature] = await Promise.all([
      prisma.researchPaper.findMany({ orderBy: { number: "asc" } }),
      prisma.researchDataAsset.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.academicPartner.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.irbProtocol.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.literatureEntry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({ papers, dataAssets, partners, irb, literature });
  } catch (error) {
    console.error("Research GET error:", error);
    return NextResponse.json({ error: "Failed to fetch research data" }, { status: 500 });
  }
}

// POST — Create new entries
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    let result;
    switch (type) {
      case "paper":
        result = await prisma.researchPaper.create({ data });
        break;
      case "data-asset":
        result = await prisma.researchDataAsset.create({ data });
        break;
      case "partner":
        result = await prisma.academicPartner.create({ data });
        break;
      case "irb":
        result = await prisma.irbProtocol.create({ data });
        break;
      case "literature":
        result = await prisma.literatureEntry.create({ data });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Research POST error:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}

// PATCH — Update entries
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, ...data } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    let result;
    switch (type) {
      case "paper":
        result = await prisma.researchPaper.update({ where: { id }, data });
        break;
      case "data-asset":
        result = await prisma.researchDataAsset.update({ where: { id }, data });
        break;
      case "partner":
        result = await prisma.academicPartner.update({ where: { id }, data });
        break;
      case "irb":
        result = await prisma.irbProtocol.update({ where: { id }, data });
        break;
      case "literature":
        result = await prisma.literatureEntry.update({ where: { id }, data });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Research PATCH error:", error);
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}
