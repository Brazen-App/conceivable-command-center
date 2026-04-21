"use client";

import { useState, useRef, useEffect } from "react";

export default function KaiTestPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start conversation
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("hi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = text === "hi" && messages.length === 0 ? [userMsg] : [...messages, userMsg];
    if (text !== "hi" || messages.length > 0) {
      setMessages(newMessages);
    }
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/kai-test-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: newMessages.slice(0, -1) }),
      });

      const data = await res.json();
      const kaiMsg = { role: "assistant", content: data.response || data.error || "No response" };

      if (text === "hi" && messages.length === 0) {
        setMessages([kaiMsg]);
      } else {
        setMessages([...newMessages, kaiMsg]);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Error — check the console." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)", margin: "0 0 4px" }}>
          Kai Supplement Coach — Test Chat
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
          This is a test interface. Kai uses the live supplement prompt. No data is saved.
        </p>
      </div>

      <div
        style={{
          background: "#141428",
          borderRadius: 16,
          padding: 20,
          minHeight: 400,
          maxHeight: "60vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "#5A6FFF" : "rgba(251,229,210,0.1)",
                border: msg.role === "user" ? "none" : "1px solid rgba(251,229,210,0.14)",
                color: msg.role === "user" ? "#fff" : "#FBE5D2",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                maxWidth: "85%",
                fontSize: 14,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "rgba(251,229,210,0.1)",
                border: "1px solid rgba(251,229,210,0.14)",
                color: "#A89B88",
                padding: "10px 14px",
                borderRadius: "16px 16px 16px 4px",
                fontSize: 14,
              }}
            >
              thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type a message..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontSize: 14,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            background: "#5A6FFF",
            color: "#fff",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading || !input.trim() ? "default" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            fontFamily: "inherit",
          }}
        >
          Send
        </button>
      </div>

      <button
        onClick={() => {
          setMessages([]);
          setTimeout(() => sendMessage("hi"), 100);
        }}
        style={{
          marginTop: 12,
          padding: "8px 16px",
          borderRadius: 8,
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Reset conversation
      </button>
    </div>
  );
}
