"use client";

interface KaiChatPromptProps {
  userName?: string;
  onChatOpen: () => void;
}

export default function KaiChatPrompt({ userName, onChatOpen }: KaiChatPromptProps) {
  const greeting = userName
    ? `${userName}, have questions about your results?`
    : "Have questions about your results?";

  return (
    <div
      className="w-full rounded-2xl p-5 mb-6"
      style={{
        background: "linear-gradient(135deg, rgba(90, 111, 255, 0.05) 0%, rgba(172, 183, 255, 0.08) 100%)",
        border: "1px solid rgba(90, 111, 255, 0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base"
          style={{
            background: "linear-gradient(135deg, #5A6FFF 0%, #ACB7FF 100%)",
            color: "#fff",
          }}
        >
          ✦
        </div>
        <div>
          <div
            className="font-semibold text-sm"
            style={{ color: "#2A2828" }}
          >
            Kai
          </div>
          <div className="text-xs" style={{ color: "#9CA3AF" }}>
            AI Fertility Coach
          </div>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: "#2A2828", lineHeight: 1.6 }}>
        <span className="font-medium">{greeting}</span> I&apos;ve seen your score and I&apos;m ready
        to walk you through what it means, what to do next, and anything else on your mind.
      </p>

      <button
        onClick={onChatOpen}
        className="w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(90, 111, 255, 0.25)",
        }}
      >
        Chat with Kai
      </button>
    </div>
  );
}
