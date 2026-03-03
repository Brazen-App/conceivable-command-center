"use client";

import { useState } from "react";
import { Handshake, ExternalLink, Star, ArrowRight, Sparkles, MessageSquare, RefreshCw } from "lucide-react";

const ACCENT = "#356FB6";

type PartnerStatus = "active-discussions" | "initial-contact" | "prospect" | "partnership-signed";

interface StrategicPartner {
  id: string;
  company: string;
  opportunity: string;
  status: PartnerStatus;
  contact: string;
  strategicValue: string;
  pitchAngle: string;
  integrationDetails: string;
  lastUpdate: string;
}

const STRATEGIC_PARTNERS: StrategicPartner[] = [
  {
    id: "sp01",
    company: "Oura",
    opportunity: "Smart Ring Integration -- Halo Ring data bridge + co-marketing",
    status: "initial-contact",
    contact: "Partnerships team via warm intro",
    strategicValue: "Access to Oura's 2M+ user base. Temperature data integration for existing Oura users. Validates wearable strategy.",
    pitchAngle: "Oura tracks temperature but doesn't interpret it for fertility. Conceivable adds the intelligence layer that makes their ring a fertility device. Win-win: we get data, they get a new use case.",
    integrationDetails: "API integration for BBT data import. Potential Oura marketplace listing. Co-branded fertility tracking feature.",
    lastUpdate: "2026-02-25",
  },
  {
    id: "sp02",
    company: "Apple Health (HealthKit)",
    opportunity: "HealthKit deep integration + Apple Women's Health feature partnership",
    status: "prospect",
    contact: "Apple Health team (exploring connections)",
    strategicValue: "Distribution to 1B+ iPhone users. HealthKit integration legitimizes platform. Potential feature in Apple Health app.",
    pitchAngle: "Apple has cycle tracking but lacks the AI interpretation and intervention layer. Conceivable transforms Apple's passive data collection into actionable fertility intelligence.",
    integrationDetails: "Full HealthKit read/write integration. Export Conceivable insights to Apple Health. Potential for Apple Women's Health feature collaboration.",
    lastUpdate: "2026-02-15",
  },
  {
    id: "sp03",
    company: "Major Health System (Top 5 US)",
    opportunity: "Clinical validation study + patient referral pipeline",
    status: "initial-contact",
    contact: "Reproductive endocrinology department head",
    strategicValue: "Clinical credibility. Patient access for larger studies. Revenue through B2B licensing. Institutional validation for fundraising.",
    pitchAngle: "Health systems spend $15K+ per IVF cycle. If Conceivable can improve natural conception rates by 150-260% as pilot shows, the cost savings are massive. Partner with us to validate.",
    integrationDetails: "EHR integration for data sharing. Provider dashboard for patient monitoring. Co-branded patient program.",
    lastUpdate: "2026-02-20",
  },
  {
    id: "sp04",
    company: "Labcorp / Quest Diagnostics",
    opportunity: "Lab data auto-import + fertility panel co-design",
    status: "prospect",
    contact: "Digital health partnerships team",
    strategicValue: "Automated lab data import eliminates manual entry. Custom fertility panel drives lab orders. Revenue share opportunity.",
    pitchAngle: "We have 220 members who need regular lab work. Custom Conceivable Fertility Panel = new revenue stream for labs. We drive the orders, they get the volume.",
    integrationDetails: "API integration for lab results import. Custom fertility panel design. Patient ordering workflow.",
    lastUpdate: "2026-02-10",
  },
  {
    id: "sp05",
    company: "Headspace / Calm",
    opportunity: "Stress management integration for fertility wellness",
    status: "prospect",
    contact: "B2B partnerships team",
    strategicValue: "Address stress-fertility connection directly. Content partnership. Cross-sell opportunity.",
    pitchAngle: "Our data shows stress scores predict cycle regularity. Integrating guided meditation and stress management creates a closed-loop intervention for one of the top fertility factors.",
    integrationDetails: "Embedded meditation content. HRV-triggered stress interventions. Co-branded fertility wellness program.",
    lastUpdate: "2026-01-30",
  },
];

function StatusBadge({ status }: { status: PartnerStatus }) {
  const config: Record<PartnerStatus, { bg: string; color: string; label: string }> = {
    "partnership-signed": { bg: "#1EAA5518", color: "#1EAA55", label: "Partnership Signed" },
    "active-discussions": { bg: "#356FB618", color: "#356FB6", label: "Active Discussions" },
    "initial-contact": { bg: "#F1C02818", color: "#F1C028", label: "Initial Contact" },
    prospect: { bg: "#9686B918", color: "#9686B9", label: "Prospect" },
  };
  const c = config[status];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

export default function StrategicPage() {
  const [expandedId, setExpandedId] = useState<string | null>("sp01");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
          Strategic Partnerships
        </p>
        <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
          {STRATEGIC_PARTNERS.length} Targets
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Platform integrations, clinical partnerships, and distribution channels
        </p>
      </div>

      {/* Partner Cards */}
      <div className="space-y-4">
        {STRATEGIC_PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="px-5 py-4 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Handshake size={16} style={{ color: ACCENT }} />
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                      {partner.company}
                    </h3>
                    <StatusBadge status={partner.status} />
                  </div>
                  <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{partner.opportunity}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                  Updated: {partner.lastUpdate}
                </span>
              </div>
            </div>

            {expandedId === partner.id && (
              <div className="px-5 pb-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                      Strategic Value
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {partner.strategicValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                      Contact
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {partner.contact}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>
                    Pitch Angle
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {partner.pitchAngle}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>
                    Integration Details
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {partner.integrationDetails}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: "#5A6FFF" }}
                  >
                    <Sparkles size={11} />
                    Joy: Draft Partnership Proposal
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "#78C3BF14", color: "#78C3BF" }}
                  >
                    <MessageSquare size={11} />
                    Joy: Draft Outreach
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <RefreshCw size={11} />
                    Map Warm Intros
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
