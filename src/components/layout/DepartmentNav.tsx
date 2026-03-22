"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Boxes,
  Code2,
  FlaskConical,
  Shield,
  DollarSign,
  Rocket,
  Heart,
  Brain,
  Settings,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const DEPARTMENTS = [
  {
    label: "Operations",
    href: "/departments/operations",
    icon: LayoutDashboard,
    description: "The Spine",
    accent: "#ACB7FF",
  },
  {
    label: "Marketing",
    href: "/departments/marketing",
    icon: Megaphone,
    description: "The Voice",
    accent: "#E37FB1",
  },
  {
    label: "Product",
    href: "/departments/product",
    icon: Boxes,
    description: "The Product",
    accent: "#ACB7FF",
  },
  {
    label: "Engineering",
    href: "/departments/engineering",
    icon: Code2,
    description: "The Builder",
    accent: "#78C3BF",
  },
  {
    label: "Clinical",
    href: "/departments/clinical",
    icon: FlaskConical,
    description: "The Evidence",
    accent: "#78C3BF",
  },
  {
    label: "Legal",
    href: "/departments/legal",
    icon: Shield,
    description: "The Shield",
    accent: "#E24D47",
  },
  {
    label: "Finance",
    href: "/departments/finance",
    icon: DollarSign,
    description: "The Fuel",
    accent: "#1EAA55",
  },
  {
    label: "Fundraising",
    href: "/departments/fundraising",
    icon: Rocket,
    description: "The Engine",
    accent: "#F1C028",
  },
  {
    label: "Community",
    href: "/departments/community",
    icon: Heart,
    description: "The Heartbeat",
    accent: "#E37FB1",
  },
  {
    label: "Strategy",
    href: "/departments/strategy",
    icon: Brain,
    description: "The Brain",
    accent: "#9686B9",
  },
];

