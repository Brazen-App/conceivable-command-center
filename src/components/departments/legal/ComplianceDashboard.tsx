"use client";

import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronRight,
  FileWarning,
  ExternalLink,
  Ban,
  Check,
  Eye,
} from "lucide-react";
import type {
  ComplianceClaim,
  RegulatoryItem,
  PendingReview,
  TestimonialFlag,
} from "@/lib/data/legal-data";

interface Props {
  claims: ComplianceClaim[];
  regulatory: RegulatoryItem[];
  pendingReviews: PendingReview[];
  testimonialFlags: TestimonialFlag[];
  onReviewAction: (id: string, action: "approved" | "rejected" | "needs_revision") => void;
}

type ComplianceSection = "regulatory" | "claims" | "reviews" | "testimonials";

const BODY_CONFIG: Record<string, { label: string; color: string }> = {
  FDA: { label: "FDA", color: "#5A6FFF" },
  FTC: { label: "FTC", color: "#E37FB1" },
  HIPAA: { label: "HIPAA", color: "#1EAA55" },
  State: { label: "State Law", color: "#9686B9" },
};

const STATUS_ICON: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  compliant: { icon: CheckCircle2, color: "#1EAA55" },
  in_progress: { icon: Clock, color: "#F1C028" },
  non_compliant: { icon: XCircle, color: "#E24D47" },
  not_started: { icon: Clock, color: "var(--muted-light)" },
};

const CLAIM_STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Approved", color: "#1EAA55", icon: CheckCircle2 },
  restricted: { label: "Restricted", color: "#F1C028", icon: AlertTriangle },
  prohibited: { label: "Prohibited", color: "#E24D47", icon: Ban },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#E24D47" },
  warning: { label: "Warning", color: "#F1C028" },
  info: { label: "Info", color: "#5A6FFF" },
};

