"use client";

import { useState } from "react";
import {
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Server,
  Users,
  Eye,
} from "lucide-react";
import type {
  HIPAAChecklistItem,
  VendorReview,
  PrivacyPolicy,
} from "@/lib/data/legal-data";

interface Props {
  hipaaChecklist: HIPAAChecklistItem[];
  vendorReviews: VendorReview[];
  privacyPolicies: PrivacyPolicy[];
}

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  compliant: { icon: CheckCircle2, color: "#1EAA55", label: "Compliant" },
  in_progress: { icon: Clock, color: "#F1C028", label: "In Progress" },
  non_compliant: { icon: XCircle, color: "#E24D47", label: "Non-Compliant" },
  not_started: { icon: Clock, color: "var(--muted-light)", label: "Not Started" },
};

const BAA_CONFIG: Record<string, { label: string; color: string }> = {
  executed: { label: "BAA Executed", color: "#1EAA55" },
  pending: { label: "BAA Pending", color: "#F1C028" },
  not_required: { label: "BAA Not Required", color: "#78C3BF" },
  needed: { label: "BAA Needed", color: "#E24D47" },
};

const RISK_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low Risk", color: "#1EAA55" },
  medium: { label: "Medium Risk", color: "#F1C028" },
  high: { label: "High Risk", color: "#E24D47" },
  critical: { label: "Critical Risk", color: "#E24D47" },
};

type PrivacySection = "hipaa" | "vendors" | "policies" | "consent";

