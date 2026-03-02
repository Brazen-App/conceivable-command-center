"use client";

import { useState, useEffect } from "react";
import { Boxes, LayoutGrid, Search, Network } from "lucide-react";
import VerticalsGrid from "@/components/departments/product/VerticalsGrid";
import VerticalDetail from "@/components/departments/product/VerticalDetail";
import CrossVerticalMap from "@/components/departments/product/CrossVerticalMap";
import type {
  Vertical,
  VerticalId,
  ResearchItem,
  Feature,
  CompetitorEntry,
  UserInsight,
  ReadinessCheckItem,
  CrossVerticalConnection,
} from "@/lib/data/product-data";

const ACCENT = "#E37FB1";

const TABS = [
  { id: "verticals", label: "10 Verticals", icon: LayoutGrid },
  { id: "connections", label: "Cross-Vertical Map", icon: Network },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ProductData {
  verticals: Vertical[];
  research: ResearchItem[];
  features: Feature[];
  competitors: CompetitorEntry[];
  insights: UserInsight[];
  readiness: ReadinessCheckItem[];
  connections: CrossVerticalConnection[];
}

export default function ProductDepartmentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("verticals");
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVertical, setSelectedVertical] = useState<VerticalId | null>(null);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSelectVertical = (id: VerticalId) => {
    setSelectedVertical(id);
  };

  const handleBackToGrid = () => {
    setSelectedVertical(null);
  };

  const activeVerticals = data ? data.verticals.filter((v) => v.status === "active").length : 0;
  const totalFeatures = data ? data.features.length : 0;
  const totalResearch = data ? data.research.length : 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${ACCENT}14` }}
          >
            <Boxes size={20} style={{ color: ACCENT }} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Product Development
            </h1>
            <p
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-caption)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              The Product Brain — Research, Ideate, Validate Before Engineering
            </p>
          </div>
        </div>
      </header>

      {/* Alert banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
        style={{
          backgroundColor: `${ACCENT}0A`,
          border: `1px solid ${ACCENT}18`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Boxes size={20} style={{ color: ACCENT }} strokeWidth={2} />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              10 verticals mapped &middot; {activeVerticals} active &middot;{" "}
              {totalFeatures} features &middot; {totalResearch} research items
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Women&apos;s health lifecycle from Pre-Period through Post-Menopause
            </p>
          </div>
        </div>
      </div>

      {/* Show detail view or tab view */}
      {selectedVertical && data ? (
        <VerticalDetail
          vertical={data.verticals.find((v) => v.id === selectedVertical)!}
          research={data.research.filter((r) => r.verticalId === selectedVertical)}
          features={data.features.filter((f) => f.verticalId === selectedVertical)}
          competitors={data.competitors.filter((c) => c.verticalId === selectedVertical)}
          insights={data.insights.filter((i) => i.verticalId === selectedVertical)}
          readiness={data.readiness.filter((r) => r.verticalId === selectedVertical)}
          onBack={handleBackToGrid}
        />
      ) : (
        <>
          {/* Tab bar */}
          <div
            className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--border)",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 whitespace-nowrap
                    ${active ? "shadow-sm" : ""}
                  `}
                  style={
                    active
                      ? { backgroundColor: "var(--surface)", color: ACCENT }
                      : { color: "var(--muted)" }
                  }
                >
                  <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {loading || !data ? (
            <div
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                style={{
                  borderColor: ACCENT,
                  borderTopColor: "transparent",
                }}
              />
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Loading product data...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "verticals" && (
                <VerticalsGrid
                  verticals={data.verticals}
                  onSelectVertical={handleSelectVertical}
                />
              )}
              {activeTab === "connections" && (
                <CrossVerticalMap
                  verticals={data.verticals}
                  connections={data.connections}
                  features={data.features}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
