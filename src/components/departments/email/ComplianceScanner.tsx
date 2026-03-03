"use client";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  FileWarning,
  XCircle,
} from "lucide-react";
import type { LaunchEmail } from "@/lib/data/launch-emails";
import { PHASE_CONFIG } from "@/lib/data/launch-emails";

interface Props {
  emails: LaunchEmail[];
  onAction: (id: string, action: string) => void;
}

// Compliance rules — FDA/FTC scan patterns
const COMPLIANCE_RULES = [
  {
    id: "health-claim",
    label: "Unsubstantiated Health Claims",
    description: "Statements implying treatment, cure, or diagnosis without clinical evidence",
    severity: "high" as const,
    patterns: [
      /\bcure\b/i,
      /\btreat(?:s|ment)?\b/i,
      /\bdiagnos(?:e|is|tic)\b/i,
      /\bguarantee\b/i,
      /\bproven to\b/i,
      /\bclinically proven\b/i,
      /\bwill (?:improve|increase|boost|fix)\b/i,
    ],
  },
  {
    id: "testimonial",
    label: "Unverified Testimonials",
    description: "Personal success stories that could imply typical results",
    severity: "high" as const,
    patterns: [
      /\bSarah\b.*\bPCOS\b/i,
      /\bLisa\b.*\brecurrent loss\b/i,
      /\bMaya\b.*\bIVF\b/i,
      /\bgot pregnant\b/i,
      /\bconceived\b/i,
      /\bmy (?:baby|pregnancy|success)\b/i,
      /\btypical results\b/i,
    ],
  },
  {
    id: "medical-advice",
    label: "Medical Advice Without Disclaimer",
    description: "Directing users to take medical actions without 'consult your doctor'",
    severity: "medium" as const,
    patterns: [
      /\bstop taking\b/i,
      /\bstart taking\b/i,
      /\byou (?:should|must|need to) take\b/i,
      /\bwe recommend\b.*\bsupplement\b/i,
    ],
  },
  {
    id: "urgency-manipulation",
    label: "FTC Urgency Concerns",
    description: "Artificial scarcity or countdown pressure that may violate FTC guidelines",
    severity: "low" as const,
    patterns: [
      /\blast chance\b.*\bever\b/i,
      /\bnever (?:again|available)\b/i,
      /\bonce in a lifetime\b/i,
    ],
  },
  {
    id: "privacy-hipaa",
    label: "HIPAA / Privacy Concerns",
    description: "References to specific health data handling that need BAA review",
    severity: "medium" as const,
    patterns: [
      /\bshare.*(?:data|information).*(?:with|to)\b/i,
      /\baccess.*(?:medical|health) records\b/i,
    ],
  },
];

interface ScanResult {
  emailId: string;
  ruleId: string;
  ruleLabel: string;
  severity: "high" | "medium" | "low";
  matchedText: string;
  lineNumber: number;
}

function scanEmail(email: LaunchEmail): ScanResult[] {
  const results: ScanResult[] = [];
  const lines = email.body.split("\n");

  for (const rule of COMPLIANCE_RULES) {
    for (const pattern of rule.patterns) {
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(pattern);
        if (match) {
          // Avoid duplicates for same rule + email
          if (!results.find((r) => r.ruleId === rule.id && r.emailId === email.id && r.lineNumber === i + 1)) {
            results.push({
              emailId: email.id,
              ruleId: rule.id,
              ruleLabel: rule.label,
              severity: rule.severity,
              matchedText: match[0],
              lineNumber: i + 1,
            });
          }
        }
      }
    }
  }

  return results;
}

const SEVERITY_CONFIG = {
  high: { color: "#E24D47", bg: "#E24D4710", label: "HIGH", icon: ShieldAlert },
  medium: { color: "#F1C028", bg: "#F1C02810", label: "MED", icon: AlertTriangle },
  low: { color: "#5A6FFF", bg: "#5A6FFF10", label: "LOW", icon: FileWarning },
};

