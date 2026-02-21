"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import {
  CheckCircle,
  Loader2,
  XCircle,
  Unlink,
  Linkedin,
  Instagram,
  Twitter,
  ExternalLink,
} from "lucide-react";

interface BufferProfile {
  id: string;
  service: string;
  username: string;
  formattedService: string;
  avatar: string;
}

interface PlatformConnection {
  connected: boolean;
  username: string | null;
  token: string;
  verifying: boolean;
  error: string | null;
  meta?: Record<string, unknown>;
}

const SOCIAL_PLATFORMS = [
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    placeholder: "Paste your LinkedIn access token",
    help: "Requires a LinkedIn app with r_liteprofile and w_member_social scopes.",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    placeholder: "Paste your Facebook/Instagram access token",
    help: "Requires a Facebook app with instagram_basic and instagram_content_publish permissions.",
  },
  {
    key: "x" as const,
    label: "X / Twitter",
    icon: Twitter,
    color: "#000000",
    placeholder: "Paste your X OAuth 2.0 bearer token",
    help: "Requires an X app with tweet.write scope.",
  },
  {
    key: "pinterest" as const,
    label: "Pinterest",
    icon: null,
    color: "#E60023",
    placeholder: "Paste your Pinterest access token",
    help: "Requires a Pinterest app with boards:read and pins:write scopes.",
  },
] as const;

type PlatformKey = (typeof SOCIAL_PLATFORMS)[number]["key"];

