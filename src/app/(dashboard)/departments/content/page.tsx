import { PenTool } from "lucide-react";

export default function ContentDepartmentPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#1EAA5512" }}
          >
            <PenTool size={20} style={{ color: "#1EAA55" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
              Content Engine
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              The Mouth — 100 Pieces / Day
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border p-6 mb-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Current Status
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Content pipeline setup in progress. The engine will transform 1,200+ hours of podcast content,
          blog posts, and research into 100 daily multi-platform pieces. Source material library,
          AI generation pipeline, and brand voice enforcement coming in Phase 3.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Daily Output", count: "0 / 100", desc: "Target: 100 pieces per day" },
          { title: "Source Library", count: "Not populated", desc: "Podcasts, research, blogs" },
          { title: "Platforms", count: "6 channels", desc: "IG, TikTok, LI, X, YT, Blog" },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
              {card.title}
            </p>
            <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {card.count}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
