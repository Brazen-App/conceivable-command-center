import { DollarSign } from "lucide-react";

export default function FinanceDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#F1C02812" }}
          >
            <DollarSign size={20} style={{ color: "#F1C028" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Finance
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Integration Layer
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
          Pending integration with COO&apos;s existing finance tool. Revenue tracking, burn rate calculator,
          COGS attribution, and monthly investor update automation will be connected in Phase 6.
          Need tech stack info and API access details from COO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Runway", count: "—", desc: "Pending finance tool integration" },
          { title: "Burn Rate", count: "—", desc: "Monthly spend tracking" },
          { title: "Budget Status", count: "—", desc: "Per-department tracking" },
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
