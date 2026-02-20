import Header from "@/components/layout/Header";
import MorningBriefView from "@/components/content/MorningBriefView";

export default function BriefsPage() {
  return (
    <>
      <Header
        title="Morning Brief"
        subtitle="Daily curated stories — delivered at 7:00 AM"
      />
      <MorningBriefView />
    </>
  );
}
