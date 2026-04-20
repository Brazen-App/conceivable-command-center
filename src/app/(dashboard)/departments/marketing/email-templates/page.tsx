"use client";

import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

const EMAILS = [
  { index: 0, subject: "I've been where you are", day: "Day 1" },
  { index: 1, subject: "She almost didn't try either", day: "Day 3 — 8 supplements" },
  { index: 2, subject: "I recorded this for you", day: "Day 5" },
  { index: 3, subject: "Whatever you decide", day: "Day 7" },
];

export default function EmailTemplatesPage() {
  const [selected, setSelected] = useState(0);
  const [html, setHtml] = useState("");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/mailchimp/email-content?index=${selected}`)
      .then(r => r.json())
      .then(d => {
        setHtml(d.html || "");
        setSubject(d.subject || "");
        setPreview(d.preview || "");
      })
      .finally(() => setLoading(false));
  }, [selected]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Quiz Nurture Email Templates</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Copy the HTML for each email and paste into the Mailchimp Customer Journey editor.
        </p>
      </div>

      {/* Instructions */}
      <div className="rounded-xl p-4 text-sm space-y-1" style={{ backgroundColor: "#5A6FFF10", border: "1px solid #5A6FFF30", color: "var(--foreground)" }}>
        <p className="font-semibold" style={{ color: "#5A6FFF" }}>How to update your Mailchimp Customer Journey emails:</p>
        <ol className="list-decimal list-inside space-y-1 mt-2" style={{ color: "var(--muted)" }}>
          <li>Open <a href="https://us17.admin.mailchimp.com/customer-journey/builder?id=6424" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#5A6FFF" }}>Journey #6424 in Mailchimp <ExternalLink size={11} className="inline" /></a></li>
          <li>Click each email step → Edit → switch to <strong>Code view (HTML)</strong></li>
          <li>Select all → paste the HTML from below</li>
          <li>Save. Repeat for each email.</li>
        </ol>
      </div>

      {/* Email selector */}
      <div className="flex flex-wrap gap-2">
        {EMAILS.map(e => (
          <button
            key={e.index}
            onClick={() => setSelected(e.index)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: selected === e.index ? "#5A6FFF" : "var(--surface)",
              color: selected === e.index ? "#fff" : "var(--muted)",
              border: `1px solid ${selected === e.index ? "#5A6FFF" : "var(--border)"}`,
            }}
          >
            <span className="font-bold">{e.day}</span>
            <span className="ml-1.5 opacity-80">{e.subject}</span>
          </button>
        ))}
      </div>

      {/* Email details + copy */}
      <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>Subject line</p>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{subject}</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Preview: {preview}</p>
          </div>
          <button
            onClick={copyHtml}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shrink-0 transition-all"
            style={{
              backgroundColor: copied ? "#1EAA55" : "#5A6FFF",
              color: "#fff",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>

        {loading ? (
          <div className="h-40 rounded-lg animate-pulse" style={{ backgroundColor: "var(--background)" }} />
        ) : (
          <textarea
            readOnly
            value={html}
            className="w-full h-48 text-xs font-mono rounded-lg p-3 resize-none outline-none"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
          />
        )}
      </div>

      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Email #2 (Day 3) uses merge tags *|SUPP1|*–*|SUPP8|*, *|FOCUS_AREA|*, and *|FNAME|*.
        Make sure these merge fields exist in your Mailchimp list (run &quot;Update Emails&quot; on the Email Ops page to create them).
      </p>
    </div>
  );
}
