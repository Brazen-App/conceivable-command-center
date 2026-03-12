"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  Loader2,
  X,
  Eye,
  Copy,
  Check,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import PhoneFrame from "@/components/wireframes/PhoneFrame";
import { RECOVERY_SCORE_SCREENS } from "@/components/wireframes/RecoveryScoreScreens";
import { SEREN_SCREENS } from "@/components/wireframes/SerenScreens";
import { LUNA_SCREENS } from "@/components/wireframes/LunaScreens";
import { FOOD_TRAIN_SCREENS } from "@/components/wireframes/FoodTrainScreens";
import { PREPARATION_SCREENS } from "@/components/wireframes/PreparationScreens";

const B = "#5A6FFF";
const BB = "#ACB7FF";
const GRN = "#1EAA55";

/* ── Screen Registry by Experience Slug ─── */
interface ScreenDef {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
}

interface ScreenSet {
  label: string;
  screens: ScreenDef[];
}

const WIREFRAME_REGISTRY: Record<string, ScreenSet[]> = {
  postpartum: [
    { label: "Recovery Score", screens: RECOVERY_SCORE_SCREENS },
    { label: "Seren \u2014 Emotional Container", screens: SEREN_SCREENS },
    { label: "Luna \u2014 Breastfeeding Support", screens: LUNA_SCREENS },
    { label: "Food Train", screens: FOOD_TRAIN_SCREENS },
  ],
  pregnancy: [
    { label: "Postpartum Preparation", screens: PREPARATION_SCREENS },
    { label: "Luna \u2014 Prenatal Education", screens: [LUNA_SCREENS[2]] }, // Education card
  ],
};

/* ── Code Generation + Storage ─── */
const CODE_STORAGE_KEY = "wireframe-generated-code";

function getStoredCode(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CODE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function storeCode(screenId: string, code: string) {
  const stored = getStoredCode();
  stored[screenId] = code;
  localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(stored));
}

