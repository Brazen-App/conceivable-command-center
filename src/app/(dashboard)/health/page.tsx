import Header from "@/components/layout/Header";
import HealthOSView from "@/components/health/HealthOSView";

export default function HealthPage() {
  return (
    <>
      <Header title="Health OS" subtitle="Your personal health operating system" />
      <HealthOSView />
    </>
  );
}