function getDefaultConnection(): PlatformConnection {
  return {
    connected: false,
    username: null,
    token: "",
    verifying: false,
    error: null,
  };
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <>
        <Header title="Settings" subtitle="Configure your command center" />
        <div className="p-8 flex items-center gap-2" style={{ color: "var(--muted)" }}>
          <Loader2 size={16} className="animate-spin" /> Loading settings...
        </div>
      </>
    }>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Buffer state
  const [bufferToken, setBufferToken] = useState("");
  const [bufferConnected, setBufferConnected] = useState(false);
  const [bufferUser, setBufferUser] = useState<string | null>(null);
  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [bufferVerifying, setBufferVerifying] = useState(false);
  const [bufferError, setBufferError] = useState<string | null>(null);
  const [showManualToken, setShowManualToken] = useState(false);

  // Direct platform connections
  const [platforms, setPlatforms] = useState<Record<PlatformKey, PlatformConnection>>({
    linkedin: getDefaultConnection(),
    instagram: getDefaultConnection(),
    x: getDefaultConnection(),
    pinterest: getDefaultConnection(),
  });

  // Handle Buffer OAuth callback token from URL
  useEffect(() => {
    const oauthToken = searchParams.get("buffer_token");
    const oauthError = searchParams.get("buffer_error");

    if (oauthToken) {
      // Auto-connect with the OAuth token
      setBufferToken(oauthToken);
      // Clean URL
      router.replace("/settings");
      // Verify and connect
      (async () => {
        setBufferVerifying(true);
        try {
          const res = await fetch("/api/integrations/buffer/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: oauthToken }),
          });
          const data = await res.json();
          if (res.ok && data.valid) {
            localStorage.setItem("buffer_access_token", oauthToken);
            localStorage.setItem("buffer_user_name", data.user.name);
            localStorage.setItem("buffer_profiles", JSON.stringify(data.profiles));
            setBufferConnected(true);
            setBufferUser(data.user.name);
            setBufferProfiles(data.profiles);
          } else {
            setBufferError(data.error || "Failed to verify Buffer token");
          }
        } catch {
          setBufferError("Failed to connect to Buffer");
        } finally {
          setBufferVerifying(false);
        }
      })();
    } else if (oauthError) {
      const errorMessages: Record<string, string> = {
        no_code: "Buffer did not return an authorization code.",
        missing_config: "BUFFER_CLIENT_ID or BUFFER_CLIENT_SECRET not configured on the server.",
        token_exchange_failed: "Failed to exchange authorization code for a token.",
        no_token: "Buffer did not return an access token.",
        network: "Network error while connecting to Buffer.",
      };
      setBufferError(errorMessages[oauthError] || "Unknown error connecting to Buffer.");
      router.replace("/settings");
    }
  }, [searchParams, router]);

  // Load saved state on mount
  useEffect(() => {
    // Buffer
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
        } catch {
          /* ignore */
        }
      }
    }

    // Direct platforms
    const updated: Record<PlatformKey, PlatformConnection> = {
      linkedin: getDefaultConnection(),
      instagram: getDefaultConnection(),
      x: getDefaultConnection(),
      pinterest: getDefaultConnection(),
    };

    for (const p of SOCIAL_PLATFORMS) {
      const token = localStorage.getItem(`social_${p.key}_token`);
      const username = localStorage.getItem(`social_${p.key}_username`);
      const meta = localStorage.getItem(`social_${p.key}_meta`);
      if (token) {
        updated[p.key] = {
          connected: true,
          username,
          token,
          verifying: false,
          error: null,
          meta: meta ? JSON.parse(meta) : undefined,
        };
      }
    }
    setPlatforms(updated);

  }, []);

  // Buffer handlers
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

  // Direct platform handlers
  const handleConnectPlatform = async (key: PlatformKey) => {
    const current = platforms[key];
    if (!current.token.trim()) return;

    setPlatforms((prev) => ({
      ...prev,
      [key]: { ...prev[key], verifying: true, error: null },
    }));

    try {
      const res = await fetch("/api/integrations/social/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: key, accessToken: current.token }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        localStorage.setItem(`social_${key}_token`, current.token);
        localStorage.setItem(`social_${key}_username`, data.username ?? "");
        if (data.meta) {
          localStorage.setItem(`social_${key}_meta`, JSON.stringify(data.meta));
        }
        setPlatforms((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            connected: true,
            username: data.username,
            verifying: false,
            error: null,
            meta: data.meta,
          },
        }));
      } else {
        setPlatforms((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            verifying: false,
            error: data.error || "Invalid token",
          },
        }));
      }
    } catch {
      setPlatforms((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          verifying: false,
          error: "Failed to verify token",
        },
      }));
    }
  };

  const handleDisconnectPlatform = (key: PlatformKey) => {
    localStorage.removeItem(`social_${key}_token`);
    localStorage.removeItem(`social_${key}_username`);
    localStorage.removeItem(`social_${key}_meta`);
    setPlatforms((prev) => ({
      ...prev,
      [key]: getDefaultConnection(),
    }));
  };

  const connectedPlatformCount = Object.values(platforms).filter((p) => p.connected).length;

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

        {/* Buffer Integration — Primary Publishing */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{
            borderColor: bufferConnected ? "#168EEA" : "var(--border)",
            backgroundColor: "var(--surface)",
          }}
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

          {bufferVerifying && !bufferConnected ? (
            <div className="flex items-center gap-3 py-4">
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                Connecting to Buffer...
              </span>
            </div>
          ) : bufferConnected ? (
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
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                Connect Buffer to schedule and publish content across all your social platforms from one place.
              </p>

              {/* OAuth Connect Button */}
              <a
                href="/api/integrations/buffer/authorize"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#168EEA" }}
              >
                <ExternalLink size={14} />
                Connect with Buffer
              </a>
              <p className="text-xs mt-2 mb-4" style={{ color: "var(--muted)" }}>
                Requires BUFFER_CLIENT_ID and BUFFER_CLIENT_SECRET environment variables.
              </p>

              {/* Manual token fallback */}
              <div
                className="pt-4 mt-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <button
                  onClick={() => setShowManualToken(!showManualToken)}
                  className="text-xs font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {showManualToken ? "Hide" : "Or paste access token manually"}
                </button>
                {showManualToken && (
                  <div className="mt-3">
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
                    <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                      Get a token from Buffer Developer settings &rarr; Create App &rarr; Access Token.
                    </p>
                  </div>
                )}
              </div>

              {bufferError && (
                <div className="flex items-center gap-1.5 mt-3">
                  <XCircle size={14} className="text-red-500" />
                  <span className="text-xs text-red-500">{bufferError}</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Direct Platform Integrations — Advanced */}
        <section
          className="rounded-xl border p-6 mb-6"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium" style={{ color: "var(--foreground)" }}>
              Direct Platform Tokens <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>(optional)</span>
            </h3>
            {connectedPlatformCount > 0 && (
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} style={{ color: "var(--status-success)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--status-success)" }}>
                  {connectedPlatformCount} connected
                </span>
              </div>
            )}
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            For direct publishing without Buffer. Most users should use Buffer above instead.
          </p>

          <div className="space-y-4">
            {SOCIAL_PLATFORMS.map((platform) => {
              const conn = platforms[platform.key];
              const Icon = platform.icon;

              return (
                <div
                  key={platform.key}
                  className="rounded-lg border p-4"
                  style={{ borderColor: conn.connected ? "var(--status-success)" : "var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {Icon ? (
                        <Icon size={16} style={{ color: platform.color }} />
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: platform.color }}
                        >
                          P
                        </span>
                      )}
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {platform.label}
                      </span>
                    </div>
                    {conn.connected && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={12} style={{ color: "var(--status-success)" }} />
                        <span className="text-xs" style={{ color: "var(--status-success)" }}>
                          {conn.username ? `@${conn.username}` : "Connected"}
                        </span>
                      </div>
                    )}
                  </div>

                  {conn.connected ? (
                    <button
                      onClick={() => handleDisconnectPlatform(platform.key)}
                      className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      <Unlink size={12} />
                      Disconnect
                    </button>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={conn.token}
                          onChange={(e) =>
                            setPlatforms((prev) => ({
                              ...prev,
                              [platform.key]: { ...prev[platform.key], token: e.target.value },
                            }))
                          }
                          placeholder={platform.placeholder}
                          className="flex-1 px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                        />
                        <button
                          onClick={() => handleConnectPlatform(platform.key)}
                          disabled={conn.verifying || !conn.token.trim()}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                          style={{ backgroundColor: platform.color }}
                        >
                          {conn.verifying ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Connect"
                          )}
                        </button>
                      </div>
                      {conn.error && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <XCircle size={14} className="text-red-500" />
                          <span className="text-xs text-red-500">{conn.error}</span>
                        </div>
                      )}
                      <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
                        {platform.help}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
