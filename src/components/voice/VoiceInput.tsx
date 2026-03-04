"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Send, Loader2, Bot, User } from "lucide-react";

// Web Speech API types (not in all TS libs)
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function VoiceInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Voice input is not supported in this browser. Try Chrome or Edge.",
        },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
        setInput((prev) => prev + finalTranscript);
      } else if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = () => {
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setTranscript("");
  }, [stopRecording]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTranscript("");
    setLoading(true);

    // Stop recording when sending
    if (isRecording) stopRecording();

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "executive-coach",
          message: text,
        }),
      });

      const data = await res.json();
      const responseText = res.ok
        ? data.response
        : "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: responseText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Connection error. Please check your internet and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Closed state: just the floating mic button
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 200);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: "#5A6FFF" }}
        title="Talk to Joy"
      >
        <Mic size={22} />
      </button>
    );
  }

  // Open state: chat panel
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[520px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ backgroundColor: "#5A6FFF", color: "white" }}
      >
        <div className="flex items-center gap-2">
          <Mic size={16} />
          <span className="text-sm font-semibold">Talk to Joy</span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            if (isRecording) stopRecording();
          }}
          className="p-1 rounded-lg hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[200px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Bot size={28} style={{ color: "#5A6FFF" }} className="mb-2" />
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Tap the mic to talk, or type your message below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "#5A6FFF10" }}
                  >
                    <Bot size={12} style={{ color: "#5A6FFF" }} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user" ? "text-white" : ""
                  }`}
                  style={{
                    backgroundColor: msg.role === "user" ? "#5A6FFF" : "var(--background)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                  }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--border-light)" }}
                  >
                    <User size={12} style={{ color: "var(--muted)" }} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#5A6FFF10" }}
                >
                  <Bot size={12} style={{ color: "#5A6FFF" }} />
                </div>
                <div
                  className="rounded-xl px-3 py-2 border"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                  <Loader2 size={12} className="animate-spin" style={{ color: "var(--muted)" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div
          className="px-4 py-2 text-xs flex items-center gap-2"
          style={{ backgroundColor: "#E24D4710", color: "#E24D47" }}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Recording{transcript ? `: "${transcript}"` : "..."}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 py-3 border-t shrink-0"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="p-2 rounded-lg shrink-0 transition-colors"
          style={{
            backgroundColor: isRecording ? "#E24D4718" : "#5A6FFF14",
            color: isRecording ? "#E24D47" : "#5A6FFF",
          }}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask Joy anything..."
          className="flex-1 px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="p-2 rounded-lg text-white disabled:opacity-50 shrink-0"
          style={{ backgroundColor: "#5A6FFF" }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
