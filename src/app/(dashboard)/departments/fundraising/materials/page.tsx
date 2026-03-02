"use client";

import { useState } from "react";
import {
  FileText, CheckCircle2, Clock, AlertCircle, ExternalLink, Shield, Presentation,
  Database, Film, Calculator, BookOpen
} from "lucide-react";

const ACCENT = "#356FB6";

interface PitchMaterial {
  id: string;
  name: string;
  type: "deck" | "document" | "video" | "financial" | "legal";
  version: string;
  lastUpdated: string;
  status: "ready" | "needs-update" | "in-progress" | "not-started";
  notes: string;
}

const PITCH_MATERIALS: PitchMaterial[] = [
  { id: "pm01", name: "Series A Pitch Deck", type: "deck", version: "v3.2", lastUpdated: "2026-02-28", status: "ready", notes: "Latest version includes pilot data, patent portfolio, and 5-year projections." },
  { id: "pm02", name: "Executive Summary / One-Pager", type: "document", version: "v2.1", lastUpdated: "2026-02-25", status: "ready", notes: "Concise overview for initial investor outreach." },
  { id: "pm03", name: "Financial Model", type: "financial", version: "v4.0", lastUpdated: "2026-02-20", status: "needs-update", notes: "Needs Q1 2026 actuals incorporated. Revenue projections solid." },
  { id: "pm04", name: "Product Demo Video", type: "video", version: "v1.0", lastUpdated: "2026-02-15", status: "needs-update", notes: "Current demo is 8 months old. Need to reshoot with new UI." },
  { id: "pm05", name: "IP Portfolio Summary", type: "legal", version: "v2.0", lastUpdated: "2026-02-22", status: "needs-update", notes: "Needs Closed-Loop patent added once provisional is filed." },
  { id: "pm06", name: "Clinical Evidence Summary", type: "document", version: "v1.5", lastUpdated: "2026-02-18", status: "ready", notes: "Pilot study results, correlation data, and intervention outcomes." },
  { id: "pm07", name: "Cap Table", type: "financial", version: "v3.0", lastUpdated: "2026-02-10", status: "ready", notes: "Clean cap table ready for investor review." },
  { id: "pm08", name: "Technical Architecture Overview", type: "document", version: "v1.0", lastUpdated: "2026-01-30", status: "ready", notes: "AI/ML pipeline, data architecture, security overview." },
];

interface DataRoomItem {
  category: string;
  item: string;
  status: "uploaded" | "needs-upload" | "in-progress";
}

const DATA_ROOM_CHECKLIST: DataRoomItem[] = [
  { category: "Corporate", item: "Certificate of Incorporation", status: "uploaded" },
  { category: "Corporate", item: "Bylaws", status: "uploaded" },
  { category: "Corporate", item: "Board minutes", status: "uploaded" },
  { category: "Corporate", item: "Cap table (current)", status: "uploaded" },
  { category: "Corporate", item: "Stock option plan", status: "uploaded" },
  { category: "Financial", item: "Historical financials (2024-2025)", status: "uploaded" },
  { category: "Financial", item: "Q1 2026 financials", status: "in-progress" },
  { category: "Financial", item: "Financial projections (5-year)", status: "uploaded" },
  { category: "Financial", item: "Monthly burn report", status: "uploaded" },
  { category: "IP", item: "Patent filings (4 filed)", status: "uploaded" },
  { category: "IP", item: "Closed-Loop provisional", status: "needs-upload" },
  { category: "IP", item: "Trademark registrations", status: "uploaded" },
  { category: "Clinical", item: "Pilot study results", status: "uploaded" },
  { category: "Clinical", item: "IRB documentation", status: "uploaded" },
  { category: "Clinical", item: "Publication manuscripts", status: "in-progress" },
  { category: "Legal", item: "Material contracts", status: "uploaded" },
  { category: "Legal", item: "HIPAA compliance documentation", status: "uploaded" },
  { category: "Legal", item: "Privacy policy", status: "uploaded" },
  { category: "Product", item: "Product roadmap", status: "uploaded" },
  { category: "Product", item: "Technical architecture doc", status: "uploaded" },
  { category: "Product", item: "User metrics dashboard", status: "needs-upload" },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "ready" || status === "uploaded") return <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />;
  if (status === "needs-update" || status === "in-progress") return <Clock size={14} style={{ color: "#F1C028" }} />;
  return <AlertCircle size={14} style={{ color: "#E24D47" }} />;
}

