"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, User, Sparkles, Mic, MicOff } from "lucide-react";
import { AgentConfig } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  config: AgentConfig;
  /** When true, uses flex-1 instead of fixed viewport height (for nesting inside other views) */
  embedded?: boolean;
}

function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) onResult(transcript);
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, [onResult]);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening]);

  return { listening, supported, toggle };
}

export default function AgentChat({ config, embedded }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSpeechResult = useCallback(
    (text: string) => setInput((prev) => (prev ? prev + " " + text : text)),
    []
  );
  const { listening, supported: speechSupported, toggle: toggleSpeech } =
    useSpeechRecognition(handleSpeechResult);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: config.id,
          message: input,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${data.error || "Something went wrong"}. Please check that the ANTHROPIC_API_KEY environment variable is set and try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I encountered a network error processing your request. Please check that the ANTHROPIC_API_KEY is configured and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${embedded ? "flex-1 min-h-0" : "h-[calc(100vh-73px)]"}`}>
      {/* Agent Info Bar */}
      <div
        className="px-8 py-3 border-b flex items-center gap-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <Sparkles size={16} style={{ color: "var(--brand-primary)" }} />
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {config.capabilities.join(" · ")}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--border-light)" }}
            >
              <Bot size={28} style={{ color: "var(--brand-primary)" }} />
            </div>
            <h3 className="font-medium mb-2" style={{ color: "var(--foreground)" }}>
              {config.name}
            </h3>
            <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
              {config.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 max-w-lg justify-center">
              {getSuggestions(config.id).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full border hover:shadow-sm"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
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
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === "user" ? "text-white/60" : ""
                    }`}
                    style={msg.role === "assistant" ? { color: "var(--muted-light)" } : {}}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  <Loader2 size={16} className="animate-spin" style={{ color: "var(--muted)" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-8 py-4 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex gap-2 max-w-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Message ${config.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            disabled={loading}
          />
          <button
            onClick={speechSupported ? toggleSpeech : undefined}
            disabled={!speechSupported}
            className={`px-3 py-2.5 rounded-xl border transition-colors ${
              listening ? "text-white" : ""
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            style={{
              borderColor: listening ? "transparent" : "var(--border)",
              backgroundColor: listening ? "#EF4444" : "var(--background)",
              color: listening ? "white" : "var(--muted)",
            }}
            title={
              !speechSupported
                ? "Voice input requires Chrome or Edge"
                : listening
                  ? "Stop listening"
                  : "Voice input"
            }
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
      </div>
    </div>
  );
}

function getSuggestions(agentId: string): string[] {
  const suggestions: Record<string, string[]> = {
    "executive-coach": [
      "What should I prioritize this week?",
      "Help me think through our launch strategy",
      "I'm struggling with a hiring decision",
      "Review my Q1 metrics and goals",
    ],
    marketing: [
      "Draft a launch campaign brief",
      "What channels should we prioritize?",
      "Analyze our target audience segments",
      "Help with influencer partnership strategy",
    ],
    legal: [
      "Review our supplement labels for FDA compliance",
      "What HIPAA requirements apply to our app?",
      "Draft a user data privacy policy",
      "Flag risks in our health claims",
    ],
    "scientific-research": [
      "Summarize latest research on CoQ10 and fertility",
      "Validate our supplement formulation",
      "What does the evidence say about PCOS and diet?",
      "Review claims for our marketing copy",
    ],
  };

  return suggestions[agentId] ?? ["Ask me anything..."];
}
