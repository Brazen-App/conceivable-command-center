// Telegram Bot Webhook — receives messages from Telegram users, forwards to Kai
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const KAI_API_URL = "https://conceivable-quiz.vercel.app/api/kai-consult";

const KAI_INTRO = `Hi, I'm Kai -- your personal fertility coach. I was trained by Kirsten Karchmer, who spent 25 years helping over 10,000 couples conceive. I'm here for you 24/7.\n\nTo get started, what's your email so I can link your account?`;

// ── Telegram API helpers ──────────────────────────────────────────────

async function sendTelegramMessage(chatId: number | string, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

async function sendTelegramTyping(chatId: number | string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  });
}

async function getTelegramFile(fileId: string): Promise<{ base64: string; mediaType: string } | null> {
  try {
    const fileRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileData = await fileRes.json();
    if (!fileData.ok) return null;

    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const imageRes = await fetch(downloadUrl);
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    const ext = filePath.split(".").pop()?.toLowerCase() || "png";
    const mediaType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;

    return { base64, mediaType };
  } catch {
    return null;
  }
}

// ── SiteConfig helpers ────────────────────────────────────────────────

async function getEmailForChatId(chatId: string): Promise<string | null> {
  const record = await prisma.siteConfig.findUnique({
    where: { key: `telegram_${chatId}` },
  });
  return record?.value || null;
}

async function linkAccount(chatId: string, email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  // Store both directions for fast lookup
  await prisma.$transaction([
    prisma.siteConfig.upsert({
      where: { key: `telegram_${chatId}` },
      update: { value: normalizedEmail },
      create: { key: `telegram_${chatId}`, value: normalizedEmail },
    }),
    prisma.siteConfig.upsert({
      where: { key: `telegram_email_${normalizedEmail}` },
      update: { value: chatId },
      create: { key: `telegram_email_${normalizedEmail}`, value: chatId },
    }),
  ]);
}

// ── Conversation history (stored in SiteConfig as JSON) ───────────────

async function getHistory(chatId: string): Promise<Array<{ role: string; content: string }>> {
  const record = await prisma.siteConfig.findUnique({
    where: { key: `telegram_history_${chatId}` },
  });
  if (!record?.value) return [];
  try {
    return JSON.parse(record.value);
  } catch {
    return [];
  }
}

async function saveHistory(chatId: string, history: Array<{ role: string; content: string }>) {
  // Keep last 30 messages to stay within reasonable size
  const trimmed = history.slice(-30);
  await prisma.siteConfig.upsert({
    where: { key: `telegram_history_${chatId}` },
    update: { value: JSON.stringify(trimmed) },
    create: { key: `telegram_history_${chatId}`, value: JSON.stringify(trimmed) },
  });
}

// ── Strip Kai's special formatting for Telegram ──────────────────────

