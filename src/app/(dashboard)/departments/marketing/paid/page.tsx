"use client";

import {
  Clock,
  DollarSign,
  CheckCircle2,
  Circle,
  Megaphone,
  Target,
  Palette,
  ShieldCheck,
} from "lucide-react";

const ACCENT = "#5A6FFF";

const PLANNED_CHANNELS = [
  { name: "Google Ads", icon: "G", color: "#356FB6" },
  { name: "Meta Ads", icon: "M", color: "#E37FB1" },
  { name: "Pinterest Ads", icon: "P", color: "#E24D47" },
];

const PREREQUISITES = [
  {
    label: "Early access validation",
    description: "Demonstrate product-market fit with 5,000+ early access signups",
    complete: false,
    icon: Target,
  },
  {
    label: "Unit economics confirmed",
    description: "CAC < LTV with at least 3:1 ratio validated through organic channels",
    complete: false,
    icon: DollarSign,
  },
  {
    label: "Creative assets ready",
    description: "Brand-compliant ad templates, video assets, and landing pages built",
    complete: false,
    icon: Palette,
  },
  {
    label: "Compliance templates approved",
    description: "All ad copy templates reviewed by Legal for health claims compliance",
    complete: false,
    icon: ShieldCheck,
  },
];

export default function MarketingPaidPage() {
  return (
    <div className="space-y-6">
      {/* Coming Soon Hero */}
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${ACCENT}14` }}
        >
          <Clock size={32} style={{ color: ACCENT }} />
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "0.06em",
            color: "var(--foreground)",
          }}
        >
          Coming Soon
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          Paid campaigns launch after early access validation. We build organic
          first, prove unit economics, then scale with paid.
        </p>

        {/* Current Spend */}
        <div
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full"
          style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
        >
          <DollarSign size={16} style={{ color: ACCENT }} />
          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Current Spend:
          </span>
          <span className="text-lg font-bold" style={{ color: ACCENT }}>
            $0
          </span>
        </div>
      </div>

      {/* Planned Channels */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Planned Channels
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANNED_CHANNELS.map((channel) => (
            <div
              key={channel.name}
              className="rounded-xl p-5 text-center"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white mx-auto mb-3"
                style={{ backgroundColor: channel.color }}
              >
                {channel.icon}
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {channel.name}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Not yet active
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites Checklist */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Prerequisites Checklist
        </p>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {PREREQUISITES.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="px-5 py-4 flex items-start gap-3"
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
                  borderBottom:
                    i < PREREQUISITES.length - 1
                      ? "1px solid var(--border)"
                      : undefined,
                }}
              >
                {item.complete ? (
                  <CheckCircle2
                    size={20}
                    style={{ color: "#1EAA55" }}
                    className="shrink-0 mt-0.5"
                  />
                ) : (
                  <Circle
                    size={20}
                    style={{ color: "var(--border)" }}
                    className="shrink-0 mt-0.5"
                  />
                )}
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: item.complete ? "var(--muted)" : "var(--foreground)",
                      textDecoration: item.complete ? "line-through" : "none",
                    }}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {item.description}
                  </p>
                </div>
                <Icon size={16} style={{ color: "var(--muted)" }} className="shrink-0 mt-0.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Sullivan Principle */}
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "#9686B910",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2 py-1 rounded text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            2x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Paid is a 2x move, not 10x
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              At this stage, paid acquisition is a multiplier, not a creator.
              The 10x moves are GEO optimization, expert partnerships, and
              affiliate network expansion — all of which create compounding
              organic channels. Paid amplifies once the organic engine is proven.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
