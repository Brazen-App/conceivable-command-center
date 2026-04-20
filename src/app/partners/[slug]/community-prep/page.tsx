import { getPartnerBySlug } from "@/lib/data/partners";
import { notFound } from "next/navigation";
import CommunityPrepClient from "./CommunityPrepClient";

export default async function CommunityPrepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <CommunityPrepClient partner={partner!} />;
}
