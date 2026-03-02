import { Rocket } from "lucide-react";

export default function FundraisingDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#E24D4712" }}
          >
            <Rocket size={20} style={{ color: "#E24D47" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Fundraising
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              The Growth Engine
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
          Preparing for fundraise. Investor CRM, pitch materials management, data room builder,
          and narrative consistency tools coming in Phase 5. Critical dependency: patent filing #1
          (Closed-Loop Physiologic Correction) must be filed before fundraise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Pipeline", count: "—", desc: "Investor tracking" },
          { title: "Pitch Deck", count: "Draft", desc: "Versioning pending" },
          { title: "Data Room", count: "Not set up", desc: "Materials preparation" },
          { title: "Meetings", count: "—", desc: "Investor meetings logged" },
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
