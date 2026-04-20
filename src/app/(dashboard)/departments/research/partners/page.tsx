"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Loader2,
  Plus,
  Save,
  Mail,
  Building2,
  UserCheck,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface Partner {
  id: string;
  name: string;
  institution: string;
  department: string | null;
  relationship: string | null;
  papers: string | null;
  contactStatus: string;
  email: string | null;
  notes: string | null;
}

const RELATIONSHIP_OPTIONS = ["potential", "contacted", "confirmed", "co-author"];
const CONTACT_OPTIONS = ["not_contacted", "outreach_sent", "responded", "confirmed"];

const CONTACT_COLORS: Record<string, { bg: string; text: string }> = {
  not_contacted: { bg: "rgba(255,255,255,0.08)", text: "var(--muted)" },
  outreach_sent: { bg: "#F1C02820", text: "#F1C028" },
  responded: { bg: "#5A6FFF20", text: "#5A6FFF" },
  confirmed: { bg: "#1EAA5520", text: "#1EAA55" },
};

const RELATIONSHIP_COLORS: Record<string, { bg: string; text: string }> = {
  potential: { bg: "rgba(255,255,255,0.08)", text: "var(--muted)" },
  contacted: { bg: "#F1C02820", text: "#F1C028" },
  confirmed: { bg: "#5A6FFF20", text: "#5A6FFF" },
  "co-author": { bg: "#1EAA5520", text: "#1EAA55" },
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    institution: "",
    department: "",
    relationship: "potential",
    papers: "",
    contactStatus: "not_contacted",
    email: "",
    notes: "",
  });

  const fetchPartners = useCallback(async () => {
    try {
      const res = await fetch("/api/research?type=partners");
      if (res.ok) setPartners(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const createPartner = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          name: form.name,
          institution: form.institution,
          department: form.department || null,
          relationship: form.relationship,
          papers: form.papers || null,
          contactStatus: form.contactStatus,
          email: form.email || null,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ name: "", institution: "", department: "", relationship: "potential", papers: "", contactStatus: "not_contacted", email: "", notes: "" });
        await fetchPartners();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const updatePartner = async (id: string, field: string, value: string) => {
    try {
      const res = await fetch("/api/research", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partner", id, [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPartners((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
          Academic Partners
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus size={14} /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5 space-y-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Institution *</label>
              <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Relationship</label>
              <select value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Papers</label>
              <input type="text" value={form.papers} onChange={(e) => setForm({ ...form, papers: e.target.value })} placeholder="e.g., Paper 2, Paper 4"
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
            <button onClick={createPartner} disabled={!form.name || !form.institution || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
      )}

      {partners.length === 0 ? (
        <div className="text-center py-12">
          <Users size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No academic partners yet. Add potential collaborators and co-authors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((partner) => {
            const cc = CONTACT_COLORS[partner.contactStatus] || CONTACT_COLORS.not_contacted;
            const rc = RELATIONSHIP_COLORS[partner.relationship || "potential"] || RELATIONSHIP_COLORS.potential;
            return (
              <div
                key={partner.id}
                className="rounded-2xl p-5 space-y-3"
                style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${ACCENT}14` }}>
                    <UserCheck size={18} style={{ color: ACCENT }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{partner.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} style={{ color: "var(--muted)" }} />
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {partner.institution}{partner.department ? ` - ${partner.department}` : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.text }}>
                    {partner.relationship || "potential"}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: cc.bg, color: cc.text }}>
                    {partner.contactStatus.replace(/_/g, " ")}
                  </span>
                </div>

                {partner.papers && (
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Papers: {partner.papers}
                  </p>
                )}

                {partner.email && (
                  <a href={`mailto:${partner.email}`} className="flex items-center gap-1.5 text-xs hover:opacity-80" style={{ color: ACCENT }}>
                    <Mail size={12} /> {partner.email}
                  </a>
                )}

                {partner.notes && (
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{partner.notes}</p>
                )}

                {/* Quick status update */}
                <div className="flex gap-2 pt-1">
                  <select
                    value={partner.contactStatus}
                    onChange={(e) => updatePartner(partner.id, "contactStatus", e.target.value)}
                    className="text-[10px] px-2 py-1 rounded-lg outline-none"
                    style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  >
                    {CONTACT_OPTIONS.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                  </select>
                  <select
                    value={partner.relationship || "potential"}
                    onChange={(e) => updatePartner(partner.id, "relationship", e.target.value)}
                    className="text-[10px] px-2 py-1 rounded-lg outline-none"
                    style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  >
                    {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