function cleanForTelegram(text: string): string {
  // Remove [BUTTONS]...[/BUTTONS] blocks but keep the button labels as a list
  let cleaned = text.replace(/\[BUTTONS\]\n?([\s\S]*?)\[\/BUTTONS\]/g, (_match, buttons: string) => {
    const labels = buttons
      .trim()
      .split("\n")
      .filter((l: string) => l.trim())
      .map((l: string, i: number) => `${i + 1}. ${l.trim()}`)
      .join("\n");
    return labels ? `\n${labels}` : "";
  });

  // Remove pack blocks but keep the content
  cleaned = cleaned.replace(/\[PACK_START\]\n?/g, "\n---\n");
  cleaned = cleaned.replace(/\[PACK_END\]\n?/g, "\n---\n");
  cleaned = cleaned.replace(/\[MALE_PACK_START\]\n?/g, "\n--- His Pack ---\n");
  cleaned = cleaned.replace(/\[MALE_PACK_END\]\n?/g, "\n---\n");

  // Convert SUPP|KEY|reason to readable format
  cleaned = cleaned.replace(/SUPP\|([A-Z_]+)\|(.+)/g, "- $1: $2");

  // Remove markdown bold/headers (Kai shouldn't use them but just in case)
  cleaned = cleaned.replace(/#{1,3}\s/g, "");
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1");

  return cleaned.trim();
}

// ── Detect if user is sending an email to link ───────────────────────

function extractEmail(text: string): string | null {
  const match = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return match ? match[0] : null;
}

// ── Detect awaiting-link state ───────────────────────────────────────

async function isAwaitingLink(chatId: string): Promise<boolean> {
  const record = await prisma.siteConfig.findUnique({
    where: { key: `telegram_awaiting_link_${chatId}` },
  });
  return record?.value === "true";
}

async function setAwaitingLink(chatId: string, awaiting: boolean) {
  if (awaiting) {
    await prisma.siteConfig.upsert({
      where: { key: `telegram_awaiting_link_${chatId}` },
      update: { value: "true" },
      create: { key: `telegram_awaiting_link_${chatId}`, value: "true" },
    });
  } else {
    await prisma.siteConfig.deleteMany({
      where: { key: `telegram_awaiting_link_${chatId}` },
    });
  }
}

// ── Main webhook handler ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const msg = body.message;
    if (!msg) return NextResponse.json({ ok: true });

    const chatId = String(msg.chat.id);
    const firstName = msg.from?.first_name || "";
    const text = msg.text?.trim() || "";

    // Handle /start command
    if (text === "/start") {
      await setAwaitingLink(chatId, true);
      await sendTelegramMessage(chatId, KAI_INTRO);
      return NextResponse.json({ ok: true });
    }

    // Handle /help command
    if (text === "/help") {
      await sendTelegramMessage(
        chatId,
        "Here's what I can help with:\n\n" +
          "- Ask me anything about fertility, cycles, supplements, or your health\n" +
          "- Send me a photo of your BBT chart for analysis\n" +
          "- Send me a photo of your fertility monitor readings\n" +
          "- Send me a photo of your prenatal vitamin label\n" +
          "- Send me a tongue photo for TCM analysis\n\n" +
          "Just type your question or send an image!"
      );
      return NextResponse.json({ ok: true });
    }

    // Handle /unlink command
    if (text === "/unlink") {
      const email = await getEmailForChatId(chatId);
      if (email) {
        await prisma.$transaction([
          prisma.siteConfig.deleteMany({ where: { key: `telegram_${chatId}` } }),
          prisma.siteConfig.deleteMany({ where: { key: `telegram_email_${email}` } }),
          prisma.siteConfig.deleteMany({ where: { key: `telegram_history_${chatId}` } }),
        ]);
        await sendTelegramMessage(chatId, "Account unlinked. Send /start to link a new account.");
      } else {
        await sendTelegramMessage(chatId, "No account linked. Send /start to get started.");
      }
      return NextResponse.json({ ok: true });
    }

    // Check if we're waiting for an email to link
    const awaiting = await isAwaitingLink(chatId);
    if (awaiting) {
      const email = extractEmail(text);
      if (email) {
        await linkAccount(chatId, email);
        await setAwaitingLink(chatId, false);
        await sendTelegramMessage(
          chatId,
          `Got it! I've linked your account to ${email}.\n\nNow, tell me -- what brought you here today? Are you trying to conceive, or do you have questions about your fertility health?`
        );
        return NextResponse.json({ ok: true });
      } else {
        await sendTelegramMessage(
          chatId,
          "Hmm, I didn't catch an email address in that. Could you type your email so I can link your account? (e.g. jane@example.com)"
        );
        return NextResponse.json({ ok: true });
      }
    }

    // Check if account is linked
    const email = await getEmailForChatId(chatId);
    if (!email) {
      await setAwaitingLink(chatId, true);
      await sendTelegramMessage(
        chatId,
        "Hey there! I don't have your account linked yet. What's your email address so I can connect everything?"
      );
      return NextResponse.json({ ok: true });
    }

    // Show typing indicator
    await sendTelegramTyping(chatId);

    // Get conversation history
    const history = await getHistory(chatId);

    // Handle photo/image uploads
    let imageData: string | undefined;
    let imageType: string | undefined;
    let userMessage = text;

    if (msg.photo && msg.photo.length > 0) {
      // Get the largest photo
      const photo = msg.photo[msg.photo.length - 1];
      const fileResult = await getTelegramFile(photo.file_id);

      if (fileResult) {
        imageData = `data:${fileResult.mediaType};base64,${fileResult.base64}`;

        // Try to detect image type from caption or message
        const caption = (msg.caption || text || "").toLowerCase();
        if (caption.includes("bbt") || caption.includes("temp") || caption.includes("chart")) {
          imageType = "bbt";
        } else if (caption.includes("monitor") || caption.includes("inito") || caption.includes("mira")) {
          imageType = "monitor";
        } else if (caption.includes("tongue")) {
          imageType = "tongue";
        } else if (caption.includes("prenatal") || caption.includes("vitamin") || caption.includes("label") || caption.includes("supplement")) {
          imageType = "prenatal";
        } else {
          imageType = "bbt"; // default to BBT analysis
        }

        userMessage = msg.caption || text || "Please analyze this image for me.";
      }
    }

    if (!userMessage && !imageData) {
      return NextResponse.json({ ok: true });
    }

    // Time-of-day context for Kai (uses user's likely timezone — TODO: store per-user TZ)
    const hour = new Date().getHours();
    const timeOfDay =
      hour < 5 ? "late_night" :
      hour < 9 ? "morning" :
      hour < 12 ? "late_morning" :
      hour < 17 ? "afternoon" :
      hour < 21 ? "evening" : "night";

    // Call Kai API
    const kaiPayload: Record<string, unknown> = {
      message: userMessage,
      name: firstName,
      email,
      history,
      sessionId: `telegram_${chatId}`,
      mode: "subscriber",
      channel: "telegram",      // ← new: tells Kai to use texting register + multi-message format
      timeOfDay,                 // ← new: morning, late_night, etc.
    };

    if (imageData) {
      kaiPayload.imageData = imageData;
      kaiPayload.imageType = imageType;
    }

    const kaiRes = await fetch(KAI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kaiPayload),
    });

    const kaiData = await kaiRes.json();
    const kaiResponse = kaiData.response || "Sorry, I had a hiccup. Try again?";

    // Clean response for Telegram
    const cleanedResponse = cleanForTelegram(kaiResponse);

    // Save history
    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: kaiResponse });
    await saveHistory(chatId, history);

    // Split on [BREAK] markers (Kai uses these for multi-message texting style)
    // Then enforce Telegram's 4096 char limit per message
    const breakChunks = cleanedResponse
      .split(/\[BREAK\]/i)
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const finalChunks: string[] = [];
    for (const chunk of breakChunks) {
      if (chunk.length <= 4096) {
        finalChunks.push(chunk);
      } else {
        // Long chunk — split on paragraph boundaries
        let current = "";
        for (const para of chunk.split("\n\n")) {
          if ((current + "\n\n" + para).length > 4000) {
            if (current) finalChunks.push(current.trim());
            current = para;
          } else {
            current = current ? current + "\n\n" + para : para;
          }
        }
        if (current) finalChunks.push(current.trim());
      }
    }

    // Send each chunk with a typing indicator + small delay between
    // (feels like a real person texting back)
    for (let i = 0; i < finalChunks.length; i++) {
      if (i > 0) {
        await sendTelegramTyping(chatId);
        // Pause length scales with previous chunk length, capped at 2s
        const prevLen = finalChunks[i - 1].length;
        const delay = Math.min(2000, Math.max(600, prevLen * 25));
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await sendTelegramMessage(chatId, finalChunks[i]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    // Always return 200 to Telegram so it doesn't retry
    return NextResponse.json({ ok: true });
  }
}

// Telegram sends a GET to verify the webhook URL
export async function GET() {
  return NextResponse.json({ status: "Kai Telegram bot webhook is active" });
}
