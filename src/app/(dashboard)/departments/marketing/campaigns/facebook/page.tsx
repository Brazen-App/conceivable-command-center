"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  Zap,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";
import {
  FACEBOOK_GROUPS,
  CATEGORY_CONFIG,
  OUTREACH_STATUS_CONFIG,
  OUTREACH_APPROACHES,
  ADMIN_OUTREACH_TEMPLATES,
  RESPONSE_TEMPLATES,
  type GroupCategory,
  type OutreachStatus,
  type FacebookGroup,
} from "@/lib/data/facebook-strategy";

const ACCENT = "#5A6FFF";

function StatusBadge({ status }: { status: OutreachStatus }) {
  const config = OUTREACH_STATUS_CONFIG[status];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${config.color}14`, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function StatusIcon({ status }: { status: OutreachStatus }) {
  const config = OUTREACH_STATUS_CONFIG[status];
  switch (status) {
    case "active":
      return <CheckCircle2 size={14} style={{ color: config.color }} />;
    case "live_scheduled":
      return <Radio size={14} style={{ color: config.color }} />;
    case "outreach_sent":
      return <Send size={14} style={{ color: config.color }} />;
    default:
      return <Clock size={14} style={{ color: config.color }} />;
  }
}

function CopyableTemplate({ label, body, subject }: { label: string; body: string; subject?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = subject ? `Subject: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {label}
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg transition-colors"
          style={{ backgroundColor: copied ? "#1EAA5514" : `${ACCENT}12`, color: copied ? "#1EAA55" : ACCENT }}
        >
          {copied ? <CheckCircle2 size={10} /> : <Copy size={10} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {subject && (
        <p className="text-xs font-medium mb-2" style={{ color: ACCENT }}>
          Subject: {subject}
        </p>
      )}
      <pre
        className="text-xs leading-relaxed whitespace-pre-wrap font-sans"
        style={{ color: "var(--muted)" }}
      >
        {body}
      </pre>
    </div>
  );
}

