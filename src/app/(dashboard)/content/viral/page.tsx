import Header from "@/components/layout/Header";
import ViralInsightsView from "@/components/content/ViralInsightsView";

export default function ViralInsightsPage() {
  return (
    <>
      <Header
        title="Viral Insights"
        subtitle="Continuous monitoring and analysis of trending content"
      />
      <ViralInsightsView />
    </>
  );
}
