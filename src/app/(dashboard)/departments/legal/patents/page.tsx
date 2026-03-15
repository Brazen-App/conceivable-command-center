"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Star,
  Archive,
  MessageCircle,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Gem,
  TrendingUp,
  Shield,
  ShieldCheck,
  FilePlus2,
  ArrowUpRight,
  X,
  Sparkles,
  Send,
  Eye,
  PenTool,
  ArchiveRestore,
  Copy,
  Zap,
  Mic,
  MicOff,
} from "lucide-react";
import DiscussPanel from "@/components/review/DiscussPanel";

// ── Speech Recognition Types ────────────────────────────────────────

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// ── Types ───────────────────────────────────────────────────────────

interface PatentClaim {
  id: string;
  claimNumber: number;
  claimText: string;
  claimType: string;
  dependsOn: number | null;
  parentPatentId: string | null;
  parentPatentRef: string;
  valueTier: "HIGH" | "MEDIUM" | "LOW";
  estimatedValue: number;
  rationale: string;
  status: string;
  priority: boolean;
  archived: boolean;
  category: string | null;
  urgency: string | null;
  priorArtRisk: string | null;
  followOnNote: string | null;
}

// ── Strategic Memos ─────────────────────────────────────────────────
// Pre-written IP counsel memos for each patent category

interface StrategicMemo {
  whyFile: string;
  whatItProtects: string;
  competitiveLandscape: string;
  riskOfNotFiling: string;
}

function getStrategicMemo(claim: PatentClaim): StrategicMemo {
  const category = claim.category || "software_ai";

  const memos: Record<string, StrategicMemo> = {
    wearable: {
      whyFile:
        "The Halo Ring represents a novel approach to fertility biometric sensing that combines multiple physiological signals into a single wearable form factor. Unlike existing devices that track isolated metrics, Conceivable's approach creates a closed-loop feedback system where ring sensor data directly informs personalized supplement and behavioral recommendations. This integration is technically non-obvious and commercially defensible.",
      whatItProtects:
        "Filing protects the specific sensor fusion methodology — how the ring simultaneously captures basal body temperature, heart rate variability, blood oxygen saturation, and galvanic skin response, then processes these signals through a proprietary algorithm to generate a unified fertility readiness score. It also covers the physical design innovations that enable medical-grade accuracy in a consumer wearable form factor optimized for continuous overnight wear.",
      competitiveLandscape:
        "Oura, Ava, and Natural Cycles have adjacent patents in fertility tracking and wearable temperature sensing, but none cover the closed-loop system where wearable data directly drives supplement formulation. Tempdrop has temperature-only claims. The gap in the patent landscape is exactly where Conceivable operates: the integration layer between biometric sensing and personalized intervention.",
      riskOfNotFiling:
        "Without protection, any well-funded competitor (particularly Oura or Apple, who are both expanding into women's health) could replicate the sensor-to-supplement pipeline. Once the approach is published through marketing or app usage, the 12-month grace period for provisional filing begins. Delay beyond that forfeits all patent rights permanently.",
    },
    software_ai: {
      whyFile:
        "Conceivable's AI scoring system represents a genuine advancement in reproductive health technology. The Conceivable Score synthesizes multiple biomarker streams, lifestyle factors, and clinical data into a single actionable metric — something no competitor has achieved with this level of clinical validation. Under Alice/Mayo framework analysis, these claims survive Section 101 scrutiny because they solve a specific technical problem (multi-modal biomarker fusion for fertility prediction) using specific technical means.",
      whatItProtects:
        "This filing covers the machine learning architecture that processes heterogeneous health data — including but not limited to wearable biometrics, lab results, lifestyle inputs, and historical cycle data — to generate personalized fertility optimization recommendations. Key claims include the specific algorithmic approach to weighing and combining these signals, the feedback loop that improves predictions over time, and the novel data pipeline that enables real-time score updates.",
      competitiveLandscape:
        "Clue and Flo have basic cycle prediction patents. Modern Fertility (Ro) has lab interpretation IP. But nobody has patented the comprehensive scoring system that unifies wearable data + labs + lifestyle + clinical history into a single predictive model with personalized interventions. This is Conceivable's deepest technical moat and must be protected before fundraise materials make the methodology public.",
      riskOfNotFiling:
        "The Series A fundraise will necessarily reveal details of the scoring methodology to investors, advisors, and potential partners. Once disclosed without protection, competitors gain knowledge of the approach without any legal barrier to replication. AI/ML patent applications are increasingly competitive — every month of delay increases the risk of prior art from adjacent filings by players like Apple Health, Google DeepMind Health, or well-funded fertility startups.",
    },
    supplement: {
      whyFile:
        "The personalized supplement protocol engine is where Conceivable's technology becomes a physical product with recurring revenue. The system that translates biometric data into specific supplement formulations — adjusting dosages, combinations, and timing based on real-time physiological signals — is genuinely novel. No existing supplement company has this level of data-driven personalization in the fertility space.",
      whatItProtects:
        "Filing covers the algorithm that maps biomarker patterns to supplement recommendations, including the specific decision trees for selecting between supplement compounds, the dosage optimization engine that adjusts based on absorption markers and cycle phase, and the feedback system that modifies protocols based on outcome data. This is not just a recommendation engine — it's a closed-loop system where the supplement protocol evolves with the patient.",
      competitiveLandscape:
        "Ritual, Care/of, and Persona have personalization patents but none specific to fertility biomarkers. Theralogix has fertility supplement IP but no data-driven personalization. The intersection of real-time biometric data + supplement formulation + fertility optimization is an unoccupied patent space that Conceivable can claim exclusively.",
      riskOfNotFiling:
        "Supplement companies are increasingly investing in personalization technology. If a company like Ritual or Care/of files claims covering biomarker-driven supplement protocols — even in general health — they could potentially block Conceivable's fertility-specific implementation through broad claims. Filing first establishes priority and forces competitors to design around Conceivable's approach.",
    },
    data_privacy: {
      whyFile:
        "In the post-Dobbs landscape, fertility data privacy isn't just a compliance requirement — it's a core product feature and competitive differentiator. Conceivable's architecture for handling sensitive reproductive health data, including the specific technical approaches to anonymization, consent management, and data sovereignty, constitutes patentable subject matter that also serves as a trust signal to users and investors.",
      whatItProtects:
        "This filing covers the technical implementation of Conceivable's privacy-preserving data architecture: the specific methods for federated analysis that keep raw fertility data on-device, the consent management framework that gives users granular control over data sharing, the anonymization pipeline that enables population-level research without individual identification, and the audit trail system that provides cryptographic proof of data handling compliance.",
      competitiveLandscape:
        "Apple has broad device-level health privacy patents. Google has cloud anonymization IP. But neither has fertility-specific privacy claims. After the Dobbs decision, several startups announced privacy-focused fertility tools but none have filed specific technical patents. There is a narrow window to establish priority in this space.",
      riskOfNotFiling:
        "Privacy architecture is increasingly being recognized as patentable subject matter. A well-funded competitor filing broad privacy claims in the fertility/reproductive health space could force Conceivable to license or redesign its data handling. More practically, having granted privacy patents significantly strengthens Conceivable's position in investor conversations and partnership negotiations where data handling is always a concern.",
    },
    method: {
      whyFile:
        "Conceivable's clinical methodology — the specific sequence of assessments, interventions, and outcome tracking that constitutes the 'Conceivable Method' — is a process patent opportunity. This isn't just software; it's a clinically informed protocol for fertility optimization that combines biometric monitoring, behavioral coaching, nutritional supplementation, and cycle-timed interventions in a specific, reproducible sequence.",
      whatItProtects:
        "Filing protects the structured clinical workflow: the initial assessment protocol, the ongoing monitoring schedule, the trigger-based intervention system (where specific biomarker patterns automatically generate specific coaching actions), and the outcome measurement framework. Together, these form a reproducible method for improving fertility outcomes that can be defended as a specific, concrete process rather than an abstract idea.",
      competitiveLandscape:
        "Traditional fertility clinics don't patent their protocols. Digital health companies like Kindbody and Maven have service delivery patents but not clinical methodology patents in fertility optimization. The gap exists because most competitors view their clinical approach as trade secrets rather than patentable methods — but trade secrets offer weaker protection for a method that will be partially visible through the consumer app.",
      riskOfNotFiling:
        "Once the app launches publicly, the clinical methodology becomes observable through the user experience. Competitors can reverse-engineer the protocol without any legal barrier. A method patent prevents this by protecting the specific sequence and logic, even if individual steps are known. Without it, Conceivable's differentiated clinical approach becomes free for any well-resourced competitor to copy.",
    },
    design: {
      whyFile:
        "Design patents protect the distinctive visual identity of the Halo Ring and the Conceivable app interface. While utility patents protect function, design patents protect the specific ornamental appearance — and they're faster to obtain, harder to design around, and increasingly valuable in consumer health products where form factor drives purchase decisions.",
      whatItProtects:
        "This covers the unique visual design of the Halo Ring (shape, proportions, surface treatment, charging cradle), the distinctive UI patterns in the Conceivable app (the score visualization, the dashboard layout, the coaching interface), and the branded design system elements that create Conceivable's recognizable visual identity across physical and digital touchpoints.",
      competitiveLandscape:
        "Oura, Motiv, and Apple have ring/wearable design patents. Clue and Flo have app interface design patents in fertility. Conceivable's designs are sufficiently distinct from all of these, but the landscape is filling up. Design patent prosecution is relatively fast (12-18 months to grant) and inexpensive compared to utility patents.",
      riskOfNotFiling:
        "Design patents have a strict novelty requirement — once the design is publicly disclosed (through marketing, app store screenshots, or product launch), the clock starts. If competitors file similar designs first, Conceivable may be blocked from obtaining protection for its own visual identity. The cost is low (~$2-3K per design patent) and the protection is strong.",
    },
  };

  return memos[category] || memos.software_ai;
}