export default function FacebookStrategyPage() {
  const [categoryFilter, setCategoryFilter] = useState<GroupCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OutreachStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"groups" | "approaches" | "admin-templates" | "response-templates">("groups");
  const [statuses, setStatuses] = useState<Record<string, OutreachStatus>>({});

  const filteredGroups = useMemo(() => {
    return FACEBOOK_GROUPS.filter((g) => {
      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
      const effectiveStatus = statuses[g.id] ?? g.outreachStatus;
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) return false;
      if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [categoryFilter, statusFilter, searchQuery, statuses]);

  const getEffectiveStatus = (g: FacebookGroup): OutreachStatus => statuses[g.id] ?? g.outreachStatus;

  const totalReach = FACEBOOK_GROUPS.reduce((s, g) => s + g.estimatedMembers, 0);
  const expertFriendly = FACEBOOK_GROUPS.filter((g) => g.allowsExpertContent).length;
  const highActivity = FACEBOOK_GROUPS.filter((g) => g.activityLevel === "high").length;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of FACEBOOK_GROUPS) {
      counts[g.category] = (counts[g.category] || 0) + 1;
    }
    return counts;
  }, []);

  const advanceStatus = (id: string) => {
    const current = statuses[id] ?? "not_contacted";
    const progression: OutreachStatus[] = ["not_contacted", "outreach_sent", "live_scheduled", "active"];
    const idx = progression.indexOf(current);
    if (idx < progression.length - 1) {
      setStatuses((prev) => ({ ...prev, [id]: progression[idx + 1] }));
    }
  };

  const TABS = [
    { key: "groups" as const, label: "Target Groups", count: FACEBOOK_GROUPS.length },
    { key: "approaches" as const, label: "Outreach Approaches", count: OUTREACH_APPROACHES.length },
    { key: "admin-templates" as const, label: "Admin Templates", count: ADMIN_OUTREACH_TEMPLATES.length },
    { key: "response-templates" as const, label: "Kirsten's Responses", count: RESPONSE_TEMPLATES.length },
  ];

  return (
    <div className="space-y-6 p-6">
      <CompanyGoalsBanner departmentFocus="Infiltrate 50 Facebook groups with value-first expert content" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Facebook Group Strategy
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          50 target groups across 8 fertility categories. Value-first. Trust-building. No spam.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {(totalReach / 1000000).toFixed(1)}M
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: ACCENT }}>
            Total Reach
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {FACEBOOK_GROUPS.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#9686B9" }}>
            Target Groups
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>
            {expertFriendly}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>
            Expert-Friendly
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>
            {highActivity}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#F1C028" }}>
            High Activity
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              activeTab === tab.key
                ? { backgroundColor: ACCENT, color: "#FFFFFF" }
                : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {tab.label}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={
                activeTab === tab.key
                  ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#FFFFFF" }
                  : { backgroundColor: `${ACCENT}14`, color: ACCENT }
              }
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Groups Tab */}
      {activeTab === "groups" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={12} style={{ color: "var(--muted)" }} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as GroupCategory | "all")}
                className="text-xs rounded-lg px-2 py-2"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label} ({categoryCounts[key] || 0})
                  </option>
                ))}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OutreachStatus | "all")}
              className="text-xs rounded-lg px-2 py-2"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="all">All Statuses</option>
              {Object.entries(OUTREACH_STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Group List */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {filteredGroups.map((group, i) => {
              const catConfig = CATEGORY_CONFIG[group.category];
              const effectiveStatus = getEffectiveStatus(group);
              const isExpanded = expandedGroup === group.id;

              return (
                <div key={group.id}>
                  <div
                    className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  >
                    <StatusIcon status={effectiveStatus} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                          {group.name}
                        </p>
                        {group.allowsExpertContent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0" style={{ backgroundColor: "#1EAA5514", color: "#1EAA55" }}>
                            Expert OK
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${catConfig.color}14`, color: catConfig.color }}
                        >
                          {catConfig.label}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                          {group.activityLevel} activity
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {(group.estimatedMembers / 1000).toFixed(0)}K
                        </p>
                        <p className="text-[9px]" style={{ color: "var(--muted)" }}>members</p>
                      </div>
                      <StatusBadge status={effectiveStatus} />
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--muted)" }} />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="px-4 py-3"
                      style={{
                        backgroundColor: `${ACCENT}04`,
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => advanceStatus(group.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white"
                          style={{ backgroundColor: "#1EAA55" }}
                        >
                          <Zap size={11} /> Advance Status
                        </button>
                        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                          Category: {catConfig.label} | Activity: {group.activityLevel} | Expert Content: {group.allowsExpertContent ? "Yes" : "No"}
                        </span>
                      </div>
                      {group.notes && (
                        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>{group.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredGroups.length === 0 && (
              <div className="px-4 py-8 text-center" style={{ backgroundColor: "var(--surface)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>No groups match your filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Approaches Tab */}
      {activeTab === "approaches" && (
        <div className="space-y-4">
          {OUTREACH_APPROACHES.map((approach, i) => (
            <div
              key={approach.id}
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
                    {approach.name}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                    {approach.description}
                  </p>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>Steps:</p>
                <ol className="space-y-1.5">
                  {approach.steps.map((step, si) => (
                    <li key={si} className="flex items-start gap-2 text-xs" style={{ color: "var(--muted)" }}>
                      <span className="font-bold shrink-0" style={{ color: ACCENT }}>{si + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={11} style={{ color: "#F1C028" }} />
                    <span className="text-[10px] font-medium" style={{ color: "#F1C028" }}>
                      Expected: {approach.expectedConversionRate}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {approach.bestFor.map((cat) => (
                      <span
                        key={cat}
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${CATEGORY_CONFIG[cat].color}14`, color: CATEGORY_CONFIG[cat].color }}
                      >
                        {CATEGORY_CONFIG[cat].label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Templates Tab */}
      {activeTab === "admin-templates" && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, #5A6FFF08 0%, #ACB7FF08 100%)",
              border: "1px solid rgba(90, 111, 255, 0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} style={{ color: ACCENT }} />
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Admin Outreach Messages
              </p>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Copy these templates and personalize the bracketed sections for each group admin.
              Always research the admin and their group before sending.
            </p>
          </div>
          {ADMIN_OUTREACH_TEMPLATES.map((tmpl) => (
            <CopyableTemplate
              key={tmpl.id}
              label={tmpl.label}
              body={tmpl.body}
              subject={tmpl.subject}
            />
          ))}
        </div>
      )}

      {/* Response Templates Tab */}
      {activeTab === "response-templates" && (
        <div className="space-y-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, #E37FB108 0%, #9686B908 100%)",
              border: "1px solid rgba(227, 127, 177, 0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} style={{ color: "#E37FB1" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Kirsten&apos;s Response Templates
              </p>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Pre-written responses to common fertility questions in Facebook groups.
              Always personalize before posting — never copy-paste verbatim.
              Voice: warm, science-backed, genuinely helpful. No product pitches.
            </p>
          </div>
          {RESPONSE_TEMPLATES.map((tmpl) => (
            <CopyableTemplate
              key={tmpl.id}
              label={tmpl.label}
              body={tmpl.body}
            />
          ))}
        </div>
      )}
    </div>
  );
}
