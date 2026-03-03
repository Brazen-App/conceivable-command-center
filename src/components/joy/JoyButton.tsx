"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type AgentDivision = "executive-coach" | "marketing" | "legal" | "scientific-research" | "content-engine";

interface JoyButtonProps {
  /** Which agent division to route to */
  agent?: AgentDivision;
  /** The pre-filled prompt Joy will receive */
  prompt: string;
  /** Button label (displayed after the Sparkles icon) */
  label: string;
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Optional icon override (defaults to Sparkles) */
  icon?: ReactNode;
  /** Optional custom icon size */
  iconSize?: number;
}

const VARIANT_STYLES = {
  primary: {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white",
    style: { backgroundColor: "#5A6FFF" },
  },
  secondary: {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
    style: { backgroundColor: "#5A6FFF14", color: "#5A6FFF" },
  },
  ghost: {
    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
    style: { backgroundColor: "var(--border)", color: "var(--foreground)" },
  },
};

export default function JoyButton({
  agent = "executive-coach",
  prompt,
  label,
  variant = "primary",
  icon,
  iconSize = 11,
}: JoyButtonProps) {
  const router = useRouter();
  const variantConf = VARIANT_STYLES[variant];

  return (
    <button
      className={variantConf.className}
      style={variantConf.style}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/agents/${agent}?prompt=${encodeURIComponent(prompt)}`);
      }}
    >
      {icon ?? <Sparkles size={iconSize} />}
      {label}
    </button>
  );
}
