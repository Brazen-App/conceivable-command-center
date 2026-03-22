"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Shield,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";

interface TeamUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  active: boolean;
  hasSetPassword: boolean;
  lastLoginAt: string | null;
  invitedBy: string | null;
  createdAt: string;
}

const ROLE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  admin: { bg: "#5A6FFF18", color: "#5A6FFF", label: "Admin" },
  team: { bg: "#1EAA5518", color: "#1EAA55", label: "Team" },
  investor: { bg: "#F1C02818", color: "#B8930A", label: "Investor" },
};

export default function TeamPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"team" | "investor">("team");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{
    success: boolean;
    message: string;
    link?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users/invite");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteResult(null);

    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName || undefined,
          role: inviteRole,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setInviteResult({
          success: true,
          message: `Invite created for ${inviteEmail}`,
          link: data.inviteLink,
        });
        setInviteEmail("");
        setInviteName("");
        fetchUsers();
      } else {
        setInviteResult({ success: false, message: data.error || "Failed to invite" });
      }
    } catch {
      setInviteResult({ success: false, message: "Network error" });
    } finally {
      setInviting(false);
    }
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#5A6FFF14" }}>
            <Users size={20} style={{ color: "#5A6FFF" }} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em", color: "var(--foreground)" }}>
              Team
            </h1>
            <p className="mt-0.5" style={{ fontFamily: "var(--font-caption)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
              Invite team members and investors — manage access
            </p>
          </div>
          <button onClick={fetchUsers} className="p-2 rounded-lg" style={{ color: "var(--muted)" }} title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Invite button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "#5A6FFF" }}
        >
          <UserPlus size={16} />
          Invite Someone
        </button>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{users.filter((u) => u.role !== "investor").length}</strong> team
          </span>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{users.filter((u) => u.role === "investor").length}</strong> investors
          </span>
        </div>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="rounded-xl border p-5 mb-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  placeholder="First name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-medium mb-2" style={{ color: "var(--muted)" }}>
                Role *
              </label>
              <div className="flex gap-3">
                {(["team", "investor"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setInviteRole(role)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: inviteRole === role ? `${ROLE_STYLES[role].color}14` : "var(--background)",
                      border: `1px solid ${inviteRole === role ? ROLE_STYLES[role].color : "var(--border)"}`,
                      color: inviteRole === role ? ROLE_STYLES[role].color : "var(--muted)",
                    }}
                  >
                    {role === "team" ? <Users size={14} /> : <Eye size={14} />}
                    {role === "team" ? "Team Member" : "Investor"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] mt-2" style={{ color: "var(--muted)" }}>
                {inviteRole === "team"
                  ? "Full access to all departments and features."
                  : "Can only access the investor data room."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={inviting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "#5A6FFF" }}
              >
                {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                {inviting ? "Creating invite..." : "Create Invite Link"}
              </button>
              <button
                type="button"
                onClick={() => { setShowInvite(false); setInviteResult(null); }}
                className="text-xs px-3 py-2"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Invite result */}
          {inviteResult && (
            <div
              className="mt-4 rounded-lg p-4"
              style={{
                backgroundColor: inviteResult.success ? "#1EAA5508" : "#E24D4708",
                border: `1px solid ${inviteResult.success ? "#1EAA5520" : "#E24D4720"}`,
              }}
            >
              <div className="flex items-start gap-2">
                {inviteResult.success ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "#1EAA55" }} />
                ) : (
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#E24D47" }} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {inviteResult.message}
                  </p>
                  {inviteResult.link && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: "var(--muted)" }}>
                        Send this link to them:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={inviteResult.link}
                          className="flex-1 px-3 py-2 rounded-lg text-xs font-mono"
                          style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          type="button"
                          onClick={() => copyLink(inviteResult.link!)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white shrink-0"
                          style={{ backgroundColor: copied ? "#1EAA55" : "#5A6FFF" }}
                        >
                          {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-[10px] mt-2" style={{ color: "var(--muted)" }}>
                        Link expires in 7 days. They&apos;ll set their own password.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users list */}
      {loading ? (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <Loader2 size={20} className="animate-spin mx-auto mb-2" style={{ color: "#5A6FFF" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>Loading team...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border p-8 text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
          <Users size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>No team members yet. Invite someone to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.team;
            return (
              <div
                key={user.id}
                className="rounded-xl border px-5 py-4 flex items-center gap-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: roleStyle.color }}
                >
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
                    >
                      {roleStyle.label}
                    </span>
                    {!user.hasSetPassword && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1C02814", color: "#B8930A" }}>
                        Invite pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {user.email}
                    {user.lastLoginAt && (
                      <> · Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
