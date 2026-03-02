"use client";

import { Brain, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface KirstenBrainProps {
  totalPOVs: number;
  topicCount: number;
  topTopics: string[];
}

export default function KirstenBrain({
  totalPOVs,
  topicCount,
  topTopics,
}: KirstenBrainProps) {
  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background:
          "linear-gradient(135deg, #5A6FFF08 0%, #ACB7FF08 50%, #78C3BF08 100%)",
        border: "2px solid #5A6FFF18",
      }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 flex-1 min-w-[250px]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#5A6FFF14" }}
          >
            <Brain size={20} style={{ color: "#5A6FFF" }} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Kirsten Brain
              </h3>
              <Sparkles size={14} style={{ color: "#5A6FFF" }} />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              <span className="font-semibold" style={{ color: "#5A6FFF" }}>
                {totalPOVs} POVs
              </span>{" "}
              recorded across{" "}
              <span className="font-semibold" style={{ color: "#5A6FFF" }}>
                {topicCount} topics
              </span>{" "}
              — your AI voice model is getting stronger
            </p>

            {/* Top topic pills */}
            {topTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {topTopics.slice(0, 6).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: "#5A6FFF10",
                      color: "#5A6FFF",
                      border: "1px solid #5A6FFF20",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link
          href="/departments/content/knowledge"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 hover:shadow-sm shrink-0"
          style={{
            backgroundColor: "#5A6FFF",
            color: "#FFFFFF",
          }}
        >
          Explore
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
