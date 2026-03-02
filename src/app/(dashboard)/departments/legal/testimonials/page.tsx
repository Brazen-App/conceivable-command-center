"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle2, AlertTriangle, XCircle, Clock, Shield } from "lucide-react";

const ACCENT = "#E24D47";

type ComplianceStatus = "compliant" | "needs-disclaimer" | "non-compliant" | "under-review";

interface Testimonial {
  id: string;
  text: string;
  source: string;
  sourceType: "email" | "social" | "website" | "video" | "review";
  complianceStatus: ComplianceStatus;
  requiredDisclaimer: string | null;
  issues: string[];
  lastReviewed: string | null;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    text: "After 2 years of trying, Conceivable helped me understand my body in ways I never thought possible. Within 4 months of following my personalized plan, I was pregnant.",
    source: "Sarah M.",
    sourceType: "email",
    complianceStatus: "needs-disclaimer",
    requiredDisclaimer: "Individual results may vary. Conceivable provides health tracking and educational content, not medical diagnosis or treatment.",
    issues: ["Implied causation between product use and pregnancy", "From email sequence -- needs source verification"],
    lastReviewed: null,
  },
  {
    id: "t02",
    text: "The data insights from Conceivable showed me my luteal phase was too short. My doctor and I used this information to make targeted changes.",
    source: "Lisa R.",
    sourceType: "email",
    complianceStatus: "needs-disclaimer",
    requiredDisclaimer: "Conceivable provides health tracking data to share with your healthcare provider. Not medical advice.",
    issues: ["Implies diagnostic capability", "From email sequence -- needs source verification"],
    lastReviewed: null,
  },
  {
    id: "t03",
    text: "Conceivable cured my fertility problems. I got pregnant in just 2 months!",
    source: "Maya K.",
    sourceType: "email",
    complianceStatus: "non-compliant",
    requiredDisclaimer: null,
    issues: ["Uses prohibited term 'cured'", "Implies guaranteed timeline", "Makes medical treatment claim", "From email sequence -- needs source verification"],
    lastReviewed: null,
  },
  {
    id: "t04",
    text: "I love how Conceivable tracks all my biomarkers in one place. It helps me have better conversations with my fertility specialist.",
    source: "Jennifer T.",
    sourceType: "website",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-15",
  },
  {
    id: "t05",
    text: "The BBT tracking feature is incredibly accurate. Conceivable predicted my ovulation window perfectly 3 months in a row.",
    source: "Amanda B.",
    sourceType: "social",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-20",
  },
  {
    id: "t06",
    text: "As someone with PCOS, finding Conceivable was life-changing. The personalized supplement recommendations have made a noticeable difference in my cycle regularity.",
    source: "Rachel S.",
    sourceType: "review",
    complianceStatus: "needs-disclaimer",
    requiredDisclaimer: "Individual results may vary. Supplement recommendations are educational in nature. Consult your healthcare provider before starting any supplement regimen.",
    issues: ["Claims supplement recommendations improved medical condition (PCOS)", "Needs medical disclaimer"],
    lastReviewed: "2026-02-10",
  },
  {
    id: "t07",
    text: "I recommended Conceivable to all my patients who are trying to conceive. The data quality is excellent for clinical decision-making.",
    source: "Dr. Emily W., RE",
    sourceType: "website",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-25",
  },
  {
    id: "t08",
    text: "Conceivable's AI is like having a fertility doctor available 24/7. It diagnosed issues my actual doctor missed.",
    source: "Brittany L.",
    sourceType: "social",
    complianceStatus: "non-compliant",
    requiredDisclaimer: null,
    issues: ["Claims AI provides medical diagnosis", "Compares to physician care", "Implies superiority over medical professionals"],
    lastReviewed: "2026-02-18",
  },
  {
    id: "t09",
    text: "My partner and I both use Conceivable and the shared dashboard helps us stay on the same page about our fertility journey.",
    source: "Chris & Dana M.",
    sourceType: "website",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-22",
  },
  {
    id: "t10",
    text: "After my doctor recommended Conceivable, I started tracking all my biomarkers. 6 months later, I have so much more insight into my health.",
    source: "Natalie P.",
    sourceType: "video",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-28",
  },
  {
    id: "t11",
    text: "The nutrition guidance from Conceivable dramatically improved my hormone levels. My progesterone went from 6 to 14 in 3 months.",
    source: "Kim H.",
    sourceType: "email",
    complianceStatus: "needs-disclaimer",
    requiredDisclaimer: "Individual results may vary. Nutritional guidance is educational. Hormone testing should be conducted under medical supervision.",
    issues: ["Specific medical metric claims need qualification", "Implies product directly changed hormone levels"],
    lastReviewed: "2026-01-30",
  },
  {
    id: "t12",
    text: "Best investment I've made in my health. The community support is amazing and I learn something new every week.",
    source: "Olivia J.",
    sourceType: "review",
    complianceStatus: "compliant",
    requiredDisclaimer: null,
    issues: [],
    lastReviewed: "2026-02-12",
  },
];

