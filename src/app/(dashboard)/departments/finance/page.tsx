import { DollarSign } from "lucide-react";

export default function FinanceDepartmentPage() {
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#F1C02814" }}
          >
            <DollarSign size={20} style={{ color: "#F1C028" }} strokeWidth={1.8} />
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
              Finance
            </h1>
            <p
              className="font-caption mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Integration Layer
            </p>
          </div>
        </div>
      </header>

      <div
        className="rounded-xl border p-6 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
        >
          Current Status
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Pending integration with COO&apos;s existing finance tool. Revenue tracking, burn rate calculator,
          COGS attribution, and monthly investor update automation will be connected in Phase 6.
          Need tech stack info and API access details from COO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            <p
              className="font-caption mb-1"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {card.title}
            </p>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}>
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
