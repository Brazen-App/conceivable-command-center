import { NextRequest, NextResponse } from "next/server";
import {
  CONTENT_TEMPLATES,
  getTemplatesForPlatform,
  getTemplatesByCategory,
  type TemplateCategory,
} from "@/lib/pipelines/content-templates";

export const dynamic = "force-dynamic";

/**
 * GET /api/content/templates
 * Returns available content templates, optionally filtered by platform or category.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const category = searchParams.get("category") as TemplateCategory | null;

  let templates = CONTENT_TEMPLATES;

  if (platform) {
    templates = getTemplatesForPlatform(platform);
  } else if (category) {
    templates = getTemplatesByCategory(category);
  }

  return NextResponse.json({
    templates: templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      platforms: t.platforms,
      exampleHook: t.exampleHook,
      exampleCTA: t.exampleCTA,
    })),
    count: templates.length,
  });
}
