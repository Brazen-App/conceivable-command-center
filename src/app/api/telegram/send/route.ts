// Proactive Telegram messaging — send messages TO users
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const { email, message, chatId: directChatId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    if (!email && !directChatId) {
      return NextResponse.json(
        { error: "Either email or chatId is required" },
        { status: 400 }
      );
    }

    // Resolve chat ID
    let chatId = directChatId;
    if (!chatId && email) {
      const normalizedEmail = email.toLowerCase().trim();
      const record = await prisma.siteConfig.findUnique({
        where: { key: `telegram_email_${normalizedEmail}` },
      });
      if (!record?.value) {
        return NextResponse.json(
          { error: "No Telegram account linked for this email" },
          { status: 404 }
        );
      }
      chatId = record.value;
    }

    // Send via Telegram Bot API
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      console.error("Telegram send error:", telegramData);
      return NextResponse.json(
        { error: "Failed to send Telegram message", details: telegramData.description },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chatId,
      messageId: telegramData.result?.message_id,
    });
  } catch (error) {
    console.error("Telegram send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
