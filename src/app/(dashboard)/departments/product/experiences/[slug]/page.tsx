"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  Sparkles,
  Palette,
  Code2,
  MessageSquare,
  LayoutList,
  FileText,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

/* ─── Types ─── */
interface Experience {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  accentColor: string;
  status: string;
  description: string | null;
  targetPersona: string | null;
}

interface Feature {
  id: string;
  name: string;
  description: string | null;
  userStory: string | null;
  priority: string;
  complexity: string;
  status: string;
  careTeamMembers: string[] | null;
  uxSpec: string | null;
  generatedCode: string | null;
  notes: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

/* ─── Constants ─── */
const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  must_have: { bg: "#E24D4718", text: "#E24D47" },
  should_have: { bg: "#F59E0B18", text: "#F59E0B" },
  nice_to_have: { bg: "#1EAA5518", text: "#1EAA55" },
};

const PRIORITY_LABELS: Record<string, string> = {
  must_have: "Must Have",
  should_have: "Should Have",
  nice_to_have: "Nice to Have",
};

const COMPLEXITY_LABELS: Record<string, string> = {
  small: "S",
  medium: "M",
  large: "L",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "#888" },
  designing: { label: "Designing", color: "#F59E0B" },
  wireframed: { label: "Wireframed", color: "#ACB7FF" },
  coded: { label: "Coded", color: "#5A6FFF" },
  shipped: { label: "Shipped", color: "#1EAA55" },
};

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "features", label: "Features", icon: LayoutList },
  { id: "coach", label: "Product Coach", icon: MessageSquare },
  { id: "ux", label: "UX Design", icon: Palette },
  { id: "code", label: "Code Gen", icon: Code2 },
];

