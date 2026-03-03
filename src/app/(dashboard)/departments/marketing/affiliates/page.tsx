"use client";

import { useState } from "react";
import {
  UserPlus,
  Users,
  Sparkles,
  Send,
  Edit3,
  DollarSign,
} from "lucide-react";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";
import JoyButton from "@/components/joy/JoyButton";

const ACCENT = "#5A6FFF";

const COMMISSION_TIERS = [
  { tier: "Silver", threshold: "$0 - $5,000", rate: "15%", color: "#ACB7FF" },
  { tier: "Gold", threshold: "$5,001 - $10,000", rate: "20%", color: "#F1C028" },
  { tier: "Diamond", threshold: "$10,001+", rate: "25%", color: "#78C3BF" },
];

export default function MarketingAffiliatesPage() {
  const [editingTiers, setEditingTiers] = useState(false);

  return (
    <div className="space-y-6">
      <CompanyGoalsBanner departmentFocus="Recruit 10 fertility practitioners as affiliates before launch" />

      {/* Empty State */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "linear-gradient(135deg, #5A6FFF06 0%, #ACB7FF06 100%)",
          border: "1px solid rgba(90, 111, 255, 0.12)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${ACCENT}14` }}
        >
          <Users size={28} style={{ color: ACCENT }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          No Affiliates Yet
        </h2>
        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: "var(--muted)" }}>
          The affiliate program hasn&apos;t launched yet. Joy can help you identify and recruit
          the best fertility practitioners, health coaches, and influencers as affiliates.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <JoyButton
            agent="marketing"
            prompt="Help me set up the affiliate program for Conceivable. I need to: 1) Define the commission structure and terms, 2) Create the affiliate onboarding process, 3) Set up tracking and attribution. Walk me through the best approach for a health/fertility product affiliate program."
            label="Add First Affiliate"
            icon={<UserPlus size={15} />}
            iconSize={15}
          />
          <JoyButton
            agent="marketing"
            prompt="Find the top 20 affiliate prospects for Conceivable. Focus on functional medicine doctors, fertility nutritionists, and reproductive acupuncturists from Kirsten's podcast network and conference contacts. For each, list their practice, audience size, and why they'd be a good fit."
            label="Joy: Find Prospects"
            iconSize={15}
          />
        </div>
      </div>

      {/* Joy's Strategy */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #F1C02808 0%, #9686B908 100%)",
          border: "1px solid rgba(241, 192, 40, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "#F1C028" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F1C028" }}>
            Joy&apos;s Affiliate Strategy
          </span>
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
          Target fertility practitioners who already recommend lifestyle changes.
        </p>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
          The highest-converting affiliates will be functional medicine doctors, fertility nutritionists,
          and reproductive acupuncturists. They already believe in the holistic approach and have patients
          who are the exact Conceivable target market. Start with 10 practitioners from Kirsten&apos;s
          existing network — the ones she&apos;s met through podcasts and conferences.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { type: "Functional Medicine MDs", why: "Already prescribe lifestyle interventions", count: "~15 from podcast network" },
            { type: "Fertility Nutritionists", why: "Conceivable extends their toolkit", count: "~8 from conference contacts" },
            { type: "Health Coaches (IIN/FMCA)", why: "Need tech tools for their clients", count: "~20 from Circle community" },
          ].map((segment) => (
            <div
              key={segment.type}
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                {segment.type}
              </p>
              <p className="text-[10px] mb-2" style={{ color: "var(--muted)" }}>
                {segment.why}
              </p>
              <p className="text-[10px] font-medium" style={{ color: ACCENT }}>
                {segment.count}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <JoyButton
            agent="marketing"
            prompt="Draft a personalized outreach email template for fertility practitioners (functional medicine MDs, fertility nutritionists, health coaches). The email should introduce Conceivable's affiliate program, highlight how it extends their toolkit for patients, and include our commission structure. Make it warm and professional — these are potential long-term partners."
            label="Joy: Draft Outreach Email for Practitioners"
            icon={<Send size={12} />}
          />
        </div>
      </div>

      {/* Commission Structure */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign size={16} style={{ color: "#1EAA55" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Commission Structure
            </p>
          </div>
          <button
            onClick={() => setEditingTiers(!editingTiers)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}
          >
            <Edit3 size={11} />
            {editingTiers ? "Done" : "Edit"}
          </button>
        </div>
        <div className="space-y-3">
          {COMMISSION_TIERS.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-lg p-3 flex items-center justify-between"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{tier.tier}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{tier.threshold}</p>
                </div>
              </div>
              {editingTiers ? (
                <input
                  defaultValue={tier.rate}
                  className="w-16 text-right text-lg font-bold rounded-lg border px-2 py-1"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                    color: tier.color,
                  }}
                />
              ) : (
                <span className="text-lg font-bold" style={{ color: tier.color }}>
                  {tier.rate}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
