import { notFound } from "next/navigation";
import { getPartnerBySlug } from "@/lib/data/partners";
import SocialPackClient from "./SocialPackClient";

export default async function SocialPackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <SocialPackClient partner={partner!} />;
}
