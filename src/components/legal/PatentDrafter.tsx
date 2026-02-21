"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Loader2,
  Bot,
  User,
  FileText,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";
import type { PatentOpportunity } from "./IPOpportunities";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PatentDrafterProps {
  opportunity: PatentOpportunity;
  onBack: () => void;
}

export default function PatentDrafter({ opportunity, onBack }: PatentDrafterProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the conversation automatically
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: buildInitialPrompt(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Fallback intro
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: getFallbackIntro(),
            timestamp: new Date(),
          },
        ]);
      }
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
    }
  };

  const buildInitialPrompt = () => {
    return `You are acting as a patent attorney helping draft a provisional patent application for Conceivable, a women's health technology company.

CONTEXT:
- Company: Conceivable (conceivable.com), founded by Kirsten Karchmer
- Products: Health app, supplements, wearable device
- Existing IP: Patented AI/ML methods for fertility prediction using basal body temperature (BBT) analysis across five predictive categories (energy, blood, temperature, stress, hormones). Trained on 500K+ BBT charts from 7,000+ patients. The "Kirsten AI" prediction engine.
- Target audience: Women 20-40

PATENT OPPORTUNITY TO DRAFT:
Title: ${opportunity.title}
Category: ${opportunity.category}
Description: ${opportunity.description}
Potential Claims:
${opportunity.claims.map((c, i) => `${i + 1}. ${c}`).join("\n")}
Prior Art Risk: ${opportunity.priorArtRisk}
Relationship to existing patent: ${opportunity.existingCoverage}
Rationale: ${opportunity.rationale}

YOUR TASK:
You need to gather information from the founder to draft a strong provisional patent application. Start by:
1. Briefly confirming the patent opportunity and why it matters
2. Then ask your FIRST set of questions (2-3 specific questions) to gather the technical details needed

Important question areas to cover across the conversation:
- Specific technical implementation details (how does the system actually work?)
- What data inputs are used? What algorithms or models?
- What makes this approach novel vs. existing solutions?
- Any prototypes, working implementations, or test data?
- Specific use cases and examples
- Inventor details (who contributed to the invention?)

Be conversational but thorough. Ask 2-3 questions at a time, not all at once. After gathering enough information (typically 3-4 rounds of Q&A), offer to generate the provisional patent draft.

Start now with your introduction and first questions.`;
  };

  const getFallbackIntro = () => {
    return `Great choice — "${opportunity.title}" is a strong patent opportunity.

Before I draft the provisional application, I need to gather some technical details from you. Let me start with a few questions:

1. **Technical Implementation**: Can you describe how this system would work at a technical level? Walk me through the data flow — what inputs go in, what processing happens, and what outputs come out?

2. **Novelty**: What specifically makes your approach different from anything else on the market? Are there particular algorithms, data combinations, or methodologies that are unique to Conceivable?

3. **Current Status**: Do you have a working prototype, proof of concept, or test data for this? Or is this still at the concept/design stage?

Take your time — the more detail you provide, the stronger the provisional application will be.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Build conversation context
      const conversationHistory = [...messages, userMessage]
        .map((m) => `${m.role === "user" ? "FOUNDER" : "PATENT ADVISOR"}: ${m.content}`)
        .join("\n\n");

      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are acting as a patent attorney drafting a provisional patent application for "${opportunity.title}" for Conceivable (women's health tech company, founder Kirsten Karchmer).

CONVERSATION SO FAR:
${conversationHistory}

Continue the conversation. Based on the founder's answers:
- If you still need more information, ask 2-3 follow-up questions to fill gaps
- If you have enough information to draft, say "I now have enough information to draft the provisional patent application" and ask if they'd like you to proceed
- When drafting, produce a complete provisional patent application with: Title, Field of Invention, Background, Summary, Detailed Description, Claims (independent and dependent), and Abstract

Respond as the patent advisor now:`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Check if a draft was generated
        if (
          data.response.includes("PROVISIONAL PATENT APPLICATION") ||
          data.response.includes("Field of Invention") ||
          data.response.includes("CLAIMS") ||
          data.response.includes("Detailed Description")
        ) {
          setDraftGenerated(true);
        }
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I encountered an error. Please check that the ANTHROPIC_API_KEY is configured and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setLoading(true);

    const conversationHistory = messages
      .map((m) => `${m.role === "user" ? "FOUNDER" : "PATENT ADVISOR"}: ${m.content}`)
      .join("\n\n");

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "legal",
          message: `You are a patent attorney. Based on the following conversation about "${opportunity.title}" for Conceivable (women's health tech, founder Kirsten Karchmer), generate a COMPLETE provisional patent application.

CONVERSATION:
${conversationHistory}

PATENT OPPORTUNITY DETAILS:
${opportunity.description}
Claims guidance: ${opportunity.claims.join("; ")}

Now generate the full provisional patent application with these sections:

PROVISIONAL PATENT APPLICATION

TITLE: [Descriptive title]

FIELD OF INVENTION
[1 paragraph]

CROSS-REFERENCE TO RELATED APPLICATIONS
[Reference existing Conceivable BBT prediction patent if applicable]

BACKGROUND OF THE INVENTION
[2-3 paragraphs on the problem space and limitations of existing solutions]

SUMMARY OF THE INVENTION
[2-3 paragraphs summarizing the invention]

DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS
[Thorough technical description, 5+ paragraphs, with specific implementation details from the conversation]

CLAIMS
[At least 3 independent claims and 5+ dependent claims. Make claims as broad as defensible, with narrower dependent claims]

ABSTRACT
[150 words max]

Write the complete application now. Be thorough and technically precise.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const draftMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, draftMessage]);
        setDraftGenerated(true);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to generate the draft. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    const draftMessages = messages.filter(
      (m) => m.role === "assistant" && m.content.length > 500
    );
    const lastDraft = draftMessages[draftMessages.length - 1];
    if (lastDraft) {
      navigator.clipboard.writeText(lastDraft.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-black/5"
          >
            <ArrowLeft size={18} style={{ color: "var(--muted)" }} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <FileText size={16} style={{ color: "var(--brand-primary)" }} />
              <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                Provisional Patent Drafter
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {opportunity.title}
            </p>
          </div>
        </div>

        {draftGenerated && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={12} style={{ color: "var(--status-success)" }} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy Draft
                </>
              )}
            </button>
            <button
              onClick={() => {
                const draftMessages = messages.filter(
                  (m) => m.role === "assistant" && m.content.length > 500
                );
                const lastDraft = draftMessages[draftMessages.length - 1];
                if (lastDraft) {
                  const blob = new Blob([lastDraft.content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `provisional-patent-${opportunity.id}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <Download size={12} />
              Download
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6 max-w-3xl">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--border-light)" }}
                >
                  <Bot size={16} style={{ color: "var(--brand-primary)" }} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user" ? "text-white" : ""
                }`}
                style={{
                  backgroundColor:
                    msg.role === "user" ? "var(--brand-primary)" : "var(--surface)",
                  border:
                    msg.role === "assistant" ? "1px solid var(--border)" : "none",
                }}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
              {msg.role === "user" && (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--border-light)" }}
                >
                  <User size={16} style={{ color: "var(--muted)" }} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--border-light)" }}
              >
                <Bot size={16} style={{ color: "var(--brand-primary)" }} />
              </div>
              <div
                className="rounded-xl px-4 py-3 border"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
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

      {/* Input + Generate Draft */}
      <div
        className="px-6 py-4 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        {!draftGenerated && messages.length >= 4 && (
          <button
            onClick={handleGenerateDraft}
            disabled={loading}
            className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--status-success)" }}
          >
            <FileText size={16} />
            Generate Provisional Patent Draft
          </button>
        )}
        <div className="flex gap-3 max-w-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Answer the questions or ask for clarification..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
