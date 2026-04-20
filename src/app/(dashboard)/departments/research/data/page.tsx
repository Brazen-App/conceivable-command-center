"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Database,
  Loader2,
  Plus,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface DataAsset {
  id: string;
  name: string;
  source: string;
  sampleSize: number | null;
  timePeriod: string | null;
  irbStatus: string;
  location: string | null;
  availableForResearch: boolean;
  notes: string | null;
}

const IRB_STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  unknown: { icon: AlertTriangle, color: "#F1C028", label: "Unknown" },
  not_needed: { icon: CheckCircle2, color: "#1EAA55", label: "Not Needed" },
  consent_needed: { icon: XCircle, color: "#E24D47", label: "Consent Needed" },
  approved: { icon: CheckCircle2, color: "#1EAA55", label: "Approved" },
};

export default function DataAssetsPage() {
  const [assets, setAssets] = useState<DataAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    source: "",
    sampleSize: "",
    timePeriod: "",
    irbStatus: "unknown",
    location: "",
    notes: "",
  });

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch("/api/research?type=data-assets");
      if (res.ok) setAssets(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const createAsset = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "data-asset",
          name: form.name,
          source: form.source,
          sampleSize: form.sampleSize ? parseInt(form.sampleSize) : null,
          timePeriod: form.timePeriod || null,
          irbStatus: form.irbStatus,
          location: form.location || null,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ name: "", source: "", sampleSize: "", timePeriod: "", irbStatus: "unknown", location: "", notes: "" });
        await fetchAssets();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
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
          Data Inventory
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus size={14} /> Add Dataset
        </button>
      </div>

      {showForm && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Source *</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Sample Size</label>
              <input
                type="number"
                value={form.sampleSize}
                onChange={(e) => setForm({ ...form, sampleSize: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Time Period</label>
              <input
                type="text"
                value={form.timePeriod}
                onChange={(e) => setForm({ ...form, timePeriod: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>IRB Status</label>
              <select
                value={form.irbStatus}
                onChange={(e) => setForm({ ...form, irbStatus: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                <option value="unknown">Unknown</option>
                <option value="not_needed">Not Needed</option>
                <option value="consent_needed">Consent Needed</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
                style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
            <button
              onClick={createAsset}
              disabled={!form.name || !form.source || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: ACCENT }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        </div>
      )}

      {/* Data Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const irbConfig = IRB_STATUS_CONFIG[asset.irbStatus] || IRB_STATUS_CONFIG.unknown;
          const IrbIcon = irbConfig.icon;
          return (
            <div
              key={asset.id}
              className="rounded-2xl p-5 space-y-3"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${ACCENT}14` }}
                >
                  <Database size={18} style={{ color: ACCENT }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {asset.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {asset.source}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2" style={{ backgroundColor: "var(--background)" }}>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Sample</p>
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {asset.sampleSize?.toLocaleString() || "TBD"}
                  </p>
                </div>
                <div className="rounded-lg p-2" style={{ backgroundColor: "var(--background)" }}>
                  <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>Period</p>
                  <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                    {asset.timePeriod || "TBD"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IrbIcon size={14} style={{ color: irbConfig.color }} />
                <span className="text-xs font-medium" style={{ color: irbConfig.color }}>
                  IRB: {irbConfig.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {asset.availableForResearch ? (
                  <>
                    <CheckCircle2 size={14} style={{ color: "#1EAA55" }} />
                    <span className="text-xs" style={{ color: "#1EAA55" }}>Available for research</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} style={{ color: "#E24D47" }} />
                    <span className="text-xs" style={{ color: "#E24D47" }}>Not yet available</span>
                  </>
                )}
              </div>

              {asset.notes && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {asset.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
