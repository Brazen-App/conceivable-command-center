import Header from "@/components/layout/Header";
import DashboardHome from "@/components/dashboard/DashboardHome";

export default function HomePage() {
  return (
    <>
      <Header
        title="Command Center"
        subtitle="Your AI-powered operating system"
      />
      <DashboardHome />
    </>
  );
}