const FTC_GUIDELINES_SUMMARY = [
  "Testimonials must reflect typical experiences, or include a clear disclaimer about atypical results",
  "Health claims in testimonials must be substantiated by competent and reliable evidence",
  "Celebrity or expert endorsements require disclosure of any material connection",
  "Results claims must not be misleading -- if 'average' is stated, it must be the actual average",
  "Cannot use testimonials to make claims that the advertiser itself could not make directly",
  "Social media testimonials require disclosure even in user-generated content that is incentivized",
];

function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const config = {
    compliant: { bg: "#1EAA5518", color: "#1EAA55", icon: CheckCircle2, label: "Compliant" },
    "needs-disclaimer": { bg: "#F1C02818", color: "#F1C028", icon: AlertTriangle, label: "Needs Disclaimer" },
    "non-compliant": { bg: "#E24D4718", color: "#E24D47", icon: XCircle, label: "Non-Compliant" },
    "under-review": { bg: "#356FB618", color: "#356FB6", icon: Clock, label: "Under Review" },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      <Icon size={10} />
      {c.label}
    </span>
  );
}

function SourceBadge({ type }: { type: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
      {type}
    </span>
  );
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<ComplianceStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.complianceStatus === filter);

  const counts = {
    compliant: TESTIMONIALS.filter((t) => t.complianceStatus === "compliant").length,
    needsDisclaimer: TESTIMONIALS.filter((t) => t.complianceStatus === "needs-disclaimer").length,
    nonCompliant: TESTIMONIALS.filter((t) => t.complianceStatus === "non-compliant").length,
  };

  return (
    <div className="space-y-6">
      {/* FTC Guidelines Card */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>FTC Testimonial Guidelines</h2>
        </div>
        <ul className="space-y-2">
          {FTC_GUIDELINES_SUMMARY.map((guideline, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={12} style={{ color: ACCENT }} className="shrink-0 mt-0.5" />
              <span className="text-xs" style={{ color: "var(--foreground)" }}>{guideline}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Verification Flag */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ backgroundColor: "#F1C02810", border: "1px solid #F1C02820" }}
      >
        <AlertTriangle size={16} style={{ color: "#F1C028" }} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F1C028" }}>
            Action Required: Email Sequence Testimonials
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--foreground)" }}>
            Sarah, Lisa, and Maya testimonials from the email sequence need verification.
            Source documentation, consent forms, and compliance review required before continued use.
          </p>
        </div>
      </div>

      {/* Summary + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>{counts.compliant}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Compliant</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#F1C028" }}>{counts.needsDisclaimer}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Needs Disclaimer</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#E24D47" }}>{counts.nonCompliant}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Non-Compliant</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(["all", "compliant", "needs-disclaimer", "non-compliant"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                filter === f
                  ? { backgroundColor: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }
                  : { backgroundColor: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {f === "all" ? "All" : f === "needs-disclaimer" ? "Needs Disclaimer" : f === "non-compliant" ? "Non-Compliant" : "Compliant"}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonial Cards */}
      <div className="space-y-3">
        {filtered.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-xl p-5 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm italic leading-relaxed" style={{ color: "var(--foreground)" }}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>-- {testimonial.source}</span>
                  <SourceBadge type={testimonial.sourceType} />
                </div>
              </div>
              <ComplianceBadge status={testimonial.complianceStatus} />
            </div>

            {expandedId === testimonial.id && (
              <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
                {testimonial.issues.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#E24D47" }}>Issues</p>
                    <ul className="space-y-1">
                      {testimonial.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle size={12} style={{ color: "#E24D47" }} className="shrink-0 mt-0.5" />
                          <span className="text-xs" style={{ color: "var(--foreground)" }}>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {testimonial.requiredDisclaimer && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>Required Disclaimer</p>
                    <p className="text-xs italic px-3 py-2 rounded-lg" style={{ backgroundColor: "#F1C02810", color: "var(--foreground)" }}>
                      {testimonial.requiredDisclaimer}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  {testimonial.lastReviewed ? (
                    <span className="text-xs" style={{ color: "var(--muted)" }}>Last reviewed: {testimonial.lastReviewed}</span>
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "#E24D47" }}>Not yet reviewed</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Items */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Action Items</h2>
        <div className="space-y-2">
          {[
            { action: "Verify source documentation for Sarah M., Lisa R., Maya K. testimonials", priority: "high" as const, dept: "Legal + Email" },
            { action: "Add required disclaimers to 4 testimonials flagged as 'needs-disclaimer'", priority: "high" as const, dept: "Legal" },
            { action: "Remove or rewrite Maya K. and Brittany L. non-compliant testimonials", priority: "critical" as const, dept: "Legal + Marketing" },
            { action: "Establish consent form process for all future testimonials", priority: "standard" as const, dept: "Legal" },
            { action: "Quarterly review of all active testimonials across all channels", priority: "standard" as const, dept: "Legal" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--background)" }}>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: item.priority === "critical" ? "#E24D4718" : item.priority === "high" ? "#F1C02818" : "#356FB618",
                  color: item.priority === "critical" ? "#E24D47" : item.priority === "high" ? "#F1C028" : "#356FB6",
                }}
              >
                {item.priority}
              </span>
              <p className="text-xs flex-1" style={{ color: "var(--foreground)" }}>{item.action}</p>
              <span className="text-xs" style={{ color: "var(--muted)" }}>{item.dept}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
