"use client";

import { useState } from "react";
import { Shield, CheckCircle2, Clock, AlertTriangle, XCircle, Search, FileText } from "lucide-react";

const ACCENT = "#E24D47";

interface FDAItem {
  category: string;
  item: string;
  status: "compliant" | "review-needed" | "non-compliant";
  notes: string;
}

const FDA_DASHBOARD: FDAItem[] = [
  { category: "Supplement Claims", item: "Structure/function claims for prenatal supplements", status: "compliant", notes: "All claims reviewed and approved with required disclaimers" },
  { category: "Supplement Claims", item: "Fertility supplement marketing language", status: "compliant", notes: "Using only approved language: 'supports reproductive health'" },
  { category: "Supplement Claims", item: "Efficacy claims from pilot data", status: "review-needed", notes: "150-260% improvement claim needs careful framing for supplement context" },
  { category: "Device Claims", item: "Halo Ring - temperature monitoring claims", status: "compliant", notes: "Classified as wellness device, not medical device. Claims limited to tracking." },
  { category: "Device Claims", item: "Halo Ring - fertility prediction claims", status: "review-needed", notes: "Prediction claims may require 510(k) clearance. Currently limited to 'tracking'." },
  { category: "App Claims", item: "AI-powered health insights", status: "compliant", notes: "Framed as educational content, not diagnostic. Appropriate disclaimers in place." },
  { category: "App Claims", item: "Personalized recommendations", status: "compliant", notes: "Recommendations clearly labeled as educational, not medical advice" },
];

const FTC_GUIDELINES = [
  { item: "Testimonial substantiation", status: "review-needed" as const, notes: "3 testimonials from email sequence need source verification" },
  { item: "Income/results disclaimers", status: "compliant" as const, notes: "Typical results disclaimer present on all marketing materials" },
  { item: "Endorsement disclosures", status: "compliant" as const, notes: "All affiliate and paid endorsements properly disclosed" },
  { item: "Advertising truthfulness", status: "compliant" as const, notes: "All claims backed by pilot data with appropriate qualifications" },
  { item: "Social media disclosures", status: "compliant" as const, notes: "#ad and #sponsored tags enforced on all paid content" },
];

interface HIPAAItem {
  category: string;
  item: string;
  status: "compliant" | "in-progress" | "needs-attention";
  lastReview: string;
}

const HIPAA_CHECKLIST: HIPAAItem[] = [
  { category: "Administrative", item: "Privacy Officer designated", status: "compliant", lastReview: "2026-01-15" },
  { category: "Administrative", item: "Workforce training completed", status: "compliant", lastReview: "2026-02-01" },
  { category: "Administrative", item: "Business Associate Agreements", status: "compliant", lastReview: "2026-01-20" },
  { category: "Technical", item: "Data encryption at rest", status: "compliant", lastReview: "2026-02-15" },
  { category: "Technical", item: "Data encryption in transit", status: "compliant", lastReview: "2026-02-15" },
  { category: "Technical", item: "Access controls and audit logs", status: "compliant", lastReview: "2026-02-20" },
  { category: "Technical", item: "Backup and disaster recovery", status: "in-progress", lastReview: "2026-01-10" },
  { category: "Physical", item: "Facility access controls", status: "compliant", lastReview: "2026-01-05" },
  { category: "Breach", item: "Breach notification procedures", status: "compliant", lastReview: "2026-02-01" },
  { category: "Breach", item: "Incident response plan", status: "in-progress", lastReview: "2026-01-15" },
];

interface ApprovedClaim {
  text: string;
  category: string;
  status: "approved" | "restricted" | "prohibited";
  citation: string;
}

const APPROVED_CLAIMS: ApprovedClaim[] = [
  { text: "Supports reproductive health through personalized insights", category: "General", status: "approved", citation: "Structure/function claim, FDA compliant" },
  { text: "Tracks 50+ fertility biomarkers", category: "Product", status: "approved", citation: "Factual claim, verifiable" },
  { text: "AI analyzes your unique fertility pattern", category: "Technology", status: "approved", citation: "Descriptive, not diagnostic" },
  { text: "Our pilot study showed 150-260% improvement", category: "Research", status: "restricted", citation: "Must include N=105 qualifier, not generalized" },
  { text: "Conceivable diagnoses fertility problems", category: "Medical", status: "prohibited", citation: "Diagnostic claims require FDA clearance" },
  { text: "Guaranteed to help you get pregnant", category: "Outcome", status: "prohibited", citation: "Guarantee claims violate FTC guidelines" },
  { text: "240,000+ data points analyzed", category: "Research", status: "approved", citation: "Factual claim from pilot data" },
  { text: "Used by doctors and fertility specialists", category: "Endorsement", status: "restricted", citation: "Requires specific physician endorsement documentation" },
];

