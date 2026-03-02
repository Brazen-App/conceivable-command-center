"use client";

import { useState } from "react";
import { Palette, Download, Filter } from "lucide-react";
import {
  TEMPLATE_REGISTRY,
  TemplateRenderer,
  QuoteCard,
  StatCard,
  TipCard,
  TwitterScreenshot,
  CaptionCard,
  CarouselSlide,
  ThoughtLeadership,
  DataViz,
  InfographicPin,
  ChecklistPin,
  RecipePin,
  StoryQuote,
  StoryTip,
} from "@/lib/templates";
import type { CharacterName, TemplateFormat } from "@/lib/templates";

const CHARACTERS: { value: CharacterName; label: string }[] = [
  { value: "kai", label: "Kai" },
  { value: "olive", label: "Olive" },
  { value: "seren", label: "Seren" },
  { value: "atlas", label: "Atlas" },
  { value: "pilar", label: "Pilar" },
];

const FORMAT_FILTERS: { value: TemplateFormat | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "square", label: "Square" },
  { value: "landscape", label: "Landscape" },
  { value: "pinterest", label: "Pinterest" },
  { value: "story", label: "Story" },
];

function renderTemplate(id: string, character: CharacterName) {
  switch (id) {
    case "quote-card":
      return (
        <QuoteCard
          character={character}
          quote="Fertility is not just about biology — it's about understanding your whole body as an interconnected system."
          attribution="Dr. Sarah Chen"
          attributionTitle="Reproductive Endocrinologist"
        />
      );
    case "stat-card":
      return (
        <StatCard
          character={character}
          stat="73%"
          context="of women who tracked their fertility markers with Conceivable saw measurable improvement within 90 days"
          source="Conceivable Internal Study, 2025"
        />
      );
    case "tip-card":
      return (
        <TipCard
          character={character}
          tip="Your basal body temperature shifts by as little as 0.2°F around ovulation. Tracking this tiny change over time reveals powerful patterns about your cycle health."
          category="Cycle Tracking"
        />
      );
    case "twitter-screenshot":
      return (
        <TwitterScreenshot
          character={character}
          displayName="Conceivable"
          handle="@conceivable_ai"
          tweetText="Just published our research on how AI-driven fertility tracking outperforms traditional methods by 3x in predicting fertile windows. The future of reproductive health is personalized. 🧬"
          likes={2400}
          retweets={847}
          replies={312}
          date="Feb 28, 2026"
        />
      );
    case "caption-card":
      return (
        <CaptionCard
          character={character}
          text="Your body tells a story every single day. We're just helping you read it."
          subtitle="A Journey to Possibility"
        />
      );
    case "carousel-slide":
      return (
        <CarouselSlide
          character={character}
          slideNumber={1}
          totalSlides={5}
          headline="5 Things Your Cycle Is Telling You"
          body="Your menstrual cycle is one of the most powerful diagnostic tools available. Here's what the latest research reveals about reading the signals your body sends every month."
        />
      );
    case "thought-leadership":
      return (
        <ThoughtLeadership
          character={character}
          headline="Why the fertility industry needs to rethink how we measure success"
          authorName="Kirsten Karchmer"
          authorTitle="CEO & Founder, Conceivable"
        />
      );
    case "data-viz":
      return (
        <DataViz
          character={character}
          stat="3.2x"
          headline="Better prediction accuracy with AI-driven cycle analysis"
          context="Our AI models analyze over 40 biomarkers simultaneously, identifying patterns that traditional tracking methods miss entirely."
          source="Conceivable Research, 2025"
        />
      );
    case "infographic-pin":
      return (
        <InfographicPin
          character={character}
          headline="5 Science-Backed Ways to Support Your Fertility"
          tips={[
            "Track your basal body temperature every morning before getting out of bed",
            "Prioritize 7-9 hours of quality sleep — melatonin directly affects egg quality",
            "Reduce inflammatory foods: processed sugars, seed oils, and excess alcohol",
            "Practice stress reduction daily — cortisol disrupts your hormonal cascade",
            "Move your body 30 minutes daily, but avoid over-exercising",
          ]}
        />
      );
    case "checklist-pin":
      return (
        <ChecklistPin
          character={character}
          headline="5 Signs Your Cycle Is Healthier Than You Think"
          items={[
            "Your period arrives within a 2-day window each month",
            "You notice clear cervical mucus mid-cycle",
            "Your cycle length is between 26-32 days",
            "You have minimal PMS symptoms",
            "Your period lasts 4-6 days with moderate flow",
          ]}
        />
      );
    case "recipe-pin":
      return (
        <RecipePin
          character={character}
          title="Fertility-Boosting Golden Milk Latte"
          prepTime="5 minutes"
          ingredients={[
            "1 cup organic oat milk",
            "1 tsp turmeric (anti-inflammatory)",
            "½ tsp cinnamon (blood sugar support)",
            "1 tsp maca powder (hormone balance)",
            "Raw honey to taste (antioxidants)",
            "Pinch of black pepper (absorption)",
          ]}
          benefit="Turmeric and maca work synergistically to reduce inflammation and support hormonal balance — two key factors in fertility optimization."
        />
      );
    case "story-quote":
      return (
        <StoryQuote
          character={character}
          quote="Every woman deserves to understand her own body. That understanding is the first step to possibility."
          attribution="Kirsten Karchmer, Founder"
        />
      );
    case "story-tip":
      return (
        <StoryTip
          character={character}
          tip="Track your resting heart rate. A sudden dip can signal ovulation 24 hours before it happens."
          category="Fertility Hack"
          number={1}
        />
      );
    default:
      return null;
  }
}

export default function TemplatePreviewPage() {
  const [character, setCharacter] = useState<CharacterName>("kai");
  const [formatFilter, setFormatFilter] = useState<TemplateFormat | "all">("all");

  const filteredTemplates = TEMPLATE_REGISTRY.filter(
    (t) => formatFilter === "all" || t.format === formatFilter
  );

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--primary-light)" }}>
            <Palette className="w-5 h-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Content Templates
            </h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              13 branded templates across 4 formats — preview and download
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Character selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Character
          </span>
          <div className="flex gap-1">
            {CHARACTERS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCharacter(c.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: character === c.value ? "var(--primary)" : "var(--surface)",
                  color: character === c.value ? "#FFFFFF" : "var(--muted)",
                  border: `1px solid ${character === c.value ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
          <div className="flex gap-1">
            {FORMAT_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFormatFilter(f.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: formatFilter === f.value ? "var(--surface)" : "transparent",
                  color: formatFilter === f.value ? "var(--foreground)" : "var(--muted)",
                  border: `1px solid ${formatFilter === f.value ? "var(--border)" : "transparent"}`,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((tmeta) => (
          <div key={tmeta.id} className="space-y-2">
            <TemplateRenderer format={tmeta.format}>
              {renderTemplate(tmeta.id, character)}
            </TemplateRenderer>
            <div className="px-1">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {tmeta.name}
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {tmeta.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {tmeta.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
