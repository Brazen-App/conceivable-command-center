import DepartmentNav from "@/components/layout/DepartmentNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <DepartmentNav />
      <main className="flex-1 md:ml-[252px] pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
