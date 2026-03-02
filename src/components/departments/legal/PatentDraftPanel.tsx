"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Loader2,
  Bot,
  User,
  FileText,
  Download,
  Sparkles,
} from "lucide-react";
import type { Patent } from "@/lib/data/legal-data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PatentDraftPanelProps {
  patent: Patent;
  isOpen: boolean;
  onClose: () => void;
}

const PROGRESS_SECTIONS = [
  { key: "title", label: "Title" },
  { key: "background", label: "Background" },
  { key: "description", label: "Description" },
  { key: "claims", label: "Claims" },
  { key: "drawings", label: "Drawings" },
] as const;

function stripProgressMarkers(text: string): {
  cleanText: string;
  sections: string[];
} {
  const sections: string[] = [];
  const cleanText = text.replace(
    /\[PROGRESS:\s*([^\]]+)\]/g,
    (_match, sectionList: string) => {
      sectionList.split(",").forEach((s) => {
        const trimmed = s.trim().toLowerCase();
        if (trimmed) sections.push(trimmed);
      });
      return "";
    }
  );
  return { cleanText: cleanText.trim(), sections };
}

export default function PatentDraftPanel({
  patent,
  isOpen,
  onClose,
}: PatentDraftPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key closes panel
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Auto-start conversation on mount
  useEffect(() => {
    if (!isOpen || hasStarted.current) return;
    hasStarted.current = true;
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset when patent changes
  useEffect(() => {
    if (isOpen) {
      hasStarted.current = false;
      setMessages([]);
      setInput("");
      setDraftGenerated(false);
      setCompletedSections(new Set());
      hasStarted.current = true;
      startConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patent.id]);

  const callApi = async (
    msgs: { role: "user" | "assistant"; content: string }[],
    action: "chat" | "generate-draft" = "chat"
  ) => {
    const res = await fetch("/api/legal/patent-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patent, messages: msgs, action }),
    });
    if (!res.ok) throw new Error("API request failed");
    return res.json();
  };

  const processResponse = (text: string): string => {
    const { cleanText, sections } = stripProgressMarkers(text);
    if (sections.length > 0) {
      setCompletedSections((prev) => {
        const next = new Set(prev);
        sections.forEach((s) => next.add(s));
        return next;
      });
    }
    return cleanText;
  };

  const startConversation = async () => {
    setLoading(true);
    try {
      const initialMessage = `I'd like to draft a provisional patent application for "${patent.shortTitle}." Please review the patent details and begin by confirming the opportunity and asking your first set of questions.`;
      const data = await callApi([{ role: "user", content: initialMessage }]);
      const cleanResponse = processResponse(data.response);
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: cleanResponse,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: getFallbackIntro(),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const getFallbackIntro = () => {
    return `Let's draft the provisional patent for "${patent.shortTitle}" — this is a critical filing.

I've reviewed the patent details. Before I draft the application, I need to gather some technical specifics from you:

1. **Technical Implementation**: Can you walk me through how the ${patent.shortTitle} system works at a technical level? What are the data inputs, processing steps, and outputs?

2. **Novelty**: What specifically makes this approach different from anything else in the market? The prior art notes mention: "${patent.priorArtNotes || "No prior art notes available"}" — can you elaborate on what makes your implementation unique?

3. **Current Status**: Do you have a working implementation, prototype, or test data for this system?

Take your time — the more detail you provide, the stronger this provisional will be.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const data = await callApi(apiMessages);
      const cleanResponse = processResponse(data.response);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanResponse,
          timestamp: new Date(),
        },
      ]);

      // Check if draft was generated
      if (
        data.response.includes("PROVISIONAL PATENT APPLICATION") ||
        data.response.includes("DETAILED DESCRIPTION") ||
        (data.response.includes("CLAIMS") &&
          data.response.includes("ABSTRACT"))
      ) {
        setDraftGenerated(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I encountered an error. Please check that the ANTHROPIC_API_KEY is configured and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const apiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const data = await callApi(apiMessages, "generate-draft");
      const cleanResponse = processResponse(data.response);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cleanResponse,
          timestamp: new Date(),
        },
      ]);
      setDraftGenerated(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Failed to generate the draft. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportDraft = () => {
    const draftMessages = messages.filter(
      (m) => m.role === "assistant" && m.content.length > 500
    );
    const lastDraft = draftMessages[draftMessages.length - 1];
    if (lastDraft) {
      const blob = new Blob([lastDraft.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `provisional-patent-${patent.id}-${patent.shortTitle.replace(/\s+/g, "-").toLowerCase()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Count exchanges (user messages)
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showGenerateButton = !draftGenerated && userMessageCount >= 3;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(42, 40, 40, 0.6)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full md:w-[520px] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Red accent stripe */}
        <div className="h-1" style={{ backgroundColor: "#E24D47" }} />

        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ backgroundColor: "#2A2828" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#E24D4720" }}
            >
              <FileText size={16} style={{ color: "#E24D47" }} />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                Provisional Patent Drafter
              </p>
              <p className="text-white/50 text-[11px] truncate">
                {patent.shortTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={18} className="text-white/60" />
          </button>
        </div>

        {/* Progress bar */}
        <div
          className="px-5 py-3 flex items-center gap-2 border-b shrink-0"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <p
            className="text-[9px] font-bold uppercase tracking-wider shrink-0 mr-1"
            style={{ color: "var(--muted)" }}
          >
            Draft
          </p>
          {PROGRESS_SECTIONS.map((section) => {
            const isComplete = completedSections.has(section.key);
            return (
              <div
                key={section.key}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full h-1.5 rounded-full transition-colors duration-500"
                  style={{
                    backgroundColor: isComplete ? "#E24D47" : "var(--border)",
                  }}
                />
                <span
                  className="text-[8px] font-medium uppercase tracking-wider"
                  style={{
                    color: isComplete ? "#E24D47" : "var(--muted-light)",
                  }}
                >
                  {section.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--border)" }}
                  >
                    <Bot size={14} style={{ color: "#E24D47" }} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    msg.role === "user" ? "text-white" : ""
                  }`}
                  style={{
                    backgroundColor:
                      msg.role === "user" ? "#E24D47" : "var(--surface)",
                    border:
                      msg.role === "assistant"
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <p className="text-[13px] whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--border)" }}
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
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <Bot size={14} style={{ color: "#E24D47" }} />
                </div>
                <div
                  className="rounded-xl px-4 py-3 border"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                  }}
                >
                  <Loader2
                    size={16}
                    className="animate-spin"
                    style={{ color: "var(--muted)" }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t shrink-0 space-y-3"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          {/* Generate Draft button */}
          {showGenerateButton && (
            <button
              onClick={handleGenerateDraft}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "#E24D47" }}
            >
              <Sparkles size={15} />
              Generate Provisional Draft
            </button>
          )}

          {/* Export Draft button */}
          {draftGenerated && (
            <button
              onClick={handleExportDraft}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors"
              style={{
                borderColor: "#E24D47",
                color: "#E24D47",
                backgroundColor: "#E24D4708",
              }}
            >
              <Download size={15} />
              Export Draft (.txt)
            </button>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Answer questions or ask for clarification..."
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#E24D47]/30"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--background)",
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "#E24D47" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
