"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { TEMPLATE_DIMENSIONS, type TemplateFormat } from "./brand";

interface TemplateRendererProps {
  format: TemplateFormat;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a template in a fixed-dimension container and provides download functionality.
 * The container renders at a scaled-down preview size but exports at full resolution.
 */
export function TemplateRenderer({ format, children, className }: TemplateRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dims = TEMPLATE_DIMENSIONS[format];

  // Scale factor for preview (fit within ~400px width)
  const previewScale = format === "story" ? 200 / dims.width : format === "pinterest" ? 240 / dims.width : 320 / dims.width;

  const handleDownload = useCallback(async () => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        width: dims.width,
        height: dims.height,
        pixelRatio: 1,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `conceivable-${format}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export template:", err);
    }
  }, [format, dims]);

  return (
    <div className={className}>
      {/* Scaled preview */}
      <div
        style={{
          width: dims.width * previewScale,
          height: dims.height * previewScale,
          overflow: "hidden",
          borderRadius: 8,
          border: "1px solid var(--border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: "top left",
            width: dims.width,
            height: dims.height,
          }}
        >
          <div ref={ref} style={{ width: dims.width, height: dims.height, position: "relative" }}>
            {children}
          </div>
        </div>
      </div>
      {/* Download button */}
      <button
        onClick={handleDownload}
        className="mt-2 w-full text-[10px] font-medium py-1.5 rounded-lg transition-colors"
        style={{
          color: "var(--muted)",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        Download PNG
      </button>
    </div>
  );
}
