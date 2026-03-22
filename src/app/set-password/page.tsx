"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F9F7F0" }}>
        <div className="w-full max-w-sm rounded-2xl p-8 text-center" style={{ backgroundColor: "#fff", border: "1px solid #E8E4DD" }}>
          <p className="text-sm" style={{ color: "#E24D47" }}>Invalid invite link. Ask your admin for a new one.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setEmail(data.email);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F9F7F0" }}>
        <div className="w-full max-w-sm rounded-2xl p-8 text-center" style={{ backgroundColor: "#fff", border: "1px solid #E8E4DD" }}>
          <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "#1EAA55" }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: "#2A2828" }}>You&apos;re all set!</h2>
          <p className="text-sm mb-6" style={{ color: "#888" }}>
            Your password has been created for <strong>{email}</strong>.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#5A6FFF" }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F9F7F0" }}>
      <div className="w-full max-w-sm rounded-2xl p-8 shadow-lg" style={{ backgroundColor: "#fff", border: "1px solid #E8E4DD" }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#5A6FFF12" }}>
            <Lock size={24} style={{ color: "#5A6FFF" }} />
          </div>
          <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)", color: "#2A2828", letterSpacing: "0.06em" }}>
            SET YOUR PASSWORD
          </h1>
          <p className="text-xs mt-1" style={{ color: "#999", letterSpacing: "0.1em" }}>
            CONCEIVABLE COMMAND CENTER
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "#888" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ backgroundColor: "#F9F7F0", border: "1px solid #E8E4DD", color: "#2A2828" }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E4DD")}
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "#888" }}>
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ backgroundColor: "#F9F7F0", border: "1px solid #E8E4DD", color: "#2A2828" }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E4DD")}
              placeholder="Re-enter password"
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
            {loading ? <><Loader2 size={16} className="animate-spin" /> Setting password...</> : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9F7F0" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  );
}
