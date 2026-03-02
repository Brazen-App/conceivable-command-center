"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  PenTool,
  Shield,
  DollarSign,
  Rocket,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const DEPARTMENTS = [
  {
    label: "Operations",
    shortLabel: "Ops",
    href: "/",
    icon: LayoutDashboard,
    description: "The Spine",
  },
  {
    label: "Email Strategy",
    shortLabel: "Email",
    href: "/departments/email",
    icon: Mail,
    description: "Launch Sequence",
  },
  {
    label: "Content Engine",
    shortLabel: "Content",
    href: "/departments/content",
    icon: PenTool,
    description: "The Mouth",
  },
  {
    label: "Legal / IP / Compliance",
    shortLabel: "Legal",
    href: "/departments/legal",
    icon: Shield,
    description: "The Immune System",
  },
  {
    label: "Finance",
    shortLabel: "Finance",
    href: "/departments/finance",
    icon: DollarSign,
    description: "Integration Layer",
  },
  {
    label: "Fundraising",
    shortLabel: "Raise",
    href: "/departments/fundraising",
    icon: Rocket,
    description: "The Growth Engine",
  },
  {
    label: "Strategy / Coaching",
    shortLabel: "Strategy",
    href: "/departments/strategy",
    icon: Brain,
    description: "The Brain",
  },
];

const SYSTEM_NAV = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DepartmentNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div>
            <h1
              className="text-lg font-bold tracking-wider text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CONCEIVABLE
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mt-0.5"
               style={{ fontFamily: "var(--font-caption)" }}>
              Command Center
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-md hover:bg-white/10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-md hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Department Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="mb-6">
          {!collapsed && (
            <h2
              className="px-4 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-40"
              style={{ fontFamily: "var(--font-caption)" }}
            >
              Departments
            </h2>
          )}
          {DEPARTMENTS.map((dept) => {
            const active = isActive(dept.href);
            const Icon = dept.icon;

            return (
              <Link
                key={dept.href}
                href={dept.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "text-white font-medium"
                    : "hover:bg-white/5 text-gray-400"
                }`}
                style={
                  active
                    ? { backgroundColor: "var(--sidebar-active)" }
                    : undefined
                }
                title={collapsed ? dept.label : undefined}
              >
                <Icon
                  size={18}
                  className={active ? "text-white" : "opacity-60"}
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{dept.label}</span>
                    {active && (
                      <span className="block text-[10px] opacity-60 mt-0.5">
                        {dept.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* System */}
        <div>
          {!collapsed && (
            <h2
              className="px-4 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-40"
              style={{ fontFamily: "var(--font-caption)" }}
            >
              System
            </h2>
          )}
          {SYSTEM_NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "text-white font-medium"
                    : "hover:bg-white/5 text-gray-400"
                }`}
                style={
                  active
                    ? { backgroundColor: "var(--sidebar-active)" }
                    : undefined
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  className={active ? "text-white" : "opacity-60"}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--status-success)" }} />
            <span className="text-xs opacity-60">7 departments connected</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-200
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
      >
        {navContent}
      </aside>
    </>
  );
}
