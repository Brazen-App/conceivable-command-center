"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Mic,
  MicOff,
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

/**
 * Convert markdown-formatted text to simple HTML for rendering.
 * Handles bold, italic, headers, numbered lists, and bullet lists.
 */
function renderMarkdown(text: string): string {
  return text
    // Headers: ### Header → <strong>Header</strong>
    .replace(/^#{1,4}\s+(.+)$/gm, "<strong>$1</strong>")
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic: *text* → <em>text</em>
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    // Bullet lists: - item → • item
    .replace(/^- (.+)$/gm, "  • $1")
    // Newlines to <br> for whitespace preservation
    .replace(/\n/g, "<br>");
}

export default function PatentDrafter({ opportunity, onBack }: PatentDrafterProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
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
        // Check if the response is actually about this patent (not a generic demo response)
        const response = data.response as string;
        const isPatentRelevant =
          response.includes(opportunity.title) ||
          response.includes("patent") ||
          response.includes("provisional") ||
          response.includes("claims") ||
          response.includes("invention") ||
          response.includes("prior art");

        setMessages([
          {
            id: "1",
            role: "assistant",
            content: isPatentRelevant ? response : getFallbackIntro(),
            timestamp: new Date(),
          },
        ]);
      } else {
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

FORMATTING: Use plain text only. Do not use markdown formatting like ** or ##. Use numbered lists for questions. Keep it conversational and clean.

Be conversational but thorough. Ask 2-3 questions at a time, not all at once. After gathering enough information (typically 3-4 rounds of Q&A), offer to generate the provisional patent draft.

Start now with your introduction and first questions.`;
  };

  const getFallbackIntro = () => {
    return `Great choice \u2014 "${opportunity.title}" is a strong patent opportunity.

${opportunity.description}

Before I draft the provisional application, I need to gather some technical details from you. Let me start with a few questions:

1. Technical Implementation: Can you describe how this system would work at a technical level? Walk me through the data flow \u2014 what inputs go in, what processing happens, and what outputs come out?

2. Novelty: What specifically makes your approach different from anything else on the market? Are there particular algorithms, data combinations, or methodologies that are unique to Conceivable?

3. Current Status: Do you have a working prototype, proof of concept, or test data for this? Or is this still at the concept/design stage?

Take your time \u2014 the more detail you provide, the stronger the provisional application will be.`;
  };

  const getFallbackFollowUp = (userMessage: string) => {
    const msgCount = messages.filter((m) => m.role === "user").length;

    if (msgCount <= 1) {
      return `Thanks for those details about "${opportunity.title}." That gives me a solid foundation.

Let me dig deeper with a few follow-up questions:

1. Data Sources: What specific data signals or inputs does this system use? For example, are you combining BBT data, HRV, questionnaire responses, supplement adherence, or other signals?

2. Algorithm Details: Can you describe the specific algorithms, models, or logic that process this data? Is it rule-based, ML-based, or a hybrid approach?

3. Integration: How does this relate to your existing Kirsten AI prediction engine? Does it extend the same model, or is it a separate system that feeds into it?`;
    }

    if (msgCount <= 2) {
      return `Excellent \u2014 this is very helpful for building strong claims. A couple more questions:

1. Inventor Contributions: Who are the key inventors who contributed to the conception of this technology? Were there specific "aha moments" or breakthroughs that led to this approach?

2. Real-World Validation: Do you have any clinical data, user testing results, or case studies that demonstrate this system works? Even preliminary data strengthens a provisional filing.

3. Competitive Landscape: Are you aware of any competitors or existing patents that cover similar territory? This helps me frame the claims to maximize novelty.`;
    }

    return `I now have enough information to draft the provisional patent application for "${opportunity.title}."

Based on what you've shared, I can see several strong angles for independent claims around the core method, the system architecture, and the data processing pipeline.

Would you like me to proceed with generating the full provisional patent draft? You can click the "Generate Provisional Patent Draft" button below, or share any additional details you'd like me to include first.`;
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

Patent description: ${opportunity.description}
Potential claims: ${opportunity.claims.join("; ")}

CONVERSATION SO FAR:
${conversationHistory}

Continue the conversation. Based on the founder's answers:
- If you still need more information, ask 2-3 follow-up questions to fill gaps
- If you have enough information to draft, say "I now have enough information to draft the provisional patent application" and ask if they'd like you to proceed
- When drafting, produce a complete provisional patent application with: Title, Field of Invention, Background, Summary, Detailed Description, Claims (independent and dependent), and Abstract

FORMATTING: Use plain text only. No markdown ** or ##. Use numbered lists. Be conversational and clean.

Respond as the patent advisor now:`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const response = data.response as string;

        // Check if response is relevant to the patent conversation
        const isRelevant =
          response.includes("patent") ||
          response.includes("claim") ||
          response.includes("invention") ||
          response.includes("provisional") ||
          response.includes("?") ||
          response.includes(opportunity.title);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: isRelevant ? response : getFallbackFollowUp(input),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Check if a draft was generated
        if (
          response.includes("PROVISIONAL PATENT APPLICATION") ||
          response.includes("Field of Invention") ||
          response.includes("CLAIMS") ||
          response.includes("Detailed Description")
        ) {
          setDraftGenerated(true);
        }
      } else {
        // API returned an error — use contextual fallback
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getFallbackFollowUp(input),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I encountered a connection error. Let me continue with what I have.\n\n" +
          getFallbackFollowUp(input),
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
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "The draft generation failed. Please try again — the AI service may be temporarily unavailable.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to generate the draft. Please check your connection and try again.",
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

  // Speech recognition via Web Speech API
  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setInput((prev) =>
        prev
          ? prev
          : "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = input;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim = transcript;
        }
      }
      setInput(finalTranscript + (interim ? " " + interim : ""));
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, input]);

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
                {msg.role === "assistant" ? (
                  <div
                    className="text-sm leading-relaxed [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                )}
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
            onClick={toggleListening}
            disabled={loading}
            className={`px-3 py-2.5 rounded-xl border disabled:opacity-50 ${
              listening ? "ring-2 ring-red-400" : ""
            }`}
            style={{
              borderColor: listening ? "#EF4444" : "var(--border)",
              backgroundColor: listening ? "#FEF2F2" : "var(--background)",
              color: listening ? "#EF4444" : "var(--muted)",
            }}
            title={listening ? "Stop recording" : "Start voice input"}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            <Send size={16} />
          </button>
        </div>
        {listening && (
          <p className="text-xs mt-2" style={{ color: "#EF4444" }}>
            Listening... speak now. Click the mic button to stop.
          </p>
        )}
      </div>
    </div>
  );
}
