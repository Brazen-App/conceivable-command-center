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

  try {
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
  } catch (err: unknown) {
    // Map API errors to user-friendly messages
    const errMsg = err instanceof Error ? err.message : String(err);
    let userMessage = "Joy encountered an issue processing your request. Please try again.";

    if (errMsg.includes("credit balance") || errMsg.includes("billing")) {
      userMessage = "Joy's AI service needs a billing update. Please check the Anthropic API account credits.";
    } else if (errMsg.includes("rate_limit") || errMsg.includes("429")) {
      userMessage = "Joy is handling too many requests right now. Please wait a moment and try again.";
    } else if (errMsg.includes("overloaded") || errMsg.includes("529")) {
      userMessage = "Joy's AI service is temporarily busy. Please try again in a few minutes.";
    } else if (errMsg.includes("authentication") || errMsg.includes("401")) {
      userMessage = "Joy's AI service credentials need to be updated. Please check the API key configuration.";
    }

    console.error(`Agent ${input.agentId} error:`, errMsg);

    return {
      agentId: input.agentId,
      response: userMessage,
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
    };
  }
}

export async function invokeAgentMultiTurn(
  input: MultiTurnInput,
  options: MultiTurnOptions = {}
): Promise<AgentRunOutput> {
  const startTime = Date.now();
  const client = getClient();

  try {
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
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    let userMessage = "Joy encountered an issue. Please try again.";

    if (errMsg.includes("credit balance") || errMsg.includes("billing")) {
      userMessage = "Joy's AI service needs a billing update. Please check the Anthropic API account credits.";
    } else if (errMsg.includes("rate_limit") || errMsg.includes("429")) {
      userMessage = "Joy is handling too many requests. Please wait a moment and try again.";
    }

    console.error("Multi-turn agent error:", errMsg);

    return {
      agentId: "patent-draft",
      response: userMessage,
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
    };
  }
}
