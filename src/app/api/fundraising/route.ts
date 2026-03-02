import { NextResponse } from "next/server";
import {
  MOVEMENT_BOARD_INVESTORS,
  VENTURE_INVESTORS,
  STRATEGIC_PARTNERS,
  PITCH_MATERIALS,
  MEETING_NOTES,
  FUNDRAISE_METRICS,
  WEEKLY_RECOMMENDATION,
  FUNDRAISE_NARRATIVE,
  STORY_ANGLES,
} from "@/lib/data/fundraising-data";

export async function GET() {
  return NextResponse.json({
    movementBoard: MOVEMENT_BOARD_INVESTORS,
    ventureInvestors: VENTURE_INVESTORS,
    strategicPartners: STRATEGIC_PARTNERS,
    pitchMaterials: PITCH_MATERIALS,
    meetingNotes: MEETING_NOTES,
    metrics: FUNDRAISE_METRICS,
    weeklyRecommendation: WEEKLY_RECOMMENDATION,
    narrative: FUNDRAISE_NARRATIVE,
    storyAngles: STORY_ANGLES,
  });
}
