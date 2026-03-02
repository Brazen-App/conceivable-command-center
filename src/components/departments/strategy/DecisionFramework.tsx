"use client";

import { useState, useRef, useEffect } from "react";
import {
  Scale,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Bot,
  User,
  X,
  Sparkles,
  Clock,
  BookOpen,
} from "lucide-react";
import type { Decision, DecisionOption } from "@/lib/data/strategy-data";

const ACCENT = "#9686B9";

const STATUS_CONFIG = {
  active: { label: "Active", color: "#F1C028" },
  decided: { label: "Decided", color: "#1EAA55" },
  archived: { label: "Archived", color: "var(--muted)" },
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  decisions: Decision[];
}

function OptionCard({ option, isRecommended }: { option: DecisionOption; isRecommended: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border transition-all"
      style={{
        borderColor: isRecommended ? ACCENT : "var(--border)",
        backgroundColor: isRecommended ? `${ACCENT}04` : "var(--surface)",
      }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? (
            <ChevronDown size={14} style={{ color: ACCENT }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: option.multiplierLabel === "10x" ? "#1EAA5514" : "#F1C02814",
                color: option.multiplierLabel === "10x" ? "#1EAA55" : "#F1C028",
              }}
            >
              {option.multiplierLabel}
            </span>
            {isRecommended && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}
              >
                RECOMMENDED
              </span>
            )}
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {option.label}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            {option.description}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
          {/* Tradeoffs */}
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--foreground)" }}>
              Tradeoffs
            </p>
            <div className="space-y-1.5">
              {option.tradeoffs.map((t, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-2" style={{ backgroundColor: "#1EAA5506" }}>
                    <p className="text-[10px] leading-relaxed">
                      <span style={{ color: "#1EAA55" }}>+</span>{" "}
                      <span style={{ color: "var(--foreground)" }}>{t.pro}</span>
                    </p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: "#E24D4706" }}>
                    <p className="text-[10px] leading-relaxed">
                      <span style={{ color: "#E24D47" }}>-</span>{" "}
                      <span style={{ color: "var(--foreground)" }}>{t.con}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lenses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg p-3" style={{ backgroundColor: "#F1C02808", borderLeft: "3px solid #F1C028" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                Sullivan Lens
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                {option.sullivanLens}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: "#ACB7FF08", borderLeft: "3px solid #ACB7FF" }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#ACB7FF" }}>
                Campbell Lens
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                {option.campbellLens}
              </p>
            </div>
          </div>

          {/* Department Impact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
              Department Impact
            </p>
            <div className="space-y-1">
              {option.deptImpact.map((d) => {
                const sentColor = d.sentiment === "positive" ? "#1EAA55" : d.sentiment === "negative" ? "#E24D47" : "var(--muted)";
                return (
                  <div key={d.department} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: sentColor }} />
                    <p className="text-[10px]" style={{ color: "var(--foreground)" }}>
                      <span className="font-semibold">{d.department}:</span> {d.impact}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionCard({ decision }: { decision: Decision }) {
  const [expanded, setExpanded] = useState(decision.status === "active");
  const statusConf = STATUS_CONFIG[decision.status];

  return (
    <div
      className="rounded-xl border transition-all"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="pt-0.5">
          {expanded ? (
            <ChevronDown size={14} style={{ color: ACCENT }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--muted)" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${statusConf.color}14`, color: statusConf.color }}
            >
              {statusConf.label}
            </span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>
              {new Date(decision.dateCreated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {decision.title}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t space-y-4" style={{ borderColor: "var(--border)" }}>
          {/* Context */}
          <div className="rounded-lg p-3 mt-3" style={{ backgroundColor: "var(--background)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
              {decision.context}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {decision.options.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                isRecommended={decision.recommendation?.optionId === option.id}
              />
            ))}
          </div>

          {/* Recommendation */}
          {decision.recommendation && (
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: `${ACCENT}08`, borderLeft: `3px solid ${ACCENT}` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: ACCENT }}>
                Coach&apos;s Recommendation
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {decision.recommendation.reasoning}
              </p>
            </div>
          )}

          {/* Outcome (for decided) */}
          {decision.outcome && (
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#1EAA5508", borderLeft: "3px solid #1EAA55" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#1EAA55" }}>
                Outcome — Decided {new Date(decision.dateDecided!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--foreground)" }}>
                {decision.outcome.result}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                Lessons Learned
              </p>
              <p className="text-xs leading-relaxed italic" style={{ color: "var(--muted)" }}>
                {decision.outcome.lessonsLearned}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DecisionFramework({ decisions }: Props) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (chatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [chatOpen]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are the Strategy Coach for Conceivable, combining Bill Campbell's coaching principles with Dan Sullivan's Strategic Coach framework.

The CEO is thinking through a decision or strategic question. Help her by:
1. Asking clarifying questions (Campbell: start with the team, first principles)
2. Reframing through the 10x vs 2x lens (Sullivan: is this incremental or transformational?)
3. Identifying cross-department impacts
4. Being direct and honest — say what she needs to hear

CONVERSATION SO FAR:
${updated.map((m) => `${m.role === "user" ? "CEO" : "Coach"}: ${m.content}`).join("\n\n")}

Respond as the coach. Be warm but direct. Keep it concise. Ask one question at a time.`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.response }]);
      } else {
        setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Unable to connect — please check that the API is configured." }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Connection error — please try again." }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const activeDecisions = decisions.filter((d) => d.status === "active");
  const pastDecisions = decisions.filter((d) => d.status !== "active");

  return (
    <div>
      {/* Thinking Space CTA */}
      <div
        className="rounded-2xl p-6 mb-6 cursor-pointer transition-all hover:shadow-lg"
        style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #2A2828 80%)` }}
        onClick={() => {
          setChatOpen(true);
          if (chatMessages.length === 0) {
            setChatMessages([{
              id: "welcome",
              role: "assistant",
              content: "Hey Kirsten. What's on your mind?\n\nYou can describe a decision you're wrestling with, a strategic question, or just think out loud. I'll help you see it through the Sullivan (10x vs 2x) and Campbell (first principles, team-first) lenses.\n\nNothing leaves this room until you're ready.",
            }]);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Open the Thinking Space</p>
            <p className="text-white/50 text-xs">
              Think through decisions with your Strategy Coach — Sullivan + Campbell framework
            </p>
          </div>
          <ArrowRight size={16} className="text-white/40 ml-auto shrink-0" />
        </div>
      </div>

      {/* Active Decisions */}
      {activeDecisions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Scale size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Active Decisions
            </h3>
          </div>
          <div className="space-y-3">
            {activeDecisions.map((d) => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </div>
      )}

      {/* Decision Log */}
      {pastDecisions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} style={{ color: ACCENT }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Decision Log — Pattern Recognition
            </h3>
            <span className="text-[10px] ml-auto" style={{ color: "var(--muted)" }}>
              {pastDecisions.length} past decisions
            </span>
          </div>
          <div className="space-y-3">
            {pastDecisions.map((d) => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </div>
      )}

      {/* Chat Panel (Slide-in) */}
      <>
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            chatOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: "rgba(42, 40, 40, 0.6)" }}
          onClick={() => setChatOpen(false)}
        />
        <div
          className={`fixed top-0 right-0 bottom-0 z-50 w-full md:w-[520px] flex flex-col transition-transform duration-300 ease-in-out ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="h-1" style={{ backgroundColor: ACCENT }} />
          <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ backgroundColor: "#2A2828" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${ACCENT}30` }}>
                <Scale size={16} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Thinking Space</p>
                <p className="text-white/50 text-[11px]">Sullivan + Campbell Decision Framework</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} className="text-white/60" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--border)" }}>
                      <Bot size={14} style={{ color: ACCENT }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${msg.role === "user" ? "text-white" : ""}`}
                    style={{
                      backgroundColor: msg.role === "user" ? ACCENT : "var(--surface)",
                      border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <p className="text-[13px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--border)" }}>
                      <User size={14} style={{ color: "var(--muted)" }} />
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--border)" }}>
                    <Bot size={14} style={{ color: ACCENT }} />
                  </div>
                  <div className="rounded-xl px-4 py-3 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--muted)" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="px-5 py-4 border-t shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                placeholder="Describe a decision or think out loud..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled={chatLoading}
              />
              <button
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 transition-colors"
                style={{ backgroundColor: ACCENT }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
