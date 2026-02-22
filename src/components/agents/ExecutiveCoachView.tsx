"use client";

import { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Edit3,
  Crown,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AgentConfig } from "@/types";
import AgentChat from "./AgentChat";

interface Milestone {
  id: string;
  text: string;
  done: boolean;
}

interface BusinessGoal {
  id: string;
  title: string;
  category: string;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  notes: string;
}

const STORAGE_KEY = "exec_coach_goals";

const CATEGORIES = [
  "Revenue",
  "Product",
  "Marketing",
  "Team",
  "Fundraising",
  "Legal/IP",
  "Partnerships",
  "Personal",
];

function getDefaultGoals(): BusinessGoal[] {
  return [];
}

interface ExecutiveCoachViewProps {
  config: AgentConfig;
}

export default function ExecutiveCoachView({ config }: ExecutiveCoachViewProps) {
  const [goals, setGoals] = useState<BusinessGoal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "Product",
    deadline: "",
    notes: "",
  });
  const [activeTab, setActiveTab] = useState<"chat" | "goals">("chat");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch {
        setGoals(getDefaultGoals());
      }
    } else {
      setGoals(getDefaultGoals());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }, [goals, loaded]);

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const goal: BusinessGoal = {
      id: uuidv4(),
      title: newGoal.title,
      category: newGoal.category,
      deadline: newGoal.deadline,
      progress: 0,
      milestones: [],
      notes: newGoal.notes,
    };
    setGoals((prev) => [...prev, goal]);
    setNewGoal({ title: "", category: "Product", deadline: "", notes: "" });
    setShowAddGoal(false);
    setExpandedGoal(goal.id);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (expandedGoal === id) setExpandedGoal(null);
  };

  const addMilestone = (goalId: string, text: string) => {
    if (!text.trim()) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: [
                ...g.milestones,
                { id: uuidv4(), text, done: false },
              ],
            }
          : g
      )
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const done = milestones.filter((m) => m.done).length;
        const progress =
          milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0;
        return { ...g, milestones, progress };
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.filter((m) => m.id !== milestoneId);
        const done = milestones.filter((m) => m.done).length;
        const progress =
          milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0;
        return { ...g, milestones, progress };
      })
    );
  };

  const updateGoalNotes = (goalId: string, notes: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, notes } : g))
    );
  };

  const completedGoals = goals.filter((g) => g.progress === 100).length;
  const inProgressGoals = goals.filter((g) => g.progress > 0 && g.progress < 100).length;

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Tab bar */}
      <div
        className="px-8 py-0 border-b flex gap-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <button
          onClick={() => setActiveTab("chat")}
          className="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor: activeTab === "chat" ? "var(--brand-primary)" : "transparent",
            color: activeTab === "chat" ? "var(--brand-primary)" : "var(--muted)",
          }}
        >
          <Crown size={14} className="inline mr-2" />
          Coach Chat
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
          style={{
            borderColor: activeTab === "goals" ? "var(--brand-primary)" : "transparent",
            color: activeTab === "goals" ? "var(--brand-primary)" : "var(--muted)",
          }}
        >
          <Target size={14} className="inline mr-2" />
          Business Goals
          {goals.length > 0 && (
            <span
              className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
            >
              {goals.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "chat" ? (
        <AgentChat config={config} embedded />
      ) : (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Total Goals
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                  {goals.length}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  In Progress
                </p>
                <p className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
                  {inProgressGoals}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Completed
                </p>
                <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
                  {completedGoals}
                </p>
              </div>
            </div>

            {/* Add Goal button */}
            {!showAddGoal ? (
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white mb-6"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                <Plus size={16} />
                Add Business Goal
              </button>
            ) : (
              <div
                className="rounded-xl border p-5 mb-6"
                style={{ borderColor: "var(--brand-primary)", backgroundColor: "var(--surface)" }}
              >
                <h3 className="font-medium text-sm mb-3" style={{ color: "var(--foreground)" }}>
                  New Business Goal
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Goal title (e.g., Launch MVP by Q2)"
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && addGoal()}
                  />
                  <div className="flex gap-3">
                    <select
                      value={newGoal.category}
                      onChange={(e) =>
                        setNewGoal((p) => ({ ...p, category: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) =>
                        setNewGoal((p) => ({ ...p, deadline: e.target.value }))
                      }
                      className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                    />
                  </div>
                  <textarea
                    value={newGoal.notes}
                    onChange={(e) =>
                      setNewGoal((p) => ({ ...p, notes: e.target.value }))
                    }
                    placeholder="Notes (optional)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addGoal}
                      disabled={!newGoal.title.trim()}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: "var(--brand-primary)" }}
                    >
                      Add Goal
                    </button>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="px-4 py-2 rounded-lg text-sm border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Goals List */}
            {goals.length === 0 && !showAddGoal && (
              <div className="text-center py-12">
                <Target size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  No business goals yet. Add your first goal to start tracking progress.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {goals.map((goal) => {
                const isExpanded = expandedGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
                  >
                    {/* Goal Header */}
                    <button
                      onClick={() =>
                        setExpandedGoal(isExpanded ? null : goal.id)
                      }
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-black/[0.02]"
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} style={{ color: "var(--muted)" }} />
                      ) : (
                        <ChevronRight size={16} style={{ color: "var(--muted)" }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className="font-medium text-sm truncate"
                            style={{ color: "var(--foreground)" }}
                          >
                            {goal.title}
                          </h4>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: "#EDE9FE",
                              color: "#7C3AED",
                            }}
                          >
                            {goal.category}
                          </span>
                        </div>
                        {goal.deadline && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                            Due: {new Date(goal.deadline + "T00:00:00").toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="w-24 h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${goal.progress}%`,
                              backgroundColor:
                                goal.progress === 100 ? "#10B981" : "#8B5CF6",
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-medium w-8 text-right"
                          style={{
                            color: goal.progress === 100 ? "#10B981" : "var(--muted)",
                          }}
                        >
                          {goal.progress}%
                        </span>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div
                        className="px-4 pb-4 pt-0"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        {/* Notes */}
                        {(goal.notes || isExpanded) && (
                          <div className="mt-3 mb-4">
                            <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--muted)" }}>
                              <Edit3 size={11} /> Notes
                            </label>
                            <textarea
                              value={goal.notes}
                              onChange={(e) => updateGoalNotes(goal.id, e.target.value)}
                              placeholder="Add context, strategy notes, blockers..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none"
                              style={{
                                borderColor: "var(--border)",
                                backgroundColor: "var(--background)",
                              }}
                            />
                          </div>
                        )}

                        {/* Milestones */}
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                            Milestones ({goal.milestones.filter((m) => m.done).length}/
                            {goal.milestones.length})
                          </p>
                          <div className="space-y-1.5">
                            {goal.milestones.map((ms) => (
                              <div
                                key={ms.id}
                                className="flex items-center gap-2 group"
                              >
                                <button onClick={() => toggleMilestone(goal.id, ms.id)}>
                                  {ms.done ? (
                                    <CheckCircle size={16} style={{ color: "#10B981" }} />
                                  ) : (
                                    <Circle size={16} style={{ color: "var(--border)" }} />
                                  )}
                                </button>
                                <span
                                  className={`text-sm flex-1 ${ms.done ? "line-through" : ""}`}
                                  style={{
                                    color: ms.done ? "var(--muted)" : "var(--foreground)",
                                  }}
                                >
                                  {ms.text}
                                </span>
                                <button
                                  onClick={() => deleteMilestone(goal.id, ms.id)}
                                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100"
                                >
                                  <Trash2 size={12} className="text-red-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <MilestoneInput
                            onAdd={(text) => addMilestone(goal.id, text)}
                          />
                        </div>

                        {/* Delete goal */}
                        <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50"
                            style={{ color: "#EF4444" }}
                          >
                            <Trash2 size={12} />
                            Delete goal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Plus size={14} style={{ color: "var(--muted)" }} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Add milestone..."
        className="flex-1 text-sm bg-transparent outline-none"
        style={{ color: "var(--foreground)" }}
      />
      {text.trim() && (
        <button
          onClick={handleSubmit}
          className="text-xs px-2 py-1 rounded font-medium"
          style={{ color: "var(--brand-primary)" }}
        >
          Add
        </button>
      )}
    </div>
  );
}
