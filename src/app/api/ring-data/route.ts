import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CORS headers for cross-origin requests from the ring app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-ring-api-key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST /api/ring-data — upsert a ring data point by email+date
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      date,
      temperature,
      hrv,
      spo2,
      sleepHours,
      sleepScore,
      steps,
      stress,
      raw,
    } = body;

    // Validate required fields
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "date is required in YYYY-MM-DD format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Upsert by email+date
    const record = await prisma.ringDataPoint.upsert({
      where: {
        email_date: { email, date },
      },
      create: {
        email,
        date,
        temperature: temperature ?? null,
        hrv: hrv ?? null,
        spo2: spo2 ?? null,
        sleepHours: sleepHours ?? null,
        sleepScore: sleepScore ?? null,
        steps: steps ?? null,
        stress: stress ?? null,
        raw: raw ?? null,
      },
      update: {
        ...(temperature !== undefined && { temperature }),
        ...(hrv !== undefined && { hrv }),
        ...(spo2 !== undefined && { spo2 }),
        ...(sleepHours !== undefined && { sleepHours }),
        ...(sleepScore !== undefined && { sleepScore }),
        ...(steps !== undefined && { steps }),
        ...(stress !== undefined && { stress }),
        ...(raw !== undefined && { raw }),
      },
    });

    return NextResponse.json(
      { ok: true, id: record.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/ring-data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET /api/ring-data?email=...&days=14
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const daysParam = searchParams.get("days");

    if (!email) {
      return NextResponse.json(
        { error: "email query parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const days = Math.min(Math.max(parseInt(daysParam || "14", 10) || 14, 1), 90);

    // Calculate the cutoff date
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const dataPoints = await prisma.ringDataPoint.findMany({
      where: {
        email,
        date: { gte: cutoffStr },
      },
      orderBy: { date: "desc" },
    });

    // Compute summary
    const summary = computeSummary(dataPoints, days);

    return NextResponse.json(
      { email, dataPoints, summary },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("GET /api/ring-data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

interface DataPoint {
  date: string;
  temperature: number | null;
  hrv: number | null;
  spo2: number | null;
  sleepHours: number | null;
  sleepScore: number | null;
  steps: number | null;
  stress: number | null;
}

function computeSummary(dataPoints: DataPoint[], days: number) {
  if (dataPoints.length === 0) {
    return {
      daysCovered: 0,
      daysRequested: days,
      avgTemp: null,
      avgHrv: null,
      avgSpo2: null,
      avgSleepHours: null,
      avgSleepScore: null,
      avgSteps: null,
      avgStress: null,
      minTemp: null,
      maxTemp: null,
      tempTrend: null,
      hrvTrend: null,
    };
  }

  const avg = (vals: number[]) =>
    vals.length > 0
      ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100
      : null;

  const temps = dataPoints.filter((d) => d.temperature !== null).map((d) => d.temperature!);
  const hrvs = dataPoints.filter((d) => d.hrv !== null).map((d) => d.hrv!);
  const spo2s = dataPoints.filter((d) => d.spo2 !== null).map((d) => d.spo2!);
  const sleepHrs = dataPoints.filter((d) => d.sleepHours !== null).map((d) => d.sleepHours!);
  const sleepScores = dataPoints.filter((d) => d.sleepScore !== null).map((d) => d.sleepScore!);
  const stepsList = dataPoints.filter((d) => d.steps !== null).map((d) => d.steps!);
  const stressList = dataPoints.filter((d) => d.stress !== null).map((d) => d.stress!);

  // Trend: compare the avg of the most recent 3 data points vs the previous 7
  const computeTrend = (values: number[]): string | null => {
    if (values.length < 4) return null;
    const recent = values.slice(0, 3);
    const previous = values.slice(3, 10);
    if (previous.length === 0) return null;
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    const pctChange = ((recentAvg - prevAvg) / prevAvg) * 100;
    if (pctChange > 5) return "rising";
    if (pctChange < -5) return "declining";
    return "stable";
  };

  // dataPoints are ordered desc, so index 0 = most recent
  const tempsByDate = dataPoints
    .filter((d) => d.temperature !== null)
    .map((d) => d.temperature!);
  const hrvsByDate = dataPoints
    .filter((d) => d.hrv !== null)
    .map((d) => d.hrv!);

  return {
    daysCovered: dataPoints.length,
    daysRequested: days,
    avgTemp: avg(temps),
    avgHrv: avg(hrvs),
    avgSpo2: avg(spo2s),
    avgSleepHours: avg(sleepHrs),
    avgSleepScore: avg(sleepScores),
    avgSteps: avg(stepsList),
    avgStress: avg(stressList),
    minTemp: temps.length > 0 ? Math.min(...temps) : null,
    maxTemp: temps.length > 0 ? Math.max(...temps) : null,
    tempTrend: computeTrend(tempsByDate),
    hrvTrend: computeTrend(hrvsByDate),
  };
}