function TypeIcon({ type }: { type: string }) {
  const config: Record<string, { icon: typeof FileText; color: string }> = {
    deck: { icon: Presentation, color: ACCENT },
    document: { icon: FileText, color: "#78C3BF" },
    video: { icon: Film, color: "#9686B9" },
    financial: { icon: Calculator, color: "#1EAA55" },
    legal: { icon: Shield, color: "#E24D47" },
  };
  const c = config[type] || config.document;
  const Icon = c.icon;
  return <Icon size={14} style={{ color: c.color }} />;
}

export default function MaterialsPage() {
  const uploadedCount = DATA_ROOM_CHECKLIST.filter((i) => i.status === "uploaded").length;
  const totalCount = DATA_ROOM_CHECKLIST.length;
  const completionPct = Math.round((uploadedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Pitch Deck Status */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
              Pitch Materials
            </p>
            <p className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
              {PITCH_MATERIALS.filter((m) => m.status === "ready").length}/{PITCH_MATERIALS.length} Ready
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Data room {completionPct}% complete
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#1EAA55" }}>
                {PITCH_MATERIALS.filter((m) => m.status === "ready").length}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Ready</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: "#F1C028" }}>
                {PITCH_MATERIALS.filter((m) => m.status === "needs-update").length}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Needs Update</p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pitch Materials</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Material</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Version</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Updated</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {PITCH_MATERIALS.map((material) => (
                <tr key={material.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon type={material.type} />
                      <span className="font-medium" style={{ color: "var(--foreground)" }}>{material.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono" style={{ color: ACCENT }}>{material.version}</span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--muted)" }}>{material.lastUpdated}</td>
                  <td className="px-5 py-3"><StatusIcon status={material.status} /></td>
                  <td className="px-5 py-3 max-w-xs text-xs" style={{ color: "var(--muted)" }}>{material.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Room Checklist */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Data Room Checklist</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {uploadedCount}/{totalCount} items uploaded ({completionPct}%)
            </p>
          </div>
          <div className="w-24 h-2 rounded-full" style={{ backgroundColor: "var(--border)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${completionPct}%`, backgroundColor: completionPct >= 80 ? "#1EAA55" : "#F1C028" }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--background)" }}>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Category</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Item</th>
                <th className="text-left px-5 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA_ROOM_CHECKLIST.map((item, i) => (
                <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-2 text-xs font-medium" style={{ color: "var(--foreground)" }}>{item.category}</td>
                  <td className="px-5 py-2 text-xs" style={{ color: "var(--foreground)" }}>{item.item}</td>
                  <td className="px-5 py-2"><StatusIcon status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cross-Department Links */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Cross-Department Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} style={{ color: "#E24D47" }} />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>IP Portfolio Summary</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>5 patents -- see Legal department</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={14} style={{ color: "#78C3BF" }} />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Clinical Evidence</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Pilot data + publications -- see Clinical</p>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Compliance Verification</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Score: 98/100 -- see Legal compliance</p>
          </div>
        </div>
      </div>

      {/* Narrative Generator Placeholder */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} style={{ color: ACCENT }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Narrative Generator
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
            Coming Soon
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          AI-powered narrative generator that pulls live metrics from Clinical, Community, and Finance
          to create customized investor stories. Tailored by investor focus (science-first, consumer-first, impact-first).
        </p>
      </div>
    </div>
  );
}
