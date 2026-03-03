import Header from "@/components/layout/Header";
import AgentChat from "@/components/agents/AgentChat";
import LegalDivisionView from "@/components/legal/LegalDivisionView";
import { AGENT_CONFIGS } from "@/lib/agents/config";
import { AgentDivision } from "@/types";
import { notFound } from "next/navigation";

interface AgentPageProps {
  params: Promise<{ division: string }>;
  searchParams: Promise<{ prompt?: string }>;
}

export default async function AgentPage({ params, searchParams }: AgentPageProps) {
  const { division } = await params;
  const { prompt } = await searchParams;
  const config = AGENT_CONFIGS[division as AgentDivision];

  if (!config) {
    notFound();
  }

  if (division === "legal") {
    return (
      <>
        <Header title={config.name} subtitle={config.description} />
        <LegalDivisionView config={config} />
      </>
    );
  }

  return (
    <>
      <Header title={config.name} subtitle={config.description} />
      <AgentChat config={config} initialPrompt={prompt} />
    </>
  );
}
