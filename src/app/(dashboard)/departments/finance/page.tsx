"use client";

import {
  Wallet,
  Clock,
  DollarSign,
  Flame,
  ArrowRight,
  AlertTriangle,
  Link2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CompanyGoalsBanner from "@/components/layout/CompanyGoalsBanner";

const ACCENT = "#1EAA55";

/* Real known costs */
const KNOWN_COSTS = [
  { name: "Claude Max (Anthropic)", amount: 200, color: "#5A6FFF", note: "AI agent runtime" },
  { name: "Vercel Pro", amount: 20, color: "#2A2828", note: "Hosting & deployment" },
  { name: "Prisma Postgres", amount: 0, color: "#78C3BF", note: "Free tier — database" },
  { name: "Mailchimp", amount: 0, color: "#F1C028", note: "Free tier — email (up to 500 contacts)" },
  { name: "Late.com", amount: 0, color: "#356FB6", note: "Accounting — pending setup" },
  { name: "Circle.so", amount: 39, color: "#E37FB1", note: "Community platform — 220 members" },
  { name: "Domain + DNS", amount: 15, color: "#9686B9", note: "conceivable.com" },
];

const TOTAL_KNOWN = KNOWN_COSTS.reduce((sum, c) => sum + c.amount, 0);

/* Estimated monthly burn (CEO-provided) */
const ESTIMATED_BURN = 28_000;
const RUNWAY_MONTHS = 2;

export default function FinanceDashboardPage() {
  const router = useRouter();
  return (
    <div>
      <CompanyGoalsBanner departmentFocus="Close $150K bridge round to extend runway to 7 months" />

      {/* Runway Alert */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #E24D4708 0%, #E24D4712 100%)",
          border: "2px solid #E24D4730",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} style={{ color: "#E24D47" }} />
          <span className="text-sm font-bold" style={{ color: "#E24D47" }}>
            Runway Critical
          </span>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-5xl font-bold" style={{ color: "#E24D47", fontFamily: "var(--font-display)" }}>
              {RUNWAY_MONTHS} months
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              ~${ESTIMATED_BURN.toLocaleString()}/mo estimated burn
            </p>
          </div>
          <Link
            href="/departments/fundraising"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white mb-2"
            style={{ backgroundColor: "#E24D47" }}
          >
            Open Fundraising <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Known Costs — Real Data */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet size={16} style={{ color: ACCENT }} />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              Known Monthly Costs
            </h3>
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
            ${TOTAL_KNOWN.toLocaleString()}/mo
          </span>
        </div>
        <div className="space-y-2">
          {KNOWN_COSTS.map((cost) => (
            <div
              key={cost.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cost.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {cost.name}
                </p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>{cost.note}</p>
              </div>
              <span className="text-sm font-semibold" style={{ color: cost.amount > 0 ? "var(--foreground)" : "var(--muted)" }}>
                {cost.amount > 0 ? `$${cost.amount}` : "Free"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Remaining burn (~${(ESTIMATED_BURN - TOTAL_KNOWN).toLocaleString()}/mo) includes contractors, content, and operational costs.
          </p>
        </div>
      </div>

      {/* Connect Finance Tools */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={16} style={{ color: "#5A6FFF" }} />
          <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
            Connect Finance Tools
          </h3>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Connect your finance tools to see real-time data. Once connected, Joy will track expenses, revenue,
          and runway automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "Mercury", desc: "Bank account — cash position & transactions", connected: false },
            { name: "Stripe", desc: "Payment processing — subscription revenue", connected: false },
            { name: "Late.com / QuickBooks", desc: "Accounting — P&L, invoices, expenses", connected: false },
            { name: "Plaid", desc: "Bank aggregation — all accounts in one view", connected: false },
            { name: "Shopify", desc: "E-commerce — product sales & ROAS", connected: false },
            { name: "Gusto / Deel", desc: "Payroll — contractor & employee costs", connected: false },
          ].map((tool) => (
            <div
              key={tool.name}
              className="rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-sm transition-shadow"
              style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: tool.connected ? "#1EAA55" : "var(--muted)" }}
              >
                {tool.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{tool.name}</p>
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>{tool.desc}</p>
              </div>
              <button
                onClick={() => !tool.connected && router.push(`/agents/executive-coach?prompt=${encodeURIComponent(`Help me connect ${tool.name} to the Conceivable Command Center. ${tool.desc}. Walk me through the API setup, authentication, and what data we should pull into the finance dashboard.`)}`)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{
                  backgroundColor: tool.connected ? "#1EAA5514" : "#5A6FFF14",
                  color: tool.connected ? "#1EAA55" : "#5A6FFF",
                  cursor: tool.connected ? "default" : "pointer",
                }}
              >
                {tool.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Joy's Insight */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #F1C02808 0%, #9686B908 100%)",
          border: "1px solid rgba(241, 192, 40, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: "#F1C028" }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F1C028" }}>
            Joy&apos;s 10x Recommendation
          </span>
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
          Connect Mercury and Stripe first.
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
          Real-time cash position is the #1 metric for a pre-launch company with 2 months runway.
          Mercury API gives you instant visibility into every dollar. Stripe will track early subscription revenue
          once the app launches. Together they replace the spreadsheet guessing game with real data.
          This is a 10x move — one integration that de-risks the entire fundraising conversation.
        </p>
      </div>
    </div>
  );
}