// ── Constants ───────────────────────────────────────────────────────

const VALUE_COLORS: Record<string, string> = {
  HIGH: "#E24D47",
  MEDIUM: "#F1C028",
  LOW: "#78C3BF",
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; gradient?: string }> = {
  not_drafted: { color: "#9686B9", bg: "#9686B912", label: "Not Started" },
  drafted: { color: "#F1C028", bg: "#F1C02812", label: "Drafting", gradient: "linear-gradient(135deg, #F1C02815 0%, #F1C02808 100%)" },
  under_review: { color: "#5A6FFF", bg: "#5A6FFF12", label: "Under Review", gradient: "linear-gradient(135deg, #5A6FFF15 0%, #5A6FFF08 100%)" },
  filed: { color: "#356FB6", bg: "#356FB612", label: "Filed", gradient: "linear-gradient(135deg, #356FB615 0%, #356FB608 100%)" },
  granted: { color: "#1EAA55", bg: "#1EAA5512", label: "Granted", gradient: "linear-gradient(135deg, #1EAA5515 0%, #1EAA5508 100%)" },
};

const URGENCY_LABELS: Record<string, { color: string; label: string; icon: string }> = {
  file_now: { color: "#E24D47", label: "File Now", icon: "!" },
  monitor: { color: "#F1C028", label: "Monitor", icon: "~" },
  exploratory: { color: "#78C3BF", label: "Exploratory", icon: "?" },
};

// ── Markdown stripping ──────────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, "").replace(/```/g, ""))
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, (match) => match);
}

