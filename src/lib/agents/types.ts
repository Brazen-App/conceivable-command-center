import { AgentConfig, AgentMessage } from "@/types";

export interface AgentRunInput {
  agentId: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface AgentRunOutput {
  agentId: string;
  response: string;
  tokensUsed?: number;
  durationMs?: number;
}

export interface AgentSession {
  config: AgentConfig;
  messages: AgentMessage[];
  isStreaming: boolean;
}

export interface AgentInvokeOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPromptOverride?: string;
}
