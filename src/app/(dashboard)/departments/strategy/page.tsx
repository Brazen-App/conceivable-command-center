import { Brain } from "lucide-react";

export default function StrategyDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#9686B912" }}
          >
            <Brain size={20} style={{ color: "#9686B9" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Strategy / Coaching
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              The Brain — Bill Campbell Model
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
          Executive coaching and strategic oversight module being built. Will read all department
          briefs weekly to generate the CEO Weekly Brief with top wins, risks, uncomfortable truths,
          and priority recommendations. Based on Trillion Dollar Coach principles.
        </p>
      </div>

      <div
        className="rounded-xl border p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          CEO Weekly Brief
        </h2>
        <div className="space-y-4">
          {[
            { label: "Top 3 Wins", desc: "What's going well, with evidence" },
            { label: "Top 3 Risks", desc: "Concerns and threats, with evidence" },
            { label: "Uncomfortable Truth", desc: "What the CEO needs to hear" },
            { label: "Priority Recommendation", desc: "Where to focus this week" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: "var(--brand-primary)" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p
          className="text-xs mt-4 text-center"
          style={{ color: "var(--muted-light)" }}
        >
          Weekly brief will auto-generate once all departments are submitting briefs.
        </p>
      </div>
    </div>
  );
}