export default function DepartmentNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navContent = (
    <>
      {/* Logo area */}
      <div className="px-5 py-5 border-b border-white/[0.08]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-[15px] font-bold tracking-[0.18em] text-white leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  CONCEIVABLE
                </h1>
              </div>
              <p
                className="mt-1.5 text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Command Center
              </p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="hidden md:flex p-1 rounded hover:bg-white/[0.08] transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 rounded hover:bg-white/[0.08]"
              aria-label="Close menu"
            >
              <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:flex w-full justify-center p-1 rounded hover:bg-white/[0.08] transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
        )}
      </div>

      {/* Joy AI status — clickable link to agent chat */}
      {!collapsed ? (
        <Link
          href="/agents/executive-coach"
          onClick={() => setMobileOpen(false)}
          className="block mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg transition-all duration-150 hover:bg-white/[0.1]"
          style={
            isActive("/agents")
              ? { backgroundColor: "rgba(90,111,255,0.2)", boxShadow: "0 0 20px rgba(90,111,255,0.15)" }
              : { backgroundColor: "rgba(255,255,255,0.06)" }
          }
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5A6FFF, #ACB7FF)" }}>
              <Sparkles size={11} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white leading-none">Joy</p>
              <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>AI Chief of Staff</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-[5px] h-[5px] rounded-full animate-pulse" style={{ backgroundColor: "#1EAA55" }} />
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>Active</span>
            </div>
          </div>
        </Link>
      ) : (
        <Link
          href="/agents/executive-coach"
          onClick={() => setMobileOpen(false)}
          className="flex justify-center mx-2 mt-3 mb-1 p-2 rounded-lg transition-all duration-150 hover:bg-white/[0.1]"
          style={
            isActive("/agents")
              ? { backgroundColor: "rgba(90,111,255,0.2)" }
              : { backgroundColor: "rgba(255,255,255,0.06)" }
          }
          title="Joy — AI Chief of Staff"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5A6FFF, #ACB7FF)" }}>
            <Sparkles size={11} className="text-white" />
          </div>
        </Link>
      )}

      {/* Department nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {!collapsed && (
          <p
            className="px-3 mb-2"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
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
                ${active ? "shadow-sm" : "hover:bg-white/[0.06]"}
              `}
              style={
                active
                  ? {
                      backgroundColor: "rgba(255,255,255,0.12)",
                      boxShadow: `0 0 20px ${dept.accent}20`,
                    }
                  : undefined
              }
              title={collapsed ? dept.label : undefined}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors duration-150"
                style={
                  active
                    ? { backgroundColor: "rgba(255,255,255,0.18)" }
                    : { backgroundColor: `${dept.accent}15` }
                }
              >
                <Icon
                  size={15}
                  style={{ color: active ? "#FFFFFF" : dept.accent }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        block text-[13px] leading-tight truncate
                        ${active ? "text-white font-semibold" : "font-medium"}
                      `}
                      style={active ? undefined : { color: "rgba(255,255,255,0.75)" }}
                    >
                      {dept.label}
                    </span>
                    <div
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{ backgroundColor: dept.accent, opacity: active ? 1 : 0.6 }}
                    />
                  </div>
                  {active && (
                    <span className="block text-[9px] mt-0.5 tracking-[0.08em] uppercase text-white/40">
                      {dept.description}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        <div className="my-3 mx-3 border-t border-white/[0.08]" />

        {!collapsed && (
          <p
            className="px-3 mb-2"
            style={{
              fontFamily: "var(--font-caption)",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            System
          </p>
        )}
        <Link
          href="/data-room"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-lg
            transition-all duration-150
            ${isActive("/data-room") ? "" : "hover:bg-white/[0.06]"}
          `}
          style={
            isActive("/data-room")
              ? { backgroundColor: "rgba(255,255,255,0.12)" }
              : undefined
          }
          title={collapsed ? "Data Room" : undefined}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={
              isActive("/data-room")
                ? { backgroundColor: "rgba(255,255,255,0.18)" }
                : { backgroundColor: "rgba(255,255,255,0.04)" }
            }
          >
            <Lock
              size={15}
              style={{
                color: isActive("/data-room") ? "#FFFFFF" : "rgba(255,255,255,0.5)",
              }}
              strokeWidth={1.8}
            />
          </div>
          {!collapsed && (
            <span
              className={`text-[13px] ${
                isActive("/data-room") ? "text-white font-semibold" : "font-medium"
              }`}
              style={isActive("/data-room") ? undefined : { color: "rgba(255,255,255,0.75)" }}
            >
              Data Room
            </span>
          )}
        </Link>
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-lg
            transition-all duration-150
            ${isActive("/settings") ? "" : "hover:bg-white/[0.06]"}
          `}
          style={
            isActive("/settings")
              ? { backgroundColor: "rgba(255,255,255,0.12)" }
              : undefined
          }
          title={collapsed ? "Settings" : undefined}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={
              isActive("/settings")
                ? { backgroundColor: "rgba(255,255,255,0.18)" }
                : { backgroundColor: "rgba(255,255,255,0.04)" }
            }
          >
            <Settings
              size={15}
              style={{
                color: isActive("/settings") ? "#FFFFFF" : "rgba(255,255,255,0.5)",
              }}
              strokeWidth={1.8}
            />
          </div>
          {!collapsed && (
            <span
              className={`text-[13px] ${
                isActive("/settings") ? "text-white font-semibold" : "font-medium"
              }`}
              style={isActive("/settings") ? undefined : { color: "rgba(255,255,255,0.75)" }}
            >
              Settings
            </span>
          )}
        </Link>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px] rounded-full animate-pulse"
              style={{ backgroundColor: "#1EAA55" }}
            />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              10 departments connected
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
          background: "linear-gradient(180deg, #2A2828 0%, #1a2744 100%)",
          color: "#FFFFFF",
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
          background: "linear-gradient(180deg, #2A2828 0%, #1a2744 40%, #253a6a 70%, #2d4a8a 100%)",
          color: "#FFFFFF",
          borderRight: "1px solid rgba(90, 111, 255, 0.1)",
        }}
      >
        {navContent}
      </aside>
    </>
  );
}
