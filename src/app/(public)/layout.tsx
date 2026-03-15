"use client";

import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F9F7F0" }}>
      {/* Simple header with logo */}
      <header className="w-full px-6 py-5 flex justify-center">
        <Link href="/early-access" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#5A6FFF" strokeWidth="2.5" fill="none" />
            <circle cx="20" cy="20" r="10" stroke="#ACB7FF" strokeWidth="2" fill="none" />
            <circle cx="20" cy="20" r="3" fill="#5A6FFF" />
          </svg>
          <span
            className="text-xl tracking-wider"
            style={{
              fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
              fontWeight: 700,
              color: "#2A2828",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Conceivable
          </span>
        </Link>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Minimal footer */}
      <footer className="w-full px-6 py-8 text-center" style={{ color: "#6B7280" }}>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Conceivable. All rights reserved.
        </p>
        <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
          This assessment is for educational purposes only and does not constitute medical advice.
        </p>
      </footer>
    </div>
  );
}
