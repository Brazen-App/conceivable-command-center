import { NextResponse } from "next/server";
import {
  FACTORS,
  CAUSAL_CHAINS,
  COHORT_OUTCOMES,
  AGENT_PERFORMANCE,
  INTERVENTION_CASCADES,
  STUDY_OPPORTUNITIES,
  REGULATORY_EVIDENCE,
  RESEARCH_FEED,
  DROP_OFF_DATA,
} from "@/lib/data/clinical-data";

export async function GET() {
  return NextResponse.json({
    factors: FACTORS,
    causalChains: CAUSAL_CHAINS,
    cohortOutcomes: COHORT_OUTCOMES,
    agentPerformance: AGENT_PERFORMANCE,
    interventionCascades: INTERVENTION_CASCADES,
    studyOpportunities: STUDY_OPPORTUNITIES,
    regulatoryEvidence: REGULATORY_EVIDENCE,
    researchFeed: RESEARCH_FEED,
    dropOffData: DROP_OFF_DATA,
  });
}