const RESTRICTED_LANGUAGE = [
  { term: "cure", reason: "Implies medical cure, FDA violation" },
  { term: "diagnose", reason: "Diagnostic claims require FDA clearance" },
  { term: "guarantee", reason: "FTC prohibits guarantee claims for health products" },
  { term: "clinically proven", reason: "Requires Phase III clinical trial data" },
  { term: "doctor recommended", reason: "Requires specific physician documentation" },
  { term: "treats infertility", reason: "Treatment claims require FDA approval" },
  { term: "100% success rate", reason: "False claim, FTC violation" },
  { term: "FDA approved", reason: "Product is not FDA approved" },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "compliant" || status === "approved") return <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />;
  if (status === "review-needed" || status === "in-progress" || status === "restricted") return <Clock size={14} style={{ color: "#F1C028" }} />;
  return <XCircle size={14} style={{ color: "#E24D47" }} />;
}

export default function CompliancePage() {
  const [activeSection, setActiveSection] = useState<"fda" | "ftc" | "hipaa" | "claims" | "restricted">("fda");

  const sections = [
    { id: "fda" as const, label: "FDA Dashboard" },
    { id: "ftc" as const, label: "FTC Guidelines" },
    { id: "hipaa" as const, label: "HIPAA Checklist" },
    { id: "claims" as const, label: "Approved Claims" },
    { id: "restricted" as const, label: "Restricted Language" },
  ];

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={
              activeSection === section.id
                ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* FDA Dashboard */}
      {activeSection === "fda" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              FDA Compliance Dashboard
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Supplement claims, device claims (Halo Ring), and app claims status
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--background)" }}>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Item</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {FDA_DASHBOARD.map((item, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{item.category}</td>
                    <td className="px-5 py-3" style={{ color: "var(--foreground)" }}>{item.item}</td>
                    <td className="px-5 py-3"><StatusIcon status={item.status} /></td>
                    <td className="px-5 py-3 max-w-xs text-xs" style={{ color: "var(--muted)" }}>{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FTC Guidelines */}
      {activeSection === "ftc" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>FTC Advertising Guidelines</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {FTC_GUIDELINES.map((item, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <StatusIcon status={item.status} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.item}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIPAA Checklist */}
      {activeSection === "hipaa" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>HIPAA Compliance Checklist</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--background)" }}>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Item</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Last Review</th>
                </tr>
              </thead>
              <tbody>
                {HIPAA_CHECKLIST.map((item, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>{item.category}</td>
                    <td className="px-5 py-3" style={{ color: "var(--foreground)" }}>{item.item}</td>
                    <td className="px-5 py-3"><StatusIcon status={item.status} /></td>
                    <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{item.lastReview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approved Claims Database */}
      {activeSection === "claims" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Approved Claims Database</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--background)" }}>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Claim Text</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
                  <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Citation</th>
                </tr>
              </thead>
              <tbody>
                {APPROVED_CLAIMS.map((claim, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--foreground)" }}>
                      &ldquo;{claim.text}&rdquo;
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
                        {claim.category}
                      </span>
                    </td>
                    <td className="px-5 py-3"><StatusIcon status={claim.status} /></td>
                    <td className="px-5 py-3 max-w-xs text-xs" style={{ color: "var(--muted)" }}>{claim.citation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restricted Language */}
      {activeSection === "restricted" && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Restricted Language List</h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              These terms must NEVER appear in any Conceivable content without explicit Legal approval
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {RESTRICTED_LANGUAGE.map((item, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-3">
                <XCircle size={14} style={{ color: "#E24D47" }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#E24D47" }}>
                    &ldquo;{item.term}&rdquo;
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
