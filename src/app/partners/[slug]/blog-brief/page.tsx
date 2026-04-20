import { getPartnerBySlug } from "@/lib/data/partners";
import { notFound } from "next/navigation";
import BlogBriefClient from "./BlogBriefClient";

export default async function BlogBriefPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <BlogBriefClient partner={partner!} />;
}
