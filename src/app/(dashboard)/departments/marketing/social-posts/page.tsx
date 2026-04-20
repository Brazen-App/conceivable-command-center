"use client";

import { useState } from "react";

const C = {
  bg: "#0C0C0B", surface: "#141412", border: "#1E1E1C",
  blue: "#5A6FFF", green: "#1EAA55", pink: "#E37FB1", yellow: "#F1C028",
  text: "#F0EDE4", textMid: "#B8B4AC", textMuted: "#686460",
};

interface Post {
  id: string;
  day: string;
  week: number;
  image: string;
  linkedin: string;
  twitter: string;
  bluesky: string;
  status: "draft" | "approved" | "posted";
}

const POSTS: Post[] = [
  // WEEK 1
  { id: "w1-mon-1", day: "Monday", week: 1, image: "w1-mon-1.png",
    linkedin: `$10B went into collecting women's health data. Zero went into knowing what to do with it.\n\nThe entire digital health industry built a very sophisticated mirror.\n\nLooking at yourself doesn't make you well.\n\nI spent 25 years doing what no app could — reading the patterns in a woman's cycle, her temperature, her energy, her symptoms, and telling her exactly what was wrong and what to do about it.\n\nThat's not tracking. That's clinical intelligence.\n\nAnd now it's a system.\n\n#WomensHealth #FemTech #FertilityHealth #ReproductiveHealth #DigitalHealth`,
    twitter: `$10B went into collecting women's health data. Zero went into knowing what to do with it.`,
    bluesky: `The digital health industry spent $10 billion answering the wrong question. "What is her data?" Nobody funded: what should she do about it?`,
    status: "draft" },
  { id: "w1-mon-2", day: "Monday", week: 1, image: "w1-mon-2.png",
    linkedin: `I spent 25 years doing manually what Conceivable now does automatically.\n\nA woman would come in after two years of trying. Labs normal. Everything "fine." Her doctor had no more answers.\n\nI would spend the first hour just asking questions.\n\nWhen do you spot? How long do you bleed? What's your energy like the week before your period? Does your temperature ever cross 98°F after ovulation?\n\nThe pattern would emerge. It was always there.\n\nThe clinic was the proof of concept. Conceivable is the infrastructure.\n\n#Fertility #ReproductiveHealth #WomensHealth #HealthTech`,
    twitter: `The clinic was the proof of concept.\n\nConceivable is the infrastructure.\n\n25 years. 10,000 pregnancies. Now it runs without me in the room.`,
    bluesky: `I built Conceivable because I sat across from brilliant women for 25 years who had tried everything and been told "your labs are normal." The data was never normal. We just didn't have a system to read it.`,
    status: "draft" },
  { id: "w1-mon-3", day: "Monday", week: 1, image: "w1-mon-3.png",
    linkedin: `The first clinical intelligence system for women's health.\n\nHere's why that category didn't exist until now.\n\nTracking was easier to build. Cheaper to fund. Simpler to explain.\n\n"We show you your data" is a product. "We tell you what to do about it" is a system — and systems require 25 years of pattern recognition baked in before they work.\n\nNobody had that. I did.\n\nThat's the company.\n\n#FemTech #HealthTech #WomensHealth #AI #Innovation`,
    twitter: `"We show you your data" is a product.\n\n"We tell you what to do about it" is a system.\n\nSystems require 25 years of pattern recognition baked in before they work.\n\nThat's the company.`,
    bluesky: `The first clinical intelligence system for women's health. The category didn't exist because nobody had 25 years of pattern recognition to bake into the system. Until now.`,
    status: "draft" },
  { id: "w1-wed-1", day: "Wednesday", week: 1, image: "w1-wed-1.png",
    linkedin: `39% of women struggling to conceive bleed for 1 day or less.\n\nThat's not in their labs. It's in their data.\n\nIt's a marker of uterine lining insufficiency — the lining doesn't build properly, the egg has nowhere to implant, and the standard panel comes back normal.\n\n62% spot before their period starts. 54% never see their temperature rise above 98°F after ovulation.\n\nThese aren't obscure findings. This is data every woman generates every single month.\n\nNobody is reading it.\n\nWe are.\n\n#Fertility #Infertility #WomensHealth #Data`,
    twitter: `39% of women struggling to conceive bleed for 1 day or less.\n\nNot in their labs.\n\nIn their data.\n\nFixable.`,
    bluesky: `New from our quiz data (N=312): 39% of women struggling to conceive bleed for 1 day or less. It's a marker of uterine lining insufficiency. In the data, not the labs. Completely addressable.`,
    status: "draft" },
  { id: "w1-wed-2", day: "Wednesday", week: 1, image: "w1-wed-2.png",
    linkedin: `The patient who came to me after three failed IVF cycles.\n\nHer labs were perfect. Her doctor was out of answers. She was 34 and starting to lose hope.\n\nI looked at her cycle data. Her temperature never crossed 98°F after ovulation. She spotted for four days before every period. Her energy crashed every month around day 18.\n\nThese signals were there the entire time. Readable. Addressable. Nobody looked.\n\nSix months later she was pregnant. No more IVF.\n\nI've seen this pattern hundreds of times. Kai sees it now instead of me.\n\n#Fertility #IVF #Infertility #WomensHealth #Conceivable`,
    twitter: `Three failed IVF cycles. Perfect labs.\n\nHer temperature never crossed 98°F. Spotting 4 days before every period. Energy crashed at day 18.\n\nSix months later: pregnant. No more IVF.\n\nThe data was always there.`,
    bluesky: `Three failed IVF cycles. Labs perfect. Nobody looked at her actual cycle data. Temperature, spotting pattern, energy — all readable. All addressable. Six months later: pregnant. No more IVF.`,
    status: "draft" },
  { id: "w1-wed-3", day: "Wednesday", week: 1, image: "w1-wed-3.png",
    linkedin: `What if your period could talk?\n\nIt already is.\n\nEvery cycle, your body generates data — bleeding duration, clotting, spotting, temperature shifts, energy patterns, pain, PMS timing.\n\nEach signal tells a story about your hormonal balance, your uterine lining, your ovulation quality, your progesterone, your inflammation.\n\nThe problem was never the data. It was that nobody spoke the language.\n\n25 years of clinical practice taught me how to listen. Conceivable teaches the system.\n\n#WomensHealth #PeriodHealth #Fertility #Hormones`,
    twitter: `What if your period could talk?\n\nIt already is.\n\nYou just need someone who speaks the language.`,
    bluesky: `What if your period could talk? It already is. Every cycle generates signals about your hormones, lining, ovulation, and inflammation. The problem was never the data — nobody was reading it.`,
    status: "draft" },
  { id: "w1-fri-1", day: "Friday", week: 1, image: "w1-fri-1.png",
    linkedin: `Most pregnancy loss isn't mysterious.\n\nThe factors are subclinical — meaning they sit below the diagnostic threshold that makes a doctor act.\n\nThey show up in temperature patterns. In bleeding duration. In the days before a period starts. In energy trends across the second half of your cycle.\n\nThey don't show up in bloodwork.\n\nThis is what makes it so devastating. Women are told everything is "normal" when the data says otherwise.\n\nConceivable reads all of it.\n\n#Miscarriage #PregnancyLoss #Fertility #WomensHealth`,
    twitter: `Most pregnancy loss isn't mysterious.\n\nIt's subclinical.\n\nThe data was always there. Nobody was reading it.`,
    bluesky: `Most pregnancy loss isn't mysterious. The factors are subclinical — below the threshold that makes a doctor act. They show up in temperature, bleeding, and energy patterns. Not in bloodwork. Conceivable reads all of it.`,
    status: "draft" },
  { id: "w1-fri-2", day: "Friday", week: 1, image: "w1-fri-2.png",
    linkedin: `What 10,000 pregnancies taught me that no medical textbook ever did.\n\nPatterns repeat. Not because women are the same — but because the underlying mechanisms are finite, readable, and addressable.\n\nShort second half of the cycle. Low temperatures after ovulation. Pre-period spotting. Fatigue in the two weeks after ovulation. Clotting.\n\nI saw these combinations so many times I could predict the intervention before the conversation finished.\n\nThat's not magic. That's data. And data scales.\n\n#Fertility #ReproductiveHealth #ClinicalData #PatternRecognition`,
    twitter: `10,000 pregnancies taught me what no textbook ever did.\n\nPatterns repeat. They're finite, readable, and fixable.\n\nThat's not magic. That's data. And data scales.`,
    bluesky: `What 10,000 pregnancies taught me: patterns repeat. Not because women are the same — but because the underlying mechanisms are finite and readable. That's not magic. That's data. And data scales.`,
    status: "draft" },
  { id: "w1-fri-3", day: "Friday", week: 1, image: "w1-fri-3.png",
    linkedin: `29 patent applications across 8 families protect the full system.\n\nThe diagnostic layer. The predictive layer. The prescriptive layer. The feedback loop that gets smarter every cycle.\n\nThis isn't a feature set. It's an architecture.\n\nAny competitor can copy one piece. Nobody copies the system.\n\nThat's the moat.\n\n#IP #Patents #HealthTech #FemTech`,
    twitter: `29 patent applications. 8 families.\n\nThe diagnostic layer. The predictive layer. The prescriptive layer. The feedback loop.\n\nAny competitor can copy one piece. Nobody copies the system.`,
    bluesky: `29 patent applications across 8 families. Diagnostic, predictive, prescriptive, and adaptive layers. Any competitor can copy one piece. Nobody copies the system.`,
    status: "draft" },
];

