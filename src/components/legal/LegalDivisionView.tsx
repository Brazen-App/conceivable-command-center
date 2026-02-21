"use client";

import { useState } from "react";
import { Scale, MessageSquare, Shield } from "lucide-react";
import AgentChat from "@/components/agents/AgentChat";
import IPOpportunities from "./IPOpportunities";
import PatentDrafter from "./PatentDrafter";
import type { PatentOpportunity } from "./IPOpportunities";
import { AgentConfig } from "@/types";

type View = "main" | "drafter";

interface LegalDivisionViewProps {
  config: AgentConfig;
}

export default function LegalDivisionView({ config }: LegalDivisionViewProps) {
  const [view, setView] = useState<View>("main");
  const [selectedOpportunity, setSelectedOpportunity] = useState<PatentOpportunity | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "ip">("ip");

  const handleSelectOpportunity = (opp: PatentOpportunity) => {
    setSelectedOpportunity(opp);
    setView("drafter");
  };

  const handleBackFromDrafter = () => {
    setView("main");
    setSelectedOpportunity(null);
  };

  if (view === "drafter" && selectedOpportunity) {
    return (
      <div className="h-[calc(100vh-73px)]">
        <PatentDrafter opportunity={selectedOpportunity} onBack={handleBackFromDrafter} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Tab Navigation */}
      <div
        className="px-8 border-b flex items-center gap-1"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <button
          onClick={() => setActiveTab("ip")}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px"
          style={{
            borderColor: activeTab === "ip" ? "var(--brand-primary)" : "transparent",
            color: activeTab === "ip" ? "var(--brand-primary)" : "var(--muted)",
          }}
        >
          <Shield size={15} />
          IP Opportunities
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px"
          style={{
            borderColor: activeTab === "chat" ? "var(--brand-primary)" : "transparent",
            color: activeTab === "chat" ? "var(--brand-primary)" : "var(--muted)",
          }}
        >
          <MessageSquare size={15} />
          Legal Chat
        </button>
      </div>

      {/* Content */}
      {activeTab === "ip" ? (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <IPOpportunities onSelectOpportunity={handleSelectOpportunity} />
        </div>
      ) : (
        <AgentChat config={config} />
      )}
    </div>
  );
}
