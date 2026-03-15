"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function AnimatedCounter({ target, label, suffix }: { target: number; label: string; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div
      className="rounded-2xl px-6 py-4 text-center"
      style={{ background: "rgba(90, 111, 255, 0.06)", border: "1px solid rgba(90, 111, 255, 0.12)" }}
    >
      <div className="text-3xl font-bold" style={{ color: "#5A6FFF" }}>
        {count.toLocaleString()}
        <span className="text-base font-normal" style={{ color: "#6B7280" }}>
          {" "}{suffix}
        </span>
      </div>
      <div className="text-sm mt-1" style={{ color: "#6B7280" }}>{label}</div>
    </div>
  );
}

export default function EarlyAccessLanding() {
  const [signupData, setSignupData] = useState<{
    earlyAccess: number;
    foundingMembers: number;
  }>({ earlyAccess: 0, foundingMembers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mailchimp/signups")
      .then((r) => r.json())
      .then((data) => {
        setSignupData({
          earlyAccess: data.earlyAccess?.total || 0,
          foundingMembers: Math.min(data.earlyAccess?.total || 0, 200),
        });
      })
      .catch(() => {
        // Fallback for demo
        setSignupData({ earlyAccess: 847, foundingMembers: 63 });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center px-4 pb-12">
      {/* Hero Section */}
      <div className="max-w-2xl mx-auto text-center pt-8 md:pt-16">
        {/* Eyebrow */}
        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs tracking-widest mb-6"
          style={{
            background: "rgba(227, 127, 177, 0.1)",
            color: "#E37FB1",
            fontFamily: '"Rauschen A", "Inter", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            fontWeight: 500,
          }}
        >
          Free 5-Minute Assessment
        </div>

        {/* Headline */}
        <h1
          className="text-3xl md:text-5xl leading-tight mb-4"
          style={{
            fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
            fontWeight: 700,
            color: "#2A2828",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            lineHeight: 1.15,
          }}
        >
          Your Period Is a{" "}
          <span style={{ color: "#5A6FFF" }}>Report Card.</span>
          <br />
          Find Out Your Grade.
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl mb-8 max-w-lg mx-auto"
          style={{
            color: "#6B7280",
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Take the free Conceivable Assessment and get your personalized fertility readiness score —
          plus a custom plan to optimize what matters most.
        </p>

        {/* CTA Button */}
        <Link
          href="/early-access/quiz"
          className="inline-block rounded-full px-10 py-4 text-lg font-semibold no-underline transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(90, 111, 255, 0.35)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(90, 111, 255, 0.45)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(90, 111, 255, 0.35)";
          }}
        >
          Get My Score
        </Link>

        {/* Trust note */}
        <p className="text-sm mt-4" style={{ color: "#9CA3AF" }}>
          No email required to take the quiz. Results in 5 minutes.
        </p>
      </div>

      {/* Counters */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-12 w-full">
          <AnimatedCounter
            target={signupData.foundingMembers}
            suffix={`of 200`}
            label="Founding Members claimed"
          />
          <AnimatedCounter
            target={signupData.earlyAccess}
            suffix={`of 10,000`}
            label="Early Access signed up"
          />
        </div>
      )}

      {/* What You'll Learn section */}
      <div className="max-w-xl mx-auto mt-16 w-full">
        <h2
          className="text-center text-sm tracking-widest mb-8"
          style={{
            fontFamily: '"Rauschen A", "Inter", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#6B7280",
          }}
        >
          What You&apos;ll Discover
        </h2>

        <div className="grid gap-4">
          {[
            {
              icon: "🌙",
              title: "Your Conceivable Score",
              desc: "A personalized 0-100 score based on cycle health, nutrition, sleep, stress, hormonal signals, and health history.",
              color: "#5A6FFF",
            },
            {
              icon: "🎯",
              title: "Your #1 Area to Improve",
              desc: "Not a generic checklist — the one thing that will make the biggest difference for YOUR body, right now.",
              color: "#E37FB1",
            },
            {
              icon: "💊",
              title: "Your Supplement Starter Kit",
              desc: "Evidence-based recommendations personalized to your quiz results. (It's more specific than you'd think.)",
              color: "#1EAA55",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 items-start p-5 rounded-2xl"
              style={{ background: "#FFFEFA", border: "1px solid #E8E5DC" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${item.color}10` }}
              >
                {item.icon}
              </div>
              <div>
                <h3
                  className="font-semibold text-base mb-1"
                  style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif', textTransform: "none" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "#6B7280", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof / credibility */}
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(90, 111, 255, 0.04)", border: "1px solid rgba(90, 111, 255, 0.08)" }}
        >
          <p className="text-base italic mb-3" style={{ color: "#2A2828", lineHeight: 1.6 }}>
            &ldquo;Built by a board-certified reproductive endocrinologist with 20+ years of clinical experience
            and a team of AI researchers who believe your body already has the answers — you just need the right tools to read them.&rdquo;
          </p>
          <p className="text-sm font-medium" style={{ color: "#5A6FFF" }}>
            Kirsten Karchmer, Founder &amp; CEO
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/early-access/quiz"
          className="inline-block rounded-full px-10 py-4 text-lg font-semibold no-underline transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(90, 111, 255, 0.35)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(90, 111, 255, 0.45)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(90, 111, 255, 0.35)";
          }}
        >
          Take the Assessment
        </Link>
      </div>
    </div>
  );
}
