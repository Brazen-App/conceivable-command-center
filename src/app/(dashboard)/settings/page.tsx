"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { CheckCircle, Loader2, XCircle, Unlink } from "lucide-react";

interface BufferProfile {
  id: string;
  service: string;
  username: string;
  formattedService: string;
  avatar: string;
}

export default function SettingsPage() {
  const [bufferToken, setBufferToken] = useState("");
  const [bufferConnected, setBufferConnected] = useState(false);
  const [bufferUser, setBufferUser] = useState<string | null>(null);
  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [bufferVerifying, setBufferVerifying] = useState(false);
  const [bufferError, setBufferError] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("buffer_access_token");
    const savedUser = localStorage.getItem("buffer_user_name");
    const savedProfiles = localStorage.getItem("buffer_profiles");
    if (savedToken) {
      setBufferToken(savedToken);
      setBufferConnected(true);
      if (savedUser) setBufferUser(savedUser);
      if (savedProfiles) {
        try {
          setBufferProfiles(JSON.parse(savedProfiles));
        } catch { /* ignore */ }
      }
    }
  }, []);

  const handleConnectBuffer = async () => {
    if (!bufferToken.trim()) return;
    setBufferVerifying(true);
    setBufferError(null);

    try {
      const res = await fetch("/api/integrations/buffer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: bufferToken }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        localStorage.setItem("buffer_access_token", bufferToken);
        localStorage.setItem("buffer_user_name", data.user.name);
        localStorage.setItem("buffer_profiles", JSON.stringify(data.profiles));
        setBufferConnected(true);
        setBufferUser(data.user.name);
        setBufferProfiles(data.profiles);
      } else {
        setBufferError(data.error || "Invalid access token");
      }
    } catch {
      setBufferError("Failed to connect to Buffer");
    } finally {
      setBufferVerifying(false);
    }
  };

  const handleDisconnectBuffer = () => {
    localStorage.removeItem("buffer_access_token");
    localStorage.removeItem("buffer_user_name");
    localStorage.removeItem("buffer_profiles");
    setBufferToken("");
    setBufferConnected(false);
    setBufferUser(null);
    setBufferProfiles([]);
  };

  return (
    <>
      <Header title="Settings" subtitle="Configure your command center" />
      <div className="p-8 max-w-3xl">
        {/* API Keys */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Anthropic API Key
              </label>
              <input
                type="password"
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Set via ANTHROPIC_API_KEY environment variable
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Google Gemini API Key (Nano Banana Image Gen)
              </label>
              <input
                type="password"
                placeholder="AIza..."
                className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Set via GOOGLE_GEMINI_API_KEY environment variable — powers image generation
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Database URL
              </label>
              <input
                type="password"
                placeholder="postgresql://..."
                className="w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Set via DATABASE_URL environment variable
              </p>
            </div>
          </div>
        </section>

        {/* Buffer Integration */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: "var(--foreground)" }}>
              Buffer Integration
            </h3>
            {bufferConnected && (
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} style={{ color: "var(--status-success)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--status-success)" }}>
                  Connected
                </span>
              </div>
            )}
          </div>

          {bufferConnected ? (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--foreground)" }}>
                Connected as <strong>{bufferUser}</strong>
              </p>
              {bufferProfiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                    Connected profiles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bufferProfiles.map((profile) => (
                      <span
                        key={profile.id}
                        className="text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <span className="font-medium">{profile.formattedService}</span>
                        <span style={{ color: "var(--muted)" }}>@{profile.username}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={handleDisconnectBuffer}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                <Unlink size={12} />
                Disconnect Buffer
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                Connect your Buffer account to publish approved content directly to your social media channels.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={bufferToken}
                  onChange={(e) => setBufferToken(e.target.value)}
                  placeholder="Paste your Buffer access token"
                  className="flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                />
                <button
                  onClick={handleConnectBuffer}
                  disabled={bufferVerifying || !bufferToken.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {bufferVerifying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
              {bufferError && (
                <div className="flex items-center gap-1.5 mt-2">
                  <XCircle size={14} className="text-red-500" />
                  <span className="text-xs text-red-500">{bufferError}</span>
                </div>
              )}
              <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                Get your access token from Buffer Developer settings. Approved content will be added to your Buffer queue for review before posting.
              </p>
            </div>
          )}
        </section>

        {/* Morning Brief Schedule */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            Morning Brief Schedule
          </h3>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Delivery Time
              </label>
              <input
                type="time"
                defaultValue="07:00"
                className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
                Timezone
              </label>
              <select
                defaultValue="America/New_York"
                className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
              >
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
              </select>
            </div>
          </div>
        </section>

        {/* Monitored Topics */}
        <section
          className="rounded-xl border p-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <h3 className="font-medium mb-4" style={{ color: "var(--foreground)" }}>
            Monitored Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "infertility",
              "fertility",
              "PCOS",
              "endometriosis",
              "women's health",
              "AI",
              "AI in healthcare",
              "women's rights",
            ].map((topic) => (
              <span
                key={topic}
                className="text-sm px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
              >
                {topic}
              </span>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
            These topics are used by the Morning Brief and Viral Analyzer pipelines.
          </p>
        </section>
      </div>
    </>
  );
}
