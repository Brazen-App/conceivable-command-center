import { notFound } from "next/navigation";
import { getPartnerBySlug } from "@/lib/data/partners";
import BrandKitClient from "./BrandKitClient";

export default async function BrandKitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <BrandKitClient partner={partner!} />;
}
