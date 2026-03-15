"use client";

import { useState, useMemo } from "react";
import {
  Mic2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  XCircle,
  ExternalLink,
  Zap,
  Users,
  Sparkles,
  Link2,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";
import {
  PODCAST_HOSTS,
  PODCAST_CATEGORY_CONFIG,
  PODCAST_STATUS_CONFIG,
  REACTIVATION_EMAIL_TEMPLATE,
  generateReferralLink,
  type PodcastCategory,
  type PodcastOutreachStatus,
  type PodcastHost,
} from "@/lib/data/podcast-outreach";

const ACCENT = "#5A6FFF";

function StatusBadge({ status }: { status: PodcastOutreachStatus }) {
  const config = PODCAST_STATUS_CONFIG[status];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${config.color}14`, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function StatusIcon({ status }: { status: PodcastOutreachStatus }) {
  const config = PODCAST_STATUS_CONFIG[status];
  switch (status) {
    case "aired":
      return <CheckCircle2 size={14} style={{ color: config.color }} />;
    case "booked":
      return <Radio size={14} style={{ color: config.color }} />;
    case "responded":
      return <Mic2 size={14} style={{ color: config.color }} />;
    case "email_sent":
      return <Send size={14} style={{ color: config.color }} />;
    case "declined":
      return <XCircle size={14} style={{ color: config.color }} />;
    default:
      return <Clock size={14} style={{ color: config.color }} />;
  }
}

export default function PodcastOutreachPage() {
  const [categoryFilter, setCategoryFilter] = useState<PodcastCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PodcastOutreachStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedHost, setExpandedHost] = useState<string | null>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, PodcastOutreachStatus>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "listeners" | "date">("listeners");

  const getEffectiveStatus = (h: PodcastHost): PodcastOutreachStatus =>
    statuses[h.id] ?? h.outreachStatus;

  const filteredHosts = useMemo(() => {
    const filtered = PODCAST_HOSTS.filter((h) => {
      if (categoryFilter !== "all" && h.category !== categoryFilter) return false;
      const effectiveStatus = getEffectiveStatus(h);
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) return false;
      if (
        searchQuery &&
        !h.hostName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !h.podcastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "listeners") return b.estimatedListeners - a.estimatedListeners;
      if (sortBy === "name") return a.hostName.localeCompare(b.hostName);
      if (sortBy === "date") return (b.previousEpisodeDate ?? "").localeCompare(a.previousEpisodeDate ?? "");
      return 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter, searchQuery, statuses, sortBy]);

  const advanceStatus = (id: string) => {
    const current = statuses[id] ?? "not_contacted";
    const progression: PodcastOutreachStatus[] = ["not_contacted", "email_sent", "responded", "booked", "aired"];
    const idx = progression.indexOf(current);
    if (idx < progression.length - 1) {
      setStatuses((prev) => ({ ...prev, [id]: progression[idx + 1] }));
    }
  };

  const markDeclined = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "declined" }));
  };

  const handleCopyTemplate = () => {
    const text = `Subject: ${REACTIVATION_EMAIL_TEMPLATE.subject}\n\n${REACTIVATION_EMAIL_TEMPLATE.body}`;
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleCopyLink = (podcastName: string) => {
    const link = generateReferralLink(podcastName);
    navigator.clipboard.writeText(link);
    setCopiedLink(podcastName);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const totalListeners = PODCAST_HOSTS.reduce((s, h) => s + h.estimatedListeners, 0);
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const h of PODCAST_HOSTS) {
      counts[h.category] = (counts[h.category] || 0) + 1;
    }
    return counts;
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const h of PODCAST_HOSTS) {
      const s = getEffectiveStatus(h);
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statuses]);

  return (
    <div className="space-y-6 p-6">
      <CompanyGoalsBanner departmentFocus="Reactivate 120 podcast hosts for launch push" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Podcast Reactivation Outreach
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          120 podcast hosts Kirsten has appeared on. Time to tell them about Conceivable.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {PODCAST_HOSTS.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: ACCENT }}>
            Total Hosts
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {(totalListeners / 1000000).toFixed(1)}M
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#9686B9" }}>
            Combined Reach
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>
            {statusCounts["email_sent"] || 0}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#F1C028" }}>
            Emails Sent
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>
            {statusCounts["booked"] || 0}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>
            Booked
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#78C3BF" }}>
            {statusCounts["aired"] || 0}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#78C3BF" }}>
            Aired
          </p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Outreach Pipeline
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.entries(PODCAST_STATUS_CONFIG) as [PodcastOutreachStatus, { label: string; color: string }][]).map(
            ([key, cfg], i, arr) => (
              <div key={key} className="flex items-center gap-2">
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white mx-auto"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {statusCounts[key] || 0}
                  </div>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--muted)" }}>
                    {cfg.label}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-xs mx-1" style={{ color: "var(--border)" }}>
                    &rarr;
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Reactivation Email Template */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setShowTemplate(!showTemplate)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center gap-2">
            <Send size={16} style={{ color: ACCENT }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Reactivation Email Template
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyTemplate();
              }}
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg"
              style={{
                backgroundColor: copiedTemplate ? "#1EAA5514" : `${ACCENT}12`,
                color: copiedTemplate ? "#1EAA55" : ACCENT,
              }}
            >
              {copiedTemplate ? <CheckCircle2 size={10} /> : <Copy size={10} />}
              {copiedTemplate ? "Copied!" : "Copy"}
            </button>
            {showTemplate ? (
              <ChevronUp size={14} style={{ color: "var(--muted)" }} />
            ) : (
              <ChevronDown size={14} style={{ color: "var(--muted)" }} />
            )}
          </div>
        </button>
        {showTemplate && (
          <div className="px-5 py-4" style={{ backgroundColor: "var(--background)", borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: ACCENT }}>
              Subject: {REACTIVATION_EMAIL_TEMPLATE.subject}
            </p>
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap font-sans"
              style={{ color: "var(--muted)" }}
            >
              {REACTIVATION_EMAIL_TEMPLATE.body}
            </pre>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search hosts or podcasts..."
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
            onChange={(e) => setCategoryFilter(e.target.value as PodcastCategory | "all")}
            className="text-xs rounded-lg px-2 py-2"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="all">All Categories</option>
            {Object.entries(PODCAST_CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label} ({categoryCounts[key] || 0})
              </option>
            ))}
          </select>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PodcastOutreachStatus | "all")}
          className="text-xs rounded-lg px-2 py-2"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="all">All Statuses</option>
          {Object.entries(PODCAST_STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "listeners" | "date")}
          className="text-xs rounded-lg px-2 py-2"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="listeners">Sort: Largest Audience</option>
          <option value="name">Sort: Host Name</option>
          <option value="date">Sort: Most Recent</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Showing {filteredHosts.length} of {PODCAST_HOSTS.length} hosts
      </p>

      {/* Host List */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {filteredHosts.map((host, i) => {
          const catConfig = PODCAST_CATEGORY_CONFIG[host.category];
          const effectiveStatus = getEffectiveStatus(host);
          const isExpanded = expandedHost === host.id;
          const refLink = generateReferralLink(host.podcastName);

          return (
            <div key={host.id}>
              <div
                className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-black/[0.02] transition-colors"
                style={{
                  backgroundColor: i % 2 === 0 ? "var(--background)" : "var(--surface)",
                  borderBottom: "1px solid var(--border)",
                }}
                onClick={() => setExpandedHost(isExpanded ? null : host.id)}
              >
                <StatusIcon status={effectiveStatus} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {host.hostName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
                      {host.podcastName}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${catConfig.color}14`, color: catConfig.color }}
                    >
                      {catConfig.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {host.estimatedListeners >= 1000
                        ? `${(host.estimatedListeners / 1000).toFixed(0)}K`
                        : host.estimatedListeners}
                    </p>
                    <p className="text-[9px]" style={{ color: "var(--muted)" }}>listeners</p>
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
                  {host.previousEpisodeTitle && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: "var(--muted)" }}>
                        Previous Episode
                      </p>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                        &ldquo;{host.previousEpisodeTitle}&rdquo;
                      </p>
                      {host.previousEpisodeDate && (
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                          Aired: {host.previousEpisodeDate}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Referral Link */}
                  <div
                    className="rounded-lg p-3 mb-3"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link2 size={12} style={{ color: ACCENT }} />
                        <span className="text-[10px] font-medium" style={{ color: "var(--foreground)" }}>
                          Referral Link:
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: ACCENT }}>
                          {refLink}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(host.podcastName);
                        }}
                        className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: copiedLink === host.podcastName ? "#1EAA5514" : `${ACCENT}12`,
                          color: copiedLink === host.podcastName ? "#1EAA55" : ACCENT,
                        }}
                      >
                        {copiedLink === host.podcastName ? <CheckCircle2 size={9} /> : <Copy size={9} />}
                        {copiedLink === host.podcastName ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        advanceStatus(host.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white"
                      style={{ backgroundColor: "#1EAA55" }}
                    >
                      <Zap size={11} /> Advance
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markDeclined(host.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white"
                      style={{ backgroundColor: "#E24D47" }}
                    >
                      <XCircle size={11} /> Declined
                    </button>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      Audience: {host.estimatedListeners.toLocaleString()} listeners
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredHosts.length === 0 && (
          <div className="px-4 py-8 text-center" style={{ backgroundColor: "var(--surface)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>No hosts match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
