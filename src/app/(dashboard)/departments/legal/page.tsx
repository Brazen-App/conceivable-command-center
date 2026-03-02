import { Shield } from "lucide-react";

export default function LegalDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#356FB612" }}
          >
            <Shield size={20} style={{ color: "#356FB6" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Legal / IP / Compliance
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              The Immune System
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border p-6 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Current Status
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Critical patent filing (Closed-Loop Physiologic Correction) needed before fundraise.
          Approved claims database, content compliance auto-scanner, and regulatory tracking
          coming in Phase 4. Testimonials in email sequence need FTC compliance verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Patent Portfolio", count: "4 protected", desc: "3 priority filings pending" },
          { title: "Approved Claims", count: "—", desc: "Database being built" },
          { title: "Content Reviews", count: "0", desc: "Auto-scanner pending" },
          { title: "Compliance Incidents", count: "0", desc: "Target: 0" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
              {card.title}
            </p>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {card.count}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
