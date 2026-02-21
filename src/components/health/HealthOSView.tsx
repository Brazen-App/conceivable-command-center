"use client";

import { useState, useEffect } from "react";
import { Heart, Pill, Activity, Moon, CalendarDays } from "lucide-react";
import HealthDatabase from "./HealthDatabase";
import { HealthDatabase as HealthDatabaseType } from "@/types";

const STORAGE_KEY = "health_os_databases";

function getDefaultDatabases(): HealthDatabaseType[] {
  return [
    {
      id: "daily-log",
      name: "Daily Log",
      icon: "📝",
      description: "Track your daily symptoms, energy, mood, and sleep",
      columns: [
        { id: "date", name: "Date", type: "date", width: 130 },
        { id: "energy", name: "Energy", type: "select", options: ["Low", "Medium", "High", "Very High"], width: 110 },
        { id: "mood", name: "Mood", type: "select", options: ["Poor", "Fair", "Good", "Great", "Excellent"], width: 110 },
        { id: "sleep_hours", name: "Sleep (hrs)", type: "number", width: 100 },
        { id: "sleep_quality", name: "Sleep Quality", type: "select", options: ["Poor", "Fair", "Good", "Excellent"], width: 120 },
        { id: "stress", name: "Stress", type: "select", options: ["None", "Low", "Moderate", "High", "Severe"], width: 110 },
        { id: "symptoms", name: "Symptoms", type: "multi-select", options: ["Headache", "Fatigue", "Bloating", "Cramps", "Nausea", "Brain Fog", "Anxiety", "Insomnia"], width: 200 },
        { id: "notes", name: "Notes", type: "text", width: 200 },
      ],
      rows: [],
    },
    {
      id: "supplements",
      name: "Supplement Protocol",
      icon: "💊",
      description: "Current supplement stack with dosages and timing",
      columns: [
        { id: "name", name: "Supplement", type: "text", width: 160 },
        { id: "dosage", name: "Dosage", type: "text", width: 120 },
        { id: "timing", name: "Timing", type: "select", options: ["Morning", "Afternoon", "Evening", "With Meals", "Before Bed"], width: 120 },
        { id: "frequency", name: "Frequency", type: "select", options: ["Daily", "2x Daily", "3x Daily", "Weekly", "As Needed"], width: 120 },
        { id: "purpose", name: "Purpose", type: "text", width: 180 },
        { id: "taken", name: "Taken Today", type: "checkbox", width: 100 },
        { id: "brand", name: "Brand", type: "text", width: 140 },
        { id: "notes", name: "Notes", type: "text", width: 160 },
      ],
      rows: [],
    },
    {
      id: "cycle-tracker",
      name: "Cycle Tracker",
      icon: "🌙",
      description: "Track menstrual cycle phases, BBT, and related symptoms",
      columns: [
        { id: "date", name: "Date", type: "date", width: 130 },
        { id: "cycle_day", name: "Cycle Day", type: "number", width: 100 },
        { id: "phase", name: "Phase", type: "select", options: ["Menstrual", "Follicular", "Ovulatory", "Luteal"], width: 120 },
        { id: "bbt", name: "BBT (°F)", type: "number", width: 100 },
        { id: "flow", name: "Flow", type: "select", options: ["None", "Spotting", "Light", "Medium", "Heavy"], width: 110 },
        { id: "cervical_mucus", name: "CM", type: "select", options: ["Dry", "Sticky", "Creamy", "Watery", "Egg White"], width: 110 },
        { id: "symptoms", name: "Symptoms", type: "multi-select", options: ["Cramps", "Breast Tenderness", "Bloating", "Acne", "Mood Swings", "Fatigue", "Headache", "Back Pain"], width: 200 },
        { id: "notes", name: "Notes", type: "text", width: 160 },
      ],
      rows: [],
    },
    {
      id: "health-metrics",
      name: "Health Metrics",
      icon: "📊",
      description: "Track key health measurements and lab values",
      columns: [
        { id: "date", name: "Date", type: "date", width: 130 },
        { id: "metric", name: "Metric", type: "select", options: ["Weight", "Blood Pressure", "Resting HR", "HRV", "Fasting Glucose", "TSH", "Vitamin D", "Iron/Ferritin", "AMH", "FSH", "Estradiol", "Progesterone", "Cortisol"], width: 140 },
        { id: "value", name: "Value", type: "text", width: 120 },
        { id: "unit", name: "Unit", type: "text", width: 80 },
        { id: "in_range", name: "In Range", type: "checkbox", width: 90 },
        { id: "source", name: "Source", type: "select", options: ["Lab Test", "Wearable", "Home Monitor", "Doctor Visit", "Self-Reported"], width: 130 },
        { id: "notes", name: "Notes", type: "text", width: 200 },
      ],
      rows: [],
    },
  ];
}

export default function HealthOSView() {
  const [databases, setDatabases] = useState<HealthDatabaseType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDatabases(JSON.parse(saved));
      } catch {
        setDatabases(getDefaultDatabases());
      }
    } else {
      setDatabases(getDefaultDatabases());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(databases));
    }
  }, [databases, loaded]);

  const updateDatabase = (updated: HealthDatabaseType) => {
    setDatabases((prev) => prev.map((db) => (db.id === updated.id ? updated : db)));
  };

  // Compute stats from data
  const supplementDb = databases.find((db) => db.id === "supplements");
  const dailyLogDb = databases.find((db) => db.id === "daily-log");
  const cycleDb = databases.find((db) => db.id === "cycle-tracker");

  const takenToday = supplementDb?.rows.filter((r) => r.cells.taken === true).length ?? 0;
  const totalSupplements = supplementDb?.rows.length ?? 0;

  const today = new Date().toISOString().split("T")[0];
  const todayLog = dailyLogDb?.rows.find((r) => r.cells.date === today);
  const todaySleep = todayLog?.cells.sleep_hours;

  const latestCycleEntry = cycleDb?.rows
    .slice()
    .sort((a, b) => String(b.cells.date).localeCompare(String(a.cells.date)))[0];
  const currentCycleDay = latestCycleEntry?.cells.cycle_day;

  // Calculate daily streak
  const logDates = new Set(dailyLogDb?.rows.map((r) => r.cells.date as string) ?? []);
  let streak = 0;
  const d = new Date();
  while (logDates.has(d.toISOString().split("T")[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  const computedStats = [
    { label: "Daily Streak", value: streak > 0 ? `${streak}d` : "—", icon: Activity, color: "#10B981" },
    { label: "Sleep", value: todaySleep ? `${todaySleep}h` : "—", icon: Moon, color: "#6366F1" },
    { label: "Cycle Day", value: currentCycleDay ? `Day ${currentCycleDay}` : "—", icon: CalendarDays, color: "#EC4899" },
    { label: "Supplements", value: totalSupplements > 0 ? `${takenToday}/${totalSupplements}` : "—", icon: Pill, color: "#F59E0B" },
  ];

  if (!loaded) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ color: "var(--muted)" }}>
        Loading Health OS...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Hero Banner */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{
          background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #6366F1 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="text-white" size={24} />
          <h2 className="text-xl font-bold text-white">Health OS</h2>
        </div>
        <p className="text-white/80 text-sm max-w-xl">
          Your personal health operating system. Track supplements, symptoms, cycles, and metrics
          — all in one place, Notion-style.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {computedStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border p-4 flex items-center gap-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </p>
                <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Databases */}
      <div className="space-y-2">
        {databases.map((db) => (
          <HealthDatabase key={db.id} database={db} onUpdate={updateDatabase} />
        ))}
      </div>
    </div>
  );
}
