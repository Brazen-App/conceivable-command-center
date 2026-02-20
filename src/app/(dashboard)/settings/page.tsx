import Header from "@/components/layout/Header";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Configure your command center" />
      <div className="p-8 max-w-3xl">
        {/* API Keys */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Anthropic API Key
              </label>
              <input
                type="password"
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Set via ANTHROPIC_API_KEY environment variable
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Database URL
              </label>
              <input
                type="password"
                placeholder="postgresql://..."
                className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Set via DATABASE_URL environment variable
              </p>
            </div>
          </div>
        </section>

        {/* Morning Brief Schedule */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            Morning Brief Schedule
          </h3>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Delivery Time
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Timezone
              </label>
              <select
                defaultValue="America/New_York"
                className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
              </select>
            </div>
          </div>
        </section>

        {/* Monitored Topics */}
        <section
          className="rounded-xl border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            Monitored Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "infertility",
              "fertility",
              "PCOS",
              "endometriosis",
              "women's health",
              "AI",
              "AI in healthcare",
              "women's rights",
            ].map((topic) => (
              <span
                key={topic}
                className="text-sm px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
              >
                {topic}
              </span>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            These topics are used by the Morning Brief and Viral Analyzer pipelines.
          </p>
        </section>
      </div>
    </>
  );
}
