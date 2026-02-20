"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-sm" style={{ borderColor: "var(--border)" }}>
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        {searchOpen ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Search agents, content, briefs..."
              className="w-72 px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Search"
          >
            <Search size={18} style={{ color: "var(--muted)" }} />
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
          <Bell size={18} style={{ color: "var(--muted)" }} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--brand-secondary)" }} />
        </button>
      </div>
    </header>
  );
}