export default function SocialPostsPage() {
  const [posts, setPosts] = useState(POSTS);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "draft" | "approved" | "posted">("all");

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);
  const selectedPost = posts.find(p => p.id === selected);

  const approve = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "approved" as const } : p));
  const approveAll = () => setPosts(prev => prev.map(p => ({ ...p, status: "approved" as const })));

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.bg, minHeight: "100vh", padding: 24, color: C.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Social Posts — Review & Approve</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Week 1 · LinkedIn / X / Bluesky · {posts.length} posts</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "draft", "approved", "posted"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: filter === f ? `${C.blue}20` : "transparent",
              color: filter === f ? C.blue : C.textMuted,
              border: `1px solid ${filter === f ? C.blue : C.border}`, cursor: "pointer",
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
          <button onClick={approveAll} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: C.green, color: "white", border: "none", cursor: "pointer",
          }}>Approve All ✓</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Post list */}
        <div style={{ width: 360, flexShrink: 0 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{
              padding: "14px 16px", borderRadius: 10, marginBottom: 8, cursor: "pointer",
              background: selected === p.id ? C.surface : "transparent",
              border: `1px solid ${selected === p.id ? C.blue + "40" : C.border}`,
              transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.day}</span>
                  <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>Week {p.week}</span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                  background: p.status === "approved" ? `${C.green}20` : p.status === "posted" ? `${C.blue}20` : `${C.yellow}20`,
                  color: p.status === "approved" ? C.green : p.status === "posted" ? C.blue : C.yellow,
                }}>{p.status.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 12, color: C.textMid, marginTop: 6, lineHeight: 1.4 }}>
                {p.linkedin.slice(0, 80)}...
              </p>
            </div>
          ))}
        </div>

        {/* Post detail */}
        {selectedPost ? (
          <div style={{ flex: 1, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, overflowY: "auto", maxHeight: "85vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{selectedPost.day} — Week {selectedPost.week}</h2>
              {selectedPost.status !== "approved" && (
                <button onClick={() => approve(selectedPost.id)} style={{
                  padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: C.green, color: "white", border: "none", cursor: "pointer",
                }}>Approve ✓</button>
              )}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: "0.1em", marginBottom: 8 }}>IMAGE</div>
            <div style={{ background: C.bg, borderRadius: 10, padding: 4, marginBottom: 24, textAlign: "center" }}>
              <p style={{ fontSize: 12, color: C.textMuted, padding: 16 }}>📁 Desktop/social-posts/{selectedPost.image}</p>
            </div>

            {[
              { label: "LINKEDIN", text: selectedPost.linkedin, color: "#0A66C2" },
              { label: "X / TWITTER", text: selectedPost.twitter, color: C.text },
              { label: "BLUESKY", text: selectedPost.bluesky, color: "#0085FF" },
            ].map(p => (
              <div key={p.label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: p.color, letterSpacing: "0.1em", marginBottom: 8 }}>{p.label}</div>
                <div style={{
                  background: C.bg, borderRadius: 10, padding: 16,
                  fontSize: 14, color: C.textMid, lineHeight: 1.7, whiteSpace: "pre-wrap",
                  border: `1px solid ${C.border}`,
                }}>{p.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}>
            ← Select a post to review
          </div>
        )}
      </div>
    </div>
  );
}
