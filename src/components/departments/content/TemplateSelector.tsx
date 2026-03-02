"use client";

import { useState } from "react";
import { ImageIcon, ChevronDown, ChevronRight } from "lucide-react";
import {
  TEMPLATE_REGISTRY,
  TemplateRenderer,
  QuoteCard,
  CaptionCard,
  CarouselSlide,
  StatCard,
  ThoughtLeadership,
  DataViz,
  InfographicPin,
  ChecklistPin,
  StoryQuote,
  StoryTip,
} from "@/lib/templates";
import type { CharacterName, TemplateId, TemplateMeta } from "@/lib/templates";
import type { Platform } from "@/lib/data/content-engine";

const PLATFORM_TEMPLATES: Record<Platform, TemplateId[]> = {
  instagram: ["quote-card", "caption-card", "carousel-slide", "stat-card"],
  facebook: ["quote-card", "caption-card", "stat-card"],
  linkedin: ["thought-leadership", "data-viz"],
  x: ["thought-leadership", "data-viz"],
  pinterest: ["infographic-pin", "checklist-pin"],
};

const CHARACTERS: CharacterName[] = ["kai", "olive", "seren", "atlas", "pilar"];

interface TemplateSelectorProps {
  platform: Platform;
  sourceTitle: string;
  copy: string;
}

function extractQuote(copy: string): string {
  // Try to extract a punchy sentence from the copy
  const sentences = copy.split(/[.!?]\s+/).filter((s) => s.length > 20 && s.length < 200);
  return sentences[0] || copy.slice(0, 140);
}

function renderTemplateForPlatform(
  templateId: TemplateId,
  character: CharacterName,
  sourceTitle: string,
  copy: string,
) {
  const quote = extractQuote(copy);

  switch (templateId) {
    case "quote-card":
      return <QuoteCard character={character} quote={quote} attribution="Conceivable" attributionTitle="A Journey to Possibility" />;
    case "caption-card":
      return <CaptionCard character={character} text={quote} subtitle={sourceTitle} />;
    case "carousel-slide":
      return <CarouselSlide character={character} slideNumber={1} totalSlides={5} headline={sourceTitle} body={quote} />;
    case "stat-card":
      return <StatCard character={character} stat="NEW" context={quote} source="Conceivable" />;
    case "thought-leadership":
      return <ThoughtLeadership character={character} headline={sourceTitle} authorName="Kirsten Karchmer" authorTitle="CEO & Founder, Conceivable" />;
    case "data-viz":
      return <DataViz character={character} stat="NEW" headline={sourceTitle} context={quote} />;
    case "infographic-pin":
      return <InfographicPin character={character} headline={sourceTitle} tips={copy.split(/[.!?]\s+/).filter((s) => s.length > 15).slice(0, 5)} />;
    case "checklist-pin":
      return <ChecklistPin character={character} headline={sourceTitle} items={copy.split(/[.!?]\s+/).filter((s) => s.length > 15).slice(0, 5)} />;
    case "story-quote":
      return <StoryQuote character={character} quote={quote} attribution="Conceivable" />;
    case "story-tip":
      return <StoryTip character={character} tip={quote} category="Fertility Health" />;
    default:
      return null;
  }
}

export default function TemplateSelector({ platform, sourceTitle, copy }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState<CharacterName>("kai");

  const availableTemplates = PLATFORM_TEMPLATES[platform] || [];
  const templateMetas = availableTemplates
    .map((id) => TEMPLATE_REGISTRY.find((t) => t.id === id))
    .filter(Boolean) as TemplateMeta[];

  if (templateMetas.length === 0) return null;

  return (
    <div className="mt-3 border rounded-lg" style={{ borderColor: "var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium"
        style={{ color: "var(--primary)" }}
      >
        <ImageIcon size={12} />
        Generate Image Template
        {open ? <ChevronDown size={12} className="ml-auto" /> : <ChevronRight size={12} className="ml-auto" />}
      </button>

      {open && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--border)" }}>
          {/* Character picker */}
          <div className="flex items-center gap-1.5 mt-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>
              Character:
            </span>
            {CHARACTERS.map((c) => (
              <button
                key={c}
                onClick={() => setCharacter(c)}
                className="px-2 py-1 text-[10px] rounded-md capitalize"
                style={{
                  backgroundColor: character === c ? "var(--primary)" : "var(--background)",
                  color: character === c ? "#FFFFFF" : "var(--muted)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Template options */}
          <div className="grid grid-cols-2 gap-3">
            {templateMetas.map((tmeta) => (
              <div key={tmeta.id} className="space-y-1">
                <TemplateRenderer format={tmeta.format}>
                  {renderTemplateForPlatform(tmeta.id, character, sourceTitle, copy)}
                </TemplateRenderer>
                <p className="text-[10px] font-medium text-center" style={{ color: "var(--muted)" }}>
                  {tmeta.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