function formatCategory(cat: string | null): string {
  if (!cat) return "General";
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Main Page ───────────────────────────────────────────────────────

export default function PatentsPage() {
  const [claims, setClaims] = useState<PatentClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [discussTarget, setDiscussTarget] = useState<PatentClaim | null>(null);
  const [draftTarget, setDraftTarget] = useState<PatentClaim | null>(null);
  const [viewFilter, setViewFilter] = useState<"filed" | "drafts_to_file" | "patents_to_file" | "claims_protected">("filed");
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewDraftTarget, setViewDraftTarget] = useState<PatentClaim | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cc-dismissed-patent-alerts");
      if (stored) setDismissedAlerts(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.add(alertId);
      try {
        localStorage.setItem("cc-dismissed-patent-alerts", JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  };

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/patent-claims");
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      if (data.length === 0) {
        await fetch("/api/seed", { method: "POST" });
        const retry = await fetch("/api/patent-claims");
        setClaims(await retry.json());
      } else {
        setClaims(data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [viewFilter]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Actions
  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/patent-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "update_status", status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/patent-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "archive" }),
      });
      if (res.ok) {
        setClaims((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnarchive = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/patent-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "unarchive" }),
      });
      if (res.ok) {
        setClaims((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Filter claims by new tab structure
  const filedClaims = claims.filter((c) => (c.status === "filed" || c.status === "granted") && !c.archived);
  const draftsToFile = claims.filter((c) => (c.status === "drafted" || c.status === "under_review") && !c.archived);
  const patentsToFile = claims.filter((c) => (c.status === "not_drafted") && !c.archived);
  const claimsProtected = claims.filter((c) => c.status === "granted" && !c.archived);
  const activeClaims = claims.filter((c) => !c.archived);

  // Keep these for backward compat with urgent banner
  const fileNowClaims = claims.filter((c) => c.urgency === "file_now" && !c.archived);
  const protectedClaims = claimsProtected;

  let displayClaims = filedClaims;
  if (viewFilter === "drafts_to_file") displayClaims = draftsToFile;
  else if (viewFilter === "patents_to_file") displayClaims = patentsToFile;
  else if (viewFilter === "claims_protected") displayClaims = claimsProtected;

  // Add new patent claim
  const handleAddClaim = async (data: {
    claimText: string;
    category: string;
    valueTier: string;
    estimatedValue: number;
    rationale: string;
    urgency: string;
    priorArtRisk: string;
  }) => {
    try {
      const res = await fetch("/api/patent-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newClaim = await res.json();
        setClaims((prev) => [newClaim, ...prev]);
        setShowAddForm(false);
      }
    } catch { /* ignore */ }
  };

  // Stats
  const totalValue = claims.reduce((s, c) => s + (c.estimatedValue || 0), 0);
  const protectedValue = protectedClaims.reduce((s, c) => s + (c.estimatedValue || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: "#5A6FFF" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ borderColor: "#E24D4730", backgroundColor: "#E24D4708", color: "#E24D47" }}
      >
        {error}. <button onClick={fetchClaims} className="underline font-medium">Retry</button>
      </div>
    );
  }

  // If draft workspace is open, show full-screen dual panel
  if (draftTarget) {
    return (
      <DraftWorkspace
        claim={draftTarget}
        onClose={() => setDraftTarget(null)}
        onStatusUpdate={(id, status) => {
          setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Banner */}
      {fileNowClaims.length > 0 && !dismissedAlerts.has("file-now-banner") && (
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #E24D4712 0%, #E24D4706 100%)",
            border: "1px solid #E24D4720",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#E24D4718" }}
            >
              <AlertTriangle size={20} style={{ color: "#E24D47" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: "#E24D47" }}>
                {fileNowClaims.length} Patent{fileNowClaims.length > 1 ? "s" : ""} Flagged: File Before Fundraise
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--foreground)" }}>
                These claims protect your deepest technical moats. Filing provisional applications before the Series A
                ensures your IP is documented before investor decks reveal methodology details. The cost is minimal
                (~$2K per provisional) and the protection window is 12 months.
              </p>
            </div>
          </div>
          <button
            onClick={() => dismissAlert("file-now-banner")}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X size={14} style={{ color: "var(--muted)" }} />
          </button>
        </div>
      )}

      {/* Quick Stats Bar */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-4"
          style={{ background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Total Claims</p>
              <p className="text-xl font-bold text-white">{activeClaims.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Protected</p>
              <p className="text-xl font-bold text-white">{protectedClaims.length}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Portfolio Value</p>
              <p className="text-xl font-bold text-white">${(protectedValue / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Potential Total</p>
              <p className="text-xl font-bold" style={{ color: "#ACB7FF" }}>${(totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Add Button */}
      <div className="flex gap-2 flex-wrap items-center">
        {([
          { key: "filed", label: "Filed", count: filedClaims.length },
          { key: "drafts_to_file", label: "Drafts to File", count: draftsToFile.length },
          { key: "patents_to_file", label: "Patents to File", count: patentsToFile.length },
          { key: "claims_protected", label: "Claims Protected", count: claimsProtected.length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setViewFilter(key)}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              backgroundColor: viewFilter === key ? "#5A6FFF" : "var(--surface)",
              color: viewFilter === key ? "white" : "var(--muted)",
              border: `1px solid ${viewFilter === key ? "#5A6FFF" : "var(--border)"}`,
            }}
          >
            {label} ({count})
          </button>
        ))}
        <button
          onClick={() => setShowAddForm(true)}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:shadow-md"
          style={{ backgroundColor: "#1EAA55" }}
        >
          <FilePlus2 size={13} /> Add Patent Idea
        </button>
      </div>

      {/* Add New Patent Form */}
      {showAddForm && (
        <AddPatentForm
          onSubmit={handleAddClaim}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Patent Cards */}
      <div className="space-y-4">
        {displayClaims.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No patents in this category.
            </p>
          </div>
        )}

        {displayClaims.map((claim) => (
          <PatentCard
            key={claim.id}
            claim={claim}
            isExpanded={expandedId === claim.id}
            onToggle={() => setExpandedId(expandedId === claim.id ? null : claim.id)}
            isActioning={actionLoading === claim.id}
            onDraft={() => setDraftTarget(claim)}
            onReview={() => handleStatusChange(claim.id, "under_review")}
            onArchive={() => handleArchive(claim.id)}
            onUnarchive={() => handleUnarchive(claim.id)}
            onDiscuss={() => setDiscussTarget(claim)}
            onViewDraft={() => setViewDraftTarget(claim)}
            isArchived={false}
          />
        ))}
      </div>

      {/* Sullivan 10x Card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #9686B908 0%, #5A6FFF08 100%)",
          border: "1px solid #9686B920",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0"
            style={{ backgroundColor: "#9686B920", color: "#9686B9" }}
          >
            10x
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Multiplier: Patent Portfolio = Fundraise Leverage
            </p>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted)" }}>
              Every provisional filing before the Series A adds to the IP asset table in the investor deck.
              A ${(totalValue / 1000000).toFixed(1)}M estimated portfolio value strengthens the valuation thesis.
              This isn&apos;t just legal protection — it&apos;s fundraising ammunition.
            </p>
          </div>
        </div>
      </div>

      {/* View Draft Panel */}
      {viewDraftTarget && (
        <ViewDraftPanel
          claim={viewDraftTarget}
          onClose={() => setViewDraftTarget(null)}
          onContinueDraft={() => {
            setViewDraftTarget(null);
            setDraftTarget(viewDraftTarget);
          }}
        />
      )}

      {/* Discuss Panel */}
      <DiscussPanel
        isOpen={!!discussTarget}
        onClose={() => setDiscussTarget(null)}
        contextType="patent"
        contextId={discussTarget?.id || ""}
        contextTitle={`Claim #${discussTarget?.claimNumber}: ${discussTarget?.claimText?.slice(0, 80) || ""}`}
        contextDetail={
          discussTarget
            ? `Patent claim #${discussTarget.claimNumber}: "${discussTarget.claimText}". Parent: ${discussTarget.parentPatentRef}. Value: ${discussTarget.valueTier}. Rationale: ${discussTarget.rationale}. Status: ${discussTarget.status}. Prior art risk: ${discussTarget.priorArtRisk}. Estimated value: $${discussTarget.estimatedValue?.toLocaleString()}.`
            : undefined
        }
      />
    </div>
  );
}

// ── Patent Card Component ───────────────────────────────────────────

function PatentCard({
  claim,
  isExpanded,
  onToggle,
  isActioning,
  onDraft,
  onReview,
  onArchive,
  onUnarchive,
  onDiscuss,
  onViewDraft,
  isArchived,
}: {
  claim: PatentClaim;
  isExpanded: boolean;
  onToggle: () => void;
  isActioning: boolean;
  onDraft: () => void;
  onReview: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDiscuss: () => void;
  onViewDraft: () => void;
  isArchived: boolean;
}) {
  const memo = getStrategicMemo(claim);
  const status = STATUS_CONFIG[claim.status] || STATUS_CONFIG.not_drafted;
  const urgency = claim.urgency ? URGENCY_LABELS[claim.urgency] : null;
  const valueColor = VALUE_COLORS[claim.valueTier] || VALUE_COLORS.MEDIUM;
  const isUrgent = claim.urgency === "file_now";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isUrgent ? "#E24D4730" : isExpanded ? "#5A6FFF30" : "var(--border)"}`,
        backgroundColor: "var(--surface)",
        boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Card Header — Always Visible */}
      <div
        className="px-5 py-4 cursor-pointer transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          {/* Left: Value indicator */}
          <div
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${valueColor}18 0%, ${valueColor}08 100%)`,
              border: `1px solid ${valueColor}20`,
            }}
          >
            <span className="text-[10px] font-bold" style={{ color: valueColor }}>
              {claim.valueTier}
            </span>
            <span className="text-[9px]" style={{ color: valueColor }}>
              ${(claim.estimatedValue / 1000).toFixed(0)}K
            </span>
          </div>

          {/* Middle: Title and meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {/* Status badge */}
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: status.bg, color: status.color }}
              >
                {status.label}
              </span>

              {/* Urgency badge */}
              {urgency && (
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: `${urgency.color}14`, color: urgency.color }}
                >
                  <Zap size={9} /> {urgency.label}
                </span>
              )}

              {/* Category */}
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {formatCategory(claim.category)}
              </span>

              {claim.priority && <Star size={11} fill="#F1C028" style={{ color: "#F1C028" }} />}
            </div>

            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
              Claim {claim.claimNumber}: {claim.claimText.slice(0, 120)}
              {claim.claimText.length > 120 ? "..." : ""}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                {claim.parentPatentRef}
              </span>
              {claim.priorArtRisk && (
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  Prior art risk: <span className="font-medium capitalize">{claim.priorArtRisk}</span>
                </span>
              )}
              {isUrgent && (
                <span className="text-[10px] flex items-center gap-1" style={{ color: "#E24D47" }}>
                  <Clock size={10} /> File before fundraise
                </span>
              )}
            </div>
          </div>

          {/* Right: Expand chevron */}
          <div className="shrink-0 pt-2">
            {isExpanded ? (
              <ChevronUp size={16} style={{ color: "var(--muted)" }} />
            ) : (
              <ChevronDown size={16} style={{ color: "var(--muted)" }} />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content — Strategic Memo */}
      {isExpanded && (
        <div
          className="px-5 pb-5 pt-0 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Full claim text */}
          <div
            className="rounded-xl p-4 mt-4 mb-5"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "#5A6FFF" }}
            >
              Full Claim Text
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
              {claim.claimText}
            </p>
          </div>

          {/* Strategic Memo */}
          <div className="space-y-4 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Gem size={14} style={{ color: "#9686B9" }} />
              <p
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: "#9686B9", fontFamily: "var(--font-caption)", letterSpacing: "0.14em" }}
              >
                IP Counsel Strategic Memo
              </p>
            </div>

            <div className="space-y-4 pl-1">
              <MemoSection
                title="Why File This Patent"
                content={memo.whyFile}
                accent="#356FB6"
              />
              <MemoSection
                title="What It Protects"
                content={memo.whatItProtects}
                accent="#1EAA55"
              />
              <MemoSection
                title="Competitive Landscape"
                content={memo.competitiveLandscape}
                accent="#F1C028"
              />
              <MemoSection
                title="Risk of Not Filing"
                content={memo.riskOfNotFiling}
                accent="#E24D47"
              />
            </div>
          </div>

          {/* Follow-on Note */}
          {claim.followOnNote && (
            <div
              className="rounded-xl p-4 mb-5 flex items-start gap-3"
              style={{ backgroundColor: "#F1C02808", border: "1px solid #F1C02820" }}
            >
              <ArrowUpRight size={14} className="shrink-0 mt-0.5" style={{ color: "#F1C028" }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#F1C028" }}>
                  Follow-On Patent Opportunity
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {claim.followOnNote}
                </p>
              </div>
            </div>
          )}

          {/* Strategic Rationale */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{ backgroundColor: "#5A6FFF08", border: "1px solid #5A6FFF15" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#5A6FFF" }}>
              Strategic Rationale
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
              {claim.rationale}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Draft / Continue Draft */}
            {!isArchived && claim.status !== "granted" && claim.status !== "filed" && (
              <button
                onClick={(e) => { e.stopPropagation(); onDraft(); }}
                disabled={isActioning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #356FB6 0%, #5A6FFF 100%)" }}
              >
                <PenTool size={14} /> {claim.status === "drafted" || claim.status === "under_review" ? "Continue Draft" : "Draft"}
              </button>
            )}

            {/* View Saved Draft */}
            {(claim.status === "drafted" || claim.status === "under_review" || claim.status === "filed") && (
              <button
                onClick={(e) => { e.stopPropagation(); onViewDraft(); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#356FB612",
                  color: "#356FB6",
                  border: "1px solid #356FB625",
                }}
              >
                <FileText size={14} /> View Draft
              </button>
            )}

            {!isArchived && claim.status !== "under_review" && claim.status !== "granted" && (
              <button
                onClick={(e) => { e.stopPropagation(); onReview(); }}
                disabled={isActioning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  backgroundColor: "#5A6FFF12",
                  color: "#5A6FFF",
                  border: "1px solid #5A6FFF25",
                }}
              >
                <Eye size={14} /> Review
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onDiscuss(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              <MessageCircle size={14} /> Discuss with Joy
            </button>

            {isArchived ? (
              <button
                onClick={(e) => { e.stopPropagation(); onUnarchive(); }}
                disabled={isActioning}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: "var(--background)", color: "#1EAA55", border: "1px solid #1EAA5525" }}
              >
                <ArchiveRestore size={14} /> Restore
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onArchive(); }}
                disabled={isActioning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)" }}
              >
                <Archive size={13} /> Archive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Memo Section ────────────────────────────────────────────────────

function MemoSection({ title, content, accent }: { title: string; content: string; accent: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <p className="text-xs font-bold" style={{ color: accent }}>{title}</p>
      </div>
      <p className="text-[13px] leading-relaxed pl-3.5" style={{ color: "var(--foreground)" }}>
        {content}
      </p>
    </div>
  );
}

// ── Add Patent Form ─────────────────────────────────────────────────

function AddPatentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: {
    claimText: string;
    category: string;
    valueTier: string;
    estimatedValue: number;
    rationale: string;
    urgency: string;
    priorArtRisk: string;
  }) => void;
  onCancel: () => void;
}) {
  const [claimText, setClaimText] = useState("");
  const [category, setCategory] = useState("software_ai");
  const [valueTier, setValueTier] = useState("MEDIUM");
  const [estimatedValue, setEstimatedValue] = useState("250000");
  const [rationale, setRationale] = useState("");
  const [urgency, setUrgency] = useState("monitor");
  const [priorArtRisk, setPriorArtRisk] = useState("medium");

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ backgroundColor: "var(--surface)", border: "1px solid #1EAA5530" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilePlus2 size={16} style={{ color: "#1EAA55" }} />
          <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Add New Patent Idea</p>
        </div>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-black/5">
          <X size={14} style={{ color: "var(--muted)" }} />
        </button>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
          Patent Claim / Invention Description
        </label>
        <textarea
          value={claimText}
          onChange={(e) => setClaimText(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          placeholder="Describe the invention or patent claim..."
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
          Strategic Rationale
        </label>
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          placeholder="Why should we pursue this patent?"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <option value="software_ai">Software / AI</option>
            <option value="wearable">Wearable</option>
            <option value="supplement">Supplement</option>
            <option value="data_privacy">Data Privacy</option>
            <option value="method">Method</option>
            <option value="design">Design</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>Value Tier</label>
          <select
            value={valueTier}
            onChange={(e) => setValueTier(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          >
            <option value="file_now">File Now</option>
            <option value="monitor">Monitor</option>
            <option value="exploratory">Exploratory</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>Est. Value ($)</label>
          <input
            type="number"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            if (!claimText.trim()) return;
            onSubmit({
              claimText: claimText.trim(),
              category,
              valueTier,
              estimatedValue: parseInt(estimatedValue) || 0,
              rationale: rationale.trim(),
              urgency,
              priorArtRisk,
            });
          }}
          disabled={!claimText.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40 transition-all hover:shadow-md"
          style={{ backgroundColor: "#1EAA55" }}
        >
          <FilePlus2 size={14} /> Add to Portfolio
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-xs font-medium"
          style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── View Draft Panel (slide-over to see saved draft) ────────────────

function ViewDraftPanel({
  claim,
  onClose,
  onContinueDraft,
}: {
  claim: PatentClaim;
  onClose: () => void;
  onContinueDraft: () => void;
}) {
  const [sessions, setSessions] = useState<{
    sessionId: string;
    phase: string;
    messageCount: number;
    hasDraft: boolean;
    lastUpdated: string;
    startedAt?: string;
  }[]>([]);
  const [loadedDraft, setLoadedDraft] = useState<{
    sections: { title: string; content: string }[];
    messages: { role: string; message: string; createdAt: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/legal/patent-sessions?claimId=${claim.id}`)
      .then((r) => r.json())
      .then((data) => {
        setSessions(data.sessions || []);
        // Auto-load the most recent session with a draft
        const withDraft = (data.sessions || []).find((s: { hasDraft: boolean }) => s.hasDraft);
        if (withDraft) {
          loadSessionDraft(withDraft.sessionId);
        } else if (data.sessions?.length > 0) {
          loadSessionDraft(data.sessions[0].sessionId);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [claim.id]);

  const loadSessionDraft = async (sessionId: string) => {
    setSelectedSession(sessionId);
    try {
      const res = await fetch(`/api/legal/patent-sessions?sessionId=${sessionId}`);
      const data = await res.json();
      setLoadedDraft({
        sections: (data.draft?.sections || []) as { title: string; content: string }[],
        messages: data.messages || [],
      });
    } catch { /* ignore */ }
  };

  const copyDraft = () => {
    if (!loadedDraft) return;
    const text = loadedDraft.sections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text || "");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl flex flex-col shadow-2xl"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)" }}
        >
          <div>
            <p className="text-sm font-bold text-white">Saved Patent Draft</p>
            <p className="text-[11px] text-white/50">
              Claim #{claim.claimNumber} · {formatCategory(claim.category)} · {claim.valueTier} Value
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onContinueDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <PenTool size={12} /> Continue Drafting
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Session tabs (if multiple) */}
        {sessions.length > 1 && (
          <div className="px-6 py-2 flex gap-2 overflow-x-auto border-b shrink-0" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            {sessions.map((s, i) => (
              <button
                key={s.sessionId}
                onClick={() => loadSessionDraft(s.sessionId)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: selectedSession === s.sessionId ? "#5A6FFF" : "var(--background)",
                  color: selectedSession === s.sessionId ? "white" : "var(--muted)",
                  border: `1px solid ${selectedSession === s.sessionId ? "#5A6FFF" : "var(--border)"}`,
                }}
              >
                Session {i + 1} · {formatDate(s.lastUpdated)} {s.hasDraft ? "· Has Draft" : ""}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin" style={{ color: "#5A6FFF" }} />
            </div>
          ) : !loadedDraft || (loadedDraft.sections.length === 0 && loadedDraft.messages.length === 0) ? (
            <div className="text-center py-16">
              <FileText size={32} style={{ color: "var(--muted)" }} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm" style={{ color: "var(--muted)" }}>No saved drafts yet.</p>
              <button
                onClick={onContinueDraft}
                className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #356FB6 0%, #5A6FFF 100%)" }}
              >
                <PenTool size={14} /> Start Drafting
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Draft Sections */}
              {loadedDraft.sections.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#5A6FFF" }}>
                      Draft Application
                    </p>
                    <button
                      onClick={copyDraft}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-black/5"
                      style={{ color: "var(--foreground)", border: "1px solid var(--border)" }}
                    >
                      <Copy size={12} /> Copy All
                    </button>
                  </div>
                  {loadedDraft.sections.map((section, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#356FB6" }}>
                        {section.title}
                      </p>
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                        {section.content}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* Conversation Log */}
              {loadedDraft.messages.length > 0 && (
                <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#9686B9" }}>
                    Conversation History ({loadedDraft.messages.length} messages)
                  </p>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {loadedDraft.messages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                        <div
                          className="max-w-[85%] rounded-xl px-3 py-2"
                          style={{
                            backgroundColor: msg.role === "user" ? "#5A6FFF" : "var(--surface)",
                            border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                            color: msg.role === "user" ? "white" : "var(--foreground)",
                          }}
                        >
                          <p className="text-[12px] whitespace-pre-wrap leading-relaxed">
                            {msg.message.slice(0, 500)}{msg.message.length > 500 ? "..." : ""}
                          </p>
                          <p className="text-[9px] mt-1 opacity-50">{formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Draft Workspace — Dual Panel with Persistent Memory ─────────────

interface SessionInfo {
  sessionId: string;
  startedAt: string;
  messageCount: number;
  firstMessage: string;
  phase: string;
  hasDraft: boolean;
  lastUpdated: string;
}

function DraftWorkspace({
  claim,
  onClose,
  onStatusUpdate,
}: {
  claim: PatentClaim;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [draftSections, setDraftSections] = useState<{ title: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"discovery" | "strategy" | "drafting">("discovery");
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [previousSessions, setPreviousSessions] = useState<SessionInfo[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const draftEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const sessionIdRef = useRef("");

  // On mount: check for existing sessions and auto-load the most recent one
  // If none exist, create a new session and start fresh
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    fetch(`/api/legal/patent-sessions?claimId=${claim.id}`)
      .then((r) => r.json())
      .then(async (data) => {
        const sessions = data.sessions || [];
        if (sessions.length > 0) {
          setPreviousSessions(sessions);
          // Auto-load the most recent session
          const mostRecent = sessions[0]; // already sorted by lastUpdated desc
          setLoadingSession(true);
          try {
            const res = await fetch(`/api/legal/patent-sessions?sessionId=${mostRecent.sessionId}`);
            const sessionData = await res.json();
            if (sessionData.messages?.length > 0) {
              // Restore the previous session
              sessionIdRef.current = mostRecent.sessionId;
              setSessionId(mostRecent.sessionId);
              const restored = sessionData.messages.map((m: { role: string; message: string }) => ({
                role: m.role,
                content: m.message,
              }));
              setMessages(restored);
              if (sessionData.draft?.sections) {
                setDraftSections(sessionData.draft.sections as { title: string; content: string }[]);
              }
              if (sessionData.draft?.phase) {
                setPhase(sessionData.draft.phase as "discovery" | "strategy" | "drafting");
              }
              // Check if draft was already generated
              const lastAssistant = restored.filter((m: { role: string }) => m.role === "assistant").pop();
              if (lastAssistant?.content?.includes("PROVISIONAL PATENT APPLICATION") ||
                  lastAssistant?.content?.includes("DETAILED DESCRIPTION")) {
                setDraftGenerated(true);
              }
              setLoadingSession(false);
              return; // Don't start a new conversation
            }
          } catch { /* fall through to new session */ }
          setLoadingSession(false);
        }
        // No previous sessions or load failed — create new session
        const sid = `patent-${claim.id}-${Date.now()}`;
        sessionIdRef.current = sid;
        setSessionId(sid);
      })
      .catch(() => {
        // Network error — just create new session
        const sid = `patent-${claim.id}-${Date.now()}`;
        sessionIdRef.current = sid;
        setSessionId(sid);
      });
  }, [claim.id]);

  // Hide global floating mic when DraftWorkspace is mounted
  useEffect(() => {
    const globalMic = document.querySelector<HTMLElement>('[title="Talk to Joy"]');
    if (globalMic) globalMic.style.display = "none";
    return () => {
      if (globalMic) globalMic.style.display = "";
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    draftEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [draftSections]);

  // Auto-save messages to ChatLog (non-blocking)
  const saveMessage = useCallback((role: string, content: string) => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    fetch("/api/chat-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contextType: "patent-draft",
        contextId: claim.id,
        role,
        message: content,
        sessionId: sid,
      }),
    }).catch(() => {});
  }, [claim.id]);

  // Save draft state to PatentDraft (non-blocking)
  const saveDraftState = useCallback((
    sections: { title: string; content: string }[],
    currentPhase: string,
    msgCount: number,
  ) => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    fetch("/api/legal/patent-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        claimId: claim.id,
        sessionId: sid,
        phase: currentPhase,
        sections: sections.length > 0 ? sections : null,
        title: `Claim #${claim.claimNumber} — ${formatCategory(claim.category)}`,
        messageCount: msgCount,
      }),
    }).then(() => {
      setSavedIndicator(true);
      setTimeout(() => setSavedIndicator(false), 2000);
    }).catch(() => {});
  }, [claim.id, claim.claimNumber, claim.category]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setVoiceTranscript("");
  }, []);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setInput((prev) => prev + finalTranscript);
        setVoiceTranscript("");
      } else if (interimTranscript) {
        setVoiceTranscript(interimTranscript);
      }
    };

    recognition.onerror = () => stopRecording();
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setVoiceTranscript("");
  }, [stopRecording]);

  // Start conversation only when a new session is created (not loaded from history)
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (!sessionId || loadingSession || hasStartedRef.current) return;
    if (messages.length === 0) {
      hasStartedRef.current = true;
      startConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, loadingSession]);

  const patentContext = {
    id: claim.id,
    title: claim.claimText,
    shortTitle: claim.claimText.slice(0, 60),
    type: "provisional",
    description: claim.rationale,
    keyClaims: [claim.claimText],
    priorArtNotes: claim.priorArtRisk || "",
    deadlineReason: claim.urgency === "file_now" ? "Must file before fundraise" : "",
    crossDeptConnections: [],
  };

  // Start a brand new session (clears everything)
  const startNewSession = () => {
    const sid = `patent-${claim.id}-${Date.now()}`;
    sessionIdRef.current = sid;
    setSessionId(sid);
    setMessages([]);
    setDraftSections([]);
    setPhase("discovery");
    setDraftGenerated(false);
    setShowHistory(false);
    hasStartedRef.current = false; // Allow startConversation to fire
  };

  // Load a previous session
  const loadSession = async (sid: string) => {
    setLoadingSession(true);
    setShowHistory(false);
    hasStartedRef.current = true; // Prevent startConversation from firing
    try {
      const res = await fetch(`/api/legal/patent-sessions?sessionId=${sid}`);
      const data = await res.json();

      if (data.messages?.length > 0) {
        // Update session ID to the loaded one
        setSessionId(sid);
        sessionIdRef.current = sid;

        // Restore messages
        const restored = data.messages.map((m: { role: string; message: string }) => ({
          role: m.role,
          content: m.message,
        }));
        setMessages(restored);

        // Restore draft sections if available
        if (data.draft?.sections) {
          setDraftSections(data.draft.sections as { title: string; content: string }[]);
        }

        // Restore phase
        if (data.draft?.phase) {
          setPhase(data.draft.phase as "discovery" | "strategy" | "drafting");
        }

        // Check if draft was already generated
        const lastAssistant = restored.filter((m: { role: string }) => m.role === "assistant").pop();
        if (lastAssistant?.content?.includes("PROVISIONAL PATENT APPLICATION") ||
            lastAssistant?.content?.includes("DETAILED DESCRIPTION")) {
          setDraftGenerated(true);
        }
      }
    } catch {
      // If loading fails, continue with current session
    } finally {
      setLoadingSession(false);
    }
  };

  const startConversation = async () => {
    setLoading(true);

    // Build context from previous sessions for continuity
    let previousContext = "";
    if (previousSessions.length > 0) {
      previousContext = `\n\nIMPORTANT: You have had ${previousSessions.length} previous conversation(s) about this claim. The founder is continuing your work together. Acknowledge the prior discussions and build on them. Do not repeat questions already answered.`;
    }

    try {
      const prompt = `I'd like to explore filing a provisional patent for this claim from our portfolio:

Claim #${claim.claimNumber}: "${claim.claimText}"

Parent Patent: ${claim.parentPatentRef}
Value Tier: ${claim.valueTier}
Strategic Rationale: ${claim.rationale}
Category: ${formatCategory(claim.category)}
Prior Art Risk: ${claim.priorArtRisk || "Unknown"}${previousContext}

This is in the discovery phase. Please review this and start by asking me your first set of questions about the technical implementation.`;

      const res = await fetch("/api/legal/patent-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patent: patentContext,
          messages: [{ role: "user", content: prompt }],
          action: "chat",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const cleaned = stripMarkdown(data.response);
        setMessages([{ role: "assistant", content: cleaned }]);
        saveMessage("assistant", cleaned);
        saveDraftState([], "discovery", 0);
      }
    } catch {
      const fallback = "I had trouble connecting. Let me try again — could you tell me about the technical implementation of this system? I need to understand the data inputs, processing steps, and what makes your approach genuinely novel.";
      setMessages([{ role: "assistant", content: fallback }]);
      saveMessage("assistant", fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (isRecording) stopRecording();
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    saveMessage("user", userMsg);
    setLoading(true);

    try {
      const allMessages = [...messages, { role: "user" as const, content: userMsg }];
      const res = await fetch("/api/legal/patent-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patent: patentContext,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          action: "chat",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const cleaned = stripMarkdown(data.response);
        setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
        saveMessage("assistant", cleaned);

        // Detect phase transitions
        const userCount = allMessages.filter((m) => m.role === "user").length;
        let newPhase = phase;
        if (userCount >= 2 && phase === "discovery") { newPhase = "strategy"; setPhase("strategy"); }
        if (userCount >= 4) { newPhase = "drafting"; setPhase("drafting"); }

        // Extract draft sections from response
        const newSections = extractDraftSections(data.response);
        const msgCount = allMessages.filter((m) => m.role === "user").length;
        saveDraftState(newSections || draftSections, newPhase, msgCount);

        // Detect if full draft was generated
        if (
          data.response.includes("PROVISIONAL PATENT APPLICATION") ||
          (data.response.includes("DETAILED DESCRIPTION") && data.response.includes("CLAIMS"))
        ) {
          setDraftGenerated(true);
          await fetch("/api/patent-claims", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: claim.id, action: "update_status", status: "drafted" }),
          });
          onStatusUpdate(claim.id, "drafted");
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I encountered a connection issue. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/legal/patent-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patent: patentContext,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          action: "generate-draft",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const cleaned = stripMarkdown(data.response);
        setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
        saveMessage("assistant", cleaned);
        setDraftGenerated(true);
        const newSections = extractDraftSections(data.response);
        saveDraftState(newSections || [], "drafting", messages.filter((m) => m.role === "user").length);

        await fetch("/api/patent-claims", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: claim.id, action: "update_status", status: "drafted" }),
        });
        onStatusUpdate(claim.id, "drafted");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to generate the draft. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const extractDraftSections = (text: string): { title: string; content: string }[] | null => {
    const sectionHeaders = [
      "TITLE OF THE INVENTION",
      "TECHNICAL FIELD",
      "BACKGROUND",
      "SUMMARY",
      "BRIEF DESCRIPTION",
      "DETAILED DESCRIPTION",
      "CLAIMS",
      "ABSTRACT",
      "PROVISIONAL PATENT APPLICATION",
    ];

    const sections: { title: string; content: string }[] = [];

    for (const header of sectionHeaders) {
      const idx = text.indexOf(header);
      if (idx !== -1) {
        let endIdx = text.length;
        for (const nextHeader of sectionHeaders) {
          if (nextHeader === header) continue;
          const nextIdx = text.indexOf(nextHeader, idx + header.length);
          if (nextIdx !== -1 && nextIdx < endIdx) endIdx = nextIdx;
        }
        const content = stripMarkdown(text.slice(idx + header.length, endIdx).trim());
        if (content.length > 20) {
          sections.push({ title: header, content });
        }
      }
    }

    if (sections.length > 0) {
      setDraftSections(sections);
      return sections;
    }
    return null;
  };

  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const showGenerateButton = !draftGenerated && userMsgCount >= 3;

  const copyDraft = () => {
    const text = draftSections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    if (text) {
      navigator.clipboard.writeText(text);
    } else {
      const lastLong = messages.filter((m) => m.role === "assistant" && m.content.length > 500);
      navigator.clipboard.writeText(lastLong[lastLong.length - 1]?.content || "");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="space-y-0 -mx-6 md:-mx-8 lg:-mx-10 -mt-6 md:-mt-8 lg:-mt-10">
      {/* Workspace Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #2A2828 0%, #356FB6 50%, #5A6FFF 100%)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          <div>
            <p className="text-sm font-bold text-white">
              Patent Drafting Workspace
            </p>
            <p className="text-[11px] text-white/50">
              Claim #{claim.claimNumber} · {formatCategory(claim.category)} · {claim.valueTier} Value
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Saved indicator */}
          {savedIndicator && (
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <CheckCircle2 size={10} /> Saved
            </span>
          )}

          {/* Session controls */}
          {previousSessions.length > 0 && (
            <>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Clock size={12} />
                {previousSessions.length} Session{previousSessions.length > 1 ? "s" : ""}
              </button>
              <button
                onClick={startNewSession}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FilePlus2 size={12} /> New
              </button>
            </>
          )}

          {/* Phase Indicator */}
          {(["discovery", "strategy", "drafting"] as const).map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor:
                    phase === p
                      ? "white"
                      : (p === "discovery" && phase !== "discovery") || (p === "strategy" && phase === "drafting")
                        ? "#1EAA55"
                        : "rgba(255,255,255,0.2)",
                  color:
                    phase === p
                      ? "#5A6FFF"
                      : (p === "discovery" && phase !== "discovery") || (p === "strategy" && phase === "drafting")
                        ? "white"
                        : "rgba(255,255,255,0.5)",
                }}
              >
                {(p === "discovery" && phase !== "discovery") || (p === "strategy" && phase === "drafting") ? (
                  <CheckCircle2 size={14} />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-[10px] text-white/60 uppercase tracking-wider capitalize hidden md:block">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Sessions Dropdown */}
      {showHistory && (
        <div
          className="border-b px-6 py-3 space-y-2"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Previous Conversations
          </p>
          {previousSessions.map((s) => (
            <button
              key={s.sessionId}
              onClick={() => loadSession(s.sessionId)}
              className="w-full text-left px-4 py-3 rounded-xl border transition-colors hover:border-[#5A6FFF]/30"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {formatDate(s.startedAt || s.lastUpdated)}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: s.phase === "drafting" ? "#1EAA5515" : s.phase === "strategy" ? "#5A6FFF15" : "#9686B915",
                      color: s.phase === "drafting" ? "#1EAA55" : s.phase === "strategy" ? "#5A6FFF" : "#9686B9",
                    }}
                  >
                    {s.phase}
                  </span>
                  {s.hasDraft && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#356FB615", color: "#356FB6" }}>
                      Has Draft
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
                {s.firstMessage || "Conversation started..."}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                {s.messageCount} messages
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Loading session overlay */}
      {loadingSession && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin" style={{ color: "#5A6FFF" }} />
          <span className="text-sm ml-3" style={{ color: "var(--muted)" }}>Loading conversation...</span>
        </div>
      )}

      {/* Dual Panel Layout */}
      <div className="flex" style={{ height: showHistory ? "calc(100vh - 280px)" : "calc(100vh - 120px)" }}>
        {/* LEFT: Chat Panel */}
        <div
          className="w-1/2 flex flex-col border-r"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
        >
          <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <Sparkles size={14} style={{ color: "#5A6FFF" }} />
            <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
              Joy: IP Attorney
            </span>
            <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1EAA5520", color: "#1EAA55" }}>
              Active
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                <div
                  className="max-w-[88%] rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: msg.role === "user" ? "#5A6FFF" : "var(--surface)",
                    border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
                    color: msg.role === "user" ? "white" : "var(--foreground)",
                  }}
                >
                  <p className="text-[13px] whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-3">
                <Loader2 size={14} className="animate-spin" style={{ color: "var(--muted)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>Joy is analyzing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            {showGenerateButton && (
              <button
                onClick={handleGenerateDraft}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #356FB6 0%, #5A6FFF 100%)" }}
              >
                <Sparkles size={15} /> Generate Full Provisional Draft
              </button>
            )}
            {/* Voice recording indicator */}
            {isRecording && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ backgroundColor: "#E24D4710", color: "#E24D47" }}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {voiceTranscript ? `"${voiceTranscript}"` : "Listening..."}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="p-2.5 rounded-xl shrink-0 transition-colors"
                style={{
                  backgroundColor: isRecording ? "#E24D4718" : "#5A6FFF14",
                  color: isRecording ? "#E24D47" : "#5A6FFF",
                }}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Answer questions or provide technical details..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6FFF]/30"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-xl text-white disabled:opacity-40 transition-colors hover:opacity-90"
                style={{ backgroundColor: "#5A6FFF" }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Draft Document Panel */}
        <div
          className="w-1/2 flex flex-col"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
            <div className="flex items-center gap-2">
              <FileText size={14} style={{ color: "#356FB6" }} />
              <span className="text-xs font-bold" style={{ color: "var(--foreground)" }}>
                Draft Document
              </span>
            </div>
            {draftSections.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors hover:bg-black/5"
                  style={{ color: "var(--foreground)", border: "1px solid var(--border)" }}
                >
                  <Copy size={12} /> Copy All
                </button>
                {draftGenerated && (
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white"
                    style={{ backgroundColor: "#1EAA55" }}
                  >
                    <CheckCircle2 size={12} /> Done
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            {draftSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#5A6FFF10" }}
                >
                  <FileText size={28} style={{ color: "#5A6FFF" }} strokeWidth={1.2} />
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                  Draft will appear here
                </p>
                <p className="text-xs leading-relaxed max-w-sm" style={{ color: "var(--muted)" }}>
                  As you discuss the patent with Joy, draft sections will populate in this panel.
                  After 3+ exchanges, you can generate the full provisional application.
                </p>
                <div className="mt-6 space-y-2 w-full max-w-xs">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>1</div>
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>Answer Joy&apos;s discovery questions</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>2</div>
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>Discuss strategy and claim scope</span>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "#5A6FFF14", color: "#5A6FFF" }}>3</div>
                    <span className="text-[11px]" style={{ color: "var(--muted)" }}>Generate full provisional draft</span>
                  </div>
                </div>
                {previousSessions.length > 0 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-[#5A6FFF]/10"
                    style={{ color: "#5A6FFF", border: "1px solid #5A6FFF30" }}
                  >
                    <Clock size={13} /> Load Previous Session
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Document Title */}
                <div className="text-center pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#5A6FFF", fontFamily: "var(--font-caption)", letterSpacing: "0.14em" }}
                  >
                    Provisional Patent Application
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    {claim.claimText.slice(0, 100)}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>
                    Claim #{claim.claimNumber} · {claim.parentPatentRef}
                  </p>
                </div>

                {/* Sections */}
                {draftSections.map((section, i) => (
                  <div key={i}>
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: "#356FB6" }}
                    >
                      {section.title}
                    </p>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)" }}>
                      {section.content}
                    </p>
                  </div>
                ))}
                <div ref={draftEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
