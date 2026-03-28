import { getPartnerBySlug } from "@/lib/data/partners";
import { notFound } from "next/navigation";
import PartnerPortalClient from "./PartnerPortalClient";

export default function PartnerPage({ params }: { params: { slug: string } }) {
  const partner = getPartnerBySlug(params.slug);
  if (!partner) notFound();
  return <PartnerPortalClient partner={partner!} />;
}
