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
    href: "/",
    icon: LayoutDashboard,
    description: "The Spine",
    accent: "#5A6FFF",  // brand primary
  },
  {
    label: "Email Strategy",
    href: "/departments/email",
    icon: Mail,
    description: "Launch Sequence",
    accent: "#ACB7FF",  // baby blue
  },
  {
    label: "Content Engine",
    href: "/departments/content",
    icon: PenTool,
    description: "The Mouth",
    accent: "#1EAA55",  // green
  },
  {
    label: "Legal / IP / Compliance",
    href: "/departments/legal",
    icon: Shield,
    description: "The Immune System",
    accent: "#356FB6",  // navy
  },
  {
    label: "Finance",
    href: "/departments/finance",
    icon: DollarSign,
    description: "Integration Layer",
    accent: "#F1C028",  // yellow
  },
  {
    label: "Fundraising",
    href: "/departments/fundraising",
    icon: Rocket,
    description: "The Growth Engine",
    accent: "#E24D47",  // red
  },
  {
    label: "Strategy / Coaching",
    href: "/departments/strategy",
    icon: Brain,
    description: "The Brain",
    accent: "#9686B9",  // purple
  },
];

export default function DepartmentNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const navContent = (
    <>
      {/* Logo area */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-[15px] font-bold tracking-[0.18em] text-white leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CONCEIVABLE
              </h1>
              <p
                className="mt-1.5 text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "var(--sidebar-text-muted)" }}
              >
                Command Center
              </p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex p-1 rounded hover:bg-white/[0.06] transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={14} style={{ color: "var(--sidebar-text-muted)" }} />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 rounded hover:bg-white/[0.06]"
              aria-label="Close menu"
            >
              <X size={14} style={{ color: "var(--sidebar-text-muted)" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:flex w-full justify-center p-1 rounded hover:bg-white/[0.06] transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={14} style={{ color: "var(--sidebar-text-muted)" }} />
          </button>
        )}
      </div>

      {/* Department nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Section label */}
        {!collapsed && (
          <p
            className="px-3 mb-2 font-caption"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--sidebar-text-muted)",
              opacity: 0.6,
            }}
          >
            Departments
          </p>
        )}

        {DEPARTMENTS.map((dept) => {
          const active = isActive(dept.href);
          const Icon = dept.icon;

          return (
            <Link
              key={dept.href}
              href={dept.href}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5
                transition-all duration-150
                ${active ? "shadow-sm" : "hover:bg-white/[0.04]"}
              `}
              style={
                active
                  ? {
                      backgroundColor: "var(--sidebar-active)",
                      boxShadow: `0 0 20px ${dept.accent}25`,
                    }
                  : undefined
              }
              title={collapsed ? dept.label : undefined}
            >
              {/* Icon with accent color */}
              <div
                className={`
                  w-7 h-7 rounded-md flex items-center justify-center shrink-0
                  transition-colors duration-150
                `}
                style={
                  active
                    ? { backgroundColor: "rgba(255,255,255,0.15)" }
                    : { backgroundColor: `${dept.accent}12` }
                }
              >
                <Icon
                  size={15}
                  style={{ color: active ? "#FFFFFF" : dept.accent }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </div>

              {/* Label + description */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <span
                    className={`
                      block text-[13px] leading-tight truncate
                      ${active ? "text-white font-semibold" : "font-medium"}
                    `}
                    style={active ? undefined : { color: "var(--sidebar-text)" }}
                  >
                    {dept.label}
                  </span>
                  {active && (
                    <span
                      className="block text-[9px] mt-0.5 tracking-[0.08em] uppercase text-white/50"
                    >
                      {dept.description}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-white/[0.06]" />

        {/* Settings */}
        {!collapsed && (
          <p
            className="px-3 mb-2"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--sidebar-text-muted)",
              opacity: 0.6,
            }}
          >
            System
          </p>
        )}
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-lg
            transition-all duration-150
            ${isActive("/settings") ? "" : "hover:bg-white/[0.04]"}
          `}
          style={
            isActive("/settings")
              ? { backgroundColor: "var(--sidebar-active)" }
              : undefined
          }
          title={collapsed ? "Settings" : undefined}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={
              isActive("/settings")
                ? { backgroundColor: "rgba(255,255,255,0.15)" }
                : { backgroundColor: "rgba(255,255,255,0.04)" }
            }
          >
            <Settings
              size={15}
              style={{
                color: isActive("/settings") ? "#FFFFFF" : "var(--sidebar-text-muted)",
              }}
              strokeWidth={1.8}
            />
          </div>
          {!collapsed && (
            <span
              className={`text-[13px] ${
                isActive("/settings") ? "text-white font-semibold" : "font-medium"
              }`}
              style={isActive("/settings") ? undefined : { color: "var(--sidebar-text)" }}
            >
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px] rounded-full animate-pulse"
              style={{ backgroundColor: "var(--status-success)" }}
            />
            <span
              className="text-[11px]"
              style={{ color: "var(--sidebar-text-muted)" }}
            >
              7 departments connected
            </span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg shadow-lg"
        style={{
          backgroundColor: "var(--sidebar-bg)",
          color: "var(--sidebar-text)",
        }}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen flex flex-col z-50
          transition-all duration-200 ease-out
          ${collapsed ? "w-[60px]" : "w-[252px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          backgroundColor: "var(--sidebar-bg)",
          color: "var(--sidebar-text)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {navContent}
      </aside>
    </>
  );
}
