"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Loader2,
  Plus,
  Save,
  Search,
  ExternalLink,
  Tag,
} from "lucide-react";

const ACCENT = "#78C3BF";

interface LitEntry {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  doi: string | null;
  abstract: string | null;
  relevanceTag: string | null;
  notes: string | null;
  paperNumber: number | null;
}

const RELEVANCE_TAGS = [
  "factor-1",
  "factor-2",
  "factor-3",
  "general",
  "luteal-phase",
  "miscarriage",
  "wearable",
  "digital-fertility",
];

const TAG_COLORS: Record<string, string> = {
  "factor-1": "#E24D47",
  "factor-2": "#F1C028",
  "factor-3": "#9686B9",
  general: "#ACB7FF",
  "luteal-phase": "#E37FB1",
  miscarriage: "#E24D47",
  wearable: "#78C3BF",
  "digital-fertility": "#5A6FFF",
};

const PUBMED_SEARCH_TERMS = [
  "luteal phase deficiency fertility outcomes",
  "subclinical inflammation miscarriage risk",
  "hormonal dysregulation early pregnancy loss",
  "wearable technology fertility monitoring",
  "AI-guided reproductive health protocol",
  "digital fertility tracking clinical outcomes",
  "cycle tracking vs intervention fertility",
  "menstrual cycle biomarker miscarriage prediction",
];

export default function LiteraturePage() {
  const [entries, setEntries] = useState<LitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterPaper, setFilterPaper] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    title: "",
    authors: "",
    journal: "",
    year: "",
    doi: "",
    abstract: "",
    relevanceTag: "",
    notes: "",
    paperNumber: "",
  });

  const fetchEntries = useCallback(async () => {
    try {
      let url = "/api/research?type=literature";
      if (filterTag) url += `&relevanceTag=${filterTag}`;
      if (filterPaper) url += `&paperNumber=${filterPaper}`;
      const res = await fetch(url);
      if (res.ok) setEntries(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [filterTag, filterPaper]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "literature",
          title: form.title,
          authors: form.authors || null,
          journal: form.journal || null,
          year: form.year ? parseInt(form.year) : null,
          doi: form.doi || null,
          abstract: form.abstract || null,
          relevanceTag: form.relevanceTag || null,
          notes: form.notes || null,
          paperNumber: form.paperNumber ? parseInt(form.paperNumber) : null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", authors: "", journal: "", year: "", doi: "", abstract: "", relevanceTag: "", notes: "", paperNumber: "" });
        await fetchEntries();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const filtered = entries.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.authors?.toLowerCase().includes(q) ?? false) ||
      (e.journal?.toLowerCase().includes(q) ?? false)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
          Literature Database
        </h2>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <Search size={14} style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm outline-none bg-transparent"
              style={{ color: "var(--foreground)" }}
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setFilterTag(null); setFilterPaper(null); }}
          className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{
            backgroundColor: !filterTag && !filterPaper ? `${ACCENT}20` : "var(--background)",
            color: !filterTag && !filterPaper ? ACCENT : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          All ({entries.length})
        </button>
        {RELEVANCE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => { setFilterTag(filterTag === tag ? null : tag); setFilterPaper(null); }}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: filterTag === tag ? `${TAG_COLORS[tag]}20` : "var(--background)",
              color: filterTag === tag ? TAG_COLORS[tag] : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            {tag}
          </button>
        ))}
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => { setFilterPaper(filterPaper === String(n) ? null : String(n)); setFilterTag(null); }}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: filterPaper === String(n) ? `${ACCENT}20` : "var(--background)",
              color: filterPaper === String(n) ? ACCENT : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            Paper {n}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Authors</label>
              <input type="text" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Journal</label>
              <input type="text" value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>DOI</label>
              <input type="text" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Relevance Tag</label>
              <select value={form.relevanceTag} onChange={(e) => setForm({ ...form, relevanceTag: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                <option value="">None</option>
                {RELEVANCE_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Paper #</label>
              <select value={form.paperNumber} onChange={(e) => setForm({ ...form, paperNumber: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                <option value="">None</option>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Paper {n}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Abstract</label>
              <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} rows={3}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: "var(--muted)" }}>Cancel</button>
            <button onClick={createEntry} disabled={!form.title || saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
      )}

      {/* PubMed Search Terms */}
      <div className="rounded-2xl p-5" style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Search size={14} style={{ color: ACCENT }} />
          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Suggested PubMed Search Terms</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PUBMED_SEARCH_TERMS.map((term) => (
            <a
              key={term}
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(term)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
            >
              {term} <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>

      {/* Literature entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={32} className="mx-auto mb-3" style={{ color: "var(--muted)", opacity: 0.4 }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {entries.length === 0 ? "No literature entries yet. Add your first reference above." : "No entries match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl p-4"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {entry.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {[entry.authors, entry.journal, entry.year].filter(Boolean).join(" - ") || "No details"}
                  </p>
                  {entry.abstract && (
                    <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                      {entry.abstract}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {entry.relevanceTag && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: `${TAG_COLORS[entry.relevanceTag] || ACCENT}20`, color: TAG_COLORS[entry.relevanceTag] || ACCENT }}
                      >
                        <Tag size={9} /> {entry.relevanceTag}
                      </span>
                    )}
                    {entry.paperNumber && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
                        Paper {entry.paperNumber}
                      </span>
                    )}
                    {entry.doi && (
                      <a
                        href={`https://doi.org/${entry.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium flex items-center gap-1 hover:opacity-80"
                        style={{ color: ACCENT }}
                      >
                        DOI <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