export default function WireframesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const screenSets = WIREFRAME_REGISTRY[slug] || [];

  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [viewingCode, setViewingCode] = useState<string | null>(null);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [expandedScreen, setExpandedScreen] = useState<string | null>(null);

  useEffect(() => {
    setCodeMap(getStoredCode());
  }, []);

  const handleGenerateCode = async (screen: ScreenDef) => {
    setGeneratingFor(screen.id);
    try {
      const res = await fetch("/api/product/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: slug,
          experienceName: slug === "postpartum" ? "Postpartum" : "Pregnancy",
          conversationType: "wireframe-code",
          messages: [
            {
              role: "user",
              content: `Generate production-ready React Native (Expo) code for this mobile app screen:

Screen: ${screen.title}
Description: ${screen.description}

Requirements:
- React Native with TypeScript
- Use StyleSheet.create for styles
- Use Conceivable brand colors: Blue #5A6FFF, Baby Blue #ACB7FF, Off-White #F9F7F0, Green #1EAA55, Pink #E37FB1, Yellow #F1C028, Red #E24D47, Teal #78C3BF, Purple #9686B9, Navy #356FB6
- Use Inter font for body text
- Include all UI elements shown in the wireframe description
- Include proper TypeScript types/interfaces
- Make it a complete, self-contained component
- Include comments for interaction handlers (navigation, data fetching, etc.)
- Export as default

Return ONLY the code, no markdown fences, no explanation.`,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const code = data.response || "// Code generation failed";
        storeCode(screen.id, code);
        setCodeMap((prev) => ({ ...prev, [screen.id]: code }));
        setViewingCode(screen.id);
      }
    } catch {
      // silent fail
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleCopy = () => {
    if (viewingCode && codeMap[viewingCode]) {
      navigator.clipboard.writeText(codeMap[viewingCode]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (screenSets.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Smartphone size={32} style={{ color: "#CCC", margin: "0 auto 12px" }} />
        <p style={{ fontSize: 14, color: "var(--muted)" }}>
          No wireframes available for this experience yet.
        </p>
        <Link
          href={`/departments/product/experiences/${slug}`}
          style={{ fontSize: 13, color: B, marginTop: 8, display: "inline-block" }}
        >
          &larr; Back to experience
        </Link>
      </div>
    );
  }

  const totalScreens = screenSets.reduce((sum, s) => sum + s.screens.length, 0);
  const codedScreens = screenSets.reduce(
    (sum, s) => sum + s.screens.filter((sc) => codeMap[sc.id]).length,
    0
  );

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${B}10, ${BB}08)`,
          border: `1px solid ${B}15`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/departments/product/experiences/${slug}`}
              className="flex items-center gap-1.5 text-xs font-medium mb-2"
              style={{ color: B }}
            >
              <ArrowLeft size={12} />
              Back to {slug}
            </Link>
            <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Wireframes \u2014 {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {totalScreens} screens across {screenSets.length} screen sets. Mobile-first layouts matching the Figma design system.
            </p>
          </div>
          <div className="flex gap-4 text-center shrink-0">
            <div>
              <p className="text-2xl font-bold" style={{ color: B }}>{totalScreens}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Screens</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: codedScreens > 0 ? GRN : "var(--muted)" }}>{codedScreens}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Sets */}
      {screenSets.map((set) => (
        <div key={set.label} className="mb-8">
          <h3
            className="text-[11px] font-bold uppercase tracking-wider mb-3 px-1"
            style={{ color: "var(--foreground)" }}
          >
            {set.label}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {set.screens.map((screen) => {
              const Screen = screen.component;
              const hasCode = !!codeMap[screen.id];
              const isGenerating = generatingFor === screen.id;

              return (
                <div
                  key={screen.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: hasCode ? `2px solid ${GRN}40` : "1px solid var(--border)",
                  }}
                >
                  {/* Phone Preview */}
                  <div
                    className="relative cursor-pointer"
                    style={{
                      height: 280,
                      overflow: "hidden",
                      backgroundColor: "#F5F5F5",
                      padding: "12px 12px 0",
                    }}
                    onClick={() => setExpandedScreen(expandedScreen === screen.id ? null : screen.id)}
                  >
                    <div style={{ pointerEvents: "none" }}>
                      <PhoneFrame scale={0.45}>
                        <Screen />
                      </PhoneFrame>
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    >
                      <Eye size={24} style={{ color: "#FFF" }} />
                    </div>
                  </div>

                  {/* Info + Actions */}
                  <div className="p-3">
                    <h4 className="text-xs font-bold mb-0.5" style={{ color: "var(--foreground)" }}>
                      {screen.title}
                    </h4>
                    <p className="text-[10px] leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                      {screen.description}
                    </p>

                    <button
                      onClick={() =>
                        hasCode ? setViewingCode(screen.id) : handleGenerateCode(screen)
                      }
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium disabled:opacity-50 transition-all"
                      style={{
                        backgroundColor: hasCode ? `${GRN}12` : `${B}10`,
                        color: hasCode ? GRN : B,
                        border: `1px solid ${hasCode ? `${GRN}25` : `${B}20`}`,
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Generating...
                        </>
                      ) : hasCode ? (
                        <>
                          <Code2 size={12} />
                          View Code
                        </>
                      ) : (
                        <>
                          <Code2 size={12} />
                          Generate Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Expanded Screen Modal */}
      {expandedScreen && (() => {
        const screen = screenSets.flatMap((s) => s.screens).find((s) => s.id === expandedScreen);
        if (!screen) return null;
        const Screen = screen.component;
        return (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedScreen(null)}
          >
            <div onClick={(e) => e.stopPropagation()} className="relative">
              <button
                onClick={() => setExpandedScreen(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
              >
                <X size={14} />
              </button>
              <PhoneFrame scale={0.85}>
                <Screen />
              </PhoneFrame>
            </div>
          </div>
        );
      })()}

      {/* Code Viewer Modal */}
      {viewingCode && codeMap[viewingCode] && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingCode(null)}
        >
          <div
            className="rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            style={{ backgroundColor: "#1E1E2E" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code2 size={16} style={{ color: BB }} />
                <span className="text-sm font-medium text-white">
                  {screenSets.flatMap((s) => s.screens).find((s) => s.id === viewingCode)?.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                  React Native
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#FFF" }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => setViewingCode(null)}>
                  <X size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            </div>
            <pre
              className="flex-1 overflow-auto p-4 text-xs leading-relaxed"
              style={{ color: "#E0E0E0", fontFamily: "monospace" }}
            >
              {codeMap[viewingCode]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
