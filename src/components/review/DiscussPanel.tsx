"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DiscussPanelProps {
  isOpen: boolean;
  onClose: () => void;
  contextType: string; // "email", "patent", "task", etc.
  contextId: string;
  contextTitle: string;
  contextDetail?: string; // extra context for Joy (e.g. email body snippet)
  onApprove?: () => void;
  onReject?: () => void;
}

export default function DiscussPanel({
  isOpen,
  onClose,
  contextType,
  contextId,
  contextTitle,
  contextDetail,
  onApprove,
  onReject,
}: DiscussPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const logMessage = useCallback(async (role: string, message: string) => {
    try {
      await fetch("/api/chat-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextType,
          contextId,
          role,
          message,
          sessionId,
        }),
      });
    } catch {
      // Non-critical — don't block chat
    }
  }, [contextType, contextId, sessionId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Log user message
    logMessage("user", text);

    // Build context-aware prompt
    const contextPrompt = messages.length === 0
      ? `[Context: The user is reviewing a ${contextType} titled "${contextTitle}". ${contextDetail ? `Details: ${contextDetail}` : ""}]\n\nUser question: ${text}`
      : text;

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: contextType === "patent" ? "legal" : "marketing",
          message: contextPrompt,
        }),
      });

      const data = await res.json();
      const responseText = res.ok
        ? data.response
        : data.error || "Something went wrong. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      logMessage("assistant", responseText);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I encountered an error. Please check that the ANTHROPIC_API_KEY is configured and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-lg z-50 border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#5A6FFF14" }}
            >
              <Sparkles size={15} style={{ color: "#5A6FFF" }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                Discuss with Joy
              </p>
              <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                {contextType}: {contextTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 shrink-0"
          >
            <X size={16} style={{ color: "var(--muted)" }} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "#5A6FFF10" }}
              >
                <Bot size={24} style={{ color: "#5A6FFF" }} />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                Ask Joy about this {contextType}
              </p>
              <p className="text-xs max-w-xs" style={{ color: "var(--muted)" }}>
                Joy can explain her reasoning, suggest changes, or help you decide whether to approve or reject.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {getContextSuggestions(contextType).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border hover:shadow-sm transition-shadow"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "#5A6FFF10" }}
                    >
                      <Bot size={14} style={{ color: "#5A6FFF" }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                      msg.role === "user" ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: msg.role === "user" ? "#5A6FFF" : "var(--surface)",
                      border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--border-light)" }}
                    >
                      <User size={14} style={{ color: "var(--muted)" }} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#5A6FFF10" }}
                  >
                    <Bot size={14} style={{ color: "#5A6FFF" }} />
                  </div>
                  <div
                    className="rounded-xl px-3.5 py-2.5 border"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Action buttons within chat */}
        {messages.length > 0 && (onApprove || onReject) && (
          <div
            className="flex items-center gap-2 px-5 py-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-xs mr-auto" style={{ color: "var(--muted)" }}>
              Ready to decide?
            </span>
            {onApprove && (
              <button
                onClick={() => { onApprove(); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: "#1EAA55" }}
              >
                <CheckCircle2 size={13} />
                Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={() => { onReject(); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white"
                style={{ backgroundColor: "#E24D47" }}
              >
                <XCircle size={13} />
                Reject
              </button>
            )}
          </div>
        )}

        {/* Input */}
        <div
          className="px-5 py-3 border-t shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Ask Joy anything..."
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="px-3.5 py-2.5 rounded-xl text-white disabled:opacity-50"
              style={{ backgroundColor: "#5A6FFF" }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function getContextSuggestions(contextType: string): string[] {
  const suggestions: Record<string, string[]> = {
    email: [
      "Why this subject line?",
      "What's the expected open rate?",
      "Should we send this first or wait?",
      "Any compliance concerns?",
    ],
    patent: [
      "Why is this high priority?",
      "What's the filing cost?",
      "What's the risk if we don't file?",
      "Compare to our other claims",
    ],
    content: [
      "Why this angle?",
      "Which platform should this go on first?",
      "Any compliance issues?",
    ],
    task: [
      "Why is this important?",
      "What's the expected impact?",
      "Can this wait?",
    ],
  };
  return suggestions[contextType] ?? ["Tell me more about this", "What's your recommendation?"];
}
