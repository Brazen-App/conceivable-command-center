// ── Supplement Pack A/B Test Configuration ──
//
// Variant A (control): 8-pill pack (4 core + 4 personalized), no price shown
// Variant B (test):    5-pill pack (3 core + 2 personalized), $58/month
//
// Toggle between variants in Settings → Supplement Pack A/B Test
// Stored server-side in SiteConfig table (key: "pack-variant")

export type PackVariant = "A" | "B";

/**
 * Shopify variant ID for the "Personalized 30 Day Fertility Supplement Pack"
 * — the SKU the quiz funnel sells. Used by the results page to build the
 * pre-populated cart URL.
 */
export const PACK_SHOPIFY_VARIANT_ID = "47733105623272";
export const SHOPIFY_STORE_DOMAIN = "conceivable.com";

/**
 * Permanent discount code applied to every quiz checkout.
 * Created in Shopify (price_rule 1481879060712, discount_code 19293000696040)
 * — fixed -$41 off, restricted to the personalized pack variant, no expiration.
 * Brings $109 → $68 (founding member quiz price).
 */
export const QUIZ_DISCOUNT_CODE = "QUIZ-PACK68";

/**
 * Cart URL that pre-loads the personalized pack and applies the quiz discount.
 * Uses Shopify's /discount/{code} permalink which applies the code and then
 * redirects to the cart, so the price is already $58 when the buyer lands.
 */
export function buildPackCartUrl(): string {
  const cartPath = `/cart/${PACK_SHOPIFY_VARIANT_ID}:1?utm_source=quiz&utm_medium=results&utm_campaign=personalized_pack`;
  return `https://${SHOPIFY_STORE_DOMAIN}/discount/${QUIZ_DISCOUNT_CODE}?redirect=${encodeURIComponent(cartPath)}`;
}

export interface PackConfig {
  variant: PackVariant;
  label: string;
  description: string;
  pillCount: number;
  coreCount: number;
  personalizedCount: number;
  price: number | null; // null = no price shown
  priceLabel: string | null;
  coreSupplements: string[];
  valueProps: { icon: string; text: string; color: string }[];
}

export const PACK_VARIANTS: Record<PackVariant, PackConfig> = {
  A: {
    variant: "A",
    label: "8-Pill Pack (Control)",
    description: "4 core + 4 personalized supplements — no price displayed",
    pillCount: 8,
    coreCount: 4,
    personalizedCount: 4,
    price: null,
    priceLabel: null,
    coreSupplements: [
      "Methylated Folate",
      "CoQ10",
      "Vitamin D3",
      "Omega-3 (EPA/DHA)",
    ],
    valueProps: [
      {
        icon: "✓",
        text: "Personalized for you — based on your specific quiz answers, not a one-size-fits-all formula",
        color: "#1EAA55",
      },
      {
        icon: "✓",
        text: "Better quality — pharmaceutical-grade, third-party tested, bioavailable forms your body can actually use",
        color: "#5A6FFF",
      },
      {
        icon: "✓",
        text: "Lower price — up to 40% less than buying these individually, with no subscription lock-in",
        color: "#E37FB1",
      },
    ],
  },
  B: {
    variant: "B",
    label: "5-Pill Pack ($58)",
    description: "3 core + 2 personalized supplements — $58/month",
    pillCount: 5,
    coreCount: 3,
    personalizedCount: 2,
    price: 58,
    priceLabel: "$58/month",
    // Removed Omega-3 from core — it's the easiest to get from diet
    coreSupplements: ["Methylated Folate", "CoQ10", "Vitamin D3"],
    valueProps: [
      {
        icon: "✓",
        text: "Personalized for you — based on your specific quiz answers, not a one-size-fits-all formula",
        color: "#1EAA55",
      },
      {
        icon: "✓",
        text: "Better quality — pharmaceutical-grade, third-party tested, bioavailable forms your body can actually use",
        color: "#5A6FFF",
      },
      {
        icon: "✓",
        text: "Just $58/month — up to 50% less than buying these individually, no subscription lock-in",
        color: "#E37FB1",
      },
    ],
  },
};

export const DEFAULT_VARIANT: PackVariant = "A";

const SITE_CONFIG_KEY = "pack-variant";

// Fetch active variant from server (SiteConfig table)
export async function fetchActiveVariant(): Promise<PackVariant> {
  try {
    const res = await fetch(`/api/site-config?key=${SITE_CONFIG_KEY}`);
    const data = await res.json();
    if (data.value === "A" || data.value === "B") return data.value;
  } catch {
    // Fall back to default on error
  }
  return DEFAULT_VARIANT;
}

// Save active variant to server
export async function saveActiveVariant(variant: PackVariant): Promise<void> {
  await fetch("/api/site-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: SITE_CONFIG_KEY, value: variant }),
  });
}
