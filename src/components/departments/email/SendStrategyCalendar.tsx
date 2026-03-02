"use client";

import { Calendar, Target, Send, Clock, CheckCircle2, Circle } from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import { PHASE_CONFIG } from "@/lib/data/launch-emails";

interface Props {
  emails: LaunchEmail[];
}

// 8-week timeline starting from today
function getWeekDates(): { week: number; start: Date; end: Date }[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 8 }, (_, i) => {
    const start = new Date(monday);
    start.setDate(monday.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { week: i + 1, start, end };
  });
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const PHASE_FOR_WEEK: Record<number, keyof typeof PHASE_CONFIG> = {
  1: "re-engagement",
  2: "re-engagement",
  3: "education",
  4: "education",
  5: "launch",
  6: "launch",
  7: "final-push",
  8: "post-close",
};

const WEEK_STRATEGY: Record<number, { goal: string; tone: string }> = {
  1: { goal: "Re-activate dormant subscribers", tone: "Warm, curious, personal" },
  2: { goal: "Build anticipation for what's coming", tone: "Intriguing, science-forward" },
  3: { goal: "Teach the CON Score framework", tone: "Educational, credible, empowering" },
  4: { goal: "Introduce Kai + 7 drivers", tone: "Product-forward, visionary" },
  5: { goal: "LAUNCH — drive signups", tone: "Exciting, urgent, clear CTA" },
  6: { goal: "Social proof + overcome objections", tone: "Proof-driven, FAQ, urgency" },
  7: { goal: "Final push — close the window", tone: "Deadline urgency, founder story" },
  8: { goal: "Welcome + set expectations", tone: "Warm, onboarding, community" },
};

export default function SendStrategyCalendar({ emails }: Props) {
  const weekDates = getWeekDates();
  const launchWeek = weekDates[4]; // Week 5

  return (
    <div>
      {/* Launch target */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, #E37FB1 0%, #E24D47 50%, #F1C028 100%)",
        }}
      >
        <Target className="text-white shrink-0" size={22} strokeWidth={2} />
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">Launch Day: {formatDateShort(launchWeek.start)}</p>
          <p className="text-white/60 text-xs mt-0.5">
            Early access opens Week 5. Goal: 5,000 signups by end of Week 7.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-white text-2xl font-bold">0</p>
          <p className="text-white/50 text-[10px] uppercase tracking-wider">/ 5,000 signups</p>
        </div>
      </div>

      {/* Sequence arc label */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {(Object.keys(PHASE_CONFIG) as Array<keyof typeof PHASE_CONFIG>).map((phase) => {
          const config = PHASE_CONFIG[phase];
          return (
            <div
              key={phase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
              style={{ backgroundColor: `${config.color}12` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {weekDates.map(({ week, start, end }) => {
          const phase = PHASE_FOR_WEEK[week];
          const config = PHASE_CONFIG[phase];
          const weekEmails = emails.filter((e) => e.week === week);
          const strategy = WEEK_STRATEGY[week];
          const isLaunchWeek = week === 5;

          return (
            <div
              key={week}
              className={`rounded-xl border p-4 transition-all ${isLaunchWeek ? "ring-2 ring-[#E37FB140]" : ""}`}
              style={{
                borderColor: isLaunchWeek ? "#E37FB1" : "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              {/* Week header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    W{week}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {formatDateShort(start)} — {formatDateShort(end)}
                      </span>
                      {isLaunchWeek && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#E37FB120", color: "#E37FB1" }}
                        >
                          Launch Week
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                      {config.label} — {strategy.goal}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: `${config.color}12`, color: config.color }}
                >
                  {weekEmails.length} emails
                </span>
              </div>

              {/* Strategy note */}
              <div
                className="text-[11px] px-3 py-2 rounded-lg mb-3"
                style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
              >
                <span className="font-medium">Tone:</span> {strategy.tone}
              </div>

              {/* Email cards */}
              <div className="space-y-1.5">
                {weekEmails.map((email) => {
                  const statusIcon =
                    email.status === "published" ? (
                      <Send size={12} className="text-blue-500" />
                    ) : email.status === "approved" ? (
                      <CheckCircle2 size={12} className="text-green-500" />
                    ) : (
                      <Circle size={12} style={{ color: "var(--muted-light)" }} />
                    );

                  return (
                    <div
                      key={email.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: `${config.color}06` }}
                    >
                      {statusIcon}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                          {email.subject}
                        </p>
                      </div>
                      <span className="text-[9px] shrink-0" style={{ color: "var(--muted-light)" }}>
                        S{email.sequence}
                      </span>
                      <span
                        className="text-[9px] capitalize shrink-0"
                        style={{
                          color:
                            email.status === "published"
                              ? "#5A6FFF"
                              : email.status === "approved"
                              ? "#1EAA55"
                              : "#B8930A",
                        }}
                      >
                        {email.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Segment info */}
              {weekEmails.length > 0 && (
                <p className="text-[10px] mt-2 px-1" style={{ color: "var(--muted-light)" }}>
                  Primary segment: {weekEmails[0].segment}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Connections to other departments */}
      <div
        className="rounded-xl border p-5 mt-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Cross-Department Connections
        </h3>
        <div className="space-y-2">
          {[
            { dept: "Operations", connection: "Email list size and signups feed the company KPI dashboard" },
            { dept: "Content Engine", connection: "High-performing email content gets repurposed for social" },
            { dept: "Legal / Compliance", connection: "Every email requires compliance review before send" },
            { dept: "Fundraising", connection: "List size + conversion rate = traction proof for investors" },
          ].map((item) => (
            <div key={item.dept} className="flex items-start gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: "#E37FB1" }}
              />
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                <span className="font-medium" style={{ color: "var(--foreground)" }}>{item.dept}:</span>{" "}
                {item.connection}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
