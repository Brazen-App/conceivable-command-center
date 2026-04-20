"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface KaiChatContext {
  score?: number;
  categoryScores?: Record<string, { score: number; maxScore: number; percentage: number }>;
  interpretation?: { label: string; description: string; color: string };
  email?: string;
}

interface KaiChatModalProps {
  onClose: () => void;
  userName?: string;
  context?: KaiChatContext;
}

const STARTER_QUESTIONS = [
  { emoji: "👅", text: "Analyze my tongue photo" },
  { emoji: "🌡️", text: "Help me understand my cycle" },
  { emoji: "🥗", text: "What should I eat for fertility?" },
  { emoji: "😰", text: "I'm stressed — is that affecting my fertility?" },
];

const MID_CHAT_SUGGESTIONS = [
  [
    { emoji: "📸", text: "I want to try the tongue analysis!" },
    { emoji: "💤", text: "How does sleep affect fertility?" },
    { emoji: "🏃‍♀️", text: "Am I exercising too much or too little?" },
  ],
  [
    { emoji: "🧬", text: "What does my AMH/FSH mean?" },
    { emoji: "🍷", text: "Real talk — how bad is alcohol?" },
    { emoji: "💊", text: "What supplements actually matter?" },
  ],
  [
    { emoji: "🧘", text: "What can I do to reduce stress?" },
    { emoji: "📅", text: "When should I be having sex?" },
    { emoji: "🤰", text: "How long should I try before seeing a doctor?" },
  ],
];

const DAILY_LIMIT = 20;

