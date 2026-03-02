import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EmailDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#5A6FFF12" }}
          >
            <Mail size={20} style={{ color: "#5A6FFF" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Email Strategy
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              Launch Sequence &amp; Ongoing Campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        className="rounded-xl border p-6 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Current Status
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          23 launch emails written for the 8-week sequence. Mailchimp integration pending.
          Next step: migrate emails to database, connect Mailchimp API for publish pipeline,
          and set up Legal review flags for health claims.
        </p>
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Email Sequence", count: "23 emails", desc: "8-week launch series" },
          { title: "Mailchimp", count: "Not connected", desc: "Integration pending" },
          { title: "Performance", count: "No data", desc: "Analytics after first send" },
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
