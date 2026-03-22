// Email Flow Definitions
// Maps to the actual `flow` field in the database

export type FlowType =
  | "warmup"           // launch flow, re-engagement + education phases
  | "launch-campaign"  // launch flow, launch + final-push + post-close phases
  | "post-purchase"
  | "abandoned-cart"
  | "post-download"
  | "post-download-nudge";

export interface FlowConfig {
  id: FlowType;
  name: string;
  description: string;
  type: "automation" | "campaign";
  trigger: string;
  cadence: string;
  color: string;
}

export const FLOW_CONFIGS: Record<FlowType, FlowConfig> = {
  warmup: {
    id: "warmup",
    name: "Warmup Automation",
    description: "Re-engagement + education emails. Sends every 3rd day at optimized time to warm the list before launch.",
    type: "automation",
    trigger: "Tag: warmup-start",
    cadence: "Every 3 days",
    color: "#78C3BF",
  },
  "launch-campaign": {
    id: "launch-campaign",
    name: "Launch Campaigns",
    description: "Time-sensitive launch, final push, and post-close emails. Scheduled individually.",
    type: "campaign",
    trigger: "Scheduled date",
    cadence: "Per schedule",
    color: "#E37FB1",
  },
  "post-purchase": {
    id: "post-purchase",
    name: "Post-Purchase Onboarding",
    description: "Welcome and onboarding sequence triggered after purchase.",
    type: "automation",
    trigger: "Tag: purchased",
    cadence: "Immediate → Day 2 → Day 7 → Day 14 → Day 60",
    color: "#1EAA55",
  },
  "abandoned-cart": {
    id: "abandoned-cart",
    name: "Abandoned Cart Recovery",
    description: "Recovery sequence for users who started checkout but didn't complete.",
    type: "automation",
    trigger: "Tag: cart-abandoned",
    cadence: "2 hrs → 24 hrs → 48 hrs",
    color: "#F1C028",
  },
  "post-download": {
    id: "post-download",
    name: "Post-App Download",
    description: "Onboarding sequence triggered when a user downloads the app.",
    type: "automation",
    trigger: "Tag: app-downloaded",
    cadence: "Immediate → Day 3 → Day 7 → Day 14 → Day 21",
    color: "#5A6FFF",
  },
  "post-download-nudge": {
    id: "post-download-nudge",
    name: "App Download Nudge",
    description: "Re-engagement for users who downloaded but haven't completed setup.",
    type: "automation",
    trigger: "Tag: app-incomplete-setup",
    cadence: "Day 1 → Day 3 → Day 7",
    color: "#9686B9",
  },
};

// Given an email from the DB, determine its flow bucket
// The `launch` flow gets split by phase into warmup vs campaign
export function getEmailFlowType(email: { flow: string; phase: string }): FlowType {
  if (email.flow === "launch") {
    // re-engagement and education phases = warmup automation
    if (email.phase === "re-engagement" || email.phase === "education") {
      return "warmup";
    }
    // launch, final-push, post-close = campaign
    return "launch-campaign";
  }
  // Direct flow mapping
  if (email.flow === "post-purchase") return "post-purchase";
  if (email.flow === "abandoned-cart") return "abandoned-cart";
  if (email.flow === "post-download") return "post-download";
  if (email.flow === "post-download-nudge") return "post-download-nudge";
  return "warmup"; // fallback
}

// Warmup automation schedule config
export const WARMUP_SCHEDULE = {
  intervalDays: 3,
  sendTime: "10:00 AM EST",
  rampStrategy: [
    { name: "Tier 1", size: 3000, desc: "Top 10% — highest openers", minOpenRate: 25 },
    { name: "Tier 2", size: 5000, desc: "Top 17% — recent openers + clickers", minOpenRate: 25 },
    { name: "Tier 3", size: 7000, desc: "Top 25% — engaged quarter", minOpenRate: 22 },
    { name: "Tier 4", size: 10000, desc: "Top 35% — engaged third", minOpenRate: 22 },
    { name: "Tier 5", size: 15000, desc: "Top 50% — engaged half", minOpenRate: 18 },
    { name: "Tier 6", size: 25000, desc: "Most of list", minOpenRate: 18 },
    { name: "Tier 7", size: 29000, desc: "Full list", minOpenRate: 15 },
  ],
};
