import { notFound } from "next/navigation";
import { getPartnerBySlug } from "@/lib/data/partners";
import ReviewFlowClient from "./ReviewFlowClient";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) notFound();
  return <ReviewFlowClient partner={partner!} />;
}