export default function ComplianceScanner({ emails, onAction }: Props) {
  // Run scan across all emails
  const allResults: ScanResult[] = [];
  for (const email of emails) {
    allResults.push(...scanEmail(email));
  }

  const highCount = allResults.filter((r) => r.severity === "high").length;
  const medCount = allResults.filter((r) => r.severity === "medium").length;
  const lowCount = allResults.filter((r) => r.severity === "low").length;

  // Group findings by email
  const findingsByEmail = new Map<string, ScanResult[]>();
  for (const result of allResults) {
    const existing = findingsByEmail.get(result.emailId) || [];
    existing.push(result);
    findingsByEmail.set(result.emailId, existing);
  }

  // Compliance status summary
  const reviewed = emails.filter((e) => e.complianceStatus === "approved").length;
  const flagged = emails.filter((e) => e.complianceStatus === "flagged").length;
  const inReview = emails.filter((e) => e.complianceStatus === "in_review").length;
  const notReviewed = emails.filter((e) => e.complianceStatus === "not_reviewed").length;

  // Critical: 3 flagged testimonials
  const FLAGGED_TESTIMONIALS = [
    {
      name: "Sarah",
      condition: "PCOS",
      risk: "Implies Conceivable treats PCOS — FDA regulated claim",
    },
    {
      name: "Lisa",
      condition: "Recurrent pregnancy loss",
      risk: "Implies product prevents miscarriage — highest-risk claim category",
    },
    {
      name: "Maya",
      condition: "IVF failures",
      risk: "Implies product is alternative to IVF — requires extensive disclaimers",
    },
  ];

  return (
    <div>
      {/* Compliance Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5520" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#1EAA55" }}>
            {reviewed}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#1EAA55" }}>
            Approved
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4720" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#E24D47" }}>
            {flagged}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#E24D47" }}>
            Flagged
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#F1C028" }}>
            {inReview}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#F1C028" }}>
            In Review
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {notReviewed}
          </p>
          <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "var(--muted)" }}>
            Not Reviewed
          </p>
        </div>
      </div>

      {/* Auto-Scan Results Summary */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} style={{ color: "#E37FB1" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Automated Compliance Scan Results
          </h3>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#E37FB110", color: "#C4609A" }}
          >
            FDA / FTC / HIPAA
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={14} style={{ color: "#E24D47" }} />
            <span className="text-xs font-medium" style={{ color: "#E24D47" }}>
              {highCount} high-risk
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} style={{ color: "#F1C028" }} />
            <span className="text-xs font-medium" style={{ color: "#F1C028" }}>
              {medCount} medium
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileWarning size={14} style={{ color: "#5A6FFF" }} />
            <span className="text-xs font-medium" style={{ color: "#5A6FFF" }}>
              {lowCount} low
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
            <span className="text-xs font-medium" style={{ color: "#1EAA55" }}>
              {emails.length - findingsByEmail.size} clean
            </span>
          </div>
        </div>

        {/* Scan rules legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COMPLIANCE_RULES.map((rule) => {
            const config = SEVERITY_CONFIG[rule.severity];
            const count = allResults.filter((r) => r.ruleId === rule.id).length;
            return (
              <div
                key={rule.id}
                className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{ backgroundColor: config.bg }}
              >
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  {config.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    {rule.label}
                    {count > 0 && (
                      <span className="ml-1.5 text-[10px] font-bold" style={{ color: config.color }}>
                        ({count} found)
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical: Flagged Testimonials */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4706" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <XCircle size={16} style={{ color: "#E24D47" }} />
          <h3 className="text-sm font-semibold" style={{ color: "#E24D47" }}>
            Critical: Unverified Testimonials
          </h3>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
          These testimonials CANNOT be used without verified documentation and explicit disclaimers.
          FTC requires &quot;results not typical&quot; disclosures for health-related testimonials.
        </p>
        <div className="space-y-2">
          {FLAGGED_TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "#E24D4708", border: "1px solid #E24D4715" }}
            >
              <ShieldAlert size={14} style={{ color: "#E24D47" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {t.name} — {t.condition}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "#E24D47" }}>
                  {t.risk}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Email Findings */}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--muted)" }}
        >
          Email-by-Email Scan
        </p>
        <div className="space-y-2">
          {emails.map((email) => {
            const findings = findingsByEmail.get(email.id) || [];
            const hasHigh = findings.some((f) => f.severity === "high");
            const phaseConfig = PHASE_CONFIG[email.phase];
            const isClean = findings.length === 0;

            return (
              <div
                key={email.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: hasHigh
                    ? "#E24D4730"
                    : findings.length > 0
                    ? "#F1C02830"
                    : "var(--border)",
                  backgroundColor: "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: `${phaseConfig.color}15`, color: phaseConfig.color }}
                    >
                      W{email.week}-S{email.sequence}
                    </span>
                    {isClean ? (
                      <ShieldCheck size={14} style={{ color: "#1EAA55" }} className="shrink-0" />
                    ) : hasHigh ? (
                      <ShieldAlert size={14} style={{ color: "#E24D47" }} className="shrink-0" />
                    ) : (
                      <AlertTriangle size={14} style={{ color: "#F1C028" }} className="shrink-0" />
                    )}
                    <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {email.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Compliance status badge */}
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          email.complianceStatus === "approved"
                            ? "#1EAA5514"
                            : email.complianceStatus === "flagged"
                            ? "#E24D4714"
                            : email.complianceStatus === "in_review"
                            ? "#F1C02814"
                            : "var(--border)",
                        color:
                          email.complianceStatus === "approved"
                            ? "#1EAA55"
                            : email.complianceStatus === "flagged"
                            ? "#E24D47"
                            : email.complianceStatus === "in_review"
                            ? "#F1C028"
                            : "var(--muted)",
                      }}
                    >
                      {email.complianceStatus === "not_reviewed"
                        ? "UNREVIEWED"
                        : email.complianceStatus.toUpperCase().replace("_", " ")}
                    </span>
                    {/* Action buttons */}
                    {email.complianceStatus !== "approved" && (
                      <button
                        onClick={() => onAction(email.id, "compliance_approve")}
                        className="p-1 rounded-lg transition-colors hover:bg-green-50"
                        title="Approve compliance"
                      >
                        <CheckCircle2 size={14} className="text-green-600" />
                      </button>
                    )}
                    {email.complianceStatus !== "flagged" && (
                      <button
                        onClick={() => onAction(email.id, "compliance_flag")}
                        className="p-1 rounded-lg transition-colors hover:bg-red-50"
                        title="Flag for review"
                      >
                        <ShieldAlert size={14} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Findings */}
                {findings.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {findings.map((finding, i) => {
                      const config = SEVERITY_CONFIG[finding.severity];
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px]"
                          style={{ backgroundColor: config.bg }}
                        >
                          <span
                            className="text-[8px] font-bold px-1 py-0.5 rounded shrink-0"
                            style={{ backgroundColor: `${config.color}20`, color: config.color }}
                          >
                            {config.label}
                          </span>
                          <span style={{ color: "var(--foreground)" }}>{finding.ruleLabel}</span>
                          <span style={{ color: "var(--muted)" }}>
                            — matched &quot;{finding.matchedText}&quot; (line {finding.lineNumber})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isClean && (
                  <p className="text-[11px] mt-1" style={{ color: "#1EAA55" }}>
                    No compliance issues detected
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div
        className="rounded-xl border p-5 mt-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} style={{ color: "#5A6FFF" }} />
          <h3 className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Pre-Send Compliance Checklist
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { check: "All emails pass automated compliance scan", done: highCount === 0 },
            { check: "No unverified testimonials in any email", done: !allResults.some((r) => r.ruleId === "testimonial") },
            { check: "CAN-SPAM compliant (unsubscribe link, physical address)", done: true },
            { check: "HIPAA: BAA in place with Mailchimp for health data", done: false },
            { check: "FTC: All claims have supporting citations", done: reviewed === emails.length },
            { check: "All emails reviewed by legal counsel", done: reviewed === emails.length },
            { check: "Privacy policy link in every email footer", done: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
              ) : (
                <Clock size={14} style={{ color: "#F1C028" }} />
              )}
              <span
                className="text-xs"
                style={{ color: item.done ? "var(--foreground)" : "var(--muted)" }}
              >
                {item.check}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
