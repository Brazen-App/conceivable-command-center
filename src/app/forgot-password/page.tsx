"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResetLink(data.link);
      }
    } catch {
      setError("Something went wrong — try again");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!resetLink) return;
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F9F7F0" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "#fff", border: "1px solid #E8E4DD" }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#5A6FFF12" }}>
            <Mail size={24} style={{ color: "#5A6FFF" }} />
          </div>
          <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)", color: "#2A2828", letterSpacing: "0.06em" }}>
            RESET PASSWORD
          </h1>
          <p className="text-xs mt-1" style={{ color: "#999", letterSpacing: "0.1em" }}>COMMAND CENTER</p>
        </div>

        {!resetLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "#888" }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: "#F9F7F0", border: "1px solid #E8E4DD", color: "#2A2828" }}
                onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
                onBlur={(e) => (e.target.style.borderColor = "#E8E4DD")}
                placeholder="your@conceivable.com"
              />
            </div>

            {error && (
              <p className="text-xs text-center py-2 rounded-lg" style={{ color: "#E24D47", backgroundColor: "#E24D4708" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              style={{ backgroundColor: "#5A6FFF" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : "Generate Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "#1EAA5508", border: "1px solid #1EAA5530" }}>
              <p className="font-semibold mb-1" style={{ color: "#1EAA55" }}>Reset link ready</p>
              <p className="text-xs" style={{ color: "#666" }}>Copy this link and send it to the user. It expires in 7 days.</p>
            </div>

            <div className="rounded-xl p-3 break-all text-xs" style={{ backgroundColor: "#F9F7F0", border: "1px solid #E8E4DD", color: "#5A6FFF" }}>
              {resetLink}
            </div>

            <button
              onClick={copyLink}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: copied ? "#1EAA5515" : "#5A6FFF15", color: copied ? "#1EAA55" : "#5A6FFF", border: `1px solid ${copied ? "#1EAA5530" : "#5A6FFF30"}` }}
            >
              {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
            </button>
          </div>
        )}

        <Link href="/login" className="flex items-center justify-center gap-1.5 mt-6 text-xs" style={{ color: "#999" }}>
          <ArrowLeft size={12} /> Back to login
        </Link>
      </div>
    </div>
  );
}
