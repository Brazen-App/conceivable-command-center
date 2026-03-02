import Anthropic from "@anthropic-ai/sdk";
import { AGENT_CONFIGS } from "./config";
import {
  AgentInvokeOptions,
  AgentRunInput,
  AgentRunOutput,
} from "./types";
import { AgentDivision } from "@/types";

export interface MultiTurnInput {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface MultiTurnOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function invokeAgent(
  input: AgentRunInput,
  options: AgentInvokeOptions = {}
): Promise<AgentRunOutput> {
  const startTime = Date.now();
  const config = AGENT_CONFIGS[input.agentId as AgentDivision];

  if (!config) {
    throw new Error(`Unknown agent: ${input.agentId}`);
  }

  const client = getClient();
  const systemPrompt = options.systemPromptOverride ?? config.systemPrompt;

  const response = await client.messages.create({
    model: options.model ?? "claude-sonnet-4-20250514",
    max_tokens: options.maxTokens ?? 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: input.message,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  const responseText = textContent ? textContent.text : "";

  return {
    agentId: input.agentId,
    response: responseText,
    tokensUsed:
      (response.usage?.input_tokens ?? 0) +
      (response.usage?.output_tokens ?? 0),
    durationMs: Date.now() - startTime,
  };
}

export async function invokeAgentMultiTurn(
  input: MultiTurnInput,
  options: MultiTurnOptions = {}
): Promise<AgentRunOutput> {
  const startTime = Date.now();
  const client = getClient();

  const response = await client.messages.create({
    model: options.model ?? "claude-sonnet-4-20250514",
    max_tokens: options.maxTokens ?? 8192,
    system: input.systemPrompt,
    messages: input.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textContent = response.content.find((c) => c.type === "text");
  const responseText = textContent ? textContent.text : "";

  return {
    agentId: "patent-draft",
    response: responseText,
    tokensUsed:
      (response.usage?.input_tokens ?? 0) +
      (response.usage?.output_tokens ?? 0),
    durationMs: Date.now() - startTime,
  };
}
