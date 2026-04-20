"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Loader2,
  Plus,
  Save,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface IrbProtocol {
  id: string;
  protocolTitle: string;
  institution: string | null;
  submissionDate: string | null;
  status: string;
  approvalDate: string | null;
  expiryDate: string | null;
  notes: string | null;
}

const STATUS_OPTIONS = ["not_submitted", "submitted", "under_review", "approved", "expired"];

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  not_submitted: { icon: XCircle, color: "#E24D47", label: "Not Submitted" },
  submitted: { icon: Clock, color: "#F1C028", label: "Submitted" },
  under_review: { icon: Clock, color: "#5A6FFF", label: "Under Review" },
  approved: { icon: CheckCircle2, color: "#1EAA55", label: "Approved" },
  expired: { icon: AlertTriangle, color: "#E24D47", label: "Expired" },
};

export default function IrbPage() {
  const [protocols, setProtocols] = useState<IrbProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    protocolTitle: "",
    institution: "",
    submissionDate: "",
    status: "not_submitted",
    notes: "",
  });

  const fetchProtocols = useCallback(async () => {
    try {
      const res = await fetch("/api/research?type=irb");
      if (res.ok) setProtocols(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  const createProtocol = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "irb",
          protocolTitle: form.protocolTitle,
          institution: form.institution || null,
          submissionDate: form.submissionDate || null,
          status: form.status,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ protocolTitle: "", institution: "", submissionDate: "", status: "not_submitted", notes: "" });
        await fetchProtocols();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/research", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "irb", id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProtocols((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          IRB Protocol Tracker
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus size={14} /> Add Protocol
        </button>
      </div>

      {/* IRB Status Summary */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #E24D4708 0%, #F1C02808 50%, #1EAA5508 100%)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: "#F1C028" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              IRB Requirements
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              Papers 2 and 4 require IRB approval before data analysis can begin. The clinical pilot data (105 women, 2022-2024)
              needs consent status confirmed. The app and Halo Ring need research consent frameworks built into onboarding
              before their April 30 launch.
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5 space-y-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Protocol Title *</label>
              <input type="text" value={form.protocolTitle} onChange={(e) => setForm({ ...form, protocolTitle: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Institution</label>
              <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Target Submission Date</label>
              <input type="text" value={form.submissionDate} onChange={(e) => setForm({ ...form, submissionDate: e.target.value })} placeholder="YYYY-MM-DD"
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--muted)" }}>Cancel</button>
            <button onClick={createProtocol} disabled={!form.protocolTitle || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
      )}

      {protocols.length === 0 ? (
        <div className="text-center py-12">
          <ShieldCheck size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No IRB protocols yet. Add protocols that need to be tracked.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {protocols.map((protocol) => {
            const config = STATUS_CONFIG[protocol.status] || STATUS_CONFIG.not_submitted;
            const StatusIcon = config.icon;
            return (
              <div
                key={protocol.id}
                className="rounded-2xl p-5"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.color}14` }}
                  >
                    <StatusIcon size={18} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                          {protocol.protocolTitle}
                        </p>
                        {protocol.institution && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            {protocol.institution}
                          </p>
                        )}
                      </div>
                      <select
                        value={protocol.status}
                        onChange={(e) => updateStatus(protocol.id, e.target.value)}
                        className="text-[10px] px-2 py-1 rounded-lg outline-none shrink-0"
                        style={{ backgroundColor: `${config.color}14`, color: config.color, border: `1px solid ${config.color}30` }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3">
                      {protocol.submissionDate && (
                        <div>
                          <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Submitted</span>
                          <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{protocol.submissionDate}</p>
                        </div>
                      )}
                      {protocol.approvalDate && (
                        <div>
                          <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Approved</span>
                          <p className="text-xs font-medium" style={{ color: "#1EAA55" }}>{protocol.approvalDate}</p>
                        </div>
                      )}
                      {protocol.expiryDate && (
                        <div>
                          <span className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Expires</span>
                          <p className="text-xs font-medium" style={{ color: "#E24D47" }}>{protocol.expiryDate}</p>
                        </div>
                      )}
                    </div>

                    {protocol.notes && (
                      <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                        {protocol.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
