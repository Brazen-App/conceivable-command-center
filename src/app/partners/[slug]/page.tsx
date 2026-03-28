import { getPartnerBySlug } from "@/lib/data/partners";
import { notFound } from "next/navigation";
import PartnerPortalClient from "./PartnerPortalClient";

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <PartnerPortalClient partner={partner!} />;
}
