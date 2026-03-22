"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F9F7F0" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: "#fff", border: "1px solid #E8E4DD" }}
      >
        {/* Logo area */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#5A6FFF12" }}
          >
            <Lock size={24} style={{ color: "#5A6FFF" }} />
          </div>
          <h1
            className="text-xl font-bold tracking-wide"
            style={{
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
              color: "#2A2828",
              letterSpacing: "0.06em",
            }}
          >
            COMMAND CENTER
          </h1>
          <p className="text-xs mt-1" style={{ color: "#999", letterSpacing: "0.1em" }}>
            CONCEIVABLE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] uppercase tracking-widest font-medium mb-1.5"
              style={{ color: "#888" }}
            >
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
              style={{
                backgroundColor: "#F9F7F0",
                border: "1px solid #E8E4DD",
                color: "#2A2828",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E4DD")}
              placeholder="kirsten@conceivable.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] uppercase tracking-widest font-medium mb-1.5"
              style={{ color: "#888" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: "#F9F7F0",
                border: "1px solid #E8E4DD",
                color: "#2A2828",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "#E8E4DD")}
              placeholder="••••••••"
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
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-[10px] text-center mt-6" style={{ color: "#ccc" }}>
          Protected access — authorized personnel only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9F7F0" }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