export default function PrivacySecurity({ hipaaChecklist, vendorReviews, privacyPolicies }: Props) {
  const [activeSection, setActiveSection] = useState<PrivacySection>("hipaa");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Administrative Safeguards"]));

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  // HIPAA stats
  const hipaaCompliant = hipaaChecklist.filter((h) => h.status === "compliant").length;
  const hipaaTotal = hipaaChecklist.length;
  const hipaaScore = Math.round((hipaaCompliant / hipaaTotal) * 100);

  // Vendor stats
  const vendorsCompliant = vendorReviews.filter((v) => v.status === "compliant").length;
  const vendorsNeedBAA = vendorReviews.filter((v) => v.baaStatus === "needed" || v.baaStatus === "pending").length;

  // Group HIPAA items by category
  const hipaaCategories = [...new Set(hipaaChecklist.map((h) => h.category))];

  const sections: { id: PrivacySection; label: string; alert?: boolean }[] = [
    { id: "hipaa", label: "HIPAA Compliance" },
    { id: "vendors", label: "Vendor Security", alert: vendorsNeedBAA > 0 },
    { id: "policies", label: "Privacy Policies" },
    { id: "consent", label: "User Consent" },
  ];

  return (
    <div>
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: hipaaScore >= 80 ? "#1EAA5530" : "#F1C02830", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            HIPAA Score
          </p>
          <p className="text-2xl font-bold" style={{ color: hipaaScore >= 80 ? "#1EAA55" : "#F1C028" }}>
            {hipaaScore}%
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
            {hipaaCompliant} / {hipaaTotal} requirements
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Vendors Reviewed
          </p>
          <p className="text-2xl font-bold" style={{ color: "#5A6FFF" }}>
            {vendorReviews.length}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
            {vendorsCompliant} fully compliant
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: vendorsNeedBAA > 0 ? "#E24D4730" : "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            BAAs Needed
          </p>
          <p className="text-2xl font-bold" style={{ color: vendorsNeedBAA > 0 ? "#E24D47" : "#1EAA55" }}>
            {vendorsNeedBAA}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>Vendor agreements pending</p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
            Policy Version
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {privacyPolicies.find((p) => p.status === "active")?.version || "—"}
          </p>
          <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>Current active policy</p>
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
              {section.alert && (
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#E24D47" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* HIPAA CHECKLIST */}
      {activeSection === "hipaa" && (
        <div className="space-y-4">
          {hipaaCategories.map((category) => {
            const items = hipaaChecklist.filter((h) => h.category === category);
            const catCompliant = items.filter((i) => i.status === "compliant").length;
            const expanded = expandedCategories.has(category);

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ backgroundColor: "#E24D4708" }}
                >
                  {expanded ? <ChevronDown size={14} style={{ color: "#E24D47" }} /> : <ChevronRight size={14} style={{ color: "#E24D47" }} />}
                  <Shield size={14} style={{ color: "#E24D47" }} />
                  <span className="text-xs font-semibold flex-1 text-left" style={{ color: "var(--foreground)" }}>
                    {category}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: catCompliant === items.length ? "#1EAA55" : "#F1C028" }}>
                    {catCompliant} / {items.length} compliant
                  </span>
                </button>

                {expanded && (
                  <div className="mt-2 space-y-2 pl-2">
                    {items.map((item) => {
                      const statusConf = STATUS_CONFIG[item.status];
                      const StatusIcon = statusConf.icon;
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border p-4"
                          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                        >
                          <div className="flex items-start gap-3">
                            <StatusIcon size={16} style={{ color: statusConf.color }} className="shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                                  {item.requirement}
                                </p>
                                <span
                                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                                >
                                  {statusConf.label}
                                </span>
                              </div>
                              {item.evidence && (
                                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{item.evidence}</p>
                              )}
                              {item.notes && (
                                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{item.notes}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                {item.lastAudit && (
                                  <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                                    Last audit: {new Date(item.lastAudit).toLocaleDateString()}
                                  </p>
                                )}
                                {item.nextAudit && (
                                  <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                                    Next audit: {new Date(item.nextAudit).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VENDOR SECURITY */}
      {activeSection === "vendors" && (
        <div className="space-y-3">
          {vendorReviews.map((vendor) => {
            const statusConf = STATUS_CONFIG[vendor.status];
            const StatusIcon = statusConf.icon;
            const riskConf = RISK_CONFIG[vendor.riskLevel];
            const baaConf = BAA_CONFIG[vendor.baaStatus];

            return (
              <div
                key={vendor.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: vendor.baaStatus === "needed" ? "#E24D4730" : "var(--border)",
                  backgroundColor: vendor.baaStatus === "needed" ? "#E24D4704" : "var(--surface)",
                }}
              >
                <div className="flex items-start gap-3">
                  <Server size={16} style={{ color: statusConf.color }} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {vendor.vendor}
                      </p>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${riskConf.color}14`, color: riskConf.color }}
                      >
                        {riskConf.label}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${baaConf.color}14`, color: baaConf.color }}
                      >
                        {baaConf.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {vendor.service}
                    </p>

                    {vendor.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {vendor.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <AlertTriangle size={10} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
                            <p className="text-[11px]" style={{ color: "var(--foreground)" }}>{issue}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                        Last review: {new Date(vendor.lastReview).toLocaleDateString()}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--muted-light)" }}>
                        Next review: {new Date(vendor.nextReview).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRIVACY POLICIES */}
      {activeSection === "policies" && (
        <div className="space-y-3">
          {privacyPolicies.map((policy) => {
            const isActive = policy.status === "active";
            const isDraft = policy.status === "draft";

            return (
              <div
                key={policy.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: isActive ? "#1EAA5530" : isDraft ? "#F1C02830" : "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-start gap-3">
                  <FileText
                    size={16}
                    style={{ color: isActive ? "#1EAA55" : isDraft ? "#F1C028" : "var(--muted-light)" }}
                    className="shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Version {policy.version}
                      </p>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: isActive ? "#1EAA5514" : isDraft ? "#F1C02814" : "var(--background)",
                          color: isActive ? "#1EAA55" : isDraft ? "#F1C028" : "var(--muted)",
                        }}
                      >
                        {policy.status}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                      {policy.reviewedBy && ` · Reviewed by: ${policy.reviewedBy}`}
                    </p>

                    <div className="mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
                        Changes
                      </p>
                      <div className="space-y-1">
                        {policy.changes.map((change, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: isActive ? "#1EAA55" : "#F1C028" }} />
                            <p className="text-xs" style={{ color: "var(--foreground)" }}>{change}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* USER CONSENT MANAGEMENT */}
      {activeSection === "consent" && (
        <div>
          <div className="space-y-3">
            {[
              {
                title: "Health Data Collection Consent",
                description: "Users must explicitly opt-in to health data collection including cycle data, wearable data, and lifestyle inputs.",
                status: "compliant" as const,
                mechanism: "In-app consent flow with granular toggles per data type. Consent stored with timestamp and version.",
              },
              {
                title: "AI Processing Consent",
                description: "Users must consent to AI processing of their health data for personalized recommendations.",
                status: "compliant" as const,
                mechanism: "Separate consent screen during onboarding explaining AI data usage. Users can revoke at any time.",
              },
              {
                title: "Wearable Data Sharing Consent",
                description: "Explicit consent required before pulling data from connected wearables (Oura, Apple Watch).",
                status: "compliant" as const,
                mechanism: "OAuth-based connection flow with clear data access scope description.",
              },
              {
                title: "Marketing Communications Consent",
                description: "CAN-SPAM and GDPR compliant opt-in for marketing emails and notifications.",
                status: "compliant" as const,
                mechanism: "Double opt-in for email marketing. One-click unsubscribe in every email.",
              },
              {
                title: "Data Deletion Rights (Right to Erasure)",
                description: "Users can request complete deletion of their data per GDPR Article 17 and CCPA.",
                status: "in_progress" as const,
                mechanism: "In-app deletion request flow implemented. Automated deletion pipeline needs completion for all data stores.",
              },
              {
                title: "Data Portability",
                description: "Users can export their health data in a standard format per GDPR Article 20.",
                status: "in_progress" as const,
                mechanism: "Export functionality in development. Target format: FHIR-compliant JSON for health data interoperability.",
              },
            ].map((item, i) => {
              const statusConf = STATUS_CONFIG[item.status];
              const StatusIcon = statusConf.icon;

              return (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                >
                  <div className="flex items-start gap-3">
                    <StatusIcon size={16} style={{ color: statusConf.color }} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                          {item.title}
                        </p>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
                        >
                          {statusConf.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {item.description}
                      </p>
                      <div
                        className="rounded-lg p-2.5 mt-2 text-xs"
                        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      >
                        <span className="font-medium">Mechanism: </span>{item.mechanism}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
