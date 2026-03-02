"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, FileText, Scale, Lock } from "lucide-react";
import PatentPortfolio from "@/components/departments/legal/PatentPortfolio";
import ComplianceDashboard from "@/components/departments/legal/ComplianceDashboard";
import PrivacySecurity from "@/components/departments/legal/PrivacySecurity";
import PatentDraftPanel from "@/components/departments/legal/PatentDraftPanel";
import type {
  Patent,
  CompetitorFiling,
  ComplianceClaim,
  RegulatoryItem,
  PendingReview,
  TestimonialFlag,
  HIPAAChecklistItem,
  VendorReview,
  PrivacyPolicy,
} from "@/lib/data/legal-data";

const TABS = [
  { id: "patents", label: "Patent & IP Portfolio", icon: FileText },
  { id: "compliance", label: "Compliance Dashboard", icon: Scale },
  { id: "privacy", label: "Privacy & Security", icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface LegalData {
  patents: Patent[];
  competitorFilings: CompetitorFiling[];
  claims: ComplianceClaim[];
  regulatory: RegulatoryItem[];
  pendingReviews: PendingReview[];
  testimonialFlags: TestimonialFlag[];
  hipaaChecklist: HIPAAChecklistItem[];
  vendorReviews: VendorReview[];
  privacyPolicies: PrivacyPolicy[];
}

export default function LegalDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("patents");
  const [data, setData] = useState<LegalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftPatent, setDraftPatent] = useState<Patent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleStartDraft = useCallback((patent: Patent) => {
    setDraftPatent(patent);
    setIsPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    // Clear patent after animation completes
    setTimeout(() => setDraftPatent(null), 300);
  }, []);

  useEffect(() => {
    fetch("/api/legal")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleReviewAction = async (id: string, action: "approved" | "rejected" | "needs_revision") => {
    const res = await fetch("/api/legal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const updated = await res.json();
    if (data) {
      setData({
        ...data,
        pendingReviews: data.pendingReviews.map((r) => (r.id === id ? updated : r)),
      });
    }
  };

  const urgentCount = data
    ? data.patents.filter((p) => p.status === "urgent" || p.filingPriority === "critical").length
    : 0;
  const pendingReviewCount = data
    ? data.pendingReviews.filter((r) => r.status === "pending").length
    : 0;
  const unresolvedTestimonials = data
    ? data.testimonialFlags.filter((t) => t.status === "unresolved").length
    : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#E24D4714" }}
          >
            <Shield size={20} style={{ color: "#E24D47" }} strokeWidth={1.8} />
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
              Legal / IP / Compliance
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Immune System — Protecting Everything
            </p>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      {(urgentCount > 0 || unresolvedTestimonials > 0) && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
          style={{
            backgroundColor: "#E24D470A",
            border: "1px solid #E24D4718",
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <Shield size={20} style={{ color: "#E24D47" }} strokeWidth={2} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {urgentCount} urgent patent filing{urgentCount !== 1 ? "s" : ""} &middot;{" "}
                {unresolvedTestimonials} testimonial flag{unresolvedTestimonials !== 1 ? "s" : ""}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {pendingReviewCount} content pieces awaiting compliance review
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          const hasAlert =
            (tab.id === "patents" && urgentCount > 0) ||
            (tab.id === "compliance" && (pendingReviewCount > 0 || unresolvedTestimonials > 0));
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 whitespace-nowrap
                ${active ? "shadow-sm" : ""}
              `}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: "#E24D47" }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {tab.label}
              {hasAlert && (
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#E24D47" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {loading || !data ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#E24D47", borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading legal data...</p>
        </div>
      ) : (
        <>
          {activeTab === "patents" && (
            <PatentPortfolio
              patents={data.patents}
              competitorFilings={data.competitorFilings}
              onStartDraft={handleStartDraft}
            />
          )}
          {activeTab === "compliance" && (
            <ComplianceDashboard
              claims={data.claims}
              regulatory={data.regulatory}
              pendingReviews={data.pendingReviews}
              testimonialFlags={data.testimonialFlags}
              onReviewAction={handleReviewAction}
            />
          )}
          {activeTab === "privacy" && (
            <PrivacySecurity
              hipaaChecklist={data.hipaaChecklist}
              vendorReviews={data.vendorReviews}
              privacyPolicies={data.privacyPolicies}
            />
          )}
        </>
      )}

      {/* Patent Draft Panel */}
      {draftPatent && (
        <PatentDraftPanel
          patent={draftPatent}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