export default function ExperienceWorkspace() {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Load experience and features
  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch("/api/product/experiences").then((r) => r.json()),
      // features loaded after we have experience id
    ]).then(([exps]) => {
      const exp = (exps as Experience[]).find(
        (e: Experience) => e.slug === slug
      );
      if (exp) {
        setExperience(exp);
        fetch(`/api/product/features?experienceId=${exp.id}`)
          .then((r) => r.json())
          .then((f) => setFeatures(f))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--muted)" }}>Experience not found</p>
        <Link
          href="/departments/product/experiences"
          className="text-sm mt-2 inline-block"
          style={{ color: "var(--brand-primary)" }}
        >
          Back to Experiences
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Workspace Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/departments/product/experiences"
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
        </Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${experience.accentColor}18` }}
        >
          {getIcon(slug)}
        </div>
        <div className="flex-1">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            {experience.name}
          </h2>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {experience.tagline}
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${experience.accentColor}18`,
            color: experience.accentColor,
          }}
        >
          {features.length} features
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${active ? "shadow-sm" : ""}`}
              style={
                active
                  ? { backgroundColor: "var(--surface)", color: experience.accentColor }
                  : { color: "var(--muted)" }
              }
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab experience={experience} features={features} onUpdate={setExperience} />
      )}
      {activeTab === "features" && (
        <FeaturesTab experience={experience} features={features} onUpdate={setFeatures} />
      )}
      {activeTab === "coach" && (
        <CoachTab experience={experience} conversationType="product-coach" />
      )}
      {activeTab === "ux" && (
        <SplitPanelTab
          experience={experience}
          features={features}
          conversationType="ux_design"
          panelType="ux"
        />
      )}
      {activeTab === "code" && (
        <SplitPanelTab
          experience={experience}
          features={features}
          conversationType="code_gen"
          panelType="code"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   OVERVIEW TAB
   ───────────────────────────────────────────── */
function OverviewTab({
  experience,
  features,
  onUpdate,
}: {
  experience: Experience;
  features: Feature[];
  onUpdate: (e: Experience) => void;
}) {
  const [description, setDescription] = useState(experience.description || "");
  const [persona, setPersona] = useState(experience.targetPersona || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/product/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: experience.id, description, targetPersona: persona }),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate({ ...experience, ...updated });
    }
    setSaving(false);
  };

  const mustHave = features.filter((f) => f.priority === "must_have").length;
  const shouldHave = features.filter((f) => f.priority === "should_have").length;
  const niceToHave = features.filter((f) => f.priority === "nice_to_have").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column — Notes */}
      <div className="lg:col-span-2 space-y-6">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Experience Description
          </h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this experience... Who is she? What's happening in her life? What has failed her before?"
            className="w-full h-32 px-4 py-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Target Persona
          </h3>
          <textarea
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Who is this woman? Age range, life stage, emotions, frustrations, hopes..."
            className="w-full h-32 px-4 py-3 rounded-lg text-sm border resize-none focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: experience.accentColor }}
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>

      {/* Right Column — Stats */}
      <div className="space-y-4">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h4 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
            Feature Breakdown
          </h4>
          <div className="space-y-3">
            <StatRow label="Must Have" count={mustHave} color="#E24D47" />
            <StatRow label="Should Have" count={shouldHave} color="#F59E0B" />
            <StatRow label="Nice to Have" count={niceToHave} color="#1EAA55" />
          </div>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h4 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
            Status Progress
          </h4>
          <div className="space-y-3">
            {Object.entries(STATUS_LABELS).map(([key, val]) => {
              const count = features.filter((f) => f.status === key).length;
              return <StatRow key={key} label={val.label} count={count} color={val.color} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm" style={{ color: "var(--foreground)" }}>{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color }}>{count}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURES TAB
   ───────────────────────────────────────────── */
function FeaturesTab({
  experience,
  features,
  onUpdate,
}: {
  experience: Experience;
  features: Feature[];
  onUpdate: (f: Feature[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("should_have");
  const [newComplexity, setNewComplexity] = useState("medium");
  const [adding, setAdding] = useState(false);

  const addFeature = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/product/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experienceId: experience.id,
        name: newName,
        description: newDesc,
        priority: newPriority,
        complexity: newComplexity,
      }),
    });
    if (res.ok) {
      const feature = await res.json();
      onUpdate([...features, feature]);
      setNewName("");
      setNewDesc("");
      setShowAdd(false);
    }
    setAdding(false);
  };

  const deleteFeature = async (id: string) => {
    const res = await fetch("/api/product/features", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      onUpdate(features.filter((f) => f.id !== id));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/product/features", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      onUpdate(features.map((f) => (f.id === id ? { ...f, status } : f)));
    }
  };

  return (
    <div>
      {/* Add Feature Button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {features.length} feature{features.length !== 1 ? "s" : ""} defined
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
          style={{ backgroundColor: experience.accentColor }}
        >
          <Plus size={14} />
          Add Feature
        </button>
      </div>

      {/* Add Feature Form */}
      {showAdd && (
        <div
          className="rounded-xl p-5 mb-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Feature name..."
            className="w-full px-4 py-2.5 rounded-lg border text-sm mb-3 focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description..."
            className="w-full px-4 py-2.5 rounded-lg border text-sm mb-3 resize-none h-20 focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
          <div className="flex gap-3 items-center">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <option value="must_have">Must Have</option>
              <option value="should_have">Should Have</option>
              <option value="nice_to_have">Nice to Have</option>
            </select>
            <select
              value={newComplexity}
              onChange={(e) => setNewComplexity(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <div className="flex-1" />
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
            <button
              onClick={addFeature}
              disabled={adding || !newName.trim()}
              className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              style={{ backgroundColor: experience.accentColor }}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Features List */}
      {features.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <Sparkles size={32} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No features yet. Use the Product Coach to brainstorm, or add them manually.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {features.map((feature) => {
            const prio = PRIORITY_COLORS[feature.priority] || PRIORITY_COLORS.should_have;
            const statusInfo = STATUS_LABELS[feature.status] || STATUS_LABELS.idea;
            return (
              <div
                key={feature.id}
                className="rounded-xl p-4 flex items-start gap-4 group"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {feature.name}
                    </h4>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: prio.bg, color: prio.text }}
                    >
                      {PRIORITY_LABELS[feature.priority]}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{ backgroundColor: "var(--border-light)", color: "var(--muted)" }}
                    >
                      {COMPLEXITY_LABELS[feature.complexity] || "M"}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {feature.description}
                    </p>
                  )}
                  {feature.userStory && (
                    <p className="text-xs mt-1 italic" style={{ color: "var(--muted)" }}>
                      &ldquo;{feature.userStory}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select
                      value={feature.status}
                      onChange={(e) => updateStatus(feature.id, e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium border cursor-pointer"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--background)",
                        color: statusInfo.color,
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--muted)" }}
                    />
                  </div>
                  <button
                    onClick={() => deleteFeature(feature.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    style={{ color: "#E24D47" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COACH CHAT TAB
   ───────────────────────────────────────────── */
function CoachTab({
  experience,
  conversationType,
}: {
  experience: Experience;
  conversationType: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation history
  useEffect(() => {
    fetch(
      `/api/product/coach?experienceSlug=${experience.slug}&conversationType=${conversationType}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(data.messages);
          setSessionId(data.sessionId);
        }
        setHistoryLoaded(true);
      })
      .catch(() => setHistoryLoaded(true));
  }, [experience.slug, conversationType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceName: experience.name,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        if (data.sessionId) setSessionId(data.sessionId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!historyLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={20} style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        height: "calc(100vh - 340px)",
        minHeight: "400px",
      }}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={32} className="mb-3" style={{ color: experience.accentColor }} />
            <h3 className="font-medium mb-1" style={{ color: "var(--foreground)" }}>
              Product Coach
            </h3>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
              I&apos;m here to help you design the {experience.name} experience. Ask me
              anything — feature ideas, user flows, personas, or strategy.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                `Who is the woman using ${experience.name}?`,
                "What are the must-have features?",
                "Design the onboarding flow",
                "What would make her tell every friend?",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-full border hover:shadow-sm"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${experience.accentColor}18` }}
                  >
                    <Bot size={14} style={{ color: experience.accentColor }} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === "user" ? "text-white" : ""}`}
                  style={{
                    backgroundColor:
                      msg.role === "user" ? experience.accentColor : "var(--background)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--border-light)" }}
                  >
                    <User size={14} style={{ color: "var(--muted)" }} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${experience.accentColor}18` }}
                >
                  <Bot size={14} style={{ color: experience.accentColor }} />
                </div>
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-3 max-w-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Ask about ${experience.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50"
            style={{ backgroundColor: experience.accentColor }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPLIT PANEL TAB (UX Design + Code Gen)
   ───────────────────────────────────────────── */
function SplitPanelTab({
  experience,
  features,
  conversationType,
  panelType,
}: {
  experience: Experience;
  features: Feature[];
  conversationType: string;
  panelType: "ux" | "code";
}) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [canvasContent, setCanvasContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation when feature changes
  const loadConversation = useCallback(async (feature: Feature | null) => {
    if (!feature) return;
    setMessages([]);
    setCanvasContent(
      panelType === "ux" ? feature.uxSpec || "" : feature.generatedCode || ""
    );

    try {
      const res = await fetch(
        `/api/product/coach?experienceSlug=${experience.slug}&conversationType=${conversationType}`
      );
      const data = await res.json();
      if (data.messages?.length) {
        setMessages(data.messages);
        setSessionId(data.sessionId);
      }
    } catch {
      // silently fail
    }
  }, [experience.slug, conversationType, panelType]);

  useEffect(() => {
    if (selectedFeature) loadConversation(selectedFeature);
  }, [selectedFeature, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: experience.slug,
          experienceName: experience.name,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          conversationType,
          featureName: selectedFeature?.name,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const assistantMsg: ChatMessage = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMsg]);
        setCanvasContent(data.response);
        if (data.sessionId) setSessionId(data.sessionId);

        // Auto-save to feature
        if (selectedFeature) {
          const field = panelType === "ux" ? "uxSpec" : "generatedCode";
          await fetch("/api/product/features", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedFeature.id, [field]: data.response }),
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isUx = panelType === "ux";

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        height: "calc(100vh - 340px)",
        minHeight: "500px",
      }}
    >
      {/* LEFT — Chat Panel */}
      <div
        className="flex flex-col border-r"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        {/* Feature selector */}
        <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
          <select
            value={selectedFeature?.id || ""}
            onChange={(e) => {
              const f = features.find((f) => f.id === e.target.value) || null;
              setSelectedFeature(f);
            }}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <option value="">Select a feature...</option>
            {features.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedFeature ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Select a feature to start {isUx ? "designing" : "coding"}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              {isUx ? (
                <Palette size={28} className="mb-2" style={{ color: experience.accentColor }} />
              ) : (
                <Code2 size={28} className="mb-2" style={{ color: experience.accentColor }} />
              )}
              <p className="text-sm mb-2" style={{ color: "var(--foreground)" }}>
                {isUx ? "UX Design" : "Code Generation"} — {selectedFeature.name}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {isUx
                  ? "Describe the user flow, screens, and interactions"
                  : "Generate React components with Tailwind styling"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${experience.accentColor}18` }}
                    >
                      <Bot size={12} style={{ color: experience.accentColor }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === "user" ? "text-white" : ""}`}
                    style={{
                      backgroundColor:
                        msg.role === "user" ? experience.accentColor : "var(--background)",
                      border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${experience.accentColor}18` }}
                  >
                    <Bot size={12} style={{ color: experience.accentColor }} />
                  </div>
                  <div className="rounded-lg px-3 py-2 border" style={{ borderColor: "var(--border)" }}>
                    <Loader2 size={12} className="animate-spin" style={{ color: "var(--muted)" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {selectedFeature && (
          <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={isUx ? "Describe the flow..." : "What should this component do?"}
                className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: experience.accentColor }}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Canvas/Preview Panel */}
      <div className="flex flex-col" style={{ backgroundColor: "var(--background)" }}>
        <div
          className="px-4 py-3 border-b flex items-center gap-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          {isUx ? <Palette size={14} /> : <Code2 size={14} />}
          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            {isUx ? "UX Specification" : "Generated Code"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {canvasContent ? (
            <div
              className={`text-sm whitespace-pre-wrap leading-relaxed ${
                isUx ? "" : "font-mono text-xs"
              }`}
              style={{ color: "var(--foreground)" }}
            >
              {canvasContent}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "var(--border-light)" }}
              >
                {isUx ? (
                  <Palette size={24} style={{ color: "var(--muted)" }} />
                ) : (
                  <Code2 size={24} style={{ color: "var(--muted)" }} />
                )}
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {isUx
                  ? "UX specs will appear here as you design"
                  : "Generated code will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
function getIcon(slug: string): string {
  const icons: Record<string, string> = {
    "first-period": "\u{1F338}",
    "early-menstruator": "\u{1F331}",
    periods: "\u{1F4AB}",
    pcos: "\u{1F52C}",
    endometriosis: "\u{1F940}",
    fertility: "\u{2728}",
    pregnancy: "\u{1F31F}",
    postpartum: "\u{1F343}",
    perimenopause: "\u{1F525}",
    "menopause-beyond": "\u{1F30A}",
  };
  return icons[slug] || "✦";
}
