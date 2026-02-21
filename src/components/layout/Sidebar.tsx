"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  PenTool,
  TrendingUp,
  Upload,
  Heart,
  Crown,
  Megaphone,
  Scale,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_SECTIONS = [
  {
    title: "Command Center",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Morning Brief", href: "/briefs", icon: Newspaper },
      { label: "Content Studio", href: "/content", icon: PenTool },
      { label: "Viral Insights", href: "/content/viral", icon: TrendingUp },
      { label: "Training Data", href: "/documents", icon: Upload },
      { label: "Health OS", href: "/health", icon: Heart },
    ],
  },
  {
    title: "Agent Divisions",
    items: [
      { label: "Executive Coach", href: "/agents/executive-coach", icon: Crown },
      { label: "Marketing", href: "/agents/marketing", icon: Megaphone },
      { label: "Legal", href: "/agents/legal", icon: Scale },
      { label: "Scientific Research", href: "/agents/scientific-research", icon: FlaskConical },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
      style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Conceivable
            </h1>
            <p className="text-xs opacity-60">Command Center</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-white/10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <h2 className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider opacity-40">
                {section.title}
              </h2>
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? "bg-[var(--sidebar-active)] text-white font-medium"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className={isActive ? "text-white" : "opacity-60"} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Agent Status */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs opacity-60">All agents online</span>
          </div>
        </div>
      )}
    </aside>
  );
}
