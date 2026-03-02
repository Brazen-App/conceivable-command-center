"use client";

import { useState } from "react";
import { FileText, MessageSquare, Clock, Plus, ChevronRight, Sparkles, Copy } from "lucide-react";

const ACCENT = "#E24D47";

interface DraftItem {
  id: string;
  title: string;
  type: "patent" | "claim" | "contract" | "policy";
  lastModified: string;
  status: "draft" | "review" | "final";
  excerpt: string;
}

const RECENT_DRAFTS: DraftItem[] = [
  {
    id: "d01",
    title: "Closed-Loop Physiologic Correction -- Provisional Claims",
    type: "patent",
    lastModified: "2026-03-01",
    status: "draft",
    excerpt: "A method for closed-loop physiologic correction in fertility optimization comprising: continuously monitoring a plurality of biomarkers...",
  },
  {
    id: "d02",
    title: "Data Aggregation Architecture -- Continuation Claims",
    type: "patent",
    lastModified: "2026-02-25",
    status: "review",
    excerpt: "A system for aggregating fertility-related biomarker data from multiple heterogeneous sources comprising: a data ingestion module...",
  },
  {
    id: "d03",
    title: "Approved Marketing Claims -- Q1 2026 Update",
    type: "claim",
    lastModified: "2026-02-20",
    status: "final",
    excerpt: "Updated list of pre-approved marketing claims for use across email, social media, and website content channels...",
  },
  {
    id: "d04",
    title: "HIPAA Business Associate Agreement -- Cloud Provider",
    type: "contract",
    lastModified: "2026-02-18",
    status: "review",
    excerpt: "Business Associate Agreement between Conceivable, Inc. and [Cloud Provider] for the processing of Protected Health Information...",
  },
  {
    id: "d05",
    title: "Privacy Policy Update -- Halo Ring Data Collection",
    type: "policy",
    lastModified: "2026-02-15",
    status: "draft",
    excerpt: "Amendment to privacy policy covering data collection practices for the Halo Ring wearable device, including temperature, HRV...",
  },
];

interface Template {
  id: string;
  name: string;
  description: string;
  type: "patent" | "claim" | "contract" | "policy";
}

const TEMPLATES: Template[] = [
  { id: "tp01", name: "Provisional Patent Application", description: "Full provisional patent filing template with claims, description, and figures", type: "patent" },
  { id: "tp02", name: "Utility Patent Claims Set", description: "Independent and dependent claims framework for utility patent", type: "patent" },
  { id: "tp03", name: "Marketing Claim Approval Form", description: "Standard form for submitting new marketing claims for legal review", type: "claim" },
  { id: "tp04", name: "Business Associate Agreement", description: "HIPAA-compliant BAA template for data processing partners", type: "contract" },
  { id: "tp05", name: "Testimonial Consent Form", description: "FTC-compliant consent form for collecting and using testimonials", type: "claim" },
  { id: "tp06", name: "Privacy Policy Amendment", description: "Template for amending privacy policy for new data collection practices", type: "policy" },
];

function TypeBadge({ type }: { type: "patent" | "claim" | "contract" | "policy" }) {
  const config = {
    patent: { color: "#E24D47", label: "Patent" },
    claim: { color: "#356FB6", label: "Claim" },
    contract: { color: "#1EAA55", label: "Contract" },
    policy: { color: "#9686B9", label: "Policy" },
  };
  const c = config[type];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}18`, color: c.color }}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: "draft" | "review" | "final" }) {
  const config = {
    draft: { bg: "#F1C02818", color: "#F1C028", label: "Draft" },
    review: { bg: "#356FB618", color: "#356FB6", label: "In Review" },
    final: { bg: "#1EAA5518", color: "#1EAA55", label: "Final" },
  };
  const c = config[status];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

export default function DraftingPage() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "I'm the Patent Drafting Assistant. I can help you draft patent claims, review existing language, or generate compliance-checked content. What would you like to work on today?",
    },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      {
        role: "assistant",
        content: "This is a placeholder response. In production, this would connect to the AI patent drafting system to generate claim language, review compliance, or assist with legal document preparation. The system would reference existing patent filings, compliance databases, and approved claims to ensure consistency.",
      },
    ]);
    setChatInput("");
  };

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: ACCENT }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Patent Drafting Assistant
            </h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            AI-Powered
          </span>
        </div>

        {/* Messages */}
        <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-xl px-4 py-3"
                style={{
                  backgroundColor: msg.role === "user" ? `${ACCENT}14` : "var(--background)",
                  border: `1px solid ${msg.role === "user" ? `${ACCENT}30` : "var(--border)"}`,
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Draft patent claims, review compliance language..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: ACCENT, color: "#fff" }}
            >
              Send
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setChatInput("Draft provisional claims for Closed-Loop Physiologic Correction")}
              className="text-xs px-3 py-1 rounded-full transition-opacity hover:opacity-80"
              style={{ backgroundColor: `${ACCENT}10`, color: ACCENT, border: `1px solid ${ACCENT}20` }}
            >
              Draft Patent Claims
            </button>
            <button
              onClick={() => setChatInput("Review this marketing claim for compliance")}
              className="text-xs px-3 py-1 rounded-full transition-opacity hover:opacity-80"
              style={{ backgroundColor: `${ACCENT}10`, color: ACCENT, border: `1px solid ${ACCENT}20` }}
            >
              Review Claim
            </button>
            <button
              onClick={() => setChatInput("Generate HIPAA-compliant data processing agreement")}
              className="text-xs px-3 py-1 rounded-full transition-opacity hover:opacity-80"
              style={{ backgroundColor: `${ACCENT}10`, color: ACCENT, border: `1px solid ${ACCENT}20` }}
            >
              Generate Agreement
            </button>
          </div>
        </div>
      </div>

      {/* Recent Drafts */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Drafts</h2>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {RECENT_DRAFTS.map((draft) => (
            <div key={draft.id} className="px-5 py-4 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {draft.title}
                    </p>
                  </div>
                  <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{draft.excerpt}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TypeBadge type={draft.type} />
                    <span className="text-xs" style={{ color: "var(--muted)" }}>Modified: {draft.lastModified}</span>
                  </div>
                </div>
                <StatusBadge status={draft.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Templates</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5 pt-0">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="rounded-lg p-4 hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <TypeBadge type={template.type} />
                <Copy size={12} style={{ color: "var(--muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {template.name}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
