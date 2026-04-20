"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Facebook Pixel helper
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
function trackFBEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
}

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

// Lead capture popup
function QuizPopup({ onClose }: { onClose: () => void }) {
  const [popupEmail, setPopupEmail] = useState("");
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [popupSubmitting, setPopupSubmitting] = useState(false);

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupEmail || popupSubmitting) return;
    setPopupSubmitting(true);
    try {
      const res = await fetch("/api/early-access/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: popupEmail }),
      });
      if (res.ok) {
        setPopupSubmitted(true);
        trackFBEvent("Lead", { content_name: "Landing Page Popup" });
      }
    } catch {
      // silent
    } finally {
      setPopupSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(42, 40, 40, 0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        style={{ background: "#F9F7F0", border: "1px solid #E8E5DC" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
          style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
        >
          &times;
        </button>

        {popupSubmitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#2A2828" }}>You&apos;re in!</h3>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Check your inbox. Now let&apos;s see what your body is telling you.</p>
            <Link
              href="https://conceivable-quiz.vercel.app?start=true"
              className="inline-block rounded-full px-8 py-3.5 text-base font-semibold no-underline"
              style={{ background: "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)", color: "#fff" }}
            >
              Take the Quiz
            </Link>
          </div>
        ) : (
          <>
            <h3
              className="text-2xl font-bold mb-2 text-center"
              style={{
                fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
                color: "#2A2828",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Get Your <span style={{ color: "#5A6FFF" }}>Free</span> Fertility Score
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: "#6B7280", lineHeight: 1.6 }}>
              Find out where you stand in 5 minutes. Plus get a personalized supplement recommendation.
            </p>

            <form onSubmit={handlePopupSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={popupEmail}
                onChange={(e) => setPopupEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl px-4 py-3.5 text-base outline-none"
                style={{ background: "#FFFEFA", border: "2px solid #E8E5DC", color: "#2A2828" }}
                onFocus={(e) => (e.target.style.borderColor = "#5A6FFF")}
                onBlur={(e) => (e.target.style.borderColor = "#E8E5DC")}
              />
              <button
                type="submit"
                disabled={popupSubmitting || !popupEmail}
                className="w-full rounded-xl py-3.5 text-base font-semibold"
                style={{
                  background: popupEmail ? "linear-gradient(135deg, #5A6FFF 0%, #7B8CFF 100%)" : "#E8E5DC",
                  color: popupEmail ? "#fff" : "#9CA3AF",
                  border: "none",
                  cursor: popupEmail ? "pointer" : "default",
                }}
              >
                {popupSubmitting ? "Saving..." : "Take the Quiz"}
              </button>
            </form>
            <p className="text-xs text-center mt-3" style={{ color: "#9CA3AF" }}>No spam, ever. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function EarlyAccessLanding() {
  const [signupData, setSignupData] = useState<{
    earlyAccess: number;
    foundingMembers: number;
  }>({ earlyAccess: 0, foundingMembers: 0 });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // FB Pixel — track home page visit
    trackFBEvent("ViewContent", { content_name: "Landing Page", content_category: "Home" });

    fetch("/api/mailchimp/signups")
      .then((r) => r.json())
      .then((data) => {
        setSignupData({
          earlyAccess: data.earlyAccess?.total || 0,
          foundingMembers: Math.min(data.earlyAccess?.total || 0, 200),
        });
      })
      .catch(() => {
        setSignupData({ earlyAccess: 847, foundingMembers: 63 });
      })
      .finally(() => setLoading(false));

    // Show popup on exit intent (mouse leaves viewport top)
    const handleExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem("popupDismissed")) {
        setShowPopup(true);
        document.removeEventListener("mouseout", handleExitIntent);
      }
    };
    document.addEventListener("mouseout", handleExitIntent);
    return () => document.removeEventListener("mouseout", handleExitIntent);
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("popupDismissed", "1");
  };

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
          className="text-3xl md:text-5xl leading-tight mb-6"
          style={{
            fontFamily: '"Youth", "Montserrat", "Inter", sans-serif',
            fontWeight: 700,
            color: "#2A2828",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            lineHeight: 1.15,
          }}
        >
          It&apos;s your body,{" "}
          <span style={{ color: "#5A6FFF" }}>and your baby.</span>
        </h1>

        {/* Three pillars */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {[
            { check: true, text: "Personalized for you" },
            { check: true, text: "Highest quality" },
            { check: true, text: "More affordable" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 text-lg"
              style={{ color: "#2A2828", fontFamily: '"Inter", sans-serif' }}
            >
              <span style={{ color: item.check ? "#1EAA55" : "#E24D47", fontSize: "20px", fontWeight: 700 }}>
                {item.check ? "✓" : "✗"}
              </span>
              <span style={{ fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="https://conceivable-quiz.vercel.app?start=true"
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
          Take the Quiz
        </Link>

        {/* Trust note */}
        <p className="text-sm mt-4" style={{ color: "#9CA3AF" }}>
          No email required. Results in 5 minutes.
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
            &ldquo;Built by a board-certified reproductive health expert with 20+ years of clinical experience
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
          href="https://conceivable-quiz.vercel.app?start=true"
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
          Take the Quiz
        </Link>
      </div>

      {/* Lead capture popup */}
      {showPopup && <QuizPopup onClose={dismissPopup} />}
    </div>
  );
}
