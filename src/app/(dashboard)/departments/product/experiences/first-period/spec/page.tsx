"use client";

import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";

const PINK = "#F4A7B9";

export default function FirstPeriodSpecPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${PINK}08, ${PINK}04)`,
          border: `1px solid ${PINK}20`,
        }}
      >
        <Link
          href="/departments/product/experiences/first-period"
          className="flex items-center gap-1.5 text-xs font-medium mb-3"
          style={{ color: PINK }}
        >
          <ArrowLeft size={12} />
          Back to First Period Experience
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-xl font-bold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              First Period Experience — Full Specification
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Complete technical specification for the First Period health experience
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${PINK}14`, color: PINK }}
            >
              In Design
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${PINK}10` }}
        >
          <FileText size={28} style={{ color: PINK }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Full Specification Pending
        </h2>
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
          Competitive analysis, feature details, scoring algorithm, and engineering specs to be uploaded.
          The First Period experience specification will follow the same comprehensive format as the
          Pregnancy Wellness Scoring Spec and the Postpartum Recovery Spec.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: `${PINK}` }}>
          <AlertTriangle size={12} />
          <span className="font-medium">Design phase — specification document in progress</span>
        </div>

        {/* Planned Sections */}
        <div className="mt-8 text-left max-w-lg mx-auto">
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: "var(--foreground)" }}
          >
            Planned Specification Sections
          </h3>
          <div className="space-y-2">
            {[
              "1. Executive Summary & Cultural Framework (Steinem Test)",
              "2. First Period Prediction Algorithm",
              "3. Body Decoder Signal Mapping",
              "4. Period Prep Tracker Design",
              "5. Age-Adaptive Agent Framework",
              "6. Period Education Hub Content Architecture",
              "7. Seren's Safe Space & Escalation Protocols",
              "8. Body Positivity Integration Strategy",
              "9. Child Safety & COPPA Compliance",
              "10. Graphic Novel Content Pipeline",
              "11. Parent/Guardian Bridge Architecture",
              "12. Patent Coverage Reference",
              "13. Implementation Phases & Dependencies",
            ].map((section) => (
              <div
                key={section}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--muted)" }}
                />
                <span className="text-xs" style={{ color: "var(--foreground)" }}>
                  {section}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
