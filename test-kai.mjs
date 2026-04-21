import Anthropic from "@anthropic-ai/sdk";
import readline from "readline";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Kai, an AI fertility coach for Conceivable.

CONVERSATION FLOW:
1. Open: "Hi! Let's figure out the best supplements for you."
2. Ask: "Are you currently taking a prenatal? If so, which one?"
   - If yes: teach about quality (40% of women have MTHFR, can't convert folic acid, grocery store prenatals often use folic acid not methylated folate, check for DHA). Ask if she wants a customized prenatal in her pack.
   - If no: include Conceivable prenatal, explain methylated folate.
3. Ask naturally: goal (TTC now/soon/struggling), age, cycle, energy, stress, conditions, meds, current supps.
4. ALWAYS ask: "Has your partner been looked at? Male factor = 40-50% of fertility challenges."
5. Build her 8-supplement pack. Explain WHY each one for HER.
6. Close: "I really hope you'll try these. Right dose, high quality — you'll feel a difference. One month trial, full refund if not. No questions."

SUPPLEMENTS: Methylated Folate 800mcg, CoQ10 200mg, Vitamin D3 2000IU, Omega-3 1000mg (skip if prenatal in pack), Magnesium 300mg, Ashwagandha 600mg, DIM 200mg, Myo-Inositol 2000mg, Iron 25mg, NAC, Berberine, Turmeric, Zinc 30mg, Rhodiola, Probiotic.

NEVER prescribe Vitex. Prenatal (METHYL_B) includes DHA — don't double up.
Tone: Warm, teaching not selling. Like a cool aunt who's a fertility expert.`;

const history = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n🌸 Kai Supplement Coach — Test Chat");
console.log("Type your messages. Type 'quit' to exit.\n");

async function chat(input) {
  history.push({ role: "user", content: input });
  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM,
      messages: history,
    });
    const text = r.content[0]?.text || "(no response)";
    history.push({ role: "assistant", content: text });
    console.log("\nKai:", text, "\n");
  } catch (e) {
    console.log("\nError:", e.message, "\n");
  }
}

await chat("hi");

function prompt() {
  rl.question("You: ", async (input) => {
    if (!input || input.toLowerCase() === "quit") {
      console.log("\n💛 Bye!\n");
      process.exit(0);
    }
    await chat(input);
    prompt();
  });
}

prompt();