export default function KaiChatModal({ onClose, userName, context }: KaiChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(context?.email || "");
  const [emailConfirmed, setEmailConfirmed] = useState(!!context?.email);
  const [firstName, setFirstName] = useState(userName || "");
  const [messagesRemaining, setMessagesRemaining] = useState(DAILY_LIMIT);
  const [hitLimit, setHitLimit] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(`kai_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (emailConfirmed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [emailConfirmed]);

  // Which set of mid-chat suggestions to show (rotate based on message count)
  const suggestionSet = Math.floor(messages.filter((m) => m.role === "user").length / 3) % MID_CHAT_SUGGESTIONS.length;
  const showSuggestions = messages.length > 0 && messages.length < 12 && !loading && !hitLimit;

  const sendMessage = useCallback(
    async (text: string, imageData?: { base64: string; mimeType: string }) => {
      if (!text.trim() || loading || hitLimit) return;

      const userMsg: Message = { role: "user", content: imageData ? `📸 ${text}` : text };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const body: Record<string, unknown> = {
          message: text,
          history: messages,
          context: {
            userName: firstName || userName,
            sessionId: sessionId.current,
            ...context,
            email,
          },
        };
        if (imageData) {
          body.image = imageData;
        }

        const res = await fetch("/api/kai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.status === 429 && data.error === "daily_limit") {
          setHitLimit(true);
          setLimitMessage(data.message);
          setMessagesRemaining(0);
          setMessages([...newMessages, { role: "assistant", content: data.message }]);
          return;
        }

        if (res.ok) {
          setMessages([...newMessages, { role: "assistant", content: data.response }]);
          if (data.messagesRemaining !== undefined) {
            setMessagesRemaining(data.messagesRemaining);
          }
        } else {
          setMessages([
            ...newMessages,
            { role: "assistant", content: "Sorry, something went wrong. Please try again." },
          ]);
        }
      } catch {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, hitLimit, firstName, userName, context, email]
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip the data:image/...;base64, prefix
        const base64 = result.split(",")[1];
        sendMessage(
          "Here's a photo of my tongue — can you analyze it from a TCM fertility perspective?",
          { base64, mimeType: file.type }
        );
      };
      reader.readAsDataURL(file);
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [sendMessage]
  );

  const handleSuggestionClick = (text: string) => {
    if (text.includes("tongue") || text.includes("Analyze my tongue")) {
      fileInputRef.current?.click();
    } else {
      sendMessage(text);
    }
  };

  const displayName = firstName || userName;
  const greeting = displayName ? `Hi ${displayName}! I'm Kai.` : `Hi! I'm Kai.`;

  const handleEmailSubmit = () => {
    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) return;
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) return;
    setEmailConfirmed(true);
  };

  const nameValid = firstName.trim().length > 0;
  const emailValid = email.includes("@") && email.includes(".");
  const formReady = nameValid && emailValid;

  // ── Hidden file input for tongue photos ──────────────────
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      className="hidden"
      onChange={handleImageUpload}
    />
  );

  // ── Email + name gate screen ───────────────────────────────
  if (!emailConfirmed) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#FFFEFA" }}>
        {fileInput}
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
          style={{ borderColor: "#E8E5DC", background: "#FFFEFA" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base"
            style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)" }}
          >
            ✦
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: "#2A2828" }}>Kai</div>
            <div className="text-xs" style={{ color: "#9CA3AF" }}>AI Fertility Coach</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#F3F4F6" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Gate content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
              style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)" }}
            >
              ✦
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#2A2828" }}>
              Let&apos;s get to know each other
            </h2>
            <p className="text-sm mb-2" style={{ color: "#6B7280", lineHeight: 1.6 }}>
              Kai is your free AI fertility coach. She&apos;ll learn about your unique situation and help you understand your body better.
            </p>
            <p className="text-xs mb-6" style={{ color: "#9CA3AF", lineHeight: 1.5 }}>
              Ask about your cycle, get a tongue analysis, learn what foods help — no sales pitch, just real talk.
            </p>

            <input
              ref={nameInputRef}
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name *"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-3"
              style={{ background: "#F3F4F6", border: "2px solid transparent", color: "#2A2828" }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              placeholder="Email address *"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
              style={{ background: "#F3F4F6", border: "2px solid transparent", color: "#2A2828" }}
              onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
            <button
              onClick={handleEmailSubmit}
              disabled={!formReady}
              className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all"
              style={{
                background: formReady ? "#5A6FFF" : "#E8E5DC",
                color: formReady ? "#fff" : "#9CA3AF",
                border: "none",
                cursor: formReady ? "pointer" : "default",
              }}
            >
              Chat with Kai — it&apos;s free
            </button>
            <p className="text-xs mt-4" style={{ color: "#9CA3AF" }}>
              {DAILY_LIMIT} messages per day, totally free. No credit card needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#FFFEFA" }}>
      {fileInput}

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b shrink-0"
        style={{ borderColor: "#E8E5DC", background: "#FFFEFA" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base"
          style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)" }}
        >
          ✦
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm" style={{ color: "#2A2828" }}>Kai</div>
          <div className="text-xs" style={{ color: "#9CA3AF" }}>AI Fertility Coach</div>
        </div>
        {/* Messages remaining badge */}
        <div
          className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: messagesRemaining <= 3 ? "#FEF2F2" : "#F0FDF4",
            color: messagesRemaining <= 3 ? "#E24D47" : "#1EAA55",
          }}
        >
          {messagesRemaining} left today
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ background: "#F3F4F6" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Kai intro */}
        <div className="flex gap-2.5 items-start">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5"
            style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)", color: "#fff" }}
          >
            ✦
          </div>
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-xs"
            style={{ background: "#F3F4F6", color: "#2A2828", lineHeight: 1.6 }}
          >
            {greeting} I&apos;m here to learn about you and your fertility journey — no sales pitch, just real conversation. What brings you here today?
          </div>
        </div>

        {/* Starter suggestion buttons */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pl-9">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q.text}
                onClick={() => handleSuggestionClick(q.text)}
                className="text-xs px-3 py-2 rounded-full border transition-all hover:shadow-sm"
                style={{
                  borderColor: "#ACB7FF",
                  color: "#5A6FFF",
                  background: "rgba(90, 111, 255, 0.04)",
                }}
              >
                {q.emoji} {q.text}
              </button>
            ))}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5"
                style={{
                  background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)",
                  color: "#fff",
                }}
              >
                ✦
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-3 text-sm max-w-xs md:max-w-sm ${
                msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
              }`}
              style={{
                background: msg.role === "user" ? "#5A6FFF" : "#F3F4F6",
                color: msg.role === "user" ? "#fff" : "#2A2828",
                lineHeight: 1.6,
              }}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none kai-markdown">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Mid-chat suggestion chips (after every assistant response, first ~12 messages) */}
        {showSuggestions && messages[messages.length - 1]?.role === "assistant" && (
          <div className="flex flex-wrap gap-2 pl-9">
            {MID_CHAT_SUGGESTIONS[suggestionSet].map((q) => (
              <button
                key={q.text}
                onClick={() => handleSuggestionClick(q.text)}
                className="text-[11px] px-2.5 py-1.5 rounded-full border transition-all hover:shadow-sm"
                style={{
                  borderColor: "#E8E5DC",
                  color: "#6B7280",
                  background: "rgba(90, 111, 255, 0.02)",
                }}
              >
                {q.emoji} {q.text}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2.5 items-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5"
              style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)", color: "#fff" }}
            >
              ✦
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: "#F3F4F6" }}>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "#9CA3AF",
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: "0.8s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className="shrink-0 px-4 py-3 border-t"
        style={{ borderColor: "#E8E5DC", background: "#FFFEFA" }}
      >
        {hitLimit ? (
          <div className="text-center py-2">
            <p className="text-sm font-medium mb-1" style={{ color: "#2A2828" }}>
              That&apos;s a wrap for today!
            </p>
            <p className="text-xs" style={{ color: "#9CA3AF", lineHeight: 1.5 }}>
              {limitMessage || `You've used your ${DAILY_LIMIT} free messages. Kai will be back tomorrow — same time, same place.`}
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              {/* Camera/photo button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: "#F3F4F6",
                  border: "none",
                  opacity: loading ? 0.5 : 1,
                }}
                title="Upload tongue photo for analysis"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask Kai anything..."
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "#F3F4F6",
                  border: "2px solid transparent",
                  color: "#2A2828",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: loading || !input.trim() ? "#E8E5DC" : "#5A6FFF",
                  border: "none",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 2L5 8L2 14L14 8Z" fill={loading || !input.trim() ? "#9CA3AF" : "#fff"} />
                </svg>
              </button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: "#9CA3AF" }}>
              Kai is an AI coach — not a substitute for medical advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
