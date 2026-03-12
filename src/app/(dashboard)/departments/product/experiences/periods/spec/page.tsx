"use client";

import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";

const RED = "#E24D47";

export default function PeriodSpecPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${RED}08, ${RED}04)`,
          border: `1px solid ${RED}20`,
        }}
      >
        <Link
          href="/departments/product/experiences/periods"
          className="flex items-center gap-1.5 text-xs font-medium mb-3"
          style={{ color: RED }}
        >
          <ArrowLeft size={12} />
          Back to Period Experience
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-xl font-bold mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Period Experience — Full Specification
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Complete technical specification for the Period health experience
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${RED}14`, color: RED }}
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
          style={{ backgroundColor: `${RED}10` }}
        >
          <FileText size={28} style={{ color: RED }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Full Specification Pending
        </h2>
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
          Competitive analysis, feature details, scoring algorithm, and engineering specs to be uploaded.
          The Period experience specification will follow the same comprehensive format as the
          Pregnancy Wellness Scoring Spec and the Postpartum Recovery Spec.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: `${RED}` }}>
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
              "1. Executive Summary & Market Context",
              "2. Period Health Score Architecture",
              "3. Cycle Intelligence Engine Design",
              "4. Root Cause Analysis Framework",
              "5. Cycle-Synced Intervention Protocols",
              "6. Condition Detection Algorithms (PCOS, Endo, Thyroid, PMDD)",
              "7. Predictive Cycle Mapping Engine",
              "8. Doctor's Report Generator Format",
              "9. Data Architecture & Privacy",
              "10. Care Team Configuration",
              "11. Patent Coverage Reference",
              "12. Implementation Phases & Dependencies",
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
