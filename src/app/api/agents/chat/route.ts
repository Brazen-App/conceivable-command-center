import { NextRequest, NextResponse } from "next/server";
import { invokeAgent } from "@/lib/agents/invoke";
import { AgentDivision } from "@/types";
import { AGENT_CONFIGS } from "@/lib/agents/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, message } = body;

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId and message are required" },
        { status: 400 }
      );
    }

    if (!AGENT_CONFIGS[agentId as AgentDivision]) {
      return NextResponse.json(
        { error: `Unknown agent: ${agentId}` },
        { status: 400 }
      );
    }

    const result = await invokeAgent({ agentId, message });

    return NextResponse.json({
      response: result.response,
      tokensUsed: result.tokensUsed,
      durationMs: result.durationMs,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to invoke agent";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
