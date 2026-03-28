export interface Partner {
  slug: string;
  name: string;
  show: string;
  episode: string;
  avatar: string;
  color: string;
  email: string;
  listeners: string | null;
  url: string | null;
}

export const PARTNERS: Partner[] = [
  { slug: "vanessa-root-remedy", name: "Vanessa", show: "Root & Remedy Podcast", episode: "How Functional Nutrition Can Transform Your Fertility", avatar: "V", color: "#1EAA55", email: "vanessaolywellness@gmail.com", listeners: "12K", url: "rootandremedy.com" },
  { slug: "matt-bennett-hrv", name: "Matt", show: "HRV Podcast", episode: "HRV & Fertility: The Data Your Doctor Isn't Tracking", avatar: "M", color: "#5A6FFF", email: "matt@optimalhrv.com", listeners: null, url: null },
  { slug: "dr-hilary-claire-wild-well", name: "Dr. Hilary", show: "Wild & Well Podcast", episode: "Women's Integrative Health with Kirsten Karchmer", avatar: "H", color: "#9686B9", email: "hello@drhilaryclaire.com", listeners: null, url: null },
  { slug: "eileen-march-woo-curious", name: "Eileen", show: "Woo Curious Podcast", episode: "Woo Meets Science: AI-Powered Fertility", avatar: "E", color: "#E37FB1", email: "eileen@myluminouslife.ca", listeners: null, url: null },
  { slug: "reena-goodwin-grow-wellth", name: "Reena", show: "Grow Your Wellth Podcast", episode: "Financial Health + Fertility Health with Kirsten Karchmer", avatar: "R", color: "#F1C028", email: "reena@facteurpr.com", listeners: null, url: null },
];

export function getPartnerBySlug(slug: string): Partner | null {
  return PARTNERS.find(p => p.slug === slug) || null;
}
