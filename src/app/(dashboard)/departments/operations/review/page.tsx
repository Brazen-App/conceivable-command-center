"use client";

import { useState } from "react";
import {
  Mail,
  FileText,
  Send,
  Shield,
  FileCheck,
  Lightbulb,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";

type ReviewCategory = "emails" | "content" | "outreach" | "compliance" | "patents" | "decisions";

const CATEGORIES: { id: ReviewCategory; label: string; icon: typeof Mail; color: string }[] = [
  { id: "emails", label: "Emails to Approve", icon: Mail, color: "#E37FB1" },
  { id: "content", label: "Content to Approve", icon: FileText, color: "#5A6FFF" },
  { id: "outreach", label: "Outreach Drafts", icon: Send, color: "#356FB6" },
  { id: "compliance", label: "Compliance Flags", icon: Shield, color: "#E24D47" },
  { id: "patents", label: "Patent Drafts", icon: FileCheck, color: "#78C3BF" },
  { id: "decisions", label: "Strategy Decisions", icon: Lightbulb, color: "#F1C028" },
];

interface ReviewItem {
  id: string;
  category: ReviewCategory;
  title: string;
  subtitle: string;
  priority: "high" | "medium" | "low";
  department: string;
  submittedAt: string;
  expanded?: boolean;
  detail?: string;
}

const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "r1",
    category: "emails",
    title: "Week 1, Email 1: \"We've been quiet. Here's why.\"",
    subtitle: "Re-engagement email — first in 8-week launch sequence",
    priority: "high",
    department: "Marketing",
    submittedAt: "Ready to send",
    detail: "This is the critical first touch to re-engage 28,905 subscribers. Compliance-scanned. Opens the re-engagement phase.",
  },
  {
    id: "r2",
    category: "emails",
    title: "Week 1, Email 2: \"What if everything you've been told about fertility is incomplete?\"",
    subtitle: "Re-engagement email — follows 48h after Email 1",
    priority: "high",
    department: "Marketing",
    submittedAt: "Ready to send",
    detail: "Challenges conventional fertility advice. Links to core science. High expected open rate based on subject line testing.",
  },
  {
    id: "r3",
    category: "emails",
    title: "Week 2, Email 3: \"The 50 factors your doctor isn't tracking\"",
    subtitle: "Education phase — introduces Conceivable's approach",
    priority: "high",
    department: "Marketing",
    submittedAt: "Ready to send",
    detail: "Core differentiator email. Introduces the 50-factor model. Includes infographic link.",
  },
  {
    id: "r4",
    category: "compliance",
    title: "Testimonial: Sarah's PCOS story",
    subtitle: "Email contains patient testimonial — FTC verification needed",
    priority: "high",
    department: "Legal",
    submittedAt: "Flagged by auto-scan",
    detail: "Sarah's PCOS testimonial in Email 8 needs FTC verification. Must have documented consent and outcome verification before sending.",
  },
  {
    id: "r5",
    category: "patents",
    title: "Closed-Loop Fertility Optimization System",
    subtitle: "Provisional filing — overdue, must file before fundraise",
    priority: "high",
    department: "Legal",
    submittedAt: "Draft ready for review",
    detail: "Core IP protecting the feedback loop between wearable data, AI recommendations, and outcome tracking. Filing deadline is critical — competitors are active.",
  },
  {
    id: "r6",
    category: "decisions",
    title: "Bridge round target: $150K vs $250K",
    subtitle: "Joy recommends $150K — faster close, less dilution, 4mo runway extension",
    priority: "medium",
    department: "Strategy",
    submittedAt: "Pending CEO decision",
    detail: "At $28K/mo burn, $150K extends runway to 7 months (through launch). $250K gives more buffer but takes longer to close and increases dilution pre-traction.",
  },
];

const PRIORITY_STYLES = {
  high: { color: "#E24D47", bg: "#E24D4710", label: "High" },
  medium: { color: "#F1C028", bg: "#F1C02810", label: "Medium" },
  low: { color: "#1EAA55", bg: "#1EAA5510", label: "Low" },
};

export default function CEOReviewPage() {
  const [activeCategory, setActiveCategory] = useState<ReviewCategory | "all">("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set());

  const filteredItems = REVIEW_ITEMS.filter(
    (item) => !approvedItems.has(item.id) && (activeCategory === "all" || item.category === activeCategory)
  ).sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApprove = (id: string) => {
    setApprovedItems((prev) => new Set(prev).add(id));
    setFlaggedItems((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleFlag = (id: string) => {
    setFlaggedItems((prev) => new Set(prev).add(id));
    setApprovedItems((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const pendingCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: REVIEW_ITEMS.filter((i) => i.category === cat.id && !approvedItems.has(i.id)).length,
  }));

  const totalPending = REVIEW_ITEMS.filter((i) => !approvedItems.has(i.id)).length;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
      <CompanyGoalsBanner departmentFocus="Clear review queue to unblock email launch" />

      {/* Summary */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: "#5A6FFF" }} />
          <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            {totalPending} items need your review
          </h2>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
          style={{
            backgroundColor: activeCategory === "all" ? "#5A6FFF12" : "transparent",
            color: activeCategory === "all" ? "#5A6FFF" : "var(--muted)",
            border: activeCategory === "all" ? "1px solid #5A6FFF20" : "1px solid transparent",
          }}
        >
          All ({totalPending})
        </button>
        {pendingCounts.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: isActive ? `${cat.color}12` : "transparent",
                color: isActive ? cat.color : "var(--muted)",
                border: isActive ? `1px solid ${cat.color}20` : "1px solid transparent",
              }}
            >
              <Icon size={12} />
              {cat.label}
              {cat.count > 0 && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Review Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "#1EAA55" }} />
            <p className="text-sm font-medium" style={{ color: "#1EAA55" }}>All caught up!</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              No items pending review in this category.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const cat = CATEGORIES.find((c) => c.id === item.category)!;
            const Icon = cat.icon;
            const pStyle = PRIORITY_STYLES[item.priority];
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className="rounded-xl border overflow-hidden transition-shadow hover:shadow-sm"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}14` }}
                    >
                      <Icon size={15} style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: pStyle.bg, color: pStyle.color }}
                        >
                          {pStyle.label}
                        </span>
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cat.color}10`, color: cat.color }}>
                          {item.department}
                        </span>
                        <span className="text-[9px]" style={{ color: "var(--muted)" }}>
                          {item.submittedAt}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {item.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                        {item.subtitle}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronUp size={16} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs leading-relaxed mt-3 mb-4" style={{ color: "var(--foreground)" }}>
                      {item.detail}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApprove(item.id); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                        style={{ backgroundColor: "#1EAA55" }}
                      >
                        <CheckCircle2 size={13} />
                        Approve
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFlag(item.id); }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor: flaggedItems.has(item.id) ? "#F1C02818" : "var(--border)",
                          color: flaggedItems.has(item.id) ? "#F1C028" : "var(--foreground)",
                        }}
                      >
                        <AlertTriangle size={13} />
                        {flaggedItems.has(item.id) ? "Flagged" : "Flag for Discussion"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
