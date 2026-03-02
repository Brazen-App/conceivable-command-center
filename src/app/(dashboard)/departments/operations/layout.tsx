"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

const ACCENT = "#5A6FFF";

const TABS = [
  { href: "/departments/operations", label: "Overview" },
  { href: "/departments/operations/weekly-brief", label: "Weekly Brief" },
  { href: "/departments/operations/team", label: "Team" },
  { href: "/departments/operations/tools", label: "Tools" },
];

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Department header */}
      <div className="px-6 md:px-10 pt-6 md:pt-8 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <LayoutDashboard size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Operations
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Spine — Company-wide Command Center
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b" style={{ borderColor: "var(--border)" }}>
        <nav className="flex gap-1 px-6 md:px-10">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                pathname === tab.href
                  ? `border-[${ACCENT}] text-[${ACCENT}]`
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              style={
                pathname === tab.href
                  ? { borderBottomColor: ACCENT, color: ACCENT }
                  : undefined
              }
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