export default function ComplianceDashboard({
  claims,
  regulatory,
  pendingReviews,
  testimonialFlags,
  onReviewAction,
}: Props) {
  const [activeSection, setActiveSection] = useState<ComplianceSection>("regulatory");
  const [claimFilter, setClaimFilter] = useState<"all" | "approved" | "restricted" | "prohibited">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sections: { id: ComplianceSection; label: string; count: number; alert?: boolean }[] = [
    { id: "regulatory", label: "Regulatory Tracker", count: regulatory.length },
    { id: "claims", label: "Claims Database", count: claims.length },
    {
      id: "reviews",
      label: "Pending Reviews",
      count: pendingReviews.filter((r) => r.status === "pending").length,
      alert: pendingReviews.filter((r) => r.status === "pending").length > 0,
    },
    {
      id: "testimonials",
      label: "Testimonial Flags",
      count: testimonialFlags.filter((t) => t.status === "unresolved").length,
      alert: testimonialFlags.filter((t) => t.status === "unresolved").length > 0,
    },
  ];

  const complianceScore = Math.round(
    (regulatory.filter((r) => r.status === "compliant").length / regulatory.length) * 100
  );
  const nonCompliant = regulatory.filter((r) => r.status === "non_compliant").length;
  const pendingCount = pendingReviews.filter((r) => r.status === "pending").length;
  const unresolvedTestimonials = testimonialFlags.filter((t) => t.status === "unresolved").length;

  const filteredClaims = claims.filter((c) => {
    if (claimFilter !== "all" && c.status !== claimFilter) return false;
    if (searchQuery && !c.claim.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Compliance overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: complianceScore >= 80 ? "#1EAA5530" : "#E24D4730",
            backgroundColor: "var(--surface)",
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Compliance Score
          </p>
          <p className="text-2xl font-bold" style={{ color: complianceScore >= 80 ? "#1EAA55" : "#E24D47" }}>
            {complianceScore}%
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
            {regulatory.filter((r) => r.status === "compliant").length} / {regulatory.length} areas
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: nonCompliant > 0 ? "#E24D4730" : "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Non-Compliant
          </p>
          <p className="text-2xl font-bold" style={{ color: nonCompliant > 0 ? "#E24D47" : "#1EAA55" }}>
            {nonCompliant}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>Issues requiring action</p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: pendingCount > 0 ? "#F1C02830" : "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Pending Reviews
          </p>
          <p className="text-2xl font-bold" style={{ color: pendingCount > 0 ? "#F1C028" : "#1EAA55" }}>
            {pendingCount}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>Content awaiting review</p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: unresolvedTestimonials > 0 ? "#E24D4730" : "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Testimonial Flags
          </p>
          <p className="text-2xl font-bold" style={{ color: unresolvedTestimonials > 0 ? "#E24D47" : "#1EAA55" }}>
            {unresolvedTestimonials}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>Unresolved FTC issues</p>
        </div>
      </div>

      {/* Section tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {sections.map((section) => {
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={active ? { backgroundColor: "var(--surface)", color: "#E24D47" } : { color: "var(--muted)" }}
            >
              {section.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${section.alert ? "animate-pulse" : ""}`}
                style={
                  section.alert
                    ? { backgroundColor: "#E24D4714", color: "#E24D47" }
                    : active
                    ? { backgroundColor: "#E24D4714", color: "#E24D47" }
                    : { backgroundColor: "var(--background)", color: "var(--muted-light)" }
                }
              >
                {section.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* REGULATORY TRACKER */}
      {activeSection === "regulatory" && (
        <div className="space-y-4">
          {(Object.keys(BODY_CONFIG) as Array<keyof typeof BODY_CONFIG>).map((body) => {
            const config = BODY_CONFIG[body];
            const items = regulatory.filter((r) => r.body === body);
            if (items.length === 0) return null;

            return (
              <div key={body}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
                    {config.label}
                  </h3>
                  <span className="text-[10px]" style={{ color: "var(--muted-light)" }}>{items.length} items</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => {
                    const statusConf = STATUS_ICON[item.status];
                    const StatusIcon = statusConf.icon;
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: item.status === "non_compliant" ? "#E24D4730" : "var(--border)",
                          backgroundColor: item.status === "non_compliant" ? "#E24D4704" : "var(--surface)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <StatusIcon size={16} style={{ color: statusConf.color }} className="shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                                {item.area}
                              </p>
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
                                style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                              >
                                {item.status.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                              {item.requirement}
                            </p>
                            <div
                              className="rounded-lg p-2.5 text-xs leading-relaxed"
                              style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                            >
                              {item.notes}
                            </div>
                            {item.deadline && (
                              <p className="text-[10px] mt-2" style={{ color: "var(--muted-light)" }}>
                                Deadline: {new Date(item.deadline).toLocaleDateString()}
                                {item.assignee && ` &middot; Assigned: ${item.assignee}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CLAIMS DATABASE */}
      {activeSection === "claims" && (
        <div>
          {/* Search and filter */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px]"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <Search size={14} style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-transparent outline-none flex-1"
                style={{ color: "var(--foreground)" }}
              />
            </div>
            <div className="flex items-center gap-1">
              {(["all", "approved", "restricted", "prohibited"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setClaimFilter(filter)}
                  className="text-[10px] font-medium px-3 py-1.5 rounded-lg capitalize"
                  style={
                    claimFilter === filter
                      ? { backgroundColor: "#E24D4714", color: "#E24D47" }
                      : { color: "var(--muted)" }
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredClaims.map((claim) => {
              const conf = CLAIM_STATUS_CONFIG[claim.status];
              const ClaimIcon = conf.icon;

              return (
                <div
                  key={claim.id}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: claim.status === "prohibited" ? "#E24D4730" : "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <ClaimIcon size={16} style={{ color: conf.color }} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${conf.color}14`, color: conf.color }}
                        >
                          {conf.label}
                        </span>
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
                        >
                          {claim.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        &ldquo;{claim.claim}&rdquo;
                      </p>

                      {claim.status === "approved" && claim.citation && (
                        <div className="mt-2 rounded-lg p-2.5" style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#1EAA55" }}>
                            Supporting Evidence
                          </p>
                          <p className="text-xs" style={{ color: "var(--foreground)" }}>{claim.citation}</p>
                          {claim.studyDetails && (
                            <p className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>{claim.studyDetails}</p>
                          )}
                        </div>
                      )}

                      {claim.status === "approved" && claim.disclaimer && claim.disclaimer !== "No disclaimer required — factual product description" && (
                        <div className="mt-2 rounded-lg p-2.5" style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#F1C028" }}>
                            Required Disclaimer
                          </p>
                          <p className="text-xs" style={{ color: "var(--foreground)" }}>{claim.disclaimer}</p>
                        </div>
                      )}

                      {(claim.status === "restricted" || claim.status === "prohibited") && claim.restrictionReason && (
                        <div
                          className="mt-2 rounded-lg p-2.5"
                          style={{
                            backgroundColor: claim.status === "prohibited" ? "#E24D4708" : "#F1C02808",
                            borderLeft: `3px solid ${claim.status === "prohibited" ? "#E24D47" : "#F1C028"}`,
                          }}
                        >
                          <p
                            className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                            style={{ color: claim.status === "prohibited" ? "#E24D47" : "#F1C028" }}
                          >
                            {claim.status === "prohibited" ? "Why Prohibited" : "Restriction Details"}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                            {claim.restrictionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PENDING REVIEWS */}
      {activeSection === "reviews" && (
        <div>
          <div
            className="rounded-lg p-3 mb-4 flex items-start gap-2"
            style={{ backgroundColor: "#5A6FFF08", borderLeft: "3px solid #5A6FFF" }}
          >
            <Eye size={12} className="shrink-0 mt-0.5" style={{ color: "#5A6FFF" }} />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              All content from the Content Engine and Email Strategy departments routes here for compliance review before publishing. Items flagged automatically when they contain health outcome claims, pregnancy rate claims, or comparative claims.
            </p>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((review) => {
              const sevConf = SEVERITY_CONFIG[review.severity];
              return (
                <div
                  key={review.id}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: review.severity === "critical" ? "#E24D4730" : "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <FileWarning size={16} style={{ color: sevConf.color }} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${sevConf.color}14`, color: sevConf.color }}
                        >
                          {sevConf.label}
                        </span>
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
                        >
                          {review.source}
                        </span>
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}
                        >
                          {review.flagType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {review.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {review.flagReason}
                      </p>

                      <div
                        className="rounded-lg p-3 mt-2 text-xs leading-relaxed"
                        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      >
                        {review.content}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                          Submitted: {new Date(review.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {review.status === "pending" && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => onReviewAction(review.id, "approved")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                            style={{ backgroundColor: "#1EAA55" }}
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => onReviewAction(review.id, "needs_revision")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: "#F1C02814", color: "#F1C028", border: "1px solid #F1C02830" }}
                          >
                            <AlertTriangle size={12} /> Needs Revision
                          </button>
                          <button
                            onClick={() => onReviewAction(review.id, "rejected")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs"
                            style={{ color: "var(--muted)", backgroundColor: "var(--background)" }}
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {review.status !== "pending" && (
                        <p
                          className="text-xs font-medium mt-3 capitalize"
                          style={{
                            color: review.status === "approved" ? "#1EAA55" : review.status === "rejected" ? "#E24D47" : "#F1C028",
                          }}
                        >
                          Status: {review.status.replace("_", " ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TESTIMONIAL FLAGS */}
      {activeSection === "testimonials" && (
        <div>
          {/* Critical alert */}
          <div
            className="rounded-2xl p-5 mb-4"
            style={{
              backgroundColor: "#E24D470A",
              border: "2px solid #E24D4730",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} style={{ color: "#E24D47" }} className="shrink-0" />
              <div>
                <p className="text-sm font-bold" style={{ color: "#E24D47" }}>
                  CEO Action Required — Testimonial Verification
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--foreground)" }}>
                  The email sequence and website contain stories about &ldquo;Sarah,&rdquo; &ldquo;Lisa,&rdquo; and &ldquo;Maya&rdquo; with specific health outcomes.
                  FTC requires verification: If real patients, they need written consent + disclaimers. If composite/fictional, they CANNOT be presented as real testimonials for a health product.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {testimonialFlags.map((flag) => {
              const sevConf = SEVERITY_CONFIG[flag.severity];
              return (
                <div
                  key={flag.id}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: "#E24D4730",
                    backgroundColor: "#E24D4704",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} style={{ color: sevConf.color }} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${sevConf.color}14`, color: sevConf.color }}
                        >
                          {sevConf.label}
                        </span>
                        <span
                          className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor: flag.status === "unresolved" ? "#E24D4714" : "#1EAA5514",
                            color: flag.status === "unresolved" ? "#E24D47" : "#1EAA55",
                          }}
                        >
                          {flag.status}
                        </span>
                      </div>

                      <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                        &ldquo;{flag.name}&rdquo; — {flag.source}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        <span className="font-medium">Claimed outcome:</span> {flag.claimedOutcome}
                      </p>

                      <div
                        className="rounded-lg p-3 mt-2 text-xs leading-relaxed"
                        style={{ backgroundColor: "#E24D4708", borderLeft: "3px solid #E24D47" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#E24D47" }}>
                          Issue
                        </p>
                        {flag.issue}
                      </div>

                      <div
                        className="rounded-lg p-3 mt-2 text-xs leading-relaxed"
                        style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                          Required Action
                        </p>
                        {flag.requiredAction}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FTC Guidelines reference */}
          <div
            className="rounded-xl border p-4 mt-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <h4 className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>
              FTC Endorsement Guides — Key Requirements
            </h4>
            <div className="space-y-2">
              {[
                "Testimonials must reflect the typical experience of consumers, OR include a clear and conspicuous disclaimer",
                "Material connections between endorser and company must be disclosed",
                "Health product testimonials face heightened scrutiny — specific outcome claims require substantiation",
                "Composite or fictional testimonials CANNOT be presented as real experiences for health products",
                "\"Results not typical\" alone is NOT sufficient — must disclose what typical results are",
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5" style={{ backgroundColor: "#E37FB114", color: "#E37FB1" }}>
                    {i + 1}
                  </div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
