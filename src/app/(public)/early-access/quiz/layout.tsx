import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fertility Quiz — What Supplements Does Your Body Need?",
  description:
    "Answer 14 science-backed questions about your cycle, energy, hormones, and health history. Get a personalized supplement protocol in 5 minutes — built by Kirsten Karchmer, MSOM, with 25 years of reproductive medicine experience.",
  robots: { index: false }, // Don't index the quiz mid-flow
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
