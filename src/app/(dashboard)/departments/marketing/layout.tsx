"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Megaphone } from "lucide-react";

const TABS = [
  { href: "/departments/marketing", label: "Dashboard" },
  { href: "/departments/marketing/content", label: "Content" },
  { href: "/departments/marketing/seo-geo", label: "SEO & GEO" },
  { href: "/departments/marketing/email-ops", label: "Email Ops" },
  { href: "/departments/marketing/analytics", label: "Analytics" },
  { href: "/departments/marketing/campaigns", label: "Campaigns" },
  { href: "/departments/marketing/affiliates", label: "Affiliates" },
  { href: "/departments/marketing/partnerships", label: "Partnerships" },
  { href: "/departments/marketing/paid", label: "PPC" },
  { href: "/departments/marketing/blog", label: "Blog Engine" },
];

const ACCENT = "#5A6FFF";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/departments/marketing") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Megaphone size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
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
              Marketing
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
              Content &middot; Email &middot; SEO &middot; Affiliates &middot; Partnerships &middot; PPC
            </p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: ACCENT }
                  : { color: "var(--muted)" }
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}
